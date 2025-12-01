# T2.03 - Múltiplas Interfaces Implementadas

## Introdução

**Múltiplas interfaces**: classe implementa mais de uma interface (separadas por vírgula).

```java
public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

// Implementa múltiplas interfaces
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

// Uso: polimorfismo com múltiplas interfaces
Voador voador = new Pato();
voador.voar(); // Pato voando

Nadador nadador = new Pato();
nadador.nadar(); // Pato nadando
```

**Herança múltipla de tipo**: classe tem múltiplos tipos (não herda implementação).

**Benefícios**:
- **Múltiplas capacidades** (roles)
- **Polimorfismo** com diferentes tipos
- **Flexibilidade** (composição de comportamentos)

---

## Fundamentos

### 1. Sintaxe com Múltiplas Interfaces

Interfaces separadas por **vírgula**.

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

// Múltiplas interfaces (separadas por vírgula)
public class Relatorio implements Exportavel, Imprimivel, Validavel {
    @Override
    public String exportar() {
        return "PDF";
    }
    
    @Override
    public void imprimir() {
        System.out.println("Imprimindo relatório");
    }
    
    @Override
    public boolean validar() {
        return true;
    }
}
```

### 2. Polimorfismo com Múltiplas Interfaces

Mesma instância: **múltiplos tipos**.

```java
public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

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

// Polimorfismo: mesma instância, múltiplos tipos
Pato pato = new Pato();

Voador voador = pato; // Pato é Voador
voador.voar(); // Pato voando

Nadador nadador = pato; // Pato é Nadador
nadador.nadar(); // Pato nadando

// instanceof
System.out.println(pato instanceof Voador); // true
System.out.println(pato instanceof Nadador); // true
```

### 3. Múltiplas Capacidades (Roles)

Interfaces representam **capacidades** (roles).

```java
public interface Notificavel {
    void enviarNotificacao(String mensagem);
}

public interface Exportavel {
    byte[] exportarPDF();
}

public interface Auditavel {
    void registrarAuditoria(String acao);
}

// Classe com múltiplas capacidades
public class Pedido implements Notificavel, Exportavel, Auditavel {
    private String numero;
    
    @Override
    public void enviarNotificacao(String mensagem) {
        System.out.println("Email: " + mensagem);
    }
    
    @Override
    public byte[] exportarPDF() {
        return new byte[0]; // Gera PDF
    }
    
    @Override
    public void registrarAuditoria(String acao) {
        System.out.println("Auditoria: " + acao);
    }
}

// Uso: métodos recebem interfaces específicas
public void notificar(Notificavel obj) {
    obj.enviarNotificacao("Mensagem");
}

public void exportar(Exportavel obj) {
    byte[] pdf = obj.exportarPDF();
}
```

### 4. Collections Framework

Java Collections: múltiplas interfaces.

```java
// ArrayList implementa múltiplas interfaces
public class ArrayList<E> implements List<E>, RandomAccess, Cloneable, Serializable {
}

// Uso: polimorfismo
List<String> lista = new ArrayList<>();
RandomAccess randomAccess = (RandomAccess) lista;
Cloneable cloneable = (Cloneable) lista;
Serializable serializable = (Serializable) lista;
```

### 5. Implements + Extends

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

public interface Nadador {
    void nadar();
}

// extends antes de implements
public class Pato extends Animal implements Voador, Nadador {
    public Pato(String nome) {
        super(nome);
    }
    
    @Override
    public void voar() {
        System.out.println("Pato voando");
    }
    
    @Override
    public void nadar() {
        System.out.println("Pato nadando");
    }
}
```

### 6. Implementar Todos os Métodos

Implementar **todos** métodos de **todas** interfaces.

```java
public interface Interface1 {
    void metodo1();
    void metodo2();
}

public interface Interface2 {
    void metodo3();
    void metodo4();
}

public interface Interface3 {
    void metodo5();
}

// Implementa todos os métodos de todas as interfaces
public class MinhaClasse implements Interface1, Interface2, Interface3 {
    @Override
    public void metodo1() { }
    
    @Override
    public void metodo2() { }
    
    @Override
    public void metodo3() { }
    
    @Override
    public void metodo4() { }
    
    @Override
    public void metodo5() { }
}
```

### 7. Conflito de Métodos Default

Múltiplas interfaces com **mesmo método default**: **conflito**.

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
//     // Qual metodo() usar? - ERRO
// }

