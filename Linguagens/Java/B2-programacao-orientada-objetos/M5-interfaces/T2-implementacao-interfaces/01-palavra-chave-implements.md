# T2.01 - Palavra-chave implements

## Introdução

**implements**: palavra-chave para classe implementar interface.

```java
public interface Voador {
    void voar();
}

// Classe implementa interface
public class Passaro implements Voador {
    @Override
    public void voar() {
        System.out.println("Pássaro voando");
    }
}

// Uso: polimorfismo
Voador voador = new Passaro();
voador.voar(); // Pássaro voando
```

**Sintaxe**:
```java
[modificador] class NomeClasse implements Interface1, Interface2, ... {
    // Implementação dos métodos abstratos
}
```

**Múltiplas interfaces**: separadas por vírgula.
```java
public class Pato implements Voador, Nadador {
    @Override
    public void voar() { }
    
    @Override
    public void nadar() { }
}
```

**Extends + implements**: herança + interface.
```java
public class Pato extends Animal implements Voador, Nadador {
    // extends antes de implements
}
```

---

## Fundamentos

### 1. Sintaxe Básica

**implements**: após nome da classe.

```java
public interface Runnable {
    void run();
}

// Classe implementa interface
public class MinhaThread implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread executando");
    }
}

// Uso
Runnable runnable = new MinhaThread();
runnable.run();
```

### 2. Múltiplas Interfaces

Classe pode implementar **múltiplas interfaces** (separadas por vírgula).

```java
public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

// Múltiplas interfaces
public class Pato implements Voador, Nadador {
    @Override
    public void voar() {
        System.out.println("Pato voando");
    }
    
    @Override
    public void nadar() {
        System.out.println("Pato nadando");
    }
}

// Uso: polimorfismo
Voador voador = new Pato();
voador.voar();

Nadador nadador = new Pato();
nadador.nadar();
```

### 3. Extends + Implements

**extends** antes de **implements**.

```java
public abstract class Animal {
    private String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public void comer() {
        System.out.println(nome + " comendo");
    }
}

public interface Voador {
    void voar();
}

// extends antes de implements
public class Passaro extends Animal implements Voador {
    public Passaro(String nome) {
        super(nome);
    }
    
    @Override
    public void voar() {
        System.out.println("Pássaro voando");
    }
}

// Uso
Passaro passaro = new Passaro("Pardal");
passaro.comer(); // Herdado de Animal
passaro.voar();  // Implementado de Voador
```

### 4. Implementação Obrigatória

Classe **concreta** deve implementar **todos** métodos abstratos.

```java
public interface Repositorio {
    void salvar(Object obj);
    Object buscar(int id);
    void deletar(int id);
}

// ❌ ERRO: não implementa todos os métodos
// public class RepositorioImpl implements Repositorio {
//     @Override
//     public void salvar(Object obj) { }
//     // buscar() e deletar() não implementados
// }

// ✅ Implementa todos
public class RepositorioImpl implements Repositorio {
    @Override
    public void salvar(Object obj) {
        System.out.println("Salvando");
    }
    
    @Override
    public Object buscar(int id) {
        return null;
    }
    
    @Override
    public void deletar(int id) {
        System.out.println("Deletando");
    }
}
```

### 5. Classe Abstrata Implementação Parcial

**Classe abstrata** pode implementar interface **parcialmente**.

```java
public interface Completo {
    void metodo1();
    void metodo2();
    void metodo3();
}

// Classe abstrata: implementação parcial
public abstract class ParcialAbstrato implements Completo {
    @Override
    public void metodo1() {
        System.out.println("Método 1");
    }
    
    // metodo2() e metodo3() ainda abstratos
}

// Subclasse concreta: implementa restante
public class Concreto extends ParcialAbstrato {
    @Override
    public void metodo2() {
        System.out.println("Método 2");
    }
    
    @Override
    public void metodo3() {
        System.out.println("Método 3");
    }
}
```

### 6. Visibilidade Public

Métodos implementados devem ser **public**.

```java
public interface Exemplo {
    void metodo(); // public abstract implícito
}

// ❌ ERRO: visibilidade reduzida
// public class Errado implements Exemplo {
//     @Override
//     void metodo() { } // package-private (erro)
// }

// ✅ Public obrigatório
public class Correto implements Exemplo {
    @Override
    public void metodo() { } // public
}
```

### 7. Override Annotation

**@Override**: recomendado ao implementar métodos.

```java
public interface Repositorio {
    void salvar(Object obj);
}

// ⚠️ Funciona, mas não recomendado
public class Sem implements Repositorio {
    public void salvar(Object obj) { } // Sem @Override
}

// ✅ Recomendado
public class Com implements Repositorio {
    @Override
    public void salvar(Object obj) { } // Com @Override
}
```

