# T6.03 - Chamada de Construtores com this()

## Introdução e Definição

A sintaxe **`this()`** em Java permite que um construtor chame **outro construtor da mesma classe**, um mecanismo conhecido como **encadeamento de construtores** (constructor chaining). Esse recurso evita **duplicação de código** ao centralizar a lógica de inicialização em um único construtor (chamado de **construtor mestre** ou **construtor principal**), enquanto os demais construtores delegam a inicialização para ele.

Quando você tem múltiplos construtores sobrecarregados (com diferentes números ou tipos de parâmetros), é comum que eles compartilhem lógica de inicialização. Em vez de repetir esse código em cada construtor, você pode usar `this()` para chamar um construtor mais completo, passando valores padrão ou calculados para os parâmetros faltantes.

**Sintaxe**:
```java
public class Exemplo {
    private String nome;
    private int valor;

    // Construtor principal (mestre)
    public Exemplo(String nome, int valor) {
        this.nome = nome;
        this.valor = valor;
    }

    // Construtor delegado - chama o construtor principal
    public Exemplo(String nome) {
        this(nome, 0); // Chama Exemplo(String, int) com valor padrão 0
    }

    // Construtor delegado - chama o construtor principal
    public Exemplo() {
        this("Padrão", 0); // Chama Exemplo(String, int) com valores padrão
    }
}
```

**Regras Importantes**:
1. **`this()` DEVE ser a primeira instrução** do construtor. Não pode haver nenhuma linha de código antes.
2. Um construtor pode chamar **apenas um** outro construtor com `this()`.
3. **Não pode haver ciclos**: Se A chama B, B não pode chamar A (causaria recursão infinita).
4. `this()` só pode ser usado em **construtores**, não em métodos comuns.

---

## 10 Fundamentos Teóricos

### 1. Encadeamento de Construtores (Constructor Chaining)

**Constructor chaining** é o padrão de um construtor chamar outro construtor da mesma classe usando `this()`. Isso permite:
- **Reutilizar código**: Centralizar lógica de inicialização em um único lugar.
- **Evitar duplicação**: Não repetir o mesmo código de inicialização em múltiplos construtores.
- **Facilitar manutenção**: Mudanças na lógica de inicialização são feitas em um único construtor.

```java
public class Pessoa {
    private String nome;
    private int idade;
    private String cidade;

    // Construtor mestre: Recebe todos os parâmetros
    public Pessoa(String nome, int idade, String cidade) {
        this.nome = nome;
        this.idade = idade;
        this.cidade = cidade;
    }

    // Construtor delegado: Fornece cidade padrão
    public Pessoa(String nome, int idade) {
        this(nome, idade, "São Paulo"); // Chama construtor mestre
    }

    // Construtor delegado: Fornece idade e cidade padrão
    public Pessoa(String nome) {
        this(nome, 0, "São Paulo"); // Chama construtor mestre
    }
}
```

Todos os construtores delegados chamam o construtor mestre, centralizando a lógica de inicialização.

---

### 2. this() DEVE Ser a Primeira Instrução

A chamada `this()` **DEVE** ser a **primeira linha** do construtor. Não pode haver nenhum código antes dela, nem mesmo declarações de variáveis.

```java
public class Produto {
    private String nome;
    private double preco;

    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    public Produto(String nome) {
        // ERRO: this() deve ser a primeira instrução
        // System.out.println("Criando produto");
        // this(nome, 0.0); // ERRO de compilação
        
        // CORRETO:
        this(nome, 0.0); // Primeira instrução
        // Código adicional pode vir APÓS this()
        System.out.println("Produto criado: " + this.nome);
    }
}
```

**Por quê?** O Java exige que a inicialização da superclasse (ou outro construtor) aconteça **antes** de qualquer outra operação. Permitir código antes de `this()` poderia levar a uso de variáveis não inicializadas.

---

