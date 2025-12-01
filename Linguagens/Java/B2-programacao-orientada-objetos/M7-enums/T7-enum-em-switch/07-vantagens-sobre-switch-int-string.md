# T7.07 - Vantagens sobre Switch com Int/String

## Introdução

**Switch com enum** >>> **switch com int/String**.

```java
// ❌ Switch com int (antes do enum)
public static final int STATUS_ATIVO = 1;
public static final int STATUS_INATIVO = 2;
public static final int STATUS_PENDENTE = 3;

public String getDescricao(int status) {
    switch (status) {
        case STATUS_ATIVO:   return "Ativo";
        case STATUS_INATIVO: return "Inativo";
        case STATUS_PENDENTE: return "Pendente";
        case 999:  // ⚠️ Aceita qualquer int (não tipo seguro)
            return "Inválido";
        default:
            return "Desconhecido";
    }
}

// ❌ Chamada: aceita qualquer int
String desc = getDescricao(999);  // ⚠️ Compila, mas errado

// ✅ Switch com enum
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

public String getDescricao(Status status) {
    return switch (status) {
        case ATIVO   -> "Ativo";
        case INATIVO -> "Inativo";
        case PENDENTE -> "Pendente";
    };
}

// ✅ Chamada: só aceita Status
String desc = getDescricao(Status.ATIVO);  // ✅ Tipo seguro
// String desc = getDescricao(999);  // ❌ Erro de compilação
```

**Enum** = tipo seguro, autocomplete, refatoração, exaustividade.

---

## Fundamentos

### 1. Tipo Seguro

```java
// ❌ Int: não tipo seguro
public static final int PRIORIDADE_BAIXA = 1;
public static final int PRIORIDADE_MEDIA = 2;
public static final int PRIORIDADE_ALTA = 3;

public void processar(int prioridade) {
    // ⚠️ Aceita qualquer int
    // ⚠️ processar(999) compila
}

// ✅ Enum: tipo seguro
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

public void processar(Prioridade prioridade) {
    // ✅ Só aceita Prioridade
    // ✅ processar(999) NÃO compila
}

// Vantagem: compilador valida tipo
```

### 2. Autocomplete (IDE)

```java
// ❌ String: sem autocomplete
public static final String DIA_SEGUNDA = "SEGUNDA";
public static final String DIA_TERCA = "TERCA";

public boolean isUtil(String dia) {
    switch (dia) {
        case "SEGUNDA":  // ⚠️ IDE não sugere
        case "TERCA":
            return true;
        default:
            return false;
    }
}

// Chamada: sem autocomplete
isUtil("SEGUNDA");  // ⚠️ Digitar manualmente, propenso a erros

// ✅ Enum: autocomplete
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

public boolean isUtil(DiaSemana dia) {
    return switch (dia) {
        case SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA -> true;
        case SABADO, DOMINGO -> false;
    };
}

// Chamada: autocomplete
isUtil(DiaSemana.SEGUNDA);  // ✅ IDE sugere constantes

// Vantagem: IDE autocomplete evita erros de digitação
```

### 3. Refatoração Segura

```java
// ❌ String: refatoração perigosa
public static final String STATUS_ATIVO = "ATIVO";

public void processar(String status) {
    switch (status) {
        case "ATIVO":  // ⚠️ String literal duplicada
            // ...
    }
}

// Renomear: "ATIVO" → "ACTIVE"
public static final String STATUS_ATIVO = "ACTIVE";

public void processar(String status) {
    switch (status) {
        case "ATIVO":  // ⚠️ Literal não renomeado automaticamente
            // ⚠️ Bug: nunca entra aqui
    }
}

// ✅ Enum: refatoração segura
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

public void processar(Status status) {
    switch (status) {
        case ATIVO:  // ✅ Refatorar enum renomeia automaticamente
            // ...
    }
}

// Vantagem: refatoração automática pelo IDE
```

### 4. Validação de Valores

```java
// ❌ Int: aceita valores inválidos
public void processar(int prioridade) {
    switch (prioridade) {
        case 1: // BAIXA
        case 2: // MEDIA
        case 3: // ALTA
            System.out.println("OK");
            break;
        default:
            // ⚠️ Valores inválidos caem aqui (999, -1, etc)
            System.out.println("Inválido");
    }
}

processar(999);  // ⚠️ Compila, executa default

// ✅ Enum: só valores válidos
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

public void processar(Prioridade prioridade) {
    switch (prioridade) {
        case BAIXA, MEDIA, ALTA ->
            System.out.println("OK");
    }
}

// processar(999);  // ❌ Erro de compilação

// Vantagem: impossível passar valor inválido
```

