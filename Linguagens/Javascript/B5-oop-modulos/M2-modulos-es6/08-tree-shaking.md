# Tree Shaking: Análise Conceitual

## 🎯 Definição

**Tree Shaking** é uma técnica de otimização de bundlers modernos (Webpack, Rollup, Vite, esbuild) que **elimina código não utilizado** (dead code) do bundle final. O termo vem da metáfora de "sacudir uma árvore" (dependências) para fazer cair as "folhas mortas" (código não usado). É possível graças à análise estática de ES6 Modules.

```javascript
// utils.js - biblioteca com 10 funções
export function funcao1() { }
export function funcao2() { }
export function funcao3() { }
// ... funcao4 até funcao10

// app.js - usa apenas funcao1
import { funcao1 } from './utils.js';

funcao1();

// Bundle final: inclui APENAS funcao1
// funcao2-10 são eliminadas (tree shaking)
```

**Conceito:** Análise estática de imports/exports para remover código não referenciado, reduzindo tamanho do bundle.

## 📋 Como Funciona

### Análise Estática (Static Analysis)

Tree shaking é possível porque **ES6 Modules são estáticos**: imports e exports são analisados na fase de parsing, antes da execução.

**ES6 - Permite Tree Shaking:**
```javascript
// ✅ Import estático, analisável
import { funcao } from './modulo.js';

// Bundler sabe exatamente:
// - Que módulo está sendo importado
// - Quais named exports estão sendo usados
// - Pode eliminar o resto
```

**CommonJS - NÃO Permite Tree Shaking:**
```javascript
// ❌ Require dinâmico, não analisável
const caminho = condicao ? './a' : './b';
const modulo = require(caminho);

// Bundler não consegue saber:
// - Qual módulo será carregado (runtime)
// - Tem que incluir TUDO
```

### Processo de Tree Shaking

1. **Parse:** Bundler analisa todos os imports/exports
2. **Mark:** Marca código usado (referenced)
3. **Sweep:** Remove código não marcado (unreferenced)
4. **Minify:** Minificação remove código morto adicional

```javascript
// Antes do tree shaking
export function usado() { return 'usado'; }
export function naoUsado() { return 'não usado'; }

// app.js
import { usado } from './modulo.js';
console.log(usado());

// Depois do tree shaking
// Apenas 'usado' no bundle final
function usado() { return 'usado'; }
console.log(usado());
```

## 🧠 Requisitos para Tree Shaking

### 1. ES6 Modules (ESM)

```javascript
// ✅ Funciona com tree shaking
export function funcao() { }

// ❌ Não funciona
module.exports = { funcao: function() { } };
```

### 2. Side-Effect Free Code

Código sem **efeitos colaterais** (side effects) pode ser removido com segurança.

**Sem Side Effects (removível):**
```javascript
// utils.js
export function pura(a, b) {
  return a + b; // Apenas retorna valor, sem efeitos
}

// Se não importada, pode ser removida
```

**Com Side Effects (não removível):**
```javascript
// config.js
export const API_URL = 'https://api.com';

// ⚠️ Side effect: executa código no top-level
console.log('Config carregada');
window.globalVar = API_URL;

// Mesmo se não importado, precisa ser incluído
// porque tem side effects
```

### 3. package.json "sideEffects"

Informar ao bundler quais arquivos têm side effects.

```json
{
  "name": "minha-lib",
  "sideEffects": false
}
// Nenhum arquivo tem side effects, pode fazer tree shaking agressivo

{
  "sideEffects": ["*.css", "*.scss", "./src/polyfills.js"]
}
// Apenas estes arquivos têm side effects
```

### 4. Production Mode

Tree shaking só é efetivo em modo de produção.

```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // Habilita tree shaking + minificação
  optimization: {
    usedExports: true, // Marca exports usados
    minimize: true      // Remove código morto
  }
};
```

## 🔍 Análise Detalhada

### Named Exports vs Default Exports

