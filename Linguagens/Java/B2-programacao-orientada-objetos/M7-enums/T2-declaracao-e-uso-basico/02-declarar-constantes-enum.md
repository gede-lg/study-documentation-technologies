# T2.02 - Declarar Constantes Enum

## Introdução

**Constantes enum**: valores fixos declarados dentro do enum.

```java
public enum Status {
    ATIVO,      // Constante 1
    INATIVO,    // Constante 2
    PENDENTE    // Constante 3
}
```

**Cada constante** é uma instância única do enum.

---

## Fundamentos

### 1. Declaração Básica

```java
public enum Cor {
    VERMELHO,  // Constante
    VERDE,     // Constante
    AZUL       // Constante
}
```

### 2. Constantes São Instâncias

```java
public enum DiaSemana {
    SEGUNDA  // = new DiaSemana("SEGUNDA", 0)
}

// Compilador gera:
// public static final DiaSemana SEGUNDA = new DiaSemana("SEGUNDA", 0);
```

### 3. Vírgula Entre Constantes

```java
public enum Resultado {
    SUCESSO,   // Vírgula obrigatória
    ERRO,      // Vírgula obrigatória
    PENDENTE   // Vírgula final opcional
}
```

### 4. Uma Constante por Linha

```java
// ✅ Uma por linha (mais legível)
public enum TipoPagamento {
    DINHEIRO,
    CARTAO_CREDITO,
    CARTAO_DEBITO,
    PIX
}
```

### 5. Múltiplas Constantes por Linha

```java
// ✅ Válido (menos legível)
public enum Booleano {
    VERDADEIRO, FALSO
}
```

### 6. Constantes com Argumentos

```java
public enum Planeta {
    TERRA(5.972e24),
    MARTE(6.39e23),
    JUPITER(1.898e27);
    
    private final double massa;
    
    Planeta(double massa) {
        this.massa = massa;
    }
}
```

### 7. Convenção de Nomenclatura

```java
// ✅ MAIUSCULAS
public enum Prioridade {
    BAIXA,
    MEDIA,
    ALTA
}

// ✅ SNAKE_CASE para múltiplas palavras
public enum EstadoPedido {
    EM_PROCESSAMENTO,
    AGUARDANDO_PAGAMENTO,
    ENVIADO,
    ENTREGUE
}
```

### 8. Número de Constantes

```java
// ✅ 1 constante (mínimo)
public enum Singleton {
    INSTANCE
}

// ✅ 2 constantes
public enum Sexo {
    MASCULINO, FEMININO
}

// ✅ Muitas constantes
public enum Pais {
    BRASIL,
    ARGENTINA,
    CHILE,
    // ... 200+ países
}
```

### 9. Constantes com Corpo

```java
public enum Operacao {
    SOMA {
        @Override
        public int calcular(int a, int b) {
            return a + b;
        }
    },
    SUBTRACAO {
        @Override
        public int calcular(int a, int b) {
            return a - b;
        }
    };
    
    public abstract int calcular(int a, int b);
}
```

### 10. Ordem Importa

```java
public enum Tamanho {
    PEQUENO,   // ordinal = 0
    MEDIO,     // ordinal = 1
    GRANDE     // ordinal = 2
}

System.out.println(Tamanho.PEQUENO.ordinal()); // 0
System.out.println(Tamanho.MEDIO.ordinal());   // 1
```

---

## Aplicabilidade

**Declarar constantes** quando:
- Conjunto fixo de valores
- Valores não mudam em runtime
- Tipos seguros necessários

**Exemplos**:
- Dias da semana
- Status de pedido
- Tipos de arquivo
- Níveis de log

---

## Armadilhas

### 1. Nome Duplicado

```java
// ❌ ERRO: duplicate enum constant
public enum Erro {
    A,
    B,
    A  // ERRO
}
```

### 2. Constante em Minúsculas

```java
// ❌ Convenção: MAIUSCULAS
public enum Status {
    ativo,
    inativo
}

// ✅ MAIUSCULAS
public enum Status {
    ATIVO,
    INATIVO
}
```

### 3. Esquecer Vírgula

```java
// ❌ ERRO: ';' expected
public enum Erro {
    A
    B  // Falta vírgula
}

// ✅ Vírgula
public enum Correto {
    A,
    B
}
```

---

## Boas Práticas

### 1. Nome Descritivo

```java
// ✅ Nomes claros
public enum StatusPagamento {
    PENDENTE,
    APROVADO,
    RECUSADO,
    ESTORNADO
}
```

### 2. Ordem Lógica

```java
// ✅ Ordem faz sentido
public enum Prioridade {
    BAIXA,    // Menos urgente
    MEDIA,
    ALTA,
    CRITICA   // Mais urgente
}
```

### 3. Agrupar por Contexto

```java
// ✅ Agrupamento lógico
public enum TipoArquivo {
    // Imagens
    JPG, PNG, GIF,
    
    // Documentos
    PDF, DOCX, TXT,
    
    // Vídeos
    MP4, AVI, MKV
}
```

### 4. Vírgula Final

```java
// ✅ Facilita adicionar constantes
public enum Cor {
    VERMELHO,
    VERDE,
    AZUL,  // Vírgula final
}
```

---

## Resumo

**Declaração de constantes**:

```java
public enum NomeEnum {
    CONSTANTE1,
    CONSTANTE2,
    CONSTANTE3
}
```

**Exemplos**:

```java
// Status
public enum Status {
    ATIVO,
    INATIVO,
    PENDENTE
}

// Dias
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

// Com argumentos
public enum Moeda {
    REAL("R$"),
    DOLAR("$"),
    EURO("€");
    
    private final String simbolo;
    
    Moeda(String simbolo) {
        this.simbolo = simbolo;
    }
}
```

**Características**:
- Constantes separadas por **vírgula**
- Vírgula final **opcional** (recomendado)
- Cada constante = **instância única**
- Ordem define **ordinal**
- **MAIUSCULAS** (convenção)
- **SNAKE_CASE** para múltiplas palavras

**Convenção**:
- `ATIVO` (uma palavra)
- `EM_PROCESSAMENTO` (múltiplas palavras)
- `CARTAO_CREDITO` (snake_case)

**Regra de Ouro**: Declare constantes em **MAIUSCULAS** separadas por **vírgula**. Vírgula final recomendada. Ordem importa (ordinal). Cada constante é **instância única** (singleton). Use **SNAKE_CASE** para múltiplas palavras (`EM_PROCESSAMENTO`).
