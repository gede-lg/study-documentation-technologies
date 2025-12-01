# Arrays Anônimos

## 🎯 Introdução e Definição

**Arrays anônimos** são arrays criados **sem associação a uma variável nomeada**, usando a sintaxe `new tipo[]{valores}`. São úteis para **passar valores diretamente** a métodos, **retornar de funções** ou **atribuir a variáveis** após a declaração.

**Conceito central**: criar array "on-the-fly" sem necessidade de declarar variável separadamente.

**Sintaxe fundamental**:
```java
new tipo[]{valor1, valor2, valor3, ...}
```

**Exemplo básico**:
```java
// Array anônimo passado diretamente para método
calcularSoma(new int[]{1, 2, 3, 4, 5});

// vs. forma tradicional (com variável intermediária)
int[] numeros = {1, 2, 3, 4, 5};
calcularSoma(numeros);
```

Arrays anônimos são essenciais quando se precisa de array **temporário** sem poluir o escopo com variáveis extras.

## 📋 Fundamentos Teóricos

### 1️⃣ Sintaxe Básica - new tipo[]{valores}

Sintaxe requer **`new tipo[]`** seguido de **valores entre chaves**:

```java
// Primitivos
new int[]{1, 2, 3}
new double[]{1.5, 2.7, 3.9}
new boolean[]{true, false}
new char[]{'a', 'b', 'c'}

// Objetos
new String[]{"Ana", "Bob", "Carlos"}
new Integer[]{10, 20, 30}
new Pessoa[]{new Pessoa("Ana"), new Pessoa("Bob")}
```

**Estrutura**:
- `new`: operador de criação
- `tipo[]`: tipo do array (com colchetes)
- `{valores}`: inicialização inline (SEM tamanho)

### 2️⃣ Passagem Direta para Métodos - Uso Principal

Uso mais comum: **argumentos de métodos** sem variável intermediária:

```java
// Método que recebe array
public void processar(String[] itens) {
    for (String item : itens) {
        System.out.println(item);
    }
}

// ✅ Com array anônimo (conciso)
processar(new String[]{"Ana", "Bob", "Carlos"});

// vs. ❌ Forma tradicional (verbosa)
String[] nomes = {"Ana", "Bob", "Carlos"};
processar(nomes);  // Variável usada apenas uma vez
```

**Vantagem**: elimina variáveis temporárias que "poluem" o código.

### 3️⃣ Retorno de Métodos - Arrays Temporários

Arrays anônimos ideais para **retornar valores** de métodos:

```java
public String[] getDadosPessoa() {
    // ✅ Retorna array anônimo
    return new String[]{"Ana Silva", "ana@email.com", "123456789"};
}

public int[] getFibonacci(int n) {
    if (n <= 0) return new int[]{};  // Array vazio
    if (n == 1) return new int[]{0};
    if (n == 2) return new int[]{0, 1};
    // ...
}

// Uso direto
String nome = getDadosPessoa()[0];  // "Ana Silva"
```

### 4️⃣ Atribuição Após Declaração - Separar Declaração de Inicialização

Arrays anônimos permitem **atribuir após declaração**:

```java
int[] numeros;

// Inicialização condicional
if (condicao) {
    numeros = new int[]{1, 2, 3};
} else {
    numeros = new int[]{10, 20, 30, 40};
}

// Atribuição posterior
String[] nomes;
// ... código ...
nomes = new String[]{"Ana", "Bob"};
```

**Comparação**:
```java
// ❌ ERRO: inicialização inline só na declaração
int[] arr;
arr = {1, 2, 3};  // ERRO DE COMPILAÇÃO!

// ✅ OK: array anônimo funciona
int[] arr;
arr = new int[]{1, 2, 3};
```

### 5️⃣ Arrays Multidimensionais - Estruturas Nested

Arrays anônimos suportam **multidimensionalidade**:

```java
// Matriz 2D anônima
processar(new int[][]{
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
});

// Jagged array (linhas de tamanhos diferentes)
return new int[][]{
    {1, 2},
    {3, 4, 5, 6},
    {7}
};

// 3D
new int[][][]{
    {{1, 2}, {3, 4}},
    {{5, 6}, {7, 8}}
}
```

