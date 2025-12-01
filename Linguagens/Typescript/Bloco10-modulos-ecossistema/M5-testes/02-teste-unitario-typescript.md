# Teste Unitário com TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Teste unitário** é **teste automatizado** que verifica comportamento de **unidade isolada** de código (função, método, classe) independentemente de dependências externas. Com **TypeScript**, testes unitários aproveitam **sistema de tipos** para garantir não apenas lógica correta mas também contratos de tipo corretos. Conceitualmente, representam **executable specification**, documentando e validando comportamento esperado através de exemplos concretos executáveis.

Na essência, testes unitários materializam o princípio de **fail fast + confidence**, onde erros são detectados imediatamente em desenvolvimento (não em produção) e cada mudança de código pode ser validada automaticamente, criando rede de segurança que permite refatoração e evolução confiante do código.

## 📋 Fundamentos

### O Que é "Unidade"?

```typescript
// Unidade = menor parte testável isoladamente

// Função pura (unidade ideal)
export function calculateDiscount(price: number, percentage: number): number {
  return price * (1 - percentage / 100);
}

// Método de classe
export class Calculator {
  sum(a: number, b: number): number {  // Unidade
    return a + b;
  }
}

// Módulo com múltiplas funções relacionadas
export const StringUtils = {
  capitalize(str: string): string { },  // Unidade
  reverse(str: string): string { }      // Unidade
};
```

**Conceito-chave:** Unidade = **código testável isoladamente** sem dependências complexas (DB, API, filesystem).

### Estrutura de Teste Unitário

```typescript
// src/calculator.ts
export class Calculator {
  sum(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
}

// src/calculator.spec.ts
import { Calculator } from './calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('sum', () => {
    it('deve somar dois números positivos', () => {
      // Arrange
      const a = 5;
      const b = 3;

      // Act
      const result = calculator.sum(a, b);

      // Assert
      expect(result).toBe(8);
    });

    it('deve somar números negativos', () => {
      expect(calculator.sum(-5, -3)).toBe(-8);
    });

    it('deve somar zero', () => {
      expect(calculator.sum(0, 5)).toBe(5);
    });
  });

  describe('divide', () => {
    it('deve dividir números normalmente', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    it('deve lançar erro ao dividir por zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Cannot divide by zero');
    });
  });
});
```

**Padrão AAA:**
- **Arrange** - Preparar dados de entrada
- **Act** - Executar código sendo testado
- **Assert** - Verificar resultado

## 🔍 Análise Conceitual

### 1. Testando Funções Puras

```typescript
// src/validators.ts
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string): string {
  return input.trim().toLowerCase();
}

// src/validators.spec.ts
describe('Validators', () => {
  describe('isValidEmail', () => {
    it('deve validar email correto', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });

    it('deve rejeitar email sem @', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });

    it('deve rejeitar email sem domínio', () => {
      expect(isValidEmail('user@')).toBe(false);
    });

    it('deve rejeitar string vazia', () => {
      expect(isValidEmail('')).toBe(false);
    });

    // Testes de borda
    it('deve aceitar email com subdomínio', () => {
      expect(isValidEmail('user@mail.example.com')).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('deve remover espaços', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('deve converter para lowercase', () => {
      expect(sanitizeInput('HELLO')).toBe('hello');
    });

    it('deve fazer ambos', () => {
      expect(sanitizeInput('  HELLO World  ')).toBe('hello world');
    });
  });
});
```

**Conceito:** Funções puras são **ideais para testes** - sem side effects, resultado depende apenas de inputs.

### 2. Testando Classes com Estado

