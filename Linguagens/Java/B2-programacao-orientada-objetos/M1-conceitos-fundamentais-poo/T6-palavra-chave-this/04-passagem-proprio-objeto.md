# T6.04 - Passagem do Próprio Objeto como Argumento (this)

## Introdução e Definição

Uma das aplicações práticas da palavra-chave **`this`** em Java é **passar o próprio objeto** (a instância atual) como argumento para outros métodos. Quando você escreve `this` como parâmetro em uma chamada de método, está passando uma **referência ao objeto atual** para que o método receptor possa manipulá-lo, armazená-lo, ou interagir com ele.

Esse padrão é extremamente comum em diversas situações:
- **Registro de objetos**: Registrar o próprio objeto em um gerenciador, coleção ou sistema.
- **Observer pattern**: Um objeto se registra como observador de eventos.
- **Callback**: Passar o próprio objeto como "callback" para ser notificado quando algo acontecer.
- **Comparação**: Passar o próprio objeto para ser comparado com outros (em métodos como `equals()`, `compareTo()`).
- **Encadeamento de operações**: Permitir que outros objetos manipulem ou processem a instância atual.

**Sintaxe**:
```java
public class Funcionario {
    private String nome;

    public Funcionario(String nome) {
        this.nome = nome;
    }

    public void registrar(SistemaRH sistema) {
        // Passa o próprio objeto Funcionario para o sistema
        sistema.adicionar(this);
    }

    public String getNome() {
        return nome;
    }
}

public class SistemaRH {
    private List<Funcionario> funcionarios = new ArrayList<>();

    public void adicionar(Funcionario funcionario) {
        funcionarios.add(funcionario);
        System.out.println("Funcionário " + funcionario.getNome() + " registrado");
    }
}

// Uso:
Funcionario f = new Funcionario("Ana");
SistemaRH sistema = new SistemaRH();
f.registrar(sistema); // Passa 'f' (this) para sistema.adicionar()
```

Aqui, `this` dentro de `registrar()` é a referência ao próprio objeto `Funcionario`, que é passado para `sistema.adicionar()`.

---

## 10 Fundamentos Teóricos

### 1. this Como Referência Passável

`this` é uma **referência** como qualquer outra variável de referência em Java. Você pode:
- Passá-la como argumento para métodos
- Retorná-la de métodos
- Armazená-la em variáveis ou coleções
- Compará-la com outras referências

```java
public class Exemplo {
    public void processar(Gerenciador g) {
        g.registrar(this); // Passa a própria instância
    }

    public Exemplo obterReferencia() {
        return this; // Retorna a própria instância
    }

    public boolean comparar(Exemplo outro) {
        return this == outro; // Compara referências
    }
}
```

---

### 2. Registro em Gerenciadores e Coleções

Um padrão comum é um objeto se "auto-registrar" em um gerenciador, sistema ou coleção passando `this`.

```java
public class Tarefa {
    private String descricao;

    public Tarefa(String descricao) {
        this.descricao = descricao;
    }

    public void agendar(Agendador agendador) {
        // Registra a própria tarefa no agendador
        agendador.adicionar(this);
    }

    public void executar() {
        System.out.println("Executando: " + descricao);
    }
}

public class Agendador {
    private List<Tarefa> tarefas = new ArrayList<>();

    public void adicionar(Tarefa tarefa) {
        tarefas.add(tarefa);
    }

    public void executarTodas() {
        for (Tarefa t : tarefas) {
            t.executar();
        }
    }
}

// Uso:
Agendador agendador = new Agendador();
Tarefa t1 = new Tarefa("Backup");
Tarefa t2 = new Tarefa("Relatório");

t1.agendar(agendador); // t1 passa a si mesmo
t2.agendar(agendador); // t2 passa a si mesmo

agendador.executarTodas();
```

---

### 3. Observer Pattern: Registrando Observadores

No **padrão Observer**, objetos se registram como observadores de eventos em um "subject" (sujeito observável), passando `this`.

