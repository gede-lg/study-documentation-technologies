# T7.06 - Validação de Completude

## Introdução

**Validação de completude**: garantir que **todos os casos** estão cobertos.

```java
public enum Status {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

// ❌ Não exaustivo (switch statement)
public String getDescricao(Status status) {
    switch (status) {
        case NOVO:     return "Novo";
        case APROVADO: return "Aprovado";
        // ⚠️ ENVIADO, ENTREGUE, CANCELADO não tratados
        // ⚠️ Compilador NÃO avisa (tem default implícito)
    }
    return null;  // ⚠️ Ruim
}

// ✅ Exaustivo com default
public String getDescricao(Status status) {
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

// ✅ Exaustivo (switch expression - Java 14+)
public String getDescricao(Status status) {
    return switch (status) {
        case NOVO      -> "Novo";
        case APROVADO  -> "Aprovado";
        case ENVIADO   -> "Enviado";
        case ENTREGUE  -> "Entregue";
        case CANCELADO -> "Cancelado";
        // ✅ Compilador FORÇA completude (erro se faltar)
    };
}
```

**Completude** = cobrir **todos os casos** possíveis.

---

## Fundamentos

### 1. Switch Statement (Não Exaustivo)

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

// ❌ Não exaustivo: compilador NÃO força
public boolean isUtil(DiaSemana dia) {
    switch (dia) {
        case SEGUNDA:
        case TERCA:
        case QUARTA:
        case QUINTA:
        case SEXTA:
            return true;
        // ⚠️ SABADO, DOMINGO não tratados
        // ⚠️ Compilador aceita (mas IDE pode avisar)
    }
    return false;  // ⚠️ Fallback
}

// ✅ Default explícito
public boolean isUtil(DiaSemana dia) {
    switch (dia) {
        case SEGUNDA:
        case TERCA:
        case QUARTA:
        case QUINTA:
        case SEXTA:
            return true;
        case SABADO:
        case DOMINGO:
            return false;
        default:
            throw new AssertionError("Dia não tratado: " + dia);
    }
}
```

### 2. Switch Expression (Exaustivo)

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA, URGENTE
}

// ✅ Switch expression: compilador FORÇA completude
public int getTempoResposta(Prioridade prioridade) {
    return switch (prioridade) {
        case BAIXA   -> 72;
        case MEDIA   -> 24;
        case ALTA    -> 8;
        case URGENTE -> 1;
        // ✅ Compilador força cobrir todos
        // ❌ Erro de compilação se faltar algum
    };
}

// ❌ Erro de compilação: não exaustivo
public int getTempoResposta(Prioridade prioridade) {
    return switch (prioridade) {
        case BAIXA -> 72;
        case MEDIA -> 24;
        // ❌ ALTA e URGENTE faltando: erro de compilação
    };
}
```

### 3. Default em Switch Expression

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE, BLOQUEADO, SUSPENSO
}

// ✅ Default cobre casos restantes
public String getDescricao(Status status) {
    return switch (status) {
        case ATIVO   -> "Ativo";
        case INATIVO -> "Inativo";
        default      -> "Outro status";  // ← Cobre PENDENTE, BLOQUEADO, SUSPENSO
    };
}

// ✅ Exaustivo com default
// ✅ Compilador aceita (todos cobertos)
```

### 4. Adição de Nova Constante

```java
public enum TipoPagamento {
    DINHEIRO, PIX, DEBITO, CREDITO
}

// Switch statement: adicionar BOLETO não quebra
public double calcularTaxa(TipoPagamento tipo, double valor) {
    switch (tipo) {
        case DINHEIRO: return 0;
        case PIX:      return 0;
        case DEBITO:   return valor * 0.015;
        case CREDITO:  return valor * 0.03;
        default:
            throw new IllegalArgumentException("Tipo inválido");
    }
}

// Adicionar BOLETO:
public enum TipoPagamento {
    DINHEIRO, PIX, DEBITO, CREDITO, BOLETO  // ← Nova constante
}

// ⚠️ Switch statement: BOLETO cai no default
// ⚠️ Exceção lançada em runtime

// ✅ Switch expression sem default: erro de compilação
public double calcularTaxa(TipoPagamento tipo, double valor) {
    return switch (tipo) {
        case DINHEIRO -> 0;
        case PIX      -> 0;
        case DEBITO   -> valor * 0.015;
        case CREDITO  -> valor * 0.03;
        // ❌ Adicionar BOLETO: erro de compilação (força adicionar case)
    };
}
```

### 5. IDE Warnings

```java
public enum Moeda {
    BRL, USD, EUR, GBP
}

