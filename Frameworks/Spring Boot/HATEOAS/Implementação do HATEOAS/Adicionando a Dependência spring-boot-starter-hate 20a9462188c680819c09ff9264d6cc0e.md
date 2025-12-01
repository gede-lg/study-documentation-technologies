# Adicionando a Dependência spring-boot-starter-hateoas

---

## Introdução

O Spring HATEOAS (Hypermedia As The Engine Of Application State) é uma extensão do Spring que facilita a criação de APIs RESTful que seguem o princípio de hipermídia do estilo arquitetural REST. Em vez de expor apenas dados, essas APIs fornecem também links (hiperlinks) que indicam ações possíveis sobre recursos, melhorando a navegabilidade, auto-descoberta e evolutividade do serviço.

Este guia apresenta, de maneira concisa e ao mesmo tempo profunda, como configurar e utilizar o Spring HATEOAS em projetos Spring Boot com Java. Abordaremos desde a adição da dependência até um exemplo prático de ponta a ponta, cobrindo conceitos, sintaxes, componentes chave e melhores práticas.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Dependência `spring-boot-starter-hateoas`
    
    2.2. Recursos (`Resource`) e Representações (`RepresentationModel`)
    
    2.3. Controladores que retornam `EntityModel<T>` ou `CollectionModel<T>`
    
    2.4. Construção de Links com `Link` e `WebMvcLinkBuilder`
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    
    4.1. `RepresentationModel` e `EntityModel`
    
    4.2. `CollectionModel` e `PagedModel`
    
    4.3. `Link`, `LinkRelation` e `WebMvcLinkBuilder`
    
    4.4. Anotações de HATEOAS (Opcional)
    
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **RESTful com HATEOAS:** REST (Representational State Transfer) define que cada recurso deve fornecer hipermídia (links) para possibilitar a navegação de estado. HATEOAS é a parte do REST que prega que o cliente interage com a API exclusivamente através de links fornecidos dinamicamente, sem necessidade de conhecimento prévio de URIs específicas.
- **Por que usar HATEOAS:**
    1. **Descobribilidade:** Clientes podem descobrir ações possíveis a partir da própria resposta, reduzindo acoplamento.
    2. **Evolução da API:** Mudanças em URIs não quebram clientes, desde que os links sejam atualizados pelo servidor.
    3. **Navegação Guiada:** Pontuações de “próximos passos” (ex. link para editar, excluir, listar relacionados etc.).
- **Modelo de Representação:** Em vez de devolver somente uma POJO/DTO, o Spring HATEOAS envolve esse objeto em um wrapper (por exemplo, `EntityModel<T>`) que contém tanto os dados do recurso quanto seus links associados.

---

## Sintaxe Detalhada e Uso Prático

### 1. Dependência `spring-boot-starter-hateoas`

Para começar, adicione ao `pom.xml` (Maven) a dependência:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-hateoas</artifactId>
</dependency>

```

Se o projeto for Gradle, no `build.gradle`:

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-hateoas'
}

```

> Comentário: essa dependência inclui automaticamente versões compatíveis do Spring HATEOAS e do Jackson HATEOAS para serialização de links em JSON.
> 

---

### 2. Representações de Recursos

### 2.1 `RepresentationModel` e `EntityModel<T>`

- **`RepresentationModel<T>`**
    
    Classe base que contém uma coleção de links (tipo `Link`). Não carrega dados propriamente ditos, apenas links; geralmente usada como superclasse de DTOs quando se quer adicionar links diretamente ao DTO.
    
- **`EntityModel<T>`**
    
    Wrapper que encapsula um recurso do tipo `T` juntamente com seus links.
    
    ```java
    // Exemplo de criação manual de EntityModel
    Usuario usuario = new Usuario(1L, "João", "joao@example.com");
    EntityModel<Usuario> model = EntityModel.of(usuario);
    model.add(Link.of("/usuarios/1").withSelfRel());
    
    ```
    
- **Uso em controladores**:
    
    Ao retornar `EntityModel<Usuario>`, o Spring automaticamente serializa o objeto `Usuario` e inclui os links dentro de um campo `_links` no JSON.
    

### 2.2 `CollectionModel<T>` e Paginado com `PagedModel<T>`

- **`CollectionModel<T>`**
    
    Envolve uma lista/coleção de `EntityModel<T>` ou diretamente de objetos, permitindo inclusão de links relacionados à coleção (por exemplo, link para “self” da lista, link para criação de um novo recurso etc.).
    
    ```java
    List<EntityModel<Usuario>> usuarios = // obter lista de usuários como EntityModel
    CollectionModel<EntityModel<Usuario>> colecao = CollectionModel.of(usuarios);
    colecao.add(Link.of("/usuarios").withSelfRel());
    
    ```
    
