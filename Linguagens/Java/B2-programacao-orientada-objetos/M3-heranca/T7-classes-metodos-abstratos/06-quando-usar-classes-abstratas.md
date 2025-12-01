# T7.06 - Quando Usar Classes Abstratas

## Introdução

**Classes abstratas**: melhor escolha quando há **comportamento comum** entre classes relacionadas.

**Critérios** para usar:
- Compartilhar **código** entre subclasses
- **Estado comum** (atributos)
- **Construtores** necessários
- **Hierarquia** "é-um"
- **Template Method Pattern**

**Alternativas**:
- **Interface**: contrato sem implementação
- **Composição**: delegar comportamento
- **Classe concreta**: quando instanciação direta é necessária

```java
// ✅ Use classe abstrata: comportamento comum
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

// ❌ Interface: sem estado ou código compartilhado
public interface Calculavel {
    double calcular();
}
```

---

## Fundamentos

### 1. Compartilhar Código Entre Classes Relacionadas

**Quando**: múltiplas classes com **comportamento comum**.

```java
// ✅ Classe abstrata para código compartilhado
public abstract class Conta {
    protected double saldo;
    protected String numero;
    
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
    
    public abstract void calcularRendimento();
    
    private void validarValor(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
    }
}

public class ContaPoupanca extends Conta {
    @Override
    public void calcularRendimento() {
        saldo += saldo * 0.005;
    }
}
```

### 2. Estado Comum (Atributos)

**Quando**: subclasses compartilham **atributos**.

```java
// ✅ Estado comum em classe abstrata
public abstract class Veiculo {
    protected String marca;
    protected int ano;
    protected String placa;
    
    public abstract void acelerar();
    public abstract void frear();
}

// ❌ Interface não pode ter estado
public interface Veiculo {
    // Não pode ter atributos
}
```

### 3. Construtores Necessários

**Quando**: inicialização comum para subclasses.

```java
// ✅ Construtor para inicialização comum
public abstract class Animal {
    protected String nome;
    protected int idade;
    
    public Animal(String nome, int idade) {
        if (nome == null || nome.isEmpty()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        this.nome = nome;
        this.idade = idade;
    }
    
    public abstract void som();
}

public class Cachorro extends Animal {
    public Cachorro(String nome, int idade) {
        super(nome, idade); // Reutiliza inicialização
    }
    
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

### 4. Hierarquia "é-um"

**Quando**: relação **é-um** entre classes.

```java
// ✅ Cachorro "é-um" Animal
public abstract class Animal {
    public abstract void som();
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}

