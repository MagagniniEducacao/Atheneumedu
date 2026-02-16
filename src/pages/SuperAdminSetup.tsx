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
        const { data } = await supabase.rpc('check_any_super_admin_exists');
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
            window.location.href = '/login';
        }
        setLoading(false);
    };

    if (exists === true) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ width: '500px', padding: '50px 40px', textAlign: 'center' }} className="card">
                    <div style={{ width: '80px', height: '80px', background: 'rgba(185, 28, 28, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
                        <ShieldCheck size={40} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Acesso Bloqueado</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>O administrador principal já foi configurado. Esta página não está mais disponível.</p>
                    <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={() => window.location.href = '/login'}>Ir para Login</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div style={{ width: '450px', padding: '50px 40px' }} className="card">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ width: '70px', height: '70px', background: 'var(--primary)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 15px -3px rgba(185, 28, 28, 0.3)' }}>
                        <UserPlus color="white" size={32} />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '5px' }}>Configurar Sistema</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Criação da Conta Mestra (Super Admin)</p>
                </div>

                <form onSubmit={handleSetup} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Email do Administrador</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                style={{ paddingLeft: '40px' }}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Senha Mestra</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="Crie uma senha forte"
                                style={{ paddingLeft: '40px' }}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '15px' }}>
                        {loading ? 'Configurando...' : 'Finalizar Configuração'}
                    </button>
                </form>
            </div>
        </div>
    );
};
