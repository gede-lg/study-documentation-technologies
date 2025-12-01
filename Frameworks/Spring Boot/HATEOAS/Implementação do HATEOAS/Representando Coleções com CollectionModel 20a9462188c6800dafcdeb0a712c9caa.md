# Representando Coleções com CollectionModel

---

## 1. Introdução

Nesta seção, contextualizaremos brevemente o uso de hipermedia e padrões avançados de coleção em APIs REST com Spring Boot, destacando a importância de utilizar `CollectionModel` para representar coleções de recursos seguindo convenções HATEOAS (Hypermedia as the Engine of Application State).

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

### 3.1 O que é HATEOAS?

- **HATEOAS** é um princípio que faz parte da arquitetura REST, cujo objetivo é incluir links (relacionamentos entre recursos) diretamente nas representações retornadas pela API.
- Isso permite que o cliente descubra dinamicamente as operações disponíveis, navegando de recurso em recurso por meio de URLs fornecidas pelo próprio servidor.

### 3.2 `RepresentationModel` e Subclasses

- No ecossistema Spring Boot, o projeto **Spring HATEOAS** fornece classes base para representar recursos e coleções de recursos, tais como:
    - `RepresentationModel<T>`: classe genérica para recursos que desejam agregar links.
    - `EntityModel<T>` (ou `Resource<T>` em versões mais antigas): encapsula uma entidade individual e uma coleção de links.
    - `CollectionModel<T>` (ou `Resources<T>` em versões anteriores): representa uma coleção de recursos de mesmo tipo, juntamente com links aplicáveis à coleção como um todo.

### 3.3 Por que representar coleções com `CollectionModel`?

- Permite adicionar metadados (por exemplo, links de navegação entre páginas, link para a própria coleção, etc.).
- Segue o **padrão HATEOAS**, tornando a API mais descoberta e auto-descritiva.
- Facilita a inclusão de links como:
    - `self`: URL que representa o próprio endpoint de listagem.
    - `next` / `prev`: links de paginação (quando aplicável).
    - Links para operações relacionadas à coleção (ex.: “criar novo recurso”).

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Dependências Necessárias

Para usar `CollectionModel`, precisamos adicionar a dependência do **Spring HATEOAS** no `pom.xml` (Maven) ou `build.gradle` (Gradle).

```xml
<!-- Exemplo Maven -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-hateoas</artifactId>
</dependency>

```

```groovy
// Exemplo Gradle
implementation 'org.springframework.boot:spring-boot-starter-hateoas'

```

### 4.2 Estrutura Básica de um Controlador que Retorna `CollectionModel`

```java
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class LivroController {

    private final LivroRepository repository;
    private final LivroModelAssembler assembler;

    public LivroController(LivroRepository repository, LivroModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    // Endpoint para retornar todos os livros
    @GetMapping("/livros")
    public CollectionModel<EntityModel<Livro>> todosLivros() {
        // 1. Obter lista de entidades Livro
        List<Livro> lista = repository.findAll();

        // 2. Converter cada Livro em EntityModel<Livro> com links
        List<EntityModel<Livro>> recursos =
            lista.stream()
                 .map(assembler::toModel)           // assembler converte para EntityModel e adiciona links
                 .collect(Collectors.toList());

        // 3. Construir o CollectionModel a partir da lista de recursos
        return CollectionModel.of(
            recursos,
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(LivroController.class).todosLivros()
            ).withSelfRel()  // link "self" para o endpoint /livros
        );
    }
}

```

### Explicação dos principais pontos:

1. **`repository.findAll()`**: busca todos os objetos `Livro` no banco de dados.
2. **`assembler.toModel(livro)`**: método que converte cada entidade `Livro` em `EntityModel<Livro>`, adicionando links como `self` e talvez links relacionados (ex.: “autores”, “categorias”, etc.).
3. **`CollectionModel.of(recursos, linkSelf)`**: cria uma instância de `CollectionModel` contendo a coleção de `EntityModel<Livro>` e associa um link de “self” que aponta para esse mesmo endpoint.

### 4.3 Detalhando o Model Assembler (Implementando `RepresentationModelAssembler`)

Para não repetir código de adição de links, criamos um **Assembler** que implementa `RepresentationModelAssembler<Livro, EntityModel<Livro>>`.

```java
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class LivroModelAssembler
        implements RepresentationModelAssembler<Livro, EntityModel<Livro>> {

    @Override
    public EntityModel<Livro> toModel(Livro livro) {
        return EntityModel.of(
            livro,
            // Link "self" para este livro específico
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(LivroController.class).umLivro(livro.getId())
            ).withSelfRel(),
            // Link para a coleção de todos os livros
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(LivroController.class).todosLivros()
            ).withRel("livros")
        );
    }
}

```

