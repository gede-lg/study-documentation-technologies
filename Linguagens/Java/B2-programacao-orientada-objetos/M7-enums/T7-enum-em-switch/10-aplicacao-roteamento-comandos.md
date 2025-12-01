# T7.10 - Aplicação: Roteamento de Comandos

## Introdução

**Roteamento de comandos**: switch com enum para **dispatcher** de ações.

```java
public enum Comando {
    CRIAR, EDITAR, DELETAR, LISTAR, BUSCAR, SAIR
}

public class ComandoHandler {
    public void executar(Comando comando, String... args) {
        switch (comando) {
            case CRIAR   -> criar(args);
            case EDITAR  -> editar(args);
            case DELETAR -> deletar(args);
            case LISTAR  -> listar();
            case BUSCAR  -> buscar(args);
            case SAIR    -> sair();
        }
    }
    
    private void criar(String... args) {
        System.out.println("Criando: " + String.join(", ", args));
    }
    
    private void editar(String... args) {
        System.out.println("Editando: " + String.join(", ", args));
    }
    
    private void deletar(String... args) {
        System.out.println("Deletando: " + String.join(", ", args));
    }
    
    private void listar() {
        System.out.println("Listando todos");
    }
    
    private void buscar(String... args) {
        System.out.println("Buscando: " + String.join(", ", args));
    }
    
    private void sair() {
        System.out.println("Saindo...");
        System.exit(0);
    }
}

// ✅ Uso
ComandoHandler handler = new ComandoHandler();
handler.executar(Comando.CRIAR, "usuario", "nome=João");
handler.executar(Comando.LISTAR);
```

**Command dispatcher** = rotear comandos para handlers.

---

## Fundamentos

### 1. CLI (Command Line Interface)

```java
public enum ComandoCLI {
    HELP, VERSION, INSTALL, UNINSTALL, UPDATE, LIST, EXIT
}

public class CLI {
    public void processar(String input) {
        String[] partes = input.split(" ");
        String comandoStr = partes[0].toUpperCase();
        
        ComandoCLI comando;
        try {
            comando = ComandoCLI.valueOf(comandoStr);
        } catch (IllegalArgumentException e) {
            System.out.println("Comando inválido: " + comandoStr);
            return;
        }
        
        String[] args = Arrays.copyOfRange(partes, 1, partes.length);
        executar(comando, args);
    }
    
    private void executar(ComandoCLI comando, String[] args) {
        switch (comando) {
            case HELP      -> exibirAjuda();
            case VERSION   -> exibirVersao();
            case INSTALL   -> instalar(args);
            case UNINSTALL -> desinstalar(args);
            case UPDATE    -> atualizar(args);
            case LIST      -> listar();
            case EXIT      -> sair();
        }
    }
    
    private void exibirAjuda() {
        System.out.println("""
            Comandos disponíveis:
            - help: Exibir ajuda
            - version: Exibir versão
            - install <pacote>: Instalar pacote
            - uninstall <pacote>: Desinstalar pacote
            - update: Atualizar todos
            - list: Listar pacotes
            - exit: Sair
            """);
    }
    
    private void exibirVersao() {
        System.out.println("Versão 1.0.0");
    }
    
    private void instalar(String[] args) {
        if (args.length == 0) {
            System.out.println("Erro: especifique o pacote");
            return;
        }
        System.out.println("Instalando: " + args[0]);
    }
    
    private void desinstalar(String[] args) {
        if (args.length == 0) {
            System.out.println("Erro: especifique o pacote");
            return;
        }
        System.out.println("Desinstalando: " + args[0]);
    }
    
    private void atualizar(String[] args) {
        System.out.println("Atualizando todos os pacotes...");
    }
    
    private void listar() {
        System.out.println("Pacotes instalados:");
        System.out.println("- pacote1");
        System.out.println("- pacote2");
    }
    
    private void sair() {
        System.out.println("Saindo...");
        System.exit(0);
    }
}

// ✅ Uso
CLI cli = new CLI();
cli.processar("install pacote-teste");
cli.processar("list");
cli.processar("help");
```

### 2. HTTP Router (REST API)

