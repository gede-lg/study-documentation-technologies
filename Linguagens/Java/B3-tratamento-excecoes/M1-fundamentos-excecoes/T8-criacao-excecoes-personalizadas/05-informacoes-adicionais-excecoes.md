# T8.05 - Informações Adicionais em Exceções

## Introdução

**Informações adicionais**: atributos **extras** além de mensagem/causa.

```java
/*
 * INFORMAÇÕES ADICIONAIS
 * 
 * ALÉM DE:
 *   - getMessage()
 *   - getCause()
 * 
 * ADICIONAR:
 *   - Código de erro
 *   - Campo inválido
 *   - Valor recebido
 *   - Valor esperado
 *   - Timestamp
 *   - Dados de contexto
 * 
 * COMO:
 *   - Atributos private final
 *   - Getters públicos
 *   - Passar no construtor
 */

// ✅ Exceção com informações adicionais
public class ValidationException extends Exception {
    private final String campo;
    private final Object valorInvalido;
    
    public ValidationException(String msg, String campo, Object valor) {
        super(msg);
        this.campo = campo;
        this.valorInvalido = valor;
    }
    
    public String getCampo() { return campo; }
    public Object getValorInvalido() { return valorInvalido; }
}
```

**Informações adicionais**: atributos **final** + getters.

---

## Fundamentos

### 1. Atributos Básicos

```java
// ✅ Exceção com código de erro
public class ErrorCodeException extends Exception {
    private final int codigoErro;
    
    public ErrorCodeException(String msg, int codigoErro) {
        super(msg);
        this.codigoErro = codigoErro;
    }
    
    public int getCodigoErro() {
        return codigoErro;
    }
}

// ✅ Usar
public void processar() throws ErrorCodeException {
    throw new ErrorCodeException("Erro de validação", 400);
}

// ✅ Capturar e acessar
public void usar() {
    try {
        processar();
    } catch (ErrorCodeException e) {
        System.out.println("Código: " + e.getCodigoErro());  // 400
        System.out.println("Mensagem: " + e.getMessage());    // "Erro de validação"
    }
}

/*
 * ATRIBUTOS:
 *   - private final (imutável)
 *   - Getter público
 *   - Passar no construtor
 */
```

**Atributo**: `private final` + getter **público**.

### 2. Múltiplos Atributos

```java
// ✅ Exceção com múltiplos atributos
public class ValidationException extends Exception {
    private final String campo;
    private final Object valorRecebido;
    private final Object valorEsperado;
    private final String tipo;
    
    public ValidationException(String msg, String campo, 
                               Object valorRecebido, Object valorEsperado, String tipo) {
        super(msg);
        this.campo = campo;
        this.valorRecebido = valorRecebido;
        this.valorEsperado = valorEsperado;
        this.tipo = tipo;
    }
    
    public String getCampo() { return campo; }
    public Object getValorRecebido() { return valorRecebido; }
    public Object getValorEsperado() { return valorEsperado; }
    public String getTipo() { return tipo; }
}

// ✅ Usar
public void validarIdade(int idade) throws ValidationException {
    if (idade < 0 || idade > 150) {
        throw new ValidationException(
            "Idade fora do intervalo permitido",
            "idade",
            idade,
            "0-150",
            "RANGE_VALIDATION"
        );
    }
}

// ✅ Acessar todos atributos
public void processar() {
    try {
        validarIdade(200);
    } catch (ValidationException e) {
        System.out.println("Campo: " + e.getCampo());                // "idade"
        System.out.println("Recebido: " + e.getValorRecebido());     // 200
        System.out.println("Esperado: " + e.getValorEsperado());     // "0-150"
        System.out.println("Tipo: " + e.getTipo());                  // "RANGE_VALIDATION"
    }
}
```

**Múltiplos**: vários atributos com **getters**.

### 3. Coleções como Atributos

