# Atribuição de Referência - Não é Cópia

## 🎯 Introdução e Definição

**Atribuição de referência** (`=`) **não cria cópia** do array - apenas faz duas variáveis apontarem para o **mesmo array na memória**. É um dos erros mais comuns de iniciantes em Java.

**Conceito central**: operador `=` copia a **referência** (endereço de memória), não o **conteúdo** do array.

**Exemplo fundamental**:
```java
int[] arr1 = {1, 2, 3};
int[] arr2 = arr1;  // ⚠️ NÃO é cópia!

// arr1 e arr2 apontam para o MESMO array
arr2[0] = 999;
System.out.println(arr1[0]);  // 999 (!)
```

**Sintaxe**:
```java
TipoArray[] variavel2 = variavel1;  // Apenas copia referência
```

**Implicação**: modificações via qualquer variável afetam o mesmo array!

## 📋 Fundamentos Teóricos

### 1️⃣ Arrays São Objetos - Tipos Referência

**Arrays em Java são objetos**, armazenados no **heap**:

```java
int[] arr = {10, 20, 30};
// arr é uma REFERÊNCIA (endereço) para o array no heap
```

**Diagrama de memória**:
```
Stack (variáveis locais)    Heap (objetos)
┌─────────────┐            ┌──────────────┐
│ arr: 0x1234 │───────────→│ [10, 20, 30] │
└─────────────┘            └──────────────┘
```

**Atribuição copia apenas a referência**:
```java
int[] arr1 = {10, 20, 30};
int[] arr2 = arr1;  // Copia 0x1234, não o conteúdo

Stack                       Heap
┌──────────────┐           ┌──────────────┐
│ arr1: 0x1234 │──────────→│ [10, 20, 30] │
├──────────────┤      ↗    └──────────────┘
│ arr2: 0x1234 │─────┘
└──────────────┘
(mesma referência = mesmo array)
```

### 2️⃣ Comportamento com Primitivos vs Arrays

**Primitivos** (int, double, etc.) **copiam valor**:

```java
int a = 10;
int b = a;  // Copia o VALOR 10

b = 20;
System.out.println(a);  // 10 (inalterado)
```

**Arrays copiam referência**:

```java
int[] arr1 = {10, 20};
int[] arr2 = arr1;  // Copia REFERÊNCIA

arr2[0] = 999;
System.out.println(arr1[0]);  // 999 (afetado!)
```

**Por quê?**
- **Primitivos**: são **tipos valor** (armazenados diretamente na variável)
- **Arrays**: são **tipos referência** (variável armazena endereço)

### 3️⃣ Modificações Afetam Ambas Variáveis

**Qualquer modificação** é visível por todas as referências:

```java
int[] original = {1, 2, 3, 4, 5};
int[] alias = original;  // Mesmo array

// Modificar via alias
alias[0] = 999;
alias[2] = 777;

// Mudanças visíveis via original
System.out.println(Arrays.toString(original));
// [999, 2, 777, 4, 5]

// E vice-versa
original[4] = 111;
System.out.println(Arrays.toString(alias));
// [999, 2, 777, 4, 111]
```

**Não há "original" vs "cópia"** - ambas são **nomes diferentes para o mesmo array**.

### 4️⃣ Comparação de Referências - Operador ==

**Operador `==`** compara **referências** (endereços):

```java
int[] arr1 = {1, 2, 3};
int[] arr2 = arr1;
int[] arr3 = {1, 2, 3};

System.out.println(arr1 == arr2);  // true (mesma referência)
System.out.println(arr1 == arr3);  // false (referências diferentes)
```

**Mesmo conteúdo, referências diferentes**:
```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};

// Conteúdo idêntico...
System.out.println(Arrays.equals(a, b));  // true

// ...mas objetos diferentes
System.out.println(a == b);  // false
```

### 5️⃣ Reatribuição de Variável

**Reatribuir variável** muda apenas a referência local:

```java
int[] arr1 = {1, 2, 3};
int[] arr2 = arr1;  // Ambos apontam para {1, 2, 3}

// Criar novo array e atribuir a arr2
arr2 = new int[]{10, 20, 30};

// Agora apontam para arrays diferentes
System.out.println(Arrays.toString(arr1));  // [1, 2, 3]
System.out.println(Arrays.toString(arr2));  // [10, 20, 30]
```

