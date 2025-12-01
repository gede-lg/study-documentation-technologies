# Jackson JsonFilter: Configuração e Uso

---

## 1. Introdução

O Jackson é a biblioteca mais utilizada em Java para serialização e desserialização de objetos em JSON. Uma de suas funcionalidades avançadas é o *filtering* dinâmico de propriedades, que permite incluir ou excluir campos de um objeto JSON em tempo de execução, sem precisar criar várias classes de DTOs ou anotações fixas em cada propriedade.

Neste guia, abordaremos como:

- Declarar um filtro usando `@JsonFilter` em uma classe de domínio;
- Configurar o `ObjectMapper` (e, consequentemente, o `MappingJackson2HttpMessageConverter`) para aplicar filtros dinamicamente;
- Definir regras de inclusão/exclusão de campos em endpoints REST no Spring Boot;
- Destacar cenários em que esse modelo pode não ser adequado e as melhores práticas na utilização.

---

## 2. Sumário

1. [Conceitos Fundamentais](Jackson%20JsonFilter%20Configura%C3%A7%C3%A3o%20e%20Uso%2020a9462188c6802788e8e5f28e89ccd3.md)
2. [Visão Geral Concisa do Processo](Jackson%20JsonFilter%20Configura%C3%A7%C3%A3o%20e%20Uso%2020a9462188c6802788e8e5f28e89ccd3.md)
3. [Sintaxe Detalhada e Uso Prático](Jackson%20JsonFilter%20Configura%C3%A7%C3%A3o%20e%20Uso%2020a9462188c6802788e8e5f28e89ccd3.md)
    1. Anotação da Classe com `@JsonFilter`
    2. Definição de Filtros com `SimpleBeanPropertyFilter` e `FilterProvider`
    3. Configurando o `ObjectMapper` no Spring Boot
    4. Aplicação do Filtro em Controladores REST
4. [Cenários de Restrição ou Não Aplicação](Jackson%20JsonFilter%20Configura%C3%A7%C3%A3o%20e%20Uso%2020a9462188c6802788e8e5f28e89ccd3.md)
5. [Componentes Chave Associados](Jackson%20JsonFilter%20Configura%C3%A7%C3%A3o%20e%20Uso%2020a9462188c6802788e8e5f28e89ccd3.md)
6. [Melhores Práticas e Padrões de Uso](Jackson%20JsonFilter%20Configura%C3%A7%C3%A3o%20e%20Uso%2020a9462188c6802788e8e5f28e89ccd3.md)
7. [Exemplo Prático Completo](Jackson%20JsonFilter%20Configura%C3%A7%C3%A3o%20e%20Uso%2020a9462188c6802788e8e5f28e89ccd3.md)
8. [Sugestões para Aprofundamento](Jackson%20JsonFilter%20Configura%C3%A7%C3%A3o%20e%20Uso%2020a9462188c6802788e8e5f28e89ccd3.md)

---

## 3. Conceitos Fundamentais

1. **Filtragem Dinâmica vs. Filtros Estáticos:**
    - *Filtros Estáticos*: uso direto de anotações como `@JsonIgnore` ou `@JsonIgnoreProperties` em campos fixos.
    - *Filtragem Dinâmica*: uso de `@JsonFilter` combinado com APIs de `FilterProvider` para decidir, em tempo de execução, quais propriedades incluir ou excluir, sem alterar o modelo de domínio.
2. **@JsonFilter**
    - Permite atribuir um identificador de filtro a uma classe ou tipo. Não lista quais propriedades ficam de fora; esse mapeamento é definido em outro ponto, permitindo reutilização e flexibilidade.
3. **SimpleBeanPropertyFilter e FilterProvider**
    - **SimpleBeanPropertyFilter**: implementação concreta de filtro que seleciona quais propriedades serão incluídas (`filterOutAllExcept(...)`) ou excluídas (`serializeAllExcept(...)`) durante a serialização JSON.
    - **FilterProvider**: agrupa um ou mais filtros (cada um identificado por uma *filter ID*) e associa esses filtros à `ObjectMapper`.
