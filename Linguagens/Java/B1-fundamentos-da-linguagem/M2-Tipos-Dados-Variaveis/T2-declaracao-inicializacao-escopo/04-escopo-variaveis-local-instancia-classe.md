# Escopo de Variáveis: Local, Instância e Classe

## 🎯 Introdução e Definição

### Definição Conceitual

**Escopo de variável** define a **região do código** onde uma variável é **visível e acessível**. Em Java, existem três tipos principais de escopo:

1. **Escopo Local** (Local Scope):
   - Variáveis declaradas **dentro de métodos, construtores ou blocos**
   - Existem apenas durante a execução do bloco
   - Devem ser **inicializadas explicitamente** antes do uso

2. **Escopo de Instância** (Instance Scope):
   - Variáveis declaradas como **campos da classe** (não-static)
   - Cada objeto tem sua **própria cópia**
   - Recebem **valores padrão** automaticamente

3. **Escopo de Classe** (Class/Static Scope):
   - Variáveis declaradas como **static**
   - **Compartilhadas** entre todas as instâncias
   - Pertencem à **classe**, não aos objetos

### Características Fundamentais

| Tipo | Onde Declarar | Tempo de Vida | Inicialização | Compartilhamento |
|------|--------------|---------------|---------------|------------------|
| **Local** | Dentro de método/bloco | Durante execução do bloco | Obrigatória | N/A (local ao método) |
| **Instância** | Campo da classe (não-static) | Enquanto objeto existe | Automática (valores padrão) | Cada objeto tem cópia própria |
| **Classe** | Campo static | Durante execução do programa | Automática (valores padrão) | Única cópia compartilhada |

### Contexto Histórico

**Java 1.0 (1995)**: Sistema de escopo herdado de C++ com melhorias:
- **Segurança**: Variáveis locais não inicializadas causam erro de compilação (diferente de C++)
- **Previsibilidade**: Campos sempre recebem valores padrão (0, false, null)
- **Orientação a Objetos**: Distinção clara entre campos de instância (estado do objeto) e classe (estado compartilhado)

**Evolução**:
- **Java 1.0-7**: Escopo baseado em blocos `{}`
- **Java 8+**: Lambdas introduziram **effectively final** (variáveis locais capturadas)
- **Java 10+**: `var` para inferência de tipo (apenas escopo local)

### Problema Fundamental que Resolve

#### Organização de Estado

**Sem distinção de escopo** (hipotético):
```java
nome = "João";  // ⚠️ É do objeto? Da classe? Temporário?
```

**Com escopo explícito**:
```java
public class Pessoa {
    private String nome;           // ✅ INSTÂNCIA (cada pessoa tem seu nome)
    private static int contador;   // ✅ CLASSE (contador compartilhado)
    
    public void metodo() {
        String temp = "temp";      // ✅ LOCAL (temporário ao método)
    }
}
```

---

## 📋 Sumário Conceitual

### Escopo Local

**Declaração**:
```java
public void metodo() {
    int idade = 30;        // Variável local
    String nome = "João";  // Variável local
}
```

**Características**:
- ⏱️ **Tempo de vida**: Durante execução do método/bloco
- 🔒 **Visibilidade**: Apenas dentro do bloco
- ⚠️ **Inicialização**: Obrigatória antes do uso
- 💾 **Memória**: Stack

### Escopo de Instância

**Declaração**:
```java
public class Pessoa {
    private String nome;   // Campo de instância
    private int idade;     // Campo de instância
}
```

**Características**:
- ⏱️ **Tempo de vida**: Enquanto objeto existe
- 🔒 **Visibilidade**: Em toda a classe (com `this`)
- ✅ **Inicialização**: Automática (valores padrão)
- 💾 **Memória**: Heap
- 📦 **Cópias**: Cada objeto tem cópia independente

### Escopo de Classe (Static)

**Declaração**:
```java
public class Configuracao {
    private static int contador;       // Campo de classe
    public static final String VERSAO = "1.0";  // Constante
}
```

**Características**:
- ⏱️ **Tempo de vida**: Durante execução do programa
- 🔒 **Visibilidade**: Em toda a classe
- ✅ **Inicialização**: Automática (valores padrão)
- 💾 **Memória**: Metaspace (Java 8+) / PermGen (Java 7-)
- 🌍 **Compartilhamento**: Única cópia para todas as instâncias

---

## 🧠 Fundamentos Teóricos

### 1. Escopo Local (Local Scope)

**Definição**: Variáveis declaradas dentro de **métodos, construtores ou blocos** (`{}`).

#### 1.1 Variáveis de Método

```java
public void calcular() {
    int resultado = 0;  // Escopo: método completo
    // ... uso de resultado ...
}
```

