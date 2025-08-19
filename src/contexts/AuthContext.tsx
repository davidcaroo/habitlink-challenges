import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextValue {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAnonymous: boolean;
    isEmailVerified: boolean;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();

    // Memoize context value for performance
    const value = useMemo(
        () => ({
            user: auth.user,
            session: auth.session,
            loading: auth.loading,
            isAnonymous: auth.isAnonymous,
            isEmailVerified: auth.isEmailVerified,
            signIn: auth.signIn,
            signUp: auth.signUp,
            signOut: auth.signOut,
            resendVerificationEmail: auth.resendVerificationEmail,
        }),
        [
            auth.user,
            auth.session,
            auth.loading,
            auth.isAnonymous,
            auth.isEmailVerified,
            auth.signIn,
            auth.signUp,
            auth.signOut,
            auth.resendVerificationEmail,
        ]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider');
    return ctx;
}