### 8. Interface Extende Interface

Interface pode **extends** outra(s) interface(s).

```java
public interface Animal {
    void comer();
}

public interface Mamifero extends Animal {
    void amamentar();
}

// Implementa interface que extends outra
public class Cachorro implements Mamifero {
    @Override
    public void comer() { // De Animal
        System.out.println("Cachorro comendo");
    }
    
    @Override
    public void amamentar() { // De Mamifero
        System.out.println("Cachorro amamentando");
    }
}
```

### 9. Métodos Default Herdados

Métodos **default** são **herdados** (não precisa implementar).

```java
public interface Logger {
    // Abstrato (obrigatório implementar)
    void log(String mensagem);
    
    // Default (opcional implementar)
    default void logError(String mensagem) {
        log("ERRO: " + mensagem);
    }
}

public class ConsoleLogger implements Logger {
    @Override
    public void log(String mensagem) {
        System.out.println(mensagem);
    }
    
    // logError() herdado (não precisa implementar)
}

// Uso
Logger logger = new ConsoleLogger();
logger.log("Info"); // Info
logger.logError("Falha"); // ERRO: Falha
```

### 10. Constantes Herdadas

Constantes da interface são **herdadas**.

```java
public interface Configuracao {
    int MAX_CONEXOES = 100;
    String URL_PADRAO = "http://localhost:8080";
}

public class Servidor implements Configuracao {
    public void iniciar() {
        // Constantes herdadas
        System.out.println("Max: " + MAX_CONEXOES);
        System.out.println("URL: " + URL_PADRAO);
        
        // Preferível: qualificar
        System.out.println("Max: " + Configuracao.MAX_CONEXOES);
    }
}
```

---

## Aplicabilidade

**implements**:
- Classe **implementa** interface
- **Múltiplas interfaces** (herança múltipla de tipo)
- **Polimorfismo** (referência por interface)
- **Contrato** (comportamento obrigatório)

**Quando usar**:
- Definir **comportamento comum** entre classes não relacionadas
- **Múltiplas capacidades** (roles)
- **Injeção de dependência**
- **Design patterns** (Strategy, Factory, Observer, etc.)

---

## Armadilhas

### 1. Implements Antes de Extends

```java
// ❌ ERRO: implements antes de extends
// public class Errado implements Voador extends Animal { } // ERRO

// ✅ extends antes de implements
public class Correto extends Animal implements Voador {
}
```

### 2. Não Implementar Todos os Métodos

```java
public interface Completo {
    void metodo1();
    void metodo2();
}

// ❌ ERRO: não implementa todos
// public class Parcial implements Completo {
//     @Override
//     public void metodo1() { }
//     // metodo2() não implementado
// }

// ✅ Implementa todos
public class Completo implements Completo {
    @Override
    public void metodo1() { }
    
    @Override
    public void metodo2() { }
}
```

### 3. Visibilidade Reduzida

```java
public interface Exemplo {
    void metodo(); // public
}

// ❌ ERRO: reduz visibilidade
// public class Errado implements Exemplo {
//     @Override
//     void metodo() { } // package-private (erro)
// }

// ✅ Public obrigatório
public class Correto implements Exemplo {
    @Override
    public void metodo() { }
}
```

### 4. Sem @Override

```java
public interface Repositorio {
    void salvar(Object obj);
}

// ⚠️ Funciona, mas não detecta erros
public class Sem implements Repositorio {
    public void salvar(Object obj) { } // Sem @Override
    
    // Erro de digitação não detectado
    public void sallvar(Object obj) { } // Método extra (erro)
}

// ✅ @Override detecta erros
public class Com implements Repositorio {
    @Override
    public void salvar(Object obj) { }
    
    // @Override
    // public void sallvar(Object obj) { } // ERRO: não sobrescreve nada
}
```

### 5. Conflito de Métodos Default

```java
public interface Interface1 {
    default void metodo() {
        System.out.println("Interface1");
    }
}

public interface Interface2 {
    default void metodo() {
        System.out.println("Interface2");
    }
}

// ❌ ERRO: conflito de métodos default
// public class Conflito implements Interface1, Interface2 {
//     // Qual metodo() usar?
// }

// ✅ Resolver conflito
public class Resolvido implements Interface1, Interface2 {
    @Override
    public void metodo() {
        Interface1.super.metodo(); // Escolher explicitamente
    }
}
```

### 6. Interface com Mesmo Nome de Classe

```java
// ❌ Evitar: nomes confusos
public interface List { } // Conflito com java.util.List

// ✅ Nomeação clara
public interface CustomList { }
```

