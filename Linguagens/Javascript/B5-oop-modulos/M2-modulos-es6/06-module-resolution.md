# Module Resolution: Análise Conceitual

## 🎯 Definição

**Module Resolution** (resolução de módulos) é o processo pelo qual o runtime JavaScript (browser ou Node.js) ou bundler (Webpack, Rollup, Vite) determina a localização exata de um módulo a partir do caminho especificado em um `import` ou `require`. Envolve algoritmos complexos que consideram extensões de arquivo, diretórios index, node_modules, package.json e muito mais.

```javascript
// Caminho especificado no código
import { funcao } from './utils';

// Runtime/bundler resolve para:
// -> ./utils.js
// -> ./utils/index.js
// -> ./utils.mjs
// -> etc.
```

**Conceito:** Transformar especificadores de módulo (strings de import/require) em caminhos de arquivo absolutos.

## 📋 Tipos de Especificadores

### 1. Especificadores Relativos

Começam com `./` ou `../`, resolvem relativamente ao arquivo atual.

```javascript
// Em: /projeto/src/componentes/Botao.js

import { validar } from './utils.js';
// Resolve: /projeto/src/componentes/utils.js

import Icone from '../icons/Icone.js';
// Resolve: /projeto/src/icons/Icone.js

import config from '../../config.js';
// Resolve: /projeto/config.js
```

### 2. Especificadores Absolutos

Começam com `/`, resolvem a partir da raiz do sistema (raro).

```javascript
// ⚠️ Geralmente não usado em módulos
import modulo from '/caminho/absoluto/modulo.js';
// Resolve: /caminho/absoluto/modulo.js (raiz do filesystem)
```

### 3. Especificadores Bare (Pacotes)

Não começam com `./`, `../` ou `/`, resolvem para `node_modules`.

```javascript
import React from 'react';
// Resolve: node_modules/react/...

import { map } from 'lodash';
// Resolve: node_modules/lodash/...

import express from 'express';
// Resolve: node_modules/express/...
```

### 4. Especificadores com Protocolo (URL)

Usados em browsers modernos (ES modules nativos).

```javascript
// Browser nativo
import React from 'https://esm.sh/react';

// Deno
import { serve } from 'https://deno.land/std/http/server.ts';
```

## 🧠 Algoritmo de Resolução

### Node.js (CommonJS)

**Processo de resolução para `require('./modulo')`:**

1. **Arquivo Direto:**
   ```
   require('./modulo')
   -> ./modulo.js
   -> ./modulo.json
   -> ./modulo.node
   ```

2. **Diretório com index:**
   ```
   require('./modulo')
   -> ./modulo/package.json (campo "main")
   -> ./modulo/index.js
   -> ./modulo/index.json
   -> ./modulo/index.node
   ```

3. **Node Modules (para bare specifiers):**
   ```
   require('pacote')
   -> node_modules/pacote/package.json (campo "main")
   -> node_modules/pacote/index.js

   // Se não encontrar, sobe hierarquia:
   -> ../node_modules/pacote
   -> ../../node_modules/pacote
   -> até raiz do sistema
   ```

### ES6 Modules (Node.js)

**Processo similar, mas com diferenças:**

1. **Extensão Obrigatória (browsers):**
   ```javascript
   // ❌ Browser nativo
   import { funcao } from './modulo'; // ERRO

   // ✅ Precisa de extensão
   import { funcao } from './modulo.js'; // OK
   ```

2. **package.json com "exports":**
   ```json
   {
     "exports": {
       ".": "./dist/index.js",
       "./utils": "./dist/utils.js"
     }
   }
   ```

   ```javascript
   import pkg from 'meu-pacote';
   // Resolve: node_modules/meu-pacote/dist/index.js

   import { util } from 'meu-pacote/utils';
   // Resolve: node_modules/meu-pacote/dist/utils.js
   ```

3. **Conditional Exports:**
   ```json
   {
     "exports": {
       "import": "./dist/index.mjs",
       "require": "./dist/index.cjs"
     }
   }
   ```

