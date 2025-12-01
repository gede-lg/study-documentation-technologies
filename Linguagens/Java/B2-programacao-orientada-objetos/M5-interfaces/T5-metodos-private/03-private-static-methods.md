# Private Static Methods

## 🎯 Introdução e Definição

### Definição Conceitual

**Private static methods em interfaces** são métodos declarados com modificadores `private static` que funcionam como **utilitários internos puros** - funções auxiliares estáticas compartilhadas exclusivamente entre métodos static públicos e métodos default da mesma interface, sem acesso ao contexto de instância. Diferentemente de métodos privados de instância (apenas `private`), private static methods são **funções puras** no sentido matemático: dado o mesmo input, produzem mesmo output, sem depender de estado mutável ou contexto de implementação.

Conceitualmente, private static methods representam a aplicação do conceito de **funções auxiliares utilitárias** dentro do escopo de uma interface. Assim como classes têm métodos static privados para compartilhar lógica utilitária entre métodos static públicos, interfaces (desde Java 9) têm a mesma capacidade. Esses métodos existem para eliminar duplicação de código em lógica estática, permitindo que métodos static públicos da interface sejam concisos e focados, delegando passos auxiliares para métodos private static bem nomeados e reutilizáveis.

A distinção fundamental entre private instance e private static é de **contexto**: instance methods podem acessar outros métodos default e chamar private static; static methods **só podem chamar outros static** (públicos ou privados). Private static é usado quando a lógica auxiliar é **puramente funcional** - não precisa de contexto de implementação, apenas transforma inputs em outputs através de computação determinística.

### Contexto Histórico e Motivação

**Java 8 (2014): Métodos Static Públicos em Interfaces**

Java 8 introduziu a capacidade de ter métodos static públicos em interfaces, principalmente para utilitários e factories:

```java
// Java 8 - métodos static públicos permitidos
interface Calculator {
    static int add(int a, int b) {
        return a + b;
    }

    static int multiply(int a, int b) {
        return a * b;
    }

    static int square(int x) {
        return multiply(x, x);  // ✅ Static público pode chamar outro static público
    }
}
```

**Problema Emergente:**

Quando múltiplos métodos static públicos compartilhavam lógica utilitária, não havia mecanismo para reutilização sem expor utilitários como públicos:

```java
// Java 8 - problema de expor utilitários internos
interface MathUtils {
    static int factorial(int n) {
        validatePositive(n);  // ❌ validatePositive() forçado a ser público
        return calculateFactorial(n);  // ❌ calculateFactorial() também público
    }

    static int fibonacci(int n) {
        validatePositive(n);  // Reutilização
        return calculateFibonacci(n);
    }

    // ❌ FORÇADOS a serem públicos para reutilização
    static void validatePositive(int n) {
        if (n < 0) throw new IllegalArgumentException("Must be positive");
    }

    static int calculateFactorial(int n) {
        if (n <= 1) return 1;
        return n * calculateFactorial(n - 1);
    }

    static int calculateFibonacci(int n) {
        if (n <= 1) return n;
        return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
    }
}

// ❌ Problema: usuários podem chamar utilitários internos diretamente
MathUtils.validatePositive(-5);  // Não faz sentido chamar isso diretamente
MathUtils.calculateFactorial(10);  // Expõe implementação interna
```

**Motivação:** Métodos utilitários são detalhes de implementação que não deveriam ser parte da API pública.

**Java 9 (2017): Solução com Private Static**

```java
// Java 9+ - private static resolve
interface MathUtils {
    static int factorial(int n) {
        validatePositive(n);  // ✅ Chama private static
        return calculateFactorial(n);
    }

    static int fibonacci(int n) {
        validatePositive(n);
        return calculateFibonacci(n);
    }

    // ✅ Private static - reutilizado mas oculto
    private static void validatePositive(int n) {
        if (n < 0) throw new IllegalArgumentException("Must be positive");
    }

    private static int calculateFactorial(int n) {
        if (n <= 1) return 1;
        return n * calculateFactorial(n - 1);
    }

    private static int calculateFibonacci(int n) {
        if (n <= 1) return n;
        return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
    }
}

// MathUtils.validatePositive(-5);  // ❌ ERRO: não visível
// MathUtils.calculateFactorial(10);  // ❌ ERRO: não visível
```

**Solução Perfeita:**
- ✅ Utilitários compartilhados sem duplicação
- ✅ API pública limpa - apenas `factorial()` e `fibonacci()`
- ✅ Detalhes de implementação encapsulados

### Problema Fundamental que Resolve

Private static methods resolvem problemas específicos de organização de código estático:

**1. Exposição Indevida de Funções Utilitárias**
Sem private static, toda função auxiliar usada por métodos static públicos deve ser pública, poluindo API com detalhes internos.

**2. Duplicação de Lógica Estática**
Sem mecanismo de compartilhamento, lógica seria duplicada entre métodos static, violando DRY.

**3. Quebra de Abstração**
Expor funções utilitárias internas revela "como" ao invés de apenas "o que", quebrando abstração.

**4. Dificuldade de Refatoração**
Se utilitários são públicos, código externo pode depender deles, impedindo mudanças internas.

**5. Falta de Organização**
Métodos static públicos longos e complexos são difíceis de entender. Private static permite decomposição clara.

### Importância no Ecossistema Java

**JDK Interno:**
Interfaces do próprio Java usam private static extensivamente:

```java
// Exemplo simplificado de interfaces em java.util.stream
interface Stream<T> {
    static <T> Stream<T> of(T... values) {
        return Arrays.stream(values);  // Usa utilitários internos
    }

    // Métodos private static auxiliares internos
}
```

**Comparator e Functional Interfaces:**
```java
interface Comparator<T> {
    static <T> Comparator<T> comparing(...) {
        // Usa private static para validação e construção
    }

    // Private static helpers
}
```

**Boas Práticas:**
Código Java moderno que define métodos static em interfaces é esperado usar private static para organização.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Modificadores `private static`:** Ambos obrigatórios - método é privado E estático

2. **Funções Utilitárias Puras:** Sem dependência de instância, apenas transformação de inputs

3. **Compartilhamento Entre Static Públicos:** Principal caso de uso é suportar métodos static públicos

4. **Acessíveis por Default Também:** Métodos default podem chamar private static (útil para compartilhar lógica puramente funcional)

5. **Sem Acesso a Contexto de Instância:** Não podem chamar métodos default ou private instance

### Pilares Fundamentais

- **Declaração:** `private static tipoRetorno nomeMetodo(...)`
- **Funções Puras:** Idealmente sem side effects, apenas computação
- **Reutilização de Lógica:** Elimina duplicação entre métodos static públicos
- **Encapsulamento:** Oculta detalhes de implementação utilitária
- **Organização:** Permite decompor métodos static complexos

### Visão Geral das Nuances

- **Chamado por Static e Default:** Ambos podem chamar private static
- **Não Pode Chamar Instance:** Private static não acessa private instance ou default
- **Recursão Permitida:** Private static pode chamar a si mesmo (recursão)
- **Compartilhamento com Instance:** Default pode usar private static para lógica pura
- **Performance:** Sem overhead - compilado como método static normal

---

## 🧠 Fundamentos Teóricos

### Diferenças: Private Instance vs Private Static

#### Comparação Conceitual

| Aspecto | Private Instance | Private Static |
|---------|-----------------|----------------|
| **Modificadores** | `private` | `private static` |
| **Contexto** | Implementação (instância) | Classe (static) |
| **Acesso a** | Default, outros privates, private static, constantes | Apenas private static, constantes |
| **Chamado por** | Default, private instance | Default, static público, private static |
| **Recursão** | Sim | Sim |
| **Side effects** | Pode ter | Idealmente não |
| **Uso típico** | Auxiliar métodos default | Auxiliar métodos static |

#### Exemplo Demonstrativo

```java
interface ExemploCompleto {
    int CONSTANTE = 100;

    // ========== MÉTODOS PÚBLICOS ==========

    // Static público - só pode chamar private static
    static int utilidadePublica(int x) {
        int validated = validateInput(x);  // ✅ Chama private static
        // return processarComContexto(x);  // ❌ ERRO: não pode chamar private instance
        return calcularStaticamente(validated);
    }

    // Default público - pode chamar AMBOS
    default int funcionalidadeDefault(int x) {
        int validated = validateInput(x);  // ✅ Pode chamar private static
        return processarComContexto(validated);  // ✅ Pode chamar private instance
    }

    // ========== PRIVATE STATIC ==========

    // Validação pura - private static
    private static int validateInput(int x) {
        if (x < 0) throw new IllegalArgumentException();
        return x;
    }

    // Cálculo puro - private static
    private static int calcularStaticamente(int x) {
        return x * CONSTANTE;  // ✅ Pode acessar constante
        // return processarComContexto(x);  // ❌ ERRO: static não chama instance
    }

    // ========== PRIVATE INSTANCE ==========

    // Processamento com contexto - private instance
    private int processarComContexto(int x) {
        int calculado = calcularStaticamente(x);  // ✅ Instance pode chamar static
        return calculado + 10;  // Lógica adicional com contexto
    }
}
```

