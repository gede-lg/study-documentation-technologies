# T3.04 - Sintaxe Externa.new Interna()

## Introdução

**Sintaxe**: `externa.new Interna()` para criar inner class.

```java
public class Externa {
    public class Interna {
        public void metodo() {
            System.out.println("Interna");
        }
    }
}

// Sintaxe: externa.new Interna()
Externa externa = new Externa();
Externa.Interna interna = externa.new Interna();
interna.metodo(); // Interna
```

**Referência**: inner precisa de referência à externa.

---

## Fundamentos

### 1. Sintaxe Básica

**Forma completa**: `Externa externa = new Externa(); Externa.Interna interna = externa.new Interna();`

```java
public class Carro {
    private String marca;
    
    public Carro(String marca) {
        this.marca = marca;
    }
    
    public class Motor {
        private int potencia;
        
        public Motor(int potencia) {
            this.potencia = potencia;
        }
        
        public void exibir() {
            System.out.println("Carro: " + marca);
            System.out.println("Motor: " + potencia + " cv");
        }
    }
}

// Passo 1: Instanciar externa
Carro carro = new Carro("Toyota");

// Passo 2: Instanciar inner com sintaxe externa.new Interna()
Carro.Motor motor = carro.new Motor(150);

motor.exibir();
// Carro: Toyota
// Motor: 150 cv
```

### 2. Sintaxe Encadeada

**Encadeamento**: criar externa e inner em uma linha.

```java
public class Empresa {
    private String nome;
    
    public Empresa(String nome) {
        this.nome = nome;
    }
    
    public class Funcionario {
        private String nomeFuncionario;
        
        public Funcionario(String nomeFuncionario) {
            this.nomeFuncionario = nomeFuncionario;
        }
        
        public void exibir() {
            System.out.println(nomeFuncionario + " trabalha em " + nome);
        }
    }
}

// Sintaxe encadeada
Empresa.Funcionario func = new Empresa("Google").new Funcionario("João");
func.exibir(); // João trabalha em Google
```

### 3. Sintaxe com Variáveis

**Variáveis**: armazenar externa e inner.

```java
public class Documento {
    private String titulo;
    
    public Documento(String titulo) {
        this.titulo = titulo;
    }
    
    public class Pagina {
        private int numero;
        
        public Pagina(int numero) {
            this.numero = numero;
        }
        
        public void exibir() {
            System.out.println("Documento: " + titulo + ", Página: " + numero);
        }
    }
}

// Com variáveis
Documento doc = new Documento("Manual");
Documento.Pagina pag1 = doc.new Pagina(1);
Documento.Pagina pag2 = doc.new Pagina(2);

pag1.exibir(); // Documento: Manual, Página: 1
pag2.exibir(); // Documento: Manual, Página: 2
```

### 4. Sintaxe Dentro da Classe Externa

**Dentro da externa**: não precisa de referência explícita.

```java
public class Container {
    private String nome;
    
    public Container(String nome) {
        this.nome = nome;
    }
    
    public class Item {
        private String descricao;
        
        public Item(String descricao) {
            this.descricao = descricao;
        }
        
        public void exibir() {
            System.out.println(nome + ": " + descricao);
        }
    }
    
    public Item criarItem(String descricao) {
        // Dentro da externa: new Item() diretamente
        return new Item(descricao);
    }
}

// Uso
Container container = new Container("Container 1");

// Forma 1: método da externa
Container.Item item1 = container.criarItem("Item A");

// Forma 2: sintaxe externa.new
Container.Item item2 = container.new Item("Item B");

item1.exibir(); // Container 1: Item A
item2.exibir(); // Container 1: Item B
```

### 5. Sintaxe com Constructor Arguments

**Argumentos**: passar argumentos para externa e inner.

```java
public class Pedido {
    private int numero;
    private String cliente;
    
    public Pedido(int numero, String cliente) {
        this.numero = numero;
        this.cliente = cliente;
    }
    
    public class ItemPedido {
        private String produto;
        private int quantidade;
        
        public ItemPedido(String produto, int quantidade) {
            this.produto = produto;
            this.quantidade = quantidade;
        }
        
        public void exibir() {
            System.out.println("Pedido #" + numero + " - " + cliente);
            System.out.println(produto + " x " + quantidade);
        }
    }
}

// Argumentos para externa e inner
Pedido pedido = new Pedido(100, "Maria");
Pedido.ItemPedido item = pedido.new ItemPedido("Notebook", 2);

item.exibir();
// Pedido #100 - Maria
// Notebook x 2
```

### 6. Sintaxe com Diferentes Instâncias

**Múltiplas externas**: cada inner vinculada a externa diferente.

