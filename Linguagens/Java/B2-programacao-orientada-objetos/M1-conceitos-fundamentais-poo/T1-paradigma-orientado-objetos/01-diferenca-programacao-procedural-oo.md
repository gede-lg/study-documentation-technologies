# T1.01 - Diferença entre Programação Procedural e Orientada a Objetos

## Introdução

**Programação Procedural** = foco em **funções/procedimentos** que manipulam **dados**.

**Programação Orientada a Objetos (POO)** = foco em **objetos** que **combinam dados e comportamento**.

```java
// ❌ Procedural: dados separados de funções
class ContaBancariaApp {
    // Dados soltos
    static String titular = "João";
    static double saldo = 1000.0;
    
    // Funções que manipulam os dados
    static void depositar(double valor) {
        saldo += valor;
    }
    
    static void sacar(double valor) {
        if (saldo >= valor) {
            saldo -= valor;
        }
    }
}

// ✅ OO: dados + comportamento juntos
class ContaBancaria {
    // Dados (atributos)
    private String titular;
    private double saldo;
    
    // Comportamento (métodos)
    public void depositar(double valor) {
        this.saldo += valor;
    }
    
    public void sacar(double valor) {
        if (this.saldo >= valor) {
            this.saldo -= valor;
        }
    }
}
```

**POO** = dados + comportamento **encapsulados** em objetos.

---

## Fundamentos

### 1. Foco: Funções vs Objetos

```java
// ❌ PROCEDURAL: Foco em funções
class CalculadoraSalario {
    // Funções processam dados passados como parâmetros
    static double calcularSalarioLiquido(double salarioBruto, double descontos) {
        return salarioBruto - descontos;
    }
    
    static double calcularINSS(double salarioBruto) {
        return salarioBruto * 0.11;
    }
    
    static double calcularIR(double salarioBruto) {
        if (salarioBruto <= 1903.98) return 0;
        if (salarioBruto <= 2826.65) return salarioBruto * 0.075;
        if (salarioBruto <= 3751.05) return salarioBruto * 0.15;
        if (salarioBruto <= 4664.68) return salarioBruto * 0.225;
        return salarioBruto * 0.275;
    }
    
    public static void main(String[] args) {
        // Dados soltos
        double salarioBruto = 5000.0;
        
        // Chamar funções passando dados
        double inss = calcularINSS(salarioBruto);
        double ir = calcularIR(salarioBruto);
        double salarioLiquido = calcularSalarioLiquido(salarioBruto, inss + ir);
        
        System.out.println("Salário Líquido: " + salarioLiquido);
    }
}

// ✅ ORIENTADO A OBJETOS: Foco em objetos
class Funcionario {
    // Dados (atributos)
    private String nome;
    private double salarioBruto;
    
    // Construtor
    public Funcionario(String nome, double salarioBruto) {
        this.nome = nome;
        this.salarioBruto = salarioBruto;
    }
    
    // Comportamento (métodos do objeto)
    public double calcularINSS() {
        return this.salarioBruto * 0.11;
    }
    
    public double calcularIR() {
        if (salarioBruto <= 1903.98) return 0;
        if (salarioBruto <= 2826.65) return salarioBruto * 0.075;
        if (salarioBruto <= 3751.05) return salarioBruto * 0.15;
        if (salarioBruto <= 4664.68) return salarioBruto * 0.225;
        return salarioBruto * 0.275;
    }
    
    public double calcularSalarioLiquido() {
        return this.salarioBruto - calcularINSS() - calcularIR();
    }
    
    public void exibirContraCheque() {
        System.out.println("=== Contracheque ===");
        System.out.println("Funcionário: " + this.nome);
        System.out.println("Salário Bruto: R$ " + this.salarioBruto);
        System.out.println("INSS: R$ " + calcularINSS());
        System.out.println("IR: R$ " + calcularIR());
        System.out.println("Salário Líquido: R$ " + calcularSalarioLiquido());
    }
}

class Main {
    public static void main(String[] args) {
        // Criar objeto que combina dados + comportamento
        Funcionario funcionario = new Funcionario("João Silva", 5000.0);
        
        // Objeto sabe como se comportar
        funcionario.exibirContraCheque();
    }
}
```

