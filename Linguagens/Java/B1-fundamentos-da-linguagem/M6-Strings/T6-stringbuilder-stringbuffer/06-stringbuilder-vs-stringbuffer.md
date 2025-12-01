# StringBuilder vs StringBuffer (Thread-Safety)

## 🎯 Introdução e Definição

**StringBuilder e StringBuffer são classes quase idênticas** para construção eficiente de Strings, com **uma diferença crítica**: **StringBuffer é thread-safe** (sincronizado), enquanto **StringBuilder não é** (mais rápido). StringBuffer foi a classe original (Java 1.0), StringBuilder foi adicionado no Java 5 como alternativa mais performática para uso single-threaded.

**Conceito central**: **StringBuffer** tem todos os métodos **synchronized**, garantindo segurança em ambientes multi-threaded mas com **overhead de ~60% na performance**. **StringBuilder** não tem sincronização, resultando em performance superior mas **não é seguro para múltiplas threads** acessando o mesmo objeto.

**Exemplo fundamental**:
```java
// StringBuilder - NÃO thread-safe, mais rápido
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" World");

// StringBuffer - thread-safe, ~60% mais lento
StringBuffer sbuf = new StringBuffer();
sbuf.append("Hello");
sbuf.append(" World");

// APIs idênticas, diferença é sincronização interna
// 99% dos casos: use StringBuilder
```

**Características principais**:
- **StringBuilder**: não sincronizado, rápido, single-threaded
- **StringBuffer**: sincronizado, ~60% mais lento, multi-threaded
- **API idêntica**: mesmos métodos, mesmas assinaturas
- **Escolha**: StringBuilder padrão, StringBuffer apenas se multi-threading
- **Alternativas**: ThreadLocal, sincronização externa, String imutável

## 📋 Fundamentos Teóricos

### 1️⃣ Diferença Fundamental - Sincronização

**StringBuilder - sem sincronização**:

```java
// Código simplificado do StringBuilder
public final class StringBuilder {
    private char[] value;
    private int count;
    
    // Métodos NÃO sincronizados
    public StringBuilder append(String str) {
        // Sem synchronized - mais rápido
        // Não thread-safe
        ...
    }
}
```

**StringBuffer - com sincronização**:
```java
// Código simplificado do StringBuffer
public final class StringBuffer {
    private char[] value;
    private int count;
    
    // Métodos sincronizados
    public synchronized StringBuffer append(String str) {
        // synchronized - thread-safe
        // Overhead de lock/unlock
        ...
    }
    
    public synchronized int length() {
        return count;
    }
    
    // TODOS os métodos são synchronized
}
```

**Impacto da sincronização**:
```java
// StringBuilder - acesso direto
sb.append("X");  // Executa imediatamente

// StringBuffer - com lock
sbuf.append("X");  // 1. Adquire lock
                   // 2. Executa append
                   // 3. Libera lock
                   // Overhead: ~60% mais lento
```

### 2️⃣ API Idêntica

**Mesmos métodos, mesmas assinaturas**:

```java
// StringBuilder
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.insert(5, " World");
sb.delete(0, 5);
sb.reverse();
sb.setCharAt(0, 'w');
String resultado = sb.toString();

// StringBuffer - API IDÊNTICA
StringBuffer sbuf = new StringBuffer();
sbuf.append("Hello");
sbuf.insert(5, " World");
sbuf.delete(0, 5);
sbuf.reverse();
sbuf.setCharAt(0, 'w');
String resultado2 = sbuf.toString();

// Mesmos métodos, mesma semântica
// Diferença: StringBuffer mais lento devido a synchronized
```

**Construtores idênticos**:
```java
// StringBuilder
new StringBuilder()
new StringBuilder(16)
new StringBuilder("Hello")
new StringBuilder(charSequence)

// StringBuffer - MESMOS construtores
new StringBuffer()
new StringBuffer(16)
new StringBuffer("Hello")
new StringBuffer(charSequence)
```

**Herança comum**:
```java
// Ambos implementam mesmas interfaces
public final class StringBuilder implements CharSequence, Appendable { ... }
public final class StringBuffer implements CharSequence, Appendable { ... }

// Podem ser usados polimorficamente
Appendable a1 = new StringBuilder();
Appendable a2 = new StringBuffer();

CharSequence c1 = new StringBuilder("Hello");
CharSequence c2 = new StringBuffer("Hello");
```

### 3️⃣ Thread-Safety na Prática

**StringBuilder NÃO é thread-safe**:

```java
StringBuilder sb = new StringBuilder();

// Thread 1
new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        sb.append("A");
    }
}).start();

// Thread 2
new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        sb.append("B");
    }
}).start();

Thread.sleep(1000);
System.out.println(sb.length());  // ⚠️ Pode não ser 2000!
// Resultado inconsistente: 1998, 2000, 1995, etc.
// Race condition: append não é atômico
```

**StringBuffer É thread-safe**:
```java
StringBuffer sbuf = new StringBuffer();

// Thread 1
new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        sbuf.append("A");
    }
}).start();

// Thread 2
new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        sbuf.append("B");
    }
}).start();

Thread.sleep(1000);
System.out.println(sbuf.length());  // ✓ SEMPRE 2000
// synchronized garante atomicidade
```

**Race condition detalhada**:
```java
// Interno do append() (simplificado):
// 1. Verificar capacidade
// 2. Copiar caracteres
// 3. Incrementar count

// StringBuilder - NÃO synchronized
// Thread 1                    Thread 2
// count = 5                   count = 5
// append "A"                  append "B"
//   value[5] = 'A'             value[5] = 'B'  // ❌ Sobrescreve!
//   count = 6                  count = 6       // ❌ Perde um caractere
// Resultado: count=6 mas deveria ser 7

// StringBuffer - synchronized
// Thread 1 adquire lock
//   count = 5
//   value[5] = 'A'
//   count = 6
// Thread 1 libera lock
// Thread 2 adquire lock
//   count = 6
//   value[6] = 'B'
//   count = 7
// Thread 2 libera lock
// ✓ Resultado correto: count=7
```

### 4️⃣ Performance Comparativa

**Benchmark single-threaded**:

```java
int n = 100000;

// StringBuilder
long inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append("X");
}
String r1 = sb.toString();
long tempoSB = (System.nanoTime() - inicio) / 1_000_000;

// StringBuffer
inicio = System.nanoTime();
StringBuffer sbuf = new StringBuffer();
for (int i = 0; i < n; i++) {
    sbuf.append("X");
}
String r2 = sbuf.toString();
long tempoSBuf = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("StringBuilder: " + tempoSB + "ms");     // ~7ms
System.out.println("StringBuffer: " + tempoSBuf + "ms");    // ~11ms
System.out.println("StringBuffer é " + 
    String.format("%.1f", (double)tempoSBuf/tempoSB) + "x mais lento");
// StringBuffer é ~1.6x mais lento (60% overhead)
```

**Benchmark multi-threaded**:
```java
int threads = 4;
int iteracoesPorThread = 10000;

// StringBuffer - thread-safe
StringBuffer sbuf = new StringBuffer();
CountDownLatch latch = new CountDownLatch(threads);

long inicio = System.nanoTime();
for (int t = 0; t < threads; t++) {
    new Thread(() -> {
        for (int i = 0; i < iteracoesPorThread; i++) {
            sbuf.append("X");
        }
        latch.countDown();
    }).start();
}
latch.await();
long tempo = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("Tempo: " + tempo + "ms");
System.out.println("Length: " + sbuf.length());  // 40000 (correto)

// StringBuilder no mesmo cenário:
// - Mais rápido
// - Resultado INCORRETO (race conditions)
```

**Overhead detalhado**:
```java
// Operações diferentes têm overhead diferente

// append() - ~60% overhead
// insert() - ~60% overhead
// delete() - ~60% overhead
// toString() - ~30% overhead (menos operações)
// length() - ~40% overhead (apenas leitura, mas synchronized)

// Operações que modificam: maior overhead
// Operações de leitura: menor overhead (mas ainda presente)
```

### 5️⃣ Quando Usar Cada Um

**StringBuilder (99% dos casos)**:

```java
// ✓ Variável local (automática para thread)
public String processarDados(List<String> dados) {
    StringBuilder sb = new StringBuilder();  // ✓ Local, use StringBuilder
    for (String dado : dados) {
        sb.append(dado).append("\n");
    }
    return sb.toString();
}

// ✓ Método não compartilhado entre threads
private StringBuilder cache = new StringBuilder();  // ✓ OK se não multi-threading

public void processar() {
    cache.setLength(0);
    cache.append("dados...");
}

// ✓ Performance crítica
public String gerarRelatorio() {
    StringBuilder sb = new StringBuilder(10000);  // ✓ StringBuilder mais rápido
    // ... construção complexa ...
    return sb.toString();
}
```

