# Criteria API: Ordenação (Order by)

## Conceito de Ordenação em Criteria API

A ordenação em consultas de banco de dados é fundamental para apresentar dados de uma maneira organizada, facilitando a análise e a visualização. No contexto da Criteria API do Hibernate, que é uma abordagem para a construção de consultas de banco de dados de forma programática, a ordenação é realizada por meio da especificação de critérios de `Order`.

### Utilização do `Order`

A classe `Order` em Criteria API é usada para definir como os resultados de uma consulta devem ser ordenados. Isso é feito especificando sobre qual coluna ou atributo a ordenação deve ser aplicada e se a ordenação deve ser ascendente (`asc`) ou descendente (`desc`).

## Exemplo de Ordenação com Criteria API

Vamos ver um exemplo de como usar a ordenação em uma consulta utilizando a Criteria API. Suponha que temos uma entidade `Produto` e queremos buscar todos os produtos ordenados pelo preço de forma ascendente.

```java
import org.hibernate.Session;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import java.util.List;

public class ProdutoDAO {
    public List<Produto> buscarProdutosOrdenadosPorPreco() {
        Session session = ...; // obtenção da sessão do Hibernate
        Criteria crit = session.createCriteria(Produto.class);
        crit.addOrder(Order.asc("preco"));
        return crit.list();
    }
}
```

Neste exemplo, `Order.asc("preco")` cria um critério de ordenação ascendente baseado no atributo `preco` da entidade `Produto`. O método `addOrder` da instância `Criteria` é então usado para aplicar este critério de ordenação à consulta.

## Detalhes Importantes

- **Ordenação Múltipla:** É possível adicionar múltiplos critérios de ordenação à mesma consulta. Por exemplo, você pode querer ordenar os produtos primeiro por categoria e, dentro de cada categoria, por preço.
  
  ```java
  crit.addOrder(Order.asc("categoria"));
  crit.addOrder(Order.asc("preco"));
  ```

- **Ordenação Descendente:** Para ordenar de forma descendente, use `Order.desc` em vez de `Order.asc`.

- **Performance:** Tenha em mente que a ordenação, especialmente em grandes conjuntos de dados, pode impactar a performance da consulta. É importante garantir que os campos usados na ordenação estejam devidamente indexados no banco de dados.

## Conclusão

A ordenação é um aspecto crucial na recuperação de dados de um banco de dados, e a Criteria API oferece uma maneira flexível e poderosa de aplicar critérios de ordenação às suas consultas. Ao usar a classe `Order` e seus métodos `asc` e `desc`, você pode facilmente definir como os resultados devem ser ordenados, melhorando a usabilidade e a apresentação dos dados recuperados.