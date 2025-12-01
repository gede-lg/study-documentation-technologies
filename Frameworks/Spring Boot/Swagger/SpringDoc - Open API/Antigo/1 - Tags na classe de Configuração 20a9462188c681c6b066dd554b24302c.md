# 1 - Tags na classe de Configuração

### Estrutura Tags no Swagger e OpenAPI em Java

A documentação de APIs com Swagger/OpenAPI é uma prática padrão para descrever as interfaces de programação de aplicações de forma compreensível tanto para computadores quanto para humanos. As `tags` são uma parte fundamental dessa estrutura, pois ajudam a organizar e categorizar os endpoints em grupos lógicos.

### O que é e para que serve?

No contexto do Swagger e OpenAPI, uma `tag` é utilizada para agrupar operações relacionadas. Por exemplo, todas as operações que pertencem a um recurso específico, como usuários ou pedidos, podem ser agrupadas sob uma mesma `tag`. Isso não só melhora a organização da documentação, tornando-a mais navegável, mas também facilita a compreensão do escopo da API por desenvolvedores que a utilizam ou testam.

### Quando utilizar?

Você deve utilizar `tags` sempre que quiser organizar as operações da sua API em grupos que representem funcionalidades ou serviços específicos. Isso é especialmente útil em APIs maiores, onde a quantidade de endpoints pode tornar a documentação complexa e difícil de seguir.

### Definição completa da estrutura Tags por meio de uma classe de configuração do tipo OpenAPI do Swagger

Você pode configurar as `tags` diretamente através de uma classe de configuração em Java, usando a biblioteca Swagger/OpenAPI. Abaixo está um exemplo de como configurar tags globalmente usando a classe `OpenAPI`:

```java
import io.swagger.v3.oas.models.OpenAPI;import io.swagger.v3.oas.models.info.Info;import io.swagger.v3.oas.models.tags.Tag;import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;@Configurationpublic class OpenApiConfig {    @Bean    public OpenAPI customOpenAPI() {        return new OpenAPI()            .info(new Info().title("Exemplo de API").version("1.0").description("Uma descrição detalhada da API."))            .addTagsItem(new Tag().name("Usuário").description("Operações relacionadas a Usuários"))            .addTagsItem(new Tag().name("Pedido").description("Operações relacionadas a Pedidos"));    }}
```

Este código configura uma documentação de API com duas tags: “Usuário” e “Pedido”. Cada tag possui um nome e uma descrição que ajudam na organização visual na interface do Swagger UI.