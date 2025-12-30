# 💻 Guia de Desenvolvimento - holidayGo

Este guia fornece instruções detalhadas para desenvolvedores que desejam contribuir ou estender o sistema holidayGo.

## Índice

- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura do Código](#estrutura-do-código)
- [Guia de Estilo](#guia-de-estilo)
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

3. **Configure variáveis de ambiente**

Crie o arquivo `.env.local` na raiz:

```env
GEMINI_API_KEY=sua_chave_aqui
```

Para obter uma chave da API Gemini:
- Acesse [Google AI Studio](https://ai.google.dev/)
- Crie um projeto
- Gere uma API key
- Cole no arquivo `.env.local`

4. **Execute em modo desenvolvimento**

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

## Estrutura do Código

### Diretórios e Arquivos

```
holidayGo/
│
├── pages/                      # Páginas da aplicação
│   ├── Auth.tsx               # Página de autenticação
│   ├── Dashboard.tsx          # Dashboard principal (calendários)
│   ├── Planning.tsx           # Planejamento interativo
│   ├── Summary.tsx            # Resumo de saldos
│   ├── Users.tsx              # Lista de usuários
│   └── UserForm.tsx           # Formulário CRUD de usuário
│
├── App.tsx                    # Componente raiz
├── index.tsx                  # Entry point React
├── types.ts                   # Definições TypeScript
├── constants.ts               # Dados iniciais mockados
├── geminiService.ts           # Serviço de integração IA
│
├── vite.config.ts             # Configuração Vite
├── tsconfig.json              # Configuração TypeScript
├── package.json               # Dependências e scripts
├── index.html                 # Template HTML
│
└── docs/                      # Documentação
    ├── ARCHITECTURE.md        # Arquitetura do sistema
    ├── DEVELOPMENT.md         # Este arquivo
    ├── COMPONENTS.md          # Documentação de componentes
    ├── API.md                 # API e tipos
    └── USER_GUIDE.md          # Manual do usuário
```

### Responsabilidades dos Arquivos

| Arquivo | Responsabilidade |
|---------|------------------|
| `index.tsx` | Renderiza App no DOM |
| `App.tsx` | Gerencia estado global, roteamento, tema |
| `types.ts` | Interfaces e tipos TypeScript |
| `constants.ts` | Dados de exemplo (INITIAL_USERS) |
| `geminiService.ts` | Comunicação com Google Gemini AI |
| `pages/*.tsx` | Componentes de página individuais |

---

## Guia de Estilo

### Convenções TypeScript

#### Nomenclatura

```typescript
// Interfaces: PascalCase
interface User {
  id: string;
  name: string;
}

// Types: PascalCase
type UserStatus = 'Ativo' | 'Inativo' | 'Férias' | 'Pendente';

// Componentes: PascalCase
const Dashboard: React.FC<DashboardProps> = ({ users }) => {
  // ...
};

// Funções: camelCase
const handleSubmit = (e: React.FormEvent) => {
  // ...
};

// Constantes: UPPER_SNAKE_CASE
const INITIAL_USERS: User[] = [...];

// Variáveis: camelCase
const selectedUser = users.find(u => u.id === id);
```

#### Tipagem

```typescript
// ✅ Sempre tipar props de componentes
interface DashboardProps {
  users: User[];
}

// ✅ Tipar estados explicitamente quando necessário
const [users, setUsers] = useState<User[]>(INITIAL_USERS);

// ✅ Tipar retornos de funções complexas
const generateSummary = async (users: User[]): Promise<string> => {
  // ...
};

// ❌ Evitar 'any'
const data: any = {}; // Ruim!

// ✅ Usar tipos específicos
const data: Partial<User> = {}; // Bom!
```

### Convenções React

#### Componentes Funcionais

```typescript
// ✅ Formato padrão
const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Hooks no topo
  const [state, setState] = useState(initialValue);
  
  // useEffect após useState
  useEffect(() => {
    // side effects
  }, [dependencies]);
  
  // Funções auxiliares
  const handleClick = () => {
    // ...
  };
  
  // Early returns para casos especiais
  if (loading) return <Loading />;
  
  // JSX principal
  return (
    <div>
      {/* ... */}
    </div>
  );
};

export default ComponentName;
```

#### Hooks

```typescript
// ✅ Ordem dos hooks (sempre a mesma)
const Component = () => {
  // 1. useState
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 2. useEffect
  useEffect(() => {
    // ...
  }, []);
  
  // 3. useMemo / useCallback
  const computed = useMemo(() => {
    return heavyCalculation(data);
  }, [data]);
  
  // 4. Custom hooks (se houver)
  const { user } = useAuth();
  
  return <div />;
};
```

### Convenções CSS (Tailwind)

#### Classes Ordenadas

```tsx
// ✅ Ordem recomendada:
// 1. Layout (flex, grid, block)
// 2. Posição (relative, absolute)
// 3. Tamanho (w-, h-, p-, m-)
// 4. Tipografia (text-, font-)
// 5. Cores (bg-, text-, border-)
// 6. Estados (hover:, focus:, dark:)
// 7. Animações (transition-, animate-)

<div className="
  flex items-center gap-4
  w-full p-6
  text-sm font-bold
  bg-white dark:bg-slate-900
  border border-slate-200 dark:border-slate-800
  rounded-lg
  hover:bg-slate-50
  transition-colors
">
  Conteúdo
</div>
```

#### Dark Mode

```tsx
// ✅ Sempre incluir variante dark
<div className="bg-white dark:bg-slate-900">
  <p className="text-slate-900 dark:text-white">Texto</p>
</div>

// ✅ Usar classes de dark mode consistentes
dark:bg-surface-dark     // Fundos de cards
dark:bg-slate-900        // Fundos principais
dark:text-white          // Texto principal
dark:text-slate-400      // Texto secundário
dark:border-slate-800    // Bordas
```

---

## Adicionando Funcionalidades

### Como Adicionar uma Nova Página

1. **Crie o componente na pasta `pages/`**

```typescript
// pages/Reports.tsx
import React from 'react';
import { User } from '../types';

interface ReportsProps {
  users: User[];
}

const Reports: React.FC<ReportsProps> = ({ users }) => {
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black dark:text-white">Relatórios</h1>
      {/* Seu conteúdo aqui */}
    </div>
  );
};

export default Reports;
```

2. **Importe no App.tsx**

```typescript
import Reports from './pages/Reports';
```

3. **Adicione a rota**

```typescript
<Routes>
  {/* Rotas existentes */}
  <Route path="/reports" element={<Reports users={users} />} />
</Routes>
```

4. **Adicione link na Navbar**

```typescript
<Link
  to="/reports"
  className={`${isActive('/reports') ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-500'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold`}
>
  Relatórios
</Link>
```

### Como Adicionar um Novo Campo ao User

1. **Atualize a interface em `types.ts`**

```typescript
export interface User {
  id: string;
  name: string;
  // ... campos existentes
  phoneNumber?: string; // Novo campo
}
```

2. **Atualize `constants.ts`**

```typescript
export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Allan',
    // ... campos existentes
    phoneNumber: '(11) 98765-4321', // Adicione aos usuários
  },
  // ...
];
```

3. **Atualize o formulário em `UserForm.tsx`**

```typescript
const [formData, setFormData] = useState<Partial<User>>({
  // ... campos existentes
  phoneNumber: '',
});

// No JSX
<input
  type="tel"
  value={formData.phoneNumber}
  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
  placeholder="(00) 00000-0000"
  className="form-input rounded-lg"
/>
```

4. **Atualize a exibição onde necessário**

```typescript
// Em Users.tsx, Dashboard.tsx, etc.
<span>{user.phoneNumber}</span>
```

### Como Adicionar um Novo Serviço

1. **Crie o arquivo do serviço**

```typescript
// notificationService.ts
export const sendNotification = async (
  userId: string, 
  message: string
): Promise<boolean> => {
  try {
    // Lógica do serviço
    return true;
  } catch (error) {
    console.error('Notification error:', error);
    return false;
  }
};
```

2. **Use no componente**

```typescript
import { sendNotification } from '../notificationService';

const handleApprove = async () => {
  const success = await sendNotification(user.id, 'Férias aprovadas!');
  if (success) {
    // Atualizar UI
  }
};
```

---

## Variáveis de Ambiente

### Arquivo `.env.local`

```env
# API Key do Google Gemini
GEMINI_API_KEY=AIzaSy...

# Outras variáveis (exemplo)
# VITE_API_URL=https://api.example.com
# VITE_APP_ENV=development
```

### Acessando no Código

```typescript
// Configurado no vite.config.ts
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
}

// Uso no código
const apiKey = process.env.API_KEY;
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
# Gerar build de produção
npm run build

# Testar build localmente
npm run preview
```

Arquivos gerados em: `dist/`

### Deploy

#### Opção 1: Vercel

```bash
npm install -g vercel
vercel --prod
```

#### Opção 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Opção 3: GitHub Pages

1. Configure no `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/holidayGo/', // Nome do repositório
  // ...
});
```

2. Build e deploy:

```bash
npm run build
# Use gh-pages ou publique manualmente a pasta dist/
```

### Variáveis de Ambiente em Produção

Configure as variáveis no painel do serviço de hosting:

- **Vercel**: Settings → Environment Variables
- **Netlify**: Site settings → Build & deploy → Environment

---

## Debugging

### React DevTools

Instale a extensão [React DevTools](https://react.dev/learn/react-developer-tools):

- Inspecione componentes
- Veja props e state em tempo real
- Trace re-renders

### Vite DevTools

Console do navegador mostra:
- Hot Module Replacement (HMR) logs
- Erros de compilação TypeScript
- Avisos do React

### Debugging TypeScript

```typescript
// Use console.log estratégico
console.log('User data:', user);

