# Módulo 8: Concorrência e Multithreading

## 1. Fundamentos de Concorrência
### 1.1. Definição e importância da concorrência em programação
Concorrência em programação refere-se à capacidade de um sistema executar várias operações ou processos simultaneamente, melhorando a eficiência e a performance. É crucial em sistemas modernos, onde múltiplas tarefas precisam ser executadas em paralelo, como servidores web e aplicações interativas.

### 1.2. Diferença entre concorrência e paralelismo
Concorrência é o ato de executar várias tarefas ao mesmo tempo, mas não necessariamente simultaneamente. Paralelismo, por outro lado, é a execução simultânea de tarefas múltiplas, especialmente em sistemas com múltiplos núcleos de processamento.

### 1.3. Modelos de Concorrência em Java
Java oferece vários modelos para implementar concorrência, incluindo:
- Uso direto de Threads
- Executor Framework
- Java Concurrency API

#### Exemplo de Criação de Thread:
```java
class MyThread extends Thread {
    public void run() {
        System.out.println("Thread executando.");
    }
}

public class Main {
    public static void main(String[] args) {
        MyThread t = new MyThread();
        t.start();
    }
}
```

### 1.4. Estados de uma Thread
Entendendo os estados de uma thread em Java:
- Novo (New)
- Executável (Runnable)
- Bloqueado (Blocked)
- Esperando (Waiting

)
- Em tempo de espera limitado (Timed Waiting)
- Terminado (Terminated)

Estes estados são cruciais para entender o ciclo de vida de uma thread e como gerenciar threads de forma eficiente.

#### Exemplo de Estados de Thread:
```java
public class ThreadStateExample {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            System.out.println("Thread executada");
        });

        System.out.println("Estado: " + thread.getState());
        thread.start();
        System.out.println("Estado: " + thread.getState());
        Thread.sleep(200); // Simula algum processamento
        System.out.println("Estado: " + thread.getState());
        thread.join();
        System.out.println("Estado: " + thread.getState());
    }
}
```

### 1.5. Sincronização e Problemas Comuns
Discutir a importância da sincronização para evitar condições de corrida e como utilizar `synchronized`, `volatile` e locks para garantir a segurança de threads.

#### Exemplo de Sincronização:
```java
public class ContadorSincronizado {
    private int contador = 0;

    public synchronized void incrementar() {
        contador++;
    }

    public int getContador() {
        return contador;
    }
}
```

### 1.6. Comunicação Inter-Thread
Abordar técnicas para a comunicação entre threads, como `wait()`, `notify()` e `notifyAll()`.

#### Exemplo de Comunicação entre Threads:
```java
public class Data {
    private String packet;
    
    // True se o receptor deve esperar, False se o emissor deve esperar
    private boolean transfer = true;

    public synchronized void send(String packet) {
        while (!transfer) {
            try {
                wait();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("Thread interrompida");
            }
        }
        transfer = false;
        
        this.packet = packet;
        notifyAll();
    }

    public synchronized String receive() {
        while (transfer) {
            try {
                wait();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("Thread interrompida");
            }
        }
        transfer = true;

        notifyAll();
        return packet;
    }
}
```

---

Cada tópico é detalhado com exemplos de código para ilustrar conceitos chave da concorrência e multithreading em Java. Essa estrutura proporciona uma compreensão aprofundada e prática dos fundamentos essenciais para trabalhar com threads em Java.