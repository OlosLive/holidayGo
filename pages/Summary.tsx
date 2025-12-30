
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
  const { usersWithoutVacation, usersWithUpcomingVacation, avgBalance, criticalAlerts, totalBalance } = useMemo(() => {
    const withoutVacation = profiles.filter(p => {
      const upcomingDays = getUpcomingVacationDays(p.id);
      return upcomingDays === 0 && p.status !== 'Inativo';
    });

    const withUpcoming = profiles.filter(p => {
      const upcomingDays = getUpcomingVacationDays(p.id);
      return upcomingDays > 0;
    }).map(p => ({
      ...p,
      upcomingDays: getUpcomingVacationDays(p.id),
      nextVacation: getNextVacationInfo(p.id)
    }));

    const avg = profiles.length > 0 
      ? Math.round(profiles.reduce((acc, p) => acc + p.vacation_balance, 0) / profiles.length)
      : 0;

    const critical = profiles.filter(p => p.vacation_balance >= 45).length;
    const total = profiles.reduce((acc, p) => acc + p.vacation_balance, 0);

    return {
      usersWithoutVacation: withoutVacation,
      usersWithUpcomingVacation: withUpcoming,
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
        <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Alertas de Vencimento</p>
          <h3 className="text-2xl font-black text-red-500">
            {criticalAlerts}
          </h3>
        </div>
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
          {/* Dynamic Alert Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* No Vacation Scheduled */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-icons-round text-yellow-500 text-lg">warning_amber</span>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Sem Férias Marcadas</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
                {usersWithoutVacation.length > 0 ? (
                  usersWithoutVacation.map(profile => (
                    <div key={profile.id} className="min-w-[160px] bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-sm flex flex-col items-center text-center">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm mb-2">
                        {profile.name.charAt(0)}
                      </div>
                      <h4 className="text-sm font-bold dark:text-white truncate w-full leading-tight">{profile.name}</h4>
                      <p className="text-[9px] text-slate-500 uppercase font-medium mt-0.5">Saldo: {profile.vacation_balance} dias</p>
                      <Link 
                        to="/planning"
                        className="mt-2 text-[9px] font-black uppercase text-primary hover:text-primary-dark transition-colors"
                      >
                        Agendar Agora
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">Todos os colaboradores ativos têm agendamentos.</p>
                )}
              </div>
            </section>

            {/* Upcoming Vacations */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-icons-round text-primary text-lg">beach_access</span>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Férias se Aproximando</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
                {usersWithUpcomingVacation.length > 0 ? (
                  usersWithUpcomingVacation.map(profile => (
                    <div key={profile.id} className="min-w-[160px] bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-3 rounded-lg shadow-sm flex flex-col items-center text-center">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mb-2">
                        {profile.name.charAt(0)}
                      </div>
                      <h4 className="text-sm font-bold dark:text-white truncate w-full leading-tight">{profile.name}</h4>
                      <p className="text-[9px] text-primary uppercase font-black mt-0.5">
                        {profile.nextVacation 
                          ? `${profile.nextVacation.days} dias em ${profile.nextVacation.month}`
                          : `${profile.upcomingDays} dias`
                        }
                      </p>
                      <div className="mt-1.5 px-2 py-0.5 bg-primary text-white text-[8px] font-bold rounded uppercase">Confirmado</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">Nenhuma saída programada para este período.</p>
                )}
              </div>
            </section>
          </div>

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
