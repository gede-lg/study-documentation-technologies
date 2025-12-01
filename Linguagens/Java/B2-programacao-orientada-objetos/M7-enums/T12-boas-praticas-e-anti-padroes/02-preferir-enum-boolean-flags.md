# T12.02 - Preferir Enum a Boolean em Flags Múltiplos

## Introdução

**Enum vs boolean**: múltiplos estados exigem enum, não boolean.

```java
// ❌ Múltiplos boolean (difícil de manter)
public class Tarefa {
    private boolean ativa;
    private boolean concluida;
    private boolean cancelada;
    
    // ⚠️ Estados inconsistentes possíveis:
    // ativa=true, concluida=true (impossível)
    // ativa=false, concluida=false, cancelada=false (qual o estado?)
}

// ✅ Enum (mutuamente exclusivo)
public enum StatusTarefa {
    ATIVA,
    CONCLUIDA,
    CANCELADA
}

public class Tarefa {
    private StatusTarefa status;
    
    // ✅ Sempre um estado válido
}
```

**Estados mutuamente exclusivos** = enum.

---

## Fundamentos

### 1. Problema com Múltiplos Boolean

```java
// ❌ Múltiplos boolean
public class Pedido {
    private boolean novo;
    private boolean pago;
    private boolean enviado;
    private boolean entregue;
    
    // ⚠️ Métodos complexos
    public boolean isPendente() {
        return novo && !pago && !enviado && !entregue;
    }
    
    public void marcarComoPago() {
        this.novo = false;
        this.pago = true;
        this.enviado = false;
        this.entregue = false;
    }
    
    // ⚠️ Muita lógica para validar estado
}

// ✅ Enum (simples)
public enum StatusPedido {
    NOVO,
    PAGO,
    ENVIADO,
    ENTREGUE
}

public class Pedido {
    private StatusPedido status = StatusPedido.NOVO;
    
    public boolean isPendente() {
        return status == StatusPedido.NOVO;
    }
    
    public void marcarComoPago() {
        this.status = StatusPedido.PAGO;
    }
}
```

### 2. Estados Inconsistentes

```java
// ❌ Boolean permite estados impossíveis
public class Lampada {
    private boolean ligada;
    private boolean queimada;
    
    // ⚠️ Estado impossível: ligada=true, queimada=true
    lampada.ligada = true;
    lampada.queimada = true; // ⚠️ Como pode estar ligada se está queimada?
}

// ✅ Enum garante consistência
public enum EstadoLampada {
    LIGADA,
    DESLIGADA,
    QUEIMADA
}

public class Lampada {
    private EstadoLampada estado;
    
    // ✅ Sempre um estado válido
}
```

### 3. Explosão de Combinações

```java
// ❌ Boolean cria explosão combinatória
public class Documento {
    private boolean rascunho;
    private boolean emRevisao;
    private boolean aprovado;
    private boolean publicado;
    
    // ⚠️ 2^4 = 16 combinações possíveis
    // Mas só 4 estados válidos
}

// ✅ Enum lista estados explícitos
public enum StatusDocumento {
    RASCUNHO,
    EM_REVISAO,
    APROVADO,
    PUBLICADO
}

public class Documento {
    private StatusDocumento status;
    
    // ✅ Apenas 4 estados possíveis
}
```

### 4. Dificuldade em Adicionar Estado

```java
// ❌ Adicionar novo estado com boolean
public class Processo {
    private boolean iniciado;
    private boolean pausado;
    private boolean concluido;
    
    // ⚠️ Adicionar "cancelado" exige:
    private boolean cancelado; // 1. Novo campo
    
    // 2. Atualizar TODOS os métodos
    public void iniciar() {
        this.iniciado = true;
        this.pausado = false;
        this.concluido = false;
        this.cancelado = false; // ⚠️ Adicionar em todos
    }
}

// ✅ Adicionar novo estado com enum
public enum StatusProcesso {
    NAO_INICIADO,
    INICIADO,
    PAUSADO,
    CONCLUIDO,
    CANCELADO // ✅ Só adicionar aqui
}

public class Processo {
    private StatusProcesso status;
    
    public void iniciar() {
        this.status = StatusProcesso.INICIADO; // ✅ Simples
    }
}
```

### 5. Switch Complexo com Boolean

```java
// ❌ Switch com boolean
public class Conexao {
    private boolean conectada;
    private boolean conectando;
    private boolean desconectada;
    
    public String getStatus() {
        if (conectando && !conectada && !desconectada) {
            return "Conectando";
        } else if (conectada && !conectando && !desconectada) {
            return "Conectada";
        } else if (desconectada && !conectando && !conectada) {
            return "Desconectada";
        } else {
            return "Estado inválido"; // ⚠️ Possível
        }
    }
}

// ✅ Switch com enum
public enum EstadoConexao {
    CONECTANDO,
    CONECTADA,
    DESCONECTADA
}

public class Conexao {
    private EstadoConexao estado;
    
    public String getStatus() {
        switch (estado) {
            case CONECTANDO:
                return "Conectando";
            case CONECTADA:
                return "Conectada";
            case DESCONECTADA:
                return "Desconectada";
            default:
                throw new IllegalStateException(); // ✅ Nunca acontece
        }
    }
}
```

### 6. Boolean é OK para Flags Independentes

