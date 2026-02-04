# PRD - holidayGo

## 1. Visão Geral do Sistema

**Nome do Sistema:** holidayGo  
**Tipo:** Sistema de Gestão de Férias de Colaboradores  
**Versão:** MVP (Minimum Viable Product)  
**Organização:** Olos  

O holidayGo é uma aplicação web para gestão e planejamento de férias de colaboradores, permitindo visualização consolidada da equipe, agendamento individual de dias de férias e análise de disponibilidade assistida por IA.

---

## 2. Objetivo do Produto

### Problema

Gerenciar férias de colaboradores de forma manual ou descentralizada gera:
- Dificuldade em visualizar a disponibilidade da equipe
- Conflitos de agenda quando múltiplos colaboradores agendam férias no mesmo período
- Risco de perda de dias de férias por vencimento (saldo acumulado acima do permitido)
- Falta de visibilidade para gestores sobre picos de ausência

### Solução

O holidayGo centraliza o planejamento de férias da equipe Olos em uma única plataforma, oferecendo:
- **Visualização consolidada** da escala de férias de toda a equipe (mensal e anual)
- **Planejamento individual** com calendário interativo para marcar/desmarcar dias
- **Alertas automáticos** para colaboradores com saldo crítico de férias
- **Análise assistida por IA** que identifica picos de ausência e sugere redistribuição

### Público-alvo

- **Colaboradores da Olos** - para planejar suas próprias férias
- **Gestores/RH** - para visualizar a escala da equipe e identificar conflitos

### Valor Entregue

| Para o Colaborador | Para a Gestão |
|--------------------|---------------|
| Autonomia no planejamento de férias | Visão consolidada da equipe |
| Controle do saldo de dias disponíveis | Identificação de picos de ausência |
| Interface simples e intuitiva | Alertas de saldos críticos |
| Acesso a qualquer momento | Análise inteligente via IA |

---

## 3. Escopo do MVP

### Funcionalidades Implementadas

#### Autenticação e Acesso
- [x] Login com email e senha
- [x] Cadastro de novos usuários
- [x] Recuperação de senha por email
- [x] Sessão persistida com renovação automática
- [x] Logout

#### Dashboard
- [x] Visualização mensal da escala de férias da equipe
- [x] Visualização anual consolidada
- [x] Navegação entre meses e anos
- [x] Card com colaboradores em férias no mês
- [x] Card com mês de pico de ausência
- [x] Card com total de colaboradores
- [x] Análise de disponibilidade assistida por IA (Gemini)

#### Planejamento de Férias
- [x] Calendário mensal interativo
- [x] Seleção de colaborador para planejamento
- [x] Marcar/desmarcar dias de férias com clique
- [x] Salvamento automático
- [x] Feedback visual durante salvamento
- [x] Destaque de finais de semana

#### Resumo e Alertas
- [x] Média de saldo de férias da equipe
- [x] Alertas de vencimento (saldo ≥45 dias)
- [x] Total de dias acumulados pela equipe
- [x] Lista de colaboradores sem férias marcadas
- [x] Lista de colaboradores com férias próximas
- [x] Classificação de status (Bom, Normal, Atenção, Crítico)

#### Gestão de Colaboradores
- [x] Listagem de colaboradores
- [x] Cadastro de novo colaborador
- [x] Edição de colaborador
- [x] Exclusão de colaborador
- [x] Visualização de saldo e status

#### Interface
- [x] Tema claro e escuro
- [x] Design responsivo (mobile/desktop)
- [x] Feedback de loading e erros

### Critérios de Aceitação do MVP

| Critério | Status |
|----------|--------|
| Usuário consegue fazer login e logout | ✅ |
| Usuário consegue visualizar escala da equipe | ✅ |
| Usuário consegue planejar férias em calendário | ✅ |
| Sistema atualiza saldo automaticamente | ✅ |
| Sistema alerta saldos críticos | ✅ |
| IA gera análise de disponibilidade | ✅ |
| Sistema funciona em mobile e desktop | ✅ |

