# Criação e Casos de Uso (DDL, DML simples)

Olá, Gedê\! Entendido. Como A.R.I.A., vou te ajudar a entender sobre o `Statement` em JDBC, com foco em DDL e DML simples. Como você é desenvolvedor Backend Java e está buscando uma transição para Go, essa explicação detalhada será bem útil para consolidar seus conhecimentos em Java.

---

## Statement em JDBC: Criação e Casos de Uso (DDL, DML Simples)

### 1\. Introdução

No contexto do desenvolvimento de aplicações que interagem com bancos de dados relacionais, o Java Database Connectivity (JDBC) é a API padrão em Java que permite essa comunicação. Dentro do JDBC, a interface `Statement` é uma das ferramentas mais fundamentais e amplamente utilizadas. Ela representa um comando SQL que pode ser executado contra um banco de dados.

A relevância da interface `Statement` é imensa, pois ela é a porta de entrada para qualquer tipo de operação SQL que sua aplicação Java precise realizar, seja para definir a estrutura do banco de dados (DDL - Data Definition Language) ou para manipular os dados nele contidos (DML - Data Manipulation Language). Compreender seu funcionamento é crucial para qualquer desenvolvedor que trabalhe com persistência de dados em Java, pois ela serve como base para interfaces mais avançadas como `PreparedStatement` e `CallableStatement`.

**Definição e Conceitos Fundamentais:**

A interface `java.sql.Statement` é um objeto JDBC usado para enviar instruções SQL a um banco de dados. Ele é criado a partir de um objeto `Connection` e permite a execução de comandos SQL dinamicamente. Para que serve? Basicamente, para executar qualquer tipo de comando SQL (DDL, DML, DCL, TCL) diretamente no banco de dados.

### 2\. Sumário

- **Visão Geral do Statement**
- **Criação de um Objeto Statement**
- **Executando Comandos SQL com Statement**
    - `executeUpdate()`: Para DDL e DML (INSERT, UPDATE, DELETE)
    - `executeQuery()`: Para DML (SELECT)
    - `execute()`: Para qualquer tipo de comando SQL
- **Fechando Recursos do Statement**
- **Exemplos de Código Otimizados**
    - Criação de Tabela (DDL)
    - Inserção de Dados (DML - INSERT)
    - Atualização de Dados (DML - UPDATE)
    - Exclusão de Dados (DML - DELETE)
    - Consulta de Dados (DML - SELECT)
- **Informações Adicionais**
    - Vulnerabilidades do Statement (SQL Injection)
    - Quando usar Statement vs. PreparedStatement
- **Referências para Estudo Independente**

### 3\. Conteúdo Detalhado

### Visão Geral do Statement

O `Statement` é a forma mais básica de executar comandos SQL. Ele é adequado para comandos SQL que não precisam ser executados repetidamente ou que não contêm parâmetros de entrada variáveis. As instruções SQL são passadas como strings literais para os métodos de execução.

### Criação de um Objeto Statement

Um objeto `Statement` não é instanciado diretamente. Ele é obtido a partir de um objeto `Connection` estabelecido com o banco de dados.

**Sintaxe e Estrutura:**

```java
Connection connection = null; // Supondo que a conexão já foi estabelecida
Statement statement = null;
try {
    // Obtenha a conexão (exemplo ilustrativo)
    // connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/meubanco", "usuario", "senha");

    statement = connection.createStatement();
    // Agora o statement está pronto para ser usado
} catch (SQLException e) {
    e.printStackTrace();
} finally {
    // Certifique-se de fechar o statement e a conexão no bloco finally
    if (statement != null) {
        try {
            statement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    if (connection != null) {
        try {
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

```

### Executando Comandos SQL com Statement

A interface `Statement` oferece três métodos principais para a execução de comandos SQL, cada um otimizado para um tipo específico de operação:

### `executeUpdate()`: Para DDL e DML (INSERT, UPDATE, DELETE)

Este método é usado para executar instruções SQL que modificam o banco de dados. Isso inclui:

- **DDL (Data Definition Language):** Comandos como `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `CREATE INDEX`, etc.
- **DML (Data Manipulation Language):** Comandos como `INSERT`, `UPDATE`, `DELETE`.

O método `executeUpdate()` retorna um `int` que indica o número de linhas afetadas pela operação (para DML) ou 0 para comandos DDL que não afetam linhas (como `CREATE TABLE`).

**Sintaxe:**

```java
int affectedRows = statement.executeUpdate(sql);

