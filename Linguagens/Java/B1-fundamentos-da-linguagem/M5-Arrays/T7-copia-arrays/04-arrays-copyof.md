# Arrays.copyOf() - Cópia e Redimensionamento

## 🎯 Introdução e Definição

**`Arrays.copyOf()`** é um método estático que **cria uma cópia de um array**, opcionalmente **redimensionando** (aumentando ou diminuindo) o tamanho, retornando um **novo array** independente.

**Conceito central**: copia array do **início** até novo tamanho especificado, preenchendo com valores padrão se expandir ou truncando se reduzir.

**Sintaxe fundamental**:
```java
TipoArray[] novo = Arrays.copyOf(original, novoTamanho);
```

**Exemplo básico**:
```java
int[] original = {1, 2, 3, 4, 5};

// Cópia exata
int[] copia = Arrays.copyOf(original, 5);
// copia = [1, 2, 3, 4, 5]

// Expandir
int[] expandido = Arrays.copyOf(original, 8);
// expandido = [1, 2, 3, 4, 5, 0, 0, 0]

// Reduzir
int[] reduzido = Arrays.copyOf(original, 3);
// reduzido = [1, 2, 3]
```

**Retorno**: novo array com tamanho especificado.

**Vantagem**: sintaxe simples para copiar + redimensionar em uma operação.

## 📋 Fundamentos Teóricos

### 1️⃣ Cópia com Mesmo Tamanho

**Cópia exata** do array original:

```java
int[] original = {10, 20, 30, 40, 50};
int[] copia = Arrays.copyOf(original, original.length);

// Arrays independentes
System.out.println(Arrays.equals(original, copia));  // true (conteúdo igual)
System.out.println(original == copia);               // false (objetos diferentes)

// Modificações independentes
copia[0] = 999;
System.out.println(original[0]);  // 10 (inalterado)
```

**Equivalente a**:
```java
// clone()
int[] copia = original.clone();

// System.arraycopy()
int[] copia = new int[original.length];
System.arraycopy(original, 0, copia, 0, original.length);
```

### 2️⃣ Expandir Array - Preenche com Valores Padrão

**Aumentar tamanho**:

```java
int[] arr = {1, 2, 3};
int[] expandido = Arrays.copyOf(arr, 6);
// expandido = [1, 2, 3, 0, 0, 0]
//                      ↑  ↑  ↑
//              valores padrão (0 para int)
```

**Valores padrão por tipo**:
```java
// Numéricos → 0 / 0.0
int[] ints = Arrays.copyOf(new int[]{1, 2}, 4);
// [1, 2, 0, 0]

double[] doubles = Arrays.copyOf(new double[]{1.5, 2.5}, 4);
// [1.5, 2.5, 0.0, 0.0]

// boolean → false
boolean[] bools = Arrays.copyOf(new boolean[]{true}, 3);
// [true, false, false]

// char → '\u0000' (caractere nulo)
char[] chars = Arrays.copyOf(new char[]{'A', 'B'}, 4);
// ['A', 'B', '\u0000', '\u0000']

// Objetos → null
String[] strings = Arrays.copyOf(new String[]{"Ana", "Bob"}, 4);
// ["Ana", "Bob", null, null]
```

### 3️⃣ Reduzir Array - Trunca Elementos

**Diminuir tamanho** (descarta elementos finais):

```java
int[] original = {10, 20, 30, 40, 50};
int[] reduzido = Arrays.copyOf(original, 3);
// reduzido = [10, 20, 30]
// (40 e 50 descartados)

// Apenas primeiro elemento
int[] primeiro = Arrays.copyOf(original, 1);
// [10]

// Array vazio
int[] vazio = Arrays.copyOf(original, 0);
// []
```

**Uso prático - extrair prefixo**:
```java
String[] nomes = {"Ana", "Bob", "Carlos", "Diana", "Eve"};

// Primeiros 3
String[] top3 = Arrays.copyOf(nomes, 3);
// ["Ana", "Bob", "Carlos"]
```

