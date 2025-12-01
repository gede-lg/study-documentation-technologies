# Cópia Superficial vs Profunda em Arrays

## 🎯 Introdução e Definição

**Cópia superficial (shallow copy)** e **cópia profunda (deep copy)** são dois conceitos fundamentais que determinam como arrays de objetos são copiados, especialmente quando contêm referências a outros objetos.

**Conceito central**: 
- **Cópia superficial**: copia apenas as **referências** dos objetos
- **Cópia profunda**: cria **novas instâncias** dos objetos

**Exemplo visual**:
```java
// Array original com objetos
Pessoa[] original = {new Pessoa("Ana", 25)};

// Cópia superficial - compartilha objetos
Pessoa[] superficial = Arrays.copyOf(original, 1);
// original[0] e superficial[0] apontam para MESMO objeto

// Cópia profunda - objetos independentes
Pessoa[] profunda = new Pessoa[1];
profunda[0] = new Pessoa(original[0].nome, original[0].idade);
// Objetos completamente separados
```

**Implicação crítica**: cópia superficial permite que modificações em um array afetem o outro!

## 📋 Fundamentos Teóricos

### 1️⃣ Cópia Superficial - Compartilhamento de Objetos

**Definição**: copia o array mas **mantém referências** aos mesmos objetos.

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

// Cópia superficial (Arrays.copyOf, clone, etc.)
Pessoa[] copia = Arrays.copyOf(original, 2);

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
           (mesmo objeto compartilhado)
```

### 2️⃣ Cópia Profunda - Novos Objetos

**Definição**: cria **novo array** e **novas instâncias** de cada objeto.

```java
Pessoa[] original = {
    new Pessoa("Ana", 25),
    new Pessoa("Bob", 30)
};

// Cópia profunda manual
Pessoa[] copiaP = new Pessoa[original.length];
for (int i = 0; i < original.length; i++) {
    copiaP[i] = new Pessoa(original[i].nome, original[i].idade);
}

// Arrays diferentes E objetos diferentes
System.out.println(original == copiaP);        // false
System.out.println(original[0] == copiaP[0]);  // false (!)

// Modificações são independentes
copiaP[0].nome = "Carlos";
System.out.println(original[0].nome);  // "Ana" (inalterado!)
```

**Diagrama de memória**:
```
original → [ref1, ref2]
              ↓    ↓
         Pessoa("Ana")  Pessoa("Bob")

copiaP   → [ref3, ref4]
              ↓    ↓
         Pessoa("Ana")  Pessoa("Bob")
         (objetos completamente separados)
```

### 3️⃣ Arrays Primitivos - Sempre Cópia Profunda

**Arrays primitivos** sempre fazem cópia profunda (valores, não referências):

```java
int[] original = {1, 2, 3, 4, 5};
int[] copia = Arrays.copyOf(original, 5);

// Arrays independentes
copia[0] = 999;
System.out.println(original[0]);  // 1 (inalterado)

// Não há conceito de "superficial" para primitivos
// Valores são copiados diretamente
```

**Tipos primitivos**:
```java
// int, double, char, boolean, etc.
double[] arr = {1.5, 2.5, 3.5};
double[] copia = arr.clone();

copia[0] = 999.9;
System.out.println(arr[0]);  // 1.5 (sempre independente)
```

### 4️⃣ Strings - Comportamento Especial

**Strings são imutáveis** - cópia superficial é segura:

```java
String[] original = {"Ana", "Bob", "Carlos"};
String[] copia = Arrays.copyOf(original, 3);

// Mesmas referências...
System.out.println(original[0] == copia[0]);  // true

// ...mas Strings são imutáveis, então seguro!
copia[0] = "Diana";
System.out.println(original[0]);  // "Ana" (inalterado)

// Reatribuição cria nova referência, não modifica String
```

**Por que funciona**:
- Strings são **imutáveis**
- `copia[0] = "Diana"` cria **nova referência**, não modifica String original
- Não há risco de modificação compartilhada

### 5️⃣ Objetos Mutáveis vs Imutáveis

**Objetos mutáveis** requerem cópia profunda:

```java
// StringBuilder é mutável
StringBuilder[] original = {new StringBuilder("Ana")};
StringBuilder[] copia = original.clone();

// Mesmo objeto compartilhado
copia[0].append(" Silva");
System.out.println(original[0]);  // "Ana Silva" (!)
```

**Objetos imutáveis** são seguros com cópia superficial:

```java
// Integer é imutável (wrapper)
Integer[] original = {10, 20, 30};
Integer[] copia = Arrays.copyOf(original, 3);

