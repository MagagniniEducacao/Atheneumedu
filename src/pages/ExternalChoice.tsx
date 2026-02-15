import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { StudentLogin } from './StudentLogin';
import { CheckCircle, AlertTriangle, ArrowRight, BookOpen, Users2, Star } from 'lucide-react';

export const ExternalChoice: React.FC = () => {
    const { slug } = useParams();
    const [school, setSchool] = useState<any>(null);
    const [student, setStudent] = useState<any>(null);
    const [activeType, setActiveType] = useState<'tutor' | 'elective' | 'club' | null>(null);
    const [items, setItems] = useState<any[]>([]);
    const [isActive, setIsActive] = useState<boolean | null>(null);
    const [choices, setChoices] = useState<string[]>(['', '', '', '', '']);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) fetchSchool();
    }, [slug]);

    useEffect(() => {
        if (activeType && school) {
            checkActive();
            fetchItems();
        }
    }, [activeType, school]);

    const fetchSchool = async () => {
        const { data, error } = await supabase.from('schools').select('*').eq('slug', slug).single();
        if (error) {
            setIsActive(false);
        } else {
            setSchool(data);
        }
        setLoading(false);
    };

    const checkActive = async () => {
        const { data } = await supabase
            .from('settings')
            .select('*')
            .eq('key', `${activeType}_active`)
            .eq('school_id', school.id)
            .single();
        setIsActive(data?.value || false);
    };

    const fetchItems = async () => {
        const { data } = await supabase
            .from('items')
            .select('*, teachers(name)')
            .eq('type', activeType)
            .eq('school_id', school.id)
            .order('name', { ascending: true });
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
            type: activeType,
            school_id: school.id,
            p1: choices[0],
            p2: choices[1],
            p3: choices[2],
            p4: choices[3],
            p5: choices[4],
            timestamp: new Date()
        }, { onConflict: 'student_ra,type,school_id' });

        if (error) {
            alert('Erro ao salvar: ' + error.message);
        } else {
            setSubmitted(true);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando escola...</div>;

    if (!school) {
        return (
            <div style={{ maxWidth: '500px', margin: '100px auto', padding: '40px', textAlign: 'center' }} className="glass">
                <AlertTriangle size={60} color="#ef4444" style={{ marginBottom: '20px' }} />
                <h2>Escola não encontrada</h2>
                <p style={{ color: 'var(--text-muted)' }}>O link utilizado é inválido ou a escola não está cadastrada.</p>
            </div>
        );
    }

    if (!student) {
        return <StudentLogin onLogin={setStudent} />;
    }

    if (!activeType) {
        return (
            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px' }}>
                <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 style={{ color: 'var(--primary)' }}>{school.name}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Olá, <strong>{student.name}</strong>. O que você deseja escolher hoje?</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    {[
                        { id: 'tutor', label: 'Tutoria', icon: <Star size={40} />, desc: 'Escolha seu professor tutor' },
                        { id: 'club', label: 'Clube Juvenil', icon: <Users2 size={40} />, desc: 'Protagonismo e escolha' },
                        { id: 'elective', label: 'Eletiva', icon: <BookOpen size={40} />, desc: 'Aprofunde seus conhecimentos' },
                    ].map(opt => (
                        <button
                            key={opt.id}
                            className="glass"
                            style={{ padding: '40px 20px', cursor: 'pointer', border: '1px solid var(--border)' }}
                            onClick={() => setActiveType(opt.id as any)}
                        >
                            <div style={{ color: 'var(--primary)', marginBottom: '15px' }}>{opt.icon}</div>
                            <h3 style={{ margin: '0 0 10px' }}>{opt.label}</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{opt.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (isActive === false) {
        return (
            <div style={{ maxWidth: '500px', margin: '100px auto', padding: '40px', textAlign: 'center' }} className="glass">
                <AlertTriangle size={60} color="#f59e0b" style={{ marginBottom: '20px' }} />
                <h2>Inscrições Encerradas</h2>
                <p style={{ color: 'var(--text-muted)' }}>As escolhas de {activeType} não estão disponíveis no momento.</p>
                <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => setActiveType(null)}>Voltar ao Menu</button>
            </div>
        );
    }

    if (submitted) {
        return (
            <div style={{ maxWidth: '500px', margin: '100px auto', padding: '40px', textAlign: 'center' }} className="glass">
                <CheckCircle size={60} color="#10b981" style={{ marginBottom: '20px' }} />
                <h2>Escolha Realizada!</h2>
                <p style={{ color: 'var(--text-muted)' }}>{student.name}, suas prioridades foram salvas com sucesso.</p>
                <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>Fazer outra escolha</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--primary)' }}>Prioridades de {activeType === 'tutor' ? 'Tutoria' : activeType === 'elective' ? 'Eletiva' : 'Clube'}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Selecione 5 opções em ordem de preferência.</p>
            </header>

            <div style={{ display: 'grid', gap: '15px' }}>
                {choices.map((selectedId, idx) => (
                    <div key={idx} className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '35px', height: '35px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {idx + 1}º
                        </div>
                        <select className="glass" style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none' }} value={selectedId} onChange={(e) => handleChoiceChange(idx, e.target.value)}>
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

            <div style={{ marginTop: '40px', display: 'flex', gap: '10px' }}>
                <button className="glass" style={{ flex: 1, padding: '16px' }} onClick={() => setActiveType(null)}>Cancelar</button>
                <button className="btn-primary" style={{ flex: 2, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={handleSubmit}>
                    Salvar Escolhas <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};
