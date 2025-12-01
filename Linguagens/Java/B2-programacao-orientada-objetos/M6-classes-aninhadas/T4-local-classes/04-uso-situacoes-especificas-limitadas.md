# T4.04 - Uso em Situações Específicas e Limitadas

## Introdução

**Local classes**: usadas em **situações específicas** onde outras soluções são inadequadas.

```java
// ✅ Situação específica: implementar interface com acesso a variáveis locais
public interface Validador {
    boolean validar();
}

public class App {
    public Validador criarValidador(String texto, int tamanhoMinimo) {
        // Local class: acessa parâmetros do método
        class ValidadorTexto implements Validador {
            @Override
            public boolean validar() {
                return texto != null && texto.length() >= tamanhoMinimo;
            }
        }
        
        return new ValidadorTexto();
    }
}
```

**Quando usar**: quando precisa implementar interface/classe E acessar variáveis locais.

---

## Fundamentos

### 1. Factory Method Local

**Factory**: criar implementação com acesso a variáveis locais.

```java
public interface Comparador {
    int comparar(int a, int b);
}

public class ComparadorFactory {
    public static Comparador criarComparador(boolean crescente) {
        if (crescente) {
            // Local class para comparação crescente
            class ComparadorCrescente implements Comparador {
                @Override
                public int comparar(int a, int b) {
                    return Integer.compare(a, b);
                }
            }
            return new ComparadorCrescente();
        } else {
            // Local class para comparação decrescente
            class ComparadorDecrescente implements Comparador {
                @Override
                public int comparar(int a, int b) {
                    return Integer.compare(b, a);
                }
            }
            return new ComparadorDecrescente();
        }
    }
}

// Uso
Comparador cres = ComparadorFactory.criarComparador(true);
System.out.println(cres.comparar(10, 5)); // 1 (10 > 5)

Comparador decr = ComparadorFactory.criarComparador(false);
System.out.println(decr.comparar(10, 5)); // -1 (10 < 5 em ordem decrescente)
```

### 2. Callback com Contexto

**Callback**: capturar contexto do método.

```java
public interface DownloadListener {
    void onProgress(int progresso);
    void onComplete(String resultado);
}

public class Downloader {
    public void download(String url, DownloadListener listener) {
        // Simular download
        for (int i = 0; i <= 100; i += 20) {
            listener.onProgress(i);
        }
        listener.onComplete("Arquivo: " + url);
    }
}

public class App {
    public void baixarArquivo(String arquivo, String destino) {
        final int totalBytes = 1024; // Contexto do método
        
        // Local class captura contexto
        class MeuListener implements DownloadListener {
            @Override
            public void onProgress(int progresso) {
                int bytes = (totalBytes * progresso) / 100;
                System.out.println("Baixando " + arquivo + ": " + bytes + " bytes");
            }
            
            @Override
            public void onComplete(String resultado) {
                System.out.println("Download completo: " + resultado);
                System.out.println("Salvo em: " + destino);
            }
        }
        
        Downloader downloader = new Downloader();
        downloader.download("http://exemplo.com/" + arquivo, new MeuListener());
    }
}

// Uso
App app = new App();
app.baixarArquivo("documento.pdf", "/tmp/downloads");
```

### 3. Comparator Customizado

**Comparator**: ordenação baseada em critério dinâmico.

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
    
    @Override
    public String toString() {
        return nome + " (" + idade + " anos)";
    }
}

public class OrdenadorPessoas {
    public void ordenar(List<Pessoa> pessoas, String criterio) {
        if (criterio.equals("NOME")) {
            // Local class para ordenar por nome
            class ComparadorNome implements Comparator<Pessoa> {
                @Override
                public int compare(Pessoa p1, Pessoa p2) {
                    return p1.getNome().compareTo(p2.getNome());
                }
            }
            Collections.sort(pessoas, new ComparadorNome());
            
        } else if (criterio.equals("IDADE")) {
            // Local class para ordenar por idade
            class ComparadorIdade implements Comparator<Pessoa> {
                @Override
                public int compare(Pessoa p1, Pessoa p2) {
                    return Integer.compare(p1.getIdade(), p2.getIdade());
                }
            }
            Collections.sort(pessoas, new ComparadorIdade());
        }
    }
}

