# T7.09 - Refatoração: If-Else para Switch

## Introdução

**Refatorar if-else** para **switch** = código mais limpo e legível.

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA, URGENTE
}

// ❌ Antes: if-else aninhado
public int getTempoResposta(Prioridade prioridade) {
    if (prioridade == Prioridade.BAIXA) {
        return 72;
    } else if (prioridade == Prioridade.MEDIA) {
        return 24;
    } else if (prioridade == Prioridade.ALTA) {
        return 8;
    } else if (prioridade == Prioridade.URGENTE) {
        return 1;
    } else {
        throw new IllegalArgumentException("Prioridade inválida");
    }
}

// ✅ Depois: switch expression
public int getTempoResposta(Prioridade prioridade) {
    return switch (prioridade) {
        case BAIXA   -> 72;
        case MEDIA   -> 24;
        case ALTA    -> 8;
        case URGENTE -> 1;
    };
}

// ✅ Mais limpo, conciso e legível
```

**Switch** >>> **if-else** para enums.

---

## Fundamentos

### 1. If-Else Simples → Switch

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// ❌ Antes: if-else
public String getDescricao(Status status) {
    if (status == Status.ATIVO) {
        return "Usuário ativo";
    } else if (status == Status.INATIVO) {
        return "Usuário inativo";
    } else if (status == Status.PENDENTE) {
        return "Aguardando aprovação";
    } else {
        throw new IllegalArgumentException("Status inválido");
    }
}

// ✅ Depois: switch expression
public String getDescricao(Status status) {
    return switch (status) {
        case ATIVO   -> "Usuário ativo";
        case INATIVO -> "Usuário inativo";
        case PENDENTE -> "Aguardando aprovação";
    };
}

// Vantagens:
// - Mais conciso (5 linhas vs 10)
// - Exaustividade garantida (compilador valida)
// - Mais legível
```

### 2. If-Else com Fall-Through → Switch

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

// ❌ Antes: if-else com OR
public boolean isUtil(DiaSemana dia) {
    if (dia == DiaSemana.SEGUNDA || 
        dia == DiaSemana.TERCA || 
        dia == DiaSemana.QUARTA || 
        dia == DiaSemana.QUINTA || 
        dia == DiaSemana.SEXTA) {
        return true;
    } else if (dia == DiaSemana.SABADO || dia == DiaSemana.DOMINGO) {
        return false;
    } else {
        throw new IllegalArgumentException("Dia inválido");
    }
}

// ✅ Depois: switch com vírgula
public boolean isUtil(DiaSemana dia) {
    return switch (dia) {
        case SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA -> true;
        case SABADO, DOMINGO -> false;
    };
}

// Vantagens:
// - Vírgula agrupa cases
// - Mais legível
// - Sem repetição de ||
```

### 3. If-Else Aninhado → Switch

```java
public enum TipoUsuario {
    ADMIN, MODERADOR, USUARIO
}

public enum Acao {
    LER, ESCREVER, DELETAR
}

