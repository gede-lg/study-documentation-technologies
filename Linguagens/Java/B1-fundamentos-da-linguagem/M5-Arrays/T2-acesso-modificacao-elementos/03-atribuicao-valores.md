# Atribuição de Valores

## 🎯 Introdução e Definição

A **atribuição de valores** em arrays Java permite **modificar elementos existentes** através do operador de índice `[]` usado como **lvalue** (destino de atribuição). Diferente da inicialização que define valores na criação, a atribuição **altera o conteúdo de posições específicas** após a criação do array.

**Conceito central**: `arr[indice] = valor` modifica o elemento na posição `indice`, substituindo seu valor anterior.

**Sintaxe básica**:
```java
tipoElemento[] nomeArray = new tipoElemento[tamanho];
nomeArray[indice] = novoValor;  // Atribuição
```

**Exemplo fundamental**:
```java
int[] numeros = {10, 20, 30};
numeros[1] = 50;  // Modifica segundo elemento: {10, 50, 30}
System.out.println(Arrays.toString(numeros));  // [10, 50, 30]
```

A atribuição é **mutável** (modifica o array original), **indexada** (específica por posição) e **tipada** (valor deve ser compatível com o tipo do array).

## 📋 Fundamentos Teóricos

### 1️⃣ Atribuição Simples com Literais

A forma mais básica atribui **valores literais constantes** diretamente a posições específicas:

```java
int[] numeros = new int[5];  // {0, 0, 0, 0, 0}

numeros[0] = 100;  // {100, 0, 0, 0, 0}
numeros[1] = 200;  // {100, 200, 0, 0, 0}
numeros[4] = 500;  // {100, 200, 0, 0, 500}

String[] nomes = new String[3];
nomes[0] = "Ana";
nomes[1] = "Bruno";
nomes[2] = "Carlos";
// {"Ana", "Bruno", "Carlos"}
```

**Características**:
- Índice deve estar no intervalo `[0, length-1]`
- Valor substituído é perdido permanentemente
- Não afeta outros elementos do array

### 2️⃣ Atribuição com Expressões e Variáveis

O lado direito pode ser **qualquer expressão** que resulte no tipo compatível:

```java
int x = 10, y = 20;
int[] valores = new int[5];

valores[0] = x + y;           // Expressão aritmética: 30
valores[1] = x * 2;           // 20
valores[2] = Math.max(x, y);  // Chamada de método: 20
valores[3] = valores[1] + 5;  // Leitura e cálculo: 25
valores[4] = calcularBonus(); // Resultado de método

int i = 2;
valores[i] = 100;  // Índice via variável
```

**Flexibilidade**: lado direito avaliado **antes** da atribuição, permitindo lógica complexa.

### 3️⃣ Operadores Compostos de Atribuição

Combinam operação aritmética com atribuição em **sintaxe compacta**:

```java
int[] arr = {10, 20, 30, 40, 50};

arr[0] += 5;   // arr[0] = arr[0] + 5;   → 15
arr[1] -= 3;   // arr[1] = arr[1] - 3;   → 17
arr[2] *= 2;   // arr[2] = arr[2] * 2;   → 60
arr[3] /= 4;   // arr[3] = arr[3] / 4;   → 10
arr[4] %= 7;   // arr[4] = arr[4] % 7;   → 1

// Operadores bit a bit
arr[0] &= 12;  // AND
arr[1] |= 8;   // OR
arr[2] ^= 15;  // XOR
arr[3] <<= 2;  // Shift left
arr[4] >>= 1;  // Shift right
```

**Vantagens**: código mais legível, evita repetição do índice (avaliado uma só vez).

### 4️⃣ Incremento e Decremento

Operadores unários modificam valores numéricos em **±1**:

```java
int[] contadores = {0, 10, 20, 30};

contadores[0]++;  // Pós-incremento: 1
++contadores[1];  // Pré-incremento: 11
contadores[2]--;  // Pós-decremento: 19
--contadores[3];  // Pré-decremento: 29

// Diferença em expressões
int valor1 = contadores[0]++;  // valor1 = 1, arr[0] = 2
int valor2 = ++contadores[1];  // valor2 = 12, arr[1] = 12
```

**Contextos comuns**: contadores de loops, estatísticas, acumuladores.

### 5️⃣ Atribuição em Loops

Loops permitem **inicialização ou modificação em massa**:

```java
// Inicializar com sequência aritmética
int[] sequencia = new int[10];
for (int i = 0; i < sequencia.length; i++) {
    sequencia[i] = i * 10;  // {0, 10, 20, ..., 90}
}

// Entrada de dados do usuário
Scanner scanner = new Scanner(System.in);
int[] notas = new int[5];
for (int i = 0; i < notas.length; i++) {
    System.out.print("Nota " + (i + 1) + ": ");
    notas[i] = scanner.nextInt();
}

// Duplicar valores
for (int i = 0; i < valores.length; i++) {
    valores[i] *= 2;
}

// Valores aleatórios
Random random = new Random();
for (int i = 0; i < aleatorios.length; i++) {
    aleatorios[i] = random.nextInt(100);
}
```

