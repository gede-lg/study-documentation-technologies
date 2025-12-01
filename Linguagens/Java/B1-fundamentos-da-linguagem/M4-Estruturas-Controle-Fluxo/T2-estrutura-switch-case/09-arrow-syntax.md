# Arrow Syntax em Switch (Java 14+)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Arrow syntax** (`->`) é forma modernizada de escrever cases em switch (Java 14+) que **elimina necessidade de `break`** e **previne fall-through** acidental. Conceitualmente, transforma case de "label + statements" em "expressão direta" — cada case é **independente** e **auto-contido**.

**Comparação:**

```java
// COLON SYNTAX (tradicional)
switch (dia) {
    case 1:
        System.out.println("Segunda");
        break;
    case 2:
        System.out.println("Terça");
        break;
    default:
        System.out.println("Outro");
}

// ARROW SYNTAX (moderno)
switch (dia) {
    case 1 -> System.out.println("Segunda");
    case 2 -> System.out.println("Terça");
    default -> System.out.println("Outro");
}
```

**Conceito Fundamental:** Arrow syntax **elimina fall-through** — cada case executa **apenas seu código** e sai automaticamente. Não precisa `break` porque cada `->` define **statement/expressão independente**. É mais **conciso**, **seguro** (sem fall-through acidental), e **legível**.

### Contexto Histórico e Motivação

**Problema com Colon Syntax:**

1. **Verboso:** Repetir `break` em cada case
2. **Error-Prone:** Esquecer `break` causa fall-through acidental (97% não intencionais)
3. **Ruído Visual:** `break` adiciona linha extra sem valor semântico

**Inspiração:** Linguagens modernas (Kotlin `when`, Scala `match`, Rust `match`) usam sintaxe similar a arrow — cada caso independente sem fall-through.

**Evolução:**

- **Java 12 (2019):** Arrow syntax em switch expressions — preview (JEP 325)
- **Java 13 (2019):** Refinamentos e `yield` (JEP 354)
- **Java 14 (2020):** **Standard feature** (JEP 361)

**Motivação:**

1. **Concisão:** Menos código, mais legível
2. **Segurança:** Elimina fall-through acidental (bug comum)
3. **Expressividade:** Alinha com linguagens modernas
4. **Preparação:** Base para pattern matching

### Problema Fundamental que Resolve

**Problema: Fall-Through Acidental**

```java
// Colon syntax (bug comum)
int x = 2;

switch (x) {
    case 1:
        System.out.println("Um");
        // ESQUECEU break! Bug
    case 2:
        System.out.println("Dois");  // Executa
        break;
}

// Se x == 1, imprime "Um" E "Dois" (errado!)
```

**Solução: Arrow Syntax**

```java
// Arrow syntax (sem fall-through)
switch (x) {
    case 1 -> System.out.println("Um");
    case 2 -> System.out.println("Dois");
}

// Se x == 1, imprime APENAS "Um" (correto)
```

**Conceito:** Arrow **previne** fall-through — cada case auto-termina.

### Importância no Ecossistema

Arrow syntax é:

- **Standard Moderno:** Preferido em código novo
- **Base para Expressions:** Switch expressions sempre usam arrow
- **Preparação Pattern Matching:** Pattern matching requer arrow syntax

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Sem break:** Arrow elimina necessidade de `break`
2. **Sem Fall-Through:** Cada case independente
3. **Dois Modos:** Single statement ou bloco `{}`
4. **Compatível:** Coexiste com colon syntax (mas não mistura)
5. **Obrigatório em Expressions:** Switch expressions sempre usam arrow

### Pilares Fundamentais

- **No Break Required:** Arrow auto-termina
- **No Fall-Through:** Execução não continua em próximo case
- **Single Statement:** `case x -> statement;`
- **Block Form:** `case x -> { ... }`
- **Multiple Cases:** `case x, y, z -> ...` (OR)

---

## 🧠 Fundamentos Teóricos

### Single Statement Arrow

**Sintaxe:**

```java
switch (x) {
    case 1 -> System.out.println("Um");
    case 2 -> System.out.println("Dois");
    case 3 -> System.out.println("Três");
    default -> System.out.println("Outro");
}
```

**Conceito:** Cada `->` seguido de **uma statement** — executa e termina automaticamente.

**Equivalente Colon:**

```java
switch (x) {
    case 1:
        System.out.println("Um");
        break;
    case 2:
        System.out.println("Dois");
        break;
    case 3:
        System.out.println("Três");
        break;
    default:
        System.out.println("Outro");
}
```

