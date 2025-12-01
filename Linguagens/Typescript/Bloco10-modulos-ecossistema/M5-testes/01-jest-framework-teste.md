# Jest como Framework de Teste: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Jest** é **framework de testes JavaScript/TypeScript** desenvolvido pelo Facebook que fornece ambiente completo para escrever, executar e reportar testes unitários, integração e snapshot. Conceitualmente, representa **batteries-included testing**, onde toda infraestrutura necessária (test runner, assertions, mocking, coverage) vem integrada em solução única, eliminando necessidade de múltiplas bibliotecas.

Na essência, Jest materializa o princípio de **zero-configuration testing**, oferecendo defaults inteligentes que funcionam imediatamente em projetos TypeScript/JavaScript modernos, com sintaxe expressiva que torna testes legíveis como documentação viva do comportamento esperado do código.

## 📋 Fundamentos

### Instalação e Setup

```bash
# Instalar Jest e tipos TypeScript
npm install --save-dev jest @types/jest ts-jest

# ts-jest permite Jest executar TypeScript diretamente
npm install --save-dev ts-jest

# Inicializar configuração
npx ts-jest config:init
```

**Arquivo gerado (jest.config.js):**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

**Conceito-chave:** Jest + ts-jest = **transpilação automática** de TypeScript durante testes, sem necessidade de compilar manualmente.

### Primeiro Teste

```typescript
// src/math.ts
export function sum(a: number, b: number): number {
  return a + b;
}

// src/math.spec.ts (ou math.test.ts)
import { sum } from './math';

test('soma 1 + 2 deve retornar 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

```bash
# Executar testes
npx jest

