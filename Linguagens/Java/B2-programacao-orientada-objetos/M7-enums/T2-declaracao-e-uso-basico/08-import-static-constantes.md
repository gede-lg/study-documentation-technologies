# T2.08 - Import Static de Constantes Enum

## Introdução

**Import static**: importar constantes para usar sem qualificação.

```java
// Sem import static
import br.com.exemplo.Status;

Status s = Status.ATIVO; // Precisa qualificar

// Com import static
import static br.com.exemplo.Status.*;

Status s = ATIVO; // ✅ Sem qualificar
```

**Vantagem**: código mais conciso.

---

## Fundamentos

### 1. Import Static Específico

```java
import static br.com.exemplo.Status.ATIVO;
import static br.com.exemplo.Status.INATIVO;

Status s1 = ATIVO;   // ✅ Sem Status.
Status s2 = INATIVO; // ✅ Sem Status.
```

### 2. Import Static Wildcard

```java
import static br.com.exemplo.Status.*;

Status s1 = ATIVO;    // ✅
Status s2 = INATIVO;  // ✅
Status s3 = PENDENTE; // ✅ Todas as constantes
```

### 3. Múltiplos Imports

```java
import static br.com.exemplo.Status.*;
import static br.com.exemplo.Prioridade.*;

Status s = ATIVO;          // Status.ATIVO
Prioridade p = ALTA;       // Prioridade.ALTA
```

### 4. Ambiguidade

```java
public enum Status {
    ATIVO, INATIVO
}

public enum Estado {
    ATIVO, INATIVO
}

// ❌ ERRO: ambiguous import
import static br.com.exemplo.Status.*;
import static br.com.exemplo.Estado.*;

// Status s = ATIVO; // ERRO: reference to ATIVO is ambiguous

// ✅ Qualificar para resolver
Status s = Status.ATIVO;
Estado e = Estado.ATIVO;
```

### 5. Import Static com Métodos

```java
import static br.com.exemplo.Status.*;
import static br.com.exemplo.Status.valueOf;

Status s1 = ATIVO;           // Constante
Status s2 = valueOf("ATIVO"); // Método
```

### 6. Em Switch

```java
import static br.com.exemplo.Status.*;

void processar(Status status) {
    switch (status) {
        case ATIVO:   // ✅ Já não precisa qualificar no switch
            break;
        case INATIVO:
            break;
    }
}
```

### 7. Legibilidade

```java
// Sem import static (mais verboso)
if (pedido.getStatus() == Status.ATIVO &&
    tarefa.getPrioridade() == Prioridade.ALTA) {
    // ...
}

// Com import static (mais conciso)
import static br.com.exemplo.Status.*;
import static br.com.exemplo.Prioridade.*;

if (pedido.getStatus() == ATIVO &&
    tarefa.getPrioridade() == ALTA) {
    // ...
}
```

### 8. EnumSet com Import Static

```java
import static br.com.exemplo.DiaSemana.*;
import java.util.EnumSet;
import java.util.Set;

Set<DiaSemana> diasUteis = EnumSet.of(
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA
);
```

### 9. Arrays com Import Static

```java
import static br.com.exemplo.Cor.*;

Cor[] cores = {VERMELHO, VERDE, AZUL};
```

### 10. Métodos com Import Static

```java
import static br.com.exemplo.Status.*;

public Status calcularStatus(boolean ativo) {
    return ativo ? ATIVO : INATIVO;
}
```

---

## Aplicabilidade

**Import static quando**:
- Enum muito usado no arquivo
- Código fica mais conciso
- Não há ambiguidade

**Evitar quando**:
- Múltiplos enums com nomes iguais
- Reduz clareza do código

---

## Armadilhas

### 1. Ambiguidade

```java
// ❌ Ambiguidade
import static Enum1.*;
import static Enum2.*;

// Se Enum1 e Enum2 têm ATIVO
// ATIVO é ambíguo

// ✅ Import específico
import static Enum1.ATIVO;
import static Enum2.ATIVO as ATIVO2; // Não existe em Java

// ✅ Ou qualificar
Enum1.ATIVO
Enum2.ATIVO
```

### 2. Reduz Clareza

```java
// ⚠️ Menos claro (de qual enum?)
import static Status.*;
import static Estado.*;
import static Prioridade.*;

if (status == ATIVO) { // Status? Estado?
    // ...
}

// ✅ Mais claro
if (status == Status.ATIVO) {
    // ...
}
```

### 3. Conflito com Variável Local

```java
import static Status.*;

void processar() {
    int ATIVO = 1; // ⚠️ Variável oculta constante
    
    Status s = ATIVO; // ❌ ERRO: incompatible types (int → Status)
}
```

---

## Boas Práticas

### 1. Usar Moderadamente

```java
// ✅ Enum muito usado
import static Status.*;

// ⚠️ Enum pouco usado (qualificar é melhor)
// import static OutroEnum.*;
```

### 2. Import Específico vs Wildcard

```java
// ✅ Import específico (mais claro)
import static Status.ATIVO;
import static Status.INATIVO;

// ⚠️ Wildcard (menos claro, mas mais conciso)
import static Status.*;
```

### 3. Evitar Múltiplos Wildcards

```java
// ⚠️ Múltiplos wildcards (ambiguidade potencial)
import static Enum1.*;
import static Enum2.*;

// ✅ Qualificar se possível conflito
Enum1.ATIVO
Enum2.ATIVO
```

### 4. Documentar

```java
// ✅ Comentar se não óbvio
import static br.com.exemplo.TipoPagamento.*; // PIX, CARTAO, etc.
```

---

## Resumo

**Import static**:

```java
// Sem import static
import br.com.exemplo.Status;

Status s = Status.ATIVO;

// Com import static (específico)
import static br.com.exemplo.Status.ATIVO;
import static br.com.exemplo.Status.INATIVO;

Status s = ATIVO;

// Com import static (wildcard)
import static br.com.exemplo.Status.*;

Status s = ATIVO;
```

**Exemplos**:

```java
// DiaSemana
import static br.com.exemplo.DiaSemana.*;

Set<DiaSemana> diasUteis = EnumSet.of(
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA
);

// Prioridade
import static br.com.exemplo.Prioridade.*;

if (tarefa.getPrioridade() == ALTA) {
    processar();
}
```

**Ambiguidade**:

```java
// ❌ Ambiguidade
import static Status.*;   // ATIVO
import static Estado.*;   // ATIVO

// Status ou Estado?
// if (x == ATIVO) { } // ERRO

// ✅ Qualificar
if (x == Status.ATIVO) { }
```

**Vantagens**:
- Código mais conciso
- Menos repetição
- Útil para enums muito usados

**Desvantagens**:
- Pode reduzir clareza
- Ambiguidade potencial
- Conflito com variáveis locais

**Regra de Ouro**: Use `import static Enum.*` para enums **muito usados** no arquivo. Código fica mais **conciso** (`ATIVO` vs `Status.ATIVO`). Cuidado com **ambiguidade** (múltiplos enums com mesmos nomes). Prefer **import específico** (`import static Status.ATIVO`) vs wildcard (`.*`) quando possível. Switch já não precisa qualificação (sempre `case ATIVO`).