// Use debugger;
const handleClick = () => {
  debugger; // Pausa execução
  // ...
};

// TypeScript type checking
// Execute: npx tsc --noEmit
```

### Source Maps

Habilitadas automaticamente em dev mode. Para produção:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true, // Gera source maps
  },
});
```

---

## Troubleshooting

### Problema: "Cannot find module"

**Causa**: Dependência não instalada ou caminho incorreto

**Solução**:
```bash
npm install
# ou
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Port 3000 is already in use"

**Causa**: Outra aplicação usando a porta

**Solução 1**: Mude a porta em `vite.config.ts`:
```typescript
server: {
  port: 3001,
}
```

**Solução 2**: Finalize o processo:
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problema: Gemini API retorna erro 401

**Causa**: API key inválida ou não configurada

**Solução**:
1. Verifique o arquivo `.env.local`
2. Confirme que a chave está ativa no [AI Studio](https://ai.google.dev/)
3. Reinicie o servidor dev: `npm run dev`

### Problema: Dark mode não funciona

**Causa**: Classe 'dark' não aplicada no HTML

**Solução**: Verifique o useEffect no App.tsx:
```typescript
useEffect(() => {
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [isDarkMode]);
```

### Problema: Tipos TypeScript não reconhecidos

**Causa**: Cache do TypeScript desatualizado

**Solução**:
```bash
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Ou recompile
npx tsc --noEmit
```

---

## Boas Práticas

### 1. Sempre Tipar Props

```typescript
// ❌ Ruim
const Component = ({ data }) => {
  // ...
};

// ✅ Bom
interface ComponentProps {
  data: User[];
}

const Component: React.FC<ComponentProps> = ({ data }) => {
  // ...
};
```

### 2. Extrair Lógica Complexa

```typescript
// ❌ Ruim - Lógica no JSX
<div>
  {users.filter(u => u.status === 'Ativo' && u.vacationBalance > 30).map(u => (
    <span key={u.id}>{u.name}</span>
  ))}
</div>

// ✅ Bom - Lógica extraída
const activeUsersWithBalance = users.filter(
  u => u.status === 'Ativo' && u.vacationBalance > 30
);

<div>
  {activeUsersWithBalance.map(u => (
    <span key={u.id}>{u.name}</span>
  ))}
</div>
```

### 3. Usar useMemo para Cálculos Pesados

```typescript
// ✅ Evita recalcular a cada render
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => 
    a.vacationBalance - b.vacationBalance
  );
}, [users]);
```

### 4. Sempre Usar Keys em Listas

```typescript
// ❌ Ruim
{users.map(user => (
  <div>{user.name}</div>
))}

