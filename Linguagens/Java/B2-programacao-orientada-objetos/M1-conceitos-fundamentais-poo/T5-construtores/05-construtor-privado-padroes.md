# Construtor Privado e Padrões de Design

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Construtor privado** é construtor com modificador de acesso `private`, inacessível fora da própria classe, impedindo instanciação direta via `new` por código externo. Conceitualmente, construtor privado é "porta trancada" - objeto só pode nascer por caminhos controlados internamente pela classe (métodos estáticos, inner classes), não por chamadas arbitrárias externas.

É inversão do padrão normal: construtores geralmente são `public` (qualquer código pode criar objeto), construtor privado restringe criação a contextos específicos. Propósito não é impedir criação completamente, mas **controlar como e quando** objetos são criados - substituir construtor direto por factory methods, garantir única instância (Singleton), ou prevenir instanciação completamente (utility classes).

Diferença fundamental: `public Classe()` diz "qualquer código pode criar", `private Classe()` diz "apenas código interno decide se/quando criar". É ferramenta de **controle de instanciação** - classe toma responsabilidade sobre própria criação em vez de delegar a qualquer cliente.

### Contexto Histórico e Motivação

Construtor privado é padrão desde primeiros livros de design patterns (Gang of Four, 1994). Singleton, Factory Method, Builder - todos usam construtor privado para centralizar controle. Java adotou desde 1.0 - `Runtime.getRuntime()` usa Singleton com construtor privado, `Collections` tem construtor privado (utility class).

**Motivação Principal:** Separar interface pública (como criar) de implementação (construtor). Construtor público expõe detalhes - `new Usuario(id, nome, senha)` vs método estático `Usuario.criar(nome, senha)` que gera ID automaticamente e hash da senha. Construtor privado + factory = API mais limpa e segura.

### Problema Fundamental que Resolve

**Problema 1: Múltiplas Instâncias de Singleton**

```java
// SEM construtor privado - múltiplas instâncias
class Configuracao {
    public Configuracao() { }  // Público!
}

Configuracao cfg1 = new Configuracao();
Configuracao cfg2 = new Configuracao();
// cfg1 != cfg2 - duas configurações diferentes! Bug!
```

**Solução: Construtor privado força única instância**

```java
class Configuracao {
    private static final Configuracao INSTANCIA = new Configuracao();

    private Configuracao() { }  // Privado - só pode ser chamado internamente

    public static Configuracao getInstance() {
        return INSTANCIA;
    }
}

// Configuracao cfg = new Configuracao();  // ❌ ERRO - construtor privado
Configuracao cfg1 = Configuracao.getInstance();
Configuracao cfg2 = Configuracao.getInstance();
// cfg1 == cfg2 - mesma instância! ✅
```

**Problema 2: Utility Classes Instanciáveis**

```java
// SEM construtor privado - pode instanciar inutilmente
class Matematica {
    public static double raizQuadrada(double n) {
        return Math.sqrt(n);
    }
}

Matematica mat = new Matematica();  // Inútil - métodos são static!
```

**Solução: Construtor privado previne instanciação**

```java
class Matematica {
    private Matematica() {
        throw new AssertionError("Classe não instanciável");
    }

    public static double raizQuadrada(double n) {
        return Math.sqrt(n);
    }
}

// Matematica mat = new Matematica();  // ❌ ERRO - construtor privado
Matematica.raizQuadrada(25);  // ✅ Uso correto
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Controle de Instanciação:**
   - Construtor privado impede `new` externo
   - Apenas código da própria classe pode chamar
   - Força uso de factory methods ou getInstance()

2. **Padrões de Design Clássicos:**
   - **Singleton:** Única instância global
   - **Factory Method:** Criação via método estático nomeado
   - **Builder:** Construção fluente de objetos complexos
   - **Utility Class:** Prevenir instanciação de classe com apenas métodos static

3. **Visibilidade:**
   - `private`: Apenas classe pode criar
   - Subclasses não podem chamar construtor privado
   - Herança fica impossível (ou exige construtor protected/público)

4. **Uso com Métodos Estáticos:**
   - Construtor privado + método estático = Factory
   - `private Classe() { }` + `public static Classe criar() { return new Classe(); }`

5. **Exceções no Construtor:**
   - Comum lançar `AssertionError` para prevenir reflection

### Pilares Fundamentais

- **Sintaxe:** `private Classe() { }`
- **Propósito:** Controlar instanciação
- **Singleton:** Única instância compartilhada
- **Factory:** Métodos estáticos nomeados para criação
- **Utility Class:** Impedir instanciação completamente

---

## 🧠 Fundamentos Teóricos

### Padrão 1: Singleton (Instância Única)

#### Implementação Eager (Inicialização Antecipada)

```java
class DatabaseConnection {
    // Única instância, criada ao carregar classe
    private static final DatabaseConnection INSTANCIA = new DatabaseConnection();

    // Construtor privado
    private DatabaseConnection() {
        System.out.println("Conectando ao banco...");
        // Inicialização da conexão
    }

    // Método público para acesso
    public static DatabaseConnection getInstance() {
        return INSTANCIA;
    }

