# Criação com Operador new

## 🎯 Introdução e Definição

O **operador `new`** é o mecanismo primário para **criar arrays** em Java, alocando memória dinâmica na **heap** e inicializando todos os elementos com **valores padrão** específicos do tipo. Diferente da declaração, `new` efetivamente **instancia o array**.

**Conceito central**: `new tipo[tamanho]` aloca memória contígua para `tamanho` elementos do tipo especificado, retornando uma **referência** ao array criado.

**Sintaxe fundamental**:
```java
tipo[] nomeVariavel = new tipo[tamanho];
```

**Exemplo básico**:
```java
int[] numeros = new int[5];  // Cria array com 5 int's: [0, 0, 0, 0, 0]
String[] nomes = new String[3];  // Cria array com 3 slots: [null, null, null]
```

O operador `new` garante que o array seja **sempre inicializado** - não há arrays com "lixo de memória" em Java.

## 📋 Fundamentos Teóricos

### 1️⃣ Sintaxe Básica e Alocação na Heap

O operador `new` aloca arrays na **heap** (memória dinâmica gerenciada pelo Garbage Collector):

```java
int[] numeros = new int[10];      // 10 inteiros
String[] nomes = new String[5];   // 5 referências a String
double[] valores = new double[100]; // 100 doubles
boolean[] flags = new boolean[20]; // 20 booleanos
```

**Processo interno**:
1. JVM calcula memória necessária: `tamanho * sizeof(tipo)`
2. Aloca bloco contíguo na heap
3. Inicializa todos elementos com valor padrão
4. Retorna referência ao primeiro elemento

### 2️⃣ Valores Padrão - Inicialização Automática

Java **sempre inicializa** arrays com valores padrão específicos por tipo:

**Tabela de valores padrão**:

| Tipo | Valor Padrão | Exemplo |
|------|-------------|--------|
| `byte`, `short`, `int`, `long` | `0` | `new int[3]` → `[0, 0, 0]` |
| `float`, `double` | `0.0` | `new double[2]` → `[0.0, 0.0]` |
| `boolean` | `false` | `new boolean[2]` → `[false, false]` |
| `char` | `'\u0000'` | `new char[2]` → `['\u0000', '\u0000']` |
| **Objetos** (String, etc) | `null` | `new String[3]` → `[null, null, null]` |

**Exemplos práticos**:
```java
int[] nums = new int[3];         // [0, 0, 0]
boolean[] flags = new boolean[2]; // [false, false]
String[] strs = new String[2];    // [null, null]
char[] chars = new char[2];       // ['\u0000', '\u0000'] (null character)
```

**Importante**: valores padrão podem **mascarar bugs** - sempre inicialize explicitamente quando lógica depende de valores específicos.

### 3️⃣ Declaração e Criação Separadas

Java permite **separar declaração de criação**, útil para inicialização condicional:

```java
int[] arr;  // Declaração (arr = null)

if (condicao) {
    arr = new int[10];  // Criado com tamanho 10
} else {
    arr = new int[5];   // Criado com tamanho 5
}

// arr agora aponta para array válido
```

**Vantagem**: flexibilidade para determinar tamanho em runtime.

### 4️⃣ Tamanho Dinâmico em Runtime

Diferente de linguagens que exigem constantes, Java aceita **expressões dinâmicas** para tamanho:

```java
// Tamanho de entrada do usuário
Scanner scanner = new Scanner(System.in);
int n = scanner.nextInt();
int[] arr = new int[n];  // Tamanho determinado em runtime

// Tamanho calculado
int tamanho = calcularTamanho();
double[] valores = new double[tamanho];

// Tamanho de expressão
int[] buffer = new int[x * 2 + 10];
```

**Flexibilidade**: tamanho avaliado durante execução, não compilação.

### 5️⃣ Arrays Multidimensionais

Arrays de múltiplas dimensões são criados com **múltiplos pares de colchetes**:

```java
// Matriz 3x4 (3 linhas, 4 colunas)
int[][] matriz = new int[3][4];
// Inicializado: [[0,0,0,0], [0,0,0,0], [0,0,0,0]]

// Cubo 2x3x4
int[][][] cubo = new int[2][3][4];

// Arrays irregulares (jagged arrays)
int[][] irregular = new int[3][];  // 3 linhas, colunas indefinidas
irregular[0] = new int[2];  // Linha 0 com 2 colunas
irregular[1] = new int[5];  // Linha 1 com 5 colunas
irregular[2] = new int[3];  // Linha 2 com 3 colunas
```

### 6️⃣ Arrays Vazios - Tamanho Zero

Java **permite** arrays com tamanho zero (válido, mas sem elementos):

```java
int[] vazio = new int[0];  // length = 0, válido

System.out.println(vazio.length);  // 0
vazio[0] = 10;  // ❌ ArrayIndexOutOfBoundsException

// Verificação antes de acessar
if (vazio.length > 0) {
    int primeiro = vazio[0];
}
```

**Casos de uso**: resultados de filtragens sem matches, buffers temporários.

### 7️⃣ Exceções - Tamanho Negativo

Tentar criar array com tamanho **negativo** lança `NegativeArraySizeException`:

```java
int[] arr = new int[-5];  // ❌ NegativeArraySizeException!

// Validação preventiva
int tamanho = calcularTamanho();
if (tamanho < 0) {
    throw new IllegalArgumentException("Tamanho não pode ser negativo");
}
int[] arr = new int[tamanho];  // Seguro
```

