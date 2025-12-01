# Planejamento e Definição de Escopo

## 🎯 Objetivo do Módulo

Este módulo guia o desenvolvimento de um **projeto prático integrador** que consolida todos os conceitos estudados nos módulos anteriores. O foco é aplicar conhecimentos de forma estruturada, desde o planejamento inicial até a entrega de código otimizado e documentado.

## 📋 Escolha do Projeto

### Características de um Bom Projeto Integrador

Um projeto adequado deve:

1. **Complexidade Moderada**: Desafiador mas realizável (2-4 semanas)
2. **Multifacetado**: Permitir aplicar diversos conceitos estudados
3. **Prático**: Resolver problema real ou simular cenário profissional
4. **Escalável**: Permitir extensões e melhorias futuras
5. **Portfolio-worthy**: Demonstrável em entrevistas e portfolio

### Sugestões de Projetos

#### 1. Sistema de Gerenciamento de Tarefas (Task Manager)

**Conceitos aplicados:**
- Classes ES6 e OOP
- LocalStorage/IndexedDB para persistência
- Observer Pattern para atualizações reativas
- Factory Pattern para criação de tarefas
- Async/await para operações assíncronas
- DOM manipulation e event handling
- Módulos ES6
- Error handling robusto

**Funcionalidades core:**
- CRUD de tarefas (criar, ler, atualizar, deletar)
- Categorização e tags
- Filtros e busca
- Ordenação customizada
- Notificações e lembretes
- Drag-and-drop para reordenação
- Exportar/importar dados

#### 2. Dashboard de Dados em Tempo Real

**Conceitos aplicados:**
- Fetch API e requisições HTTP
- Web Workers para processamento pesado
- IndexedDB para cache
- Observer Pattern para reatividade
- Performance optimization
- Gráficos e visualizações
- Intersection Observer para lazy loading

**Funcionalidades core:**
- Consumir API pública (clima, crypto, ações)
- Atualização em tempo real
- Múltiplos widgets configuráveis
- Cache inteligente
- Filtragem e agregação de dados
- Exportação de relatórios

#### 3. Aplicação de Notas/Wiki Pessoal

**Conceitos aplicados:**
- IndexedDB para armazenamento estruturado
- Rich text editor (contentEditable)
- Sistema de tags e categorias
- Busca full-text
- Versionamento de conteúdo
- Markdown parsing
- Offline-first com Service Workers

**Funcionalidades core:**
- Editor de texto rico
- Organização hierárquica (pastas)
- Sistema de links internos
- Busca avançada
- Exportação em múltiplos formatos
- Sincronização (localStorage)

#### 4. Gerenciador Financeiro Pessoal

**Conceitos aplicados:**
- Classes para modelagem (Transação, Categoria, Conta)
- LocalStorage/IndexedDB
- Gráficos e relatórios
- Validação de dados
- Factory Pattern para tipos de transação
- Programação funcional para cálculos

**Funcionalidades core:**
- Registro de receitas/despesas
- Categorização automática
- Relatórios mensais/anuais
- Gráficos de evolução
- Metas de economia
- Exportação de dados

## 🧠 Metodologia de Planejamento

### Fase 1: Definição de Escopo

#### Documento de Visão do Produto

```markdown
# [Nome do Projeto]

## Visão Geral
Breve descrição do que o projeto faz e por quê existe.

## Problema
Qual problema específico está sendo resolvido?

## Solução
Como o projeto resolve este problema?

## Usuário-Alvo
Quem usará este projeto?

## Diferenciais
O que torna este projeto único ou especial?
```

#### Definição de Funcionalidades (MoSCoW)

**Must Have (Essencial):**
- Funcionalidades críticas sem as quais o projeto não funciona

**Should Have (Importante):**
- Funcionalidades importantes mas não críticas

**Could Have (Desejável):**
- Funcionalidades nice-to-have, implementar se houver tempo

**Won't Have (Fora do Escopo):**
- Funcionalidades explicitamente excluídas desta versão