# Output:
# PASS  src/math.spec.ts
#   ✓ soma 1 + 2 deve retornar 3 (2 ms)
```

**Conceito:** Estrutura básica = **test() + expect() + matcher**.

## 🔍 Análise Conceitual

### 1. Anatomia de um Teste

```typescript
test('descrição do teste', () => {
  // Arrange (Preparar)
  const a = 5;
  const b = 3;

  // Act (Agir)
  const result = sum(a, b);

  // Assert (Verificar)
  expect(result).toBe(8);
});
```

**Padrão AAA:**
- **Arrange** - Preparar dados/estado
- **Act** - Executar função sendo testada
- **Assert** - Verificar resultado esperado

**Sintaxe alternativa:**
```typescript
// test() e it() são aliases
it('soma números corretamente', () => {
  expect(sum(2, 3)).toBe(5);
});
```

### 2. Matchers - Assertions

#### Igualdade

```typescript
test('matchers de igualdade', () => {
  // toBe - igualdade estrita (===)
  expect(2 + 2).toBe(4);
  expect('hello').toBe('hello');

  // toEqual - igualdade profunda (objetos/arrays)
  expect({ name: 'João' }).toEqual({ name: 'João' });
  expect([1, 2, 3]).toEqual([1, 2, 3]);

  // toBe vs toEqual
  const obj1 = { id: 1 };
  const obj2 = { id: 1 };
  expect(obj1).not.toBe(obj2);      // ❌ Referências diferentes
  expect(obj1).toEqual(obj2);       // ✅ Valores iguais
});
```

**Conceito:** `toBe()` verifica **identidade** (===), `toEqual()` verifica **valor** (deep equality).

#### Truthiness

```typescript
test('matchers de truthiness', () => {
  expect(true).toBeTruthy();
  expect(false).toBeFalsy();

  expect(null).toBeNull();
  expect(undefined).toBeUndefined();
  expect(42).toBeDefined();

  // Valores truthy/falsy
  expect(1).toBeTruthy();
  expect('').toBeFalsy();
  expect([]).toBeTruthy();
  expect(0).toBeFalsy();
});
```

#### Números

```typescript
test('matchers numéricos', () => {
  const value = 2 + 2;

  expect(value).toBeGreaterThan(3);           // > 3
  expect(value).toBeGreaterThanOrEqual(4);    // >= 4
  expect(value).toBeLessThan(5);              // < 5
  expect(value).toBeLessThanOrEqual(4);       // <= 4

  // Igualdade para floats (evita problemas de precisão)
  expect(0.1 + 0.2).toBeCloseTo(0.3);         // ✅
  expect(0.1 + 0.2).toBe(0.3);                // ❌ Falha por precisão float
});
```

#### Strings

```typescript
test('matchers de string', () => {
  expect('TypeScript').toMatch(/Type/);       // Regex
  expect('Hello World').toMatch(/World/);
  expect('team').not.toMatch(/I/);

  expect('banana').toContain('nan');          // Substring
  expect('hello@email.com').toMatch(/@/);
});
```

#### Arrays e Iteráveis

```typescript
test('matchers de arrays', () => {
  const list = ['apple', 'banana', 'orange'];

  expect(list).toContain('banana');
  expect(list).toHaveLength(3);

  expect(new Set([1, 2, 3])).toContain(2);

  // Verificar todos elementos
  expect(list).toEqual(
    expect.arrayContaining(['banana', 'apple'])
  );
});
```

#### Objetos

```typescript
test('matchers de objetos', () => {
  const user = {
    name: 'João',
    age: 30,
    email: 'joao@email.com'
  };

  // Partial match (contém propriedades)
  expect(user).toMatchObject({
    name: 'João',
    age: 30
  });

  // Verificar propriedade específica
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('email', 'joao@email.com');

  // Estrutura exata
  expect(user).toEqual({
    name: 'João',
    age: 30,
    email: 'joao@email.com'
  });
});
```

#### Exceções

```typescript
test('matchers de exceções', () => {
  function throwError() {
    throw new Error('Ops!');
  }

  // Verificar que função lança erro
  expect(() => throwError()).toThrow();
  expect(() => throwError()).toThrow('Ops!');
  expect(() => throwError()).toThrow(/Ops/);
  expect(() => throwError()).toThrow(Error);

  // IMPORTANTE: passar função, não executar
  expect(throwError).toThrow();        // ✅ Correto
  // expect(throwError()).toThrow();   // ❌ Executa antes do expect
});
```

### 3. Organização com describe()

```typescript
// math.spec.ts
describe('Calculator', () => {
  describe('sum', () => {
    it('soma números positivos', () => {
      expect(sum(1, 2)).toBe(3);
    });

    it('soma números negativos', () => {
      expect(sum(-1, -2)).toBe(-3);
    });

    it('soma zero', () => {
      expect(sum(0, 5)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('multiplica números', () => {
      expect(multiply(2, 3)).toBe(6);
    });
  });
});
```

**Output:**
```
Calculator
  sum
    ✓ soma números positivos
    ✓ soma números negativos
    ✓ soma zero
  multiply
    ✓ multiplica números
```

**Conceito:** `describe()` cria **suítes de testes** agrupadas, melhorando organização e legibilidade.

### 4. Configuração Jest

```javascript
// jest.config.js (completo)
module.exports = {
  // Preset TypeScript
  preset: 'ts-jest',

  // Ambiente de execução
  testEnvironment: 'node',  // ou 'jsdom' para testes de browser

  // Padrões de arquivos de teste
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/*.spec.ts',
    '**/*.test.ts'
  ],

  // Coletar coverage
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.spec.ts'
  ],

  // Transformação de arquivos
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },

  // Module paths (aliases)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### 5. Scripts package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose"
  }
}
```

```bash
# Executar testes
npm test

# Watch mode (re-executa ao salvar)
npm run test:watch

# Com coverage
npm run test:coverage

# Apenas arquivos modificados (git)
npm test -- --onlyChanged
```

### 6. Test Environment

```javascript
// jest.config.js
module.exports = {
  // Node.js (padrão para backend)
  testEnvironment: 'node',

  // Browser (para frontend, React, etc)
  testEnvironment: 'jsdom'
};
```

**Com jsdom:**
```typescript
// Simula ambiente browser
test('DOM manipulation', () => {
  document.body.innerHTML = '<div id="app"></div>';
  const element = document.getElementById('app');
  expect(element).toBeTruthy();
});
```

## 🎯 Aplicabilidade

### Projeto TypeScript Node.js

```
projeto/
├── src/
│   ├── math.ts
│   ├── math.spec.ts
│   ├── user.service.ts
│   └── user.service.spec.ts
├── jest.config.js
├── tsconfig.json
└── package.json
```

**jest.config.js:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts'
  ]
};
```