- **`PagedModel<T>`**
    
    Variante de coleção que adiciona metadados de paginação (total de páginas, total de elementos, tamanho da página, etc.) além de links “next”, “prev”, “first” e “last” automaticamente quando integrado com `Page<T>` do Spring Data.
    
    ```java
    Page<Usuario> pageUsuarios = usuarioRepository.findAll(pageable);
    PagedModel<EntityModel<Usuario>> pagedModel =
        pagedResourcesAssembler.toModel(pageUsuarios, usuarioAssembler);
    
    ```
    
    > Comentário: para usar PagedModel, injetar PagedResourcesAssembler<Usuario> no controlador e um RepresentationModelAssembler<Usuario, EntityModel<Usuario>> (veja seção de componentes chave).
    > 

---

### 3. Construção de Links com `Link` e `WebMvcLinkBuilder`

Em geral, ao criar links, utiliza-se a API de “link building” provida pelo Spring HATEOAS:

```java
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @GetMapping("/{id}")
    public EntityModel<Usuario> buscarPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        // Cria o EntityModel contendo o recurso e links
        EntityModel<Usuario> model = EntityModel.of(usuario);

        // Link para self
        Link selfLink = linkTo(methodOn(UsuarioController.class).buscarPorId(id)).withSelfRel();
        model.add(selfLink);

        // Exemplo: link para listar todos os usuários
        Link todosLink = linkTo(methodOn(UsuarioController.class).listarTodos()).withRel("todos");
        model.add(todosLink);

        return model;
    }

    @GetMapping
    public CollectionModel<EntityModel<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        List<EntityModel<Usuario>> recursos = usuarios.stream()
            .map(u -> EntityModel.of(u,
                    linkTo(methodOn(UsuarioController.class).buscarPorId(u.getId())).withSelfRel()))
            .collect(Collectors.toList());

        CollectionModel<EntityModel<Usuario>> collectionModel = CollectionModel.of(recursos);
        collectionModel.add(linkTo(methodOn(UsuarioController.class).listarTodos()).withSelfRel());
        return collectionModel;
    }
}

```

- **`linkTo(...)`**
    
    Constrói a URI com base na chamada de método fictícia (`methodOn(...)`).
    
- **`methodOn(...)`**
    
    Permite referenciar um controlador e método, sem executá-lo, apenas para construir a rota.
    

> Comentário: a construção de links dessa forma garante que, se mapeamentos (por ex. @RequestMapping) mudarem, os links sejam atualizados automaticamente.
> 

---

## Cenários de Restrição ou Não Aplicação

1. **APIs simples e sem necessidade de hipermídia:**
    - Em sistemas internos ou APIs que só servem dados para consumidores que já conhecem todas as URIs (ex.: microserviços internos sem front-end variado), HATEOAS pode introduzir complexidade desnecessária.
2. **Requisitos estritos de performance e tamanho da resposta:**
    - Adicionar links a cada recurso aumenta o payload JSON. Para endpoints com retorno de milhares de registros, pode impactar banda e tempo de serialização.
3. **Exigência de compatibilidade com clientes legados:**
    - Alguns clientes podem não entender ou ignorar o campo `_links`. Se a exigência for fornecer exatamente um DTO sem estrutura hipermídia, HATEOAS não se aplica.
4. **APIs que seguem outro estilo de hipermídia (como JSON:API ou HAL+JSON, mas sem HATEOAS Spring):**
    - Se a equipe adotar JSON:API completo (via bibliotecas específicas), pode optar por soluções que não usem o assembler do Spring HATEOAS.

---

## Componentes Chave Associados

### 1. `RepresentationModel` (base)

- Pacote: `org.springframework.hateoas`
- Função: classe base para modelos que contenham links.
- Métodos principais:
    - `add(Link... links)`: adiciona um ou mais links.
    - `getLinks()`: retorna todos os links associados.
- Uso típico: toda classe que quer herdar estrutura de links (ex.: herdar em DTOs para anexar facilmente links).

### 2. `EntityModel<T>`

- Pacote: `org.springframework.hateoas`
- Função: wrapper que encapsula um objeto `T` como recurso e mantém links.
- Atributos:
    - `content`: o próprio objeto do recurso.
    - `links`: lista de links do tipo `Link`.
