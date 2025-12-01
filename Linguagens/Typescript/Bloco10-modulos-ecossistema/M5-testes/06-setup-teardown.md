# Setup e Teardown: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Setup** (preparação) e **Teardown** (limpeza) são **lifecycle hooks** do Jest que executam código antes e depois de testes, preparando ambiente necessário (criar instâncias, mockar dependências, popular dados) e limpando após execução (resetar estado, fechar conexões, limpar mocks). Conceitualmente, representam **test isolation**, garantindo que cada teste começa com estado limpo e previsível, sem ser afetado por testes anteriores ou afetar subsequentes.

Na essência, setup/teardown materializam o princípio de **independent tests**, onde testes são auto-contidos e podem executar em qualquer ordem sem falhas, eliminando acoplamento temporal e side effects entre testes, fundamentais para suite de testes confiável e manutenível.

## 📋 Fundamentos

### Lifecycle Hooks

```typescript
beforeAll(() => {
  // Executa UMA VEZ antes de TODOS os testes do describe
});

beforeEach(() => {
  // Executa ANTES de CADA teste
});

afterEach(() => {
  // Executa DEPOIS de CADA teste
});

afterAll(() => {
  // Executa UMA VEZ depois de TODOS os testes do describe
});
```

**Ordem de execução:**
```
beforeAll
  beforeEach
    test 1
  afterEach

  beforeEach
    test 2
  afterEach

  beforeEach
    test 3
  afterEach
afterAll
```

**Conceito-chave:** beforeEach/afterEach garantem **isolamento** entre testes.

### Exemplo Básico

```typescript
describe('Calculator', () => {
  let calculator: Calculator;

  // Setup: antes de CADA teste
  beforeEach(() => {
    calculator = new Calculator();
  });

  // Teardown: depois de CADA teste
  afterEach(() => {
    calculator = null as any;
  });

  test('soma', () => {
    expect(calculator.sum(2, 3)).toBe(5);
  });

  test('subtrai', () => {
    expect(calculator.subtract(5, 3)).toBe(2);
  });
});
```

## 🔍 Análise Conceitual

### 1. beforeEach - Preparação por Teste

```typescript
describe('ShoppingCart', () => {
  let cart: ShoppingCart;
  let product1: Product;
  let product2: Product;

  beforeEach(() => {
    // Estado limpo para CADA teste
    cart = new ShoppingCart();

    product1 = { id: 1, name: 'Laptop', price: 1000 };
    product2 = { id: 2, name: 'Mouse', price: 50 };
  });

  test('carrinho começa vazio', () => {
    expect(cart.getItemCount()).toBe(0);
  });

  test('adiciona item', () => {
    cart.addItem(product1);
    expect(cart.getItemCount()).toBe(1);
  });

  test('calcula total corretamente', () => {
    cart.addItem(product1);
    cart.addItem(product2);

    // Cada teste tem carrinho limpo
    // Este teste NÃO é afetado pelo anterior
    expect(cart.getTotal()).toBe(1050);
  });
});
```

**Conceito:** beforeEach garante **fresh start** - cada teste independente.

### 2. beforeAll - Setup Custoso

```typescript
describe('Database tests', () => {
  let database: Database;

  // Executado UMA VEZ
  beforeAll(async () => {
    database = new Database();
    await database.connect();
    await database.migrate();
    console.log('Database connected');
  });

  // Executado DEPOIS de CADA teste
  afterEach(async () => {
    await database.clearTables();  // Limpa dados, mantém conexão
  });

  // Executado UMA VEZ no final
  afterAll(async () => {
    await database.disconnect();
    console.log('Database disconnected');
  });

  test('insere usuário', async () => {
    await database.insert('users', { name: 'João' });
    const users = await database.select('users');
    expect(users).toHaveLength(1);
  });

  test('insere produto', async () => {
    await database.insert('products', { name: 'Laptop' });
    const products = await database.select('products');
    expect(products).toHaveLength(1);
    // Tabela users está limpa (afterEach)
  });
});
```

**Conceito:** beforeAll para setup **custoso** (conexão DB, inicialização pesada), reutilizado entre testes.

### 3. afterEach - Limpeza por Teste

```typescript
describe('Logger tests', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mockar console.log
    logSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // IMPORTANTE: restaurar após cada teste
    logSpy.mockRestore();
  });

  test('loga mensagem', () => {
    const logger = new Logger();
    logger.log('Hello');

    expect(logSpy).toHaveBeenCalledWith('[LOG]', 'Hello');
  });

  test('loga múltiplas mensagens', () => {
    const logger = new Logger();
    logger.log('First');
    logger.log('Second');

    expect(logSpy).toHaveBeenCalledTimes(2);
  });
});
```

