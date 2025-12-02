# ReactDOM e createRoot (React 18+): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**ReactDOM** é o pacote que conecta o React ao DOM do navegador. Enquanto `react` contém a lógica central de componentes, Virtual DOM e reconciliação (agnóstico de plataforma), `react-dom` é o **renderizador específico para web** que traduz elementos React em nós DOM reais.

**createRoot** é a API moderna (React 18+) para criar uma "raiz" React - o ponto de entrada onde uma árvore React é montada no DOM. Substitui a API legada `ReactDOM.render` com suporte a funcionalidades concorrentes.

```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**Conceito:** ReactDOM é a **ponte entre mundo React (Virtual DOM) e mundo browser (DOM real)**. createRoot estabelece essa ponte.

### Contexto Histórico e Motivação

**React 0.x-17: ReactDOM.render**

```javascript
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));
```

**Limitações:**
- Renderização síncrona e bloqueante
- Sem suporte a funcionalidades concorrentes
- API menos flexível para múltiplas roots

**React 18: createRoot**

```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**Benefícios:**
- **Concurrent Rendering:** Renderizações interruptíveis
- **Automatic Batching:** Agrupamento de atualizações em todos os contextos
- **Transitions:** Atualizações de baixa prioridade
- **Suspense:** Melhor suporte para carregamento assíncrono

**Motivação:** createRoot foi necessário para habilitar features modernas sem quebrar código legado (ReactDOM.render ainda funciona mas sem features novas).

### Problema Fundamental que Resolve

ReactDOM resolve o **problema de renderizar componentes React no browser**.

React core (`react`) é **plataforma-agnóstico** - pode renderizar para:
- DOM (ReactDOM)
- Mobile nativo (React Native)
- Canvas (React Canvas)
- Terminal (Ink)
- VR (React VR)

ReactDOM especializa React para web, lidando com:
- Criação/atualização de nós DOM
- Event handling (eventos sintéticos)
- Sincronização de propriedades DOM
- Server-side rendering (hidratar HTML do servidor)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Separação de Responsabilidades:** react (core) + react-dom (renderizador)
2. **createRoot:** API moderna para raízes concorrentes
3. **Hydration:** Conectar HTML do servidor a React no cliente
4. **Event System:** Delegação de eventos sintéticos
5. **Backward Compatibility:** ReactDOM.render ainda funciona (legacy)

### Pilares Fundamentais

- **ReactDOM = Renderizador:** Traduz VDOM em DOM
- **Root = Ponto de Entrada:** Onde React monta na página
- **Concurrent Mode:** createRoot habilita concorrência
- **Hydrate:** Para SSR (server-side rendering)
- **Unmount:** Limpar quando não mais necessário

---

## 🧠 Fundamentos Teóricos

### ReactDOM: O Renderizador Web

ReactDOM fornece funções para trabalhar com DOM:

```javascript
// Renderização
import { createRoot } from 'react-dom/client';

// Server-side rendering
import { renderToString } from 'react-dom/server';

// Hydration (conectar HTML do servidor)
import { hydrateRoot } from 'react-dom/client';

// Portal (renderizar fora da hierarquia)
import { createPortal } from 'react-dom';

// Flush de atualizações (forçar síncrono)
import { flushSync } from 'react-dom';
```

**Separação Conceitual:**

```
react (core)
  - createElement
  - Component
  - Hooks (useState, useEffect, etc.)
  - Reconciliação (algoritmo)

react-dom (renderizador)
  - createRoot (montar em DOM)
  - hydrateRoot (hidratar SSR)
  - createPortal (renderizar fora da árvore)
  - Eventos sintéticos
```

### createRoot: Anatomia

```javascript
import { createRoot } from 'react-dom/client';

// 1. Criar root
const container = document.getElementById('root');
const root = createRoot(container);

// 2. Renderizar
root.render(<App />);

// 3. Atualizar (re-renderizar)
root.render(<App newProp="value" />);

// 4. Desmontar
root.unmount();
```

**Objeto Root:**

```javascript
const root = createRoot(container);

// Métodos disponíveis:
root.render(reactNode)  // Renderizar/atualizar
root.unmount()          // Desmontar e limpar
```

**Opções (segundo parâmetro):**

```javascript
const root = createRoot(container, {
  // Callback quando erro em boundary
  onRecoverableError: (error) => console.error(error),

  // ID para hydration (SSR)
  identifierPrefix: 'my-app'
});
```

### Processo de Renderização

```javascript
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// Internamente:

// 1. React cria Fiber root (estrutura interna)
const fiberRoot = {
  containerInfo: document.getElementById('root'),
  current: null, // Árvore atual
  // ...
};

// 2. Schedule de trabalho
// React agenda renderização de <App />

// 3. Render Phase (interruptível)
// - Executa componente App
// - Constrói árvore VDOM
// - Calcula efeitos

// 4. Commit Phase (síncrona)
// - ReactDOM cria nós DOM reais
// - Insere no container
// - Executa efeitos (useLayoutEffect, useEffect)

// 5. DOM final visível
```

### Concurrent Features com createRoot

**Automatic Batching:**

```javascript
// React 18 com createRoot
const root = createRoot(container);
root.render(<App />);

function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    // Agrupado automaticamente mesmo em assíncrono
    setTimeout(() => {
      setCount(c => c + 1);
      setFlag(f => !f);
    }, 1000);
    // Apenas 1 re-render
  }
}
```

**Transitions:**

```javascript
import { useTransition } from 'react';

function App() {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  function handleChange(e) {
    // Urgente - alta prioridade
    setInput(e.target.value);

    // Não urgente - pode ser interrompido
    startTransition(() => {
      setList(generateList(e.target.value));
    });
  }

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {isPending && <Spinner />}
      <List items={list} />
    </div>
  );
}
```