- Métodos principais:
    - `of(T content, Link... links)`: construtor estático para criar `EntityModel` já com links.
    - `getContent()`: obtém o objeto de recurso (o DTO/POJO).
    - `add(Link... links)`: adiciona links.

### 3. `CollectionModel<T>` e `PagedModel<T>`

- **`CollectionModel<T>`**
    - Pacote: `org.springframework.hateoas`
    - Função: representa uma coleção de recursos, podendo conter links próprios da coleção.
    - Métodos principais:
        - `of(Collection<T> content, Link... links)`: constrói com conteúdo e links.
- **`PagedModel<T>`**
    - Pacote: `org.springframework.hateoas`
    - Extende `CollectionModel<T>`, adicionando metadados de paginação (total de elementos, total de páginas, tamanho atual da página, etc.) e links de navegação (“next”, “prev”, etc.).
    - Normalmente usado em conjunto com `PagedResourcesAssembler<T>` para conversão de `Page<T>` do Spring Data.

### 4. `Link` e `LinkRelation`

- **`Link`**
    - Pacote: `org.springframework.hateoas`
    - Representa um hiperlink com URI e “rel” (relação semântica).
    - Criado via `Link.of(String uri, String rel)` ou, preferencialmente, obtido a partir de `WebMvcLinkBuilder`.
- **`LinkRelation`**
    - Especifica a relação semântica (ex.: “self”, “next”, “prev”). Pode ser fornecido como `withSelfRel()`, `withRel("nome")`, ou usando classes utilitárias.

### 5. `WebMvcLinkBuilder`

- Pacote: `org.springframework.hateoas.server.mvc`
- Responsável por “link building” baseado em controladores Spring MVC. Exemplos de métodos:
    - `linkTo(MethodInvocation invocation)`: cria link com base em uma chamada de método fictícia.
    - `methodOn(Class<?> controllerClass)`: retorna proxy para referenciar métodos do controlador.
    - Combinados: `linkTo(methodOn(UsuarioController.class).buscarPorId(id)).withSelfRel()`.

### 6. `RepresentationModelAssembler<T, D extends RepresentationModel<?>>`

- Pacote: `org.springframework.hateoas.server`
- Interface que define método `toModel(T entity)` para converter uma entidade `T` em um `RepresentationModel` ou subclasse (como `EntityModel<T>`).
- Facilitador para centralizar lógica de mapeamento e criação de links de um determinado tipo de recurso.
- Exemplo mínimo:
    
    ```java
    public class UsuarioModelAssembler implements
        RepresentationModelAssembler<Usuario, EntityModel<Usuario>> {
    
        @Override
        public EntityModel<Usuario> toModel(Usuario usuario) {
            EntityModel<Usuario> model = EntityModel.of(usuario,
                linkTo(methodOn(UsuarioController.class)
                    .buscarPorId(usuario.getId())).withSelfRel());
            model.add(linkTo(methodOn(UsuarioController.class)
                .listarTodos()).withRel("todos"));
            return model;
        }
    }
    
    ```
    

### 7. Anotações Relacionadas (opcionais)

- `@EnableHypermediaSupport`
    - Pacote: `org.springframework.hateoas.config`
    - Ativa suporte a formatos de hipermídia (HAL por padrão). Nas versões mais recentes do Spring Boot, geralmente não é necessário pois o starter já configura automaticamente.

---

## Melhores Práticas e Padrões de Uso

1. **Use `RepresentationModelAssembler` para isolar lógica de criação de recursos:**
    - Centralizar mapeamentos e links evita duplicação de código.
2. **Mantenha nomenclaturas consistentes de “rel” (relações):**
    - Ex.: `self`, `update`, `delete`, `all`, `next`, `prev`.
    - Use constantes ou enums para evitar erros de digitação.
3. **Não exponha detalhes internos da URI:**
    - Construa links via `WebMvcLinkBuilder` em vez de montar strings manualmente.
4. **Retorne `CollectionModel<EntityModel<T>>` ou `PagedModel<EntityModel<T>>`:**
    - Para coleções, inclua sempre um link “self” da própria coleção.
5. **Documente claramente seus links no Swagger/OpenAPI (se aplicável):**
    - Caso use Swagger, talvez seja necessário customizar para expor “_links” no modelo.
6. **Evite adicionar links irrelevantes ao consumidor primário:**
    - Não polua respostas com centenas de links; tenha foco nos links realmente necessários (ex.: ações possíveis, navegação de página e isso basta).
7. **Combine HATEOAS com paginação nativa (Spring Data):**
    - Utilize `PagedResourcesAssembler` para gerar `PagedModel` automaticamente, incluindo links “next/prev”.
