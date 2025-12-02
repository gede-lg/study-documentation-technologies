# Atributos em JSX: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

Atributos em JSX são **propriedades especificadas em elementos JSX** que definem características, comportamentos e dados associados a elementos React. Conceitualmente, atributos JSX são a manifestação sintática de **props** (properties) - o mecanismo fundamental de parametrização e comunicação de componentes React.

Na essência, um atributo JSX é uma **expressão de configuração** que mapeia diretamente para propriedades de objetos JavaScript, transformando-se em pares chave-valor no objeto props passado para componentes ou em atributos DOM para elementos nativos.

### Contexto Histórico e Motivação

Quando JSX foi criado, a equipe do React enfrentou um desafio: como expressar propriedades de elementos de forma que fosse familiar (parecida com HTML) mas correta em JavaScript? HTML usa atributos como `<img src="foto.jpg" alt="Descrição">`, mas isso levanta questões técnicas em JS.

A solução foi criar uma sintaxe de atributos que **parece HTML** mas **obedece regras JavaScript**. Isso significa:
- Nomes de atributos seguem convenções JavaScript (camelCase, não hyphen-case)
- Valores podem ser literais string ou expressões JavaScript
- Atributos conflitantes com palavras reservadas JS têm nomes alternativos

A motivação foi **familiaridade sem sacrificar correção técnica**. Desenvolvedores reconhecem imediatamente `<div className="box">` como similar a HTML, mas o nome `className` evita conflito com a palavra reservada `class` do JavaScript.

### Problema Fundamental que Resolve

Atributos em JSX resolvem múltiplos problemas fundamentais:

**1. Parametrização de Componentes:** Sem atributos, componentes seriam estáticos. Atributos permitem passar dados e configuração, tornando componentes reutilizáveis.

**2. Ponte entre JSX e JavaScript:** Atributos permitem que valores JavaScript (variáveis, expressões) sejam passados para elementos, conectando lógica e apresentação.

**3. Type Safety:** Com TypeScript, atributos podem ser validados estaticamente, detectando erros de tipo antes da execução.

**4. Explicitação de Interface:** Atributos documentam implicitamente a interface de um componente - que dados ele espera e requer.

**5. Composabilidade:** Atributos permitem que componentes sejam configurados de formas infinitas sem modificar implementação interna.

### Importância no Ecossistema

Atributos são **fundamentais** para o modelo de componentes do React:

- **Mecanismo Primário de Comunicação:** Props (vindos de atributos) são como componentes pai comunicam com filhos
- **Fluxo de Dados Unidirecional:** Atributos implementam o fluxo top-down de dados
- **Reutilização:** Mesmos componentes com atributos diferentes = comportamentos diferentes
- **Abstração:** Atributos são a interface pública de componentes, escondendo detalhes internos

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Atributos como Props:** Em componentes, atributos JSX tornam-se props
2. **Sintaxe Dual:** Strings literais vs expressões JavaScript
3. **Convenções de Nomenclatura:** camelCase para eventos, diferenças de HTML
4. **Tipos de Valores:** Qualquer tipo JavaScript pode ser passado
5. **Atributos Especiais:** `key`, `ref`, `children` têm significados especiais

### Pilares Fundamentais

- **Pareamento Nome-Valor:** Cada atributo é um par `nome={valor}` ou `nome="valor"`
- **Transformação em Props:** Atributos compilam para objeto props
- **Compatibilidade DOM:** Para elementos nativos, mapeiam para atributos DOM
- **Expressividade:** Qualquer expressão JavaScript é permitida como valor
- **Imutabilidade:** Props resultantes são read-only no componente receptor

### Visão Geral das Nuances

- **String Literal vs Expressão:** `className="box"` vs `className={variavelClasse}`
- **Atributos Booleanos:** Presença implica `true`, ausência implica `false`
- **Spread Attributes:** `{...props}` passa múltiplos atributos de uma vez
- **Atributos Reservados:** Alguns nomes diferem de HTML (`className`, `htmlFor`)
- **Event Handlers:** Atributos como `onClick`, `onChange` aceitam funções

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Para compreender atributos profundamente, é essencial entender a transformação de JSX para JavaScript e como atributos se tornam props.

#### Transformação de Atributos

Quando você escreve atributos em JSX:

```javascript
// JSX que você escreve
<div className="container" id="main" data-testid="wrapper">
  Conteúdo
</div>

// É transformado em (React 17+)
jsx('div', {
  className: 'container',
  id: 'main',
  'data-testid': 'wrapper',
  children: 'Conteúdo'
});

// Versão anterior (React 16)
React.createElement(
  'div',
  {
    className: 'container',
    id: 'main',
    'data-testid': 'wrapper'
  },
  'Conteúdo'
);
```

**Conceito crucial:** Atributos se tornam **propriedades de um objeto**. O segundo argumento de `createElement` é um objeto onde cada atributo é uma propriedade.

#### Atributos em Componentes Customizados

