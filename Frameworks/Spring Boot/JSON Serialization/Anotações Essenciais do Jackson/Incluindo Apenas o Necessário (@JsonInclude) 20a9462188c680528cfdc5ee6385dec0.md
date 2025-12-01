# Incluindo Apenas o Necessário (@JsonInclude)

---

## Introdução

O Jackson é uma biblioteca amplamente utilizada em aplicações Java (especialmente com Spring Boot) para serialização e desserialização de objetos em JSON. Por meio de anotações, podemos controlar com precisão como o JSON é gerado ou interpretado, incluindo quais campos devem ser incluídos, renomeados ou ignorados. Neste guia, abordaremos as anotações essenciais do Jackson em um nível prático, com ênfase particular em `@JsonInclude`, que permite “incluir apenas o necessário” nos objetos JSON gerados.

---

## Sumário

1. [Conceitos Fundamentais](Incluindo%20Apenas%20o%20Necess%C3%A1rio%20(@JsonInclude)%2020a9462188c680528cfdc5ee6385dec0.md)
2. [Sintaxe Detalhada e Uso Prático](Incluindo%20Apenas%20o%20Necess%C3%A1rio%20(@JsonInclude)%2020a9462188c680528cfdc5ee6385dec0.md)
    1. [`@JsonInclude`](Incluindo%20Apenas%20o%20Necess%C3%A1rio%20(@JsonInclude)%2020a9462188c680528cfdc5ee6385dec0.md)
    2. Outras Anotações Essenciais (`@JsonProperty`, `@JsonIgnore`, etc.)
3. [Cenários de Restrição ou Não Aplicação](Incluindo%20Apenas%20o%20Necess%C3%A1rio%20(@JsonInclude)%2020a9462188c680528cfdc5ee6385dec0.md)
4. [Componentes Chave Associados](Incluindo%20Apenas%20o%20Necess%C3%A1rio%20(@JsonInclude)%2020a9462188c680528cfdc5ee6385dec0.md)
    1. Classes e Interfaces Principais do Jackson
    2. Atributos de Configuração (por exemplo, `SerializationFeature`)
5. [Melhores Práticas e Padrões de Uso](Incluindo%20Apenas%20o%20Necess%C3%A1rio%20(@JsonInclude)%2020a9462188c680528cfdc5ee6385dec0.md)
6. [Exemplo Prático Completo](Incluindo%20Apenas%20o%20Necess%C3%A1rio%20(@JsonInclude)%2020a9462188c680528cfdc5ee6385dec0.md)
7. [Sugestões para Aprofundamento](Incluindo%20Apenas%20o%20Necess%C3%A1rio%20(@JsonInclude)%2020a9462188c680528cfdc5ee6385dec0.md)

---

### Conceitos Fundamentais

- **O que é Jackson?**
    - Jackson é uma biblioteca para processar dados em formato JSON (serialização e desserialização) em aplicações Java.
    - No contexto do Spring Boot, Jackson é o *parser* JSON padrão (através do módulo `spring-boot-starter-json`).
    - Objetivo principal: converter automaticamente objetos Java (`POJOs`) em JSON e vice-versa, respeitando anotações que definem regras de mapeamento.
- **Por que usar anotações?**
    - Fornecem controle granular sobre como cada campo ou classe será representado em JSON.
    - Permitem evitar escrever código manual de conversão (como mapeamento manual em métodos), tornando o código mais limpo e de fácil manutenção.
    - Exemplos de controle:
        - Excluir campos nulos ou vazios (`@JsonInclude`).
        - Ignorar campos sensíveis (`@JsonIgnore`).
        - Renomear propriedades no JSON (`@JsonProperty`).
        - Controlar construtores ou métodos para desserialização (`@JsonCreator`, `@JsonValue`).
- **Importância de `@JsonInclude`:**
    - Evita ruído no JSON enviado ao cliente (ou gravado em arquivos) ao omitir valores considerados “desnecessários” (por exemplo, campos `null` ou coleções vazias).
    - Pode reduzir o tamanho do payload e melhorar a legibilidade, além de evitar confusão sobre campos que não possuem valores relevantes naquele contexto.

---

### Sintaxe Detalhada e Uso Prático

### `@JsonInclude`

