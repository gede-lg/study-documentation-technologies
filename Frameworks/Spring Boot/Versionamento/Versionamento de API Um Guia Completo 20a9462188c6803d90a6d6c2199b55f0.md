# Versionamento de API: Um Guia Completo

---

## Introdução

O versionamento de API é uma prática fundamental para aplicações que evoluem ao longo do tempo. Ele permite que novas funcionalidades, mudanças de contrato ou correções de bugs sejam introduzidas sem afetar consumidores existentes. Em projetos que utilizam **Spring Boot** e **Java**, existem múltiplas estratégias para implementar versionamento, cada uma com seus prós e contras. Este guia visa fornecer:

- Uma **visão geral** concisa do conceito de versionamento de API.
- Uma explicação **detalhada e completa**, incluindo aspectos avançados.
- Exemplos de código comentados para ilustrar as diferentes abordagens.
- Boas práticas, cenários de restrição e sugestões de aprofundamento.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Principais Estratégias de Versionamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#principais-estrat%C3%A9gias-de-versionamento)
    1. Versionamento por URI (caminho)
    2. Versionamento por Parâmetro de Query
    3. Versionamento por Header HTTP
    4. Versionamento por Media Type (Content Negotiation)
3. [Componentes-chave e Configurações no Spring Boot](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-e-configura%C3%A7%C3%B5es-no-spring-boot)
    1. Anotações e Classes Utilizadas
    2. Configurações no `application.properties` / `application.yml`
    3. Customizações Avançadas (Interceptors, Filters e Custom Annotations)
4. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Exemplo de Controller Versionado por URI
    2. Exemplo de Controller Versionado por Header
    3. Exemplo de Controller Versionado por Media Type
    4. Integração com Documentação (Swagger/OpenAPI)
5. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
    1. Quando **não** usar versionamento formal
    2. Impacto na manutenibilidade e performance
    3. Complexidade em ambientes de microsserviços
6. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
    1. Versionamento Semântico (SemVer) vs. Versionamento de Contrato
    2. Depreciação Gradual e Comunicação com Clientes
    3. Controle de Breaking Changes
    4. Testes Automatizados em Múltiplas Versões
7. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    1. Estrutura de Projeto Simplificado
    2. Implementação de Múltiplos Controllers Versionados
    3. Configuração de Swagger para Diferentes Versões
    4. Demonstração de Chamadas e Retornos
8. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **O que é Versionamento de API?**
    
    O versionamento de API consiste em criar identificadores que distinguem “versões” de um mesmo conjunto de endpoints (recursos). A ideia é garantir que clientes que consumiam a versão anterior não quebrem quando mudanças incompatíveis (breaking changes) forem introduzidas.
    
- **Por que Versionar?**
    1. **Evolução Independente:** Permite adicionar recursos novos ou mudar a estrutura de dados sem interromper consumidores existentes.
    2. **Compatibilidade Reversa:** Clientes que dependem de um formato antigo continuam funcionando até serem migrados.
    3. **Gerenciamento de Depreciação:** Possibilita marcar versões antigas como obsoletas, avisando clientes a migrarem gradualmente.
- **Tipos de Versões:**
    - **Major (v1, v2)**: Mudanças que quebram contratos (ex.: remoção ou renomeação de campos obrigatórios).
    - **Minor (v1.1, v1.2)**: Novas funcionalidades que não quebram clientes existentes (ex.: campos opcionais, novos endpoints).
    - **Patch (v1.0.1, v1.0.2)**: Correções de bugs em endpoints existentes sem alterar o esquema de dados.
- **Versão Semântica (SemVer):**
    
    Adotar SemVer (MAJOR.MINOR.PATCH) ajuda a comunicar a natureza das mudanças. Embora muito usado em bibliotecas de software, ainda pode ser aplicado a APIs, desde que o time acrescente metadata para MINOR e PATCH. Na maioria dos casos, costuma-se usar apenas o MAJOR (v1, v2), delegando MINOR e PATCH a documentação interna.
    

---

## Principais Estratégias de Versionamento

### 1. Versionamento por URI (Path Versioning)

### Descrição

Colocar a versão diretamente no caminho do recurso (URL). É a abordagem mais explícita e fácil de entender.

- **Exemplo:**
    
    ```
    GET /api/v1/clientes
    GET /api/v2/clientes
    
    ```
    

### Vantagens

- Visibilidade óbvia da versão na URL.
- Fácil roteamento no Spring, usando `/v1/...` e `/v2/...`.
- Funciona bem para navegadores, caches e proxies.

