# T8.02 - Estender RuntimeException (Unchecked)

## Introdução

**Exceção unchecked personalizada**: estender `RuntimeException` (não obriga tratamento).

```java
/*
 * EXCEÇÃO UNCHECKED PERSONALIZADA
 * 
 * CRIAR:
 * public class MinhaExcecao extends RuntimeException {
 *     // Construtores
 * }
 * 
 * CARACTERÍSTICAS:
 *   - Estende RuntimeException (não Exception)
 *   - UNCHECKED: NÃO obriga try-catch ou throws
 *   - NÃO verificada em compilação
 *   - Usar para erros de PROGRAMAÇÃO
 */

// ✅ Exceção unchecked personalizada
public class ArgumentoInvalidoException extends RuntimeException {
    //                                      ↑
    //                             Estende RuntimeException
    
    public ArgumentoInvalidoException(String mensagem) {
        super(mensagem);
    }
}

// ✅ Usar (NÃO obriga tratamento)
public void dividir(int a, int b) {
    // NÃO precisa throws
    if (b == 0) {
        throw new ArgumentoInvalidoException("Divisor não pode ser zero");
    }
}
```

**Unchecked**: estender `RuntimeException` (não obriga **tratamento**).

---

## Fundamentos

### 1. Sintaxe Básica

```java
// ✅ Exceção unchecked básica
public class MinhaExcecao extends RuntimeException {
    //                         ↑
    //               Estende RuntimeException
    
    // Construtor vazio
    public MinhaExcecao() {
        super();
    }
    
    // Construtor com mensagem
    public MinhaExcecao(String mensagem) {
        super(mensagem);
    }
    
    // Construtor com causa
    public MinhaExcecao(Throwable causa) {
        super(causa);
    }
    
    // Construtor com mensagem + causa
    public MinhaExcecao(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}

/*
 * HIERARQUIA:
 * 
 * Throwable
 *   └─ Exception
 *        └─ RuntimeException
 *             └─ MinhaExcecao (unchecked)
 * 
 * NÃO estende Exception diretamente (seria checked)
 */
```

**Sintaxe**: `class MinhaExc extends RuntimeException`.

### 2. NÃO Obriga Tratamento

```java
// ✅ Exceção unchecked personalizada
public class EstadoInvalidoException extends RuntimeException {
    public EstadoInvalidoException(String msg) {
        super(msg);
    }
}

// ✅ Método que lança NÃO obriga throws
public void ativar() {
    // NÃO precisa throws na assinatura
    if (ativa) {
        throw new EstadoInvalidoException("Já está ativa");
    }
    ativa = true;
}

// ✅ Quem chama NÃO obriga tratar
public void usar1() {
    ativar();  // ✅ OK sem try-catch
}

public void usar2() {
    // ✅ try-catch OPCIONAL
    try {
        ativar();
    } catch (EstadoInvalidoException e) {
        System.err.println("Erro: " + e.getMessage());
    }
}

public void usar3() throws EstadoInvalidoException {
    // ✅ throws OPCIONAL (documentação)
    ativar();
}

private boolean ativa = false;

/*
 * UNCHECKED:
 *   ✅ throws OPCIONAL (quem lança)
 *   ✅ try-catch OPCIONAL (quem chama)
 *   ✅ Compila sem tratamento
 */
```

**Unchecked**: **não obriga** try-catch ou throws.

### 3. Quando Usar Unchecked

```java
// ✅ Erros de PROGRAMAÇÃO (unchecked)
public class CpfInvalidoException extends RuntimeException {
    public CpfInvalidoException(String msg) {
        super(msg);
    }
}

public class Usuario {
    private String cpf;
    
    // ✅ Unchecked: erro PROGRAMAÇÃO
    public void setCpf(String cpf) {
        // NÃO precisa throws
        if (cpf == null || cpf.length() != 11) {
            // Erro PROGRAMAÇÃO: desenvolvedor passou CPF inválido
            throw new CpfInvalidoException("CPF deve ter 11 dígitos");
        }
        this.cpf = cpf;
    }
}

// ✅ Usar: NÃO obriga tratar
public void criar() {
    Usuario u = new Usuario();
    u.setCpf("12345678901");  // OK sem try-catch
    
    // ❌ Desenvolvedor passou errado (bug)
    // u.setCpf(null);  // Lança CpfInvalidoException
}

/*
 * USAR UNCHECKED QUANDO:
 *   ✅ Erro de PROGRAMAÇÃO (bug)
 *   ✅ NÃO esperado em condições normais
 *   ✅ Desenvolvedor deveria evitar
 *   ✅ NÃO recuperável (corrigir código)
 * 
 * Exemplos:
 *   - Argumento null
 *   - Índice fora do intervalo
 *   - Estado inválido do objeto
 *   - Divisão por zero
 */
```

