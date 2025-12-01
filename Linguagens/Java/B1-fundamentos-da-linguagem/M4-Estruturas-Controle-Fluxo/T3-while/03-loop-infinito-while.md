# Loop Infinito com while

## 🎯 Introdução e Definição

### Definição Conceitual

Um **loop infinito** é um **loop que nunca termina naturalmente** porque sua **condição de parada nunca se torna false**. No `while`, isso ocorre quando a condição é **sempre true** ou quando as variáveis da condição **nunca são atualizadas** corretamente. Loops infinitos podem ser **intencionais** (servidores, event loops) ou **bugs** (esquecimento de atualização).

**Estrutura básica (intencional)**:
```java
while (true) {
    // código que executa indefinidamente
    // geralmente tem break, return ou throw para sair
}
```

**Analogia**: Um loop infinito é como uma **esteira rolante sem fim** - continua girando indefinidamente até alguém **apertar o botão de parada** (break) ou **desligar a máquina** (encerrar programa).

**Exemplo fundamental**:
```java
// Loop infinito intencional (com break)
while (true) {
    String entrada = scanner.nextLine();
    
    if (entrada.equals("sair")) {
        break;  // ← Saída explícita
    }
    
    System.out.println("Você digitou: " + entrada);
}
```

**Importância**:
- ✅ **Uso legítimo**: Servidores, GUIs, event loops
- ✅ **Simplicidade**: Evita condições complexas
- ⚠️ **Bug comum**: Esquecimento de atualização
- ⚠️ **Consome recursos**: CPU, memória
- ⚠️ **Dificulta debug**: Programa trava

---

## 📋 Sumário Conceitual

### Tipos de Loop Infinito

**1. Intencional com `while (true)`**: Planejado, com saída explícita
**2. Acidental (bug)**: Condição nunca fica false
**3. Sem atualização**: Esquecimento de modificar variáveis
**4. Lógica incorreta**: Atualização não alcança condição de parada
**5. Condição constante**: Expressão sempre avalia true

**Formas de Saída**:
- **break**: Saída imediata do loop
- **return**: Saída do método (e do loop)
- **throw**: Lança exceção
- **System.exit()**: Encerra programa (drástico)

---

## 🧠 Fundamentos Teóricos

### 1. Loop Infinito Intencional (`while (true)`)

**Uso mais comum**: Event loops, servidores, monitores.

```java
// Servidor sempre ativo
while (true) {
    Socket cliente = serverSocket.accept();  // Aguarda conexão
    processarCliente(cliente);
}
```

**Com break para saída controlada**:
```java
while (true) {
    String comando = scanner.nextLine();
    
    if (comando.equals("sair")) {
        break;  // ← Saída explícita
    }
    
    processarComando(comando);
}
```

**Vantagens**:
- ✅ **Clara intenção**: `while (true)` indica loop infinito explícito
- ✅ **Flexibilidade**: Múltiplas condições de saída (vários `if + break`)
- ✅ **Simplicidade**: Evita condições complexas no cabeçalho

**Desvantagens**:
- ⚠️ **Depende de saída explícita**: Deve ter `break`, `return` ou `throw`
- ⚠️ **Menos declarativo**: Condição de parada não está no cabeçalho

### 2. Loop Infinito Acidental (Bug) - Sem Atualização

**Causa mais comum**: Esquecimento de atualizar variável.

```java
// ❌ BUG: loop infinito (i nunca muda)
int i = 0;
while (i < 10) {
    System.out.println("i = " + i);
    // ESQUECEU i++: i sempre 0, condição sempre true
}

// ✅ Correto: atualiza i
int j = 0;
while (j < 10) {
    System.out.println("j = " + j);
    j++;  // Atualização: eventualmente j >= 10
}
```

**Detecção**:
- Programa **trava** (não responde)
- CPU em **100%** (processamento contínuo)
- IDE/terminal **não retorna** controle

### 3. Loop Infinito por Lógica Incorreta

