# concat() - Concatenação de Strings

## 🎯 Introdução e Definição

**concat()** concatena (une) duas Strings. Como Strings são imutáveis, retorna uma **nova String** com o conteúdo combinado.

**Conceito central**: É um **método de instância** que adiciona outra String ao final da atual. Embora menos usado que o operador `+`, oferece comportamento específico e pode ser útil em situações particulares.

**Exemplo fundamental**:
```java
String s1 = "Hello";
String s2 = " World";

// concat() - adiciona s2 ao final de s1
String resultado = s1.concat(s2);
System.out.println(resultado);  // "Hello World"

// Original não muda
System.out.println(s1);  // "Hello"
System.out.println(s2);  // " World"

// vs operador +
String resultado2 = s1 + s2;  // "Hello World" (mesmo resultado)
```

**Diferenças principais**:
- **concat()**: método de instância, NullPointerException se parâmetro null
- **Operador +**: sintaxe nativa, trata null como "null", usa StringBuilder internamente (Java 9+)
- **StringBuilder**: mais eficiente para múltiplas concatenações

## 📋 Fundamentos Teóricos

### 1️⃣ Assinatura e Comportamento Básico

**Concatena String ao final**:

```java
String s1 = "Java";
String s2 = "Script";

String resultado = s1.concat(s2);
System.out.println(resultado);  // "JavaScript"

// Encadeamento
String resultado2 = "A".concat("B").concat("C");
// "ABC"

// String vazia
String resultado3 = "Hello".concat("");
// "Hello" (sem mudança)

String resultado4 = "".concat("World");
// "World"
```

**Assinatura**:
```java
public String concat(String str)

// str: String a ser concatenada ao final
// Retorna: nova String = this + str
// Lança: NullPointerException se str for null
```

**Implementação conceitual**:
```java
public String concat(String str) {
    if (str == null) {
        throw new NullPointerException("str is null");
    }
    
    int len = str.length();
    
    if (len == 0) {
        return this;  // Otimização: retorna mesma String se str vazia
    }
    
    // Criar novo array com tamanho combinado
    char[] result = new char[this.length() + len];
    
    // Copiar this
    this.getChars(0, this.length(), result, 0);
    
    // Copiar str
    str.getChars(0, len, result, this.length());
    
    return new String(result);
}
```

### 2️⃣ Comparação com Operador +

**concat() vs + - Sintaxe**:

```java
String s1 = "Hello";
String s2 = " World";

// concat()
String r1 = s1.concat(s2);  // "Hello World"

// Operador +
String r2 = s1 + s2;  // "Hello World"

// Resultado idêntico
System.out.println(r1.equals(r2));  // true
```

**Diferença com null**:
```java
String s1 = "Hello";
String s2 = null;

// concat() - NullPointerException
try {
    String r1 = s1.concat(s2);  // ❌ NPE
} catch (NullPointerException e) {
    System.err.println("concat() não aceita null");
}

// Operador + - converte null para "null"
String r2 = s1 + s2;  // "Hellonull"

// + é mais tolerante com null
```

**Diferença com tipos primitivos**:
```java
String s = "Total: ";
int numero = 42;

// concat() - ❌ Erro de compilação (só aceita String)
// String r1 = s.concat(numero);  // Não compila

// Operador + - funciona (conversão automática)
String r2 = s + numero;  // "Total: 42"

// + converte primitivos automaticamente
```

### 3️⃣ Performance: concat() vs + vs StringBuilder

**Concatenação simples (2 Strings)**:

```java
String s1 = "Hello";
String s2 = " World";

// concat() - ~50 nanossegundos
long inicio = System.nanoTime();
String r1 = s1.concat(s2);
long tempo1 = System.nanoTime() - inicio;

// Operador + - ~50 nanossegundos (similar)
inicio = System.nanoTime();
String r2 = s1 + s2;
long tempo2 = System.nanoTime() - inicio;

// StringBuilder - ~100 nanossegundos (overhead de criação)
inicio = System.nanoTime();
String r3 = new StringBuilder(s1).append(s2).toString();
long tempo3 = System.nanoTime() - inicio;

// Para 2 Strings, concat() e + são equivalentes
// StringBuilder tem overhead de criação
```

