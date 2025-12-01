
Para usar JWT com Spring Boot, você precisa adicionar algumas dependências ao seu arquivo `pom.xml` do Maven. As principais dependências são:

- **Spring Boot Starter Security**: fornece as funcionalidades básicas de segurança.
- **jjwt**: uma biblioteca para criar e verificar tokens JWT.

```xml
<dependencies>
    <!-- Spring Boot Starter Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>
</dependencies>
```

## Configuração do Spring Security

Para integrar o JWT com Spring Security, você precisa configurar algumas classes.

### 1. `WebSecurityConfig`

A classe `WebSecurityConfig` estende `WebSecurityConfigurerAdapter` e define as regras de segurança.

```java
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/authenticate").permitAll()
            .anyRequest().authenticated()
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        
        // Adicionar filtros JWT aqui
    }
}
```

### 2. `JwtTokenUtil`

A classe `JwtTokenUtil` é responsável por gerar, validar e obter informações do token JWT.

```java
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenUtil {

    private String secret = "your_secret_key"; // Defina sua chave secreta aqui

    public String generateToken(UserDetails userDetails) {
        // Implemente a lógica para gerar o token JWT
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        // Implemente a lógica para validar o token
    }

    // Métodos adicionais para extrair informações do token
}
```

### 3. `JwtRequestFilter`

`JwtRequestFilter` estende `OncePerRequestFilter` e intercepta requisições para validar o token JWT.

```java
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        // Lógica para extrair e validar o token JWT da requisição
    }
}
```

## Autenticação e Geração de Token

Para autenticar usuários e gerar tokens JWT, você precisa criar um ponto de extremidade (`endpoint`).

```java
@RestController
@RequestMapping("/api")
public class JwtAuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) {
        // Autentique o usuário e gere um token JWT
    }
}
```

Neste ponto de extremidade, você autenticará o usuário com base nas credenciais fornecidas e, em seguida, gerará um token JWT.

## Considerações Finais

- **Segurança do Token**: Certifique-se de que a chave secreta usada para assinar o token é armazenada de forma segura.
- **Tratamento de Exceções**: Implemente o tratamento adequado de exceções para lidar com casos de tokens inválidos ou expirados.
- **Renovação do Token**: Considere a implementação de mecanismos de renovação de token para melhorar a segurança e a experiência do usuário.
- **Testes**: Escreva testes abrangentes para garantir que a autenticação e autorização estejam funcionando como esperado.