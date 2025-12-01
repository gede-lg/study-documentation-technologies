# T1.04 - Múltiplas Interfaces (Herança Múltipla de Tipo)

## Introdução

**Múltiplas interfaces**: classe pode implementar **várias** interfaces simultaneamente (herança múltipla de **tipo**).

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
```

**Herança múltipla de tipo**: classe **É** várias coisas (Pato **é** Voador **e** Nadador).

**Diferença de classe**:
- **Interface**: herança **múltipla** de tipo
- **Classe**: herança **simples** (apenas uma superclasse)

**Benefícios**:
- **Múltiplas capacidades** (roles/responsibilities)
- **Composição de comportamentos**
- **Flexibilidade** de design
- **Evita diamond problem** (sem herança de implementação)

---

## Fundamentos

### 1. Implementar Múltiplas Interfaces

**implements**: separar interfaces por vírgula.

```java
public interface Persistivel {
    void salvar();
}

public interface Validavel {
    boolean validar();
}

public interface Auditavel {
    void registrarLog();
}

// Implementa três interfaces
public class Usuario implements Persistivel, Validavel, Auditavel {
    @Override
    public void salvar() {
        System.out.println("Salvando usuário");
    }
    
    @Override
    public boolean validar() {
        return true;
    }
    
    @Override
    public void registrarLog() {
        System.out.println("Log registrado");
    }
}
```

### 2. Herança + Múltiplas Interfaces

**extends** + **implements**: herdar classe **e** implementar interfaces.

```java
public abstract class Animal {
    protected String nome;
    
    public abstract void emitirSom();
}

public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

