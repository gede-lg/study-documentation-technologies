# Introdução à Estrutura MVC no Spring

---

## 1. Introdução

A arquitetura MVC (Model-View-Controller) é um padrão de design de software que separa responsabilidades em três camadas principais:

- **Model (Modelo):** Representa a estrutura de dados e a lógica de negócio. Geralmente, são classes Java (POJOs) anotadas ou configuradas para persistir em banco de dados.
- **View (Visão):** Responsável pela apresentação da interface para o usuário. No contexto do Spring, pode ser JSP, Thymeleaf, FreeMarker, ou mesmo JSON em aplicações REST.
- **Controller (Controlador):** Atua como intermediário entre Model e View. Recebe requisições HTTP, invoca lógica de serviço, manipula Model e escolhe a View apropriada para renderizar a resposta.

No Spring Framework, o módulo **Spring MVC** facilita a implementação desse padrão, fornecendo anotações e componentes que organizam a aplicação em camadas bem definidas, promovendo coesão e baixo acoplamento.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#3-conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#4-sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Configuração do DispatcherServlet
    2. Mapeamento de URLs com Anotações
    3. Classes de Controller
    4. Criação do Model (Entidades e DTOs)
    5. Camada de Serviço (Service)
    6. Camada de Acesso a Dados (Repository)
    7. View (Templates HTML ou JSON)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#5-cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#6-componentes-chave-associados)
    1. Anotações Principais
    2. Classes e Interfaces Fundamentais
    3. Atributos e Métodos Cruciais
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#7-melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#8-exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#9-sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

1. **Separação de Responsabilidades (SoC – Separation of Concerns)**
    - Cada camada (Model, View, Controller) possui responsabilidade bem definida:
        - **Model:** Dados e regras de negócio.
        - **View:** Apresentação (HTML, JSON, etc.).
        - **Controller:** Recepção de requisições, coordenação da lógica.
2. **DispatcherServlet**
    - No Spring MVC, o `DispatcherServlet` atua como *front controller*: ponto de entrada único para todas as requisições HTTP. Ele faz o roteamento das requisições para os controllers adequados e escolhe a view para renderizar.
3. **Injeção de Dependência (IoC)**
    - O Spring faz a injeção automática de beans (@Autowired, @Inject), permitindo que controladores, serviços e repositórios dependam uns dos outros de forma desacoplada.
4. **Anotações Centrais**
    - O Spring MVC baseia-se intensamente em anotações para configurar controllers, mapear requisições, definir transações e persistência.
5. **Caminho de uma Requisição**
    1. O cliente faz uma requisição HTTP (GET, POST, etc.).
    2. O `DispatcherServlet` intercepta a requisição.
    3. Com base no mapeamento (RequestsMappingHandlerMapping), identifica qual controller handle irá tratá-la.
    4. O controller processa a lógica (possivelmente invocando serviços e repositórios).
    5. O método do controller retorna um objeto `ModelAndView` ou um valor que represente a view/JSON.
    6. O `DispatcherServlet` resolve a view (por meio de `ViewResolver`) ou converte o objeto em JSON (caso use `@ResponseBody`/REST).
    7. A resposta é enviada de volta ao cliente.

---

## 4. Sintaxe Detalhada e Uso Prático

Nesta seção, veremos passo a passo como configurar e usar cada camada do MVC no Spring. Os exemplos são em Java com Spring Boot (versão 3.x) e Thymeleaf para views. Se sua aplicação for puramente REST, basta substituir a parte de View por JSON (via `@RestController`).

### 4.1 Configuração do DispatcherServlet

### 4.1.1 Spring Boot (Configuração Automática)

No Spring Boot, não é necessário configurar manualmente o `DispatcherServlet` nem o `web.xml`. Basta adicionar a dependência:

```xml
<!-- pom.xml -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

```

O Spring Boot já registra o `DispatcherServlet` automaticamente. Se quiser ajustar alguma configuração, pode criar uma classe:

```java
// src/main/java/com/exemplo/config/WebConfig.java
package com.exemplo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        // Configuração customizada (opcional)
        registry.jsp("/WEB-INF/views/", ".jsp");
        // Se usar Thymeleaf, em geral, não precisa mexer aqui: o starter já configura
    }
}

```

