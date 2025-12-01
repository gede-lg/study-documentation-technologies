# ts-node para Executar TS Diretamente: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**ts-node** é **runtime TypeScript** que executa arquivos `.ts` diretamente no Node.js sem etapa de compilação prévia, transpilando código em memória on-the-fly. Conceitualmente, representa **JIT (Just-In-Time) compilation**, onde TypeScript é convertido para JavaScript imediatamente antes da execução, eliminando workflow de build durante desenvolvimento e permitindo executar scripts TS como se fossem JS nativos.

Na essência, ts-node materializa o princípio de **development convenience**, transformando `tsc → node` em único comando `ts-node`, ideal para prototipagem rápida, scripts utilitários, REPL interativo e desenvolvimento sem overhead de build pipeline, mantendo todos benefícios de type safety do TypeScript.

## 📋 Fundamentos

### Instalação

```bash
# Local (recomendado)
npm install --save-dev ts-node typescript @types/node

# Global (para scripts CLI)
npm install -g ts-node typescript
```

**Conceito-chave:** ts-node **depende** de `typescript` - ambos devem estar instalados.

### Uso Básico

```typescript
// src/hello.ts
function greet(name: string): string {
  return `Hello ${name}!`;
}

console.log(greet('World'));
```

```bash
# Executar diretamente
npx ts-node src/hello.ts
# Output: Hello World!

# Ou com ts-node global
ts-node src/hello.ts
```

**Sem ts-node (workflow tradicional):**
```bash
# 1. Compilar
npx tsc src/hello.ts

# 2. Executar
node src/hello.js
```

**Com ts-node (direto):**
```bash
ts-node src/hello.ts
```

## 🔍 Análise Conceitual

### 1. JIT Compilation

```
Tradicional (tsc):
TypeScript → [Compile] → JavaScript (arquivo) → [Execute] → Output
  hello.ts     tsc         hello.js              node

ts-node:
TypeScript → [Transpile + Execute em memória] → Output
  hello.ts              ts-node
```

**Conceito:** ts-node **não gera arquivos** .js - tudo acontece em memória.

### 2. REPL - Interactive TypeScript

```bash
# Iniciar REPL
npx ts-node
```

```typescript
> const greet = (name: string) => `Hello ${name}`;
undefined

> greet('TypeScript');
'Hello TypeScript'

> interface User { id: number; name: string; }
undefined

> const user: User = { id: 1, name: 'John' };
undefined

> user.name
'John'

> user.age  // ❌ Erro: Property 'age' does not exist on type 'User'
```

**Conceito:** REPL fornece **ambiente interativo** com type checking em tempo real.

### 3. Scripts em package.json

```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "start": "ts-node src/server.ts",
    "seed": "ts-node scripts/seed-database.ts",
    "migrate": "ts-node scripts/run-migrations.ts"
  }
}
```

```bash
npm run dev
npm run seed
```

**Conceito:** ts-node ideal para **scripts de desenvolvimento**.

### 4. tsconfig.json Support

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "ts-node": {
    "transpileOnly": true,  // Modo rápido (sem type checking)
    "files": true           // Carregar tsconfig.json
  }
}
```

**ts-node respeita tsconfig.json automaticamente.**

### 5. Path Mapping

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@models/*": ["src/models/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

```typescript
// src/index.ts
import { User } from '@models/user';
import { formatDate } from '@utils/date';

const user: User = { id: 1, name: 'John' };
console.log(formatDate(new Date()));
```

```bash
# ts-node resolve aliases automaticamente
npx ts-node src/index.ts
```

**Conceito:** ts-node suporta **path aliases** do tsconfig.json.

### 6. ES Modules (ESM)

```json
// package.json
{
  "type": "module"
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node"
  }
}
```

```typescript
// src/index.ts (ESM)
import { User } from './models/user.js';  // .js extension obrigatório

export const greet = (name: string) => `Hello ${name}`;
```

```bash
# Executar com ESM
npx ts-node --esm src/index.ts
```

### 7. Transpile Only Mode

```bash
# Sem type checking (muito mais rápido)
npx ts-node --transpile-only src/index.ts

# Ou via env var
TS_NODE_TRANSPILE_ONLY=true npx ts-node src/index.ts
```

```json
// tsconfig.json
{
  "ts-node": {
    "transpileOnly": true
  }
}
```

**Benchmark:**
```
Type checking:      2000ms
Transpile only:      200ms  (10x mais rápido)
```

**Conceito:** transpileOnly **pula verificação de tipos**, ideal para desenvolvimento rápido.

### 8. ts-node-dev - Auto Restart

```bash
# Instalar
npm install --save-dev ts-node-dev
```

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts"
  }
}
```

```bash
npm run dev
# Reinicia automaticamente ao salvar arquivos
```

