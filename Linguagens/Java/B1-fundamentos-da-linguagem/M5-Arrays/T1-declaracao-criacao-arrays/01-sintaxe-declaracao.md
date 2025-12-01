# Sintaxe de Declaração

## 🎯 Introdução e Definição

A **declaração de array** em Java define uma **variável de referência** capaz de apontar para um array, mas **não cria o array em si**. A declaração apenas estabelece o **tipo de dados** que o array conterá quando for criado posteriormente.

**Conceito central**: Declaração reserva um nome de variável e especifica que ela referenciará um array de determinado tipo, mas o valor inicial é `null` (não aponta para nenhum array).

**Sintaxe preferida (Java Style Guide)**:
```java
tipo[] nomeVariavel;  // Colchetes após o tipo
```

**Exemplo fundamental**:
```java
int[] numeros;  // Declarado, mas null (não aponta para array)
numeros = new int[5];  // Agora criado e inicializado
```

A declaração **separa a definição da criação**, permitindo flexibilidade na inicialização do array em momentos diferentes do código.

## 📋 Fundamentos Teóricos

### 1️⃣ Sintaxe Preferida - Colchetes Após o Tipo

O **Java Style Guide** recomenda posicionar `[]` **após o tipo**, não após o nome da variável:

```java
// ✅ PREFERIDO: colchetes no tipo
int[] numeros;
String[] nomes;
double[] valores;
boolean[] flags;
char[] caracteres;

// Leitura clara: "numeros é um array de int"
```

**Justificativa**: enfatiza que **array é parte do tipo**, não uma propriedade da variável.

### 2️⃣ Sintaxe Alternativa - Estilo C (Não Recomendada)

Java **permite** sintaxe ao estilo C por compatibilidade, mas **não é recomendada**:

```java
// ⚠️ VÁLIDO, mas NÃO RECOMENDADO
int numeros[];
String nomes[];
double valores[];

// Leitura menos clara: "numeros (que é array) de int"
```

**Problema**: cria inconsistência em declarações múltiplas (ver fundamento 3).

### 3️⃣ Múltiplas Declarações - Comportamento Diferente

A posição dos colchetes **afeta múltiplas declarações** na mesma linha:

```java
// Colchetes no tipo: TODOS são arrays
int[] a, b, c;  // a, b, c são arrays de int

// Colchetes no nome: APENAS o primeiro é array
int x[], y, z;  // x é array, y e z são int simples!

// Mistura (possível, mas confuso)
int[] arr1, arr2[], arr3;  
// arr1: int[]
// arr2: int[][]  (bidimensional!)
// arr3: int[]
```

**Regra de ouro**: **uma declaração por linha** para evitar confusão.

### 4️⃣ Tamanho NÃO Especificado na Declaração

Diferente de linguagens como C, Java **não permite** tamanho na declaração:

```java
// ❌ ERRO DE COMPILAÇÃO
int[5] numeros;
String[10] nomes;
double[100] valores;

// ✅ CORRETO: tamanho especificado na criação
int[] numeros;           // Declaração
numeros = new int[5];    // Criação com tamanho
```

**Razão**: declaração e criação são etapas **separadas** em Java.

### 5️⃣ Valor Inicial é null

Variável de array declarada mas **não inicializada** contém `null`:

```java
int[] arr;  // arr = null

System.out.println(arr);        // null
System.out.println(arr.length); // ❌ NullPointerException!

// Deve ser inicializada antes do uso
arr = new int[3];  // Agora aponta para array válido
System.out.println(arr.length); // 3 (OK)
```

**Cuidado**: usar array null causa `NullPointerException`.

### 6️⃣ Arrays Multidimensionais

Declaração de arrays de múltiplas dimensões usa **múltiplos pares de colchetes**:

```java
// Bidimensional (matriz)
int[][] matriz;
String[][] tabela;

// Tridimensional (cubo)
int[][][] cubo;
double[][][] tensor;

// Quatro dimensões (raro)
int[][][][] hiperCubo;
```

**Sintaxe alternativa** (não recomendada):
```java
int matriz[][];    // Válido, mas evite
int[] matriz[];    // Híbrido (confuso)
int[][] matriz;    // ✅ Preferido
```

### 7️⃣ Declaração como Parâmetro de Método

Arrays podem ser **parâmetros de métodos**:

```java
public static int somar(int[] numeros) {
    int soma = 0;
    for (int num : numeros) {
        soma += num;
    }
    return soma;
}

// Chamada
int resultado = somar(new int[]{10, 20, 30});
```

**Nota**: parâmetro é **referência** - modificações no array afetam o original.

### 8️⃣ Declaração como Tipo de Retorno

Métodos podem **retornar arrays**:

```java
public static int[] criarSequencia(int tamanho) {
    int[] sequencia = new int[tamanho];
    for (int i = 0; i < tamanho; i++) {
        sequencia[i] = i + 1;
    }
    return sequencia;  // Retorna referência ao array
}

// Uso
int[] nums = criarSequencia(5);  // {1, 2, 3, 4, 5}
```

### 9️⃣ Declaração de Variáveis de Instância e Classe

Arrays podem ser **campos de classe**:

```java
public class Turma {
    // Variável de instância
    private String[] alunos;
    
    // Variável de classe (static)
    private static int[] notas;
    
    public Turma(int quantidadeAlunos) {
        alunos = new String[quantidadeAlunos];  // Criado no construtor
    }
}
```

