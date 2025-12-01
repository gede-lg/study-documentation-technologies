# T8.01 - Estender Exception (Checked)

## Introdução

**Exceção checked personalizada**: estender `Exception` (obriga tratamento).

```java
/*
 * EXCEÇÃO CHECKED PERSONALIZADA
 * 
 * CRIAR:
 * public class MinhaExcecao extends Exception {
 *     // Construtores
 * }
 * 
 * CARACTERÍSTICAS:
 *   - Estende Exception (não RuntimeException)
 *   - CHECKED: obriga try-catch ou throws
 *   - Verificada em tempo de compilação
 *   - Usar para erros RECUPERÁVEIS
 */

// ✅ Exceção checked personalizada
public class ContaInativaException extends Exception {
    //                             ↑
    //                     Estende Exception
    
    public ContaInativaException(String mensagem) {
        super(mensagem);
    }
}

// ✅ Usar (OBRIGA tratamento)
public void sacar(double valor) throws ContaInativaException {
    //                              ↑
    //                         Obriga throws
    if (!ativa) {
        throw new ContaInativaException("Conta inativa");
    }
}
```

**Checked**: estender `Exception` (obriga **tratamento**).

---

## Fundamentos

### 1. Sintaxe Básica

```java
// ✅ Exceção checked básica
public class MinhaExcecao extends Exception {
    //                         ↑
    //                   Estende Exception
    
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
 *        └─ MinhaExcecao (checked)
 * 
 * NÃO estende RuntimeException (seria unchecked)
 */
```

**Sintaxe**: `class MinhaExc extends Exception`.

### 2. Obrigatoriedade de Tratamento

```java
// ✅ Exceção checked personalizada
public class ConexaoException extends Exception {
    public ConexaoException(String msg) {
        super(msg);
    }
}

// ✅ Método que lança OBRIGA throws
public void conectar() throws ConexaoException {
    //                    ↑
    //              OBRIGATÓRIO
    throw new ConexaoException("Falha conexão");
}

// ✅ Quem chama OBRIGA tratar ou propagar
public void usar1() {
    try {
        conectar();  // ✅ Try-catch
    } catch (ConexaoException e) {
        System.err.println("Erro: " + e.getMessage());
    }
}

public void usar2() throws ConexaoException {
    conectar();  // ✅ Propaga
}

// ❌ ERRO: sem try-catch ou throws
// public void usar3() {
//     conectar();  // ❌ ERRO: unhandled exception
// }

/*
 * CHECKED:
 *   ✅ throws OBRIGATÓRIO (quem lança)
 *   ✅ try-catch OU throws OBRIGATÓRIO (quem chama)
 *   ❌ ERRO compilação sem tratamento
 */
```

**Checked**: **obriga** try-catch ou throws.

### 3. Quando Usar Checked

```java
// ✅ Erros RECUPERÁVEIS (checked)
public class SaldoInsuficienteException extends Exception {
    public SaldoInsuficienteException(String msg) {
        super(msg);
    }
}

public class Conta {
    private double saldo;
    
    // ✅ Checked: erro RECUPERÁVEL
    public void sacar(double valor) throws SaldoInsuficienteException {
        if (valor > saldo) {
            // Erro RECUPERÁVEL: usuário pode depositar
            throw new SaldoInsuficienteException(
                "Saldo " + saldo + " insuficiente para sacar " + valor
            );
        }
        saldo -= valor;
    }
}

// ✅ Usar: TRATAR erro
public void transferir(Conta origem, Conta destino, double valor) {
    try {
        origem.sacar(valor);
        destino.depositar(valor);
        
    } catch (SaldoInsuficienteException e) {
        // RECUPERAR: cancelar transferência
        System.err.println("Transferência cancelada: " + e.getMessage());
        System.err.println("Deposite antes de sacar");
    }
}

/*
 * USAR CHECKED QUANDO:
 *   ✅ Erro RECUPERÁVEL (usuário pode corrigir)
 *   ✅ Esperado em condições normais
 *   ✅ Quem chama DEVE tratar
 * 
 * Exemplos:
 *   - Arquivo não encontrado (usuário fornece outro)
 *   - Saldo insuficiente (usuário deposita)
 *   - Conexão falhou (tentar novamente)
 */
```

**Usar checked**: erros **recuperáveis**.

### 4. Múltiplos Construtores

