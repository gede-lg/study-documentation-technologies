# T3.05 - super() Deve Ser Primeira Instrução no Construtor

## Introdução

**`super()` DEVE ser a primeira instrução** do construtor da subclasse.

**Razão**: Superclasse **deve estar inicializada** antes de subclasse acessar seus membros.

```java
public class Pessoa {
    protected String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

public class Funcionario extends Pessoa {
    private double salario;
    
    // ✅ CORRETO: super() é primeira linha
    public Funcionario(String nome, double salario) {
        super(nome);        // ← Primeira instrução
        this.salario = salario;
    }
    
    // ❌ ERRO: super() não é primeira linha
    /*
    public Funcionario(String nome, double salario) {
        this.salario = salario; // ERRO: antes de super()
        super(nome);
    }
    */
}
```

---

## Fundamentos

### 1. Regra da Primeira Linha

**`super()` ou `this()` deve ser primeira instrução** executável.

```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    // ✅ CORRETO
    public Cachorro(String nome, String raca) {
        super(nome);      // Primeira linha
        this.raca = raca;
    }
    
    // ❌ ERRO: código antes de super()
    /*
    public Cachorro(String nome, String raca) {
        System.out.println("Antes"); // ERRO
        super(nome);
        this.raca = raca;
    }
    */
}
```

### 2. Por Que Primeira Linha?

**Superclasse deve estar pronta** antes de subclasse usar seus membros.

```java
public class Veiculo {
    protected String marca;
    
    public Veiculo(String marca) {
        this.marca = marca;
    }
}

public class Carro extends Veiculo {
    private int portas;
    
    public Carro(String marca, int portas) {
        // ❌ ERRO: usa 'marca' antes de super()
        /*
        if (marca == null) {
            marca = "Genérico"; // ERRO: marca não existe ainda
        }
        super(marca);
        */
        
        // ✅ CORRETO: super() primeiro
        super(marca != null ? marca : "Genérico");
        this.portas = portas;
    }
}
```

### 3. Apenas Declarações Antes de super()

**Apenas declarações** (não inicializações) podem vir antes.

```java
public class Funcionario extends Pessoa {
    private double salario;
    
    public Funcionario(String nome, double salario) {
        // ✅ Declaração (sem execução)
        String nomeProcessado;
        
        // ✅ super() primeiro
        super(nome);
        
        // ✅ Inicialização depois
        nomeProcessado = nome.toUpperCase();
        this.salario = salario;
    }
}
```

### 4. Expressões em super() São Permitidas

**Parâmetros de `super()` podem ser expressões complexas**.

```java
public class Pessoa {
    protected String nome;
    protected int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

public class Funcionario extends Pessoa {
    public Funcionario(String primeiroNome, String sobrenome, int idade) {
        // ✅ Expressões nos parâmetros
        super(
            primeiroNome + " " + sobrenome,
            idade > 0 ? idade : 18
        );
    }
}
```

### 5. Chamadas de Métodos Antes de super()

**NÃO pode chamar métodos de instância** antes de `super()`.

```java
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    // ❌ ERRO: chama método antes de super()
    /*
    public Cachorro(String nome, String raca) {
        this.raca = processar(raca); // ERRO
        super(nome);
    }
    */
    
    // ✅ CORRETO: super() primeiro
    public Cachorro(String nome, String raca) {
        super(nome);
        this.raca = processar(raca);
    }
    
    private String processar(String raca) {
        return raca.toUpperCase();
    }
}
```

**Exceção**: Métodos **estáticos** podem ser chamados.

```java
public Cachorro(String nome, String raca) {
    super(nome);
    this.raca = processarEstatico(raca); // ✅ Método estático
}

private static String processarEstatico(String raca) {
    return raca.toUpperCase();
}
```

### 6. this() Também Deve Ser Primeira Linha

**`this()` segue mesma regra** que `super()`.

```java
public class Funcionario extends Pessoa {
    private double salario;
    
    // Construtor 1
    public Funcionario(String nome) {
        this(nome, 0.0); // ← Primeira linha
    }
    
    // Construtor 2
    public Funcionario(String nome, double salario) {
        super(nome);     // ← Primeira linha
        this.salario = salario;
    }
}
```

### 7. Apenas super() OU this()

**Não pode usar ambos** no mesmo construtor.

```java
public class Funcionario extends Pessoa {
    private double salario;
    
    // ❌ ERRO: super() E this()
    /*
    public Funcionario(String nome, double salario) {
        super(nome);
        this();  // ERRO: já usou super()
    }
    */
    
    // ✅ CORRETO: apenas um
    public Funcionario(String nome, double salario) {
        super(nome);
        this.salario = salario;
    }
}
```

### 8. super() Implícito

**Se não especificar `super()` ou `this()`**, compilador insere `super()` implícito.

```java
public class Animal {
    public Animal() {
        System.out.println("Construtor de Animal");
    }
}

public class Cachorro extends Animal {
    // Equivalente a:
    public Cachorro() {
        // super(); ← Implícito
        System.out.println("Construtor de Cachorro");
    }
}
```

