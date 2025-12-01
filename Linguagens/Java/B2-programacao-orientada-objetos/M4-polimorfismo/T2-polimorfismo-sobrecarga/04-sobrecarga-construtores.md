# T2.04 - Sobrecarga de Construtores

## Introdução

**Sobrecarga de construtores**: classe pode ter **múltiplos construtores** com diferentes **listas de parâmetros**.

**Permite**:
- **Flexibilidade na inicialização**: usuário escolhe como criar objeto
- **Valores padrão**: construtores com menos parâmetros
- **Diferentes formas de criação**: por parâmetros, cópia, builder

```java
public class Pessoa {
    private String nome;
    private int idade;
    private String email;
    
    // Construtor completo
    public Pessoa(String nome, int idade, String email) {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
    }
    
    // Construtor sem email
    public Pessoa(String nome, int idade) {
        this(nome, idade, "sem-email@exemplo.com");
    }
    
    // Construtor mínimo
    public Pessoa(String nome) {
        this(nome, 0, "sem-email@exemplo.com");
    }
}

// Uso: escolha de construtor
Pessoa p1 = new Pessoa("João", 25, "joao@exemplo.com");
Pessoa p2 = new Pessoa("Maria", 30);
Pessoa p3 = new Pessoa("Pedro");
```

**Benefícios**:
- **API amigável**: usuário não precisa fornecer todos os parâmetros
- **Delegação**: construtores chamam outros com `this()`
- **Validação centralizada**: um construtor principal

---

## Fundamentos

### 1. Múltiplos Construtores

```java
public class Produto {
    private String nome;
    private double preco;
    private String categoria;
    
    // Construtor 1: todos os parâmetros
    public Produto(String nome, double preco, String categoria) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
    }
    
    // Construtor 2: sem categoria
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = "Geral";
    }
    
    // Construtor 3: apenas nome
    public Produto(String nome) {
        this.nome = nome;
        this.preco = 0.0;
        this.categoria = "Geral";
    }
}
```

### 2. Chamada Entre Construtores com this()

**`this()`** chama outro construtor da **mesma classe**.

```java
public class Usuario {
    private String nome;
    private int idade;
    private String email;
    
    // Construtor principal (mais completo)
    public Usuario(String nome, int idade, String email) {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
    }
    
    // Delega para construtor principal
    public Usuario(String nome, int idade) {
        this(nome, idade, "sem-email@exemplo.com");
    }
    
    // Delega para construtor anterior
    public Usuario(String nome) {
        this(nome, 0);
    }
}

// Chamada: Usuario("João")
// → this("João", 0)
// → this("João", 0, "sem-email@exemplo.com")
```

### 3. this() Deve Ser Primeira Instrução

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    // ❌ Erro: this() não é primeira instrução
    public Pessoa(String nome) {
        System.out.println("Criando pessoa");
        this(nome, 0); // Erro de compilação
    }
    
    // ✅ Correto: this() é primeira instrução
    public Pessoa(String nome) {
        this(nome, 0);
        System.out.println("Criando pessoa");
    }
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}
```

### 4. Construtor Padrão (Sem Parâmetros)

```java
public class Livro {
    private String titulo;
    private String autor;
    
    // Construtor padrão
    public Livro() {
        this.titulo = "Sem título";
        this.autor = "Anônimo";
    }
    
    // Construtor com parâmetros
    public Livro(String titulo, String autor) {
        this.titulo = titulo;
        this.autor = autor;
    }
}

// Uso
Livro l1 = new Livro(); // Construtor padrão
Livro l2 = new Livro("1984", "George Orwell");
```

### 5. Construtor de Cópia

```java
public class Ponto {
    private int x;
    private int y;
    
    // Construtor normal
    public Ponto(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    // Construtor de cópia
    public Ponto(Ponto outro) {
        this(outro.x, outro.y);
    }
}

// Uso
Ponto p1 = new Ponto(10, 20);
Ponto p2 = new Ponto(p1); // Cópia de p1
```

### 6. Construtor com Array vs Varargs

```java
public class Lista {
    private String[] itens;
    