### 6️⃣ Arrays Multidimensionais

Atribuição requer **múltiplos índices** (um por dimensão):

```java
int[][] matriz = new int[3][4];

matriz[0][0] = 1;      // Primeira linha, primeira coluna
matriz[0][3] = 4;      // Primeira linha, última coluna
matriz[2][1] = 9;      // Última linha, segunda coluna

// Preencher com loops aninhados
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        matriz[i][j] = i * matriz[i].length + j;
    }
}
// {{0, 1, 2, 3}, {4, 5, 6, 7}, {8, 9, 10, 11}}
```

### 7️⃣ Arrays de Objetos

Atribui **referências** a objetos, não cópias:

```java
String[] nomes = new String[3];
nomes[0] = "Ana";                    // Literal
nomes[1] = new String("Bruno");      // Construtor
nomes[2] = obterNome();              // Método

Pessoa[] pessoas = new Pessoa[2];
pessoas[0] = new Pessoa("João", 30);
pessoas[1] = pessoas[0];  // Mesma referência!

pessoas[1].setIdade(40);  // Afeta pessoas[0] também
```

**Importante**: modificações no objeto afetam **todas as referências** para ele.

### 8️⃣ Arrays.fill() - Preenchimento Uniforme

Método utilitário para atribuir **mesmo valor a todos os elementos**:

```java
int[] arr = new int[5];
Arrays.fill(arr, 10);  // {10, 10, 10, 10, 10}

// Preencher faixa específica
int[] valores = new int[10];
Arrays.fill(valores, 2, 7, 99);  // Índices 2-6: {0, 0, 99, 99, 99, 99, 99, 0, 0, 0}

String[] palavras = new String[4];
Arrays.fill(palavras, "vazio");  // {"vazio", "vazio", "vazio", "vazio"}
```

**Eficiência**: mais rápido que loop manual para valores uniformes.

### 9️⃣ Validação de Índices Antes da Atribuição

Prevenir `ArrayIndexOutOfBoundsException` com **verificação prévia**:

```java
public void atribuirSeguro(int[] arr, int indice, int valor) {
    if (indice >= 0 && indice < arr.length) {
        arr[indice] = valor;
    } else {
        System.err.println("Índice inválido: " + indice);
    }
}

// Com exceção personalizada
public void atribuir(int[] arr, int indice, int valor) {
    if (indice < 0 || indice >= arr.length) {
        throw new IllegalArgumentException(
            "Índice " + indice + " fora do intervalo [0, " + (arr.length - 1) + "]"
        );
    }
    arr[indice] = valor;
}
```

### 🔟 Padrões de Inicialização Programática

Técnicas comuns para preencher arrays com lógica específica:

```java
// Quadrados perfeitos
int[] quadrados = new int[10];
for (int i = 0; i < quadrados.length; i++) {
    quadrados[i] = i * i;  // {0, 1, 4, 9, 16, ...}
}

// Fibonacci
int[] fib = new int[10];
fib[0] = 0;
fib[1] = 1;
for (int i = 2; i < fib.length; i++) {
    fib[i] = fib[i-1] + fib[i-2];
}

// Valores condicionais
int[] pares = new int[50];
for (int i = 0; i < pares.length; i++) {
    pares[i] = i % 2 == 0 ? i : -1;
}

// Cópia de outro array
int[] origem = {1, 2, 3};
int[] destino = new int[origem.length];
for (int i = 0; i < origem.length; i++) {
    destino[i] = origem[i];
}
```

## 🎯 Aplicabilidade

**1. Inicialização Customizada**:
```java
// Valores não uniformes que requerem lógica
int[] ids = new int[100];
for (int i = 0; i < ids.length; i++) {
    ids[i] = 1000 + i;  // IDs começando em 1000
}
```

**2. Entrada de Dados do Usuário**:
```java
Scanner sc = new Scanner(System.in);
double[] precos = new double[5];
for (int i = 0; i < precos.length; i++) {
    System.out.print("Preço do produto " + (i+1) + ": R$ ");
    precos[i] = sc.nextDouble();
}
```

**3. Modificação de Valores Existentes**:
```java
// Aplicar desconto de 10% em todos os preços
for (int i = 0; i < precos.length; i++) {
    precos[i] *= 0.9;
}
```

**4. Normalização de Dados**:
```java
// Normalizar valores para intervalo [0, 1]
double max = Arrays.stream(valores).max().getAsDouble();
for (int i = 0; i < valores.length; i++) {
    valores[i] /= max;
}
```

**5. Preenchimento de Buffers e Caches**:
```java
byte[] buffer = new byte[1024];
Arrays.fill(buffer, (byte) 0);  // Limpar buffer
```

**6. Tabelas de Lookup**:
```java
// Tabela de códigos ASCII
char[] ascii = new char[128];
for (int i = 0; i < ascii.length; i++) {
    ascii[i] = (char) i;
}
```

**7. Troca (Swap) de Elementos**:
```java
// Trocar posições i e j
int temp = arr[i];
arr[i] = arr[j];
arr[j] = temp;
```

