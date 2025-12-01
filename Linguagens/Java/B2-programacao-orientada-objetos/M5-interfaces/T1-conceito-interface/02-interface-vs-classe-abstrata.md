# T1.02 - Interface vs Classe Abstrata

## Introdução

**Interface** e **Classe Abstrata**: mecanismos de abstração em Java, mas com **diferenças importantes**.

```java
// INTERFACE: contrato puro (100% abstrato)
public interface Voador {
    void voar();
    void pousar();
}

// CLASSE ABSTRATA: classe parcialmente implementada
public abstract class Animal {
    protected String nome; // Estado
    
    public Animal(String nome) { // Construtor
        this.nome = nome;
    }
    
    public abstract void emitirSom(); // Abstrato
    
    public void dormir() { // Concreto
        System.out.println(nome + " dormindo");
    }
}
```

**Diferenças principais**:
- **Herança**: interface (múltipla), classe abstrata (simples)
- **Estado**: interface (sem campos de instância), classe abstrata (com campos)
- **Construtor**: interface (não tem), classe abstrata (tem)
- **Métodos**: interface (abstratos, default, static), classe abstrata (abstratos e concretos)

**Quando usar**:
- **Interface**: contrato, múltiplas capacidades, polimorfismo
- **Classe abstrata**: código reutilizável, template method, estado compartilhado

---

## Fundamentos

### 1. Herança Múltipla

**Interface**: classe pode implementar **múltiplas** interfaces.
**Classe Abstrata**: classe pode estender **apenas uma** classe.

```java
// Interface: múltipla herança de tipo
public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

public class Pato implements Voador, Nadador { // Múltiplas interfaces
    @Override
    public void voar() {
        System.out.println("Pato voando");
    }
    
    @Override
    public void nadar() {
        System.out.println("Pato nadando");
    }
}

// Classe Abstrata: herança simples
public abstract class Animal {
    public abstract void emitirSom();
}

public abstract class Mamifero {
    public abstract void amamentar();
}

// ❌ ERRO: não pode estender duas classes
// public class Cachorro extends Animal, Mamifero { }

// ✅ OK: estende uma, implementa interfaces
public class Cachorro extends Animal implements Voador {
    @Override
    public void emitirSom() { }
    
    @Override
    public void voar() { }
}
```

### 2. Estado (Campos de Instância)

**Interface**: **sem** campos de instância (apenas constantes static final).
**Classe Abstrata**: pode ter campos de instância.

```java
// Interface: sem estado
public interface Calculadora {
    // int valor; // ❌ ERRO: interface não tem campos de instância
    
    int MAX_VALOR = 1000; // public static final implícito
    
    double calcular(double a, double b);
}

// Classe Abstrata: com estado
public abstract class Forma {
    protected String cor; // Campo de instância
    protected double posicaoX, posicaoY;
    
    public abstract double calcularArea();
    
    public void mover(double x, double y) {
        this.posicaoX = x;
        this.posicaoY = y;
    }
}
```

### 3. Construtores

**Interface**: **não tem** construtores.
**Classe Abstrata**: **tem** construtores (chamados por subclasses).

```java
// Interface: sem construtor
public interface Repositorio {
    void salvar(Object obj);
}

// Classe Abstrata: com construtor
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) { // Construtor
        this.nome = nome;
    }
    
    public abstract void emitirSom();
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome); // Chama construtor da superclasse
    }
    
    @Override
    public void emitirSom() {
        System.out.println(nome + " latindo");
    }
}
```

### 4. Métodos Abstratos vs Concretos

**Interface**: métodos abstratos (ou default/static em Java 8+).
**Classe Abstrata**: métodos abstratos **e** concretos.

```java
// Interface: abstratos (default/static em Java 8+)
public interface Ordenavel {
    int comparar(Ordenavel outro); // Abstrato
    
    default void imprimir() { // Default (Java 8+)
        System.out.println("Ordenável");
    }
}

// Classe Abstrata: abstratos E concretos
public abstract class Forma {
    protected String cor;
    
    public abstract double calcularArea(); // Abstrato
    
    public void desenhar() { // Concreto
        System.out.println("Desenhando forma " + cor);
    }
    
    public String getCor() { // Concreto
        return cor;
    }
}
```

### 5. Modificadores de Acesso

**Interface**: métodos **public** implícito.
**Classe Abstrata**: qualquer modificador (public, protected, private).

