import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, Edit2, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Escolas: React.FC = () => {
    const { profile } = useAuth();
    const [schools, setSchools] = useState<any[]>([]);
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
                        Gerenciar Escolas
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                        Cadastre e gerencie as escolas do sistema
                    </p>
                </div>

                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(185, 28, 28, 0.3)'
                }}>
                    <Plus size={20} />
                    Nova Escola
                </button>
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
                            <Building2 size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                Total de Escolas
                            </p>
                            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                                {schools.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schools List */}
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
                    <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Escolas Cadastradas</h2>
                </div>

                <div style={{ padding: '24px' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                            Carregando escolas...
                        </p>
                    ) : schools.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: 'var(--text-muted)'
                        }}>
                            <GraduationCap size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                            <p style={{ fontSize: '16px', marginBottom: '8px' }}>Nenhuma escola cadastrada</p>
                            <p style={{ fontSize: '14px' }}>Clique em "Nova Escola" para começar</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {schools.map((school) => (
                                <div
                                    key={school.id}
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
                                            <GraduationCap size={20} color="white" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>
                                                {school.name}
                                            </p>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                Slug: {school.slug}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{
                                            padding: '8px 12px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            color: 'var(--text-main)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <Edit2 size={16} />
                                            Editar
                                        </button>
                                        <button style={{
                                            padding: '8px 12px',
                                            background: 'rgba(220, 38, 38, 0.1)',
                                            border: '1px solid rgba(220, 38, 38, 0.3)',
                                            borderRadius: '8px',
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <Trash2 size={16} />
                                            Excluir
                                        </button>
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
