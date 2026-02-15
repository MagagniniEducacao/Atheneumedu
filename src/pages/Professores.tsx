import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Professores = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('teachers')
            .select('*')
            .order('name', { ascending: true });

        if (error) console.error(error);
        else setTeachers(data || []);
        setLoading(false);
    };

    const handleAddTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newEmail) return;

        const { error } = await supabase
            .from('teachers')
            .insert([{ name: newName, email: newEmail }]);

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
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Professores</h1>
                <button
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setShowForm(!showForm)}
                >
                    <UserPlus size={20} /> {showForm ? 'Cancelar' : 'Cadastrar Professor'}
                </button>
            </header>

            {showForm && (
                <div className="glass" style={{ padding: '25px', marginBottom: '25px' }}>
                    <form onSubmit={handleAddTeacher} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Nome Completo</label>
                            <input
                                type="text"
                                className="glass"
                                style={{ width: '100%', padding: '10px', background: 'transparent' }}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>E-mail</label>
                            <input
                                type="email"
                                className="glass"
                                style={{ width: '100%', padding: '10px', background: 'transparent' }}
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">Salvar</button>
                    </form>
                </div>
            )}

            <div className="glass">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Nome</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>E-mail</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={3} style={{ padding: '20px', textAlign: 'center' }}>Carregando...</td></tr>
                        ) : teachers.length === 0 ? (
                            <tr><td colSpan={3} style={{ padding: '20px', textAlign: 'center' }}>Nenhum professor cadastrado.</td></tr>
                        ) : (
                            teachers.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '15px' }}>{t.name}</td>
                                    <td style={{ padding: '15px' }}>{t.email}</td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
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
