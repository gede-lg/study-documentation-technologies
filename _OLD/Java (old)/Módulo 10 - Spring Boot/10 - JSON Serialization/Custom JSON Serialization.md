# Curso de Spring Boot - Módulo 2: Custom JSON Serialization

## Custom JSON Serialization

Neste módulo, exploraremos como personalizar a serialização JSON em aplicações Spring Boot. Iremos focar no uso de anotações da biblioteca Jackson, que é amplamente utilizada em projetos Spring para manipulação de JSON.

### @JsonPropertyOrder

Esta anotação é usada para especificar a ordem das propriedades em um JSON serializado.

#### Uso Básico
Você pode aplicar `@JsonPropertyOrder` na declaração da classe para definir a ordem específica das propriedades.

**Exemplo:**
```java
@JsonPropertyOrder({ "name", "id", "email" })
public class User {
    private String id;
    private String name;
    private String email;
    // Getters e setters
}
```
Neste exemplo, ao serializar um objeto `User`, as propriedades aparecerão na ordem: `name`, `id`, `email`.

### @JsonProperty

A anotação `@JsonProperty` é usada para indicar o nome da propriedade quando o objeto é serializado ou deserializado.

#### Renomeando Propriedades
Se você deseja que o nome do campo JSON seja diferente do nome do campo Java, pode usar `@JsonProperty`.

**Exemplo:**
```java
public class User {
    @JsonProperty("user_id")
    private String id;

    @JsonProperty("user_name")
    private String name;
    // Restante da classe
}
```
Aqui, `id` e `name` serão serializados como `user_id` e `user_name`, respectivamente.

### @JsonIgnore

Esta anotação é usada para marcar uma propriedade para ser ignorada na serialização e deserialização JSON.

#### Ignorando Campos
Se há campos em sua classe que você não quer incluir no JSON gerado, use `@JsonIgnore`.

**Exemplo:**
```java
public class User {
    private String id;

    @JsonIgnore
    private String password;
    // Restante da classe
}
```
Neste caso, o campo `password` não será incluído no JSON serializado.

### @JsonInclude

Use esta anotação para controlar a inclusão de propriedades com valores nulos, vazios ou padrões.

**Exemplo:**
```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {
    // Classe User
}
```
Aqui, qualquer campo nulo no objeto `User` não será incluído no JSON.

### @JsonFormat

Esta anotação é útil para formatar campos de data e hora.

**Exemplo:**
```java
public class User {
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;
    // Restante da classe
}
```
`birthDate` será serializado no formato especificado.

### Manipuladores de Serialização Personalizados

Para casos mais complexos, você pode criar serializadores personalizados estendendo `JsonSerializer`.

**Exemplo:**
```java
public class CustomDateSerializer extends JsonSerializer<LocalDate> {
    @Override
    public void serialize(LocalDate value, JsonGenerator gen, SerializerProvider serializers) 
    throws IOException, JsonProcessingException {
        gen.writeString(value.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
    }
}
```
Use `@JsonSerialize(using = CustomDateSerializer.class)` para aplicar esse serializador a um campo específico.
