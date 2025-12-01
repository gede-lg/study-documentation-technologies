# Métodos void

## 🎯 Introdução e Definição

**Métodos void** são métodos que **não retornam valor** ao chamador. A palavra-chave `void` indica que o método executa **ações** (side effects) como modificar estado, imprimir saída, gravar dados ou enviar mensagens, mas **não produz resultado** para ser usado em expressões. São chamados pela **ação que executam**, não pelo valor que retornam.

**Conceito central**: `void` = **ausência de retorno**. Método void é **procedimento** (faz algo) em vez de **função** (retorna algo). Executado por seus **efeitos colaterais** (mudar estado, interagir com sistema), não por resultado. É como **comando** que altera o mundo, não **query** que responde pergunta.

**Analogia completa**:
- **Método void**: Comando de ação ("Acenda a luz")
- **Método com retorno**: Pergunta com resposta ("Qual sua idade?" → 30)
- **void**: Executa tarefa sem devolver informação
- **return**: Fornece informação ao chamador
- **Side effect**: Mudança observável (luz acendeu, arquivo gravado, mensagem enviada)

**Estrutura**:
```java
public void nomeMetodo(parametros) {
//     ↑ void = não retorna valor
    
    // Executa ações (side effects)
    System.out.println("Ação");
    this.atributo = novoValor;
    enviarEmail();
    
    // Sem return (ou return; sem valor para sair antecipadamente)
}

// EXEMPLO:
public void exibir(String mensagem) {
    System.out.println(mensagem);  // Side effect: imprime no console
    // Não retorna nada
}

// Chamada:
exibir("Hello");  // Executa ação, não recebe valor de volta

// ❌ ERRO - void não pode ser atribuído:
String resultado = exibir("Hello");  // Erro de compilação
```

**Exemplo completo**:
```java
public class ContaBancaria {
    private double saldo;
    
    // Método VOID - modifica estado (side effect)
    public void depositar(double valor) {
        //   ↑ void
        this.saldo += valor;  // Altera atributo
        System.out.println("Depósito realizado: " + valor);
        // Não retorna nada
    }
    
    // Método VOID - imprime (side effect)
    public void exibirSaldo() {
        System.out.println("Saldo: R$ " + saldo);
        // Não retorna nada
    }
    
    // Método VOID - valida e lança exceção
    public void validarValor(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
        // Não retorna nada (lançar exceção também é "não retornar")
    }
    
    // Método COM RETORNO - consulta estado (sem side effect)
    public double getSaldo() {
        //   ↑ double (não void)
        return saldo;  // Retorna valor
    }
}

// USO:
ContaBancaria conta = new ContaBancaria();

// Métodos void - executados pela ação
conta.depositar(100.0);  // Altera saldo (não recebe retorno)
conta.exibirSaldo();     // Imprime (não recebe retorno)
conta.validarValor(50);  // Valida (não recebe retorno)

// Método com retorno - usado em expressões
double saldo = conta.getSaldo();  // Recebe valor (200.0)
System.out.println(conta.getSaldo());  // Usa retorno
```

## 📋 Fundamentos Teóricos

### 1️⃣ Declaração de Métodos void

**Sintaxe**:
```java
public void nomeMetodo() {
//     ↑ void = sem retorno
    // Código
}

public void nomeMetodo(String param) {
    // Código
}
```

**Sem parâmetros**:
```java
public void inicializar() {
    this.contador = 0;
    this.status = "Pronto";
    System.out.println("Inicializado");
}

// Chamada:
inicializar();  // Executa ação
```

**Com parâmetros**:
```java
public void setNome(String nome) {
    this.nome = nome;  // Altera atributo
}

public void enviarEmail(String destinatario, String assunto, String corpo) {
    // Envia email (side effect externo)
    emailService.send(destinatario, assunto, corpo);
}

// Chamadas:
setNome("João");
enviarEmail("user@email.com", "Assunto", "Mensagem");
```

### 2️⃣ return em Métodos void

**Conceito**: `void` pode usar `return;` **sem valor** para **sair antecipadamente**.

**Return para sair**:
```java
public void processar(String texto) {
    if (texto == null || texto.isEmpty()) {
        return;  // SAI do método (sem valor)
    }
    
    // Continua se texto válido
    System.out.println(texto.toUpperCase());
}

// Chamadas:
processar(null);   // Sai no return (não imprime)
processar("abc");  // Não entra no if, imprime "ABC"
```

**Return implícito**:
```java
public void exibir(String msg) {
    System.out.println(msg);
    // return; aqui é OPCIONAL (implícito ao final de void)
}

// Equivalente a:
public void exibir(String msg) {
    System.out.println(msg);
    return;  // Explícito mas desnecessário
}
```

