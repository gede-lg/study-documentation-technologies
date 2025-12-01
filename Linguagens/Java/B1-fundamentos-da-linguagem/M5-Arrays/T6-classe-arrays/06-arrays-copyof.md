# Arrays.copyOf() e Arrays.copyOfRange() - Cópia de Arrays

## 🎯 Introdução e Definição

**`Arrays.copyOf()`** e **`Arrays.copyOfRange()`** são métodos estáticos que **criam uma nova cópia de um array** (completo ou parcial), opcionalmente **redimensionando** o array.

**Conceito central**: criam **novo array** independente, preservando o original, com possibilidade de alterar tamanho.

**Sintaxe fundamental**:
```java
novoArray = Arrays.copyOf(original, novoTamanho);
novoArray = Arrays.copyOfRange(original, from, to);
```

**Exemplo básico**:
```java
int[] original = {1, 2, 3};
int[] copia = Arrays.copyOf(original, 3);
// copia = [1, 2, 3] (novo array)
```

**Diferença chave**:
- `copyOf()`: copia do **início**, especifica **tamanho total**
- `copyOfRange()`: copia **intervalo específico**

Ambos criam **novo array** - não modificam original.

## 📋 Fundamentos Teóricos

### 1️⃣ Arrays.copyOf() - Cópia com Redimensionamento

**Cópia exata** (mesmo tamanho):
```java
int[] original = {1, 2, 3, 4, 5};
int[] copia = Arrays.copyOf(original, original.length);
// copia = [1, 2, 3, 4, 5]

// Arrays independentes
copia[0] = 999;
System.out.println(original[0]);  // 1 (inalterado)
```

**Redimensionar - aumentar** (preenche com zeros/null):
```java
int[] original = {1, 2, 3};
int[] expandido = Arrays.copyOf(original, 5);
// expandido = [1, 2, 3, 0, 0]
```

**Redimensionar - diminuir** (trunca elementos):
```java
int[] original = {1, 2, 3, 4, 5};
int[] reduzido = Arrays.copyOf(original, 3);
// reduzido = [1, 2, 3] (4 e 5 descartados)
```

**Sintaxe**:
```java
TipoArray[] copia = Arrays.copyOf(original, novoComprimento);
```

### 2️⃣ Arrays.copyOfRange() - Cópia de Intervalo

Copia **apenas um intervalo**:

```java
int[] original = {10, 20, 30, 40, 50};
//                 0   1   2   3   4 (índices)

int[] parte = Arrays.copyOfRange(original, 1, 4);
// parte = [20, 30, 40] (índices 1-3, 4 exclusivo)
```

**Parâmetros**:
- `from`: **inclusivo** (começa aqui)
- `to`: **exclusivo** (para antes daqui)

**Exemplos práticos**:
```java
int[] arr = {1, 2, 3, 4, 5, 6, 7};

// Primeiros 3 elementos
int[] inicio = Arrays.copyOfRange(arr, 0, 3);
// [1, 2, 3]

// Últimos 3 elementos
int[] fim = Arrays.copyOfRange(arr, 4, 7);
// [5, 6, 7]

// Do meio
int[] meio = Arrays.copyOfRange(arr, 2, 5);
// [3, 4, 5]
```

**Sintaxe**:
```java
TipoArray[] copia = Arrays.copyOfRange(original, from, to);
```

### 3️⃣ Sobrecarga para Tipos Primitivos e Objetos

**Primitivos**:
```java
// Inteiros
int[] ints = {1, 2, 3};
int[] copiaInts = Arrays.copyOf(ints, 3);

// Doubles
double[] doubles = {1.5, 2.5};
double[] copiaDoubles = Arrays.copyOf(doubles, 2);

// Chars
char[] chars = {'a', 'b', 'c'};
char[] copiaChars = Arrays.copyOf(chars, 3);

// Todos os 8 tipos primitivos suportados
```

**Objetos**:
```java
String[] nomes = {"Ana", "Bob", "Carlos"};
String[] copiaNomes = Arrays.copyOf(nomes, 3);
// ["Ana", "Bob", "Carlos"]
```

**Objetos customizados**:
```java
Pessoa[] pessoas = {new Pessoa("Ana"), new Pessoa("Bob")};
Pessoa[] copiaPessoas = Arrays.copyOf(pessoas, 2);
```

### 4️⃣ Cópia Rasa (Shallow Copy) - Objetos

**IMPORTANTE**: `copyOf()` faz **cópia rasa** - elementos **referenciam os mesmos objetos**:

```java
class Pessoa {
    String nome;
    Pessoa(String nome) { this.nome = nome; }
}

Pessoa[] original = {new Pessoa("Ana"), new Pessoa("Bob")};
Pessoa[] copia = Arrays.copyOf(original, 2);

// Arrays diferentes, mas elementos apontam para mesmos objetos
System.out.println(original == copia);  // false (arrays diferentes)
System.out.println(original[0] == copia[0]);  // true (mesmo objeto)

// Modificar objeto afeta ambos arrays
copia[0].nome = "Carlos";
System.out.println(original[0].nome);  // "Carlos" (!)
```

