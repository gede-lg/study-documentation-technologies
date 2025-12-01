# Vite para Desenvolvimento Rápido: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Vite** é **build tool moderno** que oferece **desenvolvimento extremamente rápido** através de ES modules nativos do browser durante dev e bundling otimizado com Rollup para produção. Com **TypeScript**, Vite fornece **suporte nativo zero-config**, transpilando TS instantaneamente via esbuild sem necessidade de configuração complexa. Conceitualmente, representa **unbundled development**, onde browser carrega módulos diretamente durante desenvolvimento, eliminando etapa de bundling lenta.

Na essência, Vite materializa o princípio de **instant server start + lightning-fast HMR**, onde servidor dev inicia em milissegundos (vs segundos do Webpack) e Hot Module Replacement acontece instantaneamente independentemente do tamanho do projeto, aproveitando features modernas de browsers para velocidade máxima.

## 📋 Fundamentos

### Instalação e Setup

```bash
# Criar projeto Vite + TypeScript
npm create vite@latest my-app -- --template vanilla-ts

# Ou React + TypeScript
npm create vite@latest my-app -- --template react-ts

# Ou Vue + TypeScript
npm create vite@latest my-app -- --template vue-ts
```

**Estrutura gerada:**
```
my-app/
├── index.html        (entry point - não dentro de public/)
├── src/
│   ├── main.ts
│   └── vite-env.d.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

**Conceito-chave:** Vite usa **index.html** como entry point, não JavaScript.

### Comandos Básicos

```bash
# Instalar dependências
npm install

# Dev server (instantâneo)
npm run dev
# Server started at http://localhost:5173

# Build produção (Rollup)
npm run build

# Preview build de produção
npm run preview
```

## 🔍 Análise Conceitual

### 1. Unbundled Development

**Webpack (tradicional):**
```
1. Bundla TODO o código
2. Inicia servidor (10-30s para projetos grandes)
3. Cada mudança → rebundla → reload (lento)
```

**Vite (moderno):**
```
1. Inicia servidor IMEDIATAMENTE (<500ms)
2. Serve arquivos sob demanda via ES modules
3. Cada mudança → apenas arquivo modificado atualiza (instantâneo)
```

**Como funciona:**

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <script type="module" src="/src/main.ts"></script>
  </head>
</html>
```

**Browser carrega:**
```
GET /src/main.ts
  ↓ Vite transpila on-the-fly (esbuild)
  ↓ Retorna JavaScript

GET /src/utils.ts
  ↓ Transpilado sob demanda
  ↓ Apenas quando importado
```

**Conceito:** Vite **não bundla** durante desenvolvimento - browser faz trabalho de resolução de módulos.

### 2. esbuild - Transpilação Ultra-Rápida

```typescript
// src/main.ts
const greet = (name: string): string => {
  return `Hello ${name}`;
};

console.log(greet('World'));
```

**Vite transpila com esbuild (escrito em Go):**
- **100x mais rápido** que tsc
- **20x mais rápido** que Babel
- Suporte TypeScript nativo

**Benchmark:**
```
tsc:     5000ms
babel:   1000ms
esbuild:   50ms ⚡
```

**Limitação:** esbuild **não verifica tipos** - apenas remove anotações.

### 3. TypeScript Support

**Zero-config:**
```typescript
// src/main.ts - funciona imediatamente
interface User {
  id: number;
  name: string;
}

const user: User = {
  id: 1,
  name: 'John'
};
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  // TypeScript funciona sem configuração extra
});
```

**tsconfig.json (gerado automaticamente):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**Conceito:** Vite transpila mas **não verifica tipos** - rodar `tsc --noEmit` separadamente.

### 4. Hot Module Replacement (HMR)

```typescript
// src/counter.ts
export let count = 0;

export function increment() {
  count++;
  render();
}

function render() {
  document.getElementById('count')!.textContent = String(count);
}

// HMR API (opcional)
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('Module updated!');
  });
}
```

**Vite HMR:**
- **Instantâneo** - <100ms
- Preserva estado da aplicação
- Funciona para CSS, TypeScript, frameworks

**Webpack HMR:**
- Segundos para projetos grandes
- Pode perder estado

### 5. CSS e Assets

```typescript
// Importar CSS
import './style.css';

// CSS Modules
import styles from './Button.module.css';

// Importar imagens
import logo from './logo.png';

// JSON
import data from './data.json';
```

