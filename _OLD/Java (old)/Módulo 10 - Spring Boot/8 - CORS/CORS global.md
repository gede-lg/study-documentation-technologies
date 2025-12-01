# CORS no Spring Boot

## O que é CORS e para que serve?

CORS (Cross-Origin Resource Sharing) é um mecanismo de segurança implementado pelos navegadores para restringir o acesso a recursos em um servidor web de um domínio diferente do domínio da página da web que fez a solicitação. Sem o CORS, os navegadores permitem que scripts carregados em uma página de um domínio acessem recursos de um domínio diferente, o que pode levar a vulnerabilidades de segurança, como ataques de Cross-Site Scripting (XSS).

Em um contexto de desenvolvimento com Spring Boot, configurar o CORS é essencial quando você tem uma aplicação front-end (como uma aplicação React ou Angular) hospedada em um domínio ou porta diferente do seu back-end Spring Boot. Isso permite que o front-end interaja com o back-end sem problemas de segurança.

Claro, vamos detalhar a configuração do CORS (Cross-Origin Resource Sharing) no Spring Boot 3, com foco especial na interface `WebMvcConfigurer` e como ela pode ser utilizada para personalizar o tratamento de CORS em suas aplicações.

## Configurando CORS no Spring Boot 3

No Spring Boot 3, a configuração de CORS pode ser feita globalmente ou em nível de controlador. Para configurar globalmente, você pode implementar a interface `WebMvcConfigurer` e sobrescrever o método `addCorsMappings`.

### Interface `WebMvcConfigurer`

A interface `WebMvcConfigurer` oferece vários métodos que podem ser sobrescritos para personalizar a configuração MVC do Spring. Para fins de configuração de CORS, estamos interessados principalmente no método `addCorsMappings`.

#### Método `addCorsMappings(CorsRegistry registry)`

Este método permite a configuração de políticas de CORS globalmente. O parâmetro `CorsRegistry` oferece métodos para definir tais políticas.

#### Configurando o CORS com o CorsRegistry

A configuração do CORS no Spring Boot 3 é geralmente feita sobrescrevendo o método `addCorsMappings` de um `WebMvcConfigurer`. Isso permite configurar o CORS globalmente para toda a aplicação ou especificamente para determinados caminhos.

##### a. Método `addCorsMappings(CorsRegistry registry)`

**Finalidade**: Configura as políticas CORS para toda a aplicação ou para caminhos específicos.

**Sintaxe de Uso**:
- **Configuração Global**: Aplica as regras de CORS para todos os caminhos da aplicação.
- **Configuração Específica**: Aplica as regras de CORS apenas para caminhos especificados.

**Exemplo de Uso**:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MyConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Configuração Global
        registry.addMapping("/**")
                .allowedOrigins("http://example.com")
                .allowedMethods("GET", "POST");

        // Configuração Específica
        registry.addMapping("/api/specific")
                .allowedOrigins("http://specific.example.com")
                .allowedMethods("GET", "POST", "PUT")
                .allowedHeaders("Header1", "Header2")
                .exposedHeaders("Header3")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

##### Métodos Disponíveis no `CorsRegistry`

- **`addMapping(String pattern)`**: Define um padrão de URL para o qual as configurações CORS serão aplicadas (addMapping pode ser chamado mais de uma vez, permitindo definir configuração CORS sobre varios endpoints).
- **`allowedOrigins(String... origins)`**: Especifica quais domínios podem acessar seus recursos. Por exemplo, permitir acessos de "http://example.com" mas não de outros domínios.
- **`allowedMethods(String... methods)`**: Determina quais métodos HTTP (GET, POST, PUT, DELETE, etc.) podem ser usados ao acessar seus recursos a partir dos domínios permitidos.
- **`allowedHeaders(String... headers)`**: Define quais cabeçalhos HTTP podem ser incluídos nas solicitações CORS.
- **`exposedHeaders(String... headers)`**: Indica quais cabeçalhos podem ser expostos ao navegador do cliente após uma solicitação.
- **`allowCredentials(boolean allowCredentials)`**: Indica se cookies ou cabeçalhos de autenticação específicos podem ser incluídos nas solicitações.
- **`maxAge(long maxAge)`**: Define o tempo máximo (em segundos) que a resposta ao pedido de preflight pode ser cacheada pelo navegador.

