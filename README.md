
<div align="center">

# 🏖️ holidayGo

**Sistema de Gestão de Férias da Olos**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

[![MVP](https://img.shields.io/badge/Versão-MVP_1.0.0-orange?style=flat-square)](docs/PRD.md)
[![Powered by](https://img.shields.io/badge/Powered_by-Olos-blue?style=flat-square)](https://olos.com.br)

[PRD](docs/PRD.md) • [Guia do Usuário](docs/USER_GUIDE.md) • [Arquitetura](docs/ARCHITECTURE.md)

</div>

---

## 📋 Sobre o Projeto

O **holidayGo** é uma aplicação web para gestão e planejamento de férias de colaboradores da Olos, permitindo visualização consolidada da equipe, agendamento individual de dias de férias e análise de disponibilidade assistida por IA.

### 🎯 Problema que Resolvemos

- Dificuldade em visualizar a disponibilidade da equipe
- Conflitos de agenda quando múltiplos colaboradores agendam férias no mesmo período
- Risco de perda de dias de férias por vencimento (saldo acumulado acima do permitido)
- Falta de visibilidade para gestores sobre picos de ausência

### 💡 Nossa Solução

| Para o Colaborador | Para a Gestão |
|--------------------|---------------|
| Autonomia no planejamento de férias | Visão consolidada da equipe |
| Controle do saldo de dias disponíveis | Identificação de picos de ausência |
| Interface simples e intuitiva | Alertas de saldos críticos |
| Acesso a qualquer momento | Análise inteligente via IA |

---

## ✨ Funcionalidades do MVP

### Autenticação
- ✅ Login com email e senha
- ✅ Cadastro de novos usuários
- ✅ Recuperação de senha por email
- ✅ Sessão persistida com renovação automática

### Dashboard
- ✅ Visualização mensal e anual da escala de férias
- ✅ Cards com estatísticas (em férias, pico de ausência, total da equipe)
- ✅ Análise de disponibilidade assistida por IA (Google Gemini)
- ✅ Navegação entre meses e anos

### Planejamento
- ✅ Calendário mensal interativo
- ✅ Marcar/desmarcar dias de férias com clique
- ✅ Salvamento automático
- ✅ Destaque de finais de semana

### Resumo e Alertas
- ✅ Média de saldo de férias da equipe
- ✅ Alertas de vencimento (saldo ≥45 dias)
- ✅ Classificação de status (Bom, Normal, Atenção, Crítico)
- ✅ Lista de colaboradores com férias próximas

### Gestão de Colaboradores
- ✅ CRUD completo de colaboradores
- ✅ Visualização de saldo e status
- ✅ Barra de progresso do saldo

### Interface
- ✅ Tema claro e escuro
- ✅ Design responsivo (mobile/desktop)
- ✅ Feedback de loading e erros

> 📄 Veja a especificação completa no [PRD](docs/PRD.md)

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 18 + TypeScript |
| Estilização | Tailwind CSS |
| Roteamento | React Router DOM (HashRouter) |
| Estado | React Context API + Hooks customizados |
| Backend/BaaS | Supabase (PostgreSQL + Auth + Realtime) |
| IA | Google Gemini API |
| Build | Vite |

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Projeto Supabase** configurado
- **Chave de API do Google Gemini** ([Obter aqui](https://ai.google.dev/))

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/OlosLive/holidayGo.git
cd holidayGo
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=<url_do_projeto_supabase>
VITE_SUPABASE_ANON_KEY=<chave_anonima_supabase>
API_KEY=<chave_api_google_gemini>
```

4. **Execute a aplicação**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm run preview
```

---

## 📁 Estrutura do Projeto

```
holidayGo/
├── pages/              # Páginas da aplicação
│   ├── Auth.tsx        # Autenticação e registro
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── Planning.tsx    # Planejamento de férias
│   ├── Summary.tsx     # Resumo de saldos
│   ├── Users.tsx       # Lista de colaboradores
│   └── UserForm.tsx    # Formulário de colaborador
├── components/         # Componentes reutilizáveis
├── contexts/           # Context providers (AuthContext)
├── hooks/              # Custom hooks (useProfiles, useVacations)
├── lib/                # Clientes e repositórios
├── types/              # Definições de tipos TypeScript
├── supabase/           # Migrations e seeds do banco
├── docs/               # Documentação
│   ├── PRD.md          # Product Requirements Document
│   ├── USER_GUIDE.md   # Guia do usuário
│   └── ARCHITECTURE.md # Arquitetura do sistema
├── App.tsx             # Componente raiz
├── geminiService.ts    # Integração com Gemini AI
└── vite.config.ts      # Configuração do Vite
```

---

## 📊 Regras de Negócio

| Regra | Descrição |
|-------|-----------|
| Saldo inicial | Cada colaborador inicia com 30 dias de férias |
| Saldo crítico | Saldo ≥45 dias é considerado crítico (risco de perda) |
| Saldo atenção | Saldo ≥30 dias requer atenção |
| Unicidade | Um colaborador não pode ter duas férias no mesmo dia |
| Atualização automática | O saldo é decrementado automaticamente ao planejar férias |

> 📄 Veja todas as regras no [PRD - Seção 11](docs/PRD.md#11-regras-de-negócio)

---

## 🤖 Integração com IA

O sistema utiliza o **Google Gemini AI** para gerar análises de disponibilidade da equipe:

- Identifica picos de ausência no mês
- Sugere redistribuição de férias
- Alerta sobre conflitos de agenda
- Gera resumo executivo em português (máx. 150 palavras)

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [PRD](docs/PRD.md) | Requisitos funcionais, não funcionais e regras de negócio |
| [Guia do Usuário](docs/USER_GUIDE.md) | Manual de uso da aplicação |
| [Arquitetura](docs/ARCHITECTURE.md) | Diagramas e padrões de design |

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Gemini
API_KEY=AIzaSy...
```

### Portas e Host

Por padrão, a aplicação roda em:
- **Porta**: 3000
- **Host**: 0.0.0.0 (acessível externamente)

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Erro ao conectar com Gemini AI | Verifique a chave API no `.env.local` |
| Erro de autenticação | Verifique as credenciais do Supabase |
| Porta 3000 já em uso | Altere a porta no `vite.config.ts` |
| Módulos não encontrados | Execute `npm install` novamente |

---

## 📝 Licença

Este projeto é propriedade da Olos e distribuído para uso interno.

---

<div align="center">

**MVP v1.0.0** • Powered by Olos

[⬆ Voltar ao topo](#-holidaygo)

</div>
