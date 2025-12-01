# T3.01 - Padrão JavaBeans

## Introdução e Definição

**JavaBeans** é uma especificação da Sun Microsystems (agora Oracle) que define um **padrão de design** para componentes Java reutilizáveis. No contexto de encapsulamento, o padrão JavaBeans estabelece convenções para:

- **Atributos privados** (encapsulamento)
- **Métodos públicos de acesso** (getters e setters)
- **Nomenclatura padronizada** (convenções de naming)
- **Construtor público sem argumentos**
- **Serialização** (implementar Serializable, opcional)

**Objetivo**: Criar componentes **padronizados**, **reutilizáveis** e **interoperáveis** que podem ser manipulados por ferramentas e frameworks.

**Exemplo Básico**:
```java
public class Usuario implements Serializable {
    private String nome;      // Atributo privado
    private int idade;
    private boolean ativo;

    // Construtor público sem argumentos (OBRIGATÓRIO)
    public Usuario() { }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public boolean isAtivo() {  // boolean usa "is" em vez de "get"
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
```

**Uso**:
```java
Usuario user = new Usuario();  // Construtor sem argumentos
user.setNome("João Silva");    // Setter
user.setIdade(30);
user.setAtivo(true);

System.out.println(user.getNome());  // Getter → "João Silva"
System.out.println(user.isAtivo());  // → true
```

**Benefícios**:
- **Interoperabilidade**: Frameworks (Spring, Hibernate, JSF) reconhecem e manipulam JavaBeans automaticamente
- **Ferramentas de Design**: IDEs podem gerar código automaticamente
- **Reflexão**: Frameworks usam reflection para acessar propriedades
- **Consistência**: Código padronizado e previsível

---

## 10 Fundamentos Teóricos

### 1. Definição de JavaBean

Um **JavaBean** é uma classe Java que segue **convenções específicas**:

1. **Classe pública**
2. **Construtor público sem argumentos**
3. **Atributos privados**
4. **Getters e setters públicos** seguindo convenção de nomenclatura
5. **(Opcional) Implementar Serializable**

```java
// ✅ JavaBean válido
public class Produto implements Serializable {
    private static final long serialVersionUID = 1L;

    private String nome;
    private double preco;

    // Construtor sem argumentos OBRIGATÓRIO
    public Produto() { }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }
}

// ❌ NÃO é JavaBean (sem construtor vazio)
public class ProdutoInvalido {
    private String nome;

    // Apenas construtor com parâmetros
    public ProdutoInvalido(String nome) {
        this.nome = nome;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
```

---

### 2. Construtor Público Sem Argumentos (No-Args Constructor)

**Regra Fundamental**: JavaBeans **devem ter** um construtor público sem argumentos.

```java
public class Cliente {
    private String nome;
    private String email;

    // ✅ OBRIGATÓRIO: construtor vazio público
    public Cliente() { }

    // ✅ OPCIONAL: pode ter outros construtores também
    public Cliente(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    // Getters e Setters...
}
```

**Por que é obrigatório?**
- **Frameworks de reflexão**: Spring, Hibernate, Jackson usam `Class.newInstance()` ou `Constructor.newInstance()` que requerem construtor vazio
- **Deserialização**: Bibliotecas de serialização (JSON, XML) criam instância vazia e depois populam via setters
- **Ferramentas de UI**: Construtores de GUI precisam instanciar beans sem parâmetros

**Exemplo de Uso por Framework**:
```java
// Framework cria instância (via reflection)
Usuario user = Usuario.class.getDeclaredConstructor().newInstance();

// Framework popula propriedades via setters
user.setNome("Maria");
user.setIdade(25);
```

---

### 3. Atributos Privados (Encapsulamento)

**Regra**: Atributos de um JavaBean devem ser **`private`** para garantir encapsulamento.

```java
public class Pessoa {
    // ✅ CORRETO: atributos privados
    private String nome;
    private int idade;
    private String cpf;

    // ❌ INCORRETO: atributos públicos quebram encapsulamento
    // public String endereco;  // Não é JavaBean padrão!

    public Pessoa() { }

    // Acesso controlado via getters/setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        // Validação centralizada
        if (!validarCpf(cpf)) {
            throw new IllegalArgumentException("CPF inválido");
        }
        this.cpf = cpf;
    }

    private boolean validarCpf(String cpf) {
        return cpf != null && cpf.matches("\\d{11}");
    }
}
```