**Cópia profunda (deep copy)** requer implementação manual:
```java
Pessoa[] original = {new Pessoa("Ana"), new Pessoa("Bob")};
Pessoa[] copiaP = new Pessoa[original.length];

for (int i = 0; i < original.length; i++) {
    copiaP[i] = new Pessoa(original[i].nome);  // Nova instância
}
```

### 5️⃣ Preenchimento com Valores Padrão

**Expandir - valores padrão**:

```java
// Primitivos - preenche com 0/false
int[] arr = {1, 2, 3};
int[] expandido = Arrays.copyOf(arr, 6);
// [1, 2, 3, 0, 0, 0]

boolean[] flags = {true};
boolean[] exp = Arrays.copyOf(flags, 3);
// [true, false, false]

// Objetos - preenche com null
String[] nomes = {"Ana", "Bob"};
String[] expandidos = Arrays.copyOf(nomes, 4);
// ["Ana", "Bob", null, null]
```

**Valores padrão por tipo**:
- Numéricos (`int`, `double`, etc.): `0` / `0.0`
- `boolean`: `false`
- `char`: `'\u0000'`
- Objetos: `null`

### 6️⃣ vs System.arraycopy()

**System.arraycopy()** - cópia em array existente:
```java
int[] origem = {1, 2, 3, 4, 5};
int[] destino = new int[5];

System.arraycopy(origem, 0, destino, 0, 5);
// destino = [1, 2, 3, 4, 5]
```

**Comparação**:

| Aspecto | copyOf() | System.arraycopy() |
|---------|----------|-------------------|
| Cria novo array | ✓ Sim | ✗ Não (copia para existente) |
| Redimensiona | ✓ Sim | ✗ Não |
| Simplicidade | ✓ Mais simples | Mais verboso |
| Flexibilidade | Menos | ✓ Mais (offset origem/destino) |

**Exemplo equivalente**:
```java
// copyOf()
int[] copia = Arrays.copyOf(arr, arr.length);

// System.arraycopy() equivalente
int[] copia2 = new int[arr.length];
System.arraycopy(arr, 0, copia2, 0, arr.length);
```

### 7️⃣ Complexidade de Tempo

**Complexidade**: **O(n)** onde n = número de elementos copiados.

```java
// copyOf() - O(novoTamanho)
int[] copia = Arrays.copyOf(arr, 1000);  // O(1000)

// copyOfRange() - O(to - from)
int[] parte = Arrays.copyOfRange(arr, 10, 50);  // O(40)
```

**Internamente**: usa métodos nativos otimizados (arraycopy do sistema).

**Benchmark**:
```java
int[] arr = new int[1_000_000];

long inicio = System.nanoTime();
int[] copia = Arrays.copyOf(arr, arr.length);
long fim = System.nanoTime();

System.out.println("Tempo: " + (fim - inicio) / 1_000_000 + "ms");
// ~5-10ms para 1 milhão de elementos
```

### 8️⃣ Arrays Multidimensionais - Cópia Rasa

**Arrays 2D** - cópia rasa dos sub-arrays:

```java
int[][] original = {{1, 2}, {3, 4}};
int[][] copia = Arrays.copyOf(original, 2);

// Arrays principais diferentes, mas sub-arrays compartilhados
System.out.println(original == copia);  // false
System.out.println(original[0] == copia[0]);  // true (mesma linha)

// Modificar linha afeta ambos
copia[0][0] = 999;
System.out.println(original[0][0]);  // 999 (!)
```

**Cópia profunda de matriz**:
```java
int[][] original = {{1, 2}, {3, 4}};
int[][] copiaP = new int[original.length][];

for (int i = 0; i < original.length; i++) {
    copiaP[i] = Arrays.copyOf(original[i], original[i].length);
}

// Agora são independentes
copiaP[0][0] = 999;
System.out.println(original[0][0]);  // 1 (inalterado)
```

### 9️⃣ Validação de Parâmetros

**Tamanho negativo** gera `NegativeArraySizeException`:
```java
int[] arr = {1, 2, 3};
int[] copia = Arrays.copyOf(arr, -1);  // ❌ Exceção
```

**Índices inválidos** (`copyOfRange`):
```java
int[] arr = {1, 2, 3, 4, 5};

// from < 0
Arrays.copyOfRange(arr, -1, 3);  // ❌ ArrayIndexOutOfBoundsException

// from > to
Arrays.copyOfRange(arr, 3, 1);  // ❌ IllegalArgumentException

// to > length - OK! Preenche com zeros
int[] copia = Arrays.copyOfRange(arr, 2, 10);
// [3, 4, 5, 0, 0, 0, 0, 0] (permite expandir)
```

### 🔟 Uso em Programação Defensiva

**Retornar cópias** para prevenir modificação externa:

```java
class Turma {
    private int[] notas;
    
    public int[] getNotas() {
        // ❌ Retorna referência - permite modificação
        return notas;
        
        // ✓ Retorna cópia - protege dados internos
        return Arrays.copyOf(notas, notas.length);
    }
    
    public void setNotas(int[] notas) {
        // ✓ Armazena cópia - previne modificação externa
        this.notas = Arrays.copyOf(notas, notas.length);
    }
}
```

**Exemplo de problema**:
```java
// Sem cópia defensiva
class Turma {
    private int[] notas;
    public int[] getNotas() { return notas; }
}

Turma turma = new Turma();
int[] notas = turma.getNotas();
notas[0] = 100;  // ⚠️ Modifica dados internos!
```

## 🎯 Aplicabilidade

**1. Cópia Defensiva**:
```java
public int[] getArray() {
    return Arrays.copyOf(internalArray, internalArray.length);
}
```

**2. Redimensionar Dinamicamente**:
```java
if (tamanho > capacidade) {
    array = Arrays.copyOf(array, capacidade * 2);
}
```

**3. Extrair Subconjunto**:
```java
int[] primeiros10 = Arrays.copyOfRange(dados, 0, 10);
```

**4. Implementar Estruturas Dinâmicas**:
```java
class ArrayList {
    private int[] elementos;
    
    void adicionar(int valor) {
        elementos = Arrays.copyOf(elementos, elementos.length + 1);
        elementos[elementos.length - 1] = valor;
    }
}
```

**5. Backup de Dados**:
```java
int[] backup = Arrays.copyOf(dadosOriginais, dadosOriginais.length);
// Processar dadosOriginais...
// Se erro, restaurar: dadosOriginais = backup;
```

## ⚠️ Armadilhas Comuns

**1. Cópia Rasa com Objetos**:
```java
Pessoa[] copia = Arrays.copyOf(original, 2);
copia[0].nome = "X";
// ⚠️ original[0].nome também é "X"
```

**2. Confundir copyOf() com clone()**:
```java
int[] arr = {1, 2, 3};
int[] c1 = arr.clone();  // Cópia (mesmo tamanho)
int[] c2 = Arrays.copyOf(arr, 5);  // Pode redimensionar
```

**3. Assumir Cópia Profunda em 2D**:
```java
int[][] copia = Arrays.copyOf(matriz, 2);
// ⚠️ Sub-arrays ainda compartilhados
```

**4. Esquecer que Cria Novo Array**:
```java
Arrays.copyOf(arr, 5);  // ❌ Resultado perdido
int[] novo = Arrays.copyOf(arr, 5);  // ✓ Armazenar retorno
```

**5. Índices Invertidos em copyOfRange()**:
```java
Arrays.copyOfRange(arr, 5, 2);  // ❌ from > to
```

## ✅ Boas Práticas

**1. Use copyOf() para Cópia + Redimensionamento**:
```java
int[] expandido = Arrays.copyOf(arr, novoTamanho);
```

**2. Use copyOfRange() para Subconjuntos**:
```java
int[] parte = Arrays.copyOfRange(arr, inicio, fim);
```

**3. Implemente Cópia Profunda para Objetos**:
```java
Obj[] copia = new Obj[original.length];
for (int i = 0; i < original.length; i++) {
    copia[i] = new Obj(original[i]);  // Construtor de cópia
}
```

**4. Cópia Defensiva em Getters/Setters**:
```java
public int[] getDados() {
    return Arrays.copyOf(dados, dados.length);
}
```

**5. Valide Parâmetros**:
```java
if (novoTamanho >= 0 && from >= 0 && to > from) {
    copia = Arrays.copyOf(arr, novoTamanho);
}
```

**6. Documente Comportamento de Cópia**:
```java
/**
 * Retorna cópia do array (não afeta original)
 */
public int[] copiarDados() {
    return Arrays.copyOf(dados, dados.length);
}
```

## 📚 Resumo Executivo

`Arrays.copyOf()` e `copyOfRange()` criam **nova cópia** de array.

**copyOf() - cópia com redimensionamento**:
```java
int[] copia = Arrays.copyOf(original, novoTamanho);
```
- Tamanho > original: preenche com zeros/null
- Tamanho < original: trunca

**copyOfRange() - cópia de intervalo**:
```java
int[] copia = Arrays.copyOfRange(original, from, to);
```
- `from`: inclusivo
- `to`: exclusivo

**Características**:
- **Cria novo array** (não modifica original)
- **Cópia rasa**: objetos referenciam mesmas instâncias
- **Complexidade**: O(n)

**vs clone()**:
```java
arr.clone()  // Sempre copia tamanho completo
Arrays.copyOf(arr, tamanho)  // Pode redimensionar
```

**Exemplo completo**:
```java
int[] arr = {1, 2, 3, 4, 5};

int[] copia = Arrays.copyOf(arr, 3);  // [1, 2, 3]
int[] expandido = Arrays.copyOf(arr, 7);  // [1, 2, 3, 4, 5, 0, 0]
int[] parte = Arrays.copyOfRange(arr, 1, 4);  // [2, 3, 4]
```

**Importar**: `import java.util.Arrays;`
