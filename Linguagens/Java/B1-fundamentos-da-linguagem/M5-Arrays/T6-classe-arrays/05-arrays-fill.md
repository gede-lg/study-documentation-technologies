# Arrays.fill() - Preenchimento de Arrays

## 🎯 Introdução e Definição

**`Arrays.fill()`** é um método estático que **preenche todos os elementos de um array com um valor específico**, ou um intervalo do array.

**Conceito central**: atribui o **mesmo valor** a todos (ou alguns) elementos do array de forma eficiente.

**Sintaxe fundamental**:
```java
Arrays.fill(array, valor);  // Preenche array completo
Arrays.fill(array, fromIndex, toIndex, valor);  // Preenche intervalo
```

**Exemplo básico**:
```java
int[] nums = new int[5];
Arrays.fill(nums, 7);
// nums = [7, 7, 7, 7, 7]
```

**Retorno**: `void` - modifica o array original.

`Arrays.fill()` é ideal para **inicialização rápida** de arrays.

## 📋 Fundamentos Teóricos

### 1️⃣ Preenchimento Completo do Array

Preenche **todos os elementos**:

```java
int[] nums = new int[4];
Arrays.fill(nums, 10);
// nums = [10, 10, 10, 10]

double[] valores = new double[3];
Arrays.fill(valores, 3.14);
// valores = [3.14, 3.14, 3.14]

char[] letras = new char[5];
Arrays.fill(letras, 'A');
// letras = ['A', 'A', 'A', 'A', 'A']
```

**Equivalente manual**:
```java
// Sem fill()
for (int i = 0; i < nums.length; i++) {
    nums[i] = 10;
}

// Com fill() - mais conciso e eficiente
Arrays.fill(nums, 10);
```

### 2️⃣ Preenchimento Parcial - Intervalo

Preenche **apenas um intervalo**:

```java
int[] arr = {1, 2, 3, 4, 5};
//           0  1  2  3  4 (índices)

Arrays.fill(arr, 1, 4, 9);  // Do índice 1 ao 3 (4 exclusivo)
// arr = [1, 9, 9, 9, 5]
//        ^  -------  ^ (apenas meio preenchido)
```

**Parâmetros**:
- `fromIndex`: **inclusivo** (começa aqui)
- `toIndex`: **exclusivo** (para antes daqui)

**Exemplos práticos**:
```java
int[] dados = new int[10];

// Preencher primeiros 5 elementos
Arrays.fill(dados, 0, 5, 100);
// [100, 100, 100, 100, 100, 0, 0, 0, 0, 0]

// Preencher últimos 3 elementos
Arrays.fill(dados, 7, 10, 200);
// [100, 100, 100, 100, 100, 0, 0, 200, 200, 200]

// Preencher meio
Arrays.fill(dados, 3, 7, 50);
// [100, 100, 100, 50, 50, 50, 50, 200, 200, 200]
```

### 3️⃣ Sobrecarga para Tipos Primitivos

Métodos específicos para cada tipo primitivo:

```java
// Inteiros
int[] ints = new int[3];
Arrays.fill(ints, 42);
// [42, 42, 42]

// Longs
long[] longs = new long[3];
Arrays.fill(longs, 1000L);
// [1000, 1000, 1000]

// Doubles
double[] doubles = new double[3];
Arrays.fill(doubles, 2.5);
// [2.5, 2.5, 2.5]

// Booleans
boolean[] flags = new boolean[3];
Arrays.fill(flags, true);
// [true, true, true]

// Chars
char[] chars = new char[3];
Arrays.fill(chars, 'X');
// ['X', 'X', 'X']

// Bytes, shorts, floats também suportados
```

### 4️⃣ Arrays de Objetos - Mesma Referência

**CRÍTICO**: para objetos, todos elementos apontam para a **mesma instância**:

```java
String valor = "Java";
String[] arr = new String[3];
Arrays.fill(arr, valor);
// arr = ["Java", "Java", "Java"]

// Todos apontam para o mesmo objeto
System.out.println(arr[0] == arr[1]);  // true (mesma referência)
```

**Problema com objetos mutáveis**:
```java
class Pessoa {
    String nome;
    Pessoa(String nome) { this.nome = nome; }
}

Pessoa p = new Pessoa("Ana");
Pessoa[] pessoas = new Pessoa[3];
Arrays.fill(pessoas, p);

// Todas referências apontam para o mesmo objeto
pessoas[0].nome = "Bob";
System.out.println(pessoas[1].nome);  // "Bob" (!) - mudança afeta todos
```

