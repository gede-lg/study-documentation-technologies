# Definição de Objeto

## 🎯 Introdução e Definição

**Objeto é uma instância concreta de uma classe** - é a **materialização** do blueprint, a **entidade real** que existe na memória e possui **estado (dados) e comportamento (métodos)**. Enquanto a classe é a **especificação abstrata**, o objeto é a **realização concreta**.

**Conceito central**: Objeto = **dados + comportamento + identidade**. Cada objeto tem:
1. **Estado** - valores específicos de atributos (ex: saldo = 1000, nome = "João")
2. **Comportamento** - capacidade de executar métodos (depositar, sacar)
3. **Identidade** - endereço único na memória que o diferencia de outros objetos

**Analogia**: Se classe é a **receita de bolo**, objeto é o **bolo feito**. A receita (classe) é abstrata e teórica, o bolo (objeto) é concreto e você pode comê-lo. Você pode fazer **vários bolos** (objetos) da **mesma receita** (classe), e cada bolo terá:
- **Estado**: sabor chocolate ou morango, tamanho grande ou pequeno
- **Comportamento**: pode ser cortado, decorado, embalado
- **Identidade**: este bolo específico na mesa (não confunde com outro)

**Definição formal**:
```
OBJETO = Instância de classe com:
  - Estado (valores de atributos)
  - Comportamento (métodos executáveis)
  - Identidade (referência única na memória)
```

**Exemplo fundamental**:
```java
// CLASSE - molde abstrato
public class Cachorro {
    // Atributos (estrutura)
    String nome;
    String raca;
    int idade;
    
    // Métodos (comportamento)
    void latir() {
        System.out.println(nome + " diz: Au au!");
    }
    
    void comer(String alimento) {
        System.out.println(nome + " está comendo " + alimento);
    }
}

// OBJETOS - instâncias concretas
Cachorro rex = new Cachorro();  // ← Objeto 1 criado
rex.nome = "Rex";               // Estado específico
rex.raca = "Labrador";
rex.idade = 3;

Cachorro bob = new Cachorro();  // ← Objeto 2 criado
bob.nome = "Bob";               // Estado diferente
bob.raca = "Poodle";
bob.idade = 5;

// ESTADO - cada objeto tem valores próprios
System.out.println(rex.nome);  // "Rex"
System.out.println(bob.nome);  // "Bob"

// COMPORTAMENTO - cada objeto executa métodos
rex.latir();  // "Rex diz: Au au!"
bob.latir();  // "Bob diz: Au au!"

// IDENTIDADE - objetos diferentes na memória
System.out.println(rex);  // Cachorro@15db9742 (endereço na memória)
System.out.println(bob);  // Cachorro@6d06d69c (endereço diferente)
```

**Características essenciais de um objeto**:
1. **Criado com `new`** - operador que aloca memória
2. **Vive na heap** - área de memória dinâmica
3. **Referenciado por variável** - ponteiro para memória
4. **Estado mutável** - atributos podem mudar
5. **Comportamento executável** - pode chamar métodos
6. **Garbage collected** - removido quando não há mais referências

## 📋 Fundamentos Teóricos

### 1️⃣ Criação de Objetos - Operador `new`

**Sintaxe**:
```java
NomeDaClasse nomeVariavel = new NomeDaClasse();
//     ↓              ↓         ↓         ↓
//   Tipo         Variável   Operador  Construtor
```

**Exemplo completo**:
```java
public class Pessoa {
    String nome;
    int idade;
    
    public Pessoa() {
        // Construtor padrão
    }
}

// Criação de objeto - 3 etapas
Pessoa pessoa = new Pessoa();
//  1. Declaração: Pessoa pessoa
//  2. Instanciação: new Pessoa()
//  3. Atribuição: pessoa = (referência)

// Etapa 1: Declaração de variável
Pessoa pessoa;  // Variável declarada (null)

// Etapa 2: Instanciação - cria objeto na memória
new Pessoa();   // Objeto criado na heap

// Etapa 3: Atribuição - variável aponta para objeto
pessoa = new Pessoa();  // Variável recebe referência

// Normalmente feito em uma linha
Pessoa p = new Pessoa();
```

**O que acontece com `new`**:
```java
Produto produto = new Produto();

// PASSO 1: Aloca memória na heap
// ┌─────────────────┐
// │ Heap            │
// ├─────────────────┤
// │ Produto@1a2b    │  ← Espaço alocado
// │ nome: null      │
// │ preco: 0.0      │
// └─────────────────┘

// PASSO 2: Chama construtor
// Inicializa atributos

// PASSO 3: Retorna referência
// produto = referência para Produto@1a2b
```

