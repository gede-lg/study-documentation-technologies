# T7.08 - Exemplo Prático: Máquina de Estados

## Introdução

**Máquina de estados** (State Machine): enum + switch para **transições** entre estados.

```java
public enum StatusPedido {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO, DEVOLVIDO
}

public class Pedido {
    private StatusPedido status;
    
    public Pedido() {
        this.status = StatusPedido.NOVO;
    }
    
    // ✅ Transição de estado com switch
    public void aprovar() {
        switch (status) {
            case NOVO -> status = StatusPedido.APROVADO;
            case APROVADO -> throw new IllegalStateException("Já aprovado");
            default -> throw new IllegalStateException(
                "Não pode aprovar pedido com status: " + status
            );
        }
    }
    
    public void enviar() {
        switch (status) {
            case APROVADO -> status = StatusPedido.ENVIADO;
            default -> throw new IllegalStateException(
                "Não pode enviar pedido com status: " + status
            );
        }
    }
}

// ✅ Máquina de estados: NOVO → APROVADO → ENVIADO → ENTREGUE
```

**State Machine** = gerenciar **transições** entre estados válidos.

---

## Fundamentos

### 1. Estados e Transições Básicas

```java
public enum EstadoDocumento {
    RASCUNHO, REVISAO, APROVADO, PUBLICADO, ARQUIVADO
}

public class Documento {
    private EstadoDocumento estado;
    
    public Documento() {
        this.estado = EstadoDocumento.RASCUNHO;
    }
    
    public void enviarParaRevisao() {
        switch (estado) {
            case RASCUNHO -> estado = EstadoDocumento.REVISAO;
            default -> throw new IllegalStateException(
                "Só pode enviar para revisão a partir de RASCUNHO"
            );
        }
    }
    
    public void aprovar() {
        switch (estado) {
            case REVISAO -> estado = EstadoDocumento.APROVADO;
            default -> throw new IllegalStateException(
                "Só pode aprovar documento em REVISAO"
            );
        }
    }
    
    public void publicar() {
        switch (estado) {
            case APROVADO -> estado = EstadoDocumento.PUBLICADO;
            default -> throw new IllegalStateException(
                "Só pode publicar documento APROVADO"
            );
        }
    }
    
    public void arquivar() {
        switch (estado) {
            case PUBLICADO -> estado = EstadoDocumento.ARQUIVADO;
            default -> throw new IllegalStateException(
                "Só pode arquivar documento PUBLICADO"
            );
        }
    }
}

// ✅ RASCUNHO → REVISAO → APROVADO → PUBLICADO → ARQUIVADO
```

### 2. Validação de Transições

```java
public enum StatusPedido {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

public class Pedido {
    private StatusPedido status = StatusPedido.NOVO;
    
    // ✅ Validar se pode transicionar
    public boolean podeAprovar() {
        return switch (status) {
            case NOVO -> true;
            default -> false;
        };
    }
    
    public boolean podeEnviar() {
        return switch (status) {
            case APROVADO -> true;
            default -> false;
        };
    }
    
    public boolean podeCancelar() {
        return switch (status) {
            case NOVO, APROVADO -> true;
            case ENVIADO, ENTREGUE, CANCELADO -> false;
        };
    }
    
    // ✅ Executar transição com validação
    public void aprovar() {
        if (!podeAprovar()) {
            throw new IllegalStateException(
                "Não pode aprovar pedido com status: " + status
            );
        }
        status = StatusPedido.APROVADO;
    }
}
```

### 3. Próximos Estados Possíveis

