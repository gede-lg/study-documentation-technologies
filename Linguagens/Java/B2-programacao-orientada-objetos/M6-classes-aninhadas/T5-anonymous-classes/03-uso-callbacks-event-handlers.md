# T5.03 - Uso em Callbacks e Event Handlers

## Introdução

**Anonymous class**: ideal para **callbacks** e **event handlers**.

```java
// Callback
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("Botão clicado!");
    }
});
```

**Callback**: função passada como argumento.  
**Event handler**: responde a eventos (click, keypress, etc).

---

## Fundamentos

### 1. Callback Simples

**Callback**: executar após operação.

```java
public interface Callback {
    void onComplete(String resultado);
}

public class Processador {
    public void processar(String dados, Callback callback) {
        // Simula processamento
        String resultado = dados.toUpperCase();
        
        // Chama callback
        callback.onComplete(resultado);
    }
}

// Usar callback
Processador proc = new Processador();

proc.processar("teste", new Callback() {
    @Override
    public void onComplete(String resultado) {
        System.out.println("Resultado: " + resultado);
    }
});
// Resultado: TESTE
```

### 2. Callback com Sucesso e Erro

**Callback**: tratar sucesso e erro.

```java
public interface CallbackCompleto {
    void onSuccess(String resultado);
    void onError(Exception erro);
}

public class Downloader {
    public void download(String url, CallbackCompleto callback) {
        try {
            // Simula download
            if (url.isEmpty()) {
                throw new IllegalArgumentException("URL vazia");
            }
            
            String conteudo = "Conteúdo de " + url;
            callback.onSuccess(conteudo);
            
        } catch (Exception e) {
            callback.onError(e);
        }
    }
}

// Usar callback
Downloader dl = new Downloader();

dl.download("http://exemplo.com", new CallbackCompleto() {
    @Override
    public void onSuccess(String resultado) {
        System.out.println("Download OK: " + resultado);
    }
    
    @Override
    public void onError(Exception erro) {
        System.out.println("Erro: " + erro.getMessage());
    }
});
```

### 3. Event Listener (GUI)

**Event listener**: responde a eventos de UI.

```java
import javax.swing.*;
import java.awt.event.*;

public class TelaLogin extends JFrame {
    private JButton btnLogin;
    
    public TelaLogin() {
        btnLogin = new JButton("Login");
        
        // Event handler para clique
        btnLogin.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                System.out.println("Tentando fazer login...");
            }
        });
        
        add(btnLogin);
    }
}
```

### 4. Multiple Event Listeners

**Múltiplos listeners**: diferentes eventos.

```java
import javax.swing.*;
import java.awt.event.*;

JTextField campo = new JTextField();

// Listener para foco
campo.addFocusListener(new FocusListener() {
    @Override
    public void focusGained(FocusEvent e) {
        System.out.println("Campo focado");
    }
    
    @Override
    public void focusLost(FocusEvent e) {
        System.out.println("Campo perdeu foco");
    }
});

// Listener para tecla
campo.addKeyListener(new KeyAdapter() { // KeyAdapter = abstract class
    @Override
    public void keyPressed(KeyEvent e) {
        System.out.println("Tecla: " + e.getKeyChar());
    }
});
```

### 5. Callback com Contexto

**Contexto**: capturar variáveis locais.

```java
public interface NotificacaoCallback {
    void onNotificacao(String mensagem);
}

public class Notificador {
    public void notificar(String evento, NotificacaoCallback callback) {
        callback.onNotificacao("Evento: " + evento);
    }
}

public void processar() {
    final String usuario = "João"; // Efetivamente final
    
    Notificador notif = new Notificador();
    
    notif.notificar("Login", new NotificacaoCallback() {
        @Override
        public void onNotificacao(String mensagem) {
            // Acessa variável local
            System.out.println(usuario + " - " + mensagem);
        }
    });
}
// João - Evento: Login
```

### 6. Comparator como Callback

**Comparator**: callback para ordenação.

