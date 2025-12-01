# Configuração do Info

---

## Introdução

O uso de **Swagger** (agora conhecido como OpenAPI) em aplicações **Spring Boot** tornou-se praticamente um padrão para documentar APIs RESTful. O **SpringDoc** é uma biblioteca que facilita a integração do OpenAPI 3.x ao ecossistema Spring, gerando automaticamente a documentação interativa da API com base em anotações e configurações mínimas de código.

Dentro da especificação OpenAPI, a seção **Info** (Informações Gerais da API) é fundamental. Ela reúne metadados como:

- **Título** da API
- **Descrição**
- **Versão**
- **Dados de contato**
- **Licença**

Essas informações são exibidas no **Swagger UI** e em outros consumidores da documentação, orientando desenvolvedores e clientes que vão consumir a API sobre o propósito, autor e versão do serviço.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Dependências e Configurações Iniciais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#depend%C3%AAncias-e-configura%C3%A7%C3%B5es-iniciais)
    2. [Anotações para Definir o Info](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#anota%C3%A7%C3%B5es-para-definir-o-info)
    3. [Uso de Bean `OpenAPI`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#uso-de-bean-openapi)
    4. [Configuração via `application.properties` / `application.yml`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#configura%C3%A7%C3%A3o-via-applicationproperties--applicationyml)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes-Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

1. **OpenAPI 3.x**
    - É uma especificação padrão para definir RESTful APIs de forma legível por humanos e máquinas. Permite descrever endpoints, parâmetros, esquemas de dados, respostas, segurança, entre outros.
    - Versão 3.x ampliou e refinou vários pontos em relação ao Swagger 2.0 (agora referenciado como OpenAPI 2.0).
2. **SpringDoc**
    - Biblioteca que gera a documentação OpenAPI 3.x a partir de anotações e estrutura de código de projetos Spring Boot.
    - Possui integração nativa com **Spring MVC**, **WebFlux**, **Spring Security** e outras features do ecossistema.
    - Gera automaticamente endpoints como `/v3/api-docs` (JSON/YAML da especificação) e disponibiliza a interface **Swagger UI** em `/swagger-ui.html` ou `/swagger-ui/index.html`.
3. **Info (Informações Gerais da API)**
    - Estrutura obrigatória na especificação OpenAPI.
    - Campo que reúne metadados:
        - `title` (título da API)
        - `description` (descrição breve)
        - `version` (versão da API)
        - `termsOfService` (URL de termos de uso, se houver)
        - `contact` (dados de contato do responsável)
        - `license` (informações sobre licença, se houver)
    - Exemplo de bloco OpenAPI (trecho YAML/JSON):
        
        ```yaml
        openapi: 3.0.1
        info:
          title: Minha API de Exemplo
          description: API para gerenciar recursos X e Y.
          version: 1.0.0
          contact:
            name: Equipe de Suporte
            url: https://meusite.com/suporte
            email: suporte@meusite.com
          license:
            name: Apache 2.0
            url: http://www.apache.org/licenses/LICENSE-2.0.html
        
        ```
        
    - No **SpringDoc**, essa seção pode ser preenchida por meio de anotações em código Java ou pela definição de um **Bean** do tipo `OpenAPI`.

---

## Sintaxe Detalhada e Uso Prático

### Dependências e Configurações Iniciais

Para usar o SpringDoc em um projeto **Spring Boot** com Maven, inclua no `pom.xml`:

```xml
<dependencies>
  <!-- Dependência principal do SpringDoc OpenAPI -->
  <dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.1.0</version>
  </dependency>
  <!-- Caso utilize Spring Security, opcional: integração automática -->
  <!--
  <dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.1.0</version>
  </dependency>
  -->
  <!-- Outras dependências do seu projeto -->
</dependencies>

```

ou, em Gradle (`build.gradle`):

```groovy
dependencies {
  implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0'
  // ...
}

```

> Observações
> 
> - A versão exata (`2.1.0` neste exemplo) pode variar; sempre verifique o [repositório oficial no Maven Central](https://search.maven.org/artifact/org.springdoc/springdoc-openapi-starter-webmvc-ui).
> - A dependência `springdoc-openapi-starter-webmvc-ui` já inclui tanto o gerador de especificação quanto o Swagger UI integrado.

---

### Anotações para Definir o **Info**

### 1. Anotação `@OpenAPIDefinition` (Nível de Classe de Configuração)

Você pode criar uma classe de configuração dedicada para preencher o `info`:

```java
package com.exemplo.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "API de Gerenciamento de Tarefas",
        version = "v1.0.0",
        description = "Esta API permite criar, ler, atualizar e excluir tarefas.",
        termsOfService = "https://meusite.com/terms",
        contact = @Contact(
            name = "Equipe de API",
            email = "api-suporte@meusite.com",
            url = "https://meusite.com/contato"
        ),
        license = @License(
            name = "Apache 2.0",
            url = "http://www.apache.org/licenses/LICENSE-2.0.html"
        )
    )
)
public class OpenApiConfig {
    // A classe pode ficar vazia, pois a anotação já informa tudo.
}

```

- **@Configuration**: torna a classe um bean de configuração Spring.
- **@OpenAPIDefinition**: anotações de alto nível que definem metadados para a especificação OpenAPI.
- **@Info**: dentro de `@OpenAPIDefinition`, agrupa os campos principais (title, version, description, etc.).
- **@Contact** e **@License**: sub-anotações para detalhes adicionais.

> Comentário das principais propriedades do @Info:
> 
> - `title` (String): Título amigável da API.
> - `version` (String): Versão atual da API (ex.: `v1.0.0`, `1.0`, etc.).
> - `description` (String): Texto explicativo curto sobre o propósito da API.
> - `termsOfService` (String): URL para termos de uso (opcional).
> - `contact` (Contact): Objeto com nome, e-mail e URL de contato.
> - `license` (License): Objeto com nome da licença e URL.

### 2. Anotação `@Info` Diretamente em Bean `OpenAPI` (Programaticamente)

Alternativamente, você pode definir um `@Bean` do tipo `OpenAPI` e configurar o **Info** via código Java:

```java
package com.exemplo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API de Gerenciamento de Tarefas")
                .version("v1.0.0")
                .description("Esta API permite criar, ler, atualizar e excluir tarefas.")
                .termsOfService("https://meusite.com/terms")
                .contact(new Contact()
                    .name("Equipe de API")
                    .email("api-suporte@meusite.com")
                    .url("https://meusite.com/contato"))
                .license(new License()
                    .name("Apache 2.0")
                    .url("http://www.apache.org/licenses/LICENSE-2.0.html"))
            );
    }
}

```

- **Principais Classes/Interfaces:**
    - `io.swagger.v3.oas.models.OpenAPI`
    - `io.swagger.v3.oas.models.info.Info`
    - `io.swagger.v3.oas.models.info.Contact`
    - `io.swagger.v3.oas.models.info.License`

> Vantagens desta abordagem programática:
> 
> - Possibilidade de lógica condicional (por exemplo, alterar a `version` conforme perfil ativo).
> - Facilidade para carregar dados de propriedades externas (`@Value("${app.version}")`).
> - Menor dependência de anotações, caso prefira não “poluir” classes com muitas meta-anotações.

---

### Uso de Bean `OpenAPI`

Se optar por programaticamente instanciar `OpenAPI`, lembre-se de que as informações definidas serão refletidas diretamente no JSON/YAML gerado pelo SpringDoc. Alguns pontos de atenção:

- O bean deve estar na configuração (`@Configuration`) e ser `public`.
- Se existir mais de um bean `OpenAPI`, o SpringDoc tentará mesclá-los; portanto, é recomendável manter apenas um para metadados de nível geral.
- Qualquer outro bean que altere ou extenda essa configuração (por exemplo, para adicionar servidores, tags, etc.) pode complementar a especificação.

---

### Configuração via `application.properties` / `application.yml`

Além das anotações ou bean `OpenAPI`, várias propriedades podem ser definidas em arquivo de configuração, sobretudo para ajustar comportamentos do SpringDoc, mas **não substituem completamente** a definição de `info` via anotações/bean. Entretanto, existem chaves que permitem preencher alguns campos do **Info** sem usar anotações Java (dependente da versão do SpringDoc):

### Exemplo `application.yml` (Spring Boot com SpringDoc)

```yaml
springdoc:
  api-docs:
    title: "API de Gerenciamento de Tarefas"
    description: "Esta API permite criar, ler, atualizar e excluir tarefas."
    version: "v1.0.0"
  swagger-ui:
    path: /swagger-ui.html

```

### Exemplo `application.properties`

```
springdoc.api-docs.title=API de Gerenciamento de Tarefas
springdoc.api-docs.description=Esta API permite criar, ler, atualizar e excluir tarefas.
springdoc.api-docs.version=v1.0.0
springdoc.swagger-ui.path=/swagger-ui.html

```

> Observações Importantes:
> 
> - Nem todas as propriedades de contato ou licença têm suporte direto via `application.properties`. Campos mais avançados (ex.: `contact.email`, `license.url`) ainda exigem bean ou anotações.
> - O uso de propriedades é mais indicado para configurações gerais (caminho do Swagger UI, rotas customizadas, desabilitar endpoints, etc.).
> - Sempre verifique a versão do SpringDoc para saber as chaves suportadas.

---

## Cenários de Restrição ou Não Aplicação

1. **Projetos Legados com Springfox**
    - Se a aplicação já estiver documentada com **Springfox Swagger 2** e a migração para SpringDoc for complexa, talvez não faça sentido reconfigurar o `info` imediatamente.
    - Springfox está sendo gradativamente descontinuado em prol do OpenAPI 3.x.
2. **APIs Internas (Intranet) sem Necessidade de Documentação Pública**
    - Quando a API é consumida apenas por serviços internos e não há equipe externa para consumir essa documentação, pode-se optar por não expor o Swagger UI em produção ou até não preencher metadados completos.
    - Em alguns cenários restritos de segurança, a documentação interativa pode ficar desabilitada (por exemplo, em ambientes de produção).
3. **APIs Simples/Ad-Hoc**
    - Para pequenos protótipos ou POCs (Proof of Concept) muito pontuais, pode-se pular a definição de um `info` completo e usar as configurações mínimas oferecidas pelo SpringDoc.
    - Nesses casos, a documentação pode se limitar à geração automática dos endpoints sem informações adicionais de contato/licença.
4. **Ambientes com Restrições de Dependências**
    - Se por políticas organizacionais for proibido adicionar dependências externas (além de Spring Boot “core”), pode ser inviável usar o SpringDoc. Nesse cenário, a equipe pode optar por gerar documentação manualmente ou via outra ferramenta interna.

---

## Componentes-Chave Associados

1. **Anotações OpenAPI (pacote `io.swagger.v3.oas.annotations`)**
    - `@OpenAPIDefinition`: Ponto central para definir metadados gerais.
    - `@Info`: Sub-anotação para prover título, descrição, versão e outros.
    - `@Contact`: Define nome, e-mail e URL de contato (usado dentro de `@Info`).
    - `@License`: Nome e URL da licença.
    - **Outras anotações correlatas** (não específicas ao **Info**, mas úteis):
        - `@Tag`, `@Operation`, `@Parameter`, `@Schema` etc.
2. **Classes de Domínio do OpenAPI (pacote `io.swagger.v3.oas.models`)**
    - `OpenAPI`: Classe raiz do modelo; pela qual você constrói programaticamente toda a especificação.
    - `Info`: Modelo que contém informações gerais (correspondente ao `info` no YAML).
    - `Contact`, `License`, `Server`, `SecurityScheme`: Modelos para cada seção específica.
3. **Endpoints Gerados pelo SpringDoc**
    - `/v3/api-docs` – Retorna JSON da especificação OpenAPI 3.x.
    - `/v3/api-docs.yaml` (optional) – Retorna YAML da especificação (dependendo de configuração).
    - `/swagger-ui.html` ou `/swagger-ui/index.html` – Interface web interativa para navegar na API.
    - **Outros endpoints auxiliares**:
        - `/swagger-config` – Configurações do Swagger UI em JSON.
        - `/webjars/**` – Recursos estáticos (JavaScript, CSS) necessários para o Swagger UI.
4. **Classes de Configuração Spring**
    - Geralmente, criam-se classes com `@Configuration` e, dentro delas, definem-se beans de `OpenAPI` ou anotações `@OpenAPIDefinition`.
    - Eventualmente, há necessidade de customizar a configuração do Swagger UI (por exemplo, trocar o tema, adicionar cabeçalhos predefinidos, etc.).

---

## Melhores Práticas e Padrões de Uso

1. **Centralizar a Definição de Metadados**
    - Crie uma única classe de configuração (ex.: `OpenApiConfig`) responsável por todo o `@OpenAPIDefinition` ou bean `OpenAPI`.
    - Evita inconsistências e duplicação de metadados.
2. **Versionamento Semântico (SemVer)**
    - Utilize versões no formato semântico (`MAJOR.MINOR.PATCH`), por exemplo, `1.2.3`.
    - Atualize o campo `version` na anotação `@Info` ou no bean `OpenAPI` a cada alteração relevante no contrato de API.
    - Documente breaking changes (ex.: endpoints removidos) para facilitar migração de clientes.
3. **Manter o `description` Objetivo e Atualizado**
    - Descreva sucintamente o propósito geral da API.
    - Se houver contexto organizacional ou uso específico (ex.: módulo financeiro, módulo de usuários), deixe claro.
    - Evite descrições genéricas demais; prefira anotar endpoints individualmente com `@Operation` e `@Tag` para maiores detalhes.
4. **Dados de Contato e Licença**
    - Preencha `contact` com informações de suporte ou e-mail de desenvolvedor/responsável. Isso facilita comunicação de quem consome a API.
    - Se houver licença aberta (ex.: MIT, Apache 2.0), inclua `license.name` e `license.url`. Caso seja interna (proprietária), deixe claro no `name` e vincule à Política Interna.
5. **Documentar Termos de Serviço (quando aplicável)**
    - Em APIs públicas (especialmente pagas ou de terceiros), defina `termsOfService` apontando para documento com regras de uso.
    - Ajuda a evitar problemas legais e garante que consumidores saibam as condições de uso.
6. **Externalizar Configurações por Ambiente**
    - Se tiver diferentes ambientes (dev, homol, prod), pense em usar profiles Spring (`application-dev.yml`, etc.) para mudar a `version` ou `description`.
    - Exemplo:
        
        ```yaml
        # application-dev.yml
        springdoc:
          api-docs:
            version: "1.0.0-SNAPSHOT"
            description: "Ambiente de desenvolvimento"
        
        ```
        
    - Em produção (`application-prod.yml`), ajuste para `version: 1.0.0` e `description: "Produção"`.
7. **Habilitar/Desabilitar Swagger UI em Produção**
    - Por padrão, o Swagger UI fica disponível em todas as fases. Em produções mais restritas, é recomendável desativá-lo (usar propriedade: `springdoc.api-docs.enabled=false` ou condicionar via profile).
    - Assim, você evita expor detalhes sensíveis sobre endpoints.
8. **Utilizar `@Tag` e `@Operation` para Agrupar Endpoints Relacionados**
    - Embora este tópico ultrapasse a seção **Info**, vale a pena mencionar que um projeto bem documentado não se limita ao `info`:
        - `@Tag(name = "Usuários", description = "Operações relacionadas a usuários")`
        - `@Operation(summary = "Cria novo usuário", description = "Endpoint para registrar um usuário no sistema")`
    - A combinação de metadados gerais (no `info`) com anotações detalhadas em classes/controller resulta na documentação mais completa.

---

## Exemplo Prático Completo

A seguir, um passo a passo para criar um micro-projeto **Spring Boot** simples que documenta a seção **Info** via SpringDoc.

> Premissas:
> 
> - JDK 17+
> - Spring Boot 3.x
> - Maven

---

### 1. Estrutura do Projeto

```
meu-projeto-swagger/
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com
        │       └── exemplo
        │           ├── DemoApplication.java
        │           └── config
        │               └── OpenApiConfig.java
        └── resources
            └── application.yml

```

---

### 2. `pom.xml`

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.exemplo</groupId>
  <artifactId>meu-projeto-swagger</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <properties>
    <java.version>17</java.version>
    <spring.boot.version>3.1.2</spring.boot.version> <!-- Exemplo de versão -->
    <springdoc.version>2.1.0</springdoc.version>
  </properties>

  <dependencies>
    <!-- Dependência Spring Boot Starter Web -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <version>${spring.boot.version}</version>
    </dependency>

    <!-- SpringDoc OpenAPI + Swagger UI -->
    <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
      <version>${springdoc.version}</version>
    </dependency>

    <!-- (Opcional) Lombok para reduzir boilerplate -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <scope>provided</scope>
    </dependency>

    <!-- (Opcional) Spring Boot Starter Test -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <version>${spring.boot.version}</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <!-- Plugin do Spring Boot -->
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <version>${spring.boot.version}</version>
      </plugin>
    </plugins>
  </build>
</project>

```

---

### 3. `application.yml`

```yaml
server:
  port: 8080

# Configuração do SpringDoc (opcional para preencher campos mínimos)
springdoc:
  api-docs:
    title: "API de Gerenciamento de Tarefas - Meu Projeto"
    description: "Esta API expõe endpoints para CRUD de tarefas."
    version: "1.0.0"
  swagger-ui:
    path: /swagger-ui.html

```

> Nota: No exemplo acima, definimos título, descrição e versão via application.yml.
> 
> 
> Campos como contact e license deverão ser configurados via anotação ou bean em Java.
> 

---

### 4. Classe Principal da Aplicação (`DemoApplication.java`)

```java
package com.exemplo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}

```

---

### 5. Configuração do OpenAPI (`OpenApiConfig.java`)

Opcionalmente, definimos o bloco `Info` completo aqui:

```java
package com.exemplo.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "API de Gerenciamento de Tarefas",
        version = "1.0.0",
        description = """
            API REST para gerenciar tarefas.
            <p>
            - Permite operações de criação, leitura, atualização e exclusão (CRUD).
            - Retorna dados em JSON.
            """,
        termsOfService = "https://meusite.com/terms",
        contact = @Contact(
            name = "Equipe de API",
            email = "api-suporte@meusite.com",
            url = "https://meusite.com/contato"
        ),
        license = @License(
            name = "Apache 2.0",
            url = "http://www.apache.org/licenses/LICENSE-2.0.html"
        )
    )
)
public class OpenApiConfig {
    // A anotação já define o Info; nenhum método adicional é necessário aqui.
}

```

> Comentários:
> 
> - O `@OpenAPIDefinition` “injeta” esses dados dentro da especificação.
> - Há suporte a texto multilinha no `description` (desde Java 15, com Text Blocks), o que facilita formatações mais ricas.

---

### 6. Exemplo de um Controller Simples

Para ilustrar que o Swagger documenta endpoints, criemos um Controller:

```java
package com.exemplo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    private final Map<Long, String> banco = new HashMap<>();
    private long contador = 1L;

    @GetMapping
    public ResponseEntity<List<String>> listar() {
        return ResponseEntity.ok(new ArrayList<>(banco.values()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> buscar(@PathVariable Long id) {
        String tarefa = banco.get(id);
        if (tarefa == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tarefa);
    }

    @PostMapping
    public ResponseEntity<String> criar(@RequestBody String descricao) {
        banco.put(contador, descricao);
        contador++;
        return ResponseEntity.ok("Tarefa criada com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizar(@PathVariable Long id, @RequestBody String novaDescricao) {
        if (!banco.containsKey(id)) {
            return ResponseEntity.notFound().build();
        }
        banco.put(id, novaDescricao);
        return ResponseEntity.ok("Tarefa atualizada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        banco.remove(id);
        return ResponseEntity.noContent().build();
    }
}

```

> Resultado Esperado:
> 
> - Após subir a aplicação (`mvn spring-boot:run`), acesse:
>     - **Swagger UI:** `http://localhost:8080/swagger-ui.html`
>     - **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`
>     - **OpenAPI YAML (se disponível):** `http://localhost:8080/v3/api-docs.yaml`

No Swagger UI, será exibido no topo:

- **Título**: “API de Gerenciamento de Tarefas”
- **Descrição**: Texto completo com formatação (conforme definimos no `@Info`).
- **Versão**: “1.0.0”
- **Contatos** e **licença** aparecem como links clicáveis no canto.

---

## Sugestões para Aprofundamento

1. **Comparar SpringDoc x Springfox**
    - Apesar do SpringDoc ser o “sucessor natural” do Springfox, entender as diferenças ajuda em projetos legados.
    - Documentações oficiais:
        - SpringDoc: [https://springdoc.org/](https://springdoc.org/)
        - Springfox: [https://springfox.github.io/springfox/](https://springfox.github.io/springfox/)
2. **Tags, Operation e Componentização Avançada**
    - Explore como agrupar endpoints usando `@Tag`, detalhar métodos com `@Operation`, personalizar parâmetros e esquemas.
    - Veja padrões de “versionamento de API” (ex.: path `/v1/...`, `/v2/...`).
3. **Configurações de Segurança e Schemas**
    - Aprenda a adicionar **SecuritySchemes** (JWT, OAuth2) para proteger endpoints e exibir campos de “autorizar” no Swagger UI.
    - Referência:
        
        ```java
        @Bean
        public OpenAPI customOpenAPI() {
            return new OpenAPI()
                .components(new Components()
                    .addSecuritySchemes("bearerAuth",
                        new SecurityScheme()
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")
                    )
                )
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .info(new Info() /* ... */);
        }
        
        ```
        
4. **Documentar Respostas e Exceções**
    - Use `@ApiResponse` e `@ApiResponses` para descrever cenários de resposta (200, 400, 404, 500) de cada endpoint.
    - Ajuda consumidores a saber que tipo de payload ou mensagem ocorrerá em cada situação.
5. **Customização do Swagger UI**
    - É possível alterar o tema, adicionar logotipo, modificar layout e até inserir instruções adicionais no UI.
    - Consulte a documentação oficial do Swagger UI ([https://swagger.io/docs/open-source-tools/swagger-ui/customization/](https://swagger.io/docs/open-source-tools/swagger-ui/customization/)).
6. **Publicação Automática em Repositórios Externos**
    - Ferramentas como **ReDoc**, **SwaggerHub** ou pipelines CI/CD podem consumir o JSON gerado e publicar um site estático de documentação a cada nova versão.
    - Exemplos: GitHub Pages, GitLab Pages, AWS S3 + CloudFront.

---

### Resumo Final

- A seção **Info** de uma API OpenAPI (Swagger) reúne metadados essenciais (título, descrição, versão, contato, licença).
- No **SpringDoc**, é possível configurar o **Info** por meio de anotações (`@OpenAPIDefinition` + `@Info`) ou programaticamente (Bean `OpenAPI`).
- Para definições básicas (title, description, version), há suporte parcial a `application.properties`/`application.yml`, mas campos mais complexos (contact, license) exigem código Java.
- Siga boas práticas: versionamento semântico, manter informações atualizadas, desabilitar Swagger em produção se necessário e agrupar endpoints com tags.
- A documentação gerada automaticamente agiliza a adoção da API pelos consumidores e serve como contrato vivo entre equipes de desenvolvimento.

Com isso, você já possui uma base sólida para entender e configurar o **Info** de sua API usando **SpringDoc** em **Spring Boot** com Java. Se precisar de exemplos avançados (configurações de segurança, tags, respostas customizadas etc.), consulte a seção “Sugestões para Aprofundamento” e a [documentação oficial do SpringDoc](https://springdoc.org/).