# T3.08 - DTOs, Records e Alternativas aos Getters/Setters Tradicionais

## Introdução

Getters/setters tradicionais são **verbosos**. Alternativas modernas: **Records** (Java 14+), **DTOs** simples, **Lombok**.

**Problema JavaBeans**:
- 20 linhas para 3 atributos
- Código repetitivo (boilerplate)
- Mutabilidade pode causar bugs

**Soluções**:
- **Records**: Imutáveis, concisos
- **DTOs**: Transferência de dados entre camadas
- **Lombok**: Reduz boilerplate

---

## Fundamentos

### 1. DTOs (Data Transfer Objects)

**DTO** = Objeto simples para **transportar dados** entre camadas (Controller → Service → Repository).

**JavaBean DTO tradicional**:
```java
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;

    public UsuarioDTO() {}

    public UsuarioDTO(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
// 30 linhas para 3 atributos!
```

**Uso**:
```java
// Camada Controller retorna DTO (não entidade JPA)
@GetMapping("/{id}")
public UsuarioDTO buscarUsuario(@PathVariable Long id) {
    Usuario entidade = repository.findById(id);
    return new UsuarioDTO(entidade.getId(), entidade.getNome(), entidade.getEmail());
}
```

**Por que DTOs?**
- Desacopla API de modelo de banco
- Evita expor dados sensíveis (senha, auditoria)
- Serialização JSON limpa

### 2. Records (Java 14+): DTO Moderno

**Record** = Classe imutável com getters/equals/hashCode/toString automáticos.

**Sintaxe**:
```java
public record UsuarioDTO(Long id, String nome, String email) {}
// 1 linha!
```

**Gerado automaticamente**:
```java
// Construtor
public UsuarioDTO(Long id, String nome, String email) {
    this.id = id;
    this.nome = nome;
    this.email = email;
}

// Getters (sem prefixo "get")
public Long id() { return id; }
public String nome() { return nome; }
public String email() { return email; }

// equals(), hashCode(), toString()
```

**Uso**:
```java
UsuarioDTO dto = new UsuarioDTO(1L, "Maria", "maria@email.com");
System.out.println(dto.nome());   // "Maria"
System.out.println(dto.email());  // "maria@email.com"
System.out.println(dto);          // UsuarioDTO[id=1, nome=Maria, email=maria@email.com]
```

**Imutabilidade**:
```java
// ❌ Record NÃO TEM SETTERS
// dto.setNome("João");  // ERRO: método não existe

// ✅ Para alterar, crie novo record
UsuarioDTO novoDto = new UsuarioDTO(dto.id(), "João", dto.email());
```

### 3. Lombok: Reduz Boilerplate

**Lombok** usa anotações para gerar getters/setters/construtores em tempo de compilação.

**`@Data`**: Gera tudo
```java
import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
}
// Lombok gera: getters, setters, equals, hashCode, toString, construtor com todos argumentos
```

**Equivalente JavaBean (sem Lombok): 30 linhas. Com Lombok: 6 linhas.**

**`@Getter` e `@Setter`**:
```java
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Usuario {
    private String nome;
    private int idade;
}
```

**`@Value`**: Imutável (similar a Record)
```java
import lombok.Value;

@Value
public class UsuarioDTO {
    Long id;
    String nome;
    String email;
}
// Atributos final, sem setters, equals/hashCode/toString gerados
```

### 4. Builder Pattern (Lombok)

**`@Builder`**: Construção fluente
```java
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Usuario {
    private String nome;
    private int idade;
    private String email;
    private boolean ativo;
}
```

**Uso**:
```java
Usuario user = Usuario.builder()
    .nome("João")
    .idade(30)
    .email("joao@email.com")
    .ativo(true)
    .build();
```

**Vantagem**: Parâmetros opcionais sem múltiplos construtores.

### 5. Records com Validação

Records permitem **validação no construtor**:

```java
public record Usuario(String nome, int idade) {
    // Construtor canônico com validação
    public Usuario {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome obrigatório");
        }
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
    }
}
```

**Uso**:
```java
Usuario user = new Usuario("Maria", 25);  // OK
// Usuario invalido = new Usuario("", -5);  // IllegalArgumentException
```

### 6. Records com Métodos Adicionais

Records podem ter **métodos**:

```java
public record Produto(String nome, double preco) {
    public String getPrecoFormatado() {
        return String.format("R$ %.2f", preco);
    }

    public boolean isBarato() {
        return preco < 50.0;
    }
}
```

**Uso**:
```java
Produto p = new Produto("Livro", 39.90);
System.out.println(p.getPrecoFormatado());  // "R$ 39,90"
System.out.println(p.isBarato());           // true
```

### 7. Quando Usar Cada Abordagem

**JavaBeans tradicionais** (getters/setters):
- Frameworks legados exigem (JSP, JavaServer Faces)
- Mutabilidade necessária
- Padrão JavaBeans obrigatório

**Records** (Java 14+):
- **DTOs** (transferência de dados)
- Objetos imutáveis
- Java moderno disponível
- Código conciso

**Lombok**:
- Reduzir boilerplate
- Código limpo
- Equipe familiarizada com Lombok
- Combinar `@Builder` para construção fluente

**Comparação**:

| Abordagem       | Linhas (3 atributos) | Imutável | Boilerplate |
|-----------------|----------------------|----------|-------------|
| JavaBean        | ~30                  | ❌        | Alto        |
| Record          | 1                    | ✅        | Zero        |
| Lombok `@Data`  | ~6                   | ❌        | Baixo       |
| Lombok `@Value` | ~6                   | ✅        | Baixo       |

