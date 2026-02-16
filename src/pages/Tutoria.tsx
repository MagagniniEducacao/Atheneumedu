import React, { useState } from 'react';
import { Users, BookOpen, Calendar, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Tutoria: React.FC = () => {
    const { profile } = useAuth();
    const [tutorias, setTutorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    return (
        <div style={{ padding: '40px' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #dc2626 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Tutoria
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                        Gerencie grupos de tutoria e acompanhamento de alunos
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, #dc2626 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Users size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                Grupos de Tutoria
                            </p>
                            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                                {tutorias.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <UserCheck size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                Alunos Atendidos
                            </p>
                            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                                0
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tutoria Content */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Grupos de Tutoria</h2>
                </div>

                <div style={{ padding: '24px' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                            Carregando grupos de tutoria...
                        </p>
                    ) : tutorias.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: 'var(--text-muted)'
                        }}>
                            <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                            <p style={{ fontSize: '16px', marginBottom: '8px' }}>Nenhum grupo de tutoria cadastrado</p>
                            <p style={{ fontSize: '14px' }}>Configure os grupos de tutoria para começar o acompanhamento</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {tutorias.map((tutoria) => (
                                <div
                                    key={tutoria.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            background: 'linear-gradient(135deg, var(--primary) 0%, #dc2626 100%)',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Users size={20} color="white" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>
                                                {tutoria.name}
                                            </p>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                {tutoria.students_count} alunos
                                            </p>
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
