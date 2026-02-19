import React, { useState, useEffect } from 'react';
import { Play, AlertCircle, CheckCircle, UserX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { runAllocation } from '../services/allocationService';

export const Alocacoes = () => {
    const [type, setType] = useState<'tutor' | 'elective' | 'club'>('elective');
    const [allocations, setAllocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [summary, setSummary] = useState<any>(null);

    useEffect(() => {
        fetchAllocations();
    }, [type]);

    const fetchAllocations = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('allocations')
            .select('*, students(name), items(name)')
            .eq('type', type);

        setAllocations(data || []);
        setLoading(false);
    };

    const handleRunAllocation = async () => {
        if (!confirm(`Deseja iniciar o processamento automático de alocação para ${type}? Isso substituirá alocações existentes para este tipo.`)) return;

        setProcessing(true);
        const result = await runAllocation(type);
        setSummary(result);
        fetchAllocations();
        setProcessing(false);
    };

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                        Processamento de <span style={{ color: 'var(--primary)' }}>Alocações</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gerencie a distribuição automática dos alunos</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        style={{ minWidth: '160px' }}
                    >
                        <option value="tutor">Setor: Tutoria</option>
                        <option value="elective">Setor: Eletivas</option>
                        <option value="club">Setor: Clubes</option>
                    </select>
                    <button
                        className="btn btn-primary"
                        onClick={handleRunAllocation}
                        disabled={processing}
                        style={{ minWidth: '180px' }}
                    >
                        {processing ? 'Processando...' : <><Play size={18} /> Rodar Alocação</>}
                    </button>
                </div>
            </header>

            {summary && (
                <div className="card" style={{
                    padding: '24px',
                    marginBottom: 'var(--spacing-xl)',
                    borderLeft: '4px solid #10b981',
                    background: 'rgba(16, 185, 129, 0.02)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={18} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Distribuição Concluída</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ padding: '15px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Alocados</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{summary.allocatedCount}</p>
                        </div>
                        <div style={{ padding: '15px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Sem Vagas</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ef4444' }}>{summary.unallocatedCount}</p>
                        </div>
                    </div>

                    {summary.unallocatedCount > 0 && (
                        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontSize: '0.875rem', fontWeight: '700', marginBottom: '8px' }}>
                                <UserX size={16} /> LISTA DE ESPERA (RA):
                            </div>
                            <p style={{ fontSize: '0.8125rem', color: '#dc2626', lineHeight: '1.6', fontFamily: 'monospace' }}>{summary.unallocatedList.join(', ')}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aluno</th>
                            <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RAsp</th>
                            <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Setor / Atividade</th>
                            <th style={{ padding: '18px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Processando dados...</td></tr>
                        ) : allocations.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '80px 24px', textAlign: 'center' }}>
                                    <div style={{ opacity: 0.3, marginBottom: '15px' }}><AlertCircle size={48} style={{ margin: '0 auto' }} /></div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Nenhuma alocação encontrada para este setor.</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Clique em "Rodar Alocação" para processar as solicitações.</p>
                                </td>
                            </tr>
                        ) : (
                            allocations.map(aloc => (
                                <tr key={aloc.id} className="table-row">
                                    <td style={{ padding: '18px 24px' }}>
                                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{aloc.students?.name}</div>
                                    </td>
                                    <td style={{ padding: '18px 24px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{aloc.student_ra}</td>
                                    <td style={{ padding: '18px 24px' }}>
                                        <span style={{
                                            padding: '6px 12px',
                                            background: 'var(--primary-light)',
                                            color: 'var(--primary)',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.02em'
                                        }}>
                                            {aloc.items?.name}
                                        </span>
                                    </td>
                                    <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                                        <button className="btn-ghost" style={{ fontSize: '0.8125rem', fontWeight: '600' }}>Remanejar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
