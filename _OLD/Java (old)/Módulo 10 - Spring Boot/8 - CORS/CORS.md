# CORS no Spring Boot

O CORS (Cross-Origin Resource Sharing) é um mecanismo importante no desenvolvimento de aplicações web, especialmente em contextos onde uma aplicação frontend precisa acessar recursos de um backend hospedado em um domínio diferente. Vamos explorar em detalhes o CORS no contexto do Spring Boot.

## O Que É CORS e Para Que Serve?

CORS é um protocolo que permite que recursos restritos em uma página web sejam recuperados por outro domínio fora do domínio ao qual pertence o recurso. Sem o CORS, as políticas de mesma origem (same-origin policy) dos navegadores restringiriam o acesso a recursos que estão em diferentes domínios.

### Exemplo Prático:
Suponha que você tenha um frontend hospedado em `https://meufrontend.com` que precisa fazer solicitações para uma API no backend hospedado em `https://meubackend.com`. O CORS permite que você configure seu backend para aceitar solicitações do frontend, mesmo estando em domínios diferentes.

## Principais Anotações

No Spring Boot, CORS pode ser configurado através de anotações:

### 1. `@CrossOrigin`
Esta anotação é usada para habilitar o CORS em métodos de manipulação específicos ou em todo o controlador.

**Exemplo de Uso em Método:**
```java
@CrossOrigin(origins = "http://localhost:9000")
@GetMapping("/greeting")
public Greeting greeting() {
    // ...
}
```
Aqui, o `@CrossOrigin` é aplicado ao método `greeting`, permitindo requisições CORS do origin "http://localhost:9000".

**Exemplo de Uso em Controlador:**
```java
@CrossOrigin(origins = "http://example.com", maxAge = 3600)
@RestController
@RequestMapping("/account")
public class AccountController {
    // ...
}
```
Neste caso, o `@CrossOrigin` é aplicado ao nível do controlador, afetando todos os métodos dentro de `AccountController`.

### Propriedades da Anotação `@CrossOrigin`:
- `origins`: Especifica os URIs que podem acessar o recurso.
- `methods`: Os métodos HTTP permitidos.
- `allowedHeaders`: Os cabeçalhos que podem ser usados na requisição.
- `exposedHeaders`: Cabeçalhos que devem ser expostos na resposta.
- `allowCredentials`: Indica se as credenciais podem ser incluídas na requisição.
- `maxAge`: Tempo máximo, em segundos, que a resposta à pré-requisição CORS pode ser armazenada em cache.

## Principais 10 Classes para CORS no Spring Boot

1. **WebMvcConfigurer**: Interface usada para configuração global do CORS.
2. **CorsRegistry**: Usado em `WebMvcConfigurer` para definir mapeamentos de CORS.
3. **CorsConfiguration**: Representa a configuração de CORS (origens, métodos, cabeçalhos, etc.).
4. **CorsConfigurationSource**: Interface que define uma fonte de configurações de CORS.
5. **UrlBasedCorsConfigurationSource**: Implementação de `CorsConfigurationSource` que armazena as configurações baseadas em URL.
6. **CorsFilter**: Filtro que processa requisições CORS baseadas nas configurações de `CorsConfigurationSource`.
7. **CorsProcessor**: Interface para processar requisições com base em uma dada configuração de CORS.
8. **DefaultCorsProcessor**: Implementação padrão de `CorsProcessor`.
9. **AbstractHandlerMapping**: Classe base para manipuladores que definem mapeamentos de CORS.
10. **RequestMappingHandlerMapping**: Manipulador específico para mapear requisições para métodos anotados com `@RequestMapping`.

### Exemplo de Configuração Global CORS:
```java
@Configuration
public class MyConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:9000")
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```
Neste exemplo, a configuração global do CORS é definida para permitir todos os caminhos (`/**`) com origens, métodos e configurações específicas.

## Conclusão
O CORS é um aspecto fundamental para o desenvolvimento de aplicações web modernas, especialmente quando se trata de separar o frontend do backend. O Spring Boot oferece um suporte robusto e flexível para configurar o CORS, seja a nível de método, controlador ou globalmente, facilitando o controle de como os recursos são compart