# T1.01 - Definição: Contrato de Comportamento

## Introdução

**Interface**: **contrato** que define **comportamentos** que uma classe deve implementar, sem especificar **como** implementar.

```java
public interface Voador {
    void voar();
    void pousar();
}

public class Aviao implements Voador {
    @Override
    public void voar() {
        System.out.println("Avião decolando...");
    }
    
    @Override
    public void pousar() {
        System.out.println("Avião pousando...");
    }
}
```

**Contrato**: interface define **o que** fazer, classe define **como** fazer.

**Benefícios**:
- **Abstração** (esconder implementação)
- **Polimorfismo** (múltiplas implementações)
- **Desacoplamento** (código flexível)
- **Múltiplas heranças de tipo** (uma classe implementa várias interfaces)

**Interface** ≠ **Implementação**:
- **Interface**: especificação (contrato)
- **Implementação**: código concreto

---

## Fundamentos

### 1. Interface Como Contrato

**Contrato**: interface define **obrigações** que implementador deve cumprir.

```java
public interface Pagavel {
    double calcularPagamento();
    void registrarPagamento();
}

public class Funcionario implements Pagavel {
    private double salario;
    
    @Override
    public double calcularPagamento() {
        return salario; // Como calcular
    }
    
    @Override
    public void registrarPagamento() {
        System.out.println("Pagamento registrado"); // Como registrar
    }
}
```

### 2. O Que vs Como

**Interface**: define **o que** (comportamento).
**Classe**: define **como** (implementação).

```java
// O QUE: interface
public interface Ordenavel {
    int comparar(Ordenavel outro); // O que fazer
}

// COMO: implementação
public class Produto implements Ordenavel {
    private double preco;
    
    @Override
    public int comparar(Ordenavel outro) {
        // Como comparar: por preço
        Produto outroProduto = (Produto) outro;
        return Double.compare(this.preco, outroProduto.preco);
    }
}
```

### 3. Abstração Total

Interface: **100% abstração** (sem implementação, exceto default/static em Java 8+).

```java
// Interface: abstração
public interface Desenhavel {
    void desenhar(); // Sem implementação
    void apagar();   // Sem implementação
}

// Implementação: concreta
public class Circulo implements Desenhavel {
    @Override
    public void desenhar() {
        System.out.println("Desenhando círculo");
    }
    
    @Override
    public void apagar() {
        System.out.println("Apagando círculo");
    }
}
```

### 4. Múltiplas Implementações

Mesmo **contrato**, **implementações** diferentes.

```java
public interface Notificador {
    void enviar(String mensagem);
}

public class EmailNotificador implements Notificador {
    @Override
    public void enviar(String mensagem) {
        System.out.println("Email: " + mensagem);
    }
}

public class SMSNotificador implements Notificador {
    @Override
    public void enviar(String mensagem) {
        System.out.println("SMS: " + mensagem);
    }
}

// Uso polimórfico
Notificador notificador = new EmailNotificador();
notificador.enviar("Olá"); // Email: Olá

notificador = new SMSNotificador();
notificador.enviar("Olá"); // SMS: Olá
```

### 5. Desacoplamento

Interface **desacopla** cliente de implementação.

```java
public interface RepositorioProduto {
    void salvar(Produto produto);
    Produto buscar(int id);
}

public class ProdutoService {
    private RepositorioProduto repositorio;
    
    public ProdutoService(RepositorioProduto repositorio) {
        this.repositorio = repositorio; // Depende de interface
    }
    
    public void salvarProduto(Produto produto) {
        repositorio.salvar(produto); // Não sabe qual implementação
    }
}

// Implementações diferentes
public class RepositorioDB implements RepositorioProduto {
    @Override
    public void salvar(Produto produto) {
        System.out.println("Salvando no banco de dados");
    }
    
    @Override
    public Produto buscar(int id) {
        return new Produto();
    }
}

public class RepositorioMemoria implements RepositorioProduto {
    @Override
    public void salvar(Produto produto) {
        System.out.println("Salvando em memória");
    }
    
    @Override
    public Produto buscar(int id) {
        return new Produto();
    }
}

// Uso: trocar implementação sem alterar ProdutoService
ProdutoService service1 = new ProdutoService(new RepositorioDB());
ProdutoService service2 = new ProdutoService(new RepositorioMemoria());
```

### 6. Polimorfismo com Interfaces

