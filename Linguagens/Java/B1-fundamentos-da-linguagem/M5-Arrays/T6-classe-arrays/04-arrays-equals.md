# Arrays.equals() - Comparação de Arrays

## 🎯 Introdução e Definição

**`Arrays.equals()`** é um método estático que **compara dois arrays elemento por elemento**, verificando se possuem o **mesmo conteúdo** (valores), retornando `true` ou `false`.

**Conceito central**: diferente do operador `==` que compara **referências**, `equals()` compara os **valores** dos elementos.

**Sintaxe fundamental**:
```java
boolean iguais = Arrays.equals(array1, array2);
```

**Exemplo básico**:
```java
int[] arr1 = {1, 2, 3};
int[] arr2 = {1, 2, 3};

boolean iguais = Arrays.equals(arr1, arr2);
// iguais = true (mesmo conteúdo)

boolean mesmaRef = (arr1 == arr2);
// mesmaRef = false (referências diferentes)
```

**Retorno**:
- `true`: arrays têm mesmo tamanho e elementos correspondentes são iguais
- `false`: tamanhos diferentes ou algum elemento difere

`Arrays.equals()` é essencial para **comparação de conteúdo** de arrays.

## 📋 Fundamentos Teóricos

### 1️⃣ Comparação vs Operador ==

**Operador ==** compara **referências** (endereços de memória):

```java
int[] arr1 = {1, 2, 3};
int[] arr2 = {1, 2, 3};
int[] arr3 = arr1;

System.out.println(arr1 == arr2);  // false (objetos diferentes)
System.out.println(arr1 == arr3);  // true (mesma referência)
```

**Arrays.equals()** compara **valores**:

```java
System.out.println(Arrays.equals(arr1, arr2));  // true (valores iguais)
System.out.println(Arrays.equals(arr1, arr3));  // true (valores iguais)
```

**Visualização**:
```
arr1 → [1, 2, 3] @ 0x1234
arr2 → [1, 2, 3] @ 0x5678
arr3 → [1, 2, 3] @ 0x1234 (mesma referência que arr1)

arr1 == arr2  → false (0x1234 != 0x5678)
Arrays.equals(arr1, arr2)  → true (conteúdo idêntico)
```

### 2️⃣ Comparação Elemento por Elemento

**Processo**:
1. Verifica se referências são iguais (atalho - retorna `true`)
2. Verifica se algum é `null` (retorna `false` se apenas um for)
3. Compara tamanhos (retorna `false` se diferentes)
4. Compara cada elemento com `==` (primitivos) ou `.equals()` (objetos)

**Exemplo com primitivos**:
```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 4};

Arrays.equals(a, b);
// Compara: a[0] == b[0]  → 1 == 1 ✓
//          a[1] == b[1]  → 2 == 2 ✓
//          a[2] == b[2]  → 3 == 4 ✗
// Retorna: false
```

**Exemplo com objetos**:
```java
String[] a = {"Ana", "Bob"};
String[] b = {"Ana", "Bob"};

Arrays.equals(a, b);
// Compara: a[0].equals(b[0])  → "Ana".equals("Ana") ✓
//          a[1].equals(b[1])  → "Bob".equals("Bob") ✓
// Retorna: true
```

### 3️⃣ Sobrecarga para Tipos Primitivos

Métodos específicos para cada tipo primitivo:

```java
// Inteiros
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
Arrays.equals(a, b);  // true

// Doubles
double[] x = {1.5, 2.5};
double[] y = {1.5, 2.5};
Arrays.equals(x, y);  // true

// Chars
char[] c1 = {'a', 'b'};
char[] c2 = {'a', 'b'};
Arrays.equals(c1, c2);  // true

// Booleans
boolean[] b1 = {true, false};
boolean[] b2 = {true, false};
Arrays.equals(b1, b2);  // true
```

**Todos os 8 primitivos** (`byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`) têm métodos dedicados.

### 4️⃣ Comparação de Arrays de Objetos

Para objetos, usa `.equals()` de cada elemento:

```java
String[] a = {"Ana", "Bob"};
String[] b = {"Ana", "Bob"};

Arrays.equals(a, b);  // true (String.equals() compara conteúdo)
```

**Classe customizada**:
```java
class Pessoa {
    String nome;
    int idade;
    
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Pessoa)) return false;
        Pessoa outra = (Pessoa) obj;
        return this.nome.equals(outra.nome) && this.idade == outra.idade;
    }
}

Pessoa[] arr1 = {new Pessoa("Ana", 25), new Pessoa("Bob", 30)};
Pessoa[] arr2 = {new Pessoa("Ana", 25), new Pessoa("Bob", 30)};

Arrays.equals(arr1, arr2);  // true (Pessoa.equals() retorna true)
```

