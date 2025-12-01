# T8.03 - Construtores Padrão de Exceções

## Introdução

**Construtores padrão**: 4 construtores que toda exceção **deveria** ter.

```java
/*
 * CONSTRUTORES PADRÃO DE EXCEÇÕES
 * 
 * PADRÃO:
 * 1. Vazio: ()
 * 2. Mensagem: (String)
 * 3. Causa: (Throwable)
 * 4. Mensagem + Causa: (String, Throwable)
 * 
 * EXEMPLO:
 * public class MinhaExcecao extends Exception {
 *     
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
 */

// ✅ Exceção com 4 construtores padrão
public class ProcessamentoException extends Exception {
    
    public ProcessamentoException() {
        super();
    }
    
    public ProcessamentoException(String mensagem) {
        super(mensagem);
    }
    
    public ProcessamentoException(Throwable causa) {
        super(causa);
    }
    
    public ProcessamentoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

**Padrão**: 4 construtores (vazio, mensagem, causa, mensagem+causa).

---

## Fundamentos

### 1. Construtor Vazio

```java
// ✅ Construtor vazio: ()
public class MinhaExcecao extends Exception {
    
    // ✅ Construtor vazio
    public MinhaExcecao() {
        super();
        // Chama Exception()
    }
}

// ✅ Usar construtor vazio
public void metodo1() throws MinhaExcecao {
    throw new MinhaExcecao();
    // Sem mensagem, sem causa
}

// ✅ Capturar
public void usar() {
    try {
        metodo1();
    } catch (MinhaExcecao e) {
        System.out.println("Mensagem: " + e.getMessage());  // null
        System.out.println("Causa: " + e.getCause());        // null
        
        /*
         * SAÍDA:
         * Mensagem: null
         * Causa: null
         */
    }
}

/*
 * CONSTRUTOR VAZIO:
 *   - Sem parâmetros
 *   - getMessage() retorna null
 *   - getCause() retorna null
 *   - Usar quando não precisa mensagem/causa
 */
```

**Vazio**: `()` → mensagem e causa **null**.

### 2. Construtor com Mensagem

```java
// ✅ Construtor com mensagem: (String)
public class MinhaExcecao extends Exception {
    
    // ✅ Construtor com mensagem
    public MinhaExcecao(String mensagem) {
        super(mensagem);
        // Chama Exception(String)
    }
}

// ✅ Usar construtor com mensagem
public void metodo2() throws MinhaExcecao {
    throw new MinhaExcecao("Erro ao processar dados");
    //                     ↑
    //                  Mensagem
}

// ✅ Capturar
public void usar() {
    try {
        metodo2();
    } catch (MinhaExcecao e) {
        System.out.println("Mensagem: " + e.getMessage());  // "Erro ao processar dados"
        System.out.println("Causa: " + e.getCause());        // null
        
        /*
         * SAÍDA:
         * Mensagem: Erro ao processar dados
         * Causa: null
         */
    }
}

/*
 * CONSTRUTOR COM MENSAGEM:
 *   - Parâmetro String
 *   - getMessage() retorna mensagem
 *   - getCause() retorna null
 *   - Usar para descrever erro
 */
```

**Mensagem**: `(String)` → mensagem **descritiva**.

### 3. Construtor com Causa

```java
// ✅ Construtor com causa: (Throwable)
public class MinhaExcecao extends Exception {
    
    // ✅ Construtor com causa
    public MinhaExcecao(Throwable causa) {
        super(causa);
        // Chama Exception(Throwable)
    }
}

// ✅ Usar construtor com causa
public void metodo3() throws MinhaExcecao {
    try {
        throw new IOException("Erro I/O");
        
    } catch (IOException e) {
        throw new MinhaExcecao(e);
        //                     ↑
        //                   Causa
    }
}

// ✅ Capturar
public void usar() {
    try {
        metodo3();
    } catch (MinhaExcecao e) {
        System.out.println("Mensagem: " + e.getMessage());       // "java.io.IOException: Erro I/O"
        System.out.println("Causa: " + e.getCause());             // IOException: Erro I/O
        System.out.println("Causa msg: " + e.getCause().getMessage());  // "Erro I/O"
        
        /*
         * SAÍDA:
         * Mensagem: java.io.IOException: Erro I/O
         * Causa: java.io.IOException: Erro I/O
         * Causa msg: Erro I/O
         */
    }
}

