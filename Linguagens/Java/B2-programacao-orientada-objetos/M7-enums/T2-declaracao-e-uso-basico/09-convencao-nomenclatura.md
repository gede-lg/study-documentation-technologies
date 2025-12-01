# T2.09 - Convenção de Nomenclatura (Maiúsculas)

## Introdução

**Convenção**: nome do enum em **PascalCase**, constantes em **MAIUSCULAS**.

```java
// ✅ Convenção Java
public enum StatusPedido {
    NOVO,
    EM_PROCESSAMENTO,
    ENVIADO,
    ENTREGUE
}
```

**PascalCase**: enum (DiaSemana, TipoPagamento)
**MAIUSCULAS**: constantes (SEGUNDA, DINHEIRO)

---

## Fundamentos

### 1. Nome do Enum (PascalCase)

```java
// ✅ PascalCase
public enum DiaSemana { }
public enum TipoPagamento { }
public enum StatusUsuario { }

// ❌ Errado
public enum dia_semana { }    // snake_case
public enum TIPO_PAGAMENTO { } // MAIUSCULAS
public enum tipopagamento { }  // lowercase
```

### 2. Constantes (MAIUSCULAS)

```java
// ✅ MAIUSCULAS
public enum Status {
    ATIVO,
    INATIVO,
    PENDENTE
}

// ❌ Errado
public enum Status {
    Ativo,    // PascalCase
    inativo,  // lowercase
    Pendente  // PascalCase
}
```

### 3. Múltiplas Palavras (SNAKE_CASE)

```java
// ✅ SNAKE_CASE para constantes
public enum EstadoPedido {
    AGUARDANDO_PAGAMENTO,
    EM_PROCESSAMENTO,
    ENVIADO,
    ENTREGUE
}

// ❌ Errado
public enum EstadoPedido {
    AguardandoPagamento,  // PascalCase
    emProcessamento,      // camelCase
    ENVIADOTODO           // Sem separação
}
```

### 4. Nome Descritivo

```java
// ✅ Nome descritivo
public enum TipoDocumento {
    CPF,
    CNPJ,
    RG,
    PASSAPORTE
}

// ❌ Nome genérico
public enum T {
    A, B, C, D
}
```

### 5. Singular vs Plural

```java
// ✅ Singular (representa um tipo)
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}

// ⚠️ Plural (menos comum)
public enum Dias {
    SEGUNDA, TERCA, QUARTA
}
```

### 6. Prefixo/Sufixo

```java
// ✅ Sem prefixo redundante
public enum Status {
    ATIVO, INATIVO
}

// ⚠️ Prefixo redundante
public enum Status {
    STATUS_ATIVO,    // Redundante
    STATUS_INATIVO
}

// ✅ Usa qualificação
Status.ATIVO // Já indica que é Status
```

### 7. Abreviações

```java
// ✅ Abreviações conhecidas (OK)
public enum TipoDocumento {
    CPF,     // ✅ Conhecido
    CNPJ,    // ✅ Conhecido
    RG       // ✅ Conhecido
}

// ⚠️ Abreviações obscuras (evitar)
public enum TipoPgt {
    DN,   // Dinheiro? (pouco claro)
    CC,   // Cartão crédito? (pouco claro)
    P     // PIX? (muito obscuro)
}

// ✅ Nomes completos (melhor)
public enum TipoPagamento {
    DINHEIRO,
    CARTAO_CREDITO,
    PIX
}
```

### 8. Contexto no Nome

```java
// ✅ Nome contextual
public enum TipoUsuario {
    ADMINISTRADOR,
    USUARIO_COMUM,
    CONVIDADO
}

// ⚠️ Sem contexto
public enum Tipo {
    ADMIN,
    USER,
    GUEST
}
```

### 9. Constantes com Números

```java
// ✅ Números no final
public enum Versao {
    V1,
    V2,
    V3
}

// ⚠️ Números no início (evitar)
public enum Versao {
    // 1V,  // ❌ Inválido (identificador não pode começar com número)
    VER_1,  // ✅ Válido mas menos comum
}
```

### 10. Consistência

