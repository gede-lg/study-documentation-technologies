# Coverage de Testes: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Coverage** (cobertura de testes) é **métrica** que mede quantos porcento do código foi executado durante testes, rastreando linhas, branches (condições), funções e statements cobertos. Conceitualmente, representa **completeness indicator**, mostrando quais partes do código foram testadas e quais ainda carecem de testes, funcionando como mapa de gaps de qualidade.

Na essência, coverage materializa o princípio de **measurable quality**, transformando qualidade abstrata de testes em números concretos (80% coverage, 100% de funções testadas), mas deve ser interpretado como **ferramenta de descoberta** (onde NÃO testamos) e não como meta absoluta (100% coverage não garante ausência de bugs).

## 📋 Fundamentos

### Tipos de Coverage

```
1. Line Coverage (Cobertura de Linhas)
   - % de linhas executadas nos testes

2. Branch Coverage (Cobertura de Branches)
   - % de condições (if/else) testadas

3. Function Coverage (Cobertura de Funções)
   - % de funções chamadas nos testes

4. Statement Coverage (Cobertura de Statements)
   - % de statements executados
```

**Conceito-chave:** Coverage mede **execução**, não **qualidade** - linha executada ≠ linha testada corretamente.

### Configurar Coverage no Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Coletar coverage
  collectCoverage: true,

  // De quais arquivos coletar
  collectCoverageFrom: [
    'src/**/*.ts',           // Todos .ts em src/
    '!src/**/*.spec.ts',     // Excluir testes
    '!src/**/*.d.ts',        // Excluir definições
    '!src/index.ts'          // Excluir entry point
  ],

  // Thresholds mínimos
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Formato de relatório
  coverageReporters: [
    'text',          // Console
    'html',          // Navegador
    'lcov'           // Integrações CI
  ]
};
```

**Scripts package.json:**
```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:coverage:watch": "jest --coverage --watch"
  }
}
```

### Executar Coverage

```bash
npm run test:coverage

# Output no console:
# ----------|---------|----------|---------|---------|-------------------
# File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
# ----------|---------|----------|---------|---------|-------------------
# All files |   85.71 |    66.67 |     100 |   85.71 |
#  math.ts  |   85.71 |    66.67 |     100 |   85.71 | 12
# ----------|---------|----------|---------|---------|-------------------

# Relatório HTML gerado em: coverage/index.html
```

## 🔍 Análise Conceitual

### 1. Line Coverage

```typescript
// src/calculator.ts
export function divide(a: number, b: number): number {
  if (b === 0) {                    // Linha 2
    throw new Error('Division by zero');  // Linha 3
  }
  return a / b;                     // Linha 5
}

// Teste que cobre 60% das linhas
test('divide números', () => {
  expect(divide(10, 2)).toBe(5);    // Executa linhas 2 (false), 5
});

// Coverage:
// Linha 2: ✅ Executada (condição false)
// Linha 3: ❌ NÃO executada
// Linha 5: ✅ Executada
// Line Coverage: 66.67% (2 de 3)
```

**Para 100% de linha:**
```typescript
test('divide números', () => {
  expect(divide(10, 2)).toBe(5);
});

test('lança erro ao dividir por zero', () => {
  expect(() => divide(10, 0)).toThrow('Division by zero');
});

// Coverage:
// Todas linhas executadas
// Line Coverage: 100%
```

### 2. Branch Coverage

```typescript
// src/discount.ts
export function calculateDiscount(price: number, isPremium: boolean): number {
  if (isPremium) {              // Branch 1
    return price * 0.9;         // 10% desconto
  } else {                      // Branch 2
    return price;               // Sem desconto
  }
}

// Teste com 50% branch coverage
test('calcula desconto para premium', () => {
  expect(calculateDiscount(100, true)).toBe(90);
});

// Coverage:
// Branch true: ✅ Testado
// Branch false: ❌ NÃO testado
// Branch Coverage: 50%
```

**Para 100% de branch:**
```typescript
test('calcula desconto para premium', () => {
  expect(calculateDiscount(100, true)).toBe(90);
});