/*
 * CONSTRUTOR COM CAUSA:
 *   - Parâmetro Throwable
 *   - getMessage() retorna causa.toString()
 *   - getCause() retorna causa
 *   - Usar para encadear exceções
 */
```

**Causa**: `(Throwable)` → **encadeia** exceção original.

### 4. Construtor com Mensagem + Causa

```java
// ✅ Construtor com mensagem + causa: (String, Throwable)
public class MinhaExcecao extends Exception {
    
    // ✅ Construtor com mensagem + causa
    public MinhaExcecao(String mensagem, Throwable causa) {
        super(mensagem, causa);
        // Chama Exception(String, Throwable)
    }
}

// ✅ Usar construtor com mensagem + causa
public void metodo4() throws MinhaExcecao {
    try {
        throw new SQLException("Erro SQL");
        
    } catch (SQLException e) {
        throw new MinhaExcecao("Falha ao acessar banco de dados", e);
        //                     ↑                                   ↑
        //                  Mensagem                            Causa
    }
}

// ✅ Capturar
public void usar() {
    try {
        metodo4();
    } catch (MinhaExcecao e) {
        System.out.println("Mensagem: " + e.getMessage());            // "Falha ao acessar banco de dados"
        System.out.println("Causa: " + e.getCause());                  // SQLException: Erro SQL
        System.out.println("Causa msg: " + e.getCause().getMessage()); // "Erro SQL"
        
        /*
         * SAÍDA:
         * Mensagem: Falha ao acessar banco de dados
         * Causa: java.sql.SQLException: Erro SQL
         * Causa msg: Erro SQL
         */
    }
}

/*
 * CONSTRUTOR COM MENSAGEM + CAUSA:
 *   - Parâmetros: String, Throwable
 *   - getMessage() retorna mensagem customizada
 *   - getCause() retorna causa
 *   - MAIS USADO: adiciona contexto + preserva causa
 */
```

**Mensagem + Causa**: `(String, Throwable)` → contexto + **encadeamento**.

### 5. Comparação dos Construtores

```java
// ✅ Exceção com 4 construtores
public class ExemploException extends Exception {
    
    public ExemploException() {
        super();
    }
    
    public ExemploException(String mensagem) {
        super(mensagem);
    }
    
    public ExemploException(Throwable causa) {
        super(causa);
    }
    
    public ExemploException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}

// ✅ Comparar construtores
public class Comparacao {
    
    public static void main(String[] args) {
        
        // 1. Vazio
        ExemploException e1 = new ExemploException();
        System.out.println("1. Vazio:");
        System.out.println("   getMessage(): " + e1.getMessage());  // null
        System.out.println("   getCause(): " + e1.getCause());      // null
        
        // 2. Mensagem
        ExemploException e2 = new ExemploException("Erro processamento");
        System.out.println("\n2. Mensagem:");
        System.out.println("   getMessage(): " + e2.getMessage());  // "Erro processamento"
        System.out.println("   getCause(): " + e2.getCause());      // null
        
        // 3. Causa
        IOException causa = new IOException("Erro I/O");
        ExemploException e3 = new ExemploException(causa);
        System.out.println("\n3. Causa:");
        System.out.println("   getMessage(): " + e3.getMessage());  // "java.io.IOException: Erro I/O"
        System.out.println("   getCause(): " + e3.getCause());      // IOException: Erro I/O
        
        // 4. Mensagem + Causa
        ExemploException e4 = new ExemploException("Falha ao processar", causa);
        System.out.println("\n4. Mensagem + Causa:");
        System.out.println("   getMessage(): " + e4.getMessage());  // "Falha ao processar"
        System.out.println("   getCause(): " + e4.getCause());      // IOException: Erro I/O
        
        /*
         * SAÍDA:
         * 1. Vazio:
         *    getMessage(): null
         *    getCause(): null
         * 
         * 2. Mensagem:
         *    getMessage(): Erro processamento
         *    getCause(): null
         * 
         * 3. Causa:
         *    getMessage(): java.io.IOException: Erro I/O
         *    getCause(): java.io.IOException: Erro I/O
         * 
         * 4. Mensagem + Causa:
         *    getMessage(): Falha ao processar
         *    getCause(): java.io.IOException: Erro I/O
         */
    }
}
```

**Comparação**: vazio (null/null), mensagem (msg/null), causa (causa.toString/causa), mensagem+causa (msg/**causa**).

### 6. Construtores em Hierarquia

```java
// ✅ Exceção base com 4 construtores
public class BaseException extends Exception {
    
