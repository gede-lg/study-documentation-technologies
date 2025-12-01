# T7.01 - throw: Lançar Exceção Manualmente

## Introdução

**throw** lança exceção **manualmente** (criada pelo programador).

```java
/*
 * THROW (lançar exceção)
 * 
 * PROPÓSITO:
 *   - Lançar exceção MANUALMENTE
 *   - Criar e lançar instância de exceção
 *   - Interromper execução normal
 *   - Transferir controle para catch
 * 
 * SINTAXE:
 * throw new TipoExcecao("mensagem");
 * 
 * DIFERENÇA throws:
 *   - throw: LANÇA exceção (instrução)
 *   - throws: DECLARA exceção (assinatura método)
 */

// ✅ throw: lançar exceção
public static void validarIdade(int idade) {
    if (idade < 18) {
        throw new IllegalArgumentException("Idade menor que 18");
        // ↑ LANÇA exceção manualmente
    }
    System.out.println("Idade válida: " + idade);
}

// Usar
try {
    validarIdade(15);  // Lança exceção
} catch (IllegalArgumentException e) {
    System.err.println("Erro: " + e.getMessage());
}
```

**throw**: lança exceção **manualmente** (instrução).

---

## Fundamentos

### 1. Sintaxe do throw

```java
// ✅ Sintaxe básica do throw
public class SintaxeThrow {
    
    public static void exemplo1() {
        /*
         * SINTAXE:
         * throw new TipoExcecao();
         * throw new TipoExcecao("mensagem");
         * throw new TipoExcecao("mensagem", causa);
         * 
         * COMPONENTES:
         *   - throw: palavra-chave
         *   - new: criar instância
         *   - TipoExcecao: classe de exceção
         *   - "mensagem": mensagem de erro (opcional)
         */
        
        // ✅ Sem mensagem
        throw new IllegalStateException();
        
        // ✅ Com mensagem
        throw new IllegalArgumentException("Argumento inválido");
        
        // ✅ Com mensagem e causa
        throw new RuntimeException("Erro", new IOException());
    }
    
    /*
     * APÓS throw:
     *   - Código seguinte NÃO executa (unreachable)
     *   - Execução interrompida
     *   - Controle transferido para catch
     */
}
```

**Sintaxe**: `throw new TipoExcecao("mensagem")`.

### 2. Criar e Lançar Exceção

```java
// ✅ Criar e lançar exceção
public class CriarLancarExcecao {
    
    public static void metodo1() {
        // ✅ Criar e lançar em uma linha
        throw new IllegalArgumentException("Erro");
    }
    
    public static void metodo2() {
        // ✅ Criar primeiro, lançar depois
        IllegalArgumentException excecao = 
            new IllegalArgumentException("Erro");
        
        throw excecao;
    }
    
    public static void metodo3() {
        // ✅ Com mensagem detalhada
        String mensagem = "Valor inválido: " + 42;
        throw new IllegalArgumentException(mensagem);
    }
    
    public static void metodo4() {
        // ✅ Com causa
        try {
            // código que pode lançar IOException
        } catch (IOException e) {
            // Lançar nova exceção com causa original
            throw new RuntimeException("Erro ao processar", e);
        }
    }
}
```

**Criar**: `new TipoExcecao()`, **lançar**: `throw`.

### 3. Validação de Parâmetros

```java
// ✅ Uso comum: validar parâmetros
public class ValidacaoParametros {
    
    // ✅ Validar não null
    public static void processar(String texto) {
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser null");
        }
        System.out.println("Processando: " + texto);
    }
    
    // ✅ Validar intervalo
    public static void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException(
                "Idade inválida: " + idade + " (deve ser 0-150)"
            );
        }
        System.out.println("Idade definida: " + idade);
    }
    
    // ✅ Validar lista não vazia
    public static void processar(List<String> lista) {
        if (lista == null || lista.isEmpty()) {
            throw new IllegalArgumentException("Lista vazia ou null");
        }
        System.out.println("Processando " + lista.size() + " itens");
    }
    
    // ✅ Validar múltiplas condições
    public static void criarUsuario(String nome, String email) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
        System.out.println("Usuário criado: " + nome);
    }
    
    // ✅ Usar
    public static void testar() {
        try {
            processar(null);  // Lança exceção
        } catch (IllegalArgumentException e) {
            System.err.println("Erro: " + e.getMessage());
        }
        
        try {
            setIdade(200);  // Lança exceção
        } catch (IllegalArgumentException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
}
```

