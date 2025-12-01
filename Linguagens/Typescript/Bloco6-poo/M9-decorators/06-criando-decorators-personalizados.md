# Criando Decorators Personalizados: Guia Prático Completo

## 🎯 Introdução

Este guia ensina **como criar seus próprios decorators**, desde simples até avançados, cobrindo **todas as etapas**: design, implementação, testes, boas práticas. O foco é **desenvolvimento prático**, ensinando a pensar em decorators como soluções reutilizáveis para problemas reais.

### Objetivo

Capacitar você a criar decorators que:
- Resolvem problemas específicos do seu domínio
- São reutilizáveis e testáveis
- Seguem boas práticas de design
- Compõem bem com outros decorators

## 📋 Setup Inicial

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "experimentalDecorators": true,      // ← OBRIGATÓRIO
    "emitDecoratorMetadata": true,       // ← Para metadata reflection
    "lib": ["ES2020"],
    "moduleResolution": "node"
  }
}
```

### Instalação de Dependências

```bash
# Reflection metadata (opcional mas recomendado)
npm install reflect-metadata

# Types do Node (se usar performance.now, etc)
npm install --save-dev @types/node
```

### Estrutura de Projeto Recomendada

```
src/
├── decorators/
│   ├── class/
│   │   ├── injectable.decorator.ts
│   │   └── entity.decorator.ts
│   ├── method/
│   │   ├── log.decorator.ts
│   │   ├── cache.decorator.ts
│   │   └── retry.decorator.ts
│   ├── property/
│   │   ├── validate.decorator.ts
│   │   └── column.decorator.ts
│   └── index.ts                      // Re-exports
├── utils/
│   └── metadata.utils.ts
└── tests/
    └── decorators/
```

## 🔍 Processo de Criação

### Etapa 1: Identificar o Problema

```typescript
// ❌ ANTES - código repetitivo
class UserService {
  async getUser(id: number) {
    console.log(`[${new Date().toISOString()}] getUser called with id: ${id}`);
    const start = performance.now();
    
    const user = await this.db.findUser(id);
    
    const duration = performance.now() - start;
    console.log(`[${new Date().toISOString()}] getUser completed in ${duration}ms`);
    
    return user;
  }
  
  async updateUser(id: number, data: any) {
    console.log(`[${new Date().toISOString()}] updateUser called with id: ${id}`);
    const start = performance.now();
    
    const user = await this.db.updateUser(id, data);
    
    const duration = performance.now() - start;
    console.log(`[${new Date().toISOString()}] updateUser completed in ${duration}ms`);
    
    return user;
  }
  
  // Repetir para cada método...
}

// ✅ DEPOIS - com decorator
class UserService {
  @LogExecution
  async getUser(id: number) {
    return this.db.findUser(id);
  }
  
  @LogExecution
  async updateUser(id: number, data: any) {
    return this.db.updateUser(id, data);
  }
}
```

### Etapa 2: Design da Interface

```typescript
// Como você QUER usar o decorator?

// Opção 1: Simples (sem configuração)
@LogExecution
method() {}

// Opção 2: Configurável
@LogExecution({ level: 'debug', includeArgs: true })
method() {}

// Opção 3: Com múltiplas opções
@LogExecution({
  level: 'info',
  includeArgs: true,
  includeResult: true,
  includeDuration: true,
  formatters: {
    args: (args) => JSON.stringify(args),
    result: (result) => JSON.stringify(result)
  }
})
method() {}
```

### Etapa 3: Implementação Básica

```typescript
// decorators/method/log.decorator.ts

export interface LogOptions {
  level?: 'debug' | 'info' | 'warn' | 'error';
  includeArgs?: boolean;
  includeResult?: boolean;
  includeDuration?: boolean;
}

