# T12.05 - Documentar Significado de Cada Constante

## Introdução

**Documentação**: explica significado e uso de cada constante.

```java
// ❌ Sem documentação
public enum Status {
    NOVO,
    PROCESSANDO,
    CONCLUIDO,
    ERRO
}

// ✅ Com documentação
public enum Status {
    /** Pedido criado, aguardando processamento. */
    NOVO,
    
    /** Pedido em processamento. Não pode ser cancelado. */
    PROCESSANDO,
    
    /** Pedido processado com sucesso. */
    CONCLUIDO,
    
    /** Erro durante processamento. Requer intervenção manual. */
    ERRO
}
```

**Javadoc**: explica quando usar cada constante.

---

## Fundamentos

### 1. Documentação Básica

```java
/**
 * Status de um pedido no sistema.
 * 
 * <p>O ciclo de vida normal é: NOVO → APROVADO → ENVIADO → ENTREGUE.
 * Pedidos podem ser CANCELADOS em qualquer etapa antes de ENVIADO.
 */
public enum StatusPedido {
    
    /** Pedido criado, aguardando aprovação do pagamento. */
    NOVO,
    
    /** Pagamento aprovado, aguardando envio. */
    APROVADO,
    
    /** Pedido enviado para entrega. Não pode mais ser cancelado. */
    ENVIADO,
    
    /** Pedido entregue ao cliente. */
    ENTREGUE,
    
    /** Pedido cancelado pelo cliente ou sistema. */
    CANCELADO
}
```

### 2. Documentar Comportamento

```java
/**
 * Nível de acesso no sistema.
 */
public enum NivelAcesso {
    
    /**
     * Acesso de convidado.
     * Pode apenas visualizar conteúdo público.
     */
    GUEST,
    
    /**
     * Usuário comum.
     * Pode criar e editar próprio conteúdo.
     */
    USER,
    
    /**
     * Administrador.
     * Acesso total ao sistema, incluindo gerenciar usuários.
     */
    ADMIN
}
```

### 3. Documentar Validações

```java
/**
 * Tipo de documento de identificação.
 */
public enum TipoDocumento {
    
    /**
     * CPF (Cadastro de Pessoa Física).
     * Deve conter exatamente 11 dígitos numéricos.
     * 
     * @see #validarCpf(String)
     */
    CPF,
    
    /**
     * CNPJ (Cadastro Nacional de Pessoa Jurídica).
     * Deve conter exatamente 14 dígitos numéricos.
     * 
     * @see #validarCnpj(String)
     */
    CNPJ,
    
    /**
     * RG (Registro Geral).
     * Formato varia por estado. Geralmente 9 dígitos.
     */
    RG
}
```

### 4. Documentar Efeitos Colaterais

```java
/**
 * Comando para gerenciar dispositivo.
 */
public enum ComandoDispositivo {
    
    /**
     * Liga o dispositivo.
     * 
     * <p><b>Efeito:</b> Altera estado para LIGADO e inicia consumo de energia.
     * 
     * @throws IllegalStateException se dispositivo já estiver ligado
     */
    LIGAR,
    
    /**
     * Desliga o dispositivo.
     * 
     * <p><b>Efeito:</b> Altera estado para DESLIGADO e para consumo de energia.
     * Todos os dados não salvos são perdidos.
     * 
     * @throws IllegalStateException se dispositivo já estiver desligado
     */
    DESLIGAR,
    
    /**
     * Reinicia o dispositivo.
     * 
     * <p><b>Efeito:</b> Equivalente a DESLIGAR seguido de LIGAR.
     * Processo pode levar até 30 segundos.
     */
    REINICIAR
}
```

### 5. Documentar Valores

```java
/**
 * Prioridade de uma tarefa.
 */
public enum Prioridade {
    
    /**
     * Prioridade baixa.
     * Pontos: 1. SLA: 30 dias.
     */
    BAIXA(1, 30),
    
    /**
     * Prioridade média.
     * Pontos: 3. SLA: 7 dias.
     */
    MEDIA(3, 7),
    
    /**
     * Prioridade alta.
     * Pontos: 5. SLA: 24 horas.
     */
    ALTA(5, 1),
    
    /**
     * Prioridade urgente.
     * Pontos: 10. SLA: 4 horas.
     * Requer aprovação de gestor.
     */
    URGENTE(10, 0);
    
    private final int pontos;
    private final int slaDias;
    
    /**
     * Constrói uma prioridade.
     * 
     * @param pontos pontos da prioridade (maior = mais urgente)
     * @param slaDias prazo em dias (0 = horas)
     */
    Prioridade(int pontos, int slaDias) {
        this.pontos = pontos;
        this.slaDias = slaDias;
    }
    
    /**
     * Retorna os pontos da prioridade.
     * 
     * @return pontos (1-10)
     */
    public int getPontos() {
        return pontos;
    }
}
```