// ❌ Interface para capacidade, não hierarquia
public interface Voador {
    void voar();
}
```

### 5. Template Method Pattern

**Quando**: estrutura fixa com passos variáveis.

```java
// ✅ Template Method
public abstract class Processador {
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

### 6. Modificadores de Acesso Variados

**Quando**: métodos `protected` ou default necessários.

```java
// ✅ Métodos protected para subclasses
public abstract class RepositorioBase<T> {
    protected List<T> itens = new ArrayList<>();
    
    protected void validar(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item inválido");
    }
    }
    
    public abstract void salvar(T item);
}

// ❌ Interface: todos os métodos são public
```

### 7. Métodos final (Não Sobrescrevíveis)

**Quando**: comportamento fixo que subclasses não devem alterar.

```java
// ✅ Método final em classe abstrata
public abstract class Animal {
    public final void dormir() {
        System.out.println("Dormindo...");
    }
    
    public abstract void som();
}

// ❌ Interface não pode ter métodos final
```

### 8. Implementação Parcial

**Quando**: parte do comportamento é comum, parte é específico.

```java
// ✅ Implementação parcial
public abstract class Relatorio {
    protected String titulo;
    
    public final void gerar() {
        inicializar();
        carregarDados();
        processar();
        salvar();
    }
    
    private void inicializar() {
        System.out.println("Inicializando: " + titulo);
    }
    
    protected abstract void carregarDados();
    protected abstract void processar();
    
    private void salvar() {
        System.out.println("Salvando relatório");
    }
}
```

### 9. Evolução de API

**Quando**: adicionar métodos sem quebrar subclasses existentes.

```java
// ✅ Adicionar método concreto
public abstract class Animal {
    public abstract void som();
    
    // Novo método sem quebrar subclasses existentes
    public void dormir() {
        System.out.println("Dormindo");
    }
}

// ❌ Interface: adicionar método quebra implementações (antes Java 8)
```

### 10. Código Não Relacionado a Interface

**Quando**: lógica interna não faz parte do contrato.

```java
// ✅ Lógica interna privada
public abstract class Conta {
    protected double saldo;
    
    public void sacar(double valor) {
        validarValor(valor);
        validarSaldo(valor);
        saldo -= valor;
    }
    
    private void validarValor(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
    }
    
    private void validarSaldo(double valor) {
        if (saldo < valor) {
            throw new IllegalStateException("Saldo insuficiente");
        }
    }
}
```

---

## Aplicabilidade

**Use classe abstrata quando**:
- ✅ Classes relacionadas compartilham **código**
- ✅ **Estado comum** (atributos) necessário
- ✅ **Construtores** para inicialização comum
- ✅ **Hierarquia** "é-um"
- ✅ **Template Method** Pattern
- ✅ **Modificadores** protected/private importantes
- ✅ **Métodos final** necessários
- ✅ **Implementação parcial**

**Não use classe abstrata quando**:
- ❌ Apenas **contrato** sem implementação → use interface
- ❌ **Herança múltipla** necessária → use interfaces
- ❌ **Capacidade** para classes não relacionadas → use interface
- ❌ Nenhum **código compartilhado** → use interface

---

## Armadilhas

### 1. Usar Para Herança Múltipla

```java
// ❌ Erro: herança múltipla de classes
public class Pato extends Animal, Voador {
}

// ✅ Correto: classe + interfaces
public class Pato extends Animal implements Voador, Nadador {
}
```

### 2. Classe Abstrata Sem Código Compartilhado

```java
// ❌ Desnecessário: apenas métodos abstratos
public abstract class Calculavel {
    public abstract double calcular();
}

// ✅ Melhor: use interface
public interface Calculavel {
    double calcular();
}
```

### 3. Hierarquia Muito Profunda

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

### 4. Classe Abstrata Como Bag of Methods

```java
// ❌ Anti-padrão: métodos não relacionados
public abstract class Util {
    public abstract void metodo1();
    public abstract void metodo2();
    public abstract void metodo3();
}

// ✅ Melhor: classes/interfaces coesas
public interface Processador {
    void processar();
}
```

### 5. Forçar Herança Quando Composição é Melhor

```java
// ❌ Herança forçada
public abstract class Logger {
    public abstract void log(String mensagem);
}

public class MinhaClasse extends Logger {
    @Override
    public void log(String mensagem) {
        System.out.println(mensagem);
    }
}

// ✅ Melhor: composição
public class MinhaClasse {
    private Logger logger;
    
    public MinhaClasse(Logger logger) {
        this.logger = logger;
    }
}
```

### 6. Classe Abstrata Sem Subclasses

```java
// ⚠️ Classe abstrata sem subclasses (code smell)
public abstract class UnicaClasse {
    public abstract void metodo();
}

// Sem subclasses: desnecessário ser abstrata
```

---

## Boas Práticas

### 1. Use Para Código Compartilhado

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

public class ProdutoRepositorio extends RepositorioBase<Produto> {
    @Override
    protected void validar(Produto produto) {
        if (produto.getPreco() < 0) {
            throw new IllegalArgumentException("Preço inválido");
        }
    }
}
```

### 2. Template Method Para Processos Fixos

```java
public abstract class ImportadorArquivo {
    public final void importar(String caminho) {
        validarArquivo(caminho);
        abrirArquivo(caminho);
        lerDados();
        processar();
        fecharArquivo();
    }
    