```java
// Interface: public implícito
public interface Repositorio {
    void salvar(Object obj); // public implícito
    // protected void metodo(); // ❌ ERRO
    // private void metodo(); // ❌ ERRO (exceto Java 9+ private)
}

// Classe Abstrata: qualquer modificador
public abstract class Animal {
    public abstract void emitirSom(); // public
    protected abstract void mover(); // protected
    
    private void metodoPrivado() { } // private
}
```

### 6. Implementação Parcial

**Interface**: implementação parcial **não permitida** (exceto classe abstrata).
**Classe Abstrata**: implementação parcial permitida.

```java
// Interface: deve implementar TODOS os métodos
public interface Completo {
    void metodo1();
    void metodo2();
    void metodo3();
}

// ❌ ERRO: deve implementar todos
// public class Parcial implements Completo {
//     @Override
//     public void metodo1() { }
// }

// ✅ Classe abstrata para implementação parcial
public abstract class ParcialAbstrato implements Completo {
    @Override
    public void metodo1() { }
    // metodo2() e metodo3() para subclasses
}

// Classe Abstrata: implementação parcial OK
public abstract class Animal {
    public abstract void emitirSom();
    public abstract void mover();
}

public abstract class Mamifero extends Animal {
    @Override
    public void mover() { // Implementa apenas mover()
        System.out.println("Mamífero movendo");
    }
    // emitirSom() ainda abstrato
}
```

### 7. Evolução de API

**Interface**: adicionar método quebra implementações (exceto default em Java 8+).
**Classe Abstrata**: adicionar método concreto **não quebra** subclasses.

```java
// Interface: adicionar método quebra (antes Java 8)
public interface Repositorio {
    void salvar(Object obj);
    // void atualizar(Object obj); // ❌ Quebra implementações antigas
}

// Java 8+: método default não quebra
public interface Repositorio2 {
    void salvar(Object obj);
    
    default void atualizar(Object obj) { // OK: não quebra
        System.out.println("Atualização padrão");
    }
}

// Classe Abstrata: adicionar concreto não quebra
public abstract class Animal {
    public abstract void emitirSom();
    
    // Adicionar método concreto: OK (não quebra)
    public void dormir() {
        System.out.println("Dormindo");
    }
}
```

### 8. Template Method

**Classe Abstrata**: ideal para **template method** (algoritmo fixo, passos variáveis).

```java
// Classe Abstrata: template method
public abstract class ProcessadorPedido {
    // Template method (final para não ser sobrescrito)
    public final void processar() {
        validarPedido();
        calcularTotal();
        aplicarDesconto();
        finalizarPedido();
    }
    
    protected abstract void validarPedido();
    protected abstract void calcularTotal();
    protected abstract void aplicarDesconto();
    protected abstract void finalizarPedido();
}

public class PedidoOnline extends ProcessadorPedido {
    @Override
    protected void validarPedido() {
        System.out.println("Validando pedido online");
    }
    
    @Override
    protected void calcularTotal() {
        System.out.println("Calculando total + frete");
    }
    
    @Override
    protected void aplicarDesconto() {
        System.out.println("Aplicando cupom");
    }
    
    @Override
    protected void finalizarPedido() {
        System.out.println("Enviando email");
    }
}

// Uso: template já definido
ProcessadorPedido pedido = new PedidoOnline();
pedido.processar(); // Chama métodos na ordem
```

### 9. Reuso de Código

**Classe Abstrata**: melhor para **reutilizar código** (herança de implementação).
**Interface**: melhor para **contrato** (herança de tipo).

```java
// Classe Abstrata: reuso de código
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    // Código reutilizável
    public void dormir() {
        System.out.println(nome + " dormindo");
    }
    
    public void acordar() {
        System.out.println(nome + " acordando");
    }
    
    public abstract void emitirSom();
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
    
    @Override
    public void emitirSom() {
        System.out.println(nome + " latindo");
    }
    
    // Herda dormir() e acordar()
}

// Interface: contrato
public interface Voador {
    void voar(); // Sem implementação
}
```

### 10. Coupling (Acoplamento)

**Interface**: **menos acoplamento** (apenas contrato).
**Classe Abstrata**: **mais acoplamento** (herança de implementação).

```java
// Interface: baixo acoplamento
public interface Notificador {
    void enviar(String mensagem);
}

public class Service {
    private Notificador notificador; // Depende apenas de contrato
    
    public Service(Notificador notificador) {
        this.notificador = notificador;
    }
}

// Classe Abstrata: maior acoplamento
public abstract class Repositorio {
    protected Connection conexao; // Estado compartilhado
    
    public abstract void salvar(Object obj);
    
    protected void conectar() { // Implementação compartilhada
        // Código de conexão
    }
}

// Subclasse acoplada à implementação da superclasse
public class RepositorioUsuario extends Repositorio {
    @Override
    public void salvar(Object obj) {
        conectar(); // Depende de método da superclasse
    }
}
```

