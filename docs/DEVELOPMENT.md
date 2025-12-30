# 💻 Guia de Desenvolvimento - holidayGo

Este guia fornece instruções detalhadas para desenvolvedores que desejam contribuir ou estender o sistema holidayGo.

## Índice

- [Configuração do Ambiente](#configuração-do-ambiente)
- [Configuração do Supabase](#configuração-do-supabase)
- [Estrutura do Código](#estrutura-do-código)
- [Guia de Estilo](#guia-de-estilo)
- [Trabalhando com Hooks](#trabalhando-com-hooks)
- [Adicionando Funcionalidades](#adicionando-funcionalidades)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Build e Deploy](#build-e-deploy)
- [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)
- [Boas Práticas](#boas-práticas)

---

## Configuração do Ambiente

### Requisitos

- **Node.js**: v18.0.0 ou superior
- **npm**: v9.0.0 ou superior (ou yarn/pnpm)
- **Editor**: VS Code recomendado com extensões TypeScript e ESLint
- **Git**: Para controle de versão
- **Conta Supabase**: [supabase.com](https://supabase.com)

### Setup Inicial

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd holidayGo
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o Supabase** (ver seção abaixo)

4. **Configure variáveis de ambiente**

Crie o arquivo `.env.local` na raiz:

```env
# Supabase (obrigatório)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# Google Gemini AI (opcional)
GEMINI_API_KEY=sua_chave_aqui
```

5. **Execute em modo desenvolvimento**

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Extensões Recomendadas (VS Code)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

---

## Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **New Project**
3. Preencha:
   - **Name**: holidaygo (ou outro nome)
   - **Database Password**: (guarde em local seguro)
   - **Region**: Escolha a mais próxima
4. Aguarde a criação (1-2 minutos)

### 2. Executar Script SQL

1. No Supabase Dashboard, acesse **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo de `supabase/migrations/001_initial_schema.sql`
4. Clique em **Run**

O script cria:
- Tabela `profiles` (colaboradores)
- Tabela `vacations` (férias)
- Políticas RLS (Row Level Security)
- Triggers para timestamps e contadores

### 3. Configurar Autenticação

1. Acesse **Authentication > Providers**
2. Verifique que **Email** está habilitado
3. (Opcional) Em **Authentication > Settings**:
   - Desabilite "Confirm email" para testes locais
   - Configure URLs de redirecionamento

### 4. Obter Credenciais

1. Acesse **Settings > API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...`
3. Cole no `.env.local`

### 5. Verificar Configuração

```bash
# Testar conexão via curl
curl "https://seu-projeto.supabase.co/rest/v1/profiles" \
  -H "apikey: sua_anon_key" \
  -H "Authorization: Bearer sua_anon_key"
```

---

## Estrutura do Código

### Diretórios e Arquivos

```
holidayGo/
│
├── lib/                       # Bibliotecas e clientes
│   └── supabaseClient.ts      # Cliente Supabase configurado
│
├── contexts/                  # Contextos React
│   └── AuthContext.tsx        # Contexto de autenticação
│
├── hooks/                     # Hooks personalizados
│   ├── useAuth.ts             # Hook de autenticação
│   ├── useProfiles.ts         # CRUD de colaboradores
│   └── useVacations.ts        # Gestão de férias
│
├── components/                # Componentes reutilizáveis
│   └── ProtectedRoute.tsx     # Proteção de rotas
│
├── pages/                     # Páginas da aplicação
│   ├── Auth.tsx               # Página de autenticação
│   ├── Dashboard.tsx          # Dashboard principal
│   ├── Planning.tsx           # Planejamento interativo
│   ├── Summary.tsx            # Resumo de saldos
│   ├── Users.tsx              # Lista de usuários
│   └── UserForm.tsx           # Formulário CRUD
│
├── types/                     # Definições TypeScript
│   └── database.ts            # Tipos do banco Supabase
│
├── supabase/                  # Configurações Supabase
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
│
├── App.tsx                    # Componente raiz
├── index.tsx                  # Entry point React
├── types.ts                   # Tipos gerais
├── geminiService.ts           # Serviço de IA
│
├── vite.config.ts             # Configuração Vite
├── tsconfig.json              # Configuração TypeScript
└── package.json               # Dependências e scripts
```

### Responsabilidades dos Arquivos

| Arquivo | Responsabilidade |
|---------|------------------|
| `lib/supabaseClient.ts` | Instância do cliente Supabase |
| `contexts/AuthContext.tsx` | Gerencia estado de autenticação |
| `hooks/useProfiles.ts` | CRUD de colaboradores + realtime |
| `hooks/useVacations.ts` | Gestão de férias + realtime |
| `components/ProtectedRoute.tsx` | Protege rotas autenticadas |
| `pages/*.tsx` | Componentes de página |
| `types/database.ts` | Tipos TypeScript do banco |

---

## Trabalhando com Hooks

### useAuth

```typescript
import { useAuth } from './contexts/AuthContext';

const MyComponent = () => {
  const { 
    user,           // User | null
    profile,        // Profile | null
    loading,        // boolean
    initialized,    // boolean
    signIn,         // (email, password) => Promise
    signUp,         // (email, password, name) => Promise
    signOut,        // () => Promise
    updateProfile,  // (updates) => Promise
  } = useAuth();

  const handleLogin = async () => {
    const { error } = await signIn('email@example.com', 'password');
    if (error) {
      console.error('Login failed:', error.message);
    }
  };
};
```

### useProfiles

```typescript
import { useProfiles } from './hooks/useProfiles';

const UsersPage = () => {
  const {
    profiles,       // Profile[]
    loading,        // boolean
    error,          // string | null
    fetchProfiles,  // () => Promise
    getProfile,     // (id) => Promise<Profile | null>
    createProfile,  // (data) => Promise<{ data, error }>
    updateProfile,  // (id, updates) => Promise<{ error }>
    deleteProfile,  // (id) => Promise<{ error }>
  } = useProfiles();

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <ul>
      {profiles.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
};
```

### useVacations

```typescript
import { useVacations } from './hooks/useVacations';

const PlanningPage = () => {
  const {
    vacations,          // Vacation[]
    loading,            // boolean
    error,              // string | null
    getVacationDays,    // (userId, year, month) => number[]
    toggleVacationDay,  // (userId, year, month, day) => Promise
    addVacationDays,    // (userId, year, month, days[]) => Promise
    removeVacationDays, // (userId, year, month, days[]) => Promise
  } = useVacations();

  const handleDayClick = async (day: number) => {
    const { error } = await toggleVacationDay(userId, 2025, 7, day);
    if (error) {
      alert('Erro ao atualizar: ' + error);
    }
  };
};
```

---

## Guia de Estilo

### Convenções TypeScript

#### Nomenclatura

```typescript
// Interfaces: PascalCase
interface Profile {
  id: string;
  name: string;
}

// Types do banco: PascalCase
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

// Componentes: PascalCase
const Dashboard: React.FC<DashboardProps> = ({ users }) => {
  // ...
};

// Hooks: camelCase com prefixo 'use'
const useProfiles = () => { ... };

// Funções: camelCase
const handleSubmit = (e: React.FormEvent) => { ... };

// Constantes: UPPER_SNAKE_CASE
const INITIAL_USERS: User[] = [...];
```

#### Tipagem

```typescript
// ✅ Sempre tipar props de componentes
interface DashboardProps {
  // Props são definidas via hooks agora
}

// ✅ Tipar retornos de hooks
interface UseProfilesReturn {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  // ...
}

// ✅ Usar tipos do banco
import type { Profile, ProfileInsert } from '../types/database';

// ❌ Evitar 'any'
const data: any = {}; // Ruim!

// ✅ Usar tipos específicos
const data: Partial<Profile> = {}; // Bom!
```

### Convenções React

#### Hooks Order

```typescript
const Component = () => {
  // 1. Context hooks
  const { user } = useAuth();
  
  // 2. Custom hooks
  const { profiles, loading } = useProfiles();
  
  // 3. useState
  const [filter, setFilter] = useState('');
  
  // 4. useMemo / useCallback
  const filtered = useMemo(() => 
    profiles.filter(p => p.name.includes(filter)),
    [profiles, filter]
  );
  
  // 5. useEffect
  useEffect(() => {
    // side effects
  }, []);
  
  // 6. Handlers
  const handleClick = () => { ... };
  
  // 7. Early returns
  if (loading) return <Spinner />;
  
  // 8. JSX
  return <div>...</div>;
};
```

### Convenções CSS (Tailwind)

```tsx
// ✅ Ordem recomendada:
// 1. Layout (flex, grid)
// 2. Tamanho (w-, h-, p-, m-)
// 3. Tipografia (text-, font-)
// 4. Cores (bg-, text-, border-)
// 5. Estados (hover:, focus:, dark:)
// 6. Animações (transition-)

<div className="
  flex items-center gap-4
  w-full p-6
  text-sm font-bold
  bg-white dark:bg-slate-900
  border border-slate-200 dark:border-slate-800
  hover:bg-slate-50
  transition-colors
">
```

---

## Adicionando Funcionalidades

### Como Adicionar uma Nova Página

1. **Crie o componente em `pages/`**

```typescript
// pages/Reports.tsx
import React from 'react';
import { useProfiles } from '../hooks/useProfiles';
import { useVacations } from '../hooks/useVacations';

const Reports: React.FC = () => {
  const { profiles, loading: profilesLoading } = useProfiles();
  const { vacations, loading: vacationsLoading } = useVacations();

  if (profilesLoading || vacationsLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black dark:text-white">Relatórios</h1>
      {/* Conteúdo */}
    </div>
  );
};

export default Reports;
```

2. **Adicione a rota em `App.tsx`**

```typescript
import Reports from './pages/Reports';

// Dentro de <Routes>
<Route path="/reports" element={
  <ProtectedRoute><Reports /></ProtectedRoute>
} />
```

3. **Adicione link na Navbar**

### Como Adicionar um Novo Campo ao Banco

1. **Atualize o schema SQL**

```sql
-- Nova migration
ALTER TABLE profiles ADD COLUMN phone_number TEXT;
```

2. **Atualize os tipos em `types/database.ts`**

```typescript
export interface Profile {
  // ... campos existentes
  phone_number?: string | null;
}
```

3. **Atualize os formulários**

### Como Adicionar um Novo Hook

```typescript
// hooks/useReports.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useReports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vacations')
        .select('*, profiles(name)')
        .order('vacation_date');

      if (error) throw error;
      setData(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { data, loading, error, fetchReports };
};
```

---

## Variáveis de Ambiente

### Arquivo `.env.local`

```env
# Supabase (obrigatório)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Google Gemini AI (opcional)
GEMINI_API_KEY=AIzaSy...
```

### Acessando no Código

```typescript
// Variáveis VITE_* estão disponíveis via import.meta.env
const url = import.meta.env.VITE_SUPABASE_URL;

// Variáveis sem VITE_ são processadas pelo vite.config.ts
const apiKey = process.env.API_KEY; // Injetada no build
```

### Segurança

⚠️ **NUNCA commite arquivos `.env.local`!**

```gitignore
# .gitignore
.env.local
.env.*.local
```

---

## Build e Deploy

### Build Local

```bash
npm run build    # Gera build de produção
npm run preview  # Testa build localmente
```

### Deploy com Supabase

1. Configure variáveis de ambiente no serviço de hosting
2. A mesma instância Supabase serve dev e produção
3. Use branches do Supabase para staging (opcional)

### Variáveis de Ambiente em Produção

| Serviço | Onde configurar |
|---------|----------------|
| Vercel | Settings → Environment Variables |
| Netlify | Site settings → Build & deploy → Environment |
| Railway | Variables tab |

---

## Debugging

### React DevTools

- Inspecione componentes
- Veja state de hooks customizados
- Trace re-renders

### Supabase Dashboard

- **Table Editor**: Visualize e edite dados
- **Logs**: Veja requisições e erros
- **Auth**: Gerencie usuários

### Console do Navegador

```typescript
// Logs úteis para debug
console.log('Profiles:', profiles);
console.log('Auth state:', { user, loading, initialized });
```

### Network Tab

- Verifique requisições ao Supabase
- Confirme headers de autenticação
- Analise payloads e respostas

---

## Troubleshooting

### Problema: Tela de carregamento infinita

**Causas**:
1. Variáveis de ambiente não configuradas
2. URL ou chave do Supabase incorretas
3. Projeto Supabase pausado

**Solução**:
1. Verifique `.env.local`
2. Reinicie o servidor: `npm run dev`
3. Verifique status do projeto no Supabase Dashboard

### Problema: Erro de autenticação

**Causas**:
1. Email Auth desabilitado
2. Credenciais incorretas
3. Usuário não confirmado

**Solução**:
1. Habilite Email Auth no Supabase
2. Desabilite "Confirm email" para testes
3. Verifique logs no Authentication

### Problema: Dados não aparecem

**Causas**:
1. RLS bloqueando acesso
2. Usuário não autenticado
3. Tabelas não criadas

**Solução**:
1. Verifique políticas RLS no SQL Editor
2. Confirme login na aplicação
3. Execute o script de migration

### Problema: Real-time não funciona

**Causas**:
1. Realtime não habilitado na tabela
2. Subscription não configurada

**Solução**:
```sql
-- Habilitar realtime na tabela
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE vacations;
```

---

## Boas Práticas

### 1. Use os Hooks Corretamente

```typescript
// ✅ Hook no topo do componente
const { profiles, loading } = useProfiles();

// ❌ Nunca use hooks condicionalmente
if (someCondition) {
  const { profiles } = useProfiles(); // ERRO!
}
```

### 2. Trate Loading e Erros

```typescript
const { profiles, loading, error } = useProfiles();

if (loading) return <Spinner />;
if (error) return <Error message={error} />;
return <ProfileList profiles={profiles} />;
```

### 3. Use Optimistic Updates

```typescript
// Atualiza UI imediatamente
setProfiles(prev => [...prev, newProfile]);

// Persiste no banco
const { error } = await createProfile(newProfile);

// Reverte se erro
if (error) {
  setProfiles(prev => prev.filter(p => p.id !== newProfile.id));
}
```

### 4. Mantenha Tipos Atualizados

```typescript
// Sempre use tipos do database.ts
import type { Profile, Vacation } from '../types/database';
```

### 5. Limpe Subscriptions

```typescript
useEffect(() => {
  const channel = supabase.channel('...');
  
  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## Scripts Úteis

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Recursos Adicionais

- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## Próximos Passos

Após dominar este guia, consulte:

- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura detalhada
- [COMPONENTS.md](COMPONENTS.md) - Documentação de componentes
- [API.md](API.md) - Referência de tipos e serviços

---

**Dúvidas?** Abra uma issue ou consulte a documentação do Supabase.
