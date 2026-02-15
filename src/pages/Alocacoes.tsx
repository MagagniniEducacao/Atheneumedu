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
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Alocações</h1>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <select
                        className="glass"
                        style={{ padding: '10px 15px' }}
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                    >
                        <option value="tutor">Tutoria</option>
                        <option value="elective">Eletivas</option>
                        <option value="club">Clube Juvenil</option>
                    </select>
                    <button
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={handleRunAllocation}
                        disabled={processing}
                    >
                        <Play size={20} /> {processing ? 'Processando...' : 'Rodar Alocação'}
                    </button>
                </div>
            </header>

            {summary && (
                <div className="glass" style={{ padding: '20px', marginBottom: '30px', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <CheckCircle color="#10b981" />
                        <h3 style={{ margin: 0 }}>Processamento Concluído</h3>
                    </div>
                    <p style={{ fontSize: '14px' }}>
                        Alocados: <strong>{summary.allocatedCount}</strong> |
                        Sem Vaga: <strong style={{ color: '#ef4444' }}>{summary.unallocatedCount}</strong>
                    </p>
                    {summary.unallocatedCount > 0 && (
                        <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>
                                <UserX size={14} /> Alunos sem vaga (RA):
                            </div>
                            <p style={{ fontSize: '12px', marginTop: '5px' }}>{summary.unallocatedList.join(', ')}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Aluno</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>RAsp</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Alocado Em</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>Carregando...</td></tr>
                        ) : allocations.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>Nenhuma alocação realizada para este tipo.</td></tr>
                        ) : (
                            allocations.map(aloc => (
                                <tr key={aloc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '15px' }}>{aloc.students?.name}</td>
                                    <td style={{ padding: '15px' }}>{aloc.student_ra}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            background: 'rgba(0,119,255,0.1)',
                                            color: 'var(--primary)',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            fontWeight: 500
                                        }}>
                                            {aloc.items?.name}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>Mudar</button>
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
