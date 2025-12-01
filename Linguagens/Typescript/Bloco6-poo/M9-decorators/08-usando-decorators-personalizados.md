# Usando Decorators Personalizados: Guia Prático de Aplicação

## 🎯 Introdução

Este guia ensina **como usar decorators personalizados que você criou** em projetos reais, cobrindo importação, configuração, organização, manutenção, e resolução de problemas. O foco é **uso eficiente** de decorators customizados para maximizar reutilização e manutenibilidade.

### Objetivo

Capacitar você a:
- Organizar decorators personalizados em bibliotecas reutilizáveis
- Importar e usar decorators em diferentes contextos
- Configurar decorators para diferentes ambientes
- Manter e evoluir decorators customizados
- Criar biblioteca de decorators para compartilhar entre projetos

## 📁 Estrutura de Projeto

### Organização Recomendada

```
src/
├── decorators/
│   ├── index.ts                    # Barrel export
│   ├── class/
│   │   ├── entity.decorator.ts
│   │   ├── injectable.decorator.ts
│   │   └── index.ts
│   ├── method/
│   │   ├── log.decorator.ts
│   │   ├── cache.decorator.ts
│   │   ├── retry.decorator.ts
│   │   ├── timeout.decorator.ts
│   │   └── index.ts
│   ├── property/
│   │   ├── validate.decorator.ts
│   │   ├── column.decorator.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── metadata.ts
│   │   └── logger.ts
│   └── types/
│       └── decorator-types.ts
├── models/
│   └── user.model.ts               # Usa decorators
├── services/
│   └── user.service.ts             # Usa decorators
└── index.ts
```

### Barrel Exports (index.ts)

```typescript
// decorators/class/index.ts
export * from './entity.decorator';
export * from './injectable.decorator';

// decorators/method/index.ts
export * from './log.decorator';
export * from './cache.decorator';
export * from './retry.decorator';
export * from './timeout.decorator';

// decorators/property/index.ts
export * from './validate.decorator';
export * from './column.decorator';

// decorators/index.ts - Export tudo
export * from './class';
export * from './method';
export * from './property';
export * from './utils';
export * from './types';
```

## 🔧 Criando Biblioteca de Decorators

### 1. Definir Types Compartilhados

```typescript
// decorators/types/decorator-types.ts

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogOptions {
  level?: LogLevel;
  includeArgs?: boolean;
  includeResult?: boolean;
  includeDuration?: boolean;
  includeTimestamp?: boolean;
}

export interface CacheOptions {
  ttl?: number;
  keyGenerator?: (...args: any[]) => string;
  storage?: 'memory' | 'redis' | 'localStorage';
}

export interface RetryOptions {
  attempts?: number;
  delay?: number;
  exponentialBackoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

export interface ValidationRule {
  property: string;
  validator: (value: any) => boolean;
  message: string;
}

export interface EntityOptions {
  tableName: string;
  schema?: string;
  timestamps?: boolean;
}

export interface ColumnOptions {
  name?: string;
  type: string;
  nullable?: boolean;
  unique?: boolean;
  default?: any;
}
```

### 2. Criar Utilities Compartilhadas

```typescript
// decorators/utils/metadata.ts

import 'reflect-metadata';

export class MetadataService {
  static set<T>(key: symbol, value: T, target: any, propertyKey?: string): void {
    if (propertyKey !== undefined) {
      Reflect.defineMetadata(key, value, target, propertyKey);
    } else {
      Reflect.defineMetadata(key, value, target);
    }
  }
  
  static get<T>(key: symbol, target: any, propertyKey?: string): T | undefined {
    if (propertyKey !== undefined) {
      return Reflect.getMetadata(key, target, propertyKey);
    }
    return Reflect.getMetadata(key, target);
  }
  
  static has(key: symbol, target: any, propertyKey?: string): boolean {
    if (propertyKey !== undefined) {
      return Reflect.hasMetadata(key, target, propertyKey);
    }
    return Reflect.hasMetadata(key, target);
  }
  
  static append<T>(key: symbol, value: T, target: any, propertyKey?: string): void {
    const existing = this.get<T[]>(key, target, propertyKey) || [];
    existing.push(value);
    this.set(key, existing, target, propertyKey);
  }
  
  static getAll<T>(key: symbol, target: any): T[] {
    return this.get<T[]>(key, target) || [];
  }
}

// decorators/utils/logger.ts

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  private static level: LogLevel = 'info';
  
  static setLevel(level: LogLevel): void {
    this.level = level;
  }
  
  static debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
  
  static info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }
  
  static warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }
  
  static error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
  
  private static shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }
}
```