### Desvantagens

- Pode gerar duplicação de código: controllers separados para cada versão.
- URLs “poluídas” com versões, dificultando manutenção de rotas em evoluções frequentes.

---

### 2. Versionamento por Parâmetro de Query (Query Parameter)

### Descrição

Passar a versão como um parâmetro de consulta na URL.

- **Exemplo:**
    
    ```
    GET /api/clientes?version=1
    GET /api/clientes?version=2
    
    ```
    

### Vantagens

- A URL base permanece a mesma (`/api/clientes`), mais limpa.
- Boa para casos em que há clientes flexíveis para enviar query params.

### Desvantagens

- Menos visível para caches (cacheamento pode ignorar query params se não configurado).
- Para documentação automática (Swagger), precisa de configurações extras para incluir parâmetro de versão em todos os endpoints.
- Menos intuitivo para quem consome: podem não notar que precisam adicionar `?version=`.

---

### 3. Versionamento por Header HTTP (Custom Header Versioning)

### Descrição

Utilizar cabeçalhos HTTP customizados para indicar a versão desejada.

- **Exemplo:**
    
    ```
    GET /api/clientes
    Headers: X-API-VERSION: 1
    
    ```
    
    ou
    
    ```
    Accept: application/vnd.meuapp.v2+json
    
    ```
    

### Vantagens

- Mantém a URL limpa e consistente.
- Separação clara entre endpoint e versão – útil para clients RESTful puros e semântica de mídia (media type).
- Pode combinar bem com Content Negotiation (veja seção de Media Type).

### Desvantagens

- Dificuldade de teste manual (Postman/Browser) se esquecer de adicionar o header.
- Menos “visual” que o versionamento por URI; clientes podem esquecer do cabeçalho.
- Proxies ou firewalls podem filtrar ou modificar headers.

---

### 4. Versionamento por Media Type (Content Negotiation)

### Descrição

Definir diferentes media types que incluem a versão. Padrão do tipo: `application/vnd.{empresa}.{recurso}.v{versao}+json`.

- **Exemplo:**
    
    ```
    GET /api/clientes
    Accept: application/vnd.meuapp.clientes.v1+json
    
    ```
    

### Vantagens

- Segue estritamente o princípio RESTful de Content Negotiation.
- Pacotes de representação (HATEOAS) podem levar metadata no media type.
- Flexível, permite evoluir dados sem mudar a URL.

### Desvantagens

- Mais verboso: cabeçalhos mais extensos a cada requisição.
- Consome mais configuração no Spring (definir `produces` e `consumes` específicos).
- Pode dificultar caches intermediários se não configurado corretamente.

---

## Componentes-chave e Configurações no Spring Boot

Abaixo, detalharemos quais anotações, classes e configurações do Spring Boot são comumente usadas para cada estratégia de versionamento.

### 1. Anotações e Classes Utilizadas

- `@RestController` / `@Controller`
- `@RequestMapping` (ou suas variações: `@GetMapping`, `@PostMapping`, etc.)
- `produces` e `consumes` (para media type/versionamento)
- `@RequestParam` (para versionamento via query)
- `@RequestHeader` (para versionamento via header customizado)
- **Custom Annotations** (opcionais): criar anotação própria, como `@ApiVersion("v1")`, associando-a a `RequestMappingHandlerMapping` customizado para roteamento automático.

### 2. Configurações no `application.properties` / `application.yml`

- Quando for usar content negotiation, garantimos que o Spring não ignore parâmetros como `Accept` ou `Content-Type`:
    
    ```yaml
    spring:
      mvc:
        contentnegotiation:
          favor-parameter: false
          favor-path-extension: false
          favor-header: true
          media-types:
            v1: application/vnd.meuapp.v1+json
            v2: application/vnd.meuapp.v2+json
    
    ```
    
- Para versionamento por header customizado (Ex.: `X-API-VERSION`), não há necessidade de `application.properties` específico, mas podemos usar `HandlerMethodArgumentResolver` se quisermos converter automaticamente.

### 3. Customizações Avançadas (Interceptors, Filters e Custom Annotations)

1. **Custom RequestMappingHandlerMapping**
    - Podemos criar uma classe que estende `RequestMappingHandlerMapping` e verifica uma anotação `@ApiVersion` em vez de usar o caminho fixo.
    - Exemplo de annotation:
        
        ```java
        @Target({ElementType.TYPE, ElementType.METHOD})
        @Retention(RetentionPolicy.RUNTIME)
        public @interface ApiVersion {
            int[] value();
        }
        
        ```
        
    - Exemplo de `RequestMappingHandlerMapping` customizado registra rotas considerando `@ApiVersion`.
