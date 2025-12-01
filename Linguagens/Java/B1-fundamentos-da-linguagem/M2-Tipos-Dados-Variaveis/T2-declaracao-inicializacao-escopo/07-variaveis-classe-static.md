# Variáveis de Classe (static)

## 🎯 Introdução e Definição

### Definição Conceitual

**Variáveis de classe** (ou **campos estáticos**) são declaradas com o modificador **`static`** e pertencem à **classe**, não aos objetos individuais. Existe **uma única cópia compartilhada** entre todas as instâncias da classe, sendo alocada na memória quando a classe é carregada pela JVM.

**Sintaxe**:
```java
public class Exemplo {
    private static int contador;  // Variável de classe
}
```

**Acesso**:
```java
NomeDaClasse.variavel;  // ✅ Forma recomendada
objeto.variavel;        // ⚠️ Funciona, mas não recomendado (gera warning)
```

**Diferença Fundamental**:
- **Variável de instância** (não-static): Cada objeto tem **sua própria cópia**
- **Variável de classe** (static): **Uma única cópia** compartilhada entre todos os objetos

### Características Fundamentais

| Característica | Variável de Instância | Variável de Classe (static) |
|----------------|----------------------|----------------------------|
| **Declaração** | `private int campo;` | `private static int campo;` |
| **Cópias** | Uma por objeto | **Uma única compartilhada** |
| **Memória** | Heap (objeto) | Metaspace (Java 8+) / PermGen (Java 7-) |
| **Tempo de vida** | Enquanto objeto existe | Durante execução do programa |
| **Inicialização** | A cada criação de objeto | **Uma vez** (carregamento da classe) |
| **Acesso** | `objeto.campo` ou `this.campo` | `NomeClasse.campo` |
| **Uso em métodos static** | ❌ NÃO | ✅ SIM |

### Contexto Histórico

**Java 1.0 (1995)**: Conceito herdado de C++ (`static` members), adaptado para Java:
- **Compartilhamento de estado**: Dados comuns a todas as instâncias
- **Utilitários**: Métodos que não dependem de estado de objeto (`Math.sqrt()`, `Collections.sort()`)
- **Constantes**: Valores fixos compartilhados (`Math.PI`, `Integer.MAX_VALUE`)

**Evolução**:
- **Java 7-**: PermGen (Permanent Generation) para armazenar campos static
- **Java 8+**: Metaspace (substituiu PermGen, gerenciamento de memória nativa)

### Problema Fundamental que Resolve

#### Compartilhamento de Estado

**Sem `static`** (cada objeto teria cópia própria):
```java
public class Produto {
    private int contador;  // ❌ Cada produto teria seu próprio contador
    
    public Produto() {
        contador++;  // ⚠️ Cada objeto incrementa seu próprio contador (inútil)
    }
}
```

**Com `static`** (contador compartilhado):
```java
public class Produto {
    private static int contador = 0;  // ✅ Contador compartilhado
    
    public Produto() {
        contador++;  // ✅ Incrementa contador global
    }
}
```

---

## 📋 Sumário Conceitual

### Declaração de Variáveis Static

**Sintaxe Básica**:
```java
public class Exemplo {
    private static int contador;           // Variável de classe
    public static String mensagem;         // Variável pública
    protected static double taxa;          // Variável protegida
    static boolean flag;                   // Padrão (package-private)
}
```

### Constantes Static Final

**Sintaxe**:
```java
public class Constantes {
    public static final int MAX = 100;               // Constante inteira
    public static final double PI = 3.14159;         // Constante decimal
    public static final String VERSAO = "1.0.0";     // Constante String
}
```

### Acesso a Variáveis Static

**Dentro da classe**:
```java
public class Contador {
    private static int total = 0;
    
    public void incrementar() {
        total++;  // ✅ Acesso direto
    }
}
```

**Fora da classe**:
```java
Contador.total;  // ✅ Forma recomendada (nome da classe)

Contador obj = new Contador();
obj.total;       // ⚠️ Funciona, mas gera warning (confunde instância com classe)
```

---

## 🧠 Fundamentos Teóricos

### 1. Tempo de Vida de Variáveis Static

