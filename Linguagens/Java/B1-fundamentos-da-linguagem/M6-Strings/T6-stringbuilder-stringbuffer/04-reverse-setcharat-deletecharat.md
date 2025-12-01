# reverse(), setCharAt(), deleteCharAt()

## 🎯 Introdução e Definição

**StringBuilder oferece métodos especializados** para manipulações que seriam complexas com String. Os métodos **reverse()**, **setCharAt()** e **deleteCharAt()** permitem respectivamente **inverter**, **modificar um caractere** e **remover um caractere específico** de forma eficiente.

**Conceito central**: Esses métodos **modificam o StringBuilder in-place** (sem criar novos objetos) e são muito mais eficientes que as alternativas com String, que exigiriam conversões para array, substring ou reconstrução completa.

**Exemplo fundamental**:
```java
StringBuilder sb = new StringBuilder("Java");

// reverse() - inverte toda a sequência
sb.reverse();
System.out.println(sb);  // "avaJ"

// setCharAt() - modifica caractere específico
sb.setCharAt(0, 'J');
System.out.println(sb);  // "JvaJ"

// deleteCharAt() - remove caractere específico
sb.deleteCharAt(3);
System.out.println(sb);  // "Jva"

// Todos modificam MESMO objeto
```

**Características principais**:
- **reverse()**: inverte sequência completa in-place
- **setCharAt()**: substitui caractere no índice
- **deleteCharAt()**: remove caractere no índice
- **Eficiência**: O(n) ou O(1), sem criar objetos intermediários
- **vs String**: muito mais simples e performático

## 📋 Fundamentos Teóricos

### 1️⃣ reverse() - Inverter Sequência

**Assinatura**:

```java
StringBuilder reverse()
// Inverte a ordem dos caracteres no StringBuilder
// Modifica o objeto atual (in-place)
// Retorna this (permite encadeamento)
```

**Uso básico**:
```java
StringBuilder sb = new StringBuilder("Hello");

sb.reverse();
System.out.println(sb);  // "olleH"

// Retorna this - permite encadeamento
sb = new StringBuilder("Java");
String reverso = sb.reverse().toString();
System.out.println(reverso);  // "avaJ"
```

**Funcionamento interno**:
```java
// Algoritmo (simplificado):
// Troca caracteres das pontas para o centro
// Tempo: O(n/2) = O(n)
// Espaço: O(1) - in-place

char[] value;  // Array interno do StringBuilder
int n = count;  // Número de caracteres

for (int i = 0; i < n / 2; i++) {
    char temp = value[i];
    value[i] = value[n - 1 - i];
    value[n - 1 - i] = temp;
}

// Exemplo: "Hello"
// Iteração 0: H <-> o  =>  "oellH"
// Iteração 1: e <-> l  =>  "olleH"
// Caractere central 'l' não muda
```

**Strings com caracteres especiais**:
```java
// Emojis e caracteres Unicode podem ocupar 2 char (surrogate pairs)
StringBuilder sb = new StringBuilder("Hello 😀 World");
sb.reverse();
System.out.println(sb);  // "dlroW 😀 olleH"
// Emoji permanece correto (reverse() respeita surrogate pairs)

// Acentos e caracteres compostos
sb = new StringBuilder("José");
sb.reverse();
System.out.println(sb);  // "ésoJ"
```

**Uso típico - verificar palíndromo**:
```java
public static boolean isPalindromo(String texto) {
    String limpo = texto.toLowerCase()
                        .replaceAll("[^a-z0-9]", "");
    
    String reverso = new StringBuilder(limpo)
                        .reverse()
                        .toString();
    
    return limpo.equals(reverso);
}

System.out.println(isPalindromo("A man a plan a canal Panama"));  // true
System.out.println(isPalindromo("Socorram-me, subi no ônibus em Marrocos"));  // true
System.out.println(isPalindromo("Hello"));  // false
```