### 8️⃣ Arrays de Objetos - Apenas Slots null

Criar array de objetos **aloca slots null**, não instancia os objetos:

```java
String[] nomes = new String[3];  // [null, null, null]
// NÃO cria 3 Strings, apenas 3 referências null!

// Inicialização obrigatória
nomes[0] = "Ana";      // OK
nomes[1] = "Bruno";    // OK
nomes[2] = "Carlos";   // OK

// Uso direto sem inicializar
System.out.println(nomes[0].length());  // ❌ NullPointerException se não inicializado
```

**Regra**: arrays de objetos exigem **inicialização explícita** de cada elemento.

### 9️⃣ Combinando Declaração, Criação e Inicialização

Três etapas podem ser **combinadas ou separadas**:

```java
// Tudo em uma linha (comum)
int[] arr = new int[5];

// Separado (para lógica condicional)
int[] arr;           // 1. Declaração
arr = new int[5];    // 2. Criação
arr[0] = 10;         // 3. Inicialização

// Com inicialização inline (sem new explícito)
int[] arr = {1, 2, 3, 4, 5};  // Declaração + criação + inicialização
```

### 🔟 Limites de Tamanho - Memória e Integer.MAX_VALUE

Tamanho máximo teórico é `Integer.MAX_VALUE` (2³¹ - 1), mas **limitado pela memória disponível**:

```java
// Tamanho máximo teórico
int max = Integer.MAX_VALUE;  // 2,147,483,647

// Prático: limitado pela heap
int[] enorme = new int[1_000_000_000];  // Pode falhar com OutOfMemoryError

// Verificação de memória disponível
Runtime runtime = Runtime.getRuntime();
long memoriaLivre = runtime.freeMemory();
```

**Cuidado**: arrays muito grandes podem causar `OutOfMemoryError`.

## 🎯 Aplicabilidade

**1. Criar Arrays de Tamanho Conhecido**:
```java
int[] diasPorMes = new int[12];  // 12 meses
String[] diasSemana = new String[7];  // 7 dias
```

**2. Buffers de Tamanho Fixo**:
```java
byte[] buffer = new byte[1024];  // Buffer de 1KB
char[] caracteres = new char[256];  // Buffer de caracteres
```

**3. Inicialização com Valores Padrão**:
```java
boolean[] respostas = new boolean[10];  // Todas false por padrão
int[] contadores = new int[5];  // Todos 0
```

**4. Alocação Antes de Preencher**:
```java
int[] notas = new int[quantidadeAlunos];
for (int i = 0; i < notas.length; i++) {
    notas[i] = scanner.nextInt();
}
```

**5. Estruturas Temporárias**:
```java
int[] temporario = new int[arr.length];
System.arraycopy(arr, 0, temporario, 0, arr.length);
```

## ⚠️ Armadilhas Comuns

**1. NegativeArraySizeException**:
```java
int tamanho = -5;
int[] arr = new int[tamanho];  // ❌ Exceção em runtime
```

**2. Confundir Criação de Array de Objetos com Objetos**:
```java
String[] nomes = new String[3];  // Cria 3 slots null, NÃO 3 Strings
nomes[0].toUpperCase();  // ❌ NullPointerException
```

**3. OutOfMemoryError com Arrays Grandes**:
```java
int[] gigante = new int[Integer.MAX_VALUE];  // ❌ Provavelmente OOM
```

**4. Assumir Valores Não-Padrão**:
```java
int[] nums = new int[5];  // [0, 0, 0, 0, 0]
if (nums[0] == 0) {  // ⚠️ Sempre true! Pode mascarar bug
    // Lógica
}
```

## ✅ Boas Práticas

**1. Especificar Tamanho Correto**:
```java
int[] arr = new int[TAMANHO_EXATO];  // Evita realocações
```

**2. Validar Tamanho de Entrada**:
```java
int n = scanner.nextInt();
if (n <= 0 || n > MAX_PERMITIDO) {
    throw new IllegalArgumentException("Tamanho inválido");
}
int[] arr = new int[n];
```

**3. Inicializar Arrays de Objetos**:
```java
Pessoa[] pessoas = new Pessoa[5];
for (int i = 0; i < pessoas.length; i++) {
    pessoas[i] = new Pessoa();  // Inicializa cada slot
}
```

**4. Usar Constantes para Tamanhos Fixos**:
```java
private static final int TAMANHO_BUFFER = 1024;
byte[] buffer = new byte[TAMANHO_BUFFER];
```

**5. Considerar ArrayList para Tamanho Variável**:
```java
// Se tamanho muda frequentemente
List<Integer> lista = new ArrayList<>();  // Melhor que arrays
```

## 📚 Resumo Executivo

O operador `new` **cria arrays** alocando memória na heap e **inicializando com valores padrão**: `0` (numéricos), `false` (boolean), `'\u0000'` (char), `null` (objetos).

**Sintaxe**: `new tipo[tamanho]`

**Características**:
- Tamanho **fixo e imutável**
- Tamanho pode ser **expressão dinâmica** (runtime)
- Arrays de objetos criam **slots null** (não objetos)
- Tamanho negativo → `NegativeArraySizeException`
- Arrays vazios (`length=0`) são válidos

**Valores padrão** eliminam lixo de memória, mas podem **mascarar bugs** - sempre inicialize explicitamente quando necessário.