// ✅ Bom
{users.map(user => (
  <div key={user.id}>{user.name}</div>
))}
```

### 5. Componentizar Elementos Repetidos

```typescript
// ✅ Criar componente reutilizável
const UserCard: React.FC<{ user: User }> = ({ user }) => (
  <div className="card">
    <h3>{user.name}</h3>
    <p>{user.role}</p>
  </div>
);

// Usar em múltiplos lugares
<UserCard user={user} />
```

### 6. Limpar Side Effects

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    // ...
  }, 1000);
  
  // ✅ Cleanup
  return () => clearTimeout(timer);
}, []);
```

### 7. Validar Dados de Entrada

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // ✅ Validações
  if (!formData.name) {
    alert('Nome é obrigatório');
    return;
  }
  
  if (!formData.email.includes('@')) {
    alert('Email inválido');
    return;
  }
  
  // Processar
};
```

### 8. Usar Early Returns

```typescript
// ✅ Melhora legibilidade
const Component = ({ data }) => {
  if (!data) return null;
  if (data.length === 0) return <Empty />;
  
  return <List data={data} />;
};
```

### 9. Comentar Código Complexo

```typescript
// ✅ Explicar lógicas não óbvias
// Mock data for months other than the selected one
// Uses user ID + month index to generate pseudo-random values
const mockDays = (parseInt(user.id) + monthIdx) % 7;
return mockDays > 4 ? 0 : mockDays;
```

### 10. Manter Componentes Pequenos

**Regra de ouro**: Se um componente passa de 300 linhas, considere dividir.

```typescript
// ❌ Componente muito grande (500+ linhas)
const Dashboard = () => {
  // Muita lógica
  // Muito JSX
};

