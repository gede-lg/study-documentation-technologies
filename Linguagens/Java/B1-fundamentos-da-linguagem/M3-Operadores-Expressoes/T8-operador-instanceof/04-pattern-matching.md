# Pattern Matching com instanceof (Java 14+)

## 🎯 Introdução e Definição

### Definição Conceitual

**Pattern Matching** com `instanceof` é uma funcionalidade introduzida como **preview** no Java 14 e finalizada no **Java 16** que elimina a necessidade de **cast manual** após verificação de tipo. O pattern matching permite declarar uma variável diretamente na expressão `instanceof`, que estará disponível no escopo do bloco `if` quando a verificação for verdadeira.

**Evolução**:
- **Java ≤ 13**: instanceof tradicional + cast manual
- **Java 14-15**: Pattern matching em preview
- **Java 16+**: Pattern matching finalizado

**Sintaxe tradicional (até Java 15)**:
```java
if (obj instanceof String) {
    String s = (String) obj;  // Cast manual
    System.out.println(s.toUpperCase());
}
```

**Sintaxe com Pattern Matching (Java 16+)**:
```java
if (obj instanceof String s) {  // Declara 's' automaticamente
    System.out.println(s.toUpperCase());  // 's' já é String
}
```

---

## 📋 Sumário Conceitual

### Comparação: Antes vs Depois

**Antes (Java ≤ 15)**:
```java
Object obj = "Hello";

if (obj instanceof String) {
    String s = (String) obj;  // 1. Cast manual
    System.out.println(s.length());
    System.out.println(s.toUpperCase());
}
```

**Depois (Java 16+)**:
```java
Object obj = "Hello";

if (obj instanceof String s) {  // Declaração inline
    System.out.println(s.length());      // 's' disponível
    System.out.println(s.toUpperCase()); // 's' disponível
}
```

**Benefícios**:
- ✅ Menos verbosidade (sem cast manual)
- ✅ Menos propenso a erros (cast automático)
- ✅ Melhor legibilidade
- ✅ Escopo controlado da variável
- ✅ Segurança de tipo garantida

---

## 🧠 Fundamentos Teóricos

### 1. Sintaxe Básica de Pattern Matching

**Forma geral**:
```java
if (expressão instanceof Tipo nomeVariavel) {
    // nomeVariavel está disponível aqui como 'Tipo'
}
```

**Componentes**:
```java
if (obj instanceof String s) {
    //  ┬      ┬         ┬     ┬
    //  │      │         │     └── Variável pattern
    //  │      │         └────── Tipo
    //  │      └──────────────── Operador
    //  └─────────────────────── Objeto testado
    
    // 's' é String aqui
}
```

**Exemplo completo**:
```java
Object obj = "Java";

if (obj instanceof String s) {
    // 's' é automaticamente String (sem cast)
    System.out.println("Comprimento: " + s.length());
    System.out.println("Maiúsculas: " + s.toUpperCase());
    System.out.println("Primeira letra: " + s.charAt(0));
}
```

### 2. Escopo da Variável Pattern

A variável pattern está disponível apenas onde o compilador pode **garantir** que a verificação foi `true`.

**Escopo no bloco if**:
```java
if (obj instanceof String s) {
    // ✅ 's' disponível aqui
    System.out.println(s.length());
}
// ❌ 's' NÃO disponível aqui
```

**Escopo com else**:
```java
if (obj instanceof String s) {
    // ✅ 's' disponível (instanceof retornou true)
    System.out.println(s);
} else {
    // ❌ 's' NÃO disponível (instanceof retornou false)
}
```

**Escopo com condições compostas (&&)**:
```java
// ✅ 's' disponível após && (curto-circuito garante instanceof true)
if (obj instanceof String s && s.length() > 0) {
    System.out.println(s.toUpperCase());
}

// ✅ 's' disponível após && (ordem importa!)
if (obj instanceof String s && !s.isEmpty()) {
    System.out.println(s);
}
```

