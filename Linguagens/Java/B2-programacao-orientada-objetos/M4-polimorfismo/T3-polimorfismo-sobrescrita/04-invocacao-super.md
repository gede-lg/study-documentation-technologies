# T3.04 - Invocação do Método da Superclasse com super

## Introdução

**super**: palavra-chave para acessar **membros da superclasse** (métodos, construtores, campos).

```java
public class Animal {
    protected String especie;
    
    public void som() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        super.som(); // Chama Animal.som()
        System.out.println("Au au");
    }
}
```

**Usos principais**:
- **super.metodo()**: chamar método sobrescrito da superclasse
- **super()**: chamar construtor da superclasse
- **super.campo**: acessar campo da superclasse

**Objetivo**: **reutilizar** código da superclasse, **estender** comportamento.

---

## Fundamentos

### 1. Chamar Método Sobrescrito

**super.metodo()** chama versão da **superclasse**.

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
        return super.calcularSalario() + bonus; // Reutiliza
    }
}
```

### 2. Estender Comportamento

**super** permite **adicionar** comportamento sem **duplicar** código.

```java
public class Forma {
    protected int x, y;
    
    public void desenhar() {
        System.out.println("Desenhando forma em (" + x + ", " + y + ")");
    }
}

public class Circulo extends Forma {
    private double raio;
    
    @Override
    public void desenhar() {
        super.desenhar(); // Desenha forma base
        System.out.println("Raio: " + raio);
    }
}
```

### 3. Chamar Construtor da Superclasse

**super()** chama construtor da **superclasse**.

```java
public class Animal {
    protected String especie;
    
    public Animal(String especie) {
        this.especie = especie;
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    public Cachorro(String especie, String raca) {
        super(especie); // Chama Animal(String)
        this.raca = raca;
    }
}
```

### 4. super() Deve Ser Primeira Instrução

**super()** deve ser **primeira instrução** no construtor.

```java
public class Cachorro extends Animal {
    private String raca;
    
    public Cachorro(String especie, String raca) {
        super(especie); // ✅ Primeira instrução
        this.raca = raca;
    }
    
    // ❌ Erro: super() não é primeira instrução
    // public Cachorro(String especie, String raca) {
    //     this.raca = raca;
    //     super(especie); // Erro!
    // }
}
```

### 5. Construtor Padrão Implícito

Se **não** chamar super() ou this(), compilador adiciona **super()** implicitamente.

```java
public class Animal {
    public Animal() { } // Construtor padrão
}

public class Cachorro extends Animal {
    public Cachorro() {
        // super(); - Adicionado implicitamente
    }
}
```

### 6. Erro se Superclasse Não Tem Construtor Padrão

```java
public class Animal {
    public Animal(String especie) { } // Sem construtor padrão
}

public class Cachorro extends Animal {
    public Cachorro() {
        // ❌ Erro: super() não existe
    }
}

// ✅ Solução: chamar super(String)
public class Gato extends Animal {
    public Gato() {
        super("Felino"); // OK
    }
}
```

### 7. Acessar Campo da Superclasse

**super.campo** acessa campo da **superclasse** quando **nome igual** na subclasse.

```java
public class Animal {
    protected String nome = "Animal";
}

public class Cachorro extends Animal {
    private String nome = "Cachorro";
    
    public void imprimirNomes() {
        System.out.println(super.nome); // "Animal"
        System.out.println(this.nome);  // "Cachorro"
        System.out.println(nome);       // "Cachorro"
    }
}
```

### 8. super em Métodos static

**super** **não** funciona em métodos **static**.

```java
public class Animal {
    public static void info() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    public static void info() {
        // ❌ Erro: super em método static
        // super.info();
        
        // ✅ Solução: chamar diretamente
        Animal.info();
    }
}
```

### 9. super em Cadeia de Herança

**super** acessa **superclasse imediata**.

```java
public class Animal {
    public void som() {
        System.out.println("Som Animal");
    }
}

public class Mamifero extends Animal {
    @Override
    public void som() {
        System.out.println("Som Mamífero");
    }
}

public class Cachorro extends Mamifero {
    @Override
    public void som() {
        super.som(); // Chama Mamifero.som()
        System.out.println("Au au");
    }
}

// Saída:
// Som Mamífero
// Au au
```

### 10. super com Métodos Abstratos

**super** **não** funciona com métodos **abstratos** da superclasse.

```java
public abstract class Animal {
    public abstract void som(); // Abstrato
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        // ❌ Erro: super.som() é abstrato
        // super.som();
        
