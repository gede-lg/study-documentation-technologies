# repeat() - Repetição de Strings

## 🎯 Introdução e Definição

**repeat()** (Java 11+) repete uma String **N vezes**. Como Strings são imutáveis, retorna uma **nova String** com o conteúdo repetido.

**Conceito central**: É essencial para **gerar padrões**, **criar padding/alinhamento**, **formar separadores** e **gerar dados de teste**, eliminando a necessidade de loops manuais para repetição.

**Exemplo fundamental**:
```java
String s = "Ha";

// Repetir 3 vezes
String riso = s.repeat(3);
System.out.println(riso);  // "HaHaHa"

// Original não muda
System.out.println(s);  // "Ha"

// Criar separador
String linha = "-".repeat(50);
// "--------------------------------------------------" (50 hífens)
```

**Características principais**:
- **Método de instância** (não estático): `s.repeat(count)`
- **Java 11+**: não disponível em versões anteriores
- **count >= 0**: lança IllegalArgumentException se negativo
- **count = 0**: retorna String vazia
- **count = 1**: pode retornar mesma instância (otimização JVM)

## 📋 Fundamentos Teóricos

### 1️⃣ Assinatura e Comportamento Básico

**Repete String N vezes**:

```java
String s = "Java";

// Repetir 0 vezes
String r0 = s.repeat(0);
System.out.println("[" + r0 + "]");  // "[]" (vazia)

// Repetir 1 vez
String r1 = s.repeat(1);
System.out.println("[" + r1 + "]");  // "[Java]"

// Repetir 3 vezes
String r3 = s.repeat(3);
System.out.println("[" + r3 + "]");  // "[JavaJavaJava]"

// Repetir 5 vezes
String r5 = s.repeat(5);
System.out.println("[" + r5 + "]");  // "[JavaJavaJavaJavaJava]"
```

**Assinatura**:
```java
public String repeat(int count)  // Java 11+

// count: número de repetições (deve ser >= 0)
// Retorna: nova String com conteúdo repetido count vezes
// Lança: IllegalArgumentException se count < 0
```

**String vazia repetida**:
```java
String vazia = "";

String r = vazia.repeat(100);
System.out.println("[" + r + "]");  // "[]" (continua vazia)
System.out.println(r.length());     // 0

// String vazia repetida qualquer número de vezes = vazia
```

### 2️⃣ Validação de count - IllegalArgumentException

**count deve ser >= 0**:

```java
String s = "Test";

// ✓ count = 0 - OK (retorna vazia)
String r0 = s.repeat(0);  // ""

// ✓ count > 0 - OK
String r3 = s.repeat(3);  // "TestTestTest"

// ❌ count < 0 - IllegalArgumentException
try {
    String rNeg = s.repeat(-1);  // ❌ Exceção
} catch (IllegalArgumentException e) {
    System.err.println("count não pode ser negativo");
}
```

**Tratamento defensivo**:
```java
public String repetir(String s, int count) {
    if (count < 0) {
        throw new IllegalArgumentException("count deve ser >= 0");
    }
    return s.repeat(count);
}

// Ou com valor padrão
public String repetirSeguro(String s, int count) {
    return s.repeat(Math.max(0, count));  // Garante >= 0
}
```

### 3️⃣ Otimizações da JVM

**count = 0 sempre retorna String vazia**:

```java
String s1 = "Hello";
String r1 = s1.repeat(0);

String s2 = "World";
String r2 = s2.repeat(0);

// Ambos retornam mesma instância de ""
System.out.println(r1 == r2);  // true (mesma String vazia)
System.out.println(r1 == "");  // true
```

**count = 1 pode retornar mesma instância**:
```java
String s = "Test";

String r = s.repeat(1);

// JVM pode retornar mesma instância (otimização)
System.out.println(s == r);  // true ou false (depende da JVM)

// Como count = 1, resultado = original
// JVM pode evitar alocação nova
```

**count > 1 sempre cria nova String**:
```java
String s = "Java";

String r = s.repeat(2);  // "JavaJava"

System.out.println(s == r);  // false (sempre nova String)
```

### 4️⃣ Implementação Conceitual

**Algorit mo interno (simplificado)**:

```java
public String repeat(int count) {
    if (count < 0) {
        throw new IllegalArgumentException("count is negative: " + count);
    }
    
    if (count == 0 || length() == 0) {
        return "";  // Vazia
    }
    
    if (count == 1) {
        return this;  // Mesma String (otimização)
    }
    
    // count >= 2
    int len = length();
    long longSize = (long)len * (long)count;
    
    // Verificar overflow
    int size = (int)longSize;
    if (size != longSize) {
        throw new OutOfMemoryError("Required array size too large");
    }
    
    // Criar array e copiar
    byte[] value = new byte[size];
    
    // Copiar primeira repetição
    System.arraycopy(this.value, 0, value, 0, len);
    
    // Dobrar a cada iteração (eficiente)
    int copied = len;
    while (copied < size - len) {
        System.arraycopy(value, 0, value, copied, copied);
        copied <<= 1;  // copied *= 2
    }
    
    // Copiar resto
    System.arraycopy(value, 0, value, copied, size - copied);
    
    return new String(value);
}
```

**Técnica de duplicação eficiente**:
```java
// Ao invés de copiar N vezes (O(n²)):
// for (int i = 0; i < count; i++) copiar(s)

// JVM usa duplicação (O(n log n)):
// 1. Copiar 1x: "A"
// 2. Dobrar:    "AA"
// 3. Dobrar:    "AAAA"
// 4. Dobrar:    "AAAAAAAA"
// ...

// Muito mais eficiente para count grandes
```

### 5️⃣ Casos de Uso Práticos

**Criar separadores/linhas**:

```java
// Linha horizontal
String linha = "-".repeat(80);
System.out.println(linha);
// "--------------------------------------------------------------------------------"

// Separador de seção
String separador = "=".repeat(50);
System.out.println(separador);
// "=================================================="

// Box
String bordaHorizontal = "─".repeat(30);
System.out.println("┌" + bordaHorizontal + "┐");
System.out.println("│ Mensagem                     │");
System.out.println("└" + bordaHorizontal + "┘");
```

**Padding/Alinhamento**:
```java
// Padding esquerdo
String texto = "Java";
String padded = " ".repeat(10 - texto.length()) + texto;
System.out.println("[" + padded + "]");  // "[      Java]"

// Padding direito
String padded2 = texto + " ".repeat(10 - texto.length());
System.out.println("[" + padded2 + "]");  // "[Java      ]"

// Centralizar
int totalWidth = 20;
int padding = (totalWidth - texto.length()) / 2;
String centered = " ".repeat(padding) + texto + " ".repeat(padding);
System.out.println("[" + centered + "]");  // "[        Java        ]"
```

**Indentação**:
```java
int nivelIndentacao = 3;
String indent = "  ".repeat(nivelIndentacao);  // 6 espaços (3 × 2)

System.out.println(indent + "if (condicao) {");
System.out.println(indent + "  executar();");
System.out.println(indent + "}");

// Saída:
//       if (condicao) {
//         executar();
//       }
```

**Gerar padrões**:
```java
// Pirâmide
for (int i = 1; i <= 5; i++) {
    String espacos = " ".repeat(5 - i);
    String asteriscos = "*".repeat(i * 2 - 1);
    System.out.println(espacos + asteriscos);
}
// Saída:
//     *
//    ***
//   *****
//  *******
// *********

// Escada
for (int i = 1; i <= 5; i++) {
    System.out.println("#".repeat(i));
}
// #
// ##
// ###
// ####
// #####
```

**Gerar dados de teste**:
```java
// String grande para teste de performance
String textoGrande = "Lorem ipsum ".repeat(10000);
// 120.000 caracteres

// Dados mockados
String separadorCSV = ",".repeat(10);  // ",,,,,,,,,,,"

// Preencher array
String[] dados = new String[100];
Arrays.fill(dados, "Test".repeat(5));  // Cada elemento = "TestTestTestTestTest"
```

### 6️⃣ Comparação com Alternativas

**repeat() vs loop manual**:

```java
String s = "AB";
int count = 1000;

// Loop manual
long inicio = System.nanoTime();
StringBuilder sb = new StringBuilder(s.length() * count);
for (int i = 0; i < count; i++) {
    sb.append(s);
}
String r1 = sb.toString();
long tempo1 = System.nanoTime() - inicio;
// ~50 microssegundos

// repeat()
inicio = System.nanoTime();
String r2 = s.repeat(count);
long tempo2 = System.nanoTime() - inicio;
// ~30 microssegundos

// repeat() ~40% mais rápido (usa duplicação eficiente)
```

**repeat() vs Arrays.fill() + join()**:
```java
String s = "Test";
int count = 100;

// Arrays.fill + join
long inicio = System.nanoTime();
String[] array = new String[count];
Arrays.fill(array, s);
String r1 = String.join("", array);
long tempo1 = System.nanoTime() - inicio;
// ~100 microssegundos

// repeat()
inicio = System.nanoTime();
String r2 = s.repeat(count);
long tempo2 = System.nanoTime() - inicio;
// ~5 microssegundos

// repeat() ~20x mais rápido
```

