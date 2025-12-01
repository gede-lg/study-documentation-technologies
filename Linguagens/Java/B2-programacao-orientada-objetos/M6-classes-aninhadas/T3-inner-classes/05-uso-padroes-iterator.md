# T3.05 - Uso em Padrões como Iterator

## Introdução

**Inner classes**: ideais para **Iterator**, **Observer**, **Builder** e outros padrões.

```java
import java.util.*;

public class MinhaLista implements Iterable<String> {
    private String[] elementos;
    private int tamanho;
    
    // Inner class para Iterator
    private class MeuIterator implements Iterator<String> {
        private int indice = 0;
        
        @Override
        public boolean hasNext() {
            return indice < tamanho;
        }
        
        @Override
        public String next() {
            return elementos[indice++];
        }
    }
    
    @Override
    public Iterator<String> iterator() {
        return new MeuIterator();
    }
}

// Uso
MinhaLista lista = new MinhaLista();
for (String elemento : lista) {
    System.out.println(elemento);
}
```

**Vantagem**: inner class acessa estrutura interna da coleção.

---

## Fundamentos

### 1. Iterator Pattern

**Iterator**: percorrer coleção sem expor implementação.

```java
import java.util.*;

public class MinhaColecao<T> implements Iterable<T> {
    private T[] elementos;
    private int tamanho;
    
    @SuppressWarnings("unchecked")
    public MinhaColecao(int capacidade) {
        elementos = (T[]) new Object[capacidade];
        tamanho = 0;
    }
    
    public void adicionar(T elemento) {
        if (tamanho < elementos.length) {
            elementos[tamanho++] = elemento;
        }
    }
    
    // Inner class para Iterator
    private class ColecaoIterator implements Iterator<T> {
        private int indice = 0;
        
        @Override
        public boolean hasNext() {
            return indice < tamanho;
        }
        
        @Override
        public T next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            return elementos[indice++];
        }
        
        @Override
        public void remove() {
            throw new UnsupportedOperationException("Remove não suportado");
        }
    }
    
    @Override
    public Iterator<T> iterator() {
        return new ColecaoIterator();
    }
}

// Uso
MinhaColecao<String> colecao = new MinhaColecao<>(10);
colecao.adicionar("A");
colecao.adicionar("B");
colecao.adicionar("C");

for (String elemento : colecao) {
    System.out.println(elemento);
}
// A
// B
// C
```

### 2. Linked List com Iterator

**Iterator**: navegação em lista encadeada.

```java
import java.util.*;

public class MinhaLinkedList<T> implements Iterable<T> {
    private No primeiro;
    private No ultimo;
    private int tamanho;
    
    // Nó privado
    private class No {
        T valor;
        No proximo;
        
        No(T valor) {
            this.valor = valor;
        }
    }
    
    public void adicionar(T valor) {
        No novo = new No(valor);
        if (primeiro == null) {
            primeiro = ultimo = novo;
        } else {
            ultimo.proximo = novo;
            ultimo = novo;
        }
        tamanho++;
    }
    
    // Iterator inner class
    private class LinkedListIterator implements Iterator<T> {
        private No atual = primeiro;
        
        @Override
        public boolean hasNext() {
            return atual != null;
        }
        
        @Override
        public T next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            T valor = atual.valor;
            atual = atual.proximo;
            return valor;
        }
    }
    
    @Override
    public Iterator<T> iterator() {
        return new LinkedListIterator();
    }
    
    public int size() {
        return tamanho;
    }
}

// Uso
MinhaLinkedList<Integer> lista = new MinhaLinkedList<>();
lista.adicionar(10);
lista.adicionar(20);
lista.adicionar(30);

for (int num : lista) {
    System.out.println(num);
}
// 10
// 20
// 30
```

### 3. Observer Pattern

**Observer**: notificar observadores de mudanças.

```java
import java.util.*;

public class Subject {
    private List<Observer> observers = new ArrayList<>();
    private String estado;
    
    // Interface do Observer
    public interface Observer {
        void atualizar(String novoEstado);
    }
    
    public void addObserver(Observer observer) {
        observers.add(observer);
    }
    
    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
        notificarObservers();
    }
    
    public String getEstado() {
        return estado;
    }
    
    private void notificarObservers() {
        for (Observer observer : observers) {
            observer.atualizar(estado);
        }
    }
}

public class Dashboard {
    private String statusExibido = "";
    
    // Observer como inner class
    private class StatusObserver implements Subject.Observer {
        @Override
        public void atualizar(String novoEstado) {
            statusExibido = novoEstado;
            System.out.println("Dashboard atualizado: " + statusExibido);
        }
    }
    
    public void conectar(Subject subject) {
        subject.addObserver(new StatusObserver());
    }
}

// Uso
Subject subject = new Subject();

Dashboard dashboard = new Dashboard();
dashboard.conectar(subject);

subject.setEstado("Online");  // Dashboard atualizado: Online
subject.setEstado("Offline"); // Dashboard atualizado: Offline
```

