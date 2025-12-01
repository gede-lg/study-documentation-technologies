# Adicionando Link “self” e Links Relacionais

---

## Introdução

Spring HATEOAS (Hypermedia As The Engine Of Application State) é uma biblioteca do ecossistema Spring que facilita a construção de APIs RESTful enriquecidas com links hipertextuais (hypermedia). Ao incluir links “self” e relacionais em suas respostas, você está seguindo o princípio HATEOAS, orientando o consumidor da API sobre como navegar pelas rotas disponíveis. Isso traz benefícios como descoberta dinâmica de endpoints, maior desacoplamento entre cliente e servidor e explicitação das ações possíveis em cada recurso.

---

## Sumário

1. Conceitos Fundamentais
2. Sintaxe Detalhada e Uso Prático
    1. Dependências e Configuração Inicial
    2. Modelos de Representação (Resource Models)
    3. Criando e Adicionando Links
    4. Variações de Sintaxe e Abordagens (EntityModel, CollectionModel, PagedModel)
3. Cenários de Restrição ou Não Aplicação
4. Componentes Chave Associados
    1. Classes e Interfaces Principais
    2. Anotações Relevantes
    3. Métodos e Utilitários Importantes
5. Melhores Práticas e Padrões de Uso
6. Exemplo Prático Completo
    1. Projeto Simplificado “Book API”
    2. Estrutura de Pacotes
    3. Entidade, Repositório e Controller com HATEOAS
    4. Testando a API
7. Sugestões para Aprofundamento

---

## 1. Conceitos Fundamentais

- **HATEOAS (Hypermedia As The Engine Of Application State):**
    
    É um princípio REST que determina que cada resposta de recurso contenha informação suficiente (links) para explicar quais ações são possíveis a seguir. Assim, o cliente não precisa conhecer previamente toda a estrutura da API: ele descobre os próximos passos navegando pelos links embutidos nas respostas.
    
- **Representação de Recursos (Resource Representation):**
    
    Em vez de retornar apenas dados (por exemplo, JSON de uma entidade), utiliza-se um modelo que encapsula os atributos da entidade e, junto, um conjunto de *links*. Cada link informa:
    
    - **Rel:** String que define o relacionamento ou a “relação semântica” (por exemplo, “self”, “books”, “update”, “delete”).
    - **Href:** URI (URL) para aquele relacionamento ou ação.
- **EntityModel x RepresentationModel:**
    - `RepresentationModel` é uma classe base que contém apenas links (sem campos de domínio).
    - `EntityModel<T>` (subclasse de `RepresentationModel`) associa um objeto T (os dados da entidade) aos links.
    - `CollectionModel<T>` (ou `CollectionModel<EntityModel<T>>`) agrupa múltiplas entidades (modelos) com links de nível coleção.
- **Por que adicionar Link “self” e Links Relacionais?**
    - **“self”**: indica a própria URI do recurso. Facilita ao cliente saber exatamente onde acessar ou atualizar o recurso.
    - **Links Relacionais**: indicam ações associadas (por exemplo, “update”, “delete”, “lista de itens relacionados”). Permitem descoberta dinâmica das operações suportadas.

---

## 2. Sintaxe Detalhada e Uso Prático

### 2.1 Dependências e Configuração Inicial

1. **Adicionar dependência Maven/Gradle**
    
    No **pom.xml** (Maven):
    
    ```xml
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-hateoas</artifactId>
    </dependency>
    
    ```
    
    Ou no **build.gradle** (Gradle):
    
    ```groovy
    implementation 'org.springframework.boot:spring-boot-starter-hateoas'
    
    ```
    
2. **Configuração Base do Spring Boot**
    
    Geralmente, não é necessário adicionar nenhuma configuração extra além da dependência. O Spring Boot autoconfigura a infraestrutura de HATEOAS.
    

---

### 2.2 Modelos de Representação (Resource Models)

Em uma API REST normal, retorna-se apenas a entidade (por exemplo, um objeto `Book`). Com Spring HATEOAS, empacota-se esse objeto dentro de um `EntityModel<Book>` ou cria-se uma classe dedicada estendendo `RepresentationModel`.

### a) Usando `EntityModel<T>` diretamente

