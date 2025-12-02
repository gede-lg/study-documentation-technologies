# Associação (Associando Criterias)

### Conceito de Associação

As associações na Criteria API referem-se à capacidade de ligar duas ou mais entidades (tabelas) em uma consulta. Isso é especialmente útil quando você está trabalhando com um modelo de dados relacional e precisa realizar operações que envolvem mais de uma tabela.

### Realizando Associações

Para realizar associações usando a Criteria API, você geralmente usa o método `createAlias`. Este método cria um "alias" (um nome alternativo) para a associação, que pode ser usado para acessar propriedades da entidade associada.

### Exemplo Prático

Vamos considerar um exemplo onde temos duas entidades: `Pedido` e `Cliente`. Um `Pedido` está associado a um `Cliente`.

```java
public class Pedido {
    private Cliente cliente;
    // outros campos
}

public class Cliente {
    private String nome;
    // outros campos
}
```

Suponha que queremos selecionar todos os pedidos de um cliente específico. Usaríamos a Criteria API da seguinte maneira:

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(Pedido.class);
crit.createAlias("cliente", "c"); // criando um alias para a associação
crit.add(Restrictions.eq("c.nome", "Nome do Cliente"));
List resultados = crit.list();
```

Neste exemplo, `createAlias("cliente", "c")` cria um alias `c` para a associação `cliente` na entidade `Pedido`. Então, usamos `Restrictions.eq("c.nome", "Nome do Cliente")` para adicionar uma condição onde o nome do cliente deve corresponder a um valor específico.

### Considerações Adicionais

- **Performance:** Ao criar associações, é importante considerar o impacto na performance. Associações podem resultar em junções SQL que, se não utilizadas corretamente, podem diminuir a performance da consulta.
- **Fetch Strategy:** A Criteria API permite especificar estratégias de fetch (eager ou lazy) que determinam como as associações são carregadas.