```java
public enum StatusTarefa {
    NOVA, EM_ANDAMENTO, CONCLUIDA, CANCELADA
}

public class Tarefa {
    private StatusTarefa status = StatusTarefa.NOVA;
    
    // ✅ Retornar próximos estados possíveis
    public List<StatusTarefa> getProximosEstadosPossiveis() {
        return switch (status) {
            case NOVA -> 
                List.of(StatusTarefa.EM_ANDAMENTO, StatusTarefa.CANCELADA);
            case EM_ANDAMENTO -> 
                List.of(StatusTarefa.CONCLUIDA, StatusTarefa.CANCELADA);
            case CONCLUIDA, CANCELADA -> 
                List.of();  // Estado final
        };
    }
    
    public void transicionar(StatusTarefa novoStatus) {
        List<StatusTarefa> possiveis = getProximosEstadosPossiveis();
        if (!possiveis.contains(novoStatus)) {
            throw new IllegalStateException(
                String.format(
                    "Transição inválida de %s para %s. Estados possíveis: %s",
                    status, novoStatus, possiveis
                )
            );
        }
        status = novoStatus;
    }
}

// ✅ NOVA → [EM_ANDAMENTO, CANCELADA]
// ✅ EM_ANDAMENTO → [CONCLUIDA, CANCELADA]
```

### 4. Ações por Estado

```java
public enum EstadoConexao {
    DESCONECTADO, CONECTANDO, CONECTADO, DESCONECTANDO
}

public class Conexao {
    private EstadoConexao estado = EstadoConexao.DESCONECTADO;
    
    public void conectar() {
        switch (estado) {
            case DESCONECTADO -> {
                estado = EstadoConexao.CONECTANDO;
                System.out.println("Iniciando conexão...");
                realizarConexao();
                estado = EstadoConexao.CONECTADO;
                System.out.println("Conectado!");
            }
            case CONECTADO -> 
                System.out.println("Já conectado");
            default -> 
                throw new IllegalStateException("Não pode conectar em estado: " + estado);
        }
    }
    
    public void desconectar() {
        switch (estado) {
            case CONECTADO -> {
                estado = EstadoConexao.DESCONECTANDO;
                System.out.println("Desconectando...");
                realizarDesconexao();
                estado = EstadoConexao.DESCONECTADO;
                System.out.println("Desconectado!");
            }
            case DESCONECTADO -> 
                System.out.println("Já desconectado");
            default -> 
                throw new IllegalStateException("Não pode desconectar em estado: " + estado);
        }
    }
    
    private void realizarConexao() {
        // Lógica de conexão
    }
    
    private void realizarDesconexao() {
        // Lógica de desconexão
    }
}

// ✅ Ações específicas por transição
```

### 5. State Machine com Histórico

```java
public enum StatusPagamento {
    PENDENTE, PROCESSANDO, CONFIRMADO, FALHOU, CANCELADO
}

public class Pagamento {
    private StatusPagamento status = StatusPagamento.PENDENTE;
    private List<StatusPagamento> historico = new ArrayList<>();
    
    public Pagamento() {
        historico.add(status);
    }
    
    private void transicionar(StatusPagamento novoStatus) {
        status = novoStatus;
        historico.add(novoStatus);
        System.out.println("Transição: " + novoStatus);
    }
    
    public void processar() {
        switch (status) {
            case PENDENTE -> transicionar(StatusPagamento.PROCESSANDO);
            default -> throw new IllegalStateException(
                "Só pode processar pagamento PENDENTE"
            );
        }
    }
    
    public void confirmar() {
        switch (status) {
            case PROCESSANDO -> transicionar(StatusPagamento.CONFIRMADO);
            default -> throw new IllegalStateException(
                "Só pode confirmar pagamento PROCESSANDO"
            );
        }
    }
    
    public void falhar() {
        switch (status) {
            case PROCESSANDO -> transicionar(StatusPagamento.FALHOU);
            default -> throw new IllegalStateException(
                "Só pode falhar pagamento PROCESSANDO"
            );
        }
    }
    
    public List<StatusPagamento> getHistorico() {
        return Collections.unmodifiableList(historico);
    }
}

// ✅ Histórico: [PENDENTE, PROCESSANDO, CONFIRMADO]
```

### 6. State Machine com Timeout