**Named Exports - Melhor para Tree Shaking:**
```javascript
// utils.js
export function funcao1() { }
export function funcao2() { }
export function funcao3() { }

// app.js - importa seletivamente
import { funcao1 } from './utils.js';

// Bundle final: APENAS funcao1
// funcao2 e funcao3 são removidas
```

**Default Export - Pior para Tree Shaking:**
```javascript
// utils.js
export default {
  funcao1() { },
  funcao2() { },
  funcao3() { }
};

// app.js
import utils from './utils.js';
utils.funcao1();

// Bundle final: TODO o objeto utils
// Bundler não consegue saber quais métodos são usados
// Inclui funcao1, funcao2, funcao3
```

### Exemplo: Lodash

**❌ Import Default (sem tree shaking):**
```javascript
import _ from 'lodash';

const resultado = _.map([1, 2, 3], x => x * 2);

// Bundle: ~70KB (toda biblioteca lodash!)
```

**✅ Import Named (com tree shaking):**
```javascript
import { map } from 'lodash-es';

const resultado = map([1, 2, 3], x => x * 2);

// Bundle: ~2KB (apenas função map)
```

**✅ Import Individual:**
```javascript
import map from 'lodash-es/map';

const resultado = map([1, 2, 3], x => x * 2);

// Bundle: ~2KB (garantido)
```

### Classes e Tree Shaking

**Problema com Classes:**
```javascript
// componentes.js
export class Componente1 {
  metodo1() { }
  metodo2() { }
  metodo3() { }
}

// app.js
import { Componente1 } from './componentes.js';

const c = new Componente1();
c.metodo1();

// ⚠️ Bundle inclui metodo1, metodo2, metodo3
// Bundler não consegue fazer tree shaking de métodos de classe
// (podem ser acessados dinamicamente)
```

**Solução com Funções:**
```javascript
// utils.js
export function metodo1() { }
export function metodo2() { }
export function metodo3() { }

// app.js
import { metodo1 } from './utils.js';

metodo1();

// ✅ Bundle inclui APENAS metodo1
```

## 🎯 Exemplos Práticos

### Biblioteca de Utilitários

```javascript
// utils/index.js
export { validarEmail } from './validadores.js';
export { formatarData } from './formatadores.js';
export { converterMoeda } from './conversores.js';
export { calcularImposto } from './calculos.js';
// ... 50 funções

// app.js
import { validarEmail, formatarData } from './utils';

validarEmail('teste@email.com');
formatarData(new Date());

// Bundle final:
// ✅ Inclui: validarEmail, formatarData
// ❌ Remove: converterMoeda, calcularImposto, + 46 funções
```

### React Component Library

```javascript
// components/index.js
export { Botao } from './Botao';
export { Input } from './Input';
export { Modal } from './Modal';
export { Dropdown } from './Dropdown';
// ... 100 componentes

// app.js
import { Botao, Input } from './components';

function App() {
  return (
    <div>
      <Botao />
      <Input />
    </div>
  );
}

// Bundle final:
// ✅ Inclui: Botao, Input
// ❌ Remove: Modal, Dropdown, + 96 componentes
```

### Icon Library

```javascript
// icons/index.js
export { IconHome } from './IconHome';
export { IconUser } from './IconUser';
export { IconSettings } from './IconSettings';
// ... 500 ícones

// app.js
import { IconHome, IconUser } from './icons';

// Bundle final: apenas 2 ícones (não 500!)
```

## ⚠️ Armadilhas e Limitações

### 1. Side Effects Impedem Tree Shaking

```javascript
// config.js
export const API_URL = 'https://api.com';

// ❌ Side effect
console.log('Configuração carregada');
window.API = API_URL;

// Mesmo se API_URL não for importado,
// arquivo inteiro é incluído por causa do side effect
```

