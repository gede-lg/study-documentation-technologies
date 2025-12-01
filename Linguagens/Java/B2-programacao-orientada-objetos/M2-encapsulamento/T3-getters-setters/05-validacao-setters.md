# T3.05 - Validação em Setters

## Introdução e Definição

**Validação em setters** é a prática de **verificar e garantir** que valores atribuídos a atributos sejam **válidos** antes de armazená-los. É um dos pilares do encapsulamento, pois protege a **integridade dos dados** e previne **estados inválidos** em objetos.

**Definição**: Validação em setter é o processo de:
- **Verificar** se o valor recebido atende a critérios específicos
- **Rejeitar** valores inválidos (geralmente lançando exceção)
- **Transformar/Normalizar** valores antes de armazenar
- **Garantir** que o objeto sempre esteja em estado consistente

**Exemplo Básico**:
```java
public class Pessoa {
    private String nome;
    private int idade;

    // ✅ Setter COM validação
    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        this.nome = nome.trim();  // Normaliza (remove espaços)
    }

    public void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade deve estar entre 0 e 150");
        }
        this.idade = idade;
    }

    // Getters...
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
}

// Uso:
Pessoa p = new Pessoa();
p.setNome("João Silva");  // ✅ OK
p.setIdade(30);           // ✅ OK

// p.setNome("");         // ❌ Lança IllegalArgumentException
// p.setIdade(-5);        // ❌ Lança IllegalArgumentException
// p.setIdade(200);       // ❌ Lança IllegalArgumentException
```

**Por Que Validar em Setters?**
- **Integridade de Dados**: Garante que atributos sempre tenham valores válidos
- **Fail-Fast**: Detecta erros no ponto de atribuição, não mais tarde
- **Documentação Viva**: Código mostra claramente regras de negócio
- **Depuração Facilitada**: Erros apontam exatamente onde valor inválido foi atribuído
- **Prevenção de Bugs**: Evita propagação de dados inválidos
- **Segurança**: Previne valores maliciosos

---

## 10 Fundamentos Teóricos

### 1. Validação de Não-Nulo (Null Check)

**Validação mais comum**: Rejeitar valores `null`.

```java
public class Usuario {
    private String nome;
    private String email;

    public void setNome(String nome) {
        if (nome == null) {
            throw new IllegalArgumentException("Nome não pode ser nulo");
        }
        this.nome = nome;
    }

    public void setEmail(String email) {
        if (email == null) {
            throw new NullPointerException("Email não pode ser nulo");
        }
        this.email = email;
    }
}
```

**Alternativa: Objects.requireNonNull() (Java 7+)**
```java
import java.util.Objects;

public void setNome(String nome) {
    this.nome = Objects.requireNonNull(nome, "Nome não pode ser nulo");
}
```

**Permite Null em Casos Específicos**:
```java
public class Pessoa {
    private String apelido;  // Pode ser null (opcional)

    public void setApelido(String apelido) {
        // Permite null, mas valida se não for null
        if (apelido != null && apelido.trim().isEmpty()) {
            throw new IllegalArgumentException("Apelido não pode ser vazio (use null se não tiver)");
        }
        this.apelido = apelido;
    }
}
```

---

### 2. Validação de Range (Faixa de Valores)

**Validação numérica**: Valores devem estar dentro de limites.

```java
public class Produto {
    private double preco;
    private int quantidade;
    private double desconto;  // 0 a 100%

    public void setPreco(double preco) {
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }
        this.preco = preco;
    }

    public void setQuantidade(int quantidade) {
        if (quantidade < 0) {
            throw new IllegalArgumentException("Quantidade não pode ser negativa");
        }
        if (quantidade > 10000) {
            throw new IllegalArgumentException("Quantidade máxima é 10000");
        }
        this.quantidade = quantidade;
    }

    public void setDesconto(double desconto) {
        if (desconto < 0 || desconto > 100) {
            throw new IllegalArgumentException("Desconto deve estar entre 0 e 100");
        }
        this.desconto = desconto;
    }
}
```