```java
// ✅ Exceção com múltiplos construtores
public class ProcessamentoException extends Exception {
    
    // ✅ Construtor vazio
    public ProcessamentoException() {
        super();
    }
    
    // ✅ Construtor com mensagem
    public ProcessamentoException(String mensagem) {
        super(mensagem);
    }
    
    // ✅ Construtor com causa
    public ProcessamentoException(Throwable causa) {
        super(causa);
    }
    
    // ✅ Construtor com mensagem + causa
    public ProcessamentoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
    
    // ✅ Construtor customizado
    public ProcessamentoException(String mensagem, int codigo) {
        super(mensagem + " (código: " + codigo + ")");
    }
}

// ✅ Usar cada construtor
public class Usar {
    
    public void metodo1() throws ProcessamentoException {
        throw new ProcessamentoException();  // Vazio
    }
    
    public void metodo2() throws ProcessamentoException {
        throw new ProcessamentoException("Erro processamento");  // Mensagem
    }
    
    public void metodo3() throws ProcessamentoException {
        try {
            throw new IOException("Erro I/O");
        } catch (IOException e) {
            throw new ProcessamentoException(e);  // Causa
        }
    }
    
    public void metodo4() throws ProcessamentoException {
        try {
            throw new SQLException("Erro SQL");
        } catch (SQLException e) {
            throw new ProcessamentoException("Falha banco", e);  // Mensagem + causa
        }
    }
    
    public void metodo5() throws ProcessamentoException {
        throw new ProcessamentoException("Erro validação", 400);  // Customizado
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

### 5. Hierarquia de Exceções Personalizadas

```java
// ✅ Exceção base
public class RepositorioException extends Exception {
    public RepositorioException(String msg) {
        super(msg);
    }
    
    public RepositorioException(String msg, Throwable causa) {
        super(msg, causa);
    }
}

// ✅ Exceções específicas
public class EntidadeNaoEncontradaException extends RepositorioException {
    public EntidadeNaoEncontradaException(String msg) {
        super(msg);
    }
}

public class EntidadeDuplicadaException extends RepositorioException {
    public EntidadeDuplicadaException(String msg) {
        super(msg);
    }
}

public class ConexaoRepositorioException extends RepositorioException {
    public ConexaoRepositorioException(String msg, Throwable causa) {
        super(msg, causa);
    }
}

/*
 * HIERARQUIA:
 * 
 * Exception
 *   └─ RepositorioException (base)
 *        ├─ EntidadeNaoEncontradaException
 *        ├─ EntidadeDuplicadaException
 *        └─ ConexaoRepositorioException
 * 
 * VANTAGEM:
 *   - Capturar TODAS: catch (RepositorioException)
 *   - Capturar ESPECÍFICA: catch (EntidadeNaoEncontradaException)
 */

// ✅ Usar hierarquia
public class UsuarioRepositorio {
    
    public Usuario buscar(int id) throws EntidadeNaoEncontradaException {
        // buscar
        throw new EntidadeNaoEncontradaException("Usuário " + id + " não encontrado");
    }
    
    public void salvar(Usuario u) throws EntidadeDuplicadaException {
        // verificar duplicado
        throw new EntidadeDuplicadaException("Usuário já existe");
    }
}

// ✅ Capturar hierarquia
public void processar(int id) {
    UsuarioRepositorio repo = new UsuarioRepositorio();
    
    try {
        Usuario u = repo.buscar(id);
        
    } catch (EntidadeNaoEncontradaException e) {
        // Tratar específica
        System.err.println("Não encontrado: " + e.getMessage());
        
    } catch (RepositorioException e) {
        // Tratar outras
        System.err.println("Erro repositório: " + e.getMessage());
    }
}
```

**Hierarquia**: base + **específicas** (captura seletiva).

### 6. Exceção com Dados Adicionais

```java
// ✅ Exceção com atributos adicionais
public class ValidacaoException extends Exception {
    private final String campo;
    private final Object valorInvalido;
    
    public ValidacaoException(String mensagem, String campo, Object valor) {
        super(mensagem);
        this.campo = campo;
        this.valorInvalido = valor;
    }
    
    public String getCampo() {
        return campo;
    }
    
    public Object getValorInvalido() {
        return valorInvalido;
    }
    
    @Override
    public String toString() {
        return "ValidacaoException{" +
               "campo='" + campo + '\'' +
               ", valorInvalido=" + valorInvalido +
               ", mensagem='" + getMessage() + '\'' +
               '}';
    }
}

