import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, User } from 'lucide-react';

interface LoginProps {
    onLogin: (student: any) => void;
}

export const StudentLogin: React.FC<LoginProps> = ({ onLogin }) => {
    const [ra, setRa] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Custom login logic: check if student exists with given RA and birth_date
        // In SED format, birth_date is DD/MM/YYYY. The password is DDMMYYYY@Sp.

        const { data: student, error: fetchError } = await supabase
            .from('students')
            .select('*')
            .eq('ra_sp', ra.trim().toLowerCase())
            .single();

        if (fetchError || !student) {
            setError('RA não encontrado. Verifique se digitou corretamente.');
            setLoading(false);
            return;
        }

        // Process birth_date for password comparison
        // birth_date format in DB is YYYY-MM-DD or DD/MM/YYYY depending on import
        const cleanDate = student.birth_date.replace(/\D/g, ''); // 15032009
        const expectedPass = `${cleanDate}@Sp`;

        if (pass === expectedPass) {
            onLogin(student);
        } else {
            setError('Senha incorreta. A senha padrão é sua Data de Nascimento + @Sp (ex: 15032009@Sp)');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px' }} className="glass">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                    <User color="white" size={30} />
                </div>
                <h2>Área do Aluno</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Acesse usando seu RAsp e senha padrão.</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Seu RAsp (com dígito e 'sp')</label>
                    <input
                        type="text"
                        className="glass"
                        placeholder="Ex: 123456789xsp"
                        style={{ width: '100%', padding: '12px', background: 'transparent' }}
                        value={ra}
                        onChange={e => setRa(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Senha (DataNasc@Sp)</label>
                    <input
                        type="password"
                        className="glass"
                        placeholder="Ex: 15032009@Sp"
                        style={{ width: '100%', padding: '12px', background: 'transparent' }}
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        required
                    />
                </div>

                {error && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}>
                    <LogIn size={20} /> {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
};
