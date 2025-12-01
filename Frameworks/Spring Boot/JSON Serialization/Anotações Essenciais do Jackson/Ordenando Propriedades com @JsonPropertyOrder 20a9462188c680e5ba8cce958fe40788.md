# Ordenando Propriedades com @JsonPropertyOrder

---

## 1. Introdução

No contexto de aplicações Spring Boot que utilizam o Jackson para serialização JSON, a ordem em que as propriedades de um objeto aparecem no JSON gerado pode ser relevante para legibilidade, contratos de API ou integração com sistemas legados que esperam campos em uma sequência específica. A anotação `@JsonPropertyOrder` do Jackson permite definir explicitamente essa ordem de forma declarativa, sem precisar alterar a lógica de serialização manualmente.

---

## 2. Sumário

1. **Conceitos Fundamentais**
    
    1.1. O que é Jackson e por que ordenar propriedades
    
    1.2. Propósito do `@JsonPropertyOrder`
    
2. **Sintaxe Detalhada e Uso Prático**
    
    2.1. Uso básico de `@JsonPropertyOrder` em uma classe Java
    
    2.2. Variações de sintaxe: lista de propriedades, ordem alfabética, inclusão/exclusão
    
    2.3. Interação com outras anotações (`@JsonProperty`, `@JsonIgnore`)
    
3. **Cenários de Restrição ou Não Aplicação**
    
    3.1. Ordenação redundante em APIs que não exigem contrato de campo fixo
    
    3.2. Quando a performance ganha prioridade sobre a ordem legível
    
    3.3. Diferenças entre JSON e outros formatos (XML, YAML)
    
4. **Componentes Chave Associados**
    
    4.1. `@JsonPropertyOrder` (classe e atributos)
    
    4.2. `com.fasterxml.jackson.databind.ObjectMapper` e configurações globais
    
    4.3. Outras anotações relevantes (`@JsonProperty`, `@JsonIgnoreProperties`)
    
5. **Melhores Práticas e Padrões de Uso**
    
    5.1. Manter contratos de API coerentes (versionamento)
    
    5.2. Evitar duplicidade de configuração (classe + global)
    
    5.3. Preferir ordem alfabética quando não há dependência de sequência fixa
    
6. **Exemplo Prático Completo**
    
    6.1. Estrutura de um projeto Spring Boot simples
    
    6.2. Entidade Java anotada com `@JsonPropertyOrder`
    
    6.3. Controller que retorna JSON com ordem definida
    
    6.4. Teste manual via cURL/Postman
    
7. **Sugestões para Aprofundamento**
    
    7.1. Documentação oficial do Jackson (fasterxml)
    
    7.2. Customização avançada com módulos Jackson
    
    7.3. Ordenação dinâmica em tempo de execução
    

---

## 3. Conceitos Fundamentais

### 3.1. O que é Jackson e por que ordenar propriedades

- **Jackson** é uma das bibliotecas mais populares para serializar e desserializar objetos Java em JSON (e vice-versa).
- Por padrão, o Jackson usa a ordem de declaração dos campos na classe Java (ou “ordem de reflexão”, que pode variar). Em muitos casos, essa ordem já é suficiente.
- **Por que ordenar manualmente?**
    - Contratos de API: se um cliente legarádo espera campos em sequência específica.
    - Legibilidade: para objetos grandes, agrupar campos relacionados em bloco facilita entendimento.
    - Consistência entre versões: garantir que mesmo após reorganizar campos na classe, o JSON mantiver a mesma ordem pública.

### 3.2. Propósito do `@JsonPropertyOrder`

- A anotação `@JsonPropertyOrder` (pacote `com.fasterxml.jackson.annotation`) serve para definir, no nível de classe, a sequência exata em que as propriedades devem aparecer no JSON gerado.
- Funciona apenas para serialização (transformar objeto Java em JSON). Não muda a maneira como JSON é lido (desserialização) a menos que você combine com validações de esquema.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Uso básico de `@JsonPropertyOrder` em uma classe Java

```java
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

// Define a ordem explícita: primeiro "id", depois "nome" e em seguida "email"
@JsonPropertyOrder({ "id", "nome", "email" })
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;

    // Construtores, getters e setters omitidos para brevidade
}

```

- Coloque a anotação no topo da classe (antes do `public class ...`).
- A lista de propriedades deve corresponder exatamente aos nomes usados pelo Jackson (normalmente, o nome do campo ou, se houver `@JsonProperty("x")`, o valor de `"x"`).

### 4.2. Variações de sintaxe

