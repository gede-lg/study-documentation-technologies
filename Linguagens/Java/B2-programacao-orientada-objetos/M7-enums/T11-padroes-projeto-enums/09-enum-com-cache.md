# 💾 Enum com Cache

## 🎯 Introdução

Enums podem atuar como **cache singleton global** para armazenar dados **calculados ou buscados** de forma eficiente, aproveitando a garantia da JVM de **instância única** e **thread-safety automática**. Este padrão é útil para **cachear resultados de computações caras**, **lookups de configurações**, **mapeamentos estáticos** e **dados pré-calculados**, evitando repetição de operações custosas.

### Motivação

**Problema: Computação Repetitiva**

```java
// ❌ Calcula fibonacci toda vez que precisa
public int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);  // Exponencial O(2^n)!
}

// Cada chamada recalcula tudo
int resultado1 = fibonacci(40);  // ~2 segundos
int resultado2 = fibonacci(40);  // Mais ~2 segundos (recalcula!)
```

**Solução: Enum como Cache**

```java
// ✅ Pré-calcula e cacheia
public enum FibonacciCache {
    INSTANCE;

    private final long[] cache = new long[100];

    FibonacciCache() {
        // Calcula uma vez no class loading
        cache[0] = 0;
        cache[1] = 1;
        for (int i = 2; i < cache.length; i++) {
            cache[i] = cache[i-1] + cache[i-2];
        }
    }

    public long get(int n) {
        if (n < 0 || n >= cache.length) {
            throw new IllegalArgumentException("n fora do range");
        }
        return cache[n];  // O(1) - instantâneo!
    }
}

// Uso
long resultado = FibonacciCache.INSTANCE.get(40);  // Instantâneo
```

## 📋 Fundamentos Teóricos

### Por Que Enum para Cache?

**1. Singleton Garantido pela JVM**

Enum garante instância única automaticamente, sem código boilerplate.

```java
// Enum = singleton automático
public enum Cache { INSTANCE; }

// vs classe tradicional (muito código)
public class Cache {
    private static volatile Cache instance;
    private Cache() {}
    public static Cache getInstance() {
        if (instance == null) {
            synchronized (Cache.class) {
                if (instance == null) {
                    instance = new Cache();
                }
            }
        }
        return instance;
    }
}
```

**2. Thread-Safety Automática**

Inicialização de enum é thread-safe por padrão, sem necessidade de `synchronized`.

**3. Lazy Initialization via Class Loading**

Cache é inicializado apenas quando enum é primeiro acessado.

**4. Serialização Segura**

Enums mantêm singleton mesmo após deserialização.

## 🔍 Exemplos Práticos

### Cache de Expressões Regulares

```java
public enum RegexCache {
    EMAIL("^[A-Za-z0-9+_.-]+@(.+)$"),
    TELEFONE("\\(\\d{2}\\) \\d{4,5}-\\d{4}"),
    CPF("\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}"),
    CEP("\\d{5}-\\d{3}"),
    URL("https?://[\\w.-]+\\.\\w+");

    private final Pattern pattern;

    RegexCache(String regex) {
        // Pattern compilado apenas uma vez
        this.pattern = Pattern.compile(regex);
    }

    public boolean matches(String input) {
        return pattern.matcher(input).matches();
    }

    public Matcher matcher(String input) {
        return pattern.matcher(input);
    }

    public Pattern getPattern() {
        return pattern;
    }
}

// Uso - Pattern já compilado, sem overhead
boolean emailValido = RegexCache.EMAIL.matches("user@example.com");
Matcher matcher = RegexCache.CPF.matcher("123.456.789-00");
```

### Cache de DateTimeFormatter

