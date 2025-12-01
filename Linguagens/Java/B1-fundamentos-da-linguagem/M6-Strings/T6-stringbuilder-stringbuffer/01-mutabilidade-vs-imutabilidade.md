# Mutabilidade vs Imutabilidade

## 🎯 Introdução e Definição

**Mutabilidade** refere-se à capacidade de um objeto ter seu **estado interno modificado** após a criação. **Imutabilidade** significa que o objeto **não pode ser alterado** após criado - qualquer "modificação" resulta em um **novo objeto**.

**Conceito central**: String é **imutável** - toda operação que parece modificar uma String na verdade cria uma **nova String**. StringBuilder e StringBuffer são **mutáveis** - modificam o **array de caracteres interno** sem criar novos objetos, resultando em **performance muito superior** para múltiplas modificações.

**Exemplo fundamental**:
```java
// String - IMUTÁVEL
String s = "Hello";
s.concat(" World");  // Cria NOVA String, mas s não muda
System.out.println(s);  // "Hello" (original inalterado)

s = s.concat(" World");  // Precisa reatribuir
System.out.println(s);  // "Hello World"

// StringBuilder - MUTÁVEL
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");  // Modifica array interno
System.out.println(sb);  // "Hello World" (objeto modificado)

// Diferença crucial: String cria novo objeto, StringBuilder modifica existente
```

**Características principais**:
- **String imutável**: segurança, compartilhamento, String pool, thread-safe
- **StringBuilder/Buffer mutáveis**: performance, modificações in-place, menor garbage
- **Trade-off**: segurança vs performance
- **Escolha**: String para valores fixos, StringBuilder para construção/modificação

## 📋 Fundamentos Teóricos

### 1️⃣ Imutabilidade de String

**Estado interno não muda**:

```java
public final class String {
    private final char[] value;  // Array FINAL - não pode ser mudado
    private int hash;  // Cache do hashCode
    
    // Construtor
    public String(String original) {
        this.value = original.value;  // Compartilha array (seguro pois imutável)
    }
    
    // Métodos retornam NOVAS Strings
    public String concat(String str) {
        // Cria NOVO array
        char[] buf = new char[this.value.length + str.value.length];
        // Copia this
        System.arraycopy(this.value, 0, buf, 0, this.value.length);
        // Copia str
        System.arraycopy(str.value, 0, buf, this.value.length, str.value.length);
        // Retorna NOVA String
        return new String(buf);
    }
}
```

**Demonstração de imutabilidade**:
```java
String original = "Java";
String modificada = original.toUpperCase();

System.out.println(original);    // "Java" (NÃO mudou)
System.out.println(modificada);  // "JAVA" (nova String)

System.out.println(original == modificada);  // false (objetos diferentes)

// Cada operação cria novo objeto
String s = "A";
String s1 = s.concat("B");  // Nova String "AB"
String s2 = s1.concat("C"); // Nova String "ABC"
String s3 = s2.concat("D"); // Nova String "ABCD"

// s, s1, s2, s3 são objetos diferentes
System.out.println(s);   // "A"
System.out.println(s1);  // "AB"
System.out.println(s2);  // "ABC"
System.out.println(s3);  // "ABCD"
```

**Consequências da imutabilidade**:
```java
// ❌ Múltiplas modificações - MUITO ineficiente
String s = "Hello";
s = s + " World";     // Cria "Hello World", descarta "Hello"
s = s + "!";          // Cria "Hello World!", descarta "Hello World"
s = s.toUpperCase();  // Cria "HELLO WORLD!", descarta "Hello World!"
s = s.replace("O", "0");  // Cria "HELL0 W0RLD!", descarta "HELLO WORLD!"

// Total: 4 Strings criadas (apenas última é útil)
// 3 Strings intermediárias viraram garbage
```

### 2️⃣ Mutabilidade de StringBuilder

**Estado interno modificável**:

```java
public final class StringBuilder {
    char[] value;  // Array NÃO-FINAL - pode ser substituído
    int count;     // Quantidade de caracteres usados
    
    public StringBuilder() {
        value = new char[16];  // Capacidade inicial padrão
        count = 0;
    }
    
    // Modifica array interno
    public StringBuilder append(String str) {
        int len = str.length();
        ensureCapacityInternal(count + len);  // Garante espaço
        str.getChars(0, len, value, count);   // Copia para array interno
        count += len;  // Atualiza contador
        return this;   // Retorna MESMO objeto (this)
    }
    
    private void ensureCapacityInternal(int minimumCapacity) {
        if (minimumCapacity - value.length > 0) {
            expandCapacity(minimumCapacity);  // Cresce array se necessário
        }
    }
}
```

**Demonstração de mutabilidade**:
```java
StringBuilder sb = new StringBuilder("Java");
System.out.println(sb);  // "Java"

sb.append(" Programming");  // Modifica MESMO objeto
System.out.println(sb);     // "Java Programming"

sb.insert(4, " 8");  // Modifica MESMO objeto
System.out.println(sb);  // "Java 8 Programming"

sb.delete(5, 7);  // Modifica MESMO objeto
System.out.println(sb);  // "Java Programming"

// Sempre o MESMO objeto StringBuilder
// Apenas conteúdo interno muda
```

**Confirmando identidade do objeto**:
```java
StringBuilder sb = new StringBuilder("Hello");
System.out.println(System.identityHashCode(sb));  // Ex: 1234567

sb.append(" World");
System.out.println(System.identityHashCode(sb));  // 1234567 (MESMO!)

sb.reverse();
System.out.println(System.identityHashCode(sb));  // 1234567 (MESMO!)

// Sempre o mesmo objeto, conteúdo diferente
```

### 3️⃣ Vantagens da Imutabilidade

**1. Thread-safety automática**:

```java
// String é thread-safe por natureza
String mensagem = "Olá";

// Múltiplas threads podem ler simultaneamente - seguro
new Thread(() -> System.out.println(mensagem)).start();
new Thread(() -> System.out.println(mensagem)).start();
new Thread(() -> System.out.println(mensagem)).start();

// Não há risco de uma thread ver estado parcial ou inconsistente
```

**2. Compartilhamento seguro**:
```java
String original = "Java";
String compartilhada = original;  // Compartilha MESMA String

// Seguro - nenhuma operação pode modificar original
compartilhada = compartilhada.toUpperCase();  // Cria NOVA String

System.out.println(original);        // "Java" (inalterado)
System.out.println(compartilhada);   // "JAVA"
```

**3. String pool (intern pool)**:
```java
// Literais compartilham mesma instância
String s1 = "Hello";
String s2 = "Hello";
System.out.println(s1 == s2);  // true (mesma instância!)

// Possível apenas porque String é imutável
// Se fosse mutável, mudar s1 afetaria s2 (perigoso)
```

**4. Hashcode confiável**:
```java
String chave = "key";
int hash1 = chave.hashCode();  // Calcula hash

Map<String, Integer> map = new HashMap<>();
map.put(chave, 100);

// Hash não pode mudar (String imutável)
int hash2 = chave.hashCode();  // MESMO hash
System.out.println(hash1 == hash2);  // true

// Seguro usar como chave em Map/Set
Integer valor = map.get(chave);  // Encontra corretamente
```

**5. Segurança**:
```java
// String pode ser compartilhada sem risco
public class Usuario {
    private final String senha;  // Imutável
    
    public Usuario(String senha) {
        this.senha = senha;  // Compartilha String
    }
    
    public String getSenha() {
        return senha;  // Retorna mesma String - seguro
        // Chamador não pode modificar (imutável)
    }
}
```

### 4️⃣ Vantagens da Mutabilidade

**1. Performance em múltiplas modificações**:

```java
// String - ineficiente
long inicio = System.nanoTime();
String s = "";
for (int i = 0; i < 1000; i++) {
    s = s + i;  // 1000 Strings criadas
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuilder - eficiente
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);  // Modifica mesmo objeto
}
String resultado = sb.toString();
long tempo2 = (System.nanoTime() - inicio) / 1_000;

System.out.println("String: " + tempo1 + "ms");       // ~50ms
System.out.println("StringBuilder: " + tempo2 + "µs"); // ~100µs
// StringBuilder 500x mais rápido!
```