---

## 4. Métricas de Sucesso

> ⚠️ **Seção a ser preenchida pelo Product Owner**

_Defina as métricas (KPIs) que serão utilizadas para medir o sucesso do produto._

| Métrica | Descrição | Meta | Forma de Medição |
|---------|-----------|------|------------------|
| [PREENCHER] | | | |
| [PREENCHER] | | | |
| [PREENCHER] | | | |

```
Exemplos de métricas:
- Taxa de adoção (% de colaboradores usando o sistema)
- Tempo médio para planejar férias
- Redução de conflitos de agenda
- NPS dos usuários
- Taxa de férias vencidas antes vs depois
```

---

## 5. Fora de Escopo

> ⚠️ **Seção a ser preenchida pelo Product Owner**

_Liste explicitamente o que NÃO faz parte do escopo deste produto/versão._

```
[PREENCHER]

Itens fora de escopo:
- 
- 
- 

Justificativa:
- 
```

---

## 6. Roadmap

> ⚠️ **Seção a ser preenchida pelo Product Owner**

_Defina o roadmap de evolução do produto com fases e entregas planejadas._

### Fase 1 - MVP (Atual)
| Entrega | Status | Previsão |
|---------|--------|----------|
| [PREENCHER] | | |

### Fase 2 - Evolução
| Entrega | Status | Previsão |
|---------|--------|----------|
| [PREENCHER] | | |

### Fase 3 - Expansão
| Entrega | Status | Previsão |
|---------|--------|----------|
| [PREENCHER] | | |

```
Backlog de ideias futuras:
- 
- 
- 
```

---

# Especificação Técnica

> As seções abaixo descrevem a implementação técnica atual do sistema, identificada através de análise do código-fonte.

---

## 7. Arquitetura Técnica

### 7.1 Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 18 + TypeScript |
| Estilização | Tailwind CSS |
| Roteamento | React Router DOM (HashRouter) |
| Estado | React Context API + Hooks customizados |
| Backend/BaaS | Supabase (PostgreSQL + Auth + Realtime) |
| IA | Google Gemini API (gemini-3-flash-preview) |
| Build | Vite |

### 7.2 Estrutura de Diretórios

```
holidayGo/
├── pages/           # Páginas da aplicação
├── components/      # Componentes reutilizáveis
├── contexts/        # Context providers (AuthContext)
├── hooks/           # Custom hooks (useProfiles, useVacations, useAuth)
├── lib/             # Clientes e repositórios
├── types/           # Definições de tipos TypeScript
├── supabase/        # Migrations e seeds do banco
└── docs/            # Documentação
```

---

## 8. Modelo de Dados

### 8.1 Tabela: `profiles`

Armazena informações dos colaboradores.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| id | UUID | PK, FK → auth.users | Identificador único (vinculado ao auth) |
| name | TEXT | NOT NULL | Nome completo do colaborador |
| email | TEXT | UNIQUE, NOT NULL | Email corporativo |
| role | TEXT | NULLABLE | Cargo do colaborador |
| department | TEXT | NULLABLE | Departamento |
| hire_date | DATE | NULLABLE | Data de admissão |
| status | TEXT | CHECK IN ('Ativo', 'Inativo', 'Férias', 'Pendente') | Status atual |
| avatar_url | TEXT | NULLABLE | URL do avatar |
| vacation_balance | INTEGER | DEFAULT 30 | Saldo de dias de férias disponíveis |
| vacation_used | INTEGER | DEFAULT 0 | Dias de férias já utilizados/planejados |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Data da última atualização |

### 8.2 Tabela: `vacations`

Armazena os dias de férias planejados por colaborador.

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Identificador único |
| user_id | UUID | FK → profiles(id), NOT NULL | Colaborador |
| vacation_date | DATE | NOT NULL | Data da férias |
| year | INTEGER | NOT NULL | Ano |
| month | INTEGER | CHECK 1-12, NOT NULL | Mês |
| day | INTEGER | CHECK 1-31, NOT NULL | Dia |
| status | TEXT | CHECK IN ('planned', 'approved', 'rejected', 'completed') | Status da férias |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Data da última atualização |