```java
public interface Observador {
    void atualizar(String mensagem);
}

public class Usuario implements Observador {
    private String nome;

    public Usuario(String nome) {
        this.nome = nome;
    }

    public void inscrever(Notificador notificador) {
        // Passa a si mesmo como observador
        notificador.registrarObservador(this);
    }

    @Override
    public void atualizar(String mensagem) {
        System.out.println(nome + " recebeu: " + mensagem);
    }
}

public class Notificador {
    private List<Observador> observadores = new ArrayList<>();

    public void registrarObservador(Observador obs) {
        observadores.add(obs);
    }

    public void notificar(String mensagem) {
        for (Observador obs : observadores) {
            obs.atualizar(mensagem);
        }
    }
}

// Uso:
Notificador notificador = new Notificador();
Usuario u1 = new Usuario("Ana");
Usuario u2 = new Usuario("João");

u1.inscrever(notificador); // u1 passa this
u2.inscrever(notificador); // u2 passa this

notificador.notificar("Novo produto disponível!");
// Ana recebeu: Novo produto disponível!
// João recebeu: Novo produto disponível!
```

---

### 4. Callback: Passando this Para Ser Chamado de Volta

Em **callbacks**, um objeto passa `this` para outro método, que o chama de volta (invoca seus métodos) quando algo acontece.

```java
public interface Callback {
    void onComplete(String resultado);
}

public class Cliente implements Callback {
    private String nome;

    public Cliente(String nome) {
        this.nome = nome;
    }

    public void fazerRequisicao(Servidor servidor) {
        System.out.println(nome + " enviando requisição...");
        // Passa a si mesmo como callback
        servidor.processar("dados", this);
    }

    @Override
    public void onComplete(String resultado) {
        System.out.println(nome + " recebeu resposta: " + resultado);
    }
}

public class Servidor {
    public void processar(String dados, Callback callback) {
        // Simula processamento
        System.out.println("Servidor processando: " + dados);
        String resultado = dados.toUpperCase();
        
        // Chama de volta o callback
        callback.onComplete(resultado);
    }
}

// Uso:
Servidor servidor = new Servidor();
Cliente cliente = new Cliente("Ana");

cliente.fazerRequisicao(servidor);
// Ana enviando requisição...
// Servidor processando: dados
// Ana recebeu resposta: DADOS
```

---

### 5. Passando this em Métodos equals() e compareTo()

Métodos como `equals()` e `compareTo()` frequentemente usam `this` implicitamente para comparar o objeto atual com outro objeto.

```java
public class Pessoa {
    private String nome;
    private int idade;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true; // Mesma referência
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Pessoa outra = (Pessoa) obj;
        // Compara atributos de 'this' com 'outra'
        return this.idade == outra.idade && 
               this.nome.equals(outra.nome);
    }
}
```

Aqui, `this` representa o objeto atual sendo comparado com `obj`.

---

### 6. Passando this Para Métodos de Utilidade

Você pode passar `this` para métodos utilitários que processam ou validam o objeto.

```java
public class Produto {
    private String nome;
    private double preco;

    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
        // Passa o próprio objeto para validação
        Validador.validar(this);
    }

    public String getNome() { return nome; }
    public double getPreco() { return preco; }
}

public class Validador {
    public static void validar(Produto produto) {
        if (produto.getNome() == null || produto.getNome().isEmpty()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        if (produto.getPreco() < 0) {
            throw new IllegalArgumentException("Preço inválido");
        }
    }
}
```

---

### 7. Event Listeners e GUI

Em interfaces gráficas (GUI), componentes frequentemente passam `this` ao se registrar como listeners de eventos.

```java
public class Botao {
    private List<ClickListener> listeners = new ArrayList<>();

    public void adicionarListener(ClickListener listener) {
        listeners.add(listener);
    }

    public void clicar() {
        for (ClickListener listener : listeners) {
            listener.onClick();
        }
    }
}

public interface ClickListener {
    void onClick();
}

public class Janela implements ClickListener {
    private Botao botao;

    public Janela() {
        botao = new Botao();
        // Passa a si mesma como listener
        botao.adicionarListener(this);
    }

    @Override
    public void onClick() {
        System.out.println("Botão clicado na janela!");
    }
}
```

---

### 8. Passando this Para Builder ou Factory

