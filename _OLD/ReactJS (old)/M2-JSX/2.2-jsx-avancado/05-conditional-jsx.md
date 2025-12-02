# Conditional JSX: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

Conditional JSX é o **padrão de renderização condicional** em React, onde a existência, estrutura ou conteúdo de elementos na interface é determinado por expressões JavaScript avaliadas em runtime. Conceitualmente, é a manifestação visual de **lógica condicional** - a capacidade de fazer a UI reagir dinamicamente a estados, props, dados do usuário, ou qualquer outra condição computável.

Ao contrário de template languages tradicionais que oferecem diretivas especiais (como `v-if` no Vue ou `*ngIf` no Angular), Conditional JSX é **puro JavaScript** - usa os operadores e construções nativas da linguagem (ternário, `&&`, `if/else`, `switch`) dentro de expressões JSX, refletindo a filosofia React de "apenas JavaScript".

### Contexto Histórico e Motivação

Quando o React foi introduzido, uma de suas propostas revolucionárias era tratar UI como **função do estado** - dado o mesmo estado, a UI é previsível e determinística. Isso naturalmente levou à necessidade de renderização condicional: se estado muda, UI deve refletir essas mudanças condicionalmente.

**A Filosofia "Just JavaScript":**

Diferente de frameworks que inventam sintaxe especial para condicionais (`v-if`, `ng-if`, `#if`), React deliberadamente escolheu **não criar novas abstrações**. A lógica era: desenvolvedores já conhecem JavaScript; por que ensinar outra sintaxe?

```javascript
// Vue (sintaxe especial):
<div v-if="condition">Conteúdo</div>

// Angular (sintaxe especial):
<div *ngIf="condition">Conteúdo</div>

// React (JavaScript puro):
{condition && <div>Conteúdo</div>}
```

**Motivação Técnica:**

JSX é **JavaScript com açúcar sintático para UI**. Permitir JavaScript direto em condicionais significa:
- Sem parser especial além de JS
- Toda expressividade de JS disponível
- Ferramentas JS (linters, type checkers) funcionam nativamente
- Curva de aprendizado menor (já sabe JS? já sabe condicional em React)

### Problema Fundamental que Resolve

Conditional JSX resolve o desafio de **UI dinâmica em paradigma declarativo**:

**Paradigma Imperativo (DOM direto):**
```javascript
// Imperativo: diz COMO mudar
if (isLoggedIn) {
  const element = document.createElement('div');
  element.textContent = 'Bem-vindo!';
  container.appendChild(element);
} else {
  const element = document.createElement('div');
  element.textContent = 'Faça login';
  container.appendChild(element);
}
```

**Paradigma Declarativo (React):**
```javascript
// Declarativo: diz O QUE mostrar
{isLoggedIn ? (
  <div>Bem-vindo!</div>
) : (
  <div>Faça login</div>
)}
```

**Problemas resolvidos:**

1. **Sincronização Estado-UI:** UI automaticamente reflete estado atual sem lógica manual
2. **Complexidade de Mudanças:** Adicionar condição não requer refatorar código imperativo
3. **Composição:** Condicionais podem ser aninhados e compostos naturalmente
4. **Testabilidade:** Funções puras que retornam JSX baseado em inputs são facilmente testáveis

### Importância no Ecossistema

Conditional JSX é **fundamental e ubíquo** - praticamente todo componente React real usa renderização condicional. Sua importância vai além da funcionalidade:

- **Expressividade:** Permite UIs ricas que respondem a contexto
- **Composição:** Base para patterns como loading states, error boundaries, feature flags
- **Performance:** Componentes não renderizados não existem no Virtual DOM
- **Experiência do Usuário:** Interfaces adaptativas que mostram conteúdo relevante

Dominar Conditional JSX é dominar como criar UIs verdadeiramente dinâmicas e responsivas a estado.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Expressões vs. Statements:** JSX aceita expressões (avaliam para valor), não statements
2. **Truthy/Falsy Evaluation:** JavaScript type coercion determina o que renderiza
3. **Null/Undefined Safety:** `null`, `undefined`, `false`, `true` não renderizam
4. **Short-Circuit Evaluation:** `&&` e `||` aproveitam avaliação curta do JS
5. **Ternário para Branches:** Operador ternário (`? :`) para alternativas

