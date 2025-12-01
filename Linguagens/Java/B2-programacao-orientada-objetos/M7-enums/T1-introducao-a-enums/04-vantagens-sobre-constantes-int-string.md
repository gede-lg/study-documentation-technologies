# T1.04 - Vantagens sobre Constantes int/String

## Introdução

**Enum**: vantagens sobre constantes `int` e `String`.

```java
// ❌ int (problemas)
public static final int ATIVO = 0;
public static final int INATIVO = 1;

// ❌ String (problemas)
public static final String VERMELHO = "VERMELHO";

// ✅ Enum (solução)
public enum Status { ATIVO, INATIVO }
public enum Cor { VERMELHO, VERDE, AZUL }
```

---

## Fundamentos

### 1. Type-Safety

```java
// ❌ int = não type-safe
public static final int ATIVO = 0;

void setStatus(int status) { }

setStatus(999); // ✅ Compila (valor inválido!)

// ✅ Enum = type-safe
public enum Status { ATIVO, INATIVO }

void setStatus(Status status) { }

// setStatus(999); // ❌ ERRO
```

### 2. Comparação Segura

```java
// ❌ String = equals() necessário
String cor = "VERMELHO";
if (cor.equals("VERMELHO")) { } // equals()

// ✅ Enum = == (mais rápido e seguro)
Cor cor = Cor.VERMELHO;
if (cor == Cor.VERMELHO) { } // ==
```

### 3. Autocomplete no IDE

```java
// ❌ String = sem autocomplete
String dia = "SEGUNDA"; // Sem sugestões

// ✅ Enum = autocomplete
DiaSemana dia = DiaSemana. // IDE sugere: SEGUNDA, TERCA...
```

### 4. Erros Detectados em Compile-Time

```java
// ❌ String = erro apenas em runtime
String mes = "JANERIO"; // Typo! Erro só em runtime

// ✅ Enum = erro em compile-time
// Mes mes = Mes.JANERIO; // ❌ ERRO de compilação
```

### 5. Namespace Próprio

```java
// ❌ int = colisão de nomes
public static final int STATUS_ATIVO = 0;
public static final int TIPO_ATIVO = 0; // Mesmo valor!

// ✅ Enum = namespace próprio
public enum Status { ATIVO, INATIVO }
public enum Tipo { ATIVO, INATIVO } // Sem colisão

Status.ATIVO != Tipo.ATIVO // Diferentes!
```

### 6. Iterar sobre Valores

```java
// ❌ int = não é possível listar
public static final int A = 0;
public static final int B = 1;
// Como obter todos os valores?

// ✅ Enum = values()
public enum Letra { A, B, C }

for (Letra l : Letra.values()) {
    System.out.println(l);
}
```

### 7. Switch Exhaustivo

```java
// ❌ int = switch não é exhaustivo
void processar(int status) {
    switch (status) {
        case 0: break;
        case 1: break;
        // E se passar 2? Sem default...
    }
}

// ✅ Enum = IDE avisa se falta case
void processar(Status status) {
    switch (status) {
        case ATIVO: break;
        // IDE avisa: falta INATIVO
    }
}
```

### 8. Métodos e Atributos

```java
// ❌ String = sem comportamento
public static final String VERMELHO = "VERMELHO";

// ✅ Enum = pode ter métodos
public enum Cor {
    VERMELHO, VERDE, AZUL;
    
    public boolean ehQuente() {
        return this == VERMELHO;
    }
}

System.out.println(Cor.VERMELHO.ehQuente()); // true
```

### 9. Serialização Segura

```java
// ❌ int = quebra se mudar valor
public static final int ATIVO = 0;
// Se mudar para 1, dados salvos quebram

// ✅ Enum = serialização por nome
public enum Status { ATIVO, INATIVO }
// Ordem não importa
```

### 10. Refatoração Segura

```java
// ❌ String = refatoração insegura
String status = "ATIVO";
// Se renomear "ATIVO" para "ATIVADO":
// - Strings espalhadas não são detectadas
// - Erro apenas em runtime

// ✅ Enum = refatoração segura
Status s = Status.ATIVO;
// Se renomear ATIVO:
// - IDE atualiza TODAS as referências
// - ERRO de compilação se esquecer alguma
```

---

## Comparação

| Aspecto | int | String | Enum |
|---------|-----|--------|------|
| Type-safety | ❌ | ❌ | ✅ |
| Comparação | == | equals() | == |
| Autocomplete | ❌ | ❌ | ✅ |
| Erros | Runtime | Runtime | Compile-time |
| Namespace | ❌ | ❌ | ✅ |
| values() | ❌ | ❌ | ✅ |
| Switch exhaustivo | ❌ | ❌ | ✅ |
| Métodos | ❌ | ❌ | ✅ |
| Serialização | ❌ | ❌ | ✅ |
| Refatoração | ❌ | ❌ | ✅ |

---

## Armadilhas

### 1. Usar int por "Performance"

```java
// ❌ Mito: int é mais rápido
// Enum tem performance equivalente

// ✅ Enum (clareza > micro-otimização)
public enum Status { ATIVO, INATIVO }
```

### 2. Usar String por "Flexibilidade"

```java
// ❌ String = flexível demais (aceita qualquer valor)
void setStatus(String status) { }

// ✅ Enum = flexível o suficiente
void setStatus(Status status) { }
```

---

## Boas Práticas

### 1. Migrar de int/String para Enum

```java
// Antes
public static final int PENDENTE = 0;
public static final int CONCLUIDO = 1;

// Depois
public enum Status {
    PENDENTE, CONCLUIDO
}
```

### 2. Usar Enum em APIs Novas

```java
// ✅ API nova com enum
public enum TipoPagamento {
    DINHEIRO, CARTAO, PIX
}

public void pagar(TipoPagamento tipo) { }
```

---

## Resumo

**Vantagens do enum**:

1. **Type-safety**: apenas valores válidos
2. **Comparação**: `==` (mais rápido que `equals()`)
3. **Autocomplete**: IDE sugere valores
4. **Erros**: compile-time (não runtime)
5. **Namespace**: sem colisão de nomes
6. **Iteração**: `values()` retorna todos
7. **Switch**: IDE avisa se falta case
8. **Métodos**: pode ter comportamento
9. **Serialização**: por nome (segura)
10. **Refatoração**: segura e automática

**int/String**:
- ❌ Não type-safe
- ❌ Aceitam valores inválidos
- ❌ Erros apenas em runtime
- ❌ Sem autocomplete
- ❌ Refatoração insegura

**Enum**:
- ✅ Type-safe
- ✅ Apenas valores válidos
- ✅ Erros em compile-time
- ✅ Autocomplete
- ✅ Refatoração segura

**Regra de Ouro**: Use **enum** em vez de **int/String** para conjuntos fixos de valores. Enum oferece **type-safety**, **autocomplete**, **erros em compile-time**, **refatoração segura**, e **comparação com ==**. Constantes int/String são legado - enum é superior em todos os aspectos.
