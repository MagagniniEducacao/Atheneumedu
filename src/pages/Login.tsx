import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
    const { error: globalError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const navigate = useNavigate();

    const displayError = localError || globalError;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLocalError('');

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setLocalError(authError.message === 'Invalid login credentials'
                ? 'E-mail ou senha incorretos'
                : 'Erro ao fazer login. Tente novamente.');
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
            <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--primary)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-md)',
                    }}>
                        <LogIn size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--spacing-sm)' }}>
                        Atheneum <span style={{ color: 'var(--primary)' }}>Edu</span>
                    </h1>
                    <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                        Sistema de Gestão Educacional
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {displayError && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: 'var(--radius)',
                            color: '#991b1b',
                            fontSize: '0.875rem',
                        }}>
                            {displayError}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email">E-mail</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{
                                position: 'absolute',
                                left: '0.875rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                            }} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                disabled={loading}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password">Senha</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '0.875rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                            }} />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.75rem' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="spinner" size={18} />
                                Entrando...
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Entrar
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                        © 2026 Atheneum Edu. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};
