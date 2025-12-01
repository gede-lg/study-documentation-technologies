# T12.01 - Usar Enum em Vez de Constantes int

## Introdução

**Enum vs constantes int**: enum é type-safe, constantes int não.

```java
// ❌ Constantes int (não type-safe)
public class Status {
    public static final int ATIVO = 1;
    public static final int INATIVO = 2;
}

// ⚠️ Problema: aceita qualquer int
public void processar(int status) {
    // status pode ser 999 (inválido)
}

// ✅ Enum (type-safe)
public enum Status {
    ATIVO,
    INATIVO
}

// ✅ Só aceita valores válidos
public void processar(Status status) {
    // status só pode ser ATIVO ou INATIVO
}
```

**Type-safety**: compilador garante valores válidos.

---

## Fundamentos

### 1. Problema com Constantes int

```java
// ❌ Constantes int
public class DiaSemana {
    public static final int SEGUNDA = 1;
    public static final int TERCA = 2;
    public static final int QUARTA = 3;
}

// ⚠️ Aceita qualquer int
public void agendar(int dia) {
    if (dia == DiaSemana.SEGUNDA) {
        System.out.println("Segunda-feira");
    }
}

// ⚠️ Compila mas está errado
agendar(999); // ⚠️ Valor inválido
agendar(DiaSemana.SEGUNDA + DiaSemana.TERCA); // ⚠️ 3 (QUARTA?)

// ✅ Enum resolve
public enum DiaSemana {
    SEGUNDA,
    TERCA,
    QUARTA
}

public void agendar(DiaSemana dia) {
    if (dia == DiaSemana.SEGUNDA) {
        System.out.println("Segunda-feira");
    }
}

// ✅ Não compila com valor inválido
// agendar(999); // ❌ Erro de compilação
// agendar(DiaSemana.SEGUNDA + DiaSemana.TERCA); // ❌ Não compila
```

### 2. Namespace Pollution

```java
// ❌ Constantes poluem namespace
public class Cores {
    public static final int VERMELHO = 1;
    public static final int VERDE = 2;
}

public class Semaforo {
    public static final int VERMELHO = 1; // ⚠️ Conflito de nome
    public static final int AMARELO = 2;
    public static final int VERDE = 3;
}

// ⚠️ Ambiguidade
int cor = VERMELHO; // ⚠️ Qual VERMELHO?

// ✅ Enum tem namespace próprio
public enum Cores {
    VERMELHO,
    VERDE,
    AZUL
}

public enum Semaforo {
    VERMELHO,
    AMARELO,
    VERDE
}

// ✅ Sem ambiguidade
Cores cor = Cores.VERMELHO;
Semaforo luz = Semaforo.VERMELHO;
```

### 3. Constantes Sem Validação

```java
// ❌ Sem validação
public class Prioridade {
    public static final int BAIXA = 1;
    public static final int MEDIA = 2;
    public static final int ALTA = 3;
}

public void processar(int prioridade) {
    if (prioridade < 1 || prioridade > 3) {
        throw new IllegalArgumentException("Prioridade inválida");
    }
    // Processar
}

// ⚠️ Validação manual em todo lugar

// ✅ Enum valida automaticamente
public enum Prioridade {
    BAIXA,
    MEDIA,
    ALTA
}

public void processar(Prioridade prioridade) {
    // Não precisa validar: compilador garante
}
```

### 4. Switch Quebrado

```java
// ❌ Switch com constantes int
public class TipoPagamento {
    public static final int DINHEIRO = 1;
    public static final int CARTAO = 2;
}

public String processar(int tipo) {
    switch (tipo) {
        case TipoPagamento.DINHEIRO:
            return "Dinheiro";
        case TipoPagamento.CARTAO:
            return "Cartão";
        default:
            return "Desconhecido"; // ⚠️ Sempre precisa default
    }
}

// ⚠️ Adicionar nova constante não gera erro
public static final int PIX = 3; // ⚠️ Switch não avisa

// ✅ Enum avisa quando falta case
public enum TipoPagamento {
    DINHEIRO,
    CARTAO,
    PIX
}

public String processar(TipoPagamento tipo) {
    switch (tipo) {
        case DINHEIRO:
            return "Dinheiro";
        case CARTAO:
            return "Cartão";
        // ⚠️ Compilador avisa: falta PIX
    }
}
```

### 5. ToString Não Informativo

```java
// ❌ Constantes int
public class Status {
    public static final int ATIVO = 1;
    public static final int INATIVO = 2;
}

int status = Status.ATIVO;
System.out.println(status); // 1 (não informativo)

// ✅ Enum
public enum Status {
    ATIVO,
    INATIVO
}

Status status = Status.ATIVO;
System.out.println(status); // ATIVO (informativo)
```

### 6. Impossível Iterar Constantes

```java
// ❌ Impossível iterar constantes int
public class Nivel {
    public static final int FACIL = 1;
    public static final int MEDIO = 2;
    public static final int DIFICIL = 3;
}

// ⚠️ Não tem como listar todos os níveis

// ✅ Enum permite iterar
public enum Nivel {
    FACIL,
    MEDIO,
    DIFICIL
}

// ✅ Listar todos
for (Nivel nivel : Nivel.values()) {
    System.out.println(nivel);
}
```

### 7. Sem Comportamento Associado

