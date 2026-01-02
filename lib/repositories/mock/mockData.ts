import type { Profile, Vacation } from '../../../types/database';

/**
 * Initial mock profiles
 * These are loaded when localStorage is empty
 */
/**
 * Initial mock profiles
 * vacation_balance = 30 (direito anual) - vacation_used
 */
export const initialMockProfiles: Profile[] = [
  {
    id: 'mock-user-1',
    name: 'Ana Silva',
    email: 'ana.silva@empresa.com',
    role: 'Desenvolvedora Senior',
    department: 'Tecnologia',
    hire_date: '2021-03-15',
    status: 'active',
    avatar_url: null,
    vacation_balance: 25,  // 30 - 5 = 25 restantes
    vacation_used: 5,
    created_at: '2021-03-15T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'mock-user-2',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@empresa.com',
    role: 'Product Manager',
    department: 'Produto',
    hire_date: '2020-06-01',
    status: 'active',
    avatar_url: null,
    vacation_balance: 20,  // 30 - 10 = 20 restantes
    vacation_used: 10,
    created_at: '2020-06-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'mock-user-3',
    name: 'Beatriz Santos',
    email: 'beatriz.santos@empresa.com',
    role: 'Designer UX',
    department: 'Design',
    hire_date: '2022-01-10',
    status: 'active',
    avatar_url: null,
    vacation_balance: 30,  // 30 - 0 = 30 restantes
    vacation_used: 0,
    created_at: '2022-01-10T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'mock-user-4',
    name: 'Daniel Costa',
    email: 'daniel.costa@empresa.com',
    role: 'Desenvolvedor Pleno',
    department: 'Tecnologia',
    hire_date: '2023-02-20',
    status: 'active',
    avatar_url: null,
    vacation_balance: 15,  // 30 - 15 = 15 restantes
    vacation_used: 15,
    created_at: '2023-02-20T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'mock-user-5',
    name: 'Elena Rodrigues',
    email: 'elena.rodrigues@empresa.com',
    role: 'Analista de Dados',
    department: 'Analytics',
    hire_date: '2021-09-05',
    status: 'active',
    avatar_url: null,
    vacation_balance: 10,  // 30 - 20 = 10 restantes
    vacation_used: 20,
    created_at: '2021-09-05T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'mock-user-6',
    name: 'Fernando Lima',
    email: 'fernando.lima@empresa.com',
    role: 'Tech Lead',
    department: 'Tecnologia',
    hire_date: '2019-11-12',
    status: 'inactive',
    avatar_url: null,
    vacation_balance: 0,   // 30 - 30 = 0 restantes
    vacation_used: 30,
    created_at: '2019-11-12T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  // Usuários com saldo CRÍTICO (≥45 dias acumulados - risco de vencimento)
  {
    id: 'mock-user-7',
    name: 'Gustavo Mendes',
    email: 'gustavo.mendes@empresa.com',
    role: 'Arquiteto de Software',
    department: 'Tecnologia',
    hire_date: '2018-03-01',
    status: 'active',
    avatar_url: null,
    vacation_balance: 52,  // Acumulou 2 anos sem tirar férias completas
    vacation_used: 8,
    created_at: '2018-03-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'mock-user-8',
    name: 'Helena Barbosa',
    email: 'helena.barbosa@empresa.com',
    role: 'Gerente de Projetos',
    department: 'PMO',
    hire_date: '2017-08-15',
    status: 'active',
    avatar_url: null,
    vacation_balance: 48,  // Próximo de perder dias
    vacation_used: 12,
    created_at: '2017-08-15T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
];

/**
 * Generate initial mock vacations
 * Creates some vacation days for the current and next month
 */
export const generateInitialMockVacations = (): Vacation[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-indexed
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  const vacations: Vacation[] = [];
  let idCounter = 1;

  // Ana Silva: 5 days in current month (vacation used = 5)
  for (let day = 10; day <= 14; day++) {
    const vacationDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    vacations.push({
      id: `mock-vacation-${idCounter++}`,
      user_id: 'mock-user-1',
      vacation_date: vacationDate,
      year: currentYear,
      month: currentMonth,
      day,
      status: 'planned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  // Carlos Oliveira: 10 days across current and next month
  for (let day = 20; day <= 25; day++) {
    const vacationDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    vacations.push({
      id: `mock-vacation-${idCounter++}`,
      user_id: 'mock-user-2',
      vacation_date: vacationDate,
      year: currentYear,
      month: currentMonth,
      day,
      status: 'planned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  for (let day = 1; day <= 4; day++) {
    const vacationDate = `${nextMonthYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    vacations.push({
      id: `mock-vacation-${idCounter++}`,
      user_id: 'mock-user-2',
      vacation_date: vacationDate,
      year: nextMonthYear,
      month: nextMonth,
      day,
      status: 'planned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  // Daniel Costa: 15 days in next month
  for (let day = 5; day <= 19; day++) {
    const vacationDate = `${nextMonthYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    vacations.push({
      id: `mock-vacation-${idCounter++}`,
      user_id: 'mock-user-4',
      vacation_date: vacationDate,
      year: nextMonthYear,
      month: nextMonth,
      day,
      status: 'planned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  return vacations;
};

/**
 * LocalStorage keys for mock data
 */
export const STORAGE_KEYS = {
  PROFILES: 'holidaygo_mock_profiles',
  VACATIONS: 'holidaygo_mock_vacations',
} as const;

/**
 * Helper to generate a unique ID
 */
export const generateId = (): string => {
  return `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

