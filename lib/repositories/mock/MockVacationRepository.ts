import type { Vacation, VacationInsert } from '../../../types/database';
import type { IVacationRepository } from '../interfaces';
import { generateInitialMockVacations, STORAGE_KEYS, generateId } from './mockData';

/**
 * Mock Vacation Repository
 * Uses localStorage for persistence
 */
export class MockVacationRepository implements IVacationRepository {
  private getVacations(): Vacation[] {
    const stored = localStorage.getItem(STORAGE_KEYS.VACATIONS);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock data if empty
    const initial = generateInitialMockVacations();
    this.saveVacations(initial);
    return initial;
  }

  private saveVacations(vacations: Vacation[]): void {
    localStorage.setItem(STORAGE_KEYS.VACATIONS, JSON.stringify(vacations));
  }

  private sortByDate(vacations: Vacation[]): Vacation[] {
    return vacations.sort((a, b) => 
      new Date(a.vacation_date).getTime() - new Date(b.vacation_date).getTime()
    );
  }

  async fetchAll(): Promise<{ data: Vacation[]; error: string | null }> {
    try {
      const vacations = this.getVacations();
      return { data: this.sortByDate(vacations), error: null };
    } catch (err) {
      return { data: [], error: err instanceof Error ? err.message : 'Erro ao carregar férias' };
    }
  }

  async fetch(filters?: { userId?: string; year?: number; month?: number }): Promise<{ data: Vacation[]; error: string | null }> {
    try {
      let vacations = this.getVacations();

      if (filters?.userId) {
        vacations = vacations.filter(v => v.user_id === filters.userId);
      }
      if (filters?.year) {
        vacations = vacations.filter(v => v.year === filters.year);
      }
      if (filters?.month) {
        vacations = vacations.filter(v => v.month === filters.month);
      }

      return { data: this.sortByDate(vacations), error: null };
    } catch (err) {
      return { data: [], error: err instanceof Error ? err.message : 'Erro ao carregar férias' };
    }
  }

  async create(vacation: VacationInsert): Promise<{ data: Vacation | null; error: string | null }> {
    try {
      const vacations = this.getVacations();

      // Check if vacation already exists for this user/date
      const exists = vacations.some(v => 
        v.user_id === vacation.user_id && 
        v.year === vacation.year && 
        v.month === vacation.month && 
        v.day === vacation.day
      );

      if (exists) {
        return { data: null, error: 'Já existe férias agendadas para esta data' };
      }

      const now = new Date().toISOString();
      const newVacation: Vacation = {
        id: vacation.id || generateId(),
        user_id: vacation.user_id,
        vacation_date: vacation.vacation_date,
        year: vacation.year,
        month: vacation.month,
        day: vacation.day,
        status: vacation.status || 'planned',
        created_at: now,
        updated_at: now,
      };

      vacations.push(newVacation);
      this.saveVacations(vacations);

      return { data: newVacation, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao criar férias' };
    }
  }

  async createMany(vacationInputs: VacationInsert[]): Promise<{ data: Vacation[]; error: string | null }> {
    try {
      const vacations = this.getVacations();
      const now = new Date().toISOString();
      const newVacations: Vacation[] = [];

      for (const input of vacationInputs) {
        // Skip if already exists
        const exists = vacations.some(v => 
          v.user_id === input.user_id && 
          v.year === input.year && 
          v.month === input.month && 
          v.day === input.day
        );

        if (!exists) {
          const newVacation: Vacation = {
            id: input.id || generateId(),
            user_id: input.user_id,
            vacation_date: input.vacation_date,
            year: input.year,
            month: input.month,
            day: input.day,
            status: input.status || 'planned',
            created_at: now,
            updated_at: now,
          };
          newVacations.push(newVacation);
          vacations.push(newVacation);
        }
      }

      this.saveVacations(vacations);
      return { data: newVacations, error: null };
    } catch (err) {
      return { data: [], error: err instanceof Error ? err.message : 'Erro ao criar férias' };
    }
  }

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      const vacations = this.getVacations();
      const filtered = vacations.filter(v => v.id !== id);
      
      if (filtered.length === vacations.length) {
        return { error: 'Férias não encontradas' };
      }

      this.saveVacations(filtered);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao excluir férias' };
    }
  }

  async deleteMany(ids: string[]): Promise<{ error: string | null }> {
    try {
      const vacations = this.getVacations();
      const filtered = vacations.filter(v => !ids.includes(v.id));
      this.saveVacations(filtered);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao excluir férias' };
    }
  }

  // Mock doesn't support real-time subscriptions
  subscribe(): () => void {
    // No-op for mock
    return () => {};
  }
}






