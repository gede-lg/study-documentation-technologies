# Tipos Suportados em Switch

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Tipos suportados em switch** são conjunto **restrito** de tipos de dados que podem ser usados como **expressão seletor** no switch. Conceitualmente, restrição existe porque compilador precisa gerar **jump table eficiente** — estrutura que mapeia valores para endereços de código, possível apenas com tipos que têm representação compacta e comparação trivial.

**Tipos Suportados (Evolução):**

- **Java 1-4:** `byte`, `short`, `char`, `int`
- **Java 5+:** Enums
- **Java 7+:** `String`
- **Java 17+:** Pattern matching com tipos complexos (preview/incubator)

**Tipos NÃO Suportados (Tradicional):**

- **`long`, `float`, `double`, `boolean`**
- **Objetos arbitrários** (exceto `String` e enums)

**Exemplo:**

```java
// OK
int x = 5;
switch (x) { /* ... */ }

// OK (Java 7+)
String s = "abc";
switch (s) { /* ... */ }

// ERRO de compilação
long l = 100L;
switch (l) { /* ... */ }  // Error: incompatible types

// ERRO
double d = 1.5;
switch (d) { /* ... */ }  // Error
```

**Conceito Fundamental:** Restrição não é arbitrária — baseada em **limitações de implementação** (jump tables) e **semântica de igualdade** (tipos complexos como `double` têm igualdade problemática: `0.1 + 0.2 != 0.3`).

### Contexto Histórico e Motivação

**Origem em C (1972):**

Switch em C suportava apenas inteiros (`int`, `char`) — implementado como **jump table** em assembly. Compilador gerava array de endereços indexado pelo valor da expressão (O(1) lookup).

**Evolução em Java:**

1. **Java 1 (1995):** Seguiu C — inteiros pequenos (`byte`, `short`, `char`, `int`)
2. **Java 5 (2004):** Adicionou **enums** — internamente são inteiros (`ordinal()`)
3. **Java 7 (2011):** Adicionou **`String`** — internamente usa `hashCode()` + `equals()`
4. **Java 17+ (2021):** Pattern matching com tipos complexos (sealed types)

**Motivação Original (Restrição):**

1. **Performance:** Jump tables O(1) requerem valores inteiros contíguos ou próximos
2. **Simplicidade:** Comparação por `==` (igualdade bit a bit), não `.equals()`
3. **Implementação:** Hardware tem instruções de jump indexado para inteiros

**Trade-off:** Performance/simplicidade vs flexibilidade. Tipos como `long` não suportados porque valores muito esparsos (2^64 possibilidades) tornam jump table inviável.

### Problema Fundamental que Resolve

**Cada Tipo Suportado Tem Motivação Específica:**

**1. Inteiros Pequenos (byte, short, char, int):** Códigos de comando, opcodes, estados numéricos.

**2. Enums (Java 5+):** Estados tipados — compilador avisa sobre valores não tratados.

**3. String (Java 7+):** Comandos textuais, parsing de protocolos, configurações.

**4. Pattern Matching (Java 17+):** Decomposição de tipos complexos (sealed classes).

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Restrição por Design:** Tipos limitados para eficiência (jump tables)
2. **Evolução Gradual:** Java 1 (inteiros) → Java 5 (enum) → Java 7 (String) → Java 17+ (pattern matching)
3. **Implementação Interna:** Diferentes estratégias (jump table vs hash table)
4. **Wrapper Classes:** Autoboxing permite usar `Integer`, mas desencorajado (NPE)
5. **Null Safety:** `null` causa `NullPointerException` (exceto pattern matching Java 17+)

### Pilares Fundamentais

- **Integer Types:** byte, short, char, int (suporte original)
- **Enum Support:** Java 5+ (tipagem forte)
- **String Support:** Java 7+ (hashCode + equals)
- **No Long/Float/Double:** Fora por design (valores esparsos/igualdade complexa)
- **Pattern Matching:** Java 17+ (tipos complexos)

---

## 🧠 Fundamentos Teóricos

### Tipos Inteiros: byte, short, char, int

**Suporte Original (Java 1):**

```java
// byte (-128 a 127)
byte b = 2;
switch (b) {
    case 1: System.out.println("Um"); break;
    case 2: System.out.println("Dois"); break;
}

// short (-32768 a 32767)
short s = 100;
switch (s) {
    case 100: System.out.println("Cem"); break;
}

// char (0 a 65535, Unicode)
char c = 'A';
switch (c) {
    case 'A': System.out.println("A"); break;
    case 'B': System.out.println("B"); break;
}

// int (-2^31 a 2^31-1)
int i = 42;
switch (i) {
    case 42: System.out.println("Resposta"); break;
}
```

**Conceito:** Todos são **promoted para `int`** internamente — Java trata switch como operação em `int`.