```javascript
// Componente customizado
function Card({ title, content, footer }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{content}</p>
      <footer>{footer}</footer>
    </div>
  );
}

// Uso com atributos
<Card title="Meu Card" content="Texto aqui" footer="Rodapé" />

// Transforma em
jsx(Card, {
  title: 'Meu Card',
  content: 'Texto aqui',
  footer: 'Rodapé'
});

// Card recebe props
function Card(props) {
  props.title;   // "Meu Card"
  props.content; // "Texto aqui"
  props.footer;  // "Rodapé"
}
```

**Fundamento teórico:** Atributos JSX são a **sintaxe declarativa** para construir o objeto props. O componente recebe esse objeto e pode usá-lo para determinar comportamento e aparência.

### Princípios e Conceitos Subjacentes

#### 1. Props como Interface Imutável

Props resultantes de atributos são **imutáveis** no componente receptor:

```javascript
function Component({ title }) {
  // ❌ NUNCA modifique props
  title = "Novo Título";  // Viola princípios React

  // ✅ Use estado local se precisar modificar
  const [localTitle, setLocalTitle] = useState(title);

  return <h1>{localTitle}</h1>;
}
```

**Conceito fundamental:** Props fluem unidirecionalmente (parent → child). Filhos **não devem** modificar props. Se filho precisa comunicar mudança ao pai, faz via callbacks passados como props.

#### 2. Qualquer Tipo JavaScript É Válido

Diferente de HTML (que só aceita strings), atributos JSX aceitam **qualquer tipo JavaScript**:

```javascript
<Component
  // String
  nome="Carlos"

  // Number
  idade={25}

  // Boolean
  ativo={true}

  // Array
  items={[1, 2, 3]}

  // Object
  usuario={{ nome: "Ana", idade: 30 }}

  // Function
  onClick={() => console.log("Clicado")}

  // Null/Undefined
  opcionalData={null}

  // JSX Element
  header={<h1>Título</h1>}
/>
```

**Implicação conceitual:** Isso torna componentes extremamente flexíveis. Você pode passar estruturas de dados complexas, callbacks, até outros componentes como props.

#### 3. Convenções de Nomenclatura

Atributos JSX seguem convenções JavaScript, não HTML:

**camelCase para eventos e APIs DOM:**
```javascript
// HTML usa lowercase
<button onclick="handleClick()">

// JSX usa camelCase
<button onClick={handleClick}>
```

**Nomes alternativos para palavras reservadas:**
```javascript
// HTML
<div class="box"></div>
<label for="input"></label>

// JSX
<div className="box"></div>
<label htmlFor="input"></label>
```

**Por quê:** `class` e `for` são palavras reservadas em JavaScript. JSX usa nomes válidos em JS.

#### 4. Atributos Booleanos

Atributos booleanos têm sintaxe especial:

```javascript
// Presença do atributo = true
<input disabled />
<input disabled={true} />  // Equivalente

// Explicitamente false
<input disabled={false} />

// Condicional
<input disabled={isLoading} />
```

**Conceito:** Em HTML, presença do atributo indica true (`<input disabled>`). JSX mantém essa convenção mas permite expressões explícitas.

### Relação com Outros Conceitos da Linguagem

#### Destructuring de Props

Atributos frequentemente são recebidos via destructuring:

```javascript
// Sem destructuring
function Card(props) {
  return <div>{props.title}</div>;
}

// Com destructuring (comum)
function Card({ title, content, footer }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{content}</p>
      <footer>{footer}</footer>
    </div>
  );
}
```

**Benefício conceitual:** Destructuring torna explícito quais props o componente usa, melhorando legibilidade.

#### Spread Operator

Operador spread permite passar múltiplos atributos:

```javascript
const commonProps = {
  className: "btn",
  disabled: false,
  type: "button"
};

// Spread dos atributos
<button {...commonProps}>Clique</button>

// Equivale a
<button className="btn" disabled={false} type="button">
  Clique
</button>

// Pode combinar com atributos individuais
<button {...commonProps} className="btn-primary">
  {/* className é sobrescrito */}
</button>
```

**Conceito avançado:** Spread é útil para:
- Repassar props de pai para filho
- Aplicar conjuntos comuns de props
- Criar componentes wrapper

### Modelo Mental para Compreensão

#### Atributos como Argumentos Nomeados

Pense em atributos como **argumentos nomeados de função**:

```javascript
// Chamar função com argumentos nomeados (conceitual)
criarCard(title: "Título", content: "Texto", footer: "Rodapé")

// JSX com atributos (sintaxe real)
<Card title="Título" content="Texto" footer="Rodapé" />
```

Ambos passam parâmetros para uma entidade (função ou componente) de forma nomeada e clara.

#### Atributos como Configuração

Atributos **configuram** o comportamento/aparência do componente:

```javascript
// Mesmo componente, configurações diferentes
<Button size="small" color="blue" onClick={handler1} />
<Button size="large" color="red" variant="outline" onClick={handler2} />
```

Componente é a "máquina", atributos são os "botões e alavancas" que controlam seu comportamento.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica: Tipos de Atributos

