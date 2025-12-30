
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';
import { useAuth } from '../hooks/useAuth';
import type { ProfileUpdate } from '../types/database';

type UserStatus = 'Ativo' | 'Inativo' | 'Férias' | 'Pendente';

interface FormData {
  name: string;
  email: string;
  role: string;
  department: string;
  hire_date: string;
  status: UserStatus;
  vacation_balance: number;
  vacation_used: number;
}

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProfile, createProfile, updateProfile } = useProfiles();
  const { user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: '',
    department: '',
    hire_date: '',
    status: 'Ativo',
    vacation_balance: 30,
    vacation_used: 0,
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile data when editing
  useEffect(() => {
    const loadProfile = async () => {
      if (!isEditing || !id) return;
      
      setLoading(true);
      const profile = await getProfile(id);
      
      if (profile) {
        setFormData({
          name: profile.name,
          email: profile.email,
          role: profile.role || '',
          department: profile.department || '',
          hire_date: profile.hire_date || '',
          status: profile.status as UserStatus,
          vacation_balance: profile.vacation_balance,
          vacation_used: profile.vacation_used,
        });
      } else {
        setError('Colaborador não encontrado');
      }
      
      setLoading(false);
    };

    loadProfile();
  }, [id, isEditing, getProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isEditing && id) {
        // Update existing profile
        const updates: ProfileUpdate = {
          name: formData.name,
          email: formData.email,
          role: formData.role || null,
          department: formData.department || null,
          hire_date: formData.hire_date || null,
          status: formData.status,
          vacation_balance: formData.vacation_balance,
          vacation_used: formData.vacation_used,
        };

        const { error } = await updateProfile(id, updates);
        
        if (error) {
          setError(error);
          return;
        }
      } else {
        // Create new profile
        // Note: In a real scenario, you'd typically create a user through Auth first
        // For now, we'll use the current user's ID as a placeholder
        // This should be updated based on your actual user creation flow
        
        if (!user) {
          setError('Você precisa estar logado para criar um colaborador');
          return;
        }

        // Generate a new UUID for the profile
        // In production, this should come from creating a new auth user
        const newId = crypto.randomUUID();
        
        const { error } = await createProfile({
          id: newId,
          name: formData.name,
          email: formData.email,
          role: formData.role || null,
          department: formData.department || null,
          hire_date: formData.hire_date || null,
          status: formData.status,
          vacation_balance: formData.vacation_balance,
          vacation_used: formData.vacation_used,
        });

        if (error) {
          setError(error);
          return;
        }
      }

      navigate('/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar colaborador');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <span className="material-icons-round text-red-500">error</span>
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <span className="material-icons-round text-lg">close</span>
            </button>
          </div>
        </div>
      )}

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
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Ex: Tecnologia"
                  className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Data de Admissão</label>
                <input
                  type="date"
                  value={formData.hire_date}
                  onChange={e => setFormData({ ...formData, hire_date: e.target.value })}
                  className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Saldo de Férias (Dias)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.vacation_balance}
                  onChange={e => setFormData({ ...formData, vacation_balance: Number(e.target.value) })}
                  className="form-input rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Férias Utilizadas (Dias)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.vacation_used}
                  onChange={e => setFormData({ ...formData, vacation_used: Number(e.target.value) })}
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
            disabled={saving}
            className="px-8 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <span>{isEditing ? 'Salvar Alterações' : 'Criar Usuário'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