2. **Interceptor para Versionamento por Header**
    - Intercepta requisições, lê o header `X-API-VERSION`, e direciona o fluxo para o controller apropriado.
    - Utiliza `HandlerMapping` condicional para mapear `RequestCondition` customizado.
3. **Filters para Validação de Versão**
    - Podemos criar um `Filter` que valide a presença e formato do header ou query param de versão antes de chegar ao controller, retornando 400 caso inválido.

---

## Sintaxe Detalhada e Uso Prático

### 1. Exemplo de Controller Versionado por URI

```java
package com.exemplo.apiversion.controllers.v1;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteControllerV1 {

    @GetMapping
    public List<ClienteDtoV1> listarTodos() {
        // Implementação para v1
        return clienteService.buscarTodosV1();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDtoV1> buscarPorId(@PathVariable Long id) {
        // Retorna ClienteDtoV1
        return ResponseEntity.ok(clienteService.buscarPorIdV1(id));
    }
}

```

```java
package com.exemplo.apiversion.controllers.v2;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/clientes")
public class ClienteControllerV2 {

    @GetMapping
    public List<ClienteDtoV2> listarTodos() {
        // Implementação para v2 (ex.: novos campos)
        return clienteService.buscarTodosV2();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDtoV2> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.buscarPorIdV2(id));
    }
}

```

- **Observações:**
    - Aqui, temos pastas separadas `controllers.v1` e `controllers.v2`, facilitando organização de pacotes.
    - DTOs (Data Transfer Objects) diferentes para cada versão: `ClienteDtoV1` vs. `ClienteDtoV2` (por exemplo, `V2` pode incluir novos campos ou alterar tipos).

---

### 2. Exemplo de Controller Versionado por Parâmetro de Query

```java
package com.exemplo.apiversion.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteControllerQueryVersion {

    @GetMapping
    public ResponseEntity<?> listarClientes(@RequestParam(name = "version", defaultValue = "1") int version) {
        if (version == 1) {
            List<ClienteDtoV1> listaV1 = clienteService.buscarTodosV1();
            return ResponseEntity.ok(listaV1);
        } else if (version == 2) {
            List<ClienteDtoV2> listaV2 = clienteService.buscarTodosV2();
            return ResponseEntity.ok(listaV2);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Versão da API inválida: " + version);
        }
    }
}

```

- **Uso Prático:**
    - Cliente faz chamada: `GET /api/clientes?version=2`.
    - No controller, parte-se para a implementação adequada conforme parâmetro.
    - Desempenho: Introduz branching no código, possivelmente misturando lógica de versões no mesmo endpoint.

---

### 3. Exemplo de Controller Versionado por Header HTTP

```java
package com.exemplo.apiversion.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
public class ClienteControllerHeaderVersion {

    @GetMapping
    public ResponseEntity<?> listarClientes(@RequestHeader(value = "X-API-VERSION", defaultValue = "1") int apiVersion) {
        if (apiVersion == 1) {
            List<ClienteDtoV1> listaV1 = clienteService.buscarTodosV1();
            return ResponseEntity.ok(listaV1);
        } else if (apiVersion == 2) {
            List<ClienteDtoV2> listaV2 = clienteService.buscarTodosV2();
            return ResponseEntity.ok(listaV2);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .header(HttpHeaders.WARNING, "Versão da API inválida")
                                 .body("Header X-API-VERSION inválido: " + apiVersion);
        }
    }
}

```

- **Observação:**
    - Clientes devem incluir o header `X-API-VERSION` em cada requisição.
    - Alternativamente, podemos criar múltiplos métodos anotados com `@RequestMapping(headers = "X-API-VERSION=2")` para roteamento automático.

```java
@GetMapping(headers = "X-API-VERSION=1")
public List<ClienteDtoV1> listarV1() { … }

@GetMapping(headers = "X-API-VERSION=2")
public List<ClienteDtoV2> listarV2() { … }

```

---

### 4. Exemplo de Controller Versionado por Media Type (Content Negotiation)

### Configuração em `application.yml`

```yaml
spring:
  mvc:
    contentnegotiation:
      favor-path-extension: false
      favor-parameter: false
      favor-header: true
      ignore-unknown-path-extensions: true
      media-types:
        v1: application/vnd.meuapp.v1+json
        v2: application/vnd.meuapp.v2+json

```