**Incremento/decremento errado**:
```java
// ❌ BUG: i incrementa, mas condição nunca false
int i = 0;
while (i >= 0) {  // Condição: i >= 0
    System.out.println(i);
    i++;  // i cresce: 0, 1, 2, ... (sempre >= 0)
}

// ✅ Correto: decrementa para eventualmente < 0
int j = 10;
while (j >= 0) {
    System.out.println(j);
    j--;  // Eventualmente j < 0
}
```

**Atualiza variável errada**:
```java
// ❌ BUG: atualiza y, mas condição testa x
int x = 0;
int y = 0;
while (x < 10) {
    System.out.println(x);
    y++;  // ERRO: deveria ser x++
}
```

### 4. Múltiplas Saídas com break

```java
while (true) {
    String entrada = scanner.nextLine();
    
    // Saída 1: comando "sair"
    if (entrada.equals("sair")) {
        System.out.println("Encerrando...");
        break;
    }
    
    // Saída 2: comando "exit"
    if (entrada.equals("exit")) {
        System.out.println("Saindo...");
        break;
    }
    
    // Saída 3: número de tentativas
    tentativas++;
    if (tentativas >= MAX_TENTATIVAS) {
        System.out.println("Limite atingido");
        break;
    }
    
    processarEntrada(entrada);
}
```

### 5. Loop Infinito com return

**Saída pelo return** (em método):
```java
public String aguardarComando() {
    while (true) {
        String comando = scanner.nextLine();
        
        if (!comando.isEmpty()) {
            return comando;  // ← Retorna e sai do método/loop
        }
        
        System.out.println("Comando vazio, tente novamente");
    }
}
```

### 6. Loop Infinito com throw

**Saída por exceção**:
```java
public void processar() {
    int tentativas = 0;
    
    while (true) {
        tentativas++;
        
        if (tentativas > MAX_TENTATIVAS) {
            throw new RuntimeException("Limite de tentativas excedido");
        }
        
        if (tentarProcessar()) {
            break;  // Sucesso
        }
    }
}
```

### 7. Event Loop (Padrão Comum)

**GUI / Event-driven programming**:
```java
// Event loop simplificado
while (true) {
    Event evento = filaEventos.poll();  // Pega próximo evento
    
    if (evento == null) {
        Thread.sleep(10);  // Aguarda eventos
        continue;
    }
    
    if (evento.tipo == EventoTipo.SAIR) {
        break;  // Encerra aplicação
    }
    
    processarEvento(evento);
}
```

### 8. Game Loop

```java
boolean jogoAtivo = true;

while (jogoAtivo) {  // Equivalente a while (true) com flag
    atualizarEstado();
    renderizar();
    processarEntrada();
    
    if (jogadorVenceu() || jogadorPerdeu()) {
        jogoAtivo = false;  // ← Para o loop
    }
}
```

### 9. Servidor de Rede

```java
ServerSocket serverSocket = new ServerSocket(8080);

while (true) {  // Servidor sempre ativo
    Socket clienteSocket = serverSocket.accept();  // Bloqueia até conexão
    
    // Processa cliente em thread separada
    new Thread(() -> processarCliente(clienteSocket)).start();
}
```

### 10. Exemplos Práticos Completos

#### **Menu Interativo**
```java
public void exibirMenu() {
    Scanner scanner = new Scanner(System.in);
    
    while (true) {
        System.out.println("\n=== MENU ===");
        System.out.println("1 - Nova operação");
        System.out.println("2 - Consultar");
        System.out.println("3 - Relatório");
        System.out.println("0 - Sair");
        System.out.print("Escolha: ");
        
        String opcao = scanner.nextLine();
        
        switch (opcao) {
            case "1":
                novaOperacao();
                break;
            case "2":
                consultar();
                break;
            case "3":
                relatorio();
                break;
            case "0":
                System.out.println("Encerrando...");
                return;  // ← Sai do método e do loop
            default:
                System.out.println("Opção inválida!");
        }
    }
}
```

