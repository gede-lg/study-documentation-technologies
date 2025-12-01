# Método concat() para Concatenação

## 🎯 Introdução e Definição

**concat()** é um **método de instância** da classe String que concatena outra String ao final. Como Strings são imutáveis, retorna uma **nova String** com o conteúdo combinado.

**Conceito central**: Embora menos usado que o operador `+`, concat() oferece **comportamento explícito** de concatenação e é útil em contextos específicos, especialmente quando se quer **garantir que ambos operandos são Strings**.

**Exemplo fundamental**:
```java
String s1 = "Hello";
String s2 = " World";

// concat() - método de instância
String resultado = s1.concat(s2);
System.out.println(resultado);  // "Hello World"

// Original não muda (imutabilidade)
System.out.println(s1);  // "Hello"
System.out.println(s2);  // " World"

// vs operador +
String resultado2 = s1 + s2;  // "Hello World" (mesmo resultado)
```

**Características principais**:
- **Método de instância**: `s1.concat(s2)` adiciona s2 ao final de s1
- **Aceita apenas String**: não funciona com primitivos (diferente de +)
- **NullPointerException**: lança NPE se parâmetro for null (diferente de +)
- **Performance**: similar ao + para 2 Strings, inferior para múltiplas

## 📋 Fundamentos Teóricos

### 1️⃣ Assinatura e Comportamento

**Concatena String ao final**:

```java
String s1 = "Java";
String s2 = "Script";

// concat() adiciona s2 ao final de s1
String resultado = s1.concat(s2);
System.out.println(resultado);  // "JavaScript"

// Encadeamento de chamadas
String resultado2 = "Hello".concat(" ").concat("World");
// "Hello World"

// String vazia - sem efeito
String resultado3 = "Test".concat("");
System.out.println(resultado3);  // "Test"

String resultado4 = "".concat("Test");
System.out.println(resultado4);  // "Test"
```

**Assinatura**:
```java
public String concat(String str)

// str: String a ser concatenada ao final de this
// Retorna: nova String = this + str
// Lança: NullPointerException se str for null
```

**Implementação interna**:
```java
public String concat(String str) {
    if (str == null) {
        throw new NullPointerException("str is null");
    }
    
    int len = str.length();
    
    // Otimização: se str vazia, retorna this
    if (len == 0) {
        return this;
    }
    
    // Criar novo array com tamanho combinado
    int thisLen = this.length();
    char[] result = new char[thisLen + len];
    
    // Copiar this
    this.getChars(0, thisLen, result, 0);
    
    // Copiar str
    str.getChars(0, len, result, thisLen);
    
    return new String(result);
}
```

### 2️⃣ Diferenças com Operador +

**Tabela comparativa**:

| Aspecto | concat() | Operador + |
|---------|----------|------------|
| **Tipo de parâmetro** | Apenas String | Qualquer tipo (conversão automática) |
| **Comportamento com null** | NullPointerException | Converte para "null" |
| **Sintaxe** | Método: `s1.concat(s2)` | Operador: `s1 + s2` |
| **Múltiplas concatenações** | Verboso (encadeamento) | Conciso |
| **Legibilidade** | Menos idiomático | Mais idiomático |
| **Performance** | Similar para 2 Strings | Otimizado (Java 9+) |

**Exemplo comparativo**:
```java
String s1 = "Hello";
String s2 = " World";
String s3 = "!";

// concat() - verboso
String r1 = s1.concat(s2).concat(s3);

// + - conciso
String r2 = s1 + s2 + s3;

// Ambos produzem: "Hello World!"
```

**Comportamento com null**:
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
String r2 = s1 + s2;
System.out.println(r2);  // "Hellonull"
```

**Apenas String vs conversão automática**:
```java
String s = "Total: ";
int numero = 42;

// concat() - ❌ Erro de compilação
// String r1 = s.concat(numero);  // Type mismatch

// concat() precisa converter manualmente
String r1 = s.concat(String.valueOf(numero));  // "Total: 42"

// + - conversão automática
String r2 = s + numero;  // "Total: 42" (mais simples)
```

### 3️⃣ Encadeamento de Chamadas

**Múltiplas concatenações**:

```java
// Encadear concat()
String resultado = "A".concat("B").concat("C").concat("D");
// "ABCD"

