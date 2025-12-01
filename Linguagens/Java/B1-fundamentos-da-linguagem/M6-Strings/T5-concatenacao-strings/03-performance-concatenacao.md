# Performance de Concatenação

## 🎯 Introdução e Definição

**Performance de concatenação** refere-se ao **tempo de execução e uso de memória** ao unir Strings. Como Strings são **imutáveis**, cada concatenação cria uma **nova String**, o que pode ter **impacto severo** em performance dependendo do método usado.

**Conceito central**: A escolha entre `+`, `concat()`, `StringBuilder`, `StringBuffer`, `String.join()` e `String.format()` pode resultar em diferenças de **10x a 1000x** em performance, especialmente em **loops** e **múltiplas concatenações**.

**Exemplo fundamental**:
```java
// Teste rápido - 1000 concatenações

// ❌ Operador + em loop - ~50ms
String s1 = "";
for (int i = 0; i < 1000; i++) {
    s1 = s1 + i;  // Cria nova String a cada iteração
}

// ✓ StringBuilder - ~100µs (500x mais rápido!)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String s2 = sb.toString();

// Diferença: 50,000µs vs 100µs
```

**Características principais**:
- **Operador +**: otimizado para poucas Strings (~2-5), péssimo em loops
- **concat()**: similar ao + para 2 Strings, pior para múltiplas
- **StringBuilder**: essencial para loops e muitas concatenações
- **String.join()**: eficiente para arrays/listas com delimitador
- **String.format()**: lento (~10x +) mas oferece formatação precisa

## 📋 Fundamentos Teóricos

### 1️⃣ Imutabilidade e Impacto em Performance

**String é imutável**:

```java
String s = "Hello";
s = s + " World";  // NÃO modifica "Hello"

// O que acontece:
// 1. Cria nova String "Hello World"
// 2. Variável s aponta para nova String
// 3. "Hello" original vira garbage (se sem outras referências)
```

**Alocações em concatenações**:
```java
String s = "A";
s = s + "B";  // Aloca "AB"
s = s + "C";  // Aloca "ABC"
s = s + "D";  // Aloca "ABCD"

// Total: 4 Strings criadas (1 original + 3 concatenações)
// Memória: "A", "AB", "ABC", "ABCD"
// Apenas "ABCD" é útil, resto vira garbage
```

**Complexidade quadrática em loops**:
```java
String s = "";
for (int i = 0; i < n; i++) {
    s = s + i;  // Cada iteração cria nova String
}

// Iteração 0: cria String de tamanho 1
// Iteração 1: cria String de tamanho 2 (copia 1 + adiciona 1)
// Iteração 2: cria String de tamanho 3 (copia 2 + adiciona 1)
// ...
// Iteração n-1: cria String de tamanho n (copia n-1 + adiciona 1)

// Total de cópias: 0 + 1 + 2 + ... + (n-1) = n(n-1)/2
// Complexidade: O(n²) - PÉSSIMO!
```

### 2️⃣ Benchmark: Operador +

**Poucas Strings (2-5) - Eficiente**:

```java
// 2 Strings - ~50ns
long inicio = System.nanoTime();
String s = "Hello" + " World";
long tempo = System.nanoTime() - inicio;
System.out.println("2 Strings: " + tempo + "ns");  // ~50ns

// 5 Strings - ~200ns
inicio = System.nanoTime();
String s2 = "A" + "B" + "C" + "D" + "E";
tempo = System.nanoTime() - inicio;
System.out.println("5 Strings: " + tempo + "ns");  // ~200ns
```

**Loop pequeno (100 iterações) - Lento**:
```java
// 100 concatenações - ~2ms
long inicio = System.nanoTime();
String s = "";
for (int i = 0; i < 100; i++) {
    s = s + i;
}
long tempo = (System.nanoTime() - inicio) / 1_000_000;
System.out.println("100 iterações: " + tempo + "ms");  // ~2ms
```

**Loop grande (1000 iterações) - Muito lento**:
```java
// 1000 concatenações - ~50ms
long inicio = System.nanoTime();
String s = "";
for (int i = 0; i < 1000; i++) {
    s = s + i;
}
long tempo = (System.nanoTime() - inicio) / 1_000_000;
System.out.println("1000 iterações: " + tempo + "ms");  // ~50ms
```

**Loop enorme (10000 iterações) - Inaceitável**:
```java
// 10000 concatenações - ~5000ms (5 segundos!)
long inicio = System.nanoTime();
String s = "";
for (int i = 0; i < 10000; i++) {
    s = s + i;
}
long tempo = (System.nanoTime() - inicio) / 1_000_000;
System.out.println("10000 iterações: " + tempo + "ms");  // ~5000ms
```

### 3️⃣ Benchmark: concat()

**Similar ao + para 2 Strings**:

```java
String s1 = "Hello";
String s2 = " World";

// concat() - ~50ns
long inicio = System.nanoTime();
String r1 = s1.concat(s2);
long tempo1 = System.nanoTime() - inicio;

// + - ~50ns
inicio = System.nanoTime();
String r2 = s1 + s2;
long tempo2 = System.nanoTime() - inicio;

System.out.println("concat(): " + tempo1 + "ns");  // ~50ns
System.out.println("+: " + tempo2 + "ns");         // ~50ns
// Performance similar
```

**Múltiplas concatenações - Pior que +**:
```java
String[] partes = {"A", "B", "C", "D", "E"};

// concat() encadeado - ~500ns
long inicio = System.nanoTime();
String r1 = partes[0].concat(partes[1]).concat(partes[2])
                     .concat(partes[3]).concat(partes[4]);
long tempo1 = System.nanoTime() - inicio;

// + - ~200ns (Java 9+ otimizado)
inicio = System.nanoTime();
String r2 = partes[0] + partes[1] + partes[2] + partes[3] + partes[4];
long tempo2 = System.nanoTime() - inicio;

System.out.println("concat(): " + tempo1 + "ns");  // ~500ns
System.out.println("+: " + tempo2 + "ns");         // ~200ns
// + é 2.5x mais rápido
```

**Loop - Péssimo (igual ao +)**:
```java
// concat() em loop - ~50ms (1000 iterações)
long inicio = System.nanoTime();
String s = "";
for (int i = 0; i < 1000; i++) {
    s = s.concat(String.valueOf(i));
}
long tempo = (System.nanoTime() - inicio) / 1_000_000;
System.out.println("concat() loop: " + tempo + "ms");  // ~50ms

// Mesmo problema quadrático que +
```

### 4️⃣ Benchmark: StringBuilder

**Loop - Excelente**:

```java
// StringBuilder - 1000 iterações - ~100µs
long inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String s = sb.toString();
long tempo = (System.nanoTime() - inicio) / 1_000;
System.out.println("StringBuilder: " + tempo + "µs");  // ~100µs

// vs + - ~50,000µs (50ms)
// StringBuilder é 500x mais rápido!
```

**Capacidade inicial importa**:
```java
int n = 10000;

// Sem capacidade inicial - ~10ms
long inicio = System.nanoTime();
StringBuilder sb1 = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb1.append(i);
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// Com capacidade inicial - ~5ms (2x mais rápido)
inicio = System.nanoTime();
StringBuilder sb2 = new StringBuilder(n * 5);  // Estimativa
for (int i = 0; i < n; i++) {
    sb2.append(i);
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("Sem capacidade: " + tempo1 + "ms");  // ~10ms
System.out.println("Com capacidade: " + tempo2 + "ms");  // ~5ms
```

**Complexidade linear O(n)**:
```java
// StringBuilder - O(n) linear
// Cada append() é O(1) amortizado
// Total: n × O(1) = O(n)

// vs + em loop - O(n²) quadrático
// Cada concatenação copia string existente
// Total: O(1 + 2 + ... + n) = O(n²)
```

### 5️⃣ Benchmark: StringBuffer

**Thread-safe - Mais lento que StringBuilder**:

```java
int n = 10000;

// StringBuilder (não thread-safe) - ~5ms
long inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append(i);
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuffer (thread-safe) - ~8ms
inicio = System.nanoTime();
StringBuffer sbf = new StringBuffer();
for (int i = 0; i < n; i++) {
    sbf.append(i);
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("StringBuilder: " + tempo1 + "ms");  // ~5ms
System.out.println("StringBuffer: " + tempo2 + "ms");   // ~8ms
// StringBuffer ~60% mais lento (overhead de sincronização)
```

**Quando usar cada um**:
```java
// StringBuilder - single-threaded (99% dos casos)
StringBuilder sb = new StringBuilder();

// StringBuffer - multi-threaded (raro)
StringBuffer sbf = new StringBuffer();  // synchronized methods

// Na prática, StringBuilder quase sempre preferível
// Se precisar thread-safety, considere outras abordagens
```

### 6️⃣ Benchmark: String.join()

**Juntar arrays/listas - Eficiente**:

```java
String[] partes = new String[1000];
for (int i = 0; i < 1000; i++) {
    partes[i] = "Item" + i;
}

// String.join() - ~2ms
long inicio = System.nanoTime();
String r1 = String.join(", ", partes);
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// Loop com + - ~200ms
inicio = System.nanoTime();
String r2 = "";
for (String p : partes) {
    r2 = r2 + p + ", ";
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuilder manual - ~2ms
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < partes.length; i++) {
    if (i > 0) sb.append(", ");
    sb.append(partes[i]);
}
String r3 = sb.toString();
long tempo3 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("String.join(): " + tempo1 + "ms");  // ~2ms
System.out.println("Loop +: " + tempo2 + "ms");         // ~200ms
System.out.println("StringBuilder: " + tempo3 + "ms");   // ~2ms

// join() é ~100x mais rápido que +
// join() similar a StringBuilder (usa internamente)
```