Interface permite **polimorfismo** (vários tipos, mesma referência).

```java
public interface Forma {
    double calcularArea();
}

public class Circulo implements Forma {
    private double raio;
    
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

public class Retangulo implements Forma {
    private double largura, altura;
    
    @Override
    public double calcularArea() {
        return largura * altura;
    }
}

// Polimorfismo
Forma forma1 = new Circulo();
Forma forma2 = new Retangulo();

List<Forma> formas = Arrays.asList(forma1, forma2);
for (Forma forma : formas) {
    System.out.println("Área: " + forma.calcularArea());
}
```

### 7. Garantia de Comportamento

Interface **garante** que implementação tenha determinados métodos.

```java
public interface Auditavel {
    void registrarLog();
    String obterUsuario();
}

// Qualquer classe Auditavel TEM registrarLog() e obterUsuario()
public void auditar(Auditavel objeto) {
    objeto.registrarLog(); // Garantido existir
    String usuario = objeto.obterUsuario(); // Garantido existir
}
```

### 8. Especificação vs Realização

**Especificação**: interface (o que).
**Realização**: classe (como).

```java
// ESPECIFICAÇÃO
public interface Calculadora {
    double somar(double a, double b);
    double subtrair(double a, double b);
}

// REALIZAÇÃO 1: básica
public class CalculadoraBasica implements Calculadora {
    @Override
    public double somar(double a, double b) {
        return a + b;
    }
    
    @Override
    public double subtrair(double a, double b) {
        return a - b;
    }
}

// REALIZAÇÃO 2: científica (com log)
public class CalculadoraCientifica implements Calculadora {
    @Override
    public double somar(double a, double b) {
        double resultado = a + b;
        System.out.println("Soma: " + a + " + " + b + " = " + resultado);
        return resultado;
    }
    
    @Override
    public double subtrair(double a, double b) {
        double resultado = a - b;
        System.out.println("Subtração: " + a + " - " + b + " = " + resultado);
        return resultado;
    }
}
```

### 9. Design by Contract

Interface: **design por contrato** (precondições, pós-condições).

```java
public interface Validador {
    /**
     * Valida objeto.
     * 
     * @param objeto objeto a validar (não pode ser null)
     * @return true se válido, false caso contrário
     * @throws IllegalArgumentException se objeto é null
     */
    boolean validar(Object objeto);
}

public class EmailValidador implements Validador {
    @Override
    public boolean validar(Object objeto) {
        if (objeto == null) {
            throw new IllegalArgumentException("Objeto não pode ser null");
        }
        String email = objeto.toString();
        return email.contains("@"); // Como validar
    }
}
```

### 10. Evolução de API

Interface permite **evoluir API** sem quebrar código existente (Java 8+: default methods).

```java
public interface Repositorio {
    void salvar(Object obj);
    Object buscar(int id);
    
    // Java 8+: método default (não quebra implementações antigas)
    default void atualizar(Object obj) {
        System.out.println("Atualização padrão");
    }
}

// Implementação antiga: continua funcionando
public class RepositorioAntigo implements Repositorio {
    @Override
    public void salvar(Object obj) { }
    
    @Override
    public Object buscar(int id) { return null; }
    
    // atualizar() herdado de interface (default)
}
```

---

## Aplicabilidade

**Use interface quando**:
- Definir **contrato** de comportamento
- **Polimorfismo** (múltiplas implementações)
- **Desacoplamento** (trocar implementação)
- **Múltiplas capacidades** (uma classe implementa várias interfaces)
- **Design por contrato** (especificação clara)
- **Testabilidade** (mocks e stubs)

**Evite interface quando**:
- Apenas **uma** implementação possível
- **Estado compartilhado** necessário (use classe abstrata)
- **Código reutilizável** (use herança ou composição)

---

## Armadilhas

### 1. Interface Sem Propósito

```java
// ❌ Interface desnecessária (única implementação)
public interface UsuarioService {
    void salvar(Usuario usuario);
}

public class UsuarioServiceImpl implements UsuarioService {
    @Override
    public void salvar(Usuario usuario) { }
}

// ✅ Classe direta (se não há polimorfismo)
public class UsuarioService {
    public void salvar(Usuario usuario) { }
}
```

### 2. Interface Como Namespace