**Tempo de vida**: Criada quando método inicia, destruída quando termina.

#### 1.2 Variáveis de Bloco

```java
public void exemplo() {
    if (condicao) {
        int x = 10;  // Escopo: apenas dentro do if
        System.out.println(x);  // ✅ OK
    }
    System.out.println(x);  // ❌ ERRO: cannot find symbol
}
```

#### 1.3 Variáveis de Loop

```java
for (int i = 0; i < 10; i++) {  // i existe apenas no loop
    System.out.println(i);
}
System.out.println(i);  // ❌ ERRO: cannot find symbol
```

#### 1.4 Variáveis de Try-Catch

```java
try {
    int valor = calcular();  // Escopo: apenas dentro do try
} catch (Exception e) {
    System.out.println(valor);  // ❌ ERRO: cannot find symbol
}
```

**Solução**: Declarar antes do try.
```java
int valor;
try {
    valor = calcular();
} catch (Exception e) {
    valor = 0;
}
System.out.println(valor);  // ✅ OK
```

---

### 2. Escopo de Instância (Instance Scope)

**Definição**: Campos declarados **na classe** (sem `static`). Cada objeto tem sua **própria cópia**.

```java
public class Pessoa {
    // Campos de instância
    private String nome;
    private int idade;
    private boolean ativo;
    
    public void setNome(String nome) {
        this.nome = nome;  // Acesso ao campo de instância
    }
}
```

**Criação de objetos** (cópias independentes):
```java
Pessoa p1 = new Pessoa();
p1.nome = "João";
p1.idade = 30;

Pessoa p2 = new Pessoa();
p2.nome = "Maria";
p2.idade = 25;

// p1.nome = "João", p2.nome = "Maria" (cópias independentes)
```

#### 2.1 Valores Padrão Automáticos

**Campos de instância recebem valores padrão**:
```java
public class Exemplo {
    private int numero;         // 0
    private double decimal;     // 0.0
    private boolean flag;       // false
    private char caractere;     // '\u0000'
    private String texto;       // null
    private Object objeto;      // null
}
```

#### 2.2 Acesso com `this`

```java
public class Pessoa {
    private String nome;
    
    public void setNome(String nome) {
        this.nome = nome;  // this.nome = campo, nome = parâmetro
    }
}
```

---

### 3. Escopo de Classe (Class/Static Scope)

**Definição**: Campos declarados com **`static`**. Existe **uma única cópia** compartilhada entre todas as instâncias.

```java
public class Contador {
    private static int total = 0;  // Compartilhado entre todos os objetos
    
    public Contador() {
        total++;  // Incrementa contador compartilhado
    }
    
    public static int getTotal() {
        return total;
    }
}
```

**Uso**:
```java
Contador c1 = new Contador();  // total = 1
Contador c2 = new Contador();  // total = 2
Contador c3 = new Contador();  // total = 3

System.out.println(Contador.getTotal());  // 3
```

#### 3.1 Acesso a Campos Static

**Dentro da classe**:
```java
public class Exemplo {
    private static int contador = 0;
    
    public void metodo() {
        contador++;  // ✅ Acesso direto
        Exemplo.contador++;  // ✅ Acesso via nome da classe (redundante)
    }
}
```

**Fora da classe**:
```java
Exemplo.contador;  // ✅ Acesso via nome da classe
objeto.contador;   // ⚠️ Funciona, mas gera warning (deveria usar Exemplo.contador)
```

#### 3.2 Métodos Static vs Campos de Instância

**Regra**: Métodos `static` **não podem** acessar campos de instância diretamente.

