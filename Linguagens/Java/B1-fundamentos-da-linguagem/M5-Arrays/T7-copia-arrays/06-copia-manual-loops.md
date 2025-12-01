# Cópia Manual com Loops

## 🎯 Introdução e Definição

**Cópia manual com loops** é a técnica de copiar arrays **elemento por elemento** usando estruturas de repetição (`for`, `while`), oferecendo **controle total** sobre o processo de cópia.

**Conceito central**: iterar sobre array origem, copiando cada elemento individualmente para array destino.

**Sintaxe fundamental**:
```java
TipoArray[] destino = new TipoArray[tamanho];
for (int i = 0; i < origem.length; i++) {
    destino[i] = origem[i];
}
```

**Exemplo básico**:
```java
int[] original = {1, 2, 3, 4, 5};
int[] copia = new int[original.length];

for (int i = 0; i < original.length; i++) {
    copia[i] = original[i];
}
// copia = [1, 2, 3, 4, 5]
```

**Vantagens**: 
- Controle total sobre cada elemento
- Permite transformações durante cópia
- Entendimento didático do processo

**Desvantagens**: mais verboso e geralmente mais lento que métodos nativos.

## 📋 Fundamentos Teóricos

### 1️⃣ Loop For Tradicional

**Padrão mais comum** para cópia:

```java
int[] origem = {10, 20, 30, 40, 50};
int[] destino = new int[origem.length];

for (int i = 0; i < origem.length; i++) {
    destino[i] = origem[i];
}

// Arrays independentes
destino[0] = 999;
System.out.println(origem[0]);  // 10 (inalterado)
```

**Vantagens**:
- Acesso a índice durante cópia
- Permite copiar intervalos específicos
- Fácil adicionar lógica condicional

**Cópia parcial**:
```java
int[] origem = {1, 2, 3, 4, 5, 6, 7};
int[] destino = new int[3];

// Copiar apenas índices 2 a 4
int destIdx = 0;
for (int i = 2; i < 5; i++) {
    destino[destIdx++] = origem[i];
}
// destino = [3, 4, 5]
```

### 2️⃣ Enhanced For (For-Each)

**For-each** - sintaxe mais limpa, mas **sem índice**:

```java
int[] origem = {1, 2, 3, 4, 5};
int[] destino = new int[origem.length];

int indice = 0;
for (int elemento : origem) {
    destino[indice++] = elemento;
}
```

**Limitações**:
- Não fornece índice automaticamente
- Sempre itera do início ao fim
- Menos flexível para cópias parciais

**Quando usar**: cópia completa sem necessidade de índice.

### 3️⃣ While e Do-While

**While loop**:

```java
int[] origem = {1, 2, 3, 4, 5};
int[] destino = new int[origem.length];

int i = 0;
while (i < origem.length) {
    destino[i] = origem[i];
    i++;
}
```

**Do-While** (menos comum):

```java
int[] origem = {1, 2, 3, 4, 5};
int[] destino = new int[origem.length];

int i = 0;
if (origem.length > 0) {  // Evitar execução com array vazio
    do {
        destino[i] = origem[i];
        i++;
    } while (i < origem.length);
}
```

**Quando usar**: situações onde condição precisa ser verificada antes/depois.

### 4️⃣ Cópia com Transformação

**Aplicar operação durante cópia**:

```java
int[] origem = {1, 2, 3, 4, 5};
int[] dobrados = new int[origem.length];

for (int i = 0; i < origem.length; i++) {
    dobrados[i] = origem[i] * 2;
}
// dobrados = [2, 4, 6, 8, 10]
```

**Conversão de tipo**:
```java
double[] valores = {1.5, 2.7, 3.9, 4.1};
int[] inteiros = new int[valores.length];

for (int i = 0; i < valores.length; i++) {
    inteiros[i] = (int) valores[i];  // Truncar decimais
}
// inteiros = [1, 2, 3, 4]
```

**Filtro durante cópia**:
```java
int[] origem = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
int[] pares = new int[origem.length];

int count = 0;
for (int i = 0; i < origem.length; i++) {
    if (origem[i] % 2 == 0) {
        pares[count++] = origem[i];
    }
}

// Redimensionar para tamanho exato
pares = Arrays.copyOf(pares, count);
// pares = [2, 4, 6, 8, 10]
```

