# StringBuilder para Concatenações em Loop

## 🎯 Introdução e Definição

**StringBuilder** é uma classe **mutável** para construir Strings de forma **eficiente**. É **essencial** para concatenações em **loops** ou quando se precisa adicionar múltiplos valores sequencialmente.

**Conceito central**: Diferente de String (imutável), StringBuilder mantém um **array de caracteres interno mutável** que pode ser modificado sem criar novos objetos. Isso resulta em performance **100x a 1000x melhor** que usar `+` ou `concat()` em loops.

**Exemplo fundamental**:
```java
// ❌ PÉSSIMO - String + em loop
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado = resultado + i;  // Cria 1000 Strings temporárias
}
// Tempo: ~50ms
// Complexidade: O(n²)

// ✓ EXCELENTE - StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);  // Modifica array interno
}
String resultado = sb.toString();
// Tempo: ~100µs (500x mais rápido!)
// Complexidade: O(n)
```

**Características principais**:
- **Mutável**: modifica conteúdo interno sem criar novos objetos
- **Array dinâmico**: cresce automaticamente quando necessário
- **append()**: método principal para adicionar conteúdo
- **toString()**: converte para String imutável no final
- **Thread-unsafe**: não é thread-safe (use StringBuffer se necessário)

## 📋 Fundamentos Teóricos

### 1️⃣ Estrutura Interna

**Array de caracteres mutável**:

```java
// Simplificação da estrutura interna
public final class StringBuilder {
    char[] value;  // Array interno mutável
    int count;     // Quantidade de caracteres usados
    
    public StringBuilder() {
        value = new char[16];  // Capacidade inicial padrão
        count = 0;
    }
    
    public StringBuilder append(String str) {
        int len = str.length();
        ensureCapacity(count + len);  // Garante espaço
        str.getChars(0, len, value, count);  // Copia caracteres
        count += len;
        return this;
    }
    
    private void ensureCapacity(int minCapacity) {
        if (minCapacity > value.length) {
            expandCapacity(minCapacity);
        }
    }
    
    private void expandCapacity(int minCapacity) {
        int newCapacity = (value.length + 1) * 2;  // Dobra tamanho
        if (newCapacity < minCapacity) {
            newCapacity = minCapacity;
        }
        value = Arrays.copyOf(value, newCapacity);
    }
}
```

**Diferença vs String**:
```java
// String - imutável
String s = "Hello";
s = s + " World";  // Cria NOVA String

// StringBuilder - mutável
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");  // Modifica array interno
```

### 2️⃣ Construtores

**Capacidade inicial**:

```java
// Padrão - capacidade 16
StringBuilder sb1 = new StringBuilder();
// value = new char[16]

// Capacidade específica
StringBuilder sb2 = new StringBuilder(100);
// value = new char[100]

// A partir de String
StringBuilder sb3 = new StringBuilder("Hello");
// value = new char["Hello".length() + 16]
// count = 5

// A partir de CharSequence
StringBuilder sb4 = new StringBuilder((CharSequence)"Test");
```

**Escolher capacidade inicial**:
```java
// ⚠️ Sem capacidade - pode crescer várias vezes
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);  // Pode realocar ~13 vezes
}

// ✓ Com capacidade estimada - cresce menos
StringBuilder sb2 = new StringBuilder(50000);  // Estimativa
for (int i = 0; i < 10000; i++) {
    sb2.append(i);  // Raramente realoca
}

// Benchmark: sb2 é ~2x mais rápido
```

**Cálculo de capacidade**:
```java
// Se sabe tamanho final aproximado
int n = 1000;
int tamanhoMedio = 5;  // Caracteres por item
int capacidade = n * tamanhoMedio;
StringBuilder sb = new StringBuilder(capacidade);

// Se processando lista
List<String> itens = ...;
int capacidade = itens.size() * 20;  // 20 caracteres por item
StringBuilder sb = new StringBuilder(capacidade);
```

### 3️⃣ Método append()

**Aceita múltiplos tipos**:

```java
StringBuilder sb = new StringBuilder();

// String
sb.append("Hello");

// Primitivos
sb.append(42);         // int
sb.append(3.14);       // double
sb.append(true);       // boolean
sb.append('A');        // char
sb.append(999L);       // long
sb.append(2.5f);       // float

// Arrays
char[] chars = {'a', 'b', 'c'};
sb.append(chars);

// Object (chama toString())
Object obj = new Date();
sb.append(obj);

// CharSequence
sb.append((CharSequence)"Test");

// Resultado
String resultado = sb.toString();
```

**Retorna this - encadeamento**:
```java
// append() retorna this - permite encadeamento
StringBuilder sb = new StringBuilder();
sb.append("Hello")
  .append(" ")
  .append("World")
  .append("!")
  .append(" ")
  .append(2024);

String s = sb.toString();  // "Hello World! 2024"

// Equivalente a:
sb.append("Hello");
sb.append(" ");
sb.append("World");
sb.append("!");
sb.append(" ");
sb.append(2024);
```

**append() com offset/length**:
```java
// append(char[] str, int offset, int len)
char[] chars = {'a', 'b', 'c', 'd', 'e'};
StringBuilder sb = new StringBuilder();

sb.append(chars, 1, 3);  // Adiciona "bcd"
System.out.println(sb);  // "bcd"

// append(CharSequence s, int start, int end)
String texto = "Hello World";
StringBuilder sb2 = new StringBuilder();
sb2.append(texto, 6, 11);  // Adiciona "World"
System.out.println(sb2);   // "World"
```

### 4️⃣ Crescimento Automático

**Dobra capacidade quando necessário**:

```java
StringBuilder sb = new StringBuilder(4);  // Capacidade inicial 4
System.out.println("Capacidade: " + sb.capacity());  // 4

sb.append("Hello");  // 5 caracteres
System.out.println("Capacidade: " + sb.capacity());  // 10 (dobrou: (4+1)*2)

sb.append(" World!");  // +7 caracteres (total 12)
System.out.println("Capacidade: " + sb.capacity());  // 22 ((10+1)*2)

// Crescimento: 4 → 10 → 22 → ...
```

**Visualização de realocações**:
```java
StringBuilder sb = new StringBuilder(2);
System.out.println("Inicial: " + sb.capacity());  // 2

sb.append("a");
System.out.println("Após 'a': " + sb.capacity());  // 2

sb.append("b");
System.out.println("Após 'b': " + sb.capacity());  // 2

sb.append("c");  // Precisa crescer
System.out.println("Após 'c': " + sb.capacity());  // 6 ((2+1)*2)

sb.append("defg");  // Precisa crescer novamente
System.out.println("Após 'defg': " + sb.capacity());  // 14 ((6+1)*2)
```

**Impacto em performance**:
```java
// Muitas realocações - lento
StringBuilder sb1 = new StringBuilder(2);
for (int i = 0; i < 10000; i++) {
    sb1.append(i);  // ~15 realocações
}
// ~10ms

// Poucas realocações - rápido
StringBuilder sb2 = new StringBuilder(50000);
for (int i = 0; i < 10000; i++) {
    sb2.append(i);  // 0-1 realocações
}
// ~5ms (2x mais rápido)
```

### 5️⃣ Performance em Loops

**Comparação detalhada**:

```java
int n = 1000;

// ❌ String + - ~50ms
long inicio = System.nanoTime();
String s = "";
for (int i = 0; i < n; i++) {
    s = s + i;
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// ✓ StringBuilder - ~100µs
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append(i);
}
String resultado = sb.toString();
long tempo2 = (System.nanoTime() - inicio) / 1_000;

System.out.println("String +: " + tempo1 + "ms");       // ~50ms
System.out.println("StringBuilder: " + tempo2 + "µs");  // ~100µs
System.out.println("StringBuilder " + (tempo1 * 1000 / tempo2) + "x mais rápido");
// ~500x mais rápido!
```

