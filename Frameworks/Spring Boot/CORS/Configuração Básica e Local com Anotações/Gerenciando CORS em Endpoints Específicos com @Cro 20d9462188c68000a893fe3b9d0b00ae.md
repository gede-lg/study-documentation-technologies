# Gerenciando CORS em Endpoints Específicos com @CrossOrigin

---

## 1. Introdução

O CORS (Cross-Origin Resource Sharing) é um mecanismo de segurança que controla como recursos de um backend podem ser acessados por páginas web hospedadas em domínios diferentes. No Spring Boot, além de configurações globais, é possível aplicar políticas CORS de forma pontual, em nível de método, usando a anotação `@CrossOrigin`.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#3-conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#4-sintaxe-detalhada-e-uso-pr%C3%A1tico)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#5-cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#6-componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#7-melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#8-exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6845a4cb-0f6c-8013-9303-64b973be8298#9-sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **Same-Origin Policy**: navegadores bloqueiam requisições de origens diferentes por padrão.
- **CORS**: cabeçalhos HTTP (`Access-Control-Allow-*`) que sinalizam ao cliente quais origens, métodos e cabeçalhos são permitidos.
- **Aplicação em Nível de Método**: com `@CrossOrigin` diretamente sobre um método de controlador, você personaliza a política CORS apenas para aquele endpoint, sem afetar outros.

---

## 4. Sintaxe Detalhada e Uso Prático

```java
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    // Exemplo: permitir GET de http://frontend.app apenas para este método
    @CrossOrigin(
        origins      = "http://frontend.app",            // Origem autorizada
        methods      = { RequestMethod.GET },            // Métodos HTTP permitidos
        allowedHeaders = { "Authorization", "Content-Type" }, // Cabeçalhos aceitos
        exposedHeaders = "X-Total-Count",                // Cabeçalhos que o cliente pode ler
        allowCredentials = "true",                       // Permitir cookies
        maxAge        = 3600                             // Cache da pré-flight (em segundos)
    )
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        // ...
    }

    // Sem @CrossOrigin: política padrão (herdada ou global)
    @PostMapping
    public ResponseEntity<Produto> criar(@RequestBody Produto p) {
        // ...
    }
}

```

**Variações de Sintaxe**

- **Múltiplas origens**: `origins = { "https://app1.com", "https://app2.com" }`
- **Wildcard de origem** (não recomendado em produção): `origins = "*"`
- **Sem credenciais**: `allowCredentials = "false"`

---

## 5. Cenários de Restrição ou Não Aplicação

- **Muitos endpoints**: se você precisar ajustar CORS em dezenas de métodos, manter anotações espalhadas torna a manutenção difícil.
- **Integração com Spring Security**: a filter chain de segurança pode interceptar requisições antes de `@CrossOrigin`. Nestes casos, é melhor configurar CORS no `WebSecurityConfigurerAdapter` ou via `CorsFilter`.
- **Recursos estáticos ou outside Spring MVC**: assets servidos por outros filtros ou servidores estáticos podem não respeitar a anotação.

---

## 6. Componentes Chave Associados

| Componente | Descrição |
| --- | --- |
| `@CrossOrigin` | Anotação para permitir CORS em controlador ou método. |
| `origins` | Lista de domínios autorizados. |
| `methods` | Métodos HTTP permitidos (GET, POST, etc.). |
| `allowedHeaders` | Cabeçalhos que o cliente pode enviar. |
| `exposedHeaders` | Cabeçalhos que o navegador pode ler na resposta. |
| `allowCredentials` | Se `true`, permite envio de cookies/credenciais. |
| `maxAge` | Tempo (s) de cache para resposta de pré-flight. |
| `CorsRegistry` | API fluente em `WebMvcConfigurer` para config. global. |
| `CorsConfiguration` | Classe programática para montar políticas CORS detalhadas. |
| `CorsFilter` | Filtro Servlet que aplica regras CORS antes dos controllers. |

---

## 7. Melhores Práticas e Padrões de Uso

- **Restringir origens**: nunca usar  em produção; especifique domínios confiáveis.
- **Limitar métodos e cabeçalhos**: permita apenas o necessário para reduzir superfície de ataque.
- **Cache de pré-flight**: defina `maxAge` maior (ex.: 1h) para reduzir chamadas OPTIONS.
- **Centralizar configuração quando possível**: casos simples podem usar `WebMvcConfigurer` para evitar repetição.
- **Sincronizar com Spring Security**: use `http.cors()` e forneça um `CorsConfigurationSource` se sua aplicação tiver camada de segurança.

---

## 8. Exemplo Prático Completo

1. **Classe de Configuração Global (opcional)**
    
    ```java
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/public/**")
                    .allowedOrigins("https://app-public.com")
                    .allowedMethods("GET", "POST");
        }
    }
    
    ```
    
2. **Controle Pontual com `@CrossOrigin`**
    
    ```java
    @RestController
    @RequestMapping("/api/financeiro")
    public class FinanceiroController {
    
        // Endpoint privado, sem CORS público
        @PostMapping("/transacao")
        public ResponseEntity<Transacao> criaTransacao(@RequestBody Transacao t) {
            // Lógica interna
        }
    
        // Endpoint público, GET liberado apenas para dashboard externo
        @CrossOrigin(origins = "https://dashboard.empresa.com", methods = GET)
        @GetMapping("/relatorio")
        public ResponseEntity<Relatorio> geraRelatorio() {
            // Geração de relatório
        }
    }
    
    ```
    
3. **Testando**
    - Pelo navegador ou ferramenta (Postman), faça `GET https://seu-backend/api/financeiro/relatorio` de um domínio diferente.
    - Confira nos headers da resposta:
        
        ```
        Access-Control-Allow-Origin: https://dashboard.empresa.com
        Access-Control-Allow-Methods: GET
        
        ```
        

---

## 9. Sugestões para Aprofundamento

- Comparar `@CrossOrigin` com configuração via **`CorsFilter`** e **`WebSecurityConfigurerAdapter`**.
- Estudar o impacto de CORS em performance de aplicações SPA heavy-frontend.
- Explorar políticas CORS dinâmicas usando **`CorsConfigurationSource`** e leitura de **variáveis de ambiente**.
- Ferramentas de teste: **cURL** (`H "Origin: ..."`) e **Extensões de navegador** para simular diferentes origens.

---

*Com esta estrutura, você tem visão clara dos fundamentos, uso pontual via `@CrossOrigin` e melhores práticas para manter sua API Spring Boot segura e flexível.*