- **Vantagem:** Rápido para casos simples, sem precisar criar classes extras.
- **Exemplo:**
    
    ```java
    import org.springframework.hateoas.EntityModel;
    import org.springframework.hateoas.Link;
    import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;
    
    // Em algum método de controller:
    Book book = livroService.findById(id);
    EntityModel<Book> resource = EntityModel.of(book);
    resource.add(linkTo(methodOn(BookController.class).getBookById(id)).withSelfRel());
    resource.add(linkTo(methodOn(BookController.class).getAllBooks()).withRel("books"));
    return ResponseEntity.ok(resource);
    
    ```
    
    - `EntityModel.of(book)` encapsula o objeto `Book`.
    - `withSelfRel()` produz o link “self”.
    - `withRel("books")` adiciona link relacional para lista de todos os livros.

### b) Criando uma classe de Representation especializada

Quando há necessidade de incluir campos adicionais ou abstrair a criação de links, pode-se criar uma classe que estenda `RepresentationModel<NomeDoModel>`:

```java
import org.springframework.hateoas.RepresentationModel;

public class BookModel extends RepresentationModel<BookModel> {
    private Long id;
    private String title;
    private String author;
    // getters e setters
}

```

- Nesse caso, **não** importa diretamente a entidade de domínio. Pode-se mapear do `Book` (entidade JPA) para esse `BookModel` e depois adicionar links.

---

### 2.3 Criando e Adicionando Links

### 2.3.1 `WebMvcLinkBuilder`

É a principal classe utilitária para gerar links a partir de métodos de controllers:

- `linkTo(...)`: Recebe uma chamada de método via `methodOn(Controller.class).metodo(...)`
- `.withSelfRel()`: cria um link com o relacionamento “self” apontando para a própria URI.
- `.withRel("nome-do-relacionamento")`: cria um link relacional customizado.

### Exemplo Básico:

```java
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

public EntityModel<Book> toModel(Book book) {
    // Link “self”
    Link selfLink = linkTo(methodOn(BookController.class).getBookById(book.getId()))
                    .withSelfRel();
    // Link para lista de todos os livros
    Link collectionLink = linkTo(methodOn(BookController.class).getAllBooks())
                       .withRel("books");

    return EntityModel.of(book, selfLink, collectionLink);
}

```

- `methodOn(BookController.class).getBookById(...)` é uma “chamada simulada” que ajuda o `linkTo` a descobrir a rota mapeada naquele método.

### 2.3.2 Link Relacional com Vários Métodos HTTP

Às vezes, adiciona-se links que indicam outras operações (edição, deleção, etc.). Exemplo:

```java
// Link para atualizar (PUT /books/{id})
Link updateLink = linkTo(methodOn(BookController.class)
                      .updateBook(book.getId(), null))
                  .withRel("update");
// Link para deletar (DELETE /books/{id})
Link deleteLink = linkTo(methodOn(BookController.class)
                      .deleteBook(book.getId()))
                  .withRel("delete");

```

- Note que o segundo parâmetro `null` em `updateBook(book.getId(), null)` é apenas um placeholder para “Book” no método; o HATEOAS não utiliza esse valor, apenas a assinatura para deduzir a rota.

---

### 2.4 Variações de Sintaxe e Abordagens

1. **`EntityModel<T>` vs `CollectionModel<EntityModel<T>>`:**
    - Ao retornar uma lista de recursos, empacotar em `CollectionModel`, incluindo links de nível coleção:
        
        ```java
        @GetMapping("/books")
        public CollectionModel<EntityModel<Book>> getAllBooks() {
            List<EntityModel<Book>> books = bookService.findAll().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
            return CollectionModel.of(books,
                      linkTo(methodOn(BookController.class).getAllBooks()).withSelfRel());
        }
        
        ```
        
    - O link “self” a nível de coleção aponta novamente para `/books`.
2. **`PagedModel<EntityModel<T>>`:**
    - Se estiver usando paginação (por exemplo, com `Pageable` e `Page<T>`), converta para `PagedModel`:
        
        ```java
        @GetMapping("/books")
        public PagedModel<EntityModel<Book>> getAllBooks(Pageable pageable) {
            Page<Book> page = bookService.findAll(pageable);
            PagedModel<EntityModel<Book>> pagedModel = pagedResourcesAssembler
                .toModel(page, assembler); // assembler converte Book para EntityModel<Book>
            return pagedModel;
        }
        
        ```
        
    - O `PagedResourcesAssembler` gera automaticamente links de paginação (`first`, `prev`, `self`, `next`, `last`).