```java
public enum FormatoDataCache {
    DATA_CURTA("dd/MM/yy"),
    DATA_LONGA("dd 'de' MMMM 'de' yyyy"),
    DATA_HORA("dd/MM/yyyy HH:mm:ss"),
    ISO_8601("yyyy-MM-dd'T'HH:mm:ss"),
    HORA_MINUTO("HH:mm"),
    MES_ANO("MM/yyyy");

    private final DateTimeFormatter formatter;

    FormatoDataCache(String pattern) {
        // Formatter criado apenas uma vez
        this.formatter = DateTimeFormatter.ofPattern(pattern);
    }

    public String formatar(LocalDateTime dateTime) {
        return dateTime.format(formatter);
    }

    public String formatar(LocalDate date) {
        return date.format(formatter);
    }

    public LocalDateTime parsear(String texto) {
        return LocalDateTime.parse(texto, formatter);
    }

    public DateTimeFormatter getFormatter() {
        return formatter;
    }
}

// Uso - sem criar formatter toda vez
String dataFormatada = FormatoDataCache.DATA_LONGA.formatar(LocalDateTime.now());
// "26 de janeiro de 2025"
```

### Cache de Cálculos Matemáticos

```java
public enum FatorialCache {
    INSTANCE;

    private final long[] cache = new long[21];  // 0! até 20!

    FatorialCache() {
        cache[0] = 1;
        for (int i = 1; i < cache.length; i++) {
            cache[i] = cache[i - 1] * i;
        }
    }

    public long get(int n) {
        if (n < 0 || n >= cache.length) {
            throw new IllegalArgumentException(
                "Fatorial só suportado para 0 <= n <= 20"
            );
        }
        return cache[n];
    }
}

// Uso
long fatorial10 = FatorialCache.INSTANCE.get(10);  // 3628800
```

### Cache de Números Primos

```java
public enum PrimosCache {
    INSTANCE;

    private final List<Integer> primos;

    PrimosCache() {
        // Gera primos até 10000 usando Crivo de Eratóstenes
        boolean[] ehPrimo = new boolean[10001];
        Arrays.fill(ehPrimo, true);
        ehPrimo[0] = ehPrimo[1] = false;

        for (int i = 2; i * i <= 10000; i++) {
            if (ehPrimo[i]) {
                for (int j = i * i; j <= 10000; j += i) {
                    ehPrimo[j] = false;
                }
            }
        }

        List<Integer> lista = new ArrayList<>();
        for (int i = 2; i <= 10000; i++) {
            if (ehPrimo[i]) {
                lista.add(i);
            }
        }

        this.primos = Collections.unmodifiableList(lista);
    }

    public List<Integer> todos() {
        return primos;
    }

    public boolean ehPrimo(int n) {
        if (n <= 1 || n > 10000) return false;
        return Collections.binarySearch(primos, n) >= 0;
    }

    public int quantosPrimos() {
        return primos.size();
    }

    public int primoPorIndice(int indice) {
        return primos.get(indice);
    }
}

// Uso
List<Integer> primos = PrimosCache.INSTANCE.todos();
boolean eh97Primo = PrimosCache.INSTANCE.ehPrimo(97);  // true
```

### Cache de Configurações Carregadas

```java
public enum ConfigCache {
    INSTANCE;

    private final Properties properties;

    ConfigCache() {
        properties = new Properties();
        try (InputStream input = getClass().getResourceAsStream("/application.properties")) {
            if (input != null) {
                properties.load(input);
            } else {
                System.err.println("Arquivo de configuração não encontrado");
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao carregar configurações", e);
        }
    }

    public String get(String chave) {
        return properties.getProperty(chave);
    }

    public String get(String chave, String valorPadrao) {
        return properties.getProperty(chave, valorPadrao);
    }

    public int getInt(String chave, int valorPadrao) {
        String valor = properties.getProperty(chave);
        return valor != null ? Integer.parseInt(valor) : valorPadrao;
    }

    public boolean getBoolean(String chave, boolean valorPadrao) {
        String valor = properties.getProperty(chave);
        return valor != null ? Boolean.parseBoolean(valor) : valorPadrao;
    }
}

// Uso - properties carregado apenas uma vez
String dbHost = ConfigCache.INSTANCE.get("database.host");
int poolSize = ConfigCache.INSTANCE.getInt("pool.size", 10);
```

### Cache de Mapeamentos Complexos

