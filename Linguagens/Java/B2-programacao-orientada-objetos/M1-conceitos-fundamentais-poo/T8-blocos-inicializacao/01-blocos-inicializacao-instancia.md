# T8.01 - Blocos de Inicialização de Instância

## Introdução e Definição

**Blocos de inicialização de instância** (instance initialization blocks) são blocos de código delimitados por chaves `{}` declarados **dentro** de uma classe, mas **fora** de qualquer método ou construtor. Eles são executados **automaticamente** toda vez que uma instância (objeto) da classe é criada, **antes** do construtor ser executado.

Esses blocos permitem inicializar atributos de instância, executar lógica de configuração ou realizar operações que precisam acontecer em **todas as instâncias** da classe, independentemente de qual construtor foi chamado. São especialmente úteis quando você tem **lógica de inicialização complexa** que é comum a todos os construtores.

**Sintaxe**:
```java
public class Exemplo {
    private int valor;
    private String nome;

    // Bloco de inicialização de instância
    {
        System.out.println("Bloco de inicialização executado");
        valor = 10;
        nome = "Padrão";
    }

    public Exemplo() {
        System.out.println("Construtor padrão");
    }

    public Exemplo(int valor) {
        System.out.println("Construtor parametrizado");
        this.valor = valor;
    }
}

// Ao criar objetos:
Exemplo e1 = new Exemplo();
// Saída:
// Bloco de inicialização executado
// Construtor padrão

Exemplo e2 = new Exemplo(20);
// Saída:
// Bloco de inicialização executado
// Construtor parametrizado
```

**Características principais**:
- Executado **toda vez** que um objeto é criado
- Executado **antes** do construtor
- Pode haver **múltiplos** blocos de inicialização de instância
- Executados na **ordem em que aparecem** no código
- Têm acesso a atributos de instância e podem usar `this`
- Úteis para **compartilhar código** entre múltiplos construtores

---

## 10 Fundamentos Teóricos

### 1. Sintaxe e Declaração

Um bloco de inicialização de instância é simplesmente um **bloco de código** (entre chaves `{}`) colocado diretamente no corpo da classe, não dentro de um método ou construtor.

```java
public class Pessoa {
    private String nome;
    private int idade;

    // Bloco de inicialização de instância
    {
        System.out.println("Inicializando objeto Pessoa");
        nome = "Sem nome";
        idade = 0;
    }

    public Pessoa() {
        System.out.println("Construtor padrão");
    }

    public Pessoa(String nome, int idade) {
        System.out.println("Construtor parametrizado");
        this.nome = nome;
        this.idade = idade;
    }
}
```

O bloco é executado **automaticamente** quando `new Pessoa()` é invocado.

---

### 2. Execução Antes do Construtor

O bloco de inicialização de instância é executado **antes** do corpo do construtor, mas **depois** dos atributos terem sido inicializados com seus valores padrão.

```java
public class Ordem {
    private int valor = 5; // Inicialização direta

    // Bloco de inicialização
    {
        System.out.println("Bloco: valor = " + valor); // 5
        valor = 10;
    }

    public Ordem() {
        System.out.println("Construtor: valor = " + valor); // 10
        valor = 20;
    }
}

// Criando objeto:
Ordem o = new Ordem();
// Saída:
// Bloco: valor = 5
// Construtor: valor = 10
```

**Ordem de execução**:
1. Atributos inicializados com valores padrão ou valores diretos (`int valor = 5;`)
2. Blocos de inicialização de instância
3. Corpo do construtor

---

### 3. Múltiplos Blocos de Inicialização

Uma classe pode ter **múltiplos** blocos de inicialização de instância. Eles são executados na **ordem em que aparecem** no código fonte.

```java
public class MultiplosB locos {
    private int a, b, c;

    // Primeiro bloco
    {
        System.out.println("Bloco 1");
        a = 1;
    }

    // Segundo bloco
    {
        System.out.println("Bloco 2");
        b = 2;
    }

    // Terceiro bloco
    {
        System.out.println("Bloco 3");
        c = 3;
    }

    public MultiplosB locos() {
        System.out.println("Construtor: a=" + a + ", b=" + b + ", c=" + c);
    }
}

// Criando objeto:
MultiplosB locos m = new MultiplosB locos();
// Saída:
// Bloco 1
// Bloco 2
// Bloco 3
// Construtor: a=1, b=2, c=3
```

---

### 4. Compartilhamento de Código Entre Construtores

Blocos de inicialização são úteis para **compartilhar lógica** de inicialização entre múltiplos construtores, sem usar `this()`.

