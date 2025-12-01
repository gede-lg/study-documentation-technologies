# T1.06 - Constantes em Interfaces

## Introdução

**Constantes em interface**: são **public static final** implícito.

```java
public interface Configuracao {
    // Todos são public static final implícitos:
    int MAX_CONEXOES = 100;
    String URL_PADRAO = "http://localhost:8080";
    double TIMEOUT = 30.0;
}

// Equivalente a:
public interface Configuracao {
    public static final int MAX_CONEXOES = 100;
    public static final String URL_PADRAO = "http://localhost:8080";
    public static final double TIMEOUT = 30.0;
}

// Uso: sem instância
int max = Configuracao.MAX_CONEXOES;
String url = Configuracao.URL_PADRAO;
```

**Implícito**: compilador adiciona automaticamente.

**Benefícios**:
- **Código limpo** (menos verbosidade)
- **Convenção clara** (sempre constante)
- **Acesso global** (sem instância)

**Anti-pattern**: interface de constantes (constant interface).

---

## Fundamentos

### 1. Public Implícito

Constantes são **public** implícito.

```java
public interface Cores {
    // Sem modificador = public
    String VERMELHO = "#FF0000";
    String VERDE = "#00FF00";
    String AZUL = "#0000FF";
}

// Acesso de qualquer lugar
public class Teste {
    public static void main(String[] args) {
        System.out.println(Cores.VERMELHO); // #FF0000
    }
}
```

### 2. Static Implícito

Constantes são **static** implícito (sem instância).

```java
public interface Configuracao {
    int MAX_CONEXOES = 100;
}

// Uso: sem instância
int max = Configuracao.MAX_CONEXOES; // Via interface

// Implementação: herda constante
public class MinhaClasse implements Configuracao {
    public void testar() {
        System.out.println(MAX_CONEXOES); // 100 (herdado)
        System.out.println(Configuracao.MAX_CONEXOES); // 100 (preferível)
    }
}
```

### 3. Final Implícito

Constantes são **final** implícito (imutável).

```java
public interface Configuracao {
    int MAX_CONEXOES = 100;
}

public class Teste {
    public static void main(String[] args) {
        // ❌ ERRO: final não pode ser modificado
        // Configuracao.MAX_CONEXOES = 200; // ERRO
    }
}
```

### 4. Inicialização Obrigatória

Constantes **devem ser inicializadas** na declaração.

```java
public interface Errado {
    // ❌ ERRO: constante não inicializada
    // int MAX_CONEXOES; // ERRO
}

// ✅ Inicialização obrigatória
public interface Correto {
    int MAX_CONEXOES = 100; // OK
}
```

### 5. Tipos Primitivos e Strings

Constantes podem ser **primitivos**, **String**, **enum**, etc.

```java
public interface Constantes {
    // Primitivos
    int INTEIRO = 100;
    long LONGO = 100L;
    double DECIMAL = 3.14;
    boolean FLAG = true;
    char CARACTERE = 'A';
    
    // String
    String TEXTO = "Exemplo";
    
    // Array (imutável referência, mas conteúdo mutável)
    int[] NUMEROS = {1, 2, 3};
    
    // Enum
    enum Status { ATIVO, INATIVO }
}
```

### 6. Objetos Imutáveis

**final** garante referência imutável, **não** conteúdo.

```java
public interface Configuracao {
    // Referência imutável, mas lista mutável
    List<String> NOMES = new ArrayList<>();
}

public class Teste {
    public static void main(String[] args) {
        // ❌ ERRO: referência final
        // Configuracao.NOMES = new ArrayList<>(); // ERRO
        
        // ✅ OK: conteúdo mutável (problema!)
        Configuracao.NOMES.add("João"); // Modifica conteúdo
        Configuracao.NOMES.clear(); // Modifica conteúdo
    }
}

// ✅ Solução: Collections.unmodifiableList()
public interface ConfiguracaoImutavel {
    List<String> NOMES = Collections.unmodifiableList(
        Arrays.asList("João", "Maria", "Pedro")
    );
}
```

### 7. Herança de Constantes

Classes que implementam interface **herdam constantes**.

```java
public interface Configuracao {
    int MAX_CONEXOES = 100;
    String URL_PADRAO = "http://localhost:8080";
}

public class Servidor implements Configuracao {
    public void iniciar() {
        // Constantes herdadas (sem qualificador)
        System.out.println("Max: " + MAX_CONEXOES);
        System.out.println("URL: " + URL_PADRAO);
        
        // Preferível: qualificar com interface
        System.out.println("Max: " + Configuracao.MAX_CONEXOES);
    }
}
```