// ❌ Antes: if-else aninhado
public boolean temPermissao(TipoUsuario tipo, Acao acao) {
    if (tipo == TipoUsuario.ADMIN) {
        return true;
    } else if (tipo == TipoUsuario.MODERADOR) {
        if (acao == Acao.LER || acao == Acao.ESCREVER) {
            return true;
        } else {
            return false;
        }
    } else if (tipo == TipoUsuario.USUARIO) {
        if (acao == Acao.LER) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// ✅ Depois: switch aninhado
public boolean temPermissao(TipoUsuario tipo, Acao acao) {
    return switch (tipo) {
        case ADMIN -> true;
        case MODERADOR -> switch (acao) {
            case LER, ESCREVER -> true;
            case DELETAR -> false;
        };
        case USUARIO -> switch (acao) {
            case LER -> true;
            case ESCREVER, DELETAR -> false;
        };
    };
}

// Ou com pattern matching (Java 17+)
record Permissao(TipoUsuario usuario, Acao acao) {}

public boolean temPermissao(Permissao permissao) {
    return switch (permissao) {
        case Permissao(TipoUsuario.ADMIN, var a) -> true;
        case Permissao(TipoUsuario.MODERADOR, Acao.LER) -> true;
        case Permissao(TipoUsuario.MODERADOR, Acao.ESCREVER) -> true;
        case Permissao(TipoUsuario.USUARIO, Acao.LER) -> true;
        case Permissao(var u, var a) -> false;
    };
}
```

### 4. If-Else com Lógica → Switch com Bloco

```java
public enum TipoPagamento {
    DINHEIRO, PIX, DEBITO, CREDITO, BOLETO
}

// ❌ Antes: if-else com lógica
public double calcularTaxa(TipoPagamento tipo, double valor) {
    if (tipo == TipoPagamento.DINHEIRO) {
        System.out.println("Pagamento em dinheiro: sem taxa");
        return 0;
    } else if (tipo == TipoPagamento.PIX) {
        System.out.println("Pagamento PIX: sem taxa");
        return 0;
    } else if (tipo == TipoPagamento.DEBITO) {
        System.out.println("Pagamento débito: taxa de 1.5%");
        double taxa = valor * 0.015;
        return taxa;
    } else if (tipo == TipoPagamento.CREDITO) {
        System.out.println("Pagamento crédito: taxa de 3%");
        double taxa = valor * 0.03;
        return taxa;
    } else if (tipo == TipoPagamento.BOLETO) {
        System.out.println("Boleto: taxa fixa de R$ 3,50");
        return 3.50;
    } else {
        throw new IllegalArgumentException("Tipo inválido");
    }
}

// ✅ Depois: switch com blocos
public double calcularTaxa(TipoPagamento tipo, double valor) {
    return switch (tipo) {
        case DINHEIRO, PIX -> {
            System.out.println("Sem taxa");
            yield 0;
        }
        case DEBITO -> {
            System.out.println("Taxa de 1.5%");
            yield valor * 0.015;
        }
        case CREDITO -> {
            System.out.println("Taxa de 3%");
            yield valor * 0.03;
        }
        case BOLETO -> {
            System.out.println("Taxa fixa de R$ 3,50");
            yield 3.50;
        }
    };
}
```

### 5. If-Else com Validação → Switch com Guard

```java
public enum StatusPedido {
    NOVO, APROVADO, ENVIADO, ENTREGUE
}

// ❌ Antes: if-else com validação
public String analisar(StatusPedido status, int diasEspera) {
    if (status == StatusPedido.NOVO) {
        if (diasEspera > 7) {
            return "Pedido novo há mais de 7 dias";
        } else {
            return "Pedido novo recente";
        }
    } else if (status == StatusPedido.APROVADO) {
        if (diasEspera > 3) {
            return "Aprovado há mais de 3 dias";
        } else {
            return "Aprovado recentemente";
        }
    } else {
        return "Status final: " + status;
    }
}

// ✅ Depois: switch com guard (Java 17+)
public String analisar(StatusPedido status, int diasEspera) {
    return switch (status) {
        case NOVO when diasEspera > 7 -> 
            "Pedido novo há mais de 7 dias";
        case NOVO -> 
            "Pedido novo recente";
        case APROVADO when diasEspera > 3 -> 
            "Aprovado há mais de 3 dias";
        case APROVADO -> 
            "Aprovado recentemente";
        case ENVIADO, ENTREGUE -> 
            "Status final: " + status;
    };
}
```

### 6. If-Else com Múltiplas Condições → Switch

```java
public enum Forma {
    CIRCULO, QUADRADO, RETANGULO, TRIANGULO
}

// ❌ Antes: if-else
public double calcularArea(Forma forma, double... dimensoes) {
    if (forma == Forma.CIRCULO) {
        double raio = dimensoes[0];
        return Math.PI * raio * raio;
    } else if (forma == Forma.QUADRADO) {
        double lado = dimensoes[0];
        return lado * lado;
    } else if (forma == Forma.RETANGULO) {
        double largura = dimensoes[0];
        double altura = dimensoes[1];
        return largura * altura;
    } else if (forma == Forma.TRIANGULO) {
        double base = dimensoes[0];
        double altura = dimensoes[1];
        return (base * altura) / 2;
    } else {
        throw new IllegalArgumentException("Forma inválida");
    }
}

// ✅ Depois: switch
public double calcularArea(Forma forma, double... dimensoes) {
    return switch (forma) {
        case CIRCULO -> {
            double raio = dimensoes[0];
            yield Math.PI * raio * raio;
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
            double altura = dimensoes[1];
            yield (base * altura) / 2;
        }
    };
}
```

### 7. Cadeia de If-Else → Switch Statement

```java
public enum TipoArquivo {
    TEXTO, IMAGEM, VIDEO, AUDIO, PDF
}

// ❌ Antes: cadeia de if-else
public void processar(TipoArquivo tipo, String arquivo) {
    if (tipo == TipoArquivo.TEXTO) {
        System.out.println("Processando texto");
        processarTexto(arquivo);
    } else if (tipo == TipoArquivo.IMAGEM) {
        System.out.println("Processando imagem");
        redimensionarImagem(arquivo);
    } else if (tipo == TipoArquivo.VIDEO) {
        System.out.println("Processando vídeo");
        comprimirVideo(arquivo);
    } else if (tipo == TipoArquivo.AUDIO) {
        System.out.println("Processando áudio");
        normalizarAudio(arquivo);
    } else if (tipo == TipoArquivo.PDF) {
        System.out.println("Processando PDF");
        extrairTextoPDF(arquivo);
    } else {
        throw new IllegalArgumentException("Tipo inválido");
    }
}

// ✅ Depois: switch statement
public void processar(TipoArquivo tipo, String arquivo) {
    switch (tipo) {
        case TEXTO -> {
            System.out.println("Processando texto");
            processarTexto(arquivo);
        }
        case IMAGEM -> {
            System.out.println("Processando imagem");
            redimensionarImagem(arquivo);
        }
        case VIDEO -> {
            System.out.println("Processando vídeo");
            comprimirVideo(arquivo);
        }
        case AUDIO -> {
            System.out.println("Processando áudio");
            normalizarAudio(arquivo);
        }
        case PDF -> {
            System.out.println("Processando PDF");
            extrairTextoPDF(arquivo);
        }
    }
}
```

### 8. If-Else com Return → Switch Expression

```java
public enum Moeda {
    BRL, USD, EUR, GBP
}

// ❌ Antes: if-else com return
public String getSimbolo(Moeda moeda) {
    if (moeda == Moeda.BRL) {
        return "R$";
    } else if (moeda == Moeda.USD) {
        return "$";
    } else if (moeda == Moeda.EUR) {
        return "€";
    } else if (moeda == Moeda.GBP) {
        return "£";
    } else {
        throw new IllegalArgumentException("Moeda inválida");
    }
}

// ✅ Depois: switch expression
public String getSimbolo(Moeda moeda) {
    return switch (moeda) {
        case BRL -> "R$";
        case USD -> "$";
        case EUR -> "€";
        case GBP -> "£";
    };
}
```

### 9. Refatoração Incremental

```java
public enum Status {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

// Passo 1: if-else original
public String get(Status status) {
    if (status == Status.NOVO) {
        return "Novo";
    } else if (status == Status.APROVADO) {
        return "Aprovado";
    } else {
        return "Outro";
    }
}

// Passo 2: converter para switch statement
public String get(Status status) {
    switch (status) {
        case NOVO:     return "Novo";
        case APROVADO: return "Aprovado";
        default:       return "Outro";
    }
}

// Passo 3: adicionar cases faltantes
public String get(Status status) {
    switch (status) {
        case NOVO:      return "Novo";
        case APROVADO:  return "Aprovado";
        case ENVIADO:   return "Enviado";
        case ENTREGUE:  return "Entregue";
        case CANCELADO: return "Cancelado";
        default:
            throw new AssertionError("Status não tratado: " + status);
    }
}

// Passo 4: converter para switch expression
public String get(Status status) {
    return switch (status) {
        case NOVO      -> "Novo";
        case APROVADO  -> "Aprovado";
        case ENVIADO   -> "Enviado";
        case ENTREGUE  -> "Entregue";
        case CANCELADO -> "Cancelado";
    };
}
```

### 10. Ferramentas de Refatoração (IDE)

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA, URGENTE
}

// ❌ Antes: if-else
public int get(Prioridade p) {
    if (p == Prioridade.BAIXA) {
        return 72;
    } else if (p == Prioridade.MEDIA) {
        return 24;
    } else if (p == Prioridade.ALTA) {
        return 8;
    } else if (p == Prioridade.URGENTE) {
        return 1;
    } else {
        throw new IllegalArgumentException();
    }
}

// ✅ IntelliJ: Alt+Enter → "Replace if with switch"
// ✅ Eclipse: Ctrl+1 → "Convert to switch"
// ✅ VS Code: Ctrl+. → "Convert to switch"

// Resultado automático:
public int get(Prioridade p) {
    return switch (p) {
        case BAIXA   -> 72;
        case MEDIA   -> 24;
        case ALTA    -> 8;
        case URGENTE -> 1;
    };
}
```

---

## Aplicabilidade

**Refatorar if-else para switch** quando:
- Comparar **enum** com `==`
- Múltiplas condições `if-else`
- Cadeia longa de `else if`
- Melhorar **legibilidade**
- Exaustividade garantida (Java 14+)

**Vantagens da refatoração**:
- Código mais limpo
- Exaustividade (compilador valida)
- Mais legível
- Fácil adicionar casos
- Performance (switch otimizado)

---

## Armadilhas

### 1. Refatorar Sem Testes

```java
// ⚠️ Refatorar sem testes
// ✅ Criar testes ANTES de refatorar

@Test
public void testTodosOsCasos() {
    for (Status status : Status.values()) {
        assertDoesNotThrow(() -> getDescricao(status));
    }
}

// Depois refatorar com segurança
```

### 2. Perder Default

```java
// ❌ Refatorar e esquecer default
return switch (status) {
    case ATIVO   -> "Ativo";
    case INATIVO -> "Inativo";
    // ⚠️ PENDENTE faltando
};

// ✅ Cobrir todos ou default
return switch (status) {
    case ATIVO   -> "Ativo";
    case INATIVO -> "Inativo";
    case PENDENTE -> "Pendente";
};
```

### 3. Mudar Lógica Sem Querer

```java
// ⚠️ If-else tinha lógica diferente
if (status == Status.ATIVO) {
    validar();  // ← Lógica adicional
    return "Ativo";
}

// ❌ Switch sem validar
return switch (status) {
    case ATIVO -> "Ativo";  // ⚠️ Perdeu validação
};

// ✅ Manter lógica
return switch (status) {
    case ATIVO -> {
        validar();  // ✅ Lógica mantida
        yield "Ativo";
    }
};
```

---

## Boas Práticas

### 1. Criar Testes Antes

```java
// ✅ Testes antes de refatorar
@Test
public void testRefatoracao() {
    assertEquals("Ativo", getDescricao(Status.ATIVO));
    assertEquals("Inativo", getDescricao(Status.INATIVO));
}
```

### 2. Refatoração Incremental

```java
// ✅ Passo a passo:
// 1. if-else → switch statement
// 2. Adicionar cases faltantes
// 3. switch statement → switch expression
```

### 3. Usar Ferramentas IDE

```java
// ✅ IntelliJ: Alt+Enter → "Replace if with switch"
// ✅ Automático e seguro
```

### 4. Validar Exaustividade

```java
// ✅ Switch expression força exaustividade
return switch (status) {
    case ATIVO, INATIVO, PENDENTE -> processar(status);
    // ✅ Compilador valida
};
```

---

## Resumo

**Refatoração if-else → switch**:

```java
// ❌ Antes: if-else
public String get(Status status) {
    if (status == Status.ATIVO) {
        return "Ativo";
    } else if (status == Status.INATIVO) {
        return "Inativo";
    } else if (status == Status.PENDENTE) {
        return "Pendente";
    } else {
        throw new IllegalArgumentException();
    }
}

// ✅ Depois: switch expression
public String get(Status status) {
    return switch (status) {
        case ATIVO   -> "Ativo";
        case INATIVO -> "Inativo";
        case PENDENTE -> "Pendente";
    };
}
```

**Passos**:
1. **Criar testes** antes de refatorar
2. Converter `if-else` → `switch statement`
3. Adicionar **cases faltantes**
4. Converter `switch statement` → `switch expression` (Java 14+)
5. **Validar** com testes

**Vantagens**:
- **Mais limpo**: menos código
- **Exaustividade**: compilador valida (Java 14+)
- **Legibilidade**: estrutura clara
- **Performance**: switch otimizado
- **Manutenção**: fácil adicionar casos

**Ferramentas**:
- IntelliJ: Alt+Enter → "Replace if with switch"
- Eclipse: Ctrl+1 → "Convert to switch"
- VS Code: Ctrl+. → "Convert to switch"

**Regra de Ouro**: **Refatore** if-else com enum para **switch**. **Testes** antes de refatorar. **Incremental**: if-else → switch statement → switch expression. **IDE** automatiza refatoração. **Exaustividade** garantida (Java 14+). Código **mais limpo**, **legível** e **seguro**.
