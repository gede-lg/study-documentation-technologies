# T1.04 - Binding Dinâmico (Late Binding)

## Introdução

**Binding (vinculação)**: associação entre chamada de método e código executado.

**Binding Dinâmico (Late Binding)**: decisão de **qual método executar** ocorre em **runtime**, baseado no **tipo do objeto**, não da referência.

**Binding Estático (Early Binding)**: decisão em **compile-time** (métodos static, final, private, sobrecarga).

```java
Animal a = new Cachorro(); // Tipo da referência: Animal, tipo do objeto: Cachorro
a.som(); // Runtime: JVM verifica tipo real (Cachorro) e executa seu método
```

**Benefícios**:
- **Polimorfismo**: tratar diferentes tipos uniformemente
- **Extensibilidade**: adicionar novas subclasses sem alterar código existente
- **Flexibilidade**: decisão baseada em objeto real, não em referência

---

## Fundamentos

### 1. Binding Dinâmico vs Binding Estático

```java
public class Animal {
    public void som() { // Pode ser sobrescrito
        System.out.println("Som");
    }
    
    public static void info() { // Static: binding estático
        System.out.println("Animal");
    }
    
    public final void dormir() { // Final: binding estático
        System.out.println("Dormindo");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() { // Sobrescrito: binding dinâmico
        System.out.println("Au au");
    }
    
    public static void info() { // Hiding: binding estático
        System.out.println("Cachorro");
    }
}

// Uso
Animal a = new Cachorro();

a.som();     // "Au au" - binding dinâmico (runtime)
a.info();    // "Animal" - binding estático (compile-time)
a.dormir();  // "Dormindo" - binding estático (final)
```

### 2. Virtual Method Invocation

**JVM** usa **virtual method invocation** para decidir qual método executar.

```java
public class Forma {
    public void desenhar() {
        System.out.println("Forma");
    }
}

public class Circulo extends Forma {
    @Override
    public void desenhar() {
        System.out.println("Circulo");
    }
}

public class Retangulo extends Forma {
    @Override
    public void desenhar() {
        System.out.println("Retangulo");
    }
}

// Runtime: JVM verifica tipo real e chama método correspondente
Forma f1 = new Circulo();
Forma f2 = new Retangulo();

f1.desenhar(); // "Circulo" - tipo real é Circulo
f2.desenhar(); // "Retangulo" - tipo real é Retangulo
```

### 3. Virtual Method Table (vtable)

**JVM** usa **vtable** para resolver chamadas de métodos virtuais.

**Estrutura**:
- Cada classe tem uma vtable
- Contém referências para métodos virtuais
- Métodos sobrescritos substituem entradas da vtable

```java
// Conceitual (JVM internamente)
class Animal {
    vtable:
    [0] som() -> Animal.som()
    [1] mover() -> Animal.mover()
}

class Cachorro extends Animal {
    vtable:
    [0] som() -> Cachorro.som()      // Sobrescrito
    [1] mover() -> Animal.mover()    // Herdado
    [2] latir() -> Cachorro.latir()  // Novo método
}

// Chamada
Animal a = new Cachorro();
a.som(); 
// 1. JVM obtém vtable de Cachorro
// 2. Busca índice [0] (som)
// 3. Executa Cachorro.som()
```

### 4. Tipo da Referência vs Tipo do Objeto

```java
Animal a = new Cachorro();
// Tipo da referência: Animal (compile-time)
// Tipo do objeto: Cachorro (runtime)

// Compile-time: verifica se método existe em Animal
a.som(); // ✅ Compilador verifica: Animal tem som()?

// Runtime: executa método de Cachorro
a.som(); // JVM executa: Cachorro.som()

// ❌ Erro de compilação: método não existe em Animal
a.latir(); // Cachorro tem latir(), mas Animal não
```

### 5. Upcasting e Downcasting

```java
// Upcasting (implícito)
Cachorro c = new Cachorro();
Animal a = c; // Upcasting: Cachorro → Animal

// Downcasting (explícito)
Animal a = new Cachorro();
Cachorro c = (Cachorro) a; // Downcasting: Animal → Cachorro

// ❌ ClassCastException em runtime
Animal a = new Gato();
Cachorro c = (Cachorro) a; // Erro: Gato não é Cachorro

// ✅ Verificar tipo antes de downcasting
if (a instanceof Cachorro) {
    Cachorro c = (Cachorro) a;
    c.latir();
}
```

### 6. Performance de Binding Dinâmico

**Custo adicional**: pequeno overhead em runtime.

**Otimizações da JVM**:
- **Inline caching**: cacheia resultado de binding
- **JIT compiler**: otimiza chamadas frequentes
- **Devirtualization**: converte chamada virtual em estática quando possível

```java
// Sem otimização: vtable lookup a cada chamada
for (int i = 0; i < 1_000_000; i++) {
    animal.som();
}

// Com JIT: após algumas iterações, JVM pode otimizar
// - Inline: substitui chamada pelo corpo do método
// - Devirtualization: se sempre Cachorro, torna estática
```

