import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronUp, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CurtainBlock = ({ title, children, subtitle }: { title: string, children: React.ReactNode, subtitle?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="card" style={{ marginBottom: '16px', padding: 0, overflow: 'hidden', border: isOpen ? '1px solid var(--primary)' : '1px solid var(--border)', transition: 'var(--transition)' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isOpen ? 'var(--bg-main)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'var(--transition)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={20} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)' }}>{title}</h3>
                        {subtitle && <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '500' }}>{subtitle}</p>}
                    </div>
                </div>
                <div style={{ color: isOpen ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}
                    >
                        <div style={{ padding: '24px' }}>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Relatorios = () => {
    const [type, setType] = useState<'tutor' | 'club' | 'elective'>('elective');
    const [activities, setActivities] = useState<any[]>([]);
    const [generalReport, setGeneralReport] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [type]);

    const fetchData = async () => {
        setLoading(true);

        // Fetch Activities with student counts
        const { data: acts } = await supabase
            .from('items')
            .select('*, teachers(name), allocations(count)')
            .eq('type', type);

        // Fetch student list for each activity
        const actsWithStudents = await Promise.all((acts || []).map(async (act: any) => {
            const { data: students } = await supabase
                .from('allocations')
                .select('*, students(name, ra_sp)')
                .eq('item_id', act.id);
            return { ...act, studentList: students || [] };
        }));

        setActivities(actsWithStudents);

        // Fetch General Report (all students and their allocation status)
        const { data: students } = await supabase
            .from('students')
            .select('*, allocations(*)');

        setGeneralReport(students || []);
        setLoading(false);
    };

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <header style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                    Central de <span style={{ color: 'var(--primary)' }}>Relatórios</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Analise a ocupação e o engajamento dos alunos</p>
            </header>

            <div style={{
                display: 'inline-flex',
                background: 'var(--bg-card)',
                padding: '6px',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                marginBottom: 'var(--spacing-2xl)',
                gap: '4px'
            }}>
                <button
                    className={type === 'tutor' ? 'btn btn-primary' : 'btn btn-ghost'}
                    style={{ padding: '8px 24px', borderRadius: '10px' }}
                    onClick={() => setType('tutor')}
                >
                    Tutorias
                </button>
                <button
                    className={type === 'club' ? 'btn btn-primary' : 'btn btn-ghost'}
                    style={{ padding: '8px 24px', borderRadius: '10px' }}
                    onClick={() => setType('club')}
                >
                    Clubes
                </button>
                <button
                    className={type === 'elective' ? 'btn btn-primary' : 'btn btn-ghost'}
                    style={{ padding: '8px 24px', borderRadius: '10px' }}
                    onClick={() => setType('elective')}
                >
                    Eletivas
                </button>
            </div>

            <div style={{ marginBottom: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Relatório por Atividade</h2>
                </div>
                {activities.map(act => (
                    <CurtainBlock
                        key={act.id}
                        title={act.name}
                        subtitle={`${act.teachers?.name || 'Sem professor'} • ${act.studentList.length} de ${act.slots} vagas preenchidas`}
                    >
                        <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-main)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
                                        <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aluno</th>
                                        <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>RAsp / Identificador</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {act.studentList.map((s: any) => (
                                        <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '14px 20px', fontWeight: '600' }}>{s.students.name}</td>
                                            <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{s.students.ra_sp}</td>
                                        </tr>
                                    ))}
                                    {act.studentList.length === 0 && (
                                        <tr>
                                            <td colSpan={2} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                Nenhum aluno alocado nesta atividade até o momento.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CurtainBlock>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Relatório Geral (Prioridade)</h2>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aluno</th>
                            <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status {type === 'elective' ? 'Eletiva' : type === 'club' ? 'Clube' : 'Tutoria'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generalReport.map(student => {
                            const allocation = student.allocations?.find((a: any) => a.type === type);
                            return (
                                <tr key={student.ra_sp} className="table-row">
                                    <td style={{ padding: '18px 24px', fontWeight: '600' }}>{student.name}</td>
                                    <td style={{ padding: '18px 24px' }}>
                                        {allocation ? (
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: '#059669',
                                                fontSize: '0.8125rem',
                                                fontWeight: '700',
                                                background: 'rgba(5, 150, 105, 0.08)',
                                                padding: '4px 12px',
                                                borderRadius: '20px'
                                            }}>
                                                <CheckCircle size={14} /> ALOCADO
                                            </div>
                                        ) : (
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: '#ef4444',
                                                fontSize: '0.8125rem',
                                                fontWeight: '700',
                                                background: 'rgba(239, 68, 68, 0.08)',
                                                padding: '4px 12px',
                                                borderRadius: '20px'
                                            }}>
                                                <AlertCircle size={14} /> PENDENTE
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
