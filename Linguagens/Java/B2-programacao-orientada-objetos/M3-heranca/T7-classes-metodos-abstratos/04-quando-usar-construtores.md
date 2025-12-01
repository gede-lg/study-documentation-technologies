# Quando Usar Classes Abstratas e Construtores em Abstratas

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Quando usar classe abstrata:** Quando há **código compartilhado** (métodos concretos), **estado compartilhado** (atributos), **hierarquia is-a** (relacionamento de tipo), e algumas funcionalidades variam por subtipo (métodos abstratos). **Construtores em abstratas** inicializam estado compartilhado, validam invariantes, executam lógica comum - chamados via `super()` de subclasses concretas.

Conceitualmente, classe abstrata é escolhida quando **generalização tem substância** - não é apenas contrato vazio, mas base com implementação reutilizável. Construtor em abstrata serve mesmo propósito que em concreta: **garantir que objeto nasce válido**, mas objeto criado é sempre subclasse concreta. Analogia: projeto arquitetônico de "casa" tem especificações de fundação, estrutura (construtor inicializa), mas casa real é sempre tipo específico (sobrado, apartamento).

Propósito de dominar "quando usar" é **evitar over-engineering** (abstrata desnecessária) e **under-engineering** (interface quando deveria ser abstrata). Construtor em abstrata evita **duplicação de código de inicialização** em todas subclasses - centraliza validação e setup de estado compartilhado.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Critérios de Uso:** Código compartilhado, estado, hierarquia is-a
2. **Construtores:** Inicializam estado compartilhado via `super()`
3. **Validação Centralizada:** Construtor valida invariantes uma vez
4. **Modificadores:** Construtores podem ser `protected` para restringir herança
5. **Não São Herdados:** Subclasse deve chamar explicitamente via `super()`
6. **Template de Inicialização:** Construtor pode executar lógica comum

---

## 🧠 Fundamentos Teóricos

### Quando Usar Classe Abstrata: Critérios

**✅ Critério 1: Há Código Compartilhado**

```java
// ✅ Classe abstrata: comportamento compartilhado
abstract class Funcionario {
    protected String nome;
    protected String cpf;
    protected double salarioBase;

    public Funcionario(String nome, String cpf, double salarioBase) {
        this.nome = nome;
        this.cpf = cpf;
        this.salarioBase = salarioBase;
    }

    // ✅ Método concreto: COMPARTILHADO por todas subclasses
    public void exibirDados() {
        System.out.println("=== Dados do Funcionário ===");
        System.out.println("Nome: " + nome);
        System.out.println("CPF: " + cpf);
        System.out.println("Salário: R$ " + calcularSalario());
        System.out.println("==========================");
    }

    // Cálculo varia por tipo
    public abstract double calcularSalario();
}

class Gerente extends Funcionario {
    private double bonus;

    public Gerente(String nome, String cpf, double salarioBase, double bonus) {
        super(nome, cpf, salarioBase);
        this.bonus = bonus;
    }

    @Override
    public double calcularSalario() {
        return salarioBase + bonus;
    }
    // Herda exibirDados() - não precisa reimplementar
}

class Vendedor extends Funcionario {
    private double comissao;

    public Vendedor(String nome, String cpf, double salarioBase, double comissao) {
        super(nome, cpf, salarioBase);
        this.comissao = comissao;
    }

    @Override
    public double calcularSalario() {
        return salarioBase + comissao;
    }
    // Herda exibirDados() - não precisa reimplementar
}

// Uso:
Funcionario f1 = new Gerente("Maria", "123", 5000, 2000);
Funcionario f2 = new Vendedor("João", "456", 3000, 1500);

f1.exibirDados();  // Método compartilhado
f2.exibirDados();
```

**Análise:** `exibirDados()` é **idêntico** para Gerente, Vendedor, Estagiário - não há razão para reimplementar em cada subclasse. Classe abstrata permite **reutilização** - escrito uma vez, herdado por todos.

**✅ Critério 2: Há Estado Compartilhado**

