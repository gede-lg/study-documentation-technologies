# T5.06 - Uso com Swing, JavaFX, Threads

## Introdução

**Anonymous class**: muito usada em **Swing**, **JavaFX**, e **threads**.

```java
// Swing - ActionListener
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("Botão clicado!");
    }
});

// Thread - Runnable
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Thread executando");
    }
}).start();
```

**GUI**: responder a eventos (click, keypress, etc).  
**Threads**: executar código em paralelo.

---

## Fundamentos

### 1. Swing - ActionListener

**ActionListener**: responde a cliques em botões.

```java
import javax.swing.*;
import java.awt.event.*;

public class TelaLogin extends JFrame {
    public TelaLogin() {
        JButton btnLogin = new JButton("Login");
        
        // Anonymous class
        btnLogin.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                System.out.println("Fazendo login...");
            }
        });
        
        // Lambda (Java 8+)
        btnLogin.addActionListener(e -> System.out.println("Fazendo login..."));
        
        add(btnLogin);
        setSize(300, 200);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
    
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new TelaLogin().setVisible(true));
    }
}
```

### 2. Swing - WindowListener

**WindowListener**: eventos de janela (abrir, fechar, etc).

```java
import javax.swing.*;
import java.awt.event.*;

JFrame frame = new JFrame("Minha Janela");

// WindowAdapter (abstract class) = só implementa métodos necessários
frame.addWindowListener(new WindowAdapter() {
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

frame.setSize(400, 300);
frame.setVisible(true);
```

### 3. Swing - KeyListener

**KeyListener**: responde a teclas pressionadas.

```java
import javax.swing.*;
import java.awt.event.*;

JTextField campo = new JTextField();

// KeyAdapter (abstract class)
campo.addKeyListener(new KeyAdapter() {
    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ENTER) {
            System.out.println("Enter pressionado!");
        }
    }
});
```

### 4. Swing - MouseListener

**MouseListener**: eventos de mouse (click, enter, exit).

```java
import javax.swing.*;
import java.awt.event.*;

JButton button = new JButton("Hover me");

// MouseAdapter (abstract class)
button.addMouseListener(new MouseAdapter() {
    @Override
    public void mouseEntered(MouseEvent e) {
        System.out.println("Mouse sobre o botão");
    }
    
    @Override
    public void mouseExited(MouseEvent e) {
        System.out.println("Mouse saiu do botão");
    }
    
    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 2) {
            System.out.println("Duplo clique!");
        }
    }
});
```

### 5. JavaFX - EventHandler

**EventHandler**: responde a eventos em JavaFX.

```java
import javafx.application.Application;
import javafx.event.*;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class MinhaApp extends Application {
    @Override
    public void start(Stage primaryStage) {
        Button btn = new Button("Clique aqui");
        
        // Anonymous class
        btn.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                System.out.println("Botão clicado!");
            }
        });
        
        // Lambda (Java 8+)
        btn.setOnAction(event -> System.out.println("Botão clicado!"));
        
        StackPane root = new StackPane();
        root.getChildren().add(btn);
        
        Scene scene = new Scene(root, 300, 250);
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    
    public static void main(String[] args) {
        launch(args);
    }
}
```

### 6. Thread - Runnable

**Runnable**: executar código em thread separada.

```java
// Anonymous class
Thread t1 = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Thread 1: " + Thread.currentThread().getName());
    }
});

t1.start();

// Lambda (Java 8+)
Thread t2 = new Thread(() -> {
    System.out.println("Thread 2: " + Thread.currentThread().getName());
});

t2.start();

// Inline
new Thread(() -> System.out.println("Thread inline")).start();
```

### 7. Thread - Callable

**Callable**: retorna valor de thread.

```java
import java.util.concurrent.*;

ExecutorService executor = Executors.newSingleThreadExecutor();

// Anonymous class
Future<Integer> future = executor.submit(new Callable<Integer>() {
    @Override
    public Integer call() throws Exception {
        Thread.sleep(1000);
        return 42;
    }
});

try {
    Integer resultado = future.get(); // Bloqueia até conclusão
    System.out.println("Resultado: " + resultado); // 42
} catch (Exception e) {
    e.printStackTrace();
}

executor.shutdown();

// Lambda (Java 8+)
Future<Integer> future2 = executor.submit(() -> {
    Thread.sleep(1000);
    return 42;
});
```

