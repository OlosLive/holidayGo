
<div align="center">

# 🏖️ holidayGo - Sistema de Gestão de Férias

**Sistema inteligente para gerenciamento de férias de colaboradores**

[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

[Documentação Completa](docs/) • [Guia do Usuário](docs/USER_GUIDE.md) • [Arquitetura](docs/ARCHITECTURE.md)

</div>

---

## 📋 Sobre o Projeto

O **holidayGo** é uma aplicação web moderna e intuitiva desenvolvida para facilitar a gestão de férias de colaboradores em empresas de todos os tamanhos. Com uma interface elegante e recursos inteligentes alimentados por IA, o sistema permite visualização de calendários, planejamento estratégico de ausências e análises detalhadas de disponibilidade da equipe.

### ✨ Principais Funcionalidades

- 📅 **Dashboard Interativo** - Visualização mensal e anual de férias agendadas
- 🗓️ **Planejamento Visual** - Calendário interativo para agendar férias de forma intuitiva
- 👥 **Gestão de Colaboradores** - CRUD completo de usuários com informações detalhadas
- 📊 **Análise de Resumo** - Acompanhamento de dias disponíveis e alertas de vencimento
- 🤖 **Inteligência Artificial** - Resumos e recomendações gerados pelo Google Gemini AI
- 🌙 **Dark Mode** - Suporte completo a tema claro e escuro
- 📱 **Design Responsivo** - Otimizado para desktop, tablet e mobile
- 🎨 **Interface Moderna** - Design system consistente com Tailwind CSS

## 🚀 Começando

### Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
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

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
GEMINI_API_KEY=sua_chave_api_aqui
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

## 📁 Estrutura do Projeto

```
holidayGo/
├── pages/                  # Páginas da aplicação
│   ├── Auth.tsx           # Autenticação e registro
│   ├── Dashboard.tsx      # Dashboard principal
│   ├── Planning.tsx       # Planejamento de férias
│   ├── Summary.tsx        # Resumo de saldos
│   ├── Users.tsx          # Lista de usuários
│   └── UserForm.tsx       # Formulário de usuário
├── App.tsx                # Componente raiz
├── types.ts               # Definições TypeScript
├── constants.ts           # Dados iniciais
├── geminiService.ts       # Integração com Gemini AI
├── index.tsx              # Ponto de entrada
├── vite.config.ts         # Configuração do Vite
├── tsconfig.json          # Configuração TypeScript
├── package.json           # Dependências
└── docs/                  # Documentação
    ├── ARCHITECTURE.md    # Arquitetura do sistema
    ├── DEVELOPMENT.md     # Guia de desenvolvimento
    ├── COMPONENTS.md      # Documentação de componentes
    ├── API.md             # API e tipos
    └── USER_GUIDE.md      # Guia do usuário
```

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 19.2.3 | Biblioteca para interfaces de usuário |
| TypeScript | 5.8.2 | Superset JavaScript com tipagem estática |
| Vite | 6.2.0 | Build tool e dev server ultrarrápido |
| React Router | 7.11.0 | Roteamento para aplicações React |
| Google Gemini AI | 1.34.0 | Inteligência artificial para análises |
| Tailwind CSS | - | Framework CSS utility-first (via CDN) |
| Material Icons | - | Ícones do Material Design |

## 📸 Screenshots

### Dashboard - Visualização Mensal
Interface principal com calendário mensal mostrando férias agendadas por colaborador.

### Dashboard - Visualização Anual
Visão consolidada do ano completo com totais por mês e colaborador.

### Planejamento de Férias
Calendário interativo para seleção de dias de férias com preview em tempo real.

### Gestão de Colaboradores
Lista completa de usuários com status, saldos e ações rápidas.

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
- Ações de editar e excluir
- Formulário completo para adicionar/editar
- Validações de campos obrigatórios

### Autenticação
- Tela de login com email e senha
- Formulário de registro
- Design split-screen moderno
- Animações suaves
- Validação de formulários

## 🤖 Integração com IA

O sistema utiliza o **Google Gemini AI** para gerar resumos executivos inteligentes sobre a disponibilidade da equipe. A IA analisa:

- Status de férias de todos os colaboradores
- Quantidade de ausências programadas
- Riscos de sobrecarga operacional
- Recomendações para gestores de RH

Exemplo de prompt utilizado:
```typescript
const teamContext = users.map(u => 
  `- ${u.name} (${u.role}): Status ${u.status}, 
   Férias este mês: ${u.plannedVacations.join(',')}`
).join('\n');
```

## 📚 Documentação Adicional

- **[Arquitetura](docs/ARCHITECTURE.md)** - Diagramas, fluxos e padrões de design
- **[Desenvolvimento](docs/DEVELOPMENT.md)** - Guia completo para desenvolvedores
- **[Componentes](docs/COMPONENTS.md)** - Documentação detalhada de todos os componentes
- **[API e Tipos](docs/API.md)** - Interfaces TypeScript e serviços
- **[Guia do Usuário](docs/USER_GUIDE.md)** - Manual de uso da aplicação

## 🎨 Sistema de Design

O holidayGo utiliza uma paleta de cores consistente e moderna:

- **Primary**: Azul vibrante para ações principais
- **Surface Dark**: Fundo escuro para dark mode
- **Slate**: Escala de cinzas para textos e bordas
- **Semântico**: Verde (sucesso), Amarelo (atenção), Vermelho (crítico)

Tipografia:
- **Font Display**: Para títulos e destaques
- **Font Sans**: Para corpo de texto

## 🔧 Configuração Avançada

### Variáveis de Ambiente

```env
# API do Google Gemini
GEMINI_API_KEY=your_api_key_here
```

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

### Problema: Erro ao conectar com Gemini AI

**Solução**: Verifique se a chave API está corretamente configurada no arquivo `.env.local`

### Problema: Porta 3000 já em uso

**Solução**: Altere a porta no `vite.config.ts` ou finalize o processo que está usando a porta

### Problema: Módulos não encontrados

**Solução**: Execute `npm install` novamente

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

- [Aplicação no AI Studio](https://ai.studio/apps/drive/1-_lWbrZNvJuJkGRdIzXDOITrJBDdBX1I)
- [Documentação do React 19](https://react.dev/)
- [Google Gemini AI](https://ai.google.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)

## 👨‍💻 Autor

Desenvolvido como prova de conceito para demonstrar integração de React com Google Gemini AI.

---

<div align="center">

**[⬆ Voltar ao topo](#-holidaygo---sistema-de-gestão-de-férias)**

Feito com ❤️ usando React e Google Gemini AI

</div>
