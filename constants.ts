
import { User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Allan',
    email: 'allan@holidaygo.com',
    role: 'Desenvolvedor Senior',
    department: 'Tecnologia',
    hireDate: '2021-05-10',
    status: 'Ativo',
    vacationBalance: 65,
    vacationUsed: 4,
    lastAccess: 'Hoje, 09:30',
    plannedVacations: [5, 6, 7, 8, 9]
  },
  {
    id: '2',
    name: 'Aline Ribeiro',
    email: 'aline@holidaygo.com',
    role: 'Gerente de Projetos',
    department: 'Produto & Design',
    hireDate: '2020-11-15',
    status: 'Ativo',
    vacationBalance: 12,
    vacationUsed: 10,
    lastAccess: 'Ontem, 18:00',
    avatar: 'https://picsum.photos/id/64/100/100',
    plannedVacations: []
  },
  {
    id: '3',
    name: 'Alexandre',
    email: 'alexandre@holidaygo.com',
    role: 'QA Analyst',
    department: 'Tecnologia',
    hireDate: '2022-01-20',
    status: 'Férias',
    vacationBalance: 20,
    vacationUsed: 15,
    lastAccess: '3 dias atrás',
    plannedVacations: [10, 11, 12, 13, 14]
  },
  {
    id: '4',
    name: 'Douglas',
    email: 'douglas@holidaygo.com',
    role: 'Designer',
    department: 'Produto & Design',
    hireDate: '2023-03-05',
    status: 'Inativo',
    vacationBalance: 0,
    vacationUsed: 0,
    lastAccess: '2 meses atrás',
    avatar: 'https://picsum.photos/id/91/100/100',
    plannedVacations: []
  },
  {
    id: '5',
    name: 'Daniel Munhoz',
    email: 'daniel@holidaygo.com',
    role: 'Tech Lead',
    department: 'Tecnologia',
    hireDate: '2019-08-12',
    status: 'Ativo',
    vacationBalance: 28,
    vacationUsed: 2,
    lastAccess: 'Hoje, 10:15',
    plannedVacations: []
  },
  {
    id: '6',
    name: 'Jun',
    email: 'jun@holidaygo.com',
    role: 'Backend Dev',
    department: 'Tecnologia',
    hireDate: '2022-12-01',
    status: 'Ativo',
    vacationBalance: 15,
    vacationUsed: 5,
    lastAccess: 'Ontem, 16:20',
    plannedVacations: []
  },
  {
    id: '7',
    name: 'Newton',
    email: 'newton@holidaygo.com',
    role: 'Engenheiro de Dados',
    department: 'Tecnologia',
    hireDate: '2024-01-10',
    status: 'Ativo',
    vacationBalance: 5,
    vacationUsed: 0,
    lastAccess: 'Hoje, 08:45',
    plannedVacations: [1, 2]
  }
];
