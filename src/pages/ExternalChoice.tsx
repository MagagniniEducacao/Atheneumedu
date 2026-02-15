import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StudentLogin } from './StudentLogin';
import { CheckCircle, AlertTriangle, ArrowRight, ListOrdered } from 'lucide-react';

interface ExternalChoiceProps {
    type: 'tutor' | 'elective' | 'club';
}

export const ExternalChoice: React.FC<ExternalChoiceProps> = ({ type }) => {
    const [student, setStudent] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [isActive, setIsActive] = useState<boolean | null>(null);
    const [choices, setChoices] = useState<string[]>(['', '', '', '', '']);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    const title = type === 'tutor' ? 'Escolha de Tutor' : type === 'elective' ? 'Escolha de Eletiva' : 'Escolha de Clube Juvenil';

    useEffect(() => {
        checkActive();
        fetchItems();
    }, [type]);

    const checkActive = async () => {
        const { data } = await supabase.from('settings').select('*').eq('key', `${type}_active`).single();
        setIsActive(data?.value || false);
        setLoading(false);
    };

    const fetchItems = async () => {
        const { data } = await supabase.from('items').select('*').eq('type', type).order('name', { ascending: true });
        if (data) setItems(data);
    };

    const handleChoiceChange = (index: number, value: string) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        setChoices(newChoices);
    };

    const handleSubmit = async () => {
        if (choices.some(c => !c)) {
            alert('Por favor, selecione as 5 opções em ordem de prioridade.');
            return;
        }

        const { error } = await supabase.from('choices').upsert({
            student_ra: student.ra_sp,
            type: type,
            p1: choices[0],
            p2: choices[1],
            p3: choices[2],
            p4: choices[3],
            p5: choices[4],
            timestamp: new Date()
        });

        if (error) {
            alert('Erro ao salvar escolhas: ' + error.message);
        } else {
            setSubmitted(true);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando...</div>;

    if (isActive === false) {
        return (
            <div style={{ maxWidth: '500px', margin: '100px auto', padding: '40px', textAlign: 'center' }} className="glass">
                <AlertTriangle size={60} color="#f59e0b" style={{ marginBottom: '20px' }} />
                <h2>Link Inativo</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Esta fase de escolha ainda não foi aberta ou já foi encerrada pelos gestores.</p>
            </div>
        );
    }

    if (!student) {
        return <StudentLogin onLogin={setStudent} />;
    }

    if (submitted) {
        return (
            <div style={{ maxWidth: '500px', margin: '100px auto', padding: '40px', textAlign: 'center' }} className="glass">
                <CheckCircle size={60} color="#10b981" style={{ marginBottom: '20px' }} />
                <h2>Escolha Realizada!</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>{student.name}, suas 5 prioridades de {type === 'tutor' ? 'tutoria' : type === 'elective' ? 'eletiva' : 'clube'} foram salvas com sucesso.</p>
                <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>Fazer outra escolha</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--primary)' }}>{title}</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Olá, <strong>{student.name}</strong>. Selecione abaixo suas 5 opções preferidas em ordem de prioridade.</p>
            </header>

            <div style={{ display: 'grid', gap: '15px' }}>
                {choices.map((selectedId, idx) => (
                    <div key={idx} className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '35px',
                            height: '35px',
                            background: 'var(--primary)',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>
                            {idx + 1}º
                        </div>
                        <select
                            className="glass"
                            style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none' }}
                            value={selectedId}
                            onChange={(e) => handleChoiceChange(idx, e.target.value)}
                        >
                            <option value="">Selecione a {idx + 1}ª opção...</option>
                            {items.map(item => (
                                <option key={item.id} value={item.id} disabled={choices.includes(item.id) && selectedId !== item.id}>
                                    {item.name} {item.teachers?.name ? `- ${item.teachers.name}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '18px' }}
                    onClick={handleSubmit}
                >
                    Salvar Minhas Escolhas <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};
