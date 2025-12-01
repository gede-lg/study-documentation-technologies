# T3.07 - Geração Automática de Getters/Setters por IDEs

## Introdução

IDEs modernas geram getters/setters **automaticamente**, economizando tempo e evitando erros. Principais IDEs: **Eclipse**, **IntelliJ IDEA**, **VS Code**, **NetBeans**.

**Benefícios**:
- **Velocidade**: Gera código em segundos
- **Convenção correta**: Segue padrão JavaBeans
- **Sem erros**: Nomenclatura e sintaxe corretas
- **Produtividade**: Foco em lógica, não boilerplate

---

## Fundamentos

### 1. IntelliJ IDEA

**Método 1: Atalho**
```
1. Posicione cursor na classe
2. Alt + Insert (Windows/Linux)
3. Cmd + N (Mac)
4. Selecione "Getter and Setter"
5. Escolha atributos
6. OK
```

**Método 2: Menu**
```
Code → Generate → Getter and Setter
```

**Método 3: Refactor**
```
1. Clique direito no atributo
2. Refactor → Encapsulate Fields
3. Gera getters/setters e torna atributo privado
```

**Exemplo**:
```java
// Antes
public class Usuario {
    private String nome;
    private int idade;
    private boolean ativo;
}

// Alt+Insert → Getter and Setter → Selecionar todos
// Depois (gerado automaticamente)
public class Usuario {
    private String nome;
    private int idade;
    private boolean ativo;

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

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
```

### 2. Eclipse

**Atalho**:
```
1. Clique direito na classe
2. Source → Generate Getters and Setters
3. Selecione atributos
4. OK
```

**Ou**:
```
Alt + Shift + S → R (Generate Getters and Setters)
```

**Opções**:
- Gerar apenas getters
- Gerar apenas setters
- Escolher ponto de inserção
- Gerar comentários Javadoc

### 3. VS Code (com extensões Java)

**Extensão necessária**: Java Extension Pack

**Atalho**:
```
1. Clique direito na classe
2. Source Action → Generate Getters and Setters
```

**Ou**:
```
Ctrl + Shift + P → "Generate Getters and Setters"
```

### 4. NetBeans

**Atalho**:
```
1. Clique direito no código
2. Insert Code (Alt + Insert)
3. Getter and Setter
4. Selecione atributos
```

### 5. Lombok: Alternativa à Geração Manual

**Anotações Lombok** eliminam necessidade de getters/setters:

```java
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Usuario {
    private String nome;
    private int idade;
    private boolean ativo;
}

// Lombok gera getters/setters em tempo de compilação
// Código fica limpo, sem boilerplate
```

**Anotação `@Data`** (gera tudo):
```java
import lombok.Data;

@Data
public class Usuario {
    private String nome;
    private int idade;
    private boolean ativo;
}
// Gera: getters, setters, equals, hashCode, toString
```

**Controle fino**:
```java
import lombok.Getter;
import lombok.Setter;
import lombok.AccessLevel;

public class Usuario {
    @Getter @Setter
    private String nome;

    @Getter  // Apenas getter (read-only)
    private final Long id;

    @Getter
    @Setter(AccessLevel.PROTECTED)  // Setter protegido
    private String senha;

    public Usuario(Long id) {
        this.id = id;
    }
}
```

### 6. Records (Java 14+): Substitui Getters

**Records** são classes imutáveis com getters automáticos:

```java
// ✅ Record: conciso
public record Usuario(String nome, int idade, boolean ativo) {}

// Gera automaticamente:
// - Construtor
// - Getters (nome(), idade(), ativo())
// - equals(), hashCode(), toString()
```

**Uso**:
```java
Usuario user = new Usuario("João", 30, true);
System.out.println(user.nome());   // Getter automático
System.out.println(user.idade());  // 30
System.out.println(user.ativo());  // true
```

**Sem setters**: Records são **imutáveis**.

### 7. Configurações de Geração

**IntelliJ IDEA**:
```
File → Settings → Editor → Code Style → Java → Code Generation

Opções:
- Prefixo de campo (nenhum ou "_")
- Template de getter/setter
- Comentários Javadoc
- Final parameters
```

