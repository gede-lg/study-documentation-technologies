# Criação de Links Condicionais

## Introdução

Em arquiteturas REST, a ideia de **HATEOAS** (Hypermedia As The Engine Of Application State) incentiva que as respostas contenham não apenas dados, mas também *links* (hipermídia) que direcionem o cliente para as próximas possíveis ações. No **Spring Boot**, a biblioteca **Spring HATEOAS** fornece recursos para enriquecer as representações de recursos com links. Este guia aborda padrões avançados e coleções de recursos, enfocando especialmente a **criação de links condicionais**—isto é, adicionar links somente quando certas condições de negócio ou de contexto forem atendidas.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
    
    1.1. O que é HATEOAS?
    
    1.2. Por que usar links condicionais?
    
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Principais classes do Spring HATEOAS
    
    2.2. Criando recursos com `EntityModel` e `CollectionModel`
    
    2.3. WebMvcLinkBuilder e `linkTo(methodOn(...))`
    
    2.4. Adição de links condicionais
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    
    4.1. Anotações relevantes
    
    4.2. Classes e interfaces principais
    
    4.3. Métodos e atributos cruciais
    
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
    
    5.1. Organizar a lógica de montagem de links
    
    5.2. Uso de *Resource Assemblers* (Assemblers de recursos)
    
    5.3. Testes e validações de links
    
    5.4. Performance e escalabilidade
    
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    
    6.1. Cenário: API de Livros com links condicionais
    
    6.2. Estrutura de pacotes e dependências
    
    6.3. Entidade `Book`
    
    6.4. Repositório `BookRepository`
    
    6.5. Resource Assembler (`BookModelAssembler`)
    
    6.6. Controller (`BookController`)
    
    6.7. Execução e testes
    
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 1. Conceitos Fundamentais

### 1.1. O que é HATEOAS?

- **HATEOAS** (Hypermedia As The Engine Of Application State) faz parte dos princípios REST e defende que as representações de recursos devem incluir hipermídia (links) para orientar o cliente sobre quais ações são possíveis a partir daquele estado.
- Em vez de devolver apenas JSON com dados estáticos, a API entrega também URLs navegáveis (por exemplo, `self`, `next`, `prev`, `update`, etc.), permitindo que o cliente descubra programaticamente como interagir com o serviço.

### 1.2. Por que usar links condicionais?

- **Contextualização de negócio**: só faz sentido expor links de atualização, exclusão ou anexos adicionais quando o recurso está em determinado estado ou quando o usuário possui permissão adequada.
- **Segurança e usabilidade**: evita que clientes executem ações inválidas (por exemplo, atualizar algo que está “fechado” ou “arquivado”).
- **Flexibilidade**: torna a API mais expressiva, pois o próprio payload orienta o cliente sobre o que ele pode (ou não) fazer em seguida.

---

## 2. Sintaxe Detalhada e Uso Prático

### 2.1. Principais classes do Spring HATEOAS

- **`EntityModel<T>`**
    - Envolve uma instância de recurso (por exemplo, um objeto de domínio) e permite adicionar links a ela.
    - Uso básico:
        
        ```java
        EntityModel<Book> resource = EntityModel.of(book);
        
        ```
        
- **`CollectionModel<T>`**
    - Representa uma coleção de recursos (`EntityModel<T>`) e também permite adicionar links ao nível da coleção.
    - Uso básico:
        
        ```java
        List<EntityModel<Book>> livrosModel = livros.stream()
            .map(bookAssembler::toModel)
            .collect(Collectors.toList());
        
        CollectionModel<EntityModel<Book>> collectionModel =
            CollectionModel.of(livrosModel);
        
        ```
        
- **`PagedModel<T>`** (opcional)
    - Quando você utiliza paginação, pode retornar `PagedModel<EntityModel<T>>` para incluir metadata de página (`page`, `size`, `totalElements`) e links de navegação (`first`, `self`, `next`, `prev`, `last`).
- **`Link`**
    - Representa um hiperlink com atributos como `rel` (“relation”, p. ex. “self”, “update”) e `href`.
    - Você pode criar manualmente:
        
        ```java
        Link link = Link.of("http://localhost:8080/books/1", "self");
        
        ```
        

### 2.2. Criando recursos com `EntityModel` e `CollectionModel`

