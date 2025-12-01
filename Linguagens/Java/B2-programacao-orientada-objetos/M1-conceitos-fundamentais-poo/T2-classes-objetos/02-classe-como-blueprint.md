# Classe como Blueprint (Molde)

## 🎯 Introdução e Definição

**Classe como blueprint** é a metáfora central da POO - uma classe é como uma **planta arquitetônica, molde industrial ou receita** que define **estrutura e especificações** sem ser o produto final. O blueprint **descreve o que será construído**, mas **não é a construção em si**.

**Conceito central**: Blueprint (classe) **especifica**, objeto **materializa**. Um blueprint de casa mostra **quantos quartos, onde ficam portas, dimensões de janelas** - mas você não mora no blueprint, mora na **casa construída** (objeto). Da mesma forma, classe **define atributos e métodos**, mas são os **objetos criados** que realmente armazenam dados e executam ações.

**Analogia industrial**:
- **Blueprint de carro**: especifica motor 2.0, 4 portas, cor variável
- **Carros fabricados**: cada um com motor 2.0, 4 portas, mas cores diferentes (vermelho, azul, preto)
- **Resultado**: mesma especificação (classe), produtos individuais (objetos)

**Metáforas equivalentes**:
1. **Planta arquitetônica** → Casa construída
2. **Receita de bolo** → Bolos feitos
3. **Molde de biscoito** → Biscoitos cortados
4. **Formulário em branco** → Formulários preenchidos
5. **DNA** → Organismos vivos

**Exemplo fundamental**:
```java
// BLUEPRINT (Classe) - especificação
public class Carro {
    // ESPECIFICAÇÕES - o que TODO carro terá
    String marca;
    String modelo;
    int ano;
    String cor;
    double velocidade;
    boolean ligado;
    
    // ESPECIFICAÇÕES - o que TODO carro poderá fazer
    void ligar() {
        if (!this.ligado) {
            this.ligado = true;
            this.velocidade = 0;
            System.out.println(marca + " " + modelo + " ligado");
        }
    }
    
    void acelerar(double incremento) {
        if (this.ligado) {
            this.velocidade += incremento;
            System.out.println("Velocidade: " + velocidade + " km/h");
        }
    }
    
    void frear(double decremento) {
        this.velocidade = Math.max(0, this.velocidade - decremento);
        System.out.println("Velocidade: " + velocidade + " km/h");
    }
    
    void desligar() {
        if (this.ligado && this.velocidade == 0) {
            this.ligado = false;
            System.out.println(marca + " " + modelo + " desligado");
        }
    }
}

// PRODUTOS (Objetos) - instâncias do blueprint
Carro carro1 = new Carro();
carro1.marca = "Toyota";
carro1.modelo = "Corolla";
carro1.ano = 2023;
carro1.cor = "Preto";

Carro carro2 = new Carro();
carro2.marca = "Honda";
carro2.modelo = "Civic";
carro2.ano = 2024;
carro2.cor = "Branco";

Carro carro3 = new Carro();
carro3.marca = "Ford";
carro3.modelo = "Fusion";
carro3.ano = 2022;
carro3.cor = "Azul";

// MESMA ESPECIFICAÇÃO (classe Carro)
// PRODUTOS DIFERENTES (carro1, carro2, carro3)
carro1.ligar();
carro1.acelerar(60);  // Corolla a 60 km/h

carro2.ligar();
carro2.acelerar(80);  // Civic a 80 km/h

// Cada objeto segue o blueprint, mas com estado próprio
```

**Características do blueprint**:
1. **Define estrutura** - quais atributos existirão
2. **Define comportamento** - quais métodos estarão disponíveis
3. **Define tipo** - cria novo tipo de dado
4. **Não armazena dados** - apenas especifica
5. **Permite múltiplas instâncias** - muitos objetos de uma classe

## 📋 Fundamentos Teóricos

### 1️⃣ Blueprint Define Estrutura

**Conceito**: Classe especifica **quais atributos** cada objeto terá.