    // Construtor com array
    public Lista(String[] itens) {
        this.itens = itens;
    }
    
    // Construtor com varargs
    public Lista(String... itens) {
        this.itens = itens;
    }
    
    // ⚠️ Não pode ter ambos (conflito)
}

// Uso com varargs
Lista l1 = new Lista("A", "B", "C");
Lista l2 = new Lista(new String[]{"A", "B"});
```

### 7. Construtor Privado (Singleton)

```java
public class Singleton {
    private static Singleton instancia;
    
    // Construtor privado
    private Singleton() {
        // Inicialização
    }
    
    // Método público para obter instância
    public static Singleton getInstance() {
        if (instancia == null) {
            instancia = new Singleton();
        }
        return instancia;
    }
}

// Uso
Singleton s = Singleton.getInstance();
// new Singleton(); // ❌ Erro: construtor é privado
```

### 8. Construtor com Validação

```java
public class Idade {
    private int valor;
    
    public Idade(int valor) {
        if (valor < 0 || valor > 150) {
            throw new IllegalArgumentException("Idade inválida: " + valor);
        }
        this.valor = valor;
    }
    
    // Construtor sem parâmetros (idade padrão)
    public Idade() {
        this(0);
    }
}

// Uso
Idade i1 = new Idade(25);   // OK
Idade i2 = new Idade();     // OK (idade = 0)
Idade i3 = new Idade(200);  // ❌ IllegalArgumentException
```

### 9. Construtor com Diferentes Tipos

```java
public class Temperatura {
    private double celsius;
    
    // Construtor com Celsius
    public Temperatura(double celsius) {
        this.celsius = celsius;
    }
    
    // Factory method para Fahrenheit
    public static Temperatura fromFahrenheit(double fahrenheit) {
        return new Temperatura((fahrenheit - 32) * 5 / 9);
    }
    
    // Factory method para Kelvin
    public static Temperatura fromKelvin(double kelvin) {
        return new Temperatura(kelvin - 273.15);
    }
}

// Uso
Temperatura t1 = new Temperatura(25);           // Celsius
Temperatura t2 = Temperatura.fromFahrenheit(77); // Fahrenheit
Temperatura t3 = Temperatura.fromKelvin(298.15); // Kelvin
```

### 10. Construtor com Builder Pattern

```java
public class Carro {
    private String marca;
    private String modelo;
    private int ano;
    private String cor;
    
    // Construtor privado
    private Carro(Builder builder) {
        this.marca = builder.marca;
        this.modelo = builder.modelo;
        this.ano = builder.ano;
        this.cor = builder.cor;
    }
    
    public static class Builder {
        private String marca;
        private String modelo;
        private int ano;
        private String cor = "Branco"; // Padrão
        
        public Builder(String marca, String modelo) {
            this.marca = marca;
            this.modelo = modelo;
        }
        
        public Builder ano(int ano) {
            this.ano = ano;
            return this;
        }
        
        public Builder cor(String cor) {
            this.cor = cor;
            return this;
        }
        
        public Carro build() {
            return new Carro(this);
        }
    }
}

// Uso
Carro carro = new Carro.Builder("Toyota", "Corolla")
    .ano(2023)
    .cor("Prata")
    .build();
```

---

## Aplicabilidade

**Use sobrecarga de construtores quando**:
- **Valores padrão**: alguns parâmetros opcionais
- **Flexibilidade**: diferentes formas de criar objeto
- **Delegação**: construtores chamam construtor principal
- **API amigável**: usuário não precisa fornecer tudo
- **Construtor de cópia**: duplicar objeto

**Exemplos**:
```java
// ArrayList
public ArrayList()
public ArrayList(int initialCapacity)
public ArrayList(Collection<? extends E> c)

// String
public String()
public String(String original)
public String(char[] value)
public String(byte[] bytes)
```

---

## Armadilhas

### 1. this() Deve Ser Primeira Instrução

```java
// ❌ Erro
public Pessoa(String nome) {
    System.out.println("Criando");
    this(nome, 0); // Erro: não é primeira instrução
}

// ✅ Correto
public Pessoa(String nome) {
    this(nome, 0);
    System.out.println("Criando");
}
```

### 2. Não Pode Chamar this() e super()

```java
public class Filha extends Mae {
    // ❌ Erro: não pode ter this() e super()
    public Filha(String nome) {
        super(nome);
        this(nome, 0); // Erro
    }
    