**repeat() vs Collections.nCopies() + join()**:
```java
String s = "X";
int count = 1000;

// Collections.nCopies + join
long inicio = System.nanoTime();
String r1 = String.join("", Collections.nCopies(count, s));
long tempo1 = System.nanoTime() - inicio;
// ~200 microssegundos

// repeat()
inicio = System.nanoTime();
String r2 = s.repeat(count);
long tempo2 = System.nanoTime() - inicio;
// ~10 microssegundos

// repeat() ~20x mais rápido
```

### 7️⃣ Performance e Complexidade

**Complexidade temporal**:

```java
// repeat(count)
// Tempo: O(n × count) mas com otimização de duplicação O(n × log count)
// Espaço: O(n × count) onde n = tamanho da String original

String s = "A";

// count pequeno - muito rápido
long inicio = System.nanoTime();
String r10 = s.repeat(10);
long tempo10 = System.nanoTime() - inicio;
// ~50 nanossegundos

// count médio
inicio = System.nanoTime();
String r1000 = s.repeat(1000);
long tempo1000 = System.nanoTime() - inicio;
// ~5 microssegundos

// count grande
inicio = System.nanoTime();
String r100000 = s.repeat(100000);
long tempo100000 = System.nanoTime() - inicio;
// ~500 microssegundos

// Crescimento sublinear devido à duplicação
```

**Limite de memória**:
```java
String s = "Test";

// ❌ OutOfMemoryError se resultado exceder limite
try {
    String r = s.repeat(Integer.MAX_VALUE / 2);  // Muito grande
} catch (OutOfMemoryError e) {
    System.err.println("String resultante muito grande");
}

// Limite prático depende da heap disponível
// Strings são limitadas a tamanho do array (Integer.MAX_VALUE)
```

**Benchmark detalhado**:
```java
String s = "ABC";

for (int count : new int[]{10, 100, 1000, 10000}) {
    long inicio = System.nanoTime();
    String r = s.repeat(count);
    long tempo = System.nanoTime() - inicio;
    
    System.out.printf("repeat(%d): %d ns (%d chars)\n", 
        count, tempo, r.length());
}

// Saída típica:
// repeat(10): 100 ns (30 chars)
// repeat(100): 500 ns (300 chars)
// repeat(1000): 5000 ns (3000 chars)
// repeat(10000): 50000 ns (30000 chars)

// Crescimento aproximadamente linear
```

### 8️⃣ Null Safety e Validações

**Não aceita null**:

```java
String s = null;

// ❌ NullPointerException
String r = s.repeat(3);  // NPE

// ✓ Verificar null
if (s != null) {
    String r = s.repeat(3);
}

// ✓ Operador ternário
String r = (s != null) ? s.repeat(3) : "";
```

**Validar count**:
```java
int count = obterCount();

// ✓ Garantir >= 0
if (count < 0) {
    count = 0;  // Ou lançar exceção
}

String resultado = s.repeat(count);

// Ou usar Math.max
String resultado2 = s.repeat(Math.max(0, count));
```

### 9️⃣ Compatibilidade com Versões Anteriores

**repeat() é Java 11+**:

```java
// ✓ Java 11+
String s = "A".repeat(10);

// ❌ Java 8, 9, 10 - método não existe
// Usar alternativa
```

**Implementação compatível com Java 8**:
```java
public static String repeat(String s, int count) {
    if (s == null) {
        throw new NullPointerException("String is null");
    }
    if (count < 0) {
        throw new IllegalArgumentException("count is negative: " + count);
    }
    if (count == 0 || s.isEmpty()) {
        return "";
    }
    if (count == 1) {
        return s;
    }
    
    // StringBuilder com capacidade inicial
    StringBuilder sb = new StringBuilder(s.length() * count);
    for (int i = 0; i < count; i++) {
        sb.append(s);
    }
    return sb.toString();
}

// Usar como:
String resultado = repeat("AB", 5);  // "ABABABABAB"
```

**Biblioteca Apache Commons Lang**:
```java
// Apache Commons Lang 3.x tem StringUtils.repeat()
import org.apache.commons.lang3.StringUtils;

String resultado = StringUtils.repeat("AB", 5);  // "ABABABABAB"

// Compatível com Java 6+
```

### 🔟 Edge Cases e Casos Especiais

**String de um caractere**:

```java
String s = "A";
String r = s.repeat(1000);
// "AAAA...AAA" (1000 'A's)

// Mais eficiente do que múltiplos caracteres
// JVM pode otimizar arrays de byte único
```

