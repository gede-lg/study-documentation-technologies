# T2.03 - Acessar Constantes: Dia.SEGUNDA

## Introdução

**Acessar constantes**: `NomeEnum.CONSTANTE`.

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}

DiaSemana dia = DiaSemana.SEGUNDA; // Acessa SEGUNDA
```

**Qualificação**: nome do enum + ponto + constante.

---

## Fundamentos

### 1. Acesso Básico

```java
public enum Status {
    ATIVO, INATIVO
}

Status s = Status.ATIVO; // ✅ Status.ATIVO
```

### 2. Constantes São static final

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

// Compilador gera:
// public static final Cor VERMELHO = ...

// Acesso direto (static)
Cor c = Cor.VERMELHO;
```

### 3. Em Expressões

```java
public enum Resultado {
    SUCESSO, ERRO
}

if (resultado == Resultado.SUCESSO) {
    System.out.println("OK");
}
```

### 4. Em Parâmetros

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

void processar(Prioridade p) {
    // ...
}

processar(Prioridade.ALTA); // ✅ Passa constante
```

### 5. Em Retornos

```java
public enum TipoPagamento {
    DINHEIRO, CARTAO, PIX
}

TipoPagamento obterTipo() {
    return TipoPagamento.PIX; // ✅ Retorna constante
}
```

### 6. Import Static

```java
import static br.com.exemplo.DiaSemana.*;

// Sem qualificação
DiaSemana dia = SEGUNDA; // ✅ Sem DiaSemana.
```

### 7. Qualificação Completa

```java
package br.com.exemplo;

public enum Status {
    ATIVO, INATIVO
}

// Outro pacote
br.com.exemplo.Status s = br.com.exemplo.Status.ATIVO;
```

### 8. Múltiplas Constantes

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}

DiaSemana d1 = DiaSemana.SEGUNDA;
DiaSemana d2 = DiaSemana.TERCA;
DiaSemana d3 = DiaSemana.QUARTA;
```

### 9. Em Arrays

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor[] cores = {
    Cor.VERMELHO,
    Cor.VERDE,
    Cor.AZUL
};
```

### 10. Em Switch

```java
public enum Direcao {
    NORTE, SUL, LESTE, OESTE
}

void processar(Direcao dir) {
    switch (dir) {
        case NORTE:  // Sem Direcao.NORTE
            break;
    }
}
```

---

## Aplicabilidade

**Acessar constantes**:
- `NomeEnum.CONSTANTE` (qualificação completa)
- `import static` para simplificar
- Switch sem qualificação

---

## Armadilhas

### 1. Acesso sem Qualificação

```java
// ❌ ERRO: cannot find symbol
// Status s = ATIVO;

// ✅ Qualificação
Status s = Status.ATIVO;

// ✅ Ou import static
import static br.com.exemplo.Status.*;
Status s = ATIVO;
```

### 2. Case com Qualificação

```java
switch (status) {
    // ❌ ERRO: constant expression required
    // case Status.ATIVO: break;
    
    // ✅ Sem qualificação
    case ATIVO: break;
}
```

### 3. Nome Errado

```java
// ❌ ERRO: cannot find symbol
// Status s = Status.ATIVOO; // Typo

// ✅ Nome correto
Status s = Status.ATIVO;
```

---

## Boas Práticas

### 1. Qualificação Completa

```java
// ✅ Claro e explícito
DiaSemana dia = DiaSemana.SEGUNDA;
```

### 2. Import Static Moderado

```java
// ✅ Bom para enums muito usados
import static java.time.DayOfWeek.*;

DayOfWeek dia = MONDAY;

// ⚠️ Evitar import * de múltiplos enums
// import static Enum1.*;
// import static Enum2.*;  // Pode causar ambiguidade
```

### 3. Autocomplete do IDE

```java
// ✅ Use Ctrl+Space
DiaSemana dia = DiaSemana.  // IDE sugere constantes
```

### 4. Constante em Constante

```java
// ✅ Variável final com constante enum
public static final DiaSemana DIA_PADRAO = DiaSemana.SEGUNDA;
```

---

## Resumo

**Acesso a constantes**:

```java
public enum Status {
    ATIVO, INATIVO
}

// ✅ Qualificação completa
Status s = Status.ATIVO;

// ✅ Import static
import static br.com.exemplo.Status.*;
Status s = ATIVO;
```

**Formas de acesso**:

```java
// 1. Qualificação completa
DiaSemana dia = DiaSemana.SEGUNDA;

// 2. Import static
import static br.com.exemplo.DiaSemana.*;
DiaSemana dia = SEGUNDA;

// 3. Switch (sem qualificação)
switch (dia) {
    case SEGUNDA:  // Não DiaSemana.SEGUNDA
        break;
}
```

**Contextos de uso**:

```java
// Variáveis
Status s = Status.ATIVO;

// Parâmetros
void processar(Status s) { }
processar(Status.ATIVO);

// Retornos
Status obter() {
    return Status.ATIVO;
}

// Comparações
if (s == Status.ATIVO) { }

// Coleções
List<Status> lista = Arrays.asList(Status.ATIVO, Status.INATIVO);
```

**Regra de Ouro**: Acesse constantes com `NomeEnum.CONSTANTE`. Constantes são **static final** (acesso direto). Use **import static** para simplificar (`import static Status.*` → `ATIVO`). Switch **não** usa qualificação (`case ATIVO`, não `case Status.ATIVO`). IDE oferece **autocomplete** ao digitar `Enum.`.