1. **Montar um único recurso**:
    
    ```java
    Book book = bookRepository.findById(id)
            .orElseThrow(() -> new BookNotFoundException(id));
    EntityModel<Book> model = EntityModel.of(book);
    
    // Adiciona um link “self”
    model.add(linkTo(methodOn(BookController.class).getBookById(id))
                    .withSelfRel());
    
    ```
    
2. **Montar uma lista de recursos**:
    
    ```java
    List<Book> livros = bookRepository.findAll();
    List<EntityModel<Book>> livrosModel = livros.stream()
        .map(book -> {
            EntityModel<Book> m = EntityModel.of(book);
            m.add(linkTo(methodOn(BookController.class).getBookById(book.getId()))
                      .withSelfRel());
            return m;
        })
        .collect(Collectors.toList());
    
    CollectionModel<EntityModel<Book>> collectionModel =
        CollectionModel.of(livrosModel,
            linkTo(methodOn(BookController.class).getAllBooks())
                .withSelfRel());
    
    ```
    

### 2.3. WebMvcLinkBuilder e `linkTo(methodOn(...))`

- A classe **`WebMvcLinkBuilder`** oferece métodos estáticos para criar links de forma fluente:
    - `WebMvcLinkBuilder.linkTo(...)` recebe um retorno de `methodOn(ClasseController.class).método(...)`.
    - `methodOn(ClasseController.class)` é um *proxy* que recria a URL baseada nas anotações `@RequestMapping`.
- Exemplo simplificado:
    
    ```java
    Link selfLink = linkTo(methodOn(BookController.class)
                      .getBookById(book.getId()))
                    .withSelfRel();
    
    ```
    
- Você pode adicionar parâmetros de query, variáveis de caminho, etc., diretamente no método.

### 2.4. Adição de links condicionais

Para incluir links apenas quando determinadas condições forem satisfeitas, basta envolver a chamada de `add(...)` em um bloco condicional:

```java
EntityModel<Book> model = EntityModel.of(book);

// Link sempre presente: self
model.add(linkTo(methodOn(BookController.class)
          .getBookById(book.getId()))
      .withSelfRel());

// Link condicional: somente se o livro não estiver “archived”
if (!book.isArchived()) {
    model.add(linkTo(methodOn(BookController.class)
              .updateBook(book.getId(), null))
          .withRel("update"));
}

// Link condicional de exclusão: somente para usuários com papel ROLE_ADMIN
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

if (isAdmin) {
    model.add(linkTo(methodOn(BookController.class)
              .deleteBook(book.getId()))
          .withRel("delete"));
}

```

- **Lógica de domínio** (por exemplo, `book.isArchived()`): determina se aquele recurso está num estado que deve ou não permitir atualização/exclusão.
- **Lógica de segurança** (verificar `Authentication`): só adiciona o link se o usuário tiver a permissão necessária.

---

## 3. Cenários de Restrição ou Não Aplicação

1. **API Interna ou sem clientes HATEOAS**
    - Se todos os consumidores da API forem sistemas internos ou não precisarem de hipermídia, pode ser um overhead desnecessário incluir links HATEOAS.
    - Em APIs onde a navegação por hiperlinks não agregue valor real, pode-se optar por JSON simples.
2. **Simplicidade e Performance**
    - Em cenários de alto volume de chamadas (milhares de requisições por segundo), a geração de links pode representar custo extra de tempo e memória.
    - Se houver restrições de latência muito rigorosas, pode-se optar por devolver apenas URIs essenciais.
3. **Falta de suporte do cliente**
    - Aplicações front-end ou consumidores que não compreendem ou não usam os links HATEOAS (por ex., clientes mobiles que já vêm com URIs fixas).
    - Se o cliente estiver “hardcoded” para certas rotas, o benefício do HATEOAS cai consideravelmente.

---

## 4. Componentes Chave Associados

### 4.1. Anotações Relevantes

- `@RestController` / `@Controller`
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
    - Definem endpoints REST.
- `@ResponseStatus`
    - Permite customizar o código HTTP de retorno.
- `@RepresentationModelTest` (para testes)

### 4.2. Classes e Interfaces Principais

- **`RepresentationModel<T>`**
    - Classe base para recursos que podem conter links.
- **`EntityModel<T>`** (anteriormente `Resource<T>`)
    - Encapsula uma instância de domínio com links.
- **`CollectionModel<T>`** (anteriormente `Resources<T>`)
    - Representação de coleção de recursos com links de coleção.
