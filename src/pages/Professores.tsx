import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UserPlus, Mail, User, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export const Professores = () => {
    const { profile } = useAuth();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        if (profile?.school_id || profile?.role === 'super_admin') {
            fetchTeachers();
        }
    }, [profile]);

    const fetchTeachers = async () => {
        setLoading(true);
        let query = supabase.from('teachers').select('*').order('name', { ascending: true });

        if (profile?.role !== 'super_admin' && profile?.school_id) {
            query = query.eq('school_id', profile.school_id);
        }

        const { data, error } = await query;

        if (error) console.error(error);
        else setTeachers(data || []);
        setLoading(false);
    };

    const handleAddTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newEmail || !profile?.school_id) return;

        const { error } = await supabase
            .from('teachers')
            .insert([{
                name: newName,
                email: newEmail,
                school_id: profile.school_id
            }]);

        if (error) {
            alert('Erro ao cadastrar professor: ' + error.message);
        } else {
            setNewName('');
            setNewEmail('');
            setShowForm(false);
            fetchTeachers();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja excluir este professor?')) return;
        const { error } = await supabase.from('teachers').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchTeachers();
    };

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                        Gestão de <span style={{ color: 'var(--primary)' }}>Professores</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Cadastre e gerencie a equipe docente da sua escola</p>
                </div>
                <button
                    className={showForm ? 'btn btn-secondary' : 'btn btn-primary'}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancelar' : <><UserPlus size={20} /> Cadastrar Professor</>}
                </button>
            </header>

            {showForm && (
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <form onSubmit={handleAddTeacher} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 'var(--spacing-lg)', alignItems: 'flex-end' }}>
                        <div>
                            <label><User size={14} style={{ marginRight: '6px' }} /> Nome Completo</label>
                            <input
                                type="text"
                                placeholder="Nome do docente"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label><Mail size={14} style={{ marginRight: '6px' }} /> E-mail Profissional</label>
                            <input
                                type="email"
                                placeholder="exemplo@escola.com"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '10px 30px' }}>
                            Salvar Professor
                        </button>
                    </form>
                </div>
            )}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.875rem' }}>DOCENTE</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.875rem' }}>CONTATO</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.875rem' }}>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando professores...</td></tr>
                        ) : teachers.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                                    <div style={{ opacity: 0.5, marginBottom: '1rem' }}><ShieldCheck size={48} style={{ margin: '0 auto' }} /></div>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>Nenhum professor cadastrado</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Comece adicionando o primeiro professor da escola</p>
                                </td>
                            </tr>
                        ) : (
                            teachers.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }} className="table-row-hover">
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                                                {t.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{t.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>{t.email}</td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            style={{ padding: '8px', background: 'transparent', color: '#ef4444', opacity: 0.7, transition: 'all 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                                            onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

