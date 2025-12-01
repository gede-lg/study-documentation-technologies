# Relacionamento entre Objetos

## 🎯 Introdução e Definição

**Objetos raramente existem isoladamente** - eles **colaboram**, **dependem** e **se relacionam** para formar sistemas complexos. POO oferece **mecanismos formais** para expressar esses relacionamentos: **Associação, Agregação, Composição, Dependência e Herança**.

**Conceito central**: Relacionamentos definem **como objetos interagem**. A escolha do tipo de relacionamento impacta **acoplamento, coesão, reutilização e manutenibilidade**. Relacionamentos **fortes** (composição) criam dependência, relacionamentos **fracos** (agregação) permitem flexibilidade.

**Analogia com vida real**:
- **Associação**: Você **conhece** seu vizinho (objetos se conhecem)
- **Agregação**: Você **tem** um carro (mas carro existe sem você)
- **Composição**: Você **tem** coração (coração não existe sem você)
- **Dependência**: Você **usa** uber (temporariamente, não possui)
- **Herança**: Filho **é** humano (compartilha características)

**Os cinco tipos de relacionamento**:

| Tipo | Notação UML | Força | Exemplo Java | Significado |
|------|-------------|-------|--------------|-------------|
| **Associação** | `───────` | Média | `private Cliente cliente;` | Conhece |
| **Agregação** | `◇───────` | Fraca | `private List<Aluno> alunos;` | Tem-um (has-a) fraco |
| **Composição** | `◆───────` | Forte | `private Motor motor = new Motor();` | Parte-de (part-of) |
| **Dependência** | `- - - - >` | Muito fraca | `public void enviar(Email email)` | Usa-um (uses-a) |
| **Herança** | `───────▷` | Muito forte | `class B extends A` | É-um (is-a) |

**Exemplo fundamental**:
```java
// HERANÇA - Carro É-UM Veiculo
public class Veiculo {
    protected String marca;
}

public class Carro extends Veiculo {  // IS-A
    // Carro É-UM Veículo
}

// COMPOSIÇÃO - Carro TEM Motor (forte)
public class Carro {
    private Motor motor;  // PART-OF - criado junto
    
    public Carro() {
        this.motor = new Motor();  // Nasce com Carro
    }
}

// AGREGAÇÃO - Departamento TEM Funcionários (fraco)
public class Departamento {
    private List<Funcionario> funcionarios;  // HAS-A
    
    public void addFuncionario(Funcionario f) {
        this.funcionarios.add(f);  // Recebe funcionário existente
    }
}

// ASSOCIAÇÃO - Professor CONHECE Alunos
public class Professor {
    private List<Aluno> alunos;  // Conhece
}

public class Aluno {
    private Professor orientador;  // Conhece (bidirecional)
}

// DEPENDÊNCIA - Pedido USA Impressora
public class Pedido {
    public void imprimir(Impressora impressora) {  // USES-A
        impressora.print(this);  // Usa temporariamente
    }
}
```

**Critérios de escolha**:
- **Herança**: quando há relação **"é-um"** genuína (Cachorro é Animal)
- **Composição**: quando **parte não existe sem todo** (Motor é parte de Carro)
- **Agregação**: quando **parte existe independente** (Aluno existe sem Turma)
- **Associação**: quando objetos **apenas se conhecem** (Cliente conhece Pedidos)
- **Dependência**: quando **uso é temporário** (método recebe objeto como parâmetro)

## 📋 Fundamentos Teóricos

### 1️⃣ Associação - Objetos se Conhecem

**Definição**: Associação é o relacionamento mais **genérico** - objetos simplesmente **conhecem e interagem** entre si. Um objeto **mantém referência** a outro.

**Características**:
- Objetos têm **existência independente**
- Relacionamento pode ser **unidirecional ou bidirecional**
- Pode ter **multiplicidade** (1-1, 1-N, N-N)