**vs String - algoritmo manual**:
```java
String original = "Hello";

// String - converter para char[], reverter, criar nova String
char[] chars = original.toCharArray();
for (int i = 0; i < chars.length / 2; i++) {
    char temp = chars[i];
    chars[i] = chars[chars.length - 1 - i];
    chars[chars.length - 1 - i] = temp;
}
String reverso = new String(chars);

// StringBuilder - 1 chamada
String reverso = new StringBuilder(original).reverse().toString();
// Muito mais simples e conciso!
```

**Performance**:
```java
String texto = "Lorem ipsum dolor sit amet".repeat(100);

// String - char[] + loop + new String
long inicio = System.nanoTime();
char[] chars = texto.toCharArray();
for (int i = 0; i < chars.length / 2; i++) {
    char temp = chars[i];
    chars[i] = chars[chars.length - 1 - i];
    chars[chars.length - 1 - i] = temp;
}
String r1 = new String(chars);
long tempo1 = (System.nanoTime() - inicio) / 1000;

// StringBuilder.reverse()
inicio = System.nanoTime();
String r2 = new StringBuilder(texto).reverse().toString();
long tempo2 = (System.nanoTime() - inicio) / 1000;

System.out.println("String manual: " + tempo1 + "µs");      // ~150µs
System.out.println("StringBuilder: " + tempo2 + "µs");      // ~80µs
// StringBuilder ~2x mais rápido e muito mais simples
```

### 2️⃣ setCharAt() - Modificar Caractere

**Assinatura**:

```java
void setCharAt(int index, char ch)
// Substitui o caractere no índice especificado
// index: posição do caractere (0 a length-1)
// ch: novo caractere
// Não retorna nada (void)
```

**Uso básico**:
```java
StringBuilder sb = new StringBuilder("Hello");

// setCharAt(int index, char ch)
sb.setCharAt(0, 'h');  // Primeira letra minúscula
System.out.println(sb);  // "hello"

sb.setCharAt(4, '!');  // Último caractere
System.out.println(sb);  // "hell!"

// Modificar no meio
sb = new StringBuilder("Java");
sb.setCharAt(1, 'e');
sb.setCharAt(2, 'e');
sb.setCharAt(3, 'p');
System.out.println(sb);  // "Jeep"
```

**vs String - operações complexas**:
```java
String texto = "Hello";

// String - substring + concatenação (cria 3 Strings)
String modificado = texto.substring(0, 0) + 'h' + texto.substring(1);

// StringBuilder - 1 operação, modifica in-place
StringBuilder sb = new StringBuilder(texto);
sb.setCharAt(0, 'h');
String resultado = sb.toString();

// StringBuilder muito mais simples e eficiente
```

**Uso típico - capitalizar primeira letra**:
```java
public static String capitalize(String texto) {
    if (texto == null || texto.isEmpty()) {
        return texto;
    }
    
    StringBuilder sb = new StringBuilder(texto.toLowerCase());
    sb.setCharAt(0, Character.toUpperCase(sb.charAt(0)));
    return sb.toString();
}

System.out.println(capitalize("hello"));     // "Hello"
System.out.println(capitalize("WORLD"));     // "World"
System.out.println(capitalize("jAvA"));      // "Java"
```

**Uso típico - mascarar dados**:
```java
public static String mascarar(String cpf) {
    if (cpf.length() != 11) {
        return cpf;
    }
    
    StringBuilder sb = new StringBuilder(cpf);
    for (int i = 3; i < 9; i++) {
        sb.setCharAt(i, '*');
    }
    return sb.toString();
}

System.out.println(mascarar("12345678901"));  // "123******01"
```

