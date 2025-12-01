# compareTo(): Comparação Lexicográfica

## 🎯 Introdução e Definição

### Definição Conceitual Clara

O **método `compareTo()`** realiza comparação lexicográfica (ordem de dicionário) entre duas Strings, retornando valor inteiro que indica se a String atual vem antes (negativo), é igual (zero) ou vem depois (positivo) da String comparada, baseando-se em valores Unicode dos caracteres. Conceitualmente, `compareTo()` responde "qual String vem primeiro alfabeticamente?" ao invés de apenas "são iguais ou diferentes?", sendo fundamental para ordenação, classificação e implementação da interface `Comparable`.

É o reconhecimento de que Strings têm ordem natural - "Apple" vem antes de "Banana", "Java" antes de "Python" - e esta ordem deve ser programaticamente determinável para sorts, buscas binárias, e estruturas ordenadas (TreeSet, TreeMap).

### Contexto Histórico e Motivação

Comparação lexicográfica vem de dicionários físicos onde palavras são ordenadas alfabeticamente. Computacionalmente, ordenação de texto é operação fundamental - índices de bancos de dados, resultados de busca, listas de arquivos. `compareTo()` foi incluído como parte do contrato `Comparable<String>`, tornando Strings naturalmente ordenáveis.

**Motivação:** Estruturas de dados ordenadas (TreeSet, arrays sorted) precisam determinar ordem relativa - `compareTo()` fornece essa capacidade para Strings.

### Problema Fundamental que Resolve

**Problema:** `equals()` apenas diz "são iguais ou não", sem informar ordem:

```java
String a = "Apple";
String b = "Banana";

System.out.println(a.equals(b));  // false - mas qual vem primeiro?
```

**Solução:** `compareTo()` fornece ordem relativa:

```java
int result = a.compareTo(b);
if (result < 0) {
    System.out.println("Apple vem antes de Banana");  // Executa!
} else if (result == 0) {
    System.out.println("São iguais");
} else {
    System.out.println("Apple vem depois de Banana");
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Retorno Tripartite:** Negativo (menor), zero (igual), positivo (maior).

2. **Ordem Lexicográfica:** Primeira diferença de caractere determina resultado.

3. **Case-Sensitive:** Maiúsculas vêm antes de minúsculas (Unicode order).

4. **Implementa Comparable:** String implementa `Comparable<String>`.

5. **Consistente com equals():** `compareTo() == 0` se e somente se `equals() == true`.

### Pilares Fundamentais

- **Sintaxe:** `string1.compareTo(string2)` - retorna int
- **Retorno < 0:** string1 vem antes de string2
- **Retorno == 0:** string1 é igual a string2
- **Retorno > 0:** string1 vem depois de string2
- **Uso:** Ordenação, TreeSet/TreeMap, busca binária

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Implementação Simplificada

```java
public int compareTo(String anotherString) {
    char[] v1 = value;  // Array interno desta String
    char[] v2 = anotherString.value;
    int len1 = v1.length;
    int len2 = v2.length;
    int lim = Math.min(len1, len2);  // Comparar até menor tamanho

    int k = 0;
    while (k < lim) {
        char c1 = v1[k];
        char c2 = v2[k];
        if (c1 != c2) {
            return c1 - c2;  // Diferença de valores Unicode
        }
        k++;
    }
    return len1 - len2;  // Se prefixo igual, menor comprimento vem primeiro
}
```

**Lógica:**
1. Comparar caractere por caractere até encontrar diferença
2. Se diferença encontrada: retornar `char1 - char2`
3. Se prefixo igual: retornar `length1 - length2`

#### Processo de Comparação

```java
String a = "Apple";
String b = "Banana";
int result = a.compareTo(b);
```

**Passos:**
1. lim = min(5, 6) = 5
2. k=0: 'A' vs 'B' → 'A' (65) vs 'B' (66) → 65 - 66 = **-1**
3. Retorna -1 (negativo = a < b)

**Exemplo 2 - Prefixo:**
```java
String a = "Test";
String b = "Testing";
int result = a.compareTo(b);  // -3
```

**Passos:**
1. lim = min(4, 7) = 4
2. k=0 a 3: Todos iguais ('T', 'e', 's', 't')
3. Prefixo igual: retorna length1 - length2 = 4 - 7 = **-3**

### Princípios e Conceitos Subjacentes

#### Princípio da Ordem Lexicográfica

Ordem de dicionário - primeira diferença determina tudo:

```java
"Apple".compareTo("Apricot")  // -11 ('p' < 'r')
// A=A, p=p, p=r → diferença! 'p'(112) - 'r'(114) = -2
```

**Análise:** Mesmo que "Apricot" tenha mais caracteres, decisão ocorre no 3º char.

#### Princípio da Transitividade

Se `a < b` e `b < c`, então `a < c`:

```java
String a = "Apple";
String b = "Banana";
String c = "Cherry";

