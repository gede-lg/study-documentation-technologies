# Palavra-chave this

## 🎯 Introdução e Definição

**this** é uma **referência** ao **objeto atual** - a instância na qual o método está sendo executado. Permite acessar **atributos** e **métodos** do próprio objeto, diferenciar **atributo** de **parâmetro** com mesmo nome, chamar **outro construtor** da mesma classe (`this()`), e retornar **próprio objeto** para method chaining. `this` só existe em **contexto de instância** (não em métodos/blocos `static`).

**Conceito central**: `this` = **"eu mesmo"** (self-reference). Aponta para o objeto que **recebeu a chamada**. Quando `objeto.metodo()` é chamado, dentro do método `this` se refere a `objeto`. É como pronome reflexivo **"meu"** ou **"me"** - `this.nome` = "meu nome", `this.calcular()` = "me calcular". **Implícito** quando não há ambiguidade, **explícito** quando necessário.

**Analogia completa**:
- **this**: Espelho (você vendo você mesmo)
- **this.atributo**: "Meu atributo" (seu próprio atributo)
- **this.metodo()**: "Fazer algo comigo" (chamar meu próprio método)
- **this()**: "Inicializar-me de outra forma" (chamar outro construtor)
- **return this**: "Retornar eu mesmo" (para encadeamento)

**Estrutura**:
```java
public class Produto {
    private String nome;
    private double preco;
    
    // 1. Diferenciar atributo de parâmetro
    public void setNome(String nome) {
        this.nome = nome;
        //↑         ↑
        // atributo  parâmetro
    }
    
    // 2. Chamar método do próprio objeto
    public void exibir() {
        this.validar();  // Chama validar() do próprio objeto
        // Equivalente a: validar() (this implícito)
    }
    
    private void validar() {
        // Lógica de validação
    }
    
    // 3. Retornar próprio objeto (method chaining)
    public Produto setPreco(double preco) {
        this.preco = preco;
        return this;  // Retorna próprio objeto
    }
    
    // 4. Chamar outro construtor
    public Produto(String nome) {
        this(nome, 0.0);  // Chama Produto(String, double)
        //↑ Deve ser primeira instrução
    }
    
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
}

// USO:
Produto p = new Produto("Mouse");
// Dentro do construtor: this = p (próprio objeto sendo criado)

p.setNome("Teclado");
// Dentro do setter: this = p (objeto que chamou o método)

Produto p2 = new Produto("Monitor")
    .setPreco(500.0);
//  ↑ setPreco retorna this (próprio objeto p2)
```

**Exemplo completo**:
```java
public class Pessoa {
    private String nome;
    private int idade;
    private String email;
    
    // Construtor - this() chama outro construtor
    public Pessoa(String nome) {
        this(nome, 0);  // Chama Pessoa(String, int)
    }
    
    public Pessoa(String nome, int idade) {
        this(nome, idade, null);  // Chama Pessoa(String, int, String)
    }
    
    // Construtor completo (mestre)
    public Pessoa(String nome, int idade, String email) {
        // this.atributo = parâmetro (diferencia nomes iguais)
        this.nome = nome;
        this.idade = idade;
        this.email = email;
    }
    
    // Setter com this explícito
    public void setNome(String nome) {
        this.nome = nome;  // this.nome = atributo, nome = parâmetro
    }
    
    // Setter retornando this (method chaining)
    public Pessoa setIdade(int idade) {
        this.idade = idade;
        return this;  // Retorna próprio objeto
    }
    
    // Chamar método do próprio objeto
    public void exibir() {
        // this.validar() - explícito
        this.validar();
        
        // Acessar atributos com this
        System.out.println("Nome: " + this.nome);
        System.out.println("Idade: " + this.idade);
        
        // Equivalente (this implícito):
        // validar();
        // System.out.println("Nome: " + nome);
    }
    
    private void validar() {
        if (this.nome == null || this.nome.isEmpty()) {
            throw new IllegalStateException("Nome inválido");
        }
    }
    
    // Passar this como argumento
    public void registrar(Registro registro) {
        registro.adicionar(this);  // Passa próprio objeto
        //                  ↑ this = própria Pessoa
    }
}

// USO:
Pessoa p = new Pessoa("João", 30);
// Dentro dos métodos de p: this = p

p.setNome("Maria");
// Dentro de setNome: this = p (objeto que chamou)

Pessoa p2 = new Pessoa("Pedro")
    .setIdade(25);
//  ↑ setIdade retorna this (p2), permite encadear
```

