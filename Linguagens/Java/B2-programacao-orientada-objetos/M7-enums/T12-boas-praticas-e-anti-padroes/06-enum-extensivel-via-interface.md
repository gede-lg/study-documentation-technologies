# T12.06 - Enum Extensível via Interface

## Introdução

**Enum não é extensível**: não pode herdar de outro enum.

```java
// ❌ Enum não pode herdar
public enum StatusBase {
    ATIVO,
    INATIVO
}

// ❌ Não compila
public enum StatusPedido extends StatusBase { // ❌ Erro
    ENVIADO,
    ENTREGUE
}
```

**Solução**: interface para polimorfismo.

```java
// ✅ Interface para polimorfismo
public interface Status {
    String getDescricao();
    boolean isAtivo();
}

public enum StatusUsuario implements Status {
    ATIVO {
        @Override
        public String getDescricao() {
            return "Usuário ativo";
        }
        
        @Override
        public boolean isAtivo() {
            return true;
        }
    },
    INATIVO {
        @Override
        public String getDescricao() {
            return "Usuário inativo";
        }
        
        @Override
        public boolean isAtivo() {
            return false;
        }
    }
}

public enum StatusPedido implements Status {
    NOVO {
        @Override
        public String getDescricao() {
            return "Pedido novo";
        }
        
        @Override
        public boolean isAtivo() {
            return true;
        }
    }
}

// ✅ Polimorfismo
public void processar(Status status) {
    if (status.isAtivo()) {
        System.out.println(status.getDescricao());
    }
}

processar(StatusUsuario.ATIVO);
processar(StatusPedido.NOVO);
```

**Interface** permite polimorfismo entre enums.

---

## Fundamentos

### 1. Interface para Operações Comuns

```java
// ✅ Interface
public interface Operacao {
    double calcular(double a, double b);
}

// ✅ Enum implementa
public enum OperacaoBasica implements Operacao {
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
    }
}

public enum OperacaoAvancada implements Operacao {
    POTENCIA {
        @Override
        public double calcular(double a, double b) {
            return Math.pow(a, b);
        }
    },
    RAIZ {
        @Override
        public double calcular(double a, double b) {
            return Math.pow(a, 1.0 / b);
        }
    }
}

// ✅ Uso polimórfico
public double executar(Operacao op, double a, double b) {
    return op.calcular(a, b);
}

executar(OperacaoBasica.SOMA, 5, 3); // 8
executar(OperacaoAvancada.POTENCIA, 2, 3); // 8
```

### 2. Interface com Métodos Default

```java
// ✅ Interface com default
public interface Descritivel {
    String getNome();
    
    default String getDescricaoCompleta() {
        return "Item: " + getNome();
    }
}

public enum Produto implements Descritivel {
    LAPTOP("Laptop"),
    MOUSE("Mouse");
    
    private final String nome;
    
    Produto(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String getNome() {
        return nome;
    }
    
    // ✅ Herda getDescricaoCompleta()
}

public enum Servico implements Descritivel {
    CONSULTORIA("Consultoria"),
    SUPORTE("Suporte");
    
    private final String nome;
    
    Servico(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String getNome() {
        return nome;
    }
}

// ✅ Uso
Descritivel item = Produto.LAPTOP;
System.out.println(item.getDescricaoCompleta()); // "Item: Laptop"
```

### 3. Múltiplas Interfaces

```java
// ✅ Múltiplas interfaces
public interface Nomeavel {
    String getNome();
}

public interface Valoravel {
    double getValor();
}

public enum TipoPagamento implements Nomeavel, Valoravel {
    DINHEIRO("Dinheiro", 0.0),
    CARTAO("Cartão", 0.05); // 5% taxa
    
    private final String nome;
    private final double taxa;
    
    TipoPagamento(String nome, double taxa) {
        this.nome = nome;
        this.taxa = taxa;
    }
    
    @Override
    public String getNome() {
        return nome;
    }
    
    @Override
    public double getValor() {
        return taxa;
    }
    
    public double calcularTotal(double valor) {
        return valor * (1 + taxa);
    }
}

// ✅ Uso com interface
public void processar(Nomeavel item) {
    System.out.println(item.getNome());
}

processar(TipoPagamento.CARTAO); // "Cartão"
```

