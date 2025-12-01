# Comparação: == vs equals()

## 🎯 Introdução e Definição

### Definição Conceitual Clara

A **comparação com `==`** testa se duas variáveis referenciam exatamente o mesmo objeto na memória (identidade de referência), enquanto **`equals()`** testa se dois objetos têm conteúdo equivalente conforme definição da classe (igualdade de valor). Conceitualmente, `==` pergunta "são a mesma coisa?", enquanto `equals()` pergunta "têm o mesmo significado?". Para Strings especificamente, `==` verifica se apontam para mesmo objeto String, e `equals()` verifica se contêm mesma sequência de caracteres - distinção crítica pois Strings com conteúdo idêntico podem ser objetos separados.

É o reconhecimento de que identidade (ser o mesmo) e igualdade (ter mesmo valor) são conceitos distintos em programação orientada a objetos - e Java fornece operadores diferentes para cada um.

### Contexto Histórico e Motivação

Em C, `==` compara valores primitivos diretamente - inteiros, ponteiros, etc. Java herdou `==` para primitivos, mas adicionou semântica de referência para objetos. `equals()` foi adicionado como método de Object para permitir comparação de conteúdo customizável por classe.

**Motivação:** Objetos precisam de duas formas de comparação - referência rápida (`==`) e conteúdo customizável (`equals()`).

### Problema Fundamental que Resolve

**Problema:** `==` sozinho é insuficiente para objetos:

```java
String a = new String("Java");
String b = new String("Java");

if (a == b) {  // false - objetos diferentes!
    System.out.println("Iguais");  // Nunca executa
}
// Mas conteúdo É igual - "Java" == "Java"
```

**Solução:** `equals()` compara conteúdo:

```java
if (a.equals(b)) {  // true - conteúdo igual!
    System.out.println("Iguais");  // Executa corretamente
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **`==` compara Referências:** Para objetos, testa se são mesmo objeto na memória.

2. **`equals()` compara Valores:** Testa equivalência de conteúdo (para Strings, sequência de chars).

3. **String Pool Confunde:** Literais podem fazer `==` funcionar acidentalmente.

4. **Regra de Ouro:** **SEMPRE** use `equals()` para comparar Strings.

5. **Null Safety:** `equals()` pode causar NullPointerException; `==` é null-safe.

### Pilares Fundamentais

- **Operador `==`:** Compara referências (endereços de memória)
- **Método `equals()`:** Compara conteúdo (sequência de caracteres)
- **Sobrescrita:** String sobrescreve `equals()` de Object para comparar chars
- **Guideline:** Use `equals()` para Strings, `==` apenas para primitivos e null checks

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Operador == - Comparação de Referências

```java
String a = new String("Java");
String b = new String("Java");
String c = a;

System.out.println(a == b);  // false
System.out.println(a == c);  // true
```

**Memória:**

```
Heap:
  String("Java") @ 0x1000 ←── a, c
  String("Java") @ 0x2000 ←── b

== compara endereços:
  a == b → 0x1000 == 0x2000 → false
  a == c → 0x1000 == 0x1000 → true
```

**Análise:** `==` é comparação numérica de ponteiros - rápido (O(1)), mas não compara conteúdo.

#### Método equals() - Comparação de Conteúdo

```java
String a = new String("Java");
String b = new String("Java");

System.out.println(a.equals(b));  // true
```

**Implementação simplificada de String.equals():**

```java
public boolean equals(Object obj) {
    if (this == obj) return true;  // Otimização: mesma referência
    if (!(obj instanceof String)) return false;

    String other = (String) obj;
    if (this.length() != other.length()) return false;

    // Comparar caractere por caractere
    for (int i = 0; i < this.length(); i++) {
        if (this.charAt(i) != other.charAt(i)) {
            return false;
        }
    }
    return true;
}
```

**Análise:** `equals()` compara cada caractere - mais lento (O(n)), mas compara conteúdo corretamente.

### Princípios e Conceitos Subjacentes

#### Princípio da Identidade vs Igualdade

**Identidade (==):**
- "São o mesmo objeto?"
- "Apontam para mesmo endereço?"
- "Modificar um afeta o outro?" (se fossem mutáveis)

**Igualdade (equals()):**
- "Têm o mesmo valor?"
- "São intercambiáveis logicamente?"
- "Representam mesma informação?"

**Exemplo filosófico:**
```java
// Duas notas de R$10 são:
// - Objetos diferentes (identidade) → ==: false
// - Mesmo valor (igualdade) → equals(): true
```

#### Princípio da Sobrescrita Polimórfica

`equals()` é método de Object, sobrescrito por String:

```java
Object obj1 = new Object();
Object obj2 = new Object();
obj1.equals(obj2);  // Object.equals usa ==

