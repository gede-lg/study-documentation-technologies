# T8.04 - Uso Prático de Blocos de Inicialização

## Introdução e Definição

Embora blocos de inicialização (tanto estáticos quanto de instância) possam parecer recursos avançados ou raramente usados, eles têm **aplicações práticas reais** em desenvolvimento Java profissional. Compreender **quando** e **como** usar blocos de inicialização de forma efetiva pode tornar seu código mais **limpo**, **manutenível** e **expressivo**.

Os principais usos práticos incluem:
- **Inicialização de coleções e estruturas complexas**
- **Configuração de recursos compartilhados** (conexões, caches)
- **Setup de bibliotecas e drivers** (JDBC, JNI)
- **Inicialização comum entre construtores**
- **Logging e monitoramento** de criação de objetos
- **Padrão Singleton** com thread-safety
- **Classes anônimas e double-brace initialization**
- **Configuração de teste unitário**

Este tópico explora **casos de uso reais**, **padrões de design** e **melhores práticas** para aplicar blocos de inicialização de forma efetiva em projetos do mundo real.

**Exemplo Prático - Inicialização de Cache**:
```java
public class CacheProdutos {
    private static Map<Integer, Produto> cache;
    private static final int TAMANHO_CACHE = 1000;

    // Inicialização complexa de cache estático
    static {
        System.out.println("Inicializando cache de produtos...");
        cache = new LinkedHashMap<>(TAMANHO_CACHE, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, Produto> eldest) {
                return size() > TAMANHO_CACHE;
            }
        };
        carregarProdutosPopulares();
        System.out.println("Cache inicializado com " + cache.size() + " produtos");
    }

    private static void carregarProdutosPopulares() {
        // Carrega produtos do banco
        List<Produto> produtos = ProdutoDAO.buscarPopulares(100);
        for (Produto p : produtos) {
            cache.put(p.getId(), p);
        }
    }

    public static Produto buscar(int id) {
        return cache.computeIfAbsent(id, ProdutoDAO::buscarPorId);
    }
}
```

---

## 10 Fundamentos Teóricos

### 1. Inicialização de Coleções Imutáveis

Blocos de inicialização são ideais para criar **coleções imutáveis** com valores pré-definidos.

```java
public class Constantes {
    // Coleção imutável de códigos de erro
    public static final Map<String, String> CODIGOS_ERRO;

    static {
        Map<String, String> temp = new HashMap<>();
        temp.put("E001", "Usuário não encontrado");
        temp.put("E002", "Senha inválida");
        temp.put("E003", "Sessão expirada");
        temp.put("E004", "Permissão negada");
        temp.put("E005", "Recurso não disponível");

        // Torna imutável
        CODIGOS_ERRO = Collections.unmodifiableMap(temp);
    }

    public static String obterMensagem(String codigo) {
        return CODIGOS_ERRO.getOrDefault(codigo, "Erro desconhecido");
    }
}

// Java 9+ pode usar Map.of(), mas blocos ainda úteis para mais de 10 entradas
```

---

### 2. Carregamento de Drivers JDBC

Um dos usos **clássicos** de blocos estáticos é carregar drivers JDBC.

```java
public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/db";
    private static final String USER = "usuario";
    private static final String PASSWORD = "senha";

    // Carrega o driver JDBC uma única vez
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("Driver JDBC carregado com sucesso");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError("Erro ao carregar driver JDBC: " + e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
```

**Nota**: Em JDBC 4.0+, o carregamento automático de drivers torna esse uso menos comum, mas ainda é visto em código legado.

---

### 3. Padrão Singleton com Initialization-on-Demand Holder

O **Holder Pattern** usa blocos estáticos implicitamente para criar Singletons **thread-safe** e **lazy**.

```java
public class ConfiguracaoSingleton {
    // Construtor privado
    private ConfiguracaoSingleton() {
        System.out.println("Inicializando Singleton...");
        carregarConfiguracoes();
    }

    // Holder interno - inicializado apenas quando acessado
    private static class Holder {
        // Bloco estático implícito inicializa INSTANCE
        private static final ConfiguracaoSingleton INSTANCE = new ConfiguracaoSingleton();
    }

    public static ConfiguracaoSingleton getInstance() {
        return Holder.INSTANCE; // Lazy e thread-safe
    }

    private void carregarConfiguracoes() {
        // Lógica de carregamento
    }
}

// getInstance() só carrega o Singleton quando chamado pela primeira vez
ConfiguracaoSingleton config = ConfiguracaoSingleton.getInstance();
```

**Vantagem**: Thread-safe sem sincronização explícita, lazy loading, eficiente.

---

### 4. Inicialização de Logging

Configurar loggers em blocos estáticos garante que logging esteja pronto antes de qualquer uso da classe.