### 8. Conflito de Constantes

Múltiplas interfaces com **mesma constante**: **ambiguidade**.

```java
public interface Interface1 {
    int VALOR = 100;
}

public interface Interface2 {
    int VALOR = 200;
}

public class Classe implements Interface1, Interface2 {
    public void testar() {
        // ❌ ERRO: ambiguidade
        // System.out.println(VALOR); // ERRO
        
        // ✅ Qualificar com interface
        System.out.println(Interface1.VALOR); // 100
        System.out.println(Interface2.VALOR); // 200
    }
}
```

### 9. Constantes em Enums

Enums dentro de interface.

```java
public interface Status {
    // Enum como constante
    enum TipoStatus { ATIVO, INATIVO, PENDENTE }
    
    // Constante String
    String ATIVO = "ATIVO";
    String INATIVO = "INATIVO";
}

// Uso
Status.TipoStatus status = Status.TipoStatus.ATIVO;
String statusStr = Status.ATIVO;
```

### 10. Nomeação de Constantes

Convenção: **UPPER_SNAKE_CASE**.

```java
public interface Configuracao {
    // ✅ Convenção: UPPER_SNAKE_CASE
    int MAX_CONEXOES = 100;
    String URL_PADRAO = "http://localhost:8080";
    double TIMEOUT_SEGUNDOS = 30.0;
    
    // ❌ Evitar: camelCase
    int maxConexoes = 100; // Não recomendado
}
```

---

## Aplicabilidade

**Constantes em interfaces**:
- **Valores globais** (acessíveis de qualquer lugar)
- **Configurações** (timeouts, URLs, limites)
- **Códigos de status** (HTTP, mensagens)
- **Valores mágicos** (evitar números/strings literais)

**Quando usar**:
- Constantes relacionadas ao **comportamento da interface**
- Valores **compartilhados** entre implementações
- **Valores imutáveis** (primitivos, String, enums)

**Quando evitar**:
- Interface **apenas** de constantes (constant interface anti-pattern)
- Constantes **não relacionadas** ao comportamento
- Objetos **mutáveis** (listas, mapas)

---

## Armadilhas

### 1. Constant Interface Anti-Pattern

Interface **apenas** de constantes: **anti-pattern**.

```java
// ❌ ANTI-PATTERN: constant interface
public interface Constantes {
    int MAX_CONEXOES = 100;
    String URL_PADRAO = "http://localhost:8080";
    double TIMEOUT = 30.0;
}

// ❌ Implementação polui namespace
public class MinhaClasse implements Constantes {
    public void testar() {
        System.out.println(MAX_CONEXOES); // Poluição
    }
}

// ✅ Solução: classe final com construtor privado
public final class Configuracao {
    private Configuracao() { } // Impede instanciação
    
    public static final int MAX_CONEXOES = 100;
    public static final String URL_PADRAO = "http://localhost:8080";
    public static final double TIMEOUT = 30.0;
}

// Uso: sem implements
int max = Configuracao.MAX_CONEXOES;
```

### 2. Objetos Mutáveis

**final** não garante imutabilidade de conteúdo.

```java
public interface Errado {
    // ❌ Lista mutável (problema!)
    List<String> NOMES = new ArrayList<>(Arrays.asList("João", "Maria"));
}

public class Teste {
    public static void main(String[] args) {
        Errado.NOMES.add("Pedro"); // Modifica conteúdo
        Errado.NOMES.clear(); // Modifica conteúdo
    }
}

// ✅ Solução: Collections.unmodifiableList()
public interface Correto {
    List<String> NOMES = Collections.unmodifiableList(
        Arrays.asList("João", "Maria")
    );
}
```

### 3. Constante Não Inicializada

```java
public interface Errado {
    // ❌ ERRO: constante não inicializada
    // int MAX_CONEXOES; // ERRO
}

// ✅ Inicialização obrigatória
public interface Correto {
    int MAX_CONEXOES = 100;
}
```

### 4. Modificadores Redundantes

```java
// ❌ Redundante (já é public static final implícito)
public interface Redundante {
    public static final int MAX_CONEXOES = 100;
}

// ✅ Limpo
public interface Limpo {
    int MAX_CONEXOES = 100; // public static final implícito
}
```

### 5. Conflito de Nomes

```java
public interface Interface1 {
    int VALOR = 100;
}

public interface Interface2 {
    int VALOR = 200;
}

public class Classe implements Interface1, Interface2 {
    public void testar() {
        // ❌ ERRO: ambiguidade
        // System.out.println(VALOR); // ERRO
        
        // ✅ Qualificar
        System.out.println(Interface1.VALOR); // 100
        System.out.println(Interface2.VALOR); // 200
    }
}
```