1. **Ordem por lista de propriedades**
    - `@JsonPropertyOrder({ "campoA", "campoB", "campoC" })` → segue exatamente a sequência informada.
    - Se faltar algum campo na lista, esses campos ausentes serão serializados **após** a sequência definida, na ordem de declaração original ou alfabética (depende de configurações globais).
    - Exemplo:
        
        ```java
        @JsonPropertyOrder({ "nome", "id" })
        // “email” não está na lista → será serializado após “nome” e “id”
        public class UsuarioSimplificado {
            private Long id;
            private String nome;
            private String email;
            // getters e setters
        }
        
        ```
        
2. **Ordem alfabética automática**
    - Jackson não oferece diretamente um `@JsonPropertyOrder` “alfabético”. Porém, é possível ativar configuração global no `ObjectMapper`:
        
        ```java
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY, true);
        
        ```
        
    - Essa configuração ordena **todas** as propriedades de todas as classes em ordem alfabética de nome (útil para debug ou consistência).
    - Atenção: essa configuração global sobrepõe anotações de ordem, a menos que se desabilite especificamente o `AnnotationIntrospector`.
3. **Mix de lista + ordem alfabética para campos ausentes**
    - Se você passa `@JsonPropertyOrder({ "campo1", "campo2" })` e configura `SORT_PROPERTIES_ALPHABETICALLY`, então:
        1. Campos listados obedecem à ordem definida.
        2. Demais campos (não citados) aparecem em ordem alfabética após os listados.
4. **Annotating com `alphabetic = true` (Jackson 2.9+)?**
    - Algumas versões oferecem parâmetro `alphabetic` (apenas para compatibilidade retroativa), mas a forma recomendada é usar `MapperFeature.SORT_PROPERTIES_ALPHABETICALLY` no `ObjectMapper`.

### 4.3. Interação com outras anotações

- **`@JsonProperty("novoNome")`**
    - Se você renomear um campo para o JSON (`@JsonProperty("novoNome")`), na lista de `@JsonPropertyOrder` você deve usar `"novoNome"`, não o atributo Java.
    
    ```java
    @JsonPropertyOrder({ "identificador", "nomeUsuario" })
    public class ContaDTO {
        @JsonProperty("identificador")
        private Long id;
    
        @JsonProperty("nomeUsuario")
        private String nome;
    
        private String email;
    
        // getters e setters
    }
    
    ```
    
- **`@JsonIgnore` ou `@JsonIgnoreProperties`**
    - Propriedades ignoradas não aparecem mesmo que constantes em `@JsonPropertyOrder`.
    - Se um campo está anotado com `@JsonIgnore`, você pode omiti-lo da lista ou mantê-lo (não causa erro, mas não será exibido).

---

## 5. Cenários de Restrição ou Não Aplicação

### 5.1. Ordenação redundante em APIs que não exigem contrato de campo fixo

- Em muitas APIs REST, clientes (browsers, apps, bibliotecas JSON) não se importam com a ordem de campos.
- Nesse caso, adicionar `@JsonPropertyOrder` pode ser desnecessário—o benefício é apenas cosmético ou para documentação.
- **Quando evitar**:
    - Propriedades pequenas, sem relevância de agrupamento.
    - APIs internas onde a equipe aceitou variações de ordem sem problemas.

### 5.2. Quando a performance ganha prioridade sobre a ordem legível

- Adicionar ordenação (especialmente alfabética global) pode impactar ligeiramente a performance de serialização, pois o Jackson precisa organizar um `TreeMap` em vez de iterar direto sobre campos.
- Em aplicações high-throughput, avalie se a sobrecarga de ordenação é justificável.

### 5.3. Diferenças entre JSON e outros formatos (XML, YAML)

- **JSON:** foco principal do Jackson. `@JsonPropertyOrder` funciona apenas para JSON.
- **XML (Jackson XML):** usa anotações diferentes, como `@JacksonXmlProperty`. A ordenação em XML pode demandar `@JacksonXmlElementWrapper` ou configuração específica.
- **YAML:** similar ao JSON, mas se baseia em ordem de árvore; a ordenação manual nem sempre é visível ou necessária.

---

## 6. Componentes Chave Associados

### 6.1. `@JsonPropertyOrder`

- **Pacote**: `com.fasterxml.jackson.annotation.JsonPropertyOrder`
- **Uso**: anotação de classe, valor é um array de strings.
- **Parâmetros principais**:
    - `value` (array de `String`): nomes exatos das propriedades (JSON) na sequência desejada.
    - `alphabetic` (Jackson 2.9+; raramente usado): quando `true`, aplica ordem alfabética a todos os campos ignorando valor de `value`.