**Constraint:** UNIQUE(user_id, vacation_date) - Um colaborador não pode ter duas entradas para o mesmo dia.

### 8.3 Índices

- `idx_profiles_email` - Busca rápida por email
- `idx_profiles_status` - Filtro por status
- `idx_vacations_user_id` - Busca por colaborador
- `idx_vacations_year_month` - Filtro por período
- `idx_vacations_date` - Busca por data específica

---

## 9. Requisitos Funcionais

### 9.1 Módulo de Autenticação (RF-AUTH)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RF-AUTH-01 | O sistema deve permitir login com email e senha | `Auth.tsx` - signInWithPassword |
| RF-AUTH-02 | O sistema deve permitir cadastro de novos usuários | `Auth.tsx` - signUp com nome |
| RF-AUTH-03 | O sistema deve permitir recuperação de senha por email | `Auth.tsx` - resetPasswordForEmail |
| RF-AUTH-04 | O sistema deve permitir redefinição de senha via link | `Auth.tsx` - updatePassword (modo reset) |
| RF-AUTH-05 | O sistema deve criar automaticamente um perfil ao cadastrar usuário | Trigger `handle_new_user()` no banco |
| RF-AUTH-06 | O sistema deve manter a sessão do usuário persistida | Supabase Auth com persistSession: true |
| RF-AUTH-07 | O sistema deve exibir iniciais do usuário na navbar | `App.tsx` - getInitials() |
| RF-AUTH-08 | O sistema deve permitir logout | `App.tsx` - handleLogout |

### 9.2 Módulo de Dashboard (RF-DASH)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RF-DASH-01 | O sistema deve exibir visão mensal das férias da equipe | `Dashboard.tsx` - viewMode 'mensal' |
| RF-DASH-02 | O sistema deve exibir visão anual consolidada das férias | `Dashboard.tsx` - viewMode 'anual' |
| RF-DASH-03 | O sistema deve permitir navegação entre meses e anos | Seletores de mês/ano |
| RF-DASH-04 | O sistema deve exibir grade com dias do mês e colaboradores | Tabela com daysHeader × users |
| RF-DASH-05 | O sistema deve destacar finais de semana na grade | Verificação isWeekend |
| RF-DASH-06 | O sistema deve exibir indicador visual de férias planejadas | Ícone beach_access nos dias |
| RF-DASH-07 | O sistema deve exibir card com quantidade de colaboradores em férias | Card "Em Férias" |
| RF-DASH-08 | O sistema deve exibir card com mês de pico de ausência | Card "Pico de Ausência" |
| RF-DASH-09 | O sistema deve exibir card com total de colaboradores | Card "Equipe" |
| RF-DASH-10 | O sistema deve gerar análise de disponibilidade via IA | `geminiService.ts` - generateTeamSummary |
| RF-DASH-11 | A análise de IA deve funcionar apenas para o mês selecionado | Modo 'mensal' fixo na chamada |
| RF-DASH-12 | O sistema deve formatar texto em negrito retornado pela IA | formatMarkdownText() |
| RF-DASH-13 | O sistema deve limpar análise ao mudar mês/ano | useEffect com setAiSummary(null) |

### 9.3 Módulo de Planejamento (RF-PLAN)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RF-PLAN-01 | O sistema deve exibir calendário mensal interativo | `Planning.tsx` - grid 7×6 |
| RF-PLAN-02 | O sistema deve permitir selecionar colaborador para planejamento | Sidebar com lista de profiles |
| RF-PLAN-03 | O sistema deve permitir marcar/desmarcar dias de férias com clique | toggleVacationDay() |
| RF-PLAN-04 | O sistema deve salvar alterações automaticamente | Salvamento imediato no banco |
| RF-PLAN-05 | O sistema deve exibir feedback visual durante salvamento | savingDay com spinner |
| RF-PLAN-06 | O sistema deve exibir resumo do colaborador selecionado | Footer com dias no mês e saldo total |
| RF-PLAN-07 | O sistema deve permitir navegação entre meses | goToPreviousMonth/goToNextMonth |
| RF-PLAN-08 | O sistema deve manter parâmetros na URL | useSearchParams (month, year, userId) |
| RF-PLAN-09 | O sistema deve destacar finais de semana no calendário | isWeekend com estilo diferenciado |