**Exemplo - Livro**:
```java
// BLUEPRINT - especifica estrutura de TODO livro
public class Livro {
    // Estrutura definida - todo livro terá:
    String titulo;           // Obrigatório
    String autor;            // Obrigatório
    String isbn;             // Código único
    int anoPublicacao;       // Ano de lançamento
    int numeroPaginas;       // Quantidade de páginas
    double preco;            // Preço de venda
    String editora;          // Editora responsável
    boolean disponivel;      // Se está disponível
}

// OBJETOS criados seguindo o blueprint
Livro livro1 = new Livro();
livro1.titulo = "Clean Code";
livro1.autor = "Robert Martin";
livro1.isbn = "978-0132350884";
livro1.anoPublicacao = 2008;
livro1.numeroPaginas = 464;
livro1.preco = 89.90;
livro1.editora = "Prentice Hall";
livro1.disponivel = true;

Livro livro2 = new Livro();
livro2.titulo = "Design Patterns";
livro2.autor = "Gang of Four";
livro2.isbn = "978-0201633610";
livro2.anoPublicacao = 1994;
livro2.numeroPaginas = 395;
livro2.preco = 95.00;
livro2.editora = "Addison-Wesley";
livro2.disponivel = false;

// Mesma ESTRUTURA (blueprint), DADOS diferentes
System.out.println(livro1.titulo);  // "Clean Code"
System.out.println(livro2.titulo);  // "Design Patterns"
```

**Blueprint garante uniformidade**:
```java
// TODO objeto Livro terá os mesmos campos
Livro l1 = new Livro();  // tem titulo, autor, isbn, etc.
Livro l2 = new Livro();  // tem titulo, autor, isbn, etc.
Livro l3 = new Livro();  // tem titulo, autor, isbn, etc.

// Você pode confiar que QUALQUER Livro terá estes atributos
void exibirLivro(Livro livro) {
    System.out.println(livro.titulo);  // ✓ Sempre existe
    System.out.println(livro.autor);   // ✓ Sempre existe
    // Blueprint garante que esses atributos existem
}
```

### 2️⃣ Blueprint Define Comportamento

**Conceito**: Classe especifica **quais métodos** cada objeto poderá executar.

**Exemplo - ContaBancaria**:
```java
// BLUEPRINT - define o que TODA conta poderá fazer
public class ContaBancaria {
    private String numero;
    private String titular;
    private double saldo;
    
    // COMPORTAMENTOS definidos - toda conta poderá:
    
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;
            System.out.println("Depósito: R$ " + valor);
            System.out.println("Saldo atual: R$ " + saldo);
        }
    }
    
    public boolean sacar(double valor) {
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor;
            System.out.println("Saque: R$ " + valor);
            System.out.println("Saldo atual: R$ " + saldo);
            return true;
        }
        System.out.println("Saque negado");
        return false;
    }
    
    public void transferir(ContaBancaria destino, double valor) {
        if (this.sacar(valor)) {
            destino.depositar(valor);
            System.out.println("Transferência realizada");
        }
    }
    
    public double consultarSaldo() {
        return this.saldo;
    }
    
    public void exibirExtrato() {
        System.out.println("=== EXTRATO ===");
        System.out.println("Conta: " + numero);
        System.out.println("Titular: " + titular);
        System.out.println("Saldo: R$ " + saldo);
    }
}

// OBJETOS com comportamentos definidos
ContaBancaria conta1 = new ContaBancaria();
conta1.numero = "001";
conta1.titular = "João Silva";

ContaBancaria conta2 = new ContaBancaria();
conta2.numero = "002";
conta2.titular = "Maria Santos";

// TODOS os objetos ContaBancaria podem:
conta1.depositar(1000);     // ✓ Método definido no blueprint
conta2.depositar(500);      // ✓ Método definido no blueprint
conta1.sacar(200);          // ✓ Método definido no blueprint
conta1.transferir(conta2, 300);  // ✓ Método definido no blueprint
conta1.exibirExtrato();     // ✓ Método definido no blueprint

// Blueprint garante que estes métodos existem
```

**Blueprint como contrato**:
```java
// Se você tem uma referência do tipo Pessoa
Pessoa pessoa = new Pessoa();

// Pode CONFIAR que estes métodos existem (blueprint garante)
pessoa.exibir();
pessoa.fazerAniversario();
pessoa.isMaiorDeIdade();

// Não precisa verificar "pessoa tem método exibir?"
// Blueprint já garante isso!
```

### 3️⃣ Blueprint vs Instância - Memória

**Conceito**: Blueprint (classe) existe em **código**, instâncias (objetos) existem em **memória**.