Em padrões como **Builder** ou **Factory**, você pode passar `this` para que o builder/factory configure o objeto.

```java
public class Relatorio {
    private String titulo;
    private String conteudo;

    public void configurar(RelatorioBuilder builder) {
        // Passa a si mesmo para o builder configurar
        builder.configurar(this);
    }

    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }

    public void exibir() {
        System.out.println("Título: " + titulo);
        System.out.println("Conteúdo: " + conteudo);
    }
}

public class RelatorioBuilder {
    public void configurar(Relatorio relatorio) {
        relatorio.setTitulo("Relatório Mensal");
        relatorio.setConteudo("Dados do mês...");
    }
}

// Uso:
Relatorio relatorio = new Relatorio();
RelatorioBuilder builder = new RelatorioBuilder();
relatorio.configurar(builder);
relatorio.exibir();
```

---

### 9. Armazenando this em Variáveis ou Atributos

Você pode armazenar `this` em uma variável ou atributo para uso posterior, embora seja menos comum.

```java
public class Exemplo {
    private Exemplo autoReferencia;

    public Exemplo() {
        // Armazena referência a si mesmo
        this.autoReferencia = this;
    }

    public Exemplo obterReferencia() {
        return autoReferencia; // Retorna a própria instância
    }
}
```

**Cuidado**: Armazenar `this` pode criar referências circulares ou dificultar garbage collection em alguns cenários.

---

### 10. Passando this em Chamadas Encadeadas

Ao passar `this` para métodos de outros objetos, você pode criar **chamadas encadeadas** onde múltiplos objetos interagem.

```java
public class PedidoBuilder {
    private Pedido pedido = new Pedido();

    public PedidoBuilder adicionarItem(String item) {
        pedido.addItem(item);
        return this; // Retorna si mesmo para encadeamento
    }

    public Pedido construir(SistemaVendas sistema) {
        // Passa o pedido construído para o sistema
        sistema.registrar(pedido);
        return pedido;
    }
}

// Uso:
PedidoBuilder builder = new PedidoBuilder();
Pedido p = builder
    .adicionarItem("Livro")
    .adicionarItem("Caneta")
    .construir(sistema);
```

---

## Aplicabilidade

### Quando Passar this Como Argumento

1. **Registro em Sistemas**: Registrar o próprio objeto em gerenciadores, coleções ou sistemas.
   ```java
   sistema.adicionar(this);
   ```

2. **Observer Pattern**: Inscrever-se como observador de eventos.
   ```java
   notificador.registrarObservador(this);
   ```

3. **Callback**: Passar o próprio objeto para ser "chamado de volta" quando algo acontecer.
   ```java
   servidor.processar(dados, this);
   ```

4. **Comparação**: Passar o próprio objeto para métodos de comparação (`equals()`, `compareTo()`).
   ```java
   if (this.equals(outro)) { ... }
   ```

5. **Event Listeners**: Registrar-se como listener de eventos em GUI ou sistemas de eventos.
   ```java
   botao.adicionarListener(this);
   ```

6. **Validação Externa**: Passar o próprio objeto para validadores ou processadores externos.
   ```java
   Validador.validar(this);
   ```

7. **Builder/Factory**: Permitir que builders ou factories configurem o próprio objeto.
   ```java
   builder.configurar(this);
   ```

### Quando NÃO Passar this

1. **Expor Implementação Interna**: Evite passar `this` se isso expuser detalhes internos que devem ser privados.
2. **Segurança**: Não passe `this` para código não confiável que possa manipular o objeto de forma inadequada.
3. **Imutabilidade**: Objetos imutáveis geralmente não passam `this` para evitar modificações externas.

---

## Armadilhas Comuns

### 1. Passar this em Construtores (Escape de Referência)

Passar `this` em um construtor **antes** do objeto estar totalmente inicializado é perigoso (**reference escape**).

```java
public class Perigoso {
    private int valor;

    public Perigoso(Gerenciador g) {
        g.registrar(this); // PERIGOSO: this ainda não está totalmente inicializado!
        this.valor = 100;  // Inicialização ocorre APÓS passar this
    }
}
```