### Controller

```java
package com.exemplo.apiversion.controllers;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
public class ClienteControllerMediaType {

    @GetMapping(produces = "application/vnd.meuapp.v1+json")
    public List<ClienteDtoV1> listarV1() {
        return clienteService.buscarTodosV1();
    }

    @GetMapping(produces = "application/vnd.meuapp.v2+json")
    public List<ClienteDtoV2> listarV2() {
        return clienteService.buscarTodosV2();
    }
}

```

- **Como Consumir:**
    - Requisição para v1:
        
        ```
        GET /api/clientes
        Accept: application/vnd.meuapp.v1+json
        
        ```
        
    - Requisição para v2:
        
        ```
        GET /api/clientes
        Accept: application/vnd.meuapp.v2+json
        
        ```
        
- **Pontos de Atenção:**
    - Se o cliente não enviar `Accept` ou enviar um valor diferente, o Spring pode retornar erro 406 (Not Acceptable).
    - É possível combinar `consumes` para requisições POST/PUT, exigindo que o `Content-Type` informe a versão.

---

### 5. Integração com Documentação (Swagger/OpenAPI)

Para expor corretamente diferentes versões no Swagger (utilizando `springdoc-openapi` ou `springfox`), precisamos criar **configurações de agrupamento** de API por versão.

### Exemplo com `springdoc-openapi` (springdoc-openapi-ui)

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public GroupedOpenApi apiV1() {
        return GroupedOpenApi.builder()
            .group("v1")
            .pathsToMatch("/api/v1/**")
            .addOpenApiCustomiser(openApi -> openApi.info(new Info()
                  .title("API Clientes")
                  .version("v1")
                  .description("Documentação da versão 1")))
            .build();
    }

    @Bean
    public GroupedOpenApi apiV2() {
        return GroupedOpenApi.builder()
            .group("v2")
            .pathsToMatch("/api/v2/**")
            .addOpenApiCustomiser(openApi -> openApi.info(new Info()
                  .title("API Clientes")
                  .version("v2")
                  .description("Documentação da versão 2")))
            .build();
    }
}

```

- Para **header-based** ou **media type–based**, seria necessário criar filtros que identifiquem rotas por `RequestCondition` customizado e apontá-las a grupos distintos.

---

## Cenários de Restrição ou Não Aplicação

Mesmo sendo altamente recomendável versionar APIs públicas ou usadas por múltiplos clientes, em certos casos o versionamento formal pode **não** ser a melhor escolha:

1. **APIs Internas Muito Simples**
    - Se a API for utilizada apenas internamente por um único projeto, com mudanças coordenadas entre frontend e backend, pode-se optar por não versionar ou versionar minimamente.
    - Neste cenário, equipes ágeis podem sincronizar lançamento de novas versões ao mesmo tempo que consomem-nas.
2. **Aplicativos Monolíticos Sem Exposição Externa**
    - Em uma aplicação monolítica pequena, sem contratos externos, cada mudança pode ser lançada e consumida simultaneamente.
    - O custo de manter múltiplas versões torna-se maior que o benefício.
3. **Ambientes de Desenvolvimento e Protótipos**
    - Em estágio de prototipação ou MVP, pode-se adiar o versionamento até estabilizar a API.
    - Esse atraso deve ser comunicado à equipe para que seja planejado.
4. **Performance e Overhead**
    - Versionamento exige manutenção de múltiplos controllers, DTOs e testes. Em cenários de recursos limitados, pode sobrecarregar a base de código.
    - Em microsserviços com várias APIs, a complexidade aumenta: cada microserviço versionado implica em pipelines CI/CD independentes, deploys paralelos e potencial duplicação de infraestrutura.

---

## Melhores Práticas e Padrões de Uso

### 1. Versionamento Semântico x Versionamento de Contrato

- **SemVer:** Usa MAJOR.MINOR.PATCH. Em APIs, o PATCH raramente é parte do caminho; a maioria dos times opta por versionar somente pelo MAJOR (v1, v2), lançando MINOR e PATCH internamente (sem expô-los na URL).
- **Contrato:** Em vez de versionar a URL, algumas equipes escolhem versionar apenas o **schema** de dados (mensagens) garantindo compatibilidade. Apesar de interessante, costuma ser difícil de gerenciar em aplicações de larga escala sem expor explicitamente a versão.

### 2. Depreciação Gradual e Comunicação com Clientes

- **Deprecate First:** Ao lançar v2, mantenha endpoints de v1 marcados como “deprecated” na documentação (Swagger: `@Deprecated` ou `@ApiResponses` sinalizando 410).
- **Headers de Advertência:** Em cada resposta de v1, inclua header customizado:
    
    ```
    Warning: 299 - "Esta versão (v1) será descontinuada em 31/12/2025"
    
    ```
    
- **Política de Migração:** Defina datas-limite e comunique detalhadamente. Utilize release notes e changelogs.

### 3. Controle de Breaking Changes

- **Evite Remover Campos Obrigatórios:** Se for necessário remover ou mudar tipos de campos, introduza uma nova versão.
- **Novos Campos Opcionais:** Em v2, adicione campos opcionais que não afetem consumidores de v1.
- **Padrão de Fallback:** Se o cliente solicitar uma versão não suportada, retorne `HTTP 400 Bad Request` ou `HTTP 426 Upgrade Required` com mensagem clara.

### 4. Testes Automatizados em Múltiplas Versões

- Crie suítes de teste específicas para cada versão.
    - Ex.: tests `ClienteControllerV1Test` e `ClienteControllerV2Test`.
- Utilize mocks para isolar dependências de serviço.
- Assegure que cenários de compatibilidade (backward compatibility) sejam validados: um cliente que consome v1 não deve falhar com mudanças em v2.

---

## Exemplo Prático Completo

Nesta seção, reunimos em um único projeto simplificado todas as práticas apresentadas.

### 1. Estrutura de Projeto Simplificado

```
src/main/java/
├── com.exemplo.apiversion
│   ├── ApiversionApplication.java
│   ├── controller
│   │   ├── v1
│   │   │   └── ClienteControllerV1.java
│   │   ├── v2
│   │   │   └── ClienteControllerV2.java
│   ├── dto
│   │   ├── v1
│   │   │   └── ClienteDtoV1.java
│   │   └── v2
│   │       └── ClienteDtoV2.java
│   ├── model
│   │   └── Cliente.java
│   ├── repository
│   │   └── ClienteRepository.java
│   ├── service
│   │   └── ClienteService.java
│   └── config
│       └── OpenApiConfig.java