**Validação**: lançar exceção se parâmetro **inválido**.

### 4. Validação de Estado

```java
// ✅ Validar estado do objeto
public class ValidacaoEstado {
    
    public static class Conta {
        private double saldo;
        private boolean ativa;
        
        public Conta(double saldoInicial) {
            this.saldo = saldoInicial;
            this.ativa = true;
        }
        
        // ✅ Validar estado antes de operar
        public void sacar(double valor) {
            // Validar conta ativa
            if (!ativa) {
                throw new IllegalStateException("Conta inativa");
            }
            
            // Validar valor positivo
            if (valor <= 0) {
                throw new IllegalArgumentException("Valor inválido: " + valor);
            }
            
            // Validar saldo suficiente
            if (valor > saldo) {
                throw new IllegalStateException(
                    "Saldo insuficiente: " + saldo + " < " + valor
                );
            }
            
            saldo -= valor;
            System.out.println("Sacado: " + valor);
        }
        
        public void fechar() {
            if (!ativa) {
                throw new IllegalStateException("Conta já fechada");
            }
            ativa = false;
            System.out.println("Conta fechada");
        }
    }
    
    // ✅ Usar
    public static void testar() {
        Conta conta = new Conta(100);
        
        try {
            conta.sacar(150);  // Lança: saldo insuficiente
        } catch (IllegalStateException e) {
            System.err.println("Erro: " + e.getMessage());
        }
        
        conta.fechar();
        
        try {
            conta.sacar(50);  // Lança: conta inativa
        } catch (IllegalStateException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
}
```

**Estado**: lançar exceção se estado **inválido**.

### 5. Interromper Execução

```java
// ✅ throw interrompe execução
public class InterromperExecucao {
    
    public static void exemplo1() {
        System.out.println("1. Antes do throw");
        
        throw new RuntimeException("Erro");
        
        // System.out.println("2. Depois do throw");  // ❌ ERRO: unreachable
    }
    
    public static void exemplo2(int valor) {
        if (valor < 0) {
            throw new IllegalArgumentException("Negativo");
            // Código aqui NÃO executa
        }
        
        // Este código SÓ executa se valor >= 0
        System.out.println("Valor válido: " + valor);
    }
    
    public static void exemplo3() {
        System.out.println("=== EXECUÇÃO ===");
        
        try {
            System.out.println("1. Antes do throw");
            throw new RuntimeException("Erro");
            // System.out.println("2. Nunca executa");  // ❌ unreachable
            
        } catch (RuntimeException e) {
            System.out.println("3. Catch - exceção capturada");
        }
        
        System.out.println("4. Depois do try-catch");
        
        /*
         * SAÍDA:
         * === EXECUÇÃO ===
         * 1. Antes do throw
         * 3. Catch - exceção capturada
         * 4. Depois do try-catch
         * 
         * Linha "2. Nunca executa" NÃO compila (unreachable)
         */
    }
}
```

**Interrompe**: código após throw **não executa** (unreachable).

### 6. Lançar Checked vs Unchecked

