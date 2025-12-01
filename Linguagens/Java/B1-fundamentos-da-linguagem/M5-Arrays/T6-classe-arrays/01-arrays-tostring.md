# Arrays.toString() - Impressão de Arrays

## 🎯 Introdução e Definição

**`Arrays.toString()`** é um método estático da classe `java.util.Arrays` que converte um array em uma **representação String legível**, facilitando a impressão e debug de arrays. Sem este método, imprimir um array diretamente resulta em uma referência de memória ilegível.

**Conceito central**: converte array em formato `[elemento1, elemento2, elemento3]`, ideal para visualização e logging.

**Sintaxe fundamental**:
```java
String resultado = Arrays.toString(array);
```

**Exemplo básico**:
```java
int[] nums = {1, 2, 3, 4, 5};
System.out.println(nums);  // [I@15db9742 (referência de memória)
System.out.println(Arrays.toString(nums));  // [1, 2, 3, 4, 5] (legível!)
```

**Assinatura do método**:
```java
public static String toString(int[] a)
public static String toString(long[] a)
public static String toString(double[] a)
// ... sobrecarga para todos os tipos primitivos + Object[]
```

`Arrays.toString()` é **essencial** para debug, logging e testes unitários com arrays.

## 📋 Fundamentos Teóricos

### 1️⃣ Problema: Impressão Direta de Arrays

Imprimir array diretamente mostra **referência de memória**, não conteúdo:

```java
int[] arr = {10, 20, 30};
System.out.println(arr);  // [I@15db9742

// Breakdown da saída:
// [ = array
// I = tipo int
// @15db9742 = hash code (endereço de memória)
```

**Por quê?** Arrays não sobrescrevem `toString()` herdado de `Object`, que retorna `getClass().getName() + "@" + Integer.toHexString(hashCode())`.

**Solução**: `Arrays.toString()` itera sobre elementos e formata como String.

### 2️⃣ Formato de Saída - Padrão [elemento1, elemento2, ...]

Saída segue formato padrão:

```java
int[] nums = {1, 2, 3};
Arrays.toString(nums);  // "[1, 2, 3]"

// Estrutura:
// - Colchetes [ ]
// - Elementos separados por ", " (vírgula + espaço)
// - Sem quebra de linha
```

**Elementos vazios**:
```java
int[] vazio = {};
Arrays.toString(vazio);  // "[]"
```

**Null array**:
```java
int[] nulo = null;
Arrays.toString(nulo);  // "null"
```

### 3️⃣ Sobrecarga para Todos os Tipos Primitivos

Método **sobrecarregado** para cada tipo primitivo:

```java
// Inteiros
byte[] bytes = {1, 2, 3};
Arrays.toString(bytes);  // "[1, 2, 3]"

short[] shorts = {10, 20};
Arrays.toString(shorts);  // "[10, 20]"

int[] ints = {100, 200};
Arrays.toString(ints);  // "[100, 200]"

long[] longs = {1000L, 2000L};
Arrays.toString(longs);  // "[1000, 2000]"

// Ponto flutuante
float[] floats = {1.5f, 2.7f};
Arrays.toString(floats);  // "[1.5, 2.7]"

double[] doubles = {3.14, 2.71};
Arrays.toString(doubles);  // "[3.14, 2.71]"

// Outros
char[] chars = {'a', 'b', 'c'};
Arrays.toString(chars);  // "[a, b, c]"

boolean[] bools = {true, false, true};
Arrays.toString(bools);  // "[true, false, true]"
```

### 4️⃣ Arrays de Objetos - toString() dos Elementos

Para arrays de objetos, chama `toString()` de cada elemento:

```java
String[] nomes = {"Ana", "Bob", "Carlos"};
Arrays.toString(nomes);  // "[Ana, Bob, Carlos]"

// Objetos customizados
class Pessoa {
    String nome;
    Pessoa(String nome) { this.nome = nome; }
    
    @Override
    public String toString() {
        return "Pessoa(" + nome + ")";
    }
}

Pessoa[] pessoas = {new Pessoa("Ana"), new Pessoa("Bob")};
Arrays.toString(pessoas);  // "[Pessoa(Ana), Pessoa(Bob)]"
```