### Pilares Fundamentais

- **JavaScript Nativo:** Usa operadores JS sem abstração adicional
- **Runtime Evaluation:** Condições avaliadas durante renderização
- **Declaratividade:** Descreve "o que" mostrar baseado em condição, não "como" atualizar
- **Composabilidade:** Condicionais podem ser aninhados e combinados

### Visão Geral das Nuances

- **Operador && com Valores Falsy:** `0`, `""`, `NaN` renderizam (não são `false`)
- **Keys em Condicionais:** Elementos condicionais podem precisar de keys
- **Performance de Early Returns:** `if/return` evita processar JSX desnecessário
- **Condicionais Complexos:** Extrair para variáveis ou funções melhora legibilidade

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Para entender Conditional JSX profundamente, precisamos examinar como JavaScript avalia expressões e como React processa o resultado.

#### Avaliação de Expressões em JSX

**Regra fundamental:** Dentro de `{}` em JSX, você pode colocar qualquer **expressão JavaScript**.

**Expressão:** Código que **avalia para um valor**.
```javascript
// Expressões válidas:
{2 + 2}                    // número
{userName}                 // variável
{user.isAdmin}            // acesso a propriedade
{getStatus()}             // chamada de função
{isLoggedIn ? 'Sim' : 'Não'} // ternário
{condition && <Component />}   // lógica curta
```

**Statement:** Código que **executa uma ação** (não retorna valor diretamente).
```javascript
// ❌ Statements NÃO funcionam em JSX:
{if (condition) { return <div /> }}  // if é statement
{for (let i = 0; i < 10; i++) { }}   // for é statement
{const x = 5}                         // declaração é statement
```

**Por quê:** JSX `{}` é compilado para **argumento de função**. Argumentos devem ser expressões:
```javascript
// JSX:
<div>{condition && <Component />}</div>

// Compila para:
jsx('div', { children: condition && jsx(Component, {}) })
//                      ^^^^^^^^ isso deve ser expressão
```

#### Truthy e Falsy em JavaScript

React usa **type coercion** do JavaScript para decidir o que renderizar:

**Valores Falsy (não renderizam ou renderizam como vazio):**
```javascript
false      // React ignora completamente
null       // React ignora completamente
undefined  // React ignora completamente
true       // React ignora completamente
```

**Valores Truthy (renderizam):**
```javascript
0          // Renderiza "0" (número)
""         // Renderiza "" (string vazia visualmente invisível)
NaN        // Renderiza "NaN" (string)
[]         // Renderiza "" (array vazio vira string vazia)
{}         // Renderiza "[object Object]" (cuidado!)
```

**Implicação crucial:**
```javascript
// ❌ ARMADILHA:
{count && <div>Você tem {count} itens</div>}
// Se count = 0, renderiza "0" na tela!

// ✅ CORRETO:
{count > 0 && <div>Você tem {count} itens</div>}
// Se count = 0, false não renderiza
```

#### Short-Circuit Evaluation

JavaScript avalia expressões lógicas apenas até determinar resultado:

**Operador `&&` (E lógico):**
```javascript
// Se esquerda é falsy, retorna esquerda (não avalia direita)
false && <Component />  // Retorna false, Component nunca executa

// Se esquerda é truthy, retorna direita
true && <Component />   // Retorna <Component />
```

**Operador `||` (OU lógico):**
```javascript
// Se esquerda é truthy, retorna esquerda (não avalia direita)
"Olá" || <Component />  // Retorna "Olá", Component nunca executa

// Se esquerda é falsy, retorna direita
null || <Component />   // Retorna <Component />
```

**React aproveitando short-circuit:**
```javascript
{isLoggedIn && <Dashboard />}
// Se isLoggedIn = false, Dashboard nem executa
// Economiza processamento
```

#### Renderização de Diferentes Tipos