```java
import java.util.*;

class Produto {
    String nome;
    double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
}

List<Produto> produtos = Arrays.asList(
    new Produto("Mouse", 50.0),
    new Produto("Teclado", 150.0),
    new Produto("Monitor", 800.0)
);

// Ordenar por preço
Collections.sort(produtos, new Comparator<Produto>() {
    @Override
    public int compare(Produto p1, Produto p2) {
        return Double.compare(p1.preco, p2.preco);
    }
});

produtos.forEach(p -> System.out.println(p.nome + ": " + p.preco));
// Mouse: 50.0
// Teclado: 150.0
// Monitor: 800.0
```

### 7. Runnable como Callback

**Runnable**: callback para thread.

```java
public class TarefaManager {
    public void executarAsync(Runnable callback) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("Processando...");
                
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                
                // Chama callback
                callback.run();
            }
        }).start();
    }
}

// Usar
TarefaManager tm = new TarefaManager();

tm.executarAsync(new Runnable() {
    @Override
    public void run() {
        System.out.println("Concluído!");
    }
});

System.out.println("Continuando...");
// Saída:
// Continuando...
// Processando...
// Concluído!
```

### 8. Observer Pattern

**Observer**: notificar múltiplos listeners.

```java
import java.util.*;

public interface Observer {
    void atualizar(String evento);
}

public class Subject {
    private List<Observer> observers = new ArrayList<>();
    
    public void adicionar(Observer obs) {
        observers.add(obs);
    }
    
    public void notificar(String evento) {
        for (Observer obs : observers) {
            obs.atualizar(evento);
        }
    }
}

// Usar
Subject subject = new Subject();

subject.adicionar(new Observer() {
    @Override
    public void atualizar(String evento) {
        System.out.println("Observer 1: " + evento);
    }
});

subject.adicionar(new Observer() {
    @Override
    public void atualizar(String evento) {
        System.out.println("Observer 2: " + evento);
    }
});

subject.notificar("Atualização");
// Observer 1: Atualização
// Observer 2: Atualização
```

### 9. Timer com Callback

**Timer**: executar após delay.

```java
import java.util.Timer;
import java.util.TimerTask;

Timer timer = new Timer();

timer.schedule(new TimerTask() {
    @Override
    public void run() {
        System.out.println("Timer executado!");
    }
}, 2000); // Após 2 segundos

System.out.println("Timer agendado");
// Timer agendado
// (após 2 segundos)
// Timer executado!
```

### 10. WindowListener (Swing)

**WindowListener**: eventos de janela.

```java
import javax.swing.*;
import java.awt.event.*;

JFrame frame = new JFrame("Minha Janela");

frame.addWindowListener(new WindowAdapter() { // Abstract class
    @Override
    public void windowOpened(WindowEvent e) {
        System.out.println("Janela aberta");
    }
    
    @Override
    public void windowClosing(WindowEvent e) {
        System.out.println("Janela fechando");
        System.exit(0);
    }
});

frame.setSize(300, 200);
frame.setVisible(true);
```

---

## Aplicabilidade

**Usar callbacks quando**:
- Operação assíncrona
- Notificação após conclusão
- Tratamento de sucesso/erro
- Observer pattern

**Usar event handlers quando**:
- Interface gráfica (Swing, JavaFX)
- Responder a ações do usuário
- Click, keypress, focus, etc.

---

## Armadilhas

### 1. Memory Leak com Listeners

```java
// ❌ CUIDADO: listener não removido causa memory leak
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        // Se button vive mais que o listener,
        // pode causar memory leak
    }
});

// ✅ Remover listener quando não precisar
ActionListener listener = new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        // ...
    }
};

button.addActionListener(listener);

// Depois...
button.removeActionListener(listener); // Remove!
```

### 2. Capturar Variável Não-Final

```java
public void processar() {
    int contador = 0; // Não-final
    
    button.addActionListener(new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            // ❌ ERRO: variável não é efetivamente final
            // contador++;
        }
    });
    
    contador++; // Modifica variável
}

// ✅ Usar array ou AtomicInteger
final int[] contador = {0};

button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        contador[0]++; // OK
    }
});
```

### 3. Esquecer de Tratar Exceções

```java
// ❌ Exceção não tratada
proc.processar(dados, new Callback() {
    @Override
    public void onComplete(String resultado) {
        // Se resultado for null, NullPointerException!
        System.out.println(resultado.toUpperCase());
    }
});

// ✅ Tratar exceções
proc.processar(dados, new Callback() {
    @Override
    public void onComplete(String resultado) {
        if (resultado != null) {
            System.out.println(resultado.toUpperCase());
        } else {
            System.out.println("Resultado nulo");
        }
    }
});
```