### 6️⃣ Proibição de Tamanho Explícito - Apenas Valores

**Não é permitido** especificar tamanho com valores:

```java
// ❌ ERRO: tamanho redundante
new int[3]{1, 2, 3};  // ERRO DE COMPILAÇÃO!

// ✅ OK: tamanho inferido dos valores
new int[]{1, 2, 3};  // Tamanho 3 (automático)

// ✅ OK: tamanho sem valores (array vazio de tamanho fixo)
new int[5];  // [0, 0, 0, 0, 0]
```

**Regra**: ou fornece **valores** (tamanho automático) ou **tamanho** (valores padrão), nunca ambos.

### 7️⃣ Arrays Vazios - Tamanho Zero

Arrays anônimos podem ser **vazios**:

```java
// Array vazio (length = 0)
return new String[]{};

// Uso em métodos
processar(new int[]{});  // Array vazio

// Evitar null
public String[] buscar(String filtro) {
    if (nenhumResultado) {
        return new String[]{};  // Melhor que null
    }
    // ...
}
```

**Vantagem sobre `null`**: evita `NullPointerException`, permite usar `.length` diretamente.

### 8️⃣ Expressões nos Valores - Dinâmicos

Valores podem ser **expressões** avaliadas em runtime:

```java
int x = 10;
processar(new int[]{x, x * 2, x * 3});  // [10, 20, 30]

// Chamadas de método
return new double[]{
    calcular(5),
    calcular(10),
    Math.sqrt(16)
};

// Objetos complexos
enviar(new Pessoa[]{
    buscarPessoa(1),
    buscarPessoa(2),
    new Pessoa("Nova")
});
```

### 9️⃣ Varargs vs Arrays Anônimos - Comparação

**Varargs** simplifica chamada de métodos que aceitam número variável de argumentos:

```java
// Método com varargs
public void processar(String... itens) {
    // itens é String[]
}

// Chamadas equivalentes
processar("Ana", "Bob", "Carlos");  // ✅ Varargs (mais conciso)
processar(new String[]{"Ana", "Bob", "Carlos"});  // ✅ Array anônimo

// Varargs permite passar array diretamente
String[] nomes = {"Ana", "Bob"};
processar(nomes);  // OK

// Varargs permite zero argumentos
processar();  // OK (array vazio)
```

**Quando usar cada um**:
- **Varargs** (`String...`): método aceita número variável de args
- **Arrays anônimos**: passagem explícita de array, retorno de métodos, atribuições

### 🔟 Atribuição Polimórfica - Covariância

Arrays anônimos respeitam **covariância** (hierarquia de tipos):

```java
// Array de String pode ser atribuído a Object[]
Object[] objetos = new String[]{"Ana", "Bob"};

// Polimorfismo
Animal[] animais = new Cachorro[]{
    new Cachorro("Rex"),
    new Cachorro("Bidu")
};

// ⚠️ Porém, runtime verifica tipo
objetos[0] = 123;  // ❌ ArrayStoreException (objetos é String[])
```

## 🎯 Aplicabilidade

**1. Passagem de Dados para Métodos**:
```java
calcularMedia(new double[]{7.5, 8.0, 6.5, 9.0});
enviarEmail(new String[]{"user1@mail.com", "user2@mail.com"});
```

**2. Retorno de Múltiplos Valores**:
```java
public int[] getEstatisticas() {
    return new int[]{min, max, media, total};
}
```

**3. Inicialização Condicional**:
```java
int[] valores = condicao 
    ? new int[]{1, 2, 3}
    : new int[]{10, 20};
```

**4. Testes Unitários**:
```java
@Test
public void testProcessar() {
    assertEquals(15, somar(new int[]{1, 2, 3, 4, 5}));
}
```

**5. Configurações Dinâmicas**:
```java
configurar(new String[]{
    obterHost(),
    obterPorta(),
    obterUsuario()
});
```

**6. Substituir Múltiplos Parâmetros**:
```java
// ❌ Muitos parâmetros
public void criar(String nome, String email, String telefone, String endereco) { }

// ✅ Array (mais flexível)
public void criar(String[] dados) { }
criar(new String[]{"Ana", "ana@mail.com", "123", "Rua X"});
```