React processa diferentes tipos de valores retornados:

```javascript
// Strings: renderizam como texto
{"Olá"}              // <-- Olá

// Números: renderizam como texto
{42}                 // <-- 42
{0}                  // <-- 0 (atenção!)

// Booleans: não renderizam
{true}               // <-- (nada)
{false}              // <-- (nada)

// null/undefined: não renderizam
{null}               // <-- (nada)
{undefined}          // <-- (nada)

// Elementos React: renderizam
{<div>Olá</div>}     // <-- <div>Olá</div>

// Arrays: renderizam cada elemento
{[<div key="1">A</div>, <div key="2">B</div>]}
// <-- <div>A</div><div>B</div>

// Objetos: erro
{{name: "João"}}     // ❌ Objects are not valid as React child
```

### Princípios e Conceitos Subjacentes

#### 1. UI como Função de Estado

Conditional JSX personifica o princípio core do React:

```
UI = f(state)
```

Dado o mesmo estado, a UI é sempre a mesma. Condicionais são a forma de **mapear diferentes estados para diferentes UIs**.

```javascript
function UserStatus({ user }) {
  // Mapeamento: estado → UI
  if (!user) return <div>Carregando...</div>;
  if (user.banned) return <div>Usuário banido</div>;
  if (user.isPremium) return <div>👑 {user.name}</div>;
  return <div>{user.name}</div>;
}
// Determinístico: mesmo user → mesma UI
```

#### 2. Declaratividade sobre Imperatividade

Condicional declarativo descreve **o que** mostrar, não **como** atualizar:

```javascript
// Imperativo (jQuery-style):
if (isLoggedIn) {
  $('#welcome').show();
  $('#login-button').hide();
} else {
  $('#welcome').hide();
  $('#login-button').show();
}
// Você gerencia transições

// Declarativo (React):
{isLoggedIn ? <Welcome /> : <LoginButton />}
// React gerencia transições
```

**Vantagem:** Não precisa pensar em estado anterior, apenas estado atual.

#### 3. Composição de Lógica

Condicionais podem ser compostos em múltiplos níveis:

```javascript
function Post({ post, user }) {
  return (
    <article>
      <h1>{post.title}</h1>

      {/* Nível 1: post tem autor? */}
      {post.author && (
        <div className="author">
          <img src={post.author.avatar} />
          <span>{post.author.name}</span>

          {/* Nível 2: autor é o usuário atual? */}
          {user && user.id === post.author.id && (
            <button>Editar</button>
          )}
        </div>
      )}

      <p>{post.content}</p>

      {/* Nível 1: post tem comentários? */}
      {post.comments && post.comments.length > 0 && (
        <section>
          <h2>Comentários ({post.comments.length})</h2>
          {post.comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </section>
      )}
    </article>
  );
}
```

**Composabilidade:** Cada nível é independente e legível.

#### 4. Null Safety Pattern

React ignora `null`/`undefined`, permitindo pattern seguro:

```javascript
function Profile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      {/* Se address é undefined, não renderiza nada (não quebra) */}
      {user.address && <p>{user.address.street}</p>}
      {/* Chain opcional também funciona */}
      <p>{user.company?.name || 'Freelancer'}</p>
    </div>
  );
}
```

**Princípio:** Falhar graciosamente é melhor que lançar erro.

### Relação com Outros Conceitos da Linguagem

#### Type Coercion

Conditional JSX depende fortemente de type coercion do JS:

```javascript
// JavaScript converte valores para boolean em contextos lógicos
Boolean(0)           // false
Boolean("")          // false
Boolean([])          // true
Boolean({})          // true

// Em JSX:
{[] && <Component />}  // Renderiza <Component /> (array é truthy)
{0 && <Component />}   // Renderiza 0 (short-circuit retorna 0)
```

**Cuidado:** Coercion pode ser contraintuitivo. Sempre faça comparações explícitas quando houver dúvida.

#### Operadores Lógicos

`&&`, `||`, `??` (nullish coalescing) são pilares:

```javascript
// && (E): renderiza direita se esquerda é truthy
{hasPermission && <AdminPanel />}

// || (OU): renderiza esquerda se truthy, senão direita
{username || "Guest"}

// ?? (Nullish): como ||, mas só para null/undefined
{username ?? "Guest"}  // username = "" não usa fallback
```

#### Ternário

Operador ternário é **expressão** (retorna valor), ideal para JSX:

```javascript
// Ternário: condição ? truthy : falsy
{isLoggedIn ? <Dashboard /> : <LoginPage />}

// Equivalente if/else (statement, não funciona diretamente em JSX):
if (isLoggedIn) {
  return <Dashboard />;
} else {
  return <LoginPage />;
}
```

### Modelo Mental para Compreensão

#### Condicionais como "Portas"

Pense em condicionais como **portas** que controlam se elementos "passam" para renderização:

```javascript
{isOpen && <Content />}
//  ^^^^      ^^^^^^^^
//  Porta     Conteúdo

// Porta aberta (isOpen = true): Conteúdo passa
// Porta fechada (isOpen = false): Conteúdo não passa
```

#### Ternário como "Bifurcação"

Ternário é uma **estrada bifurcando**:

```javascript
{isLoggedIn ? <Dashboard /> : <Login />}
//            ^^^^^^^^^^^^     ^^^^^^^
//            Caminho A        Caminho B

// Sempre toma UM dos caminhos, nunca ambos
```

#### Early Return como "Guardiões"

Early returns são **guardiões** que protegem código abaixo:

```javascript
function Component({ data }) {
  if (!data) return <Loading />; // Guardião 1
  if (data.error) return <Error />; // Guardião 2

  // Código aqui só executa se passou dos guardiões
  return <Content data={data} />;
}
```

---

## 🔍 Análise Conceitual Profunda

### Padrões Fundamentais

#### 1. Operador && (Renderização Condicional Simples)

**Uso:** Mostrar elemento apenas se condição é verdadeira.

```javascript
function Inbox({ unreadCount }) {
  return (
    <div>
      <h1>Inbox</h1>
      {/* Mostra badge apenas se há mensagens */}
      {unreadCount > 0 && (
        <span className="badge">{unreadCount}</span>
      )}
    </div>
  );
}
```

**Análise profunda:**

**Por quê funciona:**
- Se `unreadCount > 0` é `false`, expressão retorna `false` (React ignora)
- Se `unreadCount > 0` é `true`, expressão retorna `<span>` (React renderiza)

**Armadilha comum:**
```javascript
// ❌ ERRADO:
{unreadCount && <span>{unreadCount}</span>}
// Se unreadCount = 0, renderiza "0"!

// ✅ CORRETO:
{unreadCount > 0 && <span>{unreadCount}</span>}
// Se unreadCount = 0, expressão é false (não renderiza)
```

**Quando usar:** Condição simples, um único "branch" (mostrar ou não mostrar).

#### 2. Operador Ternário (Renderização Alternativa)

**Uso:** Escolher entre dois elementos baseado em condição.

```javascript
function AuthStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <UserMenu />
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
```

**Análise profunda:**

**Estrutura:**
```javascript
{condição ? (
  // Branch "true"
  <ElementoA />
) : (
  // Branch "false"
  <ElementoB />
)}
```

**Parênteses:** Não obrigatórios para elementos únicos, mas ajudam legibilidade:
```javascript
// Válido mas menos legível:
{isLoggedIn ? <UserMenu /> : <LoginButton />}

// Recomendado para múltiplas linhas:
{isLoggedIn ? (
  <UserMenu />
) : (
  <LoginButton />
)}
```

**Quando usar:** Duas alternativas mutuamente exclusivas.

#### 3. Early Return (Guarda Clauses)

**Uso:** Lidar com casos especiais antes da renderização principal.