### 3. Implementar Decorators

```typescript
// decorators/method/log.decorator.ts

import { LogOptions } from '../types/decorator-types';
import { Logger } from '../utils/logger';

export function Log(options: LogOptions = {}): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const methodName = String(propertyKey);
    const className = target.constructor.name;
    
    descriptor.value = async function(...args: any[]) {
      const level = options.level || 'info';
      
      // Log entrada
      let entryMessage = `${className}.${methodName}`;
      
      if (options.includeArgs) {
        entryMessage += ` | Args: ${JSON.stringify(args)}`;
      }
      
      Logger[level](entryMessage);
      
      const start = options.includeDuration ? performance.now() : 0;
      
      try {
        const result = await originalMethod.apply(this, args);
        
        // Log sucesso
        let successMessage = `${className}.${methodName} completed`;
        
        if (options.includeDuration) {
          const duration = performance.now() - start;
          successMessage += ` | Duration: ${duration.toFixed(2)}ms`;
        }
        
        if (options.includeResult) {
          successMessage += ` | Result: ${JSON.stringify(result)}`;
        }
        
        Logger[level](successMessage);
        
        return result;
      } catch (error) {
        const duration = options.includeDuration ? performance.now() - start : 0;
        Logger.error(
          `${className}.${methodName} failed after ${duration.toFixed(2)}ms`,
          error
        );
        throw error;
      }
    };
    
    return descriptor;
  };
}

// decorators/method/cache.decorator.ts

import { CacheOptions } from '../types/decorator-types';

const memoryCache = new Map<string, { value: any; expiry: number }>();

export function Cacheable(options: CacheOptions = {}): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const ttl = options.ttl || 60000;
    
    descriptor.value = async function(...args: any[]) {
      // Gerar chave
      const key = options.keyGenerator
        ? options.keyGenerator(...args)
        : `${target.constructor.name}.${String(propertyKey)}:${JSON.stringify(args)}`;
      
      // Verificar cache (simplified - apenas memory)
      const cached = memoryCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return cached.value;
      }
      
      // Executar método
      const result = await originalMethod.apply(this, args);
      
      // Armazenar
      memoryCache.set(key, {
        value: result,
        expiry: Date.now() + ttl
      });
      
      return result;
    };
    
    return descriptor;
  };
}

export function CacheInvalidate(pattern: string): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const result = await originalMethod.apply(this, args);
      
      // Invalidar cache matching pattern
      for (const [key] of memoryCache) {
        if (key.includes(pattern)) {
          memoryCache.delete(key);
        }
      }
      
      return result;
    };
    
    return descriptor;
  };
}

// decorators/method/retry.decorator.ts

import { RetryOptions } from '../types/decorator-types';
import { Logger } from '../utils/logger';

export function Retry(options: RetryOptions = {}): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const { attempts = 3, delay = 1000, exponentialBackoff = false } = options;
    
    descriptor.value = async function(...args: any[]) {
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          if (attempt === attempts) {
            throw error;
          }
          
          const waitTime = exponentialBackoff
            ? delay * Math.pow(2, attempt - 1)
            : delay;
          
          Logger.warn(
            `${target.constructor.name}.${String(propertyKey)} attempt ${attempt} failed, ` +
            `retrying in ${waitTime}ms...`
          );
          
          if (options.onRetry) {
            options.onRetry(attempt, error as Error);
          }
          
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    };
    
    return descriptor;
  };
}

// decorators/method/timeout.decorator.ts

export function Timeout(ms: number): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      return Promise.race([
        originalMethod.apply(this, args),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(
              `${target.constructor.name}.${String(propertyKey)} timed out after ${ms}ms`
            )),
            ms
          )
        )
      ]);
    };
    
    return descriptor;
  };
}

// decorators/property/validate.decorator.ts

import 'reflect-metadata';
import { ValidationRule } from '../types/decorator-types';
import { MetadataService } from '../utils/metadata';

const validationKey = Symbol('validation');

function addValidationRule(
  target: any,
  property: string,
  validator: (value: any) => boolean,
  message: string
): void {
  MetadataService.append(validationKey, { property, validator, message }, target);
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

export class Validator {
  static validate(obj: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const rules = MetadataService.getAll<ValidationRule>(
      validationKey,
      Object.getPrototypeOf(obj)
    );
    
    for (const rule of rules) {
      const value = obj[rule.property];
      
      if (!rule.validator(value)) {
        errors.push(rule.message);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }
}

// decorators/class/entity.decorator.ts

import 'reflect-metadata';
import { EntityOptions } from '../types/decorator-types';
import { MetadataService } from '../utils/metadata';

const entityKey = Symbol('entity');

export function Entity(options: EntityOptions) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T): T {
    MetadataService.set(entityKey, options, constructor);
    return constructor;
  };
}

export function getEntityMetadata(target: any): EntityOptions | undefined {
  return MetadataService.get<EntityOptions>(entityKey, target);
}

// decorators/property/column.decorator.ts

import 'reflect-metadata';
import { ColumnOptions } from '../types/decorator-types';
import { MetadataService } from '../utils/metadata';

const columnsKey = Symbol('columns');

export function Column(options: ColumnOptions) {
  return function(target: any, propertyKey: string): void {
    MetadataService.append(
      columnsKey,
      {
        propertyName: propertyKey,
        columnName: options.name || propertyKey,
        ...options
      },
      target
    );
  };
}

export function getColumnMetadata(target: any): any[] {
  return MetadataService.getAll(columnsKey, target);
}
```