### 4. Callback Complexo Demais

```java
// ❌ Callback muito complexo (> 20 linhas)
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        // 50 linhas de código...
        // Difícil de ler e manter
    }
});

// ✅ Extrair para método ou classe
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        processarClick();
    }
});

private void processarClick() {
    // Código complexo aqui
}
```

### 5. Thread Safety

```java
// ❌ CUIDADO: callback pode ser chamado de outra thread
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        // Pode ser chamado de thread diferente!
        // Cuidado com acesso a variáveis compartilhadas
    }
});

// ✅ Usar sincronização se necessário
private final Object lock = new Object();

button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        synchronized (lock) {
            // Thread-safe
        }
    }
});
```

---

## Boas Práticas

### 1. Preferir Lambda para Interface Funcional

```java
// ❌ Anonymous class verbosa
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("Clique");
    }
});

// ✅ Lambda concisa (Java 8+)
button.addActionListener(e -> System.out.println("Clique"));
```

### 2. Usar Adapter Classes

```java
// ❌ Implementar todos os métodos
window.addWindowListener(new WindowListener() {
    public void windowOpened(WindowEvent e) { }
    public void windowClosing(WindowEvent e) {
        System.exit(0);
    }
    public void windowClosed(WindowEvent e) { }
    public void windowIconified(WindowEvent e) { }
    public void windowDeiconified(WindowEvent e) { }
    public void windowActivated(WindowEvent e) { }
    public void windowDeactivated(WindowEvent e) { }
});

// ✅ Usar WindowAdapter (só sobrescrever necessário)
window.addWindowListener(new WindowAdapter() {
    @Override
    public void windowClosing(WindowEvent e) {
        System.exit(0);
    }
});
```

### 3. Documentar Callback

```java
// ✅ Documentar callback
/**
 * Processa dados e notifica via callback.
 * @param dados Dados para processar
 * @param callback Chamado com resultado após processamento
 */
public void processar(String dados, Callback callback) {
    // ...
}
```

### 4. Callback com Timeout

```java
public interface TimeoutCallback {
    void onSuccess(String resultado);
    void onError(Exception erro);
    void onTimeout();
}

public class ProcessadorComTimeout {
    public void processar(String dados, TimeoutCallback callback, long timeout) {
        Timer timer = new Timer();
        
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                callback.onTimeout();
            }
        }, timeout);
        
        // Processar...
    }
}
```

### 5. Remover Listener Quando Não Precisar

```java
// ✅ Remover listener
public class MinhaJanela extends JFrame {
    private ActionListener loginListener;
    
    public void setup() {
        JButton btnLogin = new JButton("Login");
        
        loginListener = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                fazerLogin();
            }
        };
        
        btnLogin.addActionListener(loginListener);
    }
    
    public void cleanup() {
        // Remover listener
        btnLogin.removeActionListener(loginListener);
    }
}
```

---

## Resumo

**Anonymous class**: ideal para **callbacks** e **event handlers**.

```java
// Callback
interface.metodo(new Callback() {
    @Override
    public void onComplete(String resultado) {
        // Tratar resultado
    }
});

// Event handler
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        // Tratar evento
    }
});
```

**Callback**: função passada como argumento, executada após operação.  
**Event handler**: responde a eventos (click, keypress, focus, etc).

**Casos de uso**:
- Operações assíncronas
- Interface gráfica (Swing, JavaFX)
- Observer pattern
- Timer, threads
- Comparator, Runnable

**Armadilhas**:
- Memory leak (não remover listener)
- Variável não-final
- Exceções não tratadas
- Callback complexo demais
- Thread safety

**Boas práticas**:
- Preferir lambda (Java 8+)
- Usar adapter classes
- Documentar callback
- Timeout se necessário
- Remover listener quando não precisar

**Regra de Ouro**: Use **callback** para notificação após operação. Use **event handler** para responder a eventos de UI. Para **interface funcional** (1 método), prefira **lambda** (Java 8+). Sempre **remova listener** quando não precisar para evitar **memory leak**. Mantenha callbacks **simples** (< 20 linhas).
