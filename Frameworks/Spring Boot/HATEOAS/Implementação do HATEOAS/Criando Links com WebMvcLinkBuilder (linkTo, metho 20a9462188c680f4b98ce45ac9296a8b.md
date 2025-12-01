# Criando Links com WebMvcLinkBuilder (linkTo, methodOn)

---

## 1. Introdução

Nesta seção, contextualizaremos brevemente o tema. O **Spring HATEOAS** (Hypermedia as the Engine of Application State) é uma extensão do Spring que facilita a criação de APIs REST seguindo o estilo **HATEOAS**. Em vez de retornar apenas dados, a API também fornece links que orientam o cliente sobre as ações possíveis a partir daquele recurso. O objetivo é tornar o consumo da API mais intuitivo e autoexplicativo.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Uso de `linkTo` e `methodOn` no Controller
    2. Exemplos de criação de links em Resource Assemblers
    3. Variações de sintaxe e personalizações adicionais
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **HATEOAS (Hypermedia As The Engine Of Application State)**
    - Princípio do REST que propõe que o cliente descubra ações possíveis a partir dos links fornecidos junto aos recursos retornados pela API.
    - Faz com que a API seja *navegável*, oferecendo pontos de entrada (links) para operações relacionadas.
- **HAL (Hypertext Application Language)**
    - Um formato padrão (JSON ou XML) para representar recursos com links.
    - Em Spring HATEOAS, muitas classes implementam internamente o padrão HAL para serialização.
- **RepresentationModel, EntityModel, CollectionModel**
    - Tipos fornecidos pelo Spring HATEOAS para encapsular entidades e coleções, adicionando links.
    - `EntityModel<T>` é uma classe genérica que envolve um objeto `T` e permite adicionar links.
    - `CollectionModel<T>` envolve uma coleção de `T` (ou de `EntityModel<T>`) para adicionar links aplicáveis a todo o conjunto.
- **WebMvcLinkBuilder**
    - Fábrica de links que utiliza o contexto do Spring MVC para construir URLs apontando para métodos de Controller.
    - Métodos principais:
        - `linkTo(...)` cria a base de um link a partir de uma referência a controller ou método.
        - `methodOn(...)` auxilia a referenciar um método específico de controller (busca parâmetros, anotações de mapeamento, etc.).
    - Exemplo básico:
        
        ```java
        Link link = linkTo(methodOn(ProdutoController.class).buscarPorId(1L)).withSelfRel();
        
        ```
        
        Aqui, o Spring “imita” uma chamada a `buscarPorId(1L)` apenas para extrair a URL mapeada.
        

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Uso de `linkTo` e `methodOn` no Controller

1. **Importações necessárias**
    
    ```java
    import org.springframework.hateoas.Link;
    import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
    import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;
    
    ```
    
2. **Exemplo de Controller sem hiperlinks**
    
    ```java
    @RestController
    @RequestMapping("/api/produtos")
    public class ProdutoController {
    
        @GetMapping("/{id}")
        public Produto buscarPorId(@PathVariable Long id) {
            // busca o produto e retorna JSON simples
            return produtoService.buscarPorId(id);
        }
    }
    
    ```
    
3. **Alterando para retornar `EntityModel<Produto>` com link “self”**
    
    ```java
    @RestController
    @RequestMapping("/api/produtos")
    public class ProdutoController {
    
        @GetMapping("/{id}")
        public EntityModel<Produto> buscarPorId(@PathVariable Long id) {
            Produto produto = produtoService.buscarPorId(id);
    
            // Cria o link “self” para o próprio recurso
            Link selfLink = linkTo(methodOn(ProdutoController.class)
                                .buscarPorId(id))
                            .withSelfRel();
    
            // Encapsula o Produto dentro de EntityModel e adiciona o link
            return EntityModel.of(produto, selfLink);
        }
    }
    
    ```
    
4. **Adicionando link para listar todos**
    
    ```java
    @GetMapping("/{id}")
    public EntityModel<Produto> buscarPorId(@PathVariable Long id) {
        Produto produto = produtoService.buscarPorId(id);
    
        Link selfLink = linkTo(methodOn(ProdutoController.class)
                            .buscarPorId(id))
                        .withSelfRel();
    
        Link todosLink = linkTo(methodOn(ProdutoController.class)
                             .listarTodos())
                         .withRel("todos-produtos");
    
        return EntityModel.of(produto, selfLink, todosLink);
    }
    
    @GetMapping
    public CollectionModel<EntityModel<Produto>> listarTodos() {
        List<Produto> produtos = produtoService.listarTodos();
    
        List<EntityModel<Produto>> produtosModelados = produtos.stream()
            .map(prod -> {
                Link selfLink = linkTo(methodOn(ProdutoController.class)
                                    .buscarPorId(prod.getId()))
                                .withSelfRel();
                return EntityModel.of(prod, selfLink);
            })
            .collect(Collectors.toList());
    
        // Link para o endpoint “listarTodos” (self da coleção)
        Link linkAll = linkTo(methodOn(ProdutoController.class)
                          .listarTodos())
                      .withSelfRel();
    
        return CollectionModel.of(produtosModelados, linkAll);
    }
    
    ```
    

### 4.2 Exemplos de Criação de Links em Resource Assemblers

- **Resource Assembler**: padrão para separar a lógica de criação de links da lógica do controller.
- Crie uma classe implementando `RepresentationModelAssembler<Produto, EntityModel<Produto>>`:
    
    ```java
    import org.springframework.hateoas.server.RepresentationModelAssembler;
    import org.springframework.hateoas.EntityModel;
    import org.springframework.hateoas.Link;
    import org.springframework.stereotype.Component;
    import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;
    
    @Component
    public class ProdutoModelAssembler implements RepresentationModelAssembler<Produto, EntityModel<Produto>> {
    
        @Override
        public EntityModel<Produto> toModel(Produto produto) {
            // Link “self”
            Link selfLink = linkTo(methodOn(ProdutoController.class)
                                .buscarPorId(produto.getId()))
                            .withSelfRel();
    
            // Link para lista de produtos
            Link todosLink = linkTo(methodOn(ProdutoController.class)
                                .listarTodos())
                            .withRel("todos-produtos");
    
            return EntityModel.of(produto, selfLink, todosLink);
        }
    }
    
    ```
    
- **Uso no Controller**:
    
    ```java
    @RestController
    @RequestMapping("/api/produtos")
    public class ProdutoController {
    
        private final ProdutoService produtoService;
        private final ProdutoModelAssembler assembler;
    
        public ProdutoController(ProdutoService service, ProdutoModelAssembler assembler) {
            this.produtoService = service;
            this.assembler = assembler;
        }
    
        @GetMapping("/{id}")
        public EntityModel<Produto> buscarPorId(@PathVariable Long id) {
            Produto produto = produtoService.buscarPorId(id);
            return assembler.toModel(produto);
        }
    
        @GetMapping
        public CollectionModel<EntityModel<Produto>> listarTodos() {
            List<Produto> produtos = produtoService.listarTodos();
    
            List<EntityModel<Produto>> produtosModelados = produtos.stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
    
            Link linkAll = linkTo(methodOn(ProdutoController.class)
                              .listarTodos())
                            .withSelfRel();
    
            return CollectionModel.of(produtosModelados, linkAll);
        }
    }
    
    ```
    

### 4.3 Variações de Sintaxe e Personalizações Adicionais

- **Adicionar parâmetros a `methodOn`**
    - Mesmo que o parâmetro não seja usado, serve para compor a URL corretamente:
        
        ```java
        Link searchLink = linkTo(methodOn(ProdutoController.class)
                             .buscarPorCategoria("eletronicos"))
                         .withRel("buscar-por-categoria");
        
        ```
        
- **Definir HTTP method personalizado**
    - Por padrão, o Spring recupera o mapeamento (GET, POST etc.) a partir das anotações `@GetMapping`, `@PostMapping`. Não é necessário especificar aqui, pois o próprio Spring extrai.
- **Formatos de relacionamento (`Rel`)**
    - `withSelfRel()`: relacionamento “self”.
    - `withRel("nome-do-rel")`: relacionamento genérico.
    - `withType("POST")` ou `withType("DELETE")`: para indicar qual verbo HTTP usar para a ação representada pelo link.

---

## 5. Cenários de Restrição ou Não Aplicação

1. **Aplicações Internas Sem Exposição de Links**
    - Se a API for um microsserviço que não se comunica diretamente com clientes (somente chamado internamente por outros serviços), o HATEOAS pode ser considerado sobrecarga desnecessária.
2. **Sistemas Legados ou Simples CQRS/CRUD Sem Necessidade de Navegação Orientada**
    - Quando a API é meramente um *CRUD* simples, sem intenção de guiar o cliente por estados via hiperlinks, pode-se optar apenas por DTOs puros.
3. **Microserviços “thin” de Alta Performance**
    - Em cenários extremamente sensíveis à latência, a sobrecarga de gerar objetos extras para hiperlinks pode ser indesejada.
4. **APIs GraphQL**
    - GraphQL já provê um esquema diferenciado de permitir ao cliente escolher campos; HATEOAS e GraphQL servem a propósitos distintos.
5. **Recursos Altamente Dinâmicos em Alto Volume de Transações**
    - Em situações onde se retornam centenas de milhares de recursos (grandes exports, streams contínuas), adicionar hiperlinks a cada item pode sobrecarregar a resposta.

---

## 6. Componentes Chave Associados

1. **Dependências Maven/Gradle**
    - No `pom.xml`:
        
        ```xml
        <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-hateoas</artifactId>
        </dependency>
        
        ```
        
    - No `build.gradle`:
        
        ```
        implementation 'org.springframework.boot:spring-boot-starter-hateoas'
        
        ```
        
2. **Classes e Interfaces Principais**
    - **`RepresentationModel<T>`**
        - Classe base para modelos que carregam links.
    - **`EntityModel<T>`** (subclasse de `RepresentationModel`)
        - Envolve uma única entidade `T`, permitindo adicionar links diretamente.
    - **`CollectionModel<T>`** (subclasse de `RepresentationModel`)
        - Envolve uma coleção de recursos (`T`), permitindo links gerais à coleção.
    - **`Link`**
        - Representa um link HATEOAS (URI + relacionamento + possíveis atributos).
    - **`WebMvcLinkBuilder`**
        - API fluente para construir instâncias de `Link` apontando a métodos de controllers.
    - **`RepresentationModelAssembler<T, D extends RepresentationModel<?>>`**
        - Interface que recomenda implementar um assembler para converter entidades em `RepresentationModel` (ou subtipos).
3. **Anotações de Controller Importantes**
    - `@RestController` e `@RequestMapping` — definem a rota base e expõe endpoints REST.
    - `@GetMapping`, `@PostMapping`, `@PutMapping`, etc. — definem rotas específicas para cada operação.
    - **Observação**: O Spring extrai metadados dessas anotações para que `WebMvcLinkBuilder` saiba como montar a URL.
4. **Outros Componentes Úteis**
    - **`PagedModel<T>`**
        - Extensão de `CollectionModel` que inclui metadados de paginação (número de página, tamanho, total de páginas).
    - **`PagedResourcesAssembler<T>`**
        - Auxilia na conversão de um `Page<T>` (do Spring Data) para um `PagedModel<EntityModel<T>>` já preenchido com links de página anterior, próxima, etc.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Isolar Lógica de Montagem de Links em Assemblers**
    - Evita controllers inchados e facilita manutenção.
    - Exemplo: implementar `RepresentationModelAssembler<Entidade, EntityModel<Entidade>>`.
2. **Manter Relacionamentos (`Rel`) Claros e Coerentes**
    - Use nomes autoexplicativos, como `"self"`, `"editar"`, `"deletar"`, `"lista-produtos"`.
    - Se possível, padronize na equipe quais strings usar para cada ação.
3. **Documentar o Resultado HAL**
    - Inserir exemplos de resposta (ex.: no README ou Swagger) ajudará clientes a entenderem a estrutura.
    - Indique que tipo de links estarão disponíveis em cada recurso.
4. **Evitar Expor Lógica de Negócio nas URLs**
    - Usar `linkTo(methodOn(...))` garante que, se o mapeamento de rota mudar, o link também seja atualizado.
    - Não “hardcode” URLs em strings literais.
5. **Cuidar de Performance em Grandes Listagens**
    - Ao retornar coleções volumosas, avalie incluir paginação (com `Pageable`) e usar `PagedResourcesAssembler`.
    - Isso gera links de paginação automaticamente (`first`, `prev`, `self`, `next`, `last`).
6. **Adicionar Links Condicionalmente**
    - Em certos cenários, o link “editar” só faz sentido se o usuário tiver permissão.
    - Exemplo:
        
        ```java
        if (usuarioAutenticado.temPermissao("EDITAR_PRODUTO")) {
            entityModel.add(
                linkTo(methodOn(ProdutoController.class)
                    .editar(produto.getId(), produto))
                .withRel("editar"));
        }
        
        ```
        
    - Assim, a HATEOAS reflete o estado (por exemplo, um produto encerrado não pode mais ser editado; então, não adicionamos link “editar”).
7. **Preferir Relações Padronizadas (HTTP Verbs + Recursos)**
    - Selecione corretamente o verbo HTTP associado a cada link (`.withType("PUT")`, `.withType("DELETE")` etc.).
    - Isso ajuda clientes a entender qual método usar ao seguir um link.

---

## 8. Exemplo Prático Completo

A seguir, um cenário simplificado “ponta a ponta” de um projeto Spring Boot que expõe endpoints de CRUD para entidade `Cliente`, utilizando Spring HATEOAS e `WebMvcLinkBuilder`.

### 8.1 Estrutura de Pastas (resumida)

```
└── src
    └── main
        ├── java
        │   └── com
        │       └── exemplo
        │           ├── Cliente.java
        │           ├── ClienteController.java
        │           ├── ClienteModelAssembler.java
        │           ├── ClienteRepository.java
        │           └── DemoApplication.java
        └── resources
            └── application.properties

```

### 8.2 Dependências no pom.xml

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Boot Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- H2 Database (para teste em memória) -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Spring Boot Starter HATEOAS -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-hateoas</artifactId>
    </dependency>

    <!-- Lombok (opcional, para facilitar getters/setters) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>
</dependencies>

```

### 8.3 `Cliente.java` (Entidade JPA)

```java
package com.exemplo;

import javax.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String email;
}

