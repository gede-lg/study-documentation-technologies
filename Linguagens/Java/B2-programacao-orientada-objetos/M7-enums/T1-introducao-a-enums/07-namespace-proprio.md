# T1.07 - Namespace Próprio para Cada Enum

## Introdução

**Namespace**: cada enum tem seu próprio espaço de nomes.

```java
public enum Status {
    ATIVO, INATIVO
}

public enum Tipo {
    ATIVO, INATIVO // ✅ Mesmo nome, sem conflito
}

Status.ATIVO != Tipo.ATIVO // Diferentes!
```

**Sem colisão**: constantes com mesmo nome em enums diferentes.

---

## Fundamentos

### 1. Enums Independentes

```java
public enum Status {
    PENDENTE, CONCLUIDO
}

public enum Pedido {
    PENDENTE, ENVIADO // ✅ Mesmo nome OK
}

Status.PENDENTE != Pedido.PENDENTE // Tipos diferentes
```

### 2. vs Constantes int (Colisão)

```java
// ❌ int = colisão de nomes
public class Constantes {
    public static final int STATUS_ATIVO = 0;
    public static final int TIPO_ATIVO = 0; // Mesmo valor!
    
    // Conflito: qual ATIVO usar?
}

int valor = Constantes.STATUS_ATIVO; // Ambíguo
```

### 3. Qualificação com Nome do Enum

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

public enum Semaforo {
    VERMELHO, AMARELO, VERDE
}

Cor cor = Cor.VERMELHO;           // Cor.VERMELHO
Semaforo sem = Semaforo.VERMELHO; // Semaforo.VERMELHO

// Tipos diferentes, sem confusão
```

### 4. Import Static

```java
import static com.exemplo.Cor.*;
import static com.exemplo.Semaforo.*;

// ❌ ERRO: referência ambígua
// var vermelho = VERMELHO; // Qual? Cor ou Semaforo?

// ✅ Qualificar
Cor cor = Cor.VERMELHO;
Semaforo sem = Semaforo.VERMELHO;
```

### 5. Namespace em Métodos

```java
public enum Operacao {
    SOMA, SUBTRACAO
}

public class Calc {
    public enum Operacao { // ✅ OK (classe diferente)
        MULTIPLICACAO, DIVISAO
    }
    
    public void executar() {
        // Qual Operacao?
        Operacao op1 = Operacao.MULTIPLICACAO;      // Interna (Calc)
        com.exemplo.Operacao op2 = com.exemplo.Operacao.SOMA; // Externa
    }
}
```

### 6. Evita Conflito de Nomes

```java
// Antes (int):
public static final int USUARIO_ATIVO = 0;
public static final int PEDIDO_ATIVO = 0;
public static final int CONTA_ATIVO = 0;
// Prefixos necessários!

// Depois (enum):
public enum StatusUsuario { ATIVO, INATIVO }
public enum StatusPedido { ATIVO, CANCELADO }
public enum StatusConta { ATIVO, BLOQUEADO }
// Sem prefixos, sem colisão!
```

### 7. Namespace em Switch

```java
public enum Direcao {
    NORTE, SUL, LESTE, OESTE
}

void processar(Direcao dir) {
    switch (dir) {
        case NORTE: break;  // Sem qualificação
        case SUL: break;
        // Compilador sabe que é Direcao
    }
}
```

### 8. Comparação Type-Safe

```java
public enum Status {
    ATIVO, INATIVO
}

public enum Tipo {
    ATIVO, INATIVO
}

Status s = Status.ATIVO;
Tipo t = Tipo.ATIVO;

// ❌ ERRO: incompatible types
// if (s == t) { }

// ✅ Type-safe: apenas mesmo tipo
if (s == Status.ATIVO) { }
```

### 9. Organização por Contexto

```java
// ✅ Cada enum representa um contexto
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}

public enum MesAno {
    JANEIRO, FEVEREIRO, MARCO
}

public enum EstacaoAno {
    PRIMAVERA, VERAO, OUTONO, INVERNO
}
```

### 10. Namespace Aninhado

```java
public class Sistema {
    public enum Status {
        ATIVO, INATIVO
    }
    
    public enum Prioridade {
        BAIXA, ALTA
    }
}

Sistema.Status s = Sistema.Status.ATIVO;
Sistema.Prioridade p = Sistema.Prioridade.ALTA;
```

---

## Aplicabilidade

**Namespace próprio**:
- Evita colisão de nomes
- Constantes com mesmo nome em enums diferentes
- Qualificação com nome do enum
- Type-safety por contexto

---

## Armadilhas

### 1. Import Static Ambíguo

```java
import static com.exemplo.Cor.*;
import static com.exemplo.Semaforo.*;

// ❌ Ambíguo
// var v = VERMELHO;

// ✅ Qualificar
Cor c = Cor.VERMELHO;
```

### 2. Confundir Enums com Mesmo Nome

```java
import com.exemplo.Status;
import com.outro.Status; // ❌ ERRO: nome duplicado

// ✅ Usar fully qualified name
com.exemplo.Status s1 = com.exemplo.Status.ATIVO;
com.outro.Status s2 = com.outro.Status.PENDENTE;
```

---

## Boas Práticas

### 1. Nomes Descritivos

```java
// ✅ Nome específico do contexto
public enum StatusPedido {
    PENDENTE, ENVIADO, ENTREGUE
}

public enum StatusPagamento {
    PENDENTE, APROVADO, REJEITADO
}
```

### 2. Evitar Import Static com Conflito

```java
// ❌ Evitar se houver conflito
// import static Cor.*;
// import static Semaforo.*;

// ✅ Qualificar
Cor.VERMELHO
Semaforo.VERDE
```

### 3. Organizar por Domínio

```java
// ✅ Cada enum representa conceito do domínio
public enum TipoUsuario {
    ADMIN, USUARIO, CONVIDADO
}

public enum NivelAcesso {
    LEITURA, ESCRITA, ADMIN
}
```

---

## Resumo

**Namespace**: cada enum tem espaço de nomes próprio.

```java
public enum Status { ATIVO, INATIVO }
public enum Tipo { ATIVO, INATIVO }

Status.ATIVO != Tipo.ATIVO // ✅ Diferentes
```

**vs Constantes int/String**:
| Aspecto | int/String | Enum |
|---------|------------|------|
| Namespace | ❌ Global | ✅ Por enum |
| Colisão de nomes | ✅ Possível | ❌ Impossível |
| Prefixos | ✅ Necessário | ❌ Desnecessário |

**Vantagens**:
- Sem colisão de nomes
- Constantes com mesmo nome OK
- Qualificação clara (`Enum.CONSTANTE`)
- Type-safety por contexto
- Organização por domínio

**Qualificação**:
```java
Cor.VERMELHO        // Qualificado
VERMELHO            // Import static
case VERMELHO:      // Switch (sem qualificação)
```

**Regra de Ouro**: Cada enum tem **namespace próprio** - constantes com mesmo nome em enums diferentes são **independentes** (sem colisão). Use nomes descritivos para clareza (`StatusPedido.PENDENTE` vs `StatusPagamento.PENDENTE`). Evite **import static** se houver conflito de nomes.