```typescript
// src/shopping-cart.ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

export class ShoppingCart {
  private items: Product[] = [];

  addItem(product: Product): void {
    this.items.push(product);
  }

  removeItem(productId: number): void {
    this.items = this.items.filter(item => item.id !== productId);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

// src/shopping-cart.spec.ts
describe('ShoppingCart', () => {
  let cart: ShoppingCart;

  // Setup antes de CADA teste
  beforeEach(() => {
    cart = new ShoppingCart();
  });

  describe('addItem', () => {
    it('deve adicionar item ao carrinho', () => {
      const product: Product = { id: 1, name: 'Laptop', price: 1000 };

      cart.addItem(product);

      expect(cart.getItemCount()).toBe(1);
    });

    it('deve adicionar múltiplos items', () => {
      const product1: Product = { id: 1, name: 'Laptop', price: 1000 };
      const product2: Product = { id: 2, name: 'Mouse', price: 50 };

      cart.addItem(product1);
      cart.addItem(product2);

      expect(cart.getItemCount()).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('deve remover item pelo ID', () => {
      const product: Product = { id: 1, name: 'Laptop', price: 1000 };
      cart.addItem(product);

      cart.removeItem(1);

      expect(cart.getItemCount()).toBe(0);
    });

    it('não deve afetar carrinho se ID não existe', () => {
      const product: Product = { id: 1, name: 'Laptop', price: 1000 };
      cart.addItem(product);

      cart.removeItem(999);

      expect(cart.getItemCount()).toBe(1);
    });
  });

  describe('getTotal', () => {
    it('deve retornar 0 para carrinho vazio', () => {
      expect(cart.getTotal()).toBe(0);
    });

    it('deve calcular total de um item', () => {
      const product: Product = { id: 1, name: 'Laptop', price: 1000 };
      cart.addItem(product);

      expect(cart.getTotal()).toBe(1000);
    });

    it('deve calcular total de múltiplos items', () => {
      cart.addItem({ id: 1, name: 'Laptop', price: 1000 });
      cart.addItem({ id: 2, name: 'Mouse', price: 50 });
      cart.addItem({ id: 3, name: 'Keyboard', price: 150 });

      expect(cart.getTotal()).toBe(1200);
    });
  });

  describe('clear', () => {
    it('deve esvaziar carrinho', () => {
      cart.addItem({ id: 1, name: 'Laptop', price: 1000 });
      cart.addItem({ id: 2, name: 'Mouse', price: 50 });

      cart.clear();

      expect(cart.getItemCount()).toBe(0);
      expect(cart.getTotal()).toBe(0);
    });
  });
});
```

**Conceito:** Classes com estado requerem **isolamento** - cada teste começa com estado limpo (beforeEach).

### 3. Testando Lógica de Negócio

```typescript
// src/discount-calculator.ts
export enum CustomerType {
  Regular = 'REGULAR',
  Premium = 'PREMIUM',
  VIP = 'VIP'
}

export class DiscountCalculator {
  calculateDiscount(price: number, customerType: CustomerType): number {
    let discountPercentage = 0;

    switch (customerType) {
      case CustomerType.Regular:
        discountPercentage = 0;
        break;
      case CustomerType.Premium:
        discountPercentage = 10;
        break;
      case CustomerType.VIP:
        discountPercentage = 20;
        break;
    }

    // Desconto adicional para compras acima de 1000
    if (price > 1000) {
      discountPercentage += 5;
    }

    return price * (1 - discountPercentage / 100);
  }
}

// src/discount-calculator.spec.ts
describe('DiscountCalculator', () => {
  let calculator: DiscountCalculator;

  beforeEach(() => {
    calculator = new DiscountCalculator();
  });

  describe('calculateDiscount', () => {
    describe('para cliente Regular', () => {
      it('deve retornar preço cheio para compras < 1000', () => {
        const result = calculator.calculateDiscount(500, CustomerType.Regular);
        expect(result).toBe(500);
      });

      it('deve aplicar 5% de desconto para compras > 1000', () => {
        const result = calculator.calculateDiscount(1500, CustomerType.Regular);
        expect(result).toBe(1425); // 1500 * 0.95
      });
    });

    describe('para cliente Premium', () => {
      it('deve aplicar 10% de desconto', () => {
        const result = calculator.calculateDiscount(500, CustomerType.Premium);
        expect(result).toBe(450); // 500 * 0.90
      });

      it('deve aplicar 15% para compras > 1000', () => {
        const result = calculator.calculateDiscount(1500, CustomerType.Premium);
        expect(result).toBe(1275); // 1500 * 0.85
      });
    });

    describe('para cliente VIP', () => {
      it('deve aplicar 20% de desconto', () => {
        const result = calculator.calculateDiscount(500, CustomerType.VIP);
        expect(result).toBe(400); // 500 * 0.80
      });

      it('deve aplicar 25% para compras > 1000', () => {
        const result = calculator.calculateDiscount(1500, CustomerType.VIP);
        expect(result).toBe(1125); // 1500 * 0.75
      });
    });

    // Casos de borda
    describe('casos de borda', () => {
      it('deve funcionar com valor exato 1000', () => {
        const result = calculator.calculateDiscount(1000, CustomerType.Regular);
        expect(result).toBe(1000);
      });

      it('deve funcionar com valor 1000.01', () => {
        const result = calculator.calculateDiscount(1000.01, CustomerType.Regular);
        expect(result).toBeCloseTo(950.01, 2);
      });
    });
  });
});
```