**Idade Válida**:
```java
public void setIdade(int idade) {
    if (idade < 0) {
        throw new IllegalArgumentException("Idade não pode ser negativa");
    }
    if (idade > 150) {
        throw new IllegalArgumentException("Idade não pode ser maior que 150");
    }
    this.idade = idade;
}
```

---

### 3. Validação de Formato (Regex)

**Validação de padrões**: Email, CPF, telefone, etc.

```java
public class Usuario {
    private String email;
    private String cpf;
    private String telefone;

    public void setEmail(String email) {
        if (email == null || !email.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$")) {
            throw new IllegalArgumentException("Email inválido: " + email);
        }
        this.email = email.toLowerCase();  // Normaliza
    }

    public void setCpf(String cpf) {
        // Remove formatação
        String cpfLimpo = cpf.replaceAll("[^0-9]", "");
        
        if (!cpfLimpo.matches("\\d{11}")) {
            throw new IllegalArgumentException("CPF deve ter 11 dígitos");
        }
        
        // Validação adicional: verificar dígitos verificadores
        if (!validarDigitosCpf(cpfLimpo)) {
            throw new IllegalArgumentException("CPF inválido");
        }
        
        this.cpf = cpfLimpo;  // Armazena sem formatação
    }

    public void setTelefone(String telefone) {
        String telefoneLimpo = telefone.replaceAll("[^0-9]", "");
        
        if (!telefoneLimpo.matches("\\d{10,11}")) {
            throw new IllegalArgumentException("Telefone deve ter 10 ou 11 dígitos");
        }
        
        this.telefone = telefoneLimpo;
    }

    private boolean validarDigitosCpf(String cpf) {
        // Implementação simplificada
        // Em produção, use biblioteca como Apache Commons Validator
        return true;
    }
}
```

---

### 4. Validação de Comprimento (String Length)

**Validação de tamanho**: Strings com limites mínimo/máximo.

```java
public class Usuario {
    private String username;
    private String senha;
    private String biografia;

    public void setUsername(String username) {
        if (username == null) {
            throw new IllegalArgumentException("Username não pode ser nulo");
        }
        if (username.length() < 3) {
            throw new IllegalArgumentException("Username deve ter pelo menos 3 caracteres");
        }
        if (username.length() > 20) {
            throw new IllegalArgumentException("Username não pode ter mais de 20 caracteres");
        }
        if (!username.matches("[a-zA-Z0-9_]+")) {
            throw new IllegalArgumentException("Username só pode conter letras, números e underscore");
        }
        this.username = username;
    }

    public void setSenha(String senha) {
        if (senha == null || senha.length() < 8) {
            throw new IllegalArgumentException("Senha deve ter pelo menos 8 caracteres");
        }
        if (senha.length() > 50) {
            throw new IllegalArgumentException("Senha não pode ter mais de 50 caracteres");
        }
        // Validação adicional: complexidade
        if (!senhaForte(senha)) {
            throw new IllegalArgumentException("Senha deve conter letras, números e caracteres especiais");
        }
        this.senha = senha;
    }

    public void setBiografia(String biografia) {
        if (biografia != null && biografia.length() > 500) {
            throw new IllegalArgumentException("Biografia não pode ter mais de 500 caracteres");
        }
        this.biografia = biografia;
    }

    private boolean senhaForte(String senha) {
        return senha.matches(".*[a-z].*") &&    // Pelo menos uma minúscula
               senha.matches(".*[A-Z].*") &&    // Pelo menos uma maiúscula
               senha.matches(".*\\d.*") &&      // Pelo menos um dígito
               senha.matches(".*[!@#$%^&*].*"); // Pelo menos um especial
    }
}
```

---

### 5. Validação de Valores Permitidos (Whitelist/Enum)

**Valores específicos permitidos**: Lista restrita de opções.