#### Strings Literais

A forma mais simples: valor string direto:

```javascript
<div className="container" id="main-content" title="Título">
  Conteúdo
</div>

// Aspas duplas ou simples
<div className='container' />
<div className="container" />  // Ambas válidas
```

**Análise conceitual:** Quando o valor é string literal conhecida em tempo de desenvolvimento, use aspas. Não precisa chaves.

#### Expressões JavaScript

Valores dinâmicos usam chaves:

```javascript
const classe = "container";
const idElement = "main-content";
const isActive = true;

<div
  className={classe}
  id={idElement}
  data-active={isActive}
  style={{ color: 'red' }}
>
  Conteúdo
</div>
```

**Fundamento:** Chaves `{}` indicam "isto é JavaScript". O valor da expressão é passado como prop.

#### Atributos Booleanos

Três formas de especificar booleanos:

```javascript
// 1. Presença implícita (true)
<input disabled />
<input required />

// 2. Explícito true
<input disabled={true} />

// 3. Explícito false
<input disabled={false} />

// 4. Condicional
<input disabled={isLoading || hasError} />
```

**Conceito:** Atributos booleanos são úteis para flags de configuração. Presença sem valor é açúcar sintático para `={true}`.

#### Atributos Numéricos

Números devem usar chaves:

```javascript
<div>
  {/* ❌ Errado - tratado como string "25" */}
  <input maxLength="25" />

  {/* ✅ Correto - número 25 */}
  <input maxLength={25} />

  {/* Cálculos */}
  <div style={{ width: baseWidth * 2 }}>
</div>
```

**Implicação:** Embora muitos atributos DOM aceitem strings numéricas ("25"), é melhor usar números reais quando apropriado para correção semântica.

### Atributos em Elementos Nativos vs Componentes

#### Elementos HTML Nativos

Para elementos nativos, atributos mapeiam para atributos/propriedades DOM:

```javascript
<img
  src="foto.jpg"     // Mapeia para img.src
  alt="Descrição"    // Mapeia para img.alt
  width={300}        // Mapeia para img.width
  loading="lazy"     // Mapeia para img.loading
/>

<input
  type="text"        // input.type
  value={inputValue} // input.value
  onChange={handler} // Adiciona event listener
  placeholder="Digite aqui"
/>
```

**Conceito crucial:** React traduz atributos JSX para operações DOM apropriadas. Alguns são atributos (`setAttribute`), outros são propriedades (`element.property = value`).

#### Componentes Customizados

Para componentes, atributos viram props sem restrição:

```javascript
function ProductCard({
  product,      // Objeto
  onAddToCart,  // Função
  showPrice,    // Boolean
  variant       // String
}) {
  return (
    <div className={`card card-${variant}`}>
      <h3>{product.name}</h3>
      {showPrice && <p>R$ {product.price}</p>}
      <button onClick={() => onAddToCart(product)}>
        Adicionar
      </button>
    </div>
  );
}

// Uso
<ProductCard
  product={{ name: "Camiseta", price: 50 }}
  onAddToCart={handleAddToCart}
  showPrice={true}
  variant="compact"
/>
```

**Análise profunda:** Componentes customizados podem receber **qualquer** atributo. Não há restrição como em elementos DOM. Você define a interface via props que o componente espera.

### Atributos Especiais do React

#### key

Atributo especial para elementos em listas:

```javascript
{items.map(item => (
  <div key={item.id}>
    {item.name}
  </div>
))}
```

**Conceito:** `key` não é passada como prop. É usada internamente por React para reconciliação. Ajuda React identificar quais elementos mudaram, foram adicionados ou removidos.

**Por quê importante:** Sem keys, React pode reutilizar elementos incorretamente quando ordem muda, causando bugs sutis.

#### ref

Referência ao elemento DOM ou instância de componente:

```javascript
function Component() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return <input ref={inputRef} />;
}
```

**Conceito:** `ref` permite acesso direto ao elemento DOM subjacente, quebrando a abstração declarativa quando necessário (focus, measurements, animações imperativas).

#### children

Prop especial que contém conteúdo entre tags:

```javascript
<Card>
  Este texto vira props.children
</Card>

// Equivale a
<Card children="Este texto vira props.children" />

// Mas children pode ser qualquer coisa
<Card>
  <h1>Título</h1>
  <p>Parágrafo</p>
</Card>
```

**Conceito avançado:** `children` é prop implícita. Conteúdo entre tags JSX é automaticamente passado como `children` prop.

### Passagem de Funções como Atributos

#### Event Handlers

Padrão comum: passar funções para event handlers:

```javascript
function Component() {
  const handleClick = (event) => {
    console.log("Clicado!", event);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submetido");
  };

  return (
    <div>
      <button onClick={handleClick}>Clique</button>

      {/* Inline arrow function */}
      <button onClick={() => console.log("Inline")}>
        Inline
      </button>

      {/* Com argumentos */}
      <button onClick={(e) => handleClick(e)}>
        Com args
      </button>

      <form onSubmit={handleSubmit}>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
```