```

### 8.4 `ClienteRepository.java`

```java
package com.exemplo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {}

```

### 8.5 `ClienteModelAssembler.java`

```java
package com.exemplo;

import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class ClienteModelAssembler implements RepresentationModelAssembler<Cliente, EntityModel<Cliente>> {

    @Override
    public EntityModel<Cliente> toModel(Cliente cliente) {
        // Link "self" -> GET /api/clientes/{id}
        Link selfLink = linkTo(methodOn(ClienteController.class)
                            .obterClientePorId(cliente.getId()))
                        .withSelfRel();

        // Link para listar todos -> GET /api/clientes
        Link todosLink = linkTo(methodOn(ClienteController.class)
                            .listarTodosClientes())
                        .withRel("todos-clientes");

        // Link para deletar (verb: DELETE)
        Link deleteLink = linkTo(methodOn(ClienteController.class)
                             .deletarCliente(cliente.getId()))
                          .withRel("deletar")
                          .withType("DELETE");

        return EntityModel.of(cliente, selfLink, todosLink, deleteLink);
    }
}

```

### 8.6 `ClienteController.java`

```java
package com.exemplo;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteRepository repository;
    private final ClienteModelAssembler assembler;

    public ClienteController(ClienteRepository repository, ClienteModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    /** Listar todos os clientes */
    @GetMapping
    public CollectionModel<EntityModel<Cliente>> listarTodosClientes() {
        List<EntityModel<Cliente>> clientesModelados = repository.findAll().stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());

        // Link self para a coleção
        Link selfLink = linkTo(methodOn(ClienteController.class)
                          .listarTodosClientes())
                      .withSelfRel();

        return CollectionModel.of(clientesModelados, selfLink);
    }

    /** Obter cliente por ID */
    @GetMapping("/{id}")
    public EntityModel<Cliente> obterClientePorId(@PathVariable Long id) {
        Cliente cliente = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + id));
        return assembler.toModel(cliente);
    }

    /** Criar novo cliente */
    @PostMapping
    public ResponseEntity<EntityModel<Cliente>> criarCliente(@RequestBody Cliente novoCliente) {
        Cliente clienteSalvo = repository.save(novoCliente);

        EntityModel<Cliente> clienteModel = assembler.toModel(clienteSalvo);

        // Ao criar, retornamos cabeçalho 'Location' apontando para o recurso criado
        return ResponseEntity
                .created(clienteModel.getRequiredLink("self").toUri())
                .body(clienteModel);
    }

    /** Atualizar cliente */
    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Cliente>> atualizarCliente(
            @PathVariable Long id, @RequestBody Cliente clienteAtualizado) {

        Cliente clienteAtual = repository.findById(id)
            .map(existing -> {
                existing.setNome(clienteAtualizado.getNome());
                existing.setEmail(clienteAtualizado.getEmail());
                return repository.save(existing);
            })
            .orElseGet(() -> {
                clienteAtualizado.setId(id);
                return repository.save(clienteAtualizado);
            });

        EntityModel<Cliente> clienteModel = assembler.toModel(clienteAtual);

        return ResponseEntity
                .ok(clienteModel);
    }

    /** Deletar cliente por ID */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Cliente não encontrado: " + id);
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