```java
public class Pessoa {
    private String nome;  // Campo de instância
    private static int contador;  // Campo de classe
    
    public static void metodoStatic() {
        contador++;  // ✅ OK (ambos static)
        nome = "João";  // ❌ ERRO: non-static field cannot be referenced from static context
    }
    
    public void metodoInstancia() {
        contador++;  // ✅ OK (método de instância pode acessar static)
        nome = "João";  // ✅ OK (mesmo escopo)
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Tabela Comparativa Completa

| Característica | Local | Instância | Classe (Static) |
|----------------|-------|-----------|-----------------|
| **Declaração** | Dentro de método/bloco | Campo da classe (não-static) | Campo da classe (static) |
| **Palavra-chave** | Nenhuma | Nenhuma (ou modificadores de acesso) | `static` |
| **Tempo de vida** | Durante execução do bloco | Enquanto objeto existe | Durante execução do programa |
| **Memória** | Stack | Heap | Metaspace |
| **Inicialização** | Obrigatória (manual) | Automática (valores padrão) | Automática (valores padrão) |
| **Valores padrão** | ❌ Não (deve inicializar) | ✅ Sim (0, false, null) | ✅ Sim (0, false, null) |
| **Compartilhamento** | N/A (local) | ❌ Cada objeto tem cópia | ✅ Única cópia compartilhada |
| **Acesso** | Apenas no bloco | `this.campo` ou `campo` | `NomeClasse.campo` ou `campo` |
| **Modificadores** | ❌ Não permitido (`final` é exceção) | ✅ `private`, `public`, `protected`, `final` | ✅ `private`, `public`, `protected`, `final` |
| **Uso em lambdas** | ⚠️ Deve ser effectively final | ✅ Sim | ✅ Sim |
| **Uso em métodos static** | N/A | ❌ Não (precisa de objeto) | ✅ Sim |

### Hierarquia de Acesso

```
┌─────────────────────────────────────┐
│         CLASSE                      │
│  ┌───────────────────────────────┐  │
│  │  Campos de Classe (static)   │  │
│  │  - Compartilhados             │  │
│  │  - Únicos para toda a classe  │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  Campos de Instância          │  │
│  │  - Cópia por objeto           │  │
│  │  - Acessíveis com 'this'      │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  MÉTODO                       │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ Variáveis Locais        │  │  │
│  │  │ - Escopo limitado       │  │  │
│  │  │ - Stack                 │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Escopo Local - Cálculos Temporários

```java
public class CalculadoraPreco {
    public double calcularPrecoFinal(double precoBase, int quantidade) {
        // Variáveis locais (temporárias)
        double subtotal = precoBase * quantidade;
        double taxaImposto = 0.15;
        double imposto = subtotal * taxaImposto;
        double precoFinal = subtotal + imposto;
        
        return precoFinal;
        // Todas as variáveis locais são destruídas aqui
    }
}
```

### Caso 2: Escopo de Instância - Estado do Objeto

```java
public class ContaBancaria {
    // Campos de instância (estado do objeto)
    private String numeroConta;
    private String titular;
    private double saldo;
    private LocalDateTime dataCriacao;
    
    public ContaBancaria(String numeroConta, String titular) {
        this.numeroConta = numeroConta;
        this.titular = titular;
        this.saldo = 0.0;
        this.dataCriacao = LocalDateTime.now();
    }
    
    public void depositar(double valor) {
        this.saldo += valor;  // Modifica estado do objeto
    }
    
    public void sacar(double valor) {
        if (valor <= this.saldo) {
            this.saldo -= valor;
        }
    }
}
```

**Uso**:
```java
ContaBancaria conta1 = new ContaBancaria("001", "João");
conta1.depositar(1000);  // conta1.saldo = 1000

ContaBancaria conta2 = new ContaBancaria("002", "Maria");
conta2.depositar(500);   // conta2.saldo = 500

// Cada conta tem seu próprio saldo (cópias independentes)
```

### Caso 3: Escopo de Classe - Contador Compartilhado

```java
public class Produto {
    // Campo de classe (compartilhado)
    private static int contadorProdutos = 0;
    
    // Campos de instância (cada produto tem os seus)
    private String codigo;
    private String nome;
    private double preco;
    
    public Produto(String nome, double preco) {
        this.codigo = "PRD-" + (++contadorProdutos);  // Incrementa contador compartilhado
        this.nome = nome;
        this.preco = preco;
    }
    
    public static int getTotalProdutos() {
        return contadorProdutos;
    }
}
```

**Uso**:
```java
Produto p1 = new Produto("Notebook", 3000);  // codigo = "PRD-1"
Produto p2 = new Produto("Mouse", 50);       // codigo = "PRD-2"
Produto p3 = new Produto("Teclado", 150);    // codigo = "PRD-3"

System.out.println(Produto.getTotalProdutos());  // 3
```

### Caso 4: Constantes de Classe

```java
public class Configuracao {
    // Constantes (static final)
    public static final int TIMEOUT = 5000;
    public static final String VERSAO = "1.0.0";
    public static final double PI = 3.14159265359;
    
    // Constantes de configuração
    public static final int MAX_TENTATIVAS_LOGIN = 3;
    public static final int IDADE_MINIMA = 18;
    public static final int IDADE_MAXIMA = 120;
}
```

**Uso**:
```java
if (tentativas >= Configuracao.MAX_TENTATIVAS_LOGIN) {
    // Bloquear usuário
}
```

### Caso 5: Combinação de Escopos