**Problema**: Outro código pode acessar o objeto via `this` antes de `valor` ser inicializado, vendo valor padrão (0).

**Solução**: Evite passar `this` em construtores, ou garanta que o objeto esteja totalmente inicializado antes.

```java
public Perigoso(Gerenciador g) {
    this.valor = 100;  // Inicializa PRIMEIRO
    g.registrar(this); // Passa this APÓS inicialização completa
}
```

---

### 2. Referências Circulares e Memory Leak

Armazenar `this` em outros objetos pode criar **referências circulares**, dificultando garbage collection.

```java
public class A {
    private B b;
    
    public A() {
        b = new B(this); // B mantém referência para A
    }
}

public class B {
    private A a;
    
    public B(A a) {
        this.a = a; // Referência circular: A → B → A
    }
}
```

**Problema**: Se A e B apontam um para o outro, ambos podem não ser coletados pelo GC.

**Solução**: Use **weak references** (`WeakReference`) quando apropriado, ou garanta que as referências sejam limpas quando não mais necessárias.

---

### 3. Thread-Safety: Passar this em Ambientes Concorrentes

Passar `this` para outros threads antes do objeto estar completamente inicializado pode causar problemas de visibilidade em concorrência.

```java
public class Perigoso {
    private int valor;

    public Perigoso() {
        new Thread(() -> {
            // Acessa 'this' em outro thread
            System.out.println(this.valor); // Pode ver valor não inicializado!
        }).start();
        
        this.valor = 100;
    }
}
```

**Solução**: Garanta inicialização completa antes de passar `this` para outros threads, ou use mecanismos de sincronização.

---

### 4. Exposição de Mutabilidade

Passar `this` pode permitir que código externo modifique o estado do objeto de forma indesejada.

```java
public class Produto {
    private double preco;

    public void processar(Processador p) {
        p.processar(this); // Processador pode modificar 'preco' via setters
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }
}
```

**Solução**: Se o objeto deve ser imutável, não forneça setters ou não passe `this` para código não confiável.

---

### 5. Confundir this com super

`this` passa o próprio objeto, enquanto `super` não é uma referência passável (refere-se a membros da superclasse).

```java
public class Filho extends Pai {
    public void metodo() {
        processar(this);  // OK: Passa referência ao objeto Filho
        // processar(super); // ERRO: super não é uma referência
    }
}
```

---

## Boas Práticas

### 1. Evite Passar this em Construtores

Sempre que possível, evite passar `this` em construtores para prevenir **reference escape**.

```java
// Evitar
public Exemplo(Gerenciador g) {
    g.registrar(this); // Perigoso se objeto não estiver totalmente inicializado
}

// Preferir: Método separado
public Exemplo() {
    // Inicializa completamente
}

public void registrar(Gerenciador g) {
    g.registrar(this); // Objeto já totalmente inicializado
}
```

---

### 2. Garanta Inicialização Completa Antes de Passar this

Se precisar passar `this` em um construtor, garanta que todos os atributos estejam inicializados antes.

```java
public Exemplo(Gerenciador g) {
    this.atributo1 = valor1;
    this.atributo2 = valor2;
    // Todos os atributos inicializados
    g.registrar(this); // Agora é seguro
}
```

---

### 3. Use Interfaces Para Callbacks e Listeners

Quando passar `this` como callback ou listener, implemente uma interface para deixar claro o contrato.

```java
public class Cliente implements Callback {
    public void executar(Servidor s) {
        s.processar(this); // Claro que Cliente é um Callback
    }
}
```

---

### 4. Documente Quando this é Armazenado

Se um método que recebe `this` o armazena (em vez de apenas usá-lo temporariamente), documente isso claramente.

```java
/**
 * Registra o observador. O observador será mantido em memória até ser removido.
 * @param obs Observador a ser registrado (referência armazenada)
 */
public void registrarObservador(Observador obs) {
    this.observadores.add(obs); // Armazena referência
}
```

---

### 5. Cuidado com Thread-Safety

Ao passar `this` para outros threads, garanta visibilidade correta usando sincronização ou `volatile`.

