# T1.03 - Polimorfismo de Sobrescrita (Overriding)

## Introdução

**Sobrescrita (Overriding)**: subclasse **redefine** método herdado da superclasse.

**Polimorfismo de runtime**: decisão de qual método executar acontece em **tempo de execução**.

**Características**:
- Mesma assinatura (nome, parâmetros, tipo de retorno)
- Anotação `@Override` recomendada
- Modificador de acesso igual ou mais permissivo
- Pode retornar subtipo (covariância)
- Não pode lançar exceções checked mais genéricas

```java
public class Animal {
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

// Polimorfismo em ação
Animal a = new Cachorro();
a.som(); // "Au au" - método sobrescrito é executado
```

---

## Fundamentos

### 1. Redefinir Método na Subclasse

```java
public abstract class Forma {
    public abstract double calcularArea();
}

public class Circulo extends Forma {
    private double raio;
    
    public Circulo(double raio) {
        this.raio = raio;
    }
    
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

public class Retangulo extends Forma {
    private double largura, altura;
    
    public Retangulo(double largura, double altura) {
        this.largura = largura;
        this.altura = altura;
    }
    
    @Override
    public double calcularArea() {
        return largura * altura;
    }
}
```

### 2. Anotação @Override

**Detecta erros** em tempo de compilação.

```java
public class Animal {
    public void som() {
        System.out.println("Som");
    }
}

// ❌ Sem @Override: erro não detectado
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

### 3. Mesma Assinatura

**Nome, parâmetros e tipo de retorno** devem ser idênticos (ou covariantes).

```java
public class Animal {
    public void mover(int distancia) {
        System.out.println("Movendo " + distancia + " metros");
    }
}

// ❌ Erro: assinatura diferente
public class Cachorro extends Animal {
    @Override
    public void mover(double distancia) { // Tipo diferente
        System.out.println("Correndo " + distancia + " metros");
    }
}

// ✅ Correto: mesma assinatura
public class Cachorro extends Animal {
    @Override
    public void mover(int distancia) {
        System.out.println("Correndo " + distancia + " metros");
    }
}
```

### 4. Modificador de Acesso Igual ou Mais Permissivo

```java
public class Animal {
    protected void metodo() { }
}

// ❌ Erro: reduzindo visibilidade
public class Cachorro extends Animal {
    @Override
    private void metodo() { } // protected → private
}

// ✅ Correto: mesma ou maior visibilidade
public class Cachorro extends Animal {
    @Override
    protected void metodo() { } // OK: protected → protected
}

public class Gato extends Animal {
    @Override
    public void metodo() { } // OK: protected → public
}
```

### 5. Resolução em Runtime (Dynamic Binding)

**JVM decide** qual método executar baseado no **tipo do objeto**, não da referência.

```java
Animal a1 = new Cachorro();
Animal a2 = new Gato();
Animal a3 = new Passaro();

a1.som(); // Runtime: método de Cachorro
a2.som(); // Runtime: método de Gato
a3.som(); // Runtime: método de Passaro

// Tipo da referência: Animal
// Tipo do objeto: determinado em runtime
```

### 6. Chamar Método da Superclasse com super

```java
public class Funcionario {
    protected double salarioBase;
    
    public double calcularSalario() {
        return salarioBase;
    }
}

public class Gerente extends Funcionario {
    private double bonus;
    
    @Override
    public double calcularSalario() {
        return super.calcularSalario() + bonus; // Reutiliza lógica da superclasse
    }
}
```

### 7. Covariância de Tipo de Retorno

**Retornar subtipo** do tipo original (Java 5+).

```java
public class Animal {
    public Animal criar() {
        return new Animal();
    }
}

// ✅ Correto: retorna subtipo (covariância)
public class Cachorro extends Animal {
    @Override
    public Cachorro criar() { // Cachorro é subtipo de Animal
        return new Cachorro();
    }
}
```

### 8. Exceções Checked Menos ou Mais Específicas

```java
public class Arquivo {
    public void ler() throws IOException {
        // ...
    }
}

// ✅ OK: sem exceção
public class ArquivoLocal extends Arquivo {
    @Override
    public void ler() {
        // ...
    }
}

// ✅ OK: exceção mais específica
public class ArquivoRemoto extends Arquivo {
    @Override
    public void ler() throws FileNotFoundException {
        // ...
    }
}

