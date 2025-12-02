# Banco de Dados com JDBC em Java

O JDBC (Java Database Connectivity) é uma API que permite a execução de operações em bancos de dados a partir de código Java. Vamos explorar como abrir uma conexão usando JDBC, focando nas classes `Connection` e `DriverManager`.

## Abrindo uma Conexão

### Classe `Connection`

A classe `Connection` é uma parte fundamental do JDBC, pois representa uma conexão com um banco de dados.

#### Métodos Mais Importantes e Sua Sintaxe

1. **getConnection()** - Estabelece uma conexão com o banco de dados.
   ```java
   Connection con = DriverManager.getConnection(url, username, password);
   ```
   - **url**: String que define o endereço do banco de dados.
   - **username**: Nome de usuário para o banco de dados.
   - **password**: Senha para o banco de dados.

2. **close()** - Fecha a conexão.
   ```java
   con.close();
   ```
   - Deve ser usado em um bloco `finally` ou em um try-with-resources para garantir que a conexão seja fechada.

3. **prepareStatement()** - Cria um `PreparedStatement` para enviar instruções SQL parametrizadas ao banco de dados.
   ```java
   PreparedStatement pstmt = con.prepareStatement("SELECT * FROM tabela WHERE id = ?");
   pstmt.setInt(1, 10); // Define o parâmetro 1 como 10
   ResultSet rs = pstmt.executeQuery();
   ```
   - Útil para evitar ataques de injeção de SQL.

4. **createStatement()** - Cria um `Statement` para enviar instruções SQL ao banco de dados.
   ```java
   Statement stmt = con.createStatement();
   ResultSet rs = stmt.executeQuery("SELECT * FROM tabela");
   ```
   - Usado para consultas simples sem parâmetros.

5. **commit()** e **rollback()** - Controlam transações.
   ```java
   con.setAutoCommit(false); // Desativa o commit automático
   // Operações de banco de dados
   con.commit(); // Confirma as operações
   // ou
   con.rollback(); // Reverte as operações
   ```
   - Usados para garantir a integridade dos dados em operações complexas.

### Classe `DriverManager`

A classe `DriverManager` gerencia uma lista de drivers de banco de dados.

#### Métodos Mais Importantes e Sua Sintaxe

1. **getConnection()** - Retorna uma conexão com o banco de dados.
   ```java
   Connection con = DriverManager.getConnection(url, username, password);
   ```
   - Este método é o

mesmo discutido anteriormente na classe `Connection`.

2. **registerDriver(Driver driver)** - Registra um driver JDBC.
   ```java
   DriverManager.registerDriver(new com.mysql.jdbc.Driver());
   ```
   - Este método é raramente usado, pois os drivers são geralmente carregados automaticamente.

3. **deregisterDriver(Driver driver)** - Remove o driver JDBC do `DriverManager`.
   ```java
   DriverManager.deregisterDriver(new com.mysql.jdbc.Driver());
   ```
   - Pode ser útil em ambientes de aplicativos complexos, onde o controle sobre os drivers carregados é necessário.

4. **getDrivers()** - Retorna uma enumeração de todos os drivers JDBC registrados.
   ```java
   Enumeration<Driver> driverList = DriverManager.getDrivers();
   ```
   - Útil para debugging ou para verificar quais drivers estão atualmente registrados.

### Exemplo de Uso 

Vamos ver um exemplo básico de como abrir e fechar uma conexão com o banco de dados usando JDBC, onde você pode abrir a conexão e executar comandos sql e depois fechá-la:

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Main {
    public static void main(String[] args) {
        // URL de conexão ao banco de dados
        String url = "jdbc:mysql://localhost:3306/meubanco";
        String username = "meuUsuario";
        String password = "minhaSenha";

        Connection con = null;
        try {
            // Abrindo a conexão
            con = DriverManager.getConnection(url, username, password);
            System.out.println("Conexão estabelecida com sucesso!");

            // Operações com o banco de dados aqui...

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (con != null && !con.isClosed()) {
                    con.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }
}
```

### Exemplo de Fábrica de Conexões 

Vamos ver um exemplo básico de uso com modularidade onde captura-se uma instancia da conexão para possivelmente usar num ORM como Hibernate:

```java
package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexaoDB {
    
    private static Connection conexao;
    
    public static Connection obterConexao() throws ClassNotFoundException, SQLException {
        
            String servidor = "127.0.0.1:5432";
            String login = "postgres";
            String senha = "704980";
            String nomeBanco = "StoqDB";
            String url = "jdbc:postgresql://localhost:5432/StoqDB";

            
            /*
                Definição do Driver do banco Um dos usos mais comuns do Class.forName() é no carregamento de drivers JDBC.
                Antes do JDBC 4.0, era necessário carregar o driver do banco de dados explicitamente usando Class.forName() para registrar o driver com o DriverManager.
                A partir do JDBC 4.0, esse passo geralmente não é mais necessário, pois os drivers compatíveis são carregados automaticamente.
            */
            // Definição do Driver do banco
            Class.forName("org.postgresql.Driver");

            // Abrindo a conexão
            conexao = DriverManager.getConnection( url , login, senha);
            return conexao;        
        
    }
}
```

### Considerações Finais

- É fundamental fechar a conexão com o banco de dados para evitar vazamentos de recursos.
- O tratamento de exceções é crucial para lidar com possíveis problemas na conexão ou na execução de comandos SQL.
- O uso de `PreparedStatement` é recomendado sobre `Statement` para evitar ataques de injeção de SQL e melhorar a performance.
- Gerenciar transações com `commit()` e `rollback()` é essencial em operações que envolvem múltiplos passos ou alterações críticas nos dados.

---

**Dicas Adicionais:**
- **Gerenciamento de Recursos:** Considere usar o try-with-resources do Java 7 ou superior para gerenciar automaticamente o fechamento de recursos como `Connection`, `PreparedStatement` e `ResultSet`.
- **Configurações de Conexão:** Ajustes na URL de conexão, como configurações de timezone e codificação de caracteres, podem ser necessários dependendo do banco de dados e do ambiente.
- **Driver JDBC:** Certifique-se de ter o driver JDBC correto para o banco de dados que você está usando, e que ele está no classpath da aplicação.
- **Driver ORM:** Certifique-se de ter o driver do ORM correto para o banco de dados que você está usando, e que ele está no classpath da aplicação.

Este módulo fornece uma base sólida para entender como estabelecer conexões com bancos de dados em Java usando JDBC. A partir daqui, você pode explorar mais sobre a execução de consultas, atualizações, e o trabalho com resultados de banco de dados.