**Procedural**: dados passados para funções.  
**OO**: objetos **conhecem seus próprios dados** e **comportamento**.

### 2. Organização: Dados vs Objetos

```java
// ❌ PROCEDURAL: Dados em arrays/variáveis soltas
class SistemaEstoque {
    static String[] nomeProdutos = new String[100];
    static double[] precos = new double[100];
    static int[] quantidades = new int[100];
    static int contador = 0;
    
    static void adicionarProduto(String nome, double preco, int quantidade) {
        nomeProdutos[contador] = nome;
        precos[contador] = preco;
        quantidades[contador] = quantidade;
        contador++;
    }
    
    static void listarProdutos() {
        for (int i = 0; i < contador; i++) {
            System.out.println(nomeProdutos[i] + " - R$ " + precos[i] + 
                             " - Qtd: " + quantidades[i]);
        }
    }
    
    static double calcularValorEstoque() {
        double total = 0;
        for (int i = 0; i < contador; i++) {
            total += precos[i] * quantidades[i];
        }
        return total;
    }
}

// ✅ ORIENTADO A OBJETOS: Objetos encapsulam dados + comportamento
class Produto {
    private String nome;
    private double preco;
    private int quantidade;
    
    public Produto(String nome, double preco, int quantidade) {
        this.nome = nome;
        this.preco = preco;
        this.quantidade = quantidade;
    }
    
    public double calcularValorTotal() {
        return this.preco * this.quantidade;
    }
    
    public void exibir() {
        System.out.println(this.nome + " - R$ " + this.preco + 
                         " - Qtd: " + this.quantidade);
    }
    
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public int getQuantidade() { return quantidade; }
}

class Estoque {
    private List<Produto> produtos = new ArrayList<>();
    
    public void adicionarProduto(Produto produto) {
        produtos.add(produto);
    }
    
    public void listarProdutos() {
        for (Produto produto : produtos) {
            produto.exibir();
        }
    }
    
    public double calcularValorTotal() {
        double total = 0;
        for (Produto produto : produtos) {
            total += produto.calcularValorTotal();
        }
        return total;
    }
}

class Main {
    public static void main(String[] args) {
        Estoque estoque = new Estoque();
        estoque.adicionarProduto(new Produto("Notebook", 3000, 5));
        estoque.adicionarProduto(new Produto("Mouse", 50, 20));
        
        estoque.listarProdutos();
        System.out.println("Valor Total: R$ " + estoque.calcularValorTotal());
    }
}
```

**Procedural**: arrays paralelos, índices sincronizados.  
**OO**: objetos agrupam dados relacionados.

### 3. Reutilização: Cópia vs Herança

```java
// ❌ PROCEDURAL: Duplicar código
class CalculadoraGeometria {
    static double calcularAreaCirculo(double raio) {
        return Math.PI * raio * raio;
    }
    
    static double calcularPerimetroCirculo(double raio) {
        return 2 * Math.PI * raio;
    }
    
    static double calcularAreaRetangulo(double largura, double altura) {
        return largura * altura;
    }
    
    static double calcularPerimetroRetangulo(double largura, double altura) {
        return 2 * (largura + altura);
    }
    
    // ⚠️ Código duplicado para cada forma
}

// ✅ ORIENTADO A OBJETOS: Herança reutiliza código
abstract class Forma {
    protected String cor;
    
    public Forma(String cor) {
        this.cor = cor;
    }
    
    // Método comum a todas as formas
    public void exibir() {
        System.out.println("Forma: cor " + cor);
    }
    
    // Métodos abstratos para subclasses implementarem
    public abstract double calcularArea();
    public abstract double calcularPerimetro();
}

class Circulo extends Forma {
    private double raio;
    
    public Circulo(String cor, double raio) {
        super(cor);
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
}

class Retangulo extends Forma {
    private double largura;
    private double altura;
    
    public Retangulo(String cor, double largura, double altura) {
        super(cor);
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
}

class Main {
    public static void main(String[] args) {
        Forma circulo = new Circulo("Vermelho", 5);
        Forma retangulo = new Retangulo("Azul", 10, 20);
        
        // Polimorfismo: tratar todas as formas de maneira uniforme
        List<Forma> formas = List.of(circulo, retangulo);
        
        for (Forma forma : formas) {
            forma.exibir();
            System.out.println("Área: " + forma.calcularArea());
            System.out.println("Perímetro: " + forma.calcularPerimetro());
        }
    }
}
```