export function LogExecution(options: LogOptions = {}) {
  // Decorator factory - retorna o decorator real
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    // Salvar referência ao método original
    const originalMethod = descriptor.value;
    
    // Substituir método com wrapper
    descriptor.value = async function(...args: any[]) {
      const className = target.constructor.name;
      const level = options.level || 'info';
      
      // Log antes da execução
      let logMessage = `[${level.toUpperCase()}] ${className}.${propertyKey}`;
      
      if (options.includeArgs) {
        logMessage += ` | Args: ${JSON.stringify(args)}`;
      }
      
      console.log(logMessage);
      
      // Executar método original
      const start = performance.now();
      
      try {
        const result = await originalMethod.apply(this, args);
        
        // Log após sucesso
        const duration = performance.now() - start;
        let successLog = `[${level.toUpperCase()}] ${className}.${propertyKey} completed`;
        
        if (options.includeDuration) {
          successLog += ` | Duration: ${duration.toFixed(2)}ms`;
        }
        
        if (options.includeResult) {
          successLog += ` | Result: ${JSON.stringify(result)}`;
        }
        
        console.log(successLog);
        
        return result;
      } catch (error) {
        // Log em caso de erro
        const duration = performance.now() - start;
        console.error(
          `[ERROR] ${className}.${propertyKey} failed after ${duration.toFixed(2)}ms`,
          error
        );
        throw error;
      }
    };
    
    return descriptor;
  };
}
```

### Etapa 4: Testar Implementação

```typescript
// tests/decorators/log.decorator.test.ts

class TestService {
  @LogExecution({ level: 'info', includeArgs: true, includeDuration: true })
  async fetchData(id: number): Promise<{ id: number; data: string }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { id, data: 'test' };
  }
  
  @LogExecution({ level: 'error' })
  async failingMethod(): Promise<void> {
    throw new Error('Test error');
  }
}

async function testLogDecorator() {
  const service = new TestService();
  
  // Teste 1: Método com sucesso
  console.log('=== Test 1: Success ===');
  await service.fetchData(123);
  
  // Teste 2: Método com erro
  console.log('\n=== Test 2: Error ===');
  try {
    await service.failingMethod();
  } catch (error) {
    console.log('Error caught as expected');
  }
}

testLogDecorator();
```

## 🎯 Padrões de Criação

### Pattern 1: Simple Method Decorator

```typescript
// Use quando: Não precisa de configuração

export function Deprecated(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.warn(`⚠️ ${target.constructor.name}.${propertyKey} is deprecated`);
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

// Uso
class LegacyService {
  @Deprecated
  oldMethod() {
    return 'legacy';
  }
}
```

### Pattern 2: Configurable Decorator Factory

```typescript
// Use quando: Precisa aceitar parâmetros

export interface RetryOptions {
  attempts?: number;
  delay?: number;
  exponentialBackoff?: boolean;
}

export function Retry(options: RetryOptions = {}) {
  const { attempts = 3, delay = 1000, exponentialBackoff = false } = options;
  
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          if (attempt === attempts) throw error;
          
          const waitTime = exponentialBackoff 
            ? delay * Math.pow(2, attempt - 1)
            : delay;
          
          console.warn(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    };
    
    return descriptor;
  };
}

// Uso
class ApiService {
  @Retry({ attempts: 5, delay: 500, exponentialBackoff: true })
  async fetchData() {
    return fetch('https://api.example.com/data').then(r => r.json());
  }
}
```

### Pattern 3: Class Decorator with Metadata

```typescript
// Use quando: Precisa adicionar metadata à classe

import 'reflect-metadata';

const entityMetadataKey = Symbol('entity');

export interface EntityOptions {
  tableName: string;
  schema?: string;
}

export function Entity(options: EntityOptions) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    // Armazenar metadata
    Reflect.defineMetadata(entityMetadataKey, options, constructor);
    
    // Retornar classe inalterada (ou estendida se necessário)
    return constructor;
  };
}

// Helper para ler metadata
export function getEntityMetadata(target: any): EntityOptions | undefined {
  return Reflect.getMetadata(entityMetadataKey, target);
}

// Uso
@Entity({ tableName: 'users', schema: 'public' })
class User {
  id: number;
  name: string;
}

const metadata = getEntityMetadata(User);
console.log(metadata); // { tableName: 'users', schema: 'public' }
```

### Pattern 4: Property Decorator with Validation

```typescript
// Use quando: Precisa adicionar comportamento a propriedades

import 'reflect-metadata';

const validationMetadataKey = Symbol('validation');

interface ValidationRule {
  property: string;
  validator: (value: any) => boolean;
  message: string;
}

