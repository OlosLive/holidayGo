
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { User, UserStatus } from '../types';

interface UserFormProps {
  users?: User[];
  onSave: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ users, onSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: '',
    department: '',
    hireDate: '',
    status: 'Ativo',
    vacationBalance: 30,
    vacationUsed: 0,
    plannedVacations: []
  });

  useEffect(() => {
    if (isEditing && users) {
      const user = users.find(u => u.id === id);
      if (user) setFormData(user);
    }
  }, [id, users, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: isEditing ? (id as string) : Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      email: formData.email || '',
      role: formData.role || '',
      department: formData.department || '',
      hireDate: formData.hireDate || '',
      status: (formData.status as UserStatus) || 'Ativo',
      vacationBalance: Number(formData.vacationBalance) || 0,
      vacationUsed: Number(formData.vacationUsed) || 0,
      plannedVacations: formData.plannedVacations || [],
      lastAccess: isEditing ? formData.lastAccess : 'Nunca'
    };
    onSave(newUser);
    navigate('/users');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <nav className="flex gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/users" className="hover:text-primary">Usuários</Link>
        <span>/</span>
        <span className="text-primary font-bold">{isEditing ? 'Editar' : 'Adicionar'}</span>
      </nav>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black dark:text-white">
            {isEditing ? 'Editar Detalhes do Usuário' : 'Adicionar Novo Usuário'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Insira os dados do colaborador para configurar o acesso e gestão de férias.
          </p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span className="material-icons-round text-sm">arrow_back</span>
          Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Personal Info */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-icons-round">person</span>
              </div>
              <h3 className="text-lg font-bold dark:text-white">Informações Pessoais</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Ana Souza"
                  className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">E-mail Corporativo</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nome@empresa.com"
                  className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Cargo</label>
                <input
                  required
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Ex: Designer Senior"
                  className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as UserStatus })}
                  className="form-select rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Férias">Em Férias</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Vacation Config */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-icons-round">beach_access</span>
              </div>
              <h3 className="text-lg font-bold dark:text-white">Configurações de Férias</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Departamento</label>
                <input
                  required
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Ex: Tecnologia"
                  className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Data de Admissão</label>
                <input
                  required
                  type="date"
                  value={formData.hireDate}
                  onChange={e => setFormData({ ...formData, hireDate: e.target.value })}
                  className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Direito Anual (Dias)</label>
                <input
                  type="number"
                  value={formData.vacationBalance}
                  onChange={e => setFormData({ ...formData, vacationBalance: Number(e.target.value) })}
                  className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-8 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/20 transition-all"
          >
            {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
