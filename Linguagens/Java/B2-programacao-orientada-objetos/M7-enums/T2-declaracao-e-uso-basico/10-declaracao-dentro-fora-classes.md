# T2.10 - Declaração Dentro e Fora de Classes

## Introdução

**Enum**: pode ser declarado em arquivo próprio ou dentro de classe.

```java
// Arquivo próprio (top-level)
public enum Status {
    ATIVO, INATIVO
}

// Dentro de classe (nested)
public class Pedido {
    public enum Status {
        NOVO, PROCESSANDO, ENVIADO
    }
}
```

**Top-level**: arquivo próprio
**Nested**: dentro de classe

---

## Fundamentos

### 1. Enum em Arquivo Próprio (Top-Level)

```java
// Arquivo: Status.java
package br.com.exemplo;

public enum Status {
    ATIVO,
    INATIVO,
    PENDENTE
}
```

### 2. Enum Dentro de Classe (Nested)

```java
// Arquivo: Pedido.java
public class Pedido {
    public enum Status {
        NOVO,
        PROCESSANDO,
        ENVIADO,
        ENTREGUE
    }
    
    private Status status;
}
```

### 3. Acessar Enum Nested

```java
// Qualificação completa
Pedido.Status status = Pedido.Status.NOVO;

// Instanciar classe
Pedido pedido = new Pedido();
pedido.setStatus(Pedido.Status.PROCESSANDO);
```

### 4. Múltiplos Enums no Mesmo Arquivo

```java
// Arquivo: Status.java

// ✅ Um public
public enum Status {
    ATIVO, INATIVO
}

// ✅ Outros package-private
enum Prioridade {
    BAIXA, MEDIA, ALTA
}

enum Tipo {
    A, B, C
}
```

### 5. Enum Static Nested (Implícito)

```java
public class Pedido {
    // Enum nested é implicitamente static
    public enum Status {
        NOVO, PROCESSANDO
    }
    
    // Equivalente a:
    public static enum Status {
        NOVO, PROCESSANDO
    }
}

// Acesso sem instância
Pedido.Status s = Pedido.Status.NOVO; // ✅
```

### 6. Enum Dentro de Interface

```java
public interface Constantes {
    // ✅ Enum em interface (implicitamente public static)
    enum Status {
        ATIVO, INATIVO
    }
}

// Acesso
Constantes.Status s = Constantes.Status.ATIVO;
```

### 7. Enum Dentro de Enum

```java
public enum Pedido {
    LIVRO,
    ELETRONICO;
    
    // ✅ Enum dentro de enum
    public enum Status {
        NOVO, PROCESSANDO, ENVIADO
    }
}

// Acesso
Pedido.Status s = Pedido.Status.NOVO;
```

### 8. Modificadores de Acesso

```java
// Top-level: public ou package-private
public enum Status { }      // ✅ public
enum Prioridade { }         // ✅ package-private

// Nested: public, protected, private, package-private
public class Pedido {
    public enum Status { }      // ✅ public
    protected enum Tipo { }     // ✅ protected
    private enum Interno { }    // ✅ private
    enum Pacote { }             // ✅ package-private
}
```

### 9. Enum em Método (Local Class)

```java
public void processar() {
    // ❌ ERRO: enum types must not be local
    // enum Status {
    //     ATIVO, INATIVO
    // }
}

// Enum não pode ser declarado dentro de método
```

### 10. Import de Enum Nested

```java
// Sem import
Pedido.Status s = Pedido.Status.NOVO;

// Com import
import br.com.exemplo.Pedido.Status;

Status s = Status.NOVO;

// Import static
import static br.com.exemplo.Pedido.Status.*;

Status s = NOVO; // ✅ Sem qualificação
```

---

## Aplicabilidade

**Arquivo próprio** quando:
- Enum usado em múltiplas classes
- Enum é conceito independente
- Reusabilidade importante

