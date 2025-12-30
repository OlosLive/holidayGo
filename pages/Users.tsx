
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';
import type { Profile } from '../types/database';

type UserStatus = 'Ativo' | 'Inativo' | 'Férias' | 'Pendente';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<UserStatus, string> = {
    'Ativo': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Inativo': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    'Férias': 'bg-primary/10 text-primary dark:bg-primary/20',
    'Pendente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  };

  return (
    <span className={`px-2 py-1 text-xs font-bold rounded-full ${colors[status as UserStatus] || colors['Pendente']}`}>
      {status}
    </span>
  );
};

const Users: React.FC = () => {
  const { profiles, loading, error, deleteProfile } = useProfiles();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (profile: Profile) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${profile.name}?`)) {
      return;
    }

    setDeletingId(profile.id);
    setDeleteError(null);

    const { error } = await deleteProfile(profile.id);
    
    if (error) {
      setDeleteError(error);
    }
    
    setDeletingId(null);
  };

  const formatLastAccess = (updatedAt: string | null): string => {
    if (!updatedAt) return 'Nunca';
    
    const date = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 30) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Carregando colaboradores...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <span className="material-icons-round text-red-500 text-2xl">error</span>
            <div>
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Erro ao carregar dados</h3>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Gestão de Usuários</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Gerencie o acesso e as informações dos colaboradores.
          </p>
        </div>
        <Link
          to="/users/add"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg shadow-primary/20 transition-all font-medium"
        >
          <span className="material-icons-round text-sm mr-2">add</span>
          Novo Usuário
        </Link>
      </div>

      {/* Delete Error */}
      {deleteError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <span className="material-icons-round text-red-500">error</span>
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{deleteError}</p>
            <button 
              onClick={() => setDeleteError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <span className="material-icons-round text-lg">close</span>
            </button>
          </div>
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
          <span className="material-icons-round text-6xl text-slate-300 dark:text-slate-600 mb-4">group_off</span>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Nenhum colaborador cadastrado</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Comece adicionando o primeiro colaborador ao sistema.</p>
          <Link
            to="/users/add"
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg shadow-primary/20 transition-all font-medium"
          >
            <span className="material-icons-round text-sm mr-2">add</span>
            Adicionar Colaborador
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Saldo Férias</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Última Atualização</th>
                  <th className="relative px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} className="h-10 w-10 rounded-full object-cover" alt={profile.name} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {profile.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold dark:text-white">{profile.name}</div>
                          <div className="text-xs text-slate-500">{profile.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={profile.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {profile.role || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${Math.min(100, (profile.vacation_balance / 30) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold dark:text-white">{profile.vacation_balance} dias</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatLastAccess(profile.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/users/edit/${profile.id}`} className="text-slate-400 hover:text-primary transition-colors p-2">
                        <span className="material-icons-round text-lg">edit</span>
                      </Link>
                      <button 
                        onClick={() => handleDelete(profile)}
                        disabled={deletingId === profile.id}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 ml-2 disabled:opacity-50"
                      >
                        {deletingId === profile.id ? (
                          <div className="h-5 w-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <span className="material-icons-round text-lg">delete</span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