```java
public class Configuracao {
    private String idioma;
    private String tema;

    private static final Set<String> IDIOMAS_PERMITIDOS = 
        Set.of("pt-BR", "en-US", "es-ES", "fr-FR");

    private static final Set<String> TEMAS_PERMITIDOS = 
        Set.of("claro", "escuro", "automatico");

    public void setIdioma(String idioma) {
        if (idioma == null) {
            throw new IllegalArgumentException("Idioma não pode ser nulo");
        }
        if (!IDIOMAS_PERMITIDOS.contains(idioma)) {
            throw new IllegalArgumentException(
                "Idioma inválido. Valores permitidos: " + IDIOMAS_PERMITIDOS
            );
        }
        this.idioma = idioma;
    }

    public void setTema(String tema) {
        if (tema == null) {
            throw new IllegalArgumentException("Tema não pode ser nulo");
        }
        if (!TEMAS_PERMITIDOS.contains(tema)) {
            throw new IllegalArgumentException(
                "Tema inválido. Valores permitidos: " + TEMAS_PERMITIDOS
            );
        }
        this.tema = tema;
    }
}
```

**Melhor Abordagem: Usar Enum**
```java
public enum Tema {
    CLARO, ESCURO, AUTOMATICO
}

public class Configuracao {
    private Tema tema;

    public void setTema(Tema tema) {
        this.tema = Objects.requireNonNull(tema, "Tema não pode ser nulo");
    }
}
```

---

### 6. Validação de Datas

**Validação temporal**: Datas futuras, passadas, ranges.

```java
import java.time.LocalDate;
import java.time.Period;

public class Pessoa {
    private LocalDate dataNascimento;
    private LocalDate dataContratacao;

    public void setDataNascimento(LocalDate dataNascimento) {
        if (dataNascimento == null) {
            throw new IllegalArgumentException("Data de nascimento não pode ser nula");
        }
        
        LocalDate hoje = LocalDate.now();
        
        // Não pode ser futura
        if (dataNascimento.isAfter(hoje)) {
            throw new IllegalArgumentException("Data de nascimento não pode ser futura");
        }
        
        // Idade mínima: 0 anos, máxima: 150 anos
        int idade = Period.between(dataNascimento, hoje).getYears();
        if (idade > 150) {
            throw new IllegalArgumentException("Data de nascimento inválida (mais de 150 anos)");
        }
        
        this.dataNascimento = dataNascimento;
    }

    public void setDataContratacao(LocalDate dataContratacao) {
        if (dataContratacao == null) {
            throw new IllegalArgumentException("Data de contratação não pode ser nula");
        }
        
        LocalDate hoje = LocalDate.now();
        LocalDate limitePassado = hoje.minusYears(50);
        LocalDate limiteFuturo = hoje.plusYears(1);
        
        if (dataContratacao.isBefore(limitePassado)) {
            throw new IllegalArgumentException("Data de contratação muito antiga");
        }
        
        if (dataContratacao.isAfter(limiteFuturo)) {
            throw new IllegalArgumentException("Data de contratação não pode ser mais de 1 ano no futuro");
        }
        
        this.dataContratacao = dataContratacao;
    }
}
```

---

### 7. Validação Cruzada (Cross-Field Validation)

**Validação entre múltiplos campos**: Um campo depende de outro.

```java
public class Evento {
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private int capacidadeMaxima;
    private int inscritos;

    public void setDataInicio(LocalDateTime dataInicio) {
        if (dataInicio == null) {
            throw new IllegalArgumentException("Data de início não pode ser nula");
        }
        
        // Validação cruzada: início deve ser antes do fim
        if (this.dataFim != null && dataInicio.isAfter(this.dataFim)) {
            throw new IllegalArgumentException("Data de início deve ser antes da data de fim");
        }
        
        this.dataInicio = dataInicio;
    }

    public void setDataFim(LocalDateTime dataFim) {
        if (dataFim == null) {
            throw new IllegalArgumentException("Data de fim não pode ser nula");
        }
        
        // Validação cruzada: fim deve ser depois do início
        if (this.dataInicio != null && dataFim.isBefore(this.dataInicio)) {
            throw new IllegalArgumentException("Data de fim deve ser depois da data de início");
        }
        
        this.dataFim = dataFim;
    }

    public void setCapacidadeMaxima(int capacidadeMaxima) {
        if (capacidadeMaxima <= 0) {
            throw new IllegalArgumentException("Capacidade máxima deve ser positiva");
        }
        
        // Validação cruzada: capacidade deve ser >= inscritos
        if (capacidadeMaxima < this.inscritos) {
            throw new IllegalArgumentException(
                "Capacidade máxima não pode ser menor que número de inscritos (" + this.inscritos + ")"
            );
        }
        
        this.capacidadeMaxima = capacidadeMaxima;
    }

    public void setInscritos(int inscritos) {
        if (inscritos < 0) {
            throw new IllegalArgumentException("Número de inscritos não pode ser negativo");
        }
        
        // Validação cruzada: inscritos não pode exceder capacidade
        if (inscritos > this.capacidadeMaxima) {
            throw new IllegalArgumentException(
                "Número de inscritos não pode exceder capacidade máxima (" + this.capacidadeMaxima + ")"
            );
        }
        
        this.inscritos = inscritos;
    }
}
```

