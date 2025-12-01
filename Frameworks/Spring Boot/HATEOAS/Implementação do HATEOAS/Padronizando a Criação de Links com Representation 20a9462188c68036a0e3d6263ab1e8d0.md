# Padronizando a Criação de Links com RepresentationModelAssembler

**Título da Explicação:**

*Padronizando a Criação de Links com `RepresentationModelAssembler` em Spring Boot*

---

## Introdução

Em arquiteturas RESTful maduras, especialmente aquelas que adotam o estilo HATEOAS (Hypermedia as the Engine of Application State), fornecer links nos recursos (resources) é fundamental para guiar o cliente em suas próximas ações. O Spring HATEOAS disponibiliza abstrações como `RepresentationModel`, `EntityModel`, `CollectionModel` e, principalmente, a interface `RepresentationModelAssembler` para centralizar e padronizar a criação desses links.

Nesta explicação, veremos por que e como utilizar o `RepresentationModelAssembler` no Spring Boot com Java para manter o código organizado, evitar duplicidade e garantir consistência na geração de hiperlinks.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
    
    1.1. HATEOAS e Hypermedia em REST
    
    1.2. `RepresentationModel`, `EntityModel` e `CollectionModel`
    
    1.3. Por que usar `RepresentationModelAssembler`
    
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Definição da Interface `RepresentationModelAssembler`
    
    2.2. Exemplo de Implementação de um Assembler
    
    2.3. Configurando o Controller para usar o Assembler
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
    
    3.1. Aplicações Simples sem HATEOAS
    
    3.2. Sobrecarga de Performance e Complexidade Desnecessária
    
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    
    4.1. Anotações e Classes Fundamentais
    
    4.2. Métodos e Atributos Principais
    
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
    
    5.1. Mapeamento de Responsabilidades
    
    5.2. Reutilização e Coesão
    
    5.3. Testabilidade
    
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    
    6.1. Estrutura do Projeto
    
    6.2. Entidade de Domínio e Repositório
    
    6.3. DTO com `RepresentationModel`
    
    6.4. Implementação do Assembler
    
    6.5. Controller RESTful com Endpoints e HATEOAS
    
    6.6. Testando a Resposta
    
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

### 1.1. HATEOAS e Hypermedia em REST

- **HATEOAS** (Hypermedia as the Engine of Application State) é um princípio de design RESTful que determina que cada resposta de recurso deve incluir links (hypermedia) que orientem o cliente para as ações futuras que ele pode executar.
- Em vez de “descobrir” URIs por convenção ou documentação externa, o cliente “navega” pela API guiado pelos links contidos em cada recurso.
- No Spring, isso é facilitado pela biblioteca **Spring HATEOAS**, que oferece classes e métodos para construir esses hiperligações de forma programática.

### 1.2. `RepresentationModel`, `EntityModel` e `CollectionModel`

- **`RepresentationModel<T>`**
    - Classe base que carrega hiperlinks para um determinado tipo `T`. Não contém nem dados nem atributos; serve apenas como “envelope” para links.
- **`EntityModel<T>`**
    - Extende `RepresentationModel<EntityModel<T>>` e “encapsula” uma instância de `T` (geralmente uma entidade ou DTO).
    - Permite associar links ao objeto de domínio de forma simples:
        
        ```java
        EntityModel<Pessoa> model = EntityModel.of(pessoa);
        model.add(linkTo(methodOn(PessoaController.class).buscarPorId(pessoa.getId())).withSelfRel());
        
        ```
        
- **`CollectionModel<T>`**
    - Representa uma coleção de instâncias de `T` (geralmente `EntityModel<U>`). Ideal para endpoints que retornam listas:
        
        ```java
        CollectionModel<EntityModel<Pessoa>> collection = CollectionModel.of(listaDeModels);
        collection.add(linkTo(methodOn(PessoaController.class).listarTodas()).withSelfRel());
        
        ```
        

### 1.3. Por que usar `RepresentationModelAssembler`

- Sem um assembler, cada controller ficaria responsável por “empacotar” a entidade em `EntityModel` e adicionar links manualmente. Isso resulta em:
    - **Código duplicado**: vários controllers repetindo a mesma lógica de linkagem.
    - **Baixa coesão**: controller misturando lógica de negócio com lógica de hiperlink.
    - **Dificuldade de manutenção**: se a URI base mudar, é preciso atualizar em vários pontos.
