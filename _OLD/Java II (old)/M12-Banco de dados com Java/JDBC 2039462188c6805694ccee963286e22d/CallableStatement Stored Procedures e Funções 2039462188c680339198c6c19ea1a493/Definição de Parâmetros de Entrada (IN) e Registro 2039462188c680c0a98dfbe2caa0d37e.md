# Definição de Parâmetros de Entrada (IN) e Registro de Parâmetros de Saída (OUT/INOUT)

Olá, Gedê\! Entendido. Como A.R.I.A., vou te ajudar com uma explicação bem detalhada sobre `CallableStatement` no JDBC, focando na definição de parâmetros de entrada (IN) e no registro de parâmetros de saída (OUT/INOUT).

---

## CallableStatement no JDBC: Definição de Parâmetros de Entrada (IN) e Registro de Parâmetros de Saída (OUT/INOUT)

### 1\. Introdução

No universo do desenvolvimento backend Java, especialmente quando interagimos com bancos de dados relacionais, o Java Database Connectivity (JDBC) é a API padrão que nos permite executar consultas SQL e gerenciar transações. Dentre os diversos tipos de *statements* que o JDBC oferece, o `CallableStatement` se destaca por sua capacidade de invocar *stored procedures* (procedimentos armazenados) e funções armazenadas no banco de dados.

A relevância do `CallableStatement` reside na otimização e na centralização da lógica de negócios. Ao invés de executar múltiplas instruções SQL do lado da aplicação, podemos encapsular uma série de operações em um único procedimento armazenado no banco de dados. Isso traz benefícios como:

- **Performance aprimorada:** A execução de procedimentos armazenados geralmente é mais rápida, pois eles são compilados e otimizados uma única vez pelo SGBD.
- **Redução do tráfego de rede:** Menos idas e vindas entre a aplicação e o banco de dados.
- **Segurança:** Permite que a lógica de negócios seja executada com permissões específicas no banco de dados, sem expor os detalhes das tabelas ou operações.
- **Manutenibilidade:** A lógica de negócios fica centralizada no banco de dados, facilitando atualizações e correções.

### Definição e Conceitos Fundamentais

O `CallableStatement` é uma interface no pacote `java.sql` que estende a interface `PreparedStatement`. Ele é projetado especificamente para chamar *stored procedures* e funções armazenadas que podem ter parâmetros de entrada (IN), parâmetros de saída (OUT) e parâmetros de entrada/saída (INOUT).

- **Parâmetros IN:** São valores que a aplicação passa para o procedimento ou função. Eles são utilizados dentro do procedimento para realizar alguma operação.
- **Parâmetros OUT:** São valores que o procedimento ou função retorna para a aplicação após sua execução. Podem ser resultados de cálculos, status de operações, etc.
- **Parâmetros INOUT:** São valores que a aplicação passa para o procedimento ou função, e que podem ser modificados por ele e retornados para a aplicação. Eles servem tanto como entrada quanto como saída.

### 2\. Sumário

Este documento abordará os seguintes tópicos:

- Sintaxe e Estrutura do `CallableStatement`
- Componentes Principais do `CallableStatement`
    - Criação de um `CallableStatement`
    - Definição de Parâmetros de Entrada (IN)
    - Registro de Parâmetros de Saída (OUT)
    - Registro de Parâmetros de Entrada/Saída (INOUT)
    - Execução do `CallableStatement`
    - Recuperação de Parâmetros de Saída
- Restrições de Uso
- Exemplos de Código Otimizados
    - Exemplo com Parâmetro IN
    - Exemplo com Parâmetro OUT
    - Exemplo com Parâmetro INOUT
    - Exemplo com Função Armazenada
- Informações Adicionais
- Referências para Estudo Independente

### 3\. Conteúdo Detalhado

### Sintaxe e Estrutura

A sintaxe básica para chamar uma *stored procedure* ou função armazenada com `CallableStatement` segue um padrão de *escape syntax* definido pelo JDBC.

