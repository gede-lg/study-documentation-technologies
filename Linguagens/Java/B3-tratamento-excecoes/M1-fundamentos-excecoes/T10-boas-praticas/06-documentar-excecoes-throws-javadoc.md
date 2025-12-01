# T10.06 - Documentar Exceções com @throws no Javadoc

## Introdução

**Documentação**: exceções devem ser **documentadas** com **@throws** no Javadoc.

```java
/*
 * DOCUMENTAÇÃO DE EXCEÇÕES
 * 
 * ❌ SEM DOCUMENTAÇÃO:
 * - Quem chama não sabe quais exceções esperar
 * - IDE não mostra avisos
 * - Dificulta uso correto
 * 
 * ✅ COM @throws:
 * - Documenta quais exceções são lançadas
 * - Quando e por que são lançadas
 * - IDE mostra na documentação
 */

// ❌ Sem documentação: não sabe quais exceções esperar
public class SemDocumentacao {
    public static void processar(String arquivo) throws IOException {
        FileReader fr = new FileReader(arquivo);
        // Quem chama não sabe:
        // - FileNotFoundException se arquivo não existe?
        // - IOException por quê?
    }
}

// ✅ Com @throws: documenta claramente
public class ComDocumentacao {
    /**
     * Processa o arquivo especificado.
     * 
     * @param arquivo caminho do arquivo a processar
     * @throws FileNotFoundException se o arquivo não existir
     * @throws IOException se houver erro ao ler o arquivo
     */
    public static void processar(String arquivo) throws IOException {
        FileReader fr = new FileReader(arquivo);
        // ✅ Quem chama sabe exatamente quais exceções esperar
    }
}
```

**Regra**: documentar **todas** exceções checked e **relevantes** unchecked com **@throws**.

---

## Fundamentos

### 1. Por Que Documentar

```java
// ✅ Documentação: para que serve
public class PorQueDocumentar {
    
    /**
     * Salva os dados no banco de dados.
     * 
     * @param dados dados a salvar
     * @throws SQLException se houver erro ao conectar ou executar SQL
     * @throws IllegalArgumentException se dados for null
     */
    public static void salvar(String dados) throws SQLException {
        if (dados == null) {
            throw new IllegalArgumentException("Dados não podem ser null");
        }
        
        // Conectar banco e salvar...
    }
}

/*
 * POR QUE DOCUMENTAR:
 * 
 * 1. CONTRATO:
 *    - Define quais exceções método PODE lançar
 *    - Quem chama SABE o que esperar
 * 
 * 2. IDE:
 *    - Mostra documentação ao usar método
 *    - Autocomplete sugere exceções
 *    - Warning se não tratar
 * 
 * 3. MANUTENÇÃO:
 *    - Futuro desenvolvedor entende
 *    - Sabe quando e por que exceção lançada
 * 
 * 4. API PÚBLICA:
 *    - Essencial para bibliotecas
 *    - Usuários externos dependem
 */
```

**Documentar**: contrato, **IDE** mostra, facilita **manutenção**.

### 2. Sintaxe @throws

```java
/**
 * Descrição do método.
 * 
 * @param parametro descrição do parâmetro
 * @return descrição do retorno
 * @throws TipoExcecao1 descrição quando lançada
 * @throws TipoExcecao2 descrição quando lançada
 */
public void metodo(String parametro) throws TipoExcecao1, TipoExcecao2 {
    // ...
}

/*
 * SINTAXE @throws:
 * 
 * @throws NomeDaExcecao descrição de quando é lançada
 * 
 * ELEMENTOS:
 * 1. @throws - tag Javadoc
 * 2. NomeDaExcecao - tipo exato da exceção
 * 3. descrição - quando e por que lançada
 * 
 * ORDEM:
 * 1. Descrição método
 * 2. @param (todos os parâmetros)
 * 3. @return (se houver)
 * 4. @throws (todas as exceções)
 * 
 * ALIAS:
 * @throws === @exception (mesmo significado)
 * Preferir @throws (mais comum)
 */

// ✅ Exemplo completo
public class ExemploSintaxe {
    /**
     * Divide dois números inteiros.
     * 
     * @param dividendo número a ser dividido
     * @param divisor número pelo qual dividir
     * @return resultado da divisão
     * @throws ArithmeticException se divisor for zero
     */
    public static int dividir(int dividendo, int divisor) {
        if (divisor == 0) {
            throw new ArithmeticException("Divisor não pode ser zero");
        }
        return dividendo / divisor;
    }
}
```

