# T1.01 - Conceito de Polimorfismo

## Introdução

**Polimorfismo**: "muitas formas" - capacidade de um objeto assumir múltiplas formas.

**Definição**: mesmo método pode ter **comportamentos diferentes** dependendo do objeto.

**Tipos**:
- **Polimorfismo de sobrecarga** (compile-time): métodos com mesmo nome, parâmetros diferentes
- **Polimorfismo de sobrescrita** (runtime): método na subclasse redefine comportamento

**Benefícios**:
- **Flexibilidade**: processar diferentes tipos uniformemente
- **Extensibilidade**: adicionar novos tipos sem modificar código existente
- **Acoplamento fraco**: depender de abstrações, não de implementações
- **Código limpo**: eliminar condicionais complexas

```java
// Polimorfismo em ação
Animal animal1 = new Cachorro();
Animal animal2 = new Gato();

animal1.som(); // "Au au" - comportamento de Cachorro
animal2.som(); // "Miau" - comportamento de Gato

// Mesmo tipo (Animal), comportamentos diferentes
```

```java
// Lista polimórfica
List<Animal> animais = Arrays.asList(
    new Cachorro(),
    new Gato(),
    new Passaro()
);

for (Animal animal : animais) {
    animal.som(); // Cada um emite som diferente
}
```

---

## Fundamentos

### 1. Definição: Muitas Formas

**Um objeto pode ser tratado como múltiplos tipos**.

```java
public class Cachorro extends Animal implements Domestico {
    // ...
}

// Cachorro "é-um" Cachorro
Cachorro c1 = new Cachorro();

// Cachorro "é-um" Animal
Animal c2 = new Cachorro();

// Cachorro "é-um" Domestico
Domestico c3 = new Cachorro();

// Todos apontam para o mesmo objeto
```

### 2. Polimorfismo de Sobrecarga (Compile-Time)

**Múltiplos métodos** com **mesmo nome**, **parâmetros diferentes**.

```java
public class Calculadora {
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
calc.somar(5, 3);        // int somar(int, int)
calc.somar(5.5, 3.2);    // double somar(double, double)
calc.somar(1, 2, 3);     // int somar(int, int, int)
```

### 3. Polimorfismo de Sobrescrita (Runtime)

**Método na subclasse** redefine **comportamento da superclasse**.

```java
public abstract class Animal {
    public void som() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}

public class Gato extends Animal {
    @Override
    public void som() {
        System.out.println("Miau");
    }
}

// Uso polimórfico
Animal a1 = new Cachorro();
Animal a2 = new Gato();

a1.som(); // "Au au"
a2.som(); // "Miau"
```

### 4. Substituição de Liskov

**Subclasse pode substituir superclasse** sem quebrar programa.

```java
// Código depende apenas de Animal
public void fazerSom(Animal animal) {
    animal.som();
}

// Funciona com qualquer subclasse
fazerSom(new Cachorro()); // ✅
fazerSom(new Gato());     // ✅
fazerSom(new Passaro());  // ✅
```

### 5. Binding Dinâmico (Late Binding)

**Decisão de qual método executar** acontece em **runtime**.

```java
Animal animal;

if (Math.random() > 0.5) {
    animal = new Cachorro();
} else {
    animal = new Gato();
}

animal.som(); // Método decidido em runtime
```

### 6. Polimorfismo com Interfaces

**Referência de interface** aponta para implementação.

```java
public interface Voador {
    void voar();
}

public class Passaro implements Voador {
    @Override
    public void voar() {
        System.out.println("Batendo asas");
    }
}

public class Aviao implements Voador {
    @Override
    public void voar() {
        System.out.println("Turbinas ligadas");
    }
}

// Polimorfismo
Voador v1 = new Passaro();
Voador v2 = new Aviao();

v1.voar(); // "Batendo asas"
v2.voar(); // "Turbinas ligadas"
```

### 7. Vantagem: Flexibilidade

**Processar diferentes tipos** uniformemente.

```java
public void processar(List<Animal> animais) {
    for (Animal animal : animais) {
        animal.som();
        animal.mover();
    }
}

// Funciona com qualquer combinação
processar(Arrays.asList(
    new Cachorro(),
    new Gato(),
    new Passaro()
));
```

### 8. Vantagem: Extensibilidade

**Adicionar novos tipos** sem modificar código existente.

```java
// Código original
public void exibirSom(Animal animal) {
    animal.som();
}

// Adicionar novo tipo (sem modificar exibirSom)
public class Cobra extends Animal {
    @Override
    public void som() {
        System.out.println("Ssss");
    }
}

// Funciona automaticamente
exibirSom(new Cobra());
```

### 9. Vantagem: Acoplamento Fraco

**Depender de abstrações**, não de implementações concretas.

