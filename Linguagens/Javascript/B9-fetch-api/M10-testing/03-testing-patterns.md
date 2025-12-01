# Testing Patterns: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Testing patterns** são **estratégias sistemáticas** para **testar comportamentos comuns** em aplicações que consomem APIs (loading states, error handling, retry logic, pagination, race conditions), garantindo **coverage completo** de **edge cases** (network failures, malformed responses, concurrent requests, timeouts), usando **assertions específicas** (loading → data, loading → error, retry attempts, cleanup), **test doubles** (mocks, spies) para **isolar comportamento**, **fake timers** para **control time** (delays, debounce), **React Testing Library** patterns (waitFor, findBy, user events) para **component testing**.

Conceitualmente, **testing patterns** capturam **common scenarios** em aplicações modernas: **loading state** (spinner enquanto fetch pending → display data quando resolve), **error handling** (display error message quando fetch rejects), **retry logic** (automatic retry em transient failures), **pagination** (fetch next page quando user clicks), **optimistic updates** (update UI imediatamente → rollback se API fails), **race conditions** (cancel previous request quando novo inicia). **Patterns** fornecem **blueprint** para testar cada scenario consistentemente, evitando **missing edge cases** (happy path only).

```javascript
// Pattern 1: Loading State
test('mostra loading durante fetch', async () => {
  // Mock que nunca resolve (pending infinito)
  global.fetch = jest.fn(() => new Promise(() => {}));
  
  render(<UserList />);
  
  // Assert loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('mostra data após fetch completo', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([{ id: 1, name: 'Alice' }])
  });
  
  render(<UserList />);
  
  // Wait for loading → data transition
  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
  
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

// Pattern 2: Error Handling
test('mostra error message em failure', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});

// Pattern 3: Retry Logic
test('retenta 3 vezes antes de falhar', async () => {
  global.fetch = jest.fn()
    .mockRejectedValueOnce(new Error('Fail 1'))
    .mockRejectedValueOnce(new Error('Fail 2'))
    .mockRejectedValueOnce(new Error('Fail 3'));
  
  await expect(fetchWithRetry('/api/users', 3)).rejects.toThrow();
  
  expect(global.fetch).toHaveBeenCalledTimes(3);
});
```

### Contexto Histórico e Motivação

**Evolução de Testing Patterns:**

1. **Early Testing (2010s)**: Happy path only (não testa errors)
2. **React Testing Library (2018+)**: User-centric testing
3. **MSW (2019+)**: Realistic mocking
4. **Modern (2020+)**: Patterns para async, loading, errors, edge cases

**Motivação para Patterns:**

**Real-world apps** têm **complex async flows**: loading states (spinner), error states (error boundary), retries (exponential backoff), race conditions (cancel stale requests), optimistic updates (instant UI feedback). **Tests** devem cobrir **all scenarios**, não apenas **happy path**. **Patterns** garantem **consistency** (mesma approach em todos tests), **completeness** (não esquecer edge cases), **maintainability** (tests legíveis, DRY).

**Common Missing Coverage:**

**1. Loading States**: Test esquece verificar spinner durante fetch
**2. Error States**: Não testa network failures, HTTP errors
**3. Cleanup**: Não testa component unmount durante fetch (memory leak)
**4. Race Conditions**: Não testa concurrent requests (stale data)
**5. Retry**: Não testa retry logic, exponential backoff
**6. Edge Cases**: Malformed JSON, empty arrays, null responses

### Problema Fundamental que Resolve

Testing patterns resolvem:

**1. Incomplete Coverage**: Tests só cobrem happy path (miss edge cases)
**2. Inconsistency**: Different tests usam different approaches (confusing)
**3. Flakiness**: Async tests sem proper waiting (race conditions)
**4. Maintenance**: Tests não seguem best practices (hard to maintain)
**5. Realism**: Tests não simulam real user behavior
**6. Confidence**: Incomplete tests → baixa confidence em code

### Importância no Ecossistema

Testing patterns são **critical** para:

- **CI/CD**: Tests determinísticos (não flaky)
- **Refactoring**: Confidence para mudar code (tests catch regressions)
- **Documentation**: Tests mostram expected behavior
- **Code Quality**: High coverage (happy path + edge cases)
- **User Experience**: Testar loading, errors garante UX

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Loading States**: Test spinner → data transition
2. **Error Handling**: Test error display, error boundaries
3. **Retry Logic**: Test retry attempts, exponential backoff
4. **Race Conditions**: Test concurrent requests, stale data
5. **Cleanup**: Test unmount durante fetch (abort signal)
6. **Optimistic Updates**: Test UI update → rollback em error

### Pilares Fundamentais

- **waitFor()**: Wait for async updates
- **findBy()**: Async query (wait + getBy)
- **queryBy()**: Assert absence (não throws)
- **jest.useFakeTimers()**: Control time (delays, debounce)
- **mockResolvedValueOnce()**: Different responses sequential
- **toHaveBeenCalledTimes()**: Verify call count

### Visão Geral das Nuances

- **Loading → Data**: waitFor() para transition
- **Loading → Error**: waitFor() + error message
- **Cleanup**: useEffect cleanup function
- **AbortSignal**: Cancel requests em unmount
- **Race Conditions**: Latest request wins (cancel previous)
- **Optimistic Updates**: Update UI → rollback se API fails

---

## 🧠 Fundamentos Teóricos

### Pattern 1: Loading States

```javascript
// Component com loading state

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://api.example.com/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Tests:

test('mostra loading inicialmente', () => {
  // Mock pending (never resolves)
  global.fetch = jest.fn(() => new Promise(() => {}));
  
  render(<UserList />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('mostra users após fetch', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ])
  });
  
  render(<UserList />);
  
  // Initially loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Wait for data
  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
  
  expect(screen.getByText('Bob')).toBeInTheDocument();
  
  // Loading gone
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

// Alternativa: findBy (waitFor + getBy)
test('mostra users após fetch (findBy)', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([{ id: 1, name: 'Alice' }])
  });
  
  render(<UserList />);
  
  // findBy automaticamente waits
  const alice = await screen.findByText('Alice');
  
  expect(alice).toBeInTheDocument();
});
```

### Pattern 2: Error Handling

```javascript
// Component com error handling

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('https://api.example.com/users')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Tests:

test('mostra error em network failure', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('Error: Network error')).toBeInTheDocument();
  });
  
  // Loading gone
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

test('mostra error em HTTP 500', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: () => Promise.resolve({ error: 'Server error' })
  });
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('Error: HTTP 500')).toBeInTheDocument();
  });
});

test('mostra error em malformed JSON', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.reject(new Error('Invalid JSON'))
  });
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Pattern 3: Retry Logic

```javascript
// Function com retry

async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response.json();
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// Tests:

test('retry succeeds após 2 failures', async () => {
  jest.useFakeTimers();
  
  global.fetch = jest.fn()
    .mockRejectedValueOnce(new Error('Fail 1'))
    .mockRejectedValueOnce(new Error('Fail 2'))
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' })
    });
  
  const promise = fetchWithRetry('https://api.example.com/data', 3);
  
  // Fast-forward timers
  await jest.runAllTimersAsync();
  
  const data = await promise;
  
  expect(data.message).toBe('Success');
  expect(global.fetch).toHaveBeenCalledTimes(3);
  
  jest.useRealTimers();
});

test('retry falha após maxRetries', async () => {
  jest.useFakeTimers();
  
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
  
  const promise = fetchWithRetry('https://api.example.com/data', 3);
  
  await jest.runAllTimersAsync();
  
  await expect(promise).rejects.toThrow('Network error');
  expect(global.fetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
  
  jest.useRealTimers();
});

test('retry delays aumentam exponencialmente', async () => {
  jest.useFakeTimers();
  
  global.fetch = jest.fn().mockRejectedValue(new Error('Error'));
  
  const promise = fetchWithRetry('https://api.example.com/data', 3);
  
  // Attempt 0 fails
  await jest.advanceTimersByTimeAsync(0);
  
  // Delay 1s (2^0 * 1000)
  await jest.advanceTimersByTimeAsync(1000);
  
  // Attempt 1 fails, delay 2s (2^1 * 1000)
  await jest.advanceTimersByTimeAsync(2000);
  
  // Attempt 2 fails, delay 4s (2^2 * 1000)
  await jest.advanceTimersByTimeAsync(4000);
  
  // Attempt 3 fails (throw)
  await expect(promise).rejects.toThrow();
  
  jest.useRealTimers();
});
```

### Pattern 4: Cleanup (Unmount Durante Fetch)

```javascript
// Component com cleanup

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    fetch('https://api.example.com/users')
      .then(r => r.json())
      .then(data => {
        if (isMounted) {
          setUsers(data);
          setLoading(false);
        }
      });
    
    return () => {
      isMounted = false; // Cleanup
    };
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Test:

test('cleanup previne setState após unmount', async () => {
  global.fetch = jest.fn(() =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve([{ id: 1, name: 'Alice' }])
        });
      }, 1000);
    })
  );
  
  const { unmount } = render(<UserList />);
  
  // Unmount before fetch completes
  unmount();
  
  // Wait for fetch to complete
  await new Promise(r => setTimeout(r, 1100));
  
  // Não deve dar warning (setState em unmounted component)
  // Test passa se não há console.error
});