// Herda Animal E implementa Voador e Nadador
public class Pato extends Animal implements Voador, Nadador {
    @Override
    public void emitirSom() {
        System.out.println("Quack!");
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

### 3. Polimorfismo com Múltiplas Interfaces

**Polimorfismo**: mesma classe vista como tipos diferentes.

```java
Pato pato = new Pato();

// Pato como Voador
Voador voador = pato;
voador.voar(); // "Pato voando"

// Pato como Nadador
Nadador nadador = pato;
nadador.nadar(); // "Pato nadando"

// Pato como Animal
Animal animal = pato;
animal.emitirSom(); // "Quack!"
```

### 4. Múltiplas Capacidades (Roles)

**Interfaces**: representam **capacidades** ou **roles**.

```java
public interface Notificavel {
    void notificar(String mensagem);
}

public interface Exportavel {
    void exportar(String formato);
}

public interface Imprimivel {
    void imprimir();
}

// Classe com múltiplas capacidades
public class Relatorio implements Notificavel, Exportavel, Imprimivel {
    @Override
    public void notificar(String mensagem) {
        System.out.println("Notificação: " + mensagem);
    }
    
    @Override
    public void exportar(String formato) {
        System.out.println("Exportando como " + formato);
    }
    
    @Override
    public void imprimir() {
        System.out.println("Imprimindo relatório");
    }
}
```

### 5. Interface Segregation Principle (ISP)

**ISP**: múltiplas interfaces pequenas em vez de uma grande.

```java
// ❌ Interface gorda
public interface GerenciadorCompleto {
    void salvar();
    void atualizar();
    void deletar();
    void validar();
    void notificar();
    void exportar();
}

// ✅ Interfaces segregadas
public interface Persistivel {
    void salvar();
    void atualizar();
    void deletar();
}

public interface Validavel {
    void validar();
}

public interface Notificavel {
    void notificar();
}

public interface Exportavel {
    void exportar();
}

// Classes implementam apenas o necessário
public class Usuario implements Persistivel, Validavel {
    @Override
    public void salvar() { }
    
    @Override
    public void atualizar() { }
    
    @Override
    public void deletar() { }
    
    @Override
    public void validar() { }
}

public class Relatorio implements Exportavel, Notificavel {
    @Override
    public void exportar() { }
    
    @Override
    public void notificar() { }
}
```

### 6. Collections Framework

**Collections**: múltiplas interfaces.

```java
// ArrayList implementa múltiplas interfaces
public class ArrayList<E> implements List<E>, RandomAccess, Cloneable, Serializable {
    // ...
}

// Uso polimórfico
ArrayList<String> arrayList = new ArrayList<>();

// Como List
List<String> list = arrayList;
list.add("texto");

// Como Collection
Collection<String> collection = arrayList;
collection.size();

// Como Iterable
Iterable<String> iterable = arrayList;
for (String s : iterable) {
    System.out.println(s);
}
```

### 7. Conflito de Métodos Default

**Conflito**: duas interfaces com mesmo método default.

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
// public class Classe implements Interface1, Interface2 { }

// ✅ Resolver conflito: sobrescrever
public class Classe implements Interface1, Interface2 {
    @Override
    public void metodo() {
        Interface1.super.metodo(); // Chama Interface1
        // Ou Interface2.super.metodo(); // Chama Interface2
        // Ou implementação própria
    }
}
```

### 8. Tipo Comum

**Tipo comum**: método aceita qualquer tipo que implemente interface.

```java
public class Processador {
    // Aceita qualquer Persistivel
    public void processar(Persistivel obj) {
        obj.salvar();
    }
}

// Uso
Persistivel usuario = new Usuario();
Persistivel produto = new Produto();

Processador processador = new Processador();
processador.processar(usuario); // OK
processador.processar(produto); // OK
```

### 9. instanceof com Múltiplas Interfaces

**instanceof**: verificar tipo.

```java
Pato pato = new Pato();

if (pato instanceof Voador) {
    Voador voador = (Voador) pato;
    voador.voar();
}

if (pato instanceof Nadador) {
    Nadador nadador = (Nadador) pato;
    nadador.nadar();
}

if (pato instanceof Animal) {
    Animal animal = (Animal) pato;
    animal.emitirSom();
}
```

### 10. Sem Herança de Implementação

**Interfaces**: sem herança de **implementação** (apenas tipo).

```java
// Interfaces: sem código compartilhado
public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

// Cada classe implementa separadamente
public class Pato implements Voador, Nadador {
    @Override
    public void voar() {
        System.out.println("Pato voando"); // Implementação própria
    }
    
    @Override
    public void nadar() {
        System.out.println("Pato nadando"); // Implementação própria
    }
}

public class Peixe implements Nadador {
    @Override
    public void nadar() {
        System.out.println("Peixe nadando"); // Implementação própria
    }
}
```

---

## Aplicabilidade

**Use múltiplas interfaces quando**:
- Classe tem **múltiplas capacidades** (roles)
- **Polimorfismo** com diferentes tipos
- **Interface Segregation Principle** (ISP)
- **Evitar acoplamento** forte
- **Composição de comportamentos**

**Evite quando**:
- Interface tem **muitos métodos** (viola ISP)
- **Herança de implementação** necessária (use classe abstrata)
- **Código duplicado** entre implementações (use composição)

---

## Armadilhas

### 1. Implementação Incompleta

```java
public interface Interface1 {
    void metodo1();
}

public interface Interface2 {
    void metodo2();
}

// ❌ ERRO: deve implementar TODOS os métodos
// public class Classe implements Interface1, Interface2 {
//     @Override
//     public void metodo1() { }
//     // metodo2() não implementado
// }

// ✅ Implementar todos
public class Classe implements Interface1, Interface2 {
    @Override
    public void metodo1() { }
    
    @Override
    public void metodo2() { }
}
```

### 2. Conflito de Métodos Default

```java
public interface A {
    default void metodo() {
        System.out.println("A");
    }
}

public interface B {
    default void metodo() {
        System.out.println("B");
    }
}

// ❌ ERRO: conflito
// public class Classe implements A, B { }

// ✅ Resolver conflito
public class Classe implements A, B {
    @Override
    public void metodo() {
        A.super.metodo(); // Escolhe A
    }
}
```

### 3. Conflito de Constantes

```java
public interface Interface1 {
    int VALOR = 10;
}

public interface Interface2 {
    int VALOR = 20;
}

public class Classe implements Interface1, Interface2 {
    public void metodo() {
        // ❌ ERRO: referência ambígua
        // System.out.println(VALOR);
        
        // ✅ Qualificar
        System.out.println(Interface1.VALOR); // 10
        System.out.println(Interface2.VALOR); // 20
    }
}
```

### 4. Tentativa de Herança Múltipla de Classes

```java
public class ClasseA { }
public class ClasseB { }

// ❌ ERRO: Java não suporta herança múltipla de classes
// public class Classe extends ClasseA, ClasseB { }

// ✅ Herança simples + interfaces
public class Classe extends ClasseA implements InterfaceB {
}
```

### 5. Implementação Desnecessária

```java
// ❌ Implementar interface sem usar
public class Usuario implements Serializable, Cloneable {
    // Não usa serialização nem clonagem
}

// ✅ Implementar apenas o necessário
public class Usuario {
    // Sem interfaces desnecessárias
}
```

### 6. Interface Muito Grande

```java
// ❌ Interface gorda (viola ISP)
public interface GerenciadorCompleto {
    void metodo1();
    void metodo2();
    // ... 20 métodos
}

public class Classe implements GerenciadorCompleto {
    // Forçado a implementar métodos desnecessários
}

// ✅ Interfaces pequenas
public interface Parte1 {
    void metodo1();
}

public interface Parte2 {
    void metodo2();
}

public class Classe implements Parte1 { // Apenas o necessário
    @Override
    public void metodo1() { }
}
```

### 7. Cast Desnecessário

```java
Pato pato = new Pato();

// ❌ Cast desnecessário
Voador voador = (Voador) pato;

// ✅ Conversão implícita
Voador voador2 = pato; // OK: Pato implementa Voador
```

---

## Boas Práticas

### 1. Interface Segregation Principle

```java
// ✅ Interfaces pequenas e coesas
public interface Leitura {
    Object ler();
}

public interface Escrita {
    void escrever(Object obj);
}

public interface Fechavel {
    void fechar();
}

// Classes implementam combinações
public class ArquivoLeitura implements Leitura, Fechavel {
    @Override
    public Object ler() { return null; }
    
    @Override
    public void fechar() { }
}

public class ArquivoEscrita implements Escrita, Fechavel {
    @Override
    public void escrever(Object obj) { }
    
    @Override
    public void fechar() { }
}

public class ArquivoCompleto implements Leitura, Escrita, Fechavel {
    @Override
    public Object ler() { return null; }
    
    @Override
    public void escrever(Object obj) { }
    
    @Override
    public void fechar() { }
}
```

### 2. Nomeação por Capacidade

```java
// ✅ Nomes representam capacidades
public interface Voador { void voar(); }
public interface Nadador { void nadar(); }
public interface Corredor { void correr(); }

// Classe com múltiplas capacidades
public class Triatleta implements Corredor, Nadador {
    @Override
    public void correr() { }
    
    @Override
    public void nadar() { }
}
```

### 3. Composição com Múltiplas Interfaces

```java
// ✅ Composição para reutilizar código
public class NotificadorEmail implements Notificador {
    @Override
    public void notificar(String mensagem) {
        System.out.println("Email: " + mensagem);
    }
}

public class NotificadorSMS implements Notificador {
    @Override
    public void notificar(String mensagem) {
        System.out.println("SMS: " + mensagem);
    }
}

// Classe usa composição
public class Pedido implements Persistivel, Notificavel {
    private final Notificador notificador;
    
    public Pedido(Notificador notificador) {
        this.notificador = notificador;
    }
    
    @Override
    public void salvar() {
        System.out.println("Salvando pedido");
    }
    
    @Override
    public void notificar() {
        notificador.notificar("Pedido processado");
    }
}
```

### 4. Polimorfismo com Múltiplos Tipos

```java
// ✅ Método aceita interface específica
public class Processador {
    public void processar(Validavel obj) {
        if (obj.validar()) {
            System.out.println("Válido");
        }
    }
    
    public void persistir(Persistivel obj) {
        obj.salvar();
    }
}

// Uso
Usuario usuario = new Usuario();
Processador proc = new Processador();
proc.processar(usuario); // Como Validavel
proc.persistir(usuario); // Como Persistivel
```

### 5. Adapter Pattern

```java
// Interface existente
public interface LegadoAPI {
    void executar();
}

// Nova interface
public interface NovaAPI {
    void processar();
}

// Adapter implementa ambas
public class Adapter implements LegadoAPI, NovaAPI {
    @Override
    public void executar() {
        System.out.println("Executando (legado)");
    }
    
    @Override
    public void processar() {
        executar(); // Delega para método legado
    }
}
```

### 6. Proxy Pattern

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

// Proxy implementa mesma interface
public class ProxyServico implements Servico {
    private final Servico servicoReal = new ServicoReal();
    
    @Override
    public void executar() {
        System.out.println("Proxy: antes");
        servicoReal.executar();
        System.out.println("Proxy: depois");
    }
}
```

### 7. Composite Pattern

```java
public interface Componente {
    void renderizar();
}

public class ComponenteSimples implements Componente {
    @Override
    public void renderizar() {
        System.out.println("Renderizando componente simples");
    }
}

public class ComponenteComposto implements Componente {
    private final List<Componente> filhos = new ArrayList<>();
    
    public void adicionar(Componente componente) {
        filhos.add(componente);
    }
    
    @Override
    public void renderizar() {
        System.out.println("Renderizando componente composto");
        filhos.forEach(Componente::renderizar);
    }
}
```

### 8. Strategy Pattern

```java
public interface EstrategiaOrdenacao {
    void ordenar(int[] array);
}

public class BubbleSort implements EstrategiaOrdenacao {
    @Override
    public void ordenar(int[] array) {
        System.out.println("Bubble sort");
    }
}

public class QuickSort implements EstrategiaOrdenacao {
    @Override
    public void ordenar(int[] array) {
        System.out.println("Quick sort");
    }
}

public class Ordenador {
    private EstrategiaOrdenacao estrategia;
    
    public void setEstrategia(EstrategiaOrdenacao estrategia) {
        this.estrategia = estrategia;
    }
    
    public void ordenar(int[] array) {
        estrategia.ordenar(array);
    }
}
```

### 9. Observer Pattern

```java
public interface Observer {
    void atualizar(String evento);
}

public interface Subject {
    void adicionarObserver(Observer observer);
    void removerObserver(Observer observer);
    void notificarObservers(String evento);
}

public class Publicador implements Subject {
    private final List<Observer> observers = new ArrayList<>();
    
    @Override
    public void adicionarObserver(Observer observer) {
        observers.add(observer);
    }
    
    @Override
    public void removerObserver(Observer observer) {
        observers.remove(observer);
    }
    
    @Override
    public void notificarObservers(String evento) {
        observers.forEach(o -> o.atualizar(evento));
    }
}

public class Assinante implements Observer {
    @Override
    public void atualizar(String evento) {
        System.out.println("Evento recebido: " + evento);
    }
}
```

### 10. Factory Pattern

```java
public interface Forma {
    void desenhar();
}

public class Circulo implements Forma {
    @Override
    public void desenhar() {
        System.out.println("Desenhando círculo");
    }
}

public class Retangulo implements Forma {
    @Override
    public void desenhar() {
        System.out.println("Desenhando retângulo");
    }
}

public class FormaFactory {
    public static Forma criar(String tipo) {
        switch (tipo) {
            case "circulo": return new Circulo();
            case "retangulo": return new Retangulo();
            default: throw new IllegalArgumentException("Tipo inválido");
        }
    }
}
```

---

## Resumo

**Múltiplas interfaces**: classe pode implementar **várias** interfaces (herança múltipla de **tipo**).

```java
public class Pato implements Voador, Nadador {
    @Override
    public void voar() { }
    
    @Override
    public void nadar() { }
}
```

**Herança + Múltiplas Interfaces**:
```java
public class Pato extends Animal implements Voador, Nadador {
}
```

**Polimorfismo**:
```java
Pato pato = new Pato();
Voador voador = pato; // Como Voador
Nadador nadador = pato; // Como Nadador
```

**Interface Segregation Principle** (ISP):
```java
// ✅ Interfaces pequenas
public interface Persistivel { void salvar(); }
public interface Validavel { void validar(); }

public class Usuario implements Persistivel, Validavel {
}
```

**Collections Framework**:
```java
public class ArrayList<E> implements List<E>, RandomAccess, Cloneable, Serializable {
}
```

**Conflito de default methods**:
```java
public class Classe implements A, B {
    @Override
    public void metodo() {
        A.super.metodo(); // Resolver conflito
    }
}
```

**Múltiplas capacidades** (roles):
```java
public class Relatorio implements Notificavel, Exportavel, Imprimivel {
}
```

**Sem herança de implementação**:
- Interface: apenas **tipo**
- Classe: **implementação** própria

**Diferença de classe**:

| Característica | Interface | Classe |
|---------------|-----------|--------|
| **Herança** | Múltipla | Simples |
| **Implementação** | Não (apenas tipo) | Sim |
| **Diamond problem** | Não | N/A |

**Quando usar**:
- Múltiplas capacidades (roles)
- Polimorfismo com diferentes tipos
- Interface Segregation Principle
- Evitar acoplamento

**Evite**:
- Interface muito grande (viola ISP)
- Interfaces desnecessárias
- Código duplicado (use composição)

**Boas práticas**:
- ISP: interfaces pequenas
- Nomeação por capacidade (-able, -ible)
- Composição para reutilização
- Polimorfismo com tipos específicos
- Patterns: Adapter, Proxy, Strategy, Observer

**Regra de Ouro**: Múltiplas interfaces permitem **herança múltipla de tipo** (classe **É** várias coisas). Use para **múltiplas capacidades** (roles). Aplique **ISP** (interfaces pequenas e coesas). Combine com **composição** para reutilizar código. Evite interfaces **muito grandes** ou **desnecessárias**.