**Visualização**:
```
CÓDIGO (arquivo .java) - BLUEPRINT:
┌────────────────────────────────┐
│ public class Produto {         │
│   String nome;                 │
│   double preco;                │
│   int estoque;                 │
│                                │
│   void vender(int qtd) {       │
│     estoque -= qtd;            │
│   }                            │
│ }                              │
└────────────────────────────────┘
        ↓ new Produto()
        
MEMÓRIA (heap) - INSTÂNCIAS:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Produto@1a2b     │  │ Produto@3c4d     │  │ Produto@5e6f     │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ nome: "Notebook" │  │ nome: "Mouse"    │  │ nome: "Teclado"  │
│ preco: 3000.0    │  │ preco: 50.0      │  │ preco: 150.0     │
│ estoque: 10      │  │ estoque: 100     │  │ estoque: 50      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
    p1 ───────────┘      p2 ───────────┘      p3 ───────────┘
```

**Código demonstrativo**:
```java
// Blueprint define ESTRUTURA
public class Produto {
    String nome;
    double preco;
    int estoque;
    
    void exibir() {
        System.out.println(nome + " - R$ " + preco + " (" + estoque + " unidades)");
    }
}

// Criação de INSTÂNCIAS na memória
Produto p1 = new Produto();  // Objeto 1 criado na heap
p1.nome = "Notebook";
p1.preco = 3000;
p1.estoque = 10;

Produto p2 = new Produto();  // Objeto 2 criado na heap
p2.nome = "Mouse";
p2.preco = 50;
p2.estoque = 100;

Produto p3 = new Produto();  // Objeto 3 criado na heap
p3.nome = "Teclado";
p3.preco = 150;
p3.estoque = 50;

// 1 BLUEPRINT (código) → 3 INSTÂNCIAS (memória)
p1.exibir();  // "Notebook - R$ 3000.0 (10 unidades)"
p2.exibir();  // "Mouse - R$ 50.0 (100 unidades)"
p3.exibir();  // "Teclado - R$ 150.0 (50 unidades)"
```

**Diferença crucial**:
```java
// Classe (blueprint) - NÃO tem dados
// É apenas a DEFINIÇÃO
class Pessoa {
    String nome;  // Especifica que haverá um nome
    int idade;    // Especifica que haverá uma idade
}

// Objetos (instâncias) - TÊM dados
Pessoa p1 = new Pessoa();
p1.nome = "João";   // Dados reais armazenados
p1.idade = 30;      // Dados reais armazenados

Pessoa p2 = new Pessoa();
p2.nome = "Maria";  // Outros dados
p2.idade = 25;      // Outros dados
```

### 4️⃣ Múltiplos Objetos do Mesmo Blueprint

**Conceito**: Um blueprint pode gerar **infinitos objetos**.

**Exemplo - Pedido**:
```java
// BLUEPRINT único
public class Pedido {
    int numero;
    String cliente;
    double valorTotal;
    LocalDateTime data;
    
    public Pedido(int numero, String cliente) {
        this.numero = numero;
        this.cliente = cliente;
        this.data = LocalDateTime.now();
        this.valorTotal = 0.0;
    }
    
    void adicionarValor(double valor) {
        this.valorTotal += valor;
    }
    
    void exibir() {
        System.out.println("Pedido #" + numero);
        System.out.println("Cliente: " + cliente);
        System.out.println("Total: R$ " + valorTotal);
        System.out.println("Data: " + data);
    }
}

// MUITOS objetos criados do mesmo blueprint
Pedido pedido1 = new Pedido(1001, "João Silva");
pedido1.adicionarValor(500);

Pedido pedido2 = new Pedido(1002, "Maria Santos");
pedido2.adicionarValor(750);

Pedido pedido3 = new Pedido(1003, "Pedro Costa");
pedido3.adicionarValor(1200);

Pedido pedido4 = new Pedido(1004, "Ana Lima");
pedido4.adicionarValor(300);

// 1 blueprint Pedido → 4 objetos Pedido
// Todos compartilham estrutura, mas têm dados independentes

pedido1.exibir();
pedido2.exibir();
pedido3.exibir();
pedido4.exibir();

// Cada um com seu próprio número, cliente, valorTotal, data
```