**Análise de complexidade**:
```java
// String + em loop
for (int i = 0; i < n; i++) {
    s = s + i;
}
// Iteração 0: copia 0 chars + adiciona
// Iteração 1: copia 1 char + adiciona
// Iteração 2: copia 2 chars + adiciona
// ...
// Iteração n-1: copia n-1 chars + adiciona
// Total: 0+1+2+...+(n-1) = n(n-1)/2 = O(n²)

// StringBuilder
for (int i = 0; i < n; i++) {
    sb.append(i);
}
// Cada append é O(1) amortizado
// Total: n × O(1) = O(n)
```

**Escalabilidade**:
```java
// 100 iterações
// +: ~2ms
// StringBuilder: ~20µs (100x mais rápido)

// 1.000 iterações
// +: ~50ms
// StringBuilder: ~100µs (500x mais rápido)

// 10.000 iterações
// +: ~5000ms (5 segundos)
// StringBuilder: ~5ms (1000x mais rápido)

// 100.000 iterações
// +: Inviável (minutos)
// StringBuilder: ~50ms (milhões de vezes mais rápido)
```

### 6️⃣ Outros Métodos Úteis

**insert() - inserir em posição**:

```java
StringBuilder sb = new StringBuilder("Hello World");

// insert(int offset, String str)
sb.insert(6, "Beautiful ");
System.out.println(sb);  // "Hello Beautiful World"

// insert com tipos
sb.insert(0, 123);       // "123Hello Beautiful World"
sb.insert(3, true);      // "123trueHello Beautiful World"
```

**delete() e deleteCharAt()**:
```java
StringBuilder sb = new StringBuilder("Hello World");

// delete(int start, int end) - deleta range [start, end)
sb.delete(5, 11);  // Deleta " World"
System.out.println(sb);  // "Hello"

// deleteCharAt(int index)
sb.append(" World!");
sb.deleteCharAt(5);  // Deleta espaço
System.out.println(sb);  // "HelloWorld!"
```

**replace() - substituir range**:
```java
StringBuilder sb = new StringBuilder("Hello World");

// replace(int start, int end, String str)
sb.replace(6, 11, "Java");
System.out.println(sb);  // "Hello Java"
```

**reverse() - inverter**:
```java
StringBuilder sb = new StringBuilder("Hello");
sb.reverse();
System.out.println(sb);  // "olleH"
```

**setCharAt() - modificar caractere**:
```java
StringBuilder sb = new StringBuilder("Hello");
sb.setCharAt(0, 'h');  // Minúscula
System.out.println(sb);  // "hello"
```

**substring() - extrair sem modificar**:
```java
StringBuilder sb = new StringBuilder("Hello World");
String sub = sb.substring(6, 11);  // "World"
System.out.println(sb);  // "Hello World" (não modificado)
```

### 7️⃣ StringBuilder vs StringBuffer

**Diferença principal - thread-safety**:

```java
// StringBuilder - NÃO thread-safe (mais rápido)
StringBuilder sb = new StringBuilder();

// StringBuffer - thread-safe (mais lento)
StringBuffer sbf = new StringBuffer();

// Métodos sincronizados em StringBuffer
public synchronized StringBuffer append(String str) {
    // ...
}

// Métodos NÃO sincronizados em StringBuilder
public StringBuilder append(String str) {
    // ...
}
```

**Performance**:
```java
int n = 10000;

// StringBuilder - ~5ms
long inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append(i);
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuffer - ~8ms
inicio = System.nanoTime();
StringBuffer sbf = new StringBuffer();
for (int i = 0; i < n; i++) {
    sbf.append(i);
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("StringBuilder: " + tempo1 + "ms");  // ~5ms
System.out.println("StringBuffer: " + tempo2 + "ms");   // ~8ms
// StringBuffer ~60% mais lento devido a sincronização
```

**Quando usar cada um**:
```java
// ✓ StringBuilder - 99% dos casos (single-threaded)
StringBuilder sb = new StringBuilder();

// ✓ StringBuffer - apenas multi-threaded (raro)
// Várias threads modificando mesma instância
StringBuffer sbf = new StringBuffer();

// Na prática, StringBuilder quase sempre preferível
// Se precisar thread-safety, considere outras abordagens:
// - ThreadLocal<StringBuilder>
// - Concatenar em cada thread, juntar depois
```