### 5. Comparação

```java
// ❌ String: comparação com equals()
String status = "ATIVO";
if (status.equals("ATIVO")) {  // ⚠️ equals() (pode ser null)
    // ...
}

// ⚠️ Null
String status = null;
if (status.equals("ATIVO")) {  // ⚠️ NullPointerException
    // ...
}

// ✅ Enum: comparação com ==
Status status = Status.ATIVO;
if (status == Status.ATIVO) {  // ✅ == (seguro e rápido)
    // ...
}

// ✅ Null seguro
Status status = null;
if (status == Status.ATIVO) {  // ✅ false (sem NPE)
    // ...
}

// Vantagem: == é mais rápido e seguro que equals()
```

### 6. Documentação

```java
// ❌ Int: significado não claro
public static final int STATUS_1 = 1;
public static final int STATUS_2 = 2;

public void processar(int status) {
    switch (status) {
        case 1:  // ⚠️ O que é 1?
            // ...
    }
}

// ✅ Enum: significado claro
public enum Status {
    ATIVO,    // Status ativo
    INATIVO,  // Status inativo
    PENDENTE  // Aguardando aprovação
}

public void processar(Status status) {
    switch (status) {
        case ATIVO:  // ✅ Claro: status ativo
            // ...
    }
}

// Vantagem: nome descritivo, auto-documentado
```

### 7. Serialização

```java
// ❌ String: valores podem mudar
@Entity
public class Pedido {
    private String status;  // ⚠️ Pode ser "ATIVO", "Ativo", "ativo"
}

// ⚠️ Inconsistente no banco
INSERT INTO pedido (status) VALUES ('ATIVO');
INSERT INTO pedido (status) VALUES ('ativo');  // ⚠️ Diferente

// ✅ Enum: serializado consistentemente
@Entity
public class Pedido {
    @Enumerated(EnumType.STRING)
    private Status status;  // ✅ Sempre "ATIVO"
}

// ✅ Consistente no banco
INSERT INTO pedido (status) VALUES ('ATIVO');
INSERT INTO pedido (status) VALUES ('ATIVO');  // ✅ Sempre igual

// Vantagem: serialização consistente
```

### 8. Switch Expression (Exaustividade)

```java
// ❌ Int: não exaustivo
public String getDescricao(int status) {
    switch (status) {
        case 1: return "Ativo";
        case 2: return "Inativo";
        // ⚠️ Outros valores não tratados, compilador não avisa
    }
    return "Desconhecido";
}

// ✅ Enum: exaustivo (Java 14+)
public String getDescricao(Status status) {
    return switch (status) {
        case ATIVO   -> "Ativo";
        case INATIVO -> "Inativo";
        case PENDENTE -> "Pendente";
        // ✅ Compilador força cobrir todos
    };
}

// Vantagem: compilador força completude
```

### 9. Polimorfismo

```java
// ❌ Int: sem polimorfismo
public static final int TIPO_CIRCULO = 1;
public static final int TIPO_QUADRADO = 2;

public double calcularArea(int tipo, double... dimensoes) {
    switch (tipo) {
        case TIPO_CIRCULO:
            return Math.PI * dimensoes[0] * dimensoes[0];
        case TIPO_QUADRADO:
            return dimensoes[0] * dimensoes[0];
        default:
            throw new IllegalArgumentException();
    }
}

// ✅ Enum: com métodos abstratos (polimórfico)
public enum Forma {
    CIRCULO {
        @Override
        public double calcularArea(double... dimensoes) {
            return Math.PI * dimensoes[0] * dimensoes[0];
        }
    },
    QUADRADO {
        @Override
        public double calcularArea(double... dimensoes) {
            return dimensoes[0] * dimensoes[0];
        }
    };
    
    public abstract double calcularArea(double... dimensoes);
}

// Uso: sem switch
double area = Forma.CIRCULO.calcularArea(5.0);

// Vantagem: comportamento polimórfico, sem switch
```

### 10. Performance

