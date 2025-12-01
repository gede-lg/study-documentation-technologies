# Mock e Stub: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Mock** e **Stub** são **test doubles** (substitutos de teste) que simulam comportamento de dependências externas durante testes unitários, permitindo isolar unidade sendo testada. **Stub** fornece **respostas pré-programadas** para chamadas, enquanto **Mock** adiciona **verificação de comportamento**, registrando como foi usado e permitindo assertions sobre interações. Conceitualmente, representam **controlled dependencies**, eliminando incertezas de testes causadas por APIs externas, bancos de dados ou serviços de terceiros.

Na essência, mocks e stubs materializam o princípio de **isolation in unit testing**, onde você testa apenas código da unidade atual, substituindo tudo que está fora por versões controladas e previsíveis, garantindo testes rápidos, determinísticos e independentes de infraestrutura externa.

## 📋 Fundamentos

### Test Doubles - Hierarquia

```
Test Doubles (substitutos de teste):

1. Dummy - Objeto passado mas nunca usado
2. Stub - Retorna respostas fixas
3. Spy - Registra como foi chamado
4. Mock - Stub + Spy + verificação de comportamento
5. Fake - Implementação simplificada funcional
```

**Conceito-chave:**
- **Stub** = "o que retorna" (state verification)
- **Mock** = "como foi chamado" (behavior verification)

### Stub Básico

```typescript
// src/user.service.ts
export interface UserRepository {
  findById(id: number): Promise<User>;
  save(user: User): Promise<void>;
}

export class UserService {
  constructor(private repository: UserRepository) {}

  async getUserName(id: number): Promise<string> {
    const user = await this.repository.findById(id);
    return user.name;
  }
}

// src/user.service.spec.ts
describe('UserService', () => {
  it('deve retornar nome do usuário', async () => {
    // Stub: retorna valor fixo
    const stubRepository: UserRepository = {
      findById: async (id: number) => ({ id, name: 'João', email: 'joao@test.com' }),
      save: async () => {}
    };

    const service = new UserService(stubRepository);

    const name = await service.getUserName(1);
    expect(name).toBe('João');
  });
});
```

**Conceito:** Stub fornece **dados controlados** sem verificar interações.

### Mock com Jest

```typescript
describe('UserService', () => {
  it('deve chamar repository.findById com ID correto', async () => {
    // Mock: jest.fn() cria função mockada
    const mockRepository: UserRepository = {
      findById: jest.fn().mockResolvedValue({ id: 1, name: 'João', email: 'joao@test.com' }),
      save: jest.fn()
    };

    const service = new UserService(mockRepository);

    await service.getUserName(1);

    // Verificação de comportamento
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
  });
});
```

**Conceito:** Mock adiciona **assertions sobre como foi usado**.

## 🔍 Análise Conceitual

### 1. jest.fn() - Função Mock

```typescript
describe('jest.fn()', () => {
  it('cria função mock', () => {
    const mockFn = jest.fn();

    mockFn('hello');
    mockFn('world');

    // Verificar chamadas
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('hello');
    expect(mockFn).toHaveBeenLastCalledWith('world');
    expect(mockFn).toHaveBeenNthCalledWith(1, 'hello');
  });

  it('pode retornar valor', () => {
    const mockFn = jest.fn().mockReturnValue(42);

    const result = mockFn();
    expect(result).toBe(42);
  });

  it('pode retornar valores diferentes', () => {
    const mockFn = jest.fn()
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second')
      .mockReturnValue('default');

    expect(mockFn()).toBe('first');
    expect(mockFn()).toBe('second');
    expect(mockFn()).toBe('default');
    expect(mockFn()).toBe('default');
  });

  it('pode retornar Promise', () => {
    const mockFn = jest.fn().mockResolvedValue('success');

    return expect(mockFn()).resolves.toBe('success');
  });

  it('pode lançar erro', () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Ops!'));

    return expect(mockFn()).rejects.toThrow('Ops!');
  });
});
```

**API jest.fn():**
```typescript
mockFn.mockReturnValue(value)           // Retorna valor
mockFn.mockReturnValueOnce(value)       // Uma vez
mockFn.mockResolvedValue(value)         // Promise resolve
mockFn.mockRejectedValue(error)         // Promise reject
mockFn.mockImplementation((x) => x * 2) // Implementação customizada
```

### 2. Mock de Dependências Externas

