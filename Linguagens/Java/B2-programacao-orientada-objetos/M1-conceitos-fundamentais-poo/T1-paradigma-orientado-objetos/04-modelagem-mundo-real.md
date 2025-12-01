# Modelagem do Mundo Real através de Objetos

## 🎯 Introdução e Definição

**A POO permite mapear conceitos do mundo real diretamente para código**. Objetos de software representam **entidades reais** (pessoas, produtos, pedidos) ou **conceitos abstratos** (transações, permissões, processos). Esta **modelagem intuitiva** torna o código mais **compreensível, manutenível e alinhado com o domínio de negócio**.

**Conceito central**: No mundo real, tudo é **objeto** com **características (atributos)** e **comportamentos (métodos)**. Um **carro** tem marca, modelo, cor (atributos) e pode ligar, acelerar, frear (comportamentos). POO **replica esta estrutura** no código.

**Analogia**: Programação procedural é como **escrever receita de bolo** (passo a passo sequencial). POO é como **ter uma cozinha equipada** onde cada utensílio (objeto) sabe sua função - batedeira bate, forno assa, geladeira resfria. Você **combina objetos** para alcançar resultado.

**Mapeamento fundamental**:

| Mundo Real | POO Java |
|------------|----------|
| **Conceito/Entidade** | **Classe** |
| **Instância específica** | **Objeto** |
| **Características** | **Atributos** (variáveis) |
| **Ações/Comportamentos** | **Métodos** (funções) |
| **Relações entre entidades** | **Associação/Composição/Herança** |

**Exemplo fundamental**:
```java
// MUNDO REAL: Cachorro
// - Características: nome, raça, idade, cor
// - Comportamentos: latir, comer, dormir, correr

// POO: Classe Cachorro
public class Cachorro {
    // ATRIBUTOS - características
    private String nome;
    private String raca;
    private int idade;
    private String cor;
    
    // CONSTRUTOR - cria instância
    public Cachorro(String nome, String raca, int idade, String cor) {
        this.nome = nome;
        this.raca = raca;
        this.idade = idade;
        this.cor = cor;
    }
    
    // MÉTODOS - comportamentos
    public void latir() {
        System.out.println(this.nome + " está latindo: Au au!");
    }
    
    public void comer(String alimento) {
        System.out.println(this.nome + " está comendo " + alimento);
    }
    
    public void dormir() {
        System.out.println(this.nome + " está dormindo... Zzz");
    }
    
    public void correr() {
        System.out.println(this.nome + " está correndo!");
    }
    
    public void fazerAniversario() {
        this.idade++;
        System.out.println(this.nome + " fez " + this.idade + " anos!");
    }
}

// INSTÂNCIAS - cachorros específicos
Cachorro rex = new Cachorro("Rex", "Labrador", 3, "Dourado");
Cachorro bob = new Cachorro("Bob", "Poodle", 5, "Branco");

// INTERAÇÃO - comportamentos
rex.latir();        // "Rex está latindo: Au au!"
bob.comer("ração"); // "Bob está comendo ração"
rex.fazerAniversario(); // "Rex fez 4 anos!"
```

**Vantagens da modelagem**:
1. **Código autoexplicativo** - classes/métodos refletem domínio
2. **Comunicação facilitada** - desenvolvedores e especialistas de negócio falam mesma língua
3. **Manutenção intuitiva** - mudanças no domínio mapeiam diretamente para código
4. **Reutilização natural** - objetos do domínio são reutilizáveis

**Processo de modelagem**:
1. **Identificar objetos** - substantivos do domínio viram classes
2. **Identificar atributos** - adjetivos/características viram atributos
3. **Identificar métodos** - verbos/ações viram métodos
4. **Identificar relacionamentos** - como objetos interagem

## 📋 Fundamentos Teóricos

### 1️⃣ Identificar Objetos no Domínio

**Técnica**: Análise de **substantivos** nos requisitos. Substantivos geralmente representam **entidades** que devem virar **classes**.

**Exemplo - sistema bancário**:

**Requisitos**: "Um **cliente** pode abrir uma **conta bancária**. Cada **conta** tem um **número**, **saldo** e **titular**. O **cliente** pode fazer **depósitos** e **saques**. O **banco** gerencia múltiplas **contas** e **clientes**."

**Substantivos identificados**:
- Cliente ✓
- Conta Bancária ✓
- Número (atributo de Conta)
- Saldo (atributo de Conta)
- Titular (relacionamento Conta ↔ Cliente)
- Depósito (ação/método)
- Saque (ação/método)
- Banco ✓

**Classes resultantes**:
```java
// OBJETO: Cliente
public class Cliente {
    private String nome;
    private String cpf;
    private String endereco;
    private String telefone;
    
    public Cliente(String nome, String cpf) {
        this.nome = nome;
        this.cpf = cpf;
    }
    
    public String getNome() {
        return this.nome;
    }
}

// OBJETO: Conta
public class Conta {
    private String numero;
    private double saldo;
    private Cliente titular;  // Relacionamento
    
    public Conta(String numero, Cliente titular) {
        this.numero = numero;
        this.titular = titular;
        this.saldo = 0.0;
    }
    
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;
        }
    }
    
    public boolean sacar(double valor) {
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor;
            return true;
        }
        return false;
    }
    
    public double getSaldo() {
        return this.saldo;
    }
}

// OBJETO: Banco
public class Banco {
    private String nome;
    private List<Cliente> clientes;
    private List<Conta> contas;
    
    public Banco(String nome) {
        this.nome = nome;
        this.clientes = new ArrayList<>();
        this.contas = new ArrayList<>();
    }
    
    public void cadastrarCliente(Cliente cliente) {
        this.clientes.add(cliente);
    }
    
    public Conta abrirConta(Cliente cliente) {
        String numeroConta = "C" + (contas.size() + 1);
        Conta conta = new Conta(numeroConta, cliente);
        this.contas.add(conta);
        return conta;
    }
}
```

**Uso**:
```java
Banco bancoBrasil = new Banco("Banco do Brasil");

Cliente joao = new Cliente("João Silva", "123.456.789-00");
bancoBrasil.cadastrarCliente(joao);

Conta contaJoao = bancoBrasil.abrirConta(joao);
contaJoao.depositar(1000);
contaJoao.sacar(200);
System.out.println("Saldo: " + contaJoao.getSaldo());  // 800
```

### 2️⃣ Atributos Representam Características

**Técnica**: **Adjetivos** e **características** viram **atributos**. Pergunte: "**O que descreve este objeto?**"

**Exemplo - e-commerce**:

**Objeto**: Produto
**Características**: nome, preço, descrição, categoria, peso, estoque, imagem

```java
public class Produto {
    // ATRIBUTOS - características do produto
    private String nome;
    private double preco;
    private String descricao;
    private String categoria;
    private double peso;  // em kg
    private int quantidadeEstoque;
    private String urlImagem;
    private boolean ativo;
    
    public Produto(String nome, double preco, String categoria) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.quantidadeEstoque = 0;
        this.ativo = true;
    }
    
    // Getters/setters com validação
    public void setPreco(double preco) {
        if (preco >= 0) {
            this.preco = preco;
        } else {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }
    }
    
    public double getPreco() {
        return this.preco;
    }
    
    public boolean temEstoque(int quantidade) {
        return this.quantidadeEstoque >= quantidade;
    }
    
    public void adicionarEstoque(int quantidade) {
        this.quantidadeEstoque += quantidade;
    }
    
    public void removerEstoque(int quantidade) {
        if (temEstoque(quantidade)) {
            this.quantidadeEstoque -= quantidade;
        }
    }
}
```

**Tipos de atributos**:
1. **Primitivos**: `int`, `double`, `boolean`, `char`
2. **String**: `String nome`
3. **Objetos**: `Cliente titular`, `Endereco endereco`
4. **Coleções**: `List<Pedido> pedidos`
5. **Enums**: `StatusPedido status`