// ✅ Resolver conflito explicitamente
public class Resolvido implements Interface1, Interface2 {
    @Override
    public void metodo() {
        Interface1.super.metodo(); // Escolhe Interface1
        // ou Interface2.super.metodo();
        // ou implementação própria
    }
}
```

### 8. Métodos com Mesma Assinatura

Interfaces com **mesmo método abstrato**: implementar **uma vez**.

```java
public interface Interface1 {
    void metodo();
}

public interface Interface2 {
    void metodo(); // Mesma assinatura
}

// Implementa uma vez (serve para ambas)
public class MinhaClasse implements Interface1, Interface2 {
    @Override
    public void metodo() {
        System.out.println("Único método");
    }
}
```

### 9. Constantes com Mesmo Nome

Interfaces com **mesma constante**: **ambiguidade**.

```java
public interface Interface1 {
    int VALOR = 100;
}

public interface Interface2 {
    int VALOR = 200;
}

public class MinhaClasse implements Interface1, Interface2 {
    public void testar() {
        // ❌ ERRO: ambiguidade
        // System.out.println(VALOR); // ERRO
        
        // ✅ Qualificar com interface
        System.out.println(Interface1.VALOR); // 100
        System.out.println(Interface2.VALOR); // 200
    }
}
```

### 10. Interface Segregation Principle (ISP)

**ISP**: interfaces pequenas (específicas).

```java
// ❌ Interface gorda (viola ISP)
public interface Trabalhador {
    void trabalhar();
    void comer();
    void dormir();
}

public class Robo implements Trabalhador {
    @Override
    public void trabalhar() { }
    
    @Override
    public void comer() { } // Robô não come (viola ISP)
    
    @Override
    public void dormir() { } // Robô não dorme (viola ISP)
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

// Robô: implementa apenas o necessário
public class Robo implements Trabalhavel {
    @Override
    public void trabalhar() {
        System.out.println("Robô trabalhando");
    }
}

// Humano: implementa todas
public class Humano implements Trabalhavel, Alimentavel, Descansavel {
    @Override
    public void trabalhar() { }
    
    @Override
    public void comer() { }
    
