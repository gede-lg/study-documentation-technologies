# Conceito de Componentes e UI Baseada em Estado: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

Um **componente** no React é uma **unidade independente, reutilizável e encapsulada** que combina estrutura visual (markup), lógica de apresentação (comportamento) e estilo em uma entidade coesa. Conceitualmente, componentes são **funções ou classes que aceitam entradas arbitrárias (props) e retornam elementos React** descrevendo como uma seção da interface deve aparecer.

Na essência filosófica, um componente é uma **abstração que mapeia dados em representação visual**. Matematicamente, pode-se pensar em componentes como funções no sentido mais puro:

```
Componente: (Props, Estado) → ElementosReact
```

Onde Props são parâmetros externos e Estado é memória interna, e o resultado é uma descrição declarativa da UI.

**UI baseada em estado** significa que a interface do usuário é uma **função direta do estado da aplicação**. Cada estado possível da aplicação tem uma representação visual correspondente e previsível. Não há "transições" ou "animações imperativas" entre estados - você simplesmente declara "para este estado, a UI deve ser assim", e o React garante que a UI reflita isso.

### Contexto Histórico e Motivação

Antes do React e da popularização de componentes, desenvolvimento web seguia o modelo de **separação de tecnologias**: HTML para estrutura, CSS para estilo, JavaScript para comportamento. Essa separação parecia lógica, mas causava problemas fundamentais:

**Problemas do Modelo Tradicional:**

1. **Acoplamento Implícito:** Mesmo separados em arquivos, HTML/CSS/JS de uma feature estavam intimamente acoplados. Mudar um requeria mudar outros. A "separação" era ilusória.

2. **Dificuldade de Reutilização:** Reutilizar uma feature (ex: um cartão de produto) requeria copiar HTML, CSS e JS correspondentes - propenso a erros e inconsistências.

3. **Escopo Global:** CSS e JavaScript operavam em escopo global, causando conflitos de nomes e efeitos colaterais inesperados.

4. **Sincronização Manual:** JavaScript manipulava DOM imperativamente. Manter consistência entre estado da aplicação e estado da UI era responsabilidade do desenvolvedor.

**A Revolução dos Componentes:**

O React popularizou uma mudança radical: **separação por funcionalidade, não por tecnologia**. Ao invés de todos os HTMLs em um lugar, todos os CSSs em outro, você agrupa tudo relacionado a uma feature em um componente.

```
Modelo Tradicional:           Modelo de Componentes:
/templates/                   /components/
  home.html                     /Button/
  about.html                      Button.jsx
/styles/                          Button.css
  home.css                      /Card/
  about.css                       Card.jsx
/scripts/                         Card.css
  home.js                       /Header/
  about.js                        Header.jsx
```

Essa mudança reflete o princípio de **coesão** - coisas que mudam juntas devem ficar juntas.

**Influências Históricas:**

- **Web Components (2011):** Proposta W3C para componentização nativa no browser. React acelerou e popularizou a ideia antes que Web Components amadurecessem.
- **Arquitetura de Widgets (Desktop):** Frameworks desktop (Qt, WPF, Cocoa) há décadas usam componentes/widgets. React trouxe essa maturidade para web.
- **Programação Orientada a Componentes:** Paradigma de design de sistemas complexos como composição de partes independentes.

### Problema Fundamental que Resolve

Componentes e UI baseada em estado resolvem o **problema da complexidade escalável em interfaces**.

**1. Complexidade Através de Composição:**

Interfaces complexas emergem de combinar componentes simples:

```javascript
// Complexidade gerenciável através de composição
function Dashboard() {
  return (
    <Layout>
      <Header user={currentUser} />
      <Sidebar>
        <Navigation />
        <QuickActions />
      </Sidebar>
      <MainContent>
        <DataTable data={reports} />
        <Charts metrics={metrics} />
      </MainContent>
      <Footer />
    </Layout>
  );
}
```

Cada componente (Header, Sidebar, DataTable) é independente e testável. A complexidade total é a **soma**, não o **produto** das complexidades individuais.

**2. Reusabilidade Verdadeira:**

