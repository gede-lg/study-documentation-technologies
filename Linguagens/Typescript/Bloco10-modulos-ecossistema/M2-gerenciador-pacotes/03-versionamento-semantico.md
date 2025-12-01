# Versionamento Semântico (Semver): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Versionamento Semântico** (Semantic Versioning / SemVer) é **convenção de numeração de versões** no formato `MAJOR.MINOR.PATCH` que comunica tipo de mudança através dos números. Conceitualmente, representa **contract communication**, onde cada parte do número transmite informação específica sobre compatibilidade e natureza das mudanças entre versões.

Na essência, SemVer materializa o princípio de **predictable breaking changes**, permitindo que desenvolvedores entendam imediatamente se atualização é segura (patch/minor) ou requer atenção (major), facilitando gestão de dependências em ecossistema distribuído.

## 📋 Fundamentos

### Formato: MAJOR.MINOR.PATCH

```
1.4.2
│ │ │
│ │ └─ PATCH: Bug fixes (compatível)
│ └─── MINOR: Novas funcionalidades (compatível)
└───── MAJOR: Breaking changes (INCOMPATÍVEL)

Exemplos:
1.0.0  → Versão inicial estável
1.0.1  → Correção de bug
1.1.0  → Nova funcionalidade (compatível com 1.0.x)
2.0.0  → Breaking change (PODE quebrar código que usa 1.x.x)
```

**Conceito-chave:** Números comunicam **tipo e impacto** da mudança, não apenas sequência cronológica.

### Regras Básicas

```
1. MAJOR (X.0.0): Breaking changes
   - API pública muda de forma incompatível
   - Código que funcionava pode quebrar
   - Exemplo: remover função, mudar assinatura, alterar comportamento

2. MINOR (0.X.0): Nova funcionalidade compatível
   - Adiciona features SEM quebrar código existente
   - API pública cresce
   - Exemplo: nova função, novo parâmetro opcional

3. PATCH (0.0.X): Bug fixes compatíveis
   - Corrige bugs SEM adicionar features
   - Comportamento incorreto é consertado
   - Exemplo: corrigir bug, melhorar performance

Pre-release: 1.0.0-alpha, 1.0.0-beta.1, 1.0.0-rc.2
Build metadata: 1.0.0+20240115, 1.0.0+sha.5114f85
```

## 🔍 Análise Conceitual

### 1. Ranges em package.json

```json
{
  "dependencies": {
    // Ranges permitem atualizações automáticas

    "lodash": "4.17.21",      // EXATA: apenas 4.17.21
    "express": "^4.18.0",     // CARET: >=4.18.0 <5.0.0
    "jest": "~29.5.0",        // TILDE: >=29.5.0 <29.6.0
    "typescript": "*",        // QUALQUER: última versão
    "react": ">=17.0.0",      // MAIOR/IGUAL: 17.0.0 ou superior
    "node": "18.x",           // X-range: 18.0.0 até 18.999.999
    "axios": "^1.0.0 || ^2.0.0"  // OR: 1.x.x OU 2.x.x
  }
}
```

**Símbolos principais:**

```bash
# ^ (caret) - Minor + Patch updates
^1.2.3  →  >=1.2.3 <2.0.0
^0.2.3  →  >=0.2.3 <0.3.0  (especial para 0.x)
^0.0.3  →  >=0.0.3 <0.0.4  (especial para 0.0.x)

# ~ (tilde) - Apenas Patch updates
~1.2.3  →  >=1.2.3 <1.3.0
~1.2    →  >=1.2.0 <1.3.0
~1      →  >=1.0.0 <2.0.0

# >= <= > < = - Comparadores
>=1.2.3  →  1.2.3 ou superior
<2.0.0   →  Menor que 2.0.0

# * x - Wildcards
*       →  Qualquer versão
1.x     →  >=1.0.0 <2.0.0
1.2.x   →  >=1.2.0 <1.3.0

# || - OR lógico
^1.0.0 || ^2.0.0  →  1.x.x OU 2.x.x
```

### 2. Exemplos de Mudanças

```typescript
// Versão 1.0.0
class Calculator {
  sum(a: number, b: number): number {
    return a + b;
  }
}

// PATCH: 1.0.1 (bug fix)
class Calculator {
  sum(a: number, b: number): number {
    return a + b;  // Corrigiu bug que retornava a * b
  }
}

// MINOR: 1.1.0 (nova funcionalidade compatível)
class Calculator {
  sum(a: number, b: number): number {
    return a + b;
  }

  // ✅ Nova funcionalidade
  multiply(a: number, b: number): number {
    return a * b;
  }
}

// MINOR: 1.2.0 (parâmetro opcional - compatível)
class Calculator {
  // ✅ Parâmetro opcional não quebra código existente
  sum(a: number, b: number, c?: number): number {
    return a + b + (c || 0);
  }

  multiply(a: number, b: number): number {
    return a * b;
  }
}

// MAJOR: 2.0.0 (breaking change)
class Calculator {
  // ❌ Mudou assinatura - QUEBRA código existente
  sum(...numbers: number[]): number {
    return numbers.reduce((acc, n) => acc + n, 0);
  }

  multiply(...numbers: number[]): number {
    return numbers.reduce((acc, n) => acc * n, 1);
  }
}
```

### 3. Pre-release Versions

```
1.0.0-alpha       → Alpha (instável, desenvolvimento inicial)
1.0.0-alpha.1     → Alpha 1
1.0.0-beta        → Beta (features completas, testando)
1.0.0-beta.2      → Beta 2
1.0.0-rc.1        → Release Candidate 1 (quase pronto)
1.0.0             → Release estável

Ordem de precedência:
1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-rc.1 < 1.0.0
```

