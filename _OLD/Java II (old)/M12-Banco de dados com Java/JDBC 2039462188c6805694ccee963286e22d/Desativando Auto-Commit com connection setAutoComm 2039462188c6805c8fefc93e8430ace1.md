# Desativando Auto-Commit com connection.setAutoCommit(false)

Olá, Gedê\! Como desenvolvedor Backend Java, o tema de Gerenciamento de Transações com `connection.setAutoCommit(false)` no JDBC é super relevante para o seu dia a dia. A.R.I.A vai te ajudar a entender tudo em detalhes.

## Gerenciamento de Transações: Desativando Auto-Commit com `connection.setAutoCommit(false)` no JDBC

### 1\. Introdução

O gerenciamento de transações é um conceito fundamental no desenvolvimento de aplicações que interagem com bancos de dados. Ele garante a integridade e a consistência dos dados, especialmente em operações que envolvem múltiplas modificações. No contexto do JDBC (Java Database Connectivity), que é a API padrão do Java para conexão com bancos de dados relacionais, o controle transacional é exercido principalmente através do método `setAutoCommit(false)` da interface `Connection`.

A relevância desse tema é imensa para qualquer desenvolvedor que lida com persistência de dados. Sem um controle transacional adequado, cenários como transferências bancárias, atualizações de estoque ou qualquer operação que dependa da execução bem-sucedida de uma série de passos interdependentes se tornam propensos a inconsistências. Imagine, por exemplo, uma transferência de dinheiro onde o débito é realizado, mas o crédito falha. Sem transações, o dinheiro simplesmente desapareceria\! O gerenciamento de transações, portanto, é crucial para garantir que um conjunto de operações seja tratado como uma única unidade atômica: ou todas as operações são concluídas com sucesso (commit), ou nenhuma delas é (rollback).

**Definição e Conceitos Fundamentais:**

- **Transação:** Uma transação em um banco de dados é uma sequência de operações (leitura, inserção, atualização, exclusão) que são tratadas como uma única unidade lógica e atômica de trabalho. Elas são projetadas para garantir a integridade dos dados, mesmo em caso de falhas do sistema ou concorrência. As transações seguem as propriedades ACID (Atomicidade, Consistência, Isolamento e Durabilidade).
    - **Atomicidade:** Uma transação é uma unidade indivisível de trabalho. Ou todas as suas operações são concluídas com sucesso, ou nenhuma delas é. Se uma parte da transação falha, toda a transação é revertida ao seu estado original.
    - **Consistência:** Uma transação deve levar o banco de dados de um estado válido para outro estado válido. Ela garante que todas as regras e restrições do banco de dados sejam mantidas.
    - **Isolamento:** As operações de uma transação devem ser isoladas das operações de outras transações simultâneas. Isso significa que as transações não devem interferir umas nas outras. O resultado final de múltiplas transações simultâneas deve ser o mesmo como se elas tivessem sido executadas sequencialmente.
    - **Durabilidade:** Uma vez que uma transação é confirmada (commit), suas alterações são permanentes e resistem a falhas do sistema (como quedas de energia).
- **Auto-Commit:** Por padrão, no JDBC, o modo de auto-commit é `true`. Isso significa que cada instrução SQL (como `INSERT`, `UPDATE`, `DELETE`) é tratada como uma transação separada e é automaticamente confirmada (commit) no banco de dados assim que é executada. Isso é conveniente para operações simples, mas é inadequado para operações que exigem que múltiplos comandos SQL sejam executados como uma única unidade transacional.
- **`connection.setAutoCommit(false)`:** Este método é utilizado para desativar o modo de auto-commit padrão do JDBC. Ao fazer isso, o desenvolvedor assume o controle explícito sobre o início e o fim das transações. Todas as operações SQL executadas após `setAutoCommit(false)` e antes de um `commit()` ou `rollback()` farão parte da mesma transação.
- **`connection.commit()`:** Este método é usado para finalizar uma transação com sucesso. Todas as mudanças feitas dentro da transação são salvas permanentemente no banco de dados.
- **`connection.rollback()`:** Este método é usado para reverter uma transação. Se ocorrer um erro ou se o desenvolvedor decidir que as operações não devem ser salvas, `rollback()` desfaz todas as mudanças feitas desde o início da transação (ou desde o último `commit`).

### 2\. Sumário

Neste documento, abordaremos os seguintes tópicos relacionados ao gerenciamento de transações e ao uso de `connection.setAutoCommit(false)` no JDBC:

- **Fundamentos do Auto-Commit e Transações**
- **Sintaxe e Estrutura de Gerenciamento de Transações no JDBC**
- **Componentes Principais: `Connection`, `commit()`, `rollback()`**
- **Restrições e Melhores Práticas**
- **Exemplos de Código Otimizados**
- **Informações Adicionais (Savepoints, Níveis de Isolamento)**
- **Referências para Estudo Independente**

### 3\. Conteúdo Detalhado

### Sintaxe e Estrutura

A estrutura básica para gerenciar transações no JDBC, desativando o auto-commit, geralmente segue este padrão:

```java
Connection connection = null;
try {
    // 1. Obter a conexão com o banco de dados
    connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/meubanco", "usuario", "senha");

    // 2. Desativar o auto-commit
    connection.setAutoCommit(false); // Inicia a transação

    // 3. Executar múltiplas operações SQL
    // Exemplo: Débito
    String sqlUpdateDebito = "UPDATE contas SET saldo = saldo - ? WHERE id = ?";
    try (PreparedStatement psDebito = connection.prepareStatement(sqlUpdateDebito)) {
        psDebito.setDouble(1, 100.00);
        psDebito.setInt(2, 1);
        psDebito.executeUpdate();
    }

    // Exemplo: Crédito
    String sqlUpdateCredito = "UPDATE contas SET saldo = saldo + ? WHERE id = ?";
    try (PreparedStatement psCredito = connection.prepareStatement(sqlUpdateCredito)) {
        psCredito.setDouble(1, 100.00);
        psCredito.setInt(2, 2);
        psCredito.executeUpdate();
    }

    // 4. Confirmar a transação se todas as operações foram bem-sucedidas
    connection.commit(); // Finaliza a transação com sucesso
    System.out.println("Transação de transferência concluída com sucesso!");

} catch (SQLException e) {
    // 5. Reverter a transação em caso de erro
    if (connection != null) {
        try {
            connection.rollback(); // Desfaz todas as alterações
            System.err.println("Transação revertida devido a um erro: " + e.getMessage());
        } catch (SQLException rbEx) {
            System.err.println("Erro ao tentar fazer rollback: " + rbEx.getMessage());
        }
    }
    System.err.println("Erro na operação de banco de dados: " + e.getMessage());
} finally {
    // 6. Fechar a conexão
    if (connection != null) {
        try {
            connection.close();
        } catch (SQLException closeEx) {
            System.err.println("Erro ao fechar a conexão: " + closeEx.getMessage());
        }
    }
}

```

Neste exemplo, cada instrução SQL (`UPDATE` de débito e `UPDATE` de crédito) não é confirmada individualmente. Elas se tornam parte de uma única transação, que só será confirmada quando `connection.commit()` for chamado. Se qualquer exceção `SQLException` ocorrer durante as operações, o bloco `catch` será executado, e `connection.rollback()` será chamado para desfazer todas as alterações feitas na transação.

### Componentes Principais

- **`java.sql.Connection`:** Esta é a interface central para interagir com o banco de dados. Uma instância de `Connection` representa uma sessão única com um banco de dados específico. É através dela que você obtém objetos `Statement` ou `PreparedStatement` para executar comandos SQL.
    - **`setAutoCommit(boolean autoCommit)`:** Este método define o modo de auto-commit para esta conexão.
        - Se `true` (padrão), cada instrução SQL é executada e confirmada como uma transação individual.
        - Se `false`, o JDBC não faz commit automaticamente. O desenvolvedor deve chamar `commit()` ou `rollback()` explicitamente para finalizar a transação atual.
    - **`commit()`:** Este método torna permanentes todas as mudanças feitas na transação atual desde o último commit ou rollback. Libera quaisquer bloqueios de banco de dados e inicia uma nova transação.
    - **`rollback()`:** Este método desfaz todas as mudanças feitas na transação atual desde o último commit ou rollback. Isso efetivamente restaura o banco de dados para o estado em que estava antes do início da transação (ou do último commit). Libera quaisquer bloqueios de banco de dados e inicia uma nova transação.
    - **`close()`:** Fecha a conexão com o banco de dados. É crucial fechar a conexão e todos os recursos JDBC (Statements, ResultSets) para liberar recursos do sistema e do banco de dados.
- **`java.sql.Statement` e `java.sql.PreparedStatement`:** Utilizados para executar comandos SQL. As operações realizadas por esses objetos são incluídas na transação ativa da `Connection`.

### Restrições de Uso