## 📋 Fundamentos Teóricos

### 1️⃣ this Referencia Objeto Atual

**Conceito**: `this` aponta para o objeto que **recebeu a chamada**.

**Exemplo**:
```java
public class Contador {
    private int valor = 0;
    
    public void incrementar() {
        this.valor++;  // this = objeto que chamou incrementar()
        System.out.println("this = " + this);
    }
}

// Uso:
Contador c1 = new Contador();
c1.incrementar();  // Dentro: this = c1
// Imprime: this = Contador@1a2b

Contador c2 = new Contador();
c2.incrementar();  // Dentro: this = c2
// Imprime: this = Contador@9z8y

// this referencia OBJETO DIFERENTE em cada chamada
```

**Múltiplas instâncias**:
```java
Produto p1 = new Produto();
p1.setNome("Mouse");  // this = p1

Produto p2 = new Produto();
p2.setNome("Teclado");  // this = p2

Produto p3 = new Produto();
p3.setNome("Monitor");  // this = p3

// Cada chamada, this aponta para objeto diferente
```

### 2️⃣ Acessar Atributos com this

**Conceito**: `this.atributo` acessa atributo do objeto atual.

**Explícito**:
```java
public class Produto {
    private String nome;
    private double preco;
    
    public void exibir() {
        // Acesso EXPLÍCITO com this
        System.out.println(this.nome);
        System.out.println(this.preco);
    }
}
```

**Implícito** (equivalente):
```java
public void exibir() {
    // Acesso IMPLÍCITO (sem this, mas equivalente)
    System.out.println(nome);   // = this.nome
    System.out.println(preco);  // = this.preco
    
    // Compiler assume 'this' automaticamente
}
```

**Quando this é necessário**:
```java
public void setNome(String nome) {
    // NECESSÁRIO - diferenciar atributo de parâmetro
    this.nome = nome;
    //↑         ↑
    // atributo  parâmetro
    
    // Sem this, seria ambíguo:
    // nome = nome;  // ⚠️ Atribui parâmetro a ele mesmo (não funciona)
}
```

### 3️⃣ Diferenciar Atributo de Parâmetro (Shadowing)

**Conceito**: Quando parâmetro tem **mesmo nome** que atributo, usar `this.` para acessar atributo.

**Setter**:
```java
public class Pessoa {
    private String nome;  // Atributo
    
    public void setNome(String nome) {
        //                    ↑ Parâmetro (SOMBREIA atributo)
        
        // 'nome' sozinho = parâmetro
        System.out.println(nome);  // Parâmetro
        
        // 'this.nome' = atributo
        this.nome = nome;
        //↑         ↑
        // atributo  parâmetro
    }
}
```

**Construtor**:
```java
public class Produto {
    private String nome;
    private double preco;
    private int estoque;
    
    public Produto(String nome, double preco, int estoque) {
        //             ↑           ↑            ↑
        //          Parâmetros (SOMBREIAM atributos)
        
        // Atribuir parâmetros aos atributos
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
        //↑              ↑
        // atributo       parâmetro
    }
}
```

**Sem shadowing** (nomes diferentes):
```java
public void setNome(String novoNome) {
    // Sem ambiguidade
    this.nome = novoNome;  // this opcional (mas explícito)
    // Equivalente:
    nome = novoNome;  // this implícito
}
```

