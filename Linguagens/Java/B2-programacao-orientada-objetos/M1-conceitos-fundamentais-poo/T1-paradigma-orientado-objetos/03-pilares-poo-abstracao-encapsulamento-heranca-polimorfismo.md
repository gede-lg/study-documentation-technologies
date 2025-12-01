# Pilares da POO - Abstração, Encapsulamento, Herança e Polimorfismo

## 🎯 Introdução e Definição

**Os quatro pilares da Programação Orientada a Objetos** são os **conceitos fundamentais** que sustentam todo o paradigma. São eles:

1. **Abstração** - Esconder complexidade, mostrar apenas o essencial
2. **Encapsulamento** - Proteger dados, controlar acesso
3. **Herança** - Reutilizar código através de hierarquias
4. **Polimorfismo** - Múltiplas formas para mesma interface

**Conceito central**: Esses pilares **não funcionam isoladamente** - eles **trabalham juntos** para criar sistemas modulares, extensíveis e manuteníveis. **Abstração define "o quê"**, **encapsulamento protege "o como"**, **herança permite reutilização**, e **polimorfismo traz flexibilidade**.

**Analogia com construção civil**:
- **Abstração**: planta do edifício (mostra estrutura, esconde detalhes de encanamento)
- **Encapsulamento**: paredes que escondem fiação elétrica (acesso controlado via interruptores)
- **Herança**: casas térreas e sobrados compartilham fundações (código base reutilizado)
- **Polimorfismo**: mesmo interruptor aciona lâmpada ou ventilador (interface única, comportamentos diferentes)

**Exemplo fundamental**:
```java
// ABSTRAÇÃO - interface define "o quê" sem "como"
public interface Animal {
    void emitirSom();  // O que fazer
    void mover();      // Não especifica como
}

// ENCAPSULAMENTO - dados protegidos, acesso controlado
public class Cachorro implements Animal {
    private String nome;      // ✓ Protegido
    private int idade;        // ✓ Não acessível diretamente
    
    public String getNome() { // ✓ Acesso controlado
        return this.nome;
    }
    
    public void setIdade(int idade) {
        if (idade > 0) {      // ✓ Validação
            this.idade = idade;
        }
    }
    
    // POLIMORFISMO - implementação específica
    @Override
    public void emitirSom() {
        System.out.println("Au au!");  // Comportamento específico
    }
    
    @Override
    public void mover() {
        System.out.println("Correndo com 4 patas");
    }
}

// HERANÇA - reutilização de código
public class CachorroPolicialextends Cachorro {
    private String departamento;
    
    // ✓ Herda nome, idade, emitirSom(), mover()
    
    public void farejear() {  // Método específico
        System.out.println("Farejando...");
    }
}

// USO - pilares trabalhando juntos
Animal animal = new Cachorro();  // Polimorfismo
animal.emitirSom();              // Chama versão Cachorro
// animal.nome;                  // ❌ Encapsulamento impede acesso direto
```

**Os quatro pilares interagem**:
- **Abstração** cria contratos (interfaces/classes abstratas)
- **Encapsulamento** protege implementação desses contratos
- **Herança** permite especializar contratos reutilizando código
- **Polimorfismo** permite usar especializações de forma intercambiável

## 📋 Fundamentos Teóricos

### 1️⃣ Abstração - Esconder Complexidade

**Definição**: Abstração é o processo de **esconder detalhes de implementação** e **mostrar apenas funcionalidades essenciais**. Foca no **"o que faz"** ao invés de **"como faz"**.

**Mecanismos de abstração em Java**:
1. **Classes abstratas** (abstract class)
2. **Interfaces** (interface)

**Classe abstrata**:
```java
// Abstração - define estrutura sem implementação completa
public abstract class Forma {
    protected String cor;
    
    // Método abstrato - DEVE ser implementado
    public abstract double calcularArea();
    
    // Método concreto - pode ser herdado
    public void exibirCor() {
        System.out.println("Cor: " + this.cor);
    }
}

// Implementação concreta
public class Circulo extends Forma {
    private double raio;
    
    public Circulo(double raio, String cor) {
        this.raio = raio;
        this.cor = cor;
    }
    
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;  // Implementação específica
    }
}

public class Retangulo extends Forma {
    private double largura;
    private double altura;
    
    @Override
    public double calcularArea() {
        return largura * altura;  // Implementação diferente
    }
}

// Uso - trabalha com abstração
Forma forma1 = new Circulo(5, "vermelho");
Forma forma2 = new Retangulo(10, 20, "azul");

System.out.println(forma1.calcularArea());  // Abstrai detalhes
System.out.println(forma2.calcularArea());
```