- **Não misture auto-commit e commit/rollback manual sem cuidado:** Se você desativar o auto-commit, certifique-se de sempre chamar `commit()` ou `rollback()` para finalizar a transação. Caso contrário, as mudanças podem ficar pendentes, recursos do banco de dados podem não ser liberados, e bloqueios podem permanecer ativos, causando problemas de concorrência.
- **Fechamento de conexão:** Se você fechar uma conexão JDBC sem um `commit()` ou `rollback()` explícito, o comportamento pode variar dependendo do driver JDBC e do banco de dados. Alguns podem fazer um `rollback` implícito, outros podem fazer um `commit` implícito. Para garantir a portabilidade e a integridade, sempre finalize a transação manualmente.
- **Tratamento de exceções:** É crucial que o `rollback()` seja chamado dentro de um bloco `catch` para garantir que, se um erro ocorrer, a transação seja revertida e o banco de dados não seja deixado em um estado inconsistente. O `commit()` deve ser chamado apenas se todas as operações forem bem-sucedidas.
- **Escopo da transação:** Uma transação está ligada a uma única instância de `Connection`. Você não pode ter uma única transação abrangendo operações em várias conexões. Se precisar coordenar operações em diferentes bancos de dados ou em sistemas distribuídos, você precisará de um Transaction Manager distribuído (como JTA/XA), que é um tópico mais avançado.
- **Concorrência e Deadlocks:** Embora o controle transacional ajude na consistência, operações concorrentes podem levar a deadlocks se não forem bem projetadas. O JDBC, por si só, não resolve todos os problemas de concorrência, mas é a base para o controle.

### 4\. Exemplos de Código Otimizados