**Escopo com OR (||) - NÃO funciona**:
```java
// ❌ ERRO: 's' não está garantido após ||
// if (obj instanceof String s || s.length() > 0) {
//     System.out.println(s);
// }
```

**Escopo com negação**:
```java
// ✅ 's' disponível no else (negação)
if (!(obj instanceof String s)) {
    // 's' NÃO disponível aqui (false)
} else {
    // ✅ 's' disponível aqui (negação do false = true)
    System.out.println(s);
}
```

### 3. Flow Typing (Tipagem por Fluxo)

O compilador rastreia o **fluxo de controle** para determinar onde a variável está disponível.

**Exemplo de flow typing**:
```java
if (obj instanceof String s && s.length() > 5) {
    // Compilador sabe:
    // 1. obj é String (instanceof passou)
    // 2. s.length() > 5 (condição passou)
    System.out.println(s.substring(0, 5));
}

if (obj instanceof String s || obj == null) {
    // ❌ 's' NÃO disponível aqui
    // Razão: || não garante que instanceof foi true
}
```

**Early return pattern**:
```java
public void processar(Object obj) {
    if (!(obj instanceof String s)) {
        return;  // Retorna se NÃO for String
    }
    
    // ✅ 's' disponível aqui (compilador sabe que instanceof passou)
    System.out.println(s.toUpperCase());
    System.out.println(s.length());
}
```

**Guard clauses**:
```java
public int calcular(Object obj) {
    if (!(obj instanceof Number n)) {
        throw new IllegalArgumentException("Esperado Number");
    }
    
    // ✅ 'n' disponível após guard clause
    return n.intValue() * 2;
}
```

### 4. Pattern Matching com Múltiplos Tipos

**if-else-if encadeado**:
```java
Object obj = getObject();

if (obj instanceof String s) {
    System.out.println("String: " + s.toUpperCase());
} else if (obj instanceof Integer i) {
    System.out.println("Integer: " + (i * 2));
} else if (obj instanceof Double d) {
    System.out.println("Double: " + (d + 1.0));
} else {
    System.out.println("Tipo desconhecido");
}
```

**Comparação com código tradicional**:
```java
// ❌ Tradicional (verboso)
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println("String: " + s.toUpperCase());
} else if (obj instanceof Integer) {
    Integer i = (Integer) obj;
    System.out.println("Integer: " + (i * 2));
} else if (obj instanceof Double) {
    Double d = (Double) obj;
    System.out.println("Double: " + (d + 1.0));
}

// ✅ Pattern matching (conciso)
if (obj instanceof String s) {
    System.out.println("String: " + s.toUpperCase());
} else if (obj instanceof Integer i) {
    System.out.println("Integer: " + (i * 2));
} else if (obj instanceof Double d) {
    System.out.println("Double: " + (d + 1.0));
}
```

### 5. Pattern Matching em Expressões Complexas

**Combinação com operadores lógicos**:

**AND (&&)**:
```java
// ✅ Funciona: 's' disponível após && (curto-circuito)
if (obj instanceof String s && s.length() > 0 && s.startsWith("J")) {
    System.out.println("String válida: " + s);
}

// ✅ Múltiplas verificações
if (obj instanceof String s && 
    !s.isEmpty() && 
    s.matches("[a-zA-Z]+")) {
    System.out.println("String alfabética: " + s);
}
```

**Ordem importa**:
```java
// ✅ Correto: instanceof primeiro
if (obj instanceof String s && s.length() > 0) {
    // OK
}

// ❌ ERRO: 's' não existe antes de instanceof
// if (s.length() > 0 && obj instanceof String s) {
//     // ERRO de compilação!
// }
```

**Negação**:
```java
// ✅ Early return com negação
if (!(obj instanceof String s)) {
    return;
}
// 's' disponível aqui

// ✅ Else implícito
if (!(obj instanceof String s)) {
    System.out.println("Não é String");
} else {
    System.out.println("String: " + s);
}
```