```

### 2. Implementação de Múltiplos Controllers Versionados

### 2.1. `ClienteControllerV1.java`

```java
package com.exemplo.apiversion.controller.v1;

import com.exemplo.apiversion.dto.v1.ClienteDtoV1;
import com.exemplo.apiversion.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteControllerV1 {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<ClienteDtoV1> listarTodosV1() {
        return clienteService.buscarTodosV1();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDtoV1> buscarPorIdV1(@PathVariable Long id) {
        ClienteDtoV1 cliente = clienteService.buscarPorIdV1(id);
        if (cliente != null) {
            return ResponseEntity.ok(cliente);
        }
        return ResponseEntity.notFound().build();
    }
}

```

### 2.1.1. `ClienteDtoV1.java`

```java
package com.exemplo.apiversion.dto.v1;

public class ClienteDtoV1 {
    private Long id;
    private String nome;
    private String email;

    // Construtores, getters e setters
}

```

---

### 2.2. `ClienteControllerV2.java`

```java
package com.exemplo.apiversion.controller.v2;

import com.exemplo.apiversion.dto.v2.ClienteDtoV2;
import com.exemplo.apiversion.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v2/clientes")
public class ClienteControllerV2 {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<ClienteDtoV2> listarTodosV2() {
        return clienteService.buscarTodosV2();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDtoV2> buscarPorIdV2(@PathVariable Long id) {
        ClienteDtoV2 cliente = clienteService.buscarPorIdV2(id);
        if (cliente != null) {
            return ResponseEntity.ok(cliente);
        }
        return ResponseEntity.notFound().build();
    }
}

```

### 2.2.1. `ClienteDtoV2.java`

```java
package com.exemplo.apiversion.dto.v2;

import java.time.LocalDate;

public class ClienteDtoV2 {
    private Long id;
    private String nome;
    private String email;
    private LocalDate dataNascimento; // Novo campo em v2

    // Construtores, getters e setters
}

```

---

### 3. Serviço e Repositório Compartilhado

### `ClienteService.java`

```java
package com.exemplo.apiversion.service;

import com.exemplo.apiversion.dto.v1.ClienteDtoV1;
import com.exemplo.apiversion.dto.v2.ClienteDtoV2;
import com.exemplo.apiversion.model.Cliente;
import com.exemplo.apiversion.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    // Convert Cliente -> ClienteDtoV1
    public List<ClienteDtoV1> buscarTodosV1() {
        return repository.findAll()
                .stream()
                .map(this::converterParaDtoV1)
                .collect(Collectors.toList());
    }

    public ClienteDtoV1 buscarPorIdV1(Long id) {
        return repository.findById(id)
                .map(this::converterParaDtoV1)
                .orElse(null);
    }

    // Convert Cliente -> ClienteDtoV2 (inclui dataNascimento)
    public List<ClienteDtoV2> buscarTodosV2() {
        return repository.findAll()
                .stream()
                .map(this::converterParaDtoV2)
                .collect(Collectors.toList());
    }

    public ClienteDtoV2 buscarPorIdV2(Long id) {
        return repository.findById(id)
                .map(this::converterParaDtoV2)
                .orElse(null);
    }

    private ClienteDtoV1 converterParaDtoV1(Cliente cliente) {
        ClienteDtoV1 dto = new ClienteDtoV1();
        dto.setId(cliente.getId());
        dto.setNome(cliente.getNome());
        dto.setEmail(cliente.getEmail());
        return dto;
    }

    private ClienteDtoV2 converterParaDtoV2(Cliente cliente) {
        ClienteDtoV2 dto = new ClienteDtoV2();
        dto.setId(cliente.getId());
        dto.setNome(cliente.getNome());
        dto.setEmail(cliente.getEmail());
        dto.setDataNascimento(cliente.getDataNascimento());
        return dto;
    }
}

```

### `ClienteRepository.java`

```java
package com.exemplo.apiversion.repository;

import com.exemplo.apiversion.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Métodos padrão do Spring Data JPA
}

