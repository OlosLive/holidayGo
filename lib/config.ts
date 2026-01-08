/**
 * Application configuration
 * Reads environment variables and provides typed configuration
 */
export const config = {
  /**
   * When true, uses mock data stored in localStorage instead of Supabase
   * Set VITE_USE_MOCK_DATA=true in .env.local to enable
   */
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  
  /**
   * Supabase configuration
   */
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
};








