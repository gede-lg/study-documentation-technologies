# T6.05 - Retorno de this para Method Chaining

## Introdução e Definição

**Method chaining** (encadeamento de métodos) é um padrão de design onde múltiplos métodos são chamados em **sequência** sobre o mesmo objeto, em uma única instrução. Para possibilitar esse encadeamento, os métodos retornam **`this`** (uma referência ao próprio objeto), permitindo que o próximo método seja chamado imediatamente no resultado.

Esse padrão cria uma **API fluente** (fluent API), onde o código se lê de forma mais natural e expressiva, reduzindo a verbosidade e melhorando a legibilidade. É amplamente utilizado em **builders**, **configuradores** e **APIs de bibliotecas** modernas.

**Sintaxe Básica**:
```java
public class Pessoa {
    private String nome;
    private int idade;
    private String cidade;

    public Pessoa setNome(String nome) {
        this.nome = nome;
        return this; // Retorna o próprio objeto
    }

    public Pessoa setIdade(int idade) {
        this.idade = idade;
        return this;
    }

    public Pessoa setCidade(String cidade) {
        this.cidade = cidade;
        return this;
    }

    public void exibir() {
        System.out.println(nome + ", " + idade + " anos, " + cidade);
    }
}

// Uso com method chaining:
Pessoa p = new Pessoa()
    .setNome("Carlos")
    .setIdade(30)
    .setCidade("São Paulo");

p.exibir(); // Carlos, 30 anos, São Paulo
```

**Sem method chaining** (tradicional):
```java
Pessoa p = new Pessoa();
p.setNome("Carlos");
p.setIdade(30);
p.setCidade("São Paulo");
p.exibir();
```

**Com method chaining**:
```java
new Pessoa()
    .setNome("Carlos")
    .setIdade(30)
    .setCidade("São Paulo")
    .exibir();
```

---

## 10 Fundamentos Teóricos

### 1. Retorno de this Permite Chamadas Encadeadas

Quando um método retorna `this`, o resultado da chamada é o **próprio objeto**, permitindo chamar outro método imediatamente no resultado.

```java
public class Builder {
    private int valor;

    public Builder setValor(int valor) {
        this.valor = valor;
        return this; // Retorna o próprio objeto
    }

    public Builder incrementar() {
        this.valor++;
        return this;
    }

    public int obter() {
        return valor;
    }
}

// Encadeamento:
int resultado = new Builder()
    .setValor(10)    // Retorna o Builder
    .incrementar()   // Chamado no Builder retornado
    .incrementar()   // Chamado no Builder retornado
    .obter();        // Retorna 12
```

Cada método retorna `this`, permitindo que o próximo método seja chamado no mesmo objeto.

---

### 2. Padrão Fluent API

**Fluent API** é um estilo de design de API onde métodos retornam `this` para permitir encadeamento, criando código que se lê quase como linguagem natural.

```java
public class Query {
    private StringBuilder sql = new StringBuilder();

    public Query select(String campos) {
        sql.append("SELECT ").append(campos);
        return this;
    }

    public Query from(String tabela) {
        sql.append(" FROM ").append(tabela);
        return this;
    }

    public Query where(String condicao) {
        sql.append(" WHERE ").append(condicao);
        return this;
    }

    public String build() {
        return sql.toString();
    }
}

// Uso:
String sql = new Query()
    .select("nome, idade")
    .from("usuarios")
    .where("idade > 18")
    .build();

System.out.println(sql);
// SELECT nome, idade FROM usuarios WHERE idade > 18
```

A API se lê de forma fluente e intuitiva.

---

### 3. Builder Pattern: Construção Fluente de Objetos

O **padrão Builder** é um dos usos mais comuns de method chaining, permitindo construir objetos complexos de forma legível e flexível.