```java
// ✅ Classe abstrata: atributos compartilhados
abstract class Veiculo {
    protected String marca;
    protected String modelo;
    protected int ano;
    protected double kilometragem;

    public Veiculo(String marca, String modelo, int ano) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.kilometragem = 0;
    }

    // Estado compartilhado usado por todos
    public void viajar(double km) {
        kilometragem += km;
    }

    public double getKilometragem() {
        return kilometragem;
    }

    // Consumo varia por tipo
    public abstract double calcularConsumo(double distancia);
}

class Carro extends Veiculo {
    private double consumoPorKm = 0.1;  // 10 km/litro

    public Carro(String marca, String modelo, int ano) {
        super(marca, modelo, ano);
    }

    @Override
    public double calcularConsumo(double distancia) {
        return distancia * consumoPorKm;
    }
}

class Moto extends Veiculo {
    private double consumoPorKm = 0.05;  // 20 km/litro

    public Moto(String marca, String modelo, int ano) {
        super(marca, modelo, ano);
    }

    @Override
    public double calcularConsumo(double distancia) {
        return distancia * consumoPorKm;
    }
}
```

**Análise:** Todos veículos têm marca, modelo, ano, kilometragem - **estado compartilhado**. Classe abstrata centraliza esses atributos. Interface não pode ter atributos de instância.

**✅ Critério 3: Hierarquia "Is-A" Clara**

```java
// ✅ Abstrata: hierarquia de tipos
abstract class Animal {
    public abstract void emitirSom();
}

class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au");
    }
}

class Gato extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Miau");
    }
}

// Cachorro IS-A Animal
// Gato IS-A Animal
// Hierarquia natural de tipos

// ✅ Interface: capacidade sem hierarquia
interface Voador {
    void voar();
}

class Aviao implements Voador {
    @Override
    public void voar() {
        System.out.println("Avião voando");
    }
}

class Passaro implements Voador {
    @Override
    public void voar() {
        System.out.println("Pássaro voando");
    }
}

// Avião CAN-FLY (não IS-A Voador)
// Pássaro CAN-FLY (não IS-A Voador)
// Não há hierarquia de tipo - é capacidade
```

**Análise:** Se relacionamento é **is-a** (tipo/subtipo), use classe abstrata. Se é **can-do** (capacidade), use interface.

### Construtores em Classes Abstratas: Propósito

**Inicializar Estado Compartilhado**

```java
abstract class Conta {
    protected String numeroConta;
    protected String titular;
    protected double saldo;
    protected LocalDateTime dataAbertura;

    // ✅ Construtor inicializa estado compartilhado
    public Conta(String numeroConta, String titular) {
        this.numeroConta = numeroConta;
        this.titular = titular;
        this.saldo = 0.0;
        this.dataAbertura = LocalDateTime.now();
    }

    public void depositar(double valor) {
        saldo += valor;
    }

    public double getSaldo() {
        return saldo;
    }

    public abstract void sacar(double valor);
}

class ContaCorrente extends Conta {
    private double limite;

    public ContaCorrente(String numeroConta, String titular, double limite) {
        super(numeroConta, titular);  // Inicializa estado de Conta
        this.limite = limite;
    }

    @Override
    public void sacar(double valor) {
        if (saldo + limite >= valor) {
            saldo -= valor;
        }
    }
}

class ContaPoupanca extends Conta {
    public ContaPoupanca(String numeroConta, String titular) {
        super(numeroConta, titular);  // Inicializa estado de Conta
    }

    @Override
    public void sacar(double valor) {
        if (saldo >= valor) {
            saldo -= valor;
        }
    }
}
```

**Análise:** Construtor de `Conta` inicializa `numeroConta`, `titular`, `saldo`, `dataAbertura` - compartilhados por ContaCorrente e ContaPoupanca. Sem construtor abstrato, cada subclasse duplicaria inicialização.

**Validação Centralizada**