**Associação unidirecional**:
```java
// Professor CONHECE Alunos (mas Aluno não conhece Professor)
public class Professor {
    private String nome;
    private List<Aluno> alunos;  // Professor → Aluno
    
    public Professor(String nome) {
        this.nome = nome;
        this.alunos = new ArrayList<>();
    }
    
    public void adicionarAluno(Aluno aluno) {
        this.alunos.add(aluno);
    }
    
    public void listarAlunos() {
        for (Aluno aluno : alunos) {
            System.out.println(aluno.getNome());
        }
    }
}

public class Aluno {
    private String nome;
    // Não conhece Professor
    
    public Aluno(String nome) {
        this.nome = nome;
    }
    
    public String getNome() {
        return this.nome;
    }
}

// Uso
Professor prof = new Professor("Dr. Silva");
Aluno joao = new Aluno("João");
Aluno maria = new Aluno("Maria");

prof.adicionarAluno(joao);
prof.adicionarAluno(maria);
prof.listarAlunos();  // Professor conhece alunos
// joao.getProfessor();  // ❌ Aluno NÃO conhece professor
```

**Associação bidirecional**:
```java
// Cliente e Pedido se CONHECEM mutuamente
public class Cliente {
    private String nome;
    private List<Pedido> pedidos;  // Cliente → Pedido
    
    public Cliente(String nome) {
        this.nome = nome;
        this.pedidos = new ArrayList<>();
    }
    
    public void fazerPedido(Pedido pedido) {
        this.pedidos.add(pedido);
        pedido.setCliente(this);  // Estabelece relação bidirecional
    }
    
    public List<Pedido> getPedidos() {
        return this.pedidos;
    }
}

public class Pedido {
    private int numero;
    private Cliente cliente;  // Pedido → Cliente
    
    public Pedido(int numero) {
        this.numero = numero;
    }
    
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    
    public Cliente getCliente() {
        return this.cliente;
    }
}

// Uso
Cliente joao = new Cliente("João");
Pedido pedido1 = new Pedido(1001);

joao.fazerPedido(pedido1);  // Estabelece relação bidirecional

// ✓ Navegação bidirecional
System.out.println(pedido1.getCliente().getNome());  // "João"
System.out.println(joao.getPedidos().get(0).getNumero());  // 1001
```

**Multiplicidade**:
```java
// 1-para-1: Pessoa TEM UM CPF
public class Pessoa {
    private Cpf cpf;  // 1
}

// 1-para-N: Cliente TEM MUITOS Pedidos
public class Cliente {
    private List<Pedido> pedidos;  // N
}

// N-para-N: Aluno tem MUITAS Disciplinas, Disciplina tem MUITOS Alunos
public class Aluno {
    private List<Disciplina> disciplinas;  // N
}

public class Disciplina {
    private List<Aluno> alunos;  // N
}
```

**Associação qualificada - uso de Map**:
```java
public class Biblioteca {
    private Map<String, Livro> acervoPorISBN;  // Associação qualificada
    
    public Livro buscarPorISBN(String isbn) {
        return acervoPorISBN.get(isbn);
    }
}
```

### 2️⃣ Agregação - "Tem-um" Relacionamento Fraco

**Definição**: Agregação é uma forma **especializada de associação** onde um objeto **"tem"** outro, mas a **parte pode existir independentemente** do todo. Relacionamento **"has-a" fraco**.

**Características**:
- **Parte existe sem todo** (ciclo de vida independente)
- Representa **"tem-um"** mas não **"parte-de"**
- UML: **diamante vazio ◇**

**Exemplo clássico**:
```java
// Departamento TEM Funcionários (mas funcionário existe sem departamento)
public class Departamento {
    private String nome;
    private List<Funcionario> funcionarios;  // Agregação
    
    public Departamento(String nome) {
        this.nome = nome;
        this.funcionarios = new ArrayList<>();
    }
    
    // Recebe funcionário já existente
    public void adicionarFuncionario(Funcionario funcionario) {
        this.funcionarios.add(funcionario);
    }
    
    public void removerFuncionario(Funcionario funcionario) {
        this.funcionarios.remove(funcionario);
        // Funcionário continua existindo após remoção
    }
}

public class Funcionario {
    private String nome;
    private String cpf;
    
    public Funcionario(String nome, String cpf) {
        this.nome = nome;
        this.cpf = cpf;
    }
}

// Uso - ciclos de vida independentes
Funcionario joao = new Funcionario("João", "123");
Funcionario maria = new Funcionario("Maria", "456");

Departamento ti = new Departamento("TI");
ti.adicionarFuncionario(joao);
ti.adicionarFuncionario(maria);

ti.removerFuncionario(joao);  // João é removido mas CONTINUA EXISTINDO
// joao ainda pode ser adicionado a outro departamento

Departamento rh = new Departamento("RH");
rh.adicionarFuncionario(joao);  // Mesmo funcionário, outro departamento
```

