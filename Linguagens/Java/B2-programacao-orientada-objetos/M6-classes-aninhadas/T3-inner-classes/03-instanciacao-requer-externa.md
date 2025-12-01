# T3.03 - Instanciação Requer Instância Externa

## Introdução

**Inner class**: SEMPRE precisa de instância da classe externa.

```java
public class Externa {
    private String nome = "Externa";
    
    public class Interna {
        public void exibir() {
            System.out.println("Nome: " + nome);
        }
    }
}

// ❌ ERRO: não pode instanciar sem Externa
// Externa.Interna interna = new Externa.Interna();

// ✅ Precisa de instância de Externa
Externa externa = new Externa();
Externa.Interna interna = externa.new Interna();
interna.exibir(); // Nome: Externa
```

**Dependência**: inner class vinculada à instância externa específica.

---

## Fundamentos

### 1. Sintaxe de Instanciação

**Sintaxe**: `externa.new Interna()`.

```java
public class Carro {
    private String marca;
    private String modelo;
    
    public Carro(String marca, String modelo) {
        this.marca = marca;
        this.modelo = modelo;
    }
    
    public class Motor {
        private int cilindros;
        
        public Motor(int cilindros) {
            this.cilindros = cilindros;
        }
        
        public void exibir() {
            System.out.println("Carro: " + marca + " " + modelo);
            System.out.println("Motor: " + cilindros + " cilindros");
        }
    }
}

// Instanciação
Carro carro = new Carro("Toyota", "Corolla");
Carro.Motor motor = carro.new Motor(4);
motor.exibir();
// Carro: Toyota Corolla
// Motor: 4 cilindros
```

### 2. Vinculação à Instância Externa

**Vinculação**: cada inner está ligada a uma externa específica.

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
            System.out.println(nomeFuncionario + " - " + nome);
        }
    }
}

// Duas empresas diferentes
Empresa empresa1 = new Empresa("Empresa A");
Empresa empresa2 = new Empresa("Empresa B");

// Funcionários vinculados a empresas diferentes
Empresa.Funcionario func1 = empresa1.new Funcionario("João");
Empresa.Funcionario func2 = empresa2.new Funcionario("Maria");

func1.exibir(); // João - Empresa A
func2.exibir(); // Maria - Empresa B
```

### 3. Múltiplas Instâncias da Mesma Externa

**Múltiplas inner**: várias inner classes da mesma externa.

```java
public class Lista {
    private String nome;
    
    public Lista(String nome) {
        this.nome = nome;
    }
    
    public class Iterador {
        public void iterar() {
            System.out.println("Iterando: " + nome);
        }
    }
}

// Uma lista, múltiplos iteradores
Lista lista = new Lista("Minha Lista");

Lista.Iterador iter1 = lista.new Iterador();
Lista.Iterador iter2 = lista.new Iterador();
Lista.Iterador iter3 = lista.new Iterador();

iter1.iterar(); // Iterando: Minha Lista
iter2.iterar(); // Iterando: Minha Lista
iter3.iterar(); // Iterando: Minha Lista
// Todas vinculadas à MESMA lista
```

### 4. Instanciação Dentro de Método

**Dentro da classe**: pode usar `new Interna()` diretamente.

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
            System.out.println("Documento: " + titulo);
            System.out.println("Página: " + numero);
        }
    }
    
    // Método da classe externa
    public Pagina criarPagina(int numero) {
        // ✅ Dentro da externa: 'new Pagina()'
        return new Pagina(numero);
    }
}

// Uso
Documento doc = new Documento("Manual");

// Forma 1: via método
Documento.Pagina pag1 = doc.criarPagina(1);

// Forma 2: diretamente
Documento.Pagina pag2 = doc.new Pagina(2);

pag1.exibir();
pag2.exibir();
```

### 5. Impossível Instanciar sem Externa

**Erro de compilação**: inner class sem externa.

