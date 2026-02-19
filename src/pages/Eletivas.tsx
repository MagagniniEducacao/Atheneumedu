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
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                        Gestão de <span style={{ color: 'var(--primary)' }}>Eletivas</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Configure as disciplinas eletivas e atribua professores</p>
                </div>
                <button
                    className={showForm ? 'btn btn-secondary' : 'btn btn-primary'}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancelar' : <><Plus size={20} /> Nova Eletiva</>}
                </button>
            </header>

            {showForm && (
                <div className="card" style={{ padding: '25px', marginBottom: 'var(--spacing-xl)', background: 'var(--bg-card)' }}>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                        <div>
                            <label>Nome da Eletiva</label>
                            <input type="text" placeholder="Ex: Astronomia Básica" value={newName} onChange={e => setNewName(e.target.value)} required />
                        </div>
                        <div>
                            <label>Professor Responsável</label>
                            <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}>
                                <option value="">Selecione o Professor...</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label>Descrição / Objetivos</label>
                            <textarea placeholder="Descreva o que será abordado nesta eletiva..." style={{ height: '100px' }} value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', padding: '12px' }}>Criar Eletiva</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)' }}>
                {eletivas.map(e => (
                    <div key={e.id} className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BookOpen size={24} />
                            </div>
                            <button style={{ color: '#ef4444', background: 'transparent', opacity: 0.6 }}><Trash2 size={18} /></button>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>{e.name}</h3>
                        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', flex: 1, lineHeight: '1.5' }}>{e.description || 'Nenhuma descrição fornecida para esta eletiva.'}</p>
                        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', background: 'var(--bg-main)', borderRadius: '6px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>P</div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                                {e.teachers?.name || 'Professor não atribuído'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