---

### 8. Normalização e Transformação em Setters

**Normalizar valores**: Transformar antes de armazenar.

```java
public class Usuario {
    private String email;
    private String nome;
    private String cpf;
    private String telefone;

    public void setEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email não pode ser vazio");
        }
        
        // Normaliza: trim + toLowerCase
        String emailNormalizado = email.trim().toLowerCase();
        
        if (!emailNormalizado.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$")) {
            throw new IllegalArgumentException("Email inválido");
        }
        
        this.email = emailNormalizado;
    }

    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        
        // Normaliza: trim + capitaliza primeira letra de cada palavra
        this.nome = capitalizarNome(nome.trim());
    }

    public void setCpf(String cpf) {
        if (cpf == null) {
            throw new IllegalArgumentException("CPF não pode ser nulo");
        }
        
        // Normaliza: remove formatação (pontos, hífens)
        String cpfLimpo = cpf.replaceAll("[^0-9]", "");
        
        if (!cpfLimpo.matches("\\d{11}")) {
            throw new IllegalArgumentException("CPF inválido");
        }
        
        this.cpf = cpfLimpo;  // Armazena sem formatação
    }

    public void setTelefone(String telefone) {
        if (telefone == null) {
            throw new IllegalArgumentException("Telefone não pode ser nulo");
        }
        
        // Normaliza: remove formatação
        String telefoneLimpo = telefone.replaceAll("[^0-9]", "");
        
        if (!telefoneLimpo.matches("\\d{10,11}")) {
            throw new IllegalArgumentException("Telefone inválido");
        }
        
        this.telefone = telefoneLimpo;
    }

    private String capitalizarNome(String nome) {
        String[] palavras = nome.split("\\s+");
        StringBuilder resultado = new StringBuilder();
        
        for (String palavra : palavras) {
            if (palavra.length() > 0) {
                resultado.append(Character.toUpperCase(palavra.charAt(0)))
                         .append(palavra.substring(1).toLowerCase())
                         .append(" ");
            }
        }
        
        return resultado.toString().trim();
    }
}
```

---

### 9. Tipos de Exceções Para Validação

**Escolher exceção apropriada**:

```java
public class Produto {
    private String nome;
    private double preco;
    private Categoria categoria;

    public void setNome(String nome) {
        // IllegalArgumentException: para argumentos inválidos
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        this.nome = nome;
    }

    public void setPreco(double preco) {
        // IllegalArgumentException: valor fora do range
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo: " + preco);
        }
        this.preco = preco;
    }

    public void setCategoria(Categoria categoria) {
        // NullPointerException: para null não permitido
        if (categoria == null) {
            throw new NullPointerException("Categoria não pode ser nula");
        }
        this.categoria = categoria;
    }
}
```

**Exceções Customizadas**:
```java
public class ValidacaoException extends RuntimeException {
    public ValidacaoException(String mensagem) {
        super(mensagem);
    }
}

public class Usuario {
    private String email;

    public void setEmail(String email) {
        if (email == null || !email.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$")) {
            throw new ValidacaoException("Email inválido: " + email);
        }
        this.email = email;
    }
}
```

