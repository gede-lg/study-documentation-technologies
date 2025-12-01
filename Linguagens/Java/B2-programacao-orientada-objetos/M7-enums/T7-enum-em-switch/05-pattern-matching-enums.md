# T7.05 - Pattern Matching com Enums

## Introdução

**Pattern matching** (Java 17+): switch com **patterns** além de constantes.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// Java 17+: Pattern matching em switch
public String processar(Object obj) {
    return switch (obj) {
        case Status s when s == Status.ATIVO -> "Status ativo";
        case Status s -> "Status: " + s.name();
        case String str -> "String: " + str;
        case Integer i -> "Número: " + i;
        case null -> "Valor nulo";
        default -> "Outro tipo";
    };
}

// ✅ Pattern matching: tipo + condição
// ✅ Guarded patterns (when)
// ✅ case null (Java 17+)
```

**Pattern matching** = switch com **tipos** e **condições**.

---

## Fundamentos

### 1. Pattern com Enum

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA, URGENTE
}

// Java 17+: Pattern matching
public String processar(Object obj) {
    return switch (obj) {
        case Prioridade p -> "Prioridade: " + p.name();
        case String s      -> "String: " + s;
        case Integer i     -> "Número: " + i;
        case null          -> "Nulo";
        default            -> "Outro";
    };
}

// ✅ case Prioridade p: pattern para enum
// ✅ p é variável do tipo Prioridade
```

### 2. Guarded Pattern (when)

```java
public enum Status {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

public String getDescricao(Status status, int dias) {
    return switch (status) {
        case NOVO when dias > 7 -> 
            "Pedido novo há mais de 7 dias";
        case NOVO -> 
            "Pedido novo recente";
        case APROVADO when dias > 3 -> 
            "Aprovado há mais de 3 dias";
        case APROVADO -> 
            "Aprovado recentemente";
        case ENVIADO, ENTREGUE, CANCELADO -> 
            "Status final: " + status;
    };
}

// ✅ when adiciona condição ao pattern
// ✅ Primeiro case que corresponder é executado
```

### 3. Pattern com Null (Java 17+)

```java
public enum TipoPagamento {
    DINHEIRO, PIX, DEBITO, CREDITO
}

public String processar(TipoPagamento tipo) {
    return switch (tipo) {
        case null          -> "Tipo não informado";
        case DINHEIRO, PIX -> "Sem taxa";
        case DEBITO        -> "Taxa de 1.5%";
        case CREDITO       -> "Taxa de 3%";
    };
}

// ✅ case null trata null explicitamente
// ✅ Evita NullPointerException
```

### 4. Enum em Pattern Matching Completo

```java
sealed interface Pagamento permits 
    PagamentoDinheiro, PagamentoPix, PagamentoCartao {}

record PagamentoDinheiro(double valor) implements Pagamento {}
record PagamentoPix(double valor, String chave) implements Pagamento {}
record PagamentoCartao(double valor, String numero, TipoCartao tipo) 
    implements Pagamento {}

public enum TipoCartao {
    DEBITO, CREDITO
}

public double calcularTaxa(Pagamento pagamento) {
    return switch (pagamento) {
        case PagamentoDinheiro d -> 0;
        case PagamentoPix p -> 0;
        case PagamentoCartao(var valor, var numero, TipoCartao.DEBITO) ->
            valor * 0.015;
        case PagamentoCartao(var valor, var numero, TipoCartao.CREDITO) ->
            valor * 0.03;
    };
}

// ✅ Pattern matching com record + enum
// ✅ Deconstruction pattern
```

### 5. Pattern com Múltiplos Enums

```java
public enum TipoUsuario {
    ADMIN, MODERADOR, USUARIO
}

public enum Acao {
    LER, ESCREVER, DELETAR
}

record Permissao(TipoUsuario usuario, Acao acao) {}

public boolean temPermissao(Permissao permissao) {
    return switch (permissao) {
        case Permissao(TipoUsuario.ADMIN, var acao) -> 
            true; // Admin pode tudo
        case Permissao(TipoUsuario.MODERADOR, Acao.LER) -> 
            true;
        case Permissao(TipoUsuario.MODERADOR, Acao.ESCREVER) -> 
            true;
        case Permissao(TipoUsuario.MODERADOR, Acao.DELETAR) -> 
            false;
        case Permissao(TipoUsuario.USUARIO, Acao.LER) -> 
            true;
        case Permissao(var usuario, var acao) -> 
            false; // Outros casos
    };
}

// ✅ Pattern matching com record contendo enums
// ✅ Deconstruction de record
```