### 4. Builder Pattern

**Builder**: construção fluente de objetos complexos.

```java
public class Usuario {
    private String nome;
    private String email;
    private int idade;
    private String telefone;
    
    private Usuario() { }
    
    // Builder como inner class
    public static class Builder {
        private Usuario usuario;
        
        public Builder() {
            usuario = new Usuario();
        }
        
        public Builder nome(String nome) {
            usuario.nome = nome;
            return this;
        }
        
        public Builder email(String email) {
            usuario.email = email;
            return this;
        }
        
        public Builder idade(int idade) {
            usuario.idade = idade;
            return this;
        }
        
        public Builder telefone(String telefone) {
            usuario.telefone = telefone;
            return this;
        }
        
        public Usuario build() {
            if (usuario.nome == null || usuario.email == null) {
                throw new IllegalStateException("Nome e email obrigatórios");
            }
            return usuario;
        }
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    @Override
    public String toString() {
        return "Usuario{nome='" + nome + "', email='" + email + 
               "', idade=" + idade + ", telefone='" + telefone + "'}";
    }
}

// Uso
Usuario usuario = Usuario.builder()
    .nome("João Silva")
    .email("joao@email.com")
    .idade(30)
    .telefone("11-98765-4321")
    .build();

System.out.println(usuario);
```

### 5. Comparator Pattern

**Comparator**: ordenação customizada.

```java
import java.util.*;

public class Pessoa {
    private String nome;
    private int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
    
    // Comparator por idade (inner class)
    public static class ComparadorIdade implements Comparator<Pessoa> {
        @Override
        public int compare(Pessoa p1, Pessoa p2) {
            return Integer.compare(p1.idade, p2.idade);
        }
    }
    
    // Comparator por nome (inner class)
    public static class ComparadorNome implements Comparator<Pessoa> {
        @Override
        public int compare(Pessoa p1, Pessoa p2) {
            return p1.nome.compareTo(p2.nome);
        }
    }
    
    @Override
    public String toString() {
        return nome + " (" + idade + " anos)";
    }
}

// Uso
List<Pessoa> pessoas = Arrays.asList(
    new Pessoa("João", 30),
    new Pessoa("Maria", 25),
    new Pessoa("Pedro", 35)
);

// Ordenar por idade
Collections.sort(pessoas, new Pessoa.ComparadorIdade());
System.out.println(pessoas);
// [Maria (25 anos), João (30 anos), Pedro (35 anos)]

// Ordenar por nome
Collections.sort(pessoas, new Pessoa.ComparadorNome());
System.out.println(pessoas);
// [João (30 anos), Maria (25 anos), Pedro (35 anos)]
```

### 6. Strategy Pattern

**Strategy**: algoritmos intercambiáveis.

```java
public class Calculadora {
    // Interface para estratégia
    public interface Operacao {
        int calcular(int a, int b);
    }
    
    // Soma (inner class)
    public static class Soma implements Operacao {
        @Override
        public int calcular(int a, int b) {
            return a + b;
        }
    }
    
    // Subtração (inner class)
    public static class Subtracao implements Operacao {
        @Override
        public int calcular(int a, int b) {
            return a - b;
        }
    }
    
    // Multiplicação (inner class)
    public static class Multiplicacao implements Operacao {
        @Override
        public int calcular(int a, int b) {
            return a * b;
        }
    }
    
    // Divisão (inner class)
    public static class Divisao implements Operacao {
        @Override
        public int calcular(int a, int b) {
            if (b == 0) {
                throw new ArithmeticException("Divisão por zero");
            }
            return a / b;
        }
    }
    
    public int executar(int a, int b, Operacao operacao) {
        return operacao.calcular(a, b);
    }
}

// Uso
Calculadora calc = new Calculadora();

int soma = calc.executar(10, 5, new Calculadora.Soma());
int subtracao = calc.executar(10, 5, new Calculadora.Subtracao());
int multiplicacao = calc.executar(10, 5, new Calculadora.Multiplicacao());
int divisao = calc.executar(10, 5, new Calculadora.Divisao());

System.out.println("Soma: " + soma);              // Soma: 15
System.out.println("Subtração: " + subtracao);    // Subtração: 5
System.out.println("Multiplicação: " + multiplicacao); // Multiplicação: 50
System.out.println("Divisão: " + divisao);        // Divisão: 2
```

