No desenvolvimento de APIs com Spring Boot usando Swagger (OpenAPI), é comum documentar os parâmetros de requisição de uma API. Para passar um `@Parameter` que é um `@RequestParam`, você pode usar as anotações do Spring juntamente com as anotações fornecidas pela biblioteca SpringDoc OpenAPI. Vou te mostrar como fazer isso com um exemplo prático.

### Exemplo de Endpoint com `@RequestParam` e `@Parameter`

Suponha que você tenha um endpoint em um controlador Spring que aceita um parâmetro de consulta. Aqui está como você pode documentar este parâmetro usando as anotações `@RequestParam` e `@Parameter`:

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
public class ExampleController {

    @GetMapping("/example")
    @Operation(summary = "Obtém informações baseadas no parâmetro de entrada")
    public String getExample(@RequestParam @Parameter(description = "Descrição do parâmetro de entrada",
                                                      required = true,
                                                      schema = @Schema(type = "string", defaultValue = "default"))
                             String input) {
        return "Input recebido: " + input;
    }
}
```

### Detalhes das Anotações

- **@GetMapping("/example")**: Define o caminho da URL para o método do controlador.
- **@RequestParam**: Indica que o parâmetro `input` deve ser passado como um parâmetro de consulta (query parameter) na URL. Por exemplo, `/example?input=valor`.
- **@Parameter**: Usada para adicionar metadados ao parâmetro para fins de documentação da API. Aqui você pode especificar:
  - `description`: Uma breve descrição do que o parâmetro faz.
  - `required`: Define se o parâmetro é obrigatório.
  - `schema`: Define o schema do parâmetro, incluindo o tipo de dados e o valor padrão.

### Usando Swagger UI

Após configurar seu endpoint com essas anotações, a documentação gerada pelo Swagger UI irá refletir essas configurações. O Swagger UI proporciona uma interface amigável onde os consumidores da sua API podem facilmente entender os requisitos dos parâmetros e até mesmo testar a API diretamente pelo navegador.

### Boas Práticas

- **Descreva claramente cada parâmetro**: Uma boa descrição ajuda os desenvolvedores que consomem sua API a entender rapidamente o propósito e o uso de cada parâmetro.
- **Use tipos e padrões apropriados**: Definir o tipo de dados e valores padrão corretos assegura que a API funcione de maneira previsível e ajuda na validação de entrada de dados.

Implementar suas APIs com essas práticas e anotações não só facilita a manutenção e expansão do seu código, mas também melhora significativamente a experiência dos desenvolvedores que utilizam sua API.