```java
public enum EstadoSessao {
    ATIVA, EXPIRADA, RENOVADA
}

public class Sessao {
    private EstadoSessao estado = EstadoSessao.ATIVA;
    private LocalDateTime ultimaAtividade = LocalDateTime.now();
    private static final Duration TIMEOUT = Duration.ofMinutes(30);
    
    public void verificarTimeout() {
        switch (estado) {
            case ATIVA -> {
                if (Duration.between(ultimaAtividade, LocalDateTime.now())
                    .compareTo(TIMEOUT) > 0) {
                    estado = EstadoSessao.EXPIRADA;
                    System.out.println("Sessão expirada por inatividade");
                }
            }
            case EXPIRADA -> 
                System.out.println("Sessão já expirada");
            default -> {}
        }
    }
    
    public void renovar() {
        switch (estado) {
            case ATIVA -> {
                ultimaAtividade = LocalDateTime.now();
                System.out.println("Sessão renovada");
            }
            case EXPIRADA -> {
                estado = EstadoSessao.RENOVADA;
                ultimaAtividade = LocalDateTime.now();
                System.out.println("Sessão renovada após expiração");
            }
            default -> 
                throw new IllegalStateException("Não pode renovar sessão");
        }
    }
}

// ✅ ATIVA → (timeout) → EXPIRADA → (renovar) → RENOVADA
```

### 7. State Machine com Callbacks

```java
public enum EstadoDownload {
    AGUARDANDO, BAIXANDO, PAUSADO, CONCLUIDO, ERRO
}

public class Download {
    private EstadoDownload estado = EstadoDownload.AGUARDANDO;
    private Consumer<EstadoDownload> onEstadoMudou;
    
    public void setOnEstadoMudou(Consumer<EstadoDownload> callback) {
        this.onEstadoMudou = callback;
    }
    
    private void transicionar(EstadoDownload novoEstado) {
        estado = novoEstado;
        if (onEstadoMudou != null) {
            onEstadoMudou.accept(novoEstado);
        }
    }
    
    public void iniciar() {
        switch (estado) {
            case AGUARDANDO, PAUSADO -> 
                transicionar(EstadoDownload.BAIXANDO);
            default -> 
                throw new IllegalStateException("Não pode iniciar download");
        }
    }
    
    public void pausar() {
        switch (estado) {
            case BAIXANDO -> 
                transicionar(EstadoDownload.PAUSADO);
            default -> 
                throw new IllegalStateException("Não pode pausar download");
        }
    }
    
    public void concluir() {
        switch (estado) {
            case BAIXANDO -> 
                transicionar(EstadoDownload.CONCLUIDO);
            default -> 
                throw new IllegalStateException("Não pode concluir download");
        }
    }
}

// ✅ Uso
Download download = new Download();
download.setOnEstadoMudou(estado -> 
    System.out.println("Estado mudou para: " + estado)
);
download.iniciar();  // "Estado mudou para: BAIXANDO"
```

### 8. State Machine Aninhado

```java
public enum EstadoPedido {
    NOVO, PROCESSANDO, FINALIZADO
}

public enum SubEstadoProcessando {
    VALIDANDO, SEPARANDO, EMBALANDO, ENVIANDO
}

public class Pedido {
    private EstadoPedido estado = EstadoPedido.NOVO;
    private SubEstadoProcessando subEstado;
    
    public void iniciarProcessamento() {
        switch (estado) {
            case NOVO -> {
                estado = EstadoPedido.PROCESSANDO;
                subEstado = SubEstadoProcessando.VALIDANDO;
            }
            default -> 
                throw new IllegalStateException("Pedido já em processamento");
        }
    }
    
    public void avancarSubEstado() {
        if (estado != EstadoPedido.PROCESSANDO) {
            throw new IllegalStateException("Pedido não está em processamento");
        }
        
        subEstado = switch (subEstado) {
            case VALIDANDO -> SubEstadoProcessando.SEPARANDO;
            case SEPARANDO -> SubEstadoProcessando.EMBALANDO;
            case EMBALANDO -> SubEstadoProcessando.ENVIANDO;
            case ENVIANDO -> {
                estado = EstadoPedido.FINALIZADO;
                yield null;  // Não há mais sub-estado
            }
        };
    }
}

// ✅ NOVO → PROCESSANDO [VALIDANDO → SEPARANDO → EMBALANDO → ENVIANDO] → FINALIZADO
```

