import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Vagas = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('type', { ascending: true })
            .order('name', { ascending: true });

        if (error) console.error(error);
        else setItems(data || []);
        setLoading(false);
    };

    const handleSlotChange = (id: string, value: string) => {
        setItems(items.map(item => item.id === id ? { ...item, slots: parseInt(value) || 0 } : item));
    };

    const handleSave = async () => {
        setSaving(true);
        const promises = items.map(item =>
            supabase.from('items').update({ slots: item.slots }).eq('id', item.id)
        );
        await Promise.all(promises);
        setSaving(false);
        alert('Vagas atualizadas com sucesso!');
    };

    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {} as any);

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Gestão de Vagas</h1>
                <button
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Save size={20} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </header>

            <div style={{ display: 'grid', gap: '30px' }}>
                {Object.entries(groupedItems).map(([type, typeItems]: [any, any]) => (
                    <div key={type} className="glass" style={{ padding: '20px' }}>
                        <h2 style={{ marginBottom: '20px', textTransform: 'capitalize' }}>
                            {type === 'elective' ? 'Eletivas' : type === 'club' ? 'Clubes Juvenis' : 'Tutores'}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                            {typeItems.map((item: any) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.03)', padding: '15px', borderRadius: '10px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.name}</span>
                                    <input
                                        type="number"
                                        min="0"
                                        style={{
                                            width: '60px',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: '1px solid var(--border)',
                                            textAlign: 'center'
                                        }}
                                        value={item.slots}
                                        onChange={(e) => handleSlotChange(item.id, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