## ⚠️ Armadilhas Comuns

**1. ArrayIndexOutOfBoundsException**:
```java
int[] arr = new int[5];
arr[5] = 10;  // ❌ ERRO: índice máximo é 4
arr[-1] = 5;  // ❌ ERRO: índice negativo
```
**Solução**: sempre validar `indice >= 0 && indice < arr.length`.

**2. Arrays de Objetos - Referências vs Cópias**:
```java
Pessoa[] pessoas = new Pessoa[2];
pessoas[0] = new Pessoa("Ana", 25);
pessoas[1] = pessoas[0];  // ⚠️ Mesma referência!

pessoas[1].setIdade(30);
System.out.println(pessoas[0].getIdade());  // 30 (modificou ambas!)
```
**Solução**: criar nova instância para cópia independente:
```java
pessoas[1] = new Pessoa(pessoas[0].getNome(), pessoas[0].getIdade());
```

**3. Tipos Incompatíveis**:
```java
int[] numeros = new int[5];
numeros[0] = "texto";   // ❌ ERRO DE COMPILAÇÃO
numeros[1] = 3.14;      // ❌ ERRO: double não cabe em int sem cast
numeros[2] = (int) 3.14; // ✅ OK: cast explícito (valor = 3)
```

**4. Modificação Não Intencional em Arrays de Objetos**:
```java
String[] palavras = {"Java", "Python", "C++"};
String primeira = palavras[0];
primeira = "JavaScript";  // ⚠️ NÃO modifica palavras[0]!

// String é imutável, mas com objetos mutáveis:
StringBuilder[] textos = {new StringBuilder("Olá")};
StringBuilder primeiro = textos[0];
primeiro.append(" Mundo");  // ⚠️ MODIFICA textos[0]!
```

**5. Loop Off-by-One**:
```java
for (int i = 0; i <= arr.length; i++) {  // ❌ <= causa erro
    arr[i] = i;  // Exceção na última iteração
}

// Correto:
for (int i = 0; i < arr.length; i++) {  // ✅ < é correto
    arr[i] = i;
}
```

## ✅ Boas Práticas

**1. Validar Índices em Métodos Públicos**:
```java
public void definirValor(int[] arr, int indice, int valor) {
    if (arr == null) {
        throw new IllegalArgumentException("Array não pode ser null");
    }
    if (indice < 0 || indice >= arr.length) {
        throw new IndexOutOfBoundsException("Índice inválido: " + indice);
    }
    arr[indice] = valor;
}
```

**2. Usar Operadores Compostos para Clareza**:
```java
// ❌ Menos legível
arr[i] = arr[i] + incremento;

// ✅ Mais legível
arr[i] += incremento;
```

**3. Arrays.fill() para Valores Uniformes**:
```java
// ❌ Menos eficiente
for (int i = 0; i < arr.length; i++) {
    arr[i] = 0;
}

// ✅ Mais eficiente e legível
Arrays.fill(arr, 0);
```

**4. Loops com Nomes Descritivos**:
```java
// ❌ Pouco claro
for (int i = 0; i < a.length; i++) {
    a[i] = s.nextInt();
}

// ✅ Claro e autoexplicativo
for (int i = 0; i < notas.length; i++) {
    notas[i] = scanner.nextInt();
}
```

**5. Considerar Stream API para Operações Funcionais**:
```java
// Atribuição tradicional
for (int i = 0; i < valores.length; i++) {
    valores[i] = valores[i] * 2;
}

// Alternativa funcional (Java 8+)
int[] dobrados = Arrays.stream(valores)
                       .map(v -> v * 2)
                       .toArray();
```

**6. Documentar Modificações In-Place**:
```java
/**
 * Normaliza valores do array para intervalo [0, 1].
 * @param valores Array a ser modificado IN-PLACE
 */
public void normalizar(double[] valores) {
    double max = Arrays.stream(valores).max().orElse(1.0);
    for (int i = 0; i < valores.length; i++) {
        valores[i] /= max;
    }
}
```

**7. Inicializar Arrays de Objetos Completamente**:
```java
Pessoa[] pessoas = new Pessoa[5];
// ⚠️ Todos os elementos são null!

// ✅ Inicializar cada posição
for (int i = 0; i < pessoas.length; i++) {
    pessoas[i] = new Pessoa();
}
```

## 📚 Resumo Executivo

A **atribuição de valores** em arrays Java usa a sintaxe `arr[indice] = valor` para **modificar elementos específicos** após a criação do array. Suporta **literais, expressões, operadores compostos** (`+=`, `-=`, etc.) e **incremento/decremento** (`++`, `--`).

**Recursos principais**:
- **Atribuição simples**: `arr[0] = 10`
- **Operadores compostos**: `arr[i] += 5`
- **Loops**: inicialização em massa
- **Arrays.fill()**: valores uniformes eficientes

**Validação** é essencial para prevenir `ArrayIndexOutOfBoundsException`. Arrays de **objetos armazenam referências**, exigindo atenção com aliasing. Para **inicialização programática**, loops e `Arrays.fill()` são mais eficientes que atribuições individuais.
