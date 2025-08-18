import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAnonymous: boolean;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAnonymous: true,
  });

  // Check session on mount
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setAuth((prev) => ({
        ...prev,
        user: data.session?.user ?? null,
        session: data.session ?? null,
        loading: false,
        isAnonymous: !data.session?.user,
      }));
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth({
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
        isAnonymous: !session?.user,
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
    setAuth((prev) => ({
      ...prev,
      user: data.user ?? null,
      session: data.session ?? null,
      loading: false,
      isAnonymous: !data.user,
    }));
    if (error) throw error;
    return data;
  }, []);

  // Register
  const signUp = useCallback(async (email: string, password: string) => {
    setAuth((prev) => ({ ...prev, loading: true }));
    const { data, error } = await supabase.auth.signUp({ email, password });
    setAuth((prev) => ({
      ...prev,
      user: data.user ?? null,
      session: data.session ?? null,
      loading: false,
      isAnonymous: !data.user,
    }));
    if (error) throw error;
    return data;
  }, []);

  // Logout
  const signOut = useCallback(async () => {
    setAuth((prev) => ({ ...prev, loading: true }));
    await supabase.auth.signOut();
    setAuth({ user: null, session: null, loading: false, isAnonymous: true });
  }, []);

  return {
    ...auth,
    signIn,
    signUp,
    signOut,
  };
}