```java
public enum HttpMethod {
    GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
}

public enum Rota {
    USUARIOS, PRODUTOS, PEDIDOS, PAGAMENTOS
}

record Requisicao(HttpMethod metodo, Rota rota, String id, Map<String, String> corpo) {}

public class HttpRouter {
    public String processar(Requisicao req) {
        return switch (req.rota()) {
            case USUARIOS  -> rotearUsuarios(req);
            case PRODUTOS  -> rotearProdutos(req);
            case PEDIDOS   -> rotearPedidos(req);
            case PAGAMENTOS -> rotearPagamentos(req);
        };
    }
    
    private String rotearUsuarios(Requisicao req) {
        return switch (req.metodo()) {
            case GET    -> listarUsuarios(req.id());
            case POST   -> criarUsuario(req.corpo());
            case PUT    -> atualizarUsuario(req.id(), req.corpo());
            case DELETE -> deletarUsuario(req.id());
            default     -> "Método não suportado";
        };
    }
    
    private String listarUsuarios(String id) {
        if (id == null) {
            return "GET /usuarios - Todos os usuários";
        }
        return "GET /usuarios/" + id;
    }
    
    private String criarUsuario(Map<String, String> corpo) {
        return "POST /usuarios - Criando: " + corpo;
    }
    
    private String atualizarUsuario(String id, Map<String, String> corpo) {
        return "PUT /usuarios/" + id + " - Atualizando: " + corpo;
    }
    
    private String deletarUsuario(String id) {
        return "DELETE /usuarios/" + id;
    }
    
    private String rotearProdutos(Requisicao req) {
        return switch (req.metodo()) {
            case GET  -> "GET /produtos";
            case POST -> "POST /produtos";
            default   -> "Método não suportado";
        };
    }
    
    private String rotearPedidos(Requisicao req) {
        return "Pedidos: " + req.metodo();
    }
    
    private String rotearPagamentos(Requisicao req) {
        return "Pagamentos: " + req.metodo();
    }
}

// ✅ Uso
HttpRouter router = new HttpRouter();
Requisicao req1 = new Requisicao(HttpMethod.GET, Rota.USUARIOS, null, null);
Requisicao req2 = new Requisicao(HttpMethod.POST, Rota.USUARIOS, null, 
                                   Map.of("nome", "João"));
System.out.println(router.processar(req1));
System.out.println(router.processar(req2));
```

### 3. Event Handler (Observer Pattern)

```java
public enum TipoEvento {
    USUARIO_CRIADO, USUARIO_ATUALIZADO, USUARIO_DELETADO,
    PEDIDO_CRIADO, PEDIDO_APROVADO, PEDIDO_ENVIADO
}

record Evento(TipoEvento tipo, Map<String, Object> dados) {}

public class EventHandler {
    public void processar(Evento evento) {
        System.out.println("Processando evento: " + evento.tipo());
        
        switch (evento.tipo()) {
            case USUARIO_CRIADO     -> usuarioCriado(evento.dados());
            case USUARIO_ATUALIZADO -> usuarioAtualizado(evento.dados());
            case USUARIO_DELETADO   -> usuarioDeletado(evento.dados());
            case PEDIDO_CRIADO      -> pedidoCriado(evento.dados());
            case PEDIDO_APROVADO    -> pedidoAprovado(evento.dados());
            case PEDIDO_ENVIADO     -> pedidoEnviado(evento.dados());
        }
    }
    
    private void usuarioCriado(Map<String, Object> dados) {
        System.out.println("Novo usuário: " + dados.get("nome"));
        enviarEmailBoasVindas(dados);
    }
    
    private void usuarioAtualizado(Map<String, Object> dados) {
        System.out.println("Usuário atualizado: " + dados.get("id"));
    }
    
    private void usuarioDeletado(Map<String, Object> dados) {
        System.out.println("Usuário deletado: " + dados.get("id"));
        limparDados(dados);
    }
    
    private void pedidoCriado(Map<String, Object> dados) {
        System.out.println("Pedido criado: " + dados.get("id"));
        notificarVendedor(dados);
    }
    
    private void pedidoAprovado(Map<String, Object> dados) {
        System.out.println("Pedido aprovado: " + dados.get("id"));
        processarPagamento(dados);
    }
    
    private void pedidoEnviado(Map<String, Object> dados) {
        System.out.println("Pedido enviado: " + dados.get("id"));
        enviarEmailRastreamento(dados);
    }
    
    private void enviarEmailBoasVindas(Map<String, Object> dados) {
        // Lógica de email
    }
    
    private void limparDados(Map<String, Object> dados) {
        // Lógica de limpeza
    }
    
    private void notificarVendedor(Map<String, Object> dados) {
        // Lógica de notificação
    }
    
    private void processarPagamento(Map<String, Object> dados) {
        // Lógica de pagamento
    }
    
    private void enviarEmailRastreamento(Map<String, Object> dados) {
        // Lógica de rastreamento
    }
}

// ✅ Uso
EventHandler handler = new EventHandler();
Evento evento1 = new Evento(TipoEvento.USUARIO_CRIADO, 
                             Map.of("nome", "João", "email", "joao@example.com"));
Evento evento2 = new Evento(TipoEvento.PEDIDO_CRIADO, 
                             Map.of("id", "123", "valor", 100.0));
handler.processar(evento1);
handler.processar(evento2);
```