```

### `Cliente.java` (Entidade)

```java
package com.exemplo.apiversion.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private LocalDate dataNascimento; // utilizado apenas em v2

    // Construtores, getters e setters
}

```

---

### 4. Configuração de Swagger/OpenAPI (Exemplo com springdoc-openapi)

### Dependências no `pom.xml`

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.6.9</version>
</dependency>

```

### `OpenApiConfig.java`

```java
package com.exemplo.apiversion.config;

import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public GroupedOpenApi apiV1() {
        return GroupedOpenApi.builder()
            .group("v1")
            .pathsToMatch("/api/v1/**")
            .addOpenApiCustomiser(openApi -> openApi.info(new Info()
                  .title("API Clientes - Versão 1")
                  .version("v1")
                  .description("Documentação da API Clientes versão 1")))
            .build();
    }

    @Bean
    public GroupedOpenApi apiV2() {
        return GroupedOpenApi.builder()
            .group("v2")
            .pathsToMatch("/api/v2/**")
            .addOpenApiCustomiser(openApi -> openApi.info(new Info()
                  .title("API Clientes - Versão 2")
                  .version("v2")
                  .description("Documentação da API Clientes versão 2")))
            .build();
    }
}

```

- **Acessando:**
    - `http://localhost:8080/swagger-ui.html#/v1` → documentação da v1
    - `http://localhost:8080/swagger-ui.html#/v2` → documentação da v2

---

### 5. Demonstração de Chamadas e Retornos

1. **Obter todos os clientes (v1):**
    
    ```
    GET http://localhost:8080/api/v1/clientes
    
    ```
    
    **Resposta (200 OK):**
    
    ```json
    [
      {
        "id": 1,
        "nome": "Ana Silva",
        "email": "ana@example.com"
      },
      {
        "id": 2,
        "nome": "Bruno Costa",
        "email": "bruno@example.com"
      }
    ]
    
    ```
    
2. **Obter todos os clientes (v2):**
    
    ```
    GET http://localhost:8080/api/v2/clientes
    
    ```
    
    **Resposta (200 OK):**
    
    ```json
    [
      {
        "id": 1,
        "nome": "Ana Silva",
        "email": "ana@example.com",
        "dataNascimento": "1985-02-15"
      },
      {
        "id": 2,
        "nome": "Bruno Costa",
        "email": "bruno@example.com",
        "dataNascimento": "1990-11-30"
      }
    ]
    
    ```
    
3. **Obter cliente por ID (v1):**
    
    ```
    GET http://localhost:8080/api/v1/clientes/1
    
    ```
    
    **Resposta (200 OK):**
    
    ```json
    {
      "id": 1,
      "nome": "Ana Silva",
      "email": "ana@example.com"
    }
    
    ```
    
