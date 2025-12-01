# T8.06 - Segregação de Comportamento

## Introdução

**Segregação de comportamento**: separar funcionalidades em interfaces distintas.

```java
// ✅ Interfaces segregadas (focadas)
interface Executavel {
    void executar();
}

interface Reversivel {
    void reverter();
}

interface Validavel {
    boolean validar();
}

// ✅ Enum implementa apenas o necessário
public enum ComandoSimples implements Executavel {
    IMPRIMIR {
        @Override
        public void executar() {
            System.out.println("Imprimindo...");
        }
    }
}

public enum ComandoCompleto implements Executavel, Reversivel, Validavel {
    SALVAR {
        @Override
        public void executar() { /* salvar */ }
        
        @Override
        public void reverter() { /* reverter */ }
        
        @Override
        public boolean validar() { return true; }
    }
}
```

**ISP (Interface Segregation Principle)**: cliente não deve depender de métodos que não usa.

---

## Fundamentos

### 1. Interface Coesa vs Inchada

```java
// ❌ Interface inchada (muitos métodos)
interface Operacao {
    void executar();
    void reverter();
    boolean validar();
    String getLog();
    void notificar();
}

// ✅ Interfaces segregadas
interface Executavel {
    void executar();
}

interface Reversivel {
    void reverter();
}

interface Validavel {
    boolean validar();
}

interface Logavel {
    String getLog();
}

interface Notificavel {
    void notificar();
}
```

### 2. Enum Implementa Subconjunto

```java
interface Leitura {
    String ler();
}

interface Escrita {
    void escrever(String dados);
}

// ✅ Apenas leitura
public enum TipoLeitura implements Leitura {
    ARQUIVO {
        @Override
        public String ler() {
            return "Lendo arquivo...";
        }
    }
}

// ✅ Leitura e escrita
public enum TipoCompleto implements Leitura, Escrita {
    BANCO {
        @Override
        public String ler() {
            return "Lendo banco...";
        }
        
        @Override
        public void escrever(String dados) {
            System.out.println("Escrevendo: " + dados);
        }
    }
}
```

### 3. Segregação por Responsabilidade

```java
// ✅ Formatação
interface Formatavel {
    String formatar();
}

// ✅ Validação
interface Validavel {
    boolean validar();
}

// ✅ Cálculo
interface Calculavel {
    double calcular(double valor);
}

// ✅ Enum implementa apenas formatação e validação
public enum Status implements Formatavel, Validavel {
    ATIVO("Ativo");
    
    private final String nome;
    
    Status(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String formatar() {
        return "[" + nome + "]";
    }
    
    @Override
    public boolean validar() {
        return nome != null && !nome.isEmpty();
    }
}

// ✅ Enum implementa cálculo
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
}
```

### 4. Granularidade Fina

```java
// ✅ Interfaces pequenas e focadas
interface Nomeavel {
    String getNome();
}

interface Codigavel {
    int getCodigo();
}

interface Descritivel {
    String getDescricao();
}

// ✅ Enum implementa apenas o necessário
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
}

public enum Status implements Nomeavel, Codigavel, Descritivel {
    ATIVO("Ativo", 1, "Status ativo");
    
    private final String nome;
    private final int codigo;
    private final String descricao;
    
    Status(String nome, int codigo, String descricao) {
        this.nome = nome;
        this.codigo = codigo;
        this.descricao = descricao;
    }
    
    @Override
    public String getNome() { return nome; }
    
    @Override
    public int getCodigo() { return codigo; }
    
    @Override
    public String getDescricao() { return descricao; }
}
```

### 5. Composição de Comportamentos