```typescript
// src/email.service.ts
export interface EmailProvider {
  send(to: string, subject: string, body: string): Promise<void>;
}

export class EmailService {
  constructor(private provider: EmailProvider) {}

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const subject = 'Welcome!';
    const body = `Hello ${name}, welcome to our platform!`;

    await this.provider.send(email, subject, body);
  }
}

// src/email.service.spec.ts
describe('EmailService', () => {
  it('deve enviar email com dados corretos', async () => {
    // Mock do provider
    const mockProvider: EmailProvider = {
      send: jest.fn().mockResolvedValue(undefined)
    };

    const service = new EmailService(mockProvider);

    await service.sendWelcomeEmail('user@example.com', 'João');

    // Verificar que send foi chamado corretamente
    expect(mockProvider.send).toHaveBeenCalledWith(
      'user@example.com',
      'Welcome!',
      'Hello João, welcome to our platform!'
    );
  });

  it('deve propagar erro do provider', async () => {
    const mockProvider: EmailProvider = {
      send: jest.fn().mockRejectedValue(new Error('SMTP error'))
    };

    const service = new EmailService(mockProvider);

    await expect(
      service.sendWelcomeEmail('user@example.com', 'João')
    ).rejects.toThrow('SMTP error');
  });
});
```

### 3. jest.spyOn() - Espionar Métodos

```typescript
// src/logger.ts
export class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

export class UserService {
  constructor(private logger: Logger) {}

  createUser(name: string): void {
    this.logger.log(`Creating user: ${name}`);
    // lógica de criação
    this.logger.log('User created successfully');
  }
}

// src/user.service.spec.ts
describe('UserService', () => {
  it('deve logar criação de usuário', () => {
    const logger = new Logger();

    // Espionar método real
    const logSpy = jest.spyOn(logger, 'log');

    const service = new UserService(logger);
    service.createUser('João');

    // Verificar chamadas
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Creating user: João');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'User created successfully');

    // Restaurar implementação original
    logSpy.mockRestore();
  });

  it('pode mockar implementação com spy', () => {
    const logger = new Logger();
    const logSpy = jest.spyOn(logger, 'log').mockImplementation(() => {
      // Não faz nada (silencioso)
    });

    const service = new UserService(logger);
    service.createUser('João');

    expect(logSpy).toHaveBeenCalled();
    // Console limpo (sem output)
  });
});
```

**Conceito:** `jest.spyOn()` permite **monitorar** métodos reais sem substituí-los completamente.

### 4. Mock de Módulos Inteiros

```typescript
// src/http-client.ts
import axios from 'axios';

export class HttpClient {
  async fetchUser(id: number) {
    const response = await axios.get(`https://api.example.com/users/${id}`);
    return response.data;
  }
}

// src/http-client.spec.ts
import axios from 'axios';

// Mock do módulo inteiro
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('deve fazer requisição GET correta', async () => {
    const mockData = { id: 1, name: 'João' };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const client = new HttpClient();
    const result = await client.fetchUser(1);

    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/users/1');
  });

  it('deve lançar erro em falha de requisição', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    const client = new HttpClient();

    await expect(client.fetchUser(1)).rejects.toThrow('Network error');
  });
});
```

### 5. Mock Parcial de Módulo

```typescript
// src/utils.ts
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getCurrentDate = (): Date => {
  return new Date();
};

// src/service.ts
import { formatDate, getCurrentDate } from './utils';

export class ReportService {
  generateReport(): string {
    const today = getCurrentDate();
    return `Report generated on ${formatDate(today)}`;
  }
}

// src/service.spec.ts
import { ReportService } from './service';
import * as utils from './utils';

describe('ReportService', () => {
  it('deve gerar relatório com data mockada', () => {
    // Mock apenas getCurrentDate, mantém formatDate real
    jest.spyOn(utils, 'getCurrentDate').mockReturnValue(
      new Date('2024-01-15')
    );

    const service = new ReportService();
    const report = service.generateReport();

    expect(report).toBe('Report generated on 2024-01-15');
  });
});
```

### 6. Stub vs Mock - Diferenças Práticas

```typescript
// src/payment.service.ts
export interface PaymentGateway {
  charge(amount: number, cardToken: string): Promise<{ id: string; status: 'success' | 'failed' }>;
}

export class PaymentService {
  constructor(private gateway: PaymentGateway) {}

  async processPayment(amount: number, cardToken: string): Promise<boolean> {
    const result = await this.gateway.charge(amount, cardToken);
    return result.status === 'success';
  }
}

// STUB - Foca no RESULTADO
describe('PaymentService com Stub', () => {
  it('deve retornar true para pagamento bem-sucedido', async () => {
    // Stub: apenas retorna valor
    const stubGateway: PaymentGateway = {
      charge: async () => ({ id: '123', status: 'success' })
    };

    const service = new PaymentService(stubGateway);
    const result = await service.processPayment(100, 'token123');

    expect(result).toBe(true);  // Verifica STATE (resultado)
  });
});

// MOCK - Foca na INTERAÇÃO
describe('PaymentService com Mock', () => {
  it('deve chamar gateway.charge com parâmetros corretos', async () => {
    // Mock: verifica comportamento
    const mockGateway: PaymentGateway = {
      charge: jest.fn().mockResolvedValue({ id: '123', status: 'success' })
    };

    const service = new PaymentService(mockGateway);
    await service.processPayment(100, 'token123');

    // Verifica BEHAVIOR (como foi chamado)
    expect(mockGateway.charge).toHaveBeenCalledWith(100, 'token123');
    expect(mockGateway.charge).toHaveBeenCalledTimes(1);
  });
});
```

**Conceito:**
- **Stub** = "Dado X, retorna Y" (state verification)
- **Mock** = "Verifica que foi chamado com Z" (behavior verification)

### 7. Fake - Implementação Simplificada

```typescript
// src/database.ts
export interface Database {
  save(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
  delete(key: string): Promise<void>;
}

// src/fake-database.ts
export class FakeDatabase implements Database {
  private storage = new Map<string, any>();