### 6. Guard com Condição Complexa

```java
public enum StatusPedido {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

public String analisar(StatusPedido status, double valor, int diasEspera) {
    return switch (status) {
        case NOVO when valor > 1000 && diasEspera > 5 ->
            "Pedido alto valor aguardando há muito tempo";
        case NOVO when valor > 1000 ->
            "Pedido alto valor";
        case NOVO when diasEspera > 5 ->
            "Pedido aguardando há muito tempo";
        case NOVO ->
            "Pedido novo normal";
        case APROVADO when diasEspera > 3 ->
            "Aprovado atrasado";
        case APROVADO ->
            "Aprovado no prazo";
        case ENVIADO, ENTREGUE, CANCELADO ->
            "Status final";
    };
}

// ✅ Múltiplas condições no guard
// ✅ Ordem importa: mais específico primeiro
```

### 7. Pattern Matching com Instanceof

```java
public enum TipoMensagem {
    INFO, WARNING, ERROR
}

sealed interface Mensagem permits MensagemTexto, MensagemErro {}
record MensagemTexto(String texto, TipoMensagem tipo) implements Mensagem {}
record MensagemErro(String texto, Exception erro, TipoMensagem tipo) 
    implements Mensagem {}

public void processar(Mensagem mensagem) {
    switch (mensagem) {
        case MensagemTexto(var texto, TipoMensagem.INFO) ->
            System.out.println("[INFO] " + texto);
        case MensagemTexto(var texto, TipoMensagem.WARNING) ->
            System.out.println("[WARNING] " + texto);
        case MensagemTexto(var texto, TipoMensagem.ERROR) ->
            System.err.println("[ERROR] " + texto);
        case MensagemErro(var texto, var erro, var tipo) -> {
            System.err.println("[" + tipo + "] " + texto);
            erro.printStackTrace();
        }
    }
}

// ✅ Pattern matching com sealed interface + enum
```

### 8. Dominance Checking

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

public String processar(Status status) {
    return switch (status) {
        case ATIVO -> "Ativo";
        case Status s -> "Outro status: " + s;  // ← Domina INATIVO e PENDENTE
        // ❌ case INATIVO -> "Inativo";  // Unreachable (dominado)
    };
}

// ⚠️ Pattern genérico (Status s) domina cases específicos após ele
// ✅ Cases específicos devem vir ANTES do genérico

public String processar(Status status) {
    return switch (status) {
        case ATIVO   -> "Ativo";
        case INATIVO -> "Inativo";
        case PENDENTE -> "Pendente";
        case Status s -> "Outro";  // ✅ Nunca alcançado (exaustivo acima)
    };
}
```

### 9. Pattern com Default

```java
public enum Forma {
    CIRCULO, QUADRADO, RETANGULO
}

public String processar(Object obj) {
    return switch (obj) {
        case Forma.CIRCULO -> "Círculo";
        case Forma f       -> "Outra forma: " + f;
        case String s      -> "String: " + s;
        case null          -> "Nulo";
        default            -> "Outro tipo";
    };
}

// ✅ default trata tipos não cobertos
// ✅ Forma f cobre QUADRADO e RETANGULO
```

### 10. Pattern Matching Prático

```java
public enum TipoNotificacao {
    EMAIL, SMS, PUSH
}

sealed interface Notificacao permits 
    NotificacaoEmail, NotificacaoSMS, NotificacaoPush {}

record NotificacaoEmail(String destinatario, String assunto, String corpo, 
                        TipoNotificacao tipo) implements Notificacao {}
record NotificacaoSMS(String telefone, String mensagem, 
                      TipoNotificacao tipo) implements Notificacao {}
record NotificacaoPush(String dispositivo, String titulo, String mensagem, 
                       TipoNotificacao tipo) implements Notificacao {}

public void enviar(Notificacao notificacao) {
    switch (notificacao) {
        case NotificacaoEmail(var dest, var assunto, var corpo, var tipo) -> {
            System.out.println("Enviando email para " + dest);
            enviarEmail(dest, assunto, corpo);
        }
        case NotificacaoSMS(var tel, var msg, var tipo) -> {
            System.out.println("Enviando SMS para " + tel);
            enviarSMS(tel, msg);
        }
        case NotificacaoPush(var disp, var titulo, var msg, var tipo) -> {
            System.out.println("Enviando push para " + disp);
            enviarPush(disp, titulo, msg);
        }
    }
}