**Conceito:** afterEach **limpa side effects** (mocks, spies, timers).

### 4. Escopo de Hooks

```typescript
describe('Outer suite', () => {
  beforeEach(() => {
    console.log('Outer beforeEach');
  });

  test('outer test', () => {
    console.log('Outer test');
  });

  describe('Inner suite', () => {
    beforeEach(() => {
      console.log('Inner beforeEach');
    });

    test('inner test', () => {
      console.log('Inner test');
    });
  });
});

// Output:
// Outer beforeEach
// Outer test

// Outer beforeEach
// Inner beforeEach
// Inner test
```

**Conceito:** Hooks **herdam** de describes externos, executam de **fora para dentro**.

### 5. Setup Assíncrono

```typescript
describe('API tests', () => {
  let server: Server;

  // beforeAll assíncrono
  beforeAll(async () => {
    server = new Server();
    await server.start();
    console.log('Server started on port 3000');
  }, 10000);  // Timeout de 10s

  afterAll(async () => {
    await server.stop();
    console.log('Server stopped');
  });

  // beforeEach também pode ser assíncrono
  beforeEach(async () => {
    await server.clearDatabase();
  });

  test('GET /users retorna array vazio', async () => {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    expect(users).toEqual([]);
  });

  test('POST /users cria usuário', async () => {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'João' }),
      headers: { 'Content-Type': 'application/json' }
    });

    expect(response.status).toBe(201);
  });
});
```

### 6. Mock Reset Patterns

```typescript
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Resetar implementações
    jest.resetAllMocks();
  });

  test('GET request', async () => {
    mockedAxios.get.mockResolvedValue({ data: { id: 1 } });

    const client = new HttpClient();
    const result = await client.get('/users/1');

    expect(result).toEqual({ id: 1 });
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  test('POST request', async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 2 } });

    const client = new HttpClient();
    const result = await client.post('/users', { name: 'Maria' });

    expect(result).toEqual({ id: 2 });
    // Mock limpo (não conta chamadas do teste anterior)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
```

**Conceito:**
- `clearAllMocks()` - Limpa **histórico** de chamadas
- `resetAllMocks()` - Limpa histórico + **implementações**
- `restoreAllMocks()` - Restaura implementação **original**

### 7. Timer Management

```typescript
describe('Scheduler tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('executa callback após timeout', () => {
    const callback = jest.fn();

    setTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('executa interval múltiplas vezes', () => {
    const callback = jest.fn();

    setInterval(callback, 500);

    jest.advanceTimersByTime(1500);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});
```

### 8. Test Fixtures

```typescript
// fixtures/users.ts
export const userFixtures = {
  admin: {
    id: 1,
    name: 'Admin',
    email: 'admin@test.com',
    role: 'admin'
  },
  regular: {
    id: 2,
    name: 'User',
    email: 'user@test.com',
    role: 'user'
  }
};

// user.service.spec.ts
import { userFixtures } from './fixtures/users';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn()
    } as any;

    service = new UserService(mockRepository);
  });

  test('busca usuário admin', async () => {
    mockRepository.findById.mockResolvedValue(userFixtures.admin);

    const user = await service.getUser(1);

    expect(user.role).toBe('admin');
  });

  test('busca usuário regular', async () => {
    mockRepository.findById.mockResolvedValue(userFixtures.regular);

    const user = await service.getUser(2);

    expect(user.role).toBe('user');
  });
});
```

**Conceito:** Fixtures fornecem **dados de teste reutilizáveis**.