**Interface - abstração pura**:
```java
// Interface - contrato sem implementação
public interface Pagavel {
    void processarPagamento(double valor);
    boolean verificarSaldo();
}

// Implementações diferentes
public class PagamentoCartao implements Pagavel {
    @Override
    public void processarPagamento(double valor) {
        System.out.println("Processando cartão: " + valor);
        // Lógica específica de cartão
    }
    
    @Override
    public boolean verificarSaldo() {
        // Verifica limite do cartão
        return true;
    }
}

public class PagamentoPix implements Pagavel {
    @Override
    public void processarPagamento(double valor) {
        System.out.println("Processando PIX: " + valor);
        // Lógica específica de PIX
    }
    
    @Override
    public boolean verificarSaldo() {
        // Verifica saldo em conta
        return true;
    }
}

// Código trabalha com abstração Pagavel
public class Pedido {
    public void finalizar(Pagavel pagamento, double valor) {
        if (pagamento.verificarSaldo()) {
            pagamento.processarPagamento(valor);
        }
    }
}

// Uso
Pagavel pag1 = new PagamentoCartao();
Pagavel pag2 = new PagamentoPix();

Pedido pedido = new Pedido();
pedido.finalizar(pag1, 100);  // Funciona com Cartao
pedido.finalizar(pag2, 200);  // Funciona com Pix
```

**Vantagens da abstração**:
- Reduz complexidade - usuário não precisa conhecer implementação
- Facilita manutenção - implementação pode mudar sem afetar código cliente
- Promove reutilização - código trabalha com abstrações genéricas

**Exemplo - abstração em API**:
```java
// ✓ Usuário usa List abstração
List<String> lista = new ArrayList<>();
lista.add("A");
lista.add("B");

// ✓ Pode trocar implementação facilmente
List<String> lista = new LinkedList<>();  // Mudança transparente
lista.add("A");
lista.add("B");

// Código que usa lista não precisa mudar!
```

### 2️⃣ Encapsulamento - Proteção de Dados

**Definição**: Encapsulamento é **esconder detalhes internos** de um objeto e **expor apenas o necessário** através de métodos públicos. Protege dados com **modificadores de acesso** (private, protected, public).

**Três níveis de acesso**:
1. **private** - acessível apenas dentro da classe
2. **protected** - acessível na classe e subclasses
3. **public** - acessível de qualquer lugar

**Encapsulamento adequado**:
```java
public class ContaBancaria {
    private double saldo;           // ✓ Dados privados
    private String titular;
    private String numeroConta;
    
    public ContaBancaria(String titular, String numeroConta) {
        this.titular = titular;
        this.numeroConta = numeroConta;
        this.saldo = 0.0;
    }
    
    // ✓ Acesso controlado com validação
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;
            System.out.println("Depósito realizado: " + valor);
        } else {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
    }
    
    public boolean sacar(double valor) {
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor;
            System.out.println("Saque realizado: " + valor);
            return true;
        } else {
            System.out.println("Saque negado");
            return false;
        }
    }
    
    // ✓ Getter sem setter (read-only para saldo)
    public double getSaldo() {
        return this.saldo;
    }
    
    // ✓ Método privado (auxiliar interno)
    private void registrarLog(String operacao) {
        System.out.println("LOG: " + operacao);
    }
}

// Uso
ContaBancaria conta = new ContaBancaria("João", "123");
conta.depositar(1000);   // ✓ Validado
conta.sacar(500);        // ✓ Validado
double saldo = conta.getSaldo();  // ✓ Acesso controlado

// conta.saldo = -500;   // ❌ Erro compilação - saldo é private
// conta.registrarLog(); // ❌ Erro compilação - método private
```

**Comparação - sem encapsulamento**:
```java
// ❌ Dados públicos - perigoso
public class ContaRuim {
    public double saldo;  // Qualquer um pode modificar!
    
    public static void main(String[] args) {
        ContaRuim conta = new ContaRuim();
        conta.saldo = 1000;
        
        // ❌ Qualquer código pode fazer besteira
        conta.saldo = -500;        // Saldo negativo!
        conta.saldo = 999999999;   // Valor absurdo!
        
        // Sem validação, sem controle, sem segurança
    }
}
```

