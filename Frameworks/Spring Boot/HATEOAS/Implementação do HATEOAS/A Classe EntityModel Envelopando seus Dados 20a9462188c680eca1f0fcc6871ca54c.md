# A Classe EntityModel: Envelopando seus Dados

## Introdução

O **Spring HATEOAS** (Hypermedia As The Engine Of Application State) é um módulo do Spring que facilita a construção de APIs REST que seguem o princípio HATEOAS. Em vez de simplesmente retornar dados, a API também fornece links que guiam o cliente sobre possíveis próximas ações, tornando o consumo mais intuitivo e autoexplicativo.

Neste contexto, a classe `EntityModel<T>` age como um “envelope” para seus dados, permitindo envolver uma entidade de domínio com metadados de links.

Este documento visa oferecer tanto uma **visão geral concisa** quanto uma **explicação detalhada e completa** sobre a utilização de `EntityModel` em aplicações Spring Boot com Java.

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Dependências Necessárias](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#depend%C3%AAncias-necess%C3%A1rias)
    2. [Configurando o Projeto](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#configurando-o-projeto)
    3. [Exemplo de Entidade e Repositório](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-de-entidade-e-reposit%C3%B3rio)
    4. [Usando `EntityModel` no Controller](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#usando-entitymodel-no-controller)
    5. [Variações e Personalizações](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#varia%C3%A7%C3%B5es-e-personaliza%C3%A7%C3%B5es)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes-Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    1. [Estrutura de Pastas](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#estrutura-de-pastas)
    2. [Código-Fonte Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#c%C3%B3digo-fonte-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **HATEOAS** (Hypermedia as the Engine of Application State):
    - Filosofia REST que defende que as respostas da API devem conter links que guiem o cliente sobre ações possíveis (por exemplo, “autenticar”, “editar recurso”, “deletar recurso”).
    - Permite desacoplar o cliente de rotas fixas; em vez disso, o cliente segue links descritos na resposta.
- **`EntityModel<T>`**:
    - Classe genérica que funciona como um “envelope” em torno de uma entidade de domínio (por exemplo, um objeto `Produto`).
    - Além de conter o objeto real (`T`), armazena uma lista de `Link`s (metadados de navegação).
    - Em outras versões do Spring HATEOAS, esta classe também era chamada de `Resource<T>`.
- **Por que usar `EntityModel`?**
    - Centraliza a inclusão de links junto aos dados.
    - Facilita a construção de respostas enriquecidas com navegação (por exemplo, “self”, “update”, “delete”).
    - Mantém o payload principal (dados) separado dos links, mas entregues juntos em uma mesma estrutura JSON.

---

## Sintaxe Detalhada e Uso Prático

### Dependências Necessárias

Para habilitar o Spring HATEOAS em um projeto Spring Boot, basta adicionar a dependência no `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-hateoas</artifactId>
</dependency>

```

Caso utilize Gradle, no `build.gradle`:

```groovy
implementation 'org.springframework.boot:spring-boot-starter-hateoas'

```

Essas dependências garantem que as classes como `EntityModel`, `Link` e `WebMvcLinkBuilder` estejam disponíveis.

### Configurando o Projeto

1. **Pacote de modelo**: conterá as entidades JPA.
2. **Pacote de repositório**: estenderá interfaces Spring Data JPA.
3. **Pacote de controller**: retornará `EntityModel<T>` ou coleções de `EntityModel<T>`.
4. **Assembler (opcional, mas recomendado)**: classe que encapsula a lógica de criação de `EntityModel`.

---

### Exemplo de Entidade e Repositório

```java
// src/main/java/com/exemplo/model/Produto.java
package com.exemplo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Double preco;

    // Construtores, getters e setters

    public Produto() { }

    public Produto(Long id, String nome, Double preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }
}

```

```java
// src/main/java/com/exemplo/repository/ProdutoRepository.java
package com.exemplo.repository;

import com.exemplo.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // métodos CRUD já são providos pelo JpaRepository
}

```

---

### Usando `EntityModel` no Controller

A maneira mais direta é retornar um `EntityModel<Produto>` em vez de apenas `Produto`.

Imagine um controlador simples que retorna um produto por ID:

```java
// src/main/java/com/exemplo/controller/ProdutoController.java
package com.exemplo.controller;

import com.exemplo.model.Produto;
import com.exemplo.repository.ProdutoRepository;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoRepository produtoRepository;

    public ProdutoController(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    // 1. Buscar todos os produtos como lista de EntityModel<Produto>
    @GetMapping
    public ResponseEntity<List<EntityModel<Produto>>> listarTodos() {
        List<EntityModel<Produto>> produtosComLinks =
            produtoRepository.findAll().stream()
                .map(produto -> toModel(produto))
                .collect(Collectors.toList());

        return ResponseEntity.ok(produtosComLinks);
    }

    // 2. Buscar um produto específico por ID
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Produto>> buscarPorId(@PathVariable Long id) {
        return produtoRepository.findById(id)
            .map(produto -> ResponseEntity.ok(toModel(produto)))
            .orElse(ResponseEntity.notFound().build());
    }

    // 3. Criar um novo produto
    @PostMapping
    public ResponseEntity<EntityModel<Produto>> criar(@RequestBody Produto produto) {
        Produto salvo = produtoRepository.save(produto);
        EntityModel<Produto> model = toModel(salvo);

        // Inclui cabeçalho "Location" apontando para o recurso criado
        return ResponseEntity
            .created(model.getRequiredLink("self").toUri())
            .body(model);
    }

    // 4. Atualizar um produto existente
    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Produto>> atualizar(
            @PathVariable Long id,
            @RequestBody Produto produtoAtualizado) {

        return produtoRepository.findById(id)
            .map(produtoExistente -> {
                produtoExistente.setNome(produtoAtualizado.getNome());
                produtoExistente.setPreco(produtoAtualizado.getPreco());
                Produto salvo = produtoRepository.save(produtoExistente);
                return ResponseEntity.ok(toModel(salvo));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // 5. Excluir um produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return produtoRepository.findById(id)
            .map(produto -> {
                produtoRepository.delete(produto);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Método auxiliar para criar o EntityModel<Produto> e adicionar links
    private EntityModel<Produto> toModel(Produto produto) {
        // Link "self" (aponta para GET /api/produtos/{id})
        Link selfLink = WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(ProdutoController.class)
                    .buscarPorId(produto.getId())
            ).withSelfRel();

        // Link "todos" (aponta para GET /api/produtos)
        Link allLink = WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(ProdutoController.class)
                    .listarTodos()
            ).withRel("todos");

        // Exemplo de link customizado: update
        Link updateLink = WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(ProdutoController.class)
                    .atualizar(produto.getId(), produto)
            ).withRel("update");

        return EntityModel.of(produto, selfLink, allLink, updateLink);
    }
}

```

**Comentários sobre o exemplo acima:**

- O método **`toModel(Produto produto)`** cria um `EntityModel<Produto>` contendo a entidade em si e uma lista de `Link`s:
    - **`selfRel`**: link “padrão” que aponta para o próprio recurso, facilitando ao cliente obter/atualizar/deletar esse recurso.
    - **`todos`**: link que aponta para a lista geral de produtos, informando ao cliente onde buscar todos os itens disponíveis.
    - **`update`**: ilustra a inclusão de um link para atualização. Você pode adicionar “delete”, “create”, etc., conforme necessário.
- Ao retornar **`ResponseEntity<EntityModel<Produto>>`**, o Spring automaticamente serializa o modelo em JSON. Exemplo de resposta para `GET /api/produtos/1`:
    
    ```json
    {
      "id": 1,
      "nome": "Camiseta",
      "preco": 49.90,
      "_links": {
        "self": {
          "href": "http://localhost:8080/api/produtos/1"
        },
        "todos": {
          "href": "http://localhost:8080/api/produtos"
        },
        "update": {
          "href": "http://localhost:8080/api/produtos/1"
        }
      }
    }
    
    ```
    

---

### Variações e Personalizações

1. **`CollectionModel<EntityModel<T>>`**:
    - Ao invés de retornar `List<EntityModel<T>>`, você pode retornar um `CollectionModel<EntityModel<T>>`, que também contém links de nível de coleção (por exemplo, um link “self” para `GET /api/produtos`) e metadados adicionais.
    - Exemplo:
        
        ```java
        import org.springframework.hateoas.CollectionModel;
        
        @GetMapping
        public ResponseEntity<CollectionModel<EntityModel<Produto>>> listarTodos() {
            List<EntityModel<Produto>> produtos = produtoRepository.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        
            Link selfLink = WebMvcLinkBuilder.linkTo(
                    WebMvcLinkBuilder.methodOn(ProdutoController.class)
                        .listarTodos()
                ).withSelfRel();
        
            return ResponseEntity.ok(CollectionModel.of(produtos, selfLink));
        }
        
        ```
        
2. **Assembler (ResourceAssembler)**:
    - Para abstrair a lógica de criação de `EntityModel`, crie uma classe que implementa `RepresentationModelAssembler<Produto, EntityModel<Produto>>`.
    - Isso isola a lógica de montagem de links em uma classe separada, deixando o controller enxuto.
        
        ```java
        // src/main/java/com/exemplo/assembler/ProdutoModelAssembler.java
        package com.exemplo.assembler;
        
        import com.exemplo.controller.ProdutoController;
        import com.exemplo.model.Produto;
        import org.springframework.hateoas.EntityModel;
        import org.springframework.hateoas.server.RepresentationModelAssembler;
        import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
        import org.springframework.stereotype.Component;
        
        @Component
        public class ProdutoModelAssembler
            implements RepresentationModelAssembler<Produto, EntityModel<Produto>> {
        
            @Override
            public EntityModel<Produto> toModel(Produto produto) {
                return EntityModel.of(produto,
                    WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(ProdutoController.class)
                            .buscarPorId(produto.getId())
                    ).withSelfRel(),
                    WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(ProdutoController.class)
                            .listarTodos()
                    ).withRel("todos")
                );
            }
        }
        
        ```
        
    - No controller, injete o assembler em vez de chamar `toModel` diretamente.
3. **Links Dinâmicos ou Condicionais**:
    - Adicione links apenas se certos critérios forem atendidos (por exemplo, se o usuário tiver permissão ou se o recurso estiver em um estado específico).
    - Exemplo:
        
        ```java
        EntityModel<Pedido> pedidoModel = assembler.toModel(pedido);
        if (pedido.isCancelavel()) {
            Link cancelLink = WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PedidoController.class)
                    .cancelar(pedido.getId())
            ).withRel("cancelar");
            pedidoModel.add(cancelLink);
        }
        
        ```
        
4. **Personalização de Nomes de Relação**:
    - Por padrão, usamos `"self"`, `"todos"`, etc. Mas você pode usar nomes customizados ou padronizados (por exemplo, `"en-US"` ou `link withRel("update")`).
    - Mantenha coerência com o padrão adotado na sua API.

---

## Cenários de Restrição ou Não Aplicação

- **APIs Simples/Só CRU(D)**:
    - Quando a API é muito pequena e não se beneficiará de navegação hiperlinkada. Por exemplo, em protótipos rápidos ou aplicações internas com poucos endpoints.
- **Limitações de Performance em Grandes Volumes**:
    - Em casos em que cada resposta precisa incluir dezenas de links por item (ex: catálogos extensos), o aumento de payload pode degradar performance ou saturar banda.
    - Prefira caminhos mais enxutos ou consultas específicas sem HATEOAS para endpoints que retornam grandes listas sem filtragem.
- **Client-Side Rendering/Single Page Apps (SPAs)**:
    - Se todo o roteamento e navegação ocorrer no cliente (Angular/React/Vue), talvez o uso intensivo de HATEOAS não seja necessário; o front-end já controla suas rotas.
    - Entretanto, HATEOAS ainda pode ser útil para documentar automaticamente o fluxo de interações possíveis.
- **Sistemas Legados ou Monolitos em Migração**:
    - Em cenários em que a API já está estabelecida e não se pretende mudar a estrutura de resposta, a adoção de HATEOAS pode não valer o esforço.
    - Prefira migrar aos poucos ou aplicar somente em novos módulos.

---

## Componentes-Chave Associados

1. **`EntityModel<T>`**
    - Representa uma entidade de domínio “envolvida” com links.
    - Métodos principais:
        - `of(T content, Link... links)`: cria uma instância com conteúdo + lista de links.
        - `add(Link... links)`: adiciona links à instância existente.
2. **`Link`**
    - Classe que representa um hiperlink.
    - Campos principais:
        - `href`: URL de destino.
        - `rel`: relação semântica (por exemplo, “self”, “update”, “delete”).
    - Métodos auxiliares:
        - `withSelfRel()`, `withRel("nome")`.
3. **`WebMvcLinkBuilder`**
    - Vívida classe utilitária para construir links baseados em métodos de controllers (sem hardcoding de URLs).
    - Exemplos:
        - `linkTo(methodOn(Controller.class).metodo(params))`: retorna um `LinkBuilder`.
        - `.withSelfRel()`, `.withRel("outro")`.
4. **`RepresentationModelAssembler<Entidade, Model>`**
    - Interface que define método `toModel(Entidade entity)`: transforma a entidade em um `EntityModel<Entidade>`.
    - Usada para centralizar lógica de linkagem, promovendo reuso e manutenção mais fácil.
5. **`CollectionModel<T extends RepresentationModel<?>>`**
    - Envolve coleções de `EntityModel`, permitindo adicionar links de nível de coleção (ex.: link para “self” da lista completa).
    - Útil ao retornar listas de recursos com metadados.
6. **Anotações Importantes**
    - Não existem anotações específicas para `EntityModel`, mas lembre-se de:
        - `@EnableHypermediaSupport(type = HypermediaType.HAL)`: caso queira configurar manualmente (em geral, nem é necessário no Spring Boot mais recente). Normalmente, o starter do HATEOAS já habilita HAL por padrão.
        - `@RestController`, `@RequestMapping`, etc. (padrões do Spring MVC).

---

## Melhores Práticas e Padrões de Uso

1. **Usar Assemblers para Organizar Código**
    - Crie classes que implementem `RepresentationModelAssembler`, mantendo o controller focado em lógica de negócio e roteamento.
    - Facilita testes unitários dos assemblers isoladamente.
2. **Adicionar Somente Links Relevantes**
    - Evite “explodir” o JSON com links desnecessários.
    - Inclua apenas “self”, “coleção” e links que façam sentido no contexto daquele recurso e daquele estado.
3. **Nomes de Relação (rel) Consistentes**
    - Use nomes padronizados como “self”, “next”, “prev” ou termos específicos do domínio (“confirmarPedido”, “cancelar”).
    - Mantenha documentação atualizada sobre as possíveis relações.
4. **Versionamento Evolutivo da API**
    - Se for mudar URIs ou relações, use versionamento (ex.: `/api/v2/produtos`) para não quebrar clientes existentes.
    - Links presentes na resposta devem refletir a versão atual da API.
5. **Tratamento de Erros e Links de Autoriação**
    - Em respostas de erro (4xx, 5xx), fornecedor links que orientem o cliente para rotas de autenticação ou documentação.
    - Ex.: em 401 Unauthorized, link para `/login` ou para endpoint de renovação de token.
6. **Documentação Automatizada**
    - Use o [Spring REST Docs](https://docs.spring.io/spring-restdocs/docs/current/reference/html5/) para documentar automaticamente os exemplos de HATEOAS retornados.
    - Isso gera snippets que mostram JSON com links e melhora a compreensão dos consumidores da API.
7. **Performance e Paginação**
    - Ao retornar listas grandes, combine HATEOAS com paginação (`PagedModel`), que também faz parte do Spring HATEOAS.
    - Evita resposta muito grande e inclui links de “next” e “prev” para navegação entre páginas.

---

## Exemplo Prático Completo

Os próximos tópicos apresentam um projeto simplificado de ponta a ponta, mostrando como usar `EntityModel` em uma aplicação Spring Boot.

### Estrutura de Pastas

```
src
├── main
│   ├── java
│   │   └── com
│   │       └── exemplo
│   │           ├── assembler
│   │           │   └── ProdutoModelAssembler.java
│   │           ├── controller
│   │           │   └── ProdutoController.java
│   │           ├── model
│   │           │   └── Produto.java
│   │           ├── repository
│   │           │   └── ProdutoRepository.java
│   │           └── Application.java
│   └── resources
│       └── application.properties
└── pom.xml

```

### Código-Fonte Completo

### 1. `pom.xml`

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.exemplo</groupId>
    <artifactId>spring-hateoas-demo</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
    </parent>

    <dependencies>
        <!-- Dependência principal do Spring Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Driver H2 (banco em memória para testes) -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring HATEOAS -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-hateoas</artifactId>
        </dependency>

        <!-- Para usar Jakarta Annotations (Entity) -->
        <dependency>
            <groupId>jakarta.xml.bind</groupId>
            <artifactId>jakarta.xml.bind-api</artifactId>
        </dependency>
    </dependencies>

    <properties>
        <java.version>17</java.version>
    </properties>
</project>

```

### 2. `Application.java`

```java
// src/main/java/com/exemplo/Application.java
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

### 3. `Produto.java`

```java
// src/main/java/com/exemplo/model/Produto.java
package com.exemplo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Double preco;

    public Produto() { }

    public Produto(Long id, String nome, Double preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    // Getters e setters omitidos para brevidade
    // (implemente conforme mostrado na seção anterior)
}

```

### 4. `ProdutoRepository.java`

```java
// src/main/java/com/exemplo/repository/ProdutoRepository.java
package com.exemplo.repository;

import com.exemplo.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}

```

### 5. `ProdutoModelAssembler.java`

```java
// src/main/java/com/exemplo/assembler/ProdutoModelAssembler.java
package com.exemplo.assembler;

import com.exemplo.controller.ProdutoController;
import com.exemplo.model.Produto;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class ProdutoModelAssembler implements RepresentationModelAssembler<Produto, EntityModel<Produto>> {

    @Override
    public EntityModel<Produto> toModel(Produto produto) {
        return EntityModel.of(produto,
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(ProdutoController.class)
                    .buscarPorId(produto.getId())
            ).withSelfRel(),
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(ProdutoController.class)
                    .listarTodos()
            ).withRel("todos")
        );
    }
}

```

### 6. `ProdutoController.java`

```java
// src/main/java/com/exemplo/controller/ProdutoController.java
package com.exemplo.controller;

import com.exemplo.assembler.ProdutoModelAssembler;
import com.exemplo.model.Produto;
import com.exemplo.repository.ProdutoRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoRepository produtoRepository;
    private final ProdutoModelAssembler assembler;

    public ProdutoController(ProdutoRepository produtoRepository,
                             ProdutoModelAssembler assembler) {
        this.produtoRepository = produtoRepository;
        this.assembler = assembler;
    }

    // 1. Listar todos (CollectionModel<EntityModel<Produto>>)
    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<Produto>>> listarTodos() {
        List<EntityModel<Produto>> produtos = produtoRepository.findAll().stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());

        // Link de nível de coleção (self para "/api/produtos")
        var selfLink =
            org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo(
                org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn(ProdutoController.class)
                    .listarTodos()
            ).withSelfRel();

        return ResponseEntity.ok(CollectionModel.of(produtos, selfLink));
    }

    // 2. Buscar produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Produto>> buscarPorId(@PathVariable Long id) {
        return produtoRepository.findById(id)
            .map(assembler::toModel)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // 3. Criar novo produto
    @PostMapping
    public ResponseEntity<EntityModel<Produto>> criar(@RequestBody Produto produto) {
        Produto salvo = produtoRepository.save(produto);
        EntityModel<Produto> model = assembler.toModel(salvo);

        URI location = model.getRequiredLink("self").toUri();
        return ResponseEntity.created(location).body(model);
    }

    // 4. Atualizar produto existente
    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Produto>> atualizar(
            @PathVariable Long id,
            @RequestBody Produto produtoAtualizado) {

        return produtoRepository.findById(id)
            .map(produtoExistente -> {
                produtoExistente.setNome(produtoAtualizado.getNome());
                produtoExistente.setPreco(produtoAtualizado.getPreco());
                Produto salvo = produtoRepository.save(produtoExistente);
                return ResponseEntity.ok(assembler.toModel(salvo));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // 5. Deletar produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return produtoRepository.findById(id)
            .map(produto -> {
                produtoRepository.delete(produto);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}

```

### 7. `application.properties`

```
spring.datasource.url=jdbc:h2:mem:produtosdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true

```

---

## Cenários de Restrição ou Não Aplicação

1. **APIs muito simples ou protótipos rápidos:**
    - Se o foco é criar algo temporário ou muito enxuto, pode não ser produtivo investir tempo em montar links HATEOAS.
2. **Need Performance Máxima em Listagens Extensas:**
    - Quando a API retorna milhares de itens e cada item ganha vários links, o payload pode ficar muito grande.
3. **Clientes que Não Consomem HATEOAS:**
    - Se você sabe que o cliente nunca seguirá links (por exemplo, scripts que consomem JSON puro), a camada hipermedia pode ser supérflua.

---

## Componentes-Chave Associados

| Componente | Descrição |
| --- | --- |
| **`EntityModel<T>`** | Envolve uma entidade de domínio `T` e contém uma lista de `Link`. |
| **`Link`** | Representa um hiperlink no corpo da resposta. Possui `href` (URL) e `rel` (relação semântica). |
| **`WebMvcLinkBuilder`** | Classe utilitária para construir links a partir de métodos de controllers, evitando hardcoding de URLs. |
| **`RepresentationModelAssembler`** | Interface que converte uma entidade em seu respectivo `EntityModel`, encapsulando lógica de linkagem. |
| **`CollectionModel<T>`** | Envolve coleções de modelos (por exemplo, `CollectionModel<EntityModel<Produto>>`), permitindo links de nível de coleção. |
| **`PagedModel<T>`** | Versão de `CollectionModel` para paginação, contendo metadados de página e links “next”/“prev”. |
| **`@EnableHypermediaSupport`** (opcional) | Anotação para habilitar suporte a formatos de hipermedia específicos (por exemplo, HAL). Geralmente, o Starter do HATEOAS já configura isso automaticamente. |

---

## Melhores Práticas e Padrões de Uso

1. **Centralizar Lógica de Montagem em Assemblers**
    - Evita duplicação de código e mantém controllers mais limpos.
2. **Adicionar Apenas Links Relevantes**
    - Não encha o JSON com links desnecessários; inclua apenas o mínimo que faça sentido para o fluxo do cliente.
3. **Coerência no Nome das Relações (`rel`)**
    - Padrões comuns: “self”, “todos”, “next”, “prev”, “update”, “delete”, mas adapte ao domínio da sua aplicação.
    - Documente as relações possíveis para que o cliente saiba interpretá-las.
4. **Paginação com `PagedModel`**
    - Para coleções grandes, melhor usar paginação em vez de retornar tudo de uma vez.
    - O Spring HATEOAS oferece `PagedModel` que já encapsula metadados de página e links de navegação (“first”, “last”, “next”, “prev”).
5. **Tratamento de Erros Enriquecido**
    - Em respostas de erro, inclua links para recursos de ajuda, documentação ou autorização. Ex.: em 401, link para “login”.
6. **Documentação Automatizada**
    - Combine Spring HATEOAS com Spring REST Docs para gerar exemplos de JSON com links em sua documentação.
7. **Considerar Caches ou ETags**
    - Respostas ricas em links nem sempre mudam a cada chamada; utilize **ETags** ou **`@Cacheable`** para reduzir carga.

---

## Exemplo Prático Completo

### 1. Estrutura de Pastas

```
spring-hateoas-demo
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── exemplo
│   │   │           ├── assembler
│   │   │           │   └── ProdutoModelAssembler.java
│   │   │           ├── controller
│   │   │           │   └── ProdutoController.java
│   │   │           ├── model
│   │   │           │   └── Produto.java
│   │   │           ├── repository
│   │   │           │   └── ProdutoRepository.java
│   │   │           └── Application.java
│   │   └── resources
│   │       └── application.properties
│   └── test
│       └── java
│           └── com
│               └── exemplo
│                   └── (testes unitários, se desejado)
└── pom.xml

```

### 2. Código-Fonte Completo

*(Repetição resumida para facilitar consulta em um único local; veja detalhes nos tópicos anteriores.)*

### 2.1. `pom.xml`

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.exemplo</groupId>
    <artifactId>spring-hateoas-demo</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
    </parent>

    <dependencies>
        <!-- Spring Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- H2 Database (runtime) -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring HATEOAS -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-hateoas</artifactId>
        </dependency>

        <!-- Jakarta Annotations (opcional, mas recomendado) -->
        <dependency>
            <groupId>jakarta.xml.bind</groupId>
            <artifactId>jakarta.xml.bind-api</artifactId>
        </dependency>
    </dependencies>

    <properties>
        <java.version>17</java.version>
    </properties>
</project>

```

### 2.2. `Application.java`

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

### 2.3. `Produto.java`

```java
package com.exemplo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Double preco;

    public Produto() {}

    public Produto(Long id, String nome, Double preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }
}

```

### 2.4. `ProdutoRepository.java`

```java
package com.exemplo.repository;

import com.exemplo.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}

```

### 2.5. `ProdutoModelAssembler.java`

```java
package com.exemplo.assembler;

import com.exemplo.controller.ProdutoController;
import com.exemplo.model.Produto;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class ProdutoModelAssembler implements RepresentationModelAssembler<Produto, EntityModel<Produto>> {
    @Override
    public EntityModel<Produto> toModel(Produto produto) {
        return EntityModel.of(produto,
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(ProdutoController.class)
                    .buscarPorId(produto.getId())
            ).withSelfRel(),
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(ProdutoController.class)
                    .listarTodos()
            ).withRel("todos")
        );
    }
}

```

### 2.6. `ProdutoController.java`

```java
package com.exemplo.controller;

import com.exemplo.assembler.ProdutoModelAssembler;
import com.exemplo.model.Produto;
import com.exemplo.repository.ProdutoRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoRepository produtoRepository;
    private final ProdutoModelAssembler assembler;

    public ProdutoController(ProdutoRepository produtoRepository,
                             ProdutoModelAssembler assembler) {
        this.produtoRepository = produtoRepository;
        this.assembler = assembler;
    }

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<Produto>>> listarTodos() {
        List<EntityModel<Produto>> produtos = produtoRepository.findAll().stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());

        var selfLink =
            org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo(
                org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn(ProdutoController.class)
                    .listarTodos()
            ).withSelfRel();

        return ResponseEntity.ok(CollectionModel.of(produtos, selfLink));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Produto>> buscarPorId(@PathVariable Long id) {
        return produtoRepository.findById(id)
            .map(assembler::toModel)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EntityModel<Produto>> criar(@RequestBody Produto produto) {
        Produto salvo = produtoRepository.save(produto);
        EntityModel<Produto> model = assembler.toModel(salvo);
        URI location = model.getRequiredLink("self").toUri();
        return ResponseEntity.created(location).body(model);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Produto>> atualizar(
            @PathVariable Long id,
            @RequestBody Produto produtoAtualizado) {

        return produtoRepository.findById(id)
            .map(produtoExistente -> {
                produtoExistente.setNome(produtoAtualizado.getNome());
                produtoExistente.setPreco(produtoAtualizado.getPreco());
                Produto salvo = produtoRepository.save(produtoExistente);
                return ResponseEntity.ok(assembler.toModel(salvo));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return produtoRepository.findById(id)
            .map(produto -> {
                produtoRepository.delete(produto);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}

```

### 2.7. `application.properties`

```
spring.datasource.url=jdbc:h2:mem:produtosdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true

```

Após iniciar a aplicação (`mvn spring-boot:run`), você pode testar os endpoints:

1. **`GET /api/produtos`**
    - Retorna uma lista hiperlinkada de produtos.
    - Exemplo de resposta (lista vazia inicialmente):
        
        ```json
        {
          "_embedded": {
            "produtoList": []
          },
          "_links": {
            "self": {
              "href": "http://localhost:8080/api/produtos"
            }
          }
        }
        
        ```
        
2. **`POST /api/produtos`**
    - Body (JSON):
        
        ```json
        {
          "nome": "Caneca",
          "preco": 29.90
        }
        
        ```
        
    - Resposta (201 Created):
        
        ```json
        {
          "id": 1,
          "nome": "Caneca",
          "preco": 29.90,
          "_links": {
            "self": {
              "href": "http://localhost:8080/api/produtos/1"
            },
            "todos": {
              "href": "http://localhost:8080/api/produtos"
            }
          }
        }
        
        ```
        
3. **`GET /api/produtos/1`**
    - Retorna o produto com links “self” e “todos”.
4. **`PUT /api/produtos/1`**
    - Atualiza os dados do produto e retorna o `EntityModel` atualizado com links.
5. **`DELETE /api/produtos/1`**
    - Exclui o produto e retorna status **204 No Content**.

---

## Sugestões para Aprofundamento

- **Documentação Oficial do Spring HATEOAS**:
    
    [https://docs.spring.io/spring-hateoas/docs/current/reference/html/](https://docs.spring.io/spring-hateoas/docs/current/reference/html/)
    
- **Spring REST Docs** (para documentar exemplos de HATEOAS automaticamente):
    
    [https://spring.io/projects/spring-restdocs](https://spring.io/projects/spring-restdocs)
    
- **Livro “REST in Practice” (O’Reilly)**:
    
    Capítulo sobre HATEOAS e hipermídia.
    
- **Artigos e Tutoriais**:
    - “Building Hypermedia-Driven RESTful Web Services With Spring Boot”
    - “Spring HATEOAS Example” (diversos blogs de desenvolvimento).

---

Com isso, você tem uma visão completa de como utilizar a classe `EntityModel` dentro do Spring HATEOAS, seus conceitos fundamentais, sintaxe detalhada, cenários em que pode não ser apropriado, componentes principais, melhores práticas e um exemplo prático completo. Esse material deve ajudá-lo a implementar APIs REST hiperlinkadas de forma estruturada e eficaz.