### 4.1.2 Sem Spring Boot (Configuração Manual)

Caso não utilize Spring Boot, é necessário:

1. Incluir dependência do Spring MVC no `pom.xml`.
2. Configurar o `web.xml`:
    
    ```xml
    <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" ...>
        <servlet>
            <servlet-name>dispatcher</servlet-name>
            <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
            <init-param>
                <param-name>contextConfigLocation</param-name>
                <param-value>/WEB-INF/spring/app-config.xml</param-value>
            </init-param>
            <load-on-startup>1</load-on-startup>
        </servlet>
        <servlet-mapping>
            <servlet-name>dispatcher</servlet-name>
            <url-pattern>/</url-pattern>
        </servlet-mapping>
    </web-app>
    
    ```
    
3. No `app-config.xml`, habilitar componentes e escanear pacotes:
    
    ```xml
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:context="http://www.springframework.org/schema/context"
           xmlns:mvc="http://www.springframework.org/schema/mvc"
           ...>
        <context:component-scan base-package="com.exemplo" />
        <mvc:annotation-driven />
        <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
            <property name="prefix" value="/WEB-INF/views/" />
            <property name="suffix" value=".jsp" />
        </bean>
    </beans>
    
    ```
    

### 4.2 Camada Controller

Os controllers recebem requisições HTTP e manipulam dados. As anotações mais comuns são:

- `@Controller`: sinaliza que a classe é um controller Spring MVC (para páginas e templates).
- `@RestController`: combina `@Controller` + `@ResponseBody` para retornar JSON/objetos diretamente (RESTful).
- `@RequestMapping`: define o caminho base para todos os métodos da classe ou método específico.
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`: atalho para `@RequestMapping` com método HTTP específico.
- `@PathVariable`: extrai variáveis da URL.
- `@RequestParam`: extrai parâmetros de query string.
- `@RequestBody`: desserializa o corpo da requisição em um objeto Java.
- `@ModelAttribute`: popula um objeto para ser enviado à View (geralmente usado em formulários).

### 4.2.1 Exemplo de Controller “Web” (com Thymeleaf)

```java
// src/main/java/com/exemplo/controller/ProdutoController.java
package com.exemplo.controller;

import com.exemplo.model.Produto;
import com.exemplo.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/produtos")  // caminho base: http://localhost:8080/produtos
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    // Lista de produtos (GET /produtos)
    @GetMapping
    public String listarTodos(Model model) {
        List<Produto> lista = produtoService.obterTodos();
        model.addAttribute("produtos", lista);
        return "produtos/lista"; // Thymeleaf resolver: /templates/produtos/lista.html
    }

    // Formulário de criação (GET /produtos/novo)
    @GetMapping("/novo")
    public String exibirFormularioCriar(Model model) {
        model.addAttribute("produto", new Produto());
        return "produtos/form";
    }

    // Salvar produto (POST /produtos)
    @PostMapping
    public String salvar(@ModelAttribute("produto") Produto produto) {
        produtoService.salvar(produto);
        return "redirect:/produtos"; // redireciona para lista após salvar
    }

    // Formulário de edição (GET /produtos/{id}/editar)
    @GetMapping("/{id}/editar")
    public String exibirFormularioEditar(@PathVariable("id") Long id, Model model) {
        Produto produto = produtoService.obterPorId(id);
        model.addAttribute("produto", produto);
        return "produtos/form";
    }

    // Atualizar (POST /produtos/{id})
    @PostMapping("/{id}")
    public String atualizar(@PathVariable("id") Long id,
                            @ModelAttribute("produto") Produto produto) {
        produto.setId(id);
        produtoService.atualizar(produto);
        return "redirect:/produtos";
    }

    // Excluir (GET /produtos/{id}/excluir) – poderia usar DELETE, mas com links HTML às vezes é mais simples GET
    @GetMapping("/{id}/excluir")
    public String excluir(@PathVariable("id") Long id) {
        produtoService.excluir(id);
        return "redirect:/produtos";
    }
}

