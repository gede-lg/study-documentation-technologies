# T7.04 - Switch Expression com Enum (Java 14+)

## Introdução

**Switch expression** (Java 14+): switch que **retorna valor**.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// ❌ Switch statement (tradicional)
public String getDescricao(Status status) {
    switch (status) {
        case ATIVO:   return "Ativo";
        case INATIVO: return "Inativo";
        case PENDENTE: return "Pendente";
        default:
            throw new IllegalArgumentException("Inválido");
    }
}

// ✅ Switch expression (Java 14+)
public String getDescricao(Status status) {
    return switch (status) {
        case ATIVO   -> "Ativo";
        case INATIVO -> "Inativo";
        case PENDENTE -> "Pendente";
    };
}

// ✅ Mais conciso
// ✅ Sem break
// ✅ Exaustivo (sem default se cobrir todos)
```

**Switch expression** = expressão que retorna valor.

---

## Fundamentos

### 1. Sintaxe Básica

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

public boolean isUtil(DiaSemana dia) {
    return switch (dia) {
        case SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA -> true;
        case SABADO, DOMINGO -> false;
    };
}

// ✅ switch (dia) retorna boolean
// ✅ -> em vez de :
// ✅ Sem break
// ✅ Vírgula para múltiplos cases
```

### 2. Arrow Syntax (->)

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA, URGENTE
}

public int getTempoResposta(Prioridade prioridade) {
    return switch (prioridade) {
        case BAIXA   -> 72;  // ← Arrow syntax
        case MEDIA   -> 24;
        case ALTA    -> 8;
        case URGENTE -> 1;
    };
}

// ✅ case X -> valor
// ✅ Sem break necessário
// ✅ Retorna valor diretamente
```

### 3. Múltiplos Cases (Vírgula)

```java
public enum TipoPagamento {
    DINHEIRO, PIX, DEBITO, CREDITO, BOLETO
}

public double calcularTaxa(TipoPagamento tipo, double valor) {
    return switch (tipo) {
        case DINHEIRO, PIX -> 0;  // ← Múltiplos cases com vírgula
        case DEBITO        -> valor * 0.015;
        case CREDITO       -> valor * 0.03;
        case BOLETO        -> 3.50;
    };
}

// ✅ Vírgula para múltiplos cases
// ✅ Sem fall-through acidental
```

### 4. Bloco de Código (yield)

```java
public enum Forma {
    CIRCULO, QUADRADO, RETANGULO, TRIANGULO
}

public double calcularArea(Forma forma, double... dimensoes) {
    return switch (forma) {
        case CIRCULO -> {
            double raio = dimensoes[0];
            yield Math.PI * raio * raio;  // ← yield retorna valor
        }
        case QUADRADO -> {
            double lado = dimensoes[0];
            yield lado * lado;
        }
        case RETANGULO -> {
            double largura = dimensoes[0];
            double altura = dimensoes[1];
            yield largura * altura;
        }
        case TRIANGULO -> {
            double base = dimensoes[0];
            double alturaT = dimensoes[1];
            yield (base * alturaT) / 2;
        }
    };
}

// ✅ Bloco { } para lógica complexa
// ✅ yield retorna valor do bloco
```

### 5. Exaustividade (Completeness)

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// ✅ Exaustivo: cobre todos os casos
public String getDescricao(Status status) {
    return switch (status) {
        case ATIVO   -> "Ativo";
        case INATIVO -> "Inativo";
        case PENDENTE -> "Pendente";
        // ✅ Sem default necessário (todos cobertos)
    };
}

// ❌ Não exaustivo: erro de compilação
public String getDescricao(Status status) {
    return switch (status) {
        case ATIVO   -> "Ativo";
        case INATIVO -> "Inativo";
        // ❌ PENDENTE faltando: erro de compilação
    };
}

// ✅ Default se não cobrir todos
public String getDescricao(Status status) {
    return switch (status) {
        case ATIVO -> "Ativo";
        default    -> "Outro";
    };
}

// ✅ Compilador força exaustividade
```

### 6. Atribuição Direta

```java
public enum Moeda {
    BRL, USD, EUR, GBP
}

public void exemplo(Moeda moeda) {
    // ✅ Atribuir resultado do switch
    String simbolo = switch (moeda) {
        case BRL -> "R$";
        case USD -> "$";
        case EUR -> "€";
        case GBP -> "£";
    };
    
    System.out.println("Símbolo: " + simbolo);
}

// ✅ Switch expression retorna valor
// ✅ Atribuir diretamente a variável
```

### 7. Switch em Expressões

```java
public enum TipoArquivo {
    TEXTO, IMAGEM, VIDEO, AUDIO
}

public void processar(TipoArquivo tipo, String arquivo) {
    // ✅ Switch dentro de método
    String extensao = switch (tipo) {
        case TEXTO  -> ".txt";
        case IMAGEM -> ".jpg";
        case VIDEO  -> ".mp4";
        case AUDIO  -> ".mp3";
    };
    
    // ✅ Switch em return
    System.out.println(
        "Extensão: " + switch (tipo) {
            case TEXTO  -> "texto";
            case IMAGEM -> "imagem";
            case VIDEO  -> "vídeo";
            case AUDIO  -> "áudio";
        }
    );
}

// ✅ Switch expression pode ser usado em qualquer lugar
```

### 8. Colon Syntax (:) com yield

```java
public enum Operacao {
    SOMA, SUBTRACAO, MULTIPLICACAO, DIVISAO
}

public double calcular(Operacao operacao, double a, double b) {
    return switch (operacao) {
        case SOMA:  // ← Colon syntax (tradicional)
            yield a + b;
        case SUBTRACAO:
            yield a - b;
        case MULTIPLICACAO:
            yield a * b;
        case DIVISAO:
            if (b == 0) {
                throw new ArithmeticException("Divisão por zero");
            }
            yield a / b;
    };
}

// ✅ : com yield funciona
// ✅ Mas -> é preferido (mais limpo)
```