- **`PagedModel<T>`**
    - Para coleções paginadas, contém metadados de paginação e links relacionados.
- **`Link`**
    - Representação de hiperlink. Possui atributos como `rel`, `href`, `type`, entre outros.
- **`WebMvcLinkBuilder`**
    - Classe utilitária para criação de links com base nos métodos de controladores.
- **`RepresentationModelAssembler<T, D extends RepresentationModel<?>>`**
    - Interface para classes que convertem entidades de domínio em `RepresentationModel` (ou subclasses).
    - Método principal: `D toModel(T entity)`.

### 4.3. Métodos e Atributos Cruciais

- **`RepresentationModel.add(Link...)`**
    - Adiciona um ou mais links ao modelo.
- **`linkTo(...)`**
    - Retorna um `WebMvcLinkBuilder` com base no *proxy* gerado por `methodOn(...)`.
- **`withSelfRel()`, `withRel(String)`**
    - Especificam a relação (`rel`) do link (por ex., `"self"`, `"update"`, `"delete"`).
- **`withType(String)`** (opcional)
    - Especifica o `type` (tipo de mídia ou verbo HTTP preferido).
- **`methodOn(Class<?> controllerClass)`**
    - Cria um *proxy* que permite a construção de URLs baseadas nas anotações do controlador.

---

## 5. Melhores Práticas e Padrões de Uso

### 5.1. Organizar a lógica de montagem de links

- **Separação de responsabilidade**:
    - Mantenha a lógica de construção de links desacoplada do *Controller*. Crie classes ou assemblers dedicados para converter sua entidade em modelo HATEOAS.
- **Exemplo**:
    
    ```java
    // Não faça isso diretamente no método do Controller:
    // model.add(linkTo(...).withRel("update"));
    // Em vez disso, use BookModelAssembler (ver seção 6).
    
    ```
    

### 5.2. Uso de Resource Assemblers (Assemblers de recursos)

- **`RepresentationModelAssembler<T, D>`**
    - Crie uma classe que implemente essa interface para cada entidade.
    - Centraliza:
        - Lógica de mapeamento do objeto de domínio para `EntityModel<T>`.
        - Decisões de quais links devem ser adicionados (incluindo links condicionais).
- **Benefícios**:
    - Evita duplicação de código;
    - Facilita testes unitários dos links;
    - Facilita manutenção quando endpoints mudam.

### 5.3. Testes e validações de links

- **Unit tests**:
    - Teste o assembler isoladamente, garantindo que, dado um objeto de domínio em certo estado, os links esperados (ou não) sejam gerados.
    - Utilize anotações como `@WebMvcTest` para verificar respostas HTTP e estrutura de links.
- **Integração**:
    - Teste junto à aplicação para garantir que as rotas geradas batem com o que está configurado nos controladores.

### 5.4. Performance e escalabilidade

- **Evitar lógica complexa no runtime**:
    - Se tomar decisões de links condicionais exigir consultas adicionais ao banco, prefira carregar antecipadamente o estado necessário (por ex., trazer `status` ou `roles`) junto com a entidade.
- **Paginando coleções grandes**:
    - Use `PagedModel` para evitar devolver listas enormes em memória.
    - Inclua apenas o subconjunto de links necessários por página (ex.: `first`, `self`, `next`, `prev`, `last`).

---

## 6. Exemplo Prático Completo

### 6.1. Cenário: API de Livros com links condicionais

- Desejamos criar uma API REST para gerenciar livros (`Book`). Cada livro tem atributos como `id`, `title`, `author`, `published`, `archived` (boolean).
- Regras de negócio para links condicionais:
    1. **Link `update`**: só deve aparecer se `archived == false`.
    2. **Link `delete`**: só aparece para usuários com permissão `ROLE_ADMIN`.
    3. **Link `borrow`**: só aparece se `published == true` e quantidade em estoque (`stock > 0`).

A resposta deve incluir:

- **Links sempre presentes**:
    - `self` (link para obter detalhes do livro)
    - `all-books` (link para lista de todos os livros)
- **Links condicionais** descritos acima.

### 6.2. Estrutura de pacotes e dependências

```
src/main/java
└── com
    └── example
        ├── BookApiApplication.java
        ├── controller
        │   └── BookController.java
        ├── domain
        │   └── Book.java
        ├── assembler
        │   └── BookModelAssembler.java
        ├── repository
        │   └── BookRepository.java
        └── exception
            └── BookNotFoundException.java

```

