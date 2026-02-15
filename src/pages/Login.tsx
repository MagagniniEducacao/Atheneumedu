import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError('Credenciais inválidas. Verifique seu email e senha.');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px' }} className="glass">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2>Painel de Gestão</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Atheneum Edu - Acesso Administrativo</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Email</label>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email"
                            className="glass"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'transparent' }}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Senha</label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            className="glass"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'transparent' }}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {error && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <LogIn size={20} /> {loading ? 'Entrando...' : 'Acessar Painel'}
                </button>
            </form>
        </div>
    );
};
