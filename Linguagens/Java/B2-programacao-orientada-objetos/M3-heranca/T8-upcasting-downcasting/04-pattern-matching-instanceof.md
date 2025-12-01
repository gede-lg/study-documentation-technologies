# Pattern Matching com `instanceof` (Java 16+)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Pattern matching com `instanceof`** (Java 16+) é evolução sintática que combina verificação de tipo e cast em **expressão única**: `if (obj instanceof Tipo variavel)` verifica tipo E declara variável tipada automaticamente, eliminando cast explícito. Reduz **boilerplate** de pattern tradicional `if (obj instanceof Tipo) { Tipo t = (Tipo) obj; }` para sintaxe mais concisa e segura.

Conceitualmente, pattern matching trata `instanceof` não como mero **teste booleano**, mas como **extração de tipo** - "se objeto é deste tipo, declare variável com este tipo e prossiga". Analogia: abertura de presente - verificar "é livro?" e simultaneamente "então pegue como livro e leia" em ação única, ao invés de verificar, abrir, converter.

Propósito fundamental é **reduzir verbosidade** e **prevenir erros**: cast manual pode ser esquecido, variável pode não existir em todos escopos. Pattern matching garante que variável tipada só existe quando cast é seguro - **impossível usar variável sem verificação**. É type safety melhorado via sintaxe.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Sintaxe Concisa:** `instanceof Tipo var` combina check + cast + declaração
2. **Escopo Automático:** Variável existe apenas onde cast é seguro
3. **Flow Scoping:** Compilador rastreia fluxo para determinar escopo
4. **Elimina Cast:** Não precisa `(Tipo) obj` explícito
5. **Type Safety:** Impossível usar variável sem verificação prévia
6. **Java 16+:** Feature de preview em 14-15, padrão em 16

---

## 🧠 Fundamentos Teóricos

### Sintaxe Tradicional vs Pattern Matching

```java
class Animal {
    private String nome;

    public Animal(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}

class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }

    public void abanarRabo() {
        System.out.println(getNome() + " abanando rabo");
    }
}

Animal animal = new Cachorro("Rex");

// ========== ANTES (Java 15-): 3 passos ==========
if (animal instanceof Cachorro) {         // 1. Verificar tipo
    Cachorro cachorro = (Cachorro) animal; // 2. Cast explícito
    cachorro.abanarRabo();                 // 3. Usar variável
}

// ========== DEPOIS (Java 16+): 1 passo ==========
if (animal instanceof Cachorro c) {  // Verifica + declara + cast automático
    c.abanarRabo();  // ✅ 'c' já é Cachorro, sem cast manual
}

// Benefícios:
// - Menos código
// - Sem cast explícito
// - Variável 'c' só existe onde é segura
// - Compilador garante type safety
```

**Fundamento:**
- **Sintaxe:** `instanceof Tipo nomeVariavel`
- **Declaração implícita:** `c` é automaticamente `Cachorro`
- **Escopo limitado:** `c` existe apenas dentro do `if` onde verificação é `true`
- **Sem cast manual:** Conversão é automática e segura

### Flow Scoping: Escopo Inteligente

```java
Object obj = "texto";

// ✅ Pattern matching com flow scoping
if (obj instanceof String s) {
    // 's' existe aqui - verificação passou
    System.out.println(s.toUpperCase());  // "TEXTO"
    System.out.println(s.length());       // 5
}
// ❌ 's' NÃO existe aqui - fora do escopo

// ✅ Flow scoping com negação
if (!(obj instanceof String s)) {
    // obj NÃO é String
    System.out.println("Não é string");
} else {
    // 's' existe aqui - compilador sabe que verificação falhou no if
    System.out.println(s.toUpperCase());
}

// ✅ Flow scoping com return early
if (!(obj instanceof String s)) {
    return;  // Sai se não for String
}
// 's' existe aqui! Compilador sabe que só chega aqui se verificação passou
System.out.println(s.toUpperCase());
```