```

### `executeQuery()`: Para DML (SELECT)

Este método é usado para executar instruções SQL que retornam um conjunto de resultados, ou seja, comandos `SELECT`. Ele retorna um objeto `ResultSet`, que pode ser iterado para acessar os dados retornados pela consulta.

**Sintaxe:**

```java
ResultSet resultSet = statement.executeQuery(sql);

```

### `execute()`: Para qualquer tipo de comando SQL

Este é o método mais genérico. Ele pode executar qualquer tipo de instrução SQL e retorna um `boolean` que indica o tipo de resultado.

- `true` se o primeiro resultado é um `ResultSet` (ou seja, foi executado um `SELECT`).
- `false` se o primeiro resultado é um contador de atualização ou não há resultados (como para DDL ou DML `INSERT`/`UPDATE`/`DELETE`).

Para obter os resultados reais após chamar `execute()`, você precisaria usar `getResultSet()` ou `getUpdateCount()`. Geralmente, é mais comum usar `executeQuery()` para `SELECT` e `executeUpdate()` para outras operações devido à sua tipagem mais específica e conveniência.

**Sintaxe:**

```java
boolean hasResultSet = statement.execute(sql);
if (hasResultSet) {
    ResultSet resultSet = statement.getResultSet();
    // Processar ResultSet
} else {
    int updateCount = statement.getUpdateCount();
    // Processar número de linhas afetadas
}

