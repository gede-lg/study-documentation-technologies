# yield em Switch Expressions (Java 13+)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**`yield`** é palavra-chave (Java 13+) usada para **retornar valor** de um bloco `{}` dentro de switch expression. Conceitualmente, `yield` é **análogo a `return`** em métodos — especifica valor que o bloco produz, mas ao invés de terminar método inteiro, termina apenas o bloco do switch e retorna valor para a expressão.

**Sintaxe:**

```java
int resultado = switch (x) {
    case 1 -> {
        int temp = 10;
        System.out.println("Processando caso 1");
        yield temp;  // Retorna 10 do bloco
    }
    case 2 -> {
        yield 20;
    }
    default -> 0;
};
```

**Conceito Fundamental:** `yield` é necessário quando case usa **bloco multi-linha** (`{}`) em switch expression. Arrow simples (`case 1 -> valor`) não precisa de `yield` — valor é retornado implicitamente. Blocos precisam de `yield` explícito porque podem conter múltiplas statements.

### Contexto Histórico e Motivação

**Problema sem yield (Java 12 - Preview):**

Java 12 introduziu switch expressions, mas blocos multi-linha usavam **`break valor`** para retornar:

```java
// Java 12 (preview)
int resultado = switch (x) {
    case 1 -> {
        int temp = 10;
        break temp;  // CONFUSO: break retorna valor?!
    }
    default -> 0;
};
```

**Problema:** `break` tem **semântica dupla** — em statements, sai do switch; em expressions, retorna valor. **Extremamente confuso** e ambíguo.

**Solução: yield (Java 13):**

Java 13 introduziu `yield` como palavra-chave **distinta** para retornar valores:

```java
// Java 13+ (correto)
int resultado = switch (x) {
    case 1 -> {
        int temp = 10;
        yield temp;  // CLARO: yield retorna valor
    }
    default -> 0;
};
```

**Motivação:**

1. **Clareza Semântica:** `yield` significa "produzir valor", `break` significa "sair"
2. **Separação de Conceitos:** Expressions usam `yield`, statements usam `break`
3. **Evitar Confusão:** Palavra-chave dedicada previne ambiguidade

**Evolução:**

- **Java 12 (2019):** Switch expressions preview com `break valor`
- **Java 13 (2019):** Segunda preview, substitui `break valor` por `yield` (JEP 354)
- **Java 14 (2020):** **Standard feature** com `yield` (JEP 361)

### Problema Fundamental que Resolve

**Problema: Blocos Multi-Linha Precisam Retornar Valor**

Switch expression **sempre retorna valor**, mas blocos `{}` podem ter múltiplas statements — como especificar qual valor retornar?

```java
// Como retornar valor de bloco complexo?
int resultado = switch (operacao) {
    case "fatorial" -> {
        int fatorial = 1;
        for (int i = 1; i <= numero; i++) {
            fatorial *= i;
        }
        // Como retornar fatorial?
    }
    default -> 0;
};
```

**Solução: yield**

```java
int resultado = switch (operacao) {
    case "fatorial" -> {
        int fatorial = 1;
        for (int i = 1; i <= numero; i++) {
            fatorial *= i;
        }
        yield fatorial;  // Retorna valor do bloco
    }
    default -> 0;
};
```

**Conceito:** `yield` é **ponto de saída** do bloco que especifica valor de retorno.

### Importância no Ecossistema

`yield` é **essencial** para:

- **Switch Expressions Complexas:** Blocos com lógica multi-linha
- **Separação Semântica:** Distinguir expressions de statements
- **Pattern Matching:** Blocos com extração/processamento complexo

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Retorna Valor:** `yield valor` produz resultado do bloco
2. **Apenas em Expressions:** Não funciona em switch statements
3. **Obrigatório em Blocos:** Blocos `{}` em expressions **devem** usar `yield`
4. **Controle de Fluxo:** `yield` termina bloco imediatamente
5. **Palavra-Chave Contextual:** Só é keyword em switch expressions

### Pilares Fundamentais

- **Value Production:** Produz valor do bloco
- **Expression-Only:** Apenas em switch expressions, não statements
- **Mandatory in Blocks:** Blocos precisam de `yield` explícito
- **Control Transfer:** Termina bloco e retorna ao switch
- **Contextual Keyword:** Não quebra código que usa `yield` como identificador (fora de switch)

---

## 🧠 Fundamentos Teóricos

### Quando yield É Necessário

**Arrow Simples (Sem yield):**

```java
String resultado = switch (x) {
    case 1 -> "Um";  // Valor diretamente
    case 2 -> "Dois";
    default -> "Outro";
};
```