**Fundamento:** **Flow scoping** - compilador rastreia fluxo de controle para determinar onde variável pattern pode ser usada. Variável existe apenas em blocos onde verificação `instanceof` garante que é `true`.

### Pattern Matching com if-else if

```java
void processar(Object obj) {
    if (obj instanceof String s) {
        System.out.println("String: " + s.toUpperCase());
    } else if (obj instanceof Integer i) {
        System.out.println("Integer: " + (i * 2));
    } else if (obj instanceof Double d) {
        System.out.println("Double: " + (d / 2));
    } else {
        System.out.println("Tipo desconhecido");
    }
}

// Uso:
processar("java");     // "String: JAVA"
processar(42);         // "Integer: 84"
processar(10.5);       // "Double: 5.25"
processar(new Object()); // "Tipo desconhecido"

// Cada branch tem variável própria (s, i, d)
// Sem casts manuais
// Código mais limpo
```

**Fundamento:** Cada branch `else if` pode ter **variável pattern diferente** - `s` para String, `i` para Integer, `d` para Double. Variáveis não conflitam porque escopos são disjuntos.

### Pattern Matching com Operadores Lógicos

```java
Object obj = "Java";

// ✅ && (AND) - variável disponível à direita
if (obj instanceof String s && s.length() > 3) {
    System.out.println("String longa: " + s);
}
// 's' pode ser usado no lado direito do && porque já foi verificado

// ❌ ERRO: || (OR) - variável NÃO disponível
// if (obj instanceof String s || s.isEmpty()) {
//     // ERRO: 's' pode não existir (se verificação falhou, || continua)
// }

// ✅ Negação com early return
if (!(obj instanceof String s)) {
    return;
}
System.out.println(s);  // 's' existe aqui - flow scoping
```

**Fundamento:** Com `&&`, lado direito só executa se esquerdo for `true` - variável pattern está disponível. Com `||`, lado direito pode executar mesmo se esquerdo for `false` - variável pode não existir, compilador proíbe uso.

---

## 🔍 Análise Conceitual Profunda

### Exemplo Completo: Processamento de Formas

```java
abstract class Forma {
    public abstract double calcularArea();
}

class Circulo extends Forma {
    private double raio;

    public Circulo(double raio) {
        this.raio = raio;
    }

    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }

    public double getRaio() {
        return raio;
    }
}

class Retangulo extends Forma {
    private double largura, altura;

    public Retangulo(double largura, double altura) {
        this.largura = largura;
        this.altura = altura;
    }

    @Override
    public double calcularArea() {
        return largura * altura;
    }

    public double getLargura() { return largura; }
    public double getAltura() { return altura; }
}

// ========== ANTES (Java 15-) ==========
void descreverForma(Forma forma) {
    if (forma instanceof Circulo) {
        Circulo c = (Circulo) forma;
        System.out.println("Círculo com raio " + c.getRaio());
        System.out.println("Área: " + c.calcularArea());
    } else if (forma instanceof Retangulo) {
        Retangulo r = (Retangulo) forma;
        System.out.println("Retângulo " + r.getLargura() + "x" + r.getAltura());
        System.out.println("Área: " + r.calcularArea());
    }
}

// ========== DEPOIS (Java 16+) ==========
void descreverForma(Forma forma) {
    if (forma instanceof Circulo c) {
        System.out.println("Círculo com raio " + c.getRaio());
        System.out.println("Área: " + c.calcularArea());
    } else if (forma instanceof Retangulo r) {
        System.out.println("Retângulo " + r.getLargura() + "x" + r.getAltura());
        System.out.println("Área: " + r.calcularArea());
    }
}

// Redução de 6 linhas (casts) para código mais limpo
```

**Análise:** Pattern matching elimina **todas casts explícitas** - código mais curto, mais legível, menos propenso a erros (esquecer cast, cast errado).

