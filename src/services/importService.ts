import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';

export interface StudentImport {
    name: string;
    ra_sp: string;
    birth_date: string;
}

export const importStudents = async (file: File) => {
    return new Promise<{ success: number; errors: string[] }>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // SED spreadsheet columns:
                // B: Name (index 1)
                // C: RA (index 2)
                // D: Digit (index 3)
                // E: Birth Date (index 4)

                const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
                const students: StudentImport[] = [];
                const errors: string[] = [];

                // Skip headers (assuming row 1 or 2, let's look for data)
                jsonData.forEach((row, index) => {
                    if (index === 0) return; // Skip standard header

                    const name = row[1];
                    const ra = row[2];
                    const digit = row[3];
                    let birthDate = row[4];

                    if (name && ra && digit && birthDate) {
                        const ra_sp = `${ra}${digit}sp`.toLowerCase();

                        // Format date if it's a number (Excel date)
                        if (typeof birthDate === 'number') {
                            const date = XLSX.utils.format_cell({ v: birthDate, t: 'd' });
                            birthDate = date;
                        }

                        students.push({
                            name: String(name).trim(),
                            ra_sp,
                            birth_date: String(birthDate).trim(),
                        });
                    }
                });

                if (students.length === 0) {
                    return resolve({ success: 0, errors: ['Nenhum aluno encontrado na planilha. Verifique o formato SED.'] });
                }

                // Batch upsert to Supabase
                const { error } = await supabase
                    .from('students')
                    .upsert(
                        students.map(s => ({
                            ra_sp: s.ra_sp,
                            name: s.name,
                            birth_date: s.birth_date,
                        })),
                        { onConflict: 'ra_sp' }
                    );

                if (error) {
                    return resolve({ success: 0, errors: [error.message] });
                }

                resolve({ success: students.length, errors });
            } catch (err) {
                reject(err);
            }
        };

        reader.readAsArrayBuffer(file);
    });
};
