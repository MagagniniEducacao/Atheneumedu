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
            background: 'rgba(2, 6, 23, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            backdropFilter: 'blur(12px)'
        }}>
            <div className="card" style={{ width: '550px', maxWidth: '100%', padding: '40px', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', right: '25px', top: '25px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
                >
                    <X size={20} />
                </button>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>Importar Alunos</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                        Selecione a planilha exportada da SED (Secretaria Escolar Digital).<br />
                        <strong>Formato esperado:</strong> Nome (B), RA (C), Dígito (D) e Nascimento (E).
                    </p>
                </div>

                {!result ? (
                    <div style={{
                        border: '2px dashed var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--bg-main)',
                        padding: '50px 20px',
                        textAlign: 'center',
                        marginBottom: '30px',
                        transition: 'var(--transition)'
                    }}>
                        <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Upload size={32} />
                        </div>
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                                {file ? file.name : 'Clique para selecionar'}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                ou arraste o arquivo aqui (XLSX, XLS ou CSV)
                            </div>
                        </label>
                    </div>
                ) : (
                    <div style={{
                        marginBottom: '30px',
                        padding: '24px',
                        borderRadius: 'var(--radius-md)',
                        background: result.success > 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                        border: result.success > 0 ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {result.success > 0 ? (
                            <div style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' }}>
                                <div style={{ background: '#10b981', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle size={18} />
                                </div>
                                <span>{result.success} alunos importados com sucesso!</span>
                            </div>
                        ) : (
                            <div style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' }}>
                                <AlertCircle size={24} />
                                <span>Ops! Não foi possível realizar a importação.</span>
                            </div>
                        )}
                        {result.errors.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>Detalhes do processamento:</div>
                                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.875rem', color: '#dc2626', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn btn-secondary">
                        {result ? 'Fechar' : 'Cancelar'}
                    </button>
                    {!result && (
                        <button
                            className="btn btn-primary"
                            disabled={!file || importing}
                            onClick={handleImport}
                            style={{ minWidth: '180px' }}
                        >
                            {importing ? 'Processando dados...' : 'Iniciar Importação'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
