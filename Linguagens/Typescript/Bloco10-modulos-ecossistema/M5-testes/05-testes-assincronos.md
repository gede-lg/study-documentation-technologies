# Testes Assíncronos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Testes assíncronos** são testes que verificam código que executa de forma **não-bloqueante**, lidando com Promises, async/await, callbacks e operações que completam no futuro (APIs, timers, I/O). Conceitualmente, representam **temporal testing**, onde verificação de resultado não é imediata mas depende de operações que levam tempo, exigindo mecanismos para Jest "esperar" conclusão antes de avaliar assertions.

Na essência, testes assíncronos materializam o princípio de **async-aware testing**, garantindo que testes não terminem prematuramente antes de operações assíncronas completarem, evitando falsos positivos (teste passa mas código está quebrado) e false negatives (teste falha erroneamente por timing).

## 📋 Fundamentos

### Problema de Código Assíncrono

```typescript
// ❌ ERRADO: teste termina antes da Promise resolver
test('busca usuário - QUEBRADO', () => {
  fetchUser(1).then(user => {
    expect(user.name).toBe('João');  // NUNCA executado!
  });
  // Jest termina teste aqui, antes da Promise resolver
});
```

**Conceito-chave:** Jest precisa **saber esperar** - usar return, async/await, ou done callback.

### Três Formas de Testar Async

```typescript
// 1. RETURN Promise
test('busca usuário - return Promise', () => {
  return fetchUser(1).then(user => {
    expect(user.name).toBe('João');
  });
});

// 2. ASYNC/AWAIT
test('busca usuário - async/await', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('João');
});

// 3. DONE callback (legado)
test('busca usuário - done', (done) => {
  fetchUser(1).then(user => {
    expect(user.name).toBe('João');
    done();
  });
});
```

## 🔍 Análise Conceitual

### 1. Promises - Return Pattern

```typescript
// src/api.service.ts
export class ApiService {
  async fetchUser(id: number): Promise<User> {
    const response = await fetch(`https://api.example.com/users/${id}`);
    return response.json();
  }
}

// src/api.service.spec.ts
import { ApiService } from './api.service';