**StringBuffer (raro - <1% dos casos)**:
```java
// ✓ Campo compartilhado entre threads
public class Logger {
    private StringBuffer buffer = new StringBuffer();  // ✓ Thread-safe necessário
    
    public void log(String mensagem) {
        // Múltiplas threads podem chamar log() simultaneamente
        buffer.append(Thread.currentThread().getName())
              .append(": ")
              .append(mensagem)
              .append("\n");
    }
    
    public String getLog() {
        return buffer.toString();
    }
}

// ✓ Modificação por múltiplas threads
StringBuffer compartilhado = new StringBuffer();

for (int i = 0; i < 10; i++) {
    new Thread(() -> {
        compartilhado.append("Thread ").append(Thread.currentThread().getId()).append("\n");
    }).start();
}
```

**Quando NÃO usar StringBuffer**:
```java
// ❌ Variável local (desnecessário)
public String metodo() {
    StringBuffer sb = new StringBuffer();  // ❌ Use StringBuilder
    sb.append("...");
    return sb.toString();
}

// ❌ Único thread
StringBuffer sb = new StringBuffer();  // ❌ Use StringBuilder
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
```

### 6️⃣ Alternativas a StringBuffer

**ThreadLocal<StringBuilder>**:

```java
// ✓ Melhor que StringBuffer para multi-threading
public class Logger {
    private static final ThreadLocal<StringBuilder> buffer = 
        ThreadLocal.withInitial(() -> new StringBuilder());
    
    public static void log(String mensagem) {
        StringBuilder sb = buffer.get();  // StringBuilder por thread
        sb.setLength(0);  // Limpar
        sb.append(Thread.currentThread().getName())
          .append(": ")
          .append(mensagem);
        
        System.out.println(sb);  // Ou gravar
    }
}

// Cada thread tem seu próprio StringBuilder
// Mais rápido que StringBuffer (sem synchronized)
// Thread-safe (sem compartilhamento)
```

**StringBuilder com sincronização externa**:
```java
public class Logger {
    private StringBuilder buffer = new StringBuilder();
    private final Object lock = new Object();
    
    public void log(String mensagem) {
        synchronized (lock) {  // Sincronização manual
            buffer.append(Thread.currentThread().getName())
                  .append(": ")
                  .append(mensagem)
                  .append("\n");
        }
    }
    
    public String getLog() {
        synchronized (lock) {
            return buffer.toString();
        }
    }
}

// Equivalente a StringBuffer, mas controle explícito
```

**StringBuilder separado por thread + join**:
```java
int threads = 4;
ExecutorService executor = Executors.newFixedThreadPool(threads);
List<Future<String>> futures = new ArrayList<>();

// Cada thread usa StringBuilder próprio
for (int t = 0; t < threads; t++) {
    final int threadId = t;
    futures.add(executor.submit(() -> {
        StringBuilder sb = new StringBuilder();  // ✓ StringBuilder local
        for (int i = 0; i < 1000; i++) {
            sb.append("Thread ").append(threadId).append(": ").append(i).append("\n");
        }
        return sb.toString();
    }));
}

// Join results
StringBuilder resultado = new StringBuilder();
for (Future<String> future : futures) {
    resultado.append(future.get());
}

executor.shutdown();

// Mais rápido que StringBuffer compartilhado
```

**String imutável (mais simples)**:
```java
// Se performance não é crítica, String é mais simples
public class Logger {
    private volatile String log = "";  // volatile para visibilidade
    
    public synchronized void log(String mensagem) {
        log += Thread.currentThread().getName() + ": " + mensagem + "\n";
    }
    
    public String getLog() {
        return log;
    }
}

// Simples, thread-safe
// Mas performance ruim para muitas modificações
```

### 7️⃣ Comparação Histórica

**Evolução**:

```java
// Java 1.0 (1996) - Apenas StringBuffer
StringBuffer sb = new StringBuffer();
sb.append("Hello");

// Java 5 (2004) - StringBuilder adicionado
StringBuilder sb = new StringBuilder();
sb.append("Hello");

// Razão: StringBuffer muito usado em código single-threaded
// synchronized desnecessário causava overhead
// StringBuilder criado para performance
```

**Migração**:
```java
// Código antigo (pré-Java 5)
StringBuffer sb = new StringBuffer();  // ⚠️ Legado

// Código moderno
StringBuilder sb = new StringBuilder();  // ✓ Preferencial

// Se multi-threading:
StringBuffer sb = new StringBuffer();  // ✓ OK
// Ou melhor:
ThreadLocal<StringBuilder> sb = ...    // ✓ Melhor performance
```

