# T8.06 - Boas Práticas em Exceções Customizadas

## Introdução

**Boas práticas**: diretrizes para criar exceções **efetivas** e **manuteníveis**.

```java
/*
 * BOAS PRÁTICAS
 * 
 * ESTRUTURA:
 *   ✅ Nome termina com "Exception"
 *   ✅ 4 construtores padrão
 *   ✅ Atributos private final
 *   ✅ Mensagens específicas
 *   ✅ Documentação Javadoc
 * 
 * ESCOLHA:
 *   ✅ Checked para erros RECUPERÁVEIS
 *   ✅ Unchecked para erros PROGRAMAÇÃO
 *   ✅ Hierarquia para organizar
 * 
 * USO:
 *   ✅ Não usar para fluxo
 *   ✅ Capturar específica
 *   ✅ Não engolir exceções
 *   ✅ Logar apropriadamente
 */

// ✅ Exceção bem projetada
public class UserNotFoundException extends Exception {
    private static final long serialVersionUID = 1L;
    
    private final int userId;
    
    public UserNotFoundException() { super(); }
    public UserNotFoundException(String msg) { super(msg); }
    public UserNotFoundException(Throwable cause) { super(cause); }
    public UserNotFoundException(String msg, Throwable cause) { super(msg, cause); }
    
    public UserNotFoundException(int userId) {
        super("Usuário " + userId + " não encontrado");
        this.userId = userId;
    }
    
    public int getUserId() { return userId; }
}
```

**Boas práticas**: nome, construtores, atributos, mensagens, **documentação**.

---

## Fundamentos

### 1. Nome Significativo

```java
// ✅ BOM: nome termina com "Exception"
public class SaldoInsuficienteException extends Exception { }
public class UsuarioNaoEncontradoException extends Exception { }
public class ValidacaoException extends Exception { }

// ❌ RUIM: nome sem "Exception"
public class SaldoInsuficiente extends Exception { }
public class UsuarioInvalido extends Exception { }
public class Validacao extends Exception { }

// ✅ BOM: nome específico
public class CpfInvalidoException extends RuntimeException { }
public class EmailDuplicadoException extends Exception { }

// ❌ RUIM: nome genérico
public class ErroException extends Exception { }
public class ProblemaException extends Exception { }

/*
 * NOME:
 *   ✅ Terminar com "Exception"
 *   ✅ Descrever O QUE deu errado
 *   ✅ Específico (não genérico)
 *   ✅ Substantivo (não verbo)
 */
```

**Nome**: terminar com "Exception", **específico**, substantivo.

### 2. Checked vs Unchecked

```java
// ✅ CHECKED: erro RECUPERÁVEL
public class ConexaoException extends Exception {
    // Usuário pode tentar novamente
}

public class ArquivoNaoEncontradoException extends Exception {
    // Usuário pode fornecer outro arquivo
}

public class SaldoInsuficienteException extends Exception {
    // Usuário pode depositar
}

// ✅ UNCHECKED: erro PROGRAMAÇÃO
public class ArgumentoNuloException extends RuntimeException {
    // Desenvolvedor deveria validar
}

public class IndiceInvalidoException extends RuntimeException {
    // Desenvolvedor deveria verificar
}

public class EstadoInvalidoException extends RuntimeException {
    // Bug: estado inconsistente
}

/*
 * ESCOLHA:
 * 
 * CHECKED (extends Exception):
 *   ✅ Erro RECUPERÁVEL
 *   ✅ Esperado em condições normais
 *   ✅ Usuário PODE corrigir
 *   ✅ Obriga tratamento
 * 
 * UNCHECKED (extends RuntimeException):
 *   ✅ Erro de PROGRAMAÇÃO
 *   ✅ NÃO esperado (bug)
 *   ✅ Desenvolvedor DEVERIA prevenir
 *   ✅ NÃO obriga tratamento
 */
```

**Checked**: recuperável. **Unchecked**: programação.

### 3. Quatro Construtores Padrão

```java
// ✅ SEMPRE incluir 4 construtores
public class MinhaException extends Exception {
    
    // 1. Vazio
    public MinhaException() {
        super();
    }
    
    // 2. Mensagem
    public MinhaException(String mensagem) {
        super(mensagem);
    }
    
    // 3. Causa
    public MinhaException(Throwable causa) {
        super(causa);
    }
    
    // 4. Mensagem + Causa
    public MinhaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}

/*
 * 4 CONSTRUTORES:
 *   ✅ SEMPRE incluir
 *   ✅ Ordem: vazio, mensagem, causa, mensagem+causa
 *   ✅ Consistência com Exception/RuntimeException
 *   ✅ Flexibilidade de uso
 */
```

