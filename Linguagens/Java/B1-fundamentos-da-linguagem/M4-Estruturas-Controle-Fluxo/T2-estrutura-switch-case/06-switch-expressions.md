# Switch Expressions (Java 12+)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Switch expression** (Java 12+) é forma modernizada de switch que **retorna um valor** diretamente, ao invés de executar statements. Conceitualmente, transforma switch de **estrutura de controle de fluxo** (statement) em **expressão** — pode ser usado no lado direito de atribuições, como argumento de método, ou qualquer lugar que aceite expressão.

**Comparação:**

```java
// Switch STATEMENT (tradicional)
String resultado;
switch (dia) {
    case 1:
        resultado = "Segunda";
        break;
    case 2:
        resultado = "Terça";
        break;
    default:
        resultado = "Inválido";
}

// Switch EXPRESSION (Java 12+)
String resultado = switch (dia) {
    case 1 -> "Segunda";
    case 2 -> "Terça";
    default -> "Inválido";
};  // Note o ponto e vírgula!
```

**Conceito Fundamental:** Switch expression **elimina boilerplate** — não precisa de variável temporária, múltiplas atribuições, ou `break` repetitivo. **Sempre retorna valor** — compilador garante que todos os caminhos retornam algo (exaustividade).

### Contexto Histórico e Motivação

**Problema com Switch Statement:**

1. **Verboso:** Repetir `break`, atribuir variável múltiplas vezes
2. **Error-Prone:** Esquecer `break` causa fall-through
3. **Não É Expressão:** Não pode usar diretamente em atribuições/argumentos

**Inspiração:** Linguagens funcionais (Scala, Kotlin, Rust) têm pattern matching que retorna valores. Java adaptou conceito mantendo compatibilidade com switch tradicional.

**Evolução:**

- **Java 12 (2019):** Switch expressions como **preview feature** (JEP 325)
- **Java 13 (2019):** Segunda preview, introduziu `yield` (JEP 354)
- **Java 14 (2020):** **Standard feature** (JEP 361)

**Motivação:**

1. **Concisão:** Menos código, mais legível
2. **Segurança:** Elimina fall-through acidental
3. **Expressividade:** Usar switch onde antes precisava if-else-if
4. **Preparação:** Base para pattern matching futuro

### Problema Fundamental que Resolve

**Problema: Boilerplate de Atribuições**

```java
// Statement (verboso)
String tipoAnimal;
switch (animal) {
    case "cachorro":
        tipoAnimal = "mamífero";
        break;
    case "papagaio":
        tipoAnimal = "ave";
        break;
    case "jacaré":
        tipoAnimal = "réptil";
        break;
    default:
        tipoAnimal = "desconhecido";
}
```

**Solução: Expression (Concisa)**

```java
// Expression (direto)
String tipoAnimal = switch (animal) {
    case "cachorro" -> "mamífero";
    case "papagaio" -> "ave";
    case "jacaré" -> "réptil";
    default -> "desconhecido";
};
```

**Conceito:** Elimina variável temporária e atribuições repetidas — switch **produz valor** diretamente.

### Importância no Ecossistema

Switch expressions são **fundamento** para:

- **Pattern Matching (Java 17+):** Decomposição de tipos complexos
- **Expressividade:** Código mais funcional
- **Preparação Linguagem:** Caminho para features futuras (sealed types)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Retorna Valor:** Switch produz resultado diretamente
2. **Exaustividade:** Compilador garante que todos os casos retornam valor
3. **Sem Fall-Through:** Arrow syntax (`->`) não permite fall-through
4. **Dois Modos:** Arrow (`->`) ou block com `yield`
5. **Compatibilidade:** Switch statement continua válido (não deprecado)

### Pilares Fundamentais

- **Expression vs Statement:** Retorna valor vs executa comandos
- **Arrow Syntax:** `case valor -> resultado` (conciso)
- **Yield Keyword:** `yield resultado` em blocos multi-linha
- **Exhaustiveness:** Compilador exige todos os casos tratados
- **No Fall-Through:** Cada case independente

---

## 🧠 Fundamentos Teóricos

### Sintaxe Básica (Arrow)

**Single Expression:**

```java
String resultado = switch (x) {
    case 1 -> "Um";
    case 2 -> "Dois";
    case 3 -> "Três";
    default -> "Outro";
};
```

**Conceito:** Cada `case` retorna **uma expressão**. Sem `break` — arrow implica retorno.