---

## 🔍 Análise Conceitual Profunda

### Legacy vs Modern API

**Legacy (React 17):**

```javascript
import ReactDOM from 'react-dom';

// Renderizar
ReactDOM.render(<App />, document.getElementById('root'));

// Atualizar
ReactDOM.render(<App newProp="value" />, document.getElementById('root'));

// Desmontar
ReactDOM.unmountComponentAtNode(document.getElementById('root'));
```

**Modern (React 18):**

```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

// Renderizar
root.render(<App />);

// Atualizar
root.render(<App newProp="value" />);

// Desmontar
root.unmount();
```

**Diferenças Funcionais:**

```javascript
// createRoot habilita:

// 1. Automatic batching em async
setTimeout(() => {
  setState1(x);
  setState2(y);
}, 1000);
// Legacy: 2 re-renders
// createRoot: 1 re-render

// 2. Transitions
startTransition(() => setState(x));
// Legacy: não funciona
// createRoot: funciona

// 3. Suspense para data fetching
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
// Legacy: suporte limitado
// createRoot: suporte completo
```

### Hydration: SSR para Cliente

**Server-Side Rendering:**

```javascript
// server.js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
// HTML string gerado no servidor

res.send(`
  <!DOCTYPE html>
  <html>
    <body>
      <div id="root">${html}</div>
      <script src="/client.js"></script>
    </body>
  </html>
`);
```

**Client-Side Hydration:**

```javascript
// client.js
import { hydrateRoot } from 'react-dom/client';

const container = document.getElementById('root');

// Hydrate: conecta HTML estático a React interativo
hydrateRoot(container, <App />);

// React assume controle do HTML existente
// Adiciona event listeners
// Torna interativo sem recriar DOM
```

**Diferença: render vs hydrate:**

```javascript
// createRoot + render: cria DOM do zero
const root = createRoot(container);
root.render(<App />);
// Container é esvaziado e recriado

// hydrateRoot: reutiliza DOM existente
hydrateRoot(container, <App />);
// Container mantém HTML, React adiciona interatividade
```

### Portals: Renderizar Fora da Hierarquia

```javascript
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">
      {children}
    </div>,
    document.getElementById('modal-root') // Diferente da root principal
  );
}

function App() {
  return (
    <div id="app">
      <h1>My App</h1>
      <Modal>
        <p>Este conteúdo renderiza fora de #app</p>
      </Modal>
    </div>
  );
}

// DOM resultante:
// <div id="app">
//   <h1>My App</h1>
// </div>
// <div id="modal-root">
//   <div class="modal">
//     <p>Este conteúdo renderiza fora de #app</p>
//   </div>
// </div>
```

**Uso:** Modais, tooltips, dropdowns que precisam escapar overflow:hidden.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar createRoot

**Sempre em apps novos React 18+:**

```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**Migração gradual de apps legados:**

```javascript
// Pode misturar legacy e modern
ReactDOM.render(<LegacyPart />, legacyContainer); // Legacy mode
createRoot(modernContainer).render(<ModernPart />); // Concurrent mode
```

### Quando Usar hydrateRoot

**Apps com SSR (Next.js, Remix, etc):**

```javascript
// Cliente recebe HTML do servidor
hydrateRoot(document, <App />);
```

### Quando Usar createPortal

**UI que precisa escapar contentor:**

```javascript
// Modal, Tooltip, Dropdown
function Modal() {
  return createPortal(
    <div className="modal-backdrop">...</div>,
    document.body
  );
}
```

---

## ⚠️ Limitações e Considerações

### Armadilhas Comuns

**Armadilha 1: Chamar createRoot Múltiplas Vezes**

```javascript
// ❌ Cria múltiplas roots no mesmo container
const root1 = createRoot(container);
const root2 = createRoot(container); // Sobrescreve root1

// ✅ Reutilizar mesma root
const root = createRoot(container);
root.render(<App />);
root.render(<UpdatedApp />); // Atualiza mesma root
```

**Armadilha 2: Hydration Mismatch**

```javascript
// Server renderiza:
<div>Count: 0</div>

// Cliente tenta hydrate com:
<div>Count: 1</div>

// React mostra warning: mismatch!
// Precisa renderizar mesmo estado no servidor e cliente
```

**Armadilha 3: Não Desmontar Roots**

```javascript
// ❌ Memory leak se não desmontar
const root = createRoot(container);
root.render(<App />);
// ... app não mais necessária, mas root permanece

// ✅ Desmontar quando não mais necessário
root.unmount();
```

---

## 🔗 Interconexões Conceituais

### Relação com Virtual DOM

ReactDOM traduz Virtual DOM (representação em memória) para DOM real.

### Relação com Reconciliação

Reconciliação calcula diferenças. ReactDOM aplica essas diferenças ao DOM.

### Relação com Eventos

ReactDOM implementa sistema de eventos sintéticos que normaliza eventos do browser.

---

## 🚀 Evolução e Próximos Conceitos

### React 19 e Além

**Server Components:**

```javascript
// Componente que roda apenas no servidor
async function ServerComponent() {
  const data = await fetchFromDB();
  return <div>{data}</div>;
}
```

**Streaming SSR:**

```javascript
// Enviar HTML incrementalmente
import { renderToPipeableStream } from 'react-dom/server';

renderToPipeableStream(<App />).pipe(res);
```

---

## 📚 Conclusão

ReactDOM conecta React ao DOM. createRoot é entrada moderna que habilita funcionalidades concorrentes. Entender essa separação (react = core, react-dom = renderizador) clarifica arquitetura do React.

Para apps novos, use createRoot. Para SSR, use hydrateRoot. Para UI fora da hierarquia, use createPortal. Simples, mas poderoso.