8. **Teste a serialização JSON para confirmar formato HAL:**
    - O JSON gerado segue a especificação HAL, com `_links` e `_embedded` (no caso de coleções).

---

## Exemplo Prático Completo

A seguir, um exemplo passo a passo de um pequeno serviço de gerenciamento de “Usuários” que utiliza Spring HATEOAS.

### 1. Estrutura Básica do Projeto

- Dependência em `pom.xml` (já mostrada anteriormente).
- Pacote principal: `com.exemplo.hateoas`.

### 2. Entidade e Repositório (Spring Data JPA)

```java
// src/main/java/com/exemplo/hateoas/model/Usuario.java
package com.exemplo.hateoas.model;

import javax.persistence.*;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;

    // Construtores, getters e setters
    public Usuario() {}

    public Usuario(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

```

```java
// src/main/java/com/exemplo/hateoas/repository/UsuarioRepository.java
package com.exemplo.hateoas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.exemplo.hateoas.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Métodos padrão do CRUD já disponíveis
}

```

### 3. Assemblers de Representação

```java
// src/main/java/com/exemplo/hateoas/assembler/UsuarioModelAssembler.java
package com.exemplo.hateoas.assembler;

import com.exemplo.hateoas.controller.UsuarioController;
import com.exemplo.hateoas.model.Usuario;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class UsuarioModelAssembler
    implements RepresentationModelAssembler<Usuario, EntityModel<Usuario>> {

    @Override
    public EntityModel<Usuario> toModel(Usuario usuario) {
        // Cria EntityModel com o link self e link para listar todos
        return EntityModel.of(
            usuario,
            linkTo(methodOn(UsuarioController.class)
                .buscarPorId(usuario.getId())).withSelfRel(),
            linkTo(methodOn(UsuarioController.class)
                .listarTodos()).withRel("todos")
        );
    }
}

```

> Comentário: Ao anotar com @Component, esse assembler pode ser injetado automaticamente nos controladores.
> 

---

### 4. Controlador REST com HATEOAS

```java
// src/main/java/com/exemplo/hateoas/controller/UsuarioController.java
package com.exemplo.hateoas.controller;

import com.exemplo.hateoas.assembler.UsuarioModelAssembler;
import com.exemplo.hateoas.model.Usuario;
import com.exemplo.hateoas.repository.UsuarioRepository;

import org.springframework.hateoas.*;
import org.springframework.hateoas.PagedModel.PageMetadata;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository repository;
    private final UsuarioModelAssembler assembler;
    private final PagedResourcesAssembler<Usuario> pagedAssembler;

    public UsuarioController(UsuarioRepository repository,
                             UsuarioModelAssembler assembler,
                             PagedResourcesAssembler<Usuario> pagedAssembler) {
        this.repository = repository;
        this.assembler = assembler;
        this.pagedAssembler = pagedAssembler;
    }

    // 4.1. Listar todos os usuários (com paginação)
    @GetMapping
    public PagedModel<EntityModel<Usuario>> listarTodos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {

        Page<Usuario> pageResult = repository.findAll(PageRequest.of(page, size));

        // Converte cada Usuario em EntityModel<Usuario> usando assembler
        return pagedAssembler.toModel(pageResult, assembler);
    }

    // 4.2. Buscar usuário por ID
    @GetMapping("/{id}")
    public EntityModel<Usuario> buscarPorId(@PathVariable Long id) {
        Usuario usuario = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return assembler.toModel(usuario);
    }

    // 4.3. Criar novo usuário
    @PostMapping
    public ResponseEntity<?> criarUsuario(@RequestBody Usuario novoUsuario) {
        Usuario usuarioSalvo = repository.save(novoUsuario);

        EntityModel<Usuario> model = assembler.toModel(usuarioSalvo);

        // Gera URI do recurso criado (self link)
        URI uri = linkTo(methodOn(UsuarioController.class)
                          .buscarPorId(usuarioSalvo.getId())).toUri();

        return ResponseEntity.created(uri).body(model);
    }

    // 4.4. Atualizar usuário existente
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(
            @RequestBody Usuario usuarioAtualizado,
            @PathVariable Long id) {

        Usuario atualizado = repository.findById(id)
            .map(u -> {
                u.setNome(usuarioAtualizado.getNome());
                u.setEmail(usuarioAtualizado.getEmail());
                return repository.save(u);
            })
            .orElseGet(() -> {
                usuarioAtualizado.setId(id);
                return repository.save(usuarioAtualizado);
            });

        EntityModel<Usuario> model = assembler.toModel(atualizado);
        return ResponseEntity.ok(model);
    }

    // 4.5. Excluir usuário
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirUsuario(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

```