**Multiple Cases (OR):**

```java
String categoria = switch (dia) {
    case 1, 2, 3, 4, 5 -> "Dia útil";  // Vírgula = OR
    case 6, 7 -> "Fim de semana";
    default -> throw new IllegalArgumentException("Dia inválido");
};
```

**Conceito:** Vírgula entre casos é equivalente a OR — mais conciso que múltiplos cases vazios com fall-through.

### Sintaxe com Blocos (yield)

**Multi-Line Block:**

```java
int resultado = switch (operacao) {
    case "somar" -> {
        int temp = a + b;
        System.out.println("Somando: " + temp);
        yield temp;  // yield retorna valor
    }
    case "subtrair" -> {
        int temp = a - b;
        System.out.println("Subtraindo: " + temp);
        yield temp;
    }
    default -> throw new IllegalArgumentException("Operação inválida");
};
```

**Conceito:** Blocos `{}` permitem múltiplas statements. **`yield`** retorna valor do bloco (análogo a `return` em método).

### Exaustividade (Exhaustiveness)

**Compilador Exige Todos os Casos:**

```java
// ERRO: switch expression não cobre todos os valores
int x = 5;
String resultado = switch (x) {
    case 1 -> "Um";
    case 2 -> "Dois";
    // Missing default! Compile error
};
```

**Solução: default**

```java
String resultado = switch (x) {
    case 1 -> "Um";
    case 2 -> "Dois";
    default -> "Outro";  // Necessário!
};
```

**Com Enums (Exaustividade Sem default):**

```java
enum Cor { VERMELHO, AZUL, VERDE }

Cor cor = Cor.VERMELHO;

// Se todos os valores enum estão cobertos, default OPCIONAL
String nome = switch (cor) {
    case VERMELHO -> "Red";
    case AZUL -> "Blue";
    case VERDE -> "Green";
    // default não necessário (mas se adicionar valor ao enum, quebra)
};
```

**Conceito:** Compilador verifica **em compile-time** que switch expression **sempre retorna valor**.

### Compatibilidade: Statement vs Expression

**Statement (Tradicional):**

```java
switch (x) {
    case 1:
        System.out.println("Um");
        break;
    case 2:
        System.out.println("Dois");
        break;
}
// Não retorna valor, apenas executa código
```

**Expression (Novo):**

```java
String s = switch (x) {
    case 1 -> "Um";
    case 2 -> "Dois";
    default -> "Outro";
};
// Retorna valor
```

**Ambos Coexistem:** Switch statement continua válido — não há deprecação.

---

## 🔍 Análise Conceitual Profunda

### Uso em Atribuições

```java
String mensagem = switch (status) {
    case 200 -> "OK";
    case 404 -> "Not Found";
    case 500 -> "Server Error";
    default -> "Unknown Status: " + status;
};

System.out.println(mensagem);
```

### Uso como Argumento de Método

```java
System.out.println(
    switch (nivel) {
        case 1 -> "Iniciante";
        case 2 -> "Intermediário";
        case 3 -> "Avançado";
        default -> "Desconhecido";
    }
);
```

### Uso em Retorno de Método

```java
String obterCategoria(int idade) {
    return switch (idade / 10) {
        case 0, 1 -> "Criança";
        case 2, 3, 4, 5 -> "Adulto";
        default -> "Idoso";
    };
}
```

### Lançar Exceções em Switch Expression

**Arrow com throw:**

```java
String processar(String comando) {
    return switch (comando) {
        case "criar" -> "Criado";
        case "deletar" -> "Deletado";
        default -> throw new IllegalArgumentException("Comando inválido");
    };
}
```

**Conceito:** `throw` é **expressão** em Java — pode ser usado como valor de retorno.

### Blocos Complexos com yield

**Cálculos Multi-Linha:**

```java
int resultado = switch (operacao) {
    case "fatorial" -> {
        int fatorial = 1;
        for (int i = 1; i <= numero; i++) {
            fatorial *= i;
        }
        yield fatorial;  // Retorna resultado do bloco
    }
    case "dobro" -> {
        yield numero * 2;
    }
    case "triplo" -> {
        yield numero * 3;
    }
    default -> throw new IllegalArgumentException();
};
```

**Conceito:** `yield` é como `return`, mas para blocos em switch expressions.

### Sem yield (Arrow Simples)

**Erro Comum:**

