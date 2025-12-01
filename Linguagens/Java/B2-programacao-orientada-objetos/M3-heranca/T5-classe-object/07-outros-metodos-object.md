# T5.07 - Outros Métodos de Object

## Introdução

**Object** possui outros métodos além de toString(), equals(), hashCode(), clone().

**Métodos principais**:
- **getClass()**: informações sobre classe (reflection)
- **notify(), notifyAll(), wait()**: sincronização de threads
- **finalize()**: deprecated (não use)

```java
Object obj = new String("Java");

// getClass()
Class<?> classe = obj.getClass();
System.out.println(classe.getName()); // java.lang.String

// wait(), notify() (sincronização)
synchronized (obj) {
    obj.wait();    // Espera notificação
    obj.notify();  // Notifica thread
}
```

---

## Fundamentos

### 1. getClass()

**Retorna objeto Class** com metadados da classe.

```java
public final native Class<?> getClass();
```

```java
String s = "Java";
Class<?> classe = s.getClass();

classe.getName();        // "java.lang.String"
classe.getSimpleName();  // "String"
classe.getPackage();     // java.lang
```

**final**: não pode ser sobrescrito.

### 2. getClass() vs instanceof

**getClass()**: tipo exato.

**instanceof**: tipo ou subclasse.

```java
public class Animal { }
public class Cachorro extends Animal { }

Animal a = new Cachorro();

// instanceof
a instanceof Animal;    // true
a instanceof Cachorro;  // true

// getClass()
a.getClass() == Animal.class;    // false
a.getClass() == Cachorro.class;  // true
```

### 3. Reflection com getClass()

**Acessar métodos, campos, construtores** dinamicamente.

```java
String s = "Java";
Class<?> classe = s.getClass();

// Métodos
Method[] metodos = classe.getDeclaredMethods();

// Campos
Field[] campos = classe.getDeclaredFields();

// Construtores
Constructor<?>[] construtores = classe.getConstructors();
```

### 4. wait()

**Suspende thread** até notificação.

```java
public final void wait() throws InterruptedException;
```

```java
synchronized (obj) {
    while (condicao) {
        obj.wait(); // Espera notificação
    }
}
```

**Libera lock** do objeto.

### 5. wait(long timeout)

**Espera com timeout** (milissegundos).

```java
public final void wait(long timeout) throws InterruptedException;
```

```java
synchronized (obj) {
    obj.wait(5000); // Espera 5 segundos ou até notify()
}
```

### 6. notify()

**Acorda uma thread** esperando em wait().

```java
public final native void notify();
```

```java
synchronized (obj) {
    // Modifica estado
    obj.notify(); // Acorda uma thread
}
```

**Escolhe thread aleatoriamente**.

### 7. notifyAll()

**Acorda todas as threads** esperando.

```java
public final native void notifyAll();
```

```java
synchronized (obj) {
    // Modifica estado
    obj.notifyAll(); // Acorda todas as threads
}
```

### 8. Padrão Producer-Consumer

**wait() e notify()** para coordenação.

```java
public class Buffer {
    private int valor;
    private boolean disponivel = false;
    
    public synchronized int get() throws InterruptedException {
        while (!disponivel) {
            wait(); // Espera produtor
        }
        disponivel = false;
        notify(); // Notifica produtor
        return valor;
    }
    
    public synchronized void put(int v) throws InterruptedException {
        while (disponivel) {
            wait(); // Espera consumidor
        }
        valor = v;
        disponivel = true;
        notify(); // Notifica consumidor
    }
}
```

### 9. finalize() (Deprecated)

**Chamado antes de GC** (Garbage Collector).

```java
@Deprecated(since="9")
protected void finalize() throws Throwable;
```

```java
// ❌ Não use (deprecated)
@Override
protected void finalize() throws Throwable {
    try {
        // Liberar recursos
    } finally {
        super.finalize();
    }
}
```

**Problemas**:
- Não garante execução
- Performance ruim
- Dificulta garbage collection

### 10. Alternativa a finalize()

**try-with-resources** (AutoCloseable).

```java
// ✅ Use AutoCloseable
public class Recurso implements AutoCloseable {
    @Override
    public void close() {
        // Liberar recursos
    }
}

try (Recurso r = new Recurso()) {
    // Usar recurso
} // close() chamado automaticamente
```

**Cleaner API** (Java 9+).

```java
import java.lang.ref.Cleaner;

public class Recurso {
    private static final Cleaner cleaner = Cleaner.create();
    
    private final Cleaner.Cleanable cleanable;
    
    public Recurso() {
        cleanable = cleaner.register(this, () -> {
            // Cleanup
        });
    }
}
```

---

## Aplicabilidade

**getClass()**:
- Reflection (frameworks)
- Comparar tipos exatos
- Logging e debugging

**wait(), notify(), notifyAll()**:
- Sincronização de threads
- Producer-Consumer pattern
- Thread coordination

**finalize()**:
- ❌ **NÃO USE** (deprecated)

---

## Armadilhas

### 1. wait() Sem synchronized

```java
// ❌ IllegalMonitorStateException
obj.wait();

// ✅ Usar synchronized
synchronized (obj) {
    obj.wait();
}
```

### 2. notify() Sem synchronized

