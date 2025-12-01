# Pattern Matching em Switch (Java 17+)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Pattern matching em switch** (Java 17+) é extensão que permite **testar tipos** e **desconstruir objetos** diretamente no switch, ao invés de apenas comparar valores primitivos. Conceitualmente, transforma switch de "seleção por valor" em "seleção por **tipo e estrutura**" — permite despachar diferentes lógicas baseado no tipo runtime de um objeto.

**Comparação:**

```java
// SEM pattern matching (verboso)
Object obj = obterObjeto();

String resultado;
if (obj instanceof String) {
    String s = (String) obj;
    resultado = "String de tamanho " + s.length();
} else if (obj instanceof Integer) {
    Integer i = (Integer) obj;
    resultado = "Integer: " + i;
} else if (obj instanceof Double) {
    Double d = (Double) obj;
    resultado = "Double: " + d;
} else {
    resultado = "Desconhecido";
}

// COM pattern matching (conciso)
Object obj = obterObjeto();

String resultado = switch (obj) {
    case String s -> "String de tamanho " + s.length();
    case Integer i -> "Integer: " + i;
    case Double d -> "Double: " + d;
    case null, default -> "Desconhecido";
};
```

**Conceito Fundamental:** Pattern matching **une teste de tipo + cast + extração de variável** em uma operação — elimina cascata de `instanceof` seguido de cast manual. É **type-safe** — compilador garante que variável pattern tem tipo correto.

### Contexto Histórico e Motivação

**Problema com instanceof:**

```java
// Visitor pattern clássico (verboso)
if (forma instanceof Circulo) {
    Circulo c = (Circulo) forma;
    calcularAreaCirculo(c);
} else if (forma instanceof Retangulo) {
    Retangulo r = (Retangulo) forma;
    calcularAreaRetangulo(r);
} else if (forma instanceof Triangulo) {
    Triangulo t = (Triangulo) forma;
    calcularAreaTriangulo(t);
}
```

**Motivação:** Linguagens modernas (Scala, Rust, Kotlin, Swift) têm pattern matching nativo — permite **dispatch baseado em tipo** de forma concisa e segura.

**Evolução em Java:**

- **Java 14 (2020):** Pattern matching for `instanceof` (JEP 305) — preview
- **Java 16 (2021):** Pattern matching for `instanceof` — **standard** (JEP 394)
- **Java 17 (2021):** Pattern matching for `switch` — **preview** (JEP 406)
- **Java 18-19 (2022):** Segunda/terceira preview com refinamentos
- **Java 21 (2023):** **Standard feature** (JEP 441)

**Motivação:**

1. **Eliminar Boilerplate:** Testar tipo + cast em uma operação
2. **Type Safety:** Compilador garante correção de tipos
3. **Expressividade:** Código mais declarativo (o quê vs como)
4. **Preparação:** Fundamento para sealed classes e algebraic data types

### Problema Fundamental que Resolve

**Problema: Type Dispatch com instanceof**

```java
// Processamento baseado em tipo (verboso e error-prone)
void processar(Object obj) {
    if (obj instanceof String) {
        String s = (String) obj;  // Cast manual
        System.out.println("String: " + s.toUpperCase());
    } else if (obj instanceof Integer) {
        Integer i = (Integer) obj;  // Cast manual
        System.out.println("Integer: " + (i * 2));
    } else if (obj instanceof List) {
        List<?> lista = (List<?>) obj;  // Cast manual
        System.out.println("List tamanho: " + lista.size());
    }
}
```

**Solução: Pattern Matching**

```java
void processar(Object obj) {
    switch (obj) {
        case String s -> System.out.println("String: " + s.toUpperCase());
        case Integer i -> System.out.println("Integer: " + (i * 2));
        case List<?> lista -> System.out.println("List tamanho: " + lista.size());
        case null, default -> System.out.println("Outro tipo");
    }
}
```

**Conceito:** Pattern matching **extrai** e **nomeia** variável do tipo correto automaticamente.

### Importância no Ecossistema

Pattern matching é **fundamento** para:

- **Sealed Classes (Java 17+):** Hierarquias fechadas com dispatch exaustivo
- **Record Deconstruction:** Extrair componentes de records
- **Algebraic Data Types (Futuro):** Sum types como Rust/Haskell
- **Functional Programming:** Estilo mais funcional em Java

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Type Pattern:** `case TipoX variavel -> ...`
2. **Automático Cast:** Compilador faz cast para tipo correto
3. **Guarded Patterns:** `case String s when s.length() > 5 -> ...`
4. **Null Handling:** `case null -> ...` trata null explicitamente
5. **Exaustividade:** Compilador exige todos os tipos cobertos (com sealed)

### Pilares Fundamentais

- **Type Testing + Casting:** Une instanceof + cast em uma operação
- **Pattern Variables:** Variáveis nomeadas extraídas automaticamente
- **Guards:** Condições adicionais com `when`
- **Sealed Type Exhaustiveness:** Switch exaustivo para sealed classes
- **Null Safety:** Trata null explicitamente sem NPE

---

## 🧠 Fundamentos Teóricos

### Type Pattern Básico

**Sintaxe:**

```java
Object obj = "Hello";

String resultado = switch (obj) {
    case String s -> "String: " + s;
    case Integer i -> "Integer: " + i;
    case Double d -> "Double: " + d;
    default -> "Outro";
};
```

**Conceito:** `case String s` testa se `obj instanceof String` E, se sim, cria variável `s` do tipo `String` com cast automático.

**Equivalente Sem Pattern Matching:**

```java
String resultado;
if (obj instanceof String) {
    String s = (String) obj;
    resultado = "String: " + s;
} else if (obj instanceof Integer) {
    Integer i = (Integer) obj;
    resultado = "Integer: " + i;
} else if (obj instanceof Double) {
    Double d = (Double) obj;
    resultado = "Double: " + d;
} else {
    resultado = "Outro";
}
```

### Null Pattern

**Tratamento Explícito de null:**

```java
Object obj = null;

String resultado = switch (obj) {
    case null -> "É null";  // Trata null ANTES de testar tipos
    case String s -> "String: " + s;
    case Integer i -> "Integer: " + i;
    default -> "Outro";
};
```

**Conceito:** Antes de Java 17, `null` causava `NullPointerException`. Agora, `case null` trata explicitamente.

**Combinação null + default:**

```java
switch (obj) {
    case null, default -> System.out.println("Null ou outro tipo");
    case String s -> System.out.println("String");
}
```

### Guarded Patterns (when)

**Condições Adicionais:**

```java
Object obj = "Hello World";

String resultado = switch (obj) {
    case String s when s.length() > 10 -> "String longa: " + s;
    case String s when s.length() > 5 -> "String média: " + s;
    case String s -> "String curta: " + s;
    case Integer i when i > 100 -> "Integer grande";
    case Integer i -> "Integer pequeno";
    default -> "Outro";
};
```

**Conceito:** `when` adiciona **guard** (condição booleana) ao pattern. Patterns são testados **em ordem** — primeiro que corresponde (tipo + guard) executa.

**Ordem Importa:**

```java
// Correto: Mais específico primeiro
switch (obj) {
    case String s when s.isEmpty() -> "String vazia";
    case String s -> "String não-vazia";  // Catch-all para Strings
}

// ERRADO: Unreachable case
switch (obj) {
    case String s -> "String";  // Pega TODAS as Strings
    case String s when s.isEmpty() -> "Nunca alcança!";  // ERRO
}
```

### Exaustividade com Sealed Classes

**Sealed Class (Hierarquia Fechada):**

```java
sealed interface Forma
    permits Circulo, Retangulo, Triangulo {}

record Circulo(double raio) implements Forma {}
record Retangulo(double largura, double altura) implements Forma {}
record Triangulo(double base, double altura) implements Forma {}
```

**Switch Exaustivo (Sem default):**

