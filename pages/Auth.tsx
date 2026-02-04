
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, resetPassword, updatePassword, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Verificar se há parâmetro de recuperação na URL
  useEffect(() => {
    const isRecovery = searchParams.get('recovery') === 'true';
    if (isRecovery) {
      const recoveryAccessToken = sessionStorage.getItem('supabase_recovery_access_token');
      if (recoveryAccessToken) {
        supabase.auth.setSession({
          access_token: recoveryAccessToken,
          refresh_token: sessionStorage.getItem('supabase_recovery_refresh_token') || '',
        }).then(() => {
          setMode('reset');
          sessionStorage.removeItem('supabase_recovery_access_token');
          sessionStorage.removeItem('supabase_recovery_refresh_token');
          sessionStorage.removeItem('supabase_recovery_type');
        }).catch(() => {
          setError('Link de recuperação inválido ou expirado');
        });
      } else {
        setError('Link de recuperação inválido ou expirado');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (mode === 'login') {
      setEmail("");
      setPassword("");
    } else if (mode === 'register') {
      setEmail("");
      setPassword("");
      setName("");
    } else if (mode === 'reset') {
      setNewPassword("");
      setConfirmPassword("");
    }
    setError(null);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        setError(authError.message || 'Erro ao fazer login');
      } else {
        navigate('/dashboard');
      }
    } else if (mode === 'register') {
      const { error: authError } = await signUp(email, password, name);
      if (authError) {
        setError(authError.message || 'Erro ao criar conta');
      } else {
        setError(null);
        setMode('login');
      }
    } else if (mode === 'reset') {
      if (newPassword !== confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }
      if (newPassword.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
      const { error: updateError } = await updatePassword(newPassword);
      if (updateError) {
        setError(updateError.message || 'Erro ao atualizar senha');
      } else {
        setSuccessMessage('Senha atualizada com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!forgotPasswordEmail) {
      setError('Por favor, informe seu email');
      return;
    }

    const { error: resetError } = await resetPassword(forgotPasswordEmail);
    if (resetError) {
      setError(resetError.message || 'Erro ao enviar email de recuperação');
    } else {
      setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setForgotPasswordEmail("");
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccessMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950">
      {/* Left side: Authentication Forms */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-20 xl:px-32 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="w-full max-w-md space-y-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-icons-round text-white text-3xl">flight_takeoff</span>
            </div>
            <h1 className="text-3xl font-black dark:text-white tracking-tighter font-display">holidayGo</h1>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {mode === 'login' ? 'Bem-vindo de volta' : mode === 'register' ? 'Crie sua conta' : 'Redefinir Senha'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {mode === 'login' 
                ? 'Entre na sua conta para gerenciar os agendamentos da equipe.' 
                : mode === 'register'
                ? 'Comece a organizar as férias do seu time de forma inteligente.'
                : 'Digite sua nova senha abaixo.'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">{successMessage}</p>
              </div>
            )}
            {mode === 'register' && (
              <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary py-3.5 pl-12 pr-4 transition-all"
                  />
                </div>
              </div>
            )}

            {mode !== 'reset' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">alternate_email</span>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@empresa.com"
                    className="w-full rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary py-3.5 pl-12 pr-4 transition-all"
                  />
                </div>
              </div>
            )}

            {mode !== 'reset' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary py-3.5 pl-12 pr-4 transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'reset' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
                  <div className="relative group">
                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary py-3.5 pl-12 pr-4 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                  <div className="relative group">
                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary py-3.5 pl-12 pr-4 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="group w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' ? 'Acessar Painel' : mode === 'register' ? 'Criar minha conta' : 'Atualizar Senha'}
                  </span>
                  <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {mode !== 'reset' && (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-900"></div></div>
                <div className="relative flex justify-center text-xs uppercase font-black text-slate-400 bg-white dark:bg-slate-950 px-2 tracking-widest">ou</div>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {mode === 'login' ? 'Não tem uma conta ainda?' : 'Já possui uma conta?'}
                <button 
                  onClick={toggleMode}
                  className="text-primary font-black ml-2 hover:underline focus:outline-none"
                >
                  {mode === 'login' ? 'Cadastre-se grátis' : 'Fazer login'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Recuperação de Senha */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Recuperar Senha</h3>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setError(null);
                  setSuccessMessage(null);
                  setForgotPasswordEmail("");
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                  E-mail
                </label>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    alternate_email
                  </span>
                  <input
                    type="email"
                    required
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary py-3.5 pl-12 pr-4 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError(null);
                    setSuccessMessage(null);
                    setForgotPasswordEmail("");
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enviar</span>
                      <span className="material-icons-round text-lg">send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Right side: Visual Experience */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[5s]"
          alt="Vista para o mar paradisíaco"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/40 to-primary/20"></div>

        <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16 text-white w-full h-full">
          <div className="max-w-xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm text-primary text-[10px] font-black uppercase tracking-widest">
              Líder em Gestão de Férias
            </div>
            <h2 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter font-display">
              Descanso é parte do <span className="text-primary italic">sucesso.</span>
            </h2>
            <p className="text-base lg:text-lg text-slate-300 font-medium leading-relaxed max-w-md">
              Ajudamos empresas a organizarem o tempo livre de seus colaboradores com inteligência, garantindo produtividade e bem-estar.
            </p>
            
            <div className="pt-6 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="h-9 w-9 rounded-full border-2 border-slate-900" alt="Usuário satisfeito" />
                ))}
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-[9px] font-bold border-2 border-slate-900">+50k</div>
              </div>
              <div className="h-9 w-[1px] bg-white/20"></div>
              <p className="text-xs text-white/60 font-medium">Junte-se a mais de 2.000 empresas que confiam no holidayGo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