**IndexOutOfBoundsException**:
```java
StringBuilder sb = new StringBuilder("Hello");

// ✓ Índices válidos: 0 a length-1
sb.setCharAt(0, 'h');    // ✓ OK - primeiro
sb.setCharAt(4, '!');    // ✓ OK - último
sb.setCharAt(2, 'L');    // ✓ OK - meio

// ❌ Índices inválidos
try {
    sb.setCharAt(-1, 'X');  // ❌ index < 0
} catch (IndexOutOfBoundsException e) {
    System.err.println("Índice negativo");
}

try {
    sb.setCharAt(5, 'X');   // ❌ index >= length
} catch (IndexOutOfBoundsException e) {
    System.err.println("Índice além do tamanho");
}

// length = 5, índices válidos: 0, 1, 2, 3, 4
```

**Não expande StringBuilder**:
```java
StringBuilder sb = new StringBuilder();

// ❌ Não pode usar setCharAt() em StringBuilder vazio
try {
    sb.setCharAt(0, 'A');  // IndexOutOfBoundsException
} catch (IndexOutOfBoundsException e) {}

// ✓ Precisa ter tamanho primeiro
sb.append("   ");  // length = 3
sb.setCharAt(0, 'A');
sb.setCharAt(1, 'B');
sb.setCharAt(2, 'C');
System.out.println(sb);  // "ABC"
```

### 3️⃣ deleteCharAt() - Remover Caractere

**Assinatura**:

```java
StringBuilder deleteCharAt(int index)
// Remove o caractere no índice especificado
// index: posição do caractere (0 a length-1)
// Retorna this (permite encadeamento)
```

**Uso básico**:
```java
StringBuilder sb = new StringBuilder("Hello");

// deleteCharAt(int index)
sb.deleteCharAt(0);  // Remove primeiro
System.out.println(sb);  // "ello"

sb = new StringBuilder("Hello");
sb.deleteCharAt(4);  // Remove último
System.out.println(sb);  // "Hell"

sb = new StringBuilder("Hello");
sb.deleteCharAt(2);  // Remove do meio
System.out.println(sb);  // "Helo"
```

**Equivalente a delete()**:
```java
StringBuilder sb = new StringBuilder("Hello");

// deleteCharAt(i) é equivalente a delete(i, i+1)
sb.deleteCharAt(2);
// Mesmo que:
sb.delete(2, 3);

// deleteCharAt() é mais conciso para 1 caractere
```

**Encadeamento**:
```java
StringBuilder sb = new StringBuilder("Hello World");

// Encadear múltiplos deleteCharAt()
sb.deleteCharAt(5)      // Remove espaço
  .deleteCharAt(5)      // Remove 'W' (que agora está na posição 5)
  .deleteCharAt(5);     // Remove 'o'

System.out.println(sb);  // "Hellorld"

// ⚠️ Cuidado: índices mudam após cada remoção!
```

**Uso típico - remover caracteres indesejados**:
```java
public static String removerDigitos(String texto) {
    StringBuilder sb = new StringBuilder(texto);
    
    for (int i = 0; i < sb.length(); i++) {
        if (Character.isDigit(sb.charAt(i))) {
            sb.deleteCharAt(i);
            i--;  // Ajustar índice pois tamanho diminuiu
        }
    }
    
    return sb.toString();
}

System.out.println(removerDigitos("abc123def456"));  // "abcdef"
System.out.println(removerDigitos("2024"));          // ""
```

**Uso típico - remover espaços duplicados**:
```java
public static String removerEspacosDuplicados(String texto) {
    StringBuilder sb = new StringBuilder(texto);
    
    for (int i = 0; i < sb.length() - 1; i++) {
        if (sb.charAt(i) == ' ' && sb.charAt(i + 1) == ' ') {
            sb.deleteCharAt(i);
            i--;  // Verificar mesma posição novamente
        }
    }
    
    return sb.toString();
}

System.out.println(removerEspacosDuplicados("Hello    World"));  // "Hello World"
```