// ✅ Pattern matching desconstruindo records
// ✅ Enum dentro do record
```

---

## Aplicabilidade

**Pattern matching com enum** quando:
- Java 17+ disponível
- Combinar enum com **condições** (when)
- Tratar **null** explicitamente
- **Deconstruction** de records com enums
- Switch sobre **tipos** que incluem enums

**Vantagens**:
- Mais expressivo
- Condições inline (when)
- Tratar null seguro
- Deconstruction de records

---

## Armadilhas

### 1. Ordem de Patterns

```java
// ❌ Pattern genérico antes de específico
return switch (status) {
    case Status s -> "Qualquer";  // ← Domina todos
    case ATIVO -> "Ativo";        // ❌ Unreachable
};

// ✅ Específico antes de genérico
return switch (status) {
    case ATIVO -> "Ativo";
    case Status s -> "Outro";  // ✅
};
```

### 2. Guard Sempre False

```java
// ⚠️ Guard sempre false
case NOVO when false -> "Nunca executado";

// ✅ Guard com condição real
case NOVO when dias > 7 -> "Mais de 7 dias";
```

### 3. Null sem Case

```java
// ⚠️ Sem case null (NPE se null)
return switch (status) {
    case ATIVO -> "Ativo";
    // ⚠️ status null lança NPE
};

// ✅ Tratar null
return switch (status) {
    case null  -> "Nulo";
    case ATIVO -> "Ativo";
};
```

---

## Boas Práticas

### 1. Case Null Primeiro

```java
// ✅ Tratar null primeiro
return switch (status) {
    case null     -> "Nulo";
    case ATIVO    -> "Ativo";
    case INATIVO  -> "Inativo";
};
```

### 2. Patterns Específicos Antes

```java
// ✅ Mais específico primeiro
return switch (status) {
    case ATIVO when urgente -> "Ativo urgente";
    case ATIVO              -> "Ativo normal";
    case Status s           -> "Outro";
};
```

### 3. Guard Claro

```java
// ✅ Guard descritivo
case NOVO when valor > LIMITE_ALTO && diasEspera > DIAS_ALERTA ->
    "Pedido alto valor atrasado";
```

### 4. Deconstruction Legível

```java
// ✅ Variáveis descritivas
case NotificacaoEmail(var destinatario, var assunto, var corpo, var tipo) ->
    enviarEmail(destinatario, assunto, corpo);
```

---

## Resumo

**Pattern matching com enum** (Java 17+):

```java
public enum Status {
    NOVO, APROVADO, ENVIADO
}

// ✅ Pattern matching
public String processar(Status status, int dias) {
    return switch (status) {
        case null -> 
            "Status nulo";                    // ← Case null
        case NOVO when dias > 7 -> 
            "Novo há mais de 7 dias";        // ← Guard (when)
        case NOVO -> 
            "Novo recente";
        case APROVADO, ENVIADO -> 
            "Em andamento";
    };
}

// ✅ Com record
record Pedido(Status status, double valor) {}

public String analisar(Pedido pedido) {
    return switch (pedido) {
        case Pedido(Status.NOVO, var valor) when valor > 1000 ->
            "Pedido novo alto valor";         // ← Deconstruction + guard
        case Pedido(var status, var valor) ->
            "Status: " + status + ", Valor: " + valor;
    };
}
```

**Características**:
- **Pattern**: `case Tipo variavel`
- **Guard**: `when condicao`
- **Case null**: tratar null explicitamente
- **Deconstruction**: extrair componentes de record
- **Ordem**: específico antes de genérico
- **Dominance**: pattern genérico domina específicos após ele

**Recursos** (Java 17+):
- `case null`: tratar null
- `when`: condição (guarded pattern)
- Deconstruction de records
- Sealed types + pattern matching

**Regra de Ouro**: **Pattern matching** (Java 17+) adiciona **guards** (`when`) e **case null** ao switch. Use para combinar enum com **condições**. Patterns **específicos** antes de **genéricos**. **Deconstruction** de records com enums. **case null** evita NPE. **Exaustividade** garantida pelo compilador.