A anotação `@JsonInclude` define regras sobre quando um atributo de classe deve ser incluído no JSON. Pode ser aplicada em nível de **classe** (afetando todos os campos) ou **campo específico**.

```java
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

// Exemplo em nível de classe: todos os campos com valor null serão omitidos
@JsonInclude(Include.NON_NULL)
public class ExemploClasse {
    private String nome;          // Se `nome` for null, não aparecerá no JSON
    private Integer idade;        // Se `idade` for null, não aparecerá no JSON
    private List<String> tags;    // Se `tags` for null, não aparecerá no JSON
    // Getters e setters omitidos para brevidade
}

// Exemplo em nível de campo: apenas este campo específico usará a regra
public class OutroExemplo {
    private String titulo;

    @JsonInclude(Include.NON_EMPTY)
    private List<String> itens;
    // Se `itens` for null ou vazio, não aparecerá no JSON; os outros campos seguem o padrão global
    // Getters e setters omitidos para brevidade
}

```

### Valores de `Include` (enum `JsonInclude.Include`)

- `Include.ALWAYS`: inclui sempre (padrão).
- `Include.NON_NULL`: inclui somente se o valor **não** for `null`.
- `Include.NON_EMPTY`: inclui se o valor **não** for `null nem vazio** (`""\`, coleções vazias, mapas vazios).
- `Include.NON_DEFAULT`: inclui se o valor **diferir** do valor padrão (por exemplo, 0 para números, false para booleanos).
- `Include.CUSTOM`: permite definir regra própria com `JsonInclude.Value` e `ValueFilter` (usos avançados).

**Uso prático comentado**:

```java
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_EMPTY) // 1) Em nível de classe, aplica a todos os campos desta classe
public class Produto {
    private String nome;              // se nome == null ou == "", omitido
    private Double preco;             // se preco == null ou == 0.0 (padrão), omitido?
    private String descricao;         // se descricao == null ou == "", omitido
    private List<String> categorias;  // se categorias == null ou vazia, omitido

    // Somente fixar um comportamento diferente em um campo:
    @JsonInclude(Include.NON_NULL)
    private String observacao;        // se observacao == null, omitido; se vazia (""), aparecerá

    // Construtores, getters e setters...
}