describe('ApiService', () => {
  describe('fetchUser com return', () => {
    it('deve retornar usuário', () => {
      const service = new ApiService();

      // IMPORTANTE: return na Promise
      return service.fetchUser(1).then(user => {
        expect(user).toBeDefined();
        expect(user.id).toBe(1);
        expect(user.name).toBeTruthy();
      });
    });

    it('pode encadear múltiplos then', () => {
      const service = new ApiService();

      return service.fetchUser(1)
        .then(user => {
          expect(user.id).toBe(1);
          return user.name;
        })
        .then(name => {
          expect(name).toBeTruthy();
        });
    });
  });
});
```

**Conceito:** `return` faz Jest **aguardar** Promise resolver antes de finalizar teste.

### 2. Async/Await - Forma Recomendada

```typescript
describe('ApiService com async/await', () => {
  it('deve retornar usuário', async () => {
    const service = new ApiService();

    const user = await service.fetchUser(1);

    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.name).toBeTruthy();
  });

  it('pode fazer múltiplas awaits', async () => {
    const service = new ApiService();

    const user1 = await service.fetchUser(1);
    const user2 = await service.fetchUser(2);

    expect(user1.id).toBe(1);
    expect(user2.id).toBe(2);
  });

  it('await em bloco try/catch', async () => {
    const service = new ApiService();

    try {
      await service.fetchUser(999);
      fail('Deveria ter lançado erro');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
```

**Conceito:** `async` torna função assíncrona, `await` pausa execução até Promise resolver.

### 3. Testando Erros Assíncronos

```typescript
// src/user.service.ts
export class UserService {
  async getUserById(id: number): Promise<User> {
    if (id <= 0) {
      throw new Error('Invalid ID');
    }

    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new Error('User not found');
    }

    return response.json();
  }
}

// src/user.service.spec.ts
describe('UserService - erros', () => {
  // ✅ Forma 1: expect().rejects
  it('deve lançar erro para ID inválido', async () => {
    const service = new UserService();

    await expect(service.getUserById(-1)).rejects.toThrow('Invalid ID');
  });

  // ✅ Forma 2: try/catch
  it('deve lançar erro para ID inválido - try/catch', async () => {
    const service = new UserService();

    try {
      await service.getUserById(-1);
      fail('Deveria ter lançado erro');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Invalid ID');
    }
  });

  // ✅ Forma 3: expect().rejects com matcher
  it('deve lançar erro para usuário não encontrado', async () => {
    const service = new UserService();

    await expect(service.getUserById(999)).rejects.toThrow(/not found/);
  });
});
```

### 4. Promises com Resolvers

```typescript
describe('Testando resolves', () => {
  it('deve resolver com valor correto', async () => {
    const promise = Promise.resolve({ id: 1, name: 'João' });

    await expect(promise).resolves.toEqual({ id: 1, name: 'João' });
  });

  it('pode usar matchers com resolves', async () => {
    const promise = Promise.resolve('Hello World');

    await expect(promise).resolves.toMatch(/World/);
    await expect(promise).resolves.toBeTruthy();
  });
});

describe('Testando rejects', () => {
  it('deve rejeitar com erro', async () => {
    const promise = Promise.reject(new Error('Ops!'));

    await expect(promise).rejects.toThrow('Ops!');
  });

  it('pode usar matchers com rejects', async () => {
    const promise = Promise.reject(new Error('Network error'));

    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toThrow(/Network/);
  });
});
```

### 5. Callbacks (Legado)

```typescript
// src/legacy.ts
export function fetchUserCallback(
  id: number,
  callback: (error: Error | null, user?: User) => void
): void {
  setTimeout(() => {
    if (id === 1) {
      callback(null, { id: 1, name: 'João' });
    } else {
      callback(new Error('User not found'));
    }
  }, 100);
}

// src/legacy.spec.ts
describe('fetchUserCallback', () => {
  it('deve retornar usuário via callback', (done) => {
    fetchUserCallback(1, (error, user) => {
      expect(error).toBeNull();
      expect(user).toBeDefined();
      expect(user?.name).toBe('João');
      done();  // IMPORTANTE: sinaliza que teste terminou
    });
  });

  it('deve retornar erro via callback', (done) => {
    fetchUserCallback(999, (error, user) => {
      expect(error).toBeDefined();
      expect(error?.message).toBe('User not found');
      expect(user).toBeUndefined();
      done();
    });
  });

  it('timeout se done não for chamado', (done) => {
    setTimeout(() => {
      done();
    }, 100);
  }, 200);  // Timeout de 200ms
});
```

**Conceito:** `done()` callback sinaliza que teste assíncrono **completou**.

### 6. Timers e setTimeout

```typescript
// src/scheduler.ts
export class Scheduler {
  schedule(callback: () => void, delay: number): void {
    setTimeout(callback, delay);
  }

  scheduleWithValue<T>(value: T, delay: number): Promise<T> {
    return new Promise(resolve => {
      setTimeout(() => resolve(value), delay);
    });
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

    scheduler.schedule(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    // Avançar tempo
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('pode usar runAllTimers', () => {
    const callback = jest.fn();
    const scheduler = new Scheduler();

    scheduler.schedule(callback, 5000);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
  });

  it('scheduleWithValue retorna valor após delay', async () => {
    const scheduler = new Scheduler();

    const promise = scheduler.scheduleWithValue('result', 1000);

    jest.advanceTimersByTime(1000);

    await expect(promise).resolves.toBe('result');
  });
});
```

**Conceito:** `jest.useFakeTimers()` permite **controlar tempo** artificialmente.

### 7. Múltiplas Promises Paralelas

```typescript
// src/batch.service.ts
export class BatchService {
  async fetchMultipleUsers(ids: number[]): Promise<User[]> {
    const promises = ids.map(id => fetchUser(id));
    return Promise.all(promises);
  }

  async fetchFirstAvailable(ids: number[]): Promise<User> {
    const promises = ids.map(id => fetchUser(id));
    return Promise.race(promises);
  }

  async fetchAllSettled(ids: number[]): Promise<PromiseSettledResult<User>[]> {
    const promises = ids.map(id => fetchUser(id));
    return Promise.allSettled(promises);
  }
}

// src/batch.service.spec.ts
describe('BatchService', () => {
  describe('fetchMultipleUsers', () => {
    it('deve buscar múltiplos usuários em paralelo', async () => {
      const service = new BatchService();

      const users = await service.fetchMultipleUsers([1, 2, 3]);

      expect(users).toHaveLength(3);
      expect(users[0].id).toBe(1);
      expect(users[1].id).toBe(2);
      expect(users[2].id).toBe(3);
    });

    it('deve falhar se uma Promise falhar', async () => {
      const service = new BatchService();

      await expect(
        service.fetchMultipleUsers([1, 999, 3])
      ).rejects.toThrow();
    });
  });

  describe('fetchFirstAvailable', () => {
    it('deve retornar primeiro que resolver', async () => {
      const service = new BatchService();

      const user = await service.fetchFirstAvailable([1, 2, 3]);

      expect(user).toBeDefined();
      expect([1, 2, 3]).toContain(user.id);
    });
  });

  describe('fetchAllSettled', () => {
    it('deve retornar todos resultados (sucesso e falha)', async () => {
      const service = new BatchService();

      const results = await service.fetchAllSettled([1, 999, 3]);

      expect(results).toHaveLength(3);
      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
      expect(results[2].status).toBe('fulfilled');
    });
  });
});
```

### 8. Retry Logic

```typescript
// src/retry.service.ts
export class RetryService {
  async fetchWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await this.delay(1000 * (i + 1));
        }
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// src/retry.service.spec.ts
describe('RetryService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve fazer retry em caso de falha', async () => {
    const service = new RetryService();
    let attempts = 0;

    const flakeyFn = jest.fn().mockImplementation(async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Temporary error');
      }
      return 'success';
    });

    const promise = service.fetchWithRetry(flakeyFn, 3);

    // Avançar timers para delays
    await jest.runAllTimersAsync();

    const result = await promise;

    expect(result).toBe('success');
    expect(flakeyFn).toHaveBeenCalledTimes(3);
  });

  it('deve lançar erro após esgotar retries', async () => {
    const service = new RetryService();

    const failingFn = jest.fn().mockRejectedValue(new Error('Permanent error'));

    const promise = service.fetchWithRetry(failingFn, 2);

    await jest.runAllTimersAsync();

    await expect(promise).rejects.toThrow('Permanent error');
    expect(failingFn).toHaveBeenCalledTimes(2);
  });
});
```

## 🎯 Aplicabilidade

### API Testing

```typescript
// src/github.service.ts
export class GitHubService {
  private baseUrl = 'https://api.github.com';