    public BaseException() {
        super();
    }
    
    public BaseException(String mensagem) {
        super(mensagem);
    }
    
    public BaseException(Throwable causa) {
        super(causa);
    }
    
    public BaseException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}

// ✅ Exceção derivada com 4 construtores
public class DerivadaException extends BaseException {
    
    public DerivadaException() {
        super();  // Chama BaseException()
    }
    
    public DerivadaException(String mensagem) {
        super(mensagem);  // Chama BaseException(String)
    }
    
    public DerivadaException(Throwable causa) {
        super(causa);  // Chama BaseException(Throwable)
    }
    
    public DerivadaException(String mensagem, Throwable causa) {
        super(mensagem, causa);  // Chama BaseException(String, Throwable)
    }
}

/*
 * HIERARQUIA:
 *   - Base: 4 construtores
 *   - Derivada: 4 construtores (chamam super)
 *   - Consistência: mesma estrutura
 */
```

**Hierarquia**: derivada também **4 construtores** (super).

### 7. Construtores Adicionais

```java
// ✅ Exceção com construtores padrão + customizados
public class ValidacaoException extends Exception {
    
    private String campo;
    private Object valorInvalido;
    
    // ✅ 4 construtores padrão
    public ValidacaoException() {
        super();
    }
    
    public ValidacaoException(String mensagem) {
        super(mensagem);
    }
    
    public ValidacaoException(Throwable causa) {
        super(causa);
    }
    
    public ValidacaoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
    
    // ✅ Construtor customizado
    public ValidacaoException(String mensagem, String campo, Object valorInvalido) {
        super(mensagem);
        this.campo = campo;
        this.valorInvalido = valorInvalido;
    }
    
    // ✅ Outro construtor customizado
    public ValidacaoException(String mensagem, Throwable causa, String campo) {
        super(mensagem, causa);
        this.campo = campo;
    }
    
    public String getCampo() {
        return campo;
    }
    
    public Object getValorInvalido() {
        return valorInvalido;
    }
}

// ✅ Usar construtores
public void usar() throws ValidacaoException {
    // Padrão: vazio
    throw new ValidacaoException();
    
    // Padrão: mensagem
    throw new ValidacaoException("Validação falhou");
    
    // Customizado: mensagem + campo + valor
    throw new ValidacaoException("Idade inválida", "idade", -5);
}

/*
 * CONSTRUTORES:
 *   ✅ 4 padrão (sempre incluir)
 *   ✅ + Customizados (conforme necessidade)
 */
```

**Customizados**: 4 padrão + **extras** (conforme necessidade).

### 8. Construtores RuntimeException

```java
// ✅ Unchecked com 4 construtores padrão
public class MinhaRuntimeException extends RuntimeException {
    
    public MinhaRuntimeException() {
        super();
    }
    
    public MinhaRuntimeException(String mensagem) {
        super(mensagem);
    }
    
    public MinhaRuntimeException(Throwable causa) {
        super(causa);
    }
    
    public MinhaRuntimeException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}

/*
 * UNCHECKED:
 *   - RuntimeException também 4 construtores
 *   - Mesma estrutura que Exception
 *   - super() chama RuntimeException()
 */

// ✅ Usar
public void metodo() {
    // NÃO precisa throws (unchecked)
    
    throw new MinhaRuntimeException();  // Vazio
    
    throw new MinhaRuntimeException("Erro");  // Mensagem
    
    try {
        Integer.parseInt("abc");
    } catch (NumberFormatException e) {
        throw new MinhaRuntimeException(e);  // Causa
    }
    
    try {
        Integer.parseInt("xyz");
    } catch (NumberFormatException e) {
        throw new MinhaRuntimeException("Formato inválido", e);  // Mensagem + causa
    }
}
```

**RuntimeException**: também **4 construtores** padrão.

### 9. Ordem dos Construtores

```java
// ✅ Ordem recomendada
public class OrdemException extends Exception {
    