### 4. Interface para Categorização

```java
// ✅ Interface para categoria
public interface Categoria {
    String getCategoria();
}

public enum Fruta implements Categoria {
    MACA("Maçã"),
    BANANA("Banana");
    
    private final String nome;
    
    Fruta(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String getCategoria() {
        return "Fruta";
    }
}

public enum Vegetal implements Categoria {
    ALFACE("Alface"),
    TOMATE("Tomate");
    
    private final String nome;
    
    Vegetal(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String getCategoria() {
        return "Vegetal";
    }
}

// ✅ Listar todas as categorias
public void listar(List<Categoria> itens) {
    for (Categoria item : itens) {
        System.out.println(item.getCategoria());
    }
}

List<Categoria> lista = Arrays.asList(
    Fruta.MACA,
    Vegetal.ALFACE
);
listar(lista);
```

### 5. Interface com Validação

```java
// ✅ Interface com validação
public interface Validavel {
    boolean validar(String valor);
    String getMensagemErro();
}

public enum ValidadorEmail implements Validavel {
    INSTANCIA;
    
    @Override
    public boolean validar(String valor) {
        return valor != null && valor.contains("@");
    }
    
    @Override
    public String getMensagemErro() {
        return "Email inválido";
    }
}

public enum ValidadorCPF implements Validavel {
    INSTANCIA;
    
    @Override
    public boolean validar(String valor) {
        return valor != null && valor.length() == 11;
    }
    
    @Override
    public String getMensagemErro() {
        return "CPF inválido";
    }
}

// ✅ Uso polimórfico
public void validarCampo(String valor, Validavel validador) {
    if (!validador.validar(valor)) {
        System.err.println(validador.getMensagemErro());
    }
}

validarCampo("teste@exemplo.com", ValidadorEmail.INSTANCIA);
validarCampo("12345678901", ValidadorCPF.INSTANCIA);
```

### 6. Interface Funcional

```java
// ✅ Interface funcional
@FunctionalInterface
public interface Conversor<T> {
    T converter(String valor);
}

public enum ConversorNumerico implements Conversor<Double> {
    INSTANCIA;
    
    @Override
    public Double converter(String valor) {
        return Double.parseDouble(valor);
    }
}

public enum ConversorBoolean implements Conversor<Boolean> {
    INSTANCIA;
    
    @Override
    public Boolean converter(String valor) {
        return Boolean.parseBoolean(valor);
    }
}

// ✅ Uso
public <T> T processar(String valor, Conversor<T> conversor) {
    return conversor.converter(valor);
}

Double numero = processar("123.45", ConversorNumerico.INSTANCIA);
Boolean flag = processar("true", ConversorBoolean.INSTANCIA);
```

### 7. Interface para Estratégia

```java
// ✅ Interface para estratégia
public interface EstrategiaDesconto {
    double aplicar(double valor);
    String getDescricao();
}

public enum DescontoCliente implements EstrategiaDesconto {
    VIP {
        @Override
        public double aplicar(double valor) {
            return valor * 0.8; // 20% desconto
        }
        
        @Override
        public String getDescricao() {
            return "Desconto VIP (20%)";
        }
    },
    REGULAR {
        @Override
        public double aplicar(double valor) {
            return valor * 0.95; // 5% desconto
        }
        
        @Override
        public String getDescricao() {
            return "Desconto Regular (5%)";
        }
    }
}

public enum DescontoPromocional implements EstrategiaDesconto {
    BLACK_FRIDAY {
        @Override
        public double aplicar(double valor) {
            return valor * 0.5; // 50% desconto
        }
        
        @Override
        public String getDescricao() {
            return "Black Friday (50%)";
        }
    }
}

// ✅ Uso
public double calcularPreco(double valor, EstrategiaDesconto estrategia) {
    System.out.println(estrategia.getDescricao());
    return estrategia.aplicar(valor);
}

calcularPreco(100.0, DescontoCliente.VIP); // 80.0
calcularPreco(100.0, DescontoPromocional.BLACK_FRIDAY); // 50.0
```

### 8. Interface com Constantes