**Múltiplas criações**:
```java
// Cada 'new' cria NOVO objeto
Carro carro1 = new Carro();  // Objeto 1 na memória
Carro carro2 = new Carro();  // Objeto 2 na memória (diferente)
Carro carro3 = new Carro();  // Objeto 3 na memória (diferente)

// 3 objetos independentes na heap
carro1.marca = "Toyota";
carro2.marca = "Honda";
carro3.marca = "Ford";

// Cada um com seu próprio estado
```

### 2️⃣ Estado do Objeto - Valores de Atributos

**Conceito**: Estado é o conjunto de **valores atuais** dos atributos.

**Exemplo**:
```java
public class ContaBancaria {
    String numero;
    String titular;
    double saldo;
    boolean ativa;
}

// Objeto 1 - Estado A
ContaBancaria conta1 = new ContaBancaria();
conta1.numero = "001";
conta1.titular = "João Silva";
conta1.saldo = 1000.0;
conta1.ativa = true;

// ESTADO do objeto conta1:
// numero = "001"
// titular = "João Silva"
// saldo = 1000.0
// ativa = true

// Objeto 2 - Estado B (diferente)
ContaBancaria conta2 = new ContaBancaria();
conta2.numero = "002";
conta2.titular = "Maria Santos";
conta2.saldo = 2500.0;
conta2.ativa = true;

// ESTADO do objeto conta2:
// numero = "002"
// titular = "Maria Santos"
// saldo = 2500.0
// ativa = true

// Mesma classe, estados diferentes
```

**Estado muda ao longo do tempo**:
```java
Produto produto = new Produto();

// Estado inicial
produto.nome = "Notebook";
produto.preco = 3000.0;
produto.estoque = 10;
// Estado: {nome: "Notebook", preco: 3000.0, estoque: 10}

// Operação altera estado
produto.preco = 2800.0;  // Mudança de estado
// Estado: {nome: "Notebook", preco: 2800.0, estoque: 10}

// Outra operação
produto.estoque = 8;     // Mudança de estado
// Estado: {nome: "Notebook", preco: 2800.0, estoque: 8}

// Objeto é o MESMO, mas estado EVOLUI
```

**Visualização de estado**:
```
Tempo T1:
┌────────────────┐
│ Produto@1a2b   │
├────────────────┤
│ nome: "Mouse"  │
│ preco: 50.0    │
│ estoque: 100   │
└────────────────┘

  ↓ produto.estoque -= 10

Tempo T2:
┌────────────────┐
│ Produto@1a2b   │  ← Mesmo objeto
├────────────────┤
│ nome: "Mouse"  │
│ preco: 50.0    │
│ estoque: 90    │  ← Estado mudou
└────────────────┘
```

### 3️⃣ Comportamento do Objeto - Métodos

**Conceito**: Comportamento são **ações que o objeto pode executar** através de métodos.

**Exemplo**:
```java
public class Elevador {
    int andarAtual;
    int capacidade;
    int pessoasDentro;
    
    // COMPORTAMENTOS
    void subir() {
        this.andarAtual++;
        System.out.println("Subindo para andar " + andarAtual);
    }
    
    void descer() {
        if (this.andarAtual > 0) {
            this.andarAtual--;
            System.out.println("Descendo para andar " + andarAtual);
        }
    }
    
    boolean entrar(int pessoas) {
        if (this.pessoasDentro + pessoas <= this.capacidade) {
            this.pessoasDentro += pessoas;
            System.out.println(pessoas + " pessoa(s) entraram");
            return true;
        }
        System.out.println("Capacidade excedida");
        return false;
    }
    
    void sair(int pessoas) {
        this.pessoasDentro = Math.max(0, this.pessoasDentro - pessoas);
        System.out.println(pessoas + " pessoa(s) saíram");
    }
}

// OBJETO executando comportamentos
Elevador elevador = new Elevador();
elevador.andarAtual = 0;
elevador.capacidade = 8;
elevador.pessoasDentro = 0;

// Chamada de métodos (comportamento)
elevador.entrar(5);   // "5 pessoa(s) entraram"
elevador.subir();     // "Subindo para andar 1"
elevador.subir();     // "Subindo para andar 2"
elevador.sair(2);     // "2 pessoa(s) saíram"
elevador.descer();    // "Descendo para andar 1"

// Comportamento modifica estado
System.out.println(elevador.andarAtual);      // 1
System.out.println(elevador.pessoasDentro);   // 3
```