**Mais exemplos de agregação**:
```java
// Time TEM Jogadores (jogador existe sem time)
public class Time {
    private String nome;
    private List<Jogador> jogadores;  // Agregação
    
    public void contratar(Jogador jogador) {
        this.jogadores.add(jogador);
    }
    
    public void dispensar(Jogador jogador) {
        this.jogadores.remove(jogador);
        // Jogador continua existindo
    }
}

public class Jogador {
    private String nome;
    private int numero;
    // Existe independente de time
}

// Biblioteca TEM Livros (livro existe sem biblioteca)
public class Biblioteca {
    private List<Livro> acervo;  // Agregação
    
    public void cadastrarLivro(Livro livro) {
        this.acervo.add(livro);
    }
}

public class Livro {
    private String titulo;
    private String isbn;
    // Existe independente de biblioteca
}

// Playlist TEM Músicas (música existe sem playlist)
public class Playlist {
    private String nome;
    private List<Musica> musicas;  // Agregação
    
    public void adicionarMusica(Musica musica) {
        this.musicas.add(musica);
    }
}

public class Musica {
    private String titulo;
    private String artista;
    // Existe independente de playlist
}
```

**Diferença sutil - quando usar agregação**:
```java
// ✓ Agregação - Turma HAS Alunos (aluno existe sem turma)
public class Turma {
    private List<Aluno> alunos;
}

// ✓ Composição - Turma HAS Aulas (aula é PARTE da turma)
public class Turma {
    private List<Aula> aulas = new ArrayList<>();
    
    public Turma() {
        // Aulas criadas COM turma
        aulas.add(new Aula("Introdução"));
        aulas.add(new Aula("Conceitos Avançados"));
    }
}
```

### 3️⃣ Composição - "Parte-de" Relacionamento Forte

**Definição**: Composição é o relacionamento mais **forte** - a **parte não pode existir sem o todo**. Quando o objeto "todo" é destruído, as "partes" também são. Relacionamento **"part-of"**.

**Características**:
- **Parte NÃO existe sem todo** (ciclo de vida dependente)
- **Todo controla criação e destruição** das partes
- UML: **diamante preenchido ◆**

**Exemplo clássico**:
```java
// Casa TEM Cômodos (cômodo NÃO existe sem casa)
public class Casa {
    private String endereco;
    private List<Comodo> comodos;  // Composição - partes da casa
    
    public Casa(String endereco) {
        this.endereco = endereco;
        this.comodos = new ArrayList<>();
        
        // Cômodos CRIADOS junto com casa
        this.comodos.add(new Comodo("Sala", 20));
        this.comodos.add(new Comodo("Quarto", 15));
        this.comodos.add(new Comodo("Cozinha", 12));
    }
    
    public void adicionarComodo(String nome, double area) {
        this.comodos.add(new Comodo(nome, area));
    }
}

public class Comodo {
    private String nome;
    private double area;
    
    public Comodo(String nome, double area) {
        this.nome = nome;
        this.area = area;
    }
}

// Uso - ciclos de vida acoplados
Casa casa = new Casa("Rua A, 123");
// Cômodos foram criados automaticamente COM a casa

casa.adicionarComodo("Garagem", 25);  // Novo cômodo criado

// Quando casa for destruída, cômodos também são (garbage collection)
casa = null;  // Casa e todos cômodos são destruídos
```