### 4️⃣ Sobrecarga para Tipos Primitivos

Métodos específicos para cada tipo primitivo:

```java
// byte
byte[] bytes = {1, 2, 3};
byte[] copiaBytes = Arrays.copyOf(bytes, 5);

// short
short[] shorts = {10, 20};
short[] copiaShorts = Arrays.copyOf(shorts, 4);

// int
int[] ints = {1, 2, 3};
int[] copiaInts = Arrays.copyOf(ints, 3);

// long
long[] longs = {100L, 200L};
long[] copiaLongs = Arrays.copyOf(longs, 4);

// float
float[] floats = {1.5f, 2.5f};
float[] copiaFloats = Arrays.copyOf(floats, 3);

// double
double[] doubles = {1.5, 2.5};
double[] copiaDoubles = Arrays.copyOf(doubles, 3);

// char
char[] chars = {'A', 'B'};
char[] copiaChars = Arrays.copyOf(chars, 4);

// boolean
boolean[] bools = {true, false};
boolean[] copiaBools = Arrays.copyOf(bools, 3);
```

### 5️⃣ Arrays de Objetos - Cópia Superficial

**Objetos**: copia **referências**, não objetos:

```java
class Pessoa {
    String nome;
    Pessoa(String nome) { this.nome = nome; }
}

Pessoa[] original = {
    new Pessoa("Ana"),
    new Pessoa("Bob")
};

Pessoa[] copia = Arrays.copyOf(original, 3);

// Arrays diferentes...
System.out.println(original == copia);  // false

// ...mas elementos apontam para mesmos objetos
System.out.println(original[0] == copia[0]);  // true (!)

// Modificar objeto afeta ambos arrays
copia[0].nome = "Carlos";
System.out.println(original[0].nome);  // "Carlos" (!)

// Novo elemento é null
System.out.println(copia[2]);  // null
```

**Diagrama de memória**:
```
original → [ref1, ref2]
                ↓    ↓
copia    → [ref1, ref2, null]  (mesmas referências)
                ↓    ↓
           Pessoa("Ana")  Pessoa("Bob")
           (objetos compartilhados)
```

### 6️⃣ Arrays Genéricos com Conversão de Tipo

**Sobrecarga genérica**:
```java
public static <T,U> T[] copyOf(U[] original, int newLength, Class<? extends T[]> newType)
```

**Permite conversão de tipo**:

```java
Number[] numbers = {1, 2.5, 3};
Integer[] integers = Arrays.copyOf(numbers, 3, Integer[].class);
// ⚠️ ClassCastException em runtime se elementos não forem Integer

// Uso mais comum - não mudar tipo
String[] original = {"A", "B"};
String[] copia = Arrays.copyOf(original, 4);
```

### 7️⃣ vs Arrays.copyOfRange()

**copyOf()** - copia do **início**:
```java
int[] arr = {10, 20, 30, 40, 50};
int[] copia = Arrays.copyOf(arr, 3);
// [10, 20, 30] - sempre do índice 0
```

**copyOfRange()** - copia **intervalo específico**:
```java
int[] arr = {10, 20, 30, 40, 50};
int[] copia = Arrays.copyOfRange(arr, 1, 4);
// [20, 30, 40] - índices 1 a 3 (4 exclusivo)
```

**Comparação**:

| Método | Início | Flexibilidade |
|--------|--------|---------------|
| `copyOf(arr, len)` | Sempre do índice 0 | Apenas tamanho |
| `copyOfRange(arr, from, to)` | Qualquer posição | Início e fim |

**Quando usar cada um**:
```java
// copyOf - copiar do início
int[] primeiros = Arrays.copyOf(arr, 5);

// copyOfRange - copiar do meio
int[] meio = Arrays.copyOfRange(arr, 3, 7);
```