Um botão definido uma vez pode ser usado em dezenas de lugares:

```javascript
function Button({ onClick, children, variant = 'primary' }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// Reutilizado em múltiplos contextos
<Button onClick={handleSave}>Salvar</Button>
<Button onClick={handleCancel} variant="secondary">Cancelar</Button>
<Button onClick={handleDelete} variant="danger">Deletar</Button>
```

**3. Previsibilidade Através de Estado:**

UI como função de estado significa que:
- Dado o mesmo estado, sempre obtém a mesma UI
- Bugs relacionados a sincronização estado-UI são eliminados
- Debugging é mais simples - inspecione o estado para entender a UI

```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // Estado determina UI

  // UI é função direta deste estado
  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // Mesmo estado sempre produz mesma UI
  return <ul>{visibleTodos.map(todo => <TodoItem key={todo.id} {...todo} />)}</ul>;
}
```

Se `todos` e `filter` são os mesmos, a UI renderizada será idêntica - **determinismo**.

**4. Encapsulamento e Isolamento:**

Componentes escondem detalhes internos, expondo apenas interface pública:

```javascript
// Consumidor não precisa saber como Dropdown funciona internamente
<Dropdown
  options={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
/>
```

Isso permite mudar implementação interna sem afetar consumidores.

### Importância no Ecossistema

Componentes são a **unidade fundamental** de toda aplicação React. Sua importância transcende sintaxe:

**1. Pensamento Composicional:**

Componentes ensinam a pensar em termos de **hierarquias de abstração**:
- Componentes atômicos (Button, Input)
- Componentes de módulo (Card, Modal)
- Componentes de página (Dashboard, Profile)
- Componentes de layout (Grid, Layout)

**2. Ecossistema de Componentes:**

A natureza reutilizável de componentes gerou ecossistema massivo:
- **Bibliotecas UI:** Material-UI, Ant Design, Chakra UI - coleções de componentes prontos
- **Component Libraries:** Organizações constroem bibliotecas internas de componentes
- **Design Systems:** Componentização permite implementar design systems (linguagem visual consistente)

**3. Colaboração e Divisão de Trabalho:**

Componentes bem definidos permitem paralelização:
- Designer trabalha em componentes visuais
- Desenvolvedor A trabalha em componentes de lógica
- Desenvolvedor B trabalha em integração
- Times diferentes mantêm componentes diferentes

**4. Testabilidade:**

Componentes isolados são unidades naturais de teste:

```javascript
// Testar componente isoladamente
test('Button renderiza texto corretamente', () => {
  render(<Button>Clique</Button>);
  expect(screen.getByText('Clique')).toBeInTheDocument();
});
```

**5. Manutenibilidade:**

Mudanças são localizadas. Bug no Card? Corrija o componente Card. Todos os usos beneficiam automaticamente.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Componente como Abstração:** Encapsulamento de estrutura, lógica e apresentação em unidade coesa

2. **Composição Hierárquica:** Componentes são compostos de outros componentes, formando árvore de abstração

3. **Props como Interface Pública:** Componentes comunicam através de props - contrato entre componente e consumidor

4. **Estado como Memória:** Componentes podem ter estado interno que persiste entre renderizações

5. **UI = f(State):** Interface é função pura do estado - mesmo estado produz mesma UI

6. **Reatividade:** Mudanças de estado automaticamente propagam para UI

### Pilares Fundamentais

- **Encapsulamento:** Detalhes internos são escondidos, apenas interface pública exposta
- **Reutilização:** Componente definido uma vez, usado múltiplas vezes
- **Isolamento:** Componentes são independentes - mudanças são localizadas
- **Composição:** Complexidade emerge de combinar componentes simples
- **Declaratividade:** Componentes descrevem "o que", não "como"

### Visão Geral das Nuances

- **Componentes Controlados vs Não Controlados:** Quem gerencia estado (componente vs externo)
- **Componentes Apresentacionais vs Container:** Separação de lógica e apresentação
- **Composição vs Herança:** React favorece composição sobre hierarquias de herança
- **Children como Prop Especial:** Permite composição flexível
- **Keys em Listas:** Identidade estável para otimização de re-renders