```java
public class Produto {
    private String nome;
    private double preco;
    private String categoria;
    private int estoque;

    // Construtor privado
    private Produto() {}

    public static class Builder {
        private Produto produto = new Produto();

        public Builder nome(String nome) {
            produto.nome = nome;
            return this;
        }

        public Builder preco(double preco) {
            produto.preco = preco;
            return this;
        }

        public Builder categoria(String categoria) {
            produto.categoria = categoria;
            return this;
        }

        public Builder estoque(int estoque) {
            produto.estoque = estoque;
            return this;
        }

        public Produto build() {
            // Validações opcionais
            if (produto.nome == null) {
                throw new IllegalStateException("Nome é obrigatório");
            }
            return produto;
        }
    }
}

// Uso:
Produto p = new Produto.Builder()
    .nome("Notebook")
    .preco(3000.0)
    .categoria("Eletrônicos")
    .estoque(50)
    .build();
```

**Vantagens**:
- Código legível e expressivo
- Parâmetros opcionais (não precisa passar todos)
- Validação centralizada no `build()`

---

### 4. Setters com Retorno de this

Transformar setters tradicionais (que retornam `void`) em setters que retornam `this` permite encadeamento.

```java
// Setters tradicionais (sem encadeamento)
public void setNome(String nome) {
    this.nome = nome;
}

public void setIdade(int idade) {
    this.idade = idade;
}

// Uso tradicional:
Pessoa p = new Pessoa();
p.setNome("Ana");
p.setIdade(25);

// Setters com retorno de this (com encadeamento)
public Pessoa setNome(String nome) {
    this.nome = nome;
    return this;
}

public Pessoa setIdade(int idade) {
    this.idade = idade;
    return this;
}

// Uso com encadeamento:
Pessoa p = new Pessoa()
    .setNome("Ana")
    .setIdade(25);
```

---

### 5. Configuração Fluente

Method chaining é ideal para **configuração** de objetos, especialmente quando há muitas opções.

```java
public class ConfiguracaoServidor {
    private String host;
    private int porta;
    private boolean ssl;
    private int timeout;

    public ConfiguracaoServidor host(String host) {
        this.host = host;
        return this;
    }

    public ConfiguracaoServidor porta(int porta) {
        this.porta = porta;
        return this;
    }

    public ConfiguracaoServidor ssl(boolean ssl) {
        this.ssl = ssl;
        return this;
    }

    public ConfiguracaoServidor timeout(int timeout) {
        this.timeout = timeout;
        return this;
    }

    public void conectar() {
        System.out.println("Conectando a " + host + ":" + porta);
    }
}

// Uso:
new ConfiguracaoServidor()
    .host("api.exemplo.com")
    .porta(443)
    .ssl(true)
    .timeout(5000)
    .conectar();
```

---

### 6. Imutabilidade vs Method Chaining

Em **objetos imutáveis**, method chaining cria **novos objetos** em vez de modificar o atual. Cada método retorna uma **nova instância**.

```java
public final class StringImutavel {
    private final String valor;

    public StringImutavel(String valor) {
        this.valor = valor;
    }

    public StringImutavel concatenar(String outra) {
        // Retorna NOVA instância, não modifica this
        return new StringImutavel(this.valor + outra);
    }

    public StringImutavel maiusculas() {
        return new StringImutavel(this.valor.toUpperCase());
    }

    public String toString() {
        return valor;
    }
}

// Uso:
StringImutavel s = new StringImutavel("olá")
    .concatenar(" mundo")
    .maiusculas();

System.out.println(s); // OLÁ MUNDO
```

Cada método retorna um **novo objeto**, preservando imutabilidade.

---

### 7. Validação em Cada Método

Ao usar method chaining, você pode validar os valores em **cada método setter**.

```java
public class Usuario {
    private String login;
    private String senha;

    public Usuario login(String login) {
        if (login == null || login.length() < 3) {
            throw new IllegalArgumentException("Login deve ter ao menos 3 caracteres");
        }
        this.login = login;
        return this;
    }

    public Usuario senha(String senha) {
        if (senha == null || senha.length() < 6) {
            throw new IllegalArgumentException("Senha deve ter ao menos 6 caracteres");
        }
        this.senha = senha;
        return this;
    }
}

// Uso:
Usuario u = new Usuario()
    .login("ana123")     // Validado aqui
    .senha("senha123");  // Validado aqui
```

Validações ocorrem **imediatamente** ao definir cada valor.

