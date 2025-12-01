# Instalação Global vs Local: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Instalação global** instala pacote em **diretório global do sistema**, acessível de qualquer lugar via CLI. **Instalação local** instala em **`node_modules/` do projeto específico**, isolado e versionado por projeto. Conceitualmente, representam **scope tradeoff**: global oferece conveniência (um comando, múltiplos projetos) enquanto local oferece **reprodutibilidade e isolamento** (cada projeto controla suas versões).

Na essência, materializam princípio de **dependency isolation vs system-wide tools**, onde ferramentas CLI podem ser globais para conveniência, mas dependências de projeto devem ser locais para garantir builds reproduzíveis.

## 📋 Fundamentos

### Instalação Local (Padrão)

```bash
# Instalação local (dentro do projeto)
npm install typescript

# Onde é instalado:
# projeto/
# └── node_modules/
#     └── typescript/
#         └── bin/
#             └── tsc

# Adicionado ao package.json
{
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}

# Executar CLI local
npx tsc
# ou
./node_modules/.bin/tsc
# ou via script
"scripts": {
  "build": "tsc"
}
```

### Instalação Global

```bash
# Instalação global (no sistema)
npm install -g typescript

# Onde é instalado (depende do SO):
# Unix/Mac: /usr/local/lib/node_modules/typescript
# Windows: C:\Users\Usuario\AppData\Roaming\npm\node_modules\typescript

# Executável disponível globalmente
tsc --version  # Funciona de qualquer diretório

# NÃO adiciona ao package.json
# NÃO aparece em node_modules do projeto
```

**Conceito-chave:** Local = **projeto-específico** (reproduzível), Global = **sistema-wide** (conveniência).

## 🔍 Análise Conceitual

### 1. Quando Usar Local

```bash
# ✅ Dependências de projeto
npm install express lodash
npm install -D typescript @types/node jest

# Vantagens:
# - Versionado em package.json
# - Reproduzível entre desenvolvedores
# - Isolado (projeto A usa v4, projeto B usa v5)
# - Commitado no git (package.json)
# - CI/CD instala automaticamente

# Estrutura:
projeto-a/
├── package.json  → "typescript": "^4.9.0"
└── node_modules/
    └── typescript@4.9.5/

projeto-b/
├── package.json  → "typescript": "^5.0.0"
└── node_modules/
    └── typescript@5.3.0/
```

### 2. Quando Usar Global

```bash
# ✅ Ferramentas CLI usadas em múltiplos projetos
npm install -g typescript
npm install -g nodemon
npm install -g create-react-app

# Vantagens:
# - Instala uma vez, usa em todos os projetos
# - Comando curto (tsc vs npx tsc)
# - Não precisa adicionar a cada projeto

# Desvantagens:
# - Sem controle de versão por projeto
# - Conflitos se projetos precisam versões diferentes
# - CI/CD precisa configuração extra
# - Não documentado em package.json

# Onde ficam:
~/.npm-global/  # Custom prefix
/usr/local/bin/  # Unix/Mac
C:\Users\...\npm\  # Windows
```

### 3. npx - Melhor de Dois Mundos

```bash
# npx executa pacote SEM instalar globalmente

# 1. Procura em node_modules/.bin local
# 2. Se não achar, baixa temporariamente
# 3. Executa e descarta

npx tsc  # Usa local se existir, senão baixa temp
npx create-react-app my-app  # Baixa, executa, descarta

# Vantagens:
# ✅ Sempre usa versão local do projeto
# ✅ Não polui instalações globais
# ✅ Sempre versão mais recente (se não houver local)

# package.json pode usar diretamente
{
  "scripts": {
    "build": "tsc"  // npm run build usa local automaticamente
  }
}
```

### 4. Comparação Detalhada

```bash
# GLOBAL
npm install -g typescript

# Prós:
# - Uma instalação, múltiplos projetos
# - Comando direto (tsc)
# - Sempre disponível

# Contras:
# - Sem versionamento por projeto
# - Conflitos de versão
# - Não reproduzível
# - Precisa sudo/admin em alguns sistemas

# LOCAL
npm install --save-dev typescript

# Prós:
# - Versionado (package.json)
# - Isolado por projeto
# - Reproduzível
# - CI/CD automático
# - Sem conflitos

# Contras:
# - Precisa npx ou npm run
# - Instalado em cada projeto
# - Ocupa mais espaço
```

### 5. Executar Binários Locais

```bash
# 3 formas de executar CLI local:

# 1. npx (recomendado)
npx tsc

# 2. Caminho completo
./node_modules/.bin/tsc

# 3. npm script
npm run build  # package.json: "build": "tsc"

# npm run adiciona node_modules/.bin ao PATH automaticamente
```