## 🎯 Usando os Decorators

### Exemplo 1: Service com Multiple Decorators

```typescript
// services/user.service.ts

import {
  Log,
  Cacheable,
  CacheInvalidate,
  Retry,
  Timeout
} from '../decorators';

export class UserService {
  // Simples logging
  @Log({ level: 'info' })
  async getUser(id: number): Promise<any> {
    return { id, name: 'Alice' };
  }
  
  // Cache + Log
  @Log({ level: 'debug', includeArgs: true })
  @Cacheable({ ttl: 30000, keyGenerator: (id) => `user:${id}` })
  async getUserCached(id: number): Promise<any> {
    console.log('Fetching from database...');
    return { id, name: 'Alice' };
  }
  
  // Retry + Timeout + Log
  @Log({ level: 'info', includeDuration: true })
  @Retry({ attempts: 3, delay: 500, exponentialBackoff: true })
  @Timeout(5000)
  async fetchFromExternalApi(endpoint: string): Promise<any> {
    const response = await fetch(endpoint);
    return response.json();
  }
  
  // Cache invalidation
  @CacheInvalidate('user:')
  @Log({ level: 'info' })
  async updateUser(id: number, data: any): Promise<void> {
    console.log(`Updating user ${id}`, data);
  }
  
  // Tudo junto
  @Log({ level: 'info', includeArgs: true, includeResult: true })
  @Cacheable({ ttl: 60000 })
  @Retry({ attempts: 2, delay: 1000 })
  @Timeout(3000)
  async complexOperation(param: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { result: `Processed ${param}` };
  }
}

// Uso
(async () => {
  const service = new UserService();
  
  await service.getUserCached(1); // Cache MISS
  await service.getUserCached(1); // Cache HIT
  
  await service.updateUser(1, { name: 'Bob' }); // Invalida cache
  
  await service.getUserCached(1); // Cache MISS (foi invalidado)
})();
```

### Exemplo 2: Model com Validation

