# Agrupamento de Endpoints com Tags (@Tag)

---

## 1. Introdução

O SpringDoc (OpenAPI) é uma biblioteca que integra o Spring Boot para gerar documentação interativa e padronizada (no formato OpenAPI 3) de uma API REST-ful. Esse recurso facilita a visualização e o teste de endpoints a partir de uma interface Swagger UI, que pode ser acessada diretamente no navegador. Um dos pontos centrais para organizar essa documentação é o agrupamento de endpoints por “tags” (etiquetas) — o que torna a leitura mais intuitiva e divide rotas em seções temáticas (por exemplo: “Usuários”, “Produtos”, “Pedidos” etc.). A anotação `@Tag` e, quando necessário, `@Operation(tags = { ... })` permitem definir esse agrupamento de forma simples.

Este guia apresenta uma visão geral concisa sobre o uso de `@Tag` via SpringDoc e, em seguida, aprofunda-se nos detalhes — desde conceitos fundamentais e sintaxe até um exemplo prático completo de projeto.

---

## 2. Sumário

1. [Conceitos Fundamentais](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)
2. [Sintaxe Detalhada e Uso Prático](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)
    1. [Dependências e Configuração Inicial](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)
    2. [Anotação `@Tag` e `@Operation`](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)
    3. [Exemplo de Controller com `@Tag`](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)
    4. [Customização de Bean OpenAPI (Opcional)](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)
3. [Cenários de Restrição ou Não Aplicação](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)
4. [Componentes Chave Associados](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)
5. [Melhores Práticas e Padrões de Uso](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)
6. [Exemplo Prático Completo](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)
7. [Sugestões para Aprofundamento](Agrupamento%20de%20Endpoints%20com%20Tags%20(@Tag)%2020a9462188c680478ffdfc5958a34df2.md)

---

## 3. Conceitos Fundamentais

- **OpenAPI**: Padrão amplamente adotado para descrever APIs REST, permitindo representar endpoints, parâmetros, esquemas de dados, respostas e mais.
- **Swagger UI**: Interface interativa que consome um documento OpenAPI e apresenta documentação navegável, permitindo testes “in-browser”.
- **SpringDoc**: Implementação que gera automaticamente o documento OpenAPI baseado nas anotações do Spring MVC/Spring Web.
- **Tag**: Campo no documento OpenAPI usado para agrupar endpoints logicamente sob um mesmo cabeçalho no Swagger UI. Isso melhora a organização, separando endpoints por recursos ou responsabilidades.
- **Propósito do Agrupamento**: Facilitar a navegação, especialmente em APIs grandes, mostrando seções como “Cliente”, “Pedido”, “Autenticação” etc.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Dependências e Configuração Inicial

Para habilitar o SpringDoc em um projeto Spring Boot com Maven, adicione ao `pom.xml`:

```xml
<dependencies>
    <!-- SpringDoc OpenAPI UI (Swagger UI) -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-ui</artifactId>
        <version>1.7.0</version> <!-- Verifique a versão mais recente disponível -->
    </dependency>

    <!-- (Opcional) Para geração de JSON/XML se necessário -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-webmvc-core</artifactId>
        <version>1.7.0</version>
    </dependency>

    <!-- Dependências Spring Boot típicas -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

```

Para Gradle (Groovy DSL), ficaria algo como:

```groovy
dependencies {
    implementation 'org.springdoc:springdoc-openapi-ui:1.7.0'
    implementation 'org.springframework.boot:spring-boot-starter-web'
}

```

Ao executar a aplicação, o SpringDoc automaticamente:

1. Varre todos os controllers (`@RestController` ou `@Controller`) e endpoints mapeados (`@GetMapping`, `@PostMapping` etc.).
2. Gera um documento OpenAPI (por padrão em `/v3/api-docs`).
3. Disponibiliza o Swagger UI em `http://localhost:8080/swagger-ui.html` (ou `http://localhost:8080/swagger-ui/index.html`, dependendo da versão).

---

### 4.2 Anotação `@Tag` e `@Operation`

### 4.2.1 `@Tag`

- **Aplicação**: Colocar no nível de classe (controller) para atribuir um “rótulo” padrão a todos os endpoints daquele controller.
- **Atributos principais**:
    - `name` (String): Nome visível da tag na interface Swagger.
    - `description` (String, opcional): Descrição complementar da tag, exibida no topo da seção.

