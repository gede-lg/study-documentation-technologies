# npm install e package.json: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`npm install`** é comando que **baixa e instala dependências** declaradas em `package.json`, resolvendo grafo completo de dependências transitivas. **`package.json`** é **manifesto do projeto** que declara metadados, dependências, scripts e configurações. Conceitualmente, representam **dependency declaration + resolution**, onde você especifica "o quê" (package.json) e npm resolve "como" (install).

Na essência, materializam o princípio de **reproducible builds**, permitindo que qualquer desenvolvedor recrie ambiente exato de desenvolvimento instalando mesmas versões de todas as dependências através de arquivo de configuração versionado.

## 📋 Fundamentos

### npm install - Comportamento

```bash
# Comando básico
npm install
npm i  # Atalho

# O que faz:
# 1. Lê package.json
# 2. Resolve versões (usando package-lock.json se existir)
# 3. Baixa pacotes do registry
# 4. Instala em node_modules/
# 5. Atualiza/cria package-lock.json
# 6. Executa scripts de install (se houver)

# Instalar pacote específico
npm install lodash

# O que faz:
# 1. Baixa lodash do registry
# 2. Adiciona em package.json dependencies
# 3. Instala em node_modules/lodash/
# 4. Atualiza package-lock.json
```

**Conceito-chave:** `npm install` **resolve, baixa e instala** todo o grafo de dependências automaticamente.

### package.json - Estrutura Completa

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "description": "Descrição do projeto",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",

  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },

  "keywords": ["typescript", "exemplo"],
  "author": "Seu Nome <email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/usuario/repo"
  },

  "dependencies": {
    "express": "^4.18.0",
    "lodash": "~4.17.21"
  },

  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^18.0.0",
    "jest": "^29.0.0"
  },

  "peerDependencies": {
    "react": ">=17.0.0"
  },

  "optionalDependencies": {
    "fsevents": "^2.3.0"
  },

  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },

  "files": [
    "dist",
    "README.md"
  ]
}
```

## 🔍 Análise Conceitual

### 1. Tipos de Dependências

```json
{
  "dependencies": {
    // Pacotes necessários em PRODUÇÃO
    // Instalados com: npm install --production
    "express": "^4.18.0",
    "database-library": "^2.0.0"
  },

  "devDependencies": {
    // Pacotes necessários apenas em DESENVOLVIMENTO
    // NÃO instalados com --production
    "typescript": "^5.0.0",
    "@types/node": "^18.0.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  },

  "peerDependencies": {
    // Dependências que USUÁRIO do seu pacote deve ter
    // Exemplo: plugin React precisa que usuário tenha React
    "react": ">=17.0.0"
  },

  "optionalDependencies": {
    // Dependências opcionais (instalação pode falhar sem erro)
    // Útil para pacotes específicos de plataforma
    "fsevents": "^2.3.0"  // Apenas macOS
  }
}
```

```bash
# Instalar como dependency (produção)
npm install express

# Instalar como devDependency
npm install --save-dev typescript
npm install -D typescript  # Atalho

# Instalar apenas prod dependencies
npm install --production
npm install --omit=dev  # Mesmo resultado
```

### 2. Flags de Instalação

```bash
# Salvar em dependencies
npm install lodash
npm install lodash --save  # Desnecessário (default desde npm 5)

# Salvar em devDependencies
npm install --save-dev jest
npm install -D jest

# Não salvar em package.json
npm install lodash --no-save

# Instalar versão exata (sem ^ ou ~)
npm install --save-exact lodash
npm install -E lodash

# Instalar globalmente
npm install -g typescript

# Executar sem instalar (npx)
npx create-react-app my-app
```

### 3. Resolução de Dependências

```json
// Projeto A
{
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.0"
  }
}

// express/package.json
{
  "dependencies": {
    "body-parser": "^1.20.0",
    "cookie": "^0.5.0"
  }
}

// body-parser/package.json
{
  "dependencies": {
    "type-is": "^1.6.18"
  }
}
```

```
Grafo de dependências resultante:
node_modules/
├── express/
├── lodash/
├── body-parser/
├── cookie/
└── type-is/

npm "achata" dependências (flat structure)
Evita duplicação quando possível
```

### 4. package-lock.json - Lockfile Detalhado

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "meu-projeto",
      "version": "1.0.0",
      "dependencies": {
        "express": "^4.18.0"
      }
    },
    "node_modules/express": {
      "version": "4.18.2",  // Versão EXATA instalada
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-...",  // Hash para verificação
      "dependencies": {
        "accepts": "~1.3.8",
        "body-parser": "1.20.1"
      }
    },
    "node_modules/body-parser": {
      "version": "1.20.1",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.20.1.tgz",
      "integrity": "sha512-..."
    }
  }
}
```