```java
// ❌ Constantes int com comportamento externo
public class Operacao {
    public static final int SOMA = 1;
    public static final int SUBTRACAO = 2;
}

public double calcular(int operacao, double a, double b) {
    switch (operacao) {
        case Operacao.SOMA:
            return a + b;
        case Operacao.SUBTRACAO:
            return a - b;
        default:
            throw new IllegalArgumentException();
    }
}

// ✅ Enum com comportamento interno
public enum Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    SUBTRACAO {
        @Override
        public double calcular(double a, double b) {
            return a - b;
        }
    };
    
    public abstract double calcular(double a, double b);
}

// ✅ Uso direto
double resultado = Operacao.SOMA.calcular(5, 3);
```

### 8. Serialização Frágil

```java
// ❌ Constantes int (frágil)
public class TipoArquivo implements Serializable {
    public static final int PDF = 1;
    public static final int DOCX = 2;
    
    private int tipo;
    
    public TipoArquivo(int tipo) {
        this.tipo = tipo;
    }
}

// ⚠️ Mudar valores quebra serialização
public static final int PDF = 10; // ⚠️ Quebra objetos serializados

// ✅ Enum (serialização segura)
public enum TipoArquivo {
    PDF,
    DOCX
}

// ✅ Serialização por nome (não ordinal)
```

### 9. Comparação Perigosa

```java
// ❌ Comparação de constantes int
public class Tamanho {
    public static final int PEQUENO = 1;
    public static final int GRANDE = 2;
}

int tamanho1 = Tamanho.PEQUENO;
int tamanho2 = 1;

if (tamanho1 == tamanho2) {
    // ⚠️ true, mas tamanho2 pode não ser Tamanho.PEQUENO
}

// ✅ Enum usa ==
public enum Tamanho {
    PEQUENO,
    GRANDE
}

Tamanho t1 = Tamanho.PEQUENO;
Tamanho t2 = Tamanho.PEQUENO;

if (t1 == t2) {
    // ✅ Seguro: singleton garantido
}
```

### 10. Migração de int para Enum

```java
// ❌ Código legado com int
public class StatusLegado {
    public static final int PENDENTE = 1;
    public static final int APROVADO = 2;
    public static final int REJEITADO = 3;
}

// ✅ Enum com compatibilidade
public enum Status {
    PENDENTE(1),
    APROVADO(2),
    REJEITADO(3);
    
    private final int codigo;
    private static final Map<Integer, Status> BY_CODIGO = new HashMap<>();
    
    static {
        for (Status s : values()) {
            BY_CODIGO.put(s.codigo, s);
        }
    }
    
    Status(int codigo) {
        this.codigo = codigo;
    }
    
    public int getCodigo() {
        return codigo;
    }
    
    // ✅ Converter código legado
    public static Status fromCodigo(int codigo) {
        Status status = BY_CODIGO.get(codigo);
        if (status == null) {
            throw new IllegalArgumentException("Código inválido: " + codigo);
        }
        return status;
    }
}

// ✅ Migração gradual
Status status = Status.fromCodigo(StatusLegado.PENDENTE);
```

---

## Aplicabilidade

**Enum em vez de int** para:
- Type-safety (compilador valida)
- Namespace próprio
- ToString informativo
- Iteração (values())
- Comportamento (métodos)

---

## Armadilhas

### 1. Usar int em API Pública

```java
// ❌ API com int (não type-safe)
public void processar(int status) { }

// ✅ API com enum
public void processar(Status status) { }
```

### 2. Expor Código int

```java
// ⚠️ Expor código int
public int getCodigo() {
    return codigo; // ⚠️ Perde type-safety
}

// ✅ Usar enum diretamente
public Status getStatus() {
    return status;
}
```

### 3. Comparar int com ==

```java
// ❌ int permite qualquer valor
if (status == 999) { } // ⚠️ Compila

// ✅ Enum só aceita valores válidos
if (status == Status.ATIVO) { }
```

---

## Boas Práticas

### 1. Sempre Enum em API

```java
// ✅ Parâmetro enum
public void processar(Status status) { }
```

### 2. Lookup Map para Legado

```java
private static final Map<Integer, Status> BY_CODIGO = new HashMap<>();

public static Status fromCodigo(int codigo) {
    return BY_CODIGO.get(codigo);
}
```

### 3. Documentar Migração

```java
/**
 * @deprecated Usar {@link Status#ATIVO} em vez de ATIVO_INT
 */
@Deprecated
public static final int ATIVO_INT = 1;
```

### 4. Validação Automática

```java
// ✅ Enum valida automaticamente
public void processar(Status status) {
    // Não precisa validar
}
```

---

## Resumo

**Enum vs int**:

```java
// ❌ int (não type-safe)
public static final int ATIVO = 1;

public void processar(int status) {
    // ⚠️ status pode ser qualquer int
}

// ✅ Enum (type-safe)
public enum Status {
    ATIVO,
    INATIVO
}

public void processar(Status status) {
    // ✅ Só aceita valores válidos
}
```

**Vantagens enum**:
- Type-safe (compilador valida)
- Namespace próprio
- ToString informativo
- Iterável (values())
- Comportamento (métodos)
- Serialização segura

**Regra de Ouro**: **Sempre enum** em vez de constantes int. **Type-safe**. **Lookup map** para compatibilidade com código legado. **Deprecar** constantes int gradualmente.