export function Min(minValue: number, message?: string) {
  return function(target: any, propertyKey: string) {
    const rules: ValidationRule[] = 
      Reflect.getMetadata(validationMetadataKey, target) || [];
    
    rules.push({
      property: propertyKey,
      validator: (value: any) => typeof value === 'number' && value >= minValue,
      message: message || `${propertyKey} must be at least ${minValue}`
    });
    
    Reflect.defineMetadata(validationMetadataKey, rules, target);
  };
}

export function Max(maxValue: number, message?: string) {
  return function(target: any, propertyKey: string) {
    const rules: ValidationRule[] = 
      Reflect.getMetadata(validationMetadataKey, target) || [];
    
    rules.push({
      property: propertyKey,
      validator: (value: any) => typeof value === 'number' && value <= maxValue,
      message: message || `${propertyKey} must be at most ${maxValue}`
    });
    
    Reflect.defineMetadata(validationMetadataKey, rules, target);
  };
}

// Validator helper
export function validate(obj: any): string[] {
  const errors: string[] = [];
  const rules: ValidationRule[] = 
    Reflect.getMetadata(validationMetadataKey, Object.getPrototypeOf(obj)) || [];
  
  for (const rule of rules) {
    const value = obj[rule.property];
    if (!rule.validator(value)) {
      errors.push(rule.message);
    }
  }
  
  return errors;
}

// Uso
class Product {
  @Min(0, 'Price cannot be negative')
  @Max(10000, 'Price cannot exceed 10000')
  price: number;
  
  constructor(price: number) {
    this.price = price;
  }
}

const product = new Product(-10);
const errors = validate(product);
console.log(errors); // ['Price cannot be negative']
```

### Pattern 5: Accessor Decorator

```typescript
// Use quando: Precisa interceptar getter/setter

export function Clamp(min: number, max: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalSet = descriptor.set;
    
    if (!originalSet) {
      throw new Error('@Clamp can only be used on setters');
    }
    
    descriptor.set = function(value: number) {
      const clampedValue = Math.max(min, Math.min(max, value));
      
      if (clampedValue !== value) {
        console.warn(
          `Value ${value} clamped to ${clampedValue} (range: ${min}-${max})`
        );
      }
      
      originalSet.call(this, clampedValue);
    };
    
    return descriptor;
  };
}

// Uso
class GameCharacter {
  private _health: number = 100;
  
  @Clamp(0, 100)
  set health(value: number) {
    this._health = value;
  }
  
  get health(): number {
    return this._health;
  }
}

const character = new GameCharacter();
character.health = 150; // Aviso: Value 150 clamped to 100 (range: 0-100)
console.log(character.health); // 100
```

## 🛠️ Boas Práticas

### 1. Type Safety

```typescript
// ❌ BAD - types perdidos
export function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    //                          ^^^ any
    return original.apply(this, args);
  };
}

// ✅ GOOD - preservar types quando possível
export function LogMethod<T extends (...args: any[]) => any>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
  const original = descriptor.value;
  
  if (!original) return descriptor;
  
  descriptor.value = function(...args: Parameters<T>): ReturnType<T> {
    console.log(`Calling ${propertyKey}`);
    return original.apply(this, args) as ReturnType<T>;
  } as T;
  
  return descriptor;
}
```

### 2. Preservar Context (this)

```typescript
// ✅ SEMPRE use .apply(this, args) ou .call(this, ...)

export function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    // ✅ Preserva 'this' context
    return originalMethod.apply(this, args);
    
    // ❌ NUNCA faça:
    // return originalMethod(...args);  // Perde context
  };
  
  return descriptor;
}
```

### 3. Async/Await Support

```typescript
// ✅ Suportar métodos síncronos E assíncronos

export function Measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    const start = performance.now();
    
    // await funciona tanto para Promise quanto para valores síncronos
    const result = await originalMethod.apply(this, args);
    
    const duration = performance.now() - start;
    console.log(`${propertyKey} took ${duration.toFixed(2)}ms`);
    
    return result;
  };
  
  return descriptor;
}
```

### 4. Error Handling

```typescript
// ✅ Sempre propagar erros (a menos que você queira engolir)