```java
// ✅ Exceção com lista de erros
public class MultiValidationException extends Exception {
    private final List<String> erros;
    
    public MultiValidationException(String msg, List<String> erros) {
        super(msg);
        this.erros = new ArrayList<>(erros);  // Cópia defensiva
    }
    
    public List<String> getErros() {
        return Collections.unmodifiableList(erros);  // Imutável
    }
    
    public int getQuantidadeErros() {
        return erros.size();
    }
}

// ✅ Usar
public void validar(Usuario usuario) throws MultiValidationException {
    List<String> erros = new ArrayList<>();
    
    if (usuario.getNome() == null || usuario.getNome().isEmpty()) {
        erros.add("Nome não pode ser vazio");
    }
    
    if (usuario.getEmail() == null || !usuario.getEmail().contains("@")) {
        erros.add("Email inválido");
    }
    
    if (usuario.getIdade() < 18) {
        erros.add("Idade deve ser >= 18");
    }
    
    if (!erros.isEmpty()) {
        throw new MultiValidationException(
            "Validação falhou com " + erros.size() + " erro(s)",
            erros
        );
    }
}

// ✅ Acessar erros
public void processar() {
    try {
        validar(new Usuario(null, "email", 10));
    } catch (MultiValidationException e) {
        System.out.println("Quantidade: " + e.getQuantidadeErros());
        for (String erro : e.getErros()) {
            System.out.println("  - " + erro);
        }
    }
}

/*
 * COLEÇÕES:
 *   - Cópia defensiva no construtor
 *   - Retornar imutável (unmodifiableList)
 *   - Evitar modificação externa
 */
```

**Coleções**: cópia **defensiva** + retornar **imutável**.

### 4. Timestamp e Contexto

```java
// ✅ Exceção com timestamp e contexto
public class AuditException extends Exception {
    private final Instant timestamp;
    private final String usuario;
    private final String operacao;
    private final Map<String, Object> contexto;
    
    public AuditException(String msg, String usuario, String operacao) {
        super(msg);
        this.timestamp = Instant.now();
        this.usuario = usuario;
        this.operacao = operacao;
        this.contexto = new HashMap<>();
    }
    
    public void adicionarContexto(String chave, Object valor) {
        contexto.put(chave, valor);
    }
    
    public Instant getTimestamp() { return timestamp; }
    public String getUsuario() { return usuario; }
    public String getOperacao() { return operacao; }
    public Map<String, Object> getContexto() {
        return Collections.unmodifiableMap(contexto);
    }
}

// ✅ Usar
public void executar(String usuario) throws AuditException {
    AuditException e = new AuditException(
        "Operação não autorizada",
        usuario,
        "DELETE_USER"
    );
    e.adicionarContexto("userId", 123);
    e.adicionarContexto("ip", "192.168.1.1");
    throw e;
}

// ✅ Acessar contexto
public void processar() {
    try {
        executar("admin");
    } catch (AuditException e) {
        System.out.println("Quando: " + e.getTimestamp());
        System.out.println("Quem: " + e.getUsuario());
        System.out.println("O quê: " + e.getOperacao());
        System.out.println("Contexto: " + e.getContexto());
    }
}
```

**Timestamp**: `Instant.now()`. **Contexto**: Map<String, Object>.

### 5. Valores Numéricos

```java
// ✅ Exceção com valores numéricos
public class LimiteExcedidoException extends RuntimeException {
    private final double valorTentado;
    private final double limiteMaximo;
    private final double limiteMinimo;
    
    public LimiteExcedidoException(double valorTentado, double limiteMin, double limiteMax) {
        super(String.format(
            "Valor %.2f fora do intervalo [%.2f, %.2f]",
            valorTentado, limiteMin, limiteMax
        ));
        this.valorTentado = valorTentado;
        this.limiteMinimo = limiteMin;
        this.limiteMaximo = limiteMax;
    }
    
    public double getValorTentado() { return valorTentado; }
    public double getLimiteMaximo() { return limiteMaximo; }
    public double getLimiteMinimo() { return limiteMinimo; }
    
    public double getDiferenca() {
        if (valorTentado > limiteMaximo) {
            return valorTentado - limiteMaximo;
        } else if (valorTentado < limiteMinimo) {
            return limiteMinimo - valorTentado;
        }
        return 0;
    }
    
    public boolean isAcima() {
        return valorTentado > limiteMaximo;
    }
    
    public boolean isAbaixo() {
        return valorTentado < limiteMinimo;
    }
}

// ✅ Usar
public void validar(double valor) {
    if (valor < 0 || valor > 100) {
        throw new LimiteExcedidoException(valor, 0, 100);
    }
}

// ✅ Acessar valores e métodos auxiliares
public void processar() {
    try {
        validar(150);
    } catch (LimiteExcedidoException e) {
        System.out.println("Tentado: " + e.getValorTentado());      // 150
        System.out.println("Mín/Máx: " + e.getLimiteMinimo() + 
                          "/" + e.getLimiteMaximo());               // 0/100
        System.out.println("Diferença: " + e.getDiferenca());       // 50
        System.out.println("Acima? " + e.isAcima());                // true
    }
}
```

