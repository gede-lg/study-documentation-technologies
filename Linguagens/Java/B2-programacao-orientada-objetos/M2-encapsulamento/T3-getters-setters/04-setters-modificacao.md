# T3.04 - Setters Para Modificação de Atributos

## Introdução e Definição

**Setters** (ou **métodos modificadores/mutators**) são métodos públicos que permitem **modificar** o valor de atributos privados de uma classe. Complementam os getters no padrão de encapsulamento, fornecendo **escrita controlada** aos dados internos.

**Definição**: Um setter é um método que:
- **Recebe um parâmetro** do mesmo tipo do atributo
- **Atribui** esse valor ao atributo privado
- Tem visibilidade **`public`** (geralmente)
- **Retorna `void`** (não retorna valor)
- Segue convenção de nomenclatura: `set` + NomeDoAtributo
- **(Opcional) Valida** o valor antes de atribuir

**Exemplo Básico**:
```java
public class Pessoa {
    private String nome;  // Atributo privado
    private int idade;

    // Setter: permite MODIFICAR o nome
    public void setNome(String nome) {
        this.nome = nome;  // Atribui valor ao atributo
    }

    // Setter: permite MODIFICAR a idade
    public void setIdade(int idade) {
        this.idade = idade;
    }

    // Getters...
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
}

// Uso:
Pessoa p = new Pessoa();
// p.nome = "João";  // ❌ ERRO: nome é privado

// ✅ Modificação via setter
p.setNome("João");  // Escrita controlada
p.setIdade(30);

System.out.println(p.getNome());  // "João"
```

**Por Que Usar Setters?**
- **Encapsulamento**: Controle sobre como atributos são modificados
- **Validação**: Verificar valores antes de atribuir (idade negativa, email inválido, etc.)
- **Lógica de negócio**: Executar ações quando atributo muda
- **Notificação**: Disparar eventos quando valor é modificado
- **Logging/Debug**: Rastrear mudanças
- **Conversão**: Transformar valor antes de armazenar

---

## 10 Fundamentos Teóricos

### 1. Estrutura Básica de um Setter

**Sintaxe**:
```java
public void setNomeDoAtributo(TipoDoParametro nomeDoParametro) {
    this.nomeDoAtributo = nomeDoParametro;
}
```

**Componentes**:
1. **Modificador de acesso**: `public` (geralmente)
2. **Tipo de retorno**: `void` (setters não retornam valor)
3. **Nome do método**: `set` + NomeDoAtributo (primeira letra maiúscula)
4. **Parâmetro**: Um parâmetro do tipo do atributo
5. **Corpo**: Atribui parâmetro ao atributo (geralmente com `this`)

```java
public class Produto {
    private String nome;
    private double preco;
    private int quantidade;

    // Setter para String
    public void setNome(String nome) {
        this.nome = nome;  // "this" distingue atributo de parâmetro
    }

    // Setter para double
    public void setPreco(double preco) {
        this.preco = preco;
    }

    // Setter para int
    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }
}
```

---

### 2. Uso de `this` Para Desambiguar

**Problema**: Parâmetro geralmente tem o **mesmo nome** que o atributo.

```java
public class Exemplo {
    private String valor;

    // Parâmetro "valor" tem mesmo nome que atributo
    public void setValor(String valor) {
        this.valor = valor;  // "this.valor" = atributo, "valor" = parâmetro
    }

    // ❌ SEM "this": atribui parâmetro a ele mesmo (não muda atributo)
    public void setValorErrado(String valor) {
        valor = valor;  // Atribui parâmetro a parâmetro! Não afeta this.valor
    }
}
```

**Regra**: Sempre use `this.atributo` quando parâmetro tem mesmo nome.

**Alternativa** (parâmetro com nome diferente):
```java
public void setNome(String novoNome) {
    nome = novoNome;  // "this" opcional quando nomes são diferentes
}

// Mas convenção JavaBeans prefere mesmo nome + this
public void setNome(String nome) {
    this.nome = nome;  // ✅ Preferido
}
```

---

### 3. Setters Para Tipos Primitivos

```java
public class Configuracao {
    private int porta;
    private double taxa;
    private boolean ativo;
    private long timestamp;
    private char tipo;

    public void setPorta(int porta) {
        this.porta = porta;
    }

    public void setTaxa(double taxa) {
        this.taxa = taxa;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public void setTipo(char tipo) {
        this.tipo = tipo;
    }
}
```

---

### 4. Setters Para Tipos de Referência