String s1 = "Java";
String s2 = "Java";
s1.equals(s2);  // String.equals compara chars
```

**Análise:** Cada classe define "igualdade" apropriadamente via sobrescrita.

---

## 🔍 Análise Conceitual Profunda

### Cenários de Comparação

#### Cenário 1: Literais Idênticos

```java
String a = "Java";
String b = "Java";

System.out.println(a == b);        // true (String Pool!)
System.out.println(a.equals(b));   // true
```

**Análise:** Literais vão para pool - `==` funciona **acidentalmente**. **NÃO CONFIE NISSO!**

#### Cenário 2: new String()

```java
String a = new String("Java");
String b = new String("Java");

System.out.println(a == b);        // false (objetos diferentes)
System.out.println(a.equals(b));   // true
```

**Análise:** Objetos heap regulares - `==` falha, `equals()` funciona.

#### Cenário 3: Literal vs new

```java
String a = "Java";
String b = new String("Java");

System.out.println(a == b);        // false (pool vs heap)
System.out.println(a.equals(b));   // true
```

#### Cenário 4: Concatenação Runtime

```java
String a = "Java";
String b = "Ja" + "va";  // Compile-time - otimizado para "Java"
String c = "Ja";
String d = c + "va";     // Runtime - novo objeto

System.out.println(a == b);  // true (ambos literais otimizados)
System.out.println(a == d);  // false (d é runtime concat)
System.out.println(a.equals(d));  // true
```

**Análise:** Concatenação runtime cria novo objeto - `==` falha.

#### Cenário 5: Comparação Null

```java
String a = "Java";
String b = null;

System.out.println(a == null);  // false - null-safe
System.out.println(null == b);  // true - null-safe

// System.out.println(b.equals(a));  // NullPointerException!
System.out.println(a.equals(b));     // false - null-safe (String.equals verifica)
```

**Análise:** `==` é null-safe; `equals()` pode lançar NPE se chamado em null.

### Armadilhas do == com Strings

#### Armadilha 1: Funciona com Literais, Falha com Runtime

```java
String esperado = "sucesso";
String resultado = obterResultado();  // Retorna "sucesso" via lógica runtime

if (resultado == esperado) {  // PROVÁVEL BUG!
    // Pode não executar mesmo que resultado seja "sucesso"
}

if (resultado.equals(esperado)) {  // CORRETO
    // Executa corretamente
}
```

#### Armadilha 2: Testes Passam, Produção Falha

```java
// Teste
@Test
public void testar() {
    String resultado = "OK";  // Literal
    String esperado = "OK";   // Literal
    assertTrue(resultado == esperado);  // Passa! (ambos pool)
}

