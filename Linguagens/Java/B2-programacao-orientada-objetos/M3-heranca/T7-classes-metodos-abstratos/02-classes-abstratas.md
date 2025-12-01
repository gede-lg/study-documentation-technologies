# T7.02 - Classes Abstratas

## Introdução

**Classes abstratas**: não podem ser instanciadas diretamente.

**Modificador**: `abstract` na declaração da classe.

**Propósito**: definir **template** para subclasses.

**Características**:
- Pode ter métodos abstratos e concretos
- Pode ter atributos e construtores
- Pode implementar interfaces
- Subclasse concreta deve ser criada para instanciar

```java
public abstract class Veiculo {
    protected String marca;
    protected int ano;
    
    public abstract void acelerar();
    
    public void ligar() {
        System.out.println("Veículo ligado");
    }
}

// ❌ Erro: não pode instanciar
Veiculo v = new Veiculo();

// ✅ OK: instanciar subclasse
Veiculo c = new Carro();
c.acelerar();
```

```java
public abstract class Forma {
    protected String cor;
    
    public abstract double calcularArea();
    public abstract double calcularPerimetro();
    
    public void exibir() {
        System.out.println("Cor: " + cor);
        System.out.println("Área: " + calcularArea());
    }
}
```

---

## Fundamentos

### 1. Declaração de Classe Abstrata

**Sintaxe**: `abstract class NomeClasse`

```java
public abstract class Animal {
    protected String nome;
    
    public abstract void som();
}
```

### 2. Não Pode Ser Instanciada

```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro de compilação
Animal a = new Animal();

// ❌ Erro mesmo com construtor
Animal a = new Animal("Rex");
```

### 3. Pode Ter Atributos

```java
public abstract class Funcionario {
    protected String nome;
    protected double salarioBase;
    private LocalDate dataAdmissao;
    
    public abstract double calcularSalario();
}
```

### 4. Pode Ter Construtores

```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public abstract void som();
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome); // Chama construtor da superclasse
    }
    
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 5. Pode Ter Métodos Concretos

```java
public abstract class Conta {
    protected double saldo;
    
    public abstract void calcularRendimento();
    
    public void depositar(double valor) { // Concreto
        saldo += valor;
    }
    
    public void sacar(double valor) { // Concreto
        if (saldo >= valor) {
            saldo -= valor;
        }
    }
}
```

### 6. Pode Implementar Interfaces

```java
public abstract class Animal implements Comparable<Animal> {
    protected String nome;
    
    @Override
    public int compareTo(Animal outro) {
        return this.nome.compareTo(outro.nome);
    }
    
    public abstract void som();
}
```

### 7. Pode Estender Outra Classe

```java
public class SerVivo {
    protected boolean vivo = true;
}

public abstract class Animal extends SerVivo {
    public abstract void som();
}
```

### 8. Pode Ter Métodos static

```java
public abstract class Matematica {
    public static int somar(int a, int b) {
        return a + b;
    }
    
    public abstract double calcular();
}

// ✅ OK: método static
int resultado = Matematica.somar(5, 3);
```

### 9. Pode Ter Métodos final

```java
public abstract class Animal {
    public final void dormir() { // Não pode ser sobrescrito
        System.out.println("Dormindo...");
    }
    
    public abstract void som();
}
```

### 10. Hierarquia de Classes Abstratas

```java
public abstract class Animal {
    public abstract void som();
}

public abstract class Mamifero extends Animal {
    public abstract void amamentar();
}

public class Cachorro extends Mamifero {
    @Override
    public void som() {
        System.out.println("Au au");
    }
    
    @Override
    public void amamentar() {
        System.out.println("Amamentando filhotes");
    }
}
```

---

## Aplicabilidade

**Use classes abstratas quando**:
- **Compartilhar código** entre classes relacionadas
- **Template** com comportamento comum + específico
- **Hierarquia de classes** com relação "é-um"
- **Atributos** e **construtores** necessários
- **Modificadores** (protected, private) importantes

**Exemplos**:
```java
// Template para processamento
public abstract class ProcessadorArquivo {
    protected String caminho;
    
    public ProcessadorArquivo(String caminho) {
        this.caminho = caminho;
    }
    
