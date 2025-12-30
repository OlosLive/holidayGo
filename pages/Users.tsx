
import React from 'react';
import { Link } from 'react-router-dom';
import { User, UserStatus } from '../types';

interface UsersProps {
  users: User[];
  onDelete: (id: string) => void;
}

const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
  const colors: Record<UserStatus, string> = {
    'Ativo': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Inativo': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    'Férias': 'bg-primary/10 text-primary dark:bg-primary/20',
    'Pendente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  };

  return (
    <span className={`px-2 py-1 text-xs font-bold rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
};

const Users: React.FC<UsersProps> = ({ users, onDelete }) => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Gestão de Usuários</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Gerencie o acesso e as informações dos colaboradores.</p>
        </div>
        <Link
          to="/users/add"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg shadow-primary/20 transition-all font-medium"
        >
          <span className="material-icons-round text-sm mr-2">add</span>
          Novo Usuário
        </Link>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Saldo Férias</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Último Acesso</th>
                <th className="relative px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} className="h-10 w-10 rounded-full object-cover" alt={user.name} />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold dark:text-white">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${Math.min(100, (user.vacationBalance / 30) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold dark:text-white">{user.vacationBalance} dias</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {user.lastAccess || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/users/edit/${user.id}`} className="text-slate-400 hover:text-primary transition-colors p-2">
                      <span className="material-icons-round text-lg">edit</span>
                    </Link>
                    <button 
                      onClick={() => onDelete(user.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2 ml-2"
                    >
                      <span className="material-icons-round text-lg">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