**Sintaxe**: `@throws TipoExcecao descrição quando lançada`.

### 3. Checked Exceptions: Obrigatório Documentar

```java
// ✅ Checked: SEMPRE documentar
public class CheckedDocumentar {
    
    /**
     * Lê o conteúdo de um arquivo.
     * 
     * @param caminho caminho do arquivo
     * @return conteúdo do arquivo
     * @throws FileNotFoundException se o arquivo não existir
     * @throws IOException se houver erro ao ler o arquivo
     */
    public static String lerArquivo(String caminho) 
            throws FileNotFoundException, IOException {
        FileReader fr = new FileReader(caminho);  // FileNotFoundException
        BufferedReader br = new BufferedReader(fr);
        
        String linha = br.readLine();  // IOException
        return linha;
    }
    
    /**
     * Busca usuário no banco de dados.
     * 
     * @param id ID do usuário
     * @return dados do usuário
     * @throws SQLException se houver erro ao consultar o banco
     * @throws UserNotFoundException se usuário não for encontrado
     */
    public static User buscarUsuario(int id) 
            throws SQLException, UserNotFoundException {
        // Conectar banco...
        // ✅ Documentar TODAS checked exceptions
        return null;
    }
}

class User { }
class UserNotFoundException extends Exception {
    public UserNotFoundException(String msg) { super(msg); }
}

/*
 * CHECKED EXCEPTIONS:
 * 
 * REGRA:
 * - SEMPRE documentar com @throws
 * - Compilador obriga declarar (throws)
 * - Javadoc deve documentar
 * 
 * POR QUÊ:
 * - Quem chama DEVE tratar ou propagar
 * - Contrato explícito
 * - IDE mostra warning se não tratar
 */
```

**Checked**: **sempre** documentar, contrato explícito.

### 4. Unchecked Exceptions: Relevantes Documentar

```java
// ✅ Unchecked: documentar se RELEVANTES
public class UncheckedDocumentar {
    
    /**
     * Processa uma lista de valores.
     * 
     * @param valores lista de valores
     * @throws IllegalArgumentException se valores for null ou vazio
     * @throws NullPointerException se algum elemento for null
     */
    public static void processar(List<String> valores) {
        if (valores == null || valores.isEmpty()) {
            throw new IllegalArgumentException("Lista não pode ser null ou vazia");
        }
        
        for (String valor : valores) {
            if (valor == null) {
                throw new NullPointerException("Elemento não pode ser null");
            }
            // Processar...
        }
    }
    
    /**
     * Divide dois números.
     * 
     * @param dividendo número a ser dividido
     * @param divisor número pelo qual dividir
     * @return resultado da divisão
     * @throws ArithmeticException se divisor for zero
     */
    public static int dividir(int dividendo, int divisor) {
        // ✅ Documentar mesmo sendo unchecked
        // (ArithmeticException é unchecked)
        return dividendo / divisor;
    }
}

/*
 * UNCHECKED EXCEPTIONS:
 * 
 * REGRA:
 * - Documentar se RELEVANTES para quem chama
 * - Não obrigatório (compilador não força)
 * - Mas RECOMENDADO para API pública
 * 
 * QUANDO DOCUMENTAR:
 * ✅ Lançadas EXPLICITAMENTE (throw new)
 * ✅ Validação de argumentos
 * ✅ Pré-condições importantes
 * 
 * QUANDO NÃO DOCUMENTAR:
 * ❌ NullPointerException por bug (não validado)
 * ❌ IndexOutOfBoundsException por bug
 * ❌ Exceções genéricas de implementação
 * 
 * EXEMPLOS DOCUMENTAR:
 * - IllegalArgumentException (validação)
 * - IllegalStateException (estado inválido)
 * - ArithmeticException (divisão por zero)
 * - UnsupportedOperationException (operação não suportada)
 * 
 * EXEMPLOS NÃO DOCUMENTAR:
 * - NullPointerException (bug, não validação explícita)
 * - ArrayIndexOutOfBoundsException (bug interno)
 */
```