**2. Menor uso de memória**:
```java
// String - múltiplas alocações
String s = "A";
s = s + "B";  // Aloca "AB", "A" vira garbage
s = s + "C";  // Aloca "ABC", "AB" vira garbage
s = s + "D";  // Aloca "ABCD", "ABC" vira garbage

// Memória total alocada: "A" + "AB" + "ABC" + "ABCD" = ~10 chars
// Memória útil: "ABCD" = 4 chars
// Garbage: 6 chars (60%)

// StringBuilder - única alocação (ou poucas)
StringBuilder sb = new StringBuilder(10);  // Aloca array[10]
sb.append("A");  // Usa array existente
sb.append("B");  // Usa array existente
sb.append("C");  // Usa array existente
sb.append("D");  // Usa array existente

// Memória total: ~10 chars
// Memória útil: 4 chars
// Overhead: 6 chars não usados (mas reutilizáveis)
// Sem garbage
```

**3. Menos pressão no Garbage Collector**:
```java
// Monitorar com -XX:+PrintGC

// String em loop - muitos GCs
for (int i = 0; i < 10000; i++) {
    s = s + i;  // Cria 10.000 Strings temporárias
}
// [GC pause (young) 512K->128K, 0.0015 secs]
// [GC pause (young) 640K->256K, 0.0020 secs]
// ... (múltiplos GCs)

// StringBuilder - pouquíssimos GCs
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);  // Reutiliza array
}
// [GC pause (young) 64K->32K, 0.0002 secs]
// ... (muito menos GCs)
```

### 5️⃣ Desvantagens da Imutabilidade

**1. Performance ruim em múltiplas modificações**:

```java
// Concatenação em loop - O(n²)
String s = "";
for (int i = 0; i < 1000; i++) {
    s = s + i;
}
// Iteração 0: copia 0 chars
// Iteração 1: copia 1 char
// Iteração 2: copia 2 chars
// ...
// Total: 0+1+2+...+999 = 499.500 operações de cópia
// Complexidade quadrática O(n²)
```

**2. Uso excessivo de memória**:
```java
// Cada modificação cria novo objeto
String[] palavras = {"Java", "Python", "C++", "JavaScript"};
String resultado = "";
for (String palavra : palavras) {
    resultado = resultado + palavra + ", ";
}
// Strings criadas:
// ""
// "Java, "
// "Java, Python, "
// "Java, Python, C++, "
// "Java, Python, C++, JavaScript, "
// Total: 5 objetos (4 intermediários são garbage)
```

### 6️⃣ Desvantagens da Mutabilidade

**1. Não é thread-safe**:

```java
StringBuilder sb = new StringBuilder("Count: ");

// ❌ Múltiplas threads modificando - NÃO seguro
new Thread(() -> {
    for (int i = 0; i < 100; i++) {
        sb.append("A");
    }
}).start();

new Thread(() -> {
    for (int i = 0; i < 100; i++) {
        sb.append("B");
    }
}).start();

Thread.sleep(100);
System.out.println(sb.length());
// Tamanho imprevisível! (race condition)
// Pode ser < 206 (Count: + 100A + 100B)
```

**2. Não pode usar String pool**:
```java
// String usa pool
String s1 = "Hello";
String s2 = "Hello";
System.out.println(s1 == s2);  // true (mesma instância)

// StringBuilder não pode usar pool (mutável)
StringBuilder sb1 = new StringBuilder("Hello");
StringBuilder sb2 = new StringBuilder("Hello");
System.out.println(sb1 == sb2);  // false (sempre instâncias diferentes)
```

**3. Hashcode instável**:
```java
// ❌ StringBuilder NÃO deve ser chave de Map/Set
StringBuilder sb = new StringBuilder("key");
Map<StringBuilder, Integer> map = new HashMap<>();
map.put(sb, 100);

sb.append("X");  // Modifica - hashCode muda!

Integer valor = map.get(sb);  // null! (não encontra - hash diferente)
System.out.println(valor);    // null
```

**4. Compartilhamento perigoso**:
```java
StringBuilder sb = new StringBuilder("Original");
StringBuilder compartilhado = sb;  // Compartilha MESMO objeto

compartilhado.append(" Modificado");

System.out.println(sb);             // "Original Modificado" (mudou!)
System.out.println(compartilhado);  // "Original Modificado"

// Modificação afeta todas as referências
// Pode causar bugs sutis
```