```java
public class ServicoUsuario {
    private static final Logger logger;

    static {
        // Configura logger
        logger = LoggerFactory.getLogger(ServicoUsuario.class);
        logger.info("ServicoUsuario inicializado");
    }

    public void criarUsuario(String nome) {
        logger.debug("Criando usuário: {}", nome);
        // Lógica de criação
    }

    public void excluirUsuario(int id) {
        logger.warn("Excluindo usuário: {}", id);
        // Lógica de exclusão
    }
}
```

---

### 5. Inicialização Comum Entre Construtores

Blocos de instância permitem compartilhar lógica entre múltiplos construtores sem usar `this()`.

```java
public class Relatorio {
    private String titulo;
    private LocalDateTime dataGeracao;
    private List<String> secoes;
    private Map<String, Object> metadados;

    // Lógica comum a TODOS os construtores
    {
        dataGeracao = LocalDateTime.now();
        secoes = new ArrayList<>();
        metadados = new HashMap<>();
        metadados.put("versao", "1.0");
        metadados.put("autor", "Sistema");
        System.out.println("Relatório inicializado em " + dataGeracao);
    }

    public Relatorio(String titulo) {
        this.titulo = titulo;
    }

    public Relatorio(String titulo, List<String> secoes) {
        this.titulo = titulo;
        this.secoes.addAll(secoes);
    }
}

// Ambos os construtores executam o bloco de inicialização
```

**Alternativa**: Usar `this()` para delegar a um construtor mestre. Blocos são úteis quando a lógica não se encaixa bem em delegação.

---

### 6. Pool de Recursos e Caching

Blocos estáticos são perfeitos para inicializar **pools de recursos** ou **caches** uma única vez.

```java
public class ConnectionPool {
    private static final int POOL_SIZE = 10;
    private static final Queue<Connection> pool;
    private static final Semaphore semaforo;

    static {
        System.out.println("Inicializando pool de conexões...");
        pool = new ConcurrentLinkedQueue<>();
        semaforo = new Semaphore(POOL_SIZE);

        try {
            for (int i = 0; i < POOL_SIZE; i++) {
                Connection conn = DriverManager.getConnection("jdbc:...", "user", "pass");
                pool.offer(conn);
            }
            System.out.println("Pool inicializado com " + POOL_SIZE + " conexões");
        } catch (SQLException e) {
            throw new ExceptionInInitializerError("Erro ao criar pool: " + e);
        }
    }

    public static Connection obterConexao() throws InterruptedException {
        semaforo.acquire();
        return pool.poll();
    }

    public static void liberarConexao(Connection conn) {
        pool.offer(conn);
        semaforo.release();
    }
}
```

---

### 7. Configuração de Teste com Dados de Teste

Blocos de inicialização são úteis em testes para configurar **dados de teste** ou **mocks**.

```java
public class TesteUsuario {
    private static DatabaseServer dbServer;
    private UsuarioDAO dao;
    private List<Usuario> usuariosTeste;

    // Inicializa servidor de teste uma vez
    static {
        dbServer = new DatabaseServer();
        dbServer.start();
        System.out.println("Servidor de teste iniciado");
    }

    // Inicializa dados de teste para cada teste
    {
        usuariosTeste = new ArrayList<>();
        usuariosTeste.add(new Usuario("Ana", "ana@email.com"));
        usuariosTeste.add(new Usuario("Bruno", "bruno@email.com"));
        usuariosTeste.add(new Usuario("Carlos", "carlos@email.com"));

        dao = new UsuarioDAO(dbServer.getConnection());
    }

    @Test
    public void testarCriarUsuario() {
        // Usa usuariosTeste
    }
}
```

---

### 8. Carregamento de Bibliotecas Nativas (JNI)

Blocos estáticos são usados para carregar **bibliotecas nativas** (JNI - Java Native Interface).

```java
public class BibliotecaNativa {
    // Carrega biblioteca nativa uma vez
    static {
        try {
            System.loadLibrary("minhalib");
            System.out.println("Biblioteca nativa 'minhalib' carregada");
        } catch (UnsatisfiedLinkError e) {
            System.err.println("Erro ao carregar biblioteca nativa: " + e);
            throw e;
        }
    }

    // Métodos nativos
    public native int calcular(int a, int b);
    public native String processar(String texto);
}
```

---

### 9. Enum com Lookup Map

Blocos estáticos em enums são usados para criar **mapas de lookup** reverso.

```java
public enum Status {
    ATIVO(1, "Ativo"),
    INATIVO(2, "Inativo"),
    PENDENTE(3, "Pendente");

    private final int codigo;
    private final String descricao;
    private static final Map<Integer, Status> porCodigo;

    Status(int codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    // Bloco estático cria mapa de lookup
    static {
        porCodigo = new HashMap<>();
        for (Status s : values()) {
            porCodigo.put(s.codigo, s);
        }
    }

    public static Status buscarPorCodigo(int codigo) {
        return porCodigo.get(codigo);
    }

    public int getCodigo() { return codigo; }
    public String getDescricao() { return descricao; }
}

// Uso:
Status status = Status.buscarPorCodigo(2); // INATIVO
```

