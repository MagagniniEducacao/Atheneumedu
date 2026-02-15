import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, BookOpen, Users2, Settings } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/alunos', icon: <Users size={20} />, label: 'Alunos' },
        { path: '/professores', icon: <GraduationCap size={20} />, label: 'Professores' },
        { path: '/eletivas', icon: <BookOpen size={20} />, label: 'Eletivas' },
        { path: '/clubes', icon: <Users2 size={20} />, label: 'Clube Juvenil' },
        { path: '/vagas', icon: <Settings size={20} />, label: 'Gestão de Vagas' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <aside className="glass" style={{
                width: '280px',
                height: 'calc(100vh - 20px)',
                padding: '30px',
                margin: '10px',
                position: 'sticky',
                top: '10px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px' }}></div>
                    <h2 style={{ color: 'var(--primary)', fontSize: '20px', letterSpacing: '-0.5px' }}>Atheneum Edu</h2>
                </div>

                <nav>
                    <ul style={{ listStyle: 'none' }}>
                        {navItems.map((item) => (
                            <li key={item.path} style={{ marginBottom: '10px' }}>
                                <NavLink
                                    to={item.path}
                                    style={({ isActive }) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        color: isActive ? 'white' : 'var(--text-muted)',
                                        background: isActive ? 'var(--primary)' : 'transparent',
                                        transition: 'all 0.2s ease',
                                        fontWeight: 500
                                    })}
                                >
                                    {item.icon}
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <main style={{ flex: 1, padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
                {children}
            </main>
        </div>
    );
};