**Pedido e Itens - exemplo completo**:
```java
// Pedido TEM Itens (item NÃO existe sem pedido)
public class Pedido {
    private int numero;
    private LocalDateTime data;
    private List<ItemPedido> itens;  // Composição
    
    public Pedido(int numero) {
        this.numero = numero;
        this.data = LocalDateTime.now();
        this.itens = new ArrayList<>();  // Itens nascem com Pedido
    }
    
    // Cria novo ItemPedido como parte do Pedido
    public void adicionarItem(Produto produto, int quantidade) {
        ItemPedido item = new ItemPedido(produto, quantidade);
        this.itens.add(item);
    }
    
    public double calcularTotal() {
        return itens.stream()
            .mapToDouble(ItemPedido::getSubtotal)
            .sum();
    }
}

public class ItemPedido {
    private Produto produto;  // Referência ao produto (associação)
    private int quantidade;
    private double precoUnitario;
    
    // Item é PARTE do Pedido
    public ItemPedido(Produto produto, int quantidade) {
        this.produto = produto;
        this.quantidade = quantidade;
        this.precoUnitario = produto.getPreco();  // Captura preço no momento
    }
    
    public double getSubtotal() {
        return this.quantidade * this.precoUnitario;
    }
}

public class Produto {
    private String nome;
    private double preco;
    // Produto existe independente (não é composição)
}

// Uso
Produto notebook = new Produto("Notebook", 3000);
Produto mouse = new Produto("Mouse", 50);

Pedido pedido = new Pedido(1001);
pedido.adicionarItem(notebook, 1);  // Cria ItemPedido
pedido.adicionarItem(mouse, 2);     // Cria ItemPedido

System.out.println(pedido.calcularTotal());  // 3100

// Quando pedido é destruído, ItemPedido também é
// Mas Produto (notebook, mouse) continua existindo
```

**Mais exemplos de composição**:
```java
// Carro TEM Motor (motor é PARTE do carro)
public class Carro {
    private String modelo;
    private Motor motor;  // Composição
    
    public Carro(String modelo) {
        this.modelo = modelo;
        this.motor = new Motor(2.0, "Gasolina");  // Criado COM carro
    }
}

public class Motor {
    private double cilindrada;
    private String tipo;
    
    public Motor(double cilindrada, String tipo) {
        this.cilindrada = cilindrada;
        this.tipo = tipo;
    }
}

// Livro TEM Capítulos (capítulo é PARTE do livro)
public class Livro {
    private String titulo;
    private List<Capitulo> capitulos;  // Composição
    
    public Livro(String titulo) {
        this.titulo = titulo;
        this.capitulos = new ArrayList<>();
    }
    
    public void adicionarCapitulo(String tituloCapitulo, String conteudo) {
        this.capitulos.add(new Capitulo(tituloCapitulo, conteudo));
    }
}

public class Capitulo {
    private String titulo;
    private String conteudo;
}

// Empresa TEM Departamentos (departamento é PARTE da empresa)
public class Empresa {
    private String nome;
    private List<Departamento> departamentos;  // Composição
    
    public Empresa(String nome) {
        this.nome = nome;
        this.departamentos = new ArrayList<>();
        
        // Departamentos criados COM empresa
        this.departamentos.add(new Departamento("TI"));
        this.departamentos.add(new Departamento("RH"));
    }
}
```

**Tabela comparativa - Agregação vs Composição**:

| Aspecto | Agregação | Composição |
|---------|-----------|------------|
| **Força** | Fraca | Forte |
| **Ciclo de vida** | Independente | Dependente |
| **Criação** | Parte criada fora | Parte criada dentro |
| **Destruição** | Parte sobrevive | Parte morre junto |
| **Exemplo** | Time HAS Jogadores | Casa HAS Cômodos |
| **UML** | ◇ (vazio) | ◆ (cheio) |

### 4️⃣ Dependência - "Usa-um" Temporário

**Definição**: Dependência é o relacionamento mais **fraco** - um objeto **usa** outro **temporariamente**, geralmente como **parâmetro de método** ou **variável local**. Não há **propriedade** persistente.

**Características**:
- **Uso temporário** (não armazena referência)
- Geralmente via **parâmetro de método**
- UML: **seta tracejada - - - >**