    public final void processar() {
        abrir();
        ler();
        processar();
        fechar();
    }
    
    protected abstract void ler();
    protected abstract void processar();
    
    private void abrir() {
        System.out.println("Abrindo: " + caminho);
    }
    
    private void fechar() {
        System.out.println("Fechando: " + caminho);
    }
}
```

---

## Armadilhas

### 1. Tentar Instanciar Classe Abstrata

```java
public abstract class Animal {
    public abstract void som();
}

// ❌ Erro de compilação
Animal a = new Animal();

// ❌ Erro mesmo com construtor
Animal a = new Animal("Rex");
```

### 2. Classe Abstrata Sem Necessidade

```java
// ❌ Desnecessário: nenhum método abstrato
public abstract class Util {
    public static void metodo1() { }
    public static void metodo2() { }
}

// ✅ Melhor: classe concreta ou métodos estáticos
public class Util {
    private Util() { } // Prevenir instanciação
    
    public static void metodo1() { }
    public static void metodo2() { }
}
```

### 3. abstract com final (Conflito)

```java
// ❌ Erro: classe abstrata não pode ser final
public abstract final class Animal {
}

// Motivo: abstract exige herança, final proíbe
```

### 4. Hierarquia Muito Profunda

```java
// ❌ Complexo
public abstract class A { }
public abstract class B extends A { }
public abstract class C extends B { }
public abstract class D extends C { }
public class E extends D { }

// ✅ Simples
public abstract class Animal { }
public class Cachorro extends Animal { }
```

### 5. Classe Abstrata Como Bag of Methods

```java
// ❌ Anti-padrão: métodos não relacionados
public abstract class Util {
    public abstract void metodo1();
    public abstract void metodo2();
    public abstract void metodo3();
}

// ✅ Melhor: separar responsabilidades
public abstract class ProcessadorA {
    public abstract void processar();
}

public abstract class ProcessadorB {
    public abstract void processar();
}
```

### 6. Esquecer super() em Construtor

```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    // ❌ Erro: faltando super(nome)
    public Cachorro(String nome) {
    }
    
    // ✅ Correto
    public Cachorro(String nome) {
        super(nome);
    }
}
```

### 7. Modificadores Incompatíveis

```java
// ❌ Erro: abstract + final
public abstract final class Animal { }

// ❌ Erro: método abstrato + private
public abstract class Animal {
    private abstract void som();
}

// ❌ Erro: método abstrato + static
public abstract static void som();
```

---

## Boas Práticas

### 1. Use Para Hierarquias com Comportamento Comum

```java
public abstract class Funcionario {
    protected String nome;
    protected double salarioBase;
    
    public Funcionario(String nome, double salarioBase) {
        this.nome = nome;
        this.salarioBase = salarioBase;
    }
    
    public abstract double calcularSalario();
    
    public void exibir() {
        System.out.println(nome + ": R$ " + calcularSalario());
    }
}

public class Gerente extends Funcionario {
    private double bonus;
    
    public Gerente(String nome, double salarioBase, double bonus) {
        super(nome, salarioBase);
        this.bonus = bonus;
    }
    
    @Override
    public double calcularSalario() {
        return salarioBase + bonus;
    }
}
```

### 2. Template Method Pattern

```java
public abstract class Relatorio {
    public final void gerar() {
        inicializar();
        carregarDados();
        processar();
        formatar();
        salvar();
    }
    
    protected void inicializar() {
        System.out.println("Inicializando relatório");
    }
    
    protected abstract void carregarDados();
    protected abstract void processar();
    protected abstract void formatar();
    
    protected void salvar() {
        System.out.println("Relatório salvo");
    }
}
```

### 3. Construtores Para Inicialização Comum

```java
public abstract class Forma {
    protected String cor;
    protected boolean preenchida;
    
    public Forma(String cor, boolean preenchida) {
        this.cor = cor;
        this.preenchida = preenchida;
    }
    
    public abstract double calcularArea();
}

public class Circulo extends Forma {
    private double raio;
    
