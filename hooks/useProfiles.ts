import { useState, useEffect, useCallback } from 'react';
import type { Profile, ProfileInsert, ProfileUpdate } from '../types/database';
import { getProfileRepository } from '../lib/repositories';

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

  const repository = getProfileRepository();

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await repository.fetchAll();
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setProfiles(data);
    }
    
    setLoading(false);
  }, [repository]);

  const getProfile = useCallback(async (id: string): Promise<Profile | null> => {
    const { data } = await repository.getById(id);
    return data;
  }, [repository]);

  const createProfile = useCallback(async (
    profile: Omit<ProfileInsert, 'id'> & { id: string }
  ): Promise<{ data: Profile | null; error: string | null }> => {
    const result = await repository.create(profile);
    
    if (!result.error && result.data) {
      // Update local state
      setProfiles((prev) => [...prev, result.data!].sort((a, b) => a.name.localeCompare(b.name)));
    }
    
    return result;
  }, [repository]);

  const updateProfile = useCallback(async (
    id: string,
    updates: ProfileUpdate
  ): Promise<{ error: string | null }> => {
    const result = await repository.update(id, updates);
    
    if (!result.error) {
      // Update local state
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    }
    
    return result;
  }, [repository]);

  const deleteProfile = useCallback(async (id: string): Promise<{ error: string | null }> => {
    const result = await repository.delete(id);
    
    if (!result.error) {
      // Update local state
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    }
    
    return result;
  }, [repository]);

  // Fetch profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Subscribe to real-time changes (if supported)
  useEffect(() => {
    if (repository.subscribe) {
      const unsubscribe = repository.subscribe((event, profile) => {
        if (event === 'INSERT') {
          setProfiles((prev) => 
            [...prev, profile].sort((a, b) => a.name.localeCompare(b.name))
          );
        } else if (event === 'UPDATE') {
          setProfiles((prev) =>
            prev.map((p) => (p.id === profile.id ? profile : p))
          );
        } else if (event === 'DELETE') {
          setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
        }
      });

      return unsubscribe;
    }
  }, [repository]);

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