```java
abstract class Produto {
    protected String nome;
    protected double preco;
    protected String codigo;

    // ✅ Construtor valida invariantes
    public Produto(String nome, double preco, String codigo) {
        // Validação centralizada - executada para TODAS subclasses
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }
        if (codigo == null || !codigo.matches("\\d{10}")) {
            throw new IllegalArgumentException("Código deve ter 10 dígitos");
        }

        this.nome = nome;
        this.preco = preco;
        this.codigo = codigo;
    }

    public abstract double calcularPrecoFinal();
}

class ProdutoFisico extends Produto {
    private double peso;

    public ProdutoFisico(String nome, double preco, String codigo, double peso) {
        super(nome, preco, codigo);  // Validação executada aqui
        this.peso = peso;
    }

    @Override
    public double calcularPrecoFinal() {
        return preco + (peso * 5);  // Frete baseado em peso
    }
}

// ❌ Não pode criar produto inválido
// ProdutoFisico p = new ProdutoFisico("", -10, "abc", 5);  // EXCEÇÃO!

// ✅ Validação garantida
ProdutoFisico p = new ProdutoFisico("Livro", 50, "1234567890", 0.5);
```

**Análise:** Validação em construtor abstrato garante que **todas subclasses nascem válidas** - não importa se é ProdutoFisico, ProdutoDigital, ProdutoPerecivel, validação é obrigatória.

**Lógica de Inicialização Comum**

```java
abstract class Entidade {
    protected Long id;
    protected LocalDateTime dataCriacao;
    protected LocalDateTime dataModificacao;

    // ✅ Construtor executa lógica comum
    public Entidade() {
        this.id = gerarId();  // Gera ID único
        this.dataCriacao = LocalDateTime.now();
        this.dataModificacao = LocalDateTime.now();
        System.out.println("Entidade criada: " + this.getClass().getSimpleName());
    }

    private static Long contador = 0L;

    private Long gerarId() {
        return ++contador;
    }

    protected void marcarModificacao() {
        this.dataModificacao = LocalDateTime.now();
    }
}

class Usuario extends Entidade {
    private String nome;

    public Usuario(String nome) {
        super();  // Gera ID, timestamps, log
        this.nome = nome;
    }
}

class Produto extends Entidade {
    private String descricao;

    public Produto(String descricao) {
        super();  // Gera ID, timestamps, log
        this.descricao = descricao;
    }
}

// Uso:
Usuario u = new Usuario("João");
// "Entidade criada: Usuario"
// u.id = 1, dataCriacao/dataModificacao setados

Produto p = new Produto("Cadeira");
// "Entidade criada: Produto"
// p.id = 2, dataCriacao/dataModificacao setados
```

**Análise:** Construtor abstrato executa **lógica de setup** comum - gerar IDs, timestamps, logging, registro em cache. Todas subclasses herdam comportamento de inicialização.

---

## 🔍 Análise Conceitual Profunda

### Construtor `protected` vs `public`

```java
// ✅ Construtor protected: restringe quem pode herdar
abstract class FrameworkBase {
    protected String versao;

    // ✅ protected: apenas subclasses no mesmo pacote ou que herdam
    protected FrameworkBase(String versao) {
        this.versao = versao;
        validarLicenca();  // Lógica interna importante
    }

    private void validarLicenca() {
        // Validação crítica
    }
}

// Mesmo pacote ou subclasse pode estender
class MinhaImplementacao extends FrameworkBase {
    public MinhaImplementacao() {
        super("1.0");
    }
}

// ✅ Construtor public: qualquer um pode herdar
abstract class Animal {
    protected String nome;

    public Animal(String nome) {
        this.nome = nome;
    }
}

// Qualquer pacote pode estender
class MeuAnimal extends Animal {
    public MeuAnimal(String nome) {
        super(nome);
    }
}
```

**Análise:** Construtor `protected` **restringe extensão** - útil para frameworks que não querem herança irrestrita. Construtor `public` permite extensão livre.

### Encadeamento de Construtores em Hierarquias