### 8️⃣ Tamanho Negativo - IllegalArgumentException

**Tamanho negativo** gera exceção:

```java
int[] arr = {1, 2, 3};

try {
    int[] copia = Arrays.copyOf(arr, -1);
} catch (NegativeArraySizeException e) {
    System.out.println("Tamanho não pode ser negativo");
}
```

**Tamanho zero** é válido:
```java
int[] vazio = Arrays.copyOf(arr, 0);
// [] (array vazio)
```

### 9️⃣ Uso em Estruturas de Dados Dinâmicas

**ArrayList interno** - redimensiona com copyOf():

```java
class MinhaLista {
    private int[] elementos;
    private int tamanho;
    
    public void adicionar(int valor) {
        if (tamanho == elementos.length) {
            // Expandir capacidade (geralmente 2x)
            elementos = Arrays.copyOf(elementos, elementos.length * 2);
        }
        elementos[tamanho++] = valor;
    }
    
    public void reduzirCapacidade() {
        // Ajustar ao tamanho exato
        elementos = Arrays.copyOf(elementos, tamanho);
    }
}
```

**Implementação típica de ArrayList**:
```java
public class ArrayList<E> {
    private Object[] elementData;
    private int size;
    
    private void grow() {
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);  // 1.5x
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
}
```

### 🔟 Performance e Implementação Interna

**Implementação** (simplificada):
```java
public static <T> T[] copyOf(T[] original, int newLength) {
    return (T[]) copyOf(original, newLength, original.getClass());
}

public static <T,U> T[] copyOf(U[] original, int newLength, Class<? extends T[]> newType) {
    T[] copy = (T[]) Array.newInstance(newType.getComponentType(), newLength);
    System.arraycopy(original, 0, copy, 0,
                     Math.min(original.length, newLength));
    return copy;
}
```

**Usa `System.arraycopy()`** internamente = **alta performance**.

**Complexidade**: **O(n)** onde n = `Math.min(original.length, newLength)`.

**Benchmark**:
```java
int[] arr = new int[1_000_000];

long inicio = System.nanoTime();
int[] copia = Arrays.copyOf(arr, 1_000_000);
long fim = System.nanoTime();

System.out.println("Tempo: " + (fim - inicio) / 1_000_000 + "ms");
// ~2-5ms para 1 milhão de elementos
```

## 🎯 Aplicabilidade

**1. Redimensionar Arrays Dinamicamente**:
```java
int[] arr = {1, 2, 3};
if (precisaMais) {
    arr = Arrays.copyOf(arr, arr.length * 2);
}
```

**2. Cópia Defensiva em Getters**:
```java
class Turma {
    private int[] notas;
    
    public int[] getNotas() {
        return Arrays.copyOf(notas, notas.length);  // Protege estado interno
    }
}
```

**3. Extrair Prefixo**:
```java
String[] logs = getLogs();
String[] primeiros10 = Arrays.copyOf(logs, Math.min(10, logs.length));
```

**4. Implementar Estruturas Dinâmicas**:
```java
public class Stack {
    private int[] data;
    
    private void ensureCapacity() {
        if (size == data.length) {
            data = Arrays.copyOf(data, data.length * 2);
        }
    }
}
```

**5. Converter Array Fixo para Flexível**:
```java
int[] fixo = {1, 2, 3};
// Criar versão com espaço extra
int[] flexivel = Arrays.copyOf(fixo, 10);
```

## ⚠️ Armadilhas Comuns

**1. Assumir Cópia Profunda**:
```java
Pessoa[] original = {new Pessoa("Ana")};
Pessoa[] copia = Arrays.copyOf(original, 1);

copia[0].nome = "Bob";
// ⚠️ original[0].nome também é "Bob"
```

