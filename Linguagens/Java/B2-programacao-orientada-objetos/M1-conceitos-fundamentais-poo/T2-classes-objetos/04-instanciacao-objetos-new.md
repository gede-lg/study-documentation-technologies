# Instanciação de Objetos com new

## 🎯 Introdução e Definição

**O operador `new` é a palavra-chave responsável por criar objetos em Java** - ele **aloca memória na heap**, **chama o construtor da classe** e **retorna a referência** para o objeto criado. Sem `new`, não há objeto, apenas a classe (blueprint).

**Conceito central**: `new` **materializa** a classe abstrata em **objeto concreto**. É o ato de **construir** a casa a partir da planta, **assar** o bolo a partir da receita, **fabricar** o carro a partir do projeto. `new` transforma **especificação em realidade**.

**Analogia**: Classe é a **forma de biscoito** (molde), `new` é o ato de **pressionar a massa** contra a forma, e o objeto é o **biscoito cortado** pronto. Cada vez que você pressiona `new`, um **novo biscoito** (objeto) é criado.

**Sintaxe fundamental**:
```java
NomeDaClasse nomeVariavel = new NomeDaClasse();
//     ↓            ↓         ↓         ↓
//   Tipo       Variável  Operador  Construtor
```

**Exemplo básico**:
```java
// CLASSE - blueprint
public class Carro {
    String marca;
    String modelo;
    int ano;
    
    public Carro() {
        // Construtor
    }
}

// INSTANCIAÇÃO - criação de objetos com 'new'
Carro carro1 = new Carro();  // ← 'new' cria objeto 1
Carro carro2 = new Carro();  // ← 'new' cria objeto 2
Carro carro3 = new Carro();  // ← 'new' cria objeto 3

// Cada 'new' aloca memória e cria NOVO objeto
System.out.println(carro1);  // Carro@15db9742
System.out.println(carro2);  // Carro@6d06d69c
System.out.println(carro3);  // Carro@7852e922
// Endereços diferentes - objetos diferentes
```

**O que `new` faz**:
1. **Aloca memória** na heap para o objeto
2. **Inicializa atributos** com valores padrão
3. **Chama o construtor** especificado
4. **Retorna referência** ao objeto criado

**Etapas detalhadas**:
```java
Pessoa pessoa = new Pessoa();

// ETAPA 1: Alocação de memória
// Java reserva espaço na heap para o objeto Pessoa
// Heap: [ ... | Pessoa@1a2b | ... ]

// ETAPA 2: Inicialização padrão
// Atributos recebem valores padrão:
// - Numéricos: 0, 0.0, 0L
// - boolean: false
// - Referências: null

// ETAPA 3: Execução do construtor
// Construtor Pessoa() é chamado
// Inicializa atributos com valores específicos

// ETAPA 4: Retorno de referência
// 'new' retorna endereço do objeto
// variável 'pessoa' recebe a referência
// pessoa = Pessoa@1a2b
```

## 📋 Fundamentos Teóricos

### 1️⃣ Sintaxe Completa do Operador `new`

**Forma geral**:
```java
new NomeDaClasse(argumentos)
```

**Exemplos variados**:
```java
// Sem argumentos (construtor padrão)
Produto produto = new Produto();

// Com argumentos (construtor parametrizado)
Produto notebook = new Produto("Notebook", 3000.0);

// Múltiplos argumentos
Pessoa pessoa = new Pessoa("João", 30, "123.456.789-00");

// Sem atribuição imediata
new Carro();  // Objeto criado mas sem referência (será garbage collected)

// Atribuição posterior
Livro livro;
livro = new Livro("Clean Code", "Robert Martin");

// Em expressões
System.out.println(new Data().toString());

// Como argumento de método
processarPedido(new Pedido(1001, cliente));

// Em arrays
Produto[] produtos = new Produto[5];
produtos[0] = new Produto();
produtos[1] = new Produto("Mouse", 50);
```

### 2️⃣ Memória - Heap Allocation