```java
// ✅ Lançar checked vs unchecked
public class CheckedVsUnchecked {
    
    // ✅ Lançar UNCHECKED (RuntimeException)
    public static void lancarUnchecked(int valor) {
        // NÃO precisa throws na assinatura
        if (valor < 0) {
            throw new IllegalArgumentException("Negativo");
        }
    }
    
    // ✅ Lançar CHECKED (Exception)
    public static void lancarChecked(String arquivo) throws IOException {
        // ↑ PRECISA throws na assinatura
        if (!new File(arquivo).exists()) {
            throw new IOException("Arquivo não encontrado");
        }
    }
    
    // ✅ Lançar múltiplas checked
    public static void lancarMultiplas() 
            throws IOException, SQLException {
        
        if (Math.random() > 0.5) {
            throw new IOException("Erro I/O");
        } else {
            throw new SQLException("Erro SQL");
        }
    }
    
    /*
     * REGRA:
     *   - UNCHECKED: NÃO precisa throws
     *   - CHECKED: PRECISA throws (ou capturar)
     */
    
    // ✅ Usar
    public static void testar() throws IOException, SQLException {
        // Unchecked: não precisa try-catch
        lancarUnchecked(10);
        
        // Checked: precisa throws ou try-catch
        lancarChecked("arquivo.txt");  // throws IOException
        lancarMultiplas();  // throws IOException, SQLException
    }
}
```

**Unchecked**: não precisa throws. **Checked**: precisa throws (ou capturar).

### 7. Relançar Exceção

```java
// ✅ Relançar (rethrow) exceção
public class RelançarExcecao {
    
    // ✅ Relançar mesma exceção
    public static void metodo1() throws IOException {
        try {
            // código que lança IOException
            throw new IOException("Erro original");
            
        } catch (IOException e) {
            System.err.println("Log: " + e.getMessage());
            throw e;  // ✅ Relançar mesma exceção
        }
    }
    
    // ✅ Lançar nova exceção com causa
    public static void metodo2() {
        try {
            // código que lança IOException
            throw new IOException("Erro I/O");
            
        } catch (IOException e) {
            // Lançar RuntimeException com causa original
            throw new RuntimeException("Erro ao processar", e);
        }
    }
    
    // ✅ Relançar após cleanup
    public static void metodo3() throws IOException {
        FileReader reader = null;
        try {
            reader = new FileReader("arquivo.txt");
            // usar reader
            
        } catch (IOException e) {
            // Cleanup antes de relançar
            if (reader != null) {
                try { reader.close(); } catch (IOException ex) { }
            }
            throw e;  // Relançar após cleanup
        }
    }
    
    // ✅ Relançar se não puder tratar
    public static void metodo4() throws SQLException {
        try {
            // código que pode lançar várias exceções
            
        } catch (IOException e) {
            // Trata IOException
            System.err.println("Erro I/O: " + e.getMessage());
            
        } catch (SQLException e) {
            // Não sabe tratar SQLException - relançar
            throw e;
        }
    }
}
```

**Relançar**: `throw e` (mesma exceção) ou `throw new Exc(msg, e)` (nova com causa).

### 8. Lançar em Métodos

```java
// ✅ Lançar exceção em métodos
public class LancarEmMetodos {
    
    // ✅ Método que lança unchecked
    public static int dividir(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Divisão por zero");
        }
        return a / b;
    }
    
    // ✅ Método que lança checked
    public static String lerArquivo(String caminho) throws IOException {
        File file = new File(caminho);
        if (!file.exists()) {
            throw new FileNotFoundException("Arquivo não existe: " + caminho);
        }
        // ler arquivo
        return "conteúdo";
    }
    
    // ✅ Método factory que lança
    public static Usuario criarUsuario(String nome, int idade) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
        return new Usuario(nome, idade);
    }
    
    static class Usuario {
        String nome;
        int idade;
        Usuario(String nome, int idade) {
            this.nome = nome;
            this.idade = idade;
        }
    }
    
    // ✅ Método setter que lança
    public static class Produto {
        private double preco;
        
        public void setPreco(double preco) {
            if (preco < 0) {
                throw new IllegalArgumentException("Preço negativo");
            }
            this.preco = preco;
        }
    }
}
```

**Métodos**: lançar exceção se condição **inválida**.

### 9. Mensagens de Erro