**Regras Fundamentais:**
1. **Static público** → só chama **private static**
2. **Default** → chama **ambos** (private instance e private static)
3. **Private static** → só chama **outros private static**
4. **Private instance** → chama **ambos**

### Casos de Uso de Private Static

#### Caso 1: Validações Compartilhadas

```java
interface ConfigLoader {
    static Config loadFromFile(String path) {
        validatePath(path);
        validateFileExists(path);
        return parseFile(path);
    }

    static Config loadFromResource(String resourceName) {
        validatePath(resourceName);
        validateResourceExists(resourceName);
        return parseResource(resourceName);
    }

    // Validações compartilhadas - private static
    private static void validatePath(String path) {
        if (path == null || path.isEmpty()) {
            throw new IllegalArgumentException("Path cannot be null or empty");
        }
    }

    private static void validateFileExists(String path) {
        if (!Files.exists(Paths.get(path))) {
            throw new IllegalArgumentException("File does not exist: " + path);
        }
    }

    private static void validateResourceExists(String name) {
        if (ConfigLoader.class.getResource(name) == null) {
            throw new IllegalArgumentException("Resource not found: " + name);
        }
    }

    // Parsing - private static
    private static Config parseFile(String path) {
        // Lógica de parsing
        return new Config();
    }

    private static Config parseResource(String name) {
        // Lógica de parsing de resource
        return new Config();
    }
}
```

**Benefício:** Validações reutilizadas; parsing encapsulado.

#### Caso 2: Conversões e Transformações

```java
interface StringUtils {
    static String capitalize(String text) {
        String validated = validateNotNull(text);
        return toUpperCaseFirst(validated);
    }

    static String camelCase(String text) {
        String validated = validateNotNull(text);
        String[] words = splitBySpaces(validated);
        return joinWords(words, true);
    }

    static String snakeCase(String text) {
        String validated = validateNotNull(text);
        String[] words = splitBySpaces(validated);
        return joinWords(words, false);
    }

    // Utilitários compartilhados - private static
    private static String validateNotNull(String text) {
        if (text == null) {
            throw new IllegalArgumentException("Text cannot be null");
        }
        return text;
    }

    private static String toUpperCaseFirst(String text) {
        return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
    }

    private static String[] splitBySpaces(String text) {
        return text.trim().split("\\s+");
    }

    private static String joinWords(String[] words, boolean camelCase) {
        if (words.length == 0) return "";
        StringBuilder result = new StringBuilder(words[0].toLowerCase());
        for (int i = 1; i < words.length; i++) {
            if (camelCase) {
                result.append(toUpperCaseFirst(words[i]));
            } else {
                result.append("_").append(words[i].toLowerCase());
            }
        }
        return result.toString();
    }
}
```

**Benefício:** Transformações atômicas reutilizadas em diferentes combinações.

#### Caso 3: Cálculos Matemáticos

```java
interface GeometryUtils {
    static double triangleArea(double base, double height) {
        validatePositive(base, "base");
        validatePositive(height, "height");
        return multiply(base, height) / 2;
    }

    static double circleArea(double radius) {
        validatePositive(radius, "radius");
        double radiusSquared = power(radius, 2);
        return multiply(Math.PI, radiusSquared);
    }

    static double rectanglePerimeter(double width, double height) {
        validatePositive(width, "width");
        validatePositive(height, "height");
        double sum = add(width, height);
        return multiply(2, sum);
    }

    // Operações básicas - private static
    private static void validatePositive(double value, String name) {
        if (value <= 0) {
            throw new IllegalArgumentException(name + " must be positive");
        }
    }

    private static double multiply(double a, double b) {
        return a * b;
    }

    private static double add(double a, double b) {
        return a + b;
    }

    private static double power(double base, int exponent) {
        return Math.pow(base, exponent);
    }
}
```

**Benefício:** Operações matemáticas básicas encapsuladas e reutilizadas.

### Padrões de Design com Private Static

#### Padrão 1: Factory com Validação

```java
interface EntityFactory {
    static Entity createUser(String name, String email) {
        validateNotEmpty(name, "name");
        validateEmail(email);
        return buildEntity("USER", Map.of("name", name, "email", email));
    }

    static Entity createAdmin(String name, String email, String role) {
        validateNotEmpty(name, "name");
        validateEmail(email);
        validateNotEmpty(role, "role");
        return buildEntity("ADMIN", Map.of("name", name, "email", email, "role", role));
    }

    // Validações - private static
    private static void validateNotEmpty(String value, String fieldName) {
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " cannot be empty");
        }
    }

    private static void validateEmail(String email) {
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    // Construção - private static
    private static Entity buildEntity(String type, Map<String, String> props) {
        return new EntityImpl(type, props);
    }
}
```