// Uso
List<Pessoa> pessoas = Arrays.asList(
    new Pessoa("João", 30),
    new Pessoa("Maria", 25),
    new Pessoa("Pedro", 35)
);

OrdenadorPessoas ordenador = new OrdenadorPessoas();
ordenador.ordenar(pessoas, "NOME");
System.out.println(pessoas);
// [João (30 anos), Maria (25 anos), Pedro (35 anos)]
```

### 4. Iterator Customizado

**Iterator**: implementação específica de navegação.

```java
import java.util.*;

public class MinhaColecao<T> implements Iterable<T> {
    private List<T> elementos = new ArrayList<>();
    
    public void adicionar(T elemento) {
        elementos.add(elemento);
    }
    
    @Override
    public Iterator<T> iterator() {
        // Local class para iterator
        class ColecaoIterator implements Iterator<T> {
            private int indice = 0;
            
            @Override
            public boolean hasNext() {
                return indice < elementos.size();
            }
            
            @Override
            public T next() {
                if (!hasNext()) {
                    throw new NoSuchElementException();
                }
                return elementos.get(indice++);
            }
        }
        
        return new ColecaoIterator();
    }
    
    // Iterator reverso
    public Iterator<T> reverseIterator() {
        class ReverseIterator implements Iterator<T> {
            private int indice = elementos.size() - 1;
            
            @Override
            public boolean hasNext() {
                return indice >= 0;
            }
            
            @Override
            public T next() {
                if (!hasNext()) {
                    throw new NoSuchElementException();
                }
                return elementos.get(indice--);
            }
        }
        
        return new ReverseIterator();
    }
}

// Uso
MinhaColecao<String> colecao = new MinhaColecao<>();
colecao.adicionar("A");
colecao.adicionar("B");
colecao.adicionar("C");

// Iterator normal
for (String s : colecao) {
    System.out.print(s + " ");
}
// A B C

System.out.println();

// Iterator reverso
Iterator<String> reverso = colecao.reverseIterator();
while (reverso.hasNext()) {
    System.out.print(reverso.next() + " ");
}
// C B A
```

### 5. Template Method Pattern

**Template Method**: implementação de passos abstratos.

```java
public abstract class ProcessadorPedido {
    // Template method
    public final void processar() {
        validar();
        calcular();
        salvar();
        notificar();
    }
    
    protected abstract void validar();
    protected abstract void calcular();
    protected abstract void salvar();
    protected abstract void notificar();
}

public class PedidoService {
    public void processar(String tipoPedido, double valor) {
        if (tipoPedido.equals("ONLINE")) {
            // Local class implementa template
            class ProcessadorOnline extends ProcessadorPedido {
                @Override
                protected void validar() {
                    System.out.println("Validando pedido online");
                }
                
                @Override
                protected void calcular() {
                    double desconto = valor * 0.05;
                    System.out.println("Total: R$ " + (valor - desconto));
                }
                
                @Override
                protected void salvar() {
                    System.out.println("Salvando no banco de dados");
                }
                
                @Override
                protected void notificar() {
                    System.out.println("Email enviado");
                }
            }
            
            ProcessadorPedido proc = new ProcessadorOnline();
            proc.processar();
        }
    }
}
```

### 6. Strategy Pattern

**Strategy**: algoritmo selecionado em tempo de execução.

```java
public interface CalculadoraDesconto {
    double calcular(double valor);
}