---

### 10. Validação com Bean Validation (JSR 303/380)

**Alternativa**: Usar anotações do Bean Validation.

```java
import javax.validation.constraints.*;

public class Usuario {
    @NotNull(message = "Nome não pode ser nulo")
    @NotBlank(message = "Nome não pode ser vazio")
    @Size(min = 3, max = 50, message = "Nome deve ter entre 3 e 50 caracteres")
    private String nome;

    @NotNull
    @Email(message = "Email inválido")
    private String email;

    @Min(value = 18, message = "Idade mínima é 18")
    @Max(value = 100, message = "Idade máxima é 100")
    private int idade;

    @Pattern(regexp = "\\d{11}", message = "CPF deve ter 11 dígitos")
    private String cpf;

    @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que zero")
    private double preco;

    // Setters simples (validação feita por framework)
    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }
}
```

**Validação Manual**:
```java
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import javax.validation.ConstraintViolation;
import java.util.Set;

ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
Validator validator = factory.getValidator();

Usuario user = new Usuario();
user.setNome("Jo");  // Muito curto
user.setIdade(15);   // Abaixo do mínimo

Set<ConstraintViolation<Usuario>> violations = validator.validate(user);

for (ConstraintViolation<Usuario> violation : violations) {
    System.out.println(violation.getMessage());
}
```

---

## Aplicabilidade

### Quando Validar em Setters

**Sempre valide quando**:
- Atributo tem **regras de negócio** (idade > 0, email válido)
- Valor **inválido causa bugs** ou corrupção de dados
- **Estado consistente** é crítico para o objeto
- Classe é **entidade de domínio** com invariantes
- **Segurança** requer valores validados

### Quando NÃO Validar (ou Validar Minimamente)

**Validação mínima quando**:
- **DTOs simples**: Validação pode ser feita em camada de serviço
- **Objetos temporários**: Construídos e validados antes de uso
- **Performance crítica**: Validação repetitiva cara (cache validações)

```java
// DTO: validação pode ser externa
public class UsuarioDTO {
    private String nome;
    private String email;

    public void setNome(String nome) {
        this.nome = nome;  // Sem validação (feita na camada service)
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

// Service valida antes de usar
public class UsuarioService {
    public void criarUsuario(UsuarioDTO dto) {
        validarUsuario(dto);  // Validação centralizada
        // ...
    }

    private void validarUsuario(UsuarioDTO dto) {
        if (dto.getNome() == null || dto.getNome().trim().isEmpty()) {
            throw new ValidacaoException("Nome inválido");
        }
        // ...
    }
}
```

---

## Armadilhas Comuns

### 1. Validação Silenciosa (Não Lançar Exceção)

```java
// ❌ RUIM: aceita valor inválido silenciosamente
public void setIdade(int idade) {
    if (idade >= 0 && idade <= 150) {
        this.idade = idade;
    }
    // Se inválido, não faz nada (valor antigo permanece)
}

// ✅ BOM: lança exceção
public void setIdade(int idade) {
    if (idade < 0 || idade > 150) {
        throw new IllegalArgumentException("Idade inválida: " + idade);
    }
    this.idade = idade;
}
```

### 2. Mensagens de Erro Genéricas

```java
// ❌ RUIM: mensagem vaga
public void setEmail(String email) {
    if (!email.contains("@")) {
        throw new IllegalArgumentException("Inválido");
    }
    this.email = email;
}

// ✅ BOM: mensagem específica
public void setEmail(String email) {
    if (email == null || !email.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$")) {
        throw new IllegalArgumentException("Email inválido: '" + email + "'. Formato esperado: usuario@dominio.com");
    }
    this.email = email;
}
```

### 3. Validação Inconsistente Entre Setter e Construtor

