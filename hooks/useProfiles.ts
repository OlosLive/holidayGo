import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Profile, ProfileInsert, ProfileUpdate } from '../types/database';

interface UseProfilesReturn {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  fetchProfiles: () => Promise<void>;
  getProfile: (id: string) => Promise<Profile | null>;
  createProfile: (profile: Omit<ProfileInsert, 'id'> & { id: string }) => Promise<{ data: Profile | null; error: string | null }>;
  updateProfile: (id: string, updates: ProfileUpdate) => Promise<{ error: string | null }>;
  deleteProfile: (id: string) => Promise<{ error: string | null }>;
}

export const useProfiles = (): UseProfilesReturn => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setProfiles(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar colaboradores';
      setError(message);
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfile = useCallback(async (id: string): Promise<Profile | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  }, []);

  const createProfile = useCallback(async (
    profile: Omit<ProfileInsert, 'id'> & { id: string }
  ): Promise<{ data: Profile | null; error: string | null }> => {
    try {
      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();

      if (insertError) {
        return { data: null, error: insertError.message };
      }

      // Update local state
      setProfiles((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar colaborador';
      return { data: null, error: message };
    }
  }, []);

  const updateProfile = useCallback(async (
    id: string,
    updates: ProfileUpdate
  ): Promise<{ error: string | null }> => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);

      if (updateError) {
        return { error: updateError.message };
      }

      // Update local state
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar colaborador';
      return { error: message };
    }
  }, []);

  const deleteProfile = useCallback(async (id: string): Promise<{ error: string | null }> => {
    try {
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return { error: deleteError.message };
      }

      // Update local state
      setProfiles((prev) => prev.filter((p) => p.id !== id));

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir colaborador';
      return { error: message };
    }
  }, []);

  // Fetch profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProfiles((prev) => 
              [...prev, payload.new as Profile].sort((a, b) => a.name.localeCompare(b.name))
            );
          } else if (payload.eventType === 'UPDATE') {
            setProfiles((prev) =>
              prev.map((p) => (p.id === payload.new.id ? payload.new as Profile : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setProfiles((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
  };
};