### 9.4 Módulo de Resumo (RF-SUM)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RF-SUM-01 | O sistema deve exibir média de saldo de férias da equipe | avgBalance |
| RF-SUM-02 | O sistema deve exibir alertas de vencimento (saldo ≥45 dias) | usersWithCriticalBalance |
| RF-SUM-03 | O sistema deve exibir total de dias acumulados pela equipe | totalBalance |
| RF-SUM-04 | O sistema deve listar colaboradores sem férias marcadas | usersWithoutVacation |
| RF-SUM-05 | O sistema deve listar colaboradores com férias próximas | usersWithUpcomingVacation |
| RF-SUM-06 | O sistema deve exibir detalhamento por colaborador | Tabela com vacation_used, vacation_balance |
| RF-SUM-07 | O sistema deve classificar status do saldo (Bom, Normal, Atenção, Crítico) | getStatus() baseado no saldo |
| RF-SUM-08 | O sistema deve permitir ação rápida de agendamento | Links para /planning?userId= |

### 9.5 Módulo de Colaboradores (RF-USER)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RF-USER-01 | O sistema deve listar todos os colaboradores cadastrados | `Users.tsx` - tabela com profiles |
| RF-USER-02 | O sistema deve exibir status, cargo e saldo de férias | Colunas na tabela |
| RF-USER-03 | O sistema deve permitir adicionar novo colaborador | Link para /users/add |
| RF-USER-04 | O sistema deve permitir editar colaborador existente | Link para /users/edit/:id |
| RF-USER-05 | O sistema deve permitir excluir colaborador | deleteProfile com confirmação |
| RF-USER-06 | O sistema deve exibir barra de progresso do saldo | Barra visual (vacation_balance/30) |

### 9.6 Módulo de Formulário de Colaborador (RF-FORM)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RF-FORM-01 | O sistema deve permitir informar nome, email, cargo, departamento | Campos do formulário |
| RF-FORM-02 | O sistema deve permitir informar data de admissão | Campo hire_date |
| RF-FORM-03 | O sistema deve permitir selecionar status | Select com opções |
| RF-FORM-04 | O sistema deve permitir definir saldo de férias | Campo vacation_balance |
| RF-FORM-05 | O sistema deve permitir definir dias utilizados | Campo vacation_used |
| RF-FORM-06 | O sistema deve validar campos obrigatórios | required nos inputs |
| RF-FORM-07 | O sistema deve gerar UUID para novos colaboradores | crypto.randomUUID() |

---

## 10. Requisitos Não Funcionais

### 10.1 Desempenho (RNF-PERF)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RNF-PERF-01 | A interface deve responder em menos de 100ms para interações | React com estado local otimizado |
| RNF-PERF-02 | As consultas ao banco devem usar índices apropriados | Índices em email, status, user_id, year/month |
| RNF-PERF-03 | O sistema deve usar cache local para dados de férias | useState com atualização incremental |
| RNF-PERF-04 | O sistema deve usar memoização para cálculos pesados | useMemo para users, getMonthWeekDays, etc. |

### 10.2 Segurança (RNF-SEC)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RNF-SEC-01 | Todas as rotas protegidas devem exigir autenticação | ProtectedRoute component |
| RNF-SEC-02 | O banco deve usar Row Level Security (RLS) | Policies no PostgreSQL |
| RNF-SEC-03 | Usuários só podem modificar seus próprios dados | RLS: auth.uid() = id |
| RNF-SEC-04 | A sessão deve ser renovada automaticamente | autoRefreshToken: true |
| RNF-SEC-05 | Senhas devem ter mínimo de 6 caracteres | Validação no reset de senha |
| RNF-SEC-06 | Tokens de recuperação devem ser armazenados temporariamente | sessionStorage para recovery tokens |