**Benefícios**:
- **Validação**: Setters podem validar valores antes de atribuir
- **Controle**: Pode tornar atributo read-only (sem setter)
- **Mudança interna**: Implementação pode mudar sem afetar código externo

---

### 4. Propriedades (Properties)

Em JavaBeans, **propriedades** são atributos acessíveis via getters/setters, não os atributos em si.

**Propriedade = Par de Getter/Setter**

```java
public class Livro {
    private String titulo;          // Campo privado
    private String autor;
    private int numeroPaginas;

    public Livro() { }

    // Propriedade "titulo" (read-write)
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    // Propriedade "autor" (read-write)
    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    // Propriedade "numeroPaginas" (read-only: só getter)
    public int getNumeroPaginas() {
        return numeroPaginas;
    }

    // Sem setter → propriedade read-only
}
```

**Tipos de Propriedades**:
- **Read-Write**: Getter + Setter
- **Read-Only**: Apenas Getter
- **Write-Only**: Apenas Setter (raro)

**Propriedade Calculada** (sem campo correspondente):
```java
public class Retangulo {
    private double largura;
    private double altura;

    public Retangulo() { }

    public double getLargura() { return largura; }
    public void setLargura(double largura) { this.largura = largura; }

    public double getAltura() { return altura; }
    public void setAltura(double altura) { this.altura = altura; }

    // Propriedade calculada "area" (read-only)
    public double getArea() {
        return largura * altura;  // Calculada, não armazenada
    }
}
```

---

### 5. Convenção de Nomenclatura

**Regras de Nomenclatura JavaBeans**:

| Tipo de Propriedade | Padrão de Método         | Exemplo                 |
|---------------------|--------------------------|-------------------------|
| Getter (não-boolean) | `get` + Propriedade (Pascal) | `getNome()`           |
| Setter (não-boolean) | `set` + Propriedade (Pascal) | `setNome(String)`     |
| Getter (boolean)     | `is` + Propriedade (Pascal)  | `isAtivo()`           |
| Setter (boolean)     | `set` + Propriedade (Pascal) | `setAtivo(boolean)`   |

```java
public class Exemplo {
    private String nomeCompleto;     // Campo em camelCase
    private boolean ativo;
    private int idade;

    public Exemplo() { }

    // ✅ CORRETO: getNomeCompleto (capitaliza primeira letra de "nomeCompleto")
    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    // ✅ CORRETO: isAtivo (boolean usa "is")
    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    // ✅ CORRETO: getIdade
    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    // ❌ INCORRETO: não segue padrão
    // public String obterNome() { return nomeCompleto; }
    // public void alterarNome(String n) { this.nomeCompleto = n; }
}
```

**Frameworks esperam exatamente esse padrão**:
- **Spring**: Injeta dependências via setters
- **Jackson/Gson**: Serializa JSON via getters
- **Hibernate**: Mapeia propriedades via convenção

---

### 6. Serialização (Serializable)

**Opcional mas Recomendado**: JavaBeans podem implementar `Serializable` para permitir serialização.

```java
import java.io.Serializable;

public class Funcionario implements Serializable {
    // serialVersionUID: identifica versão da classe
    private static final long serialVersionUID = 1L;

    private String nome;
    private double salario;
    private transient String senha;  // transient: não será serializado

    public Funcionario() { }

    // Getters e Setters...
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public double getSalario() { return salario; }
    public void setSalario(double salario) { this.salario = salario; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}
```

**Uso de Serialização**:
```java
// Serializar (salvar em arquivo)
Funcionario func = new Funcionario();
func.setNome("Ana");
func.setSalario(5000);
func.setSenha("secreta");

try (ObjectOutputStream out = new ObjectOutputStream(
        new FileOutputStream("funcionario.ser"))) {
    out.writeObject(func);
}

// Deserializar (ler de arquivo)
try (ObjectInputStream in = new ObjectInputStream(
        new FileInputStream("funcionario.ser"))) {
    Funcionario funcRestaurado = (Funcionario) in.readObject();
    System.out.println(funcRestaurado.getNome());  // "Ana"
    System.out.println(funcRestaurado.getSenha()); // null (transient)
}
```