**Cenário real - e-commerce**:
```java
// Blueprint Produto
public class Produto {
    private String nome;
    private double preco;
    private String categoria;
    
    public Produto(String nome, double preco, String categoria) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
    }
}

// Sistema pode ter MILHARES de produtos
Produto[] catalogo = new Produto[1000];

catalogo[0] = new Produto("Notebook Dell", 3500, "Informática");
catalogo[1] = new Produto("Mouse Logitech", 80, "Informática");
catalogo[2] = new Produto("Teclado Mecânico", 350, "Informática");
catalogo[3] = new Produto("Monitor LG 24\"", 900, "Informática");
// ... 996 produtos mais

// UM blueprint (classe Produto)
// MIL objetos (produtos individuais no catálogo)
```

### 5️⃣ Blueprint Define Tipo

**Conceito**: Classe cria um **novo tipo de dado** que pode ser usado como `int`, `String`, etc.

**Tipos primitivos vs Tipos de classe**:
```java
// TIPOS PRIMITIVOS (built-in do Java)
int numero = 10;
double preco = 99.90;
boolean ativo = true;
char letra = 'A';

// TIPOS DE CLASSE (definidos pelo desenvolvedor)
Pessoa pessoa = new Pessoa();
Carro carro = new Carro();
Produto produto = new Produto();

// "Pessoa", "Carro", "Produto" agora são TIPOS
// Como "int", "double", "boolean"
```

**Usando classe como tipo**:
```java
public class Endereco {
    String rua;
    String cidade;
    String estado;
    String cep;
}

public class Cliente {
    String nome;
    String cpf;
    Endereco endereco;  // ← Endereco é um TIPO (blueprint)
    
    public Cliente(String nome, String cpf) {
        this.nome = nome;
        this.cpf = cpf;
        this.endereco = new Endereco();  // Instancia o tipo
    }
}

// Uso
Cliente cliente = new Cliente("João", "123.456.789-00");
cliente.endereco.rua = "Av. Paulista, 1000";
cliente.endereco.cidade = "São Paulo";
cliente.endereco.estado = "SP";
cliente.endereco.cep = "01310-100";
```

**Métodos recebem tipos de classe**:
```java
public class PedidoService {
    // Método recebe TIPO Cliente (blueprint)
    public void processar(Cliente cliente, Produto produto, int quantidade) {
        System.out.println("Processando pedido para: " + cliente.nome);
        System.out.println("Produto: " + produto.nome);
        System.out.println("Quantidade: " + quantidade);
    }
}

// Uso
Cliente joao = new Cliente("João", "123");
Produto notebook = new Produto("Notebook", 3000);

PedidoService service = new PedidoService();
service.processar(joao, notebook, 1);  // Passa objetos como argumentos
```

**Arrays de tipos de classe**:
```java
// Array de TIPO Livro
Livro[] biblioteca = new Livro[100];

biblioteca[0] = new Livro();
biblioteca[0].titulo = "Clean Code";

biblioteca[1] = new Livro();
biblioteca[1].titulo = "Design Patterns";

// Lista de TIPO Produto
List<Produto> carrinho = new ArrayList<>();
carrinho.add(new Produto("Mouse", 50));
carrinho.add(new Produto("Teclado", 150));
```

### 6️⃣ Blueprint com Validação

**Conceito**: Blueprint pode incluir **regras de negócio** que todos os objetos seguirão.

**Exemplo com validação**:
```java
// BLUEPRINT com regras de validação
public class ContaBancaria {
    private String numero;
    private String titular;
    private double saldo;
    private static final double SALDO_MINIMO = 0.0;
    
    public ContaBancaria(String numero, String titular) {
        if (numero == null || numero.trim().isEmpty()) {
            throw new IllegalArgumentException("Número da conta inválido");
        }
        if (titular == null || titular.trim().isEmpty()) {
            throw new IllegalArgumentException("Titular inválido");
        }
        
        this.numero = numero;
        this.titular = titular;
        this.saldo = 0.0;
    }
    
    // Blueprint define REGRA: depósito deve ser positivo
    public void depositar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        this.saldo += valor;
    }
    
    // Blueprint define REGRA: saque não pode deixar saldo negativo
    public boolean sacar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        if (this.saldo - valor < SALDO_MINIMO) {
            return false;  // Saque negado
        }
        this.saldo -= valor;
        return true;
    }
}

// TODOS os objetos seguem as regras do blueprint
ContaBancaria conta1 = new ContaBancaria("001", "João");
conta1.depositar(1000);  // ✓ OK
// conta1.depositar(-100);  // ❌ Exceção - regra do blueprint

conta1.sacar(500);  // ✓ OK
conta1.sacar(600);  // ✗ Negado - regra do blueprint (saldo insuficiente)
```

