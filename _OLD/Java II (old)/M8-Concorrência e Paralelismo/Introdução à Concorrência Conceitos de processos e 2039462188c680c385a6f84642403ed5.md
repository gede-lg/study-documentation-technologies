# Introdução à Concorrência: Conceitos de processos e threads

Beleza, Gedê! Vamos mergulhar na concorrência em Java, um tema super relevante para quem atua com backend, como você.

---

## Introdução à Concorrência: Conceitos de Processos e Threads

### 1. Introdução

No desenvolvimento de sistemas modernos, a capacidade de realizar múltiplas tarefas simultaneamente é um requisito fundamental. Seja para um servidor web que atende milhares de requisições ao mesmo tempo, ou para uma aplicação desktop que precisa manter a interface responsiva enquanto executa operações pesadas em segundo plano, a **concorrência** é a chave.

A concorrência em Java, e em qualquer linguagem, refere-se à habilidade de um sistema executar várias unidades de trabalho de forma sobreposta no tempo. Isso não significa necessariamente que as tarefas estão acontecendo *exatamente ao mesmo tempo* (paralelismo real), mas sim que o sistema gerencia a execução de modo que parece que estão.

No contexto da programação, os dois conceitos fundamentais que nos permitem alcançar a concorrência são **processos** e **threads**. Entender a diferença e a relação entre eles é crucial para projetar sistemas eficientes, escaláveis e robustos.

- Um **processo** é uma instância independente de um programa em execução. Ele possui seu próprio espaço de memória, recursos (como arquivos abertos, descritores de rede) e é isolado de outros processos. Pense em cada aplicativo que você abre no seu computador (navegador, editor de texto, etc.) como um processo separado.
- Uma **thread**, por outro lado, é uma unidade de execução dentro de um processo. Múltiplas threads podem existir dentro do mesmo processo e compartilhar seu espaço de memória e recursos. Elas são como "subprogramas" que podem ser executados concorrentemente. Em um navegador web, por exemplo, uma thread pode ser responsável por carregar imagens, enquanto outra processa scripts JavaScript e uma terceira mantém a interface do usuário responsiva.

### 2. Sumário

- **O que é Concorrência?**
- **Processos**
    - Definição e características
    - Gerenciamento de recursos
- **Threads**
    - Definição e características
    - Compartilhamento de recursos
    - Vantagens e desvantagens
- **Diferenças e Semelhanças entre Processos e Threads**
- **Aplicações da Concorrência em Java**
- **Informações Adicionais**
    - Concorrência vs. Paralelismo
    - Context Switching
- **Referências para Estudo Independente**

---

### 3. Conteúdo Detalhado

### O que é Concorrência?

**Concorrência** é a capacidade de um sistema lidar com várias tarefas ao mesmo tempo, independentemente de estarem realmente sendo executadas simultaneamente (paralelismo) ou apenas parecendo estar (através de alternância rápida de CPU). O objetivo principal é melhorar a **utilização da CPU** e a **capacidade de resposta** do sistema. Por exemplo, em um servidor backend, a concorrência permite que ele processe várias requisições de usuários sem que uma requisição precise esperar a conclusão da outra.

### Processos

Um **processo** é a unidade de alocação de recursos mais granular que o sistema operacional gerencia. Cada processo tem seu próprio:

- **Espaço de Endereçamento de Memória:** Um processo não pode acessar a memória de outro processo diretamente, garantindo isolamento e segurança.
- **Tabela de Descritores de Arquivo:** Gerencia os arquivos e dispositivos de I/O que o processo está utilizando.
- **Contadores de Programa:** Cada processo tem seu próprio conjunto de registradores de CPU e um contador de programa que aponta para a próxima instrução a ser executada.

**Gerenciamento de recursos:** O sistema operacional é responsável por criar, agendar, gerenciar e destruir processos. A comunicação entre processos (IPC - Inter-Process Communication) é mais complexa e envolve mecanismos como pipes, sockets, memória compartilhada, etc.

### Threads

Uma **thread** (ou *linha de execução*) é a menor unidade de processamento que pode ser agendada por um sistema operacional. Diferente dos processos, as threads dentro do mesmo processo:

- **Compartilham o mesmo espaço de endereço de memória:** Isso significa que todas as threads de um processo podem acessar os mesmos dados e código. Isso facilita a comunicação e o compartilhamento de dados entre threads, mas também introduz desafios como **condições de corrida** e **deadlocks**, que exigem sincronização.
- **Compartilham recursos do processo:** Isso inclui arquivos abertos, conexões de rede e outras estruturas de dados.
- **Possuem seu próprio contador de programa, pilha de execução e conjunto de registradores.**

**Vantagens das Threads:**

- **Melhor Utilização da CPU:** Em sistemas multi-core, diferentes threads podem ser executadas em diferentes núcleos de CPU, resultando em paralelismo real. Mesmo em um único core, a alternância rápida entre threads pode dar a impressão de execução simultânea.
- **Maior Capacidade de Resposta:** Uma thread pode realizar uma tarefa demorada em segundo plano sem "congelar" a aplicação principal (e.g., uma interface de usuário).
- **Economia de Recursos:** Criar uma thread é muito mais leve (em termos de memória e tempo) do que criar um novo processo, pois elas compartilham recursos.
- **Comunicação Simplificada:** O compartilhamento de memória entre threads no mesmo processo facilita a troca de dados.

**Desvantagens das Threads:**

- **Complexidade de Programação:** Gerenciar threads e garantir a segurança dos dados compartilhados (sincronização) é notoriamente difícil e propenso a erros (condições de corrida, deadlocks, livelocks).
- **Depuração Desafiadora:** Problemas de concorrência podem ser intermitentes e difíceis de reproduzir e depurar.
- **Overhead de Sincronização:** Embora as threads economizem recursos na criação, o uso excessivo de mecanismos de sincronização pode introduzir seu próprio overhead de desempenho.

### Diferenças e Semelhanças entre Processos e Threads

| Característica | Processo | Thread |
| --- | --- | --- |
| **Isolamento** | Altíssimo (memória e recursos independentes) | Baixo (compartilha memória e recursos do processo) |
| **Custo de Criação** | Alto (mais recursos, mais tempo) | Baixo (menos recursos, menos tempo) |
| **Custo de Comunicação** | Alto (requer IPC) | Baixo (compartilha memória) |
| **Tolerância a Falhas** | Uma falha em um processo geralmente não afeta outros processos | Uma falha em uma thread pode derrubar o processo inteiro |
| **Escalonamento** | Escalonado pelo sistema operacional | Escalonado pelo sistema operacional (dentro do processo) |

### 4. Exemplos de Código Otimizados

Em Java, você geralmente não cria processos diretamente, mas sim threads. A criação de processos geralmente envolve a execução de comandos do sistema operacional ou a invocação de outros programas.

A forma mais comum de trabalhar com concorrência em Java é através de **threads**.

### Exemplo Básico: Estendendo `Thread`

```java
// Exemplo 1: Estendendo a classe Thread
class MinhaThreadSimples extends Thread {
    private String nome;

    public MinhaThreadSimples(String nome) {
        this.nome = nome;
    }

    @Override
    public void run() {
        // O código a ser executado pela thread
        for (int i = 0; i < 5; i++) {
            System.out.println(nome + " está executando: " + i);
            try {
                // Simula um trabalho demorado
                Thread.sleep(100);
            } catch (InterruptedException e) {
                // Lidar com a interrupção da thread
                System.out.println(nome + " foi interrompida.");
                Thread.currentThread().interrupt(); // Re-interromper a thread
            }
        }
        System.out.println(nome + " terminou.");
    }
}

public class ExemploThread1 {
    public static void main(String[] args) {
        // Criando e iniciando duas threads
        MinhaThreadSimples thread1 = new MinhaThreadSimples("Thread A");
        MinhaThreadSimples thread2 = new MinhaThreadSimples("Thread B");

        thread1.start(); // Inicia a execução da thread
        thread2.start(); // Inicia a execução da outra thread

        System.out.println("Main thread terminou.");
    }
}

```

### Exemplo Avançado: Implementando `Runnable` (Preferido)

Implementar a interface `Runnable` é geralmente a abordagem preferida em Java, pois permite que sua classe ainda herde de outra classe, se necessário, e promove uma melhor separação de responsabilidades.

