# Performance: String vs StringBuilder vs StringBuffer

## 🎯 Introdução e Definição

**String, StringBuilder e StringBuffer representam três abordagens distintas** para trabalhar com texto em Java, cada uma com **trade-offs específicos de performance**. String é **imutável e thread-safe**, StringBuilder é **mutável e rápido**, StringBuffer é **mutável e thread-safe**. A escolha entre eles pode resultar em **diferenças de performance de 1000x ou mais**.

**Conceito central**: **String** cria novos objetos a cada modificação (O(n²) em loops), **StringBuilder** modifica in-place sem sincronização (O(n) rápido), **StringBuffer** modifica in-place com sincronização (O(n) com overhead). Performance relativa: **StringBuilder > StringBuffer > String** para construção/modificação.

**Exemplo fundamental**:
```java
int n = 1000;

// String + - O(n²) ~50ms
String s = "";
for (int i = 0; i < n; i++) {
    s = s + i;
}

// StringBuilder - O(n) ~100µs
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append(i);
}

// StringBuffer - O(n) com overhead ~160µs
StringBuffer sbuf = new StringBuffer();
for (int i = 0; i < n; i++) {
    sbuf.append(i);
}

// StringBuilder: 500x mais rápido que String
// StringBuffer: 60% mais lento que StringBuilder
```

**Características principais**:
- **String**: imutável, thread-safe, O(n²) loops, simples
- **StringBuilder**: mutável, não thread-safe, O(n), máxima performance
- **StringBuffer**: mutável, thread-safe, O(n)+overhead, ~60% mais lento
- **Escolha**: depende do cenário (concatenações, threads, simplicidade)

## 📋 Fundamentos Teóricos

### 1️⃣ Complexidade Algoritmica

**String concatenação - O(n²)**:

```java
// Análise de complexidade
String s = "";
for (int i = 0; i < n; i++) {
    s = s + i;  // Cria novo String, copia i caracteres
}

// Iteração 0: copia 0 chars
// Iteração 1: copia 1 char
// Iteração 2: copia 2 chars
// ...
// Iteração n-1: copia n-1 chars

// Total: 0 + 1 + 2 + ... + (n-1) = n(n-1)/2 = O(n²)

// Para n=1000: ~500.000 operações de cópia
```

**StringBuilder - O(n) amortizado**:
```java
// Análise de complexidade
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append(i);  // O(1) amortizado
}

// Cada append: O(1) amortizado
// (expansões ocasionais são O(n) mas raras)
// Total: n × O(1) = O(n)

// Para n=1000: ~1.000 operações
// 500x menos que String!
```

**StringBuffer - O(n) amortizado + overhead**:
```java
// Mesma complexidade que StringBuilder
// Mas cada operação tem overhead de synchronized

// StringBuffer: O(n) + custo de locks
// Custo de lock: ~50-100ns por operação
// Para n=1000: 1000 × 100ns = 100µs overhead
```

**Tabela de complexidade**:

| Operação | String | StringBuilder | StringBuffer |
|----------|--------|---------------|--------------|
| **Concatenar 2** | O(n) | O(1) | O(1) |
| **Loop n vezes** | O(n²) | O(n) | O(n) |
| **Acesso charAt** | O(1) | O(1) | O(1)+lock |
| **Substring** | O(n) | O(n) | O(n)+lock |
| **Memória** | n objetos | 1 objeto | 1 objeto |

### 2️⃣ Benchmark - Concatenação Simples

**2 concatenações**:

```java
// String + - ~50ns
long inicio = System.nanoTime();
String s = "Hello" + " " + "World";
long tempo1 = System.nanoTime() - inicio;

// StringBuilder - ~150ns
inicio = System.nanoTime();
String sb = new StringBuilder("Hello")
              .append(" ")
              .append("World")
              .toString();
long tempo2 = System.nanoTime() - inicio;

// StringBuffer - ~200ns
inicio = System.nanoTime();
String sbuf = new StringBuffer("Hello")
                .append(" ")
                .append("World")
                .toString();
long tempo3 = System.nanoTime() - inicio;

System.out.println("String +:      " + tempo1 + "ns");  // ~50ns
System.out.println("StringBuilder: " + tempo2 + "ns");  // ~150ns
System.out.println("StringBuffer:  " + tempo3 + "ns");  // ~200ns

// Para 2-3 concatenações: String + é MAIS RÁPIDO
// Motivo: compilador otimiza, sem overhead de objeto
```