**Eclipse**:
```
Window → Preferences → Java → Code Style

Opções:
- Convenção de nomenclatura
- Ordem de geração
- Comentários
```

### 8. Templates Customizados

**IntelliJ IDEA**: Customize templates

```java
// Template padrão
public ${TYPE} get${NAME}() {
    return ${FIELD};
}

// Template com validação
public void set${NAME}(${TYPE} ${PARAM}) {
    if (${PARAM} == null) {
        throw new IllegalArgumentException("${NAME} não pode ser nulo");
    }
    this.${FIELD} = ${PARAM};
}
```

### 9. Geração Seletiva

**Gerar apenas getters** (propriedades read-only):
```java
public class Pedido {
    private final Long id;
    private LocalDateTime dataCriacao;

    public Pedido(Long id) {
        this.id = id;
        this.dataCriacao = LocalDateTime.now();
    }

    // Apenas getters (sem setters)
    public Long getId() {
        return id;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }
}
```

### 10. Refatoração: Adicionar Getters/Setters Depois

**Cenário**: Atributo público → privado com getters/setters

```java
// Antes
public class Usuario {
    public String nome;  // Público
}

// IntelliJ: Refactor → Encapsulate Fields
// Depois
public class Usuario {
    private String nome;  // Privado

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
```

---

## Aplicabilidade

**Use geração automática quando**:
- Criando **JavaBeans** padrão
- Muitos atributos para gerar manualmente
- Convenção JavaBeans obrigatória
- Projeto sem Lombok

**Use Lombok quando**:
- Reduzir boilerplate
- Código limpo e conciso
- Equipe familiarizada com Lombok

**Use Records quando**:
- DTOs imutáveis
- Java 14+ disponível
- Não precisa de setters

---

## Armadilhas

### 1. Gerar Setters Para Atributos Final

```java
// ❌ Não gere setter para final
private final Long id;

// public void setId(Long id) {  // ERRO: final não pode ser alterado
//     this.id = id;
// }
```

### 2. Sobrescrever Getters/Setters Customizados

**Cuidado**: Geração pode sobrescrever validações customizadas.

```java
// Antes (com validação)
public void setIdade(int idade) {
    if (idade < 0 || idade > 150) {
        throw new IllegalArgumentException("Idade inválida");
    }
    this.idade = idade;
}

// Depois (IDE gera sem validação)
public void setIdade(int idade) {
    this.idade = idade;  // Perdeu validação!
}
```

**Solução**: Gere primeiro, adicione validações depois.

### 3. Lombok Requer Configuração

**Plugin necessário**: Instale plugin Lombok na IDE.

```
IntelliJ: File → Settings → Plugins → "Lombok"
Eclipse: Marketplace → "Lombok"
```

---

## Boas Práticas

### 1. Gere Após Definir Atributos

```java
// 1. Defina atributos
private String nome;
private int idade;

// 2. Gere getters/setters (IDE)
// 3. Adicione validações se necessário
```

### 2. Revise Código Gerado

Sempre **revise** código gerado:
- Nomenclatura correta?
- Boolean usa `is`?
- Precisa validação?

### 3. Use Lombok Para Código Limpo

```java
@Getter @Setter
public class Usuario {
    private String nome;
    private int idade;
}
// Código 70% menor
```

### 4. Records Para DTOs

```java
// DTO simples → use Record
public record UsuarioDTO(Long id, String nome, String email) {}

// Classe complexa → use classe normal
```

---

## Resumo

**Geração Automática**:

**IntelliJ IDEA**: `Alt + Insert` → Getter and Setter

**Eclipse**: `Alt + Shift + S` → `R`

**VS Code**: `Ctrl + Shift + P` → Generate Getters and Setters

**Lombok** (alternativa):
```java
@Getter @Setter
public class Usuario {
    private String nome;
}
```

**Records** (Java 14+):
```java
public record Usuario(String nome, int idade) {}
// Getters automáticos: nome(), idade()
```

**Benefícios**:
- Economia de tempo
- Convenção correta
- Menos erros
- Código padronizado

**Atenção**:
- Revise código gerado
- Adicione validações
- Não gere setter para `final`
- Configure IDE conforme preferências

**Regra de Ouro**: Use ferramentas para gerar boilerplate, foque em lógica de negócio.