**Conceito:** Lógica de negócio complexa requer **testes exaustivos** cobrindo todas combinações e casos de borda.

### 4. Testando Tratamento de Erros

```typescript
// src/user-validator.ts
export class UserValidator {
  validateAge(age: number): void {
    if (age < 0) {
      throw new Error('Age cannot be negative');
    }

    if (age < 18) {
      throw new Error('User must be at least 18 years old');
    }

    if (age > 150) {
      throw new Error('Invalid age');
    }
  }

  validateEmail(email: string): void {
    if (!email) {
      throw new Error('Email is required');
    }

    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
  }
}

// src/user-validator.spec.ts
describe('UserValidator', () => {
  let validator: UserValidator;

  beforeEach(() => {
    validator = new UserValidator();
  });

  describe('validateAge', () => {
    it('deve aceitar idade válida', () => {
      expect(() => validator.validateAge(25)).not.toThrow();
    });

    it('deve lançar erro para idade negativa', () => {
      expect(() => validator.validateAge(-1)).toThrow('Age cannot be negative');
    });

    it('deve lançar erro para menor de idade', () => {
      expect(() => validator.validateAge(17)).toThrow('User must be at least 18 years old');
    });

    it('deve lançar erro para idade inválida', () => {
      expect(() => validator.validateAge(200)).toThrow('Invalid age');
    });

    // Casos de borda
    it('deve aceitar exatamente 18 anos', () => {
      expect(() => validator.validateAge(18)).not.toThrow();
    });

    it('deve aceitar exatamente 150 anos', () => {
      expect(() => validator.validateAge(150)).not.toThrow();
    });
  });

  describe('validateEmail', () => {
    it('deve aceitar email válido', () => {
      expect(() => validator.validateEmail('user@example.com')).not.toThrow();
    });

    it('deve lançar erro para email vazio', () => {
      expect(() => validator.validateEmail('')).toThrow('Email is required');
    });

    it('deve lançar erro para email sem @', () => {
      expect(() => validator.validateEmail('invalid')).toThrow('Invalid email format');
    });
  });
});
```

### 5. Testes com Tipos TypeScript

```typescript
// src/type-safe-storage.ts
export class TypeSafeStorage<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
}

// src/type-safe-storage.spec.ts
describe('TypeSafeStorage', () => {
  describe('com números', () => {
    let storage: TypeSafeStorage<number>;

    beforeEach(() => {
      storage = new TypeSafeStorage<number>();
    });

    it('deve armazenar números', () => {
      storage.add(1);
      storage.add(2);

      expect(storage.getAll()).toEqual([1, 2]);
    });

    it('deve filtrar números pares', () => {
      storage.add(1);
      storage.add(2);
      storage.add(3);
      storage.add(4);

      const evens = storage.filter(n => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
    });
  });

  describe('com objetos', () => {
    interface User {
      id: number;
      name: string;
    }

    let storage: TypeSafeStorage<User>;

    beforeEach(() => {
      storage = new TypeSafeStorage<User>();
    });

    it('deve armazenar objetos User', () => {
      const user: User = { id: 1, name: 'João' };
      storage.add(user);

      expect(storage.get(0)).toEqual(user);
    });

    it('deve filtrar por propriedade', () => {
      storage.add({ id: 1, name: 'João' });
      storage.add({ id: 2, name: 'Maria' });
      storage.add({ id: 3, name: 'João' });

      const joaos = storage.filter(user => user.name === 'João');
      expect(joaos).toHaveLength(2);
    });
  });
});
```

**Conceito:** TypeScript garante **type safety** em testes, compilador detecta erros de tipo antes de executar.

### 6. Test-Driven Development (TDD)

