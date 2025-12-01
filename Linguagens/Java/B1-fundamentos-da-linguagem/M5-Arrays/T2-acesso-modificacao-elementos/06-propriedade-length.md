# Propriedade length

## 🎯 Introdução e Definição

A propriedade **length** é um **campo público final** (`public final int`) presente em todos os arrays Java, armazenando o **número total de elementos** do array. Diferente de Strings e Collections, `length` em arrays é um **campo** (field), **não um método**, e portanto **não usa parênteses** `()`.

**Sintaxe**:
```java
int tamanho = nomeArray.length;  // ✅ Correto: campo (sem parênteses)
int tamanho = nomeArray.length();  // ❌ Erro de compilação
```

**Exemplo fundamental**:
```java
int[] numeros = {10, 20, 30, 40, 50};
System.out.println(numeros.length);  // 5 (número de elementos)

String[] palavras = new String[10];
System.out.println(palavras.length);  // 10 (capacidade alocada)
```

**Características essenciais**:
- **Imutável**: definido na criação, nunca muda
- **Final**: não pode ser reatribuído
- **Zero-indexed**: índices válidos vão de `0` a `length - 1`
- **Público**: acessível diretamente sem getters

## 📋 Fundamentos Teóricos

### 1️⃣ Campo Final - Não é Método

A distinção entre **campo** e **método** é crítica:

```java
int[] arr = {10, 20, 30};

// ✅ CORRETO: campo (sem parênteses)
int tamanho = arr.length;

// ❌ ERRO DE COMPILAÇÃO: tentar chamar como método
int tamanho = arr.length();  // error: cannot find symbol
```

**Comparação com outros tipos**:
```java
String texto = "Java";
texto.length()  // ✅ Método (com parênteses)

List<Integer> lista = new ArrayList<>();
lista.size()    // ✅ Método (com parênteses)

int[] arr = {1, 2, 3};
arr.length      // ✅ Campo (sem parênteses)
```

**Tabela comparativa**:

| Tipo | Sintaxe | Tipo de Membro |
|------|---------|----------------|
| `array` | `arr.length` | Campo público final |
| `String` | `str.length()` | Método público |
| `Collection` | `col.size()` | Método público |

### 2️⃣ Imutabilidade - Valor Fixo na Criação

O valor de `length` é **definido na criação** e **nunca muda**:

```java
int[] arr = new int[5];
System.out.println(arr.length);  // 5

// Não há como redimensionar array
// arr.length = 10;  // ❌ ERRO: cannot assign value to final variable

// Mesmo modificando elementos, length permanece
arr[0] = 100;
arr[4] = 500;
System.out.println(arr.length);  // 5 (inalterado)
```

**Redimensionamento**: exige criar **novo array** e copiar elementos:
```java
int[] antigo = {1, 2, 3};
int[] novo = new int[antigo.length * 2];  // Dobra tamanho

for (int i = 0; i < antigo.length; i++) {
    novo[i] = antigo[i];
}
// Ou: int[] novo = Arrays.copyOf(antigo, antigo.length * 2);
```

### 3️⃣ Uso Essencial em Loops For-Index

`length` define o **limite superior** em iterações:

```java
int[] numeros = {10, 20, 30, 40};

for (int i = 0; i < numeros.length; i++) {  // i < 4
    System.out.println(numeros[i]);
}

// Iteração reversa
for (int i = numeros.length - 1; i >= 0; i--) {  // i começa em 3
    System.out.println(numeros[i]);
}
```

**Padrão universal**: `i < arr.length` garante que `i` varia de `0` a `length - 1`.

### 4️⃣ Cálculo do Último Índice Válido

Índice máximo é **sempre** `length - 1`:

```java
int[] arr = {10, 20, 30, 40, 50};

int primeiro = arr[0];              // Índice 0
int ultimo = arr[arr.length - 1];   // Índice 4 (5 - 1)
int penultimo = arr[arr.length - 2]; // Índice 3 (5 - 2)

// ❌ ERRO COMUM: usar length diretamente
int erro = arr[arr.length];  // ArrayIndexOutOfBoundsException!
```

**Regra**: para acessar último elemento, use `arr[arr.length - 1]`.

### 5️⃣ Validação de Índices

`length` é fundamental para **verificar limites válidos**:

```java
public int obter(int[] arr, int indice) {
    if (indice >= 0 && indice < arr.length) {  // length define limite superior
        return arr[indice];
    } else {
        throw new IndexOutOfBoundsException(
            "Índice " + indice + " inválido. Válidos: 0-" + (arr.length - 1)
        );
    }
}

// Validação de intervalo
public boolean intervaloValido(int[] arr, int inicio, int fim) {
    return inicio >= 0 && fim < arr.length && inicio <= fim;
}
```

### 6️⃣ Arrays Vazios - Length Zero

Arrays podem ter **zero elementos** (`length = 0`):

```java
int[] vazio = new int[0];  // Array vazio válido
System.out.println(vazio.length);  // 0

// Não há índices válidos!
int x = vazio[0];  // ❌ ArrayIndexOutOfBoundsException

// Verificação antes de acessar
if (vazio.length > 0) {
    int primeiro = vazio[0];  // Seguro
} else {
    System.out.println("Array vazio");
}
```

**Casos reais**: resultados de filtragens, buscas sem resultados, inicializações dinâmicas.

### 7️⃣ Arrays Multidimensionais - Length por Dimensão

Cada dimensão tem seu próprio `length`:

```java
int[][] matriz = new int[3][4];  // 3 linhas, 4 colunas

matriz.length;        // 3 (número de linhas/arrays internos)
matriz[0].length;     // 4 (número de colunas na linha 0)
matriz[1].length;     // 4 (número de colunas na linha 1)

// Arrays irregulares (jagged arrays)
int[][] irregular = {{1, 2}, {3, 4, 5}, {6}};

irregular.length;     // 3 (3 linhas)
irregular[0].length;  // 2 (linha 0 tem 2 elementos)
irregular[1].length;  // 3 (linha 1 tem 3 elementos)
irregular[2].length;  // 1 (linha 2 tem 1 elemento)
```

**Loops aninhados seguros**:
```java
for (int i = 0; i < matriz.length; i++) {       // Linhas
    for (int j = 0; j < matriz[i].length; j++) { // Colunas da linha i
        System.out.print(matriz[i][j] + " ");
    }
    System.out.println();
}
```

### 8️⃣ Cache de Length em Loops (Otimização Opcional)

Cachear `length` pode **evitar reacessos** (raramente necessário em Java moderno):

```java
// Sem cache (padrão recomendado)
for (int i = 0; i < arr.length; i++) {
    processar(arr[i]);
}

// Com cache (otimização prematura na maioria dos casos)
int n = arr.length;
for (int i = 0; i < n; i++) {
    processar(arr[i]);
}
```

**Nota**: JVM moderna otimiza acesso a `length`, cache manual raramente traz benefício.

### 9️⃣ Comparação com Capacidade em Estruturas Dinâmicas

Arrays têm `length` **fixo**; estruturas dinâmicas separam **tamanho** e **capacidade**:

```java
// Array: length = capacidade (fixo)
int[] arr = new int[10];
arr.length;  // 10 (sempre)

// ArrayList: size ≤ capacity (dinâmico)
List<Integer> lista = new ArrayList<>(10);  // Capacidade inicial 10
lista.size();  // 0 (vazio, apesar de capacidade 10)

lista.add(5);
lista.size();  // 1 (tamanho lógico)
// Capacidade interna permanece >= 1 (gerenciada automaticamente)
```

**Implicação**: `arr.length` inclui **todos os slots**, mesmo não preenchidos.

### 🔟 Length como Condição de Parada em Algoritmos

Frequentemente usado como **limite em algoritmos**:

```java
// Busca linear
public int buscar(int[] arr, int valor) {
    for (int i = 0; i < arr.length; i++) {  // length define fim
        if (arr[i] == valor) {
            return i;
        }
    }
    return -1;
}

// Bubble sort
public void bubbleSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        for (int j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

// Encontrar elemento do meio
public int meio(int[] arr) {
    return arr[arr.length / 2];  // length/2 dá índice central
}
```

## 🎯 Aplicabilidade

**1. Loops Seguros**:
```java
for (int i = 0; i < arr.length; i++) {  // Sempre correto
    processar(arr[i]);
}
```

**2. Acessar Último Elemento**:
```java
int ultimo = arr[arr.length - 1];
```

**3. Validação de Índices**:
```java
if (indice >= 0 && indice < arr.length) {
    // Acesso seguro
}
```

**4. Verificar Array Vazio**:
```java
if (arr.length == 0) {
    System.out.println("Array vazio");
}
```

**5. Copiar Arrays**:
```java
int[] copia = new int[original.length];
for (int i = 0; i < original.length; i++) {
    copia[i] = original[i];
}
```