```java
Forma forma = new Circulo(5.0);

double area = switch (forma) {
    case Circulo c -> Math.PI * c.raio() * c.raio();
    case Retangulo r -> r.largura() * r.altura();
    case Triangulo t -> 0.5 * t.base() * t.altura();
    // default NÃO necessário — compilador sabe que todos os tipos estão cobertos
};
```

**Conceito:** Com sealed classes, compilador **sabe** todos os subtipos possíveis — pode verificar exaustividade em **compile-time**.

**Se Faltar Tipo:**

```java
// ERRO de compilação: switch não cobre todos os tipos
double area = switch (forma) {
    case Circulo c -> Math.PI * c.raio() * c.raio();
    case Retangulo r -> r.largura() * r.altura();
    // Falta Triangulo! Compile error
};
```

---

## 🔍 Análise Conceitual Profunda

### Record Deconstruction (Preview Java 19+)

**Records:**

```java
record Ponto(int x, int y) {}
```

**Deconstruction Pattern (Futuro/Preview):**

```java
Object obj = new Ponto(10, 20);

String resultado = switch (obj) {
    case Ponto(int x, int y) -> "Ponto em (" + x + ", " + y + ")";
    case String s -> "String: " + s;
    default -> "Outro";
};
```

**Conceito:** Pattern matching **extrai componentes** de records — como destructuring em JavaScript/Python.

### Polimorfismo vs Pattern Matching

**Visitor Pattern (OOP Tradicional):**

```java
interface Forma {
    double calcularArea();
}

class Circulo implements Forma {
    double raio;
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

class Retangulo implements Forma {
    double largura, altura;
    public double calcularArea() {
        return largura * altura;
    }
}

// Uso
Forma forma = new Circulo(5.0);
double area = forma.calcularArea();  // Polimorfismo
```

**Pattern Matching (Alternativa):**

```java
sealed interface Forma permits Circulo, Retangulo {}
record Circulo(double raio) implements Forma {}
record Retangulo(double largura, double altura) implements Forma {}

double calcularArea(Forma forma) {
    return switch (forma) {
        case Circulo c -> Math.PI * c.raio() * c.raio();
        case Retangulo r -> r.largura() * r.altura();
    };
}
```

**Trade-Off:**

- **Polimorfismo:** Adicionar operação requer modificar todas as classes
- **Pattern Matching:** Adicionar tipo requer modificar todos os switches

**Conceito:** **Expression Problem** — escolha entre extensibilidade de tipos (polimorfismo) vs extensibilidade de operações (pattern matching).

### Dominance Checking

**Ordem Importa:**

```java
// ERRO: case mais específico APÓS mais geral
switch (obj) {
    case Object o -> "Objeto";  // Pega TUDO
    case String s -> "String";  // ERRO: unreachable
}

// Correto: Mais específico PRIMEIRO
switch (obj) {
    case String s -> "String";
    case Integer i -> "Integer";
    case Object o -> "Objeto";  // Catch-all no final
}
```

**Conceito:** Compilador detecta **dominance** — se um case é mais geral que outro abaixo dele.

---

## 🎯 Aplicabilidade e Contextos

### 1. Processamento de Mensagens/Eventos

```java
sealed interface Mensagem permits Texto, Imagem, Audio {}
record Texto(String conteudo) implements Mensagem {}
record Imagem(byte[] dados, String formato) implements Mensagem {}
record Audio(byte[] dados, int duracao) implements Mensagem {}

void processar(Mensagem msg) {
    switch (msg) {
        case Texto t -> System.out.println("Texto: " + t.conteudo());
        case Imagem i -> System.out.println("Imagem " + i.formato());
        case Audio a -> System.out.println("Áudio " + a.duracao() + "s");
    }
}
```

### 2. Parsing/Desserialização

```java
Object json = parseJSON();

String resultado = switch (json) {
    case Map<?, ?> mapa -> "Objeto JSON";
    case List<?> lista -> "Array JSON com " + lista.size() + " itens";
    case String s -> "String: " + s;
    case Number n -> "Número: " + n;
    case Boolean b -> "Boolean: " + b;
    case null -> "Null";
    default -> "Tipo desconhecido";
};
```