```java
interface Ordenavel {
    int getOrdem();
}

interface Visivel {
    boolean isVisivel();
}

interface Habilitavel {
    boolean isHabilitado();
}

// ✅ Compor comportamentos conforme necessário
public enum MenuSimples implements Ordenavel {
    HOME(1);
    
    private final int ordem;
    
    MenuSimples(int ordem) {
        this.ordem = ordem;
    }
    
    @Override
    public int getOrdem() {
        return ordem;
    }
}

public enum MenuCompleto implements Ordenavel, Visivel, Habilitavel {
    ADMIN(1, true, true);
    
    private final int ordem;
    private final boolean visivel;
    private final boolean habilitado;
    
    MenuCompleto(int ordem, boolean visivel, boolean habilitado) {
        this.ordem = ordem;
        this.visivel = visivel;
        this.habilitado = habilitado;
    }
    
    @Override
    public int getOrdem() { return ordem; }
    
    @Override
    public boolean isVisivel() { return visivel; }
    
    @Override
    public boolean isHabilitado() { return habilitado; }
}
```

### 6. Evitar Métodos Não Utilizados

```java
// ❌ Interface com métodos não utilizados
interface Operacao {
    void executar();
    void desfazer();
    void refazer();
}

// ⚠️ Enum não usa desfazer/refazer
public enum Comando implements Operacao {
    IMPRIMIR {
        @Override
        public void executar() {
            System.out.println("Imprimir");
        }
        
        @Override
        public void desfazer() {
            // ⚠️ Não suportado
            throw new UnsupportedOperationException();
        }
        
        @Override
        public void refazer() {
            // ⚠️ Não suportado
            throw new UnsupportedOperationException();
        }
    }
}

// ✅ Segregar interfaces
interface Executavel {
    void executar();
}

interface Desfazivel {
    void desfazer();
}

interface Refazivel {
    void refazer();
}

// ✅ Implementar apenas executável
public enum Comando implements Executavel {
    IMPRIMIR {
        @Override
        public void executar() {
            System.out.println("Imprimir");
        }
    }
}
```

### 7. Polimorfismo Seletivo

```java
interface Formatavel {
    String formatar();
}

interface Serializavel {
    String serializar();
}

// ✅ Apenas formatável
public enum CorSimples implements Formatavel {
    VERMELHO;
    
    @Override
    public String formatar() {
        return name().toLowerCase();
    }
}

// ✅ Formatável e serializável
public enum CorCompleta implements Formatavel, Serializavel {
    VERDE("Verde", "#00FF00");
    
    private final String nome;
    private final String hex;
    
    CorCompleta(String nome, String hex) {
        this.nome = nome;
        this.hex = hex;
    }
    
    @Override
    public String formatar() {
        return nome;
    }
    
    @Override
    public String serializar() {
        return nome + ":" + hex;
    }
}

// ✅ Método aceita apenas Formatavel
public void processar(Formatavel f) {
    System.out.println(f.formatar());
}

processar(CorSimples.VERMELHO);  // OK
processar(CorCompleta.VERDE);    // OK
```

### 8. Hierarquia de Interfaces

```java
// ✅ Interface base
interface Base {
    String getId();
}

// ✅ Extensões focadas
interface Nomeavel extends Base {
    String getNome();
}

interface Descritivel extends Base {
    String getDescricao();
}

// ✅ Implementar apenas o necessário
public enum TipoSimples implements Base {
    TIPO1("T1");
    
    private final String id;
    
    TipoSimples(String id) {
        this.id = id;
    }
    
    @Override
    public String getId() {
        return id;
    }
}

public enum TipoCompleto implements Nomeavel, Descritivel {
    TIPO2("T2", "Tipo 2", "Descrição do tipo 2");
    
    private final String id;
    private final String nome;
    private final String descricao;
    
    TipoCompleto(String id, String nome, String descricao) {
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

### 9. Single Responsibility per Interface

```java
// ✅ Uma responsabilidade por interface
interface Auditavel {
    String getDataCriacao();
    String getUsuarioCriacao();
}

interface Versionavel {
    int getVersao();
}

interface Rastreavel {
    String getLog();
}

// ✅ Enum implementa apenas auditoria
public enum Documento implements Auditavel {
    CONTRATO("2024-01-01", "João");
    
    private final String dataCriacao;
    private final String usuarioCriacao;
    
    Documento(String dataCriacao, String usuarioCriacao) {
        this.dataCriacao = dataCriacao;
        this.usuarioCriacao = usuarioCriacao;
    }
    
    @Override
    public String getDataCriacao() { return dataCriacao; }
    