```java
// ❌ Interface para constantes (antipatern)
public interface Constantes {
    int MAX_TENTATIVAS = 3;
    String URL_API = "http://api.exemplo.com";
}

// ✅ Classe final com construtor privado
public final class Constantes {
    private Constantes() { }
    
    public static final int MAX_TENTATIVAS = 3;
    public static final String URL_API = "http://api.exemplo.com";
}
```

### 3. Interface Muito Grande

```java
// ❌ Interface com muitos métodos
public interface GerenciadorCompleto {
    void salvar();
    void atualizar();
    void deletar();
    void validar();
    void enviarEmail();
    void gerarRelatorio();
    void exportarPDF();
}

// ✅ Segregar em interfaces menores (ISP)
public interface Persistivel {
    void salvar();
    void atualizar();
    void deletar();
}

public interface Notificavel {
    void enviarEmail();
}

public interface Relatorio {
    void gerarRelatorio();
    void exportarPDF();
}
```

### 4. Contrato Não Cumprido

```java
public interface Ordenavel {
    /**
     * Retorna valor positivo se this > outro,
     * negativo se this < outro, 0 se iguais
     */
    int comparar(Ordenavel outro);
}

// ❌ Implementação incorreta (não respeita contrato)
public class ProdutoErrado implements Ordenavel {
    @Override
    public int comparar(Ordenavel outro) {
        return 1; // Sempre retorna 1 (quebra contrato)
    }
}
```

### 5. Interface Vazia

```java
// ❌ Interface vazia (antipatern, exceto markers)
public interface Entidade {
}

// ✅ Interface com métodos ou usar annotation
public interface Entidade {
    int getId();
    void setId(int id);
}

// Ou annotation (moderno)
@Entity
public class Usuario { }
```

### 6. Implementação Parcial

```java
public interface Completo {
    void metodo1();
    void metodo2();
    void metodo3();
}

// ❌ Implementação parcial (não compila)
public class ParcialErrado implements Completo {
    @Override
    public void metodo1() { }
    // ❌ ERRO: metodo2() e metodo3() não implementados
}

// ✅ Classe abstrata para implementação parcial
public abstract class ParcialCorreto implements Completo {
    @Override
    public void metodo1() { }
    // metodo2() e metodo3() para subclasses
}
```

### 7. Interface com Estado

```java
// ❌ Interface não pode ter campos de instância
public interface ErradoComCampo {
    private String nome; // ❌ ERRO: interface não tem campos de instância
    void metodo();
}

// ✅ Interface com constantes (static final)
public interface CorretoComConstante {
    int MAX_TENTATIVAS = 3; // public static final implícito
    void metodo();
}

// ✅ Classe abstrata para estado
public abstract class ComEstado {
    protected String nome; // Campo de instância
    public abstract void metodo();
}
```

---

## Boas Práticas

### 1. Nomeação de Interfaces

```java
// ✅ Nomes descritivos (capacidade/comportamento)
public interface Runnable { }
public interface Comparable { }
public interface Serializable { }

// ✅ Sufixo -able/-ible (capaz de)
public interface Voador { }
public interface Pagavel { }

// ❌ Evite prefixo 'I' (convenção C#, não Java)
public interface IProduto { } // Evite

// ✅ Nome direto
public interface Produto { }
```

### 2. Interface Coesa

```java
// ✅ Interface pequena e focada (SRP)
public interface Persistivel {
    void salvar();
    void atualizar();
    void deletar();
}

public interface Validavel {
    boolean validar();
}

public interface Auditavel {
    void registrarLog();
}

// Classe implementa múltiplas interfaces
public class Usuario implements Persistivel, Validavel, Auditavel {
    @Override
    public void salvar() { }
    
    @Override
    public void atualizar() { }
    
    @Override
    public void deletar() { }
    
    @Override
    public boolean validar() { return true; }
    
    @Override
    public void registrarLog() { }
}
```

### 3. Documentação de Contrato

```java
public interface Repositorio<T> {
    /**
     * Salva entidade no repositório.
     * 
     * @param entidade entidade a salvar (não pode ser null)
     * @throws IllegalArgumentException se entidade é null
     * @throws PersistenceException se erro ao salvar
     */
    void salvar(T entidade);
    
    /**
     * Busca entidade por ID.
     * 
     * @param id ID da entidade (deve ser > 0)
     * @return entidade encontrada ou null se não existe
     * @throws IllegalArgumentException se id <= 0
     */
    T buscar(int id);
}
```

