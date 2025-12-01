# T7.03 - Sintaxe e Uso de throw

## Introdução

**throw** cria e lança **instância** de exceção (instrução executável).

```java
/*
 * SINTAXE throw
 * 
 * throw expressãoExceção;
 * 
 * ONDE:
 *   - throw: palavra-chave
 *   - expressãoExceção: instância de Throwable
 *   - Geralmente: new TipoExcecao("mensagem")
 * 
 * CARACTERÍSTICAS:
 *   - Instrução EXECUTÁVEL (dentro do método)
 *   - Cria INSTÂNCIA de exceção
 *   - LANÇA a exceção
 *   - INTERROMPE fluxo normal
 */

// ✅ Sintaxe básica
throw new IllegalArgumentException("Argumento inválido");
//↑    ↑                           ↑
//│    │                           └─ Mensagem (opcional)
//│    └─ Criar instância (new)
//└─ Lançar (throw)
```

**throw**: instrução para **lançar** exceção.

---

## Fundamentos

### 1. Estrutura da Instrução

```java
// ✅ Estrutura completa da instrução throw
public class EstruturaThrow {
    
    // ✅ Forma mais comum
    public static void exemplo1() {
        throw new IllegalArgumentException("Mensagem de erro");
        //↑   ↑   ↑                        ↑
        //│   │   │                        └─ String mensagem
        //│   │   └─ Tipo da exceção
        //│   └─ Operador new (criar instância)
        //└─ Palavra-chave throw
    }
    
    // ✅ Sem mensagem
    public static void exemplo2() {
        throw new IllegalStateException();
        // Apenas tipo (sem mensagem)
    }
    
    // ✅ Com variável
    public static void exemplo3() {
        Exception excecao = new Exception("Erro");
        throw excecao;
        // Variável contendo exceção
    }
    
    // ✅ Com construtor parametrizado
    public static void exemplo4() {
        throw new RuntimeException("Erro", new IOException());
        //                         ↑        ↑
        //                         │        └─ Causa (Throwable)
        //                         └─ Mensagem
    }
    
    // ✅ Resultado de método
    public static RuntimeException criarExcecao() {
        return new RuntimeException("Criada por método");
    }
    
    public static void exemplo5() {
        throw criarExcecao();
        // Resultado de método que retorna exceção
    }
}
```

**Estrutura**: `throw` + `new TipoExcecao(params)`.

### 2. Tipos de Construtores

```java
// ✅ Construtores comuns de exceções
public class ConstrutoresExcecao {
    
    // ✅ Construtor vazio
    public static void vazio() {
        throw new IllegalArgumentException();
        // Sem mensagem
    }
    
    // ✅ Construtor com mensagem
    public static void comMensagem() {
        throw new IllegalArgumentException("Nome inválido");
        // String message
    }
    
    // ✅ Construtor com causa
    public static void comCausa() {
        IOException causa = new IOException("I/O erro");
        throw new RuntimeException(causa);
        // Throwable cause
    }
    
    // ✅ Construtor com mensagem E causa
    public static void mensagemCausa() {
        IOException causa = new IOException("I/O erro");
        throw new RuntimeException("Erro ao processar", causa);
        // String message, Throwable cause
    }
    
    /*
     * CONSTRUTORES PADRÃO:
     * 
     * Exception()
     * Exception(String message)
     * Exception(Throwable cause)
     * Exception(String message, Throwable cause)
     * 
     * Mesmo padrão para subclasses:
     *   - IllegalArgumentException
     *   - IllegalStateException
     *   - IOException
     *   - SQLException
     *   - etc.
     */
}
```

**Construtores**: vazio, mensagem, causa, mensagem+causa.

### 3. Expressões Válidas

```java
// ✅ Expressões válidas para throw
public class ExpressoesValidas {
    
    // ✅ Literal new
    public static void literal() {
        throw new RuntimeException("Erro");
    }
    
    // ✅ Variável local
    public static void variavel() {
        RuntimeException exc = new RuntimeException("Erro");
        throw exc;
    }
    
    // ✅ Parâmetro de método
    public static void lancarParametro(RuntimeException exc) {
        throw exc;
    }
    
    // ✅ Campo de classe
    public static class MinhaClasse {
        private static final RuntimeException ERRO_PADRAO = 
            new RuntimeException("Erro padrão");
        
        public void metodo() {
            throw ERRO_PADRAO;
        }
    }
    
    // ✅ Resultado de método
    public static RuntimeException criar() {
        return new RuntimeException("Criada");
    }
    
    public static void usarMetodo() {
        throw criar();
    }
    
    // ✅ Operador ternário
    public static void ternario(boolean condicao) {
        throw condicao 
            ? new IllegalArgumentException("Caso true")
            : new IllegalStateException("Caso false");
    }
    
    // ❌ INVÁLIDO: tipo primitivo
    // throw 42;  // ERRO: int não é Throwable
    
    // ❌ INVÁLIDO: null
    // throw null;  // NullPointerException em runtime
    
    /*
     * REGRA:
     * Expressão DEVE ser:
     *   - Tipo Throwable (ou subclasse)
     *   - Não null
     */
}
```

