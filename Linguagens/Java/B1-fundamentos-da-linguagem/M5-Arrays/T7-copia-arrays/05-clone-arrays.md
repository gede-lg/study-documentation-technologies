# Clone de Arrays - Método clone()

## 🎯 Introdução e Definição

**`clone()`** é um método herdado de `Object` que **cria uma cópia de um array**, retornando um **novo array** com o mesmo conteúdo e tipo do original.

**Conceito central**: forma **simples e rápida** de copiar array completo sem especificar tamanho ou usar bibliotecas externas.

**Sintaxe fundamental**:
```java
TipoArray[] copia = original.clone();
```

**Exemplo básico**:
```java
int[] original = {1, 2, 3, 4, 5};
int[] copia = original.clone();

// Arrays independentes
copia[0] = 999;
System.out.println(original[0]);  // 1 (inalterado)
```

**Retorno**: novo array do **mesmo tipo** e **mesmo tamanho** do original.

**Vantagem**: sintaxe **mais simples** que outros métodos de cópia.

## 📋 Fundamentos Teóricos

### 1️⃣ Arrays Implementam Cloneable

**Arrays automaticamente implementam `Cloneable`**:

```java
int[] arr = {1, 2, 3};
System.out.println(arr instanceof Cloneable);  // true
```

**Não precisa de cast** (diferente de `Object.clone()`):
```java
// Objetos normais
class Pessoa implements Cloneable {
    @Override
    protected Pessoa clone() throws CloneNotSupportedException {
        return (Pessoa) super.clone();  // Cast necessário
    }
}

// Arrays - sem cast
int[] original = {1, 2, 3};
int[] copia = original.clone();  // ✓ Tipo correto automaticamente
```

**Tipo de retorno covariante**:
- `int[].clone()` retorna `int[]`
- `String[].clone()` retorna `String[]`
- Não retorna `Object`

### 2️⃣ Cópia Completa - Sempre Mesmo Tamanho

**clone() sempre copia array inteiro**:

```java
int[] original = {10, 20, 30, 40, 50};
int[] copia = original.clone();

// Mesmo conteúdo e tamanho
System.out.println(Arrays.equals(original, copia));  // true
System.out.println(copia.length);  // 5

// Mas objetos diferentes
System.out.println(original == copia);  // false
```

**Não permite redimensionar**:
```java
// ❌ Não há como fazer isso com clone()
int[] parcial = original.clone(3);  // Não existe

// Use Arrays.copyOf() se precisar redimensionar
int[] parcial = Arrays.copyOf(original, 3);
```

### 3️⃣ Cópia com Tipos Primitivos

**Primitivos**: cópia de **valores** (sempre independente):

```java
int[] nums = {1, 2, 3, 4, 5};
int[] copia = nums.clone();

// Totalmente independentes
copia[0] = 999;
copia[2] = 777;

System.out.println(Arrays.toString(nums));   // [1, 2, 3, 4, 5]
System.out.println(Arrays.toString(copia));  // [999, 2, 777, 4, 5]
```

**Todos os tipos primitivos**:
```java
byte[] bytes = {1, 2, 3};
byte[] copiaBytes = bytes.clone();

double[] doubles = {1.5, 2.5, 3.5};
double[] copiaDoubles = doubles.clone();

boolean[] flags = {true, false, true};
boolean[] copiaFlags = flags.clone();

char[] chars = {'A', 'B', 'C'};
char[] copiaChars = chars.clone();
```

### 4️⃣ Cópia Superficial com Objetos

**Objetos**: copia **referências**, não objetos:

```java
class Pessoa {
    String nome;
    int idade;
    
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

Pessoa[] original = {
    new Pessoa("Ana", 25),
    new Pessoa("Bob", 30)
};

Pessoa[] copia = original.clone();

// Arrays diferentes...
System.out.println(original == copia);  // false

// ...mas elementos apontam para mesmos objetos
System.out.println(original[0] == copia[0]);  // true (!)

// Modificar objeto afeta ambos arrays
copia[0].nome = "Carlos";
System.out.println(original[0].nome);  // "Carlos" (!)
```

