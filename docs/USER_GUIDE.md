# 👤 Guia do Usuário - holidayGo

Bem-vindo ao **holidayGo**! Este guia apresenta todas as funcionalidades da aplicação e como utilizá-las para gerenciar férias da sua equipe de forma eficiente.

## Índice

- [Introdução](#introdução)
- [Primeiros Passos](#primeiros-passos)
- [Autenticação](#autenticação)
- [Dashboard](#dashboard)
- [Planejamento de Férias](#planejamento-de-férias)
- [Visualização de Resumo](#visualização-de-resumo)
- [Gestão de Colaboradores](#gestão-de-colaboradores)
- [Recursos Avançados](#recursos-avançados)
- [Dicas e Melhores Práticas](#dicas-e-melhores-práticas)
- [Perguntas Frequentes](#perguntas-frequentes)

---

## Introdução

O holidayGo é um sistema intuitivo para gestão de férias que permite:

- 📅 Visualizar o calendário de férias de toda a equipe
- 🗓️ Planejar e agendar períodos de férias
- 📊 Acompanhar saldos e dias disponíveis
- 👥 Gerenciar informações de colaboradores
- 🤖 Obter análises inteligentes com IA

---

## Primeiros Passos

### Acessando o Sistema

1. Abra o navegador (Chrome, Firefox, Edge ou Safari)
2. Acesse o endereço da aplicação
3. Você será direcionado para a página de login

### Requisitos

- Navegador moderno atualizado
- Conexão com a internet
- Credenciais de acesso fornecidas pelo administrador

---

## Autenticação

### Fazendo Login

![Tela de Login]

1. **Acesse a página de login**
   - Você verá um formulário no lado esquerdo da tela
   - No lado direito, há uma imagem inspiradora

2. **Preencha suas credenciais**
   - **Email**: Digite seu email corporativo (ex: `seunome@empresa.com`)
   - **Senha**: Digite sua senha
   
3. **Clique em "Acessar Painel"**
   - O sistema validará suas credenciais
   - Você será redirecionado para o Dashboard

**Credenciais de demonstração:**
```
Email: admin@holidaygo.com
Senha: password
```

### Criando uma Conta

1. Na tela de login, clique em **"Cadastre-se grátis"**

2. Preencha os dados solicitados:
   - **Nome Completo**: Seu nome completo
   - **Email Corporativo**: Seu email da empresa
   - **Senha**: Escolha uma senha segura

3. Clique em **"Criar minha conta"**

4. Você será automaticamente logado

### Esqueci Minha Senha

1. Na tela de login, clique em **"Esqueceu a senha?"**
2. Siga as instruções para recuperação
3. Verifique seu email para o link de redefinição

---

## Dashboard

O Dashboard é a página principal do sistema. Aqui você tem uma visão completa das férias agendadas.

### Elementos da Interface

```
┌────────────────────────────────────────────────┐
│  holidayGo    Dashboard  Planejamento  Resumo │ ← Barra de Navegação
├────────────────────────────────────────────────┤
│  Visão Geral  [Mensal] [Anual]  Julho ▼ 2026 │ ← Controles
├────────────────────────────────────────────────┤
│                                                │
│        Calendário de Férias da Equipe         │ ← Área Principal
│                                                │
├────────────────────────────────────────────────┤
│  [Estatísticas]  [Análise de IA]              │ ← Cards Informativos
└────────────────────────────────────────────────┘
```

### Alternando entre Visualizações

#### Visualização Mensal

1. Clique no botão **"Mensal"** no topo da página

2. **O que você vê:**
   - Calendário completo do mês selecionado
   - Cada linha representa um colaborador
   - Colunas representam dias do mês (1-31)
   - Dias com férias aparecem em **azul**
   - Finais de semana em **vermelho claro**

3. **Como usar:**
   - Passe o mouse sobre dias marcados para ver o colaborador
   - Role horizontalmente para ver todos os dias
   - Use a coluna da esquerda (fixa) para identificar nomes

**Exemplo visual:**
```
┌────────────┬───┬───┬───┬───┬───┬───┬───┐
│ Colaborador│ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │
├────────────┼───┼───┼───┼───┼───┼───┼───┤
│ Allan      │   │   │   │   │ █ │ █ │ █ │ ← Férias dias 5-9
│ Aline      │   │   │   │   │   │   │   │
│ Alexandre  │   │   │   │   │   │   │   │
└────────────┴───┴───┴───┴───┴───┴───┴───┘
```

#### Visualização Anual

1. Clique no botão **"Anual"** no topo da página

2. **O que você vê:**
   - 12 colunas (uma para cada mês)
   - Número de dias de férias por mês
   - Total anual na última coluna
   - Badges coloridos para meses com muitos dias

3. **Interpretação:**
   - Números maiores = mais dias de férias naquele mês
   - `•` (ponto) = nenhuma féria programada
   - Badge azul escuro = mais de 10 dias

**Exemplo visual:**
```
┌──────────┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬─────┐
│ Nome     │Jan│Fev│Mar│Abr│Mai│Jun│Jul│Ago│Set│Out│Nov│Dez│Total│
├──────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼─────┤
│ Allan    │ 2 │ • │ 3 │ • │ • │ • │ 5 │ • │ 1 │ • │ • │ 2 │ 13d │
│ Aline    │ • │ • │ • │ 5 │ • │ • │ • │ • │ • │ 3 │ • │ • │  8d │
└──────────┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴─────┘
```

### Selecionando Período

**Selecionar Mês** (apenas em visualização mensal):
1. Clique no dropdown de meses
2. Escolha o mês desejado (Janeiro a Dezembro)
3. O calendário será atualizado automaticamente

**Selecionar Ano**:
1. Clique no dropdown de anos
2. Escolha o ano (2024-2030)
3. Funciona em ambas as visualizações

### Análise com Inteligência Artificial

O holidayGo utiliza IA do Google Gemini para gerar insights sobre sua equipe.

**Como usar:**

1. Role a página até a seção **"Análise de Disponibilidade"**

2. Clique no botão **"Pedir Resumo IA"**

3. Aguarde alguns segundos enquanto a IA processa

4. Leia o resumo gerado, que pode incluir:
   - Quem está de férias no período
   - Riscos de sobrecarga operacional
   - Recomendações para o RH
   - Alertas sobre saldos críticos

**Exemplo de resumo:**
```
"A equipe está em boa condição operacional. Allan está 
programado para 5 dias de férias no início do mês. 
Recomenda-se atenção aos colaboradores com saldo alto 
de férias para evitar vencimento. Não há risco significativo 
de sobrecarga no período analisado."
```

### Estatísticas do Dashboard

**Cards informativos:**

1. **Média Mensal**
   - Número médio de colaboradores em férias por mês
   - Útil para planejamento de capacidade

2. **Pico de Ausência**
   - Mês com maior número de ausências
   - Permite preparar cobertura antecipadamente

3. **Legenda**
   - Explica as cores usadas no calendário
   - Férias confirmadas (azul)
   - Finais de semana (vermelho claro)
   - Disponibilidade total (branco)

### Exportando Relatórios

⚠️ **Em desenvolvimento**

Os botões de exportação estão disponíveis para:
- 📄 PDF - Relatório formatado
- 📊 Excel - Planilha com dados

---

## Planejamento de Férias

Esta é a interface principal para agendar férias dos colaboradores.

### Acessando o Planejamento

1. Clique em **"Planejamento"** na barra de navegação
2. Você verá um calendário interativo

### Interface de Planejamento

```
┌──────────┬────────────────────────────────────┐
│          │  Seg  Ter  Qua  Qui  Sex  Sáb  Dom│
│  Sidebar │  ┌───┬───┬───┬───┬───┬───┬───┐   │
│          │  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │   │
│ □ Allan  │  ├───┼───┼───┼───┼───┼───┼───┤   │
│ ■ Aline  │  │ 8 │ 9 │10 │11 │12 │13 │14 │   │
│ □ Alex   │  └───┴───┴───┴───┴───┴───┴───┘   │
│          │                                    │
├──────────┴────────────────────────────────────┤
│ Aline | 5 dias programados | 65 saldo       │
└───────────────────────────────────────────────┘
```

### Agendando Férias

**Passo a passo:**

1. **Selecione o colaborador**
   - Na sidebar esquerda, clique no nome do colaborador
   - O nome ficará destacado

2. **Clique nos dias desejados**
   - Clique em cada dia que o colaborador estará de férias
   - Dias selecionados ficarão azuis
   - Um ícone de praia aparecerá

3. **Desmarque se necessário**
   - Clique novamente em um dia selecionado para remover

4. **Veja o resumo no rodapé**
   - Dias programados: Total selecionado
   - Saldo restante: Dias disponíveis

5. **Salve as alterações**
   - Clique em **"Salvar Alterações"** no rodapé

### Navegação no Calendário

**Mudando de mês:**
- Use os botões `<` e `>` ao lado do mês
- ⚠️ Funcionalidade em desenvolvimento

**Identificando finais de semana:**
- Aparecem com fundo vermelho claro
- Sábado e Domingo são marcados com "S" e "D"

### Dicas de Planejamento

✅ **Boas práticas:**

- Planeje com antecedência (mínimo 30 dias)
- Evite períodos críticos do negócio
- Consulte o Dashboard para evitar sobrecarga
- Confirme disponibilidade de substitutos

❌ **Evite:**

- Agendar toda a equipe simultaneamente
- Períodos muito longos sem pausas
- Mudanças de última hora

---

## Visualização de Resumo

A página de Resumo oferece uma visão detalhada dos dias de férias de cada colaborador.

### Acessando Resumo

1. Clique em **"Resumo"** na barra de navegação
2. Você verá estatísticas e tabela detalhada

### Estatísticas Principais

**Cards no topo:**

1. **Média da Equipe**
   ```
   25 dias
   ```
   - Saldo médio de férias da equipe
   - Calculado automaticamente

2. **Alertas de Vencimento**
   ```
   3 colaboradores
   ```
   - Número de pessoas com saldo ≥ 45 dias
   - Requer atenção urgente

3. **Total Acumulado**
   ```
   175 dias
   ```
   - Soma de todos os saldos
   - Útil para planejamento financeiro

### Seções de Alertas

#### Sem Férias Marcadas

Mostra colaboradores que **não têm férias agendadas**.

**Como usar:**
- Role horizontalmente para ver todos os cards
- Clique em "Agendar Agora" para ir ao Planejamento
- Priorize quem tem saldo alto

**Exemplo de card:**
```
┌─────────────────┐
│      [A]        │
│    Allan        │
│ Saldo: 65 dias  │
│ [Agendar Agora] │
└─────────────────┘
```

#### Férias se Aproximando

Mostra colaboradores com **férias já agendadas**.

**Informações exibidas:**
- Nome do colaborador
- Quantidade de dias em julho
- Badge "Confirmado"

### Tabela Detalhada

A tabela principal mostra todos os colaboradores com:

| Coluna | Descrição |
|--------|-----------|
| **Colaborador** | Nome, cargo e avatar |
| **Agendados** | Dias já marcados no calendário |
| **Restantes** | Dias disponíveis para usar |
| **Visualização** | Barra de progresso colorida |
| **Status** | Badge (Normal, Atenção, Crítico, Bom) |

**Interpretando o Status:**

- 🟢 **Bom** (< 15 dias): Saldo saudável
- 🔵 **Normal** (15-29 dias): Dentro do esperado
- 🟡 **Atenção** (30-44 dias): Considerar férias em breve
- 🔴 **Crítico** (≥ 45 dias): Ação urgente necessária

**Barra de progresso:**
- Verde: Saldo normal
- Amarelo: Saldo elevado
- Vermelho: Saldo crítico

### Ações Recomendadas

**Para status Crítico:**
1. Entre em contato com o colaborador
2. Agende férias nos próximos 30 dias
3. Considere férias compulsórias se necessário

**Para status Atenção:**
1. Envie lembrete sobre saldo
2. Planeje férias nos próximos 2-3 meses
3. Verifique disponibilidade de cobertura

---

## Gestão de Colaboradores

A página de Colaboradores permite gerenciar todos os usuários do sistema.

### Acessando Colaboradores

1. Clique em **"Colaboradores"** na barra de navegação
2. Você verá a lista completa de usuários

### Lista de Colaboradores

**Informações exibidas:**

```
┌─────────────────────────────────────────────────────────┐
│ Nome           │ Status │ Cargo      │ Saldo │ Acesso   │
├─────────────────────────────────────────────────────────┤
│ [A] Allan      │ Ativo  │ Dev Senior │ ▓▓▓ 65│ Hoje     │
│ [AR] Aline R.  │ Ativo  │ Gerente PM │ ▓ 12  │ Ontem    │
│ [AX] Alexandre │ Férias │ QA Analyst │ ▓▓ 20 │ 3d atrás │
└─────────────────────────────────────────────────────────┘
```

**Colunas:**
- Avatar ou inicial do nome
- Nome completo e email
- Badge de status colorido
- Cargo/função
- Barra de progresso + dias de saldo
- Último acesso ao sistema
- Botões de ação (editar/excluir)

### Adicionando Novo Colaborador

**Passo a passo:**

1. Clique no botão **"Novo Usuário"** (canto superior direito)

2. Preencha o formulário:

   **Informações Pessoais:**
   - Nome Completo (ex: Ana Souza)
   - Email Corporativo (ex: ana@empresa.com)
   - Cargo (ex: Designer Senior)
   - Status: Ativo, Férias, Inativo ou Pendente

   **Configurações de Férias:**
   - Departamento (ex: Tecnologia)
   - Data de Admissão (usar calendário)
   - Direito Anual em dias (padrão: 30)

3. Clique em **"Criar Usuário"**

4. Você será redirecionado para a lista
   - O novo usuário aparecerá na tabela

### Editando Colaborador

1. Na lista, clique no ícone **✏️ (lápis)** do colaborador

2. O formulário abrirá com dados preenchidos

3. Modifique os campos desejados

4. Clique em **"Salvar Alterações"**

**Campos editáveis:**
- Todos os campos podem ser alterados
- ID do usuário é mantido automaticamente

### Excluindo Colaborador

⚠️ **Atenção: Esta ação não pode ser desfeita!**

1. Na lista, clique no ícone **🗑️ (lixeira)** do colaborador

2. Confirme a exclusão

3. O colaborador será removido permanentemente

**Quando excluir:**
- Colaborador desligado da empresa
- Registro duplicado
- Dados de teste

**Alternativa:** Mude o status para "Inativo" em vez de excluir

### Barra de Pesquisa

⚠️ **Funcionalidade futura**

Em breve você poderá:
- Buscar por nome
- Filtrar por departamento
- Filtrar por status
- Ordenar colunas

---

## Recursos Avançados

### Modo Escuro (Dark Mode)

O holidayGo suporta tema escuro para trabalho noturno ou preferência pessoal.

**Ativando o Dark Mode:**

1. Localize o ícone de **sol/lua** no canto superior direito da Navbar

2. Clique no ícone
   - 🌙 Lua = modo claro ativo
   - ☀️ Sol = modo escuro ativo

3. A interface mudará imediatamente

**Benefícios:**
- Reduz cansaço visual
- Economiza bateria em telas OLED
- Preferência estética

### Navegação por Breadcrumbs

Nas páginas de formulário, você verá um caminho de navegação:

```
Home / Usuários / Adicionar
```

- Clique em qualquer parte para navegar rapidamente
- Sempre sabe onde está na aplicação

### Atalhos de Teclado

⚠️ **Funcionalidade futura**

Em breve:
- `D` - Dashboard
- `P` - Planejamento
- `S` - Resumo
- `U` - Usuários
- `/` - Buscar

---

## Dicas e Melhores Práticas

### Para Gestores de RH

✅ **Recomendações:**

1. **Revise o Dashboard semanalmente**
   - Identifique padrões
   - Previna sobrecarga

2. **Use a Análise de IA mensalmente**
   - Obtenha insights automáticos
   - Tome decisões baseadas em dados

3. **Monitore saldos críticos**
   - Acesse a página Resumo quinzenalmente
   - Contate colaboradores com status crítico

4. **Mantenha dados atualizados**
   - Revise cadastros trimestralmente
   - Atualize saldos após férias

### Para Colaboradores

✅ **Dicas:**

1. **Planeje suas férias com antecedência**
   - Verifique disponibilidade da equipe
   - Evite períodos de pico

2. **Monitore seu saldo**
   - Acesse a página Resumo regularmente
   - Não deixe dias vencerem

3. **Comunique mudanças**
   - Informe o RH sobre alterações
   - Respeite prazos de aviso prévio

### Segurança

🔒 **Boas práticas:**

- **Senha forte**: Combine letras, números e símbolos
- **Não compartilhe credenciais**: Cada usuário deve ter sua conta
- **Faça logout**: Especialmente em computadores compartilhados
- **Atualize dados**: Mantenha email e informações corretas

---

## Perguntas Frequentes

### Geral

**P: Como faço para recuperar minha senha?**
R: Na tela de login, clique em "Esqueceu a senha?" e siga as instruções enviadas por email.

**P: Posso acessar o sistema pelo celular?**
R: Sim! A interface é responsiva e funciona em smartphones e tablets.

**P: Quanto tempo ficam salvos os dados?**
R: Todos os dados são persistidos enquanto você estiver logado. Em produção, seriam salvos permanentemente.

### Dashboard

**P: Por que alguns dias aparecem em vermelho?**
R: Dias em vermelho claro são finais de semana (sábado e domingo).

**P: Como interpreto a visualização anual?**
R: Cada número representa quantos dias de férias o colaborador tem naquele mês. Um ponto (•) significa nenhuma féria.

**P: A Análise de IA é precisa?**
R: Sim, ela é gerada pelo Google Gemini AI com base nos dados reais da sua equipe.

### Planejamento

**P: Posso agendar férias para vários colaboradores ao mesmo tempo?**
R: Atualmente, não. Você deve selecionar um colaborador por vez. Funcionalidade de agendamento em lote está em desenvolvimento.

**P: Como cancelo férias já agendadas?**
R: No Planejamento, selecione o colaborador e clique nos dias marcados para desmarcá-los. Depois, salve as alterações.

**P: Há limite de dias consecutivos de férias?**
R: Depende da política da sua empresa. O sistema não impõe limites técnicos.

### Resumo

**P: O que significa status "Crítico"?**
R: Indica que o colaborador tem 45 dias ou mais de férias acumuladas, o que pode gerar problemas legais ou de vencimento.

**P: Como o saldo é calculado?**
R: O saldo é a diferença entre dias disponíveis (vacationBalance) e dias já agendados (vacationUsed).

**P: Posso exportar a lista de saldos?**
R: A funcionalidade de exportação está em desenvolvimento e estará disponível em breve.

### Colaboradores

**P: Posso recuperar um colaborador excluído?**
R: Não. A exclusão é permanente. Recomendamos marcar como "Inativo" em vez de excluir.

**P: Quantos colaboradores posso cadastrar?**
R: Não há limite técnico no sistema atual.

**P: Posso alterar o departamento de um colaborador?**
R: Sim, basta editar o cadastro e atualizar o campo "Departamento".

### Técnicas

**P: Qual navegador devo usar?**
R: Recomendamos Chrome, Firefox, Edge ou Safari (versões atualizadas).

**P: A aplicação funciona offline?**
R: Não. É necessária conexão com a internet para todas as funcionalidades.

**P: Meus dados estão seguros?**
R: Sim. A aplicação utiliza práticas modernas de segurança. Em produção, implementaríamos criptografia e autenticação robusta.

---

## Suporte

### Precisa de Ajuda?

Se você não encontrou resposta para sua dúvida:

1. **Consulte a documentação técnica**
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura do sistema
   - [COMPONENTS.md](COMPONENTS.md) - Componentes detalhados
   - [DEVELOPMENT.md](DEVELOPMENT.md) - Guia para desenvolvedores

2. **Entre em contato com o suporte**
   - Email: suporte@holidaygo.com (fictício)
   - Telefone: (11) 1234-5678 (fictício)

3. **Consulte o administrador do sistema**
   - Sua equipe de TI pode ajudar com questões técnicas

---

## Atualizações e Novidades

Este sistema está em constante evolução. Funcionalidades futuras incluem:

- 📧 Notificações por email
- 📱 Aplicativo mobile nativo
- 📊 Relatórios avançados
- 🔔 Alertas automáticos de vencimento
- 👥 Aprovação de férias por gestores
- 📅 Integração com calendário (Google, Outlook)
- 🌍 Suporte a múltiplos idiomas
- 🏢 Gestão de múltiplas empresas

---

## Glossário

**Termos importantes:**

- **Saldo de Férias**: Dias de férias disponíveis para agendar
- **Férias Agendadas**: Dias já marcados no calendário
- **Status**: Situação atual do colaborador (Ativo, Férias, etc.)
- **Dark Mode**: Tema escuro da interface
- **Dashboard**: Página principal com visão geral
- **IA (Inteligência Artificial)**: Tecnologia para análises automáticas
- **Badge**: Etiqueta colorida indicando status
- **CRUD**: Criar, Ler, Atualizar, Deletar (operações básicas)

---

## Conclusão

Parabéns! Você agora conhece todas as funcionalidades do **holidayGo**. 

Use este guia como referência sempre que precisar. Com o tempo, você se familiarizará com a interface e não precisará consultar a documentação com frequência.

**Lembre-se:**
- Planeje com antecedência
- Monitore saldos regularmente
- Use a IA para insights
- Mantenha dados atualizados

**Boas férias e boa gestão!** 🏖️

---

*Última atualização: Dezembro 2024*

*Versão: 1.0*

