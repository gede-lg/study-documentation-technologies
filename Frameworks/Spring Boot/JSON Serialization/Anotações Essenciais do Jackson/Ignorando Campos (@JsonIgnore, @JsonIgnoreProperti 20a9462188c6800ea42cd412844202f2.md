# Ignorando Campos (@JsonIgnore, @JsonIgnoreProperties)

---

## 1. Introdução

O Jackson é a biblioteca padrão utilizada pelo Spring Boot para converter objetos Java em JSON (serialização) e vice-versa (desserialização). Em muitos cenários, há campos de classes que não devem ser expostos ou não fazem sentido no JSON final (por questões de segurança, performance ou simplicidade). Para suprir essa necessidade, o Jackson oferece duas anotações principais:

- **`@JsonIgnore`**
- **`@JsonIgnoreProperties`**

Nesta explicação, abordaremos tanto uma visão geral concisa quanto detalhes completos sobre o uso prático dessas anotações, considerando exemplos de código, melhores práticas e limitações.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. `@JsonIgnore`
    2. `@JsonIgnoreProperties`
    3. Exemplo de configuração global
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **Jackson (com.fasterxml.jackson)**
    
    É a biblioteca de mapeamento JSON-Java utilizada pelo Spring Boot via módulo *spring-boot-starter-json*. Facilita a serialização (Java→JSON) e desserialização (JSON→Java).
    
- **Por que “ignorar” campos?**
    1. **Segurança**: evitar expor dados sensíveis (senhas, tokens, dados internos).
    2. **Estrutura do Payload**: nem sempre todos os atributos do objeto são relevantes para o consumidor da API.
    3. **Performance**: reduzir o tamanho do JSON transmitido, excluindo campos desnecessários.
- **Diferença entre `@JsonIgnore` e `@JsonIgnoreProperties`:**
    - `@JsonIgnore` deve ser aplicada em um campo (ou getter/setter) específico para que seja ignorado na serialização/desserialização.
    - `@JsonIgnoreProperties` pode ser aplicada na classe para indicar um ou mais nomes de propriedades que devem ser ignoradas.

As anotações pertencem ao pacote:

```java
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

```

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 `@JsonIgnore`

**Propósito:** Ignorar um campo individual (ou getter/setter) durante a serialização e desserialização.

### 4.1.1 Aplicação em campo

```java
import com.fasterxml.jackson.annotation.JsonIgnore;

public class Usuario {
    private Long id;
    private String nome;

    @JsonIgnore
    private String senha; // este campo NÃO será incluído no JSON

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}

```

- **Comportamento:**
    - Na serialização (`Java → JSON`), o atributo `senha` não aparecerá no JSON final.
    - Na desserialização (`JSON → Java`), se o JSON contiver `"senha": "valor"`, esse valor será ignorado (não popularemos o campo).

### 4.1.2 Aplicação em getter/setter

Outra forma de usar é diretamente no método acessador:

```java
public class ContaBancaria {
    private Double saldo;
    private String numero;

    @JsonIgnore
    public Double getSaldo() {
        return saldo;
    }
    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
}

```

- **Observação:**
    - Se aplicado no **getter**, o Jackson ignora esse método como propriedade de leitura.
    - Se aplicado no **setter**, o Jackson ignora-o como propriedade de escrita (útil se você quiser permitir somente serialização, mas não desserialização, ou vice-versa).

### 4.1.3 Variações de configuração

- **Ignorar somente na serialização ou somente na desserialização:**
    - `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)` → ignora na serialização (só desserializa).
    - `@JsonProperty(access = JsonProperty.Access.READ_ONLY)` → ignora na desserialização (só serializa).

Exemplo de uso conjunto (não diretamente `@JsonIgnore`, mas vale complementar):

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public class Credencial {
    private String usuario;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;

    // getters e setters
}

```

Aqui, `senha` não aparecerá quando você converter `Credencial` para JSON, mas será populado ao ler JSON que contenha `senha`.

---

### 4.2 `@JsonIgnoreProperties`

**Propósito:** Ignorar um conjunto de propriedades por nome em toda a classe. Pode ser aplicado tanto em nível de classe quanto em nível de propriedade ao receber um JSON desconhecido.

### 4.2.1 Aplicação em nível de classe

```java
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({ "campoInterno", "outraPropriedade" })
public class Produto {
    private Long id;
    private String nome;
    private String campoInterno;
    private String outraPropriedade;
    private Double preco;

    // getters e setters
}

```

- **Comportamento:**
    - Tanto na **serialização** quanto na **desserialização**, os campos `campoInterno` e `outraPropriedade` serão ignorados.
    - Se o JSON de entrada contiver `campoInterno` ou `outraPropriedade`, Jackson simplesmente os descartará sem lançar exceção.

### 4.2.2 Ignorar propriedades desconhecidas (ALLOW_UNKNOWN)

Para cenários em que você não sabe quais campos podem vir no JSON (e não quer falhar ao desserializar), pode usar:

```java
@JsonIgnoreProperties(ignoreUnknown = true)
public class Cliente {
    private Long id;
    private String nome;
    // outros campos
}

```

- **Comportamento:** Ignora *qualquer* propriedade extra no JSON que não tenha correspondência em campos de `Cliente`.
- **Vantagem:** evita `UnrecognizedPropertyException` quando o JSON contém campos que a classe Java não define.

### 4.2.3 Aplicação em nível de propriedade aninhada

Você também pode usar dentro de outra anotação, p. ex. em `@JsonDeserialize` ou `@JsonView` para classes aninhadas, mas o uso mais comum é em nível de classe.

---

### 4.3 Exemplo de Configuração Global via `ObjectMapper`

Em alguns casos, você pode querer definir comportamento padrão para toda a aplicação, sem anotar cada classe individualmente. No Spring Boot, basta customizar o `Jackson2ObjectMapperBuilder` ou `ObjectMapper`:

```java
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        // Ignorar propriedades desconhecidas no JSON para TODAS as classes
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper;
    }
}