    // ✅ Correto: apenas um
    public Filha(String nome) {
        this(nome, 0); // Chama outro construtor
    }
    
    public Filha(String nome, int idade) {
        super(nome); // Chama construtor da superclasse
        // Inicialização
    }
}
```

### 3. Ciclo de Chamadas

```java
// ❌ Erro: ciclo infinito
public class Pessoa {
    public Pessoa(String nome) {
        this(nome, 0); // Chama Pessoa(String, int)
    }
    
    public Pessoa(String nome, int idade) {
        this(nome); // Chama Pessoa(String) - CICLO!
    }
}
```

### 4. Construtor Padrão Desaparece

```java
public class Teste {
    // ✅ Compilador gera construtor padrão
}

// Uso
Teste t = new Teste(); // OK

// Mas se adicionar qualquer construtor:
public class Teste {
    public Teste(int valor) { }
}

// Uso
Teste t1 = new Teste(10);  // OK
Teste t2 = new Teste();    // ❌ Erro: sem construtor padrão
```

### 5. Ambiguidade com Tipos Compatíveis

```java
public class Teste {
    public Teste(int valor) {
        System.out.println("int");
    }
    
    public Teste(double valor) {
        System.out.println("double");
    }
}

Teste t = new Teste(10); // "int"

// ⚠️ Cuidado com promoção
byte b = 5;
Teste t2 = new Teste(b); // "int" - widening byte → int
```

### 6. Null e Sobrecarga

```java
public class Teste {
    public Teste(String s) {
        System.out.println("String");
    }
    
    public Teste(Integer i) {
        System.out.println("Integer");
    }
}

Teste t = new Teste(null); // ❌ Erro: ambíguo
Teste t2 = new Teste((String) null); // ✅ OK: cast explícito
```

---

## Boas Práticas

### 1. Delegação para Construtor Principal

```java
public class Pessoa {
    private String nome;
    private int idade;
    private String email;
    
    // Construtor PRINCIPAL (mais completo)
    public Pessoa(String nome, int idade, String email) {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
    }
    
    // Outros construtores delegam para o principal
    public Pessoa(String nome, int idade) {
        this(nome, idade, "sem-email@exemplo.com");
    }
    
    public Pessoa(String nome) {
        this(nome, 0);
    }
}
```

### 2. Validação no Construtor Principal

```java
public class Conta {
    private String numero;
    private double saldo;
    
    // Validação centralizada
    public Conta(String numero, double saldo) {
        if (numero == null || numero.isEmpty()) {
            throw new IllegalArgumentException("Número inválido");
        }
        if (saldo < 0) {
            throw new IllegalArgumentException("Saldo não pode ser negativo");
        }
        this.numero = numero;
        this.saldo = saldo;
    }
    
    public Conta(String numero) {
        this(numero, 0.0); // Delegação: validação no principal
    }
}
```

### 3. Construtor de Cópia

```java
public class Ponto {
    private int x;
    private int y;
    
    public Ponto(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    // Construtor de cópia
    public Ponto(Ponto outro) {
        this(outro.x, outro.y);
    }
}

Ponto p1 = new Ponto(10, 20);
Ponto p2 = new Ponto(p1); // Cópia
```

### 4. Factory Methods em Vez de Múltiplos Construtores

```java
public class LocalDate {
    private int year;
    private int month;
    private int day;
    
