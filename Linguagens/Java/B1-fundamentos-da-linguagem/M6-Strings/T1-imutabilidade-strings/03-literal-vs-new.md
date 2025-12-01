# Criação de Strings: Literal vs new

## 🎯 Introdução e Definição

Em Java, existem **duas formas principais** de criar Strings: usando **literais** (`"texto"`) ou usando o **construtor** (`new String()`). Cada forma tem comportamento e implicações de memória diferentes.

**Conceito central**: literais usam **String Pool**, construtor `new` cria objetos na **heap**.

**Comparação fundamental**:
```java
// LITERAL - usa String Pool
String s1 = "Java";

// CONSTRUTOR - cria objeto na heap
String s2 = new String("Java");

System.out.println(s1 == s2);  // false (objetos diferentes)
System.out.println(s1.equals(s2));  // true (conteúdo igual)
```

**Diferença de memória**:
```
Literal:
String Pool: "Java" ← s1
(1 objeto)

Construtor:
String Pool: "Java" (literal dentro de new)
Heap: "Java" ← s2 (novo objeto)
(2 objetos!)
```

## 📋 Fundamentos Teóricos

### 1️⃣ String Literal

**Forma mais comum e recomendada**:

```java
String nome = "João";
String linguagem = "Java";
String versao = "17";
```

**Características**:
- ✓ Armazenada no **String Pool**
- ✓ **Reutilizada** se já existir
- ✓ **Mais eficiente** (memória e performance)
- ✓ **Imutável** (como todas as Strings)

**Exemplo de reutilização**:
```java
String s1 = "Hello";
String s2 = "Hello";
String s3 = "Hello";

// Todas apontam para MESMA instância no pool
System.out.println(s1 == s2);  // true
System.out.println(s2 == s3);  // true
System.out.println(s1 == s3);  // true
```

**Memória**:
```
String Pool:
┌─────────┐
│ "Hello" │ ← s1, s2, s3 (todas aqui)
└─────────┘
```

### 2️⃣ Construtor new String()

**Cria NOVO objeto na heap**:

```java
String s1 = new String("Java");
String s2 = new String("Java");

System.out.println(s1 == s2);  // false (objetos diferentes)
```

**Características**:
- ✗ Cria objeto na **heap** (não no pool)
- ✗ **Não reutiliza** instâncias existentes
- ✗ **Menos eficiente** (cria objetos extras)
- ✓ **Imutável** (como todas as Strings)

**Memória**:
```
String Pool:
┌────────┐
│ "Java" │ (literal usado no construtor)
└────────┘

Heap:
┌────────┐
│ "Java" │ ← s1 (novo objeto)
└────────┘

┌────────┐
│ "Java" │ ← s2 (outro novo objeto)
└────────┘
```

**Cria DOIS objetos**:
```java
String s = new String("Java");
// 1. "Java" literal (no pool)
// 2. novo objeto String (na heap)
```

### 3️⃣ Comparação de Referências (==)

**Literal - `==` funciona**:

```java
String s1 = "Java";
String s2 = "Java";

if (s1 == s2) {  // ✓ true - mesma referência
    System.out.println("Mesma instância");
}
```

**new String() - `==` NÃO funciona**:

```java
String s1 = new String("Java");
String s2 = new String("Java");

if (s1 == s2) {  // ✗ false - referências diferentes
    System.out.println("Nunca executa");
}
```

**Misturado**:
```java
String s1 = "Java";
String s2 = new String("Java");

System.out.println(s1 == s2);  // false (pool vs heap)
System.out.println(s1.equals(s2));  // true (conteúdo igual)
```

### 4️⃣ Performance

**Literal É mais rápido**:

```java
// Benchmark simplificado
long start = System.nanoTime();

for (int i = 0; i < 1_000_000; i++) {
    String s = "Java";  // Lookup no pool (rápido)
}

long end = System.nanoTime();
System.out.println("Literal: " + (end - start) / 1_000_000 + "ms");
// ~10-20ms
```

**new String() é mais lento**:

```java
long start = System.nanoTime();

for (int i = 0; i < 1_000_000; i++) {
    String s = new String("Java");  // Cria objeto (lento)
}

long end = System.nanoTime();
System.out.println("new: " + (end - start) / 1_000_000 + "ms");
// ~50-100ms (5x mais lento)
```

**Razões**:
- Literal: lookup em tabela hash (pool)
- new: aloca memória, copia caracteres, inicializa objeto

### 5️⃣ Uso de Memória

**Literal - econômico**:

```java
String s1 = "Java";
String s2 = "Java";
String s3 = "Java";

// Memória: 1 String + 3 referências (~60 bytes)
```

**new String() - desperdiça memória**:

```java
String s1 = new String("Java");
String s2 = new String("Java");
String s3 = new String("Java");

// Memória: 4 Strings (literal + 3 heap) + 3 referências (~200 bytes)
```

**Diferença em aplicação real**:
```java
// ❌ Desperdiça ~100KB
for (int i = 0; i < 1000; i++) {
    list.add(new String("constante"));
}

// ✓ Usa ~50 bytes
for (int i = 0; i < 1000; i++) {
    list.add("constante");  // Todas referenciam mesma String
}
```

### 6️⃣ Construtores de String

**Principais construtores**:

**1. String vazia**:
```java
String s1 = new String();  // ""
String s2 = "";            // ✓ Preferível (usa pool)
```

**2. A partir de String**:
```java
String original = "Java";
String copia = new String(original);  // ❌ Desnecessário

// ✓ Correto
String copia = original;  // String é imutável, pode compartilhar
```

**3. A partir de char[]**:
```java
char[] chars = {'J', 'a', 'v', 'a'};
String s = new String(chars);  // "Java"
// Útil quando tem char array
```

**4. A partir de byte[]**:
```java
byte[] bytes = {74, 97, 118, 97};  // J=74, a=97, v=118, a=97
String s = new String(bytes);  // "Java"
// Útil para dados binários
```

**5. Substring de char[]**:
```java
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String s = new String(chars, 1, 3);  // "ell" (offset=1, length=3)
```

### 7️⃣ Quando Usar new String()

**Raramente necessário**. Casos válidos:

**1. Copiar char[] ou byte[]**:
```java
char[] senha = lerSenha();
String s = new String(senha);
// Depois limpar array
Arrays.fill(senha, '\0');
```

**2. Especificar charset**:
```java
byte[] data = lerDados();
String s = new String(data, StandardCharsets.UTF_8);
```

**3. Criar String não-poolada intencionalmente**:
```java
// Evitar retenção de grandes Strings
String grande = lerArquivoGrande();
String pequena = new String(grande.substring(0, 10));
// 'grande' pode ser GC, 'pequena' não retém referência
```

**⚠️ Mas geralmente**:
```java
// ❌ Evite
String s = new String("literal");

// ✓ Prefira
String s = "literal";
```

### 8️⃣ intern() - Converter Heap → Pool

**Adicionar String ao pool**:

```java
String s1 = new String("Java");  // Heap
String s2 = s1.intern();         // Pool
String s3 = "Java";              // Pool

System.out.println(s1 == s2);  // false (heap vs pool)
System.out.println(s2 == s3);  // true (ambos do pool)
```

**Uso prático**:
```java
String input = scanner.nextLine();  // String da heap

// Se vai comparar muito
if (input.intern() == "admin") {
    // Funciona porque intern() retorna versão do pool
}

// Ou armazenar versão do pool
String normalizado = input.trim().toLowerCase().intern();
```

### 9️⃣ Concatenação Literal vs Runtime

**Compile-time (literal)**:

```java
String s1 = "Java" + " " + "17";  // → "Java 17" no pool
String s2 = "Java 17";            // Pool

System.out.println(s1 == s2);  // true
```

**Runtime (new)**:

```java
String java = "Java";
String s1 = java + " 17";  // Runtime - heap
String s2 = "Java 17";     // Pool

System.out.println(s1 == s2);  // false
```

**final permite otimização**:
```java
final String LANG = "Java";
String s1 = LANG + " 17";  // Pode ser otimizado
String s2 = "Java 17";

// Pode ser true (depende do compilador)
System.out.println(s1 == s2);
```

### 🔟 Empty String

**String vazia**:

```java
// ✓ Preferível - usa pool
String s1 = "";

// ✗ Evite - cria objeto desnecessário
String s2 = new String();

// Comparação
System.out.println(s1 == s2);  // false
System.out.println(s1.equals(s2));  // true
System.out.println(s1.isEmpty());  // true
System.out.println(s2.isEmpty());  // true
```

**Constante `String.EMPTY`** (não existe, mas padrão comum):
```java
// Padrão recomendado
public static final String EMPTY = "";

// Uso
if (texto.equals(EMPTY)) { }
if (texto.isEmpty()) { }  // ✓ Melhor
```

## 🎯 Aplicabilidade