**Features:**
- Auto-restart em mudanças
- Transpile only por padrão (rápido)
- Compartilha processo (mais eficiente que nodemon + ts-node)

### 9. Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "runtimeArgs": [
        "-r",
        "ts-node/register"
      ],
      "args": [
        "${workspaceFolder}/src/index.ts"
      ]
    }
  ]
}
```

**Ou via CLI:**
```bash
node --inspect -r ts-node/register src/index.ts
```

## 🎯 Aplicabilidade

### Express Server

```typescript
// src/server.ts
import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello TypeScript!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "start": "node dist/server.js",
    "build": "tsc"
  }
}
```

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build && npm start
```

### Database Scripts

```typescript
// scripts/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' }
    ]
  });

  console.log('Database seeded!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```json
{
  "scripts": {
    "db:seed": "ts-node scripts/seed.ts",
    "db:migrate": "ts-node scripts/migrate.ts"
  }
}
```

### CLI Tools

```typescript
// scripts/generate-types.ts
import fs from 'fs';
import path from 'path';

interface Config {
  input: string;
  output: string;
}

const config: Config = {
  input: './schema.json',
  output: './src/types/generated.ts'
};

function generateTypes(config: Config): void {
  const schema = JSON.parse(fs.readFileSync(config.input, 'utf-8'));

  let output = '// Auto-generated types\n\n';

  for (const [name, type] of Object.entries(schema)) {
    output += `export interface ${name} ${JSON.stringify(type, null, 2)}\n\n`;
  }

  fs.writeFileSync(config.output, output);
  console.log(`Types generated at ${config.output}`);
}

generateTypes(config);
```

```bash
npx ts-node scripts/generate-types.ts
```

### Testing Setup

```typescript
// scripts/test-setup.ts
import { Database } from './database';

export async function setupTestDb(): Promise<Database> {
  const db = new Database({
    host: 'localhost',
    port: 5432,
    database: 'test_db'
  });

  await db.connect();
  await db.migrate();

  return db;
}

export async function teardownTestDb(db: Database): Promise<void> {
  await db.dropAllTables();
  await db.disconnect();
}
```

```json
{
  "scripts": {
    "test:setup": "ts-node scripts/test-setup.ts"
  }
}
```

### Environment-Specific Config

```typescript
// src/config.ts
interface Config {
  port: number;
  database: {
    host: string;
    port: number;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000'),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432')
  }
};

export default config;
```

```bash
# Desenvolvimento
PORT=8080 npx ts-node src/server.ts

# Produção
PORT=3000 node dist/server.js
```

## ⚠️ Considerações

### 1. Performance

```bash
# ❌ Lento (type checking)
ts-node src/large-script.ts
# 5000ms

# ✅ Rápido (transpile only)
ts-node --transpile-only src/large-script.ts
# 500ms
```

**Recomendação:** Use `transpileOnly` em desenvolvimento, type checking em CI.

### 2. Produção

```bash
# ❌ NÃO use ts-node em produção
# Mais lento
# Memória extra
# Dependência dev

# ✅ Use tsc para build de produção
npm run build   # tsc
node dist/server.js
```

**ts-node é ferramenta de desenvolvimento.**

### 3. SWC Alternative (Mais Rápido)

```bash
npm install --save-dev @swc-node/register @swc/core
```

```bash
# Muito mais rápido que ts-node
node -r @swc-node/register src/index.ts
```

**Benchmark:**
```
ts-node:            2000ms
ts-node (transpile): 200ms
swc-node:            100ms  (2x mais rápido)
```

### 4. Memory Usage

```bash
# ts-node usa mais memória (compila em memória)
ts-node src/index.ts
# ~100MB overhead

# Node puro
node dist/index.js
# ~50MB
```

### 5. Register Hook

```typescript
// register.js
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs'
  }
});

require('./src/index.ts');
```

```bash
node register.js
```

### 6. Type Checking Separado

```json
{
  "scripts": {
    "dev": "ts-node-dev --transpile-only src/server.ts",
    "typecheck": "tsc --noEmit",
    "test": "npm run typecheck && jest"
  }
}
```

**Workflow:**
- Desenvolvimento: transpile only (rápido)
- CI/CD: type checking (seguro)

## 📚 Conclusão

ts-node executa **TypeScript diretamente** sem compilação prévia, transpilando em memória on-the-fly. Uso: `npx ts-node file.ts` ou scripts npm. REPL interativo com type checking. Respeita tsconfig.json e path aliases. **transpileOnly mode** 10x mais rápido (pula type checking). ts-node-dev para auto-restart. Ideal para desenvolvimento, scripts, protótipos. **Não usar em produção** - compilar com tsc. Alternativas: swc-node (2x mais rápido). Suporte ESM com --esm. Debug via -r ts-node/register. Scripts de seed, migrations, CLI tools. package.json scripts para dev/seed/migrate. Rodar type checking separado (tsc --noEmit) em CI.

