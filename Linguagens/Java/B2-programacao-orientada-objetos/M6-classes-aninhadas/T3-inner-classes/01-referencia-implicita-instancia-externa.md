# T3.01 - Referência Implícita à Instância Externa

## Introdução

**Inner class**: classe não-static dentro de outra classe.

```java
public class Externa {
    private String valor = "Externa";
    
    // Inner class (sem static)
    public class Interna {
        public void exibir() {
            // Acessa membro de Externa
            System.out.println("Valor: " + valor);
        }
    }
}

// Uso: precisa de instância de Externa
Externa externa = new Externa();
Externa.Interna interna = externa.new Interna();
interna.exibir(); // Valor: Externa
```

**Referência implícita**: inner class tem referência à instância externa.

---

## Fundamentos

### 1. Diferença de Static Nested Class

**Diferença principal**: referência à instância externa.

```java
public class Exemplo {
    private String nome = "Exemplo";
    
    // Static nested (SEM referência à instância)
    public static class Nested {
        public void metodo() {
            // ❌ ERRO: não acessa 'nome'
            // System.out.println(nome);
        }
    }
    
    // Inner class (COM referência à instância)
    public class Inner {
        public void metodo() {
            // ✅ OK: acessa 'nome'
            System.out.println(nome);
        }
    }
}
```

### 2. Acesso a Membros de Instância

**Acesso direto**: inner class acessa membros da externa.

```java
public class Conta {
    private String numero;
    private double saldo;
    
    public Conta(String numero, double saldo) {
        this.numero = numero;
        this.saldo = saldo;
    }
    
    // Inner class
    public class Transacao {
        private String tipo;
        private double valor;
        
        public Transacao(String tipo, double valor) {
            this.tipo = tipo;
            this.valor = valor;
        }
        
        public void executar() {
            // Acessa membros de Conta diretamente
            System.out.println("Conta: " + numero);
            System.out.println("Saldo anterior: " + saldo);
            
            if (tipo.equals("DEPOSITO")) {
                saldo += valor; // Modifica saldo de Conta
            } else if (tipo.equals("SAQUE")) {
                saldo -= valor;
            }
            
            System.out.println("Saldo novo: " + saldo);
        }
    }
}

// Uso
Conta conta = new Conta("12345", 1000);
Conta.Transacao trans = conta.new Transacao("DEPOSITO", 500);
trans.executar();
// Conta: 12345
// Saldo anterior: 1000.0
// Saldo novo: 1500.0
```

### 3. Referência Externa.this

**Externa.this**: referência explícita à instância externa.

```java
public class Externa {
    private String nome = "Externa";
    
    public class Interna {
        private String nome = "Interna";
        
        public void exibir() {
            // 'nome' da Interna (shadowing)
            System.out.println("Interna nome: " + nome);
            
            // 'this' refere-se a Interna
            System.out.println("this.nome: " + this.nome);
            
            // 'Externa.this' refere-se a Externa
            System.out.println("Externa.this.nome: " + Externa.this.nome);
        }
    }
}

// Uso
Externa ext = new Externa();
Externa.Interna inter = ext.new Interna();
inter.exibir();
// Interna nome: Interna
// this.nome: Interna
// Externa.this.nome: Externa
```

### 4. Múltiplas Instâncias Compartilham Externa

**Diferentes instâncias**: cada uma vinculada à sua externa.

```java
public class Lista {
    private String nome;
    
    public Lista(String nome) {
        this.nome = nome;
    }
    
    public class Iterador {
        public void exibir() {
            System.out.println("Lista: " + nome);
        }
    }
}

// Múltiplas listas
Lista lista1 = new Lista("Lista 1");
Lista lista2 = new Lista("Lista 2");

// Iteradores vinculados a listas diferentes
Lista.Iterador iter1 = lista1.new Iterador();
Lista.Iterador iter2 = lista2.new Iterador();

iter1.exibir(); // Lista: Lista 1
iter2.exibir(); // Lista: Lista 2
```