```java
public class Configuracao {
    private Map<String, String> propriedades;

    // Lógica comum a todos os construtores
    {
        System.out.println("Inicializando propriedades");
        propriedades = new HashMap<>();
        propriedades.put("versao", "1.0");
        propriedades.put("autor", "Sistema");
    }

    public Configuracao() {
        System.out.println("Configuração padrão criada");
    }

    public Configuracao(String nome) {
        propriedades.put("nome", nome);
        System.out.println("Configuração " + nome + " criada");
    }
}

// Ambos os construtores executam o bloco de inicialização:
Configuracao c1 = new Configuracao();
Configuracao c2 = new Configuracao("Principal");
```

Todos os construtores compartilham a lógica de inicializar o `Map`.

---

### 5. Acesso a this e Atributos de Instância

Blocos de inicialização de instância têm acesso completo a `this` e todos os atributos e métodos de instância.

```java
public class ComThis {
    private String nome;
    private int contador;

    {
        this.nome = "Padrão";
        this.contador = obterContadorInicial();
        System.out.println("Nome: " + this.nome + ", Contador: " + this.contador);
    }

    private int obterContadorInicial() {
        return 100;
    }

    public ComThis() {
        System.out.println("Construtor");
    }
}
```

O bloco pode usar `this`, chamar métodos privados e acessar atributos.

---

### 6. Inicialização de Coleções e Estruturas Complexas

Blocos de inicialização são ideais para inicializar **coleções** ou estruturas de dados complexas.

```java
public class Catalogo {
    private List<String> produtos;
    private Map<String, Double> precos;

    // Inicialização complexa de coleções
    {
        produtos = new ArrayList<>();
        produtos.add("Produto A");
        produtos.add("Produto B");
        produtos.add("Produto C");

        precos = new HashMap<>();
        precos.put("Produto A", 10.0);
        precos.put("Produto B", 20.0);
        precos.put("Produto C", 30.0);

        System.out.println("Catálogo inicializado com " + produtos.size() + " produtos");
    }

    public Catalogo() {
        System.out.println("Catálogo criado");
    }
}
```

---

### 7. Execução em Todas as Instâncias

O bloco de inicialização é executado **toda vez** que um objeto é criado, **independentemente** do construtor usado.

```java
public class Exemplo {
    private static int contador = 0;
    private int id;

    // Executado em TODAS as instâncias
    {
        contador++;
        id = contador;
        System.out.println("Objeto criado, ID: " + id);
    }

    public Exemplo() {}
    public Exemplo(String nome) {}
    public Exemplo(int valor) {}
}

// Criando múltiplos objetos:
new Exemplo();           // Objeto criado, ID: 1
new Exemplo("Teste");    // Objeto criado, ID: 2
new Exemplo(10);         // Objeto criado, ID: 3
```

Todos os três construtores executam o bloco de inicialização.

---

### 8. Tratamento de Exceções

Blocos de inicialização podem lançar exceções, mas se lançarem **checked exceptions**, todos os construtores devem declará-las com `throws`.

```java
public class ComExcecao {
    private File arquivo;

    // Bloco pode lançar IOException
    {
        try {
            arquivo = new File("config.txt");
            if (!arquivo.exists()) {
                throw new IOException("Arquivo não encontrado");
            }
        } catch (IOException e) {
            System.err.println("Erro na inicialização: " + e.getMessage());
            arquivo = null;
        }
    }

    public ComExcecao() {
        System.out.println("Construtor");
    }
}
```

Se não tratar a exceção no bloco, **todos** os construtores devem declarar `throws IOException`.

---

### 9. Ordem com Inicialização Direta de Atributos

Se um atributo é inicializado diretamente (`private int x = 10;`) **e** no bloco de inicialização, a ordem é:
1. Inicialização direta
2. Bloco de inicialização
3. Construtor

```java
public class OrdemCompleta {
    private int valor = 5; // 1. Inicialização direta

    // 2. Bloco de inicialização
    {
        System.out.println("Bloco: valor = " + valor); // 5
        valor = 10;
    }

    // 3. Construtor
    public OrdemCompleta() {
        System.out.println("Construtor: valor = " + valor); // 10
        valor = 20;
    }
}

OrdemCompleta o = new OrdemCompleta();
// Saída:
// Bloco: valor = 5
// Construtor: valor = 10
```

---

### 10. Blocos Anônimos vs Construtores

Blocos de inicialização são úteis quando você tem lógica comum, mas construtores ainda são necessários para lógica específica.