**Implementação:** Compilador gera jump table (se valores contíguos) ou lookup table (se esparsos).

### Enum (Java 5+)

**Motivação: Type Safety**

```java
enum DiaSemana {
    DOMINGO, SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO
}

DiaSemana dia = DiaSemana.QUARTA;

switch (dia) {
    case DOMINGO:
    case SABADO:
        System.out.println("Fim de semana");
        break;
    case SEGUNDA:
    case TERCA:
    case QUARTA:
    case QUINTA:
    case SEXTA:
        System.out.println("Dia útil");
        break;
}
```

**Conceito:** Enum switch usa `ordinal()` internamente — posição do enum (inteiro). Compilador pode avisar sobre valores não tratados (se não houver `default`).

**Implementação Interna:**

```java
// Aproximação do que compilador gera
switch (dia.ordinal()) {
    case 0: // DOMINGO
    case 6: // SABADO
        System.out.println("Fim de semana");
        break;
    case 1: // SEGUNDA
    // ...
}
```

**Vantagem:** Compilador avisa se faltam cases (sem `default`):

```java
switch (dia) {
    case DOMINGO: break;
    case SEGUNDA: break;
    // Missing: TERCA, QUARTA, etc. → Warning/Error
}
```

### String (Java 7+)

**Motivação: Comandos Textuais**

```java
String comando = "salvar";

switch (comando) {
    case "novo":
        criarNovo();
        break;
    case "abrir":
        abrir();
        break;
    case "salvar":
        salvar();  // Executa
        break;
    case "sair":
        sair();
        break;
    default:
        System.out.println("Comando desconhecido");
}
```

**Implementação Interna (Complexa):**

1. **Primeira Passagem (hashCode):** Gera switch em `hashCode()` da String
2. **Segunda Passagem (equals):** Verifica igualdade real (hash pode colidir)

**Aproximação do Código Gerado:**

```java
// Aproximação (simplificada)
int hash = comando.hashCode();

switch (hash) {
    case 3392903:  // hashCode de "novo"
        if (comando.equals("novo")) {
            criarNovo();
        }
        break;
    case 93090736:  // hashCode de "abrir"
        if (comando.equals("abrir")) {
            abrir();
        }
        break;
    // ...
}
```

**Conceito:** String switch é **açúcar sintático** — internamente, dois switches (hash + verificação).

**Null Safety:**

```java
String s = null;
switch (s) {  // NullPointerException aqui!
    case "abc": break;
}
```

**Mitigação:**

```java
if (s != null) {
    switch (s) {
        case "abc": break;
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Por Que long Não É Suportado?

**Razão Técnica:** Valores `long` (64 bits) são muito **esparsos** — 2^64 possibilidades. Jump table ficaria gigantesca e ineficiente.

**Exemplo Inviável:**

```java
// Hipotético (não compila)
long l = 1_000_000_000_000L;

switch (l) {
    case 1L: break;
    case 1_000_000_000_000L: break;
    // Jump table precisaria de trilhões de entradas!
}
```

**Alternativa:**

```java
long l = 1_000_000_000_000L;

if (l == 1L) {
    // ...
} else if (l == 1_000_000_000_000L) {
    // ...
}
```

**Ou Converter para int (se possível):**

```java
int i = (int) (l % Integer.MAX_VALUE);
switch (i) { /* ... */ }
```

### Por Que float/double Não São Suportados?

**Razões:**

1. **Igualdade Problemática:** `0.1 + 0.2 != 0.3` devido a imprecisão de ponto flutuante
2. **NaN e Infinity:** Valores especiais tornam comparação complexa
3. **Valores Esparsos:** Impossível criar jump table para todos os valores possíveis

**Exemplo Problemático:**

```java
// Hipotético (não compila)
double d = 0.1 + 0.2;

switch (d) {
    case 0.3:  // Nunca corresponde! (0.1 + 0.2 = 0.30000000000000004)
        // ...
}
```

**Alternativa: Ranges com if-else**

```java
double temperatura = 25.5;

if (temperatura < 10.0) {
    System.out.println("Frio");
} else if (temperatura >= 10.0 && temperatura < 25.0) {
    System.out.println("Agradável");
} else {
    System.out.println("Quente");
}
```

### Por Que boolean Não É Suportado?

**Razão Filosófica:** `boolean` tem apenas dois valores (`true`, `false`) — if-else é mais claro:

```java
// Hipotético (não compila)
boolean flag = true;
switch (flag) {
    case true: A(); break;
    case false: B(); break;
}

// Melhor: if-else
if (flag) {
    A();
} else {
    B();
}
```

**Conceito:** Switch é para **múltiplas escolhas** (3+) — 2 valores não justificam switch.

### Wrapper Classes (Autoboxing)

**Permitido mas Desencorajado:**

```java
Integer x = 5;  // Autoboxing