---

### 7. Uso com Frameworks (Spring, Hibernate)

**Spring**: Injeta dependências via setters

```java
public class UserService {
    private UserRepository repository;

    public UserService() { }  // Construtor vazio para Spring

    // Spring injeta via setter
    public void setRepository(UserRepository repository) {
        this.repository = repository;
    }

    public UserRepository getRepository() {
        return repository;
    }
}

// Configuração Spring XML (exemplo clássico)
<bean id="userService" class="com.exemplo.UserService">
    <property name="repository" ref="userRepository"/>
    <!-- Spring chama setRepository() -->
</bean>
```

**Hibernate**: Mapeia propriedades JavaBeans para colunas

```java
@Entity
@Table(name = "usuarios")
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;

    public Usuario() { }  // OBRIGATÓRIO para Hibernate

    // Hibernate usa getters/setters para acesso
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
```

---

### 8. Reflexão e Introspecção (Introspection)

**Java Introspection API**: Permite inspecionar propriedades de JavaBeans em tempo de execução.

```java
import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;

public class BeanIntrospectionExample {
    public static void main(String[] args) throws Exception {
        // Obter informações do bean
        BeanInfo info = Introspector.getBeanInfo(Usuario.class);

        // Listar todas as propriedades
        for (PropertyDescriptor pd : info.getPropertyDescriptors()) {
            System.out.println("Propriedade: " + pd.getName());
            System.out.println("  Tipo: " + pd.getPropertyType());
            System.out.println("  Getter: " + pd.getReadMethod());
            System.out.println("  Setter: " + pd.getWriteMethod());
        }
    }
}
```

**Saída**:
```
Propriedade: ativo
  Tipo: boolean
  Getter: public boolean Usuario.isAtivo()
  Setter: public void Usuario.setAtivo(boolean)
Propriedade: idade
  Tipo: int
  Getter: public int Usuario.getIdade()
  Setter: public void Usuario.setIdade(int)
Propriedade: nome
  Tipo: class java.lang.String
  Getter: public String Usuario.getNome()
  Setter: public void Usuario.setNome(java.lang.String)
```

**Uso em Frameworks**: Hibernate, Spring usam Introspection para descobrir propriedades e manipular beans automaticamente.

---

### 9. JavaBeans vs POJOs (Plain Old Java Objects)

**POJO**: Qualquer classe Java simples, sem dependências de frameworks.

**JavaBean**: POJO que segue convenções específicas (construtor vazio, getters/setters, etc).

```java
// POJO (mas NÃO é JavaBean - falta construtor vazio)
public class Pessoa {
    private final String nome;
    private final int idade;

    public Pessoa(String nome, int idade) {  // Sem construtor vazio
        this.nome = nome;
        this.idade = idade;
    }

    public String getNome() { return nome; }
    public int getIdade() { return idade; }
    // Sem setters (imutável)
}

// JavaBean (segue todas as convenções)
public class PessoaBean {
    private String nome;
    private int idade;

    public PessoaBean() { }  // Construtor vazio

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public int getIdade() { return idade; }
    public void setIdade(int idade) { this.idade = idade; }
}
```

**Todo JavaBean é um POJO, mas nem todo POJO é um JavaBean.**

---

### 10. Limitações e Críticas ao Padrão JavaBeans

**Desvantagens**:

1. **Verbosidade**: Muito código boilerplate (getters/setters repetitivos)
2. **Mutabilidade**: Incentiva objetos mutáveis (setters), dificultando thread-safety
3. **Construtor vazio**: Permite objetos em estados inválidos

```java
// ❌ Problema: JavaBean pode estar em estado inválido
Usuario user = new Usuario();  // Criado sem dados
// user.nome == null, user.email == null (estado inválido!)

// Mais tarde:
user.setNome("João");
user.setEmail("joao@example.com");
// Agora está válido, mas passou por estado inconsistente
```

**Alternativas Modernas**:

**Records (Java 14+)**: Substitui JavaBeans para DTOs imutáveis
```java
// Record: conciso, imutável
public record Usuario(String nome, int idade, boolean ativo) { }

// Uso:
Usuario user = new Usuario("João", 30, true);
System.out.println(user.nome());  // Getter automático
// user.setNome("Pedro");  // ❌ ERRO: Records são imutáveis
```