**Exemplo de uso em um controller:**

```java
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Cliente", description = "Operações relacionadas a clientes")
@RestController
public class ClienteController {

    @GetMapping("/clientes")
    public List<Cliente> listarClientes() {
        // ...
    }

    @GetMapping("/clientes/{id}")
    public Cliente obterCliente(@PathVariable Long id) {
        // ...
    }
}

```

No exemplo acima:

- Todos os endpoints mapeados em `ClienteController` aparecerão agrupados sob a seção “Cliente” no Swagger UI.
- A descrição “Operações relacionadas a clientes” será exibida abaixo do título “Cliente”.

### 4.2.2 `@Operation(tags = { ... })`

- **Aplicação**: Útil quando se quer personalizar ou adicionar outra tag em nível de método, permitindo que um endpoint específico seja listado sob tags diferentes ou sob uma tag própria.
- **Atributos principais**:
    - `summary` (String, opcional): Breve resumo do endpoint.
    - `description` (String, opcional): Descrição mais detalhada do que o endpoint faz.
    - `tags` (Array de Strings, opcional): Lista de tags que esse método deve usar.

**Exemplo de uso em métodos que compartilham tags diferentes:**

```java
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Pedido", description = "Operações relacionadas a pedidos")
@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @GetMapping
    @Operation(summary = "Listar todos os pedidos", tags = { "Pedido", "Consulta" })
    public List<Pedido> listarPedidos() {
        // ...
    }

    @PostMapping
    @Operation(summary = "Criar um novo pedido", tags = { "Pedido", "Gravacao" })
    public Pedido criarPedido(@RequestBody PedidoDto dto) {
        // ...
    }
}

```

Nesse caso:

- O Swagger UI mostrará uma seção “Pedido” para os endpoints deste controller.
- Dentro da seção “Pedido”, o método `listarPedidos` também ficará associado à tag “Consulta” (aparecendo concomitantemente nas duas seções, se desejado).
- O método `criarPedido` ficará associado às tags “Pedido” e “Gravacao”.

---

### 4.3 Exemplo de Controller com `@Tag`

Abaixo, um exemplo completo de como definir dois controllers distintos, cada um agrupado em sua própria tag:

```java
package com.exemplo.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// -------------------- CONTROLLER DE USUÁRIOS --------------------
@Tag(name = "Usuários", description = "Gerencia operações CRUD de usuários")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @GetMapping
    @Operation(summary = "Listar todos os usuários")
    public ResponseEntity<List<Usuario>> listarTodos() {
        // Lógica para listar
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter um usuário por ID")
    public ResponseEntity<Usuario> obterPorId(@PathVariable Long id) {
        // Lógica para obter por ID
    }

    @PostMapping
    @Operation(summary = "Criar um novo usuário")
    public ResponseEntity<Usuario> criar(@RequestBody UsuarioDto dto) {
        // Lógica para criação
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um usuário existente")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody UsuarioDto dto) {
        // Lógica para atualização
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir um usuário")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        // Lógica para exclusão
    }
}

// -------------------- CONTROLLER DE PRODUTOS --------------------
@Tag(name = "Produtos", description = "Gerencia operações CRUD de produtos")
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @GetMapping
    @Operation(summary = "Listar todos os produtos")
    public ResponseEntity<List<Produto>> listarTodos() {
        // Lógica para listar
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter um produto por ID")
    public ResponseEntity<Produto> obterPorId(@PathVariable Long id) {
        // Lógica para obter por ID
    }

    @PostMapping
    @Operation(summary = "Criar um novo produto")
    public ResponseEntity<Produto> criar(@RequestBody ProdutoDto dto) {
        // Lógica para criação
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um produto existente")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody ProdutoDto dto) {
        // Lógica para atualização
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir um produto")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        // Lógica para exclusão
    }
}

```

**O que acontece no Swagger UI**:

- Haverá duas seções principais: **Usuários** e **Produtos**, cada uma com sua descrição.
- Dentro de cada seção, aparecerão todos os endpoints daquele controller, exibindo o método HTTP, a rota, resumo (`summary`) e esquemas de requisição/response.

---