### 🔟 Convenções de Nomenclatura

Nomes de variáveis de array seguem **convenções Java**:

```java
// ✅ BOM: nomes descritivos no plural
int[] numeros;
String[] nomes;
double[] salarios;
boolean[] respostas;

// ⚠️ MENOS CLARO: singular (possível, mas confuso)
int[] numero;    // Array de números, não "um número"
String[] nome;   // Array de nomes

// ✅ BOM: contexto específico
int[] idades;
String[] codigosPostais;
double[] temperaturasMaximas;

// ❌ RUIM: nomes genéricos
int[] arr;    // O que contém?
String[] s;   // Muito genérico
```

**Convenção**: **plural** indica coleção múltipla.

## 🎯 Aplicabilidade

**1. Definição de Estruturas de Dados**:
```java
public class Estatisticas {
    private int[] valores;
    private double[] medias;
    private String[] categorias;
}
```

**2. Preparar Variáveis para Receber Arrays**:
```java
int[] numeros;  // Declaração
if (condicao) {
    numeros = new int[10];
} else {
    numeros = new int[5];
}
```

**3. Parâmetros de Métodos**:
```java
public void processar(int[] dados, String[] categorias) {
    // Processar arrays
}
```

**4. Retorno de Métodos**:
```java
public int[] gerarNumerosPrimos(int quantidade) {
    // Lógica
    return primos;
}
```

**5. Variáveis Locais em Algoritmos**:
```java
public void ordenar() {
    int[] temporario;  // Declarado
    temporario = new int[tamanho];  // Criado quando necessário
}
```

**6. Arrays Temporários**:
```java
int[] backup;  // Declaração
backup = Arrays.copyOf(original, original.length);  // Criação
```

## ⚠️ Armadilhas Comuns

**1. Tentar Usar Array Sem Inicializar**:
```java
int[] arr;
System.out.println(arr[0]);  // ❌ NullPointerException (arr é null)

// Correto:
int[] arr = new int[5];
System.out.println(arr[0]);  // ✅ 0
```

**2. Especificar Tamanho na Declaração**:
```java
int[10] numeros;  // ❌ ERRO DE COMPILAÇÃO

// Correto:
int[] numeros = new int[10];  // ✅
```

**3. Confusão em Múltiplas Declarações**:
```java
int x[], y, z;  // Apenas x é array! y e z são int

// Correto (todos arrays):
int[] x, y, z;  // ✅ Todos são int[]
```

**4. Misturar Estilos de Sintaxe**:
```java
int[] a, b[], c;  // Confuso! a é int[], b é int[][], c é int[]

// Correto:
int[] a, c;
int[][] b;
```

**5. Esquecer que Declaração Não Aloca Memória**:
```java
int[] arr;  // Apenas declara, não aloca
arr.length;  // ❌ NPE

// Correto:
int[] arr = new int[5];  // Declara E aloca
arr.length;  // ✅ 5
```

## ✅ Boas Práticas

**1. Sempre Use Sintaxe Java (Colchetes no Tipo)**:
```java
// ✅ PREFERIDO
int[] numeros;
String[] nomes;

// ❌ EVITAR
int numeros[];
String nomes[];
```

**2. Uma Declaração Por Linha**:
```java
// ✅ CLARO
int[] a;
int[] b;
int[] c;

// ⚠️ PODE CONFUNDIR
int[] a, b, c;  // OK, mas menos legível
```

**3. Declare Próximo ao Uso**:
```java
// ✅ BOM: declarado próximo ao uso
public void processar() {
    // ... lógica ...
    int[] resultados = new int[10];  // Declarado quando necessário
    // ... usar resultados ...
}
```

**4. Nomes Descritivos no Plural**:
```java
// ✅ DESCRITIVO
int[] idades;
String[] nomesCompletos;
double[] salariosLiquidos;

// ❌ GENÉRICO
int[] arr;
String[] s;
```

**5. Inicialize Imediatamente Quando Possível**:
```java
// ✅ PREFERIDO: declaração + criação
int[] numeros = new int[10];

// ⚠️ SEPARADO: apenas se necessário
int[] numeros;
// ... lógica para determinar tamanho ...
numeros = new int[tamanho];
```

**6. Documente Contratos de Arrays em APIs Públicas**:
```java
/**
 * @param valores Array não-null de valores (tamanho >= 1)
 * @return Array de médias móveis (tamanho = valores.length - 1)
 */
public double[] calcularMediasMoveis(int[] valores) {
    // ...
}
```

**7. Use Final para Arrays Constantes**:
```java
private static final int[] DIAS_POR_MES = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
```

## 📚 Resumo Executivo

A **declaração de array** define uma **variável de referência** usando sintaxe `tipo[] nome`, mas **não cria o array** (valor inicial `null`). Java **separa declaração de criação**, diferente de C.

**Sintaxe preferida**: `int[] arr` (colchetes **após o tipo**), não `int arr[]` (estilo C).

**Características**:
- Valor inicial: `null`
- Tamanho **não especificado** na declaração
- Arrays multidimensionais: `int[][]`, `int[][][]`
- Pode ser parâmetro/retorno de métodos

**Boas práticas**:
- Uma declaração por linha
- Nomes descritivos no plural
- Inicializar próximo ao uso
- Preferir `tipo[] nome` a `tipo nome[]`

Declaração **não aloca memória** - use `new` para criar o array efetivamente.