### 7️⃣ Benchmark: String.format()

**Formatação - Lento mas preciso**:

```java
String nome = "João";
int idade = 30;
double salario = 5000.50;

// String.format() - ~1000ns
long inicio = System.nanoTime();
String r1 = String.format("Nome: %s, Idade: %d, Salário: %.2f", 
                          nome, idade, salario);
long tempo1 = System.nanoTime() - inicio;

// + - ~100ns
inicio = System.nanoTime();
String r2 = "Nome: " + nome + ", Idade: " + idade + 
            ", Salário: " + salario;
long tempo2 = System.nanoTime() - inicio;

// StringBuilder - ~150ns
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
sb.append("Nome: ").append(nome)
  .append(", Idade: ").append(idade)
  .append(", Salário: ").append(salario);
String r3 = sb.toString();
long tempo3 = System.nanoTime() - inicio;

System.out.println("format(): " + tempo1 + "ns");     // ~1000ns
System.out.println("+: " + tempo2 + "ns");            // ~100ns
System.out.println("StringBuilder: " + tempo3 + "ns"); // ~150ns

// format() é ~10x mais lento
// Mas oferece controle preciso de formatação
```

**Quando a formatação compensa**:
```java
double valor = 1234567.89;

// format() - formatação precisa
String s1 = String.format("%,.2f", valor);  // "1,234,567.89"

// + - sem formatação
String s2 = "" + valor;  // "1234567.89"

// Para obter mesma formatação com +:
NumberFormat nf = NumberFormat.getInstance();
nf.setMinimumFractionDigits(2);
nf.setMaximumFractionDigits(2);
String s3 = nf.format(valor);  // "1,234,567.89"

// format() mais simples para formatação complexa
```

### 8️⃣ Tabela Comparativa Completa

**Performance por cenário**:

| Método | 2 Strings | 5 Strings | Loop 100 | Loop 1000 | Loop 10000 |
|--------|-----------|-----------|----------|-----------|------------|
| **+** | ~50ns ✓ | ~200ns ✓ | ~2ms ⚠️ | ~50ms ❌ | ~5000ms ❌ |
| **concat()** | ~50ns ✓ | ~500ns ⚠️ | ~2ms ⚠️ | ~50ms ❌ | ~5000ms ❌ |
| **StringBuilder** | ~150ns ⚠️ | ~250ns ⚠️ | ~20µs ✓ | ~100µs ✓ | ~5ms ✓ |
| **StringBuffer** | ~200ns ⚠️ | ~300ns ⚠️ | ~30µs ⚠️ | ~150µs ⚠️ | ~8ms ⚠️ |
| **String.join()** | N/A | N/A | ~500µs ✓ | ~2ms ✓ | ~20ms ✓ |
| **String.format()** | ~1000ns ⚠️ | ~1500ns ⚠️ | N/A | N/A | N/A |

**Legenda**:
- ✓ Ótimo para este cenário
- ⚠️ Aceitável mas não ideal
- ❌ Péssimo, evitar

### 9️⃣ Análise de Uso de Memória

**+ em loop - garbage excessivo**:

```java
// 1000 iterações
String s = "";
for (int i = 0; i < 1000; i++) {
    s = s + i;  // Cria 1000 Strings temporárias
}

// Memória total alocada: ~500KB
// Memória útil: ~5KB (resultado final)
// Garbage: ~495KB (99% desperdiçado)
```

**StringBuilder - mínimo de garbage**:
```java
// 1000 iterações
StringBuilder sb = new StringBuilder(5000);  // Capacidade inicial
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String s = sb.toString();

// Memória total alocada: ~10KB
// Memória útil: ~5KB
// Garbage: ~5KB (array interno se cresceu)
// 99% menos garbage que +
```

**Visualização de alocações**:
```java
// Monitorar com -XX:+PrintGCDetails

// + em loop (1000 iterações)
// [GC pause (young) 512K->128K(2048K), 0.0015 secs]
// [GC pause (young) 640K->256K(2048K), 0.0020 secs]
// [GC pause (young) 768K->384K(2048K), 0.0018 secs]
// ... (múltiplos GCs)

// StringBuilder
// [GC pause (young) 64K->32K(2048K), 0.0002 secs]
// ... (pouquíssimos GCs)
```

### 🔟 Escolhendo a Melhor Abordagem

**Árvore de decisão**:

```java
// 1. Concatenação em loop?
if (emLoop) {
    // SIM: Use StringBuilder
    StringBuilder sb = new StringBuilder();
    for (...) {
        sb.append(...);
    }
    return sb.toString();
}

// 2. Array ou lista com delimitador?
if (arrayComDelimitador) {
    // SIM: Use String.join()
    return String.join(", ", array);
}

// 3. Formatação complexa (decimais, padding, etc.)?
if (formatacaoComplexa) {
    // SIM: Use String.format()
    return String.format("%,.2f", valor);
}

// 4. Poucas Strings (2-5)?
if (poucasStrings) {
    // SIM: Use + (simples e eficiente)
    return s1 + s2 + s3;
}

// 5. Muitas Strings (6+)?
if (muitasStrings) {
    // SIM: Use StringBuilder
    return new StringBuilder()
        .append(s1).append(s2)...toString();
}

// Padrão: use +
return s1 + s2;
```

**Exemplos práticos**:
```java
// ✓ + para poucas
String msg = "Erro " + codigo + ": " + descricao;

// ✓ StringBuilder para loop
StringBuilder html = new StringBuilder();
for (Item item : itens) {
    html.append("<li>").append(item.getNome()).append("</li>");
}

// ✓ String.join() para arrays
String csv = String.join(",", valores);

// ✓ String.format() para formatação
String preco = String.format("R$ %,.2f", valor);
```

## 🎯 Aplicabilidade

**1. + para Concatenações Simples (2-5 Strings)**:
```java
String s = a + " " + b + " " + c;
```

**2. StringBuilder para Loops**:
```java
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);
```

**3. String.join() para Arrays com Delimitador**:
```java
String.join(", ", array);
```

**4. String.format() para Formatação Complexa**:
```java
String.format("%,.2f", valor);
```

**5. StringBuffer para Multi-Threading (raro)**:
```java
StringBuffer sbf = new StringBuffer();  // thread-safe
```

## ⚠️ Armadilhas Comuns

**1. + em Loop**:
```java
for (...) {
    s = s + i;  // ❌ O(n²)
}
```

**2. Não Definir Capacidade Inicial**:
```java
new StringBuilder();  // ⚠️ Pode crescer várias vezes
new StringBuilder(tamanhoEstimado);  // ✓
```

**3. Usar StringBuffer sem Necessidade**:
```java
StringBuffer sbf = ...;  // ⚠️ Overhead desnecessário
StringBuilder sb = ...;  // ✓ Mais rápido
```

**4. String.format() para Simples Concatenação**:
```java
String.format("%s %s", a, b);  // ⚠️ Lento
a + " " + b;  // ✓ Mais rápido
```

**5. concat() para Múltiplas Strings**:
```java
s1.concat(s2).concat(s3).concat(s4);  // ⚠️ Múltiplas alocações
s1 + s2 + s3 + s4;  // ✓ Otimizado
```

## ✅ Boas Práticas

**1. Use + para Concatenações Simples**:
```java
String s = "Hello" + " " + "World";
```

**2. StringBuilder Obrigatório em Loops**:
```java
StringBuilder sb = new StringBuilder(capacidadeEstimada);
for (...) sb.append(...);
```

**3. Defina Capacidade Inicial Quando Possível**:
```java
new StringBuilder(tamanhoAproximado);
```

**4. String.join() para Arrays/Listas**:
```java
String.join(",", lista);
```

**5. String.format() Apenas Quando Formatação Necessária**:
```java
String.format("%,.2f", valor);  // Quando precisar
a + " " + b;  // Quando não precisar
```

## 📚 Resumo Executivo

**Performance de concatenação** varia drasticamente.

**Método recomendado por cenário**:
```java
// 2-5 Strings: +
"Hello" + " " + "World";  // ~50-200ns

// Loop: StringBuilder
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);  // O(n)

// Array com delimitador: String.join()
String.join(", ", array);  // ~2ms/1000 elementos

// Formatação: String.format()
String.format("%,.2f", valor);  // ~1000ns
```

**Comparação de performance**:
```java
// Loop 1000 iterações:
+ ou concat():     ~50ms    ❌ O(n²)
StringBuilder:     ~100µs   ✓ O(n) - 500x mais rápido
StringBuffer:      ~150µs   ⚠️ O(n) - thread-safe overhead
String.join():     ~2ms     ✓ O(n) - para arrays/listas
```

**Uso de memória**:
```java
// + em loop: 99% garbage
// StringBuilder: <1% garbage
```

**Regras de ouro**:
- ✓ **+** para 2-5 Strings (rápido e legível)
- ✓ **StringBuilder** para loops (essencial)
- ✓ **String.join()** para arrays com delimitador
- ✓ **String.format()** para formatação complexa
- ❌ **NUNCA + ou concat() em loops** (O(n²))

**Capacidade inicial**:
```java
new StringBuilder(tamanhoEstimado);  // 2x mais rápido
```

**Recomendação**: Escolha ferramenta certa - **+** para simples, **StringBuilder** para loops, **join()** para arrays, **format()** para formatação.