**Exemplo para Task Manager:**

```markdown
## Must Have
- Criar tarefas com título e descrição
- Marcar tarefas como completas
- Deletar tarefas
- Persistir dados (localStorage)
- Interface básica funcional

## Should Have
- Categorias/tags
- Data de vencimento
- Filtros (todas, ativas, completas)
- Busca por texto
- Edição de tarefas

## Could Have
- Drag-and-drop para reordenar
- Temas claro/escuro
- Exportar dados (JSON)
- Notificações de vencimento
- Subtarefas

## Won't Have (v1)
- Sincronização multi-dispositivo
- Colaboração em tempo real
- Integração com calendário externo
- Aplicativo mobile
```

### Fase 2: Histórias de Usuário

Descrever funcionalidades da perspectiva do usuário.

**Template:**
```
Como [tipo de usuário],
Quero [objetivo/ação],
Para que [benefício/valor].

Critérios de Aceitação:
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3
```

**Exemplos:**

```markdown
## US-001: Criar Nova Tarefa
Como usuário,
Quero criar uma nova tarefa com título e descrição,
Para que eu possa registrar algo que preciso fazer.

Critérios de Aceitação:
- [ ] Botão "Nova Tarefa" visível na tela principal
- [ ] Modal/formulário abre ao clicar
- [ ] Campos: título (obrigatório), descrição (opcional)
- [ ] Validação: título não pode estar vazio
- [ ] Ao salvar, tarefa aparece na lista
- [ ] Feedback visual de sucesso

## US-002: Marcar Tarefa como Completa
Como usuário,
Quero marcar uma tarefa como completa,
Para que eu possa visualizar meu progresso.

Critérios de Aceitação:
- [ ] Checkbox ao lado de cada tarefa
- [ ] Click no checkbox marca/desmarca
- [ ] Tarefa completa tem estilo visual diferente (strikethrough)
- [ ] Estado persiste após reload
- [ ] Animação suave de transição
```

### Fase 3: Modelagem de Dados

#### Identificar Entidades

Para Task Manager:

```javascript
// Entidade: Tarefa
{
  id: string,              // UUID
  titulo: string,          // Obrigatório
  descricao: string,       // Opcional
  completa: boolean,       // Padrão: false
  categoria: string,       // Opcional
  tags: string[],          // Array de strings
  dataVencimento: Date,    // Opcional
  criadaEm: Date,         // Auto-gerado
  atualizadaEm: Date      // Auto-atualizado
}

// Entidade: Categoria
{
  id: string,
  nome: string,
  cor: string             // Hex color
}

// Entidade: Configuração
{
  tema: 'claro' | 'escuro',
  ordemPadrao: 'data' | 'alfabetica' | 'prioridade',
  mostrarCompletas: boolean
}
```

#### Relacionamentos

```
Tarefa ---[pertence a]---> Categoria (opcional, 1:N)
Tarefa ---[possui]---> Tags (N:N)
```

### Fase 4: Arquitetura de Alto Nível

#### Estrutura de Diretórios

```
projeto/
├── src/
│   ├── models/           # Classes de domínio
│   │   ├── Tarefa.js
│   │   ├── Categoria.js
│   │   └── Configuracao.js
│   ├── services/         # Lógica de negócio
│   │   ├── TarefaService.js
│   │   ├── StorageService.js
│   │   └── NotificacaoService.js
│   ├── ui/               # Componentes UI
│   │   ├── TarefaList.js
│   │   ├── TarefaForm.js
│   │   ├── Filtros.js
│   │   └── Modal.js
│   ├── utils/            # Utilitários
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   ├── patterns/         # Design patterns
│   │   ├── EventBus.js
│   │   └── Factory.js
│   ├── main.js           # Entry point
│   └── app.js            # Aplicação principal
├── public/
│   ├── index.html
│   ├── styles/
│   │   ├── main.css
│   │   └── components.css
│   └── assets/
├── tests/
│   ├── unit/
│   └── integration/
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
├── package.json
├── README.md
└── .gitignore
```