---

## 🧠 Fundamentos Teóricos

### Como Componentes Funcionam Internamente

Para entender componentes profundamente, é crucial compreender o que acontece "por baixo dos panos".

#### Anatomia de um Componente

Um componente React, em sua forma mais pura, é uma **função ou classe que retorna uma descrição de UI**:

```javascript
// Componente funcional básico
function Greeting(props) {
  return <h1>Olá, {props.name}!</h1>;
}

// O que React vê internamente (após JSX ser transpilado)
function Greeting(props) {
  return React.createElement('h1', null, `Olá, ${props.name}!`);
}
```

Quando React "renderiza" um componente:

1. **Invocação:** React chama a função/método render do componente
2. **Recebe Elementos:** Componente retorna elementos React (objetos JavaScript)
3. **Constrói VDOM:** Elementos formam árvore de Virtual DOM
4. **Reconciliação:** React compara com árvore anterior
5. **Atualiza DOM:** Aplica mudanças mínimas necessárias

#### O Ciclo de Vida de um Componente

Componentes passam por fases distintas:

**1. Mounting (Montagem):**
Componente é criado e inserido no DOM.

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // Executa quando componente monta
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Array vazio = monta apenas

  if (!user) return <div>Carregando...</div>;
  return <div>{user.name}</div>;
}
```

**2. Updating (Atualização):**
Props ou estado mudam, componente re-renderiza.

```javascript
useEffect(() => {
  console.log('Componente atualizou');
  // Executa em toda re-renderização
});