### Dependências no `pom.xml` (trechos relevantes)

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring HATEOAS -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-hateoas</artifactId>
    </dependency>

    <!-- Spring Data JPA e H2 (banco em memória para exemplo) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Spring Security (para demonstração de ROLE_ADMIN) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Para teste -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>

```

### 6.3. Entidade `Book`

```java
package com.example.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private boolean published;
    private boolean archived;
    private int stock;

    // Construtores, getters e setters omitidos para brevidade

    public Book() {}

    public Book(String title, String author, boolean published, boolean archived, int stock) {
        this.title = title;
        this.author = author;
        this.published = published;
        this.archived = archived;
        this.stock = stock;
    }

    // Getters e Setters...
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public boolean isPublished() { return published; }
    public boolean isArchived() { return archived; }
    public int getStock() { return stock; }

    public void setTitle(String title) { this.title = title; }
    public void setAuthor(String author) { this.author = author; }
    public void setPublished(boolean published) { this.published = published; }
    public void setArchived(boolean archived) { this.archived = archived; }
    public void setStock(int stock) { this.stock = stock; }
}

```

### 6.4. Repositório `BookRepository`

```java
package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.domain.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
    // Métodos customizados podem ser adicionados aqui (por exemplo, findByPublishedTrue)
}

```

### 6.5. Resource Assembler (`BookModelAssembler`)

```java
package com.example.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.example.controller.BookController;
import com.example.domain.Book;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class BookModelAssembler implements RepresentationModelAssembler<Book, EntityModel<Book>> {

    @Override
    public EntityModel<Book> toModel(Book book) {
        EntityModel<Book> model = EntityModel.of(book);

        // Link 'self': sempre presente
        model.add(linkTo(methodOn(BookController.class)
                          .getBookById(book.getId()))
                  .withSelfRel());

        // Link 'all-books': lista todos
        model.add(linkTo(methodOn(BookController.class)
                          .getAllBooks())
                  .withRel("all-books"));

        // Link condicional: 'update' se não estiver arquivado
        if (!book.isArchived()) {
            model.add(linkTo(methodOn(BookController.class)
                              .updateBook(book.getId(), null))
                      .withRel("update"));
        }

        // Link condicional: 'delete' somente para ROLE_ADMIN
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            model.add(linkTo(methodOn(BookController.class)
                              .deleteBook(book.getId()))
                      .withRel("delete"));
        }

        // Link condicional: 'borrow' se publicado e estoque > 0
        if (book.isPublished() && book.getStock() > 0) {
            model.add(linkTo(methodOn(BookController.class)
                              .borrowBook(book.getId()))
                      .withRel("borrow"));
        }

        return model;
    }
}

```

> Comentário:
> 
> - A classe implementa `RepresentationModelAssembler<Book, EntityModel<Book>>`, forçando a implementação de `toModel(Book book)`.
> - Dentro do método, primeiro encapsulamos a entidade em `EntityModel.of(book)` e, em seguida, adicionamos links que sejam sempre válidos e outros links condicionais (negócio e segurança).

### 6.6. Controller (`BookController`)

```java
package com.example.controller;

import com.example.assembler.BookModelAssembler;
import com.example.domain.Book;
import com.example.exception.BookNotFoundException;
import com.example.repository.BookRepository;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.MediaTypes;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping(value = "/api/books", produces = MediaTypes.HAL_JSON_VALUE)
public class BookController {

    private final BookRepository bookRepository;
    private final BookModelAssembler assembler;

    public BookController(BookRepository bookRepository, BookModelAssembler assembler) {
        this.bookRepository = bookRepository;
        this.assembler = assembler;
    }

    /**
     * 1. Listar todos os livros
     */
    @GetMapping
    public CollectionModel<EntityModel<Book>> getAllBooks() {
        List<EntityModel<Book>> livrosModel = bookRepository.findAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        // Constrói a coleção com link ‘self’
        return CollectionModel.of(livrosModel,
                linkTo(methodOn(BookController.class).getAllBooks()).withSelfRel());
    }

    /**
     * 2. Obter livro por ID
     */
    @GetMapping("/{id}")
    public EntityModel<Book> getBookById(@PathVariable Long id) {
        Book book = bookRepository.findById(id)
                          .orElseThrow(() -> new BookNotFoundException(id));
        return assembler.toModel(book);
    }