### 3. Um Construtor Chama Apenas Um Outro Construtor

Você pode chamar **apenas um** outro construtor com `this()`. Não é possível chamar múltiplos construtores.

```java
public class Exemplo {
    public Exemplo(int a) {
        // ...
    }

    public Exemplo(String b) {
        // ...
    }

    public Exemplo() {
        this(10);      // OK: Chama Exemplo(int)
        // this("Texto"); // ERRO: Não pode chamar dois construtores
    }
}
```

Se você precisar de lógica de múltiplos construtores, centralize em um construtor mestre e chame-o.

---

### 4. Evitar Ciclos de Chamadas

Não pode haver **ciclos** nas chamadas de construtores, pois causariam recursão infinita e erro de compilação.

```java
public class Ciclo {
    public Ciclo(int a) {
        this("texto"); // Chama Ciclo(String)
    }

    public Ciclo(String b) {
        this(10); // ERRO: Chama Ciclo(int), criando ciclo infinito!
    }
}
// ERRO de compilação: recursive constructor invocation
```

O compilador detecta ciclos diretos e indiretos.

---

### 5. Padrão de Construtor Mestre

O **padrão de construtor mestre** consiste em ter um construtor "principal" que recebe **todos os parâmetros** e realiza toda a lógica de inicialização. Os demais construtores chamam o construtor mestre usando `this()`, fornecendo valores padrão para os parâmetros faltantes.

```java
public class Livro {
    private String titulo;
    private String autor;
    private int paginas;
    private int anoPublicacao;

    // CONSTRUTOR MESTRE: Recebe todos os parâmetros
    public Livro(String titulo, String autor, int paginas, int anoPublicacao) {
        if (titulo == null || titulo.isEmpty()) {
            throw new IllegalArgumentException("Título não pode ser vazio");
        }
        this.titulo = titulo;
        this.autor = autor;
        this.paginas = paginas;
        this.anoPublicacao = anoPublicacao;
    }

    // Construtor delegado: ano padrão
    public Livro(String titulo, String autor, int paginas) {
        this(titulo, autor, paginas, 2024);
    }

    // Construtor delegado: páginas e ano padrão
    public Livro(String titulo, String autor) {
        this(titulo, autor, 0, 2024);
    }
}
```

**Vantagem**: Validações e lógica de inicialização estão centralizadas no construtor mestre.

---

### 6. Código Após this() É Permitido

Você pode ter código **após** a chamada `this()`, mas **não antes**.

```java
public class Exemplo {
    private String nome;
    private int contador;

    public Exemplo(String nome, int contador) {
        this.nome = nome;
        this.contador = contador;
    }

    public Exemplo(String nome) {
        this(nome, 0); // DEVE ser a primeira linha
        
        // Código adicional APÓS this() é permitido
        System.out.println("Objeto criado: " + this.nome);
        this.contador = 100; // Pode modificar atributos após this()
    }
}
```

O código após `this()` é executado **depois** que o construtor chamado completa.

---

### 7. this() vs super(): Exclusividade

Um construtor pode chamar **ou** `this()` **ou** `super()`, mas **não ambos**. Se você não chamar explicitamente `this()` ou `super()`, o compilador insere automaticamente `super()` (chama o construtor padrão da superclasse).

```java
public class Filho extends Pai {
    public Filho(int a) {
        this(a, 0); // Chama outro construtor da própria classe
        // super(); // ERRO: Não pode usar this() e super() no mesmo construtor
    }

    public Filho(int a, int b) {
        super(a); // Chama construtor da superclasse
        // Inicialização adicional
    }
}
```

**Regra**: Se usar `this()`, você **delega** a chamada de `super()` para o construtor que está sendo chamado.

---

### 8. Valores Padrão e Sobrecarga

`this()` é frequentemente usado para fornecer **valores padrão** em construtores sobrecarregados.

