# T4.01 - Declaração de Construtores

## Introdução

**Construtores em enums**: inicializam atributos das constantes.

```java
public enum Status {
    ATIVO("Ativo"), 
    INATIVO("Inativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}

System.out.println(Status.ATIVO.getDescricao()); // "Ativo"
```

**Construtor**: método especial para inicializar constantes.

---

## Fundamentos

### 1. Construtor Básico

```java
public enum Cor {
    VERMELHO, VERDE, AZUL;
    
    // Construtor sem argumentos (opcional)
    Cor() {
        System.out.println("Criando: " + this.name());
    }
}
// Saída:
// Criando: VERMELHO
// Criando: VERDE
// Criando: AZUL
```

### 2. Construtor com Parâmetro

```java
public enum Prioridade {
    BAIXA(1),
    MEDIA(2),
    ALTA(3);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    public int getNivel() {
        return nivel;
    }
}

System.out.println(Prioridade.ALTA.getNivel()); // 3
```

### 3. Construtor com Múltiplos Parâmetros

```java
public enum Moeda {
    REAL("BRL", "R$"),
    DOLAR("USD", "$"),
    EURO("EUR", "€");
    
    private final String codigo;
    private final String simbolo;
    
    Moeda(String codigo, String simbolo) {
        this.codigo = codigo;
        this.simbolo = simbolo;
    }
    
    public String getCodigo() { return codigo; }
    public String getSimbolo() { return simbolo; }
}

System.out.println(Moeda.REAL.getSimbolo()); // "R$"
```

### 4. Atributos Final

```java
public enum TipoConta {
    CORRENTE("Conta Corrente"),
    POUPANCA("Conta Poupança");
    
    private final String nome; // ✅ final (imutável)
    
    TipoConta(String nome) {
        this.nome = nome;
    }
    
    public String getNome() {
        return nome;
    }
}
```

### 5. Construtor Sem Parâmetros

```java
public enum Direcao {
    NORTE, SUL, LESTE, OESTE;
    
    // Construtor implícito (não precisa declarar)
    // Direcao() { }
}
```

### 6. Inicialização Complexa

```java
public enum Planeta {
    TERRA(5.976e24, 6.37814e6);
    
    private final double massa;
    private final double raio;
    private final double gravidade;
    
    Planeta(double massa, double raio) {
        this.massa = massa;
        this.raio = raio;
        this.gravidade = calcularGravidade(massa, raio);
    }
    
    private static double calcularGravidade(double massa, double raio) {
        final double G = 6.67300E-11;
        return G * massa / (raio * raio);
    }
    
    public double getGravidade() {
        return gravidade;
    }
}
```

### 7. Construtor com Validação

```java
public enum Percentual {
    P10(10),
    P50(50),
    P100(100);
    
    private final int valor;
    
    Percentual(int valor) {
        if (valor < 0 || valor > 100) {
            throw new IllegalArgumentException("Percentual inválido: " + valor);
        }
        this.valor = valor;
    }
    
    public int getValor() {
        return valor;
    }
}
```

### 8. Atributo Derivado

```java
public enum Tamanho {
    PEQUENO("P", 1),
    MEDIO("M", 2),
    GRANDE("G", 3);
    
    private final String sigla;
    private final int ordem;
    private final String descricao;
    
    Tamanho(String sigla, int ordem) {
        this.sigla = sigla;
        this.ordem = ordem;
        this.descricao = sigla + " - " + name().toLowerCase();
    }
    
    public String getDescricao() {
        return descricao;
    }
}

System.out.println(Tamanho.PEQUENO.getDescricao()); // "P - pequeno"
```

### 9. Construtor com Constante Static

```java
public enum Temperatura {
    FRIO(0, 15),
    MODERADO(16, 25),
    QUENTE(26, 40);
    
    private static final String UNIDADE = "°C";
    
    private final int min;
    private final int max;
    
    Temperatura(int min, int max) {
        this.min = min;
        this.max = max;
    }
    
    public String getDescricao() {
        return min + UNIDADE + " - " + max + UNIDADE;
    }
}
```

### 10. Construtor com Collections

