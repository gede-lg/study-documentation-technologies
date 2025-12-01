# 5 - Parameters

## Definição completa da estrutura Parameter por meio de anotação própria do Swagger

O uso de anotações do Swagger simplifica a integração da documentação API diretamente no código fonte. Aqui está como você pode utilizar a anotação `@Parameter` no contexto de um serviço RESTful usando Spring:

```java
import org.springframework.web.bind.annotation.GetMapping;import org.springframework.web.bind.annotation.PathVariable;import org.springframework.web.bind.annotation.RestController;import io.swagger.v3.oas.annotations.Operation;import io.swagger.v3.oas.annotations.Parameter;@RestControllerpublic class UserController {    @GetMapping("/users/{userId}")    @Operation(summary = "Obter usuário pelo ID", description = "Retorna dados do usuário baseado no ID fornecido")    public User getUserById(        @Parameter(description = "ID do usuário", required = true)        @PathVariable String userId) {        // Lógica para retornar o usuário        return new User();    }}
```