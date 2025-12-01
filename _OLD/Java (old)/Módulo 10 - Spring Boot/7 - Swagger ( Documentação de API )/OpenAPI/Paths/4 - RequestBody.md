A anotação do spring ao ser usada no parametro da requisição já é usada como requestBody no swagger.

## O que é e para que serve?

O `RequestBody` é usado em APIs REST para definir o corpo de uma solicitação HTTP. É especialmente relevante para métodos como `POST`, `PUT` e `PATCH`, onde o corpo da solicitação é necessário para transmitir dados ao servidor. Em termos do Swagger/OpenAPI, o `RequestBody` descreve o conteúdo esperado (como JSON, XML, etc.), o tipo de mídia e se é obrigatório ou opcional.

## Quando Utilizar?

Utiliza-se `RequestBody` sempre que a interação com a API exige o envio de um payload (corpo da mensagem) para o servidor. Por exemplo, ao criar um novo recurso com `POST` ou atualizar um recurso existente com `PUT`, os detalhes do recurso são fornecidos no corpo da solicitação.

## Definição Completa da Estrutura RequestBody por meio de uma Classe de Configuração do Tipo OpenAPI

Para definir um `RequestBody` usando a configuração de uma classe OpenAPI em Java, você geralmente trabalha com a biblioteca `swagger-core`. Aqui está um exemplo de como configurar o `RequestBody` usando a classe OpenAPI:

```java
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.RequestBody;

public class OpenApiConfig {
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info().title("API de Exemplo").version("v1"))
            .path("/users", new PathItem()
                .post(new Operation()
                    .summary("Cria um novo usuário")
                    .requestBody(new RequestBody()
                        .description("RequestBody para criar um novo usuário")
                        .content(new Content()
                            .addMediaType("application/json", new MediaType()
                                .schema(new Schema()
                                    .type("object")
                                    .addProperty("username", new StringSchema())
                                    .addProperty("email", new StringSchema()))))
                        .required(true)));
    }
}
```

Este exemplo configura uma API com um único endpoint que aceita uma solicitação POST para criar um novo usuário. O `RequestBody` é configurado para aceitar um objeto JSON com propriedades "username" e "email".

## Definição Completa da Estrutura RequestBody por meio de Anotação Própria do Swagger

Com as anotações do Swagger, a definição do `RequestBody` é integrada diretamente no código do controlador API. Aqui está um exemplo usando Spring Boot com anotações do Swagger:

```java
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
public class UserController {

    @PostMapping("/users")
    @Operation(summary = "Cria um novo usuário")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        description = "JSON representando um novo usuário",
        required = true,
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = User.class)
        )
    )
    public User createUser(@RequestBody User user) {
        // lógica para criar um usuário
        return user;
    }
}
```

Neste exemplo, a anotação `@RequestBody` do Swagger é usada para descrever o corpo da solicitação esperado para o método `createUser`. A anotação `@Schema` é utilizada para especificar que o corpo da solicitação deve ser um objeto JSON que corresponde à classe `User`.

## Considerações Adicionais

- **Validação**: Swagger/OpenAPI permite detalhar ainda mais as propriedades, incluindo validações como tamanho mínimo e máximo, padrões e enumerações.
- **Exemplos**: Incluir exemplos no Swagger ajuda os consumidores da API a entenderem melhor como usar os endpoints.
- **Documentação Automática**: Utilizar Swagger com Spring Boot permite gerar uma documentação interativa da API, facilitando testes

 e integrações.

A estrutura `RequestBody` no Swagger/OpenAPI é uma ferramenta poderosa para descrever com precisão como os dados devem ser enviados para sua API, assegurando uma implementação e consumo claros e eficazes.