// Funciona porque concat() retorna String
// Que tem método concat(), permitindo encadear

// Equivalente a:
String temp1 = "A".concat("B");      // "AB"
String temp2 = temp1.concat("C");    // "ABC"
String resultado = temp2.concat("D"); // "ABCD"
```

**Problema de múltiplas alocações**:
```java
// Cada concat() cria nova String
String s = "A"
    .concat("B")  // Cria "AB"
    .concat("C")  // Cria "ABC"
    .concat("D")  // Cria "ABCD"
    .concat("E"); // Cria "ABCDE"

// Total: 4 Strings intermediárias + 1 final = 5 alocações

// + é mais eficiente (Java 9+ otimiza)
String s2 = "A" + "B" + "C" + "D" + "E";  // 1 alocação
```

### 4️⃣ Performance

**2 Strings - similar**:

```java
String s1 = "Hello";
String s2 = " World";

// concat() - ~50 nanossegundos
long inicio = System.nanoTime();
String r1 = s1.concat(s2);
long tempo1 = System.nanoTime() - inicio;

// + - ~50 nanossegundos
inicio = System.nanoTime();
String r2 = s1 + s2;
long tempo2 = System.nanoTime() - inicio;

// Performance similar para 2 Strings
```

**Múltiplas Strings - + é melhor**:
```java
String[] partes = {"A", "B", "C", "D", "E"};

// concat() encadeado - ~500ns
long inicio = System.nanoTime();
String r1 = partes[0].concat(partes[1]).concat(partes[2])
                     .concat(partes[3]).concat(partes[4]);
long tempo1 = System.nanoTime() - inicio;

// + - ~200ns (Java 9+ usa StringConcatFactory)
inicio = System.nanoTime();
String r2 = partes[0] + partes[1] + partes[2] + partes[3] + partes[4];
long tempo2 = System.nanoTime() - inicio;

// + é ~2.5x mais rápido
```

**Loop - ambos péssimos, use StringBuilder**:
```java
// ❌ concat() em loop - ~10ms
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado = resultado.concat(String.valueOf(i));
}

// ❌ + em loop - ~8ms
String resultado2 = "";
for (int i = 0; i < 1000; i++) {
    resultado2 = resultado2 + i;
}

// ✓ StringBuilder - ~100µs (100x mais rápido!)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String resultado3 = sb.toString();
```

### 5️⃣ Otimizações da JVM

**String vazia não aloca**:

```java
String s = "Test";

// concat("") retorna mesma instância
String r = s.concat("");
System.out.println(s == r);  // true (otimização JVM)

// Se str.length() == 0, retorna this
// Evita alocação desnecessária
```

**Teste de otimização**:
```java
String s1 = "Hello";

// String vazia - mesma instância
String r1 = s1.concat("");
System.out.println(s1 == r1);  // true

// String não-vazia - nova instância
String r2 = s1.concat(" World");
System.out.println(s1 == r2);  // false
```

### 6️⃣ Null Safety

**Parâmetro null lança NPE**:

```java
String s = "Hello";

// ❌ NullPointerException
try {
    String r = s.concat(null);  // NPE
} catch (NullPointerException e) {
    System.err.println("Parâmetro null");
}

// ✓ Verificar null
String outro = obterString();
if (outro != null) {
    String resultado = s.concat(outro);
} else {
    String resultado = s;  // Ou valor padrão
}
```

**Chamar em null também lança NPE**:
```java
String s = null;

// ❌ NullPointerException
try {
    String r = s.concat(" World");  // NPE
} catch (NullPointerException e) {
    System.err.println("String é null");
}
```

**Helper method null-safe**:
```java
public static String concatSafe(String s1, String s2) {
    if (s1 == null) s1 = "";
    if (s2 == null) s2 = "";
    return s1.concat(s2);
}

// Uso
String r1 = concatSafe("Hello", null);  // "Hello"
String r2 = concatSafe(null, "World");  // "World"
String r3 = concatSafe(null, null);     // ""
```

### 7️⃣ Quando Usar concat()

**Garantir que ambos são Strings**:

```java
// concat() força type-safety em compile-time
public String combinarStrings(String s1, String s2) {
    return s1.concat(s2);  // Garante que s2 é String
}