**Métodos acessam estado do próprio objeto**:
```java
public class Livro {
    String titulo;
    String autor;
    int paginaAtual;
    int totalPaginas;
    
    void abrirNaPagina(int pagina) {
        if (pagina >= 1 && pagina <= this.totalPaginas) {
            this.paginaAtual = pagina;  // Acessa atributo do objeto
            System.out.println("Aberto na página " + this.paginaAtual);
        }
    }
    
    void proximaPagina() {
        if (this.paginaAtual < this.totalPaginas) {
            this.paginaAtual++;  // Modifica atributo do objeto
        }
    }
    
    void exibirInfo() {
        // Acessa múltiplos atributos do objeto
        System.out.println("Livro: " + this.titulo);
        System.out.println("Autor: " + this.autor);
        System.out.println("Página: " + this.paginaAtual + "/" + this.totalPaginas);
    }
}

Livro livro = new Livro();
livro.titulo = "Clean Code";
livro.totalPaginas = 464;
livro.paginaAtual = 1;

livro.abrirNaPagina(50);   // Método acessa livro.paginaAtual
livro.proximaPagina();      // Método modifica livro.paginaAtual
livro.exibirInfo();         // Método lê vários atributos
```

### 4️⃣ Identidade do Objeto - Referência na Memória

**Conceito**: Cada objeto tem **identidade única** - endereço na memória.

**Referência de memória**:
```java
Pessoa p1 = new Pessoa();
Pessoa p2 = new Pessoa();
Pessoa p3 = new Pessoa();

// Cada objeto tem identidade única
System.out.println(p1);  // Pessoa@15db9742
System.out.println(p2);  // Pessoa@6d06d69c
System.out.println(p3);  // Pessoa@7852e922

// @15db9742 = hash do endereço de memória (identidade)
```

**Comparação de identidade**:
```java
Produto prod1 = new Produto();
prod1.nome = "Mouse";
prod1.preco = 50;

Produto prod2 = new Produto();
prod2.nome = "Mouse";
prod2.preco = 50;

// ESTADO é igual (mesmos valores)
System.out.println(prod1.nome.equals(prod2.nome));  // true
System.out.println(prod1.preco == prod2.preco);     // true

// IDENTIDADE é diferente (objetos diferentes)
System.out.println(prod1 == prod2);  // false ← diferentes na memória

// Mesmo com valores iguais, são OBJETOS DISTINTOS
```

**Mesma referência**:
```java
Pessoa p1 = new Pessoa();
p1.nome = "João";

Pessoa p2 = p1;  // p2 aponta para MESMO objeto que p1

// MESMA IDENTIDADE
System.out.println(p1 == p2);  // true ← mesmo objeto

// Mudança via p2 afeta p1 (mesmo objeto)
p2.nome = "Maria";
System.out.println(p1.nome);  // "Maria" ← mudou!

// p1 e p2 são referências para o MESMO objeto
```

**Visualização**:
```
OBJETOS DIFERENTES:
┌──────┐        ┌──────────────┐
│ prod1│───────→│ Produto@1a2b │
└──────┘        │ nome: "Mouse"│
                │ preco: 50    │
                └──────────────┘

┌──────┐        ┌──────────────┐
│ prod2│───────→│ Produto@3c4d │  ← Outro objeto
└──────┘        │ nome: "Mouse"│
                │ preco: 50    │
                └──────────────┘

MESMA REFERÊNCIA:
┌──────┐  ┌───→ ┌──────────────┐
│  p1  │──┘     │ Pessoa@5e6f  │
└──────┘        │ nome: "Maria"│
┌──────┐  └───→ └──────────────┘
│  p2  │──┘       ↑ Mesmo objeto
└──────┘
```

### 5️⃣ Ciclo de Vida do Objeto

**Fases**:
1. **Declaração** - variável criada
2. **Instanciação** - objeto alocado na heap
3. **Inicialização** - construtor executado
4. **Uso** - métodos chamados, estado modificado
5. **Dereferenciamento** - nenhuma variável aponta para objeto
6. **Garbage Collection** - memória liberada

**Exemplo completo**:
```java
// FASE 1: Declaração
Produto produto;  // Variável criada (null)

// FASE 2: Instanciação
produto = new Produto();  // Objeto criado na heap

// FASE 3: Inicialização (via construtor)
// Construtor executado automaticamente

// FASE 4: Uso
produto.nome = "Mouse";
produto.preco = 50;
produto.exibirInfo();
produto.aplicarDesconto(10);

// FASE 5: Dereferenciamento
produto = null;  // Nenhuma referência aponta para objeto

// FASE 6: Garbage Collection
// Java remove objeto da memória automaticamente
```