---

### 10. Inicialização de Constantes Complexas

Blocos estáticos podem calcular **constantes complexas** que dependem de múltiplos cálculos.

```java
public class Matematica {
    public static final double PI = 3.14159265359;
    public static final double E = 2.71828182846;
    public static final double[] FATORIAIS_CACHE;
    public static final Map<Integer, BigInteger> FIBONACCI_CACHE;

    static {
        // Pré-calcula fatoriais de 0 a 20
        FATORIAIS_CACHE = new double[21];
        FATORIAIS_CACHE[0] = 1;
        for (int i = 1; i <= 20; i++) {
            FATORIAIS_CACHE[i] = FATORIAIS_CACHE[i - 1] * i;
        }

        // Pré-calcula Fibonacci até 100
        FIBONACCI_CACHE = new HashMap<>();
        FIBONACCI_CACHE.put(0, BigInteger.ZERO);
        FIBONACCI_CACHE.put(1, BigInteger.ONE);
        for (int i = 2; i <= 100; i++) {
            BigInteger fib = FIBONACCI_CACHE.get(i - 1).add(FIBONACCI_CACHE.get(i - 2));
            FIBONACCI_CACHE.put(i, fib);
        }

        System.out.println("Constantes matemáticas inicializadas");
    }

    public static double fatorial(int n) {
        if (n < 0 || n > 20) {
            throw new IllegalArgumentException("n deve estar entre 0 e 20");
        }
        return FATORIAIS_CACHE[n];
    }

    public static BigInteger fibonacci(int n) {
        return FIBONACCI_CACHE.computeIfAbsent(n, k -> {
            return fibonacci(k - 1).add(fibonacci(k - 2));
        });
    }
}
```

---

## Aplicabilidade

### Quando Usar Blocos Estáticos

1. **Inicialização de Coleções Imutáveis**:
   ```java
   static {
       Map<String, String> temp = new HashMap<>();
       // Preencher map
       CONSTANTES = Collections.unmodifiableMap(temp);
   }
   ```

2. **Carregamento de Recursos** (drivers, bibliotecas, configurações):
   ```java
   static {
       Class.forName("com.mysql.jdbc.Driver");
   }
   ```

3. **Padrão Singleton** (Holder Pattern):
   ```java
   private static class Holder {
       static final Singleton INSTANCE = new Singleton();
   }
   ```

4. **Pool de Recursos**:
   ```java
   static {
       pool = criarPoolConexoes();
   }
   ```

5. **Pré-cálculo de Valores**:
   ```java
   static {
       CACHE_FATORIAIS = calcularFatoriais(100);
   }
   ```

### Quando Usar Blocos de Instância

1. **Lógica Comum Entre Construtores**:
   ```java
   {
       this.id = gerarId();
       this.dataCriacao = LocalDateTime.now();
   }
   ```

2. **Inicialização de Coleções de Instância**:
   ```java
   {
       this.lista = new ArrayList<>();
       this.lista.add("valor padrão");
   }
   ```

3. **Configuração de Atributos Antes do Construtor**:
   ```java
   {
       configurarPadrao();
   }
   ```

4. **Classes Anônimas** (double-brace initialization - usar com cautela):
   ```java
   List<String> lista = new ArrayList<>() {{
       add("item1");
       add("item2");
   }};
   ```

### Quando NÃO Usar

1. **Inicialização Simples**: Use inicialização direta.
2. **Lógica Específica de Um Construtor**: Use o próprio construtor.
3. **Operações Muito Pesadas em Blocos Estáticos**: Considere lazy loading.
4. **Double-Brace Initialization em Produção**: Pode causar memory leaks.

---

## Armadilhas Comuns

### 1. Double-Brace Initialization Causa Memory Leak

```java
// EVITAR: Cria classe anônima que mantém referência à classe externa
Map<String, String> map = new HashMap<>() {{
    put("a", "1");
    put("b", "2");
}};

// PREFERIR: Java 9+
Map<String, String> map = Map.of("a", "1", "b", "2");

// Ou tradicional
Map<String, String> map = new HashMap<>();
map.put("a", "1");
map.put("b", "2");
```

---

### 2. Operações Pesadas em Blocos Estáticos

```java
// EVITAR: Bloqueia carregamento da classe
static {
    carregarDadosMassivos(); // Demora 10 segundos
}

// PREFERIR: Lazy loading
private static Data dados;
public static Data getDados() {
    if (dados == null) {
        dados = carregarDadosMassivos();
    }
    return dados;
}
```

---

### 3. Exceções Não Tratadas em Blocos Estáticos