```java
public class Produto {
    private String nome;
    private double preco;
    private List<String> tags;

    // Lógica comum: inicializar tags
    {
        tags = new ArrayList<>();
        tags.add("novo");
    }

    // Lógica específica de cada construtor
    public Produto(String nome) {
        this.nome = nome;
        this.preco = 0.0;
    }

    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
        if (preco > 100) {
            tags.add("premium");
        }
    }
}
```

O bloco garante que `tags` está sempre inicializada, e os construtores adicionam lógica específica.

---

## Aplicabilidade

### Quando Usar Blocos de Inicialização de Instância

1. **Lógica Comum a Todos os Construtores**: Quando múltiplos construtores compartilham a mesma lógica de inicialização.
   ```java
   {
       // Código executado por todos os construtores
   }
   ```

2. **Inicialização Complexa de Coleções**: Para inicializar `List`, `Map`, `Set` com valores.
   ```java
   {
       lista = new ArrayList<>();
       lista.add("item1");
       lista.add("item2");
   }
   ```

3. **Configuração de Atributos Antes do Construtor**: Quando você precisa garantir que certos atributos estejam configurados antes do construtor.

4. **Registro ou Logging**: Para registrar a criação de objetos.
   ```java
   {
       System.out.println("Objeto criado: " + this.getClass().getName());
   }
   ```

5. **Classes Anônimas**: Blocos de inicialização são comuns em classes anônimas para configuração.
   ```java
   List<String> lista = new ArrayList<>() {{
       add("item1");
       add("item2");
   }};
   ```

### Quando NÃO Usar

1. **Lógica Específica de Um Construtor**: Use o próprio construtor.
2. **Inicialização Simples**: Use inicialização direta de atributos (`private int x = 10;`).
3. **Código Complexo Demais**: Se o bloco ficar muito complexo, considere métodos auxiliares privados.

---

## Armadilhas Comuns

### 1. Confundir com Blocos Estáticos

Blocos de **instância** `{}` executam a cada criação de objeto. Blocos **estáticos** `static {}` executam apenas uma vez ao carregar a classe.

```java
public class Confusao {
    // Bloco ESTÁTICO
    static {
        System.out.println("Bloco estático (uma vez)");
    }

    // Bloco de INSTÂNCIA
    {
        System.out.println("Bloco de instância (toda criação)");
    }
}

new Confusao(); // Estático, depois Instância
new Confusao(); // Apenas Instância
```

---

### 2. Ordem de Execução com Herança

Em hierarquias de herança, blocos da **superclasse** executam **antes** dos blocos da subclasse.

```java
class Pai {
    { System.out.println("Bloco Pai"); }
    public Pai() { System.out.println("Construtor Pai"); }
}

class Filho extends Pai {
    { System.out.println("Bloco Filho"); }
    public Filho() { System.out.println("Construtor Filho"); }
}

new Filho();
// Saída:
// Bloco Pai
// Construtor Pai
// Bloco Filho
// Construtor Filho
```

---

### 3. Exceções Não Tratadas

Se um bloco lançar uma **checked exception** não tratada, todos os construtores devem declará-la.

```java
public class Problema {
    {
        throw new IOException("Erro"); // Checked exception
    }

    public Problema() {} // ERRO: Deve declarar throws IOException
}

// Solução:
public Problema() throws IOException {}
```

---

### 4. Uso Excessivo de Blocos de Inicialização

Blocos demais podem tornar o código difícil de ler. Prefira métodos auxiliares privados.

```java
// Evitar: Muitos blocos
{
    // 50 linhas de código
}

{
    // Mais 50 linhas
}

// Preferir: Métodos auxiliares
{
    inicializarConfig();
    inicializarRecursos();
}

private void inicializarConfig() { ... }
private void inicializarRecursos() { ... }
```

---

### 5. Confundir com Double-Brace Initialization

Usar blocos de inicialização em classes anônimas (**double-brace initialization**) pode causar memory leaks ao manter referência à classe externa.

```java
// Evitar (pode causar memory leak)
List<String> lista = new ArrayList<>() {{
    add("item1");
    add("item2");
}};

// Preferir
List<String> lista = new ArrayList<>();
lista.add("item1");
lista.add("item2");

// Ou com List.of() (imutável)
List<String> lista = List.of("item1", "item2");
```

---

## Boas Práticas

### 1. Use Para Lógica Comum Entre Construtores

Se múltiplos construtores compartilham lógica, use um bloco de inicialização ou delegue a um construtor mestre com `this()`.

```java
// Com bloco de inicialização
{
    inicializarRecursos();
}

// Ou com this()
public Exemplo(String nome) {
    this(nome, 0); // Delega ao construtor mestre
}
```