**2. Esquecer de Atribuir Resultado**:
```java
int[] arr = {1, 2, 3};
Arrays.copyOf(arr, 5);  // ❌ Resultado perdido
// arr ainda tem tamanho 3

// ✓ Correto
arr = Arrays.copyOf(arr, 5);
```

**3. Tamanho Negativo**:
```java
Arrays.copyOf(arr, -1);  // ❌ NegativeArraySizeException
```

**4. Confundir com copyOfRange()**:
```java
// ❌ copyOf não permite especificar início
int[] meio = Arrays.copyOf(arr, 5);  // Sempre do índice 0

// ✓ Use copyOfRange para intervalo
int[] meio = Arrays.copyOfRange(arr, 2, 7);
```

**5. Arrays Multidimensionais - Cópia Rasa**:
```java
int[][] matriz = {{1, 2}, {3, 4}};
int[][] copia = Arrays.copyOf(matriz, 2);

copia[0][0] = 999;
// ⚠️ matriz[0][0] também é 999 (sub-arrays compartilhados)
```

## ✅ Boas Práticas

**1. Use para Copiar Arrays Simples**:
```java
int[] copia = Arrays.copyOf(original, original.length);
```

**2. Redimensione com Crescimento Exponencial**:
```java
// ✓ Cresce 2x (amortizado O(1) para inserções)
arr = Arrays.copyOf(arr, arr.length * 2);

// ❌ Evite crescimento linear
arr = Arrays.copyOf(arr, arr.length + 1);  // Lento para muitas inserções
```

**3. Valide Tamanho Antes de Copiar**:
```java
if (novoTamanho >= 0) {
    arr = Arrays.copyOf(arr, novoTamanho);
}
```

**4. Documente Cópia Defensiva**:
```java
/**
 * Retorna cópia do array (não afeta original)
 */
public int[] getDados() {
    return Arrays.copyOf(dados, dados.length);
}
```

**5. Use Math.min() para Segurança**:
```java
// Evita exceder tamanho original
int[] prefixo = Arrays.copyOf(arr, Math.min(n, arr.length));
```

**6. Prefira copyOfRange() para Subarrays**:
```java
// copyOf - apenas do início
int[] inicio = Arrays.copyOf(arr, 5);

// copyOfRange - qualquer posição
int[] meio = Arrays.copyOfRange(arr, 3, 8);
```

## 📚 Resumo Executivo

`Arrays.copyOf()` cria **nova cópia** de array com **tamanho especificado**.

**Sintaxe**:
```java
TipoArray[] novo = Arrays.copyOf(original, novoTamanho);
```

**Comportamentos**:
```java
int[] arr = {1, 2, 3, 4, 5};

// Mesmo tamanho
int[] igual = Arrays.copyOf(arr, 5);  // [1, 2, 3, 4, 5]

// Expandir (preenche com 0/null)
int[] maior = Arrays.copyOf(arr, 8);  // [1, 2, 3, 4, 5, 0, 0, 0]

// Reduzir (trunca)
int[] menor = Arrays.copyOf(arr, 3);  // [1, 2, 3]
```

**Valores padrão ao expandir**:
- Numéricos: `0` / `0.0`
- `boolean`: `false`
- `char`: `'\u0000'`
- Objetos: `null`

**Características**:
- **Sempre do início**: índice 0
- **Cria novo array**: independente do original
- **Cópia superficial**: objetos compartilham referências
- **Performance**: O(n) - usa `System.arraycopy()` internamente

**vs outros métodos**:
```java
// copyOf - do início
Arrays.copyOf(arr, 5)

// copyOfRange - intervalo qualquer
Arrays.copyOfRange(arr, 2, 7)

// clone - sempre tamanho completo
arr.clone()
```

**Uso típico**:
```java
// Redimensionar
arr = Arrays.copyOf(arr, arr.length * 2);

// Cópia defensiva
return Arrays.copyOf(internalArray, internalArray.length);
```

**Importar**: `import java.util.Arrays;`