**6. Redimensionar Arrays**:
```java
int[] novo = Arrays.copyOf(antigo, antigo.length * 2);
```

**7. Cálculo de Índice do Meio**:
```java
int meio = arr.length / 2;
int elementoMeio = arr[meio];
```

## ⚠️ Armadilhas Comuns

**1. Usar Parênteses (Confundir com Método)**:
```java
int tamanho = arr.length();  // ❌ ERRO DE COMPILAÇÃO
int tamanho = arr.length;    // ✅ Correto
```

**2. Acessar arr[arr.length]**:
```java
int[] arr = {10, 20, 30};
int x = arr[arr.length];  // ❌ ArrayIndexOutOfBoundsException (índice 3 inválido)
int x = arr[arr.length - 1];  // ✅ Correto (índice 2, último elemento)
```

**3. Usar <= em Loop For**:
```java
for (int i = 0; i <= arr.length; i++) {  // ❌ Itera além dos limites
    arr[i] = 0;  // Exception quando i = arr.length
}

for (int i = 0; i < arr.length; i++) {  // ✅ Correto
    arr[i] = 0;
}
```

**4. Confundir com String.length() ou List.size()**:
```java
String texto = "Java";
texto.length()  // ✅ Método

List<Integer> lista = new ArrayList<>();
lista.size()    // ✅ Método

int[] arr = {1, 2, 3};
arr.length      // ✅ Campo (sem parênteses!)
```

**5. Assumir que length > 0**:
```java
int primeiro = arr[0];  // ⚠️ Pode falhar se arr.length == 0

// Correto:
if (arr.length > 0) {
    int primeiro = arr[0];
}
```

## ✅ Boas Práticas

**1. Sempre Use < (Não <=) em Loops**:
```java
for (int i = 0; i < arr.length; i++) {  // ✅ Padrão universal
    processar(arr[i]);
}
```

**2. Acessar Último Elemento com length - 1**:
```java
int ultimo = arr[arr.length - 1];  // ✅ Explícito e seguro
```

**3. Verificar Arrays Vazios Antes de Acessar**:
```java
if (arr.length > 0) {
    int valor = arr[0];
} else {
    System.out.println("Array vazio");
}
```

**4. Preferir For-Each Quando Não Precisar do Índice**:
```java
// ❌ Desnecessariamente complexo
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}

// ✅ Mais simples
for (int valor : arr) {
    System.out.println(valor);
}
```

**5. Validar Intervalos com length**:
```java
public void copiarIntervalo(int[] fonte, int[] destino, int inicio, int fim) {
    if (inicio < 0 || fim >= fonte.length || inicio > fim) {
        throw new IllegalArgumentException("Intervalo inválido");
    }
    for (int i = inicio; i <= fim; i++) {
        destino[i - inicio] = fonte[i];
    }
}
```

**6. Documentar Quando length Importa**:
```java
/**
 * @param arr Array com pelo menos 1 elemento (arr.length > 0)
 */
public int encontrarMaximo(int[] arr) {
    if (arr.length == 0) {
        throw new IllegalArgumentException("Array vazio");
    }
    // ...
}
```

**7. Usar length para Criar Arrays de Mesmo Tamanho**:
```java
int[] arr1 = {1, 2, 3, 4};
int[] arr2 = new int[arr1.length];  // Mesmo tamanho que arr1
```

**8. Comparar Tamanhos de Arrays**:
```java
if (arr1.length != arr2.length) {
    throw new IllegalArgumentException("Arrays de tamanhos diferentes");
}
```

## 📚 Resumo Executivo

A propriedade **length** é um **campo público final** (não método) que armazena o **número de elementos** do array. Sintaxe: `arr.length` (sem parênteses).

**Características principais**:
- **Imutável**: definido na criação, nunca muda
- **Campo**: acesso direto sem `()`
- **Zero-indexed**: índices válidos: `0` a `length - 1`

**Usos essenciais**:
- **Loops**: `for (int i = 0; i < arr.length; i++)`
- **Último índice**: `arr[arr.length - 1]`
- **Validação**: `indice >= 0 && indice < arr.length`
- **Arrays vazios**: `if (arr.length > 0)`

**Diferenças críticas**:
- Arrays: `arr.length` (campo)
- Strings: `str.length()` (método)
- Collections: `list.size()` (método)

**Armadilhas**: não use `arr.length()` com parênteses, não acesse `arr[arr.length]` (fora dos limites), sempre use `<` (não `<=`) em loops.
