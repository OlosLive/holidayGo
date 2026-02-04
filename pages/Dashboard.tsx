
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { generateTeamSummary } from '../geminiService';
import { useProfiles } from '../hooks/useProfiles';
import { useVacations } from '../hooks/useVacations';
import type { Profile } from '../types/database';

const Dashboard: React.FC = () => {
  const { profiles, loading: profilesLoading, error: profilesError } = useProfiles();
  const { 
    vacations,
    loading: vacationsLoading, 
    getVacationDays
  } = useVacations();
  const [viewMode, setViewMode] = useState<'mensal' | 'anual'>('mensal');
  const [selectedMonth, setSelectedMonth] = useState(6); // Julho (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Convert profiles to User format for compatibility
  // Note: useVacations already fetches all vacations on mount, so we just filter locally
  const users: User[] = useMemo(() => {
    return profiles.map((profile: Profile): User => {
      // Get vacation days for the selected month/year
      const vacationDays = getVacationDays(profile.id, selectedYear, selectedMonth + 1);
      
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email || '',
        role: profile.role || 'Colaborador',
        department: profile.department || 'Geral',
        hireDate: profile.created_at || new Date().toISOString(),
        status: 'Ativo' as const,
        vacationBalance: profile.vacation_balance || 30,
        vacationUsed: profile.vacation_used || 0,
        lastAccess: profile.updated_at || null,
        plannedVacations: vacationDays,
      };
    });
  }, [profiles, selectedYear, selectedMonth, getVacationDays]);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const shortMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  // Helper to get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to get week day labels for the month
  const getMonthWeekDays = useMemo(() => {
    const daysCount = getDaysInMonth(selectedMonth, selectedYear);
    const labels: string[] = [];
    const weekLabels = ['D', '2ª', '3ª', '4ª', '5ª', '6ª', 'S'];
    
    for (let day = 1; day <= daysCount; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      labels.push(weekLabels[date.getDay()]);
    }
    return labels;
  }, [selectedMonth, selectedYear]);

  const daysHeader = Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1);

  const handleGetAiSummary = async () => {
    setIsLoadingSummary(true);
    const summary = await generateTeamSummary(users, viewMode, selectedMonth, selectedYear);
    setAiSummary(summary);
    setIsLoadingSummary(false);
  };

  // Get real vacation data for a user in a specific month
  const getAnnualData = (user: User, monthIdx: number) => {
    // Get vacation days for this user in the specified month/year
    const vacationDays = getVacationDays(user.id, selectedYear, monthIdx + 1);
    return vacationDays.length;
  };

  // Calculate monthly totals for the team
  const getMonthlyTeamTotal = (monthIdx: number) => {
    return users.reduce((total, user) => total + getAnnualData(user, monthIdx), 0);
  };

  // Get status color for vacation balance
  const getBalanceStatus = (balance: number) => {
    if (balance >= 45) return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Crítico' };
    if (balance >= 30) return { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Atenção' };
    if (balance >= 15) return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Normal' };
    return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Bom' };
  };

  // Get current month (0-indexed)
  const currentMonth = new Date().getMonth();

  // Loading state
  if (profilesLoading || vacationsLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (profilesError) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <p className="text-red-600 dark:text-red-400 font-medium">Erro ao carregar dados: {profilesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
      <div className="lg:flex lg:items-end lg:justify-between mb-8 gap-6 space-y-6 lg:space-y-0">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h2 className="text-3xl font-black dark:text-white font-display tracking-tight">Visão Geral</h2>
            
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('mensal')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'mensal' 
                  ? 'bg-white dark:bg-surface-dark text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setViewMode('anual')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'anual' 
                  ? 'bg-white dark:bg-surface-dark text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Anual
              </button>
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-2">
              {viewMode === 'mensal' && (
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-primary focus:border-primary dark:text-white"
                >
                  {months.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                  ))}
                </select>
              )}
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-primary focus:border-primary dark:text-white"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {viewMode === 'mensal' 
              ? `Gerenciando ausências para ${months[selectedMonth]} de ${selectedYear}` 
              : `Planejamento consolidado para o ano de ${selectedYear}`}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link
            to={`/planning?month=${selectedMonth}&year=${selectedYear}`}
            className="inline-flex items-center px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/25 transition-all font-black text-sm uppercase tracking-wider"
          >
            <span className="material-icons-round text-lg mr-2">calendar_month</span>
            Novo Agendamento
          </Link>
        </div>
      </div>

      {/* View Container */}
      <div className="bg-white dark:bg-surface-dark shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
        <div className="overflow-x-auto custom-scrollbar">
          {viewMode === 'mensal' ? (
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="sticky left-0 z-10 px-4 py-3 text-left text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-w-[200px]">
                    Equipe
                  </th>
                  {daysHeader.map((day, idx) => {
                    const label = getMonthWeekDays[idx];
                    const isWeekend = label === 'S' || label === 'D';
                    return (
                      <th key={day} className={`px-1 py-2 text-center border-l border-slate-200 dark:border-slate-800 min-w-[36px] ${isWeekend ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                        <div className="text-[11px] font-black">{day}</div>
                        <div className="text-[9px] font-bold uppercase opacity-60">{label}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="sticky left-0 z-10 px-4 py-2 whitespace-nowrap bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-xs uppercase group-hover:scale-110 transition-transform">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <span className="block text-sm font-bold dark:text-white leading-tight">{user.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{user.role}</span>
                        </div>
                      </div>
                    </td>
                    {daysHeader.map((day, idx) => {
                      const label = getMonthWeekDays[idx];
                      const isWeekend = label === 'S' || label === 'D';
                      // Check if this day is in the user's planned vacations
                      const isVacation = user.plannedVacations.includes(day);
                      return (
                        <td key={day} className={`border-l border-slate-100 dark:border-slate-800/50 h-10 p-0.5 ${isWeekend ? 'bg-slate-50/30 dark:bg-slate-800/10' : ''}`}>
                          {isVacation && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-7 h-7 bg-primary/90 dark:bg-primary rounded-md shadow-sm transform hover:scale-110 transition-all cursor-pointer flex items-center justify-center group/item" title={`${user.name} em férias`}>
                                <span className="material-icons-round text-white text-[12px] opacity-80 group-hover/item:opacity-100">beach_access</span>
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="sticky left-0 z-10 px-4 py-3 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-w-[180px]">
                    Colaborador
                  </th>
                  {shortMonths.map((month, idx) => {
                    const isCurrentMonth = idx === currentMonth && selectedYear === new Date().getFullYear();
                    const isJuly2026 = idx === 6 && selectedYear === 2026;
                    return (
                      <th key={month} className={`px-2 py-3 text-center border-l border-slate-200 dark:border-slate-800 min-w-[50px] ${
                        isCurrentMonth ? 'bg-primary/10 dark:bg-primary/20' : ''
                      } ${isJuly2026 ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                        <div className={`text-[10px] font-black uppercase tracking-wider ${
                          isCurrentMonth || isJuly2026 ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                        }`}>{month}</div>
                        {isJuly2026 && (
                          <div className="text-[8px] text-primary font-bold mt-0.5">Com dados</div>
                        )}
                      </th>
                    );
                  })}
                  <th className="px-2 py-3 text-center border-l border-slate-200 dark:border-slate-800 min-w-[55px] bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                    <div className="text-[10px] font-black uppercase">Total</div>
                  </th>
                  <th className="px-2 py-3 text-center border-l border-slate-200 dark:border-slate-800 min-w-[60px] bg-amber-50 dark:bg-amber-900/20">
                    <div className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">Saldo</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {users.map((user) => {
                  let yearTotal = 0;
                  const balanceStatus = getBalanceStatus(user.vacationBalance);
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="sticky left-0 z-10 px-4 py-2 whitespace-nowrap bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-xs uppercase group-hover:scale-110 transition-transform">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block text-sm font-bold dark:text-white leading-tight">{user.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{user.role}</span>
                          </div>
                        </div>
                      </td>
                      {shortMonths.map((_, idx) => {
                        const days = getAnnualData(user, idx);
                        yearTotal += days;
                        const isCurrentMonth = idx === currentMonth && selectedYear === new Date().getFullYear();
                        const isJuly2026 = idx === 6 && selectedYear === 2026;
                        return (
                          <td key={idx} className={`border-l border-slate-100 dark:border-slate-800/50 px-1 py-2 text-center ${
                            isCurrentMonth ? 'bg-primary/5 dark:bg-primary/10' : ''
                          } ${isJuly2026 ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                            {days > 0 ? (
                              <div 
                                className={`inline-flex items-center justify-center min-w-[26px] h-6 rounded-full font-black text-[10px] cursor-pointer hover:scale-110 transition-transform ${
                                  days >= 15 ? 'bg-primary text-white shadow-md shadow-primary/30' : 
                                  days >= 10 ? 'bg-primary/80 text-white' : 
                                  'bg-primary/15 text-primary'
                                }`}
                                title={`${user.name}: ${days} dias de férias em ${shortMonths[idx]}`}
                              >
                                {days}
                              </div>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 text-[10px] font-medium">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="border-l border-slate-100 dark:border-slate-800/50 px-2 py-2 text-center bg-slate-50/50 dark:bg-slate-800/20">
                        <span className="text-xs font-black text-slate-900 dark:text-white">{yearTotal}d</span>
                      </td>
                      <td className="border-l border-slate-100 dark:border-slate-800/50 px-2 py-2 text-center bg-amber-50/50 dark:bg-amber-900/10">
                        <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-black ${balanceStatus.color}`}>
                          {user.vacationBalance}d
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {/* Team Totals Row */}
                <tr className="bg-slate-100 dark:bg-slate-800/50 font-bold">
                  <td className="sticky left-0 z-10 px-4 py-2 whitespace-nowrap bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <span className="material-icons-round text-base">groups</span>
                      </div>
                      <div>
                        <span className="block text-sm font-black text-slate-700 dark:text-slate-200 leading-tight">Total Equipe</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{users.length} colaboradores</span>
                      </div>
                    </div>
                  </td>
                  {shortMonths.map((_, idx) => {
                    const monthTotal = getMonthlyTeamTotal(idx);
                    const isJuly2026 = idx === 6 && selectedYear === 2026;
                    return (
                      <td key={idx} className={`border-l border-slate-200 dark:border-slate-700 px-1 py-2 text-center ${
                        isJuly2026 ? 'bg-blue-100/50 dark:bg-blue-900/20' : ''
                      }`}>
                        {monthTotal > 0 ? (
                          <div className={`inline-flex items-center justify-center min-w-[26px] h-6 rounded-full font-black text-[10px] ${
                            monthTotal >= 20 ? 'bg-red-500 text-white' : 
                            monthTotal >= 10 ? 'bg-amber-500 text-white' : 
                            'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                          }`}>
                            {monthTotal}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-[10px] font-medium">0</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="border-l border-slate-200 dark:border-slate-700 px-2 py-2 text-center bg-slate-200/50 dark:bg-slate-700/50">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {users.reduce((total, user) => {
                        let userTotal = 0;
                        shortMonths.forEach((_, idx) => {
                          userTotal += getAnnualData(user, idx);
                        });
                        return total + userTotal;
                      }, 0)}d
                    </span>
                  </td>
                  <td className="border-l border-slate-200 dark:border-slate-700 px-2 py-2 text-center bg-amber-100/50 dark:bg-amber-900/20">
                    <span className="text-xs font-black text-amber-700 dark:text-amber-400">
                      {users.reduce((total, user) => total + user.vacationBalance, 0)}d
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <span className="material-icons-round text-3xl">beach_access</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Média Mensal</p>
              <h4 className="text-2xl font-black dark:text-white">5.2 Colaboradores</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-red-100 rounded-2xl text-red-500">
              <span className="material-icons-round text-3xl">event_busy</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pico de Ausência</p>
              <h4 className="text-2xl font-black dark:text-white">Janeiro / {selectedYear}</h4>
            </div>
          </div>

          <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-7 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black flex items-center gap-2 dark:text-white font-display">
                <span className="material-icons-round text-blue-500">auto_awesome</span>
                Análise de Disponibilidade
              </h3>
              <button 
                onClick={handleGetAiSummary}
                disabled={isLoadingSummary}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-black shadow-lg shadow-blue-500/20"
              >
                {isLoadingSummary ? 'Processando...' : 'Pedir Resumo IA'}
              </button>
            </div>
            {aiSummary ? (
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line animate-in fade-in duration-500">
                {aiSummary}
              </p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Clique no botão acima para que a inteligência artificial analise a escala da sua equipe e forneça recomendações de cobertura para {selectedYear}.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black mb-6 dark:text-white font-display uppercase tracking-widest text-xs opacity-50">Legenda</h3>
          <ul className="space-y-5">
            <li className="flex items-center gap-4">
              <div className="w-5 h-5 bg-primary rounded-lg shadow-sm"></div>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Férias Confirmadas</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-5 h-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"></div>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Finais de Semana</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-5 h-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"></div>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Disponibilidade Total</span>
            </li>
          </ul>
          
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-tighter">Exportar Relatórios</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" title="Exportar PDF">
                <span className="material-icons-round text-slate-400">picture_as_pdf</span>
              </button>
              <button className="flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" title="Exportar Excel">
                <span className="material-icons-round text-slate-400">table_chart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