### Estrutura de Teste Completa

```typescript
// user.service.ts
export class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getAllUsers(): User[] {
    return [...this.users];
  }
}

interface User {
  id: number;
  name: string;
}

// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe('addUser', () => {
    it('deve adicionar usuário', () => {
      const user = { id: 1, name: 'João' };
      service.addUser(user);

      expect(service.getAllUsers()).toHaveLength(1);
      expect(service.getAllUsers()).toContain(user);
    });
  });

  describe('getUserById', () => {
    it('deve retornar usuário quando existe', () => {
      const user = { id: 1, name: 'João' };
      service.addUser(user);

      const result = service.getUserById(1);
      expect(result).toEqual(user);
    });

    it('deve retornar undefined quando não existe', () => {
      const result = service.getUserById(999);
      expect(result).toBeUndefined();
    });
  });
});
```

### Testes Parametrizados

```typescript
describe('sum with test.each', () => {
  test.each([
    [1, 2, 3],
    [2, 3, 5],
    [5, 5, 10],
    [-1, 1, 0]
  ])('sum(%i, %i) should return %i', (a, b, expected) => {
    expect(sum(a, b)).toBe(expected);
  });
});

// Com objetos
describe('calculator', () => {
  test.each([
    { a: 1, b: 2, operation: 'sum', expected: 3 },
    { a: 5, b: 3, operation: 'subtract', expected: 2 },
    { a: 2, b: 4, operation: 'multiply', expected: 8 }
  ])('$operation($a, $b) = $expected', ({ a, b, operation, expected }) => {
    expect(calculator[operation](a, b)).toBe(expected);
  });
});
```

### Only e Skip

```typescript
// Executar apenas este teste
test.only('executar apenas este', () => {
  expect(true).toBe(true);
});

// Pular este teste
test.skip('pular este teste', () => {
  expect(false).toBe(true);
});

// Suíte inteira
describe.only('apenas esta suíte', () => {
  test('teste 1', () => {});
  test('teste 2', () => {});
});

describe.skip('pular esta suíte', () => {
  test('não executado', () => {});
});
```

## ⚠️ Considerações

### 1. Performance

```javascript
// jest.config.js
module.exports = {
  // Cache de transformações
  cache: true,
  cacheDirectory: '.jest-cache',

  // Execução paralela (padrão)
  maxWorkers: '50%',  // Usa 50% dos CPUs

  // Para CI
  maxWorkers: 2       // Limita workers
};
```

### 2. Watch Mode Inteligente

```bash
# Watch apenas arquivos modificados
npm test -- --watch

# Opções no watch:
# › Press a to run all tests.
# › Press f to run only failed tests.
# › Press o to only run tests related to changed files.
# › Press p to filter by a filename regex pattern.
# › Press t to filter by a test name regex pattern.
```

### 3. Debugging

```json
// package.json
{
  "scripts": {
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

```bash
# Executar e abrir Chrome DevTools
npm run test:debug

# Abrir chrome://inspect
# Clicar em "inspect"
```

### 4. tsconfig para Testes

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["jest", "node"]  // Tipos Jest disponíveis
  }
}
```

## 📚 Conclusão

Jest é **framework completo** para testes: test runner, assertions, mocking, coverage integrados. Instalação: jest + @types/jest + ts-jest. Estrutura básica: `test()` + `expect()` + matcher. Matchers principais: toBe (===), toEqual (deep), toContain, toThrow, toHaveProperty. `describe()` agrupa testes. Configuração via jest.config.js: preset ts-jest, testEnvironment (node/jsdom), testMatch patterns. Scripts: test, test:watch, test:coverage. Padrão AAA: Arrange-Act-Assert. test.each para testes parametrizados. Watch mode inteligente. Zero-configuration para TypeScript com ts-jest preset.

