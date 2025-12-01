# Inicialização Inline de Arrays

## 🎯 Introdução e Definição

**Inicialização inline** permite criar e preencher arrays **diretamente** com valores, em uma única instrução, usando a sintaxe `{val1, val2, val3}`. O tamanho é **automaticamente calculado** pelo número de elementos fornecidos.

**Conceito central**: declaração, criação e inicialização em **uma linha**, sem necessidade de especificar tamanho explicitamente.

**Sintaxe fundamental**:
```java
tipo[] nome = {valor1, valor2, valor3, ...};
```

**Exemplo básico**:
```java
int[] nums = {1, 2, 3, 4, 5};  // Tamanho 5, valores definidos
// Equivalente a:
// int[] nums = new int[5];
// nums[0] = 1; nums[1] = 2; nums[2] = 3; nums[3] = 4; nums[4] = 5;
```

Inicialização inline é a forma **mais concisa e legível** de criar arrays com valores conhecidos em tempo de compilação.

## 📋 Fundamentos Teóricos

### 1️⃣ Sintaxe Básica - Declaração com Valores

Sintaxe permite **combinar declaração e inicialização**:

```java
// Primitivos
int[] nums = {10, 20, 30};
double[] vals = {1.5, 2.7, 3.9};
boolean[] flags = {true, false, true};
char[] letras = {'a', 'b', 'c'};

// Objetos
String[] nomes = {"Ana", "Bob", "Carlos"};
Integer[] wrappers = {1, 2, 3};  // Autoboxing
```

**Vantagens**:
- **Concisão**: uma linha vs múltiplas atribuições
- **Legibilidade**: valores visíveis imediatamente
- **Segurança**: sem risco de esquecer inicialização

### 2️⃣ Tamanho Automático - Inferido dos Valores

Compilador **calcula automaticamente** o tamanho:

```java
int[] arr = {1, 2, 3};  // Tamanho 3 (automático)
// arr.length == 3

String[] dias = {"Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"};
// dias.length == 7 (calculado)
```

**Benefício**: elimina redundância e erros de contagem:

```java
// ❌ Redundante e propenso a erro
int[] arr = new int[5];
arr[0] = 1; arr[1] = 2; arr[2] = 3; arr[3] = 4; arr[4] = 5;

// ✅ Conciso e claro
int[] arr = {1, 2, 3, 4, 5};
```

### 3️⃣ Restrição: Apenas na Declaração

Sintaxe `{...}` **só funciona** na declaração da variável:

```java
// ✅ OK: declaração com inicialização
int[] arr = {1, 2, 3};

// ❌ ERRO: atribuição posterior
int[] arr2;
arr2 = {4, 5, 6};  // ❌ ERRO DE COMPILAÇÃO!

// ✅ Para atribuição: use new tipo[]{}
int[] arr2;
arr2 = new int[]{4, 5, 6};  // OK
```

**Razão**: `{...}` é **syntax sugar** válido apenas no contexto de declaração.

### 4️⃣ Arrays Anônimos - new tipo[]{valores}

Para **atribuição** ou **passagem a métodos**, use `new tipo[]{...}`:

```java
// Atribuição posterior
int[] arr;
arr = new int[]{1, 2, 3};  // ✅ OK

// Reatribuição
arr = new int[]{10, 20, 30, 40};  // ✅ OK

// Passar diretamente para método
processar(new int[]{5, 10, 15});

// Retornar de método
public int[] getNumeros() {
    return new int[]{1, 2, 3, 4, 5};
}
```

**Nota**: `new int[]{...}` é **array anônimo** (sem nome de variável).

### 5️⃣ Arrays Multidimensionais - Inicialização Nested

Arrays multidimensionais usam **chaves aninhadas**:

```java
// Matriz 2D
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
// matriz[0] = {1, 2, 3}
// matriz[1] = {4, 5, 6}
// matriz[2] = {7, 8, 9}

// Jagged array (linhas de tamanhos diferentes)
int[][] jagged = {
    {1, 2},
    {3, 4, 5, 6},
    {7}
};

// 3D
int[][][] cubo = {
    {{1, 2}, {3, 4}},
    {{5, 6}, {7, 8}}
};
```

