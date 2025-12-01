# 🔀 Substituição de Constantes com Switch

## 🎯 Introdução

**Substituir constantes int/String por enums com switch** transforma código frágil e propenso a erros em código **type-safe, verificável e auto-documentado**. Este padrão refatora decisões baseadas em "magic numbers" ou strings para decisões baseadas em **enums com switch expressions**, aproveitando verificação de completude do compilador e eliminando bugs de runtime causados por valores inválidos.

### Problema: Constantes Int/String

**Antes de Enums:**

```java
// ❌ Magic numbers - sem significado semântico
public class Pedido {
    public static final int STATUS_NOVO = 0;
    public static final int STATUS_PROCESSANDO = 1;
    public static final int STATUS_CONCLUIDO = 2;
    public static final int STATUS_CANCELADO = 3;

    private int status;

    public void processar() {
        if (status == 0) {  // 0? O que significa?
            System.out.println("Processando pedido novo");
            status = 1;
        } else if (status == 1) {
            System.out.println("Já está processando");
        } else if (status == 2) {
            System.out.println("Já concluído");
        } else {
            System.out.println("Status desconhecido");
        }
    }
}

// Problemas:
// 1. status pode receber qualquer int (999, -1, etc.)
// 2. Magic numbers difíceis de entender
// 3. Sem verificação de completude
// 4. Propenso a erros de digitação
```

**Com Enums e Switch:**

```java
// ✅ Type-safe, legível e verificável
public enum StatusPedido {
    NOVO, PROCESSANDO, CONCLUIDO, CANCELADO
}

public class Pedido {
    private StatusPedido status = StatusPedido.NOVO;

    public void processar() {
        switch (status) {
            case NOVO:
                System.out.println("Processando pedido novo");
                status = StatusPedido.PROCESSANDO;
                break;
            case PROCESSANDO:
                System.out.println("Já está processando");
                break;
            case CONCLUIDO:
                System.out.println("Já concluído");
                break;
            case CANCELADO:
                System.out.println("Pedido cancelado");
                break;
        }
        // Compilador avisa se falta algum case!
    }
}
```

## 📋 Fundamentos Teóricos

### Por Que Switch com Enum é Superior?

**1. Type-Safety**

```java
// ❌ Int aceita qualquer valor
int status = 999;  // Compila mas é inválido!

// ✅ Enum só aceita valores válidos
StatusPedido status = StatusPedido.NOVO;  // Type-safe
// status = 999;  // ERRO de compilação
```

**2. Verificação de Completude**

```java
// ✅ Compilador avisa se falta case
switch (status) {
    case NOVO:
        break;
    case PROCESSANDO:
        break;
    // Faltou CONCLUIDO e CANCELADO - compilador avisa!
}
```

**3. Refatoração Segura**

```java
// Ao adicionar nova constante ao enum:
public enum StatusPedido {
    NOVO, PROCESSANDO, CONCLUIDO, CANCELADO, DEVOLVIDO  // Nova!
}

// Todos os switches QUEBRAM até adicionar o case
// Compilador força atualização!
```

**4. Auto-Documentação**

```java
// Switch com enum é auto-explicativo
switch (status) {
    case NOVO -> processar();
    case CONCLUIDO -> notificar();
}

// vs números mágicos
if (status == 0) processar();
else if (status == 2) notificar();  // 2 = ???
```

## 🔍 Padrões de Refatoração

### Refatoração 1: Int Constants → Enum

**Antes:**

```java
public class HttpResponse {
    public static final int OK = 200;
    public static final int BAD_REQUEST = 400;
    public static final int NOT_FOUND = 404;
    public static final int SERVER_ERROR = 500;

    private int statusCode;

    public String getStatusMessage() {
        if (statusCode == 200) {
            return "OK";
        } else if (statusCode == 400) {
            return "Bad Request";
        } else if (statusCode == 404) {
            return "Not Found";
        } else if (statusCode == 500) {
            return "Internal Server Error";
        } else {
            return "Unknown";
        }
    }
}
```

**Depois:**