**Diagrama**:
```
Antes da reatribuição:
arr1 ──→ [1, 2, 3]
arr2 ──┘

Depois de arr2 = new int[]{10, 20, 30}:
arr1 ──→ [1, 2, 3]
arr2 ──→ [10, 20, 30]
```

**Importante**: reatribuição não afeta o array original, apenas a variável local.

### 6️⃣ Passagem de Arrays para Métodos

**Arrays são passados por referência**:

```java
public static void modificar(int[] arr) {
    arr[0] = 999;  // Modifica array original
}

public static void reatribuir(int[] arr) {
    arr = new int[]{10, 20, 30};  // Não afeta original
}

public static void main(String[] args) {
    int[] nums = {1, 2, 3};
    
    modificar(nums);
    System.out.println(nums[0]);  // 999 (modificado!)
    
    reatribuir(nums);
    System.out.println(Arrays.toString(nums));  // [999, 2, 3] (inalterado)
}
```

**Por quê?**
- `modificar()`: altera **conteúdo** do array apontado
- `reatribuir()`: muda apenas **cópia local** da referência (parâmetro)

### 7️⃣ Arrays Multidimensionais - Múltiplos Níveis de Referência

**Arrays 2D** são arrays de referências:

```java
int[][] matriz1 = {{1, 2}, {3, 4}};
int[][] matriz2 = matriz1;  // Copia referência principal

// Mesmo array principal
System.out.println(matriz1 == matriz2);  // true

// E mesmos sub-arrays
System.out.println(matriz1[0] == matriz2[0]);  // true

// Modificar via matriz2 afeta matriz1
matriz2[0][0] = 999;
System.out.println(matriz1[0][0]);  // 999 (!)
```

**Reatribuir sub-array**:
```java
int[][] m1 = {{1, 2}, {3, 4}};
int[][] m2 = m1;

// Reatribuir primeira linha de m2
m2[0] = new int[]{10, 20};

// m1[0] ainda aponta para linha original
System.out.println(Arrays.toString(m1[0]));  // [1, 2]
System.out.println(Arrays.toString(m2[0]));  // [10, 20]
```

### 8️⃣ Garbage Collection - Arrays Não Referenciados

**Arrays sem referências** são coletados pelo GC:

```java
int[] arr1 = {1, 2, 3};
int[] arr2 = arr1;

// Reatribuir ambas referências
arr1 = new int[]{10, 20};
arr2 = new int[]{30, 40};

// {1, 2, 3} não tem mais referências → elegível para GC
```

**Memory leak** - referências não intencionais:
```java
class Container {
    private int[] data;
    
    public void setData(int[] newData) {
        this.data = newData;  // Mantém referência
        // Array não será coletado enquanto Container existir
    }
}
```

### 9️⃣ Alias - Múltiplos Nomes para Mesmo Array

**Alias** = referências múltiplas ao mesmo objeto:

```java
int[] original = {1, 2, 3};
int[] alias1 = original;
int[] alias2 = original;
int[] alias3 = alias1;

// Todos apontam para o mesmo array
System.out.println(original == alias1);  // true
System.out.println(alias1 == alias2);    // true
System.out.println(alias2 == alias3);    // true

// Modificação via qualquer alias afeta todos
alias3[0] = 999;
System.out.println(original[0]);  // 999
```

**Cuidado**: aliases podem tornar código confuso e propenso a bugs.

### 🔟 Como Realmente Copiar um Array

**Para copiar, use métodos específicos**:

**1. clone()**:
```java
int[] original = {1, 2, 3};
int[] copia = original.clone();

copia[0] = 999;
System.out.println(original[0]);  // 1 (independente)
```

**2. Arrays.copyOf()**:
```java
int[] copia = Arrays.copyOf(original, original.length);
```

**3. System.arraycopy()**:
```java
int[] copia = new int[original.length];
System.arraycopy(original, 0, copia, 0, original.length);
```

**4. Loop manual**:
```java
int[] copia = new int[original.length];
for (int i = 0; i < original.length; i++) {
    copia[i] = original[i];
}
```

## 🎯 Aplicabilidade

