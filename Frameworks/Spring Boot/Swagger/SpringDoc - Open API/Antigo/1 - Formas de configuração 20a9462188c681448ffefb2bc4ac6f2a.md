# 1 - Formas de configuração

Na configuração da documentação da API usando Swagger com Spring Boot, você tem principalmente duas formas de definir a estrutura do api-docs: através de anotações diretamente nos controladores e métodos, e por meio de uma classe de configuração. Ambas as abordagens podem ser usadas em conjunto para alcançar uma documentação detalhada e precisa. Vou detalhar cada uma delas:

[OpenAPI Specification v3.1.0 | Introduction, Definitions, & More](https://spec.openapis.org/oas/v3.1.0#specification-extensions)

[Info (swagger-annotations 1.5.0 API)](https://docs.swagger.io/swagger-core/v1.5.0/apidocs/)

### 1. Anotações nos Controladores e Métodos

Usar anotações diretamente nos controladores e métodos é uma forma comum e prática de adicionar metadados específicos da API que ajudam a descrever os endpoints, parâmetros, respostas esperadas, e outros aspectos da API. Algumas das anotações mais comuns do SpringDoc OpenAPI incluem:

- `@Tag`: Define tags para operações, permitindo agrupar endpoints similares sob uma mesma tag.
- `@Operation`: Descreve uma operação ou método HTTP específico, permitindo adicionar descrição, resumo, tags, entre outros.
- `@ApiResponse`: Define as possíveis respostas de uma operação, incluindo a descrição e o conteúdo da resposta.
- `@Parameter`: Descreve um parâmetro de operação, podendo incluir descrição, exemplo, schema, entre outros.
- `@RequestBody`: Descreve o corpo da requisição esperado para a operação, incluindo a descrição e o conteúdo necessário.

### Exemplo com Anotações

```java
import org.springdoc.api.annotations.Parameter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestControllerpublic class ExampleController {
    @GetMapping("/example")    
    @Operation(summary = "Get Example", description = "Returns an example data")   
    @ApiResponse(responseCode = "200", description = "Successful retrieval",
      content = @Content(mediaType = "application/json"))
    public String getExample() {
            return "example";    
            }
            }
```

### 2. Classe de Configuração

Uma classe de configuração permite definir configurações globais do Swagger, como informações básicas da API (título, descrição, versão), configurações de segurança, servidores, entre outros. Isso é geralmente realizado através da criação de um bean do tipo `OpenAPI`.

### Exemplo com Classe de Configuração

```java
import io.swagger.v3.oas.models.OpenAPI;import io.swagger.v3.oas.models.info.Info;import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;@Configurationpublic class SwaggerConfiguration {    @Bean    public OpenAPI customOpenAPI() {        return new OpenAPI()            .info(new Info().title("API de Exemplo")                             .version("1.0")                             .description("Documentação da API de Exemplo"));    }}
```

Usando essas duas abordagens, você pode controlar detalhadamente como sua API é documentada com Swagger em um aplicativo Spring Boot. As anotações oferecem granularidade no nível do método, enquanto a classe de configuração oferece uma visão geral e configurações aplicáveis a toda a API.