export function LogErrors(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      // Log erro
      console.error(`Error in ${target.constructor.name}.${propertyKey}:`, error);
      
      // ✅ Re-throw para não quebrar fluxo
      throw error;
      
      // ❌ NÃO faça (a menos que seja intencional):
      // return null;  // Engole erro silenciosamente
    }
  };
  
  return descriptor;
}
```

### 5. Composability

```typescript
// ✅ Decorators devem compor bem

class UserService {
  @Log                    // 1. Executa primeiro
  @Retry({ attempts: 3 }) // 2. Depois retry
  @Measure                // 3. Por último measure
  async fetchUser(id: number) {
    return fetch(`/api/users/${id}`).then(r => r.json());
  }
}

// Ordem de execução:
// Log wraps Retry wraps Measure wraps original method
```

### 6. Metadata Helpers

```typescript
// ✅ Criar helpers para trabalhar com metadata

import 'reflect-metadata';

export class MetadataUtils {
  static setMetadata<T>(key: symbol, value: T, target: any, propertyKey?: string): void {
    if (propertyKey) {
      Reflect.defineMetadata(key, value, target, propertyKey);
    } else {
      Reflect.defineMetadata(key, value, target);
    }
  }
  
  static getMetadata<T>(key: symbol, target: any, propertyKey?: string): T | undefined {
    if (propertyKey) {
      return Reflect.getMetadata(key, target, propertyKey);
    } else {
      return Reflect.getMetadata(key, target);
    }
  }
  
  static addToMetadataArray<T>(
    key: symbol,
    value: T,
    target: any,
    propertyKey?: string
  ): void {
    const existing = this.getMetadata<T[]>(key, target, propertyKey) || [];
    existing.push(value);
    this.setMetadata(key, existing, target, propertyKey);
  }
}

// Uso
const myKey = Symbol('myMetadata');

export function MyDecorator(value: string) {
  return function(target: any, propertyKey: string) {
    MetadataUtils.addToMetadataArray(myKey, value, target, propertyKey);
  };
}
```

## 🎓 Exemplos Práticos Completos

### Exemplo 1: Rate Limiting Decorator

```typescript
// decorators/method/rate-limit.decorator.ts

interface RateLimitOptions {
  maxCalls: number;
  windowMs: number;
}