### 9. Exceções em Switch Expression

```java
public enum TipoConversao {
    PARA_NUMERO, PARA_DATA, PARA_BOOLEAN
}

public Object converter(TipoConversao tipo, String valor) {
    return switch (tipo) {
        case PARA_NUMERO -> {
            try {
                yield Integer.parseInt(valor);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Não é número: " + valor);
            }
        }
        case PARA_DATA -> {
            try {
                yield LocalDate.parse(valor);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Não é data: " + valor);
            }
        }
        case PARA_BOOLEAN -> Boolean.parseBoolean(valor);
    };
}

// ✅ Try-catch dentro do bloco
// ✅ yield retorna valor ou lança exceção
```

### 10. Switch com Null (Java 17+)

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// Java 17+: case null
public String getDescricao(Status status) {
    return switch (status) {
        case null      -> "Status não informado";  // ← Java 17+
        case ATIVO     -> "Ativo";
        case INATIVO   -> "Inativo";
        case PENDENTE  -> "Pendente";
    };
}

// ✅ Java 17+ permite case null
// ✅ Evita NullPointerException

// Antes do Java 17
public String getDescricao(Status status) {
    if (status == null) {
        return "Status não informado";
    }
    return switch (status) {
        case ATIVO   -> "Ativo";
        case INATIVO -> "Inativo";
        case PENDENTE -> "Pendente";
    };
}

// ✅ Validar null antes do switch (Java < 17)
```

---

## Aplicabilidade

**Switch expression** quando:
- Java 14+ disponível
- Retornar valor
- Evitar `break`
- Código mais conciso
- Exaustividade garantida

**Vantagens**:
- Sem `break`
- Exaustividade (compilador força)
- Mais conciso
- Menos propenso a erros

---

## Armadilhas

### 1. Misturar Arrow e Colon

```java
// ❌ Não pode misturar -> e :
return switch (status) {
    case ATIVO -> "Ativo";      // Arrow
    case INATIVO:               // ❌ Colon não permitido
        yield "Inativo";
};

// ✅ Usar consistente (preferir arrow)
return switch (status) {
    case ATIVO   -> "Ativo";
    case INATIVO -> "Inativo";
};
```

### 2. Esquecer yield em Bloco

```java
// ❌ Bloco sem yield
return switch (forma) {
    case CIRCULO -> {
        double raio = dimensoes[0];
        Math.PI * raio * raio;  // ❌ Falta yield
    }
};

// ✅ yield obrigatório em bloco
return switch (forma) {
    case CIRCULO -> {
        double raio = dimensoes[0];
        yield Math.PI * raio * raio;  // ✅
    }
};
```

### 3. Não Exaustivo

```java
// ❌ Falta case
return switch (status) {
    case ATIVO   -> "Ativo";
    case INATIVO -> "Inativo";
    // ❌ PENDENTE faltando: erro de compilação
};

// ✅ Cobrir todos ou default
return switch (status) {
    case ATIVO   -> "Ativo";
    case INATIVO -> "Inativo";
    case PENDENTE -> "Pendente";  // ✅
};
```

---

## Boas Práticas

### 1. Preferir Arrow (->)

```java
// ✅ Arrow syntax (limpo)
return switch (status) {
    case ATIVO   -> "Ativo";
    case INATIVO -> "Inativo";
    default      -> "Outro";
};
```

### 2. yield para Blocos

```java
// ✅ yield em bloco
return switch (tipo) {
    case TEXTO -> {
        String extensao = ".txt";
        yield extensao;
    }
    default -> ".bin";
};
```

### 3. Exaustividade

```java
// ✅ Cobrir todos os cases
return switch (status) {
    case ATIVO, INATIVO, PENDENTE -> processar(status);
};
```

### 4. Vírgula para Cases Similares

```java
// ✅ Vírgula para agrupar
return switch (dia) {
    case SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA -> true;
    case SABADO, DOMINGO -> false;
};
```

---

## Resumo

**Switch expression** (Java 14+):

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// ✅ Switch expression
public String getDescricao(Status status) {
    return switch (status) {
        case ATIVO   -> "Ativo";     // ← Arrow syntax
        case INATIVO -> "Inativo";
        case PENDENTE -> "Pendente";
        // ✅ Exaustivo: sem default necessário
    };
}

// ✅ Com bloco e yield
public double calcular(Forma forma, double... dimensoes) {
    return switch (forma) {
        case CIRCULO -> {
            double raio = dimensoes[0];
            yield Math.PI * raio * raio;  // ← yield retorna
        }
        case QUADRADO -> {
            double lado = dimensoes[0];
            yield lado * lado;
        }
    };
}
```

**Características**:
- **Retorna valor**: expressão em vez de statement
- **Arrow syntax** (`->`): sem `break`
- **Vírgula**: múltiplos cases (`case A, B ->`)
- **yield**: retornar valor de bloco
- **Exaustividade**: compilador força cobrir todos
- **case null** (Java 17+): tratar null

**Vantagens**:
- Mais **conciso**
- Sem `break` (menos erros)
- **Exaustividade** garantida
- **Tipo seguro**

**Regra de Ouro**: **Switch expression** (Java 14+) retorna valor. Use **arrow** (`->`) para casos simples, **yield** para blocos. **Exaustividade** obrigatória (cobrir todos ou `default`). **Vírgula** para múltiplos cases. Sem `break` necessário. Mais **limpo** e **seguro** que switch statement.
