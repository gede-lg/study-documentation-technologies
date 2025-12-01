# Utilizando Decorators: Guia Prático de Uso

## 🎯 Introdução

Este guia ensina **como usar decorators** em projetos reais, cobrindo desde configuração inicial até integração com frameworks populares. O foco é **aplicação prática**: quando usar, como combinar, debugging, otimização, e integração com Angular, NestJS, TypeORM.

### Objetivo

Capacitar você a:
- Configurar projeto TypeScript para usar decorators
- Aplicar decorators corretamente em diferentes contextos
- Combinar múltiplos decorators eficientemente
- Debuggar problemas com decorators
- Integrar decorators de frameworks populares

## 📋 Configuração do Ambiente

### TypeScript Configuration

```json
// tsconfig.json - Configuração OBRIGATÓRIA
{
  "compilerOptions": {
    "target": "ES2020",                    // ou superior
    "lib": ["ES2020"],
    "module": "commonjs",                  // ou "esnext"
    "moduleResolution": "node",
    
    // ⭐ Flags ESSENCIAIS para decorators
    "experimentalDecorators": true,        // ← OBRIGATÓRIO
    "emitDecoratorMetadata": true,         // ← Para DI e metadata
    
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Package.json Dependencies

```json
{
  "name": "decorators-project",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "reflect-metadata": "^0.1.13"    // ← Para metadata reflection
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}
```

### Importar Reflect-Metadata

```typescript
// src/index.ts - PRIMEIRA LINHA do arquivo de entrada
import 'reflect-metadata';

// Resto do código...
```

## 🎯 Uso Básico

### Class Decorators

```typescript
import 'reflect-metadata';

// Decorator que adiciona timestamp
function Timestamped<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    createdAt = new Date();
  };
}

// ✅ USO CORRETO
@Timestamped
class Document {
  constructor(public content: string) {}
}

const doc = new Document('Hello');
console.log((doc as any).createdAt); // Date object

// ❌ USO INCORRETO
// @Timestamped()  // ← ERRO: Timestamped não é factory
// class Document {}

// Se quiser configurável, precisa ser factory:
function TimestampedFactory(format?: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      createdAt = new Date();
      format = format || 'ISO';
    };
  };
}

@TimestampedFactory('UTC')  // ✅ Factory aceita parâmetros
class ConfiguredDocument {
  content: string;
}
```

### Method Decorators

```typescript
// Decorator de logging
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} returned:`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  // ✅ USO CORRETO - decorar método
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
  
  // ❌ USO INCORRETO - arrow function não funciona
  // @Log
  // multiply = (a: number, b: number) => a * b;
  //   ↑ Arrow function é property, não method
}

const calc = new Calculator();
calc.add(2, 3);
// Output:
// Calling add with: [2, 3]
// add returned: 5
```

### Property Decorators

```typescript
import 'reflect-metadata';

const requiredKey = Symbol('required');

// Property decorator que marca como obrigatório
function Required(target: any, propertyKey: string) {
  const existingRequired: string[] = 
    Reflect.getMetadata(requiredKey, target) || [];
  
  existingRequired.push(propertyKey);
  Reflect.defineMetadata(requiredKey, existingRequired, target);
}

// Validator
function validateRequired(obj: any): string[] {
  const errors: string[] = [];
  const required: string[] = 
    Reflect.getMetadata(requiredKey, Object.getPrototypeOf(obj)) || [];
  
  for (const prop of required) {
    if (obj[prop] === undefined || obj[prop] === null) {
      errors.push(`${prop} is required`);
    }
  }
  
  return errors;
}

class User {
  // ✅ USO CORRETO
  @Required
  email: string;
  
  @Required
  username: string;
  
  // Propriedade opcional (sem decorator)
  bio?: string;
  
  constructor(email: string, username: string, bio?: string) {
    this.email = email;
    this.username = username;
    this.bio = bio;
  }
}

const user1 = new User('', '', 'Bio text');
console.log(validateRequired(user1)); // ['email is required', 'username is required']

const user2 = new User('alice@example.com', 'alice');
console.log(validateRequired(user2)); // []
```

