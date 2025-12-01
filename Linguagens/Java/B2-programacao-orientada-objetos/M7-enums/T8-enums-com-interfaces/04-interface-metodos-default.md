# T8.04 - Interface com Métodos Default

## Introdução

**Métodos default**: métodos com implementação padrão na interface.

```java
interface Formatavel {
    String formatar();
    
    // ✅ Método default (implementação na interface)
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}

public enum Cor implements Formatavel {
    VERMELHO("Vermelho");
    
    private final String nome;
    
    Cor(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String formatar() {
        return nome;
    }
    
    // ✅ formatarCompleto() herdado (não precisa implementar)
}

String completo = Cor.VERMELHO.formatarCompleto(); // "[Vermelho]"
```

**default**: implementação padrão que enum herda automaticamente.

---

## Fundamentos

### 1. Método Default Herdado

```java
interface Descritivel {
    String getNome();
    
    // ✅ Método default
    default String getDescricaoCompleta() {
        return "Nome: " + getNome();
    }
}

public enum Status implements Descritivel {
    ATIVO("Ativo");
    
    private final String nome;
    
    Status(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String getNome() {
        return nome;
    }
    
    // ✅ Não precisa implementar getDescricaoCompleta()
}

String desc = Status.ATIVO.getDescricaoCompleta(); // "Nome: Ativo"
```

### 2. Sobrescrever Método Default

```java
interface Formatavel {
    String formatar();
    
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}

public enum Moeda implements Formatavel {
    REAL("R$");
    
    private final String simbolo;
    
    Moeda(String simbolo) {
        this.simbolo = simbolo;
    }
    
    @Override
    public String formatar() {
        return simbolo;
    }
    
    // ✅ Sobrescrever método default
    @Override
    public String formatarCompleto() {
        return simbolo + " - Moeda Brasileira";
    }
}

String completo = Moeda.REAL.formatarCompleto(); // "R$ - Moeda Brasileira"
```

### 3. Default Chama Método Abstrato

```java
interface Calculavel {
    double calcular(double valor);
    
    // ✅ Default usa método abstrato
    default double calcularComTaxa(double valor, double taxa) {
        return calcular(valor) + taxa;
    }
}

public enum Desconto implements Calculavel {
    VIP(0.20);
    
    private final double percentual;
    
    Desconto(double percentual) {
        this.percentual = percentual;
    }
    
    @Override
    public double calcular(double valor) {
        return valor - (valor * percentual);
    }
    
    // ✅ calcularComTaxa() herdado
}

double total = Desconto.VIP.calcularComTaxa(100, 5); // 85.0
```

### 4. Múltiplos Métodos Default

```java
interface Nomeavel {
    String getNome();
    
    default String getNomeFormatado() {
        return getNome().toUpperCase();
    }
    
    default String getNomeCompleto() {
        return "Nome: " + getNome();
    }
}

public enum Cor implements Nomeavel {
    VERMELHO("Vermelho");
    
    private final String nome;
    
    Cor(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String getNome() {
        return nome;
    }
    
    // ✅ Ambos métodos default herdados
}

String formatado = Cor.VERMELHO.getNomeFormatado(); // "VERMELHO"
String completo = Cor.VERMELHO.getNomeCompleto();   // "Nome: Vermelho"
```

### 5. Default com Constante

```java
interface Configuravel {
    String getChave();
    
    default String getValorPadrao() {
        return "default";
    }
}

public enum Config implements Configuravel {
    TIMEOUT("timeout") {
        @Override
        public String getValorPadrao() {
            return "30";
        }
    },
    HOST("host"); // ✅ Usa default
    
    private final String chave;
    
    Config(String chave) {
        this.chave = chave;
    }
    
    @Override
    public String getChave() {
        return chave;
    }
}

String valorTimeout = Config.TIMEOUT.getValorPadrao(); // "30"
String valorHost = Config.HOST.getValorPadrao();       // "default"
```

### 6. Default com Validação

```java
interface Validavel {
    boolean validar(String valor);
    
    // ✅ Default com lógica
    default String validarComMensagem(String valor) {
        return validar(valor) ? "Válido" : "Inválido";
    }
}

public enum TipoValidacao implements Validavel {
    EMAIL {
        @Override
        public boolean validar(String valor) {
            return valor.contains("@");
        }
    },
    CPF {
        @Override
        public boolean validar(String valor) {
            return valor.length() == 11;
        }
    }
}

String msg = TipoValidacao.EMAIL.validarComMensagem("user@email.com"); // "Válido"
```

### 7. Default Chamando This

```java
interface Processador {
    String processar(String entrada);
    
    // ✅ Default chama this
    default String processarDuplo(String entrada) {
        String primeira = processar(entrada);
        return processar(primeira);
    }
}

public enum TipoProcessamento implements Processador {
    MAIUSCULA {
        @Override
        public String processar(String entrada) {
            return entrada.toUpperCase();
        }
    }
}

String resultado = TipoProcessamento.MAIUSCULA.processarDuplo("teste");
// "TESTE" (já maiúsculo, duplo não muda)
```