```java
public class Configuracao {
    private String host;
    private int porta;
    private boolean ssl;

    // Construtor mestre
    public Configuracao(String host, int porta, boolean ssl) {
        this.host = host;
        this.porta = porta;
        this.ssl = ssl;
    }

    // Construtor com SSL padrão (false)
    public Configuracao(String host, int porta) {
        this(host, porta, false);
    }

    // Construtor com porta e SSL padrão
    public Configuracao(String host) {
        this(host, 8080, false);
    }

    // Construtor com todos os padrões
    public Configuracao() {
        this("localhost", 8080, false);
    }
}
```

Cada construtor fornece valores padrão progressivamente, delegando ao construtor mestre.

---

### 9. Validações Centralizadas no Construtor Mestre

Ao usar `this()` para delegar ao construtor mestre, **validações** e **lógica complexa** ficam centralizadas em um único lugar.

```java
public class Usuario {
    private String login;
    private String senha;

    // Construtor mestre com validações
    public Usuario(String login, String senha) {
        if (login == null || login.length() < 3) {
            throw new IllegalArgumentException("Login inválido");
        }
        if (senha == null || senha.length() < 6) {
            throw new IllegalArgumentException("Senha inválida");
        }
        this.login = login;
        this.senha = senha;
    }

    // Construtor com senha padrão
    public Usuario(String login) {
        this(login, "123456"); // Validações são executadas no construtor mestre
    }
}
```

As validações são executadas **apenas** no construtor mestre, evitando duplicação.

---

### 10. Ordem de Execução: Blocos, this(), Corpo do Construtor

A ordem de execução ao criar um objeto com `this()` é:
1. **Blocos de inicialização estática** (se for a primeira instância da classe).
2. **Blocos de inicialização de instância** da superclasse.
3. **Construtor da superclasse** (`super()`).
4. **Blocos de inicialização de instância** da própria classe.
5. **Construtor chamado via `this()`**.
6. **Corpo do construtor atual** (código após `this()`).

```java
public class Ordem {
    private int valor;

    // Bloco de inicialização de instância
    {
        System.out.println("Bloco de inicialização");
        valor = 5;
    }

    public Ordem(int valor) {
        System.out.println("Construtor mestre, valor = " + valor);
        this.valor = valor;
    }

    public Ordem() {
        this(10); // Chama Ordem(int)
        System.out.println("Construtor padrão, valor = " + this.valor);
    }
}

// Criando new Ordem():
// Bloco de inicialização
// Construtor mestre, valor = 10
// Construtor padrão, valor = 10
```

---

## Aplicabilidade

### Quando Usar this()

1. **Evitar Duplicação de Código**: Quando múltiplos construtores compartilham lógica de inicialização.
   ```java
   public Pessoa(String nome, int idade) {
       this.nome = nome;
       this.idade = idade;
   }

   public Pessoa(String nome) {
       this(nome, 0); // Reutiliza lógica
   }
   ```

2. **Fornecer Valores Padrão**: Para criar construtores com menos parâmetros que usam valores padrão.
   ```java
   public Config(String host, int porta) { ... }
   public Config(String host) {
       this(host, 8080); // Porta padrão
   }
   ```

3. **Centralizar Validações**: Para garantir que validações e lógica complexa estejam em um único construtor.
   ```java
   public Usuario(String login, String senha) {
       // Validações complexas
   }
   
   public Usuario(String login) {
       this(login, "padrão"); // Validações centralizadas
   }
   ```

4. **Sobrecarga de Construtores**: Para oferecer múltiplas formas de criar objetos.
   ```java
   public Produto(String nome, double preco, int estoque) { ... }
   public Produto(String nome, double preco) { this(nome, preco, 0); }
   public Produto(String nome) { this(nome, 0.0, 0); }
   ```

### Quando NÃO Usar this()