### 8️⃣ Decisão: StringBuilder vs StringBuffer

**Fluxograma de decisão**:

```java
// PERGUNTA 1: É variável local de método?
if (isLocal) {
    return StringBuilder;  // ✓ Sempre StringBuilder
}

// PERGUNTA 2: Múltiplas threads vão modificar SIMULTANEAMENTE?
if (multipleThreadsModifying) {
    // PERGUNTA 3: Performance é crítica?
    if (performanceCritical) {
        return ThreadLocal<StringBuilder>;  // ✓ Melhor opção
    } else {
        return StringBuffer;  // ✓ OK
    }
} else {
    return StringBuilder;  // ✓ Padrão
}
```

**Estatísticas de uso**:
```java
// ~99% dos casos: StringBuilder
// - Variáveis locais
// - Métodos não thread-safe
// - Performance importante

// ~1% dos casos: StringBuffer
// - Campo compartilhado entre threads
// - Logging/buffering multi-threaded
// - Código legado

// Melhor que StringBuffer:
// - ThreadLocal<StringBuilder>
// - StringBuilder com sincronização externa
// - StringBuilder por thread + join
```

### 9️⃣ Performance Detalhada

**Benchmark completo**:

```java
int n = 100000;

// 1. StringBuilder
long inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append("X");
long t1 = System.nanoTime() - inicio;

// 2. StringBuffer
inicio = System.nanoTime();
StringBuffer sbuf = new StringBuffer();
for (int i = 0; i < n; i++) sbuf.append("X");
long t2 = System.nanoTime() - inicio;

// 3. String +
inicio = System.nanoTime();
String s = "";
for (int i = 0; i < 1000; i++) s += "X";  // Apenas 1000 (muito lento)
long t3 = System.nanoTime() - inicio;

System.out.printf("StringBuilder: %dms\n", t1 / 1_000_000);    // ~7ms
System.out.printf("StringBuffer:  %dms (%.1fx)\n", 
                  t2 / 1_000_000, (double)t2/t1);              // ~11ms (1.6x)
System.out.printf("String +:      %dms (%.0fx)\n", 
                  t3 / 1_000_000, (double)t3/t1 * 100);        // ~500ms (7000x)

// StringBuilder: base
// StringBuffer: 1.6x mais lento
// String +: 7000x mais lento (para n=1000)
```

**Operações específicas**:
```java
int n = 100000;

// append()
StringBuilder sb = new StringBuilder();
StringBuffer sbuf = new StringBuffer();

long t1 = medirTempo(() -> {
    for (int i = 0; i < n; i++) sb.append("X");
});

long t2 = medirTempo(() -> {
    for (int i = 0; i < n; i++) sbuf.append("X");
});

System.out.printf("append: SB=%dms  SBuf=%dms  (%.1fx)\n",
                  t1, t2, (double)t2/t1);  // 1.6x

// insert()
sb = new StringBuilder("X".repeat(n));
sbuf = new StringBuffer("X".repeat(n));

t1 = medirTempo(() -> sb.insert(n/2, "Y"));
t2 = medirTempo(() -> sbuf.insert(n/2, "Y"));

System.out.printf("insert: SB=%dµs  SBuf=%dµs  (%.1fx)\n",
                  t1, t2, (double)t2/t1);  // 1.6x

// toString()
t1 = medirTempo(() -> sb.toString());
t2 = medirTempo(() -> sbuf.toString());

System.out.printf("toString: SB=%dµs  SBuf=%dµs  (%.1fx)\n",
                  t1, t2, (double)t2/t1);  // 1.3x (menor overhead)
```

### 🔟 Boas Práticas

**Use StringBuilder por padrão**:

```java
// ✓ Padrão: StringBuilder
StringBuilder sb = new StringBuilder();

// Exceção: multi-threading comprovado
StringBuffer sbuf = new StringBuffer();
```

**Prefira ThreadLocal a StringBuffer**:
```java
// ⚠️ StringBuffer
StringBuffer buffer = new StringBuffer();

// ✓ Melhor: ThreadLocal<StringBuilder>
ThreadLocal<StringBuilder> buffer = 
    ThreadLocal.withInitial(() -> new StringBuilder());
```

**Variáveis locais sempre StringBuilder**:
```java
public String metodo() {
    StringBuilder sb = new StringBuilder();  // ✓ SEMPRE
    return sb.toString();
}
```