**5 concatenações**:
```java
int n = 5;

// String +
inicio = System.nanoTime();
String s = "";
for (int i = 0; i < n; i++) s += "X";
tempo1 = System.nanoTime() - inicio;

// StringBuilder
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append("X");
String r = sb.toString();
tempo2 = System.nanoTime() - inicio;

// StringBuffer
inicio = System.nanoTime();
StringBuffer sbuf = new StringBuffer();
for (int i = 0; i < n; i++) sbuf.append("X");
r = sbuf.toString();
tempo3 = System.nanoTime() - inicio;

System.out.println("String +:      " + tempo1 + "ns");  // ~200ns
System.out.println("StringBuilder: " + tempo2 + "ns");  // ~250ns
System.out.println("StringBuffer:  " + tempo3 + "ns");  // ~350ns

// Performance similar para 5 concatenações
// Ponto de virada: ~5-10 concatenações
```

### 3️⃣ Benchmark - Loop Concatenação

**100 iterações**:

```java
int n = 100;

// String +
long inicio = System.nanoTime();
String s = "";
for (int i = 0; i < n; i++) s += "X";
long tempo1 = (System.nanoTime() - inicio) / 1000;

// StringBuilder
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append("X");
String r = sb.toString();
long tempo2 = (System.nanoTime() - inicio) / 1000;

// StringBuffer
inicio = System.nanoTime();
StringBuffer sbuf = new StringBuffer();
for (int i = 0; i < n; i++) sbuf.append("X");
r = sbuf.toString();
long tempo3 = (System.nanoTime() - inicio) / 1000;

System.out.println("String +:      " + tempo1 + "µs");  // ~2000µs (2ms)
System.out.println("StringBuilder: " + tempo2 + "µs");  // ~20µs
System.out.println("StringBuffer:  " + tempo3 + "µs");  // ~35µs

// StringBuilder: 100x mais rápido que String
// StringBuffer: 60-70% mais lento que StringBuilder
```

**1000 iterações**:
```java
int n = 1000;

// String +
inicio = System.nanoTime();
String s = "";
for (int i = 0; i < n; i++) s += "X";
tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuilder
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append("X");
r = sb.toString();
tempo2 = (System.nanoTime() - inicio) / 1000;

// StringBuffer
inicio = System.nanoTime();
StringBuffer sbuf = new StringBuffer();
for (int i = 0; i < n; i++) sbuf.append("X");
r = sbuf.toString();
tempo3 = (System.nanoTime() - inicio) / 1000;

System.out.println("String +:      " + tempo1 + "ms");   // ~50ms
System.out.println("StringBuilder: " + tempo2 + "µs");   // ~100µs
System.out.println("StringBuffer:  " + tempo3 + "µs");   // ~160µs

// StringBuilder: 500x mais rápido que String
// StringBuffer: 60% mais lento que StringBuilder
```

**10000 iterações**:
```java
int n = 10000;

// String + (muito lento, reduzir n)
inicio = System.nanoTime();
String s = "";
for (int i = 0; i < 1000; i++) s += "X";  // Apenas 1000!
tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuilder
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append("X");
r = sb.toString();
tempo2 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuffer
inicio = System.nanoTime();
StringBuffer sbuf = new StringBuffer();
for (int i = 0; i < n; i++) sbuf.append("X");
r = sbuf.toString();
tempo3 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("String + (n=1k): " + tempo1 + "ms");  // ~50ms
System.out.println("StringBuilder:   " + tempo2 + "ms");  // ~5ms
System.out.println("StringBuffer:    " + tempo3 + "ms");  // ~8ms

// StringBuilder: 1000x mais rápido que String (extrapolando)
// StringBuffer: 60% mais lento que StringBuilder
```

### 4️⃣ Benchmark - Operações Específicas

**append() performance**:

```java
int n = 100000;

// StringBuilder
StringBuilder sb = new StringBuilder();
long inicio = System.nanoTime();
for (int i = 0; i < n; i++) {
    sb.append("X");
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuffer
StringBuffer sbuf = new StringBuffer();
inicio = System.nanoTime();
for (int i = 0; i < n; i++) {
    sbuf.append("X");
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("StringBuilder: " + tempo1 + "ms");  // ~7ms
System.out.println("StringBuffer:  " + tempo2 + "ms");  // ~11ms
System.out.printf("Overhead: %.1f%%\n", 
    ((double)(tempo2 - tempo1) / tempo1) * 100);  // ~60%
```

**insert() performance**:
```java
String texto = "X".repeat(10000);

// StringBuilder
StringBuilder sb = new StringBuilder(texto);
long inicio = System.nanoTime();
sb.insert(5000, "Y");
long tempo1 = (System.nanoTime() - inicio) / 1000;

// StringBuffer
StringBuffer sbuf = new StringBuffer(texto);
inicio = System.nanoTime();
sbuf.insert(5000, "Y");
long tempo2 = (System.nanoTime() - inicio) / 1000;

// String (substring)
inicio = System.nanoTime();
String r = texto.substring(0, 5000) + "Y" + texto.substring(5000);
long tempo3 = (System.nanoTime() - inicio) / 1000;

System.out.println("StringBuilder: " + tempo1 + "µs");  // ~80µs
System.out.println("StringBuffer:  " + tempo2 + "µs");  // ~130µs
System.out.println("String:        " + tempo3 + "µs");  // ~100µs

// insert(): StringBuilder vs StringBuffer ~60% overhead
// String competitive para operação única
```

**toString() performance**:
```java
StringBuilder sb = new StringBuilder("X".repeat(10000));
StringBuffer sbuf = new StringBuffer("X".repeat(10000));

// StringBuilder.toString()
long inicio = System.nanoTime();
for (int i = 0; i < 10000; i++) {
    String s = sb.toString();
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuffer.toString()
inicio = System.nanoTime();
for (int i = 0; i < 10000; i++) {
    String s = sbuf.toString();
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("StringBuilder: " + tempo1 + "ms");  // ~300ms
System.out.println("StringBuffer:  " + tempo2 + "ms");  // ~400ms

// toString() overhead menor (~30%) que append (~60%)
```

### 5️⃣ Uso de Memória

**Garbage gerado**:

```java
int n = 1000;

// String + - cria 1000 objetos
long memoriaInicio = Runtime.getRuntime().totalMemory() - 
                     Runtime.getRuntime().freeMemory();

String s = "";
for (int i = 0; i < n; i++) {
    s = s + "X";  // Cria novo String, anterior vira lixo
}

long memoriaFim = Runtime.getRuntime().totalMemory() - 
                  Runtime.getRuntime().freeMemory();
long memoriaUsada1 = (memoriaFim - memoriaInicio) / 1024;

// StringBuilder - 1 objeto, expansões do array
memoriaInicio = Runtime.getRuntime().totalMemory() - 
                Runtime.getRuntime().freeMemory();

StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append("X");  // Modifica mesmo objeto
}

memoriaFim = Runtime.getRuntime().totalMemory() - 
             Runtime.getRuntime().freeMemory();
long memoriaUsada2 = (memoriaFim - memoriaInicio) / 1024;

System.out.println("String +:      " + memoriaUsada1 + "KB");  // ~500KB
System.out.println("StringBuilder: " + memoriaUsada2 + "KB");  // ~10KB

// String gera ~50x mais garbage!
```

**Pressão no GC**:
```java
// String + força GC frequente
long gcInicio = ManagementFactory.getGarbageCollectorMXBeans()
    .stream().mapToLong(gc -> gc.getCollectionCount()).sum();

String s = "";
for (int i = 0; i < 10000; i++) {
    s = s + "X";
}

long gcFim = ManagementFactory.getGarbageCollectorMXBeans()
    .stream().mapToLong(gc -> gc.getCollectionCount()).sum();

System.out.println("String GCs: " + (gcFim - gcInicio));  // ~5-10 GCs

// StringBuilder - raramente força GC
gcInicio = ManagementFactory.getGarbageCollectorMXBeans()
    .stream().mapToLong(gc -> gc.getCollectionCount()).sum();

StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append("X");
}

gcFim = ManagementFactory.getGarbageCollectorMXBeans()
    .stream().mapToLong(gc -> gc.getCollectionCount()).sum();

System.out.println("StringBuilder GCs: " + (gcFim - gcInicio));  // ~0 GCs
```

