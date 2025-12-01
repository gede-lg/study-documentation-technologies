# T1.01 - Definição: Tipo Especial de Classe para Constantes

## Introdução

**Enum**: tipo especial de classe para representar conjunto fixo de constantes.

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}
```

**Constantes**: valores que não mudam (fixos, imutáveis).

---

## Fundamentos

### 1. Enum é uma Classe Especial

**Enum**: internamente é uma classe.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// Internamente, compilador gera algo como:
// public final class Status extends Enum<Status> {
//     public static final Status ATIVO = new Status();
//     public static final Status INATIVO = new Status();
//     public static final Status PENDENTE = new Status();
// }
```

### 2. Conjunto Fixo de Constantes

**Fixo**: todas as constantes declaradas na compilação.

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

// Apenas 3 valores possíveis:
Cor cor1 = Cor.VERMELHO; // ✅
Cor cor2 = Cor.VERDE;    // ✅
Cor cor3 = Cor.AZUL;     // ✅

// Não é possível criar novas constantes em runtime
```

### 3. Cada Constante é uma Instância Única

**Singleton**: cada constante é instância única do enum.

```java
public enum Direcao {
    NORTE, SUL, LESTE, OESTE
}

Direcao d1 = Direcao.NORTE;
Direcao d2 = Direcao.NORTE;

System.out.println(d1 == d2); // true (mesma instância)
```

### 4. Enum vs Constantes int

**Antes (int)**: sem type-safety.

```java
// ❌ Abordagem antiga (sem type-safety)
public class Status {
    public static final int ATIVO = 0;
    public static final int INATIVO = 1;
    public static final int PENDENTE = 2;
}

int status = Status.ATIVO;
status = 999; // ✅ Compila, mas inválido!
```

**Agora (enum)**: com type-safety.

```java
// ✅ Enum (type-safe)
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status status = Status.ATIVO;
// status = 999; // ❌ ERRO de compilação
```

### 5. Enum vs Constantes String

**Antes (String)**: comparação com equals, erros de digitação.

```java
// ❌ Abordagem antiga (Strings)
public class DiaSemana {
    public static final String SEGUNDA = "SEGUNDA";
    public static final String TERCA = "TERCA";
}

String dia = DiaSemana.SEGUNDA;
dia = "TERCA"; // ✅ Compila
dia = "TERÇA"; // ✅ Compila, mas erro de digitação!

if (dia.equals("TERCA")) { } // Precisa equals
```

**Agora (enum)**: comparação com ==, sem erros.

```java
// ✅ Enum
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}

DiaSemana dia = DiaSemana.SEGUNDA;
// dia = "TERCA"; // ❌ ERRO de compilação

if (dia == DiaSemana.TERCA) { } // Usa ==
```

### 6. Enum como Tipo

**Tipo**: enum é um tipo próprio.

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

public class Tarefa {
    private Prioridade prioridade;
    
    public void setPrioridade(Prioridade p) {
        this.prioridade = p;
    }
    
    public Prioridade getPrioridade() {
        return prioridade;
    }
}

Tarefa t = new Tarefa();
t.setPrioridade(Prioridade.ALTA); // ✅
// t.setPrioridade(5); // ❌ ERRO
```

### 7. Valores Pré-Definidos

**Pré-definidos**: todos os valores conhecidos em compile-time.

```java
public enum Mes {
    JANEIRO, FEVEREIRO, MARCO, ABRIL, MAIO, JUNHO,
    JULHO, AGOSTO, SETEMBRO, OUTUBRO, NOVEMBRO, DEZEMBRO
}

// 12 valores possíveis, todos conhecidos
Mes[] meses = Mes.values(); // Retorna array com todos
System.out.println(meses.length); // 12
```

### 8. Enum em Parâmetros de Métodos

**Parâmetro**: garante apenas valores válidos.

```java
public enum TipoUsuario {
    ADMIN, USUARIO, CONVIDADO
}

public class Sistema {
    public void login(String nome, TipoUsuario tipo) {
        System.out.println("Login: " + nome + " (" + tipo + ")");
    }
}

Sistema s = new Sistema();
s.login("João", TipoUsuario.ADMIN); // ✅
// s.login("Maria", "ADMIN"); // ❌ ERRO
```

### 9. Enum em Coleções

**Coleções**: Set, Map, List.

