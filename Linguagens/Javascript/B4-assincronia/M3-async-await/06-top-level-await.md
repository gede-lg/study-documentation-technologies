# Top-level Await: Uso em Módulos ES, Casos de Uso, Limitações

## 🎯 Introdução e Definição

### Definição Conceitual

**Top-level await** permite usar `await` **diretamente no escopo global de um módulo ES**, sem precisar envolver em async function. Isso significa que o módulo pode **pausar sua execução** aguardando operações assíncronas antes de completar sua inicialização.

**Antes de top-level await (até ES2020):**

```javascript
// ❌ SyntaxError - await só em async function
const dados = await fetch('/config').then(r => r.json());

// ✅ Workaround - IIFE async
(async () => {
    const dados = await fetch('/config').then(r => r.json());
    // Usar dados...
})();
```

**Com top-level await (ES2022):**

```javascript
// ✅ Direto no top-level do módulo!
const dados = await fetch('/config').then(r => r.json());

export const config = dados;
```

**Módulo inteiro pausa** até `await` completar.

**Restrições críticas:**

- **Só em módulos ES:** `type="module"` em HTML ou `.mjs` em Node.js
- **Não em scripts clássicos:** CommonJS, scripts não-module não suportam
- **Bloqueia importadores:** Módulos que importam este também aguardam

### Contexto Histórico e Motivação

**Era pré-top-level await:** Inicialização assíncrona era complicada

```javascript
// config.js - workaround com IIFE
let config;

(async () => {
    const response = await fetch('/config.json');
    config = await response.json();
})();

export { config };  // Problema: config é undefined inicialmente!
```

**Problema:** Módulos que importam `config` podem usá-lo antes de ser carregado.

**Solução anterior:** Exportar Promise

```javascript
// config.js
export const configPromise = fetch('/config.json').then(r => r.json());

// app.js
import { configPromise } from './config.js';
const config = await configPromise;  // Precisa await no consumidor
```

Transfere responsabilidade para quem importa.

**Top-level await (ES2022):** Solução elegante

```javascript
// config.js
const response = await fetch('/config.json');
const config = await response.json();

export { config };  // Garantido estar pronto quando importado!

// app.js
import { config } from './config.js';
console.log(config);  // Sempre pronto!
```

Módulo **não completa inicialização** até await resolver.

**Motivações principais:**

1. **Inicialização assíncrona:** Carregar config, conectar DB, etc.
2. **Simplicidade:** Elimina IIFE e Promises explícitas
3. **Garantias:** Módulo só "pronto" quando await completa
4. **Dependências assíncronas:** Módulos podem depender de operações assíncronas
5. **Dynamic imports:** Carregar módulos condicionalmente

### Problema Fundamental que Resolve

**Problema:** Módulos precisam executar código assíncrono **antes de serem usáveis**.

**Cenário:** Módulo de configuração que busca dados de servidor

```javascript
// ❌ ANTES - Problema de timing
// config.js
let config = null;

fetch('/config.json')
    .then(r => r.json())
    .then(data => { config = data; });

export { config };

// app.js
import { config } from './config.js';
console.log(config);  // null! Ainda não carregou
```

**Race condition** - código usa antes de estar pronto.

**✅ Solução - Top-level await:**

```javascript
// config.js
const response = await fetch('/config.json');
const config = await response.json();

export { config };

// app.js
import { config } from './config.js';
console.log(config);  // SEMPRE pronto! Import aguardou
```

Importação **bloqueia** até módulo estar pronto.

### Importância no Ecossistema

Top-level await é **importante** porque:

- **Módulos modernos:** Padrão em aplicações ES module-based
- **Inicialização limpa:** Código assíncrono de setup simplificado
- **SSR/SSG:** Frameworks modernos (Next.js, SvelteKit) usam
- **Tooling:** Bundlers (Webpack 5+, Vite, Rollup) suportam
- **Node.js:** Nativo desde v14.8 (com `--harmony-top-level-await`)
- **Browsers:** Chrome 89+, Firefox 89+, Safari 15+

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Só em módulos ES:** `.mjs` ou `type="module"`
2. **Bloqueia importadores:** Quem importa aguarda módulo completar
3. **Async module:** Módulo com top-level await é "async module"
4. **Module graph:** Afeta ordem de execução de dependências
5. **Performance:** Pode atrasar carregamento da aplicação

### Pilares Fundamentais