// + aceita qualquer tipo
public String combinar(String s1, Object s2) {
    return s1 + s2;  // s2.toString() chamado
}
```

**Validação explícita de null**:
```java
// concat() falha fast se null (NPE imediato)
String resultado = s1.concat(s2);  // NPE se s2 null

// + converte null silenciosamente
String resultado2 = s1 + s2;  // "s1null" se s2 null

// concat() pode ser preferível quando null indica erro
```

**Programação funcional/streams**:
```java
List<String> prefixos = Arrays.asList("Mr. ", "Mrs. ", "Dr. ");
String nome = "Silva";

// concat() com method reference
List<String> completos = prefixos.stream()
    .map(p -> p.concat(nome))
    .collect(Collectors.toList());
// ["Mr. Silva", "Mrs. Silva", "Dr. Silva"]

// Ou com method reference direto (não funciona com +)
// .map(String::concat)  // Precisa de currying
```

### 8️⃣ Quando NÃO Usar concat()

**❌ Loops**:

```java
// NUNCA usar concat() em loop
String resultado = "";
for (int i = 0; i < 100; i++) {
    resultado = resultado.concat(String.valueOf(i));  // Péssimo
}

// Use StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 100; i++) {
    sb.append(i);
}
String resultado = sb.toString();
```

**❌ Múltiplas concatenações**:
```java
// Verboso e ineficiente
String s = "A".concat("B").concat("C").concat("D").concat("E");

// Prefira +
String s2 = "A" + "B" + "C" + "D" + "E";

// Ou StringBuilder
StringBuilder sb = new StringBuilder();
sb.append("A").append("B").append("C").append("D").append("E");
String s3 = sb.toString();
```

**❌ Com tipos não-String**:
```java
String s = "Total: ";
int numero = 42;

// concat() precisa converter
String r = s.concat(String.valueOf(numero));  // Verboso

// + é mais simples
String r2 = s + numero;  // Idiomático
```

**❌ Quando null deve ser tratado como "null"**:
```java
String nome = null;

// concat() lança NPE
// String msg = "Nome: ".concat(nome);  // NPE

// + trata null
String msg = "Nome: " + nome;  // "Nome: null"
```

### 9️⃣ Comparação com Alternativas

**concat() vs + - Resumo**:

```java
// concat()
// ✓ Type-safe (apenas String)
// ✓ NPE explícito com null
// ✗ Verboso para múltiplas
// ✗ Não converte tipos
"Hello".concat(" World");

// +
// ✓ Conciso e idiomático
// ✓ Conversão automática
// ✓ Trata null como "null"
// ✗ Aceita qualquer tipo (menos type-safe)
"Hello" + " World";
```

**concat() vs StringBuilder**:
```java
String s1 = "A", s2 = "B", s3 = "C";

// concat() encadeado
String r1 = s1.concat(s2).concat(s3);

// StringBuilder
StringBuilder sb = new StringBuilder();
sb.append(s1).append(s2).append(s3);
String r2 = sb.toString();

// StringBuilder mais eficiente para 3+ Strings
// concat() OK para 2 Strings
```

**concat() vs String.join()**:
```java
String[] partes = {"A", "B", "C"};

// concat() - ❌ Não funciona direto com arrays
String r1 = partes[0].concat(partes[1]).concat(partes[2]);  // Manual

// String.join() - ✓ Direto
String r2 = String.join("", partes);  // "ABC"

// join() é melhor para arrays/listas
```

### 🔟 Casos de Uso Legítimos

**API que retorna String (chainable)**:

```java
class StringBuilder {
    private String value = "";
    
    public StringBuilder concat(String s) {
        value = value.concat(s);  // Usa concat() internamente
        return this;  // Retorna this para encadeamento
    }
    
    public String build() {
        return value;
    }
}

// Uso
String s = new StringBuilder()
    .concat("Hello")
    .concat(" ")
    .concat("World")
    .build();
```

**Concatenação simples de 2 Strings**:
```java
String prefixo = "Sr. ";
String nome = "Silva";

