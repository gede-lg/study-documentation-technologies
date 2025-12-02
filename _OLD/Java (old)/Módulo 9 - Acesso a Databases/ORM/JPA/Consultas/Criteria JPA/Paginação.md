# Criteria API do JPA: Paginação

## O que é Paginação e para que Serve?

**Paginação** refere-se ao processo de dividir um grande conjunto de resultados de uma consulta em páginas menores e mais gerenciáveis. Esta técnica é essencial em aplicações que lidam com grandes volumes de dados, como sistemas de gerenciamento de banco de dados, websites, e aplicativos. O principal objetivo da paginação é melhorar a performance e a usabilidade, pois carregar e exibir uma quantidade enorme de dados de uma só vez pode ser ineficiente e causar uma experiência de usuário ruim.

No contexto de um banco de dados, a paginação é usada para limitar o número de registros retornados por uma consulta, permitindo ao usuário ou aplicação processar um número menor de registros por vez. Isso é particularmente útil em interfaces de usuário onde os dados precisam ser apresentados em formatos de lista ou tabela.

## Paginação na Criteria API do JPA

A Criteria API do JPA permite implementar a paginação de maneira eficiente. Várias classes e métodos são usados para este propósito:

### Classes e Componentes Chave:

1. **`CriteriaQuery`**: Representa uma consulta no modelo Criteria. É usada para especificar os critérios de seleção, ordenação e agrupamento.
   
2. **`EntityManager`**: Fornece métodos para criar e executar consultas. É utilizado para obter um `TypedQuery` a partir de um `CriteriaQuery`, o qual é usado para definir os limites da paginação.

3. **`TypedQuery`**: É uma extensão do `Query` que permite a execução de consultas tipadas. Os métodos `setFirstResult` e `setMaxResults` são utilizados para definir a paginação.

### Implementando Paginação:

A implementação da paginação com a Criteria API envolve basicamente dois métodos:

- `setFirstResult(int startPosition)`: Define a posição do primeiro resultado na sequência de resultados da consulta. É útil para pular os resultados anteriores até o ponto desejado (geralmente, `(número da página - 1) * tamanho da página`).

- `setMaxResults(int maxResult)`: Limita o número máximo de resultados retornados pela consulta. Este é o tamanho da página.



### Exemplo de Paginação Básica

Suponha que temos uma entidade `Produto` e queremos buscar seus registros com paginação.

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<Produto> cq = cb.createQuery(Produto.class);
Root<Produto> produto = cq.from(Produto.class);
cq.select(produto);

TypedQuery<Produto> query = entityManager.createQuery(cq);
query.setFirstResult(0); // Início da paginação
query.setMaxResults(10); // Quantidade de elementos por página

List<Produto> produtos = query.getResultList();
```

Neste exemplo, são retornados os primeiros 10 produtos.

### Exemplo de Paginação Avançada

Para uma paginação mais avançada, você pode combinar filtros e ordenações.

```java
int pageNumber = 2;
int pageSize = 10;

CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<Produto> cq = cb.createQuery(Produto.class);
Root<Produto> produto = cq.from(Produto.class);
cq.where(cb.like(produto.get("nome"), "%cafe%"));
cq.orderBy(cb.asc(produto.get("preco")));

TypedQuery<Produto> query = entityManager.createQuery(cq);
query.setFirstResult((pageNumber - 1) * pageSize);
query.setMaxResults(pageSize);

List<Produto> produtosFiltrados = query.getResultList();
```

Neste exemplo, a consulta retorna uma página específica de produtos filtrados por nome e ordenados pelo preço.

### Considerações Adicionais:

- **Performance**: A paginação pode melhorar significativamente a performance, especialmente ao trabalhar com grandes conjuntos de dados.

- **User Experience**: Em aplicações web e móveis, a paginação ajuda a melhorar a experiência do usuário, tornando o carregamento de dados mais rápido e a interface mais responsiva.

- **Ordenação**: Ao paginar resultados, é importante considerar a ordenação dos dados para manter a consistência ao navegar entre as páginas.

- **Contagem Total de Resultados**: Em algumas situações, pode ser necessário conhecer o total de resultados para exibir informações de paginação (como o número total de páginas). Isso geralmente é feito executando uma consulta separada para contar o total de registros.

A paginação é uma parte fundamental do design de aplicações modernas, e a Criteria API do JPA oferece uma abordagem flexível e poderosa para implementá-la eficientemente.