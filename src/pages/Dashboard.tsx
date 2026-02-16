import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import {
    Users, BookOpen, Users2, Link as LinkIcon,
    CheckCircle, ShieldAlert, ExternalLink, Copy
} from 'lucide-react';

export const Dashboard = () => {
    const { profile } = useAuth();
    const [stats, setStats] = useState({
        students: 0,
        electives: 0,
        clubs: 0,
        choices: 0
    });
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile) {
            fetchData();
            fetchSettings();
        }
    }, [profile]);

    const fetchData = async () => {
        if (!profile?.school_id) return;
        const schoolId = profile.school_id;

        const [
            { count: sCount },
            { count: eCount },
            { count: cCount },
            { count: chCount }
        ] = await Promise.all([
            supabase.from('students').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
            supabase.from('items').select('*', { count: 'exact', head: true }).eq('type', 'elective').eq('school_id', schoolId),
            supabase.from('items').select('*', { count: 'exact', head: true }).eq('type', 'club').eq('school_id', schoolId),
            supabase.from('choices').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
        ]);

        setStats({
            students: sCount || 0,
            electives: eCount || 0,
            clubs: cCount || 0,
            choices: chCount || 0
        });
        setLoading(false);
    };

    const fetchSettings = async () => {
        if (!profile?.school_id) return;
        const { data } = await supabase
            .from('settings')
            .select('*')
            .eq('school_id', profile.school_id);
        if (data) setSettings(data);
    };

    const toggleLink = async (key: string, currentValue: boolean) => {
        if (!profile?.school_id) return;
        const { error } = await supabase
            .from('settings')
            .update({ value: !currentValue, updated_at: new Date() })
            .eq('key', key)
            .eq('school_id', profile.school_id);

        if (!error) fetchSettings();
    };

    const copyLink = () => {
        if (!profile?.schools?.slug) return;
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/escolha/${profile.schools.slug}`;
        navigator.clipboard.writeText(link);
        alert('Link da escola copiado!');
    };

    if (loading) return <div>Carregando painel...</div>;

    return (
        <div>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Olá, Gestor</h1>
                <p style={{ color: 'var(--text-muted)' }}>Bem-vindo ao painel da <strong>{profile?.schools?.name || 'sua escola'}</strong>.</p>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <StatCard icon={<Users color="#6366f1" />} label="Total de Alunos" value={stats.students} />
                <StatCard icon={<BookOpen color="#10b981" />} label="Eletivas Ativas" value={stats.electives} />
                <StatCard icon={<Users2 color="#f59e0b" />} label="Clubes Juvenis" value={stats.clubs} />
                <StatCard icon={<CheckCircle color="#ec4899" />} label="Escolhas Feitas" value={stats.choices} />
            </div>

            <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>Gestão de Inscrições</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {[
                    { key: 'tutor_active', label: 'Inscrições para Tutoria' },
                    { key: 'elective_active', label: 'Inscrições para Eletivas' },
                    { key: 'club_active', label: 'Inscrições para Clubes' },
                ].map((link) => {
                    const setting = settings.find(s => s.key === link.key);
                    const isActive = setting?.value || false;

                    return (
                        <div key={link.key} className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '18px' }}>{link.label}</h3>
                                <div
                                    onClick={() => toggleLink(link.key, isActive)}
                                    style={{
                                        width: '45px', height: '24px', background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '20px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{
                                        width: '18px', height: '18px', background: 'white', borderRadius: '50%',
                                        position: 'absolute', top: '3px', left: isActive ? '24px' : '3px', transition: 'all 0.3s ease'
                                    }}></div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button className="glass" style={{ flex: 1, padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={copyLink}>
                                    <Copy size={14} /> Link Único
                                </button>
                                <a
                                    href={`/escolha/${profile?.schools?.slug || ''}`}
                                    target="_blank"
                                    className="glass"
                                    style={{ flex: 1, padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}
                                >
                                    <ExternalLink size={14} /> Visualizar
                                </a>
                            </div>

                            {!isActive && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '12px' }}>
                                    <ShieldAlert size={14} /> Desativado.
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }: { icon: any, label: string, value: number }) => (
    <div className="glass" style={{ padding: '25px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>{icon}</div>
        <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>{label}</p>
            <h3 style={{ fontSize: '24px', margin: '5px 0 0' }}>{value}</h3>
        </div>
    </div>
);
