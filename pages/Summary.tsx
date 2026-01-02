
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';
import { useVacations } from '../hooks/useVacations';

const Summary: React.FC = () => {
  const { profiles, loading: profilesLoading, error: profilesError } = useProfiles();
  const { vacations, loading: vacationsLoading, error: vacationsError } = useVacations();

  const getStatus = (remaining: number) => {
    if (remaining >= 45) return { label: 'Crítico', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    if (remaining >= 30) return { label: 'Atenção', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
    if (remaining >= 15) return { label: 'Normal', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    return { label: 'Bom', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
  };

  // Get vacation days count for a user in the current month
  const getUpcomingVacationDays = (userId: string): number => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed
    
    return vacations.filter(
      v => v.user_id === userId && v.year === currentYear && v.month === currentMonth
    ).length;
  };

  // Get next upcoming vacation dates for display
  const getNextVacationInfo = (userId: string): { month: string; days: number } | null => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    // Check current and next months
    for (let m = currentMonth; m <= 12; m++) {
      const daysInMonth = vacations.filter(
        v => v.user_id === userId && v.year === currentYear && v.month === m
      ).length;
      
      if (daysInMonth > 0) {
        return { month: months[m - 1], days: daysInMonth };
      }
    }
    
    // Check next year
    for (let m = 1; m < currentMonth; m++) {
      const daysInMonth = vacations.filter(
        v => v.user_id === userId && v.year === currentYear + 1 && v.month === m
      ).length;
      
      if (daysInMonth > 0) {
        return { month: months[m - 1], days: daysInMonth };
      }
    }
    
    return null;
  };

  // Computed data
  const { usersWithoutVacation, usersWithUpcomingVacation, usersWithCriticalBalance, avgBalance, criticalAlerts, totalBalance } = useMemo(() => {
    const withoutVacation = profiles.filter(p => {
      const upcomingDays = getUpcomingVacationDays(p.id);
      return upcomingDays === 0 && p.status !== 'Inativo' && p.status !== 'inactive';
    });

    const withUpcoming = profiles.filter(p => {
      const upcomingDays = getUpcomingVacationDays(p.id);
      return upcomingDays > 0;
    }).map(p => ({
      ...p,
      upcomingDays: getUpcomingVacationDays(p.id),
      nextVacation: getNextVacationInfo(p.id)
    }));

    // Users with critical balance (≥45 days) - risk of losing vacation days
    const withCriticalBalance = profiles
      .filter(p => p.vacation_balance >= 45 && p.status !== 'inactive')
      .sort((a, b) => b.vacation_balance - a.vacation_balance); // Sort by highest balance first

    const avg = profiles.length > 0 
      ? Math.round(profiles.reduce((acc, p) => acc + p.vacation_balance, 0) / profiles.length)
      : 0;

    const critical = withCriticalBalance.length;
    const total = profiles.reduce((acc, p) => acc + p.vacation_balance, 0);

    return {
      usersWithoutVacation: withoutVacation,
      usersWithUpcomingVacation: withUpcoming,
      usersWithCriticalBalance: withCriticalBalance,
      avgBalance: avg,
      criticalAlerts: critical,
      totalBalance: total
    };
  }, [profiles, vacations]);

  const loading = profilesLoading || vacationsLoading;
  const error = profilesError || vacationsError;

  if (loading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Carregando resumo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black dark:text-white font-display">Dias Restantes por Usuário</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Acompanhe o saldo de férias acumulado e o status de descanso de cada colaborador.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Média da Equipe</p>
          <h3 className="text-2xl font-black text-primary">
            {avgBalance} dias
          </h3>
        </div>
        <button 
          onClick={() => {
            const section = document.getElementById('alertas-vencimento');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
          }}
          disabled={criticalAlerts === 0}
          className={`bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border text-left w-full transition-all ${
            criticalAlerts > 0 
              ? 'border-red-200 dark:border-red-800/50 hover:shadow-md hover:border-red-300 cursor-pointer' 
              : 'border-slate-200 dark:border-slate-800 cursor-default'
          }`}
        >
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            Alertas de Vencimento
            {criticalAlerts > 0 && (
              <span className="material-icons-round text-red-500 text-xs animate-pulse">notification_important</span>
            )}
          </p>
          <h3 className={`text-2xl font-black ${criticalAlerts > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {criticalAlerts}
          </h3>
          {criticalAlerts > 0 && (
            <p className="text-[9px] text-red-500 mt-1 flex items-center gap-1">
              <span className="material-icons-round text-xs">arrow_downward</span>
              Clique para ver detalhes
            </p>
          )}
        </button>
        <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Acumulado</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {totalBalance} dias
          </h3>
        </div>
      </div>

      {profiles.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
          <span className="material-icons-round text-6xl text-slate-300 dark:text-slate-600 mb-4">group_off</span>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Nenhum colaborador cadastrado</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Adicione colaboradores para ver o resumo de férias.</p>
          <Link
            to="/users/add"
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg shadow-primary/20 transition-all font-medium"
          >
            <span className="material-icons-round text-sm mr-2">add</span>
            Adicionar Colaborador
          </Link>
        </div>
      ) : (
        <>
          {/* Alert Tables - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sem Férias Marcadas - Table */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-800/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-yellow-100 dark:border-yellow-800/30 bg-yellow-50 dark:bg-yellow-900/20 flex items-center gap-2">
                <span className="material-icons-round text-yellow-500 text-lg">warning_amber</span>
                <h3 className="text-sm font-black text-yellow-700 dark:text-yellow-400">Sem Férias Marcadas</h3>
                <span className="ml-auto text-xs font-bold text-yellow-600 dark:text-yellow-500">{usersWithoutVacation.length}</span>
              </div>
              {usersWithoutVacation.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Colaborador</th>
                        <th className="px-3 py-2 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Utilizados</th>
                        <th className="px-3 py-2 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {usersWithoutVacation.map((profile) => (
                        <tr key={profile.id} className="hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10 transition-colors">
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold text-xs">
                                {profile.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-bold dark:text-white leading-tight">{profile.name}</div>
                                <div className="text-[10px] text-slate-500">{profile.role || 'Sem cargo'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-semibold dark:text-slate-300">
                            {profile.vacation_used}d
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <Link 
                              to={`/planning?userId=${profile.id}`}
                              className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-primary hover:text-primary-dark transition-colors"
                            >
                              <span className="material-icons-round text-sm">event</span>
                              Agendar
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <span className="material-icons-round text-3xl text-green-400 mb-2">check_circle</span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Todos têm férias agendadas.</p>
                </div>
              )}
            </div>

            {/* Férias se Aproximando - Table */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-primary/30 dark:border-primary/20 overflow-hidden">
              <div className="px-4 py-3 border-b border-primary/20 dark:border-primary/10 bg-primary/5 dark:bg-primary/10 flex items-center gap-2">
                <span className="material-icons-round text-primary text-lg">beach_access</span>
                <h3 className="text-sm font-black text-primary">Férias se Aproximando</h3>
                <span className="ml-auto text-xs font-bold text-primary/70">{usersWithUpcomingVacation.length}</span>
              </div>
              {usersWithUpcomingVacation.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Colaborador</th>
                        <th className="px-3 py-2 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Utilizados</th>
                        <th className="px-3 py-2 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Próximas Férias</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {usersWithUpcomingVacation.map((profile) => (
                        <tr key={profile.id} className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-xs">
                                {profile.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-bold dark:text-white leading-tight">{profile.name}</div>
                                <div className="text-[10px] text-slate-500">{profile.role || 'Sem cargo'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-semibold dark:text-slate-300">
                            {profile.vacation_used}d
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-[10px] font-bold rounded">
                              <span className="material-icons-round text-xs">event_available</span>
                              {profile.nextVacation 
                                ? `${profile.nextVacation.days}d em ${profile.nextVacation.month}`
                                : `${profile.upcomingDays} dias`
                              }
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <span className="material-icons-round text-3xl text-slate-300 dark:text-slate-600 mb-2">event_busy</span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma saída programada.</p>
                </div>
              )}
            </div>
          </div>

          {/* Alertas de Vencimento - Critical Users Table */}
          {usersWithCriticalBalance.length > 0 && (
            <div id="alertas-vencimento" className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-red-200 dark:border-red-800/50 overflow-hidden scroll-mt-4">
              <div className="px-4 py-3 border-b border-red-100 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20 flex items-center gap-2">
                <span className="material-icons-round text-red-500 text-lg animate-pulse">notification_important</span>
                <h3 className="text-sm font-black text-red-700 dark:text-red-400">Alertas de Vencimento</h3>
                <span className="ml-auto text-xs font-bold text-red-600 dark:text-red-500">{usersWithCriticalBalance.length} colaborador(es) em risco</span>
              </div>
              <div className="p-3 bg-red-50/50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-800/20">
                <p className="text-xs text-red-600 dark:text-red-400">
                  <span className="material-icons-round text-xs align-middle mr-1">info</span>
                  Colaboradores com mais de 45 dias acumulados estão em risco de perder dias de férias. Ação recomendada: agendar férias imediatamente.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Colaborador</th>
                      <th className="px-3 py-2 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Saldo Acumulado</th>
                      <th className="px-3 py-2 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Dias em Risco</th>
                      <th className="px-3 py-2 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Urgência</th>
                      <th className="px-3 py-2 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {usersWithCriticalBalance.map((profile) => {
                      const daysAtRisk = profile.vacation_balance - 30; // Dias acima do limite anual
                      const urgency = profile.vacation_balance >= 55 ? 'CRÍTICO' : profile.vacation_balance >= 50 ? 'ALTO' : 'MÉDIO';
                      const urgencyColor = profile.vacation_balance >= 55 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                        : profile.vacation_balance >= 50 
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
                      
                      return (
                        <tr key={profile.id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-xs">
                                {profile.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-bold dark:text-white leading-tight">{profile.name}</div>
                                <div className="text-[10px] text-slate-500">{profile.role || 'Sem cargo'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <span className="text-lg font-black text-red-600 dark:text-red-400">
                              {profile.vacation_balance}d
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded">
                              <span className="material-icons-round text-xs">trending_up</span>
                              +{daysAtRisk}d excedente
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full ${urgencyColor}`}>
                              {urgency}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <Link 
                              to={`/planning?userId=${profile.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded transition-colors"
                            >
                              <span className="material-icons-round text-sm">event</span>
                              Agendar Agora
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Main Table */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black dark:text-white">Detalhamento por Recurso</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Colaborador</th>
                    <th className="px-3 py-3 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Utilizados</th>
                    <th className="px-3 py-3 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Restantes</th>
                    <th className="px-3 py-3 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Visualização</th>
                    <th className="px-3 py-3 text-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {profiles.map((profile) => {
                    const status = getStatus(profile.vacation_balance);
                    const progress = Math.min(100, (profile.vacation_balance / 60) * 100); // Max reference 60 days
                    
                    return (
                      <tr key={profile.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                              {profile.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-bold dark:text-white leading-tight">{profile.name}</div>
                              <div className="text-[10px] text-slate-500">{profile.role || 'Sem cargo'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-center text-sm font-semibold dark:text-slate-300">
                          {profile.vacation_used}d
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-center text-sm font-black text-slate-900 dark:text-white">
                          {profile.vacation_balance}d
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap min-w-[120px]">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                            <div 
                              className={`h-full rounded-full ${profile.vacation_balance >= 45 ? 'bg-red-500' : profile.vacation_balance >= 30 ? 'bg-yellow-500' : 'bg-primary'}`} 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-center">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Summary;