// ✅ Usar
public void validarIdade(int idade) throws ValidacaoException {
    if (idade < 0 || idade > 150) {
        throw new ValidacaoException(
            "Idade inválida",
            "idade",
            idade
        );
    }
}

// ✅ Capturar e usar dados
public void processar() {
    try {
        validarIdade(-5);
        
    } catch (ValidacaoException e) {
        System.err.println("Campo: " + e.getCampo());
        System.err.println("Valor: " + e.getValorInvalido());
        System.err.println("Erro: " + e.getMessage());
        
        /*
         * SAÍDA:
         * Campo: idade
         * Valor: -5
         * Erro: Idade inválida
         */
    }
}
```

**Dados adicionais**: atributos **extras** (campo, valor, etc.).

### 7. Exceção vs RuntimeException

```java
// ✅ CHECKED (Exception)
public class ArquivoNaoEncontradoException extends Exception {
    //                                          ↑
    //                                      Exception
    public ArquivoNaoEncontradoException(String msg) {
        super(msg);
    }
}

// ✅ UNCHECKED (RuntimeException)
public class ArgumentoInvalidoException extends RuntimeException {
    //                                          ↑
    //                                  RuntimeException
    public ArgumentoInvalidoException(String msg) {
        super(msg);
    }
}

// ✅ Usar checked (OBRIGA tratamento)
public void lerArquivo(String nome) throws ArquivoNaoEncontradoException {
    //                                  ↑
    //                             OBRIGATÓRIO
    if (!new File(nome).exists()) {
        throw new ArquivoNaoEncontradoException("Arquivo não existe");
    }
}

// ✅ Usar unchecked (NÃO obriga tratamento)
public void validar(String nome) {
    // NÃO precisa throws
    if (nome == null || nome.isEmpty()) {
        throw new ArgumentoInvalidoException("Nome inválido");
    }
}

/*
 * DIFERENÇA:
 * 
 * Exception (checked):
 *   - OBRIGA throws na assinatura
 *   - OBRIGA try-catch ou throws (quem chama)
 *   - Usar para erros RECUPERÁVEIS
 * 
 * RuntimeException (unchecked):
 *   - NÃO obriga throws
 *   - NÃO obriga try-catch
 *   - Usar para erros PROGRAMAÇÃO
 */

// ✅ Quem chama
public void usar() {
    // Checked: OBRIGA tratar
    try {
        lerArquivo("teste.txt");
    } catch (ArquivoNaoEncontradoException e) {
        // Tratar
    }
    
    // Unchecked: NÃO obriga
    validar("João");  // OK sem try-catch
}
```

**Exception**: checked (obriga). **RuntimeException**: unchecked (não obriga).

### 8. Serialização

```java
// ✅ Exceção serializável
public class DadosException extends Exception implements Serializable {
    //                                              ↑
    //                                       Serializable
    
    private static final long serialVersionUID = 1L;
    
    private final int codigo;
    
    public DadosException(String msg, int codigo) {
        super(msg);
        this.codigo = codigo;
    }
    
    public int getCodigo() {
        return codigo;
    }
}

/*
 * SERIALIZAÇÃO:
 *   - Exception já é Serializable
 *   - serialVersionUID: controle versão
 *   - Atributos adicionais serializados
 *   - Útil para RMI, persistência
 */
```

**Serialização**: Exception já é `Serializable`.

### 9. Resumo Visual

```java
/*
 * EXCEÇÃO CHECKED PERSONALIZADA
 * 
 * CRIAR:
 * 
 * public class MinhaExcecao extends Exception {
 *     //                         ↑
 *     //                    Estende Exception
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
 * public void metodo() throws MinhaExcecao {
 *     //                   ↑
 *     //              OBRIGATÓRIO
 *     throw new MinhaExcecao("Erro");
 * }
 * 
 * 
 * CHAMAR:
 * 
 * // Opção 1: try-catch
 * try {
 *     metodo();
 * } catch (MinhaExcecao e) {
 *     // Tratar
 * }
 * 
 * // Opção 2: propagar
 * public void chamar() throws MinhaExcecao {
 *     metodo();
 * }
 * 
 * 
 * HIERARQUIA:
 * 
 * Exception
 *   └─ MinhaExcecao (checked)
 * 
 * NÃO:
 * RuntimeException
 *   └─ MinhaExcecao (seria unchecked)
 * 
 * 
 * CARACTERÍSTICAS:
 * 
 * ✅ Estende Exception
 * ✅ CHECKED (verificada compilação)
 * ✅ OBRIGA throws na assinatura
 * ✅ OBRIGA try-catch ou throws (quem chama)
 * ✅ Usar para erros RECUPERÁVEIS
 * 
 * 
 * QUANDO USAR:
 * 
 * ✅ Arquivo não encontrado
 * ✅ Conexão falhou
 * ✅ Saldo insuficiente
 * ✅ Entidade não encontrada
 * ✅ Validação falhou
 * ✅ Timeout operação
 * 
 * (Erros que usuário PODE corrigir)
 */