Vamos aprofundar com um exemplo mais completo, simulando um cenário de comércio eletrônico onde um pedido é feito e o estoque é atualizado.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class GerenciadorTransacoesEcommerce {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASS = "admin";

    public static void main(String[] args) {
        // Criar tabelas para o exemplo (se não existirem)
        criarTabelas();

        // Simular um cenário de sucesso
        System.out.println("--- Teste de Compra Bem-Sucedida ---");
        realizarCompra(1, 101, 2, 50.00); // Cliente 1 compra 2 unidades do Produto 101 a 50.00 cada

        System.out.println("\\n--- Teste de Compra com Erro (Estoque Insuficiente) ---");
        realizarCompra(2, 102, 10, 10.00); // Cliente 2 tenta comprar 10 unidades do Produto 102 (só tem 5)

        System.out.println("\\n--- Teste de Compra com Erro (Erro no Saldo - Simulado) ---");
        realizarCompra(3, 101, 1, -100.00); // Cliente 3 tenta comprar 1 unidade do Produto 101 com valor inválido
    }

    private static void criarTabelas() {
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
             Statement stmt = conn.createStatement()) {

            stmt.execute("DROP TABLE IF EXISTS produtos");
            stmt.execute("DROP TABLE IF EXISTS pedidos");
            stmt.execute("DROP TABLE IF EXISTS itens_pedido");

            stmt.execute("CREATE TABLE produtos (" +
                         "id INT PRIMARY KEY AUTO_INCREMENT," +
                         "nome VARCHAR(100) NOT NULL," +
                         "estoque INT NOT NULL," +
                         "preco DOUBLE NOT NULL)");

            stmt.execute("CREATE TABLE pedidos (" +
                         "id INT PRIMARY KEY AUTO_INCREMENT," +
                         "cliente_id INT NOT NULL," +
                         "data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP," +
                         "valor_total DOUBLE NOT NULL)");

            stmt.execute("CREATE TABLE itens_pedido (" +
                         "id INT PRIMARY KEY AUTO_INCREMENT," +
                         "pedido_id INT NOT NULL," +
                         "produto_id INT NOT NULL," +
                         "quantidade INT NOT NULL," +
                         "preco_unitario DOUBLE NOT NULL," +
                         "FOREIGN KEY (pedido_id) REFERENCES pedidos(id)," +
                         "FOREIGN KEY (produto_id) REFERENCES produtos(id))");

            // Inserir dados de teste
            stmt.execute("INSERT INTO produtos (nome, estoque, preco) VALUES ('Laptop', 10, 1200.00)"); // ID 101
            stmt.execute("INSERT INTO produtos (nome, estoque, preco) VALUES ('Mouse', 5, 25.00)");    // ID 102

            System.out.println("Tabelas criadas e dados iniciais inseridos.");

        } catch (SQLException e) {
            System.err.println("Erro ao criar tabelas: " + e.getMessage());
        }
    }

    /**
     * Simula a realização de uma compra, atualizando o estoque e inserindo o pedido.
     * Utiliza transações para garantir atomicidade.
     *
     * @param clienteId O ID do cliente.
     * @param produtoId O ID do produto a ser comprado.
     * @param quantidade A quantidade do produto a ser comprada.
     * @param precoUnitario O preço unitário do produto (para validação ou inserção no pedido).
     */
    public static void realizarCompra(int clienteId, int produtoId, int quantidade, double precoUnitario) {
        Connection connection = null;
        PreparedStatement psUpdateEstoque = null;
        PreparedStatement psInsertPedido = null;
        PreparedStatement psInsertItemPedido = null;
        PreparedStatement psGetEstoque = null;
        ResultSet rsEstoque = null;

        try {
            connection = DriverManager.getConnection(DB_URL, USER, PASS);
            connection.setAutoCommit(false); // Desativa o auto-commit para iniciar a transação

            // 1. Verificar estoque disponível
            String sqlGetEstoque = "SELECT estoque FROM produtos WHERE id = ?";
            psGetEstoque = connection.prepareStatement(sqlGetEstoque);
            psGetEstoque.setInt(1, produtoId);
            rsEstoque = psGetEstoque.executeQuery();

            int estoqueAtual = 0;
            if (rsEstoque.next()) {
                estoqueAtual = rsEstoque.getInt("estoque");
            } else {
                throw new SQLException("Produto com ID " + produtoId + " não encontrado.");
            }

            if (estoqueAtual < quantidade) {
                throw new SQLException("Estoque insuficiente para o produto ID " + produtoId + ". Disponível: " + estoqueAtual + ", Solicitado: " + quantidade);
            }

            // 2. Atualizar o estoque do produto
            String sqlUpdateEstoque = "UPDATE produtos SET estoque = estoque - ? WHERE id = ?";
            psUpdateEstoque = connection.prepareStatement(sqlUpdateEstoque);
            psUpdateEstoque.setInt(1, quantidade);
            psUpdateEstoque.setInt(2, produtoId);
            psUpdateEstoque.executeUpdate();

            // 3. Inserir o novo pedido
            double valorTotal = quantidade * precoUnitario;
            if (valorTotal <= 0) { // Exemplo de validação de negócio que pode gerar rollback
                throw new SQLException("Valor total do pedido inválido: " + valorTotal);
            }

            String sqlInsertPedido = "INSERT INTO pedidos (cliente_id, valor_total) VALUES (?, ?)";
            psInsertPedido = connection.prepareStatement(sqlInsertPedido, Statement.RETURN_GENERATED_KEYS);
            psInsertPedido.setInt(1, clienteId);
            psInsertPedido.setDouble(2, valorTotal);
            psInsertPedido.executeUpdate();

            // Obter o ID do pedido gerado
            ResultSet rsGeneratedKeys = psInsertPedido.getGeneratedKeys();
            int pedidoId;
            if (rsGeneratedKeys.next()) {
                pedidoId = rsGeneratedKeys.getInt(1);
            } else {
                throw new SQLException("Falha ao obter ID do pedido gerado.");
            }

            // 4. Inserir o item do pedido
            String sqlInsertItemPedido = "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)";
            psInsertItemPedido = connection.prepareStatement(sqlInsertItemPedido);
            psInsertItemPedido.setInt(1, pedidoId);
            psInsertItemPedido.setInt(2, produtoId);
            psInsertItemPedido.setInt(3, quantidade);
            psInsertItemPedido.setDouble(4, precoUnitario);
            psInsertItemPedido.executeUpdate();

            // 5. Se tudo correu bem, confirma a transação
            connection.commit();
            System.out.println("Compra do cliente " + clienteId + " para o produto " + produtoId + " (qtd: " + quantidade + ") realizada com sucesso. Pedido ID: " + pedidoId);

        } catch (SQLException e) {
            System.err.println("Erro na compra: " + e.getMessage());
            if (connection != null) {
                try {
                    System.err.println("Realizando rollback...");
                    connection.rollback(); // Em caso de erro, desfaz todas as alterações
                    System.err.println("Rollback concluído. Nenhuma alteração foi persistida.");
                } catch (SQLException rbEx) {
                    System.err.println("Erro ao tentar fazer rollback: " + rbEx.getMessage());
                }
            }
        } finally {
            // Fechar recursos na ordem inversa de abertura
            try { if (rsEstoque != null) rsEstoque.close(); } catch (SQLException e) { /* ignored */ }
            try { if (psGetEstoque != null) psGetEstoque.close(); } catch (SQLException e) { /* ignored */ }
            try { if (psUpdateEstoque != null) psUpdateEstoque.close(); } catch (SQLException e) { /* ignored */ }
            try { if (psInsertPedido != null) psInsertPedido.close(); } catch (SQLException e) { /* ignored */ }
            try { if (psInsertItemPedido != null) psInsertItemPedido.close(); } catch (SQLException e) { /* ignored */ }
            try { if (connection != null) connection.close(); } catch (SQLException e) { System.err.println("Erro ao fechar conexão: " + e.getMessage()); }
        }
        System.out.println("------------------------------------");
    }
}