**Múltiplas referências**:
```java
Carro carro1 = new Carro();  // Objeto criado
carro1.modelo = "Civic";

Carro carro2 = carro1;  // 2 referências para MESMO objeto
Carro carro3 = carro1;  // 3 referências para MESMO objeto

// Objeto só é removido quando TODAS as referências forem null
carro1 = null;  // Ainda 2 referências (carro2, carro3)
carro2 = null;  // Ainda 1 referência (carro3)
carro3 = null;  // 0 referências → Garbage Collection!
```

### 6️⃣ Interação entre Objetos

**Conceito**: Objetos **colaboram** chamando métodos uns dos outros.

**Exemplo**:
```java
public class Cliente {
    String nome;
    String cpf;
    
    void fazerPedido(Pedido pedido) {
        System.out.println(this.nome + " fez pedido #" + pedido.numero);
    }
}

public class Pedido {
    int numero;
    double valorTotal;
    Cliente cliente;
    
    void processar() {
        System.out.println("Processando pedido #" + this.numero);
        System.out.println("Cliente: " + this.cliente.nome);
        System.out.println("Valor: R$ " + this.valorTotal);
    }
}

// OBJETOS INTERAGINDO
Cliente joao = new Cliente();
joao.nome = "João Silva";
joao.cpf = "123.456.789-00";

Pedido pedido = new Pedido();
pedido.numero = 1001;
pedido.valorTotal = 500.0;
pedido.cliente = joao;  // Pedido conhece Cliente

joao.fazerPedido(pedido);  // Cliente interage com Pedido
pedido.processar();         // Pedido acessa dados de Cliente
```

**Colaboração complexa**:
```java
public class Biblioteca {
    List<Livro> acervo;
    
    void emprestar(Livro livro, Usuario usuario) {
        if (livro.disponivel) {
            livro.emprestar();
            usuario.receberLivro(livro);
        }
    }
}

public class Livro {
    String titulo;
    boolean disponivel;
    
    void emprestar() {
        this.disponivel = false;
    }
}

public class Usuario {
    List<Livro> livrosEmprestados;
    
    void receberLivro(Livro livro) {
        this.livrosEmprestados.add(livro);
    }
}

// Objetos colaborando
Biblioteca biblioteca = new Biblioteca();
Livro livro = new Livro();
livro.titulo = "Clean Code";
livro.disponivel = true;

Usuario usuario = new Usuario();

biblioteca.emprestar(livro, usuario);
// Biblioteca orquestra interação entre Livro e Usuario
```

### 7️⃣ Objetos como Parâmetros e Retornos

**Parâmetros**:
```java
public class CalculadoraPreco {
    double calcularTotal(Produto produto, int quantidade) {
        return produto.preco * quantidade;
    }
    
    double calcularComDesconto(Produto produto, Cupom cupom) {
        double valorOriginal = produto.preco;
        double desconto = cupom.percentual / 100.0;
        return valorOriginal * (1 - desconto);
    }
}

// Passando objetos como argumentos
Produto notebook = new Produto();
notebook.preco = 3000;

Cupom cupom10 = new Cupom();
cupom10.percentual = 10;

CalculadoraPreco calc = new CalculadoraPreco();
double total = calc.calcularTotal(notebook, 2);  // Passa objeto
double comDesconto = calc.calcularComDesconto(notebook, cupom10);
```

**Retornos**:
```java
public class PedidoFactory {
    Pedido criarPedido(Cliente cliente) {
        Pedido pedido = new Pedido();  // Cria objeto
        pedido.cliente = cliente;
        pedido.data = LocalDateTime.now();
        return pedido;  // Retorna objeto criado
    }
}

// Recebendo objeto como retorno
PedidoFactory factory = new PedidoFactory();
Cliente joao = new Cliente();

Pedido pedidoNovo = factory.criarPedido(joao);  // Recebe objeto
pedidoNovo.adicionarItem(produto);
```

### 8️⃣ Coleções de Objetos

**Arrays**:
```java
// Array de objetos
Produto[] produtos = new Produto[3];

produtos[0] = new Produto();
produtos[0].nome = "Mouse";

produtos[1] = new Produto();
produtos[1].nome = "Teclado";

produtos[2] = new Produto();
produtos[2].nome = "Monitor";

// Iteração
for (Produto p : produtos) {
    System.out.println(p.nome);
}
```