### 10.3 Usabilidade (RNF-UX)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RNF-UX-01 | O sistema deve suportar tema claro e escuro | isDarkMode toggle |
| RNF-UX-02 | O sistema deve ser responsivo (mobile/desktop) | Classes Tailwind responsivas |
| RNF-UX-03 | O sistema deve exibir estados de loading | Spinners durante carregamento |
| RNF-UX-04 | O sistema deve exibir mensagens de erro claras | Componentes de erro com ícones |
| RNF-UX-05 | O sistema deve exibir feedback de sucesso | Mensagens de sucesso animadas |
| RNF-UX-06 | O sistema deve usar animações suaves | Tailwind animate-in, transition-all |

### 10.4 Manutenibilidade (RNF-MAINT)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RNF-MAINT-01 | O código deve usar TypeScript com tipagem estrita | Tipos em types/database.ts |
| RNF-MAINT-02 | A lógica de dados deve estar em hooks reutilizáveis | useProfiles, useVacations, useAuth |
| RNF-MAINT-03 | O banco deve usar migrations versionadas | supabase/migrations/ |
| RNF-MAINT-04 | Os repositórios devem abstrair acesso ao banco | lib/repositories/ |

### 10.5 Disponibilidade (RNF-AVAIL)

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RNF-AVAIL-01 | O sistema deve funcionar com Supabase como backend | Supabase Cloud |
| RNF-AVAIL-02 | O sistema deve suportar atualizações em tempo real | Supabase Realtime (subscribe) |
| RNF-AVAIL-03 | O sistema deve tratar erros de conexão graciosamente | Try/catch com mensagens de erro |

---

## 11. Regras de Negócio

### 11.1 Gestão de Férias

| ID | Regra | Implementação |
|----|-------|---------------|
| RN-01 | Cada colaborador inicia com saldo de 30 dias de férias | DEFAULT 30 no vacation_balance |
| RN-02 | O saldo é decrementado automaticamente ao planejar férias | Trigger update_vacation_used |
| RN-03 | Um colaborador não pode ter duas férias no mesmo dia | UNIQUE(user_id, vacation_date) |
| RN-04 | Saldo ≥45 dias é considerado crítico (risco de perda) | getStatus() retorna 'Crítico' |
| RN-05 | Saldo ≥30 dias requer atenção | getStatus() retorna 'Atenção' |
| RN-06 | Saldo ≥15 dias é considerado normal | getStatus() retorna 'Normal' |
| RN-07 | Saldo <15 dias é considerado bom | getStatus() retorna 'Bom' |
| RN-08 | Dias excedentes (acima de 30) são considerados em risco | daysAtRisk = vacation_balance - 30 |

### 11.2 Status de Colaborador

| ID | Regra | Implementação |
|----|-------|---------------|
| RN-09 | Novos usuários iniciam com status 'Pendente' | Trigger handle_new_user() |
| RN-10 | Status válidos: Ativo, Inativo, Férias, Pendente | CHECK constraint |
| RN-11 | Colaboradores inativos não aparecem em alertas de férias | Filtro status !== 'Inativo' |

### 11.3 Análise de IA

| ID | Regra | Implementação |
|----|-------|---------------|
| RN-12 | A análise considera apenas o mês selecionado | viewMode fixo em 'mensal' |
| RN-13 | O resumo deve ter no máximo 150 palavras | Prompt da IA |
| RN-14 | A análise deve identificar riscos de sobrecarga | Prompt da IA |
| RN-15 | A análise é limpa ao mudar de período | useEffect com dependências [selectedMonth, selectedYear] |

---

## 12. Fluxos Principais

### 12.1 Fluxo de Autenticação