#### **Validação Persistente**
```java
public int lerNumeroPositivo() {
    Scanner scanner = new Scanner(System.in);
    
    while (true) {
        System.out.print("Digite um número positivo: ");
        
        try {
            int numero = scanner.nextInt();
            
            if (numero > 0) {
                return numero;  // ← Válido: sai do loop
            }
            
            System.out.println("Número deve ser positivo!");
            
        } catch (InputMismatchException e) {
            System.out.println("Entrada inválida! Digite um número.");
            scanner.nextLine();  // Limpa buffer
        }
    }
}
```

#### **Monitoramento Contínuo**
```java
public void monitorarSistema() {
    while (true) {
        double cpuUsage = obterUsoCPU();
        double memoryUsage = obterUsoMemoria();
        
        System.out.printf("CPU: %.2f%% | Memória: %.2f%%\n", 
                          cpuUsage, memoryUsage);
        
        if (cpuUsage > 90) {
            enviarAlerta("CPU alta: " + cpuUsage + "%");
        }
        
        try {
            Thread.sleep(5000);  // Aguarda 5 segundos
        } catch (InterruptedException e) {
            System.out.println("Monitoramento interrompido");
            break;  // Sai do loop
        }
    }
}
```

#### **Processamento de Fila**
```java
public void processarFila(Queue<Tarefa> fila) {
    while (true) {
        Tarefa tarefa = fila.poll();  // Remove e retorna (ou null se vazia)
        
        if (tarefa == null) {
            System.out.println("Fila vazia, aguardando...");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                break;
            }
            continue;
        }
        
        if (tarefa.getTipo() == TipoTarefa.ENCERRAR) {
            System.out.println("Comando de encerramento recebido");
            break;  // ← Sai do loop
        }
        
        executarTarefa(tarefa);
    }
}
```

#### **Retry com Limite (evita infinito real)**
```java
public boolean conectarComRetry(String url) {
    int tentativas = 0;
    final int MAX_TENTATIVAS = 5;
    
    while (true) {
        tentativas++;
        
        System.out.println("Tentativa " + tentativas + " de " + MAX_TENTATIVAS);
        
        if (tentarConectar(url)) {
            System.out.println("Conectado com sucesso!");
            return true;
        }
        
        if (tentativas >= MAX_TENTATIVAS) {
            System.out.println("Falha após " + MAX_TENTATIVAS + " tentativas");
            return false;  // ← Saída após limite
        }
        
        try {
            Thread.sleep(2000);  // Aguarda 2s antes de tentar novamente
        } catch (InterruptedException e) {
            return false;
        }
    }
}
```

#### **Chat Client (recebe mensagens)**
```java
public void receberMensagens(Socket socket) throws IOException {
    BufferedReader in = new BufferedReader(
        new InputStreamReader(socket.getInputStream())
    );
    
    while (true) {
        String mensagem = in.readLine();
        
        if (mensagem == null) {
            // Conexão encerrada pelo servidor
            System.out.println("Desconectado do servidor");
            break;
        }
        
        if (mensagem.equals("/quit")) {
            System.out.println("Encerrando chat...");
            break;
        }
        
        System.out.println("Mensagem: " + mensagem);
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### while (true) vs Condição Complexa

**Opção 1: while (true) com break**
```java
while (true) {
    String entrada = scanner.nextLine();
    
    if (entrada.equals("sair") || entrada.equals("exit")) {
        break;
    }
    
    processar(entrada);
}
```

**Opção 2: Condição no cabeçalho**
```java
String entrada = "";
while (!entrada.equals("sair") && !entrada.equals("exit")) {
    entrada = scanner.nextLine();
    
    if (!entrada.equals("sair") && !entrada.equals("exit")) {
        processar(entrada);
    }
}
```

**Comparação**:
- **while (true)**: Mais simples, condição no corpo (flexível)
- **Condição no cabeçalho**: Mais declarativo, mas pode ser verboso

### Impacto em Performance

**CPU**: Loop infinito sem pausas consome 100% CPU
```java
// ❌ Consome CPU desnecessariamente
while (true) {
    // Processamento contínuo sem pausa
}