### Pattern Matching em Equals

```java
// ========== ANTES ==========
class Ponto {
    private int x, y;

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Ponto)) {
            return false;
        }
        Ponto outro = (Ponto) obj;  // Cast manual
        return this.x == outro.x && this.y == outro.y;
    }
}

// ========== DEPOIS (Java 16+) ==========
class Ponto {
    private int x, y;

    @Override
    public boolean equals(Object obj) {
        // Pattern matching elimina cast
        if (!(obj instanceof Ponto outro)) {
            return false;
        }
        return this.x == outro.x && this.y == outro.y;
    }

    // Alternativa com return direto
    @Override
    public boolean equals(Object obj) {
        return obj instanceof Ponto outro &&
               this.x == outro.x &&
               this.y == outro.y;
    }
}
```

**Análise:** Método `equals` é caso de uso clássico - recebe `Object`, precisa verificar tipo e cast. Pattern matching simplifica drasticamente.

### Pattern Matching em Switch (Java 17+ Preview)

```java
// Java 17+ permite pattern matching em switch (preview)
String formatar(Object obj) {
    return switch (obj) {
        case String s -> "String: " + s.toUpperCase();
        case Integer i -> "Integer: " + i;
        case Double d -> String.format("Double: %.2f", d);
        case null -> "Null";
        default -> "Desconhecido: " + obj;
    };
}

// Cada case tem variável pattern (s, i, d)
// Switch com pattern matching é ainda mais poderoso

formatar("java");   // "String: JAVA"
formatar(42);       // "Integer: 42"
formatar(3.14);     // "Double: 3.14"
formatar(null);     // "Null"
```

**Análise:** Java 17+ estende pattern matching para **switch expressions** - cada `case` pode ter pattern com variável. Substitui cadeias de `if-else if` por switch mais expressivo.

### Limitações: Não Funciona com Variáveis Locais

```java
Object obj = "texto";

// ❌ ERRO: não pode redeclarar variável existente
// String obj = "outro texto";
// if (obj instanceof String obj) { }  // ERRO: 'obj' já existe

// ✅ Deve usar nome diferente
if (obj instanceof String s) {
    // 's' é nova variável, 'obj' ainda existe
    System.out.println(s);
}
```

**Limitação:** Variável pattern não pode ter **mesmo nome** que variável existente no escopo.

---

## 🎯 Aplicabilidade e Contextos

### Refatoração de Código Legacy

```java
// ========== CÓDIGO LEGACY (pré-Java 16) ==========
Object resultado = executarOperacao();

if (resultado instanceof String) {
    String texto = (String) resultado;
    processarTexto(texto);
} else if (resultado instanceof Integer) {
    Integer numero = (Integer) resultado;
    processarNumero(numero);
} else if (resultado instanceof List) {
    List lista = (List) resultado;
    processarLista(lista);
}

// ========== REFATORADO (Java 16+) ==========
Object resultado = executarOperacao();

if (resultado instanceof String texto) {
    processarTexto(texto);
} else if (resultado instanceof Integer numero) {
    processarNumero(numero);
} else if (resultado instanceof List lista) {
    processarLista(lista);
}

// Benefícios:
// - 3 linhas removidas (casts)
// - Mais legível
// - Menos propenso a erros
```

**Aplicabilidade:** Pattern matching facilita **refatoração** de código existente - substituir pattern antigo por novo é mecânico e seguro.

### Validação de Input

```java
void processar(Object input) {
    // Validações com pattern matching
    if (!(input instanceof String s && !s.isEmpty())) {
        throw new IllegalArgumentException("Input deve ser String não-vazia");
    }

    // 's' disponível aqui - flow scoping
    System.out.println("Processando: " + s);
}

// Alternativa com early return
void processar(Object input) {
    if (!(input instanceof String s)) {
        throw new IllegalArgumentException("Input deve ser String");
    }

    if (s.isEmpty()) {
        throw new IllegalArgumentException("String não pode ser vazia");
    }

    System.out.println("Processando: " + s);
}
```