**IndexOutOfBoundsException**:
```java
StringBuilder sb = new StringBuilder("Hello");

// ✓ Índices válidos: 0 a length-1
sb.deleteCharAt(0);  // ✓ OK - primeiro

sb = new StringBuilder("Hello");
sb.deleteCharAt(4);  // ✓ OK - último

sb = new StringBuilder("Hello");
sb.deleteCharAt(2);  // ✓ OK - meio

// ❌ Índices inválidos
sb = new StringBuilder("Hello");
try {
    sb.deleteCharAt(-1);  // ❌ index < 0
} catch (IndexOutOfBoundsException e) {}

try {
    sb.deleteCharAt(5);   // ❌ index >= length
} catch (IndexOutOfBoundsException e) {}
```

**vs String - operação complexa**:
```java
String texto = "Hello";

// String - substring + concatenação
String resultado = texto.substring(0, 2) + texto.substring(3);
// "He" + "lo" = "Helo"

// StringBuilder - 1 operação
String resultado = new StringBuilder(texto)
                      .deleteCharAt(2)
                      .toString();
// Muito mais simples!
```

### 4️⃣ Comparação com String

**reverse() vs String manual**:

```java
String texto = "Hello";

// String - char[], loop, new String
char[] chars = texto.toCharArray();
for (int i = 0; i < chars.length / 2; i++) {
    char temp = chars[i];
    chars[i] = chars[chars.length - 1 - i];
    chars[chars.length - 1 - i] = temp;
}
String reverso = new String(chars);

// StringBuilder - 1 linha
String reverso = new StringBuilder(texto).reverse().toString();
```

**setCharAt() vs String substring**:
```java
String texto = "Hello";

// String - substring + char + substring
String modificado = texto.substring(0, 2) + 'L' + texto.substring(3);

// StringBuilder - 1 operação
StringBuilder sb = new StringBuilder(texto);
sb.setCharAt(2, 'L');
String modificado = sb.toString();
```

**deleteCharAt() vs String substring**:
```java
String texto = "Hello";

// String - 2 substrings concatenadas
String resultado = texto.substring(0, 2) + texto.substring(3);

// StringBuilder - 1 operação
String resultado = new StringBuilder(texto)
                      .deleteCharAt(2)
                      .toString();
```

**Performance comparativa**:
```java
String texto = "Hello World";
int n = 1000;

// String - múltiplas operações substring
long inicio = System.nanoTime();
String s = texto;
for (int i = 0; i < n; i++) {
    s = s.substring(0, 2) + 'X' + s.substring(3);  // Modifica caractere
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuilder - setCharAt()
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder(texto);
for (int i = 0; i < n; i++) {
    sb.setCharAt(2, 'X');
}
String resultado = sb.toString();
long tempo2 = (System.nanoTime() - inicio) / 1_000;

System.out.println("String: " + tempo1 + "ms");      // ~150ms
System.out.println("StringBuilder: " + tempo2 + "µs");  // ~50µs
// StringBuilder ~3000x mais rápido!
```

### 5️⃣ Casos de Uso Práticos

**Palíndromo (reverse)**:

```java
public static boolean isPalindromo(String texto) {
    String normalizado = texto.toLowerCase()
                              .replaceAll("[^a-z0-9]", "");
    
    String reverso = new StringBuilder(normalizado)
                        .reverse()
                        .toString();
    
    return normalizado.equals(reverso);
}

System.out.println(isPalindromo("A man a plan a canal Panama"));  // true
System.out.println(isPalindromo("arara"));  // true
System.out.println(isPalindromo("reviver"));  // true
```

**Capitalizar palavras (setCharAt)**:
```java
public static String capitalizarPalavras(String texto) {
    StringBuilder sb = new StringBuilder(texto.toLowerCase());
    
    // Primeira letra
    if (sb.length() > 0) {
        sb.setCharAt(0, Character.toUpperCase(sb.charAt(0)));
    }
    
    // Após espaços
    for (int i = 1; i < sb.length(); i++) {
        if (sb.charAt(i - 1) == ' ' && i < sb.length()) {
            sb.setCharAt(i, Character.toUpperCase(sb.charAt(i)));
        }
    }
    
    return sb.toString();
}

System.out.println(capitalizarPalavras("hello world"));  // "Hello World"
System.out.println(capitalizarPalavras("java programming"));  // "Java Programming"
```

