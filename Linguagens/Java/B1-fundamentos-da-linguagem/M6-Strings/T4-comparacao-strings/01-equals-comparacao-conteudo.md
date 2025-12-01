# equals(): Comparação de Conteúdo

## 🎯 Introdução e Definição

### Definição Conceitual Clara

O **método `equals()`** é a operação fundamental de comparação de conteúdo em Java que testa se duas Strings contêm exatamente a mesma sequência de caracteres (mesmos caracteres, mesma ordem, mesmo case), independentemente de serem o mesmo objeto na memória. Conceitualmente, `equals()` responde à pergunta "estas Strings dizem a mesma coisa?" ao invés de "são a mesma String física?", realizando comparação caractere por caractere até encontrar diferença ou confirmar igualdade completa.

É o reconhecimento de que, para Strings, importa o significado (conteúdo textual) e não a identidade do objeto - duas Strings com texto "Java" são equivalentes para lógica de negócio, mesmo que sejam objetos distintos na memória.

### Contexto Histórico e Motivação

`equals()` vem de `Object`, classe raiz de Java, como contrato para comparação de conteúdo customizável. String sobrescreve `equals()` para comparar sequências de caracteres ao invés de referências, reconhecendo que Strings são value objects - seu valor (texto) define identidade lógica.

**Motivação:** Operador `==` compara referências (inadequado para objetos). `equals()` permite cada classe definir "igualdade" semanticamente apropriada - para Strings, significa "mesmo texto".

### Problema Fundamental que Resolve

**Problema:** `==` falha para objetos logicamente iguais:

```java
String senha1 = new String("secreto");
String senha2 = new String("secreto");

if (senha1 == senha2) {  // false - objetos diferentes!
    System.out.println("Acesso permitido");  // Nunca executa - BUG!
}
```

**Solução:** `equals()` compara conteúdo:

```java
if (senha1.equals(senha2)) {  // true - mesmo texto!
    System.out.println("Acesso permitido");  // Executa corretamente
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Comparação Caractere por Caractere:** Percorre ambas Strings comparando cada posição.

2. **Case-Sensitive:** Diferencia maiúsculas/minúsculas - "Java" ≠ "java".

3. **Sobrescreve Object.equals():** Implementação específica de String, não comparação de referência.

4. **Null-Safe Parcialmente:** Não lança NPE se chamado em String válida, mas pode se receptor for null.

5. **Performance O(n):** Proporcional ao comprimento da String (pior caso).

### Pilares Fundamentais

- **Sintaxe:** `string1.equals(string2)` - retorna boolean
- **Retorno:** `true` se conteúdo idêntico, `false` caso contrário
- **Tipo de Parâmetro:** `Object` (aceita qualquer tipo, mas retorna false se não for String)
- **Guideline:** Forma padrão de comparar Strings em Java

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Implementação Simplificada

```java
public boolean equals(Object anObject) {
    // Otimização 1: Se são mesmo objeto, são iguais
    if (this == anObject) {
        return true;
    }

    // Verificar tipo
    if (anObject instanceof String) {
        String anotherString = (String) anObject;
        int n = value.length;  // value é char[] interno

        // Otimização 2: Tamanhos diferentes = diferentes
        if (n == anotherString.value.length) {
            char[] v1 = value;
            char[] v2 = anotherString.value;
            int i = 0;

            // Comparar caractere por caractere
            while (i < n) {
                if (v1[i] != v2[i])
                    return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```

**Otimizações:**
1. **Identidade primeiro:** Se `this == anObject`, retorna true imediatamente (O(1))
2. **Tamanho:** Se comprimentos diferentes, retorna false sem comparar chars
3. **Early exit:** Para na primeira diferença encontrada

#### Timeline de Execução

```java
String a = "Java";
String b = "Java";
boolean result = a.equals(b);
```

**Passos:**
1. `this == anObject`: a == b? → false (objetos diferentes no exemplo)
2. `anObject instanceof String`: b é String? → true
3. `n == anotherString.value.length`: 4 == 4? → true
4. Loop comparação:
   - i=0: 'J' == 'J'? → true, continua
   - i=1: 'a' == 'a'? → true, continua
   - i=2: 'v' == 'v'? → true, continua
   - i=3: 'a' == 'a'? → true, fim do loop
5. Retorna `true`

### Princípios e Conceitos Subjacentes

#### Princípio da Equivalência Textual

`equals()` testa equivalência semântica, não identidade física:

```java
String manual = new String(new char[]{'J', 'a', 'v', 'a'});
String literal = "Java";

// Fisicamente diferentes
System.out.println(manual == literal);  // false

// Semanticamente iguais
System.out.println(manual.equals(literal));  // true
```

**Análise:** Para Strings, "significado" é o texto contido, não localização na memória.

#### Princípio da Simetria

`equals()` é simétrico - ordem não importa:

```java
String a = "Java";
String b = "Java";

a.equals(b) == b.equals(a)  // Sempre true
```

**Contrato de equals():**
- **Reflexivo:** `x.equals(x)` sempre true
- **Simétrico:** `x.equals(y)` ↔ `y.equals(x)`
- **Transitivo:** Se `x.equals(y)` e `y.equals(z)`, então `x.equals(z)`
- **Consistente:** Múltiplas chamadas retornam mesmo valor (se objetos não mudam)
- **Null:** `x.equals(null)` sempre false

---

## 🔍 Análise Conceitual Profunda

### Casos de Comparação Detalhados

#### Caso 1: Strings Idênticas

```java
String a = "Java";
String b = "Java";

System.out.println(a.equals(b));  // true
```

**Análise:** Conteúdo idêntico - retorna true.

#### Caso 2: Case Sensitivity

```java
String a = "Java";
String b = "java";

System.out.println(a.equals(b));  // false - diferente!
```

**Análise:** 'J' ≠ 'j' - `equals()` é case-sensitive.

#### Caso 3: Tamanhos Diferentes

```java
String a = "Java";
String b = "JavaScript";

System.out.println(a.equals(b));  // false
```

**Análise:** Otimização - tamanhos diferentes (4 vs 10) retorna false sem comparar chars.

#### Caso 4: Caracteres Especiais

```java
String a = "Café";
String b = "Café";

System.out.println(a.equals(b));  // true
```

**Análise:** Unicode/acentos são comparados corretamente - 'é' é caractere único.

#### Caso 5: Espaços e Whitespace

```java
String a = "Java";
String b = "Java ";  // Espaço no final

System.out.println(a.equals(b));  // false
```

**Análise:** Espaços são caracteres - contam para comparação.

#### Caso 6: Strings Vazias

```java
String a = "";
String b = "";

System.out.println(a.equals(b));  // true
```

**Análise:** Strings vazias são iguais entre si.

#### Caso 7: Comparação com Null

```java
String a = "Java";
String b = null;

System.out.println(a.equals(b));  // false - não NPE!
System.out.println(b.equals(a));  // NullPointerException!
```

**Análise:** `equals()` verifica null e retorna false, mas se receptor for null, lança NPE.

#### Caso 8: Comparação com Não-String

```java
String a = "123";
Integer b = 123;

System.out.println(a.equals(b));  // false - tipos diferentes
```

**Análise:** `equals()` aceita Object, mas retorna false se não for String.

### Comparação com Outros Métodos

#### equals() vs ==

```java
String a = new String("Java");
String b = new String("Java");

System.out.println(a == b);        // false - objetos diferentes
System.out.println(a.equals(b));   // true - conteúdo igual
```

**Diferença:**
- `==`: Identidade de referência (endereço de memória)
- `equals()`: Equivalência de conteúdo (caracteres)

#### equals() vs equalsIgnoreCase()

```java
String a = "Java";
String b = "java";

System.out.println(a.equals(b));            // false
System.out.println(a.equalsIgnoreCase(b));  // true
```

**Diferença:**
- `equals()`: Case-sensitive
- `equalsIgnoreCase()`: Case-insensitive

#### equals() vs compareTo()

```java
String a = "Apple";
String b = "Banana";

System.out.println(a.equals(b));    // false
System.out.println(a.compareTo(b)); // -1 (Apple < Banana)
```

**Diferença:**
- `equals()`: Igualdade booleana (true/false)
- `compareTo()`: Ordem relativa (negativo/zero/positivo)

### Padrões de Uso

#### Padrão 1: Validação de Input

```java
String senha = lerSenha();
String senhaEsperada = "secreto123";

if (senhaEsperada.equals(senha)) {  // Nota: literal primeiro evita NPE
    System.out.println("Acesso permitido");
} else {
    System.out.println("Senha incorreta");
}
```

**Análise:** Comparar input com valor esperado - caso de uso mais comum.

#### Padrão 2: Busca em Coleções

```java
List<String> nomes = Arrays.asList("Alice", "Bob", "Carol");
String busca = "Bob";

if (nomes.contains(busca)) {  // Usa equals() internamente
    System.out.println("Encontrado!");
}
```

**Análise:** Collections usam `equals()` para busca e comparação.

#### Padrão 3: Switch com Strings (Java 7+)

```java
String comando = obterComando();

switch (comando) {  // Usa equals() internamente
    case "SALVAR":
        salvar();
        break;
    case "CARREGAR":
        carregar();
        break;
}
```

**Análise:** Switch de Strings compara com `equals()`, não `==`.

#### Padrão 4: Remoção de Duplicatas

```java
Set<String> unicos = new HashSet<>();
unicos.add("Java");
unicos.add("Java");  // Duplicata - não adicionado (usa equals())

System.out.println(unicos.size());  // 1
```

**Análise:** Sets usam `equals()` (e `hashCode()`) para detectar duplicatas.

### Armadilhas Comuns

#### Armadilha 1: Receptor Null

```java
String a = null;
String b = "Java";

// a.equals(b);  // NullPointerException!

// CORRETO - verificar null primeiro
if (a != null && a.equals(b)) {
    // Processa
}

// OU - Yoda condition
if ("Java".equals(a)) {  // Null-safe
    // Processa
}
```

#### Armadilha 2: Confundir com ==

```java
String resultado = obterResultado();  // Retorna "OK"

if (resultado == "OK") {  // PROVÁVEL BUG!
    // Pode não executar
}

if (resultado.equals("OK")) {  // CORRETO
    // Executa corretamente
}
```

#### Armadilha 3: Esquecer Case Sensitivity

```java
String resposta = scanner.nextLine();  // Usuário digita "SIM"

if (resposta.equals("sim")) {  // false - case diferente!
    // Não executa
}

if (resposta.equalsIgnoreCase("sim")) {  // CORRETO
    // Executa
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar equals()

✅ **Use `equals()` sempre para:**

1. **Comparar Conteúdo:** Verificar se Strings têm mesmo texto
2. **Validação:** Checar senhas, códigos, comandos
3. **Lógica de Negócio:** Decisões baseadas em valores String
4. **Collections:** Busca, remoção, comparação em listas/sets/maps
5. **Switches:** Switch de Strings usa equals() internamente

### Quando Usar Alternativas

❌ **Use alternativas quando:**

1. **Case-Insensitive:** Use `equalsIgnoreCase()`
2. **Ordem/Ordenação:** Use `compareTo()`
3. **Substring:** Use `contains()`, `startsWith()`, `endsWith()`
4. **Regex:** Use `matches()`

---

## ⚠️ Limitações e Considerações

### Limitações

#### Não Compara Semanticamente

```java
String a = "color";
String b = "colour";  // Mesma palavra, grafia diferente

System.out.println(a.equals(b));  // false - chars diferentes
```

**Análise:** `equals()` é comparação exata - não entende sinônimos ou variações.

#### Não Normaliza Unicode

```java
String a = "café";        // 'é' como char único (U+00E9)
String b = "café";        // 'e' + acento combining (U+0065 + U+0301)

System.out.println(a.equals(b));  // false - representações diferentes!
```

**Solução:** Normalizar antes de comparar:
```java
String aNorm = Normalizer.normalize(a, Normalizer.Form.NFC);
String bNorm = Normalizer.normalize(b, Normalizer.Form.NFC);
System.out.println(aNorm.equals(bNorm));  // true
```

### Considerações de Performance

**Complexidade:**
- **Melhor caso:** O(1) - identidade (==) ou tamanhos diferentes
- **Pior caso:** O(n) - comparar todos caracteres

**Benchmark (aproximado):**
```java
String a = "Java";
String b = "Java";

// Identidade - muito rápido
a.equals(a);  // ~1ns

// Conteúdo - rápido mas proporcional
a.equals(b);  // ~10ns para strings curtas, ~100ns para longas
```

**Análise:** Performance raramente é problema - correção é prioridade.

---

## 🔗 Interconexões Conceituais

### Relação com hashCode()

`equals()` e `hashCode()` devem ser consistentes:

```java
String a = "Java";
String b = new String("Java");

if (a.equals(b)) {  // true
    // Deve ser: a.hashCode() == b.hashCode()
    System.out.println(a.hashCode() == b.hashCode());  // true
}
```

**Regra:** Se `a.equals(b)`, então `a.hashCode() == b.hashCode()`.

### Relação com Comparable

```java
String a = "Apple";
String b = "Apple";

// equals - igualdade
boolean igual = a.equals(b);  // true

// compareTo - ordem
int ordem = a.compareTo(b);   // 0 (iguais)

// Consistência: compareTo == 0 ↔ equals true
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **equalsIgnoreCase():** Comparação case-insensitive
- **compareTo():** Comparação lexicográfica com ordenação
- **Objects.equals():** Comparação null-safe
- **contentEquals():** Comparar com CharSequence

---

## 📚 Conclusão

`equals()` é o método fundamental para comparar conteúdo de Strings em Java, realizando comparação caractere por caractere case-sensitive. É a forma correta e idiomática de testar se duas Strings contêm mesmo texto, independentemente de serem mesmo objeto na memória.

Dominar `equals()` significa:
- Usar SEMPRE para comparar Strings (nunca `==` exceto null checks)
- Compreender que é case-sensitive ('Java' ≠ 'java')
- Aplicar técnicas null-safe (Yoda conditions ou verificação prévia)
- Reconhecer que compara caracteres exatos, não significado semântico
- Saber que tem performance O(n), mas raramente é gargalo
- Entender contrato de equals (reflexivo, simétrico, transitivo)

`equals()` é método mais usado para comparação em Java - dominar seu comportamento e diferenças com `==` é essencial para evitar bugs comuns. Regra de ouro: **Strings sempre com `equals()`, primitivos com `==`**.