```java
// ✅ Interface com constantes
public interface Limites {
    int MAX_TENTATIVAS = 3;
    long TIMEOUT_MS = 5000;
}

public enum ConfiguradorLogin implements Limites {
    INSTANCIA;
    
    public boolean validarTentativas(int tentativas) {
        return tentativas <= MAX_TENTATIVAS;
    }
    
    public long getTimeout() {
        return TIMEOUT_MS;
    }
}

// ✅ Uso
if (ConfiguradorLogin.INSTANCIA.validarTentativas(2)) {
    System.out.println("Tentativa válida");
}
```

### 9. Interface para Command Pattern

```java
// ✅ Interface Command
public interface Command {
    void executar();
    void desfazer();
}

public enum ComandoTexto implements Command {
    MAIUSCULA {
        private String original;
        
        @Override
        public void executar() {
            original = texto;
            texto = texto.toUpperCase();
        }
        
        @Override
        public void desfazer() {
            texto = original;
        }
    };
    
    private static String texto = "";
    
    public static void setTexto(String t) {
        texto = t;
    }
    
    public static String getTexto() {
        return texto;
    }
}

// ✅ Uso
ComandoTexto.setTexto("olá");
Command cmd = ComandoTexto.MAIUSCULA;
cmd.executar(); // "OLÁ"
cmd.desfazer(); // "olá"
```

### 10. Interface para Factory

```java
// ✅ Interface Factory
public interface Notificacao {
    void enviar(String mensagem);
}

class EmailNotificacao implements Notificacao {
    @Override
    public void enviar(String mensagem) {
        System.out.println("Email: " + mensagem);
    }
}

class SmsNotificacao implements Notificacao {
    @Override
    public void enviar(String mensagem) {
        System.out.println("SMS: " + mensagem);
    }
}

public enum TipoNotificacao {
    EMAIL {
        @Override
        public Notificacao criar() {
            return new EmailNotificacao();
        }
    },
    SMS {
        @Override
        public Notificacao criar() {
            return new SmsNotificacao();
        }
    };
    
    public abstract Notificacao criar();
}

// ✅ Uso
Notificacao notif = TipoNotificacao.EMAIL.criar();
notif.enviar("Olá!");
```

---

## Aplicabilidade

**Interface com enum** para:
- Polimorfismo entre enums
- Operações comuns
- Estratégias diferentes
- Command pattern
- Factory pattern

---

## Armadilhas

### 1. Tentar Herdar Enum

```java
// ❌ Enum não herda
public enum Base extends OutroEnum { } // ❌ Não compila

// ✅ Usar interface
public interface Status { }
public enum StatusA implements Status { }
```

### 2. Interface Muito Específica

```java
// ⚠️ Interface muito específica
public interface StatusPedido {
    boolean isPedidoNovo();
}

// ✅ Interface genérica
public interface Status {
    boolean isAtivo();
}
```

### 3. Não Usar Default Methods

```java
// ⚠️ Código duplicado
public interface Item {
    String getNome();
}

// ✅ Default method
public interface Item {
    String getNome();
    
    default String getDescricao() {
        return "Item: " + getNome();
    }
}
```

---

## Boas Práticas

### 1. Interface para Comportamento Comum

```java
public interface Operacao {
    double calcular(double a, double b);
}
```

### 2. Default Methods

```java
default String getDescricao() {
    return "Descrição padrão";
}
```

### 3. Múltiplas Interfaces

```java
public enum Tipo implements Interface1, Interface2 { }
```

### 4. Documentar Interface

```java
/**
 * Interface para operações matemáticas.
 */
public interface Operacao { }
```

---

## Resumo

**Interface com enum**:

```java
// ✅ Interface
public interface Operacao {
    double calcular(double a, double b);
}

// ✅ Enums implementam
public enum OpBasica implements Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    }
}

public enum OpAvancada implements Operacao {
    POTENCIA {
        @Override
        public double calcular(double a, double b) {
            return Math.pow(a, b);
        }
    }
}

// ✅ Polimorfismo
public void executar(Operacao op) {
    op.calcular(5, 3);
}
```

**Regra de Ouro**: **Interface** para polimorfismo entre enums. **Default methods** para código comum. **Múltiplas interfaces** quando necessário. **Documentar** interface e implementações.