    public void executarQuery(String sql) {
        System.out.println("Executando: " + sql);
    }
}

// Uso:
// DatabaseConnection db = new DatabaseConnection();  // ❌ ERRO
DatabaseConnection db1 = DatabaseConnection.getInstance();
DatabaseConnection db2 = DatabaseConnection.getInstance();
// db1 == db2 (mesma instância)
```

**Características:**
- Instância criada quando classe é carregada
- Thread-safe (JVM garante)
- Simples e eficiente

#### Implementação Lazy (Inicialização Tardia)

```java
class Logger {
    private static Logger instancia;

    private Logger() {
        System.out.println("Logger inicializado");
    }

    // Thread-safe com synchronized
    public static synchronized Logger getInstance() {
        if (instancia == null) {
            instancia = new Logger();
        }
        return instancia;
    }
}

// Instância criada apenas no primeiro getInstance()
Logger log1 = Logger.getInstance();  // "Logger inicializado"
Logger log2 = Logger.getInstance();  // Sem saída (já existe)
```

#### Singleton com Enum (Bill Pugh - Java Efetivo)

```java
enum ConfiguracaoSegura {
    INSTANCIA;

    private String propriedade;

    public void setPropriedade(String valor) {
        this.propriedade = valor;
    }

    public String getPropriedade() {
        return propriedade;
    }
}

// Uso:
ConfiguracaoSegura cfg = ConfiguracaoSegura.INSTANCIA;
cfg.setPropriedade("valor");
```

**Vantagens do Enum:**
- Serialização automática segura
- Previne reflection attacks
- Thread-safe garantido
- Código conciso

### Padrão 2: Factory Method

Construtor privado + métodos estáticos nomeados:

```java
class Usuario {
    private String id;
    private String nome;
    private String senhaHash;

    // Construtor privado - não pode chamar diretamente
    private Usuario(String id, String nome, String senhaHash) {
        this.id = id;
        this.nome = nome;
        this.senhaHash = senhaHash;
    }

    // Factory methods públicos
    public static Usuario novo(String nome, String senha) {
        String id = UUID.randomUUID().toString();
        String hash = hashSenha(senha);
        return new Usuario(id, nome, hash);
    }

    public static Usuario carregar(String id, String nome, String senhaHash) {
        return new Usuario(id, nome, senhaHash);
    }

    private static String hashSenha(String senha) {
        // Simulação de hash
        return "hash_" + senha;
    }
}

// Uso:
// Usuario u = new Usuario(...);  // ❌ ERRO - construtor privado
Usuario u1 = Usuario.novo("Alice", "senha123");  // Cria novo
Usuario u2 = Usuario.carregar("uuid", "Bob", "hash_xyz");  // Carrega existente
```

**Vantagens:**
- Nomes descritivos: `novo()` vs `carregar()`
- Lógica complexa encapsulada (geração de ID, hash)
- Validação centralizada
- Pode retornar subtipos

### Padrão 3: Builder

Construtor privado + builder interno:

```java
class Pizza {
    private String massa;
    private String molho;
    private List<String> ingredientes;

    // Construtor privado - apenas builder pode chamar
    private Pizza(PizzaBuilder builder) {
        this.massa = builder.massa;
        this.molho = builder.molho;
        this.ingredientes = builder.ingredientes;
    }

    public static PizzaBuilder builder() {
        return new PizzaBuilder();
    }

    public static class PizzaBuilder {
        private String massa = "Tradicional";
        private String molho = "Tomate";
        private List<String> ingredientes = new ArrayList<>();

        public PizzaBuilder massa(String massa) {
            this.massa = massa;
            return this;
        }

        public PizzaBuilder molho(String molho) {
            this.molho = molho;
            return this;
        }

        public PizzaBuilder ingrediente(String ingrediente) {
            this.ingredientes.add(ingrediente);
            return this;
        }

        public Pizza build() {
            return new Pizza(this);  // Chama construtor privado
        }
    }
}

// Uso:
Pizza pizza = Pizza.builder()
    .massa("Integral")
    .molho("Branco")
    .ingrediente("Mussarela")
    .ingrediente("Tomate")
    .build();
```

### Padrão 4: Utility Class (Não Instanciável)

```java
class StringUtils {
    // Construtor privado previne instanciação
    private StringUtils() {
        throw new AssertionError("Classe utilitária não deve ser instanciada");
    }

    // Apenas métodos static
    public static boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static String capitalize(String str) {
        if (isBlank(str)) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}

// Uso:
// StringUtils utils = new StringUtils();  // ❌ ERRO + AssertionError
boolean vazio = StringUtils.isBlank("");  // ✅ Uso correto
```

**Exemplos Java API:**
- `Math` - construtor privado, apenas métodos static
- `Collections` - construtor privado
- `Arrays` - construtor privado

---

## 🔍 Análise Conceitual Profunda

### Construtor Privado e Herança

Construtor privado impede herança tradicional:

```java
class Base {
    private Base() { }
}

class Derivada extends Base {
    public Derivada() {
        super();  // ❌ ERRO - super() privado, inacessível
    }
}
```

**Solução:** Se herança for necessária, use `protected`:

```java
class Base {
    protected Base() { }  // Subclasses podem chamar
}

class Derivada extends Base {
    public Derivada() {
        super();  // ✅ OK
    }
}
```

### Prevenindo Reflection Attacks

```java
class Singleton {
    private static final Singleton INSTANCIA = new Singleton();