```java
public class ThreadSafe {
    private volatile int valor;

    public ThreadSafe() {
        this.valor = 100;
        // Agora seguro passar para outro thread
        new Thread(() -> processar(this)).start();
    }
}
```

---

### 6. Use Weak References Para Evitar Memory Leaks

Se armazenar `this` em coleções de longa duração, considere usar `WeakReference` para permitir garbage collection.

```java
public class Gerenciador {
    private List<WeakReference<Objeto>> objetos = new ArrayList<>();

    public void adicionar(Objeto obj) {
        objetos.add(new WeakReference<>(obj)); // Permite GC do objeto
    }
}
```

---

### 7. Evite Expor this em APIs Públicas

Não retorne ou passe `this` em APIs públicas se isso permitir modificações indesejadas.

```java
// Evitar
public Exemplo obterInstancia() {
    return this; // Permite modificações externas
}

// Preferir: Retornar cópia ou wrapper imutável
public ExemploDTO obterDados() {
    return new ExemploDTO(this.dados); // Cópia dos dados
}
```

---

### 8. Valide Parâmetros em Métodos Que Recebem Objetos

Quando um método recebe um objeto via `this`, valide-o adequadamente.

```java
public void registrar(Objeto obj) {
    if (obj == null) {
        throw new IllegalArgumentException("Objeto não pode ser nulo");
    }
    this.objetos.add(obj);
}
```

---

### 9. Use this Explicitamente Para Clareza

Quando passar `this`, use-o explicitamente para deixar claro que é o próprio objeto.

```java
sistema.adicionar(this); // Claro que está passando o próprio objeto
```

---

### 10. Considere Imutabilidade

Objetos imutáveis podem passar `this` com mais segurança, pois não podem ser modificados externamente.

```java
public final class Imutavel {
    private final String valor;

    public Imutavel(String valor) {
        this.valor = valor;
    }

    public void processar(Processador p) {
        p.processar(this); // Seguro: Imutavel não pode ser modificado
    }
}
```

---

## Resumo Executivo

Passar **`this`** como argumento permite que um objeto **passe a si mesmo** para outros métodos, possibilitando que esses métodos manipulem, armazenem ou interajam com o objeto atual. Esse padrão é amplamente usado em:
- **Registro de objetos**: `sistema.adicionar(this)`
- **Observer pattern**: `notificador.registrarObservador(this)`
- **Callbacks**: `servidor.processar(dados, this)`
- **Event listeners**: `botao.adicionarListener(this)`
- **Comparação**: `equals(outro)` usa `this` implicitamente

**Sintaxe**:
```java
public void metodo(Gerenciador g) {
    g.processar(this); // Passa o próprio objeto
}
```

**Benefícios**:
- Permite **auto-registro** em sistemas e gerenciadores.
- Facilita implementação de **padrões de projeto** (Observer, Callback, Strategy).
- Permite **interação bidirecional** entre objetos.

**Regras e Cuidados**:
- **Reference escape**: Evite passar `this` em construtores antes do objeto estar completamente inicializado.
- **Referências circulares**: Passar `this` pode criar ciclos de referências, dificultando garbage collection.
- **Thread-safety**: Passar `this` para outros threads exige sincronização adequada.
- **Mutabilidade**: Passar `this` pode expor o objeto a modificações externas indesejadas.

**Boas Práticas**:
- Evite passar `this` em construtores; prefira métodos separados para registro.
- Garanta inicialização completa antes de passar `this`.
- Use interfaces para callbacks e listeners, tornando o contrato explícito.
- Documente quando `this` é armazenado (não apenas usado temporariamente).
- Use `WeakReference` em coleções de longa duração para permitir garbage collection.
- Evite expor `this` em APIs públicas se isso permitir modificações indesejadas.

**Armadilhas**:
- Passar `this` antes de inicialização completa (reference escape).
- Criar referências circulares que impedem garbage collection.
- Problemas de thread-safety ao passar `this` para outros threads.
- Exposição de mutabilidade permitindo modificações externas indesejadas.

Passar `this` como argumento é uma técnica poderosa e amplamente utilizada em Java, mas requer cuidado para evitar problemas de inicialização, concorrência e gerenciamento de memória.