- O **`RepresentationModelAssembler<T, D>`** unifica essa responsabilidade em uma classe separada que:
    1. Converte um objeto de domínio `T` (por exemplo, `Pessoa`) em um `D extends RepresentationModel<?>` (por exemplo, `EntityModel<PessoaDTO>`).
    2. Centraliza a criação de links, garantindo consistência.
    3. Facilita testes unitários isolados para a lógica de montagem de recursos.

---

## Sintaxe Detalhada e Uso Prático

### 2.1. Definição da Interface `RepresentationModelAssembler`

```java
package org.springframework.hateoas.server;

import org.springframework.hateoas.RepresentationModel;

/**
 * Interface para montar instâncias de RepresentationModel a partir de entidades de domínio.
 *
 * @param <T> Tipo da entidade de domínio (por ex: Pessoa).
 * @param <D> Tipo do RepresentationModel que será retornado (por ex: EntityModel<PessoaDTO> ou PessoaModel).
 */
public interface RepresentationModelAssembler<T, D extends RepresentationModel<?>> {

    /**
     * Converte a entidade de domínio T em um resource D já contendo links.
     *
     * @param entity a instância de domínio.
     * @return resource D contendo a representação e links.
     */
    D toModel(T entity);

    /**
     * Converte uma coleção de entidades em CollectionModel de resources.
     *
     * @param entities Iterable de T (por ex: List<Pessoa>).
     * @return CollectionModel contendo D e seus links.
     */
    default CollectionModel<D> toCollectionModel(Iterable<? extends T> entities) {
        List<D> models = StreamSupport.stream(entities.spliterator(), false)
                                      .map(this::toModel)
                                      .collect(Collectors.toList());
        return CollectionModel.of(models);
    }
}

```

- **Obs.:** A partir do Spring HATEOAS 1.0, você pode também estender a classe abstrata `RepresentationModelAssemblerSupport<T, D>` que já traz implementações auxiliares (e.g., injetar automaticamente o tipo de controller e classe de model).

### 2.2. Exemplo de Implementação de um Assembler

Suponhamos que tenhamos uma entidade de domínio `Pessoa` e queiramos retornar um DTO `PessoaModel` que contenha atributos básicos e links para “self” e “listar todos”.

1. **Entidade de domínio** (exemplo simplificado)
    
    ```java
    package com.exemplo.domain;
    
    public class Pessoa {
        private Long id;
        private String nome;
        private String email;
        // getters e setters
    }
    
    ```
    
2. **DTO / Model** (estende `RepresentationModel<PessoaModel>`)
    
    ```java
    package com.exemplo.api.model;
    
    import org.springframework.hateoas.RepresentationModel;
    
    public class PessoaModel extends RepresentationModel<PessoaModel> {
        private Long id;
        private String nome;
        private String email;
    
        // construtor, getters e setters
    }
    
    ```
    
3. **Assembler**
    
    ```java
    package com.exemplo.api.assembler;
    
    import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;
    
    import org.springframework.hateoas.CollectionModel;
    import org.springframework.hateoas.EntityModel;
    import org.springframework.hateoas.server.RepresentationModelAssembler;
    import org.springframework.stereotype.Component;
    
    import com.exemplo.api.controller.PessoaController;
    import com.exemplo.api.model.PessoaModel;
    import com.exemplo.domain.Pessoa;
    
    @Component
    public class PessoaModelAssembler implements RepresentationModelAssembler<Pessoa, PessoaModel> {
    
        @Override
        public PessoaModel toModel(Pessoa pessoa) {
            // 1. Mapeia os atributos básicos para o DTO
            PessoaModel model = new PessoaModel();
            model.setId(pessoa.getId());
            model.setNome(pessoa.getNome());
            model.setEmail(pessoa.getEmail());
    
            // 2. Adiciona link "self" para o recurso especificado
            model.add(linkTo(methodOn(PessoaController.class)
                          .buscarPorId(pessoa.getId()))
                          .withSelfRel());
    
            // 3. Adiciona link para "listar todas" pessoas
            model.add(linkTo(methodOn(PessoaController.class)
                          .listarTodas())
                          .withRel("pessoas"));
    
            return model;
        }
    
        @Override
        public CollectionModel<PessoaModel> toCollectionModel(Iterable<? extends Pessoa> entities) {
            // Chama a implementação padrão (loop em toModel)
            CollectionModel<PessoaModel> collection = RepresentationModelAssembler.super.toCollectionModel(entities);
            // Adiciona link de nível de coleção (self da listagem)
            collection.add(linkTo(methodOn(PessoaController.class).listarTodas()).withSelfRel());
            return collection;
        }
    }
    
    ```
    
    **Comentário passo a passo**:
    
    - `@Component`: registra o assembler para injeção no Spring.
    - `toModel(Pessoa pessoa)`:
        1. Cria instância de `PessoaModel`.
        2. Preenche campos de `id`, `nome` e `email`.
        3. Usa `linkTo(methodOn(Controller.class).metodo(...))` para criar um `Link`.
        4. `withSelfRel()` marca o link como “self”.
        5. `withRel("pessoas")` cria um link com relação customizada.
    - `toCollectionModel(...)`: envolve a conversão de cada `Pessoa` em `PessoaModel` e adiciona um link de coleção.

