# T7.03 - Default Case

## Introdução

**Default case**: bloco executado quando **nenhum case** corresponde.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

public String getDescricao(Status status) {
    switch (status) {
        case ATIVO:
            return "Ativo";
        case INATIVO:
            return "Inativo";
        case PENDENTE:
            return "Pendente";
        default:  // ← Default case
            throw new IllegalArgumentException("Status inválido: " + status);
    }
}

// ✅ Default executado quando nenhum case corresponde
// ✅ Segurança contra valores inesperados
```

**Default** = **segurança** contra casos não tratados.

---

## Fundamentos

### 1. Default como Segurança

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA, URGENTE
}

public int getTempoResposta(Prioridade prioridade) {
    switch (prioridade) {
        case BAIXA:
            return 72;
        case MEDIA:
            return 24;
        case ALTA:
            return 8;
        case URGENTE:
            return 1;
        default:
            // ✅ Segurança: caso inesperado
            throw new IllegalArgumentException(
                "Prioridade inválida: " + prioridade
            );
    }
}

// ✅ Default lança exceção para valores inesperados
// ✅ Protege contra adição de novas constantes sem atualizar código
```

### 2. Default com Mensagem de Erro

```java
public enum TipoPagamento {
    DINHEIRO, PIX, DEBITO, CREDITO
}

public double calcularTaxa(TipoPagamento tipo, double valor) {
    switch (tipo) {
        case DINHEIRO:
            return 0;
        case PIX:
            return 0;
        case DEBITO:
            return valor * 0.015;
        case CREDITO:
            return valor * 0.03;
        default:
            String mensagem = String.format(
                "Tipo de pagamento inválido: %s. Tipos válidos: %s",
                tipo,
                Arrays.toString(TipoPagamento.values())
            );
            throw new IllegalArgumentException(mensagem);
    }
}

// ✅ Mensagem detalhada com tipos válidos
```

### 3. Default com Valor Padrão

```java
public enum Moeda {
    BRL, USD, EUR, GBP
}

public String getSimbolo(Moeda moeda) {
    switch (moeda) {
        case BRL:
            return "R$";
        case USD:
            return "$";
        case EUR:
            return "€";
        case GBP:
            return "£";
        default:
            // ✅ Valor padrão em vez de exceção
            return "?";
    }
}

// ✅ Retorna valor padrão em vez de lançar exceção
// ⚠️ Usar com cuidado: pode esconder problemas
```

### 4. Default com Log

```java
public enum TipoArquivo {
    TEXTO, IMAGEM, VIDEO, AUDIO
}

public void processar(TipoArquivo tipo, String arquivo) {
    switch (tipo) {
        case TEXTO:
            processarTexto(arquivo);
            break;
        case IMAGEM:
            processarImagem(arquivo);
            break;
        case VIDEO:
            processarVideo(arquivo);
            break;
        case AUDIO:
            processarAudio(arquivo);
            break;
        default:
            // ✅ Log antes de lançar exceção
            logger.error("Tipo de arquivo não suportado: {}", tipo);
            throw new UnsupportedOperationException(
                "Tipo de arquivo não suportado: " + tipo
            );
    }
}

// ✅ Log ajuda no debugging
```

### 5. Default Vazio (Fall-Through)

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

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
            // ✅ Teoricamente impossível (todas constantes tratadas)
            throw new AssertionError("Dia inválido: " + dia);
    }
}

// ✅ Default como proteção mesmo que todos cases estejam cobertos
```

### 6. Default com UnsupportedOperationException

```java
public enum Operacao {
    SOMA, SUBTRACAO, MULTIPLICACAO, DIVISAO, RAIZ_QUADRADA
}