### Accessor Decorators

```typescript
// Decorator para clamping
function Clamp(min: number, max: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalSet = descriptor.set;
    
    if (!originalSet) {
      throw new Error('@Clamp requires a setter');
    }
    
    descriptor.set = function(value: number) {
      const clamped = Math.max(min, Math.min(max, value));
      originalSet.call(this, clamped);
    };
    
    return descriptor;
  };
}

class Volume {
  private _level: number = 50;
  
  // ✅ USO CORRETO - decorar getter/setter
  @Clamp(0, 100)
  set level(value: number) {
    this._level = value;
  }
  
  get level(): number {
    return this._level;
  }
}

const volume = new Volume();
volume.level = 150; // Clamped to 100
console.log(volume.level); // 100

volume.level = -10; // Clamped to 0
console.log(volume.level); // 0
```

## 🔗 Combinando Múltiplos Decorators

### Ordem de Execução

```typescript
function First(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('First evaluated');
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log('[First] Before');
    const result = original.apply(this, args);
    console.log('[First] After');
    return result;
  };
  
  return descriptor;
}

function Second(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('Second evaluated');
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log('[Second] Before');
    const result = original.apply(this, args);
    console.log('[Second] After');
    return result;
  };
  
  return descriptor;
}

class Example {
  // Ordem de AVALIAÇÃO: bottom-to-top (Second → First)
  // Ordem de EXECUÇÃO: top-to-bottom (First wraps Second wraps method)
  @First
  @Second
  method() {
    console.log('[Method] Executing');
    return 'result';
  }
}

new Example().method();

// Output:
// Second evaluated        ← Avaliação (bottom-to-top)
// First evaluated
// [First] Before          ← Execução (top-to-bottom)
// [Second] Before
// [Method] Executing
// [Second] After
// [First] After
```

### Padrões de Composição

```typescript
// Decorators configuráveis
function Log(options: { level: 'info' | 'debug' } = { level: 'info' }) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      console.log(`[${options.level.toUpperCase()}] ${propertyKey} called`);
      return original.apply(this, args);
    };
    
    return descriptor;
  };
}

function Retry(attempts: number = 3) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      for (let i = 0; i < attempts; i++) {
        try {
          return await original.apply(this, args);
        } catch (error) {
          if (i === attempts - 1) throw error;
          console.warn(`Attempt ${i + 1} failed, retrying...`);
        }
      }
    };
    
    return descriptor;
  };
}

function Timeout(ms: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      return Promise.race([
        original.apply(this, args),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), ms)
        )
      ]);
    };
    
    return descriptor;
  };
}

class ApiService {
  // ✅ Composição correta - ordem importa!
  @Log({ level: 'info' })        // 1. Log wrapper (outer)
  @Retry(3)                      // 2. Retry wrapper (middle)
  @Timeout(5000)                 // 3. Timeout wrapper (inner)
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }
  
  // Fluxo de execução:
  // Log → Retry → Timeout → original method
  //
  // Se falhar:
  // - Timeout detecta
  // - Retry tenta novamente
  // - Log registra cada tentativa
}
```

## 🛠️ Casos de Uso Práticos

### 1. Validation System