public class DescontoService {
    public double aplicarDesconto(String tipoCliente, double valor) {
        CalculadoraDesconto calculadora;
        
        switch (tipoCliente) {
            case "VIP":
                class DescontoVIP implements CalculadoraDesconto {
                    @Override
                    public double calcular(double v) {
                        return v * 0.20; // 20% desconto
                    }
                }
                calculadora = new DescontoVIP();
                break;
                
            case "PREMIUM":
                class DescontoPremium implements CalculadoraDesconto {
                    @Override
                    public double calcular(double v) {
                        return v * 0.15; // 15% desconto
                    }
                }
                calculadora = new DescontoPremium();
                break;
                
            case "REGULAR":
                class DescontoRegular implements CalculadoraDesconto {
                    @Override
                    public double calcular(double v) {
                        return v * 0.05; // 5% desconto
                    }
                }
                calculadora = new DescontoRegular();
                break;
                
            default:
                return 0;
        }
        
        return calculadora.calcular(valor);
    }
}

// Uso
DescontoService service = new DescontoService();
System.out.println("Desconto VIP: R$ " + service.aplicarDesconto("VIP", 1000));
// Desconto VIP: R$ 200.0
```

### 7. Event Handler

**Event Handler**: tratamento de eventos com contexto.

```java
public interface EventHandler {
    void handle(String evento);
}

public class EventManager {
    private List<EventHandler> handlers = new ArrayList<>();
    
    public void addHandler(EventHandler handler) {
        handlers.add(handler);
    }
    
    public void dispararEvento(String evento) {
        for (EventHandler handler : handlers) {
            handler.handle(evento);
        }
    }
}

public class App {
    private int contador = 0;
    
    public void configurarEventos(EventManager manager, String prefixo) {
        // Local class captura 'prefixo' e acessa 'contador'
        class MeuHandler implements EventHandler {
            @Override
            public void handle(String evento) {
                contador++;
                System.out.println(prefixo + " Evento: " + evento);
                System.out.println("Total de eventos: " + contador);
            }
        }
        
        manager.addHandler(new MeuHandler());
    }
}

// Uso
EventManager manager = new EventManager();
App app = new App();
app.configurarEventos(manager, "[APP]");

manager.dispararEvento("LOGIN");
// [APP] Evento: LOGIN
// Total de eventos: 1

manager.dispararEvento("LOGOUT");
// [APP] Evento: LOGOUT
// Total de eventos: 2
```

### 8. Predicate Dinâmico

**Predicate**: filtro customizado com critérios dinâmicos.

```java
import java.util.*;
import java.util.function.Predicate;

public class FiltroService {
    public <T> List<T> filtrar(List<T> lista, Predicate<T> predicate) {
        List<T> resultado = new ArrayList<>();
        for (T item : lista) {
            if (predicate.test(item)) {
                resultado.add(item);
            }
        }
        return resultado;
    }
}

public class App {
    public List<Integer> filtrarNumeros(List<Integer> numeros, int limite) {
        FiltroService filtro = new FiltroService();
        
        // Local class implementa Predicate
        class FiltroMaiorQue implements Predicate<Integer> {
            @Override
            public boolean test(Integer numero) {
                return numero > limite; // Captura 'limite'
            }
        }
        
        return filtro.filtrar(numeros, new FiltroMaiorQue());
    }
}

// Uso
App app = new App();
List<Integer> numeros = Arrays.asList(5, 15, 25, 35, 45);
List<Integer> resultado = app.filtrarNumeros(numeros, 20);
System.out.println(resultado); // [25, 35, 45]
```

### 9. Adapter Pattern

**Adapter**: adaptar interface incompatível.

```java
// Interface esperada
public interface Notificador {
    void notificar(String mensagem);
}

// Classe legada incompatível
public class EmailSender {
    public void enviarEmail(String destinatario, String assunto, String corpo) {
        System.out.println("Email para: " + destinatario);
        System.out.println("Assunto: " + assunto);
        System.out.println("Corpo: " + corpo);
    }
}

public class NotificadorService {
    public Notificador criarNotificadorEmail(String destinatario) {
        final EmailSender emailSender = new EmailSender();
        
        // Local class adapta EmailSender para Notificador
        class NotificadorEmailAdapter implements Notificador {
            @Override
            public void notificar(String mensagem) {
                emailSender.enviarEmail(
                    destinatario,
                    "Notificação",
                    mensagem
                );
            }
        }
        
        return new NotificadorEmailAdapter();
    }
}