    /**
     * 3. Criar um novo livro
     */
    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody Book newBook) {
        Book savedBook = bookRepository.save(newBook);
        EntityModel<Book> model = assembler.toModel(savedBook);

        // Retorna 201 Created com o link para o recurso criado
        URI uri = URI.create(model.getRequiredLink(IanaLinkRelations.SELF).getHref());
        return ResponseEntity.created(uri).body(model);
    }

    /**
     * 4. Atualizar um livro (condicional: só se !archived)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(
            @PathVariable Long id,
            @RequestBody Book bookUpdates) {

        Book book = bookRepository.findById(id)
                          .orElseThrow(() -> new BookNotFoundException(id));

        if (book.isArchived()) {
            // 409 Conflict se tentar atualizar um livro arquivado
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("Cannot update an archived book.");
        }

        // Atualiza campos
        book.setTitle(bookUpdates.getTitle());
        book.setAuthor(bookUpdates.getAuthor());
        book.setPublished(bookUpdates.isPublished());
        book.setStock(bookUpdates.getStock());
        // (não alteramos o campo 'archived' aqui, por exemplo)

        Book updated = bookRepository.save(book);
        EntityModel<Book> model = assembler.toModel(updated);

        return ResponseEntity.ok(model);
    }

    /**
     * 5. Excluir um livro (condicional: ROLE_ADMIN)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        Book book = bookRepository.findById(id)
                          .orElseThrow(() -> new BookNotFoundException(id));
        bookRepository.delete(book);
        return ResponseEntity.noContent().build();
    }

    /**
     * 6. Empréstimo de livro (condicional: published && stock > 0)
     */
    @PostMapping("/{id}/borrow")
    public ResponseEntity<?> borrowBook(@PathVariable Long id) {
        Book book = bookRepository.findById(id)
                          .orElseThrow(() -> new BookNotFoundException(id));

        if (!book.isPublished() || book.getStock() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Cannot borrow a book that is not published or out of stock.");
        }

        // Lógica de empréstimo (ex.: decrementa estoque)
        book.setStock(book.getStock() - 1);
        Book updated = bookRepository.save(book);

        EntityModel<Book> model = assembler.toModel(updated);
        return ResponseEntity.ok(model);
    }
}

```

> Comentários importantes
> 
> - O método `getAllBooks()` retorna uma `CollectionModel` contendo vários `EntityModel<Book>`.
> - Os métodos `updateBook`, `deleteBook` e `borrowBook` guardam as regras de negócio que justificam a aparição ou não dos *links* correspondentes.
> - Anotação `@PreAuthorize("hasRole('ADMIN')")` garante que somente administradores possam chamar `deleteBook`.
> - O controlador produz respostas com mídia `application/hal+json` (HAL).

### 6.7. Execução e testes

1. **Inicialização da aplicação**
    - Execute `BookApiApplication.java` como uma aplicação Spring Boot.
    - Acesso ao H2 Console (se habilitado) para inspeção de dados em `http://localhost:8080/h2-console` (URL padrão).
2. **Inserção de dados de exemplo**
    - Através de um *script* `data.sql` (no `src/main/resources`), você pode pré-carregar alguns livros:
        
        ```sql
        INSERT INTO BOOK (ID, TITLE, AUTHOR, PUBLISHED, ARCHIVED, STOCK) VALUES
          (1, 'Clean Code', 'Robert C. Martin', TRUE, FALSE, 5),
          (2, 'Domain-Driven Design', 'Eric Evans', TRUE, TRUE, 0),
          (3, 'Spring in Action', 'Craig Walls', FALSE, FALSE, 10);
        
        ```
        