### 6. Arrays Mutáveis

```java
public interface Errado {
    // ❌ Array mutável (conteúdo pode ser modificado)
    int[] NUMEROS = {1, 2, 3};
}

public class Teste {
    public static void main(String[] args) {
        Errado.NUMEROS[0] = 999; // Modifica conteúdo
    }
}

// ✅ Solução: Collections.unmodifiableList()
public interface Correto {
    List<Integer> NUMEROS = Collections.unmodifiableList(
        Arrays.asList(1, 2, 3)
    );
}
```

### 7. Nomeação Incorreta

```java
// ❌ Evitar: camelCase
public interface Errado {
    int maxConexoes = 100; // Não recomendado
    String urlPadrao = "http://localhost:8080";
}

// ✅ Convenção: UPPER_SNAKE_CASE
public interface Correto {
    int MAX_CONEXOES = 100;
    String URL_PADRAO = "http://localhost:8080";
}
```

---

## Boas Práticas

### 1. Evitar Constant Interface Anti-Pattern

```java
// ❌ ANTI-PATTERN: constant interface
public interface Constantes {
    int MAX_CONEXOES = 100;
    String URL_PADRAO = "http://localhost:8080";
}

// ✅ Solução 1: classe final
public final class Configuracao {
    private Configuracao() { }
    
    public static final int MAX_CONEXOES = 100;
    public static final String URL_PADRAO = "http://localhost:8080";
}

// ✅ Solução 2: enum
public enum Configuracao {
    ; // Sem instâncias
    
    public static final int MAX_CONEXOES = 100;
    public static final String URL_PADRAO = "http://localhost:8080";
}
```

### 2. Constantes Relacionadas ao Comportamento

```java
// ✅ Constantes relacionadas ao comportamento
public interface Repositorio {
    int TIMEOUT_SEGUNDOS = 30; // Relacionado ao comportamento
    
    void salvar(Object obj);
    Object buscar(int id);
}

// ❌ Constantes não relacionadas
public interface RepositorioErrado {
    String COR_AZUL = "#0000FF"; // Não relacionado
    
    void salvar(Object obj);
}
```

### 3. Objetos Imutáveis

```java
// ✅ Collections.unmodifiable*()
public interface Configuracao {
    List<String> NOMES = Collections.unmodifiableList(
        Arrays.asList("João", "Maria", "Pedro")
    );
    
    Set<Integer> NUMEROS = Collections.unmodifiableSet(
        new HashSet<>(Arrays.asList(1, 2, 3))
    );
    
    Map<String, String> MAPA = Collections.unmodifiableMap(
        new HashMap<String, String>() {{
            put("chave1", "valor1");
            put("chave2", "valor2");
        }}
    );
}
```

### 4. Nomeação UPPER_SNAKE_CASE

```java
// ✅ UPPER_SNAKE_CASE
public interface Configuracao {
    int MAX_CONEXOES = 100;
    String URL_PADRAO = "http://localhost:8080";
    double TIMEOUT_SEGUNDOS = 30.0;
    boolean DEBUG_MODE = false;
}
```

### 5. Evitar Modificadores Redundantes

```java
// ❌ Redundante
public interface Redundante {
    public static final int MAX_CONEXOES = 100;
    public static final String URL_PADRAO = "http://localhost:8080";
}

// ✅ Limpo (implícito)
public interface Limpo {
    int MAX_CONEXOES = 100;
    String URL_PADRAO = "http://localhost:8080";
}
```

### 6. Documentar Constantes

```java
public interface Configuracao {
    /**
     * Número máximo de conexões simultâneas permitidas.
     * Padrão: 100
     */
    int MAX_CONEXOES = 100;
    
    /**
     * URL padrão do servidor.
     * Formato: http://host:porta
     */
    String URL_PADRAO = "http://localhost:8080";
    
    /**
     * Timeout para operações em segundos.
     * Padrão: 30 segundos
     */
    double TIMEOUT_SEGUNDOS = 30.0;
}
```

### 7. Enums para Constantes Relacionadas

```java
// ✅ Enum para grupo de constantes
public enum Status {
    ATIVO("Ativo"),
    INATIVO("Inativo"),
    PENDENTE("Pendente");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}

// Uso
Status status = Status.ATIVO;
System.out.println(status.getDescricao()); // Ativo
```

### 8. Constantes HTTP Status