```java
int resultado = switch (x) {
    case 1 -> {
        int temp = 10;
        temp;  // ERRO: esperava yield
    }
    default -> 0;
};
```

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

**Conceito:** Blocos `{}` com arrow **sempre** requerem `yield` (exceto se lançam exceção).

---

## 🎯 Aplicabilidade e Contextos

### 1. Mapeamento Direto de Valores

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

### 2. Cálculos Baseados em Estado

```java
double desconto = switch (categoria) {
    case "VIP" -> 0.20;
    case "Premium" -> 0.15;
    case "Regular" -> 0.05;
    default -> 0.0;
};

double precoFinal = precoBase * (1 - desconto);
```

### 3. Factory Pattern

```java
Animal criarAnimal(String tipo) {
    return switch (tipo) {
        case "cachorro" -> new Cachorro();
        case "gato" -> new Gato();
        case "passaro" -> new Passaro();
        default -> throw new IllegalArgumentException("Tipo desconhecido");
    };
}
```

### 4. Estado Machine com Transições

```java
Estado proximoEstado(Estado atual, Evento evento) {
    return switch (atual) {
        case INICIAL -> switch (evento) {
            case INICIAR -> Estado.PROCESSANDO;
            default -> Estado.INICIAL;
        };
        case PROCESSANDO -> switch (evento) {
            case CONCLUIR -> Estado.FINALIZADO;
            case ERRO -> Estado.ERRO;
            default -> Estado.PROCESSANDO;
        };
        case FINALIZADO -> Estado.FINALIZADO;  // Terminal
        case ERRO -> Estado.ERRO;  // Terminal
    };
}
```

---

## ⚠️ Limitações e Considerações

### 1. Não Pode Ser Vazio

```java
// ERRO: switch expression precisa retornar valor
int x = switch (y) {
    // Vazio!
};
```

### 2. Precisa de Ponto e Vírgula

```java
String s = switch (x) {
    case 1 -> "Um";
    default -> "Outro";
};  // Ponto e vírgula NECESSÁRIO
```

**Conceito:** Switch expression é **expressão** (como chamada de método) — termina com `;`.

### 3. Não Pode Misturar Arrow e Colon Syntax

```java
// ERRO: não pode misturar -> e :
String s = switch (x) {
    case 1 -> "Um";
    case 2:  // ERRO!
        yield "Dois";
    default -> "Outro";
};
```

**Conceito:** Ou usa arrow (`->`) em todos, ou colon (`:`) com `yield` em todos.

### 4. yield Só em Switch Expression

```java
// ERRO: yield só funciona em switch expression
switch (x) {
    case 1:
        yield "Um";  // ERRO: statement switch não tem yield
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Arrow Syntax

Switch expressions sempre usam arrow (`->`) ou colon (`:`) com `yield`.

### Relação com Pattern Matching (Java 17+)

Switch expressions são base para pattern matching com tipos complexos.

### Relação com Expressões vs Statements

Java tem poucas construções expression (ternário, switch expression) vs statements (if, for, while).

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Pattern Matching (Java 17+):** Switch com tipos complexos
2. **`yield` Keyword:** Retorno em blocos de switch expression
3. **Arrow Syntax:** Detalhes de `->` vs `:` em switch
4. **Sealed Classes (Java 17+):** Exaustividade com tipos

---

## 📚 Conclusão

**Switch expressions** (Java 12+, standard em Java 14) transformam switch em **expressão que retorna valor**, ao invés de statement que executa comandos. Usa **arrow syntax** (`case valor -> resultado`) ou **blocos com `yield`** (`{ ... yield resultado; }`). **Elimina boilerplate** — sem variável temporária, sem `break` repetitivo, sem atribuições múltiplas. Compilador exige **exaustividade** — todos os casos devem retornar valor (ou lançar exceção). **Sem fall-through** — cada case independente. Pode ser usado em **atribuições**, **argumentos de método**, **retornos**. Vírgula entre cases (`case 1, 2, 3 ->`) é OR, mais conciso que fall-through. **Compatível** com switch statement — ambos coexistem. `yield` é como `return` para blocos em switch expression. Não pode misturar arrow (`->`) e colon (`:`) syntax. É **fundamento** para pattern matching (Java 17+) e sealed classes. Switch expressions tornam código mais conciso, seguro (sem fall-through acidental) e expressivo, alinhando Java com linguagens funcionais modernas. Compreender switch expressions é essencial para código Java moderno e pattern matching futuro.
