import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronUp, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CurtainBlock = ({ title, children, subtitle }: { title: string, children: React.ReactNode, subtitle?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="glass" style={{ marginBottom: '15px', overflow: 'hidden' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                }}
            >
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{title}</h3>
                    {subtitle && <p style={{ margin: '5px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{subtitle}</p>}
                </div>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ borderTop: '1px solid var(--border)', overflow: 'hidden' }}
                    >
                        <div style={{ padding: '20px' }}>
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
        <div>
            <h1 style={{ marginBottom: '30px' }}>Relatórios de Atividades</h1>

            <div className="glass" style={{ display: 'flex', gap: '10px', padding: '10px', marginBottom: '30px' }}>
                <button className={type === 'tutor' ? 'btn-primary' : 'glass'} onClick={() => setType('tutor')}>Tutorias</button>
                <button className={type === 'club' ? 'btn-primary' : 'glass'} onClick={() => setType('club')}>Clubes</button>
                <button className={type === 'elective' ? 'btn-primary' : 'glass'} onClick={() => setType('elective')}>Eletivas</button>
            </div>

            <div style={{ marginBottom: '50px' }}>
                {activities.map(act => (
                    <CurtainBlock
                        key={act.id}
                        title={act.name}
                        subtitle={`${act.teachers?.name || 'Sem professor'} | Vagas: ${act.studentList.length}/${act.slots}`}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '10px' }}>Aluno</th>
                                    <th style={{ padding: '10px' }}>RAsp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {act.studentList.map((s: any) => (
                                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '10px' }}>{s.students.name}</td>
                                        <td style={{ padding: '10px' }}>{s.students.ra_sp}</td>
                                    </tr>
                                ))}
                                {act.studentList.length === 0 && (
                                    <tr><td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum aluno alocado.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </CurtainBlock>
                ))}
            </div>

            <h2 style={{ marginBottom: '20px' }}>Relatório Geral (Prioridade)</h2>
            <div className="glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Aluno</th>
                            <th style={{ padding: '15px' }}>Status {type === 'elective' ? 'Eletiva' : type === 'club' ? 'Clube' : 'Tutoria'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generalReport.map(student => {
                            const allocation = student.allocations?.find((a: any) => a.type === type);
                            return (
                                <tr key={student.ra_sp} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '15px' }}>{student.name}</td>
                                    <td style={{ padding: '15px' }}>
                                        {allocation ? (
                                            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <CheckCircle size={14} /> Alocado
                                            </span>
                                        ) : (
                                            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Clock size={14} /> Lista de Espera / Não Escolheu
                                            </span>
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