---

### 8. Encadeamento com Métodos de Ação

Você pode misturar métodos de **configuração** (retornam `this`) com métodos de **ação** (retornam outros tipos ou `void`).

```java
public class Email {
    private String para;
    private String assunto;
    private String corpo;

    public Email para(String para) {
        this.para = para;
        return this;
    }

    public Email assunto(String assunto) {
        this.assunto = assunto;
        return this;
    }

    public Email corpo(String corpo) {
        this.corpo = corpo;
        return this;
    }

    public void enviar() {
        System.out.println("Enviando email para " + para);
        System.out.println("Assunto: " + assunto);
        System.out.println("Corpo: " + corpo);
    }
}

// Uso:
new Email()
    .para("exemplo@email.com")
    .assunto("Teste")
    .corpo("Mensagem de teste")
    .enviar(); // Método final que não retorna this
```

`enviar()` é um método de **ação** que encerra o encadeamento.

---

### 9. Streams e Collections: Method Chaining Nativo

A API de **Streams** do Java usa method chaining extensivamente.

```java
List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos", "Diana");

List<String> resultado = nomes.stream()
    .filter(n -> n.startsWith("A"))
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());

System.out.println(resultado); // [ANA]
```

Cada método (`filter`, `map`, `sorted`) retorna um novo `Stream`, permitindo encadeamento.

---

### 10. StringBuilder: Exemplo Clássico de Method Chaining

`StringBuilder` é um exemplo clássico de method chaining em Java.

```java
String resultado = new StringBuilder()
    .append("Olá")
    .append(" ")
    .append("Mundo")
    .append("!")
    .toString();

System.out.println(resultado); // Olá Mundo!
```

Cada chamada a `append()` retorna o próprio `StringBuilder`, permitindo encadeamento.

---

## Aplicabilidade

### Quando Usar Retorno de this

1. **Builder Pattern**: Construir objetos complexos de forma fluente.
   ```java
   new Builder().campo1(v1).campo2(v2).build();
   ```

2. **Configuração de Objetos**: Configurar múltiplas propriedades de forma encadeada.
   ```java
   config.host("localhost").porta(8080).ssl(true);
   ```

3. **Setters Fluentes**: Transformar setters em métodos encadeáveis.
   ```java
   obj.setA(1).setB(2).setC(3);
   ```

4. **APIs Fluentes**: Criar APIs que se leem como linguagem natural.
   ```java
   query.select("*").from("users").where("age > 18");
   ```

5. **Operações em Sequência**: Quando é comum aplicar múltiplas operações no mesmo objeto.
   ```java
   stringBuilder.append("a").append("b").append("c");
   ```

### Quando NÃO Usar Retorno de this

1. **Métodos de Ação**: Métodos que executam ações (enviar, salvar, processar) geralmente retornam `void` ou um resultado.
   ```java
   email.enviar(); // Retorna void, não this
   ```

2. **Getters**: Getters devem retornar o valor do atributo, não `this`.
   ```java
   String nome = pessoa.getNome(); // Retorna String, não this
   ```

3. **Métodos com Retorno Significativo**: Se o método calcula um valor, retorne esse valor, não `this`.
   ```java
   int soma = calculadora.somar(a, b); // Retorna int, não this
   ```

4. **Setters Tradicionais em JavaBeans**: Se você está seguindo a convenção JavaBeans estrita, setters devem retornar `void`.

---

## Armadilhas Comuns

### 1. Confundir Retorno de this com Imutabilidade

Retornar `this` modifica o **mesmo objeto**. Para imutabilidade, retorne uma **nova instância**.

```java
// Mutável (modifica o objeto)
public Pessoa setNome(String nome) {
    this.nome = nome;
    return this; // Mesmo objeto
}

// Imutável (cria novo objeto)
public Pessoa withNome(String nome) {
    Pessoa nova = new Pessoa(this);
    nova.nome = nome;
    return nova; // Novo objeto
}
```

---

### 2. Misturar Métodos que Retornam this com Métodos void

Misturar métodos que retornam `this` com métodos `void` quebra o encadeamento.

