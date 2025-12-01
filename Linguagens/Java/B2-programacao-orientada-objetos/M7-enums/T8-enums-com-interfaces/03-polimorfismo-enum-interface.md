# T8.03 - Polimorfismo: Enum como Tipo da Interface

## Introdução

**Polimorfismo**: enum pode ser tratado como tipo da interface.

```java
interface Operacao {
    double calcular(double a, double b);
}

public enum Op implements Operacao {
    SOMA,
    SUBTRACAO;
    
    @Override
    public double calcular(double a, double b) {
        switch (this) {
            case SOMA: return a + b;
            case SUBTRACAO: return a - b;
            default: throw new IllegalStateException();
        }
    }
}

// ✅ Polimorfismo: referência pela interface
Operacao operacao = Op.SOMA;
double resultado = operacao.calcular(5, 3); // 8.0
```

**Interface como tipo**: enum se comporta como implementação da interface.

---

## Fundamentos

### 1. Referência pela Interface

```java
interface Descritivel {
    String getDescricao();
}

public enum Status implements Descritivel {
    ATIVO("Ativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    @Override
    public String getDescricao() {
        return descricao;
    }
}

// ✅ Referência pela interface
Descritivel d = Status.ATIVO;
String desc = d.getDescricao(); // "Ativo"

// ✅ Referência pelo enum
Status s = Status.ATIVO;
String desc2 = s.getDescricao(); // "Ativo"
```

### 2. Parâmetro de Método

```java
interface Calculavel {
    double calcular(double valor);
}

public enum Desconto implements Calculavel {
    VIP(0.20),
    COMUM(0.05);
    
    private final double percentual;
    
    Desconto(double percentual) {
        this.percentual = percentual;
    }
    
    @Override
    public double calcular(double valor) {
        return valor - (valor * percentual);
    }
}

// ✅ Método aceita interface
public double aplicarDesconto(Calculavel calc, double valor) {
    return calc.calcular(valor);
}

// ✅ Passar enum como interface
double valorFinal = aplicarDesconto(Desconto.VIP, 100); // 80.0
```

### 3. Retorno de Método

```java
interface Operacao {
    int executar(int a, int b);
}

public enum Op implements Operacao {
    SOMA {
        @Override
        public int executar(int a, int b) {
            return a + b;
        }
    },
    MULT {
        @Override
        public int executar(int a, int b) {
            return a * b;
        }
    }
}

// ✅ Método retorna interface
public Operacao obterOperacao(String tipo) {
    return "soma".equals(tipo) ? Op.SOMA : Op.MULT;
}

Operacao op = obterOperacao("soma");
int resultado = op.executar(5, 3); // 8
```

### 4. Lista de Interface

```java
interface Nomeavel {
    String getNome();
}

public enum Cor implements Nomeavel {
    VERMELHO("Vermelho"),
    VERDE("Verde");
    
    private final String nome;
    
    Cor(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String getNome() {
        return nome;
    }
}

// ✅ Lista de interface
List<Nomeavel> lista = new ArrayList<>();
lista.add(Cor.VERMELHO);
lista.add(Cor.VERDE);

// ✅ Iterar pela interface
for (Nomeavel n : lista) {
    System.out.println(n.getNome());
}
```

### 5. Map com Interface

```java
interface Executavel {
    void executar();
}

public enum Comando implements Executavel {
    SALVAR {
        @Override
        public void executar() {
            System.out.println("Salvando...");
        }
    },
    DELETAR {
        @Override
        public void executar() {
            System.out.println("Deletando...");
        }
    }
}

// ✅ Map com valor interface
Map<String, Executavel> comandos = new HashMap<>();
comandos.put("salvar", Comando.SALVAR);
comandos.put("deletar", Comando.DELETAR);

// ✅ Executar via interface
Executavel cmd = comandos.get("salvar");
cmd.executar(); // "Salvando..."
```

### 6. Stream com Interface

```java
interface Pontuavel {
    int getPontos();
}

public enum Nivel implements Pontuavel {
    BRONZE(100),
    PRATA(500),
    OURO(1000);
    
    private final int pontos;
    
    Nivel(int pontos) {
        this.pontos = pontos;
    }
    
    @Override
    public int getPontos() {
        return pontos;
    }
}

// ✅ Stream de interface
int total = Arrays.stream(Nivel.values())
    .mapToInt(Pontuavel::getPontos)
    .sum(); // 1600
```

### 7. Comparator com Interface

```java
interface Ordenavel {
    int getOrdem();
}

public enum Prioridade implements Ordenavel {
    BAIXA(1),
    MEDIA(5),
    ALTA(10);
    
    private final int ordem;
    
    Prioridade(int ordem) {
        this.ordem = ordem;
    }
    
    @Override
    public int getOrdem() {
        return ordem;
    }
}

// ✅ Comparator pela interface
List<Ordenavel> lista = Arrays.asList(
    Prioridade.ALTA,
    Prioridade.BAIXA,
    Prioridade.MEDIA
);

lista.sort(Comparator.comparingInt(Ordenavel::getOrdem));
// [BAIXA, MEDIA, ALTA]
```

### 8. Cast de Interface para Enum

