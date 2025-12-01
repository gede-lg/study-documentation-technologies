# Ambiguidade com Sobrecarga e Varargs

## 🎯 Introdução e Definição

**Ambiguidade com sobrecarga** ocorre quando o compilador Java **não consegue decidir** qual versão sobrecarregada de um método chamar devido a múltiplas correspondências possíveis com varargs.

**Conceito central**: varargs aceita **zero ou mais** argumentos, o que pode criar **sobreposição** com assinaturas de métodos sobrecarregados.

**Exemplo do problema**:
```java
void processar(int... nums) {
    System.out.println("Varargs");
}

void processar(int n, int... nums) {
    System.out.println("Fixo + Varargs");
}

processar(10);  // ❌ ERRO DE COMPILAÇÃO - ambíguo!
```

**Mensagem de erro**:
```
error: reference to processar is ambiguous
both method processar(int...) and method processar(int,int...) match
```

**Por quê?** Chamada `processar(10)` corresponde a **ambos** métodos:
- `processar(int... nums)` com `nums = {10}`
- `processar(int n, int... nums)` com `n = 10, nums = {}`

## 📋 Fundamentos Teóricos

### 1️⃣ Varargs vs Parâmetro Fixo + Varargs

**Conflito clássico**:

```java
public class Ambiguidade {
    
    void metodo(int... numeros) {
        System.out.println("Apenas varargs: " + Arrays.toString(numeros));
    }
    
    void metodo(int primeiro, int... resto) {
        System.out.println("Fixo + varargs: primeiro=" + primeiro + 
                          ", resto=" + Arrays.toString(resto));
    }
}

// Testes
Ambiguidade obj = new Ambiguidade();

obj.metodo();           // ✓ OK - apenas varargs (array vazio)
obj.metodo(10, 20, 30); // ✓ OK - fixo + varargs é mais específico
obj.metodo(10);         // ❌ ERRO - ambíguo!
```

**Análise da ambiguidade**:
```java
obj.metodo(10);

// Opção 1: metodo(int... numeros)
// numeros = {10}

// Opção 2: metodo(int primeiro, int... resto)
// primeiro = 10, resto = {}

// Ambas são válidas! Compilador não sabe qual escolher.
```

### 2️⃣ Varargs de Tipos Diferentes

**Tipos não relacionados** - sem ambiguidade:

```java
void processar(int... numeros) {
    System.out.println("Inteiros");
}

void processar(String... palavras) {
    System.out.println("Strings");
}

// ✓ Sem ambiguidade - tipos diferentes
processar(1, 2, 3);        // Inteiros
processar("A", "B", "C");  // Strings
processar();               // ❌ AMBÍGUO - qual chamar?
```

**Chamada vazia é ambígua**:
```java
processar();  // Erro: ambiguous

// Pode ser qualquer um:
// processar(int... numeros) com numeros = {}
// processar(String... palavras) com palavras = {}
```

**Solução - cast ou array explícito**:
```java
processar((int[]) new int[0]);     // Chama versão int
processar((String[]) new String[0]); // Chama versão String

// Ou
processar(new int[]{});
processar(new String[]{});
```

### 3️⃣ Hierarquia de Tipos e Varargs

**Tipos relacionados** (herança):

```java
class Animal { }
class Cachorro extends Animal { }

void processar(Animal... animais) {
    System.out.println("Animal varargs");
}

void processar(Cachorro... cachorros) {
    System.out.println("Cachorro varargs");
}

// Uso
processar(new Animal(), new Animal());        // Animal varargs
processar(new Cachorro(), new Cachorro());    // Cachorro varargs
processar(new Animal(), new Cachorro());      // Animal varargs (tipo comum)

// Ambíguo com arrays vazios
processar();  // ❌ ERRO - ambíguo
```

**Regra**: compilador escolhe **mais específico**, mas se ambos igualmente específicos = ambiguidade.

### 4️⃣ Array vs Varargs

**Array explícito** e **varargs**:

```java
void metodo(int[] array) {
    System.out.println("Array: " + Arrays.toString(array));
}

void metodo(int... varargs) {
    System.out.println("Varargs: " + Arrays.toString(varargs));
}

// ❌ ERRO - métodos com mesma assinatura!
```

**Razão**: após compilação, **ambos são idênticos**:
```java
// Antes da compilação
void metodo(int[] array)
void metodo(int... varargs)

// Após compilação (bytecode)
void metodo(int[] array)
void metodo(int[] array)  // Duplicata!

// Erro: duplicate method
```