a.compareTo(b) < 0  // true (Apple < Banana)
b.compareTo(c) < 0  // true (Banana < Cherry)
// Logo: a.compareTo(c) < 0  // true (Apple < Cherry)
```

**Importância:** Propriedade essencial para algoritmos de ordenação funcionarem corretamente.

#### Princípio da Consistência com equals()

**Regra de Ouro:**
```java
a.compareTo(b) == 0  ↔  a.equals(b) == true
```

**Verificação:**
```java
String a = "Java";
String b = new String("Java");

System.out.println(a.compareTo(b));  // 0
System.out.println(a.equals(b));     // true
// Consistentes!
```

---

## 🔍 Análise Conceitual Profunda

### Interpretação dos Valores de Retorno

#### Retorno Negativo

```java
"Apple".compareTo("Banana")  // < 0 (negativo)
// Significa: "Apple" vem ANTES de "Banana"
```

**Valor específico não importa** - apenas sinal:
```java
int result = "A".compareTo("Z");  // -25 ('A'=65, 'Z'=90)
// -25, -1, -100 = todos significam "menor que"
```

#### Retorno Zero

```java
"Java".compareTo("Java")  // 0
// Significa: Exatamente iguais (mesmo que equals)
```

#### Retorno Positivo

```java
"Zebra".compareTo("Apple")  // > 0 (positivo)
// Significa: "Zebra" vem DEPOIS de "Apple"
```

### Casos de Comparação Detalhados

#### Caso 1: Ordem Alfabética Básica

```java
System.out.println("Apple".compareTo("Banana"));   // < 0 (Apple antes)
System.out.println("Banana".compareTo("Apple"));   // > 0 (Banana depois)
System.out.println("Apple".compareTo("Apple"));    // 0 (iguais)
```

#### Caso 2: Case Sensitivity

```java
System.out.println("apple".compareTo("Apple"));    // > 0 (minúscula depois!)
System.out.println("Apple".compareTo("apple"));    // < 0 (maiúscula antes!)
```

**Análise:** Em Unicode, maiúsculas (65-90) < minúsculas (97-122) - 'A' < 'a'.

**Ordem resultante:**
```
"APPLE" < "Apple" < "apple"
```

#### Caso 3: Prefixos

```java
System.out.println("Test".compareTo("Testing"));      // < 0 (mais curto antes)
System.out.println("Testing".compareTo("Test"));      // > 0 (mais longo depois)
System.out.println("Test".compareTo("Test"));         // 0 (iguais)
```

**Regra:** Se uma String é prefixo da outra, a mais curta vem primeiro.

#### Caso 4: Números como String

```java
System.out.println("10".compareTo("2"));  // < 0 (lexicográfico, NÃO numérico!)
// '1' (49) < '2' (50) → "10" vem antes de "2"
```

**CUIDADO:** Comparação lexicográfica ≠ numérica!

**Ordem lexicográfica:** "1" < "10" < "2" < "20"
**Ordem numérica:** 1 < 2 < 10 < 20

**Solução para numérico:**
```java
Integer.parseInt("10").compareTo(Integer.parseInt("2"))  // > 0 (correto)
```

#### Caso 5: Strings Vazias

```java
System.out.println("".compareTo(""));       // 0 (iguais)
System.out.println("".compareTo("a"));      // < 0 (vazia antes)
System.out.println("a".compareTo(""));      // > 0 (não-vazia depois)
```

#### Caso 6: Caracteres Especiais

```java
System.out.println("café".compareTo("cafe"));  // > 0 ('é'=233 > 'e'=101)
System.out.println("test!".compareTo("test"));  // > 0 ('!'=33 vs nada)
```

### Uso em Ordenação

#### Ordenar Array

```java
String[] frutas = {"Banana", "Apple", "Cherry", "Date"};
Arrays.sort(frutas);  // Usa compareTo() internamente
System.out.println(Arrays.toString(frutas));
// [Apple, Banana, Cherry, Date]
```

#### Ordenar Lista

```java
List<String> nomes = Arrays.asList("Zoe", "Alice", "Bob");
Collections.sort(nomes);  // Usa compareTo()
System.out.println(nomes);  // [Alice, Bob, Zoe]
```

#### Ordenar com Comparator Customizado

```java
List<String> palavras = Arrays.asList("apple", "Banana", "CHERRY");