**Remover vogais (deleteCharAt)**:
```java
public static String removerVogais(String texto) {
    StringBuilder sb = new StringBuilder(texto);
    
    for (int i = 0; i < sb.length(); i++) {
        char c = Character.toLowerCase(sb.charAt(i));
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            sb.deleteCharAt(i);
            i--;  // Ajustar índice
        }
    }
    
    return sb.toString();
}

System.out.println(removerVogais("Hello World"));  // "Hll Wrld"
System.out.println(removerVogais("Java"));  // "Jv"
```

**Alternar maiúsculas/minúsculas (setCharAt)**:
```java
public static String alternarCase(String texto) {
    StringBuilder sb = new StringBuilder(texto);
    
    for (int i = 0; i < sb.length(); i++) {
        char c = sb.charAt(i);
        if (Character.isUpperCase(c)) {
            sb.setCharAt(i, Character.toLowerCase(c));
        } else if (Character.isLowerCase(c)) {
            sb.setCharAt(i, Character.toUpperCase(c));
        }
    }
    
    return sb.toString();
}

System.out.println(alternarCase("Hello World"));  // "hELLO wORLD"
System.out.println(alternarCase("JaVa"));  // "jAvA"
```

**Cifra de César (setCharAt)**:
```java
public static String cifraCesar(String texto, int deslocamento) {
    StringBuilder sb = new StringBuilder(texto);
    
    for (int i = 0; i < sb.length(); i++) {
        char c = sb.charAt(i);
        
        if (Character.isLetter(c)) {
            char base = Character.isUpperCase(c) ? 'A' : 'a';
            int offset = c - base;
            int novoPosicao = (offset + deslocamento) % 26;
            if (novoPosicao < 0) novoPosicao += 26;
            sb.setCharAt(i, (char)(base + novoPosicao));
        }
    }
    
    return sb.toString();
}

System.out.println(cifraCesar("Hello", 3));   // "Khoor"
System.out.println(cifraCesar("Khoor", -3));  // "Hello"
```

### 6️⃣ Complexidade e Performance

**Complexidade temporal**:

| Método | Complexidade | Motivo |
|--------|-------------|---------|
| **reverse()** | O(n) | Troca n/2 pares de caracteres |
| **setCharAt()** | O(1) | Acesso direto ao índice do array |
| **deleteCharAt()** | O(n) | Desloca (n - index - 1) caracteres |

**Performance detalhada**:
```java
String texto = "A".repeat(10000);
StringBuilder sb = new StringBuilder(texto);

// reverse() - O(n)
long inicio = System.nanoTime();
sb.reverse();
long tempo1 = (System.nanoTime() - inicio) / 1000;
System.out.println("reverse(): " + tempo1 + "µs");  // ~100µs

// setCharAt() - O(1)
inicio = System.nanoTime();
sb.setCharAt(5000, 'X');
long tempo2 = (System.nanoTime() - inicio);
System.out.println("setCharAt(): " + tempo2 + "ns");  // ~50ns

// deleteCharAt() no início - O(n) pior caso
sb = new StringBuilder(texto);
inicio = System.nanoTime();
sb.deleteCharAt(0);  // Desloca 9999 caracteres
long tempo3 = (System.nanoTime() - inicio) / 1000;
System.out.println("deleteCharAt(início): " + tempo3 + "µs");  // ~80µs

// deleteCharAt() no final - O(1) melhor caso
sb = new StringBuilder(texto);
inicio = System.nanoTime();
sb.deleteCharAt(sb.length() - 1);  // Desloca 0 caracteres
long tempo4 = (System.nanoTime() - inicio);
System.out.println("deleteCharAt(final): " + tempo4 + "ns");  // ~30ns
```