**Análise conceitual:**
- Funções são first-class citizens, podem ser passadas como props
- React anexará como event listeners apropriados
- Arrow functions inline criam nova função cada render (consideração de performance)

#### Callbacks para Comunicação Parent-Child

```javascript
function ParentComponent() {
  const [message, setMessage] = useState("");

  const handleChildMessage = (msg) => {
    setMessage(msg);
  };

  return (
    <div>
      <p>Mensagem do filho: {message}</p>
      <ChildComponent onSendMessage={handleChildMessage} />
    </div>
  );
}

function ChildComponent({ onSendMessage }) {
  return (
    <button onClick={() => onSendMessage("Olá do filho!")}>
      Enviar mensagem
    </button>
  );
}
```

**Princípio fundamental:** Dados fluem down (via props), eventos fluem up (via callbacks). Callbacks passados como atributos permitem filhos comunicarem com pais.

### Spread Attributes

#### Repassando Props

Padrão para componentes wrapper:

```javascript
function FancyButton({ children, ...restProps }) {
  return (
    <button className="fancy-button" {...restProps}>
      <span className="button-content">{children}</span>
    </button>
  );
}

// Uso
<FancyButton onClick={handler} disabled={isLoading} type="submit">
  Clique Aqui
</FancyButton>

// Todos os atributos (onClick, disabled, type) são repassados ao button
```

**Conceito:** `...restProps` captura todos os atributos não-destructured e repassa ao elemento filho. Útil para criar wrappers sem precisar listar cada prop possível.

#### Ordem de Precedência

```javascript
const defaultProps = {
  className: "btn",
  type: "button",
  disabled: false
};

// Props depois de spread sobrescrevem
<button {...defaultProps} className="btn-primary">
  {/* className será "btn-primary", não "btn" */}
</button>

// Props antes de spread são sobrescritas
<button className="btn-primary" {...defaultProps}>
  {/* className será "btn" (de defaultProps) */}
</button>
```

**Regra:** Último atributo com mesmo nome vence. Isso permite definir defaults com spread e sobrescrever quando necessário.

### Atributos de Dados Customizados

#### data-* Attributes

HTML permite atributos customizados com prefixo `data-`:

```javascript
<div
  data-testid="user-card"
  data-user-id={user.id}
  data-role={user.role}
>
  {user.name}
</div>
```

**Conceito:** Atributos `data-*` são úteis para:
- Testing (seletores em testes automatizados)
- CSS targeting
- Metadados para scripts

**Diferença de componentes customizados:** Em componentes custom, qualquer nome de atributo é válido sem prefixo.

#### aria-* Attributes

Atributos de acessibilidade:

```javascript
<button
  aria-label="Fechar modal"
  aria-expanded={isExpanded}
  aria-controls="menu-1"
>
  <span aria-hidden="true">×</span>
</button>
```

**Importância:** ARIA attributes melhoram acessibilidade para screen readers e tecnologias assistivas.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Diferentes Tipos de Atributos

#### Strings Literais

**Quando:** Valores fixos, conhecidos em tempo de desenvolvimento.

```javascript
<div className="fixed-class" role="button" aria-label="Fechar">
```

**Raciocínio:** Simples, legível, sem overhead de expressões.

#### Expressões JavaScript

**Quando:** Valores dinâmicos, calculados, dependentes de estado/props.

```javascript
<div
  className={isActive ? "active" : "inactive"}
  style={{ width: `${progress}%` }}
>
```

**Raciocínio:** UI precisa reagir a mudanças de dados.

#### Spread Attributes

**Quando:** Criar componentes wrapper, repassar props unknown.

```javascript
function Wrapper({ children, ...restProps }) {
  return <div className="wrapper" {...restProps}>{children}</div>;
}
```

**Raciocínio:** Flexibilidade sem listar cada prop possível.

### Padrões Conceituais e Filosofias de Uso

#### Props Explícitas vs Rest Props

**Padrão:** Destructure props usadas explicitamente, capture resto com spread:

```javascript
function Button({
  variant,      // Usado internamente
  size,         // Usado internamente
  children,     // Usado internamente
  ...restProps  // Repassado ao button
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      {...restProps}
    >
      {children}
    </button>
  );
}
```

**Filosofia:** Explicitação do que o componente controla vs o que repassa transparentemente.

#### Props Drilling vs Context

**Problema:** Passar props por múltiplos níveis:

```javascript
// Props drilling (tedioso)
<GrandParent user={user}>
  <Parent user={user}>
    <Child user={user}>
      {user.name}
    </Child>
  </Parent>
</GrandParent>

// Solução: Context API
const UserContext = createContext();

<UserContext.Provider value={user}>
  <GrandParent>
    <Parent>
      <Child>
        {/* Acessa user via useContext */}
      </Child>
    </Parent>
  </GrandParent>
</UserContext.Provider>
```

**Filosofia:** Props são ótimas para comunicação direta. Para dados globais ou profundos, use Context.

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