```

**Comentários sobre o exemplo:**

- `@Controller`: registra a classe como controlador capaz de retornar views HTML.
- `Model model`: objeto para adicionar atributos que a view Thymeleaf irá renderizar.
- Métodos anotados com `@GetMapping`/`@PostMapping` respondem a rotas HTTP específicas.
- A view retornada é uma string indicando o template dentro de `src/main/resources/templates/...`.

### 4.2.2 Exemplo de Controller REST (JSON)

```java
// src/main/java/com/exemplo/controller/ProdutoRestController.java
package com.exemplo.controller;

import com.exemplo.model.Produto;
import com.exemplo.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController  // retorna JSON diretamente
@RequestMapping("/api/produtos")
public class ProdutoRestController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.obterTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> obterPorId(@PathVariable Long id) {
        Produto produto = produtoService.obterPorId(id);
        if (produto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(produto);
    }

    @PostMapping
    public Produto criar(@RequestBody Produto produto) {
        return produtoService.salvar(produto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id,
                                             @RequestBody Produto produtoDetalhes) {
        Produto produto = produtoService.obterPorId(id);
        if (produto == null) {
            return ResponseEntity.notFound().build();
        }
        produto.setNome(produtoDetalhes.getNome());
        produto.setPreco(produtoDetalhes.getPreco());
        Produto atualizado = produtoService.atualizar(produto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Produto produto = produtoService.obterPorId(id);
        if (produto == null) {
            return ResponseEntity.notFound().build();
        }
        produtoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}

```

**Comentários sobre o exemplo:**

- `@RestController` equivale a `@Controller + @ResponseBody` em todos os métodos.
- `@RequestBody` converte JSON recebido em objeto Java (`Produto`).
- Uso de `ResponseEntity<>` para retornar códigos HTTP adequados (200, 404, 204 etc.).

---

### 4.3 Camada Model

Aqui definimos as entidades que representam tabelas em banco de dados ou objetos de transferência (DTOs).

### 4.3.1 Entidade JPA

```java
// src/main/java/com/exemplo/model/Produto.java
package com.exemplo.model;

import jakarta.persistence.*; // ou javax.persistence em versões antigas
import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false)
    private BigDecimal preco;

    // Construtor padrão (necessário para JPA)
    public Produto() {}

    // Construtor auxiliar
    public Produto(String nome, BigDecimal preco) {
        this.nome = nome;
        this.preco = preco;
    }

    // Getters e Setters
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
    public BigDecimal getPreco() {
        return preco;
    }
    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }
}

```

### 4.3.2 DTO (Opcional)

Em projetos maiores, costuma-se separar `Entity` de DTO (Data Transfer Object).

Exemplo de DTO para criar/atualizar produto:

```java
// src/main/java/com/exemplo/dto/ProdutoDTO.java
package com.exemplo.dto;

import java.math.BigDecimal;

public class ProdutoDTO {
    private String nome;
    private BigDecimal preco;
    // Construtor, getters e setters omitidos para brevidade
}

```

No controller REST, você pode receber um `ProdutoDTO` em vez de `Produto` diretamente:

```java
@PostMapping
public ResponseEntity<Produto> criar(@RequestBody ProdutoDTO dto) {
    Produto produto = new Produto(dto.getNome(), dto.getPreco());
    Produto salvo = produtoService.salvar(produto);
    return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
}

```

---

### 4.4 Camada Service (Serviço)

A camada de serviço contém a lógica de negócio e coordena entre repositórios e outras regras (validações, transações, chamadas a APIs, etc.).

Geralmente, faz-se:

- Interface `ProdutoService`.
- Implementação `ProdutoServiceImpl`.

### 4.4.1 Interface do Serviço

```java
// src/main/java/com/exemplo/service/ProdutoService.java
package com.exemplo.service;

import com.exemplo.model.Produto;
import java.util.List;

public interface ProdutoService {
    List<Produto> obterTodos();
    Produto obterPorId(Long id);
    Produto salvar(Produto produto);
    Produto atualizar(Produto produto);
    void excluir(Long id);
}

```

### 4.4.2 Implementação do Serviço

```java
// src/main/java/com/exemplo/service/impl/ProdutoServiceImpl.java
package com.exemplo.service.impl;