```java
public class Exemplo {
    public Exemplo setA(int a) {
        this.a = a;
        return this;
    }

    public void setB(int b) { // Retorna void
        this.b = b;
    }
}

// Uso:
Exemplo e = new Exemplo()
    .setA(10)
    .setB(20); // ERRO: setB() retorna void, não permite encadeamento
```

**Solução**: Faça todos os setters retornarem `this` ou nenhum.

---

### 3. Esquecer de Retornar this

Esquecer `return this;` quebra o encadeamento.

```java
public Pessoa setNome(String nome) {
    this.nome = nome;
    // ERRO: Esqueceu return this;
}

// Uso:
Pessoa p = new Pessoa()
    .setNome("Ana")  // ERRO de compilação: void não permite .setIdade()
    .setIdade(25);
```

**Solução**: Sempre retorne `this` se quiser permitir encadeamento.

---

### 4. Null em Cadeias de Chamadas

Se um método na cadeia retornar `null` em vez de `this`, o encadeamento falha com `NullPointerException`.

```java
public Pessoa setNome(String nome) {
    if (nome == null) {
        return null; // ERRO: Quebra o encadeamento
    }
    this.nome = nome;
    return this;
}

// Uso:
Pessoa p = new Pessoa()
    .setNome(null)   // Retorna null
    .setIdade(25);   // NullPointerException!
```

**Solução**: Sempre retorne `this`, lançando exceções se necessário em vez de retornar `null`.

---

### 5. Type Safety com Herança

Em hierarquias de classes, retornar `this` pode causar problemas de tipo.

```java
public class Pai {
    public Pai setA(int a) {
        this.a = a;
        return this; // Retorna Pai
    }
}

public class Filho extends Pai {
    public Filho setB(int b) {
        this.b = b;
        return this; // Retorna Filho
    }
}

// Uso:
Filho f = new Filho()
    .setA(10)  // Retorna Pai, não Filho
    .setB(20); // ERRO: Pai não tem setB()
```

**Solução**: Use **generics** com bounded types para preservar o tipo.

```java
public class Pai<T extends Pai<T>> {
    @SuppressWarnings("unchecked")
    public T setA(int a) {
        this.a = a;
        return (T) this;
    }
}

public class Filho extends Pai<Filho> {
    public Filho setB(int b) {
        this.b = b;
        return this;
    }
}

// Uso:
Filho f = new Filho()
    .setA(10)  // Retorna Filho
    .setB(20); // OK
```

---

## Boas Práticas

### 1. Use Nomes Descritivos em Builders

Em builders, use nomes de métodos que descrevam claramente o que estão configurando.

```java
new ProdutoBuilder()
    .comNome("Notebook")
    .comPreco(3000.0)
    .emEstoque(50)
    .build();
```

---

### 2. Valide em Cada Método, Não Apenas no Final

Valide valores imediatamente em cada método setter, não apenas no `build()`.

```java
public Builder preco(double preco) {
    if (preco < 0) {
        throw new IllegalArgumentException("Preço não pode ser negativo");
    }
    this.preco = preco;
    return this;
}
```

---

### 3. Forneça um Método Terminal

Em builders, forneça um método "terminal" (como `build()`) que retorna o objeto final, não `this`.

```java
public Produto build() {
    // Validações finais
    return new Produto(this);
}
```

---

### 4. Documente Métodos que Retornam this

Documente claramente que o método retorna `this` para permitir encadeamento.

```java
/**
 * Define o nome do produto.
 * @param nome Nome do produto
 * @return Esta instância para encadeamento (method chaining)
 */
public Produto setNome(String nome) {
    this.nome = nome;
    return this;
}
```

---

### 5. Use Generics Para Type Safety em Hierarquias

Em hierarquias de classes, use generics para preservar o tipo correto no encadeamento.

```java
public abstract class BaseBuilder<T extends BaseBuilder<T>> {
    @SuppressWarnings("unchecked")
    protected T self() {
        return (T) this;
    }

    public T nome(String nome) {
        this.nome = nome;
        return self();
    }
}
```

---

### 6. Consistência: Todos os Setters Retornam this ou Nenhum