#### 1. Props São Imutáveis

**Limitação:** Componente não pode modificar props recebidas.

```javascript
function Component({ title }) {
  // ❌ Viola princípios
  title = "Novo título";

  // ✅ Use estado se precisar modificar
  const [localTitle, setLocalTitle] = useState(title);
}
```

**Por quê:** Fluxo unidirecional de dados. Modificar props causaria inconsistências difíceis de debugar.

#### 2. Naming Conflicts

**Limitação:** Alguns nomes diferem de HTML devido a JavaScript.

```javascript
// HTML
<div class="box" for="input"></div>

// JSX
<div className="box" htmlFor="input"></div>
```

**Mitigação:** Memorize diferenças comuns. Linters avisam quando usar nomes incorretos.

#### 3. Performance com Inline Functions

**Limitação:** Inline arrow functions em atributos criam nova função cada render.

```javascript
// Nova função cada render
<button onClick={() => handleClick(id)}>
  Clique
</button>

// Pode causar re-renders desnecessários em componentes memorizados
const MemoizedChild = React.memo(Child);

<MemoizedChild onClick={() => doSomething()} />
// onClick sempre tem nova identidade, então memo não previne re-render
```

**Solução:** Use `useCallback` quando necessário:

```javascript
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

<MemoizedChild onClick={handleClick} />
```

### Armadilhas Comuns

#### Armadilha 1: Esquecer Chaves para Números

```javascript
// ❌ Tratado como string
<input maxLength="100" />

// ✅ Correto - número
<input maxLength={100} />
```

#### Armadilha 2: Confundir Atributos HTML com JSX

```javascript
// ❌ Não funciona em JSX
<div class="box"></div>

// ✅ JSX correto
<div className="box"></div>
```

#### Armadilha 3: Sobrescrever com Spread

```javascript
// className será "default", não "custom"!
<div className="custom" {...{ className: "default" }}>
```

**Ordem importa:** Último atributo vence.

---

## 🔗 Interconexões Conceituais

### Relação com Props

Atributos **são** a sintaxe para props. Atributos JSX compilam para objeto props.

### Relação com Componentes

Componentes são parametrizados via atributos. Sem atributos, componentes seriam estáticos.

### Relação com Estado

Estado frequentemente determina valores de atributos:

```javascript
const [isActive, setIsActive] = useState(false);

<div className={isActive ? "active" : "inactive"}>
```

### Progressão de Aprendizado

```
Atributos Básicos (strings)
       ↓
Expressões como Atributos
       ↓
Atributos Booleanos e Numéricos
       ↓
Funções como Atributos (event handlers)
       ↓
Spread Attributes
       ↓
Props Typing (TypeScript)
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

Após dominar atributos básicos:

1. **TypeScript:** Tipar props/atributos
2. **PropTypes:** Validação de props em runtime
3. **Default Props:** Valores padrão para atributos opcionais
4. **Compound Components:** Padrões avançados de comunicação via props

### Conceitos que Se Constroem

#### PropTypes

```javascript
import PropTypes from 'prop-types';

function Button({ size, color, onClick, children }) {
  return <button className={`btn-${size} btn-${color}`} onClick={onClick}>
    {children}
  </button>;
}

Button.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
  color: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node
};

Button.defaultProps = {
  color: 'blue',
  size: 'medium'
};
```

#### TypeScript

```typescript
interface ButtonProps {
  size: 'small' | 'medium' | 'large';
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}