useEffect(() => {
  console.log('userId mudou');
  // Executa quando userId muda
}, [userId]);
```

**3. Unmounting (Desmontagem):**
Componente é removido do DOM.

```javascript
useEffect(() => {
  const subscription = subscribe();

  // Função de cleanup - executa quando componente desmonta
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

**Modelo Mental:**

```
Montagem: Componente nasce → Estado inicializa → Renderiza → DOM atualiza → Efeitos executam

Atualização: Props/Estado mudam → Re-renderiza → DOM atualiza → Efeitos executam

Desmontagem: Cleanup executa → Componente removido do DOM
```

#### Estado: Memória Persistente

Estado é o que torna componentes **dinâmicos** - permite que respondam a interações e mudanças.

**Conceito Fundamental:** Estado é **privado e gerenciado pelo componente**. Cada instância de componente tem seu próprio estado isolado.

```javascript
function Counter() {
  const [count, setCount] = useState(0); // Estado privado

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

// Duas instâncias, dois estados independentes
<Counter /> // count próprio
<Counter /> // count próprio diferente
```

**Por baixo dos panos:** React mantém uma "fiber" (estrutura de dados) para cada instância de componente. Essa fiber armazena:
- Props atuais
- Estado atual
- Lista de hooks usados
- Referência ao elemento DOM

Quando `setCount` é chamado, React:
1. Atualiza estado na fiber
2. Agenda re-renderização do componente
3. Re-executa função do componente com novo estado
4. Compara novo output com anterior (reconciliação)
5. Atualiza apenas partes do DOM que mudaram

### Princípios e Conceitos Subjacentes

#### 1. UI Como Função de Estado

Este é o princípio mais fundamental: **a UI é uma projeção do estado**.

```javascript
// Estado é a fonte de verdade
const state = {
  user: { name: 'Maria', loggedIn: true },
  cart: [{ id: 1, product: 'Livro' }],
  notifications: 3
};

// UI é calculada a partir do estado
function App({ state }) {
  return (
    <div>
      {state.user.loggedIn ? (
        <UserDashboard user={state.user} cart={state.cart} />
      ) : (
        <LoginForm />
      )}
      <NotificationBadge count={state.notifications} />
    </div>
  );
}
```

**Implicações:**

- **Determinismo:** Mesmo estado sempre produz mesma UI
- **Debugging:** Inspecione estado para entender UI
- **Time-travel:** Salve snapshots de estado, recrie UI exata de qualquer momento
- **Testabilidade:** Teste componente passando estados conhecidos, verifique output

**Contraste com Manipulação Imperativa:**

```javascript
// Imperativo (sem React) - múltiplas fontes de verdade
if (user.loggedIn) {
  $('#dashboard').show();
  $('#login').hide();
} else {
  $('#dashboard').hide();
  $('#login').show();
}
// Estado está em user.loggedIn E no DOM (visibilidade de elementos)
// Podem dessincronizar!

// Declarativo (React) - única fonte de verdade
{user.loggedIn ? <Dashboard /> : <Login />}
// Estado está apenas em user.loggedIn
// DOM reflete automaticamente
```

#### 2. Composição de Componentes

React favorece **composição sobre herança**. Ao invés de herdar comportamento de classes base, você compõe componentes.

**Padrões de Composição:**

**A. Contenção (Children):**

```javascript
function Dialog({ title, children }) {
  return (
    <div className="dialog">
      <h1>{title}</h1>
      <div className="dialog-content">
        {children}
      </div>
    </div>
  );
}

// Uso - composição flexível
<Dialog title="Confirmação">
  <p>Tem certeza?</p>
  <Button>Sim</Button>
  <Button>Não</Button>
</Dialog>
```

**B. Especialização:**

```javascript
// Componente genérico
function Button({ variant = 'default', children, ...props }) {
  return <button className={`btn btn-${variant}`} {...props}>{children}</button>;
}

// Especializações através de composição
const PrimaryButton = (props) => <Button variant="primary" {...props} />;
const DangerButton = (props) => <Button variant="danger" {...props} />;

// Ao invés de herança:
// class PrimaryButton extends Button { ... } ❌
```

**C. Slots (Múltiplos Pontos de Inserção):**

```javascript
function Layout({ header, sidebar, content, footer }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <div className="main">
        <aside>{sidebar}</aside>
        <main>{content}</main>
      </div>
      <footer>{footer}</footer>
    </div>
  );
}

// Uso
<Layout
  header={<Header />}
  sidebar={<Navigation />}
  content={<Dashboard />}
  footer={<Footer />}
/>
```

**Por que Composição é Superior:**

- **Flexibilidade:** Combinar componentes de formas não previstas originalmente
- **Clareza:** Relacionamentos explícitos, sem hierarquias escondidas
- **Reutilização:** Pequenos componentes compostos de múltiplas formas

#### 3. Unidirecionalidade de Dados

Dados fluem **para baixo** (pais → filhos via props), eventos fluem **para cima** (filhos → pais via callbacks).

```javascript
function Parent() {
  const [data, setData] = useState('inicial');

  return (
    <Child
      data={data}                           // Dados ↓
      onDataChange={(newData) => setData(newData)} // Eventos ↑
    />
  );
}

function Child({ data, onDataChange }) {
  return (
    <div>
      <p>{data}</p>
      <button onClick={() => onDataChange('alterado')}>Alterar</button>
    </div>
  );
}
```

**Benefícios:**

- **Rastreabilidade:** Sempre sabe de onde vêm dados (acima na árvore)
- **Previsibilidade:** Componentes filhos não podem "surpreender" pais com mudanças
- **Debugging:** Fluxo de dados tem direção clara

**Trade-off:** Props drilling - passar props através de muitos níveis intermediários pode ser verboso. Solução: Context API ou estado global.

#### 4. Reconciliação e Re-renderização

Entender quando e como componentes re-renderizam é crucial.

**Gatilhos de Re-renderização:**

1. **Estado muda:** `setState` foi chamado
2. **Props mudam:** Pai passou novas props
3. **Pai re-renderiza:** Por padrão, filhos também re-renderizam
4. **Context muda:** Componente consome context que atualizou

**O Processo:**

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  console.log('Renderizando!'); // Executa a cada render

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

// Fluxo quando botão é clicado:
// 1. setCount(1) chamado
// 2. React agenda re-render
// 3. Função Counter executa novamente (console.log aparece)
// 4. Novo VDOM criado com count=1
// 5. Diff com VDOM anterior (count=0)
// 6. Apenas texto do <p> atualizado no DOM real
```

**Otimização:**

```javascript
// React.memo previne re-renders se props não mudaram
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // Só re-renderiza se 'data' mudar
  return <div>{/* renderização custosa */}</div>;
});
```

### Relação com Outros Conceitos da Linguagem

#### Closures JavaScript

Componentes funcionais dependem de **closures** para capturar props e estado:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    // Esta função "captura" count do momento da renderização
    setTimeout(() => {
      console.log(count); // Valor de count quando handleClick foi criada
    }, 3000);
  }

  // Cada renderização cria novo handleClick com novo "snapshot" de count
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

**Conceito:** Cada renderização cria uma nova "versão" de funções internas, cada uma capturando valores daquele momento. Isso explica comportamentos como "stale closures".

#### Imutabilidade

React assume que dados (props, estado) são **imutáveis**:

```javascript
// ❌ Mutação - React pode não detectar
const [items, setItems] = useState([1, 2, 3]);
items.push(4); // Muta array
setItems(items); // Mesma referência - React pula re-render