```java
public interface HttpStatus {
    int OK = 200;
    int CREATED = 201;
    int NO_CONTENT = 204;
    int BAD_REQUEST = 400;
    int UNAUTHORIZED = 401;
    int FORBIDDEN = 403;
    int NOT_FOUND = 404;
    int INTERNAL_SERVER_ERROR = 500;
}

// Uso
if (statusCode == HttpStatus.NOT_FOUND) {
    System.out.println("Recurso não encontrado");
}
```

### 9. Constantes em Logging

```java
public interface LogConstants {
    String PREFIX_ERROR = "[ERROR] ";
    String PREFIX_WARN = "[WARN] ";
    String PREFIX_INFO = "[INFO] ";
    String PREFIX_DEBUG = "[DEBUG] ";
}

// Uso
System.out.println(LogConstants.PREFIX_ERROR + "Erro ao processar");
```

### 10. Classe Utilitária vs Constant Interface

```java
// ❌ Constant Interface (anti-pattern)
public interface Constantes {
    int MAX_CONEXOES = 100;
    String URL_PADRAO = "http://localhost:8080";
}

// ✅ Classe Utilitária (recomendado)
public final class Configuracao {
    private Configuracao() {
        throw new AssertionError("Classe utilitária não pode ser instanciada");
    }
    
    public static final int MAX_CONEXOES = 100;
    public static final String URL_PADRAO = "http://localhost:8080";
    public static final double TIMEOUT_SEGUNDOS = 30.0;
    
    // Métodos utilitários relacionados
    public static String getUrlCompleta(String path) {
        return URL_PADRAO + path;
    }
    
    public static boolean isConexoesExcedidas(int conexoes) {
        return conexoes > MAX_CONEXOES;
    }
}

// Uso: sem implements
int max = Configuracao.MAX_CONEXOES;
String url = Configuracao.getUrlCompleta("/api/usuarios");
```

---

## Resumo

**Constantes em interface**: **public static final** implícito.

```java
public interface Configuracao {
    int MAX_CONEXOES = 100; // public static final implícito
}

// Equivalente a:
public interface Configuracao {
    public static final int MAX_CONEXOES = 100;
}
```

**Public implícito**:
```java
int MAX_CONEXOES = 100; // public
```

**Static implícito**:
```java
int MAX_CONEXOES = 100; // static (sem instância)
```

**Final implícito**:
```java
int MAX_CONEXOES = 100; // final (imutável)
```

**Inicialização obrigatória**:
```java
int MAX_CONEXOES = 100; // Deve inicializar
```

**Acesso**:
```java
int max = Configuracao.MAX_CONEXOES; // Via interface
```

**Herança**:
```java
public class Classe implements Configuracao {
    public void testar() {
        System.out.println(MAX_CONEXOES); // Herdado
        System.out.println(Configuracao.MAX_CONEXOES); // Preferível
    }
}
```

**Objetos imutáveis**:
```java
List<String> NOMES = Collections.unmodifiableList(
    Arrays.asList("João", "Maria")
);
```

**Constant Interface Anti-Pattern**:
```java
// ❌ ANTI-PATTERN: interface apenas de constantes
public interface Constantes {
    int MAX_CONEXOES = 100;
}

// ✅ Solução: classe final
public final class Configuracao {
    private Configuracao() { }
    
    public static final int MAX_CONEXOES = 100;
}
```

**Nomeação**:
```java
int MAX_CONEXOES = 100; // UPPER_SNAKE_CASE
```

**Conflito**:
```java
public class Classe implements Interface1, Interface2 {
    public void testar() {
        System.out.println(Interface1.VALOR); // Qualificar
    }
}
```

**Boas práticas**:
- **Evitar** constant interface (anti-pattern)
- Constantes **relacionadas ao comportamento**
- **Collections.unmodifiable***() para imutabilidade
- **UPPER_SNAKE_CASE** para nomeação
- **Omitir modificadores redundantes** (public static final)
- **Documentar** constantes (Javadoc)
- **Enums** para grupos de constantes relacionadas
- **Classe utilitária** (final + construtor privado) para constantes globais

**Quando usar constantes em interface**:
- Valores relacionados ao **comportamento da interface**
- Constantes **compartilhadas** entre implementações
- Valores **imutáveis** (primitivos, String, enums)

**Quando evitar**:
- Interface **apenas** de constantes (usar classe final)
- Constantes **não relacionadas** ao comportamento
- Objetos **mutáveis** (usar Collections.unmodifiable*())

**Regra de Ouro**: Constantes em interface são **public static final** implícito. **Evite constant interface anti-pattern** (interface apenas de constantes). Use **classe final** com construtor privado para constantes globais. **Collections.unmodifiable***() para objetos imutáveis. **UPPER_SNAKE_CASE** para nomeação. Constantes devem estar **relacionadas ao comportamento** da interface.