**Aplicabilidade:** Validação de tipos com pattern matching é mais concisa que alternativas.

---

## ⚠️ Limitações e Considerações

### Não Substitui Polimorfismo

```java
// ❌ Ainda é code smell mesmo com pattern matching
void processar(Animal animal) {
    if (animal instanceof Cachorro c) {
        c.latir();
    } else if (animal instanceof Gato g) {
        g.miar();
    } else if (animal instanceof Passaro p) {
        p.cantar();
    }
    // Pattern matching não resolve design ruim
}

// ✅ Design correto: polimorfismo
abstract class Animal {
    public abstract void emitirSom();
}

void processar(Animal animal) {
    animal.emitirSom();  // Sem instanceof, sem pattern matching
}
```

**Limitação:** Pattern matching **não resolve** design ruim - apenas torna código ruim mais conciso. Preferir polimorfismo quando possível.

### Escopo Pode Ser Confuso

```java
Object obj = "texto";

// ✅ 's' existe no then
if (obj instanceof String s) {
    System.out.println(s);  // OK
}

// ❌ 's' NÃO existe aqui
// System.out.println(s);  // ERRO

// ✅ 's' existe no else (negação)
if (!(obj instanceof String s)) {
    System.out.println("Não é string");
} else {
    System.out.println(s);  // OK - flow scoping
}
```

**Consideração:** Flow scoping pode ser **contra-intuitivo** - variável existe em locais determinados por análise de fluxo, não apenas dentro de `{}`.

---

## 🔗 Interconexões Conceituais

### Relação com instanceof Tradicional

Pattern matching é **evolução** de `instanceof` - mesma semântica, sintaxe melhorada.

### Relação com Downcasting

Pattern matching **elimina** downcasting explícito - cast é automático e implícito.

### Relação com Type Safety

Pattern matching melhora **type safety** via sintaxe - impossível usar variável sem verificação.

---

## 🚀 Evolução e Próximos Conceitos

### Progressão: Switch com Pattern Matching (Java 17+)

Java 17+ estende pattern matching para switch - ainda mais poderoso que `if-else if`.

### Direção: Record Patterns (Java 19+)

Java 19+ permite desconstruir records em patterns: `if (obj instanceof Point(int x, int y))`.

### Caminho: Sealed Classes

Sealed classes + pattern matching permite exhaustiveness checking - compilador verifica todos casos.

---

## 📚 Conclusão

Pattern matching com `instanceof` (Java 16+) combina verificação de tipo e cast em expressão única: `if (obj instanceof Tipo var)` verifica, declara e converte automaticamente. Elimina cast explícito, reduz boilerplate, melhora type safety via flow scoping. Variável existe apenas onde verificação garante segurança.

Dominar pattern matching significa:
- Usar sintaxe `instanceof Tipo var` ao invés de check + cast separados
- Entender flow scoping - variável existe onde compilador garante tipo
- Aplicar em refatoração de código legacy para eliminar casts
- Combinar com `&&` para condições compostas
- Usar em `equals`, validações, processamento de tipos heterogêneos
- Reconhecer que não substitui polimorfismo - apenas sintaxe melhor
- Preparar para switch com pattern matching (Java 17+)
- Aproveitar em hierarquias onde `instanceof` é legítimo

Pattern matching não é "feature cosmética" - é **melhoria de type safety** via sintaxe. Cast manual pode ser esquecido, aplicado ao objeto errado, repetido desnecessariamente. Pattern matching **garante** que variável só existe quando cast é seguro - **impossível usar sem verificação**. É compilador prevenindo categoria inteira de bugs. Não resolve design ruim (polimorfismo ainda é melhor), mas onde `instanceof` é apropriado (equals, deserialização, event handling), pattern matching torna código mais seguro e conciso.