**Procedural**: copiar/colar código.  
**OO**: herança reutiliza e estende código.

### 4. Manutenção: Espalhado vs Localizado

```java
// ❌ PROCEDURAL: Lógica espalhada
class SistemaVendas {
    static double aplicarDesconto(double valor, String tipoCliente) {
        // Lógica espalhada em vários lugares
        if (tipoCliente.equals("VIP")) {
            return valor * 0.8;  // 20% desconto
        } else if (tipoCliente.equals("NORMAL")) {
            return valor * 0.95;  // 5% desconto
        } else {
            return valor;
        }
    }
    
    static double calcularFrete(double valor, String tipoCliente) {
        // Lógica duplicada
        if (tipoCliente.equals("VIP")) {
            return 0;  // Frete grátis
        } else {
            return 15.0;
        }
    }
    
    // ⚠️ Se adicionar novo tipo, precisa mudar em vários lugares
}

// ✅ ORIENTADO A OBJETOS: Lógica localizada em classes
abstract class Cliente {
    protected String nome;
    
    public Cliente(String nome) {
        this.nome = nome;
    }
    
    // Cada tipo de cliente sabe seu desconto
    public abstract double aplicarDesconto(double valor);
    public abstract double calcularFrete();
}

class ClienteVIP extends Cliente {
    public ClienteVIP(String nome) {
        super(nome);
    }
    
    @Override
    public double aplicarDesconto(double valor) {
        return valor * 0.8;  // 20% desconto
    }
    
    @Override
    public double calcularFrete() {
        return 0;  // Frete grátis
    }
}

class ClienteNormal extends Cliente {
    public ClienteNormal(String nome) {
        super(nome);
    }
    
    @Override
    public double aplicarDesconto(double valor) {
        return valor * 0.95;  // 5% desconto
    }
    
    @Override
    public double calcularFrete() {
        return 15.0;
    }
}

// ✅ Adicionar novo tipo: criar nova classe (não mudar existentes)
class ClientePremium extends Cliente {
    public ClientePremium(String nome) {
        super(nome);
    }
    
    @Override
    public double aplicarDesconto(double valor) {
        return valor * 0.7;  // 30% desconto
    }
    
    @Override
    public double calcularFrete() {
        return 0;
    }
}
```

**Procedural**: lógica espalhada em ifs/switches.  
**OO**: lógica localizada em classes (polimorfismo).

### 5. Acesso: Global vs Encapsulado

```java
// ❌ PROCEDURAL: Dados públicos/globais
class ContadorApp {
    // Dados acessíveis diretamente
    static int contador = 0;
    
    static void incrementar() {
        contador++;
    }
    
    public static void main(String[] args) {
        incrementar();
        // ⚠️ Qualquer código pode modificar diretamente
        contador = 999;  // Não há controle
        System.out.println(contador);
    }
}

// ✅ ORIENTADO A OBJETOS: Dados privados + métodos públicos
class Contador {
    // Dados privados (encapsulados)
    private int valor = 0;
    
    // Acesso controlado via métodos públicos
    public void incrementar() {
        valor++;
    }
    
    public void decrementar() {
        if (valor > 0) {  // Validação
            valor--;
        }
    }
    
    public int getValor() {
        return valor;
    }
    
    // ✅ Não há setter: valor só pode mudar via incrementar/decrementar
}

class Main {
    public static void main(String[] args) {
        Contador contador = new Contador();
        contador.incrementar();
        
        // ✅ Não pode fazer: contador.valor = 999; (erro de compilação)
        // ✅ Dados protegidos, acesso controlado
        
        System.out.println(contador.getValor());
    }
}
```

**Procedural**: dados expostos (global/public).  
**OO**: dados protegidos (private) + acesso controlado (public methods).

### 6. Estado: Funções sem Estado vs Objetos com Estado