// ✅ Imutável - React detecta mudança
setItems([...items, 4]); // Novo array
```

**Por que:** React usa comparação por referência (`===`) para detectar mudanças. Mutações mantêm mesma referência.

#### Módulos ES6

Componentes são naturalmente organizados como módulos:

```javascript
// Button.jsx
export default function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

// App.jsx
import Button from './Button';

function App() {
  return <Button onClick={handleClick}>Clique</Button>;
}
```

**Benefício:** Cada componente em seu arquivo, importado onde necessário. Facilita code splitting e tree shaking.

### Modelo Mental para Compreensão

#### Pense em Componentes como "Funções de Renderização"

```
                  +----------------+
   Props -------> |   Componente   | -------> Elementos React
   Estado ------> | (Função Pura)  |          (Descrição de UI)
                  +----------------+
```

Cada renderização é uma **nova execução completa** da função. Tudo dentro do componente executa do zero:

```javascript
function Example() {
  console.log('Executando!'); // Roda toda renderização
  const value = Math.random(); // Novo valor toda renderização
  const [state] = useState(0); // Hook "lembra" estado entre renders

  return <div>{value}</div>;
}
```

#### Modelo de "Snapshot no Tempo"

Cada renderização é um **snapshot** - valores de props/estado naquele momento:

```javascript
function Message() {
  const [text, setText] = useState('Olá');

  function handleSend() {
    setTimeout(() => {
      alert(text); // Captura 'text' do momento que handleSend foi criada
    }, 3000);
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Enviar em 3s</button>
    </div>
  );
}
```

Se você clicar "Enviar" com texto "Olá", depois mudar para "Tchau", o alert mostrará "Olá" (valor quando clicou), não "Tchau".

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica de Componentes

#### Componentes Funcionais

```javascript
// Sintaxe básica - function declaration
function Welcome(props) {
  return <h1>Olá, {props.name}!</h1>;
}

// Sintaxe com destructuring de props (idiomático)
function Welcome({ name }) {
  return <h1>Olá, {name}!</h1>;
}

// Arrow function
const Welcome = ({ name }) => {
  return <h1>Olá, {name}!</h1>;
};

// Arrow function com return implícito (concisa)
const Welcome = ({ name }) => <h1>Olá, {name}!</h1>;

// Com props padrão
function Welcome({ name = 'Visitante' }) {
  return <h1>Olá, {name}!</h1>;
}
```

**Análise:** Todas são equivalentes funcionalmente. Escolha é estilística:
- **Function declaration:** Boa para debugging (nome aparece em stack traces)
- **Arrow function:** Concisa, popular em codebases modernas
- **Destructuring:** Torna props explícitas, melhora legibilidade

#### Estado em Componentes Funcionais

```javascript
import { useState } from 'react';

function Counter() {
  // useState retorna [valorAtual, funçãoAtualizadora]
  const [count, setCount] = useState(0); // 0 = valor inicial

  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>

      {/* Forma funcional - usa valor mais recente */}
      <button onClick={() => setCount(prev => prev + 1)}>Incrementar (funcional)</button>

      {/* Múltiplos estados */}
      <MultipleStates />
    </div>
  );
}

