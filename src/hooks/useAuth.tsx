import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    role: 'super_admin' | 'admin' | 'manager' | 'student';
    school_id: string | null;
    needs_password_change: boolean;
    schools?: {
        id: string;
        name: string;
        slug: string;
    };
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    error: string | null;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
            if (sessionError) {
                setError('Erro ao carregar sessão');
                setLoading(false);
                return;
            }

            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            // First, get the basic profile without JOIN
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) {
                console.error('Profile fetch error:', profileError);
                setError('Erro ao carregar perfil');
                setProfile(null);
                setLoading(false);
                return;
            }

            // If profile has a school_id, fetch the school data separately
            if (profileData.school_id) {
                const { data: schoolData } = await supabase
                    .from('schools')
                    .select('*')
                    .eq('id', profileData.school_id)
                    .single();

                setProfile({
                    ...profileData,
                    schools: schoolData || null
                });
            } else {
                // SuperAdmin or users without school
                setProfile(profileData);
            }

            setError(null);
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
            setError('Erro inesperado ao carregar perfil');
        } finally {
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        if (user) {
            setLoading(true);
            await fetchProfile(user.id);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, error, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