**Conceito:** Expressão única após `->` retorna valor implicitamente — `yield` **não** necessário.

**Bloco com yield (Obrigatório):**

```java
String resultado = switch (x) {
    case 1 -> {
        System.out.println("Caso 1");
        yield "Um";  // yield OBRIGATÓRIO
    }
    case 2 -> {
        yield "Dois";
    }
    default -> "Outro";
};
```

**Conceito:** Blocos `{}` podem ter múltiplas statements — `yield` especifica qual valor retornar.

### Erro Comum: Esquecer yield

```java
// ERRO: bloco não retorna valor
int resultado = switch (x) {
    case 1 -> {
        int temp = 10;
        temp;  // ERRO: esperava yield
    }
    default -> 0;
};
```

**Compilador:** `error: invalid switch label`

**Correto:**

```java
int resultado = switch (x) {
    case 1 -> {
        int temp = 10;
        yield temp;  // OK
    }
    default -> 0;
};
```

### yield Termina Bloco Imediatamente

```java
int resultado = switch (x) {
    case 1 -> {
        yield 10;
        System.out.println("Nunca executa");  // Unreachable code
    }
    default -> 0;
};
```

**Conceito:** `yield` é como `return` — código após ele no bloco é **unreachable** (erro de compilação).

### Múltiplos Caminhos com yield

```java
int resultado = switch (x) {
    case 1 -> {
        if (condicao) {
            yield 10;
        } else {
            yield 20;
        }
        // Todos os caminhos devem yield
    }
    default -> 0;
};
```

**Conceito:** **Todos os caminhos** de execução no bloco devem terminar com `yield` (ou `throw`).

---

## 🔍 Análise Conceitual Profunda

### yield com Cálculos Complexos

**Fatorial:**

```java
int numero = 5;

int resultado = switch (numero) {
    case 0, 1 -> 1;
    default -> {
        int fatorial = 1;
        for (int i = 2; i <= numero; i++) {
            fatorial *= i;
        }
        yield fatorial;
    }
};

System.out.println(resultado);  // 120
```

**Conceito:** Bloco pode conter loops, condicionais, etc. — `yield` retorna resultado final.

### yield com Side Effects

```java
int contador = 0;

String resultado = switch (x) {
    case 1 -> {
        contador++;
        System.out.println("Incrementando contador");
        yield "Um";
    }
    case 2 -> {
        contador += 2;
        yield "Dois";
    }
    default -> "Outro";
};

System.out.println("Contador: " + contador);
```

**Conceito:** Blocos podem ter **side effects** (modificar variáveis, I/O) antes de `yield` — não é puramente funcional.

### yield vs return

**yield em Switch:**

```java
String metodo() {
    int x = 2;

    String resultado = switch (x) {
        case 1 -> {
            yield "Um";  // Retorna do BLOCO, não do método
        }
        case 2 -> {
            yield "Dois";
        }
        default -> "Outro";
    };

    return resultado;  // return retorna do MÉTODO
}
```

**return em Switch (Curto-Circuito):**

```java
String metodo(int x) {
    return switch (x) {
        case 1 -> {
            yield "Um";
        }
        case 2 -> "Dois";
        default -> {
            return "Outro";  // return sai do método INTEIRO
        }
    };  // Este ponto nunca alcançado se default executa
}
```

**Conceito:**
- **`yield`:** Retorna do **bloco** para switch expression
- **`return`:** Retorna do **método** inteiro (ignora switch)

### yield com throw

**Alternativa a yield: Lançar Exceção**

```java
int resultado = switch (x) {
    case 1 -> {
        yield 10;
    }
    case 2 -> {
        throw new IllegalArgumentException("Valor inválido");
    }
    default -> 0;
};
```

**Conceito:** Bloco pode terminar com `yield` **ou** `throw` — ambos são terminadores válidos.

---

## 🎯 Aplicabilidade e Contextos

### 1. Validação + Retorno

```java
int validarEProcessar(String entrada) {
    return switch (entrada) {
        case "zero" -> 0;
        case "um" -> 1;
        case "dois" -> 2;
        default -> {
            System.err.println("Entrada inválida: " + entrada);
            yield -1;
        }
    };
}
```

### 2. Cálculos com Logging

```java
double calcular(String operacao, double a, double b) {
    return switch (operacao) {
        case "soma" -> a + b;
        case "subtracao" -> a - b;
        case "multiplicacao" -> a * b;
        case "divisao" -> {
            if (b == 0) {
                System.err.println("Divisão por zero!");
                yield Double.NaN;
            }
            yield a / b;
        }
        default -> {
            System.err.println("Operação desconhecida: " + operacao);
            yield 0.0;
        }
    };
}
```