1. **Lógica Completamente Diferente**: Se cada construtor tem lógica totalmente distinta, `this()` pode não ser adequado.
2. **Construtores Simples**: Se há apenas um construtor, `this()` não é necessário.
3. **Quando Precisa Chamar super()**: Se você precisa chamar um construtor específico da superclasse, não pode usar `this()` no mesmo construtor.

---

## Armadilhas Comuns

### 1. Código Antes de this()

```java
public class Erro {
    public Erro(int valor) {
        System.out.println("Valor: " + valor); // ERRO: Código antes de this()
        this(valor, 0); // ERRO de compilação
    }
    
    public Erro(int a, int b) { ... }
}
```

**Solução**: `this()` **DEVE** ser a primeira linha.

---

### 2. Chamar Múltiplos Construtores

```java
public class Erro {
    public Erro() {
        this(10);     // OK
        this("texto"); // ERRO: Não pode chamar dois construtores
    }
    
    public Erro(int a) { ... }
    public Erro(String b) { ... }
}
```

**Solução**: Chame apenas **um** construtor via `this()`.

---

### 3. Ciclos de Chamadas

```java
public class Ciclo {
    public Ciclo(int a) {
        this("texto");
    }

    public Ciclo(String b) {
        this(10); // ERRO: Ciclo infinito!
    }
}
```

**Solução**: Garanta que as chamadas `this()` formem uma **cadeia linear**, não ciclos.

---

### 4. Usar this() em Métodos Normais

```java
public class Erro {
    public void metodo() {
        this(10); // ERRO: this() só pode ser usado em construtores
    }
    
    public Erro(int a) { ... }
}
```

**Solução**: `this()` é exclusivo para construtores.

---

### 5. Confundir this() com this

- **`this()`**: Chama outro construtor.
- **`this`**: Referência ao objeto atual.

```java
public Exemplo(int valor) {
    this.valor = valor; // this = referência ao objeto
    // this(10); // this() = chamada de construtor (não pode ser usada aqui)
}
```

---

## Boas Práticas

### 1. Centralize Lógica no Construtor Mestre

Defina um construtor "mestre" com todos os parâmetros e lógica de inicialização. Os demais construtores chamam-no com `this()`.

```java
public Produto(String nome, double preco, int estoque) {
    // Validações e inicialização centralizadas
}

public Produto(String nome, double preco) {
    this(nome, preco, 0);
}
```

---

### 2. Forneça Valores Padrão Explícitos

Quando usar `this()` para fornecer valores padrão, escolha valores que façam sentido no contexto da classe.

```java
public Config(String host, int porta, boolean ssl) { ... }

public Config(String host) {
    this(host, 8080, false); // Porta e SSL padrão explícitos
}
```

---

### 3. Evite Lógica Complexa Após this()

Mantenha a lógica principal no construtor mestre. Evite adicionar muita lógica após `this()`.

```java
// Evitar
public Exemplo(String nome) {
    this(nome, 0);
    // Muita lógica adicional aqui
}

// Preferir: Lógica no construtor mestre
public Exemplo(String nome, int valor) {
    // Toda a lógica aqui
}
```

---

### 4. Documente Construtores Sobrecarregados

Documente o propósito de cada construtor, especialmente os valores padrão fornecidos.

```java
/**
 * Cria uma configuração com host especificado e valores padrão.
 * @param host Endereço do servidor
 * Porta padrão: 8080, SSL: false
 */
public Config(String host) {
    this(host, 8080, false);
}
```

---

### 5. Evite Cadeias Longas de this()

Evite cadeias muito longas de construtores chamando construtores. Prefira delegar diretamente ao construtor mestre.

```java
// Evitar cadeias longas
public A() { this(10); }
public A(int a) { this(a, 0); }
public A(int a, int b) { this(a, b, 0); }
public A(int a, int b, int c) { ... } // Mestre

// Preferir delegação direta ao mestre
public A() { this(10, 0, 0); }
public A(int a) { this(a, 0, 0); }
public A(int a, int b) { this(a, b, 0); }
public A(int a, int b, int c) { ... } // Mestre
```