### 7️⃣ Conversão Entre Imutável e Mutável

**String → StringBuilder**:

```java
String s = "Hello World";

// Construtor aceita String
StringBuilder sb = new StringBuilder(s);

// Agora pode modificar
sb.reverse();
sb.delete(0, 6);
sb.append("!");

String resultado = sb.toString();  // "dlroW!"
```

**StringBuilder → String**:
```java
StringBuilder sb = new StringBuilder();
sb.append("Java");
sb.append(" ");
sb.append("Programming");

// toString() cria String imutável
String s = sb.toString();

// s é imutável - modificações criam novas Strings
s = s.toUpperCase();  // Nova String

// sb continua mutável
sb.append(" 8");
```

**Ciclo comum**:
```java
// 1. Começar com String (imutável)
String original = "Hello";

// 2. Converter para StringBuilder para modificações
StringBuilder sb = new StringBuilder(original);

// 3. Modificar eficientemente
for (int i = 0; i < 100; i++) {
    sb.append(i).append(", ");
}

// 4. Converter de volta para String (imutável)
String resultado = sb.toString();

// Resultado é imutável - pode compartilhar com segurança
return resultado;
```

### 8️⃣ Quando Usar Cada Um

**Use String (imutável) quando**:

```java
// 1. Valor não muda
String nome = "João";
final String CONFIG_PATH = "/etc/app.conf";

// 2. Poucas concatenações (2-5)
String msg = "Erro " + codigo + ": " + descricao;

// 3. Chave de Map/Set
Map<String, Integer> cache = new HashMap<>();
cache.put("key", 42);

// 4. Compartilhamento entre threads
private static final String MENSAGEM_PADRAO = "OK";

// 5. Segurança/imutabilidade requerida
public String getSenha() {
    return this.senha;  // Seguro - não pode ser modificado
}
```

**Use StringBuilder (mutável) quando**:
```java
// 1. Loop com concatenações
StringBuilder sb = new StringBuilder();
for (Item item : itens) {
    sb.append(item.getNome()).append(", ");
}

// 2. Múltiplas modificações
StringBuilder html = new StringBuilder("<div>");
html.append("<h1>").append(titulo).append("</h1>");
html.append("<p>").append(conteudo).append("</p>");
html.append("</div>");

// 3. Construção incremental
StringBuilder sql = new StringBuilder("SELECT * FROM users WHERE ");
if (ativo) sql.append("ativo = true AND ");
if (idade != null) sql.append("idade > ").append(idade).append(" AND ");
sql.append("1=1");

// 4. Performance crítica
// StringBuilder é 100-1000x mais rápido em loops

// 5. Single-threaded
// Não precisa thread-safety
```

### 9️⃣ Comparação Visual

**Memória ao longo do tempo**:

```java
// String (imutável) - múltiplos objetos
String s = "A";      // [A]
s = s + "B";         // [A] [AB]           (A vira garbage)
s = s + "C";         // [A] [AB] [ABC]     (AB vira garbage)
s = s + "D";         // [A] [AB] [ABC] [ABCD]  (ABC vira garbage)
// Memória: 4 objetos, 3 garbage

// StringBuilder (mutável) - um objeto
StringBuilder sb = new StringBuilder("A");  // [A___]
sb.append("B");                             // [AB__]  (mesmo array)
sb.append("C");                             // [ABC_]  (mesmo array)
sb.append("D");                             // [ABCD]  (mesmo array)
// Memória: 1 objeto, 0 garbage
```

**Performance ao longo das iterações**:
```java
// String - degradação quadrática
// Iteração 1:   ~50ns
// Iteração 10:  ~500ns
// Iteração 100: ~50µs
// Iteração 1000: ~50ms
// Cresce O(n²)

// StringBuilder - linear
// Iteração 1:   ~50ns
// Iteração 10:  ~500ns
// Iteração 100: ~5µs
// Iteração 1000: ~100µs
// Cresce O(n)
```

### 🔟 Best Practices