### 7. Implements de Classe

```java
public class Animal { }

// ❌ ERRO: implements de classe (não é interface)
// public class Cachorro implements Animal { } // ERRO

// ✅ extends para herança de classe
public class Cachorro extends Animal { }
```

---

## Boas Práticas

### 1. Extends Antes de Implements

```java
// ✅ extends antes de implements
public class Pato extends Animal implements Voador, Nadador {
}
```

### 2. @Override Sempre

```java
public interface Repositorio {
    void salvar(Object obj);
}

// ✅ @Override
public class RepositorioImpl implements Repositorio {
    @Override
    public void salvar(Object obj) {
        System.out.println("Salvando");
    }
}
```

### 3. Múltiplas Interfaces para Múltiplas Capacidades

```java
public interface Exportavel {
    String exportar();
}

public interface Imprimivel {
    void imprimir();
}

public interface Validavel {
    boolean validar();
}

// ✅ Múltiplas capacidades
public class Relatorio implements Exportavel, Imprimivel, Validavel {
    @Override
    public String exportar() {
        return "PDF";
    }
    
    @Override
    public void imprimir() {
        System.out.println("Imprimindo");
    }
    
    @Override
    public boolean validar() {
        return true;
    }
}
```

### 4. Interface Segregation Principle (ISP)

```java
// ❌ Interface gorda (viola ISP)
public interface Trabalhador {
    void trabalhar();
    void comer();
    void dormir();
}

// ✅ Interfaces pequenas (ISP)
public interface Trabalhavel {
    void trabalhar();
}

public interface Alimentavel {
    void comer();
}

public interface Descansavel {
    void dormir();
}

// Implementa apenas o necessário
public class Robo implements Trabalhavel {
    @Override
    public void trabalhar() {
        System.out.println("Robô trabalhando");
    }
}

public class Humano implements Trabalhavel, Alimentavel, Descansavel {
    @Override
    public void trabalhar() { }
    
    @Override
    public void comer() { }
    
    @Override
    public void dormir() { }
}
```

### 5. Dependency Injection com Interfaces

```java
public interface UsuarioRepositorio {
    void salvar(Usuario usuario);
    Usuario buscar(int id);
}

public class UsuarioService {
    private final UsuarioRepositorio repositorio;
    
    // Injeção via construtor
    public UsuarioService(UsuarioRepositorio repositorio) {
        this.repositorio = repositorio;
    }
    
    public void criarUsuario(Usuario usuario) {
        repositorio.salvar(usuario);
    }
}

// Implementação concreta
public class UsuarioRepositorioImpl implements UsuarioRepositorio {
    @Override
    public void salvar(Usuario usuario) { }
    
    @Override
    public Usuario buscar(int id) { return null; }
}

// Uso: baixo acoplamento
UsuarioRepositorio repositorio = new UsuarioRepositorioImpl();
UsuarioService service = new UsuarioService(repositorio);
```

### 6. Strategy Pattern

```java
public interface CalculadoraDesconto {
    double calcular(double valor);
}

public class DescontoNatal implements CalculadoraDesconto {
    @Override
    public double calcular(double valor) {
        return valor * 0.9; // 10% desconto
    }
}

public class DescontoBlackFriday implements CalculadoraDesconto {
    @Override
    public double calcular(double valor) {
        return valor * 0.5; // 50% desconto
    }
}

public class Pedido {
    private CalculadoraDesconto calculadora;
    
    public void setCalculadora(CalculadoraDesconto calculadora) {
        this.calculadora = calculadora;
    }
    
    public double calcularTotal(double valor) {
        return calculadora.calcular(valor);
    }
}

// Uso: trocar estratégia dinamicamente
Pedido pedido = new Pedido();
pedido.setCalculadora(new DescontoNatal());
double total1 = pedido.calcularTotal(100); // 90

pedido.setCalculadora(new DescontoBlackFriday());
double total2 = pedido.calcularTotal(100); // 50
```

### 7. Classe Abstrata para Template Method

```java
public interface Processador {
    void processar();
}

// Classe abstrata: implementação parcial + template
public abstract class ProcessadorTemplate implements Processador {
    @Override
    public final void processar() { // Template method
        validar();
        executar();
        finalizar();
    }
    
    protected abstract void validar();
    protected abstract void executar();
    
    protected void finalizar() {
        System.out.println("Finalizado");
    }
}

public class ProcessadorConcreto extends ProcessadorTemplate {
    @Override
    protected void validar() {
        System.out.println("Validando");
    }
    
    @Override
    protected void executar() {
        System.out.println("Executando");
    }
}
```

### 8. Factory Pattern

