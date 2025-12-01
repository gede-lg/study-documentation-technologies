# ArrayIndexOutOfBoundsException

## 🎯 Introdução e Definição

**ArrayIndexOutOfBoundsException** é uma **exceção não verificada** (unchecked exception, subclasse de `RuntimeException`) lançada quando se tenta acessar um índice **inválido** em um array. Índices válidos em Java vão de `0` até `length - 1`.

**Condições de lançamento**:
- Índice **negativo**: `arr[-1]`
- Índice **≥ length**: `arr[arr.length]` ou `arr[5]` em array de tamanho 3

**Sintaxe de erro**:
```
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3
```

**Exemplo básico**:
```java
int[] numeros = {10, 20, 30};  // Índices válidos: 0, 1, 2

int x = numeros[5];   // ❌ EXCEPTION: 5 >= 3
int y = numeros[-1];  // ❌ EXCEPTION: -1 < 0
int z = numeros[numeros.length];  // ❌ EXCEPTION: 3 >= 3
```

Esta exceção é **evitável** com validação adequada e é um dos erros mais comuns em programação Java.

## 📋 Fundamentos Teóricos

### 1️⃣ Causas Fundamentais - Índices Negativos

Índices negativos **nunca são válidos** em arrays Java:

```java
int[] arr = {10, 20, 30};

int valor1 = arr[-1];   // ❌ EXCEPTION
int valor2 = arr[-5];   // ❌ EXCEPTION

// Erro comum: confundir com Python (índices negativos)
// Java NÃO suporta indexação reversa com negativos
```

**Razão**: Java usa aritmética de ponteiros internamente; índices negativos levariam a endereços de memória inválidos.

### 2️⃣ Causas Fundamentais - Índices ≥ length

Acessar índice igual ou maior que `length` excede os limites do array:

```java
int[] arr = {10, 20, 30};  // length = 3, índices válidos: 0, 1, 2

int x = arr[3];            // ❌ EXCEPTION: 3 >= 3
int y = arr[5];            // ❌ EXCEPTION: 5 >= 3
int z = arr[arr.length];   // ❌ EXCEPTION: arr[3]
```

**Erro clássico**: confundir `length` (tamanho) com último índice (`length - 1`).

### 3️⃣ Off-by-One Errors em Loops

Erro mais comum: usar `<=` em vez de `<` na condição do loop:

```java
int[] arr = {10, 20, 30};

// ❌ ERRADO: <= itera até i = 3
for (int i = 0; i <= arr.length; i++) {
    System.out.println(arr[i]);  // Exception quando i = 3
}

// ✅ CORRETO: < itera até i = 2
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}

// ❌ ERRADO: começa em 1 e vai até length
for (int i = 1; i <= arr.length; i++) {
    System.out.println(arr[i]);  // Exception quando i = 3
}

// ✅ CORRETO: começa em 1 e vai até length-1
for (int i = 1; i <= arr.length - 1; i++) {
    System.out.println(arr[i]);
}
```

**Regra de ouro**: sempre use `i < arr.length` em loops padrão.

### 4️⃣ Validação Preventiva com Condicionais

Verificar intervalo válido **antes** de acessar:

```java
public int obterValor(int[] arr, int indice) {
    if (indice >= 0 && indice < arr.length) {
        return arr[indice];  // Seguro
    } else {
        System.err.println("Índice inválido: " + indice);
        return -1;  // Valor padrão ou alternativa
    }
}

// Com throw de exceção personalizada
public int obterValorSeguro(int[] arr, int indice) {
    if (indice < 0 || indice >= arr.length) {
        throw new IllegalArgumentException(
            "Índice " + indice + " inválido. Válidos: [0, " + (arr.length - 1) + "]"
        );
    }
    return arr[indice];
}
```

**Prática recomendada**: validar em APIs públicas, confiar em código interno se já validado.

### 5️⃣ Try-Catch para Tratamento de Exceções

Capturar exceção quando **validação prévia é impraticável**:

```java
try {
    int valor = arr[indiceDoUsuario];
    System.out.println("Valor: " + valor);
} catch (ArrayIndexOutOfBoundsException e) {
    System.err.println("Erro: índice " + indiceDoUsuario + " inválido!");
    System.err.println("Índices válidos: 0 a " + (arr.length - 1));
}

// Com mensagem customizada
try {
    processar(arr[indice]);
} catch (ArrayIndexOutOfBoundsException e) {
    throw new IllegalStateException("Falha ao processar índice " + indice, e);
}
```