```

### Outras Anotações Essenciais

Embora o foco seja `@JsonInclude`, as anotações a seguir são também fundamentais para o manuseio de JSON com Jackson:

1. **`@JsonProperty`**
    - Usada para mapear nomes de propriedades Java para nomes de atributos JSON (e vice-versa).
    - Pode ser aplicada em campos ou getters/setters.
    
    ```java
    import com.fasterxml.jackson.annotation.JsonProperty;
    
    public class Usuario {
        @JsonProperty("user_name")        // no JSON aparecerá como "user_name", no Java é `nomeUsuario`
        private String nomeUsuario;
    
        @JsonProperty(required = true)    // indica que durante desserialização, esse campo é obrigatório
        private String email;
    
        // Getters e setters...
    }
    
    ```
    
    - Propriedades:
        - `value`: nome no JSON.
        - `required`: se true, falha se estiver ausente no JSON.
        - `index`: para ordenação (usado raramente).
2. **`@JsonIgnore` e `@JsonIgnoreProperties`**
    - `@JsonIgnore` (em campo ou método) faz com que aquele campo seja completamente ignorado na serialização e desserialização.
    - `@JsonIgnoreProperties` (em nível de classe) recebe uma lista de nomes de propriedades a serem ignoradas.
    
    ```java
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    
    @JsonIgnoreProperties({ "senha", "tokenAutenticacao" })
    public class ContaBancaria {
        private String numero;
        private Double saldo;
    
        @JsonIgnore                     // campo ignorado mesmo se não listado em JsonIgnoreProperties
        private String senha;
    
        private String tokenAutenticacao;
        // Getters e setters...
    }
    
    ```
    
3. **`@JsonCreator`, `@JsonValue` e Construtores customizados**
    - `@JsonCreator`: usado em construtores ou métodos estáticos para indicar como criar instâncias ao desserializar.
    - `@JsonValue`: indica que um método específico retorna o valor “primário” daquele objeto.
    
    ```java
    import com.fasterxml.jackson.annotation.JsonCreator;
    import com.fasterxml.jackson.annotation.JsonValue;
    
    public class StatusPedido {
        private final String codigo;
    
        @JsonCreator
        public StatusPedido(String codigo) {   // ao desserializar, Jackson usará este construtor
            this.codigo = codigo;
        }
    
        @JsonValue
        public String toValue() {              // ao serializar, Jackson usará o retorno deste método
            return this.codigo;
        }
    }
    
    ```
    
    - Útil para representar enums ou wrappers.
4. **`@JsonFormat`**
    - Controla formato de datas e números durante a serialização/desserialização.
    
    ```java
    import com.fasterxml.jackson.annotation.JsonFormat;
    import java.time.LocalDateTime;
    
    public class Evento {
        private String nome;
    
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime dataHora;  // garante formato específico no JSON
    
        // Getters e setters...
    }
    
    ```
    
5. **`@JsonAnyGetter` e `@JsonAnySetter`**
    - Permitem mapear propriedades desconhecidas (ou dinâmicas) para um `Map<String, Object>`.
    
    ```java
    import com.fasterxml.jackson.annotation.JsonAnyGetter;
    import com.fasterxml.jackson.annotation.JsonAnySetter;
    import java.util.HashMap;
    import java.util.Map;
    
    public class AtributosDinamicos {
        private Map<String, Object> atributos = new HashMap<>();
    
        @JsonAnySetter
        public void adicionarAtributo(String nome, Object valor) {
            atributos.put(nome, valor);
        }
    
        @JsonAnyGetter
        public Map<String, Object> pegarAtributos() {
            return atributos;
        }
    }
    
    ```
    

---

### Cenários de Restrição ou Não Aplicação

1. **Quando não usar `@JsonInclude` em massa**
    - Em payloads críticos de auditoria: se for necessário registrar explicitamente “campo nulo” para rastreabilidade.
    - Em APIs que definem contrato estrito (p. ex., `OpenAPI`/`Swagger`) onde a ausência de um campo altera o contrato e confunde consumidores.
2. **Performance em estruturas muito grandes**
    - Processar regras de exclusão em objetos enormes pode impactar a velocidade de serialização. Se a prioridade for performance extrema, pode ser melhor usar visões (DTOs menores) ou configurar `ObjectMapper` globalmente.
3. **Ambientes onde JSON precisa ter sempre todas as chaves (mesmo nulas)**
    - Em sistemas legados onde o receptor espera campos mesmo que nulos.
    - Cenários de compatibilidade reversa, em que a ausência de chaves atrapalharia clientes antigos que não conseguem lidar com valores faltantes.
4. **Uso de outros formatos ou bibliotecas**
    - Se não for usado Jackson (por exemplo, GSON ou JSON-B). Nesse caso, as anotações do Jackson não terão efeito.
    - Em serializações internas no banco de dados (por ex., colunas JSON no PostgreSQL) em que se prefira converter manualmente.

---

### Componentes Chave Associados

### 1. Classes e Interfaces Principais do Jackson

- **`com.fasterxml.jackson.databind.ObjectMapper`**
    - Classe central para serializar (método `writeValueAsString`) e desserializar (`readValue`).
    - Pode ser configurado globalmente (bean no Spring) para definir `SerializationFeature`, `DeserializationFeature`, filtros, módulos, etc.
- **`com.fasterxml.jackson.databind.annotation.JsonSerialize` / `@JsonDeserialize`**
    - Anotações para indicar uso de serializadores ou desserializadores customizados (subclasses de `JsonSerializer` e `JsonDeserializer`).
    - Exemplos: converter um enum por código numérico personalizado.
- **`com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider`**
    - Usado em conjunto com `@JsonFilter` para aplicação de filtros dinâmicos (incluir/excluir subconjuntos de campos em tempo de execução).
- **`com.fasterxml.jackson.databind.Module`**
    - Permite registrar comportamentos adicionais (ex.: suporte a tipos de data do Java 8 com `JavaTimeModule`).

### 2. Atributos de Configuração (`SerializationFeature`, `DeserializationFeature`)

Alguns exemplos de ajustes globais via `ObjectMapper`:

```java
ObjectMapper mapper = new ObjectMapper();

