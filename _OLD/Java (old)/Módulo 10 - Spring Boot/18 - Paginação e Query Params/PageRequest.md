A classe `PageRequest` é uma implementação concreta da interface `Pageable` fornecida pelo Spring Data. Ela é utilizada para encapsular informações sobre a paginação e a ordenação de consultas aos bancos de dados. Com `PageRequest`, os desenvolvedores podem facilmente especificar o número da página e o tamanho da página desejados, bem como critérios de ordenação para os dados a serem recuperados.

### Sintaxe de Uso e Exemplos

Para criar uma instância de `PageRequest`, pode-se usar seu método estático `of`. Este método aceita o número da página e o tamanho da página como parâmetros obrigatórios. Opcionalmente, pode-se passar parâmetros adicionais para especificar a ordenação dos dados.

#### Exemplo Básico

```java
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public class ExemploPaginacao {
    public void exemploBasico() {
        int pagina = 0; // número da página (0-indexado)
        int tamanho = 10; // tamanho da página
        
        Pageable pageable = PageRequest.of(pagina, tamanho);
        
        // Use o objeto pageable em seu repositório para realizar consultas paginadas
    }
}
```

#### Exemplo com Ordenação

Para adicionar ordenação, você pode usar o método `of` que aceita um terceiro parâmetro do tipo `Sort`.

```java
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class ExemploPaginacaoOrdenacao {
    public void exemploComOrdenacao() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("nome"));
        
        // Para ordenação descendente
        Pageable pageableDesc = PageRequest.of(0, 10, Sort.by("nome").descending());
        
        // Use o objeto pageable em seu repositório para realizar consultas paginadas com ordenação
    }
}
```

### Principais Métodos

Alguns dos métodos mais relevantes fornecidos pela interface `Pageable` e implementados pela classe `PageRequest` incluem:

- `getPageNumber()`: Retorna o número da página atual.
- `getPageSize()`: Retorna o tamanho da página.
- `getOffset()`: Retorna o deslocamento a ser tomado de acordo com a página atual e o tamanho da página.
- `getSort()`: Retorna a ordenação a ser aplicada.

## Considerações Finais

A classe `PageRequest` do Spring Boot facilita significativamente a implementação de paginação e ordenação em aplicações Java, tornando o código mais limpo, mais manutenível e eficiente. Utilizando esta classe junto com as abstrações do Spring Data, os desenvolvedores podem implementar recursos de paginação avançados com esforço mínimo e garantir que as aplicações permaneçam responsivas e escaláveis, mesmo ao lidar com grandes volumes de dados.

Incorporar a paginação em sua aplicação não apenas melhora a experiência do usuário mas também otimiza o uso de recursos, reduzindo o tempo de carregamento das páginas e a carga sobre o banco de dados. Portanto, a compreensão profunda da paginação e de suas implementações no Spring Boot é essencial para o desenvolvimento de aplicações web modernas e eficientes.