```java
import java.time.LocalDate;
import java.math.BigDecimal;

public class Funcionario {
    private String nome;
    private LocalDate dataContratacao;
    private BigDecimal salario;
    private Endereco endereco;

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setDataContratacao(LocalDate dataContratacao) {
        this.dataContratacao = dataContratacao;
    }

    public void setSalario(BigDecimal salario) {
        this.salario = salario;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }
}
```

---

### 5. Setters Para Coleções

**Problema**: Aceitar coleção externa diretamente pode expor referência interna.

#### Abordagem 1: Atribuir Diretamente (Simples mas Arriscado)

```java
public class Pedido {
    private List<String> itens;

    // ❌ ARRISCADO: aceita referência externa
    public void setItens(List<String> itens) {
        this.itens = itens;  // Referência compartilhada!
    }
}

// Problema:
List<String> lista = new ArrayList<>();
lista.add("Item 1");

Pedido pedido = new Pedido();
pedido.setItens(lista);

lista.add("Item 2");  // ❌ Modifica lista interna do pedido!
```

#### Abordagem 2: Defensive Copy (Cópia Defensiva)

```java
public class Pedido {
    private List<String> itens = new ArrayList<>();

    // ✅ BOM: cria cópia
    public void setItens(List<String> itens) {
        if (itens != null) {
            this.itens = new ArrayList<>(itens);  // Cópia
        } else {
            this.itens = new ArrayList<>();
        }
    }
}

// Uso:
List<String> lista = new ArrayList<>();
lista.add("Item 1");

Pedido pedido = new Pedido();
pedido.setItens(lista);

lista.add("Item 2");  // ✅ Não afeta pedido (cópia foi feita)
```

#### Abordagem 3: Métodos de Adição/Remoção

```java
public class Pedido {
    private List<String> itens = new ArrayList<>();

    // ✅ MELHOR: métodos específicos em vez de setter
    public void adicionarItem(String item) {
        if (item != null && !item.isBlank()) {
            itens.add(item);
        }
    }

    public void removerItem(String item) {
        itens.remove(item);
    }

    public void limparItens() {
        itens.clear();
    }

    // Getter retorna cópia
    public List<String> getItens() {
        return new ArrayList<>(itens);
    }
}
```

---

### 6. Setters Com Validação

**Fundamental**: Setters devem **validar** valores antes de atribuir.

```java
public class Pessoa {
    private String nome;
    private int idade;
    private String email;

    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        this.nome = nome.trim();
    }

    public void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
        this.idade = idade;
    }

    public void setEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
        this.email = email.toLowerCase();
    }
}
```

**Uso**:
```java
Pessoa p = new Pessoa();
p.setNome("João");     // ✅ OK
p.setIdade(30);        // ✅ OK
p.setEmail("joao@example.com");  // ✅ OK

// p.setNome("");      // ❌ Lança IllegalArgumentException
// p.setIdade(-5);     // ❌ Lança IllegalArgumentException
// p.setEmail("invalido");  // ❌ Lança IllegalArgumentException
```

---

### 7. Setters e Imutabilidade (Read-Only Properties)

**Classes Imutáveis**: Não possuem setters, atributos definidos no construtor.

```java
public final class Pessoa {
    private final String nome;  // final: apenas atribuído no construtor
    private final LocalDate dataNascimento;

    public Pessoa(String nome, LocalDate dataNascimento) {
        this.nome = nome;
        this.dataNascimento = dataNascimento;
    }

    // ✅ Apenas getters (read-only)
    public String getNome() {
        return nome;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    // ❌ SEM SETTERS (imutável)
}
```

**Benefícios de Imutabilidade**:
- **Thread-safety**: Seguro em ambientes concorrentes
- **Simplicidade**: Não há mudanças de estado
- **Segurança**: Não pode ser modificado acidentalmente

---

### 8. Setters com Efeitos Colaterais (Side Effects)

Setters podem executar **lógica adicional** além de atribuir valor.

```java
public class Usuario {
    private String senha;
    private LocalDateTime dataUltimaAlteracao;

    public void setSenha(String senha) {
        if (senha == null || senha.length() < 8) {
            throw new IllegalArgumentException("Senha deve ter pelo menos 8 caracteres");
        }
        
        // Efeito colateral 1: Hash da senha
        this.senha = hashSenha(senha);
        
        // Efeito colateral 2: Atualiza timestamp
        this.dataUltimaAlteracao = LocalDateTime.now();
        
        // Efeito colateral 3: Log
        System.out.println("Senha alterada em " + dataUltimaAlteracao);
    }

    private String hashSenha(String senha) {
        // Simulação de hash (use BCrypt em produção!)
        return "HASH_" + senha.hashCode();
    }
}
```