- **`umLivro(Long id)`** seria outro método no `LivroController` que retorna `EntityModel<Livro>` para um único recurso.

```java
@GetMapping("/livros/{id}")
public EntityModel<Livro> umLivro(@PathVariable Long id) {
    Livro livro = repository.findById(id)
                .orElseThrow(() -> new LivroNotFoundException(id));

    return assembler.toModel(livro);
}

```

### Comentários sobre a sintaxe:

- `WebMvcLinkBuilder.linkTo(methodOn(...))`: forma fluente de criar links que apontam para métodos anotados em controllers.
- `withSelfRel()`, `withRel("livros")`: definem o `rel` (relação semântica) associado ao link.

### 4.4 Variações de Sintaxe

- **Outros formatos de coleção**: embora usemos `CollectionModel.of(...)`, podemos usar `new CollectionModel<>(recursos, linkList...)`.
- **Paginação com `PagedModel`**: quando lidamos com paginação, ao invés de `CollectionModel`, usamos `PagedModel` que adiciona metadados de página (`size`, `number`, `totalElements`, etc.). Exemplo:

```java
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.data.web.PageableDefault;

@GetMapping("/livros-paginados")
public PagedModel<EntityModel<Livro>> livrosPaginados(
        @PageableDefault(size = 5) Pageable pageable) {

    Page<Livro> page = repository.findAll(PageRequest.of(
        pageable.getPageNumber(), pageable.getPageSize()
    ));

    List<EntityModel<Livro>> recursos =
        page.getContent()
            .stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());

    return PagedModel.of(
        recursos,
        new PagedModel.PageMetadata(
            page.getSize(),
            page.getNumber(),
            page.getTotalElements(),
            page.getTotalPages()
        ),
        WebMvcLinkBuilder.linkTo(
            WebMvcLinkBuilder.methodOn(LivroController.class).livrosPaginados(pageable)
        ).withSelfRel()
    );
}

```

- Neste caso, `PageMetadata` armazena informações de paginação e `PagedModel` herda de `CollectionModel`, adicionando metadados adicionais.

---

## 5. Cenários de Restrição ou Não Aplicação

1. **APIs simples sem HATEOAS**
    - Se sua aplicação não requer hipermedia nem navegação dinâmica, retornar simplesmente listas JSON (`List<Livro>`) pode ser suficiente.
    - Uso de `CollectionModel` pode adicionar complexidade desnecessária se não houver necessidade de links ou metadados.
2. **Coleções muito grandes sem paginação adequada**
    - Ao retornar milhares de recursos em um único `CollectionModel`, você gasta muita largura de banda.
    - Caso a coleção seja volumosa, opte por `PagedModel` ou segmentação em páginas.
3. **Contexto de microserviços internos sem exposição de HATEOAS**
    - Se o consumo for interno (entre microserviços) e não exigir descobribilidade de links, pode-se dispensar o uso de `CollectionModel`, retornando contratos simples (DTOs) para transporte.
4. **APIs que adotam outro padrão de hipermedia**
    - Se você optar por HAL, Siren ou JSON:API fora das convenções do Spring HATEOAS, poderá usar bibliotecas específicas (por exemplo, JSON:API Spring). Neste caso, o `CollectionModel` pode não ser compatível diretamente.

---

## 6. Componentes Chave Associados

Para trabalhar efetivamente com `CollectionModel` em Spring Boot, é importante conhecer:

1. **`CollectionModel<T>`**
    - Extende `RepresentationModel<CollectionModel<T>>`.
    - Encapsula uma coleção de objetos do tipo `T` e uma coleção de `Link`.
2. **`EntityModel<T>`**
    - Encapsula um único objeto de domínio (por exemplo, `Livro`) + coleção de `Link`.
    - Serve de nó atômico em coleções de hipermedia.
3. **`RepresentationModelAssembler<T, D extends RepresentationModel<?>>`**
    - Interface que obriga o método `toModel(T entity)` para converter entidade em modelo HATEOAS (por exemplo, `EntityModel<Livro>`).
    - Usado para padronizar a adição de links e evitar duplicação de código.
4. **`Link`**
    - Classe que representa um link HATEOAS, contendo `href`, `rel` e atributos opcionais (como `type`).
    - Criado geralmente por meio de `WebMvcLinkBuilder`.