```typescript
// 1. ESCREVER TESTE (Red)
describe('FizzBuzz', () => {
  it('deve retornar "Fizz" para múltiplos de 3', () => {
    expect(fizzBuzz(3)).toBe('Fizz');
    expect(fizzBuzz(6)).toBe('Fizz');
    expect(fizzBuzz(9)).toBe('Fizz');
  });
});

// 2. IMPLEMENTAR (Green)
export function fizzBuzz(n: number): string {
  if (n % 3 === 0) return 'Fizz';
  return String(n);
}

// 3. MAIS TESTES (Red novamente)
it('deve retornar "Buzz" para múltiplos de 5', () => {
  expect(fizzBuzz(5)).toBe('Buzz');
  expect(fizzBuzz(10)).toBe('Buzz');
});

// 4. EXPANDIR IMPLEMENTAÇÃO (Green)
export function fizzBuzz(n: number): string {
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

// 5. MAIS TESTES
it('deve retornar "FizzBuzz" para múltiplos de 3 e 5', () => {
  expect(fizzBuzz(15)).toBe('FizzBuzz');
  expect(fizzBuzz(30)).toBe('FizzBuzz');
});

// 6. IMPLEMENTAÇÃO FINAL
export function fizzBuzz(n: number): string {
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}
```

**Ciclo TDD:**
1. **Red** - Escrever teste que falha
2. **Green** - Implementar mínimo para passar
3. **Refactor** - Melhorar código mantendo testes verdes

## 🎯 Aplicabilidade

### Organização de Testes

```
src/
├── services/
│   ├── user.service.ts
│   └── user.service.spec.ts
├── utils/
│   ├── validators.ts
│   ├── validators.spec.ts
│   ├── formatters.ts
│   └── formatters.spec.ts
└── models/
    ├── user.model.ts
    └── user.model.spec.ts
```

**Padrão:** Teste sempre ao lado do arquivo testado (`.spec.ts`).

### Cobertura de Testes Efetiva

```typescript
// Testar:
// ✅ Casos felizes (happy path)
// ✅ Casos de erro
// ✅ Casos de borda (boundary conditions)
// ✅ Validações
// ✅ Transformações

describe('calculateShipping', () => {
  // Happy path
  it('deve calcular frete para cep válido', () => {});

  // Erro
  it('deve lançar erro para cep inválido', () => {});

  // Borda
  it('deve funcionar com peso exato do limite', () => {});
  it('deve funcionar com peso zero', () => {});

  // Validações
  it('deve validar formato do cep', () => {});
});
```

## ⚠️ Considerações

### 1. Testes Não Devem Testar Implementação

```typescript
// ❌ Ruim: testa implementação interna
it('deve chamar método privado', () => {
  const spy = jest.spyOn(service as any, 'privateMethod');
  service.publicMethod();
  expect(spy).toHaveBeenCalled();
});

// ✅ Bom: testa comportamento público
it('deve retornar resultado correto', () => {
  const result = service.publicMethod();
  expect(result).toBe(expected);
});
```

### 2. Testes Devem Ser Independentes

```typescript
// ❌ Ruim: testes dependem de ordem
let counter = 0;

test('incrementa para 1', () => {
  counter++;
  expect(counter).toBe(1);
});

test('incrementa para 2', () => {  // Depende do anterior
  counter++;
  expect(counter).toBe(2);
});

// ✅ Bom: cada teste independente
test('incrementa contador', () => {
  let counter = 0;
  counter++;
  expect(counter).toBe(1);
});
```

### 3. Nomes Descritivos

```typescript
// ❌ Ruim
test('teste 1', () => {});

// ✅ Bom
test('deve calcular desconto de 10% para clientes premium', () => {});
```

## 📚 Conclusão

Teste unitário verifica **unidades isoladas** (funções, métodos, classes) com TypeScript aproveitando **type safety**. Padrão AAA: Arrange-Act-Assert. Funções puras são ideais (sem side effects). Classes requerem isolamento via beforeEach. Testar happy path, erros, casos de borda. TDD: Red (teste falha) → Green (implementa) → Refactor. Organizar testes ao lado do código (.spec.ts). Testes devem ser independentes, testar comportamento público (não implementação), ter nomes descritivos. TypeScript detecta erros de tipo em testes. Jest fornece matchers expressivos (toBe, toEqual, toThrow).