**Unchecked**: documentar se **relevantes** (lançadas explicitamente, validação).

### 5. Descrição Clara

```java
// ❌ Descrição vaga
public class DescricaoVaga {
    /**
     * @throws IOException se houver erro
     */
    public static void metodo1() throws IOException {
        // ❌ "se houver erro" (muito genérico)
    }
    
    /**
     * @throws SQLException erro banco
     */
    public static void metodo2() throws SQLException {
        // ❌ "erro banco" (incompleto)
    }
}

// ✅ Descrição clara e específica
public class DescricaoClara {
    /**
     * Lê configuração do arquivo.
     * 
     * @param arquivo caminho do arquivo
     * @throws FileNotFoundException se o arquivo de configuração não existir
     * @throws IOException se houver erro ao ler o arquivo (permissões, corrupção, etc.)
     */
    public static void metodo1(String arquivo) throws IOException {
        // ✅ Específico: quando e por quê
    }
    
    /**
     * Salva usuário no banco de dados.
     * 
     * @param usuario dados do usuário
     * @throws SQLException se houver erro ao conectar ao banco ou executar INSERT
     * @throws IllegalArgumentException se usuario for null ou ID inválido
     */
    public static void metodo2(User usuario) throws SQLException {
        // ✅ Claro: condições específicas
    }
}

/*
 * DESCRIÇÃO CLARA:
 * 
 * ✅ INCLUIR:
 * - QUANDO é lançada (condição)
 * - POR QUE é lançada (motivo)
 * - EXEMPLOS específicos
 * 
 * ❌ EVITAR:
 * - "se houver erro" (genérico)
 * - "em caso de problema" (vago)
 * - Apenas repetir nome exceção
 * 
 * PADRÃO:
 * @throws TipoExcecao se [condição específica]
 * 
 * EXEMPLOS BONS:
 * - "se o arquivo não existir"
 * - "se divisor for zero"
 * - "se lista for null ou vazia"
 * - "se usuário não for encontrado no banco"
 * - "se conexão com servidor falhar"
 * 
 * EXEMPLOS RUINS:
 * - "em caso de erro"
 * - "se algo der errado"
 * - "IOException"
 */
```

**Descrição**: **específica** (quando, por quê), não genérica ("se houver erro").

### 6. Múltiplas Exceções

```java
// ✅ Múltiplas exceções: uma @throws para cada
public class MultiplasExcecoes {
    
    /**
     * Processa um pedido de compra.
     * 
     * @param pedidoId ID do pedido
     * @throws SQLException se houver erro ao acessar o banco de dados
     * @throws PedidoNotFoundException se o pedido não for encontrado
     * @throws PagamentoException se houver erro ao processar pagamento
     * @throws EstoqueInsuficienteException se não houver estoque suficiente
     */
    public static void processarPedido(int pedidoId) 
            throws SQLException, PedidoNotFoundException, 
                   PagamentoException, EstoqueInsuficienteException {
        // ✅ Cada exceção com próprio @throws
    }
    
    /**
     * Importa dados de um arquivo CSV.
     * 
     * @param arquivo caminho do arquivo CSV
     * @throws FileNotFoundException se o arquivo não existir
     * @throws IOException se houver erro ao ler o arquivo
     * @throws CSVParseException se o formato CSV for inválido
     * @throws IllegalArgumentException se arquivo for null
     */
    public static void importarCSV(String arquivo) 
            throws IOException, CSVParseException {
        // ✅ Uma tag @throws por exceção
    }
}

class PedidoNotFoundException extends Exception { 
    public PedidoNotFoundException(String msg) { super(msg); }
}
class PagamentoException extends Exception {
    public PagamentoException(String msg) { super(msg); }
}
class EstoqueInsuficienteException extends Exception {
    public EstoqueInsuficienteException(String msg) { super(msg); }
}
class CSVParseException extends Exception {
    public CSVParseException(String msg) { super(msg); }
}

/*
 * MÚLTIPLAS EXCEÇÕES:
 * 
 * REGRA:
 * - UMA tag @throws para CADA exceção
 * - NÃO agrupar exceções em uma tag
 * 
 * ✅ CORRETO:
 * @throws IOException se...
 * @throws SQLException se...
 * 
 * ❌ ERRADO:
 * @throws IOException ou SQLException se...
 * 
 * ORDEM:
 * - Checked primeiro
 * - Depois unchecked
 * - Ou ordem alfabética
 */
```