Para *stored procedures*:

```sql
{call procedure_name(?, ?, ...)}

```

Para funções armazenadas (onde `?` é o valor de retorno):

```sql
{? = call function_name(?, ?, ...)}

```

Os `?` são *placeholders* para os parâmetros, que serão definidos programaticamente no código Java.

### Componentes Principais

### Criação de um `CallableStatement`

A criação de um `CallableStatement` é feita a partir de um objeto `Connection` utilizando o método `prepareCall()`.

```java
// Supondo uma Connection 'conexao' já estabelecida
String sql = "{call calcular_total_pedido(?, ?, ?)}"; // Exemplo de procedure com 3 parâmetros
CallableStatement stmt = conexao.prepareCall(sql);

```

### Definição de Parâmetros de Entrada (IN)

Para definir parâmetros de entrada, o `CallableStatement` herda os métodos `setX()` de `PreparedStatement`. O índice do parâmetro começa em 1 para o primeiro `?`.

```java
// Exemplo: procedure_name(parametro1_int, parametro2_string)
// Supondo que 'stmt' é um CallableStatement para esta procedure
stmt.setInt(1, 101); // Define o primeiro parâmetro como um inteiro
stmt.setString(2, "Produto A"); // Define o segundo parâmetro como uma string

```

Os métodos `setX()` são polimórficos e aceitam diversos tipos de dados Java, como `setString()`, `setInt()`, `setLong()`, `setDouble()`, `setBoolean()`, `setDate()`, `setTimestamp()`, `setBlob()`, `setClob()`, etc. É crucial que o tipo de dado Java corresponda ao tipo de dado esperado pelo parâmetro no banco de dados.

### Registro de Parâmetros de Saída (OUT)

Antes de executar o `CallableStatement`, você deve registrar os parâmetros de saída usando o método `registerOutParameter()`. Este método informa ao JDBC o tipo de dado SQL do parâmetro de saída e seu índice.

```java
// Exemplo: procedure_name(parametro_entrada, parametro_saida_int)
// O segundo parâmetro é OUT e será um inteiro (SQL_TYPE: INTEGER)
stmt.registerOutParameter(2, java.sql.Types.INTEGER);

```

O primeiro argumento é o índice do parâmetro, e o segundo é o tipo de dado SQL, definido pelas constantes em `java.sql.Types`. Alguns dos tipos mais comuns incluem:

- `java.sql.Types.INTEGER`
- `java.sql.Types.VARCHAR`
- `java.sql.Types.DECIMAL`
- `java.sql.Types.DATE`
- `java.sql.Types.TIMESTAMP`
- `java.sql.Types.BOOLEAN`
- `java.sql.Types.REF_CURSOR` (para retornar *ResultSets* como parâmetros de saída em alguns bancos de dados como Oracle)

### Registro de Parâmetros de Entrada/Saída (INOUT)

Para parâmetros INOUT, você precisa definir o valor de entrada usando um método `setX()` e, em seguida, registrar o parâmetro como de saída usando `registerOutParameter()`. A ordem é importante: primeiro defina o valor IN, depois registre como OUT.

```java
// Exemplo: procedure_name(parametro_inout_string)
// O primeiro parâmetro é INOUT e será uma string (SQL_TYPE: VARCHAR)
stmt.setString(1, "Valor Inicial"); // Define o valor de entrada
stmt.registerOutParameter(1, java.sql.Types.VARCHAR); // Registra para receber o valor de saída

```

### Execução do `CallableStatement`

A execução do `CallableStatement` é feita de forma semelhante a um `PreparedStatement`, utilizando `execute()` ou `executeUpdate()`.

- `boolean execute()`: Usado para executar qualquer tipo de comando SQL, incluindo stored procedures e funções que podem retornar múltiplos `ResultSet`s, contar atualizações, etc. Retorna `true` se o primeiro resultado é um `ResultSet`, `false` se é um count de atualização ou não há resultados.
- `int executeUpdate()`: Usado para executar comandos DDL ou DML (INSERT, UPDATE, DELETE) que retornam um contador de linhas afetadas. Pode ser usado para *stored procedures* que não retornam `ResultSet`s explicitamente, mas modificam dados.

