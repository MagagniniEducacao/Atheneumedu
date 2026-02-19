import React, { useState } from 'react';
import { Alunos } from './Alunos';
import { Professores } from './Professores';
import { Eletivas } from './Eletivas';
import { Clubes } from './Clubes';
import { Vagas } from './Vagas';
import { Users, GraduationCap, BookOpen, Users2, Settings as SettingsIcon } from 'lucide-react';

export const Configuracoes = () => {
    const [activeTab, setActiveTab] = useState('alunos');

    const tabs = [
        { id: 'alunos', label: 'Alunos', icon: <Users size={18} /> },
        { id: 'professores', label: 'Professores', icon: <GraduationCap size={18} /> },
        { id: 'tutorias', label: 'Tutorias', icon: <SettingsIcon size={18} /> },
        { id: 'clubes', label: 'Clubes', icon: <Users2 size={18} /> },
        { id: 'eletivas', label: 'Eletivas', icon: <BookOpen size={18} /> },
        { id: 'vagas', label: 'Gerenciar Vagas', icon: <SettingsIcon size={18} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'alunos': return <Alunos />;
            case 'professores': return <Professores />;
            case 'tutorias': return <h1>Em breve: Gestão de Tutorias</h1>;
            case 'clubes': return <Clubes />;
            case 'eletivas': return <Eletivas />;
            case 'vagas': return <Vagas />;
            default: return <Alunos />;
        }
    };

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <header style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                    Configurações da <span style={{ color: 'var(--primary)' }}>Instituição</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Gerencie os parâmetros globais e cadastros bases</p>
            </header>

            {/* Tab Navigation */}
            <div style={{
                display: 'inline-flex',
                background: 'var(--bg-card)',
                padding: '6px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                marginBottom: 'var(--spacing-2xl)',
                gap: '4px',
                overflowX: 'auto',
                maxWidth: '100%'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={activeTab === tab.id ? 'btn btn-primary' : 'btn btn-ghost'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            borderRadius: '12px',
                            whiteSpace: 'nowrap',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="fade-in" style={{ animation: 'fadeIn 0.4s ease-out' }}>
                {renderContent()}
            </div>
        </div>
    );
};