### 7️⃣ Encadeamento

**reverse() + toString()**:

```java
String reverso = new StringBuilder("Hello")
                    .reverse()
                    .toString();
```

**Combinar métodos**:
```java
StringBuilder sb = new StringBuilder("hello world");

String resultado = sb
    .setCharAt(0, 'H')  // ❌ Erro! setCharAt() retorna void
    .toString();

// ✓ Correto: setCharAt() não retorna this
sb.setCharAt(0, 'H');
sb.setCharAt(6, 'W');
String resultado = sb.toString();
```

**deleteCharAt() retorna this**:
```java
String resultado = new StringBuilder("Hello")
                      .deleteCharAt(0)
                      .deleteCharAt(0)  // Remove 'e' (agora no índice 0)
                      .toString();
System.out.println(resultado);  // "llo"
```

**Padrão comum**:
```java
String texto = "Hello World";

String processado = new StringBuilder(texto)
                        .reverse()
                        .deleteCharAt(0)
                        .deleteCharAt(0)
                        .toString();
// "dlroW olleH" -> "dlroW olle" -> "dlroW oll"
```

### 8️⃣ Cuidados com Índices

**Índices mudam após modificação**:

```java
StringBuilder sb = new StringBuilder("Hello");

// ⚠️ Cuidado: índices mudam após deleteCharAt()
sb.deleteCharAt(1);  // Remove 'e' -> "Hllo"
sb.deleteCharAt(1);  // Remove 'l' (que agora está no índice 1) -> "Hlo"

// ✓ Loop reverso para deletar múltiplos
sb = new StringBuilder("Hello");
for (int i = sb.length() - 1; i >= 0; i--) {
    if (sb.charAt(i) == 'l') {
        sb.deleteCharAt(i);
    }
}
System.out.println(sb);  // "Heo"
```

**Validar índices dinâmicos**:
```java
int index = calcularIndice();

// ✓ Validar antes de usar
if (index >= 0 && index < sb.length()) {
    sb.deleteCharAt(index);
} else {
    // Tratar índice inválido
}
```

### 9️⃣ Boas Práticas

**Preferir métodos específicos**:

```java
// ⚠️ Menos eficiente
sb.delete(index, index + 1);

// ✓ Mais conciso
sb.deleteCharAt(index);
```

**Loop reverso para remoções**:
```java
// ✓ Loop reverso evita problemas com índices
for (int i = sb.length() - 1; i >= 0; i--) {
    if (condicao(sb.charAt(i))) {
        sb.deleteCharAt(i);
    }
}
```

**Validar tamanho antes setCharAt()**:
```java
// ✓ Validar
if (sb.length() > 0) {
    sb.setCharAt(0, 'X');
}
```

**Ajustar índice após deleteCharAt() em loop**:
```java
// ✓ Ajustar índice
for (int i = 0; i < sb.length(); i++) {
    if (condicao(sb.charAt(i))) {
        sb.deleteCharAt(i);
        i--;  // Crucial!
    }
}
```

### 🔟 Comparação Resumida

**Tabela de métodos**:

| Método | Ação | Retorno | Complexidade | vs String |
|--------|------|---------|--------------|-----------|
| **reverse()** | Inverte sequência | this | O(n) | Muito mais simples |
| **setCharAt()** | Modifica 1 char | void | O(1) | ~3000x mais rápido |
| **deleteCharAt()** | Remove 1 char | this | O(n) | Mais conciso |

**String equivalente**:
```java
// reverse()
String: char[] + loop + new String
StringBuilder: .reverse()

// setCharAt()
String: substring(0,i) + char + substring(i+1)
StringBuilder: .setCharAt(i, char)

// deleteCharAt()
String: substring(0,i) + substring(i+1)
StringBuilder: .deleteCharAt(i)
```

## 🎯 Aplicabilidade

