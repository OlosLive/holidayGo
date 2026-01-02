import type { Profile, ProfileInsert, ProfileUpdate } from '../../../types/database';
import type { IProfileRepository } from '../interfaces';
import { initialMockProfiles, STORAGE_KEYS, generateId } from './mockData';

/**
 * Mock Profile Repository
 * Uses localStorage for persistence
 */
export class MockProfileRepository implements IProfileRepository {
  private getProfiles(): Profile[] {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock data if empty
    this.saveProfiles(initialMockProfiles);
    return initialMockProfiles;
  }

  private saveProfiles(profiles: Profile[]): void {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }

  async fetchAll(): Promise<{ data: Profile[]; error: string | null }> {
    try {
      const profiles = this.getProfiles();
      return { data: profiles.sort((a, b) => a.name.localeCompare(b.name)), error: null };
    } catch (err) {
      return { data: [], error: err instanceof Error ? err.message : 'Erro ao carregar colaboradores' };
    }
  }

  async getById(id: string): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const profiles = this.getProfiles();
      const profile = profiles.find(p => p.id === id) || null;
      return { data: profile, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao carregar colaborador' };
    }
  }

  async create(profile: Omit<ProfileInsert, 'id'> & { id: string }): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const profiles = this.getProfiles();
      
      // Check if profile with same email exists
      if (profiles.some(p => p.email === profile.email)) {
        return { data: null, error: 'Já existe um colaborador com este email' };
      }

      const now = new Date().toISOString();
      const newProfile: Profile = {
        id: profile.id || generateId(),
        name: profile.name,
        email: profile.email,
        role: profile.role || null,
        department: profile.department || null,
        hire_date: profile.hire_date || null,
        status: profile.status || 'active',
        avatar_url: profile.avatar_url || null,
        vacation_balance: profile.vacation_balance ?? 30,
        vacation_used: profile.vacation_used ?? 0,
        created_at: now,
        updated_at: now,
      };

      profiles.push(newProfile);
      this.saveProfiles(profiles);

      return { data: newProfile, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao criar colaborador' };
    }
  }

  async update(id: string, updates: ProfileUpdate): Promise<{ error: string | null }> {
    try {
      const profiles = this.getProfiles();
      const index = profiles.findIndex(p => p.id === id);
      
      if (index === -1) {
        return { error: 'Colaborador não encontrado' };
      }

      profiles[index] = {
        ...profiles[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      this.saveProfiles(profiles);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao atualizar colaborador' };
    }
  }

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      const profiles = this.getProfiles();
      const filtered = profiles.filter(p => p.id !== id);
      
      if (filtered.length === profiles.length) {
        return { error: 'Colaborador não encontrado' };
      }

      this.saveProfiles(filtered);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao excluir colaborador' };
    }
  }

  // Mock doesn't support real-time subscriptions
  subscribe(): () => void {
    // No-op for mock
    return () => {};
  }
}