```java
public class Carrinho {
    // Campo de classe (desconto padrão para todos)
    private static double descontoGlobal = 0.05;
    
    // Campos de instância (estado do carrinho)
    private List<Produto> produtos;
    private double total;
    
    public Carrinho() {
        this.produtos = new ArrayList<>();
        this.total = 0.0;
    }
    
    public void adicionarProduto(Produto produto) {
        // Variável local (temporária)
        double precoComDesconto = produto.getPreco() * (1 - descontoGlobal);
        
        this.produtos.add(produto);
        this.total += precoComDesconto;
    }
    
    public static void setDescontoGlobal(double desconto) {
        descontoGlobal = desconto;  // Afeta todos os carrinhos
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Variáveis Locais Não Inicializadas

**Problema**:
```java
public void metodo() {
    int x;
    System.out.println(x);  // ❌ ERRO: variable x might not have been initialized
}
```

**Solução**: Sempre inicializar.
```java
public void metodo() {
    int x = 0;  // ✅ OK
    System.out.println(x);
}
```

### 2. Métodos Static Não Acessam Campos de Instância

**Problema**:
```java
public class Exemplo {
    private String nome;
    
    public static void metodo() {
        System.out.println(nome);  // ❌ ERRO: non-static field cannot be referenced
    }
}
```

**Solução**: Passar objeto como parâmetro ou tornar método de instância.
```java
public class Exemplo {
    private String nome;
    
    public static void metodo(Exemplo objeto) {
        System.out.println(objeto.nome);  // ✅ OK
    }
    
    // OU
    
    public void metodoInstancia() {
        System.out.println(nome);  // ✅ OK
    }
}
```

### 3. Variáveis Locais em Lambdas (Effectively Final)

**Problema**: Lambdas só capturam variáveis **effectively final**.

```java
public void metodo() {
    int x = 10;
    x = 20;  // ⚠️ x não é mais effectively final
    
    Runnable r = () -> System.out.println(x);  // ❌ ERRO: variable used in lambda should be final or effectively final
}
```

**Solução**: Não modificar variável local capturada.
```java
public void metodo() {
    int x = 10;  // Não modificado (effectively final)
    
    Runnable r = () -> System.out.println(x);  // ✅ OK
}
```

### 4. Shadowing (Sombreamento)

**Problema**: Variável local com mesmo nome de campo.

```java
public class Pessoa {
    private String nome = "Padrão";
    
    public void metodo(String nome) {  // Parâmetro "shadowing" campo
        System.out.println(nome);       // "Local" (parâmetro)
        System.out.println(this.nome);  // "Padrão" (campo)
    }
}
```

### 5. Campos Static Modificados por Múltiplas Threads

**Problema**: Race condition em campos compartilhados.

```java
public class Contador {
    private static int total = 0;  // ⚠️ Não thread-safe
    
    public static void incrementar() {
        total++;  // ⚠️ Não atômico
    }
}
```

**Solução**: Sincronização ou `AtomicInteger`.
```java
public class Contador {
    private static AtomicInteger total = new AtomicInteger(0);
    
    public static void incrementar() {
        total.incrementAndGet();  // ✅ Thread-safe
    }
}
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Modificadores de Acesso**: `private`, `public`, `protected`
- **`static`**: Campos de classe
- **`final`**: Constantes e imutabilidade
- **Shadowing**: Conflito de nomes entre escopos
- **Inicialização**: Diferenças entre local e instância/classe
- **Memória**: Stack (local) vs Heap (instância) vs Metaspace (classe)

---

## 🚀 Boas Práticas

1. ✅ **Use variáveis locais para cálculos temporários**
   ```java
   double resultado = calcular();  // ✅ Local
   ```

2. ✅ **Use campos de instância para estado do objeto**
   ```java
   private String nome;  // ✅ Estado do objeto
   ```

3. ✅ **Use campos static para valores compartilhados**
   ```java
   private static int contador;  // ✅ Compartilhado
   ```

4. ✅ **Prefira constantes static final para valores fixos**
   ```java
   public static final int MAX = 100;  // ✅ Constante
   ```

5. ✅ **Inicialize variáveis locais próximo ao uso**
   ```java
   // ✅ Bom
   int x = calcular();
   usar(x);
   
   // ❌ Ruim (longe do uso)
   int x;
   // ... 50 linhas ...
   x = calcular();
   ```

6. ❌ **Evite campos static mutáveis em ambientes multi-thread**
   ```java
   private static int contador;  // ⚠️ Race condition
   ```

7. ✅ **Use `this` para clareza quando há shadowing**
   ```java
   this.nome = nome;  // ✅ Claro (campo vs parâmetro)
   ```

8. ✅ **Minimize escopo de variáveis**
   ```java
   for (int i = 0; i < 10; i++) {  // ✅ i só existe no loop
       // ...
   }
   ```
