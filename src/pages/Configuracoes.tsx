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
        <div>
            <h1 style={{ marginBottom: '30px' }}>Configurações da Escola</h1>

            {/* Tab Navigation */}
            <div className="glass" style={{ display: 'flex', gap: '5px', padding: '5px', marginBottom: '30px', borderRadius: '15px', overflowX: 'auto' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            fontWeight: 500
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="fade-in">
                {renderContent()}
            </div>
        </div>
    );
};