**Encapsulamento com validação complexa**:
```java
public class Pessoa {
    private String nome;
    private int idade;
    private String cpf;
    
    public void setNome(String nome) {
        if (nome != null && !nome.trim().isEmpty()) {
            this.nome = nome;
        } else {
            throw new IllegalArgumentException("Nome inválido");
        }
    }
    
    public void setIdade(int idade) {
        if (idade >= 0 && idade <= 150) {
            this.idade = idade;
        } else {
            throw new IllegalArgumentException("Idade deve estar entre 0 e 150");
        }
    }
    
    public void setCpf(String cpf) {
        if (validarCPF(cpf)) {  // Validação complexa encapsulada
            this.cpf = cpf;
        } else {
            throw new IllegalArgumentException("CPF inválido");
        }
    }
    
    private boolean validarCPF(String cpf) {
        // Lógica complexa escondida
        return cpf != null && cpf.matches("\\d{11}");
    }
}
```

**Benefícios**:
- **Validação centralizada** - toda modificação passa por métodos
- **Proteção de invariantes** - garante estado consistente
- **Flexibilidade** - implementação interna pode mudar

### 3️⃣ Herança - Reutilização via Hierarquia

**Definição**: Herança permite que uma classe **herde atributos e métodos** de outra classe, promovendo **reutilização de código** e criando **hierarquias** de classes. Representa relação **"é-um" (is-a)**.

**Sintaxe**:
```java
public class ClasseFilha extends ClassePai {
    // Herda tudo de ClassePai
}
```

**Exemplo básico**:
```java
// Classe base (superclasse)
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

// Classe derivada (subclasse)
public class Carro extends Veiculo {
    private int numeroPortas;
    
    // ✓ Herda marca, modelo, ano, ligar(), desligar()
    
    public void abrirPortaMalas() {
        System.out.println("Porta-malas aberto");
    }
}

public class Moto extends Veiculo {
    private boolean temBagageiro;
    
    // ✓ Herda marca, modelo, ano, ligar(), desligar()
    
    public void empinar() {
        System.out.println("Empinando moto!");
    }
}

// Uso
Carro carro = new Carro();
carro.marca = "Toyota";     // ✓ Herdado de Veiculo
carro.ligar();              // ✓ Método herdado
carro.abrirPortaMalas();    // ✓ Método próprio

Moto moto = new Moto();
moto.ligar();               // ✓ Mesmo método de Veiculo
moto.empinar();             // ✓ Método específico
```

**Sobrescrita de métodos (@Override)**:
```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override  // Sobrescreve método da superclasse
    public void emitirSom() {
        System.out.println("Au au!");
    }
}

public class Gato extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Miau!");
    }
}

// Uso
Animal a1 = new Animal();
a1.emitirSom();  // "Som genérico"

Cachorro c = new Cachorro();
c.emitirSom();   // "Au au!"

Gato g = new Gato();
g.emitirSom();   // "Miau!"
```

**Palavra-chave super**:
```java
public class Conta {
    protected double saldo;
    
    public Conta(double saldoInicial) {
        this.saldo = saldoInicial;
    }
    
    public void sacar(double valor) {
        this.saldo -= valor;
    }
}

public class ContaPoupanca extends Conta {
    private double taxaRendimento;
    
    public ContaPoupanca(double saldoInicial, double taxa) {
        super(saldoInicial);  // ✓ Chama construtor da superclasse
        this.taxaRendimento = taxa;
    }
    
    @Override
    public void sacar(double valor) {
        super.sacar(valor);  // ✓ Chama método da superclasse
        System.out.println("Saque em poupança");
    }
}
```

**Hierarquias complexas**:
```java
// Nível 1
public class Animal {
    public void respirar() { }
}

// Nível 2
public class Mamifero extends Animal {
    public void amamentar() { }
}

// Nível 3
public class Cachorro extends Mamifero {
    public void latir() { }
}

// Cachorro herda: respirar() + amamentar() + latir()
Cachorro dog = new Cachorro();
dog.respirar();    // De Animal
dog.amamentar();   // De Mamifero
dog.latir();       // Próprio
```

**Limitações da herança**:
- Java **não permite herança múltipla** (uma classe só pode estender UMA classe)
- Use **interfaces** para múltiplos contratos

### 4️⃣ Polimorfismo - Múltiplas Formas

**Definição**: Polimorfismo permite que **objetos de diferentes classes** sejam tratados através de uma **interface comum**, com cada objeto respondendo de forma **específica** à mesma chamada de método.

**Dois tipos**:
1. **Polimorfismo de sobrecarga (overloading)** - mesmo nome, parâmetros diferentes
2. **Polimorfismo de sobrescrita (overriding)** - subclasse redefine método

