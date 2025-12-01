# T8.09 - Vantagens da Composição

## Introdução

**Composição**: combinar múltiplas interfaces em vez de herança de classe.

```java
// ✅ Composição via interfaces
interface Nomeavel {
    String getNome();
}

interface Descritivel {
    String getDescricao();
}

interface Validavel {
    boolean validar();
}

// ✅ Enum compõe comportamentos
public enum Status implements Nomeavel, Descritivel, Validavel {
    ATIVO("Ativo", "Status ativo do sistema");
    
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
    
    @Override
    public boolean validar() { return nome != null; }
}
```

**Favor composição sobre herança**: princípio de design orientado a objetos.

---

## Fundamentos

### 1. Flexibilidade de Combinação

```java
interface Executavel {
    void executar();
}

interface Reversivel {
    void reverter();
}

interface Logavel {
    String getLog();
}

// ✅ Enum 1: apenas executável
public enum ComandoSimples implements Executavel {
    IMPRIMIR {
        @Override
        public void executar() { }
    }
}

// ✅ Enum 2: executável + reversível
public enum ComandoMedio implements Executavel, Reversivel {
    SALVAR {
        @Override
        public void executar() { }
        
        @Override
        public void reverter() { }
    }
}

// ✅ Enum 3: todas as interfaces
public enum ComandoCompleto implements Executavel, Reversivel, Logavel {
    TRANSACAO {
        @Override
        public void executar() { }
        
        @Override
        public void reverter() { }
        
        @Override
        public String getLog() { return "log"; }
    }
}
```

### 2. Reutilização de Código

```java
interface Formatavel {
    String formatar();
    
    // ✅ Método default reutilizado
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}

interface Validavel {
    boolean validar();
    
    // ✅ Método default reutilizado
    default String validarComMensagem() {
        return validar() ? "Válido" : "Inválido";
    }
}

// ✅ Enum 1 reutiliza Formatavel
public enum Cor implements Formatavel {
    VERMELHO {
        @Override
        public String formatar() { return "Vermelho"; }
    }
}

// ✅ Enum 2 reutiliza ambas
public enum Status implements Formatavel, Validavel {
    ATIVO {
        @Override
        public String formatar() { return "Ativo"; }
        
        @Override
        public boolean validar() { return true; }
    }
}

// ✅ Ambos herdam métodos default
String completo1 = Cor.VERMELHO.formatarCompleto();        // "[Vermelho]"
String completo2 = Status.ATIVO.formatarCompleto();        // "[Ativo]"
String validacao = Status.ATIVO.validarComMensagem();      // "Válido"
```

### 3. Evita Acoplamento Rígido

```java
// ❌ Herança de classe (acoplamento rígido)
// Enum não pode estender classe
// public enum Status extends BaseStatus { } // Erro

// ✅ Composição via interface (acoplamento flexível)
interface Comportamento {
    void executar();
}

public enum Status implements Comportamento {
    ATIVO {
        @Override
        public void executar() { }
    }
}

// ✅ Trocar implementação facilmente
public enum OutroStatus implements Comportamento {
    PENDENTE {
        @Override
        public void executar() { }
    }
}
```

### 4. Múltiplos Contratos

```java
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

// ✅ Enum implementa múltiplos contratos
public enum Documento implements Auditavel, Versionavel, Rastreavel {
    CONTRATO("2024-01-01", "João", 1, "Log inicial");
    
    private final String dataCriacao;
    private final String usuarioCriacao;
    private final int versao;
    private final String log;
    
    Documento(String dataCriacao, String usuarioCriacao, int versao, String log) {
        this.dataCriacao = dataCriacao;
        this.usuarioCriacao = usuarioCriacao;
        this.versao = versao;
        this.log = log;
    }
    
    @Override
    public String getDataCriacao() { return dataCriacao; }
    
    @Override
    public String getUsuarioCriacao() { return usuarioCriacao; }
    
    @Override
    public int getVersao() { return versao; }
    
    @Override
    public String getLog() { return log; }
}

// ✅ Polimorfismo por qualquer contrato
Auditavel a = Documento.CONTRATO;
Versionavel v = Documento.CONTRATO;
Rastreavel r = Documento.CONTRATO;
```