**Conceito**: `new` aloca memória na **heap** (área dinâmica).

**Estrutura de memória**:
```
STACK (pilha):                 HEAP (montão):
┌──────────────┐              ┌────────────────────┐
│ main()       │              │                    │
├──────────────┤              │  Produto@1a2b      │
│ p1 → 1a2b    │─────────────→│  nome: "Mouse"     │
├──────────────┤              │  preco: 50.0       │
│ p2 → 3c4d    │─────────┐    │                    │
└──────────────┘         │    │  Produto@3c4d      │
                         └───→│  nome: "Teclado"   │
                              │  preco: 150.0      │
                              │                    │
                              └────────────────────┘
```

**Código demonstrativo**:
```java
public static void main(String[] args) {
    // STACK: Variável p1 criada
    Produto p1;
    
    // HEAP: Objeto alocado, STACK: p1 recebe referência
    p1 = new Produto();
    
    // STACK: Variável p2 criada e recebe referência
    // HEAP: Novo objeto alocado
    Produto p2 = new Produto();
    
    // Dois objetos na HEAP
    // Duas referências na STACK
}
```

**Tamanho do objeto**:
```java
public class Exemplo {
    int numero;        // 4 bytes
    double valor;      // 8 bytes
    boolean flag;      // 1 byte
    String texto;      // 4 bytes (referência)
    // Total aproximado: ~20 bytes + overhead
}

// Cada 'new Exemplo()' aloca ~20 bytes na heap
Exemplo e1 = new Exemplo();  // +20 bytes
Exemplo e2 = new Exemplo();  // +20 bytes
Exemplo e3 = new Exemplo();  // +20 bytes
// 60 bytes alocados
```

### 3️⃣ Chamada do Construtor

**Conceito**: `new` **sempre chama um construtor**.

**Construtor padrão**:
```java
public class Simples {
    String nome;
    
    // Construtor padrão implícito (Java cria automaticamente)
    // public Simples() { }
}

// 'new' chama construtor padrão
Simples obj = new Simples();
```

**Construtor explícito**:
```java
public class Produto {
    String nome;
    double preco;
    
    // Construtor explícito
    public Produto(String nome, double preco) {
        System.out.println("Construtor chamado!");
        this.nome = nome;
        this.preco = preco;
    }
}

// 'new' chama construtor com argumentos
Produto p = new Produto("Mouse", 50.0);
// Output: "Construtor chamado!"
```

**Sobrecarga de construtores**:
```java
public class Livro {
    String titulo;
    String autor;
    int ano;
    
    // Construtor 1
    public Livro() {
        System.out.println("Construtor vazio");
    }
    
    // Construtor 2
    public Livro(String titulo) {
        System.out.println("Construtor com título");
        this.titulo = titulo;
    }
    
    // Construtor 3
    public Livro(String titulo, String autor, int ano) {
        System.out.println("Construtor completo");
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
    }
}

// 'new' chama construtor conforme argumentos
Livro l1 = new Livro();  // Chama construtor 1
Livro l2 = new Livro("Clean Code");  // Chama construtor 2
Livro l3 = new Livro("Design Patterns", "GoF", 1994);  // Chama construtor 3
```

**Encadeamento de construtores**:
```java
public class Conta {
    String numero;
    String titular;
    double saldo;
    
    public Conta(String numero) {
        this(numero, "Não informado", 0.0);  // Chama outro construtor
    }
    
    public Conta(String numero, String titular) {
        this(numero, titular, 0.0);  // Chama outro construtor
    }
    
    public Conta(String numero, String titular, double saldo) {
        System.out.println("Construtor principal executado");
        this.numero = numero;
        this.titular = titular;
        this.saldo = saldo;
    }
}

// Todos os 'new' eventualmente chamam construtor principal
Conta c1 = new Conta("001");
// Output: "Construtor principal executado"

Conta c2 = new Conta("002", "João");
// Output: "Construtor principal executado"
```

### 4️⃣ Valores Padrão Após `new`