```java
public enum CodigoPostalCache {
    INSTANCE;

    private final Map<String, Cidade> porCep;

    CodigoPostalCache() {
        Map<String, Cidade> map = new HashMap<>();

        // Carrega de arquivo/API/banco (simulado)
        map.put("01310-100", new Cidade("São Paulo", "SP"));
        map.put("20040-020", new Cidade("Rio de Janeiro", "RJ"));
        map.put("30130-100", new Cidade("Belo Horizonte", "MG"));
        // ... milhares de entradas

        this.porCep = Collections.unmodifiableMap(map);
    }

    public Optional<Cidade> buscarPorCep(String cep) {
        return Optional.ofNullable(porCep.get(cep));
    }

    public Set<String> todosCeps() {
        return porCep.keySet();
    }
}

class Cidade {
    private final String nome;
    private final String uf;

    Cidade(String nome, String uf) {
        this.nome = nome;
        this.uf = uf;
    }

    // getters...
}

// Uso
Optional<Cidade> cidade = CodigoPostalCache.INSTANCE.buscarPorCep("01310-100");
cidade.ifPresent(c -> System.out.println(c.getNome()));  // São Paulo
```

## 🎯 Cache com Lazy Loading Interno

```java
public enum MessageDigestCache {
    INSTANCE;

    private final Map<String, MessageDigest> cache = new ConcurrentHashMap<>();

    public MessageDigest get(String algoritmo) {
        return cache.computeIfAbsent(algoritmo, alg -> {
            try {
                return MessageDigest.getInstance(alg);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("Algoritmo inválido: " + alg, e);
            }
        });
    }

    public String hash(String algoritmo, String texto) {
        MessageDigest md = get(algoritmo);
        byte[] bytes = md.digest(texto.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(bytes);
    }
}

// Uso
String hashSHA256 = MessageDigestCache.INSTANCE.hash("SHA-256", "senha123");
```

## 💡 Cache com Expiração (Híbrido)

```java
public enum TemporaryCache {
    INSTANCE;

    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private final long ttlMillis = 60_000;  // 1 minuto

    public void put(String chave, Object valor) {
        cache.put(chave, new CacheEntry(valor, System.currentTimeMillis() + ttlMillis));
    }

    public Optional<Object> get(String chave) {
        CacheEntry entry = cache.get(chave);
        if (entry == null) {
            return Optional.empty();
        }

        if (System.currentTimeMillis() > entry.expiracao) {
            cache.remove(chave);  // Expirado
            return Optional.empty();
        }

        return Optional.of(entry.valor);
    }

    public void clear() {
        cache.clear();
    }

    private static class CacheEntry {
        final Object valor;
        final long expiracao;

        CacheEntry(Object valor, long expiracao) {
            this.valor = valor;
            this.expiracao = expiracao;
        }
    }
}

// Uso
TemporaryCache.INSTANCE.put("chave", "valor");
Optional<Object> valor = TemporaryCache.INSTANCE.get("chave");
```

## ⚡ Vantagens

**1. Singleton Automático**
- Sem código boilerplate de singleton

**2. Thread-Safety**
- Inicialização thread-safe garantida pela JVM

**3. Lazy Initialization**
- Cache criado apenas quando enum é primeiro acessado

**4. Performance**
- Dados pré-calculados ou pré-carregados

**5. Serialização Segura**
- Singleton mantido após deserialização

## ⚠️ Considerações

**1. Memória**
```java
// Cache consome memória permanentemente
// Avaliar tamanho do cache vs benefício
```

**2. Dados Estáticos**
```java
// Ideal para dados imutáveis/raros de mudar
// Para dados dinâmicos, considere cache com TTL
```

**3. Inicialização Pesada**
```java
// Se inicialização for muito cara, pode atrasar class loading
// Considere lazy loading interno com computeIfAbsent
```

## 🔗 Interconexões

**Relação com Singleton**: Enum é singleton perfeito

**Relação com Lazy Initialization**: Class loading oferece lazy init

**Relação com Memoization**: Cache de resultados calculados