        System.out.println("Au au");
    }
}
```

---

## Aplicabilidade

**Use super quando**:
- **Reutilizar** código da superclasse
- **Estender** comportamento (não substituir completamente)
- **Chamar** construtor da superclasse
- **Acessar** campo com nome igual
- **Template Method Pattern**

**Evite super quando**:
- **Substituir completamente** comportamento
- Método abstrato (não tem implementação)
- Método static (use NomeDaClasse.metodo())

---

## Armadilhas

### 1. Esquecer super() no Construtor

```java
public class Animal {
    public Animal(String especie) { } // Sem construtor padrão
}

public class Cachorro extends Animal {
    public Cachorro() {
        // ❌ Erro: super() não existe
    }
}

// ✅ Solução
public class Gato extends Animal {
    public Gato() {
        super("Felino"); // OK
    }
}
```

### 2. super() Não É Primeira Instrução

```java
public class Cachorro extends Animal {
    public Cachorro(String especie, String raca) {
        this.raca = raca; // ❌ Erro: super() deve ser primeira
        super(especie);
    }
}
```

### 3. super em Método static

```java
public class Cachorro extends Animal {
    public static void metodo() {
        // ❌ Erro: super em static
        // super.som();
    }
}
```

### 4. super com Método Abstrato

```java
public abstract class Animal {
    public abstract void som();
}

public class Cachorro extends Animal {
    @Override
    public void som() {
        // ❌ Erro: super.som() é abstrato
        // super.som();
    }
}
```

### 5. super vs this

```java
public class Animal {
    protected String nome = "Animal";
}

public class Cachorro extends Animal {
    private String nome = "Cachorro";
    
    public void teste() {
        System.out.println(super.nome); // "Animal"
        System.out.println(this.nome);  // "Cachorro"
    }
}
```

### 6. Chamar super() e this() Juntos

```java
public class Cachorro extends Animal {
    // ❌ Erro: apenas um pode ser primeira instrução
    public Cachorro(String especie, String raca) {
        super(especie); // Primeira instrução
        this(raca);     // ❌ Erro: não pode ter dois
    }
}

// ✅ Solução: delegação
public class Gato extends Animal {
    public Gato(String especie, String raca) {
        this(especie, raca, 0); // Delega para outro construtor
    }
    
    public Gato(String especie, String raca, int idade) {
        super(especie);
        this.raca = raca;
        this.idade = idade;
    }
}
```

### 7. super em Classe Sem Superclasse

```java
public class MinhaClasse { // Sem extends
    public void metodo() {
        // ⚠️ super.toString() chama Object.toString()
        super.toString(); // OK: toda classe herda de Object
    }
}
```

---

## Boas Práticas

### 1. Reutilize Código com super

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
        return super.calcularSalario() + bonus; // Reutiliza
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
    protected void inicializar() {
        super.inicializar(); // Reutiliza
        System.out.println("Configurando vendas");
    }
    
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

### 3. Construtor com Validação

```java
public class Animal {
    protected String especie;
    
    public Animal(String especie) {
        if (especie == null || especie.isEmpty()) {
            throw new IllegalArgumentException("Espécie inválida");
        }
        this.especie = especie;
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    public Cachorro(String especie, String raca) {
        super(especie); // Validação da superclasse
        if (raca == null || raca.isEmpty()) {
            throw new IllegalArgumentException("Raça inválida");
        }
        this.raca = raca;
    }
}
```

### 4. Delegação de Construtores

```java
public class Pessoa {
    private String nome;
    private int idade;
    private String cidade;
    
    public Pessoa(String nome) {
        this(nome, 0, "Desconhecida");
    }
    
    public Pessoa(String nome, int idade) {
        this(nome, idade, "Desconhecida");
    }
    
    public Pessoa(String nome, int idade, String cidade) {
        this.nome = nome;
        this.idade = idade;
        this.cidade = cidade;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    public Funcionario(String nome) {
        super(nome);
    }
    
    public Funcionario(String nome, int idade) {
        super(nome, idade);
    }
    
    public Funcionario(String nome, int idade, String cidade, double salario) {
        super(nome, idade, cidade);
        this.salario = salario;
    }
}
```

### 5. Equals com super

```java
public class Pessoa {
    protected String nome;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Pessoa pessoa = (Pessoa) obj;
        return Objects.equals(nome, pessoa.nome);
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    @Override
    public boolean equals(Object obj) {
        if (!super.equals(obj)) return false; // Reutiliza
        
        Funcionario func = (Funcionario) obj;
        return Double.compare(func.salario, salario) == 0;
    }
}
```

### 6. ToString com super

```java
public class Animal {
    protected String especie;
    
