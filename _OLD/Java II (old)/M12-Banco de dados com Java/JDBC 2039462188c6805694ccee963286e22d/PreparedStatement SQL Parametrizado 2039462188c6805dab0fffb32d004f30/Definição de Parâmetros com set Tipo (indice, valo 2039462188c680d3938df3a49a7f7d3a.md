# Definição de Parâmetros com set<Tipo>(indice, valor)

Olá, Gedê\! Como desenvolvedor Backend Java, sei que você já tem uma boa base em JDBC. A.R.I.A está aqui para te dar um guia detalhado sobre `PreparedStatement` e o método `set<Tipo>(indice, valor)`, que é fundamental para a segurança e performance das suas aplicações Java com banco de dados.

Vamos mergulhar fundo neste tópico essencial do JDBC.

### 1\. Introdução

No desenvolvimento de aplicações que interagem com bancos de dados, a segurança e a eficiência são pilares fundamentais. O Java Database Connectivity (JDBC) oferece uma API robusta para essa interação, e um dos seus recursos mais poderosos é o `PreparedStatement`. Este objeto é crucial para a execução de comandos SQL pré-compilados, especialmente quando se lida com dados variáveis.

A relevância do `PreparedStatement` reside principalmente em dois aspectos:

- **Prevenção de Ataques de Injeção SQL:** Ao parametrizar as consultas, ele impede que dados inseridos pelo usuário sejam interpretados como parte da lógica SQL, frustrando tentativas de ataques maliciosos.
- **Melhora de Performance:** Consultas repetitivas podem ser executadas de forma mais eficiente, pois o banco de dados pode pré-compilar o plano de execução da query uma única vez, otimizando o reuso.

O tema principal aqui é o `PreparedStatement`, e mais especificamente, como os métodos `set<Tipo>(indice, valor)` são utilizados para definir os valores dos parâmetros em uma consulta parametrizada. Para que servem? Eles permitem que você insira dados de forma segura e com o tipo correto nos marcadores de posição (`?`) de uma instrução SQL.

### 2\. Sumário

- Definição e Conceitos Fundamentais do `PreparedStatement`
- Sintaxe e Estrutura da Definição de Parâmetros
- Componentes Principais: Métodos `set<Tipo>`
- Restrições de Uso e Melhores Práticas
- Exemplos de Código Otimizados
- Informações Adicionais sobre `PreparedStatement`
- Referências para Estudo Independente

### 3\. Conteúdo Detalhado

### Definição e Conceitos Fundamentais do `PreparedStatement`

O `PreparedStatement` é uma interface no pacote `java.sql` que estende a interface `Statement`. Ele é usado para executar instruções SQL pré-compiladas. Diferente do `Statement` comum, que simplesmente executa uma string SQL, o `PreparedStatement` permite que você crie instruções SQL com "marcadores de posição" (placeholders), representados por pontos de interrogação (`?`). Esses marcadores são preenchidos posteriormente com valores, antes da execução da consulta.

**Para que serve o `PreparedStatement`?**

1. **Segurança (Prevenção de Injeção SQL):** Esta é a principal vantagem. Ao usar `PreparedStatement`, os valores dos parâmetros são enviados ao banco de dados separadamente da instrução SQL. O banco de dados então trata esses valores estritamente como dados, e não como parte do código SQL. Isso anula a maioria das técnicas de injeção SQL, onde entradas maliciosas do usuário podem alterar a intenção da consulta.
2. **Performance:** Para instruções SQL que são executadas várias vezes com diferentes valores de parâmetros (como uma instrução `INSERT` dentro de um loop), o `PreparedStatement` pode ser mais eficiente. O banco de dados pode analisar, compilar e otimizar o plano de execução da consulta uma única vez, e depois reutilizá-lo para cada execução, apenas trocando os valores dos parâmetros. Isso reduz o overhead de parsing e otimização.
3. **Facilidade de Uso:** Torna o código mais limpo e legível, especialmente quando há muitos parâmetros ou strings SQL complexas.

### Sintaxe e Estrutura da Definição de Parâmetros

A sintaxe básica para trabalhar com `PreparedStatement` envolve primeiramente a sua criação a partir de um objeto `Connection`, e em seguida a definição dos parâmetros usando os métodos `set<Tipo>(indice, valor)`.

**Exemplo de Declaração e Utilização:**

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Date; // Para setDate

public class ExemploPreparedStatement {

    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/meubanco";
        String usuario = "root";
        String senha = "password";

        String sqlInsert = "INSERT INTO usuarios (nome, email, idade, data_registro) VALUES (?, ?, ?, ?)";
        String sqlUpdate = "UPDATE produtos SET preco = ? WHERE id = ?";
        String sqlDelete = "DELETE FROM pedidos WHERE status = ? AND data_pedido < ?";

        try (Connection conexao = DriverManager.getConnection(url, usuario, senha);
             PreparedStatement pstmtInsert = conexao.prepareStatement(sqlInsert);
             PreparedStatement pstmtUpdate = conexao.prepareStatement(sqlUpdate);
             PreparedStatement pstmtDelete = conexao.prepareStatement(sqlDelete)) {

            // Exemplo de INSERT
            System.out.println("Executando INSERT...");
            pstmtInsert.setString(1, "Gedê"); // Primeiro '?' (índice 1)
            pstmtInsert.setString(2, "gede@example.com"); // Segundo '?' (índice 2)
            pstmtInsert.setInt(3, 23); // Terceiro '?' (índice 3)
            pstmtInsert.setDate(4, new Date(System.currentTimeMillis())); // Quarto '?' (índice 4)
            int linhasAfetadasInsert = pstmtInsert.executeUpdate();
            System.out.println("Linhas afetadas no INSERT: " + linhasAfetadasInsert);

            // Exemplo de UPDATE
            System.out.println("\\nExecutando UPDATE...");
            pstmtUpdate.setDouble(1, 150.75); // Primeiro '?' (índice 1)
            pstmtUpdate.setInt(2, 101); // Segundo '?' (índice 2)
            int linhasAfetadasUpdate = pstmtUpdate.executeUpdate();
            System.out.println("Linhas afetadas no UPDATE: " + linhasAfetadasUpdate);

            // Exemplo de DELETE
            System.out.println("\\nExecutando DELETE...");
            pstmtDelete.setString(1, "concluido"); // Primeiro '?' (índice 1)
            // Criando uma data para 30 dias atrás
            long trintaDiasAtrasMillis = System.currentTimeMillis() - (30L * 24 * 60 * 60 * 1000);
            pstmtDelete.setDate(2, new Date(trintaDiasAtrasMillis)); // Segundo '?' (índice 2)
            int linhasAfetadasDelete = pstmtDelete.executeUpdate();
            System.out.println("Linhas afetadas no DELETE: " + linhasAfetadasDelete);

        } catch (SQLException e) {
            System.err.println("Erro ao conectar ou executar SQL: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

```

Neste exemplo:

1. `conexao.prepareStatement(sql)`: Cria um objeto `PreparedStatement` a partir da `Connection`, passando a string SQL com os marcadores de posição (`?`).
2. `pstmt.set<Tipo>(indice, valor)`: São usados para atribuir valores aos marcadores de posição. O `indice` refere-se à posição do `?` na query (começando em 1). O `valor` é o dado que será vinculado ao marcador de posição.

### Componentes Principais: Métodos `set<Tipo>`

Os métodos `set<Tipo>(indice, valor)` são a espinha dorsal da definição de parâmetros em um `PreparedStatement`. Eles são sobrecarregados para aceitar diferentes tipos de dados Java e mapeá-los para os tipos de dados SQL correspondentes.

A seguir, uma lista dos métodos mais comuns e suas funções:

- **`setBoolean(int parameterIndex, boolean x)`**: Define o parâmetro no índice especificado como um valor booleano. Mapeia para tipos SQL como `BOOLEAN` ou `BIT`.
- **`setByte(int parameterIndex, byte x)`**: Define o parâmetro no índice especificado como um valor byte. Mapeia para `TINYINT` ou `SMALLINT`.
- **`setShort(int parameterIndex, short x)`**: Define o parâmetro como um valor short. Mapeia para `SMALLINT`.
- **`setInt(int parameterIndex, int x)`**: Define o parâmetro como um valor inteiro. Mapeia para `INTEGER`.
- **`setLong(int parameterIndex, long x)`**: Define o parâmetro como um valor long. Mapeia para `BIGINT`.
- **`setFloat(int parameterIndex, float x)`**: Define o parâmetro como um valor float. Mapeia para `REAL` ou `FLOAT`.
- **`setDouble(int parameterIndex, double x)`**: Define o parâmetro como um valor double. Mapeia para `DOUBLE` ou `NUMERIC`.
- **`setBigDecimal(int parameterIndex, BigDecimal x)`**: Define o parâmetro como um objeto `BigDecimal`. Útil para valores monetários ou de alta precisão. Mapeia para `NUMERIC` ou `DECIMAL`.
- **`setString(int parameterIndex, String x)`**: Define o parâmetro como uma string. Mapeia para `VARCHAR`, `CHAR`, `TEXT`, etc.
- **`setDate(int parameterIndex, Date x)`**: Define o parâmetro como um objeto `java.sql.Date`. Mapeia para `DATE`.
- **`setTime(int parameterIndex, Time x)`**: Define o parâmetro como um objeto `java.sql.Time`. Mapeia para `TIME`.
- **`setTimestamp(int parameterIndex, Timestamp x)`**: Define o parâmetro como um objeto `java.sql.Timestamp`. Mapeia para `TIMESTAMP` ou `DATETIME`.
- **`setBytes(int parameterIndex, byte[] x)`**: Define o parâmetro como um array de bytes. Útil para dados binários como imagens ou arquivos. Mapeia para `VARBINARY`, `BLOB`, etc.
- **`setAsciiStream(int parameterIndex, InputStream x, int length)`**: Define o parâmetro como um fluxo de caracteres ASCII.
- **`setBinaryStream(int parameterIndex, InputStream x, int length)`**: Define o parâmetro como um fluxo de bytes binários.
- **`setNull(int parameterIndex, int sqlType)`**: Define o parâmetro como NULL. O `sqlType` é um código de tipo do `java.sql.Types` (ex: `Types.VARCHAR`, `Types.INTEGER`) e é necessário para que o driver saiba qual tipo de NULL deve ser enviado ao banco de dados.
- **`setObject(int parameterIndex, Object x)`**: Define o parâmetro como um objeto Java. O driver JDBC tentará mapear o tipo do objeto Java para o tipo SQL apropriado. Existem sobrecargas para este método que permitem especificar o tipo SQL alvo e/ou a precisão e escala. É uma opção mais genérica, mas pode ser menos eficiente ou menos precisa em termos de mapeamento de tipos do que os métodos `set<Tipo>` específicos.

**Interação entre os Componentes:**

1. A `Connection` é responsável por estabelecer a comunicação com o banco de dados.
2. A partir da `Connection`, é criado um `PreparedStatement` com a instrução SQL parametrizada.
3. Os métodos `set<Tipo>` do `PreparedStatement` são invocados para "preencher" os marcadores de posição (`?`) com os valores dos parâmetros. O `parameterIndex` é crucial para identificar qual `?` está sendo preenchido (começando em 1 para o primeiro `?`).
4. Após todos os parâmetros serem definidos, o método `executeUpdate()` (para `INSERT`, `UPDATE`, `DELETE`) ou `executeQuery()` (para `SELECT`) é chamado no `PreparedStatement` para enviar a instrução completa (SQL + parâmetros) ao banco de dados.
5. O banco de dados executa a instrução, tratando os valores como dados e não como código, garantindo segurança e podendo reutilizar planos de execução otimizados.

### Restrições de Uso

Embora o `PreparedStatement` seja extremamente poderoso, é importante estar ciente de algumas considerações:

- **Uso exclusivo de marcadores de posição (`?`):** Você não pode usar `PreparedStatement` para montar a estrutura da sua consulta SQL dinamicamente. Por exemplo, você não pode parametrizar nomes de tabelas ou colunas (`SELECT ? FROM ?`). Isso deve ser feito concatenando strings (com cautela, para evitar injeção SQL nessa parte), ou usando outros mecanismos como metadados do banco.
- **Índices baseados em 1:** Os índices dos parâmetros (`parameterIndex`) começam em 1, não em 0, o que é uma convenção comum em JDBC (e em SQL em geral, para posições de colunas, por exemplo).
- **Tipo de dados:** É crucial usar o método `set<Tipo>` correto para o tipo de dado que você está passando. Se você passar uma `String` para um campo `INT` e usar `setString()`, o driver pode tentar converter, mas é mais seguro e claro usar `setInt()`. Incompatibilidades de tipo podem levar a `SQLException`s.
- **Fechamento de recursos:** É vital fechar o `PreparedStatement` (e `ResultSet` se houver) e a `Connection` após o uso para liberar recursos do banco de dados. O uso de blocos `try-with-resources` é a melhor prática em Java 7+ para garantir que isso aconteça automaticamente.

### 4\. Exemplos de Código Otimizados

A seguir, exemplos práticos que ilustram o uso de `PreparedStatement` em cenários comuns, com foco em boas práticas e eficiência.

### Exemplo 1: Inserção de Dados (Básico e Otimizado)

Este exemplo demonstra como inserir um novo usuário.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Date; // Para java.sql.Date
import java.time.LocalDate; // Para java.time.LocalDate

public class InserirUsuario {

    private static final String URL = "jdbc:mysql://localhost:3306/minha_aplicacao";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    public static void inserirNovoUsuario(String nome, String email, int idade, LocalDate dataRegistro) {
        String sql = "INSERT INTO usuarios (nome, email, idade, data_registro) VALUES (?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, nome);
            pstmt.setString(2, email);
            pstmt.setInt(3, idade);
            // Convertendo LocalDate para java.sql.Date
            pstmt.setDate(4, Date.valueOf(dataRegistro));

            int linhasAfetadas = pstmt.executeUpdate();
            System.out.println("Usuário '" + nome + "' inserido. Linhas afetadas: " + linhasAfetadas);

        } catch (SQLException e) {
            System.err.println("Erro ao inserir usuário: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        // Exemplo de uso: Gedê, para você testar!
        inserirNovoUsuario("Luiz Gustavo", "luiz.gustavo@example.com", 23, LocalDate.now());
        inserirNovoUsuario("Juliana", "juliana.miranda@example.com", 24, LocalDate.now());
    }
}

```

**Melhores Práticas:**

- Uso de `try-with-resources` para fechamento automático de `Connection` e `PreparedStatement`.
- Utilização de `LocalDate` para datas em Java 8+, e conversão para `java.sql.Date` para compatibilidade com JDBC.

### Exemplo 2: Atualização de Dados (Básico e Avançado - Lote)

Atualizando o preço de um produto e depois um exemplo de atualização em lote.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Arrays;

public class AtualizarProduto {

    private static final String URL = "jdbc:mysql://localhost:3306/minha_aplicacao";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    // Método para atualizar um único produto
    public static void atualizarPrecoProduto(int produtoId, double novoPreco) {
        String sql = "UPDATE produtos SET preco = ? WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setDouble(1, novoPreco);
            pstmt.setInt(2, produtoId);

            int linhasAfetadas = pstmt.executeUpdate();
            System.out.println("Produto ID " + produtoId + " atualizado. Linhas afetadas: " + linhasAfetadas);

        } catch (SQLException e) {
            System.err.println("Erro ao atualizar produto: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Método para atualizar múltiplos produtos em lote
    public static void atualizarMultiplosPrecos(List<ProdutoPreco> produtos) {
        String sql = "UPDATE produtos SET preco = ? WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            // Desativa o auto-commit para transações em lote
            conn.setAutoCommit(false);

            for (ProdutoPreco pp : produtos) {
                pstmt.setDouble(1, pp.getNovoPreco());
                pstmt.setInt(2, pp.getProdutoId());
                pstmt.addBatch(); // Adiciona a instrução ao lote
            }

            int[] resultados = pstmt.executeBatch(); // Executa todas as instruções no lote
            System.out.println("Resultados do lote de atualização: " + Arrays.toString(resultados));

            conn.commit(); // Confirma a transação
            System.out.println("Lote de atualização concluído com sucesso.");

        } catch (SQLException e) {
            System.err.println("Erro ao atualizar produtos em lote: " + e.getMessage());
            try {
                if (conn != null) {
                    conn.rollback(); // Desfaz a transação em caso de erro
                    System.out.println("Rollback da transação executado.");
                }
            } catch (SQLException ex) {
                System.err.println("Erro ao fazer rollback: " + ex.getMessage());
            }
            e.printStackTrace();
        } finally {
            try {
                if (conn != null) {
                    conn.setAutoCommit(true); // Reativa o auto-commit
                }
            } catch (SQLException e) {
                System.err.println("Erro ao reativar auto-commit: " + e.getMessage());
            }
        }
    }

    public static void main(String[] args) {
        // Exemplo de uso básico
        atualizarPrecoProduto(50, 99.99);

        // Exemplo de uso avançado (lote)
        List<ProdutoPreco> produtosParaAtualizar = Arrays.asList(
            new ProdutoPreco(101, 120.00),
            new ProdutoPreco(102, 25.50),
            new ProdutoPreco(103, 300.00)
        );
        atualizarMultiplosPrecos(produtosParaAtualizar);
    }
}

// Classe auxiliar para o exemplo de lote
class ProdutoPreco {
    private int produtoId;
    private double novoPreco;

    public ProdutoPreco(int produtoId, double novoPreco) {
        this.produtoId = produtoId;
        this.novoPreco = novoPreco;
    }

    public int getProdutoId() {
        return produtoId;
    }

    public double getNovoPreco() {
        return novoPreco;
    }
}

```

**Melhores Práticas:**

- **Operações em Lote (`addBatch()`, `executeBatch()`):** Essencial para alta performance quando se precisa executar várias instruções SQL semelhantes. Reduz significativamente o número de viagens de ida e volta ao banco de dados.
- **Transações (`setAutoCommit(false)`, `commit()`, `rollback()`):** Fundamental para garantir a atomicidade das operações em lote. Se uma parte do lote falhar, toda a transação pode ser revertida, mantendo a consistência dos dados.

### Exemplo 3: Seleção de Dados (Básico e Avançado - Parametrizado)

Consultando usuários por idade mínima e depois por nome.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ConsultarUsuarios {

    private static final String URL = "jdbc:mysql://localhost:3306/minha_aplicacao";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    // Consulta usuários por idade mínima
    public static void consultarUsuariosPorIdadeMinima(int idadeMinima) {
        String sql = "SELECT id, nome, email, idade FROM usuarios WHERE idade >= ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, idadeMinima);

            try (ResultSet rs = pstmt.executeQuery()) {
                System.out.println("\\nUsuários com idade maior ou igual a " + idadeMinima + ":");
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String nome = rs.getString("nome");
                    String email = rs.getString("email");
                    int idade = rs.getInt("idade");
                    System.out.println("ID: " + id + ", Nome: " + nome + ", Email: " + email + ", Idade: " + idade);
                }
            }

        } catch (SQLException e) {
            System.err.println("Erro ao consultar usuários por idade mínima: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Consulta usuários por nome (com LIKE e curinga)
    public static void consultarUsuariosPorNome(String parteNome) {
        // CUIDADO: O curinga '%' deve ser adicionado ao valor do parâmetro, NÃO na SQL
        String sql = "SELECT id, nome, email, idade FROM usuarios WHERE nome LIKE ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, "%" + parteNome + "%"); // Adiciona os curingas aqui!

            try (ResultSet rs = pstmt.executeQuery()) {
                System.out.println("\\nUsuários com nome contendo '" + parteNome + "':");
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String nome = rs.getString("nome");
                    String email = rs.getString("email");
                    int idade = rs.getInt("idade");
                    System.out.println("ID: " + id + ", Nome: " + nome + ", Email: " + email + ", Idade: " + idade);
                }
            }

        } catch (SQLException e) {
            System.err.println("Erro ao consultar usuários por nome: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        consultarUsuariosPorIdadeMinima(20);
        consultarUsuariosPorNome("Gustavo");
        consultarUsuariosPorNome("Ju"); // Para a Ju!
    }
}

```

**Melhores Práticas:**

- **`ResultSet` em `try-with-resources`:** Garante que o `ResultSet` também seja fechado automaticamente.
- **Parâmetros para `LIKE`:** É fundamental adicionar os caracteres curinga (`%`) ao *valor* do parâmetro antes de passá-lo para `setString()`, e não embuti-los na string SQL. Isso mantém a segurança contra injeção SQL.

### 5\. Informações Adicionais

- **Batching (Processamento em Lote):** Já abordamos no exemplo de atualização, mas vale reforçar. Para inserir ou atualizar um grande volume de dados, o uso de `addBatch()` e `executeBatch()` é a maneira mais eficiente. Isso permite que o JDBC agrupe várias operações SQL e as envie ao banco de dados em uma única comunicação, reduzindo o overhead de rede e de processamento.
- **Obtenção de Chaves Geradas Automaticamente:** Para tabelas onde o banco de dados gera automaticamente as chaves primárias (por exemplo, `AUTO_INCREMENT` no MySQL), você pode instruir o `PreparedStatement` a retornar essas chaves.
    
    ```java
    String sql = "INSERT INTO produtos (nome, descricao) VALUES (?, ?)";
    try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
         PreparedStatement pstmt = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) { // Importante!
    
        pstmt.setString(1, "Notebook");
        pstmt.setString(2, "Notebook Dell XPS 15");
        int linhasAfetadas = pstmt.executeUpdate();
    
        if (linhasAfetadas > 0) {
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    long idGerado = rs.getLong(1); // Obtém a chave gerada
                    System.out.println("Produto inserido com ID: " + idGerado);
                }
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    
    ```
    
- **Tratamento de `null`:** Use `setNull(int parameterIndex, int sqlType)` para definir um parâmetro como `NULL` no banco de dados. O `sqlType` (constante de `java.sql.Types`) é importante para que o driver saiba o tipo de coluna que espera `NULL`.
    
    ```java
    // Supondo que 'email' possa ser NULL
    String sql = "INSERT INTO usuarios (nome, email) VALUES (?, ?)";
    try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
         PreparedStatement pstmt = conn.prepareStatement(sql)) {
    
        pstmt.setString(1, "Usuário Sem Email");
        pstmt.setNull(2, java.sql.Types.VARCHAR); // Define o email como NULL
    
        pstmt.executeUpdate();
    } catch (SQLException e) {
        e.printStackTrace();
    }
    
    ```
    
- **Evite Concatenação de Strings para SQL:** Embora seja possível concatenar strings para construir consultas SQL, **nunca faça isso com entradas de usuário**. Isso abre uma porta para ataques de injeção SQL. Sempre use `PreparedStatement` para valores de parâmetros.
    - **Ruim (potencial injeção SQL):** `String sql = "SELECT * FROM users WHERE username = '" + usernameInput + "'";`
    - **Bom (seguro):** `String sql = "SELECT * FROM users WHERE username = ?"; PreparedStatement pstmt = conn.prepareStatement(sql); pstmt.setString(1, usernameInput);`

### 6\. Referências para Estudo Independente

Para aprofundar seus conhecimentos em JDBC e `PreparedStatement`, A.R.I.A recomenda os seguintes recursos:

- **Documentação Oficial da Oracle (Java SE JDBC):**
    - [PreparedStatement Interface](https://docs.oracle.com/javase/8/docs/api/java/sql/PreparedStatement.html)
    - [Using Prepared Statements](https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html)
    - [JDBC Basics (Tutorial Completo)](https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html)
- **Artigos e Tutoriais Confiáveis:**
    - **Baeldung - JDBC PreparedStatement Tutorial:** Um excelente recurso com muitos exemplos.
        - [https://www.baeldung.com/jdbc-prepared-statement](https://www.baeldung.com/jdbc-prepared-statement)
    - **GeeksforGeeks - PreparedStatement in JDBC:** Abordagem clara e concisa.
        - [https://www.geeksforgeeks.org/preparedstatement-in-jdbc/](https://www.geeksforgeeks.org/preparedstatement-in-jdbc/)
- **Livros:**
    - "Head First Java" (Kathy Sierra, Bert Bates): Embora não seja focado apenas em JDBC, aborda os conceitos de forma muito didática.
    - "Core Java Volume II--Advanced Features" (Cay S. Horstmann): Dedica um capítulo robusto ao JDBC e suas funcionalidades avançadas.

Espero que este guia detalhado sobre `PreparedStatement` e os métodos `set<Tipo>` seja extremamente útil para você, Gedê, na sua jornada como desenvolvedor Backend Java e na transição para GO\! Se tiver mais alguma dúvida, pode contar com A.R.I.A\!