### 6️⃣ Arrays Vazios - Tamanho Zero

Sintaxe permite **arrays vazios** `{}`:

```java
int[] vazio = {};  // length = 0
String[] semNomes = {};  // length = 0

// Verificação
vazio.length;  // 0
vazio[0];  // ❌ ArrayIndexOutOfBoundsException
```

**Uso**: retornar array vazio em vez de `null` (evita NPE):

```java
public String[] buscar(String filtro) {
    if (nenhumResultado) {
        return new String[]{};  // Array vazio (melhor que null)
    }
    // ...
}
```

### 7️⃣ Expressões e Cálculos - Valores Dinâmicos

Elementos podem ser **expressões** (não apenas literais):

```java
int x = 10;
int[] arr = {x, x * 2, x * 3};  // [10, 20, 30]

// Chamadas de método
int[] valores = {
    calcular(5),
    calcular(10),
    calcular(15)
};

// Operações complexas
double[] raizes = {
    Math.sqrt(4),
    Math.sqrt(9),
    Math.sqrt(16)
};  // [2.0, 3.0, 4.0]
```

**Limitação**: expressões avaliadas em **tempo de execução**, não compilação.

### 8️⃣ Vírgula Final (Trailing Comma) - Permitida

Java permite **vírgula após último elemento** (estilo opcional):

```java
int[] arr = {
    1,
    2,
    3,  // Vírgula final OK
};

String[] nomes = {
    "Ana",
    "Bob",
    "Carlos",  // Facilita adicionar/remover linhas
};
```

**Benefício**: facilita manutenção (adicionar/remover elementos sem editar linha anterior).

### 9️⃣ Inicialização de Objetos - Criação Inline

Objetos podem ser **criados diretamente** na inicialização:

```java
// Strings (literais)
String[] nomes = {"Ana", "Bob", "Carlos"};

// Objetos customizados
Pessoa[] pessoas = {
    new Pessoa("Ana", 25),
    new Pessoa("Bob", 30),
    new Pessoa("Carlos", 35)
};

// Wrappers (autoboxing)
Integer[] nums = {1, 2, 3};  // int -> Integer automático

// Objetos complexos
Produto[] produtos = {
    new Produto("Notebook", 3000.00),
    new Produto("Mouse", 50.00),
    new Produto("Teclado", 150.00)
};
```

### 🔟 Constantes - Arrays Imutáveis (final)

Combine com `final` para **arrays constantes**:

```java
// Constante de classe
private static final String[] DIAS_SEMANA = {
    "Domingo", "Segunda", "Terça", "Quarta", 
    "Quinta", "Sexta", "Sábado"
};

private static final int[] NUMEROS_PRIMOS = {2, 3, 5, 7, 11, 13};

// ⚠️ Nota: final impede reatribuição, não modificação de elementos
DIAS_SEMANA = new String[]{};  // ❌ ERRO: reatribuição
DIAS_SEMANA[0] = "Dom";  // ✅ OK: modificação de elemento (perigoso!)
```

**Para verdadeira imutabilidade**: use `Collections.unmodifiableList()` ou bibliotecas como Guava.

## 🎯 Aplicabilidade

**1. Dados Fixos Conhecidos**:
```java
String[] meses = {"Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
                  "Jul", "Ago", "Set", "Out", "Nov", "Dez"};
```

**2. Testes Unitários - Dados de Teste**:
```java
@Test
public void testSoma() {
    int[] entrada = {1, 2, 3, 4, 5};
    int esperado = 15;
    assertEquals(esperado, somar(entrada));
}
```

**3. Configurações e Constantes**:
```java
private static final int[] PORTAS_PADRAO = {80, 443, 8080};
```

**4. Matrizes e Tabelas Pequenas**:
```java
int[][] tabuleiro = {
    {1, 0, 1},
    {0, 1, 0},
    {1, 0, 1}
};
```

