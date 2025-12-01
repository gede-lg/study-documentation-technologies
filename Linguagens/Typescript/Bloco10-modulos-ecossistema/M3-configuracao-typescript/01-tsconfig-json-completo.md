# tsconfig.json Completo: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`tsconfig.json`** é **arquivo de configuração** que define como compilador TypeScript (tsc) deve processar arquivos, incluindo opções de compilação, arquivos a incluir/excluir e comportamentos do sistema de tipos. Conceitualmente, representa **compilation contract**, especificando exatamente como código TypeScript será transformado em JavaScript e quais verificações de tipo serão aplicadas.

Na essência, tsconfig.json materializa o princípio de **configuration as code**, permitindo que configuração do compilador seja versionada, compartilhada e reproduzível entre desenvolvedores e ambientes, eliminando necessidade de flags CLI repetitivas.

## 📋 Fundamentos

### Criação Básica

```bash
# Criar tsconfig.json com defaults
npx tsc --init

# Cria arquivo com comentários explicativos
# Muitas opções comentadas para referência
```

### Estrutura Básica

```json
{
  "compilerOptions": {
    // Opções do compilador
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src"
  },

  "include": [
    // Arquivos a incluir
    "src/**/*"
  ],

  "exclude": [
    // Arquivos a excluir
    "node_modules",
    "dist"
  ]
}
```

**Conceito-chave:** tsconfig.json define **o quê compilar** (include/exclude) e **como compilar** (compilerOptions).

## 🔍 Análise Conceitual

### 1. Seções Principais

```json
{
  "compilerOptions": {
    // 100+ opções de compilação
    // Controla output, type checking, modules, etc
  },

  "include": [
    // Padrões glob de arquivos a incluir
    "src/**/*.ts",
    "src/**/*.tsx"
  ],

  "exclude": [
    // Padrões glob de arquivos a excluir
    "node_modules",
    "**/*.spec.ts"
  ],

  "files": [
    // Lista explícita de arquivos (menos comum)
    "src/index.ts",
    "src/types.d.ts"
  ],

  "extends": "./tsconfig.base.json",
  // Herda configuração de outro arquivo

  "references": [
    // Para projetos compostos (monorepos)
    { "path": "./packages/core" }
  ]
}
```

### 2. compilerOptions - Categorias

```json
{
  "compilerOptions": {
    // === Type Checking ===
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,

    // === Modules ===
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,

    // === Emit ===
    "outDir": "./dist",
    "declaration": true,
    "sourceMap": true,

    // === JavaScript Support ===
    "allowJs": true,
    "checkJs": false,

    // === Interop Constraints ===
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,

    // === Language and Environment ===
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],

    // === Projects ===
    "incremental": true,
    "composite": false,

    // === Completeness ===
    "skipLibCheck": true
  }
}
```

### 3. Configurações Comuns por Tipo de Projeto

**Node.js/Backend:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**React/Frontend:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

**Biblioteca/Package:**
```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "esnext",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

### 4. extends - Herança de Configuração

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}

// tsconfig.prod.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "removeComments": true
  }
}
```

### 5. Project References (Monorepo)

```json
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}

// packages/app/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  },
  "references": [
    { "path": "../core" }
  ]
}

// Root tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/app" }
  ]
}
```

```bash
# Build com references
tsc --build

# Watch mode
tsc --build --watch

# Clean
tsc --build --clean
```

## 🎯 Aplicabilidade

### Setup Completo de Projeto

```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ES2020",
    "lib": ["ES2020"],
    "jsx": "preserve",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,

    /* Modules */
    "module": "commonjs",
    "rootDir": "./src",
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@utils/*": ["src/utils/*"]
    },
    "resolveJsonModule": true,

    /* Emit */
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "removeComments": true,
    "importHelpers": true,

    /* Interop Constraints */
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    /* Type Checking */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    /* Completeness */
    "skipLibCheck": true
  },

  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
}
```

### Múltiplos Ambientes

```json
// tsconfig.json (base)
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}

// tsconfig.build.json (produção)
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "declaration": true,
    "removeComments": true
  },
  "exclude": ["**/*.spec.ts", "**/*.test.ts"]
}

// tsconfig.dev.json (desenvolvimento)
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": true,
    "incremental": true
  }
}
```

```json
// package.json
{
  "scripts": {
    "build": "tsc --project tsconfig.build.json",
    "dev": "ts-node-dev --project tsconfig.dev.json src/index.ts"
  }
}
```

### Path Mapping (Aliases)

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

```typescript
// Antes
import { Button } from '../../../components/Button';
import { formatDate } from '../../../utils/date';

// Depois
import { Button } from '@components/Button';
import { formatDate } from '@utils/date';
```

## ⚠️ Considerações

### 1. Opções Conflitantes

```json
{
  "compilerOptions": {
    // ❌ Conflito: noEmit + outDir
    "noEmit": true,
    "outDir": "./dist"  // Ignorado se noEmit = true

    // ❌ Conflito: module + target
    "target": "ES5",
    "module": "ES2020"  // ES2020 modules não funcionam em ES5
  }
}
```

### 2. Performance

```json
{
  "compilerOptions": {
    // ✅ Melhorar performance
    "skipLibCheck": true,  // Não verifica .d.ts de node_modules
    "incremental": true,   // Cache de compilações anteriores

    // Para projetos grandes
    "composite": true,     // Project references
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

### 3. Strict Mode

```json
{
  "compilerOptions": {
    // "strict": true equivale a:
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "useUnknownInCatchVariables": true
  }
}
```

### 4. Overrides por Arquivo

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}

// Em arquivo específico
// @ts-nocheck - desativa verificação do arquivo
// @ts-expect-error - suprime erro na próxima linha
// @ts-ignore - suprime erro na próxima linha (deprecated)
```

## 📚 Conclusão

tsconfig.json configura compilador TypeScript: compilerOptions (como compilar), include/exclude (o quê compilar), extends (herança), references (monorepos). Criar com `tsc --init`. Principais categorias: Type Checking (strict), Modules (module, moduleResolution), Emit (outDir, declaration, sourceMap), Language (target, lib). Configurações variam por projeto: Node.js (commonjs), React (esnext + jsx), bibliotecas (declaration). extends permite reutilizar configs. Project references para monorepos. Path mapping para aliases. skipLibCheck e incremental melhoram performance. strict mode recomendado para novos projetos.
