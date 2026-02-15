import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { importStudents } from '../services/importService';

interface ImportStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportSuccess: () => void;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleImport = async () => {
        if (!file) return;
        setImporting(true);
        try {
            const res = await importStudents(file);
            setResult(res);
            if (res.success > 0) {
                onImportSuccess();
            }
        } catch (err) {
            setResult({ success: 0, errors: ['Erro ao ler arquivo. Verifique se é uma planilha válida.'] });
        }
        setImporting(false);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="glass" style={{ width: '500px', maxWidth: '90%', padding: '30px', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--text-muted)' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '20px' }}>Importar Alunos da SED</h2>

                <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px' }}>
                    Selecione a planilha da SED contendo as colunas: Nome (B), RA (C), Dígito (D) e Data de Nascimento (E).
                </p>

                {!result ? (
                    <div style={{
                        border: '2px dashed var(--border)',
                        borderRadius: '12px',
                        padding: '40px',
                        textAlign: 'center',
                        marginBottom: '20px'
                    }}>
                        <Upload size={40} style={{ color: 'var(--primary)', marginBottom: '15px' }} />
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                            <span className="btn-primary" style={{ display: 'inline-block' }}>
                                {file ? file.name : 'Selecionar Arquivo'}
                            </span>
                        </label>
                    </div>
                ) : (
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        {result.success > 0 ? (
                            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <CheckCircle size={24} />
                                <span>{result.success} alunos importados com sucesso!</span>
                            </div>
                        ) : (
                            <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <AlertCircle size={24} />
                                <span>Erro na importação.</span>
                            </div>
                        )}
                        {result.errors.length > 0 && (
                            <ul style={{ marginTop: '10px', textAlign: 'left', fontSize: '12px', color: '#ef4444' }}>
                                {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid var(--border)', background: 'none', borderRadius: '8px' }}>
                        {result ? 'Fechar' : 'Cancelar'}
                    </button>
                    {!result && (
                        <button
                            className="btn-primary"
                            disabled={!file || importing}
                            onClick={handleImport}
                        >
                            {importing ? 'Processando...' : 'Iniciar Importação'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