**Válido**: qualquer expressão que retorne **Throwable**.

### 4. Localização no Código

```java
// ✅ Onde throw pode aparecer
public class LocalizacaoThrow {
    
    // ✅ No início do método
    public static void inicio(String param) {
        throw new IllegalArgumentException("Erro");
        // Resto do método unreachable
    }
    
    // ✅ Dentro de if
    public static void dentroIf(int valor) {
        if (valor < 0) {
            throw new IllegalArgumentException("Negativo");
        }
        System.out.println("Valor: " + valor);
    }
    
    // ✅ Dentro de loop
    public static void dentroLoop(int[] array) {
        for (int valor : array) {
            if (valor < 0) {
                throw new IllegalArgumentException("Negativo: " + valor);
            }
        }
    }
    
    // ✅ Dentro de try
    public static void dentroTry() {
        try {
            throw new IOException("Erro I/O");
        } catch (IOException e) {
            System.err.println("Capturada: " + e.getMessage());
        }
    }
    
    // ✅ Dentro de catch
    public static void dentroCatch() {
        try {
            // código
        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar", e);
        }
    }
    
    // ✅ Dentro de finally
    public static void dentroFinally() {
        try {
            // código
        } finally {
            throw new RuntimeException("Erro em finally");
            // ⚠️ Suprime exceção do try (evitar)
        }
    }
    
    // ✅ Em expressão lambda
    public static void lambda() {
        Runnable r = () -> {
            throw new RuntimeException("Erro em lambda");
        };
    }
    
    // ✅ Em bloco estático
    static {
        if (System.getProperty("test") == null) {
            throw new IllegalStateException("Propriedade ausente");
        }
    }
}
```

**Localização**: qualquer lugar **executável** do código.

### 5. Fluxo de Execução

```java
// ✅ Fluxo de execução com throw
public class FluxoExecucao {
    
    public static void demonstrarFluxo() {
        System.out.println("1. Início do método");
        
        try {
            System.out.println("2. Antes do throw");
            
            throw new RuntimeException("Erro");
            
            // System.out.println("3. Após throw");  // ❌ UNREACHABLE
            
        } catch (RuntimeException e) {
            System.out.println("4. Dentro do catch");
            System.out.println("   Mensagem: " + e.getMessage());
            
        } finally {
            System.out.println("5. Dentro do finally");
        }
        
        System.out.println("6. Após try-catch-finally");
        
        /*
         * SAÍDA:
         * 1. Início do método
         * 2. Antes do throw
         * 4. Dentro do catch
         *    Mensagem: Erro
         * 5. Dentro do finally
         * 6. Após try-catch-finally
         * 
         * LINHA 3 NÃO COMPILA (unreachable)
         */
    }
    
    // ✅ Fluxo sem captura
    public static void semCaptura() {
        System.out.println("1. Início");
        
        throw new RuntimeException("Não capturada");
        
        // System.out.println("2. Nunca executa");  // ❌ UNREACHABLE
        
        /*
         * SAÍDA:
         * 1. Início
         * Exception in thread "main" RuntimeException: Não capturada
         */
    }
    
    // ✅ Fluxo com if
    public static void comIf(boolean condicao) {
        System.out.println("1. Início");
        
        if (condicao) {
            System.out.println("2. Dentro do if");
            throw new RuntimeException("Erro");
            // System.out.println("3. Unreachable");  // ❌ UNREACHABLE
        }
        
        System.out.println("4. Fora do if");  // ✅ ALCANÇÁVEL (se !condicao)
    }
}
```

**Fluxo**: throw **interrompe** execução, transfere para **catch** (ou propaga).

### 6. Combinações com Operadores