// Produção
String resultado = banco.obter();  // Retorna "OK" via query
String esperado = "OK";
if (resultado == esperado) {  // Falha! (resultado não é pool)
```

**Lição:** Nunca use `==` para Strings, mesmo que "funcione" em testes!

#### Armadilha 3: Comparação Case-Sensitive

```java
String a = "Java";
String b = "java";

System.out.println(a.equals(b));  // false - case-sensitive
System.out.println(a.equalsIgnoreCase(b));  // true
```

**Análise:** `equals()` é case-sensitive - use `equalsIgnoreCase()` quando apropriado.

### Null Safety - Técnicas

#### Técnica 1: Verificar Null Antes

```java
String a = obterString();  // Pode ser null
String b = "esperado";

if (a != null && a.equals(b)) {  // Null-safe
    // Processa
}
```

#### Técnica 2: Inverter Ordem (Yoda Conditions)

```java
String a = obterString();  // Pode ser null

if ("esperado".equals(a)) {  // Null-safe - literal nunca é null
    // Processa
}
// Se a for null, equals retorna false (não lança NPE)
```

**Análise:** "esperado" é literal - garantido não-null. Chamar `equals()` nele é seguro.

#### Técnica 3: Objects.equals() (Java 7+)

```java
String a = obterString();  // Pode ser null
String b = obterOutro();   // Pode ser null

if (Objects.equals(a, b)) {  // Null-safe para ambos
    // Processa
}
```

**Implementação de Objects.equals():**
```java
public static boolean equals(Object a, Object b) {
    return (a == b) || (a != null && a.equals(b));
}
```

**Análise:** Null-safe para ambos argumentos - maneira mais segura.

### Performance

**Benchmark (aproximado):**

```java
String a = "Java";
String b = "Java";

// == - extremamente rápido
for (int i = 0; i < 1_000_000; i++) {
    boolean result = (a == b);  // ~1ns por comparação
}

// equals() - mais lento mas ainda rápido
for (int i = 0; i < 1_000_000; i++) {
    boolean result = a.equals(b);  // ~10ns por comparação
}
```

**Análise:** `==` é ~10x mais rápido, mas diferença raramente importa. **Correção > Performance**.

**Exceção:** Strings internadas podem usar `==` para comparação rápida:

```java
String a = obterString().intern();
String b = obterOutro().intern();

if (a == b) {  // OK - ambas internadas, comparação rápida
    // Processa
}
```

**Cuidado:** Só se TODAS Strings forem internadas!

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar ==

✅ **Use `==` com Strings apenas para:**

1. **Null Checks:** `if (str == null)`
2. **Mesma Referência:** `if (str1 == str2)` quando testa identidade intencional
3. **Strings Internadas:** `if (str1.intern() == str2.intern())` (raro)

### Quando Usar equals()

✅ **Use `equals()` sempre para:**

1. **Comparar Conteúdo:** Quase sempre!
2. **Lógica de Negócio:** Validações, condicionais
3. **Testes:** Assertions de valor

**Regra Simples:** Use `equals()` por padrão!

### Quando Usar equalsIgnoreCase()

✅ **Use `equalsIgnoreCase()` quando:**

1. **Case-Insensitive:** Comparar sem diferenciar maiúsculas/minúsculas
2. **Input de Usuário:** "Sim", "sim", "SIM" devem ser tratados iguais

```java
String resposta = scanner.nextLine();
if ("sim".equalsIgnoreCase(resposta)) {  // Aceita SIM, sim, Sim, etc
    // Processa
}
```

---

## ⚠️ Limitações e Considerações

### Limitações de ==

```java
// Funciona para primitivos
int a = 5;
int b = 5;
System.out.println(a == b);  // true - compara valores

// NÃO funciona para objetos (compara referências)
Integer c = new Integer(5);
Integer d = new Integer(5);
System.out.println(c == d);  // false - objetos diferentes!
System.out.println(c.equals(d));  // true - valores iguais
```

### Considerações de Equals

#### equals() Requer Não-Null

```java
String a = null;
// a.equals("Java");  // NullPointerException!
```

**Soluções:**
```java
// 1. Verificar null
if (a != null && a.equals("Java")) { }

// 2. Yoda condition
if ("Java".equals(a)) { }

// 3. Objects.equals
if (Objects.equals(a, "Java")) { }
```

#### equals() é Método - Pode Ser Sobrescrito

```java
class MinhaString extends String {
    @Override
    public boolean equals(Object obj) {
        return true;  // Sempre retorna true (bugado!)
    }
}
```

**Análise:** String é final (não pode ser estendida), mas outras classes podem sobrescrever equals incorretamente.

---

## 🔗 Interconexões Conceituais

### Relação com hashCode()

`equals()` e `hashCode()` devem ser consistentes:

```java
String a = "Java";
String b = "Java";

if (a.equals(b)) {
    // DEVE SER: a.hashCode() == b.hashCode()
    System.out.println(a.hashCode() == b.hashCode());  // true
}
```

**Regra:** Se `a.equals(b)`, então `a.hashCode() == b.hashCode()` DEVE ser verdade.

### Relação com Comparable

```java
String a = "Apple";
String b = "Banana";

// Comparação lexicográfica
int result = a.compareTo(b);  // < 0 (Apple antes de Banana)

// vs equals (igualdade)
boolean igual = a.equals(b);  // false
```

**Análise:** `compareTo()` ordena; `equals()` testa igualdade. Diferentes propósitos.

---

## 🚀 Evolução e Próximos Conceitos

### Java Moderno

**Pattern Matching (Java 16+):**
```java
if (obj instanceof String s && s.equals("Java")) {
    // s é String garantido
}
```

### Conceitos Relacionados

- **Objects.equals():** Comparação null-safe
- **String.compareTo():** Comparação lexicográfica
- **String.equalsIgnoreCase():** Comparação case-insensitive
- **String.contentEquals():** Comparar com CharSequence

---

## 📚 Conclusão

A distinção entre `==` (identidade de referência) e `equals()` (igualdade de valor) é fundamental em Java. Para Strings, **SEMPRE use `equals()`** para comparar conteúdo - `==` compara se são mesmo objeto na memória, não se têm mesmo texto.

Dominar == vs equals() significa:
- **NUNCA** usar `==` para comparar Strings (exceto null checks)
- **SEMPRE** usar `equals()` para comparar conteúdo
- Compreender que literais no pool fazem `==` funcionar acidentalmente - não confiar nisso
- Usar `equalsIgnoreCase()` para comparações case-insensitive
- Aplicar técnicas null-safe (yoda conditions, Objects.equals())
- Reconhecer que `==` é identidade, `equals()` é valor

Usar `==` para comparar Strings é um dos bugs mais comuns de iniciantes em Java. Memorize: **Strings sempre com `equals()`, primitivos com `==`**. Esta distinção se aplica a todos objetos em Java, não apenas Strings - mas Strings são onde o erro aparece mais frequentemente.