### 4. Command Pattern

```java
public enum TipoComando {
    ADICIONAR_CARRINHO, REMOVER_CARRINHO, ATUALIZAR_QUANTIDADE,
    FINALIZAR_COMPRA, CANCELAR_COMPRA
}

interface Command {
    void executar();
    void desfazer();
}

public class ComandoDispatcher {
    private Stack<Command> historico = new Stack<>();
    
    public void executar(TipoComando tipo, Map<String, Object> params) {
        Command comando = criarComando(tipo, params);
        comando.executar();
        historico.push(comando);
    }
    
    private Command criarComando(TipoComando tipo, Map<String, Object> params) {
        return switch (tipo) {
            case ADICIONAR_CARRINHO -> 
                new AdicionarCarrinhoCommand(params);
            case REMOVER_CARRINHO -> 
                new RemoverCarrinhoCommand(params);
            case ATUALIZAR_QUANTIDADE -> 
                new AtualizarQuantidadeCommand(params);
            case FINALIZAR_COMPRA -> 
                new FinalizarCompraCommand(params);
            case CANCELAR_COMPRA -> 
                new CancelarCompraCommand(params);
        };
    }
    
    public void desfazer() {
        if (!historico.isEmpty()) {
            Command comando = historico.pop();
            comando.desfazer();
        }
    }
}

class AdicionarCarrinhoCommand implements Command {
    private Map<String, Object> params;
    
    public AdicionarCarrinhoCommand(Map<String, Object> params) {
        this.params = params;
    }
    
    @Override
    public void executar() {
        System.out.println("Adicionando ao carrinho: " + params.get("produto"));
    }
    
    @Override
    public void desfazer() {
        System.out.println("Removendo do carrinho: " + params.get("produto"));
    }
}

// ✅ Outras classes Command...
```

### 5. Message Queue (Fila de Mensagens)

```java
public enum TipoMensagem {
    EMAIL, SMS, PUSH, WEBHOOK
}

record Mensagem(TipoMensagem tipo, String destinatario, String conteudo) {}

public class MessageDispatcher {
    public void processar(Mensagem mensagem) {
        switch (mensagem.tipo()) {
            case EMAIL   -> enviarEmail(mensagem);
            case SMS     -> enviarSMS(mensagem);
            case PUSH    -> enviarPush(mensagem);
            case WEBHOOK -> chamarWebhook(mensagem);
        }
    }
    
    private void enviarEmail(Mensagem msg) {
        System.out.println("Enviando email para: " + msg.destinatario());
        System.out.println("Conteúdo: " + msg.conteudo());
    }
    
    private void enviarSMS(Mensagem msg) {
        System.out.println("Enviando SMS para: " + msg.destinatario());
        System.out.println("Conteúdo: " + msg.conteudo());
    }
    
    private void enviarPush(Mensagem msg) {
        System.out.println("Enviando push para: " + msg.destinatario());
        System.out.println("Conteúdo: " + msg.conteudo());
    }
    
    private void chamarWebhook(Mensagem msg) {
        System.out.println("Chamando webhook: " + msg.destinatario());
        System.out.println("Payload: " + msg.conteudo());
    }
}
```

### 6. Calculator (Calculadora)