**Solução - criar instâncias separadas**:
```java
Pessoa[] pessoas = new Pessoa[3];
for (int i = 0; i < pessoas.length; i++) {
    pessoas[i] = new Pessoa("Ana");  // Nova instância cada vez
}
```

### 5️⃣ Inicialização com Valores Padrão

Arrays primitivos já inicializam com valores padrão:

```java
int[] nums = new int[5];
// nums = [0, 0, 0, 0, 0] (padrão int)

boolean[] flags = new boolean[3];
// flags = [false, false, false] (padrão boolean)
```

**Use `fill()` para valores não-padrão**:
```java
int[] nums = new int[5];
Arrays.fill(nums, -1);  // Diferente do padrão (0)
// nums = [-1, -1, -1, -1, -1]
```

**Arrays de objetos** inicializam com `null`:
```java
String[] arr = new String[3];
// arr = [null, null, null]

Arrays.fill(arr, "default");
// arr = ["default", "default", "default"]
```

### 6️⃣ Resetar Array

Restaurar array para estado inicial:

```java
int[] arr = {5, 10, 15, 20};

// Processar dados...
// ...

// Resetar para zero
Arrays.fill(arr, 0);
// arr = [0, 0, 0, 0]
```

**Resetar parte do array**:
```java
int[] cache = new int[100];
// Usar cache...

// Limpar apenas primeiros 10 elementos
Arrays.fill(cache, 0, 10, 0);
```

### 7️⃣ Complexidade de Tempo

**Complexidade**: **O(n)** onde n é o número de elementos preenchidos.

```java
// Array completo: O(n) onde n = array.length
Arrays.fill(arr, valor);

// Intervalo: O(toIndex - fromIndex)
Arrays.fill(arr, fromIndex, toIndex, valor);
```

**Benchmark**:
```java
int[] arr = new int[1_000_000];

long inicio = System.nanoTime();
Arrays.fill(arr, 42);
long fim = System.nanoTime();

System.out.println("Tempo: " + (fim - inicio) / 1_000_000 + "ms");
// ~2-5ms para 1 milhão de elementos
```

### 8️⃣ Arrays Multidimensionais

Para arrays 2D+, preenche **cada sub-array**:

```java
int[][] matriz = new int[3][4];

// ❌ Não preenche matriz completa
Arrays.fill(matriz, 5);  // ERRO! Tipo incompatível

// ✓ Preencher cada linha
for (int[] linha : matriz) {
    Arrays.fill(linha, 5);
}
// matriz = [[5, 5, 5, 5],
//           [5, 5, 5, 5],
//           [5, 5, 5, 5]]
```

**Preencher intervalo em 2D**:
```java
int[][] matriz = new int[3][4];

// Preencher apenas primeiras 2 colunas de cada linha
for (int[] linha : matriz) {
    Arrays.fill(linha, 0, 2, 9);
}
// matriz = [[9, 9, 0, 0],
//           [9, 9, 0, 0],
//           [9, 9, 0, 0]]
```

### 9️⃣ Validação de Índices

**Índices inválidos** geram `ArrayIndexOutOfBoundsException`:

```java
int[] arr = new int[5];  // Índices válidos: 0-4

Arrays.fill(arr, 0, 10, 5);  // ❌ toIndex > length
// ArrayIndexOutOfBoundsException

Arrays.fill(arr, -1, 3, 5);  // ❌ fromIndex < 0
// ArrayIndexOutOfBoundsException

Arrays.fill(arr, 3, 2, 5);  // ❌ fromIndex > toIndex
// IllegalArgumentException
```

**Validação segura**:
```java
if (fromIndex >= 0 && toIndex <= arr.length && fromIndex < toIndex) {
    Arrays.fill(arr, fromIndex, toIndex, valor);
}
```

### 🔟 Uso com Stream API

Criar array preenchido com Stream:

```java
// Usando fill() tradicional
int[] arr = new int[5];
Arrays.fill(arr, 10);

// Usando Stream (Java 8+)
int[] arr2 = IntStream.generate(() -> 10)
                      .limit(5)
                      .toArray();
// Ambos: [10, 10, 10, 10, 10]
```

**Stream com lógica complexa**:
```java
// fill() - apenas valores constantes
Arrays.fill(arr, 10);

// Stream - pode ter lógica
int[] arr3 = IntStream.range(0, 5)
                      .map(i -> i * 2)
                      .toArray();
// [0, 2, 4, 6, 8]
```