**Exemplo com diferentes tipos**:
```java
public enum StatusPedido {
    PENDENTE, PROCESSANDO, ENVIADO, ENTREGUE, CANCELADO
}

public class Pedido {
    private int numero;                    // Primitivo
    private Cliente cliente;               // Objeto
    private List<ItemPedido> itens;        // Coleção
    private StatusPedido status;           // Enum
    private LocalDateTime dataPedido;      // Objeto (data)
    private double valorTotal;             // Primitivo
    private Endereco enderecoEntrega;      // Objeto
    
    public Pedido(Cliente cliente) {
        this.cliente = cliente;
        this.itens = new ArrayList<>();
        this.status = StatusPedido.PENDENTE;
        this.dataPedido = LocalDateTime.now();
        this.valorTotal = 0.0;
    }
}
```

### 3️⃣ Métodos Representam Ações

**Técnica**: **Verbos** nos requisitos viram **métodos**. Pergunte: "**O que este objeto pode fazer?**"

**Exemplo - sistema de biblioteca**:

**Requisitos**: "Um **livro** pode ser **emprestado** e **devolvido**. Um **usuário** pode **emprestar** até 3 livros. A **biblioteca** pode **buscar livros** por título."

**Verbos identificados**:
- emprestar ✓
- devolver ✓
- buscar ✓

```java
public class Livro {
    private String titulo;
    private String autor;
    private String isbn;
    private boolean disponivel;
    
    public Livro(String titulo, String autor, String isbn) {
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
        this.disponivel = true;
    }
    
    // MÉTODO - ação "emprestar"
    public boolean emprestar() {
        if (this.disponivel) {
            this.disponivel = false;
            System.out.println("Livro '" + this.titulo + "' emprestado");
            return true;
        }
        System.out.println("Livro indisponível");
        return false;
    }
    
    // MÉTODO - ação "devolver"
    public void devolver() {
        this.disponivel = true;
        System.out.println("Livro '" + this.titulo + "' devolvido");
    }
    
    public boolean isDisponivel() {
        return this.disponivel;
    }
}

public class Usuario {
    private String nome;
    private String matricula;
    private List<Livro> livrosEmprestados;
    private static final int LIMITE_EMPRESTIMOS = 3;
    
    public Usuario(String nome, String matricula) {
        this.nome = nome;
        this.matricula = matricula;
        this.livrosEmprestados = new ArrayList<>();
    }
    
    // MÉTODO - ação "emprestar livro"
    public boolean emprestarLivro(Livro livro) {
        if (this.livrosEmprestados.size() >= LIMITE_EMPRESTIMOS) {
            System.out.println("Limite de empréstimos atingido");
            return false;
        }
        
        if (livro.emprestar()) {
            this.livrosEmprestados.add(livro);
            return true;
        }
        return false;
    }
    
    // MÉTODO - ação "devolver livro"
    public void devolverLivro(Livro livro) {
        if (this.livrosEmprestados.contains(livro)) {
            livro.devolver();
            this.livrosEmprestados.remove(livro);
        }
    }
}

public class Biblioteca {
    private List<Livro> acervo;
    
    public Biblioteca() {
        this.acervo = new ArrayList<>();
    }
    
    public void cadastrarLivro(Livro livro) {
        this.acervo.add(livro);
    }
    
    // MÉTODO - ação "buscar"
    public List<Livro> buscarPorTitulo(String titulo) {
        List<Livro> resultados = new ArrayList<>();
        for (Livro livro : acervo) {
            if (livro.getTitulo().toLowerCase().contains(titulo.toLowerCase())) {
                resultados.add(livro);
            }
        }
        return resultados;
    }
    
    public List<Livro> buscarDisponiveis() {
        List<Livro> disponiveis = new ArrayList<>();
        for (Livro livro : acervo) {
            if (livro.isDisponivel()) {
                disponiveis.add(livro);
            }
        }
        return disponiveis;
    }
}
```

**Uso**:
```java
Biblioteca biblioteca = new Biblioteca();

Livro livro1 = new Livro("Clean Code", "Robert Martin", "123");
Livro livro2 = new Livro("Design Patterns", "Gang of Four", "456");

biblioteca.cadastrarLivro(livro1);
biblioteca.cadastrarLivro(livro2);

Usuario joao = new Usuario("João", "2024001");
joao.emprestarLivro(livro1);  // "Livro 'Clean Code' emprestado"

List<Livro> encontrados = biblioteca.buscarPorTitulo("Clean");
// encontrados contém livro1
```