**1. reverse() - Palíndromos, Inversões**:
```java
sb.reverse();
```

**2. setCharAt() - Modificar Caracteres**:
```java
sb.setCharAt(0, 'X');
```

**3. deleteCharAt() - Remover Caracteres**:
```java
sb.deleteCharAt(index);
```

**4. Combinar Métodos**:
```java
sb.reverse().deleteCharAt(0);
```

**5. Processar String Caractere a Caractere**:
```java
for (int i = 0; i < sb.length(); i++) {
    if (condicao) sb.setCharAt(i, novoChar);
}
```

## ⚠️ Armadilhas Comuns

**1. setCharAt() Retorna void**:
```java
sb.setCharAt(0, 'X').append("Y");  // ❌ Erro compilação
```

**2. Índices Mudam Após deleteCharAt()**:
```java
sb.deleteCharAt(1);
sb.deleteCharAt(1);  // ⚠️ Remove caractere diferente
```

**3. IndexOutOfBoundsException**:
```java
sb.setCharAt(sb.length(), 'X');  // ❌ Erro
```

**4. Loop Forward com deleteCharAt()**:
```java
for (int i = 0; i < sb.length(); i++) {
    sb.deleteCharAt(i);  // ⚠️ Pula caracteres
}
```

**5. Não Valida Tamanho**:
```java
StringBuilder sb = new StringBuilder();
sb.setCharAt(0, 'X');  // ❌ IndexOutOfBoundsException
```

## ✅ Boas Práticas

**1. reverse() para Palíndromos**:
```java
String reverso = new StringBuilder(texto).reverse().toString();
```

**2. Validar Índices**:
```java
if (index >= 0 && index < sb.length()) {
    sb.setCharAt(index, 'X');
}
```

**3. Loop Reverso para Remoções**:
```java
for (int i = sb.length() - 1; i >= 0; i--) {
    if (condicao) sb.deleteCharAt(i);
}
```

**4. Usar deleteCharAt() em Vez de delete()**:
```java
sb.deleteCharAt(i);  // ✓ Melhor que delete(i, i+1)
```

**5. Ajustar Índice Após Remoção**:
```java
sb.deleteCharAt(i);
i--;  // Ajustar
```

## 📚 Resumo Executivo

**Métodos especializados** de StringBuilder.

**reverse() - inverter sequência**:
```java
sb.reverse();  // "Hello" -> "olleH"
// O(n), in-place, retorna this
```

**setCharAt() - modificar caractere**:
```java
sb.setCharAt(0, 'X');  // "Hello" -> "Xello"
// O(1), retorna void
```

**deleteCharAt() - remover caractere**:
```java
sb.deleteCharAt(2);  // "Hello" -> "Helo"
// O(n), retorna this
```

**vs String**:
```java
String muito mais complexo:
  reverse: char[] + loop + new String
  setCharAt: substring + concatenação
  deleteCharAt: 2 substrings concatenadas

StringBuilder muito mais simples:
  1 método, 1 linha, in-place
```

**Performance**:
```java
setCharAt: ~3000x mais rápido que String
reverse: ~2x mais rápido, muito mais simples
deleteCharAt: Mais conciso que String
```

**Uso típico**:
```java
// Palíndromo
boolean palindromo = texto.equals(
    new StringBuilder(texto).reverse().toString()
);

// Capitalizar
sb.setCharAt(0, Character.toUpperCase(sb.charAt(0)));

// Remover caracteres
for (int i = sb.length() - 1; i >= 0; i--) {
    if (invalido(sb.charAt(i))) {
        sb.deleteCharAt(i);
    }
}
```

**Recomendação**: Use **reverse()** para inversões (palíndromos, algoritmos). Use **setCharAt()** para modificações pontuais (capitalização, máscaras, cifras). Use **deleteCharAt()** para remoções únicas (mais conciso que delete()). **Loop reverso** para remoções múltiplas. **Muito mais simples e eficiente** que alternativas com String.