```java
// ✅ Acoplamento fraco
public class Servico {
    private Repository repository;
    
    public Servico(Repository repository) {
        this.repository = repository;
    }
    
    public void salvar(Dados dados) {
        repository.salvar(dados);
    }
}

// Qualquer implementação funciona
Servico s1 = new Servico(new DatabaseRepository());
Servico s2 = new Servico(new FileRepository());
Servico s3 = new Servico(new MemoryRepository());
```

### 10. Vantagem: Código Limpo

**Eliminar condicionais** complexas.

```java
// ❌ Sem polimorfismo: muitos ifs
public void processar(String tipo) {
    if (tipo.equals("cachorro")) {
        System.out.println("Au au");
    } else if (tipo.equals("gato")) {
        System.out.println("Miau");
    } else if (tipo.equals("passaro")) {
        System.out.println("Piu piu");
    }
}

// ✅ Com polimorfismo: limpo
public void processar(Animal animal) {
    animal.som();
}
```

---

## Aplicabilidade

**Use polimorfismo quando**:
- **Múltiplos tipos** compartilham **interface comum**
- **Comportamento varia** por tipo
- **Extensibilidade** é importante
- **Código genérico** deve processar diferentes tipos
- **Eliminar condicionais** baseadas em tipo

**Exemplos**:
```java
// Collections Framework
List<String> lista1 = new ArrayList<>();
List<String> lista2 = new LinkedList<>();

// Ambas são List, comportamentos diferentes

// Strategy Pattern
public interface OrdenacaoStrategy {
    void ordenar(int[] array);
}

public class BubbleSort implements OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação Bubble Sort
    }
}

public class QuickSort implements OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação Quick Sort
    }
}

// Uso polimórfico
public void executar(OrdenacaoStrategy strategy, int[] array) {
    strategy.ordenar(array);
}
```

---

## Armadilhas

### 1. Confundir Sobrecarga com Sobrescrita

```java
// Sobrecarga (mesmo nome, parâmetros diferentes)
public void metodo(int x) { }
public void metodo(double x) { }

// Sobrescrita (redefinir na subclasse)
@Override
public void metodo() { }
```

### 2. Esquecer @Override

```java
public class Animal {
    public void som() { }
}

// ⚠️ Sem @Override: erro não detectado
public class Cachorro extends Animal {
    public void soM() { // Typo não detectado
        System.out.println("Au au");
    }
}

// ✅ Com @Override: erro detectado
public class Cachorro extends Animal {
    @Override
    public void soM() { // Erro de compilação
        System.out.println("Au au");
    }
}
```

### 3. Métodos static Não São Polimórficos

```java
public class Animal {
    public static void info() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    public static void info() {
        System.out.println("Cachorro");
    }
}

// ❌ Não é polimórfico
Animal a = new Cachorro();
a.info(); // "Animal" (tipo da referência, não do objeto)

// Métodos static pertencem à classe, não ao objeto
```

### 4. Métodos private/final Não Podem Ser Sobrescritos

```java
public class Animal {
    private void metodo1() { }
    public final void metodo2() { }
}

public class Cachorro extends Animal {
    // ❌ Erro: não pode sobrescrever private
    @Override
    private void metodo1() { }
    
    // ❌ Erro: não pode sobrescrever final
    @Override
    public void metodo2() { }
}
```

### 5. Violação do Princípio de Liskov

```java
public class Retangulo {
    protected int largura, altura;
    
    public void setLargura(int largura) {
        this.largura = largura;
    }
    
    public void setAltura(int altura) {
        this.altura = altura;
    }
}

// ⚠️ Violação: Quadrado não pode substituir Retangulo
public class Quadrado extends Retangulo {
    @Override
    public void setLargura(int largura) {
        this.largura = largura;
        this.altura = largura; // Efeito colateral inesperado
    }
    
    @Override
    public void setAltura(int altura) {
        this.largura = altura;
        this.altura = altura;
    }
}

// Código que funciona com Retangulo quebra com Quadrado
public void testar(Retangulo r) {
    r.setLargura(5);
    r.setAltura(10);
    assert r.largura * r.altura == 50; // Falha para Quadrado
}
```

### 6. Casting Inseguro

```java
Animal animal = new Cachorro();

// ❌ Erro: Gato não é compatível
Gato gato = (Gato) animal; // ClassCastException

// ✅ Correto: verificar antes
if (animal instanceof Gato) {
    Gato gato = (Gato) animal;
}
```

---

## Boas Práticas

### 1. Programe Para Interfaces, Não Implementações

```java
// ✅ Bom: depende de interface
List<String> lista = new ArrayList<>();
Map<String, Integer> mapa = new HashMap<>();

// ❌ Ruim: depende de implementação
ArrayList<String> lista = new ArrayList<>();
HashMap<String, Integer> mapa = new HashMap<>();
```

### 2. Use @Override Sempre