**Polimorfismo de sobrescrita (runtime polymorphism)**:
```java
public class Forma {
    public void desenhar() {
        System.out.println("Desenhando forma genérica");
    }
}

public class Circulo extends Forma {
    @Override
    public void desenhar() {
        System.out.println("Desenhando círculo");
    }
}

public class Quadrado extends Forma {
    @Override
    public void desenhar() {
        System.out.println("Desenhando quadrado");
    }
}

// ✓ Polimorfismo - mesma referência, comportamentos diferentes
Forma f1 = new Circulo();
Forma f2 = new Quadrado();
Forma f3 = new Forma();

f1.desenhar();  // "Desenhando círculo"
f2.desenhar();  // "Desenhando quadrado"
f3.desenhar();  // "Desenhando forma genérica"

// Array polimórfico
Forma[] formas = {new Circulo(), new Quadrado(), new Forma()};
for (Forma f : formas) {
    f.desenhar();  // Cada um chama sua própria versão!
}
```

**Polimorfismo de sobrecarga (compile-time polymorphism)**:
```java
public class Calculadora {
    // Mesmo nome, parâmetros diferentes
    public int somar(int a, int b) {
        return a + b;
    }
    
    public double somar(double a, double b) {
        return a + b;
    }
    
    public int somar(int a, int b, int c) {
        return a + b + c;
    }
}

// Uso
Calculadora calc = new Calculadora();
calc.somar(2, 3);        // Chama int somar(int, int)
calc.somar(2.5, 3.7);    // Chama double somar(double, double)
calc.somar(1, 2, 3);     // Chama int somar(int, int, int)
```

**Polimorfismo com interfaces**:
```java
public interface Trabalhador {
    void trabalhar();
}

public class Programador implements Trabalhador {
    @Override
    public void trabalhar() {
        System.out.println("Escrevendo código");
    }
}

public class Professor implements Trabalhador {
    @Override
    public void trabalhar() {
        System.out.println("Dando aula");
    }
}

// ✓ Código genérico funciona com qualquer Trabalhador
public class Empresa {
    public void iniciarExpediente(Trabalhador trabalhador) {
        trabalhador.trabalhar();  // Polimorfismo!
    }
}

// Uso
Empresa empresa = new Empresa();
empresa.iniciarExpediente(new Programador());  // "Escrevendo código"
empresa.iniciarExpediente(new Professor());    // "Dando aula"
```

**Upcasting e downcasting**:
```java
// Upcasting - implícito (seguro)
Animal animal = new Cachorro();  // ✓ Cachorro É-UM Animal
animal.emitirSom();

// Downcasting - explícito (pode falhar)
Animal a = new Cachorro();
if (a instanceof Cachorro) {
    Cachorro c = (Cachorro) a;  // ✓ Cast seguro
    c.latir();
}
```

### 5️⃣ Interação entre os Quatro Pilares

**Exemplo integrando todos os pilares**:
```java
// ABSTRAÇÃO - contrato
public interface Notificavel {
    void enviarNotificacao(String mensagem);
}

// ENCAPSULAMENTO + ABSTRAÇÃO
public abstract class CanalNotificacao implements Notificavel {
    protected String destinatario;  // Protected (encapsulamento parcial)
    private boolean ativo;          // Private (encapsulamento total)
    
    public CanalNotificacao(String destinatario) {
        this.destinatario = destinatario;
        this.ativo = true;
    }
    
    // Método abstrato
    public abstract void enviarNotificacao(String mensagem);
    
    // Método concreto
    public void desativar() {
        this.ativo = false;
    }
    
    protected boolean isAtivo() {
        return this.ativo;
    }
}

// HERANÇA + POLIMORFISMO
public class EmailNotificacao extends CanalNotificacao {
    private String servidor;
    
    public EmailNotificacao(String email, String servidor) {
        super(email);  // Chama construtor da superclasse
        this.servidor = servidor;
    }
    
    @Override  // Polimorfismo de sobrescrita
    public void enviarNotificacao(String mensagem) {
        if (isAtivo()) {
            System.out.println("Email para " + destinatario + ": " + mensagem);
            System.out.println("Servidor: " + servidor);
        }
    }
}

public class SMSNotificacao extends CanalNotificacao {
    private String operadora;
    
    public SMSNotificacao(String telefone, String operadora) {
        super(telefone);
        this.operadora = operadora;
    }
    
    @Override  // Polimorfismo de sobrescrita
    public void enviarNotificacao(String mensagem) {
        if (isAtivo()) {
            System.out.println("SMS para " + destinatario + ": " + mensagem);
            System.out.println("Operadora: " + operadora);
        }
    }
}

// Uso - todos os pilares em ação
public class SistemaNotificacao {
    private List<Notificavel> canais;  // ABSTRAÇÃO (interface)
    
    public void adicionarCanal(Notificavel canal) {
        canais.add(canal);
    }
    
    public void notificarTodos(String mensagem) {
        for (Notificavel canal : canais) {
            canal.enviarNotificacao(mensagem);  // POLIMORFISMO
        }
    }
}

// Cliente
SistemaNotificacao sistema = new SistemaNotificacao();
sistema.adicionarCanal(new EmailNotificacao("user@example.com", "smtp.gmail.com"));
sistema.adicionarCanal(new SMSNotificacao("11999999999", "Vivo"));

sistema.notificarTodos("Sistema atualizado");
// ABSTRAÇÃO: trabalha com interface Notificavel
// ENCAPSULAMENTO: dados protegidos (destinatario, ativo, servidor)
// HERANÇA: Email e SMS herdam de CanalNotificacao
// POLIMORFISMO: cada canal executa enviarNotificacao() de forma específica
```