**Exemplo clássico**:
```java
// Pedido DEPENDE de Impressora (usa temporariamente)
public class Pedido {
    private int numero;
    private double valor;
    
    // Recebe Impressora como PARÂMETRO (não armazena)
    public void imprimir(Impressora impressora) {  // DEPENDÊNCIA
        impressora.print("Pedido #" + numero);
        impressora.print("Valor: R$ " + valor);
        // Após método terminar, não tem mais relação com Impressora
    }
}

public class Impressora {
    public void print(String texto) {
        System.out.println(texto);
    }
}

// Uso
Pedido pedido = new Pedido(1001, 500);
Impressora impressora = new Impressora();

pedido.imprimir(impressora);  // Usa temporariamente
// Após execução, Pedido não "conhece" Impressora
```

**Mais exemplos de dependência**:
```java
// Calculadora DEPENDE de Logger (usa temporariamente)
public class Calculadora {
    
    public int somar(int a, int b, Logger logger) {  // DEPENDÊNCIA
        int resultado = a + b;
        logger.log("Soma realizada: " + a + " + " + b + " = " + resultado);
        return resultado;
    }
}

public class Logger {
    public void log(String mensagem) {
        System.out.println("[LOG] " + mensagem);
    }
}

// Validador DEPENDE de Regra (usa temporariamente)
public class Validador {
    
    public boolean validar(String valor, Regra regra) {  // DEPENDÊNCIA
        return regra.aplicar(valor);
    }
}

public interface Regra {
    boolean aplicar(String valor);
}

// Relatório DEPENDE de Formatador (usa temporariamente)
public class Relatorio {
    private List<String> dados;
    
    public String gerar(Formatador formatador) {  // DEPENDÊNCIA
        StringBuilder sb = new StringBuilder();
        for (String dado : dados) {
            sb.append(formatador.formatar(dado));
        }
        return sb.toString();
    }
}

public interface Formatador {
    String formatar(String dado);
}
```

**Dependência vs Associação**:
```java
// ❌ Dependência - NÃO armazena
public class A {
    public void metodo(B b) {  // Usa B temporariamente
        b.fazer();
    }
}

// ✓ Associação - armazena referência
public class A {
    private B b;  // Conhece B persistentemente
    
    public void metodo() {
        b.fazer();
    }
}
```

### 5️⃣ Herança - "É-um" Relacionamento Hierárquico

**Definição**: Herança estabelece relação **"is-a" (é-um)** onde classe **filha herda** atributos e métodos da classe **pai**. Representa **especialização**.

**Características**:
- Relacionamento mais **forte** e **acoplado**
- Filha **é-um** tipo de pai
- UML: **seta com triângulo ───▷**
- Java: palavra-chave **extends**

**Exemplo clássico**:
```java
// ContaPoupanca É-UMA Conta
public class Conta {
    protected String numero;
    protected double saldo;
    protected Cliente titular;
    
    public Conta(String numero, Cliente titular) {
        this.numero = numero;
        this.titular = titular;
        this.saldo = 0.0;
    }
    
    public void depositar(double valor) {
        this.saldo += valor;
    }
    
    public boolean sacar(double valor) {
        if (valor <= this.saldo) {
            this.saldo -= valor;
            return true;
        }
        return false;
    }
    
    public double getSaldo() {
        return this.saldo;
    }
}

// ContaPoupanca É-UMA Conta (herança)
public class ContaPoupanca extends Conta {  // IS-A
    private double taxaRendimento;
    
    public ContaPoupanca(String numero, Cliente titular, double taxa) {
        super(numero, titular);  // Chama construtor da superclasse
        this.taxaRendimento = taxa;
    }
    
    // ✓ Herda depositar(), sacar(), getSaldo()
    
    // Método específico
    public void renderJuros() {
        double juros = this.saldo * this.taxaRendimento;
        this.saldo += juros;
        System.out.println("Juros creditados: R$ " + juros);
    }
}

// ContaCorrente É-UMA Conta (herança)
public class ContaCorrente extends Conta {  // IS-A
    private double limite;
    
    public ContaCorrente(String numero, Cliente titular, double limite) {
        super(numero, titular);
        this.limite = limite;
    }
    
    // Sobrescreve sacar() para usar limite
    @Override
    public boolean sacar(double valor) {
        if (valor <= this.saldo + this.limite) {
            this.saldo -= valor;
            return true;
        }
        return false;
    }
}

// Uso - polimorfismo via herança
Conta conta1 = new ContaPoupanca("001", cliente, 0.05);
Conta conta2 = new ContaCorrente("002", cliente, 500);

conta1.depositar(1000);  // Método herdado
conta2.depositar(500);   // Método herdado

conta2.sacar(800);       // Método sobrescrito (usa limite)
```