**Usar unchecked**: erros de **programação** (bugs).

### 4. Múltiplos Construtores

```java
// ✅ Exceção unchecked com múltiplos construtores
public class ConfiguracaoException extends RuntimeException {
    
    // ✅ Construtor vazio
    public ConfiguracaoException() {
        super();
    }
    
    // ✅ Construtor com mensagem
    public ConfiguracaoException(String mensagem) {
        super(mensagem);
    }
    
    // ✅ Construtor com causa
    public ConfiguracaoException(Throwable causa) {
        super(causa);
    }
    
    // ✅ Construtor com mensagem + causa
    public ConfiguracaoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
    
    // ✅ Construtor customizado
    public ConfiguracaoException(String chave, String valorEsperado, String valorRecebido) {
        super("Config '" + chave + "': esperado " + valorEsperado + ", recebido " + valorRecebido);
    }
}

// ✅ Usar cada construtor
public class Usar {
    
    public void metodo1() {
        throw new ConfiguracaoException();  // Vazio
    }
    
    public void metodo2() {
        throw new ConfiguracaoException("Config inválida");  // Mensagem
    }
    
    public void metodo3() {
        try {
            Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            throw new ConfiguracaoException(e);  // Causa
        }
    }
    
    public void metodo4() {
        try {
            Class.forName("com.example.Driver");
        } catch (ClassNotFoundException e) {
            throw new ConfiguracaoException("Driver não encontrado", e);  // Mensagem + causa
        }
    }
    
    public void metodo5() {
        throw new ConfiguracaoException("timeout", "30", "abc");  // Customizado
    }
}

/*
 * CONSTRUTORES PADRÃO:
 *   1. Vazio: ()
 *   2. Mensagem: (String)
 *   3. Causa: (Throwable)
 *   4. Mensagem + Causa: (String, Throwable)
 * 
 * + Construtores customizados
 */
```

**Construtores**: vazio, mensagem, causa, mensagem+causa.

### 5. Hierarquia de Exceções Unchecked

```java
// ✅ Exceção base unchecked
public class NegocioException extends RuntimeException {
    public NegocioException(String msg) {
        super(msg);
    }
    
    public NegocioException(String msg, Throwable causa) {
        super(msg, causa);
    }
}

// ✅ Exceções específicas
public class RegraVioladaException extends NegocioException {
    public RegraVioladaException(String msg) {
        super(msg);
    }
}

public class LimiteExcedidoException extends NegocioException {
    public LimiteExcedidoException(String msg) {
        super(msg);
    }
}

public class OperacaoNaoPermitidaException extends NegocioException {
    public OperacaoNaoPermitidaException(String msg) {
        super(msg);
    }
}

/*
 * HIERARQUIA:
 * 
 * RuntimeException
 *   └─ NegocioException (base)
 *        ├─ RegraVioladaException
 *        ├─ LimiteExcedidoException
 *        └─ OperacaoNaoPermitidaException
 * 
 * VANTAGEM:
 *   - Capturar TODAS: catch (NegocioException)
 *   - Capturar ESPECÍFICA: catch (LimiteExcedidoException)
 *   - NÃO obriga tratamento (unchecked)
 */

// ✅ Usar hierarquia
public class Conta {
    private double saldo;
    private double limite = 1000;
    
    public void sacar(double valor) {
        if (valor > limite) {
            throw new LimiteExcedidoException("Limite " + limite + " excedido");
        }
        if (valor > saldo) {
            throw new RegraVioladaException("Saldo insuficiente");
        }
        saldo -= valor;
    }
}

// ✅ Capturar hierarquia (OPCIONAL)
public void processar() {
    Conta c = new Conta();
    
    try {
        c.sacar(2000);
        
    } catch (LimiteExcedidoException e) {
        // Tratar específica
        System.err.println("Limite: " + e.getMessage());
        
    } catch (NegocioException e) {
        // Tratar outras
        System.err.println("Negócio: " + e.getMessage());
    }
}
```