test('sem desconto para não-premium', () => {
  expect(calculateDiscount(100, false)).toBe(100);
});

// Branch Coverage: 100%
```

**Exemplo complexo:**
```typescript
export function getStatus(age: number, hasLicense: boolean): string {
  if (age >= 18) {
    if (hasLicense) {
      return 'Can drive';
    } else {
      return 'Cannot drive - no license';
    }
  } else {
    return 'Too young';
  }
}

// Branches:
// 1. age >= 18 (true)
// 2. age >= 18 (false)
// 3. hasLicense (true)
// 4. hasLicense (false)

// Para 100% branch coverage, precisa testar:
test.each([
  [18, true, 'Can drive'],
  [18, false, 'Cannot drive - no license'],
  [17, true, 'Too young'],
  [17, false, 'Too young']
])('getStatus(%i, %s) = %s', (age, hasLicense, expected) => {
  expect(getStatus(age, hasLicense)).toBe(expected);
});
```

### 3. Function Coverage

```typescript
// src/utils.ts
export class StringUtils {
  uppercase(str: string): string {    // Função 1
    return str.toUpperCase();
  }

  lowercase(str: string): string {    // Função 2
    return str.toLowerCase();
  }

  capitalize(str: string): string {   // Função 3
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }
}

// Teste com 33.33% function coverage
test('uppercase', () => {
  const utils = new StringUtils();
  expect(utils.uppercase('hello')).toBe('HELLO');
});

// Coverage:
// uppercase: ✅ Chamada
// lowercase: ❌ Não chamada
// capitalize: ❌ Não chamada
// Function Coverage: 33.33% (1 de 3)
```

### 4. Statement Coverage

```typescript
export function processUser(user: { name: string; age?: number }) {
  const name = user.name;                    // Statement 1
  const age = user.age ?? 0;                 // Statement 2
  const isAdult = age >= 18;                 // Statement 3
  return { name, age, isAdult };             // Statement 4
}

// Teste
test('processa usuário', () => {
  const result = processUser({ name: 'João', age: 25 });
  expect(result.isAdult).toBe(true);
});

// Todos statements executados
// Statement Coverage: 100%
```

## 🎯 Interpretando Relatórios

### Relatório Console

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   78.57 |    66.67 |   85.71 |   78.57 |
 calculator.ts      |     100 |      100 |     100 |     100 |
 validators.ts      |   66.67 |       50 |      75 |   66.67 | 12-15,23
 user.service.ts    |      80 |    66.67 |     100 |      80 | 45,52
--------------------|---------|----------|---------|---------|-------------------
```

**Interpretação:**
- **% Stmts**: 78.57% dos statements executados
- **% Branch**: 66.67% das condições testadas
- **% Funcs**: 85.71% das funções chamadas
- **% Lines**: 78.57% das linhas executadas
- **Uncovered Line #s**: Linhas 12-15 e 23 de validators.ts não cobertas

### Relatório HTML

```bash
npm run test:coverage
open coverage/index.html
```

**Visualização:**
- Lista de arquivos com barras coloridas (verde/amarelo/vermelho)
- Click em arquivo mostra código-fonte
- Linhas verdes: cobertas
- Linhas vermelhas: não cobertas
- Branches destacados (if/else)

### Coverage Thresholds

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    // Global para todo projeto
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },

    // Por arquivo específico
    './src/critical.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },

    // Por padrão
    './src/utils/**/*.ts': {
      branches: 90,
      functions: 90
    }
  }
};
```

**Se threshold não for atingido:**
```bash
$ npm test

Jest: "global" coverage threshold for branches (80%) not met: 66.67%
```

## 🎯 Aplicabilidade

### Estratégia de Coverage

```typescript
// 1. CRÍTICO: 100% coverage
// Lógica de pagamento, segurança, cálculos financeiros
export class PaymentProcessor {
  processPayment(amount: number, method: string): Result {
    // Teste exaustivo de todos branches
  }
}