**Diagrama de memória**:
```
original → [ref1, ref2]
                ↓    ↓
copia    → [ref1, ref2]  (mesmas referências)
                ↓    ↓
           Pessoa("Ana")  Pessoa("Bob")
           (objetos compartilhados)
```

### 5️⃣ Strings - Seguro Apesar de Superficial

**Strings são imutáveis** - cópia superficial é segura:

```java
String[] original = {"Ana", "Bob", "Carlos"};
String[] copia = original.clone();

// Mesmas referências...
System.out.println(original[0] == copia[0]);  // true

// ...mas Strings são imutáveis
copia[0] = "Diana";  // Reatribui referência, não modifica String
System.out.println(original[0]);  // "Ana" (inalterado)
```

**Por que funciona**:
- `copia[0] = "Diana"` cria **nova referência** em `copia[0]`
- `original[0]` ainda aponta para `"Ana"`
- Strings não podem ser modificadas (sem setters)

### 6️⃣ Arrays Multidimensionais - Cópia Rasa

**Arrays 2D** - clona apenas primeiro nível:

```java
int[][] original = {{1, 2}, {3, 4}};
int[][] copia = original.clone();

// Arrays principais diferentes...
System.out.println(original == copia);  // false

// ...mas sub-arrays compartilhados!
System.out.println(original[0] == copia[0]);  // true (!)

// Modificar sub-array afeta ambos
copia[0][0] = 999;
System.out.println(original[0][0]);  // 999 (!)
```

**Cópia profunda de matriz**:
```java
int[][] original = {{1, 2}, {3, 4}};
int[][] copiaP = new int[original.length][];

// Clonar cada sub-array
for (int i = 0; i < original.length; i++) {
    copiaP[i] = original[i].clone();
}

// Agora totalmente independentes
copiaP[0][0] = 999;
System.out.println(original[0][0]);  // 1 (inalterado!)
```

**Arrays 3D**:
```java
int[][][] cubo = {{{1, 2}, {3, 4}}, {{5, 6}, {7, 8}}};
int[][][] copiaP = new int[cubo.length][][];

for (int i = 0; i < cubo.length; i++) {
    copiaP[i] = new int[cubo[i].length][];
    for (int j = 0; j < cubo[i].length; j++) {
        copiaP[i][j] = cubo[i][j].clone();
    }
}
```

### 7️⃣ Não Lança CloneNotSupportedException

**Arrays NUNCA lançam `CloneNotSupportedException`**:

```java
int[] arr = {1, 2, 3};

// Não precisa de try-catch
int[] copia = arr.clone();  // ✓ Sempre funciona

// Compare com objetos customizados
class Pessoa implements Cloneable {
    @Override
    protected Pessoa clone() throws CloneNotSupportedException {
        return (Pessoa) super.clone();  // Pode lançar exceção
    }
}
```

**Por quê?**
- Arrays **sempre** implementam `Cloneable`
- JVM garante que `clone()` funcione para arrays

### 8️⃣ vs Arrays.copyOf()

**Comparação**:

| Aspecto | clone() | Arrays.copyOf() |
|---------|---------|-----------------|
| Sintaxe | `arr.clone()` | `Arrays.copyOf(arr, len)` |
| Tamanho | Sempre igual ao original | Permite redimensionar |
| Import | Não precisa | `import java.util.Arrays` |
| Tipo retorno | Tipo exato (covariante) | Tipo exato |
| Performance | ~mesma | ~mesma |

**clone()**:
```java
int[] arr = {1, 2, 3, 4, 5};
int[] copia = arr.clone();
// [1, 2, 3, 4, 5] - sempre mesmo tamanho
```