**Não é ambiguidade, é DUPLICATA** - nem compila a classe.

### 5️⃣ Múltiplos Parâmetros Fixos + Varargs

**Diferentes quantidades de fixos**:

```java
void metodo(int a, int... resto) {
    System.out.println("1 fixo");
}

void metodo(int a, int b, int... resto) {
    System.out.println("2 fixos");
}

void metodo(int a, int b, int c, int... resto) {
    System.out.println("3 fixos");
}

// Uso
metodo(10);                // ✓ 1 fixo (resto vazio)
metodo(10, 20);            // ✓ 2 fixos (resto vazio)
metodo(10, 20, 30);        // ✓ 3 fixos (resto vazio)
metodo(10, 20, 30, 40);    // ✓ 3 fixos (resto = {40})
metodo(10, 20, 30, 40, 50); // ✓ 3 fixos (resto = {40, 50})
```

**Sem ambiguidade** - compilador escolhe versão com **mais parâmetros fixos correspondentes**.

### 6️⃣ Sobrecarga com Primitivos e Wrappers

**Autoboxing pode causar confusão**:

```java
void processar(int... nums) {
    System.out.println("int varargs");
}

void processar(Integer... nums) {
    System.out.println("Integer varargs");
}

// Uso
processar(1, 2, 3);              // int varargs (primitivos)
processar(new Integer(1), new Integer(2)); // Integer varargs

// Misturado
processar(1, Integer.valueOf(2)); // ❌ ERRO - tipo inconsistente
```

**Array vazio**:
```java
processar();  // ❌ AMBÍGUO
processar(new int[]{});      // int varargs
processar(new Integer[]{});  // Integer varargs
```

### 7️⃣ Sobrecarga com Object

**Object é supertipo de tudo**:

```java
void processar(String... palavras) {
    System.out.println("String varargs");
}

void processar(Object... objetos) {
    System.out.println("Object varargs");
}

// Uso
processar("A", "B");           // String varargs (mais específico)
processar(new Object(), "A");  // Object varargs
processar();                   // ❌ AMBÍGUO
```

**String é mais específico** que Object - compilador prefere.

### 8️⃣ Combinação de Parâmetros Fixos

**Fixos de tipos diferentes**:

```java
void metodo(String s, int... nums) {
    System.out.println("String + int varargs");
}

void metodo(int n, String... palavras) {
    System.out.println("int + String varargs");
}

// Uso
metodo("texto", 1, 2, 3);      // String + int varargs
metodo(10, "A", "B", "C");     // int + String varargs

// Sem ambiguidade - primeiro parâmetro determina
```

### 9️⃣ Generics e Varargs

**Tipos genéricos** com varargs:

```java
<T> void metodo(T... elementos) {
    System.out.println("Generic varargs");
}

void metodo(String... palavras) {
    System.out.println("String varargs");
}

// Uso
metodo("A", "B");        // String varargs (mais específico)
metodo(1, 2, 3);         // Generic varargs (inferência T=Integer)
metodo();                // ❌ AMBÍGUO
```

**Específico vence genérico**.

### 🔟 Arrays Multidimensionais

**Varargs de arrays**:

```java
void processar(int[]... matrizes) {
    System.out.println("Varargs de arrays");
}

void processar(int[][] matriz) {
    System.out.println("Array 2D");
}

// ❌ ERRO - mesma assinatura após compilação
// Ambos viram int[][]
```

**Equivalência**:
```java
// Antes
void metodo(int[]... arrays)  → void metodo(int[][] arrays)
void metodo(int[][] arrays)   → void metodo(int[][] arrays)

// Duplicata!
```

## 🎯 Aplicabilidade

**1. Evitar Sobrecarga com Varargs**:
```java
// ❌ Evite
void processar(int... nums) { }
void processar(int n, int... nums) { }

// ✓ Prefira nomes diferentes
void processar(int... nums) { }
void processarComPrimeiro(int primeiro, int... resto) { }
```

**2. Usar Tipos Específicos**:
```java
// ✓ Sem ambiguidade
void processar(String... palavras) { }
void processar(int... numeros) { }
```

**3. Documentar Chamadas Vazias**:
```java
/**
 * Para chamada vazia, use cast: processar((int[]) new int[0])
 */
void processar(int... nums) { }
void processar(String... palavras) { }
```

**4. Preferir Mais Específico**:
```java
// ✓ Compilador escolhe mais específico
void processar(Object... objetos) { }
void processar(String... palavras) { }

processar("A", "B");  // Chama String (mais específico)
```

