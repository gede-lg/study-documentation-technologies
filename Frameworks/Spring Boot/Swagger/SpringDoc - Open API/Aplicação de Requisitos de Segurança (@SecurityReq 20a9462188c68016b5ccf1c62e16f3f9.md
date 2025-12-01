# Aplicação de Requisitos de Segurança (@SecurityRequirement)

Com certeza, Gedê! É um prazer detalhar esse tópico para você. A anotação `@SecurityRequirement` é a peça que conecta a sua configuração de segurança com a interface do Swagger, tornando sua documentação verdadeiramente interativa para APIs protegidas.

Aqui está a análise completa, seguindo a estrutura que você solicitou.

---

### Dominando a Segurança no Swagger com @SecurityRequirement em Spring Boot

### **Introdução**

No desenvolvimento de APIs REST com Spring Boot, proteger endpoints é uma prática padrão, geralmente implementada com o Spring Security. No entanto, apenas proteger a API não é suficiente; a documentação precisa refletir essa segurança. A anotação `@SecurityRequirement`, parte do ecossistema SpringDoc OpenAPI, serve exatamente para isso: ela "marca" visualmente quais endpoints na sua documentação do Swagger UI exigem autenticação/autorização, permitindo que os desenvolvedores testem essas rotas diretamente pela interface.

---

### **Sumário**

Esta explicação cobrirá os seguintes pontos:

- O propósito e a importância de documentar requisitos de segurança.
- A sintaxe e as diferentes formas de aplicar a anotação `@SecurityRequirement`.
- Cenários onde seu uso não é apropriado.
- A relação crucial com seu componente par, `@SecurityScheme`.
- Melhores práticas para uma documentação de segurança clara e eficaz.
- Um exemplo completo de uma API com endpoints públicos e protegidos.

---

### **Conceitos Fundamentais**

O princípio fundamental é um processo de duas etapas:

1. **Definição do Esquema (`@SecurityScheme`):** Primeiro, você precisa *definir* qual o método de segurança que sua API utiliza. Isso é como criar um molde. Você diz ao Swagger: "Minha API é protegida por um token JWT no cabeçalho `Authorization`".
2. **Aplicação do Requisito (`@SecurityRequirement`):** Depois de definir o esquema, você precisa *aplicar* esse molde aos endpoints específicos. Você diz ao Swagger: "Este endpoint `GET /users` exige o esquema de segurança JWT que eu defini anteriormente".

A `@SecurityRequirement` é a **etapa 2**. Ela não implementa a segurança em si (isso é trabalho do Spring Security), mas sim **declara a necessidade de segurança para a ferramenta de documentação**, o que resulta no ícone de cadeado 🔒 na interface do Swagger UI.

---

### **Sintaxe Detalhada e Uso Prático**

A anotação `@SecurityRequirement` possui um atributo principal: `name`. O valor desse `name` **deve corresponder exatamente** ao nome que você deu ao seu `@SecurityScheme`.

### **1. Aplicação por Endpoint (Método)**

Esta é a forma mais granular, aplicando o requisito a um único método do controller.

```java
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @GetMapping("/{id}")
    @Operation(summary = "Busca um pedido específico")
    @SecurityRequirement(name = "bearerAuth") // Aplica o requisito SÓ para este método
    public Order findOrderById(@PathVariable Long id) {
        // Lógica para buscar um pedido
        return orderService.findById(id);
    }

    @GetMapping("/public-status")
    @Operation(summary = "Verifica o status público de um serviço")
    // Sem @SecurityRequirement, este endpoint aparecerá como público
    public String getPublicStatus() {
        return "SERVICE_OK";
    }
}

```

### **2. Aplicação por Controller (Classe)**

Mais comum e prático. Aplica o requisito a **todos os endpoints** dentro da classe do controller.

```java
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/admin/users")
@Tag(name = "Admin - User Management")
@SecurityRequirement(name = "bearerAuth") // Aplica para TODOS os métodos nesta classe
public class AdminUserController {

    @GetMapping
    public List<User> getAllUsers() { /*...*/ }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) { /*...*/ }
}

```

### **3. Aplicação Global (Configuração Central)**

Útil quando quase 100% da sua API é protegida. Você pode definir o requisito globalmente e ele se aplicará a todos os endpoints, a menos que seja explicitamente desabilitado.

```java
import io.swagger.v3.oas.models.security.SecurityRequirement;

@Configuration
public class SpringDocConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            // ... outras configs como Info, Servers ...
            // Adiciona um requisito de segurança global
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}

```

*Para desabilitar em um endpoint específico, você pode usar `@SecurityRequirements({})`.*

---

### **Cenários de Restrição ou Não Aplicação**

O `@SecurityRequirement` **não deve ser usado** em:

- **Endpoints Públicos:** Rotas de login (`/auth/login`), registro de usuário (`/users/register`), consulta de status (`/health`) ou qualquer outra que deva ser acessível sem autenticação. Aplicar um requisito de segurança aqui passaria uma informação incorreta na documentação.
- **Implementação de Segurança:** Lembre-se, a anotação é para **documentação**. Ela não substitui nem interage com a configuração do `SecurityFilterChain` do Spring Security. A segurança real da sua API é independente da documentação.

---

### **Componentes Chave Associados**

### **`@SecurityScheme`** (O Componente Par)

É a anotação mais importante associada. Ela **define** o esquema que `@SecurityRequirement` irá **referenciar**. Sem um `@SecurityScheme` correspondente, o `@SecurityRequirement` não tem efeito.

- **Uso e Sintaxe:** Geralmente é definida em uma classe de configuração central.
    
    ```java
    import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
    import io.swagger.v3.oas.annotations.security.SecurityScheme;
    
    @Configuration
    @SecurityScheme(
        name = "bearerAuth", // Este é o nome que @SecurityRequirement usa!
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "Insira o token JWT aqui para autorização."
    )
    public class SpringDocConfig {
        // ...
    }
    
    ```
    

---

### **Melhores Práticas e Padrões de Uso**

- **Nomes Descritivos:** Use nomes claros para seus esquemas de segurança (ex: `jwtBearerAuth`, `oauth2ClientCredentials`) para que a referência no `@SecurityRequirement` seja explícita.
- **Consistência:** Aplique os requisitos no nível mais lógico. Se todo um recurso (controller) é protegido, anote a classe. Se apenas alguns métodos são, anote os métodos.
- **Centralize Constantes:** Para evitar erros de digitação, declare o nome do esquema de segurança (`"bearerAuth"`) como uma constante estática e reutilize-a em toda a aplicação.
- **Documente o Óbvio:** Mesmo com o cadeado, é uma boa prática usar o campo `description` no `@Operation` para informar ao usuário sobre a necessidade de autenticação.

---

### **Exemplo Prático Completo**

Vamos criar uma API com um endpoint de login público e um endpoint de busca de usuários protegido.

**1. Dependências (`pom.xml`):** `web`, `security`, e `springdoc-openapi-starter-webmvc-ui`.

**2. Configuração do SpringDoc (`SpringDocConfig.java`):**

```java
package com.example.demo.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Minha API Segura", version = "v1"))
@SecurityScheme(
    name = "bearerAuth", // 1. DEFININDO o esquema de segurança
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class SpringDocConfig { }

```

**3. Controller de Autenticação (Público):**

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação")
public class AuthController {

    @PostMapping("/login")
    @Operation(summary = "Realiza o login para obter um token")
    // NENHUM @SecurityRequirement aqui, pois é público
    public String login(@RequestBody LoginRequest loginRequest) {
        // Lógica de login que retorna um token JWT
        return "dummy-jwt-token";
    }
}

```

**4. Controller de Usuários (Protegido):**

```java
package com.example.demo.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@Tag(name = "Usuários")
@SecurityRequirement(name = "bearerAuth") // 2. APLICANDO o requisito na classe inteira
public class UserController {

    @GetMapping("/me")
    @Operation(summary = "Retorna os dados do usuário logado")
    public User getMe() {
        // Lógica para buscar o usuário a partir do contexto de segurança
        return new User("Gedê", "gededev@email.com");
    }
}

```

**Resultado:**
Ao acessar `/swagger-ui.html`:

- O endpoint `POST /auth/login` não terá cadeado.
- O endpoint `GET /users/me` terá um ícone de cadeado 🔒. Ao clicar no botão "Authorize" no canto superior direito, você poderá colar um token JWT para testar com sucesso este endpoint.

### **Sugestões para Aprofundamento**

- **OAuth2:** Investigue como configurar `@SecurityScheme` e `@SecurityRequirement` para fluxos mais complexos como OAuth2, que envolve múltiplos URLs e escopos.
- **Múltiplos Esquemas:** Explore como um único endpoint pode suportar múltiplos esquemas de segurança (ex: um token de usuário OU uma chave de API de serviço), configurando múltiplos `@SecurityRequirement`s.
- **Documentação Oficial:** A [documentação do SpringDoc](https://springdoc.org/) é a fonte definitiva para todos os detalhes e configurações possíveis.