### Block Arrow

**Multi-Line Código:**

```java
switch (x) {
    case 1 -> {
        System.out.println("Caso 1");
        System.out.println("Executando lógica complexa");
    }
    case 2 -> {
        System.out.println("Caso 2");
        fazerAlgo();
    }
    default -> System.out.println("Outro");
}
```

**Conceito:** Bloco `{}` permite múltiplas statements — executa todas e termina (sem `break`).

### Multiple Cases (OR)

**Agrupamento com Vírgula:**

```java
switch (dia) {
    case 1, 2, 3, 4, 5 -> System.out.println("Dia útil");
    case 6, 7 -> System.out.println("Fim de semana");
    default -> System.out.println("Dia inválido");
}
```

**Conceito:** Vírgula entre cases é **OR** — mais conciso que fall-through intencional.

**Equivalente Colon (Fall-Through):**

```java
switch (dia) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        System.out.println("Dia útil");
        break;
    case 6:
    case 7:
        System.out.println("Fim de semana");
        break;
    default:
        System.out.println("Dia inválido");
}
```

### Arrow em Expressions vs Statements

**Expression (Retorna Valor):**

```java
String resultado = switch (x) {
    case 1 -> "Um";
    case 2 -> "Dois";
    default -> "Outro";
};
```

**Statement (Não Retorna):**

```java
switch (x) {
    case 1 -> System.out.println("Um");
    case 2 -> System.out.println("Dois");
    default -> System.out.println("Outro");
}
```

**Conceito:** Arrow funciona em **ambos** — expressions e statements.

---

## 🔍 Análise Conceitual Profunda

### Arrow vs Colon: Comparação Detalhada

| Aspecto | Arrow (`->`) | Colon (`:`) |
|---------|-------------|-------------|
| **Fall-Through** | Não (auto-termina) | Sim (precisa `break`) |
| **break Necessário** | Não | Sim (exceto último) |
| **Múltiplos Cases** | `case 1, 2 ->` | `case 1: case 2:` |
| **Legibilidade** | Mais conciso | Mais verboso |
| **Segurança** | Previne bugs | Error-prone |
| **Uso em Expressions** | Obrigatório | Não permitido |
| **Uso em Statements** | Opcional | Tradicional |

### Quando Usar Cada Sintaxe

**Arrow (Moderno - Recomendado):**

- **Código Novo:** Sempre preferir arrow
- **Switch Expressions:** Obrigatório
- **Prevenir Bugs:** Elimina fall-through acidental
- **Concisão:** Menos boilerplate

**Colon (Legado):**

- **Código Antigo:** Manter consistência em codebase existente
- **Fall-Through Intencional:** Raros casos onde fall-through é útil
- **Compatibilidade:** Java < 14

### Não Pode Misturar Sintaxes

```java
// ERRO: não pode misturar -> e :
switch (x) {
    case 1 -> System.out.println("Um");
    case 2:  // ERRO!
        System.out.println("Dois");
        break;
}
```

**Conceito:** Switch inteiro deve usar **uma sintaxe** — ou arrow ou colon, não ambas.

### Arrow com yield (Expressions)

```java
int resultado = switch (x) {
    case 1 -> 10;
    case 2 -> {
        int temp = 20;
        yield temp;  // yield em bloco
    }
    default -> 0;
};
```

**Conceito:** Arrow em expressions: single value retorna implicitamente, blocos usam `yield`.

### Arrow com throw

```java
String resultado = switch (x) {
    case 1 -> "Um";
    case 2 -> "Dois";
    default -> throw new IllegalArgumentException("Valor inválido");
};
```

**Conceito:** `throw` é válido após arrow — termina switch (sem retornar valor).

---

## 🎯 Aplicabilidade e Contextos

### 1. Menu Simples (Statement)

```java
switch (opcao) {
    case 1 -> criarNovo();
    case 2 -> abrir();
    case 3 -> salvar();
    case 4 -> sair();
    default -> System.out.println("Opção inválida");
}
```

### 2. Mapeamento de Valores (Expression)

```java
String mes = switch (numero) {
    case 1 -> "Janeiro";
    case 2 -> "Fevereiro";
    case 3 -> "Março";
    case 4 -> "Abril";
    case 5 -> "Maio";
    case 6 -> "Junho";
    case 7 -> "Julho";
    case 8 -> "Agosto";
    case 9 -> "Setembro";
    case 10 -> "Outubro";
    case 11 -> "Novembro";
    case 12 -> "Dezembro";
    default -> "Inválido";
};
```