```javascript
function UserProfile({ user }) {
  // Guarda 1: loading state
  if (!user) {
    return <div>Carregando...</div>;
  }

  // Guarda 2: error state
  if (user.error) {
    return <div>Erro: {user.error}</div>;
  }

  // Guarda 3: empty state
  if (user.posts.length === 0) {
    return <div>Usuário sem posts</div>;
  }

  // Caminho feliz: renderização normal
  return (
    <div>
      <h1>{user.name}</h1>
      {user.posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**Análise profunda:**

**Vantagens:**
1. **Clareza:** "Caminho feliz" fica no final, sem indentação
2. **Fail Fast:** Casos especiais tratados imediatamente
3. **Evita Indentação:** Sem pirâmide de `if/else` aninhados
4. **Performance:** Componente não processa JSX complexo se condição especial

**Padrão recomendado:**
```javascript
function Component({ data }) {
  // 1. Validações e casos especiais primeiro
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;

  // 2. Renderização normal por último
  return <MainContent data={data} />;
}
```

**Quando usar:** Múltiplos casos especiais (loading, error, empty) antes da UI principal.

#### 4. Variáveis para Condicionais Complexos

**Uso:** Extrair lógica condicional complexa para variáveis.

```javascript
function ProductCard({ product, user }) {
  // Lógica complexa extraída
  const canEdit = user && (
    user.isAdmin ||
    user.id === product.ownerId
  );

  const showDiscountBadge =
    product.discount > 0 &&
    product.discount < 50;

  const priceLabel = product.discount > 0
    ? `R$ ${product.discountedPrice} (${product.discount}% off)`
    : `R$ ${product.price}`;

  return (
    <div className="product-card">
      <h3>{product.name}</h3>

      {showDiscountBadge && (
        <span className="badge">Promoção!</span>
      )}

      <p className="price">{priceLabel}</p>

      {canEdit && (
        <button>Editar Produto</button>
      )}
    </div>
  );
}
```

**Análise profunda:**

**Vantagens:**
1. **Legibilidade:** JSX fica limpo, lógica tem nomes descritivos
2. **Testabilidade:** Variáveis podem ser testadas independentemente
3. **Reutilização:** Mesma lógica usada em múltiplos lugares
4. **Manutenibilidade:** Mudança na lógica em um lugar só

**Quando usar:** Condições envolvem múltiplas comparações ou lógica de negócio.

#### 5. Funções para Blocos Condicionais

**Uso:** Extrair blocos JSX grandes para funções.

```javascript
function Dashboard({ user, stats }) {
  const renderWelcome = () => {
    if (user.isNewUser) {
      return (
        <div className="welcome-banner">
          <h2>Bem-vindo, {user.name}!</h2>
          <p>Complete seu perfil para começar</p>
          <button>Completar Perfil</button>
        </div>
      );
    }

    if (user.hasUnreadNotifications) {
      return (
        <div className="notification-banner">
          <p>Você tem {user.unreadCount} notificações</p>
          <button>Ver Notificações</button>
        </div>
      );
    }

    return (
      <div className="stats-summary">
        <h2>Resumo do Dia</h2>
        <StatCard value={stats.today} label="Hoje" />
      </div>
    );
  };

  return (
    <div className="dashboard">
      {renderWelcome()}
      <MainContent />
    </div>
  );
}
```

**Análise profunda:**

**Vantagens:**
1. **Organização:** JSX principal fica conciso
2. **Complexidade isolada:** Lógica complexa em função separada
3. **Nomeação descritiva:** Função comunica propósito
4. **Early returns dentro:** Múltiplos casos tratados com if/return

**Pattern de nomeação:** `render*` é convenção comum para funções que retornam JSX.

**Quando usar:** Blocos JSX condicionais grandes (>10 linhas) ou com lógica complexa.

### Padrões Avançados

#### Conditional Rendering com Switch-Case

```javascript
function StatusIndicator({ status }) {
  // Não funciona diretamente em JSX (switch é statement)
  let indicator;

  switch (status) {
    case 'pending':
      indicator = <span className="badge yellow">Pendente</span>;
      break;
    case 'approved':
      indicator = <span className="badge green">Aprovado</span>;
      break;
    case 'rejected':
      indicator = <span className="badge red">Rejeitado</span>;
      break;
    default:
      indicator = <span className="badge gray">Desconhecido</span>;
  }

  return <div>{indicator}</div>;
}
```

**Alternativa funcional (mapeamento):**
```javascript
function StatusIndicator({ status }) {
  const indicators = {
    pending: <span className="badge yellow">Pendente</span>,
    approved: <span className="badge green">Aprovado</span>,
    rejected: <span className="badge red">Rejeitado</span>,
  };

  return (
    <div>
      {indicators[status] || <span className="badge gray">Desconhecido</span>}
    </div>
  );
}
```

**Vantagem do mapeamento:** Mais conciso, declarativo, facilita adicionar casos.

#### Renderização Condicional com IIFE

```javascript
function ComplexConditional({ status, data }) {
  return (
    <div>
      {(() => {
        // IIFE permite statements dentro de JSX
        if (status === 'loading') {
          return <Spinner />;
        }

        if (status === 'error') {
          return <ErrorMessage />;
        }

        if (data.length === 0) {
          return <EmptyState />;
        }

        // Lógica mais complexa possível
        const filteredData = data.filter(item => item.active);
        return <DataList items={filteredData} />;
      })()}
    </div>
  );
}
```

**Análise:** IIFE (Immediately Invoked Function Expression) permite usar statements, mas geralmente indica que lógica deveria estar em função separada ou early returns.

**Quando usar:** Raramente - preferir funções nomeadas ou early returns para legibilidade.

#### Null Rendering Explicito

```javascript
function OptionalSection({ show, children }) {
  return show ? children : null;
  // null explícito comunica "não renderizar nada intencionalmente"
}