```java
// ✅ Mensagens de erro informativas
public class MensagensErro {
    
    // ❌ Mensagem genérica (ruim)
    public static void validarRuim(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
            // ↑ Pouco informativo
        }
    }
    
    // ✅ Mensagem específica (bom)
    public static void validarBom(String email) {
        if (email == null) {
            throw new IllegalArgumentException(
                "Email não pode ser null"
            );
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException(
                "Email inválido (sem @): '" + email + "'"
            );
        }
    }
    
    // ✅ Mensagem com contexto
    public static void sacar(double saldo, double valor) {
        if (valor > saldo) {
            throw new IllegalStateException(
                "Saldo insuficiente: " +
                "saldo=" + saldo + ", valor=" + valor
            );
        }
    }
    
    // ✅ Mensagem com valor recebido
    public static void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException(
                "Idade inválida: " + idade + 
                " (esperado: 0-150)"
            );
        }
    }
    
    /*
     * BOAS MENSAGENS:
     *   ✅ Específicas (o que está errado)
     *   ✅ Contexto (valores atuais)
     *   ✅ Expectativa (valores esperados)
     *   ✅ Acionável (como corrigir)
     */
}
```

**Mensagens**: específicas, com **contexto** e **valores**.

### 10. Resumo Visual: throw

```java
/*
 * THROW (lançar exceção)
 * 
 * SINTAXE:
 * 
 * throw new TipoExcecao("mensagem");
 * 
 * 
 * COMPONENTES:
 * 
 * throw → palavra-chave (lançar)
 * new → criar instância
 * TipoExcecao → classe de exceção
 * "mensagem" → mensagem de erro
 * 
 * 
 * FLUXO DE EXECUÇÃO:
 * 
 * 1. Executar código
 *    ↓
 * 2. Avaliar condição
 *    ↓
 * 3. throw new Excecao()  ← Lança exceção
 *    ↓
 * 4. Interrompe execução normal
 *    ↓
 * 5. Transfere controle para catch
 *    (ou propaga se não capturado)
 * 
 * 
 * EXEMPLO COMPLETO:
 * 
 * public static void validar(int idade) {
 *     if (idade < 0) {
 *         throw new IllegalArgumentException("Idade negativa: " + idade);
 *         // ↑ LANÇA exceção
 *         // Código aqui NÃO executa (unreachable)
 *     }
 *     System.out.println("Idade válida");  // SÓ executa se >= 0
 * }
 * 
 * try {
 *     validar(-5);  // Lança exceção
 * } catch (IllegalArgumentException e) {
 *     System.err.println(e.getMessage());  // "Idade negativa: -5"
 * }
 * 
 * 
 * CHECKED vs UNCHECKED:
 * 
 * ┌──────────────────┬────────────┬──────────────────┐
 * │                  │ Unchecked  │ Checked          │
 * ├──────────────────┼────────────┼──────────────────┤
 * │ throw            │ ✅ Sim     │ ✅ Sim           │
 * │ throws na método │ ❌ Não     │ ✅ Sim (ou catch)│
 * │ Exemplos         │ Runtime    │ IOException      │
 * │                  │ Illegal... │ SQLException     │
 * └──────────────────┴────────────┴──────────────────┘
 * 
 * 
 * USOS COMUNS:
 * 
 * ✅ Validar parâmetros:
 *    if (param == null) throw new IllegalArgumentException();
 * 
 * ✅ Validar estado:
 *    if (!ativo) throw new IllegalStateException();
 * 
 * ✅ Falha de operação:
 *    if (!sucesso) throw new IOException();
 * 
 * ✅ Relançar:
 *    catch (Exception e) { throw e; }
 * 
 * ✅ Encadear:
 *    catch (IOException e) { throw new RuntimeException(msg, e); }
 * 
 * 
 * MENSAGENS DE ERRO:
 * 
 * ❌ Genérica:
 *    throw new IllegalArgumentException("Inválido");
 * 
 * ✅ Específica:
 *    throw new IllegalArgumentException(
 *        "Idade inválida: " + idade + " (esperado: 0-150)"
 *    );
 * 
 * 
 * DIFERENÇA throw vs throws:
 * 
 * throw:
 *   - LANÇA exceção (instrução)
 *   - Dentro do método (corpo)
 *   - Cria e lança instância
 *   - throw new Exception()
 * 
 * throws:
 *   - DECLARA exceção (assinatura)
 *   - Na assinatura do método
 *   - Informa que pode lançar
 *   - void metodo() throws Exception
 */

public class ResumoThrow {
    public static void main(String[] args) {
        System.out.println("=== THROW (lançar) ===");
        System.out.println("\n✅ Sintaxe:");
        System.out.println("  throw new TipoExcecao(\"mensagem\")");
        System.out.println("\n✅ Propósito:");
        System.out.println("  - Lançar exceção MANUALMENTE");
        System.out.println("  - Interromper execução");
        System.out.println("  - Transferir para catch");
        System.out.println("\n✅ Usos:");
        System.out.println("  - Validar parâmetros");
        System.out.println("  - Validar estado");
        System.out.println("  - Relançar exceção");
    }
}
```