3. **`RepresentationModelAssembler<T, D>`:**
    - Padrão para separar a lógica de construção do modelo (EntityModel) do controller.
    - Exemplo:
    
    ```java
    import org.springframework.hateoas.server.RepresentationModelAssembler;
    import org.springframework.hateoas.EntityModel;
    
    @Component
    public class BookModelAssembler implements RepresentationModelAssembler<Book, EntityModel<Book>> {
        @Override
        public EntityModel<Book> toModel(Book book) {
            return EntityModel.of(book,
                linkTo(methodOn(BookController.class).getBookById(book.getId())).withSelfRel(),
                linkTo(methodOn(BookController.class).getAllBooks()).withRel("books"));
        }
    }
    
    ```
    
    - No controller, injeta-se o assembler:
        
        ```java
        @GetMapping("/books/{id}")
        public EntityModel<Book> getBookById(@PathVariable Long id) {
            Book book = bookService.findById(id);
            return bookModelAssembler.toModel(book);
        }
        
        ```
        

---

## 3. Cenários de Restrição ou Não Aplicação

1. **APIs Simples, Internas ou Prototipagem Rápida:**
    - Se o consumo for controlado (mesmo time) ou em protótipos, adicionar hiperlinks pode ser overhead desnecessário.
    - Equipes já combinadas podem preferir endpoints fixos (ex.: `/api/books/1`) sem a curva de aprendizado de HATEOAS.
2. **Desempenho e Payload Size:**
    - Cada link gera campos extras no JSON. Em aplicações de alto volume, isso pode resultar em payloads maiores.
    - Se o cliente ignora hiperlinks e usa apenas endpoints fixos, o overhead de processamento pode não compensar (apesar de geralmente ser pequeno).
3. **Cliente Não Suporta HATEOAS:**
    - Aplicações móveis ou scripts simples que não interpretam hiperlinks podem ignorar os campos de link. Se o cliente simplesmente mapeia JSON em objetos, os campos extras podem até gerar erros de desserialização, caso não estejam previstos.
4. **Arquitetura Orientada a Eventos (Event-Driven):**
    - Em sistemas que não se baseiam em requisição/response (por ex., Kafka, RabbitMQ), hiperlinks RESTful fazem menos sentido, pois não há navegação de recursos via HTTP.

---

## 4. Componentes Chave Associados

### 4.1 Classes e Interfaces Principais

- **`RepresentationModel<T>`**
    - Classe base para modelos que contêm links. T é o próprio tipo da subclasse.
    - Méto­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­________________________________ zzz
- **`EntityModel<T>`**
    - Extende `RepresentationModel<EntityModel<T>>`. Armazena um objeto T e permite adicionar links.
- **`CollectionModel<T>`**
    - Para representar listas (coleções) de recursos. Geralmente T = `EntityModel<AlgumaClasse>`.
- **`PagedModel<T>`**
    - Especialização de `CollectionModel` com metadados de paginação (`size`, `totalElements`, `totalPages`, etc.) e links específicos de navegação entre páginas.
- **`Link`**
    - Representa um link hipertexto. Contém `href`, `rel`, e opcionalmente atributos como `type`, `title` etc.
    - Construtores típicos:
        
        ```java
        Link.of("http://api/meu-recurso", "self");
        
        ```
        
- **`WebMvcLinkBuilder`**
    - Classe utilitária com métodos estáticos `linkTo(...)`, `methodOn(...)` e `slash(...)` para montar `Link` a partir de métodos de controllers.
- **`RepresentationModelAssembler<S, D>`**
    - Interface: converte uma entidade de domínio `S` em um recurso hal (por ex., `EntityModel<S>`), definindo onde adicionar os links.

---

### 4.2 Anotações Relevantes

- **`@RestController` / `@Controller`**
    - Nos métodos anotados com `@GetMapping`, `@PostMapping` etc., chama-se `EntityModel`, `CollectionModel` ou outro modelo HATEOAS para resposta.
- **`@RequestMapping` / `@GetMapping` / `@PostMapping` …**
    - Cada método de controller que será referenciado pelo `linkTo(methodOn(...))`.