- **Inicialização determinística:** Módulo pronto quando exporta
- **Simplicidade sintática:** Elimina IIFE async
- **Composicionalidade:** Módulos async podem importar outros módulos async
- **Restrição de ambiente:** Precisa suporte a ES modules
- **Blocking behavior:** Importadores aguardam

### Visão Geral das Nuances

- **Dynamic imports:** `import()` com top-level await
- **Fallback:** Como lidar com falha no top-level await
- **Performance:** Impacto em carregamento de aplicação
- **Testing:** Módulos com top-level await em testes
- **Compatibilidade:** Transpilação para ambientes legados

---

## �🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Module Loading com Top-level Await

Quando módulo tem top-level await:

1. **Parser identifica:** "Este é async module"
2. **Execução inicia:** Código roda até encontrar `await`
3. **Módulo pausa:** Aguarda Promise resolver
4. **Importadores bloqueados:** Outros módulos que importam este aguardam
5. **Execução retoma:** Após await, continua até fim
6. **Módulo completo:** Só então importadores podem usar exports

```javascript
// db.js - async module
console.log('Conectando ao DB...');
const conexao = await conectarDB();
console.log('DB conectado!');

export { conexao };

// app.js
console.log('Iniciando app...');
import { conexao } from './db.js';  // Aguarda db.js completar!
console.log('App pronto!');

// Output:
// Iniciando app...
// Conectando ao DB...
// DB conectado!
// App pronto!
```

#### Module Graph Execution Order

Top-level await afeta **ordem de execução**:

```javascript
// config.js
console.log('1. Config iniciando');
const config = await carregarConfig();
console.log('3. Config pronto');
export { config };

// db.js
console.log('2. DB iniciando (enquanto config aguarda)');
import { config } from './config.js';  // Aguarda config completar
console.log('4. DB usando config');

// app.js
import { config } from './config.js';
import { db } from './db.js';
console.log('5. App pronto');
```

Execução **paralela até import**, então **serializada**.

### Princípios Conceituais

#### Async Module

Módulo com top-level await é **async module**:

```javascript
// Async module - tem await no top-level
const dados = await fetch('/dados').then(r => r.json());
export { dados };
```

**Características:**
- Execução pode **pausar**
- Importadores **aguardam** antes de executar
- Pode **falhar** (Promise rejeitada)

#### Blocking Imports

Importar async module **bloqueia** importador:

```javascript
// slow-module.js
await delay(5000);  // 5 segundos
export const valor = 42;

// app.js
console.log('Antes do import');
import { valor } from './slow-module.js';  // Aguarda 5s!
console.log('Depois do import:', valor);
```

Importador **espera** módulo estar pronto.

#### Falha em Inicialização

Se top-level await **rejeitar**, módulo **falha** ao carregar:

```javascript
// api.js
const dados = await fetch('/api/critico').then(r => r.json());
// Se fetch falhar, módulo inteiro falha!

export { dados };

// app.js
try {
    await import('./api.js');  // Pode lançar exceção
} catch (erro) {
    console.error('Falha ao carregar api.js:', erro);
}
```

---

## 🔍 Análise Conceitual Profunda

### Uso Básico - Carregar Configuração

```javascript
// config.js
const response = await fetch('/config.json');
const config = await response.json();

export default config;

// app.js
import config from './config.js';
console.log('Tema:', config.tema);
```

Configuração **sempre pronta** quando importada.

### Dynamic Import Condicional

```javascript
// features.js
const features = await fetch('/features').then(r => r.json());

if (features.usarNovoEditor) {
    const { NovoEditor } = await import('./novo-editor.js');
    export { NovoEditor as Editor };
} else {
    const { EditorLegado } = await import('./editor-legado.js');
    export { EditorLegado as Editor };
}

// app.js
import { Editor } from './features.js';
// Editor pode ser NovoEditor ou EditorLegado - decidido assincronamente
```

### Inicialização de Conexão DB

```javascript
// db.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL);
await client.connect();

console.log('Conectado ao MongoDB');

export const db = client.db('meu-app');

// Uso
import { db } from './db.js';
// db já conectado e pronto!
const usuarios = await db.collection('usuarios').find().toArray();
```

### Fallback em Erro

```javascript
// api.js
let apiUrl;

try {
    const config = await fetch('/config.json').then(r => r.json());
    apiUrl = config.apiUrl;
} catch (erro) {
    console.warn('Config indisponível, usando padrão');
    apiUrl = 'https://api.default.com';
}

export { apiUrl };
```

### Múltiplos Awaits