### 5. Testabilidade

```java
interface Executavel {
    void executar();
}

interface Validavel {
    boolean validar();
}

// ✅ Enum implementa ambas
public enum Comando implements Executavel, Validavel {
    SALVAR {
        @Override
        public void executar() { }
        
        @Override
        public boolean validar() { return true; }
    }
}

// ✅ Testar apenas Executavel
public void testarExecucao(Executavel e) {
    e.executar();
    // validar execução
}

// ✅ Testar apenas Validavel
public void testarValidacao(Validavel v) {
    boolean resultado = v.validar();
    // validar resultado
}

// ✅ Testes focados
testarExecucao(Comando.SALVAR);   // testa só execução
testarValidacao(Comando.SALVAR);  // testa só validação
```

### 6. Segregação de Interface (ISP)

```java
// ✅ Interfaces pequenas e focadas
interface Leitura {
    String ler();
}

interface Escrita {
    void escrever(String dados);
}

// ✅ Enum 1: só leitura
public enum TipoLeitura implements Leitura {
    ARQUIVO {
        @Override
        public String ler() { return "lendo..."; }
    }
}

// ✅ Enum 2: leitura e escrita
public enum TipoCompleto implements Leitura, Escrita {
    BANCO {
        @Override
        public String ler() { return "lendo..."; }
        
        @Override
        public void escrever(String dados) { }
    }
}

// ✅ Método aceita apenas leitura
public void processar(Leitura l) {
    String dados = l.ler();
}

// ✅ Aceita ambos (composição flexível)
processar(TipoLeitura.ARQUIVO);
processar(TipoCompleto.BANCO);
```

### 7. Extensibilidade

```java
interface Formatavel {
    String formatar();
}

interface Serializavel {
    String serializar();
}

// ✅ Adicionar nova interface sem quebrar código existente
interface Exportavel {
    byte[] exportar();
}

// ✅ Enum antigo (ainda funciona)
public enum StatusAntigo implements Formatavel {
    ATIVO {
        @Override
        public String formatar() { return "Ativo"; }
    }
}

// ✅ Enum novo (compõe nova interface)
public enum StatusNovo implements Formatavel, Exportavel {
    ATIVO {
        @Override
        public String formatar() { return "Ativo"; }
        
        @Override
        public byte[] exportar() { return new byte[0]; }
    }
}
```

### 8. Polimorfismo Seletivo

```java
interface Calculavel {
    double calcular(double valor);
}

interface Formatavel {
    String formatar();
}

// ✅ Enum 1
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

// ✅ Enum 2
public enum Status implements Formatavel {
    ATIVO {
        @Override
        public String formatar() { return "Ativo"; }
    }
}

// ✅ Lista heterogênea via Calculavel
List<Calculavel> calculos = Arrays.asList(Desconto.VIP);

// ✅ Lista heterogênea via Formatavel
List<Formatavel> formatos = Arrays.asList(Status.ATIVO);

// ✅ Não precisa lista Object
```

### 9. Substituição de Implementação

```java
interface Processador {
    String processar(String entrada);
}

// ✅ Implementação 1
public enum ProcessadorV1 implements Processador {
    MAIUSCULA {
        @Override
        public String processar(String entrada) {
            return entrada.toUpperCase();
        }
    }
}

// ✅ Implementação 2 (nova versão)
public enum ProcessadorV2 implements Processador {
    MAIUSCULA {
        @Override
        public String processar(String entrada) {
            return entrada.toUpperCase().trim(); // ✅ Melhoria
        }
    }
}

// ✅ Método aceita interface (não enum específico)
public String aplicar(Processador p, String entrada) {
    return p.processar(entrada);
}

// ✅ Trocar implementação sem mudar método
aplicar(ProcessadorV1.MAIUSCULA, "teste");
aplicar(ProcessadorV2.MAIUSCULA, "teste"); // ✅ Substituição
```

### 10. Composição de Funcionalidades