**Múltiplas concatenações**:
```java
String[] palavras = {"a", "b", "c", "d", "e"};

// concat() encadeado - ~500 nanossegundos
long inicio = System.nanoTime();
String r1 = palavras[0].concat(palavras[1]).concat(palavras[2])
                       .concat(palavras[3]).concat(palavras[4]);
long tempo1 = System.nanoTime() - inicio;

// Operador + múltiplo - ~200 nanossegundos (usa StringBuilder internamente)
inicio = System.nanoTime();
String r2 = palavras[0] + palavras[1] + palavras[2] + palavras[3] + palavras[4];
long tempo2 = System.nanoTime() - inicio;

// StringBuilder explícito - ~150 nanossegundos (mais eficiente)
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (String p : palavras) {
    sb.append(p);
}
String r3 = sb.toString();
long tempo3 = System.nanoTime() - inicio;

// Para múltiplas concatenações: StringBuilder > + > concat()
```

**Loop com concatenações**:
```java
// ❌ PÉSSIMO - concat() em loop
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado = resultado.concat(String.valueOf(i));  // ~10ms
}

// ⚠️ RUIM - + em loop (cria StringBuilder a cada iteração)
String resultado2 = "";
for (int i = 0; i < 1000; i++) {
    resultado2 = resultado2 + i;  // ~5ms
}

// ✓ BOM - StringBuilder explícito
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);  // ~100µs (100x mais rápido!)
}
String resultado3 = sb.toString();

// StringBuilder é ESSENCIAL em loops
```

### 4️⃣ Otimizações da JVM

**String vazia não aloca**:

```java
String s = "Hello";

String r = s.concat("");

// JVM pode retornar mesma instância (otimização)
System.out.println(s == r);  // true (sem alocação)

// Se str.length() == 0, retorna this
```

**Operador + usa StringBuilder (Java 9+)**:
```java
String s1 = "A";
String s2 = "B";
String s3 = "C";

// Código fonte
String resultado = s1 + s2 + s3;

// Compilado em Java 9+ usa invokedynamic + StringConcatFactory
// Muito eficiente, próximo de StringBuilder manual

// Java 8 e anteriores compilavam para:
// new StringBuilder().append(s1).append(s2).append(s3).toString()
```

### 5️⃣ Encadeamento de concat()

**Múltiplas chamadas encadeadas**:

```java
String resultado = "A".concat("B").concat("C").concat("D");
// "ABCD"

// Funciona porque concat() retorna String
// Que tem método concat(), permitindo encadear

// Equivalente a:
String temp1 = "A".concat("B");      // "AB"
String temp2 = temp1.concat("C");    // "ABC"
String resultado = temp2.concat("D"); // "ABCD"

// Cria 3 Strings intermediárias (ineficiente)
```

**Problema de performance**:
```java
// ❌ Ineficiente - múltiplas alocações
String s = "A".concat("B").concat("C").concat("D").concat("E");

// Cria Strings intermediárias:
// "AB", "ABC", "ABCD", "ABCDE"
// Total: 4 Strings temporárias + 1 final = 5 alocações

// ✓ Mais eficiente
String s2 = String.join("", "A", "B", "C", "D", "E");
// Ou StringBuilder
```

### 6️⃣ Null Safety

**Parâmetro null lança NPE**:

```java
String s = "Hello";

// ❌ NullPointerException
String resultado = s.concat(null);  // NPE

// ✓ Verificar null
String outro = obterString();
if (outro != null) {
    String resultado = s.concat(outro);
}

// ✓ Ou usar operador +
String resultado2 = s + outro;  // "Hellonull" se outro for null
```

**Chamar concat() em null lança NPE**:
```java
String s = null;

// ❌ NullPointerException
String resultado = s.concat("World");  // NPE

// ✓ Verificar null
if (s != null) {
    String resultado = s.concat("World");
}
```