5. **`WebMvcLinkBuilder` e `WebMvcLinkBuilderFactory`**
    - APIs utilitárias para criar links a partir de referências a métodos de controllers anotados com `@RequestMapping`, `@GetMapping`, etc.
    - Exemplos de métodos: `linkTo(...)`, `methodOn(...)`, `slash(...)`.
6. **`PagedModel<T>` e `PageMetadata`**
    - Para representar coleções paginadas, contendo metadados sobre paginação (ex.: `pageNumber`, `pageSize`, `totalElements`, `totalPages`).
    - Adiciona automaticamente links como `first`, `prev`, `next`, `last` se construído adequadamente.
7. **Anotações relevantes**
    - `@RestController` / `@Controller`
    - `@GetMapping`, `@PostMapping` etc.
    - As anotações de mapeamento não impactam diretamente o `CollectionModel`, mas definem rotas que o assembler utilizará.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Separar a camada de montagem de recursos**
    - Crie classes que implementem `RepresentationModelAssembler` para cada entidade. Isso mantém seus controllers enxutos e favorece a reutilização de código.
2. **Adicionar apenas links relevantes**
    - Não abuse da quantidade de links; inclua somente aqueles que o cliente realmente utilizará (ex.: `self`, links para navegação entre páginas, links para ações relacionadas).
3. **Consistência no `rel` de links**
    - Padronize strings de “rel” (por exemplo, `self`, `livros`, `autores`) em todo o projeto para facilitar a consumição e documentação.
4. **Pegar cuidado com N+1**
    - Ao montar coleções de modelos, se você acessar lazy-loaded associations em cada entidade, pode gerar múltiplas consultas ao banco. Prefira “fetch joins” ou métodos otimizados do repositório para evitar esse problema.
5. **Paginação combinada com filtros**
    - Quando usar `PagedModel`, combine com parâmetros de paginação (por exemplo, `?page=1&size=20`) e possibilite ordenação (`?sort=campo,asc`), garantindo que o assembler receba a página adequada.
6. **Documentar os “rel” e formatos HATEOAS**
    - Para facilitar a integração de clientes (front-end, 3rd-party), documente quais `rel` são suportados e qual é o esquema JSON/HAL retornado. Ferramentas como Swagger não cobrem HATEOAS por padrão – considere extensões ou um README específico.
7. **Uso de DTOs quando necessário**
    - Se sua entidade contiver campos sensíveis ou volumosos, utilize DTOs para retornar apenas os dados necessários. O assembler pode converter do DTO para o `EntityModel<DTO>`.
8. **Tratamento de exceções e erros**
    - Mesmo retornando coleções, padronize respostas de erro, incluindo código HTTP e um JSON com detalhes (por exemplo, timestamp, mensagem, path). Não misture coleções vazias com respostas de erro.

---

## 8. Exemplo Prático Completo

A seguir, um exemplo end-to-end de uma API de “Livros” que ilustra todos os conceitos anteriores, incluindo entidade, repositório, assembler, controller e configuração mínima.

### 8.1 Estrutura de Pacotes (Exemplo)

```
com.exemplo.livraria
├── controller
│   └── LivroController.java
├── exception
│   └── LivroNotFoundException.java
├── model
│   └── Livro.java
├── repository
│   └── LivroRepository.java
├── assembler
│   └── LivroModelAssembler.java
└── LivrariaApplication.java

```

### 8.2 Entidade `Livro`

```java
package com.exemplo.livraria.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String autor;
    private Double preco;

    // Construtores, getters e setters omitidos para brevidade

    public Livro() {}

    public Livro(String titulo, String autor, Double preco) {
        this.titulo = titulo;
        this.autor = autor;
        this.preco = preco;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getAutor() {
        return autor;
    }

    public Double getPreco() {
        return preco;
    }

    // setters omitidos
}

```

### 8.3 Repositório `LivroRepository`

```java
package com.exemplo.livraria.repository;

import com.exemplo.livraria.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {
    // Métodos CRUD prontos: findAll(), findById(), save(), deleteById(), etc.
}

```

### 8.4 Exceção Customizada `LivroNotFoundException`

```java
package com.exemplo.livraria.exception;

public class LivroNotFoundException extends RuntimeException {
    public LivroNotFoundException(Long id) {
        super("Livro não encontrado com ID: " + id);
    }
}

```

### 8.5 Assembler `LivroModelAssembler`

```java
package com.exemplo.livraria.assembler;

import com.exemplo.livraria.controller.LivroController;
import com.exemplo.livraria.model.Livro;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class LivroModelAssembler implements RepresentationModelAssembler<Livro, EntityModel<Livro>> {

    @Override
    public EntityModel<Livro> toModel(Livro livro) {
        return EntityModel.of(
            livro,
            linkTo(methodOn(LivroController.class).umLivro(livro.getId())).withSelfRel(),
            linkTo(methodOn(LivroController.class).todosLivros()).withRel("livros")
        );
    }
}

```