### 5. Modificação do Estado Externo

**Modificação**: inner class pode alterar estado da externa.

```java
public class Carrinho {
    private double total = 0;
    
    public class Item {
        private String produto;
        private double preco;
        
        public Item(String produto, double preco) {
            this.produto = produto;
            this.preco = preco;
        }
        
        public void adicionar() {
            // Modifica 'total' de Carrinho
            total += preco;
            System.out.println(produto + " adicionado - Total: " + total);
        }
        
        public void remover() {
            total -= preco;
            System.out.println(produto + " removido - Total: " + total);
        }
    }
}

// Uso
Carrinho carrinho = new Carrinho();

Carrinho.Item item1 = carrinho.new Item("Mouse", 50);
item1.adicionar(); // Mouse adicionado - Total: 50.0

Carrinho.Item item2 = carrinho.new Item("Teclado", 150);
item2.adicionar(); // Teclado adicionado - Total: 200.0

item1.remover(); // Mouse removido - Total: 150.0
```

### 6. Acesso a Métodos da Externa

**Métodos**: inner class chama métodos da externa.

```java
public class Documento {
    private String titulo;
    private List<String> linhas = new ArrayList<>();
    
    public Documento(String titulo) {
        this.titulo = titulo;
    }
    
    private void log(String mensagem) {
        System.out.println("[" + titulo + "] " + mensagem);
    }
    
    public class Editor {
        public void adicionar(String linha) {
            linhas.add(linha);
            // Chama método privado de Documento
            log("Linha adicionada: " + linha);
        }
        
        public void remover(int indice) {
            if (indice >= 0 && indice < linhas.size()) {
                String linha = linhas.remove(indice);
                log("Linha removida: " + linha);
            }
        }
    }
}

// Uso
Documento doc = new Documento("Relatório");
Documento.Editor editor = doc.new Editor();

editor.adicionar("Linha 1");
// [Relatório] Linha adicionada: Linha 1

editor.adicionar("Linha 2");
// [Relatório] Linha adicionada: Linha 2
```

### 7. Herança de Inner Class

**Herança**: inner class pode estender outra classe.

```java
public class Animal {
    protected String especie;
    
    public Animal(String especie) {
        this.especie = especie;
    }
}

public class Zoo {
    private String nome;
    
    public Zoo(String nome) {
        this.nome = nome;
    }
    
    // Inner class estendendo Animal
    public class AnimalDoZoo extends Animal {
        private String nomeAnimal;
        
        public AnimalDoZoo(String especie, String nomeAnimal) {
            super(especie);
            this.nomeAnimal = nomeAnimal;
        }
        
        public void exibir() {
            // Acessa 'nome' de Zoo
            System.out.println("Zoo: " + nome);
            // Acessa 'especie' de Animal
            System.out.println("Espécie: " + especie);
            System.out.println("Nome: " + nomeAnimal);
        }
    }
}

// Uso
Zoo zoo = new Zoo("Zoo Municipal");
Zoo.AnimalDoZoo animal = zoo.new AnimalDoZoo("Leão", "Simba");
animal.exibir();
// Zoo: Zoo Municipal
// Espécie: Leão
// Nome: Simba
```

### 8. Interface em Inner Class

**Interface**: inner class pode implementar interface.

```java
public interface Comparavel {
    int comparar(Object outro);
}

public class Pessoa {
    private String nome;
    private int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // Inner class implementando interface
    public class ComparadorIdade implements Comparavel {
        @Override
        public int comparar(Object outro) {
            if (!(outro instanceof Pessoa)) {
                throw new IllegalArgumentException("Tipo inválido");
            }
            
            Pessoa outra = (Pessoa) outro;
            // Acessa 'idade' de Pessoa
            return Integer.compare(idade, outra.idade);
        }
    }
    
    public int getIdade() { return idade; }
}

// Uso
Pessoa p1 = new Pessoa("João", 30);
Pessoa p2 = new Pessoa("Maria", 25);

Pessoa.ComparadorIdade comp = p1.new ComparadorIdade();
int resultado = comp.comparar(p2);
System.out.println(resultado > 0 ? "João é mais velho" : "Maria é mais velha");
```

