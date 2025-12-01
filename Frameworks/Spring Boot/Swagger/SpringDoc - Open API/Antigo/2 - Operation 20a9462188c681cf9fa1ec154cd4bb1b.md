# 2 - Operation

## O que é e para que serve?

A estrutura “Operation” nas especificações Swagger e OpenAPI é um componente central na definição de interfaces de programação de aplicações (APIs). Representa uma operação única em uma URL específica. Em termos práticos, define um endpoint (como GET, POST, DELETE, etc.) e a forma como este endpoint opera, incluindo parâmetros de entrada, o tipo de resposta esperada e outros metadados relacionados à operação.

O principal objetivo da estrutura “Operation” é fornecer uma documentação precisa e interativa da API, que pode ser facilmente compreendida e utilizada por desenvolvedores. Facilita a integração entre sistemas e permite que ferramentas gerem código cliente ou servidor automaticamente.

## Quando utilizar?

A estrutura “Operation” deve ser utilizada sempre que se deseja documentar endpoints de uma API. Isso é especialmente útil em ambientes de desenvolvimento colaborativo, onde múltiplas partes interagem com a mesma API. A documentação gerada a partir das especificações OpenAPI ajuda a garantir que todos os consumidores da API tenham uma compreensão clara de como interagir com ela.

## Definição completa da estrutura paths por meio de uma classe de configuração do tipo OpenAPI

Em Java, podemos utilizar bibliotecas como o Springdoc-OpenAPI, que integra o Spring Boot com o OpenAPI 3. A seguir, um exemplo de como configurar a estrutura `paths` utilizando uma classe de configuração:

```java
import io.swagger.v3.oas.models.OpenAPI;import io.swagger.v3.oas.models.info.Info;import io.swagger.v3.oas.models.paths.PathItem;import io.swagger.v3.oas.models.paths.Paths;public class OpenAPIConfig {    public OpenAPI customOpenAPI() {        return new OpenAPI()            .info(new Info().title("Exemplo API").version("1.0").description("API de demonstração"))            .paths(new Paths().addPathItem("/usuarios", new PathItem()                .get(new Operation()                    .summary("Obter usuários")                    .description("Retorna uma lista de usuários")                    .addTagsItem("Usuários")                    .responses(new ApiResponses().addApiResponse("200", new ApiResponse().description("Lista de usuários"))))));    }}
```

Neste exemplo, `GroupedOpenApi` é utilizado para definir um grupo de endpoints que aparecerão sob o caminho `/public/**` na documentação da API. Este é um método poderoso para organizar e controlar a visibilidade dos endpoints da API.

## Definição completa da estrutura paths por meio de anotação própria

Uma abordagem alternativa é o uso de anotações diretamente nos métodos controladores para definir operações específicas. Utilizando o Spring Boot com anotações do Swagger/OpenAPI, você pode definir a operação e seus detalhes conforme o exemplo abaixo:

```java
import org.springframework.web.bind.annotation.GetMapping;import org.springframework.web.bind.annotation.RestController;import io.swagger.v3.oas.annotations.Operation;import io.swagger.v3.oas.annotations.parameters.RequestBody;@RestControllerpublic class ExampleController {    @GetMapping("/users")    @Operation(summary = "Retrieve all users", description = "Returns a list of all users in the system")    public List<User> getAllUsers() {        return userService.getAllUsers();    }    @PostMapping("/users")    @Operation(summary = "Create a new user", description = "Creates a new user in the system")    public User createUser(@RequestBody User user) {        return userService.createUser(user);    }}
```

As anotações `@Operation`, `@GetMapping` e `@PostMapping` são usadas para descrever o propósito do endpoint, os métodos HTTP suportados, e outros detalhes operacionais relevantes.

## Informações Adicionais

É importante destacar que a utilização eficiente da documentação de API via Swagger/OpenAPI facilita a manutenção e escalabilidade das aplicações, permitindo que as equipes de desenvolvimento e outras partes interessadas compreendam rapidamente como trabalhar com os serviços expostos.

Além disso, muitas ferramentas compatíveis com OpenAPI podem gerar automaticamente clientes de API em várias linguagens de programação, o que pode economizar um tempo significativo de desenvolvimento e reduzir erros de integração.

## Conclusão

A estrutura “Operation” é essencial para documentar e interagir com APIs RESTful de maneira eficaz. Combinando classes de configuração e anotações específicas em Java, desenvolvedores podem oferecer uma documentação clara e automatizada, beneficiando todos os usuários da API.