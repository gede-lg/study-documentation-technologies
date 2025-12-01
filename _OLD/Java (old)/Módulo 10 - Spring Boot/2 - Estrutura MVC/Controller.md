# Módulo 2: Spring Boot - Controllers e Mapeamentos

## Controllers no Spring Boot
- **Definição e Propósito**: 
  - Controllers são componentes do Spring Boot responsáveis por lidar com as solicitações HTTP enviadas pelos usuários. Eles atuam como um intermediário entre o front-end e as camadas de serviço/logic do aplicativo.
  - O principal objetivo é receber requisições HTTP, processá-las e retornar uma resposta.

## Mapeamentos de Requisição
### @RequestMapping
- **Uso e Exemplo**:
  - `@RequestMapping` é a anotação mais geral para mapear solicitações HTTP a métodos de manipulação em um controller.
  - Pode ser usada para mapear todos os tipos de métodos HTTP, mas geralmente é substituída por anotações mais específicas.
  - Exemplo:
    ```java
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public List<User> getUsers() { ... }
    ```

### @GetMapping
- **Uso e Exemplo**:
  - `@GetMapping` é uma anotação especializada que mapeia solicitações HTTP GET.
  - Simplifica o `@RequestMapping` para casos de uso GET.
  - Exemplo:
    ```java
    @GetMapping("/users")
    public List<User> getUsers() { ... }
    ```

### @GetMapping(findById)
- **Uso e Exemplo**:
  - `@GetMapping` pode ser usado para mapear uma solicitação GET a um método que recupera um recurso pelo ID.
  - Exemplo:
    ```java
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) { ... }
    ```

### @PostMapping
- **Uso e Exemplo**:
  - `@PostMapping` é usada para mapear solicitações POST.
  - É comumente utilizada para criar novos recursos.
  - Exemplo:
    ```java
    @PostMapping("/users")
    public User createUser(@RequestBody User newUser) { ... }
    ```

### @PutMapping
- **Uso e Exemplo**:
  - `@PutMapping` é usada para mapear solicitações PUT.
  - Geralmente usada para atualizar recursos existentes.
  - Exemplo:
    ```java
    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) { ... }
    ```

### @DeleteMapping
- **Uso e Exemplo**:
  - `@DeleteMapping` é usada para mapear

solicitações DELETE.
  - Utilizada para deletar um recurso existente.
  - Exemplo:
    ```java
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) { ... }
    ```

### @PatchMapping
- **Uso e Exemplo**:
  - `@PatchMapping` é usada para mapear solicitações PATCH.
  - Ideal para atualizar parcialmente um recurso, diferentemente do PUT que é usado para uma atualização completa.
  - Exemplo:
    ```java
    @PatchMapping("/users/{id}")
    public User patchUser(@PathVariable Long id, @RequestBody User updatedFields) { ... }
    ```

### @HeadMapping
- **Uso e Exemplo**:
  - `@HeadMapping` é usada para mapear solicitações HEAD.
  - Solicitações HEAD são semelhantes ao GET, mas sem o corpo da resposta (utilizado para recuperar metadados).
  - Exemplo:
    ```java
    @HeadMapping("/users")
    public ResponseEntity headMethod() { ... }
    ```

### @OptionsMapping
- **Uso e Exemplo**:
  - `@OptionsMapping` é usada para mapear solicitações OPTIONS.
  - OPTIONS é utilizado para descrever as opções de comunicação para o recurso alvo (útil para CORS – Cross-Origin Resource Sharing).
  - Exemplo:
    ```java
    @OptionsMapping("/users")
    public ResponseEntity optionsMethod() { ... }
    ```