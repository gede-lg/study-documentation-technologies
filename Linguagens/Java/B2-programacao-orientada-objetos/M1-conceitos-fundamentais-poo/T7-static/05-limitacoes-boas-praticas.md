# Limitações e Boas Práticas com static

## 🎯 Introdução e Definição

### Definição Conceitual Clara

Limitações de `static` são restrições arquiteturais que surgem de membros estáticos não terem objeto associado - impossibilidade de acessar membros de instância, falta de polimorfismo, dificuldades em testes e concorrência. **Boas práticas** são diretrizes para usar `static` apropriadamente - quando convém (constantes, utilitários) e quando evitar (estado compartilhado mutável, comportamento polimórfico).

Conceitualmente, `static` é ferramenta poderosa mas com trade-offs - simplicidade e performance (sem instância) vs flexibilidade e testabilidade (acoplamento rígido). Usar static adequadamente é reconhecer esses trade-offs e escolher conscientemente: constante `Math.PI` é perfeita como static (universal, imutável), mas estado global mutável é anti-padrão (acoplamento, race conditions).

Propósito deste conhecimento é evitar armadilhas comuns - static abuse (tudo static porque "mais simples"), memory leaks (referências static retendo objetos), untestable code (dependências estáticas rígidas). Dominar limitações e boas práticas transforma `static` de fonte de bugs em ferramenta precisa para casos apropriados.

---

## 📋 Sumário Conceitual

### Limitações Principais

1. **Sem Polimorfismo:** Static não participa de herança polimórfica
2. **Sem `this`/`super`:** Não referencia objeto/superclasse
3. **Acesso Restrito:** Apenas outros membros static
4. **Dificuldade em Testes:** Dependências estáticas difíceis de mockar
5. **Concorrência:** Compartilhamento entre threads sem sincronização
6. **Memory Leaks:** Referências static retêm objetos indefinidamente

### Boas Práticas Essenciais

1. **Constantes:** `public static final` para valores imutáveis
2. **Utilitários:** Métodos static para funções puras
3. **Factory Methods:** Static para criação controlada
4. **Evitar Estado Mutável:** Não usar static para dados que mudam
5. **Dependency Injection:** Preferir injeção a dependências static
6. **Thread-Safety:** Usar `synchronized` ou imutáveis

---

## 🧠 Fundamentos Teóricos

### Limitação 1: Sem Polimorfismo

```java
class Animal {
    static void emitirSom() {
        System.out.println("Som genérico");
    }

    void mover() {  // Método de instância - polimórfico
        System.out.println("Movendo");
    }
}

class Cachorro extends Animal {
    static void emitirSom() {  // Hiding, não Override
        System.out.println("Au au");
    }

    @Override
    void mover() {  // Override verdadeiro
        System.out.println("Correndo");
    }
}

// Polimorfismo:
Animal a = new Cachorro();
a.mover();        // "Correndo" (polimórfico - runtime)
a.emitirSom();    // "Som genérico" (não polimórfico - compile-time)

Cachorro.emitirSom();  // "Au au"
Animal.emitirSom();    // "Som genérico"
```

**Problema:** Métodos static resolvem em compile-time (tipo declarado), não runtime (tipo real). Polimorfismo exige métodos de instância.

### Limitação 2: Sem Acesso a Instância

```java
class Exemplo {
    int valorInstancia = 10;

    static int valorStatic = 20;

    static void metodoStatic() {
        System.out.println(valorStatic);  // ✅ OK

        // System.out.println(valorInstancia);  // ❌ ERRO
        // System.out.println(this.valorInstancia);  // ❌ ERRO - 'this' não existe
    }

    // Workaround: passar instância como parâmetro
    static void processar(Exemplo obj) {
        System.out.println(obj.valorInstancia);  // ✅ OK
    }
}

Exemplo e = new Exemplo();
Exemplo.processar(e);  // 10
```