### 4.4 Customização de Bean OpenAPI (Opcional)

Caso seja necessário alterar informações gerais do documento (por exemplo, título genérico, versão, descrição global ou definir tags separadamente), podemos criar um bean `OpenAPI`:

```java
package com.exemplo.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringDocConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API de Exemplo com SpringDoc")
                .version("v1.0")
                .description("Documentação gerada automaticamente via SpringDoc (OpenAPI 3)"))
            .components(new Components())
            .addTagsItem(new Tag().name("Usuários").description("Operações relacionadas a usuários"))
            .addTagsItem(new Tag().name("Produtos").description("Operações relacionadas a produtos"))
            .addTagsItem(new Tag().name("Pedidos").description("Operações relacionadas a pedidos"));
    }
}

```

- Aqui, definimos globalmente as tags que poderão ser usadas em controllers/métodos.
- O Swagger UI exibirá essas tags exatamente na ordem em que forem adicionadas (`.addTagsItem(...)`).
- Se um endpoint for anotado com `@Tag(name = "Produtos")`, o Swagger UI associará o endpoint à tag previamente definida neste bean.

---

## 5. Cenários de Restrição ou Não Aplicação

1. **APIs Pequenas (Poucos Endpoints)**
    - Se o projeto tiver poucos endpoints (por exemplo, < 5 rotas), pode não haver necessidade de agrupar em tags — tudo aparece em uma única lista organizada por URL.
2. **Documentação Externa/Legada**
    - Se a API já estiver documentada por outro meio (por exemplo, um arquivo YAML OpenAPI manual) ou se for consumida por ferramenta diferente do SpringDoc, a anotação `@Tag` do SpringDoc não surtirá efeito.
3. **Uso de Outras Ferramentas de Documentação**
    - Alguns projetos usam soluções como **Swagger-UI CLI** a partir de arquivos YAML/JSON externos. Nesse caso, a organização por tags deve ser feita manualmente no arquivo, sem a necessidade de anotações Java.
4. **Endpoints Dinâmicos ou Gerados em Tempo de Execução**
    - Se os endpoints são registrados dinamicamente em tempo de execução (plugins, módulos carregados dinamicamente), a varredura pelo SpringDoc pode não capturar `@Tag` adequadamente, exigindo configuração adicional.

---

## 6. Componentes Chave Associados

### 6.1 Dependência `springdoc-openapi-ui`

- **Artefato**: `org.springdoc:springdoc-openapi-ui`
    - Fornece classes responsáveis por gerar o JSON OpenAPI e iniciar o Swagger UI.
    - Inclui automaticamente as rotas `/v3/api-docs` e `/swagger-ui.html`.

### 6.2 Anotações Principais

1. **`@Tag`** (`io.swagger.v3.oas.annotations.tags.Tag`)
    - Indica qual seção (tag) o controller ou método pertence.
    - Atributos:
        - `name` (String) – nome exibido no Swagger UI.
        - `description` (String) – texto de apoio exibido abaixo do nome.
        - `externalDocs` (Annotation opcional) – para documentação externa associada.
2. **`@Operation`** (`io.swagger.v3.oas.annotations.Operation`)
    - Descreve detalhes do endpoint específico (summary, description, tags, parâmetros, respostas, etc.).
    - Atributos importantes:
        - `summary` (String) – resumo curto do que o método faz.
        - `description` (String) – explicação mais longa sobre o endpoint.
        - `tags` (String\[]) – lista de tags (nomes) para associar. Se omitted, herda a tag definida no controller (se houver).
3. **Outras anotações comumente usadas**
    - `@Parameter` – para descrever parâmetros explicitamente.
    - `@ApiResponse` – para detalhar diferentes respostas e códigos HTTP.
    - `@Schema` – para documentar propriedades de modelos (DTOs, entidades).

### 6.3 Classes/Interfaces de Configuração

1. **`OpenAPI`** (`io.swagger.v3.oas.models.OpenAPI`)
    - Classe raiz que representa o documento OpenAPI.
    - Permite configurar `info`, `servers`, `components`, `tags` globalmente.
2. **`Tag`** (`io.swagger.v3.oas.models.tags.Tag`)
    - Classe usada dentro de `OpenAPI` (no bean de configuração) para pré-definir tags.
    - Exemplo:
        
        ```java
        .addTagsItem(new Tag().name("Usuários").description("Operações relacionadas a usuários"))
        
        ```
        

