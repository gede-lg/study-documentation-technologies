# T1.06 - Construtores Privados Implícitos

## Introdução

**Enum**: construtor é **private** implicitamente.

```java
public enum Status {
    ATIVO, INATIVO;
    
    // Construtor é private (implícito)
    Status() { }
}

// ❌ ERRO: não pode instanciar
// Status s = new Status();
```

**private**: apenas o enum pode criar instâncias.

---

## Fundamentos

### 1. Construtor Padrão é Private

```java
public enum Cor {
    VERMELHO, VERDE, AZUL;
    
    // Implícito:
    // private Cor() { }
}
```

### 2. Construtor Explícito Também é Private

```java
public enum Planeta {
    TERRA(5.972e24);
    
    private double massa;
    
    // private implícito (pode omitir)
    Planeta(double massa) {
        this.massa = massa;
    }
}
```

### 3. Não Pode Usar public/protected

```java
public enum Status {
    ATIVO, INATIVO;
    
    // ❌ ERRO: modifier public not allowed
    // public Status() { }
    
    // ❌ ERRO: modifier protected not allowed
    // protected Status() { }
    
    // ✅ private (ou omitir)
    private Status() { }
}
```

### 4. Construtor Chamado na Declaração

```java
public enum Dia {
    SEGUNDA("Segunda-feira"),
    TERCA("Terça-feira");
    
    private String nome;
    
    Dia(String nome) { // private implícito
        this.nome = nome;
        System.out.println("Criando: " + nome);
    }
}

// Saída (ao carregar classe):
// Criando: Segunda-feira
// Criando: Terça-feira
```

### 5. Chamado Uma Vez por Constante

```java
public enum Numero {
    UM, DOIS, TRES;
    
    Numero() {
        System.out.println("Construtor");
    }
}

// Saída (ao carregar enum):
// Construtor
// Construtor
// Construtor
```

### 6. Passar Argumentos

```java
public enum Moeda {
    REAL("R$", "BRL"),
    DOLAR("$", "USD"),
    EURO("€", "EUR");
    
    private final String simbolo;
    private final String codigo;
    
    Moeda(String simbolo, String codigo) {
        this.simbolo = simbolo;
        this.codigo = codigo;
    }
    
    public String getSimbolo() { return simbolo; }
}

System.out.println(Moeda.REAL.getSimbolo()); // R$
```

### 7. Múltiplos Construtores (Sobrecarga)

```java
public enum Prioridade {
    BAIXA,
    MEDIA(5),
    ALTA(10);
    
    private int nivel;
    
    // Construtor 1
    Prioridade() {
        this.nivel = 1;
    }
    
    // Construtor 2
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    public int getNivel() { return nivel; }
}

System.out.println(Prioridade.BAIXA.getNivel());  // 1
System.out.println(Prioridade.ALTA.getNivel());   // 10
```

### 8. Validação no Construtor

```java
public enum Percentual {
    DEZ(10),
    VINTE(20),
    CINQUENTA(50);
    
    private int valor;
    
    Percentual(int valor) {
        if (valor < 0 || valor > 100) {
            throw new IllegalArgumentException("Valor deve estar entre 0 e 100");
        }
        this.valor = valor;
    }
    
    public int getValor() { return valor; }
}
```

### 9. Inicialização Complexa

```java
public enum Operacao {
    SOMA, SUBTRACAO, MULTIPLICACAO;
    
    private String simbolo;
    
    Operacao() {
        this.simbolo = switch (this) {
            case SOMA -> "+";
            case SUBTRACAO -> "-";
            case MULTIPLICACAO -> "×";
        };
    }
    
    public String getSimbolo() { return simbolo; }
}

System.out.println(Operacao.SOMA.getSimbolo()); // +
```

### 10. Construtor vs Bloco Estático

```java
public enum Config {
    INSTANCE;
    
    private String valor;
    
    // Construtor (executado para cada constante)
    Config() {
        this.valor = "Instância: " + this.name();
    }
    
    // Bloco estático (executado uma vez)
    static {
        System.out.println("Enum carregado");
    }
}

// Saída:
// Enum carregado
```

---

## Aplicabilidade

**Construtor private**:
- Garante que apenas enum cria instâncias
- Chamado automaticamente na declaração
- Executado uma vez por constante
- Pode receber argumentos
- Pode validar valores

---

## Armadilhas

### 1. Tentar Usar public

```java
public enum Erro {
    A, B;
    
    // ❌ ERRO
    // public Erro() { }
}
```

### 2. Tentar Instanciar com new

```java
public enum Status {
    ATIVO, INATIVO
}

// ❌ ERRO
// Status s = new Status();
```

### 3. Esquecer Argumentos

```java
public enum Planeta {
    TERRA(5.972e24),
    MARTE; // ❌ ERRO: falta argumento
    
    private double massa;
    
    Planeta(double massa) {
        this.massa = massa;
    }
}
```

---

## Boas Práticas

### 1. Omitir private (Implícito)

```java
// ✅ private implícito
public enum Status {
    ATIVO, INATIVO;
    
    Status() { } // private implícito
}
```

### 2. Atributos final

```java
// ✅ final = imutável
public enum Cor {
    VERMELHO(255, 0, 0);
    
    private final int r, g, b;
    
    Cor(int r, int g, int b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
```

### 3. Validação no Construtor

```java
// ✅ Validar argumentos
public enum Idade {
    CRIANCA(0, 12),
    ADULTO(18, 100);
    
    private final int min, max;
    
    Idade(int min, int max) {
        if (min < 0 || max < min) {
            throw new IllegalArgumentException();
        }
        this.min = min;
        this.max = max;
    }
}
```

---

## Resumo

**Construtor de enum é private implicitamente**:

```java
public enum Status {
    ATIVO, INATIVO;
    
    // private implícito
    Status() { }
}
```

**Características**:
- `private` implícito (pode omitir)
- Chamado automaticamente na declaração
- Executado uma vez por constante
- Não pode ser `public` ou `protected`
- Não pode instanciar com `new`

**Argumentos**:
```java
CONSTANTE(args)

Enum(args) {
    // Inicialização
}
```

**Sobrecarga**:
```java
BAIXA,
ALTA(10);

Enum() { nivel = 1; }
Enum(int nivel) { this.nivel = nivel; }
```

**Execução**:
- Construtor executado ao carregar enum
- Uma vez por constante
- Antes de qualquer uso

**Regra de Ouro**: Construtor de enum é **private implícito** - não pode instanciar com `new`. Executado **uma vez por constante** ao carregar enum. Use para **inicializar atributos** com valores específicos por constante.
