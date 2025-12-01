# Reutilização de Código Entre Métodos Default

## 🎯 Introdução e Definição

### Definição Conceitual

A **reutilização de código entre métodos default** refere-se ao uso de métodos privados em interfaces (Java 9+) como mecanismo para compartilhar lógica comum entre múltiplos métodos default, eliminando duplicação de código e promovendo o princípio DRY (Don't Repeat Yourself). Quando uma interface possui vários métodos default que compartilham passos, validações, transformações ou qualquer lógica comum, métodos privados permitem extrair essa lógica compartilhada em um único local reutilizável, mantendo os métodos default públicos limpos, focados e sem duplicação.

Conceitualmente, esta prática representa a aplicação do **princípio de decomposição funcional** dentro de interfaces - quebrar métodos complexos em partes menores e reutilizáveis. Antes do Java 9, quando métodos default foram introduzidos (Java 8), não havia mecanismo adequado para compartilhar código entre eles sem expor essa lógica compartilhada como parte da API pública da interface, forçando desenvolvedores a escolher entre duplicação (violando DRY) ou poluição de API (expondo detalhes internos).

A reutilização via métodos privados resolve este dilema criando uma **camada de abstração interna** - métodos default públicos compõem comportamento chamando métodos privados auxiliares, que por sua vez encapsulam lógica reutilizável. Este padrão não apenas elimina duplicação, mas também melhora **legibilidade** (métodos públicos ficam mais concisos), **manutenibilidade** (mudanças em lógica compartilhada afetam apenas um lugar) e **testabilidade** (lógica complexa isolada em métodos específicos).

### Contexto Histórico e Motivação

**Java 8 (2014): O Problema Nasce com Métodos Default**

Quando métodos default foram introduzidos, eles vieram sem mecanismo de compartilhamento de código interno:

```java
// Java 8 - problema de duplicação inevitável
interface Logger {
    default void logInfo(String message) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String formatted = "[" + timestamp + "] INFO: " + message;  // LÓGICA DUPLICADA
        System.out.println(formatted);
    }

    default void logWarning(String message) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String formatted = "[" + timestamp + "] WARNING: " + message;  // DUPLICAÇÃO
        System.out.println(formatted);
    }

    default void logError(String message) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String formatted = "[" + timestamp + "] ERROR: " + message;  // DUPLICAÇÃO
        System.err.println(formatted);
    }
}
```

**Problemas:**
1. Lógica de formatação de timestamp **duplicada 3 vezes**
2. Se formato de timestamp mudar, **3 lugares** precisam ser atualizados
3. Risco de **inconsistência** se atualização esquecer algum método

**Tentativa Pré-Java 9: Método Default Auxiliar (Solução Imperfeita)**

```java
// Java 8 - "solução" forçando método auxiliar a ser público
interface Logger {
    default void logInfo(String message) {
        log("INFO", message, System.out);  // Reutiliza
    }

    default void logWarning(String message) {
        log("WARNING", message, System.out);
    }

    default void logError(String message) {
        log("ERROR", message, System.err);
    }

    // ❌ PROBLEMA: Forçado a ser default (público) para reutilização
    default void log(String level, String message, PrintStream stream) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String formatted = "[" + timestamp + "] " + level + ": " + message;
        stream.println(formatted);
    }
}

// ❌ Consequência indesejada: método auxiliar é público
Logger logger = new LoggerImpl();
logger.log("DEBUG", "teste", System.out);  // Usuários podem chamar diretamente!
```

**Problema:** `log()` é detalhe de implementação interna, mas foi forçado a ser público, poluindo API.

**Java 9 (2017): Solução com Métodos Private**

```java
// Java 9+ - reutilização SEM poluir API
interface Logger {
    default void logInfo(String message) {
        log("INFO", message, System.out);  // ✅ Chama método privado
    }

    default void logWarning(String message) {
        log("WARNING", message, System.out);
    }

    default void logError(String message) {
        log("ERROR", message, System.err);
    }

    // ✅ Private - reutilizado mas não exposto
    private void log(String level, String message, PrintStream stream) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String formatted = "[" + timestamp + "] " + level + ": " + message;
        stream.println(formatted);
    }
}

// logger.log(...);  // ❌ ERRO: método não existe na API pública
```

**Solução Perfeita:**
- ✅ Código compartilhado em um lugar
- ✅ Lógica auxiliar oculta da API pública
- ✅ Fácil de manter e modificar

### Problema Fundamental que Resolve

A reutilização de código entre métodos default via métodos privados resolve problemas críticos de engenharia de software:

**1. Violação do Princípio DRY**
Sem métodos privados, lógica repetida entre métodos default seria duplicada, aumentando risco de bugs quando código é modificado em um lugar mas esquecido em outro.

**2. Dificuldade de Manutenção**
Lógica duplicada torna refatoração arriscada - é preciso lembrar de atualizar todos os lugares onde lógica aparece, ou criar inconsistências.

**3. Baixa Coesão**
Métodos default longos com lógica misturada (validação + processamento + formatação) têm baixa coesão. Extrair partes para métodos privados aumenta coesão - cada método tem responsabilidade clara.

**4. Poluição de API Pública**
Forçar métodos auxiliares a serem públicos (default) para permitir reutilização polui interface com métodos que não deveriam fazer parte do contrato.

**5. Dificuldade de Compreensão**
Métodos default extensos com lógica complexa inline são difíceis de entender. Extrair passos para métodos privados bem nomeados serve como **documentação auto-explicativa**.

### Importância no Ecossistema Java

**Collections Framework:**
Interfaces do JDK usam métodos privados para compartilhar lógica:

```java
interface Collection<E> {
    default boolean removeIf(Predicate<? super E> filter) {
        // Usa métodos privados internamente para otimização
    }

    // Métodos privados auxiliares compartilhados
}
```

**Streams API:**
Implementação de Streams usa extensivamente métodos privados para reutilização:

```java
interface Stream<T> {
    default Stream<T> takeWhile(Predicate<? super T> predicate) {
        // Chama métodos privados auxiliares
    }

    private /* métodos auxiliares */ { }
}
```

**Boas Práticas Modernas:**
Código Java moderno que define interfaces ricas com múltiplos métodos default é esperado usar métodos privados para organização e reutilização.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Extração de Lógica Comum:** Identificar código repetido entre métodos default e extrair para método privado

2. **Princípio DRY Aplicado:** Uma única fonte de verdade para lógica compartilhada

3. **Decomposição Funcional:** Quebrar métodos complexos em partes menores e reutilizáveis

4. **Coesão e Responsabilidade Única:** Cada método (público ou privado) com propósito claro e único

5. **Encapsulamento de Detalhes:** Lógica auxiliar oculta, expondo apenas operações essenciais

### Pilares Fundamentais

- **Identificação de Duplicação:** Reconhecer quando múltiplos defaults repetem lógica
- **Extração para Private:** Mover lógica compartilhada para método privado
- **Nomes Descritivos:** Métodos privados com nomes que documentam propósito
- **Composição de Métodos:** Métodos default públicos compõem chamando privados
- **Manutenção Simplificada:** Mudanças em lógica compartilhada afetam apenas um lugar

### Visão Geral das Nuances

- **Granularidade Adequada:** Métodos privados não devem ser nem muito grandes nem muito pequenos
- **Acoplamento Interno:** Métodos privados podem ser fortemente acoplados entre si (aceitável)
- **Testabilidade Indireta:** Métodos privados testados através dos públicos que os chamam
- **Refatoração Segura:** Métodos privados podem ser modificados sem afetar implementações
- **Documentação Via Nome:** Nome do método privado deve explicar o que faz

---

## 🧠 Fundamentos Teóricos

### Padrões de Reutilização

#### Padrão 1: Validação Compartilhada

```java
interface UserValidator {
    default boolean isValidForRegistration(User user) {
        return validateNotNull(user) &&
               validateEmail(user.getEmail()) &&
               validatePassword(user.getPassword());
    }

    default boolean isValidForUpdate(User user) {
        return validateNotNull(user) &&
               validateEmail(user.getEmail());
        // Senha não é validada em update
    }

    default boolean isValidForLogin(String email, String password) {
        return validateEmail(email) &&
               validatePassword(password);
    }

    // Validações reutilizadas via métodos privados
    private boolean validateNotNull(User user) {
        return user != null;
    }

    private boolean validateEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }

    private boolean validatePassword(String password) {
        return password != null && password.length() >= 8;
    }
}
```

**Conceito:** Validações atômicas reutilizadas em diferentes combinações pelos métodos públicos.

#### Padrão 2: Transformação em Pipeline

```java
interface DataProcessor {
    default String processForDisplay(String raw) {
        String validated = validateInput(raw);
        String cleaned = cleanData(validated);
        String formatted = formatForDisplay(cleaned);
        return formatted;
    }

    default String processForStorage(String raw) {
        String validated = validateInput(raw);  // REUTILIZA
        String cleaned = cleanData(validated);  // REUTILIZA
        String normalized = normalizeForStorage(cleaned);
        return normalized;
    }

    // Passos reutilizados
    private String validateInput(String input) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input inválido");
        }
        return input;
    }

    private String cleanData(String data) {
        return data.trim().replaceAll("\\s+", " ");
    }

    // Passos específicos
    private String formatForDisplay(String data) {
        return data.toUpperCase();
    }

    private String normalizeForStorage(String data) {
        return data.toLowerCase();
    }
}
```

**Conceito:** Pipeline de transformação onde passos iniciais (validação, limpeza) são compartilhados; passos finais são específicos.

#### Padrão 3: Template Method com Passos Compartilhados

```java
interface ReportGenerator {
    default String generateSummaryReport(List<Data> data) {
        StringBuilder report = new StringBuilder();
        appendHeader(report, "SUMMARY");  // REUTILIZA
        data.forEach(d -> appendSummaryLine(report, d));
        appendFooter(report);  // REUTILIZA
        return report.toString();
    }

    default String generateDetailedReport(List<Data> data) {
        StringBuilder report = new StringBuilder();
        appendHeader(report, "DETAILED");  // REUTILIZA
        data.forEach(d -> appendDetailedLine(report, d));
        appendFooter(report);  // REUTILIZA
        return report.toString();
    }

    // Métodos compartilhados
    private void appendHeader(StringBuilder sb, String type) {
        sb.append("=== ").append(type).append(" REPORT ===\n");
        sb.append("Generated: ").append(LocalDateTime.now()).append("\n\n");
    }

    private void appendFooter(StringBuilder sb) {
        sb.append("\n=== END ===\n");
    }

    // Métodos específicos
    private void appendSummaryLine(StringBuilder sb, Data d) {
        sb.append(d.getId()).append(": ").append(d.getName()).append("\n");
    }

    private void appendDetailedLine(StringBuilder sb, Data d) {
        sb.append("ID: ").append(d.getId()).append("\n");
        sb.append("Name: ").append(d.getName()).append("\n");
        sb.append("Details: ").append(d.getDetails()).append("\n\n");
    }
}
```

**Conceito:** Template Method pattern - estrutura compartilhada (header/footer), conteúdo variável (summary/detailed).

### Princípios de Extração

#### Quando Extrair para Método Privado

**Critério 1: Duplicação Detectada**
```java
// ❌ Antes - duplicação
default void method1() {
    if (condition) {
        // 10 linhas de código X
    }
}

default void method2() {
    if (condition) {
        // MESMAS 10 linhas de código X
    }
}

// ✅ Depois - extraído
default void method1() {
    if (condition) {
        sharedLogic();
    }
}

default void method2() {
    if (condition) {
        sharedLogic();
    }
}

private void sharedLogic() {
    // 10 linhas de código X em um lugar
}
```

**Regra:** Se código aparece 2+ vezes, extraia.

**Critério 2: Complexidade Alta**
```java
// ❌ Antes - método longo e complexo
default Result process(Input input) {
    // 50 linhas de lógica complexa misturando
    // validação + transformação + cálculo + formatação
}

// ✅ Depois - decomposto
default Result process(Input input) {
    validate(input);
    Transformed transformed = transform(input);
    Calculated calculated = calculate(transformed);
    return format(calculated);
}

private void validate(Input input) { /* ... */ }
private Transformed transform(Input input) { /* ... */ }
private Calculated calculate(Transformed t) { /* ... */ }
private Result format(Calculated c) { /* ... */ }
```

**Regra:** Se método tem mais de 20-30 linhas, considere decompor.

**Critério 3: Responsabilidade Distinta**
```java
// ❌ Antes - múltiplas responsabilidades misturadas
default void processUser(User user) {
    // Validação
    if (user.getName() == null) { /* ... */ }
    // Persistência
    database.save(user);
    // Notificação
    emailService.send(user.getEmail(), "Welcome");
    // Logging
    logger.log("User processed: " + user.getId());
}

// ✅ Depois - responsabilidades separadas
default void processUser(User user) {
    validateUser(user);
    persistUser(user);
    notifyUser(user);
    logProcessing(user);
}

private void validateUser(User user) { /* ... */ }
private void persistUser(User user) { /* ... */ }
private void notifyUser(User user) { /* ... */ }
private void logProcessing(User user) { /* ... */ }
```

**Regra:** Se método faz múltiplas coisas distintas, separe responsabilidades.

### Modelo Mental para Compreensão

#### Metáfora: "Receita Culinária"

**Métodos Default Públicos = Receitas Completas:**
- "Bolo de Chocolate" (método público)
- "Torta de Maçã" (método público)

**Métodos Privados = Técnicas/Preparações Reutilizadas:**
- "Fazer massa básica" (privado - usado em bolo E torta)
- "Preparar calda" (privado - usado em múltiplas receitas)
- "Pré-aquecer forno a 180°C" (privado - padrão em várias receitas)

**Analogia:**
- Receitas completas (públicas) referenciam técnicas básicas (privadas)
- Técnicas são documentadas uma vez, reutilizadas múltiplas vezes
- Se técnica muda (ex: temperatura do forno), atualiza-se em um lugar

#### Modelo: "Composição de Blocos Lego"

```
[Método Default Público 1]
    └── Usa [Bloco Privado A]
    └── Usa [Bloco Privado B]
    └── Usa [Bloco Privado C]

[Método Default Público 2]
    └── Usa [Bloco Privado A]  ← REUTILIZA
    └── Usa [Bloco Privado C]  ← REUTILIZA
    └── Usa [Bloco Privado D]

[Método Default Público 3]
    └── Usa [Bloco Privado B]  ← REUTILIZA
    └── Usa [Bloco Privado D]  ← REUTILIZA
```

**Conceito:** Métodos públicos são construções únicas feitas de blocos privados reutilizáveis em diferentes combinações.

---

## 🔍 Análise Conceitual Profunda

### Casos Reais de Reutilização

#### Caso 1: Interface de Formatação

```java
interface CurrencyFormatter {
    default String formatBRL(double amount) {
        return formatCurrency(amount, "R$", "pt", "BR");
    }

    default String formatUSD(double amount) {
        return formatCurrency(amount, "$", "en", "US");
    }

    default String formatEUR(double amount) {
        return formatCurrency(amount, "€", "de", "DE");
    }

    // Lógica de formatação reutilizada
    private String formatCurrency(double amount, String symbol, String lang, String country) {
        Locale locale = new Locale(lang, country);
        NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
        String formatted = formatter.format(amount);
        return symbol + " " + formatted;
    }
}
```

**Benefício:** Lógica de formatação complexa em um lugar; métodos públicos apenas especificam parâmetros.

#### Caso 2: Interface de Validação com Regras Compostas

```java
interface PasswordValidator {
    default boolean isStrongPassword(String password) {
        return hasMinLength(password, 8) &&
               containsUpperCase(password) &&
               containsLowerCase(password) &&
               containsDigit(password) &&
               containsSpecialChar(password);
    }

    default boolean isMediumPassword(String password) {
        return hasMinLength(password, 6) &&
               (containsUpperCase(password) || containsDigit(password));
    }

    default boolean isWeakPassword(String password) {
        return hasMinLength(password, 4);
    }

    // Validações atômicas reutilizadas
    private boolean hasMinLength(String pwd, int min) {
        return pwd != null && pwd.length() >= min;
    }

    private boolean containsUpperCase(String pwd) {
        return pwd != null && pwd.matches(".*[A-Z].*");
    }

    private boolean containsLowerCase(String pwd) {
        return pwd != null && pwd.matches(".*[a-z].*");
    }

    private boolean containsDigit(String pwd) {
        return pwd != null && pwd.matches(".*\\d.*");
    }

    private boolean containsSpecialChar(String pwd) {
        return pwd != null && pwd.matches(".*[!@#$%^&*].*");
    }
}
```

**Benefício:** Regras atômicas combinadas de formas diferentes para criar políticas de senha variadas.

#### Caso 3: Interface de Cálculo com Passos Compartilhados

```java
interface TaxCalculator {
    default double calculateTotalWithTax(double amount, double taxRate) {
        double validated = validateAmount(amount);
        double taxAmount = calculateTax(validated, taxRate);
        return roundToTwoDecimals(validated + taxAmount);
    }

    default double calculateNetAfterTax(double amount, double taxRate) {
        double validated = validateAmount(amount);
        double taxAmount = calculateTax(validated, taxRate);
        return roundToTwoDecimals(validated - taxAmount);
    }

    default double calculateTaxOnly(double amount, double taxRate) {
        double validated = validateAmount(amount);
        return roundToTwoDecimals(calculateTax(validated, taxRate));
    }

    // Passos reutilizados
    private double validateAmount(double amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        return amount;
    }

    private double calculateTax(double amount, double rate) {
        return amount * rate;
    }

    private double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
```

**Benefício:** Validação, cálculo e arredondamento centralizados; métodos públicos compõem lógica de negócio.

---

## 🎯 Aplicabilidade e Contextos

### Quando Aplicar Reutilização

**Situação 1: Múltiplos Defaults com Lógica Similar**
Se você tem 3+ métodos default que fazem coisas parecidas com variações, extraia partes comuns.

**Situação 2: Validações Repetidas**
Se validação de input/output aparece em múltiplos métodos, centralize.

**Situação 3: Formatações/Conversões Duplicadas**
Transformações de dados repetidas devem ser extraídas.

**Situação 4: Métodos Default Longos**
Se método default tem mais de 20-30 linhas, decomponha em passos privados.

### Como Identificar Oportunidades

**Técnica 1: Code Review**
Durante revisão, procurar por blocos de código idênticos ou muito similares.

**Técnica 2: Refatoração Incremental**
Ao adicionar novo método default que precisa de lógica já existente, extraia ao invés de duplicar.

**Técnica 3: Regra de Três**
Primeira vez: escreva inline
Segunda vez: duplica (ainda aceitável)
Terceira vez: OBRIGATORIAMENTE extraia para método privado

---

## ⚠️ Limitações e Considerações

### Cuidados ao Reutilizar

**1. Não Extraia Prematuramente**
```java
// ❌ Ruim - extração desnecessária para código trivial
default int add(int a, int b) {
    return performAddition(a, b);
}

private int performAddition(int a, int b) {
    return a + b;  // Trivial demais para extrair
}
```

**Regra:** Só extraia se código é não-trivial OU aparece múltiplas vezes.

**2. Evite Métodos Privados Muito Pequenos**
```java
// ❌ Excessivo - método privado para uma linha
private boolean isNull(Object obj) {
    return obj == null;
}
```

**3. Evite Muitos Níveis de Indireção**
```java
// ❌ Ruim - cadeia longa demais
default void publicMethod() {
    privateMethod1();
}

private void privateMethod1() {
    privateMethod2();
}

private void privateMethod2() {
    privateMethod3();
}

private void privateMethod3() {
    // Finalmente faz algo...
}
```

**Regra:** Máximo 2-3 níveis de profundidade.

---

## 🔗 Interconexões Conceituais

### Relação com Princípios SOLID

**DRY (Don't Repeat Yourself):** Métodos privados eliminam duplicação
**SRP (Single Responsibility):** Cada método privado com propósito único
**OCP (Open/Closed):** Lógica compartilhada pode evoluir sem mudar públicos

### Relação com Padrões de Design

**Template Method:** Métodos públicos como template, privados como passos
**Strategy:** Diferentes métodos públicos usando mesmos helpers privados
**Composite:** Métodos privados compostos para criar funcionalidade complexa

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Escrever Métodos Default:** Inicialmente sem preocupação com reutilização
2. **Identificar Duplicação:** Perceber código repetido
3. **Extrair para Privado:** Refatorar movendo para método privado
4. **Nomear Claramente:** Dar nomes descritivos aos privados
5. **Manter e Evoluir:** Modificar privados conforme necessário

---

## 📚 Conclusão

A reutilização de código entre métodos default via métodos privados é prática essencial para interfaces modernas em Java. Ela transforma o dilema entre duplicação e poluição de API em solução elegante onde lógica compartilhada fica organizada, encapsulada e reutilizável.

Dominar esta técnica significa escrever interfaces mais limpas, manuteníveis e profissionais - onde cada método tem propósito claro, duplicação é eliminada, e complexidade é adequadamente gerenciada através de decomposição funcional bem estruturada.