---

## 7. Melhores Práticas e Padrões de Uso

1. **Escolha de Nomes Consistentes**
    - Defina nomes sucintos e claros para as tags (por exemplo, “Usuários”, “Produtos”, “Pedidos”).
    - Evite variações (“Usuário” vs “Usuários”) para não criar seções duplicadas.
2. **Descreva a Tag no Nível de Controller**
    - Sempre que um controller tiver responsabilidade única, use `@Tag(name = "...")` na classe.
    - Isso evita repetição de `tags` em cada método e garante uniformidade.
3. **Adicionar Descrição À Tag**
    - Incluir um breve texto explicando o que engloba aquela tag melhora a compreensão quando muitas seções aparecem.
4. **Use `@Operation(tags = { ... })` para Agrupar Métodos Específicos**
    - Se houver um endpoint que logically pertence a outro domínio, chame `@Operation(tags = { "OutraTag" })` no método.
    - Isso permite “re-alocar” ou “duplicar” um endpoint em outra seção, se necessário.
5. **Predefinição de Tags no Bean OpenAPI**
    - Defina tags globalmente em um bean `OpenAPI` para controlar a ordem de exibição e forçar que somente tags existentes sejam usadas.
    - Evita entradas erradas ou não desejadas no Swagger UI.
6. **Evite Muitas Tags para um Único Método**
    - Evite listar tags em excesso em `@Operation(tags = { ... })`, pois pode poluir o layout do UI.
    - Se um endpoint realmente “cabe” em dois domínios junto, utilize com moderação.
7. **Documente Parâmetros Cruciais e Respostas**
    - Além de agrupar por tags, descreva parâmetros importantes com `@Parameter` e possíveis respostas com `@ApiResponse`.
    - Mantém a usabilidade: ao clicar no endpoint no Swagger UI, o usuário vê exemplos e descrições completas.

---

## 8. Exemplo Prático Completo

A seguir, apresentamos um mini-projeto Spring Boot que ilustra:

- Configuração do SpringDoc.
- Definição de tags no bean `OpenAPI`.
- Dois controllers agrupados em tags diferentes.

### 8.1 Estrutura Geral do Projeto

```
src
├── main
│   ├── java
│   │   └── com.exemplo
│   │       ├── Application.java
│   │       ├── config
│   │       │   └── SpringDocConfig.java
│   │       ├── controller
│   │       │   ├── ClienteController.java
│   │       │   └── PedidoController.java
│   │       ├── dto
│   │       │   ├── ClienteDto.java
│   │       │   └── PedidoDto.java
│   │       └── model
│   │           ├── Cliente.java
│   │           └── Pedido.java
│   └── resources
│       └── application.properties
└── pom.xml

```

### 8.2 `pom.xml` (dependências mínimas)

```xml
<project xmlns="<http://maven.apache.org/POM/4.0.0>" ...>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.exemplo</groupId>
    <artifactId>springdoc-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>SpringDoc Demo</name>
    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- SpringDoc OpenAPI UI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-ui</artifactId>
            <version>1.7.0</version>
        </dependency>

        <!-- (Opcional) Lombok para simplificar DTOs/Models -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.24</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>

```

### 8.3 Classe Principal `Application.java`

```java
package com.exemplo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

```

---

### 8.4 Classe de Configuração do SpringDoc (`SpringDocConfig.java`)

```java
package com.exemplo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringDocConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API de Gerenciamento de Clientes e Pedidos")
                .version("v1.0")
                .description("Documentação gerada automaticamente via SpringDoc (OpenAPI 3)"))
            .addTagsItem(new Tag()
                .name("Cliente")
                .description("Operações CRUD para clientes"))
            .addTagsItem(new Tag()
                .name("Pedido")
                .description("Operações CRUD para pedidos"));
    }
}

```

- **O que fazemos aqui**:
    1. Definimos o título, versão e descrição gerais da API.
    2. Pré-cadastramos duas tags: “Cliente” e “Pedido”, cada uma com descrição.
    3. O Swagger UI exibirá essas tags nessa ordem, mesmo que o controller use `@Tag`.

---

### 8.5 Model (Entidades/DTOs)