### 4️⃣ Chamar Métodos com this

**Conceito**: `this.metodo()` chama método do próprio objeto.

**Explícito**:
```java
public class Calculadora {
    public int somar(int a, int b) {
        return a + b;
    }
    
    public int calcular(int a, int b, int c) {
        // Chamar EXPLICITAMENTE método do próprio objeto
        int soma = this.somar(a, b);  // this.somar()
        soma += c;
        return soma;
    }
}
```

**Implícito** (equivalente):
```java
public int calcular(int a, int b, int c) {
    // Chamar IMPLICITAMENTE (sem this)
    int soma = somar(a, b);  // = this.somar(a, b)
    soma += c;
    return soma;
}
```

**Quando this é útil**:
```java
public class Pessoa {
    private String nome;
    
    public void exibir() {
        this.validar();  // Explícito (clareza)
        System.out.println(this.getNome());
    }
    
    private void validar() {
        if (nome == null) {
            throw new IllegalStateException();
        }
    }
    
    public String getNome() {
        return this.nome;
    }
}
```

### 5️⃣ Construtor Chamando Construtor (Constructor Chaining)

**Conceito**: `this(args)` chama **outro construtor** da mesma classe.

**Exemplo**:
```java
public class Produto {
    private String nome;
    private double preco;
    private int estoque;
    
    // Construtor 1 - sem parâmetros
    public Produto() {
        this("Sem nome", 0.0, 0);  // Chama Produto(String, double, int)
        //↑ DEVE ser primeira instrução
    }
    
    // Construtor 2 - nome apenas
    public Produto(String nome) {
        this(nome, 0.0, 0);  // Chama Produto(String, double, int)
    }
    
    // Construtor 3 - nome e preço
    public Produto(String nome, double preco) {
        this(nome, preco, 0);  // Chama Produto(String, double, int)
    }
    
    // Construtor 4 - completo (MESTRE)
    public Produto(String nome, double preco, int estoque) {
        // Inicialização real acontece aqui
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }
}

// Uso:
Produto p1 = new Produto();
// Chama Produto() → this("Sem nome", 0.0, 0) → Produto(String, double, int)

Produto p2 = new Produto("Mouse");
// Chama Produto(String) → this("Mouse", 0.0, 0) → Produto(String, double, int)

Produto p3 = new Produto("Mouse", 50.0);
// Chama Produto(String, double) → this("Mouse", 50.0, 0) → Produto(String, double, int)

Produto p4 = new Produto("Mouse", 50.0, 100);
// Chama Produto(String, double, int) diretamente
```

**Regras do this()**:
```java
public Produto(String nome) {
    // ✓ this() DEVE ser PRIMEIRA instrução
    this(nome, 0.0, 0);
    
    // ❌ ERRO - código antes de this():
    // System.out.println("Criando produto");
    // this(nome, 0.0, 0);  // ERRO
    
    // ✓ OK - código DEPOIS de this():
    System.out.println("Produto criado");
}

// ❌ ERRO - dois this():
public Produto(String nome) {
    this(nome, 0.0);      // OK
    this(nome, 0.0, 0);   // ❌ ERRO: apenas UM this()
}
```

**Evitar ciclo**:
```java
// ❌ ERRO - ciclo infinito:
public Produto() {
    this("nome");  // Chama Produto(String)
}

public Produto(String nome) {
    this();  // ❌ Chama Produto() → ciclo infinito
}
```

### 6️⃣ Retornar this (Method Chaining)

**Conceito**: Retornar `this` permite **encadear** chamadas de métodos.