```java
// ✅ Boolean OK para flags independentes
public class Usuario {
    private boolean ativo; // ✅ Independente
    private boolean premium; // ✅ Independente
    private boolean notificacoesEmail; // ✅ Independente
    
    // ✅ Combinações fazem sentido:
    // ativo=true, premium=true, notificacoesEmail=false (válido)
}

// ❌ Não usar enum aqui
public enum Flags {
    ATIVO,
    PREMIUM,
    NOTIFICACOES_EMAIL // ❌ Não são mutuamente exclusivos
}
```

### 7. EnumSet para Múltiplas Flags

```java
// ✅ EnumSet para múltiplas permissões
public enum Permissao {
    LER,
    ESCREVER,
    EXECUTAR,
    DELETAR
}

import java.util.*;

public class Usuario {
    private Set<Permissao> permissoes = EnumSet.noneOf(Permissao.class);
    
    public void adicionarPermissao(Permissao permissao) {
        permissoes.add(permissao);
    }
    
    public boolean temPermissao(Permissao permissao) {
        return permissoes.contains(permissao);
    }
}

// ✅ Uso
Usuario user = new Usuario();
user.adicionarPermissao(Permissao.LER);
user.adicionarPermissao(Permissao.ESCREVER);
boolean podeLer = user.temPermissao(Permissao.LER); // true
```

### 8. Transição de Estado com Enum

```java
// ❌ Boolean dificulta transição
public class Jogo {
    private boolean iniciado;
    private boolean pausado;
    private boolean terminado;
    
    public void pausar() {
        if (iniciado && !pausado && !terminado) {
            this.pausado = true;
            this.iniciado = false; // ⚠️ Confuso
        }
    }
}

// ✅ Enum facilita transição
public enum EstadoJogo {
    NAO_INICIADO,
    JOGANDO,
    PAUSADO,
    TERMINADO
}

public class Jogo {
    private EstadoJogo estado = EstadoJogo.NAO_INICIADO;
    
    public void pausar() {
        if (estado == EstadoJogo.JOGANDO) {
            estado = EstadoJogo.PAUSADO; // ✅ Claro
        }
    }
}
```

### 9. Debugging com Enum

```java
// ❌ Boolean dificulta debug
public class Worker {
    private boolean running;
    private boolean stopped;
    private boolean paused;
    
    // ⚠️ Debug: running=false, stopped=false, paused=false
    // Qual o estado real?
}

// ✅ Enum facilita debug
public enum WorkerState {
    IDLE,
    RUNNING,
    PAUSED,
    STOPPED
}

public class Worker {
    private WorkerState state = WorkerState.IDLE;
    
    // ✅ Debug: state=RUNNING (claro)
}
```

### 10. Validação com Enum

```java
// ❌ Boolean exige validação manual
public class Pedido {
    private boolean novo;
    private boolean pago;
    
    public void validar() {
        if (novo && pago) {
            throw new IllegalStateException("Pedido não pode ser novo e pago");
        }
    }
}

// ✅ Enum valida automaticamente
public enum StatusPedido {
    NOVO,
    PAGO
}

public class Pedido {
    private StatusPedido status;
    
    // ✅ Não precisa validar: sempre válido
}
```

---

## Aplicabilidade

**Enum em vez de boolean** quando:
- Estados mutuamente exclusivos
- Mais de 2 estados possíveis
- Adicionar estados no futuro
- Transições de estado

**Boolean OK** quando:
- Flags independentes
- Combinações fazem sentido

---

## Armadilhas

### 1. Múltiplos Boolean

```java
// ❌ Múltiplos boolean mutuamente exclusivos
private boolean ativo;
private boolean inativo;
private boolean bloqueado;

// ✅ Enum
public enum Status {
    ATIVO,
    INATIVO,
    BLOQUEADO
}
```

### 2. Lógica Complexa de Validação

```java
// ❌ Validação manual
if (novo && pago) {
    throw new IllegalStateException();
}

// ✅ Enum garante consistência
private StatusPedido status;
```

### 3. Usar Enum para Flags Independentes

```java
// ❌ Enum para flags independentes
public enum Flags {
    PREMIUM,
    NOTIFICACOES // ❌ Não são mutuamente exclusivos
}

// ✅ Boolean separado
private boolean premium;
private boolean notificacoes;
```

---

## Boas Práticas

### 1. Enum para Estados Mutuamente Exclusivos

```java
public enum Status {
    NOVO,
    EM_ANDAMENTO,
    CONCLUIDO
}
```

### 2. Boolean para Flags Independentes

```java
private boolean ativo;
private boolean premium;
```

### 3. EnumSet para Múltiplas Flags

```java
Set<Permissao> permissoes = EnumSet.of(
    Permissao.LER,
    Permissao.ESCREVER
);
```

### 4. Documentar Estados

```java
/**
 * Status do pedido.
 * Estados mutuamente exclusivos:
 * - NOVO: pedido criado
 * - PAGO: pagamento confirmado
 */
public enum StatusPedido {
    NOVO,
    PAGO
}
```

---

## Resumo

**Enum vs Boolean**:

```java
// ❌ Múltiplos boolean (inconsistente)
private boolean ativo;
private boolean inativo;
// ⚠️ Permite: ativo=true, inativo=true

// ✅ Enum (consistente)
public enum Status {
    ATIVO,
    INATIVO
}
private Status status;
// ✅ Sempre um estado válido
```

**Regra de Ouro**: **Enum** para estados **mutuamente exclusivos**. **Boolean** para flags **independentes**. **EnumSet** para múltiplas flags enum.