```

Este exemplo demonstra um caso de uso real onde a atomicidade é crítica:

- A compra de um produto envolve a **verificação de estoque**, a **atualização do estoque**, a **inserção do pedido** e a **inserção dos itens do pedido**.
- Se qualquer um desses passos falhar (ex: estoque insuficiente, erro ao inserir no banco), a transação inteira é revertida (rollback), garantindo que o estoque não seja decrementado sem que o pedido seja registrado, ou vice-versa.
- A validação de `valorTotal <= 0` é um exemplo de uma regra de negócio que, ao ser violada, também pode desencadear um `rollback`, mesmo antes de uma exceção de banco de dados ocorrer.

### 5\. Informações Adicionais

### Níveis de Isolamento de Transação

Além de `setAutoCommit(false)`, é importante entender os níveis de isolamento de transação. O JDBC permite definir o nível de isolamento para uma conexão, o que afeta como as transações interagem umas com as outras. Isso é feito com `connection.setTransactionIsolation()`. Os níveis padrão são definidos pela especificação JDBC, mas os bancos de dados podem ter variações.

Os níveis de isolamento (do menos ao mais isolado) são:

- **`TRANSACTION_READ_UNCOMMITTED`:** (Leitura não confirmada) Permite "leituras sujas" (dirty reads), onde uma transação pode ler dados que foram modificados por outra transação, mas que ainda não foram confirmados. Se a segunda transação for revertida, a primeira terá lido dados que nunca existiram de fato. Raramente usado devido à falta de consistência.
- **`TRANSACTION_READ_COMMITTED`:** (Leitura confirmada) O nível padrão para muitos bancos de dados. Garante que uma transação só veja os dados que foram confirmados por outras transações. Impede dirty reads. No entanto, pode ocorrer "leituras não repetíveis" (non-repeatable reads) e "fantasmas" (phantom reads).
    - **Non-repeatable reads:** Se uma transação ler a mesma linha duas vezes, e outra transação confirmar uma alteração nessa linha entre as duas leituras, a primeira transação verá dados diferentes na segunda leitura.
    - **Phantom reads:** Se uma transação executar uma consulta que retorna um conjunto de linhas, e outra transação inserir novas linhas que satisfazem a condição da consulta, a primeira transação, se executar a mesma consulta novamente, verá "novas" linhas (fantasmas).
- **`TRANSACTION_REPEATABLE_READ`:** (Leitura repetível) Garante que, se uma transação lê uma linha, ela sempre lerá a mesma versão dessa linha durante toda a transação, independentemente de outras transações terem modificado e confirmado essa linha. Impede dirty reads e non-repeatable reads. No entanto, phantom reads ainda podem ocorrer.
- **`TRANSACTION_SERIALIZABLE`:** (Serializável) O nível mais alto de isolamento. Garante que o resultado da execução simultânea de várias transações seja o mesmo como se elas tivessem sido executadas sequencialmente. Impede dirty reads, non-repeatable reads e phantom reads. Geralmente tem o custo mais alto em termos de desempenho, pois impõe bloqueios mais rigorosos.

**Exemplo de uso de `setTransactionIsolation`:**

```java
try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASS)) {
    connection.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
    connection.setAutoCommit(false);
    // ... suas operações transacionais ...
    connection.commit();
} catch (SQLException e) {
    if (connection != null) {
        connection.rollback();
    }
    e.printStackTrace();
}