```java
package com.exemplo.model;

public class Cliente {
    private Long id;
    private String nome;
    private String email;
    // getters e setters...
}

```

```java
package com.exemplo.model;

public class Pedido {
    private Long id;
    private Long idCliente;
    private Double valorTotal;
    // getters e setters...
}

```

```java
package com.exemplo.dto;

// DTO de Cliente para recepção de dados
public class ClienteDto {
    private String nome;
    private String email;
    // getters e setters...
}

```

```java
package com.exemplo.dto;

// DTO de Pedido para recepção de dados
public class PedidoDto {
    private Long idCliente;
    private Double valorTotal;
    // getters e setters...
}

```

(*Você pode usar Lombok para gerar automaticamente getters/setters, caso queira.*)

---

### 8.6 Controller de Clientes (`ClienteController.java`)

```java
package com.exemplo.controller;

import com.exemplo.dto.ClienteDto;
import com.exemplo.model.Cliente;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "Cliente", description = "Operações CRUD para clientes")
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final List<Cliente> bancoSimulado = new ArrayList<>();

    @GetMapping
    @Operation(summary = "Listar todos os clientes")
    public ResponseEntity<List<Cliente>> listarTodos() {
        return ResponseEntity.ok(bancoSimulado);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter um cliente por ID")
    public ResponseEntity<Cliente> obterPorId(@PathVariable Long id) {
        return bancoSimulado.stream()
            .filter(c -> c.getId().equals(id))
            .findFirst()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Criar um novo cliente")
    public ResponseEntity<Cliente> criar(@RequestBody ClienteDto dto) {
        Cliente novo = new Cliente();
        novo.setId((long) (bancoSimulado.size() + 1));
        novo.setNome(dto.getNome());
        novo.setEmail(dto.getEmail());
        bancoSimulado.add(novo);
        return ResponseEntity.ok(novo);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um cliente existente")
    public ResponseEntity<Cliente> atualizar(@PathVariable Long id, @RequestBody ClienteDto dto) {
        for (Cliente c : bancoSimulado) {
            if (c.getId().equals(id)) {
                c.setNome(dto.getNome());
                c.setEmail(dto.getEmail());
                return ResponseEntity.ok(c);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir um cliente")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        boolean removed = bancoSimulado.removeIf(c -> c.getId().equals(id));
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

```

- **Comentários sobre `@Tag` e `@Operation`**:
    - A anotação `@Tag(name = "Cliente", description = "...")` define que este controller pertence à seção “Cliente”.
    - Cada método recebe `@Operation(summary = "...")`, que é exibido como descrição breve na listagem de endpoints.

---

### 8.7 Controller de Pedidos (`PedidoController.java`)

```java
package com.exemplo.controller;

import com.exemplo.dto.PedidoDto;
import com.exemplo.model.Pedido;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "Pedido", description = "Operações CRUD para pedidos")
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final List<Pedido> bancoSimulado = new ArrayList<>();

    @GetMapping
    @Operation(summary = "Listar todos os pedidos")
    public ResponseEntity<List<Pedido>> listarTodos() {
        return ResponseEntity.ok(bancoSimulado);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter um pedido por ID")
    public ResponseEntity<Pedido> obterPorId(@PathVariable Long id) {
        return bancoSimulado.stream()
            .filter(p -> p.getId().equals(id))
            .findFirst()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Criar um novo pedido")
    public ResponseEntity<Pedido> criar(@RequestBody PedidoDto dto) {
        Pedido novo = new Pedido();
        novo.setId((long) (bancoSimulado.size() + 1));
        novo.setIdCliente(dto.getIdCliente());
        novo.setValorTotal(dto.getValorTotal());
        bancoSimulado.add(novo);
        return ResponseEntity.ok(novo);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um pedido existente")
    public ResponseEntity<Pedido> atualizar(@PathVariable Long id, @RequestBody PedidoDto dto) {
        for (Pedido p : bancoSimulado) {
            if (p.getId().equals(id)) {
                p.setIdCliente(dto.getIdCliente());
                p.setValorTotal(dto.getValorTotal());
                return ResponseEntity.ok(p);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir um pedido")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        boolean removed = bancoSimulado.removeIf(p -> p.getId().equals(id));
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

```

---