Para a maioria dos casos com `CallableStatement`, `execute()` é o método mais comum e flexível, especialmente quando há parâmetros de saída ou retornos de `ResultSet`.

```java
boolean hasResultSet = stmt.execute(); // Executa a stored procedure ou função

```

### Recuperação de Parâmetros de Saída

Após a execução, os valores dos parâmetros de saída podem ser recuperados usando os métodos `getX()` correspondentes.

```java
// Recuperando o valor do parâmetro OUT (índice 2)
int total = stmt.getInt(2);

// Recuperando o valor do parâmetro INOUT (índice 1)
String novoValor = stmt.getString(1);

```

Assim como os métodos `setX()`, os métodos `getX()` também são polimórficos (`getString()`, `getInt()`, `getLong()`, etc.) e devem ser usados de acordo com o tipo de dado registrado para o parâmetro de saída.

### Restrições de Uso

- **Dependência do SGBD:** A sintaxe exata das *stored procedures* e funções, e o suporte a tipos de dados específicos, variam entre os diferentes SGBDs (Oracle, MySQL, PostgreSQL, SQL Server). O JDBC tenta padronizar a chamada via *escape syntax*, mas a implementação no banco de dados deve ser compatível.
- **Tratamento de Exceções:** É fundamental usar blocos `try-catch-finally` para garantir que `Connection`, `CallableStatement` e `ResultSet` (se houver) sejam sempre fechados para evitar vazamento de recursos.
- **Tipos de Dados:** Certifique-se de que o `java.sql.Types` usado em `registerOutParameter()` corresponda ao tipo de dado definido para o parâmetro na *stored procedure* ou função no banco de dados. Um erro de mapeamento pode resultar em exceções ou dados incorretos.
- **SQL Injection:** Embora `CallableStatement` ajude a prevenir *SQL Injection* ao usar *placeholders* para parâmetros, o próprio conteúdo da *stored procedure* ou função no banco de dados deve ser escrito de forma segura para evitar vulnerabilidades.
- **ResultSets como Parâmetros OUT:** Alguns bancos de dados (como Oracle com `REF CURSOR`) permitem retornar `ResultSet`s como parâmetros de saída. Nesses casos, o `registerOutParameter` deve usar o tipo apropriado (ex: `Types.REF_CURSOR`), e a recuperação será via `getResultSet()` ou `getObject()` dependendo do driver.

### 4\. Exemplos de Código Otimizados

Para todos os exemplos, vamos assumir que temos a seguinte configuração de banco de dados e conexão JDBC:

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types; // Para java.sql.Types

public class ExemploCallableStatement {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/meu_banco";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "senha";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }

    public static void main(String[] args) {
        // Os exemplos serão chamados aqui
        // ex: exemploParametroIN();
        // ex: exemploParametroOUT();
        // ex: exemploParametroINOUT();
        // ex: exemploFuncaoArmazenada();
    }
}

```

### Exemplo 1: Stored Procedure com Parâmetro IN

**Cenário:** Uma stored procedure que insere um novo usuário no banco de dados.

**Stored Procedure (MySQL):**

```sql
DELIMITER //
CREATE PROCEDURE `adicionar_usuario`(IN p_nome VARCHAR(100), IN p_email VARCHAR(100))
BEGIN
    INSERT INTO usuarios (nome, email) VALUES (p_nome, p_email);
END //
DELIMITER ;

```

**Código Java:**

```java
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;

// ... (Parte inicial da classe ExemploCallableStatement)

public class ExemploCallableStatement {
    // ... (getConnection e main)