**Lombok**: Reduz boilerplate em JavaBeans
```java
import lombok.Data;

@Data  // Gera getters, setters, equals, hashCode, toString
public class Usuario {
    private String nome;
    private int idade;
    private boolean ativo;
}
```

**Builder Pattern**: Cria objetos complexos de forma fluente
```java
public class Usuario {
    private final String nome;
    private final String email;
    private final int idade;

    private Usuario(Builder builder) {
        this.nome = builder.nome;
        this.email = builder.email;
        this.idade = builder.idade;
    }

    public static class Builder {
        private String nome;
        private String email;
        private int idade;

        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder idade(int idade) {
            this.idade = idade;
            return this;
        }

        public Usuario build() {
            return new Usuario(this);
        }
    }
}

// Uso:
Usuario user = new Usuario.Builder()
    .nome("João")
    .email("joao@example.com")
    .idade(30)
    .build();
```

---

## Aplicabilidade

### Quando Usar JavaBeans

**Cenários Ideais**:
- **Integração com frameworks**: Spring, Hibernate, JSF que esperam JavaBeans
- **Serialização**: Objetos que precisam ser serializados/deserializados
- **Ferramentas de UI**: Componentes de interface gráfica (Swing, JavaFX)
- **Configuração**: Arquivos de configuração (XML, properties) mapeados para objetos
- **DTOs (Data Transfer Objects)**: Transferir dados entre camadas (com ressalvas)

### Quando NÃO Usar JavaBeans

**Evite JavaBeans quando**:
- **Imutabilidade é necessária**: Use Records ou classes imutáveis
- **Thread-safety é crítica**: Objetos mutáveis (setters) complicam concorrência
- **Lógica complexa de validação**: Use Builder pattern ou construtores validadores
- **Domain Models ricos**: Modelos de domínio devem ter comportamento, não apenas getters/setters

---

## Boas Práticas

### 1. Sempre Forneça Construtor Vazio

```java
public class Produto {
    public Produto() { }  // ✅ Obrigatório

    public Produto(String nome, double preco) {  // ✅ Construtores adicionais OK
        this.nome = nome;
        this.preco = preco;
    }
}
```

### 2. Implemente Serializable Quando Apropriado

```java
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
}
```

### 3. Siga Convenção de Nomenclatura Rigorosamente

```java
// ✅ CORRETO
public String getNome() { }
public void setNome(String nome) { }
public boolean isAtivo() { }

// ❌ INCORRETO
public String obterNome() { }
public void alterarNome(String nome) { }
public boolean getAtivo() { }  // Boolean deve usar "is"
```

### 4. Valide em Setters

```java
public void setIdade(int idade) {
    if (idade < 0 || idade > 150) {
        throw new IllegalArgumentException("Idade inválida");
    }
    this.idade = idade;
}
```

### 5. Use Records Para DTOs Simples (Java 14+)

```java
// Em vez de JavaBean verboso, use Record
public record UsuarioDTO(Long id, String nome, String email) { }
```

---

## Resumo Executivo

**JavaBeans** é um padrão que define:
- **Construtor público sem argumentos** (obrigatório)
- **Atributos privados**
- **Getters e setters públicos** seguindo convenção de nomenclatura
- **Nomenclatura**: `get/set` + Propriedade (Pascal), `is` para boolean
- **Serializable** (opcional mas comum)

**Benefícios**:
- **Interoperabilidade** com frameworks (Spring, Hibernate, Jackson)
- **Ferramentas de reflexão** podem manipular propriedades automaticamente
- **Padronização** de acesso a atributos

**Desvantagens**:
- **Verbosidade** (muito código boilerplate)
- **Mutabilidade** (setters permitem mudanças, problemas de concorrência)
- **Estados inválidos** (construtor vazio permite objetos incompletos)

**Alternativas Modernas**:
- **Records** (Java 14+): DTOs imutáveis concisos
- **Lombok**: Reduz boilerplate com anotações
- **Builder Pattern**: Cria objetos complexos de forma fluente

**Regra de Ouro**: Use JavaBeans quando frameworks esperam (Spring, Hibernate), mas **prefira Records ou classes imutáveis** para domain models e DTOs simples.
