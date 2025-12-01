# Controle de CORS via @CrossOrigin no Controller

---

## 1. Introdução

Cross-Origin Resource Sharing (CORS) é o mecanismo que permite que browsers façam requisições AJAX entre diferentes origens (domínios, portas ou protocolos). Por padrão, a Same-Origin Policy bloqueia requisições de um front-end hospedado em `http://app.exemplo.com` para um back-end em `http://api.exemplo.com`. Em Spring Boot, podemos habilitar CORS de forma localizada, por controller, usando a anotação `@CrossOrigin`.

---

## 2. Sumário

1. Conceitos Fundamentais
2. Sintaxe e Uso Prático de `@CrossOrigin`
3. Cenários de Restrição ou Não Aplicação
4. Componentes Chave Associados
5. Melhores Práticas e Padrões de Uso
6. Exemplo Prático Completo
7. Sugestões para Aprofundamento

---

## 3. Conceitos Fundamentais

- **Same-Origin Policy**: restrição de segurança dos navegadores que bloqueia requisições entre origens diferentes.
- **Preflight Request**: requisição `OPTIONS` automática enviada pelo browser para validar se o servidor aceita a real requisição HTTP (método, cabeçalhos).
- **Cabeçalhos CORS principais**:
    - `Access-Control-Allow-Origin`
    - `Access-Control-Allow-Methods`
    - `Access-Control-Allow-Headers`
    - `Access-Control-Allow-Credentials`
    - `Access-Control-Max-Age`

---

## 4. Sintaxe Detalhada e Uso Prático

```java
@RestController
@CrossOrigin(
    origins = {"https://app.exemplo.com", "https://outro.exemplo.com"}, // origens permitidas
    allowedHeaders = {"Content-Type","Authorization"},               // cabeçalhos permitidos
    exposedHeaders = {"X-Total-Count"},                              // cabeçalhos expostos ao client
    methods = {GET,POST,PUT,DELETE},                                 // métodos HTTP permitidos
    allowCredentials = "true",                                       // habilita envio de cookies
    maxAge = 3600                                                    // cache dos preflight em segundos
)
@RequestMapping("/api/produtos")
public class ProdutoController {

    @GetMapping
    public List<Produto> listar() { … }

    @PostMapping
    public Produto criar(@RequestBody Produto p) { … }
}

```

> Variações de uso
> 
> - **Sem parâmetros**: `@CrossOrigin` (equivale a `origins="*"`, métodos GET/HEAD/POST).
> - **Em método específico**: coloque acima de um `@GetMapping` para escopo apenas naquele endpoint.

---

## 5. Cenários de Restrição ou Não Aplicação

- **Segurança**: abrir `origins="*"` em APIs que manipulam dados sensíveis é arriscado.
- **Performance**: preflights frequentes podem gerar overhead; use `maxAge` para cache.
- **WebSocket e SSE**: `@CrossOrigin` não se aplica a endpoints de WebSocket ou Server-Sent Events.
- **Filtragem Global**: se você usar filtros de segurança (Spring Security), pode ser necessário configurar CORS também ali.

---

## 6. Componentes Chave Associados

- **`@CrossOrigin`** (anotação do Spring MVC): atributos principais:
    - `origins` (String[])
    - `methods` (HttpMethod[])
    - `allowedHeaders`, `exposedHeaders` (String[])
    - `allowCredentials` (boolean)
    - `maxAge` (long)
- **`CorsRegistry`** e **`WebMvcConfigurer`**: para configurações globais no `@Configuration`.
- **`CorsFilter`** e **`CorsConfigurationSource`**: para casos avançados de registro de filter e composição manual.

---

## 7. Melhores Práticas e Padrões de Uso

- **Limitar origens**: sempre especifique as URIs exatas de front-ends em produção.
- **Credenciais**: só use `allowCredentials=true` se realmente precisar enviar cookies ou auth headers sensíveis.
- **Cache**: ajuste `maxAge` para reduzir preflight; valores típicos: 1 h (3600 s) a 24 h (86400 s).
- **Validação extra**: combine CORS com validações de token JWT ou API Keys no backend.
- **Documentação**: registre claramente em seu README quais origens e métodos estão autorizados.

---

## 8. Exemplo Prático Completo

1. **Projeto Maven/Gradle** com dependência:
    
    ```xml
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    ```
    
2. **Controller** (`ProdutoController.java`):
    
    ```java
    @RestController
    @CrossOrigin(origins = "http://localhost:3000") // front React em dev
    @RequestMapping("/api/produtos")
    public class ProdutoController {
      @GetMapping public List<Produto> listar() { … }
      @PostMapping public Produto criar(@RequestBody Produto p) { … }
    }
    
    ```
    
3. **Testando do front-end** (ex. fetch no React):
    
    ```
    fetch("http://localhost:8080/api/produtos", {
      method: "GET",
      credentials: "include"  // só se allowCredentials=true
    })
      .then(r => r.json())
      .then(console.log)
      .catch(console.error);
    
    ```
    
4. **Resposta no navegador** mostra cabeçalhos:
    
    ```
    Access-Control-Allow-Origin: http://localhost:3000
    Access-Control-Allow-Methods: GET,POST
    
    ```
    

---

## 9. Sugestões para Aprofundamento

- **CORS global**: use `WebMvcConfigurer#addCorsMappings()` para abranger múltiplos controllers.
- **Spring Security**: integrar CORS na configuração de segurança (`http.cors()`).
- **RFC 6454 e MDN**: documentação oficial do W3C sobre CORS e políticas de mesma origem.

---

Com isso, você tem tanto a visão geral do “porquê” e “como” do CORS, quanto exemplos práticos de uso de `@CrossOrigin` em controllers Spring Boot. Se precisar de um guia mais focado em Spring Security ou em filtros globais, é só pedir!