**Hierarquia de classes**:
```java
// Nível 1: Animal
public class Animal {
    protected String nome;
    
    public void respirar() {
        System.out.println(nome + " está respirando");
    }
    
    public void comer() {
        System.out.println(nome + " está comendo");
    }
}

// Nível 2: Mamífero IS-A Animal
public class Mamifero extends Animal {
    public void amamentar() {
        System.out.println(nome + " está amamentando");
    }
}

// Nível 3: Cachorro IS-A Mamífero
public class Cachorro extends Mamifero {
    public void latir() {
        System.out.println(nome + " está latindo: Au au!");
    }
}

// Uso - Cachorro herda TUDO
Cachorro rex = new Cachorro();
rex.nome = "Rex";
rex.respirar();    // De Animal (avô)
rex.amamentar();   // De Mamífero (pai)
rex.latir();       // Próprio
```

**Quando usar herança**:
```java
// ✓ Relação "é-um" genuína
class Cachorro extends Animal { }  // Cachorro É Animal

// ❌ Relação "tem-um" indevida
class Carro extends Motor { }  // ❌ Carro NÃO É Motor
class Carro {
    private Motor motor;  // ✓ Carro TEM Motor
}

// ❌ Apenas para reutilizar código
class ArrayList extends List { }  // ❌ Se não for "é-um"
```

### 6️⃣ Multiplicidade de Relacionamentos

**Tipos de multiplicidade**:
- **1-para-1 (1:1)**: Uma entidade relaciona com UMA outra
- **1-para-N (1:N)**: Uma entidade relaciona com VÁRIAS outras
- **N-para-N (N:N)**: Várias entidades relacionam com VÁRIAS outras

**1-para-1 (One-to-One)**:
```java
// Pessoa TEM UM CPF, CPF pertence a UMA Pessoa
public class Pessoa {
    private String nome;
    private Cpf cpf;  // 1:1
    
    public Pessoa(String nome, String numeroCpf) {
        this.nome = nome;
        this.cpf = new Cpf(numeroCpf);  // Criado junto (composição)
    }
}

public class Cpf {
    private String numero;
    
    public Cpf(String numero) {
        this.numero = numero;
    }
}

// Usuario TEM UMA Conta, Conta pertence a UM Usuario
public class Usuario {
    private String login;
    private Conta conta;  // 1:1
}

public class Conta {
    private Usuario usuario;  // 1:1 bidirecional
}
```

**1-para-N (One-to-Many)**:
```java
// Cliente TEM MUITOS Pedidos
public class Cliente {
    private String nome;
    private List<Pedido> pedidos;  // 1:N
    
    public Cliente(String nome) {
        this.nome = nome;
        this.pedidos = new ArrayList<>();
    }
    
    public void adicionarPedido(Pedido pedido) {
        this.pedidos.add(pedido);
    }
}

public class Pedido {
    private int numero;
    private Cliente cliente;  // N:1 (inverso)
}

// Departamento TEM MUITOS Funcionários
public class Departamento {
    private String nome;
    private List<Funcionario> funcionarios;  // 1:N
}

public class Funcionario {
    private String nome;
    private Departamento departamento;  // N:1
}
```

**N-para-N (Many-to-Many)**:
```java
// Aluno tem MUITAS Disciplinas, Disciplina tem MUITOS Alunos
public class Aluno {
    private String nome;
    private List<Disciplina> disciplinas;  // N:N
    
    public void matricularEm(Disciplina disciplina) {
        this.disciplinas.add(disciplina);
        disciplina.adicionarAluno(this);  // Bidirecional
    }
}

public class Disciplina {
    private String nome;
    private List<Aluno> alunos;  // N:N
    
    public void adicionarAluno(Aluno aluno) {
        this.alunos.add(aluno);
    }
}

// Uso
Aluno joao = new Aluno("João");
Aluno maria = new Aluno("Maria");

Disciplina poo = new Disciplina("POO");
Disciplina bd = new Disciplina("Banco de Dados");

joao.matricularEm(poo);
joao.matricularEm(bd);
maria.matricularEm(poo);

// João está em POO e BD
// Maria está em POO
// POO tem João e Maria
// BD tem João
```