### Limitação 3: Dificuldade em Testes

```java
// Código com dependência static - difícil testar
class UserService {
    void criarUsuario(String nome) {
        String id = IdGenerator.gerar();  // Dependência static rígida
        // Salvar usuário...
    }
}

class IdGenerator {
    static String gerar() {
        return UUID.randomUUID().toString();
    }
}

// Teste - impossível mockar IdGenerator.gerar()
```

**Solução: Dependency Injection**

```java
// Refatorado - testável
class UserService {
    private IdGenerator idGenerator;

    UserService(IdGenerator idGenerator) {
        this.idGenerator = idGenerator;
    }

    void criarUsuario(String nome) {
        String id = idGenerator.gerar();  // Pode injetar mock
        // Salvar usuário...
    }
}

class IdGenerator {
    String gerar() {  // Não static
        return UUID.randomUUID().toString();
    }
}

// Teste - pode injetar mock
@Test
void testCriarUsuario() {
    IdGenerator mockGenerator = mock(IdGenerator.class);
    when(mockGenerator.gerar()).thenReturn("123");

    UserService service = new UserService(mockGenerator);
    service.criarUsuario("Alice");

    // Verificações...
}
```

### Limitação 4: Concorrência (Race Conditions)

```java
// ❌ NÃO thread-safe
class Contador {
    static int total = 0;

    static void incrementar() {
        total++;  // Race condition - operação não atômica
    }
}

// Thread 1: lê 0, incrementa para 1, escreve 1
// Thread 2: lê 0 (antes de Thread 1 escrever), incrementa para 1, escreve 1
// Resultado: 1 (esperado: 2)
```

**Soluções:**

```java
// ✅ Solução 1: synchronized
class ContadorSync {
    static int total = 0;

    static synchronized void incrementar() {
        total++;  // Thread-safe
    }
}

// ✅ Solução 2: AtomicInteger
class ContadorAtomic {
    static AtomicInteger total = new AtomicInteger(0);

    static void incrementar() {
        total.incrementAndGet();  // Thread-safe
    }
}
```

### Limitação 5: Memory Leaks

```java
// ⚠️ Memory leak - cache cresce indefinidamente
class CacheProblematico {
    static Map<String, byte[]> cache = new HashMap<>();  // Nunca limpa!

    static void adicionar(String chave, byte[] dados) {
        cache.put(chave, dados);  // Acumula até OutOfMemoryError
    }
}

// ✅ Solução: limite ou WeakHashMap
class CacheSeguro {
    static Map<String, byte[]> cache = new LinkedHashMap<>(100, 0.75f, true) {
        @Override
        protected boolean removeEldestEntry(Map.Entry<String, byte[]> eldest) {
            return size() > 100;  // Limita a 100 entradas
        }
    };
}

// ✅ Alternativa: WeakHashMap (GC pode coletar)
class CacheWeak {
    static Map<String, byte[]> cache = new WeakHashMap<>();
}
```

---

## 🔍 Análise Conceitual Profunda

### Boas Práticas: Quando Usar Static

#### ✅ Prática 1: Constantes Imutáveis

```java
class Constantes {
    // ✅ Perfeito para static
    public static final double PI = 3.141592653589793;
    public static final int MAX_SIZE = 100;
    public static final String VERSAO = "2.0.1";

    // ✅ Coleções imutáveis
    public static final List<String> DIAS_SEMANA = List.of(
        "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"
    );
}
```

**Por Quê?** Constantes são universais e imutáveis - `static` é perfeito.

#### ✅ Prática 2: Métodos Utilitários (Funções Puras)

```java
class StringUtils {
    // ✅ Funções puras - entrada → saída, sem estado
    public static boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static String capitalize(String str) {
        if (isBlank(str)) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
```

**Por Quê?** Funções puras não dependem de estado - `static` evita instância desnecessária.

#### ✅ Prática 3: Factory Methods