**Ciclo de Vida**:
1. **Carregamento da classe**: JVM carrega a classe (primeira referência)
2. **Inicialização static**: Blocos static e variáveis static são inicializados
3. **Permanência**: Variável existe durante toda execução do programa
4. **Descarregamento** (raro): Classe pode ser descarregada se não mais referenciada

**Exemplo**:
```java
public class Exemplo {
    private static int contador = 0;
    
    static {
        System.out.println("Classe Exemplo carregada!");
        contador = 10;
    }
}
```

**Primeira referência à classe**:
```java
Exemplo obj = new Exemplo();  // Carrega classe, imprime "Classe Exemplo carregada!"
// contador = 10
```

### 2. Memória: Metaspace vs Heap

**Variáveis de Instância** (Heap):
```java
public class Pessoa {
    private String nome;  // Heap (cada objeto)
}

Pessoa p1 = new Pessoa();  // nome de p1 no Heap
Pessoa p2 = new Pessoa();  // nome de p2 no Heap (cópias independentes)
```

**Variáveis de Classe** (Metaspace):
```java
public class Contador {
    private static int total;  // Metaspace (única cópia)
}

Contador c1 = new Contador();  // total na Metaspace (compartilhado)
Contador c2 = new Contador();  // total na Metaspace (mesma variável)
```

### 3. Inicialização de Variáveis Static

**Ordem de Inicialização**:
1. **Valores padrão** (0, false, null)
2. **Inicializadores inline** (declaração com `=`)
3. **Blocos static** (`static {}`)

**Exemplo**:
```java
public class Ordem {
    private static int a;                // 1️⃣ Padrão: 0
    private static int b = 10;           // 2️⃣ Inline: 10
    private static int c;
    
    static {
        c = 20;                          // 3️⃣ Bloco static: 20
        System.out.println("a=" + a + ", b=" + b + ", c=" + c);
    }
}
```

**Primeira referência à classe**:
```
Saída: a=0, b=10, c=20
```

### 4. Métodos Static e Acesso a Variáveis

**Regra**: Métodos `static` **podem** acessar variáveis `static`, mas **não podem** acessar variáveis de instância diretamente.

**Permitido**:
```java
public class Exemplo {
    private static int varStatic = 10;
    private int varInstancia = 20;
    
    public static void metodoStatic() {
        System.out.println(varStatic);  // ✅ OK (ambos static)
    }
}
```

**NÃO Permitido**:
```java
public class Exemplo {
    private static int varStatic = 10;
    private int varInstancia = 20;
    
    public static void metodoStatic() {
        System.out.println(varInstancia);  // ❌ ERRO: non-static field cannot be referenced from static context
    }
}
```

**Solução**: Passar objeto como parâmetro.
```java
public static void metodoStatic(Exemplo obj) {
    System.out.println(obj.varInstancia);  // ✅ OK (acesso via objeto)
}
```

---

## 🔍 Análise Conceitual Profunda

### Compartilhamento entre Instâncias

**Exemplo**: Contador compartilhado.

```java
public class Produto {
    private static int totalProdutos = 0;  // Compartilhado
    
    private String nome;
    private double preco;
    
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
        totalProdutos++;  // Incrementa contador compartilhado
    }
    
    public static int getTotalProdutos() {
        return totalProdutos;
    }
}
```

**Uso**:
```java
Produto p1 = new Produto("Notebook", 3000);  // totalProdutos = 1
Produto p2 = new Produto("Mouse", 50);       // totalProdutos = 2
Produto p3 = new Produto("Teclado", 150);    // totalProdutos = 3

System.out.println(Produto.getTotalProdutos());  // 3
```

### Constantes de Classe

**Padrão**: Usar `static final` para constantes.

```java
public class Configuracao {
    public static final int TIMEOUT = 5000;
    public static final String VERSAO = "1.0.0";
    public static final double PI = 3.14159265359;
    
    public static final int MAX_TENTATIVAS_LOGIN = 3;
    public static final int IDADE_MINIMA = 18;
}
```

**Acesso**:
```java
if (tentativas >= Configuracao.MAX_TENTATIVAS_LOGIN) {
    // Bloquear usuário
}
```

### Variáveis Static vs Singleton Pattern

**Variável static** (estado compartilhado):
```java
public class Contador {
    private static int total = 0;  // Compartilhado
}
```