### 6. Documentar Exemplo de Uso

```java
/**
 * Formato de data para exibição.
 * 
 * <p>Exemplo de uso:
 * <pre>
 * FormatoData formato = FormatoData.BR;
 * String dataFormatada = formato.formatar(LocalDate.now());
 * // Resultado: "27/11/2025"
 * </pre>
 */
public enum FormatoData {
    
    /** Formato brasileiro: dd/MM/yyyy. Exemplo: 27/11/2025 */
    BR("dd/MM/yyyy"),
    
    /** Formato americano: MM/dd/yyyy. Exemplo: 11/27/2025 */
    US("MM/dd/yyyy"),
    
    /** Formato ISO: yyyy-MM-dd. Exemplo: 2025-11-27 */
    ISO("yyyy-MM-dd");
    
    private final String pattern;
    
    FormatoData(String pattern) {
        this.pattern = pattern;
    }
    
    /**
     * Formata uma data usando este formato.
     * 
     * @param data data a ser formatada
     * @return string formatada
     */
    public String formatar(java.time.LocalDate data) {
        return data.format(java.time.format.DateTimeFormatter.ofPattern(pattern));
    }
}
```

### 7. Documentar Restrições

```java
/**
 * Tipo de arquivo permitido para upload.
 * 
 * <p><b>Restrições:</b>
 * <ul>
 *   <li>Tamanho máximo: 10MB para IMAGEM, 50MB para VIDEO</li>
 *   <li>DOCUMENTO: apenas PDF, DOC, DOCX</li>
 *   <li>Arquivos executáveis não são permitidos</li>
 * </ul>
 */
public enum TipoArquivo {
    
    /**
     * Arquivo de imagem.
     * Extensões permitidas: jpg, png, gif, bmp.
     * Tamanho máximo: 10MB.
     */
    IMAGEM("jpg", "png", "gif", "bmp"),
    
    /**
     * Arquivo de vídeo.
     * Extensões permitidas: mp4, avi, mkv.
     * Tamanho máximo: 50MB.
     */
    VIDEO("mp4", "avi", "mkv"),
    
    /**
     * Documento de texto.
     * Extensões permitidas: pdf, doc, docx, txt.
     * Tamanho máximo: 5MB.
     */
    DOCUMENTO("pdf", "doc", "docx", "txt");
    
    private final String[] extensoes;
    
    TipoArquivo(String... extensoes) {
        this.extensoes = extensoes;
    }
    
    /**
     * Verifica se a extensão é válida para este tipo.
     * 
     * @param extensao extensão do arquivo (sem ponto)
     * @return true se extensão é válida
     */
    public boolean isExtensaoValida(String extensao) {
        return java.util.Arrays.asList(extensoes).contains(extensao.toLowerCase());
    }
}
```

### 8. Documentar Deprecated

```java
/**
 * Status de uma conta.
 */
public enum StatusConta {
    
    /** Conta ativa e funcionando normalmente. */
    ATIVA,
    
    /** Conta suspensa temporariamente. Pode ser reativada. */
    SUSPENSA,
    
    /**
     * Conta inativa.
     * 
     * @deprecated Usar {@link #SUSPENSA} ou {@link #BLOQUEADA} em vez disso.
     * Será removido na versão 2.0.
     */
    @Deprecated
    INATIVA,
    
    /** Conta bloqueada permanentemente. Não pode ser reativada. */
    BLOQUEADA
}
```

### 9. Documentar Thread-Safety