```java
class LocalDate {
    private int ano, mes, dia;

    private LocalDate(int ano, int mes, int dia) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
    }

    // ✅ Factory methods nomeados
    public static LocalDate of(int ano, int mes, int dia) {
        return new LocalDate(ano, mes, dia);
    }

    public static LocalDate now() {
        // Obter data atual...
        return new LocalDate(2025, 11, 25);
    }

    public static LocalDate parse(String text) {
        // Parsear texto...
        return new LocalDate(2025, 1, 1);
    }
}
```

**Por Quê?** Factory methods oferecem API clara com nomes descritivos, escondendo construtores.

### Anti-Padrões: Quando Evitar Static

#### ❌ Anti-Padrão 1: Estado Mutável Global

```java
// ❌ RUIM - estado global mutável
class ConfigGlobal {
    public static String ambiente = "DEV";  // Mutável!
    public static int timeout = 30;

    public static void setAmbiente(String amb) {
        ambiente = amb;  // Qualquer código pode modificar
    }
}

// Problemas:
// - Testes interferem uns nos outros (estado compartilhado)
// - Race conditions em ambiente multi-thread
// - Difícil rastrear quem modificou

// ✅ MELHOR - instância injetada
class Config {
    private String ambiente;
    private int timeout;

    public Config(String ambiente, int timeout) {
        this.ambiente = ambiente;
        this.timeout = timeout;
    }

    public String getAmbiente() {
        return ambiente;
    }
}

// Uso via dependency injection
class Service {
    private Config config;

    Service(Config config) {
        this.config = config;
    }
}
```

#### ❌ Anti-Padrão 2: Static Abuse (Tudo Static)

```java
// ❌ RUIM - abuso de static
class Usuario {
    static String nome;
    static int idade;

    static void apresentar() {
        System.out.println(nome + ", " + idade);
    }
}

// Problema: todos "usuários" compartilham mesmo nome/idade!
Usuario.nome = "Alice";
Usuario.idade = 30;
Usuario.apresentar();  // "Alice, 30"

Usuario.nome = "Bob";  // ❌ Substituiu Alice!
Usuario.apresentar();  // "Bob, 30"

// ✅ CORRETO - atributos de instância
class Usuario {
    String nome;
    int idade;

    void apresentar() {
        System.out.println(nome + ", " + idade);
    }
}

Usuario u1 = new Usuario();
u1.nome = "Alice";
Usuario u2 = new Usuario();
u2.nome = "Bob";
// u1 e u2 independentes ✅
```

#### ❌ Anti-Padrão 3: God Class com Static

```java
// ❌ RUIM - god class estática
class Utils {
    static String formatarData(Date data) { }
    static double calcularImposto(double valor) { }
    static void enviarEmail(String dest) { }
    static String validarCPF(String cpf) { }
    // 50+ métodos desconexos...
}

// Problemas:
// - Baixa coesão (responsabilidades não relacionadas)
// - Difícil manutenção
// - Namespace poluído

// ✅ MELHOR - classes específicas
class DateFormatter {
    String formatar(Date data) { }
}

class TaxCalculator {
    double calcular(double valor) { }
}

class EmailService {
    void enviar(String destinatario) { }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Checklist: Quando Usar Static

Pergunte-se:

1. **É constante imutável?** → ✅ Use `static final`
2. **É função pura (sem estado)?** → ✅ Use método static
3. **É factory method?** → ✅ Use método static
4. **Precisa de polimorfismo?** → ❌ Não use static
5. **Estado muda?** → ❌ Não use static
6. **Precisa testar com mocks?** → ❌ Evite static

### Diretrizes de Design

**Use static para:**
- Constantes: `Math.PI`, `Integer.MAX_VALUE`
- Utilitários: `Collections.sort()`, `Arrays.toString()`
- Factories: `LocalDate.of()`, `Integer.valueOf()`
- Main method: `public static void main(String[] args)`

**Evite static para:**
- Dados que mudam: estado do aplicativo
- Comportamento polimórfico: métodos sobrescritos
- Dependências: serviços, repositories, configurações
- Caches grandes: risco de memory leak

---

## ⚠️ Limitações Avançadas

### Static e Serialização

Membros static não são serializados:

```java
class Dados implements Serializable {
    static int valorStatic = 100;
    int valorInstancia = 42;
}