**Conceito**: Após `new`, atributos são inicializados com **valores padrão** antes do construtor.

**Tabela de valores padrão**:

| Tipo | Valor Padrão |
|------|--------------|
| `byte`, `short`, `int`, `long` | `0` |
| `float`, `double` | `0.0` |
| `boolean` | `false` |
| `char` | `'\u0000'` (null char) |
| Referências (objetos, arrays) | `null` |

**Exemplo**:
```java
public class Teste {
    int numero;
    double valor;
    boolean flag;
    String texto;
    Produto produto;
    
    public Teste() {
        // Antes desta linha, atributos já têm valores padrão
        System.out.println("numero: " + numero);    // 0
        System.out.println("valor: " + valor);      // 0.0
        System.out.println("flag: " + flag);        // false
        System.out.println("texto: " + texto);      // null
        System.out.println("produto: " + produto);  // null
    }
}

Teste t = new Teste();
// Output:
// numero: 0
// valor: 0.0
// flag: false
// texto: null
// produto: null
```

**Sequência de inicialização**:
```java
public class Exemplo {
    int a;              // 1. Valor padrão: 0
    int b = 10;         // 2. Inicialização explícita: 10
    
    public Exemplo() {
        a = 5;          // 3. Atribuição no construtor: 5
        b = 20;         // 4. Sobrescreve inicialização: 20
    }
}

Exemplo e = new Exemplo();
// e.a = 5 (construtor)
// e.b = 20 (construtor sobrescreve)
```

### 5️⃣ Retorno de Referência

**Conceito**: `new` **retorna referência** (endereço) do objeto, não o objeto em si.

**Referência**:
```java
Carro carro = new Carro();
//     ↑            ↑
//  Referência   Cria objeto e retorna referência

// 'carro' armazena endereço, NÃO o objeto
System.out.println(carro);  // Carro@15db9742 ← endereço
```

**Múltiplas referências para mesmo objeto**:
```java
Pessoa p1 = new Pessoa();
p1.nome = "João";

Pessoa p2 = p1;  // p2 recebe MESMA referência que p1

// p1 e p2 apontam para MESMO objeto
p2.nome = "Maria";
System.out.println(p1.nome);  // "Maria" ← mudou!

System.out.println(p1 == p2);  // true ← mesma referência
```

**Referência sem objeto**:
```java
Produto produto;  // Referência declarada, mas SEM objeto
// produto = null (padrão)

// produto.nome = "Mouse";  // ❌ NullPointerException

produto = new Produto();  // Agora aponta para objeto
produto.nome = "Mouse";   // ✓ OK
```

**Visualização**:
```
CÓDIGO:
Carro c1 = new Carro();
Carro c2 = new Carro();
Carro c3 = c1;

MEMÓRIA:
STACK:                  HEAP:
┌──────────┐           ┌─────────────┐
│ c1 → 1a2b│──────────→│ Carro@1a2b  │
├──────────┤           │ marca: null │
│ c2 → 3c4d│──────┐    └─────────────┘
├──────────┤      │    ┌─────────────┐
│ c3 → 1a2b│──────┼───→│ Carro@3c4d  │
└──────────┘      │    │ marca: null │
                  └────→└─────────────┘
```

### 6️⃣ Arrays de Objetos

**Conceito**: Array de objetos requer **dois `new`** - um para array, outros para objetos.

**Criação de array**:
```java
// Cria ARRAY (não objetos)
Produto[] produtos = new Produto[3];
//                   ↑ cria array com 3 posições
//                   cada posição = null

// Array criado, mas SEM objetos:
// produtos[0] = null
// produtos[1] = null
// produtos[2] = null

// Criar objetos individualmente
produtos[0] = new Produto();  // ← 'new' para objeto
produtos[1] = new Produto();  // ← 'new' para objeto
produtos[2] = new Produto();  // ← 'new' para objeto

// Agora array TEM objetos
produtos[0].nome = "Mouse";
produtos[1].nome = "Teclado";
produtos[2].nome = "Monitor";
```