import com.exemplo.model.Produto;
import com.exemplo.repository.ProdutoRepository;
import com.exemplo.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service  // registra como bean de serviço
public class ProdutoServiceImpl implements ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Produto> obterTodos() {
        return produtoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Produto obterPorId(Long id) {
        return produtoRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    @Override
    @Transactional
    public Produto atualizar(Produto produto) {
        // Poderia verificar se existe antes de salvar
        return produtoRepository.save(produto);
    }

    @Override
    @Transactional
    public void excluir(Long id) {
        produtoRepository.deleteById(id);
    }
}

```

**Comentários sobre o exemplo:**

- `@Service` define que a classe é um bean de serviço gerenciado pelo Spring.
- `@Transactional`: controla transações. `readOnly=true` para consultas, sem necessidade de commit. Nos métodos que alteram dados, `@Transactional` sem `readOnly`.

---

### 4.5 Camada Repository (Acesso a Dados)

A camada de acesso a dados (DAO/Repository) utiliza Spring Data JPA para reduzir drasticamente o código boilerplate.

### 4.5.1 Interface de Repositório

```java
// src/main/java/com/exemplo/repository/ProdutoRepository.java
package com.exemplo.repository;

import com.exemplo.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository  // opcional, pois o Spring Data já detecta interfaces que estendem JpaRepository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Além dos métodos básicos (findAll, findById, save, deleteById, etc.),
    // você pode definir consultas adicionais:
    // List<Produto> findByNomeContaining(String nome);
}

```

**Comentários sobre o exemplo:**

- `JpaRepository<T, ID>` fornece métodos como `findAll()`, `findById()`, `save()`, `deleteById()`, entre outros.
- Para consultas customizadas, basta declarar métodos seguindo a convenção de nomenclatura (Query Methods) ou usar `@Query` com JPQL/SQL nativo.

---

### 4.6 Camada View

No contexto “web tradicional” (não tipicamente REST), escolhe-se um mecanismo de template (Thymeleaf, JSP, FreeMarker, etc.):

### 4.6.1 Exemplo com Thymeleaf

- Crie um arquivo `src/main/resources/templates/produtos/lista.html`:
    
    ```html
    <!DOCTYPE html>
    <html xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8" />
        <title>Lista de Produtos</title>
    </head>
    <body>
        <h1>Produtos Cadastrados</h1>
        <a th:href="@{/produtos/novo}">Novo Produto</a>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr th:each="produto : ${produtos}">
                    <td th:text="${produto.id}">1</td>
                    <td th:text="${produto.nome}">Exemplo</td>
                    <td th:text="${#numbers.formatDecimal(produto.preco,1,2)}">0,00</td>
                    <td>
                        <a th:href="@{|/produtos/${produto.id}/editar|}">Editar</a> |
                        <a th:href="@{|/produtos/${produto.id}/excluir|}"
                           onclick="return confirm('Confirma exclusão?');">Excluir</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
    
    ```
    
- Formulário de criação/edição (`produtos/form.html`):
    
    ```html
    <!DOCTYPE html>
    <html xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8" />
        <title>Formulário de Produto</title>
    </head>
    <body>
        <h1 th:text="${produto.id == null} ? 'Novo Produto' : 'Editar Produto'"></h1>
        <form th:action="@{/produtos}" th:object="${produto}" method="post">
            <input type="hidden" th:if="${produto.id != null}" th:field="*{id}" />
            <div>
                <label>Nome:</label>
                <input type="text" th:field="*{nome}" required />
            </div>
            <div>
                <label>Preço:</label>
                <input type="number" step="0.01" th:field="*{preco}" required />
            </div>
            <div>
                <button type="submit">Salvar</button>
                <a th:href="@{/produtos}">Cancelar</a>
            </div>
        </form>
    </body>
    </html>
    
    ```
    

### 4.6.2 Exemplo com JSP

Se preferir JSP em vez de Thymeleaf, basta configurar o `InternalResourceViewResolver` em `WebConfig` e criar arquivos JSP em `/WEB-INF/views/...`.

Exemplo de JSP para listar produtos (`/WEB-INF/views/produtos/lista.jsp`):

```
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>Lista de Produtos</title>
</head>
<body>
    <h1>Produtos</h1>
    <a href="${pageContext.request.contextPath}/produtos/novo">Novo Produto</a>
    <table>
        <thead>
            <tr><th>ID</th><th>Nome</th><th>Preço</th><th>Ações</th></tr>
        </thead>
        <tbody>
            <c:forEach items="${produtos}" var="produto">
                <tr>
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.preco}</td>
                    <td>
                        <a href="${pageContext.request.contextPath}/produtos/${produto.id}/editar">Editar</a>
                        |
                        <a href="${pageContext.request.contextPath}/produtos/${produto.id}/excluir"
                           onclick="return confirm('Confirma?');">Excluir</a>
                    </td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