### 6️⃣ Cenários Reais

**Cenário 1: Construir SQL**:

```java
List<String> colunas = List.of("id", "nome", "email", "idade", "cidade");
String tabela = "usuarios";

// String +
long inicio = System.nanoTime();
String sql = "SELECT ";
for (int i = 0; i < colunas.size(); i++) {
    if (i > 0) sql += ", ";
    sql += colunas.get(i);
}
sql += " FROM " + tabela;
long tempo1 = (System.nanoTime() - inicio) / 1000;

// StringBuilder
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder("SELECT ");
for (int i = 0; i < colunas.size(); i++) {
    if (i > 0) sb.append(", ");
    sb.append(colunas.get(i));
}
sb.append(" FROM ").append(tabela);
String sql2 = sb.toString();
long tempo2 = (System.nanoTime() - inicio) / 1000;

System.out.println("String +:      " + tempo1 + "µs");  // ~5µs
System.out.println("StringBuilder: " + tempo2 + "µs");  // ~3µs

// StringBuilder 2x mais rápido mesmo para caso pequeno
```

**Cenário 2: Processar arquivo**:
```java
List<String> linhas = Files.readAllLines(Path.of("arquivo.txt"));  // 10000 linhas

// String +
long inicio = System.nanoTime();
String conteudo = "";
for (String linha : linhas) {
    conteudo += linha + "\n";
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuilder
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (String linha : linhas) {
    sb.append(linha).append("\n");
}
String conteudo2 = sb.toString();
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("String +:      " + tempo1 + "ms");  // ~5000ms (5s!)
System.out.println("StringBuilder: " + tempo2 + "ms");  // ~10ms

// StringBuilder 500x mais rápido!
```

**Cenário 3: Gerar relatório**:
```java
List<Venda> vendas = obterVendas();  // 1000 vendas

// String +
long inicio = System.nanoTime();
String relatorio = "RELATÓRIO DE VENDAS\n";
relatorio += "=".repeat(50) + "\n";
for (Venda venda : vendas) {
    relatorio += "Cliente: " + venda.getCliente() + "\n";
    relatorio += "Valor: R$ " + venda.getValor() + "\n";
    relatorio += "-".repeat(50) + "\n";
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuilder
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder("RELATÓRIO DE VENDAS\n");
sb.append("=".repeat(50)).append("\n");
for (Venda venda : vendas) {
    sb.append("Cliente: ").append(venda.getCliente()).append("\n");
    sb.append("Valor: R$ ").append(venda.getValor()).append("\n");
    sb.append("-".repeat(50)).append("\n");
}
String relatorio2 = sb.toString();
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("String +:      " + tempo1 + "ms");  // ~300ms
System.out.println("StringBuilder: " + tempo2 + "ms");  // ~5ms

// StringBuilder 60x mais rápido
```

### 7️⃣ Matriz de Decisão

**Por número de concatenações**:

| Concatenações | Melhor Escolha | Tempo Relativo |
|---------------|----------------|----------------|
| **2-3** | String + | 1x (baseline) |
| **5** | String + | 1x |
| **10** | StringBuilder | 3x mais rápido |
| **100** | StringBuilder | 100x mais rápido |
| **1000** | StringBuilder | 500x mais rápido |
| **10000+** | StringBuilder | 1000x mais rápido |

**Por cenário**:
```java
// Literal + literal
"Hello" + " " + "World"  // ✓ String + (compilador otimiza)

// 2-5 concatenações
String nome = titulo + ": " + valor;  // ✓ String + (simples)

// Loop
for (int i = 0; i < n; i++) {
    sb.append(...);  // ✓ StringBuilder (OBRIGATÓRIO)
}

// Multi-threading
synchronized { sb.append(...); }  // ✓ StringBuilder + sync
// ou
sbuf.append(...);  // ✓ StringBuffer

// Conditional construction
if (condicao1) sb.append(...);
if (condicao2) sb.append(...);  // ✓ StringBuilder
```