### 4️⃣ Relacionamentos entre Objetos

**Tipos de relacionamentos**:
1. **Associação** - objetos se conhecem
2. **Agregação** - "tem-um" (has-a) fraco
3. **Composição** - "parte-de" (part-of) forte
4. **Herança** - "é-um" (is-a)
5. **Dependência** - "usa-um" (uses-a)

**Associação simples**:
```java
// Professor CONHECE Alunos
public class Professor {
    private String nome;
    private List<Aluno> alunos;  // Associação
    
    public void adicionarAluno(Aluno aluno) {
        this.alunos.add(aluno);
    }
}

public class Aluno {
    private String nome;
    private Professor orientador;  // Associação bidirecional
}
```

**Agregação - relacionamento fraco**:
```java
// Departamento TEM Funcionários (mas funcionário existe sem departamento)
public class Departamento {
    private String nome;
    private List<Funcionario> funcionarios;  // Agregação
    
    public void adicionarFuncionario(Funcionario func) {
        this.funcionarios.add(func);
    }
}

public class Funcionario {
    private String nome;
    // Funcionário existe independentemente de departamento
}

// Funcionário pode ser removido do departamento e continuar existindo
Funcionario joao = new Funcionario("João");
Departamento ti = new Departamento("TI");
ti.adicionarFuncionario(joao);
ti.removerFuncionario(joao);  // João ainda existe
```

**Composição - relacionamento forte**:
```java
// Pedido TEM Itens (item NÃO existe sem pedido)
public class Pedido {
    private int numero;
    private List<ItemPedido> itens;  // Composição - criados COM pedido
    
    public Pedido(int numero) {
        this.numero = numero;
        this.itens = new ArrayList<>();  // Itens nascem com Pedido
    }
    
    public void adicionarItem(Produto produto, int quantidade) {
        ItemPedido item = new ItemPedido(produto, quantidade);
        this.itens.add(item);
    }
}

public class ItemPedido {
    private Produto produto;
    private int quantidade;
    private double precoUnitario;
    
    public ItemPedido(Produto produto, int quantidade) {
        this.produto = produto;
        this.quantidade = quantidade;
        this.precoUnitario = produto.getPreco();
    }
}

// Quando Pedido é destruído, Itens também são (forte dependência)
```

**Exemplo completo - e-commerce**:
```java
public class Cliente {
    private String nome;
    private String email;
    private Endereco endereco;  // Composição - endereço é parte do cliente
    
    public Cliente(String nome, String email, String rua, String cidade) {
        this.nome = nome;
        this.email = email;
        this.endereco = new Endereco(rua, cidade);  // Criado com cliente
    }
}

public class Endereco {
    private String rua;
    private String numero;
    private String cidade;
    private String estado;
    private String cep;
}

public class Pedido {
    private Cliente cliente;       // Associação - cliente existe independente
    private List<ItemPedido> itens;  // Composição - itens são parte do pedido
    private Pagamento pagamento;   // Composição - pagamento é parte do pedido
    
    public void processar() {
        // Lógica de processamento
    }
}
```

### 5️⃣ Domínios Práticos - Exemplos Completos

