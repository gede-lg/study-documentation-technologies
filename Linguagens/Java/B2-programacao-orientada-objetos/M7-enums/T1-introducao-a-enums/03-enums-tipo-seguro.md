# T1.03 - Enums como Tipos Seguros (Type-Safe)

## Introdução

**Type-safe**: enum garante apenas valores válidos em compile-time.

```java
public enum Status {
    ATIVO, INATIVO
}

Status s = Status.ATIVO;    // ✅
// Status s = "ATIVO";      // ❌ ERRO
// Status s = 1;            // ❌ ERRO
```

**Type-safety**: compilador valida tipos.

---

## Fundamentos

### 1. Apenas Valores Válidos

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor cor = Cor.VERMELHO; // ✅
// cor = "AMARELO";     // ❌ ERRO: incompatible types
```

### 2. vs Constantes int (Não Type-Safe)

```java
// ❌ int = NÃO type-safe
public class StatusInt {
    public static final int ATIVO = 0;
    public static final int INATIVO = 1;
}

int status = StatusInt.ATIVO;
status = 999;        // ✅ Compila! (mas inválido)
status = -1;         // ✅ Compila! (mas inválido)

// ✅ Enum = type-safe
public enum Status {
    ATIVO, INATIVO
}

Status s = Status.ATIVO;
// s = 999;          // ❌ ERRO de compilação
```

### 3. vs Constantes String (Não Type-Safe)

```java
// ❌ String = NÃO type-safe
public class CorString {
    public static final String VERMELHO = "VERMELHO";
    public static final String VERDE = "VERDE";
}

String cor = CorString.VERMELHO;
cor = "AMARELO";     // ✅ Compila! (valor inválido)
cor = "vermelho";    // ✅ Compila! (case diferente)

// ✅ Enum = type-safe
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor c = Cor.VERMELHO;
// c = "AMARELO";    // ❌ ERRO de compilação
```

### 4. Parâmetros Type-Safe

```java
public enum TipoUsuario {
    ADMIN, USUARIO, CONVIDADO
}

// ✅ Type-safe: apenas valores do enum
public void configurar(TipoUsuario tipo) {
    System.out.println("Tipo: " + tipo);
}

configurar(TipoUsuario.ADMIN); // ✅
// configurar("ADMIN");        // ❌ ERRO
// configurar(0);              // ❌ ERRO
```

### 5. Retorno Type-Safe

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

public class Tarefa {
    public Prioridade getPrioridade() {
        return Prioridade.ALTA; // ✅ Apenas valores do enum
    }
}

Tarefa t = new Tarefa();
Prioridade p = t.getPrioridade(); // Type-safe
```

### 6. Coleções Type-Safe

```java
import java.util.*;

public enum Status {
    PENDENTE, CONCLUIDO, ERRO
}

// ✅ Type-safe: apenas Status
List<Status> lista = new ArrayList<>();
lista.add(Status.PENDENTE); // ✅
// lista.add("PENDENTE");   // ❌ ERRO
// lista.add(0);            // ❌ ERRO

Set<Status> set = EnumSet.of(Status.PENDENTE, Status.CONCLUIDO);
```

### 7. Switch Type-Safe

```java
public enum Direcao {
    NORTE, SUL, LESTE, OESTE
}

public void mover(Direcao dir) {
    switch (dir) { // Type-safe: apenas Direcao
        case NORTE: System.out.println("↑"); break;
        case SUL:   System.out.println("↓"); break;
        case LESTE: System.out.println("→"); break;
        case OESTE: System.out.println("←"); break;
    }
}
```

### 8. Detecção de Erros em Compile-Time

```java
public enum Mes {
    JANEIRO, FEVEREIRO, MARCO
}

// ❌ ERRO detectado em compile-time
// Mes m = Mes.ABRIL; // Não existe

// ✅ Autocomplete do IDE mostra apenas valores válidos
Mes m = Mes. // IDE sugere: JANEIRO, FEVEREIRO, MARCO
```

### 9. Refatoração Segura

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// Se renomear ATIVO para ATIVADO:
// - IDE atualiza TODAS as referências
// - Se esquecer alguma, ERRO de compilação

// Com String:
// "ATIVO" espalhado no código não é detectado
```

### 10. Null Safety

```java
public enum Resultado {
    SUCESSO, ERRO
}

Resultado r = null; // ✅ Pode ser null

// Mas parâmetro pode rejeitar null
public void processar(@NonNull Resultado r) {
    // ...
}
```

---

## Aplicabilidade

**Type-safe significa**:
- Compilador valida tipos
- Apenas valores válidos
- Erros detectados em compile-time (não runtime)
- Autocomplete no IDE
- Refatoração segura

---

## Armadilhas

### 1. Aceitar String em Vez de Enum

```java
public enum Status {
    ATIVO, INATIVO
}

// ❌ Perde type-safety
public void setStatus(String status) {
    // Aceita qualquer String!
}

// ✅ Type-safe
public void setStatus(Status status) {
    // Apenas valores do enum
}
```

### 2. Converter String Sem Validação

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

// ❌ Pode lançar IllegalArgumentException
String input = "AMARELO";
Cor cor = Cor.valueOf(input); // ERRO runtime!

// ✅ Validar antes
try {
    Cor cor = Cor.valueOf(input);
} catch (IllegalArgumentException e) {
    System.out.println("Cor inválida");
}
```

---

## Boas Práticas

### 1. Usar Enum em Vez de int/String

```java
// ❌ int (não type-safe)
public void setStatus(int status) { }

// ❌ String (não type-safe)
public void setStatus(String status) { }

// ✅ Enum (type-safe)
public void setStatus(Status status) { }
```

### 2. Parâmetros e Retornos com Enum

```java
// ✅ Type-safe
public enum Resultado {
    SUCESSO, ERRO
}

public Resultado processar() {
    return Resultado.SUCESSO;
}

public void tratar(Resultado r) {
    // ...
}
```

### 3. Evitar Conversões Desnecessárias

```java
// ❌ Desnecessário
Status s = Status.valueOf("ATIVO");

// ✅ Direto
Status s = Status.ATIVO;
```

---

## Resumo

**Type-safe**: compilador garante apenas valores válidos.

```java
public enum Status {
    ATIVO, INATIVO
}

Status s = Status.ATIVO;    // ✅
// Status s = "ATIVO";      // ❌ ERRO
```

**vs int/String**:
| Aspecto | int/String | Enum |
|---------|------------|------|
| Type-safety | ❌ | ✅ |
| Valores inválidos | ✅ Aceita | ❌ Rejeita |
| Detecção de erros | Runtime | Compile-time |
| Autocomplete | ❌ | ✅ |
| Refatoração | ❌ Insegura | ✅ Segura |

**Benefícios**:
- Erros detectados em compile-time
- Autocomplete no IDE
- Refatoração segura
- Código mais robusto
- Menos bugs em runtime

**Regra de Ouro**: Enum é **type-safe** - compilador garante apenas valores válidos. Use enum em vez de **int/String** para parâmetros, retornos, campos. Erros detectados em **compile-time**, não runtime.