**Helper null-safe**:
```java
public static String concatSafe(String s1, String s2) {
    if (s1 == null) s1 = "";
    if (s2 == null) s2 = "";
    return s1.concat(s2);
}

// Uso
String resultado = concatSafe("Hello", null);  // "Hello"
String resultado2 = concatSafe(null, "World"); // "World"
String resultado3 = concatSafe(null, null);    // ""
```

### 7️⃣ Casos de Uso

**Concatenação simples de 2 Strings**:

```java
String prefixo = "Sr. ";
String nome = "Silva";

String nomeCompleto = prefixo.concat(nome);
// "Sr. Silva"

// Mais legível que:
String nomeCompleto2 = new StringBuilder(prefixo).append(nome).toString();
```

**Adicionar extensão a arquivo**:
```java
String nomeArquivo = "documento";
String extensao = ".pdf";

String nomeCompleto = nomeArquivo.concat(extensao);
// "documento.pdf"

// vs operador +
String nomeCompleto2 = nomeArquivo + extensao;  // Mais comum
```

**Construir URL/Path**:
```java
String baseUrl = "https://example.com";
String endpoint = "/api/users";

String url = baseUrl.concat(endpoint);
// "https://example.com/api/users"

// Mas String.join() ou Path são melhores para múltiplos segmentos
```

### 8️⃣ Quando NÃO Usar concat()

**Loops - use StringBuilder**:

```java
// ❌ NUNCA fazer isso
String resultado = "";
for (int i = 0; i < 100; i++) {
    resultado = resultado.concat(String.valueOf(i));
}

// ✓ Use StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 100; i++) {
    sb.append(i);
}
String resultado = sb.toString();
```

**Múltiplas concatenações - use + ou StringBuilder**:
```java
// ❌ Verboso e ineficiente
String s = "A".concat("B").concat("C").concat("D").concat("E");

// ✓ Mais legível
String s2 = "A" + "B" + "C" + "D" + "E";

// ✓ Ou String.join()
String s3 = String.join("", "A", "B", "C", "D", "E");
```

**Concatenar com null - use +**:
```java
String s1 = "Value: ";
String s2 = null;

// ❌ NPE
String resultado = s1.concat(s2);

// ✓ Converte null para "null"
String resultado2 = s1 + s2;  // "Value: null"
```

### 9️⃣ Alternativas Recomendadas

**Para 2 Strings: + é mais idiomático**:

```java
String s1 = "Hello";
String s2 = " World";

// concat() - funciona mas menos comum
String r1 = s1.concat(s2);

// + - mais idiomático em Java
String r2 = s1 + s2;

// Performance similar, + é preferível
```

**Para múltiplas: StringBuilder**:
```java
// concat() encadeado
String r1 = "A".concat("B").concat("C").concat("D");

// StringBuilder - mais eficiente
StringBuilder sb = new StringBuilder();
sb.append("A").append("B").append("C").append("D");
String r2 = sb.toString();

// Ou operador + (Java 9+ otimiza)
String r3 = "A" + "B" + "C" + "D";
```

**Para unir array/lista: String.join()**:
```java
String[] partes = {"A", "B", "C", "D"};

// concat() - ❌ Não funciona com array
// Precisa de loop manual

// String.join() - ✓ Direto
String resultado = String.join("", partes);  // "ABCD"
```

### 🔟 Complexidade e Performance

**Complexidade temporal**:

```java
// concat(str)
// Tempo: O(n + m) onde n = this.length(), m = str.length()
// Espaço: O(n + m) - nova String alocada

String s1 = "A".repeat(1000);  // 1000 chars
String s2 = "B".repeat(1000);  // 1000 chars

long inicio = System.nanoTime();
String resultado = s1.concat(s2);  // 2000 chars
long tempo = System.nanoTime() - inicio;
// ~10 microssegundos (copia 2000 chars)
```

**Comparação de alocações**:
```java
String s1 = "Hello";
String s2 = " World";
String s3 = "!";

// concat() encadeado - 2 alocações
String r1 = s1.concat(s2).concat(s3);
// Aloca "Hello World" (temp) + "Hello World!" (final) = 2 Strings

// Operador + (Java 9+) - 1 alocação
String r2 = s1 + s2 + s3;
// Usa StringConcatFactory - aloca apenas resultado final = 1 String

// StringBuilder - 1 alocação (+ array interno)
StringBuilder sb = new StringBuilder();
sb.append(s1).append(s2).append(s3);
String r3 = sb.toString();
// Aloca apenas resultado final = 1 String
```