**Múltiplos returns**:
```java
public void notificar(Usuario usuario, String mensagem) {
    if (usuario == null) {
        return;  // Sai
    }
    
    if (mensagem == null || mensagem.isEmpty()) {
        return;  // Sai
    }
    
    if (!usuario.isAtivo()) {
        return;  // Sai
    }
    
    // Enviar notificação
    emailService.enviar(usuario.getEmail(), mensagem);
}
```

**❌ ERRO - return com valor em void**:
```java
public void metodo() {
    return 10;  // ❌ ERRO: void não pode retornar valor
}

public void metodo() {
    return "texto";  // ❌ ERRO: void não pode retornar valor
}
```

### 3️⃣ Side Effects (Efeitos Colaterais)

**Conceito**: void executa **ações observáveis** além de retornar valor.

**Modificar estado do objeto**:
```java
public class Produto {
    private double preco;
    private int estoque;
    
    // Altera atributos (side effect)
    public void setPreco(double preco) {
        this.preco = preco;
    }
    
    public void diminuirEstoque(int quantidade) {
        this.estoque -= quantidade;
    }
}
```

**Imprimir/exibir**:
```java
public void exibir() {
    System.out.println("Nome: " + nome);
    System.out.println("Idade: " + idade);
}

public void log(String mensagem) {
    System.out.println("[LOG] " + mensagem);
}
```

**Gravar em arquivo/banco**:
```java
public void salvar() {
    database.save(this);  // Grava no banco
}

public void exportar(String arquivo) {
    fileWriter.write(arquivo, this.dados);  // Grava arquivo
}
```

**Enviar dados**:
```java
public void enviarNotificacao(String mensagem) {
    notificationService.send(mensagem);  // Envia push notification
}

public void publicar(Evento evento) {
    messageQueue.publish(evento);  // Publica em fila de mensagens
}
```

**Lançar exceção**:
```java
public void validar() {
    if (!isValido()) {
        throw new IllegalStateException("Estado inválido");
    }
}
```

### 4️⃣ Setters (Modificadores)

**Conceito**: Métodos void que **definem valores** de atributos.

**Setter básico**:
```java
public class Pessoa {
    private String nome;
    private int idade;
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public void setIdade(int idade) {
        this.idade = idade;
    }
}

// Uso:
Pessoa p = new Pessoa();
p.setNome("João");
p.setIdade(30);
```

**Setter com validação**:
```java
public void setIdade(int idade) {
    if (idade < 0) {
        throw new IllegalArgumentException("Idade não pode ser negativa");
    }
    if (idade > 150) {
        throw new IllegalArgumentException("Idade inválida");
    }
    this.idade = idade;
}

public void setEmail(String email) {
    if (email == null || !email.contains("@")) {
        throw new IllegalArgumentException("Email inválido");
    }
    this.email = email;
}
```

**Setter com side effects**:
```java
public void setAtivo(boolean ativo) {
    this.ativo = ativo;
    
    if (ativo) {
        System.out.println("Usuário ativado");
        enviarEmailBoasVindas();
    } else {
        System.out.println("Usuário desativado");
        limparSessoes();
    }
}
```

### 5️⃣ void vs Retorno de Valor

**Conceito**: Escolher void ou retornar valor depende do **propósito** do método.

**void - Comandos (ações)**:
```java
// Modifica estado
public void depositar(double valor) {
    this.saldo += valor;
}

// Imprime
public void exibir() {
    System.out.println(dados);
}

// Envia
public void enviar(String msg) {
    emailService.send(msg);
}
```

**Com retorno - Queries (consultas)**:
```java
// Consulta estado
public double getSaldo() {
    return this.saldo;
}

// Calcula e retorna
public int calcularIdade() {
    return LocalDate.now().getYear() - anoNascimento;
}

// Transforma e retorna
public String getNomeCompleto() {
    return nome + " " + sobrenome;
}
```

**Comparação**:
```
VOID (Comando):
- Executado pela AÇÃO
- Modifica estado ou sistema
- Não pode ser usado em expressões
- Exemplos: setNome(), salvar(), enviar()

COM RETORNO (Query):
- Executado pelo RESULTADO
- Não modifica estado (idealmente)
- Pode ser usado em expressões
- Exemplos: getNome(), calcular(), isValido()
```

**Command-Query Separation** (CQS):
```java
// ✓ BOA PRÁTICA - Separar comandos de queries

// Comando (void) - muda estado
public void depositar(double valor) {
    this.saldo += valor;
}

// Query (retorno) - consulta estado (sem mudar)
public double getSaldo() {
    return this.saldo;
}

// ❌ MÁ PRÁTICA - misturar comando e query
public double depositar(double valor) {
    this.saldo += valor;
    return this.saldo;  // Modifica E retorna (confuso)
}
```

