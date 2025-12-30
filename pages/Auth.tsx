
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading: authLoading, initialized, error: authError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (initialized && user) {
      navigate('/dashboard');
    }
  }, [user, initialized, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { error: signInError } = await signIn(email, password);
        
        if (signInError) {
          setError(translateError(signInError.message));
        } else {
          navigate('/dashboard');
        }
      } else {
        const { error: signUpError } = await signUp(email, password, name);
        if (signUpError) {
          setError(translateError(signUpError.message));
        } else {
          setError(null);
          alert('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.');
          setMode('login');
        }
      }
    } catch {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const translateError = (message: string): string => {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha incorretos',
      'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
      'User already registered': 'Este email já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Unable to validate email address: invalid format': 'Formato de email inválido',
    };
    return errorMap[message] || message;
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setError(null);
  };

  // Show loading while checking auth state (with timeout message)
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 max-w-md px-4">
          {authError ? (
            <>
              <span className="material-icons-round text-yellow-500 text-4xl">warning</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium text-center">
                Não foi possível conectar ao servidor de autenticação.
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
                {authError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold"
              >
                Tentar novamente
              </button>
            </>
          ) : (
            <>
              <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Carregando...</p>
            </>
          )}
        </div>
      </div>
    );
  }

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
              {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {mode === 'login' 
                ? 'Entre na sua conta para gerenciar os agendamentos da equipe.' 
                : 'Comece a organizar as férias do seu time de forma inteligente.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-red-500">error</span>
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  minLength={6}
                  className="w-full rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-primary focus:border-primary py-3.5 pl-12 pr-4 transition-all"
                />
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">Esqueceu a senha?</button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="group w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Acessar Painel' : 'Criar minha conta'}</span>
                  <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </form>

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
        </div>
      </div>

      {/* Right side: Visual Experience */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[5s]"
          alt="Vista para o mar paradisíaco"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/40 to-primary/20"></div>
        
        {/* Floating card elements for visual interest */}
        <div className="absolute top-16 right-12 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl animate-bounce duration-[3000ms] hidden xl:block">
           <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-green-400/20 flex items-center justify-center">
                <span className="material-icons-round text-green-400 text-lg">check_circle</span>
              </div>
              <div>
                <p className="text-white font-bold text-[11px] uppercase tracking-tighter">Férias Aprovadas</p>
                <p className="text-white/60 text-[10px]">Aline Ribeiro • 15 dias</p>
              </div>
           </div>
        </div>

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
