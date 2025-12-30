
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User } from '../types';

interface PlanningProps {
  users: User[];
  onUpdate: (user: User) => void;
}

const Planning: React.FC<PlanningProps> = ({ users, onUpdate }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read month and year from URL query params
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const month = searchParams.get('month');
    return month ? parseInt(month) : 6; // Default: Julho (0-indexed)
  });
  
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const year = searchParams.get('year');
    return year ? parseInt(year) : 2026;
  });

  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');
  const selectedUser = users.find(u => u.id === selectedUserId);

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

  const toggleDay = (day: number) => {
    if (!selectedUser) return;
    const isPlanned = selectedUser.plannedVacations.includes(day);
    const newPlanned = isPlanned
      ? selectedUser.plannedVacations.filter(d => d !== day)
      : [...selectedUser.plannedVacations, day].sort((a, b) => a - b);
    
    onUpdate({
      ...selectedUser,
      plannedVacations: newPlanned,
      vacationUsed: newPlanned.length,
      // Status could logically change if they have many days planned
      status: newPlanned.length > 0 ? 'Férias' : 'Ativo'
    });
  };

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

      <div className="flex-grow flex overflow-hidden">
        {/* User Sidebar */}
        <div className="w-56 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 overflow-y-auto hidden md:block">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase">Selecione um Colaborador</h3>
          </div>
          {users.map(u => (
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
                  <p className="text-[9px] text-slate-500 uppercase">{u.role}</p>
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
                const isSelected = selectedUser?.plannedVacations.includes(day);
                const dayIdxInWeek = (i + firstDayOffset) % 7;
                const isWeekend = dayIdxInWeek === 5 || dayIdxInWeek === 6; // Saturday (5) or Sunday (6)

                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`h-16 sm:h-20 border-r border-b border-slate-100 dark:border-slate-800 p-1.5 text-left flex flex-col transition-all relative group
                      ${isWeekend ? 'bg-red-50/30 dark:bg-red-900/10' : ''}
                      ${isSelected ? 'bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                    `}
                  >
                    <span className={`text-xs font-bold ${isWeekend ? 'text-red-500' : 'dark:text-white'}`}>{day}</span>
                    {isSelected && (
                      <div className="mt-auto w-full h-6 bg-primary rounded-md shadow-sm flex items-center justify-center animate-in zoom-in duration-200">
                        <span className="material-icons-round text-white text-[11px]">beach_access</span>
                      </div>
                    )}
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
              <h3 className="text-base font-bold dark:text-white">{selectedUser?.name}</h3>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-medium">Dias Programados</p>
              <p className="text-xl font-black text-primary">{selectedUser?.plannedVacations.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-medium">Saldo Restante</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">{selectedUser?.vacationBalance}</p>
            </div>
          </div>
          <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default Planning;