### 9. State Machine com Rollback

```java
public enum EstadoTransacao {
    INICIADA, EXECUTANDO, CONFIRMADA, REVERTIDA
}

public class Transacao {
    private EstadoTransacao estado = EstadoTransacao.INICIADA;
    private Stack<Runnable> acoesRollback = new Stack<>();
    
    public void executar(Runnable acao, Runnable rollback) {
        switch (estado) {
            case INICIADA, EXECUTANDO -> {
                estado = EstadoTransacao.EXECUTANDO;
                try {
                    acao.run();
                    acoesRollback.push(rollback);
                } catch (Exception e) {
                    reverter();
                    throw e;
                }
            }
            default -> 
                throw new IllegalStateException("Transação não pode executar");
        }
    }
    
    public void confirmar() {
        switch (estado) {
            case EXECUTANDO -> {
                estado = EstadoTransacao.CONFIRMADA;
                acoesRollback.clear();
            }
            default -> 
                throw new IllegalStateException("Transação não pode ser confirmada");
        }
    }
    
    public void reverter() {
        switch (estado) {
            case EXECUTANDO -> {
                estado = EstadoTransacao.REVERTIDA;
                while (!acoesRollback.isEmpty()) {
                    acoesRollback.pop().run();
                }
            }
            default -> 
                throw new IllegalStateException("Transação não pode ser revertida");
        }
    }
}

// ✅ INICIADA → EXECUTANDO → (confirmar) CONFIRMADA
//                         → (reverter) REVERTIDA
```

### 10. State Machine Completo

```java
public enum EstadoPedido {
    NOVO, VALIDADO, PAGO, PROCESSANDO, ENVIADO, ENTREGUE, CANCELADO, DEVOLVIDO
}

public class PedidoCompleto {
    private EstadoPedido estado = EstadoPedido.NOVO;
    private List<String> logs = new ArrayList<>();
    
    private void log(String mensagem) {
        logs.add(LocalDateTime.now() + ": " + mensagem);
        System.out.println(mensagem);
    }
    
    public void validar() {
        switch (estado) {
            case NOVO -> {
                estado = EstadoPedido.VALIDADO;
                log("Pedido validado");
            }
            default -> throw new IllegalStateException("Não pode validar");
        }
    }
    
    public void pagar() {
        switch (estado) {
            case VALIDADO -> {
                estado = EstadoPedido.PAGO;
                log("Pagamento confirmado");
            }
            default -> throw new IllegalStateException("Não pode pagar");
        }
    }
    
    public void processar() {
        switch (estado) {
            case PAGO -> {
                estado = EstadoPedido.PROCESSANDO;
                log("Pedido em processamento");
            }
            default -> throw new IllegalStateException("Não pode processar");
        }
    }
    
    public void enviar() {
        switch (estado) {
            case PROCESSANDO -> {
                estado = EstadoPedido.ENVIADO;
                log("Pedido enviado");
            }
            default -> throw new IllegalStateException("Não pode enviar");
        }
    }
    
    public void entregar() {
        switch (estado) {
            case ENVIADO -> {
                estado = EstadoPedido.ENTREGUE;
                log("Pedido entregue");
            }
            default -> throw new IllegalStateException("Não pode entregar");
        }
    }
    
    public void cancelar() {
        switch (estado) {
            case NOVO, VALIDADO, PAGO -> {
                estado = EstadoPedido.CANCELADO;
                log("Pedido cancelado");
            }
            default -> throw new IllegalStateException("Não pode cancelar");
        }
    }
    
    public void devolver() {
        switch (estado) {
            case ENTREGUE -> {
                estado = EstadoPedido.DEVOLVIDO;
                log("Pedido devolvido");
            }
            default -> throw new IllegalStateException("Não pode devolver");
        }
    }
    
    public List<String> getLogs() {
        return Collections.unmodifiableList(logs);
    }
}

// ✅ Fluxo completo:
// NOVO → VALIDADO → PAGO → PROCESSANDO → ENVIADO → ENTREGUE → DEVOLVIDO
//     ↘ CANCELADO ↙
```

