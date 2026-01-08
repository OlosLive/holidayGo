import { config } from '../config';
import type { IProfileRepository, IVacationRepository } from './interfaces';
import { MockProfileRepository } from './mock/MockProfileRepository';
import { MockVacationRepository } from './mock/MockVacationRepository';
import { SupabaseProfileRepository } from './supabase/SupabaseProfileRepository';
import { SupabaseVacationRepository } from './supabase/SupabaseVacationRepository';

// Singleton instances
let profileRepository: IProfileRepository | null = null;
let vacationRepository: IVacationRepository | null = null;

/**
 * Get the Profile Repository instance
 * Returns mock or Supabase implementation based on VITE_USE_MOCK_DATA
 */
export const getProfileRepository = (): IProfileRepository => {
  if (!profileRepository) {
    profileRepository = config.useMockData
      ? new MockProfileRepository()
      : new SupabaseProfileRepository();
    
    if (config.useMockData) {
      console.log('📦 Using MOCK Profile Repository (localStorage)');
    }
  }
  return profileRepository;
};

/**
 * Get the Vacation Repository instance
 * Returns mock or Supabase implementation based on VITE_USE_MOCK_DATA
 */
export const getVacationRepository = (): IVacationRepository => {
  if (!vacationRepository) {
    vacationRepository = config.useMockData
      ? new MockVacationRepository()
      : new SupabaseVacationRepository();
    
    if (config.useMockData) {
      console.log('📦 Using MOCK Vacation Repository (localStorage)');
    }
  }
  return vacationRepository;
};

/**
 * Reset repositories (useful for testing)
 */
export const resetRepositories = (): void => {
  profileRepository = null;
  vacationRepository = null;
};

// Re-export interfaces for convenience
export type { IProfileRepository, IVacationRepository } from './interfaces';