```java
public class Projeto {
    private String nome;
    
    public Projeto(String nome) {
        this.nome = nome;
    }
    
    public class Tarefa {
        private String descricao;
        
        public Tarefa(String descricao) {
            this.descricao = descricao;
        }
        
        public void exibir() {
            System.out.println(nome + ": " + descricao);
        }
    }
}

// Duas externas diferentes
Projeto projeto1 = new Projeto("Projeto A");
Projeto projeto2 = new Projeto("Projeto B");

// Cada inner vinculada a sua externa
Projeto.Tarefa tarefa1 = projeto1.new Tarefa("Tarefa 1");
Projeto.Tarefa tarefa2 = projeto2.new Tarefa("Tarefa 2");

tarefa1.exibir(); // Projeto A: Tarefa 1
tarefa2.exibir(); // Projeto B: Tarefa 2
```

### 7. Sintaxe com Array

**Array**: criar array de inner classes.

```java
public class Turma {
    private String codigo;
    
    public Turma(String codigo) {
        this.codigo = codigo;
    }
    
    public class Aluno {
        private String nome;
        
        public Aluno(String nome) {
            this.nome = nome;
        }
        
        public void exibir() {
            System.out.println(nome + " - Turma: " + codigo);
        }
    }
}

// Array de inner classes
Turma turma = new Turma("A1");

Turma.Aluno[] alunos = new Turma.Aluno[3];
alunos[0] = turma.new Aluno("João");
alunos[1] = turma.new Aluno("Maria");
alunos[2] = turma.new Aluno("Pedro");

for (Turma.Aluno aluno : alunos) {
    aluno.exibir();
}
// João - Turma: A1
// Maria - Turma: A1
// Pedro - Turma: A1
```

### 8. Sintaxe com Coleções

**Coleções**: criar listas, sets, maps de inner classes.

```java
import java.util.*;

public class Biblioteca {
    private String nome;
    
    public Biblioteca(String nome) {
        this.nome = nome;
    }
    
    public class Livro {
        private String titulo;
        
        public Livro(String titulo) {
            this.titulo = titulo;
        }
        
        public void exibir() {
            System.out.println(nome + ": " + titulo);
        }
    }
}

// Lista de inner classes
Biblioteca biblioteca = new Biblioteca("Biblioteca Central");

List<Biblioteca.Livro> livros = new ArrayList<>();
livros.add(biblioteca.new Livro("Java Efetivo"));
livros.add(biblioteca.new Livro("Clean Code"));
livros.add(biblioteca.new Livro("Design Patterns"));

for (Biblioteca.Livro livro : livros) {
    livro.exibir();
}
// Biblioteca Central: Java Efetivo
// Biblioteca Central: Clean Code
// Biblioteca Central: Design Patterns
```

### 9. Sintaxe com Referência Externa.this

**Externa.this**: referência explícita à externa.

```java
public class Outer {
    private String valor = "Outer";
    
    public class Inner {
        private String valor = "Inner";
        
        public void exibir() {
            System.out.println("Valor local: " + valor);
            System.out.println("Valor externa: " + Outer.this.valor);
        }
    }
}

// Uso
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();

inner.exibir();
// Valor local: Inner
// Valor externa: Outer
```

### 10. Sintaxe com Herança

**Herança**: subclasse de inner class.

```java
public class Animal {
    protected String especie;
    
    public Animal(String especie) {
        this.especie = especie;
    }
    
    public class Som {
        protected String tipo;
        
        public Som(String tipo) {
            this.tipo = tipo;
        }
        
        public void emitir() {
            System.out.println(especie + " emite: " + tipo);
        }
    }
}

public class Cachorro extends Animal {
    public Cachorro() {
        super("Cachorro");
    }
    
    public class LatirSom extends Som {
        public LatirSom() {
            super("Latido");
        }
        
        public void emitir() {
            System.out.println("Au au! - " + tipo);
        }
    }
}

// Uso
Cachorro cachorro = new Cachorro();
Cachorro.LatirSom som = cachorro.new LatirSom();
som.emitir(); // Au au! - Latido
```

---

## Aplicabilidade

**Sintaxe externa.new Interna() usada em**:
- Iterator vinculado a coleção
- Builder vinculado a objeto
- Observer vinculado a observável
- Callbacks vinculados a componente
- Nós de estrutura de dados

---

## Armadilhas

### 1. Esquecer Instância Externa

```java
public class Outer {
    public class Inner { }
}

// ❌ ERRO: esquecer externa
// Outer.Inner inner = new Outer.Inner();

// ✅ Correto
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();
```

### 2. Confundir com Static Nested

```java
public class Example {
    // Static nested (independente)
    public static class Nested { }
    
    // Inner class (dependente)
    public class Inner { }
}

// Static: new Example.Nested()
Example.Nested nested = new Example.Nested();

// Inner: externa.new Inner()
Example ex = new Example();
Example.Inner inner = ex.new Inner();
```