**Escolha correta por contexto**:

```java
// ✓ String para valores simples
String nome = "João";
String mensagem = "Olá " + nome;

// ✓ StringBuilder para construção
StringBuilder sb = new StringBuilder();
for (...) {
    sb.append(...);
}

// ✓ Converter no final
String resultado = sb.toString();

// ✓ Imutável para retorno de métodos públicos
public String getNome() {
    return nome;  // String imutável - seguro
}

// ✓ Mutável para construção interna
private void construirRelatorio() {
    StringBuilder sb = new StringBuilder();
    // ... construção
    this.relatorio = sb.toString();  // Converte para imutável
}

// ❌ Não retornar StringBuilder
public StringBuilder getBuffer() {
    return this.buffer;  // ❌ Chamador pode modificar!
}

// ✓ Retornar cópia ou String
public String getConteudo() {
    return this.buffer.toString();  // ✓ Imutável
}
```

## 🎯 Aplicabilidade

**1. String para Valores Fixos**:
```java
String nome = "João";
final String CONSTANTE = "valor";
```

**2. StringBuilder para Loops**:
```java
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);
```

**3. String para Compartilhamento Thread-Safe**:
```java
private static final String MENSAGEM = "OK";
```

**4. StringBuilder para Construção Incremental**:
```java
StringBuilder html = new StringBuilder();
html.append("<div>")...
```

**5. Converter StringBuilder → String para Retorno**:
```java
return sb.toString();
```

## ⚠️ Armadilhas Comuns

**1. String em Loop**:
```java
for (...) {
    s = s + i;  // ❌ O(n²)
}
```

**2. StringBuilder como Chave de Map**:
```java
Map<StringBuilder, Integer> map = ...;  // ❌ Hash instável
```

**3. Retornar StringBuilder**:
```java
public StringBuilder getBuffer() {
    return buffer;  // ❌ Expõe mutabilidade
}
```

**4. Compartilhar StringBuilder Entre Threads**:
```java
// ❌ Não thread-safe
new Thread(() -> sb.append(...)).start();
new Thread(() -> sb.append(...)).start();
```

**5. Não Converter de Volta para String**:
```java
StringBuilder sb = ...;
return sb;  // ❌ Retorne sb.toString()
```

## ✅ Boas Práticas

**1. String para Valores Que Não Mudam**:
```java
String nome = "João";
```

**2. StringBuilder para Múltiplas Modificações**:
```java
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);
```

**3. Converter para String ao Finalizar**:
```java
String resultado = sb.toString();
```

**4. Não Compartilhar StringBuilder**:
```java
// Criar novo para cada uso
StringBuilder sb = new StringBuilder();
```

**5. String para Segurança e Thread-Safety**:
```java
public String getValor() {
    return valor;  // Imutável - seguro
}
```

## 📚 Resumo Executivo

**Imutabilidade** (String) vs **Mutabilidade** (StringBuilder).

**String - imutável**:
```java
String s = "A";
s = s + "B";  // Cria NOVA String
// Vantagens: thread-safe, compartilhamento seguro, String pool
// Desvantagens: múltiplas modificações lentas (O(n²) em loops)
```

**StringBuilder - mutável**:
```java
StringBuilder sb = new StringBuilder("A");
sb.append("B");  // Modifica MESMO objeto
// Vantagens: rápido para múltiplas modificações (O(n))
// Desvantagens: não thread-safe, sem String pool
```

**Performance**:
```java
// Loop 1000 iterações:
String +:       ~50ms   ❌ O(n²)
StringBuilder:  ~100µs  ✓ O(n) - 500x mais rápido
```

**Quando usar**:
```java
// String: valores fixos, poucas concatenações, thread-safety
String msg = "Hello " + nome;

// StringBuilder: loops, múltiplas modificações, performance
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);
String resultado = sb.toString();
```

**Conversão**:
```java
// String → StringBuilder
StringBuilder sb = new StringBuilder(string);

// StringBuilder → String
String s = sb.toString();
```

**Recomendação**: Use **String** para valores que não mudam (imutável, seguro, thread-safe). Use **StringBuilder** para construção/modificação (mutável, rápido). Converta StringBuilder para String ao finalizar.