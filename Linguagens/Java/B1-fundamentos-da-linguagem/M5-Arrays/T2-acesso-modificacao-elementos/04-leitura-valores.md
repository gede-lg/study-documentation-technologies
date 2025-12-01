# Leitura de Valores

## 🎯 Introdução e Definição

A **leitura de valores** em arrays Java consiste em **acessar elementos sem modificá-los**, usando o operador de índice `[]` como **rvalue** (fonte de dados). Esta operação é **não destrutiva** - o array permanece inalterado após a leitura.

**Conceito central**: `arr[indice]` retorna o **valor armazenado** na posição especificada, permitindo seu uso em expressões, atribuições a variáveis e operações.

**Sintaxe básica**:
```java
tipoElemento valor = nomeArray[indice];  // Leitura e atribuição
System.out.println(nomeArray[indice]);   // Leitura direta
```

**Exemplo fundamental**:
```java
int[] numeros = {10, 20, 30, 40};
int segundo = numeros[1];  // Lê 20, numeros permanece {10, 20, 30, 40}
System.out.println(numeros[2]);  // Imprime 30
```

A leitura é **indexada** (acesso direto O(1)), **tipada** (retorna tipo do array) e **segura contra modificações acidentais** quando usada isoladamente.

## 📋 Fundamentos Teóricos

### 1️⃣ Leitura Básica e Atribuição a Variáveis

A forma mais simples armazena o valor lido em uma **variável local**:

```java
int[] numeros = {5, 10, 15, 20};
int primeiro = numeros[0];   // primeiro = 5
int terceiro = numeros[2];   // terceiro = 15

String[] nomes = {"Ana", "Bruno", "Carlos"};
String nome = nomes[1];      // nome = "Bruno"

System.out.println(numeros[3]);  // Leitura direta: 20
```

**Características**:
- Array original **não é modificado**
- Índice deve estar em `[0, length-1]`
- Valor retornado tem o tipo do array

### 2️⃣ Semântica de Cópia - Tipos Primitivos

Arrays de **tipos primitivos** retornam **cópia do valor**:

```java
int[] valores = {10, 20, 30};
int x = valores[1];  // x recebe CÓPIA de 20

x = 200;  // Modifica apenas x, valores[1] permanece 20
System.out.println(valores[1]);  // 20 (inalterado)
```

**Implicação**: modificar a variável não afeta o array original (pass-by-value).

### 3️⃣ Semântica de Referência - Objetos

Arrays de **objetos** retornam **cópia da referência**:

```java
String[] nomes = {"Ana", "Bruno", "Carlos"};
String nome = nomes[0];  // nome e nomes[0] apontam para "Ana"

nome = "Daniela";  // ⚠️ Reatribuição: NÃO afeta nomes[0] (String imutável)
System.out.println(nomes[0]);  // "Ana" (inalterado)

// Com objetos MUTÁVEIS:
StringBuilder[] textos = {new StringBuilder("Olá")};
StringBuilder txt = textos[0];  // Referência compartilhada

txt.append(" Mundo");  // ⚠️ Modifica textos[0]!
System.out.println(textos[0]);  // "Olá Mundo"
```

**Diferença crítica**:
- **Reatribuição** (`=`) não afeta array
- **Mutação** (métodos do objeto) afeta array se objeto mutável

### 4️⃣ Leitura em Expressões Complexas

Valores lidos podem participar de **expressões aritméticas, lógicas e relacionais**:

```java
int[] nums = {10, 20, 30, 40};

int soma = nums[0] + nums[1];          // 30
int produto = nums[2] * 2;             // 60
double media = (nums[0] + nums[3]) / 2.0;  // 25.0

boolean maior = nums[1] > 15;          // true
boolean igual = nums[2] == 30;         // true

int resultado = Math.max(nums[0], nums[3]);  // 40
```

**Flexibilidade**: valores lidos se comportam como variáveis em qualquer contexto.

### 5️⃣ Iteração com For-Index

Loop tradicional para **leitura sequencial com acesso ao índice**:

```java
int[] numeros = {5, 10, 15, 20, 25};

for (int i = 0; i < numeros.length; i++) {
    System.out.println("Índice " + i + ": " + numeros[i]);
}
// Saída:
// Índice 0: 5
// Índice 1: 10
// ...
```

**Quando usar**: quando o **índice é necessário** (ex: processamento condicional por posição).

### 6️⃣ Iteração com For-Each (Enhanced For)

Sintaxe simplificada para **leitura sequencial sem índice**:

```java
int[] numeros = {10, 20, 30};

for (int num : numeros) {
    System.out.println(num);  // Acesso read-only
}

String[] palavras = {"Java", "Python", "C++"};
for (String palavra : palavras) {
    System.out.println(palavra.toUpperCase());
}
```

**Vantagens**:
- Mais legível e conciso
- Elimina erros de índice (`ArrayIndexOutOfBoundsException`)
- Ideal para **leitura pura** (sem modificação)

**Limitação**: não fornece índice (use for tradicional se precisar).

### 7️⃣ Operações de Agregação e Redução

Leitura para **calcular valores agregados** (soma, máximo, média):

```java
int[] valores = {15, 23, 8, 42, 16};

// Soma total
int soma = 0;
for (int i = 0; i < valores.length; i++) {
    soma += valores[i];
}
double media = (double) soma / valores.length;

// Valor máximo
int max = valores[0];
for (int i = 1; i < valores.length; i++) {
    if (valores[i] > max) {
        max = valores[i];
    }
}

// Contagem condicional
int maioresQue20 = 0;
for (int valor : valores) {
    if (valor > 20) {
        maioresQue20++;
    }
}
```

**Padrão comum**: acumulador inicializado, loop de leitura, atualização condicional.

### 8️⃣ Busca Linear - Encontrar Elemento

Leitura para **localizar valores ou índices**:

```java
int[] numeros = {10, 25, 30, 15, 40};
int busca = 30;

// Encontrar índice
int indiceEncontrado = -1;
for (int i = 0; i < numeros.length; i++) {
    if (numeros[i] == busca) {
        indiceEncontrado = i;
        break;
    }
}

// Verificar existência
boolean existe = false;
for (int num : numeros) {
    if (num == busca) {
        existe = true;
        break;
    }
}
```

**Complexidade**: O(n) linear - percorre até encontrar.

### 9️⃣ Arrays Multidimensionais

Leitura com **múltiplos índices** (um por dimensão):

```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

int elemento = matriz[1][2];  // 6 (linha 1, coluna 2)

// Percorrer com loops aninhados
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        System.out.print(matriz[i][j] + " ");
    }
    System.out.println();
}
```

**Ordem**: primeiro índice = linha, segundo = coluna (em matriz retangular).

### 🔟 Leitura com Stream API (Java 8+)

Abordagem funcional para **processamento declarativo**:

```java
int[] numeros = {10, 20, 30, 40, 50};

// Soma com stream
int soma = Arrays.stream(numeros).sum();

// Filtrar e coletar
int[] pares = Arrays.stream(numeros)
                    .filter(n -> n % 2 == 0)
                    .toArray();

// Operações complexas
double mediaMaioresQue25 = Arrays.stream(numeros)
                                 .filter(n -> n > 25)
                                 .average()
                                 .orElse(0.0);

// Objetos
String[] palavras = {"Java", "Python", "C++"};
long comJ = Arrays.stream(palavras)
                  .filter(p -> p.startsWith("J"))
                  .count();
```

**Vantagem**: código mais expressivo e funcional.

## 🎯 Aplicabilidade

**1. Exibição de Conteúdo**:
```java
System.out.println("Primeiro elemento: " + arr[0]);
System.out.println("Array completo: " + Arrays.toString(arr));
```

**2. Cálculos Estatísticos**:
```java
// Média
double media = Arrays.stream(valores).average().orElse(0.0);

// Desvio padrão
double mediaCalc = media;
double variancia = Arrays.stream(valores)
    .mapToDouble(v -> Math.pow(v - mediaCalc, 2))
    .average()
    .orElse(0.0);
```

**3. Validação e Comparação**:
```java
boolean todosMaioresQueZero = Arrays.stream(valores).allMatch(v -> v > 0);
boolean algumNegativo = Arrays.stream(valores).anyMatch(v -> v < 0);
```

**4. Transformação em Outras Estruturas**:
```java
List<Integer> lista = Arrays.stream(valores).boxed().collect(Collectors.toList());
Set<String> conjunto = new HashSet<>(Arrays.asList(palavras));
```

**5. Busca e Filtros**:
```java
Optional<Integer> primeiroMaiorQue50 = Arrays.stream(valores)
                                             .filter(v -> v > 50)
                                             .findFirst();
```

**6. Cópia de Arrays**:
```java
int[] copia = Arrays.copyOf(original, original.length);
int[] subarray = Arrays.copyOfRange(original, 1, 4);  // Índices 1-3
```

**7. Passar Valores para Métodos**:
```java
int resultado = calcular(arr[0], arr[1]);
String mensagem = formatarMensagem(nomes[i]);
```