    public static void exemploParametroIN() {
        Connection conn = null;
        CallableStatement stmt = null;
        try {
            conn = getConnection();
            String sql = "{call adicionar_usuario(?, ?)}";
            stmt = conn.prepareCall(sql);

            // Definindo os parâmetros de entrada
            stmt.setString(1, "Gedê Damasceno");
            stmt.setString(2, "gede.damasceno@example.com");

            System.out.println("Executando stored procedure para adicionar usuário...");
            stmt.execute(); // Não retorna ResultSet ou count explícito

            System.out.println("Usuário adicionado com sucesso!");

        } catch (SQLException e) {
            System.err.println("Erro ao adicionar usuário: " + e.getMessage());
            e.printStackTrace();
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                System.err.println("Erro ao fechar recursos: " + e.getMessage());
            }
        }
    }
}

```

### Exemplo 2: Stored Procedure com Parâmetro OUT

**Cenário:** Uma stored procedure que recebe um ID de produto e retorna o preço do produto.

**Stored Procedure (MySQL):**

```sql
DELIMITER //
CREATE PROCEDURE `obter_preco_produto`(IN p_produto_id INT, OUT p_preco DECIMAL(10, 2))
BEGIN
    SELECT preco INTO p_preco FROM produtos WHERE id = p_produto_id;
END //
DELIMITER ;

```

**Tabela `produtos` (Exemplo):**

```sql
CREATE TABLE produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    preco DECIMAL(10, 2)
);

INSERT INTO produtos (nome, preco) VALUES ('Notebook', 3500.00);
INSERT INTO produtos (nome, preco) VALUES ('Mouse', 120.50);

```

**Código Java:**

```java
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Types;

// ... (Parte inicial da classe ExemploCallableStatement)

public class ExemploCallableStatement {
    // ... (getConnection e main)

    public static void exemploParametroOUT() {
        Connection conn = null;
        CallableStatement stmt = null;
        try {
            conn = getConnection();
            String sql = "{call obter_preco_produto(?, ?)}";
            stmt = conn.prepareCall(sql);

            // Definindo o parâmetro de entrada
            int produtoId = 1; // ID do Notebook
            stmt.setInt(1, produtoId);

            // Registrando o parâmetro de saída
            stmt.registerOutParameter(2, Types.DECIMAL); // O preço é um DECIMAL

            System.out.println("Executando stored procedure para obter preço do produto ID " + produtoId + "...");
            stmt.execute();

            // Recuperando o valor do parâmetro de saída
            double preco = stmt.getDouble(2); // Usamos getDouble para DECIMAL

            if (preco > 0) { // Supondo que 0 significa não encontrado ou erro
                System.out.println("Preço do produto ID " + produtoId + ": R$" + String.format("%.2f", preco));
            } else {
                System.out.println("Produto com ID " + produtoId + " não encontrado ou preço não disponível.");
            }

        } catch (SQLException e) {
            System.err.println("Erro ao obter preço do produto: " + e.getMessage());
            e.printStackTrace();
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                System.err.println("Erro ao fechar recursos: " + e.getMessage());
            }
        }
    }
}

```

### Exemplo 3: Stored Procedure com Parâmetro INOUT

**Cenário:** Uma stored procedure que recebe um valor de estoque atual e uma quantidade a ser adicionada, e retorna o novo estoque total.

**Stored Procedure (MySQL):**

```sql
DELIMITER //
CREATE PROCEDURE `atualizar_estoque`(INOUT p_estoque_atual INT, IN p_quantidade_adicionar INT)
BEGIN
    SET p_estoque_atual = p_estoque_atual + p_quantidade_adicionar;
END //
DELIMITER ;

```

**Código Java:**

```java
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Types;

// ... (Parte inicial da classe ExemploCallableStatement)

public class ExemploCallableStatement {
    // ... (getConnection e main)

