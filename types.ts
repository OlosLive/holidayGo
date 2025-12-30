
export type UserStatus = 'Ativo' | 'Inativo' | 'Férias' | 'Pendente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  hireDate: string;
  status: UserStatus;
  avatar?: string;
  vacationBalance: number;
  vacationUsed: number;
  lastAccess?: string;
  plannedVacations: number[]; // Days of the current month
}

export interface SummaryData {
  name: string;
  scheduled: number;
  remaining: number;
  status: 'Normal' | 'Crítico' | 'Bom' | 'Atenção';
}
