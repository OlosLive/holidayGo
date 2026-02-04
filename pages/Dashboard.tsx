
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { generateTeamSummary } from '../geminiService';
import { useProfiles } from '../hooks/useProfiles';
import { useVacations } from '../hooks/useVacations';
import type { Profile } from '../types/database';

// Função para converter markdown básico (negrito) em HTML
const formatMarkdownText = (text: string): string => {
  // Converte **texto** em <strong>texto</strong>
  return text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-white">$1</strong>');
};

const Dashboard: React.FC = () => {
  const { profiles, loading: profilesLoading, error: profilesError } = useProfiles();
  const { 
    vacations,
    loading: vacationsLoading, 
    getVacationDays
  } = useVacations();
  const [viewMode, setViewMode] = useState<'mensal' | 'anual'>('mensal');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Current month (0-indexed)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Limpa a análise quando o mês ou ano mudar
  useEffect(() => {
    setAiSummary(null);
  }, [selectedMonth, selectedYear]);

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
  
  // Generate years array dynamically based on current year (5 years back, 5 years forward)
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const yearsArray: number[] = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      yearsArray.push(i);
    }
    return yearsArray;
  }, [currentYear]);

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
    // Sempre usa modo mensal para a análise
    const summary = await generateTeamSummary(users, 'mensal', selectedMonth, selectedYear);
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

  // Calculate monthly average of employees on vacation
  const monthlyAverage = useMemo(() => {
    if (users.length === 0) return 0;
    
    if (viewMode === 'mensal') {
      // For monthly view, count how many employees have vacations in the selected month
      return users.filter(user => user.plannedVacations.length > 0).length;
    } else {
      // For annual view, calculate average across all months
      const monthlyCounts: number[] = [];
      shortMonths.forEach((_, monthIdx) => {
        const count = users.filter(user => {
          const vacationDays = getVacationDays(user.id, selectedYear, monthIdx + 1);
          return vacationDays.length > 0;
        }).length;
        monthlyCounts.push(count);
      });
      const sum = monthlyCounts.reduce((acc, count) => acc + count, 0);
      return sum > 0 ? sum / monthlyCounts.length : 0;
    }
  }, [users, viewMode, selectedYear, selectedMonth, getVacationDays, shortMonths]);

  // Calculate peak absence month
  const peakAbsence = useMemo(() => {
    if (users.length === 0) return { month: 'Nenhum', count: 0, monthIndex: -1 };
    
    const monthlyCounts: { month: number; count: number }[] = [];
    shortMonths.forEach((_, monthIdx) => {
      const count = users.reduce((total, user) => {
        const vacationDays = getVacationDays(user.id, selectedYear, monthIdx + 1);
        return total + vacationDays.length;
      }, 0);
      monthlyCounts.push({ month: monthIdx, count });
    });
    
    const peak = monthlyCounts.reduce((max, current) => 
      current.count > max.count ? current : max
    , monthlyCounts[0]);
    
    return {
      month: months[peak.month],
      count: peak.count,
      monthIndex: peak.month
    };
  }, [users, selectedYear, getVacationDays, shortMonths, months]);

  // Loading state
  if (profilesLoading || vacationsLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center min-h-[60vh]">
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
      <div className="py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <p className="text-red-600 dark:text-red-400 font-medium">Erro ao carregar dados: {profilesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 w-full">
      {/* Header - Título e Ações */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black dark:text-white font-display">Visão Geral</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {viewMode === 'mensal' 
              ? `Gerenciando ausências para ${months[selectedMonth]} de ${selectedYear}` 
              : `Planejamento consolidado para o ano de ${selectedYear}`}
          </p>
        </div>
        <Link
          to={`/planning?month=${selectedMonth}&year=${selectedYear}`}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg shadow-primary/20 transition-all font-medium"
        >
          <span className="material-icons-round text-sm mr-2">add</span>
          Novo Agendamento
        </Link>
      </div>

      {/* Controles - Toggle e Seletores */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
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
              className="bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:ring-primary focus:border-primary dark:text-white"
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          )}
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:ring-primary focus:border-primary dark:text-white"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Legendas - inline com controles */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Férias</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded"></div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Fim de Semana</span>
          </div>
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
                    return (
                      <th key={month} className={`px-2 py-3 text-center border-l border-slate-200 dark:border-slate-800 min-w-[50px] ${
                        isCurrentMonth ? 'bg-primary/10 dark:bg-primary/20' : ''
                      }`}>
                        <div className={`text-[10px] font-black uppercase tracking-wider ${
                          isCurrentMonth ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                        }`}>{month}</div>
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
                        return (
                          <td key={idx} className={`border-l border-slate-100 dark:border-slate-800/50 px-1 py-2 text-center ${
                            isCurrentMonth ? 'bg-primary/5 dark:bg-primary/10' : ''
                          }`}>
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
                    return (
                      <td key={idx} className="border-l border-slate-200 dark:border-slate-700 px-1 py-2 text-center">
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

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card 1 - Em Férias */}
        <div className="group relative bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <span className="material-icons-round text-primary text-base">beach_access</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                {viewMode === 'mensal' ? 'Em Férias' : 'Média Mensal'}
              </p>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-2xl font-black text-primary">
                  {viewMode === 'mensal' ? monthlyAverage : monthlyAverage.toFixed(1)}
                </h3>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {monthlyAverage === 1 ? 'pessoa' : 'pessoas'}
                </span>
              </div>
            </div>
            {viewMode === 'mensal' && monthlyAverage > 0 && users.length > 0 && (
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                {((monthlyAverage / users.length) * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
        
        {/* Card 2 - Pico de Ausência */}
        <div className="group relative bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-amber-300/50 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-100 to-transparent dark:from-amber-900/20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <span className="material-icons-round text-amber-500 text-base">trending_up</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Pico de Ausência</p>
              {peakAbsence.count > 0 ? (
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-2xl font-black text-amber-500">{peakAbsence.month}</h3>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    {peakAbsence.count}d
                  </span>
                </div>
              ) : (
                <span className="text-base font-bold text-slate-300 dark:text-slate-600">Sem dados</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3 - Total da Equipe */}
        <div className="group relative bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <span className="material-icons-round text-primary text-base">groups</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Equipe</p>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-2xl font-black text-primary">{users.length}</h3>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">colaboradores</span>
              </div>
            </div>
            <div className="flex items-center -space-x-2">
              {users.slice(0, 3).map((user) => (
                <div 
                  key={user.id}
                  className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-[9px] font-bold ring-2 ring-white dark:ring-surface-dark"
                  title={user.name}
                >
                  {user.name.charAt(0)}
                </div>
              ))}
              {users.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 text-[9px] font-bold ring-2 ring-white dark:ring-surface-dark">
                  +{users.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card de Análise IA */}
      <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 border shadow-sm ${
        aiSummary 
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700/50' 
          : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-100 dark:border-blue-800/30'
      }`}>
        {/* Decorative background elements */}
        <div className={`absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-500 ${
          aiSummary 
            ? 'bg-gradient-to-bl from-blue-200/40 to-transparent' 
            : 'bg-gradient-to-bl from-blue-100/60 to-transparent'
        }`} />
        
        <div className="relative p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                isLoadingSummary 
                  ? 'bg-blue-100 dark:bg-blue-900/30 animate-pulse' 
                  : aiSummary 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : 'bg-transparent'
              }`}>
                <span className={`material-icons-round text-blue-500 text-xl transition-transform duration-300 ${
                  isLoadingSummary ? 'animate-spin' : ''
                }`}>auto_awesome</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Análise de Disponibilidade</h3>
                {aiSummary && (
                  <p className="text-[10px] text-blue-500 dark:text-blue-400 font-medium mt-0.5 animate-in fade-in slide-in-from-left-2 duration-300">
                    ✓ Análise gerada com sucesso
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={handleGetAiSummary}
              disabled={isLoadingSummary || users.length === 0}
              className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                aiSummary
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 ring-1 ring-blue-200 dark:ring-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 text-white'
              }`}
            >
              {isLoadingSummary ? (
                <>
                  <div className="h-4 w-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : aiSummary ? (
                <>
                  <span className="material-icons-round text-base group-hover:rotate-180 transition-transform duration-500">refresh</span>
                  <span>Nova Análise</span>
                </>
              ) : (
                <>
                  <span className="material-icons-round text-base group-hover:scale-110 transition-transform">psychology</span>
                  <span>Pedir Resumo IA</span>
                </>
              )}
            </button>
          </div>
          
          {isLoadingSummary ? (
            <div className="py-8 animate-in fade-in duration-300">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 border-3 border-blue-200 dark:border-blue-800 rounded-full" />
                  <div className="absolute inset-0 h-12 w-12 border-3 border-transparent border-t-blue-500 rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Analisando dados da equipe...</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Isso pode levar alguns segundos</p>
                </div>
                {/* Skeleton lines */}
                <div className="w-full max-w-md space-y-2 mt-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" style={{ width: '100%' }} />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" style={{ width: '85%', animationDelay: '150ms' }} />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" style={{ width: '70%', animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          ) : aiSummary ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="material-icons-round text-blue-500 text-lg">insights</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p 
                      className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: formatMarkdownText(aiSummary) }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-100 dark:border-blue-800/30">
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Análise baseada em {users.length} colaboradores • {months[selectedMonth]} de {selectedYear}
                </p>
                <button
                  onClick={() => setAiSummary(null)}
                  className="text-[10px] text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 font-medium flex items-center gap-1 transition-colors"
                >
                  <span className="material-icons-round text-xs">close</span>
                  Limpar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 py-2">
              <span className="material-icons-round text-slate-300 dark:text-slate-600 text-2xl flex-shrink-0">lightbulb</span>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Clique no botão acima para que a inteligência artificial analise a escala da sua equipe e forneça recomendações de cobertura para <strong className="text-slate-600 dark:text-slate-300">{months[selectedMonth]} de {selectedYear}</strong>.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/70 px-3 py-1.5 rounded-lg font-medium">
                    <span className="material-icons-round text-sm text-blue-500">schedule</span>
                    Identifica picos de ausência
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/70 px-3 py-1.5 rounded-lg font-medium">
                    <span className="material-icons-round text-sm text-green-500">groups</span>
                    Sugere redistribuição
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/70 px-3 py-1.5 rounded-lg font-medium">
                    <span className="material-icons-round text-sm text-amber-500">warning</span>
                    Alerta conflitos
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