```java
/**
 * Cache singleton thread-safe.
 * 
 * <p><b>Thread-safety:</b> Todas as operações são thread-safe.
 * Usa {@link java.util.concurrent.ConcurrentHashMap} internamente.
 * 
 * <p>Exemplo:
 * <pre>
 * Cache.INSTANCIA.put("key", "value");
 * String value = Cache.INSTANCIA.get("key");
 * </pre>
 */
public enum Cache {
    
    /** Instância única do cache. */
    INSTANCIA;
    
    private final java.util.concurrent.ConcurrentHashMap<String, String> cache = 
        new java.util.concurrent.ConcurrentHashMap<>();
    
    /**
     * Adiciona um valor ao cache.
     * 
     * @param key chave (não pode ser null)
     * @param value valor (não pode ser null)
     * @throws NullPointerException se key ou value for null
     */
    public void put(String key, String value) {
        if (key == null || value == null) {
            throw new NullPointerException("Key e value não podem ser null");
        }
        cache.put(key, value);
    }
    
    /**
     * Recupera um valor do cache.
     * 
     * @param key chave
     * @return valor associado ou null se não encontrado
     */
    public String get(String key) {
        return cache.get(key);
    }
}
```

### 10. Documentar Padrões

```java
/**
 * Estratégia de desconto.
 * 
 * <p><b>Padrão de projeto:</b> Strategy Pattern.
 * Cada constante implementa o método {@link #aplicar(double)} com sua própria lógica.
 * 
 * <p>Exemplo:
 * <pre>
 * double preco = 100.0;
 * double precoComDesconto = Desconto.VIP.aplicar(preco);
 * // Resultado: 80.0 (20% de desconto)
 * </pre>
 */
public enum Desconto {
    
    /**
     * Sem desconto.
     * Retorna o valor original.
     */
    NENHUM {
        @Override
        public double aplicar(double valor) {
            return valor;
        }
    },
    
    /**
     * Desconto VIP de 20%.
     * Aplica 20% de desconto sobre o valor original.
     */
    VIP {
        @Override
        public double aplicar(double valor) {
            return valor * 0.8;
        }
    },
    
    /**
     * Desconto Black Friday de 50%.
     * Aplica 50% de desconto sobre o valor original.
     * Disponível apenas durante Black Friday.
     */
    BLACK_FRIDAY {
        @Override
        public double aplicar(double valor) {
            return valor * 0.5;
        }
    };
    
    /**
     * Aplica o desconto ao valor.
     * 
     * @param valor valor original
     * @return valor com desconto aplicado
     */
    public abstract double aplicar(double valor);
}
```

---

## Aplicabilidade

**Documentar enum** para:
- Explicar significado de cada constante
- Descrever comportamento
- Listar restrições
- Exemplos de uso
- Avisar sobre deprecated

---

## Armadilhas

### 1. Sem Documentação

```java
// ❌ Sem documentação
public enum Status {
    A, B, C // ⚠️ O que significam?
}

// ✅ Com documentação
/** Status A: ativo */
A,
/** Status B: bloqueado */
B
```

### 2. Documentação Genérica

```java
// ❌ Genérica
/** Status do pedido. */
NOVO, // ⚠️ Não explica nada

// ✅ Específica
/** Pedido criado, aguardando pagamento. */
NOVO
```

### 3. Não Documentar Métodos

```java
// ❌ Método sem doc
public String getDescricao() {
    return descricao; // ⚠️ O que retorna?
}

// ✅ Método documentado
/**
 * Retorna a descrição legível da constante.
 * 
 * @return descrição em português
 */
public String getDescricao() {
    return descricao;
}
```

---

## Boas Práticas

### 1. Javadoc para Cada Constante

```java
/** Descrição da constante. */
CONSTANTE
```

### 2. Documentar Enum

```java
/**
 * Descrição geral do enum.
 * 
 * <p>Detalhes adicionais.
 */
public enum MeuEnum { }
```

### 3. Exemplos de Uso

```java
/**
 * <pre>
 * Status s = Status.ATIVO;
 * s.getDescricao(); // "Ativo"
 * </pre>
 */
```

### 4. Avisar Deprecated

```java
/**
 * @deprecated Usar {@link #NOVO} em vez disso.
 */
@Deprecated
ANTIGO
```

---

## Resumo

**Documentação**:

```java
/**
 * Status de um pedido.
 * 
 * <p>Ciclo de vida: NOVO → APROVADO → ENVIADO → ENTREGUE
 */
public enum StatusPedido {
    
    /** Pedido criado, aguardando aprovação. */
    NOVO,
    
    /** Pagamento aprovado, aguardando envio. */
    APROVADO,
    
    /** Pedido enviado. Não pode ser cancelado. */
    ENVIADO,
    
    /** Pedido entregue ao cliente. */
    ENTREGUE
}
```

**Regra de Ouro**: **Javadoc** para cada constante. **Explicar** significado e uso. **Exemplos** de código. **Avisar** deprecated. **Documentar** restrições e efeitos.