## 🎯 Aplicabilidade

**1. Frameworks**:
```java
public abstract class HttpServlet {
    protected abstract void doGet();  // Abstração
    protected abstract void doPost(); // Usuário implementa
}
```

**2. APIs**:
```java
public interface List<E> {  // Abstração
    boolean add(E e);
    E get(int index);
}
// ArrayList, LinkedList implementam (polimorfismo)
```

**3. Padrões de projeto**:
```java
// Factory Method (usa todos os pilares)
public abstract class DocumentFactory {
    public abstract Document createDocument();
}
```

**4. Sistemas de negócio**:
```java
public class Pedido {
    private List<Item> itens;  // Encapsulamento
    private Pagamento pagamento;  // Composição
}
```

## ⚠️ Armadilhas Comuns

**1. Hierarquia profunda demais**:
```java
// ❌ Difícil manter
A → B → C → D → E → F
// ✓ Prefira composição
```

**2. Herança indevida**:
```java
// ❌ Quadrado NÃO É Retângulo (LSP violation)
class Quadrado extends Retangulo { }
```

**3. Getters/setters sem validação**:
```java
// ⚠️ Encapsulamento fraco
public void setIdade(int i) {
    idade = i;  // Sem validar
}
```

**4. Classes públicas demais**:
```java
// ❌ Tudo public
public int saldo;
public String senha;
```

**5. Abstrações vazias**:
```java
// ❌ Interface sem significado
public interface Coisa {
    void fazer();
}
```

## ✅ Boas Práticas

**1. Sempre encapsular**:
```java
private double saldo;  // Nunca public
```

**2. Favorecer composição**:
```java
class Carro {
    private Motor motor;  // TEM-UM (não extends)
}
```

**3. Programar para interface**:
```java
List<String> lista = new ArrayList<>();  // Não ArrayList lista
```

**4. Usar @Override**:
```java
@Override
public void metodo() { }  // Documenta sobrescrita
```

**5. Herança para "é-um"**:
```java
// ✓ Cachorro É Animal
class Cachorro extends Animal { }
```

## 📚 Resumo Executivo

**Os quatro pilares sustentam POO**.

**Abstração**:
```java
interface Pagavel { void pagar(); }  // Define "o quê"
```

**Encapsulamento**:
```java
private double saldo;  // Protege
public double getSaldo() { }  // Controla
```

**Herança**:
```java
class B extends A { }  // Reutiliza código
```

**Polimorfismo**:
```java
Animal a = new Cachorro();
a.emitirSom();  // Chama versão Cachorro
```

**Interação**:
- **Abstração** define contratos
- **Encapsulamento** protege implementação
- **Herança** reutiliza código base
- **Polimorfismo** permite flexibilidade

**Analogias**:
- **Abstração**: controle remoto (esconde circuitos)
- **Encapsulamento**: caixa forte (protege conteúdo)
- **Herança**: DNA (características herdadas)
- **Polimorfismo**: tomada universal (mesma interface, dispositivos diferentes)

**Recomendação**: **Combine os quatro pilares**. Use **interfaces para abstração**, **private para encapsulamento**, **herança quando "é-um"** (preferindo composição), e **polimorfismo para flexibilidade**. Esses princípios criam código **modular, testável e manutenível**.