## 🎯 Aplicabilidade

**1. Inicialização de Arrays**:
```java
int[] scores = new int[100];
Arrays.fill(scores, -1);  // -1 indica "não computado"
```

**2. Resetar Estado**:
```java
boolean[] visitados = new boolean[n];
// Processar grafo...
Arrays.fill(visitados, false);  // Resetar para nova busca
```

**3. Preenchimento de Cache**:
```java
int[] cache = new int[1000];
Arrays.fill(cache, -1);  // -1 = valor não calculado
```

**4. Matrizes de Distância/Custo**:
```java
int[][] dist = new int[n][n];
for (int[] linha : dist) {
    Arrays.fill(linha, Integer.MAX_VALUE);  // Distância "infinita"
}
```

**5. Buffers Temporários**:
```java
char[] buffer = new char[256];
Arrays.fill(buffer, '\0');  // Preencher com caractere nulo
```

## ⚠️ Armadilhas Comuns

**1. Objetos - Mesma Referência**:
```java
Pessoa p = new Pessoa("Ana");
Pessoa[] arr = new Pessoa[3];
Arrays.fill(arr, p);

arr[0].nome = "Bob";
// ⚠️ arr[1].nome também é "Bob" (mesma referência)
```

**2. Esquecer que Modifica o Array**:
```java
int[] arr = {1, 2, 3, 4, 5};
Arrays.fill(arr, 0);
// ⚠️ arr perdeu valores originais: [0, 0, 0, 0, 0]
```

**3. Índices Invertidos**:
```java
Arrays.fill(arr, 5, 2, valor);  // ❌ fromIndex > toIndex
```

**4. Tentar Preencher Matriz Diretamente**:
```java
int[][] matriz = new int[3][4];
Arrays.fill(matriz, 5);  // ❌ Erro de tipo
```

**5. Usar fill() Quando Precisa de Valores Diferentes**:
```java
// ❌ fill() não funciona aqui
Arrays.fill(arr, ???);  // Queremos [1, 2, 3, 4, 5]

// ✓ Use loop ou Stream
for (int i = 0; i < arr.length; i++) {
    arr[i] = i + 1;
}
```

## ✅ Boas Práticas

**1. Use fill() para Valores Constantes**:
```java
Arrays.fill(arr, valorPadrao);
```

**2. Crie Novas Instâncias para Objetos**:
```java
for (int i = 0; i < arr.length; i++) {
    arr[i] = new Objeto();  // Não use fill() aqui
}
```

**3. Valide Índices Antes de fill() Parcial**:
```java
if (fromIndex < toIndex && toIndex <= arr.length) {
    Arrays.fill(arr, fromIndex, toIndex, valor);
}
```

**4. Documente Valores Sentinela**:
```java
// -1 indica posição não visitada
Arrays.fill(visitados, -1);
```

**5. Combine com copyOf() para Arrays Imutáveis**:
```java
int[] template = new int[10];
Arrays.fill(template, 5);

int[] copia = Arrays.copyOf(template, template.length);
```

**6. Use Stream para Lógica Complexa**:
```java
// fill() - valores simples
Arrays.fill(arr, 0);

// Stream - valores baseados em lógica
int[] arr2 = IntStream.range(0, 10)
                      .map(i -> i * i)
                      .toArray();
```

## 📚 Resumo Executivo

`Arrays.fill()` preenche array (completo ou intervalo) com valor específico.

**Sintaxe**:
```java
Arrays.fill(array, valor);  // Array completo
Arrays.fill(array, fromIndex, toIndex, valor);  // Intervalo
```

**Retorno**: `void` (modifica array original)

**Parâmetros**:
- `fromIndex`: inclusivo
- `toIndex`: exclusivo

**Características**:
- **Complexidade**: O(n)
- **In-place**: modifica array original
- **Objetos**: todos elementos apontam para mesma instância (⚠️)

**Exemplo completo**:
```java
int[] arr = new int[5];
Arrays.fill(arr, 10);
// arr = [10, 10, 10, 10, 10]

Arrays.fill(arr, 1, 4, 20);
// arr = [10, 20, 20, 20, 10]
```

**Arrays multidimensionais**:
```java
for (int[] linha : matriz) {
    Arrays.fill(linha, valor);
}
```

**Importante**: para objetos, cria **múltiplas referências ao mesmo objeto**, não cópias.

**Importar**: `import java.util.Arrays;`
