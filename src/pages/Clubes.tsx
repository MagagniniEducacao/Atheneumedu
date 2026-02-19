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
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                        Clubes <span style={{ color: 'var(--primary)' }}>Juvenis</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Protagonismo juvenil e espaços de convivência</p>
                </div>
                <button
                    className={showForm ? 'btn btn-secondary' : 'btn btn-primary'}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancelar' : <><Plus size={20} /> Novo Clube</>}
                </button>
            </header>

            {showForm && (
                <div className="card" style={{ padding: '25px', marginBottom: 'var(--spacing-xl)', background: 'var(--bg-card)' }}>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
                        <div>
                            <label>Nome do Clube</label>
                            <input type="text" placeholder="Ex: Clube de Robótica" value={newName} onChange={e => setNewName(e.target.value)} required />
                        </div>
                        <div>
                            <label>Descrição / Proposta</label>
                            <textarea placeholder="Qual o objetivo e atividades deste clube?" style={{ height: '100px' }} value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>Criar Clube Juvenil</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)' }}>
                {clubes.map(c => (
                    <div key={c.id} className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Users2 size={24} />
                            </div>
                            <button style={{ color: '#ef4444', background: 'transparent', opacity: 0.6 }}><Trash2 size={18} /></button>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>{c.name}</h3>
                            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{c.description || 'Nenhuma descrição fornecida para este clube.'}</p>
                        </div>
                        <div style={{ marginTop: 'auto', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ativo</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