### 6️⃣ void em Interfaces

**Conceito**: Interfaces podem declarar métodos void.

**Declaração**:
```java
public interface Runnable {
    void run();  // Método void abstrato
}

public interface EventListener {
    void onEvent(Event event);  // void
}
```

**Implementação**:
```java
public class MinhaTask implements Runnable {
    @Override
    public void run() {
        System.out.println("Executando tarefa");
    }
}

// Uso:
Runnable task = new MinhaTask();
task.run();  // Executa ação void
```

**Callback void**:
```java
public interface Callback {
    void onSuccess(String resultado);
    void onError(String erro);
}

public class Servico {
    public void executar(Callback callback) {
        try {
            String resultado = processar();
            callback.onSuccess(resultado);  // Chama void
        } catch (Exception e) {
            callback.onError(e.getMessage());  // Chama void
        }
    }
}
```

### 7️⃣ void e Method Chaining

**Conceito**: void **não permite** encadeamento. Para encadear, retorne `this`.

**❌ void - SEM encadeamento**:
```java
public class Produto {
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public void setPreco(double preco) {
        this.preco = preco;
    }
}

// Uso - chamadas separadas:
Produto p = new Produto();
p.setNome("Mouse");
p.setPreco(50.0);
```

**✓ Retornar this - COM encadeamento**:
```java
public class Produto {
    public Produto setNome(String nome) {
        //     ↑ Retorna Produto (não void)
        this.nome = nome;
        return this;  // Retorna próprio objeto
    }
    
    public Produto setPreco(double preco) {
        this.preco = preco;
        return this;
    }
}

// Uso - encadeamento:
Produto p = new Produto()
    .setNome("Mouse")
    .setPreco(50.0);
```

**Padrão Builder**:
```java
public class PedidoBuilder {
    private Pedido pedido = new Pedido();
    
    public PedidoBuilder cliente(Cliente cliente) {
        pedido.setCliente(cliente);
        return this;  // Encadear
    }
    
    public PedidoBuilder produto(Produto produto) {
        pedido.addProduto(produto);
        return this;
    }
    
    public Pedido build() {
        return pedido;  // Retorna pedido final
    }
}

// Uso:
Pedido pedido = new PedidoBuilder()
    .cliente(cliente)
    .produto(produto1)
    .produto(produto2)
    .build();
```

### 8️⃣ void e Atribuição

**Conceito**: void **não pode** ser atribuído a variável.

**❌ ERRO - atribuir void**:
```java
public void metodo() {
    System.out.println("Executando");
}

// ❌ ERRO:
String resultado = metodo();  // void não pode ser atribuído

int x = metodo();  // ❌ ERRO: incompatible types
```

**❌ ERRO - usar em expressão**:
```java
public void incrementar() {
    contador++;
}

// ❌ ERRO:
System.out.println(incrementar());  // void não produz valor

if (incrementar()) { }  // ❌ ERRO: void não é boolean
```

**✓ Chamada isolada**:
```java
public void exibir() {
    System.out.println("Hello");
}

// ✓ Correto - chamada isolada:
exibir();  // Executa, não atribui

// ✓ Correto - em bloco:
if (condicao) {
    exibir();  // OK
}

for (int i = 0; i < 10; i++) {
    exibir();  // OK
}
```

### 9️⃣ Conversão void → Com Retorno

**Conceito**: Converter void para retornar valor quando necessário.

**Retornar boolean (sucesso/falha)**:
```java
// ANTES (void):
public void depositar(double valor) {
    if (valor <= 0) {
        throw new IllegalArgumentException("Valor inválido");
    }
    this.saldo += valor;
}

// DEPOIS (boolean):
public boolean depositar(double valor) {
    if (valor <= 0) {
        return false;  // Falha
    }
    this.saldo += valor;
    return true;  // Sucesso
}

// Uso:
if (conta.depositar(100)) {
    System.out.println("Depósito realizado");
} else {
    System.out.println("Falha no depósito");
}
```

**Retornar this (encadeamento)**:
```java
// ANTES (void):
public void setNome(String nome) {
    this.nome = nome;
}

// DEPOIS (this):
public Produto setNome(String nome) {
    this.nome = nome;
    return this;
}

// Uso:
produto.setNome("Mouse").setPreco(50.0);
```