### 7. Binding Estático (Métodos static)

```java
public class Animal {
    public static void info() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    public static void info() { // Hiding, não sobrescrita
        System.out.println("Cachorro");
    }
}

// Binding estático: baseado no tipo da referência
Animal a = new Cachorro();
a.info(); // "Animal" - tipo da referência

Cachorro.info(); // "Cachorro"
Animal.info();   // "Animal"
```

### 8. Binding Estático (Métodos final)

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando");
    }
}

public class Cachorro extends Animal {
    // ❌ Não pode sobrescrever final
}

// Binding estático: sempre Animal.respirar()
Animal a = new Cachorro();
a.respirar(); // "Respirando" - compile-time binding
```

### 9. Binding Estático (Métodos private)

```java
public class Animal {
    private void metodoPrivado() {
        System.out.println("Privado");
    }
    
    public void chamar() {
        metodoPrivado(); // Binding estático
    }
}

public class Cachorro extends Animal {
    private void metodoPrivado() { // Não é sobrescrita
        System.out.println("Privado Cachorro");
    }
}

Animal a = new Cachorro();
a.chamar(); // "Privado" - chama Animal.metodoPrivado()
```

### 10. instanceof e Pattern Matching (Java 16+)

```java
// Antes do Java 16
if (animal instanceof Cachorro) {
    Cachorro c = (Cachorro) animal;
    c.latir();
}

// Java 16+: Pattern Matching
if (animal instanceof Cachorro c) {
    c.latir(); // c já é Cachorro
}

// Switch Pattern Matching (Java 17+ Preview)
String resultado = switch (animal) {
    case Cachorro c -> "Au au";
    case Gato g -> "Miau";
    case Passaro p -> "Piu piu";
    default -> "Som desconhecido";
};
```

---

## Aplicabilidade

**Use binding dinâmico quando**:
- **Polimorfismo**: processar diferentes tipos uniformemente
- **Extensibilidade**: adicionar subclasses sem modificar código
- **Frameworks**: permitir customização via sobrescrita
- **Design Patterns**: Strategy, Template Method, Factory

**Exemplos**:
```java
// Collections Framework
List<String> lista = new ArrayList<>(); // Binding dinâmico
lista.add("Java"); // Método de ArrayList

// InputStream
InputStream in = new FileInputStream("file.txt"); // Binding dinâmico
int b = in.read(); // Método de FileInputStream
```

---

## Armadilhas

### 1. Confundir Binding Dinâmico com Estático

```java
Animal a = new Cachorro();

a.som();   // ✅ Binding dinâmico: "Au au"
a.info();  // ⚠️ Binding estático (static): "Animal"
```

### 2. ClassCastException

```java
Animal a = new Gato();
Cachorro c = (Cachorro) a; // ❌ Runtime: ClassCastException

// ✅ Verificar antes
if (a instanceof Cachorro) {
    Cachorro c = (Cachorro) a;
}
```

### 3. Chamar Método Sobrescrito em Construtor

```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
        exibir(); // ⚠️ Binding dinâmico: chama Cachorro.exibir()
    }
    
    public void exibir() {
        System.out.println("Animal: " + nome);
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    public Cachorro(String nome, String raca) {
        super(nome); // Chama Animal() que chama exibir()
        this.raca = raca;
    }
    
    @Override
    public void exibir() {
        // raca é null aqui!
        System.out.println("Cachorro: " + nome + " (" + raca + ")");
    }
}

Cachorro c = new Cachorro("Rex", "Labrador");
// Output: "Cachorro: Rex (null)" - raca não inicializado
```

### 4. Tipo da Referência Limita Acesso

```java
Animal a = new Cachorro();
a.som();    // ✅ Animal tem som()
a.latir();  // ❌ Erro: Animal não tem latir()

// Solução: downcasting
if (a instanceof Cachorro c) {
    c.latir(); // ✅
}
```

### 5. Atributos Não Têm Binding Dinâmico

```java
public class Animal {
    public String tipo = "Animal";
}

public class Cachorro extends Animal {
    public String tipo = "Cachorro";
}

Animal a = new Cachorro();
System.out.println(a.tipo); // "Animal" - atributos não têm binding dinâmico
```

### 6. Métodos Privados Não São Polimórficos

```java
public class Animal {
    private void metodo() {
        System.out.println("Animal");
    }
    
    public void chamar() {
        metodo(); // Binding estático: sempre Animal.metodo()
    }
}

public class Cachorro extends Animal {
    private void metodo() { // Novo método, não sobrescrita
        System.out.println("Cachorro");
    }
}

Animal a = new Cachorro();
a.chamar(); // "Animal"
```

---

## Boas Práticas

### 1. Use instanceof Antes de Downcasting

```java
// ✅ Verificar tipo
if (animal instanceof Cachorro c) {
    c.latir();
}

// ❌ Downcasting sem verificação
Cachorro c = (Cachorro) animal; // Pode lançar ClassCastException
```

### 2. Evite Chamar Métodos Sobrescrevíveis em Construtores

```java
// ❌ Evite
public Animal(String nome) {
    this.nome = nome;
    exibir(); // Método sobrescrito pode usar atributos não inicializados
}