```typescript
import 'reflect-metadata';

const validationKey = Symbol('validation');

interface Rule {
  property: string;
  validator: (value: any) => boolean;
  message: string;
}

// Decorators de validação
function IsEmail(target: any, propertyKey: string) {
  addRule(target, propertyKey, 
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    'must be valid email'
  );
}

function MinLength(length: number) {
  return function(target: any, propertyKey: string) {
    addRule(target, propertyKey,
      (v) => typeof v === 'string' && v.length >= length,
      `must be at least ${length} characters`
    );
  };
}

function addRule(target: any, property: string, validator: any, message: string) {
  const rules: Rule[] = Reflect.getMetadata(validationKey, target) || [];
  rules.push({ property, validator, message });
  Reflect.defineMetadata(validationKey, rules, target);
}

// Validator
class Validator {
  static validate(obj: any): { valid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};
    const rules: Rule[] = 
      Reflect.getMetadata(validationKey, Object.getPrototypeOf(obj)) || [];
    
    for (const rule of rules) {
      const value = obj[rule.property];
      
      if (!rule.validator(value)) {
        if (!errors[rule.property]) {
          errors[rule.property] = [];
        }
        errors[rule.property].push(rule.message);
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// ✅ USO
class SignupDto {
  @IsEmail
  email: string;
  
  @MinLength(8)
  password: string;
  
  @MinLength(3)
  username: string;
  
  constructor(email: string, password: string, username: string) {
    this.email = email;
    this.password = password;
    this.username = username;
  }
}

const dto = new SignupDto('invalid', '123', 'ab');
const result = Validator.validate(dto);

console.log(result);
// {
//   valid: false,
//   errors: {
//     email: ['must be valid email'],
//     password: ['must be at least 8 characters'],
//     username: ['must be at least 3 characters']
//   }
// }
```

### 2. Authorization System

```typescript
import 'reflect-metadata';

const rolesKey = Symbol('roles');

// Current user (simulação)
let currentUser: { id: number; roles: string[] } | null = null;

function setCurrentUser(user: typeof currentUser) {
  currentUser = user;
}

// Decorator de autorização
function RequireRole(...roles: string[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(rolesKey, roles, target, propertyKey);
    
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      if (!currentUser) {
        throw new Error('Authentication required');
      }
      
      const requiredRoles = Reflect.getMetadata(rolesKey, target, propertyKey);
      const hasRole = requiredRoles.some((role: string) => 
        currentUser!.roles.includes(role)
      );
      
      if (!hasRole) {
        throw new Error(
          `Insufficient permissions. Required: ${requiredRoles.join(' or ')}`
        );
      }
      
      return original.apply(this, args);
    };
    
    return descriptor;
  };
}

// ✅ USO
class AdminService {
  @RequireRole('admin')
  deleteUser(userId: number): void {
    console.log(`User ${userId} deleted`);
  }
  
  @RequireRole('admin', 'moderator')
  banUser(userId: number): void {
    console.log(`User ${userId} banned`);
  }
  
  // Sem decorator - público
  getUserInfo(userId: number): any {
    return { id: userId, name: 'User' };
  }
}

const service = new AdminService();

// Teste 1: Sem autenticação
try {
  service.deleteUser(1);
} catch (error) {
  console.error(error); // "Authentication required"
}

// Teste 2: Usuário comum
setCurrentUser({ id: 1, roles: ['user'] });
try {
  service.deleteUser(1);
} catch (error) {
  console.error(error); // "Insufficient permissions..."
}

// Teste 3: Moderador
setCurrentUser({ id: 2, roles: ['moderator'] });
service.banUser(1); // ✅ OK - moderator pode banir
try {
  service.deleteUser(1);
} catch (error) {
  console.error(error); // ❌ Moderator não pode deletar
}

// Teste 4: Admin
setCurrentUser({ id: 3, roles: ['admin'] });
service.deleteUser(1); // ✅ OK
service.banUser(1); // ✅ OK
```

### 3. Caching System

```typescript
interface CacheOptions {
  ttl?: number; // milliseconds
  keyGenerator?: (...args: any[]) => string;
}

function Cacheable(options: CacheOptions = {}) {
  const cache = new Map<string, { value: any; expiry: number }>();
  const ttl = options.ttl || 60000; // default 1 minute
  
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      // Gerar chave de cache
      const key = options.keyGenerator
        ? options.keyGenerator(...args)
        : `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;
      
      // Verificar cache
      const cached = cache.get(key);
      if (cached && cached.expiry > Date.now()) {
        console.log(`[Cache HIT] ${key}`);
        return cached.value;
      }
      
      console.log(`[Cache MISS] ${key}`);
      
      // Executar método original
      const result = await original.apply(this, args);
      
      // Armazenar em cache
      cache.set(key, {
        value: result,
        expiry: Date.now() + ttl
      });
      
      return result;
    };
    
    return descriptor;
  };
}