```

A escolha do nível de isolamento depende do balanço entre a consistência dos dados e o desempenho da aplicação. Níveis mais altos de isolamento fornecem maior consistência, mas podem reduzir a concorrência e impactar o desempenho.

### Savepoints

O JDBC 3.0 introduziu o conceito de `Savepoint`, que permite definir pontos dentro de uma transação para os quais você pode reverter (rollback) sem precisar reverter a transação inteira. Isso é útil em cenários complexos onde você deseja reverter apenas uma parte da transação em caso de erro, mas manter outras partes confirmadas.

- **`connection.setSavepoint()`:** Cria um novo `Savepoint` dentro da transação atual. Retorna um objeto `Savepoint`.
- **`connection.rollback(Savepoint savepoint)`:** Desfaz todas as operações realizadas após o `Savepoint` especificado.
- **`connection.releaseSavepoint(Savepoint savepoint)`:** Remove o `Savepoint` especificado da transação atual.

**Exemplo de uso de Savepoints:**

```java
Connection connection = null;
Savepoint savepoint1 = null;

try {
    connection = DriverManager.getConnection(DB_URL, USER, PASS);
    connection.setAutoCommit(false);

    // Operação 1
    // ... insert ou update ...

    // Definir um savepoint após a primeira operação
    savepoint1 = connection.setSavepoint("SavepointAfterOperation1");

    // Operação 2
    // ... insert ou update ...

    // Supondo que a Operação 2 falhou, podemos reverter apenas até o savepoint1
    // if (erroNaOperacao2) {
    //     connection.rollback(savepoint1);
    //     // Agora, a Operação 1 ainda está na transação, mas a 2 foi desfeita.
    //     // Podemos tentar outras operações ou simplesmente fazer um commit/rollback final.
    // }

    // Ou se tudo correu bem
    connection.commit();

} catch (SQLException e) {
    if (connection != null) {
        try {
            if (savepoint1 != null) {
                connection.rollback(savepoint1); // Reverter até o savepoint
            } else {
                connection.rollback(); // Reverter a transação inteira
            }
            System.err.println("Rollback realizado.");
        } catch (SQLException rbEx) {
            System.err.println("Erro ao tentar fazer rollback: " + rbEx.getMessage());
        }
    }
    e.printStackTrace();
} finally {
    // Fechar recursos
    if (connection != null) {
        try { connection.close(); } catch (SQLException e) { /* ignored */ }
    }
}

```

### 6\. Referências para Estudo Independente

Para aprofundar seus conhecimentos em JDBC e gerenciamento de transações, Gedê, A.R.I.A recomenda os seguintes recursos:

- **Documentação Oficial da Oracle (JDBC Basics):**
    - Este é o ponto de partida mais confiável. Procure pela seção sobre Transações.
    - [https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html](https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html)
- **Guia Java JDBC ([baeldung.com](http://baeldung.com/)):**
    - O Baeldung é uma excelente fonte de tutoriais Java práticos e bem explicados.
    - [https://www.baeldung.com/java-jdbc](https://www.baeldung.com/java-jdbc)
    - Procure especificamente por artigos sobre gerenciamento de transações. Ex: [https://www.baeldung.com/jdbc-transactions](https://www.baeldung.com/jdbc-transactions)
- **Tutorialspoint - JDBC Transactions:**
    - Um bom recurso para entender os conceitos básicos de transações no JDBC.
    - [https://www.tutorialspoint.com/jdbc/jdbc\\_transactions.htm](https://www.tutorialspoint.com/jdbc/jdbc%5C%5C_transactions.htm)
- **Livros Recomendados:**
    - **"JDBC, SQL for Java DBAs and Developers"** por Budi Kurniawan: Embora talvez um pouco mais antigo, os fundamentos de JDBC e transações são bem cobertos.
    - **"Effective Java"** por Joshua Bloch: Não é um livro específico sobre JDBC, mas aborda práticas de programação Java de alto nível que são aplicáveis, incluindo gerenciamento de recursos (como conexões de banco de dados).
- **Documentação do seu Banco de Dados Específico:**
    - Cada banco de dados (MySQL, PostgreSQL, Oracle, etc.) tem suas próprias nuances sobre como as transações são implementadas, especialmente em relação a níveis de isolamento e bloqueios. Consultar a documentação do banco de dados que você está usando é sempre uma boa prática.
        - **MySQL:** [https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation.html](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation.html)
        - **PostgreSQL:** [https://www.postgresql.org/docs/current/transaction-iso.html](https://www.postgresql.org/docs/current/transaction-iso.html)

Espero que esta explicação detalhada ajude você, Gedê, a dominar o gerenciamento de transações com `connection.setAutoCommit(false)` no JDBC\! Se tiver mais alguma dúvida, pode perguntar.