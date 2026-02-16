import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, BookOpen,
    Users2, Settings, CheckCircle, Shield, LogOut,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        // SuperAdmin & Manager tabs
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard', roles: ['super_admin', 'admin', 'manager'] },

        // SuperAdmin only tabs
        { path: '/escolas', icon: <GraduationCap size={20} />, label: 'Escolas', roles: ['super_admin'] },
        { path: '/administrador', icon: <Shield size={20} />, label: 'Gestores', roles: ['super_admin', 'admin'] },

        // Manager tabs (SuperAdmin also has access)
        { path: '/alunos', icon: <Users size={20} />, label: 'Alunos', roles: ['super_admin', 'manager'] },
        { path: '/professores', icon: <GraduationCap size={20} />, label: 'Professores', roles: ['super_admin', 'manager'] },
        { path: '/eletivas', icon: <BookOpen size={20} />, label: 'Eletivas', roles: ['super_admin', 'manager'] },
        { path: '/clubes', icon: <Users2 size={20} />, label: 'Clubes', roles: ['super_admin', 'manager'] },
        { path: '/tutoria', icon: <Users size={20} />, label: 'Tutoria', roles: ['super_admin', 'manager'] },
        { path: '/alocacoes', icon: <CheckCircle size={20} />, label: 'Alocações', roles: ['super_admin', 'manager'] },
        { path: '/relatorios', icon: <ChevronRight size={20} />, label: 'Relatórios', roles: ['super_admin', 'manager'] },
        { path: '/configuracoes', icon: <Settings size={20} />, label: 'Configurações', roles: ['super_admin', 'manager'] },
    ];

    const filteredItems = navItems.filter(item => profile && item.roles.includes(profile.role));

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderRight: '1px solid var(--border)',
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                <div style={{ marginBottom: '40px', padding: '0 10px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Atheneum <span style={{ color: 'var(--primary)' }}>Edu</span></h2>
                    {profile?.schools && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>{profile.schools.name}</p>
                    )}
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filteredItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 15px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'var(--text-muted)',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                transition: 'all 0.2s ease',
                                fontSize: '15px'
                            })}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', padding: '20px 10px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                            {profile?.role[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ fontSize: '13px', margin: 0, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.role === 'super_admin' ? 'Super Admin' : profile?.role === 'admin' ? 'Administrador' : 'Gestor Escolar'}</p>
                        </div>
                    </div>
                    <button
                        onClick={async () => { await signOut(); navigate('/login'); }}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'none',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut size={16} /> Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};