### 7. Callback Pattern

**Callback**: executar ação após evento.

```java
public class Botao {
    // Interface para callback
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

public class Formulario {
    private int contador = 0;
    
    // Callback como inner class
    private class BotaoListener implements Botao.ClickListener {
        @Override
        public void onClick() {
            contador++;
            System.out.println("Botão clicado " + contador + " vezes");
        }
    }
    
    public void configurar() {
        Botao botao = new Botao();
        botao.setOnClickListener(new BotaoListener());
        
        botao.clicar(); // Botão clicado 1 vezes
        botao.clicar(); // Botão clicado 2 vezes
        botao.clicar(); // Botão clicado 3 vezes
    }
}

// Uso
Formulario form = new Formulario();
form.configurar();
```

### 8. Template Method Pattern

**Template Method**: algoritmo base com passos customizáveis.

```java
public abstract class ProcessadorPedido {
    // Template method
    public final void processar() {
        validar();
        calcularTotal();
        aplicarDesconto();
        finalizarPedido();
    }
    
    protected abstract void validar();
    protected abstract void calcularTotal();
    protected abstract void aplicarDesconto();
    protected abstract void finalizarPedido();
}

public class Loja {
    private double total = 0;
    private double desconto = 0;
    
    // Template Method implementado como inner class
    private class ProcessadorPedidoLoja extends ProcessadorPedido {
        @Override
        protected void validar() {
            System.out.println("Validando pedido...");
        }
        
        @Override
        protected void calcularTotal() {
            total = 100.0;
            System.out.println("Total calculado: R$ " + total);
        }
        
        @Override
        protected void aplicarDesconto() {
            desconto = total * 0.1;
            total -= desconto;
            System.out.println("Desconto aplicado: R$ " + desconto);
        }
        
        @Override
        protected void finalizarPedido() {
            System.out.println("Pedido finalizado. Total: R$ " + total);
        }
    }
    
    public void processarPedido() {
        ProcessadorPedido processador = new ProcessadorPedidoLoja();
        processador.processar();
    }
}

// Uso
Loja loja = new Loja();
loja.processarPedido();
// Validando pedido...
// Total calculado: R$ 100.0
// Desconto aplicado: R$ 10.0
// Pedido finalizado. Total: R$ 90.0
```

### 9. Adapter Pattern

**Adapter**: adaptar interface incompatível.

```java
// Interface esperada
public interface Reprodutor {
    void play(String arquivo);
}

// Classe existente incompatível
public class MP3Player {
    public void playMP3(String arquivo) {
        System.out.println("Tocando MP3: " + arquivo);
    }
}

public class MediaPlayer implements Reprodutor {
    // Adapter como inner class
    private class MP3Adapter {
        private MP3Player mp3Player = new MP3Player();
        
        public void reproduzir(String arquivo) {
            mp3Player.playMP3(arquivo);
        }
    }
    
    private MP3Adapter adapter = new MP3Adapter();
    
    @Override
    public void play(String arquivo) {
        adapter.reproduzir(arquivo);
    }
}

// Uso
Reprodutor reprodutor = new MediaPlayer();
reprodutor.play("musica.mp3"); // Tocando MP3: musica.mp3
```

### 10. State Pattern

**State**: mudar comportamento com base no estado.

```java
public class Conexao {
    // Interface de estado
    public interface Estado {
        void conectar();
        void desconectar();
    }
    
    private Estado estado;
    
    // Estado conectado (inner class)
    private class Conectado implements Estado {
        @Override
        public void conectar() {
            System.out.println("Já está conectado");
        }
        
        @Override
        public void desconectar() {
            System.out.println("Desconectando...");
            estado = new Desconectado();
        }
    }
    
    // Estado desconectado (inner class)
    private class Desconectado implements Estado {
        @Override
        public void conectar() {
            System.out.println("Conectando...");
            estado = new Conectado();
        }
        
        @Override
        public void desconectar() {
            System.out.println("Já está desconectado");
        }
    }
    
    public Conexao() {
        estado = new Desconectado();
    }
    
    public void conectar() {
        estado.conectar();
    }
    
    public void desconectar() {
        estado.desconectar();
    }
}

// Uso
Conexao conexao = new Conexao();

conexao.conectar();    // Conectando...
conexao.conectar();    // Já está conectado
conexao.desconectar(); // Desconectando...
conexao.desconectar(); // Já está desconectado
```