```java
abstract class Veiculo {
    protected String marca;

    public Veiculo(String marca) {
        System.out.println("1. Construtor Veiculo");
        this.marca = marca;
    }
}

abstract class VeiculoTerrestre extends Veiculo {
    protected int numeroRodas;

    public VeiculoTerrestre(String marca, int numeroRodas) {
        super(marca);  // Chama Veiculo primeiro
        System.out.println("2. Construtor VeiculoTerrestre");
        this.numeroRodas = numeroRodas;
    }
}

class Carro extends VeiculoTerrestre {
    private String modelo;

    public Carro(String marca, String modelo) {
        super(marca, 4);  // Chama VeiculoTerrestre
        System.out.println("3. Construtor Carro");
        this.modelo = modelo;
    }
}

// Uso:
Carro c = new Carro("Toyota", "Corolla");
// Saída:
// 1. Construtor Veiculo
// 2. Construtor VeiculoTerrestre
// 3. Construtor Carro

// Ordem: Superclasse → Intermediária → Concreta
```

**Análise:** Construtores executam em **ordem hierárquica**: raiz primeiro, concreta por último. Cada nível inicializa sua parte do estado.

### Construtor Sem Parâmetros vs Com Parâmetros

```java
// ❌ Construtor sem parâmetros pode permitir estado inválido
abstract class Ruim {
    protected String nome;

    public Ruim() {
        // nome fica null - estado inválido
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}

class SubRuim extends Ruim {
    public SubRuim() {
        super();  // nome ainda null
    }
}

// SubRuim s = new SubRuim();  // Estado inválido!

// ✅ Construtor com parâmetros força inicialização válida
abstract class Bom {
    protected final String nome;

    public Bom(String nome) {
        if (nome == null || nome.isEmpty()) {
            throw new IllegalArgumentException("Nome obrigatório");
        }
        this.nome = nome;
    }
}

class SubBom extends Bom {
    public SubBom(String nome) {
        super(nome);  // Obrigatório passar nome
    }
}

// SubBom s = new SubBom("João");  // Sempre válido
```

**Análise:** Construtor com parâmetros **força** subclasses a fornecer valores obrigatórios. Campos `final` garantem que são inicializados exatamente uma vez.

---

## 🎯 Aplicabilidade e Contextos

### Exemplo Completo: Sistema de Formas Geométricas

```java
abstract class Forma {
    protected String cor;
    protected int espessuraLinha;
    protected boolean preenchido;

    // ✅ Construtor inicializa estado compartilhado
    public Forma(String cor, int espessuraLinha, boolean preenchido) {
        if (cor == null || cor.isEmpty()) {
            throw new IllegalArgumentException("Cor obrigatória");
        }
        if (espessuraLinha < 1) {
            throw new IllegalArgumentException("Espessura deve ser >= 1");
        }

        this.cor = cor;
        this.espessuraLinha = espessuraLinha;
        this.preenchido = preenchido;
    }

    // ✅ Método concreto compartilhado
    public void exibirInformacoes() {
        System.out.println("=== Forma Geométrica ===");
        System.out.println("Cor: " + cor);
        System.out.println("Espessura: " + espessuraLinha);
        System.out.println("Preenchido: " + (preenchido ? "Sim" : "Não"));
        System.out.println("Área: " + calcularArea());
        System.out.println("Perímetro: " + calcularPerimetro());
        System.out.println("======================");
    }

    // ✅ Métodos abstratos - cada forma calcula diferente
    public abstract double calcularArea();
    public abstract double calcularPerimetro();
    public abstract void desenhar();
}

class Circulo extends Forma {
    private double raio;

    public Circulo(String cor, int espessura, boolean preenchido, double raio) {
        super(cor, espessura, preenchido);  // Valida e inicializa base
        if (raio <= 0) {
            throw new IllegalArgumentException("Raio deve ser positivo");
        }
        this.raio = raio;
    }

    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }

    @Override
    public double calcularPerimetro() {
        return 2 * Math.PI * raio;
    }

    @Override
    public void desenhar() {
        System.out.println("Desenhando círculo " + cor);
    }
}

class Retangulo extends Forma {
    private double largura;
    private double altura;

    public Retangulo(String cor, int espessura, boolean preenchido,
                     double largura, double altura) {
        super(cor, espessura, preenchido);
        if (largura <= 0 || altura <= 0) {
            throw new IllegalArgumentException("Dimensões devem ser positivas");
        }
        this.largura = largura;
        this.altura = altura;
    }

    @Override
    public double calcularArea() {
        return largura * altura;
    }

    @Override
    public double calcularPerimetro() {
        return 2 * (largura + altura);
    }

    @Override
    public void desenhar() {
        System.out.println("Desenhando retângulo " + cor);
    }
}

// Uso:
Forma f1 = new Circulo("vermelho", 2, true, 5);
Forma f2 = new Retangulo("azul", 1, false, 4, 6);

f1.exibirInformacoes();  // Método herdado
f2.exibirInformacoes();
```