**Hierarquia**: base + **específicas** (captura seletiva **opcional**).

### 6. Exceção com Dados Adicionais

```java
// ✅ Unchecked com atributos adicionais
public class LimiteExcedidoException extends RuntimeException {
    private final double valorTentado;
    private final double limiteMaximo;
    
    public LimiteExcedidoException(double valorTentado, double limiteMaximo) {
        super("Valor " + valorTentado + " excede limite " + limiteMaximo);
        this.valorTentado = valorTentado;
        this.limiteMaximo = limiteMaximo;
    }
    
    public double getValorTentado() {
        return valorTentado;
    }
    
    public double getLimiteMaximo() {
        return limiteMaximo;
    }
    
    public double getDiferenca() {
        return valorTentado - limiteMaximo;
    }
}

// ✅ Usar
public void sacar(double valor) {
    double limite = 1000;
    if (valor > limite) {
        throw new LimiteExcedidoException(valor, limite);
    }
}

// ✅ Capturar e usar dados (OPCIONAL)
public void processar() {
    try {
        sacar(1500);
        
    } catch (LimiteExcedidoException e) {
        System.err.println("Tentado: " + e.getValorTentado());
        System.err.println("Limite: " + e.getLimiteMaximo());
        System.err.println("Diferença: " + e.getDiferenca());
        
        /*
         * SAÍDA:
         * Tentado: 1500.0
         * Limite: 1000.0
         * Diferença: 500.0
         */
    }
}
```

**Dados adicionais**: atributos **extras** (valores, limites).

### 7. Unchecked vs Checked

```java
// ✅ UNCHECKED (RuntimeException)
public class ArgumentoNuloException extends RuntimeException {
    //                                   ↑
    //                           RuntimeException
    public ArgumentoNuloException(String msg) {
        super(msg);
    }
}

// ✅ CHECKED (Exception)
public class ArquivoNaoEncontradoException extends Exception {
    //                                          ↑
    //                                      Exception
    public ArquivoNaoEncontradoException(String msg) {
        super(msg);
    }
}

// ✅ Usar unchecked (NÃO obriga tratamento)
public void validar(String nome) {
    // NÃO precisa throws
    if (nome == null) {
        throw new ArgumentoNuloException("Nome não pode ser null");
    }
}

// ✅ Usar checked (OBRIGA tratamento)
public void ler(String arquivo) throws ArquivoNaoEncontradoException {
    //                              ↑
    //                         OBRIGATÓRIO
    if (!new File(arquivo).exists()) {
        throw new ArquivoNaoEncontradoException("Arquivo não existe");
    }
}

/*
 * DIFERENÇA:
 * 
 * RuntimeException (unchecked):
 *   - NÃO obriga throws na assinatura
 *   - NÃO obriga try-catch (quem chama)
 *   - Usar para erros PROGRAMAÇÃO
 *   - Exemplos: null, índice inválido, estado inválido
 * 
 * Exception (checked):
 *   - OBRIGA throws na assinatura
 *   - OBRIGA try-catch ou throws (quem chama)
 *   - Usar para erros RECUPERÁVEIS
 *   - Exemplos: arquivo não existe, conexão falhou
 */

// ✅ Quem chama
public void usar() {
    // Unchecked: NÃO obriga
    validar("João");  // OK sem try-catch
    
    // Checked: OBRIGA tratar
    try {
        ler("teste.txt");
    } catch (ArquivoNaoEncontradoException e) {
        // Tratar
    }
}
```

**RuntimeException**: unchecked (não obriga). **Exception**: checked (obriga).

### 8. Wrapper Checked → Unchecked

