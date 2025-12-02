# Integração com Spring Data JPA usando JpaSpecificationExecutor e Specification<T>

---

## 1. Introdução

Neste documento, abordaremos como aproveitar a API de Criteria do JPA em conjunto com o Spring Data JPA, de modo a permitir consultas dinâmicas e flexíveis. Focaremos na integração com a interface `JpaSpecificationExecutor` e na criação de objetos `Specification<T>`, que encapsulam blocos de Criteria em classes reutilizáveis. Exploraremos a definição de métodos `findAll(Specification<T> spec)` em repositórios e como transformar lógicas construídas com o Criteria API em instâncias de `Specification<T>`.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Configuração do Repositório
    2. Implementação de `Specification<T>`
    3. Montagem de Predicates via Criteria
    4. Métodos `findAll(Specification<T>)`
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

1. **O que é Criteria API?**
    - É uma API padronizada do JPA para construção de consultas de forma programática, sem empregar JPQL/SQL estático.
    - Garante tipagem em tempo de compilação e facilita a criação de consultas dinâmicas, gerando objetos `CriteriaQuery`, `Root`, `Predicate`, etc.
2. **O que é `Specification<T>`?**
    - É uma interface do Spring Data JPA que representa um predicado de consulta baseado em Criteria.
    - Permite encapsular fragmentos de condições (Predicates) em classes ou métodos estáticos, que podem ser combinados (usando AND / OR).
    - Assinatura simplificada:
        
        ```java
        public interface Specification<T> {
            Predicate toPredicate(Root<T> root,
                                  CriteriaQuery<?> query,
                                  CriteriaBuilder criteriaBuilder);
        }
        
        ```
        
    - O Spring Data JPA interpreta o resultado desse `toPredicate(...)` para agregar ao `WHERE` da consulta.
3. **O que é `JpaSpecificationExecutor`?**
    - É uma interface provida pelo Spring Data JPA que, quando estendida em um repositório, acrescenta diversos métodos para executar consultas baseadas em `Specification<T>`.
    - Entre esses métodos, destacam-se:
        
        ```java
        List<T> findAll(Specification<T> spec);
        Page<T> findAll(Specification<T> spec, Pageable pageable);
        long count(Specification<T> spec);
        // e outros overloads (sort, flush, etc.)
        
        ```
        
    - Internamente, o Spring Data traduz o `Specification<T>` criado em uma query Criteria e executa no banco de dados.
4. **Por que usar `Specification<T>`?**
    - Permite compor condições de filtro de modo dinâmico e reutilizável: cada `Specification` representa uma condição isolada.
    - Evita esforço extra na construção de JPQL manually.
    - Facilita a manutenção: se um critério mudar (ex: nome → like `%João%`), basta ajustar a `Specification` correspondente.
    - Integra facilmente com paginação e ordenação do Spring Data.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Configuração do Repositório

Para habilitar o uso de `Specification<T>`, basta estender a interface `JpaSpecificationExecutor<T>` juntamente com `JpaRepository<T, ID>`:

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProdutoRepository
        extends JpaRepository<Produto, Long>,
                JpaSpecificationExecutor<Produto> {
    // não é necessário declarar métodos adicionais para usar Specification
}

```

- **Observação:**
    - `Produto` é a entidade JPA.
    - `Long` é o tipo do identificador primário.
    - Ao estender `JpaSpecificationExecutor<Produto>`, o Spring Data já disponibiliza métodos como `findAll(Specification<Produto>)`.

### 4.2 Implementação de `Specification<T>`

Cada `Specification<T>` nada mais é que uma classe (ou classe anônima/lambda) capaz de produzir um `Predicate` usando Criteria API.

### 4.2.1 Exemplo de `Specification` para filtrar por nome (LIKE ignorando case)

```java
import org.springframework.data.jpa.domain.Specification;
import javax.persistence.criteria.*;

public class ProdutoSpecifications {

    public static Specification<Produto> nomeContem(String termo) {
        return (Root<Produto> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            if (termo == null || termo.trim().isEmpty()) {
                return cb.conjunction();
                // cb.conjunction() => Predicado que sempre resulta em true (nenhum filtro)
            }
            String pattern = "%" + termo.toLowerCase() + "%";
            // root.get("nome") retorna Path<String> apontando à propriedade 'nome' na entidade
            return cb.like(cb.lower(root.get("nome")), pattern);
        };
    }