#### Camadas da Aplicação

```
┌─────────────────────────────────┐
│         UI Layer (View)          │
│  - Componentes visuais           │
│  - Event handlers                │
│  - Renderização                  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│     Service Layer (Controller)   │
│  - Lógica de negócio             │
│  - Validações                    │
│  - Orquestração                  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│      Model Layer (Model)         │
│  - Classes de domínio            │
│  - Regras de negócio             │
│  - Validações de modelo          │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│      Data Layer (Storage)        │
│  - Persistência (localStorage)   │
│  - Cache                         │
│  - Queries                       │
└──────────────────────────────────┘
```

## 🔍 Tecnologias e Ferramentas

### Stack Recomendado

**Core:**
- JavaScript ES6+ (sem frameworks inicialmente)
- HTML5 Semântico
- CSS3 (ou Sass/Less)

**APIs Nativas:**
- LocalStorage/IndexedDB (persistência)
- Fetch API (requisições)
- Web Workers (opcional, para processamento pesado)
- Intersection Observer (lazy loading)

**Ferramentas de Desenvolvimento:**
- VS Code
- Live Server (preview local)
- Chrome DevTools
- Git + GitHub

**Opcional (Avançado):**
- Webpack/Vite (bundling)
- Babel (transpiling)
- ESLint (linting)
- Prettier (formatting)
- Jest (testes)

## 📊 Cronograma Sugerido

### Semana 1: Setup e Fundações

**Dia 1-2:**
- Definir escopo detalhado
- Criar estrutura de diretórios
- Setup inicial (HTML, CSS básico)
- Definir models e interfaces

**Dia 3-4:**
- Implementar models (classes)
- Criar StorageService
- Testes básicos de persistência

**Dia 5-6:**
- Implementar CRUD básico
- UI mínima funcional
- Integração model-view

**Dia 7:**
- Code review próprio
- Refactoring inicial
- Documentação básica

### Semana 2: Funcionalidades Core

**Dia 8-9:**
- Implementar filtros e busca
- Sistema de categorias/tags

**Dia 10-11:**
- Validações robustas
- Error handling

**Dia 12-13:**
- Features adicionais (should have)
- Melhorias de UX

**Dia 14:**
- Testes manuais completos
- Bug fixes

### Semana 3: Refinamento

**Dia 15-16:**
- Performance optimization
- Code splitting/lazy loading

**Dia 17-18:**
- Responsividade
- Acessibilidade (ARIA)

**Dia 19-20:**
- Animações e transições
- Polish visual

**Dia 21:**
- Testes de integração
- Cross-browser testing

### Semana 4: Finalização

**Dia 22-23:**
- Documentação completa
- README detalhado
- Comments e JSDoc

**Dia 24-25:**
- Refactoring final
- Code review completo

**Dia 26-27:**
- Deploy (GitHub Pages, Netlify)
- Preparação de apresentação

**Dia 28:**
- Buffer para ajustes finais

## ⚠️ Armadilhas Comuns a Evitar

1. **Over-engineering**: Não adicionar complexidade desnecessária
2. **Feature Creep**: Manter foco no escopo definido
3. **Perfectionism Paralysis**: Priorizar funcionalidade sobre perfeição
4. **Negligenciar Docs**: Documentar desde o início
5. **Pular Planejamento**: Tempo investido em planejamento economiza tempo de desenvolvimento
6. **Ignorar Git**: Commits frequentes e descritivos
7. **Não Testar**: Testar continuamente, não apenas no fim

## 🚀 Próximos Passos

Após concluir o planejamento:

1. Criar repositório Git
2. Fazer commit do plano (este documento)
3. Criar issues/tarefas no GitHub Projects
4. Começar implementação (próximo arquivo: 02-estruturacao-codigo.md)

O sucesso de um projeto depende 50% do planejamento. Invista tempo nesta fase para garantir desenvolvimento mais eficiente e organizado.