  async save(key: string, value: any): Promise<void> {
    this.storage.set(key, value);
  }

  async get(key: string): Promise<any> {
    return this.storage.get(key);
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

// src/cache.service.spec.ts
describe('CacheService', () => {
  it('deve usar fake database', async () => {
    // Fake: implementação real simplificada
    const fakeDb = new FakeDatabase();
    const cache = new CacheService(fakeDb);

    await cache.set('user:1', { name: 'João' });
    const value = await cache.get('user:1');

    expect(value).toEqual({ name: 'João' });
  });
});
```

**Conceito:** Fake é **implementação funcional simplificada** (ex: in-memory DB em vez de PostgreSQL real).

## 🎯 Aplicabilidade

### Mock de Serviço HTTP

```typescript
// src/api.service.ts
import axios, { AxiosInstance } from 'axios';

export class ApiService {
  constructor(private http: AxiosInstance = axios.create()) {}

  async getUsers(): Promise<User[]> {
    const response = await this.http.get('/users');
    return response.data;
  }

  async createUser(user: Partial<User>): Promise<User> {
    const response = await this.http.post('/users', user);
    return response.data;
  }
}

// src/api.service.spec.ts
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiService', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn()
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
  });

  describe('getUsers', () => {
    it('deve retornar lista de usuários', async () => {
      const mockUsers = [
        { id: 1, name: 'João' },
        { id: 2, name: 'Maria' }
      ];

      mockAxiosInstance.get.mockResolvedValue({ data: mockUsers });

      const service = new ApiService();
      const users = await service.getUsers();

      expect(users).toEqual(mockUsers);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users');
    });

    it('deve propagar erro de rede', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      const service = new ApiService();

      await expect(service.getUsers()).rejects.toThrow('Network error');
    });
  });

  describe('createUser', () => {
    it('deve criar usuário', async () => {
      const newUser = { name: 'Pedro' };
      const createdUser = { id: 3, name: 'Pedro' };

      mockAxiosInstance.post.mockResolvedValue({ data: createdUser });

      const service = new ApiService();
      const result = await service.createUser(newUser);

      expect(result).toEqual(createdUser);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', newUser);
    });
  });
});
```

### Mock de Timers

```typescript
// src/scheduler.ts
export class Scheduler {
  scheduleTask(callback: () => void, delay: number): void {
    setTimeout(callback, delay);
  }

  scheduleInterval(callback: () => void, interval: number): NodeJS.Timer {
    return setInterval(callback, interval);
  }
}

// src/scheduler.spec.ts
describe('Scheduler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve executar callback após delay', () => {
    const callback = jest.fn();
    const scheduler = new Scheduler();

    scheduler.scheduleTask(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    // Avançar 1000ms
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('deve executar callback em intervalo', () => {
    const callback = jest.fn();
    const scheduler = new Scheduler();

    scheduler.scheduleInterval(callback, 500);

    jest.advanceTimersByTime(1500);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});
```

## ⚠️ Considerações

### 1. Over-mocking

```typescript
// ❌ Ruim: mockar tudo
test('bad test', () => {
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  const mock3 = jest.fn();
  // teste frágil, testa implementação
});

// ✅ Bom: mockar apenas dependências externas
test('good test', () => {
  const mockExternalApi = jest.fn();
  // testa comportamento real do código
});
```

### 2. Testes Frágeis

```typescript
// ❌ Ruim: verifica ordem exata de chamadas
expect(mockFn).toHaveBeenNthCalledWith(1, 'first');
expect(mockFn).toHaveBeenNthCalledWith(2, 'second');

// ✅ Bom: verifica apenas que foi chamado
expect(mockFn).toHaveBeenCalledWith('expected');
```

### 3. Limpar Mocks

```typescript
describe('suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();  // Limpa histórico de chamadas
  });

  afterEach(() => {
    jest.restoreAllMocks();  // Restaura implementações
  });
});
```

## 📚 Conclusão

Mock e Stub são **test doubles** para isolar unidades. **Stub** fornece respostas fixas (state verification), **Mock** verifica comportamento (how it was called). jest.fn() cria mocks: mockReturnValue, mockResolvedValue, mockRejectedValue. jest.spyOn() monitora métodos reais. jest.mock() mocka módulos inteiros. Fake é implementação simplificada funcional. Usar mocks para dependências externas (API, DB, filesystem). Evitar over-mocking (testar implementação). Limpar mocks com clearAllMocks/restoreAllMocks. Mock timers com useFakeTimers. TypeScript garante type safety em mocks.