---

## Aplicabilidade

**Use Interface quando**:
- **Contrato** de comportamento
- **Múltiplas capacidades** (implementar várias interfaces)
- **Polimorfismo** sem herança de implementação
- **Baixo acoplamento**
- **Design por contrato**

**Use Classe Abstrata quando**:
- **Código reutilizável** (template method)
- **Estado compartilhado** (campos)
- **Construtor** necessário
- **Modificadores variados** (protected, private)
- **Evolução gradual** (adicionar métodos concretos)

---

## Armadilhas

### 1. Interface Como Classe Abstrata

```java
// ❌ Interface tentando ser classe abstrata
public interface Animal {
    // private String nome; // ❌ ERRO: sem campos de instância
    
    void emitirSom();
}

// ✅ Use classe abstrata se precisa de estado
public abstract class Animal {
    protected String nome;
    
    public abstract void emitirSom();
}
```

### 2. Classe Abstrata Para Contrato

```java
// ❌ Classe abstrata sem código reutilizável
public abstract class Repositorio {
    public abstract void salvar(Object obj);
    public abstract Object buscar(int id);
    // Sem implementação compartilhada
}

// ✅ Use interface para contrato puro
public interface Repositorio {
    void salvar(Object obj);
    Object buscar(int id);
}
```

### 3. Herança Múltipla de Implementação

```java
// ❌ Java não suporta herança múltipla de classes
// public class Cachorro extends Animal, Mamifero { }

// ✅ Herança simples + interfaces
public class Cachorro extends Animal implements Voador, Nadador {
    @Override
    public void emitirSom() { }
    
    @Override
    public void voar() { }
    
    @Override
    public void nadar() { }
}
```

### 4. Interface Com Lógica Complexa (Default)

```java
// ❌ Interface com lógica complexa (Java 8+)
public interface Calculadora {
    default double calcularComplexo(double a, double b, double c) {
        // 50 linhas de lógica complexa
        return a + b * c; // Simplificado
    }
}

// ✅ Use classe abstrata para lógica complexa
public abstract class Calculadora {
    public double calcularComplexo(double a, double b, double c) {
        // Lógica complexa
        return a + b * c;
    }
    
    public abstract double calcularSimples(double a, double b);
}
```

### 5. Constantes em Interface

```java
// ❌ Interface como namespace de constantes (antipattern)
public interface Constantes {
    int MAX = 100;
    String URL = "http://api.com";
}

// ✅ Classe final com construtor privado
public final class Constantes {
    private Constantes() { }
    
    public static final int MAX = 100;
    public static final String URL = "http://api.com";
}
```

### 6. Classe Abstrata Sem Métodos Abstratos

```java
// ❌ Classe abstrata sem métodos abstratos
public abstract class Utilitario {
    public static void metodo1() { }
    public static void metodo2() { }
}

// ✅ Classe final (não é para ser estendida)
public final class Utilitario {
    private Utilitario() { }
    
    public static void metodo1() { }
    public static void metodo2() { }
}
```

### 7. Interface Muito Grande

```java
// ❌ Interface muito grande (viola ISP)
public interface GerenciadorCompleto {
    void salvar();
    void atualizar();
    void deletar();
    void validar();
    void enviarEmail();
    void gerarRelatorio();
}

// ✅ Segregar em interfaces menores
public interface Persistivel {
    void salvar();
    void atualizar();
    void deletar();
}

public interface Validavel {
    void validar();
}

public interface Notificavel {
    void enviarEmail();
}
```

---

## Boas Práticas

### 1. Favor Composition Over Inheritance

```java
// ❌ Herança de classe abstrata (acoplamento forte)
public abstract class Repositorio {
    protected Connection conexao;
    
    protected void conectar() { }
    
    public abstract void salvar(Object obj);
}

// ✅ Composição com interface (acoplamento fraco)
public interface Repositorio {
    void salvar(Object obj);
}

public class RepositorioImpl implements Repositorio {
    private final ConexaoProvider conexaoProvider; // Composição
    
    public RepositorioImpl(ConexaoProvider conexaoProvider) {
        this.conexaoProvider = conexaoProvider;
    }
    
    @Override
    public void salvar(Object obj) {
        Connection conexao = conexaoProvider.obterConexao();
        // Salvar
    }
}
```