### 2.3. Configurando o Controller para usar o Assembler

```java
package com.exemplo.api.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.exemplo.api.assembler.PessoaModelAssembler;
import com.exemplo.api.model.PessoaModel;
import com.exemplo.domain.Pessoa;
import com.exemplo.repository.PessoaRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pessoas")
@RequiredArgsConstructor
public class PessoaController {

    private final PessoaRepository pessoaRepository;
    private final PessoaModelAssembler assembler;

    @GetMapping
    public ResponseEntity<CollectionModel<PessoaModel>> listarTodas() {
        List<Pessoa> pessoas = pessoaRepository.findAll();
        // Converte a lista de entidades para CollectionModel de PessoaModel
        CollectionModel<PessoaModel> collectionModel = assembler.toCollectionModel(pessoas);
        return ResponseEntity.ok(collectionModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<PessoaModel>> buscarPorId(@PathVariable Long id) {
        Pessoa pessoa = pessoaRepository.findById(id)
                           .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));
        // Converte a entidade para PessoaModel com links
        PessoaModel model = assembler.toModel(pessoa);
        return ResponseEntity.ok(EntityModel.of(model));
    }

    @PostMapping
    public ResponseEntity<EntityModel<PessoaModel>> criar(@RequestBody Pessoa novaPessoa) {
        Pessoa salva = pessoaRepository.save(novaPessoa);
        PessoaModel model = assembler.toModel(salva);
        return ResponseEntity
                .created(model.getRequiredLink("self").toUri())
                .body(EntityModel.of(model));
    }

    // Outros endpoints (PUT, DELETE)...
}

```

- **Explicações**:
    1. **Injeção do Assembler** via construtor (`@RequiredArgsConstructor`).
    2. No método `listarTodas()`, coletamos todas as entidades e, em seguida, chamamos `assembler.toCollectionModel(pessoas)`, que já devolve a lista de `PessoaModel` com links próprios e, também, um link de “self” para a coleção.
    3. No método `buscarPorId(...)`, convertemos a entidade singular em `PessoaModel` e embrulhamos em `EntityModel.of(model)`.
    4. Em `criar(...)`, salvamos a nova `Pessoa`, geramos o `PessoaModel` e retornamos um HTTP 201 com cabeçalho `Location` apontando para `self` do recurso.

---

## Cenários de Restrição ou Não Aplicação

### 3.1. Aplicações Simples sem HATEOAS

- Se sua API **não** requer navegação via hiperlinks e é mais voltada para consumo interno (por exemplo: microserviço que não deve expor hipermídia), adicionar HATEOAS pode ser **desnecessário**. Em muitos casos, basta retornar POJOs ou DTOs simples com códigos de status HTTP adequados.
- **Quando não usar**:
    - APIs internas de performance crítica, em que a serialização de links adiciona overhead sem retorno prático.
    - Aplicações legadas que já têm clientes firmemente acoplados a estruturas JSON fixas.

### 3.2. Sobrecarga de Performance e Complexidade Desnecessária

- **Sobrecarga de serialização**: cada recurso terá vários `Link` criados, o que aumenta o payload JSON e pode impactar horizontalização.
- **Complexidade do código**: equipes pouco acostumadas a HATEOAS podem confundir responsabilidades (controller vs. assembler) e aumentar o “ciclo de aprendizagem”.
- **Ferramentas externas**: se a API for consumida por bibliotecas que **não** entendem ou não respeitam HATEOAS, os links serão ignorados, tornando o esforço em vão.

