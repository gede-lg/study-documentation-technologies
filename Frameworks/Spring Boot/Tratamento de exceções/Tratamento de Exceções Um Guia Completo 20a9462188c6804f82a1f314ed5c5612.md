# Tratamento de Exceções: Um Guia Completo

---

## Introdução

Um tratamento de exceções bem estruturado é fundamental em aplicações Spring Boot para garantir respostas claras, consistentes e seguras sempre que algo inesperado ocorre. Ao adotar uma abordagem centralizada, você:

- **Isola a lógica de captura e resposta** a erros em um único local.
- **Oferece retornos uniformes** de erro (status, formato de mensagem).
- **Evita vazamento de informações sensíveis** sobre a implementação interna da sua aplicação.

Este guia apresenta uma visão geral concisa e, em seguida, explora de forma detalhada os principais componentes envolvidos no tratamento de exceções em Spring Boot. Você verá exemplos de código práticos (sem alterações nos trechos originais) e aprenderá quando e como aplicar cada técnica em cenários reais.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Principais Elementos do Tratamento de Exceções](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#principais-elementos-do-tratamento-de-exce%C3%A7%C3%B5es)
    1. `@ControllerAdvice`
    2. `@ExceptionHandler`
    3. `ResponseEntityExceptionHandler`
    4. `ResponseEntity`
    5. `WebRequest`
    6. `ExceptionResponse`
    7. `@ResponseStatus`
3. [Componentes-chave e Configurações no Spring Boot](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-e-configura%C3%A7%C3%B5es-no-spring-boot)
4. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Classe de `@ControllerAdvice`
    2. Classe `ExceptionResponse`
    3. Exceção Customizada com `@ResponseStatus`
5. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
6. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **Por que tratar exceções globalmente?**
    1. **Centralização lógica:** Em vez de capturar e tratar erros em cada endpoint, unifica-se em um ponto único.
    2. **Coerência nas respostas:** Garante que todos os erros sigam o mesmo formato de saída (JSON, XML etc.), com campos como timestamp, mensagem e detalhes.
    3. **Melhor experiência para consumidores:** Em uma API REST, retornar um JSON bem estruturado ajuda o cliente (frontend, mobile ou outro sistema) a reagir corretamente ao erro.
    4. **Segurança:** Ao esconder stack traces ou informações internas, evita-se expor detalhes que facilitem a exploração de vulnerabilidades.
- **Fluxo genérico de tratamento:**
    1. O código do Controller (ou Service) lança uma exceção (`throw new ResourceNotFoundException("…")`).
    2. O Spring intercepta a exceção não capturada diretamente no método do Controller.
    3. Um método anotado com `@ExceptionHandler` dentro de uma classe `@ControllerAdvice` cuida desse tipo de exceção e retorna um `ResponseEntity<ExceptionResponse>`.
    4. O cliente recebe um JSON (ou outro formato) padronizado com status HTTP apropriado (ex.: 404, 500) e informações legíveis sobre o erro.

---

## Principais Elementos do Tratamento de Exceções

### 1. `@ControllerAdvice`

- **O que faz?**
    
    Anota uma classe indicando que ela é capaz de capturar exceções lançadas em qualquer ponto dos controllers.
    
- **Por que usar?**
    
    Se você não quisesse uma classe única, teria que anotar cada Controller com `@ExceptionHandler`. Com `@ControllerAdvice`, tornamos o tratamento global.
    
- **Comportamento:**
    1. Sempre que uma exceção ocorre em um método de Controller que não é capturada localmente, o Spring procura uma classe com `@ControllerAdvice`.
    2. Dentro dessa classe, métodos anotados com `@ExceptionHandler` recebem a exceção e constroem uma resposta apropriada.

---

### 2. `@ExceptionHandler`

- **O que faz?**
    
    Liga um método ao tratamento de exceções de um tipo específico (ou de uma hierarquia de exceções).
    
- **Sintaxe típica:**
    
    ```java
    @ExceptionHandler(TipoDaExcecao.class)
    public ResponseEntity<ExceptionResponse> nomeDoMetodo(TipoDaExcecao ex, WebRequest request) {
        // Montagem da ExceptionResponse
        return new ResponseEntity<>(...);
    }
    
    ```
    
- **Comportamento:**
    1. Se uma exceção do tipo exato ou de subclasse for disparada, esse método será invocado.
    2. Você pode ter múltiplos métodos, cada um mapeado a uma exceção específica, e um método “genérico” para `Exception.class`.

---

### 3. `ResponseEntityExceptionHandler`

- **O que é?**
    
    Uma classe base oferecida pelo Spring (`org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler`).
    
- **Por que estender?**
    
    Ela já implementa manipuladores para várias exceções comuns (ex.: `MethodArgumentNotValidException`, `HttpRequestMethodNotSupportedException`, etc.).
    
- **Como usar?**
    
    Basta estender essa classe e, se quiser, sobrescrever qualquer método de tratamento padrão ou adicionar novos métodos com `@ExceptionHandler`.
    

---

### 4. `ResponseEntity`

- **O que é?**
    
    Uma entidade do Spring que encapsula:
    
    1. o corpo da resposta (pode ser qualquer objeto serializável em JSON/XML);
    2. o status HTTP (ex.: `HttpStatus.NOT_FOUND`, `HttpStatus.INTERNAL_SERVER_ERROR`);
    3. cabeçalhos opcionais.
- **Por que usar em handlers?**
    
    Permite retornar um objeto customizado (no nosso exemplo, `ExceptionResponse`) junto com um status HTTP consistente.
    

---

### 5. `WebRequest`

- **O que é?**
    
    Uma interface que fornece detalhes sobre a requisição HTTP atual (parâmetros, headers, URL solicitada etc.).
    
- **Por que usar?**
    1. Inserir no corpo de resposta detalhes adicionais (por ex., `request.getDescription(false)` retorna algo como “uri=/api/clientes/123”).
    2. Em cenários de auditoria ou logs, extrair informações úteis sobre de onde veio a requisição que causou o erro.

---

### 6. `ExceptionResponse`

- **O que é?**
    
    Uma classe de domínio (DTO) personalizada que define como o body da resposta de erro será estruturado.
    
- **Campos comuns:**
    1. `timestamp` (Date): momento em que o erro foi detectado.
    2. `message` (String): mensagem de exceção (geralmente `ex.getMessage()`).
    3. `details` (String): informação adicional, normalmente `request.getDescription(false)`.
- **Por que criar?**
    1. Formatar a saída JSON/ XML de maneira uniforme.
    2. Facilitar a leitura no cliente (frontend, mobile) ou em logs automatizados.

---

### 7. `@ResponseStatus`

- **O que faz?**
    
    Anota uma classe de exceção indicando que, sempre que essa exceção for lançada, o Spring deve devolver um status HTTP específico (ex.: 404).
    
- **Exemplo de uso:**
    
    ```java
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public class ResourceNotFoundException extends RuntimeException { … }
    
    ```
    
- **Pontos de atenção:**
    1. Se você também capturar essa exceção em um `@ExceptionHandler` que retorna outro status, o valor de `@ResponseStatus` será ignorado (o que prevalece é o status que você retornar no `ResponseEntity`).
    2. Serve para documentar, de forma declarativa, o código de status padrão daquela exceção, caso ela não seja capturada por um handler mais específico.

---

## Componentes-chave e Configurações no Spring Boot

Ao construir seu módulo de tratamento de exceções, tenha em mente:

1. **Dependência principal** (geralmente já presente em projetos Spring Boot Starter Web):
    
    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    ```
    
    Isso garante que `ResponseEntityExceptionHandler`, `WebRequest`, `@ControllerAdvice` e `@ExceptionHandler` estejam disponíveis.
    
2. **Pacote adequado:**
    - Coloque sua classe com `@ControllerAdvice` em um pacote que seja escaneado pelo Spring Boot (verifique a anotação `@SpringBootApplication`). Geralmente, um pacote `service.exceptions` ou `config` funciona bem.
3. **Auto-configuração do Spring:**
    - Não é necessário registrar manualmente o `HandlerMapping` para o `@ControllerAdvice`; o Spring detecta automaticamente classes anotadas e as aplica globalmente.
4. **Localização dos arquivos:**
    - Mantenha a classe `ExceptionResponse` no mesmo pacote ou em um subpacote de `service.exceptions`, garantindo coesão.
    - Crie exceções customizadas em `service.exceptions` e utilize `@ResponseStatus` para definir o código HTTP padrão.

---

## Sintaxe Detalhada e Uso Prático

A seguir, os exemplos de código fornecidos, **sem alterações**, ilustram o tratamento de exceções em Spring Boot:

### 1. Classe de `@ControllerAdvice`

```java
package io.github.lgustavogomdam.api_rest_study_i.service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;

/*
===========================================|ControllerAdvice|===========================================================

    É uma anotação que indica ao compilador em tempo de runtime que a seguinte classe é, em outras
    palavras, uma controladora de exceções (por isso, a classe comumente é anotada também por @RestController), logo,
    sempre que uma exceção for disparada o compilador procurará uma solução aqui e caso exista um "endpoint" dessa
    exceção ele chama o método responsável por ela, caso não exista, ele chama um tratamento de exceção global
    que é o "handleAllExceptions"

===========================================|ExceptionHandler|===========================================================

    É usada para anotar métodos que tratam exceções em um aplicativo Spring MVC. Os métodos anotados com
    @ExceptionHandler são chamados quando uma exceção é lançada em um controlador. Esses métodos têm acesso à exceção
    que foi lançada e podem ser usados para gerar uma resposta HTTP personalizada ou redirecionar a solicitação para
    um URL diferente. A anotação @ExceptionHandler tem um parâmetro para o tipo de exceção que o método deve tratar.
    Se uma exceção não corresponder ao tipo especificado, o método não será chamado.

    OBS: note que a declaração da anotação mos métodos anotados por "@HandlerException" sempre possuem um parametro que
    indica de qual exceção se trata, se não existir nenhuma específica ele chama a que tem o parametro "Exception.class"
    que é a exceção mais genérica possível.
*/
@ControllerAdvice
@RestController
public class CustomizedResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    //É usada para capturar todo tipo de exceção
    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ExceptionResponse> handleAllExceptions(Exception ex, WebRequest request){
        ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(),
                ex.getMessage(), request.getDescription(false));

        return new ResponseEntity<>(exceptionResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Tratamento de exceção especifica
    @ExceptionHandler(ResourceNotFoundException.class)
    public final ResponseEntity<ExceptionResponse> handleNotFoundExceptions(Exception ex, WebRequest request){
        ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(),
                ex.getMessage(), request.getDescription(false));

        return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_FOUND);
    }
}