**copyOf()**:
```java
int[] arr = {1, 2, 3, 4, 5};

int[] igual = Arrays.copyOf(arr, arr.length);     // [1, 2, 3, 4, 5]
int[] maior = Arrays.copyOf(arr, 8);              // [1, 2, 3, 4, 5, 0, 0, 0]
int[] menor = Arrays.copyOf(arr, 3);              // [1, 2, 3]
```

**Quando usar cada um**:
- **clone()**: cópia simples do array completo
- **copyOf()**: quando precisa redimensionar

### 9️⃣ vs System.arraycopy()

**clone()** - sintaxe mais simples:
```java
int[] copia = original.clone();
```

**System.arraycopy()** - mais flexível:
```java
int[] copia = new int[original.length];
System.arraycopy(original, 0, copia, 0, original.length);

// Permite copiar parte do array
int[] parte = new int[3];
System.arraycopy(original, 2, parte, 0, 3);
```

**Comparação**:

| Característica | clone() | System.arraycopy() |
|----------------|---------|-------------------|
| Simplicidade | ✓✓✓ Mais simples | Mais verboso |
| Flexibilidade | Apenas completo | ✓ Offset origem/destino |
| Cria array | ✓ Sim | Precisa criar manualmente |
| Performance | Alta | ✓✓ Ligeiramente mais rápido |

### 🔟 Performance

**clone() é rápido** - implementação nativa:

```java
int[] arr = new int[1_000_000];
// Preencher array...

long inicio = System.nanoTime();
int[] copia = arr.clone();
long fim = System.nanoTime();

System.out.println("clone(): " + (fim - inicio) / 1_000_000 + "ms");
// ~2-5ms para 1 milhão de elementos
```

**Comparação de performance**:
```java
// clone() - ~2ms
int[] c1 = arr.clone();

// Arrays.copyOf() - ~2ms (usa arraycopy internamente)
int[] c2 = Arrays.copyOf(arr, arr.length);

// System.arraycopy() - ~1-2ms (ligeiramente mais rápido)
int[] c3 = new int[arr.length];
System.arraycopy(arr, 0, c3, 0, arr.length);

// Loop manual - ~10-15ms (muito mais lento)
int[] c4 = new int[arr.length];
for (int i = 0; i < arr.length; i++) {
    c4[i] = arr[i];
}
```

**Complexidade**: **O(n)** onde n = tamanho do array.

## 🎯 Aplicabilidade

**1. Cópia Rápida de Arrays Primitivos**:
```java
int[] backup = dados.clone();
```

**2. Cópia Defensiva em Métodos**:
```java
class Cache {
    private int[] dados;
    
    public int[] getDados() {
        return dados.clone();  // Protege estado interno
    }
    
    public void setDados(int[] novos) {
        this.dados = novos.clone();  // Evita modificação externa
    }
}
```

**3. Snapshot de Estado**:
```java
int[] estadoAtual = array.clone();
// Processar...
// Se erro: restaurar array = estadoAtual
```

**4. Testes Unitários**:
```java
@Test
public void testOrdenacao() {
    int[] original = {5, 2, 8, 1, 9};
    int[] esperado = {1, 2, 5, 8, 9};
    int[] teste = original.clone();
    
    ordenar(teste);
    assertArrayEquals(esperado, teste);
    // original preservado para outros testes
}
```

**5. Implementar Undo/Redo**:
```java
Stack<int[]> history = new Stack<>();

void salvarEstado(int[] arr) {
    history.push(arr.clone());
}

int[] desfazer() {
    return history.pop();
}
```

## ⚠️ Armadilhas Comuns

**1. Assumir Cópia Profunda com Objetos**:
```java
Pessoa[] original = {new Pessoa("Ana", 25)};
Pessoa[] copia = original.clone();

copia[0].nome = "Bob";
// ⚠️ original[0].nome também é "Bob"
```