```java
public class Externa {
    public class Interna {
        public void metodo() {
            System.out.println("Interna");
        }
    }
}

// ❌ ERRO DE COMPILAÇÃO
// Externa.Interna interna = new Externa.Interna();
// 'Externa.this' cannot be referenced from a static context

// ✅ Correto
Externa externa = new Externa();
Externa.Interna interna = externa.new Interna();
```

### 6. Static Method não Pode Instanciar

**Static method**: não pode criar inner class.

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
    }
    
    // Método static
    public static void metodoStatic() {
        // ❌ ERRO: não há 'this' em método static
        // Item item = new Item("teste");
        
        // ✅ Precisa criar Container primeiro
        Container container = new Container("Container");
        Item item = container.new Item("teste");
    }
}
```

### 7. Referência Externa Mantida

**Referência**: inner mantém referência à externa.

```java
public class Outer {
    private String valor = "Outer";
    
    public class Inner {
        public Outer getOuter() {
            // Retorna referência à externa
            return Outer.this;
        }
    }
}

// Uso
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();

Outer outerRef = inner.getOuter();
System.out.println(outer == outerRef); // true (mesma instância)
```

### 8. Herança de Inner Class

**Herança**: subclasse de inner class também precisa de externa.

```java
public class Base {
    protected String nome;
    
    public Base(String nome) {
        this.nome = nome;
    }
    
    public class InnerBase {
        public void exibir() {
            System.out.println("Base: " + nome);
        }
    }
}

public class Derivada extends Base {
    public Derivada(String nome) {
        super(nome);
    }
    
    // Subclasse de InnerBase
    public class InnerDerivada extends InnerBase {
        public void exibirExtra() {
            System.out.println("Derivada: " + nome);
        }
    }
}

// Uso
Derivada derivada = new Derivada("Teste");
Derivada.InnerDerivada inner = derivada.new InnerDerivada();

inner.exibir();      // Base: Teste
inner.exibirExtra(); // Derivada: Teste
```

### 9. Array de Inner Classes

**Array**: criar array de inner classes.

```java
public class Grupo {
    private String nome;
    
    public Grupo(String nome) {
        this.nome = nome;
    }
    
    public class Membro {
        private String nomeMembro;
        
        public Membro(String nomeMembro) {
            this.nomeMembro = nomeMembro;
        }
        
        public void exibir() {
            System.out.println(nomeMembro + " - Grupo: " + nome);
        }
    }
}

// Array de inner classes
Grupo grupo = new Grupo("Grupo A");

Grupo.Membro[] membros = new Grupo.Membro[3];
membros[0] = grupo.new Membro("João");
membros[1] = grupo.new Membro("Maria");
membros[2] = grupo.new Membro("Pedro");

for (Grupo.Membro membro : membros) {
    membro.exibir();
}
// João - Grupo: Grupo A
// Maria - Grupo: Grupo A
// Pedro - Grupo: Grupo A
```

### 10. Coleções de Inner Classes

**Coleções**: lista, set, map de inner classes.

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
            System.out.println(nome + " - " + descricao);
        }
    }
}

// Lista de tarefas
Projeto projeto = new Projeto("Projeto X");

List<Projeto.Tarefa> tarefas = new ArrayList<>();
tarefas.add(projeto.new Tarefa("Tarefa 1"));
tarefas.add(projeto.new Tarefa("Tarefa 2"));
tarefas.add(projeto.new Tarefa("Tarefa 3"));

for (Projeto.Tarefa tarefa : tarefas) {
    tarefa.exibir();
}
// Projeto X - Tarefa 1
// Projeto X - Tarefa 2
// Projeto X - Tarefa 3
```

---

## Aplicabilidade

**Instanciação com externa necessária para**:
- Iterator vinculado a coleção específica
- Builder vinculado a objeto sendo construído
- Observer vinculado a observável
- Nós de estrutura de dados
- Callbacks vinculados a componente

---

## Armadilhas

### 1. Esquecer Instância Externa