    public static void exemploParametroINOUT() {
        Connection conn = null;
        CallableStatement stmt = null;
        try {
            conn = getConnection();
            String sql = "{call atualizar_estoque(?, ?)}";
            stmt = conn.prepareCall(sql);

            // Definindo o valor inicial para o parâmetro INOUT
            int estoqueAtual = 50;
            int quantidadeAdicionar = 20;

            stmt.setInt(1, estoqueAtual); // Define o valor de entrada para o INOUT
            stmt.registerOutParameter(1, Types.INTEGER); // Registra como OUT também
            stmt.setInt(2, quantidadeAdicionar); // Define o parâmetro IN

            System.out.println("Estoque inicial: " + estoqueAtual);
            System.out.println("Quantidade a adicionar: " + quantidadeAdicionar);
            System.out.println("Executando stored procedure para atualizar estoque...");
            stmt.execute();

            // Recuperando o novo valor do parâmetro INOUT
            int novoEstoque = stmt.getInt(1);

            System.out.println("Novo estoque total: " + novoEstoque);

        } catch (SQLException e) {
            System.err.println("Erro ao atualizar estoque: " + e.getMessage());
            e.printStackTrace();
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                System.err.println("Erro ao fechar recursos: " + e.getMessage());
            }
        }
    }
}

```

### Exemplo 4: Chamando uma Função Armazenada (Retorno como OUT Parameter)

**Cenário:** Uma função armazenada que calcula o preço total de um pedido com base na quantidade e no preço unitário. O valor de retorno da função é tratado como o primeiro parâmetro OUT.

**Função Armazenada (MySQL):**

```sql
DELIMITER //
CREATE FUNCTION `calcular_valor_total`(p_quantidade INT, p_preco_unitario DECIMAL(10, 2))
RETURNS DECIMAL(10, 2)
DETERMINISTIC
BEGIN
    RETURN p_quantidade * p_preco_unitario;
END //
DELIMITER ;

```

**Código Java:**

```java
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Types;

// ... (Parte inicial da classe ExemploCallableStatement)

public class ExemploCallableStatement {
    // ... (getConnection e main)

    public static void exemploFuncaoArmazenada() {
        Connection conn = null;
        CallableStatement stmt = null;
        try {
            conn = getConnection();
            // A sintaxe para função: {? = call function_name(param1, param2, ...)}
            String sql = "{? = call calcular_valor_total(?, ?)}";
            stmt = conn.prepareCall(sql);

            // O primeiro '?' é para o valor de retorno da função (OUT)
            stmt.registerOutParameter(1, Types.DECIMAL);

            // Definindo os parâmetros de entrada da função
            int quantidade = 5;
            double precoUnitario = 49.99;
            stmt.setInt(2, quantidade); // O segundo '?' da SQL
            stmt.setDouble(3, precoUnitario); // O terceiro '?' da SQL

            System.out.println("Quantidade: " + quantidade);
            System.out.println("Preço Unitário: R$" + String.format("%.2f", precoUnitario));
            System.out.println("Executando função para calcular valor total...");
            stmt.execute();

            // Recuperando o valor de retorno da função (índice 1)
            double valorTotal = stmt.getDouble(1);

            System.out.println("Valor total do pedido: R$" + String.format("%.2f", valorTotal));

        } catch (SQLException e) {
            System.err.println("Erro ao calcular valor total: " + e.getMessage());
            e.printStackTrace();
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                System.err.println("Erro ao fechar recursos: " + e.getMessage());
            }
        }
    }
}

```

### 5\. Informações Adicionais

### Gerenciamento de Conexões e Recursos

Como desenvolvedor Java Backend, Gedê, você sabe que o gerenciamento de conexões e recursos é crucial. Em um ambiente de produção, é altamente recomendável usar *connection pools* (como HikariCP, Apache DBCP, C3P0) para gerenciar as conexões com o banco de dados. Eles otimizam a criação e o reuso de conexões, melhorando significativamente a performance e a robustez da aplicação.

```java
// Exemplo simplificado de uso de try-with-resources (Java 7+)
// Para garantir o fechamento automático de recursos
try (Connection conn = getConnection();
     CallableStatement stmt = conn.prepareCall("{call minha_procedure(?, ?)}")) {

    // ... sua lógica aqui

} catch (SQLException e) {
    // Tratamento de exceção
}