// Pattern 5: AbortController Cleanup

function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const controller = new AbortController();
    
    fetch('https://api.example.com/users', { signal: controller.signal })
      .then(r => r.json())
      .then(setUsers)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });
    
    return () => {
      controller.abort(); // Cleanup
    };
  }, []);
  
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

test('abort request em unmount', async () => {
  global.fetch = jest.fn((url, options) =>
    new Promise((resolve, reject) => {
      options.signal?.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'));
      });
      
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve([{ id: 1 }])
        });
      }, 1000);
    })
  );
  
  const { unmount } = render(<UserList />);
  
  // Unmount (triggers abort)
  unmount();
  
  // Fetch foi abortado
  await new Promise(r => setTimeout(r, 100));
  
  expect(global.fetch).toHaveBeenCalled();
});
```

### Pattern 5: Race Conditions

```javascript
// Component com debounced search (race condition)

function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    
    const controller = new AbortController();
    
    fetch(`https://api.example.com/users?q=${query}`, {
      signal: controller.signal
    })
      .then(r => r.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setLoading(false);
        }
      });
    
    return () => {
      controller.abort(); // Cancel previous request
    };
  }, [query]);
  
  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      
      {loading && <p>Loading...</p>}
      
      <ul>
        {results.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

// Test:

test('cancela request anterior em novo search', async () => {
  let resolvers = [];
  
  global.fetch = jest.fn((url, options) =>
    new Promise((resolve, reject) => {
      options.signal?.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'));
      });
      
      resolvers.push(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, name: url.includes('alice') ? 'Alice' : 'Bob' }
          ])
        });
      });
    })
  );
  
  const { user } = render(<UserSearch />);
  
  const input = screen.getByPlaceholderText('Search users...');
  
  // Type "alice"
  await user.type(input, 'alice');
  
  // Type "bob" (cancels "alice" request)
  await user.clear(input);
  await user.type(input, 'bob');
  
  // Resolve "bob" request
  resolvers[1]();
  
  await waitFor(() => {
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
  
  // "Alice" não aparece (request cancelado)
  expect(screen.queryByText('Alice')).not.toBeInTheDocument();
});
```

### Pattern 6: Optimistic Updates

```javascript
// Component com optimistic update

function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = async (text) => {
    const tempId = Date.now();
    
    // Optimistic update
    setTodos(prev => [...prev, { id: tempId, text, pending: true }]);
    
    try {
      const response = await fetch('https://api.example.com/todos', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      
      const newTodo = await response.json();
      
      // Replace temp com real
      setTodos(prev =>
        prev.map(t => (t.id === tempId ? { ...newTodo, pending: false } : t))
      );
      
    } catch (error) {
      // Rollback em error
      setTodos(prev => prev.filter(t => t.id !== tempId));
      
      alert('Failed to add todo');
    }
  };
  
  return (
    <div>
      <button onClick={() => addTodo('New Todo')}>Add</button>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text} {todo.pending && '(saving...)'}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Tests:

test('optimistic update mostra todo imediatamente', async () => {
  global.fetch = jest.fn(() => new Promise(() => {})); // Never resolves
  
  const { user } = render(<TodoList />);
  
  const button = screen.getByText('Add');
  
  await user.click(button);
  
  // Todo aparece imediatamente (optimistic)
  expect(screen.getByText('New Todo (saving...)')).toBeInTheDocument();
});

test('optimistic update confirma após success', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ id: 1, text: 'New Todo' })
  });
  
  const { user } = render(<TodoList />);
  
  await user.click(screen.getByText('Add'));
  
  await waitFor(() => {
    expect(screen.getByText('New Todo')).toBeInTheDocument();
  });
  
  // "(saving...)" removido
  expect(screen.queryByText(/saving/i)).not.toBeInTheDocument();
});