##### Funções do `CorsRegistry`

O `CorsRegistry` permite que você especifique diversos aspectos das políticas de CORS, como:

- **Origens Permitidas (`allowedOrigins`)**: 
- **Métodos HTTP Permitidos (`allowedMethods`)**: 
- **Cabeçalhos Permitidos (`allowedHeaders`)**: 
- **Exposição de Cabeçalhos (`exposedHeaders`)**: 
- **Credenciais (`allowCredentials`)**: 

#### Exemplo de Configuração Global de CORS

A seguir, um exemplo de uma classe de configuração que implementa `WebMvcConfigurer` para personalizar as políticas de CORS:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

	// @Value("${cors.originPatterns:default}")
	// private String corsOriginPatterns = "";
	
    @Override
    public void addCorsMappings(CorsRegistry registry) {
    
	    //var allowedOrigins = corsOriginPatterns.split(",");
	    
        
    }
}
```

- `@Configuration`: Indica que a classe é uma fonte de definições de beans para o contexto do aplicativo.
- `WebConfig implements WebMvcConfigurer`: Esta classe está configurando aspectos do Spring MVC. `WebMvcConfigurer` é uma interface usada para personalizar configurações padrão do Spring MVC.
- `@Value("${cors.originPatterns:default}")`: Injeta o valor da propriedade `cors.originPatterns` definida no arquivo `application.yml`. Se não estiver definida, usa a string `"default"`.
- `private String corsOriginPatterns = "";`: Define uma variável para armazenar os padrões de origem do CORS.
- `addCorsMappings(CorsRegistry registry)`: Método para configurar o mapeamento CORS.
    - `var allowedOrigins = corsOriginPatterns.split(",");`: Divide a string de origens permitidas em um array.
    - `registry.addMapping("/**")`: Aplica a configuração CORS para todos os caminhos na aplicação.
    - `.allowedMethods("*")`: Permite todos os métodos HTTP (`GET`, `POST`, `PUT`, etc.).
    - `.allowedOrigins(allowedOrigins)`: Define as origens permitidas.
    - `.allowCredentials(true)`: Permite o envio de credenciais (como cookies e headers de autenticação HTTP).

No arquivo `application.yml`, a propriedade `cors.originPatterns` é definida para especificar quais origens são permitidas:

```yaml
cors:
  originPatterns: http://localhost:3000,http://localhost:8080,https://erudio.com.br
```

- `cors.originPatterns`: Lista as origens permitidas separadas por vírgulas. Neste exemplo, são permitidas origens de três diferentes URLs.

É importante ressaltar que a configuração do CORS deve ser feita com cuidado, considerando a segurança da aplicação. Permitir origens amplas ou métodos indistintamente pode abrir brechas de segurança.

## Observações Importantes

- **Política Fina Versus Global**: Embora a configuração global seja conveniente, você pode precisar de políticas específicas para diferentes controladores ou endpoints em sua aplicação. Nesses casos, você pode usar anotações `@CrossOrigin` em controladores ou métodos de manipulação específicos.

- **Segurança**: Ao configurar políticas de CORS, é crucial ser específico sobre quais origens, cabeçalhos e métodos são permitidos. Configurações demasiado permissivas podem expor sua aplicação a vulnerabilidades de segurança.

- **Testes**: Teste suas políticas de CORS com diferentes origens para garantir que elas funcionam conforme esperado. Ferramentas como o Postman ou cURL podem ser úteis para simular solicitações de origens diferentes.

## Conclusão

Configurar corretamente o CORS é essencial para a segurança e a funcionalidade de aplicações web modernas. O Spring Boot 3 oferece mecanismos flexíveis, como a interface `WebMvcConfigurer`, para definir políticas de CORS que atendam às necessidades da sua aplicação. Lembre-se de ajustar essas configurações às suas necessidades específicas, mantendo as práticas recomendadas de segurança.