```

O `try-with-resources` é a melhor prática atual para garantir que recursos que implementam `AutoCloseable` (como `Connection`, `Statement`, `ResultSet`) sejam fechados automaticamente quando o bloco `try` é finalizado, mesmo que ocorra uma exceção.

### Tratamento de Erros e Exceções

O tratamento de exceções com `SQLException` é fundamental. Sempre capture exceções, registre-as (usando um framework de logging como SLF4J/Logback ou Log4j) e, se necessário, lance exceções mais específicas para a camada de negócios da sua aplicação. Evite imprimir a stack trace diretamente em produção, prefira o registro em logs.

### Tipos de Dados e Mapeamento

A compatibilidade de tipos entre Java (`java.sql.Types`) e o SGBD é um ponto crítico. Um erro de mapeamento pode causar `SQLException`s ou dados incorretos. Consulte sempre a documentação do driver JDBC para o seu SGBD específico para entender os mapeamentos corretos. Por exemplo, um `DECIMAL` no SQL pode ser mapeado para `BigDecimal` ou `double` no Java, dependendo da precisão e do driver. `BigDecimal` é geralmente preferível para valores monetários devido à sua precisão exata.

### Stored Procedures com Multiple ResultSets

Alguns SGBDs e drivers JDBC permitem que uma única *stored procedure* retorne múltiplos `ResultSet`s. Nesses casos, após executar o `CallableStatement` com `execute()`, você pode usar `getResultSet()` e `getMoreResults()` para iterar sobre os `ResultSet`s retornados.

```java
// Exemplo teórico para múltiplos ResultSets
boolean hasResultSet = stmt.execute();
while (hasResultSet) {
    try (ResultSet rs = stmt.getResultSet()) {
        if (rs != null) {
            // Processar o ResultSet
            while (rs.next()) {
                // ...
            }
        }
    }
    hasResultSet = stmt.getMoreResults(); // Tenta obter o próximo ResultSet
}

```

### 6\. Referências para Estudo Independente

Para aprofundar seu conhecimento sobre `CallableStatement` e JDBC, recomendo os seguintes recursos:

- **Documentação Oficial da Oracle (Java SE):**
    - [Using Callable Statements](https://docs.oracle.com/javase/tutorial/jdbc/basics/storedprocedures.html)
    - [CallableStatement (Java Platform SE 8 )](https://docs.oracle.com/javase/8/docs/api/java/sql/CallableStatement.html)
    - [Types (Java Platform SE 8 )](https://docs.oracle.com/javase/8/docs/api/java/sql/Types.html)
- **TutorialsPoint - JDBC CallableStatement:**
    - [JDBC CallableStatement](https://www.google.com/search?q=https://www.tutorialspoint.com/jdbc/jdbc_callablestatement.htm)
- **Baeldung - JDBC CallableStatement:**
    - [How to Use CallableStatement in JDBC](https://www.google.com/search?q=https://www.baeldung.com/jdbc-callablestatement)
- **GeeksforGeeks - Callable Statement in JDBC:**
    - [Callable Statement in JDBC](https://www.google.com/search?q=https://www.geeksforgeeks.org/callablestatement-in-jdbc/)
- **Documentação do Driver JDBC para o seu SGBD:**
    - Para MySQL (Connector/J): [MySQL Connector/J Developer Guide](https://www.google.com/search?q=https://dev.mysql.com/doc/connector-j/8.0/en/) (Procure por seções sobre stored procedures)
    - Para PostgreSQL: [PostgreSQL JDBC Driver](https://www.google.com/search?q=https://jdbc.postgresql.org/documentation/head/callablestatement.html)

---

Espero que esta explicação detalhada sobre `CallableStatement` no JDBC, com foco em parâmetros IN, OUT e INOUT, seja extremamente útil para você, Gedê, no seu dia a dia como desenvolvedor Backend Java e na sua transição para Go\! Se tiver mais alguma dúvida, é só chamar a A.R.I.A.\!