### 4. Dependency Injection

```java
// ✅ Depender de interface (DIP)
public class ProdutoService {
    private final RepositorioProduto repositorio;
    private final Notificador notificador;
    
    public ProdutoService(RepositorioProduto repositorio, Notificador notificador) {
        this.repositorio = repositorio;
        this.notificador = notificador;
    }
    
    public void salvarProduto(Produto produto) {
        repositorio.salvar(produto);
        notificador.enviar("Produto salvo: " + produto);
    }
}

// Injeção de implementações
RepositorioProduto repo = new RepositorioDB();
Notificador notif = new EmailNotificador();
ProdutoService service = new ProdutoService(repo, notif);
```

### 5. Strategy Pattern

```java
// Interface define estratégia
public interface EstrategiaDesconto {
    double calcularDesconto(double valor);
}

public class DescontoPercentual implements EstrategiaDesconto {
    private double percentual;
    
    public DescontoPercentual(double percentual) {
        this.percentual = percentual;
    }
    
    @Override
    public double calcularDesconto(double valor) {
        return valor * percentual / 100;
    }
}

public class DescontoFixo implements EstrategiaDesconto {
    private double valorFixo;
    
    public DescontoFixo(double valorFixo) {
        this.valorFixo = valorFixo;
    }
    
    @Override
    public double calcularDesconto(double valor) {
        return Math.min(valorFixo, valor);
    }
}

// Uso
public class Pedido {
    private EstrategiaDesconto estrategia;
    private double valor;
    
    public void setEstrategiaDesconto(EstrategiaDesconto estrategia) {
        this.estrategia = estrategia;
    }
    
    public double calcularTotal() {
        double desconto = estrategia.calcularDesconto(valor);
        return valor - desconto;
    }
}

Pedido pedido = new Pedido();
pedido.setEstrategiaDesconto(new DescontoPercentual(10)); // 10%
pedido.setEstrategiaDesconto(new DescontoFixo(50)); // R$ 50
```

### 6. Factory Pattern

```java
public interface Conexao {
    void conectar();
    void desconectar();
}

public class ConexaoMySQL implements Conexao {
    @Override
    public void conectar() {
        System.out.println("Conectando ao MySQL");
    }
    
    @Override
    public void desconectar() {
        System.out.println("Desconectando do MySQL");
    }
}

public class ConexaoPostgreSQL implements Conexao {
    @Override
    public void conectar() {
        System.out.println("Conectando ao PostgreSQL");
    }
    
    @Override
    public void desconectar() {
        System.out.println("Desconectando do PostgreSQL");
    }
}

// Factory
public class ConexaoFactory {
    public static Conexao criar(String tipo) {
        switch (tipo) {
            case "mysql": return new ConexaoMySQL();
            case "postgresql": return new ConexaoPostgreSQL();
            default: throw new IllegalArgumentException("Tipo inválido");
        }
    }
}

// Uso
Conexao conexao = ConexaoFactory.criar("mysql");
conexao.conectar();
```

### 7. Interface Segregation Principle (ISP)

```java
// ❌ Interface gorda
public interface TrabalhadorCompleto {
    void trabalhar();
    void comer();
    void dormir();
    void receberSalario();
}

// ✅ Interfaces segregadas
public interface Trabalhador {
    void trabalhar();
}

public interface Alimentavel {
    void comer();
}

public interface Descansavel {
    void dormir();
}

public interface Remuneravel {
    void receberSalario();
}

// Classes implementam apenas o necessário
public class Funcionario implements Trabalhador, Alimentavel, Descansavel, Remuneravel {
    @Override
    public void trabalhar() { }
    
    @Override
    public void comer() { }
    
    @Override
    public void dormir() { }
    
    @Override
    public void receberSalario() { }
}

public class Robo implements Trabalhador {
    @Override
    public void trabalhar() { }
    // Robô não come, dorme ou recebe salário
}
```

### 8. Template Method com Interface

