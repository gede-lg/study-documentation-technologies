# T7.07 - Construtores em Classes Abstratas

## Introdução

**Construtores em classes abstratas**: permitidos e úteis para **inicializar estado comum**.

**Características**:
- Não podem ser chamados diretamente (classe abstrata não é instanciável)
- Chamados via `super()` em subclasses
- Podem ter qualquer modificador: `public`, `protected`, `private`
- Podem receber parâmetros
- Podem ter múltiplas sobrecargas

**Propósito**:
- Inicializar **atributos** da classe abstrata
- Garantir **validação** comum
- Forçar **inicialização** obrigatória

```java
public abstract class Animal {
    protected String nome;
    protected int idade;
    
    // Construtor em classe abstrata
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
        super(nome, idade); // Chama construtor da classe abstrata
    }
    
    @Override
    public void som() {
        System.out.println("Au au");
    }
}

// Uso
Animal c = new Cachorro("Rex", 3);
```

---

## Fundamentos

### 1. Construtores São Permitidos

```java
public abstract class Animal {
    protected String nome;
    
    // ✅ Construtor permitido
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public abstract void som();
}
```

### 2. Não Podem Ser Chamados Diretamente

```java
public abstract class Animal {
    public Animal(String nome) {
        this.nome = nome;
    }
}

// ❌ Erro: não pode instanciar classe abstrata
Animal a = new Animal("Rex");

// ✅ Correto: chamado via super() em subclasse
```

### 3. Chamados via super()

```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome); // Chama construtor da superclasse
    }
}
```

### 4. Construtores Com Parâmetros

```java
public abstract class Funcionario {
    protected String nome;
    protected double salarioBase;
    
    public Funcionario(String nome, double salarioBase) {
        this.nome = nome;
        this.salarioBase = salarioBase;
    }
    
    public abstract double calcularSalario();
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

### 5. Construtores Sobrecarregados

```java
public abstract class Animal {
    protected String nome;
    protected int idade;
    
    public Animal(String nome) {
        this(nome, 0); // Chama outro construtor
    }
    
    public Animal(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    public abstract void som();
}

public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome); // Chama Animal(String)
    }
    
    public Cachorro(String nome, int idade) {
        super(nome, idade); // Chama Animal(String, int)
    }
}
```

### 6. Modificadores de Acesso

```java
// public: qualquer subclasse
public abstract class Animal {
    public Animal(String nome) {
        this.nome = nome;
    }
}

// protected: apenas subclasses
public abstract class Animal {
    protected Animal(String nome) {
        this.nome = nome;
    }
}

// private: forçar uso de outro construtor
public abstract class Animal {
    private Animal(String nome) {
        this.nome = nome;
    }
    
    protected Animal() {
        this("Desconhecido"); // Chama construtor privado
    }
}
```

### 7. Validação no Construtor

```java
public abstract class Forma {
    protected String cor;
    protected boolean preenchida;
    
    public Forma(String cor, boolean preenchida) {
        if (cor == null || cor.isEmpty()) {
            throw new IllegalArgumentException("Cor inválida");
        }
        this.cor = cor;
        this.preenchida = preenchida;
    }
    
    public abstract double calcularArea();
}
```

### 8. Construtor Padrão Implícito

```java
// ✅ Construtor padrão implícito
public abstract class Animal {
    // Construtor padrão gerado automaticamente
}

// ❌ Erro: faltando super() se superclasse não tem padrão
public abstract class Mamifero extends Animal {
    protected String tipo;
    
    public Mamifero(String tipo) {
        // ❌ Erro se Animal não tem construtor padrão
        this.tipo = tipo;
    }
}

// ✅ Correto: chama super() explicitamente
public Mamifero(String tipo) {
    super(); // Ou super(nome) se Animal(String) existir
    this.tipo = tipo;
}
```

### 9. Inicialização de Constantes

```java
public abstract class Configuracao {
    protected final String nome;
    protected final String versao;
    
    public Configuracao(String nome, String versao) {
        this.nome = nome;
        this.versao = versao;
    }
}

public class ConfiguracaoDB extends Configuracao {
    public ConfiguracaoDB() {
        super("BancoDados", "1.0");
    }
}
```

### 10. Construtor Com Lógica Complexa

```java
public abstract class RepositorioBase<T> {
    protected List<T> itens;
    protected String nome;
    
    public RepositorioBase(String nome) {
        this.nome = nome;
        this.itens = new ArrayList<>();
        inicializar();
    }
    
    private void inicializar() {
        System.out.println("Inicializando repositório: " + nome);
    }
    
