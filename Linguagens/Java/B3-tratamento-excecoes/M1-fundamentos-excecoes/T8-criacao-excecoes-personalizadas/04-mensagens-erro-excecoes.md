# T8.04 - Mensagens de Erro em Exceções

## Introdução

**Mensagens de erro**: descrição **clara** e **acionável** do problema.

```java
/*
 * MENSAGENS DE ERRO
 * 
 * BOA MENSAGEM:
 *   ✅ Clara e específica
 *   ✅ Indica O QUE deu errado
 *   ✅ Mostra valores relevantes
 *   ✅ Sugere COMO corrigir
 * 
 * MÁ MENSAGEM:
 *   ❌ Genérica ("Erro")
 *   ❌ Sem contexto
 *   ❌ Sem valores
 *   ❌ Não acionável
 */

// ❌ Mensagem RUIM
throw new Exception("Erro");
// Genérica, sem contexto

// ✅ Mensagem BOA
throw new Exception("Saldo insuficiente: disponível R$ 100.00, tentado sacar R$ 150.00");
// Específica, com valores, contexto claro
```

**Mensagem boa**: **específica**, com **valores**, **acionável**.

---

## Fundamentos

### 1. Mensagens Específicas vs Genéricas

```java
// ❌ Mensagens GENÉRICAS (evitar)
public class MensagensRuins {
    
    public void sacar1(double valor) throws Exception {
        if (valor > saldo) {
            throw new Exception("Erro");  // ❌ Muito genérico
        }
    }
    
    public void sacar2(double valor) throws Exception {
        if (valor > saldo) {
            throw new Exception("Operação inválida");  // ❌ Pouco específico
        }
    }
    
    public void sacar3(double valor) throws Exception {
        if (valor > saldo) {
            throw new Exception("Falha");  // ❌ Sem contexto
        }
    }
    
    private double saldo = 100;
}

// ✅ Mensagens ESPECÍFICAS (preferir)
public class MensagensBoas {
    
    public void sacar1(double valor) throws Exception {
        if (valor > saldo) {
            throw new Exception("Saldo insuficiente");  // ✅ Específico
        }
    }
    
    public void sacar2(double valor) throws Exception {
        if (valor > saldo) {
            throw new Exception("Saldo insuficiente: disponível " + saldo + ", solicitado " + valor);
            // ✅ Específico COM VALORES
        }
    }
    
    public void sacar3(double valor) throws Exception {
        if (valor > saldo) {
            throw new Exception("Não foi possível sacar R$ " + valor + ". Saldo disponível: R$ " + saldo);
            // ✅ Específico, valores, contexto completo
        }
    }
    
    private double saldo = 100;
}

/*
 * ESPECÍFICA vs GENÉRICA:
 * 
 * ❌ Genérica: "Erro", "Falha", "Operação inválida"
 * ✅ Específica: "Saldo insuficiente", "Arquivo não encontrado"
 */
```

**Específica**: descrever **exatamente** o que deu errado.

### 2. Incluir Valores Relevantes

```java
// ✅ Mensagens COM VALORES
public class MensagensComValores {
    
    // ✅ Incluir valor recebido
    public void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException(
                "Idade inválida: " + idade + ". Deve estar entre 0 e 150"
                //                 ↑
                //            Valor recebido
            );
        }
    }
    
    // ✅ Incluir nome do arquivo
    public void lerArquivo(String nome) throws IOException {
        if (!new File(nome).exists()) {
            throw new FileNotFoundException(
                "Arquivo não encontrado: '" + nome + "'"
                //                          ↑
                //                     Nome do arquivo
            );
        }
    }
    
    // ✅ Incluir índice e tamanho
    public void acessar(int indice) {
        int tamanho = 10;
        if (indice < 0 || indice >= tamanho) {
            throw new IndexOutOfBoundsException(
                "Índice " + indice + " fora do intervalo [0, " + (tamanho - 1) + "]"
                //       ↑                                    ↑
                //    Índice                            Intervalo válido
            );
        }
    }
    
    // ✅ Incluir múltiplos valores
    public void transferir(double valor, double saldoOrigem, double saldoDestino) throws Exception {
        if (valor > saldoOrigem) {
            throw new Exception(
                "Transferência de R$ " + valor + " impossível. " +
                "Saldo origem: R$ " + saldoOrigem + ", " +
                "Saldo destino: R$ " + saldoDestino
            );
        }
    }
}

/*
 * INCLUIR VALORES:
 *   ✅ Valor recebido (idade, índice, etc.)
 *   ✅ Valores esperados (intervalo, formato, etc.)
 *   ✅ Estado atual (saldo, tamanho, etc.)
 *   ✅ Contexto (arquivo, usuário, etc.)
 */
```

