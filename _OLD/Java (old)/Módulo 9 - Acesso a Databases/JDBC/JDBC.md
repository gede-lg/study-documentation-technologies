# Banco de Dados com JDBC em Java

## **O que é JDBC?**

**JDBC (Java Database Connectivity)** é uma API do Java que gerencia a conexão entre um aplicativo Java e uma base de dados. O principal objetivo do JDBC é permitir a execução de operações em bancos de dados (como consultas e atualizações) de uma maneira independente do banco de dados utilizado.

## **Para que serve?**

JDBC serve para:

1. **Estabelecer Conexão com o Banco de Dados:** Permite que aplicativos Java se conectem a diferentes bancos de dados.
2. **Executar Consultas SQL:** Permite executar comandos SQL como `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
3. **Recuperar e Manipular Dados:** Permite recuperar dados de um banco de dados e manipulá-los dentro do aplicativo Java.
4. **Gerenciar Transações:** Suporta transações, permitindo commit e rollback.

## **Como Funciona o JDBC?**

O JDBC funciona através de drivers específicos para cada banco de dados. Esses drivers são responsáveis por implementar a comunicação entre o aplicativo Java e o banco de dados.

## **Exemplo Básico de Código com JDBC**

### **1. Adicionar Dependência do Driver JDBC**

Para conectar-se a um banco de dados MySQL, por exemplo, você precisará do driver JDBC para MySQL. Isso geralmente é adicionado como uma dependência no arquivo `pom.xml` para projetos Maven:

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.22</version>
</dependency>
```

### **2. Estabelecendo uma Conexão**

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/meuBancoDeDados";
        String user = "usuario";
        String password = "senha";

        try {
            Connection connection = DriverManager.getConnection(url, user, password);
            System.out.println("Conexão estabelecida com sucesso.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

### **3. Executando uma Consulta SQL**

```java
import java.sql.*;

public class QueryExample {
    public static void main(String[] args) {
        String query = "SELECT * FROM tabelaExemplo";

        try (Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/meuBancoDeDados", "

usuario", "senha");
             Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                int id = rs.getInt("id");
                String nome = rs.getString("nome");
                // outros campos...
                System.out.println("ID: " + id + ", Nome: " + nome);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

### **4. Inserindo Dados**

```java
public class InsertExample {
    public static void main(String[] args) {
        String insertQuery = "INSERT INTO tabelaExemplo (nome, valor) VALUES (?, ?)";

        try (Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/meuBancoDeDados", "usuario", "senha");
             PreparedStatement pstmt = connection.prepareStatement(insertQuery)) {

            pstmt.setString(1, "NomeExemplo");
            pstmt.setDouble(2, 123.45);
            int rowsAffected = pstmt.executeUpdate();
            System.out.println(rowsAffected + " linhas inseridas.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

### **5. Transações**

```java
public class TransactionExample {
    public static void main(String[] args) {
        try (Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/meuBancoDeDados", "usuario", "senha")) {
            connection.setAutoCommit(false);

            try {
                // Algumas operações de banco de dados...
                connection.commit();
            } catch (SQLException e) {
                connection.rollback();
                e.printStackTrace();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## **Pontos Importantes**

- **Gerenciamento de Exceções:** Sempre trate as `SQLExceptions` para lidar com possíveis erros de banco de dados.
- **Fechamento de Recursos:** É crucial fechar `Connection`, `Statement`, e `ResultSet` após o uso para evitar vazamentos de memória.
- **Segurança:** Use `PreparedStatement` para evitar injeção de SQL.
- **Desempenho:** Reutilize objetos `Connection`, se possível, e considere o uso de pools de conexão para melhorar o desempenho.

## **Conclusão**

O JDBC é uma ferramenta poderosa que permite a integração entre aplicações Java e bancos de dados. Embora existam abstrações de mais alto nível, como JPA e Hibernate, o entendimento do JDBC é fundamental para compreender como essas camadas superiores operam e para situações onde controle detalhado é necessário.