### 6.2. `com.fasterxml.jackson.databind.ObjectMapper` e configurações globais

- **`SORT_PROPERTIES_ALPHABETICALLY`** (MapperFeature)
    - Ativa ordenação alfabética de todas as propriedades de todas as classes, se `true`.
    - Sintaxe:
        
        ```java
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY, true);
        
        ```
        
    - Se você usa `SpringBoot`, pode customizar via bean:
        
        ```java
        @Configuration
        public class JacksonConfig {
            @Bean
            public ObjectMapper objectMapper() {
                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY, true);
                return mapper;
            }
        }
        
        ```
        

### 6.3. Outras anotações relevantes

- **`@JsonProperty("nomePersonalizado")`**: renomeia o campo no JSON; altere também em `@JsonPropertyOrder`.
- **`@JsonIgnore`** e **`@JsonIgnoreProperties`**: indicam campos que não devem ser serializados.
- **`@JsonInclude`**: pode influenciar quais propriedades aparecem (por exemplo, omitir `null`s); dependendo de inclusão/exclusão, a ordem pode ficar diferente se um campo for omitido.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Defina contratos de API de forma consciente**
    - Se consumidores de API (front-end, sistemas legados) dependem de ordem fixa, documente claramente.
    - Versione sua API: se, em versões futuras, houver mudanças na ordem, incremente a versão (por ex.: `/v1/usuario` para `/v2/usuario`).
2. **Evite misturar configurações (classe + global)**
    - Se você usar `SORT_PROPERTIES_ALPHABETICALLY = true` global, não será necessário especificar `@JsonPropertyOrder` para cada classe, a menos que queira sobrescrever.
    - Se for necessário apenas em uma ou duas classes, prefira a anotação local.
3. **Use ordem alfabética quando não houver sequência semântica forte**
    - Para objetos que têm muitas propriedades e não há lógica de agrupamento “temático”, a ordenação alfabética global garante consistência.
    - Exemplo: DTOs de relatórios com 20+ campos que mudam frequentemente.
4. **Mantenha `@JsonPropertyOrder` atualizado**
    - Se você renomear um campo (alterar `@JsonProperty`), lembre de ajustar a lista em `@JsonPropertyOrder`, ou removê-lo para deixar a ordenação global assumir.
    - Cite apenas campos públicos relevantes: não inclua campos auxiliares nem variáveis internas.
5. **Agrupe semanticamente quando fizer sentido**
    - Ordene campos relacionados juntos (ex: dados pessoais agrupados: `nome`, `sobrenome`, `dataNascimento`; em seguida, dados de contato: `email`, `telefone`). Facilita entendimento na inspeção manual de payload.

---

## 8. Exemplo Prático Completo

A seguir, um projeto Spring Boot mínimo que demonstra a ordenação de propriedades com `@JsonPropertyOrder`.

### 8.1. Estrutura de Projeto

```
src
└── main
    ├── java
    │   └── com.exemplo.ordemjson
    │       ├── OrdenacaoJsonApplication.java
    │       ├── controller
    │       │   └── UsuarioController.java
    │       └── dto
    │           └── UsuarioDTO.java
    └── resources
        └── application.properties

```

### 8.2. Classe de Arranque (`OrdenacaoJsonApplication.java`)

```java
package com.exemplo.ordemjson;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrdenacaoJsonApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrdenacaoJsonApplication.class, args);
    }
}

```

### 8.3. DTO Anotado com `@JsonPropertyOrder` (`UsuarioDTO.java`)

```java
package com.exemplo.ordemjson.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

/**
 * Demonstra DTO de usuário com propriedade 'id' em primeiro,
 * depois 'nome', depois 'email', e então 'telefone'. Propriedades
 * restantes (se houvesse) seriam serializadas após, na ordem de declaração.
 */
@JsonPropertyOrder({ "idUsuario", "nome", "email", "telefone" })
public class UsuarioDTO {

    @JsonProperty("idUsuario")
    private Long id;

    private String nome;
    private String email;

    // Suponha que, em uma versão futura, adicionamos 'telefone'
    private String telefone;

    // Construtor padrão (Jackson exige)
    public UsuarioDTO() { }

    // Construtor completo
    public UsuarioDTO(Long id, String nome, String email, String telefone) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}

```

### 8.4. Controller Expondo o DTO (`UsuarioController.java`)