---

## Componentes Chave Associados

### 4.1. Anotações e Classes Fundamentais

- **`@Component`** (ou `@Service`/`@Controller`, etc.): torna o assembler um bean Spring e disponível para injeção.
- **`RepresentationModel<T>`**: classe base de recursos que contém links.
- **`EntityModel<T>`**: representação de uma única entidade `T` com links.
- **`CollectionModel<T>`**: coleção de recursos `T` (ex.: várias instâncias de `EntityModel<U>`).
- **`Link`**: objeto que encapsula uma hiperligação (*href*) e uma relação (*rel*).
- **`WebMvcLinkBuilder`**:
    - `linkTo(...)`: cria um construtor de link a partir de um método de controller.
    - `methodOn(...)`: usado para referenciar métodos de controller de forma tipada, sem precisar escrever “/api/pessoas/{id}” manualmente.

### 4.2. Métodos e Atributos Principais

- **`RepresentationModelAssembler<T, D>`**:
    - `D toModel(T entity)`: obrigatória; converte e adiciona links.
    - `CollectionModel<D> toCollectionModel(Iterable<? extends T> entities)`: implementação default converte cada entidade chamando `toModel(...)`. Pode ser sobrescrito para adicionar links de nível de coleção.
- **`RepresentationModelAssemblerSupport<T, D>`** (classe abstrata):
    - Recebe como parâmetros: a classe do controller e a classe do resource model. Facilita a construção de `toModel(...)` com `createModelWithId(...)`.
- **`createModelWithId(Object id, T entity, Object... parameters)`** (de `RepresentationModelAssemblerSupport`):
    - Cria um `EntityModel<D>` com link “self” automático apontando para o método “findById” do controller associado.

---

## Melhores Práticas e Padrões de Uso

### 5.1. Mapeamento de Responsabilidades

- **Assembler**: responsável **APENAS** por converter objeto de domínio em resource (`RepresentationModel`) e adicionar links. Não deve conter lógica de negócio—apenas mapeamento de atributos e linkagem.
- **Controller**: deve orquestrar chamadas ao serviço/repositório e delegar a conversão para o assembler.
- **Serviço (Service)**: executa regras de negócio e interage com repositório; não deve gerar hipermídia.

### 5.2. Reutilização e Coesão

- Sempre que houver mais de um endpoint retornando a mesma entidade de domínio, utilize o **mesmo assembler**. Por exemplo, se existir `/api/pessoas` e `/api/clientes` (que recarreguem dados de `Pessoa`), ambos podem compartilhar o assembler `PessoaModelAssembler`.
- Mantenha cada assembler focado em **apenas um tipo de entidade**. Evite assemblers “genéricos demais” que acumulam responsabilidades de várias entidades.

### 5.3. Testabilidade

- Realize testes unitários **somente no assembler** para verificar se, dado um objeto de domínio X, a `toModel(X)` retorna:
    1. Todos os campos esperados corretamente mapeados.
    2. Os links corretos, com `rel` e `href` adequados.
- Exemplo de teste (usando JUnit + AssertJ):
    
    ```java
    @ExtendWith(MockitoExtension.class)
    public class PessoaModelAssemblerTest {
    
        private PessoaModelAssembler assembler = new PessoaModelAssembler();
    
        @Test
        void toModel_deveGerarLinksCorretos() {
            Pessoa p = new Pessoa();
            p.setId(42L);
            p.setNome("Gustavo");
            p.setEmail("gu@example.com");
    
            PessoaModel model = assembler.toModel(p);
    
            assertThat(model.getId()).isEqualTo(42L);
            assertThat(model.getNome()).isEqualTo("Gustavo");
            assertThat(model.getEmail()).isEqualTo("gu@example.com");
    
            // Verifica link "self"
            assertThat(model.getLink("self")).isPresent();
            assertThat(model.getLink("self").get().getHref()).endsWith("/api/pessoas/42");
    
            // Verifica link "pessoas"
            assertThat(model.getLink("pessoas")).isPresent();
            assertThat(model.getLink("pessoas").get().getHref()).endsWith("/api/pessoas");
        }
    }
    
    ```
    

---

## Exemplo Prático Completo

### 6.1. Estrutura do Projeto