// ✅ Melhor
public Animal(String nome) {
    this.nome = nome;
    // Não chamar métodos sobrescrevíveis
}
```

### 3. Prefira Composição a Herança

```java
// ✅ Composição
public class Carro {
    private Motor motor;
    
    public void ligar() {
        motor.ligar(); // Delega ao motor
    }
}

// ❌ Herança desnecessária
public class Carro extends Motor {
    @Override
    public void ligar() {
        super.ligar();
    }
}
```

### 4. Strategy Pattern

```java
public interface OrdenacaoStrategy {
    void ordenar(int[] array);
}

public class BubbleSort implements OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação
    }
}

public class QuickSort implements OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação
    }
}

public class Ordenador {
    private OrdenacaoStrategy strategy;
    
    public void setStrategy(OrdenacaoStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void ordenar(int[] array) {
        strategy.ordenar(array); // Binding dinâmico
    }
}
```

### 5. Template Method Pattern

```java
public abstract class Relatorio {
    // Template method (final para evitar sobrescrita)
    public final void gerar() {
        inicializar();
        carregarDados();   // Binding dinâmico
        processar();       // Binding dinâmico
        salvar();
    }
    
    protected void inicializar() { }
    protected abstract void carregarDados();
    protected abstract void processar();
    protected void salvar() { }
}
```

### 6. Factory Method Pattern

```java
public abstract class DocumentoFactory {
    public Documento criar(String tipo) {
        Documento doc = criarDocumento(tipo); // Binding dinâmico
        doc.inicializar();
        return doc;
    }
    
    protected abstract Documento criarDocumento(String tipo);
}

public class PDFFactory extends DocumentoFactory {
    @Override
    protected Documento criarDocumento(String tipo) {
        return new DocumentoPDF(tipo);
    }
}
```

### 7. Use Enum Para Tipos Fixos

```java
// ✅ Enum com polimorfismo
public enum Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    SUBTRACAO {
        @Override
        public double calcular(double a, double b) {
            return a - b;
        }
    };
    
    public abstract double calcular(double a, double b);
}

Operacao op = Operacao.SOMA;
double resultado = op.calcular(10, 5); // Binding dinâmico
```

### 8. Liskov Substitution Principle

```java
// ✅ LSP respeitado
public class Retangulo {
    protected int largura, altura;
    
    public void setLargura(int largura) {
        this.largura = largura;
    }
    
    public void setAltura(int altura) {
        this.altura = altura;
    }
    
    public int calcularArea() {
        return largura * altura;
    }
}

// ❌ LSP violado
public class Quadrado extends Retangulo {
    @Override
    public void setLargura(int largura) {
        this.largura = largura;
        this.altura = largura; // Altera comportamento esperado
    }
    
    @Override
    public void setAltura(int altura) {
        this.largura = altura;
        this.altura = altura; // Altera comportamento esperado
    }
}
```

---

## Resumo

**Binding Dinâmico**:
```java
Animal a = new Cachorro();
a.som(); // Runtime: JVM verifica tipo real (Cachorro)
```

**Binding Estático**:
```java
Animal a = new Cachorro();
a.info();    // Compile-time: tipo da referência (Animal)
a.dormir();  // Compile-time: final
```

**Virtual Method Invocation**:
```java
Forma f1 = new Circulo();
Forma f2 = new Retangulo();
f1.desenhar(); // "Circulo" - runtime
f2.desenhar(); // "Retangulo" - runtime
```

**Virtual Method Table**:
```java
// JVM usa vtable para resolver chamadas
Cachorro.vtable:
[0] som() -> Cachorro.som()      // Sobrescrito
[1] mover() -> Animal.mover()    // Herdado
```

**Upcasting/Downcasting**:
```java
Cachorro c = new Cachorro();
Animal a = c; // Upcasting (implícito)

if (a instanceof Cachorro cachorro) { // Downcasting (explícito)
    cachorro.latir();
}
```

**Métodos Não Polimórficos**:
```java
public final void metodo1() { }   // final
public static void metodo2() { }  // static
private void metodo3() { }        // private
```

**Atributos**:
```java
Animal a = new Cachorro();
a.tipo; // Atributos não têm binding dinâmico (tipo da referência)
```

**Quando usar**:
- ✅ Polimorfismo
- ✅ Extensibilidade
- ✅ Design Patterns (Strategy, Template Method, Factory)
- ✅ Frameworks customizáveis

**Evitar**:
- ❌ Chamar métodos sobrescrevíveis em construtores
- ❌ Downcasting sem instanceof
- ❌ Herança desnecessária (prefira composição)

**Regra de Ouro**: **Binding dinâmico** = decisão em **runtime** baseada no **tipo do objeto** (não da referência). JVM usa **vtable** para resolver chamadas. Métodos **final**, **static** e **private** têm **binding estático** (compile-time). Sempre verifique tipo com **instanceof** antes de **downcasting**.