function Button({ size, color = 'blue', onClick, children }: ButtonProps) {
  return <button className={`btn-${size} btn-${color}`} onClick={onClick}>
    {children}
  </button>;
}
```

---

## 📚 Conclusão

Atributos em JSX são o **mecanismo fundamental de parametrização e configuração** de componentes React. Eles representam a ponte sintática entre a declaração visual (JSX) e os dados dinâmicos (JavaScript), permitindo que componentes sejam reutilizáveis, configuráveis e componíveis.

Dominar atributos vai além de sintaxe - é sobre compreender:

- **Props como Interface:** Atributos definem a API pública de componentes
- **Fluxo de Dados:** Atributos implementam comunicação parent-child
- **Tipagem e Validação:** Atributos podem ser validados para robustez
- **Composição:** Spread e rest props permitem composição flexível

Atributos são onipresentes no código React. Todo componente não-trivial recebe e/ou passa atributos. Fluência com atributos é fluência com o modelo de componentes do React.

A jornada começa com strings simples e evolui para passar funções, objetos complexos, elementos JSX como props. Com prática, você projetará interfaces de componentes intuitivas e expressivas através de atributos bem nomeados e tipados.


---

# Tabela Completa de Atributos JSX (Organizada por Categoria)

## 1️⃣ ATRIBUTOS DE IDENTIFICAÇÃO E REFERÊNCIA

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**id**|id|Identificador único do elemento|`<div id="main">Conteúdo</div>`|
|**name**|name|Nome do elemento (importante em formulários)|`<input name="username" />`|
|**className**|class|Aplicar classes CSS ao elemento|`<div className="container">Conteúdo</div>`|
|**title**|title|Tooltip/dica ao passar mouse|`<div title="Informação">Elemento</div>`|

---

## 2️⃣ EVENT HANDLERS (Manipuladores de Eventos)

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**onClick**|onclick|Executar função ao clicar no elemento|`<button onClick={handleClick}>Clique</button>`|
|**onDoubleClick**|ondblclick|Executar função ao duplo clique|`<div onDoubleClick={handleDblClick}>Click</div>`|
|**onMouseEnter**|onmouseenter|Executar função ao mouse entrar no elemento|`<div onMouseEnter={handleEnter}>Hover</div>`|
|**onMouseLeave**|onmouseleave|Executar função ao mouse sair do elemento|`<div onMouseLeave={handleLeave}>Hover</div>`|
|**onChange**|onchange|Executar função ao mudar valor (inputs)|`<input onChange={handleChange} />`|
|**onFocus**|onfocus|Executar função ao elemento receber foco|`<input onFocus={handleFocus} />`|
|**onBlur**|onblur|Executar função ao elemento perder foco|`<input onBlur={handleBlur} />`|
|**onKeyDown**|onkeydown|Executar função ao pressionar uma tecla|`<input onKeyDown={handleKeyDown} />`|
|**onKeyUp**|onkeyup|Executar função ao soltar uma tecla|`<input onKeyUp={handleKeyUp} />`|
|**onKeyPress**|onkeypress|Executar função ao pressionar caractere|`<input onKeyPress={handleKeyPress} />`|
|**onSubmit**|onsubmit|Executar função ao enviar formulário|`<form onSubmit={handleSubmit}>...</form>`|

---

## 3️⃣ ESTILOS E APARÊNCIA

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**style**|style (inline)|Aplicar estilos CSS inline como objeto|`<div style={{color: 'red', fontSize: '16px'}}>Texto</div>`|
|**width**|width|Largura do elemento (img, canvas, etc)|`<img width={300} />`|
|**height**|height|Altura do elemento (img, canvas, etc)|`<img height={200} />`|
|**hidden**|hidden|Ocultar elemento|`<div hidden>Oculto</div>`|

---

## 4️⃣ ATRIBUTOS DE FORMULÁRIOS

### Gerais

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**action**|action|URL para submissão de formulário|`<form action="/api/submit">...</form>`|
|**method**|method|Método HTTP de formulário|`<form method="POST">...</form>`|
|**encType**|enctype|Tipo de codificação de formulário|`<form encType="multipart/form-data">...</form>`|
|**noValidate**|novalidate|Desabilitar validação HTML5 do formulário|`<form noValidate>...</form>`|
|**htmlFor**|for|Associar labels a inputs (em formulários)|`<label htmlFor="email">Email:</label>`|

### Inputs

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**type**|type|Tipo de input (text, number, email, etc)|`<input type="email" />`|
|**value**|value|Valor de inputs, selects e textareas|`<input value={inputValue} />`|
|**defaultValue**|value (inicial)|Valor inicial de input não controlado|`<input defaultValue="Padrão" />`|
|**placeholder**|placeholder|Texto de dica em inputs|`<input placeholder="Digite seu nome" />`|
|**required**|required|Campo obrigatório em formulário|`<input required />`|
|**disabled**|disabled|Desabilitar elemento (input, button, etc)|`<button disabled>Botão desabilitado</button>`|
|**readOnly**|readonly|Campo somente leitura|`<input readOnly />`|
|**autoComplete**|autocomplete|Autocompletar sugestões (on/off)|`<input autoComplete="on" />`|
|**autoFocus**|autofocus|Focar o elemento automaticamente ao carregar|`<input autoFocus />`|
|**maxLength**|maxlength|Comprimento máximo de caracteres|`<input maxLength={50} />`|
|**minLength**|minlength|Comprimento mínimo de caracteres|`<input minLength={5} />`|
|**pattern**|pattern|Regex para validação de input|`<input pattern="[A-Z]{3}" />`|
|**inputMode**|inputmode|Tipo de teclado em mobile|`<input inputMode="numeric" />`|
|**list**|list|Associa input a datalist|`<input list="meusList" />`|
|**accept**|accept|Tipos de arquivo aceitos em input file|`<input type="file" accept=".jpg,.png" />`|
|**capture**|capture|Usar câmera/microfone em input|`<input type="file" capture="environment" />`|

### Números

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**min**|min|Valor mínimo de input numérico|`<input type="number" min={0} />`|
|**max**|max|Valor máximo de input numérico|`<input type="number" max={100} />`|
|**step**|step|Incremento em inputs numéricos|`<input type="number" step={0.1} />`|

### Checkbox e Radio

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**checked**|checked|Estado do checkbox ou radio button|`<input type="checkbox" checked={isChecked} />`|
|**defaultChecked**|checked (inicial)|Checkbox/radio pré-marcado não controlado|`<input type="checkbox" defaultChecked />`|

### Textarea

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**rows**|rows|Número de linhas em textarea|`<textarea rows={5}></textarea>`|
|**cols**|cols|Número de colunas em textarea|`<textarea cols={40}></textarea>`|
|**spellCheck**|spellcheck|Ativar verificação ortográfica|`<textarea spellCheck="true"></textarea>`|

### Select

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**multiple**|multiple|Permitir múltiplas seleções em select|`<select multiple><option>Opção</option></select>`|
|**selected**|selected|Opção pré-selecionada em select|`<option selected>Opção 1</option>`|

### Form Buttons

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**form**|form|Associa elemento ao formulário|`<button form="meuForm">Enviar</button>`|
|**formAction**|formaction|URL para envio do formulário|`<button formAction="/submit">Enviar</button>`|
|**formEncType**|formenctype|Tipo de codificação (multipart/form-data)|`<button formEncType="multipart/form-data">Enviar</button>`|
|**formMethod**|formmethod|Método HTTP (GET, POST)|`<button formMethod="POST">Enviar</button>`|
|**formNoValidate**|formnovalidate|Ignorar validação de formulário|`<button formNoValidate>Skip Validation</button>`|
|**formTarget**|formtarget|Onde abrir resposta do formulário|`<button formTarget="_blank">Enviar</button>`|

---

## 5️⃣ ATRIBUTOS DE LINKS

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**href**|href|URL destino de links|`<a href="https://exemplo.com">Link</a>`|
|**target**|target|Define onde o link abre (_blank, _self)|`<a href="url" target="_blank">Link</a>`|
|**rel**|rel|Relação entre documento e recurso|`<a href="url" rel="noopener noreferrer">Link</a>`|
|**download**|download|Baixar arquivo ao invés de navegar|`<a href="arquivo.pdf" download>Download</a>`|

---

## 6️⃣ ATRIBUTOS DE MÍDIA (Imagens, Áudio e Vídeo)

### Imagens

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**src**|src|Fonte/URL de imagens ou scripts|`<img src="imagem.jpg" />`|
|**alt**|alt|Texto alternativo para imagens|`<img alt="Descrição da imagem" />`|
|**crossOrigin**|crossorigin|Política CORS para recursos|`<img crossOrigin="anonymous" src="url" />`|

### Áudio e Vídeo

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**autoPlay**|autoplay|Reproduzir áudio/vídeo automaticamente|`<video autoPlay>...</video>`|
|**controls**|controls|Mostrar controles de áudio/vídeo|`<video controls>...</video>`|
|**loop**|loop|Repetir áudio/vídeo continuamente|`<video loop>...</video>`|
|**muted**|muted|Silenciar áudio/vídeo|`<video muted>...</video>`|
|**preload**|preload|Estratégia de pré-carregamento (auto, none)|`<video preload="auto">...</video>`|
|**poster**|poster|Imagem de capa do vídeo|`<video poster="capa.jpg">...</video>`|

---

## 7️⃣ ATRIBUTOS DE TABELAS

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**cellPadding**|cellpadding|Espaçamento interno de células em tabelas|`<table cellPadding={10}>...</table>`|
|**cellSpacing**|cellspacing|Espaçamento entre células em tabelas|`<table cellSpacing={5}>...</table>`|
|**colSpan**|colspan|Célula ocupa múltiplas colunas|`<td colSpan={2}>Célula</td>`|
|**rowSpan**|rowspan|Célula ocupa múltiplas linhas|`<td rowSpan={2}>Célula</td>`|
|**headers**|headers|Associa célula aos headers|`<td headers="col1">Dados</td>`|
|**scope**|scope|Define escopo de header (col, row)|`<th scope="col">Cabeçalho</th>`|

---

## 8️⃣ ATRIBUTOS DE INTERNACIONALIZAÇÃO E ACESSIBILIDADE

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**lang**|lang|Idioma do conteúdo|`<div lang="pt-BR">Português</div>`|
|**dir**|dir|Direção do texto (ltr, rtl, auto)|`<div dir="rtl">Texto árabe</div>`|
|**role**|role|Define papel semântico (para acessibilidade)|`<div role="button">Botão</div>`|
|**tabIndex**|tabindex|Ordem de navegação com TAB|`<button tabIndex={1}>Primeiro</button>`|
|**aria-***|aria-*|Atributos de acessibilidade ARIA|`<button aria-label="Fechar">X</button>`|

---

## 9️⃣ ATRIBUTOS CUSTOMIZADOS E METADADOS

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**data-***|data-*|Atributo customizado para armazenar dados|`<div data-id="123">Conteúdo</div>`|
|**charSet**|charset|Codificação de caracteres|`<meta charSet="UTF-8" />`|

---

## 🔟 ATRIBUTOS DE CONTEÚDO EDITÁVEL

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**contentEditable**|contenteditable|Permitir edição do conteúdo|`<div contentEditable>Editar</div>`|
|**draggable**|draggable|Permitir arrastar elemento|`<div draggable={true}>Arraste-me</div>`|

---

## 1️⃣1️⃣ ATRIBUTOS DE SVG E GRÁFICOS

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**viewBox**|viewBox|Define área visível de SVG|`<svg viewBox="0 0 100 100">...</svg>`|

---

## 1️⃣2️⃣ ATRIBUTOS DE SCRIPTS E RECURSOS

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**async**|async|Carregar script assincronamente|`<script async src="script.js"></script>`|
|**defer**|defer|Executar script após carregar página|`<script defer src="script.js"></script>`|

---

## 1️⃣3️⃣ ATRIBUTOS REACT ESPECÍFICOS

|Atributo JSX|Atributo HTML Referente|Finalidade|Sintaxe de Uso|
|---|---|---|---|
|**key**|—|Identificador único de elementos em listas|`{items.map(item => <div key={item.id}>{item.name}</div>)}`|
|**ref**|—|Referência direta ao DOM (React específico)|`<input ref={inputRef} />`|
|**children**|—|Conteúdo dentro do componente (React)|`<Component>{children}</Component>`|
|**dangerouslySetInnerHTML**|innerHTML|Inserir HTML diretamente (use com cuidado!)|`<div dangerouslySetInnerHTML={{__html: htmlString}} />`|

---

## Notas Importantes

### 1. **CamelCase vs lowercase**

Em JSX, os atributos seguem a convenção **camelCase** ao contrário do HTML que usa **lowercase** com hífen. Exemplos:

- `class` → `className`
- `for` → `htmlFor`
- `onclick` → `onClick`
- `contenteditable` → `contentEditable`
- `autocomplete` → `autoComplete`

### 2. **Valores em Expressões JavaScript**

Para usar variáveis ou expressões JavaScript como valores de atributos, use chaves:

```jsx
<input value={minhaVariavel} />
<div className={isActive ? 'ativo' : 'inativo'}>Conteúdo</div>
<img src={baseUrl + '/imagem.jpg'} />
```

### 3. **Atributos Booleanos**

Para atributos booleanos, você pode omitir o valor (padrão é `true`) ou ser explícito:

```jsx
<button disabled>Botão</button>
<button disabled={true}>Botão</button>
<input autoFocus /> {/* Equivalente a autoFocus={true} */}
```

### 4. __Atributos Customizados (data-_ e aria-_)**

React suporta nativamente atributos `data-*` e `aria-*`:

```jsx
<div data-id="123" data-status="ativo">Elemento</div>
<button aria-label="Fechar menu" aria-expanded={isOpen}>Menu</button>
```

### 5. **Style como Objeto**

O atributo `style` em JSX recebe um objeto JavaScript, não uma string:

```jsx
<div style={{
  color: 'red',
  fontSize: '20px',
  backgroundColor: '#f0f0f0'
}}>Texto estilizado</div>
```

### 6. **Event Handlers**

Event handlers em JSX devem ser funções, não strings:

```jsx
// ✅ Correto
<button onClick={handleClick}>Clique</button>