**Importância do lockfile:**
- Garante **mesmas versões exatas** em todas as máquinas
- **Deve ser commitado** no git
- `npm install` usa lockfile quando disponível
- `npm ci` exige lockfile e falha se desatualizado

### 5. Scripts de Lifecycle

```json
{
  "scripts": {
    "preinstall": "echo 'Antes de npm install'",
    "install": "echo 'Durante npm install'",
    "postinstall": "echo 'Depois de npm install'",

    "prepublish": "npm run build",
    "prepare": "npm run build",
    "prepublishOnly": "npm run test",

    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "echo 'Testes completos'"
  }
}
```

```bash
# Ordem de execução em npm install:
# 1. preinstall
# 2. install
# 3. postinstall
# 4. prepare (se git repo)

# Ordem em npm publish:
# 1. prepublishOnly
# 2. prepare
# 3. prepublish
# 4. publish
# 5. postpublish
```

## 🎯 Aplicabilidade

### Projeto TypeScript Completo

```json
{
  "name": "@meu-usuario/meu-app",
  "version": "1.0.0",
  "description": "Aplicação TypeScript com Express",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",

  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn src/index.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },

  "dependencies": {
    "express": "^4.18.0",
    "dotenv": "^16.0.0"
  },

  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^18.0.0",
    "typescript": "^5.0.0",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "prettier": "^2.8.0"
  },

  "engines": {
    "node": ">=18.0.0"
  }
}
```

```bash
# Instalação inicial
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Testes
npm test
```

### Biblioteca Publicável

```json
{
  "name": "@usuario/biblioteca",
  "version": "1.0.0",
  "description": "Biblioteca TypeScript utilitária",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",

  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],

  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build && npm test"
  },

  "keywords": ["typescript", "utility"],
  "author": "Seu Nome",
  "license": "MIT",

  "devDependencies": {
    "typescript": "^5.0.0"
  },

  "peerDependencies": {
    "typescript": ">=4.5.0"
  }
}
```

### Configuração Avançada

```json
{
  "name": "projeto-avancado",

  "overrides": {
    // Forçar versão específica de dependência transitiva
    "lodash": "4.17.21"
  },

  "resolutions": {
    // Yarn equivalent (npm usa overrides)
    "lodash": "4.17.21"
  },

  "workspaces": [
    // Monorepo
    "packages/*"
  ],

  "config": {
    // Variáveis customizadas
    "port": "3000"
  }
}
```

## ⚠️ Considerações

### 1. npm install vs npm ci

```bash
# npm install
# ✅ Desenvolvimento local
# ✅ Adicionar novos pacotes
# ❌ CI/CD (não determinístico)

# npm ci
# ✅ CI/CD (determinístico)
# ✅ Deployment
# ❌ Desenvolvimento (remove node_modules sempre)

# Diferenças:
# npm install: pode modificar package-lock.json
# npm ci: falha se package.json e lock não batem
# npm ci: remove node_modules antes
# npm ci: mais rápido (~2x)
```

### 2. Versionamento de package.json

```json
{
  "dependencies": {
    "lodash": "4.17.21",    // Exata
    "express": "^4.18.0",   // Minor/patch updates OK
    "jest": "~29.5.0"       // Apenas patch updates OK
  }
}
```

```bash
# Atualizar para latest (respeitando ranges)
npm update

# Atualizar para latest ignorando ranges
npm install lodash@latest

# Ver versões desatualizadas
npm outdated
```

### 3. Performance

```bash
# Cache offline
npm install --prefer-offline

# Apenas produção (mais rápido)
npm install --production

# Usando cache diferente
npm install --cache /path/to/cache

# Instalar sem executar scripts
npm install --ignore-scripts
```

### 4. Troubleshooting

```bash
# Limpar cache
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar integridade
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

## 📚 Conclusão

`npm install` resolve e instala dependências declaradas em package.json, criando node_modules e package-lock.json. package.json é manifesto do projeto: declara dependencies (produção), devDependencies (desenvolvimento), peerDependencies (requisitos) e scripts. package-lock.json garante instalações determinísticas com versões exatas. Use `npm install` em desenvolvimento, `npm ci` em CI/CD. Tipos de dependências determinam quando são instalados. Lockfile sempre deve ser commitado. npm resolve grafo transitivo automaticamente, achatando estrutura quando possível.