```java
// ✅ throw com operadores e expressões
public class CombinacoesOperadores {
    
    // ✅ Operador ternário
    public static void ternario(int idade) {
        String mensagem = idade >= 18 
            ? "Maior de idade"
            : throw new IllegalArgumentException("Menor de idade");
        // ↑ throw dentro de expressão ternária (Java 14+)
    }
    
    // ✅ Operador ?? (null-coalescing) - Java 14+
    public static void nullCoalescing(String nome) {
        String nomeValido = nome != null 
            ? nome
            : throw new IllegalArgumentException("Nome null");
    }
    
    // ✅ Concatenação de string
    public static void concatenacao(int valor) {
        throw new IllegalArgumentException("Valor inválido: " + valor);
        // String concatenada na mensagem
    }
    
    // ✅ Interpolação (via métodos)
    public static void interpolacao(String nome, int idade) {
        throw new IllegalArgumentException(
            String.format("Usuário inválido: %s, %d anos", nome, idade)
        );
    }
    
    // ✅ Expressão aritmética na mensagem
    public static void aritmetica(int a, int b) {
        throw new RuntimeException("Soma: " + (a + b));
    }
}
```

**Operadores**: throw pode usar **expressões** (String, ternário, etc.).

### 7. Padrões Comuns

```java
// ✅ Padrões comuns de uso do throw
public class PadroesComuns {
    
    // ✅ Validação de null
    public static void validarNull(Object obj) {
        if (obj == null) {
            throw new IllegalArgumentException("Objeto não pode ser null");
        }
    }
    
    // ✅ Validação de intervalo
    public static void validarIntervalo(int valor, int min, int max) {
        if (valor < min || valor > max) {
            throw new IllegalArgumentException(
                "Valor fora do intervalo: " + valor + " (esperado: " + min + "-" + max + ")"
            );
        }
    }
    
    // ✅ Validação de string vazia
    public static void validarString(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            throw new IllegalArgumentException("Texto vazio ou null");
        }
    }
    
    // ✅ Validação de coleção vazia
    public static void validarColecao(List<?> lista) {
        if (lista == null || lista.isEmpty()) {
            throw new IllegalArgumentException("Lista vazia ou null");
        }
    }
    
    // ✅ Estado inválido
    public static class Conta {
        private boolean ativa = true;
        
        public void operar() {
            if (!ativa) {
                throw new IllegalStateException("Conta inativa");
            }
            // operação
        }
    }
    
    // ✅ Operação não suportada
    public static void naoImplementado() {
        throw new UnsupportedOperationException("Não implementado");
    }
    
    // ✅ Método factory com validação
    public static Usuario criarUsuario(String nome) {
        if (nome == null || nome.isEmpty()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        return new Usuario(nome);
    }
    
    static class Usuario {
        String nome;
        Usuario(String nome) { this.nome = nome; }
    }
}
```

**Padrões**: validação null, intervalo, string vazia, estado, não suportado.

### 8. Código Unreachable

```java
// ✅ Código unreachable após throw
public class CodigoUnreachable {
    
    // ❌ ERRO: código após throw (mesmo bloco)
    public static void erro1() {
        throw new RuntimeException("Erro");
        System.out.println("Unreachable");  // ❌ ERRO compilação
    }
    
    // ❌ ERRO: return após throw
    public static int erro2() {
        throw new RuntimeException("Erro");
        return 42;  // ❌ ERRO compilação (unreachable)
    }
    
    // ✅ OK: throw em if (código fora alcançável)
    public static void ok1(boolean condicao) {
        if (condicao) {
            throw new RuntimeException("Erro");
        }
        System.out.println("Alcançável");  // ✅ OK (se !condicao)
    }
    
    // ✅ OK: throw em todos os caminhos
    public static int ok2(boolean condicao) {
        if (condicao) {
            throw new RuntimeException("Erro A");
        } else {
            throw new RuntimeException("Erro B");
        }
        // Não precisa return (todos os caminhos lançam)
    }
    
    // ✅ OK: throw após return em if
    public static int ok3(boolean condicao) {
        if (condicao) {
            return 42;
        }
        throw new RuntimeException("Erro");
        // ✅ OK: alcançável se !condicao
    }
    
    /*
     * REGRA:
     *   - Código no MESMO bloco após throw: UNREACHABLE
     *   - Código em OUTRO caminho: OK
     *   - Compilador detecta unreachable
     */
}
```

**Unreachable**: código após throw (mesmo bloco) **não compila**.

### 9. Encadeamento de Exceções