### 2. Interface + Classe Abstrata

```java
// Interface: contrato
public interface Forma {
    double calcularArea();
    double calcularPerimetro();
}

// Classe abstrata: código reutilizável
public abstract class FormaBase implements Forma {
    protected String cor;
    protected double posicaoX, posicaoY;
    
    public FormaBase(String cor) {
        this.cor = cor;
    }
    
    public void mover(double x, double y) { // Código reutilizável
        this.posicaoX = x;
        this.posicaoY = y;
    }
    
    // Métodos abstratos ainda obrigatórios
}

// Classe concreta
public class Circulo extends FormaBase {
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
```

### 3. Template Method Pattern

```java
// Classe abstrata para template method
public abstract class RelatorioTemplate {
    // Template method (final)
    public final void gerarRelatorio() {
        abrirDocumento();
        adicionarCabecalho();
        adicionarCorpo();
        adicionarRodape();
        fecharDocumento();
    }
    
    protected abstract void abrirDocumento();
    protected abstract void fecharDocumento();
    
    protected void adicionarCabecalho() {
        System.out.println("Cabeçalho padrão");
    }
    
    protected abstract void adicionarCorpo();
    
    protected void adicionarRodape() {
        System.out.println("Rodapé padrão");
    }
}

public class RelatorioPDF extends RelatorioTemplate {
    @Override
    protected void abrirDocumento() {
        System.out.println("Abrindo PDF");
    }
    
    @Override
    protected void adicionarCorpo() {
        System.out.println("Corpo do PDF");
    }
    
    @Override
    protected void fecharDocumento() {
        System.out.println("Fechando PDF");
    }
}
```

### 4. Strategy com Interface

```java
// Interface para estratégia
public interface EstrategiaOrdenacao {
    void ordenar(int[] array);
}

public class BubbleSort implements EstrategiaOrdenacao {
    @Override
    public void ordenar(int[] array) {
        // Bubble sort
    }
}

public class QuickSort implements EstrategiaOrdenacao {
    @Override
    public void ordenar(int[] array) {
        // Quick sort
    }
}

// Contexto
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

### 5. Skeletal Implementation

```java
// Interface: contrato
public interface Colecao<E> {
    int tamanho();
    boolean vazia();
    boolean contem(E elemento);
    void adicionar(E elemento);
    void remover(E elemento);
}

// Classe abstrata: implementação esqueleto
public abstract class ColecaoAbstrata<E> implements Colecao<E> {
    @Override
    public boolean vazia() { // Implementação padrão
        return tamanho() == 0;
    }
    
    @Override
    public boolean contem(E elemento) { // Implementação padrão
        // Usar métodos abstratos
        return false;
    }
    
    // Métodos abstratos para subclasses
    @Override
    public abstract int tamanho();
    
    @Override
    public abstract void adicionar(E elemento);
    
    @Override
    public abstract void remover(E elemento);
}

// Implementação concreta
public class MinhaColecao<E> extends ColecaoAbstrata<E> {
    private List<E> elementos = new ArrayList<>();
    
    @Override
    public int tamanho() {
        return elementos.size();
    }
    
    @Override
    public void adicionar(E elemento) {
        elementos.add(elemento);
    }
    
    @Override
    public void remover(E elemento) {
        elementos.remove(elemento);
    }
}
```

### 6. Collections Framework Pattern

```java
// Interface: List
// Classe abstrata: AbstractList (skeletal implementation)
// Implementações: ArrayList, LinkedList

// Exemplo simplificado
public interface Lista<E> {
    E get(int index);
    void add(E elemento);
    int size();
}

public abstract class ListaAbstrata<E> implements Lista<E> {
    @Override
    public boolean isEmpty() { // Default implementation
        return size() == 0;
    }
    
    // Métodos abstratos
    @Override
    public abstract E get(int index);
    
    @Override
    public abstract void add(E elemento);
    
    @Override
    public abstract int size();
}

public class MinhaLista<E> extends ListaAbstrata<E> {
    private Object[] elementos = new Object[10];
    private int tamanho = 0;
    
    @Override
    @SuppressWarnings("unchecked")
    public E get(int index) {
        return (E) elementos[index];
    }
    
    @Override
    public void add(E elemento) {
        elementos[tamanho++] = elemento;
    }
    
    @Override
    public int size() {
        return tamanho;
    }
}
```

### 7. Dependency Inversion Principle

```java
// ✅ Depender de abstração (interface), não implementação
public interface Notificador {
    void enviar(String mensagem);
}