**Retornar valor útil**:
```java
// ANTES (void):
public void salvar() {
    database.save(this);
}

// DEPOIS (retorna ID gerado):
public int salvar() {
    return database.save(this);  // Retorna ID
}

// Uso:
int id = produto.salvar();
System.out.println("Salvo com ID: " + id);
```

### 🔟 void e Programação Funcional

**Conceito**: void em lambdas/streams representa **Consumer** (consome sem retornar).

**Consumer<T>**:
```java
// Interface Consumer - método void accept(T t)
Consumer<String> imprimir = s -> System.out.println(s);
//                                 ↑ void (não retorna)

// Uso:
imprimir.accept("Hello");  // Imprime "Hello"
```

**forEach** (void):
```java
List<String> nomes = Arrays.asList("João", "Maria", "Pedro");

// forEach - método void
nomes.forEach(nome -> System.out.println(nome));
//            ↑ Lambda void (imprime)

// Ou method reference:
nomes.forEach(System.out::println);
```

**vs map** (retorna):
```java
// map - retorna valor (Function<T, R>)
List<String> upper = nomes.stream()
    .map(nome -> nome.toUpperCase())  // Retorna String
    .collect(Collectors.toList());

// forEach - void (Consumer<T>)
nomes.forEach(nome -> System.out.println(nome));  // Não retorna
```

**BiConsumer<T, U>**:
```java
BiConsumer<String, Integer> exibir = (nome, idade) -> {
    System.out.println(nome + " - " + idade);
};

exibir.accept("João", 30);  // Executa void
```

## 🎯 Aplicabilidade

**1. Setters (modificar atributos)**
**2. Imprimir/exibir informações**
**3. Gravar dados (arquivo, banco)**
**4. Enviar mensagens/eventos**
**5. Validações (lançar exceções)**

## ⚠️ Armadilhas Comuns

**1. Tentar atribuir void**:
```java
int x = metodoVoid();  // ❌ ERRO
```

**2. Return com valor em void**:
```java
public void metodo() {
    return 10;  // ❌ ERRO
}
```

**3. Misturar comando e query**:
```java
public double depositar(double v) {
    saldo += v;
    return saldo;  // ⚠️ Confuso
}
```

**4. Não validar em setters**:
```java
public void setIdade(int idade) {
    this.idade = idade;  // ⚠️ Aceita qualquer valor
}
```

**5. Side effects em getters**:
```java
public int getContador() {
    contador++;  // ⚠️ Query não deveria mudar estado
    return contador;
}
```

## ✅ Boas Práticas

**1. Validar em setters**:
```java
if (valor < 0) throw new IllegalArgumentException();
```

**2. Separar comando de query**:
```java
void depositar(double v) { }  // Comando
double getSaldo() { }  // Query
```

**3. Documentar side effects**:
```java
/**
 * Envia email (side effect: comunicação externa)
 */
public void enviar() { }
```

**4. Usar return para sair**:
```java
if (invalido) return;  // Early return
```

**5. Preferir retornar this para encadeamento**:
```java
public Produto setNome(String nome) {
    this.nome = nome;
    return this;
}
```

## 📚 Resumo Executivo

**void = não retorna**.

**Declaração**:
```java
public void metodo() {
    // Ação
}
```

**Return**:
```java
public void metodo() {
    if (invalido) return;  // Sai (sem valor)
    // Continua
}
```

**Side effects**:
```java
public void depositar(double v) {
    saldo += v;  // Modifica estado
}

public void exibir() {
    System.out.println("Msg");  // Imprime
}
```

**Setters**:
```java
public void setNome(String nome) {
    this.nome = nome;
}
```

**void vs retorno**:
```java
// Comando (void):
void setNome(String s) { this.nome = s; }

// Query (retorno):
String getNome() { return nome; }
```

**Não pode**:
```java
// ❌ Atribuir:
int x = metodoVoid();

// ❌ Usar em expressão:
System.out.println(metodoVoid());

// ❌ Return valor:
public void metodo() { return 10; }
```

**Encadeamento**:
```java
// void - SEM encadear:
public void setNome(String s) { }

// this - COM encadear:
public Produto setNome(String s) {
    this.nome = s;
    return this;
}
```

**Consumer**:
```java
lista.forEach(item -> System.out.println(item));
//            ↑ Lambda void
```

**Evitar**:
- Atribuir void
- Misturar comando/query
- Side effects em getters

**Preferir**:
- Separar comando de query
- Validar em setters
- Documentar side effects
- Return this para encadeamento

**Recomendação**: Use **void para comandos** (ações que mudam estado), **retorno para queries** (consultas que não mudam estado), **valide em setters**, retorne **this para encadeamento**, documente **side effects**, separe **comando de query**.