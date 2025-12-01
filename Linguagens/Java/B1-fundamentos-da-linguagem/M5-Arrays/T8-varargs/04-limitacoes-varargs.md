# Limitações de Varargs

## 🎯 Introdução e Definição

**Varargs tem restrições específicas** que impedem certos padrões de uso, garantindo que o compilador possa identificar inequivocamente quais argumentos pertencem ao varargs.

**Conceito central**: regras de **posição** e **quantidade** de varargs em assinatura de método.

**Duas limitações fundamentais**:

1. **Apenas um varargs por método**
2. **Varargs deve ser o último parâmetro**

**Por quê?** Compilador precisa saber **onde termina** a lista de argumentos variáveis.

## 📋 Fundamentos Teóricos

### 1️⃣ Apenas Um Varargs Por Método

**Regra**: método pode ter **no máximo um** parâmetro varargs.

**❌ Inválido - múltiplos varargs**:
```java
// ERRO DE COMPILAÇÃO
public void metodo(int... numeros, String... palavras) {
    // Impossível determinar onde termina int... e começa String...
}
```

**Mensagem de erro**:
```
error: varargs parameter must be the last parameter
```

**Por que não funciona?**
```java
// Como interpretar esta chamada?
metodo(1, 2, 3, "A", "B");

// Opção 1: numeros = {1, 2, 3}, palavras = {"A", "B"}
// Opção 2: numeros = {1, 2}, palavras = {3, "A", "B"}  (erro de tipo)
// Opção 3: numeros = {1}, palavras = {2, 3, "A", "B"}  (erro de tipo)

// Ambíguo! Compilador não consegue decidir
```

**✓ Válido - um varargs**:
```java
public void metodo(int... numeros) {
    // OK
}

public void metodo(String... palavras) {
    // OK
}
```

### 2️⃣ Varargs Deve Ser Último Parâmetro

**Regra**: varargs **sempre** deve ser o **último** parâmetro da assinatura.

**❌ Inválido - varargs no meio**:
```java
// ERRO DE COMPILAÇÃO
public void metodo(int... numeros, String nome) {
    // Impossível determinar onde termina int...
}
```

**❌ Inválido - varargs no início**:
```java
// ERRO DE COMPILAÇÃO
public void metodo(String... palavras, int x, int y) {
    // Impossível determinar quantas palavras foram passadas
}
```

**✓ Válido - varargs por último**:
```java
public void metodo(String nome, int idade, String... telefones) {
    // OK - claro onde começa varargs
}

public void metodo(int x, int y, int... resto) {
    // OK - x e y fixos, resto variável
}
```

**Por que precisa ser último?**
```java
// ❌ Se varargs não fosse último:
void metodo(int... nums, String nome)

metodo(1, 2, 3, "João");
// Ambíguo:
// nums = {1, 2, 3}, nome = "João"  ✓
// nums = {1, 2}, nome = "3"  ✗ (erro de tipo)
// nums = {1}, nome = "2"  ✗ (erro de tipo)

// Compilador não consegue decidir onde varargs termina!
```

### 3️⃣ Combinação com Parâmetros Fixos

**Parâmetros fixos ANTES de varargs**:

```java
// ✓ Correto
public void log(String nivel, String fonte, String... mensagens) {
    System.out.print("[" + nivel + "] " + fonte + ": ");
    for (String msg : mensagens) {
        System.out.print(msg + " ");
    }
    System.out.println();
}

// Chamadas válidas
log("INFO", "App", "Sistema", "iniciado");
log("ERROR", "DB", "Conexão", "falhou", "timeout");
log("DEBUG", "Cache");  // Sem mensagens variáveis
```

**Ordem fixa**:
```java
// ✓ Parâmetros fixos → Varargs
void metodo1(int x, String... palavras)

void metodo2(String nome, int idade, double altura, String... telefones)

// ❌ Varargs → Parâmetros fixos
void metodo3(String... palavras, int x)  // ERRO
```

### 4️⃣ Sem Varargs Múltiplos - Workaround

**Problema**: precisa de dois conjuntos variáveis?

**❌ Não funciona**:
```java
void processar(int... numeros, String... palavras) {
    // ERRO DE COMPILAÇÃO
}
```

**✓ Solução 1 - Arrays explícitos**:
```java
public void processar(int[] numeros, String[] palavras) {
    // Funciona, mas perde conveniência
}

processar(new int[]{1, 2, 3}, new String[]{"A", "B"});
```

**✓ Solução 2 - Varargs + array**:
```java
public void processar(int[] numeros, String... palavras) {
    // Primeiro é array, segundo é varargs
}

processar(new int[]{1, 2, 3}, "A", "B", "C");
```