```java
// ❌ PROCEDURAL: Funções sem estado (stateless)
class CalculadoraJuros {
    // Funções sempre calculam do zero
    static double calcularJurosSimples(double capital, double taxa, int meses) {
        return capital * taxa * meses;
    }
    
    static double calcularMontante(double capital, double taxa, int meses) {
        return capital + calcularJurosSimples(capital, taxa, meses);
    }
    
    // ⚠️ Não armazena estado, sempre recalcula
}

// ✅ ORIENTADO A OBJETOS: Objetos mantêm estado
class ContaPoupanca {
    // Estado (atributos)
    private double saldo;
    private double taxaJuros;
    
    public ContaPoupanca(double saldoInicial, double taxaJuros) {
        this.saldo = saldoInicial;
        this.taxaJuros = taxaJuros;
    }
    
    // Comportamento que modifica o estado
    public void aplicarJurosMensal() {
        double juros = saldo * taxaJuros;
        saldo += juros;
    }
    
    public void depositar(double valor) {
        saldo += valor;
    }
    
    public double getSaldo() {
        return saldo;
    }
}

class Main {
    public static void main(String[] args) {
        ContaPoupanca conta = new ContaPoupanca(1000, 0.005);
        
        // Objeto mantém estado
        conta.aplicarJurosMensal();  // saldo = 1005
        conta.depositar(500);         // saldo = 1505
        conta.aplicarJurosMensal();  // saldo = 1512.525
        
        System.out.println("Saldo: R$ " + conta.getSaldo());
    }
}
```

**Procedural**: funções sem estado (stateless).  
**OO**: objetos mantêm estado (stateful).

### 7. Complexidade: Linear vs Hierárquica

```java
// ❌ PROCEDURAL: Estrutura linear
class ProcessadorPagamento {
    static void processar(String tipo, double valor) {
        if (tipo.equals("CARTAO_CREDITO")) {
            // Processar cartão de crédito
            System.out.println("Processando cartão de crédito: R$ " + valor);
        } else if (tipo.equals("CARTAO_DEBITO")) {
            // Processar cartão de débito
            System.out.println("Processando cartão de débito: R$ " + valor);
        } else if (tipo.equals("PIX")) {
            // Processar PIX
            System.out.println("Processando PIX: R$ " + valor);
        } else if (tipo.equals("BOLETO")) {
            // Processar boleto
            System.out.println("Processando boleto: R$ " + valor);
        }
        // ⚠️ Adicionar novo tipo = modificar esta função
    }
}

// ✅ ORIENTADO A OBJETOS: Hierarquia de classes
abstract class FormaPagamento {
    protected double valor;
    
    public FormaPagamento(double valor) {
        this.valor = valor;
    }
    
    public abstract void processar();
}

class CartaoCredito extends FormaPagamento {
    public CartaoCredito(double valor) {
        super(valor);
    }
    
    @Override
    public void processar() {
        System.out.println("Processando cartão de crédito: R$ " + valor);
    }
}

class CartaoDebito extends FormaPagamento {
    public CartaoDebito(double valor) {
        super(valor);
    }
    
    @Override
    public void processar() {
        System.out.println("Processando cartão de débito: R$ " + valor);
    }
}

class Pix extends FormaPagamento {
    public Pix(double valor) {
        super(valor);
    }
    
    @Override
    public void processar() {
        System.out.println("Processando PIX: R$ " + valor);
    }
}

// ✅ Adicionar novo tipo = nova classe (não modifica existentes)
class Boleto extends FormaPagamento {
    public Boleto(double valor) {
        super(valor);
    }
    
    @Override
    public void processar() {
        System.out.println("Processando boleto: R$ " + valor);
    }
}

class Main {
    public static void main(String[] args) {
        List<FormaPagamento> pagamentos = List.of(
            new CartaoCredito(100),
            new Pix(200),
            new Boleto(300)
        );
        
        for (FormaPagamento pagamento : pagamentos) {
            pagamento.processar();  // Polimorfismo
        }
    }
}
```

**Procedural**: estrutura linear (if/else).  
**OO**: estrutura hierárquica (herança + polimorfismo).

### 8. Testabilidade: Difícil vs Fácil