**Nota**: preferir **validação prévia** a try-catch quando possível (mais eficiente).

### 6️⃣ Arrays Vazios - Edge Case Importante

Arrays com `length = 0` têm **nenhum índice válido**:

```java
int[] vazio = new int[0];  // length = 0, nenhum índice válido

int x = vazio[0];  // ❌ EXCEPTION: não há índice 0
int y = vazio[-1]; // ❌ EXCEPTION

// Verificar antes de acessar
if (vazio.length > 0) {
    int primeiro = vazio[0];  // Seguro
} else {
    System.out.println("Array está vazio");
}
```

**Casos reais**: resultados de buscas, entradas de usuário, filtragens.

### 7️⃣ Arrays Multidimensionais

Cada dimensão tem seu próprio intervalo válido:

```java
int[][] matriz = new int[3][4];  // 3 linhas, 4 colunas

int x = matriz[3][0];   // ❌ EXCEPTION: linha 3 (válidas: 0-2)
int y = matriz[0][5];   // ❌ EXCEPTION: coluna 5 (válidas: 0-3)
int z = matriz[-1][2];  // ❌ EXCEPTION: linha negativa

// Validação completa
if (i >= 0 && i < matriz.length && j >= 0 && j < matriz[i].length) {
    int valor = matriz[i][j];  // Seguro
}
```

**Arrays irregulares** (jagged arrays): cada linha pode ter tamanho diferente:

```java
int[][] irregular = {{1, 2}, {3, 4, 5}, {6}};

irregular[0][2];  // ❌ EXCEPTION: linha 0 tem length = 2 (índices 0-1)
irregular[2][1];  // ❌ EXCEPTION: linha 2 tem length = 1 (índice 0)

// Validação por linha
if (j >= 0 && j < irregular[i].length) {
    int valor = irregular[i][j];
}
```

### 8️⃣ Índices Calculados e Expressões Dinâmicas

Expressões como índices exigem **validação cuidadosa**:

```java
int indice = calcularIndice();  // Método que retorna índice
if (indice >= 0 && indice < arr.length) {
    arr[indice] = 10;
}

// Expressões aritméticas
int i = 5;
arr[i * 2];  // ⚠️ Se arr.length <= 10, exceção!

// Scanner de usuário
Scanner sc = new Scanner(System.in);
int pos = sc.nextInt();
if (pos >= 0 && pos < arr.length) {
    System.out.println(arr[pos]);
} else {
    System.out.println("Posição inválida! Use 0 a " + (arr.length - 1));
}
```

**Regra**: **sempre validar** índices de fontes externas (usuário, cálculos, APIs).

### 9️⃣ Debugging e Diagnóstico de Stack Trace

Entender a mensagem de erro para localizar o problema:

```
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3
    at Main.main(Main.java:15)
```

**Informações**:
- **Index 5**: índice tentado
- **length 3**: tamanho do array (índices válidos: 0-2)
- **Main.java:15**: linha exata do erro

**Debugging**:
```java
// Adicionar prints de diagnóstico
System.out.println("Tentando acessar índice: " + i);
System.out.println("Array length: " + arr.length);
int valor = arr[i];  // Linha do erro
```

### 🔟 Prevenção com For-Each

For-each **elimina o risco** de índices inválidos:

```java
// ❌ Risco de erro de índice
for (int i = 0; i <= arr.length; i++) {  // Off-by-one
    System.out.println(arr[i]);
}

// ✅ Sem risco (não usa índices)
for (int valor : arr) {
    System.out.println(valor);
}

// Limitação: sem acesso ao índice
for (int valor : arr) {
    // Como saber a posição atual? Não dá com for-each
}
```

**Quando usar**: sempre que não precisar do índice explicitamente.

## 🎯 Aplicabilidade

**1. Validação de Entrada de Usuário**:
```java
Scanner sc = new Scanner(System.in);
System.out.print("Posição (0-" + (arr.length - 1) + "): ");
int pos = sc.nextInt();
if (pos >= 0 && pos < arr.length) {
    System.out.println("Valor: " + arr[pos]);
} else {
    System.out.println("Posição inválida!");
}
```

**2. APIs Públicas Robustas**:
```java
public class ArrayWrapper {
    private int[] data;

    public int get(int index) {
        if (index < 0 || index >= data.length) {
            throw new IndexOutOfBoundsException(
                "Índice " + index + " inválido (válidos: 0-" + (data.length - 1) + ")"
            );
        }
        return data[index];
    }
}
```