</body>
</html>

```

---

## 5. Cenários de Restrição ou Não Aplicação

Embora o padrão MVC seja amplamente utilizado, há casos em que não é a melhor escolha:

1. **Aplicações puramente reativas (WebFlux)**
    - Se você estiver construindo um sistema reativo com Spring WebFlux, a abordagem MVC tradicional não se aplica. Em vez disso, usa-se o modelo reativo baseado em `RouterFunction`, `HandlerFunction`, `Mono`/`Flux`, etc.
2. **Serviços de Alta Performance sem Estado (Serverless/Lambda)**
    - Em arquiteturas serverless ou microsserviços muito enxutos, ter três camadas completas (Controller, Service, Repository) pode gerar overhead desnecessário. Às vezes, basta um único handler que conecta diretamente ao banco ou a outro serviço.
3. **APIs muito simples ou lambdas de função única**
    - Para endpoints extremamente simples (e.g., “check health”), criar toda a estrutura MVC pode ser exagero. Pode-se usar `@RestController` único e `JdbcTemplate` direto sem camadas extras.
4. **Ambientes onde não é usado Spring**
    - Em microframeworks como Micronaut, Quarkus nativo ou Microsserviços sem Spring, não faz sentido aplicar Spring MVC.
5. **Aplicações de Linha de Comando ou Desktop**
    - Quando não há interface HTTP, o padrão MVC do Spring não faz sentido.

---

## 6. Componentes Chave Associados

### 6.1 Anotações Principais

| Anotação | Onde aplicar | Descrição |
| --- | --- | --- |
| `@Controller` | Classe | Marca a classe como controlador MVC que retorna views (HTML). |
| `@RestController` | Classe | Marca a classe para retornar JSON/objetos diretamente em respostas HTTP (RESTful). |
| `@RequestMapping` | Classe ou método | Mapeia um ou mais caminhos de URL para o controlador ou método. |
| `@GetMapping` / `@PostMapping` / `@PutMapping` / `@DeleteMapping` | Método | Equivalente a `@RequestMapping(method = RequestMethod.GET/POST/PUT/DELETE)` |
| `@PathVariable` | Parâmetro de método | Extrai parte da URL (dinâmica) e injeta no parâmetro. |
| `@RequestParam` | Parâmetro de método | Extrai parâmetro de query string e injeta no parâmetro do método. |
| `@RequestBody` | Parâmetro de método | Desserializa o corpo da requisição JSON/XML em um objeto Java. |
| `@ResponseBody` | Método ou tipo de retorno | Converte o retorno do método em JSON/HTTP response body (quando não se usa `@RestController`). |
| `@ModelAttribute` | Parâmetro de método ou método | Vincula dados do formulário a um objeto Java e disponibiliza no modelo para view. |
| `@Autowired` / `@Inject` | Campo, setter ou construtor | Injeção de dependência de beans do Spring. |
| `@Service` | Classe | Marca a classe como bean de serviço (lógica de negócio). |
| `@Repository` | Interface ou classe | Marca a classe/interface como bean de repositório (acesso a dados). Habilita tradução de exceções de persistência. |
| `@Entity` | Classe | Marca a classe como entidade JPA para persistir em banco de dados. |
| `@Table`, `@Column`, `@Id`, `@GeneratedValue` | Atributos e classe | Configurações de mapeamento objeto-relacional (JPA). |
| `@Transactional` | Método ou classe | Define o escopo transacional de métodos (commit/rollback automáticos). |

### 6.2 Classes e Interfaces Fundamentais

1. **`DispatcherServlet`**
    - Classe central que intercepta todas as requisições HTTP e as encaminha para o controller adequado.
2. **`HandlerMapping`** e **`RequestMappingHandlerMapping`**
    - Identificam qual método do controller irá tratar a requisição, com base em anotações de mapeamento.
3. **`HandlerAdapter`** e **`RequestMappingHandlerAdapter`**
    - Chamam o método do controller, resolvem parâmetros e invocam conversores de mensagem (por ex. `MappingJackson2HttpMessageConverter` para JSON).
4. **`ViewResolver`**
    - Resolve a view a partir de um nome retornado pelo controller (ex.: “produtos/lista” → `/templates/produtos/lista.html` ou `/WEB-INF/views/produtos/lista.jsp`).
5. **`Model`** e **`ModelAndView`**
    - `Model` armazena atributos que serão passados para a view.
    - `ModelAndView` encapsula o modelo (dados) e o nome da view a ser renderizada.
6. **`ResponseEntity<T>`**
    - Representa uma resposta HTTP completa (status, cabeçalhos e corpo). Muito usado em controllers REST.
7. **`Bean Validation (jakarta.validation)`**
    - Anotações como `@NotNull`, `@Size`, `@Email` em entidades ou DTOs para validação automática. Integrado ao Spring MVC via `@Valid`.
8. **`ExceptionHandler` e `@ControllerAdvice`**
    - Para tratamento centralizado de exceções em controllers.
    - Exemplo:
        
        ```java
        @ControllerAdvice
        public class GlobalExceptionHandler {
        
            @ExceptionHandler(IllegalArgumentException.class)
            public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body(ex.getMessage());
            }
        }
        
        ```
        

### 6.3 Atributos e Métodos Cruciais

- **Em Controllers:**
    - `public String nomeDoMetodo(Model model)` → retorna nome da view.
    - `public ResponseEntity<T> nomeDoMetodo(...)` → retorna JSON e status.
    - Parâmetros especiais:
        - `Model model` ou `ModelMap model`
        - `@PathVariable`, `@RequestParam`, `@RequestBody`, `@ModelAttribute`
- **Em Serviços:**
    - Métodos que executam regras de negócio: `List<T> obterTodos()`, `T salvar(T obj)`, `void excluir(Long id)` etc.
    - Anotações: `@Transactional`, `@Transactional(readOnly = true)`
- **Em Repositórios (Spring Data JPA):**
    - Métodos herdados: `findAll()`, `findById(ID)`, `save(entity)`, `deleteById(ID)`
    - Query Methods: `List<Produto> findByNomeContaining(String nome);`
    - `@Query("SELECT p FROM Produto p WHERE p.preco > :valor") List<Produto> produtosMaisCaros(@Param("valor") BigDecimal valor);`

---

## 7. Melhores Práticas e Padrões de Uso

1. **Estrutura de Pacotes Organizada**
    
    ```
    com.exemplo
    ├── config            // Configurações de Spring MVC, segurança, etc.
    ├── controller        // Classes que recebem requisições
    ├── dto               // Data Transfer Objects (separados das entidades)
    ├── exception         // Classes de exceção personalizadas e handlers
    ├── model             // Entidades JPA e modelos de negócio
    ├── repository        // Interfaces de acesso a dados (Spring Data)
    ├── service           // Interfaces de serviço
    ├── service.impl      // Implementações dos serviços
    └── util              // Classes utilitárias (conversões, validações extras, etc.)
    
    ```
    
2. **DTOs vs. Entidades JPA**
    - Não exponha diretamente as entidades JPA nos controllers REST. Crie DTOs para definição de payloads, evitando problemas de Lazy Loading e exposição de campos sensíveis.
3. **Validação com Bean Validation**
    - Use anotações (`@NotNull`, `@Size`, `@Email` etc.) em DTOs e coerção de erros de validação para retornar mensagens claras ao cliente.
    - Exemplo:
        
        ```java
        public class ProdutoDTO {
            @NotBlank(message = "Nome é obrigatório")
            private String nome;
        
            @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que zero")
            private BigDecimal preco;
            // getters e setters
        }
        
        ```
        
    - No controller:
        
        ```java
        @PostMapping
        public ResponseEntity<?> criar(@Valid @RequestBody ProdutoDTO dto, BindingResult result) {
            if (result.hasErrors()) {
                String msg = result.getAllErrors().stream()
                    .map(ObjectError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
                return ResponseEntity.badRequest().body(msg);
            }
            // converter dto em entidade e salvar...
        }
        
        ```
        
4. **Tratamento Centralizado de Exceções**
    - Use `@ControllerAdvice` junto a `@ExceptionHandler` para mapear exceções específicas e retornar respostas padronizadas (códigos HTTP apropriados e mensagens JSON).
5. **Transações na Camada de Serviço**
    - Anote métodos de serviço com `@Transactional` em classes `@Service`. Nunca anote repositórios diretamente.
    - Separe métodos de leitura (com `@Transactional(readOnly = true)`) de métodos de escrita para otimização.
6. **Paginação e Ordenação**
    - Utilize `Pageable` e `Page<T>` do Spring Data JPA em repositórios e controllers para endpoints de listagem, evitando sobrecarregar memória com grandes volumes de dados.
    - Exemplo de repositório:
        
        ```java
        public interface ProdutoRepository extends JpaRepository<Produto, Long> {
            Page<Produto> findAll(Pageable pageable);
        }
        
        ```
        
    - No controller:
        
        ```java
        @GetMapping
        public Page<Produto> listarPaginado(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
            Pageable pageable = PageRequest.of(page, size, Sort.by("nome").ascending());
            return produtoService.obterTodos(pageable);
        }
        
        ```
        
7. **Cache em Endpoints de Consulta**
    - Se houver endpoints de consulta que não mudam com frequência, considere usar `@Cacheable` em métodos de serviço para reduzir carga de banco de dados.
8. **Segurança**
    - Proteja rotas usando Spring Security. Separe endpoints públicos e privados, configure filtros JWT/OAuth2 se necessário.
9. **Teste**
    - Escreva testes de unidade para serviços (`@SpringBootTest`, `@DataJpaTest`) e testes de integração para controllers (usando `@WebMvcTest` ou `MockMvc`).
10. **Documentação de API**
    - Use `springdoc-openapi` (ou Swagger) para gerar documentação interativa de APIs REST.

---

## 8. Exemplo Prático Completo

A seguir, um projeto simplificado que demonstra uma aplicação CRUD de produtos usando MVC no Spring Boot.

### 8.1 Estrutura de Pastas

```
src
├── main
│   ├── java
│   │   └── com
│   │       └── exemplo
│   │           ├── Application.java
│   │           ├── config
│   │           │   └── WebConfig.java
│   │           ├── controller
│   │           │   ├── ProdutoController.java
│   │           │   └── ProdutoRestController.java
│   │           ├── dto
│   │           │   └── ProdutoDTO.java
│   │           ├── exception
│   │           │   └── ResourceNotFoundException.java
│   │           ├── model
│   │           │   └── Produto.java
│   │           ├── repository
│   │           │   └── ProdutoRepository.java
│   │           └── service
│   │               ├── ProdutoService.java
│   │               └── impl
│   │                   └── ProdutoServiceImpl.java
│   └── resources
│       ├── application.properties
│       └── templates
│           └── produtos
│               ├── lista.html
│               └── form.html
└── test
    └── java
        └── com
            └── exemplo
                ├── ProdutoControllerTest.java
                └── ProdutoServiceTest.java

```

### 8.2 Arquivos e Conteúdo

### 8.2.1 `Application.java`

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

### 8.2.2 `application.properties`

```
spring.datasource.url=jdbc:h2:mem:db;DB_CLOSE_DELAY=-1
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=true

spring.thymeleaf.cache=false

```

### 8.2.3 `model/Produto.java`

*(Conforme mostrado em “Camada Model”)*

### 8.2.4 `dto/ProdutoDTO.java`

```java
package com.exemplo.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public class ProdutoDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que zero")
    private BigDecimal preco;

    // Getters e Setters
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public BigDecimal getPreco() {
        return preco;
    }
    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }
}