**Singleton** (instância única):
```java
public class Singleton {
    private static Singleton instancia;  // Instância única
    
    private Singleton() {}  // Construtor privado
    
    public static Singleton getInstancia() {
        if (instancia == null) {
            instancia = new Singleton();
        }
        return instancia;
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Contador de Instâncias

```java
public class Usuario {
    private static int totalUsuarios = 0;
    
    private String nome;
    private String email;
    
    public Usuario(String nome, String email) {
        this.nome = nome;
        this.email = email;
        totalUsuarios++;
    }
    
    public static int getTotalUsuarios() {
        return totalUsuarios;
    }
}
```

**Uso**:
```java
Usuario u1 = new Usuario("João", "joao@mail.com");
Usuario u2 = new Usuario("Maria", "maria@mail.com");

System.out.println(Usuario.getTotalUsuarios());  // 2
```

### Caso 2: Configurações Globais

```java
public class AppConfig {
    // Configurações compartilhadas
    private static String ambiente = "producao";
    private static int maxConexoes = 100;
    private static boolean logAtivo = true;
    
    public static String getAmbiente() {
        return ambiente;
    }
    
    public static void setAmbiente(String amb) {
        ambiente = amb;
    }
}
```

**Uso**:
```java
AppConfig.setAmbiente("desenvolvimento");
System.out.println(AppConfig.getAmbiente());  // "desenvolvimento"
```

### Caso 3: Constantes da Aplicação

```java
public class Constantes {
    // Constantes HTTP
    public static final int HTTP_OK = 200;
    public static final int HTTP_NOT_FOUND = 404;
    public static final int HTTP_ERROR = 500;
    
    // Constantes de negócio
    public static final double TAXA_IMPOSTO = 0.15;
    public static final int IDADE_MINIMA = 18;
    public static final String MOEDA_PADRAO = "BRL";
}
```

**Uso**:
```java
if (statusCode == Constantes.HTTP_OK) {
    // Processar resposta
}
```

### Caso 4: Singleton Pattern

```java
public class DatabaseConnection {
    private static DatabaseConnection instancia;
    
    private Connection connection;
    
    private DatabaseConnection() {
        // Inicializar conexão
        this.connection = DriverManager.getConnection(url);
    }
    
    public static DatabaseConnection getInstancia() {
        if (instancia == null) {
            instancia = new DatabaseConnection();
        }
        return instancia;
    }
    
    public Connection getConnection() {
        return connection;
    }
}
```

**Uso**:
```java
DatabaseConnection db = DatabaseConnection.getInstancia();
Connection conn = db.getConnection();
```

### Caso 5: Bloco Static Inicializador

```java
public class CacheService {
    private static Map<String, Object> cache;
    
    static {
        System.out.println("Inicializando cache...");
        cache = new HashMap<>();
        cache.put("config", carregarConfiguracao());
        cache.put("usuarios", carregarUsuarios());
        System.out.println("Cache inicializado!");
    }
    
    private static Object carregarConfiguracao() {
        // Carregar configuração do banco/arquivo
        return new Object();
    }
    
    private static List<String> carregarUsuarios() {
        // Carregar usuários
        return List.of("admin", "user");
    }
    
    public static Object get(String key) {
        return cache.get(key);
    }
}
```

**Primeira referência**:
```java
Object config = CacheService.get("config");  // Executa bloco static primeiro
```

---

## ⚠️ Limitações e Considerações

### 1. Thread Safety em Variáveis Static

**Problema**: Race condition em acesso concorrente.

```java
public class Contador {
    private static int total = 0;  // ⚠️ Não thread-safe
    
    public static void incrementar() {
        total++;  // ⚠️ Não atômico (read-modify-write)
    }
}
```

**Problema em ambiente multi-thread**:
```java
// Thread 1: lê total=0, incrementa, escreve total=1
// Thread 2: lê total=0, incrementa, escreve total=1
// Resultado: total=1 (esperado: 2)
```

**Solução 1**: Sincronização.
```java
public class Contador {
    private static int total = 0;
    
    public static synchronized void incrementar() {
        total++;  // ✅ Sincronizado
    }
}
```

**Solução 2**: `AtomicInteger`.
```java
public class Contador {
    private static AtomicInteger total = new AtomicInteger(0);
    
