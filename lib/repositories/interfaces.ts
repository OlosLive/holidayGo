import type { Profile, ProfileInsert, ProfileUpdate, Vacation, VacationInsert } from '../../types/database';

/**
 * Profile Repository Interface
 * Defines the contract for profile data operations
 */
export interface IProfileRepository {
  /**
   * Fetch all profiles
   */
  fetchAll(): Promise<{ data: Profile[]; error: string | null }>;

  /**
   * Get a single profile by ID
   */
  getById(id: string): Promise<{ data: Profile | null; error: string | null }>;

  /**
   * Create a new profile
   */
  create(profile: Omit<ProfileInsert, 'id'> & { id: string }): Promise<{ data: Profile | null; error: string | null }>;

  /**
   * Update an existing profile
   */
  update(id: string, updates: ProfileUpdate): Promise<{ error: string | null }>;

  /**
   * Delete a profile
   */
  delete(id: string): Promise<{ error: string | null }>;

  /**
   * Subscribe to real-time changes (optional - may not be supported by all implementations)
   * Returns an unsubscribe function
   */
  subscribe?(callback: (event: 'INSERT' | 'UPDATE' | 'DELETE', profile: Profile) => void): () => void;
}

/**
 * Vacation Repository Interface
 * Defines the contract for vacation data operations
 */
export interface IVacationRepository {
  /**
   * Fetch all vacations
   */
  fetchAll(): Promise<{ data: Vacation[]; error: string | null }>;

  /**
   * Fetch vacations with optional filters
   */
  fetch(filters?: { userId?: string; year?: number; month?: number }): Promise<{ data: Vacation[]; error: string | null }>;

  /**
   * Create a new vacation entry
   */
  create(vacation: VacationInsert): Promise<{ data: Vacation | null; error: string | null }>;

  /**
   * Create multiple vacation entries
   */
  createMany(vacations: VacationInsert[]): Promise<{ data: Vacation[]; error: string | null }>;

  /**
   * Delete a vacation by ID
   */
  delete(id: string): Promise<{ error: string | null }>;

  /**
   * Delete multiple vacations by IDs
   */
  deleteMany(ids: string[]): Promise<{ error: string | null }>;

  /**
   * Subscribe to real-time changes (optional - may not be supported by all implementations)
   * Returns an unsubscribe function
   */
  subscribe?(callback: (event: 'INSERT' | 'UPDATE' | 'DELETE', vacation: Vacation) => void): () => void;
}



