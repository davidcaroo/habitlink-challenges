import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAnonymous: boolean;
  isEmailVerified: boolean;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAnonymous: true,
    isEmailVerified: false,
  });

  // Check session on mount
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      const isEmailVerified = user?.email_confirmed_at != null;
      
      setAuth((prev) => ({
        ...prev,
        user: user,
        session: data.session ?? null,
        loading: false,
        isAnonymous: !user,
        isEmailVerified: isEmailVerified,
      }));
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      const isEmailVerified = user?.email_confirmed_at != null;
      
      setAuth({
        user: user,
        session: session ?? null,
        loading: false,
        isAnonymous: !user,
        isEmailVerified: isEmailVerified,
      });
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Login
  const signIn = useCallback(async (email: string, password: string) => {
    setAuth((prev) => ({ ...prev, loading: true }));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setAuth((prev) => ({
        ...prev,
        loading: false,
      }));
      throw error;
    }

    const user = data.user;
    const isEmailVerified = user?.email_confirmed_at != null;
    
    setAuth((prev) => ({
      ...prev,
      user: user ?? null,
      session: data.session ?? null,
      loading: false,
      isAnonymous: !user,
      isEmailVerified: isEmailVerified,
    }));

    // Si el usuario no ha verificado su email, lanzar un error específico
    if (user && !isEmailVerified) {
      throw new Error('Debes verificar tu email antes de acceder. Revisa tu bandeja de entrada.');
    }
    
    return data;
  }, []);

  // Register
  const signUp = useCallback(async (email: string, password: string) => {
    setAuth((prev) => ({ ...prev, loading: true }));
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    const user = data.user;
    const isEmailVerified = user?.email_confirmed_at != null;
    
    setAuth((prev) => ({
      ...prev,
      user: user ?? null,
      session: data.session ?? null,
      loading: false,
      isAnonymous: !user,
      isEmailVerified: isEmailVerified,
    }));
    
    if (error) throw error;
    return data;
  }, []);

  // Logout
  const signOut = useCallback(async () => {
    setAuth((prev) => ({ ...prev, loading: true }));
    await supabase.auth.signOut();
    setAuth({ user: null, session: null, loading: false, isAnonymous: true, isEmailVerified: false });
  }, []);

  // Resend verification email
  const resendVerificationEmail = useCallback(async () => {
    try {
      if (!auth.user?.email) {
        throw new Error('No hay un usuario logueado');
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: auth.user.email
      });
      
      if (error) throw error;
      
      toast.success('Correo de verificación reenviado');
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      toast.error(error.message || 'Error al reenviar el correo de verificación');
    }
  }, [auth.user]);

  return {
    ...auth,
    signIn,
    signUp,
    signOut,
    resendVerificationEmail,
  };
}