---

### 2. Mantenha Blocos Simples

Blocos de inicialização devem ser **simples e claros**. Lógica complexa deve estar em métodos privados.

```java
{
    configurarPadrao();
    registrarObjeto();
}

private void configurarPadrao() { ... }
private void registrarObjeto() { ... }
```

---

### 3. Prefira Inicialização Direta Para Valores Simples

Para atributos simples, use inicialização direta em vez de blocos.

```java
// Simples: Inicialização direta
private int valor = 10;
private String nome = "Padrão";

// Complexo: Use bloco
{
    lista = new ArrayList<>();
    for (int i = 0; i < 10; i++) {
        lista.add("Item " + i);
    }
}
```

---

### 4. Documente Blocos Não Óbvios

Se um bloco de inicialização realiza operações não óbvias, documente.

```java
/**
 * Inicializa o cache de produtos carregando do banco de dados.
 */
{
    carregarCacheProdutos();
}
```

---

### 5. Evite Double-Brace Initialization

Não use blocos de inicialização em classes anônimas para inicializar coleções; use métodos factory.

```java
// Evitar
Map<String, String> map = new HashMap<>() {{
    put("a", "1");
    put("b", "2");
}};

// Preferir
Map<String, String> map = Map.of("a", "1", "b", "2");
```

---

### 6. Trate Exceções Adequadamente

Se um bloco pode lançar exceções, trate-as internamente ou declare em todos os construtores.

```java
{
    try {
        inicializarRecurso();
    } catch (Exception e) {
        log.error("Erro na inicialização", e);
        // Fallback ou lançar runtime exception
    }
}
```

---

### 7. Use com Moderação

Blocos de inicialização são menos comuns que construtores. Use quando realmente há lógica compartilhada entre múltiplos construtores.

---

### 8. Considere Ordem de Execução em Herança

Lembre-se que blocos da superclasse executam antes dos da subclasse.

---

### 9. Prefira this() Para Delegação

Se possível, delegue a um construtor mestre com `this()` em vez de usar blocos de inicialização.

```java
public Exemplo(String nome, int valor) {
    // Construtor mestre
}

public Exemplo(String nome) {
    this(nome, 0); // Delegação preferível a bloco de inicialização
}
```

---

### 10. Use Para Inicialização de Coleções Estáticas Complexas

Blocos de inicialização são úteis para inicializar coleções estáticas de forma legível (junto com `static {}`).

---

## Resumo Executivo

**Blocos de inicialização de instância** são blocos de código `{}` declarados no corpo de uma classe, executados **automaticamente** antes do construtor **toda vez** que um objeto é criado.

**Sintaxe**:
```java
public class Exemplo {
    {
        // Código executado antes do construtor
    }

    public Exemplo() {
        // Construtor
    }
}
```

**Características**:
- Executado **toda vez** que um objeto é criado
- Executado **antes** do corpo do construtor
- Múltiplos blocos executam na **ordem em que aparecem**
- Têm acesso a `this` e membros de instância
- Úteis para **compartilhar lógica** entre construtores

**Ordem de Execução**:
1. Atributos inicializados com valores padrão ou diretos (`int x = 5;`)
2. Blocos de inicialização de instância
3. Corpo do construtor

**Quando Usar**:
- Lógica comum a **todos os construtores**
- Inicialização complexa de **coleções**
- Configuração de atributos antes do construtor
- Registro ou logging de criação de objetos

**Quando NÃO Usar**:
- Lógica específica de um único construtor (use o construtor)
- Inicialização simples (use inicialização direta `int x = 10;`)
- Código muito complexo (use métodos auxiliares privados)

**Boas Práticas**:
- Mantenha blocos **simples e claros**
- Prefira **inicialização direta** para valores simples
- Use **métodos auxiliares** privados para lógica complexa
- Evite **double-brace initialization** (causa memory leaks)
- Prefira **`this()`** para delegação entre construtores quando possível
- Documente blocos não óbvios
- Trate exceções adequadamente

**Armadilhas**:
- Confundir blocos de instância `{}` com blocos estáticos `static {}`
- Esquecer ordem de execução em herança (superclasse primeiro)
- Checked exceptions não tratadas exigem `throws` em todos os construtores
- Uso excessivo torna código difícil de ler
- Double-brace initialization pode causar memory leaks

Blocos de inicialização de instância são uma ferramenta útil para **compartilhar lógica de inicialização** entre construtores, mas devem ser usados com **moderação** e **clareza**.