```javascript
// setup.js
// Carregar configuração
const config = await fetch('/config.json').then(r => r.json());

// Conectar ao DB (depende de config)
const db = await conectarDB(config.dbUrl);

// Carregar dados iniciais
const dadosIniciais = await db.collection('init').findOne();

export { config, db, dadosIniciais };
```

### Aguardar Múltiplas Promises em Paralelo

```javascript
// resources.js
const [config, translations, features] = await Promise.all([
    fetch('/config.json').then(r => r.json()),
    fetch('/i18n/pt-BR.json').then(r => r.json()),
    fetch('/features.json').then(r => r.json())
]);

export { config, translations, features };
```

Carrega **em paralelo**, módulo só completa quando todas prontas.

### Top-level Await com Exports Nomeados

```javascript
// utils.js
const helperModule = await import('./helpers.js');

export const helper1 = helperModule.helper1;
export const helper2 = helperModule.helper2;
```

### Top-level Await com Default Export

```javascript
// client.js
const apiKey = await fetch('/api-key').then(r => r.text());

class APIClient {
    constructor() {
        this.apiKey = apiKey;
    }
    
    async buscar(endpoint) {
        return fetch(`${endpoint}?key=${this.apiKey}`);
    }
}

export default new APIClient();

// Uso
import client from './client.js';
await client.buscar('/dados');
```

### Browser - Script Type Module

```html
<!-- HTML -->
<script type="module">
    // Top-level await funciona aqui!
    const config = await fetch('/config.json').then(r => r.json());
    console.log('Config:', config);
    
    document.body.innerHTML = `<h1>${config.titulo}</h1>`;
</script>
```

### Node.js - Arquivo .mjs

```javascript
// app.mjs
const fs = await import('fs/promises');

const conteudo = await fs.readFile('./dados.txt', 'utf-8');
console.log('Conteúdo:', conteudo);
```

Ou com `package.json`:

```json
{
  "type": "module"
}
```

Então `.js` funciona como `.mjs`.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Top-level Await

**Use quando:**

1. **Carregar configuração:** Config necessária para módulo funcionar
2. **Inicializar conexões:** DB, cache, serviços externos
3. **Dynamic imports condicionais:** Carregar módulo baseado em condição async
4. **Carregar dados críticos:** Dados sem os quais módulo é inútil
5. **Setup de ambiente:** Preparar ambiente antes de exportar funcionalidade

**Exemplos:**

**1. Configuração crítica:**
```javascript
// Módulo depende totalmente de config
const config = await carregarConfig();

export function processar(dados) {
    return transformar(dados, config.opcoes);
}
```

**2. Conexão DB:**
```javascript
const db = await conectarDB();

export async function salvarUsuario(usuario) {
    return await db.collection('usuarios').insertOne(usuario);
}
```

**3. Feature flags:**
```javascript
const features = await carregarFeatures();

export const usarNovaUI = features.novaUI;
```

### Quando NÃO Usar Top-level Await

**Evite quando:**

1. **Performance crítica:** Bloqueia carregamento da app
2. **Operação lenta:** Atrasa inicialização muito
3. **Não é critical path:** Pode carregar depois, on-demand
4. **Compatibilidade:** Ambiente não suporta ES modules
5. **Pode falhar:** Erro não deve impedir módulo carregar

**Alternativas:**

```javascript
// ❌ Top-level await para dados não-críticos
const dadosExtras = await buscarDadosExtras();
export { dadosExtras };

// ✅ Exportar Promise
export const dadosExtrasPromise = buscarDadosExtras();

// ✅ Lazy loading
export async function getDadosExtras() {
    return await buscarDadosExtras();
}
```

### Padrões de Uso

**Padrão 1: Config module**
```javascript
// config.js
const config = await fetch('/config.json').then(r => r.json());
export default config;
```

**Padrão 2: DB connection**
```javascript
// db.js
const client = await criarCliente();
await client.conectar();
export const db = client.db('app');
```

**Padrão 3: Conditional module**
```javascript
// feature.js
const habilitado = await verificarFeature('nova-ui');

if (habilitado) {
    const mod = await import('./nova-ui.js');
    export { mod as UI };
} else {
    const mod = await import('./ui-legada.js');
    export { mod as UI };
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições de Ambiente

**1. Só em ES Modules:**

```javascript
// ❌ CommonJS - NÃO funciona
// arquivo.js (CommonJS)
const dados = await fetch('/dados');  // SyntaxError!