```typescript
// models/user.model.ts

import {
  IsEmail,
  MinLength,
  Range,
  Validator
} from '../decorators';

export class CreateUserDto {
  @IsEmail
  email: string;
  
  @MinLength(3)
  username: string;
  
  @MinLength(8)
  password: string;
  
  @Range(18, 120)
  age: number;
  
  constructor(data: Partial<CreateUserDto>) {
    Object.assign(this, data);
  }
  
  validate(): { valid: boolean; errors: string[] } {
    return Validator.validate(this);
  }
}

// Uso
const dto = new CreateUserDto({
  email: 'invalid-email',
  username: 'ab',
  password: '123',
  age: 15
});

const result = dto.validate();
console.log(result);
// {
//   valid: false,
//   errors: [
//     'email must be a valid email address',
//     'username must be at least 3 characters long',
//     'password must be at least 8 characters long',
//     'age must be between 18 and 120'
//   ]
// }

const validDto = new CreateUserDto({
  email: 'alice@example.com',
  username: 'alice',
  password: 'secret123',
  age: 25
});

console.log(validDto.validate()); // { valid: true, errors: [] }
```

### Exemplo 3: Entity com ORM Decorators

```typescript
// models/product.model.ts

import {
  Entity,
  Column,
  getEntityMetadata,
  getColumnMetadata
} from '../decorators';

@Entity({ tableName: 'products', schema: 'public', timestamps: true })
export class Product {
  @Column({ type: 'integer', unique: true })
  id: number;
  
  @Column({ name: 'product_name', type: 'varchar(255)' })
  name: string;
  
  @Column({ type: 'decimal(10,2)' })
  price: number;
  
  @Column({ type: 'integer', default: 0 })
  stock: number;
  
  @Column({ type: 'text', nullable: true })
  description?: string;
}

// Query Builder (simplificado)
class QueryBuilder {
  static generateCreateTable(entityClass: any): string {
    const entityMeta = getEntityMetadata(entityClass);
    const columnsMeta = getColumnMetadata(entityClass.prototype);
    
    if (!entityMeta) {
      throw new Error('Not an entity');
    }
    
    const columnDefs = columnsMeta.map((col: any) => {
      let def = `${col.columnName} ${col.type.toUpperCase()}`;
      if (!col.nullable) def += ' NOT NULL';
      if (col.unique) def += ' UNIQUE';
      if (col.default !== undefined) def += ` DEFAULT ${col.default}`;
      return def;
    });
    
    if (entityMeta.timestamps) {
      columnDefs.push('created_at TIMESTAMP DEFAULT NOW()');
      columnDefs.push('updated_at TIMESTAMP DEFAULT NOW()');
    }
    
    return `CREATE TABLE ${entityMeta.schema}.${entityMeta.tableName} (\n  ${columnDefs.join(',\n  ')}\n);`;
  }
}

// Uso
console.log(QueryBuilder.generateCreateTable(Product));
// CREATE TABLE public.products (
//   id INTEGER NOT NULL UNIQUE,
//   product_name VARCHAR(255) NOT NULL,
//   price DECIMAL(10,2) NOT NULL,
//   stock INTEGER NOT NULL DEFAULT 0,
//   description TEXT,
//   created_at TIMESTAMP DEFAULT NOW(),
//   updated_at TIMESTAMP DEFAULT NOW()
// );
```

## 🎨 Configuração Avançada

### 1. Environment-Based Configuration

```typescript
// decorators/config.ts

export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production'
}

export class DecoratorConfig {
  private static env: Environment = Environment.Development;
  
  static setEnvironment(env: Environment): void {
    this.env = env;
  }
  
  static getEnvironment(): Environment {
    return this.env;
  }
  
  static isProduction(): boolean {
    return this.env === Environment.Production;
  }
  
  static isDevelopment(): boolean {
    return this.env === Environment.Development;
  }
}

// Uso nos decorators
export function Log(options: LogOptions = {}): MethodDecorator {
  return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      // Não fazer log em produção se não configurado
      if (DecoratorConfig.isProduction() && !options.forceInProduction) {
        return originalMethod.apply(this, args);
      }
      
      // Log normal...
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// Configurar no bootstrap
import { DecoratorConfig, Environment } from './decorators/config';

DecoratorConfig.setEnvironment(
  process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Development
);
```