**Visualização**:
```
ETAPA 1 - new Produto[3]:
┌───┬───┬───┐
│ 0 │ 1 │ 2 │  Array criado
├───┼───┼───┤
│null│null│null│  Sem objetos
└───┴───┴───┘

ETAPA 2 - new Produto() para cada posição:
┌───┬───┬───┐
│ 0 │ 1 │ 2 │
├───┼───┼───┤
│ ● │ ● │ ● │  Objetos criados
└─┼─┴─┼─┴─┼─┘
  ↓   ↓   ↓
  P1  P2  P3
```

**Loop de criação**:
```java
Livro[] biblioteca = new Livro[100];

// Criar 100 objetos
for (int i = 0; i < biblioteca.length; i++) {
    biblioteca[i] = new Livro();  // 'new' em loop
}

// Agora todos os objetos existem
biblioteca[0].titulo = "Clean Code";
biblioteca[1].titulo = "Design Patterns";
```

### 7️⃣ `new` em Expressões

**Como argumento de método**:
```java
public class PedidoService {
    void processar(Pedido pedido) {
        System.out.println("Processando pedido " + pedido.numero);
    }
}

PedidoService service = new PedidoService();

// 'new' diretamente como argumento
service.processar(new Pedido(1001));
//                ↑ objeto criado e passado
```

**Como retorno de método**:
```java
public class ProdutoFactory {
    Produto criarProduto(String nome, double preco) {
        return new Produto(nome, preco);  // 'new' no return
    }
}

ProdutoFactory factory = new ProdutoFactory();
Produto p = factory.criarProduto("Mouse", 50);
```

**Em operações encadeadas**:
```java
// Criação e chamada de método em uma linha
String resultado = new StringBuilder()
    .append("Hello")
    .append(" ")
    .append("World")
    .toString();
// new StringBuilder() cria objeto
// Métodos são chamados no objeto criado

// Outro exemplo
int tamanho = new ArrayList<String>()
    .stream()
    .filter(s -> s.length() > 5)
    .toList()
    .size();
```

**Em condicionais**:
```java
if (new Random().nextBoolean()) {
    System.out.println("true");
}

// Switch expression
String tipo = switch (codigo) {
    case 1 -> new TipoPadrao().getNome();
    case 2 -> new TipoEspecial().getNome();
    default -> "Desconhecido";
};
```

### 8️⃣ `new` com Classes Internas

**Classe interna não-estática**:
```java
public class Externa {
    private String nome;
    
    public class Interna {
        void mostrar() {
            System.out.println(nome);  // Acessa atributo da externa
        }
    }
}

// Criar objeto da classe externa
Externa ext = new Externa();

// Criar objeto da classe interna (precisa de instância externa)
Externa.Interna interna = ext.new Interna();
//                        ↑ 'new' com instância
```

**Classe interna estática**:
```java
public class Externa {
    public static class InternaEstatica {
        void mostrar() {
            System.out.println("Estática");
        }
    }
}

// Não precisa de instância externa
Externa.InternaEstatica obj = new Externa.InternaEstatica();
```

### 9️⃣ Classes Anônimas com `new`

**Conceito**: `new` pode criar **classe anônima** (classe sem nome).

**Interface**:
```java
interface Comparador {
    int comparar(int a, int b);
}

// Criar objeto de classe anônima que implementa interface
Comparador comp = new Comparador() {
    @Override
    public int comparar(int a, int b) {
        return a - b;
    }
};

comp.comparar(5, 3);  // 2
```

**Classe abstrata**:
```java
abstract class Animal {
    abstract void emitirSom();
}

// Criar objeto de classe anônima que estende Animal
Animal cachorro = new Animal() {
    @Override
    void emitirSom() {
        System.out.println("Au au!");
    }
};

cachorro.emitirSom();  // "Au au!"
```

### 🔟 Performance e Otimização