```java
public class Outer {
    public class Inner { }
}

// ❌ ERRO COMUM
// Outer.Inner inner = new Outer.Inner();

// ✅ Correto
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();
```

### 2. Confundir com Static Nested

```java
public class Exemplo {
    // Static nested (independente)
    public static class Nested { }
    
    // Inner class (dependente)
    public class Inner { }
}

// Static: não precisa de instância
Exemplo.Nested nested = new Exemplo.Nested();

// Inner: precisa de instância
Exemplo ex = new Exemplo();
Exemplo.Inner inner = ex.new Inner();
```

### 3. Tentar Instanciar em Static Context

```java
public class Outer {
    public class Inner { }
    
    public static void main(String[] args) {
        // ❌ ERRO: contexto static
        // Inner inner = new Inner();
        
        // ✅ Criar outer primeiro
        Outer outer = new Outer();
        Inner inner = outer.new Inner();
    }
}
```

### 4. Memory Leak com Referência

```java
// ⚠️ Inner mantém referência à outer
public class Activity {
    private byte[] dados = new byte[10000000]; // 10MB
    
    public class Task {
        public void executar() {
            // Task mantém Activity viva (memory leak)
        }
    }
}

// Task criada persiste e impede Activity de ser coletada
Activity activity = new Activity();
Activity.Task task = activity.new Task();
// activity = null; // Task ainda mantém referência
```

### 5. Serialização Complexa

```java
import java.io.*;

public class Outer implements Serializable {
    private String valor = "Outer";
    
    public class Inner implements Serializable {
        private String nome = "Inner";
    }
}

// ⚠️ Serializar Inner também serializa Outer
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();

// Serialização inclui outer inteira
ObjectOutputStream oos = new ObjectOutputStream(
    new FileOutputStream("inner.ser"));
oos.writeObject(inner);
```

---

## Boas Práticas

### 1. Factory Method na Externa

```java
// ✅ Factory method para criar inner
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
    
    // Factory
    public Pagina criarPagina(int numero) {
        return new Pagina(numero);
    }
}

// Uso simplificado
Documento doc = new Documento("Manual");
Documento.Pagina pag = doc.criarPagina(1);
```

### 2. Validar Externa Antes

```java
// ✅ Validar externa no construtor da inner
public class Container {
    private String nome;
    
    public Container(String nome) {
        if (nome == null) {
            throw new IllegalArgumentException("Nome obrigatório");
        }
        this.nome = nome;
    }
    
    public class Item {
        private String descricao;
        
        public Item(String descricao) {
            // Externa já foi validada
            this.descricao = descricao;
        }
    }
}
```

### 3. Documentar Dependência

```java
/**
 * Lista de elementos.
 */
public class Lista {
    /**
     * Iterador para esta lista.
     * 
     * <p>IMPORTANTE: Cada iterador está vinculado
     * à instância específica de Lista que o criou.
     */
    public class Iterador {
        public void iterar() { }
    }
    
    /**
     * Cria um novo iterador para esta lista.
     */
    public Iterador iterator() {
        return new Iterador();
    }
}
```

### 4. Evitar Instanciação Externa

```java
// ✅ Evitar expor inner para instanciação externa
public class Fila {
    private No primeiro;
    
    // Inner privada
    private class No {
        Object valor;
        No proximo;
    }
    
    public void adicionar(Object valor) {
        // Instancia internamente
        No novo = new No();
        novo.valor = valor;
        // ...
    }
}

// Não é possível criar No externamente (private)
```

### 5. WeakReference para Evitar Leak

```java
// ✅ WeakReference para tasks longas
public class Activity {
    private String nome;
    
    public static class Task {
        private WeakReference<Activity> activityRef;
        
        public Task(Activity activity) {
            this.activityRef = new WeakReference<>(activity);
        }
        
        public void executar() {
            Activity activity = activityRef.get();
            if (activity != null) {
                // Processar
            }
        }
    }
}
```

### 6. Iterator Pattern