**Documente uso de StringBuffer**:
```java
// ✓ Explicar por que StringBuffer
/**
 * Thread-safe buffer compartilhado entre múltiplas threads.
 * StringBuffer usado devido a acessos concorrentes.
 */
private StringBuffer buffer = new StringBuffer();
```

**Migre código legado**:
```java
// Código antigo
StringBuffer sb = new StringBuffer();  // ⚠️

// Migrar para
StringBuilder sb = new StringBuilder();  // ✓

// Se não tiver certeza de thread-safety, testar primeiro
```

## 🎯 Aplicabilidade

**1. StringBuilder (99%)**:
```java
StringBuilder sb = new StringBuilder();  // ✓ Padrão
```

**2. StringBuffer (1% - multi-threading)**:
```java
StringBuffer sbuf = new StringBuffer();  // Compartilhado entre threads
```

**3. ThreadLocal<StringBuilder> (melhor)**:
```java
ThreadLocal<StringBuilder> tl = ThreadLocal.withInitial(() -> new StringBuilder());
```

**4. StringBuilder + synchronized**:
```java
synchronized (lock) {
    sb.append(...);
}
```

**5. StringBuilder por Thread**:
```java
StringBuilder local = new StringBuilder();  // Por thread
```

## ⚠️ Armadilhas Comuns

**1. StringBuffer Desnecessário**:
```java
StringBuffer sb = new StringBuffer();  // ❌ Em variável local
```

**2. StringBuilder Multi-Threaded**:
```java
StringBuilder shared = new StringBuilder();  // ❌ Race conditions
```

**3. Overhead Ignorado**:
```java
StringBuffer sb = new StringBuffer();  // ⚠️ 60% mais lento
```

**4. Sincronização Incompleta**:
```java
StringBuffer sb = new StringBuffer();
String s = sb.toString();  // ⚠️ Não atômico com append
```

**5. StringBuffer em Loop**:
```java
for (...) {
    StringBuffer sb = new StringBuffer();  // ❌ Overhead desnecessário
}
```

## ✅ Boas Práticas

**1. StringBuilder por Padrão**:
```java
StringBuilder sb = new StringBuilder();  // ✓
```

**2. StringBuffer Apenas se Multi-Threading**:
```java
if (multiThreading) use StringBuffer;
```

**3. ThreadLocal Melhor que StringBuffer**:
```java
ThreadLocal<StringBuilder> buffer;  // ✓
```

**4. Documentar Uso de StringBuffer**:
```java
// Thread-safe para múltiplas threads
StringBuffer buffer = new StringBuffer();
```

**5. Migrar Código Legado**:
```java
StringBuffer -> StringBuilder  // Se single-threaded
```

## 📚 Resumo Executivo

**StringBuilder vs StringBuffer**.

**Diferença fundamental**:
```java
StringBuilder: NÃO synchronized (rápido)
StringBuffer:  synchronized (thread-safe, ~60% mais lento)
```

**API idêntica**:
```java
Mesmos métodos, mesmas assinaturas
Diferença: synchronized nos métodos do StringBuffer
```

**Performance**:
```java
StringBuilder: baseline
StringBuffer:  1.6x mais lento (60% overhead)
String +:      7000x mais lento (n=1000)
```

**Quando usar**:
```java
StringBuilder (99%):
  - Variável local
  - Single-threaded
  - Performance importante

StringBuffer (1%):
  - Campo compartilhado
  - Múltiplas threads modificando simultaneamente
  - Código legado

Melhor que StringBuffer:
  - ThreadLocal<StringBuilder>
  - StringBuilder + synchronized externo
  - StringBuilder por thread + join
```

**Exemplo típico**:
```java
// ✓ Padrão
public String processar(List<String> dados) {
    StringBuilder sb = new StringBuilder();  // Local = StringBuilder
    for (String dado : dados) {
        sb.append(dado);
    }
    return sb.toString();
}

// ✓ Multi-threading (raro)
public class Logger {
    private StringBuffer buffer = new StringBuffer();  // Compartilhado
    
    public void log(String msg) {
        buffer.append(msg).append("\n");  // Thread-safe
    }
}
```

**Recomendação**: Use **StringBuilder por padrão** (99% dos casos). Use **StringBuffer apenas** se múltiplas threads modificarem o mesmo objeto simultaneamente. Prefira **ThreadLocal<StringBuilder>** a StringBuffer (melhor performance). Variáveis locais **sempre StringBuilder**. Migre código legado de StringBuffer para StringBuilder se single-threaded.