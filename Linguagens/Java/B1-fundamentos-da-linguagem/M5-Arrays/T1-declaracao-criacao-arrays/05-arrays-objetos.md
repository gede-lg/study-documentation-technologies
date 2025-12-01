# Arrays de Objetos

## 🎯 Introdução e Definição

**Arrays de objetos** armazenam **referências** (ponteiros) para objetos, não os objetos em si. Após a criação com `new`, o array contém **apenas slots com `null`** - os objetos devem ser **instanciados separadamente**.

**Conceito central**: `TipoObjeto[] arr = new TipoObjeto[n]` cria array de **n referências nulas**, não n objetos.

**Diferença fundamental de primitivos**:
```java
// Primitivos: valores armazenados diretamente
int[] nums = new int[3];  // [0, 0, 0] - valores prontos

// Objetos: apenas referências, objetos NÃO criados
String[] strs = new String[3];  // [null, null, null] - sem objetos!
```

**Implicação crítica**: tentar usar elementos sem inicialização causa **`NullPointerException`**.

## 📋 Fundamentos Teóricos

### 1️⃣ Armazenamento de Referências (Não Objetos)

Array contém **referências** (endereços de memória), não os objetos:

```java
String[] nomes = new String[2];
// Memória: [null, null] - dois slots de referência vazios

nomes[0] = "Ana";  // Cria String "Ana" e armazena referência
nomes[1] = "Bob";  // Cria String "Bob" e armazena referência
// Memória: [ref1, ref2] -> String("Ana"), String("Bob")
```

**Estrutura de memória**:
```
Array:     [ref1] [ref2]
             |      |
             v      v
Heap:     "Ana"   "Bob"
```

### 2️⃣ Inicialização com null - Todos os Slots Vazios

Todos os elementos inicialmente apontam para `null`:

```java
String[] arr = new String[3];  // [null, null, null]
Integer[] nums = new Integer[2];  // [null, null]
Object[] objs = new Object[5];  // [null, null, null, null, null]

// Verificação
System.out.println(arr[0]);  // null
System.out.println(arr[0] == null);  // true
```

**Contraste com primitivos**:
```java
int[] primitivos = new int[3];  // [0, 0, 0] - valores úteis
String[] objetos = new String[3];  // [null, null, null] - inúteis sem inicialização
```

### 3️⃣ Inicialização Obrigatória - Criando Objetos

Cada elemento **deve ser explicitamente inicializado**:

```java
String[] nomes = new String[3];

// ❌ NullPointerException se não inicializar
// System.out.println(nomes[0].length());  // NPE!

// ✅ Inicialização correta
nomes[0] = "Ana";
nomes[1] = "Bob";
nomes[2] = "Carlos";

// Agora é seguro usar
System.out.println(nomes[0].length());  // 3
```

**Inicialização em loop**:
```java
Integer[] nums = new Integer[5];
for (int i = 0; i < nums.length; i++) {
    nums[i] = new Integer(i * 10);  // Cria objetos
}
// [0, 10, 20, 30, 40]
```

### 4️⃣ NullPointerException - Armadilha Principal

Usar elemento `null` causa **`NullPointerException`**:

```java
String[] arr = new String[3];

// ❌ ERRO: NullPointerException
String upper = arr[0].toUpperCase();  // arr[0] é null!

// ✅ Verificação defensiva
if (arr[0] != null) {
    String upper = arr[0].toUpperCase();  // Seguro
}
```

**Exemplo comum de erro**:
```java
public void processar(String[] itens) {
    for (String item : itens) {
        System.out.println(item.length());  // ⚠️ NPE se item for null!
    }
}

// ✅ Versão segura
public void processar(String[] itens) {
    for (String item : itens) {
        if (item != null) {
            System.out.println(item.length());
        }
    }
}
```

### 5️⃣ Wrappers de Primitivos - Integer, Double, etc.

Arrays de **wrappers** comportam-se como arrays de objetos:

```java
// Wrapper: objetos, todos null
Integer[] wrappers = new Integer[3];  // [null, null, null]

// ❌ NullPointerException ao unboxing
// int x = wrappers[0];  // Tenta converter null -> int (NPE!)

// ✅ Inicialização
wrappers[0] = 10;  // Autoboxing: int -> Integer
wrappers[1] = Integer.valueOf(20);
wrappers[2] = new Integer(30);  // Deprecated desde Java 9

// Agora seguro
int x = wrappers[0];  // Unboxing: Integer -> int
```

**Comparação com primitivos**:
```java
int[] primitivos = new int[3];  // [0, 0, 0] - seguro
Integer[] wrappers = new Integer[3];  // [null, null, null] - perigoso!
```

### 6️⃣ Referências Compartilhadas - Mesmo Objeto

Múltiplas posições podem **referenciar o mesmo objeto**:

```java
String comum = "Teste";
String[] arr = {comum, comum, comum};
// Todas as posições referenciam o MESMO objeto

// Modificação afeta todas (se mutável)
StringBuilder sb = new StringBuilder("Java");
StringBuilder[] arr2 = {sb, sb, sb};
sb.append("!");  // Modifica objeto compartilhado
// arr2[0], arr2[1], arr2[2] todos apontam para "Java!"
```

**Comparação de referências**:
```java
String a = "Test";
String b = "Test";
String[] arr = {a, b};

arr[0] == arr[1];  // true (String pool - mesmo objeto)

StringBuilder c = new StringBuilder("Test");
StringBuilder d = new StringBuilder("Test");
StringBuilder[] arr2 = {c, d};

arr2[0] == arr2[1];  // false (objetos diferentes)
arr2[0].toString().equals(arr2[1].toString());  // true (conteúdo igual)
```

### 7️⃣ Modificação de Objetos Compartilhados

Modificar objeto **afeta todas as referências**:

```java
class Pessoa {
    String nome;
    Pessoa(String nome) { this.nome = nome; }
}

Pessoa p = new Pessoa("Ana");
Pessoa[] arr = {p, p, p};  // Três referências ao MESMO objeto

p.nome = "Maria";  // Modifica objeto
System.out.println(arr[0].nome);  // Maria
System.out.println(arr[1].nome);  // Maria
System.out.println(arr[2].nome);  // Maria
```

### 8️⃣ Defensive Copying - Evitar Compartilhamento Indesejado

**Cópia defensiva** evita modificações externas:

```java
// ❌ Compartilhamento perigoso
public class Container {
    private String[] items;
    
    public String[] getItems() {
        return items;  // Retorna array interno (perigoso!)
    }
}
// Usuário pode modificar array interno!

// ✅ Defensive copy
public class Container {
    private String[] items;
    
    public String[] getItems() {
        return Arrays.copyOf(items, items.length);  // Retorna cópia
    }
    
    public void setItems(String[] items) {
        this.items = Arrays.copyOf(items, items.length);  // Armazena cópia
    }
}
```

### 9️⃣ Arrays Polimórficos - Covariância

Arrays são **covariantes**: `TipoFilho[]` é subtipo de `TipoPai[]`:

```java
String[] strings = {"a", "b", "c"};
Object[] objects = strings;  // ✅ OK: String[] é Object[]

// ⚠️ Porém, runtime verifica tipo real
objects[0] = "x";  // OK: String
objects[0] = 123;  // ❌ ArrayStoreException! (não é String)
```

**Contraste com Generics**:
```java
// Arrays: covariantes (permitem, mas verificam em runtime)
String[] strings = {"a"};
Object[] objects = strings;  // OK

// Generics: invariantes (não permitem)
List<String> listStr = new ArrayList<>();
// List<Object> listObj = listStr;  // ❌ ERRO DE COMPILAÇÃO
```

### 🔟 Inicialização Inline com Objetos

Objetos podem ser **criados diretamente na inicialização**:

```java
// Inline com new
String[] nomes = {
    new String("Ana"),
    new String("Bob"),
    new String("Carlos")
};

// Literais (String)
String[] nomes2 = {"Ana", "Bob", "Carlos"};

// Objetos customizados
Pessoa[] pessoas = {
    new Pessoa("Ana", 25),
    new Pessoa("Bob", 30),
    new Pessoa("Carlos", 35)
};

// Arrays anônimos
processar(new String[]{"a", "b", "c"});
```