// Reatribuição é segura
copia[0] = 999;
System.out.println(original[0]);  // 10 (inalterado)
```

**Classes comuns**:
- **Imutáveis**: String, Integer, Double, Boolean, LocalDate, BigDecimal
- **Mutáveis**: StringBuilder, ArrayList, Date, arrays, objetos customizados

### 6️⃣ Arrays Multidimensionais - Cópia Rasa do Primeiro Nível

**Arrays 2D** - cópia superficial dos sub-arrays:

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

// Copiar cada sub-array
for (int i = 0; i < original.length; i++) {
    copiaP[i] = Arrays.copyOf(original[i], original[i].length);
}

// Agora completamente independentes
copiaP[0][0] = 999;
System.out.println(original[0][0]);  // 1 (inalterado!)
```

### 7️⃣ Implementando Cópia Profunda - Padrões Comuns

**Padrão 1: Construtor de cópia**

```java
class Pessoa implements Cloneable {
    String nome;
    int idade;
    
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // Construtor de cópia
    Pessoa(Pessoa outro) {
        this.nome = outro.nome;
        this.idade = outro.idade;
    }
}

// Usar construtor de cópia
Pessoa[] original = {new Pessoa("Ana", 25)};
Pessoa[] copiaP = new Pessoa[original.length];
for (int i = 0; i < original.length; i++) {
    copiaP[i] = new Pessoa(original[i]);
}
```

**Padrão 2: Método clone()**

```java
class Pessoa implements Cloneable {
    String nome;
    int idade;
    
    @Override
    protected Pessoa clone() {
        try {
            return (Pessoa) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}

// Usar clone()
Pessoa[] copiaP = new Pessoa[original.length];
for (int i = 0; i < original.length; i++) {
    copiaP[i] = original[i].clone();
}
```

**Padrão 3: Factory method**

```java
class Pessoa {
    public static Pessoa copiar(Pessoa outro) {
        return new Pessoa(outro.nome, outro.idade);
    }
}

// Usar factory
Pessoa[] copiaP = new Pessoa[original.length];
for (int i = 0; i < original.length; i++) {
    copiaP[i] = Pessoa.copiar(original[i]);
}
```

### 8️⃣ Serialização para Cópia Profunda

**Deep copy via serialização** (objetos devem ser Serializable):

```java
import java.io.*;

class Pessoa implements Serializable {
    String nome;
    int idade;
    // ...
}

public static <T> T[] deepCopy(T[] original) throws Exception {
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    ObjectOutputStream oos = new ObjectOutputStream(bos);
    oos.writeObject(original);
    
    ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
    ObjectInputStream ois = new ObjectInputStream(bis);
    return (T[]) ois.readObject();
}

// Uso
Pessoa[] original = {new Pessoa("Ana", 25)};
Pessoa[] copiaP = deepCopy(original);
```

**Vantagens**:
- Automático (não precisa implementar cópia em cada classe)
- Funciona com objetos complexos aninhados

**Desvantagens**:
- Performance (serialização é lenta)
- Classes devem ser Serializable
- Não funciona com todas as classes (ex: Thread, Socket)

### 9️⃣ Quando Usar Cada Tipo

**Use cópia superficial quando**:
- Objetos são **imutáveis** (String, Integer, etc.)
- Você **quer compartilhar** objetos entre arrays
- Performance é crítica e compartilhamento é aceitável

```java
// Strings (imutáveis) - superficial é OK
String[] nomes = {"Ana", "Bob"};
String[] copia = nomes.clone();
```

**Use cópia profunda quando**:
- Objetos são **mutáveis**
- Arrays devem ser **completamente independentes**
- Modificações não podem afetar original

```java
// Objetos mutáveis - profunda necessária
Pessoa[] pessoas = {new Pessoa("Ana", 25)};
Pessoa[] copia = new Pessoa[pessoas.length];
for (int i = 0; i < pessoas.length; i++) {
    copia[i] = new Pessoa(pessoas[i]);
}
```

### 🔟 Performance - Superficial vs Profunda

**Cópia superficial**: **O(n)** onde n = tamanho do array
```java
// Apenas copia referências
Pessoa[] copia = Arrays.copyOf(original, n);  // Rápido
```

**Cópia profunda**: **O(n × k)** onde k = custo de criar objeto
```java
// Cria n novos objetos
for (int i = 0; i < n; i++) {
    copia[i] = new Pessoa(original[i]);  // Mais lento
}
```

**Benchmark**:
```java
Pessoa[] arr = new Pessoa[100_000];

// Superficial: ~1-2ms
long inicio = System.currentTimeMillis();
Pessoa[] s = Arrays.copyOf(arr, arr.length);
long fim = System.currentTimeMillis();

// Profunda: ~50-100ms (dependendo da classe)
inicio = System.currentTimeMillis();
Pessoa[] p = new Pessoa[arr.length];
for (int i = 0; i < arr.length; i++) {
    p[i] = new Pessoa(arr[i]);
}
fim = System.currentTimeMillis();
```

## 🎯 Aplicabilidade

**1. Backup de Dados (profunda)**:
```java
Pessoa[] dados = loadDados();
Pessoa[] backup = deepCopy(dados);
// Processar dados, se erro: dados = backup
```

