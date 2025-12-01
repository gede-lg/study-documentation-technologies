# T8.05 - Múltiplas Interfaces

## Introdução

**Múltiplas interfaces**: enum pode implementar várias interfaces.

```java
interface Nomeavel {
    String getNome();
}

interface Descritivel {
    String getDescricao();
}

// ✅ Implementar múltiplas interfaces
public enum Status implements Nomeavel, Descritivel {
    ATIVO("Ativo", "Status ativo do sistema");
    
    private final String nome;
    private final String descricao;
    
    Status(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }
    
    @Override
    public String getNome() {
        return nome;
    }
    
    @Override
    public String getDescricao() {
        return descricao;
    }
}
```

**Vírgula**: separador entre múltiplas interfaces.

---

## Fundamentos

### 1. Duas Interfaces

```java
interface Calculavel {
    double calcular(double valor);
}

interface Formatavel {
    String formatar();
}

// ✅ Implementar duas interfaces
public enum Desconto implements Calculavel, Formatavel {
    VIP(0.20, "VIP");
    
    private final double percentual;
    private final String nome;
    
    Desconto(double percentual, String nome) {
        this.percentual = percentual;
        this.nome = nome;
    }
    
    @Override
    public double calcular(double valor) {
        return valor - (valor * percentual);
    }
    
    @Override
    public String formatar() {
        return nome + " (" + (percentual * 100) + "%)";
    }
}

double valorFinal = Desconto.VIP.calcular(100); // 80.0
String texto = Desconto.VIP.formatar();         // "VIP (20.0%)"
```

### 2. Três ou Mais Interfaces

```java
interface Nomeavel {
    String getNome();
}

interface Descritivel {
    String getDescricao();
}

interface Codigavel {
    int getCodigo();
}

// ✅ Três interfaces
public enum Status implements Nomeavel, Descritivel, Codigavel {
    ATIVO("Ativo", "Status ativo", 1);
    
    private final String nome;
    private final String descricao;
    private final int codigo;
    
    Status(String nome, String descricao, int codigo) {
        this.nome = nome;
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    @Override
    public String getNome() { return nome; }
    
    @Override
    public String getDescricao() { return descricao; }
    
    @Override
    public int getCodigo() { return codigo; }
}
```

### 3. Interface com Métodos Default

```java
interface Formatavel {
    String formatar();
    
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}

interface Validavel {
    boolean validar();
    
    default String validarComMensagem() {
        return validar() ? "Válido" : "Inválido";
    }
}

// ✅ Herda métodos default de ambas
public enum Cor implements Formatavel, Validavel {
    VERMELHO("Vermelho");
    
    private final String nome;
    
    Cor(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String formatar() {
        return nome;
    }
    
    @Override
    public boolean validar() {
        return nome != null && !nome.isEmpty();
    }
    
    // ✅ Herda formatarCompleto() e validarComMensagem()
}

String completo = Cor.VERMELHO.formatarCompleto();         // "[Vermelho]"
String validacao = Cor.VERMELHO.validarComMensagem();      // "Válido"
```

### 4. Interfaces com Herança

```java
interface Base {
    String getId();
}

interface Nomeavel extends Base {
    String getNome();
}

interface Descritivel extends Base {
    String getDescricao();
}

// ✅ Implementa interfaces que estendem Base
public enum Produto implements Nomeavel, Descritivel {
    NOTEBOOK("NB001", "Notebook", "Notebook Dell");
    
    private final String id;
    private final String nome;
    private final String descricao;
    
    Produto(String id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }
    
    @Override
    public String getId() { return id; }
    
    @Override
    public String getNome() { return nome; }
    
    @Override
    public String getDescricao() { return descricao; }
}
```

### 5. Segregação de Interface

```java
interface Executavel {
    void executar();
}

interface Reversivel {
    void reverter();
}

interface Validavel {
    boolean validar();
}

// ✅ Comando com três comportamentos
public enum Comando implements Executavel, Reversivel, Validavel {
    SALVAR {
        @Override
        public void executar() {
            System.out.println("Salvando...");
        }
        
        @Override
        public void reverter() {
            System.out.println("Revertendo salvamento...");
        }
        
        @Override
        public boolean validar() {
            return true;
        }
    }
}
```

### 6. Polimorfismo com Múltiplas Interfaces

```java
interface Calculavel {
    double calcular(double valor);
}

interface Nomeavel {
    String getNome();
}

public enum Desconto implements Calculavel, Nomeavel {
    VIP(0.20, "VIP");
    
    private final double percentual;
    private final String nome;
    
    Desconto(double percentual, String nome) {
        this.percentual = percentual;
        this.nome = nome;
    }
    
    @Override
    public double calcular(double valor) {
        return valor - (valor * percentual);
    }
    
    @Override
    public String getNome() {
        return nome;
    }
}

// ✅ Polimorfismo com Calculavel
Calculavel calc = Desconto.VIP;
double resultado = calc.calcular(100);

// ✅ Polimorfismo com Nomeavel
Nomeavel n = Desconto.VIP;
String nome = n.getNome();
```

### 7. Interfaces Funcionais

```java
@FunctionalInterface
interface Processador {
    String processar(String valor);
}

@FunctionalInterface
interface Validador {
    boolean validar(String valor);
}

// ✅ Implementa duas interfaces funcionais
public enum TipoProcessamento implements Processador, Validador {
    EMAIL {
        @Override
        public String processar(String valor) {
            return valor.toLowerCase();
        }
        
        @Override
        public boolean validar(String valor) {
            return valor.contains("@");
        }
    }
}
```

### 8. Interface com Generics