**1. Literais para Strings Constantes**:
```java
public static final String STATUS_ATIVO = "ATIVO";
public static final String STATUS_INATIVO = "INATIVO";
```

**2. Literais para Comparações Frequentes**:
```java
if (tipo == "admin") {  // Rápido com pool
    // Acesso administrativo
}
```

**3. Construtor para char[] ou byte[]**:
```java
char[] caracteres = lerCaracteres();
String texto = new String(caracteres);
```

**4. Construtor com Charset**:
```java
byte[] dados = lerDados();
String texto = new String(dados, StandardCharsets.UTF_8);
```

**5. intern() para Deduplicação**:
```java
Set<String> palavrasUnicas = new HashSet<>();
for (String palavra : palavras) {
    palavrasUnicas.add(palavra.intern());
}
```

## ⚠️ Armadilhas Comuns

**1. Usar new String() Sem Necessidade**:
```java
// ❌ Desperdiça memória
String nome = new String("João");

// ✓ Correto
String nome = "João";
```

**2. Confiar em == com new String()**:
```java
String s1 = new String("admin");
if (s1 == "admin") {  // ❌ false
    // Nunca executa
}

// ✓ Correto
if (s1.equals("admin")) { }
```

**3. Criar Cópia Desnecessária**:
```java
String original = "Java";
String copia = new String(original);  // ❌ Desnecessário

// ✓ String é imutável, pode compartilhar
String copia = original;
```

**4. Assumir Que Concatenação Usa Pool**:
```java
String s = "Ja" + "va";  // ✓ Pool (compile-time)

String a = "Ja";
String s2 = a + "va";    // ✗ Heap (runtime)
```

**5. Memory Overhead**:
```java
// ❌ 10.000 objetos desnecessários
for (int i = 0; i < 10000; i++) {
    cache.put(i, new String("constante"));
}

// ✓ 1 String compartilhada
String constante = "constante";
for (int i = 0; i < 10000; i++) {
    cache.put(i, constante);
}
```

## ✅ Boas Práticas

**1. Sempre Prefira Literais**:
```java
// ✓ Correto
String nome = "João";
String tipo = "admin";
String vazio = "";

// ✗ Evite
String nome = new String("João");
```

**2. Use equals() para Comparação**:
```java
// ✓ Sempre funciona
if (s1.equals(s2)) { }

// ✗ Arriscado
if (s1 == s2) { }  // Só confiável com literais
```

**3. Use Construtor Apenas Quando Necessário**:
```java
// ✓ Casos válidos
String fromChars = new String(charArray);
String fromBytes = new String(byteArray, charset);
```

**4. intern() com Moderação**:
```java
// ✓ Strings repetidas
String normalizado = input.trim().toLowerCase().intern();

// ✗ Strings únicas
String id = UUID.randomUUID().toString().intern();  // Sem benefício
```

**5. Constantes como Literais**:
```java
public static final String API_URL = "https://api.exemplo.com";
// No pool, econômico, comparação rápida
```

**6. Evite String Vazia com new**:
```java
// ✓ Correto
String s = "";
if (s.isEmpty()) { }

// ✗ Evite
String s = new String();
```

## 📚 Resumo Executivo

**Duas formas de criar String**:

**1. Literal** (recomendado):
```java
String s = "Java";
// - No String Pool
// - Reutilizado se existir
// - Comparação com == funciona
// - Mais eficiente
```

**2. Construtor** (raramente necessário):
```java
String s = new String("Java");
// - Na heap
// - Sempre cria novo objeto
// - Comparação com == não funciona
// - Menos eficiente
// - Cria 2 objetos (literal + heap)
```

**Comparação**:
```java
String s1 = "Java";           // Pool
String s2 = "Java";           // Pool (reutiliza)
String s3 = new String("Java"); // Heap

System.out.println(s1 == s2);  // true (mesma instância)
System.out.println(s1 == s3);  // false (pool vs heap)
System.out.println(s1.equals(s3));  // true (conteúdo igual)
```

**Quando usar new String()**:
- ✓ Criar de `char[]` ou `byte[]`
- ✓ Especificar charset
- ✗ Com literal (desperdiça memória)

**intern()** - converter heap → pool:
```java
String heap = new String("Java");
String pool = heap.intern();  // Retorna versão do pool

String literal = "Java";
System.out.println(pool == literal);  // true
```

**Regra de ouro**: use **literais** (`"texto"`), evite **new String("texto")**.

**Performance**: literal ~5x mais rápido, usa ~50% menos memória.

**Comparação**: sempre use **equals()**, não **==** (exceto com literais garantidos).