test('optimistic update rollback em error', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
  
  // Mock alert
  global.alert = jest.fn();
  
  const { user } = render(<TodoList />);
  
  await user.click(screen.getByText('Add'));
  
  // Todo aparece
  expect(screen.getByText('New Todo (saving...)')).toBeInTheDocument();
  
  // Wait for error
  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith('Failed to add todo');
  });
  
  // Todo removido (rollback)
  expect(screen.queryByText('New Todo')).not.toBeInTheDocument();
});
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 7: Pagination

```javascript
// Component com pagination

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    fetch(`https://api.example.com/users?page=${page}&limit=10`)
      .then(r => r.json())
      .then(data => {
        setUsers(prev => [...prev, ...data]);
        setHasMore(data.length === 10);
        setLoading(false);
      });
  }, [page]);
  
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(p => p + 1);
    }
  };
  
  return (
    <div>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

// Tests:

test('carrega page 1 inicialmente', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' }
    ])
  });
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('User 1')).toBeInTheDocument();
  });
  
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.example.com/users?page=1&limit=10'
  );
});

test('load more carrega próxima page', async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
      ])
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 3, name: 'User 3' },
        { id: 4, name: 'User 4' }
      ])
    });
  
  const { user } = render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('User 1')).toBeInTheDocument();
  });
  
  const button = screen.getByText('Load More');
  
  await user.click(button);
  
  await waitFor(() => {
    expect(screen.getByText('User 3')).toBeInTheDocument();
  });
  
  // Page 1 ainda visível (append)
  expect(screen.getByText('User 1')).toBeInTheDocument();
  
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test('esconde load more quando não há mais pages', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([
      { id: 1, name: 'User 1' }
    ]) // Less than 10 (no more pages)
  });
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('User 1')).toBeInTheDocument();
  });
  
  // Load More button não aparece (hasMore = false)
  expect(screen.queryByText('Load More')).not.toBeInTheDocument();
});
```

### Pattern 8: Debounce

```javascript
// Component com debounced search

function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    // Debounce 500ms
    const timeoutId = setTimeout(() => {
      fetch(`https://api.example.com/users?q=${query}`)
        .then(r => r.json())
        .then(setResults);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      <ul>
        {results.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

// Test:

test('debounce 500ms antes de fetch', async () => {
  jest.useFakeTimers();
  
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([{ id: 1, name: 'Alice' }])
  });
  
  const { user } = render(<UserSearch />);
  
  const input = screen.getByPlaceholderText('Search...');
  
  // Type "alice" (cada keystroke reseta timer)
  await user.type(input, 'alice');
  
  // 0ms - não fetched ainda
  expect(global.fetch).not.toHaveBeenCalled();
  
  // 400ms - ainda não
  jest.advanceTimersByTime(400);
  expect(global.fetch).not.toHaveBeenCalled();
  
  // 500ms - fetch triggered
  jest.advanceTimersByTime(100);
  
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/users?q=alice'
    );
  });
  
  jest.useRealTimers();
});