- **`@Component`** (ou `@Service`) para Assemblers
    - Assemblers costumam ser beans Spring para injeção nos controllers.
- **(Opcional) `@Relation`**
    - Coloca metadados no tipo de relação padrão. Por exemplo:
        
        ```java
        @Relation(collectionRelation = "books")
        public class BookModel extends RepresentationModel<BookModel> { ... }
        
        ```
        
    - Se usado, o JSON gerado projetará automaticamente as coleções com `"books": [...]` em vez de `"content": [...]`.

---

### 4.3 Métodos e Utilitários Importantes

- **`linkTo(...)`**
    - Retorna um `LinkBuilder` que sabe gerar URIs baseadas no contexto do `DispatcherServlet`.
- **`methodOn(Controller.class).metodo(args…)`**
    - Auxilia `linkTo` a localizar qual rota (URL) está mapeada naquele método.
- **`.withSelfRel()` / `.withRel(String rel)`**
    - Define o atributo `rel` do link. “self” por convenção representa a própria URI do recurso.
- **`EntityModel.of(objeto, Link... links)`**
    - Cria diretamente um `EntityModel`, anexando o(s) link(s) fornecido(s).
    - Alternativa: `EntityModel<T> model = new EntityModel<>(objeto); model.add(links...);`
- **`CollectionModel.of(listaDeEntityModels, Link… links)`**
    - Empacota múltiplas representações, permitindo adicionar links de nível coleção (ex.: “self”, “next-page”, etc.).
- **`PagedResourcesAssembler<T>` & `PagedModel<?>`**
    - Para converter um `Page<T>` em `PagedModel<EntityModel<T>>` automaticamente, incluindo links de paginação.

---

## 5. Melhores Práticas e Padrões de Uso

1. **Separar Lógica de Montagem de Links em Assemblers**
    - Crie classes que implementam `RepresentationModelAssembler<S, D>` para cada entidade de domínio. Isso mantém o controller mais limpo:
        
        ```java
        @Component
        public class BookModelAssembler implements RepresentationModelAssembler<Book, EntityModel<Book>> { … }
        
        ```
        
    - No controller, basta injetar e chamar `assembler.toModel(book)`.
2. **Usar Nomemclaturas de Relações Padronizadas**
    - Relações comuns:
        - `"self"`
        - `"collection"` ou `"books"` (para coleções do mesmo recurso)
        - `"update"`, `"delete"`, `"create"` (para ações)
        - `"next"`, `"prev"`, `"first"`, `"last"` (para paginação)
    - Isso ajuda clientes a interpretar links de forma consistente.
3. **Não Expor Métodos Desnecessários**
    - Exiba apenas links que façam sentido de acordo com o estado do recurso. Por exemplo, se um recurso está finalizado, talvez não faça sentido adicionar link “update”.
4. **Evitar Lógica Complexa nos Controllers**
    - Delegate para serviços a obtenção de dados. Controllers devem apenas orquestrar: obter entidade, chamar assembler, retornar recurso.
5. **Documentação e Versionamento**
    - Inclua descrições de cada relação em uma documentação (Swagger/OpenAPI).
    - Caso a API evolua, mantenha versionamento na URI (por ex. `/api/v1/books`), para evitar quebrar consumos antigos.
6. **Uso de Affordances (em versões mais avançadas do Spring HATEOAS)**
    - Permitem informar, no link, qual método HTTP e qual schema de payload o cliente deve usar para aquela ação. (Ex.: `.withType("PUT")`, `.withTitle("Atualizar Livro")`).
    - Embora sejam poderosos, só os use se realmente precisar guiar o cliente no tipo de requisição.
7. **Respeitar Princípios REST**
    - Cada link deve apontar para recursos ou ações que façam sentido do ponto de vista da navegação.
    - Evite incluir URIs internas (endpoints de segurança, debug) nos links públicos.

---

## 6. Exemplo Prático Completo

A seguir, um exemplo ponta a ponta de uma API simplificada de “Book” com Spring Boot + Spring HATEOAS.

### 6.1 Estrutura de Pacotes

```
src/main/java/com/exemplo/bookapi/
├── BookApiApplication.java
├── controller/
│   └── BookController.java
├── model/
│   └── Book.java
├── repository/
│   └── BookRepository.java
├── assembler/
│   └── BookModelAssembler.java
└── exception/
    └── BookNotFoundException.java

```