### 8. Default com Stream

```java
interface Coletavel {
    List<String> getItens();
    
    // ✅ Default com stream
    default long contarItens() {
        return getItens().stream().count();
    }
    
    default String primeiroItem() {
        return getItens().stream()
            .findFirst()
            .orElse("Nenhum");
    }
}

public enum Categoria implements Coletavel {
    TECNOLOGIA(Arrays.asList("Java", "Python"));
    
    private final List<String> itens;
    
    Categoria(List<String> itens) {
        this.itens = new ArrayList<>(itens);
    }
    
    @Override
    public List<String> getItens() {
        return new ArrayList<>(itens);
    }
}

long total = Categoria.TECNOLOGIA.contarItens(); // 2
```

### 9. Default Static

```java
interface Operacao {
    int executar(int a, int b);
    
    // ✅ Método static na interface
    static Operacao criar(String tipo) {
        return "soma".equals(tipo) ? Op.SOMA : Op.MULT;
    }
    
    default String getTipo() {
        return "Operação";
    }
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

// ✅ Chamar static da interface
Operacao op = Operacao.criar("soma");
```

### 10. Constant-Specific Override

```java
interface Formatavel {
    String formatar();
    
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}

public enum Status implements Formatavel {
    ATIVO("Ativo") {
        @Override
        public String formatarCompleto() {
            return "✅ " + formatar(); // ✅ Sobrescreve default
        }
    },
    INATIVO("Inativo"); // ✅ Usa default
    
    private final String nome;
    
    Status(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String formatar() {
        return nome;
    }
}

String ativo = Status.ATIVO.formatarCompleto();     // "✅ Ativo"
String inativo = Status.INATIVO.formatarCompleto(); // "[Inativo]"
```

---

## Aplicabilidade

**Métodos default** para:
- Implementação padrão comum
- Evitar duplicação de código
- Adicionar métodos a interfaces existentes
- Métodos utilitários baseados em abstratos

---

## Armadilhas

### 1. Conflito de Default

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

// ❌ Conflito de default
public enum E implements I1, I2 { // Erro: conflito
}

// ✅ Resolver conflito
public enum E implements I1, I2 {
    CONSTANTE;
    
    @Override
    public String metodo() {
        return I1.super.metodo(); // escolhe I1
    }
}
```

### 2. Default Não Herdado

```java
interface Formatavel {
    default String formatar() {
        return "default";
    }
}

// ⚠️ Sobrescrever remove default
public enum Status implements Formatavel {
    ATIVO;
    
    @Override
    public String formatar() {
        return "ativo"; // ⚠️ Não usa default
    }
}
```

### 3. Default Chama Método Não Implementado

```java
interface Processador {
    String processar(String valor); // abstrato
    
    default String processar() {
        return processar("default"); // ✅ OK: chama abstrato
    }
}

// ❌ Não implementa processar(String)
public enum Proc implements Processador { } // Erro
```

---

## Boas Práticas

### 1. Usar Default para Utilitários

```java
// ✅ Default para método utilitário
interface Nomeavel {
    String getNome();
    
    default String getNomeFormatado() {
        return getNome().toUpperCase();
    }
}
```

### 2. Documentar Default

```java
// ✅ Javadoc
interface Formatavel {
    String formatar();
    
    /**
     * Retorna formatação completa (com colchetes).
     * Implementação padrão: "[" + formatar() + "]"
     * @return texto formatado
     */
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}
```

### 3. @Override ao Sobrescrever

```java
// ✅ @Override explícito
@Override
public String formatarCompleto() {
    return simbolo + " - Moeda";
}
```

### 4. Default para Compatibilidade

```java
// ✅ Adicionar método sem quebrar implementações existentes
interface Operacao {
    double calcular(double a, double b);
    
    // ✅ Novo método default (não quebra código existente)
    default double calcularComTaxa(double a, double b, double taxa) {
        return calcular(a, b) + taxa;
    }
}
```

---

## Resumo

**Métodos default**:

```java
interface Formatavel {
    String formatar();
    
    // ✅ Método default
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}

public enum Cor implements Formatavel {
    VERMELHO("Vermelho");
    
    @Override
    public String formatar() {
        return nome;
    }
    
    // ✅ Herda formatarCompleto() automaticamente
}

Cor.VERMELHO.formatarCompleto(); // "[Vermelho]"
```

**Sobrescrever default**:

```java
// ✅ Sobrescrever se necessário
@Override
public String formatarCompleto() {
    return "*** " + formatar() + " ***";
}
```

**Constant-specific**:

```java
ATIVO {
    @Override
    public String formatarCompleto() {
        return "✅ " + formatar();
    }
},
INATIVO; // ✅ Usa default
```

**Regra de Ouro**: Métodos **default** fornecem implementação padrão. Enum **herda** automaticamente (não precisa implementar). Pode **sobrescrever** com @Override. Default pode chamar **métodos abstratos**. Útil para **métodos utilitários** e **compatibilidade** (adicionar método sem quebrar código). **Constant-specific** pode sobrescrever default individualmente.
