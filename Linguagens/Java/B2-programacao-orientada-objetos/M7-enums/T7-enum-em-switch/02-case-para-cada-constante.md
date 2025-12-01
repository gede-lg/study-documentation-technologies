# T7.02 - Case para Cada Constante

## Introdução

**Switch com enum**: cada **case** = uma **constante**.

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

public int getHorasTrabalho(DiaSemana dia) {
    switch (dia) {
        case SEGUNDA:  return 8;
        case TERCA:    return 8;
        case QUARTA:   return 8;
        case QUINTA:   return 8;
        case SEXTA:    return 6;
        case SABADO:   return 0;
        case DOMINGO:  return 0;
        default:
            throw new IllegalArgumentException("Dia inválido");
    }
}

// ✅ Cada constante tem seu case
// ✅ Lógica específica por constante
```

**Case** = comportamento específico da constante.

---

## Fundamentos

### 1. Case Individual

```java
public enum Status {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

public String getDescricao(Status status) {
    switch (status) {
        case NOVO:
            return "Pedido recebido e aguardando aprovação";
        case APROVADO:
            return "Pedido aprovado e aguardando envio";
        case ENVIADO:
            return "Pedido enviado para entrega";
        case ENTREGUE:
            return "Pedido entregue ao cliente";
        case CANCELADO:
            return "Pedido cancelado";
        default:
            throw new IllegalArgumentException("Status inválido");
    }
}

// ✅ Cada case = uma constante
// ✅ Descrição específica por status
```

### 2. Lógica Diferente por Case

```java
public enum TipoPagamento {
    DINHEIRO, PIX, DEBITO, CREDITO, BOLETO
}

public double calcularTaxa(TipoPagamento tipo, double valor) {
    switch (tipo) {
        case DINHEIRO:
            return 0; // Sem taxa
        case PIX:
            return 0; // Sem taxa
        case DEBITO:
            return valor * 0.015; // 1.5%
        case CREDITO:
            return valor * 0.03; // 3%
        case BOLETO:
            return 3.50; // Taxa fixa
        default:
            throw new IllegalArgumentException("Tipo inválido");
    }
}

// ✅ Cálculo diferente por tipo
```

### 3. Validação por Case

```java
public enum TipoDocumento {
    CPF, CNPJ, RG, CNH
}

public boolean validar(TipoDocumento tipo, String documento) {
    switch (tipo) {
        case CPF:
            return documento != null && 
                   documento.replaceAll("\\D", "").length() == 11;
        case CNPJ:
            return documento != null && 
                   documento.replaceAll("\\D", "").length() == 14;
        case RG:
            String rgLimpo = documento.replaceAll("\\D", "");
            return rgLimpo.length() >= 7 && rgLimpo.length() <= 9;
        case CNH:
            return documento != null && 
                   documento.replaceAll("\\D", "").length() == 11;
        default:
            throw new IllegalArgumentException("Tipo inválido");
    }
}

// ✅ Validação específica por documento
```

### 4. Formatação por Case

```java
public enum FormatoData {
    BR, US, ISO, EUROPEU
}

public String formatar(FormatoData formato, LocalDate data) {
    switch (formato) {
        case BR:
            return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        case US:
            return data.format(DateTimeFormatter.ofPattern("MM/dd/yyyy"));
        case ISO:
            return data.format(DateTimeFormatter.ISO_LOCAL_DATE);
        case EUROPEU:
            return data.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        default:
            throw new IllegalArgumentException("Formato inválido");
    }
}

// ✅ Formatação específica por formato
```

### 5. Conversão por Case

```java
public enum Moeda {
    BRL, USD, EUR, GBP
}

public double converterParaBRL(Moeda moeda, double valor) {
    switch (moeda) {
        case BRL:
            return valor; // Já em BRL
        case USD:
            return valor * 5.0; // Cotação fictícia
        case EUR:
            return valor * 5.5;
        case GBP:
            return valor * 6.5;
        default:
            throw new IllegalArgumentException("Moeda inválida");
    }
}

// ✅ Conversão específica por moeda
```

### 6. Processamento por Case

```java
public enum TipoArquivo {
    TEXTO, IMAGEM, VIDEO, AUDIO, PDF
}

public void processar(TipoArquivo tipo, String arquivo) {
    switch (tipo) {
        case TEXTO:
            System.out.println("Processando texto: " + arquivo);
            processarTexto(arquivo);
            break;
        case IMAGEM:
            System.out.println("Processando imagem: " + arquivo);
            redimensionarImagem(arquivo);
            break;
        case VIDEO:
            System.out.println("Processando vídeo: " + arquivo);
            comprimirVideo(arquivo);
            break;
        case AUDIO:
            System.out.println("Processando áudio: " + arquivo);
            normalizarAudio(arquivo);
            break;
        case PDF:
            System.out.println("Processando PDF: " + arquivo);
            extrairTextoPDF(arquivo);
            break;
        default:
            throw new IllegalArgumentException("Tipo inválido");
    }
}

// ✅ Processamento específico por tipo
```

### 7. Cálculo por Case

```java
public enum Forma {
    CIRCULO, QUADRADO, RETANGULO, TRIANGULO
}

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
            throw new IllegalArgumentException("Forma inválida");
    }
}