### 8️⃣ Otimizações do Compilador

**String + em literais**:

```java
// Código fonte
String s = "Hello" + " " + "World";

// Compilador otimiza para
String s = "Hello World";

// Sem overhead runtime
```

**String + com variáveis (Java 9+)**:
```java
// Código fonte
String nome = "João";
int idade = 30;
String s = "Nome: " + nome + ", Idade: " + idade;

// Java 8: compilador usa StringBuilder
String s = new StringBuilder()
    .append("Nome: ")
    .append(nome)
    .append(", Idade: ")
    .append(idade)
    .toString();

// Java 9+: usa invokedynamic (mais eficiente)
String s = StringConcatFactory.makeConcatWithConstants(...);
// ~30% mais rápido que Java 8
```

**Limitações da otimização**:
```java
// Compilador NÃO pode otimizar loops
String s = "";
for (int i = 0; i < n; i++) {
    s = s + i;  // ❌ Não otimizado, O(n²)
}

// Precisa usar StringBuilder manualmente
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append(i);  // ✓ O(n)
}
```

### 9️⃣ Benchmark Completo

**Tabela resumo (n=1000)**:

| Operação | String | StringBuilder | StringBuffer | SB vs String | SBuf vs SB |
|----------|--------|---------------|--------------|--------------|------------|
| **Append loop** | 50ms | 100µs | 160µs | 500x | 1.6x |
| **Insert** | 100µs | 80µs | 130µs | 1.25x | 1.6x |
| **Delete** | 150µs | 60µs | 100µs | 2.5x | 1.7x |
| **Reverse** | 200µs | 100µs | 150µs | 2x | 1.5x |
| **toString** | - | 30µs | 40µs | - | 1.3x |
| **Memória** | 500KB | 10KB | 10KB | 50x | 1x |
| **GC** | 5-10 | 0 | 0 | - | 1x |

**Recomendações**:
```java
// 2-5 concatenações
String +: simples, rápido, idiomatic  ✓

// 10+ concatenações
StringBuilder: obrigatório  ✓

// Multi-threading
StringBuffer ou ThreadLocal<StringBuilder>  ✓

// Performance crítica
StringBuilder + capacidade inicial  ✓

// Memória limitada
StringBuilder (50x menos garbage)  ✓
```

### 🔟 Cenários Específicos

**JSON building**:

```java
// String + - PÉSSIMO
String json = "{";
json += "\"nome\": \"" + nome + "\",";
json += "\"idade\": " + idade + ",";
json += "\"ativo\": " + ativo;
json += "}";
// Lento, ilegível

// StringBuilder - BOM
StringBuilder sb = new StringBuilder("{");
sb.append("\"nome\": \"").append(nome).append("\",");
sb.append("\"idade\": ").append(idade).append(",");
sb.append("\"ativo\": ").append(ativo);
sb.append("}");
String json = sb.toString();
// Rápido, mas verboso

// Biblioteca JSON - MELHOR
String json = new JSONObject()
    .put("nome", nome)
    .put("idade", idade)
    .put("ativo", ativo)
    .toString();
// Rápido, limpo, type-safe
```

**HTML generation**:
```java
StringBuilder html = new StringBuilder(1000);
html.append("<!DOCTYPE html>\n");
html.append("<html>\n");
html.append("<head><title>").append(titulo).append("</title></head>\n");
html.append("<body>\n");
for (Item item : itens) {
    html.append("<div>").append(item.getNome()).append("</div>\n");
}
html.append("</body>\n");
html.append("</html>");

// StringBuilder essencial para loops em HTML
```

**Logging**:
```java
// ThreadLocal<StringBuilder> para performance
private static final ThreadLocal<StringBuilder> logBuffer = 
    ThreadLocal.withInitial(() -> new StringBuilder(256));

public static void log(String nivel, String mensagem) {
    StringBuilder sb = logBuffer.get();
    sb.setLength(0);  // Reusar buffer
    
    sb.append("[")
      .append(LocalDateTime.now())
      .append("] [")
      .append(nivel)
      .append("] ")
      .append(mensagem);
    
    System.out.println(sb);
}

// Mais rápido que StringBuffer (sem synchronized)
// Thread-safe (ThreadLocal)
```