/*
==============================================|Informações Úteis|=======================================================
*
======================|ResponseEntity

    ResponseEntity é uma classe do Spring Framework que representa uma resposta HTTP. Ele contém o corpo da resposta,
    o status da resposta e as cabeçalhos da resposta.O corpo da resposta pode ser um objeto, uma string ou um array.
    O status da resposta é um código de status HTTP, como 200 OK, 404 Not Found ou 500 Internal Server Error.
    Os cabeçalhos da resposta são pares de nome-valor que podem ser usados para transmitir informações adicionais com
    a resposta. O ResponseEntity pode ser usado para retornar respostas de métodos de controlador, filtros e
    anotadores @ExceptionHandler. Ele também pode ser usado para retornar respostas de serviços REST.

======================|WebRequest

    No Spring, WebRequest é uma interface que representa uma solicitação HTTP. Ele fornece acesso aos parâmetros da solicitação, cabeçalhos e corpo. A interface WebRequest é usada por vários componentes do Spring, como filtros, interceptadores e anotadores @ControllerAdvice. Esses componentes podem usar a interface WebRequest para obter informações sobre a solicitação HTTP e tomar decisões sobre como processá-la. A interface WebRequest também é usada por componentes do Spring que fornecem serviços REST. Esses componentes podem usar a interface WebRequest para obter informações sobre a solicitação HTTP e gerar uma resposta HTTP.

    Diferente da RequestEntity que é usada para criar e enviar uma requisição, o WebRequest é usado comumente apenas para obter informações a respeito de uma requisição já feita.
*/