```java
public enum Operacao {
    SOMA, SUBTRACAO, MULTIPLICACAO, DIVISAO, POTENCIA, RAIZ
}

public class Calculator {
    public double calcular(Operacao operacao, double... valores) {
        return switch (operacao) {
            case SOMA -> 
                Arrays.stream(valores).sum();
            case SUBTRACAO -> 
                valores[0] - valores[1];
            case MULTIPLICACAO -> 
                Arrays.stream(valores).reduce(1.0, (a, b) -> a * b);
            case DIVISAO -> {
                if (valores[1] == 0) {
                    throw new ArithmeticException("Divisão por zero");
                }
                yield valores[0] / valores[1];
            }
            case POTENCIA -> 
                Math.pow(valores[0], valores[1]);
            case RAIZ -> {
                if (valores[0] < 0) {
                    throw new IllegalArgumentException("Raiz de número negativo");
                }
                yield Math.sqrt(valores[0]);
            }
        };
    }
}

// ✅ Uso
Calculator calc = new Calculator();
double soma = calc.calcular(Operacao.SOMA, 10, 5);           // 15.0
double divisao = calc.calcular(Operacao.DIVISAO, 10, 5);     // 2.0
double potencia = calc.calcular(Operacao.POTENCIA, 2, 3);    // 8.0
```

### 7. Game Input Handler

```java
public enum Acao {
    MOVER_CIMA, MOVER_BAIXO, MOVER_ESQUERDA, MOVER_DIREITA,
    PULAR, ATACAR, DEFENDER, PAUSAR, SAIR
}

public class GameInputHandler {
    private Jogador jogador;
    
    public GameInputHandler(Jogador jogador) {
        this.jogador = jogador;
    }
    
    public void processar(Acao acao) {
        switch (acao) {
            case MOVER_CIMA       -> jogador.mover(0, -1);
            case MOVER_BAIXO      -> jogador.mover(0, 1);
            case MOVER_ESQUERDA   -> jogador.mover(-1, 0);
            case MOVER_DIREITA    -> jogador.mover(1, 0);
            case PULAR            -> jogador.pular();
            case ATACAR           -> jogador.atacar();
            case DEFENDER         -> jogador.defender();
            case PAUSAR           -> pausarJogo();
            case SAIR             -> sairJogo();
        }
    }
    
    private void pausarJogo() {
        System.out.println("Jogo pausado");
    }
    
    private void sairJogo() {
        System.out.println("Saindo do jogo...");
    }
}

class Jogador {
    private int x, y;
    
    public void mover(int dx, int dy) {
        x += dx;
        y += dy;
        System.out.println("Movendo para (" + x + ", " + y + ")");
    }
    
    public void pular() {
        System.out.println("Pulando!");
    }
    
    public void atacar() {
        System.out.println("Atacando!");
    }
    
    public void defender() {
        System.out.println("Defendendo!");
    }
}
```

### 8. Workflow Engine

```java
public enum TipoAcao {
    VALIDAR_DADOS, APROVAR, REJEITAR, ENVIAR_EMAIL, ATUALIZAR_STATUS, LOGAR
}

record AcaoWorkflow(TipoAcao tipo, Map<String, Object> contexto) {}

public class WorkflowEngine {
    public void executar(List<AcaoWorkflow> acoes) {
        for (AcaoWorkflow acao : acoes) {
            executarAcao(acao);
        }
    }
    
    private void executarAcao(AcaoWorkflow acao) {
        System.out.println("Executando: " + acao.tipo());
        
        switch (acao.tipo()) {
            case VALIDAR_DADOS    -> validarDados(acao.contexto());
            case APROVAR          -> aprovar(acao.contexto());
            case REJEITAR         -> rejeitar(acao.contexto());
            case ENVIAR_EMAIL     -> enviarEmail(acao.contexto());
            case ATUALIZAR_STATUS -> atualizarStatus(acao.contexto());
            case LOGAR            -> logar(acao.contexto());
        }
    }
    
    private void validarDados(Map<String, Object> ctx) {
        System.out.println("Validando dados: " + ctx);
    }
    
    private void aprovar(Map<String, Object> ctx) {
        System.out.println("Aprovando: " + ctx.get("id"));
    }
    
    private void rejeitar(Map<String, Object> ctx) {
        System.out.println("Rejeitando: " + ctx.get("id"));
    }
    
    private void enviarEmail(Map<String, Object> ctx) {
        System.out.println("Enviando email para: " + ctx.get("email"));
    }
    
    private void atualizarStatus(Map<String, Object> ctx) {
        System.out.println("Atualizando status: " + ctx.get("status"));
    }
    
    private void logar(Map<String, Object> ctx) {
        System.out.println("Log: " + ctx.get("mensagem"));
    }
}

// ✅ Uso
WorkflowEngine engine = new WorkflowEngine();
List<AcaoWorkflow> workflow = List.of(
    new AcaoWorkflow(TipoAcao.VALIDAR_DADOS, Map.of("id", "123")),
    new AcaoWorkflow(TipoAcao.APROVAR, Map.of("id", "123")),
    new AcaoWorkflow(TipoAcao.ENVIAR_EMAIL, Map.of("email", "user@example.com")),
    new AcaoWorkflow(TipoAcao.LOGAR, Map.of("mensagem", "Processo concluído"))
);
engine.executar(workflow);
```