**Sem `toString()` customizado**:
```java
class Produto {
    String nome;
    Produto(String nome) { this.nome = nome; }
    // Sem @Override toString()
}

Produto[] produtos = {new Produto("Notebook")};
Arrays.toString(produtos);  // "[Produto@15db9742]" (referência!)
```

### 5️⃣ Arrays com Elementos null

Elementos `null` aparecem como `"null"`:

```java
String[] arr = {"Ana", null, "Carlos", null};
Arrays.toString(arr);  // "[Ana, null, Carlos, null]"

Integer[] nums = {10, null, 30};
Arrays.toString(nums);  // "[10, null, 30]"
```

### 6️⃣ Arrays Multidimensionais - toString() vs deepToString()

`toString()` **não funciona** corretamente com arrays multidimensionais:

```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6}
};

Arrays.toString(matriz);  // "[[I@15db9742, [I@6d06d69c]" (referências!)

// Solução: Arrays.deepToString()
Arrays.deepToString(matriz);  // "[[1, 2, 3], [4, 5, 6]]" (correto!)
```

**Regra**: use `deepToString()` para arrays 2D+, `toString()` para arrays 1D.

### 7️⃣ Implementação Interna - Como Funciona

Implementação simplificada:

```java
public static String toString(int[] a) {
    if (a == null) return "null";
    
    if (a.length == 0) return "[]";
    
    StringBuilder b = new StringBuilder();
    b.append('[');
    
    for (int i = 0; i < a.length; i++) {
        b.append(a[i]);
        if (i < a.length - 1) {
            b.append(", ");
        }
    }
    
    b.append(']');
    return b.toString();
}
```

**Processo**:
1. Verifica `null` → retorna `"null"`
2. Verifica vazio → retorna `"[]"`
3. Itera elementos com `StringBuilder`
4. Adiciona vírgula entre elementos (exceto último)
5. Retorna String final

### 8️⃣ Performance - StringBuilder Interno

Usa `StringBuilder` para eficiência:

```java
// Eficiente (usa StringBuilder internamente)
String s = Arrays.toString(largeArray);

// Ineficiente (concatenação manual)
String s = "[";
for (int i = 0; i < arr.length; i++) {
    s += arr[i];
    if (i < arr.length - 1) s += ", ";
}
s += "]";  // O(n²) devido a concatenação de Strings!
```

**Complexidade**: O(n) onde n = tamanho do array.

### 9️⃣ Diferença de Arrays.asList().toString()

Resultado **idêntico**, mas processo diferente:

```java
Integer[] nums = {1, 2, 3};

Arrays.toString(nums);  // "[1, 2, 3]"
Arrays.asList(nums).toString();  // "[1, 2, 3]"

// Mas:
// - Arrays.toString(): itera array diretamente
// - asList().toString(): cria List wrapper, depois toString()
```

**Vantagem de `toString()`**: mais direto e eficiente (sem criação de List).

### 🔟 Limitações - Não Modifica o Array

`toString()` **não altera** o array original:

```java
int[] arr = {1, 2, 3};
String s = Arrays.toString(arr);

// arr permanece inalterado
System.out.println(arr[0]);  // 1
```

**Importante**: é método de **leitura/visualização**, não modificação.

## 🎯 Aplicabilidade

**1. Debug e Logging**:
```java
int[] scores = {85, 90, 78, 92};
System.out.println("Scores: " + Arrays.toString(scores));
// Scores: [85, 90, 78, 92]

logger.debug("Array state: " + Arrays.toString(arr));
```

**2. Testes Unitários**:
```java
@Test
public void testOrdenacao() {
    int[] arr = {3, 1, 2};
    ordenar(arr);
    assertEquals("[1, 2, 3]", Arrays.toString(arr));
}
```

**3. Mensagens de Erro**:
```java
if (arr.length == 0) {
    throw new IllegalArgumentException(
        "Array vazio: " + Arrays.toString(arr)
    );
}
```