    public static void incrementar() {
        total.incrementAndGet();  // ✅ Atômico
    }
}
```

### 2. Métodos Static Não Acessam Campos de Instância

**Problema**:
```java
public class Exemplo {
    private String nome;
    
    public static void exibir() {
        System.out.println(nome);  // ❌ ERRO: non-static field cannot be referenced
    }
}
```

**Solução**: Passar objeto como parâmetro.
```java
public static void exibir(Exemplo obj) {
    System.out.println(obj.nome);  // ✅ OK
}
```

### 3. Testes Unitários com Variáveis Static

**Problema**: Estado compartilhado entre testes.

```java
public class Contador {
    private static int total = 0;
    
    public static void incrementar() {
        total++;
    }
}
```

**Teste 1**:
```java
@Test
public void teste1() {
    Contador.incrementar();
    assertEquals(1, Contador.total);  // ✅ OK
}
```

**Teste 2** (depende da ordem):
```java
@Test
public void teste2() {
    Contador.incrementar();
    assertEquals(1, Contador.total);  // ❌ FALHA se teste1 executou antes (total=2)
}
```

**Solução**: Resetar estado em `@BeforeEach`.
```java
@BeforeEach
public void reset() {
    Contador.total = 0;  // ⚠️ Requer acesso ou método reset()
}
```

### 4. Memory Leaks em Variáveis Static

**Problema**: Referências static impedem garbage collection.

```java
public class CacheService {
    private static Map<String, Object> cache = new HashMap<>();
    
    public static void adicionar(String key, Object value) {
        cache.put(key, value);  // ⚠️ Nunca removido → memory leak
    }
}
```

**Solução**: Implementar limpeza periódica.
```java
public static void limpar() {
    cache.clear();
}

public static void remover(String key) {
    cache.remove(key);
}
```

### 5. Acesso via Objeto (Warning)

**Problema**: Acesso a static via instância confunde.

```java
Contador obj = new Contador();
obj.total++;  // ⚠️ Warning: static field accessed via instance reference
```

**Solução**: Usar nome da classe.
```java
Contador.total++;  // ✅ Correto
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Variáveis de Instância**: Contraste (cópia por objeto vs compartilhada)
- **Métodos Static**: Acessam apenas variáveis static
- **Constantes**: `static final` para valores fixos
- **Singleton Pattern**: Instância única via static
- **Thread Safety**: Sincronização de campos compartilhados
- **Memória**: Metaspace vs Heap

---

## 🚀 Boas Práticas

1. ✅ **Use `static final` para constantes**
   ```java
   public static final int MAX = 100;
   ```

2. ✅ **Acesse via nome da classe, não via instância**
   ```java
   Contador.total++;  // ✅ Correto
   obj.total++;       // ❌ Confuso
   ```

3. ✅ **Sincronize acessos concorrentes**
   ```java
   private static int contador;
   public static synchronized void incrementar() {
       contador++;
   }
   ```

4. ✅ **Use `AtomicInteger` para contadores thread-safe**
   ```java
   private static AtomicInteger contador = new AtomicInteger(0);
   ```

5. ❌ **Evite variáveis static mutáveis em APIs públicas**
   ```java
   public static int contador;  // ❌ Qualquer um pode modificar
   
   private static int contador;  // ✅ Encapsulado
   public static int getContador() { return contador; }
   ```

6. ✅ **Use blocos static para inicialização complexa**
   ```java
   private static Map<String, Object> cache;
   static {
       cache = new HashMap<>();
       // Inicialização complexa
   }
   ```

7. ✅ **Documente que variável é compartilhada**
   ```java
   /** Contador compartilhado entre todas as instâncias */
   private static int totalUsuarios;
   ```

8. ❌ **Evite memory leaks em caches static**
   ```java
   private static Map<String, Object> cache = new WeakHashMap<>();  // ✅ Permite GC
   ```

9. ✅ **Prefira injeção de dependência a static em testes**
   ```java
   // ❌ Ruim (difícil testar)
   public static ConfigService config = new ConfigService();
   
   // ✅ Bom (injetável)
   private ConfigService config;
   public void setConfig(ConfigService config) { this.config = config; }
   ```
