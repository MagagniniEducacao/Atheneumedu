import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck, Mail, Lock, Loader2, LogIn } from 'lucide-react';

export const SuperAdminSetup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkExists();
    }, []);

    const checkExists = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'super_admin')
                .limit(1);

            if (data && data.length > 0) {
                setError('Um Administrador Mestre já existe no sistema. Por favor, faça login.');
            }
        } catch (err) {
            console.error('Error checking super admin:', err);
        } finally {
            setChecking(false);
        }
    };

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: 'super_admin',
                    },
                },
            });

            if (signUpError) throw signUpError;

            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        role: 'super_admin',
                        needs_password_change: false,
                    });

                if (profileError) throw profileError;

                navigate('/');
            }
        } catch (err: any) {
            console.error('Setup error:', err);
            setError(err.message || 'Erro ao criar conta. Tente novamente.');
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
                <Loader2 className="spinner" size={32} style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
            <div className="card" style={{ maxWidth: '480px', width: '100%' }}>
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
                        <ShieldCheck size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--spacing-sm)' }}>
                        Configurar Sistema
                    </h1>
                    <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                        Criação da Conta Mestra (Super Admin)
                    </p>
                </div>

                {/* Info Alert */}
                <div style={{
                    padding: 'var(--spacing-md)',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: 'var(--radius)',
                    marginBottom: 'var(--spacing-lg)',
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                        Esta conta terá acesso total ao sistema. Guarde as credenciais em local seguro.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSetup} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {error && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: 'var(--radius)',
                            color: '#991b1b',
                            fontSize: '0.875rem',
                        }}>
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email">E-mail do Administrador</label>
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
                                placeholder="admin@escola.com"
                                required
                                disabled={loading}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password">Senha Mestra</label>
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
                                placeholder="Mínimo 6 caracteres"
                                required
                                disabled={loading}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword">Confirmar Senha</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '0.875rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                            }} />
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Digite a senha novamente"
                                required
                                disabled={loading}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !!(error && error.includes('já existe'))}
                        style={{ width: '100%', padding: '0.75rem' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="spinner" size={18} />
                                Configurando...
                            </>
                        ) : error && error.includes('já existe') ? (
                            <>
                                <LogIn size={18} />
                                Ir para Login
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                Criar Conta Mestra
                            </>
                        )}
                    </button>
                    {error && error.includes('já existe') && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/login')}
                            style={{ width: '100%', padding: '0.75rem' }}
                        >
                            Fazer Login
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};