    public static Specification<Produto> precoMaiorQue(Double valorMinimo) {
        return (root, query, cb) -> {
            if (valorMinimo == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("preco"), valorMinimo);
        };
    }

    public static Specification<Produto> categoriaIgual(String nomeCategoria) {
        return (root, query, cb) -> {
            if (nomeCategoria == null || nomeCategoria.trim().isEmpty()) {
                return cb.conjunction();
            }
            return cb.equal(root.get("categoria").get("nome"), nomeCategoria);
        };
    }

    // Exemplo de combinação: nomeContem("abc").and(precoMaiorQue(100.0))
}

```

- **Explicação das partes desse código:**
    - `Root<Produto> root`: representa a entidade `Produto` na consulta.
    - `CriteriaQuery<?> query`: objeto que permite definir restrições adicionais (joins, orderings, etc.).
    - `CriteriaBuilder cb`: fábrica de Predicates (AND, OR, LIKE, EQUAL, BETWEEN, etc.).
    - `cb.conjunction()`: predicado “always true”, usado quando queremos ignorar o filtro.
    - `cb.like(cb.lower(root.get("nome")), pattern)`: gera `WHERE lower(produto.nome) LIKE :pattern`.

### 4.2.2 Uso de classes anônimas vs. lambdas

Como `Specification<T>` é uma interface funcional (possui apenas `toPredicate(...)`), podemos utilizar lambdas:

```java
Specification<Produto> spec = (root, query, cb) -> {
    return cb.equal(root.get("disponivel"), true);
};

```

ou classes estáticas (como em `ProdutoSpecifications`), o que facilita a organização, reaproveitamento e testes unitários.

### 4.3 Montagem de Predicates via Criteria

Internamente, um `Specification<T>` é transformado em:

1. Criação de `CriteriaBuilder` (via `EntityManager.getCriteriaBuilder()`).
2. Construção de um `CriteriaQuery<T>`.
3. Invocação de `toPredicate(root, query, cb)` para obter o `Predicate` que representa a parte `WHERE`.
4. Aplicação de ordenação (`query.orderBy(...)`) ou joins, se necessários.
5. Execução da query com `entityManager.createQuery(criteriaQuery).getResultList();`

Porém, ao chamar `repository.findAll(spec)`, todo esse fluxo é tratado internamente pelo Spring Data, bastando-nos somente fornecer a instância de `Specification`.

### 4.4 Exemplos de Combinação de `Specification`

Para filtrar um produto cujo nome contenha “Açúcar” **E** cujo preço seja ≥ 10.0:

```java
Specification<Produto> specNome = ProdutoSpecifications.nomeContem("Açúcar");
Specification<Produto> specPreco = ProdutoSpecifications.precoMaiorQue(10.0);

// Combina via AND
Specification<Produto> filtroCombinado = specNome.and(specPreco);

List<Produto> resultados = produtoRepository.findAll(filtroCombinado);

```

Para combinar via OR:

```java
Specification<Produto> filtroOu = specNome.or(specPreco);

List<Produto> resultados = produtoRepository.findAll(filtroOu);

```

### 4.5 Definição de Métodos `findAll(Specification<T> spec)`

Ao estender `JpaSpecificationExecutor`, o repositório já possui:

```java
List<T> findAll(Specification<T> spec);
Page<T> findAll(Specification<T> spec, Pageable pageable);
List<T> findAll(Specification<T> spec, Sort sort);
long count(Specification<T> spec);

```

Basta invocar:

```java
List<Produto> todos = produtoRepository.findAll( /* instancia de Specification<Produto> */ );

```

ou, para páginação:

```java
Pageable pagina = PageRequest.of(0, 20, Sort.by("preco").descending());
Page<Produto> paginaProdutos = produtoRepository.findAll(filtroCombinado, pagina);