function MultipleStates() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');

  // Cada estado independente
}
```

**Fundamentos:**

**1. useState é um Hook:** Conecta componente funcional ao sistema de estado do React

**2. Retorna Tupla:** Array com duas posições - `[valor, setter]`

**3. Atualizações Disparam Re-render:** Chamar `setCount` agenda re-renderização

**4. Estado Persiste:** Entre renderizações, estado é mantido pelo React (na fiber)

**5. Cada Instância = Estado Próprio:**
```javascript
<Counter /> // count próprio
<Counter /> // count próprio independente
```

#### Props: Interface de Componentes

```javascript
// Props básicas
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.email}</p>
    </div>
  );
}

// Destructuring (idiomático)
function UserCard({ name, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}

// Props com valores padrão
function UserCard({ name = 'Anônimo', email = 'sem@email.com' }) {
  return <div>{name} - {email}</div>;
}

// Spread props (repassar todas)
function Wrapper(props) {
  return <ChildComponent {...props} />;
}

// Combinar spread com override
function EnhancedButton(props) {
  return <Button {...props} className="enhanced" />;
  // className="enhanced" sobrescreve props.className se existir
}

// Children - prop especial
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Uso
<Card title="Meu Card">
  <p>Conteúdo pode ser qualquer coisa</p>
  <button>Botão</button>
</Card>
```

**Conceitos Profundos:**

**Imutabilidade de Props:**
```javascript
function Component(props) {
  // ❌ NUNCA modifique props
  props.name = 'Novo'; // Erro conceitual
  props.items.push(1); // Erro conceitual

  // ✅ Props são read-only
  const newName = props.name.toUpperCase(); // Criar derivação é ok
}
```

**Props Podem Ser Qualquer Tipo:**
```javascript
<Component
  string="texto"
  number={42}
  boolean={true}
  array={[1, 2, 3]}
  object={{ key: 'value' }}
  function={() => console.log('callback')}
  element={<div>JSX</div>}
/>
```

**Children É Flexível:**
```javascript
// String
<Component>Texto</Component>

// Elementos
<Component><p>Parágrafo</p></Component>

// Array
<Component>
  <p>Um</p>
  <p>Dois</p>
</Component>

// Função (render prop)
<Component>
  {(data) => <div>{data}</div>}
</Component>
```

### Composição Avançada

#### Compound Components

Componentes que trabalham juntos:

```javascript
// Tabs.jsx
const TabsContext = React.createContext();

function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children }) {
  return <div className="tabs-list">{children}</div>;
}

function TabsTrigger({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={activeTab === value ? 'active' : ''}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className="tabs-content">{children}</div>;
}

// Exportar como compound
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;

// Uso - API declarativa e flexível
<Tabs defaultValue="home">
  <Tabs.List>
    <Tabs.Trigger value="home">Home</Tabs.Trigger>
    <Tabs.Trigger value="profile">Perfil</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="home">Conteúdo Home</Tabs.Content>
  <Tabs.Content value="profile">Conteúdo Perfil</Tabs.Content>
</Tabs>
```

**Benefícios:**
- **Flexibilidade:** Consumidor controla estrutura
- **Contexto Implícito:** Sub-componentes "conversam" via Context
- **API Declarativa:** Lê como configuração, não código

#### Render Props

Passar função como children ou prop para controle total:

```javascript
function DataProvider({ render, endpoint }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [endpoint]);

  return render({ data, loading });
}

// Uso - consumidor decide como renderizar
<DataProvider
  endpoint="/api/users"
  render={({ data, loading }) => (
    loading ? <Spinner /> : <UserList users={data} />
  )}
/>

// Ou via children (mais idiomático)
<DataProvider endpoint="/api/users">
  {({ data, loading }) => (
    loading ? <Spinner /> : <UserList users={data} />
  )}