**Construtores**: **sempre** 4 padrão (vazio, mensagem, causa, mensagem+causa).

### 4. Atributos Imutáveis

```java
// ✅ BOM: atributos private final
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

// ❌ RUIM: atributos mutáveis
public class ValidationException extends Exception {
    private String campo;  // ❌ Não final
    private Object valorInvalido;
    
    // ❌ Setters permitem modificação
    public void setCampo(String campo) {
        this.campo = campo;
    }
}

/*
 * ATRIBUTOS:
 *   ✅ private final (imutável)
 *   ✅ Getters públicos
 *   ✅ NÃO setters
 *   ✅ Passar no construtor
 */
```

**Atributos**: `private final` (imutável), **não** setters.

### 5. Documentação Javadoc

```java
// ✅ BOM: Javadoc completo
/**
 * Exceção lançada quando saldo é insuficiente para operação.
 * 
 * <p>Esta exceção é lançada por métodos de saque quando o valor
 * solicitado excede o saldo disponível na conta.</p>
 * 
 * <p>Exemplo de uso:</p>
 * <pre>{@code
 * try {
 *     conta.sacar(150.00);
 * } catch (SaldoInsuficienteException e) {
 *     System.out.println("Falta: R$ " + e.getFalta());
 * }
 * }</pre>
 * 
 * @see Conta#sacar(double)
 * @since 1.0
 */
public class SaldoInsuficienteException extends Exception {
    
    /**
     * Cria exceção com saldo disponível e valor solicitado.
     * 
     * @param saldoDisponivel saldo atual na conta
     * @param valorSolicitado valor que tentou sacar
     * @throws IllegalArgumentException se valores negativos
     */
    public SaldoInsuficienteException(double saldoDisponivel, double valorSolicitado) {
        super(criarMensagem(saldoDisponivel, valorSolicitado));
        if (saldoDisponivel < 0 || valorSolicitado < 0) {
            throw new IllegalArgumentException("Valores devem ser >= 0");
        }
        this.saldoDisponivel = saldoDisponivel;
        this.valorSolicitado = valorSolicitado;
    }
    
    private final double saldoDisponivel;
    private final double valorSolicitado;
    
    /**
     * Retorna valor que falta para completar operação.
     * @return diferença entre solicitado e disponível
     */
    public double getFalta() {
        return valorSolicitado - saldoDisponivel;
    }
    
    private static String criarMensagem(double saldo, double valor) {
        return String.format(
            "Saldo insuficiente. Disponível: R$ %.2f, Solicitado: R$ %.2f",
            saldo, valor
        );
    }
}

/*
 * JAVADOC:
 *   ✅ Classe: quando lançada, exemplo
 *   ✅ Construtores: parâmetros, throws
 *   ✅ Métodos: retorno, throws
 *   ✅ @since, @see
 */
```

**Javadoc**: classe (quando/exemplo), construtores/**métodos** (params).

### 6. Hierarquia de Exceções

```java
// ✅ BOM: hierarquia organizada
/**
 * Exceção base para erros de repositório.
 */
public class RepositorioException extends Exception {
    public RepositorioException(String msg) { super(msg); }
    public RepositorioException(String msg, Throwable causa) { super(msg, causa); }
}

/**
 * Lançada quando entidade não encontrada.
 */
public class EntidadeNaoEncontradaException extends RepositorioException {
    public EntidadeNaoEncontradaException(String msg) { super(msg); }
}

/**
 * Lançada quando entidade duplicada.
 */
public class EntidadeDuplicadaException extends RepositorioException {
    public EntidadeDuplicadaException(String msg) { super(msg); }
}

/**
 * Lançada quando erro de conexão.
 */
public class ConexaoRepositorioException extends RepositorioException {
    public ConexaoRepositorioException(String msg, Throwable causa) {
        super(msg, causa);
    }
}

// ✅ Usar hierarquia
public void processar() {
    try {
        // código
    } catch (EntidadeNaoEncontradaException e) {
        // Tratar específica
    } catch (RepositorioException e) {
        // Tratar outras
    }
}

/*
 * HIERARQUIA:
 *   ✅ Base genérica
 *   ✅ Específicas derivadas
 *   ✅ Organiza exceções relacionadas
 *   ✅ Permite captura seletiva
 */