### 6.2 Entidade `Book`

```java
package com.exemplo.bookapi.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Book {
    @Id @GeneratedValue
    private Long id;
    private String title;
    private String author;

    // Construtores, getters e setters omitidos para brevidade
}

```

### 6.3 Repositório `BookRepository`

```java
package com.exemplo.bookapi.repository;

import com.exemplo.bookapi.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // CRUD básico herdado do JpaRepository
}

```

### 6.4 Exceção `BookNotFoundException`

```java
package com.exemplo.bookapi.exception;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(Long id) {
        super("Book not found: " + id);
    }
}

```

### 6.5 Assembler `BookModelAssembler`

```java
package com.exemplo.bookapi.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.exemplo.bookapi.controller.BookController;
import com.exemplo.bookapi.model.Book;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
public class BookModelAssembler implements RepresentationModelAssembler<Book, EntityModel<Book>> {

    @Override
    public EntityModel<Book> toModel(Book book) {
        // Cria EntityModel e adiciona links
        return EntityModel.of(book,
            // Link “self” (GET /books/{id})
            linkTo(methodOn(BookController.class).getBookById(book.getId())).withSelfRel(),
            // Link para coleção (GET /books)
            linkTo(methodOn(BookController.class).getAllBooks()).withRel("books"),
            // Link para atualizar (PUT /books/{id})
            linkTo(methodOn(BookController.class).updateBook(book.getId(), null)).withRel("update"),
            // Link para deletar (DELETE /books/{id})
            linkTo(methodOn(BookController.class).deleteBook(book.getId())).withRel("delete")
        );
    }
}

```

### 6.6 Controller `BookController`

```java
package com.exemplo.bookapi.controller;

import com.exemplo.bookapi.assembler.BookModelAssembler;
import com.exemplo.bookapi.exception.BookNotFoundException;
import com.exemplo.bookapi.model.Book;
import com.exemplo.bookapi.repository.BookRepository;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookRepository repository;
    private final BookModelAssembler assembler;

    public BookController(BookRepository repository, BookModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    /** GET /books **/
    @GetMapping
    public CollectionModel<EntityModel<Book>> getAllBooks() {
        List<EntityModel<Book>> books = repository.findAll().stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());

        return CollectionModel.of(
            books,
            // Link “self” para /books
            linkTo(methodOn(BookController.class).getAllBooks()).withSelfRel()
        );
    }

    /** GET /books/{id} **/
    @GetMapping("/{id}")
    public EntityModel<Book> getBookById(@PathVariable Long id) {
        Book book = repository.findById(id)
            .orElseThrow(() -> new BookNotFoundException(id));
        return assembler.toModel(book);
    }

    /** POST /books **/
    @PostMapping
    public ResponseEntity<EntityModel<Book>> createBook(@RequestBody Book newBook) {
        Book saved = repository.save(newBook);
        EntityModel<Book> resource = assembler.toModel(saved);

        // Retorna HTTP 201 Created com header Location apontando para o recurso criado
        return ResponseEntity
                .created(resource.getRequiredLink("self").toUri())
                .body(resource);
    }

    /** PUT /books/{id} **/
    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Book>> updateBook(
            @PathVariable Long id,
            @RequestBody Book updatedBook) {

        Book book = repository.findById(id)
            .map(existing -> {
                existing.setTitle(updatedBook.getTitle());
                existing.setAuthor(updatedBook.getAuthor());
                return repository.save(existing);
            })
            .orElseGet(() -> {
                updatedBook.setId(id);
                return repository.save(updatedBook);
            });

        EntityModel<Book> resource = assembler.toModel(book);
        return ResponseEntity.ok(resource);
    }

    /** DELETE /books/{id} **/
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new BookNotFoundException(id);
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

```

### 6.7 Testando a API

