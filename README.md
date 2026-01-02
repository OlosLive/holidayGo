
<div align="center">

# 🏖️ holidayGo - Sistema de Gestão de Férias

**Sistema inteligente para gerenciamento de férias de colaboradores**

[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

[Arquitetura](docs/ARCHITECTURE.md) • [Desenvolvimento](docs/DEVELOPMENT.md) • [Componentes](docs/COMPONENTS.md) • [API](docs/API.md) • [Guia do Usuário](docs/USER_GUIDE.md)

</div>

---

## 📋 Sobre o Projeto

O **holidayGo** é uma aplicação web moderna e intuitiva desenvolvida para facilitar a gestão de férias de colaboradores em empresas de todos os tamanhos. Com uma interface elegante e recursos inteligentes alimentados por IA, o sistema permite visualização de calendários, planejamento estratégico de ausências e análises detalhadas de disponibilidade da equipe.

### ✨ Principais Funcionalidades

- 🔐 **Autenticação Completa** - Login, registro e proteção de rotas com Supabase Auth
- 📅 **Dashboard Interativo** - Visualização mensal e anual de férias agendadas
- 🗓️ **Planejamento Visual** - Calendário interativo para agendar férias de forma intuitiva
- 👥 **Gestão de Colaboradores** - CRUD completo de usuários com persistência em banco de dados
- 📊 **Análise de Resumo** - Acompanhamento de dias disponíveis e alertas de vencimento
- 🤖 **Inteligência Artificial** - Resumos e recomendações gerados pelo Google Gemini AI
- 🔄 **Real-time Updates** - Atualizações em tempo real via Supabase Realtime
- 🌙 **Dark Mode** - Suporte completo a tema claro e escuro
- 📱 **Design Responsivo** - Otimizado para desktop, tablet e mobile
- 🎨 **Interface Moderna** - Design system consistente com Tailwind CSS

## 🚀 Começando

### Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Conta no Supabase** ([Criar conta](https://supabase.com/))
- **Chave de API do Google Gemini** ([Obter aqui](https://ai.google.dev/))

### Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd holidayGo
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o Supabase**

   a. Crie um novo projeto no [Supabase Dashboard](https://supabase.com/dashboard)
   
   b. Execute o script SQL para criar as tabelas:
   - Acesse **SQL Editor** no Supabase Dashboard
   - Execute o conteúdo de `supabase/migrations/001_initial_schema.sql`

   c. Configure a autenticação:
   - Acesse **Authentication > Settings**
   - Habilite o provedor Email/Password
   - (Opcional) Desabilite a confirmação de email para testes

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# Google Gemini AI (opcional)
GEMINI_API_KEY=sua_chave_api_gemini

# Modo Mock (opcional - para desenvolvimento sem Supabase)
VITE_USE_MOCK_DATA=false
```

> ⚠️ **Importante**: As variáveis do Supabase devem começar com `VITE_` para serem expostas ao frontend.

### Modo de Dados Mockados

O sistema possui um **modo mock** que permite desenvolvimento e testes sem necessidade de conexão com o Supabase. Este modo utiliza `localStorage` para persistir dados localmente.

**Para ativar o modo mock**, adicione ao `.env.local`:

```env
VITE_USE_MOCK_DATA=true
```

**Características do modo mock:**
- 🔐 **Autenticação real** - O login/registro continua usando Supabase Auth
- 👥 **Dados de perfis mockados** - 10 colaboradores pré-configurados
- 📅 **Férias mockadas** - Dados de exemplo para visualização
- 💾 **Persistência local** - Dados salvos no `localStorage` do navegador
- 🔄 **Reset fácil** - Limpe o `localStorage` para reiniciar os dados

> 💡 **Dica**: Use o modo mock para demonstrações, prototipagem ou quando não tiver acesso ao Supabase.

5. **Execute a aplicação**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura do Projeto

```
holidayGo/
├── components/
│   └── ProtectedRoute.tsx     # Proteção de rotas autenticadas
├── contexts/
│   └── AuthContext.tsx        # Contexto de autenticação
├── hooks/
│   ├── useAuth.ts            # Hook de autenticação (signIn, signUp, signOut)
│   ├── useProfiles.ts        # CRUD de colaboradores
│   └── useVacations.ts       # Gestão de férias
├── lib/
│   ├── supabaseClient.ts     # Cliente Supabase configurado
│   ├── config.ts             # Configurações da aplicação (mock mode)
│   └── repositories/         # Camada de abstração de dados
│       ├── interfaces.ts     # Interfaces dos repositórios
│       ├── index.ts          # Factory para repositórios
│       ├── mock/             # Implementação com dados mockados
│       │   ├── mockData.ts   # Dados de exemplo
│       │   ├── MockProfileRepository.ts
│       │   └── MockVacationRepository.ts
│       └── supabase/         # Implementação com Supabase
│           ├── SupabaseProfileRepository.ts
│           └── SupabaseVacationRepository.ts
├── pages/
│   ├── Auth.tsx              # Página de login/registro
│   ├── Dashboard.tsx         # Dashboard principal
│   ├── Planning.tsx          # Planejamento de férias
│   ├── Summary.tsx           # Resumo de saldos
│   ├── Users.tsx             # Lista de colaboradores
│   └── UserForm.tsx          # Formulário de colaborador
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Schema do banco de dados
│   └── seed.sql              # Dados de exemplo (opcional)
├── types/
│   └── database.ts           # Tipos TypeScript do banco
├── App.tsx                   # Componente raiz com AuthProvider
├── types.ts                  # Definições TypeScript gerais
├── constants.ts              # Constantes da aplicação
├── geminiService.ts          # Integração com Gemini AI
├── index.tsx                 # Ponto de entrada
├── vite.config.ts            # Configuração do Vite
├── vite-env.d.ts             # Tipos de variáveis de ambiente
├── tsconfig.json             # Configuração TypeScript
└── package.json              # Dependências
```

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 19.2.3 | Biblioteca para interfaces de usuário |
| TypeScript | 5.8.2 | Superset JavaScript com tipagem estática |
| Vite | 6.2.0 | Build tool e dev server ultrarrápido |
| React Router | 7.11.0 | Roteamento para aplicações React |
| **Supabase** | 2.x | Backend-as-a-Service (Auth, Database, Realtime) |
| Google Gemini AI | 1.34.0 | Inteligência artificial para análises |
| Tailwind CSS | - | Framework CSS utility-first (via CDN) |
| Material Icons | - | Ícones do Material Design |

## 🗄️ Banco de Dados (Supabase)

### Schema

O banco de dados possui duas tabelas principais:

#### Tabela `profiles` (Colaboradores)
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID do usuário (referência auth.users) |
| email | TEXT | Email do colaborador |
| name | TEXT | Nome completo |
| role | TEXT | Cargo |
| department | TEXT | Departamento |
| hire_date | DATE | Data de contratação |
| status | TEXT | Status (Ativo, Inativo, Férias, Pendente) |
| vacation_balance | INT | Dias de férias disponíveis |
| vacation_used | INT | Dias de férias utilizados |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

#### Tabela `vacations` (Férias)
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único |
| user_id | UUID | Referência ao colaborador |
| vacation_date | DATE | Data da féria |
| year | INT | Ano |
| month | INT | Mês (1-12) |
| day | INT | Dia |
| status | TEXT | Status (planned, approved, taken, cancelled) |
| notes | TEXT | Observações |
| created_at | TIMESTAMP | Data de criação |

### Row Level Security (RLS)

O banco implementa políticas de segurança a nível de linha:
- Usuários autenticados podem visualizar todos os perfis e férias
- Usuários só podem modificar seus próprios dados
- Triggers automáticos para criar perfil no registro e atualizar contagens

## 🔐 Autenticação

### Fluxo de Autenticação

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Login/     │────▶│   Supabase   │────▶│   Session    │
│   Register   │     │     Auth     │     │   Created    │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Protected  │◀────│   AuthContext│◀────│   Profile    │
│   Routes     │     │   Provider   │     │   Fetched    │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Usando o Hook useAuth

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth();

  const handleLogin = async () => {
    const { error } = await signIn('email@example.com', 'password');
    if (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div>
      {user ? (
        <button onClick={signOut}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## 📊 Hooks Personalizados

### useProfiles
```typescript
const { 
  profiles,           // Lista de colaboradores
  loading,            // Estado de carregamento
  error,              // Mensagem de erro
  fetchProfiles,      // Recarregar lista
  getProfile,         // Buscar por ID
  createProfile,      // Criar novo
  updateProfile,      // Atualizar existente
  deleteProfile       // Remover
} = useProfiles();
```

### useVacations
```typescript
const {
  vacations,          // Lista de férias
  loading,            // Estado de carregamento
  error,              // Mensagem de erro
  getVacationDays,    // Dias de férias de um usuário/mês
  toggleVacationDay,  // Adicionar/remover dia
  addVacationDays,    // Adicionar múltiplos dias
  removeVacationDays  // Remover múltiplos dias
} = useVacations();
```

## 🔑 Funcionalidades Detalhadas

### Dashboard
- Alternância entre visualização mensal e anual
- Seleção de mês e ano
- Indicadores visuais de férias confirmadas
- Destaque de finais de semana
- Estatísticas de média mensal e picos de ausência
- Botão para gerar resumo com IA
- Exportação de relatórios (PDF/Excel)

### Planejamento
- Calendário interativo do mês
- Seleção múltipla de dias
- Preview de saldo restante
- Sidebar com lista de colaboradores
- **Salvamento automático no Supabase**
- Indicação visual de finais de semana
- Contador de dias programados

### Resumo
- Lista detalhada de todos os colaboradores
- Indicadores de status (Normal, Atenção, Crítico, Bom)
- Alertas de vencimento de férias
- Visualização de média da equipe
- Cards de usuários sem férias agendadas
- Cards de férias próximas

### Colaboradores
- Listagem com avatar, nome, email e cargo
- Badges de status coloridos
- Barra de progresso de saldo de férias
- **Persistência em banco de dados**
- Ações de editar e excluir
- Formulário completo para adicionar/editar
- Validações de campos obrigatórios

### Autenticação
- **Login com Supabase Auth**
- **Registro de novos usuários**
- Design split-screen moderno
- Animações suaves
- Validação de formulários
- **Proteção automática de rotas**

## 🤖 Integração com IA

O sistema utiliza o **Google Gemini AI** para gerar resumos executivos inteligentes sobre a disponibilidade da equipe. A IA analisa:

- Status de férias de todos os colaboradores
- Quantidade de ausências programadas
- Riscos de sobrecarga operacional
- Recomendações para gestores de RH

## 🔧 Configuração Avançada

### Variáveis de Ambiente

```env
# Supabase (obrigatório para autenticação)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...sua_chave_anon

# Google Gemini AI (opcional, para resumos IA)
GEMINI_API_KEY=AIza...sua_chave_api

# Modo Mock (opcional - desabilita Supabase para dados)
VITE_USE_MOCK_DATA=true  # true = mock, false = Supabase
```

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | ✅ | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Chave anônima do Supabase |
| `GEMINI_API_KEY` | ❌ | Chave API do Google Gemini |
| `VITE_USE_MOCK_DATA` | ❌ | `true` para modo mock, `false` para Supabase |

### Portas e Host

Por padrão, a aplicação roda em:
- **Porta**: 3000
- **Host**: 0.0.0.0 (acessível externamente)

Para modificar, edite `vite.config.ts`:

```typescript
server: {
  port: 3000,
  host: '0.0.0.0',
}
```

## 🐛 Troubleshooting

### Problema: Tela de carregamento infinita

**Solução**: Verifique se as variáveis de ambiente do Supabase estão configuradas corretamente no `.env.local` e reinicie o servidor Vite.

### Problema: Erro de autenticação

**Solução**: 
1. Verifique se o Email Auth está habilitado no Supabase Dashboard
2. Confirme que a URL e chave anon estão corretas
3. Verifique o console do navegador para erros detalhados

### Problema: Dados não aparecem

**Solução**: 
1. Verifique se executou o script SQL no Supabase
2. Confirme que as políticas RLS estão configuradas
3. Verifique se está autenticado na aplicação

### Problema: Erro ao conectar com Gemini AI

**Solução**: Verifique se a chave API está corretamente configurada no arquivo `.env.local`

### Problema: Porta 3000 já em uso

**Solução**: Altere a porta no `vite.config.ts` ou finalize o processo que está usando a porta

### Problema: Módulos não encontrados

**Solução**: Execute `npm install` novamente

## 📚 Documentação

Documentação completa disponível na pasta `docs/`:

| Documento | Descrição |
|-----------|-----------|
| [📐 ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitetura do sistema, diagramas e fluxos de dados |
| [💻 DEVELOPMENT.md](docs/DEVELOPMENT.md) | Guia de desenvolvimento e configuração do ambiente |
| [🧩 COMPONENTS.md](docs/COMPONENTS.md) | Documentação detalhada de todos os componentes |
| [📖 API.md](docs/API.md) | Referência de tipos TypeScript e serviços |
| [📘 USER_GUIDE.md](docs/USER_GUIDE.md) | Manual de uso da aplicação para usuários finais |

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi criado no Google AI Studio e é distribuído para fins educacionais e demonstrativos.

## 🔗 Links Úteis

- [Supabase Documentation](https://supabase.com/docs)
- [Documentação do React 19](https://react.dev/)
- [Google Gemini AI](https://ai.google.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)

## 👨‍💻 Autor

Desenvolvido como prova de conceito para demonstrar integração de React com Supabase e Google Gemini AI.

---

<div align="center">

**[⬆ Voltar ao topo](#-holidaygo---sistema-de-gestão-de-férias)**

Feito com ❤️ usando React, Supabase e Google Gemini AI

</div>