### 6. Pattern Matching com final

A variável pattern pode ser **implicitamente final**:

```java
if (obj instanceof String s) {
    // 's' é efetivamente final (não pode ser reatribuída)
    // s = "outro";  // ❌ ERRO: não pode reatribuir
    
    // ✅ Pode ser usada em contextos que exigem final
    Runnable r = () -> System.out.println(s);
    r.run();
}
```

**Benefício**: Variável pattern é automaticamente final para uso em lambdas/classes internas.

### 7. Limitações do Pattern Matching

**❌ Não funciona com OR (||)**:
```java
// ❌ ERRO: 's' não está garantido
// if (obj instanceof String s || obj == null) {
//     System.out.println(s);  // 's' pode não existir!
// }

// ✅ Correto: use condições separadas
if (obj instanceof String s) {
    System.out.println(s);
} else if (obj == null) {
    System.out.println("null");
}
```

**❌ Não funciona fora do if**:
```java
if (obj instanceof String s) {
    System.out.println(s);
}
// ❌ 's' não disponível aqui
// System.out.println(s);  // ERRO!
```

**❌ Não funciona em loops diretos** (mas pode ser usado dentro):
```java
// ❌ Não é um loop pattern
// for (obj instanceof String s) { }  // Sintaxe inválida

// ✅ Pode usar dentro de loop
for (Object obj : lista) {
    if (obj instanceof String s) {
        System.out.println(s);
    }
}
```

**❌ Tipos genéricos ainda têm limitações**:
```java
List<String> lista = new ArrayList<>();

// ❌ ERRO: não pode verificar tipo genérico
// if (lista instanceof List<String> l) { }

// ✅ Apenas tipo bruto
if (lista instanceof List l) {
    // 'l' é List<?> (sem informação de tipo genérico)
}
```

### 8. Pattern Matching vs Tradicional: Performance

**Performance**: Não há diferença significativa de performance - ambos geram bytecode similar.

**Bytecode gerado** (simplificado):

```java
// Pattern matching
if (obj instanceof String s) {
    System.out.println(s.length());
}

// Bytecode (aproximado):
// instanceof String
// ifne skip
// checkcast String
// invokevirtual String.length()

// Tradicional
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.length());
}

// Bytecode (aproximado - IDÊNTICO):
// instanceof String
// ifne skip
// checkcast String
// invokevirtual String.length()
```

**Conclusão**: Pattern matching é **açúcar sintático** - melhora legibilidade sem impacto de performance.

### 9. Pattern Matching em Switch (Java 17+)

**Evolução**: Pattern matching expandido para `switch` no Java 17+.

**Sintaxe tradicional switch**:
```java
switch (obj) {
    case String s -> System.out.println("String: " + s);
    case Integer i -> System.out.println("Int: " + i);
    case null -> System.out.println("null");
    default -> System.out.println("Outro");
}
```

**Pattern matching em switch**:
```java
// Java 17+ (preview)
String resultado = switch (obj) {
    case String s -> "String de tamanho " + s.length();
    case Integer i -> "Inteiro: " + i;
    case Double d -> "Double: " + d;
    case null -> "null";
    default -> "Tipo desconhecido";
};
```

**Guarded patterns (Java 19+)**:
```java
// Java 19+ (preview)
switch (obj) {
    case String s && s.length() > 5 -> System.out.println("String longa");
    case String s -> System.out.println("String curta");
    case Integer i && i > 0 -> System.out.println("Int positivo");
    case Integer i -> System.out.println("Int não-positivo");
    default -> System.out.println("Outro");
}
```

### 10. Pattern Matching e Record Patterns (Java 19+)

**Record deconstruction** (preview Java 19+):