**Múltiplas**: **uma** @throws para **cada** exceção, não agrupar.

### 7. Hierarquia de Exceções

```java
// ✅ Hierarquia: documentar tipo mais específico
public class HierarquiaExcecoes {
    
    /**
     * Lê um arquivo.
     * 
     * @param arquivo caminho do arquivo
     * @return conteúdo do arquivo
     * @throws FileNotFoundException se o arquivo não existir
     * @throws IOException se houver erro ao ler (permissões, I/O, etc.)
     */
    public static String ler(String arquivo) throws IOException {
        // ✅ Documentar AMBOS: FileNotFoundException E IOException
        // FileNotFoundException extends IOException
        // Mas é importante documentar ambos (mais específica primeiro)
        FileReader fr = new FileReader(arquivo);
        // ...
        return "";
    }
    
    /**
     * Processa dados.
     * 
     * @param dados dados a processar
     * @throws IllegalArgumentException se dados for null
     * @throws IllegalStateException se processamento já foi iniciado
     */
    public static void processar(String dados) {
        // ✅ Ambas extends RuntimeException
        // Documentar tipos específicos (não RuntimeException genérico)
    }
}

/*
 * HIERARQUIA:
 * 
 * REGRA:
 * - Documentar tipo MAIS ESPECÍFICO possível
 * - NÃO apenas tipo genérico (Exception, RuntimeException)
 * 
 * EXEMPLO:
 * FileNotFoundException extends IOException
 * 
 * ✅ DOCUMENTAR AMBOS:
 * @throws FileNotFoundException se arquivo não existir
 * @throws IOException se erro I/O
 * 
 * ❌ NÃO DOCUMENTAR APENAS IOException:
 * @throws IOException se erro
 * // Perde especificidade (FileNotFoundException)
 * 
 * THROWS DECLARATION:
 * - Declarar apenas tipo mais genérico se quiser
 * throws IOException  // OK (inclui FileNotFoundException)
 * 
 * JAVADOC:
 * - Documentar tipos específicos
 * @throws FileNotFoundException ...
 * @throws IOException ...
 */
```

**Hierarquia**: documentar tipo **mais específico** possível.

### 8. Exceções de Métodos Chamados

```java
// ✅ Propagar exceções: documentar
public class ExcecoesMetodosChamados {
    
    /**
     * Copia arquivo de origem para destino.
     * 
     * @param origem arquivo de origem
     * @param destino arquivo de destino
     * @throws FileNotFoundException se arquivo de origem não existir
     * @throws IOException se houver erro ao ler origem ou escrever destino
     */
    public static void copiar(String origem, String destino) throws IOException {
        // lerArquivo() lança IOException
        String conteudo = lerArquivo(origem);
        
        // escreverArquivo() lança IOException
        escreverArquivo(destino, conteudo);
        
        // ✅ Exceções propagadas são documentadas em copiar()
    }
    
    /**
     * Lê conteúdo de arquivo.
     * 
     * @param arquivo caminho do arquivo
     * @return conteúdo do arquivo
     * @throws FileNotFoundException se arquivo não existir
     * @throws IOException se houver erro ao ler
     */
    private static String lerArquivo(String arquivo) throws IOException {
        // ...
        return "";
    }
    
    /**
     * Escreve conteúdo em arquivo.
     * 
     * @param arquivo caminho do arquivo
     * @param conteudo conteúdo a escrever
     * @throws IOException se houver erro ao escrever
     */
    private static void escreverArquivo(String arquivo, String conteudo) 
            throws IOException {
        // ...
    }
}

/*
 * EXCEÇÕES PROPAGADAS:
 * 
 * REGRA:
 * - Se método PROPAGA exceção (throws)
 * - DEVE documentar com @throws
 * 
 * EXEMPLO:
 * metodo1() chama metodo2()
 * metodo2() lança IOException
 * metodo1() propaga IOException
 * 
 * metodo1() DEVE documentar:
 * @throws IOException ...
 * 
 * NÃO DOCUMENTAR:
 * - Exceções TRATADAS (não propagadas)
 * - Exceções encapsuladas em outra exceção
 */

// ✅ Encapsular: documentar exceção nova
public class ExcecaoEncapsulada {
    /**
     * Processa arquivo.
     * 
     * @param arquivo caminho do arquivo
     * @throws ProcessamentoException se houver erro ao processar
     */
    public static void processar(String arquivo) throws ProcessamentoException {
        try {
            lerArquivo(arquivo);  // Lança IOException
        } catch (IOException e) {
            // ✅ Encapsula IOException em ProcessamentoException
            throw new ProcessamentoException("Erro ao processar", e);
        }
        // Documentar ProcessamentoException, NÃO IOException
    }
    
    static String lerArquivo(String arquivo) throws IOException {
        return "";
    }
}

class ProcessamentoException extends Exception {
    public ProcessamentoException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
```