**Vite processa automaticamente:**
```css
/* style.css */
.button {
  background: blue;
}
```

```typescript
import './style.css';
// CSS injetado no DOM automaticamente
```

### 6. Env Variables

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_API_KEY=secret123
```

```typescript
// src/config.ts
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

console.log(apiUrl);  // "https://api.example.com"
```

**Conceito:** Apenas variáveis com **prefixo VITE_** são expostas.

### 7. Build para Produção

```bash
npm run build
```

**Processo:**
```
1. TypeScript → JavaScript (esbuild)
2. Bundle com Rollup
3. Minificação
4. Tree shaking
5. Code splitting
6. Asset optimization
```

**Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js    (main bundle, hashed)
│   ├── vendor-def456.js   (dependencies)
│   └── index-ghi789.css
```

**Otimizações automáticas:**
- Minificação
- Tree shaking
- Code splitting
- CSS extraction
- Asset optimization

### 8. Plugins

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
});
```

**Plugins populares:**
```bash
npm install --save-dev @vitejs/plugin-react        # React
npm install --save-dev @vitejs/plugin-vue          # Vue
npm install --save-dev vite-plugin-checker         # Type checking
```

**Type checking durante dev:**
```typescript
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    checker({
      typescript: true  // Verifica tipos durante dev
    })
  ]
});
```

## 🎯 Aplicabilidade

### React + TypeScript

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
```

**Estrutura:**
```
my-react-app/
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── vite.config.ts
└── tsconfig.json
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    open: true
  },

  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

### Path Aliases

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components')
    }
  }
});
```

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

```typescript
// src/App.tsx
import { Button } from '@components/Button';
import { api } from '@/services/api';
```

### Proxy API (CORS)

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

```typescript
// src/api.ts
// Requisição para /api/users → proxied para http://localhost:8000/users
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Multi-Page Application

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});
```

### Library Mode

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

### Otimizações Avançadas

```typescript
export default defineConfig({
  build: {
    // Tamanho de chunk
    chunkSizeWarningLimit: 1000,

    // Rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'utils': ['lodash', 'date-fns']
        }
      }
    },

    // Minificação
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
});
```

## ⚠️ Considerações

### 1. Type Checking

```bash
# Vite NÃO verifica tipos durante build
npm run build  # Pode passar mesmo com erros de tipo!

# Solução 1: rodar tsc separadamente
npm run build && tsc --noEmit

# Solução 2: plugin checker
npm install --save-dev vite-plugin-checker
```

```typescript
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      overlay: true  // Mostra erros no browser
    })
  ]
});
```

### 2. Browser Compatibility

```typescript
export default defineConfig({
  build: {
    target: 'es2015'  // Browser target
  }
});
```

**Legacy browser support:**
```bash
npm install --save-dev @vitejs/plugin-legacy
```

```typescript
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
});
```

### 3. Pre-bundling

**Vite pre-bundla dependencies (node_modules):**
```
node_modules/lodash → .vite/deps/lodash.js
```

**Força re-bundling:**
```bash
# Limpar cache
rm -rf node_modules/.vite

# Ou flag
vite --force
```

### 4. SSR (Server-Side Rendering)

```typescript
// vite.config.ts
export default defineConfig({
  ssr: {
    noExternal: ['some-package']
  }
});
```

### 5. Vite vs Webpack

| Feature | Vite | Webpack |
|---------|------|---------|
| Dev Start | <500ms | 10-30s |
| HMR | <100ms | 1-5s |
| Build | Rollup | Webpack |
| Config | Simples | Complexo |
| Ecosystem | Crescente | Maduro |
| TypeScript | Zero-config | Precisa loader |

## 📚 Conclusão

Vite é **build tool moderno** ultra-rápido: dev instantâneo (<500ms), HMR <100ms via ES modules nativos. **esbuild** transpila TypeScript 100x mais rápido que tsc. Unbundled development: browser carrega módulos diretamente. Zero-config TypeScript support. Build produção com Rollup (tree shaking, minificação). import.meta.env para variáveis (prefixo VITE_). Plugins para React/Vue. Path aliases com resolve.alias. Proxy para evitar CORS. **Não verifica tipos** - usar vite-plugin-checker ou tsc --noEmit. HMR preserva estado. CSS/assets processados automaticamente. Pre-bundling de dependencies. Library mode para publicar pacotes. Muito mais rápido que Webpack para desenvolvimento.