  async getRepository(owner: string, repo: string): Promise<Repository> {
    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }
}

// src/github.service.spec.ts
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('GitHubService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('deve buscar repositório do GitHub', async () => {
    const mockRepo = {
      id: 123,
      name: 'my-repo',
      owner: { login: 'user' }
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockRepo));

    const service = new GitHubService();
    const repo = await service.getRepository('user', 'my-repo');

    expect(repo).toEqual(mockRepo);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/user/my-repo'
    );
  });

  it('deve lançar erro em falha da API', async () => {
    fetchMock.mockResponseOnce('Not Found', { status: 404 });

    const service = new GitHubService();

    await expect(
      service.getRepository('user', 'invalid')
    ).rejects.toThrow('GitHub API error: 404');
  });
});
```

### Database Operations

```typescript
// src/user.repository.ts
export class UserRepository {
  constructor(private db: Database) {}

  async save(user: User): Promise<User> {
    const result = await this.db.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [user.name, user.email]
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
}

// src/user.repository.spec.ts
describe('UserRepository', () => {
  let mockDb: jest.Mocked<Database>;
  let repository: UserRepository;

  beforeEach(() => {
    mockDb = {
      query: jest.fn()
    } as any;

    repository = new UserRepository(mockDb);
  });

  describe('save', () => {
    it('deve salvar usuário no banco', async () => {
      const user = { name: 'João', email: 'joao@test.com' };
      const savedUser = { id: 1, ...user };

      mockDb.query.mockResolvedValue({ rows: [savedUser] });

      const result = await repository.save(user);

      expect(result).toEqual(savedUser);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [user.name, user.email]
      );
    });

    it('deve propagar erro do banco', async () => {
      mockDb.query.mockRejectedValue(new Error('DB connection failed'));

      await expect(
        repository.save({ name: 'João', email: 'joao@test.com' })
      ).rejects.toThrow('DB connection failed');
    });
  });

  describe('findById', () => {
    it('deve retornar usuário quando existe', async () => {
      const user = { id: 1, name: 'João', email: 'joao@test.com' };

      mockDb.query.mockResolvedValue({ rows: [user] });

      const result = await repository.findById(1);

      expect(result).toEqual(user);
    });

    it('deve retornar null quando não existe', async () => {
      mockDb.query.mockResolvedValue({ rows: [] });

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });
});
```

## ⚠️ Considerações

### 1. Timeout de Testes

```typescript
// Aumentar timeout para teste específico
it('operação muito lenta', async () => {
  await verySlowOperation();
}, 10000);  // 10 segundos

// Configurar timeout global
jest.setTimeout(10000);
```

### 2. Evitar Await Desnecessário

```typescript
// ❌ Ruim: await desnecessário
it('teste', async () => {
  const result = await Promise.resolve(42);
  return expect(result).toBe(42);
});

// ✅ Bom: direto
it('teste', () => {
  return expect(Promise.resolve(42)).resolves.toBe(42);
});
```

### 3. Parallel vs Sequential

```typescript
// Sequential (lento)
it('busca usuários sequencialmente', async () => {
  const user1 = await fetchUser(1);  // Espera 100ms
  const user2 = await fetchUser(2);  // Espera 100ms
  // Total: 200ms
});

// Parallel (rápido)
it('busca usuários em paralelo', async () => {
  const [user1, user2] = await Promise.all([
    fetchUser(1),
    fetchUser(2)
  ]);
  // Total: 100ms
});
```

## 📚 Conclusão

Testes assíncronos verificam código com **Promises, async/await, callbacks**. Três formas: return Promise, async/await (recomendado), done callback (legado). **async/await** mais legível e natural. Testar erros com expect().rejects ou try/catch. jest.useFakeTimers() controla setTimeout/setInterval. Promise.all/race/allSettled testados normalmente com await. Sempre retornar Promise ou usar async. Timeout padrão 5s, configurável com jest.setTimeout() ou parâmetro individual. Mock de fetch com jest-fetch-mock. Parallel execution com Promise.all mais rápido que sequential awaits.