```java
static {
    throw new RuntimeException("Erro!"); // Impede carregamento da classe
}

// PREFERIR: Tratar exceções
static {
    try {
        inicializar();
    } catch (Exception e) {
        logger.error("Erro na inicialização", e);
        // Fallback ou re-lançar como RuntimeException
    }
}
```

---

### 4. Dependências Circulares Entre Classes

```java
class A {
    static B b = new B();
}

class B {
    static A a = new A(); // Dependência circular!
}
```

---

### 5. Ordem de Inicialização de Atributos Estáticos

```java
static int b = a + 1; // 'a' ainda é 0!
static int a = 10;

// CORRETO:
static int a = 10;
static int b = a + 1; // b = 11
```

---

## Boas Práticas

### 1. Use Blocos Estáticos Para Recursos Compartilhados

```java
static {
    logger = configurarLogger();
    cache = inicializarCache();
}
```

---

### 2. Documente Blocos Complexos

```java
/**
 * Inicializa o pool de conexões com 10 conexões.
 * Executado uma vez ao carregar a classe.
 */
static {
    pool = criarPool(10);
}
```

---

### 3. Trate Exceções Adequadamente

```java
static {
    try {
        recurso = carregar();
    } catch (Exception e) {
        logger.error("Erro ao carregar recurso", e);
        recurso = fallback();
    }
}
```

---

### 4. Prefira final Para Constantes

```java
private static final Map<String, String> CONFIG;

static {
    CONFIG = carregarConfig();
}
```

---

### 5. Use Holder Pattern Para Singletons

```java
private static class Holder {
    static final Singleton INSTANCE = new Singleton();
}
```

---

### 6. Evite Double-Brace Initialization em Produção

Use `Map.of()`, `List.of()` ou inicialização tradicional.

---

### 7. Considere Lazy Initialization Para Recursos Pesados

```java
public static synchronized Recurso getRecurso() {
    if (recurso == null) {
        recurso = inicializar();
    }
    return recurso;
}
```

---

### 8. Use Blocos de Instância Para Lógica Comum

```java
{
    this.id = UUID.randomUUID();
    this.dataCriacao = LocalDateTime.now();
}
```

---

### 9. Log Inicializações Importantes

```java
static {
    logger.info("Cache inicializado com {} entradas", cache.size());
}
```

---

### 10. Teste Comportamento de Inicialização

Escreva testes para garantir que blocos de inicialização funcionem corretamente.

---

## Resumo Executivo

Blocos de inicialização têm **aplicações práticas reais** em desenvolvimento Java profissional:

**Blocos Estáticos** (executados uma vez ao carregar a classe):
1. **Inicialização de coleções imutáveis** com valores pré-definidos
2. **Carregamento de drivers** JDBC e bibliotecas nativas (JNI)
3. **Padrão Singleton** (Holder Pattern) thread-safe e lazy
4. **Configuração de logging** e monitoramento
5. **Pool de recursos** (conexões, threads)
6. **Caching e pré-cálculo** de valores constantes
7. **Enum lookup maps** para busca reversa

**Blocos de Instância** (executados toda criação de objeto):
1. **Lógica comum entre construtores** sem usar `this()`
2. **Inicialização de coleções de instância** com valores padrão
3. **Configuração de atributos** antes do construtor
4. **Geração de IDs únicos** e timestamps
5. **Setup de teste** com dados de teste

**Padrões de Design**:
- **Singleton Holder Pattern**: Thread-safe e lazy com bloco estático implícito
- **Resource Pool**: Inicialização única de pools de conexões/threads
- **Immutable Collections**: Criar e popular coleções imutáveis

**Boas Práticas**:
- Use blocos estáticos para **recursos compartilhados**
- Use blocos de instância para **lógica comum** entre construtores
- **Documente** blocos complexos
- **Trate exceções** adequadamente
- Prefira **`final`** para constantes
- Evite **double-brace initialization** em produção
- Considere **lazy initialization** para recursos pesados
- **Log** inicializações importantes

**Armadilhas**:
- Double-brace initialization causa **memory leaks**
- Operações pesadas em blocos estáticos **bloqueiam** carregamento
- Exceções não tratadas **impedem** carregamento da classe
- **Dependências circulares** entre classes
- **Ordem de inicialização** de atributos estáticos importa

**Quando Usar**:
- Blocos estáticos: Recursos compartilhados, configuração única, caching
- Blocos de instância: Lógica comum entre construtores, setup de objetos

**Quando NÃO Usar**:
- Inicialização simples (use inicialização direta)
- Lógica específica de um construtor (use o construtor)
- Operações muito pesadas (use lazy loading)

Blocos de inicialização, quando usados adequadamente, tornam o código mais **limpo**, **expressivo** e **manutenível**, centralizando lógica de setup e garantindo inicialização consistente.