```

### 8.7 `DemoApplication.java`

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

### 8.8 `application.properties`

```
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
# Para mostrar SQL no console (opcional):
spring.jpa.show-sql=true

```

### 8.9 Como Funciona na Prática

- Ao iniciar a aplicação (`DemoApplication`), o H2 roda em memória.
- **Endpoints disponíveis**:
    - `GET /api/clientes` → retorna JSON com lista de clientes, cada um envolto em `EntityModel` contendo links:
        
        ```json
        {
          "_embedded": {
            "clienteList": [
              {
                "id": 1,
                "nome": "João",
                "email": "joao@exemplo.com",
                "_links": {
                  "self": { "href": "http://localhost:8080/api/clientes/1" },
                  "todos-clientes": { "href": "http://localhost:8080/api/clientes" },
                  "deletar": { "href": "http://localhost:8080/api/clientes/1", "type": "DELETE" }
                }
              }
              // ... outros clientes
            ]
          },
          "_links": {
            "self": { "href": "http://localhost:8080/api/clientes" }
          }
        }
        
        ```
        
    - `GET /api/clientes/{id}` → retorna JSON de um único cliente envolto em `EntityModel`, com `_links`.
    - `POST /api/clientes` → cria um cliente; no header `Location` aponta para URI do recurso criado, e corpo já inclui o `EntityModel`.
    - `PUT /api/clientes/{id}` → atualiza (ou cria se não existir) e retorna `EntityModel`.
    - `DELETE /api/clientes/{id}` → deleta e retorna `204 No Content`.

Com isso, qualquer cliente (por exemplo, um front-end ou um script) pode navegar pela API sem conhecer rotas fixas: basta olhar os `_links` e seguir as URLs.

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial Spring HATEOAS**
    - Visite: [https://docs.spring.io/spring-hateoas/docs/current/reference/html/](https://docs.spring.io/spring-hateoas/docs/current/reference/html/)
2. **Artigos sobre Padrões de HATEOAS**
    - Pesquise “RESTful HATEOAS best practices” para entender padrões de `rel` (formas de padronizar nomes como “self”, “next”, “prev” etc.).
3. **Implementação de Paginação com `PagedResourcesAssembler`**
    - Veja como converter um `Page<T>` de Spring Data em `PagedModel<EntityModel<T>>` para adicionar automaticamente links de paginação.
4. **Testes de Contrato (Contract Testing)**
    - Considere usar **Spring REST Docs** ou **Postman/Newman** para gerar documentação baseada nos contratos HATEOAS.
5. **HATEOAS em Outras Linguagens**
    - Compare com implementações em Node.js (e.g., `express-hateoas-links`) para entender semânticas em frameworks diferentes.

---