### 9. API Gateway

```java
public enum Servico {
    AUTENTICACAO, USUARIOS, PRODUTOS, PEDIDOS, PAGAMENTOS, NOTIFICACOES
}

record Requisicao(Servico servico, String endpoint, Map<String, String> params) {}

public class APIGateway {
    private Map<Servico, String> servicosUrl = Map.of(
        Servico.AUTENTICACAO, "http://auth.api.com",
        Servico.USUARIOS, "http://users.api.com",
        Servico.PRODUTOS, "http://products.api.com",
        Servico.PEDIDOS, "http://orders.api.com",
        Servico.PAGAMENTOS, "http://payments.api.com",
        Servico.NOTIFICACOES, "http://notifications.api.com"
    );
    
    public String rotear(Requisicao req) {
        String baseUrl = servicosUrl.get(req.servico());
        String url = baseUrl + req.endpoint();
        
        return switch (req.servico()) {
            case AUTENTICACAO  -> chamarAutenticacao(url, req.params());
            case USUARIOS      -> chamarUsuarios(url, req.params());
            case PRODUTOS      -> chamarProdutos(url, req.params());
            case PEDIDOS       -> chamarPedidos(url, req.params());
            case PAGAMENTOS    -> chamarPagamentos(url, req.params());
            case NOTIFICACOES  -> chamarNotificacoes(url, req.params());
        };
    }
    
    private String chamarAutenticacao(String url, Map<String, String> params) {
        System.out.println("Chamando serviço de autenticação: " + url);
        return "Token: xyz123";
    }
    
    private String chamarUsuarios(String url, Map<String, String> params) {
        System.out.println("Chamando serviço de usuários: " + url);
        return "Usuários: [...]";
    }
    
    private String chamarProdutos(String url, Map<String, String> params) {
        System.out.println("Chamando serviço de produtos: " + url);
        return "Produtos: [...]";
    }
    
    private String chamarPedidos(String url, Map<String, String> params) {
        System.out.println("Chamando serviço de pedidos: " + url);
        return "Pedidos: [...]";
    }
    
    private String chamarPagamentos(String url, Map<String, String> params) {
        System.out.println("Chamando serviço de pagamentos: " + url);
        return "Pagamento processado";
    }
    
    private String chamarNotificacoes(String url, Map<String, String> params) {
        System.out.println("Chamando serviço de notificações: " + url);
        return "Notificação enviada";
    }
}
```

### 10. Plugin System

```java
public enum TipoPlugin {
    FORMATADOR, VALIDADOR, CONVERSOR, EXPORTADOR, IMPORTADOR
}

interface Plugin {
    String executar(Map<String, Object> params);
}

public class PluginManager {
    private Map<TipoPlugin, List<Plugin>> plugins = new HashMap<>();
    
    public void registrar(TipoPlugin tipo, Plugin plugin) {
        plugins.computeIfAbsent(tipo, k -> new ArrayList<>()).add(plugin);
    }
    
    public List<String> executar(TipoPlugin tipo, Map<String, Object> params) {
        List<Plugin> pluginsList = plugins.get(tipo);
        if (pluginsList == null) {
            return List.of();
        }
        
        return switch (tipo) {
            case FORMATADOR  -> executarFormatadores(pluginsList, params);
            case VALIDADOR   -> executarValidadores(pluginsList, params);
            case CONVERSOR   -> executarConversores(pluginsList, params);
            case EXPORTADOR  -> executarExportadores(pluginsList, params);
            case IMPORTADOR  -> executarImportadores(pluginsList, params);
        };
    }
    
    private List<String> executarFormatadores(List<Plugin> plugins, Map<String, Object> params) {
        return plugins.stream()
            .map(p -> p.executar(params))
            .collect(Collectors.toList());
    }
    
    private List<String> executarValidadores(List<Plugin> plugins, Map<String, Object> params) {
        return plugins.stream()
            .map(p -> p.executar(params))
            .collect(Collectors.toList());
    }
    
    private List<String> executarConversores(List<Plugin> plugins, Map<String, Object> params) {
        return plugins.stream()
            .map(p -> p.executar(params))
            .collect(Collectors.toList());
    }
    
    private List<String> executarExportadores(List<Plugin> plugins, Map<String, Object> params) {
        return plugins.stream()
            .map(p -> p.executar(params))
            .collect(Collectors.toList());
    }
    
    private List<String> executarImportadores(List<Plugin> plugins, Map<String, Object> params) {
        return plugins.stream()
            .map(p -> p.executar(params))
            .collect(Collectors.toList());
    }
}
```