```

**Hierarquia**: base **genérica** + específicas **derivadas**.

### 7. Mensagens Significativas

```java
// ✅ BOM: mensagens específicas com valores
public class ValidationException extends Exception {
    public ValidationException(String campo, Object recebido, Object esperado) {
        super(String.format(
            "Campo '%s' inválido. Recebido: %s, Esperado: %s",
            campo, recebido, esperado
        ));
    }
}

// ❌ RUIM: mensagem genérica
public class ValidationException extends Exception {
    public ValidationException() {
        super("Erro de validação");  // ❌ Muito genérico
    }
}

/*
 * MENSAGENS:
 *   ✅ Específicas (não genéricas)
 *   ✅ Incluir valores relevantes
 *   ✅ Contexto (campo, operação)
 *   ✅ Acionáveis (sugerir solução)
 */
```

**Mensagens**: **específicas**, com **valores**, **acionáveis**.

### 8. SerialVersionUID

```java
// ✅ BOM: incluir serialVersionUID
public class MinhaException extends Exception {
    private static final long serialVersionUID = 1L;
    
    // Atributos e construtores
}

/*
 * serialVersionUID:
 *   ✅ Controle de versão
 *   ✅ Compatibilidade serialização
 *   ✅ Valor: 1L (inicial)
 *   ✅ Incrementar ao mudar estrutura
 */
```

**serialVersionUID**: sempre incluir (`1L` inicial).

### 9. Não Usar para Fluxo

```java
// ❌ RUIM: exceção para fluxo normal
public int buscarIndice(String valor) {
    try {
        for (int i = 0; i < lista.size(); i++) {
            if (lista.get(i).equals(valor)) {
                throw new EncontradoException(i);  // ❌ Fluxo normal
            }
        }
        return -1;
    } catch (EncontradoException e) {
        return e.getIndice();
    }
}

// ✅ BOM: retorno normal
public int buscarIndice(String valor) {
    for (int i = 0; i < lista.size(); i++) {
        if (lista.get(i).equals(valor)) {
            return i;  // ✅ Retorno normal
        }
    }
    return -1;
}

/*
 * NÃO USAR EXCEÇÃO PARA:
 *   ❌ Controle de fluxo normal
 *   ❌ Indicar sucesso
 *   ❌ Substituir if/else
 * 
 * Exceções: situações EXCEPCIONAIS
 */
```

**Não usar**: controle de **fluxo** normal (apenas excepcionais).

### 10. Resumo Visual

```java
/*
 * BOAS PRÁTICAS - EXCEÇÕES CUSTOMIZADAS
 * 
 * 1. NOME:
 *    ✅ Terminar com "Exception"
 *    ✅ Específico (não genérico)
 *    ✅ Substantivo
 *    Exemplo: UserNotFoundException
 * 
 * 2. TIPO:
 *    ✅ Checked (Exception): erro RECUPERÁVEL
 *    ✅ Unchecked (RuntimeException): erro PROGRAMAÇÃO
 * 
 * 3. CONSTRUTORES:
 *    ✅ SEMPRE 4 padrão
 *    ✅ Vazio, Mensagem, Causa, Mensagem+Causa
 *    ✅ + Customizados conforme necessidade
 * 
 * 4. ATRIBUTOS:
 *    ✅ private final (imutável)
 *    ✅ Getters públicos
 *    ✅ NÃO setters
 *    ✅ Cópia defensiva (coleções)
 * 
 * 5. MENSAGENS:
 *    ✅ Específicas (não "Erro")
 *    ✅ Incluir valores relevantes
 *    ✅ Contexto (campo, ID, operação)
 *    ✅ Acionáveis (sugerir solução)
 * 
 * 6. DOCUMENTAÇÃO:
 *    ✅ Javadoc completo
 *    ✅ Quando lançada
 *    ✅ Exemplo de uso
 *    ✅ @param, @throws, @see
 * 
 * 7. HIERARQUIA:
 *    ✅ Base genérica
 *    ✅ Específicas derivadas
 *    ✅ Organizar exceções relacionadas
 * 
 * 8. SERIALIZAÇÃO:
 *    ✅ serialVersionUID = 1L
 *    ✅ transient para não serializáveis
 * 
 * 9. USO:
 *    ❌ NÃO usar para fluxo normal
 *    ✅ Capturar específica
 *    ✅ NÃO engolir exceções
 *    ✅ Logar apropriadamente
 * 
 * 10. TESTE:
 *     ✅ Testar construtores
 *     ✅ Testar mensagens
 *     ✅ Testar getters
 */