```java
// ❌ String: comparação lenta
public void processar(String tipo) {
    switch (tipo) {  // ⚠️ String.equals() internamente
        case "TIPO_A":  // Comparação lenta
        case "TIPO_B":
            // ...
    }
}

// ✅ Enum: comparação rápida
public void processar(TipoEnum tipo) {
    switch (tipo) {  // ✅ Comparação por ordinal (int)
        case TIPO_A:  // Muito mais rápido
        case TIPO_B:
            // ...
    }
}

// Vantagem: switch com enum usa ordinal (int) internamente
// Performance similar a switch com int, mas tipo seguro
```

---

## Aplicabilidade

**Enum em vez de int/String** quando:
- Conjunto **fixo** de valores
- Tipo **seguro**
- Refatoração **segura**
- **Completude** validada
- **Polimorfismo** (métodos abstratos)

**Vantagens**:
- Tipo seguro
- Autocomplete
- Refatoração automática
- Exaustividade
- Comparação rápida (==)
- Serialização consistente
- Polimorfismo

---

## Armadilhas

### 1. Usar String Mágico

```java
// ❌ String mágico
if (status.equals("ATIVO")) {  // ⚠️ Typo: "ATIVOO"
    // ...
}

// ✅ Enum
if (status == Status.ATIVO) {  // ✅ Erro de compilação se errado
    // ...
}
```

### 2. Usar Int Mágico

```java
// ❌ Int mágico
if (prioridade == 1) {  // ⚠️ O que é 1?
    // ...
}

// ✅ Enum
if (prioridade == Prioridade.BAIXA) {  // ✅ Claro
    // ...
}
```

### 3. Aceitar Valores Inválidos

```java
// ❌ Int aceita qualquer valor
public void processar(int status) {
    // ⚠️ Aceita 999, -1, etc
}

// ✅ Enum só aceita válidos
public void processar(Status status) {
    // ✅ Só Status.ATIVO, INATIVO, PENDENTE
}
```

---

## Boas Práticas

### 1. Preferir Enum a Int

```java
// ❌ Int
public static final int STATUS_ATIVO = 1;

// ✅ Enum
public enum Status {
    ATIVO, INATIVO, PENDENTE
}
```

### 2. Preferir Enum a String

```java
// ❌ String
public static final String DIA_SEGUNDA = "SEGUNDA";

// ✅ Enum
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}
```

### 3. Usar == com Enum

```java
// ✅ Comparação com ==
if (status == Status.ATIVO) {
    // ...
}
```

### 4. Switch Expression

```java
// ✅ Switch expression (exaustivo)
return switch (status) {
    case ATIVO   -> "Ativo";
    case INATIVO -> "Inativo";
    case PENDENTE -> "Pendente";
};
```

---

## Resumo

**Enum vs Int/String**:

| Característica       | Int               | String            | Enum             |
|----------------------|-------------------|-------------------|------------------|
| **Tipo seguro**      | ❌ Não            | ❌ Não            | ✅ Sim           |
| **Autocomplete**     | ❌ Não            | ❌ Não            | ✅ Sim           |
| **Refatoração**      | ⚠️ Parcial        | ❌ Não            | ✅ Automática    |
| **Comparação**       | `==`              | `equals()`        | `==`             |
| **Performance**      | ✅ Rápido         | ⚠️ Lento          | ✅ Rápido        |
| **Valores inválidos**| ⚠️ Aceita         | ⚠️ Aceita         | ❌ Rejeita       |
| **Exaustividade**    | ❌ Não            | ❌ Não            | ✅ Sim (Java 14+)|
| **Polimorfismo**     | ❌ Não            | ❌ Não            | ✅ Sim           |
| **Serialização**     | ✅ Consistente    | ⚠️ Inconsistente  | ✅ Consistente   |
| **Null seguro**      | N/A               | ⚠️ NPE            | ✅ == null       |

**Vantagens de enum**:
- **Tipo seguro**: compilador valida
- **Autocomplete**: IDE sugere constantes
- **Refatoração**: automática
- **Exaustividade**: compilador força (Java 14+)
- **Comparação**: `==` rápido e seguro
- **Polimorfismo**: métodos abstratos
- **Serialização**: consistente
- **Documentação**: auto-descritivo

**Regra de Ouro**: **SEMPRE** use **enum** em vez de int/String para conjunto fixo de valores. Enum = **tipo seguro**, **autocomplete**, **refatoração automática**, **exaustividade** (Java 14+), **comparação rápida** (==), **polimorfismo**, **serialização consistente**. Int/String = propenso a **erros**, **sem validação**, **difícil refatorar**.