export function RateLimit(options: RateLimitOptions) {
  const { maxCalls, windowMs } = options;
  const callTimestamps: number[] = [];
  
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      const now = Date.now();
      
      // Remover timestamps fora da janela
      while (callTimestamps.length > 0 && callTimestamps[0] < now - windowMs) {
        callTimestamps.shift();
      }
      
      // Verificar limite
      if (callTimestamps.length >= maxCalls) {
        throw new Error(
          `Rate limit exceeded: ${maxCalls} calls per ${windowMs}ms`
        );
      }
      
      // Adicionar timestamp e executar
      callTimestamps.push(now);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// Uso
class ApiService {
  @RateLimit({ maxCalls: 5, windowMs: 60000 }) // 5 calls per minute
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email to ${to}`);
  }
}

const api = new ApiService();

// Testa rate limit
(async () => {
  for (let i = 0; i < 7; i++) {
    try {
      await api.sendEmail('test@example.com', 'Subject', 'Body');
      console.log(`Email ${i + 1} sent`);
    } catch (error) {
      console.error(`Email ${i + 1} failed:`, (error as Error).message);
    }
  }
})();
```

### Exemplo 2: Timeout Decorator

```typescript
// decorators/method/timeout.decorator.ts

export function Timeout(ms: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      return Promise.race([
        originalMethod.apply(this, args),
        new Promise((_, reject) => 
          setTimeout(
            () => reject(new Error(`${propertyKey} timed out after ${ms}ms`)),
            ms
          )
        )
      ]);
    };
    
    return descriptor;
  };
}

// Uso
class DataService {
  @Timeout(5000) // 5 seconds timeout
  async fetchLargeDataset(): Promise<any[]> {
    // Simulação de operação lenta
    await new Promise(resolve => setTimeout(resolve, 10000));
    return [];
  }
}

const service = new DataService();

(async () => {
  try {
    await service.fetchLargeDataset();
  } catch (error) {
    console.error(error); // "fetchLargeDataset timed out after 5000ms"
  }
})();
```

### Exemplo 3: Validation Decorator System

```typescript
// decorators/property/validation.decorators.ts

import 'reflect-metadata';

const validationKey = Symbol('validation');

interface ValidationRule {
  property: string;
  validator: (value: any) => boolean;
  message: string;
}

function addValidationRule(
  target: any,
  property: string,
  validator: (value: any) => boolean,
  message: string
): void {
  const rules: ValidationRule[] = 
    Reflect.getMetadata(validationKey, target) || [];
  
  rules.push({ property, validator, message });
  Reflect.defineMetadata(validationKey, rules, target);
}

export function IsEmail(target: any, propertyKey: string): void {
  addValidationRule(
    target,
    propertyKey,
    (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    `${propertyKey} must be a valid email address`
  );
}

export function MinLength(length: number) {
  return function(target: any, propertyKey: string): void {
    addValidationRule(
      target,
      propertyKey,
      (value) => typeof value === 'string' && value.length >= length,
      `${propertyKey} must be at least ${length} characters long`
    );
  };
}

export function IsPositive(target: any, propertyKey: string): void {
  addValidationRule(
    target,
    propertyKey,
    (value) => typeof value === 'number' && value > 0,
    `${propertyKey} must be a positive number`
  );
}

export function Range(min: number, max: number) {
  return function(target: any, propertyKey: string): void {
    addValidationRule(
      target,
      propertyKey,
      (value) => typeof value === 'number' && value >= min && value <= max,
      `${propertyKey} must be between ${min} and ${max}`
    );
  };
}

// Validator class
export class Validator {
  static validate(obj: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const rules: ValidationRule[] = 
      Reflect.getMetadata(validationKey, Object.getPrototypeOf(obj)) || [];
    
    for (const rule of rules) {
      const value = obj[rule.property];
      
      if (!rule.validator(value)) {
        errors.push(rule.message);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }
}

// Uso
class CreateUserDto {
  @IsEmail
  email: string;
  
  @MinLength(3)
  username: string;
  
  @Range(18, 120)
  age: number;
  
  constructor(email: string, username: string, age: number) {
    this.email = email;
    this.username = username;
    this.age = age;
  }
}

const dto1 = new CreateUserDto('invalid-email', 'ab', 150);
console.log(Validator.validate(dto1));
// {
//   valid: false,
//   errors: [
//     'email must be a valid email address',
//     'username must be at least 3 characters long',
//     'age must be between 18 and 120'
//   ]
// }

const dto2 = new CreateUserDto('alice@example.com', 'alice', 25);
console.log(Validator.validate(dto2));
// { valid: true, errors: [] }
```

## ⚠️ Armadilhas Comuns

### 1. Não Retornar Descriptor

```typescript
// ❌ ERRADO - esqueceu de retornar
function Bad(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.value = function() { /* ... */ };
  // Falta: return descriptor;
}

// ✅ CORRETO
function Good(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.value = function() { /* ... */ };
  return descriptor; // ← Importante
}
```

### 2. Usar Arrow Function no Wrapper

```typescript
// ❌ ERRADO - arrow function não tem 'this' próprio
function Bad(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  
  descriptor.value = (...args: any[]) => {
    // 'this' aponta para escopo errado
    return original.apply(this, args);
  };
}

// ✅ CORRETO - function tradicional
function Good(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    // 'this' aponta para instância da classe
    return original.apply(this, args);
  };
}
```

### 3. Modificar Args sem Cuidado

```typescript
// ❌ ERRADO - modifica args original
function Bad(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    args.push('extra'); // ← Modifica array original
    return original.apply(this, args);
  };
}

// ✅ CORRETO - cria nova array se necessário
function Good(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const modifiedArgs = [...args, 'extra']; // ← Nova array
    return original.apply(this, modifiedArgs);
  };
}
```

## 🚀 Próximos Passos

1. **Praticar**: Crie decorators para seus próprios casos de uso
2. **Testar**: Sempre teste decorators isoladamente
3. **Documentar**: Documente opções e comportamento
4. **Publicar**: Considere criar biblioteca de decorators reutilizáveis
5. **Explorar**: Estude decorators de frameworks (Angular, NestJS, TypeORM)

---

**Conclusão**: Criar decorators personalizados segue padrão consistente: identificar problema, design interface, implementar wrapper, testar. Com prática, você criará decorators que tornam código mais limpo, reutilizável e manutenível.