// Uso:
<OptionalSection show={user.isPremium}>
  <PremiumFeatures />
</OptionalSection>
```

**Alternativa:**
```javascript
{user.isPremium && <PremiumFeatures />}
```

**Quando usar componente:** Se lógica condicional é reutilizada ou precisa ser testada.

---

## 🎯 Aplicabilidade e Contextos

### Padrões por Cenário

#### Loading States

```javascript
function DataComponent({ isLoading, data }) {
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner />
        <p>Carregando dados...</p>
      </div>
    );
  }

  return <DataDisplay data={data} />;
}
```

**Pattern:** Early return para loading.

#### Error States

```javascript
function DataComponent({ error, data }) {
  if (error) {
    return (
      <div className="error-container">
        <ErrorIcon />
        <p>Erro ao carregar: {error.message}</p>
        <button onClick={retry}>Tentar Novamente</button>
      </div>
    );
  }

  return <DataDisplay data={data} />;
}
```

**Pattern:** Early return para erros.

#### Empty States

```javascript
function UserList({ users }) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <EmptyIcon />
        <h3>Nenhum usuário encontrado</h3>
        <p>Tente ajustar os filtros</p>
      </div>
    );
  }

  return (
    <ul>
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
}
```

**Pattern:** Early return para lista vazia.

#### Autenticação/Autorização

```javascript
function ProtectedRoute({ user, requiredRole, children }) {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div>Acesso negado</div>;
  }

  return children;
}
```

**Pattern:** Guards sequenciais (early returns).

#### Feature Flags

```javascript
function ExperimentalFeature({ featureFlags, fallback }) {
  return featureFlags.newUI ? (
    <NewUIComponent />
  ) : (
    fallback || <OldUIComponent />
  );
}
```

**Pattern:** Ternário para A/B testing.

#### Responsive/Adaptive UI

```javascript
function ResponsiveLayout({ isMobile }) {
  return (
    <div>
      {isMobile ? (
        <MobileNavigation />
      ) : (
        <DesktopNavigation />
      )}

      <MainContent />

      {isMobile && <MobileBottomBar />}
    </div>
  );
}
```

**Pattern:** Ternário + && para variações de device.

---

## ⚠️ Limitações e Considerações Teóricas

### Armadilhas Comuns

#### 1. Falsy Values Renderizando

```javascript
// ❌ PROBLEMA:
{count && <div>{count} itens</div>}
// Se count = 0, renderiza "0"