4. **Obter cliente por ID (v2):**
    
    ```
    GET http://localhost:8080/api/v2/clientes/1
    
    ```
    
    **Resposta (200 OK):**
    
    ```json
    {
      "id": 1,
      "nome": "Ana Silva",
      "email": "ana@example.com",
      "dataNascimento": "1985-02-15"
    }
    
    ```
    

---

## Cenários de Restrição ou Não Aplicação

1. **APIs de Uso Único ou Internas:**
    - Se o único consumidor da API é controle interno, versão explícita pode não trazer benefícios imediatos.
    - No entanto, recomenda-se ter ao menos **registro de mudanças** (CHANGELOG) para facilitar futuros refactors.
2. **Protótipos e MVP (Produto Mínimo Viável):**
    - Em estágios iniciais, o foco é validar funcionalidades; versionamento formal pode atrasar entregas.
    - Caso o protótipo seja descartável, a sobrecarga de versionar pode não justificar.
3. **Performance e Escalabilidade:**
    - Em cenários de alta escala, múltiplas versões simultâneas podem exigir mais instâncias e recursos de infraestrutura.
    - Deve-se analisar custo-benefício: manter apenas uma versão “stable” e outra “beta” pode ser suficiente.
4. **Complexidade em Microsserviços Hiperescaláveis:**
    - Cada microsserviço pode ter seu próprio esquema de versionamento, tornando rotas e pipelines CI/CD mais intrincados.
    - Recomendável adotar versionamento mínimo e contratos de payloads (via contratos OpenAPI) quando possível.

---

## Melhores Práticas e Padrões de Uso

### 1. Versionamento Semântico (SemVer) vs. Versionamento de Contrato

- **SemVer:**
    - Proposta de utilizar `v1`, `v2` no caminho ou headers.
    - **Exemplo:** `/api/v1/...` significa `MAJOR = 1`.
    - MINOR e PATCH podem permanecer documentados, mas não expostos na URL.
- **Contratos de Payload (Schema-First):**
    - Utilizar OpenAPI/Swagger para definir schemas (`components/schemas`) com versionamento interno.
    - Avançado: ambientes de gRPC também versionam protobufs, mas em REST costuma-se adaptar.

### 2. Depreciação Gradual

1. **Comunicação Transparente:**
    - Inserir no Changelog as mudanças, datas de depreciação e instruções de migração.
    - Em documentação (Swagger), marcar endpoints e classes DTO com `@Deprecated`.
2. **Código de Resposta 410 (Gone):**
    - Quando decide descontinuar completamente um endpoint v1, retornar `HTTP 410 Gone` em chamadas à v1.
    - Antes disso, retornar `HTTP 200` junto a header de advertência.
3. **Notificação em Logs e Métricas:**
    - Registrar no log sempre que um endpoint v1 for acessado, para estimar o uso residual.

### 3. Controle de Breaking Changes

- **Teste de Contratos:**
    - Automatizar testes de regressão entre versões.
    - Exemplo: usar ferramentas como `Pact` para Consumer-Driven Contracts (CDC).
- **Validação Estrita de Payload:**
    - Em v2, validar campos obrigatórios novos.
    - Em v1, aceitar carga antiga, mas manter a validação antiga.

### 4. Versionamento no Banco de Dados

- Em casos que haja alterações no schema de banco que impactem múltiplas versões da API, considerar:
    - **Estrategia de migração incrementais** (Flyway/Liquibase) que suportem dados legados.
    - **Campos opcionais** em tabela para manter compatibilidade de leitura entre versões.

### 5. Roteamento Dinâmico com Custom Annotations

- Criar anotação `@ApiVersion`:
    
    ```java
    @Target({ElementType.TYPE, ElementType.METHOD})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ApiVersion {
        int[] value(); // ex.: {1,2} para suportar múltiplas versões
    }
    
    ```
    