```java
// ❌ PROCEDURAL: Difícil testar (dependências globais)
class GeradorRelatorio {
    static Connection conexao = conectarBancoDados();  // Global
    
    static Connection conectarBancoDados() {
        // Conecta ao banco real
        return DriverManager.getConnection("jdbc:mysql://...");
    }
    
    static List<String> buscarDados() {
        // Usa conexão global
        // ⚠️ Difícil testar sem banco real
        return ...;
    }
    
    static void gerarRelatorio() {
        List<String> dados = buscarDados();
        // ⚠️ Sempre precisa de banco real para testar
    }
}

// ✅ ORIENTADO A OBJETOS: Fácil testar (injeção de dependência)
interface RepositorioDados {
    List<String> buscarDados();
}

class RepositorioBancoDados implements RepositorioDados {
    private Connection conexao;
    
    public RepositorioBancoDados(Connection conexao) {
        this.conexao = conexao;
    }
    
    @Override
    public List<String> buscarDados() {
        // Usa banco real
        return ...;
    }
}

class RepositorioMock implements RepositorioDados {
    @Override
    public List<String> buscarDados() {
        // Retorna dados falsos para testes
        return List.of("Dado 1", "Dado 2", "Dado 3");
    }
}

class GeradorRelatorio {
    private RepositorioDados repositorio;
    
    // Injeção de dependência
    public GeradorRelatorio(RepositorioDados repositorio) {
        this.repositorio = repositorio;
    }
    
    public void gerarRelatorio() {
        List<String> dados = repositorio.buscarDados();
        // Processa dados
    }
}

// ✅ Teste
class GeradorRelatorioTest {
    @Test
    public void testarGeracao() {
        // Mock substitui banco real
        RepositorioDados mock = new RepositorioMock();
        GeradorRelatorio gerador = new GeradorRelatorio(mock);
        
        gerador.gerarRelatorio();
        // ✅ Testa sem banco real
    }
}
```

**Procedural**: dependências globais = difícil testar.  
**OO**: injeção de dependências = fácil testar.

### 9. Modularidade: Monolítico vs Modular

```java
// ❌ PROCEDURAL: Código monolítico
class SistemaEcommerce {
    static void processarPedido(int pedidoId) {
        // Validar pedido
        // Calcular total
        // Processar pagamento
        // Enviar email
        // Atualizar estoque
        // Gerar nota fiscal
        // ⚠️ Tudo em uma função gigante
    }
}

// ✅ ORIENTADO A OBJETOS: Código modular
class Pedido {
    private int id;
    private List<ItemPedido> itens;
    
    public double calcularTotal() {
        return itens.stream()
            .mapToDouble(ItemPedido::calcularSubtotal)
            .sum();
    }
}

class ProcessadorPagamento {
    public void processar(Pedido pedido, FormaPagamento forma) {
        // Lógica de pagamento isolada
    }
}

class ServicoEmail {
    public void enviarConfirmacao(Pedido pedido) {
        // Lógica de email isolada
    }
}

class GeradorNotaFiscal {
    public NotaFiscal gerar(Pedido pedido) {
        // Lógica de nota fiscal isolada
        return new NotaFiscal(pedido);
    }
}

class Estoque {
    public void atualizar(Pedido pedido) {
        // Lógica de estoque isolada
    }
}

// ✅ Orquestrador
class ProcessadorPedido {
    private ProcessadorPagamento pagamento;
    private ServicoEmail email;
    private GeradorNotaFiscal notaFiscal;
    private Estoque estoque;
    
    public void processar(Pedido pedido, FormaPagamento forma) {
        pagamento.processar(pedido, forma);
        email.enviarConfirmacao(pedido);
        notaFiscal.gerar(pedido);
        estoque.atualizar(pedido);
        // ✅ Cada responsabilidade em classe separada
    }
}
```

**Procedural**: funções grandes e monolíticas.  
**OO**: classes pequenas e modulares (SRP - Single Responsibility).

### 10. Extensibilidade: Modificar vs Estender

