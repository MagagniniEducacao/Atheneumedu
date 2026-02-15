import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside className="glass" style={{ width: '260px', padding: '20px', margin: '10px' }}>
                <h2 style={{ color: 'var(--primary)', marginBottom: '30px' }}>Atheneum Edu</h2>
                <nav>
                    <ul style={{ listStyle: 'none' }}>
                        <li style={{ marginBottom: '15px', color: 'var(--text-muted)' }}>Dashboard</li>
                        <li style={{ marginBottom: '15px', color: 'var(--text-muted)' }}>Alunos</li>
                        <li style={{ marginBottom: '15px', color: 'var(--text-muted)' }}>Gestão</li>
                    </ul>
                </nav>
            </aside>
            <main style={{ flex: 1, padding: '20px' }}>
                {children}
            </main>
        </div>
    );
};