#### Padrão 2: Parser com Conversões

```java
interface DataParser {
    static Data parseCSV(String csv) {
        String[] fields = splitCSV(csv);
        validateFieldCount(fields, 3);
        return createData(fields);
    }

    static Data parseJSON(String json) {
        Map<String, String> fields = extractJSONFields(json);
        validateMapFields(fields);
        return createData(fields);
    }

    // Parsing - private static
    private static String[] splitCSV(String csv) {
        return csv.split(",");
    }

    private static Map<String, String> extractJSONFields(String json) {
        // Parsing JSON simplificado
        return new HashMap<>();
    }

    // Validação - private static
    private static void validateFieldCount(String[] fields, int expected) {
        if (fields.length != expected) {
            throw new IllegalArgumentException("Expected " + expected + " fields");
        }
    }

    private static void validateMapFields(Map<String, String> fields) {
        if (!fields.containsKey("id") || !fields.containsKey("name")) {
            throw new IllegalArgumentException("Missing required fields");
        }
    }

    // Construção - private static
    private static Data createData(String[] fields) {
        return new Data(fields[0], fields[1], fields[2]);
    }

    private static Data createData(Map<String, String> fields) {
        return new Data(fields.get("id"), fields.get("name"), fields.get("value"));
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Private Static

**Use quando:**
1. Múltiplos métodos static públicos compartilham lógica utilitária
2. Funções auxiliares são puras (sem dependência de instância/estado)
3. Validações são reutilizadas entre métodos static
4. Conversões/transformações são compartilhadas
5. Cálculos são decompostos em passos menores

**Evite quando:**
1. Lógica precisa de contexto de instância (use private instance)
2. Função é trivial demais (inline é mais claro)
3. Haveria apenas um único uso (sem reutilização real)
4. Criaria cadeia de indireção muito profunda

### Diferença de Quando Usar Private Instance vs Private Static

**Use Private Instance quando:**
- Auxiliar métodos default
- Precisa acessar outros métodos default
- Lógica específica de contexto de implementação

**Use Private Static quando:**
- Auxiliar métodos static públicos
- Função é pura/utilitária
- Compartilhada entre static e default
- Lógica matemática/conversão/validação sem estado

**Exemplo de Escolha:**
```java
interface Exemplo {
    // Se precisa de contexto de implementação → private instance
    default void processar() {
        metodoPrivateInstance();  // Contexto necessário
    }

    private void metodoPrivateInstance() {
        // Pode acessar outros defaults, estado, etc.
    }

    // Se é função pura/utilitária → private static
    static void utilidade() {
        metodoPrivateStatic();  // Função pura
    }

    private static void metodoPrivateStatic() {
        // Apenas transforma inputs em outputs
    }
}
```

---

## ⚠️ Limitações e Considerações

### Restrições

1. **Java 9+ Apenas:** Não disponível em Java 8
2. **Sem Acesso a Instance:** Não pode chamar métodos default ou private instance
3. **Sem Sobrescrita:** Implementações não veem nem podem sobrescrever
4. **Testabilidade:** Testados indiretamente via métodos públicos

### Boas Práticas

1. **Funções Puras Preferidas:** Private static ideal para funções sem side effects
2. **Nomes Descritivos:** Nome deve deixar claro o propósito utilitário
3. **Evitar Complexidade:** Private static devem ser simples e focados
4. **Validação Centralizada:** Ótimo para validações reutilizadas
5. **Documentação Interna:** Comentar lógica complexa

---

## 🔗 Interconexões Conceituais

### Relação com Functional Programming

Private static methods são ideais para estilo funcional:
- Funções puras
- Sem side effects
- Composição de funções
- Transformações de dados

### Relação com Utilitários de Classe

Similar a classes utilitárias (`Math`, `Arrays`, `Collections`), mas escopo de interface.

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Identificar Utilitários Compartilhados:** Lógica repetida em métodos static
2. **Extrair para Private Static:** Refatorar para método private static
3. **Nomear Claramente:** Nomes que documentam propósito
4. **Organizar Interface:** Agrupar privates relacionados

---

## 📚 Conclusão

Private static methods completam o arsenal de encapsulamento em interfaces, permitindo que métodos static públicos tenham a mesma organização e reutilização de código que métodos default. São essenciais para interfaces modernas que fornecem utilitários static, permitindo APIs públicas limpas enquanto complexidade utilitária fica adequadamente oculta e organizada.

Dominar private static é entender que interfaces não são apenas contratos, mas podem ser componentes auto-contidos com lógica estática bem estruturada, mantendo princípios de engenharia de software como DRY, SRP e encapsulamento.