    // 1. Vazio (sem parâmetros)
    public OrdemException() {
        super();
    }
    
    // 2. Mensagem (1 parâmetro String)
    public OrdemException(String mensagem) {
        super(mensagem);
    }
    
    // 3. Causa (1 parâmetro Throwable)
    public OrdemException(Throwable causa) {
        super(causa);
    }
    
    // 4. Mensagem + Causa (2 parâmetros)
    public OrdemException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
    
    // 5. Construtores customizados (depois dos padrão)
    public OrdemException(String mensagem, int codigo) {
        super(mensagem + " (código: " + codigo + ")");
    }
}

/*
 * ORDEM RECOMENDADA:
 *   1. Vazio: ()
 *   2. Mensagem: (String)
 *   3. Causa: (Throwable)
 *   4. Mensagem + Causa: (String, Throwable)
 *   5. Customizados
 * 
 * Consistência com Exception/RuntimeException do JDK
 */
```

**Ordem**: vazio → mensagem → causa → mensagem+causa → **customizados**.

### 10. Resumo Visual

```java
/*
 * CONSTRUTORES PADRÃO DE EXCEÇÕES
 * 
 * ESTRUTURA COMPLETA:
 * 
 * public class MinhaExcecao extends Exception {
 *     
 *     // 1. VAZIO
 *     public MinhaExcecao() {
 *         super();
 *     }
 *     
 *     // 2. MENSAGEM
 *     public MinhaExcecao(String mensagem) {
 *         super(mensagem);
 *     }
 *     
 *     // 3. CAUSA
 *     public MinhaExcecao(Throwable causa) {
 *         super(causa);
 *     }
 *     
 *     // 4. MENSAGEM + CAUSA
 *     public MinhaExcecao(String mensagem, Throwable causa) {
 *         super(mensagem, causa);
 *     }
 * }
 * 
 * 
 * COMPARAÇÃO:
 * 
 * Construtor          | getMessage()              | getCause()
 * --------------------|---------------------------|------------------
 * ()                  | null                      | null
 * (String)            | mensagem                  | null
 * (Throwable)         | causa.toString()          | causa
 * (String, Throwable) | mensagem                  | causa
 * 
 * 
 * QUANDO USAR CADA:
 * 
 * 1. VAZIO ():
 *    - Sem mensagem/causa
 *    - Raro (preferir mensagem)
 * 
 * 2. MENSAGEM (String):
 *    - Descrever erro
 *    - Sem causa (erro original)
 * 
 * 3. CAUSA (Throwable):
 *    - Encadear exceção
 *    - Mensagem = causa.toString()
 * 
 * 4. MENSAGEM + CAUSA (String, Throwable):
 *    - MAIS USADO
 *    - Adicionar contexto + preservar causa
 * 
 * 
 * EXEMPLO USO:
 * 
 * // Vazio
 * throw new MinhaExcecao();
 * 
 * // Mensagem
 * throw new MinhaExcecao("Erro processamento");
 * 
 * // Causa
 * try {
 *     ...
 * } catch (IOException e) {
 *     throw new MinhaExcecao(e);
 * }
 * 
 * // Mensagem + Causa (MAIS COMUM)
 * try {
 *     ...
 * } catch (SQLException e) {
 *     throw new MinhaExcecao("Falha ao acessar banco", e);
 * }
 * 
 * 
 * HIERARQUIA:
 * 
 * Exception (checked):
 *   └─ MinhaExcecao (4 construtores)
 * 
 * RuntimeException (unchecked):
 *   └─ MinhaRuntimeExcecao (4 construtores)
 * 
 * AMBOS: mesma estrutura 4 construtores
 */

public class ConstrutoresPadrao extends Exception {
    
    public ConstrutoresPadrao() {
        super();
    }
    
    public ConstrutoresPadrao(String mensagem) {
        super(mensagem);
    }
    
    public ConstrutoresPadrao(Throwable causa) {
        super(causa);
    }
    