    public abstract void salvar(T item);
}
```

---

## Aplicabilidade

**Use construtores quando**:
- **Inicializar atributos** comuns
- **Validar** estado inicial
- **Garantir** inicialização obrigatória
- **Simplificar** construtores de subclasses
- **Constantes** (final) precisam ser inicializadas

**Exemplos**:
```java
public abstract class Conta {
    protected final String numero;
    protected double saldo;
    
    public Conta(String numero, double saldoInicial) {
        if (numero == null || numero.isEmpty()) {
            throw new IllegalArgumentException("Número inválido");
        }
        if (saldoInicial < 0) {
            throw new IllegalArgumentException("Saldo inicial negativo");
        }
        this.numero = numero;
        this.saldo = saldoInicial;
    }
    
    public abstract void calcularRendimento();
}

public class ContaPoupanca extends Conta {
    public ContaPoupanca(String numero, double saldoInicial) {
        super(numero, saldoInicial);
    }
    
    @Override
    public void calcularRendimento() {
        saldo += saldo * 0.005;
    }
}
```

---

## Armadilhas

### 1. Esquecer super() em Subclasse

```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
}

// ❌ Erro: faltando super(nome)
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        // Compilador insere super() que não existe
    }
}

// ✅ Correto
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
}
```

### 2. Construtor Padrão Inexistente

```java
public abstract class Animal {
    protected String nome;
    
    // Não tem construtor padrão
    public Animal(String nome) {
        this.nome = nome;
    }
}

// ❌ Erro: Animal não tem construtor padrão
public class Cachorro extends Animal {
    public Cachorro() {
        // super() implícito falha
    }
}

// ✅ Correto
public class Cachorro extends Animal {
    public Cachorro() {
        super("Desconhecido");
    }
}
```

### 3. Ordem de Inicialização

```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
        exibir(); // ⚠️ Cuidado: métodos sobrescríveis
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

### 4. Construtores private Limitam Subclasses

```java
public abstract class Animal {
    private Animal() { // ❌ Subclasses no mesmo pacote não podem herdar
    }
}

// ✅ Correto: protected para permitir herança
public abstract class Animal {
    protected Animal() {
    }
}
```

### 5. Exceções em Construtores

```java
public abstract class Arquivo {
    protected String caminho;
    
    // ⚠️ Exceção em construtor pode ser problemática
    public Arquivo(String caminho) throws IOException {
        if (!validarCaminho(caminho)) {
            throw new IOException("Caminho inválido");
        }
        this.caminho = caminho;
    }
    
    private boolean validarCaminho(String caminho) {
        return caminho != null && !caminho.isEmpty();
    }
}

// Subclasses devem declarar exceção
public class ArquivoTexto extends Arquivo {
    public ArquivoTexto(String caminho) throws IOException {
        super(caminho);
    }
}
```

---

## Boas Práticas

### 1. Validação no Construtor

```java
public abstract class Funcionario {
    protected String nome;
    protected double salarioBase;
    
    public Funcionario(String nome, double salarioBase) {
        if (nome == null || nome.isEmpty()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        if (salarioBase <= 0) {
            throw new IllegalArgumentException("Salário inválido");
        }
        this.nome = nome;
        this.salarioBase = salarioBase;
    }
    
    public abstract double calcularSalario();
}
```

### 2. Construtores Sobrecarregados

```java
public abstract class Forma {
    protected String cor;
    protected boolean preenchida;
    
    public Forma(String cor) {
        this(cor, false);
    }
    
    public Forma(String cor, boolean preenchida) {
        this.cor = cor;
        this.preenchida = preenchida;
    }
    
    public abstract double calcularArea();
}

public class Circulo extends Forma {
    private double raio;
    
    public Circulo(double raio) {
        super("Vermelho"); // Usa construtor Forma(String)
        this.raio = raio;
    }
    
    public Circulo(String cor, double raio) {
        super(cor, true); // Usa construtor Forma(String, boolean)
        this.raio = raio;
    }
}
```

### 3. Inicialização de Constantes final

```java
public abstract class Configuracao {
    protected final String nome;
    protected final String versao;
    
    public Configuracao(String nome, String versao) {
        this.nome = nome;
        this.versao = versao;
    }
}

public class ConfiguracaoServidor extends Configuracao {
    private final int porta;
    
    public ConfiguracaoServidor(int porta) {
        super("Servidor", "1.0");
        this.porta = porta;
    }
}
```

### 4. Evite Chamar Métodos Sobrescrevíveis