### 9. Inner Class Privada

**Private inner**: encapsular implementação.

```java
public class Fila {
    private No primeiro;
    private No ultimo;
    private int tamanho = 0;
    
    // Inner class privada
    private class No {
        Object valor;
        No proximo;
        
        No(Object valor) {
            this.valor = valor;
            this.proximo = null;
        }
    }
    
    public void adicionar(Object valor) {
        No novo = new No(valor);
        
        if (ultimo != null) {
            ultimo.proximo = novo;
        }
        
        ultimo = novo;
        
        if (primeiro == null) {
            primeiro = novo;
        }
        
        tamanho++;
    }
    
    public Object remover() {
        if (primeiro == null) {
            return null;
        }
        
        Object valor = primeiro.valor;
        primeiro = primeiro.proximo;
        
        if (primeiro == null) {
            ultimo = null;
        }
        
        tamanho--;
        return valor;
    }
    
    public int getTamanho() {
        return tamanho;
    }
}

// Uso
Fila fila = new Fila();
fila.adicionar("A");
fila.adicionar("B");
fila.adicionar("C");

System.out.println(fila.remover()); // A
System.out.println(fila.getTamanho()); // 2
```

### 10. Referência em Callbacks

**Callback**: inner class mantém referência à externa.

```java
public class Botao {
    private String texto;
    private ClickListener listener;
    
    public Botao(String texto) {
        this.texto = texto;
    }
    
    public interface ClickListener {
        void onClick();
    }
    
    public void setOnClickListener(ClickListener listener) {
        this.listener = listener;
    }
    
    public void clicar() {
        System.out.println("Botão '" + texto + "' clicado");
        if (listener != null) {
            listener.onClick();
        }
    }
}

public class Formulario {
    private int contador = 0;
    
    // Inner class para callback
    private class MeuClickListener implements Botao.ClickListener {
        @Override
        public void onClick() {
            // Acessa 'contador' de Formulario
            contador++;
            System.out.println("Cliques: " + contador);
        }
    }
    
    public void configurar() {
        Botao botao = new Botao("Enviar");
        botao.setOnClickListener(new MeuClickListener());
        
        botao.clicar();
        botao.clicar();
        botao.clicar();
    }
}

// Uso
Formulario form = new Formulario();
form.configurar();
// Botão 'Enviar' clicado
// Cliques: 1
// Botão 'Enviar' clicado
// Cliques: 2
// Botão 'Enviar' clicado
// Cliques: 3
```

---

## Aplicabilidade

**Referência implícita útil para**:
- Iterator pattern
- Callbacks e listeners
- Builder com acesso ao objeto sendo construído
- Encapsular nós de estruturas de dados
- Observers vinculados ao observável

---

## Armadilhas

### 1. Memory Leak com Referência

```java
public class Activity {
    private byte[] dados = new byte[10000000]; // 10MB
    
    public class AsyncTask {
        public void executar() {
            new Thread(() -> {
                // Inner class mantém referência a Activity
                // Se Activity for destruída, ainda fica na memória
                try {
                    Thread.sleep(10000);
                } catch (InterruptedException e) { }
            }).start();
        }
    }
}

// ⚠️ Problema: Activity não pode ser coletada pelo GC
// enquanto AsyncTask estiver executando
```

### 2. Serialização com Outer Class

```java
import java.io.*;

public class Externa implements Serializable {
    private String valor = "Externa";
    
    // ⚠️ Inner class serializada inclui Externa
    public class Interna implements Serializable {
        private String nome = "Interna";
    }
}

// Serializar Interna também serializa Externa
// (pode ser problema se Externa for grande)
```

### 3. Confusão com Static

