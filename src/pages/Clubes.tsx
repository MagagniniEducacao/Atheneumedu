import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Clubes = () => {
    const [clubes, setClubes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');

    useEffect(() => {
        fetchClubes();
    }, []);

    const fetchClubes = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('type', 'club')
            .order('name', { ascending: true });

        if (error) console.error(error);
        else setClubes(data || []);
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('items')
            .insert([{
                type: 'club',
                name: newName,
                description: newDesc,
                slots: 0
            }]);

        if (!error) {
            setNewName('');
            setNewDesc('');
            setShowForm(false);
            fetchClubes();
        }
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Clube Juvenil</h1>
                <button
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setShowForm(!showForm)}
                >
                    <Plus size={20} /> {showForm ? 'Cancelar' : 'Novo Clube'}
                </button>
            </header>

            {showForm && (
                <div className="glass" style={{ padding: '25px', marginBottom: '25px' }}>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                        <div>
                            <label>Nome do Clube</label>
                            <input type="text" className="glass" style={{ width: '100%', padding: '10px' }} value={newName} onChange={e => setNewName(e.target.value)} required />
                        </div>
                        <div>
                            <label>Descrição / Proposta</label>
                            <textarea className="glass" style={{ width: '100%', padding: '10px', height: '80px' }} value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary">Criar Clube Juvenil</button>
                    </form>
                </div>
            )}

            <div className="glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
                {clubes.map(c => (
                    <div key={c.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <Users2 size={24} style={{ color: 'var(--primary)' }} />
                            <h3 style={{ margin: 0 }}>{c.name}</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '15px' }}>{c.description || 'Sem descrição.'}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button style={{ color: 'var(--primary)', background: 'none', border: 'none' }}><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