**Valores**: incluir valor **recebido**, **esperado**, **estado** atual.

### 3. Mensagens Acionáveis

```java
// ✅ Mensagens ACIONÁVEIS (sugerem solução)
public class MensagensAcionaveis {
    
    // ✅ Diz O QUE fazer
    public void validarEmail(String email) {
        if (!email.contains("@")) {
            throw new IllegalArgumentException(
                "Email inválido: '" + email + "'. O email deve conter '@'"
                //                                                  ↑
                //                                         Diz o que deve conter
            );
        }
    }
    
    // ✅ Sugere alternativa
    public void conectar(String url) throws Exception {
        if (url == null) {
            throw new IllegalArgumentException(
                "URL não pode ser null. Forneça uma URL válida como 'http://example.com'"
                //                                                  ↑
                //                                            Exemplo de URL válida
            );
        }
    }
    
    // ✅ Explica limite
    public void setCpf(String cpf) {
        if (cpf.length() != 11) {
            throw new IllegalArgumentException(
                "CPF '" + cpf + "' inválido. O CPF deve ter exatamente 11 dígitos"
                //                                                      ↑
                //                                                  Explica regra
            );
        }
    }
    
    // ✅ Sugere ação corretiva
    public void sacar(double valor, double saldo) throws Exception {
        if (valor > saldo) {
            double falta = valor - saldo;
            throw new Exception(
                "Saldo insuficiente. Deposite pelo menos R$ " + falta + " antes de sacar"
                //                                                        ↑
                //                                                  Ação corretiva
            );
        }
    }
}

/*
 * MENSAGEM ACIONÁVEL:
 *   ✅ Explica O QUE está errado
 *   ✅ Diz O QUE fazer para corrigir
 *   ✅ Fornece exemplo de valor válido
 *   ✅ Sugere ação específica
 */
```

**Acionável**: sugere **como** corrigir o erro.

### 4. Formatação de Mensagens

```java
// ✅ Formatação de mensagens
public class FormatacaoMensagens {
    
    // ✅ String.format() para formatação
    public void validar1(String nome, int idade) {
        if (idade < 18) {
            throw new IllegalArgumentException(
                String.format("Usuário '%s' com idade %d é menor de idade", nome, idade)
                //            ↑
                //      Formatação tipo printf
            );
        }
    }
    
    // ✅ Concatenação simples
    public void validar2(double valor) {
        if (valor < 0) {
            throw new IllegalArgumentException(
                "Valor " + valor + " não pode ser negativo"
            );
        }
    }
    
    // ✅ StringBuilder para mensagens complexas
    public void validar3(String nome, String email, int idade) {
        StringBuilder erros = new StringBuilder("Validação falhou:");
        boolean temErro = false;
        
        if (nome == null || nome.isEmpty()) {
            erros.append("\n  - Nome não pode ser vazio");
            temErro = true;
        }
        
        if (email == null || !email.contains("@")) {
            erros.append("\n  - Email inválido");
            temErro = true;
        }
        
        if (idade < 0 || idade > 150) {
            erros.append("\n  - Idade deve estar entre 0 e 150");
            temErro = true;
        }
        
        if (temErro) {
            throw new IllegalArgumentException(erros.toString());
        }
    }
    
    // ✅ MessageFormat para templates
    public void validar4(String campo, Object valorRecebido, Object valorEsperado) {
        String template = "Campo ''{0}'' inválido. Recebido: {1}, Esperado: {2}";
        throw new IllegalArgumentException(
            MessageFormat.format(template, campo, valorRecebido, valorEsperado)
        );
    }
}

/*
 * FORMATAÇÃO:
 *   ✅ String.format() - tipo printf
 *   ✅ Concatenação (+) - simples
 *   ✅ StringBuilder - múltiplas linhas
 *   ✅ MessageFormat - templates
 */
```