// ⚠️ IDE pode avisar: "Missing case for EUR, GBP"
public String getSimbolo(Moeda moeda) {
    switch (moeda) {
        case BRL: return "R$";
        case USD: return "$";
        // ⚠️ IDE avisa: EUR e GBP não tratados
        default:  return "?";
    }
}

// ✅ Cobrir todos os casos
public String getSimbolo(Moeda moeda) {
    switch (moeda) {
        case BRL: return "R$";
        case USD: return "$";
        case EUR: return "€";  // ✅
        case GBP: return "£";  // ✅
        default:
            throw new AssertionError("Moeda não tratada: " + moeda);
    }
}
```

### 6. Annotation @SuppressWarnings

```java
public enum TipoArquivo {
    TEXTO, IMAGEM, VIDEO, AUDIO, PDF, PLANILHA
}

// ⚠️ Suprimir warning (não recomendado)
@SuppressWarnings("incomplete-switch")
public String getExtensao(TipoArquivo tipo) {
    switch (tipo) {
        case TEXTO:     return ".txt";
        case IMAGEM:    return ".jpg";
        case VIDEO:     return ".mp4";
        // ⚠️ Outros não tratados, warning suprimido
    }
    return ".bin";
}

// ✅ Melhor: tratar todos os casos
public String getExtensao(TipoArquivo tipo) {
    return switch (tipo) {
        case TEXTO     -> ".txt";
        case IMAGEM    -> ".jpg";
        case VIDEO     -> ".mp4";
        case AUDIO     -> ".mp3";
        case PDF       -> ".pdf";
        case PLANILHA  -> ".xlsx";
    };
}
```

### 7. Testes de Completude

```java
public enum Status {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

public class ProcessadorStatus {
    public String processar(Status status) {
        return switch (status) {
            case NOVO      -> "Processar novo";
            case APROVADO  -> "Processar aprovado";
            case ENVIADO   -> "Processar enviado";
            case ENTREGUE  -> "Processar entregue";
            case CANCELADO -> "Processar cancelado";
        };
    }
}

// ✅ Teste: verificar que todos os status são tratados
@Test
public void testCompletude() {
    ProcessadorStatus processador = new ProcessadorStatus();
    
    // ✅ Testar todas as constantes
    for (Status status : Status.values()) {
        String resultado = processador.processar(status);
        assertNotNull(resultado, "Status não tratado: " + status);
    }
}
```

### 8. Refatoração Segura

```java
public enum Forma {
    CIRCULO, QUADRADO, RETANGULO
}

// Antes: switch statement
public double calcularArea(Forma forma, double... dimensoes) {
    switch (forma) {
        case CIRCULO:
            return Math.PI * dimensoes[0] * dimensoes[0];
        case QUADRADO:
            return dimensoes[0] * dimensoes[0];
        case RETANGULO:
            return dimensoes[0] * dimensoes[1];
        default:
            throw new IllegalArgumentException("Forma inválida");
    }
}

// Adicionar TRIANGULO:
public enum Forma {
    CIRCULO, QUADRADO, RETANGULO, TRIANGULO  // ← Nova
}

// ⚠️ Switch statement: TRIANGULO cai no default
// ⚠️ Exceção em runtime

// ✅ Refatorar para switch expression
public double calcularArea(Forma forma, double... dimensoes) {
    return switch (forma) {
        case CIRCULO   -> Math.PI * dimensoes[0] * dimensoes[0];
        case QUADRADO  -> dimensoes[0] * dimensoes[0];
        case RETANGULO -> dimensoes[0] * dimensoes[1];
        case TRIANGULO -> (dimensoes[0] * dimensoes[1]) / 2;  // ← Forçado a adicionar
    };
}

// ✅ Compilador força adicionar case para TRIANGULO
```

### 9. Completude com Null (Java 17+)

```java
public enum TipoDocumento {
    CPF, CNPJ, RG, CNH
}

// Java 17+: case null
public String getMascara(TipoDocumento tipo) {
    return switch (tipo) {
        case null -> "Tipo não informado";  // ✅ Tratar null
        case CPF  -> "###.###.###-##";
        case CNPJ -> "##.###.###/####-##";
        case RG   -> "##.###.###-#";
        case CNH  -> "###########";
    };
}

// ✅ Exaustivo: cobre null + todas as constantes
```

### 10. Ferramentas de Análise

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA, URGENTE
}

// ✅ SonarQube, SpotBugs, IntelliJ: detectam incompletude
public String getDescricao(Prioridade prioridade) {
    switch (prioridade) {
        case BAIXA:  return "Baixa";
        case MEDIA:  return "Média";
        // ⚠️ Ferramentas avisam: ALTA e URGENTE não tratados
        default:     return "Outra";
    }
}

// ✅ Habilitar checks no CI/CD
// build.gradle
tasks.withType(JavaCompile) {
    options.compilerArgs += ["-Xlint:all"]
}

// ✅ Warnings como erros
options.compilerArgs += ["-Werror"]
```

---

## Aplicabilidade

**Validação de completude** quando:
- Garantir **todos os casos** tratados
- Evitar **bugs** ao adicionar constante
- **Switch expression** (Java 14+)
- Refatoração segura

**Ferramentas**:
- Switch expression (compilador força)
- IDE warnings
- Testes (loop sobre `values()`)
- Análise estática (SonarQube, SpotBugs)

---

## Armadilhas

### 1. Default Silencioso

```java
// ⚠️ Default esconde casos não tratados
switch (status) {
    case NOVO:    processar();
    case APROVADO: aprovar();
    default:       /* Silencioso */ break;
}

// ✅ Default lança exceção
switch (status) {
    case NOVO:     processar(); break;
    case APROVADO: aprovar(); break;
    default:
        throw new IllegalArgumentException("Status não tratado: " + status);
}
```

### 2. Return Null

```java
// ⚠️ Retornar null
public String get(Status status) {
    switch (status) {
        case ATIVO: return "Ativo";
    }
    return null;  // ⚠️ NPE
}

// ✅ Lançar exceção
public String get(Status status) {
    switch (status) {
        case ATIVO: return "Ativo";
        default:
            throw new IllegalArgumentException();
    }
}
```

### 3. Adicionar Constante sem Atualizar

```java
// ⚠️ Adicionar DEVOLVIDO, esquecer de atualizar switch
public enum Status {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO, DEVOLVIDO
}

// ⚠️ DEVOLVIDO cai no default
switch (status) {
    case NOVO:      // ...
    case APROVADO:  // ...
    case ENVIADO:   // ...
    case ENTREGUE:  // ...
    case CANCELADO: // ...
    default:        throw new IllegalArgumentException();  // ⚠️ DEVOLVIDO aqui
}

// ✅ Switch expression força adicionar
return switch (status) {
    case NOVO      -> "...";
    case APROVADO  -> "...";
    case ENVIADO   -> "...";
    case ENTREGUE  -> "...";
    case CANCELADO -> "...";
    // ❌ Erro de compilação se DEVOLVIDO não tratado
};
```

---

## Boas Práticas

### 1. Switch Expression

```java
// ✅ Switch expression (exaustividade garantida)
return switch (status) {
    case ATIVO   -> "Ativo";
    case INATIVO -> "Inativo";
    case PENDENTE -> "Pendente";
};
```

### 2. Default com Exceção

```java
// ✅ Default lança exceção
switch (status) {
    case ATIVO:   processar(); break;
    case INATIVO: parar(); break;
    default:
        throw new AssertionError("Status não tratado: " + status);
}
```

### 3. Testes de Completude

```java
// ✅ Testar todas as constantes
@Test
public void testTodosOsStatus() {
    for (Status status : Status.values()) {
        assertDoesNotThrow(() -> processar(status));
    }
}
```

### 4. Habilitar Warnings

```java
// ✅ Compilador: warnings como erros
// build.gradle
options.compilerArgs += ["-Xlint:all", "-Werror"]
```

---

## Resumo

**Validação de completude**:

```java
public enum Status {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

// ❌ Switch statement: não exaustivo
public String get(Status status) {
    switch (status) {
        case NOVO:     return "Novo";
        case APROVADO: return "Aprovado";
        // ⚠️ Outros não tratados, compilador NÃO força
        default:       return "Outro";
    }
}

// ✅ Switch expression: exaustivo
public String get(Status status) {
    return switch (status) {
        case NOVO      -> "Novo";
        case APROVADO  -> "Aprovado";
        case ENVIADO   -> "Enviado";
        case ENTREGUE  -> "Entregue";
        case CANCELADO -> "Cancelado";
        // ✅ Compilador FORÇA tratar todos
    };
}
```

**Estratégias**:
1. **Switch expression** (Java 14+): compilador força completude
2. **Default com exceção**: lançar erro para casos não tratados
3. **IDE warnings**: avisar casos faltando
4. **Testes**: loop sobre `values()` verificar todos tratados
5. **Análise estática**: SonarQube, SpotBugs

**Vantagens de completude**:
- Detectar **bugs** em compilação
- **Refatoração segura** (adicionar constante)
- Garantir **todos os casos** tratados
- Evitar exceções em **runtime**

**Regra de Ouro**: **Switch expression** (Java 14+) **força completude**: compilador **valida** que todos os casos estão cobertos. **Switch statement** **não força**: adicionar **default** lançando exceção. **Testes** verificam completude (loop `values()`). **IDE** e **análise estática** ajudam detectar. Adicionar constante em switch expression = **erro de compilação** (força atualizar).