// ❌ Erro: exceção mais genérica
public class ArquivoDB extends Arquivo {
    @Override
    public void ler() throws Exception { // IOException → Exception
        // ...
    }
}
```

### 9. Métodos Que Não Podem Ser Sobrescritos

**final**, **static**, **private** não podem ser sobrescritos.

```java
public class Animal {
    public final void dormir() { // final
        System.out.println("Dormindo");
    }
    
    public static void info() { // static
        System.out.println("Animal");
    }
    
    private void interno() { // private
        System.out.println("Interno");
    }
}

public class Cachorro extends Animal {
    // ❌ Erro: não pode sobrescrever final
    @Override
    public void dormir() { }
    
    // ❌ Não é sobrescrita (hiding)
    public static void info() {
        System.out.println("Cachorro");
    }
    
    // ❌ Não é sobrescrita (método novo)
    private void interno() { }
}
```

### 10. Sobrescrita vs Sobrecarga

```java
// Sobrescrita (overriding): redefinir na subclasse
public class Animal {
    public void som() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() { // Sobrescrita
        System.out.println("Au au");
    }
}

// Sobrecarga (overloading): mesmo nome, parâmetros diferentes
public class Calculadora {
    public int somar(int a, int b) {
        return a + b;
    }
    
    public double somar(double a, double b) { // Sobrecarga
        return a + b;
    }
}
```

---

## Aplicabilidade

**Use sobrescrita quando**:
- **Especializar comportamento** em subclasses
- **Implementar métodos abstratos**
- **Polimorfismo**: processar diferentes tipos uniformemente
- **Template Method Pattern**: passos variáveis em estrutura fixa
- **Strategy Pattern**: diferentes algoritmos

**Exemplos**:
```java
// Collections Framework
public abstract class AbstractList<E> implements List<E> {
    public abstract E get(int index);
}

public class ArrayList<E> extends AbstractList<E> {
    @Override
    public E get(int index) {
        // Implementação com array
    }
}

public class LinkedList<E> extends AbstractList<E> {
    @Override
    public E get(int index) {
        // Implementação com nós encadeados
    }
}
```

---

## Armadilhas

### 1. Esquecer @Override

```java
public class Animal {
    public void som() { }
}

// ⚠️ Sem @Override: erro não detectado
public class Cachorro extends Animal {
    public void soM() { // Typo (M maiúsculo)
        System.out.println("Au au");
    }
}

// Resultado: método não sobrescrito, cria novo método
```

### 2. Assinatura Diferente

```java
public class Animal {
    public void mover() { }
}

// ❌ Erro detectado com @Override
public class Cachorro extends Animal {
    @Override
    public void mover(int distancia) { // Parâmetro extra
        System.out.println("Movendo");
    }
}
```

### 3. Reduzir Visibilidade

```java
public class Animal {
    public void som() { }
}

// ❌ Erro: public → protected
public class Cachorro extends Animal {
    @Override
    protected void som() { }
}
```

### 4. Tentar Sobrescrever Método final

```java
public class Animal {
    public final void respirar() { }
}

// ❌ Erro de compilação
public class Cachorro extends Animal {
    @Override
    public void respirar() { }
}
```

### 5. Confundir Sobrescrita com Hiding (métodos static)

```java
public class Animal {
    public static void info() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    // Não é sobrescrita, é hiding
    public static void info() {
        System.out.println("Cachorro");
    }
}

// Uso
Animal a = new Cachorro();
a.info(); // "Animal" (tipo da referência, não do objeto)

Cachorro.info(); // "Cachorro"
Animal.info();   // "Animal"
```

### 6. Exceção Mais Genérica

```java
public class Base {
    public void metodo() throws IOException { }
}

// ❌ Erro: exceção mais genérica
public class Derivada extends Base {
    @Override
    public void metodo() throws Exception { }
}
```

### 7. Chamar Método Sobrescrito em Construtor

```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
        exibir(); // ⚠️ Cuidado: chama método sobrescrito
    }
    
    public void exibir() {
        System.out.println("Animal: " + nome);
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    public Cachorro(String nome, String raca) {
        super(nome); // Chama exibir() antes de inicializar raca
        this.raca = raca;
    }
    
    @Override
    public void exibir() {
        // raca ainda é null aqui!
        System.out.println("Cachorro: " + nome + " (" + raca + ")");
    }
}
```

---

## Boas Práticas

### 1. Sempre Use @Override

```java
public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 2. Reutilize Código Com super

