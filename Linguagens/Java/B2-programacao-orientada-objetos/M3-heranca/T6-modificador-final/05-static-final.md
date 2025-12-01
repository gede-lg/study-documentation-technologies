# T6.05 - Static Final (Constantes de Classe)

## Introdução

**static final** cria **constantes de classe**.

**Compartilhadas** por todas as instâncias.

**Convenção**: nomes em **MAIÚSCULAS** com underscores.

**Inicializadas**: na declaração ou em bloco static.

```java
public class Matematica {
    public static final double PI = 3.14159265359;
    public static final double E = 2.71828182846;
}

// Uso
double area = Matematica.PI * raio * raio;
```

```java
public class Configuracao {
    public static final int MAX_CONEXOES = 10;
    public static final String VERSAO = "1.0.0";
    public static final int TIMEOUT_MS = 5000;
}
```

---

## Fundamentos

### 1. static final = Constante de Classe

**static**: compartilhada por todas as instâncias.

**final**: valor não pode mudar.

```java
public class Config {
    public static final int MAX_TENTATIVAS = 3;
}

// Acesso via classe
int max = Config.MAX_TENTATIVAS;
```

### 2. Convenção de Nomenclatura

**MAIÚSCULAS** com **underscores**.

```java
public static final String AMBIENTE_PRODUCAO = "prod";
public static final int TAMANHO_BUFFER = 1024;
public static final double TAXA_JUROS = 0.05;
```

### 3. Inicialização na Declaração

**Valor conhecido** em tempo de compilação.

```java
public class Constantes {
    public static final int ZERO = 0;
    public static final String VAZIO = "";
    public static final boolean ATIVO = true;
}
```

### 4. Inicialização em Bloco Static

**Valor calculado** ou carregado em runtime.

```java
public class Configuracao {
    public static final String AMBIENTE;
    
    static {
        AMBIENTE = System.getenv("ENV");
        if (AMBIENTE == null) {
            AMBIENTE = "dev"; // ❌ Erro: já inicializada
        }
    }
}

// ✅ Correto
public class Configuracao {
    public static final String AMBIENTE;
    
    static {
        String env = System.getenv("ENV");
        AMBIENTE = env != null ? env : "dev";
    }
}
```

### 5. Acesso Sem Instância

**static** permite acesso **via classe**.

```java
// ✅ Acesso via classe
double pi = Matematica.PI;

// ✅ Também funciona via instância (mas não recomendado)
Matematica m = new Matematica();
double pi2 = m.PI;
```

### 6. Constantes Primitivas vs Objetos

**Primitivos**: valor constante.

**Objetos**: referência constante (objeto pode mudar).

```java
// Primitivo
public static final int MAX = 100;

// Objeto (referência constante)
public static final List<String> NOMES = new ArrayList<>();

// ✅ Objeto pode mudar
NOMES.add("João"); // Permitido

// ❌ Referência não pode mudar
NOMES = new ArrayList<>(); // Erro
```

### 7. Constantes Imutáveis

**Use coleções imutáveis** para verdadeiras constantes.

```java
// ❌ Mutável
public static final List<String> CORES = new ArrayList<>();

// ✅ Imutável (Java 9+)
public static final List<String> CORES = List.of("VERMELHO", "VERDE", "AZUL");

// ✅ Antes do Java 9
public static final List<String> CORES = 
    Collections.unmodifiableList(Arrays.asList("VERMELHO", "VERDE", "AZUL"));
```

### 8. Constantes em Interfaces

**Variáveis de interface** são **public static final** implicitamente.

```java
public interface Constantes {
    String VERSAO = "1.0.0"; // public static final implícito
    int MAX_TENTATIVAS = 3;
}

// Uso
String v = Constantes.VERSAO;
```

### 9. Import Static

**Importar constantes** para uso direto.

```java
import static com.exemplo.Constantes.MAX_TENTATIVAS;
import static java.lang.Math.PI;

// Uso sem qualificação
int max = MAX_TENTATIVAS;
double area = PI * raio * raio;
```

### 10. Compile-Time Constants

**Primitivos e Strings** são **compile-time constants**.

```java
public static final int MAX = 100;
public static final String NOME = "Java";

// Compilador substitui valor diretamente
```

---

## Aplicabilidade

**Use static final para**:
- **Constantes matemáticas**: PI, E
- **Configurações**: URLs, timeouts, limites
- **Códigos de status**: HTTP, erro
- **Mensagens**: padrões, templates
- **Valores fixos**: versões, flags

**Exemplos**:
```java
public class HttpStatus {
    public static final int OK = 200;
    public static final int NOT_FOUND = 404;
    public static final int SERVER_ERROR = 500;
}

public class Config {
    public static final String API_URL = "https://api.exemplo.com";
    public static final int TIMEOUT_MS = 5000;
    public static final int MAX_RETRY = 3;
}
```

---

## Armadilhas

### 1. Constante Mutável

```java
// ❌ Lista mutável
public static final List<String> NOMES = new ArrayList<>();

// Pode adicionar/remover
NOMES.add("João"); // ❌ Não deveria permitir

// ✅ Lista imutável
public static final List<String> NOMES = List.of("João", "Maria");
```

### 2. Esquecer MAIÚSCULAS

```java
// ❌ Convenção violada
public static final int maxTentativas = 3;

// ✅ Correto
public static final int MAX_TENTATIVAS = 3;
```

### 3. Usar Interfaces Para Agrupar Constantes (Anti-Pattern)