### 8️⃣ toString() e Conversão Final

**Gerar String final**:

```java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");

// toString() cria nova String
String resultado = sb.toString();
System.out.println(resultado);  // "Hello World"

// StringBuilder não é modificado
System.out.println(sb);  // "Hello World"

// Pode reusar StringBuilder
sb.append("!");
System.out.println(sb.toString());  // "Hello World!"
```

**Internamente**:
```java
public String toString() {
    // Cria nova String com array interno
    return new String(value, 0, count);
}

// Nova String é criada - não compartilha array com StringBuilder
// StringBuilder pode continuar modificando seu array
```

**Reutilizar StringBuilder**:
```java
StringBuilder sb = new StringBuilder();

// Construir primeira String
sb.append("Hello");
String s1 = sb.toString();

// Limpar para reutilizar
sb.setLength(0);  // Reseta count para 0 (não realoca array)

// Construir segunda String
sb.append("World");
String s2 = sb.toString();

System.out.println(s1);  // "Hello"
System.out.println(s2);  // "World"
```

### 9️⃣ Padrões Comuns de Uso

**Construir lista delimitada**:

```java
List<String> itens = Arrays.asList("A", "B", "C", "D");
StringBuilder sb = new StringBuilder();

for (int i = 0; i < itens.size(); i++) {
    if (i > 0) {
        sb.append(", ");  // Delimitador
    }
    sb.append(itens.get(i));
}

String resultado = sb.toString();
System.out.println(resultado);  // "A, B, C, D"

// Ou use String.join() (mais simples)
String resultado2 = String.join(", ", itens);
```

**Construir SQL/HTML**:
```java
// SQL
StringBuilder sql = new StringBuilder();
sql.append("SELECT * FROM users WHERE ");
sql.append("active = true");
sql.append(" AND age > ").append(18);
sql.append(" ORDER BY name");
String query = sql.toString();

// HTML
StringBuilder html = new StringBuilder();
html.append("<ul>");
for (String item : itens) {
    html.append("<li>").append(item).append("</li>");
}
html.append("</ul>");
String markup = html.toString();
```

**Processamento linha por linha**:
```java
BufferedReader reader = new BufferedReader(new FileReader("file.txt"));
StringBuilder conteudo = new StringBuilder();

String linha;
while ((linha = reader.readLine()) != null) {
    conteudo.append(linha).append("\n");
}

String texto = conteudo.toString();
reader.close();
```

**Formatação condicional**:
```java
StringBuilder msg = new StringBuilder("Status: ");

if (ativo) {
    msg.append("Ativo");
} else {
    msg.append("Inativo");
}

if (premium) {
    msg.append(" (Premium)");
}

msg.append(" - ").append(nome);
String mensagem = msg.toString();
```

### 🔟 Boas Práticas e Otimizações

**Definir capacidade inicial**:

```java
// ⚠️ Sem capacidade - pode realocar várias vezes
StringBuilder sb1 = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb1.append(i);
}

// ✓ Com capacidade estimada - raramente realoca
StringBuilder sb2 = new StringBuilder(50000);
for (int i = 0; i < 10000; i++) {
    sb2.append(i);
}

// sb2 é ~2x mais rápido
```

**Encadeamento para legibilidade**:
```java
// ✓ Encadeamento
String s = new StringBuilder()
    .append("Name: ").append(nome)
    .append(", Age: ").append(idade)
    .append(", City: ").append(cidade)
    .toString();

// vs múltiplas linhas (também OK)
StringBuilder sb = new StringBuilder();
sb.append("Name: ").append(nome);
sb.append(", Age: ").append(idade);
sb.append(", City: ").append(cidade);
String s2 = sb.toString();
```

**Reutilizar quando possível**:
```java
StringBuilder sb = new StringBuilder(100);

for (String grupo : grupos) {
    sb.setLength(0);  // Limpar
    
    for (String item : grupo.getItens()) {
        sb.append(item).append(", ");
    }
    
    String resultado = sb.toString();
    processar(resultado);
}

// Evita criar novo StringBuilder a cada iteração
```