## 🎯 Aplicabilidade

**1. Coleções de Objetos do Domínio**:
```java
Produto[] produtos = new Produto[100];
Cliente[] clientes = new Cliente[50];
```

**2. Strings e Texto**:
```java
String[] palavras = texto.split(" ");
String[] linhas = Files.readAllLines(path).toArray(new String[0]);
```

**3. Wrappers para Compatibilidade**:
```java
Integer[] nums = {1, 2, 3};  // Para APIs que aceitam Object[]
```

**4. Polimorfismo**:
```java
Animal[] animais = {new Cachorro(), new Gato(), new Passaro()};
for (Animal a : animais) {
    a.emitirSom();  // Polimorfismo
}
```

**5. Retorno de Múltiplos Objetos**:
```java
public String[] buscarNomes() {
    return new String[]{"Ana", "Bob", "Carlos"};
}
```

## ⚠️ Armadilhas Comuns

**1. Esquecer Inicialização - NullPointerException**:
```java
String[] arr = new String[5];
System.out.println(arr[0].length());  // ❌ NPE!
```

**2. Confundir com Primitivos (Valores Padrão)**:
```java
Integer[] nums = new Integer[3];  // [null, null, null] (não [0, 0, 0]!)
int soma = nums[0] + nums[1];  // ❌ NPE ao unboxing
```

**3. ArrayStoreException em Arrays Covariantes**:
```java
String[] strings = {"a"};
Object[] objects = strings;
objects[0] = 123;  // ❌ Runtime: ArrayStoreException
```

**4. Modificação de Objetos Compartilhados**:
```java
Pessoa p = new Pessoa("Ana");
Pessoa[] arr = {p, p};
arr[0].nome = "Maria";
System.out.println(arr[1].nome);  // "Maria" (compartilhado!)
```

**5. Não Fazer Defensive Copy**:
```java
public String[] getItems() {
    return items;  // ⚠️ Permite modificação externa
}
```

## ✅ Boas Práticas

**1. Sempre Inicialize Objetos**:
```java
String[] arr = new String[3];
for (int i = 0; i < arr.length; i++) {
    arr[i] = "";  // Inicializa com string vazia (ou new String())
}
```

**2. Verificações de Null Defensivas**:
```java
for (String s : arr) {
    if (s != null) {
        processar(s);
    }
}
```

**3. Use Inicialização Inline Quando Possível**:
```java
String[] nomes = {"Ana", "Bob", "Carlos"};  // Mais claro
```

**4. Prefira Collections para Flexibilidade**:
```java
// ❌ Array de objetos: tamanho fixo, null perigoso
String[] arr = new String[10];

// ✅ List: dinâmico, sem nulls indesejados
List<String> lista = new ArrayList<>();
lista.add("Ana");
```

**5. Defensive Copy em Getters/Setters**:
```java
public String[] getItems() {
    return Arrays.copyOf(items, items.length);
}
```

**6. Evite Arrays Covariantes para Mutação**:
```java
// ❌ Perigoso
Object[] objects = new String[5];

// ✅ Use tipo correto
String[] strings = new String[5];
```

**7. Use Streams para Inicialização**:
```java
String[] uppercase = Arrays.stream(nomes)
                           .map(String::toUpperCase)
                           .toArray(String[]::new);
```

## 📚 Resumo Executivo

Arrays de objetos armazenam **referências**, não objetos. Criados com **todos os slots `null`** - inicialização é **obrigatória**.

**Diferenças de primitivos**:
- **Primitivos**: valores diretos, padrões úteis (0, false)
- **Objetos**: referências, padrão `null` (perigoso!)

**Inicialização**:
```java
String[] arr = new String[3];  // [null, null, null]
arr[0] = "Ana";  // Inicializa elemento 0
```

**NullPointerException**: principal risco - sempre verificar `!= null` antes de usar.

**Referências compartilhadas**: múltiplos slots podem apontar para o mesmo objeto - modificação afeta todos.

**Defensive copying**: use `Arrays.copyOf()` para evitar modificação externa de arrays internos.

**Quando usar**: coleções de objetos do domínio, strings, polimorfismo. Para flexibilidade, prefira `ArrayList<T>`.