Mantenha consistência: todos os setters retornam `this` ou nenhum retorna.

```java
// Consistente: Todos retornam this
public Pessoa setNome(String nome) { this.nome = nome; return this; }
public Pessoa setIdade(int idade) { this.idade = idade; return this; }

// Ou consistente: Nenhum retorna (JavaBeans tradicional)
public void setNome(String nome) { this.nome = nome; }
public void setIdade(int idade) { this.idade = idade; }
```

---

### 7. Evite Efeitos Colaterais em Métodos de Configuração

Métodos que retornam `this` devem apenas **configurar** o objeto, não executar ações complexas.

```java
// Evitar
public Email assunto(String assunto) {
    this.assunto = assunto;
    validarAssunto(); // Efeito colateral
    enviarNotificacao(); // Efeito colateral
    return this;
}

// Preferir: Configuração simples
public Email assunto(String assunto) {
    this.assunto = assunto;
    return this;
}
```

---

### 8. Use em APIs Internas e Externas

Method chaining melhora tanto APIs internas (uso dentro do projeto) quanto externas (bibliotecas públicas).

---

### 9. Considere Imutabilidade em Builders

Após chamar `build()`, considere tornar o objeto construído imutável.

```java
public class Produto {
    private final String nome;
    private final double preco;

    // Construtor privado
    private Produto(Builder builder) {
        this.nome = builder.nome;
        this.preco = builder.preco;
    }

    // Produto é imutável, sem setters
    public String getNome() { return nome; }
    public double getPreco() { return preco; }

    public static class Builder {
        private String nome;
        private double preco;

        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }

        public Builder preco(double preco) {
            this.preco = preco;
            return this;
        }

        public Produto build() {
            return new Produto(this);
        }
    }
}
```

---

### 10. Inspire-se em APIs Conhecidas

Estude APIs fluentes de bibliotecas populares (StringBuilder, Stream API, Mockito, JUnit) para aprender boas práticas.

---

## Resumo Executivo

**Method chaining** é um padrão onde métodos retornam **`this`**, permitindo encadear múltiplas chamadas em sequência sobre o mesmo objeto. Isso cria **APIs fluentes** (fluent APIs) que são mais legíveis e expressivas.

**Sintaxe**:
```java
public Classe metodo(Tipo param) {
    // Lógica do método
    return this; // Permite encadeamento
}

// Uso:
new Classe()
    .metodo1(v1)
    .metodo2(v2)
    .metodo3(v3);
```

**Aplicações Principais**:
1. **Builder Pattern**: Construir objetos complexos de forma fluente.
2. **Setters Fluentes**: Transformar setters tradicionais em encadeáveis.
3. **Configuração**: Configurar objetos com múltiplas opções.
4. **APIs Fluentes**: Criar APIs que se leem como linguagem natural.

**Benefícios**:
- **Legibilidade**: Código mais expressivo e natural.
- **Concisão**: Reduz verbosidade (não precisa repetir nome da variável).
- **Flexibilidade**: Facilita configurações com parâmetros opcionais.
- **Validação**: Permite validar cada valor imediatamente.

**Regras**:
- Métodos de **configuração** retornam `this` (mutáveis) ou nova instância (imutáveis).
- Métodos de **ação** (enviar, salvar) geralmente retornam `void` ou um resultado.
- Mantenha **consistência**: todos os setters retornam `this` ou nenhum.

**Boas Práticas**:
- Valide em cada método, não apenas no final.
- Forneça método terminal (`build()`) em builders.
- Documente que o método permite encadeamento.
- Use generics para type safety em hierarquias.
- Evite efeitos colaterais em métodos de configuração.

**Armadilhas**:
- Esquecer `return this;` quebra o encadeamento.
- Misturar métodos que retornam `this` com `void` causa erros.
- Retornar `null` causa `NullPointerException` em cadeias.
- Hierarquias de classes podem causar problemas de tipo (solução: generics).

Retornar `this` para method chaining é uma técnica poderosa para criar APIs **fluentes**, **legíveis** e **manuteníveis**, sendo amplamente adotada em bibliotecas e frameworks modernos Java.