**2. Clonar Arrays 2D - Apenas Primeiro Nível**:
```java
int[][] matriz = {{1, 2}, {3, 4}};
int[][] copia = matriz.clone();

copia[0][0] = 999;
// ⚠️ matriz[0][0] também é 999 (sub-arrays compartilhados)
```

**3. Esquecer de Atribuir Resultado**:
```java
int[] arr = {1, 2, 3};
arr.clone();  // ❌ Resultado perdido

// ✓ Correto
int[] copia = arr.clone();
```

**4. Confundir com Object.clone()**:
```java
// Arrays - sem exceção
int[] copia = arr.clone();

// Objetos - pode lançar exceção
Pessoa copia = pessoa.clone();  // throws CloneNotSupportedException
```

**5. Usar para Redimensionar**:
```java
// ❌ clone() não permite redimensionar
int[] maior = arr.clone(10);  // Não existe

// ✓ Use Arrays.copyOf()
int[] maior = Arrays.copyOf(arr, 10);
```

## ✅ Boas Práticas

**1. Use clone() para Cópias Simples**:
```java
int[] copia = original.clone();  // Simples e direto
```

**2. Clone Cada Nível em Arrays Multidimensionais**:
```java
int[][] copiaP = new int[matriz.length][];
for (int i = 0; i < matriz.length; i++) {
    copiaP[i] = matriz[i].clone();
}
```

**3. Prefira clone() Quando Não Precisa Redimensionar**:
```java
// ✓ clone() - mais simples
int[] copia = arr.clone();

// Desnecessário se não redimensionar
int[] copia = Arrays.copyOf(arr, arr.length);
```

**4. Documente Tipo de Cópia**:
```java
/**
 * Retorna cópia SUPERFICIAL do array
 */
public Pessoa[] getPessoas() {
    return pessoas.clone();
}
```

**5. Use com Imutáveis ou Primitivos**:
```java
// ✓ Seguro - primitivos
int[] nums = original.clone();

// ✓ Seguro - Strings (imutáveis)
String[] nomes = original.clone();

// ⚠️ Cuidado - objetos mutáveis
Pessoa[] pessoas = original.clone();  // Superficial
```

**6. Combine com Imutabilidade**:
```java
public final class Config {
    private final int[] valores;
    
    public Config(int[] valores) {
        this.valores = valores.clone();  // Cópia defensiva
    }
    
    public int[] getValores() {
        return valores.clone();  // Retorna cópia
    }
}
```

## 📚 Resumo Executivo

`clone()` cria **cópia de array** do mesmo tipo e tamanho.

**Sintaxe**:
```java
TipoArray[] copia = original.clone();
```

**Características**:
- **Sempre mesmo tamanho**: não redimensiona
- **Cria novo array**: independente do original
- **Não lança exceção**: arrays sempre "clonáveis"
- **Tipo covariante**: retorna tipo exato (int[], String[], etc.)
- **Cópia superficial**: objetos compartilham referências

**Exemplo completo**:
```java
// Primitivos - totalmente independentes
int[] nums = {1, 2, 3};
int[] copia = nums.clone();
copia[0] = 999;
System.out.println(nums[0]);  // 1 ✓

// Objetos - referências compartilhadas
Pessoa[] pessoas = {new Pessoa("Ana")};
Pessoa[] copia2 = pessoas.clone();
copia2[0].nome = "Bob";
System.out.println(pessoas[0].nome);  // "Bob" ⚠️
```

**Arrays multidimensionais**:
```java
// ❌ Cópia rasa
int[][] copia = matriz.clone();

// ✓ Cópia profunda
int[][] copiaP = new int[matriz.length][];
for (int i = 0; i < matriz.length; i++) {
    copiaP[i] = matriz[i].clone();
}
```

**vs outros métodos**:
- `clone()`: mais simples, sempre tamanho completo
- `Arrays.copyOf()`: permite redimensionar
- `System.arraycopy()`: mais flexível (offset)

**Quando usar**: cópias simples de arrays completos, especialmente com primitivos ou imutáveis.