// Uso
NotificadorService service = new NotificadorService();
Notificador notificador = service.criarNotificadorEmail("joao@email.com");
notificador.notificar("Pedido aprovado");
```

### 10. Runnable com Contexto

**Runnable**: thread com acesso a variáveis locais.

```java
public class TarefaService {
    public void executarTarefa(String nome, int duracao) {
        // Local class implementa Runnable
        class MinhaTask implements Runnable {
            @Override
            public void run() {
                System.out.println("Iniciando tarefa: " + nome);
                
                try {
                    Thread.sleep(duracao);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                
                System.out.println("Tarefa concluída: " + nome);
            }
        }
        
        Thread thread = new Thread(new MinhaTask());
        thread.start();
    }
}

// Uso
TarefaService service = new TarefaService();
service.executarTarefa("Task 1", 1000);
service.executarTarefa("Task 2", 500);
```

---

## Aplicabilidade

**Local classes são úteis quando**:
- Precisa implementar interface com acesso a variáveis locais
- Factory method retorna implementação específica
- Callback/listener captura contexto
- Comparator/Predicate com critério dinâmico
- Iterator customizado
- Template method com implementação local
- Strategy com algoritmo específico
- Event handler com estado
- Adapter para classe legada
- Runnable/Callable com contexto

---

## Armadilhas

### 1. Usar Local Class quando Lambda é Melhor

```java
// ❌ Local class desnecessária para interface funcional
public void processar() {
    class MeuRunnable implements Runnable {
        @Override
        public void run() {
            System.out.println("Executando");
        }
    }
    
    new Thread(new MeuRunnable()).start();
}

// ✅ Lambda é mais simples
public void processar() {
    new Thread(() -> System.out.println("Executando")).start();
}
```

### 2. Local Class Muito Complexa

```java
// ❌ Local class muito complexa
public void processar() {
    class ProcessadorComplexo {
        private int campo1;
        private String campo2;
        private List<Object> campo3;
        
        public void metodo1() { /* 50 linhas */ }
        public void metodo2() { /* 30 linhas */ }
        public void metodo3() { /* 40 linhas */ }
        // ... mais 10 métodos
    }
}

// ✅ Preferir inner class ou classe top-level
public class MinhaClasse {
    private class ProcessadorComplexo {
        // ...
    }
}
```

### 3. Reutilizar em Múltiplos Métodos

```java
// ❌ Local class não pode ser reutilizada
public class Exemplo {
    public void metodo1() {
        class Helper {
            public void executar() { }
        }
        Helper helper = new Helper();
    }
    
    public void metodo2() {
        // ❌ ERRO: Helper não é visível aqui
        // Helper helper = new Helper();
    }
}

// ✅ Usar inner class
public class Exemplo {
    private class Helper {
        public void executar() { }
    }
    
    public void metodo1() {
        Helper helper = new Helper();
    }
    
    public void metodo2() {
        Helper helper = new Helper(); // ✅ OK
    }
}
```

### 4. Memory Leak com Thread

```java
// ⚠️ Local class em thread pode causar memory leak
public class Activity {
    private byte[] dados = new byte[10000000]; // 10MB
    
    public void iniciar() {
        class MinhaTask implements Runnable {
            @Override
            public void run() {
                // Thread mantém Activity viva
                try {
                    Thread.sleep(60000); // 1 minuto
                } catch (InterruptedException e) { }
            }
        }
        
        new Thread(new MinhaTask()).start();
        // Activity não pode ser coletada enquanto thread executa
    }
}

// ✅ Usar WeakReference
import java.lang.ref.WeakReference;

public class Activity {
    private byte[] dados = new byte[10000000];
    
