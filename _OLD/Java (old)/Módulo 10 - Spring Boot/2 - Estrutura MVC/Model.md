
Este módulo explora a estruturação de modelos de dados em aplicações Spring Boot, enfocando nas entidades, DTOs (Data Transfer Objects) e mapeamento entre eles com o uso de MapStruct. Vamos nos aprofundar em cada tópico com detalhes e exemplos de código.

## Entity
### O que são Entidades?
- **Definição**: Entidades são classes em uma aplicação Spring Boot que são mapeadas para tabelas em um banco de dados. Elas representam os dados que serão persistentes.
- **Anotações JPA**: Uso de `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, entre outras para mapear propriedades das entidades com colunas do banco de dados.

### Exemplo de Entidade:
```java
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    // Getters and Setters
}
```

## DTO (Data Transfer Object)
### O que é DTO e para que serve?
- **Definição**: DTO é um padrão de projeto usado para transferir dados entre software de camadas diferentes. Em Spring Boot, DTOs são usados para enviar e receber dados da API, mantendo a entidade segura e oculta.
- **Segurança e Abstração**: Evita a exposição direta da entidade e permite personalizar os dados que são enviados ou recebidos.

### Exemplo de DTO:
```java
public class UserDTO {
    private Long id;
    private String name;

    // Getters and Setters
}
```