### Bundlers (Webpack, Rollup, Vite)

**Algoritmo personalizado com extensões:**

1. **Extensões Configuráveis:**
   ```javascript
   // webpack.config.js
   {
     resolve: {
       extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
     }
   }

   // Agora pode:
   import Componente from './Componente';
   // Tenta: .js, .jsx, .ts, .tsx, .json
   ```

2. **Aliases:**
   ```javascript
   {
     resolve: {
       alias: {
         '@': path.resolve(__dirname, 'src'),
         '@components': path.resolve(__dirname, 'src/components')
       }
     }
   }

   import Botao from '@components/Botao';
   // Resolve: src/components/Botao.js
   ```

3. **Module Directories:**
   ```javascript
   {
     resolve: {
       modules: ['node_modules', 'src']
     }
   }

   import utils from 'utils/helpers';
   // Busca em: node_modules/utils E src/utils
   ```

## 🔍 Análise Detalhada

### package.json e Module Resolution

**Campo "main" (CommonJS/legado):**
```json
{
  "name": "meu-pacote",
  "main": "./dist/index.js"
}
```

```javascript
const pkg = require('meu-pacote');
// Resolve: node_modules/meu-pacote/dist/index.js
```

**Campo "module" (ES6 para bundlers):**
```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs"
}
```

```javascript
// Bundlers preferem "module" para tree shaking
import pkg from 'meu-pacote';
// Resolve: node_modules/meu-pacote/dist/index.mjs
```

**Campo "exports" (moderno, Node.js 12+):**
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.cjs"
    },
    "./package.json": "./package.json"
  }
}
```

```javascript
// ES6
import pkg from 'meu-pacote';
// Resolve: ./dist/index.mjs

// CommonJS
const pkg = require('meu-pacote');
// Resolve: ./dist/index.cjs

import { util } from 'meu-pacote/utils';
// Resolve: ./dist/utils.mjs
```

### Extensões de Arquivo

**Browser (ES modules nativos):**
```javascript
// ✅ Extensão obrigatória
import { funcao } from './modulo.js';

// ❌ ERRO em browsers nativos
import { funcao } from './modulo';
```

**Node.js (ES modules):**
```javascript
// ✅ Extensão recomendada
import { funcao } from './modulo.js';

// ⚠️ Pode funcionar com configuração
import { funcao } from './modulo';
```

**Bundlers:**
```javascript
// ✅ Geralmente aceita sem extensão
import { funcao } from './modulo';
// Bundler resolve baseado em configuração
```

**Convenções:**
- `.js` - JavaScript (ES5/ES6/CommonJS)
- `.mjs` - ES6 Modules (explícito)
- `.cjs` - CommonJS (explícito)
- `.ts` - TypeScript
- `.jsx` - React JSX
- `.json` - Dados JSON

### Resolução em Monorepos

**Workspaces (package.json):**
```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

**Estrutura:**
```
projeto/
├── packages/
│   ├── componentes/
│   │   └── package.json (name: "@projeto/componentes")
│   └── utils/
│       └── package.json (name: "@projeto/utils")
```

**Importação cross-package:**
```javascript
// Em packages/componentes/Botao.js
import { formatar } from '@projeto/utils';
// Resolve: ../utils/src/index.js (via workspace)
```

## 🎯 Exemplos Práticos

### Estrutura de Projeto Típica

```
projeto/
├── node_modules/
│   ├── react/
│   └── lodash/
├── src/
│   ├── components/
│   │   ├── Botao.js
│   │   └── index.js
│   ├── utils/
│   │   ├── formatadores.js
│   │   └── validadores.js
│   └── index.js
└── package.json
```

**Resoluções:**
```javascript
// Em src/components/Botao.js

// Relativo - mesmo diretório
import { Input } from './Input.js';
// Resolve: src/components/Input.js

// Relativo - diretório pai
import { formatar } from '../utils/formatadores.js';
// Resolve: src/utils/formatadores.js

// Bare - pacote externo
import React from 'react';
// Resolve: node_modules/react/index.js

// Bare - sub-módulo de pacote
import { map } from 'lodash/map';
// Resolve: node_modules/lodash/map.js
```