```
1. Usuário acessa /auth
2. Usuário preenche email e senha
3. Sistema valida credenciais via Supabase Auth
4. Se válido:
   a. Sessão é criada e persistida
   b. Perfil é carregado do banco
   c. Usuário é redirecionado para /dashboard
5. Se inválido:
   a. Mensagem de erro é exibida
```

### 12.2 Fluxo de Cadastro

```
1. Usuário acessa /auth e clica em "Cadastre-se"
2. Usuário preenche nome, email e senha
3. Sistema cria usuário via Supabase Auth
4. Trigger cria perfil automaticamente com:
   - Nome informado ou parte do email
   - Status 'Pendente'
   - Saldo inicial de 30 dias
5. Usuário é redirecionado para login
```

### 12.3 Fluxo de Planejamento de Férias

```
1. Usuário acessa /planning
2. Sistema carrega lista de colaboradores e férias
3. Usuário seleciona colaborador na sidebar
4. Calendário exibe mês atual com dias marcados
5. Usuário clica em um dia:
   a. Se não marcado: cria registro de férias
   b. Se marcado: remove registro de férias
6. Sistema salva automaticamente no banco
7. Trigger atualiza vacation_used do colaborador
8. Interface atualiza em tempo real
```

### 12.4 Fluxo de Análise de IA

```
1. Usuário está no Dashboard com mês selecionado
2. Usuário clica em "Pedir Resumo IA"
3. Sistema coleta dados dos colaboradores do mês
4. Sistema envia prompt para Gemini API
5. IA gera resumo executivo
6. Sistema formata markdown (negrito)
7. Resumo é exibido no card
8. Se usuário mudar mês/ano, resumo é limpo
```

---

## 13. Restrições Técnicas

### 13.1 Dependências Externas

| Dependência | Restrição |
|-------------|-----------|
| Supabase | Requer projeto configurado com URL e Anon Key |
| Google Gemini | Requer API_KEY válida para análise de IA |
| Internet | Sistema requer conexão para funcionar |

### 13.2 Limitações Conhecidas

| ID | Limitação | Descrição |
|----|-----------|-----------|
| LIM-01 | Sem suporte offline | Todas as operações requerem conexão |
| LIM-02 | Criação de usuário simplificada | UserForm cria perfil sem criar auth.user |
| LIM-03 | Sem controle de permissões granular | Todos usuários autenticados veem todos os dados |
| LIM-04 | Sem workflow de aprovação | Férias são marcadas diretamente como 'planned' |
| LIM-05 | Análise de IA sem cache | Cada solicitação gera nova chamada à API |

### 13.3 Variáveis de Ambiente Requeridas

```env
VITE_SUPABASE_URL=<url_do_projeto_supabase>
VITE_SUPABASE_ANON_KEY=<chave_anonima_supabase>
API_KEY=<chave_api_google_gemini>
```

---

## 14. Integrações

### 14.1 Supabase

- **Auth:** Autenticação de usuários
- **Database:** PostgreSQL para persistência
- **Realtime:** Atualizações em tempo real (subscribe)
- **RLS:** Segurança a nível de linha

### 14.2 Google Gemini

- **Modelo:** gemini-3-flash-preview
- **Uso:** Geração de resumo executivo de disponibilidade
- **Entrada:** Lista de colaboradores e status de férias
- **Saída:** Texto formatado em português (máx. 150 palavras)

---

## 15. Glossário

| Termo | Definição |
|-------|-----------|
| Colaborador | Funcionário cadastrado no sistema |
| Saldo de Férias | Quantidade de dias de férias disponíveis |
| Férias Utilizadas | Dias de férias já planejados/consumidos |
| Status Crítico | Saldo ≥45 dias, risco de perda |
| Pico de Ausência | Mês com maior quantidade de dias de férias planejados |
| RLS | Row Level Security - políticas de segurança no banco |

---

*Documento gerado em: Fevereiro de 2026*  
*Versão do Sistema: MVP 1.0*