**E-commerce completo**:
```java
public class Cliente {
    private String nome;
    private String cpf;
    private String email;
    private Endereco endereco;
    private List<Pedido> historicoPedidos;
}

public class Produto {
    private String nome;
    private double preco;
    private String categoria;
    private int estoque;
}

public class CarrinhoCompras {
    private Cliente cliente;
    private List<ItemCarrinho> itens;
    
    public void adicionarProduto(Produto produto, int quantidade) {
        itens.add(new ItemCarrinho(produto, quantidade));
    }
    
    public double calcularTotal() {
        return itens.stream()
            .mapToDouble(item -> item.getSubtotal())
            .sum();
    }
}

public class ItemCarrinho {
    private Produto produto;
    private int quantidade;
    
    public double getSubtotal() {
        return produto.getPreco() * quantidade;
    }
}

public class Pedido {
    private int numero;
    private Cliente cliente;
    private List<ItemCarrinho> itens;
    private StatusPedido status;
    private LocalDateTime data;
    private double valorTotal;
    private Pagamento pagamento;
    private Entrega entrega;
    
    public void processar() {
        this.status = StatusPedido.PROCESSANDO;
        if (pagamento.processar()) {
            this.status = StatusPedido.PAGO;
            entrega.agendar();
        }
    }
}

public class Pagamento {
    private String metodoPagamento;
    private double valor;
    private boolean aprovado;
    
    public boolean processar() {
        // Lógica de processamento
        this.aprovado = true;
        return this.aprovado;
    }
}

public class Entrega {
    private Endereco endereco;
    private LocalDate dataPrevisao;
    private String codigoRastreio;
    
    public void agendar() {
        this.dataPrevisao = LocalDate.now().plusDays(5);
        this.codigoRastreio = gerarCodigo();
    }
}
```

**Sistema escolar**:
```java
public class Aluno {
    private String nome;
    private String matricula;
    private List<Disciplina> disciplinasMatriculadas;
    private List<Nota> notas;
    
    public void matricularEmDisciplina(Disciplina disciplina) {
        this.disciplinasMatriculadas.add(disciplina);
    }
    
    public double calcularMedia() {
        return notas.stream()
            .mapToDouble(Nota::getValor)
            .average()
            .orElse(0.0);
    }
}

public class Professor {
    private String nome;
    private String especialidade;
    private List<Disciplina> disciplinasLecionadas;
    
    public void lancarNota(Aluno aluno, Disciplina disciplina, double valor) {
        Nota nota = new Nota(aluno, disciplina, valor);
        aluno.adicionarNota(nota);
    }
}

public class Disciplina {
    private String nome;
    private String codigo;
    private Professor professor;
    private List<Aluno> alunosMatriculados;
    private int cargaHoraria;
    
    public void matricularAluno(Aluno aluno) {
        this.alunosMatriculados.add(aluno);
    }
}

public class Turma {
    private String codigo;
    private Disciplina disciplina;
    private Professor professor;
    private List<Aluno> alunos;
    private String sala;
    private String horario;
}

public class Nota {
    private Aluno aluno;
    private Disciplina disciplina;
    private double valor;
    private LocalDate data;
    
    public Nota(Aluno aluno, Disciplina disciplina, double valor) {
        this.aluno = aluno;
        this.disciplina = disciplina;
        this.valor = valor;
        this.data = LocalDate.now();
    }
}
```

### 6️⃣ Transformar Requisitos em Classes - Processo

**Passo a passo**:
1. **Ler requisitos** identificando substantivos (classes), adjetivos (atributos), verbos (métodos)
2. **Eliminar redundâncias** - substantivos sinônimos viram uma classe
3. **Definir relacionamentos** - como classes interagem
4. **Validar com especialista** - confirmar modelo reflete domínio

**Exemplo - sistema de reservas de hotel**:

**Requisitos**: "Um **hotel** possui **quartos** de diferentes **tipos** (standard, luxo, suíte). **Hóspedes** podem fazer **reservas** de quartos para determinadas **datas**. Cada **reserva** possui **status** (confirmada, cancelada, em andamento). O **hotel** pode **buscar quartos disponíveis** para um período."

**Análise**:
- **Substantivos**: Hotel, Quarto, Tipo (enum), Hóspede, Reserva, Data, Status (enum)
- **Verbos**: fazer reserva, buscar quartos disponíveis
- **Adjetivos**: standard, luxo, suíte (valores de enum)