**Outro Exemplo: Notificação de Mudança**
```java
public class Configuracao {
    private String tema;
    private List<ConfigListener> listeners = new ArrayList<>();

    public void setTema(String tema) {
        if (tema == null || tema.isBlank()) {
            throw new IllegalArgumentException("Tema inválido");
        }
        
        String temaAntigo = this.tema;
        this.tema = tema;
        
        // Notifica listeners de mudança
        notificarMudanca(temaAntigo, tema);
    }

    public void adicionarListener(ConfigListener listener) {
        listeners.add(listener);
    }

    private void notificarMudanca(String temaAntigo, String temaNovo) {
        for (ConfigListener listener : listeners) {
            listener.onTemaAlterado(temaAntigo, temaNovo);
        }
    }
}

interface ConfigListener {
    void onTemaAlterado(String temaAntigo, String temaNovo);
}
```

---

### 9. Setters Fluentes (Fluent Setters / Builder Pattern)

**Padrão Alternativo**: Setter retorna `this` para permitir encadeamento.

**⚠️ Atenção**: Viola convenção JavaBeans padrão (setters retornam `void`).

```java
public class Usuario {
    private String nome;
    private String email;
    private int idade;

    // ✅ Setters fluentes: retornam "this"
    public Usuario setNome(String nome) {
        this.nome = nome;
        return this;  // Retorna própria instância
    }

    public Usuario setEmail(String email) {
        this.email = email;
        return this;
    }

    public Usuario setIdade(int idade) {
        this.idade = idade;
        return this;
    }

    // Getters normais
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public int getIdade() { return idade; }
}

// Uso: encadeamento (method chaining)
Usuario user = new Usuario()
    .setNome("João")
    .setEmail("joao@example.com")
    .setIdade(30);
```

**Vantagens**:
- **API fluente**: Código mais legível
- **Menos linhas**: Chamadas encadeadas

**Desvantagens**:
- **Não é JavaBean padrão**: Frameworks podem não reconhecer
- **Mutabilidade**: Incentiva objetos mutáveis

**Alternativa: Builder Pattern**
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

    // Apenas getters (imutável)
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public int getIdade() { return idade; }
}

// Uso:
Usuario user = new Usuario.Builder()
    .nome("João")
    .email("joao@example.com")
    .idade(30)
    .build();
```

---

### 10. Setters e Herança (Sobrescrita de Setters)

Setters podem ser **sobrescritos** em subclasses para adicionar validação/comportamento.

```java
public class Funcionario {
    protected double salario;

    public void setSalario(double salario) {
        if (salario < 0) {
            throw new IllegalArgumentException("Salário não pode ser negativo");
        }
        this.salario = salario;
    }

    public double getSalario() {
        return salario;
    }
}

public class Gerente extends Funcionario {
    private static final double SALARIO_MINIMO_GERENTE = 5000.0;

    @Override
    public void setSalario(double salario) {
        // Validação adicional: gerente tem salário mínimo
        if (salario < SALARIO_MINIMO_GERENTE) {
            throw new IllegalArgumentException(
                "Salário de gerente deve ser pelo menos R$ " + SALARIO_MINIMO_GERENTE
            );
        }
        super.setSalario(salario);  // Chama validação da superclasse
    }
}
```

**Uso**:
```java
Funcionario func = new Funcionario();
func.setSalario(3000);  // ✅ OK

Gerente gerente = new Gerente();
// gerente.setSalario(3000);  // ❌ Lança exceção (abaixo do mínimo)
gerente.setSalario(7000);      // ✅ OK
```

---

## Aplicabilidade

### Quando Criar Setters

**Crie setters quando**:
- Atributos **privados** precisam ser modificados externamente
- Classe é **JavaBean** (para frameworks como Spring, Hibernate)
- **DTOs** (Data Transfer Objects) mutáveis
- Precisa **validar** valores antes de atribuir
- **Configurações** que podem mudar durante execução

### Quando NÃO Criar Setters

**Evite setters quando**:
- Atributo é **constante** (use `final`)
- Classe deve ser **imutável** (segurança, thread-safety)
- Propriedade é **calculada** (sem campo correspondente)
- Modificação direta **viola regras de negócio**

```java
// ❌ EVITAR setter para coleção
public void setItens(List<Item> itens) {
    this.itens = itens;
}

