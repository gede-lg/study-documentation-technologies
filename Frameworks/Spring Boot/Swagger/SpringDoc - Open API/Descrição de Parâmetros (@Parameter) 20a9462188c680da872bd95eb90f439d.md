# Descrição de Parâmetros (@Parameter)

Olá Gedê! Com certeza. Preparei uma análise completa sobre a anotação `@Parameter`, seguindo exatamente a estrutura que você solicitou.

---

### **Dominando a Anotação `@Parameter` no SpringDoc OpenAPI**

### **Introdução**

No ecossistema Spring Boot, a biblioteca SpringDoc OpenAPI automatiza a geração de documentação para APIs REST. Embora ela consiga inferir a existência de parâmetros de um endpoint (como variáveis de path ou query), essa informação básica é frequentemente insuficiente. A anotação `@Parameter` é a ferramenta essencial para enriquecer essa documentação, fornecendo descrições detalhadas, exemplos, regras de obrigatoriedade e muito mais, tornando a API verdadeiramente autoexplicativa para quem a consome.

### **Sumário**

- **Conceitos Fundamentais:** A importância de descrever parâmetros para a clareza e usabilidade da API.
- **Sintaxe e Uso Prático:** Como aplicar `@Parameter` em diferentes tipos de parâmetros (`@PathVariable`, `@RequestParam`, `@RequestHeader`).
- **Cenários de Restrição:** Quando o uso de `@Parameter` é desnecessário ou incorreto.
- **Componentes Chave:** Uma análise detalhada dos atributos da anotação `@Parameter`.
- **Melhores Práticas:** Recomendações para criar uma documentação de parâmetros clara e eficaz.
- **Exemplo Prático Completo:** Um controller que utiliza a anotação em múltiplos cenários.

### **Conceitos Fundamentais**

O propósito do `@Parameter` é ir além da simples detecção de um parâmetro. Uma API bem documentada funciona como um contrato claro entre o backend e seus consumidores (seja um frontend, um app mobile ou outro serviço).

- **Importância:** Sem descrições adequadas, o consumidor da API precisa adivinhar o propósito de um parâmetro (`o que é 'st'?`), seu formato (`'data' é no formato 'dd-MM-yyyy' ou 'yyyy-MM-dd' ?`) e seus valores possíveis (`'st' aceita 'A' e 'I' ou 'ATIVO' e 'INATIVO'`).
- **Propósito:** `@Parameter` resolve isso ao permitir que o desenvolvedor anote o código-fonte com metadados ricos que serão exibidos na interface do Swagger UI, eliminando ambiguidades e acelerando o processo de integração.

### **Sintaxe Detalhada e Uso Prático**

A anotação `@Parameter` é aplicada diretamente ao lado do argumento do método no controller.

1. Com @PathVariable (Variável de Caminho)

Utilizado para descrever parâmetros que fazem parte da URL.

Java

# 

`import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsuarioController {

    @GetMapping("/usuarios/{usuarioId}")@Operation(summary = "Busca um usuário pelo seu ID")
    public Usuario buscarPorId(
        // A anotação descreve o parâmetro 'usuarioId' que vem da URL.
        @Parameter(description = "ID do usuário a ser pesquisado. Deve ser um número inteiro positivo.", required = true, example = "123")
        @PathVariable("usuarioId") Long id) {
        // ... lógica de busca
        return new Usuario();
    }
}`

2. Com @RequestParam (Parâmetro de Consulta)

Utilizado para descrever parâmetros de consulta opcionais ou obrigatórios na URL (?chave=valor).

Java

# 

`import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PedidoController {

    @GetMapping("/pedidos")
    @Operation(summary = "Lista todos os pedidos com filtros opcionais")
    public String listarPedidos(
        // Descreve o parâmetro 'status' que pode ser usado para filtrar.
        @Parameter(description = "Filtra os pedidos pelo status. Valores possíveis: PENDENTE, PAGO, CANCELADO.", example = "PAGO")
        @RequestParam(required = false) String status) {
        // ... lógica de listagem
        return "Listando pedidos com status: " + status;
    }
}`

3. Com @RequestHeader (Parâmetro de Cabeçalho)

Utilizado para descrever parâmetros enviados nos cabeçalhos HTTP da requisição.

Java

# 

`import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificacaoController {

    @PostMapping("/notificacoes")@Operation(summary = "Envia uma nova notificação")
    public String enviarNotificacao(
        // Descreve um cabeçalho customizado esperado pela API.
        @Parameter(description = "ID de correlação para rastreamento da requisição (UUID).", required = true, example = "a1b2c3d4-e5f6-7890-1234-567890abcdef")
        @RequestHeader("X-Correlation-ID") String correlationId) {
        // ... lógica de envio
        return "Notificação enviada com Correlation ID: " + correlationId;
    }
}`

### **Cenários de Restrição ou Não Aplicação**

- **Não use para Request Body:** O erro mais comum é tentar usar `@Parameter` para descrever o corpo (payload) de uma requisição `POST` ou `PUT`. Para isso, utilize a anotação `@RequestBody` em conjunto com `@Operation(requestBody = ...)` e `@Schema` nos seus DTOs.
- **Redundância:** Se o nome do parâmetro no código (ex: `Long usuarioId`) já é perfeitamente claro e não há exemplos ou restrições a adicionar, a anotação pode ser verbosa e desnecessária. O SpringDoc já infere o nome e o tipo.
- **Inferência Automática de `required`:** O SpringDoc já assume `required = true` para `@PathVariable` e infere a obrigatoriedade a partir do atributo `required` de `@RequestParam`. Declarar `@Parameter(required = true)` nesses casos pode ser redundante, mas ajuda na clareza.

