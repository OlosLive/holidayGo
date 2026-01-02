import type { Profile, ProfileUpdate } from '../../../types/database';
import type { IProfileRepository } from '../interfaces';
import { supabase, supabaseWrite } from '../../supabaseClient';

/**
 * Supabase Profile Repository
 * Uses Supabase for data persistence with real-time subscriptions
 */
export class SupabaseProfileRepository implements IProfileRepository {
  async fetchAll(): Promise<{ data: Profile[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      return { data: [], error: err instanceof Error ? err.message : 'Erro ao carregar colaboradores' };
    }
  }

  async getById(id: string): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao carregar colaborador' };
    }
  }

  async create(profile: { id: string; name: string; email: string; role?: string | null; department?: string | null; hire_date?: string | null; status?: string; avatar_url?: string | null; vacation_balance?: number; vacation_used?: number }): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const { data, error } = await supabaseWrite
        .from('profiles')
        .insert(profile)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Profile, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao criar colaborador' };
    }
  }

  async update(id: string, updates: ProfileUpdate): Promise<{ error: string | null }> {
    try {
      const { error } = await supabaseWrite
        .from('profiles')
        .update(updates)
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao atualizar colaborador' };
    }
  }

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabaseWrite
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao excluir colaborador' };
    }
  }

  subscribe(callback: (event: 'INSERT' | 'UPDATE' | 'DELETE', profile: Profile) => void): () => void {
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
            callback('INSERT', payload.new as Profile);
          } else if (payload.eventType === 'UPDATE') {
            callback('UPDATE', payload.new as Profile);
          } else if (payload.eventType === 'DELETE') {
            callback('DELETE', payload.old as Profile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