public double calcular(Operacao operacao, double a, double b) {
    switch (operacao) {
        case SOMA:
            return a + b;
        case SUBTRACAO:
            return a - b;
        case MULTIPLICACAO:
            return a * b;
        case DIVISAO:
            if (b == 0) throw new ArithmeticException("Divisão por zero");
            return a / b;
        default:
            // ✅ Operação não implementada
            throw new UnsupportedOperationException(
                "Operação não implementada: " + operacao
            );
    }
}

// ✅ UnsupportedOperationException para operações não implementadas
// RAIZ_QUADRADA não implementada, cai no default
```

### 7. Default com AssertionError

```java
public enum Status {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

public String getCor(Status status) {
    switch (status) {
        case NOVO:      return "#ffc107"; // Amarelo
        case APROVADO:  return "#17a2b8"; // Azul
        case ENVIADO:   return "#007bff"; // Azul escuro
        case ENTREGUE:  return "#28a745"; // Verde
        case CANCELADO: return "#dc3545"; // Vermelho
        default:
            // ✅ AssertionError: nunca deveria acontecer
            throw new AssertionError(
                "Caso não tratado: " + status
            );
    }
}

// ✅ AssertionError: todas constantes foram tratadas
// Se cair aqui, é bug no código
```

### 8. Default com Retorno Null

```java
public enum TipoDocumento {
    CPF, CNPJ, RG, CNH
}

public String getMascara(TipoDocumento tipo) {
    switch (tipo) {
        case CPF:
            return "###.###.###-##";
        case CNPJ:
            return "##.###.###/####-##";
        case RG:
            return "##.###.###-#";
        case CNH:
            return "###########";
        default:
            // ⚠️ Retorna null em vez de exceção
            return null;
    }
}

// ⚠️ Retornar null pode causar NullPointerException
// ✅ Preferir exceção ou valor padrão seguro
```

### 9. Default com Fallback

```java
public enum Idioma {
    PT_BR, EN_US, ES_ES
}

public String getMensagem(Idioma idioma, String chave) {
    switch (idioma) {
        case PT_BR:
            return mensagensPtBr.get(chave);
        case EN_US:
            return mensagensEnUs.get(chave);
        case ES_ES:
            return mensagensEsEs.get(chave);
        default:
            // ✅ Fallback para idioma padrão
            logger.warn("Idioma não suportado: {}, usando PT_BR", idioma);
            return mensagensPtBr.get(chave);
    }
}

// ✅ Fallback para idioma padrão em vez de exceção
```

### 10. Default Documentado

```java
public enum Forma {
    CIRCULO, QUADRADO, RETANGULO, TRIANGULO
}

/**
 * Calcula área da forma.
 * 
 * @param forma Forma geométrica
 * @param dimensoes Dimensões (raio para círculo, lado para quadrado, etc)
 * @return Área calculada
 * @throws IllegalArgumentException se forma for inválida
 */
public double calcularArea(Forma forma, double... dimensoes) {
    switch (forma) {
        case CIRCULO:
            double raio = dimensoes[0];
            return Math.PI * raio * raio;
        case QUADRADO:
            double lado = dimensoes[0];
            return lado * lado;
        case RETANGULO:
            double largura = dimensoes[0];
            double altura = dimensoes[1];
            return largura * altura;
        case TRIANGULO:
            double base = dimensoes[0];
            double alturaT = dimensoes[1];
            return (base * alturaT) / 2;
        default:
            // ✅ Default documentado no Javadoc
            throw new IllegalArgumentException(
                "Forma inválida: " + forma
            );
    }
}

// ✅ Javadoc documenta exceção lançada no default
```

---

## Aplicabilidade

**Default case** quando:
- **Segurança**: proteger contra valores inesperados
- **Novas constantes**: proteger contra adição sem atualizar código
- **Valor padrão**: retornar valor seguro
- **Log**: registrar casos inesperados
- **Exceção**: lançar erro para casos não tratados

**Sempre incluir default**, mesmo que todos cases estejam cobertos.

---

## Armadilhas

### 1. Default Faltando

```java
// ⚠️ Sem default
public String get(Status status) {
    switch (status) {
        case ATIVO:   return "Ativo";
        case INATIVO: return "Inativo";
        // ⚠️ PENDENTE não tratado, não retorna nada
    }
}
// ⚠️ Erro de compilação: "missing return statement"

// ✅ Adicionar default
public String get(Status status) {
    switch (status) {
        case ATIVO:   return "Ativo";
        case INATIVO: return "Inativo";
        default:
            throw new IllegalArgumentException("Status inválido");
    }
}
```

### 2. Default Retornando Null

```java
// ⚠️ Retorna null
public String get(Status status) {
    switch (status) {
        case ATIVO: return "Ativo";
        default:    return null; // ⚠️ Pode causar NPE
    }
}

// ✅ Lançar exceção
public String get(Status status) {
    switch (status) {
        case ATIVO: return "Ativo";
        default:
            throw new IllegalArgumentException("Status inválido");
    }
}
```

### 3. Default Silencioso

```java
// ⚠️ Default sem ação
public void processar(Status status) {
    switch (status) {
        case ATIVO:
            processarAtivo();
            break;
        default:
            // ⚠️ Não faz nada, silencioso
            break;
    }
}

// ✅ Lançar exceção ou logar
public void processar(Status status) {
    switch (status) {
        case ATIVO:
            processarAtivo();
            break;
        default:
            logger.warn("Status não tratado: {}", status);
            throw new UnsupportedOperationException(
                "Status não suportado: " + status
            );
    }
}
```

---

## Boas Práticas

### 1. Sempre Incluir Default

```java
// ✅ Default sempre presente
switch (status) {
    case ATIVO:   return "Ativo";
    case INATIVO: return "Inativo";
    default:
        throw new IllegalArgumentException("Status inválido");
}
```

### 2. Lançar Exceção

```java
// ✅ Lançar exceção no default
default:
    throw new IllegalArgumentException(
        "Valor inválido: " + valor
    );
```

### 3. Mensagem Descritiva

```java
// ✅ Mensagem descritiva
default:
    throw new IllegalArgumentException(
        String.format(
            "Status inválido: %s. Valores válidos: %s",
            status,
            Arrays.toString(Status.values())
        )
    );
```

### 4. AssertionError para Casos "Impossíveis"

```java
// ✅ AssertionError quando todos cases estão cobertos
switch (status) {
    case ATIVO:   return "Ativo";
    case INATIVO: return "Inativo";
    case PENDENTE: return "Pendente";
    default:
        // Nunca deveria chegar aqui
        throw new AssertionError("Caso não tratado: " + status);
}
```

---

## Resumo

**Default case**:

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

public String getDescricao(Status status) {
    switch (status) {
        case ATIVO:
            return "Ativo";
        case INATIVO:
            return "Inativo";
        case PENDENTE:
            return "Pendente";
        default:  // ← SEMPRE incluir default
            throw new IllegalArgumentException(
                "Status inválido: " + status
            );
    }
}
```

**Propósito**:
- **Segurança**: proteger contra valores inesperados
- **Novas constantes**: proteger contra adição sem atualizar
- **Debugging**: mensagem de erro clara

**Opções**:
1. **Lançar exceção** (recomendado):
   - `IllegalArgumentException`: argumento inválido
   - `UnsupportedOperationException`: operação não implementada
   - `AssertionError`: caso "impossível"

2. **Valor padrão** (usar com cuidado):
   - Retornar valor seguro
   - Pode esconder problemas

3. **Log + exceção**:
   - Registrar erro
   - Lançar exceção

**Regra de Ouro**: **SEMPRE** inclua `default` em switch com enum. **Lançar exceção** (não retornar `null`). Mensagem **descritiva** com valor inválido. `AssertionError` quando todos cases cobertos (bug se cair aqui). Default = **segurança** contra casos não tratados ou novas constantes.