**Numéricos**: valores + métodos **auxiliares** (diferença, isAcima).

### 6. Enums para Tipos

```java
// ✅ Enum para categorizar erros
public enum TipoErro {
    VALIDACAO,
    AUTORIZACAO,
    NAO_ENCONTRADO,
    CONFLITO,
    SERVIDOR
}

// ✅ Exceção com enum
public class BusinessException extends RuntimeException {
    private final TipoErro tipo;
    private final int codigoHttp;
    
    public BusinessException(String msg, TipoErro tipo, int codigoHttp) {
        super(msg);
        this.tipo = tipo;
        this.codigoHttp = codigoHttp;
    }
    
    public TipoErro getTipo() { return tipo; }
    public int getCodigoHttp() { return codigoHttp; }
}

// ✅ Usar
public void validar(String email) {
    if (email == null || !email.contains("@")) {
        throw new BusinessException(
            "Email inválido",
            TipoErro.VALIDACAO,
            400
        );
    }
}

public void autorizar(String usuario) {
    if (!usuario.equals("admin")) {
        throw new BusinessException(
            "Sem permissão",
            TipoErro.AUTORIZACAO,
            403
        );
    }
}

// ✅ Processar por tipo
public void processar() {
    try {
        validar("email");
    } catch (BusinessException e) {
        switch (e.getTipo()) {
            case VALIDACAO:
                System.out.println("Erro validação: " + e.getMessage());
                break;
            case AUTORIZACAO:
                System.out.println("Sem permissão: " + e.getMessage());
                break;
            default:
                System.out.println("Erro: " + e.getMessage());
        }
    }
}
```

**Enum**: categorizar **tipos** de erro (type-safe).

### 7. Objetos Complexos

```java
// ✅ Exceção com objeto complexo
public class UsuarioNaoEncontradoException extends Exception {
    private final Criterio criterio;
    
    public UsuarioNaoEncontradoException(String msg, Criterio criterio) {
        super(msg);
        this.criterio = criterio;
    }
    
    public Criterio getCriterio() {
        return criterio;
    }
    
    // Classe interna para critério de busca
    public static class Criterio {
        private final String campo;
        private final Object valor;
        
        public Criterio(String campo, Object valor) {
            this.campo = campo;
            this.valor = valor;
        }
        
        public String getCampo() { return campo; }
        public Object getValor() { return valor; }
        
        @Override
        public String toString() {
            return campo + " = " + valor;
        }
    }
}

// ✅ Usar
public void buscar(int id) throws UsuarioNaoEncontradoException {
    throw new UsuarioNaoEncontradoException(
        "Usuário não encontrado",
        new UsuarioNaoEncontradoException.Criterio("id", id)
    );
}

// ✅ Acessar objeto complexo
public void processar() {
    try {
        buscar(123);
    } catch (UsuarioNaoEncontradoException e) {
        System.out.println("Campo: " + e.getCriterio().getCampo());  // "id"
        System.out.println("Valor: " + e.getCriterio().getValor());  // 123
    }
}
```

**Objeto complexo**: classe **interna** para agrupar dados.

### 8. Métodos Auxiliares

