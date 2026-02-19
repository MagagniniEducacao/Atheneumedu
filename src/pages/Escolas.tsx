import React, { useState, useEffect } from 'react';
import { GraduationCap, Building2, CheckCircle, XCircle, ChevronRight, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Escolas: React.FC = () => {
    const [schools, setSchools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('schools')
            .select('*')
            .order('name');
        setSchools(data || []);
        setLoading(false);
    };

    const toggleSchoolStatus = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('schools')
            .update({ is_active: !currentStatus })
            .eq('id', id);

        if (!error) fetchSchools();
    };

    const filteredSchools = schools.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                        Rede de <span style={{ color: 'var(--primary)' }}>Escolas</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Monitoramento e controle de acesso institucional</p>
                </div>

                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar escola..."
                        style={{ paddingLeft: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={28} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL DE UNIDADES</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>{schools.length}</p>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>UNIDADES ATIVAS</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>{schools.filter(s => s.is_active).length}</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Visão Geral das Instituições</h2>
                </div>

                <div style={{ padding: '24px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Sincronizando com a base de dados...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                            {filteredSchools.map((school) => (
                                <div
                                    key={school.id}
                                    className="card"
                                    style={{
                                        background: 'var(--bg-main)',
                                        border: school.is_active ? '1px solid var(--border)' : '1px solid rgba(239, 68, 68, 0.2)',
                                        padding: '20px',
                                        transition: 'var(--transition)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', background: school.is_active ? 'var(--primary-light)' : 'rgba(0,0,0,0.05)', color: school.is_active ? 'var(--primary)' : 'var(--text-muted)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <GraduationCap size={24} />
                                        </div>
                                        <button
                                            onClick={() => toggleSchoolStatus(school.id, school.is_active)}
                                            style={{
                                                fontSize: '0.6875rem',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                background: school.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: school.is_active ? '#059669' : '#dc2626'
                                            }}
                                        >
                                            {school.is_active ? 'Ativada' : 'Bloqueada'}
                                        </button>
                                    </div>

                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '4px' }}>{school.name}</h3>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '20px' }}>ID: {school.slug}</p>

                                    <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {school.is_active ? <CheckCircle size={14} color="#059669" /> : <XCircle size={14} color="#dc2626" />}
                                            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: school.is_active ? '#059669' : '#dc2626' }}>
                                                {school.is_active ? 'Pronta para Ensino' : 'Acesso Interrompido'}
                                            </span>
                                        </div>
                                        <ChevronRight size={18} style={{ opacity: 0.3 }} />
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