// ✅ USO
class UserService {
  @Cacheable({ 
    ttl: 30000, // 30 seconds
    keyGenerator: (id) => `user:${id}`
  })
  async getUser(id: number): Promise<any> {
    console.log(`Fetching user ${id} from database...`);
    // Simulação de query ao banco
    await new Promise(resolve => setTimeout(resolve, 100));
    return { id, name: 'Alice', email: 'alice@example.com' };
  }
  
  @Cacheable({ ttl: 60000 }) // 1 minute
  async getUsers(): Promise<any[]> {
    console.log('Fetching all users from database...');
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];
  }
}

(async () => {
  const service = new UserService();
  
  await service.getUser(1); // Cache MISS - busca do banco
  await service.getUser(1); // Cache HIT - retorna do cache
  await service.getUser(2); // Cache MISS - ID diferente
  
  await service.getUsers(); // Cache MISS
  await service.getUsers(); // Cache HIT
})();
```

## 🧩 Integração com Frameworks

### Angular

```typescript
import { Component, Injectable, NgModule } from '@angular/core';

// Class decorators
@Component({
  selector: 'app-user',
  template: '<div>{{ user.name }}</div>'
})
export class UserComponent {
  user = { name: 'Alice' };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers() {
    return [];
  }
}

@NgModule({
  declarations: [UserComponent],
  providers: [UserService]
})
export class AppModule {}

// ✅ USO CORRETO
// - @Component para definir componentes
// - @Injectable para serviços (DI)
// - @NgModule para módulos
// - @Input()/@Output() para properties de componentes
```

### NestJS

```typescript
import { 
  Controller, Get, Post, Body, Param, 
  Injectable, UseGuards 
} from '@nestjs/common';

// Class decorator para controller
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  
  // Method decorators para rotas
  @Get()
  findAll(): any[] {
    return this.userService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string): any {
    //       ↑ Parameter decorator
    return this.userService.findOne(+id);
  }
  
  @Post()
  @UseGuards(AuthGuard)  // Method decorator para guard
  create(@Body() createDto: any): any {
    //    ↑ Parameter decorator
    return this.userService.create(createDto);
  }
}

@Injectable()
export class UserService {
  findAll() { return []; }
  findOne(id: number) { return {}; }
  create(data: any) { return data; }
}

// ✅ USO CORRETO
// - @Controller para definir rotas base
// - @Get/@Post/@Put/@Delete para HTTP methods
// - @Body/@Param/@Query para extrair dados do request
// - @Injectable para DI
// - @UseGuards/@UseInterceptors para middleware
```

### TypeORM

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

// Class decorator para entidade
@Entity('users')
export class User {
  // Property decorator para primary key auto-increment
  @PrimaryGeneratedColumn()
  id: number;
  
  // Property decorator para coluna
  @Column({ length: 100 })
  username: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column({ nullable: true })
  bio: string;
  
  @Column({ type: 'int', default: 0 })
  points: number;
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  title: string;
  
  @Column('text')
  content: string;
  
  // Relationship decorator
  @ManyToOne(() => User, user => user.posts)
  author: User;
}

// ✅ USO CORRETO
// - @Entity para mapear classe → tabela
// - @Column para mapear propriedade → coluna
// - @PrimaryGeneratedColumn para ID auto-increment
// - @ManyToOne/@OneToMany/@OneToOne/@ManyToMany para relações
```

### class-validator