// ✅ MELHOR: métodos de domínio específicos
public void adicionarItem(Item item) {
    if (item == null) {
        throw new IllegalArgumentException();
    }
    this.itens.add(item);
}

public void removerItem(Item item) {
    this.itens.remove(item);
}
```

---

## Armadilhas Comuns

### 1. Setter Sem Validação

```java
// ❌ RUIM: aceita valores inválidos
public void setIdade(int idade) {
    this.idade = idade;  // Aceita idade negativa!
}

// ✅ BOM: valida
public void setIdade(int idade) {
    if (idade < 0 || idade > 150) {
        throw new IllegalArgumentException("Idade inválida: " + idade);
    }
    this.idade = idade;
}
```

### 2. Esquecer `this` Com Mesmo Nome de Parâmetro

```java
// ❌ ERRO: não usa "this"
public void setNome(String nome) {
    nome = nome;  // Atribui parâmetro a ele mesmo!
}

// ✅ CORRETO
public void setNome(String nome) {
    this.nome = nome;
}
```

### 3. Setter Retornando Valor (Não é JavaBean Padrão)

```java
// ❌ INCORRETO para JavaBeans
public String setNome(String nome) {
    this.nome = nome;
    return nome;
}

// ✅ CORRETO
public void setNome(String nome) {
    this.nome = nome;
}
```

### 4. Aceitar Coleções Sem Defensive Copy

```java
// ❌ RUIM: compartilha referência
public void setItens(List<String> itens) {
    this.itens = itens;
}

// ✅ BOM: cópia defensiva
public void setItens(List<String> itens) {
    this.itens = new ArrayList<>(itens);
}
```

---

## Boas Práticas

### 1. Sempre Valide Parâmetros

```java
public void setEmail(String email) {
    if (email == null || !email.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$")) {
        throw new IllegalArgumentException("Email inválido");
    }
    this.email = email;
}
```

### 2. Use `this` Para Clareza

```java
public void setNome(String nome) {
    this.nome = nome;  // Sempre use "this"
}
```

### 3. Normalize/Formate Valores

```java
public void setNome(String nome) {
    if (nome != null) {
        this.nome = nome.trim();  // Remove espaços
    } else {
        this.nome = null;
    }
}

public void setCpf(String cpf) {
    if (cpf != null) {
        this.cpf = cpf.replaceAll("[^0-9]", "");  // Remove formatação
    }
}
```

### 4. Prefira Imutabilidade Quando Possível

```java
// ✅ BOM: classe imutável (sem setters)
public final class Pessoa {
    private final String nome;
    private final int idade;

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    public String getNome() { return nome; }
    public int getIdade() { return idade; }
}
```

### 5. Documente Validações e Efeitos Colaterais

```java
/**
 * Define a senha do usuário.
 * 
 * @param senha nova senha (mínimo 8 caracteres)
 * @throws IllegalArgumentException se senha for inválida
 */
public void setSenha(String senha) {
    if (senha == null || senha.length() < 8) {
        throw new IllegalArgumentException("Senha deve ter pelo menos 8 caracteres");
    }
    this.senha = hashSenha(senha);
}
```

---

## Resumo Executivo

**Setters** permitem **modificação controlada** de atributos privados:

**Estrutura Básica**:
```java
public void setNomeAtributo(TipoParametro nomeParametro) {
    this.nomeAtributo = nomeParametro;
}
```

**Características**:
- Retornam **`void`**
- Recebem **um parâmetro**
- Usam **`this`** para desambiguar
- Devem **validar** valores

**Tipos de Setters**:
- **Simples**: Atribuição direta
- **Com Validação**: Verifica valores antes de atribuir
- **Com Efeitos Colaterais**: Executa lógica adicional (log, notificações)
- **Fluent**: Retorna `this` (não é JavaBean padrão)

**Validações Comuns**:
- Não-nulo
- Range (idade 0-150)
- Formato (email, CPF)
- Regras de negócio

**Cuidados**:
- **Sempre valide** parâmetros
- **Defensive copy** para coleções/objetos mutáveis
- **Normalize** valores (trim, toLowerCase)
- **Documente** validações e efeitos colaterais

**Alternativas**:
- **Imutabilidade**: Sem setters, valores definidos no construtor
- **Builder Pattern**: Construção fluente de objetos imutáveis
- **Métodos de domínio**: `adicionar()`, `remover()` em vez de `setLista()`

**Regra de Ouro**: Setters devem **validar** e **proteger** a integridade dos dados, não apenas atribuir valores cegamente.