```java
// ✅ Wrapper: converter checked → unchecked
public class RepositorioException extends RuntimeException {
    //                                ↑
    //                          RuntimeException
    
    public RepositorioException(String msg, Throwable causa) {
        super(msg, causa);
    }
}

// ✅ Usar: encapsular checked em unchecked
public Usuario buscar(int id) {
    // NÃO declara throws (unchecked)
    try {
        // Operação que lança checked (SQLException)
        return buscarNoBanco(id);
        
    } catch (SQLException e) {
        // Encapsular checked em unchecked
        throw new RepositorioException("Erro ao buscar usuário " + id, e);
        //                                                              ↑
        //                                                          Preserva causa
    }
}

private Usuario buscarNoBanco(int id) throws SQLException {
    // Simular SQLException
    throw new SQLException("Erro banco");
}

/*
 * WRAPPER checked → unchecked:
 *   - Método NÃO declara throws
 *   - Lança RuntimeException com causa checked
 *   - Quem chama NÃO obrigado capturar
 *   - Útil quando não quer forçar tratamento
 */
```

**Wrapper**: encapsular checked em **unchecked**.

### 9. Exceções JDK Unchecked

```java
/*
 * EXCEÇÕES UNCHECKED DO JDK (herdam RuntimeException):
 * 
 * NullPointerException
 *   - Acesso a null
 * 
 * IllegalArgumentException
 *   - Argumento inválido
 * 
 * IllegalStateException
 *   - Estado inválido do objeto
 * 
 * IndexOutOfBoundsException
 *   - Índice fora do intervalo
 * 
 * ArithmeticException
 *   - Divisão por zero
 * 
 * NumberFormatException
 *   - Formato número inválido
 * 
 * UnsupportedOperationException
 *   - Operação não suportada
 * 
 * ClassCastException
 *   - Cast inválido
 * 
 * TODAS herdam RuntimeException (unchecked)
 */

// ✅ Customizar baseado em JDK
public class ParametroInvalidoException extends IllegalArgumentException {
    //                                          ↑
    //                              IllegalArgumentException (unchecked)
    
    public ParametroInvalidoException(String msg) {
        super(msg);
    }
}

// ✅ Usar
public void setIdade(int idade) {
    if (idade < 0 || idade > 150) {
        throw new ParametroInvalidoException("Idade deve estar entre 0 e 150");
    }
}
```

**JDK unchecked**: NullPointerException, IllegalArgumentException, etc.

### 10. Resumo Visual

```java
/*
 * EXCEÇÃO UNCHECKED PERSONALIZADA
 * 
 * CRIAR:
 * 
 * public class MinhaExcecao extends RuntimeException {
 *     //                         ↑
 *     //              Estende RuntimeException
 *     
 *     // Construtores padrão
 *     public MinhaExcecao() {
 *         super();
 *     }
 *     
 *     public MinhaExcecao(String mensagem) {
 *         super(mensagem);
 *     }
 *     
 *     public MinhaExcecao(Throwable causa) {
 *         super(causa);
 *     }
 *     
 *     public MinhaExcecao(String mensagem, Throwable causa) {
 *         super(mensagem, causa);
 *     }
 * }
 * 
 * 
 * USAR:
 * 
 * public void metodo() {
 *     // NÃO precisa throws
 *     throw new MinhaExcecao("Erro");
 * }
 * 
 * 
 * CHAMAR:
 * 
 * // Opção 1: sem try-catch (OK)
 * metodo();
 * 
 * // Opção 2: try-catch OPCIONAL
 * try {
 *     metodo();
 * } catch (MinhaExcecao e) {
 *     // Tratar
 * }
 * 
 * // Opção 3: throws OPCIONAL
 * public void chamar() throws MinhaExcecao {
 *     metodo();
 * }
 * 
 * 
 * HIERARQUIA:
 * 
 * RuntimeException
 *   └─ MinhaExcecao (unchecked)
 * 
 * NÃO:
 * Exception
 *   └─ MinhaExcecao (seria checked)
 * 
 * 
 * CARACTERÍSTICAS:
 * 
 * ✅ Estende RuntimeException
 * ✅ UNCHECKED (NÃO verificada compilação)
 * ✅ NÃO obriga throws na assinatura
 * ✅ NÃO obriga try-catch (quem chama)
 * ✅ Usar para erros de PROGRAMAÇÃO
 * 
 * 
 * QUANDO USAR:
 * 
 * ✅ Argumento null
 * ✅ Índice inválido
 * ✅ Estado inválido
 * ✅ Divisão por zero
 * ✅ Cast inválido
 * ✅ Operação não suportada
 * 
 * (Erros que desenvolvedor DEVERIA evitar)
 */

public class ExemploUnchecked extends RuntimeException {
    public ExemploUnchecked(String msg) {
        super(msg);
    }
}
```