```java
import java.util.*;

public enum Status {
    PENDENTE, PROCESSANDO, CONCLUIDO, ERRO
}

Set<Status> statusAtivos = EnumSet.of(Status.PENDENTE, Status.PROCESSANDO);

Map<Status, Integer> contagem = new EnumMap<>(Status.class);
contagem.put(Status.PENDENTE, 5);
contagem.put(Status.CONCLUIDO, 10);

List<Status> historico = new ArrayList<>();
historico.add(Status.PENDENTE);
historico.add(Status.CONCLUIDO);
```

### 10. Enum como Constante de Domínio

**Domínio**: representar conceitos do negócio.

```java
public enum FormaPagamento {
    DINHEIRO, CARTAO_CREDITO, CARTAO_DEBITO, PIX, BOLETO
}

public class Pedido {
    private FormaPagamento forma;
    
    public void pagar(FormaPagamento forma) {
        this.forma = forma;
        System.out.println("Pagamento via: " + forma);
    }
}

Pedido pedido = new Pedido();
pedido.pagar(FormaPagamento.PIX);
// Pagamento via: PIX
```

---

## Aplicabilidade

**Use enum quando**:
- Conjunto fixo de valores conhecidos em compile-time
- Dias da semana, meses, cores, status
- Direções (norte, sul, leste, oeste)
- Tipos de usuário, prioridades
- Formas de pagamento, categorias

**Vantagens**:
- Type-safety (apenas valores válidos)
- Comparação com == (mais rápido que equals)
- Autocomplete no IDE
- Refatoração segura
- Switch exhaustivo

---

## Armadilhas

### 1. Tentar Criar Instância com new

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

// ❌ ERRO: não pode instanciar enum
// Cor cor = new Cor(); // ERRO
```

### 2. Comparar com equals Desnecessariamente

```java
public enum Status {
    ATIVO, INATIVO
}

Status s = Status.ATIVO;

// ❌ Desnecessário (mas funciona)
if (s.equals(Status.ATIVO)) { }

// ✅ Preferir ==
if (s == Status.ATIVO) { }
```

### 3. Usar int/String em Vez de Enum

```java
// ❌ Sem type-safety
public void setStatus(int status) {
    // Aceita qualquer int!
}

// ✅ Com type-safety
public void setStatus(Status status) {
    // Apenas valores do enum
}
```

---

## Boas Práticas

### 1. Usar Enum para Conjuntos Fixos

```java
// ✅ Enum para dias da semana
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}
```

### 2. Enum em Switch

```java
public enum Direcao {
    NORTE, SUL, LESTE, OESTE
}

public void mover(Direcao dir) {
    switch (dir) {
        case NORTE:  System.out.println("↑"); break;
        case SUL:    System.out.println("↓"); break;
        case LESTE:  System.out.println("→"); break;
        case OESTE:  System.out.println("←"); break;
    }
}
```

### 3. Comparar com ==

```java
// ✅ Usar == (mais rápido)
Status s = Status.ATIVO;
if (s == Status.ATIVO) {
    // ...
}
```

### 4. EnumSet para Performance

```java
// ✅ EnumSet (mais eficiente que HashSet)
import java.util.EnumSet;

public enum Permissao {
    LER, ESCREVER, EXECUTAR
}

EnumSet<Permissao> perms = EnumSet.of(Permissao.LER, Permissao.ESCREVER);
```

---

## Resumo

**Enum**: tipo especial de classe para representar conjunto **fixo** de constantes.

```java
public enum NomeEnum {
    CONSTANTE1, CONSTANTE2, CONSTANTE3
}
```

**Características**:
- Tipo especial de classe
- Conjunto fixo de valores
- Cada constante = instância única (singleton)
- Type-safe (apenas valores válidos)
- Comparação com == (rápida e segura)
- Valores pré-definidos em compile-time

**vs Constantes int**:
| Aspecto | int | Enum |
|---------|-----|------|
| Type-safety | ❌ | ✅ |
| Valores inválidos | ✅ Aceita | ❌ Rejeita |
| Comparação | Qualquer int | Apenas enum |

**vs Constantes String**:
| Aspecto | String | Enum |
|---------|--------|------|
| Comparação | equals() | == |
| Erros de digitação | ✅ Possível | ❌ Impossível |
| Performance | Mais lento | Mais rápido |

**Casos de uso**:
- Dias da semana, meses
- Status (ATIVO, INATIVO, PENDENTE)
- Prioridades (BAIXA, MEDIA, ALTA)
- Cores, direções
- Formas de pagamento

**Regra de Ouro**: Use **enum** para conjunto **fixo** de valores conhecidos em compile-time. Enum garante **type-safety** (apenas valores válidos). Compare com **==** (mais rápido que equals). Cada constante é **instância única** (singleton).