```bash
# Instalar pre-release
npm install package@next
npm install package@1.0.0-beta.1

# Publicar pre-release
npm publish --tag beta
npm publish --tag next
```

### 4. Build Metadata

```
1.0.0+20240115       → Build de 15/01/2024
1.0.0+sha.5114f85    → Build com commit SHA
1.0.0+001            → Build número 001

Build metadata NÃO afeta precedência:
1.0.0+build1 = 1.0.0+build2  (mesma versão)
```

### 5. Versão 0.x.x (Desenvolvimento Inicial)

```
0.x.x = INSTÁVEL

0.1.0  → Desenvolvimento inicial
0.2.0  → PODE ter breaking changes
0.3.0  → PODE ter breaking changes

Convenção especial:
0.x.y  → y pode ter breaking changes
       → Não há garantia de compatibilidade

1.0.0  → PRIMEIRA versão estável pública
       → Partir daqui SemVer é seguido estritamente
```

## 🎯 Aplicabilidade

### Gestão de Versões no Projeto

```bash
# Visualizar versão atual
npm version

# Incrementar versão
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.1 → 1.1.0
npm version major  # 1.1.0 → 2.0.0

# Pre-release
npm version prerelease  # 1.0.0 → 1.0.1-0
npm version prepatch    # 1.0.0 → 1.0.1-0
npm version preminor    # 1.0.0 → 1.1.0-0
npm version premajor    # 1.0.0 → 2.0.0-0

# Específica
npm version 2.5.0

# O que npm version faz:
# 1. Atualiza version em package.json
# 2. Cria git commit
# 3. Cria git tag
# 4. Pode executar scripts (preversion, version, postversion)
```

### Changelog e Release Notes

```markdown
# CHANGELOG.md

## [2.0.0] - 2024-01-15

### Breaking Changes
- Mudou assinatura de `process()` para aceitar options object
- Removeu método deprecated `oldMethod()`

### Added
- Nova função `newFeature()` para processar dados
- Suporte a async/await em todas APIs

### Fixed
- Corrigido bug em `calculate()` que retornava NaN

## [1.2.0] - 2023-12-01

### Added
- Parâmetro opcional `timeout` em `fetch()`

### Fixed
- Memory leak em `subscribe()`

## [1.1.0] - 2023-11-15

### Added
- Método `validate()` para validação de dados
```

### Estratégias de Range

```json
{
  "dependencies": {
    // Conservador: apenas patches
    "critical-lib": "~1.5.0",  // Aceita 1.5.x

    // Moderado: minor + patch (padrão npm)
    "stable-lib": "^1.5.0",    // Aceita 1.x.x

    // Agressivo: qualquer >= versão
    "experimental": ">=1.5.0", // Aceita tudo >= 1.5.0

    // Travado: versão exata
    "exact-version": "1.5.0"   // Apenas 1.5.0
  }
}
```

### Bibliotecas vs Aplicações

```json
// Biblioteca (compartilhada)
{
  "name": "@meu/biblioteca",
  "dependencies": {
    // ✅ Ranges permissivos
    "lodash": "^4.17.0"  // Permite 4.17.x, 4.18.x, 4.99.x
  },
  "peerDependencies": {
    // ✅ Ainda mais permissivo
    "react": ">=17.0.0"  // Usuário decide versão exata
  }
}

// Aplicação (final)
{
  "name": "meu-app",
  "dependencies": {
    // ✅ Versões exatas (via package-lock.json)
    "express": "^4.18.0"  // Range em package.json
    // mas package-lock.json trava em 4.18.2
  }
}
```

## ⚠️ Considerações

### 1. npm vs yarn vs pnpm

```bash
# npm
^1.2.3  →  >=1.2.3 <2.0.0

# Todos seguem SemVer igualmente
# Diferença está em como resolvem dependências transitivas
```

### 2. Breaking Changes Acidentais

```typescript
// ❌ Breaking change disfarçado de minor
// Versão 1.0.0
function process(data: string): void { }

// Versão 1.1.0 (deveria ser 2.0.0!)
function process(data: string | number): void { }
// Quebra se usuário fazia:
// const fn: (data: string) => void = process;
```

### 3. Dependências Transitivas

```json
// Seu projeto
{
  "dependencies": {
    "lib-a": "^1.0.0"  // Você controla
  }
}

// lib-a/package.json
{
  "dependencies": {
    "lib-b": "^2.0.0"  // lib-a controla (transitiva)
  }
}

// Você NÃO controla versão exata de lib-b
// package-lock.json trava, mas lib-a pode atualizar
```

### 4. npm outdated

```bash
# Ver pacotes desatualizados
npm outdated

# Output:
# Package   Current  Wanted  Latest
# lodash    4.17.20  4.17.21 4.17.21
# express   4.18.0   4.18.2  4.18.2
```

## 📚 Conclusão

Versionamento Semântico usa formato MAJOR.MINOR.PATCH para comunicar tipo de mudança: MAJOR (breaking changes), MINOR (novas features compatíveis), PATCH (bug fixes). Ranges em package.json (`^`, `~`) permitem atualizações automáticas dentro de limites seguros. `^` permite minor+patch, `~` apenas patch. Pre-releases (alpha, beta, rc) e build metadata (+) estendem formato. Versão 0.x.x é instável. npm version incrementa e cria tags git. package-lock.json trava versões exatas. Bibliotecas usam ranges permissivos, aplicações versões exatas via lockfile. SemVer fundamental para ecossistema npm funcionar.