// Ignorar propriedades desconhecidas durante a desserialização
mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

// Serializar datas no formato ISO
mapper.registerModule(new JavaTimeModule());
mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

// Em vez de usar anotações, forçar globalmente a omissão de campos nulos
mapper.setSerializationInclusion(Include.NON_NULL);

```

No Spring Boot, podemos expor um bean:

```java
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        // Exemplo: omitir todos os campos nulos em toda a aplicação
        mapper.setSerializationInclusion(Include.NON_NULL);
        // Outras configurações...
        return mapper;
    }
}

```

---

### Melhores Práticas e Padrões de Uso

1. **Use `@JsonInclude` com critério adequado**
    - Para APIs públicas, prefira `Include.NON_NULL` para omitir apenas `null`.
    - Quando lidar com coleções, `Include.NON_EMPTY` pode ser útil para omitir listas vazias.
    - Evite `NON_DEFAULT` se você não entender todos os valores padrões do tipo básico.
2. **Centralize configurações recorrentes**
    - Se todos os modelos devem omitir campos nulos, configure `ObjectMapper` globalmente em vez de anotar cada classe.
    - Caso apenas alguns modelos precisem de comportamento específico, anote somente aqueles.
3. **Combine `@JsonInclude` com DTOs (Data Transfer Objects)**
    - Em vez de anotar entidades de banco diretamente, fabrique DTOs para a camada de apresentação.
    - Isso evita expor campos sensíveis (como IDs internos) e facilita aplicar diferentes regras de inclusão.
4. **Documente sempre o comportamento do JSON**
    - No contrato da API (por exemplo, via Swagger/OpenAPI), deixe claro quais campos podem ter valores ausentes ou quais são opcionais.
    - Use `required = true/false` em `@JsonProperty` para reforçar o contrato.
5. **Considere o impacto no cliente**
    - Se um campo for omitido (`null`), certifique-se de que o cliente lide bem com essa ausência.
    - Caso seja necessário diferenciar “ausente” de “vazio”, use `Include.NON_NULL` (ausente) e evite `NON_EMPTY`.
6. **Valide objetos antes da serialização**
    - Se certos campos são mutuamente exclusivos ou possivelmente inconsistentes (ex.: `valorDesconto` > `valorVenda`), valide antes de converter em JSON.
    - Isso evita que os clientes recebam representações JSON inválidas.

---

### Exemplo Prático Completo

A seguir, um projeto Spring Boot simplificado que ilustra:

- Modelos com `@JsonInclude`
- Controller REST retornando JSON
- Comportamento de omissão de campos nulos ou vazios

> Estrutura de pacotes (exemplo mínimo)
> 
> 
> ```
> src/
> └── main/
>     ├── java/
>     │   └── com/
>     │       └── exemplo/
>     │           ├── DemoApplication.java
>     │           ├── controller/
>     │           │   └── ProdutoController.java
>     │           └── model/
>     │               └── Produto.java
>     └── resources/
>         └── application.properties
> 
> ```
> 

### 1. `DemoApplication.java`

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

### 2. `Produto.java` (Modelo com `@JsonInclude`)

```java
package com.exemplo.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.util.List;

/**
 * Exemplo de entidade de produto que será serializada em JSON.
 * Usamos @JsonInclude para omitir campos nulos/vazios.
 */
@JsonInclude(Include.NON_EMPTY)
public class Produto {

    private Long id;

    private String nome;

    // Campo categoria: se for null ou lista vazia, será omitido.
    private List<String> categorias;

    // Campo descrição: se for null ou string vazia, será omitido.
    private String descricao;

    // Campo preço: se for null, será omitido; se for zero (padrão), aparecerá (configuração em nível de classe não filtra valor padrão).
    private Double preco;

    // Getters e setters
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

    public List<String> getCategorias() {
        return categorias;
    }
    public void setCategorias(List<String> categorias) {
        this.categorias = categorias;
    }

    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getPreco() {
        return preco;
    }
    public void setPreco(Double preco) {
        this.preco = preco;
    }
}

```

### 3. `ProdutoController.java` (REST Controller)

```java
package com.exemplo.controller;

import com.exemplo.model.Produto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;