```java
public class Externa {
    private String nome = "Externa";
    
    public class Interna {
        // ❌ ERRO: não pode ter membros static em inner class
        // public static String valor = "teste";
        
        // ❌ ERRO: não pode ter métodos static
        // public static void metodo() { }
    }
}
```

### 4. Shadowing Acidental

```java
public class Externa {
    private String nome = "Externa";
    
    public class Interna {
        private String nome = "Interna"; // Shadowing
        
        public void exibir() {
            // ⚠️ Qual 'nome'?
            System.out.println(nome); // Interna (pode confundir)
            
            // ✅ Explícito
            System.out.println(Externa.this.nome); // Externa
        }
    }
}
```

### 5. Instanciação sem Externa

```java
public class Externa {
    public class Interna { }
}

// ❌ ERRO: não pode instanciar sem Externa
// Externa.Interna interna = new Externa.Interna();

// ✅ Precisa de instância de Externa
Externa ext = new Externa();
Externa.Interna interna = ext.new Interna();
```

---

## Boas Práticas

### 1. Documentar Dependência

```java
/**
 * Lista encadeada simples.
 */
public class Lista {
    private No primeiro;
    
    /**
     * Nó interno da lista.
     * Mantém referência implícita à Lista externa.
     */
    private class No {
        Object valor;
        No proximo;
    }
}
```

### 2. Preferir Static quando Possível

```java
// ⚠️ Inner class sem necessidade
public class Util {
    public class Helper {
        public void metodo() {
            // Não usa membros de Util
        }
    }
}

// ✅ Static nested (sem referência desnecessária)
public class Util {
    public static class Helper {
        public void metodo() { }
    }
}
```

### 3. Private para Encapsulamento

```java
// ✅ Inner class privada para implementação
public class Arvore {
    private No raiz;
    
    // Implementação oculta
    private class No {
        int valor;
        No esquerda;
        No direita;
        
        No(int valor) {
            this.valor = valor;
        }
    }
    
    public void adicionar(int valor) {
        raiz = adicionarRecursivo(raiz, valor);
    }
    
    private No adicionarRecursivo(No atual, int valor) {
        if (atual == null) {
            return new No(valor);
        }
        
        if (valor < atual.valor) {
            atual.esquerda = adicionarRecursivo(atual.esquerda, valor);
        } else if (valor > atual.valor) {
            atual.direita = adicionarRecursivo(atual.direita, valor);
        }
        
        return atual;
    }
}
```

### 4. Evitar Referências Longas

```java
// ⚠️ Referência mantida por muito tempo
public class Activity {
    public class LongRunningTask {
        public void executar() {
            new Thread(() -> {
                // Mantém Activity viva
                try {
                    Thread.sleep(60000); // 1 minuto
                } catch (InterruptedException e) { }
            }).start();
        }
    }
}

// ✅ Static nested com WeakReference
public class Activity {
    public static class LongRunningTask {
        private WeakReference<Activity> activityRef;
        
        public LongRunningTask(Activity activity) {
            this.activityRef = new WeakReference<>(activity);
        }
        
        public void executar() {
            new Thread(() -> {
                Activity activity = activityRef.get();
                if (activity != null) {
                    // Processar
                }
            }).start();
        }
    }
}
```

### 5. Externa.this quando Ambíguo

```java
// ✅ Usar Externa.this para clareza
public class Externa {
    private String valor = "Externa";
    
    public class Interna {
        private String valor = "Interna";
        
        public void processar() {
            // Explícito
            String interno = this.valor;
            String externo = Externa.this.valor;
            
            System.out.println("Interno: " + interno);
            System.out.println("Externo: " + externo);
        }
    }
}
```

### 6. Iterator Pattern