## ⚠️ Armadilhas Comuns

**1. Modificação Acidental via Referência**:
```java
StringBuilder[] textos = {new StringBuilder("Olá")};
StringBuilder texto = textos[0];  // Referência compartilhada

texto.append(" Mundo");  // ⚠️ Modifica textos[0]!
```
**Solução**: criar cópia defensiva se mutabilidade é problema:
```java
StringBuilder textoCopia = new StringBuilder(textos[0]);
```

**2. ArrayIndexOutOfBoundsException**:
```java
int[] arr = {10, 20, 30};
int x = arr[5];  // ❌ EXCEPTION (índices válidos: 0-2)
```
**Solução**: validar antes de acessar:
```java
if (indice >= 0 && indice < arr.length) {
    int valor = arr[indice];
}
```

**3. Confundir Leitura com Cópia de Array**:
```java
int[] original = {1, 2, 3};
int[] copia = original;  // ⚠️ NÃO é cópia! Mesma referência

copia[0] = 100;
System.out.println(original[0]);  // 100 (modificou original!)
```
**Solução**: usar métodos de cópia:
```java
int[] copia = Arrays.copyOf(original, original.length);
```

**4. NullPointerException em Arrays de Objetos**:
```java
String[] nomes = new String[5];  // Todos elementos são null
String primeiro = nomes[0].toUpperCase();  // ❌ NPE
```
**Solução**: verificar null antes de usar:
```java
if (nomes[0] != null) {
    String upper = nomes[0].toUpperCase();
}
```

**5. Loop Off-by-One**:
```java
for (int i = 0; i <= arr.length; i++) {  // ❌ <= causa erro
    System.out.println(arr[i]);  // Exception quando i = length
}
```
**Solução**: usar `<` em vez de `<=`:
```java
for (int i = 0; i < arr.length; i++) {  // ✅
    System.out.println(arr[i]);
}
```

## ✅ Boas Práticas

**1. Preferir For-Each para Leitura Pura**:
```java
// ❌ Menos legível
for (int i = 0; i < numeros.length; i++) {
    processar(numeros[i]);
}

// ✅ Mais legível
for (int numero : numeros) {
    processar(numero);
}
```

**2. Validar Índices Dinâmicos**:
```java
public int obterValor(int[] arr, int indice) {
    if (indice < 0 || indice >= arr.length) {
        throw new IndexOutOfBoundsException("Índice inválido: " + indice);
    }
    return arr[indice];
}
```

**3. Usar Nomes Descritivos**:
```java
// ❌ Pouco claro
int x = arr[0];

// ✅ Claro
int primeiraNota = notas[0];
String nomeAutor = autores[indiceAtual];
```

**4. Stream API para Operações Funcionais**:
```java
// Leitura tradicional
int soma = 0;
for (int num : numeros) {
    soma += num;
}

// Stream (mais declarativo)
int soma = Arrays.stream(numeros).sum();
```

**5. Arrays.copyOf() para Copiar**:
```java
// ❌ Cópia manual
int[] copia = new int[original.length];
for (int i = 0; i < original.length; i++) {
    copia[i] = original[i];
}

// ✅ Método utilitário
int[] copia = Arrays.copyOf(original, original.length);
```

**6. Verificar Null em Arrays de Objetos**:
```java
for (String nome : nomes) {
    if (nome != null) {
        System.out.println(nome.toUpperCase());
    }
}
```

**7. Optional para Resultados de Busca**:
```java
public Optional<Integer> encontrarPrimeiroPar(int[] numeros) {
    return Arrays.stream(numeros)
                 .filter(n -> n % 2 == 0)
                 .findFirst()
                 .boxed();
}
```

## 📚 Resumo Executivo

A **leitura de valores** em arrays Java usa `arr[indice]` para **acessar elementos sem modificá-los**. Retorna **cópia do valor** (primitivos) ou **cópia da referência** (objetos).

**Formas de iteração**:
- **For-index**: acesso com índice (`for (int i = 0; i < arr.length; i++)`)
- **For-each**: leitura pura (`for (tipo elem : arr)`)
- **Stream API**: processamento funcional (`Arrays.stream(arr)`)

**Operações comuns**: exibição, agregação (soma, média, máximo), busca, validação, transformação.

**Validação** é essencial para índices dinâmicos. **Arrays de objetos** exigem atenção com null e referências compartilhadas. Para **leitura sequencial sem modificação**, prefira **for-each** pela legibilidade e segurança.