```java
// Exemplo 2: Implementando a interface Runnable
class TarefaConcorrente implements Runnable {
    private String nomeTarefa;

    public TarefaConcorrente(String nomeTarefa) {
        this.nomeTarefa = nomeTarefa;
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("Tarefa " + nomeTarefa + " executando passo: " + i);
            try {
                Thread.sleep(150); // Simula trabalho
            } catch (InterruptedException e) {
                System.out.println("Tarefa " + nomeTarefa + " foi interrompida.");
                Thread.currentThread().interrupt();
            }
        }
        System.out.println("Tarefa " + nomeTarefa + " concluída.");
    }
}

public class ExemploThread2 {
    public static void main(String[] args) {
        // Criação de threads a partir de Runnables
        Thread worker1 = new Thread(new TarefaConcorrente("Download Imagens"));
        Thread worker2 = new Thread(new TarefaConcorrente("Processar Dados"));

        worker1.start();
        worker2.start();

        // Espera as threads terminarem (opcional, mas comum)
        try {
            worker1.join(); // A thread principal espera worker1 terminar
            worker2.join(); // A thread principal espera worker2 terminar
        } catch (InterruptedException e) {
            System.out.println("Main thread interrompida enquanto esperava workers.");
            Thread.currentThread().interrupt();
        }

        System.out.println("Todas as tarefas foram concluídas pela Main thread.");
    }
}

```

No dia a dia de um desenvolvedor backend, Gedê, você encontrará muito mais as threads sendo gerenciadas por *pools de threads* e frameworks como o Spring, que abstraem grande parte da complexidade de lidar com elas diretamente. No entanto, a base é sempre essa: `Thread` e `Runnable`.

### 5. Informações Adicionais

### Concorrência vs. Paralelismo

É importante distinguir entre **concorrência** e **paralelismo**:

- **Concorrência:** Refere-se à capacidade de um sistema lidar com várias tarefas que *progridem ao mesmo tempo*. Isso pode ser alcançado em um único núcleo de CPU através de `context switching` (onde a CPU alterna rapidamente entre tarefas, dando a ilusão de simultaneidade) ou em múltiplos núcleos.
- **Paralelismo:** Refere-se à execução *simultânea e real* de múltiplas tarefas em múltiplos recursos de processamento (por exemplo, múltiplos núcleos de CPU). Se você tem um processador multi-core, pode ter paralelismo real.

Todo paralelismo é concorrência, mas nem toda concorrência é paralelismo. A concorrência é um conceito mais amplo.

### Context Switching

O **context switching** (troca de contexto) é o mecanismo pelo qual o sistema operacional ou a JVM alterna o controle da CPU de uma thread/processo para outra. Quando uma thread/processo para de executar (por exemplo, porque o tempo de CPU alocado para ela terminou, ou ela está esperando por I/O), o estado atual dela (registros da CPU, contador de programa, etc.) é salvo. Então, o estado da próxima thread/processo a ser executado é carregado, e a execução continua. Este processo é um overhead, e o excesso de context switching pode diminuir o desempenho.

### 6. Referências para Estudo Independente

- **Documentação Oficial Java sobre Concorrência:**
    - [Java Concurrency (Oracle Tutorials)](https://docs.oracle.com/javase/tutorial/essential/concurrency/index.html)
- **Livros Relevantes:**
    - "Java Concurrency in Practice" por Brian Goetz et al. (Considerado a bíblia da concorrência em Java).
    - "Clean Code" por Robert C. Martin (aborda a importância de código limpo, inclusive em contextos concorrentes).
- **Artigos e Tutoriais:**
    - Pesquise por "Java Multithreading Tutorial" ou "Java Concurrency Tutorial" em sites como Baeldung, GeeksforGeeks, ou DigitalOcean para exemplos e explicações mais aprofundadas.

---

Espero que esta explicação detalhada ajude você a solidificar esses conceitos, Gedê! Entender bem processos e threads é um passo gigante para dominar os aspectos de concorrência em Java que você vai usar muito no seu dia a dia de desenvolvedor backend.

Qual o próximo tópico que você quer que a A.R.I.A. detalhe?