---

## Aplicabilidade

**Máquina de estados com enum** quando:
- Gerenciar **transições** entre estados
- Validar **fluxo** de estados
- Implementar **State pattern**
- Workflow, pedidos, documentos, conexões

**Vantagens**:
- Lógica centralizada
- Validação de transições
- Fácil adicionar estados/transições
- Histórico de estados
- Rollback

---

## Armadilhas

### 1. Transição Inválida Não Validada

```java
// ❌ Não valida transição
public void enviar() {
    status = StatusPedido.ENVIADO;  // ⚠️ Qualquer estado
}

// ✅ Validar transição
public void enviar() {
    if (status != StatusPedido.APROVADO) {
        throw new IllegalStateException("Só pode enviar pedido APROVADO");
    }
    status = StatusPedido.ENVIADO;
}
```

### 2. Estado Mutável Sem Controle

```java
// ❌ Status público
public StatusPedido status;  // ⚠️ Qualquer um pode alterar

// ✅ Status privado com métodos
private StatusPedido status;

public void aprovar() {
    // Validação e transição controlada
}
```

### 3. Falta de Histórico

```java
// ⚠️ Sem histórico
private StatusPedido status;

// ✅ Com histórico
private StatusPedido status;
private List<StatusPedido> historico = new ArrayList<>();
```

---

## Boas Práticas

### 1. Validar Transições

```java
// ✅ Validar antes de transicionar
if (!podeAprovar()) {
    throw new IllegalStateException("Não pode aprovar");
}
status = StatusPedido.APROVADO;
```

### 2. Histórico de Estados

```java
// ✅ Registrar histórico
private void transicionar(Status novoStatus) {
    historico.add(status);
    status = novoStatus;
}
```

### 3. Métodos de Validação

```java
// ✅ Métodos de validação
public boolean podeAprovar() {
    return status == StatusPedido.NOVO;
}
```

### 4. Mensagens Descritivas

```java
// ✅ Mensagem clara
throw new IllegalStateException(
    String.format("Não pode aprovar pedido com status %s", status)
);
```

---

## Resumo

**Máquina de estados**:

```java
public enum StatusPedido {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

public class Pedido {
    private StatusPedido status = StatusPedido.NOVO;
    
    public void aprovar() {
        switch (status) {
            case NOVO -> status = StatusPedido.APROVADO;
            default -> throw new IllegalStateException(
                "Não pode aprovar pedido: " + status
            );
        }
    }
    
    public void enviar() {
        switch (status) {
            case APROVADO -> status = StatusPedido.ENVIADO;
            default -> throw new IllegalStateException(
                "Não pode enviar pedido: " + status
            );
        }
    }
}

// ✅ NOVO → APROVADO → ENVIADO → ENTREGUE
```

**Características**:
- **Estados**: enum com constantes
- **Transições**: métodos que mudam estado
- **Validação**: switch valida transição
- **Histórico**: lista de estados anteriores
- **Callbacks**: notificar mudanças

**Padrões**:
- State pattern
- Validação de transições
- Próximos estados possíveis
- Ações por estado
- Histórico de estados
- Timeout
- Callbacks
- Rollback

**Regra de Ouro**: **Enum** + **switch** = máquina de estados simples e eficaz. **Validar** transições. **Histórico** de estados. **Métodos** de validação (`podeAprovar()`). Mensagens **descritivas**. Estado **privado** com métodos controlados. **Callbacks** para notificar mudanças.