```

---

## 5. Cenários de Restrição ou Não Aplicação

1. **Consultas Muito Simples ou Estáticas**
    - Se a consulta é sempre a mesma (ex.: `findByNome(String nome)`), não há necessidade de `Specification`. Basta usar métodos derivados de nome ou `@Query`.
2. **Performance em Consultas Complexas**
    - Para filtros muito complexos ou envolvendo múltiplas junções profundas (joins em várias entidades), a geração dinâmica de Criteria pode gerar SQL excessivamente verboso, dificultando otimizações manuais (índices, hints).
    - Nesses casos, pode ser melhor escrever manualmente uma `@Query` em JPQL ou mesmo uma native query otimizada.
3. **Sobrecarga de Código**
    - Se o projeto possuir poucas variações de filtro, criar diversas classes de `Specification` pode ficar “pesado” em termos de manutenção.
    - Em cenários muito simples, usar Query by Example (QBE) ou métodos derivados pode ser suficiente.
4. **Tipos de Banco ou Versões Antigas de JPA**
    - Repositórios que não utilizam Spring Data JPA ou que utilizam versões antigas do Hibernate/JPA podem não suportar plenamente `JpaSpecificationExecutor` ou ter limitações na API de Criteria.

---

## 6. Componentes Chave Associados

1. **`Specification<T>` (interface)**
    - Pacote: `org.springframework.data.jpa.domain.Specification`
    - Método principal:
        
        ```java
        Predicate toPredicate(Root<T> root,
                              CriteriaQuery<?> query,
                              CriteriaBuilder criteriaBuilder);
        
        ```
        
    - Permite encapsular condições de filtro em objetos únicos, passíveis de serem compostos.
2. **`JpaSpecificationExecutor<T>` (interface)**
    - Pacote: `org.springframework.data.jpa.repository.JpaSpecificationExecutor`
    - Principais métodos:
        
        ```java
        List<T> findAll(Specification<T> spec);
        Page<T> findAll(Specification<T> spec, Pageable pageable);
        List<T> findAll(Specification<T> spec, Sort sort);
        long count(Specification<T> spec);
        
        ```
        
    - Deve ser estendida pelo repositório JPA para habilitar consultas dinâmicas.
3. **`CriteriaBuilder`**
    - Classe JPA (pacote `javax.persistence.criteria.CriteriaBuilder`).
    - Usada para criar objetos `Predicate` (AND, OR, LIKE, EQUAL, BETWEEN, etc.) e expressões de ordenação (`Order`).
4. **`CriteriaQuery<T>`**
    - Representa a query em si, criada via `CriteriaBuilder.createQuery(Class<T>)`.
    - Permite personalizar `SELECT`, `WHERE`, `JOIN`, `ORDER BY`.
5. **`Root<T>`**
    - Define a “raiz” da consulta, ou seja, a entidade principal que está sendo consultada.
    - Usado para acessar atributos da entidade: `root.get("atributo")` retorna um `Path<?>`, que pode ser comparado via `CriteriaBuilder`.
6. **`Predicate`**
    - Fragmento de expressão lógica (ex.: `nome = :param`, `preco >= :param`).
    - Usado como resultado do método `toPredicate(...)` em um `Specification`.
    - Pode ser obtido via `CriteriaBuilder` (ex.: `cb.equal()`, `cb.like()`) e combinado via `cb.and(...)`, `cb.or(...)`.
7. **Anotações Importantes em Entidades**
    - `@Entity`, `@Table`, `@Column`, `@ManyToOne`, `@OneToMany` etc.—essas anotações não são específicas de Specification, mas definem o modelo de domínio que será base da consulta.
    - É fundamental que os campos usados nas `Specification` correspondam exatamente aos nomes das propriedades em Java (e, secundariamente, às colunas no banco de dados).
8. **Classe de Serviços (Service Layer)**
    - É comum encapsular a composição de `Specification` dentro de um serviço (ex.: `ProdutoService`), mantendo o repositório separado da lógica de criação de filtro.
    - Exemplo:
        
        ```java
        @Service
        public class ProdutoService {
            @Autowired
            private ProdutoRepository produtoRepository;
        
            public List<Produto> buscarProdutosDinamic(
                String nome, Double precoMin, String categoria)
            {
                Specification<Produto> spec = Specification.where(
                    ProdutoSpecifications.nomeContem(nome))
                    .and(ProdutoSpecifications.precoMaiorQue(precoMin))
                    .and(ProdutoSpecifications.categoriaIgual(categoria));
        
                return produtoRepository.findAll(spec);
            }
        }
        
        ```
        

---

## 7. Melhores Práticas e Padrões de Uso

1. **Centralizar `Specifications` em Classes de Apoio**
    - Crie uma classe `EntidadeSpecifications` para agrupar todas as `Specification` de uma entidade.
    - Exemplo: `ProdutoSpecifications`, `ClienteSpecifications`, etc.
2. **Nomear Métodos de Forma Autoexplicativa**
    - Ex.: `nomeContem()`, `cpfIgual()`, `dataCompraEntre()`.
    - Facilita a leitura e manutenção quando compostos.
3. **Tratar Nulos e Strings Vazias**
    - Sempre verifique se o parâmetro é `null` ou vazio. Em vez de lançar `NullPointerException`, retorne `cb.conjunction()` para ignorar o filtro.
4. **Combinação Dinâmica de Filtros**
    - Utilize `Specification.where(...)` para iniciar (pode ser `where(null)` para não aplicar filtro inicial).
    - Combine com `.and(...)` ou `.or(...)` de acordo com a lógica de negócio.
    - Exemplo de composição condicional:
        
        ```java
        Specification<Produto> spec = Specification.where(null);
        
        if (filtro.getNome() != null) {
            spec = spec.and(ProdutoSpecifications.nomeContem(filtro.getNome()));
        }
        if (filtro.getPrecoMin() != null) {
            spec = spec.and(ProdutoSpecifications.precoMaiorQue(filtro.getPrecoMin()));
        }
        if (filtro.getCategoria() != null) {
            spec = spec.and(ProdutoSpecifications.categoriaIgual(filtro.getCategoria()));
        }
        
        ```
        
5. **Paginação e Ordenação**
    - Evite buscar listas completas em consultas que podem retornar muitos registros.
    - Use sempre `Pageable` (`PageRequest.of(page, size, Sort.by(...))`) em métodos `findAll(Specification<T>, Pageable)`, principalmente em interfaces REST.
6. **Uso de Fetch Joins (quando necessário)**
    - Ao filtrar por campos de entidades associadas (ex.: `root.get("categoria").get("nome")`), considere usar `query.distinct(true)` caso haja `@OneToMany` que possa gerar duplicações no resultado (N+1).
    - Exemplo no `toPredicate(...)`:
        
        ```java
        root.fetch("categoria", JoinType.LEFT);
        query.distinct(true);
        
        ```
        
    - Evite fetchs desnecessários que tornem a query mais pesada.
7. **Separação de Responsabilidades**
    - Deixe o repositório apenas com a extensão de `JpaSpecificationExecutor`.
    - Encapsule todas as regras de filtragem em uma classe de `Specifications` ou parte da camada de serviço.
8. **Testes Unitários de `Specification`**
    - Escreva testes que carreguem um contexto de banco (ex.: H2 em memória) e validem que cada `Specification` retorna resultados esperados.
    - Exemplo: inserir três produtos: “Arroz”, “Feijão”, “Açúcar” e testar que `nomeContem("ão")` retorna “Feijão”.
9. **Cuidado com Consultas Excessivamente Genéricas**
    - Muito filtros em uma única query podem acarretar SQL complexo e lento.
    - Quando possível, divida em diversas consultas menores ou use visualizações/materialized views no banco.

---

## 8. Exemplo Prático Completo

### 8.1 Modelo de Entidade

```java
import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Double preco;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Column(nullable = false)
    private Boolean disponivel;

    @Column(name = "data_cadastro")
    private LocalDate dataCadastro;

    // Getters e Setters omitidos para brevidade
}