```java
// ❌ Evite chamar métodos sobrescrevíveis no construtor
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
        exibir(); // Método sobrescrito pode usar atributos não inicializados
    }
    
    public void exibir() {
        System.out.println(nome);
    }
}

// ✅ Melhor: apenas inicializar atributos
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public void exibir() {
        System.out.println(nome);
    }
}
```

### 5. protected Para Construtores

```java
// ✅ protected: permite herança, impede instanciação direta
public abstract class Animal {
    protected Animal(String nome) {
        this.nome = nome;
    }
}

// ✅ public: se construtores mais acessíveis são desejados
public abstract class Animal {
    public Animal(String nome) {
        this.nome = nome;
    }
}
```

### 6. Construtor Privado Para Forçar Outro Construtor

```java
public abstract class Configuracao {
    protected String nome;
    protected String versao;
    
    // Construtor privado: lógica comum
    private Configuracao(String nome, String versao) {
        this.nome = nome;
        this.versao = versao;
    }
    
    // Construtor protegido: subclasses usam este
    protected Configuracao(String nome) {
        this(nome, "1.0");
    }
}
```

### 7. Inicialização Complexa

```java
public abstract class RepositorioBase<T> {
    protected List<T> itens;
    protected String nome;
    protected boolean inicializado;
    
    public RepositorioBase(String nome) {
        this.nome = nome;
        this.itens = new ArrayList<>();
        this.inicializado = false;
        inicializar();
    }
    
    private void inicializar() {
        System.out.println("Inicializando: " + nome);
        this.inicializado = true;
    }
    
    public abstract void salvar(T item);
}
```

### 8. Documente Construtores

```java
/**
 * Cria um novo funcionário.
 * @param nome nome do funcionário (não pode ser vazio)
 * @param salarioBase salário base (deve ser positivo)
 * @throws IllegalArgumentException se nome vazio ou salário <= 0
 */
public Funcionario(String nome, double salarioBase) {
    if (nome == null || nome.isEmpty()) {
        throw new IllegalArgumentException("Nome inválido");
    }
    if (salarioBase <= 0) {
        throw new IllegalArgumentException("Salário inválido");
    }
    this.nome = nome;
    this.salarioBase = salarioBase;
}
```

### 9. Builder Pattern Com Classe Abstrata

```java
public abstract class Animal {
    protected String nome;
    protected int idade;
    protected String cor;
    
    protected Animal(Builder<?> builder) {
        this.nome = builder.nome;
        this.idade = builder.idade;
        this.cor = builder.cor;
    }
    
    public abstract static class Builder<T extends Builder<T>> {
        protected String nome;
        protected int idade;
        protected String cor;
        
        public T nome(String nome) {
            this.nome = nome;
            return self();
        }
        
        public T idade(int idade) {
            this.idade = idade;
            return self();
        }
        
        public T cor(String cor) {
            this.cor = cor;
            return self();
        }
        
        protected abstract T self();
        public abstract Animal build();
    }
}
```

---

## Resumo

**Construtor em classe abstrata**:
```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public abstract void som();
}
```

**Chamado via super()**:
```java
public class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }
    
    @Override
    public void som() {
        System.out.println("Au au");
    }
}
```

**Com parâmetros e validação**:
```java
public abstract class Funcionario {
    protected String nome;
    protected double salarioBase;
    
    public Funcionario(String nome, double salarioBase) {
        if (nome == null) {
            throw new IllegalArgumentException("Nome inválido");
        }
        this.nome = nome;
        this.salarioBase = salarioBase;
    }
}
```

**Sobrecarregados**:
```java
public abstract class Forma {
    protected String cor;
    
    public Forma(String cor) {
        this(cor, false);
    }
    
    public Forma(String cor, boolean preenchida) {
        this.cor = cor;
        this.preenchida = preenchida;
    }
}
```

**Inicializar final**:
```java
public abstract class Configuracao {
    protected final String nome;
    
    public Configuracao(String nome) {
        this.nome = nome;
    }
}
```

**Modificadores**:
```java
public Animal() { }      // public
protected Animal() { }   // protected
private Animal() { }     // private (limitado)
```

**Quando usar**:
- ✅ Inicializar atributos comuns
- ✅ Validar estado inicial
- ✅ Forçar inicialização
- ✅ Inicializar constantes final

**Armadilhas**:
- ❌ Esquecer super()
- ❌ Chamar métodos sobrescrevíveis
- ❌ Construtor padrão inexistente
- ⚠️ Ordem de inicialização

**Regra de Ouro**: **Construtores** em classes abstratas inicializam **estado comum**. Subclasses chamam via `super()`. Use para **validação** e **garantir inicialização** obrigatória. **Evite** chamar métodos sobrescrevíveis no construtor.
