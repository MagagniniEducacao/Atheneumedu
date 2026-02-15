import React, { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ImportStudentsModal } from '../components/ImportStudentsModal';

export const Alunos = () => {
    const [alunos, setAlunos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    useEffect(() => {
        fetchAlunos();
    }, []);

    const fetchAlunos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching students:', error);
        } else {
            setAlunos(data || []);
        }
        setLoading(false);
    };

    const filteredAlunos = alunos.filter(aluno =>
        aluno.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.ra_sp.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="alunos-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Alunos</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        <Upload size={20} /> Importar SED
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={20} /> Novo Aluno
                    </button>
                </div>
            </header>

            <div className="glass" style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar aluno por nome ou RA..."
                        style={{
                            width: '100%',
                            padding: '10px 10px 10px 35px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text-main)'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Nome</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>RAsp</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Nascimento</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>Carregando...</td></tr>
                        ) : filteredAlunos.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>Nenhum aluno encontrado.</td></tr>
                        ) : (
                            filteredAlunos.map(aluno => (
                                <tr key={aluno.ra_sp} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '15px' }}>{aluno.name}</td>
                                    <td style={{ padding: '15px' }}>{aluno.ra_sp}</td>
                                    <td style={{ padding: '15px' }}>{aluno.birth_date}</td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ImportStudentsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={fetchAlunos}
            />
        </div>
    );
};