---

### 6. Use Builders Para Muitos Parâmetros Opcionais

Se há muitos parâmetros opcionais, considere usar o padrão **Builder** em vez de múltiplos construtores.

```java
// Em vez de muitos construtores sobrecarregados:
public class Pessoa {
    // Muitos atributos...
    
    public static class Builder {
        private String nome;
        private int idade;
        // ...
        
        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }
        
        public Pessoa build() {
            return new Pessoa(this);
        }
    }
}
```

---

### 7. Valide Apenas no Construtor Mestre

Centralize todas as validações no construtor mestre para evitar duplicação.

```java
public Usuario(String login, String senha) {
    // Validações centralizadas aqui
}

public Usuario(String login) {
    this(login, "padrão"); // Validações executadas automaticamente
}
```

---

### 8. Mantenha Construtores Simples

Construtores devem inicializar o objeto, não executar lógica complexa. Se necessário, delegue a métodos privados.

```java
public Exemplo(String dados) {
    this(processar(dados)); // Delega processamento a método privado
}

private static int processar(String dados) {
    // Lógica complexa
    return valor;
}
```

---

### 9. Cuidado com Efeitos Colaterais

Evite código com efeitos colaterais (como imprimir, gravar arquivos) em construtores, especialmente em cadeias de `this()`.

---

### 10. Use IDEs Para Gerar Construtores

IDEs modernas podem gerar construtores sobrecarregados automaticamente, incluindo chamadas `this()`.

---

## Resumo Executivo

A sintaxe **`this()`** permite que um construtor chame **outro construtor da mesma classe**, implementando o padrão de **encadeamento de construtores** (constructor chaining). Isso evita **duplicação de código** ao centralizar a lógica de inicialização em um **construtor mestre**.

**Sintaxe**:
```java
public Exemplo(String nome, int valor) {
    // Construtor mestre
}

public Exemplo(String nome) {
    this(nome, 0); // Chama o construtor mestre com valor padrão
}
```

**Regras Fundamentais**:
1. **`this()` DEVE ser a primeira instrução** do construtor (não pode haver código antes).
2. Um construtor pode chamar **apenas um** outro construtor com `this()`.
3. **Não pode haver ciclos**: Se A chama B, B não pode chamar A.
4. `this()` **não** pode ser combinado com `super()` no mesmo construtor.
5. Código **após** `this()` é permitido e executado depois do construtor chamado.

**Padrão de Construtor Mestre**:
- Defina um construtor "principal" que recebe todos os parâmetros e contém toda a lógica de inicialização e validação.
- Demais construtores chamam o mestre usando `this()`, fornecendo valores padrão.

**Benefícios**:
- **Evita duplicação**: Lógica de inicialização centralizada.
- **Facilita manutenção**: Mudanças feitas em um único lugar.
- **Valida centralizadamente**: Validações no construtor mestre aplicam-se a todos.
- **Fornece valores padrão**: Permite criar objetos com menos parâmetros.

**Boas Práticas**:
- Centralize validações e lógica no construtor mestre.
- Use `this()` para fornecer valores padrão explícitos e sensatos.
- Evite cadeias longas de `this()`; delegue diretamente ao mestre.
- Documente construtores sobrecarregados e valores padrão.
- Mantenha construtores simples; delegue lógica complexa a métodos privados.

**Armadilhas**:
- Esquecer que `this()` deve ser a primeira linha (erro de compilação).
- Criar ciclos de chamadas (erro de compilação).
- Tentar usar `this()` em métodos normais (erro de compilação).
- Confundir `this()` (chamada de construtor) com `this` (referência ao objeto).

O uso de **`this()`** é uma prática essencial para criar construtores **limpos**, **reutilizáveis** e **manuteníveis**, sendo amplamente adotada em código Java idiomático.