**✓ Solução 3 - Classe wrapper**:
```java
class Dados {
    int[] numeros;
    String[] palavras;
    
    Dados(int[] numeros, String[] palavras) {
        this.numeros = numeros;
        this.palavras = palavras;
    }
}

public void processar(Dados... conjuntos) {
    for (Dados d : conjuntos) {
        // Processar cada conjunto
    }
}

processar(
    new Dados(new int[]{1, 2}, new String[]{"A", "B"}),
    new Dados(new int[]{3, 4}, new String[]{"C", "D"})
);
```

**✓ Solução 4 - Métodos separados**:
```java
public void processarNumeros(int... numeros) { }
public void processarPalavras(String... palavras) { }

// Chamadas separadas
processarNumeros(1, 2, 3);
processarPalavras("A", "B", "C");
```

### 5️⃣ Mínimo de Argumentos

**Varargs aceita zero argumentos** - problema se precisa de mínimo:

**❌ Não garante mínimo**:
```java
public int max(int... numeros) {
    if (numeros.length == 0) {
        throw new IllegalArgumentException("Precisa de pelo menos 1");
    }
    // Precisa validar em runtime
}

max();  // Compila mas lança exceção
```

**✓ Garantir pelo menos um**:
```java
public int max(int primeiro, int... resto) {
    int max = primeiro;  // Garante pelo menos 1
    for (int n : resto) {
        if (n > max) max = n;
    }
    return max;
}

max();      // ❌ Erro de compilação
max(10);    // ✓ OK
max(10, 20, 30);  // ✓ OK
```

**Garantir dois ou mais**:
```java
// Pelo menos 2
public int somar(int a, int b, int... resto) {
    int soma = a + b;
    for (int n : resto) soma += n;
    return soma;
}

// Pelo menos 3
public double media(int a, int b, int c, int... resto) {
    int soma = a + b + c;
    int count = 3;
    for (int n : resto) {
        soma += n;
        count++;
    }
    return (double) soma / count;
}
```

### 6️⃣ Não Pode Ser Modificador

**Varargs NÃO é modificador de acesso**:

```java
// ✓ Correto - modificadores normais
public void metodo(String... args)
private void metodo(int... nums)
protected void metodo(Object... objs)
static void metodo(double... valores)

// ❌ varargs não é modificador
varargs void metodo(String args)  // ERRO
```

**Posição na assinatura**:
```java
// Formato correto
[modificadores] tipoRetorno nomeMetodo([params fixos,] Tipo... varargs)

// Exemplos
public static void metodo(int... nums)
private List<String> metodo(String nome, String... args)
protected final int metodo(Object obj, int... indices)
```

### 7️⃣ Arrays Multidimensionais Como Varargs

**Varargs com arrays**:

```java
// ✓ Válido - varargs de arrays
public void processar(int[]... matrizes) {
    for (int[] array : matrizes) {
        System.out.println(Arrays.toString(array));
    }
}

processar(
    new int[]{1, 2, 3},
    new int[]{4, 5, 6},
    new int[]{7, 8, 9}
);
```

**Equivalente a**:
```java
public void processar(int[][] matrizes) {
    // Mesmo comportamento
}
```

**Atenção com sintaxe**:
```java
// ✓ Correto
void metodo(int[]... arrays)     // Varargs de int[]
void metodo(String[]... arrays)  // Varargs de String[]

// ❌ Incorreto
void metodo(int...[] arrays)     // ERRO DE SINTAXE
```

### 8️⃣ Generics e Varargs

**Varargs com tipos genéricos** - gera avisos:

```java
// Aviso: unchecked generic array creation
public static <T> void metodo(T... elementos) {
    // Heap pollution possível
}
```

**@SafeVarargs** para suprimir aviso:
```java
@SafeVarargs
public static <T> List<T> criarLista(T... elementos) {
    return Arrays.asList(elementos);
}
```

**Quando usar @SafeVarargs**:
- Método é `final` ou `static`
- Não armazena referência do varargs em variável de tipo array genérico
- Não retorna array varargs
- Não expõe array varargs para código não confiável

**❌ Uso inseguro**:
```java
// NÃO use @SafeVarargs aqui
public static <T> T[] arrayPerigoso(T... elementos) {
    return elementos;  // Retorna array - perigoso!
}
```

### 9️⃣ Sobrecarga com Varargs

**Permitido mas pode ser ambíguo**:

```java
// ✓ Tecnicamente válido
void processar(int... nums) {
    System.out.println("int varargs");
}

void processar(String... palavras) {
    System.out.println("String varargs");
}

// Funciona - tipos diferentes
processar(1, 2, 3);        // int varargs
processar("A", "B", "C");  // String varargs
```

**❌ Ambíguo com parâmetro fixo**:
```java
void metodo(int... nums) { }
void metodo(int n, int... nums) { }

metodo(10);  // ❌ AMBÍGUO - qual chamar?
```

**Mensagem de erro**:
```
error: reference to metodo is ambiguous
both method metodo(int...) and method metodo(int,int...) match
```

### 🔟 Construtores com Varargs

**Mesmas limitações** aplicam-se a construtores:

```java
class Equipe {
    // ✓ Correto
    public Equipe(String nome, String... membros) {
        // OK
    }
    
    // ❌ Incorreto - varargs não é último
    public Equipe(String... membros, String nome) {
        // ERRO
    }
    
    // ❌ Incorreto - múltiplos varargs
    public Equipe(String... nomes, int... idades) {
        // ERRO
    }
}
```

## 🎯 Aplicabilidade

**1. Combinação com Parâmetros Obrigatórios**:
```java
public void cadastrar(String nome, int idade, String... telefones) {
    // nome e idade obrigatórios, telefones opcionais
}
```

**2. Garantir Mínimo com Parâmetro Fixo**:
```java
public int max(int primeiro, int... resto) {
    // Garante pelo menos 1 argumento
}
```

**3. Métodos Utilitários Flexíveis**:
```java
public static String formatar(String template, Object... args) {
    return String.format(template, args);
}
```

**4. Varargs de Arrays**:
```java
public void processarMatrizes(int[]... matrizes) {
    for (int[] matriz : matrizes) {
        // Processar cada matriz
    }
}
```

**5. Factory Methods Genéricos**:
```java
@SafeVarargs
public static <T> List<T> lista(T... elementos) {
    return Arrays.asList(elementos);
}
```

## ⚠️ Armadilhas Comuns

**1. Tentar Múltiplos Varargs**:
```java
// ❌ ERRO
void metodo(int... nums, String... palavras) { }
```

**2. Varargs Não Por Último**:
```java
// ❌ ERRO
void metodo(String... palavras, int x) { }
```

**3. Ambiguidade com Sobrecarga**:
```java
void processar(int... nums) { }
void processar(int n, int... nums) { }

processar(10);  // ❌ Ambíguo
```

**4. Assumir Que Varargs Garante Argumentos**:
```java
public int primeiro(int... nums) {
    return nums[0];  // ❌ Pode lançar exceção
}

primeiro();  // ArrayIndexOutOfBoundsException
```

**5. Generics Sem @SafeVarargs**:
```java
// ⚠️ Aviso de compilação
public static <T> void metodo(T... elementos) {
    // Unchecked warning
}
```

## ✅ Boas Práticas

**1. Sempre Coloque Varargs Por Último**:
```java
// ✓ Correto
void metodo(int x, String y, Object... resto)
```

**2. Use Parâmetro Fixo para Mínimo**:
```java
// ✓ Garante pelo menos 1
int max(int primeiro, int... resto)

// vs validação runtime
int max(int... todos) {
    if (todos.length == 0) throw new IllegalArgumentException();
}
```

**3. Use @SafeVarargs com Generics**:
```java
@SafeVarargs
public static <T> List<T> lista(T... elementos) {
    return Arrays.asList(elementos);
}
```

**4. Evite Sobrecarga Ambígua**:
```java
// ❌ Evite
void metodo(int... nums)
void metodo(int n, int... nums)

// ✓ Prefira
void metodo(int... nums)
void metodoComPrimeiro(int primeiro, int... resto)
```

**5. Documente Limitações**:
```java
/**
 * Processa números. Aceita zero ou mais argumentos.
 * @param numeros números a processar (pode ser vazio)
 */
public void processar(int... numeros) {
    if (numeros.length == 0) {
        // Tratar caso vazio
    }
}
```

**6. Use Arrays Explícitos Se Precisa de Múltiplos Varargs**:
```java
// Ao invés de tentar múltiplos varargs
void processar(int[] numeros, String[] palavras) {
    // Funciona, documenta intenção claramente
}
```

## 📚 Resumo Executivo

**Limitações de varargs**:

**1. Apenas um varargs por método**:
```java
// ❌ Inválido
void metodo(int... nums, String... palavras)

// ✓ Válido
void metodo(int... nums)
```

**2. Varargs deve ser último parâmetro**:
```java
// ❌ Inválido
void metodo(int... nums, String nome)

// ✓ Válido
void metodo(String nome, int... nums)
```

**Combinação com parâmetros fixos**:
```java
// ✓ Parâmetros fixos ANTES de varargs
void metodo(String nome, int idade, String... telefones)
```

**Garantir mínimo de argumentos**:
```java
// ✓ Pelo menos 1
int max(int primeiro, int... resto)

// ✓ Pelo menos 2
int somar(int a, int b, int... resto)
```

**Workaround para múltiplos conjuntos**:
```java
// Arrays explícitos
void processar(int[] nums, String[] palavras)

// Varargs + array
void processar(int[] nums, String... palavras)
```

**Generics**:
```java
@SafeVarargs  // Suprimir avisos
public static <T> List<T> lista(T... elementos) {
    return Arrays.asList(elementos);
}
```

**Regras simples**:
- ✓ **Um** varargs por método
- ✓ Sempre por **último**
- ✓ Parâmetros fixos **antes**
- ✓ Use @SafeVarargs com generics

**Compilador força essas regras** - erros são detectados em tempo de compilação.