```java
// ❌ Constant interface anti-pattern
public interface Constantes {
    String VERSAO = "1.0.0";
    int MAX = 100;
}

public class MinhaClasse implements Constantes {
    // Agora tem VERSAO e MAX sem intenção clara
}

// ✅ Use classe com construtor privado
public final class Constantes {
    private Constantes() { }
    
    public static final String VERSAO = "1.0.0";
    public static final int MAX = 100;
}
```

### 4. Reatribuição em Bloco Static

```java
public class Config {
    public static final String AMBIENTE;
    
    static {
        AMBIENTE = "dev";
        AMBIENTE = "prod"; // ❌ Erro: já inicializada
    }
}
```

### 5. Inicialização Parcial

```java
public class Config {
    public static final String URL;
    
    static {
        if (condicao) {
            URL = "https://prod.com";
        }
        // ❌ Erro: URL pode não estar inicializada
    }
}
```

### 6. Confundir com Variável de Instância

```java
// ❌ Sem static (variável de instância)
public final int MAX = 100; // Cada instância tem cópia

// ✅ Com static (constante de classe)
public static final int MAX = 100; // Compartilhada
```

---

## Boas Práticas

### 1. Agrupe Constantes em Classes Dedicadas

```java
public final class HttpStatus {
    private HttpStatus() { }
    
    public static final int OK = 200;
    public static final int CREATED = 201;
    public static final int NOT_FOUND = 404;
    public static final int SERVER_ERROR = 500;
}
```

### 2. Use Coleções Imutáveis

```java
// Java 9+
public static final List<String> CORES = List.of("VERMELHO", "VERDE", "AZUL");
public static final Set<Integer> PRIMOS = Set.of(2, 3, 5, 7, 11);
public static final Map<String, Integer> MAPA = Map.of("A", 1, "B", 2);

// Antes do Java 9
public static final List<String> CORES = 
    Collections.unmodifiableList(Arrays.asList("VERMELHO", "VERDE", "AZUL"));
```

### 3. Documente Significado

```java
/**
 * Tempo máximo de espera em milissegundos.
 */
public static final int TIMEOUT_MS = 5000;

/**
 * Taxa de juros anual padrão (5%).
 */
public static final double TAXA_JUROS = 0.05;
```

### 4. Use Enums Para Conjuntos de Constantes

```java
// ❌ Constantes relacionadas separadas
public static final int STATUS_ATIVO = 1;
public static final int STATUS_INATIVO = 2;
public static final int STATUS_PENDENTE = 3;

// ✅ Use enum
public enum Status {
    ATIVO, INATIVO, PENDENTE
}
```

### 5. Organize Por Categoria

```java
public final class Config {
    private Config() { }
    
    // Database
    public static final String DB_URL = "jdbc:mysql://localhost:3306/db";
    public static final int DB_POOL_SIZE = 10;
    
    // API
    public static final String API_URL = "https://api.exemplo.com";
    public static final int API_TIMEOUT = 5000;
    
    // Cache
    public static final int CACHE_TTL = 3600;
    public static final int CACHE_MAX_SIZE = 1000;
}
```

### 6. Prefira Tipos Primitivos

```java
// ✅ Primitivo (melhor performance)
public static final int MAX = 100;

// ❌ Wrapper (desnecessário)
public static final Integer MAX = 100;
```

### 7. Use BigDecimal Para Dinheiro

```java
// ❌ double (impreciso)
public static final double TAXA = 0.05;

// ✅ BigDecimal (preciso)
public static final BigDecimal TAXA = new BigDecimal("0.05");
```

### 8. Import Static Para Constantes Muito Usadas

```java
import static com.exemplo.Config.API_URL;
import static com.exemplo.Config.TIMEOUT_MS;

// Uso direto
String url = API_URL;
int timeout = TIMEOUT_MS;
```

### 9. Evite Magic Numbers

```java
// ❌ Magic number
if (status == 200) { }

// ✅ Constante nomeada
if (status == HttpStatus.OK) { }
```

### 10. Considere ResourceBundle Para i18n

```java
// ❌ Constantes hardcoded
public static final String MSG_ERRO = "Erro ao processar";

// ✅ ResourceBundle para i18n
ResourceBundle bundle = ResourceBundle.getBundle("messages");
String msgErro = bundle.getString("erro.processar");
```

---

## Resumo

**static final**:
```java
public static final double PI = 3.14159265359;
public static final int MAX_TENTATIVAS = 3;
```

**Convenção MAIÚSCULAS**:
```java
public static final String AMBIENTE_PRODUCAO = "prod";
```

**Bloco static**:
```java
public static final String AMBIENTE;

static {
    AMBIENTE = System.getenv("ENV");
}
```

**Coleções imutáveis**:
```java
public static final List<String> CORES = List.of("VERMELHO", "VERDE", "AZUL");
```

**Classe de constantes**:
```java
public final class Constantes {
    private Constantes() { }
    
    public static final String VERSAO = "1.0.0";
    public static final int MAX = 100;
}
```

**Import static**:
```java
import static com.exemplo.Constantes.MAX;

int max = MAX; // Uso direto
```

**Constantes em interface (implícito)**:
```java
public interface Config {
    String VERSAO = "1.0.0"; // public static final
}
```

**Enums vs constantes**:
```java
// ❌ Constantes separadas
public static final int ATIVO = 1;
public static final int INATIVO = 2;

// ✅ Enum
public enum Status { ATIVO, INATIVO }
```

**Documentação**:
```java
/**
 * Timeout em milissegundos.
 */
public static final int TIMEOUT_MS = 5000;
```

**Regra de Ouro**: Use **static final** para **constantes de classe**. Nomes em **MAIÚSCULAS**. Use **coleções imutáveis** para verdadeiras constantes. **Agrupe** constantes relacionadas. Prefira **enums** para conjuntos de valores.