```java
// ✅ Exceção com métodos auxiliares
public class SaldoInsuficienteException extends Exception {
    private final double saldoAtual;
    private final double valorSolicitado;
    
    public SaldoInsuficienteException(double saldoAtual, double valorSolicitado) {
        super(criarMensagem(saldoAtual, valorSolicitado));
        this.saldoAtual = saldoAtual;
        this.valorSolicitado = valorSolicitado;
    }
    
    private static String criarMensagem(double saldo, double valor) {
        return String.format(
            "Saldo insuficiente. Disponível: R$ %.2f, Solicitado: R$ %.2f, Falta: R$ %.2f",
            saldo, valor, valor - saldo
        );
    }
    
    public double getSaldoAtual() { return saldoAtual; }
    public double getValorSolicitado() { return valorSolicitado; }
    
    // ✅ Métodos auxiliares
    public double getFalta() {
        return valorSolicitado - saldoAtual;
    }
    
    public double getPercentualDisponivel() {
        return (saldoAtual / valorSolicitado) * 100;
    }
    
    public boolean isPequenaDiferenca() {
        return getFalta() <= 10;  // Menos de R$ 10
    }
}

// ✅ Usar métodos auxiliares
public void processar() {
    try {
        throw new SaldoInsuficienteException(95, 100);
    } catch (SaldoInsuficienteException e) {
        System.out.println("Falta: R$ " + e.getFalta());                   // 5.0
        System.out.println("Disponível: " + e.getPercentualDisponivel() + "%");  // 95%
        
        if (e.isPequenaDiferenca()) {
            System.out.println("Diferença pequena - oferecer crédito");
        }
    }
}
```

**Auxiliares**: métodos **calculados** a partir de atributos.

### 9. Serialização de Atributos

```java
// ✅ Exceção serializável com atributos
public class CustomException extends Exception {
    private static final long serialVersionUID = 1L;
    
    private final int codigo;
    private final String categoria;
    // Não serializável por padrão
    private final transient Logger logger = Logger.getLogger("App");
    
    public CustomException(String msg, int codigo, String categoria) {
        super(msg);
        this.codigo = codigo;
        this.categoria = categoria;
    }
    
    public int getCodigo() { return codigo; }
    public String getCategoria() { return categoria; }
}

/*
 * SERIALIZAÇÃO:
 *   - serialVersionUID: controle versão
 *   - Atributos serializáveis automaticamente
 *   - transient: não serializar (Logger, Streams)
 */
```

**Serialização**: serialVersionUID + **transient** (não serializar).

### 10. Resumo Visual

```java
/*
 * INFORMAÇÕES ADICIONAIS EM EXCEÇÕES
 * 
 * ESTRUTURA:
 * 
 * public class MinhaExcecao extends Exception {
 *     
 *     // Atributos: private final
 *     private final String campo;
 *     private final Object valor;
 *     private final int codigo;
 *     
 *     // Construtor: receber atributos
 *     public MinhaExcecao(String msg, String campo, Object valor, int codigo) {
 *         super(msg);
 *         this.campo = campo;
 *         this.valor = valor;
 *         this.codigo = codigo;
 *     }
 *     
 *     // Getters: públicos
 *     public String getCampo() { return campo; }
 *     public Object getValor() { return valor; }
 *     public int getCodigo() { return codigo; }
 *     
 *     // Métodos auxiliares
 *     public boolean isErroGrave() {
 *         return codigo >= 500;
 *     }
 * }
 * 
 * 
 * TIPOS DE ATRIBUTOS:
 * 
 * 1. Simples:
 *    - int codigo
 *    - String campo
 *    - double valor
 * 
 * 2. Coleções:
 *    - List<String> erros
 *    - Map<String, Object> contexto
 *    - Cópia defensiva no construtor
 *    - Retornar imutável (unmodifiableList)
 * 
 * 3. Enums:
 *    - TipoErro tipo
 *    - Severidade severidade
 * 
 * 4. Objetos:
 *    - Criterio criterio
 *    - Usuario usuario
 * 
 * 5. Timestamp:
 *    - Instant timestamp
 *    - LocalDateTime dataHora
 * 
 * 
 * BOAS PRÁTICAS:
 * 
 * ✅ private final (imutável)
 * ✅ Getters públicos
 * ✅ Passar no construtor
 * ✅ Cópia defensiva (coleções)
 * ✅ Retornar imutável
 * ✅ Métodos auxiliares
 * ✅ Enum para tipos
 * ✅ serialVersionUID
 * 
 * 
 * EXEMPLO COMPLETO:
 * 
 * public class ValidationException extends Exception {
 *     private final String campo;
 *     private final Object valorRecebido;
 *     private final Object valorEsperado;
 *     private final TipoValidacao tipo;
 *     private final Instant timestamp;
 *     
 *     public ValidationException(String msg, String campo, 
 *                                Object recebido, Object esperado, TipoValidacao tipo) {
 *         super(msg);
 *         this.campo = campo;
 *         this.valorRecebido = recebido;
 *         this.valorEsperado = esperado;
 *         this.tipo = tipo;
 *         this.timestamp = Instant.now();
 *     }
 *     
 *     public String getCampo() { return campo; }
 *     public Object getValorRecebido() { return valorRecebido; }
 *     public Object getValorEsperado() { return valorEsperado; }
 *     public TipoValidacao getTipo() { return tipo; }
 *     public Instant getTimestamp() { return timestamp; }
 *     
 *     public boolean isErroGrave() {
 *         return tipo == TipoValidacao.OBRIGATORIO;
 *     }
 * }
 * 
 * enum TipoValidacao {
 *     OBRIGATORIO, FORMATO, INTERVALO
 * }
 */

public class ExemploInformacoesAdicionais extends Exception {
    private final String campo;
    private final Object valor;
    
    public ExemploInformacoesAdicionais(String msg, String campo, Object valor) {
        super(msg);
        this.campo = campo;
        this.valor = valor;
    }
    
    public String getCampo() { return campo; }
    public Object getValor() { return valor; }
}
```