```java
// ❌ PROCEDURAL: Modificar código existente
class CalculadoraDesconto {
    static double calcular(double valor, String tipo) {
        if (tipo.equals("BLACKFRIDAY")) {
            return valor * 0.5;
        } else if (tipo.equals("NATAL")) {
            return valor * 0.7;
        }
        // ⚠️ Adicionar novo desconto = modificar esta função
        return valor;
    }
}

// ✅ ORIENTADO A OBJETOS: Estender sem modificar (Open/Closed Principle)
interface EstrategiaDesconto {
    double calcular(double valor);
}

class DescontoBlackFriday implements EstrategiaDesconto {
    @Override
    public double calcular(double valor) {
        return valor * 0.5;
    }
}

class DescontoNatal implements EstrategiaDesconto {
    @Override
    public double calcular(double valor) {
        return valor * 0.7;
    }
}

// ✅ Adicionar novo desconto = nova classe (não modifica existentes)
class DescontoPascoa implements EstrategiaDesconto {
    @Override
    public double calcular(double valor) {
        return valor * 0.8;
    }
}

class Produto {
    private double preco;
    private EstrategiaDesconto desconto;
    
    public Produto(double preco) {
        this.preco = preco;
    }
    
    public void setEstrategiaDesconto(EstrategiaDesconto desconto) {
        this.desconto = desconto;
    }
    
    public double getPrecoComDesconto() {
        if (desconto != null) {
            return desconto.calcular(preco);
        }
        return preco;
    }
}
```

**Procedural**: modificar código existente (quebra funcionamento).  
**OO**: estender com novas classes (código existente intacto).

---

## Aplicabilidade

**Programação Procedural** quando:
- Scripts simples
- Processamento linear de dados
- Projetos pequenos
- Performance crítica (C, algoritmos matemáticos)

**Programação Orientada a Objetos** quando:
- Sistemas complexos
- Múltiplas entidades interagindo
- Reutilização de código
- Manutenção longo prazo
- Múltiplos desenvolvedores
- Domínio rico (negócio)

---

## Armadilhas

### 1. POO Desnecessária em Scripts Simples

```java
// ⚠️ Over-engineering
class CalculadoraSimples {
    public int somar(int a, int b) {
        return a + b;
    }
}

// ✅ Script simples: procedural adequado
int soma = a + b;
```

### 2. Procedural em Sistemas Grandes

```java
// ❌ Sistema grande com procedural = difícil manter
static void processarTudo() {
    // 1000 linhas de código
    // ⚠️ Impossível entender/manter
}
```

### 3. Misturar Paradigmas Sem Critério

```java
// ⚠️ Classe com métodos static acessando dados globais
class Usuario {
    static String nomeGlobal;  // ⚠️ Não é OO
    
    void setNome(String nome) {
        nomeGlobal = nome;  // ⚠️ Mistura paradigmas
    }
}
```

---

## Boas Práticas

### 1. Escolher Paradigma por Contexto

```java
// ✅ Script simples: procedural
public static void main(String[] args) {
    double resultado = calcular(10, 20);
    System.out.println(resultado);
}

// ✅ Sistema complexo: OO
Pedido pedido = new Pedido();
pedido.adicionarItem(item);
processador.processar(pedido);
```

### 2. Encapsular Dados em OO

```java
// ✅ Sempre private + getters/setters
class Pessoa {
    private String nome;  // ✅ Private
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
```

### 3. Usar Herança e Polimorfismo

```java
// ✅ Hierarquia de classes
abstract class Animal {
    abstract void emitirSom();
}

class Cachorro extends Animal {
    @Override void emitirSom() { System.out.println("Au au"); }
}
```

---

## Resumo

**Programação Procedural**:
- Foco: **funções**
- Organização: **dados separados**
- Reutilização: **copiar código**
- Manutenção: **lógica espalhada**
- Acesso: **global/public**
- Estado: **stateless**
- Complexidade: **linear (if/else)**

**Programação Orientada a Objetos**:
- Foco: **objetos**
- Organização: **dados + comportamento juntos**
- Reutilização: **herança**
- Manutenção: **lógica localizada (polimorfismo)**
- Acesso: **private + métodos públicos**
- Estado: **stateful**
- Complexidade: **hierárquica (classes)**

**Quando usar OO**:
- Sistemas **complexos**
- Múltiplas **entidades**
- **Reutilização** de código
- **Manutenção** longo prazo
- Múltiplos **desenvolvedores**

**Regra de Ouro**: **POO** combina **dados** e **comportamento** em **objetos encapsulados**. Usar **herança** para reutilizar código. **Polimorfismo** para substituir if/else. **Encapsulamento** protege dados. **OO** >>> **Procedural** para sistemas complexos.