4. **MappingJackson2HttpMessageConverter**
    - Dentro do Spring Boot, o `ObjectMapper` é envolvido por esse conversor padrão que cuida de converter objetos Java para JSON em respostas REST e vice-versa. Modificações no `ObjectMapper` (por exemplo, registrando um `FilterProvider`) refletem-se automaticamente nos endpoints REST.

---

## 4. Visão Geral Concisa do Processo

1. **Anotar a classe de domínio** com `@JsonFilter("nomeDoFiltro")`.
2. **Criar um `FilterProvider`** que associa `"nomeDoFiltro"` a um `SimpleBeanPropertyFilter`, definindo inclusão/exclusão de campos.
3. **Configurar o `ObjectMapper`** no contexto do Spring (por exemplo, definindo um `@Bean` de `Jackson2ObjectMapperBuilder` ou sobrescrevendo o converter) para usar esse `FilterProvider`.
4. **Aplicar filtros nos controladores** (opcional, se necessário ajustar de acordo com cada endpoint), usando `MappingJacksonValue` para configurar quais campos exibir na resposta.

---

## 5. Sintaxe Detalhada e Uso Prático

### 5.1 Anotação da Classe com `@JsonFilter`

```java
import com.fasterxml.jackson.annotation.JsonFilter;

@JsonFilter("UsuarioFilter")
public class Usuario {
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String telefone;

    // Construtores, getters, setters...
}

```

- **Explicação:**
    - A anotação `@JsonFilter("UsuarioFilter")` atribui à classe `Usuario` um *alias* que servirá como chave para recuperar o filtro associado.
    - Note que não se especifica aqui quais campos filtrar; isso é responsabilidade do `FilterProvider` em tempo de execução.

---

### 5.2 Definição de Filtros com `SimpleBeanPropertyFilter` e `FilterProvider`

1. **Inclusão de Campos (Whitelist)**
    
    ```java
    import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
    import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
    import com.fasterxml.jackson.databind.ser.FilterProvider;
    
    // Exemplo: criar um FilterProvider que inclua somente "id" e "nome":
    SimpleBeanPropertyFilter filtroInclusao = SimpleBeanPropertyFilter.filterOutAllExcept("id", "nome");
    SimpleFilterProvider providers = new SimpleFilterProvider()
        .addFilter("UsuarioFilter", filtroInclusao);
    
    ```
    
2. **Exclusão de Campos (Blacklist)**
    
    ```java
    // Exemplo: criar um FilterProvider que exclua "senha":
    SimpleBeanPropertyFilter filtroExclusao = SimpleBeanPropertyFilter.serializeAllExcept("senha");
    SimpleFilterProvider providersExclusao = new SimpleFilterProvider()
        .addFilter("UsuarioFilter", filtroExclusao);
    
    ```
    
- **Explicação:**
    - `filterOutAllExcept("...")`: gera um filtro que **inclui apenas** as propriedades listadas; todas as outras são omitidas.
    - `serializeAllExcept("...")`: gera um filtro que **exclui** as propriedades listadas; todas as outras são incluídas.
    - O `SimpleFilterProvider` mapeia `("UsuarioFilter" → SimpleBeanPropertyFilter)`; o `"UsuarioFilter"` corresponde ao identificador dado em `@JsonFilter`.

---

### 5.3 Configurando o `ObjectMapper` no Spring Boot

No Spring Boot, a forma mais comum de ajustar o `ObjectMapper` (e, consequentemente, o conversor HTTP JSON) é criando um `@Bean` de configuração. Por exemplo:

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper(ObjectMapper defaultMapper) {
        // Recebe o ObjectMapper padrão gerenciado pelo Spring
        SimpleFilterProvider filterProvider = new SimpleFilterProvider()
            .setFailOnUnknownId(false);
        // setFailOnUnknownId(false): evita exceções caso algum objeto sem @JsonFilter seja serializado

        // Registra o FilterProvider vazio, o filtro específico será aplicado dinamicamente nos controladores
        defaultMapper.setFilterProvider(filterProvider);
        return defaultMapper;
    }
}

