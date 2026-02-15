import React, { useState, useEffect } from 'react';
import { Share2, Power, PowerOff, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Dashboard = () => {
    const [settings, setSettings] = useState<any[]>([]);
    const [counts, setCounts] = useState({ students: 0, items: 0, choices: 0 });

    useEffect(() => {
        fetchSettings();
        fetchCounts();
    }, []);

    const fetchSettings = async () => {
        const { data } = await supabase.from('settings').select('*');
        if (data) setSettings(data);
    };

    const fetchCounts = async () => {
        const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
        const { count: itemCount } = await supabase.from('items').select('*', { count: 'exact', head: true });
        const { count: choiceCount } = await supabase.from('choices').select('*', { count: 'exact', head: true });
        setCounts({
            students: studentCount || 0,
            items: itemCount || 0,
            choices: choiceCount || 0
        });
    };

    const toggleLink = async (key: string, currentValue: boolean) => {
        const { error } = await supabase
            .from('settings')
            .update({ value: !currentValue, updated_at: new Date() })
            .eq('key', key);

        if (!error) fetchSettings();
    };

    const getLink = (type: string) => {
        return `${window.location.origin}/escolha/${type}`;
    };

    const copyLink = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Link copiado!');
    };

    const renderLinkItem = (key: string, label: string, type: string) => {
        const setting = settings.find(s => s.key === key);
        const active = setting?.value || false;

        return (
            <div className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>{label}</h4>
                    <button
                        onClick={() => toggleLink(key, active)}
                        style={{
                            background: active ? '#10b981' : '#6b7280',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px'
                        }}
                    >
                        {active ? <Power size={14} /> : <PowerOff size={14} />}
                        {active ? 'Ativado' : 'Desativado'}
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        readOnly
                        value={getLink(type)}
                        className="glass"
                        style={{ flex: 1, padding: '8px', fontSize: '12px', background: 'rgba(0,0,0,0.02)' }}
                    />
                    <button
                        onClick={() => copyLink(getLink(type))}
                        style={{ padding: '8px', border: '1px solid var(--border)', background: 'none', borderRadius: '8px' }}
                    >
                        <Share2 size={16} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 style={{ marginBottom: '30px' }}>Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="glass" style={{ padding: '25px', textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total de Alunos</span>
                    <h2 style={{ fontSize: '32px', marginTop: '10px' }}>{counts.students}</h2>
                </div>
                <div className="glass" style={{ padding: '25px', textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Itens Cadastrados</span>
                    <h2 style={{ fontSize: '32px', marginTop: '10px' }}>{counts.items}</h2>
                </div>
                <div className="glass" style={{ padding: '25px', textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Escolhas Realizadas</span>
                    <h2 style={{ fontSize: '32px', marginTop: '10px' }}>{counts.choices}</h2>
                </div>
            </div>

            <h2 style={{ marginBottom: '20px' }}>Controle de Links</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {renderLinkItem('tutor_active', 'Escolha de Tutor', 'tutor')}
                {renderLinkItem('elective_active', 'Escolha de Eletiva', 'elective')}
                {renderLinkItem('club_active', 'Escolha de Clube Juvenil', 'club')}
            </div>
        </div>
    );
};