### 8.6 Controller `LivroController`

```java
package com.exemplo.livraria.controller;

import com.exemplo.livraria.assembler.LivroModelAssembler;
import com.exemplo.livraria.exception.LivroNotFoundException;
import com.exemplo.livraria.model.Livro;
import com.exemplo.livraria.repository.LivroRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/livros")
public class LivroController {

    private final LivroRepository repository;
    private final LivroModelAssembler assembler;

    public LivroController(LivroRepository repository, LivroModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    // 8.6.1 Retornar todos os livros
    @GetMapping
    public CollectionModel<EntityModel<Livro>> todosLivros() {
        List<EntityModel<Livro>> recursos = repository.findAll().stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());

        return CollectionModel.of(
            recursos,
            linkTo(methodOn(LivroController.class).todosLivros()).withSelfRel()
        );
    }

    // 8.6.2 Retornar um único livro por ID
    @GetMapping("/{id}")
    public EntityModel<Livro> umLivro(@PathVariable Long id) {
        Livro livro = repository.findById(id)
                        .orElseThrow(() -> new LivroNotFoundException(id));

        return assembler.toModel(livro);
    }

    // 8.6.3 Criar novo livro
    @PostMapping
    public ResponseEntity<EntityModel<Livro>> novoLivro(@RequestBody Livro novoLivro) {
        Livro livroSalvo = repository.save(novoLivro);

        EntityModel<Livro> recurso = assembler.toModel(livroSalvo);

        return ResponseEntity
            .created(URI.create(recurso.getRequiredLink("self").getHref()))
            .body(recurso);
    }

    // Outros endpoints de atualização e exclusão poderiam ser adicionados aqui
}

```

### Como testar:

1. **Inicie a aplicação** (por ex.: `mvn spring-boot:run`).
2. **Requisição GET** a `http://localhost:8080/livros` retornará um JSON semelhante a:
    
    ```json
    {
      "_embedded": {
        "livroList": [
          {
            "id": 1,
            "titulo": "Clean Code",
            "autor": "Robert C. Martin",
            "preco": 45.0,
            "_links": {
              "self": {
                "href": "http://localhost:8080/livros/1"
              },
              "livros": {
                "href": "http://localhost:8080/livros"
              }
            }
          },
          {
            "id": 2,
            "titulo": "Effective Java",
            "autor": "Joshua Bloch",
            "preco": 50.0,
            "_links": {
              "self": {
                "href": "http://localhost:8080/livros/2"
              },
              "livros": {
                "href": "http://localhost:8080/livros"
              }
            }
          }
        ]
      },
      "_links": {
        "self": {
          "href": "http://localhost:8080/livros"
        }
      }
    }
    
    ```
    
    - A seção `_embedded.livroList` contém os objetos individuais já “envoltos” em `EntityModel` com links.
    - A raiz inclui `_links.self` apontando para o próprio endpoint `/livros`.
3. **Requisição GET** a `http://localhost:8080/livros/1` retorna apenas aquele recurso específico, com links apropriados.

---

## 9. Sugestões para Aprofundamento

- **Documentação oficial Spring HATEOAS**
    
    [https://docs.spring.io/spring-hateoas/docs/current/reference/html/](https://docs.spring.io/spring-hateoas/docs/current/reference/html/)
    
- **HAL Browser** para visualizar coleções e experimentação interativa.
- **Livro “RESTful Web APIs”** (Leonard Richardson & Mike Amundsen) – seção sobre hipermedia.
- **Padrões de HATEOAS**: entender padrões como HAL, JSON:API e Siren para escolher a representação mais apropriada.
- **Comparar `CollectionModel` com `PagedModel`**: aprofundar-se em paginação e metadados de paginação.
- **Estudos sobre “RepresentationModelAssembler” avançado**: montar recursos de forma dinâmica com regras de negócios (por exemplo, links condicionais).

---

**Conclusão:**

Neste guia, vimos como utilizar `CollectionModel` do Spring HATEOAS para representar coleções de recursos em uma API Spring Boot, seguindo os princípios HATEOAS. Abordamos os conceitos fundamentais, detalhamos a sintaxe, discutimos quando não utilizar e apresentamos um exemplo completo de ponta a ponta. A adoção de `CollectionModel` traz vantagens de descobribilidade, manutenção e organização para APIs REST que desejam expor hipermedia de maneira consistente.