## ⚠️ Armadilhas Comuns

**1. Especificar Tamanho com Valores**:
```java
new int[3]{1, 2, 3};  // ❌ ERRO: tamanho redundante
new int[]{1, 2, 3};   // ✅ OK
```

**2. Usar Sintaxe Inline Sem new**:
```java
processar({1, 2, 3});  // ❌ ERRO!
processar(new int[]{1, 2, 3});  // ✅ OK
```

**3. Esquecer Tipo do Array**:
```java
new []{1, 2, 3};  // ❌ ERRO: tipo obrigatório
new int[]{1, 2, 3};  // ✅ OK
```

**4. Confundir com Varargs**:
```java
void metodo(int... nums) { }

// Chamadas válidas
metodo(1, 2, 3);  // Varargs
metodo(new int[]{1, 2, 3});  // Array anônimo

// Não confundir as sintaxes
void metodo(int[] nums) { }  // Não é varargs!
metodo(1, 2, 3);  // ❌ ERRO
metodo(new int[]{1, 2, 3});  // ✅ OK
```

**5. ArrayStoreException em Polimorfismo**:
```java
Object[] objs = new String[]{"Ana"};
objs[0] = 123;  // ❌ Runtime: ArrayStoreException
```

## ✅ Boas Práticas

**1. Use para Argumentos Temporários**:
```java
// ✅ Conciso
processar(new String[]{"a", "b", "c"});

// ❌ Verboso (variável desnecessária)
String[] temp = {"a", "b", "c"};
processar(temp);
```

**2. Prefira Varargs Quando Aplicável**:
```java
// Se controla o método, use varargs
public void processar(String... itens) { }

// Chamada mais limpa
processar("a", "b", "c");  // Sem new String[]
```

**3. Arrays Vazios em vez de null**:
```java
public String[] buscar() {
    return semResultados ? new String[]{} : resultados;
}
```

**4. Formatação Multi-linha para Legibilidade**:
```java
return new Pessoa[]{
    new Pessoa("Ana", 25),
    new Pessoa("Bob", 30),
    new Pessoa("Carlos", 35)
};
```

**5. Evite Arrays Grandes Inline**:
```java
// ❌ Difícil de ler
processar(new int[]{1, 2, 3, 4, ..., 100});

// ✅ Use variável ou Stream
int[] valores = IntStream.rangeClosed(1, 100).toArray();
processar(valores);
```

**6. Tipo Explícito para Clareza**:
```java
// ✅ Tipo claro
processar(new String[]{"Ana", "Bob"});

// ⚠️ Pode ser ambíguo com sobrecarga
processar(new Object[]{"Ana", "Bob"});  // Object[] ou String[]?
```

**7. Combine com Ternário para Condicional**:
```java
int[] valores = condicao
    ? new int[]{1, 2, 3}
    : new int[]{10, 20};
```

## 📚 Resumo Executivo

Arrays anônimos são criados **sem variável** usando `new tipo[]{valores}`. Ideais para **passar diretamente** a métodos, **retornar** de funções ou **atribuir** após declaração.

**Sintaxe**:
```java
new tipo[]{valor1, valor2, valor3}
```

**Usos principais**:
1. **Métodos**: `processar(new int[]{1, 2, 3})`
2. **Retorno**: `return new String[]{"a", "b"}`
3. **Atribuição**: `arr = new int[]{10, 20}`

**Restrições**:
- ❌ Não especificar tamanho: `new int[3]{1,2,3}` (ERRO)
- ✅ Tamanho inferido: `new int[]{1,2,3}` (OK)

**Diferença de varargs**:
- **Varargs** (`String...`): aceita valores diretos `metodo("a", "b")`
- **Arrays anônimos**: requer `new` `metodo(new String[]{"a", "b"})`

**Vantagens**: elimina variáveis temporárias, código mais conciso, arrays vazios em vez de `null`.

**Boas práticas**: use para dados temporários, prefira varargs quando aplicável, formatação multi-linha, arrays vazios `{}` em vez de `null`.