### 2. Plugin System

```typescript
// decorators/plugins/plugin.interface.ts

export interface DecoratorPlugin {
  name: string;
  beforeMethod?(context: MethodContext): void | Promise<void>;
  afterMethod?(context: MethodContext, result: any): void | Promise<void>;
  onError?(context: MethodContext, error: Error): void | Promise<void>;
}

export interface MethodContext {
  target: any;
  propertyKey: string;
  args: any[];
  instance: any;
}

// decorators/plugins/plugin-manager.ts

export class PluginManager {
  private static plugins: DecoratorPlugin[] = [];
  
  static register(plugin: DecoratorPlugin): void {
    this.plugins.push(plugin);
  }
  
  static async runBeforeMethod(context: MethodContext): Promise<void> {
    for (const plugin of this.plugins) {
      if (plugin.beforeMethod) {
        await plugin.beforeMethod(context);
      }
    }
  }
  
  static async runAfterMethod(context: MethodContext, result: any): Promise<void> {
    for (const plugin of this.plugins) {
      if (plugin.afterMethod) {
        await plugin.afterMethod(context, result);
      }
    }
  }
  
  static async runOnError(context: MethodContext, error: Error): Promise<void> {
    for (const plugin of this.plugins) {
      if (plugin.onError) {
        await plugin.onError(context, error);
      }
    }
  }
}

// Decorator que usa plugins
export function WithPlugins(): MethodDecorator {
  return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const context: MethodContext = {
        target,
        propertyKey: String(propertyKey),
        args,
        instance: this
      };
      
      await PluginManager.runBeforeMethod(context);
      
      try {
        const result = await originalMethod.apply(this, args);
        await PluginManager.runAfterMethod(context, result);
        return result;
      } catch (error) {
        await PluginManager.runOnError(context, error as Error);
        throw error;
      }
    };
    
    return descriptor;
  };
}

// Exemplo de plugin
const analyticsPlugin: DecoratorPlugin = {
  name: 'analytics',
  beforeMethod(context) {
    console.log(`[Analytics] Method ${context.propertyKey} called`);
  },
  afterMethod(context, result) {
    console.log(`[Analytics] Method ${context.propertyKey} completed`);
  }
};

PluginManager.register(analyticsPlugin);
```

## 📦 Criando Pacote NPM

### package.json

```json
{
  "name": "@yourorg/decorators",
  "version": "1.0.0",
  "description": "Custom TypeScript decorators library",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["typescript", "decorators", "metadata"],
  "author": "Your Name",
  "license": "MIT",
  "peerDependencies": {
    "reflect-metadata": "^0.1.13",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "files": [
    "dist/**/*",
    "README.md",
    "LICENSE"
  ]
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### README.md

```markdown
# @yourorg/decorators

Custom TypeScript decorators for logging, caching, validation, and more.

## Installation

```bash
npm install @yourorg/decorators reflect-metadata
```

## Setup

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

```typescript
// index.ts - Import reflect-metadata first
import 'reflect-metadata';
```

## Usage

### Logging

```typescript
import { Log } from '@yourorg/decorators';

class UserService {
  @Log({ level: 'info', includeDuration: true })
  async getUser(id: number) {
    return { id, name: 'Alice' };
  }
}
```

### Caching

```typescript
import { Cacheable } from '@yourorg/decorators';

class DataService {
  @Cacheable({ ttl: 60000 })
  async fetchData(id: number) {
    return await db.query('SELECT * FROM data WHERE id = ?', [id]);
  }
}
```

### Validation

```typescript
import { IsEmail, MinLength, Validator } from '@yourorg/decorators';

class CreateUserDto {
  @IsEmail
  email: string;
  
  @MinLength(3)
  username: string;
}

const dto = new CreateUserDto();
const { valid, errors } = Validator.validate(dto);
```

## API Documentation

[Link to full documentation]
```

### Publicar

```bash
# Build
npm run build

# Test
npm test

# Publicar
npm publish --access public
```

### Usar em Outro Projeto

```bash
npm install @yourorg/decorators
```

```typescript
import 'reflect-metadata';
import { Log, Cacheable, Retry } from '@yourorg/decorators';

