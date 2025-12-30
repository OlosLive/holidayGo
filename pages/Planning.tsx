
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';
import { useVacations } from '../hooks/useVacations';
import type { Profile } from '../types/database';

const Planning: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { profiles, loading: profilesLoading, error: profilesError } = useProfiles();
  const { 
    vacations,
    loading: vacationsLoading, 
    error: vacationsError,
    getVacationDays,
    toggleVacationDay
  } = useVacations();
  
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Read month and year from URL query params
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const month = searchParams.get('month');
    return month ? parseInt(month) : new Date().getMonth(); // Current month (0-indexed)
  });
  
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const year = searchParams.get('year');
    return year ? parseInt(year) : new Date().getFullYear();
  });

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  // Set first user as selected when profiles load
  useEffect(() => {
    if (profiles.length > 0 && !selectedUserId) {
      setSelectedUserId(profiles[0].id);
    }
  }, [profiles, selectedUserId]);

  const selectedUser = profiles.find(u => u.id === selectedUserId);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Calculate days in the selected month
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedMonth, selectedYear]);

  // Calculate the day of week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOffset = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    return firstDay === 0 ? 6 : firstDay - 1;
  }, [selectedMonth, selectedYear]);

  // Get planned vacation days for the selected user and month
  const plannedVacations = useMemo(() => {
    if (!selectedUserId) return [];
    // Month is 0-indexed in our state but 1-indexed in the database
    return getVacationDays(selectedUserId, selectedYear, selectedMonth + 1);
  }, [selectedUserId, selectedYear, selectedMonth, getVacationDays, vacations]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setSearchParams({ month: newMonth.toString(), year: newYear.toString() });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    let newMonth = selectedMonth + 1;
    let newYear = selectedYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setSearchParams({ month: newMonth.toString(), year: newYear.toString() });
  };

  const toggleDay = async (day: number) => {
    if (!selectedUser) return;
    
    setSavingDay(day);
    setSaveError(null);
    
    // Month is 0-indexed in state but 1-indexed in the database
    const { error } = await toggleVacationDay(selectedUser.id, selectedYear, selectedMonth + 1, day);
    
    if (error) {
      setSaveError(error);
    }
    
    setSavingDay(null);
  };

  const loading = profilesLoading || vacationsLoading;
  const error = profilesError || vacationsError;

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Carregando planejamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center bg-slate-50 dark:bg-slate-900 p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md">
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

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center bg-slate-50 dark:bg-slate-900 p-8">
        <div className="text-center">
          <span className="material-icons-round text-6xl text-slate-300 dark:text-slate-600 mb-4">group_off</span>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Nenhum colaborador cadastrado</h3>
          <p className="text-slate-500 dark:text-slate-400">Adicione colaboradores primeiro para planejar férias.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold dark:text-white">Planejamento {months[selectedMonth]} {selectedYear}</h2>
          <div className="flex items-center gap-1">
            <button 
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
              title="Mês anterior"
            >
              <span className="material-icons-round text-xl">chevron_left</span>
            </button>
            <button 
              onClick={goToNextMonth}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
              title="Próximo mês"
            >
              <span className="material-icons-round text-xl">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 bg-primary rounded"></span>
            <span className="dark:text-slate-400">Selecionado</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 bg-red-100 border border-red-200 rounded"></span>
            <span className="dark:text-slate-400">Fim de Semana</span>
          </div>
        </div>
      </div>

      {/* Save Error */}
      {saveError && (
        <div className="mx-4 mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <span className="material-icons-round text-red-500 text-lg">error</span>
            <p className="text-sm text-red-700 dark:text-red-400 font-medium flex-1">{saveError}</p>
            <button 
              onClick={() => setSaveError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <span className="material-icons-round text-lg">close</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-grow flex overflow-hidden">
        {/* User Sidebar */}
        <div className="w-56 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 overflow-y-auto hidden md:block">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase">Selecione um Colaborador</h3>
          </div>
          {profiles.map(u => (
            <button
              key={u.id}
              onClick={() => setSelectedUserId(u.id)}
              className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 ${selectedUserId === u.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-xs font-bold">
                  {u.name.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold dark:text-white leading-tight">{u.name}</p>
                  <p className="text-[9px] text-slate-500 uppercase">{u.role || 'Sem cargo'}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-grow overflow-auto p-4 bg-slate-50 dark:bg-slate-900">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d, idx) => (
                <div key={d} className={`py-2 text-center text-[11px] font-bold uppercase bg-slate-50 dark:bg-slate-900/50 ${idx >= 5 ? 'text-red-500' : 'text-slate-500'}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {/* Empty leading days for visual alignment based on the first day of the month */}
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 sm:h-20 border-r border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = plannedVacations.includes(day);
                const dayIdxInWeek = (i + firstDayOffset) % 7;
                const isWeekend = dayIdxInWeek === 5 || dayIdxInWeek === 6; // Saturday (5) or Sunday (6)
                const isSaving = savingDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    disabled={isSaving}
                    className={`h-16 sm:h-20 border-r border-b border-slate-100 dark:border-slate-800 p-1.5 text-left flex flex-col transition-all relative group disabled:opacity-70
                      ${isWeekend ? 'bg-red-50/30 dark:bg-red-900/10' : ''}
                      ${isSelected ? 'bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                    `}
                  >
                    <span className={`text-xs font-bold ${isWeekend ? 'text-red-500' : 'dark:text-white'}`}>{day}</span>
                    {isSaving ? (
                      <div className="mt-auto w-full h-6 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center animate-pulse">
                        <div className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                    ) : isSelected ? (
                      <div className="mt-auto w-full h-6 bg-primary rounded-md shadow-sm flex items-center justify-center animate-in zoom-in duration-200">
                        <span className="material-icons-round text-white text-[11px]">beach_access</span>
                      </div>
                    ) : null}
                    <div className="absolute inset-0 border-2 border-primary opacity-0 group-active:opacity-100 pointer-events-none rounded-sm transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 px-4 py-3 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-icons-round text-xl">person</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recurso Selecionado</p>
              <h3 className="text-base font-bold dark:text-white">{selectedUser?.name || 'Nenhum'}</h3>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-medium">Dias Neste Mês</p>
              <p className="text-xl font-black text-primary">{plannedVacations.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-medium">Saldo Total</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">{selectedUser?.vacation_balance ?? 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="material-icons-round text-green-500">check_circle</span>
            <span>Alterações salvas automaticamente</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;