// Natural order (case-sensitive)
Collections.sort(palavras);  // [CHERRY, Banana, apple]

// Case-insensitive order
Collections.sort(palavras, String.CASE_INSENSITIVE_ORDER);
// [apple, Banana, CHERRY]
```

#### TreeSet - Ordenação Automática

```java
Set<String> ordenado = new TreeSet<>();
ordenado.add("Zebra");
ordenado.add("Apple");
ordenado.add("Mango");
System.out.println(ordenado);  // [Apple, Mango, Zebra] - ordenado!
```

**Análise:** TreeSet usa `compareTo()` para manter ordem.

### Uso em Busca

#### Busca Binária

```java
String[] nomes = {"Alice", "Bob", "Carol", "David", "Eve"};
// DEVE estar ordenado!

int index = Arrays.binarySearch(nomes, "Carol");
System.out.println(index);  // 2

int notFound = Arrays.binarySearch(nomes, "Zoe");
System.out.println(notFound);  // Negativo (não encontrado)
```

**Requisito:** Array DEVE estar ordenado para busca binária funcionar.

### Armadilhas Comuns

#### Armadilha 1: Assumir Ordem Numérica

```java
List<String> versoes = Arrays.asList("1.10", "1.2", "1.20");
Collections.sort(versoes);
System.out.println(versoes);  // [1.10, 1.2, 1.20] - ERRADO!
// Esperado: [1.2, 1.10, 1.20]
```

**Solução:** Comparador customizado que entende versões:
```java
Comparator<String> versionComparator = (v1, v2) -> {
    String[] parts1 = v1.split("\\.");
    String[] parts2 = v2.split("\\.");
    for (int i = 0; i < Math.min(parts1.length, parts2.length); i++) {
        int num1 = Integer.parseInt(parts1[i]);
        int num2 = Integer.parseInt(parts2[i]);
        if (num1 != num2) return Integer.compare(num1, num2);
    }
    return parts1.length - parts2.length;
};
Collections.sort(versoes, versionComparator);  // [1.2, 1.10, 1.20]
```

#### Armadilha 2: Null Comparisons

```java
String a = "Java";
String b = null;

// a.compareTo(b);  // NullPointerException!