**Propagadas**: documentar se método **propaga** (throws). Encapsuladas: documentar exceção **nova**.

### 9. Exemplos Práticos

```java
// ✅ Exemplos de boa documentação
public class ExemplosPraticos {
    
    /**
     * Conecta ao banco de dados usando as credenciais fornecidas.
     * 
     * @param url URL de conexão JDBC
     * @param usuario nome do usuário
     * @param senha senha do usuário
     * @return conexão estabelecida
     * @throws SQLException se houver erro ao conectar (URL inválida, credenciais incorretas, etc.)
     * @throws IllegalArgumentException se url, usuario ou senha for null ou vazio
     */
    public static Connection conectar(String url, String usuario, String senha) 
            throws SQLException {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("URL não pode ser null ou vazia");
        }
        if (usuario == null || usuario.isEmpty()) {
            throw new IllegalArgumentException("Usuário não pode ser null ou vazio");
        }
        if (senha == null || senha.isEmpty()) {
            throw new IllegalArgumentException("Senha não pode ser null ou vazia");
        }
        
        return DriverManager.getConnection(url, usuario, senha);
    }
    
    /**
     * Envia email para o destinatário especificado.
     * 
     * @param destinatario endereço de email do destinatário
     * @param assunto assunto do email
     * @param mensagem corpo da mensagem
     * @throws EmailException se houver erro ao enviar email (servidor SMTP inacessível, autenticação falhou, etc.)
     * @throws IllegalArgumentException se destinatario, assunto ou mensagem for null ou vazio
     */
    public static void enviarEmail(String destinatario, String assunto, String mensagem) 
            throws EmailException {
        if (destinatario == null || destinatario.isEmpty()) {
            throw new IllegalArgumentException("Destinatário não pode ser null ou vazio");
        }
        // ...
    }
    
    /**
     * Calcula fatorial de um número.
     * 
     * @param n número para calcular fatorial
     * @return fatorial de n
     * @throws IllegalArgumentException se n for negativo
     */
    public static long fatorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Número não pode ser negativo");
        }
        
        long resultado = 1;
        for (int i = 2; i <= n; i++) {
            resultado *= i;
        }
        return resultado;
    }
}

class EmailException extends Exception {
    public EmailException(String msg) { super(msg); }
}
```

**Exemplos**: descrição **específica**, condições **claras**, contexto **completo**.

### 10. Resumo Visual