### 8. Records vs Lombok

**Record** (Java 14+):
```java
public record UsuarioDTO(Long id, String nome) {}
```

**Lombok `@Value`**:
```java
@Value
public class UsuarioDTO {
    Long id;
    String nome;
}
```

**Diferenças**:

| Aspecto          | Record                  | Lombok `@Value`        |
|------------------|-------------------------|------------------------|
| Sintaxe          | Mais concisa            | Requer anotação        |
| Getter           | `nome()` (sem "get")    | `getNome()` (padrão)   |
| Herança          | Não pode estender       | Pode estender classes  |
| Dependência      | Nativa Java 14+         | Requer biblioteca      |
| Jackson/Spring   | Suporte nativo          | Suporte via plugin     |

**Recomendação**: **Records** se Java 14+ disponível, **Lombok** para Java 8-13.

### 9. Mappers: Entidade → DTO

**Conversão manual**:
```java
Usuario entidade = repository.findById(1L);

// JavaBean DTO
UsuarioDTO dto = new UsuarioDTO();
dto.setId(entidade.getId());
dto.setNome(entidade.getNome());

// Record DTO
UsuarioDTO dto = new UsuarioDTO(entidade.getId(), entidade.getNome());
```

**MapStruct** (biblioteca de mapeamento):
```java
@Mapper
public interface UsuarioMapper {
    UsuarioDTO toDTO(Usuario entidade);
    Usuario toEntity(UsuarioDTO dto);
}

// Uso
UsuarioDTO dto = mapper.toDTO(entidade);
```

### 10. Imutabilidade: Records vs Getters/Setters

**JavaBean mutável**:
```java
@Data
public class Usuario {
    private String nome;  // Pode ser alterado
}

Usuario user = new Usuario();
user.setNome("Maria");
user.setNome("João");  // Alterado depois
```

**Record imutável**:
```java
public record Usuario(String nome) {}

Usuario user = new Usuario("Maria");
// user.setNome("João");  // ERRO: não existe setter

// Para "alterar", crie novo record
Usuario novoUser = new Usuario("João");
```

**Vantagens imutabilidade**:
- Thread-safe (seguro em múltiplas threads)
- Sem efeitos colaterais
- Cache confiável (HashMaps)

---

## Aplicabilidade

**Use JavaBeans quando**:
- Framework legado obrigatório
- Mutabilidade necessária
- Padrão JavaBeans requerido

**Use Records quando**:
- DTOs entre camadas
- Objetos imutáveis
- Java 14+ disponível
- API REST (JSON)

**Use Lombok quando**:
- Reduzir boilerplate
- Java 8-13 (sem Records)
- Builder Pattern (`@Builder`)
- Flexibilidade (mutável/imutável)

---

## Armadilhas

### 1. Records Sem Setters

```java
public record Usuario(String nome) {}

Usuario user = new Usuario("Maria");
// user.setNome("João");  // ERRO: método não existe
```

### 2. Lombok Requer Plugin

**Instalação obrigatória**:
```
IntelliJ: Settings → Plugins → "Lombok"
Eclipse: Marketplace → "Lombok"
Maven: <dependency>lombok</dependency>
```

### 3. Serialização JSON: Getter Sem "get"

**Record**:
```java
public record Usuario(String nome) {}
// JSON: {"nome": "Maria"}
// Getter: nome() (não getNome())
```

**Jackson detecta automaticamente**, mas configure se necessário:
```java
@JsonProperty("nome")
public String nome() { return nome; }
```

---

## Boas Práticas

### 1. Prefira Records Para DTOs

```java
// ✅ DTO com Record
public record UsuarioDTO(Long id, String nome, String email) {}

// ❌ DTO com JavaBean verboso
public class UsuarioDTO {
    private Long id;
    // + 20 linhas de getters/setters
}
```

### 2. Use Lombok Para Entidades JPA

```java
@Entity
@Data
@NoArgsConstructor  // JPA exige construtor sem argumentos
public class Usuario {
    @Id
    private Long id;
    private String nome;
}
```

### 3. Valide Records

```java
public record Usuario(String nome, int idade) {
    public Usuario {
        if (idade < 0) throw new IllegalArgumentException("Idade inválida");
    }
}
```

### 4. DTOs Separados da Entidade

```java
// ❌ Não exponha entidade JPA
@GetMapping("/usuarios")
public List<Usuario> listar() {
    return repository.findAll();  // Expõe senha, timestamps
}

// ✅ Use DTO
@GetMapping("/usuarios")
public List<UsuarioDTO> listar() {
    return repository.findAll().stream()
        .map(u -> new UsuarioDTO(u.getId(), u.getNome()))
        .toList();
}
```

---

## Resumo

**Alternativas a Getters/Setters**:

**Records** (Java 14+):
```java
public record UsuarioDTO(Long id, String nome) {}
// 1 linha, imutável, getters automáticos
```

**Lombok**:
```java
@Data
public class UsuarioDTO {
    private Long id;
    private String nome;
}
// Getters, setters, equals, hashCode, toString
```

**Quando usar**:
- **JavaBeans**: Frameworks legados, mutabilidade necessária
- **Records**: DTOs, imutabilidade, Java 14+
- **Lombok**: Reduzir boilerplate, Java 8-13

**Vantagens Records/Lombok**:
- Código conciso (1-6 linhas vs 30)
- Menos erros
- Imutabilidade (Records, Lombok `@Value`)
- Produtividade

**Regra de Ouro**: Use **Records** para DTOs modernos, **Lombok** para reduzir boilerplate, **JavaBeans** apenas quando obrigatório.