switch (x) {  // OK (unboxing automático para int)
    case 1: A(); break;
    case 5: B(); break;
}
```

**Perigo: NullPointerException**

```java
Integer x = null;

switch (x) {  // NullPointerException! (unboxing falha)
    case 1: A(); break;
}
```

**Conceito:** Wrapper unboxing pode falhar se `null` — preferir primitivos.

---

## 🎯 Aplicabilidade e Contextos

### 1. Inteiros: Códigos de Status/Comando

```java
int statusHTTP = 404;

switch (statusHTTP) {
    case 200: System.out.println("OK"); break;
    case 404: System.out.println("Not Found"); break;
    case 500: System.out.println("Server Error"); break;
}
```

### 2. char: Single-Character Commands

```java
char comando = 'S';

switch (comando) {
    case 'N': criarNovo(); break;
    case 'O': abrir(); break;
    case 'S': salvar(); break;
    case 'Q': sair(); break;
}
```

### 3. Enum: Type-Safe States

```java
enum Estado {
    INICIAL, PROCESSANDO, CONCLUIDO, ERRO
}

Estado estado = Estado.PROCESSANDO;

switch (estado) {
    case INICIAL: inicializar(); break;
    case PROCESSANDO: processar(); break;
    case CONCLUIDO: finalizar(); break;
    case ERRO: tratarErro(); break;
}
```

### 4. String: Text-Based Commands

```java
String acao = "deletar";

switch (acao) {
    case "criar": criar(); break;
    case "ler": ler(); break;
    case "atualizar": atualizar(); break;
    case "deletar": deletar(); break;
}
```

---

## ⚠️ Limitações e Considerações

### 1. Null em String/Enum

```java
String s = null;
switch (s) {  // NullPointerException
    case "abc": break;
}
```

**Mitigação:**

```java
if (s != null) {
    switch (s) { /* ... */ }
}
```

### 2. String Case-Sensitivity

```java
String s = "ABC";

switch (s) {
    case "abc": break;  // NÃO corresponde (case-sensitive)
}
```

**Solução:**

```java
switch (s.toLowerCase()) {
    case "abc": break;  // Corresponde
}
```

### 3. Performance de String Switch

String switch é **mais lento** que int switch (precisa calcular `hashCode()` + `equals()`).

**Benchmark Aproximado:**
- int switch: ~1ns
- String switch: ~10-20ns (depende do tamanho)

**Conceito:** Se performance crítica, mapear Strings para inteiros:

```java
Map<String, Integer> comandos = Map.of(
    "criar", 1,
    "ler", 2,
    "atualizar", 3,
    "deletar", 4
);

int codigo = comandos.getOrDefault(comando, 0);

switch (codigo) {
    case 1: criar(); break;
    case 2: ler(); break;
    // ...
}
```

### 4. Enum Ordinal Muda

**Perigo (Raro):**

```java
enum Cor { VERMELHO, AZUL, VERDE }

// Se adicionar AMARELO no início:
// enum Cor { AMARELO, VERMELHO, AZUL, VERDE }
// ordinal() de VERMELHO muda de 0 para 1!
```

**Conceito:** Serialização baseada em `ordinal()` pode quebrar — usar `name()`.

---

## 🔗 Interconexões Conceituais

### Relação com Jump Tables

Tipos suportados permitem compilador gerar jump tables eficientes.

### Relação com Pattern Matching (Java 17+)

Nova feature expande tipos suportados para classes complexas.

### Relação com Polimorfismo

Switch em tipos (pattern matching) é alternativa a polimorfismo.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Switch Expressions (Java 12+):** Retornam valores
2. **Pattern Matching (Java 17+):** Switch em tipos complexos
3. **Sealed Classes (Java 17+):** Enums "extensíveis" com switch exhaustivo

---

## 📚 Conclusão

**Tipos suportados em switch** são restritos por **design** para permitir implementação eficiente via **jump tables**. Java 1-4 suportava apenas inteiros pequenos (`byte`, `short`, `char`, `int`). Java 5+ adicionou **enums** (internamente `ordinal()`). Java 7+ adicionou **`String`** (internamente `hashCode()` + `equals()`). **Não suporta:** `long` (valores muito esparsos), `float`/`double` (igualdade problemática, NaN/Infinity), `boolean` (apenas 2 valores — if-else mais claro). Wrapper classes permitidas via autoboxing, mas perigoso (null causa `NullPointerException`). String switch é case-sensitive e mais lento que int (10-20ns vs 1ns). Enum switch permite compilador avisar sobre valores não tratados (sem `default`). Java 17+ introduziu **pattern matching**, expandindo para tipos complexos (sealed classes). Compreender tipos suportados e suas limitações é essencial para usar switch corretamente e escolher alternativas (if-else, polimorfismo) quando apropriado.
