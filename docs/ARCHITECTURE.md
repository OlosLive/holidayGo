# 🏗️ Arquitetura do Sistema holidayGo

Este documento descreve a arquitetura técnica, padrões de design e fluxos de dados da aplicação holidayGo.

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura de Componentes](#arquitetura-de-componentes)
- [Repository Pattern e Camada de Dados](#repository-pattern-e-camada-de-dados)
- [Integração com Supabase](#integração-com-supabase)
- [Fluxo de Dados](#fluxo-de-dados)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Sistema de Roteamento](#sistema-de-roteamento)
- [Autenticação](#autenticação)
- [Integração com IA](#integração-com-ia)
- [Tema e Estilização](#tema-e-estilização)
- [Padrões de Design](#padrões-de-design)

---

## Visão Geral

O holidayGo é uma **Single Page Application (SPA)** construída com React 19 e TypeScript. A aplicação segue uma arquitetura baseada em componentes funcionais com hooks, utilizando **Supabase** como backend (autenticação, banco de dados e real-time) e React Router para navegação.

### Stack Tecnológico

```mermaid
graph TB
    subgraph ClientSide[Client Side]
        React[React 19.2.3]
        TS[TypeScript 5.8]
        Router[React Router 7.11]
        Vite[Vite 6.2]
    end
    
    subgraph Styling[Estilização]
        Tailwind[Tailwind CSS]
        Icons[Material Icons]
    end
    
    subgraph Backend[Backend - Supabase]
        Auth[Supabase Auth]
        DB[PostgreSQL]
        Realtime[Supabase Realtime]
    end
    
    subgraph External[Serviços Externos]
        Gemini[Google Gemini AI]
    end
    
    React --> TS
    React --> Router
    TS --> Vite
    React --> Tailwind
    React --> Icons
    React --> Auth
    React --> DB
    React --> Realtime
    React --> Gemini
```

### Princípios Arquiteturais

1. **Componentes Funcionais**: Utilização exclusiva de React Hooks (useState, useEffect, useMemo, useCallback)
2. **Tipagem Forte**: TypeScript em toda a aplicação para segurança de tipos
3. **Context API**: AuthContext para gerenciamento de autenticação
4. **Custom Hooks**: Lógica de dados encapsulada em hooks (useProfiles, useVacations)
5. **Separação de Responsabilidades**: Lógica de negócio separada da apresentação
6. **Design Responsivo**: Mobile-first com breakpoints para tablet e desktop

---

## Arquitetura de Componentes

### Hierarquia de Componentes

```mermaid
graph TD
    Root[index.tsx]
    Root --> App[App.tsx]
    
    App --> AuthProvider[AuthProvider]
    AuthProvider --> Router[HashRouter]
    
    Router --> Navbar[Navbar Component]
    Router --> Routes[Routes]
    Router --> Footer[Footer]
    
    Routes --> Auth[Auth Page]
    Routes --> Protected[ProtectedRoute]
    
    Protected --> Dashboard[Dashboard Page]
    Protected --> Planning[Planning Page]
    Protected --> Summary[Summary Page]
    Protected --> Users[Users Page]
    Protected --> UserForm[UserForm Page]
    
    Dashboard --> useProfiles[useProfiles Hook]
    Dashboard --> useVacations[useVacations Hook]
    Planning --> useProfiles
    Planning --> useVacations
    
    style AuthProvider fill:#3ECF8E
    style Protected fill:#f3e5f5
    style useProfiles fill:#e3f2fd
    style useVacations fill:#e3f2fd
```

### Estrutura de Arquivos

```
holidayGo/
├── index.tsx              # Ponto de entrada React
├── App.tsx                # Componente raiz com AuthProvider
│
├── lib/                   # Bibliotecas e clientes
│   └── supabaseClient.ts  # Cliente Supabase configurado
│
├── contexts/              # Contextos React
│   └── AuthContext.tsx    # Contexto de autenticação
│
├── hooks/                 # Hooks personalizados
│   ├── useAuth.ts         # Hook de autenticação
│   ├── useProfiles.ts     # CRUD de colaboradores
│   └── useVacations.ts    # Gestão de férias
│
├── components/            # Componentes reutilizáveis
│   └── ProtectedRoute.tsx # Proteção de rotas
│
├── pages/                 # Páginas da aplicação
│   ├── Auth.tsx           # Autenticação (login/registro)
│   ├── Dashboard.tsx      # Dashboard com calendários
│   ├── Planning.tsx       # Planejamento de férias
│   ├── Summary.tsx        # Resumo de saldos
│   ├── Users.tsx          # Listagem de usuários
│   └── UserForm.tsx       # Formulário CRUD usuário
│
├── types/                 # Definições TypeScript
│   └── database.ts        # Tipos do banco Supabase
│
├── supabase/              # Configurações Supabase
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
│
├── types.ts               # Tipos gerais
├── geminiService.ts       # Serviço de IA
└── vite.config.ts         # Configuração build
```

---

## Repository Pattern e Camada de Dados

O holidayGo implementa o **Repository Pattern** para abstrair a fonte de dados. Isso permite alternar entre dados mockados (localStorage) e Supabase sem modificar a lógica de negócio.

### Arquitetura da Camada de Dados

```mermaid
graph TB
    subgraph UI[Interface do Usuário]
        Dashboard[Dashboard]
        Planning[Planning]
        Summary[Summary]
    end
    
    subgraph Hooks[Custom Hooks]
        useProfiles[useProfiles]
        useVacations[useVacations]
    end
    
    subgraph Factory[Repository Factory]
        getProfileRepo[getProfileRepository]
        getVacationRepo[getVacationRepository]
    end
    
    subgraph Config[Configuração]
        useMockData{VITE_USE_MOCK_DATA}
    end
    
    subgraph Repositories[Repositórios]
        subgraph Mock[Mock - localStorage]
            MockProfile[MockProfileRepository]
            MockVacation[MockVacationRepository]
        end
        subgraph Supabase[Supabase - Cloud]
            SupaProfile[SupabaseProfileRepository]
            SupaVacation[SupabaseVacationRepository]
        end
    end
    
    Dashboard --> useProfiles
    Planning --> useProfiles
    Planning --> useVacations
    Summary --> useProfiles
    Summary --> useVacations
    
    useProfiles --> getProfileRepo
    useVacations --> getVacationRepo
    
    getProfileRepo --> useMockData
    getVacationRepo --> useMockData
    
    useMockData -->|true| MockProfile
    useMockData -->|true| MockVacation
    useMockData -->|false| SupaProfile
    useMockData -->|false| SupaVacation
    
    style useMockData fill:#ffd700
    style Mock fill:#90EE90
    style Supabase fill:#3ECF8E
```

### Interfaces dos Repositórios

```typescript
// lib/repositories/interfaces.ts
export interface IProfileRepository {
  fetchProfiles(): Promise<{ data: Profile[] | null; error: string | null }>;
  getProfile(id: string): Promise<{ data: Profile | null; error: string | null }>;
  createProfile(profile: ProfileInsert): Promise<{ data: Profile | null; error: string | null }>;
  updateProfile(id: string, updates: ProfileUpdate): Promise<{ error: string | null }>;
  deleteProfile(id: string): Promise<{ error: string | null }>;
}

export interface IVacationRepository {
  fetchAllVacations(): Promise<{ data: Vacation[] | null; error: string | null }>;
  getVacationDays(userId: string, year: number, month: number): number[];
  toggleVacationDay(userId: string, year: number, month: number, day: number): Promise<{ error: string | null }>;
  // ...
}
```

### Fluxo de Decisão

```mermaid
flowchart TD
    Start[Hook solicita dados] --> Check{config.useMockData?}
    Check -->|true| Mock[MockRepository]
    Check -->|false| Supa[SupabaseRepository]
    Mock --> LocalStorage[(localStorage)]
    Supa --> Cloud[(Supabase Cloud)]
    LocalStorage --> Return[Retorna dados]
    Cloud --> Return
```

### Benefícios

| Benefício | Descrição |
|-----------|-----------|
| **Desenvolvimento Offline** | Funciona sem conexão ao Supabase |
| **Testes Isolados** | Mock não afeta dados reais |
| **Prototipagem Rápida** | Dados fictícios pré-configurados |
| **Demonstrações** | Ambiente controlado para apresentações |
| **Inversão de Dependência** | Hooks não dependem de implementação específica |

---

## Integração com Supabase

### Arquitetura do Backend

```mermaid
graph LR
    subgraph App[Aplicação React]
        Client[Supabase Client]
        AuthCtx[AuthContext]
        Hooks[Custom Hooks]
    end
    
    subgraph Supabase[Supabase Cloud]
        Auth[Auth Service]
        PostgREST[PostgREST API]
        Realtime[Realtime Server]
        DB[(PostgreSQL)]
    end
    
    Client --> Auth
    Client --> PostgREST
    Client --> Realtime
    
    Auth --> DB
    PostgREST --> DB
    Realtime --> DB
    
    AuthCtx --> Client
    Hooks --> Client
```

### Schema do Banco de Dados

```mermaid
erDiagram
    auth_users ||--o| profiles : "has one"
    profiles ||--o{ vacations : "has many"
    
    profiles {
        uuid id PK
        text email
        text name
        text role
        text department
        date hire_date
        text status
        int vacation_balance
        int vacation_used
        timestamp created_at
        timestamp updated_at
    }
    
    vacations {
        uuid id PK
        uuid user_id FK
        date vacation_date
        int year
        int month
        int day
        text status
        text notes
        timestamp created_at
    }
```

### Row Level Security (RLS)

```sql
-- Políticas de segurança
-- Profiles: Visualização para usuários autenticados
CREATE POLICY "profiles_select_authenticated" ON profiles
    FOR SELECT TO authenticated USING (true);

-- Profiles: Atualização apenas do próprio perfil
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Vacations: Visualização para usuários autenticados
CREATE POLICY "vacations_select_authenticated" ON vacations
    FOR SELECT TO authenticated USING (true);

-- Vacations: CRUD apenas das próprias férias
CREATE POLICY "vacations_all_own" ON vacations
    FOR ALL TO authenticated USING (auth.uid() = user_id);
```

### Cliente Supabase

```typescript
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
```

---

## Fluxo de Dados

### Fluxo com Supabase

O holidayGo utiliza um fluxo de dados **reativo** onde os custom hooks se conectam ao Supabase e fornecem dados aos componentes.

```mermaid
graph TD
    subgraph UI[Interface do Usuário]
        Dashboard[Dashboard]
        Planning[Planning]
        Users[Users Page]
    end
    
    subgraph Hooks[Custom Hooks]
        useProfiles[useProfiles]
        useVacations[useVacations]
        useAuth[useAuth]
    end
    
    subgraph Supabase[Supabase]
        DB[(Database)]
        Realtime[Realtime Channel]
    end
    
    Dashboard --> useProfiles
    Dashboard --> useVacations
    Planning --> useProfiles
    Planning --> useVacations
    Users --> useProfiles
    
    useProfiles --> DB
    useVacations --> DB
    useAuth --> DB
    
    Realtime --> useProfiles
    Realtime --> useVacations
```

### Ciclo de Vida dos Dados

1. **Inicialização**: Hooks carregam dados do Supabase no mount
2. **Subscriptions**: Real-time listeners atualizam estado automaticamente
3. **Mutação**: Operações CRUD via Supabase API
4. **Otimistic Updates**: Estado local atualizado imediatamente
5. **Sync**: Real-time garante consistência entre clientes

---

## Gerenciamento de Estado

### AuthContext

```typescript
interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}
```

### Custom Hooks

```typescript
// useProfiles - CRUD de colaboradores
const {
  profiles,      // Profile[]
  loading,       // boolean
  error,         // string | null
  fetchProfiles, // () => Promise<void>
  getProfile,    // (id: string) => Promise<Profile | null>
  createProfile, // (data) => Promise<{ data, error }>
  updateProfile, // (id, data) => Promise<{ error }>
  deleteProfile, // (id) => Promise<{ error }>
} = useProfiles();

// useVacations - Gestão de férias
const {
  vacations,         // Vacation[]
  loading,           // boolean
  error,             // string | null
  getVacationDays,   // (userId, year, month) => number[]
  toggleVacationDay, // (userId, year, month, day) => Promise<{ error }>
  addVacationDays,   // (userId, year, month, days[]) => Promise<{ error }>
  removeVacationDays,// (userId, year, month, days[]) => Promise<{ error }>
} = useVacations();
```

### Fluxo de Atualização

```mermaid
sequenceDiagram
    participant User as Usuário
    participant Page as Página
    participant Hook as Custom Hook
    participant Supabase as Supabase
    participant Realtime as Realtime
    
    User->>Page: Clica para adicionar férias
    Page->>Hook: toggleVacationDay(...)
    Hook->>Hook: Otimistic Update (state)
    Hook->>Supabase: INSERT/DELETE vacation
    Supabase->>Supabase: Atualiza DB
    Supabase->>Realtime: Emite evento
    Realtime->>Hook: Notifica mudança
    Hook->>Page: Re-render com novos dados
```

---

## Sistema de Roteamento

### Configuração do React Router

```typescript
<HashRouter>
  <AuthProvider>
    <Navbar />
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/planning" element={
        <ProtectedRoute><Planning /></ProtectedRoute>
      } />
      <Route path="/summary" element={
        <ProtectedRoute><Summary /></ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute><Users /></ProtectedRoute>
      } />
      <Route path="/users/add" element={
        <ProtectedRoute><UserForm /></ProtectedRoute>
      } />
      <Route path="/users/edit/:id" element={
        <ProtectedRoute><UserForm /></ProtectedRoute>
      } />
    </Routes>
    <Footer />
  </AuthProvider>
</HashRouter>
```

### Mapa de Rotas

| Rota | Componente | Protegida | Descrição |
|------|-----------|-----------|-----------|
| `/auth` | Auth | ❌ | Login e registro |
| `/` | Dashboard | ✅ | Página inicial |
| `/dashboard` | Dashboard | ✅ | Dashboard com calendários |
| `/planning` | Planning | ✅ | Planejamento de férias |
| `/summary` | Summary | ✅ | Resumo e status |
| `/users` | Users | ✅ | Lista de colaboradores |
| `/users/add` | UserForm | ✅ | Adicionar usuário |
| `/users/edit/:id` | UserForm | ✅ | Editar usuário |

---

## Autenticação

### Fluxo de Autenticação

#### Login

```mermaid
sequenceDiagram
    participant User as Usuário
    participant Auth as Auth Page
    participant Context as AuthContext
    participant Supabase as Supabase Auth
    participant DB as Database
    
    User->>Auth: Preenche formulário
    Auth->>Context: signIn(email, password)
    Context->>Supabase: signInWithPassword()
    Supabase->>Supabase: Valida credenciais
    Supabase->>Context: Emite SIGNED_IN event
    Context->>Context: Atualiza state (user, session)
    Context->>DB: Busca profile
    DB->>Context: Retorna profile
    Context->>Auth: Re-render (user != null)
    Auth->>Auth: navigate('/dashboard')
```

#### Recuperação de Senha

```mermaid
sequenceDiagram
    participant User as Usuário
    participant Auth as Auth Page
    participant Context as AuthContext
    participant Supabase as Supabase Auth
    participant Email as Email Service
    
    User->>Auth: Clica "Esqueceu a senha?"
    Auth->>Auth: Abre modal
    User->>Auth: Informa email
    Auth->>Context: resetPassword(email)
    Context->>Supabase: resetPasswordForEmail()
    Supabase->>Email: Envia email com link
    Email->>User: Link de recuperação
    User->>Auth: Clica no link
    Auth->>Auth: Detecta ?recovery=true
    Auth->>Supabase: setSession(recoveryToken)
    Supabase->>Auth: Sessão de recuperação
    User->>Auth: Informa nova senha
    Auth->>Context: updatePassword(newPassword)
    Context->>Supabase: updateUser({ password })
    Supabase->>Context: Senha atualizada
    Auth->>Auth: navigate('/dashboard')
```

### ProtectedRoute

```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

---

## Integração com IA

### Arquitetura do Serviço Gemini

```mermaid
graph LR
    Dashboard[Dashboard Component] -->|Clique no botão| Handler[handleGetAiSummary]
    Handler -->|profiles + vacations| Service[geminiService.ts]
    Service -->|API Request| Gemini[Google Gemini AI]
    Gemini -->|Response| Service
    Service -->|text| Handler
    Handler -->|setState| Dashboard
    Dashboard -->|Renderiza| UI[Interface do Usuário]
```

### Implementação do Serviço

```typescript
// geminiService.ts
export const generateTeamSummary = async (
  users: User[], 
  viewMode: 'mensal' | 'anual' = 'mensal',
  selectedMonth?: number,
  selectedYear?: number
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  // Formatar contexto baseado no modo de visualização
  const teamContext = users.map(u => {
    if (viewMode === 'mensal' && selectedMonth !== undefined) {
      // Modo mensal: mostrar dias específicos do mês
      const monthName = months[selectedMonth];
      return `- ${u.name} (${u.role}): Status ${u.status}, Férias em ${monthName}: ${u.plannedVacations.join(', ') || 'Nenhuma'}`;
    } else {
      // Modo anual: mostrar férias organizadas por mês
      // Decodificar formato: mês*1000 + dia
      const annualData = /* processar dados anuais */;
      return `- ${u.name} (${u.role}): Status ${u.status}, Férias no ano: ${formatAnnualVacations(annualData)}`;
    }
  }).join('\n');

  const periodContext = viewMode === 'mensal' 
    ? `${months[selectedMonth]} de ${selectedYear}`
    : `ano de ${selectedYear}`;

  const prompt = `
    Abaixo está uma lista da equipe e seus status de férias para o ${periodContext}. 
    Gere um resumo executivo curto (máximo 150 palavras) em Português do Brasil.
    ${viewMode === 'anual' ? 'Analise a distribuição de férias ao longo do ano e identifique períodos críticos.' : ''}
    
    Equipe:
    ${teamContext}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  
  return response.text || "Erro ao gerar resumo.";
};
```

### Fluxo de Análise de Disponibilidade

```mermaid
sequenceDiagram
    participant User as Usuário
    participant Dashboard as Dashboard
    participant Handler as handleGetAiSummary
    participant Service as geminiService
    participant Gemini as Google Gemini AI
    
    User->>Dashboard: Seleciona período (mensal/anual)
    User->>Dashboard: Clica "Pedir Resumo IA"
    Dashboard->>Handler: viewMode, selectedMonth, selectedYear
    Handler->>Handler: Coleta dados do período
    Note over Handler: Modo mensal: apenas mês selecionado<br/>Modo anual: todos os 12 meses
    Handler->>Service: generateTeamSummary(users, viewMode, month, year)
    Service->>Service: Formata contexto baseado no modo
    Service->>Gemini: API Request com prompt contextualizado
    Gemini->>Service: Resposta com análise
    Service->>Handler: Texto do resumo
    Handler->>Dashboard: setAiSummary(summary)
    Dashboard->>User: Exibe análise do período selecionado
```

---

## Tema e Estilização

### Sistema de Dark Mode

```mermaid
graph TD
    Toggle[Botão de Toggle] -->|onClick| Handler[toggleTheme]
    Handler -->|setIsDarkMode| State[isDarkMode state]
    State -->|useEffect| DOM[document.documentElement]
    DOM -->|add/remove| Class[class 'dark']
    Class -->|CSS| Styles[Tailwind Dark Variants]
```

### Paleta de Cores

```css
/* Modo Claro */
--background: white
--surface: slate-50
--text-primary: slate-900
--text-secondary: slate-500
--border: slate-200
--primary: blue-600

/* Modo Escuro (dark:*) */
--background: slate-950
--surface: slate-900
--text-primary: white
--text-secondary: slate-400
--border: slate-800
--primary: blue-500
```

---

## Padrões de Design

### 1. Repository Pattern

Abstrai a fonte de dados, permitindo alternar entre implementações:

```typescript
// Interface define contrato
interface IProfileRepository {
  fetchProfiles(): Promise<{ data: Profile[] | null; error: string | null }>;
}

// Implementações diferentes
class MockProfileRepository implements IProfileRepository { ... }
class SupabaseProfileRepository implements IProfileRepository { ... }

// Factory decide qual usar
const repository = config.useMockData 
  ? new MockProfileRepository() 
  : new SupabaseProfileRepository();
```

### 2. Container/Presentational Pattern

**Container (Smart Component)**
- Gerencia estado e lógica
- Conecta-se a hooks
- Exemplo: `Dashboard.tsx`, `Planning.tsx`

**Presentational (Dumb Component)**
- Apenas renderiza UI
- Exemplo: `StatusBadge`, `Navbar`, `Footer`

### 3. Custom Hooks Pattern

Encapsula lógica de dados em hooks reutilizáveis:

```typescript
// Hook encapsula toda lógica de dados
const { profiles, loading, error, createProfile } = useProfiles();

// Componente foca apenas na UI
if (loading) return <Spinner />;
if (error) return <Error message={error} />;
return <ProfileList profiles={profiles} />;
```

### 4. Context + Hooks Pattern

```typescript
// Contexto provê estado global
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook consome o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
};
```

### 5. Optimistic Updates

```typescript
const toggleVacationDay = async (userId, year, month, day) => {
  // 1. Atualiza estado local imediatamente
  setVacations(prev => [...prev, newVacation]);
  
  // 2. Persiste no banco
  const { error } = await supabase.from('vacations').insert(newVacation);
  
  // 3. Reverte se houver erro
  if (error) {
    setVacations(prev => prev.filter(v => v.id !== newVacation.id));
    return { error: error.message };
  }
  
  return { error: null };
};
```

---

## Segurança

### Proteção de API Keys

```typescript
// vite.config.ts
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
}
```

- API keys nunca commitadas no código
- Carregadas de `.env.local`
- Injetadas em tempo de build

### Row Level Security

- Todas as tabelas protegidas com RLS
- Políticas granulares por operação (SELECT, INSERT, UPDATE, DELETE)
- Autenticação via JWT verificada pelo Supabase

### Validação de Dados

- TypeScript garante tipagem forte
- Validação de formulários no frontend
- Constraints no banco de dados

---

## Escalabilidade

### Preparação para Crescimento

O código atual está preparado para evoluir:

1. ✅ **Context API** - Implementado para autenticação
2. ✅ **Custom Hooks** - Isolam lógica de dados
3. ✅ **Backend Real** - Supabase integrado
4. ✅ **Autenticação Real** - Supabase Auth implementado
5. ✅ **Repository Pattern** - Abstração de fonte de dados
6. ✅ **Modo Mock** - Desenvolvimento offline com localStorage
7. ⏳ **Testes** - Jest, React Testing Library
8. ⏳ **CI/CD** - GitHub Actions

### Pontos de Extensão

- **Repository Pattern** permite trocar fonte de dados facilmente
- Serviços isolados facilitam mocking e testes
- Tipos TypeScript centralizados
- Componentes desacoplados
- Real-time pronto para colaboração multi-usuário
- Modo mock para demonstrações e prototipagem

---

## Conclusão

A arquitetura do holidayGo prioriza:

- ✅ **Simplicidade**: Sem over-engineering
- ✅ **Manutenibilidade**: Código limpo e organizado
- ✅ **Escalabilidade**: Preparado para crescer
- ✅ **Performance**: Otimizações estratégicas
- ✅ **Segurança**: RLS + Autenticação robusta
- ✅ **Developer Experience**: TypeScript + Vite + Supabase
- ✅ **Real-time**: Atualizações em tempo real

Para mais detalhes sobre componentes específicos, consulte [COMPONENTS.md](COMPONENTS.md).