/**
 * Exemplo de exceção bem projetada.
 */
public class ExemploBoaExcecao extends Exception {
    private static final long serialVersionUID = 1L;
    
    private final String campo;
    private final Object valor;
    
    // 4 construtores padrão
    public ExemploBoaExcecao() { super(); }
    public ExemploBoaExcecao(String msg) { super(msg); }
    public ExemploBoaExcecao(Throwable causa) { super(causa); }
    public ExemploBoaExcecao(String msg, Throwable causa) { super(msg, causa); }
    
    // Construtor customizado
    public ExemploBoaExcecao(String campo, Object valor) {
        super("Campo '" + campo + "' inválido: " + valor);
        this.campo = campo;
        this.valor = valor;
    }
    
    public String getCampo() { return campo; }
    public Object getValor() { return valor; }
}
```

---

## Checklist

**Criar exceção customizada**:

### Estrutura
- [ ] Nome termina com "Exception"
- [ ] Extends Exception (checked) ou RuntimeException (unchecked)
- [ ] serialVersionUID = 1L
- [ ] 4 construtores padrão (vazio, mensagem, causa, mensagem+causa)

### Atributos
- [ ] private final (imutáveis)
- [ ] Getters públicos (sem setters)
- [ ] Cópia defensiva para coleções
- [ ] transient para não serializáveis

### Mensagens
- [ ] Específicas (não genéricas)
- [ ] Incluem valores relevantes
- [ ] Contexto (campo, ID, operação)
- [ ] Acionáveis (sugerem solução)

### Documentação
- [ ] Javadoc na classe
- [ ] Javadoc nos construtores
- [ ] Javadoc nos métodos públicos
- [ ] Exemplo de uso
- [ ] @param, @throws, @see, @since

### Hierarquia
- [ ] Base genérica (se múltiplas relacionadas)
- [ ] Específicas derivadas
- [ ] Organização lógica

### Teste
- [ ] Testar construtores
- [ ] Testar mensagens
- [ ] Testar getters
- [ ] Testar serialização

---

## Armadilhas

### 1. Usar para Fluxo

```java
// ❌ Exceção para fluxo
try {
    if (encontrado) throw new EncontradoException();
} catch (EncontradoException e) { }

// ✅ Retorno normal
if (encontrado) return resultado;
```

### 2. Engolir Exceção

```java
// ❌ Engolir
try {
    metodo();
} catch (Exception e) {
    // ❌ Nada (engoliu)
}

// ✅ Logar ou propagar
try {
    metodo();
} catch (Exception e) {
    logger.error("Erro", e);  // ✅ Logar
    throw e;  // OU propagar
}
```

### 3. Capturar Genérica

```java
// ❌ Capturar genérica
catch (Exception e) { }

// ✅ Capturar específica
catch (MinhaException e) { }
```

---

## Resumo

**Boas práticas**: criar exceções **efetivas** e **manuteníveis**.

**Nome**:
- Terminar com "Exception"
- Específico (não genérico)
- Substantivo

**Tipo**:
- **Checked** (Exception): erro recuperável
- **Unchecked** (RuntimeException): erro programação

**Construtores**:
- **4 padrão** (sempre)
- Vazio, mensagem, causa, mensagem+causa
- + Customizados

**Atributos**:
- `private final` (imutável)
- Getters públicos (sem setters)
- Cópia defensiva (coleções)

**Mensagens**:
- Específicas (não "Erro")
- Valores relevantes
- Contexto (campo, ID)
- Acionáveis (solução)

**Documentação**:
- Javadoc completo
- Quando lançada
- Exemplo de uso
- @param, @throws, @see

**Hierarquia**:
- Base genérica
- Específicas derivadas
- Captura seletiva

**Serialização**:
- serialVersionUID = 1L
- transient (não serializáveis)

**Uso**:
- **Não** usar para fluxo normal
- Capturar **específica**
- **Não** engolir
- Logar apropriadamente

**Regra de Ouro**: Nome termina "Exception". Escolher checked (recuperável) ou unchecked (programação). **4 construtores** padrão sempre. Atributos `private final`. Mensagens **específicas** com valores. Javadoc **completo**. Hierarquia para organizar. serialVersionUID = 1L. **Não** usar para fluxo normal. Capturar **específica**, não genérica. **Não** engolir exceções.