**1. Entender Efeitos Colaterais**:
```java
void processar(int[] dados) {
    dados[0] = 0;  // ⚠️ Modifica array do chamador
}
```

**2. Evitar Bugs em Retornos**:
```java
class Cache {
    private int[] dados;
    
    // ❌ Expõe referência interna
    public int[] getDados() {
        return dados;  // Permite modificação externa
    }
    
    // ✓ Retorna cópia
    public int[] getDados() {
        return Arrays.copyOf(dados, dados.length);
    }
}
```

**3. Debugging - Verificar Referências**:
```java
if (arr1 == arr2) {
    System.out.println("Mesmo array!");
}
```

**4. Otimização de Memória**:
```java
// Reutilizar array em vez de copiar (se seguro)
int[] shared = {1, 2, 3};
processar1(shared);
processar2(shared);  // Economia de memória
```

**5. Documentação de APIs**:
```java
/**
 * @param arr Array de entrada (será modificado!)
 */
public void ordenar(int[] arr) { }
```

## ⚠️ Armadilhas Comuns

**1. Assumir que = Copia**:
```java
int[] original = {1, 2, 3};
int[] copia = original;  // ❌ NÃO é cópia!

copia[0] = 999;
// ⚠️ original[0] também é 999
```

**2. Comparar Arrays com ==**:
```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};

if (a == b) { }  // ❌ Sempre false (use Arrays.equals)
```

**3. Modificar Array Retornado**:
```java
int[] arr = getArray();
arr[0] = 999;  // ⚠️ Pode modificar estado interno da classe
```

**4. Esquecer que Parâmetros São Referências**:
```java
void metodo(int[] arr) {
    arr[0] = 0;  // ⚠️ Modifica array original
}
```

**5. Alias Não Intencional**:
```java
int[] backup = dados;  // ❌ NÃO é backup!
processar(dados);
// backup também foi modificado
```

## ✅ Boas Práticas

**1. Use Clone ou Copy para Cópias Reais**:
```java
int[] copia = original.clone();  // ✓ Cópia independente
```

**2. Documente Se Métodos Modificam Arrays**:
```java
/**
 * Ordena o array IN-PLACE (modifica original)
 */
public void ordenar(int[] arr) { }
```

**3. Retorne Cópias Defensivas**:
```java
public int[] getDados() {
    return Arrays.copyOf(dados, dados.length);
}
```

**4. Use Arrays.equals() para Comparar Conteúdo**:
```java
if (Arrays.equals(arr1, arr2)) {
    // Conteúdo igual
}
```

**5. Evite Aliases Desnecessários**:
```java
// ❌ Confuso
int[] temp = arr;
processar(temp);

// ✓ Mais claro
processar(arr);
```

**6. Marque Parâmetros como final Se Não Reatribuir**:
```java
public void processar(final int[] arr) {
    // arr = new int[10];  // Erro de compilação
    arr[0] = 10;  // OK (modifica conteúdo)
}
```

## 📚 Resumo Executivo

**Atribuição `=` em arrays** copia apenas a **referência**, não o conteúdo.

**Comportamento**:
```java
int[] arr1 = {1, 2, 3};
int[] arr2 = arr1;  // Copia referência

// arr1 e arr2 apontam para o MESMO array
arr2[0] = 999;
System.out.println(arr1[0]);  // 999 (!)
```

**Arrays são tipos referência**:
- Variável armazena **endereço de memória**
- `=` copia **endereço**, não **conteúdo**
- Modificações via qualquer referência afetam o mesmo array

**Comparação**:

| Tipo | Comportamento de = |
|------|-------------------|
| Primitivos (int, double) | Copia VALOR |
| Arrays, objetos | Copia REFERÊNCIA |

**Para copiar array**:
```java
int[] copia = original.clone();
// Ou
int[] copia = Arrays.copyOf(original, original.length);
```

**Comparação de conteúdo**:
```java
arr1 == arr2          // Compara referências
Arrays.equals(arr1, arr2)  // Compara conteúdo
```

**Passagem para métodos**:
```java
void metodo(int[] arr) {
    arr[0] = 999;  // Modifica array original
    arr = new int[10];  // Não afeta original (cópia local da referência)
}
```

**Regra de ouro**: `=` em arrays **NUNCA cria cópia** - apenas mais uma referência ao mesmo array!