### 3. Parsing com Conversão

```java
Object parse(String token) {
    return switch (token.charAt(0)) {
        case '"' -> {
            // Parse string
            String s = token.substring(1, token.length() - 1);
            yield s;
        }
        case '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' -> {
            // Parse número
            yield Integer.parseInt(token);
        }
        case 't', 'f' -> {
            // Parse boolean
            yield Boolean.parseBoolean(token);
        }
        default -> {
            System.err.println("Token inválido: " + token);
            yield null;
        }
    };
}
```

### 4. State Machine com Transições Complexas

```java
Estado proximoEstado(Estado atual, Evento evento, Contexto ctx) {
    return switch (atual) {
        case INICIAL -> {
            if (evento == Evento.INICIAR) {
                ctx.inicializar();
                yield Estado.PROCESSANDO;
            }
            yield Estado.INICIAL;
        }
        case PROCESSANDO -> {
            if (evento == Evento.ERRO) {
                ctx.logar("Erro durante processamento");
                yield Estado.ERRO;
            } else if (evento == Evento.CONCLUIR) {
                ctx.finalizar();
                yield Estado.CONCLUIDO;
            }
            yield Estado.PROCESSANDO;
        }
        case CONCLUIDO, ERRO -> atual;  // Estados terminais
    };
}
```

---

## ⚠️ Limitações e Considerações

### 1. Apenas em Switch Expressions

```java
// ERRO: yield em switch statement
switch (x) {
    case 1:
        yield 10;  // ERRO: statement não retorna valor
}
```

**Conceito:** `yield` só funciona em **expressions**, não **statements**.

### 2. Todos os Caminhos Devem yield

```java
// ERRO: nem todos os caminhos yield
int resultado = switch (x) {
    case 1 -> {
        if (condicao) {
            yield 10;
        }
        // ERRO: falta yield no else implícito
    }
    default -> 0;
};
```

**Correto:**

```java
int resultado = switch (x) {
    case 1 -> {
        if (condicao) {
            yield 10;
        } else {
            yield 20;
        }
    }
    default -> 0;
};
```

### 3. yield É Contextual Keyword

**Não Quebra Código Antigo:**

```java
// "yield" como identificador (válido FORA de switch expression)
int yield = 10;  // OK
void yield() {}  // OK

// Mas DENTRO de switch expression, é keyword
int resultado = switch (x) {
    case 1 -> {
        int yield = 10;  // ERRO: yield é keyword aqui
        yield yield;  // Confuso, mas tecnicamente válido (yield valor)
    }
    default -> 0;
};
```

### 4. Performance Idêntica

`yield` é **syntax sugar** — não adiciona overhead runtime. Compilado para mesmo bytecode que switch statement.

---

## 🔗 Interconexões Conceituais

### Relação com Switch Expressions

`yield` é mecanismo de retorno para blocos em switch expressions.

### Relação com return

Ambos terminam fluxo e retornam valor, mas `yield` termina bloco, `return` termina método.

### Relação com throw

`throw` é alternativa a `yield` — ambos terminam bloco validamente.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Arrow Syntax:** Detalhes de `->` vs `:` em switch
2. **Pattern Matching:** yield com patterns complexos
3. **Sealed Classes:** yield com exaustividade garantida

---

## 📚 Conclusão

**`yield`** (Java 13+) é palavra-chave usada para **retornar valor** de blocos `{}` em switch expressions. É **análogo a `return`** em métodos — especifica valor que bloco produz, mas termina apenas bloco (não método inteiro). **Obrigatório** quando case usa bloco multi-linha — arrow simples (`case 1 -> valor`) retorna implicitamente, blocos precisam de `yield` explícito. Substitui `break valor` confuso de Java 12 preview — separação semântica clara entre `break` (sai de loop/switch) e `yield` (produz valor). **Apenas em switch expressions** — não funciona em switch statements (que não retornam valor). Todos os caminhos de execução no bloco devem terminar com `yield` (ou `throw`). `yield` termina bloco **imediatamente** — código após é unreachable. É **contextual keyword** — não quebra código antigo que usa `yield` como identificador (fora de switch). Permite blocos complexos com loops, condicionais, side effects antes de retornar valor. Performance idêntica a switch statement — é syntax sugar sem overhead. Compreender `yield` é essencial para usar switch expressions com lógica complexa e aproveitar pattern matching moderno em Java.
