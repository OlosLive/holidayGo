
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Planning from './pages/Planning';
import UserForm from './pages/UserForm';
import Auth from './pages/Auth';
import Summary from './pages/Summary';

const Navbar: React.FC<{ isDarkMode: boolean, toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await signOut();
    navigate('/auth');
  };

  if (location.pathname === '/auth') return null;

  // Get user initials from profile name or email
  const getInitials = () => {
    if (profile?.name) {
      return profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return '??';
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Usuário';
  const displayEmail = user?.email || '';

  return (
    <nav className="bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
              <span className="material-icons-round text-primary text-3xl">flight_takeoff</span>
              <span className="font-bold text-xl tracking-tight dark:text-white font-display">holidayGo</span>
            </Link>
            <div className="hidden md:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`${isActive('/dashboard') ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors`}
              >
                Dashboard
              </Link>
              <Link
                to="/planning"
                className={`${isActive('/planning') ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors`}
              >
                Planejamento
              </Link>
              <Link
                to="/summary"
                className={`${isActive('/summary') ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors`}
              >
                Resumo
              </Link>
              <Link
                to="/users"
                className={`${isActive('/users') ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors`}
              >
                Colaboradores
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons-round">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors cursor-pointer"
              >
                {getInitials()}
              </button>
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                    >
                      <span className="material-icons-round text-lg">logout</span>
                      Sair do sistema
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/summary" element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/planning" element={
            <ProtectedRoute>
              <Planning />
            </ProtectedRoute>
          } />
          <Route path="/users/add" element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          } />
          <Route path="/users/edit/:id" element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <footer className="bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} holidayGo System. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