```

### 8.2.5 `exception/ResourceNotFoundException.java`

```java
package com.exemplo.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String mensagem) {
        super(mensagem);
    }
}

```

### 8.2.6 `repository/ProdutoRepository.java`

*(Conforme mostrado em “Camada Repository”)*

### 8.2.7 `service/ProdutoService.java` e `service/impl/ProdutoServiceImpl.java`

*(Conforme mostrado em “Camada Service”)*

### 8.2.8 `controller/ProdutoController.java`

*(Conforme mostrado em “Camada Controller – Web”)*

### 8.2.9 `controller/ProdutoRestController.java`

*(Conforme mostrado em “Camada Controller – REST”)*

### 8.2.10 `templates/produtos/lista.html` e `form.html`

*(Conforme mostrado em “Camada View”)*

### 8.3 Como Executar

1. **Clonar ou criar projeto** seguindo a estrutura acima.
2. **Certifique-se** de ter o Maven/Gradle e Java 17 (ou superior) instalados.
3. **Executar** a classe `Application.java`, por exemplo:
    
    ```
    mvn spring-boot:run
    
    ```
    
4. **Acessar**:
    - Interface web: `http://localhost:8080/produtos`
    - API REST: `http://localhost:8080/api/produtos`
    - H2 Console (para inspecionar banco): `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:db`)