public class ExemploChecked extends Exception {
    public ExemploChecked(String msg) {
        super(msg);
    }
}
```

---

## Aplicabilidade

**Checked personalizada**:
- Estender `Exception`
- Erros **recuperáveis**
- **Obriga** tratamento

---

## Armadilhas

### 1. Estender RuntimeException (Unchecked)

```java
// ❌ Queria checked mas estendeu RuntimeException
public class MinhaExc extends RuntimeException {
    // ❌ UNCHECKED (não obriga tratamento)
}

// ✅ Checked
public class MinhaExc extends Exception {
    // ✅ CHECKED (obriga tratamento)
}
```

### 2. Esquecer Construtores

```java
// ⚠️ Apenas um construtor
public class MinhaExc extends Exception {
    public MinhaExc(String msg) {
        super(msg);
    }
    // Falta: vazio, causa, msg+causa
}

// ✅ Todos construtores
public class MinhaExc extends Exception {
    public MinhaExc() { super(); }
    public MinhaExc(String msg) { super(msg); }
    public MinhaExc(Throwable causa) { super(causa); }
    public MinhaExc(String msg, Throwable causa) { super(msg, causa); }
}
```

---

## Boas Práticas

### 1. Nome Terminar com "Exception"

```java
// ✅ Bom
public class SaldoInsuficienteException extends Exception { }

// ❌ Ruim
public class SaldoInsuficiente extends Exception { }
```

### 2. Construtores Padrão

```java
// ✅ 4 construtores padrão
public class MinhaExc extends Exception {
    public MinhaExc() { super(); }
    public MinhaExc(String msg) { super(msg); }
    public MinhaExc(Throwable causa) { super(causa); }
    public MinhaExc(String msg, Throwable causa) { super(msg, causa); }
}
```

### 3. Usar para Erros Recuperáveis

```java
// ✅ Checked: recuperável
public class ConexaoException extends Exception {
    // Usuário pode tentar novamente
}

// ❌ Checked para erro programação
public class ArgumentoNuloException extends Exception {
    // ❌ Erro programação (usar unchecked)
}
```

---

## Resumo

**Exceção checked personalizada**: estender `Exception`.

**Sintaxe**:
```java
public class MinhaExc extends Exception {
    // Construtores
}
```

**Características**:
- Estende `Exception` (não RuntimeException)
- **CHECKED**: verificada em compilação
- **OBRIGA** throws na assinatura
- **OBRIGA** try-catch ou throws (quem chama)
- Usar para erros **RECUPERÁVEIS**

**Construtores padrão**:
1. Vazio: `()`
2. Mensagem: `(String)`
3. Causa: `(Throwable)`
4. Mensagem + Causa: `(String, Throwable)`

**Quando usar**:
- Arquivo não encontrado
- Conexão falhou
- Saldo insuficiente
- Entidade não encontrada
- Validação falhou
- Erros que usuário **pode corrigir**

**Hierarquia**:
- Base genérica (RepositorioException)
- Específicas (EntidadeNaoEncontradaException)
- Captura seletiva

**Dados adicionais**:
- Atributos extras (campo, valor, código)
- Getters para acessar
- toString() customizado

**vs RuntimeException**:
- **Exception**: checked, **obriga** tratamento
- **RuntimeException**: unchecked, **não obriga**

**Regra de Ouro**: Estender `Exception` para erros **recuperáveis** que quem chama **deve** tratar. Incluir 4 construtores padrão. Nome terminar com "Exception". Usar **checked** quando erro esperado em condições normais e usuário pode **corrigir**. Usar **unchecked** (RuntimeException) para erros de **programação**.