```java
// ❌ RUIM: construtor permite valor inválido
public class Pessoa {
    private int idade;

    public Pessoa(int idade) {
        this.idade = idade;  // Sem validação!
    }

    public void setIdade(int idade) {
        if (idade < 0) {
            throw new IllegalArgumentException("Idade inválida");
        }
        this.idade = idade;
    }
}

// Problema:
Pessoa p = new Pessoa(-5);  // ✅ Aceito (construtor não valida)
// p.setIdade(-5);          // ❌ Rejeitado (setter valida)

// ✅ BOM: validação consistente
public class Pessoa {
    private int idade;

    public Pessoa(int idade) {
        setIdade(idade);  // Reutiliza validação do setter
    }

    public void setIdade(int idade) {
        if (idade < 0) {
            throw new IllegalArgumentException("Idade inválida");
        }
        this.idade = idade;
    }
}
```

---

## Boas Práticas

### 1. Valide Sempre, Mesmo em Setters Privados

```java
public void setIdade(int idade) {
    if (idade < 0 || idade > 150) {
        throw new IllegalArgumentException("Idade inválida");
    }
    this.idade = idade;
}
```

### 2. Normalize Valores Antes de Armazenar

```java
public void setEmail(String email) {
    if (email != null) {
        email = email.trim().toLowerCase();
    }
    // Valida após normalizar
    if (email == null || !email.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$")) {
        throw new IllegalArgumentException("Email inválido");
    }
    this.email = email;
}
```

### 3. Use Métodos de Validação Reutilizáveis

```java
public class Usuario {
    private String email;

    public void setEmail(String email) {
        this.email = validarEmail(email);
    }

    private String validarEmail(String email) {
        if (email == null) {
            throw new IllegalArgumentException("Email não pode ser nulo");
        }
        
        email = email.trim().toLowerCase();
        
        if (!email.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$")) {
            throw new IllegalArgumentException("Email inválido: " + email);
        }
        
        return email;
    }
}
```

### 4. Documente Regras de Validação

```java
/**
 * Define a idade da pessoa.
 * 
 * @param idade idade em anos (deve estar entre 0 e 150)
 * @throws IllegalArgumentException se idade for negativa ou maior que 150
 */
public void setIdade(int idade) {
    if (idade < 0 || idade > 150) {
        throw new IllegalArgumentException("Idade deve estar entre 0 e 150, recebido: " + idade);
    }
    this.idade = idade;
}
```

### 5. Teste Validações Extensivamente

```java
@Test
public void testSetIdadeValida() {
    Pessoa p = new Pessoa();
    p.setIdade(30);  // Deve aceitar
    assertEquals(30, p.getIdade());
}

@Test
public void testSetIdadeNegativa() {
    Pessoa p = new Pessoa();
    assertThrows(IllegalArgumentException.class, () -> {
        p.setIdade(-5);
    });
}

@Test
public void testSetIdadeMuitoAlta() {
    Pessoa p = new Pessoa();
    assertThrows(IllegalArgumentException.class, () -> {
        p.setIdade(200);
    });
}
```

---

## Resumo Executivo

**Validação em Setters** garante **integridade de dados**:

**Tipos de Validação**:
- **Não-nulo**: Rejeitar `null`
- **Range**: Valores numéricos dentro de limites
- **Formato**: Regex (email, CPF, telefone)
- **Comprimento**: String length mín/máx
- **Whitelist**: Valores permitidos específicos
- **Datas**: Validação temporal
- **Cruzada**: Validação entre campos
- **Normalização**: Transformar antes de armazenar

**Exceções Comuns**:
- `IllegalArgumentException`: Argumento inválido
- `NullPointerException`: Null não permitido
- Exceções customizadas para domínio específico

**Boas Práticas**:
- **Sempre valide** valores em setters
- **Normalize** antes de armazenar (trim, toLowerCase)
- **Mensagens claras** descrevendo problema
- **Consistência** entre construtor e setters
- **Documente** regras de validação
- **Teste** todos os casos (válidos e inválidos)

**Armadilhas**:
- Validação silenciosa ❌
- Mensagens genéricas ❌
- Inconsistência construtor/setter ❌

**Regra de Ouro**: **Valide rigorosamente** em setters para garantir que objetos **nunca estejam em estado inválido**. Fail-fast é melhor que fail-late.