test('debounce cancela previous timers', async () => {
  jest.useFakeTimers();
  
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([])
  });
  
  const { user } = render(<UserSearch />);
  
  const input = screen.getByPlaceholderText('Search...');
  
  // Type "a"
  await user.type(input, 'a');
  
  // 300ms
  jest.advanceTimersByTime(300);
  
  // Type "b" (cancela timer anterior)
  await user.type(input, 'b');
  
  // 500ms total (200ms após "b")
  jest.advanceTimersByTime(200);
  
  // Não fetched ainda (timer resetado)
  expect(global.fetch).not.toHaveBeenCalled();
  
  // 500ms após "b"
  jest.advanceTimersByTime(300);
  
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/users?q=ab'
    );
  });
  
  // Apenas 1 fetch (não fetch para "a")
  expect(global.fetch).toHaveBeenCalledTimes(1);
  
  jest.useRealTimers();
});
```

### Pattern 9: Infinite Scroll

```javascript
// Component com infinite scroll

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerRef = useRef();
  const lastUserRef = useCallback(node => {
    if (loading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(p => p + 1);
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore]);
  
  useEffect(() => {
    setLoading(true);
    
    fetch(`https://api.example.com/users?page=${page}&limit=10`)
      .then(r => r.json())
      .then(data => {
        setUsers(prev => [...prev, ...data]);
        setHasMore(data.length === 10);
        setLoading(false);
      });
  }, [page]);
  
  return (
    <div>
      <ul>
        {users.map((user, index) => {
          if (users.length === index + 1) {
            return (
              <li ref={lastUserRef} key={user.id}>
                {user.name}
              </li>
            );
          }
          
          return <li key={user.id}>{user.name}</li>;
        })}
      </ul>
      
      {loading && <p>Loading...</p>}
    </div>
  );
}

// Test:

test('infinite scroll carrega próxima page', async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, name: 'User 1' }
      ])
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 2, name: 'User 2' }
      ])
    });
  
  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn(callback => ({
    observe: jest.fn(element => {
      // Simula intersecting
      callback([{ isIntersecting: true, target: element }]);
    }),
    disconnect: jest.fn()
  }));
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('User 1')).toBeInTheDocument();
  });
  
  // IntersectionObserver triggers (last element visible)
  await waitFor(() => {
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });
  
  expect(global.fetch).toHaveBeenCalledTimes(2);
});
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Patterns

**✅ Async Operations**: Fetch, timers, animations
**✅ User Interactions**: Clicks, typing, scroll
**✅ Edge Cases**: Errors, timeouts, race conditions
**✅ State Transitions**: Loading → data, loading → error
**✅ Cleanup**: Unmount, abort, debounce cancel

### Coverage Checklist

- [ ] Loading state (spinner)
- [ ] Success state (data display)
- [ ] Error state (error message)
- [ ] Retry logic (attempts, backoff)
- [ ] Cleanup (unmount, abort)
- [ ] Race conditions (concurrent requests)
- [ ] Optimistic updates (rollback)
- [ ] Pagination (load more)
- [ ] Debounce (typing)
- [ ] Infinite scroll (intersection)

---

## ⚠️ Limitações e Considerações Teóricas

### Armadilhas Comuns

#### Armadilha 1: Não Await Async

```javascript
// ❌ ERRO - Não await (test termina antes de update)
test('mostra users', () => {
  render(<UserList />);
  
  expect(screen.getByText('Alice')).toBeInTheDocument(); // Fails (still loading)
});

// ✅ CORRETO - waitFor ou findBy
test('mostra users', async () => {
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
```

#### Armadilha 2: Esquecer Fake Timers Cleanup

```javascript
// ❌ ERRO - Fake timers leak para próximo test
test('debounce test', () => {
  jest.useFakeTimers();
  
  // ...
  
  // Esquece useRealTimers()
});

// ✅ CORRETO - Cleanup
test('debounce test', () => {
  jest.useFakeTimers();
  
  // ...
  
  jest.useRealTimers();
});
```

---

## 🔗 Interconexões Conceituais

### Relação com React Testing Library

**Patterns** usam **React Testing Library** queries (getBy, findBy, waitFor).

### Relação com User Events

**@testing-library/user-event** simula real user interactions.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Integration Tests**: Real API (staging environment)
2. **E2E Tests**: Cypress, Playwright
3. **Visual Regression**: Percy, Chromatic

---

## 📚 Conclusão

Testing patterns garantem **coverage completo** de async operations.

Dominar patterns significa:
- **Loading → Data**: waitFor() para async transitions
- **Error Handling**: Test network/HTTP errors
- **Retry Logic**: mockResolvedValueOnce() sequential
- **Cleanup**: AbortController, isMounted flag
- **Race Conditions**: Cancel stale requests
- **Optimistic Updates**: Update UI → rollback em error

É crítico para **confidence**, **maintainability**, e **complete test coverage**.