**Não concatenar Strings desnecessariamente**:
```java
// ⚠️ Concatena antes de append
sb.append("Total: " + total);  // Cria String temporária

// ✓ Append separado
sb.append("Total: ").append(total);  // Mais eficiente
```

## 🎯 Aplicabilidade

**1. Loops com Concatenação**:
```java
StringBuilder sb = new StringBuilder();
for (...) {
    sb.append(...);
}
```

**2. Construir Strings Grandes**:
```java
StringBuilder html = new StringBuilder(10000);
// Construir HTML, SQL, XML, etc.
```

**3. Processar Arquivos Linha a Linha**:
```java
while ((linha = reader.readLine()) != null) {
    sb.append(linha);
}
```

**4. Formatação Condicional**:
```java
if (condicao) sb.append(...);
```

**5. Modificações Múltiplas**:
```java
sb.append(...).insert(...).delete(...);
```

## ⚠️ Armadilhas Comuns

**1. Não Usar em Loops**:
```java
for (...) {
    s = s + i;  // ❌ Use StringBuilder
}
```

**2. Esquecer toString()**:
```java
StringBuilder sb = ...;
System.out.println(sb);  // ⚠️ Imprime referência, não conteúdo
System.out.println(sb.toString());  // ✓
```

**3. Concatenar ao append()**:
```java
sb.append("Total: " + valor);  // ⚠️ Cria String temporária
sb.append("Total: ").append(valor);  // ✓
```

**4. Não Definir Capacidade Inicial**:
```java
new StringBuilder();  // ⚠️ Pode crescer várias vezes
new StringBuilder(tamanhoEstimado);  // ✓
```

**5. Usar StringBuffer sem Necessidade**:
```java
StringBuffer sbf = ...;  // ⚠️ Overhead desnecessário
StringBuilder sb = ...;  // ✓
```

## ✅ Boas Práticas

**1. Sempre Use em Loops**:
```java
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);
```

**2. Defina Capacidade Inicial**:
```java
new StringBuilder(capacidadeEstimada);
```

**3. Encadeie append() para Legibilidade**:
```java
sb.append(...).append(...).append(...);
```

**4. Reutilize com setLength(0)**:
```java
sb.setLength(0);  // Limpar para reutilizar
```

**5. Prefira StringBuilder a StringBuffer**:
```java
StringBuilder sb = ...;  // Mais rápido
```

## 📚 Resumo Executivo

**StringBuilder** é essencial para concatenações em loop.

**Uso básico**:
```java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
String s = sb.toString();  // "Hello World"
```

**Performance**:
```java
// Loop 1000 iterações:
String +:       ~50ms    ❌ O(n²)
StringBuilder:  ~100µs   ✓ O(n) - 500x mais rápido!
```

**Capacidade inicial**:
```java
new StringBuilder(capacidadeEstimada);  // 2x mais rápido
```

**Métodos principais**:
```java
sb.append(valor);          // Adicionar
sb.insert(pos, valor);     // Inserir
sb.delete(start, end);     // Deletar
sb.replace(start, end, s); // Substituir
sb.reverse();              // Inverter
sb.toString();             // Converter para String
```

**vs StringBuffer**:
```java
StringBuilder:  ~5ms   ✓ NÃO thread-safe (mais rápido)
StringBuffer:   ~8ms   ⚠️ Thread-safe (60% mais lento)
```

**Padrões comuns**:
```java
// Lista delimitada
for (int i = 0; i < itens.size(); i++) {
    if (i > 0) sb.append(", ");
    sb.append(itens.get(i));
}

// HTML/SQL
sb.append("<tag>").append(conteudo).append("</tag>");

// Arquivo
while ((linha = reader.readLine()) != null) {
    sb.append(linha).append("\n");
}
```

**Recomendação**: Use **StringBuilder** em **TODOS os loops** com concatenação. Defina capacidade inicial quando possível. Encadeie append() para código conciso.