**Blueprint protege invariantes**:
```java
public class Produto {
    private String nome;
    private double preco;
    private int estoque;
    
    // Blueprint GARANTE: preço nunca será negativo
    public void setPreco(double preco) {
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }
        this.preco = preco;
    }
    
    // Blueprint GARANTE: estoque nunca será negativo
    public boolean vender(int quantidade) {
        if (quantidade > this.estoque) {
            return false;  // Venda negada
        }
        this.estoque -= quantidade;
        return true;
    }
}

// TODOS os produtos respeitam estas garantias
Produto p = new Produto();
// p.setPreco(-10);  // ❌ Exceção
p.setPreco(100);     // ✓ OK
```

### 7️⃣ Herança de Blueprints

**Conceito**: Blueprint pode **estender** outro blueprint.

**Exemplo**:
```java
// BLUEPRINT base
public class Veiculo {
    protected String marca;
    protected String modelo;
    protected int ano;
    
    public void ligar() {
        System.out.println("Veículo ligado");
    }
    
    public void desligar() {
        System.out.println("Veículo desligado");
    }
}

// BLUEPRINT especializado - ESTENDE blueprint Veiculo
public class Carro extends Veiculo {
    private int numeroPortas;
    
    public void abrirPortaMalas() {
        System.out.println("Porta-malas aberto");
    }
}

// BLUEPRINT especializado - ESTENDE blueprint Veiculo
public class Moto extends Veiculo {
    private boolean temBagageiro;
    
    public void empinar() {
        System.out.println("Empinando!");
    }
}

// Objetos criados dos blueprints especializados
Carro carro = new Carro();
carro.marca = "Toyota";      // ✓ Herdado de Veiculo
carro.ligar();               // ✓ Herdado de Veiculo
carro.abrirPortaMalas();     // ✓ Próprio de Carro

Moto moto = new Moto();
moto.marca = "Honda";        // ✓ Herdado de Veiculo
moto.ligar();                // ✓ Herdado de Veiculo
moto.empinar();              // ✓ Próprio de Moto
```

### 8️⃣ Blueprint como Documentação

**Conceito**: Blueprint serve como **documentação viva** do que objetos podem fazer.

**Exemplo**:
```java
/**
 * Blueprint para representar um Cliente no sistema.
 * 
 * Todo cliente tem:
 * - Nome completo
 * - CPF único
 * - Email de contato
 * - Lista de pedidos realizados
 * 
 * Todo cliente pode:
 * - Fazer novos pedidos
 * - Visualizar histórico de pedidos
 * - Atualizar dados cadastrais
 */
public class Cliente {
    private String nome;
    private String cpf;
    private String email;
    private List<Pedido> pedidos;
    
    /**
     * Cria novo cliente com dados obrigatórios.
     */
    public Cliente(String nome, String cpf, String email) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.pedidos = new ArrayList<>();
    }
    
    /**
     * Registra novo pedido para este cliente.
     */
    public void fazerPedido(Pedido pedido) {
        this.pedidos.add(pedido);
    }
    
    /**
     * Retorna todos os pedidos realizados.
     */
    public List<Pedido> getHistoricoPedidos() {
        return new ArrayList<>(this.pedidos);
    }
}

// Blueprint documenta o que É um cliente e o que ele PODE FAZER
```

### 9️⃣ Blueprint vs Interface

**Diferença**:
- **Classe (blueprint)**: define estrutura E comportamento
- **Interface**: define APENAS comportamento (contrato)