1. **GET /books**
    
    ```json
    {
      "_embedded": {
        "bookList": [
          {
            "id": 1,
            "title": "Domain-Driven Design",
            "author": "Eric Evans",
            "_links": {
              "self": { "href": "http://localhost:8080/books/1" },
              "books": { "href": "http://localhost:8080/books" },
              "update": { "href": "http://localhost:8080/books/1" },
              "delete": { "href": "http://localhost:8080/books/1" }
            }
          },
          {
            "id": 2,
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "_links": {
              "self": { "href": "http://localhost:8080/books/2" },
              "books": { "href": "http://localhost:8080/books" },
              "update": { "href": "http://localhost:8080/books/2" },
              "delete": { "href": "http://localhost:8080/books/2" }
            }
          }
        ]
      },
      "_links": {
        "self": { "href": "http://localhost:8080/books" }
      }
    }
    
    ```
    
    - O array interno (`_embedded.bookList`) contém cada `EntityModel<Book>` com seus links “self”, “books”, “update” e “delete”.
2. **GET /books/1**
    
    ```json
    {
      "id": 1,
      "title": "Domain-Driven Design",
      "author": "Eric Evans",
      "_links": {
        "self": { "href": "http://localhost:8080/books/1" },
        "books": { "href": "http://localhost:8080/books" },
        "update": { "href": "http://localhost:8080/books/1" },
        "delete": { "href": "http://localhost:8080/books/1" }
      }
    }
    
    ```
    
    - Por ser um único recurso, não há wrapper `_embedded`; o JSON traz diretamente os campos do `Book` seguidos de `_links`.
3. **POST /books**
    - Request Body:
        
        ```json
        {
          "title": "Refactoring",
          "author": "Martin Fowler"
        }
        
        ```
        
    - Response HTTP 201 Created
        - Header `Location: http://localhost:8080/books/3`
        - Body (EntityModel):
            
            ```json
            {
              "id": 3,
              "title": "Refactoring",
              "author": "Martin Fowler",
              "_links": {
                "self": { "href": "http://localhost:8080/books/3" },
                "books": { "href": "http://localhost:8080/books" },
                "update": { "href": "http://localhost:8080/books/3" },
                "delete": { "href": "http://localhost:8080/books/3" }
              }
            }
            
            ```
            
4. **PUT /books/1**
    - Request Body (exemplo):
        
        ```json
        {
          "title": "Domain-Driven Design: Tackling Complexity in the Heart of Software",
          "author": "Eric Evans"
        }
        
        ```
        
    - Response HTTP 200 OK com EntityModel atualizado.
5. **DELETE /books/1**
    - Response HTTP 204 No Content (sem corpo).

---

## 7. Sugestões para Aprofundamento

- **Affordances e Data Shapes (YAML/JSON-LD):**
    
    Explorar como tornar links mais explícitos, informando tipo de método HTTP, formato do payload esperado e esquema de resposta.
    
- **Spring Data REST + HATEOAS:**
    
    Combina Spring Data Repositories automáticos com HATEOAS out-of-the-box, gerando links de recursos sem muito código manual.
    
- **HalForms e HAL+JSON:**
    
    Aprender sobre formatos alternativos de hypermedia que incluem templates de formulários (HAL-FORMS), auxiliando geração de clientes dinâmicos.
    
- **Segurança (Spring Security) em APIs HATEOAS:**
    
    Incluir autenticação/autorização, garantindo que o usuário só receba links para operações permitidas pelo seu papel.
    
- **Customizando Serialização com Jackson:**
    
    Ajustar como os links e recursos são serializados, incluindo remoção de campos privados, renomeação de atributos, etc.
    

---

> Resumo Final:
> 
> 1. **Objetivo:** Enriquecer respostas REST com links “self” e relacionais, seguindo o padrão HATEOAS.
> 2. **Como fazer:**
>     - Adicionar a dependência `spring-boot-starter-hateoas`.
>     - Envolver entidades usando `EntityModel<T>` ou estendendo `RepresentationModel`.
>     - Utilizar `WebMvcLinkBuilder.linkTo(methodOn(...))` para criar links “self” e relacionais.
>     - Adotar `RepresentationModelAssembler` para separar a lógica de montagem de links do controller.
> 3. **Benefícios:** Descoberta dinâmica de rotas, menor acoplamento entre cliente e servidor, maior aderência aos princípios REST.
> 4. **Cuidados:** Payload maior, complexidade adicional para clientes simples, e cenários onde hiperlinks são desnecessários.

Assim, seguindo este guia, você terá uma API Spring Boot completamente HATEOAS-enabled, capaz de fornecer instruções claras a clientes sobre como navegar e interagir com seus recursos.