### 8.8 `application.properties` (configuração mínima)

```
# Pode especificar porta ou deixar padrão (8080)
server.port=8080

# (Opcional) Desabilitar autenticação do Swagger UI (se for ambiente de produção)
# springdoc.api-docs.enabled=true
# springdoc.swagger-ui.enabled=true

```

---

### 8.9 Testando no Swagger UI

1. **Executar a aplicação**:
    
    ```
    mvn spring-boot:run
    
    ```
    
2. **Navegar até o Swagger UI**:
    - Acesse: `http://localhost:8080/swagger-ui.html` (ou, em algumas versões, `http://localhost:8080/swagger-ui/index.html`).
3. **Visualizar as seções**:
    - Você verá, no menu lateral, duas seções principais:
        - **Cliente** – com todos os endpoints de `/api/clientes`.
        - **Pedido** – com todos os endpoints de `/api/pedidos`.
    - Cada seção terá o resumo (`summary`) de cada método, além de detalhes de parâmetros, schemas de request/response etc.

---

## 9. Cenários de Restrição ou Não Aplicação

- **APIs muito pequenas** (ex.: apenas 1 ou 2 endpoints): a organização por tags pode não trazer ganhos significativos e ainda adicionar complexidade desnecessária.
- **Documentação externa ou YAML/JSON standalone**: se a API já for descrita manualmente em arquivo `.yaml` ou `.json`, as anotações Java não são usadas; é preciso organizar o agrupamento de tags diretamente no documento OpenAPI.
- **Endpoints dinâmicos** (por frameworks ou plugins que registram rotas em tempo de execução): pode ser necessário complementar com configuração manual para garantir que as tags sejam aplicadas corretamente, caso a varredura automática não detecte anotações.
- **Projetos legados que usam Swagger 2 (springfox)**: SpringDoc requer migração para a especificação OpenAPI 3; a anotação `@Tag` não é reconhecida em springfox antigo.

---

## 10. Componentes Chave Associados

1. **Dependência `springdoc-openapi-ui`**
    - Gera automaticamente a rota `/v3/api-docs` e o Swagger UI hospedado em `/swagger-ui.html`.
2. **Anotação `@Tag`** (`io.swagger.v3.oas.annotations.tags.Tag`)
    - Atributos:
        - `name` – nome exibido da tag (string).
        - `description` – texto explicativo complementar.
        - `externalDocs` – para linkar documentação externa, se desejado.
3. **Anotação `@Operation`** (`io.swagger.v3.oas.annotations.Operation`)
    - Atributos principais:
        - `summary` – breve descrição do endpoint.
        - `description` – texto longo, formato Markdown permitido.
        - `tags` – lista de strings que indica quais tags (nomes) esse método deve usar.
        - `responses` – array de `@ApiResponse`, detalhando códigos HTTP esperados e descrições.
4. **Bean `OpenAPI`** (`io.swagger.v3.oas.models.OpenAPI`)
    - Permite configurar metadados globais (título, versão, descrição) e pré-cadastrar tags para controle de ordem e consistência.
5. **Classe `Tag` do OpenAPI Models** (`io.swagger.v3.oas.models.tags.Tag`)
    - Usada dentro do bean `OpenAPI` para definir `name`, `description` e `externalDocs` de cada tag.
6. **Outras anotações auxiliares**
    - `@Parameter`: define descrições de parâmetros (query, path, header etc.).
    - `@ApiResponse`: detalha cada possível resposta HTTP (códigos 200, 400, 404 etc.).
    - `@Schema`: anotações para customizar descrições de tipos de dados nos DTOs/modelos (por exemplo, definição de exemplo, tamanho mínimo/máximo etc.).

---

## 11. Melhores Práticas e Padrões de Uso

1. **Definição Única de Tags**
    - Sempre que possível, centralize o nome e descrição de tags num bean `OpenAPI`, evitando escrever várias vezes o mesmo nome em anotações.
    - Exemplo no bean:
        
        ```java
        @Bean
        public OpenAPI customOpenAPI() {
            return new OpenAPI()
                .info(new Info()
                    .title("Minha API")
                    .version("v1"))
                .addTagsItem(new Tag().name("Usuário").description("Gerencia operações de usuário"))
                .addTagsItem(new Tag().name("Ordem").description("Gerencia operações de ordem"));
        }
        
        ```
        
    - Nos controllers, basta referenciar o mesmo nome.