Esse exemplo demonstra um cenário CRUD completo, cobrindo:

- Configuração automática do Spring Boot.
- Camada Controller (MVC e REST).
- Model com JPA + H2 (banco em memória).
- Camada Service com transações.
- Camada Repository via Spring Data JPA.
- Views com Thymeleaf.

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial do Spring MVC**
    - [Spring Framework Reference](https://docs.spring.io/spring-framework/reference/web/webmvc.html) (para entender em detalhes `DispatcherServlet`, `HandlerMapping`, `ViewResolver`, etc.).
2. **Spring Guides e Tutoriais**
    - “Building a RESTful Web Service” – demonstra criação de API REST simples.
    - “Serving Web Content with Spring MVC” – foca na parte de views (Thymeleaf).
3. **Livros Recomendados**
    - *Spring in Action (Craig Walls)* – explicação passo a passo de diversos módulos do Spring, incluindo MVC.
    - *Pro Spring MVC with WebFlux* – coberturas avançadas de MVC e WebFlux.
4. **Testes**
    - Pesquise sobre `@WebMvcTest` (teste unitário para controllers), `@DataJpaTest` (teste de repositório), `@SpringBootTest` (teste de integração full).
    - Aprenda a usar `MockMvc` para testar endpoints sem subir o servidor.
5. **Validação e Internacionalização**
    - Explore como configurar mensagens de validação em arquivos `messages.properties`.
    - Veja como usar `LocaleResolver` para renderizar views em diferentes idiomas.
6. **Segurança com Spring Security**
    - Aborde fluxos de autenticação/autorização (Basic Auth, OAuth2, JWT).
    - Proteja endpoints MVC e REST, definindo roles e permissões.
7. **Padrões de Arquitetura Avançados**
    - Domain-Driven Design (DDD) aplicado ao Spring.
    - Event-Driven Architecture (EDA) combinada com MVC em microsserviços.
8. **Performance e Otimizações**
    - Configurar cache no Spring (`@Cacheable`, `@CacheEvict`).
    - Usar **Lazy Loading** com cuidado para evitar `LazyInitializationException` ao renderizar views.
9. **Migração para Spring WebFlux**
    - Para casos que exigem alta concorrência e operações não bloqueantes, avalie reescrever partes da aplicação usando Spring WebFlux (Flux/Mono).

---

**Observação Final:**

Essa explanação buscou equilibrar uma **visão geral concisa** com detalhes práticos (códigos comentados e configurações comuns). Ajuste as dependências e versões conforme a necessidade do seu projeto. Se precisar de exemplos adicionais (integração com segurança, ou serviços reativos), posso aprofundar em tópicos específicos.