---

## Aplicabilidade

**Roteamento de comandos** quando:
- Dispatcher de ações
- CLI, API router, event handler
- Command pattern
- Message queue
- Workflow engine

**Vantagens**:
- Centralizar roteamento
- Fácil adicionar comandos
- Tipo seguro
- Testável

---

## Armadilhas

### 1. Handler Não Implementado

```java
// ❌ Case sem implementação
switch (comando) {
    case CRIAR -> criar();
    case EDITAR -> {}  // ⚠️ Vazio
}

// ✅ Implementar ou lançar exceção
switch (comando) {
    case CRIAR -> criar();
    case EDITAR -> throw new UnsupportedOperationException("Não implementado");
}
```

### 2. Parâmetros Não Validados

```java
// ⚠️ Não valida parâmetros
private void criar(String... args) {
    String nome = args[0];  // ⚠️ ArrayIndexOutOfBoundsException
}

// ✅ Validar
private void criar(String... args) {
    if (args.length == 0) {
        throw new IllegalArgumentException("Nome obrigatório");
    }
    String nome = args[0];
}
```

### 3. Exceções Não Tratadas

```java
// ⚠️ Exceção não tratada
public void executar(Comando cmd) {
    switch (cmd) {
        case DELETAR -> deletar();  // ⚠️ Pode lançar exceção
    }
}

// ✅ Tratar exceções
public void executar(Comando cmd) {
    try {
        switch (cmd) {
            case DELETAR -> deletar();
        }
    } catch (Exception e) {
        System.err.println("Erro ao executar: " + e.getMessage());
    }
}
```

---

## Boas Práticas

### 1. Validar Entrada

```java
// ✅ Validar comando
try {
    Comando cmd = Comando.valueOf(input.toUpperCase());
    executar(cmd);
} catch (IllegalArgumentException e) {
    System.out.println("Comando inválido");
}
```

### 2. Handler por Método

```java
// ✅ Método separado para cada comando
private void criar() { }
private void editar() { }
private void deletar() { }
```

### 3. Parâmetros Tipados

```java
// ✅ Record para parâmetros
record ComandoParams(String id, Map<String, String> dados) {}

public void executar(Comando cmd, ComandoParams params) {
    switch (cmd) {
        case CRIAR -> criar(params.dados());
        case EDITAR -> editar(params.id(), params.dados());
    }
}
```

### 4. Tratamento de Erros

```java
// ✅ Try-catch por comando
switch (comando) {
    case CRIAR -> {
        try {
            criar();
        } catch (Exception e) {
            System.err.println("Erro ao criar: " + e);
        }
    }
}
```

---

## Resumo

**Roteamento de comandos**:

```java
public enum Comando {
    CRIAR, EDITAR, DELETAR, LISTAR
}

public class CommandHandler {
    public void executar(Comando comando, String... args) {
        switch (comando) {
            case CRIAR   -> criar(args);
            case EDITAR  -> editar(args);
            case DELETAR -> deletar(args);
            case LISTAR  -> listar();
        }
    }
    
    private void criar(String... args) {
        System.out.println("Criando: " + String.join(", ", args));
    }
    
    // Outros handlers...
}
```

**Aplicações**:
- CLI (Command Line Interface)
- HTTP Router (REST API)
- Event Handler (Observer)
- Command Pattern
- Message Queue
- Calculator
- Game Input
- Workflow Engine
- API Gateway
- Plugin System

**Características**:
- **Dispatcher**: rotear para handler correto
- **Tipo seguro**: enum valida comando
- **Testável**: fácil testar cada handler
- **Extensível**: fácil adicionar comandos

**Regra de Ouro**: **Enum** + **switch** = router/dispatcher eficaz. Cada comando = handler separado. **Validar** entrada e parâmetros. **Tratar** exceções. **Record** para parâmetros tipados. Padrão comum em CLI, API router, event handler, command pattern, message queue.