2. **Consistência de Convenções de Nome**
    - Defina se as tags serão no singular (“Usuário”) ou plural (“Usuários”). Mantenha o mesmo padrão em toda a API para evitar duplicatas no Swagger UI.
    - Prefira nomes autoexplicativos e curtos (“Pedido”, “Pagamento”, “Autenticação”).
3. **Agrupe Funcionalidades Relacionadas**
    - Cada controller deve lidar com um único “recurso” do modelo de domínio.
    - Se um método tratar de algo fora do escopo primário, considere movê-lo para outro controller ou criar uma tag específica.
4. **Use `@Operation(tags = { ... })` apenas quando necessário**
    - Evite anotar cada método com `tags` se o controller inteiro já usa `@Tag`; somente utilize `@Operation(tags = { ... })` para casos excepcionais (métodos compartilhados entre domínios).
5. **Documente Respostas e Parâmetros Relevantes**
    - Não basta apenas agrupar por tags; é recomendável usar `@ApiResponse` para cada código HTTP importante (200, 201, 400, 404, 500 etc.).
    - Use `@Parameter(description = "...")` para títulos ou descrições de parâmetros que não estejam óbvios pelo nome.
6. **Atualize a Documentação Junto com o Código**
    - Sempre que um endpoint é alterado (parâmetros, retorno, status), verifique se `summary`, `description`, `tags` e anotações de parâmetro/resposta estão coerentes.
    - Dessa forma, evita-se documentação obsoleta ou inconsistências entre código e UI.
7. **Mantenha o Swagger UI Desabilitado em Produção (Se For o Caso)**
    - Em ambientes de produção, pode ser aconselhável proteger ou desabilitar o acesso ao Swagger UI, garantindo que documentação interna não fique pública sem autenticação.
    - Utilizar propriedades como:
        
        ```
        springdoc.swagger-ui.enabled=false
        springdoc.api-docs.enabled=false
        
        ```
        
8. **Versionamento de API**
    - Se for usar versionamento (ex.: `/v1/clientes`, `/v2/clientes`), utilize tags separadas para cada versão ou inclua o número da versão no título da tag (ex.: “Cliente v1”, “Cliente v2”), para diferenciar na UI.

---

## 12. Sugestões para Aprofundamento

- **Documentação Oficial SpringDoc**
    - [springdoc.org](https://springdoc.org/) – contém exemplos avançados, configurações de segurança (OAuth2, JWT), internacionalização e customizações de UI.
- **OpenAPI 3 Specification**
    - [spec.openapis.org/oas/v3.1.0](https://spec.openapis.org/oas/v3.1.0) – definição completa do padrão, incluindo tags, componentes, links e callbacks.
- **Outras Anotações Úteis do SpringDoc**
    - `@SecurityRequirement` – para associar autenticação/autorizações a endpoints.
    - `@Parameter`, `@ApiResponse`, `@ApiResponses`, `@Schema` – para detalhar input/output de forma avançada.
- **Integração com Spring Security**
    - Para exibir botões de autenticação no Swagger UI, mapeie esquemas de segurança (JWT, OAuth2) no bean `OpenAPI`.
- **Plugins e Extensões**
    - **springdoc-openapi-kotlin** – para projetos em Kotlin.
    - **springdoc-openapi-starter-webmvc-ui** – starters simplificados em versões mais recentes.

---

> Resumo: O uso de @Tag via SpringDoc em um projeto Spring Boot com Java permite agrupar endpoints de forma clara e organizada no Swagger UI. A configuração parte de adicionar a dependência springdoc-openapi-ui, opcionalmente definir um bean OpenAPI para metadados e pré-cadastramento de tags, e anotar controllers (e métodos, quando necessário) com @Tag e @Operation. Seguindo boas práticas de nomeação, consistência e documentação complementar (parâmetros e respostas), obtém-se uma interface de documentação autoexplicativa e fácil de navegar.
> 

Espero que esse guia atenda às suas necessidades! Caso queira aprofundar-se em pontos específicos (por exemplo, autenticação, exemplos avançados de esquemas ou uso de SecurityRequirement), basta informar que podemos estender a discussão.