**3. Debugging de Loops**:
```java
for (int i = 0; i < arr.length; i++) {
    System.out.println("Processando índice " + i + " de " + (arr.length - 1));
    processar(arr[i]);
}
```

**4. Algoritmos de Busca Segura**:
```java
public int buscarIndice(int[] arr, int valor) {
    for (int i = 0; i < arr.length; i++) {  // Sempre < length
        if (arr[i] == valor) {
            return i;
        }
    }
    return -1;  // Não encontrado
}
```

**5. Operações em Subarrays**:
```java
// Processar última metade
for (int i = arr.length / 2; i < arr.length; i++) {
    processar(arr[i]);
}
```

## ⚠️ Armadilhas Comuns

**1. Usar <= em Loop For**:
```java
for (int i = 0; i <= arr.length; i++) {  // ❌
    arr[i] = 0;  // Exception quando i = length
}
```

**2. Confundir length com Último Índice**:
```java
int ultimo = arr[arr.length];  // ❌ Deveria ser arr[arr.length - 1]
```

**3. Esquecer Validação em Índices Dinâmicos**:
```java
int pos = calcularPosicao();
arr[pos] = 10;  // ❌ Sem validação!
```

**4. Loops Reversos Incorretos**:
```java
for (int i = arr.length; i >= 0; i--) {  // ❌ Começa em length
    System.out.println(arr[i]);  // Exception na primeira iteração
}

// Correto:
for (int i = arr.length - 1; i >= 0; i--) {  // ✅ Começa em length-1
    System.out.println(arr[i]);
}
```

**5. Arrays Multidimensionais Irregulares**:
```java
int[][] irregular = {{1, 2}, {3}};
int x = irregular[1][1];  // ❌ Linha 1 tem apenas 1 elemento (índice 0)
```

## ✅ Boas Práticas

**1. Validação com Padrão Guard Clause**:
```java
public void processar(int[] arr, int indice) {
    if (arr == null) {
        throw new IllegalArgumentException("Array null");
    }
    if (indice < 0 || indice >= arr.length) {
        throw new IndexOutOfBoundsException("Índice inválido: " + indice);
    }
    // Lógica principal
    arr[indice] *= 2;
}
```

**2. Sempre Use < (não <=) em Loops**:
```java
for (int i = 0; i < arr.length; i++) {  // ✅ Padrão correto
    processar(arr[i]);
}
```

**3. Preferir For-Each Quando Possível**:
```java
for (int valor : arr) {  // Elimina risco de índice
    System.out.println(valor);
}
```

**4. Validar Antes de Loops com Índices Calculados**:
```java
int inicio = calcularInicio();
int fim = calcularFim();

if (inicio >= 0 && fim < arr.length && inicio <= fim) {
    for (int i = inicio; i <= fim; i++) {
        processar(arr[i]);
    }
}
```

**5. Testar Edge Cases (Limites)**:
```java
@Test
public void testAcessoLimites() {
    int[] arr = {10, 20, 30};

    assertEquals(10, arr[0]);          // Primeiro
    assertEquals(30, arr[arr.length - 1]);  // Último

    assertThrows(ArrayIndexOutOfBoundsException.class, () -> arr[-1]);
    assertThrows(ArrayIndexOutOfBoundsException.class, () -> arr[arr.length]);
}
```

**6. Mensagens de Erro Descritivas**:
```java
if (indice < 0 || indice >= arr.length) {
    throw new IllegalArgumentException(
        String.format("Índice %d fora do intervalo [0, %d]", indice, arr.length - 1)
    );
}
```

**7. Verificar Arrays Vazios Antes de Acessar**:
```java
if (arr.length > 0) {
    int primeiro = arr[0];
} else {
    System.out.println("Array vazio");
}
```

## 📚 Resumo Executivo

**ArrayIndexOutOfBoundsException** ocorre ao acessar índices **inválidos**: negativos ou ≥ `length`. Exceção **não verificada** (unchecked), evitável com validação.

**Causas principais**:
- Índice negativo: `arr[-1]`
- Índice ≥ length: `arr[arr.length]`
- Off-by-one em loops: `i <= arr.length`

**Prevenção**:
- **Validação**: `indice >= 0 && indice < arr.length`
- **Loops corretos**: `i < arr.length` (não `<=`)
- **For-each**: elimina risco quando índice não é necessário
- **Teste edge cases**: arrays vazios, primeiro/último elementos

**Debugging**: stack trace indica índice tentado, tamanho do array e linha do erro. Sempre validar **índices dinâmicos** (entrada de usuário, cálculos) antes de acessar.