/**
 * Exemplo de controller que retorna diferentes cenários de Produto
 * demonstrando o efeito de @JsonInclude(Include.NON_EMPTY).
 */
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    /**
     * Retorna um produto com todos os campos preenchidos.
     */
    @GetMapping("/completo")
    public ResponseEntity<Produto> obterProdutoCompleto() {
        Produto p = new Produto();
        p.setId(1L);
        p.setNome("Laptop Ultra");
        p.setPreco(5999.90);
        p.setDescricao("Notebook de alto desempenho");
        p.setCategorias(Arrays.asList("Eletrônicos", "Computadores"));
        return ResponseEntity.ok(p);
    }

    /**
     * Retorna um produto com alguns campos nulos ou vazios,
     * demonstrando que serão omitidos no JSON.
     */
    @GetMapping("/parcial")
    public ResponseEntity<Produto> obterProdutoParcial() {
        Produto p = new Produto();
        p.setId(2L);
        p.setNome("Cadeira Gamer");
        // preco não está definido (null) → será omitido
        p.setDescricao("");                    // string vazia → será omitida (NON_EMPTY)
        p.setCategorias(Collections.emptyList()); // lista vazia → será omitida (NON_EMPTY)
        return ResponseEntity.ok(p);
    }
}

```

### 4. `application.properties`

```
# Definindo porta customizada, por exemplo:
server.port=8081

# (Opcional) Incluir omissão global de nulos — mas não necessário, pois usamos anotação em classe:
spring.jackson.default-property-inclusion=non_empty

```

---

### Ao executar e consultar as rotas:

1. **Requisição**
    
    ```
    GET <http://localhost:8081/api/produtos/completo>
    
    ```
    
    **Resposta JSON**
    
    ```json
    {
      "id": 1,
      "nome": "Laptop Ultra",
      "categorias": ["Eletrônicos", "Computadores"],
      "descricao": "Notebook de alto desempenho",
      "preco": 5999.9
    }
    
    ```
    
2. **Requisição**
    
    ```
    GET <http://localhost:8081/api/produtos/parcial>
    
    ```
    
    **Resposta JSON**
    
    ```json
    {
      "id": 2,
      "nome": "Cadeira Gamer"
    }
    
    ```
    
    - Note que `descricao` (vazia) e `categorias` (vazia) foram omitidas por `Include.NON_EMPTY`.
    - `preco` é `null` (não definido) e, portanto, também é omitido.

---

### Sugestões para Aprofundamento

1. **Documentação Oficial do Jackson**
    - Guia geral de anotações:
    [https://github.com/FasterXML/jackson-annotations/wiki/Jackson-Annotations](https://github.com/FasterXML/jackson-annotations/wiki/Jackson-Annotations)
2. **Livro “Jackson in Action” (Deusto)**
    - Aborda uso avançado, filtros dinâmicos, módulos e customizações profundas.
3. **Spring Boot Reference**
    - Seção sobre JSON e Jackson:
    [https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-json](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-json)
4. **Especificações de Identidade (JSON Schema)**
    - Como combinar anotações Jackson com JSON Schema para validação:
    [https://json-schema.org/](https://json-schema.org/)
5. **Artigos e Tutoriais Online**
    - Exemplos de uso de `@JsonInclude` com `ObjectMapper` global.
    - Comparativos entre Jackson e outras bibliotecas (GSON, JSON-B).

---

**Conclusão**
As anotações do Jackson fornecem um controle fino sobre a serialização e desserialização de objetos Java para JSON. O uso de `@JsonInclude` — especialmente `Include.NON_NULL` ou `Include.NON_EMPTY` — permite “incluir apenas o necessário” no payload, resultando em JSONs mais enxutos, legíveis e que evitam enviar dados irrelevantes. Em cenários em que se precisa de configuração global, basta ajustar o `ObjectMapper` no Spring Boot para aplicar a inclusão desejada em toda a aplicação. Além disso, combinar `@JsonInclude` com outras anotações essenciais (como `@JsonProperty` e `@JsonIgnore`) garante que a representação JSON atenda exatamente aos requisitos do seu contrato de API. Finalmente, lembre-se de avaliar se a omissão de campos pode impactar clientes legados ou contratos preestabelecidos antes de aplicar as anotações em massa.