### 5️⃣ Cópia Profunda Manual

**Objetos**: criar **novas instâncias** durante cópia:

```java
class Pessoa {
    String nome;
    int idade;
    
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // Construtor de cópia
    Pessoa(Pessoa outra) {
        this.nome = outra.nome;
        this.idade = outra.idade;
    }
}

Pessoa[] original = {
    new Pessoa("Ana", 25),
    new Pessoa("Bob", 30)
};

// Cópia profunda com loop
Pessoa[] copiaP = new Pessoa[original.length];
for (int i = 0; i < original.length; i++) {
    copiaP[i] = new Pessoa(original[i]);
}

// Arrays independentes E objetos independentes
copiaP[0].nome = "Carlos";
System.out.println(original[0].nome);  // "Ana" (inalterado!)
```

**Com clone()**:
```java
class Pessoa implements Cloneable {
    @Override
    protected Pessoa clone() {
        try {
            return (Pessoa) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}

// Cópia profunda
Pessoa[] copiaP = new Pessoa[original.length];
for (int i = 0; i < original.length; i++) {
    copiaP[i] = original[i].clone();
}
```

### 6️⃣ Arrays Multidimensionais

**Matrizes 2D** - loops aninhados:

```java
int[][] matriz = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
int[][] copia = new int[matriz.length][];

// Copiar cada linha
for (int i = 0; i < matriz.length; i++) {
    copia[i] = new int[matriz[i].length];
    for (int j = 0; j < matriz[i].length; j++) {
        copia[i][j] = matriz[i][j];
    }
}

// Totalmente independentes
copia[0][0] = 999;
System.out.println(matriz[0][0]);  // 1 (inalterado)
```

**Matrizes irregulares (jagged)**:
```java
int[][] irregular = {{1, 2}, {3, 4, 5}, {6}};
int[][] copiaI = new int[irregular.length][];

for (int i = 0; i < irregular.length; i++) {
    copiaI[i] = new int[irregular[i].length];  // Respeita tamanho de cada linha
    for (int j = 0; j < irregular[i].length; j++) {
        copiaI[i][j] = irregular[i][j];
    }
}
```

**Arrays 3D**:
```java
int[][][] cubo = {{{1, 2}, {3, 4}}, {{5, 6}, {7, 8}}};
int[][][] copiaC = new int[cubo.length][][];

for (int i = 0; i < cubo.length; i++) {
    copiaC[i] = new int[cubo[i].length][];
    for (int j = 0; j < cubo[i].length; j++) {
        copiaC[i][j] = new int[cubo[i][j].length];
        for (int k = 0; k < cubo[i][j].length; k++) {
            copiaC[i][j][k] = cubo[i][j][k];
        }
    }
}
```

### 7️⃣ Cópia Reversa

**Inverter ordem durante cópia**:

```java
int[] origem = {1, 2, 3, 4, 5};
int[] reverso = new int[origem.length];

for (int i = 0; i < origem.length; i++) {
    reverso[origem.length - 1 - i] = origem[i];
}
// reverso = [5, 4, 3, 2, 1]
```

**Alternativa - índice decrescente**:
```java
int[] origem = {1, 2, 3, 4, 5};
int[] reverso = new int[origem.length];

int destIdx = 0;
for (int i = origem.length - 1; i >= 0; i--) {
    reverso[destIdx++] = origem[i];
}
// reverso = [5, 4, 3, 2, 1]
```

### 8️⃣ Performance - Loop vs Métodos Nativos

**Comparação de velocidade**:

```java
int[] arr = new int[1_000_000];
// Preencher array...

// Loop manual - ~10-15ms
long inicio = System.nanoTime();
int[] c1 = new int[arr.length];
for (int i = 0; i < arr.length; i++) {
    c1[i] = arr[i];
}
long fim = System.nanoTime();
System.out.println("Loop: " + (fim - inicio) / 1_000_000 + "ms");

// System.arraycopy - ~1-2ms (5-10x mais rápido)
inicio = System.nanoTime();
int[] c2 = new int[arr.length];
System.arraycopy(arr, 0, c2, 0, arr.length);
fim = System.nanoTime();
System.out.println("arraycopy: " + (fim - inicio) / 1_000_000 + "ms");

// clone() - ~2-3ms
inicio = System.nanoTime();
int[] c3 = arr.clone();
fim = System.nanoTime();
System.out.println("clone: " + (fim - inicio) / 1_000_000 + "ms");
```

**Por que loops são mais lentos?**:
- Overhead de interpretação de bytecode
- Verificação de bounds a cada iteração
- Métodos nativos usam instruções CPU otimizadas (SIMD)

**Quando performance não importa tanto**:
- Arrays pequenos (< 1000 elementos)
- Quando há transformação/lógica durante cópia

### 9️⃣ Cópia Condicional

**Copiar apenas elementos que atendem condição**:

```java
int[] numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

// Copiar apenas ímpares
int[] impares = new int[numeros.length];
int count = 0;

for (int i = 0; i < numeros.length; i++) {
    if (numeros[i] % 2 != 0) {
        impares[count++] = numeros[i];
    }
}

// Ajustar tamanho
impares = Arrays.copyOf(impares, count);
// impares = [1, 3, 5, 7, 9]
```

**Copiar com limite**:
```java
int[] origem = {1, 2, 3, 4, 5, 6, 7, 8};
int[] primeiros5 = new int[Math.min(5, origem.length)];

for (int i = 0; i < primeiros5.length; i++) {
    primeiros5[i] = origem[i];
}
// primeiros5 = [1, 2, 3, 4, 5]
```

### 🔟 Validação Durante Cópia

**Copiar com validação**:

```java
int[] origem = {1, 2, -3, 4, -5, 6};
int[] positivos = new int[origem.length];
int count = 0;

for (int i = 0; i < origem.length; i++) {
    if (origem[i] > 0) {
        positivos[count++] = origem[i];
    } else {
        System.err.println("Valor inválido ignorado: " + origem[i]);
    }
}

positivos = Arrays.copyOf(positivos, count);
// positivos = [1, 2, 4, 6]
```

**Copiar com conversão segura**:
```java
String[] textos = {"123", "456", "abc", "789"};
int[] numeros = new int[textos.length];
int count = 0;

for (int i = 0; i < textos.length; i++) {
    try {
        numeros[count++] = Integer.parseInt(textos[i]);
    } catch (NumberFormatException e) {
        System.err.println("Não é número: " + textos[i]);
    }
}

numeros = Arrays.copyOf(numeros, count);
// numeros = [123, 456, 789]
```

## 🎯 Aplicabilidade

**1. Cópia com Transformação**:
```java
String[] nomes = {"ana", "bob", "carlos"};
String[] maiusculas = new String[nomes.length];

for (int i = 0; i < nomes.length; i++) {
    maiusculas[i] = nomes[i].toUpperCase();
}
```

**2. Cópia Profunda de Objetos**:
```java
Pessoa[] copia = new Pessoa[original.length];
for (int i = 0; i < original.length; i++) {
    copia[i] = new Pessoa(original[i]);
}
```

**3. Filtrar Durante Cópia**:
```java
for (int num : numeros) {
    if (num > 0) {
        positivos[count++] = num;
    }
}
```

**4. Cópia com Logging**:
```java
for (int i = 0; i < arr.length; i++) {
    destino[i] = origem[i];
    System.out.println("Copiado: " + origem[i]);
}
```

**5. Ensino/Aprendizado**:
```java
// Demonstração didática de como cópia funciona
for (int i = 0; i < arr.length; i++) {
    copia[i] = arr[i];
    System.out.println("copia[" + i + "] = " + arr[i]);
}
```

## ⚠️ Armadilhas Comuns

**1. Esquecer de Criar Array Destino**:
```java
int[] origem = {1, 2, 3};
int[] destino;  // null!

for (int i = 0; i < origem.length; i++) {
    destino[i] = origem[i];  // ❌ NullPointerException
}
```