public class PedidoService {
    private final Notificador notificador; // Depende de abstração
    
    public PedidoService(Notificador notificador) {
        this.notificador = notificador;
    }
    
    public void processarPedido(Pedido pedido) {
        // Processar
        notificador.enviar("Pedido processado");
    }
}

// Implementações
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
```

### 8. Marker Interface

```java
// Interface marker (sem métodos)
public interface Serializavel {
}

// Classe implementa marker
public class Usuario implements Serializavel {
    private String nome;
}

// Uso
public void salvar(Object obj) {
    if (obj instanceof Serializavel) {
        // Serializar
    }
}
```

### 9. Default Methods (Java 8+)

```java
// Interface com default methods
public interface Comparavel {
    int comparar(Comparavel outro);
    
    default boolean maiorQue(Comparavel outro) {
        return comparar(outro) > 0;
    }
    
    default boolean menorQue(Comparavel outro) {
        return comparar(outro) < 0;
    }
    
    default boolean igualA(Comparavel outro) {
        return comparar(outro) == 0;
    }
}

public class Produto implements Comparavel {
    private double preco;
    
    @Override
    public int comparar(Comparavel outro) {
        Produto outroProduto = (Produto) outro;
        return Double.compare(this.preco, outroProduto.preco);
    }
    
    // Herda maiorQue(), menorQue(), igualA()
}
```

### 10. Quando Usar Cada Um

```java
// Interface: contrato puro, múltiplas capacidades
public interface Voador {
    void voar();
}

public interface Nadador {
    void nadar();
}

public class Pato implements Voador, Nadador {
    @Override
    public void voar() { }
    
    @Override
    public void nadar() { }
}

// Classe abstrata: código reutilizável, estado
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public void dormir() { // Código reutilizável
        System.out.println(nome + " dormindo");
    }
    
    public abstract void emitirSom();
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
    
    @Override
    public void emitirSom() {
        System.out.println(nome + " latindo");
    }
}
```

---

## Resumo

**Interface vs Classe Abstrata**:

| Característica | Interface | Classe Abstrata |
|---------------|-----------|-----------------|
| **Herança** | Múltipla | Simples |
| **Estado** | Sem campos de instância | Com campos |
| **Construtor** | Não | Sim |
| **Métodos** | Abstratos, default, static | Abstratos e concretos |
| **Modificadores** | public implícito | Qualquer (public, protected, private) |
| **Uso** | Contrato, capacidades | Código reutilizável, template |

**Interface**:
```java
public interface Voador {
    void voar(); // Abstrato
    
    default void pousar() { // Default (Java 8+)
        System.out.println("Pousando");
    }
}

public class Aviao implements Voador {
    @Override
    public void voar() {
        System.out.println("Voando");
    }
}
```

**Classe Abstrata**:
```java
public abstract class Animal {
    protected String nome; // Estado
    
    public Animal(String nome) { // Construtor
        this.nome = nome;
    }
    
    public abstract void emitirSom(); // Abstrato
    
    public void dormir() { // Concreto
        System.out.println(nome + " dormindo");
    }
}
```

**Quando usar**:
- **Interface**: contrato, múltiplas capacidades, baixo acoplamento
- **Classe Abstrata**: código reutilizável, estado compartilhado, template method

**Herança múltipla**:
```java
public class Pato implements Voador, Nadador { // OK
}

// public class Cachorro extends Animal, Mamifero { } // ❌ ERRO
```

**Template Method**:
```java
public abstract class ProcessadorTemplate {
    public final void processar() {
        passo1();
        passo2();
        passo3();
    }
    
    protected abstract void passo1();
    protected abstract void passo2();
    protected abstract void passo3();
}
```

**Interface + Classe Abstrata**:
```java
public interface Forma {
    double calcularArea();
}

public abstract class FormaBase implements Forma {
    protected String cor; // Estado
    
    public void desenhar() { // Código reutilizável
        System.out.println("Desenhando " + cor);
    }
}
```

**Skeletal Implementation** (Collections Framework):
```java
// Interface: List
// Classe abstrata: AbstractList
// Implementações: ArrayList, LinkedList
```

**Regra de Ouro**: Use **Interface** para **contratos** e **múltiplas capacidades** (baixo acoplamento). Use **Classe Abstrata** para **código reutilizável** e **estado compartilhado** (template method). Prefira **composição** a herança. Combine ambos (interface + skeletal implementation) para flexibilidade.