    public Circulo(String cor, boolean preenchida, double raio) {
        super(cor, preenchida);
        this.raio = raio;
    }
    
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}
```

### 4. protected Para Permitir Acesso de Subclasses

```java
public abstract class Animal {
    protected String nome;
    protected int idade;
    
    protected void validarIdade(int idade) {
        if (idade < 0) {
            throw new IllegalArgumentException("Idade inválida");
        }
    }
    
    public abstract void som();
}
```

### 5. Combine Métodos Abstratos e Concretos

```java
public abstract class Conta {
    protected double saldo;
    
    public abstract void calcularRendimento();
    
    public void depositar(double valor) {
        validarValor(valor);
        saldo += valor;
    }
    
    public void sacar(double valor) {
        validarValor(valor);
        if (saldo >= valor) {
            saldo -= valor;
        }
    }
    
    private void validarValor(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
    }
}
```

### 6. Factory Method Pattern

```java
public abstract class DocumentoFactory {
    public Documento criarDocumento(String tipo) {
        Documento doc = criarDocumentoEspecifico(tipo);
        doc.inicializar();
        return doc;
    }
    
    protected abstract Documento criarDocumentoEspecifico(String tipo);
}

public class PDFFactory extends DocumentoFactory {
    @Override
    protected Documento criarDocumentoEspecifico(String tipo) {
        return new DocumentoPDF(tipo);
    }
}
```

### 7. Documente Propósito e Responsabilidades

```java
/**
 * Classe base abstrata para processadores de dados.
 * Define template para processamento em 4 etapas:
 * 1. Carregar dados
 * 2. Validar
 * 3. Processar
 * 4. Salvar
 */
public abstract class ProcessadorDados {
    public final void processar() {
        carregar();
        validar();
        executar();
        salvar();
    }
    
    protected abstract void carregar();
    protected abstract void validar();
    protected abstract void executar();
    protected abstract void salvar();
}
```

### 8. Evite Hierarquias Complexas

```java
// ✅ Hierarquia simples
Animal
  ├─ Cachorro
  ├─ Gato
  └─ Passaro

// ❌ Hierarquia profunda
Animal
  └─ Vertebrado
      └─ Mamifero
          └─ Carnivoro
              └─ Canideo
                  └─ Cachorro
```

### 9. Use Para Código Compartilhado

```java
public abstract class RepositorioBase<T> {
    protected List<T> itens = new ArrayList<>();
    
    public void adicionar(T item) {
        validar(item);
        itens.add(item);
    }
    
    public List<T> listarTodos() {
        return new ArrayList<>(itens);
    }
    
    protected abstract void validar(T item);
}
```

---

## Resumo

**Declaração**:
```java
public abstract class Animal {
    protected String nome;
    
    public abstract void som();
}
```

**Não pode instanciar**:
```java
// ❌ Erro
Animal a = new Animal();

// ✅ OK: subclasse concreta
Animal c = new Cachorro();
```

**Construtores**:
```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
}
```

**Métodos concretos**:
```java
public abstract class Conta {
    protected double saldo;
    
    public abstract void calcularRendimento();
    
    public void depositar(double valor) {
        saldo += valor;
    }
}
```

**Implementar interfaces**:
```java
public abstract class Animal implements Comparable<Animal> {
    @Override
    public int compareTo(Animal outro) {
        return this.nome.compareTo(outro.nome);
    }
}
```

**Template Method**:
```java
public abstract class Processador {
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

**Hierarquia**:
```java
public abstract class Animal { }
public abstract class Mamifero extends Animal { }
public class Cachorro extends Mamifero { }
```

**Conflitos**:
```java
// ❌ abstract + final
public abstract final class Animal { }

// ❌ método abstrato + private/static
private abstract void som();
public abstract static void som();
```

**Quando usar**:
- ✅ Compartilhar código entre classes relacionadas
- ✅ Template Method Pattern
- ✅ Hierarquia com comportamento comum
- ✅ Atributos e construtores necessários
- ❌ Contrato simples sem estado (use interface)

**Regra de Ouro**: **Classes abstratas** definem **template** com **comportamento comum**. **Não podem ser instanciadas**. Use para **compartilhar código** e **atributos** entre subclasses. Combine **métodos abstratos** (contrato) e **concretos** (implementação compartilhada).