```

### 8.2 Classe de Repositório

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProdutoRepository
        extends JpaRepository<Produto, Long>,
                JpaSpecificationExecutor<Produto> {
    // Nenhum método adicional é necessário para consultar via Specification
}

```

### 8.3 Classe de `Specification`

```java
import org.springframework.data.jpa.domain.Specification;
import javax.persistence.criteria.*;

public class ProdutoSpecifications {

    // Filtrar por nome (LIKE IGNORANDO case)
    public static Specification<Produto> nomeContem(String termo) {
        return (root, query, cb) -> {
            if (termo == null || termo.trim().isEmpty()) {
                return cb.conjunction();
            }
            String pattern = "%" + termo.toLowerCase() + "%";
            return cb.like(cb.lower(root.get("nome")), pattern);
        };
    }

    // Filtrar por preço mínimo
    public static Specification<Produto> precoMaiorQue(Double valorMinimo) {
        return (root, query, cb) -> {
            if (valorMinimo == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("preco"), valorMinimo);
        };
    }

    // Filtrar por nome de categoria (JOIN)
    public static Specification<Produto> categoriaIgual(String nomeCategoria) {
        return (root, query, cb) -> {
            if (nomeCategoria == null || nomeCategoria.trim().isEmpty()) {
                return cb.conjunction();
            }
            // Faz join para categoria e compara pelo nome
            Join<Produto, Categoria> joinCategoria = root.join("categoria", JoinType.INNER);
            return cb.equal(joinCategoria.get("nome"), nomeCategoria);
        };
    }

    // Filtrar somente produtos disponíveis
    public static Specification<Produto> disponivel(Boolean flag) {
        return (root, query, cb) -> {
            if (flag == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("disponivel"), flag);
        };
    }

    // Filtrar por data de cadastro entre duas datas
    public static Specification<Produto> dataCadastroBetween(LocalDate inicio, LocalDate fim) {
        return (root, query, cb) -> {
            if (inicio == null || fim == null) {
                return cb.conjunction();
            }
            return cb.between(root.get("dataCadastro"), inicio, fim);
        };
    }
}

```