---

## Aplicabilidade

**Unchecked personalizada**:
- Estender `RuntimeException`
- Erros de **programação**
- **Não obriga** tratamento

---

## Armadilhas

### 1. Estender Exception (Checked)

```java
// ❌ Queria unchecked mas estendeu Exception
public class MinhaExc extends Exception {
    // ❌ CHECKED (obriga tratamento)
}

// ✅ Unchecked
public class MinhaExc extends RuntimeException {
    // ✅ UNCHECKED (não obriga)
}
```

### 2. Usar Unchecked para Erros Recuperáveis

```java
// ❌ Unchecked para erro recuperável
public class ArquivoNaoEncontradoException extends RuntimeException {
    // ❌ Deveria ser checked (erro recuperável)
}

// ✅ Checked para erro recuperável
public class ArquivoNaoEncontradoException extends Exception {
    // ✅ Obriga tratamento (recuperável)
}
```

---

## Boas Práticas

### 1. Nome Terminar com "Exception"

```java
// ✅ Bom
public class ArgumentoInvalidoException extends RuntimeException { }

// ❌ Ruim
public class ArgumentoInvalido extends RuntimeException { }
```

### 2. Construtores Padrão

```java
// ✅ 4 construtores padrão
public class MinhaExc extends RuntimeException {
    public MinhaExc() { super(); }
    public MinhaExc(String msg) { super(msg); }
    public MinhaExc(Throwable causa) { super(causa); }
    public MinhaExc(String msg, Throwable causa) { super(msg, causa); }
}
```

### 3. Usar para Erros de Programação

```java
// ✅ Unchecked: erro programação
public class EstadoInvalidoException extends RuntimeException {
    // Desenvolvedor deveria prevenir
}

// ❌ Unchecked para erro recuperável
public class SaldoInsuficienteException extends RuntimeException {
    // ❌ Deveria ser checked (recuperável)
}
```

---

## Resumo

**Exceção unchecked personalizada**: estender `RuntimeException`.

**Sintaxe**:
```java
public class MinhaExc extends RuntimeException {
    // Construtores
}
```

**Características**:
- Estende `RuntimeException` (não Exception)
- **UNCHECKED**: não verificada em compilação
- **NÃO obriga** throws na assinatura
- **NÃO obriga** try-catch (quem chama)
- Usar para erros de **PROGRAMAÇÃO**

**Construtores padrão**:
1. Vazio: `()`
2. Mensagem: `(String)`
3. Causa: `(Throwable)`
4. Mensagem + Causa: `(String, Throwable)`

**Quando usar**:
- Argumento null
- Índice inválido
- Estado inválido do objeto
- Divisão por zero
- Cast inválido
- Erros que desenvolvedor **deveria evitar**

**Hierarquia**:
- Base genérica (NegocioException)
- Específicas (LimiteExcedidoException)
- Captura seletiva **opcional**

**Wrapper checked → unchecked**:
- Encapsular SQLException em RepositorioException
- Método não declara throws
- Quem chama não obrigado capturar

**vs Exception**:
- **RuntimeException**: unchecked, **não obriga**
- **Exception**: checked, **obriga** tratamento

**Exemplos JDK**:
- NullPointerException
- IllegalArgumentException
- IllegalStateException
- IndexOutOfBoundsException

**Regra de Ouro**: Estender `RuntimeException` para erros de **programação** que desenvolvedor **deveria evitar**. Incluir 4 construtores padrão. Nome terminar com "Exception". Usar **unchecked** para bugs/erros de código. Usar **checked** (Exception) para erros **recuperáveis** que usuário pode corrigir.