// ✅ Cálculo específico por forma
```

### 8. Estado por Case

```java
public enum StatusPedido {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

public boolean podeEditar(StatusPedido status) {
    switch (status) {
        case NOVO:
            return true; // Pode editar
        case APROVADO:
            return true; // Ainda pode editar
        case ENVIADO:
            return false; // Já enviado, não pode editar
        case ENTREGUE:
            return false; // Já entregue
        case CANCELADO:
            return false; // Cancelado, não pode editar
        default:
            throw new IllegalArgumentException("Status inválido");
    }
}

public boolean podeCancelar(StatusPedido status) {
    switch (status) {
        case NOVO:
        case APROVADO:
            return true; // Pode cancelar
        case ENVIADO:
            return false; // Já enviado
        case ENTREGUE:
        case CANCELADO:
            return false; // Já finalizado
        default:
            throw new IllegalArgumentException("Status inválido");
    }
}

// ✅ Regras de negócio por status
```

### 9. Prioridade por Case

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA, URGENTE
}

public int getTempoResposta(Prioridade prioridade) {
    switch (prioridade) {
        case BAIXA:
            return 72; // 72 horas
        case MEDIA:
            return 24; // 24 horas
        case ALTA:
            return 8; // 8 horas
        case URGENTE:
            return 1; // 1 hora
        default:
            throw new IllegalArgumentException("Prioridade inválida");
    }
}

public String getCor(Prioridade prioridade) {
    switch (prioridade) {
        case BAIXA:    return "#28a745"; // Verde
        case MEDIA:    return "#ffc107"; // Amarelo
        case ALTA:     return "#fd7e14"; // Laranja
        case URGENTE:  return "#dc3545"; // Vermelho
        default:
            throw new IllegalArgumentException("Prioridade inválida");
    }
}

// ✅ Atributos diferentes por prioridade
```

### 10. Estratégia por Case

```java
public enum EstrategiaDesconto {
    NENHUM, CLIENTE_VIP, BLACK_FRIDAY, PRIMEIRA_COMPRA
}

public double aplicarDesconto(EstrategiaDesconto estrategia, double valor) {
    switch (estrategia) {
        case NENHUM:
            return valor; // Sem desconto
        case CLIENTE_VIP:
            return valor * 0.8; // 20% desconto
        case BLACK_FRIDAY:
            if (valor > 100) {
                return valor * 0.5; // 50% acima de 100
            } else {
                return valor * 0.7; // 30% abaixo de 100
            }
        case PRIMEIRA_COMPRA:
            return valor * 0.9; // 10% desconto
        default:
            throw new IllegalArgumentException("Estratégia inválida");
    }
}

// ✅ Lógica de desconto por estratégia
```

---

## Aplicabilidade

**Case por constante** quando:
- Lógica **diferente** por constante
- Cálculo, validação, formatação específica
- Regras de negócio por estado
- Processamento específico

**Vantagens**:
- Lógica centralizada
- Fácil manutenção
- Adicionar constante = adicionar case
- Compilador ajuda (default obrigatório)

---

## Armadilhas

### 1. Constante sem Case

```java
// ⚠️ Adicionar constante, esquecer case
public enum Status {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO, DEVOLVIDO // ← Nova
}

public String get(Status status) {
    switch (status) {
        case NOVO:    return "Novo";
        case APROVADO: return "Aprovado";
        case ENVIADO:  return "Enviado";
        case ENTREGUE: return "Entregue";
        case CANCELADO: return "Cancelado";
        // ⚠️ DEVOLVIDO não tratado, cai no default
        default:
            throw new IllegalArgumentException("Status inválido");
    }
}

// ✅ Adicionar case para nova constante
```

### 2. Duplicação de Lógica

```java
// ⚠️ Lógica duplicada em vários switch
public class ProcessadorStatus {
    public String getDescricao(Status status) {
        switch (status) {
            case NOVO: return "Novo";
            // ...
        }
    }
    
    public String getCor(Status status) {
        switch (status) {
            case NOVO: return "#28a745";
            // ... mesma estrutura
        }
    }
}

// ✅ Considerar métodos abstratos no enum
```

### 3. Case Vazio

```java
// ⚠️ Case sem implementação
switch (status) {
    case NOVO:
        // ⚠️ Vazio, cai no próximo case
    case APROVADO:
        processar();
        break;
}

// ✅ Fall-through intencional ou implementar case
```

---

## Boas Práticas

### 1. Case para Cada Constante

```java
// ✅ Tratar todas as constantes
switch (status) {
    case NOVO:      // ...
    case APROVADO:  // ...
    case ENVIADO:   // ...
    case ENTREGUE:  // ...
    case CANCELADO: // ...
    default:
        throw new IllegalArgumentException();
}
```

### 2. Default como Segurança

```java
// ✅ Default para casos inesperados
switch (status) {
    case NOVO:      return "Novo";
    case APROVADO:  return "Aprovado";
    default:
        throw new IllegalArgumentException("Status inválido: " + status);
}
```

### 3. Return Direto

```java
// ✅ Return elimina break
public String get(Status status) {
    switch (status) {
        case NOVO:      return "Novo";
        case APROVADO:  return "Aprovado";
        default:        throw new IllegalArgumentException();
    }
}
```

### 4. Agrupar Cases Similares

```java
// ✅ Fall-through para lógica compartilhada
switch (dia) {
    case SEGUNDA:
    case TERCA:
    case QUARTA:
    case QUINTA:
    case SEXTA:
        return 8; // Dias úteis: 8 horas
    case SABADO:
    case DOMINGO:
        return 0; // Fim de semana: 0 horas
    default:
        throw new IllegalArgumentException();
}
```

---

## Resumo

**Case para cada constante**:

```java
public enum Status {
    NOVO, APROVADO, ENVIADO, ENTREGUE, CANCELADO
}

public String getDescricao(Status status) {
    switch (status) {
        case NOVO:      // ← Case para NOVO
            return "Pedido novo";
        case APROVADO:  // ← Case para APROVADO
            return "Pedido aprovado";
        case ENVIADO:   // ← Case para ENVIADO
            return "Pedido enviado";
        case ENTREGUE:  // ← Case para ENTREGUE
            return "Pedido entregue";
        case CANCELADO: // ← Case para CANCELADO
            return "Pedido cancelado";
        default:        // ← Default obrigatório
            throw new IllegalArgumentException("Status inválido");
    }
}
```

**Características**:
- **Cada case** = uma constante
- Lógica **específica** por constante
- **Default** obrigatório (segurança)
- **Fall-through** para lógica compartilhada
- **Return** elimina `break`

**Aplicações**:
- Cálculo por constante
- Validação específica
- Formatação diferente
- Conversão por tipo
- Processamento específico
- Regras de negócio por estado

**Regra de Ouro**: **Case** = comportamento específico da constante. Trate **todas** as constantes ou use `default` como segurança. **Fall-through** intencional para lógica compartilhada. Adicionar constante = adicionar `case`. Prefira **return** a `break`. Compilador **não valida** completude (usa `default`), mas IDE pode avisar.