```

Nesse caso, você obtém o efeito semelhante a `@JsonIgnoreProperties(ignoreUnknown = true)` de modo global.

---

## 5. Cenários de Restrição ou Não Aplicação

1. **Validação de Entrada:**
    - Se sua aplicação precisa validar se um campo “proibido” foi enviado pelo cliente, simplesmente ignorar (`ignoreUnknown`) pode mascarar um comportamento incorreto. Nesse caso, faz mais sentido falhar com erro para sinalizar que o cliente enviou dados inválidos.
2. **Documentação de API (Swagger/OpenAPI):**
    - Ignorar campos pode fazer com que a documentação gerada não reflita fielmente o modelo de dados. É importante manter anotações que dialoguem com o Swagger (`@ApiModelProperty(hidden = true)` no caso do Springfox).
3. **Serialização Parcial (Views):**
    - Se for necessário expor diferentes visões do modelo (ex.: usuários comuns veem menos campos que administradores), é melhor usar `@JsonView` em vez de `@JsonIgnore`. Isso permite controlar exatamente quais campos devem aparecer em cada contexto.
4. **Campos Computados ou Transientes:**
    - Campos marcados com `transient` (Java) ou `static` já são ignorados, mas se houver lógica customizada para expor ou não expor sob certas condições, pode ser mais apropriado implementar “DTOs” (Data Transfer Objects) separados em vez de simplesmente usar `@JsonIgnore`.

---

## 6. Componentes Chave Associados

1. **Pacote de Anotações**
    - `com.fasterxml.jackson.annotation.JsonIgnore`
    - `com.fasterxml.jackson.annotation.JsonIgnoreProperties`
    - Outros relacionados (não foco aqui, mas para referência):
        - `@JsonIgnoreType` → ignora completamente um tipo durante a serialização.
        - `@JsonInclude` → controla inclusão de campos nulos ou vazios.
2. **`ObjectMapper` / `Jackson2ObjectMapperBuilder`**
    - Classe central para configuração global de serialização/desserialização.
3. **DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES**
    - Flag de configuração do `ObjectMapper` que substitui o uso de `@JsonIgnoreProperties(ignoreUnknown = true)`.
4. **Spring Boot Auto-configuration**
    - Por padrão, o Spring Boot configura um `ObjectMapper` com FAIL_ON_UNKNOWN_PROPERTIES = true. Se quiser alterar esse comportamento globalmente, utilize a classe de configuração ou properties:
        
        ```
        spring.jackson.deserialization.fail-on-unknown-properties=false
        
        ```
        
5. **DTOs (Data Transfer Objects)**
    - Em projetos grandes, costuma-se criar DTOs que já expõem apenas os campos permitidos, reduzindo o uso indiscriminado de `@JsonIgnore`.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Usar `@JsonIgnore` somente em casos muito pontuais**
    - Quando existir um campo sensível ou irrelevante que nunca deve ser exposto, independente de contexto.
    - **Exemplo:** atributo `senha`, token de autenticação, etc.
2. **Preferir `@JsonIgnoreProperties` para grupos de campos ou para ignorar campos desconhecidos**
    - Quando se quer padronizar “ignoreUnknown” para uma classe inteira.
    - Evita múltiplos `@JsonIgnore` em vários campos.
3. **Separar Modelo de Domínio dos DTOs de API**
    - Crie classes distintas (por ex. `UsuarioEntity` versus `UsuarioResponseDTO`) para controlar exatamente quais campos trafegam na API. Isso diminui a necessidade de usar anotações de ignorar.
4. **Manter documentação sincronizada**
    - Se você anota campos para não aparecerem, atualize a documentação (Swagger/OpenAPI) para não induzir ao erro quem consome a API.
5. **Evitar ignorar muitos campos**
    - Se você se vê aplicando `@JsonIgnore` em vários campos de uma mesma classe, considere criar um DTO específico ou reavaliar o design de objetos.
6. **Consistência entre serialização e desserialização**
    - Lembre-se que `@JsonIgnore` afeta ambos os processos. Se quiser ignorar somente ao serializar (retornar JSON) mas aceitar no request, utilize `@JsonProperty(access = Access.WRITE_ONLY)`.

---

## 8. Exemplo Prático Completo

### 8.1 Cenário

Imaginemos um sistema de e-commerce, com uma entidade `Produto`. Para a API pública, deseja-se expor apenas `id`, `nome`, `preco` e esconder o campo `custoInterno` (campo usado internamente para cálculo de margem). Além disso, ao desserializar JSON de importação de catálogo, pode vir um campo chamado `fornecedorExterno` que não existe na entidade. Queremos ignorar esse campo extra sem lançar exceção.

---

### 8.2 Definição das Classes

```java
package com.exemplo.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)  // Ignora campos desconhecidos no JSON
public class Produto {

