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
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                        Gestão de <span style={{ color: 'var(--primary)' }}>Alunos</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Visualize e gerencie todos os estudantes matriculados</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        <Upload size={18} /> Importar SED
                    </button>
                    <button className="btn btn-primary">
                        <Plus size={18} /> Novo Aluno
                    </button>
                </div>
            </header>

            <div className="card" style={{ padding: '15px', marginBottom: 'var(--spacing-xl)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar aluno por nome ou RA..."
                        style={{
                            paddingLeft: '40px',
                            background: 'var(--bg-main)',
                            border: '1px solid var(--border)'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.875rem' }}>ESTUDANTE</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.875rem' }}>RA (SP)</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.875rem' }}>NASCIMENTO</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.875rem' }}>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando alunos...</td></tr>
                        ) : filteredAlunos.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum aluno encontrado.</td></tr>
                        ) : (
                            filteredAlunos.map(aluno => (
                                <tr key={aluno.ra_sp} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }} className="table-row-hover">
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', background: 'var(--gray-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                                {aluno.name.charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: '600' }}>{aluno.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{aluno.ra_sp}</td>
                                    <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>{aluno.birth_date}</td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        <button style={{ padding: '8px', background: 'transparent', color: '#ef4444', opacity: 0.6 }}>
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
