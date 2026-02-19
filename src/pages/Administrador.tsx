import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, School, UserPlus, Trash2, Key as PasswordIcon } from 'lucide-react';

export const Administrador = () => {
    const [schools, setSchools] = useState<any[]>([]);
    const [newSchoolName, setNewSchoolName] = useState('');
    const [newSchoolSlug, setNewSchoolSlug] = useState('');

    const [managers, setManagers] = useState<any[]>([]);
    const [mgrEmail, setMgrEmail] = useState('');
    const [mgrPass, setMgrPass] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');

    useEffect(() => {
        fetchSchools();
        fetchManagers();
    }, []);

    const fetchSchools = async () => {
        const { data } = await supabase.from('schools').select('*').order('name');
        setSchools(data || []);
    };

    const fetchManagers = async () => {
        const { data } = await supabase.from('profiles').select('*, schools(name)').eq('role', 'manager');
        setManagers(data || []);
    };

    const toggleSchoolActive = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('schools')
            .update({ is_active: !currentStatus })
            .eq('id', id);

        if (error) alert('Erro ao alterar status: ' + error.message);
        else fetchSchools();
    };

    const handleSchoolNameChange = (val: string) => {
        setNewSchoolName(val);
        const slug = val.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setNewSchoolSlug(slug);
    };

    const createSchool = async () => {
        if (!newSchoolName || !newSchoolSlug) return;
        const { error } = await supabase.from('schools').insert({ name: newSchoolName, slug: newSchoolSlug });
        if (!error) {
            setNewSchoolName('');
            setNewSchoolSlug('');
            fetchSchools();
        } else {
            alert('Erro ao criar escola (verifique se o slug é único): ' + error.message);
        }
    };

    const createManager = async () => {
        if (!mgrEmail || !mgrPass || !selectedSchool) return;

        // Note: Creating auth user from frontend is normally limited or requires service role.
        // In a real app, this would be an Edge Function. 
        // For this prototype, we'll try to sign them up or use a placeholder logic.
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: mgrEmail,
            password: mgrPass,
        });

        if (authError) {
            alert('Erro Auth: ' + authError.message);
            return;
        }

        if (authData.user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: authData.user.id,
                role: 'manager',
                school_id: selectedSchool,
                needs_password_change: true
            });

            if (!profileError) {
                // Save provisional password
                await supabase.from('profiles').update({
                    provisional_password: mgrPass
                }).eq('id', authData.user.id);

                setMgrEmail('');
                setMgrPass('');
                fetchManagers();
                alert('Gestor criado com sucesso!');
            } else {
                alert('Erro Perfil: ' + profileError.message);
            }
        }
    };

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <header style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                    Painel do <span style={{ color: 'var(--primary)' }}>Administrador</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Controle global de instituições e credenciais de acesso</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                {/* Schools Section */}
                <div className="card" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <School size={22} />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Escolas</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', padding: '20px', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>NOME DA INSTITUIÇÃO</label>
                                <input
                                    placeholder="Ex: Escola Atheneum"
                                    value={newSchoolName}
                                    onChange={e => handleSchoolNameChange(e.target.value)}
                                    style={{ background: 'var(--white)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>IDENTIFICADOR (SLUG)</label>
                                <input
                                    placeholder="identificador-unico"
                                    value={newSchoolSlug}
                                    onChange={e => setNewSchoolSlug(e.target.value)}
                                    style={{ background: 'var(--white)' }}
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={createSchool} style={{ width: '100%', padding: '12px' }}>
                            <Plus size={18} /> Cadastrar Nova Escola
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Escolas Ativas ({schools.length})</p>
                        {schools.map(s => (
                            <div key={s.id} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', border: '1px solid var(--border)', transition: 'var(--transition)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.is_active ? '#10b981' : '#ef4444' }}></div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{s.name}</span>
                                        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.slug}</small>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button
                                        onClick={() => toggleSchoolActive(s.id, s.is_active)}
                                        className={s.is_active ? 'btn btn-success' : 'btn btn-secondary'}
                                        style={{ padding: '6px 14px', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: '700' }}
                                    >
                                        {s.is_active ? 'Ativa' : 'Inativa'}
                                    </button>
                                    <button className="btn-ghost" style={{ padding: '8px', color: '#ef4444' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Managers Section */}
                <div className="card" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserPlus size={22} />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Gestores de Acesso</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', padding: '20px', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>ESCOLA DE DESTINO</label>
                            <select value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)} style={{ background: 'var(--white)' }}>
                                <option value="">Selecionar Escola...</option>
                                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>EMAIL DO GESTOR</label>
                                <input placeholder="gestor@email.com" value={mgrEmail} onChange={e => setMgrEmail(e.target.value)} style={{ background: 'var(--white)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>SENHA PROVISÓRIA</label>
                                <input type="text" placeholder="Senha inicial" value={mgrPass} onChange={e => setMgrPass(e.target.value)} style={{ background: 'var(--white)' }} />
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={createManager} style={{ width: '100%', padding: '12px' }}>Vincular Novo Gestor</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Gestores Registrados ({managers.length})</p>
                        {managers.map(m => (
                            <div key={m.id} className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '32px', height: '32px', background: 'var(--white)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                            <PasswordIcon size={16} />
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.email || 'Usuário do Sistema'}</span>
                                    </div>
                                    {m.needs_password_change && (
                                        <span style={{ fontSize: '0.625rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', fontWeight: '800' }}>PRIMEIRO ACESSO</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dotted var(--border)' }}>
                                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{m.schools?.name}</small>
                                    {m.provisional_password && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Chave:</small>
                                            <code style={{ background: 'var(--white)', padding: '2px 6px', borderRadius: '4px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem' }}>{m.provisional_password}</code>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