```typescript
import { 
  IsEmail, IsNotEmpty, MinLength, MaxLength, 
  IsInt, Min, Max, validate 
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
  
  @IsNotEmpty()
  @MinLength(3)
  username: string;
  
  @IsInt()
  @Min(18)
  @Max(120)
  age: number;
}

// ✅ USO
async function validateDto() {
  const dto = new CreateUserDto();
  dto.email = 'invalid';
  dto.password = '123';
  dto.username = 'ab';
  dto.age = 15;
  
  const errors = await validate(dto);
  console.log(errors);
  // Array de ValidationError com constraints detalhados
}
```

## 🐛 Debugging

### Console Logging

```typescript
// Adicionar logs para entender fluxo
function Debug(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log(`[Decorator Applied] ${target.constructor.name}.${propertyKey}`);
  
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`[Calling] ${propertyKey}`, { args, this: this });
    const result = original.apply(this, args);
    console.log(`[Returned] ${propertyKey}`, { result });
    return result;
  };
  
  return descriptor;
}
```

### Stack Trace

```typescript
// Ver stack trace em erros
function TraceErrors(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    try {
      return original.apply(this, args);
    } catch (error) {
      console.error(`Error in ${target.constructor.name}.${propertyKey}:`);
      console.error('Stack trace:', (error as Error).stack);
      throw error;
    }
  };
  
  return descriptor;
}
```

### Verificar Metadata

```typescript
import 'reflect-metadata';

// Inspecionar metadata anexada
function inspectMetadata(target: any, propertyKey?: string) {
  const keys = Reflect.getMetadataKeys(target, propertyKey as any);
  
  console.log('Metadata keys:', keys);
  
  for (const key of keys) {
    const value = Reflect.getMetadata(key, target, propertyKey as any);
    console.log(`  ${String(key)}:`, value);
  }
}

@Entity({ tableName: 'users' })
class User {
  @Column({ type: 'varchar' })
  name: string;
}

inspectMetadata(User);
inspectMetadata(User.prototype, 'name');
```

## ⚠️ Armadilhas Comuns

### 1. Esquecer experimentalDecorators

```typescript
// ❌ ERRO sem experimentalDecorators: true
// "Unable to resolve signature of class decorator when called as an expression"
```

**Solução**: Adicionar em `tsconfig.json`:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### 2. Decorator em Arrow Function

```typescript
class Example {
  // ❌ ERRO - arrow function é property, não method
  @Log
  method = () => {
    return 'hello';
  };
  
  // ✅ CORRETO - method tradicional
  @Log
  method() {
    return 'hello';
  }
}
```

### 3. Ordem Incorreta

```typescript
class Service {
  // ❌ Ordem ruim - timeout pode não funcionar com retry
  @Retry(3)
  @Timeout(5000)
  async fetch() {}
  
  // ✅ Ordem correta - timeout dentro de retry
  @Timeout(5000)
  @Retry(3)
  async fetch() {}
}
```

### 4. Perder Type Information

```typescript
class Example {
  @SomeDecorator
  method(name: string): string {
    return name;
  }
}

const ex = new Example();
ex.method(123); // ❌ TypeScript não detecta erro!
// Decorators podem causar loss of type information
```

**Solução**: Usar `TypedPropertyDescriptor<T>` quando possível.

## 🚀 Boas Práticas

1. **Sempre retornar descriptor** em method/accessor decorators
2. **Usar `function` tradicional**, não arrow function no wrapper
3. **Preservar `this` context** com `.apply(this, args)`
4. **Documentar** opções e comportamento dos decorators
5. **Testar** decorators isoladamente antes de usar
6. **Considerar ordem** ao combinar múltiplos decorators
7. **Usar metadata** para configuração declarativa
8. **Evitar side effects** desnecessários em decorators

---

**Conclusão**: Usar decorators efetivamente requer entender configuração, ordem de execução, composição, e integração com frameworks. Com prática, decorators tornam código mais limpo e declarativo.