```java
interface Conversor<T> {
    T converter(String valor);
}

interface Validador<T> {
    boolean validar(T valor);
}

// ✅ Múltiplas interfaces com generics
public enum TipoConversao implements Conversor<Integer>, Validador<Integer> {
    INTEIRO {
        @Override
        public Integer converter(String valor) {
            return Integer.parseInt(valor);
        }
        
        @Override
        public boolean validar(Integer valor) {
            return valor != null && valor >= 0;
        }
    }
}
```

### 9. Collections de Múltiplas Interfaces

```java
interface Ordenavel {
    int getOrdem();
}

interface Nomeavel {
    String getNome();
}

public enum Prioridade implements Ordenavel, Nomeavel {
    BAIXA(1, "Baixa"),
    ALTA(10, "Alta");
    
    private final int ordem;
    private final String nome;
    
    Prioridade(int ordem, String nome) {
        this.ordem = ordem;
        this.nome = nome;
    }
    
    @Override
    public int getOrdem() { return ordem; }
    
    @Override
    public String getNome() { return nome; }
}

// ✅ Lista de Ordenavel
List<Ordenavel> ordenados = Arrays.asList(Prioridade.values());
ordenados.sort(Comparator.comparingInt(Ordenavel::getOrdem));

// ✅ Lista de Nomeavel
List<Nomeavel> nomes = Arrays.asList(Prioridade.values());
nomes.forEach(n -> System.out.println(n.getNome()));
```

### 10. Conflito de Métodos Default

```java
interface I1 {
    default String metodo() {
        return "I1";
    }
}

interface I2 {
    default String metodo() {
        return "I2";
    }
}

// ✅ Resolver conflito explicitamente
public enum E implements I1, I2 {
    CONSTANTE;
    
    @Override
    public String metodo() {
        // ✅ Escolher qual default usar
        return I1.super.metodo(); // ou I2.super.metodo()
    }
}

String resultado = E.CONSTANTE.metodo(); // "I1"
```

---

## Aplicabilidade

**Múltiplas interfaces** para:
- Segregar comportamentos
- Composição de funcionalidades
- Polimorfismo flexível
- Interface Segregation Principle (ISP)

---

## Armadilhas

### 1. Conflito de Default

```java
interface I1 {
    default String get() { return "I1"; }
}

interface I2 {
    default String get() { return "I2"; }
}

// ❌ Conflito de default
public enum E implements I1, I2 { } // Erro: conflito

// ✅ Resolver conflito
public enum E implements I1, I2 {
    CONSTANTE;
    
    @Override
    public String get() {
        return I1.super.get();
    }
}
```

### 2. Muitas Interfaces

```java
// ⚠️ Muitas interfaces (difícil manter)
public enum E implements I1, I2, I3, I4, I5, I6 {
    // ...
}

// ✅ Preferir interfaces coesas
public enum E implements Nomeavel, Descritivel {
    // ...
}
```

### 3. Métodos com Mesmo Nome

```java
interface I1 {
    String get();
}

interface I2 {
    String get();
}

// ✅ Mesmo nome/assinatura: uma implementação serve para ambas
public enum E implements I1, I2 {
    CONSTANTE;
    
    @Override
    public String get() {
        return "valor"; // ✅ Implementa ambas
    }
}
```

---

## Boas Práticas

### 1. Interfaces Coesas

```java
// ✅ Interfaces focadas
interface Nomeavel { String getNome(); }
interface Descritivel { String getDescricao(); }

public enum Status implements Nomeavel, Descritivel {
    // ...
}
```

### 2. Limitar Número de Interfaces

```java
// ✅ 2-4 interfaces (bom)
public enum E implements I1, I2, I3 { }

// ⚠️ 5+ interfaces (considerar refatoração)
```

### 3. Documentar Interfaces

```java
// ✅ Javadoc
/**
 * Status do sistema.
 * Implementa {@link Nomeavel} e {@link Descritivel}.
 */
public enum Status implements Nomeavel, Descritivel {
    // ...
}
```

### 4. Resolver Conflitos Explicitamente

```java
// ✅ Resolver conflito de default
@Override
public String metodo() {
    return I1.super.metodo(); // escolha explícita
}
```

---

## Resumo

**Múltiplas interfaces**:

```java
interface Nomeavel {
    String getNome();
}

interface Descritivel {
    String getDescricao();
}

// ✅ Implementar múltiplas interfaces
public enum Status implements Nomeavel, Descritivel {
    ATIVO("Ativo", "Status ativo");
    
    private final String nome;
    private final String descricao;
    
    Status(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }
    
    @Override
    public String getNome() { return nome; }
    
    @Override
    public String getDescricao() { return descricao; }
}
```

**Polimorfismo**:

```java
// ✅ Como Nomeavel
Nomeavel n = Status.ATIVO;
n.getNome();

// ✅ Como Descritivel
Descritivel d = Status.ATIVO;
d.getDescricao();
```

**Resolver conflito**:

```java
interface I1 {
    default String get() { return "I1"; }
}

interface I2 {
    default String get() { return "I2"; }
}

public enum E implements I1, I2 {
    CONSTANTE;
    
    @Override
    public String get() {
        return I1.super.get(); // ✅ Escolhe I1
    }
}
```

**Regra de Ouro**: Enum pode implementar **múltiplas interfaces** separadas por **vírgula**. Implementar **todos os métodos** de todas as interfaces. Conflito de **default** deve ser resolvido explicitamente (`Interface.super.metodo()`). Preferir **interfaces coesas** (2-4 interfaces). Útil para **segregar comportamentos** (ISP - Interface Segregation Principle). Polimorfismo **flexível** (enum como vários tipos).