    @Override
    public String getUsuarioCriacao() { return usuarioCriacao; }
}
```

### 10. Testabilidade

```java
interface Executavel {
    void executar();
}

interface Validavel {
    boolean validar();
}

// ✅ Testar Executavel sem Validavel
public void testarExecucao(Executavel e) {
    e.executar();
    // validar execução
}

// ✅ Testar Validavel sem Executavel
public void testarValidacao(Validavel v) {
    boolean resultado = v.validar();
    // validar resultado
}

public enum Comando implements Executavel, Validavel {
    SALVAR {
        @Override
        public void executar() { }
        
        @Override
        public boolean validar() { return true; }
    }
}

// ✅ Testes independentes
testarExecucao(Comando.SALVAR);   // testa apenas execução
testarValidacao(Comando.SALVAR);  // testa apenas validação
```

---

## Aplicabilidade

**Segregação** para:
- Interface Segregation Principle (ISP)
- Evitar métodos não utilizados
- Flexibilidade de composição
- Testabilidade

---

## Armadilhas

### 1. Interface Inchada

```java
// ❌ Interface com muitos métodos
interface Tudo {
    void m1(); void m2(); void m3(); void m4(); void m5();
}

// ✅ Segregar
interface I1 { void m1(); void m2(); }
interface I2 { void m3(); }
interface I3 { void m4(); void m5(); }
```

### 2. UnsupportedOperationException

```java
// ❌ Método não suportado
@Override
public void reverter() {
    throw new UnsupportedOperationException();
}

// ✅ Não implementar interface
// Não implementa Reversivel
```

### 3. Muitas Interfaces Vazias

```java
// ⚠️ Muitas interfaces com 1 método
interface I1 { void m1(); }
interface I2 { void m2(); }
interface I3 { void m3(); }

// ✅ Considerar agrupar se relacionadas
interface Grupo { void m1(); void m2(); void m3(); }
```

---

## Boas Práticas

### 1. Interfaces Focadas

```java
// ✅ Interface com 1-3 métodos relacionados
interface Nomeavel {
    String getNome();
}
```

### 2. Implementar Apenas Necessário

```java
// ✅ Enum implementa apenas o que usa
public enum E implements Executavel {
    // não implementa Reversivel se não precisa
}
```

### 3. Composição Flexível

```java
// ✅ Compor comportamentos
public enum E1 implements I1 { }
public enum E2 implements I1, I2 { }
public enum E3 implements I1, I2, I3 { }
```

### 4. Documentar Segregação

```java
// ✅ Javadoc
/**
 * Comando simples que apenas executa.
 * Não suporta reverter ou refazer.
 */
public enum ComandoSimples implements Executavel {
    // ...
}
```

---

## Resumo

**Segregação de comportamento**:

```java
// ✅ Interfaces segregadas
interface Executavel { void executar(); }
interface Reversivel { void reverter(); }
interface Validavel { boolean validar(); }

// ✅ Enum implementa apenas necessário
public enum ComandoSimples implements Executavel {
    IMPRIMIR {
        @Override
        public void executar() { }
    }
}

public enum ComandoCompleto implements Executavel, Reversivel {
    SALVAR {
        @Override
        public void executar() { }
        
        @Override
        public void reverter() { }
    }
}
```

**Vantagens**:

```java
// 1. Flexibilidade
public enum E1 implements I1 { }
public enum E2 implements I1, I2 { }

// 2. Evitar métodos não suportados
// Não precisa UnsupportedOperationException

// 3. Testabilidade
void testar(Executavel e) { }    // testa apenas execução
void testar(Validavel v) { }     // testa apenas validação

// 4. Polimorfismo seletivo
void processar(Formatavel f) { } // aceita apenas formatáveis
```

**Regra de Ouro**: **Segregar** comportamentos em interfaces **focadas** (1-3 métodos relacionados). Enum implementa **apenas o necessário** (ISP). Evitar **UnsupportedOperationException** (não implementar interface se não usa). **Compor** comportamentos conforme necessidade. Interfaces **coesas** e **testáveis**.