```

> Como funciona este código?
> 
> 1. A classe `CustomizedResponseEntityExceptionHandler` estende `ResponseEntityExceptionHandler`, herdando handlers padrão.
> 2. O método `handleAllExceptions` captura **todas** as exceções (`Exception.class`) e retorna um `ResponseEntity<ExceptionResponse>` com status **500 (INTERNAL_SERVER_ERROR)**.
> 3. O método `handleNotFoundExceptions` captura apenas `ResourceNotFoundException` e retorna um `ResponseEntity<ExceptionResponse>` com status **404 (NOT_FOUND)**.
> 4. `WebRequest` é usado para obter detalhes da requisição (por exemplo, a URI) e incluir em `ExceptionResponse`.

---

### 2. Classe `ExceptionResponse`

```java
package io.github.lgustavogomdam.api_rest_study_i.service.exceptions;

import java.io.Serializable;
import java.util.Date;

/*
* A classe ExceptionResponse é definida justamente para definir um corpo para a response, ou seja, quando uma response conter essa classe por causa de algum "throw", a resposta será um JSON com os atributos da ExceptionResponse.
*/

public class ExceptionResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private Date timestamp;
    private String message;
    private String details;

    public ExceptionResponse(Date timestamp, String message, String details) {
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
    }

    public Date getTimestamp() {
        return this.timestamp;
    }

    public String getMessage() {
        return this.message;
    }

    public String getDetails() {
        return this.details;
    }
}