```java
// ✅ Encadeamento (exceção com causa)
public class EncadeamentoExcecoes {
    
    // ✅ Lançar com causa
    public static void metodo1() {
        try {
            // código que lança IOException
            throw new IOException("Erro I/O original");
            
        } catch (IOException e) {
            // Lançar nova exceção COM causa original
            throw new RuntimeException("Erro ao processar arquivo", e);
            //                                                       ↑
            //                                                    Causa
        }
    }
    
    // ✅ Verificar causa
    public static void metodo2() {
        try {
            metodo1();
            
        } catch (RuntimeException e) {
            System.err.println("Exceção: " + e.getMessage());
            System.err.println("Causa: " + e.getCause().getMessage());
            
            /*
             * SAÍDA:
             * Exceção: Erro ao processar arquivo
             * Causa: Erro I/O original
             */
        }
    }
    
    // ✅ Stack trace mostra ambas
    public static void metodo3() {
        try {
            metodo1();
            
        } catch (RuntimeException e) {
            e.printStackTrace();
            
            /*
             * SAÍDA:
             * RuntimeException: Erro ao processar arquivo
             *     at ...metodo1...
             * Caused by: IOException: Erro I/O original
             *     at ...metodo1...
             */
        }
    }
    
    // ✅ Múltiplos níveis de causa
    public static void metodo4() {
        try {
            try {
                throw new SQLException("Erro SQL");
            } catch (SQLException e) {
                throw new IOException("Erro I/O", e);
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro processamento", e);
        }
        
        /*
         * CADEIA:
         * RuntimeException
         *   caused by IOException
         *     caused by SQLException
         */
    }
}
```

**Encadeamento**: throw com **causa** preserva exceção original.

### 10. Resumo Visual: Sintaxe throw

```java
/*
 * SINTAXE E USO DE throw
 * 
 * ESTRUTURA BÁSICA:
 * 
 * throw new TipoExcecao("mensagem");
 * ↑     ↑   ↑           ↑
 * │     │   │           └─ Mensagem (String)
 * │     │   └─ Classe da exceção
 * │     └─ Criar instância (new)
 * └─ Lançar exceção (throw)
 * 
 * 
 * CONSTRUTORES:
 * 
 * throw new Exception();
 * throw new Exception("mensagem");
 * throw new Exception(causa);
 * throw new Exception("mensagem", causa);
 * 
 * 
 * EXPRESSÕES VÁLIDAS:
 * 
 * ✅ Literal:
 *    throw new RuntimeException("Erro");
 * 
 * ✅ Variável:
 *    Exception exc = new Exception();
 *    throw exc;
 * 
 * ✅ Método:
 *    throw criarExcecao();
 * 
 * ✅ Ternário:
 *    throw condicao ? new ExcA() : new ExcB();
 * 
 * ❌ INVÁLIDO:
 *    throw null;  // NullPointerException
 *    throw 42;    // Não é Throwable
 * 
 * 
 * FLUXO DE EXECUÇÃO:
 * 
 * System.out.println("1. Antes");
 * throw new RuntimeException("Erro");
 * System.out.println("2. Unreachable");  // ❌ NÃO COMPILA
 * 
 * 
 * COM if:
 * 
 * if (invalido) {
 *     throw new Exception();
 * }
 * System.out.println("OK");  // ✅ Alcançável se !invalido
 * 
 * 
 * PADRÕES COMUNS:
 * 
 * // Validar null
 * if (obj == null) {
 *     throw new IllegalArgumentException("null");
 * }
 * 
 * // Validar intervalo
 * if (valor < 0 || valor > 100) {
 *     throw new IllegalArgumentException("Fora: " + valor);
 * }
 * 
 * // Validar estado
 * if (!ativo) {
 *     throw new IllegalStateException("Inativo");
 * }
 * 
 * // Relançar
 * catch (IOException e) {
 *     throw e;
 * }
 * 
 * // Encadear
 * catch (IOException e) {
 *     throw new RuntimeException("Erro", e);
 * }
 * 
 * 
 * LOCALIZAÇÃO:
 * 
 * ✅ Dentro de método
 * ✅ Dentro de if/else
 * ✅ Dentro de loop
 * ✅ Dentro de try/catch/finally
 * ✅ Dentro de lambda
 * ✅ Bloco estático
 * 
 * 
 * ENCADEAMENTO:
 * 
 * try {
 *     throw new IOException("Original");
 * } catch (IOException e) {
 *     throw new RuntimeException("Wrapper", e);
 *     //                                    ↑
 *     //                                  Causa
 * }
 * 
 * // Acessar causa:
 * exception.getCause()
 * 
 * 
 * CÓDIGO UNREACHABLE:
 * 
 * throw new Exception();
 * return 42;  // ❌ ERRO: unreachable
 * 
 * if (erro) {
 *     throw new Exception();
 * }
 * return 42;  // ✅ OK: alcançável se !erro
 */

public class ResumoSintaxeThrow {
    public static void main(String[] args) {
        System.out.println("=== SINTAXE throw ===");
        System.out.println("\n✅ Estrutura:");
        System.out.println("  throw new TipoExcecao(\"mensagem\")");
        System.out.println("\n✅ Características:");
        System.out.println("  - Instrução EXECUTÁVEL");
        System.out.println("  - Cria INSTÂNCIA");
        System.out.println("  - INTERROMPE fluxo");
        System.out.println("\n✅ Construtores:");
        System.out.println("  - Vazio, mensagem, causa, mensagem+causa");
    }
}
```