// Serializar
Dados.valorStatic = 200;
ObjectOutputStream out = ...;
out.writeObject(new Dados());

// Deserializar em nova JVM
Dados.valorStatic = 999;  // Valor diferente
ObjectInputStream in = ...;
Dados obj = (Dados) in.readObject();

System.out.println(Dados.valorStatic);  // 999 (não 200!)
System.out.println(obj.valorInstancia);  // 42 (serializado)
```

### Static Import

```java
// Sem static import
double circ = 2 * Math.PI * raio;

// Com static import
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;

double circ = 2 * PI * raio;  // Mais limpo
double resultado = sqrt(25);
```

**Cuidado:** Overuse polui namespace.

---

## 🔗 Interconexões Conceituais

### Static vs Singleton

```java
// Static utility class
class MathUtils {
    private MathUtils() { }  // Previne instanciação

    static double sqrt(double n) {
        return Math.sqrt(n);
    }
}

// Singleton
class Config {
    private static Config instancia = new Config();

    private Config() { }

    static Config getInstance() {
        return instancia;
    }

    // Métodos de instância
    void carregarPropriedades() { }
}
```

**Diferença:** Static utility = apenas métodos static, Singleton = uma instância com estado.

### Static vs Dependency Injection

```java
// Abordagem static - acoplamento rígido
class Service {
    void processar() {
        Logger.log("Processando");  // Dependência static
    }
}

// Dependency Injection - flexível
class Service {
    private Logger logger;

    Service(Logger logger) {
        this.logger = logger;
    }

    void processar() {
        logger.log("Processando");  // Pode injetar mock
    }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Alternativas Modernas

- **Enums:** Alternativa type-safe a constantes static
- **Interfaces com Métodos Default:** Compartilhar comportamento sem static
- **Dependency Injection Frameworks:** Spring, Guice substituem static
- **Functional Interfaces:** Lambdas como alternativa a métodos static

---

## 📚 Conclusão

Limitações de `static` incluem falta de polimorfismo, sem acesso a instância, dificuldade em testes, problemas de concorrência. Boas práticas: use para constantes (`static final`), utilitários (funções puras), factories; evite para estado mutável, comportamento polimórfico, dependências.

Dominar limitações e boas práticas significa:
- Static não é polimórfico (hiding, não overriding)
- Método static não acessa membros de instância
- Dependências static dificultam testes (considerar DI)
- Estado static mutável causa race conditions (usar sincronização)
- Memory leaks se referências static retêm objetos
- Usar static para constantes imutáveis (`public static final`)
- Usar static para utilitários sem estado (funções puras)
- Evitar static para dados que mudam (estado global mutável)
- Evitar static abuse (tudo static por "simplicidade")
- Preferir dependency injection a dependências static
- Thread-safety: sincronizar acesso ou usar imutáveis

`static` é ferramenta poderosa com trade-offs. Constantes (`Math.PI`) são casos perfeitos - universais, imutáveis, sem objeto necessário. Utilitários (`Collections.sort()`) também - funções puras sem estado. Mas estado global mutável (`static String config`) é anti-padrão - acoplamento rígido, race conditions, testes frágeis. Dependency injection supera static para dependências - flexibilidade, testabilidade, desacoplamento. Regra de ouro: se puder ser instância, não torne static. Use static apenas quando realmente representa "propriedade da classe", não "atalho para global". Dominar `static` é saber quando usar (raramente) e quando evitar (frequentemente).