**Custo de `new`**:
```java
// Cada 'new' tem custo:
// 1. Alocação de memória
// 2. Inicialização
// 3. Chamada de construtor
// 4. Garbage collection futuro

// Evitar em loops intensos
for (int i = 0; i < 1_000_000; i++) {
    Objeto obj = new Objeto();  // ⚠️ 1 milhão de objetos
}

// Preferir reutilização quando possível
Objeto obj = new Objeto();
for (int i = 0; i < 1_000_000; i++) {
    obj.resetar();  // ✓ Reutiliza objeto
}
```

**Pools de objetos**:
```java
// Object pool - reutiliza objetos
public class ConexaoPool {
    private List<Conexao> disponiveis = new ArrayList<>();
    
    public ConexaoPool() {
        // Cria pool inicial
        for (int i = 0; i < 10; i++) {
            disponiveis.add(new Conexao());  // 'new' apenas aqui
        }
    }
    
    public Conexao obter() {
        return disponiveis.remove(0);  // Reutiliza
    }
    
    public void devolver(Conexao c) {
        disponiveis.add(c);  // Retorna ao pool
    }
}
```

**Lazy initialization**:
```java
public class Servico {
    private ConexaoBanco conexao;  // null inicialmente
    
    public ConexaoBanco getConexao() {
        if (conexao == null) {
            conexao = new ConexaoBanco();  // 'new' apenas quando necessário
        }
        return conexao;
    }
}
```

## 🎯 Aplicabilidade

**1. Criação de objetos de domínio**
**2. Instanciação de DTOs**
**3. Criação de coleções**
**4. Factory methods**
**5. Builder patterns**

## ⚠️ Armadilhas Comuns

**1. Esquecer `new`**:
```java
Pessoa p;
p.nome = "João";  // ❌ NullPointerException
```

**2. `new` em array sem objetos**:
```java
Produto[] arr = new Produto[5];
arr[0].nome = "Mouse";  // ❌ NullPointerException
```

**3. Criar objetos desnecessários**:
```java
for (int i = 0; i < 1000; i++) {
    String s = new String("texto");  // ⚠️ Desnecessário
    String s = "texto";  // ✓ Reutiliza
}
```

**4. Memory leak**:
```java
static List<Objeto> lista = new ArrayList<>();
while (true) {
    lista.add(new Objeto());  // ❌ Nunca libera
}
```

**5. Confundir array e objetos**:
```java
Livro[] livros = new Livro[10];
// Criou array, NÃO livros
```

## ✅ Boas Práticas

**1. Validar no construtor**:
```java
public Produto(String nome) {
    if (nome == null) throw new IllegalArgumentException();
    this.nome = nome;
}
```

**2. Usar factory methods**:
```java
public static Produto criar(String nome) {
    return new Produto(nome);
}
```

**3. Considerar builders**:
```java
Pessoa p = new Pessoa.Builder()
    .nome("João")
    .idade(30)
    .build();
```

**4. Reutilizar quando possível**:
```java
StringBuilder sb = new StringBuilder();
for (String s : lista) {
    sb.append(s);  // Reutiliza
}
```

**5. Lazy initialization**:
```java
if (objeto == null) {
    objeto = new Objeto();
}
```

## 📚 Resumo Executivo

**`new` cria objetos**.

**Sintaxe**:
```java
Tipo var = new Tipo(args);
```

**Processo**:
1. Aloca memória (heap)
2. Inicializa com valores padrão
3. Chama construtor
4. Retorna referência

**Valores padrão**:
- Numéricos: 0
- boolean: false
- Referências: null

**Arrays**:
```java
Tipo[] arr = new Tipo[n];  // Array
arr[i] = new Tipo();        // Objetos
```

**Expressões**:
```java
metodo(new Tipo());  // Argumento
return new Tipo();   // Retorno
```

**Custo**:
- Alocação de memória
- Inicialização
- Construtor
- GC futuro

**Recomendação**: Use `new` para criar objetos, **valide no construtor**, **reutilize quando possível**, evite criar objetos desnecessários em loops intensos.