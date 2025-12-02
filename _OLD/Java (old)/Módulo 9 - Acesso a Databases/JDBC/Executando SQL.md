# Executando SQL

## Classe PreparedStatement

#### Conceito
`PreparedStatement` é uma extensão da classe `Statement`. Ele é usado para executar comandos SQL pré-compilados com ou sem parâmetros de entrada.

#### Vantagens:
- **Performance:** Maior eficiência, pois o SQL é pré-compilado e armazenado no objeto `PreparedStatement`.
- **Segurança:** Previne ataques de injeção de SQL ao usar parâmetros.

#### Métodos e Sintaxe

- `PreparedStatement prepareStatement(String sql)`: Cria um objeto `PreparedStatement`.
  
  ```java
  String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  PreparedStatement pstmt = conn.prepareStatement(sql);
  ```

- `void setInt(int parameterIndex, int value)`, `void setString(int parameterIndex, String value)`, etc.: Define os valores dos parâmetros.
  
  ```java
  pstmt.setString(1, "John Doe");
  pstmt.setString(2, "john@example.com");
  ```

- `int executeUpdate()`: Executa instruções INSERT, UPDATE, DELETE.
  
  ```java
  int rowsAffected = pstmt.executeUpdate();
  ```

- `ResultSet executeQuery()`: Executa instruções SELECT.

  ```java
  ResultSet rs = pstmt.executeQuery();
  ```

### Exemplo Completo

```java
Connection conn = DriverManager.getConnection(url, user, password);
String sql = "SELECT * FROM users WHERE id = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setInt(1, 10);
ResultSet rs = pstmt.executeQuery();
```

## Classe Statement

#### Conceito
`Statement` é usado para executar instruções SQL estáticas sem parâmetros.

#### Métodos e Sintaxe

- `Statement createStatement()`: Cria um objeto `Statement`.
  
  ```java
  Statement stmt = conn.createStatement();
  ```

- `ResultSet executeQuery(String sql)`: Executa instruções SELECT.
  
  ```java
  ResultSet rs = stmt.executeQuery("SELECT * FROM users");
  ```

- `int executeUpdate(String sql)`: Executa instruções INSERT, UPDATE, DELETE.
  
  ```java
  int rowsAffected = stmt.executeUpdate("UPDATE users SET name = 'John' WHERE id = 10");
  ```

## Classe ResultSet

#### Conceito
`ResultSet` é um objeto que armazena o resultado retornado por uma consulta SQL.

#### Métodos e Sintaxe

- `boolean next()`: Move o cursor para a próxima linha do ResultSet.
  
  ```java
  while (rs.next()) {
      // Processa a linha atual
  }
  ```

- `getString(String columnLabel)`, `getInt(String columnLabel)`, etc.: Obtém o valor da coluna especificada.
  
  ```java
  String name = rs.getString("name");
  int id = rs.getInt("id");
  ```

- `void close()`: Fecha o ResultSet.
  
  ```java
  rs.close();
  ```

### Exemplo de Uso do ResultSet

```java
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT id, name FROM users");
while (rs.next()) {
    int id = rs.getInt("id");
    String name = rs.getString("name");
    System.out.println("ID: " + id + ", Name: " + name);
}
rs.close();
```

## Conclusão

O JDBC é uma ferramenta fundamental para interação com bancos de dados em aplicações Java. As classes `PreparedStatement`, `Statement`, e `ResultSet` são essenciais nesse processo, permitindo executar comandos SQL de maneira eficiente e segura. O uso adequado dessas classes contribui para a criação de aplicações robustas e confiáveis. É importante entender as diferenças entre elas e quando usar cada uma para otimizar o desempenho e a segurança das operações de banco de dados.