**String muito longa**:
```java
String longa = "X".repeat(10000);  // 10.000 caracteres

String muitoLonga = longa.repeat(100);  // 1.000.000 caracteres
// OK - dentro dos limites

// ❌ String gigante pode causar OOM
// String.repeat(100000).repeat(100000)  // OutOfMemoryError
```

**Caracteres Unicode**:
```java
String emoji = "😀";

String multiplos = emoji.repeat(10);
System.out.println(multiplos);
// "😀😀😀😀😀😀😀😀😀😀"

System.out.println(multiplos.length());  // 20 (cada emoji = 2 chars)
```

**Whitespace**:
```java
String espacos = " ".repeat(100);  // 100 espaços
String tabs = "\t".repeat(5);      // 5 tabs
String newlines = "\n".repeat(3);  // 3 quebras de linha
```

## 🎯 Aplicabilidade

**1. Criar Separadores/Linhas**:
```java
String linha = "-".repeat(80);
String separador = "=".repeat(50);
```

**2. Padding/Alinhamento**:
```java
String padded = " ".repeat(10) + texto;
```

**3. Indentação de Código**:
```java
String indent = "  ".repeat(nivel);
```

**4. Gerar Padrões Visuais**:
```java
String piramide = "*".repeat(i * 2 - 1);
```

**5. Dados de Teste**:
```java
String textoGrande = "Lorem ".repeat(10000);
```

## ⚠️ Armadilhas Comuns

**1. count Negativo**:
```java
s.repeat(-1);  // ❌ IllegalArgumentException
s.repeat(Math.max(0, count));  // ✓ Garantir >= 0
```

**2. NullPointerException**:
```java
String s = null;
s.repeat(5);  // ❌ NPE

if (s != null) {
    s.repeat(5);  // ✓
}
```

**3. OutOfMemoryError com count Muito Grande**:
```java
"Test".repeat(Integer.MAX_VALUE);  // ❌ OOM
```

**4. Assumir Disponibilidade em Java < 11**:
```java
// ❌ Java 8/9/10 não têm repeat()
// Usar alternativa (StringBuilder loop ou Apache Commons)
```

**5. Confundir Tamanho com Unicode**:
```java
"😀".repeat(10).length();  // 20, não 10 (emoji = 2 chars)
```

## ✅ Boas Práticas

**1. Validar count >= 0**:
```java
String resultado = s.repeat(Math.max(0, count));
```

**2. Verificar Null**:
```java
if (s != null) {
    String r = s.repeat(count);
}
```

**3. Preferir repeat() a Loops Manuais**:
```java
// ✓ Conciso e eficiente
"-".repeat(80);

// ✗ Verboso
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 80; i++) sb.append("-");
sb.toString();
```

**4. Usar para Padding/Alinhamento**:
```java
String padded = " ".repeat(width - texto.length()) + texto;
```

**5. Considerar Alternativas para Java < 11**:
```java
// Java 11+
s.repeat(count);

// Java 8
StringUtils.repeat(s, count);  // Apache Commons Lang
```

## 📚 Resumo Executivo

**repeat()** (Java 11+) repete String **N vezes**.

**Assinatura**:
```java
String repeat(int count)  // Java 11+
```

**Uso básico**:
```java
"Ha".repeat(3);       // "HaHaHa"
"-".repeat(50);       // 50 hífens
" ".repeat(10);       // 10 espaços
"".repeat(100);       // "" (vazia)
```

**count = 0**:
```java
"Test".repeat(0);  // "" (retorna vazia)
```

**count = 1**:
```java
String s = "Java";
s.repeat(1);  // "Java" (pode retornar mesma instância)
```

**count < 0**:
```java
"Test".repeat(-1);  // ❌ IllegalArgumentException
```

**Performance**: O(n × log count) - usa duplicação eficiente

**Casos de uso**:
```java
// Separadores
"-".repeat(80);

// Padding
" ".repeat(10) + texto;

// Indentação
"  ".repeat(nivel) + codigo;

// Padrões
"*".repeat(i);

// Dados de teste
"Test".repeat(1000);
```

**Null safety**:
```java
String s = null;
s.repeat(3);  // ❌ NullPointerException
```

**Comparação com alternativas**:
```java
// repeat() - mais rápido
"A".repeat(1000);  // ~5 µs

// StringBuilder loop
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) sb.append("A");
sb.toString();  // ~50 µs

// repeat() é ~10x mais rápido
```

**Compatibilidade**: Java 11+ apenas
- Java 8-10: usar `StringUtils.repeat()` (Apache Commons Lang)

**Recomendação**: Prefira `repeat()` a loops manuais - mais conciso, legível e eficiente