### 8. SwingWorker (Background Task)

**SwingWorker**: executar tarefa pesada em background.

```java
import javax.swing.*;

SwingWorker<String, Void> worker = new SwingWorker<String, Void>() {
    @Override
    protected String doInBackground() throws Exception {
        // Executado em thread separada
        System.out.println("Processando...");
        Thread.sleep(2000);
        return "Concluído!";
    }
    
    @Override
    protected void done() {
        // Executado na EDT (Event Dispatch Thread)
        try {
            String resultado = get();
            System.out.println("Resultado: " + resultado);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
};

worker.execute();
```

### 9. Timer com TimerTask

**Timer**: executar tarefa após delay.

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

// Timer repetido
timer.scheduleAtFixedRate(new TimerTask() {
    @Override
    public void run() {
        System.out.println("Tick: " + System.currentTimeMillis());
    }
}, 0, 1000); // A cada 1 segundo
```

### 10. Swing - ItemListener (ComboBox)

**ItemListener**: responde a mudanças em ComboBox.

```java
import javax.swing.*;
import java.awt.event.*;

JComboBox<String> combo = new JComboBox<>(new String[]{"Op1", "Op2", "Op3"});

combo.addItemListener(new ItemListener() {
    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getStateChange() == ItemEvent.SELECTED) {
            System.out.println("Selecionado: " + e.getItem());
        }
    }
});

// Lambda (Java 8+)
combo.addItemListener(e -> {
    if (e.getStateChange() == ItemEvent.SELECTED) {
        System.out.println("Selecionado: " + e.getItem());
    }
});
```

---

## Aplicabilidade

**Swing/JavaFX**:
- ActionListener (botões)
- WindowListener (janelas)
- KeyListener (teclado)
- MouseListener (mouse)
- EventHandler (JavaFX)

**Threads**:
- Runnable (sem retorno)
- Callable (com retorno)
- SwingWorker (background task)
- TimerTask (executar após delay)

---

## Armadilhas

### 1. Atualizar UI de Thread Diferente (Swing)

```java
// ❌ ERRO: atualizar UI de thread diferente
new Thread(new Runnable() {
    @Override
    public void run() {
        label.setText("Atualizado"); // ❌ Não thread-safe!
    }
}).start();

// ✅ Usar SwingUtilities.invokeLater
new Thread(new Runnable() {
    @Override
    public void run() {
        // Processamento pesado...
        
        SwingUtilities.invokeLater(() -> {
            label.setText("Atualizado"); // ✅ Thread-safe
        });
    }
}).start();
```

### 2. Memory Leak com Listeners Não Removidos

```java
// ❌ Listener não removido = memory leak
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        // ...
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
button.removeActionListener(listener);
```

### 3. Bloquear EDT com Operação Pesada

```java
// ❌ ERRO: bloqueia UI
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        // Operação pesada (2 segundos)
        // UI trava!
        try {
            Thread.sleep(2000);
        } catch (InterruptedException ex) { }
    }
});

// ✅ Usar SwingWorker ou Thread
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        new Thread(() -> {
            // Operação pesada em thread separada
            try {
                Thread.sleep(2000);
            } catch (InterruptedException ex) { }
            
            SwingUtilities.invokeLater(() -> {
                label.setText("Concluído");
            });
        }).start();
    }
});
```

### 4. Esquecer de Chamar start() em Thread

```java
// ❌ ERRO: esquecer start()
Thread t = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
});
// t não executa! Falta t.start()

// ✅ Chamar start()
t.start(); // ✅
```

### 5. Fechar ExecutorService Sem shutdown()

```java
ExecutorService executor = Executors.newFixedThreadPool(5);

executor.submit(() -> {
    // Tarefa...
});

// ❌ ERRO: não fecha executor
// Programa não termina!

// ✅ Chamar shutdown()
executor.shutdown(); // ✅
```

---

## Boas Práticas

### 1. Preferir Lambda (Java 8+)

```java
// ❌ Anonymous class verbosa
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("Clique");
    }
});