**Modelo**:
```java
public enum TipoQuarto {
    STANDARD, LUXO, SUITE
}

public enum StatusReserva {
    CONFIRMADA, CANCELADA, EM_ANDAMENTO, FINALIZADA
}

public class Hotel {
    private String nome;
    private String endereco;
    private List<Quarto> quartos;
    private List<Reserva> reservas;
    
    public Hotel(String nome, String endereco) {
        this.nome = nome;
        this.endereco = endereco;
        this.quartos = new ArrayList<>();
        this.reservas = new ArrayList<>();
    }
    
    // VERBO: buscar quartos disponíveis
    public List<Quarto> buscarQuartosDisponiveis(LocalDate checkIn, LocalDate checkOut, TipoQuarto tipo) {
        List<Quarto> disponiveis = new ArrayList<>();
        for (Quarto quarto : quartos) {
            if (quarto.getTipo() == tipo && quarto.estaDisponivel(checkIn, checkOut)) {
                disponiveis.add(quarto);
            }
        }
        return disponiveis;
    }
    
    public Reserva fazerReserva(Hospede hospede, Quarto quarto, LocalDate checkIn, LocalDate checkOut) {
        Reserva reserva = new Reserva(hospede, quarto, checkIn, checkOut);
        this.reservas.add(reserva);
        return reserva;
    }
}

public class Quarto {
    private int numero;
    private TipoQuarto tipo;  // ADJETIVO virou enum
    private double precoDiaria;
    private int capacidade;
    
    public Quarto(int numero, TipoQuarto tipo, double precoDiaria) {
        this.numero = numero;
        this.tipo = tipo;
        this.precoDiaria = precoDiaria;
    }
    
    public boolean estaDisponivel(LocalDate inicio, LocalDate fim) {
        // Verifica se não há reservas conflitantes
        return true;  // Simplificado
    }
    
    public TipoQuarto getTipo() {
        return this.tipo;
    }
}

public class Hospede {
    private String nome;
    private String cpf;
    private String telefone;
    private String email;
    
    public Hospede(String nome, String cpf) {
        this.nome = nome;
        this.cpf = cpf;
    }
}

public class Reserva {
    private Hospede hospede;
    private Quarto quarto;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private StatusReserva status;  // SUBSTANTIVO virou enum
    private double valorTotal;
    
    public Reserva(Hospede hospede, Quarto quarto, LocalDate checkIn, LocalDate checkOut) {
        this.hospede = hospede;
        this.quarto = quarto;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = StatusReserva.CONFIRMADA;
        this.valorTotal = calcularValorTotal();
    }
    
    private double calcularValorTotal() {
        long dias = ChronoUnit.DAYS.between(checkIn, checkOut);
        return dias * quarto.getPrecoDiaria();
    }
    
    public void cancelar() {
        this.status = StatusReserva.CANCELADA;
    }
}
```

**Uso**:
```java
Hotel hotel = new Hotel("Hotel Paraíso", "Av. Principal, 123");

Quarto quarto1 = new Quarto(101, TipoQuarto.STANDARD, 200);
Quarto quarto2 = new Quarto(201, TipoQuarto.LUXO, 350);
hotel.adicionarQuarto(quarto1);
hotel.adicionarQuarto(quarto2);

Hospede joao = new Hospede("João Silva", "123.456.789-00");

LocalDate checkIn = LocalDate.of(2024, 6, 1);
LocalDate checkOut = LocalDate.of(2024, 6, 5);

List<Quarto> disponiveis = hotel.buscarQuartosDisponiveis(checkIn, checkOut, TipoQuarto.LUXO);
if (!disponiveis.isEmpty()) {
    Reserva reserva = hotel.fazerReserva(joao, disponiveis.get(0), checkIn, checkOut);
    System.out.println("Reserva confirmada. Valor: " + reserva.getValorTotal());
}
```

### 7️⃣ Diagramas UML Básicos

**Diagrama de classes**:
```
┌─────────────────┐
│    Cliente      │
├─────────────────┤
│ - nome: String  │
│ - cpf: String   │
├─────────────────┤
│ + getNome()     │
│ + getCpf()      │
└─────────────────┘
        │
        │ 1
        │
        │ *
┌─────────────────┐
│     Pedido      │
├─────────────────┤
│ - numero: int   │
│ - data: Date    │
├─────────────────┤
│ + processar()   │
└─────────────────┘
```

