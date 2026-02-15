import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, ShieldCheck, Mail, Lock } from 'lucide-react';

export const SuperAdminSetup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [exists, setExists] = useState<boolean | null>(null);

    useEffect(() => {
        checkExists();
    }, []);

    const checkExists = async () => {
        const { data, error } = await supabase.rpc('check_any_super_admin_exists');
        setExists(data);
    };

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Sign up user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError || !authData.user) {
            alert('Erro ao criar conta: ' + authError?.message);
            setLoading(false);
            return;
        }

        // 2. Create profile as super_admin
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                role: 'super_admin',
                needs_password_change: false
            });

        if (profileError) {
            alert('Erro ao criar perfil: ' + profileError.message);
        } else {
            alert('Super Admin criado com sucesso! Faça login agora.');
            window.location.reload();
        }
        setLoading(false);
    };

    if (exists === true) {
        return (
            <div style={{ maxWidth: '500px', margin: '100px auto', padding: '40px', textAlign: 'center' }} className="glass">
                <ShieldCheck size={60} color="var(--primary)" style={{ marginBottom: '20px' }} />
                <h2>Acesso Bloqueado</h2>
                <p style={{ color: 'var(--text-muted)' }}>O administrador principal já foi configurado. Esta página não está mais disponível.</p>
                <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => window.location.href = '/login'}>Ir para Login</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px' }} className="glass">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                    <UserPlus color="white" size={30} />
                </div>
                <h2>Configurar Super Admin</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Primeiro acesso ao sistema Atheneum Edu.</p>
            </div>

            <form onSubmit={handleSetup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '14px' }}>
                    {loading ? 'Configurando...' : 'Criar Conta Mestra'}
                </button>
            </form>
        </div>
    );
};