```java
record Point(int x, int y) {}

Object obj = new Point(10, 20);

// Pattern matching com deconstruction
if (obj instanceof Point(int x, int y)) {
    System.out.println("x = " + x + ", y = " + y);
}

// Nested patterns
record Rectangle(Point topLeft, Point bottomRight) {}

Object rect = new Rectangle(new Point(0, 0), new Point(10, 10));

if (rect instanceof Rectangle(Point(int x1, int y1), Point(int x2, int y2))) {
    System.out.println("Retângulo de (" + x1 + "," + y1 + ") a (" + x2 + "," + y2 + ")");
}
```

---

## 🔍 Análise Conceitual Profunda

### Por Que Pattern Matching?

**1. Redução de Boilerplate**

```java
// Antes: 3 linhas
if (obj instanceof String) {
    String s = (String) obj;
    process(s);
}

// Depois: 1 linha
if (obj instanceof String s) process(s);
```

**2. Menos Propenso a Erros**

```java
// ❌ Possível erro: cast para tipo errado
if (obj instanceof String) {
    Integer i = (Integer) obj;  // ❌ Erro! Deveria ser String
}

// ✅ Pattern matching: tipo garantido
if (obj instanceof String s) {
    // 's' é sempre String - impossível errar
}
```

**3. Melhor Flow Analysis**

Compilador rastreia fluxo de controle automaticamente:
```java
if (obj instanceof String s && s.length() > 0) {
    // Compilador sabe que 's' existe e não é null
}
```

### Evolução da Feature

**Histórico**:
- **Java 14 (JEP 305)**: Preview inicial
- **Java 15 (JEP 375)**: Segunda preview
- **Java 16 (JEP 394)**: Finalizado e oficial
- **Java 17+**: Expandido para switch
- **Java 19+**: Record patterns (preview)

**Roadmap futuro**:
- Pattern matching mais expressivo
- Deconstruction patterns
- Array patterns
- Sealed classes integration

---

## 🎯 Aplicabilidade e Contextos

### 1. **Substituição Direta de instanceof Tradicional**

```java
// Antes
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.toUpperCase());
}

// Depois
if (obj instanceof String s) {
    System.out.println(s.toUpperCase());
}
```

### 2. **Processamento Polimórfico**

```java
public void processar(Animal animal) {
    if (animal instanceof Cachorro c) {
        c.latir();
    } else if (animal instanceof Gato g) {
        g.miar();
    } else if (animal instanceof Passaro p) {
        p.cantar();
    }
}
```

### 3. **Validação e Early Return**

```java
public int calcular(Object input) {
    if (!(input instanceof Number n)) {
        throw new IllegalArgumentException("Esperado Number");
    }
    
    // 'n' disponível aqui
    return n.intValue() * 2;
}
```

### 4. **Equals() Simplificado**

```java
@Override
public boolean equals(Object obj) {
    // Pattern matching simplifica equals
    if (!(obj instanceof Pessoa p)) {
        return false;
    }
    
    return Objects.equals(this.nome, p.nome) && 
           this.idade == p.idade;
}

// Comparado com tradicional:
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof Pessoa)) {
        return false;
    }
    
    Pessoa p = (Pessoa) obj;  // Cast manual
    return Objects.equals(this.nome, p.nome) && 
           this.idade == p.idade;
}
```

### 5. **Stream Processing**

```java
List<Object> mixed = List.of("a", 1, "b", 2, "c");

// Com pattern matching em lambda
mixed.forEach(obj -> {
    if (obj instanceof String s) {
        System.out.println("String: " + s.toUpperCase());
    } else if (obj instanceof Integer i) {
        System.out.println("Integer: " + (i * 2));
    }
});
```

### 6. **Visitor Pattern Simplificado**

```java
interface Visitor {
    void visit(Object obj);
}

class PrintVisitor implements Visitor {
    @Override
    public void visit(Object obj) {
        if (obj instanceof String s) {
            System.out.println("String: " + s);
        } else if (obj instanceof Integer i) {
            System.out.println("Integer: " + i);
        }
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. **Apenas Java 16+**

```java
// ❌ Java 15 ou anterior: não suportado
// if (obj instanceof String s) { }