- Criar um `RequestMappingHandlerMapping` customizado que adicione o prefixo `/api/v{version}` aos métodos anotados:
    
    ```java
    public class ApiVersionRequestMappingHandlerMapping extends RequestMappingHandlerMapping {
    
        private static final String URL_PREFIX = "/api/v";
    
        @Override
        protected RequestMappingInfo getMappingForMethod(Method method, Class<?> handlerType) {
            ApiVersion methodAnnotation = method.getAnnotation(ApiVersion.class);
            if (methodAnnotation == null) {
                methodAnnotation = handlerType.getAnnotation(ApiVersion.class);
            }
    
            RequestMappingInfo mappingInfo = super.getMappingForMethod(method, handlerType);
            if (methodAnnotation != null && mappingInfo != null) {
                int[] versions = methodAnnotation.value();
                RequestMappingInfo versionedInfo = null;
                for (int version : versions) {
                    String versionPath = URL_PREFIX + version;
                    PatternsRequestCondition versionPattern = new PatternsRequestCondition(versionPath)
                            .combine(mappingInfo.getPatternsCondition());
                    RequestMappingInfo newInfo = new RequestMappingInfo(
                            mappingInfo.getName(),
                            versionPattern,
                            mappingInfo.getMethodsCondition(),
                            mappingInfo.getParamsCondition(),
                            mappingInfo.getHeadersCondition(),
                            mappingInfo.getConsumesCondition(),
                            mappingInfo.getProducesCondition(),
                            mappingInfo.getCustomCondition()
                    );
    
                    versionedInfo = (versionedInfo == null) ? newInfo : versionedInfo.combine(newInfo);
                }
                return versionedInfo;
            }
            return mappingInfo;
        }
    }
    
    ```
    
- Registrar no `WebMvcConfigurer`:
    
    ```java
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
    
        @Override
        public void configureHandlerMapping(RequestMappingHandlerMapping mapping) {
            if (mapping instanceof RequestMappingHandlerMapping) {
                ((RequestMappingHandlerMapping) mapping)
                    .setOrder(0); // Prioridade alta
            }
        }
    
        @Bean
        public RequestMappingHandlerMapping requestMappingHandlerMapping() {
            return new ApiVersionRequestMappingHandlerMapping();
        }
    }
    
    ```
    
- Uso em controllers:
    
    ```java
    @ApiVersion(1)
    @RestController
    public class ClienteController {
        @GetMapping("/clientes")
        public List<ClienteDtoV1> getAllV1() { … }
    }
    
    @ApiVersion(2)
    @RestController
    public class ClienteController {
        @GetMapping("/clientes")
        public List<ClienteDtoV2> getAllV2() { … }
    }
    
    ```
    
    - **Benefício:** não precisa repetir `/api/v1` e `/api/v2` explicitamente em cada `@RequestMapping`; o handler mapping injeta o prefixo automaticamente.

---

## Sugestões para Aprofundamento

1. **Consumer-Driven Contract (CDC):**
    - Estudar ferramentas como **Pact** ou **Spring Cloud Contract** para garantir que clientes e servidores mantenham contratos compatíveis durante evoluções.
2. **Rate Limiting e Versioning Conjuntos:**
    - Implementar políticas de rate limiting específicas por versão, evitando que consumidores de versões antigas abusem de recursos.
3. **GraphQL Versioning vs. REST Versioning:**
    - Comparar vantagens de GraphQL (schema evolutivo) em relação a REST versionado, e quando migrar para GraphQL pode ser apropriado.
4. **Testes de Contrato Automatizados:**
    - Explorar frameworks que geram stubs a partir de arquivos OpenAPI, garantindo que cada versão produza stubs independentes para testes de integração.
5. **Estratégias de Deployment (“Blue-Green” / “Canary”) em APIs Versionadas:**
    - Avaliar como fazer rollout de novas versões de forma controlada, redirecionando pequenos percentuais de tráfego antes de liberar globalmente.
6. **Depreciação e Documentação Dinâmica:**
    - Configurar endpoints que informem status de versão (v1: deprecada, v2: estável), expostos em `/api/status` ou similar, permitindo monitoramento centralizado.

---

### Conclusão

O versionamento de API em **Spring Boot com Java** é um componente crítico para garantir a evolução segura e sem interrupções de serviços. As principais abordagens (URI, Query Param, Header e Media Type) atendem a cenários distintos, e a escolha depende de fatores como visibilidade, facilidade de cache, integração com proxies e perfil dos consumidores.

Ao projetar a estratégia de versionamento, leve em consideração:

- **Clareza** para clientes: evite mecanismos excessivamente obscuros.
- **Manutenibilidade** do código: minimização de duplicação de lógica, uso de abstrações para reduzir repetição de controllers.
- **Compatibilidade retroativa**: estabelecer prazos e políticas claras de depreciação.
- **Documentação**: manter Swagger/OpenAPI atualizado para cada versão.
- **Testes**: validar cada versão separadamente e, se possível, automatizar testes que verifiquem compatibilidade entre versões.

Com as práticas e exemplos aqui apresentados, você possui uma base sólida para desenhar, implementar e manter um sistema de versionamento robusto em suas APIs Spring Boot.