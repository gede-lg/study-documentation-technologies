# Módulo 2: Spring Boot - Versionamento de API

## Introdução ao Versionamento de API
- **Definição e Importância**: Explicação sobre o que é versionamento de API e por que é importante manter versões compatíveis e organizadas.

## Tópicos Fundamentais
1. **Conceitos Básicos de API**: Entendendo APIs REST com Spring Boot.
   - Estrutura básica de uma API REST em Spring Boot.
   - Exemplo de código: Criação de um simples endpoint REST.

2. **Estratégias de Versionamento**:
   - Versionamento por URL.
   - Versionamento por Header HTTP.
   - Versionamento por MediaType (Content Negotiation).

3. **Boas Práticas no Versionamento de APIs**:
   - Quando e por que versionar.
   - Manter a consistência entre versões.

## Implementação Prática

### Versionamento por URL
- **Descrição**: Utilização de diferentes URLs para diferentes versões da API.
- **Exemplo de código**:
  ```java
  @RestController
  @RequestMapping("/api/v1")
  public class MyControllerV1 {
      @GetMapping("/users")
      public List<User> getUsersV1() {
          // Implementação V1
      }
  }

  @RestController
  @RequestMapping("/api/v2")
  public class MyControllerV2 {
      @GetMapping("/users")
      public List<User> getUsersV2() {
          // Implementação V2
      }
  }
  ```

### Versionamento por Header HTTP
- **Descrição**: Uso de cabeçalhos HTTP customizados para controlar a versão.
- **Exemplo de código**:
  ```java
  @RestController
  @RequestMapping("/api/users")
  public class MyController {
      @GetMapping(headers = "X-API-VERSION=1")
      public List<User> getUsersV1() {
          // Implementação V1
      }

      @GetMapping(headers = "X-API-VERSION=2")
      public List<User> getUsersV2() {
          // Implementação V2
      }
  }
  ```

### Versionamento por MediaType (Content Negotiation)
- **Descrição**: Controle de versões através do cabeçalho 'Accept' no request.
- **Exemplo de código**:
  ```java
  @RestController
  @RequestMapping("/api/users")
  public class MyController {
      @GetMapping(produces = "application/vnd.myapi.v1+json")
      public List<User> getUsersV1() {
          // Implementação V1
      }

      @GetMapping(produces = "application/vnd.myapi.v2+json")
      public List<User> getUsersV2() {
          // Implementação V2
      }
  }
  ```

## Tópicos Complementares
- **Testes de API com Versões Diferentes**: Criando testes unitários e de integração para garantir a compatibilidade entre versões.
- **Documentação de APIs Versionadas**: Uso de ferramentas como Swagger para documentar diferentes versões da API.

## Conclusão
- **Melhores Práticas e Considerações Finais**: Resumo sobre as práticas recomendadas para o versionamento de APIs com Spring Boot.