### 9. Inicialização de Atributos Antes de super()

**Atributos de instância** não podem ser inicializados antes de `super()`.

```java
public class Cachorro extends Animal {
    private String raca;
    
    // ❌ ERRO: inicializa atributo antes de super()
    /*
    public Cachorro(String nome, String raca) {
        this.raca = raca; // ERRO
        super(nome);
    }
    */
    
    // ✅ CORRETO: super() primeiro
    public Cachorro(String nome, String raca) {
        super(nome);
        this.raca = raca;
    }
}
```

### 10. Blocos de Inicialização e Construtores

**Blocos de inicialização executam ANTES** do código do construtor (após `super()`).

```java
public class Animal {
    public Animal() {
        System.out.println("1. Construtor de Animal");
    }
}

public class Cachorro extends Animal {
    // Bloco de inicialização
    {
        System.out.println("2. Bloco de inicialização de Cachorro");
    }
    
    public Cachorro() {
        super(); // Implícito (ou explícito)
        System.out.println("3. Construtor de Cachorro");
    }
}

// Uso
Cachorro c = new Cachorro();
// Saída:
// 1. Construtor de Animal
// 2. Bloco de inicialização de Cachorro
// 3. Construtor de Cachorro
```

**Ordem**: `super()` → Blocos de inicialização → Restante do construtor.

---

## Aplicabilidade

**Regra absoluta**: **`super()` ou `this()` DEVE ser primeira instrução** executável.

**Permitido antes**:
- Comentários
- Declarações de variáveis locais (sem inicialização)

**NÃO permitido antes**:
- Inicialização de variáveis locais
- Atribuições a atributos
- Chamadas de métodos de instância
- Qualquer código executável

---

## Armadilhas

### 1. Código Antes de super()

```java
public Cachorro(String nome) {
    // ❌ ERRO: código executável antes de super()
    // System.out.println("Antes");
    // super(nome);
    
    // ✅ CORRETO
    super(nome);
    System.out.println("Depois");
}
```

### 2. Inicializar Atributo Antes de super()

```java
public Cachorro(String nome, String raca) {
    // ❌ ERRO
    // this.raca = raca;
    // super(nome);
    
    // ✅ CORRETO
    super(nome);
    this.raca = raca;
}
```

### 3. Chamar Método de Instância Antes de super()

```java
public Cachorro(String nome, String raca) {
    // ❌ ERRO
    // this.raca = processar(raca);
    // super(nome);
    
    // ✅ CORRETO
    super(nome);
    this.raca = processar(raca);
}
```

---

## Boas Práticas

### 1. super() Sempre na Primeira Linha

```java
public Subclasse(String param) {
    super(param); // Primeira linha
    // Restante do código
}
```

### 2. Use Expressões em super() Para Lógica Prévia

```java
public Cachorro(String nome, String raca) {
    super(nome != null ? nome : "Sem nome"); // Lógica nos parâmetros
    this.raca = raca;
}
```

### 3. Métodos Estáticos Para Processamento

```java
public Cachorro(String nome, String raca) {
    super(processarNome(nome)); // Método estático OK
    this.raca = raca;
}

private static String processarNome(String nome) {
    return nome.toUpperCase();
}
```

### 4. Documente Lógica Complexa

```java
public Funcionario(String nome, double salario) {
    // Valida salário antes de passar para super()
    super(nome, salario > 0 ? salario : 0.0);
}
```

---

## Resumo

**super() deve ser primeira instrução**:

**Regra**:
```java
public Subclasse(String param) {
    super(param); // ← PRIMEIRA INSTRUÇÃO
    // Código adicional
}
```

**Por quê?**: Superclasse **deve estar inicializada** antes de subclasse usar seus membros.

**Permitido antes**:
```java
public Cachorro(String nome) {
    // Comentários OK
    String temp; // Declaração OK
    
    super(nome); // Primeira instrução executável
}
```

**NÃO permitido antes**:
```java
public Cachorro(String nome, String raca) {
    // ❌ this.raca = raca;        // Inicialização
    // ❌ System.out.println(...);  // Código executável
    // ❌ processar(raca);          // Chamada de método
    
    super(nome);
}
```

**Expressões em super()**:
```java
super(nome != null ? nome : "Padrão");
super(processar(valor)); // Método estático OK
super(a + b);            // Expressões OK
```

**super() ou this()** (não ambos):
```java
super(param); // Chama construtor da superclasse
// OU
this(param);  // Chama construtor da mesma classe
```

**Implícito**:
```java
public Cachorro() {
    // super(); ← Implícito se não especificado
}
```

**Ordem de execução**:
```
1. super() (construtor da superclasse)
2. Blocos de inicialização {}
3. Restante do construtor
```

**Regra de Ouro**: **`super()` ou `this()` SEMPRE primeira instrução** executável. Use **expressões nos parâmetros** para lógica que precisa executar antes, e **métodos estáticos** para processamento complexo.