```

> Como funciona este código?
> 
> 1. Define três campos (timestamp, message, details) que formam o corpo de resposta sempre que a API retorna um erro.
> 2. Ao serializar em JSON, você terá algo como:
>     
>     ```json
>     {
>       "timestamp": "2025-06-05T21:12:34.567+00:00",
>       "message": "Recurso não encontrado",
>       "details": "uri=/api/clientes/99"
>     }
>     
>     ```
>     
> 3. O uso de `Serializable` é opcional, mas recomendado para boas práticas de DTO em Java.

---

### 3. Exceção Customizada com `@ResponseStatus`

```java
package io.github.lgustavogomdam.api_rest_study_i.service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/*
* @ResponseStatus devolve um código http sempre
*/
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException{

    private static final long serialVersionUID = 1L;

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

```

> Como funciona este código?
> 
> 1. `ResourceNotFoundException` herda de `RuntimeException`.
> 2. Ao lançar `throw new ResourceNotFoundException("Cliente não encontrado");`, o Spring, caso esse erro não seja capturado por um `@ExceptionHandler` com status diferente, responderá automaticamente com **404 Not Found**.
> 3. Em nosso `@ControllerAdvice`, temos um método específico para `ResourceNotFoundException`, que efetivamente ignora o `@ResponseStatus` aqui e usa o status definido no próprio handler (também 404).

---

## Cenários de Restrição ou Não Aplicação

Apesar de ser a abordagem recomendada para a maioria dos projetos, em algumas situações o tratamento de exceções via `@ControllerAdvice` e `@ExceptionHandler` pode **não** ser estritamente necessário:

1. **Aplicações Muito Simples ou Protótipos Rápidos**
    - Se sua API tiver apenas 1 ou 2 endpoints e você estiver em fase de prototipação, capturar exceções dentro de cada método de controller pode ser suficiente.
    - No entanto, cuidado: ao crescer o número de endpoints, você terá duplicação de código e inconsistência no formato de erro.
2. **APIs Internas Sem Exposição Externa**
    - Se apenas outra camada interna (mesmo monólito) consome os endpoints, a uniformização de erros pode não ser crítica.
    - Ainda assim, adotar um padrão único desde o início costuma facilitar manutenção a longo prazo.
3. **Cenários em que Erros Devem “Quebrar”**
    - Em algumas batch jobs ou rotinas agendadas, você pode preferir que exceções não sejam capturadas e sejam propagadas para um mecanismo superior (por ex.: Spring Batch).
4. **Casos de Manutenção de Legacy Sem Suporte ao Spring MVC Atual**
    - Se estiver migrando parte de um sistema legada que trata erros manualmente, talvez convém migrar para `@ControllerAdvice` apenas gradualmente, para não quebrar contratos existentes de log ou formato de resposta.

---

## Melhores Práticas e Padrões de Uso

1. **Nunca exponha stack trace completo ao usuário final**
    - Em `@ExceptionHandler(Exception.class)`, retorne apenas informações genéricas (`ex.getMessage()`) e detalhes restritos.
    - Se precisar de mais informação para debug, logue a stack trace no back-end (arquivo de log) sem enviá-la ao cliente.
2. **Defina exceções customizadas para cada tipo de erro de negócio**
    - Exemplo:
        - `ResourceNotFoundException` (404)
        - `BadRequestException` (400)
        - `UnauthorizedException` (401)
        - `ForbiddenException` (403)
    - Cada exceção pode levar um `@ResponseStatus` ou ser capturada por um handler com status adequado.
3. **Evite duplicação de handlers genéricos e específicos**
    - Tenha sempre um método que capture `Exception.class` para fallback (erro inesperado, status 500).
    - Pare exceptions específicas em métodos próprios, retornando status que façam sentido para cada caso de uso.
4. **Use `ResponseEntityExceptionHandler` para reusar lógica padrão do Spring**
    - Caso queira customizar tratamento de exceções do Spring MVC (por exemplo, payload inválido em requisição `@Valid`), estenda `ResponseEntityExceptionHandler` e sobrescreva métodos como `handleMethodArgumentNotValid(...)`.
5. **Documente suas exceções no Swagger / OpenAPI**
    - Utilize anotações como `@ApiResponse(responseCode = "404", content = @Content(...))` para descrever a estrutura de `ExceptionResponse` para cada endpoint.
    - Facilita que consumidores saibam quais erros podem ser retornados e em qual formato.
6. **Inclua timestamps e detalhes úteis, mas sem informações sensíveis**
    - `ExceptionResponse` deve conter campos relevantes ao cliente (por exemplo, qual recurso faltou, qual parâmetro faltou, etc.).
    - Não inclua nomes de classes internas, paths de arquivos do servidor ou credenciais em detalhes.
7. **Teste seu tratamento de exceções**
    - Crie testes automatizados para cada cenário de exceção.
    - Ex.: ao chamar `GET /api/clientes/999` (ID inexistente), a resposta deve ser 404 com JSON estruturado conforme `ExceptionResponse`.

---

## Sugestões para Aprofundamento

1. **Consumer-Driven Contracts (CDC)**
    - Ferramentas como **Pact** ou **Spring Cloud Contract** permitem testar se o formato de erro retornado pelo servidor atende às expectativas do consumidor (frontend, microserviços dependentes, etc.).
2. **Auditoria e Log Centralizado de Exceções**
    - Integre com ferramentas como **ELK Stack (ElasticSearch, Logstash, Kibana)** ou **Sentry** para enviar logs de exceção (incluindo stack trace completo, user agent, IP) sem expor esses detalhes ao cliente.
3. **Tratamento de Exceções em Microsserviços**
    - Ao usar **Spring Cloud** (eureka, zuul, gateway), configure filtros globais para interceptar erros de downstream e formatar de forma consistente antes de retornar ao cliente externo.
4. **Internacionalização (i18n) de Mensagens de Erro**
    - Em sistemas multilíngues, utilize arquivos de properties/ mensagens (`messages.properties`) para que `ExceptionResponse` recupere mensagens localizadas da exceção.
5. **Testes de Integração com MockMvc e TestRestTemplate**
    - Simule requisições e valide que, ao lançar exceções customizadas, os endpoints retornem o JSON correto e o HTTP status adequado.
6. **Avaliação de Desempenho**
    - Embora o overhead do `@ControllerAdvice` seja mínimo, em aplicações de altíssima demanda (milhares de requisições por segundo), faça testes de carga para garantir que não há gargalos no processo de serialização de erros.

---

### Conclusão

O tratamento de exceções em Spring Boot, usando **`@ControllerAdvice`**, **`@ExceptionHandler`**, **`ResponseEntityExceptionHandler`** e demais componentes, é imprescindível para construir APIs robustas, seguras e fáceis de manter. Ao seguir as melhores práticas aqui apresentadas e utilizar os exemplos de código fornecidos (sem alteração), você estará preparado para:

- Unificar e padronizar a forma como erros são retornados.
- Comunicar claramente a causa do erro ao cliente, sem expor detalhes internos sensíveis.
- Facilitar a manutenção e evolução do módulo de tratamento de exceções, garantindo consistência mesmo com o crescimento da base de código.

Aprofunde-se nas sugestões listadas e adapte as abordagens às necessidades específicas do seu projeto ou equipe. A adoção correta dessas técnicas reduzirá drasticamente bugs de “respostas confusas” e melhorará a experiência geral dos consumidores da sua API.