**Formatação**: String.format(), concatenação, StringBuilder, **MessageFormat**.

### 5. Contexto na Mensagem

```java
// ✅ Incluir CONTEXTO
public class MensagensComContexto {
    
    // ✅ Contexto: operação sendo executada
    public void processar(int userId) throws Exception {
        try {
            // processar
            throw new SQLException("Erro banco");
        } catch (SQLException e) {
            throw new Exception("Erro ao processar usuário " + userId, e);
            //                                            ↑
            //                                      Contexto: userId
        }
    }
    
    // ✅ Contexto: caminho do arquivo
    public void ler(String arquivo, int linha) throws Exception {
        try {
            // ler
            throw new IOException("Formato inválido");
        } catch (IOException e) {
            throw new Exception("Erro ao ler " + arquivo + " linha " + linha, e);
            //                               ↑                        ↑
            //                          Arquivo                    Linha
        }
    }
    
    // ✅ Contexto: estado do objeto
    public void ativar() {
        if (ativa) {
            throw new IllegalStateException(
                "Conta já está ativa. Id: " + id + ", titular: " + titular
                //                           ↑                    ↑
                //                         Id                  Titular
            );
        }
    }
    
    private boolean ativa = true;
    private int id = 123;
    private String titular = "João";
}

/*
 * CONTEXTO:
 *   ✅ Operação (processar, ler, salvar)
 *   ✅ Identificadores (userId, orderId, etc.)
 *   ✅ Localização (arquivo, linha, método)
 *   ✅ Estado (ativa, saldo, status)
 */
```

**Contexto**: incluir **operação**, **IDs**, **localização**, **estado**.

### 6. Mensagens Multilinha

```java
// ✅ Mensagens MULTILINHA
public class MensagensMultilinha {
    
    public void validar(Pedido pedido) {
        if (pedido.getItens().isEmpty()) {
            throw new IllegalArgumentException(
                "Pedido inválido:\n" +
                "  ID: " + pedido.getId() + "\n" +
                "  Cliente: " + pedido.getCliente() + "\n" +
                "  Erro: Pedido sem itens\n" +
                "  Solução: Adicione pelo menos um item ao pedido"
            );
        }
    }
    
    // ✅ Text blocks (Java 15+)
    public void validar2(Pedido pedido) {
        if (pedido.getTotal() < 10) {
            throw new IllegalArgumentException("""
                Pedido inválido:
                  ID: %d
                  Total: R$ %.2f
                  Erro: Valor mínimo não atingido
                  Mínimo: R$ 10.00
                """.formatted(pedido.getId(), pedido.getTotal())
            );
        }
    }
}

/*
 * MULTILINHA:
 *   ✅ \n para quebra de linha
 *   ✅ Text blocks (Java 15+)
 *   ✅ Indentação para legibilidade
 *   ✅ Seções: contexto, erro, solução
 */
```

**Multilinha**: usar `\n` ou **text blocks** (Java 15+).

### 7. Mensagens em Exceções Customizadas

```java
// ✅ Mensagem em exceção customizada
public class SaldoInsuficienteException extends Exception {
    
    private final double saldoDisponivel;
    private final double valorSolicitado;
    
    public SaldoInsuficienteException(double saldoDisponivel, double valorSolicitado) {
        super(criarMensagem(saldoDisponivel, valorSolicitado));
        this.saldoDisponivel = saldoDisponivel;
        this.valorSolicitado = valorSolicitado;
    }
    
    // ✅ Método auxiliar para criar mensagem
    private static String criarMensagem(double saldoDisponivel, double valorSolicitado) {
        double falta = valorSolicitado - saldoDisponivel;
        return String.format(
            "Saldo insuficiente. Disponível: R$ %.2f, Solicitado: R$ %.2f, Falta: R$ %.2f",
            saldoDisponivel, valorSolicitado, falta
        );
    }
    
    public double getSaldoDisponivel() {
        return saldoDisponivel;
    }
    
    public double getValorSolicitado() {
        return valorSolicitado;
    }
}

// ✅ Usar
public void sacar(double valor) throws SaldoInsuficienteException {
    double saldo = 100;
    if (valor > saldo) {
        throw new SaldoInsuficienteException(saldo, valor);
        // Mensagem criada automaticamente
    }
}

/*
 * EXCEÇÃO CUSTOMIZADA:
 *   ✅ Método auxiliar para criar mensagem
 *   ✅ Mensagem consistente
 *   ✅ Incluir valores nos atributos
 */
```