**Exemplo**:
```java
public class Produto {
    private String nome;
    private double preco;
    private int estoque;
    
    // Setters retornam this
    public Produto setNome(String nome) {
        this.nome = nome;
        return this;  // Retorna próprio objeto
    }
    
    public Produto setPreco(double preco) {
        this.preco = preco;
        return this;
    }
    
    public Produto setEstoque(int estoque) {
        this.estoque = estoque;
        return this;
    }
}

// Uso - ENCADEAMENTO:
Produto p = new Produto()
    .setNome("Mouse")
    .setPreco(50.0)
    .setEstoque(100);
//  ↑ Cada método retorna this (próprio objeto)

// Equivalente a:
Produto p = new Produto();
p.setNome("Mouse");      // Retorna p
p.setPreco(50.0);        // Retorna p
p.setEstoque(100);       // Retorna p
```

**Builder Pattern**:
```java
public class PedidoBuilder {
    private Pedido pedido = new Pedido();
    
    public PedidoBuilder cliente(Cliente cliente) {
        pedido.setCliente(cliente);
        return this;  // Retorna builder
    }
    
    public PedidoBuilder produto(Produto produto) {
        pedido.addProduto(produto);
        return this;
    }
    
    public PedidoBuilder desconto(double desconto) {
        pedido.setDesconto(desconto);
        return this;
    }
    
    public Pedido build() {
        return pedido;  // Retorna pedido (não this)
    }
}

// Uso:
Pedido pedido = new PedidoBuilder()
    .cliente(cliente)
    .produto(produto1)
    .produto(produto2)
    .desconto(10.0)
    .build();
```

### 7️⃣ Passar this como Argumento

**Conceito**: Passar `this` como argumento para **outros métodos**.

**Exemplo**:
```java
public class Pessoa {
    private String nome;
    
    public void registrar(Registro registro) {
        // Passa próprio objeto como argumento
        registro.adicionar(this);
        //                  ↑ this = própria Pessoa
    }
}

public class Registro {
    private List<Pessoa> pessoas = new ArrayList<>();
    
    public void adicionar(Pessoa pessoa) {
        pessoas.add(pessoa);
    }
}

// Uso:
Pessoa p = new Pessoa();
Registro r = new Registro();
p.registrar(r);  // Dentro: this = p, passa p para registro
```

**Event Listener**:
```java
public class Botao {
    private ActionListener listener;
    
    public void setListener(ActionListener listener) {
        this.listener = listener;
    }
    
    public void clicar() {
        listener.onClick(this);  // Passa próprio botão
        //                ↑ this = Botão que foi clicado
    }
}

public interface ActionListener {
    void onClick(Botao botao);
}

// Uso:
Botao botao = new Botao();
botao.setListener(b -> {
    System.out.println("Botão clicado: " + b);
    // b = botao (recebido via this)
});
```

### 8️⃣ this em Contexto Estático

**Conceito**: `this` **NÃO existe** em métodos/blocos `static`.

**❌ ERRO - this em static**:
```java
public class Exemplo {
    private int atributo = 10;
    
    public static void metodoEstatico() {
        // ❌ ERRO - this não existe em static:
        // System.out.println(this.atributo);  // ERRO
        // this.metodoInstancia();  // ERRO
        
        // Static não tem objeto (não há 'this')
    }
    
    public void metodoInstancia() {
        // ✓ OK - this existe em métodos de instância:
        System.out.println(this.atributo);  // OK
    }
}
```

**Explicação**:
```
MÉTODO STATIC:
- Pertence à CLASSE (não a objeto)
- Sem objeto, sem 'this'
- Não pode acessar atributos de instância

MÉTODO DE INSTÂNCIA:
- Pertence ao OBJETO
- Tem 'this' (referência ao objeto)
- Pode acessar atributos de instância
```

### 9️⃣ this em Inner Classes

**Conceito**: Inner class pode acessar `this` da **outer class**.

**Exemplo**:
```java
public class Outer {
    private int x = 10;
    
    public class Inner {
        private int x = 20;
        
        public void exibir() {
            // this.x = atributo de Inner
            System.out.println(this.x);  // 20
            
            // Outer.this.x = atributo de Outer
            System.out.println(Outer.this.x);  // 10
            //                 ↑
            //           'this' da classe externa
        }
    }
}

// Uso:
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();
inner.exibir();
// 20 (Inner.this.x)
// 10 (Outer.this.x)
```