```java
// ❌ IllegalMonitorStateException
obj.notify();

// ✅ Usar synchronized
synchronized (obj) {
    obj.notify();
}
```

### 3. Usar finalize()

```java
// ❌ Deprecated, não use
@Override
protected void finalize() throws Throwable {
    // ...
}

// ✅ Use AutoCloseable
public class Recurso implements AutoCloseable {
    @Override
    public void close() {
        // ...
    }
}
```

### 4. wait() Sem Loop

```java
// ❌ Verificar condição apenas uma vez
synchronized (obj) {
    if (condicao) {
        obj.wait();
    }
}

// ✅ Usar while
synchronized (obj) {
    while (condicao) {
        obj.wait(); // Re-verifica após acordar
    }
}
```

### 5. notify() vs notifyAll()

```java
// notify() acorda apenas uma thread (pode ser a errada)
synchronized (obj) {
    obj.notify();
}

// ✅ notifyAll() mais seguro
synchronized (obj) {
    obj.notifyAll(); // Acorda todas
}
```

### 6. Confundir getClass() com instanceof

```java
Animal a = new Cachorro();

// getClass()
a.getClass() == Animal.class; // false ❌

// instanceof
a instanceof Animal; // true ✅
```

### 7. Sobrescrever getClass()

```java
// ❌ Erro: getClass() é final
@Override
public Class<?> getClass() {
    return Object.class;
}
```

---

## Boas Práticas

### 1. Use synchronized Com wait()/notify()

```java
synchronized (obj) {
    obj.wait();
    obj.notify();
}
```

### 2. Use while Com wait()

```java
synchronized (obj) {
    while (condicao) {
        obj.wait(); // Re-verifica após acordar
    }
}
```

### 3. Prefira notifyAll()

```java
synchronized (obj) {
    obj.notifyAll(); // Mais seguro que notify()
}
```

### 4. Não Use finalize()

```java
// ❌ Deprecated
@Override
protected void finalize() { }

// ✅ Use AutoCloseable
public class Recurso implements AutoCloseable {
    @Override
    public void close() {
        // Liberar recursos
    }
}
```

### 5. Use instanceof Para Hierarquias

```java
// instanceof aceita subclasses
if (obj instanceof Animal) {
    // ...
}

// getClass() apenas tipo exato
if (obj.getClass() == Animal.class) {
    // ...
}
```

### 6. Trate InterruptedException

```java
try {
    obj.wait();
} catch (InterruptedException e) {
    Thread.currentThread().interrupt(); // Restore interrupt status
}
```

### 7. Prefira Utilitários de Concorrência

```java
// ❌ wait/notify (baixo nível)
synchronized (obj) {
    obj.wait();
}

// ✅ Use java.util.concurrent
Lock lock = new ReentrantLock();
Condition condition = lock.newCondition();
lock.lock();
try {
    condition.await();
} finally {
    lock.unlock();
}
```

### 8. Documente Sincronização

```java
/**
 * Thread-safe. Usa wait/notify para sincronização.
 */
public synchronized void metodo() throws InterruptedException {
    while (condicao) {
        wait();
    }
}
```

### 9. Timeout em wait()

```java
// ✅ Evita deadlock
synchronized (obj) {
    obj.wait(5000); // Timeout 5 segundos
}
```

---

## Resumo

**getClass()**:
```java
Class<?> classe = obj.getClass();
classe.getName();        // Nome da classe
classe.getSimpleName();  // Nome simples
```

**Reflection**:
```java
Method[] metodos = classe.getDeclaredMethods();
Field[] campos = classe.getDeclaredFields();
```

**wait()**:
```java
synchronized (obj) {
    while (condicao) {
        obj.wait(); // Espera notificação
    }
}
```

**notify()**:
```java
synchronized (obj) {
    obj.notify(); // Acorda uma thread
}
```

**notifyAll()**:
```java
synchronized (obj) {
    obj.notifyAll(); // Acorda todas as threads
}
```

**Producer-Consumer**:
```java
public synchronized void put(int v) throws InterruptedException {
    while (disponivel) wait();
    valor = v;
    disponivel = true;
    notify();
}

public synchronized int get() throws InterruptedException {
    while (!disponivel) wait();
    disponivel = false;
    notify();
    return valor;
}
```

**finalize() (deprecated)**:
```java
// ❌ NÃO USE
@Override
protected void finalize() throws Throwable { }

// ✅ USE AutoCloseable
public class Recurso implements AutoCloseable {
    @Override
    public void close() {
        // Liberar recursos
    }
}
```

**getClass() vs instanceof**:
```java
a.getClass() == Animal.class; // Tipo exato
a instanceof Animal;          // Tipo ou subclasse
```

**wait() com timeout**:
```java
obj.wait(5000); // Espera 5 segundos
```

**java.util.concurrent (preferível)**:
```java
Lock lock = new ReentrantLock();
Condition condition = lock.newCondition();
lock.lock();
try {
    condition.await();
} finally {
    lock.unlock();
}
```

**Regra de Ouro**: Use **getClass()** para reflection. **wait/notify** sempre em **synchronized**. **Prefira java.util.concurrent** em vez de wait/notify. **NÃO use finalize()**.