    @Override
    public String toString() {
        return "Animal[especie=" + especie + "]";
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    @Override
    public String toString() {
        return "Cachorro[" + super.toString() + ", raca=" + raca + "]";
    }
}
```

### 7. Clone com super

```java
public class Pessoa implements Cloneable {
    protected String nome;
    protected int idade;
    
    @Override
    public Pessoa clone() {
        try {
            return (Pessoa) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    @Override
    public Funcionario clone() {
        return (Funcionario) super.clone(); // Reutiliza
    }
}
```

### 8. Finalize (Depreciado) com super

```java
public class Recurso {
    @Override
    protected void finalize() throws Throwable {
        try {
            // Liberar recursos da subclasse
        } finally {
            super.finalize(); // Sempre chama super
        }
    }
}

// ✅ Prefira: AutoCloseable
public class Recurso implements AutoCloseable {
    @Override
    public void close() {
        // Liberar recursos
    }
}
```

### 9. super com Sobrecarga

```java
public class Animal {
    public void mover() {
        System.out.println("Movendo");
    }
    
    public void mover(int distancia) {
        System.out.println("Movendo " + distancia + " metros");
    }
}

public class Cachorro extends Animal {
    @Override
    public void mover() {
        super.mover(); // Chama Animal.mover()
        System.out.println("Correndo");
    }
    
    @Override
    public void mover(int distancia) {
        super.mover(distancia); // Chama Animal.mover(int)
        System.out.println("Correndo");
    }
}
```

### 10. Evite Lógica Complexa em Construtores

```java
// ❌ Evite
public class Animal {
    protected List<String> caracteristicas;
    
    public Animal() {
        caracteristicas = new ArrayList<>();
        inicializar(); // Chama método polimórfico
    }
    
    protected void inicializar() {
        caracteristicas.add("Respirar");
    }
}

public class Cachorro extends Animal {
    private String raca = "Labrador";
    
    @Override
    protected void inicializar() {
        super.inicializar();
        caracteristicas.add("Latir - " + raca); // raca = null!
    }
}

// ✅ Prefira: Factory Method
public class Animal {
    protected List<String> caracteristicas;
    
    private Animal() {
        caracteristicas = new ArrayList<>();
    }
    
    public static Animal criar() {
        Animal a = new Animal();
        a.inicializar();
        return a;
    }
    
    protected void inicializar() {
        caracteristicas.add("Respirar");
    }
}
```

---

## Resumo

**super**: acessa **membros da superclasse**.

```java
super.metodo();   // Chama método da superclasse
super();          // Chama construtor da superclasse
super.campo;      // Acessa campo da superclasse
```

**Reutilizar código**:
```java
@Override
public double calcularSalario() {
    return super.calcularSalario() + bonus;
}
```

**Construtor**:
```java
public Cachorro(String especie, String raca) {
    super(especie); // ✅ Primeira instrução
    this.raca = raca;
}
```

**Regras**:
- **super()** deve ser **primeira instrução**
- Compilador adiciona **super()** implicitamente se não chamar super() ou this()
- **Erro** se superclasse não tem construtor padrão
- **super** não funciona em métodos **static**
- **super** acessa **superclasse imediata**

**Campo com nome igual**:
```java
System.out.println(super.nome); // Superclasse
System.out.println(this.nome);  // Subclasse
```

**Restrições**:
- Não funciona com métodos **abstratos**
- Não funciona em métodos **static**
- **super()** e **this()** não podem estar no mesmo construtor

**Template Method Pattern**:
```java
@Override
protected void inicializar() {
    super.inicializar(); // Reutiliza
    System.out.println("Configurando subclasse");
}
```

**Quando usar**:
- Reutilizar código da superclasse
- Estender comportamento (não substituir)
- Chamar construtor da superclasse
- Acessar campo com nome igual

**Regra de Ouro**: Use **super** para **reutilizar** código da superclasse. **super()** deve ser **primeira instrução** no construtor. **super** acessa **superclasse imediata**. Não funciona com métodos **abstratos** ou **static**.