---

## ⚠️ Limitações e Considerações

### Construtor Não Pode Chamar Métodos Abstratos

```java
abstract class Perigoso {
    protected String nome;

    public Perigoso(String nome) {
        this.nome = nome;
        inicializar();  // ❌ PERIGOSO: chama método abstrato
    }

    // Método abstrato
    protected abstract void inicializar();
}

class Concreto extends Perigoso {
    private List<String> dados = new ArrayList<>();

    public Concreto(String nome) {
        super(nome);  // Chama construtor de Perigoso
    }

    @Override
    protected void inicializar() {
        // ❌ PROBLEMA: dados ainda é null aqui!
        // Construtor de Concreto ainda não executou
        dados.add("item");  // NullPointerException!
    }
}
```

**Limitação:** Construtor não deve chamar métodos abstratos - subclasse ainda não foi inicializada quando superclasse executa.

### Construtor Abstrato Não É Herdado

```java
abstract class Base {
    public Base(String parametro) {
        // ...
    }
}

class Derivada extends Base {
    // ❌ ERRO: não compilaif not calling super
    public Derivada() {
        // Compilador insere super() implícito
        // Mas Base não tem construtor sem parâmetros!
    }

    // ✅ Deve chamar super explicitamente
    public Derivada(String parametro) {
        super(parametro);
    }
}
```

**Consideração:** Se superclasse não tem construtor sem parâmetros, subclasse **deve** chamar `super(...)` explicitamente.

---

## 🔗 Interconexões Conceituais

### Relação com Herança

Construtores em abstratas dependem de **herança** - são chamados via `super()` de subclasses.

### Relação com Encapsulamento

Construtores abstratos centralizam **validação** - encapsulam lógica de inicialização válida.

### Relação com Template Method

Construtores podem executar **template de inicialização** - passos fixos + hooks para subclasses.

---

## 🚀 Evolução e Próximos Conceitos

### Progressão: Builder Pattern

Builder é alternativa a construtores complexos - mutável durante construção, produz imutável.

### Direção: Factory Method

Factory methods abstratos retornam instâncias - padrão de criação.

### Caminho: Dependency Injection

Frameworks injetam dependências via construtor - inicialização controlada.

---

## 📚 Conclusão

Use classe abstrata quando há código/estado compartilhado e hierarquia is-a. Construtores em abstratas inicializam estado compartilhado, validam invariantes, executam lógica comum - chamados via `super()` de subclasses. Centralizam inicialização, evitam duplicação, garantem objetos válidos.

Dominar quando usar e construtores significa:
- Usar abstrata quando há implementação ou estado reutilizável
- Criar construtores com parâmetros para forçar inicialização válida
- Centralizar validação em construtor abstrato
- Usar `protected` para restringir extensão quando apropriado
- Evitar chamar métodos abstratos em construtores
- Reconhecer ordem de execução: superclasse → subclasse
- Aplicar em hierarquias com estado/comportamento compartilhado
- Escolher interface quando não há implementação compartilhada

Classe abstrata não é "classe que não instancia" - é **ferramenta de abstração com substância**. Use quando generalização tem código/estado real, não apenas contrato. Construtor abstrato não é anomalia - é **mecanismo de inicialização compartilhada** que garante todas subclasses nascem válidas, sem duplicar validação/setup. `Forma(cor, espessura)` valida uma vez, Círculo/Quadrado herdam garantia - corretude centralizada, manutenibilidade maximizada.