## 🎯 Aplicabilidade

**1. Concatenação Simples de 2 Strings**:
```java
String nomeCompleto = prefixo.concat(nome);
```

**2. Adicionar Sufixo/Prefixo**:
```java
String arquivo = nome.concat(".txt");
```

**3. Encadeamento Ocasional**:
```java
String url = base.concat("/api").concat("/users");
```

**4. Quando NPE com null é Desejado**:
```java
// Validar que parâmetro não é null
String resultado = s.concat(parametro);  // NPE se parametro null
```

**5. Código Legado**:
```java
// Manter compatibilidade com código existente
```

## ⚠️ Armadilhas Comuns

**1. NullPointerException**:
```java
s.concat(null);  // ❌ NPE
```

**2. Usar em Loops**:
```java
for (int i = 0; i < 100; i++) {
    s = s.concat(String.valueOf(i));  // ❌ Extremamente ineficiente
}
```

**3. Múltiplas Concatenações Encadeadas**:
```java
"A".concat("B").concat("C").concat("D");  // ⚠️ Múltiplas alocações
"A" + "B" + "C" + "D";  // ✓ Mais eficiente (Java 9+)
```

**4. Esperar Conversão de Tipos**:
```java
s.concat(42);  // ❌ Erro de compilação
s + 42;        // ✓ Funciona
```

**5. Assumir Null é Convertido**:
```java
s.concat(null);  // ❌ NPE
s + null;        // ✓ "snull"
```

## ✅ Boas Práticas

**1. Prefira Operador + para Legibilidade**:
```java
String s = s1 + s2;  // Mais idiomático que s1.concat(s2)
```

**2. Use StringBuilder em Loops**:
```java
StringBuilder sb = new StringBuilder();
for (...) {
    sb.append(...);
}
String resultado = sb.toString();
```

**3. Valide Null se Necessário**:
```java
if (str != null) {
    resultado = s.concat(str);
}
```

**4. Use String.join() para Arrays/Listas**:
```java
String.join("", array);  // Melhor que concat() manual
```

**5. Evite Encadeamento Longo**:
```java
// ❌ Múltiplas alocações
s1.concat(s2).concat(s3).concat(s4);

// ✓ Mais eficiente
s1 + s2 + s3 + s4;
```

## 📚 Resumo Executivo

**concat()** concatena duas Strings.

**Assinatura**:
```java
String concat(String str)
```

**Uso básico**:
```java
"Hello".concat(" World");  // "Hello World"

// Encadeamento
"A".concat("B").concat("C");  // "ABC"

// String vazia
"Hello".concat("");  // "Hello"
```

**vs Operador +**:
```java
// concat()
s1.concat(s2);  // NPE se s2 null

// Operador +
s1 + s2;  // "s1null" se s2 null, funciona com primitivos
```

**Performance**:
```java
// 2 Strings - similar
s1.concat(s2);  // ~50ns
s1 + s2;        // ~50ns

// Múltiplas - + é melhor (Java 9+)
s1 + s2 + s3;  // ~100ns
s1.concat(s2).concat(s3);  // ~200ns (múltiplas alocações)

// Loops - StringBuilder essencial
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);  // ~10µs para 100 iterações
```

**Null safety**:
```java
s.concat(null);  // ❌ NullPointerException
s + null;        // ✓ "snull"
```

**Quando usar**:
- Concatenação simples de 2 Strings
- Quando NPE com null é desejado
- Código legado/compatibilidade

**Quando NÃO usar**:
- ❌ Loops (use StringBuilder)
- ❌ Múltiplas concatenações (use + ou StringBuilder)
- ❌ Com null (use +)
- ❌ Com primitivos (use +)

**Recomendação**: Prefira **operador +** para legibilidade e **StringBuilder** para performance em loops. concat() tem poucos casos de uso práticos no Java moderno.