    @Override
    public void dormir() { }
}
```

---

## Aplicabilidade

**Múltiplas interfaces**:
- **Múltiplas capacidades** (roles)
- **Polimorfismo** (mesma instância, múltiplos tipos)
- **Flexibilidade** (composição de comportamentos)
- **Interface Segregation Principle** (ISP)

**Quando usar**:
- Classe precisa de **múltiplas capacidades**
- **Comportamentos ortogonais** (não relacionados)
- **Design patterns** (Adapter, Proxy, Composite)

---

## Armadilhas

### 1. Conflito de Métodos Default

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

// ❌ ERRO: conflito
// public class Conflito implements Interface1, Interface2 { }

// ✅ Resolver explicitamente
public class Resolvido implements Interface1, Interface2 {
    @Override
    public void metodo() {
        Interface1.super.metodo();
    }
}
```

### 2. Ambiguidade de Constantes

```java
public interface Interface1 {
    int VALOR = 100;
}

public interface Interface2 {
    int VALOR = 200;
}

public class Classe implements Interface1, Interface2 {
    public void testar() {
        // ❌ ERRO: ambiguidade
        // System.out.println(VALOR); // ERRO
        
        // ✅ Qualificar
        System.out.println(Interface1.VALOR);
    }
}
```

### 3. Esquecer Métodos de Alguma Interface

```java
public interface Interface1 {
    void metodo1();
}

public interface Interface2 {
    void metodo2();
}

// ❌ ERRO: esquece metodo2()
// public class Esqueceu implements Interface1, Interface2 {
//     @Override
//     public void metodo1() { }
//     // metodo2() não implementado - ERRO
// }

// ✅ Implementa de ambas
public class Completo implements Interface1, Interface2 {
    @Override
    public void metodo1() { }
    
    @Override
    public void metodo2() { }
}
```

### 4. Interface Gorda (Viola ISP)

```java
// ❌ Interface gorda
public interface Trabalhador {
    void trabalhar();
    void comer();
    void dormir();
}

// ✅ Interfaces pequenas
public interface Trabalhavel {
    void trabalhar();
}

public interface Alimentavel {
    void comer();
}
```

### 5. Implements Antes de Extends

```java
// ❌ ERRO: implements antes de extends
// public class Errado implements Voador extends Animal { } // ERRO

// ✅ extends antes de implements
public class Correto extends Animal implements Voador { }
```

### 6. Muitas Interfaces (God Object)

```java
// ❌ Muitas interfaces (God Object)
public class GodObject implements Interface1, Interface2, Interface3, 
                                   Interface4, Interface5, Interface6 {
    // Muitas responsabilidades (viola SRP)
}

// ✅ Responsabilidade única
public class ClasseFocada implements Interface1, Interface2 {
    // Responsabilidade bem definida
}
```

### 7. Sem @Override

```java
public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

// ⚠️ Sem @Override
public class Pato implements Voador, Nadador {
    public void voar() { } // Sem @Override
    public void nadar() { }
}

// ✅ Com @Override
public class PatoCorreto implements Voador, Nadador {
    @Override
    public void voar() { }
    
    @Override
    public void nadar() { }
}
```

---

## Boas Práticas

### 1. Interface Segregation Principle

```java
// ✅ ISP: interfaces pequenas
public interface Exportavel {
    byte[] exportar();
}

public interface Imprimivel {
    void imprimir();
}

public interface Validavel {
    boolean validar();
}

// Implementa apenas o necessário
public class Relatorio implements Exportavel, Imprimivel {
    @Override
    public byte[] exportar() {
        return new byte[0];
    }
    
    @Override
    public void imprimir() {
        System.out.println("Imprimindo");
    }
}
```

### 2. Nomeação por Capacidade

```java
// ✅ Nomes indicam capacidade (-avel, -able)
public interface Serializable { }
public interface Cloneable { }
public interface Comparable<T> { }
public interface Runnable { }

// Implementação
public class MinhaClasse implements Serializable, Cloneable, Runnable {
    @Override
    public void run() { }
}
```

### 3. Composição de Comportamentos

```java
public interface Autenticavel {
    boolean autenticar(String senha);
}

public interface Autorizavel {
    boolean autorizar(String recurso);
}

public interface Auditavel {
    void auditar(String acao);
}

// Composição de segurança
public class Usuario implements Autenticavel, Autorizavel, Auditavel {
    @Override
    public boolean autenticar(String senha) {
        return true;
    }
    
    @Override
    public boolean autorizar(String recurso) {
        return true;
    }
    
    @Override
    public void auditar(String acao) {
        System.out.println("Auditoria: " + acao);
    }
}
```

### 4. Resolver Conflitos de Default Explicitamente

```java
public interface Logger1 {
    default void log(String msg) {
        System.out.println("Logger1: " + msg);
    }
}

public interface Logger2 {
    default void log(String msg) {
        System.out.println("Logger2: " + msg);
    }
}

// ✅ Resolver conflito
public class MultiLogger implements Logger1, Logger2 {
    @Override
    public void log(String msg) {
        Logger1.super.log(msg); // Escolhe Logger1
        Logger2.super.log(msg); // Ou chama ambos
        // Ou implementação própria
    }
}
```

### 5. Dependency Injection com Múltiplas Interfaces

```java
public interface Notificador {
    void notificar(String mensagem);
}

public interface Logger {
    void log(String mensagem);
}

public class Servico {
    private final Notificador notificador;
    private final Logger logger;
    
    public Servico(Notificador notificador, Logger logger) {
        this.notificador = notificador;
        this.logger = logger;
    }
    
    public void executar() {
        logger.log("Iniciando");
        notificador.notificar("Processando");
        logger.log("Finalizado");
    }
}

// Implementação de ambas
public class EmailService implements Notificador, Logger {
    @Override
    public void notificar(String mensagem) {
        System.out.println("Email: " + mensagem);
    }
    
    @Override
    public void log(String mensagem) {
        System.out.println("Log: " + mensagem);
    }
}

// Uso
EmailService emailService = new EmailService();
Servico servico = new Servico(emailService, emailService);
```

### 6. Adapter Pattern

```java
// Interfaces incompatíveis
public interface FormaAntiga {
    void metodoAntigo();
}

public interface FormaNova {
    void metodoNovo();
}

// Adapter: implementa ambas
public class Adapter implements FormaAntiga, FormaNova {
    @Override
    public void metodoAntigo() {
        metodoNovo(); // Delega
    }
    
    @Override
    public void metodoNovo() {
        System.out.println("Nova implementação");
    }
}
```

### 7. Proxy Pattern

```java
public interface Servico {
    void executar();
}

public class ServicoReal implements Servico {
    @Override
    public void executar() {
        System.out.println("Executando serviço real");
    }
}

// Proxy: implementa mesma interface
public class ServicoProxy implements Servico {
    private final ServicoReal servicoReal = new ServicoReal();
    
    @Override
    public void executar() {
        System.out.println("Antes (log, segurança, cache)");
        servicoReal.executar();
        System.out.println("Depois");
    }
}

// Uso: transparente
Servico servico = new ServicoProxy();
servico.executar();
```

### 8. Composite Pattern

```java
public interface Componente {
    void executar();
}

public class Folha implements Componente {
    @Override
    public void executar() {
        System.out.println("Folha executando");
    }
}

public class Composto implements Componente {
    private final List<Componente> filhos = new ArrayList<>();
    
    public void adicionar(Componente componente) {
        filhos.add(componente);
    }
    
    @Override
    public void executar() {
        for (Componente filho : filhos) {
            filho.executar();
        }
    }
}

// Uso
Componente folha1 = new Folha();
Componente folha2 = new Folha();
Composto composto = new Composto();
composto.adicionar(folha1);
composto.adicionar(folha2);
composto.executar();
```

### 9. Strategy Pattern

```java
public interface Estrategia {
    double calcular(double valor);
}

public class DescontoNatal implements Estrategia {
    @Override
    public double calcular(double valor) {
        return valor * 0.9;
    }
}

public class DescontoBlackFriday implements Estrategia {
    @Override
    public double calcular(double valor) {
        return valor * 0.5;
    }
}

public class Pedido {
    private Estrategia estrategia;
    
    public void setEstrategia(Estrategia estrategia) {
        this.estrategia = estrategia;
    }
    
    public double calcular(double valor) {
        return estrategia.calcular(valor);
    }
}
```

### 10. Observer Pattern

```java
public interface Observer {
    void atualizar(String evento);
}

public interface Subject {
    void adicionar(Observer observer);
    void remover(Observer observer);
    void notificar(String evento);
}

public class Publicador implements Subject {
    private final List<Observer> observers = new ArrayList<>();
    
    @Override
    public void adicionar(Observer observer) {
        observers.add(observer);
    }
    
    @Override
    public void remover(Observer observer) {
        observers.remove(observer);
    }
    
    @Override
    public void notificar(String evento) {
        for (Observer observer : observers) {
            observer.atualizar(evento);
        }
    }
}

public class Observador implements Observer {
    private final String nome;
    
    public Observador(String nome) {
        this.nome = nome;
    }
    
    @Override
    public void atualizar(String evento) {
        System.out.println(nome + " recebeu: " + evento);
    }
}
```

---

## Resumo

**Múltiplas interfaces**: separadas por vírgula.

```java
public class MinhaClasse implements Interface1, Interface2, Interface3 {
}
```

**Polimorfismo**:
```java
Pato pato = new Pato();
Voador voador = pato; // Pato é Voador
Nadador nadador = pato; // Pato é Nadador
```

**Múltiplas capacidades**:
```java
public class Pedido implements Notificavel, Exportavel, Auditavel {
}
```

**extends antes de implements**:
```java
public class Pato extends Animal implements Voador, Nadador {
}
```

**Implementar todos os métodos**:
```java
public class Classe implements Interface1, Interface2 {
    @Override
    public void metodo1() { } // Interface1
    
    @Override
    public void metodo2() { } // Interface2
}
```

**Conflito de default**: resolver explicitamente.
```java
public class Resolvido implements Interface1, Interface2 {
    @Override
    public void metodo() {
        Interface1.super.metodo(); // Escolhe
    }
}
```

**Mesma assinatura**: implementar uma vez.
```java
public class Classe implements Interface1, Interface2 {
    @Override
    public void metodo() { } // Serve para ambas
}
```

**Constantes com mesmo nome**: qualificar.
```java
System.out.println(Interface1.VALOR);
System.out.println(Interface2.VALOR);
```

**ISP**: interfaces pequenas.
```java
public interface Trabalhavel {
    void trabalhar();
}

public interface Alimentavel {
    void comer();
}
```

**Boas práticas**:
- ISP (interfaces pequenas)
- Nomeação por capacidade (-avel, -able)
- Composição de comportamentos
- Resolver conflitos de default explicitamente
- Dependency Injection
- Design patterns: Adapter, Proxy, Composite, Strategy, Observer

**Armadilhas**:
- ❌ Conflito de métodos default (resolver explicitamente)
- ❌ Ambiguidade de constantes (qualificar)
- ❌ Esquecer métodos de alguma interface
- ❌ Interface gorda (viola ISP)
- ❌ implements antes de extends
- ❌ Muitas interfaces (God Object)

**Regra de Ouro**: Use múltiplas interfaces para **múltiplas capacidades**. **ISP**: interfaces pequenas e específicas. **extends** antes de **implements**. Implementar **todos** métodos de **todas** interfaces. Resolver conflitos de **default** explicitamente. Qualificar constantes com **mesmo nome**. Use **@Override**. Design patterns aproveitam múltiplas interfaces.