class MyService {
  @Log({ level: 'info' })
  @Cacheable({ ttl: 30000 })
  @Retry({ attempts: 3 })
  async doSomething() {
    // ...
  }
}
```

## 🧪 Testing Decorators

```typescript
// decorators/__tests__/log.decorator.test.ts

import { Log } from '../method/log.decorator';

describe('Log Decorator', () => {
  let consoleSpy: jest.SpyInstance;
  
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });
  
  afterEach(() => {
    consoleSpy.mockRestore();
  });
  
  it('should log method calls', async () => {
    class TestService {
      @Log({ level: 'info' })
      testMethod(param: string): string {
        return `Result: ${param}`;
      }
    }
    
    const service = new TestService();
    const result = service.testMethod('test');
    
    expect(result).toBe('Result: test');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('TestService.testMethod')
    );
  });
  
  it('should include arguments when configured', () => {
    class TestService {
      @Log({ level: 'info', includeArgs: true })
      testMethod(a: number, b: number): number {
        return a + b;
      }
    }
    
    const service = new TestService();
    service.testMethod(2, 3);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Args: [2,3]')
    );
  });
});
```

## 🔍 Debugging

### Ver Decorators Aplicados

```typescript
function inspectDecorators(target: any): void {
  console.log('Class:', target.name);
  
  const prototype = target.prototype;
  const propertyNames = Object.getOwnPropertyNames(prototype);
  
  for (const prop of propertyNames) {
    if (prop === 'constructor') continue;
    
    const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
    if (descriptor && typeof descriptor.value === 'function') {
      console.log(`  Method: ${prop}`);
      
      // Ver metadata
      const keys = Reflect.getMetadataKeys(prototype, prop);
      for (const key of keys) {
        const value = Reflect.getMetadata(key, prototype, prop);
        console.log(`    Metadata ${String(key)}:`, value);
      }
    }
  }
}

inspectDecorators(UserService);
```

### Decorator Stack Trace

```typescript
export function DebugDecorator(name: string): MethodDecorator {
  return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    console.log(`[${name}] Applied to ${target.constructor.name}.${String(propertyKey)}`);
    
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      console.log(`[${name}] Entering ${String(propertyKey)}`);
      const result = original.apply(this, args);
      console.log(`[${name}] Exiting ${String(propertyKey)}`);
      return result;
    };
    
    return descriptor;
  };
}

class Example {
  @DebugDecorator('First')
  @DebugDecorator('Second')
  @DebugDecorator('Third')
  method() {
    console.log('Original method');
  }
}

// Output ao carregar:
// [Third] Applied to Example.method
// [Second] Applied to Example.method
// [First] Applied to Example.method

// Output ao executar:
new Example().method();
// [First] Entering method
// [Second] Entering method
// [Third] Entering method
// Original method
// [Third] Exiting method
// [Second] Exiting method
// [First] Exiting method
```

## 📚 Melhores Práticas

1. **Documentar bem** - Cada decorator deve ter JSDoc explicando uso e opções
2. **Testar isoladamente** - Cada decorator deve ter testes unitários
3. **Versioning semântico** - Use SemVer ao publicar biblioteca
4. **Type safety** - Use TypeScript types apropriados
5. **Barrel exports** - Organize exports em index.ts
6. **Environment awareness** - Decorators devem se comportar diferente em dev/prod
7. **Performance** - Evite overhead desnecessário em production
8. **Composability** - Decorators devem compor bem juntos
9. **Error handling** - Sempre propagar erros adequadamente
10. **Metadata consistency** - Use symbols para metadata keys

## 🚀 Próximos Passos

1. Criar sua biblioteca de decorators reutilizáveis
2. Publicar no NPM para compartilhar entre projetos
3. Adicionar testes automatizados
4. Documentar casos de uso comuns
5. Contribuir para bibliotecas open source de decorators

---

**Conclusão**: Usar decorators personalizados efetivamente requer organização, documentação, e testes adequados. Com biblioteca bem estruturada, decorators se tornam ferramenta poderosa para código limpo e reutilizável.