**2. Tamanho Incorreto do Destino**:
```java
int[] origem = {1, 2, 3, 4, 5};
int[] destino = new int[3];  // Muito pequeno!

for (int i = 0; i < origem.length; i++) {
    destino[i] = origem[i];  // ❌ ArrayIndexOutOfBoundsException
}
```

**3. Cópia Superficial Não Intencional**:
```java
Pessoa[] copia = new Pessoa[original.length];
for (int i = 0; i < original.length; i++) {
    copia[i] = original[i];  // ⚠️ Apenas referências!
}
```

**4. Off-by-One Error**:
```java
for (int i = 0; i <= origem.length; i++) {  // ❌ <= (deveria ser <)
    destino[i] = origem[i];  // ArrayIndexOutOfBoundsException
}
```

**5. Usar For-Each Sem Índice**:
```java
int indice = 0;
for (int elem : origem) {
    destino[indice] = elem;  // ❌ Esqueceu de incrementar indice
}
```

## ✅ Boas Práticas

**1. Prefira Métodos Nativos para Cópia Simples**:
```java
// ❌ Desnecessariamente complexo
int[] copia = new int[arr.length];
for (int i = 0; i < arr.length; i++) {
    copia[i] = arr[i];
}

// ✓ Mais simples e rápido
int[] copia = arr.clone();
```

**2. Use Loops Quando Há Lógica Adicional**:
```java
// ✓ Justificado - transformação durante cópia
for (int i = 0; i < arr.length; i++) {
    destino[i] = arr[i] * 2;
}
```

**3. Valide Tamanhos Antes de Copiar**:
```java
if (destino.length >= origem.length) {
    for (int i = 0; i < origem.length; i++) {
        destino[i] = origem[i];
    }
}
```

**4. Use Enhanced For Quando Não Precisa de Índice**:
```java
int idx = 0;
for (String nome : nomes) {
    copia[idx++] = nome;
}
```

**5. Documente Intenção da Cópia Manual**:
```java
/**
 * Copia array aplicando transformação a cada elemento
 */
for (int i = 0; i < arr.length; i++) {
    resultado[i] = transformar(arr[i]);
}
```

**6. Considere Usar Streams para Transformações**:
```java
// Loop manual
int[] dobrados = new int[arr.length];
for (int i = 0; i < arr.length; i++) {
    dobrados[i] = arr[i] * 2;
}

// Stream (Java 8+)
int[] dobrados = Arrays.stream(arr)
                       .map(n -> n * 2)
                       .toArray();
```

## 📚 Resumo Executivo

**Cópia manual** usa loops para copiar arrays elemento por elemento.

**Padrão básico**:
```java
TipoArray[] destino = new TipoArray[origem.length];
for (int i = 0; i < origem.length; i++) {
    destino[i] = origem[i];
}
```

**Variações**:

**For tradicional** - mais comum:
```java
for (int i = 0; i < arr.length; i++) {
    copia[i] = arr[i];
}
```

**For-each** - sem índice:
```java
int idx = 0;
for (int elem : arr) {
    copia[idx++] = elem;
}
```

**While**:
```java
int i = 0;
while (i < arr.length) {
    copia[i] = arr[i++];
}
```

**Vantagens**:
- ✓ Controle total sobre cada elemento
- ✓ Permite transformações e validações
- ✓ Cópia condicional/filtrada
- ✓ Didático para aprendizado

**Desvantagens**:
- ✗ Mais verboso
- ✗ Mais lento que métodos nativos (5-10x)
- ✗ Propenso a erros (índices, tamanhos)

**Quando usar**:
- Cópia com transformação
- Cópia profunda de objetos
- Filtro durante cópia
- Necessidade de logging/debug
- Fins didáticos

**Quando NÃO usar**:
- Cópia simples sem lógica adicional
- Performance é crítica
- Arrays grandes (> 10.000 elementos)

**Alternativas mais eficientes**:
```java
arr.clone()                    // Mais simples
Arrays.copyOf(arr, len)        // Permite redimensionar
System.arraycopy(...)          // Mais rápido e flexível
```

**Use loops quando**: há lógica adicional que justifique a complexidade.