## 🎯 Aplicabilidade

### Setup de Projeto Reproduzível

```json
{
  "name": "meu-projeto",
  "devDependencies": {
    // ✅ Todas ferramentas locais
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.8.0",
    "jest": "^29.0.0"
  },
  "scripts": {
    // Usa versões locais automaticamente
    "build": "tsc",
    "lint": "eslint src",
    "format": "prettier --write src",
    "test": "jest"
  }
}
```

```bash
# Novo desenvolvedor:
git clone projeto
npm install  # Instala versões exatas localmente
npm run build  # Funciona com versão correta
```

### Ferramentas Globais Úteis

```bash
# CLIs de scaffolding (usa npx)
npx create-react-app my-app
npx create-next-app my-app
npx degit user/repo my-project

# Ferramentas de desenvolvimento
npm install -g nodemon  # Auto-restart
npm install -g http-server  # Servidor HTTP simples
npm install -g npm-check-updates  # Atualizar dependencies

# Package managers alternativos
npm install -g yarn
npm install -g pnpm

# Linters/formatters (melhor local)
# npm install -g eslint  # ❌ Evite
npm install --save-dev eslint  # ✅ Use local
```

### CI/CD - Sempre Local

```yaml
# .github/workflows/ci.yml
name: CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      # ✅ npm ci instala dependências locais
      - run: npm ci

      # ✅ Scripts usam versões locais
      - run: npm run build
      - run: npm run lint
      - run: npm test

      # ❌ NÃO fazer:
      # - run: npm install -g typescript
      # - run: tsc  # Usa versão global (não reproduzível)
```

### Workspaces/Monorepo

```json
// Root package.json
{
  "workspaces": [
    "packages/*"
  ],
  "devDependencies": {
    // ✅ Ferramentas compartilhadas no root
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  }
}

// packages/app/package.json
{
  "dependencies": {
    "express": "^4.18.0"
  }
  // Herda typescript, jest, eslint do root
}
```

```bash
# Instala tudo (root + workspaces)
npm install

# Todas workspaces usam mesmo typescript (do root)
cd packages/app
npx tsc  # Usa versão do root
```

## ⚠️ Considerações

### 1. Conflitos de Versão Global

```bash
# Projeto A precisa TypeScript 4.x
cd projeto-a
npm install -g typescript@4.9

# Projeto B precisa TypeScript 5.x
cd projeto-b
npm install -g typescript@5.0
# ⚠️ Sobrescreveu instalação global!

# Projeto A agora usa 5.0 (quebrado!)
cd projeto-a
tsc --version  # 5.0 (deveria ser 4.9)

# ✅ Solução: usar local
cd projeto-a
npm install --save-dev typescript@4.9
npx tsc --version  # 4.9 ✓

cd projeto-b
npm install --save-dev typescript@5.0
npx tsc --version  # 5.0 ✓
```

### 2. Permissões (Sudo)

```bash
# ❌ Global pode precisar de permissões
sudo npm install -g typescript  # Unix/Mac

# ✅ Local nunca precisa
npm install typescript  # Sempre funciona

# Alternativa: configurar prefix para evitar sudo
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### 3. Espaço em Disco

```bash
# Global: uma instalação
~/.npm/  # Cache
/usr/local/lib/node_modules/  # Pacotes globais

# Local: n instalações (n projetos)
projeto1/node_modules/  # 200MB
projeto2/node_modules/  # 200MB
projeto3/node_modules/  # 200MB

# Trade-off:
# Global: menos espaço, menos seguro
# Local: mais espaço, mais seguro/reproduzível

# Solução: pnpm (hard links)
pnpm install  # Compartilha arquivos entre projetos
```

### 4. PATH e Executáveis

```bash
# Global: adiciona ao PATH do sistema
which tsc
# /usr/local/bin/tsc

# Local: não está no PATH
which tsc
# tsc not found

# npx adiciona node_modules/.bin temporariamente ao PATH
npx which tsc
# /projeto/node_modules/.bin/tsc
```

## 📚 Conclusão

Instalação local (`npm install`) é padrão e recomendada: instala em node_modules/, versionada em package.json, isolada por projeto, reproduzível. Instalação global (`npm install -g`) para ferramentas CLI usadas system-wide: conveniência mas sem controle de versão por projeto. Use **npx** para executar CLIs locais sem poluir globais. Scripts npm usam binários locais automaticamente. Global causa conflitos quando projetos precisam versões diferentes. CI/CD sempre usa dependências locais. Scaffolding tools (create-react-app) via npx, não global. Reprodutibilidade > conveniência.