```java
public enum HttpStatus {
    OK(200, "OK"),
    BAD_REQUEST(400, "Bad Request"),
    NOT_FOUND(404, "Not Found"),
    SERVER_ERROR(500, "Internal Server Error");

    private final int codigo;
    private final String mensagem;

    HttpStatus(int codigo, String mensagem) {
        this.codigo = codigo;
        this.mensagem = mensagem;
    }

    public int getCodigo() { return codigo; }
    public String getMensagem() { return mensagem; }
}

public class HttpResponse {
    private HttpStatus status;

    public String getStatusMessage() {
        return switch (status) {
            case OK -> status.getMensagem();
            case BAD_REQUEST -> status.getMensagem();
            case NOT_FOUND -> status.getMensagem();
            case SERVER_ERROR -> status.getMensagem();
        };
        // Ou simplesmente: return status.getMensagem();
    }
}
```

### Refatoração 2: String Constants → Enum

**Antes:**

```java
public class Logger {
    public static final String LEVEL_DEBUG = "DEBUG";
    public static final String LEVEL_INFO = "INFO";
    public static final String LEVEL_WARN = "WARN";
    public static final String LEVEL_ERROR = "ERROR";

    private String level;

    public void log(String message) {
        if (level.equals("DEBUG")) {
            System.out.println("[DEBUG] " + message);
        } else if (level.equals("INFO")) {
            System.out.println("[INFO] " + message);
        } else if (level.equals("WARN")) {
            System.out.println("[WARN] " + message);
        } else if (level.equals("ERROR")) {
            System.err.println("[ERROR] " + message);
        }
    }
}

// Problemas:
// - level pode ser "debug" (lowercase) - bug!
// - Comparações de string são lentas
// - Propenso a typos
```

**Depois:**

```java
public enum LogLevel {
    DEBUG, INFO, WARN, ERROR;

    public String getPrefix() {
        return "[" + this.name() + "]";
    }
}

public class Logger {
    private LogLevel level;

    public void log(String message) {
        PrintStream output = switch (level) {
            case DEBUG, INFO -> System.out;
            case WARN, ERROR -> System.err;
        };

        output.println(level.getPrefix() + " " + message);
    }
}
```

### Refatoração 3: Boolean Flags → Enum

**Antes:**

```java
public class Usuario {
    private boolean isAtivo;
    private boolean isPremium;
    private boolean isVerificado;

    public void enviarNotificacao() {
        if (isAtivo && isVerificado) {
            if (isPremium) {
                enviarNotificacaoPremium();
            } else {
                enviarNotificacaoBasica();
            }
        }
    }
}

// Problema: lógica complexa com múltiplos booleanos
```

**Depois:**

```java
public enum TipoUsuario {
    INATIVO,
    BASICO,
    PREMIUM,
    VERIFICADO_BASICO,
    VERIFICADO_PREMIUM;

    public boolean podeReceberNotificacao() {
        return this != INATIVO;
    }

    public boolean isPremium() {
        return this == PREMIUM || this == VERIFICADO_PREMIUM;
    }

    public boolean isVerificado() {
        return this == VERIFICADO_BASICO || this == VERIFICADO_PREMIUM;
    }
}

public class Usuario {
    private TipoUsuario tipo;

    public void enviarNotificacao() {
        switch (tipo) {
            case INATIVO:
                // Não envia
                break;
            case BASICO:
                enviarNotificacaoBasica();
                break;
            case PREMIUM:
                enviarNotificacaoPremium();
                break;
            case VERIFICADO_BASICO:
                enviarNotificacaoBasica();
                break;
            case VERIFICADO_PREMIUM:
                enviarNotificacaoPremium();
                break;
        }
    }
}
```

### Refatoração 4: If-Else Chains → Switch Expression

**Antes:**

```java
public class Calculadora {
    public double calcular(String operador, double a, double b) {
        double resultado;

        if (operador.equals("+")) {
            resultado = a + b;
        } else if (operador.equals("-")) {
            resultado = a - b;
        } else if (operador.equals("*")) {
            resultado = a * b;
        } else if (operador.equals("/")) {
            if (b == 0) throw new ArithmeticException("Divisão por zero");
            resultado = a / b;
        } else {
            throw new IllegalArgumentException("Operador inválido: " + operador);
        }

        return resultado;
    }
}
```

**Depois:**