```java
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever", "deletar")),
    USER(Arrays.asList("ler", "escrever")),
    GUEST(Arrays.asList("ler"));
    
    private final List<String> acoes;
    
    Permissao(List<String> acoes) {
        this.acoes = new ArrayList<>(acoes); // cópia defensiva
    }
    
    public List<String> getAcoes() {
        return new ArrayList<>(acoes); // cópia defensiva
    }
}
```

---

## Aplicabilidade

**Construtores em enums** para:
- Inicializar atributos de constantes
- Validar valores passados
- Calcular atributos derivados
- Atribuir descrições/metadados

---

## Armadilhas

### 1. Atributo Não Final

```java
// ⚠️ Evitar: atributo mutável
public enum Status {
    ATIVO("Ativo");
    
    private String descricao; // sem final
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public void setDescricao(String d) {
        this.descricao = d; // ❌ Constante mutável
    }
}

// ✅ Preferir: final
private final String descricao;
```

### 2. Construtor Public/Protected

```java
// ❌ Erro de compilação
public enum Cor {
    VERMELHO;
    
    public Cor() { } // ❌ Construtor public não permitido
}

// ✅ Construtor implicitamente private
Cor() { }
```

### 3. Chamar Construtor Manualmente

```java
// ❌ Não pode chamar new
// Status s = new Status("Ativo"); // ❌ Erro

// ✅ Usar constantes existentes
Status s = Status.ATIVO;
```

---

## Boas Práticas

### 1. Atributos Final

```java
// ✅ Atributos sempre final
public enum Status {
    ATIVO("Ativo");
    
    private final String descricao; // ✅ Imutável
    
    Status(String descricao) {
        this.descricao = descricao;
    }
}
```

### 2. Validação no Construtor

```java
// ✅ Validar argumentos
public enum Prioridade {
    ALTA(1);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        if (nivel < 1 || nivel > 10) {
            throw new IllegalArgumentException("Nível inválido: " + nivel);
        }
        this.nivel = nivel;
    }
}
```

### 3. Getter para Atributos

```java
// ✅ Getter público
public enum Moeda {
    REAL("BRL");
    
    private final String codigo;
    
    Moeda(String codigo) {
        this.codigo = codigo;
    }
    
    public String getCodigo() { // ✅ Acesso aos atributos
        return codigo;
    }
}
```

### 4. Cópia Defensiva

```java
// ✅ Cópia defensiva para collections
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever"));
    
    private final List<String> acoes;
    
    Permissao(List<String> acoes) {
        this.acoes = new ArrayList<>(acoes); // ✅ Cópia
    }
    
    public List<String> getAcoes() {
        return new ArrayList<>(acoes); // ✅ Cópia
    }
}
```

---

## Resumo

**Declaração de construtor**:

```java
public enum Status {
    ATIVO("Ativo"),
    INATIVO("Inativo");
    
    private final String descricao;
    
    // Construtor (sempre private)
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}
```

**Sintaxe**:

```java
// 1. Sem parâmetros
enum Cor { VERMELHO, VERDE }

// 2. Com um parâmetro
enum Prioridade {
    BAIXA(1);
    
    private final int nivel;
    Prioridade(int nivel) { this.nivel = nivel; }
}

// 3. Múltiplos parâmetros
enum Moeda {
    REAL("BRL", "R$");
    
    private final String codigo, simbolo;
    Moeda(String c, String s) { codigo = c; simbolo = s; }
}
```

**Atributos**:

```java
public enum Status {
    ATIVO("Ativo");
    
    private final String descricao; // ✅ final (imutável)
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}
```

**Validação**:

```java
Prioridade(int nivel) {
    if (nivel < 1 || nivel > 10) {
        throw new IllegalArgumentException("Inválido: " + nivel);
    }
    this.nivel = nivel;
}
```

**Regra de Ouro**: Construtores em enums **inicializam atributos** das constantes. Sempre **private** (implícito). Use **final** para atributos (imutável). **Validação** no construtor. Getter para acessar. Sintaxe: `CONSTANTE(args)`. Cópia defensiva para collections.