**Customizada**: método auxiliar para **criar mensagem** consistente.

### 8. Mensagens Localizadas

```java
// ✅ Mensagens LOCALIZADAS
public class MensagensLocalizadas {
    
    private static ResourceBundle bundle = ResourceBundle.getBundle("messages");
    
    public void validar(String nome) {
        if (nome == null || nome.isEmpty()) {
            // messages_pt_BR.properties: nome.vazio=Nome não pode ser vazio
            // messages_en_US.properties: nome.vazio=Name cannot be empty
            throw new IllegalArgumentException(bundle.getString("nome.vazio"));
        }
    }
    
    public void validarIdade(int idade) {
        if (idade < 0) {
            // messages_pt_BR.properties: idade.negativa=Idade {0} inválida. Deve ser >= 0
            throw new IllegalArgumentException(
                MessageFormat.format(bundle.getString("idade.negativa"), idade)
            );
        }
    }
}

/*
 * LOCALIZAÇÃO:
 *   ✅ ResourceBundle para mensagens
 *   ✅ Arquivo .properties por idioma
 *   ✅ MessageFormat para parâmetros
 */
```

**Localizada**: ResourceBundle + **MessageFormat** (i18n).

### 9. Mensagens de Log vs Exceção

```java
// ✅ Log vs Exceção
public class LogVsExcecao {
    
    private static final Logger logger = Logger.getLogger("App");
    
    public void processar(int id) throws Exception {
        try {
            // processar
            throw new SQLException("Conexão perdida");
            
        } catch (SQLException e) {
            // LOG: técnico, detalhado
            logger.severe("SQLException ao processar usuário " + id + 
                         ". Query: SELECT * FROM users WHERE id = " + id + 
                         ". Conexão: jdbc:mysql://localhost:3306/db");
            
            // EXCEÇÃO: usuário final, simples
            throw new Exception("Erro ao processar usuário " + id + ". Tente novamente mais tarde", e);
            //                                                                    ↑
            //                                                         Mensagem para usuário
        }
    }
}

/*
 * LOG vs EXCEÇÃO:
 * 
 * LOG:
 *   - Detalhes técnicos
 *   - Query, conexão, stack trace
 *   - Para desenvolvedores/ops
 * 
 * EXCEÇÃO:
 *   - Mensagem simples
 *   - Para usuário final
 *   - Acionável
 */
```

**Log**: técnico/detalhado. **Exceção**: simples/**acionável**.

### 10. Resumo Visual

```java
/*
 * MENSAGENS DE ERRO
 * 
 * MÁ MENSAGEM:
 * ❌ "Erro"
 * ❌ "Operação inválida"
 * ❌ "Falha"
 * 
 * Problemas:
 *   - Genérica
 *   - Sem contexto
 *   - Sem valores
 *   - Não acionável
 * 
 * 
 * BOA MENSAGEM:
 * ✅ "Saldo insuficiente: disponível R$ 100.00, tentado sacar R$ 150.00"
 * ✅ "Idade inválida: 200. Deve estar entre 0 e 150"
 * ✅ "Arquivo não encontrado: '/path/file.txt'"
 * 
 * Qualidades:
 *   - Específica
 *   - Com contexto
 *   - Com valores
 *   - Acionável
 * 
 * 
 * ESTRUTURA BOA MENSAGEM:
 * 
 * "[O QUE]: [VALORES]. [SOLUÇÃO/REGRA]"
 * 
 * Exemplo:
 * "Saldo insuficiente: disponível R$ 100, solicitado R$ 150. Deposite R$ 50"
 *  ↑                  ↑                                       ↑
 *  O QUE              VALORES                                SOLUÇÃO
 * 
 * 
 * INCLUIR:
 * 
 * ✅ O QUE deu errado (específico)
 * ✅ Valores relevantes (recebido, esperado, atual)
 * ✅ Contexto (operação, ID, arquivo, linha)
 * ✅ Solução/regra (como corrigir)
 * 
 * 
 * EVITAR:
 * 
 * ❌ Genérica ("Erro", "Falha")
 * ❌ Sem valores
 * ❌ Sem contexto
 * ❌ Não acionável
 * ❌ Técnica demais (para usuário final)
 * ❌ Vaga demais
 * 
 * 
 * FORMATAÇÃO:
 * 
 * // Simples
 * "Valor " + valor + " inválido"
 * 
 * // printf
 * String.format("Valor %d inválido", valor)
 * 
 * // MessageFormat
 * MessageFormat.format("Valor {0} inválido", valor)
 * 
 * // StringBuilder (multilinha)
 * new StringBuilder()
 *     .append("Erro:\n")
 *     .append("  Valor: ").append(valor).append("\n")
 *     .append("  Esperado: 0-100")
 *     .toString()
 */