    // Construtor privado
    private LocalDate(int year, int month, int day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
    
    // Factory methods com nomes descritivos
    public static LocalDate of(int year, int month, int day) {
        return new LocalDate(year, month, day);
    }
    
    public static LocalDate ofYearDay(int year, int dayOfYear) {
        // Calcular mês e dia
        return new LocalDate(year, 1, dayOfYear);
    }
    
    public static LocalDate ofEpochDay(long epochDay) {
        // Calcular data a partir de epoch
        return new LocalDate(1970, 1, 1);
    }
}
```

### 5. Builder Pattern para Muitos Parâmetros

```java
// ❌ Evite: muitos construtores
public Pessoa(String nome)
public Pessoa(String nome, int idade)
public Pessoa(String nome, int idade, String email)
public Pessoa(String nome, int idade, String email, String telefone)
public Pessoa(String nome, int idade, String email, String telefone, String endereco)

// ✅ Melhor: Builder
public class Pessoa {
    private String nome;
    private int idade;
    private String email;
    private String telefone;
    private String endereco;
    
    private Pessoa(Builder builder) {
        this.nome = builder.nome;
        this.idade = builder.idade;
        this.email = builder.email;
        this.telefone = builder.telefone;
        this.endereco = builder.endereco;
    }
    
    public static class Builder {
        private String nome; // Obrigatório
        private int idade;
        private String email;
        private String telefone;
        private String endereco;
        
        public Builder(String nome) {
            this.nome = nome;
        }
        
        public Builder idade(int idade) {
            this.idade = idade;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder telefone(String telefone) {
            this.telefone = telefone;
            return this;
        }
        
        public Builder endereco(String endereco) {
            this.endereco = endereco;
            return this;
        }
        
        public Pessoa build() {
            return new Pessoa(this);
        }
    }
}

// Uso
Pessoa p = new Pessoa.Builder("João")
    .idade(25)
    .email("joao@exemplo.com")
    .build();
```

### 6. Evite Lógica Complexa em Construtores

```java
// ❌ Evite: lógica complexa
public class Conexao {
    public Conexao(String url) {
        // Parsing de URL
        // Estabelecer conexão
        // Autenticação
        // Configurações
    }
}

// ✅ Melhor: factory method ou inicialização separada
public class Conexao {
    private String url;
    
    private Conexao(String url) {
        this.url = url;
    }
    
    public static Conexao conectar(String url) {
        Conexao conexao = new Conexao(url);
        conexao.inicializar();
        return conexao;
    }
    
    private void inicializar() {
        // Lógica complexa aqui
    }
}
```

---

## Resumo

**Múltiplos construtores**:
```java
public Pessoa(String nome, int idade, String email) { }
public Pessoa(String nome, int idade) { }
public Pessoa(String nome) { }
```

**Delegação com this()**:
```java
public Pessoa(String nome) {
    this(nome, 0, "sem-email@exemplo.com");
}
```

**this() primeira instrução**:
```java
// ✅ Correto
public Pessoa(String nome) {
    this(nome, 0);
    System.out.println("Criado");
}

// ❌ Erro
public Pessoa(String nome) {
    System.out.println("Criando");
    this(nome, 0); // Erro!
}
```

**Construtor de cópia**:
```java
public Ponto(Ponto outro) {
    this(outro.x, outro.y);
}
```

**Construtor privado (Singleton)**:
```java
private Singleton() { }
```

**Factory methods**:
```java
public static LocalDate of(int year, int month, int day)
public static LocalDate ofYearDay(int year, int dayOfYear)
public static LocalDate ofEpochDay(long epochDay)
```

**Builder Pattern**:
```java
Pessoa p = new Pessoa.Builder("João")
    .idade(25)
    .email("joao@exemplo.com")
    .build();
```

**Quando usar**:
- ✅ Valores padrão
- ✅ Flexibilidade na criação
- ✅ Construtor de cópia
- ✅ API amigável

**Evitar**:
- ❌ this() não na primeira linha
- ❌ this() e super() juntos
- ❌ Ciclos de chamadas
- ❌ Lógica complexa em construtores
- ❌ Muitos construtores (use Builder)

**Regra de Ouro**: Use **delegação** para construtor **principal** com **validação centralizada**. **this()** deve ser **primeira instrução**. Para **muitos parâmetros**, use **Builder Pattern** ou **factory methods**.