---

## Aplicabilidade

**Inner classes são ideais para**:
- **Iterator**: navegar coleções
- **Observer**: notificar mudanças
- **Builder**: construção fluente
- **Comparator**: ordenação customizada
- **Strategy**: algoritmos intercambiáveis
- **Callback**: executar após evento
- **Template Method**: passos customizáveis
- **Adapter**: adaptar interfaces
- **State**: mudar comportamento

---

## Armadilhas

### 1. Memory Leak com Observer

```java
// ⚠️ Observer como inner class não-static
public class Activity {
    private Subject subject;
    
    // ❌ Inner class mantém Activity viva
    private class Listener implements Subject.Observer {
        public void atualizar(String estado) {
            // ...
        }
    }
    
    public void onCreate() {
        subject = new Subject();
        subject.addObserver(new Listener()); // Memory leak
    }
    
    // ✅ Remover observer ao destruir
    public void onDestroy() {
        // subject.removeObserver(listener);
    }
}
```

### 2. Iterator Concurrent Modification

```java
// ⚠️ Modificar coleção durante iteração
public class MinhaLista<T> implements Iterable<T> {
    private List<T> elementos = new ArrayList<>();
    
    private class MeuIterator implements Iterator<T> {
        private int indice = 0;
        
        public boolean hasNext() {
            return indice < elementos.size();
        }
        
        public T next() {
            // ⚠️ Se elementos foi modificada, pode lançar exceção
            return elementos.get(indice++);
        }
    }
}

// ❌ ConcurrentModificationException
MinhaLista<String> lista = new MinhaLista<>();
lista.adicionar("A");

for (String s : lista) {
    lista.adicionar("B"); // ERRO
}
```

### 3. Builder State Compartilhado

```java
// ⚠️ Builder compartilha estado com objeto
public class Usuario {
    private String nome;
    
    public class Builder {
        public Builder nome(String nome) {
            Usuario.this.nome = nome; // Modifica externa
            return this;
        }
        
        public Usuario build() {
            return Usuario.this;
        }
    }
}

// ❌ Problemas com múltiplos builds
Usuario usuario = new Usuario();
Usuario.Builder builder = usuario.new Builder();

Usuario u1 = builder.nome("João").build();
Usuario u2 = builder.nome("Maria").build();

// u1 e u2 são o MESMO objeto (externa)
System.out.println(u1 == u2); // true
```

### 4. Callback não Removido

```java
// ⚠️ Callback nunca removido causa leak
public class Service {
    private List<Callback> callbacks = new ArrayList<>();
    
    public void addCallback(Callback callback) {
        callbacks.add(callback);
    }
    
    // ❌ Sem método removeCallback
}

// Activity cria callback mas nunca remove
public class Activity {
    public void onCreate() {
        Service service = new Service();
        service.addCallback(new MyCallback());
        // ❌ Callback nunca removido, Activity nunca é coletada
    }
}
```

### 5. State sem Singleton

```java
// ⚠️ Criar novo estado toda vez
public class Conexao {
    private Estado estado;
    
    private class Conectado implements Estado { }
    private class Desconectado implements Estado { }
    
    public void conectar() {
        // ❌ Cria novo objeto toda vez
        estado = new Conectado();
    }
    
    public void desconectar() {
        // ❌ Cria novo objeto toda vez
        estado = new Desconectado();
    }
}
```

---

## Boas Práticas

### 1. Iterator com Fail-Fast

```java
// ✅ Detectar modificação concorrente
import java.util.*;

public class MinhaLista<T> implements Iterable<T> {
    private List<T> elementos = new ArrayList<>();
    private int modificacoes = 0;
    
    public void adicionar(T elemento) {
        elementos.add(elemento);
        modificacoes++;
    }
    
    private class SafeIterator implements Iterator<T> {
        private int modificacoesEsperadas = modificacoes;
        private int indice = 0;
        
        private void verificarModificacao() {
            if (modificacoesEsperadas != modificacoes) {
                throw new ConcurrentModificationException();
            }
        }
        
        @Override
        public boolean hasNext() {
            verificarModificacao();
            return indice < elementos.size();
        }
        
        @Override
        public T next() {
            verificarModificacao();
            return elementos.get(indice++);
        }
    }
    
    @Override
    public Iterator<T> iterator() {
        return new SafeIterator();
    }
}
```