```java
public enum Operacao {
    SOMA("+") {
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    SUBTRACAO("-") {
        public double calcular(double a, double b) {
            return a - b;
        }
    },
    MULTIPLICACAO("*") {
        public double calcular(double a, double b) {
            return a * b;
        }
    },
    DIVISAO("/") {
        public double calcular(double a, double b) {
            if (b == 0) throw new ArithmeticException("Divisão por zero");
            return a / b;
        }
    };

    private final String simbolo;

    Operacao(String simbolo) {
        this.simbolo = simbolo;
    }

    public abstract double calcular(double a, double b);

    public String getSimbolo() {
        return simbolo;
    }

    // Reverse lookup
    private static final Map<String, Operacao> POR_SIMBOLO =
        Arrays.stream(values())
            .collect(Collectors.toMap(o -> o.simbolo, Function.identity()));

    public static Operacao porSimbolo(String simbolo) {
        return Optional.ofNullable(POR_SIMBOLO.get(simbolo))
            .orElseThrow(() -> new IllegalArgumentException("Operador inválido: " + simbolo));
    }
}

public class Calculadora {
    public double calcular(String operador, double a, double b) {
        Operacao operacao = Operacao.porSimbolo(operador);
        return operacao.calcular(a, b);
    }
}
```

### Refatoração 5: Polimorfismo com Switch Expression

**Antes:**

```java
public class Arquivo {
    private String tipo;  // "PDF", "EXCEL", "WORD"

    public void processar() {
        if (tipo.equals("PDF")) {
            System.out.println("Processando PDF");
            // lógica PDF
        } else if (tipo.equals("EXCEL")) {
            System.out.println("Processando Excel");
            // lógica Excel
        } else if (tipo.equals("WORD")) {
            System.out.println("Processando Word");
            // lógica Word
        }
    }
}
```

**Depois:**

```java
public enum TipoArquivo {
    PDF {
        public void processar(byte[] conteudo) {
            System.out.println("Processando PDF");
            // lógica PDF
        }
    },
    EXCEL {
        public void processar(byte[] conteudo) {
            System.out.println("Processando Excel");
            // lógica Excel
        }
    },
    WORD {
        public void processar(byte[] conteudo) {
            System.out.println("Processando Word");
            // lógica Word
        }
    };

    public abstract void processar(byte[] conteudo);
}

public class Arquivo {
    private TipoArquivo tipo;
    private byte[] conteudo;

    public void processar() {
        tipo.processar(conteudo);  // Polimorfismo!
    }
}
```

## 💡 Padrão: Migração Gradual

**Etapa 1: Criar Enum com Códigos**

```java
// Manter compatibilidade com código legado
public enum Status {
    ATIVO(0),
    INATIVO(1),
    PENDENTE(2);

    private final int codigo;

    Status(int codigo) {
        this.codigo = codigo;
    }

    public int getCodigo() {
        return codigo;
    }

    public static Status porCodigo(int codigo) {
        return Arrays.stream(values())
            .filter(s -> s.codigo == codigo)
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Código inválido: " + codigo));
    }
}
```

**Etapa 2: Deprecar Constantes**

```java
@Deprecated
public static final int STATUS_ATIVO = 0;
```

**Etapa 3: Refatorar Usos Gradualmente**

```java
// Antes
if (status == STATUS_ATIVO) { ... }

// Depois
if (Status.porCodigo(status) == Status.ATIVO) { ... }

// Final
if (statusEnum == Status.ATIVO) { ... }
```

## ⚡ Vantagens

**1. Eliminação de Magic Numbers**
```java
// Antes: if (status == 2) - 2 = ???
// Depois: if (status == Status.CONCLUIDO) - claro!
```

**2. Verificação de Completude**
```java
// Compilador força tratar todos os casos
```

**3. Refatoração Segura**
```java
// Adicionar nova constante quebra todos os switches até atualizar
```

**4. Performance**
```java
// Switch com enum é mais rápido que comparações de String
```

## ⚠️ Cuidados na Refatoração

**1. Manter Compatibilidade com APIs**

```java
// Se API pública expõe int, manter conversão
public int getStatusCodigo() {
    return status.getCodigo();
}
```

**2. Migração de Banco de Dados**

```java
// Usar JPA Converter para compatibilidade
@Converter
public class StatusConverter implements AttributeConverter<Status, Integer> {
    public Integer convertToDatabaseColumn(Status status) {
        return status.getCodigo();
    }

    public Status convertToEntityAttribute(Integer codigo) {
        return Status.porCodigo(codigo);
    }
}
```

## 🔗 Interconexões

**Relação com Switch Expression**: Enum maximiza poder de switch expressions

**Relação com Pattern Matching**: Base para pattern matching futuro

**Relação com Type-Safety**: Enum elimina erros de tipo em constantes
