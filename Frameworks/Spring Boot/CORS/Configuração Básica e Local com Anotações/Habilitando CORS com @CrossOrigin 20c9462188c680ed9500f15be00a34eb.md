# Habilitando CORS com @CrossOrigin

---

## 1. Introdução

O **Cross-Origin Resource Sharing (CORS)** é um mecanismo de segurança dos navegadores que impede que páginas web façam requisições AJAX para domínios diferentes do seu de origem, a menos que o servidor destino autorize explicitamente esse compartilhamento. No ecossistema **Spring Boot**, a anotação `@CrossOrigin` oferece a forma mais rápida de habilitar CORS em endpoints REST, definindo quem pode acessar seus recursos e sob quais condições.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#3-conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#4-sintaxe-detalhada-e-uso-pr%C3%A1tico)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#5-cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes-Chave Associados](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#6-componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#7-melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#8-exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#9-sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **Same-Origin Policy**: Browsers só permitem que scripts façam requisições para o mesmo esquema (http/https), host e porta da página que os originou.
- **CORS**: Define um conjunto de cabeçalhos HTTP que permitem ao servidor declarar quais origens (`Origin`), métodos (`GET`, `POST`, etc.) e cabeçalhos customizados (`X-Custom-Header`) são aceitos.
- **Requisições “Simples” vs “Preflight”**:
    - *Simples*: usam métodos `GET`, `POST` ou `HEAD` e cabeçalhos comuns; o browser envia diretamente.
    - *Preflight*: para métodos diferentes ou cabeçalhos customizados, o browser primeiro faz um `OPTIONS` para verificar se a requisição real é permitida.

---

## 4. Sintaxe Detalhada e Uso Prático

A anotação `@CrossOrigin` pode ser aplicada em nível de método ou de classe:

```java
@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(   // Permite CORS para todos os métodos deste controller
    origins = "https://app.exemplo.com",   // ou {"https://app.exemplo.com","https://admin.exemplo.com"}
    methods = { RequestMethod.GET, RequestMethod.POST },
    allowedHeaders = {"Content-Type", "Authorization"},
    exposedHeaders = {"X-Total-Count"},
    allowCredentials = "true",
    maxAge = 3600       // cache do preflight em segundos
)
public class ProdutoController {

    @GetMapping
    public List<Produto> listar() { ... }

    @PostMapping
    public Produto criar(@RequestBody Produto p) { ... }
}

```

- **`origins`**: lista de domínios autorizados (use `"*"` para qualquer origem, mas evite com `allowCredentials=true`).
- **`methods`**: métodos HTTP permitidos.
- **`allowedHeaders`**: cabeçalhos que o cliente pode enviar.
- **`exposedHeaders`**: cabeçalhos que o navegador pode acessar na resposta.
- **`allowCredentials`**: se `true`, habilita envio de cookies/autenticação.
- **`maxAge`**: duração (em segundos) que o resultado do preflight fica em cache.

> Variações de Sintaxe
> 
> - Em nível de método: basta anotar apenas o handler.
> - Em `@Configuration`: implementar `WebMvcConfigurer` e registrar globalmente via `registry.addMapping("/**")...`.

---

## 5. Cenários de Restrição ou Não Aplicação

- **Spring Security ativo** sem configuração adicional: pode bloquear CORS mesmo com `@CrossOrigin`. É preciso integrar com `HttpSecurity.cors()`.
- **Regras dinâmicas** de origem (ex.: consulta em BD): `@CrossOrigin` estático não basta; use um `CorsFilter` customizado ou um `CorsConfigurationSource`.
- **Performance**: se cada requisição dispara lógica de preflight, pode pesar; use `maxAge` alto e configure globalmente.
- **Ambientes sem Spring MVC** (ex.: WebFlux): a anotação não se aplica; há anotações e configurações próprias.

---

## 6. Componentes-Chave Associados

| Componente / Anotação | Uso Principal |
| --- | --- |
| `@CrossOrigin` | Declarações rápidas de CORS em controllers ou métodos |
| `CorsConfiguration` | Classe que modela todas as opções (origins, methods, headers) |
| `CorsRegistry` | Registrador via `WebMvcConfigurer` para config global |
| `CorsFilter` | Filtro que avalia e insere cabeçalhos CORS manualmente |
| `WebMvcConfigurer#addCorsMappings` | Método para registrar rotas e suas configurações de CORS |

---

## 7. Melhores Práticas e Padrões de Uso

1. **Especificar Origem** em vez de usar `"*"`, reduzindo superfície de ataque.
2. Se usar **cookies/sessões**, **nunca** combine `allowedOrigins="*"` com `allowCredentials=true`.
3. **Centralizar** configuração (via `WebMvcConfigurer`) para consistência em toda a API.
4. **Cachear** respostas de preflight com `maxAge` alto (ex.: 1 h ou mais).
5. **Documentar** em equipe quais domínios front-end consomem cada serviço.
6. Em produção, **monitore** falhas de preflight (logs) para detectar aplicações mal configuradas.

---

## 8. Exemplo Prático Completo

**a) Global via `WebMvcConfigurer`**

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://app.exemplo.com")
            .allowedMethods("GET","POST","PUT","DELETE")
            .allowedHeaders("*")
            .exposedHeaders("X-Total-Count")
            .allowCredentials(true)
            .maxAge(1800);
    }
}

```

**b) Controller com `@CrossOrigin`**

```java
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @CrossOrigin(origins="https://admin.exemplo.com")
    @GetMapping
    public List<Cliente> listar() { ... }

    @CrossOrigin(origins="https://admin.exemplo.com")
    @PostMapping
    public Cliente criar(@RequestBody Cliente c) { ... }
}

```

> Teste rápido (via curl):
> 
> 
> ```bash
> curl -i -X OPTIONS \
>   -H "Origin: https://admin.exemplo.com" \
>   -H "Access-Control-Request-Method: POST" \
>   https://api.seudominio.com/api/clientes
> 
> ```
> 
> Você deverá ver cabeçalhos como `Access-Control-Allow-Origin` e `Access-Control-Allow-Methods`.
> 

---

## 9. Sugestões para Aprofundamento

- [Spring Framework Reference – CORS](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors)
- MDN Web Docs: [CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS)
- Artigos em blogs especializados (Baeldung, Spring.io blog) sobre “CORS with Spring Security”

---

*Com esta visão completa, você poderá habilitar e gerenciar CORS de forma segura e eficiente em suas aplicações Spring Boot.*