    private void validarArquivo(String caminho) {
        if (caminho == null || caminho.isEmpty()) {
            throw new IllegalArgumentException("Caminho inválido");
        }
    }
    
    protected abstract void abrirArquivo(String caminho);
    protected abstract void lerDados();
    protected abstract void processar();
    protected abstract void fecharArquivo();
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

### 4. protected Para Métodos Auxiliares

```java
public abstract class Processador {
    protected void log(String mensagem) {
        System.out.println("[LOG] " + mensagem);
    }
    
    protected void validar(Object obj) {
        if (obj == null) {
            throw new IllegalArgumentException("Objeto inválido");
        }
    }
    
    public abstract void processar();
}
```

### 5. Combine Com Interfaces

```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public abstract void som();
}

public interface Voador {
    void voar();
}

public class Passaro extends Animal implements Voador {
    public Passaro(String nome) {
        super(nome);
    }
    
    @Override
    public void som() {
        System.out.println("Piu piu");
    }
    
    @Override
    public void voar() {
        System.out.println(nome + " voando");
    }
}
```

### 6. Documente Propósito

```java
/**
 * Classe base abstrata para todos os funcionários.
 * Fornece comportamento comum para cálculo de salário e benefícios.
 * 
 * Subclasses devem implementar:
 * - calcularSalario(): lógica específica de cálculo
 */
public abstract class Funcionario {
    protected String nome;
    protected double salarioBase;
    
    public abstract double calcularSalario();
    
    public double calcularBeneficios() {
        return calcularSalario() * 0.3;
    }
}
```

### 7. Evite Hierarquias Complexas

```java
// ✅ Hierarquia simples
Animal
  ├─ Cachorro
  ├─ Gato
  └─ Passaro

// ❌ Hierarquia profunda (evitar)
Animal
  └─ Vertebrado
      └─ Mamifero
          └─ Carnivoro
              └─ Canideo
                  └─ Cachorro
```

### 8. Prefira Composição Quando Apropriado

```java
// ❌ Herança para comportamento não relacionado
public class MinhaClasse extends Logger {
}

// ✅ Composição
public class MinhaClasse {
    private Logger logger;
    
    public MinhaClasse(Logger logger) {
        this.logger = logger;
    }
    
    public void processar() {
        logger.log("Processando");
    }
}
```

### 9. Factory Method Pattern

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

**Use classe abstrata quando**:
```java
// ✅ Código compartilhado
public abstract class Funcionario {
    protected String nome;
    
    public abstract double calcularSalario();
    
    public void exibir() {
        System.out.println(nome + ": " + calcularSalario());
    }
}

// ✅ Template Method
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

// ✅ Estado comum
public abstract class Veiculo {
    protected String marca;
    protected int ano;
    
    public abstract void acelerar();
}
```

**Não use quando**:
```java
// ❌ Apenas contrato → use interface
public interface Calculavel {
    double calcular();
}

// ❌ Herança múltipla → use interfaces
public class Pato extends Animal implements Voador, Nadador {
}
```

**Critérios**:
- ✅ Compartilhar **código**
- ✅ **Estado** comum (atributos)
- ✅ **Construtores** necessários
- ✅ **Hierarquia** "é-um"
- ✅ **Template Method**
- ✅ **protected/private** necessários
- ✅ **Métodos final**
- ❌ Contrato simples (use interface)
- ❌ Herança múltipla (use interfaces)

**Padrões comuns**:
- Template Method
- Factory Method
- Repositório Base
- Strategy (abstrato)

**Alternativas**:
- **Interface**: contrato sem implementação
- **Composição**: delegar comportamento
- **Classe concreta**: instanciação direta

**Regra de Ouro**: Use **classe abstrata** para **compartilhar código** e **estado** entre classes relacionadas. Use **interface** para **contratos** simples. **Combine** ambos para máxima flexibilidade. Prefira **composição** quando herança não é relação "é-um".