**Sintaxe**:
```
this          = Instância da classe atual (Inner)
Outer.this    = Instância da classe externa (Outer)
```

### 🔟 this e Equals/HashCode

**Conceito**: `this` usado para **comparar** próprio objeto.

**equals()**:
```java
public class Produto {
    private String nome;
    private double preco;
    
    @Override
    public boolean equals(Object obj) {
        // Comparar this com obj
        if (this == obj) {
            return true;  // Mesmo objeto (mesma referência)
        }
        
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        
        Produto outro = (Produto) obj;
        
        // Comparar atributos de 'this' com 'outro'
        return this.nome.equals(outro.nome) &&
               this.preco == outro.preco;
    }
}
```

**hashCode()**:
```java
@Override
public int hashCode() {
    // Usar atributos de 'this'
    return Objects.hash(this.nome, this.preco);
}
```

## 🎯 Aplicabilidade

**1. Diferenciar atributo de parâmetro (setters)**
**2. Chamar outro construtor (encadeamento)**
**3. Retornar próprio objeto (method chaining)**
**4. Passar próprio objeto como argumento**
**5. Clareza ao acessar atributos/métodos**

## ⚠️ Armadilhas Comuns

**1. this em static**:
```java
public static void metodo() {
    this.atributo;  // ❌ ERRO
}
```

**2. this() não primeiro**:
```java
public Produto(String nome) {
    System.out.println();
    this(nome, 0);  // ❌ ERRO
}
```

**3. Múltiplos this()**:
```java
this("A");
this("A", 0);  // ❌ ERRO
```

**4. Ciclo de this()**:
```java
Produto() { this("A"); }
Produto(String s) { this(); }  // ❌ Ciclo
```

**5. Shadowing sem this**:
```java
void setNome(String nome) {
    nome = nome;  // ⚠️ Não funciona
}
```

## ✅ Boas Práticas

**1. this em setters**:
```java
this.atributo = parametro;
```

**2. Encadear construtores**:
```java
Produto() { this("default"); }
Produto(String s) { this(s, 0); }
```

**3. Method chaining**:
```java
public Produto setNome(String nome) {
    this.nome = nome;
    return this;
}
```

**4. this para clareza**:
```java
this.metodo();  // Explícito
```

**5. Evitar this desnecessário**:
```java
// Se não há ambiguidade:
nome = "valor";  // OK (this implícito)
```

## 📚 Resumo Executivo

**this = objeto atual**.

**Acessar atributo**:
```java
this.atributo  // Explícito
atributo       // Implícito (equivalente)
```

**Diferenciar nomes**:
```java
public void setNome(String nome) {
    this.nome = nome;  // this.nome = atributo
}
```

**Chamar método**:
```java
this.metodo()  // Explícito
metodo()       // Implícito
```

**Constructor chaining**:
```java
public Produto() {
    this("default", 0);  // Chama outro construtor
}
```

**Method chaining**:
```java
public Produto setNome(String nome) {
    this.nome = nome;
    return this;  // Encadear
}

new Produto()
    .setNome("A")
    .setPreco(10);
```

**Passar this**:
```java
registro.adicionar(this);  // Passa próprio objeto
```

**Não existe em static**:
```java
public static void metodo() {
    // this NÃO existe aqui
}
```

**Inner class**:
```java
this.x         // Inner
Outer.this.x   // Outer
```

**Evitar**:
- this em static
- this() não primeiro
- Múltiplos this()
- Ciclos

**Preferir**:
- this em setters
- Constructor chaining
- Method chaining
- this para clareza

**Recomendação**: Use **this em setters**, encadeie **construtores** com this(), retorne **this para chaining**, passe **this como argumento**, use **this para clareza** quando ambíguo, evite **this em static**, sempre **this() primeiro** em construtor.