// ✅ Dividir em subcomponentes
const Dashboard = () => (
  <>
    <DashboardHeader />
    <DashboardStats />
    <DashboardTable />
  </>
);
```

---

## Scripts Úteis

```json
{
  "scripts": {
    "dev": "vite",                    // Servidor dev
    "build": "vite build",            // Build produção
    "preview": "vite preview",        // Preview do build
    "type-check": "tsc --noEmit",     // Checar tipos
    "lint": "eslint . --ext ts,tsx"   // Lint (se configurado)
  }
}
```

### Executar

```bash
npm run dev         # Desenvolvimento
npm run build       # Produção
npm run preview     # Testar build
npm run type-check  # Validar TypeScript
```

---

## Estrutura de Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato
<tipo>(<escopo>): <descrição>

# Exemplos
feat(dashboard): adiciona visualização anual
fix(planning): corrige seleção de datas
docs(readme): atualiza instruções de instalação
style(ui): ajusta espaçamentos no dark mode
refactor(users): simplifica lógica de filtros
```

**Tipos**:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas gerais

---

## Recursos Adicionais

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)
- [Google Gemini AI Docs](https://ai.google.dev/docs)

---

## Próximos Passos

Após dominar este guia, consulte:

- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura detalhada
- [COMPONENTS.md](COMPONENTS.md) - Documentação de componentes
- [API.md](API.md) - Referência de tipos e serviços

---

**Dúvidas?** Abra uma issue ou consulte a documentação completa em `/docs`.