    public ConstrutoresPadrao(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## Aplicabilidade

**Construtores padrão**:
- **4** construtores obrigatórios
- Vazio, mensagem, causa, mensagem+causa
- Mesma estrutura Exception/RuntimeException

---

## Armadilhas

### 1. Esquecer Algum Construtor

```java
// ❌ Apenas 1 construtor
public class MinhaExc extends Exception {
    public MinhaExc(String msg) {
        super(msg);
    }
    // Falta: vazio, causa, msg+causa
}

// ✅ 4 construtores
public class MinhaExc extends Exception {
    public MinhaExc() { super(); }
    public MinhaExc(String msg) { super(msg); }
    public MinhaExc(Throwable causa) { super(causa); }
    public MinhaExc(String msg, Throwable causa) { super(msg, causa); }
}
```

### 2. Não Chamar super()

```java
// ❌ Sem super()
public class MinhaExc extends Exception {
    public MinhaExc(String msg) {
        // ❌ Não chama super(msg)
    }
}

// ✅ Com super()
public class MinhaExc extends Exception {
    public MinhaExc(String msg) {
        super(msg);  // ✅ Chama Exception(String)
    }
}
```

---

## Boas Práticas

### 1. Sempre 4 Construtores Padrão

```java
// ✅ 4 construtores padrão
public class MinhaExc extends Exception {
    public MinhaExc() { super(); }
    public MinhaExc(String msg) { super(msg); }
    public MinhaExc(Throwable causa) { super(causa); }
    public MinhaExc(String msg, Throwable causa) { super(msg, causa); }
}
```

### 2. Ordem Consistente

```java
// ✅ Ordem: vazio → mensagem → causa → msg+causa
public class MinhaExc extends Exception {
    public MinhaExc() { super(); }                              // 1
    public MinhaExc(String msg) { super(msg); }                  // 2
    public MinhaExc(Throwable causa) { super(causa); }           // 3
    public MinhaExc(String msg, Throwable causa) { super(msg, causa); }  // 4
}
```

### 3. Customizados Depois dos Padrão

```java
// ✅ Padrão primeiro, customizados depois
public class MinhaExc extends Exception {
    // Padrão
    public MinhaExc() { super(); }
    public MinhaExc(String msg) { super(msg); }
    public MinhaExc(Throwable causa) { super(causa); }
    public MinhaExc(String msg, Throwable causa) { super(msg, causa); }
    
    // Customizados
    public MinhaExc(String msg, int codigo) {
        super(msg + " (código: " + codigo + ")");
    }
}
```

---

## Resumo

**Construtores padrão**: 4 construtores que **toda** exceção deveria ter.

**Estrutura**:
```java
public MinhaExc() { super(); }
public MinhaExc(String msg) { super(msg); }
public MinhaExc(Throwable causa) { super(causa); }
public MinhaExc(String msg, Throwable causa) { super(msg, causa); }
```

**4 Construtores**:
1. **Vazio** `()`: sem mensagem/causa
2. **Mensagem** `(String)`: descrever erro
3. **Causa** `(Throwable)`: encadear exceção
4. **Mensagem + Causa** `(String, Throwable)`: contexto + encadeamento

**Quando usar**:
- **Vazio**: raro (preferir mensagem)
- **Mensagem**: descrever erro (sem causa)
- **Causa**: encadear exceção (mensagem = causa.toString)
- **Mensagem + Causa**: **MAIS USADO** (adiciona contexto + preserva causa)

**Hierarquia**:
- Exception (checked): 4 construtores
- RuntimeException (unchecked): 4 construtores
- Derivadas: também 4 construtores

**Customizados**:
- 4 padrão **sempre**
- + Customizados conforme **necessidade**
- Customizados **depois** dos padrão

**Ordem**:
1. Vazio
2. Mensagem
3. Causa
4. Mensagem + Causa
5. Customizados

**Regra de Ouro**: **Sempre** incluir 4 construtores padrão em exceções personalizadas. Ordem: vazio → mensagem → causa → mensagem+causa. Customizados **depois** dos padrão. Chamar `super()` em **todos** construtores. Mensagem+causa **mais usado** (contexto + encadeamento). Consistência com Exception/RuntimeException do JDK.