```java
public interface Notificacao {
    void enviar(String mensagem);
}

public class EmailNotificacao implements Notificacao {
    @Override
    public void enviar(String mensagem) {
        System.out.println("Email: " + mensagem);
    }
}

public class SmsNotificacao implements Notificacao {
    @Override
    public void enviar(String mensagem) {
        System.out.println("SMS: " + mensagem);
    }
}

// Factory
public class NotificacaoFactory {
    public static Notificacao criar(String tipo) {
        switch (tipo) {
            case "email":
                return new EmailNotificacao();
            case "sms":
                return new SmsNotificacao();
            default:
                throw new IllegalArgumentException("Tipo inválido");
        }
    }
}

// Uso
Notificacao notificacao = NotificacaoFactory.criar("email");
notificacao.enviar("Olá");
```

### 9. Observer Pattern

```java
public interface Observer {
    void atualizar(String mensagem);
}

public class Observador1 implements Observer {
    @Override
    public void atualizar(String mensagem) {
        System.out.println("Observador1: " + mensagem);
    }
}

public class Observador2 implements Observer {
    @Override
    public void atualizar(String mensagem) {
        System.out.println("Observador2: " + mensagem);
    }
}

public class Publicador {
    private final List<Observer> observers = new ArrayList<>();
    
    public void adicionar(Observer observer) {
        observers.add(observer);
    }
    
    public void notificar(String mensagem) {
        for (Observer observer : observers) {
            observer.atualizar(mensagem);
        }
    }
}

// Uso
Publicador publicador = new Publicador();
publicador.adicionar(new Observador1());
publicador.adicionar(new Observador2());
publicador.notificar("Evento ocorreu");
```

### 10. Documentar Implementações

```java
public interface Repositorio {
    /**
     * Salva entidade no repositório.
     */
    void salvar(Object obj);
}

/**
 * Implementação de repositório em memória.
 * 
 * <p>Armazena entidades em um Map interno.
 * Não é thread-safe.
 */
public class RepositorioMemoria implements Repositorio {
    private final Map<Integer, Object> dados = new HashMap<>();
    
    /**
     * {@inheritDoc}
     * 
     * <p>Implementação: armazena em Map interno.
     */
    @Override
    public void salvar(Object obj) {
        dados.put(obj.hashCode(), obj);
    }
}
```

---

## Resumo

**implements**: palavra-chave para classe implementar interface.

```java
public class MinhaClasse implements MinhaInterface {
    @Override
    public void metodo() { }
}
```

**Sintaxe**:
```java
[modificador] class Classe implements Interface1, Interface2 {
}
```

**Múltiplas interfaces**:
```java
public class Pato implements Voador, Nadador {
}
```

**Extends + implements**:
```java
public class Pato extends Animal implements Voador, Nadador {
    // extends antes de implements
}
```

**Implementação obrigatória**:
```java
public class Impl implements Repositorio {
    @Override
    public void salvar(Object obj) { } // Obrigatório
}
```

**Classe abstrata**: implementação parcial OK.
```java
public abstract class Parcial implements Completo {
    @Override
    public void metodo1() { }
    // metodo2() ainda abstrato
}
```

**Visibilidade**: métodos devem ser **public**.
```java
@Override
public void metodo() { } // public obrigatório
```

**@Override**: recomendado.
```java
@Override
public void metodo() { }
```

**Métodos default**: herdados (não precisa implementar).
```java
public interface Logger {
    default void logError(String msg) { }
}

public class ConsoleLogger implements Logger {
    // logError() herdado
}
```

**Constantes**: herdadas.
```java
public interface Config {
    int MAX = 100;
}

public class Servidor implements Config {
    // MAX herdado
}
```

**Boas práticas**:
- **extends** antes de **implements**
- **@Override** sempre
- Múltiplas interfaces para múltiplas capacidades
- **Interface Segregation Principle** (ISP)
- Dependency Injection com interfaces
- Design patterns: Strategy, Factory, Observer
- Documentar implementações

**Armadilhas**:
- ❌ **implements** antes de **extends**
- ❌ Não implementar todos os métodos (classe concreta)
- ❌ Reduzir visibilidade (deve ser public)
- ❌ Sem **@Override** (não detecta erros)
- ❌ Conflito de métodos default (resolver explicitamente)

**Regra de Ouro**: Use **implements** para classe implementar interface. **extends** antes de **implements**. Classe concreta deve implementar **todos** métodos abstratos. Use **@Override**. Métodos devem ser **public**. Múltiplas interfaces = múltiplas capacidades. **ISP**: interfaces pequenas. **Dependency Injection** com interfaces para baixo acoplamento.