```java
// ✅ Uso clássico: Iterator
public class MinhaLista {
    private Object[] elementos;
    private int tamanho;
    
    // Inner class para iterator
    private class Iterador implements Iterator<Object> {
        private int indice = 0;
        
        @Override
        public boolean hasNext() {
            // Acessa 'tamanho' de MinhaLista
            return indice < tamanho;
        }
        
        @Override
        public Object next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            // Acessa 'elementos' de MinhaLista
            return elementos[indice++];
        }
    }
    
    public Iterator<Object> iterator() {
        return new Iterador();
    }
}
```

### 7. Builder com Validação

```java
// ✅ Builder que acessa objeto sendo construído
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
            if (Usuario.this.nome == null) {
                throw new IllegalStateException("Nome obrigatório");
            }
            return Usuario.this;
        }
    }
    
    public static Builder builder() {
        return new Usuario().new Builder();
    }
}

// Uso
Usuario user = Usuario.builder()
    .nome("João")
    .email("joao@email.com")
    .build();
```

### 8. Callback Type-Safe

```java
// ✅ Callback com tipo específico
public class Downloader {
    
    public interface ProgressListener {
        void onProgress(int porcentagem);
        void onComplete();
    }
    
    private ProgressListener listener;
    
    public void setProgressListener(ProgressListener listener) {
        this.listener = listener;
    }
}

public class Tela {
    private int progresso = 0;
    
    // Inner class para callback
    private class MeuListener implements Downloader.ProgressListener {
        @Override
        public void onProgress(int porcentagem) {
            progresso = porcentagem;
            System.out.println("Progresso: " + progresso + "%");
        }
        
        @Override
        public void onComplete() {
            System.out.println("Download completo!");
        }
    }
    
    public void iniciar() {
        Downloader downloader = new Downloader();
        downloader.setProgressListener(new MeuListener());
    }
}
```

### 9. Null-Safe com Externa

```java
// ✅ Verificar se externa é válida
public class Container {
    private String nome;
    
    public class Item {
        public void exibir() {
            // Verificar se Container está válido
            if (Container.this.nome != null) {
                System.out.println("Container: " + Container.this.nome);
            } else {
                System.out.println("Container sem nome");
            }
        }
    }
}
```

### 10. Cleanup de Referências

```java
// ✅ Limpar referências quando necessário
public class Manager {
    private Resource recurso;
    
    public class Worker {
        public void processar() {
            if (recurso != null) {
                // Usar recurso
            }
        }
    }
    
    public void cleanup() {
        recurso = null; // Liberar recurso
    }
}
```

---

## Resumo

**Inner class**: classe não-static com referência à instância externa.

```java
public class Externa {
    private String valor = "Externa";
    
    public class Interna {
        public void metodo() {
            System.out.println(valor); // Acessa Externa
        }
    }
}
```

**Referência implícita**: `Externa.this`.

**Características**:
- Acessa todos os membros da externa (public, private, protected)
- Pode modificar estado da externa
- Precisa de instância externa para ser criada
- Não pode ter membros static
- Mantém referência à externa (memória)

**Diferença de static nested**:
- Inner: TEM referência à instância externa
- Static nested: NÃO tem referência

**Aplicabilidade**:
- Iterator pattern
- Callbacks/Listeners
- Estruturas de dados (nós)
- Observer pattern
- Builder pattern

**Boas práticas**:
- Documentar dependência
- Preferir static quando possível
- Private para encapsulamento
- Evitar referências longas
- Externa.this quando ambíguo
- Iterator pattern
- Builder com validação
- Callback type-safe
- Null-safe com externa
- Cleanup de referências

**Armadilhas**:
- ❌ Memory leak (referência mantida)
- ❌ Serialização inclui externa
- ❌ Não pode ter membros static
- ❌ Shadowing acidental
- ❌ Instanciação sem externa

**Regra de Ouro**: **Inner classes** (não-static) mantêm **referência implícita** à instância externa via `Externa.this`. Use quando a inner class **precisa acessar** membros de instância da externa. Cuidado com **memory leaks** em callbacks de longa duração. Prefira **static nested** quando não precisar da referência. Inner classes são ideais para **Iterator**, **callbacks** e **nós de estruturas de dados**.