```

- **Explicação dos pontos principais:**
    - **Injeção do `defaultMapper`:** recebe o `ObjectMapper` que o Spring já criou (com todas as configurações padrão, como módulos de Java 8, JSR310, etc.).
    - **`setFailOnUnknownId(false)`:** evita que o Jackson lance `InvalidDefinitionException` quando tentar resolver um filtro não registrado para determinado ID. Assim, podemos deixar alguns objetos sem filtro ou registrar filtros apenas quando necessário.
    - **Não definimos filtros específicos aqui**; fizemos um *placeholder* para que o Spring use esse `FilterProvider` globalmente. Nas respostas dos controladores, adicionaremos filtros conforme a necessidade.

---

### 5.4 Aplicação do Filtro em Controladores REST

Para cada endpoint que deseja filtrar propriedades, utilizamos `MappingJacksonValue`. Exemplo:

```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import org.springframework.http.converter.json.MappingJacksonValue;

import java.util.List;

@RestController
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final ObjectMapper objectMapper;

    public UsuarioController(UsuarioService usuarioService, ObjectMapper objectMapper) {
        this.usuarioService = usuarioService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/usuarios/filtro-inclusao")
    public ResponseEntity<MappingJacksonValue> getUsuariosFiltroInclusao() {
        List<Usuario> lista = usuarioService.buscarTodos();

        // 1. Define filtro que inclui apenas "id" e "nome"
        SimpleBeanPropertyFilter filtroInclusao = SimpleBeanPropertyFilter
            .filterOutAllExcept("id", "nome");
        SimpleFilterProvider providers = new SimpleFilterProvider()
            .addFilter("UsuarioFilter", filtroInclusao);

        // 2. Cria MappingJacksonValue e associa o filtro
        MappingJacksonValue wrapper = new MappingJacksonValue(lista);
        wrapper.setFilters(providers);

        return ResponseEntity.ok(wrapper);
    }

    @GetMapping("/usuarios/filtro-exclusao")
    public ResponseEntity<MappingJacksonValue> getUsuariosFiltroExclusao() {
        List<Usuario> lista = usuarioService.buscarTodos();

        // Exclui a propriedade "senha"
        SimpleBeanPropertyFilter filtroExclusao = SimpleBeanPropertyFilter
            .serializeAllExcept("senha");
        SimpleFilterProvider providers = new SimpleFilterProvider()
            .addFilter("UsuarioFilter", filtroExclusao);

        MappingJacksonValue wrapper = new MappingJacksonValue(lista);
        wrapper.setFilters(providers);

        return ResponseEntity.ok(wrapper);
    }
}

