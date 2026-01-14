import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, supabaseWrite } from '../lib/supabaseClient';
import type { Profile } from '../types/database';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: false,
    initialized: false,
    error: null,
  });
  
  const signInResolverRef = useRef<{
    resolve: (value: { error: AuthError | null }) => void;
    email: string;
  } | null>(null);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }, []);

  // Verificar sessão inicial ao carregar a aplicação
  useEffect(() => {
    let mounted = true;
    
    setState(prev => ({ ...prev, initialized: false, loading: true }));
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session?.user) {
        setState(prev => ({
          ...prev,
          user: session.user,
          session: session,
          initialized: true,
          loading: false,
        }));
        
        fetchProfile(session.user.id).then(profile => {
          if (mounted) {
            setState(prev => ({ ...prev, profile }));
          }
        });
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          profile: null,
          session: null,
          initialized: true,
          loading: false,
        }));
      }
    }).catch(() => {
      if (mounted) {
        setState(prev => ({
          ...prev,
          initialized: true,
          loading: false,
        }));
      }
    });
    
    return () => {
      mounted = false;
    };
  }, [fetchProfile]);

  // Escutar mudanças de autenticação
  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          if (signInResolverRef.current && signInResolverRef.current.email === session.user.email) {
            signInResolverRef.current.resolve({ error: null });
            signInResolverRef.current = null;
          }
          
          setState(prev => ({
            ...prev,
            user: session.user,
            session: session,
            loading: false,
            initialized: true,
            error: null,
          }));
          
          fetchProfile(session.user.id).then(profile => {
            if (mounted) {
              setState(prev => ({ ...prev, profile }));
            }
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            initialized: true,
            error: null,
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    return new Promise((resolve) => {
      signInResolverRef.current = { resolve, email };
      
      const timeoutId = setTimeout(() => {
        if (signInResolverRef.current) {
          signInResolverRef.current = null;
          setState((prev) => ({ ...prev, loading: false }));
          
          supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
              resolve({ error: null });
            } else {
              resolve({ error: { message: 'Login timeout', name: 'AuthError', status: 408 } as AuthError });
            }
          }).catch(() => {
            resolve({ error: { message: 'Login timeout', name: 'AuthError', status: 408 } as AuthError });
          });
        }
      }, 10000);
      
      supabase.auth.signInWithPassword({ email, password })
        .then(({ error }) => {
          clearTimeout(timeoutId);
          if (error) {
            signInResolverRef.current = null;
            setState((prev) => ({ ...prev, loading: false }));
            resolve({ error });
          }
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          signInResolverRef.current = null;
          setState((prev) => ({ ...prev, loading: false }));
          resolve({ error: err as AuthError });
        });
    });
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      setState((prev) => ({ ...prev, loading: false }));
      return { error };
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false }));
      return { error: err as AuthError };
    }
  }, []);

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    await supabase.auth.signOut();
    setState({
      user: null,
      profile: null,
      session: null,
      loading: false,
      initialized: true,
      error: null,
    });
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<{ error: AuthError | null }> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/auth?recovery=true`,
      });
      setState((prev) => ({ ...prev, loading: false }));
      return { error };
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false }));
      return { error: err as AuthError };
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string): Promise<{ error: AuthError | null }> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      setState((prev) => ({ ...prev, loading: false }));
      return { error };
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false }));
      return { error: err as AuthError };
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!state.user) {
      return { error: new Error('No user logged in') };
    }

    const { error } = await supabaseWrite
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id);

    if (!error) {
      const profile = await fetchProfile(state.user.id);
      setState((prev) => ({ ...prev, profile }));
    }

    return { error: error ? new Error(error.message) : null };
  }, [state.user, fetchProfile]);

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