```java
interface Descritivel {
    String getDescricao();
}

public enum Status implements Descritivel {
    ATIVO("Ativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    @Override
    public String getDescricao() {
        return descricao;
    }
}

Descritivel d = Status.ATIVO;

// ✅ Cast para enum
if (d instanceof Status) {
    Status s = (Status) d;
    System.out.println(s.name()); // "ATIVO"
}
```

### 9. instanceof com Interface

```java
interface Operacao {
    double calcular(double a, double b);
}

public enum Op implements Operacao {
    SOMA;
    
    @Override
    public double calcular(double a, double b) {
        return a + b;
    }
}

Operacao op = Op.SOMA;

// ✅ instanceof com interface
if (op instanceof Operacao) {
    System.out.println("É Operacao");
}

// ✅ instanceof com enum
if (op instanceof Op) {
    System.out.println("É Op");
}
```

### 10. Método Genérico com Interface

```java
interface Processador<T> {
    T processar(T valor);
}

public enum TipoProcessamento implements Processador<String> {
    MAIUSCULA {
        @Override
        public String processar(String valor) {
            return valor.toUpperCase();
        }
    }
}

// ✅ Método genérico com interface
public <T> T aplicarProcessamento(Processador<T> proc, T valor) {
    return proc.processar(valor);
}

String resultado = aplicarProcessamento(TipoProcessamento.MAIUSCULA, "teste");
// "TESTE"
```

---

## Aplicabilidade

**Polimorfismo** para:
- Tratar enum como interface
- Passar enum para métodos genéricos
- Armazenar enum em collections de interface
- Strategy/Command patterns

---

## Armadilhas

### 1. Perda de Métodos do Enum

```java
interface Descritivel {
    String getDescricao();
}

public enum Status implements Descritivel {
    ATIVO;
    
    @Override
    public String getDescricao() {
        return name();
    }
    
    public void metodoEspecifico() {
        System.out.println("Específico");
    }
}

Descritivel d = Status.ATIVO;

// ⚠️ Não pode chamar método específico do enum
// d.metodoEspecifico(); // Erro: método não existe em Descritivel

// ✅ Cast para enum
((Status) d).metodoEspecifico(); // OK
```

### 2. Cast Inseguro

```java
interface Operacao {
    double calcular(double a, double b);
}

Operacao op = obterOperacao(); // retorna enum ou classe

// ⚠️ Cast sem verificação
Status s = (Status) op; // ⚠️ ClassCastException se não for Status

// ✅ Verificar antes de cast
if (op instanceof Status) {
    Status s = (Status) op;
}
```

### 3. Comparação com ==

```java
interface Descritivel {
    String getDescricao();
}

public enum Status implements Descritivel {
    ATIVO;
    
    @Override
    public String getDescricao() {
        return "Ativo";
    }
}

Descritivel d1 = Status.ATIVO;
Descritivel d2 = Status.ATIVO;

// ✅ == funciona (singleton)
if (d1 == d2) {
    System.out.println("Mesmo objeto");
}

// ✅ Mas preferir equals() para interfaces
if (d1.equals(d2)) {
    System.out.println("Iguais");
}
```

---

## Boas Práticas

### 1. Referência pela Interface

```java
// ✅ Referência pela interface (mais flexível)
Operacao op = Op.SOMA;

// ⚠️ Referência pelo enum (menos flexível)
Op op = Op.SOMA;
```

### 2. Parâmetros de Interface

```java
// ✅ Método aceita interface
public void processar(Descritivel d) {
    System.out.println(d.getDescricao());
}

// Aceita qualquer enum que implemente Descritivel
processar(Status.ATIVO);
processar(Cor.VERMELHO);
```

### 3. instanceof Antes de Cast

```java
// ✅ Verificar tipo
if (operacao instanceof Op) {
    Op op = (Op) operacao;
    // usar op
}
```

### 4. Documentar Polimorfismo

```java
// ✅ Javadoc
/**
 * Aplica desconto usando calculadora.
 * @param calc calculadora (pode ser enum Desconto)
 * @param valor valor original
 * @return valor com desconto
 */
public double aplicar(Calculavel calc, double valor) {
    return calc.calcular(valor);
}
```

---

## Resumo

**Polimorfismo**:

```java
interface Operacao {
    double calcular(double a, double b);
}

public enum Op implements Operacao {
    SOMA;
    
    @Override
    public double calcular(double a, double b) {
        return a + b;
    }
}

// ✅ Referência pela interface
Operacao op = Op.SOMA;
op.calcular(5, 3);
```

**Uso em métodos**:

```java
// ✅ Parâmetro
public void processar(Descritivel d) { }

// ✅ Retorno
public Operacao obter() { return Op.SOMA; }

// ✅ Lista
List<Nomeavel> lista = Arrays.asList(Cor.VERMELHO, Status.ATIVO);

// ✅ Map
Map<String, Executavel> map = new HashMap<>();
map.put("cmd", Comando.SALVAR);
```

**Cast e instanceof**:

```java
Descritivel d = Status.ATIVO;

// ✅ instanceof
if (d instanceof Status) {
    Status s = (Status) d;
    s.name(); // métodos específicos do enum
}
```

**Regra de Ouro**: Enum pode ser tratado como **tipo da interface** (polimorfismo). Referência pela **interface** (mais flexível). Aceitar **interface como parâmetro** (permite múltiplos enums). Usar **instanceof** antes de cast. Enum mantém **singleton** mesmo via interface (== funciona). Polimorfismo útil para **Strategy/Command patterns**.