### 3. Usar this em Static Context

```java
public class Outer {
    public class Inner { }
    
    public static void staticMethod() {
        // ❌ ERRO: 'this' não existe em contexto static
        // Inner inner = this.new Inner();
        
        // ✅ Criar outer primeiro
        Outer outer = new Outer();
        Inner inner = outer.new Inner();
    }
}
```

### 4. Sintaxe Incorreta

```java
public class Outer {
    public class Inner { }
}

// ❌ ERRO: sintaxe incorreta
// Outer.Inner inner = new Outer().Inner();

// ❌ ERRO: sintaxe incorreta
// Outer.Inner inner = Outer.new Inner();

// ✅ Correto
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();

// ✅ Ou encadeado
Outer.Inner inner2 = new Outer().new Inner();
```

### 5. Múltiplas Externas Misturadas

```java
public class Outer {
    public class Inner { }
}

Outer outer1 = new Outer();
Outer outer2 = new Outer();

// ⚠️ Cada inner vinculada a SUA externa
Outer.Inner inner1 = outer1.new Inner(); // vinculada a outer1
Outer.Inner inner2 = outer2.new Inner(); // vinculada a outer2

// ❌ NÃO MISTURE
// Outer.Inner inner3 = outer1.new outer2.Inner(); // ERRO
```

---

## Boas Práticas

### 1. Usar Variáveis para Clareza

```java
// ✅ Clareza: separar externa e inner
Empresa empresa = new Empresa("Google");
Empresa.Funcionario funcionario = empresa.new Funcionario("João");

// ❌ Menos claro: encadeado
Empresa.Funcionario funcionario2 = new Empresa("Google").new Funcionario("Maria");
```

### 2. Factory Method para Encapsular

```java
// ✅ Factory method na externa
public class Documento {
    private String titulo;
    
    public Documento(String titulo) {
        this.titulo = titulo;
    }
    
    public class Pagina {
        private int numero;
        
        private Pagina(int numero) {
            this.numero = numero;
        }
    }
    
    // Factory method
    public Pagina criarPagina(int numero) {
        return new Pagina(numero);
    }
}

// Uso simplificado
Documento doc = new Documento("Manual");
Documento.Pagina pag = doc.criarPagina(1);
```

### 3. Validar Externa no Construtor

```java
// ✅ Validar externa antes de criar inner
public class Container {
    private String nome;
    
    public Container(String nome) {
        if (nome == null || nome.isEmpty()) {
            throw new IllegalArgumentException("Nome obrigatório");
        }
        this.nome = nome;
    }
    
    public class Item {
        private String descricao;
        
        public Item(String descricao) {
            // Externa já validada
            if (descricao == null) {
                throw new IllegalArgumentException("Descrição obrigatória");
            }
            this.descricao = descricao;
        }
    }
}

// Uso
Container container = new Container("Container 1");
Container.Item item = container.new Item("Item A");
```

### 4. Documentar Sintaxe

```java
/**
 * Container de itens.
 */
public class Container {
    /**
     * Item do container.
     * 
     * <p>Para criar um item, use:
     * <pre>
     * Container container = new Container("nome");
     * Container.Item item = container.new Item("descricao");
     * </pre>
     */
    public class Item {
        public Item(String descricao) { }
    }
}
```

### 5. Evitar Sintaxe Encadeada Complexa

```java
// ❌ Evitar encadeamento complexo
Pedido.ItemPedido item = new Pedido(100, "Cliente")
    .new ItemPedido("Produto", 10);

// ✅ Preferir variáveis
Pedido pedido = new Pedido(100, "Cliente");
Pedido.ItemPedido item2 = pedido.new ItemPedido("Produto", 10);
```

### 6. Builder Pattern com Inner Class

```java
// ✅ Builder com sintaxe externa.new
public class Usuario {
    private String nome;
    private String email;
    
    private Usuario() { }
    
    public class Builder {
        public Builder nome(String nome) {
            Usuario.this.nome = nome;
            return this;
        }
        
        public Builder email(String email) {
            Usuario.this.email = email;
            return this;
        }
        
        public Usuario build() {
            return Usuario.this;
        }
    }
    
    public static Usuario.Builder builder() {
        return new Usuario().new Builder();
    }
}

// Uso
Usuario usuario = Usuario.builder()
    .nome("João")
    .email("joao@email.com")
    .build();
```

### 7. Iterator Pattern