```java
// ✅ Iterator vinculado à coleção
public class MinhaLista implements Iterable<Object> {
    private Object[] elementos;
    private int tamanho;
    
    // Inner class para iterator
    private class MeuIterator implements Iterator<Object> {
        private int indice = 0;
        
        @Override
        public boolean hasNext() {
            return indice < tamanho;
        }
        
        @Override
        public Object next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            return elementos[indice++];
        }
    }
    
    @Override
    public Iterator<Object> iterator() {
        return new MeuIterator();
    }
}

// Uso
MinhaLista lista = new MinhaLista();
Iterator<Object> iter = lista.iterator();
```

### 7. Builder Interno

```java
// ✅ Builder que modifica a externa
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
            if (nome == null) {
                throw new IllegalStateException("Nome obrigatório");
            }
            return Usuario.this;
        }
    }
    
    public static Builder builder() {
        return new Usuario().new Builder();
    }
}
```

### 8. Callback com Inner Class

```java
// ✅ Callback vinculado a componente
public class Botao {
    public interface ClickListener {
        void onClick();
    }
    
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
    
    // Inner class para callback
    private class MeuListener implements Botao.ClickListener {
        @Override
        public void onClick() {
            contador++; // Acessa campo de Tela
            System.out.println("Cliques: " + contador);
        }
    }
    
    public void configurar() {
        Botao botao = new Botao();
        botao.setOnClickListener(new MeuListener());
        botao.clicar();
    }
}
```

### 9. Limitar Número de Instâncias

```java
// ✅ Controlar número de inner classes criadas
public class Servidor {
    private int maxConexoes = 10;
    private int conexoesAtivas = 0;
    
    public class Conexao {
        private Conexao() {
            if (conexoesAtivas >= maxConexoes) {
                throw new IllegalStateException("Máximo de conexões atingido");
            }
            conexoesAtivas++;
        }
        
        public void fechar() {
            conexoesAtivas--;
        }
    }
    
    public Conexao criarConexao() {
        return new Conexao();
    }
}
```

### 10. Null-Safe com Externa

```java
// ✅ Verificar nulidade da externa
public class Container {
    private String nome;
    
    public class Item {
        public void exibir() {
            // Verificar se externa está válida
            if (Container.this.nome != null) {
                System.out.println("Container: " + Container.this.nome);
            } else {
                System.out.println("Container sem nome");
            }
        }
    }
}
```

---

## Resumo

**Inner class**: SEMPRE precisa de instância externa.

```java
// ❌ ERRO
// Externa.Interna interna = new Externa.Interna();

// ✅ Correto
Externa externa = new Externa();
Externa.Interna interna = externa.new Interna();
```

**Sintaxe**: `externa.new Interna()`.

**Vinculação**: cada inner vinculada a externa específica.

**Dentro da externa**: pode usar `new Interna()` diretamente.

**Static context**: não pode instanciar inner (sem `this`).

**Referência**: inner mantém referência à externa.

**Aplicabilidade**:
- Iterator
- Builder
- Observer
- Callbacks
- Nós de estrutura

**Boas práticas**:
- Factory method na externa
- Validar externa antes
- Documentar dependência
- Evitar instanciação externa (private)
- WeakReference para evitar leak
- Iterator pattern
- Builder interno
- Callback com inner
- Limitar instâncias
- Null-safe

**Armadilhas**:
- ❌ Esquecer instância externa
- ❌ Confundir com static nested
- ❌ Tentar instanciar em static context
- ❌ Memory leak com referência
- ❌ Serialização complexa

**Regra de Ouro**: **Inner classes** SEMPRE requerem **instância da classe externa** para serem criadas. Use sintaxe `externa.new Interna()`. Dentro da classe externa, use `new Interna()` diretamente. Cada inner está **vinculada** a uma externa específica. Cuidado com **memory leaks** - inner mantém referência à externa. Use **factory methods** para encapsular criação. Inner classes são ideais quando precisam estar **intimamente ligadas** à instância externa.