**5. Combinar com Tipos Fixos Diferentes**:
```java
// ✓ Sem ambiguidade - primeiro parâmetro diferencia
void log(String nivel, String... mensagens) { }
void log(int codigo, String... detalhes) { }
```

## ⚠️ Armadilhas Comuns

**1. Varargs vs Fixo + Varargs**:
```java
void metodo(int... nums) { }
void metodo(int n, int... nums) { }

metodo(10);  // ❌ Ambíguo
```

**2. Tipos Diferentes com Chamada Vazia**:
```java
void metodo(int... nums) { }
void metodo(String... palavras) { }

metodo();  // ❌ Ambíguo
```

**3. Array vs Varargs**:
```java
void metodo(int[] arr) { }
void metodo(int... varargs) { }
// ❌ Duplicata - não compila
```

**4. Assumir Que Compilador Escolhe**:
```java
// Compilador NÃO adivinha intenção
void metodo(int... nums) { }
void metodo(int n, int... nums) { }

metodo(10);  // ❌ Erro, não escolhe "melhor"
```

**5. Esquecer Cast em Chamada Vazia**:
```java
void metodo(int... nums) { }
void metodo(String... palavras) { }

metodo();  // ❌ Ambíguo
metodo((int[]) new int[0]);  // ✓ OK
```

## ✅ Boas Práticas

**1. Evite Sobrecarga Ambígua**:
```java
// ❌ Problemático
void processar(int... nums) { }
void processar(int n, int... nums) { }

// ✓ Use nomes diferentes
void processar(int... nums) { }
void processarComMinimo(int primeiro, int... resto) { }
```

**2. Use Tipos Não Relacionados**:
```java
// ✓ Sem problema
void processar(int... nums) { }
void processar(String... palavras) { }
void processar(boolean... flags) { }
```

**3. Documente Ambiguidades**:
```java
/**
 * ATENÇÃO: Para chamada vazia com tipos múltiplos,
 * use cast explícito: metodo((int[]) new int[0])
 */
```

**4. Prefira Parâmetro Fixo para Mínimo**:
```java
// ✓ Sem ambiguidade, garante mínimo
int max(int primeiro, int... resto) {
    // primeiro obrigatório
}
```

**5. Teste Todas as Chamadas**:
```java
// Testar edge cases
metodo();              // Vazio
metodo(1);             // Um argumento
metodo(1, 2);          // Dois argumentos
metodo(1, 2, 3);       // Múltiplos
```

**6. Use @Deprecated em Versão Ambígua**:
```java
@Deprecated
void metodo(int... nums) {
    // Versão antiga, use metodoNovo
}

void metodoNovo(int primeiro, int... resto) {
    // Versão preferida
}
```

## 📚 Resumo Executivo

**Ambiguidade com sobrecarga** ocorre quando compilador não consegue decidir qual método chamar.

**Casos comuns de ambiguidade**:

**1. Varargs vs Fixo + Varargs**:
```java
void metodo(int... nums) { }
void metodo(int n, int... nums) { }

metodo(10);  // ❌ AMBÍGUO
```

**2. Tipos diferentes com chamada vazia**:
```java
void metodo(int... nums) { }
void metodo(String... palavras) { }

metodo();  // ❌ AMBÍGUO
```

**3. Array vs Varargs**:
```java
void metodo(int[] arr) { }
void metodo(int... varargs) { }
// ❌ DUPLICATA - mesma assinatura
```

**Soluções**:

**Nomes diferentes**:
```java
void processar(int... nums) { }
void processarComPrimeiro(int primeiro, int... resto) { }
```

**Cast em chamada vazia**:
```java
metodo((int[]) new int[0]);     // Específico int
metodo((String[]) new String[0]); // Específico String
```

**Parâmetro fixo garante mínimo**:
```java
// Evita ambiguidade e garante pelo menos 1
int max(int primeiro, int... resto) { }
```

**Tipos não relacionados**:
```java
// Sem ambiguidade - tipos diferentes
void processar(int... nums) { }
void processar(String... palavras) { }

processar(1, 2);    // int
processar("A", "B"); // String
```

**Regras do compilador**:
- Escolhe **mais específico** quando possível
- **Erro** se múltiplas correspondências igualmente específicas
- **Duplicata** se assinatura idêntica após compilação

**Evite**: sobrecarga que cria ambiguidade com varargs, especialmente `metodo(T...)` e `metodo(T, T...)`.