**2. Cache com Imutáveis (superficial OK)**:
```java
String[] cache = {"item1", "item2"};
String[] copia = cache.clone();  // Seguro - Strings imutáveis
```

**3. Evitar Modificação Externa (profunda)**:
```java
class Turma {
    private Aluno[] alunos;
    
    public Aluno[] getAlunos() {
        // Retorna cópia profunda
        Aluno[] copia = new Aluno[alunos.length];
        for (int i = 0; i < alunos.length; i++) {
            copia[i] = new Aluno(alunos[i]);
        }
        return copia;
    }
}
```

**4. Testes Unitários**:
```java
@Test
public void test() {
    Config[] original = {new Config()};
    Config[] copia = deepCopy(original);
    
    metodo(copia);  // Não afeta original
    assertEquals(valorOriginal, original[0].valor);
}
```

**5. Multithreading**:
```java
// Cada thread recebe cópia profunda independente
Thread t1 = new Thread(() -> processar(deepCopy(dados)));
Thread t2 = new Thread(() -> processar(deepCopy(dados)));
```

## ⚠️ Armadilhas Comuns

**1. Assumir que clone() é Profundo**:
```java
Pessoa[] original = {new Pessoa("Ana", 25)};
Pessoa[] copia = original.clone();

copia[0].nome = "Bob";
// ⚠️ original[0].nome também é "Bob" (superficial!)
```

**2. Esquecer de Copiar Objetos Aninhados**:
```java
class Pessoa {
    Endereco endereco;  // Objeto aninhado
}

// ❌ Cópia rasa do Pessoa, mas Endereco compartilhado
copiaP[i] = new Pessoa(original[i].endereco);
```

**3. Confiar em Métodos de Biblioteca**:
```java
// Arrays.copyOf, clone, System.arraycopy
// TODOS fazem cópia SUPERFICIAL para objetos!
```

**4. Modificar Cópia "Profunda" Superficial**:
```java
List<Pessoa> lista = new ArrayList<>(Arrays.asList(arr));
// ⚠️ ArrayList é nova, mas Pessoas são compartilhadas!
lista.get(0).nome = "X";  // Afeta array original
```

**5. Serialização com Campos Transient**:
```java
class Pessoa implements Serializable {
    transient String senha;  // Não será copiado!
}
```

## ✅ Boas Práticas

**1. Documente Tipo de Cópia**:
```java
/**
 * Retorna cópia PROFUNDA do array
 */
public Pessoa[] copiar(Pessoa[] arr) { }
```

**2. Implemente Cloneable ou Construtor de Cópia**:
```java
class Pessoa implements Cloneable {
    @Override
    public Pessoa clone() { }
    
    // Ou construtor de cópia
    public Pessoa(Pessoa outro) { }
}
```

**3. Use Imutabilidade Quando Possível**:
```java
// Torna cópia superficial segura
public final class Pessoa {
    private final String nome;
    private final int idade;
    // Sem setters
}
```

**4. Copie Objetos Aninhados Recursivamente**:
```java
class Pessoa {
    Endereco endereco;
    
    public Pessoa(Pessoa outro) {
        this.endereco = new Endereco(outro.endereco);  // Profunda
    }
}
```

**5. Prefira Bibliotecas para Deep Copy**:
```java
// Apache Commons Lang
Pessoa[] copia = SerializationUtils.clone(original);

// Ou use bibliotecas como Cloner, Kryo
```

**6. Teste Independência das Cópias**:
```java
@Test
public void testCopiaIndependente() {
    Pessoa[] original = {new Pessoa("Ana", 25)};
    Pessoa[] copia = deepCopy(original);
    
    copia[0].nome = "Bob";
    assertNotEquals(original[0].nome, copia[0].nome);
}
```

## 📚 Resumo Executivo

**Cópia superficial** copia array mas mantém **referências aos mesmos objetos**.

**Cópia profunda** cria **novo array e novas instâncias** de objetos.

**Comparação**:

| Aspecto | Superficial | Profunda |
|---------|------------|----------|
| Arrays diferentes | ✓ Sim | ✓ Sim |
| Objetos diferentes | ✗ Não (compartilhados) | ✓ Sim |
| Performance | Rápida O(n) | Lenta O(n×k) |
| Modificação independente | ✗ Não | ✓ Sim |
| Métodos | clone(), copyOf() | Manual, serialização |

**Primitivos**:
```java
int[] copia = arr.clone();  // Sempre profunda (valores)
```

**Strings** (imutáveis):
```java
String[] copia = arr.clone();  // Superficial, mas segura
```

**Objetos mutáveis**:
```java
// ❌ Superficial
Pessoa[] s = Arrays.copyOf(arr, n);

// ✓ Profunda
Pessoa[] p = new Pessoa[n];
for (int i = 0; i < n; i++) {
    p[i] = new Pessoa(arr[i]);
}
```

**Regra de ouro**: objetos **mutáveis** geralmente precisam de cópia **profunda** para independência completa.