</DataProvider>
```

**Conceito:** Inversão de controle - DataProvider gerencia estado, consumidor controla renderização.

### Padrões de Estado

#### Estado Derivado

Estado que pode ser calculado de outros estados ou props:

```javascript
function ShoppingCart({ items }) {
  // ❌ Não armazene estado derivado
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0));
  }, [items]); // Complexo e pode dessincronizar

  // ✅ Calcule diretamente
  const total = items.reduce((sum, item) => sum + item.price, 0);
  // Recalcula toda renderização, mas é rápido e sempre correto

  return <div>Total: {total}</div>;
}
```

**Princípio:** Se pode ser calculado de props/estado, calcule. Não duplique em estado.

#### Estado Controlado vs Não Controlado

**Controlado:** Componente pai gerencia estado:

```javascript
function Parent() {
  const [value, setValue] = useState('');

  return <Input value={value} onChange={setValue} />;
}

function Input({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
```

**Não Controlado:** Componente gerencia próprio estado:

```javascript
function Input() {
  const [value, setValue] = useState('');

  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

**Trade-off:**
- **Controlado:** Pai tem controle total (validação, reset, etc.), mas mais boilerplate
- **Não Controlado:** Mais simples, mas pai não tem acesso ao valor

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Componentes

**Sempre.** Toda aplicação React é composta de componentes. A questão é **como organizar**.

#### Granularidade de Componentes

**Componentes Muito Grandes (Anti-padrão):**

```javascript
// ❌ Componente fazendo muitas coisas
function Dashboard() {
  // 500+ linhas de código
  // Gerencia autenticação + dados + UI + navegação
  // Difícil testar, reutilizar, manter
}
```

**Componentes Muito Pequenos (Também problemático):**

```javascript
// ❌ Granularidade excessiva
function Label({ text }) {
  return <label>{text}</label>;
}
// Overhead sem benefício - label é primitiva suficiente
```

**Granularidade Ideal (Princípio de Responsabilidade Única):**

```javascript
// ✅ Cada componente tem responsabilidade clara
function Dashboard() {
  return (
    <Layout>
      <DashboardHeader />
      <DashboardStats />
      <DashboardCharts />
    </Layout>
  );
}

function DashboardHeader() {
  // Apenas header
}

function DashboardStats() {
  // Apenas estatísticas
}
```

**Regra prática:** Extraia componente quando:
- Responsabilidade é clara e nomeável
- Pode ser reutilizado (atual ou futuramente)
- Componente pai está grande/complexo demais

### Cenários de Estado

#### Estado Local vs Global

**Estado Local:** Apenas um componente precisa:

```javascript
function Accordion() {
  const [isOpen, setIsOpen] = useState(false); // Só Accordion precisa
  // ...
}
```

**Estado Global:** Múltiplos componentes em partes diferentes da árvore precisam:

```javascript
// Context API
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header /> {/* Acessa user */}
      <Sidebar /> {/* Acessa user */}
      <MainContent /> {/* Acessa user */}
    </UserContext.Provider>
  );
}
```

**Critério:** Estado deve viver no ancestral comum mais próximo dos componentes que o precisam.

#### UI Baseada em Estado Complexo

Para estado complexo, `useReducer` pode ser melhor que múltiplos `useState`:

```javascript
// Estado complexo
function TodoApp() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function todosReducer(state, action) {
    switch (action.type) {
      case 'ADD':
        return [...state, action.todo];
      case 'DELETE':
        return state.filter(t => t.id !== action.id);
      case 'TOGGLE':
        return state.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        );
      default:
        return state;
    }
  }

  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD', todo: newTodo })}>
        Adicionar
      </button>
      {/* ... */}
    </div>
  );
}
```

**Benefício:** Lógica de atualização centralizada, ações descritivas, mais fácil testar.

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

#### 1. Props Drilling

Passar props através de muitos níveis:

```javascript
// ❌ Props drilling - verbose e frágil
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} />
    </Sidebar>
  </Layout>
</App>
```

**Problema:** Componentes intermediários (Layout, Sidebar) não usam `user`, apenas repassam. Mudanças em user afetam muitos componentes.

**Soluções:**
- Context API
- Estado global (Redux, Zustand)
- Composição (children ao invés de props)

#### 2. Performance com Re-renders

Por padrão, quando pai re-renderiza, todos filhos também:

```javascript
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ExpensiveChild /> {/* Re-renderiza mesmo sem props mudarem */}
    </div>
  );
}
```

**Mitigação:**
```javascript
const ExpensiveChild = React.memo(function ExpensiveChild() {
  // Só re-renderiza se props mudarem
});
```

#### 3. Estado vs Props - Fonte de Verdade

Duplicar dados em estado e props pode causar inconsistências:

```javascript
// ❌ Anti-padrão
function Component({ initialValue }) {
  const [value, setValue] = useState(initialValue);
  // Se initialValue mudar, value não atualiza!
}

// ✅ Decisão clara
// Opção 1: Totalmente controlado (estado no pai)
function Component({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}

// Opção 2: Totalmente não controlado (estado interno)
function Component({ defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  // defaultValue é apenas inicial, depois componente gerencia
}
```

### Armadilhas Comuns

#### Armadilha 1: Mutação de Props/Estado

```javascript
// ❌ Mutação
function TodoList({ todos }) {
  todos.push(newTodo); // Muta prop!
  return <ul>...</ul>;
}

const [items, setItems] = useState([]);
items.push(1); // Muta estado!
setItems(items); // React não detecta
```

#### Armadilha 2: Efeitos Colaterais em Renderização

```javascript
// ❌ Side effect durante render
function Component() {
  fetch('/api/data'); // Executa toda renderização!
  return <div>...</div>;
}

// ✅ Use useEffect
function Component() {
  useEffect(() => {
    fetch('/api/data');
  }, []); // Executa uma vez
}
```

#### Armadilha 3: Keys Instáveis

```javascript
// ❌ Key não estável
{items.map((item, index) => (
  <div key={Math.random()}>{item}</div> // Nova key toda render!
))}

// ✅ Key estável e única
{items.map(item => (
  <div key={item.id}>{item}</div>
))}
```

---

## 🔗 Interconexões Conceituais

### Relação com JSX

Componentes retornam JSX, que é transpilado para `React.createElement`:

```javascript
function Button({ children }) {
  return <button>{children}</button>;
}

// Transpila para
function Button({ children }) {
  return React.createElement('button', null, children);
}
```

### Relação com Hooks

Hooks dão "superpoderes" a componentes funcionais:
- **useState:** Adiciona estado
- **useEffect:** Adiciona side effects
- **useContext:** Consome contexto
- **Custom Hooks:** Compõem lógica reutilizável

### Relação com Virtual DOM

Componentes produzem elementos React que formam Virtual DOM. Reconciliação compara VDOMs para atualizar DOM real eficientemente.

### Progressão de Aprendizado

```
Componentes Básicos (props → JSX)
         ↓
    Estado (useState)
         ↓
    Composição e Children
         ↓
    Efeitos (useEffect)
         ↓
    Padrões (Container/Presentational, Compound, etc.)
         ↓
    Otimização (memo, useMemo, useCallback)
         ↓
    Estado Global (Context, Redux)
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

Após dominar componentes e estado:

1. **Hooks Avançados:** useReducer, useRef, useCallback, useMemo
2. **Performance:** Entender re-renders, memoização
3. **Padrões de Composição:** Compound components, render props
4. **Estado Global:** Context API, Redux, Zustand
5. **Formulários:** Controlled components, bibliotecas (React Hook Form)

### Conceitos Construídos Sobre Este

- **Custom Hooks:** Extrair lógica de componentes
- **Server Components:** Componentes que executam no servidor
- **Concurrent Features:** useTransition, useDeferredValue

---

## 📚 Conclusão

Componentes e UI baseada em estado são os pilares fundamentais do React. Componentes permitem construir complexidade através de composição de unidades simples e reutilizáveis. Estado torna componentes dinâmicos, respondendo a interações.

A filosofia de **UI = f(state)** simplifica drasticamente o modelo mental: ao invés de gerenciar transições imperativas entre estados de UI, você simplesmente declara como a UI deve parecer para cada estado, e React garante sincronização.

Dominar componentização - granularidade adequada, composição efetiva, separação de responsabilidades - é dominar a arte de construir aplicações React escaláveis e manuteníveis.