    private Singleton() {
        // Previne criação via reflection
        if (INSTANCIA != null) {
            throw new IllegalStateException("Singleton já inicializado");
        }
    }

    public static Singleton getInstance() {
        return INSTANCIA;
    }
}

// Tentativa de burlar via reflection:
try {
    Constructor<Singleton> construtor = Singleton.class.getDeclaredConstructor();
    construtor.setAccessible(true);  // Torna acessível
    Singleton copia = construtor.newInstance();  // ❌ Exceção!
} catch (Exception e) {
    // IllegalStateException: "Singleton já inicializado"
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Construtor Privado

✅ **Use construtor privado para:**

1. **Singleton:** Única instância global
   ```java
   class AppConfig {
       private static final AppConfig INSTANCE = new AppConfig();
       private AppConfig() { }
       public static AppConfig getInstance() { return INSTANCE; }
   }
   ```

2. **Utility Classes:** Apenas métodos static
   ```java
   class FileUtils {
       private FileUtils() { throw new AssertionError(); }
       public static String readFile(String path) { ... }
   }
   ```

3. **Factory Methods:** Criação controlada
   ```java
   class Pessoa {
       private Pessoa() { }
       public static Pessoa criar(String nome) { return new Pessoa(); }
   }
   ```

4. **Builder Pattern:** Construção fluente
   ```java
   class Produto {
       private Produto(Builder b) { }
       public static Builder builder() { return new Builder(); }
   }
   ```

### Quando Evitar Construtor Privado

❌ **Evite quando:**

1. **Herança Necessária:** Subclasses não podem chamar construtor privado
2. **Frameworks Exigem Construtor Público:** JPA, Jackson precisam de construtor sem argumentos acessível
3. **Testabilidade:** Construtor privado dificulta testes unitários (use dependency injection)

---

## ⚠️ Limitações e Considerações

### Serialização e Singleton

```java
class Singleton implements Serializable {
    private static final Singleton INSTANCIA = new Singleton();

    private Singleton() { }

    public static Singleton getInstance() { return INSTANCIA; }

    // Protege contra desserialização criando nova instância
    private Object readResolve() {
        return INSTANCIA;
    }
}
```

### Testes Unitários

Singletons dificultam testes:

```java
// Difícil testar - dependência estática
class Service {
    public void processar() {
        Database db = Database.getInstance();  // Acoplamento rígido
        db.salvar();
    }
}

// Melhor - dependency injection
class Service {
    private Database db;

    public Service(Database db) {
        this.db = db;
    }

    public void processar() {
        db.salvar();  // Pode injetar mock em testes
    }
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Modificadores de Acesso

- `private`: Apenas classe pode chamar
- `protected`: Subclasses podem chamar (útil para herança)
- package-private: Classes do mesmo pacote
- `public`: Qualquer código (padrão)

### Relação com Métodos Estáticos

Construtor privado geralmente acompanhado de método estático:

```java
class Exemplo {
    private Exemplo() { }

    public static Exemplo criar() {
        return new Exemplo();  // Método estático pode chamar construtor privado
    }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Dependency Injection:** Alternativa a Singleton
- **Factory Pattern:** Criação via classes dedicadas
- **Abstract Factory:** Famílias de objetos relacionados
- **Prototype Pattern:** Clonagem em vez de construtor

---

## 📚 Conclusão

Construtor privado (`private Classe()`) impede instanciação direta via `new` por código externo, forçando criação controlada internamente - usado em Singleton (única instância), Factory Methods (criação nomeada), Builder (construção fluente), e Utility Classes (prevenir instanciação).

Dominar construtor privado significa:
- Declarar com `private Classe() { }` para impedir new externo
- Usar em Singleton com instância estática: `private static final INSTANCE`
- Combinar com factory methods para criação controlada e nomeada
- Builder Pattern com construtor privado acessível apenas ao builder
- Utility classes com construtor privado + `throw new AssertionError()`
- Prevenir reflection com verificação no construtor
- Proteger serialização de Singleton com `readResolve()`
- Reconhecer que herança fica impossível (construtor privado inacessível a subclasses)
- Enum é forma moderna de Singleton (thread-safe, anti-reflection, anti-serialização)
- Método `getInstance()` ou factory methods são pontos de acesso públicos

Construtor privado inverte controle: em vez de "qualquer código cria quando quiser" (`public`), torna-se "apenas classe decide quando/como criar" (`private`). É barreira intencional - forçar que criação passe por gateway controlado (`getInstance()`, `builder()`, factory methods). Singleton garante uma instância, utility class garante zero instâncias, factory garante criação validada. Construtor privado não proíbe criação, proíbe criação descontrolada - transforma construtor de porta aberta em porta com porteiro.