---

## Aplicabilidade

**throw**:
- **Lança** exceção manualmente
- **Interrompe** execução
- **Valida** parâmetros/estado

---

## Armadilhas

### 1. Código Unreachable

```java
// ❌ Código após throw (unreachable)
public void metodo() {
    throw new RuntimeException();
    System.out.println("Não executa");  // ❌ ERRO compilação
}

// ✅ Sem código após throw
public void metodo() {
    throw new RuntimeException();
}
```

### 2. Lançar null

```java
// ❌ Lançar null
throw null;  // ❌ NullPointerException em runtime

// ✅ Lançar instância
throw new RuntimeException();
```

### 3. Checked Sem throws

```java
// ❌ Checked sem throws/catch
public void metodo() {
    throw new IOException();  // ❌ ERRO: precisa throws
}

// ✅ Com throws
public void metodo() throws IOException {
    throw new IOException();
}
```

---

## Boas Práticas

### 1. Mensagens Informativas

```java
// ✅ Mensagem específica com contexto
throw new IllegalArgumentException(
    "Idade inválida: " + idade + " (esperado: 0-150)"
);
```

### 2. Validar Parâmetros

```java
// ✅ Validar no início do método
public void metodo(String param) {
    if (param == null) {
        throw new IllegalArgumentException("Param null");
    }
    // resto do método
}
```

### 3. Exceção Apropriada

```java
// ✅ Usar tipo de exceção apropriado
throw new IllegalArgumentException();  // Parâmetro inválido
throw new IllegalStateException();     // Estado inválido
throw new UnsupportedOperationException();  // Não suportado
```

---

## Resumo

**throw**: lança exceção **manualmente** (instrução).

**Sintaxe**:
```java
throw new TipoExcecao("mensagem");
```

**Propósito**:
- **Lançar** exceção manualmente
- **Criar** instância de exceção
- **Interromper** execução normal
- **Transferir** controle para catch

**Fluxo**:
1. Avaliar **condição**
2. **throw** new Exception()
3. **Interrompe** execução
4. **Transfere** para catch (ou propaga)

**Checked vs Unchecked**:
- **Unchecked**: não precisa throws na assinatura
- **Checked**: precisa throws (ou capturar)

**Usos**:
- **Validar** parâmetros (null, intervalo, formato)
- **Validar** estado (inativo, fechado, inválido)
- **Falha** operação (I/O, banco, rede)
- **Relançar** exceção (`throw e`)
- **Encadear** exceção (`throw new Exc(msg, e)`)

**Interrupção**:
- Código após throw **não executa** (unreachable)
- Compilador **detecta** código unreachable
- **Erro** de compilação

**Mensagens**:
- **Específicas** (o que está errado)
- **Contexto** (valores atuais)
- **Expectativa** (valores esperados)
- **Acionável** (como corrigir)

**vs throws**:
- **throw**: LANÇA exceção (instrução, corpo método)
- **throws**: DECLARA exceção (assinatura método)

**Regra de Ouro**: Usar throw para **validar** parâmetros/estado. Lançar exceção **apropriada** (IllegalArgumentException para parâmetro, IllegalStateException para estado). Mensagem **informativa** com **contexto**. Checked precisa **throws** na assinatura (ou capturar). Código após throw **não compila** (unreachable).