### **Componentes Chave Associados**

A anotação `@Parameter` possui diversos atributos para uma documentação granular.

| **Atributo** | **Tipo** | **Descrição** |
| --- | --- | --- |
| `name` | `String` | Sobrescreve o nome do parâmetro que será exibido na UI. Útil se o nome da variável no Java for diferente. |
| `description` | `String` | **(O mais importante)** A descrição clara e concisa do propósito do parâmetro. |
| `required` | `boolean` | Indica se o parâmetro é obrigatório. Padrão é `false`. |
| `example` | `String` | Um valor de exemplo que será exibido na UI, facilitando o teste. |
| `deprecated` | `boolean` | Marca o parâmetro como obsoleto, indicando que ele será removido em versões futuras da API. |
| `hidden` | `boolean` | Oculta o parâmetro da documentação. Útil para parâmetros injetados por frameworks (ex: `Pageable`). |
| `schema` | `@Schema` | Permite definir detalhes do esquema do parâmetro, como tipo, formato, valores padrão e valores permitidos. |
| `in` | `ParameterIn` | Especifica a localização do parâmetro (`QUERY`, `HEADER`, `PATH`, `COOKIE`). Geralmente é inferido. |

**Uso do atributo `schema`:**

Java

# 

`@Parameter(
    description = "Status do produto",
    schema = @Schema(
        type = "string",
        defaultValue = "ATIVO",
        allowableValues = {"ATIVO", "INATIVO", "ESGOTADO"}
    )
)
@RequestParam String status;`

### **Melhores Práticas e Padrões de Uso**

- **Seja Claro e Conciso:** Escreva descrições pensando no consumidor da API. Evite jargões internos do seu sistema.
- **Forneça Exemplos Válidos:** O atributo `example` é extremamente útil. Use valores realistas que funcionem se o usuário clicar em "Try it out".
- **Use `hidden = true` para Limpeza:** Em endpoints com paginação, o Spring pode injetar um objeto `Pageable` com muitos parâmetros (`page`, `size`, `sort`, etc.). Use `@Parameter(hidden = true)` para ocultar o `Pageable` e declare os parâmetros que você realmente quer expor (`@Parameter(name = "page")`, etc.) individualmente.
- **Documente Regras de Negócio:** Se um parâmetro tem um formato específico (como um CPF) ou uma faixa de valores (de 1 a 100), coloque isso na `description`.
- **Consistência:** Mantenha um padrão para nomes e descrições de parâmetros semelhantes em toda a API (ex: `userId` sempre se refere ao ID numérico do usuário).

### **Exemplo Prático Completo**

Abaixo, um `ProdutoController` que combina vários usos do `@Parameter`.

Java

# 

`import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/v1/produtos")
@Tag(name = "Produtos", description = "Operações relacionadas a produtos")
public class ProdutoController {

    @GetMapping
    @Operation(summary = "Lista produtos com filtros", description = "Retorna uma lista de produtos, com possibilidade de filtro por nome e status.")
    public ResponseEntity<List<Object>> listarProdutos(
        @Parameter(description = "Parte do nome do produto para busca textual.", example = "Notebook")
        @RequestParam(required = false) String nome,

        @Parameter(description = "Status para filtrar os produtos.",
                   schema = @Schema(defaultValue = "ATIVO", allowableValues = {"ATIVO", "INATIVO"}))
        @RequestParam(required = false, defaultValue = "ATIVO") String status) {

        // Lógica para buscar produtos com base nos filtros
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/{produtoId}")
    @Operation(summary = "Busca um produto específico por ID")
    public ResponseEntity<Object> buscarProdutoPorId(
        @Parameter(description = "ID único do produto.", required = true, example = "42")
        @PathVariable Long produtoId) {

        // Lógica para buscar um produto pelo ID
        return ResponseEntity.ok(new Object());
    }

    @DeleteMapping("/{produtoId}")
    @Operation(summary = "Remove um produto")
    public ResponseEntity<Void> removerProduto(
        @Parameter(description = "ID do produto a ser removido.", required = true)
        @PathVariable Long produtoId,

        @Parameter(description = "ID do usuário administrador que está realizando a operação.", required = true, example = "101")
        @RequestHeader("X-Admin-User-ID") String adminId) {

        // Lógica para remover o produto, validando o administrador
        return ResponseEntity.noContent().build();
    }
}`

---

### Sugestões para Aprofundamento

- **Anotação `@Parameters` (Plural):** Explore como usar `@Parameters` para agrupar múltiplas anotações `@Parameter`, o que pode ser útil para cenários mais complexos ou para reutilização.
- **Customização Programática:** Investigue `OperationCustomizer`, uma interface que permite adicionar ou modificar parâmetros programaticamente, útil para aplicar regras de documentação em toda a API sem repetir anotações.
- **Documentação Oficial:** Consulte a [documentação do SpringDoc](https://springdoc.org/) e a [especificação OpenAPI 3](https://swagger.io/specification/) para entender todos os detalhes e possibilidades.