**Notações**:
- `+` public
- `-` private
- `#` protected
- `1` um
- `*` muitos
- Linha simples: associação
- Diamante vazio: agregação
- Diamante cheio: composição
- Seta: herança

### 8️⃣ Padrões de Modelagem

**Anêmico vs Rico**:
```java
// ❌ Modelo anêmico - só dados
public class PedidoAnemico {
    public int numero;
    public double total;
    public String status;
}

public class PedidoService {
    public void calcularTotal(PedidoAnemico pedido) {
        // Lógica fora do objeto
    }
}

// ✓ Modelo rico - dados + comportamento
public class PedidoRico {
    private int numero;
    private double total;
    private StatusPedido status;
    
    public void calcularTotal() {
        // Lógica dentro do objeto
        this.total = itens.stream()
            .mapToDouble(Item::getSubtotal)
            .sum();
    }
}
```

### 9️⃣ CRC Cards - Brainstorming de Design

**CRC (Class-Responsibility-Collaboration)**:

```
┌─────────────────────────────────┐
│ Classe: Pedido                  │
├─────────────────────────────────┤
│ Responsabilidades:              │
│ - Calcular total                │
│ - Processar pagamento           │
│ - Validar itens                 │
├─────────────────────────────────┤
│ Colaboradores:                  │
│ - Cliente                       │
│ - ItemPedido                    │
│ - Pagamento                     │
└─────────────────────────────────┘
```

**Uso**: Equipe discute **quem faz o quê** e **quem colabora com quem**.

### 🔟 Validação do Modelo com Domínio

**Checklist**:
- ✓ Classes refletem conceitos do domínio?
- ✓ Nomes fazem sentido para especialistas de negócio?
- ✓ Relacionamentos estão corretos?
- ✓ Não há duplicação de responsabilidades?
- ✓ Modelo pode evoluir conforme negócio cresce?

## 🎯 Aplicabilidade

**1. Sistemas empresariais**: ERP, CRM
**2. E-commerce**: produtos, pedidos, clientes
**3. Bancos**: contas, transações, clientes
**4. Jogos**: personagens, itens, cenários
**5. Saúde**: pacientes, consultas, exames

## ⚠️ Armadilhas Comuns

**1. God Class**:
```java
// ❌ Classe faz tudo
public class Sistema { }
```

**2. Modelo anêmico**:
```java
// ❌ Só getters/setters
public class Produto {
    public String nome;
}
```

**3. Relacionamentos errados**:
```java
// ❌ Quadrado extends Retângulo
```

**4. Nomes genéricos**:
```java
// ❌ Manager, Helper, Util
```

**5. Overengineering**:
```java
// ❌ Complexidade desnecessária
AbstractFactoryBuilderProvider
```

## ✅ Boas Práticas

**1. Nomes do domínio**:
```java
public class Pedido { }  // ✓ Conceito de negócio
```

**2. Responsabilidade única**:
```java
public class Cliente {
    // Só lida com cliente
}
```

**3. Modelo rico**:
```java
public class Conta {
    public void sacar() { validar(); }
}
```

**4. Imutabilidade quando apropriado**:
```java
public final class Cpf {
    private final String numero;
}
```

**5. Validar no construtor**:
```java
public Produto(String nome, double preco) {
    validar(nome, preco);
}
```

## 📚 Resumo Executivo

**Modelagem mapeia mundo real → código**.

**Substantivos → Classes**:
```java
Cliente, Pedido, Produto
```

**Adjetivos → Atributos**:
```java
private String nome;
private double preco;
```

**Verbos → Métodos**:
```java
public void processar() { }
```

**Relacionamentos**:
```java
// Associação
private Cliente cliente;

// Composição
private List<Item> itens;

// Herança
class B extends A { }
```

**Processo**:
1. Ler requisitos
2. Identificar substantivos
3. Definir atributos (adjetivos)
4. Definir métodos (verbos)
5. Estabelecer relacionamentos

**Recomendação**: **Modele próximo ao domínio**. Use **nomes de negócio**, mantenha **responsabilidades claras**, prefira **modelo rico** (dados+comportamento), valide com **especialistas**. Modelagem correta **facilita comunicação** e **manutenção**.