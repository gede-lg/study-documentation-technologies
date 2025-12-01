# Módulo 2: Spring Boot

## Services em Spring Boot

### O que são Services?

Em Spring Boot, **Services** são componentes do Spring Framework que abstraem a lógica de negócios da aplicação. Eles são anotados com `@Service`, indicando ao Spring que essas classes realizam operações de negócio, como transações ou chamadas a repositórios.

#### Características Principais:
- **Separação de preocupações:** Isolam a lógico de negócio da lógica de apresentação (Controllers) e de acesso a dados (Repositories).
- **Singleton por padrão:** Spring gerencia services como beans singleton, o que significa que apenas uma instância de cada service é criada.
- **Transacionalidade:** Podem ser envolvidos em transações de banco de dados.

### Para que servem os Services?

Services servem para:
1. **Encapsular a lógica de negócio:** Toda a lógica específica da aplicação, como cálculos, validações e regras de negócio, é mantida dentro dos services.
2. **Facilitar a manutenção:** Ao separar a lógica de negócio das demais partes da aplicação, torna-se mais fácil manter e alterar o código.
3. **Promover a reutilização de código:** Services podem ser injetados em diferentes componentes do Spring, facilitando a reutilização.

### Exemplo Básico de um Service

```java
import org.springframework.stereotype.Service;

@Service
public class ExemploService {

    public String getMensagem() {
        return "Bem-vindo ao Spring Boot!";
    }
}
```

### Utilizando um Service em um Controller

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExemploController {

    private final ExemploService exemploService;

    @Autowired
    public ExemploController(ExemploService exemploService) {
        this.exemploService = exemploService;
    }

    @GetMapping("/mensagem")
    public String getMensagem() {
        return exemploService.getMensagem();
    }
}
```

### Aspectos Avançados

#### Transações

Services são comumente utilizados para gerenciar transações de banco de dados. A anotação `@Transactional` pode ser usada para indicar que um método deve ser executado dentro de uma transação.

#### Exemplo com

`@Transactional`:

```java
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransacionalService {

    @Transactional
    public void metodoTransacional() {
        // Lógica de negócio que requer uma transação de banco de dados
    }
}
```

#### Integração com Repositórios

Services frequentemente interagem com repositórios (classes anotadas com `@Repository`) para realizar operações de banco de dados.

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Usuario criarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}
```

#### Testes de Services

É importante escrever testes unitários para os services para garantir a qualidade e a correta execução da lógica de negócios.

```java
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    public void testCriarUsuario() {
        Usuario usuario = new Usuario();
        Mockito.when(usuarioRepository.save(usuario)).thenReturn(usuario);

        Usuario resultado = usuarioService.criarUsuario(usuario);

        assertEquals(usuario, resultado);
    }
}
```

### Conclusão

Services em Spring Boot são fundamentais para a arquitetura de aplicações, oferecendo uma forma organizada e eficiente de gerenciar a lógica de negócios, interagir com o banco de dados e promover a manutenção e a escalabilidade do software.