### 8.4 Serviço que Combina as `Specifications`

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> buscarProdutosDinamic(
            String nome,
            Double precoMin,
            String categoria,
            Boolean disponivel,
            LocalDate dataInicio,
            LocalDate dataFim)
    {
        Specification<Produto> spec = Specification.where(null);

        // Filtrar por nome
        spec = spec.and(ProdutoSpecifications.nomeContem(nome));

        // Filtrar por preço mínimo
        spec = spec.and(ProdutoSpecifications.precoMaiorQue(precoMin));

        // Filtrar por categoria
        spec = spec.and(ProdutoSpecifications.categoriaIgual(categoria));

        // Filtrar por disponibilidade
        spec = spec.and(ProdutoSpecifications.disponivel(disponivel));

        // Filtrar por intervalo de data
        spec = spec.and(ProdutoSpecifications.dataCadastroBetween(dataInicio, dataFim));

        return produtoRepository.findAll(spec);
    }

    public Page<Produto> buscarComPaginacao(
            String nome,
            Double precoMin,
            String categoria,
            Boolean disponivel,
            LocalDate dataInicio,
            LocalDate dataFim,
            int pagina,
            int tamanho)
    {
        Specification<Produto> spec = Specification.where(null)
            .and(ProdutoSpecifications.nomeContem(nome))
            .and(ProdutoSpecifications.precoMaiorQue(precoMin))
            .and(ProdutoSpecifications.categoriaIgual(categoria))
            .and(ProdutoSpecifications.disponivel(disponivel))
            .and(ProdutoSpecifications.dataCadastroBetween(dataInicio, dataFim));

        Pageable pageable = PageRequest.of(pagina, tamanho, Sort.by("nome").ascending());
        return produtoRepository.findAll(spec, pageable);
    }
}

```

### 8.5 Controlador REST (Opcional)

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping("/filtro")
    public ResponseEntity<List<Produto>> buscarProdutos(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Double precoMin,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Boolean disponivel,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim)
    {
        List<Produto> resultados = produtoService.buscarProdutosDinamic(
                nome, precoMin, categoria, disponivel, dataInicio, dataFim);
        return ResponseEntity.ok(resultados);
    }
}

```

Este exemplo completo cobre desde a entidade, passando pelo repositório, `Specifications`, serviço e controladora REST, ilustrando como usar `JpaSpecificationExecutor` e `Specification<T>` para consultas dinâmicas com Criteria.

---

## 9. Sugestões para Aprofundamento

- **Documentação Oficial**
    - [Spring Data JPA – Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
        - Seção: “JPA with Criteria” e “Specifications”.
- **Artigos Baeldung (em inglês)**
    - “Spring Data JPA Specifications” – explica cenários práticos, combinações avançadas e tratamento de nulos.
    - “Guide to JPA Criteria API” – detalha construção de consultas programáticas usando Criteria.
- **Livros / Recursos Avançados**
    - *Pro JPA 2: Mastering the Java Persistence API* – capítulo sobre Criteria API.
    - *Spring Data* (Editora Packt) – capítulo dedicado a consultas dinâmicas e Specification.
- **Vídeos / Tutoriais Online**
    - Canais como “Java Brains” ou “Cursinho Videoaulas” costumam ter boas explicações sobre Criteria API e Spring Data Specifications em português.

---

> Observação Final:
> 
> 
> Ao migrar blocos de Criteria API “na mão” para `Specification<T>`, a ideia central é encapsular cada filtro em um método estático que recebe parâmetros (ex.: `String nome`, `Double precoMin`) e retorna a implementação de `toPredicate(...)`. Dessa forma, ganhamos modularidade, testabilidade e clareza na construção de consultas dinâmicas, mantendo o código limpo e alinhado às melhores práticas do Spring Data JPA.
>