```
src/main/java
└── com/exemplo
    ├── api
    │   ├── assembler
    │   │   └── PessoaModelAssembler.java
    │   ├── controller
    │   │   └── PessoaController.java
    │   └── model
    │       └── PessoaModel.java
    ├── domain
    │   └── Pessoa.java
    ├── repository
    │   └── PessoaRepository.java
    └── service
        └── PessoaService.java

```

### 6.2. Entidade de Domínio e Repositório

```java
// src/main/java/com/exemplo/domain/Pessoa.java
package com.exemplo.domain;

import javax.persistence.*;

@Entity
@Table(name = "pessoas")
public class Pessoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;

    // construtor vazio para JPA
    public Pessoa() {}

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

```

```java
// src/main/java/com/exemplo/repository/PessoaRepository.java
package com.exemplo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.exemplo.domain.Pessoa;

@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
    // métodos CRUD básicos já disponíveis
}

```

### 6.3. DTO com `RepresentationModel`

```java
// src/main/java/com/exemplo/api/model/PessoaModel.java
package com.exemplo.api.model;

import org.springframework.hateoas.RepresentationModel;

public class PessoaModel extends RepresentationModel<PessoaModel> {
    private Long id;
    private String nome;
    private String email;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

```

### 6.4. Implementação do Assembler

```java
// src/main/java/com/exemplo/api/assembler/PessoaModelAssembler.java
package com.exemplo.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import com.exemplo.api.controller.PessoaController;
import com.exemplo.api.model.PessoaModel;
import com.exemplo.domain.Pessoa;

@Component
public class PessoaModelAssembler implements RepresentationModelAssembler<Pessoa, PessoaModel> {

    @Override
    public PessoaModel toModel(Pessoa pessoa) {
        PessoaModel model = new PessoaModel();
        model.setId(pessoa.getId());
        model.setNome(pessoa.getNome());
        model.setEmail(pessoa.getEmail());

        // Link “self” para GET /api/pessoas/{id}
        model.add(linkTo(methodOn(PessoaController.class)
                      .buscarPorId(pessoa.getId()))
                      .withSelfRel());

        // Link “collection” para GET /api/pessoas
        model.add(linkTo(methodOn(PessoaController.class)
                      .listarTodas())
                      .withRel("pessoas"));

        return model;
    }

    @Override
    public CollectionModel<PessoaModel> toCollectionModel(Iterable<? extends Pessoa> entities) {
        CollectionModel<PessoaModel> collectionModel =
                RepresentationModelAssembler.super.toCollectionModel(entities);
        // Adiciona link de coleção de nível superior
        collectionModel.add(linkTo(methodOn(PessoaController.class)
                                 .listarTodas())
                                 .withSelfRel());
        return collectionModel;
    }
}

```

### 6.5. Controller RESTful com Endpoints e HATEOAS

```java
// src/main/java/com/exemplo/api/controller/PessoaController.java
package com.exemplo.api.controller;

import java.util.List;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.exemplo.api.assembler.PessoaModelAssembler;
import com.exemplo.api.model.PessoaModel;
import com.exemplo.domain.Pessoa;
import com.exemplo.service.PessoaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pessoas")
@RequiredArgsConstructor
public class PessoaController {

    private final PessoaService pessoaService;
    private final PessoaModelAssembler assembler;

    @GetMapping
    public ResponseEntity<CollectionModel<PessoaModel>> listarTodas() {
        List<Pessoa> lista = pessoaService.buscarTodas();
        CollectionModel<PessoaModel> collectionModel = assembler.toCollectionModel(lista);
        return ResponseEntity.ok(collectionModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<PessoaModel>> buscarPorId(@PathVariable Long id) {
        Pessoa pessoa = pessoaService.buscarPorId(id);
        PessoaModel model = assembler.toModel(pessoa);
        return ResponseEntity.ok(EntityModel.of(model));
    }

    @PostMapping
    public ResponseEntity<EntityModel<PessoaModel>> criar(@RequestBody Pessoa novaPessoa) {
        Pessoa salva = pessoaService.salvar(novaPessoa);
        PessoaModel model = assembler.toModel(salva);
        return ResponseEntity
                .created(model.getRequiredLink("self").toUri())
                .body(EntityModel.of(model));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<PessoaModel>> atualizar(
            @PathVariable Long id,
            @RequestBody Pessoa pessoaAtualizada) {
        Pessoa atual = pessoaService.atualizar(id, pessoaAtualizada);
        PessoaModel model = assembler.toModel(atual);
        return ResponseEntity.ok(EntityModel.of(model));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pessoaService.remover(id);
        return ResponseEntity.noContent().build();
    }
}

```