public class ExemplosMensagens {
    
    // ❌ RUIM
    public void ruim(double valor) throws Exception {
        if (valor < 0) {
            throw new Exception("Erro");
        }
    }
    
    // ✅ BOM
    public void bom(double valor) throws Exception {
        if (valor < 0) {
            throw new Exception(
                "Valor inválido: " + valor + ". O valor deve ser >= 0"
            );
        }
    }
}
```

---

## Aplicabilidade

**Mensagens de erro**:
- **Específicas** (não genéricas)
- Com **valores** relevantes
- **Acionáveis** (sugerem solução)

---

## Armadilhas

### 1. Mensagens Genéricas

```java
// ❌ Genérica
throw new Exception("Erro");

// ✅ Específica
throw new Exception("Saldo insuficiente: R$ 100 < R$ 150");
```

### 2. Sem Valores

```java
// ❌ Sem valores
throw new IllegalArgumentException("Idade inválida");

// ✅ Com valores
throw new IllegalArgumentException("Idade inválida: 200. Deve estar entre 0 e 150");
```

### 3. Não Acionável

```java
// ❌ Não acionável
throw new Exception("Operação falhou");

// ✅ Acionável
throw new Exception("Operação falhou: saldo insuficiente. Deposite R$ 50");
```

---

## Boas Práticas

### 1. Específica + Valores + Solução

```java
// ✅ Estrutura: O QUE + VALORES + SOLUÇÃO
throw new Exception(
    "Saldo insuficiente: disponível R$ 100, solicitado R$ 150. Deposite R$ 50"
);
```

### 2. Incluir Contexto

```java
// ✅ Contexto: userId, operação
throw new Exception("Erro ao processar usuário " + userId + ": saldo insuficiente");
```

### 3. Mensagem Consistente

```java
// ✅ Método auxiliar para mensagem consistente
private static String criarMensagem(double disponivel, double solicitado) {
    return String.format(
        "Saldo insuficiente. Disponível: R$ %.2f, Solicitado: R$ %.2f",
        disponivel, solicitado
    );
}
```

---

## Resumo

**Mensagens de erro**: descrição **clara** e **acionável** do problema.

**Boa mensagem**:
- **Específica** (não genérica)
- **Valores** relevantes (recebido, esperado, atual)
- **Contexto** (operação, ID, arquivo)
- **Acionável** (sugere solução)

**Estrutura**:
```
"[O QUE]: [VALORES]. [SOLUÇÃO]"
```

**Incluir**:
- O QUE deu errado
- Valores relevantes
- Contexto (ID, arquivo, linha)
- Solução/regra

**Evitar**:
- Genérica ("Erro", "Falha")
- Sem valores
- Sem contexto
- Não acionável

**Formatação**:
- Concatenação `+` (simples)
- `String.format()` (printf)
- `StringBuilder` (multilinha)
- `MessageFormat` (templates)
- Text blocks (Java 15+)

**Customizadas**:
- Método auxiliar criar mensagem
- Mensagem consistente
- Valores em atributos

**Log vs Exceção**:
- **Log**: técnico, detalhado (desenvolvedor)
- **Exceção**: simples, acionável (usuário)

**Regra de Ouro**: Mensagem deve ser **específica** ("Saldo insuficiente", não "Erro"). Incluir **valores** relevantes (saldo, valor solicitado). Adicionar **contexto** (userId, arquivo). Ser **acionável** (sugerir solução). Estrutura: "O QUE: VALORES. SOLUÇÃO". Evitar genérica/vaga. Usar formatação apropriada. Log técnico, exceção simples.