```java
// ✅ Iterator com sintaxe externa.new
import java.util.*;

public class MinhaLista implements Iterable<String> {
    private String[] elementos;
    private int tamanho;
    
    public MinhaLista(String... elementos) {
        this.elementos = elementos;
        this.tamanho = elementos.length;
    }
    
    private class MeuIterator implements Iterator<String> {
        private int indice = 0;
        
        @Override
        public boolean hasNext() {
            return indice < tamanho;
        }
        
        @Override
        public String next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            return elementos[indice++];
        }
    }
    
    @Override
    public Iterator<String> iterator() {
        // Sintaxe: new MeuIterator()
        return new MeuIterator();
    }
}

// Uso
MinhaLista lista = new MinhaLista("A", "B", "C");
for (String elemento : lista) {
    System.out.println(elemento);
}
```

### 8. Callback com Sintaxe Externa

```java
// ✅ Callback com sintaxe externa.new
public interface ClickListener {
    void onClick();
}

public class Botao {
    private ClickListener listener;
    
    public void setOnClickListener(ClickListener listener) {
        this.listener = listener;
    }
    
    public void clicar() {
        if (listener != null) {
            listener.onClick();
        }
    }
}

public class Tela {
    private int contador = 0;
    
    private class MeuListener implements ClickListener {
        @Override
        public void onClick() {
            contador++;
            System.out.println("Cliques: " + contador);
        }
    }
    
    public void configurar() {
        Botao botao = new Botao();
        
        // Sintaxe: new MeuListener()
        botao.setOnClickListener(new MeuListener());
        
        botao.clicar(); // Cliques: 1
        botao.clicar(); // Cliques: 2
    }
}
```

### 9. Linked List com Sintaxe Externa

```java
// ✅ Nó de estrutura de dados
public class MinhaLinkedList {
    private No primeiro;
    private int tamanho;
    
    private class No {
        Object valor;
        No proximo;
        
        No(Object valor) {
            this.valor = valor;
        }
    }
    
    public void adicionar(Object valor) {
        // Sintaxe: new No(valor)
        No novo = new No(valor);
        
        if (primeiro == null) {
            primeiro = novo;
        } else {
            No atual = primeiro;
            while (atual.proximo != null) {
                atual = atual.proximo;
            }
            atual.proximo = novo;
        }
        tamanho++;
    }
}
```

### 10. Observer Pattern

```java
// ✅ Observer com sintaxe externa.new
import java.util.*;

public class Observavel {
    private List<Observer> observers = new ArrayList<>();
    
    public interface Observer {
        void atualizar(String mensagem);
    }
    
    public void addObserver(Observer observer) {
        observers.add(observer);
    }
    
    public void notificar(String mensagem) {
        for (Observer observer : observers) {
            observer.atualizar(mensagem);
        }
    }
}

public class Tela {
    private String status = "";
    
    private class StatusObserver implements Observavel.Observer {
        @Override
        public void atualizar(String mensagem) {
            status = mensagem;
            System.out.println("Status atualizado: " + status);
        }
    }
    
    public void configurar() {
        Observavel observavel = new Observavel();
        
        // Sintaxe: new StatusObserver()
        observavel.addObserver(new StatusObserver());
        
        observavel.notificar("Conectado");
    }
}
```

---

## Resumo

**Sintaxe**: `externa.new Interna()`.

```java
// Sintaxe básica
Externa externa = new Externa();
Externa.Interna interna = externa.new Interna();

// Sintaxe encadeada
Externa.Interna interna2 = new Externa().new Interna();

// Dentro da externa
public class Externa {
    public Item criar() {
        return new Item(); // Não precisa de externa.
    }
}
```

**Ordem**:
1. Criar instância de `Externa`
2. Usar referência para criar `Interna`

**Dentro da classe externa**: usar `new Interna()` diretamente.

**Array/Coleções**: `externa.new Interna()` para cada elemento.

**Múltiplas externas**: cada inner vinculada a SUA externa.

**Referência Externa.this**: acesso explícito à externa.

**Aplicabilidade**:
- Iterator
- Builder
- Observer
- Callbacks
- Estruturas de dados

**Boas práticas**:
- Usar variáveis para clareza
- Factory method para encapsular
- Validar externa no construtor
- Documentar sintaxe
- Evitar encadeamento complexo
- Builder pattern
- Iterator pattern
- Callback pattern
- Linked list
- Observer pattern

**Armadilhas**:
- ❌ Esquecer instância externa
- ❌ Confundir com static nested
- ❌ Usar this em static context
- ❌ Sintaxe incorreta
- ❌ Múltiplas externas misturadas

**Regra de Ouro**: Para criar **inner class**, sempre use sintaxe **`externa.new Interna()`**. Dentro da classe externa, use **`new Interna()`** diretamente (não precisa de referência). Cada inner está **vinculada** à instância externa que a criou. **Não confunda** com static nested class (`new Externa.Nested()`). Use **factory methods** para simplificar a criação. **Prefira variáveis** ao invés de encadeamento complexo. A sintaxe **deixa explícito** que inner depende de externa.