---

## Aplicabilidade

**Informações adicionais**:
- Atributos `private final`
- Getters **públicos**
- Métodos **auxiliares**

---

## Armadilhas

### 1. Atributos Mutáveis

```java
// ❌ Mutável (public)
public class MinhaExc extends Exception {
    public String campo;  // ❌ Pode modificar
}

// ✅ Imutável (private final + getter)
public class MinhaExc extends Exception {
    private final String campo;
    public String getCampo() { return campo; }
}
```

### 2. Coleção Sem Cópia Defensiva

```java
// ❌ Sem cópia defensiva
public class MinhaExc extends Exception {
    private final List<String> erros;
    
    public MinhaExc(List<String> erros) {
        super("");
        this.erros = erros;  // ❌ Referência externa pode modificar
    }
}

// ✅ Com cópia defensiva
public class MinhaExc extends Exception {
    private final List<String> erros;
    
    public MinhaExc(List<String> erros) {
        super("");
        this.erros = new ArrayList<>(erros);  // ✅ Cópia
    }
    
    public List<String> getErros() {
        return Collections.unmodifiableList(erros);  // ✅ Imutável
    }
}
```

---

## Boas Práticas

### 1. Atributos Imutáveis

```java
// ✅ private final
private final String campo;
private final Object valor;
```

### 2. Cópia Defensiva

```java
// ✅ Cópia no construtor + imutável no getter
public MinhaExc(List<String> erros) {
    this.erros = new ArrayList<>(erros);
}

public List<String> getErros() {
    return Collections.unmodifiableList(erros);
}
```

### 3. Métodos Auxiliares

```java
// ✅ Métodos calculados
public double getFalta() {
    return valorSolicitado - saldoAtual;
}
```

---

## Resumo

**Informações adicionais**: atributos **extras** além de mensagem/causa.

**Estrutura**:
- Atributos: `private final`
- Getters: públicos
- Construtor: receber atributos
- Métodos auxiliares: calculados

**Tipos**:
- **Simples**: int, String, double
- **Coleções**: List, Map (cópia defensiva)
- **Enums**: TipoErro, Severidade
- **Objetos**: Criterio, Usuario
- **Timestamp**: Instant, LocalDateTime

**Coleções**:
- Cópia **defensiva** no construtor
- Retornar **imutável** (unmodifiableList)
- Evitar modificação externa

**Enums**:
- Categorizar tipos de erro
- Type-safe
- Switch por tipo

**Métodos auxiliares**:
- Calcular diferença
- Verificar condições
- Formatar valores

**Serialização**:
- serialVersionUID
- Atributos serializados automaticamente
- **transient** para não serializar

**Regra de Ouro**: Atributos `private final` (imutáveis). Getters públicos. Passar no construtor. Coleções: cópia **defensiva** + retornar **imutável**. Usar Enum para tipos (type-safe). Timestamp `Instant.now()`. Métodos **auxiliares** para cálculos. serialVersionUID para controle versão. Não serializar (transient) objetos não serializáveis.