// ✅ Lambda concisa
button.addActionListener(e -> System.out.println("Clique"));
```

### 2. Usar Adapter Classes (Swing)

```java
// ❌ Implementar todos os métodos
window.addWindowListener(new WindowListener() {
    public void windowOpened(WindowEvent e) { }
    public void windowClosing(WindowEvent e) { System.exit(0); }
    public void windowClosed(WindowEvent e) { }
    public void windowIconified(WindowEvent e) { }
    public void windowDeiconified(WindowEvent e) { }
    public void windowActivated(WindowEvent e) { }
    public void windowDeactivated(WindowEvent e) { }
});

// ✅ Usar WindowAdapter
window.addWindowListener(new WindowAdapter() {
    @Override
    public void windowClosing(WindowEvent e) {
        System.exit(0);
    }
});
```

### 3. SwingWorker para Tarefas Pesadas

```java
// ✅ SwingWorker
button.addActionListener(e -> {
    new SwingWorker<String, Void>() {
        @Override
        protected String doInBackground() throws Exception {
            // Tarefa pesada em background
            Thread.sleep(2000);
            return "Concluído";
        }
        
        @Override
        protected void done() {
            try {
                label.setText(get());
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }.execute();
});
```

### 4. Platform.runLater para JavaFX

```java
// ✅ Platform.runLater (JavaFX)
new Thread(() -> {
    // Processamento pesado...
    
    Platform.runLater(() -> {
        label.setText("Atualizado"); // Thread-safe
    });
}).start();
```

### 5. ExecutorService para Múltiplas Threads

```java
// ✅ ExecutorService
ExecutorService executor = Executors.newFixedThreadPool(5);

for (int i = 0; i < 10; i++) {
    final int tarefa = i;
    
    executor.submit(() -> {
        System.out.println("Tarefa " + tarefa);
    });
}

executor.shutdown();
```

---

## Resumo

**Anonymous class**: muito usada em **Swing**, **JavaFX**, **threads**.

```java
// Swing - ActionListener
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        // Responder a clique
    }
});

// JavaFX - EventHandler
button.setOnAction(new EventHandler<ActionEvent>() {
    @Override
    public void handle(ActionEvent event) {
        // Responder a clique
    }
});

// Thread - Runnable
new Thread(new Runnable() {
    @Override
    public void run() {
        // Executar em thread separada
    }
}).start();
```

**Swing - Listeners**:
- `ActionListener` - botões, menus
- `WindowListener/Adapter` - janelas
- `KeyListener/Adapter` - teclado
- `MouseListener/Adapter` - mouse
- `ItemListener` - ComboBox, CheckBox

**JavaFX**:
- `EventHandler<ActionEvent>` - botões
- `EventHandler<KeyEvent>` - teclado
- `EventHandler<MouseEvent>` - mouse

**Threads**:
- `Runnable` - sem retorno
- `Callable<T>` - com retorno
- `SwingWorker<T, V>` - background task (Swing)
- `TimerTask` - executar após delay

**Armadilhas**:
- Atualizar UI de thread diferente (Swing)
- Memory leak (não remover listener)
- Bloquear EDT (operação pesada)
- Esquecer `start()` em thread
- Não chamar `shutdown()` em ExecutorService

**Boas práticas**:
- Preferir lambda (Java 8+)
- Usar adapter classes (Swing)
- `SwingWorker` para tarefas pesadas
- `Platform.runLater` (JavaFX)
- `ExecutorService` para múltiplas threads

**Thread-safety**:
- Swing: `SwingUtilities.invokeLater()`
- JavaFX: `Platform.runLater()`

**Regra de Ouro**: Para **interface funcional** (1 método) em **Java 8+**, use **lambda** em vez de anonymous class. Para **Swing**, NUNCA atualize UI de thread diferente - use **SwingUtilities.invokeLater()**. Para **JavaFX**, use **Platform.runLater()**. Use **SwingWorker** para tarefas pesadas em Swing. Sempre **remova listeners** quando não precisar para evitar **memory leak**.