**Listas**:
```java
List<Cliente> clientes = new ArrayList<>();

Cliente c1 = new Cliente();
c1.nome = "João";
clientes.add(c1);

Cliente c2 = new Cliente();
c2.nome = "Maria";
clientes.add(c2);

// Acesso
for (Cliente cliente : clientes) {
    System.out.println(cliente.nome);
}
```

### 9️⃣ Encapsulamento de Estado

**Conceito**: Objetos **escondem** estado interno.

**Exemplo**:
```java
public class ContaBancaria {
    private double saldo;  // Estado privado
    
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;  // Modifica estado interno
        }
    }
    
    public double getSaldo() {
        return this.saldo;  // Expõe estado (read-only)
    }
}

// Objeto protege seu estado
ContaBancaria conta = new ContaBancaria();
conta.depositar(1000);
// conta.saldo = -500;  // ❌ Não compila - saldo é private

double valor = conta.getSaldo();  // ✓ Acesso controlado
```

### 🔟 Comparação de Objetos

**Por referência (==)**:
```java
Pessoa p1 = new Pessoa();
p1.nome = "João";

Pessoa p2 = new Pessoa();
p2.nome = "João";

// Compara identidade (referências)
System.out.println(p1 == p2);  // false - objetos diferentes
```

**Por conteúdo (equals)**:
```java
public class Pessoa {
    String nome;
    
    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Pessoa) {
            Pessoa outra = (Pessoa) obj;
            return this.nome.equals(outra.nome);
        }
        return false;
    }
}

Pessoa p1 = new Pessoa();
p1.nome = "João";

Pessoa p2 = new Pessoa();
p2.nome = "João";

// Compara conteúdo
System.out.println(p1.equals(p2));  // true - mesmo nome
```

## 🎯 Aplicabilidade

**1. Representar entidades do mundo real**
**2. Armazenar estado mutável**
**3. Encapsular lógica de negócio**
**4. Colaboração entre componentes**
**5. Modelagem de domínio**

## ⚠️ Armadilhas Comuns

**1. Esquecer de instanciar**:
```java
Pessoa p;
p.nome = "João";  // ❌ NullPointerException
```

**2. Confundir `==` com `equals`**:
```java
String s1 = new String("texto");
String s2 = new String("texto");
s1 == s2;  // false - objetos diferentes
s1.equals(s2);  // true - conteúdo igual
```

**3. Modificar objetos compartilhados**:
```java
List<String> lista = Arrays.asList("A", "B");
lista.add("C");  // ❌ UnsupportedOperationException
```

**4. Memory leak com referências**:
```java
static List<Objeto> cache = new ArrayList<>();
cache.add(objeto);  // Nunca remove - leak!
```

**5. Mutabilidade não controlada**:
```java
public List<Item> getItens() {
    return itens;  // ❌ Expõe lista interna
}
```

## ✅ Boas Práticas

**1. Sempre inicializar**:
```java
Pessoa p = new Pessoa();  // ✓
```

**2. Encapsular estado**:
```java
private double saldo;
public double getSaldo() { }
```

**3. Validar no construtor**:
```java
public Produto(String nome) {
    if (nome == null) throw new IllegalArgumentException();
    this.nome = nome;
}
```

**4. Implementar equals/hashCode quando necessário**:
```java
@Override
public boolean equals(Object obj) { }
```

**5. Imutabilidade quando apropriado**:
```java
public final class Cpf {
    private final String numero;
}
```

## 📚 Resumo Executivo

**Objeto = instância de classe**.

**Criação**:
```java
NomeDaClasse obj = new NomeDaClasse();
```

**Componentes**:
- **Estado**: valores de atributos
- **Comportamento**: métodos executáveis
- **Identidade**: referência na memória

**Características**:
- Criado com `new`
- Vive na heap
- Tem ciclo de vida
- Garbage collected

**Interação**:
```java
objeto1.metodo(objeto2);  // Objetos colaboram
```

**Comparação**:
- `==` compara identidade
- `equals()` compara conteúdo

**Ciclo de vida**:
1. Declaração
2. Instanciação (new)
3. Inicialização (construtor)
4. Uso
5. Dereferenciamento
6. Garbage Collection

**Recomendação**: Objetos são **entidades concretas** com **estado e comportamento**. **Encapsule** dados, **valide** no construtor, **gerencie** ciclo de vida adequadamente.