// ✅ SOLUÇÃO:
{count > 0 && <div>{count} itens</div>}
{Boolean(count) && <div>{count} itens</div>}
{!!count && <div>{count} itens</div>}
```

#### 2. Ternários Aninhados

```javascript
// ❌ ILEGÍVEL:
{loading ? (
  <Spinner />
) : error ? (
  <Error />
) : data ? (
  <Data />
) : (
  <Empty />
)}

// ✅ MELHOR (early returns):
if (loading) return <Spinner />;
if (error) return <Error />;
if (!data) return <Empty />;
return <Data />;
```

#### 3. Lógica Complexa em JSX

```javascript
// ❌ DIFÍCIL DE LER:
{user && user.isAdmin && user.permissions.includes('edit') &&
 post.status === 'draft' && <EditButton />}

// ✅ MELHOR:
const canEdit = user?.isAdmin &&
                user?.permissions.includes('edit') &&
                post.status === 'draft';

{canEdit && <EditButton />}
```

### Performance Considerations

#### Condicionais vs. CSS Display

```javascript
// Renderização condicional: remove do DOM
{isVisible && <HeavyComponent />}
// Se isVisible = false, HeavyComponent não existe

// CSS display: mantém no DOM
<HeavyComponent style={{ display: isVisible ? 'block' : 'none' }} />
// HeavyComponent sempre existe, apenas escondido
```

**Quando usar cada:**
- **Condicional:** Estado muda raramente, componente é pesado
- **CSS:** Estado muda frequentemente (animações, toggles), componente é leve

#### Early Returns Evitam Processamento

```javascript
// Sem early return:
function Component({ data }) {
  const processed = expensiveProcessing(data); // Sempre executa

  return !data ? <Empty /> : <Display data={processed} />;
}

// Com early return:
function Component({ data }) {
  if (!data) return <Empty />;

  const processed = expensiveProcessing(data); // Só executa se há data
  return <Display data={processed} />;
}
```

**Benefício:** Economia de CPU em casos especiais.

---

## 🔗 Interconexões Conceituais

### Relação com Estado

Conditional JSX é a forma mais direta de **visualizar estado**:

```javascript
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(!isOpen)}>
      Toggle
    </button>
    {isOpen && <Panel />}
  </>
);
```

### Relação com Props

Componentes recebem props e renderizam condicionalmente:

```javascript
function Alert({ type, message }) {
  const styles = {
    error: 'bg-red',
    warning: 'bg-yellow',
    success: 'bg-green',
  };

  return (
    <div className={styles[type] || 'bg-gray'}>
      {message}
    </div>
  );
}
```

### Relação com Hooks

Hooks frequentemente determinam condições:

```javascript
function DataComponent() {
  const { data, loading, error } = useFetch('/api/data');

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;
  return <Display data={data} />;
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Padrões Emergentes

#### Suspense para Loading States

```javascript
<Suspense fallback={<Spinner />}>
  <DataComponent />
</Suspense>
// Suspense gerencia loading automaticamente
```

#### Error Boundaries para Erros

```javascript
<ErrorBoundary fallback={<ErrorUI />}>
  <DataComponent />
</ErrorBoundary>
// Error boundary captura erros automaticamente
```

### Conclusão

Conditional JSX é fundamental para UIs dinâmicas em React. Dominar seus padrões permite criar interfaces expressivas, performáticas e manuteníveis.

**Conceitos-chave:**
1. Use JavaScript nativo (&&, ternário, if/return)
2. Cuidado com valores falsy que renderizam (0, "")
3. Extraia lógica complexa para variáveis/funções
4. Early returns para casos especiais
5. Ternário para alternativas binárias

**Progressão:**
```
Operadores básicos (&&, ternário)
    ↓
Early returns e guards
    ↓
Extração para variáveis/funções
    ↓
Patterns avançados (mapeamento, IIFE)
    ↓
Suspense e Error Boundaries
```

Conditional JSX é a ponte entre lógica e UI - dominar essa ponte é essencial para desenvolvimento React eficaz.