String nomeCompleto = prefixo.concat(nome);
// "Sr. Silva"

// Aceitável para 2 Strings, mas + também funciona
String nomeCompleto2 = prefixo + nome;  // Mais idiomático
```

**Método que só aceita String (validação)**:
```java
public String adicionarSufixo(String base, String sufixo) {
    // concat() garante que sufixo é String (compile-time)
    return base.concat(sufixo);
}

// vs
public String adicionar(String base, Object sufixo) {
    // + aceita qualquer tipo
    return base + sufixo;  // sufixo.toString() pode falhar
}
```

## 🎯 Aplicabilidade

**1. Concatenação de 2 Strings**:
```java
String completo = prefixo.concat(nome);
```

**2. Validação Type-Safe**:
```java
// Garantir que parâmetro é String
return s1.concat(s2);
```

**3. NPE Explícito com null**:
```java
// Falhar imediatamente se null
resultado = s.concat(parametro);
```

**4. Código Legado**:
```java
// Manter compatibilidade
```

**5. Method References em Streams**:
```java
stream.map(s -> s.concat(sufixo))
```

## ⚠️ Armadilhas Comuns

**1. NullPointerException**:
```java
s.concat(null);  // ❌ NPE
```

**2. Usar em Loops**:
```java
for (...) {
    s = s.concat(valor);  // ❌ Ineficiente
}
```

**3. Múltiplas Concatenações**:
```java
s1.concat(s2).concat(s3).concat(s4);  // ⚠️ Múltiplas alocações
```

**4. Tentar Passar Primitivos**:
```java
s.concat(42);  // ❌ Erro compilação
s.concat(String.valueOf(42));  // ✓
```

**5. Esperar Conversão Automática**:
```java
"Total: ".concat(numero);  // ❌ Não compila
"Total: " + numero;        // ✓
```

## ✅ Boas Práticas

**1. Prefira + para Legibilidade**:
```java
s1 + s2;  // Mais idiomático que s1.concat(s2)
```

**2. Use StringBuilder em Loops**:
```java
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);
```

**3. Valide null se Necessário**:
```java
if (str != null) {
    resultado = s.concat(str);
}
```

**4. Use para Type-Safety Quando Apropriado**:
```java
// Garantir String em compile-time
public String metodo(String s) {
    return base.concat(s);
}
```

**5. Evite Encadeamentos Longos**:
```java
// ❌ Múltiplas alocações
s1.concat(s2).concat(s3).concat(s4);

// ✓ Use +
s1 + s2 + s3 + s4;
```

## 📚 Resumo Executivo

**concat()** concatena Strings.

**Assinatura**:
```java
String concat(String str)
```

**Uso básico**:
```java
"Hello".concat(" World");  // "Hello World"

// Encadeamento
"A".concat("B").concat("C");  // "ABC"
```

**vs Operador +**:
```java
// concat()
s1.concat(s2);  // NPE se s2 null, só aceita String

// +
s1 + s2;  // "s1null" se s2 null, aceita qualquer tipo
```

**Null behavior**:
```java
"Hello".concat(null);  // ❌ NullPointerException
"Hello" + null;        // "Hellonull" ✓
```

**Performance**:
```java
// 2 Strings - similar
s1.concat(s2);  // ~50ns
s1 + s2;        // ~50ns

// Múltiplas - + melhor
s1.concat(s2).concat(s3);  // ~200ns
s1 + s2 + s3;              // ~100ns (Java 9+)

// Loops - StringBuilder
StringBuilder sb = new StringBuilder();
for (...) sb.append(...);  // 100x mais rápido
```

**Quando usar**:
- Concatenação de 2 Strings (OK, mas + preferível)
- Type-safety explícita
- NPE desejado com null

**Quando NÃO usar**:
- ❌ Loops (use StringBuilder)
- ❌ Múltiplas concatenações (use +)
- ❌ Com primitivos (use +)
- ❌ Quando null deve ser tratado (use +)

**Recomendação**: Prefira **operador +** - mais idiomático, conciso e otimizado. Use concat() apenas quando type-safety explícita ou comportamento NPE são desejados.