**Exemplo**:
```java
// INTERFACE - contrato (sem implementação)
public interface Pagavel {
    void processarPagamento(double valor);
    boolean verificarSaldo();
}

// BLUEPRINT - implementa contrato
public class PagamentoCartao implements Pagavel {
    private String numeroCartao;
    private String titular;
    private double limite;
    
    @Override
    public void processarPagamento(double valor) {
        System.out.println("Processando pagamento no cartão: " + valor);
    }
    
    @Override
    public boolean verificarSaldo() {
        return true;  // Verificação de limite
    }
}

// BLUEPRINT diferente - implementa mesmo contrato
public class PagamentoPix implements Pagavel {
    private String chavePix;
    
    @Override
    public void processarPagamento(double valor) {
        System.out.println("Processando PIX: " + valor);
    }
    
    @Override
    public boolean verificarSaldo() {
        return true;  // Verificação de saldo em conta
    }
}

// Objetos de blueprints diferentes, mas mesmo contrato
Pagavel pag1 = new PagamentoCartao();
Pagavel pag2 = new PagamentoPix();

pag1.processarPagamento(100);
pag2.processarPagamento(200);
```

### 🔟 Evolução do Blueprint

**Conceito**: Blueprint pode **evoluir** sem quebrar objetos existentes.

**Exemplo**:
```java
// VERSÃO 1 do blueprint
public class Produto {
    private String nome;
    private double preco;
    
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
}

// VERSÃO 2 - adicionamos novo atributo
public class Produto {
    private String nome;
    private double preco;
    private String categoria;  // ← NOVO
    
    // Construtor antigo ainda funciona
    public Produto(String nome, double preco) {
        this(nome, preco, "Geral");  // Categoria padrão
    }
    
    // Novo construtor
    public Produto(String nome, double preco, String categoria) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
    }
}

// Código antigo continua funcionando
Produto p1 = new Produto("Mouse", 50);  // ✓ Funciona

// Código novo pode usar novos recursos
Produto p2 = new Produto("Teclado", 150, "Informática");
```

## 🎯 Aplicabilidade

**1. Design de sistemas**
**2. Padronização de estruturas**
**3. Reutilização de código**
**4. Documentação de domínio**
**5. Garantia de consistência**

## ⚠️ Armadilhas Comuns

**1. Confundir classe com objeto**:
```java
// ❌ "Criei uma classe Pessoa"
// ✓ "Criei um objeto da classe Pessoa"
Pessoa p = new Pessoa();
```

**2. Blueprint muito genérico**:
```java
// ❌ Classe "Coisa" - sem significado
public class Coisa { }
```

**3. Blueprint muito específico**:
```java
// ❌ Classe para UM caso só
public class ProdutoNotebookDell15Polegadas { }
```

**4. God Class**:
```java
// ❌ Blueprint faz tudo
public class Sistema { }
```

**5. Blueprint anêmico**:
```java
// ❌ Só dados, sem comportamento
public class Produto {
    public String nome;
    public double preco;
}
```

## ✅ Boas Práticas

**1. Nome claro**:
```java
public class ContaBancaria { }
```

**2. Responsabilidade única**:
```java
public class Produto {
    // Só lida com Produto
}
```

**3. Encapsulamento**:
```java
private double saldo;
public double getSaldo() { }
```

**4. Construtores adequados**:
```java
public Produto(String nome, double preco) { }
```

**5. Validação no blueprint**:
```java
if (preco < 0) throw new IllegalArgumentException();
```

## 📚 Resumo Executivo

**Classe é blueprint, objeto é produto**.

**Metáfora**:
- Blueprint = planta arquitetônica
- Objeto = casa construída

**Blueprint define**:
- Estrutura (atributos)
- Comportamento (métodos)
- Tipo (novo tipo de dado)
- Regras (validações)

**Um blueprint → muitos objetos**:
```java
class Carro { }  // 1 blueprint

Carro c1 = new Carro();  // Objeto 1
Carro c2 = new Carro();  // Objeto 2
Carro c3 = new Carro();  // Objeto 3
```

**Código vs Memória**:
- Blueprint: código (.java)
- Objeto: memória (heap)

**Garantias**:
- Todo objeto terá atributos definidos
- Todo objeto poderá executar métodos definidos
- Todo objeto seguirá regras do blueprint

**Analogias**:
- Receita → Bolos
- Molde → Biscoitos
- Formulário → Formulários preenchidos
- DNA → Organismos

**Recomendação**: Pense em classe como **especificação** que define **estrutura, comportamento e regras** que todos os objetos seguirão. Blueprint **não é o produto**, é o **manual de fabricação**.