```

- **Passo a passo no Controller:**
    1. **Recupera lista (ou objeto único) de domínio**: `List<Usuario> lista = usuarioService.buscarTodos();`
    2. **Cria um `SimpleBeanPropertyFilter`** definindo quais propriedades incluir/excluir.
    3. **Associa esse filtro a um `SimpleFilterProvider`**, usando o mesmo ID definido em `@JsonFilter`: `"UsuarioFilter"`.
    4. **Envolve a lista/objeto em `MappingJacksonValue`** e atribui o `FilterProvider` via `wrapper.setFilters(...)`.
    5. **Retorna `ResponseEntity<MappingJacksonValue>`** para que o Spring Serializador aplique o filtro antes de converter para JSON.

---

## 6. Cenários de Restrição ou Não Aplicação

1. **Performance em Massa**
    - Em coleções muito grandes, criar filtros dinâmicos repetidamente em cada requisição pode impactar a performance. Em casos de alta carga, considere usar DTOs fixos ou métodos de projeção do JPA para reduzir o volume de dados retornado.
2. **Exposição de Dados Sensíveis**
    - Dependendo de como o filtro é aplicado, é possível que, em algum endpoint, esqueçamos de aplicar o filtro e exponhamos campos críticos (como senhas). Em situações que envolvem dados altamente sensíveis, use DTOs específicos ou anotações estáticas (por exemplo, `@JsonIgnore`).
3. **Serialização Condicional Complexa**
    - Se a lógica de filtragem depender não só de listas estáticas de campos, mas de regras dinâmicas baseadas em atributos de cada objeto (por exemplo, permitir campo X se o usuário for administrador), talvez seja melhor implementar `JsonSerializer` customizado ou usar mecanismos de Views (`@JsonView`).
4. **Integração com Outras Bibliotecas**
    - Nem todas as bibliotecas que produzem JSON a partir de objetos Java respeitam o mesmo `ObjectMapper` configurado. Certifique-se de que o `ObjectMapper` registrado no Spring é realmente o utilizado por qualquer ponto de serialização (por exemplo, em logs, filas ou caches que façam serialização própria).

---

## 7. Componentes Chave Associados

1. **Anotações**
    - `@JsonFilter("filterId")`
        - Declara que a classe (ou tipo) está sujeita a filtragem dinâmica mediante o filtro identificado por `"filterId"`.
    - (Opcionalmente) `@JsonIgnore`, `@JsonIgnoreProperties`, `@JsonProperty`— não fazem parte do filtering dinâmico, mas podem conviver com filtros estáticos.
2. **Classes do Jackson**
    - `com.fasterxml.jackson.databind.ObjectMapper`
    - `com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter`
    - `com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider`
    - `com.fasterxml.jackson.databind.ser.FilterProvider`
    - `com.fasterxml.jackson.databind.ser.PropertyFilter` (interface genérica que `SimpleBeanPropertyFilter` implementa)
3. **Spring Boot**
    - `org.springframework.context.annotation.Configuration`
    - `org.springframework.context.annotation.Bean`
    - `org.springframework.http.converter.json.MappingJackson2HttpMessageConverter` (indiretamente configurado ao injetar um `ObjectMapper` já modificado)
    - `org.springframework.http.converter.json.MappingJacksonValue`
    - `org.springframework.web.bind.annotation.RestController` e familiares
4. **IDs de Filtro**
    - São *strings arbitrárias* (por exemplo, `"UsuarioFilter"`).
    - Devem ser únicos por domínio/necessidade, para não confundir filtros em diferentes classes.

---

## 8. Melhores Práticas e Padrões de Uso

1. **Padronizar IDs de Filtro**
    - Use nomes descritivos e consistentes, como `<NomeDaClasse>Filter` ou `<Recurso>Filter`. Ex: `"UsuarioFilter"`, `"PedidoResumoFilter"`.
2. **Centralizar Configuração do `FilterProvider`**
    - Se você tiver filtros compartilhados entre múltiplos controladores, considere criar métodos utilitários ou um `@Component` que gere o `FilterProvider` padrão para “usuário normal”, “usuário admin”, etc.
3. **Evitar Lógica Extrema em Filtros**
    - Mantenha o uso de `SimpleBeanPropertyFilter` para inclusão/exclusão básica. Para lógicas de filtragem condicionais mais elaboradas (ex.: “se campo X for null, omita Y”), prefira criar `JsonSerializer` customizado ou usar `@JsonView`.
4. **Não Depender de Filtros para Segurança**
    - Um filtro não é garantia de segurança. Se algum campo realmente não deva sair do servidor (por questões de compliance/regulatórias), remova-o do modelo que vai para o controlador (DTO) ou use mecanismos de segurança de dados (criptografia, tokens, etc.).
5. **Documentação e Testes**
    - Documente em comentários qual é o propósito de cada filtro (por exemplo, “Filtro de retorno para chamadas públicas” ou “Filtro para endpoints administrativos”).
    - Escreva testes (unitários ou de integração) que verifiquem quais campos aparecem em cada endpoint filtrado.

---

## 9. Exemplo Prático Completo

A seguir, um projeto simplificado que ilustra como configurar e usar filtros dinâmicos em um cenário de **Gerenciamento de Usuários**.

### 9.1 Estrutura de Pastas (resumida)

```
src/
 └─ main/
     ├─ java/
     │   └─ com.example.demo/
     │       ├─ DemoApplication.java
     │       ├─ config/
     │       │    └─ JacksonConfig.java
     │       ├─ controller/
     │       │    └─ UsuarioController.java
     │       ├─ model/
     │       │    └─ Usuario.java
     │       └─ service/
     │            └─ UsuarioService.java
     └─ resources/
          └─ application.properties