### 9. Helper Functions

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let mockTokenService: jest.Mocked<TokenService>;

  // Helper para criar service com mocks
  function createService(overrides?: Partial<TokenService>) {
    const defaultMocks = {
      generate: jest.fn().mockReturnValue('token123'),
      verify: jest.fn().mockReturnValue({ userId: 1 }),
      ...overrides
    };

    mockTokenService = defaultMocks as any;
    return new AuthService(mockTokenService);
  }

  beforeEach(() => {
    service = createService();
  });

  test('login gera token', async () => {
    const token = await service.login('user@test.com', 'password');

    expect(token).toBe('token123');
    expect(mockTokenService.generate).toHaveBeenCalled();
  });

  test('login com token customizado', async () => {
    // Override apenas generate
    service = createService({
      generate: jest.fn().mockReturnValue('custom-token')
    });

    const token = await service.login('user@test.com', 'password');

    expect(token).toBe('custom-token');
  });
});
```

## 🎯 Aplicabilidade

### Database Tests

```typescript
describe('UserRepository - Integration', () => {
  let db: Database;
  let repository: UserRepository;

  beforeAll(async () => {
    // Setup pesado uma vez
    db = new Database(process.env.TEST_DATABASE_URL);
    await db.connect();
    await db.runMigrations();
  });

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await db.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    repository = new UserRepository(db);
  });

  afterAll(async () => {
    // Cleanup final
    await db.disconnect();
  });

  test('cria usuário', async () => {
    const user = await repository.create({
      name: 'João',
      email: 'joao@test.com'
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe('João');
  });

  test('busca usuário por email', async () => {
    await repository.create({
      name: 'Maria',
      email: 'maria@test.com'
    });

    const user = await repository.findByEmail('maria@test.com');

    expect(user).toBeDefined();
    expect(user?.name).toBe('Maria');
  });
});
```

### Environment Variables

```typescript
describe('ConfigService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Limpar e setar env vars
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      API_KEY: 'test-key-123',
      DATABASE_URL: 'postgresql://test'
    };
  });

  afterEach(() => {
    // Restaurar env original
    process.env = originalEnv;
  });

  test('lê variáveis de ambiente', () => {
    const config = new ConfigService();

    expect(config.apiKey).toBe('test-key-123');
    expect(config.databaseUrl).toBe('postgresql://test');
  });

  test('lança erro se variável ausente', () => {
    delete process.env.API_KEY;

    expect(() => new ConfigService()).toThrow('API_KEY is required');
  });
});
```

### File System Operations

```typescript
import fs from 'fs/promises';
import path from 'path';

describe('FileService', () => {
  const testDir = path.join(__dirname, 'test-files');

  beforeAll(async () => {
    // Criar diretório de teste
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Limpar arquivos após cada teste
    const files = await fs.readdir(testDir);
    await Promise.all(
      files.map(file => fs.unlink(path.join(testDir, file)))
    );
  });

  afterAll(async () => {
    // Remover diretório de teste
    await fs.rmdir(testDir);
  });

  test('escreve arquivo', async () => {
    const service = new FileService(testDir);
    await service.write('test.txt', 'Hello World');

    const content = await fs.readFile(
      path.join(testDir, 'test.txt'),
      'utf-8'
    );

    expect(content).toBe('Hello World');
  });

  test('lê arquivo', async () => {
    await fs.writeFile(path.join(testDir, 'data.txt'), 'Test Data');

    const service = new FileService(testDir);
    const content = await service.read('data.txt');

    expect(content).toBe('Test Data');
  });
});
```

## ⚠️ Considerações

### 1. Evitar Estado Compartilhado

```typescript
// ❌ RUIM: estado compartilhado
let counter = 0;

describe('bad suite', () => {
  test('incrementa', () => {
    counter++;
    expect(counter).toBe(1);
  });

  test('incrementa novamente', () => {
    counter++;
    expect(counter).toBe(2);  // Depende do teste anterior!
  });
});

// ✅ BOM: estado isolado
describe('good suite', () => {
  let counter: number;

  beforeEach(() => {
    counter = 0;
  });

  test('incrementa', () => {
    counter++;
    expect(counter).toBe(1);
  });

  test('incrementa novamente', () => {
    counter++;
    expect(counter).toBe(1);  // Independente!
  });
});
```

### 2. beforeAll vs beforeEach

```typescript
// beforeAll - para setup CUSTOSO
beforeAll(async () => {
  await database.connect();     // Demorado
});

// beforeEach - para estado MUTÁVEL
beforeEach(() => {
  cart = new ShoppingCart();    // Rápido, precisa ser limpo
});
```

### 3. Async Cleanup

```typescript
describe('suite', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  afterAll(async () => {
    // IMPORTANTE: await cleanup
    await connection.close();
  });
});
```

### 4. Ordem Importa em describe Aninhados

```typescript
describe('outer', () => {
  beforeAll(() => console.log('1'));
  beforeEach(() => console.log('2'));

  describe('inner', () => {
    beforeAll(() => console.log('3'));
    beforeEach(() => console.log('4'));

    test('test', () => console.log('5'));
  });
});

// Output:
// 1, 3, 2, 4, 5
```

## 📚 Conclusão

Setup/teardown garantem **isolamento** de testes através de lifecycle hooks. **beforeEach/afterEach** executam por teste (estado limpo), **beforeAll/afterAll** uma vez (setup custoso). Ordem: beforeAll → beforeEach → test → afterEach → afterAll. Hooks herdam de describes externos. Usar beforeEach para criar instâncias limpas, afterEach para limpar mocks/spies/timers. beforeAll para conexões DB/server, afterAll para desconectar. Async hooks suportados (async/await). clearAllMocks() limpa histórico, resetAllMocks() limpa implementações. Fixtures fornecem dados reutilizáveis. Evitar estado compartilhado entre testes. Tests devem ser independentes e executáveis em qualquer ordem.