```java
/*
 * DOCUMENTAR EXCEÇÕES COM @throws NO JAVADOC
 * 
 * SINTAXE:
 * /**
 *  * Descrição do método.
 *  * 
 *  * @param parametro descrição parâmetro
 *  * @return descrição retorno
 *  * @throws TipoExcecao1 descrição quando lançada
 *  * @throws TipoExcecao2 descrição quando lançada
 *  *\/
 * public void metodo(String parametro) 
 *         throws TipoExcecao1, TipoExcecao2 {
 *     // ...
 * }
 * 
 * 
 * REGRAS:
 * 
 * 1. CHECKED:
 * - SEMPRE documentar
 * - Compilador obriga declarar (throws)
 * - Javadoc deve explicar
 * 
 * 2. UNCHECKED:
 * - Documentar se RELEVANTES
 * - Lançadas explicitamente (throw new)
 * - Validação argumentos
 * - NÃO documentar bugs (NPE não validado)
 * 
 * 3. DESCRIÇÃO:
 * - ESPECÍFICA (quando, por quê)
 * - NÃO genérica ("se houver erro")
 * - Condições claras
 * 
 * 4. MÚLTIPLAS:
 * - UMA @throws por exceção
 * - NÃO agrupar
 * 
 * 5. HIERARQUIA:
 * - Tipo MAIS ESPECÍFICO
 * - Não apenas Exception genérico
 * 
 * 6. PROPAGADAS:
 * - Documentar se método propaga (throws)
 * - NÃO documentar se trata
 * 
 * 
 * QUANDO DOCUMENTAR:
 * 
 * ✅ SEMPRE:
 * - Checked exceptions (todas)
 * - Unchecked lançadas explicitamente
 * - Validação argumentos
 * - API pública
 * 
 * ✅ RECOMENDADO:
 * - Pré-condições importantes
 * - Estado inválido
 * - Operações não suportadas
 * 
 * ❌ NÃO DOCUMENTAR:
 * - NullPointerException por bug (não validação)
 * - IndexOutOfBoundsException por bug
 * - Exceções genéricas implementação
 * 
 * 
 * EXEMPLOS BONS:
 * 
 * @throws FileNotFoundException se o arquivo não existir
 * @throws SQLException se houver erro ao conectar ou executar SQL
 * @throws IllegalArgumentException se id for negativo ou null
 * @throws ArithmeticException se divisor for zero
 * @throws UserNotFoundException se usuário com ID fornecido não existir
 * 
 * 
 * EXEMPLOS RUINS:
 * 
 * @throws IOException se houver erro  // ❌ Genérico
 * @throws Exception em caso de problema  // ❌ Vago
 * @throws FileNotFoundException  // ❌ Sem descrição
 * 
 * 
 * PATTERN:
 * 
 * /**
 *  * [Descrição método]
 *  * 
 *  * @param param1 [descrição]
 *  * @param param2 [descrição]
 *  * @return [descrição retorno]
 *  * @throws CheckedException1 se [condição específica]
 *  * @throws CheckedException2 se [condição específica]
 *  * @throws UncheckedException se [condição específica]
 *  *\/
 * 
 * 
 * BENEFÍCIOS:
 * 
 * 1. CONTRATO CLARO:
 *    - Quem chama sabe o que esperar
 * 
 * 2. IDE SUPORTE:
 *    - Mostra na documentação
 *    - Autocomplete
 *    - Warnings
 * 
 * 3. MANUTENÇÃO:
 *    - Código autoexplicativo
 *    - Menos bugs
 * 
 * 4. API PÚBLICA:
 *    - Essencial para bibliotecas
 *    - Usuários dependem
 */

public class ExemploDocumentacao {
    
    /**
     * Processa um arquivo CSV e importa dados para o banco.
     * 
     * @param arquivo caminho do arquivo CSV
     * @param tabela nome da tabela de destino
     * @return número de registros importados
     * @throws FileNotFoundException se o arquivo CSV não existir
     * @throws IOException se houver erro ao ler o arquivo
     * @throws SQLException se houver erro ao inserir dados no banco
     * @throws CSVParseException se o formato do arquivo CSV for inválido
     * @throws IllegalArgumentException se arquivo ou tabela for null ou vazio
     */
    public static int importarCSV(String arquivo, String tabela) 
            throws IOException, SQLException, CSVParseException {
        
        // Validação
        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Arquivo não pode ser null ou vazio");
        }
        if (tabela == null || tabela.isEmpty()) {
            throw new IllegalArgumentException("Tabela não pode ser null ou vazia");
        }
        
        // Ler arquivo
        FileReader fr = new FileReader(arquivo);  // FileNotFoundException, IOException
        
        // Parsear CSV
        parsearCSV(fr);  // CSVParseException
        
        // Inserir banco
        inserirBanco(tabela);  // SQLException
        
        return 0;
    }
    
    static void parsearCSV(FileReader fr) throws CSVParseException { }
    static void inserirBanco(String tabela) throws SQLException { }
}
```

---

## Aplicabilidade

**Sempre documentar**:
- **Checked** exceptions (todas)
- **Unchecked** lançadas explicitamente
- **Validação** argumentos
- API **pública**

**Descrição incluir**:
- **Quando** exceção é lançada (condição)
- **Por que** é lançada (motivo)

---

## Armadilhas