```java
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 3. Princípio de Substituição de Liskov

```java
// ✅ Subclasse substitui superclasse sem quebrar
public abstract class Forma {
    public abstract double calcularArea();
}

public class Circulo extends Forma {
    private double raio;
    
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

public void processar(Forma forma) {
    double area = forma.calcularArea(); // Funciona com qualquer Forma
}
```

### 4. Strategy Pattern

```java
public interface PagamentoStrategy {
    void pagar(double valor);
}

public class CartaoCredito implements PagamentoStrategy {
    @Override
    public void pagar(double valor) {
        System.out.println("Pagando R$ " + valor + " com cartão");
    }
}

public class Boleto implements PagamentoStrategy {
    @Override
    public void pagar(double valor) {
        System.out.println("Gerando boleto de R$ " + valor);
    }
}

// Uso
public class Pedido {
    private PagamentoStrategy pagamento;
    
    public Pedido(PagamentoStrategy pagamento) {
        this.pagamento = pagamento;
    }
    
    public void processar(double valor) {
        pagamento.pagar(valor);
    }
}
```

### 5. Factory Pattern

```java
public abstract class Forma {
    public abstract void desenhar();
}

public class Circulo extends Forma {
    @Override
    public void desenhar() {
        System.out.println("Desenhando círculo");
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

// Uso polimórfico
Forma forma = FormaFactory.criar("circulo");
forma.desenhar();
```

### 6. Template Method Pattern

```java
public abstract class Relatorio {
    public final void gerar() {
        carregarDados();
        processar();
        formatar();
        salvar();
    }
    
    protected abstract void carregarDados();
    protected abstract void processar();
    protected abstract void formatar();
    
    protected void salvar() {
        System.out.println("Salvando relatório");
    }
}

public class RelatorioPDF extends Relatorio {
    @Override
    protected void carregarDados() {
        System.out.println("Carregando dados para PDF");
    }
    
    @Override
    protected void processar() {
        System.out.println("Processando dados");
    }
    
    @Override
    protected void formatar() {
        System.out.println("Formatando como PDF");
    }
}
```

### 7. Collections e Polimorfismo

```java
public void processar(List<Animal> animais) {
    for (Animal animal : animais) {
        animal.som();
        animal.mover();
    }
}

// Qualquer lista de Animal (ou subclasses)
processar(Arrays.asList(
    new Cachorro(),
    new Gato(),
    new Passaro()
));
```

### 8. Dependency Injection

```java
public class Servico {
    private final Repository repository;
    
    // Injeção via construtor
    public Servico(Repository repository) {
        this.repository = repository;
    }
    
    public void salvar(Dados dados) {
        repository.salvar(dados);
    }
}

// Qualquer implementação de Repository
Servico s1 = new Servico(new DatabaseRepository());
Servico s2 = new Servico(new FileRepository());
```

### 9. Open/Closed Principle

**Aberto para extensão, fechado para modificação**.

```java
// Código existente (não modificar)
public void processar(Animal animal) {
    animal.som();
}

// Adicionar novo tipo (extensão)
public class Cobra extends Animal {
    @Override
    public void som() {
        System.out.println("Ssss");
    }
}

// Funciona automaticamente
processar(new Cobra());
```

---

## Resumo

**Definição**:
```java
// Polimorfismo: mesmo tipo, comportamentos diferentes
Animal a1 = new Cachorro();
Animal a2 = new Gato();

a1.som(); // "Au au"
a2.som(); // "Miau"
```

**Tipos**:
```java
// Sobrecarga (compile-time)
public void metodo(int x) { }
public void metodo(double x) { }

// Sobrescrita (runtime)
@Override
public void metodo() { }
```

**Benefícios**:
- ✅ Flexibilidade
- ✅ Extensibilidade
- ✅ Acoplamento fraco
- ✅ Código limpo

**Princípios**:
- Substituição de Liskov
- Programe para interfaces
- Open/Closed Principle

**Padrões**:
```java
// Strategy
public interface Strategy {
    void executar();
}

// Template Method
public abstract class Template {
    public final void processar() {
        passo1();
        passo2();
    }
    protected abstract void passo1();
    protected abstract void passo2();
}

// Factory
public static Forma criar(String tipo) {
    // ...
}
```

**Limitações**:
- ❌ Métodos static não são polimórficos
- ❌ Métodos private/final não podem ser sobrescritos
- ⚠️ Verificar tipo com instanceof antes de casting

**Quando usar**:
- ✅ Múltiplos tipos com interface comum
- ✅ Comportamento varia por tipo
- ✅ Extensibilidade importante
- ✅ Eliminar condicionais complexas

**Regra de Ouro**: Use **polimorfismo** para processar **diferentes tipos uniformemente**. Programe para **interfaces**, não implementações. **Subclasses** devem **substituir** superclasses sem quebrar código.