**N-para-N com classe associativa**:
```java
// Aluno e Disciplina com Matrícula (contém nota, data)
public class Aluno {
    private String nome;
    private List<Matricula> matriculas;  // N:N via associativa
}

public class Disciplina {
    private String nome;
    private List<Matricula> matriculas;  // N:N via associativa
}

public class Matricula {  // Classe associativa
    private Aluno aluno;
    private Disciplina disciplina;
    private double nota;
    private LocalDate dataMatricula;
    
    public Matricula(Aluno aluno, Disciplina disciplina) {
        this.aluno = aluno;
        this.disciplina = disciplina;
        this.dataMatricula = LocalDate.now();
    }
}
```

### 7️⃣ Navegabilidade - Unidirecional vs Bidirecional

**Unidirecional - A conhece B, mas B não conhece A**:
```java
// Cliente → Pedido (unidirecional)
public class Cliente {
    private List<Pedido> pedidos;  // Cliente conhece Pedidos
}

public class Pedido {
    // NÃO conhece Cliente
}

// Navegação possível:
// cliente.getPedidos() ✓
// pedido.getCliente() ❌
```

**Bidirecional - A conhece B e B conhece A**:
```java
// Cliente ↔ Pedido (bidirecional)
public class Cliente {
    private List<Pedido> pedidos;  // Cliente → Pedido
    
    public void adicionarPedido(Pedido pedido) {
        this.pedidos.add(pedido);
        pedido.setCliente(this);  // Estabelece relação reversa
    }
}

public class Pedido {
    private Cliente cliente;  // Pedido → Cliente
    
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}

// Navegação bidirecional:
// cliente.getPedidos().get(0).getCliente() == cliente ✓
```

### 8️⃣ Exemplo Completo - Sistema de Vendas

```java
// Sistema integrando todos os tipos de relacionamento

// HERANÇA - ContaEspecial É-UMA Conta
public class Conta {
    protected double saldo;
}

public class ContaEspecial extends Conta {  // IS-A
    private double limite;
}

// ASSOCIAÇÃO - Cliente conhece Pedidos
public class Cliente {
    private String nome;
    private List<Pedido> pedidos;  // Associação 1:N
    
    public void fazerPedido(Pedido pedido) {
        this.pedidos.add(pedido);
        pedido.setCliente(this);
    }
}

// COMPOSIÇÃO - Pedido TEM Itens (forte)
public class Pedido {
    private int numero;
    private Cliente cliente;  // Associação
    private List<ItemPedido> itens;  // Composição
    private Pagamento pagamento;  // Composição
    
    public Pedido(int numero, Cliente cliente) {
        this.numero = numero;
        this.cliente = cliente;
        this.itens = new ArrayList<>();  // Criados com Pedido
    }
    
    public void adicionarItem(Produto produto, int quantidade) {
        ItemPedido item = new ItemPedido(produto, quantidade);
        this.itens.add(item);  // Item parte do Pedido
    }
    
    // DEPENDÊNCIA - usa Cupom temporariamente
    public double calcularTotalComDesconto(Cupom cupom) {  // USES-A
        double total = calcularTotal();
        return cupom.aplicarDesconto(total);
    }
    
    private double calcularTotal() {
        return itens.stream()
            .mapToDouble(ItemPedido::getSubtotal)
            .sum();
    }
}

public class ItemPedido {
    private Produto produto;  // Associação
    private int quantidade;
    private double precoUnitario;
    
    public double getSubtotal() {
        return quantidade * precoUnitario;
    }
}

// AGREGAÇÃO - Categoria TEM Produtos (fraco)
public class Categoria {
    private String nome;
    private List<Produto> produtos;  // Agregação
    
    public void adicionarProduto(Produto produto) {
        this.produtos.add(produto);
        // Produto existe independente
    }
}

public class Produto {
    private String nome;
    private double preco;
}

public class Cupom {
    private double percentualDesconto;
    
    public double aplicarDesconto(double valor) {
        return valor * (1 - percentualDesconto / 100);
    }
}
```