// ✅ Pausa para liberar CPU
while (true) {
    Thread.sleep(100);  // Pausa 100ms
    // Processamento
}
```

### Quando Usar Loop Infinito Intencional

**✅ Use `while (true)` quando**:
- **Servidores**: Sempre aguardando conexões
- **Event loops**: GUI, jogos, sistemas reativos
- **Monitoramento**: Verificação contínua de status
- **Workers**: Processamento de fila de tarefas
- **Múltiplas saídas**: Várias condições de término

**❌ Evite quando**:
- **Número de iterações conhecido**: Use `for`
- **Condição simples**: Use `while (condição)`
- **Uma única condição de saída**: Coloque no cabeçalho

---

## 🎯 Aplicabilidade e Contextos

### 1. **Servidores Web/TCP**

```java
while (true) {
    Socket cliente = server.accept();
    new Thread(() -> atenderCliente(cliente)).start();
}
```

### 2. **Interfaces de Linha de Comando (CLI)**

```java
while (true) {
    String comando = lerComando();
    if (comando.equals("exit")) break;
    executarComando(comando);
}
```

### 3. **Game Loops**

```java
while (jogoAtivo) {  // Equivalente a while (true) com flag
    atualizar();
    renderizar();
}
```

### 4. **Processamento de Eventos**

```java
while (true) {
    Event e = filaEventos.take();
    if (e.tipo == SHUTDOWN) break;
    processar(e);
}
```

### 5. **Validação Robusta de Entrada**

```java
while (true) {
    try {
        int n = Integer.parseInt(scanner.nextLine());
        if (n > 0) return n;
    } catch (NumberFormatException e) {
        System.out.println("Inválido!");
    }
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Loop Infinito Acidental (Esqueceu Atualização)**

```java
// ❌ BUG: nunca para
int i = 0;
while (i < 10) {
    System.out.println(i);
    // ESQUECEU i++
}

// ✅ Correto
int j = 0;
while (j < 10) {
    System.out.println(j);
    j++;
}
```

### 2. **Sem Saída em `while (true)`**

```java
// ❌ BUG: sem break, return ou throw
while (true) {
    processar();
    // NUNCA sai
}

// ✅ Com saída
while (true) {
    if (condicao) {
        break;
    }
    processar();
}
```

### 3. **Consumo Excessivo de CPU**

```java
// ❌ CPU 100% (sem pausa)
while (true) {
    // Execução contínua
}

// ✅ Com pausa
while (true) {
    Thread.sleep(100);
    processar();
}
```

### 4. **Difícil de Interromper**

```java
// ❌ Não responde a Ctrl+C facilmente
while (true) {
    // Processamento pesado
}

// ✅ Verifica flag de interrupção
volatile boolean continuar = true;

while (continuar) {
    // Pode ser interrompido externamente
}
```

### 5. **Lógica de Saída Complexa**

```java
// ❌ Difícil entender quando sai
while (true) {
    if (a && b || c && !d) break;
    if (x > 10 && y < 5) break;
    if (flag1 || flag2) break;
    // ...
}

// ✅ Extraia para método
while (true) {
    if (deveParar()) break;
    // ...
}
```

### 6. **Esquecer de Limpar Recursos**

```java
// ❌ Pode vazar recursos
while (true) {
    File f = new File("temp.txt");
    // Processamento
    if (condicao) break;  // Esqueceu de deletar arquivo
}

// ✅ Finally ou try-with-resources
try {
    while (true) {
        // ...
    }
} finally {
    limparRecursos();
}
```

---

## 🔗 Interconexões Conceituais

- **break**: Principal forma de saída de `while (true)`
- **return**: Saída do método (e do loop)
- **throw**: Saída por exceção
- **continue**: Pula para próxima iteração (não sai)
- **Thread.sleep()**: Pausa para liberar CPU
- **Event loop**: Padrão arquitetural comum
- **Servidor**: Aplicação clássica de loop infinito

---

## 🚀 Boas Práticas

### 1. ✅ Documente Loop Infinito Intencional

```java
// ✅ Comentário explica
// Loop infinito: servidor sempre ativo (use shutdown() para parar)
while (true) {
    processarRequisicao();
}
```

### 2. ✅ Sempre Tenha Saída Explícita em `while (true)`

```java
// ✅ break, return ou throw presente
while (true) {
    String entrada = scanner.nextLine();
    
    if (entrada.equals("sair")) {
        break;  // ← Saída explícita
    }
}
```

### 3. ✅ Use Flag ao Invés de `while (true)` quando Possível

```java
// ✅ Flag mais declarativo
boolean executando = true;

while (executando) {
    // ...
    if (condicao) {
        executando = false;
    }
}

// ⚠️ while (true) menos claro
while (true) {
    // ...
    if (condicao) {
        break;
    }
}
```

### 4. ✅ Adicione Pausa em Loops de Monitoramento

```java
// ✅ Thread.sleep() libera CPU
while (true) {
    verificarStatus();
    Thread.sleep(1000);  // Pausa 1 segundo
}

// ❌ Sem pausa (CPU 100%)
while (true) {
    verificarStatus();
}
```

### 5. ✅ Limite Iterações como Segurança

```java
// ✅ Limite previne infinito real
int iteracoes = 0;
final int MAX_ITERACOES = 10000;

while (true) {
    iteracoes++;
    
    if (iteracoes >= MAX_ITERACOES) {
        throw new RuntimeException("Loop excedeu limite de segurança");
    }
    
    processar();
    
    if (condicao) break;
}
```

### 6. ✅ Use try-finally para Garantir Limpeza

```java
// ✅ finally garante execução mesmo com break/return
try {
    while (true) {
        processar();
        if (condicao) break;
    }
} finally {
    limparRecursos();  // SEMPRE executado
}
```

### 7. ✅ Prefira Nomes Descritivos para Flags

```java
// ✅ Nome descritivo
boolean servidorAtivo = true;
while (servidorAtivo) {
    // ...
}

// ❌ Nome genérico
boolean flag = true;
while (flag) {
    // ...
}
```

### 8. ✅ Forneça Forma de Interrupção Externa

```java
// ✅ volatile permite interrupção externa
volatile boolean executando = true;

public void iniciar() {
    while (executando) {
        processar();
    }
}

public void parar() {
    executando = false;  // Thread externo pode parar
}
```

### 9. ✅ Evite Lógica Complexa no Loop Infinito

```java
// ❌ Lógica complexa
while (true) {
    // 100 linhas de código
}

// ✅ Extraia para métodos
while (true) {
    processarIteracao();  // Lógica em método separado
    if (devePar()) break;
}
```

### 10. ✅ Teste com Timeout em Testes Unitários

```java
@Test(timeout = 1000)  // Falha se exceder 1 segundo
void testLoopNaoEhInfinito() {
    int count = 0;
    
    while (true) {
        count++;
        if (count >= 100) break;  // Garante saída
    }
    
    assertEquals(100, count);
}
```

---

## 📚 Resumo

Um **loop infinito** é um loop que **nunca termina naturalmente** porque sua condição **permanece true**. Pode ser **intencional** (`while (true)` com `break`/`return`) ou **acidental** (bug - esquecimento de atualização). **Usos legítimos**: servidores, event loops, GUIs, monitoramento, processamento de filas. **Saídas**: `break` (imediata), `return` (método), `throw` (exceção), `System.exit()` (programa). **Bug comum**: esquecer de atualizar variável (`i++`), causando condição sempre true. **Detecção**: programa trava, CPU 100%, não retorna controle. **Boas práticas**: documente `while (true)` intencional, sempre tenha saída explícita, use `Thread.sleep()` para liberar CPU, adicione limite de segurança (`MAX_ITERACOES`), use `try-finally` para garantir limpeza, prefira **flag booleano** (`while (executando)`) ao invés de `while (true)` quando aplicável. **Evite**: loops sem pausa (CPU 100%), lógica de saída complexa, esquecer limpeza de recursos. Teste com **timeout** em testes unitários.

