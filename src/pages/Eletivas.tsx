import React, { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Eletivas = () => {
    const [eletivas, setEletivas] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');

    useEffect(() => {
        fetchEletivas();
        fetchTeachers();
    }, []);

    const fetchEletivas = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('items')
            .select('*, teachers(name)')
            .eq('type', 'elective')
            .order('name', { ascending: true });

        if (error) console.error(error);
        else setEletivas(data || []);
        setLoading(false);
    };

    const fetchTeachers = async () => {
        const { data } = await supabase.from('teachers').select('*');
        if (data) setTeachers(data);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('items')
            .insert([{
                type: 'elective',
                name: newName,
                description: newDesc,
                teacher_id: selectedTeacher || null,
                slots: 0 // Will be managed in Vagas
            }]);

        if (!error) {
            setNewName('');
            setNewDesc('');
            setSelectedTeacher('');
            setShowForm(false);
            fetchEletivas();
        }
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Eletivas</h1>
                <button
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setShowForm(!showForm)}
                >
                    <Plus size={20} /> {showForm ? 'Cancelar' : 'Nova Eletiva'}
                </button>
            </header>

            {showForm && (
                <div className="glass" style={{ padding: '25px', marginBottom: '25px' }}>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label>Nome da Eletiva</label>
                            <input type="text" className="glass" style={{ width: '100%', padding: '10px' }} value={newName} onChange={e => setNewName(e.target.value)} required />
                        </div>
                        <div>
                            <label>Professor Responsável</label>
                            <select className="glass" style={{ width: '100%', padding: '10px' }} value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}>
                                <option value="">Selecione...</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label>Descrição</label>
                            <textarea className="glass" style={{ width: '100%', padding: '10px', height: '80px' }} value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Criar Eletiva</button>
                    </form>
                </div>
            )}

            <div className="glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
                {eletivas.map(e => (
                    <div key={e.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                        <h3 style={{ marginBottom: '10px' }}>{e.name}</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '15px' }}>{e.description || 'Sem descrição.'}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontStyle: 'italic' }}>Prof: {e.teachers?.name || 'Não definido'}</span>
                            <button style={{ color: 'var(--primary)', background: 'none', border: 'none' }}><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