**Solução:**
```javascript
// config.js
export const API_URL = 'https://api.com';

// app.js (onde é usado)
import { API_URL } from './config';

console.log('Configuração carregada');
window.API = API_URL;

// Agora, se não importado, é removido
```

### 2. Dynamic Property Access

```javascript
// utils.js
export const utils = {
  funcao1() { },
  funcao2() { },
  funcao3() { }
};

// app.js
import { utils } from './utils';

const nome = 'funcao1';
utils[nome](); // Acesso dinâmico

// ⚠️ Bundler não consegue saber qual função será usada
// Inclui funcao1, funcao2, funcao3
```

### 3. Spread Operator

```javascript
// modulo.js
export const obj = {
  a: 1,
  b: 2,
  c: 3
};

// app.js
import { obj } from './modulo';

const { a } = obj;
const novo = { ...obj }; // Spread

// ⚠️ Spread pode impedir tree shaking
// Bundler assume que todas propriedades são usadas
```

### 4. Re-exports Podem Afetar

```javascript
// utils/index.js (barrel module)
export * from './validadores';
export * from './formatadores';
export * from './conversores';

// ⚠️ Pode dificultar tree shaking dependendo do bundler
// Alguns bundlers têm dificuldade com export *

// ✅ Melhor ser explícito
export { validarEmail, validarCPF } from './validadores';
export { formatarData, formatarMoeda } from './formatadores';
```

### 5. CommonJS Interop

```javascript
// modulo-commonjs.js
module.exports = {
  funcao1() { },
  funcao2() { }
};

// app.js
import { funcao1 } from './modulo-commonjs';

// ❌ NÃO faz tree shaking
// CommonJS não permite análise estática
// Inclui todo o module.exports
```

## 🔗 Ferramentas e Configuração

### Webpack

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,        // Marca exports usados
    sideEffects: true,        // Respeita package.json sideEffects
    minimize: true,           // Minifica e remove dead code
    concatenateModules: true  // Scope hoisting (otimização adicional)
  }
};
```

### Rollup

```javascript
// rollup.config.js
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },
  plugins: [
    terser() // Minificação e tree shaking
  ],
  treeshake: {
    moduleSideEffects: false // Assume sem side effects
  }
};
```

### Vite

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser', // Tree shaking automático em prod
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
};
```

### Análise de Bundle

**webpack-bundle-analyzer:**
```bash
npm install webpack-bundle-analyzer

# Visualizar o que está no bundle
npm run build -- --analyze
```

**Rollup Plugin Visualizer:**
```bash
npm install rollup-plugin-visualizer

# Ver quais módulos ocupam mais espaço
```

## 🚀 Boas Práticas

### 1. Use Named Exports

```javascript
// ✅ Bom para tree shaking
export function funcao1() { }
export function funcao2() { }

// ❌ Ruim
export default { funcao1, funcao2 };
```

### 2. Evite Side Effects

```javascript
// ✅ Código puro, sem side effects
export function calcular(a, b) {
  return a + b;
}

// ❌ Com side effects
export function inicializar() {
  console.log('Inicializando');
  window.global = {};
}
```

### 3. Configure package.json

```json
{
  "sideEffects": false
}
```

### 4. Import Seletivamente

```javascript
// ✅ Import específico
import { map } from 'lodash-es';

// ❌ Import completo
import _ from 'lodash';
```

### 5. Analise Bundle Regularmente

```bash
# Verificar tamanho do bundle
npm run build
ls -lh dist/

# Usar ferramentas de análise
npm run analyze
```

## 🔍 Conclusão

Tree shaking é uma otimização essencial para aplicações modernas, podendo **reduzir bundles em 50-90%** em alguns casos. Requer:

- **ES6 Modules** (não CommonJS)
- **Named Exports** (não default objects)
- **Código sem side effects**
- **Production mode**
- **Configuração adequada de bundler**

Compreender tree shaking permite escrever código mais modular e criar bibliotecas que geram bundles menores, melhorando significativamente a performance de aplicações web.
