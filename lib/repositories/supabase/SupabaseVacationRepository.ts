import type { Vacation, VacationInsert } from '../../../types/database';
import type { IVacationRepository } from '../interfaces';
import { supabase, supabaseWrite } from '../../supabaseClient';

/**
 * Supabase Vacation Repository
 * Uses Supabase for data persistence with real-time subscriptions
 */
export class SupabaseVacationRepository implements IVacationRepository {
  async fetchAll(): Promise<{ data: Vacation[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('vacations')
        .select('*')
        .order('vacation_date', { ascending: true });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      return { data: [], error: err instanceof Error ? err.message : 'Erro ao carregar férias' };
    }
  }

  async fetch(filters?: { userId?: string; year?: number; month?: number }): Promise<{ data: Vacation[]; error: string | null }> {
    try {
      let query = supabase.from('vacations').select('*');

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters?.year) {
        query = query.eq('year', filters.year);
      }
      if (filters?.month) {
        query = query.eq('month', filters.month);
      }

      const { data, error } = await query.order('vacation_date', { ascending: true });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      return { data: [], error: err instanceof Error ? err.message : 'Erro ao carregar férias' };
    }
  }

  async create(vacation: VacationInsert): Promise<{ data: Vacation | null; error: string | null }> {
    try {
      const { data, error } = await supabaseWrite
        .from('vacations')
        .insert(vacation)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Vacation, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao criar férias' };
    }
  }

  async createMany(vacations: VacationInsert[]): Promise<{ data: Vacation[]; error: string | null }> {
    try {
      const { data, error } = await supabaseWrite
        .from('vacations')
        .insert(vacations)
        .select();

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: (data || []) as Vacation[], error: null };
    } catch (err) {
      return { data: [], error: err instanceof Error ? err.message : 'Erro ao criar férias' };
    }
  }

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabaseWrite
        .from('vacations')
        .delete()
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao excluir férias' };
    }
  }

  async deleteMany(ids: string[]): Promise<{ error: string | null }> {
    try {
      const { error } = await supabaseWrite
        .from('vacations')
        .delete()
        .in('id', ids);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao excluir férias' };
    }
  }

  subscribe(callback: (event: 'INSERT' | 'UPDATE' | 'DELETE', vacation: Vacation) => void): () => void {
    const channel = supabase
      .channel('vacations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vacations',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            callback('INSERT', payload.new as Vacation);
          } else if (payload.eventType === 'UPDATE') {
            callback('UPDATE', payload.new as Vacation);
          } else if (payload.eventType === 'DELETE') {
            callback('DELETE', payload.old as Vacation);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

