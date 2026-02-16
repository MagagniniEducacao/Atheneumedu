import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkSetup = async () => {
            const { data } = await supabase.rpc('check_any_super_admin_exists');
            if (data === false) {
                navigate('/setup');
            }
        };
        checkSetup();
    }, [navigate]);

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div style={{ width: '450px', padding: '50px 40px' }} className="card">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: 'var(--primary)', fontSize: '32px', fontWeight: '800', marginBottom: '5px' }}>Atheneum Lib</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Gestão de Bibliotecas Escolares</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Usuário ou E-mail</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                placeholder="Seu e-mail ou nome"
                                style={{ paddingLeft: '40px' }}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Senha</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="........"
                                style={{ paddingLeft: '40px' }}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '15px' }}>
                        <LogIn size={20} /> {loading ? 'Carregando...' : 'Acessar Sistema'}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <a href="#" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>Esqueci minha senha</a>
                    </div>
                </form>
            </div>
        </div>
    );
};