**4. Comparação Visual de Arrays**:
```java
int[] antes = {5, 3, 1};
int[] depois = {1, 3, 5};

System.out.println("Antes:  " + Arrays.toString(antes));
System.out.println("Depois: " + Arrays.toString(depois));
```

**5. Documentação e Exemplos**:
```java
/**
 * Exemplo: processarDados([1, 2, 3]) retorna [2, 4, 6]
 */
public int[] processarDados(int[] input) {
    // ...
}
```

## ⚠️ Armadilhas Comuns

**1. Usar em Arrays Multidimensionais**:
```java
int[][] matriz = {{1, 2}, {3, 4}};
Arrays.toString(matriz);  // ❌ "[[I@abc, [I@def]" (referências!)
Arrays.deepToString(matriz);  // ✅ "[[1, 2], [3, 4]]"
```

**2. Esquecer de Importar**:
```java
// ❌ ERRO: cannot find symbol
String s = Arrays.toString(arr);

// ✅ Importar primeiro
import java.util.Arrays;
```

**3. Esperar Formatação Customizada**:
```java
// toString() sempre usa formato [a, b, c]
// Para customização, criar manualmente:
String custom = String.join(" | ", 
    Arrays.stream(arr)
          .mapToObj(String::valueOf)
          .toArray(String[]::new)
);  // "1 | 2 | 3"
```

**4. Usar com Objetos Sem toString()**:
```java
class Item {
    String nome;
    // Sem @Override toString()
}

Item[] itens = {new Item()};
Arrays.toString(itens);  // "[Item@abc]" (inútil!)
```

**5. Confundir com Arrays.asList()**:
```java
int[] primitivos = {1, 2, 3};
Arrays.asList(primitivos);  // ❌ Retorna List<int[]> (não List<Integer>!)
// Use Integer[] ou IntStream.boxed()
```

## ✅ Boas Práticas

**1. Use para Debug e Logging**:
```java
logger.debug("Processing array: " + Arrays.toString(arr));
```

**2. Prefira deepToString() para Multidimensionais**:
```java
int[][] matriz = {{1, 2}, {3, 4}};
System.out.println(Arrays.deepToString(matriz));
```

**3. Combine com Mensagens Descritivas**:
```java
System.out.println("Resultado: " + Arrays.toString(resultado));
```

**4. Implemente toString() em Classes Customizadas**:
```java
class Produto {
    String nome;
    double preco;
    
    @Override
    public String toString() {
        return nome + " ($" + preco + ")";
    }
}
```

**5. Use em Assertions de Testes**:
```java
assertArrayEquals(esperado, real, 
    "Arrays diferentes: " + Arrays.toString(real));
```

**6. Evite em Loops de Performance Crítica**:
```java
// ❌ Ineficiente
for (int i = 0; i < 1000000; i++) {
    String s = Arrays.toString(arr);  // Conversão repetida!
}

// ✅ Converter uma vez
String s = Arrays.toString(arr);
for (int i = 0; i < 1000000; i++) {
    processar(s);
}
```

## 📚 Resumo Executivo

`Arrays.toString()` converte array em String legível no formato `[elemento1, elemento2, ...]`.

**Sintaxe**:
```java
String s = Arrays.toString(array);
```

**Características**:
- **Formato**: `[a, b, c]` com colchetes e vírgulas
- **Null array**: retorna `"null"`
- **Array vazio**: retorna `"[]"`
- **Objetos**: chama `toString()` de cada elemento
- **Performance**: O(n) com StringBuilder interno

**Diferença de impressão direta**:
```java
System.out.println(arr);  // [I@15db9742 (referência)
System.out.println(Arrays.toString(arr));  // [1, 2, 3] (legível)
```

**Arrays multidimensionais**: use `Arrays.deepToString()`:
```java
Arrays.deepToString(matriz);  // [[1, 2], [3, 4]]
```

**Usos**: debug, logging, testes, mensagens de erro, documentação.

**Importar**: `import java.util.Arrays;`