// 2. IMPORTANTE: 80-90% coverage
// Lógica de negócio principal
export class OrderService {
  createOrder(items: Item[]): Order {
    // Teste de casos principais + erros
  }
}

// 3. UTILITÁRIO: 60-70% coverage
// Helpers, formatters
export const formatDate = (date: Date): string => {
  // Teste de casos comuns
};

// 4. INFRA: Pode ter coverage baixo
// Configurações, setup inicial
export const config = {
  apiKey: process.env.API_KEY
};
```

### Coverage em CI/CD

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

### Badge de Coverage

```markdown
# README.md

[![Coverage](https://codecov.io/gh/usuario/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/usuario/repo)

![Coverage: 85%](https://img.shields.io/badge/coverage-85%25-green)
```

### Incremental Coverage

```javascript
// jest.config.js
module.exports = {
  // Apenas arquivos modificados
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts'
  ],

  // Threshold para arquivos novos/modificados
  coverageThreshold: {
    global: {
      branches: 80
    }
  }
};
```

```bash
# Coverage apenas de arquivos modificados (Git)
npm test -- --coverage --changedSince=origin/main
```

## ⚠️ Considerações

### 1. 100% Coverage ≠ 100% Testado

```typescript
export function divide(a: number, b: number): number {
  return a / b;  // 100% coverage com 1 teste
}

test('divide', () => {
  expect(divide(10, 2)).toBe(5);  // ✅ 100% coverage
  // MAS: não testa divisão por zero!
  // MAS: não testa números negativos!
  // MAS: não testa floats!
});
```

**Coverage mede execução, não qualidade.**

### 2. Coverage Não Testa Lógica de Negócio

```typescript
export function calculateDiscount(price: number): number {
  return price * 0.9;  // BUG: deveria ser 0.10 (10%)
}

test('calcula desconto', () => {
  calculateDiscount(100);  // ✅ 100% coverage
  // MAS: não verifica resultado!
});
```

**Precisa de assertions, não apenas execução.**

### 3. Coverage Gaming

```typescript
// ❌ Ruim: teste só para aumentar coverage
test('executa função', () => {
  myFunction();  // Sem assertion
});

// ✅ Bom: testa comportamento
test('função retorna resultado correto', () => {
  const result = myFunction();
  expect(result).toBe(expected);
});
```

### 4. Exclusão Intencional

```typescript
// istanbul ignore next
export function debugOnly() {
  console.log('Debug info');
}

/* istanbul ignore next */
export const developmentConfig = {
  // Config apenas para dev
};

// Não será contado no coverage
```

### 5. Meta Realista

```
Código Crítico:   95-100% coverage
Código Normal:    70-85% coverage
Código Utilitário: 60-70% coverage
Projeto Geral:     80% coverage (meta comum)
```

**Coverage alto demais pode indicar:**
- Testes superficiais apenas executando código
- Muito tempo gasto em testes de baixo valor

### 6. Coverage vs Mutation Testing

```typescript
// 100% coverage
export function isEven(n: number): boolean {
  return n % 2 === 0;
}

test('testa isEven', () => {
  isEven(2);  // ✅ Coverage 100%
});

// MAS mutation testing detectaria:
// Mutação: n % 2 === 1
// Este teste não pegaria o bug!
```

**Coverage não detecta lógica errada, apenas execução.**

## 📚 Conclusão

Coverage mede **% de código executado** em testes: Line (linhas), Branch (condições), Function (funções), Statement (statements). Configurar via jest.config.js: collectCoverageFrom, coverageThreshold. Executar com --coverage. Relatórios: text (console), html (navegador), lcov (CI). Thresholds definem mínimos aceitáveis. **100% coverage ≠ código bem testado** - mede execução, não qualidade. Meta realista: 80% geral. Coverage é ferramenta de **descoberta** (onde não testamos), não métrica absoluta. Crítico: alta coverage. Utilitário: coverage menor OK. Integrar com CI/CD e serviços como Codecov.