**Sem `equals()` implementado**:
```java
class Item {
    int valor;
    Item(int valor) { this.valor = valor; }
    // Sem @Override equals()
}

Item[] a = {new Item(1)};
Item[] b = {new Item(1)};

Arrays.equals(a, b);  // false (usa Object.equals() - compara referências)
```

### 5️⃣ Tratamento de null

**Arrays null**:
```java
int[] a = null;
int[] b = null;
Arrays.equals(a, b);  // true (ambos null)

int[] c = {1, 2, 3};
Arrays.equals(a, c);  // false (um null, outro não)
```

**Elementos null** (apenas objetos):
```java
String[] a = {"Ana", null, "Carlos"};
String[] b = {"Ana", null, "Carlos"};

Arrays.equals(a, b);  // true (null == null)
```

```java
String[] a = {"Ana", null};
String[] b = {"Ana", "Bob"};

Arrays.equals(a, b);  // false (null != "Bob")
```

### 6️⃣ Comparação de Tamanhos Diferentes

Arrays de tamanhos diferentes **sempre** retornam `false`:

```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3, 4};

Arrays.equals(a, b);  // false (tamanhos: 3 != 4)
```

```java
int[] a = {1, 2, 3};
int[] b = {1, 2};

Arrays.equals(a, b);  // false
```

### 7️⃣ Arrays Multidimensionais - deepEquals()

`equals()` **não** funciona corretamente para arrays 2D+:

```java
int[][] a = {{1, 2}, {3, 4}};
int[][] b = {{1, 2}, {3, 4}};

Arrays.equals(a, b);  // ❌ false (compara referências dos sub-arrays)
```

**Use `Arrays.deepEquals()`**:

```java
Arrays.deepEquals(a, b);  // ✓ true (compara recursivamente)
```

**Exemplo 2D**:
```java
String[][] matriz1 = {{"A", "B"}, {"C", "D"}};
String[][] matriz2 = {{"A", "B"}, {"C", "D"}};

Arrays.equals(matriz1, matriz2);      // false
Arrays.deepEquals(matriz1, matriz2);  // true
```

**Exemplo 3D**:
```java
int[][][] cubo1 = {{{1, 2}, {3, 4}}, {{5, 6}, {7, 8}}};
int[][][] cubo2 = {{{1, 2}, {3, 4}}, {{5, 6}, {7, 8}}};

Arrays.deepEquals(cubo1, cubo2);  // true
```

### 8️⃣ Complexidade de Tempo

**Melhor caso** (referências iguais ou primeiro elemento diferente): **O(1)**
```java
int[] a = {1, 2, 3};
int[] b = a;
Arrays.equals(a, b);  // O(1) - mesma referência
```

**Pior caso** (todos elementos iguais): **O(n)**
```java
int[] a = new int[1_000_000];
int[] b = new int[1_000_000];
// Preencher com valores idênticos...
Arrays.equals(a, b);  // O(n) - compara todos os 1M elementos
```

**Em geral**: O(n) onde n é o tamanho do array.

### 9️⃣ Comparação de Intervalos

Não existe método nativo para comparar intervalos, mas pode-se implementar:

```java
public static boolean equalsRange(int[] a, int[] b, int start, int end) {
    if (a == b) return true;
    if (a == null || b == null) return false;
    
    for (int i = start; i < end; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

int[] arr1 = {1, 2, 3, 4, 5};
int[] arr2 = {9, 2, 3, 4, 8};

equalsRange(arr1, arr2, 1, 4);  // true (índices 1-3 são iguais)
```

### 🔟 Precisão de Floats e Doubles

**Problema de precisão**:
```java
double[] a = {0.1 + 0.2};  // 0.30000000000000004
double[] b = {0.3};

Arrays.equals(a, b);  // false (0.30000000000000004 != 0.3)
```

**Solução**: comparação com epsilon:
```java
public static boolean equalsWithEpsilon(double[] a, double[] b, double epsilon) {
    if (a.length != b.length) return false;
    
    for (int i = 0; i < a.length; i++) {
        if (Math.abs(a[i] - b[i]) > epsilon) {
            return false;
        }
    }
    return true;
}

equalsWithEpsilon(a, b, 0.0001);  // true
```

## 🎯 Aplicabilidade

**1. Verificação em Testes Unitários**:
```java
@Test
public void testProcessar() {
    int[] esperado = {1, 2, 3};
    int[] resultado = processarDados();
    
    assertTrue(Arrays.equals(esperado, resultado));
}
```