**5. Passagem Direta para Métodos**:
```java
calcularMedia(new double[]{7.5, 8.0, 6.5, 9.0});
```

**6. Retorno de Múltiplos Valores**:
```java
public String[] getDadosPessoa() {
    return new String[]{"Ana", "Silva", "ana@email.com"};
}
```

## ⚠️ Armadilhas Comuns

**1. Sintaxe Apenas na Declaração**:
```java
int[] arr;
arr = {1, 2, 3};  // ❌ ERRO DE COMPILAÇÃO!
arr = new int[]{1, 2, 3};  // ✅ OK
```

**2. Não Especificar Tamanho com new**:
```java
int[] arr = new int[3]{1, 2, 3};  // ❌ ERRO! Tamanho redundante
int[] arr = new int[]{1, 2, 3};   // ✅ OK
```

**3. Vírgulas Faltando Entre Elementos**:
```java
int[] arr = {1 2 3};  // ❌ ERRO: falta vírgula
int[] arr = {1, 2, 3};  // ✅ OK
```

**4. Misturar Tipos Incompatíveis**:
```java
int[] arr = {1, 2, 3.5};  // ❌ ERRO: double não é int
double[] arr = {1, 2, 3.5};  // ✅ OK
```

**5. Esquecer new tipo[] ao Passar para Método**:
```java
void processar(int[] arr) { ... }

processar({1, 2, 3});  // ❌ ERRO!
processar(new int[]{1, 2, 3});  // ✅ OK
```

## ✅ Boas Práticas

**1. Prefira Inicialização Inline para Dados Fixos**:
```java
// ❌ Verboso
int[] arr = new int[3];
arr[0] = 1; arr[1] = 2; arr[2] = 3;

// ✅ Conciso
int[] arr = {1, 2, 3};
```

**2. Use Formatação Multi-linha para Legibilidade**:
```java
String[] nomes = {
    "Ana Silva",
    "Bob Santos",
    "Carlos Oliveira",
    "Diana Costa"
};
```

**3. Constantes com final e UPPER_CASE**:
```java
private static final int[] FIBONACCI = {0, 1, 1, 2, 3, 5, 8, 13};
```

**4. Vírgula Final para Facilitar Manutenção**:
```java
int[] valores = {
    10,
    20,
    30,  // Facilita adicionar novos valores
};
```

**5. Arrays Vazios em vez de null**:
```java
public String[] buscar() {
    if (semResultados) {
        return new String[]{};  // Melhor que null
    }
    // ...
}
```

**6. new tipo[] para Clareza em Atribuições**:
```java
int[] arr;
// ...
arr = new int[]{1, 2, 3};  // Explícito e claro
```

**7. Evite Arrays Muito Grandes Inline**:
```java
// ❌ Difícil de manter
int[] arr = {1, 2, 3, 4, 5, ..., 100};  // 100 elementos!

// ✅ Use loop ou IntStream
int[] arr = IntStream.rangeClosed(1, 100).toArray();
```

## 📚 Resumo Executivo

Inicialização inline cria e preenche arrays **em uma linha** usando `{val1, val2, val3}`. Tamanho **automaticamente calculado** pelo número de elementos.

**Sintaxe**:
```java
tipo[] nome = {valor1, valor2, valor3};  // Declaração
nome = new tipo[]{valor1, valor2};       // Atribuição/método
```

**Restrição**: `{...}` **só na declaração**. Para atribuição/métodos, use `new tipo[]{...}`.

**Multidimensionais**: chaves aninhadas `{{1,2}, {3,4}}`.

**Arrays vazios**: `{}` válido (length = 0).

**Expressões**: elementos podem ser cálculos `{x, x*2, calcular(5)}`.

**Vantagens**: conciso, legível, seguro. **Ideal** para dados fixos, constantes, testes, configurações.

**Boas práticas**: prefira inline para dados conhecidos, use formatação multi-linha, constantes `final`, vírgula final para manutenção, arrays vazios em vez de `null`.