### 9️⃣ Escolha do Relacionamento Correto

**Checklist de decisão**:
```
1. É uma relação "é-um"? → HERANÇA
   - Cachorro é Animal? Sim → extends

2. Parte existe sem todo? → AGREGAÇÃO
   - Funcionário existe sem Departamento? Sim → HAS-A fraco

3. Parte NÃO existe sem todo? → COMPOSIÇÃO
   - Cômodo existe sem Casa? Não → PART-OF forte

4. Objetos apenas se conhecem? → ASSOCIAÇÃO
   - Cliente conhece Pedidos? Sim → referência

5. Uso é temporário (parâmetro)? → DEPENDÊNCIA
   - Pedido usa Impressora sempre? Não → USES-A
```

### 🔟 Padrões e Anti-Padrões

**Anti-padrão - herança indevida**:
```java
// ❌ Quadrado extends Retângulo (viola LSP)
class Retangulo {
    protected int largura;
    protected int altura;
    
    public void setLargura(int l) { largura = l; }
    public void setAltura(int a) { altura = a; }
}

class Quadrado extends Retangulo {
    // Problema: Quadrado deve ter largura == altura
}

// ✓ Composição ou interface
interface Forma {
    double calcularArea();
}
```

**Padrão - preferir composição**:
```java
// ✓ Composição é mais flexível
public class Carro {
    private Motor motor;  // TEM-UM (composição)
    
    public void trocarMotor(Motor novoMotor) {
        this.motor = novoMotor;  // Flexível
    }
}
```

## 🎯 Aplicabilidade

**1. Associação**: Cliente-Pedido
**2. Agregação**: Time-Jogadores
**3. Composição**: Casa-Cômodos
**4. Dependência**: Serviço-Logger
**5. Herança**: ContaPoupanca-Conta

## ⚠️ Armadilhas Comuns

**1. Herança profunda**:
```java
// ❌ A → B → C → D → E
```

**2. Bidirecional desnecessário**:
```java
// ⚠️ Complexidade de manter sincronizado
```

**3. Composição quando deveria ser agregação**:
```java
// ❌ Departamento cria Funcionarios
```

**4. Dependência circular**:
```java
// ❌ A depende de B, B depende de A
```

**5. God class**:
```java
// ❌ Classe relaciona com 50 outras
```

## ✅ Boas Práticas

**1. Preferir composição sobre herança**:
```java
class Carro {
    private Motor motor;  // TEM-UM
}
```

**2. Manter baixo acoplamento**:
```java
// Dependência via interface
public void processar(Pagavel pagamento) { }
```

**3. Alta coesão**:
```java
// Classe foca em UMA responsabilidade
```

**4. Unidirecional quando possível**:
```java
// Reduz complexidade
```

**5. Documentar multiplicidade**:
```java
// Comentários ou constraints
```

## 📚 Resumo Executivo

**Cinco tipos de relacionamento**.

**Associação** (conhece):
```java
private Cliente cliente;
```

**Agregação** (tem-um fraco):
```java
private List<Funcionario> funcionarios;  // Existem sem Depto
```

**Composição** (parte-de forte):
```java
private List<Item> itens = new ArrayList<>();  // Criados com Pedido
```

**Dependência** (usa temporariamente):
```java
public void metodo(Logger logger) { }  // Parâmetro
```

**Herança** (é-um):
```java
class ContaPoupanca extends Conta { }
```

**Multiplicidade**:
- **1:1** - Pessoa-CPF
- **1:N** - Cliente-Pedidos
- **N:N** - Aluno-Disciplinas

**Navegabilidade**:
- **Uni**: A → B
- **Bi**: A ↔ B

**Recomendação**: **Escolha o relacionamento correto**. Use **herança para "é-um"**, **composição para "parte-de"**, **agregação para "tem-um" fraco**, **associação para "conhece"**, **dependência para uso temporário**. **Prefira composição** sobre herança, mantenha **baixo acoplamento**, **alta coesão**.