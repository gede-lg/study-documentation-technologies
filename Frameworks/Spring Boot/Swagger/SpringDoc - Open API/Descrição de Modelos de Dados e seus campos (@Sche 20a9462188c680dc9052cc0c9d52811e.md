# Descrição de Modelos de Dados e seus campos (@Schema)

---

### **Guia Completo: Documentando Modelos de Dados com @Schema no SpringDoc (OpenAPI)**

### **Introdução**

Em uma API REST bem projetada, a clareza dos endpoints é tão crucial quanto a clareza das estruturas de dados que eles manipulam. A anotação `@Schema`, parte da especificação OpenAPI, é a ferramenta fundamental no SpringDoc para enriquecer a documentação dos seus objetos de transferência de dados (DTOs), transformando classes Java simples em um contrato de dados explícito e fácil de entender para os consumidores da sua API.

---

### **Sumário**

Este guia abordará os seguintes pontos:

- **Conceito de Schema:** O que é um "Schema" no contexto do OpenAPI e por que ele é vital.
- **Uso da anotação `@Schema`:** Como e por que utilizar a anotação para detalhar seus modelos de dados.
- **Sintaxe e Atributos:** Uma análise detalhada dos principais atributos da anotação `@Schema` com exemplos práticos.
- **Integração com Validação:** Como o SpringDoc interpreta automaticamente anotações do `jakarta.validation`.
- **Melhores Práticas:** Recomendações para criar uma documentação de schema clara e eficaz.
- **Exemplo Completo:** Um cenário prático demonstrando o uso em um `Controller` e um `DTO`.

---

### **Conceitos Fundamentais**

No universo do OpenAPI, um **Schema** é a definição formal e estruturada de um objeto de dados. Pense nele como a "planta baixa" de um JSON, descrevendo cada campo (propriedade), seu tipo de dado (`string`, `integer`, `boolean`), formato (`date-time`, `email`), e outras restrições (ex: campo obrigatório, valor mínimo/máximo).

**A importância e o propósito são múltiplos:**

- **Clareza para Desenvolvedores:** Desenvolvedores que consomem sua API sabem exatamente qual payload enviar e qual esperar como resposta.
- **Habilita Ferramentas:** Permite a geração automática de clientes (SDKs) em diversas linguagens (TypeScript, Go, Python, etc.).
- **Validação Contratual:** Define um contrato claro que pode ser usado para validar requisições e respostas.
- **Interatividade:** Na interface do Swagger UI, os schemas geram exemplos de payloads que podem ser editados e usados para testar a API diretamente no navegador.

O SpringDoc automaticamente inspeciona suas classes Java (como `UserDTO`) e gera um schema básico. A anotação `@Schema` é usada para **enriquecer** essa definição automática com metadados essenciais, como descrições amigáveis, exemplos e restrições de acesso.

---

### **Sintaxe Detalhada e Uso Prático**

A anotação `@Schema` é aplicada diretamente nos campos (atributos) de uma classe.

```java
import io.swagger.v3.oas.annotations.media.Schema;

public class UserDTO {

    @Schema(description = "Identificador único do usuário gerado pelo sistema.",
            example = "101",
            accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "Nome de usuário para login. Deve ser único.",
            example = "gededev",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;

    @Schema(description = "Senha para autenticação. Não será retornada em nenhuma resposta.",
            example = "MyS3cr3tP@ssw0rd",
            accessMode = Schema.AccessMode.WRITE_ONLY)
    private String password;

    @Schema(description = "Data de criação do registro.",
            example = "2025-06-07T14:30:00Z",
            accessMode = Schema.AccessMode.READ_ONLY)
    private String createdAt;
}

```

**Comentários sobre a sintaxe:**

- `description`: O texto que aparecerá na documentação para explicar o campo. **Use sempre.**
- `example`: Um valor de exemplo que aparecerá na documentação e nos payloads de exemplo. **Extremamente útil.**
- `accessMode`: Controla a visibilidade do campo.
    - `AccessMode.READ_ONLY`: O campo só pode aparecer em respostas (ex: `id`, `createdAt`). O cliente não deve enviá-lo.
    - `AccessMode.WRITE_ONLY`: O campo só pode aparecer em requisições (ex: `password`). Ele nunca será incluído na resposta.
- `requiredMode`: Marca um campo como obrigatório. A interface do Swagger irá indicá-lo com um asterisco vermelho.

---

### **Cenários de Restrição ou Não Aplicação**

Embora poderosa, a `@Schema` tem seu escopo:

- **Não substitui a serialização:** Para **renomear** um campo no JSON final (ex: de `userName` em Java para `user_name` no JSON), a anotação primária a ser usada é a `@JsonProperty("user_name")` do Jackson. A `@Schema` apenas descreve; a `@JsonProperty` modifica o comportamento.
- **Não substitui validação complexa:** Regras de negócio muito específicas (ex: "o campo X só é obrigatório se o campo Y tiver o valor Z") não podem ser representadas pelo schema e devem ser documentadas no atributo `description`.
- **Objetos Dinâmicos:** Em cenários com objetos muito dinâmicos, como um `Map<String, Object>`, a definição de um schema rígido perde o sentido, e a documentação deve focar em explicar a estrutura esperada na descrição.

---

### **Componentes Chave Associados**

1. **`@Schema`**: A anotação principal.
    - **Uso:** Aplicada em campos de DTOs para adicionar metadados à documentação.
    - **Atributos Cruciais:** `description`, `example`, `requiredMode`, `accessMode`, `defaultValue`, `minLength`, `maxLength`, `pattern`.
2. **Anotações de Validação (`jakarta.validation.*`)**: O SpringDoc as interpreta automaticamente.
    - **Uso:** `@NotNull`, `@NotBlank`, `@Size`, `@Min`, `@Max`, `@Pattern`, etc., são aplicadas nos campos do DTO para validação em tempo de execução.
    - **Análise:** O SpringDoc lê essas anotações e as traduz para as propriedades equivalentes do schema OpenAPI. `@NotNull` se torna `required: true`, `@Size(min=8, max=20)` se torna `minLength: 8` e `maxLength: 20` na documentação. Isso cria uma **fonte única de verdade** para validação e documentação.
    
    ```java
    import jakarta.validation.constraints.NotBlank;
    import jakarta.validation.constraints.Size;
    //...
    @Schema(description = "Nome completo do usuário.", example = "Luiz Gustavo Gomes Damasceno")
    @NotBlank // Será traduzido para required: true
    @Size(min = 3, max = 100) // Será traduzido para minLength e maxLength no schema
    private String fullName;
    
    ```
    
3. **`@JsonProperty` (Jackson)**: Controla a serialização/desserialização.
    - **Uso:** Renomear campos, definir acesso de leitura/escrita no nível do Jackson.
    - **Análise:** Deve ser usado em conjunto com `@Schema`. O `@JsonProperty` garante que o JSON seja formatado corretamente, enquanto o `@Schema` garante que a documentação reflita essa formatação.

---

### **Melhores Práticas e Padrões de Uso**

- **Documente DTOs, não Entidades JPA:** Sempre crie DTOs para expor na sua API. Anotar entidades JPA diretamente vaza detalhes de implementação do banco de dados e pode criar acoplamento indesejado.
- **Seja Explícito e Útil:** Use `description` para explicar o propósito do campo e `example` para mostrar o formato esperado.
- **Use `accessMode`:** Marque claramente campos que são apenas de leitura (`id`, `data de criação`) ou apenas de escrita (`password`, `confirmPassword`).
- **Combine com Validação:** Aproveite a integração com o `jakarta.validation` para manter sua documentação e suas regras de validação sincronizadas automaticamente.
- **Consistência:** Mantenha um padrão de escrita e detalhamento em todos os seus schemas para uma experiência de API coesa.

---

### **Exemplo Prático Completo**

Vamos criar um endpoint para registrar um novo desenvolvedor.

**1. O DTO (`DeveloperCreateDTO.java`)**

```java
package com.example.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DeveloperCreateDTO {

    @Schema(description = "Nome de usuário para login. Será convertido para minúsculas.",
            example = "gededev",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @Schema(description = "Linguagem de programação principal.",
            example = "Go",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank
    private String mainLanguage;

    @Schema(description = "Anos de experiência profissional.",
            example = "3",
            defaultValue = "0")
    private int yearsOfExperience;
}

```

**2. O Controller (`DeveloperController.java`)**

```java
package com.example.api.controller;

import com.example.api.dto.DeveloperCreateDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/developers")
public class DeveloperController {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registra um novo desenvolvedor",
               description = "Cria um novo registro de desenvolvedor no sistema.")
    @ApiResponse(responseCode = "201",
                 description = "Desenvolvedor registrado com sucesso.",
                 content = @Content(mediaType = "application/json",
                 schema = @Schema(implementation = DeveloperCreateDTO.class))) // Exemplo de referência
    public void registerDeveloper(@Valid @RequestBody DeveloperCreateDTO developerDTO) {
        // Lógica para salvar o desenvolvedor...
        System.out.println("Registrando: " + developerDTO.getUsername());
    }
}

```

**Resultado na Interface do Swagger:**

- Na seção do endpoint `POST /developers`, a aba "Request body" mostrará um payload de exemplo com os campos `username`, `mainLanguage` e `yearsOfExperience`.
- Os campos `username` e `mainLanguage` serão marcados com um asterisco vermelho, indicando que são obrigatórios.
- Na seção "Schemas" no final da página, haverá uma entrada para `DeveloperCreateDTO` detalhando cada campo, sua descrição, tipo, exemplo e restrições (`minLength`, `maxLength`), conforme definido nas anotações.

---

### **Sugestões para Aprofundamento**

- **Schemas Polimórficos:** Estude as anotações `oneOf`, `anyOf`, e `allOf` dentro de `@Schema` para documentar cenários onde um campo pode conter diferentes tipos de objetos.
- **Documentação de Genéricos:** Pesquise como o SpringDoc lida com classes genéricas de resposta (ex: `ApiResponse<T>`) para criar documentações reutilizáveis.
- **OpenAPI Specification:** Leia a especificação oficial do OpenAPI 3 para entender a fundo a estrutura JSON/YAML que o SpringDoc gera por baixo dos panos.