> Comentário Detalhado do Controlador:
> 
> - **Listar todos com paginação:** Retorna `PagedModel<EntityModel<Usuario>>`, que inclui links “self”, “first”, “last”, “next” e “prev”.
> - **Buscar por ID:** Usa o assembler para criar `EntityModel` com links apropriados.
> - **Criar Usuário:** Ao salvar, retorna `201 Created` e inclui o model com links; URI do cabeçalho é obtida por `linkTo(methodOn(...))`.
> - **Atualizar e Excluir:** Mantêm o padrão HATEOAS, devolvendo o model ou `204 No Content`.

---

### 5. Tratamento de Exceção para Recurso Não Encontrado

```java
// src/main/java/com/exemplo/hateoas/exception/ResourceNotFoundException.java
package com.exemplo.hateoas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String mensagem) {
        super(mensagem);
    }
}

```

> Comentário: Ao lançar ResourceNotFoundException, o Spring padroniza a resposta como 404 Not Found. Pode-se customizar a resposta JSON por meio de @ControllerAdvice (não mostrado aqui para focar em HATEOAS).
> 

---

### 6. Exemplo de Resposta JSON (Formato HAL)

**Requisição:**

```
GET /usuarios/1

```

**Resposta (`application/hal+json`):**

```json
{
  "id": 1,
  "nome": "João",
  "email": "joao@example.com",
  "_links": {
    "self": {
      "href": "http://localhost:8080/usuarios/1"
    },
    "todos": {
      "href": "http://localhost:8080/usuarios"
    }
  }
}

```

Para listagem paginada:

```
GET /usuarios?page=0&size=2

```

```json
{
  "_embedded": {
    "usuarioList": [
      {
        "id": 1,
        "nome": "João",
        "email": "joao@example.com",
        "_links": {
          "self": {
            "href": "http://localhost:8080/usuarios/1"
          }
        }
      },
      {
        "id": 2,
        "nome": "Maria",
        "email": "maria@example.com",
        "_links": {
          "self": {
            "href": "http://localhost:8080/usuarios/2"
          }
        }
      }
    ]
  },
  "_links": {
    "self": {
      "href": "http://localhost:8080/usuarios?page=0&size=2"
    },
    "next": {
      "href": "http://localhost:8080/usuarios?page=1&size=2"
    }
  },
  "page": {
    "size": 2,
    "totalElements": 5,
    "totalPages": 3,
    "number": 0
  }
}

```

> Comentário: O campo _embedded.usuarioList armazena os recursos, enquanto _links fornece URIs de navegação da própria coleção.
> 

---

## Sugestões para Aprofundamento

- **Documentação Oficial:**
    - [Spring HATEOAS Reference Documentation](https://spring.io/projects/spring-hateoas)
    - [Guia de Início Rápido Spring HATEOAS](https://spring.io/guides/gs/rest-hateoas/)
- **Outros Formatos de Hipermídia:**
    - Comparar HAL (usado pelo Spring HATEOAS) com outros padrões, como JSON:API ou Siren, avaliando trade-offs.
- **Integração com OpenAPI/Swagger:**
    - Como expor corretamente modelos HAL em documentação OpenAPI; uso de `springdoc-openapi-hateoas`.
- **Testes Automatizados:**
    - Escrever testes de integração para verificar a existência e valores corretos dos links usando `MockMvc` e `JsonPath`.
- **Customização de Serialização:**
    - Configurar Jackson para incluir campos adicionais ou remover atributos nos modelos HATEOAS.
- **Exemplo de “Client-Side” HATEOAS:**
    - Demonstração de consumo de APIs HATEOAS em clients (como JavaScript/Angular/React), navegando através dos links.

---

### Considerações Finais

A implementação de HATEOAS no Spring Boot aproxima sua API às diretrizes puristas do REST, fornecendo hipermídia que guia o consumidor para as operações disponíveis. Embora acrescente complexidade e possa aumentar o tamanho da resposta, os benefícios em termos de manutenibilidade e descobribilidade muitas vezes compensam, especialmente em sistemas que evoluem rapidamente ou onde múltiplos clientes consomem a API.

Este guia apresentou desde a configuração básica até um exemplo de um projeto simplificado, mas completo, abordando dependências, wrappers de recurso, assemblers, controladores REST, e melhores práticas. Sinta-se à vontade para ajustar cada aspecto conforme suas necessidades de domínio e complexidade do projeto.