### 3. Cálculos com Lógica (Blocos)

```java
int resultado = switch (operacao) {
    case "soma" -> a + b;
    case "subtracao" -> a - b;
    case "multiplicacao" -> a * b;
    case "divisao" -> {
        if (b == 0) {
            System.err.println("Divisão por zero");
            yield 0;
        }
        yield a / b;
    }
    default -> {
        System.err.println("Operação inválida");
        yield 0;
    }
};
```

### 4. State Machine

```java
Estado proximoEstado(Estado atual, Evento evento) {
    return switch (atual) {
        case INICIAL -> switch (evento) {
            case INICIAR -> Estado.PROCESSANDO;
            case CANCELAR -> Estado.CANCELADO;
            default -> Estado.INICIAL;
        };
        case PROCESSANDO -> switch (evento) {
            case CONCLUIR -> Estado.CONCLUIDO;
            case ERRO -> Estado.ERRO;
            default -> Estado.PROCESSANDO;
        };
        case CONCLUIDO, CANCELADO, ERRO -> atual;  // Terminais
    };
}
```

### 5. Pattern Matching (Java 17+)

```java
String descrever(Object obj) {
    return switch (obj) {
        case String s -> "String de tamanho " + s.length();
        case Integer i -> "Integer: " + i;
        case Double d -> "Double: " + d;
        case null -> "null";
        default -> "Tipo desconhecido";
    };
}
```

---

## ⚠️ Limitações e Considerações

### 1. Sem Fall-Through Intencional

**Não É Possível:**

```java
// Colon permite fall-through intencional
switch (x) {
    case 1:
        A();
        // Fall-through
    case 2:
        B();
        break;
}

// Arrow NÃO permite equivalente direto
switch (x) {
    case 1 -> {
        A();
        // Não cai em case 2!
    }
    case 2 -> B();
}
```

**Solução (se realmente necessário):** Extrair lógica comum:

```java
switch (x) {
    case 1 -> {
        A();
        B();  // Chamar explicitamente
    }
    case 2 -> B();
}
```

### 2. Apenas Java 14+

```bash
# Código com arrow syntax requer Java 14+
javac --release 14 Arquivo.java
```

### 3. Não Pode Ser Vazio

```java
// ERRO: case arrow não pode ser vazio
switch (x) {
    case 1 -> ;  // ERRO
    default -> System.out.println("Ok");
}
```

**Solução:** Usar bloco vazio `{}`:

```java
switch (x) {
    case 1 -> {}  // OK (bloco vazio)
    default -> System.out.println("Ok");
}
```

### 4. Performance Idêntica

Arrow syntax é **syntax sugar** — compilado para mesmo bytecode que colon syntax. Sem overhead runtime.

---

## 🔗 Interconexões Conceituais

### Relação com Switch Expressions

Switch expressions **sempre** usam arrow syntax (ou colon com `yield`).

### Relação com Pattern Matching

Pattern matching requer arrow syntax — cases com types.

### Relação com Fall-Through

Arrow **elimina** fall-through — design deliberado para prevenir bugs.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Pattern Matching:** Arrow com tipos complexos
2. **Sealed Classes:** Exaustividade com arrow syntax
3. **Record Deconstruction:** Extrair componentes com arrow

---

## 📚 Conclusão

**Arrow syntax** (`->`, Java 14+) é forma modernizada de escrever cases em switch que **elimina `break`** e **previne fall-through** acidental. Cada `case x -> statement` é **independente** — executa e termina automaticamente. Suporta **single statement** (`case 1 -> A();`) ou **blocos** (`case 1 -> { ... }`). **Múltiplos cases** com vírgula (`case 1, 2, 3 ->`) substituem fall-through intencional de forma mais clara. **Obrigatório** em switch expressions, **opcional** em statements (mas recomendado). **Não pode misturar** com colon syntax (`:`) — switch inteiro deve usar uma sintaxe. **Sem overhead** runtime — compilado para mesmo bytecode. **Mais seguro** (sem fall-through acidental), **mais conciso** (sem `break` repetitivo), **mais legível** (intenção clara). Alinha Java com linguagens modernas (Kotlin, Scala, Rust). É **base** para pattern matching e sealed classes. Arrow syntax é **padrão moderno** — preferir em código novo. Compreender arrow syntax é essencial para aproveitar switch expressions, pattern matching, e escrever código Java moderno e seguro.
