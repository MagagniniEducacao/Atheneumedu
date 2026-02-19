import React, { useState } from 'react';
import { Users, BookOpen, Calendar, UserCheck, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Tutoria: React.FC = () => {
    const { profile } = useAuth();
    const [tutorias, setTutorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <header style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                    Programa de <span style={{ color: 'var(--primary)' }}>Tutoria</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Acompanhamento pedagógico e socioemocional</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--primary) 0%, #dc2626 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(185, 28, 28, 0.2)' }}>
                        <Users size={28} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>GRUPOS ATIVOS</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>{tutorias.length}</p>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}>
                        <UserCheck size={28} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>ALUNOS TUTORADOS</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>0</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Grupos de Tutoria</h2>
                    <button className="btn btn-primary"><Plus size={18} /> Novo Grupo</button>
                </div>

                <div style={{ padding: '32px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
                    ) : tutorias.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                            <div style={{ opacity: 0.2, marginBottom: '20px' }}><BookOpen size={64} style={{ margin: '0 auto' }} /></div>
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Nenhum grupo de tutoria</h3>
                            <p>Inicie o programa de tutoria criando o primeiro grupo de acompanhamento.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                            {tutorias.map((tutoria) => (
                                <div key={tutoria.id} className="card" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '44px', height: '44px', background: 'var(--white)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                                            <Users size={22} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '700', marginBottom: '2px' }}>{tutoria.name}</p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{tutoria.students_count || 0} alunos matriculados</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