### Barrel Exports e Resolution

```javascript
// src/components/index.js (barrel)
export { Botao } from './Botao.js';
export { Input } from './Input.js';
export { Card } from './Card.js';

// src/App.js
import { Botao, Input, Card } from './components';
// Resolve: ./components/index.js
// Que re-exporta de ./Botao.js, ./Input.js, ./Card.js
```

### Aliases e Path Mapping

**tsconfig.json (TypeScript):**
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"],
      "@/*": ["*"]
    }
  }
}
```

**Uso:**
```javascript
// Antes
import Botao from '../../components/Botao';

// Depois (com alias)
import Botao from '@components/Botao';
// Resolve: src/components/Botao.ts
```

### Import Maps (Browser)

```html
<!-- index.html -->
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18",
    "react-dom": "https://esm.sh/react-dom@18",
    "utils/": "/src/utils/"
  }
}
</script>

<script type="module">
  import React from 'react';
  // Resolve: https://esm.sh/react@18

  import { validar } from 'utils/validadores.js';
  // Resolve: /src/utils/validadores.js
</script>
```

## ⚠️ Problemas Comuns

### 1. Extensão Ausente

```javascript
// ❌ Browser nativo
import { funcao } from './modulo'; // ERRO: Needs explicit extension

// ✅ Adicionar extensão
import { funcao } from './modulo.js';
```

### 2. Circular Resolution

```javascript
// a.js
import { b } from './b.js';
export const a = 'A';

// b.js
import { a } from './a.js';
export const b = 'B';

// ⚠️ Pode causar problemas dependendo do bundler/runtime
// ES6 lida melhor que CommonJS devido a live bindings
```

### 3. Case Sensitivity

```javascript
// ❌ Linux/macOS (case-sensitive)
import Botao from './botao.js'; // ERRO se arquivo é Botao.js

// ✅ Nome exato
import Botao from './Botao.js';
```

### 4. package.json Ausente

```javascript
// node_modules/meu-pacote/ (sem package.json)
import pkg from 'meu-pacote';
// Tenta: node_modules/meu-pacote/index.js
// Se não existir, ERRO
```

### 5. Exports vs Main Conflict

```json
{
  "main": "./old.js",
  "exports": {
    ".": "./new.js"
  }
}
```

```javascript
// Node.js moderno respeita "exports", ignora "main"
import pkg from 'meu-pacote';
// Resolve: ./new.js (não ./old.js)
```

## 🔗 Boas Práticas

### 1. Sempre Use Extensões em Código Publicado

```javascript
// ✅ Compatível com browsers e Node.js
import { funcao } from './modulo.js';

// ❌ Depende de bundler
import { funcao } from './modulo';
```

### 2. Configure Aliases para Projetos Grandes

```javascript
// Sem alias
import Componente from '../../../components/UI/Botao';

// Com alias
import Componente from '@components/UI/Botao';
```

### 3. Use "exports" em package.json Moderno

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

### 4. Documente Caminhos de Resolução

```javascript
// README.md
/**
 * Estrutura de importação:
 *
 * @components - src/components
 * @utils - src/utils
 * @api - src/api
 */
```

## 🚀 Evolução e Futuro

- **Import Maps:** Padrão para browsers (mapeamento de URLs)
- **package.json "exports":** Controle granular de pontos de entrada
- **Subpath Exports:** Especificar múltiplos entry points
- **Conditional Exports:** ES6 vs CommonJS, Node vs Browser
- **Deno:** Apenas URLs, sem node_modules

Module resolution é um dos aspectos mais complexos do ecossistema JavaScript moderno, envolvendo coordenação entre especificações ECMAScript, implementações de runtime (Node.js, browsers) e ferramentas de build (bundlers). Compreender seu funcionamento é essencial para debugar problemas de importação e configurar projetos corretamente.