## 🎯 Aplicabilidade

**1. String + (2-5 concatenações)**:
```java
String s = a + " " + b;  // ✓ Simples
```

**2. StringBuilder (loops, múltiplas modificações)**:
```java
for (...) sb.append(...);  // ✓ Obrigatório
```

**3. StringBuffer (multi-threading raro)**:
```java
sbuf.append(...);  // Thread-safe compartilhado
```

**4. ThreadLocal<StringBuilder> (melhor multi-threading)**:
```java
ThreadLocal<StringBuilder> tl = ...;  // ✓ Performance
```

**5. StringBuilder + capacidade (otimização)**:
```java
new StringBuilder(estimativa);  // ✓ 2x mais rápido
```

## ⚠️ Armadilhas Comuns

**1. String + em Loop**:
```java
for (...) s += x;  // ❌ O(n²), 500x mais lento
```

**2. Ignorar Diferença de Performance**:
```java
String s = "";  // ⚠️ 500x mais lento em loops
```

**3. StringBuffer Desnecessário**:
```java
StringBuffer sb = new StringBuffer();  // ⚠️ 60% overhead
```

**4. Não Especificar Capacidade**:
```java
new StringBuilder();  // ⚠️ 2x mais lento em loops grandes
```

**5. String + para Múltiplas Concatenações**:
```java
String s = a + b + c + d + e + f;  // ⚠️ Use StringBuilder se >5
```

## ✅ Boas Práticas

**1. String + para 2-5 Concatenações**:
```java
String s = a + " " + b;  // ✓
```

**2. StringBuilder em Loops**:
```java
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);
```

**3. Especificar Capacidade**:
```java
new StringBuilder(estimativa);  // ✓
```

**4. ThreadLocal para Multi-Threading**:
```java
ThreadLocal<StringBuilder> buffer;  // ✓
```

**5. Benchmark Código Crítico**:
```java
// Medir antes de otimizar
```

## 📚 Resumo Executivo

**Performance comparativa**.

**Complexidade**:
```java
String +:      O(n²) em loops  ❌ Péssimo
StringBuilder: O(n) amortizado  ✓ Ótimo
StringBuffer:  O(n) + overhead  ✓ Bom
```

**Benchmark (n=1000)**:
```java
String +:      50ms     (baseline)
StringBuilder: 100µs    (500x mais rápido)
StringBuffer:  160µs    (60% mais lento que SB)
```

**Memória**:
```java
String +:      500KB garbage  ❌
StringBuilder: 10KB           ✓
StringBuffer:  10KB           ✓
```

**Quando usar**:
```java
String + (2-5 concatenações):
  "Hello" + " " + "World"  ✓ Simples

StringBuilder (loops, múltiplas):
  for (...) sb.append(...)  ✓ Obrigatório

StringBuffer (multi-threading):
  Raro, preferir ThreadLocal<StringBuilder>

ThreadLocal<StringBuilder>:
  Melhor performance multi-threaded  ✓
```

**Ponto de virada**:
```java
≤5 concatenações:  String +        ✓
>5 concatenações:  StringBuilder   ✓
Loop:              StringBuilder   ✓ SEMPRE
Multi-threading:   ThreadLocal     ✓ Preferencial
```

**Exemplo típico**:
```java
// ✓ Simples
String nome = titulo + ": " + valor;

// ✓ Loop
StringBuilder sb = new StringBuilder(lista.size() * 50);
for (Item item : lista) {
    sb.append(item).append("\n");
}
String resultado = sb.toString();

// Performance: 500x diferença!
```

**Recomendação**: Use **String +** para 2-5 concatenações simples (idiomático). Use **StringBuilder** em loops ou múltiplas modificações (500-1000x mais rápido). Especifique **capacidade inicial** (2x mais rápido). **StringBuffer** apenas se multi-threading compartilhado (preferir ThreadLocal). **NUNCA** use String + em loops (O(n²) desastroso).