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
        <div>
            <h1 style={{ marginBottom: '30px' }}>Painel do Administrador</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Schools Section */}
                <div className="glass" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <School color="var(--primary)" />
                        <h2 style={{ margin: 0 }}>Escolas</h2>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input
                            placeholder="Nome da Escola"
                            className="glass"
                            style={{ flex: 1, padding: '10px' }}
                            value={newSchoolName}
                            onChange={e => setNewSchoolName(e.target.value)}
                        />
                        <input
                            placeholder="slug-link"
                            className="glass"
                            style={{ width: '120px', padding: '10px' }}
                            value={newSchoolSlug}
                            onChange={e => setNewSchoolSlug(e.target.value.toLowerCase().replace(/ /g, '-'))}
                        />
                        <button className="btn-primary" onClick={createSchool}><Plus size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {schools.map(s => (
                            <div key={s.id} className="glass" style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                                <span>{s.name} <small style={{ color: 'var(--text-muted)' }}>({s.slug})</small></span>
                                <Trash2 size={16} color="#ef4444" style={{ cursor: 'pointer' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Managers Section */}
                <div className="glass" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <UserPlus color="var(--primary)" />
                        <h2 style={{ margin: 0 }}>Gestores</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        <select className="glass" style={{ padding: '10px' }} value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)}>
                            <option value="">Selecionar Escola...</option>
                            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <input placeholder="Email do Gestor" className="glass" style={{ padding: '10px' }} value={mgrEmail} onChange={e => setMgrEmail(e.target.value)} />
                        <input placeholder="Senha Provisória" className="glass" style={{ padding: '10px' }} value={mgrPass} onChange={e => setMgrPass(e.target.value)} />
                        <button className="btn-primary" onClick={createManager} style={{ padding: '12px' }}>Criar Gestor Escolar</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {managers.map(m => (
                            <div key={m.id} className="glass" style={{ padding: '10px 15px', display: 'flex', flexDirection: 'column', gap: '5px', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{m.id.substring(0, 8)}...</span>
                                    {m.needs_password_change && <PasswordIcon size={14} color="#f59e0b" />}
                                </div>
                                <small style={{ color: 'var(--text-muted)' }}>Escola: {m.schools?.name}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