### 1. Sem Documentação

```java
// ❌ Sem @throws
public void metodo() throws IOException {
    // Quem chama não sabe quando IOException
}

// ✅ Com @throws
/**
 * @throws IOException se erro ler arquivo
 */
public void metodo() throws IOException { }
```

### 2. Descrição Genérica

```java
// ❌ Genérico
/**
 * @throws IOException se houver erro
 */

// ✅ Específico
/**
 * @throws IOException se houver erro ao ler arquivo (permissões, I/O)
 */
```

### 3. Não Documentar Unchecked Relevantes

```java
// ❌ Sem documentar IllegalArgumentException
public void dividir(int a, int b) {
    if (b == 0) throw new IllegalArgumentException();
}

// ✅ Documentar
/**
 * @throws IllegalArgumentException se b for zero
 */
public void dividir(int a, int b) { }
```

---

## Boas Práticas

### 1. Sempre Checked

```java
/**
 * @throws IOException ...
 */
public void metodo() throws IOException { }
```

### 2. Unchecked Relevantes

```java
/**
 * @throws IllegalArgumentException se param null
 */
public void metodo(String param) {
    if (param == null) throw new IllegalArgumentException();
}
```

### 3. Descrição Específica

```java
/**
 * @throws FileNotFoundException se arquivo não existir
 * @throws IOException se erro ler arquivo
 */
```

---

## Resumo

**Documentação**: exceções devem ser **documentadas** com **@throws** no Javadoc.

**Sintaxe**:
```java
/**
 * @throws TipoExcecao descrição quando lançada
 */
```

**Por que documentar**:
1. **Contrato**: quem chama sabe o que esperar
2. **IDE**: mostra documentação, autocomplete, warnings
3. **Manutenção**: código autoexplicativo
4. **API pública**: usuários dependem

**Regras**:
- **Checked**: **SEMPRE** documentar (todas)
- **Unchecked**: documentar se **relevantes** (lançadas explicitamente, validação)
- **Descrição**: **específica** (quando, por quê), não genérica
- **Múltiplas**: **uma** @throws por exceção
- **Hierarquia**: tipo **mais específico** possível
- **Propagadas**: documentar se método **propaga** (throws)

**Quando documentar**:
- ✅ Checked exceptions (todas)
- ✅ Unchecked lançadas explicitamente (throw new)
- ✅ Validação argumentos (IllegalArgumentException)
- ✅ API pública
- ✅ Pré-condições importantes
- ❌ NullPointerException por bug (não validação)
- ❌ IndexOutOfBoundsException por bug
- ❌ Exceções genéricas implementação

**Descrição clara**:
- ✅ Incluir: **quando** lançada (condição), **por que** (motivo)
- ✅ Exemplos específicos
- ❌ Evitar: "se houver erro", "em caso de problema", só repetir nome

**Exemplos bons**:
- "se o arquivo não existir"
- "se divisor for zero"
- "se lista for null ou vazia"
- "se houver erro ao conectar ou executar SQL"
- "se usuário com ID fornecido não existir"

**Exemplos ruins**:
- "se houver erro" (genérico)
- "em caso de problema" (vago)
- Apenas tipo sem descrição

**Múltiplas exceções**:
- Uma @throws para **cada** exceção
- Não agrupar ("IOException ou SQLException")

**Hierarquia**:
- Documentar tipo **mais específico**
- FileNotFoundException E IOException (ambos)
- Não apenas Exception genérico

**Exceções propagadas**:
- Documentar se método **propaga** (throws)
- Não documentar se **trata** (catch)

**Encapsuladas**:
- Documentar exceção **nova** (ProcessamentoException)
- Não documentar exceção **encapsulada** (IOException dentro)

**Ordem Javadoc**:
1. Descrição método
2. @param (todos)
3. @return (se houver)
4. @throws (todas)

**Benefícios**:
- Contrato **claro**
- IDE mostra documentação
- Facilita **manutenção**
- Essencial API pública

**Regra de Ouro**: Sempre documentar checked exceptions. Unchecked se relevantes (lançadas explicitamente validação). Descrição específica quando por quê não genérica. Uma @throws por exceção. Tipo mais específico possível. Propagadas documentar se throws. IDE mostra documentação facilita uso correto. API pública essencial.