// Usar Comparator null-safe
Comparator<String> nullSafe = Comparator.nullsFirst(Comparator.naturalOrder());
```

#### Armadilha 3: Case Mixing

```java
List<String> palavras = Arrays.asList("apple", "Banana", "CHERRY", "date");
Collections.sort(palavras);
System.out.println(palavras);  // [Banana, CHERRY, apple, date]
// Maiúsculas antes de minúsculas - pode não ser o desejado
```

**Solução:** Use `compareToIgnoreCase()` ou `String.CASE_INSENSITIVE_ORDER`.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar compareTo()

✅ **Use quando:**

1. **Ordenação:** Ordenar arrays/listas de Strings
2. **TreeSet/TreeMap:** Estruturas ordenadas
3. **Busca Binária:** Arrays.binarySearch() requer ordem
4. **Comparação de Ordem:** Determinar qual vem primeiro
5. **Implementar Comparable:** Sua classe tem Strings como chave natural

### Quando Usar Alternativas

❌ **Use alternativas quando:**

1. **Apenas Igualdade:** Use `equals()` (mais claro)
2. **Case-Insensitive:** Use `compareToIgnoreCase()`
3. **Locale-Specific:** Use `Collator`
4. **Ordem Customizada:** Implemente `Comparator`

---

## ⚠️ Limitações e Considerações

### Limitações

#### Ordem Unicode, Não Linguística

```java
// Em espanhol, "ch" é uma letra única após "c"
// Mas compareTo usa Unicode char-by-char
"casa".compareTo("chuva")  // < 0 ('a' < 'h'), mas em espanhol seria diferente
```

**Solução:** Para ordenação linguística correta, use `Collator`:

```java
Collator espanhol = Collator.getInstance(new Locale("es", "ES"));
int result = espanhol.compare("casa", "chuva");
```

#### Não Normaliza Unicode

```java
String a = "café";  // 'é' como char único
String b = "café";  // 'e' + combining accent

a.compareTo(b) != 0  // Diferentes representações!
```

### Considerações de Performance

**Complexidade:**
- **Melhor caso:** O(1) - primeira char diferente
- **Pior caso:** O(min(n, m)) - comparar até menor comprimento

**Benchmark:**
```java
"Apple".compareTo("Banana")     // ~20ns
"Test".compareTo("Testing")     // ~30ns (mais chars)
```

---

## 🔗 Interconexões Conceituais

### Relação com equals()

```java
String a = "Java";
String b = "Java";

a.equals(b)            // true
a.compareTo(b) == 0    // true (equivalente)
```

**Regra:** `compareTo() == 0` ↔ `equals() == true`

### Relação com Comparable

String implementa `Comparable<String>`:

```java
public final class String implements Comparable<String> {
    @Override
    public int compareTo(String anotherString) {
        // Implementação
    }
}
```

**Benefício:** Strings são naturalmente ordenáveis.

### Relação com Comparator

```java
// Natural order (compareTo)
Collections.sort(lista);

// Custom order (Comparator)
Collections.sort(lista, Comparator.reverseOrder());  // Z-A
Collections.sort(lista, String.CASE_INSENSITIVE_ORDER);  // Case-insensitive
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **compareToIgnoreCase():** Ordenação case-insensitive
- **Collator:** Ordenação locale-aware
- **Comparator:** Ordens customizadas
- **Comparable interface:** Ordenação natural

---

## 📚 Conclusão

`compareTo()` é método fundamental para determinar ordem relativa entre Strings, retornando negativo (antes), zero (igual) ou positivo (depois). Implementa ordem lexicográfica (dicionário) baseada em valores Unicode, sendo essencial para ordenação, TreeSet/TreeMap, e busca binária.

Dominar `compareTo()` significa:
- Interpretar retorno: < 0 (menor), == 0 (igual), > 0 (maior)
- Compreender ordem lexicográfica: primeira diferença determina resultado
- Saber que é case-sensitive: maiúsculas antes de minúsculas
- Reconhecer que "10" < "2" lexicograficamente (não numericamente)
- Usar para ordenação com Arrays.sort(), Collections.sort(), TreeSet
- Garantir consistência com equals(): `compareTo() == 0` ↔ `equals() == true`

`compareTo()` é contrato de `Comparable<String>` - torna Strings naturalmente ordenáveis. Para ordem case-insensitive, use `compareToIgnoreCase()`; para ordem linguística, use `Collator`. Essencial para qualquer ordenação ou estrutura ordenada em Java.