```java
package com.exemplo.ordemjson.controller;

import com.exemplo.ordemjson.dto.UsuarioDTO;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Simples controller que retorna um objeto UsuarioDTO.
 * Veja que o JSON gerado respeitará a ordem: idUsuario, nome, email, telefone.
 */
@RestController
public class UsuarioController {

    @GetMapping(value = "/usuario/exemplo", produces = MediaType.APPLICATION_JSON_VALUE)
    public UsuarioDTO getUsuarioExemplo() {
        // Em cenário real, viria de banco ou serviço; aqui, hard-coded para demonstração
        return new UsuarioDTO(42L, "Maria Silva", "maria.silva@exemplo.com", "+55 27 99999-0000");
    }
}

```

### 8.5. Propriedade `application.properties`

> Não é necessário configurar nada em application.properties para que @JsonPropertyOrder funcione.
> 
> 
> Caso queira habilitar ordenação alfabética global, bastaria adicionar:
> 
> ```
> spring.jackson.mapper.sort-properties-alphabetically=true
> 
> ```
> 

### 8.6. Teste Manual (via cURL ou Postman)

1. Inicie a aplicação (por ex.: `mvn spring-boot:run`).
2. Acesse `http://localhost:8080/usuario/exemplo`.

**Resposta JSON esperada:**

```json
{
  "idUsuario": 42,
  "nome": "Maria Silva",
  "email": "maria.silva@exemplo.com",
  "telefone": "+55 27 99999-0000"
}

```

- Observe que, mesmo que na classe Java os campos estivessem na ordem `id`, `nome`, `email`, `telefone`, a anotação `@JsonPropertyOrder({ "idUsuario", "nome", "email", "telefone" })` garante a exibição exatamente nessa sequência.
- Se removêssemos `"telefone"` da lista, o Jackson exibiria `telefone` por último, após os outros (ou de acordo com configuração global).

---

## 9. Cenários de Restrição ou Não Aplicação (Exemplificados)

1. **API Interna Sem Dependência de Ordem**
    - Em sistemas internos onde o front-end trata JSON de forma dinâmica (por chaves em qualquer ordem), não é necessário usar `@JsonPropertyOrder`.
    - Ordenação torna-se redundante e pode até confundir se alguém renomear campos e não atualizar a lista.
2. **Alta Performance em Serialização em Massa**
    - Em aplicações que serializam milhões de objetos por segundo, ativar ordenação alfabética global ou usar `@JsonPropertyOrder` em diversas classes pode adicionar overhead.
    - Nesses casos, prefira deixar Jackson usar a ordem de reflexão (mais rápida) ou retire qualquer customização de ordem.
3. **Formato de Saída Não-JSON**
    - Se a aplicação exporta também em XML (via Jackson XML), `@JsonPropertyOrder` não se aplica à ordenação dos elementos XML. Para isso, há outras anotações (`@JacksonXmlProperty`, `@JacksonXmlElementWrapper`) e configurações específicas.

---

## 10. Sugestões para Aprofundamento

1. **Documentação Oficial do Jackson**
    - [Jackson Annotation Reference](https://github.com/FasterXML/jackson-annotations) – lista completa de anotações e exemplos.
    - [Jackson User Guide](https://github.com/FasterXML/jackson-docs) – guia mais completo sobre configurações e módulos.
2. **Módulos Avançados do Jackson**
    - **Jackson Kotlin Module** (para projetos Kotlin): suporta recursos do Kotlin, incluindo ordenação baseada em data classes.
    - **Jackson JavaTimeModule** (para serializar `java.time.*` de forma adequada).
    - Personalização por meio de **MixIns**: caso queira aplicar `@JsonPropertyOrder` a classes de bibliotecas externas sem modificá-las diretamente.
3. **Ordenação Dinâmica em Tempo de Execução**
    - É possível escrever um `BeanSerializerModifier` personalizado que, em runtime, reordena campos conforme lógica específica (por exemplo, com base em parâmetros de URL).
4. **Ferramentas de Validação e Contrato**
    - Combine `@JsonPropertyOrder` com esquemas JSON (JSON Schema) para validar contratos e garantir que clientes legados só aceitem payloads na ordem esperada.

---

> Conclusão:
> 
> 
> A anotação `@JsonPropertyOrder` oferece controle fino sobre a sequência de propriedades no JSON gerado pelo Jackson, o que é valioso quando a ordem importa em integração ou documentação. Ao utilizá-la de forma consciente, você mantém contratos de API estáveis e facilita a legibilidade dos payloads, sem sobrecarregar a performance quando bem configurada.
>