### 2. Observer com WeakReference

```java
// ✅ WeakReference evita memory leak
import java.lang.ref.WeakReference;
import java.util.*;

public class Subject {
    private List<WeakReference<Observer>> observers = new ArrayList<>();
    
    public interface Observer {
        void atualizar(String estado);
    }
    
    public void addObserver(Observer observer) {
        observers.add(new WeakReference<>(observer));
    }
    
    public void notificar(String estado) {
        // Remover referências nulas
        observers.removeIf(ref -> ref.get() == null);
        
        for (WeakReference<Observer> ref : observers) {
            Observer observer = ref.get();
            if (observer != null) {
                observer.atualizar(estado);
            }
        }
    }
}
```

### 3. Builder com Nova Instância

```java
// ✅ Builder cria nova instância
public class Usuario {
    private String nome;
    private String email;
    
    private Usuario() { }
    
    public static class Builder {
        private String nome;
        private String email;
        
        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Usuario build() {
            Usuario usuario = new Usuario();
            usuario.nome = this.nome;
            usuario.email = this.email;
            return usuario;
        }
    }
}
```

### 4. Callback com Unregister

```java
// ✅ Sempre permitir remover callback
public class Service {
    private List<Callback> callbacks = new ArrayList<>();
    
    public interface Callback {
        void onEvent(String data);
    }
    
    public void addCallback(Callback callback) {
        callbacks.add(callback);
    }
    
    public void removeCallback(Callback callback) {
        callbacks.remove(callback);
    }
    
    public void dispararEvento(String data) {
        for (Callback callback : callbacks) {
            callback.onEvent(data);
        }
    }
}

// Activity remove callback ao destruir
public class Activity {
    private Service.Callback callback;
    
    public void onCreate() {
        Service service = new Service();
        callback = new MyCallback();
        service.addCallback(callback);
    }
    
    public void onDestroy() {
        service.removeCallback(callback); // ✅ Remover
    }
}
```

### 5. State com Singleton

```java
// ✅ Reusar instâncias de estado
public class Conexao {
    private Estado estado;
    
    // Singleton para estados
    private final Estado conectado = new Conectado();
    private final Estado desconectado = new Desconectado();
    
    public Conexao() {
        estado = desconectado;
    }
    
    private class Conectado implements Estado {
        public void conectar() { }
        public void desconectar() {
            estado = desconectado;
        }
    }
    
    private class Desconectado implements Estado {
        public void conectar() {
            estado = conectado;
        }
        public void desconectar() { }
    }
}
```

---

## Resumo

**Inner classes** são ideais para **padrões de design**:

**Iterator**: navegação em coleções
```java
private class MeuIterator implements Iterator<T> {
    public boolean hasNext() { return indice < tamanho; }
    public T next() { return elementos[indice++]; }
}
```

**Observer**: notificação de mudanças
```java
private class Listener implements Subject.Observer {
    public void atualizar(String estado) { ... }
}
```

**Builder**: construção fluente
```java
public static class Builder {
    public Builder nome(String nome) { return this; }
    public Usuario build() { return new Usuario(); }
}
```

**Strategy**: algoritmos intercambiáveis
```java
public static class Soma implements Operacao {
    public int calcular(int a, int b) { return a + b; }
}
```

**Callback**: executar após evento
```java
private class ClickListener implements Botao.ClickListener {
    public void onClick() { contador++; }
}
```

**Boas práticas**:
- Iterator com fail-fast (ConcurrentModificationException)
- Observer com WeakReference
- Builder cria nova instância
- Callback com unregister
- State com singleton

**Armadilhas**:
- ❌ Memory leak com observer
- ❌ Concurrent modification em iterator
- ❌ Builder compartilha estado
- ❌ Callback não removido
- ❌ State sem singleton

**Regra de Ouro**: Inner classes são **perfeitas** para **padrões** que precisam **acessar o estado** da classe externa. Use em **Iterator** (acessa estrutura interna), **Observer** (atualiza estado), **Builder** (modifica objeto), **Callback** (acessa contexto), **Strategy** (compartilha dados). **Cuidado** com **memory leaks** - remova listeners/observers. Use **WeakReference** em observers. Builder deve criar **nova instância**. Estados devem ser **singleton**. Iterator deve detectar **modificação concorrente**.