    public void iniciar() {
        final WeakReference<Activity> activityRef = new WeakReference<>(this);
        
        class MinhaTask implements Runnable {
            @Override
            public void run() {
                Activity activity = activityRef.get();
                if (activity != null) {
                    // Processar
                }
            }
        }
        
        new Thread(new MinhaTask()).start();
    }
}
```

### 5. Confundir com Anonymous Class

```java
// Local class (com nome)
public void metodo1() {
    class MinhaLocal implements Runnable {
        @Override
        public void run() { }
    }
    
    Runnable r = new MinhaLocal();
}

// Anonymous class (sem nome)
public void metodo2() {
    Runnable r = new Runnable() {
        @Override
        public void run() { }
    };
}

// ✅ Local class: quando precisa reutilizar
// ✅ Anonymous class: quando usa apenas uma vez
```

---

## Boas Práticas

### 1. Preferir Lambda para Interface Funcional

```java
// ❌ Local class desnecessária
class MeuComparator implements Comparator<String> {
    @Override
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
}
Collections.sort(lista, new MeuComparator());

// ✅ Lambda é mais conciso
Collections.sort(lista, (a, b) -> a.length() - b.length());
```

### 2. Documentar Propósito

```java
/**
 * Cria validador customizado.
 */
public Validador criarValidador(int limite) {
    /**
     * Valida texto com base no limite especificado.
     * Local class usada para capturar 'limite'.
     */
    class ValidadorLimite implements Validador {
        @Override
        public boolean validar(String texto) {
            return texto.length() <= limite;
        }
    }
    
    return new ValidadorLimite();
}
```

### 3. Limitar Tamanho

```java
// ✅ Local class pequena e focada (< 20 linhas)
public Iterator<T> iterator() {
    class MeuIterator implements Iterator<T> {
        private int indice = 0;
        
        public boolean hasNext() {
            return indice < size();
        }
        
        public T next() {
            return get(indice++);
        }
    }
    
    return new MeuIterator();
}
```

### 4. Nome Descritivo

```java
// ✅ Nome descritivo da função
public Comparator<Pessoa> criarComparador(String campo) {
    if (campo.equals("NOME")) {
        class ComparadorPorNome implements Comparator<Pessoa> {
            public int compare(Pessoa p1, Pessoa p2) {
                return p1.getNome().compareTo(p2.getNome());
            }
        }
        return new ComparadorPorNome();
    }
    return null;
}
```

### 5. Factory Pattern

```java
// ✅ Factory retorna interface
public interface Processador {
    void processar();
}

public class ProcessadorFactory {
    public static Processador criar(String tipo) {
        if (tipo.equals("SIMPLES")) {
            class ProcessadorSimples implements Processador {
                public void processar() {
                    System.out.println("Processamento simples");
                }
            }
            return new ProcessadorSimples();
        }
        return null;
    }
}
```

---

## Resumo

**Local classes**: usadas em **situações específicas** onde são a melhor solução.

**Quando usar**:
- Factory method com contexto
- Callback/listener com estado
- Comparator/Predicate dinâmico
- Iterator customizado
- Template method
- Strategy pattern
- Event handler
- Adapter pattern
- Runnable/Callable com contexto

**Quando NÃO usar**:
- ❌ Interface funcional simples (use lambda)
- ❌ Classe muito complexa (use inner class ou top-level)
- ❌ Reutilização em múltiplos métodos (use inner class)
- ❌ Lógica que não precisa de variáveis locais (use classe top-level)

**Vantagens**:
- Acessa variáveis locais (efetivamente final)
- Escopo limitado (não polui namespace)
- Implementa interface com contexto
- Encapsula lógica temporária

**Desvantagens**:
- Não pode ser reutilizada em outros métodos
- Não pode ter membros static
- Pode causar memory leak com threads

**Boas práticas**:
- Preferir lambda para interface funcional
- Documentar propósito
- Limitar tamanho (< 20 linhas)
- Nome descritivo
- Factory pattern retorna interface

**Regra de Ouro**: **Local classes** são **situacionais** - use quando precisa **implementar interface** COM **acesso a variáveis locais**. Para **interface funcional simples**, prefira **lambda**. Para **lógica complexa** ou **reutilização**, prefira **inner class** ou **classe top-level**. Local classes são ideais para **factory methods**, **callbacks**, **iterators** e **adapters** que capturam contexto do método. Mantenha-as **pequenas** e **focadas**. Se não precisa acessar variáveis locais, considere outras opções.