// ❌ Incorreto
<button onClick="handleClick()">Clique</button>
```

### 7. **Atributos Específicos do React**

- **key**: Usado em listas para identificar elementos de forma única
- **ref**: Acessa diretamente a instância do DOM
- **children**: Conteúdo aninhado dentro de componentes
- **dangerouslySetInnerHTML**: Insere HTML diretamente (cuidado com XSS!)

---

## Exemplos Práticos

### Exemplo 1: Formulário Completo

```jsx
function FormularioExample() {
  const [dados, setDados] = React.useState({ nome: '', email: '' });

  return (
    <form onSubmit={(e) => { e.preventDefault(); console.log(dados); }}>
      <label htmlFor="nome">Nome:</label>
      <input
        id="nome"
        type="text"
        name="nome"
        value={dados.nome}
        onChange={(e) => setDados({...dados, nome: e.target.value})}
        required
        maxLength={100}
        placeholder="Digite seu nome"
      />

      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        name="email"
        value={dados.email}
        onChange={(e) => setDados({...dados, email: e.target.value})}
        required
        autoComplete="email"
      />

      <button type="submit">Enviar</button>
    </form>
  );
}
```

### Exemplo 2: Elemento com Estilos Dinâmicos

```jsx
function ElementoComEstilos({ ativo, tamanho }) {
  return (
    <div
      style={{
        backgroundColor: ativo ? '#00aa00' : '#cccccc',
        padding: '20px',
        fontSize: `${tamanho}px`,
        borderRadius: '5px'
      }}
      className="elemento"
      title={ativo ? 'Ativo' : 'Inativo'}
    >
      Conteúdo
    </div>
  );
}
```

### Exemplo 3: Lista com Keys

```jsx
function ListaExemplo({ itens }) {
  return (
    <ul>
      {itens.map((item) => (
        <li key={item.id} data-id={item.id}>
          {item.nome}
        </li>
      ))}
    </ul>
  );
}
```

---

**Tabela compilada em: Novembro de 2025**