    private Long id;
    private String nome;
    private BigDecimal preco;

    @JsonIgnore  // Nunca expor no JSON
    private BigDecimal custoInterno;

    // Construtor padrão (necessário para desserialização)
    public Produto() {}

    public Produto(Long id, String nome, BigDecimal preco, BigDecimal custoInterno) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.custoInterno = custoInterno;
    }

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    public BigDecimal getCustoInterno() { return custoInterno; }
    public void setCustoInterno(BigDecimal custoInterno) { this.custoInterno = custoInterno; }
}

```

---

### 8.3 Controlador REST (Spring Boot)

```java
package com.exemplo.ecommerce.controller;

import com.exemplo.ecommerce.model.Produto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    // Exemplo de retorno estático de lista de produtos
    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        Produto p1 = new Produto(1L, "Camisa Polo", new BigDecimal("79.90"), new BigDecimal("45.00"));
        Produto p2 = new Produto(2L, "Tênis Esportivo", new BigDecimal("249.90"), new BigDecimal("150.00"));
        return ResponseEntity.ok(Arrays.asList(p1, p2));
    }

    // Exemplo de endpoint de importação de JSON
    @PostMapping("/importar")
    public ResponseEntity<Produto> importarProduto(@RequestBody Produto produto) {
        // Mesmo que o JSON contenha "fornecedorExterno", será ignorado por ignoreUnknown = true
        // O custoInterno será nulo se não enviado e não será atualizado via JSON
        produto.setCustoInterno(new BigDecimal("50.00")); // Lógica interna define o custo
        return ResponseEntity.ok(produto);
    }
}

```

---

### 8.4 Testes de Serialização / Desserialização

1. **Serialização (Java → JSON)**
    
    Requisição `GET /api/produtos` → retorno JSON:
    
    ```
    [
      {
        "id": 1,
        "nome": "Camisa Polo",
        "preco": 79.90
        // "custoInterno" NÃO aparece devido a @JsonIgnore
      },
      {
        "id": 2,
        "nome": "Tênis Esportivo",
        "preco": 249.90
        // "custoInterno" também ignorado
      }
    ]
    
    ```
    
2. **Desserialização (JSON → Java)**
    
    Enviando POST `/api/produtos/importar` com corpo:
    
    ```json
    {
      "id": 3,
      "nome": "Calça Jeans",
      "preco": 129.90,
      "fornecedorExterno": "Fornecedor X",
      "custoInterno": 100.00
    }
    
    ```
    
    - `fornecedorExterno` será ignorado pelo `@JsonIgnoreProperties(ignoreUnknown = true)`.
    - `custoInterno` do JSON também será ignorado (por causa de `@JsonIgnore`).
    - Dentro do controlador, podemos atribuir `custoInterno` conforme regra de negócio:
        
        ```java
        produto.setCustoInterno(new BigDecimal("50.00"));
        
        ```
        

---

## 9. Sugestões para Aprofundamento

1. **Comparar com `@JsonView`**
    - Quando precisar de diferentes visões (por ex., lista resumida versus detalhe completo), utilize `@JsonView` em vez de ignorar campos de forma permanente.
2. **Explorar outras anotações Jackson**
    - `@JsonInclude`: controlar inclusão de campos nulos, vazios ou default.
    - `@JsonProperty`: renomear propriedades no JSON ou controlar acesso (READ_ONLY / WRITE_ONLY).
    - `@JsonFormat`: definir formato de data/hora em serialização.
3. **Performance e Perfilamento**
    - Em casos de alta performance, estudar alternativas como Fasterxml Jackson Afterburner ou GSON (Google) — embora Jackson já seja bastante otimizado.
4. **DTOs e Mapeamento Automático**
    - Frameworks como MapStruct podem gerar mapeamentos entre entidades e DTOs, reduzindo a necessidade de anotações de ignorar campos manualmente.
5. **Integração com Swagger/OpenAPI**
    - Ajustar a documentação gerada para refletir corretamente quais campos são ignorados usando anotações específicas (`@ApiModelProperty(hidden = true)` para Springfox ou configurações de *schema* no Springdoc).

---

### Conclusão

As anotações `@JsonIgnore` e `@JsonIgnoreProperties` são ferramentas essenciais para controlar quais campos de seus objetos Java serão expostos via JSON em aplicações Spring Boot. Usá-las corretamente garante maior segurança, menor complexidade nos payloads e alinhamento com boas práticas de design de APIs. Sempre avalie se é mais adequado criar DTOs específicos em vez de simplesmente ignorar múltiplos campos em um modelo de domínio.