```

### Fechando Recursos do Statement

É crucial fechar os objetos `Statement`, `ResultSet` e `Connection` após o uso para liberar os recursos do banco de dados e evitar vazamentos de memória. A melhor prática é fazer isso em um bloco `finally` para garantir que sejam fechados, mesmo que ocorram exceções.

**Componentes Principais e Interação:**

- **`Connection`:** Objeto que representa a conexão ativa com o banco de dados. É a partir dele que o `Statement` é criado.
- **`Statement`:** O objeto que efetivamente executa a instrução SQL.
- **`ResultSet`:** (Quando `executeQuery` é usado) Objeto que contém os dados retornados por uma consulta `SELECT`. Ele atua como um cursor sobre as linhas resultantes, permitindo que você navegue e acesse os valores das colunas.
- **Instrução SQL (String):** A própria string que contém o comando SQL a ser executado. É passada como argumento para os métodos `executeUpdate`, `executeQuery` ou `execute`.

A interação é linear: você estabelece uma `Connection`, cria um `Statement` a partir dela, usa o `Statement` para executar um comando SQL (que pode retornar um `ResultSet`), e então fecha os recursos na ordem inversa de criação (`ResultSet` -\> `Statement` -\> `Connection`).

### 4\. Exemplos de Código Otimizados

Para os exemplos abaixo, vamos supor que temos uma conexão JDBC configurada. Gedê, você já é um desenvolvedor Java experiente, então sabe a importância de gerenciar a conexão. Para simplificar, vou focar nos exemplos de uso do `Statement`.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class StatementJdbcExamples {

    // Método utilitário para obter a conexão
    private static Connection getConnection() throws SQLException {
        // Substitua pelos seus dados de conexão reais
        String url = "jdbc:mysql://localhost:3306/meubanco?useTimezone=true&serverTimezone=UTC";
        String user = "root";
        String password = "password";
        return DriverManager.getConnection(url, user, password);
    }

    // ----------------------------------------------------
    // Exemplo 1: DDL - Criação de Tabela
    // ----------------------------------------------------
    public static void criarTabelaUsuario() {
        Connection connection = null;
        Statement statement = null;
        try {
            connection = getConnection();
            statement = connection.createStatement();

            String sql = "CREATE TABLE IF NOT EXISTS usuarios (" +
                         "id INT AUTO_INCREMENT PRIMARY KEY," +
                         "nome VARCHAR(100) NOT NULL," +
                         "email VARCHAR(100) UNIQUE NOT NULL," +
                         "idade INT)";

            statement.executeUpdate(sql);
            System.out.println("Tabela 'usuarios' criada com sucesso ou já existente.");

        } catch (SQLException e) {
            System.err.println("Erro ao criar tabela: " + e.getMessage());
        } finally {
            closeResources(statement, connection);
        }
    }

    // ----------------------------------------------------
    // Exemplo 2: DML - Inserção de Dados
    // ----------------------------------------------------
    public static void inserirUsuario(String nome, String email, int idade) {
        Connection connection = null;
        Statement statement = null;
        try {
            connection = getConnection();
            statement = connection.createStatement();

            String sql = "INSERT INTO usuarios (nome, email, idade) VALUES ('" +
                         nome + "', '" + email + "', " + idade + ")";

            int affectedRows = statement.executeUpdate(sql);
            if (affectedRows > 0) {
                System.out.println("Usuário '" + nome + "' inserido com sucesso. Linhas afetadas: " + affectedRows);
            } else {
                System.out.println("Nenhum usuário inserido.");
            }

        } catch (SQLException e) {
            System.err.println("Erro ao inserir usuário: " + e.getMessage());
        } finally {
            closeResources(statement, connection);
        }
    }

    // ----------------------------------------------------
    // Exemplo 3: DML - Atualização de Dados
    // ----------------------------------------------------
    public static void atualizarEmailUsuario(String nome, String novoEmail) {
        Connection connection = null;
        Statement statement = null;
        try {
            connection = getConnection();
            statement = connection.createStatement();

            String sql = "UPDATE usuarios SET email = '" + novoEmail + "' WHERE nome = '" + nome + "'";

            int affectedRows = statement.executeUpdate(sql);
            if (affectedRows > 0) {
                System.out.println("Email do usuário '" + nome + "' atualizado para '" + novoEmail + "'. Linhas afetadas: " + affectedRows);
            } else {
                System.out.println("Nenhum usuário encontrado com o nome '" + nome + "' para atualização.");
            }

        } catch (SQLException e) {
            System.err.println("Erro ao atualizar usuário: " + e.getMessage());
        } finally {
            closeResources(statement, connection);
        }
    }

    // ----------------------------------------------------
    // Exemplo 4: DML - Exclusão de Dados
    // ----------------------------------------------------
    public static void deletarUsuario(String nome) {
        Connection connection = null;
        Statement statement = null;
        try {
            connection = getConnection();
            statement = connection.createStatement();

            String sql = "DELETE FROM usuarios WHERE nome = '" + nome + "'";

            int affectedRows = statement.executeUpdate(sql);
            if (affectedRows > 0) {
                System.out.println("Usuário '" + nome + "' deletado com sucesso. Linhas afetadas: " + affectedRows);
            } else {
                System.out.println("Nenhum usuário encontrado com o nome '" + nome + "' para exclusão.");
            }

        } catch (SQLException e) {
            System.err.println("Erro ao deletar usuário: " + e.getMessage());
        } finally {
            closeResources(statement, connection);
        }
    }

    // ----------------------------------------------------
    // Exemplo 5: DML - Consulta de Dados
    // ----------------------------------------------------
    public static void consultarTodosUsuarios() {
        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;
        try {
            connection = getConnection();
            statement = connection.createStatement();

            String sql = "SELECT id, nome, email, idade FROM usuarios";

            resultSet = statement.executeQuery(sql);

            System.out.println("\\n--- Lista de Usuários ---");
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String nome = resultSet.getString("nome");
                String email = resultSet.getString("email");
                int idade = resultSet.getInt("idade");
                System.out.printf("ID: %d, Nome: %s, Email: %s, Idade: %d%n", id, nome, email, idade);
            }
            System.out.println("-------------------------\\n");

        } catch (SQLException e) {
            System.err.println("Erro ao consultar usuários: " + e.getMessage());
        } finally {
            closeResources(resultSet, statement, connection);
        }
    }

    // Método auxiliar para fechar recursos (sobrecarga para ResultSet)
    private static void closeResources(ResultSet rs, Statement stmt, Connection conn) {
        if (rs != null) {
            try { rs.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        if (stmt != null) {
            try { stmt.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        if (conn != null) {
            try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
    }

    // Método auxiliar para fechar recursos (sem ResultSet)
    private static void closeResources(Statement stmt, Connection conn) {
        closeResources(null, stmt, conn);
    }

    public static void main(String[] args) {
        // Crie a tabela antes de tentar inserir dados
        criarTabelaUsuario();

        // Inserir alguns usuários
        inserirUsuario("Luiz Gustavo", "gederamos@example.com", 23); // Opa, Gedê, você mesmo!
        inserirUsuario("Juliana", "ju.fisio@example.com", 24); // E a Ju!
        inserirUsuario("João Silva", "joao.silva@example.com", 30);
        inserirUsuario("Maria Oliveira", "maria.o@example.com", 28);

        // Consultar todos os usuários
        consultarTodosUsuarios();

        // Atualizar um usuário
        atualizarEmailUsuario("João Silva", "joao.novo.email@example.com");

        // Consultar novamente para ver a atualização
        consultarTodosUsuarios();

        // Deletar um usuário
        deletarUsuario("Maria Oliveira");

        // Consultar mais uma vez para confirmar a exclusão
        consultarTodosUsuarios();
    }
}

```