```java
public interface ProcessadorPedido {
    void validarPedido();
    void calcularTotal();
    void aplicarDesconto();
    void finalizarPedido();
    
    default void processar() {
        validarPedido();
        calcularTotal();
        aplicarDesconto();
        finalizarPedido();
    }
}

public class PedidoOnline implements ProcessadorPedido {
    @Override
    public void validarPedido() {
        System.out.println("Validando pedido online");
    }
    
    @Override
    public void calcularTotal() {
        System.out.println("Calculando total + frete");
    }
    
    @Override
    public void aplicarDesconto() {
        System.out.println("Aplicando cupom");
    }
    
    @Override
    public void finalizarPedido() {
        System.out.println("Enviando email confirmação");
    }
}

// Uso: template já definido em processar()
ProcessadorPedido pedido = new PedidoOnline();
pedido.processar(); // Chama métodos na ordem
```

### 9. Interface para Testabilidade

```java
// Interface facilita mocking
public interface EmailService {
    void enviarEmail(String destinatario, String mensagem);
}

public class PedidoService {
    private EmailService emailService;
    
    public PedidoService(EmailService emailService) {
        this.emailService = emailService;
    }
    
    public void processarPedido(Pedido pedido) {
        // Processar pedido
        emailService.enviarEmail(pedido.getCliente(), "Pedido confirmado");
    }
}

// Teste: mock da interface
public class EmailServiceMock implements EmailService {
    public boolean emailEnviado = false;
    
    @Override
    public void enviarEmail(String destinatario, String mensagem) {
        emailEnviado = true; // Simula envio
    }
}

// Teste
EmailServiceMock mock = new EmailServiceMock();
PedidoService service = new PedidoService(mock);
service.processarPedido(new Pedido());
assert mock.emailEnviado; // Verifica se email foi "enviado"
```

### 10. Collections Framework

```java
// Collections Framework usa interfaces extensivamente
public class GerenciadorProdutos {
    // Depende de interface List, não ArrayList
    private List<Produto> produtos = new ArrayList<>();
    
    public void adicionarProduto(Produto produto) {
        produtos.add(produto);
    }
    
    // Aceita qualquer Collection
    public void adicionarTodos(Collection<Produto> novos) {
        produtos.addAll(novos);
    }
    
    // Retorna interface, não implementação
    public List<Produto> obterProdutos() {
        return new ArrayList<>(produtos); // Cópia defensiva
    }
}

// Uso flexível
GerenciadorProdutos gerenciador = new GerenciadorProdutos();
gerenciador.adicionarTodos(new ArrayList<>()); // ArrayList
gerenciador.adicionarTodos(new HashSet<>()); // HashSet
gerenciador.adicionarTodos(new LinkedList<>()); // LinkedList
```

---

## Resumo

**Interface**: **contrato** que define **comportamentos** sem especificar **implementação**.

```java
public interface Voador {
    void voar();
}

public class Aviao implements Voador {
    @Override
    public void voar() {
        System.out.println("Voando");
    }
}
```

**O que vs Como**:
- Interface: **o que** fazer
- Classe: **como** fazer

**Benefícios**:
- **Abstração** total
- **Polimorfismo** (múltiplas implementações)
- **Desacoplamento** (trocar implementação)
- **Múltiplas capacidades** (implementar várias interfaces)

**Polimorfismo**:
```java
Notificador notif = new EmailNotificador();
notif.enviar("Olá"); // Email

notif = new SMSNotificador();
notif.enviar("Olá"); // SMS
```

**Desacoplamento**:
```java
public class Service {
    private Repositorio repo; // Depende de interface
    
    public Service(Repositorio repo) {
        this.repo = repo; // Qualquer implementação
    }
}
```

**Design por contrato**:
```java
/**
 * @param objeto não pode ser null
 * @return true se válido
 * @throws IllegalArgumentException se objeto é null
 */
boolean validar(Object objeto);
```

**Quando usar**:
- Contrato de comportamento
- Polimorfismo
- Desacoplamento
- Múltiplas capacidades
- Testabilidade

**Evite**:
- Única implementação (sem polimorfismo)
- Interface como namespace (constantes)
- Interface muito grande (viole ISP)

**Boas práticas**:
- Nomes descritivos (-able/-ible)
- Interfaces pequenas e coesas (ISP)
- Documentar contrato
- Dependency Injection
- Strategy, Factory patterns

**Regra de Ouro**: Interface define **contrato** (**o que** fazer), classe define **implementação** (**como** fazer). Use para **polimorfismo**, **desacoplamento** e **múltiplas capacidades**. Mantenha interfaces **pequenas e coesas** (ISP). Documente **contratos** claramente. Dependa de **abstrações**, não implementações (DIP).