```java
// src/main/java/com/exemplo/service/PessoaService.java
package com.exemplo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.exemplo.domain.Pessoa;
import com.exemplo.repository.PessoaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PessoaService {

    private final PessoaRepository pessoaRepository;

    public List<Pessoa> buscarTodas() {
        return pessoaRepository.findAll();
    }

    public Pessoa buscarPorId(Long id) {
        return pessoaRepository.findById(id)
                 .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));
    }

    public Pessoa salvar(Pessoa pessoa) {
        return pessoaRepository.save(pessoa);
    }

    public Pessoa atualizar(Long id, Pessoa pessoaAtualizada) {
        Pessoa existente = buscarPorId(id);
        existente.setNome(pessoaAtualizada.getNome());
        existente.setEmail(pessoaAtualizada.getEmail());
        return pessoaRepository.save(existente);
    }

    public void remover(Long id) {
        pessoaRepository.deleteById(id);
    }
}

```

- **Fluxo de execução**:
    1. Cliente faz `GET /api/pessoas`.
    2. `PessoaController.listarTodas()` chama `PessoaService.buscarTodas()`.
    3. Retorna lista de `Pessoa`; o controller delega ao assembler que converte cada `Pessoa` em `PessoaModel` adicionando links.
    4. A resposta retorna status 200 com body contendo um JSON semelhante a:
        
        ```json
        {
          "_embedded": {
            "pessoaModelList": [
              {
                "id": 1,
                "nome": "João",
                "email": "joao@example.com",
                "_links": {
                  "self": {
                    "href": "http://localhost:8080/api/pessoas/1"
                  },
                  "pessoas": {
                    "href": "http://localhost:8080/api/pessoas"
                  }
                }
              },
              // ... mais pessoas
            ]
          },
          "_links": {
            "self": {
              "href": "http://localhost:8080/api/pessoas"
            }
          }
        }
        
        ```
        

### 6.6. Testando a Resposta

- **Exemplo de chamada com `curl`:**
    
    ```bash
    curl -i http://localhost:8080/api/pessoas
    
    ```
    
    - Deve retornar um corpo JSON com `_embedded` e `_links`.
- **Ferramentas de Teste como Postman/Insomnia** mostram claramente cada link e permitem navegar pelos endpoints sem memorizar URIs.

---

## Sugestões para Aprofundamento

1. **Documentação Oficial do Spring HATEOAS**
    - [https://docs.spring.io/spring-hateoas/docs/current/reference/html/](https://docs.spring.io/spring-hateoas/docs/current/reference/html/)
2. **Exemplo de Projeto no GitHub**
    - Procure repositórios com “spring-boot-hateoas” para ver implementações reais e mais avançadas (paginação com `PagedModel`, custom link discoverers etc.).
3. **Livro “REST in Practice” de Jim Webber et al.**
    - Aborda HATEOAS em detalhes, embora não específico ao Spring.
4. **Artigos sobre Padrões RESTful**
    - Entenda como HATEOAS se encaixa no contexto geral de REST maturado e quais benefícios traz a médio e longo prazo.
5. **Tópicos Avançados**
    - `PagedModelAssembler` para paginação automática de coleções.
    - Custom `LinkRelationProvider` para relações de link customizadas.
    - Segurança (Spring Security) combinada com HATEOAS: ocultando ou exibindo links conforme role do usuário.

---

> Resumo Rápido:
> 
> - O `RepresentationModelAssembler<T, D>` concentra a lógica de criação de links HATEOAS, separando-a dos controllers.
> - A implementação típica mapeia a entidade para um DTO (que estende `RepresentationModel<D>`) e adiciona links via `WebMvcLinkBuilder`.
> - Evita duplicidade de código e facilita manutenção e testes.
> - Ideal para APIs que seguem estritamente o estilo HATEOAS; não recomendado para cenários onde hiperlinks não são necessários.

Com este guia, você possui uma visão completa de como padronizar a criação de hiperlinks em recursos RESTful usando o Spring HATEOAS e a interface `RepresentationModelAssembler`. Caso deseje aprofundar, siga as referências indicadas e experimente cenários reais de projeto.