### 3. State Machine

```java
sealed interface Estado permits Aguardando, Processando, Concluido, Erro {}
record Aguardando() implements Estado {}
record Processando(int progresso) implements Estado {}
record Concluido(String resultado) implements Estado {}
record Erro(String mensagem) implements Estado {}

String exibir(Estado estado) {
    return switch (estado) {
        case Aguardando a -> "Aguardando início...";
        case Processando p -> "Processando: " + p.progresso() + "%";
        case Concluido c -> "Concluído: " + c.resultado();
        case Erro e -> "Erro: " + e.mensagem();
    };
}
```

### 4. API Response Handling

```java
sealed interface Resposta<T> permits Sucesso, Falha {}
record Sucesso<T>(T dados) implements Resposta<T> {}
record Falha<T>(int codigo, String mensagem) implements Resposta<T> {}

<T> void processar(Resposta<T> resp) {
    switch (resp) {
        case Sucesso<T>(T dados) -> System.out.println("Dados: " + dados);
        case Falha<T>(int codigo, String msg) ->
            System.err.println("Erro " + codigo + ": " + msg);
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Preview Feature até Java 21

```bash
# Java 17-20 requer flag de preview
javac --enable-preview --release 17 Arquivo.java
java --enable-preview Arquivo
```

**Java 21+:** Standard feature (não requer flag).

### 2. Exaustividade Só com Sealed

```java
// NÃO sealed: precisa de default
interface Forma {}

Forma forma = ...;

double area = switch (forma) {
    case Circulo c -> calcular(c);
    // ERRO: precisa de default (Forma não é sealed)
};
```

### 3. Performance

Pattern matching pode ser mais lento que polimorfismo (dispatch virtual é otimizado por JIT há décadas).

**Benchmark Aproximado:**
- Polimorfismo: ~1-2ns (virtual dispatch)
- Pattern matching: ~5-10ns (tipo check + branch)

**Conceito:** Usar pattern matching por **clareza**, não performance.

### 4. Null Ainda Possível em Guards

```java
String s = null;

switch (s) {
    case String str when str.length() > 5 -> "Longa";  // NPE! str é null
}
```

**Mitigação:**

```java
switch (s) {
    case null -> "Null";
    case String str when str.length() > 5 -> "Longa";  // Seguro
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Sealed Classes

Pattern matching + sealed classes = exaustividade garantida.

### Relação com Records

Record deconstruction permite extrair componentes diretamente no pattern.

### Relação com instanceof (Java 14+)

Pattern matching for `instanceof` foi precursor de pattern matching for `switch`.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Record Deconstruction:** Extrair componentes de records em patterns
2. **Array Patterns:** Pattern matching para arrays
3. **Algebraic Data Types:** Sum types como Rust/Haskell

---

## 📚 Conclusão

**Pattern matching em switch** (Java 17+ preview, Java 21+ standard) permite **testar tipos** e **desconstruir objetos** diretamente no switch. Une teste (`instanceof`) + cast + extração de variável em uma operação. Usa sintaxe `case TipoX variavel -> ...` onde `variavel` tem tipo `TipoX` automaticamente. **Guards** (`when`) adicionam condições booleanas aos patterns. **Null pattern** (`case null`) trata null explicitamente sem `NullPointerException`. Com **sealed classes**, compilador exige **exaustividade** — todos os subtipos devem ser tratados (ou `default`). **Ordem importa** — cases mais específicos primeiro (dominance checking). Elimina boilerplate de `instanceof` + cast manual. É **fundamento** para sealed classes, record deconstruction, e algebraic data types futuros. Trade-off com polimorfismo: pattern matching favorece **extensibilidade de operações** (fácil adicionar funções) vs polimorfismo favorece **extensibilidade de tipos** (fácil adicionar classes). Performance ligeiramente inferior a polimorfismo (5-10ns vs 1-2ns), mas ganhos em clareza compensam. Compreender pattern matching é essencial para código Java moderno e aproveitar sealed classes + records efetivamente.