**Dentro de classe** quando:
- Enum específico da classe
- Escopo limitado
- Encapsulamento

---

## Armadilhas

### 1. Enum Local em Método

```java
public void processar() {
    // ❌ ERRO: enum types must not be local
    // enum Status {
    //     ATIVO, INATIVO
    // }
}

// ✅ Declarar como nested na classe
public class Processador {
    private enum Status {
        ATIVO, INATIVO
    }
    
    public void processar() {
        Status s = Status.ATIVO;
    }
}
```

### 2. Múltiplos Enums Public

```java
// ❌ ERRO: apenas um tipo public por arquivo
// Arquivo: Status.java
public enum Status { }
public enum Prioridade { } // ERRO

// ✅ Um public, outros package-private
public enum Status { }
enum Prioridade { }
```

### 3. Enum Private em Top-Level

```java
// ❌ ERRO: modifier private not allowed
// private enum Status { }

// ✅ public ou package-private
public enum Status { }
enum Prioridade { }
```

---

## Boas Práticas

### 1. Top-Level para Reuso

```java
// ✅ Arquivo próprio (reusável)
// Arquivo: Status.java
public enum Status {
    ATIVO, INATIVO
}

// Usar em múltiplas classes
public class Pedido {
    private Status status;
}

public class Usuario {
    private Status status;
}
```

### 2. Nested para Escopo Limitado

```java
// ✅ Nested (escopo limitado)
public class Pedido {
    private enum Status {
        NOVO, PROCESSANDO, ENVIADO
    }
    
    private Status status;
}

// Apenas Pedido usa Status
```

### 3. Interface para Constantes Agrupadas

```java
// ✅ Interface como namespace
public interface Constantes {
    enum Status {
        ATIVO, INATIVO
    }
    
    enum Prioridade {
        BAIXA, MEDIA, ALTA
    }
}

// Uso
Constantes.Status s = Constantes.Status.ATIVO;
```

### 4. Nomenclatura de Enum Nested

```java
// ✅ Nome contextual
public class Pedido {
    public enum Status {  // Pedido.Status (claro)
        NOVO, PROCESSANDO
    }
}

// ⚠️ Nome genérico (confuso)
public class Pedido {
    public enum S {  // Pedido.S (pouco claro)
        N, P
    }
}
```

---

## Resumo

**Declaração de enum**:

```java
// 1. Arquivo próprio (top-level)
// Arquivo: Status.java
public enum Status {
    ATIVO, INATIVO
}

// 2. Dentro de classe (nested)
public class Pedido {
    public enum Status {
        NOVO, PROCESSANDO
    }
}

// 3. Dentro de interface
public interface Constantes {
    enum Status {
        ATIVO, INATIVO
    }
}
```

**Acesso**:

```java
// Top-level
Status s = Status.ATIVO;

// Nested
Pedido.Status s = Pedido.Status.NOVO;

// Com import
import br.com.exemplo.Pedido.Status;
Status s = Status.NOVO;
```

**Modificadores**:

| Local | Modificadores Permitidos |
|-------|--------------------------|
| **Top-level** | `public`, package-private |
| **Nested** | `public`, `protected`, `private`, package-private |
| **Interface** | `public static` (implícito) |
| **Método** | ❌ Não permitido |

**Características**:
- Enum nested é **implicitamente static**
- Pode acessar sem instância da classe externa
- Um arquivo = um enum **public** + vários package-private
- Enum **não pode ser local** (dentro de método)

**Quando usar**:
- **Top-level**: reuso em múltiplas classes
- **Nested**: escopo limitado, específico da classe
- **Interface**: agrupar constantes relacionadas

**Regra de Ouro**: Enum pode ser **top-level** (arquivo próprio) ou **nested** (dentro de classe/interface). Nested é **implicitamente static** (acesso sem instância). Enum **não pode ser local** (dentro de método). Use **top-level** para reuso, **nested** para escopo limitado. Um arquivo = um enum **public** máximo.
