# Módulo 2: Spring Boot

## Tópico 1: Repositório no Spring Boot

### Definição e Propósito
- **O que é?**: Em Spring Boot, um repositório é uma interface que abstrai a camada de acesso a dados do aplicativo. Ele permite uma maneira mais simples e elegante de interagir com o banco de dados.
- **Para que serve?**: Serve para separar a lógica de negócios da lógica de acesso a dados, promovendo uma arquitetura limpa e facilitando a manutenção e testabilidade do código.

### Exemplo de Código
```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Métodos específicos de consulta podem ser adicionados aqui
}
```

## Tópico 2: JPA e Hibernate

### JPA (Java Persistence API)
- **Visão Geral**: JPA é uma especificação para persistência de dados em Java, oferecendo uma maneira padronizada de mapear objetos para um banco de dados relacional.
- **Entidades e Anotações**: Explicação sobre entidades JPA e anotações como `@Entity`, `@Id`, `@GeneratedValue`, `@Column`, etc.

### Hibernate
- **Hibernate como Provedor JPA**: Como o Hibernate implementa a especificação JPA.
- **Configurações e Sessões**: Configuração do Hibernate e gerenciamento de sessões.

### Exemplo de Entidade
```java
import javax.persistence.*;

@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    // Getters e setters
}
```

## Tópico 3: Spring Data JPA

### Integrando Spring Data JPA
- **Configuração**: Como configurar o Spring Data JPA em um projeto Spring Boot.
- **Repository Interfaces**: Criação de interfaces de repositório usando Spring Data JPA.

### Consultas Personalizadas
- **Métodos de Consulta**: Criação de métodos de consulta personalizados.
- **Query Methods e @Query**: Uso de métodos de query e anotação `@Query` para consultas customizadas.

### Exemplo de Método de Consulta
```java
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByNomeContaining(String nome);
}
```

## Tópico 4: Transações no Spring Boot

### Gerenciamento de Transações
- **@Transactional**: Uso da anotação `@Transactional` para gerenciar transações.
- **Propagação e Isolamento**: Entendendo propagação e níveis de isolamento em transações.

### Exemplo de Método Transacional
```java
import org.springframework.transaction.annotation.Transactional;

@Transactional
public void atualizaUsuario(Long id, String novoNome) {
    Usuario usuario = usuarioRepository.findById(id).orElseThrow();
    usuario.setNome(novoNome);
    usuarioRepository.save(usuario);
}
```

## Tópico 5: Testes com Spring Boot

### Testando Repositórios
- **Testes de Integração**: Criação de testes de integração para os repositórios.
- **Dados de Teste**: Uso de banco de dados em memória como H2 para testes.

### Exemplo de Teste de Repositório
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Testes vão aqui
}
```

Este módulo oferece uma base sólida para entender como os repositórios funcionam no Spring Boot, como integrar o Spring Data JPA, gerenciar transações e testar componentes relacionados. A abordagem prática com exemplos de código ajuda a consolidar o aprendizado.