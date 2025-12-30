import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Vacation, VacationInsert } from '../types/database';

interface UseVacationsReturn {
  vacations: Vacation[];
  loading: boolean;
  error: string | null;
  fetchVacations: (filters?: { userId?: string; year?: number; month?: number }) => Promise<void>;
  fetchAllVacations: () => Promise<void>;
  getVacationDays: (userId: string, year: number, month: number) => number[];
  toggleVacationDay: (userId: string, year: number, month: number, day: number) => Promise<{ error: string | null }>;
  addVacationDays: (userId: string, year: number, month: number, days: number[]) => Promise<{ error: string | null }>;
  removeVacationDays: (userId: string, year: number, month: number, days: number[]) => Promise<{ error: string | null }>;
}

export const useVacations = (): UseVacationsReturn => {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllVacations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('vacations')
        .select('*')
        .order('vacation_date', { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setVacations(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar férias';
      setError(message);
      console.error('Error fetching vacations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVacations = useCallback(async (filters?: { userId?: string; year?: number; month?: number }) => {
    setLoading(true);
    setError(null);
    
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

      const { data, error: fetchError } = await query.order('vacation_date', { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setVacations(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar férias';
      setError(message);
      console.error('Error fetching vacations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get vacation days for a specific user/month/year
  const getVacationDays = useCallback((userId: string, year: number, month: number): number[] => {
    return vacations
      .filter(v => v.user_id === userId && v.year === year && v.month === month)
      .map(v => v.day);
  }, [vacations]);

  // Toggle a single vacation day (add if not exists, remove if exists)
  const toggleVacationDay = useCallback(async (
    userId: string,
    year: number,
    month: number,
    day: number
  ): Promise<{ error: string | null }> => {
    try {
      // Check if the day already exists
      const existingVacation = vacations.find(
        v => v.user_id === userId && v.year === year && v.month === month && v.day === day
      );

      if (existingVacation) {
        // Remove the vacation day
        const { error: deleteError } = await supabase
          .from('vacations')
          .delete()
          .eq('id', existingVacation.id);

        if (deleteError) {
          return { error: deleteError.message };
        }

        // Update local state
        setVacations(prev => prev.filter(v => v.id !== existingVacation.id));
      } else {
        // Add the vacation day
        const vacationDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const newVacation: VacationInsert = {
          user_id: userId,
          vacation_date: vacationDate,
          year,
          month,
          day,
          status: 'planned',
        };

        const { data, error: insertError } = await supabase
          .from('vacations')
          .insert(newVacation)
          .select()
          .single();

        if (insertError) {
          return { error: insertError.message };
        }

        // Update local state
        setVacations(prev => [...prev, data].sort((a, b) => 
          new Date(a.vacation_date).getTime() - new Date(b.vacation_date).getTime()
        ));
      }

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar férias';
      return { error: message };
    }
  }, [vacations]);

  // Add multiple vacation days at once
  const addVacationDays = useCallback(async (
    userId: string,
    year: number,
    month: number,
    days: number[]
  ): Promise<{ error: string | null }> => {
    try {
      const newVacations: VacationInsert[] = days.map(day => {
        const vacationDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return {
          user_id: userId,
          vacation_date: vacationDate,
          year,
          month,
          day,
          status: 'planned',
        };
      });

      const { data, error: insertError } = await supabase
        .from('vacations')
        .insert(newVacations)
        .select();

      if (insertError) {
        return { error: insertError.message };
      }

      // Update local state
      setVacations(prev => [...prev, ...(data || [])].sort((a, b) => 
        new Date(a.vacation_date).getTime() - new Date(b.vacation_date).getTime()
      ));

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao adicionar férias';
      return { error: message };
    }
  }, []);

  // Remove multiple vacation days at once
  const removeVacationDays = useCallback(async (
    userId: string,
    year: number,
    month: number,
    days: number[]
  ): Promise<{ error: string | null }> => {
    try {
      const vacationsToRemove = vacations.filter(
        v => v.user_id === userId && v.year === year && v.month === month && days.includes(v.day)
      );

      if (vacationsToRemove.length === 0) {
        return { error: null };
      }

      const ids = vacationsToRemove.map(v => v.id);

      const { error: deleteError } = await supabase
        .from('vacations')
        .delete()
        .in('id', ids);

      if (deleteError) {
        return { error: deleteError.message };
      }

      // Update local state
      setVacations(prev => prev.filter(v => !ids.includes(v.id)));

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover férias';
      return { error: message };
    }
  }, [vacations]);

  // Fetch all vacations on mount
  useEffect(() => {
    fetchAllVacations();
  }, [fetchAllVacations]);

  // Subscribe to real-time changes
  useEffect(() => {
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
            setVacations((prev) => 
              [...prev, payload.new as Vacation].sort((a, b) => 
                new Date(a.vacation_date).getTime() - new Date(b.vacation_date).getTime()
              )
            );
          } else if (payload.eventType === 'UPDATE') {
            setVacations((prev) =>
              prev.map((v) => (v.id === payload.new.id ? payload.new as Vacation : v))
            );
          } else if (payload.eventType === 'DELETE') {
            setVacations((prev) => prev.filter((v) => v.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    vacations,
    loading,
    error,
    fetchVacations,
    fetchAllVacations,
    getVacationDays,
    toggleVacationDay,
    addVacationDays,
    removeVacationDays,
  };
};