// ✅ Java 16+: suportado
if (obj instanceof String s) {
    System.out.println(s);
}
```

### 2. **Escopo Limitado ao if**

```java
if (obj instanceof String s) {
    System.out.println(s);  // ✅ OK
}
// System.out.println(s);  // ❌ ERRO: 's' não existe
```

### 3. **Não Funciona com ||**

```java
// ❌ ERRO
// if (obj instanceof String s || obj == null) {
//     System.out.println(s);
// }
```

### 4. **Generics Ainda Limitados**

```java
// ❌ Type erasure ainda se aplica
// if (list instanceof List<String> l) { }

// ✅ Apenas tipo bruto
if (list instanceof List l) { }
```

### 5. **Pode Ocultar Problemas de Design**

```java
// ❌ Uso excessivo pode indicar design ruim
if (obj instanceof TypeA a) { }
else if (obj instanceof TypeB b) { }
else if (obj instanceof TypeC c) { }
// ... 20 mais tipos

// ✅ Considere polimorfismo
obj.process();
```

---

## 🚀 Boas Práticas

### 1. ✅ Use Pattern Matching por Padrão

```java
// ✅ Sempre que possível
if (obj instanceof String s) {
    process(s);
}

// ❌ Evite tradicional
if (obj instanceof String) {
    String s = (String) obj;
    process(s);
}
```

### 2. ✅ Combine com Guard Clauses

```java
public void processar(Object obj) {
    if (!(obj instanceof String s)) {
        return;
    }
    
    // 's' disponível para resto do método
    System.out.println(s.toUpperCase());
}
```

### 3. ✅ Use em equals()

```java
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof MinhaClasse m)) {
        return false;
    }
    return Objects.equals(campo, m.campo);
}
```

### 4. ✅ Nomes Significativos

```java
// ✅ Nome descritivo
if (animal instanceof Cachorro cachorro) {
    cachorro.latir();
}

// ❌ Nome genérico
if (animal instanceof Cachorro c) {
    c.latir();
}
```

### 5. ✅ Aproveite Flow Typing

```java
if (obj instanceof String s && s.length() > 0) {
    // Condições compostas
}
```

### 6. ✅ Combine com Switch (Java 17+)

```java
// Java 17+
switch (obj) {
    case String s -> process(s);
    case Integer i -> process(i);
    default -> handleOther(obj);
}
```

### 7. ✅ Documente Uso Complexo

```java
// Processa apenas Strings não-vazias que começam com maiúscula
if (obj instanceof String s && 
    !s.isEmpty() && 
    Character.isUpperCase(s.charAt(0))) {
    // Processamento
}
```

### 8. ✅ Teste Pattern Matching

```java
@Test
void testPatternMatching() {
    Object obj = "test";
    
    if (obj instanceof String s) {
        assertEquals(4, s.length());
    } else {
        fail("Deveria ser String");
    }
}
```

### 9. ✅ Considere Record Patterns (Java 19+)

```java
if (obj instanceof Point(int x, int y)) {
    System.out.println("x=" + x + ", y=" + y);
}
```

### 10. ✅ Mantenha Compatibilidade

Se precisar Java < 16, continue com instanceof tradicional.

---

## 📚 Resumo

**Pattern Matching** com `instanceof` (Java 16+) é uma evolução significativa que elimina a necessidade de **cast manual** após verificação de tipo. Ele permite declarar variáveis inline que são **automaticamente tipadas** e disponíveis no escopo adequado, reduzindo **boilerplate** e **erros**. Use-o por padrão em código Java 16+ para melhor **legibilidade** e **segurança**. A feature continua evoluindo com **switch expressions** (Java 17+) e **record patterns** (Java 19+), tornando Java mais **expressivo** e **conciso**.