---

## Aplicabilidade

**throw**:
- **Instrução** executável
- **Cria** instância de exceção
- **Interrompe** fluxo

---

## Armadilhas

### 1. throw null

```java
// ❌ throw null
throw null;  // NullPointerException em runtime

// ✅ throw instância
throw new RuntimeException();
```

### 2. Código Unreachable

```java
// ❌ Código após throw
throw new RuntimeException();
return 42;  // ❌ ERRO: unreachable

// ✅ throw em if
if (erro) throw new RuntimeException();
return 42;  // ✅ OK
```

### 3. Tipo Não-Throwable

```java
// ❌ Tipo não-Throwable
throw "erro";  // ❌ ERRO: String não é Throwable
throw 42;      // ❌ ERRO: int não é Throwable

// ✅ Tipo Throwable
throw new RuntimeException("erro");
```

---

## Boas Práticas

### 1. Mensagem Informativa

```java
// ✅ Mensagem específica
throw new IllegalArgumentException(
    "Idade inválida: " + idade + " (esperado: 0-150)"
);

// ❌ Mensagem genérica
throw new IllegalArgumentException("Inválido");
```

### 2. Encadear Exceções

```java
// ✅ Preservar causa original
catch (IOException e) {
    throw new RuntimeException("Erro processamento", e);
}

// ❌ Perder causa original
catch (IOException e) {
    throw new RuntimeException("Erro processamento");
}
```

### 3. Exceção Apropriada

```java
// ✅ Tipo específico
throw new IllegalArgumentException();  // Parâmetro
throw new IllegalStateException();     // Estado
throw new IOException();               // I/O

// ❌ Genérico demais
throw new Exception();  // Muito genérico
```

---

## Resumo

**throw**: instrução para **lançar** exceção.

**Sintaxe**:
```java
throw new TipoExcecao("mensagem");
```

**Estrutura**:
- **throw**: palavra-chave
- **new**: criar instância
- **TipoExcecao**: classe de exceção
- **"mensagem"**: mensagem de erro

**Construtores**:
- Vazio: `new Exception()`
- Mensagem: `new Exception("msg")`
- Causa: `new Exception(causa)`
- Mensagem+Causa: `new Exception("msg", causa)`

**Expressões**:
- **Literal**: `throw new Exc()`
- **Variável**: `throw exc`
- **Método**: `throw criar()`
- **Ternário**: `throw cond ? new A() : new B()`

**Fluxo**:
- **Interrompe** execução normal
- **Transfere** para catch (ou propaga)
- Código após throw **unreachable** (mesmo bloco)

**Localização**:
- Dentro de **método**
- Dentro de **if/else**
- Dentro de **loop**
- Dentro de **try/catch/finally**
- Dentro de **lambda**
- **Bloco estático**

**Padrões**:
- Validar **null**
- Validar **intervalo**
- Validar **string** vazia
- Validar **estado**
- **Relançar** exceção
- **Encadear** exceção (com causa)

**Encadeamento**:
- `throw new Exc("msg", causa)`
- Preserva exceção **original**
- `getCause()` retorna causa
- Stack trace mostra **ambas**

**Unreachable**:
- Código após throw (mesmo bloco) **não compila**
- Código em **outro caminho** OK
- Compilador **detecta** unreachable

**Regra de Ouro**: Usar throw para **lançar** exceção manualmente. Sempre criar **instância** (new). Mensagem **informativa** com contexto. **Encadear** exceções (preservar causa). Código após throw **unreachable** (erro compilação). Validar parâmetros/estado no **início** do método.