**2. Comparação de Resultados**:
```java
int[] metodo1 = calcularMetodo1();
int[] metodo2 = calcularMetodo2();

if (Arrays.equals(metodo1, metodo2)) {
    System.out.println("Métodos produzem mesmo resultado");
}
```

**3. Validação de Entrada**:
```java
int[] entrada = lerEntrada();
int[] esperado = {1, 2, 3};

if (!Arrays.equals(entrada, esperado)) {
    throw new IllegalArgumentException("Entrada inválida");
}
```

**4. Cache de Resultados**:
```java
Map<ArrayWrapper, String> cache = new HashMap<>();

class ArrayWrapper {
    int[] array;
    
    @Override
    public boolean equals(Object obj) {
        return Arrays.equals(this.array, ((ArrayWrapper) obj).array);
    }
}
```

**5. Comparação de Matrizes**:
```java
int[][] matriz1 = lerMatriz();
int[][] matriz2 = lerMatriz();

if (Arrays.deepEquals(matriz1, matriz2)) {
    System.out.println("Matrizes idênticas");
}
```

## ⚠️ Armadilhas Comuns

**1. Usar == Ao Invés de equals()**:
```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};

if (a == b) { }  // ❌ Sempre false (referências diferentes)
if (Arrays.equals(a, b)) { }  // ✓ Correto
```

**2. Usar equals() com Arrays Multidimensionais**:
```java
int[][] a = {{1, 2}, {3, 4}};
int[][] b = {{1, 2}, {3, 4}};

Arrays.equals(a, b);  // ❌ false (use deepEquals)
Arrays.deepEquals(a, b);  // ✓ true
```

**3. Classe Sem equals() Implementado**:
```java
class Item {
    int valor;
}

Item[] a = {new Item()};
Item[] b = {new Item()};

Arrays.equals(a, b);  // false (compara referências)
```

**4. Comparar Tipos Diferentes**:
```java
int[] a = {1, 2, 3};
Integer[] b = {1, 2, 3};

// Arrays.equals(a, b);  // ❌ Erro de compilação (tipos incompatíveis)
```

**5. Ignorar Precisão de Floats**:
```java
double[] a = {0.1 + 0.2};
double[] b = {0.3};

Arrays.equals(a, b);  // false (precisão)
```

## ✅ Boas Práticas

**1. Use equals() para Comparar Conteúdo**:
```java
if (Arrays.equals(arr1, arr2)) {
    // Conteúdo igual
}
```

**2. Use deepEquals() para Arrays Multidimensionais**:
```java
if (Arrays.deepEquals(matriz1, matriz2)) {
    // Matrizes iguais
}
```

**3. Implemente equals() em Classes Customizadas**:
```java
class Pessoa {
    @Override
    public boolean equals(Object obj) {
        // Implementação correta
    }
}
```

**4. Valide null Antes de Comparar**:
```java
if (arr1 != null && arr2 != null && Arrays.equals(arr1, arr2)) {
    // Seguro
}
```

**5. Use Epsilon para Floats/Doubles**:
```java
// Implementar método customizado com tolerância
boolean equals = equalsWithEpsilon(arr1, arr2, 0.0001);
```

**6. Documente Comportamento de equals() em Classes**:
```java
/**
 * Compara arrays usando Arrays.equals()
 */
@Override
public boolean equals(Object obj) {
    // ...
}
```

## 📚 Resumo Executivo

`Arrays.equals()` compara **conteúdo** de dois arrays elemento por elemento.

**Sintaxe**:
```java
boolean iguais = Arrays.equals(array1, array2);
```

**Retorno**:
- `true`: mesmo tamanho + elementos correspondentes iguais
- `false`: tamanhos diferentes ou elementos diferentes

**Comparação**:
- **Primitivos**: usa `==`
- **Objetos**: usa `.equals()` de cada elemento
- **Arrays multidimensionais**: use `Arrays.deepEquals()`

**vs Operador ==**:
```java
arr1 == arr2          // Compara referências
Arrays.equals(arr1, arr2)  // Compara conteúdo
```

**Complexidade**: O(n)

**null-safe**:
```java
Arrays.equals(null, null)  // true
Arrays.equals(null, arr)   // false
```

**Exemplo completo**:
```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
int[] c = {1, 2, 4};

Arrays.equals(a, b);  // true
Arrays.equals(a, c);  // false
a == b;               // false (referências diferentes)
```

**Importar**: `import java.util.Arrays;`