```java
interface Identificavel {
    String getId();
}

interface Nomeavel {
    String getNome();
}

interface Descritivel {
    String getDescricao();
}

interface Formatavel {
    String formatar();
}

// ✅ Enum mínimo
public enum CategoriaSimples implements Identificavel {
    TEC("T1");
    
    private final String id;
    
    CategoriaSimples(String id) {
        this.id = id;
    }
    
    @Override
    public String getId() { return id; }
}

// ✅ Enum médio
public enum CategoriaMedio implements Identificavel, Nomeavel {
    TEC("T1", "Tecnologia");
    
    private final String id;
    private final String nome;
    
    CategoriaMedio(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }
    
    @Override
    public String getId() { return id; }
    
    @Override
    public String getNome() { return nome; }
}

// ✅ Enum completo
public enum CategoriaCompleta implements Identificavel, Nomeavel, Descritivel, Formatavel {
    TEC("T1", "Tecnologia", "Categoria de tecnologia");
    
    private final String id;
    private final String nome;
    private final String descricao;
    
    CategoriaCompleta(String id, String nome, String descricao) {
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
    
    @Override
    public String formatar() {
        return id + ": " + nome + " - " + descricao;
    }
}
```

---

## Aplicabilidade

**Composição** para:
- Flexibilidade de combinação
- Reutilização de código
- Testabilidade
- Extensibilidade

---

## Armadilhas

### 1. Muitas Interfaces

```java
// ⚠️ Muitas interfaces (difícil manter)
public enum E implements I1, I2, I3, I4, I5, I6, I7 { }

// ✅ Limitar 2-4 interfaces
public enum E implements I1, I2, I3 { }
```

### 2. Interfaces Inchadas

```java
// ❌ Interface com muitos métodos
interface Tudo {
    void m1(); void m2(); void m3(); void m4();
}

// ✅ Segregar
interface I1 { void m1(); }
interface I2 { void m2(); }
```

### 3. Duplicação de Código

```java
// ⚠️ Duplicação
public enum E1 implements I1 {
    C { public void m() { /* código */ } }
}

public enum E2 implements I1 {
    C { public void m() { /* mesmo código */ } }
}

// ✅ Método default na interface
interface I1 {
    default void m() { /* código */ }
}
```

---

## Boas Práticas

### 1. Interfaces Focadas

```java
// ✅ Interface pequena e coesa
interface Nomeavel {
    String getNome();
}
```

### 2. Métodos Default

```java
// ✅ Reutilizar com default
interface Formatavel {
    String formatar();
    
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}
```

### 3. Combinar Conforme Necessário

```java
// ✅ Enum simples
public enum E1 implements I1 { }

// ✅ Enum complexo
public enum E2 implements I1, I2, I3 { }
```

### 4. Polimorfismo

```java
// ✅ Aceitar interface (não enum)
public void processar(Formatavel f) {
    System.out.println(f.formatar());
}
```

---

## Resumo

**Vantagens da composição**:

```java
// ✅ Flexibilidade
public enum E1 implements I1 { }
public enum E2 implements I1, I2 { }
public enum E3 implements I1, I2, I3 { }

// ✅ Reutilização (métodos default)
interface I {
    String get();
    default String getCompleto() { return "[" + get() + "]"; }
}

// ✅ Testabilidade
void testar(I1 i) { } // testa apenas I1
void testar(I2 i) { } // testa apenas I2

// ✅ Polimorfismo
List<Formatavel> lista = Arrays.asList(Enum1.C, Enum2.C);

// ✅ Substituição
Processador p = ProcessadorV1.C; // versão 1
Processador p = ProcessadorV2.C; // versão 2
```

**Composição vs Herança**:

```java
// ❌ Herança (enum não pode)
// public enum E extends Classe { } // Erro

// ✅ Composição (enum pode)
public enum E implements I1, I2, I3 { }
```

**Regra de Ouro**: **Composição** permite combinar múltiplas interfaces. **Flexível** (escolher quais implementar). **Reutilizável** (métodos default). **Testável** (testar cada interface separadamente). **Extensível** (adicionar novas interfaces). **ISP** (Interface Segregation Principle). Preferir **interfaces focadas** (2-4 por enum).