// ✅ ES Module
// arquivo.mjs ou type="module"
const dados = await fetch('/dados');  // OK
```

**2. Node.js requer .mjs ou package.json type="module":**

```json
// package.json
{
  "type": "module"
}
```

**3. Browsers precisam `<script type="module">`:**

```html
<!-- ❌ Não funciona -->
<script>
    await fetch('/dados');  // SyntaxError
</script>

<!-- ✅ Funciona -->
<script type="module">
    await fetch('/dados');  // OK
</script>
```

### Performance Concerns

**Top-level await bloqueia importadores:**

```javascript
// slow-init.js
await delay(5000);  // 5 segundos!
export const valor = 42;

// app.js
import { valor } from './slow-init.js';  // Aguarda 5s
console.log('App iniciado');  // Só após 5s
```

**Impacto:** Atrasa **toda** aplicação.

**Mitigação:**

```javascript
// Carregar em paralelo
const [config, dados] = await Promise.all([
    carregarConfig(),
    carregarDados()
]);
```

### Error Handling

**Erro em top-level await falha módulo:**

```javascript
// api.js
const dados = await fetch('/api').then(r => r.json());
// Se fetch falhar, módulo FALHA ao carregar

// app.js
try {
    await import('./api.js');
} catch (erro) {
    console.error('Módulo api.js falhou:', erro);
}
```

**Solução:** Try/catch no módulo

```javascript
// api.js
let dados = null;

try {
    dados = await fetch('/api').then(r => r.json());
} catch (erro) {
    console.error('Erro ao carregar dados:', erro);
    dados = { /* fallback */ };
}

export { dados };
```

### Circular Dependencies

Top-level await pode criar **deadlocks** em dependências circulares:

```javascript
// a.js
import { b } from './b.js';  // Aguarda b.js
const valorA = await buscarA();
export const a = valorA + b;

// b.js
import { a } from './a.js';  // Aguarda a.js
const valorB = await buscarB();
export const b = valorB + a;

// DEADLOCK! a aguarda b, b aguarda a
```

**Evitar:** Não criar dependências circulares com async modules.

---

## 🔗 Interconexões Conceituais

### Relação com Async Functions

Top-level await torna **módulo inteiro** como async function:

```javascript
// Módulo = async function implícita
const dados = await operacao();
export { dados };

// Equivalente conceitual a:
(async () => {
    const dados = await operacao();
    export { dados };  // (não é sintaxe válida, apenas conceitual)
})();
```

### Relação com Dynamic Imports

`import()` + top-level await:

```javascript
const modulo = await import('./modulo.js');
modulo.funcao();
```

### Relação com Promises

Top-level await é **syntax sugar** para Promises:

```javascript
// Com await
const dados = await fetch('/dados').then(r => r.json());

// Sem await (Promise)
const dadosPromise = fetch('/dados').then(r => r.json());
// Mas exportar Promise, não valor
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Async Functions (introduziu await em escopo local)
2. Await Operator (pausar execução)
3. Error Handling (try/catch)
4. Sequential vs Parallel
5. Loops com Async
6. **Top-level Await** (você está aqui)
7. **Comparação de Paradigmas** (visão geral callbacks → Promises → async/await)

### Preparação para Comparação de Paradigmas

Com todas as ferramentas async/await dominadas, próximo: **comparar** com callbacks e Promises:

```javascript
// Callbacks
operacao(param, (erro, resultado) => { ... });

// Promises
operacao(param).then(resultado => { ... });

// Async/await
const resultado = await operacao(param);
```

Próximo: **Comparação: Callbacks vs Promises vs Async/Await**.

---

## 📚 Conclusão

**Top-level await** permite inicialização assíncrona de módulos de forma **limpa e determinística**, eliminando workarounds com IIFE e garantindo módulos prontos quando importados.

**Conceitos essenciais:**
- **Só em ES modules:** `.mjs` ou `type="module"`
- **Bloqueia importadores:** Quem importa aguarda módulo completar
- **Async module:** Módulo com top-level await é assíncrono
- **Inicialização garantida:** Exports só disponíveis após await completar
- **Performance:** Pode atrasar carregamento - usar com cautela
- **Error handling:** Erro falha módulo - precisa try/catch
- **Evitar circular deps:** Pode criar deadlocks
- **Suporte moderno:** Chrome 89+, Firefox 89+, Safari 15+, Node 14.8+

Dominar top-level await é essencial para **arquiteturas modulares modernas** com dependências assíncronas.