3. **Testando com `curl`**
    - **Listar todos os livros**
        
        ```
        curl -i http://localhost:8080/api/books
        
        ```
        
        *Resposta parcial esperada*:
        
        ```json
        {
          "_embedded": {
            "bookList": [
              {
                "id": 1,
                "title": "Clean Code",
                "author": "Robert C. Martin",
                "published": true,
                "archived": false,
                "stock": 5,
                "_links": {
                  "self": { "href": "http://localhost:8080/api/books/1" },
                  "all-books": { "href": "http://localhost:8080/api/books" },
                  "update": { "href": "http://localhost:8080/api/books/1" },
                  "borrow": { "href": "http://localhost:8080/api/books/1/borrow" }
                }
              },
              {
                "id": 2,
                "title": "Domain-Driven Design",
                "author": "Eric Evans",
                "published": true,
                "archived": true,
                "stock": 0,
                "_links": {
                  "self": { "href": "http://localhost:8080/api/books/2" },
                  "all-books": { "href": "http://localhost:8080/api/books" }
                  // NÃO há link "update" nem "borrow", pois está arquivado e sem estoque
                }
              },
              {
                "id": 3,
                "title": "Spring in Action",
                "author": "Craig Walls",
                "published": false,
                "archived": false,
                "stock": 10,
                "_links": {
                  "self": { "href": "http://localhost:8080/api/books/3" },
                  "all-books": { "href": "http://localhost:8080/api/books" },
                  "update": { "href": "http://localhost:8080/api/books/3" }
                  // NÃO há link "borrow", pois não está publicado
                }
              }
            ]
          },
          "_links": {
            "self": { "href": "http://localhost:8080/api/books" }
          }
        }
        
        ```
        
    - **Obter um livro específico**
        
        ```
        curl -i http://localhost:8080/api/books/1
        
        ```
        
        *Resposta parcial esperada*:
        
        ```json
        {
          "id": 1,
          "title": "Clean Code",
          "author": "Robert C. Martin",
          "published": true,
          "archived": false,
          "stock": 5,
          "_links": {
            "self": { "href": "http://localhost:8080/api/books/1" },
            "all-books": { "href": "http://localhost:8080/api/books" },
            "update": { "href": "http://localhost:8080/api/books/1" },
            "borrow": { "href": "http://localhost:8080/api/books/1/borrow" }
          }
        }
        
        ```
        
    - **Tentar atualizar um livro arquivado**
        
        ```
        curl -i -X PUT -H "Content-Type: application/json" \
          -d '{"title":"DDD Updated","author":"Eric Evans","published":true,"archived":true,"stock":0}' \
          http://localhost:8080/api/books/2
        
        ```
        
        *Resposta:*
        
        - `409 Conflict` com mensagem “Cannot update an archived book.”
    - **Tentar excluir com usuário sem ROLE_ADMIN**
        - Sem autenticação ou com token de usuário normal:
            
            ```
            curl -i -X DELETE http://localhost:8080/api/books/1
            
            ```
            
            *Resposta:*
            
            - `403 Forbidden` (Spring Security bloqueia).
    - **Executar exclusão como ADMIN**
        - Após autenticar (por exemplo, via Basic Auth ou JWT com ROLE_ADMIN), chama:
            
            ```
            curl -i -X DELETE http://localhost:8080/api/books/1
            
            ```
            
            *Resposta:*
            
            - `204 No Content`.

---

## 7. Sugestões para Aprofundamento

- **Documentação Oficial Spring HATEOAS**
    - [https://docs.spring.io/spring-hateoas/docs/current/reference/html/](https://docs.spring.io/spring-hateoas/docs/current/reference/html/)
- **Exemplos Avançados de PagedModel**
    - Como criar links de paginação automáticos (first, prev, next, last) com `Pageable`.
- **Customizando `LinkRelationProvider`**
    - Para alterar padrões de nomes de `rel` (por ex., usar “item” em vez de “self”).
- **Segurança e Hypermedia**
    - Integrar **Spring Security** com HATEOAS, definindo *Policies* que influenciem diretamente quais links aparecem.
- **Testes de HATEOAS**
    - Exemplo de testes com `@WebMvcTest` e `jsonPath("$._links.update")` para verificar presença ou ausência de links.
- **Alternativas a HATEOAS**
    - Avaliar outras abordagens, como devolver URIs fixas no corpo ou usar API GraphQL quando não se deseja gerenciar dinamicamente links.

---

> Resumo final:
> 
> 
> Neste documento, cobrimos desde a definição e importância de HATEOAS em Spring Boot até exemplos práticos de criação de links condicionais. Apresentamos como usar `EntityModel`, `CollectionModel` e `WebMvcLinkBuilder` para gerar hiperlinks, e como envolver essa lógica em `RepresentationModelAssembler` para manter seu código organizado e testável. Enumeramos cenários em que não se deve usar HATEOAS e listamos boas práticas. Finalmente, demonstramos um exemplo completo de API de Livros que inclui links condicionais baseados em regras de negócio e perfis de segurança.
>