```

---

### 9.2 Model: `Usuario.java`

```java
package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonFilter;

@JsonFilter("UsuarioFilter")
public class Usuario {
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String telefone;

    // Construtor para simplificar o exemplo
    public Usuario(Long id, String nome, String email, String senha, String telefone) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
}

```

- **Comentário:**
    - A anotação `@JsonFilter("UsuarioFilter")` permite filtrar dinamicamente quais propriedades desse modelo aparecerão no JSON final.

---

### 9.3 Configuração do Jackson: `JacksonConfig.java`

```java
package com.example.demo.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper(ObjectMapper defaultMapper) {
        // Cria um FilterProvider sem filtros específicos
        SimpleFilterProvider filterProvider = new SimpleFilterProvider()
            .setFailOnUnknownId(false);
        // Registra no ObjectMapper padrão do Spring
        defaultMapper.setFilterProvider(filterProvider);
        return defaultMapper;
    }
}

```

- **Comentário:**
    - Aqui, injetamos o `ObjectMapper` já inicializado pelo Spring e apenas adicionamos um `SimpleFilterProvider` vazio, deixando a responsabilidade de adicionar filtros concretos para os controllers.

---

### 9.4 Serviço Simples: `UsuarioService.java`

```java
package com.example.demo.service;

import com.example.demo.model.Usuario;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class UsuarioService {

    // Retorna uma lista fixa para simplificar o exemplo
    public List<Usuario> buscarTodos() {
        return Arrays.asList(
            new Usuario(1L, "Ana Silva", "ana@example.com", "senha123", "1234-5678"),
            new Usuario(2L, "Bruno Costa", "bruno@example.com", "minhaSenha", "9876-5432")
        );
    }
}

```

- **Comentário:**
    - Serviço fictício que retorna usuários estáticos. Em um caso real, faria busca em banco de dados via JPA/Repository.

---

### 9.5 Controlador: `UsuarioController.java`

```java
package com.example.demo.controller;

import com.example.demo.model.Usuario;
import com.example.demo.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final ObjectMapper objectMapper;

    public UsuarioController(UsuarioService usuarioService, ObjectMapper objectMapper) {
        this.usuarioService = usuarioService;
        this.objectMapper = objectMapper;
    }

    /**
     * Exemplo de endpoint que inclui apenas "id" e "nome" na resposta JSON.
     */
    @GetMapping("/usuarios/filtro-inclusao")
    public ResponseEntity<MappingJacksonValue> getUsuariosFiltroInclusao() {
        List<Usuario> lista = usuarioService.buscarTodos();

        // 1. Define filtro que inclui apenas "id" e "nome"
        SimpleBeanPropertyFilter filtroInclusao = SimpleBeanPropertyFilter
            .filterOutAllExcept("id", "nome");
        SimpleFilterProvider providers = new SimpleFilterProvider()
            .addFilter("UsuarioFilter", filtroInclusao);

        // 2. Cria MappingJacksonValue e associa o filtro
        MappingJacksonValue wrapper = new MappingJacksonValue(lista);
        wrapper.setFilters(providers);

        return ResponseEntity.ok(wrapper);
    }

    /**
     * Exemplo de endpoint que exclui a propriedade "senha", mas retorna todas as outras.
     */
    @GetMapping("/usuarios/filtro-exclusao")
    public ResponseEntity<MappingJacksonValue> getUsuariosFiltroExclusao() {
        List<Usuario> lista = usuarioService.buscarTodos();

        // Exclui a propriedade "senha"
        SimpleBeanPropertyFilter filtroExclusao = SimpleBeanPropertyFilter
            .serializeAllExcept("senha");
        SimpleFilterProvider providers = new SimpleFilterProvider()
            .addFilter("UsuarioFilter", filtroExclusao);

        MappingJacksonValue wrapper = new MappingJacksonValue(lista);
        wrapper.setFilters(providers);

        return ResponseEntity.ok(wrapper);
    }
}