```java
public class Funcionario {
    protected double salarioBase;
    
    public double calcularSalario() {
        return salarioBase;
    }
}

public class Gerente extends Funcionario {
    private double bonus;
    
    @Override
    public double calcularSalario() {
        return super.calcularSalario() + bonus;
    }
}
```

### 3. Template Method Pattern

```java
public abstract class Relatorio {
    // Template method (final)
    public final void gerar() {
        inicializar();
        carregarDados();
        processar();
        salvar();
    }
    
    protected void inicializar() {
        System.out.println("Inicializando");
    }
    
    protected abstract void carregarDados();
    protected abstract void processar();
    
    protected void salvar() {
        System.out.println("Salvando");
    }
}

public class RelatorioVendas extends Relatorio {
    @Override
    protected void carregarDados() {
        System.out.println("Carregando vendas");
    }
    
    @Override
    protected void processar() {
        System.out.println("Processando vendas");
    }
}
```

### 4. Documente Sobrescritas Complexas

```java
/**
 * Calcula salário do gerente incluindo bônus.
 * @return salário base + bônus
 */
@Override
public double calcularSalario() {
    return super.calcularSalario() + bonus;
}
```

### 5. Evite Chamar Métodos Sobrescrevíveis em Construtores

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

### 6. Strategy Pattern

```java
public abstract class OrdenacaoStrategy {
    public abstract void ordenar(int[] array);
}

public class BubbleSort extends OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação Bubble Sort
        for (int i = 0; i < array.length - 1; i++) {
            for (int j = 0; j < array.length - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    int temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
    }
}

public class QuickSort extends OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        quickSort(array, 0, array.length - 1);
    }
    
    private void quickSort(int[] array, int baixo, int alto) {
        // Implementação Quick Sort
    }
}
```

### 7. Equals e HashCode

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Pessoa pessoa = (Pessoa) obj;
        return idade == pessoa.idade && 
               Objects.equals(nome, pessoa.nome);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(nome, idade);
    }
}
```

### 8. ToString

```java
public class Produto {
    private String nome;
    private double preco;
    
    @Override
    public String toString() {
        return String.format("Produto{nome='%s', preco=%.2f}", nome, preco);
    }
}
```

### 9. Factory Method

```java
public abstract class DocumentoFactory {
    public Documento criar(String tipo) {
        Documento doc = criarDocumento(tipo);
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

---

## Resumo

**Sobrescrita**:
```java
public class Animal {
    public void som() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

**Runtime binding**:
```java
Animal a = new Cachorro();
a.som(); // "Au au" - decidido em runtime
```

**Regras**:
- ✅ Mesma assinatura
- ✅ `@Override` recomendado
- ✅ Visibilidade igual ou maior
- ✅ Tipo de retorno igual ou subtipo
- ✅ Exceções menos ou mais específicas
- ❌ Não pode sobrescrever: final, static, private

**Visibilidade**:
```java
// ✅ OK
protected void metodo() { }
@Override public void metodo() { } // protected → public

// ❌ Erro
public void metodo() { }
@Override protected void metodo() { } // public → protected
```

**Covariância**:
```java
public Animal criar() {
    return new Animal();
}

@Override
public Cachorro criar() { // Cachorro é subtipo de Animal
    return new Cachorro();
}
```

**super**:
```java
@Override
public double calcularSalario() {
    return super.calcularSalario() + bonus;
}
```

**Não sobrescrevíveis**:
```java
public final void metodo1() { }      // final
public static void metodo2() { }     // static (hiding)
private void metodo3() { }           // private
```

**Template Method**:
```java
public abstract class Template {
    public final void processar() {
        passo1();
        passo2();
    }
    protected abstract void passo1();
    protected abstract void passo2();
}
```

**Quando usar**:
- ✅ Especializar comportamento
- ✅ Implementar métodos abstratos
- ✅ Polimorfismo
- ✅ Template Method
- ✅ Strategy Pattern

**Regra de Ouro**: Use **sobrescrita** para **redefinir comportamento** em subclasses. Sempre use `@Override`. Decisão em **runtime** (dynamic binding). Reutilize código com **super**. Evite chamar métodos sobrescrevíveis em **construtores**.