**Observações sobre os exemplos:**

- **Melhores Práticas:** Os exemplos incluem o uso de `try-catch-finally` para o tratamento de exceções e o fechamento correto dos recursos (`Connection`, `Statement`, `ResultSet`), o que é fundamental em qualquer aplicação JDBC robusta.
- **Legibilidade:** Os comandos SQL são strings diretas, tornando a leitura relativamente simples para operações básicas.
- **Uso Otimizado:** Para este tipo de operação (DDL e DML simples sem muitos parâmetros), o `Statement` é adequado. No entanto, é importante ressaltar a restrição de uso mencionada abaixo.

### 5\. Informações Adicionais

### Restrições de Uso e Vulnerabilidades (SQL Injection)

A principal restrição e desvantagem do `Statement` é que ele é altamente suscetível a ataques de **SQL Injection**. Isso ocorre porque as strings SQL são concatenadas diretamente com os valores de entrada do usuário. Se um usuário mal-intencionado inserir dados que alteram a lógica da consulta SQL, ele pode comprometer a segurança do seu banco de dados.

**Exemplo de SQL Injection:**

Se você tiver o seguinte código:

```java
String userInput = "'; DROP TABLE usuarios; --"; // Entrada maliciosa do usuário
String sql = "DELETE FROM usuarios WHERE nome = '" + userInput + "'";
statement.executeUpdate(sql);

```

A consulta SQL resultante seria:

```sql
DELETE FROM usuarios WHERE nome = ''; DROP TABLE usuarios; --'

```

Isso faria com que sua tabela `usuarios` fosse excluída, causando um dano significativo.

### Quando usar Statement vs. PreparedStatement

Devido à vulnerabilidade de SQL Injection e à ineficiência para comandos repetitivos com parâmetros, o `Statement` é geralmente menos recomendado em aplicações de produção que lidam com dados de entrada do usuário.

**Quando usar `Statement`:**

- Para comandos DDL (como `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`) que não envolvem dados de entrada do usuário.
- Para comandos SQL simples e estáticos (sem parâmetros) que são executados apenas uma vez.
- Quando a flexibilidade de construir a consulta SQL em tempo de execução é mais importante do que a segurança ou a performance para múltiplas execuções.

**Quando usar `PreparedStatement` (Recomendado na maioria dos casos):**

- **Sempre que a instrução SQL contiver parâmetros de entrada do usuário.** O `PreparedStatement` pré-compila a instrução SQL e permite que os parâmetros sejam definidos de forma segura, evitando SQL Injection.
- Quando a mesma instrução SQL será executada várias vezes com diferentes valores de parâmetro (melhor desempenho devido à pré-compilação).
- Para DML (INSERT, UPDATE, DELETE, SELECT) que envolvem dados variáveis.

Para um desenvolvedor Backend como você, Gedê, que lida com a persistência de dados em Java, dominar o `PreparedStatement` é um requisito fundamental, pois ele é a ferramenta padrão e mais segura para interagir com o banco de dados. O `Statement` serve como uma base conceitual e para casos muito específicos de DDL ou consultas estáticas.

### 6\. Referências para Estudo Independente

Para aprofundar seus conhecimentos em JDBC e no uso de `Statement` (e principalmente `PreparedStatement`), sugiro os seguintes recursos:

- **Documentação Oficial Oracle (Java SE API - Statement):**
    - [java.sql.Statement Interface](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Statement.html)
    - [java.sql.PreparedStatement Interface](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/PreparedStatement.html)
    - [JDBC Basics (Oracle Tutorials)](https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html) - Embora seja um tutorial mais antigo, os conceitos fundamentais ainda são válidos.
- **GeeksforGeeks - JDBC Statement:**
    - [Statement in JDBC](https://www.google.com/search?q=https://www.geeksforgeeks.org/statement-in-jdbc/)
- **Baeldung - Guide To JDBC:**
    - [A Guide To JDBC](https://www.baeldung.com/java-jdbc) - Artigo abrangente que cobre desde o básico até tópicos mais avançados de JDBC.
- **Livros sobre Java e JDBC:**
    - "Core Java, Volume II--Advanced Features" by Cay S. Horstmann (Capítulo sobre JDBC)
    - "Head First Java" (Embora mais focado em iniciantes, aborda JDBC de forma didática)

Espero que esta explicação detalhada, Gedê, tenha sido clara e útil para você\! Se tiver mais alguma dúvida, pode me perguntar.