```java
// ✅ Consistente
public enum StatusPedido {
    NOVO,
    EM_PROCESSAMENTO,
    ENVIADO,
    ENTREGUE,
    CANCELADO
}

// ❌ Inconsistente
public enum StatusPedido {
    NOVO,
    emProcessamento,  // camelCase (inconsistente)
    ENVIADO,
    Entregue,         // PascalCase (inconsistente)
}
```

---

## Aplicabilidade

**Convenções**:
- Nome do enum: **PascalCase**
- Constantes: **MAIUSCULAS**
- Múltiplas palavras: **SNAKE_CASE**
- Nomes descritivos e claros

---

## Armadilhas

### 1. Constantes em Minúsculas

```java
// ❌ Convenção violada
public enum Status {
    ativo,
    inativo
}

// ✅ MAIUSCULAS
public enum Status {
    ATIVO,
    INATIVO
}
```

### 2. Enum em snake_case

```java
// ❌ snake_case
public enum tipo_usuario { }

// ✅ PascalCase
public enum TipoUsuario { }
```

### 3. Prefixo Redundante

```java
// ❌ Prefixo redundante
public enum Status {
    STATUS_ATIVO,
    STATUS_INATIVO
}

// ✅ Sem prefixo
public enum Status {
    ATIVO,
    INATIVO
}

// Usar: Status.ATIVO (já indica que é Status)
```

---

## Boas Práticas

### 1. Seguir Convenção Java

```java
// ✅ PascalCase para enum
public enum DiaSemana { }

// ✅ MAIUSCULAS para constantes
public enum Status {
    ATIVO,
    INATIVO
}

// ✅ SNAKE_CASE para múltiplas palavras
public enum EstadoPedido {
    EM_PROCESSAMENTO,
    AGUARDANDO_PAGAMENTO
}
```

### 2. Nomes Autoexplicativos

```java
// ✅ Claro
public enum TipoPagamento {
    DINHEIRO,
    CARTAO_CREDITO,
    CARTAO_DEBITO,
    PIX
}

// ❌ Obscuro
public enum TP {
    D, CC, CD, P
}
```

### 3. Singular para Tipo

```java
// ✅ Singular (representa um tipo)
public enum DiaSemana { }
public enum TipoArquivo { }
public enum Status { }
```

### 4. Evitar Abreviações Desnecessárias

```java
// ✅ Nome completo
public enum Prioridade {
    BAIXA,
    MEDIA,
    ALTA,
    CRITICA
}

// ⚠️ Abreviação desnecessária
public enum Pri {
    B, M, A, C
}
```

---

## Resumo

**Convenções de nomenclatura**:

```java
// ✅ Convenção Java
public enum NomeEnum {          // PascalCase
    CONSTANTE_1,                // MAIUSCULAS + SNAKE_CASE
    CONSTANTE_2,
    CONSTANTE_COM_NOME_LONGO
}
```

**Exemplos**:

```java
// Nome do enum: PascalCase
public enum DiaSemana { }
public enum TipoPagamento { }
public enum StatusUsuario { }

// Constantes: MAIUSCULAS
public enum Status {
    ATIVO,
    INATIVO,
    PENDENTE
}

// Múltiplas palavras: SNAKE_CASE
public enum EstadoPedido {
    AGUARDANDO_PAGAMENTO,
    EM_PROCESSAMENTO,
    ENVIADO,
    ENTREGUE
}
```

**Regras**:

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Nome do enum | **PascalCase** | `DiaSemana`, `TipoPagamento` |
| Constantes | **MAIUSCULAS** | `ATIVO`, `SEGUNDA` |
| Múltiplas palavras (enum) | **PascalCase** | `StatusPedido` |
| Múltiplas palavras (constante) | **SNAKE_CASE** | `EM_PROCESSAMENTO` |

**Características**:
- Nome descritivo e claro
- Singular para tipos
- Sem prefixos redundantes
- Abreviações apenas se muito conhecidas
- Consistência em todo o código

**Regra de Ouro**: Enum em **PascalCase** (`DiaSemana`), constantes em **MAIUSCULAS** (`SEGUNDA`). Múltiplas palavras em constantes: **SNAKE_CASE** (`EM_PROCESSAMENTO`). Nomes **descritivos** e **autoexplicativos**. Evitar prefixos redundantes (`ATIVO` vs `STATUS_ATIVO`). Singular para tipos (`DiaSemana` vs `Dias`). Seguir convenções Java.