```

- **Comentário Detalhado:**
    - **Linha 19–23:** `/usuarios/filtro-inclusao` — cria um filtro que *mantém apenas* “id” e “nome”. Todas as demais propriedades, incluindo `email`, `senha` e `telefone`, são suprimidas no JSON final.
    - **Linha 31–35:** `/usuarios/filtro-exclusao` — cria um filtro que *exclui* apenas o campo `senha`. Assim, `id`, `nome`, `email` e `telefone` aparecem no JSON, mas nunca expomos a senha.

---

### 9.6 Testando os Endpoints

- **Request GET** `http://localhost:8080/usuarios/filtro-inclusao`**Response (JSON):**
    
    ```json
    [
      {
        "id": 1,
        "nome": "Ana Silva"
      },
      {
        "id": 2,
        "nome": "Bruno Costa"
      }
    ]
    
    ```
    
- **Request GET** `http://localhost:8080/usuarios/filtro-exclusao`**Response (JSON):**
    
    ```json
    [
      {
        "id": 1,
        "nome": "Ana Silva",
        "email": "ana@example.com",
        "telefone": "1234-5678"
      },
      {
        "id": 2,
        "nome": "Bruno Costa",
        "email": "bruno@example.com",
        "telefone": "9876-5432"
      }
    ]
    
    ```
    

---

## 10. Sugestões para Aprofundamento

- **GitHub do Jackson:**
Explorar o repositório oficial para projetos avançados de customização de serialização:
[https://github.com/FasterXML/jackson-databind](https://github.com/FasterXML/jackson-databind)
- **`@JsonView` vs. `@JsonFilter`:**
Pesquisar sobre o uso de `@JsonView` (componentes estáticos de exibição de campos agrupados em “views”) como alternativa em cenários onde os conjuntos de campos são fixos e conhecidos em compilação.
- **Custom `JsonSerializer` e `JsonDeserializer`:**
Quando a lógica de serialização/desserialização depender de condições mais granulares (por exemplo, mascarar parte de um CPF, formatar datas de forma específica ou criar objetos aninhados), estude como criar *serializers* e *deserializers* personalizados:
[https://www.baeldung.com/jackson-custom-serialization](https://www.baeldung.com/jackson-custom-serialization)
- **Uso de DTOs e Projeções JPA:**
Para reduzir tráfego de rede e CPU em apps de larga escala, avaliar a modelagem de objetos específicos para consultas (DTOs no JPA com construtor em JPQL) ou uso de interfaces de projeção no Spring Data JPA.

---

Com isso, você tem um panorama completo de como implementar filtros dinâmicos usando Jackson no contexto de um projeto Spring Boot em Java. O uso do `@JsonFilter` com `SimpleFilterProvider` proporciona flexibilidade para montar diferentes “visões” de um mesmo objeto, de acordo com cada necessidade de endpoint, sem proliferar classes DTOs ou poluir o modelo de domínio com muitas anotações estáticas.