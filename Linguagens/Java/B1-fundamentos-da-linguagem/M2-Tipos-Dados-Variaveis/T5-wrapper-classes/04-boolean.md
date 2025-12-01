# Wrapper Class: Boolean

## 🎯 Introdução e Definição

### Definição Conceitual

**Boolean** é a wrapper class que encapsula o tipo primitivo `boolean`, permitindo representar valores lógicos (verdadeiro/falso) como objetos. É a classe wrapper mais simples, tendo apenas **dois valores possíveis**: `true` e `false`.

**Mapeamento**:
```java
boolean → Boolean
```

**Características Especiais**:
- **Apenas 2 valores**: `Boolean.TRUE` e `Boolean.FALSE`
- **Sem cache configurável**: Apenas 2 instâncias canônicas
- **Parsing flexível**: `parseBoolean()` aceita qualquer string (não lança exception)
- **Não numérico**: Não herda de Number
- **Uso**: Flags, condições, coleções de booleanos

**Exemplo**:
```java
// Primitivo
boolean flag = true;

// Wrapper
Boolean objTrue = Boolean.valueOf(true);
Boolean objFalse = Boolean.FALSE;  // Constante

// Collections
List<Boolean> flags = new ArrayList<>();
flags.add(true);   // Autoboxing
flags.add(false);

// Tri-state: true, false, null
Boolean opcional = null;  // "Não definido"
```

### Características Fundamentais

**Boolean**:
- ✅ **Binário**: Apenas `true` ou `false`
- 🔒 **Imutável**: Valor não pode ser alterado
- 🎯 **Final**: Classe não pode ser estendida
- 💾 **Cache completo**: Apenas 2 objetos (`TRUE` e `FALSE`)
- 📋 **Constantes**: `TRUE`, `FALSE`, `TYPE`
- 🔄 **Parsing tolerante**: Não lança `NumberFormatException`
- 🎭 **Tri-state**: Wrapper pode ser `null`

---

## 📋 Sumário Conceitual

### Constantes

```java
Boolean.TRUE      // Representa o valor true (singleton)
Boolean.FALSE     // Representa o valor false (singleton)
Boolean.TYPE      // Representa o tipo primitivo boolean (Class<Boolean>)
```

### Formas de Criação

1. **valueOf()** (recomendado): Retorna `TRUE` ou `FALSE`
2. **Constantes**: `Boolean.TRUE`, `Boolean.FALSE`
3. **Autoboxing**: Conversão automática
4. **Construtor** (deprecated Java 9+): Sempre cria novo objeto

---

## 🧠 Fundamentos Teóricos

### 1. Constantes e Características

**Constantes canônicas**:
```java
Boolean verdadeiro = Boolean.TRUE;   // Singleton
Boolean falso = Boolean.FALSE;       // Singleton

// TYPE representa o primitivo boolean
Class<Boolean> tipo = Boolean.TYPE;
System.out.println(tipo.getName());  // boolean
```

**Diferença entre Boolean.TRUE e true**:
```java
boolean primitivo = true;    // Primitivo (não é objeto)
Boolean wrapper = Boolean.TRUE;  // Objeto wrapper (singleton)

System.out.println(primitivo == true);    // true (comparação primitiva)
System.out.println(wrapper == Boolean.TRUE);  // true (mesmo objeto)
```

### 2. Criação de Boolean

**valueOf()** (recomendado):
```java
Boolean b1 = Boolean.valueOf(true);    // Retorna Boolean.TRUE
Boolean b2 = Boolean.valueOf(false);   // Retorna Boolean.FALSE
Boolean b3 = Boolean.valueOf("true");  // Retorna Boolean.TRUE
Boolean b4 = Boolean.valueOf("false"); // Retorna Boolean.FALSE
Boolean b5 = Boolean.valueOf("TRUE");  // Retorna Boolean.TRUE (case-insensitive)

// Qualquer outra string retorna FALSE
Boolean b6 = Boolean.valueOf("yes");   // Boolean.FALSE
Boolean b7 = Boolean.valueOf("1");     // Boolean.FALSE
Boolean b8 = Boolean.valueOf(null);    // Boolean.FALSE
```

**Autoboxing**:
```java
Boolean b1 = true;   // Equivale a Boolean.valueOf(true)
Boolean b2 = false;  // Equivale a Boolean.valueOf(false)
```

**Construtor** (deprecated Java 9+):
```java
@Deprecated
Boolean b3 = new Boolean(true);   // ⚠️ Deprecated
@Deprecated
Boolean b4 = new Boolean("true"); // ⚠️ Deprecated
```

### 3. Parsing: parseBoolean()

**Regra**: Retorna `true` se string é "true" (case-insensitive), `false` caso contrário.

```java
// Retorna true
boolean t1 = Boolean.parseBoolean("true");   // true
boolean t2 = Boolean.parseBoolean("TRUE");   // true
boolean t3 = Boolean.parseBoolean("True");   // true
boolean t4 = Boolean.parseBoolean("TrUe");   // true

// Retorna false (qualquer outra coisa)
boolean f1 = Boolean.parseBoolean("false");  // false
boolean f2 = Boolean.parseBoolean("FALSE");  // false
boolean f3 = Boolean.parseBoolean("yes");    // false ⚠️
boolean f4 = Boolean.parseBoolean("1");      // false ⚠️
boolean f5 = Boolean.parseBoolean("no");     // false
boolean f6 = Boolean.parseBoolean("0");      // false
boolean f7 = Boolean.parseBoolean("");       // false
boolean f8 = Boolean.parseBoolean(null);     // false
```

**Importante**: `parseBoolean()` **NUNCA lança exception**!

### 4. Conversão boolean ↔ Boolean

**Primitivo → Wrapper**:
```java
boolean primitivo = true;
Boolean wrapper = Boolean.valueOf(primitivo);  // Recomendado
Boolean wrapper2 = primitivo;  // Autoboxing
```

**Wrapper → Primitivo**:
```java
Boolean wrapper = Boolean.TRUE;
boolean primitivo = wrapper.booleanValue();  // Unboxing manual
boolean primitivo2 = wrapper;  // Autoboxing automático
```

### 5. Comparação

**compareTo()** (false < true):
```java
Boolean b1 = false;
Boolean b2 = true;

int result = b1.compareTo(b2);  // -1 (false < true)
int result2 = b2.compareTo(b1); // 1 (true > false)
int result3 = b1.compareTo(false);  // 0 (iguais)

// Método estático
int result4 = Boolean.compare(false, true);  // -1
int result5 = Boolean.compare(true, true);   // 0
```

**equals()**:
```java
Boolean b1 = true;
Boolean b2 = true;
Boolean b3 = Boolean.valueOf(true);

System.out.println(b1.equals(b2));  // true
System.out.println(b1 == b2);       // true (cache!)
System.out.println(b1 == b3);       // true (cache!)
System.out.println(b1 == Boolean.TRUE);  // true (singleton)
```

### 6. Operações Lógicas

**logicalAnd()** (Java 8+):
```java
boolean result = Boolean.logicalAnd(true, true);   // true
boolean result2 = Boolean.logicalAnd(true, false); // false
boolean result3 = Boolean.logicalAnd(false, false);// false
```

**logicalOr()** (Java 8+):
```java
boolean result = Boolean.logicalOr(true, false);   // true
boolean result2 = Boolean.logicalOr(false, false); // false
```

**logicalXor()** (Java 8+):
```java
boolean result = Boolean.logicalXor(true, false);  // true
boolean result2 = Boolean.logicalXor(true, true);  // false
boolean result3 = Boolean.logicalXor(false, false);// false
```

### 7. String e Hash

**toString()**:
```java
String str1 = Boolean.toString(true);   // "true"
String str2 = Boolean.toString(false);  // "false"

Boolean obj = true;
String str3 = obj.toString();  // "true"
```

**hashCode()**:
```java
int hash1 = Boolean.TRUE.hashCode();   // 1231
int hash2 = Boolean.FALSE.hashCode();  // 1237

// Método estático (Java 8+)
int hash3 = Boolean.hashCode(true);    // 1231
int hash4 = Boolean.hashCode(false);   // 1237
```

---

## 🔍 Análise Conceitual Profunda

### Cache Completo (Singleton Pattern)

**Boolean** implementa o **Singleton Pattern** perfeitamente: existem apenas **2 instâncias** na JVM.

```java
Boolean b1 = Boolean.valueOf(true);
Boolean b2 = Boolean.valueOf(true);
Boolean b3 = true;  // Autoboxing

// Todos apontam para o MESMO objeto
System.out.println(b1 == b2);  // true
System.out.println(b1 == b3);  // true
System.out.println(b1 == Boolean.TRUE);  // true

// Mesmo com diferentes formas de criação
Boolean b4 = Boolean.valueOf("true");
Boolean b5 = Boolean.valueOf("TRUE");
System.out.println(b4 == b5);  // true (mesmo objeto!)
```

**Exceção**: Construtor deprecated cria novos objetos:
```java
@Deprecated
Boolean b1 = new Boolean(true);
@Deprecated
Boolean b2 = new Boolean(true);

System.out.println(b1 == b2);  // false ⚠️ (objetos diferentes)
System.out.println(b1.equals(b2));  // true (valores iguais)
```

### Tri-state com Boolean

**Primitivo boolean**: Apenas 2 estados (true/false)
**Wrapper Boolean**: 3 estados (true/false/**null**)

```java
public class TriState {
    // Primitivo: sem null
    private boolean aceitoTermos;  // Padrão: false
    
    // Wrapper: permite null
    private Boolean aceitoTermosOpcional;  // Padrão: null
    
    public void exemplo() {
        // Primitivo
        if (aceitoTermos) {
            // Aceito
        } else {
            // Não aceito OU não definido (ambíguo!)
        }
        
        // Wrapper (tri-state)
        if (aceitoTermosOpcional == null) {
            System.out.println("Não respondeu");
        } else if (aceitoTermosOpcional) {
            System.out.println("Aceitou");
        } else {
            System.out.println("Rejeitou");
        }
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Parsing Tolerante

```java
public class ParsingBoolean {
    public Boolean parseBoolean(String input) {
        if (input == null) {
            return null;  // Tri-state: null = "não definido"
        }
        
        // parseBoolean() é case-insensitive e tolerante
        return Boolean.valueOf(input);
    }
    
    public void exemplo() {
        System.out.println(parseBoolean("true"));   // true
        System.out.println(parseBoolean("TRUE"));   // true
        System.out.println(parseBoolean("yes"));    // false ⚠️
        System.out.println(parseBoolean("1"));      // false ⚠️
        System.out.println(parseBoolean(null));     // null
    }
}
```

### Caso 2: Validação Estrita de true/false

```java
public class ValidacaoEstrita {
    public Boolean parseBooleanStrict(String input) {
        if (input == null) {
            return null;
        }
        
        String lower = input.trim().toLowerCase();
        if ("true".equals(lower)) {
            return true;
        } else if ("false".equals(lower)) {
            return false;
        } else {
            throw new IllegalArgumentException(
                "Esperado 'true' ou 'false', recebido: " + input
            );
        }
    }
    
    public void exemplo() {
        try {
            System.out.println(parseBooleanStrict("true"));   // true
            System.out.println(parseBooleanStrict("false"));  // false
            System.out.println(parseBooleanStrict("yes"));    // Exception!
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
        }
    }
}
```

### Caso 3: Flags em Collections

```java
import java.util.*;

public class FlagsCollections {
    public void exemplo() {
        // List de Boolean
        List<Boolean> permissoes = new ArrayList<>();
        permissoes.add(true);   // Leitura
        permissoes.add(false);  // Escrita
        permissoes.add(true);   // Execução
        
        // Map de flags
        Map<String, Boolean> configuracoes = new HashMap<>();
        configuracoes.put("debug", true);
        configuracoes.put("production", false);
        configuracoes.put("logging", true);
        
        // Contagem
        long ativos = permissoes.stream()
                                .filter(Boolean::booleanValue)
                                .count();
        System.out.println("Permissões ativas: " + ativos);  // 2
    }
}
```

### Caso 4: Operações Lógicas com Null-Safety

```java
public class LogicaSegura {
    public Boolean and(Boolean a, Boolean b) {
        if (a == null || b == null) {
            return null;  // Propagação de null
        }
        return a && b;
    }
    
    public Boolean or(Boolean a, Boolean b) {
        if (a == null && b == null) {
            return null;
        }
        if (a == null) return b;
        if (b == null) return a;
        return a || b;
    }
    
    public void exemplo() {
        System.out.println(and(true, true));    // true
        System.out.println(and(true, null));    // null
        System.out.println(or(true, null));     // true
        System.out.println(or(false, null));    // null
    }
}
```

### Caso 5: Toggle de Estado

```java
public class ToggleEstado {
    private Boolean ativo = false;
    
    public void toggle() {
        if (ativo == null) {
            ativo = true;
        } else {
            ativo = !ativo;
        }
    }
    
    public void exemplo() {
        System.out.println(ativo);  // false
        toggle();
        System.out.println(ativo);  // true
        toggle();
        System.out.println(ativo);  // false
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. parseBoolean() É Tolerante Demais

**Problema**: Qualquer string != "true" retorna `false`.

```java
boolean b1 = Boolean.parseBoolean("yes");  // false ⚠️
boolean b2 = Boolean.parseBoolean("1");    // false ⚠️
boolean b3 = Boolean.parseBoolean("abc");  // false ⚠️
```

**Solução**: Validação estrita quando necessário.

### 2. NullPointerException em Unboxing

**Problema**: Unboxing de `null` causa NPE.

```java
Boolean obj = null;
boolean primitivo = obj;  // ❌ NullPointerException
```

**Solução**: Verificar null.
```java
if (obj != null) {
    boolean primitivo = obj;
}
// OU
boolean primitivo = Boolean.TRUE.equals(obj);  // Null-safe
```

### 3. Comparação com ==

**Problema**: Funciona por acaso (cache completo), mas não é semântica correta.

```java
Boolean b1 = true;
Boolean b2 = true;
System.out.println(b1 == b2);  // true (funciona, mas...)
```

**Solução**: Usar `equals()` para consistência.
```java
System.out.println(b1.equals(b2));  // ✅ Semântica correta
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Tipo Primitivo boolean**: Base do wrapper
- **Autoboxing/Unboxing**: Conversão automática
- **Tri-state Logic**: Uso de null
- **Singleton Pattern**: Cache completo
- **Collections**: Armazenamento de flags

---

## 🚀 Boas Práticas

1. ✅ **Use constantes Boolean.TRUE/FALSE quando apropriado**
   ```java
   Boolean flag = Boolean.TRUE;
   ```

2. ✅ **Prefira primitivo quando null não é necessário**
   ```java
   boolean flag = true;  // ✅ Mais eficiente
   ```

3. ✅ **Use wrapper quando null é significativo (tri-state)**
   ```java
   Boolean opcional = null;  // "Não definido"
   ```

4. ✅ **Valide estritamente quando parseBoolean() é tolerante demais**
   ```java
   if ("true".equalsIgnoreCase(input)) {
       return true;
   } else if ("false".equalsIgnoreCase(input)) {
       return false;
   } else {
       throw new IllegalArgumentException();
   }
   ```

5. ✅ **Verifique null antes de unboxing**
   ```java
   if (obj != null) {
       boolean b = obj;
   }
   ```

6. ✅ **Use Boolean.TRUE.equals() para null-safety**
   ```java
   if (Boolean.TRUE.equals(flag)) {
       // Seguro mesmo se flag for null
   }
   ```

7. ⚠️ **Evite criar Boolean com construtor**
   ```java
   // ❌ Deprecated
   Boolean b = new Boolean(true);
   
   // ✅ Correto
   Boolean b = Boolean.valueOf(true);
   // OU
   Boolean b = true;  // Autoboxing
   ```

8. ✅ **Use equals() para comparar Boolean (não ==)**
   ```java
   Boolean b1 = true;
   Boolean b2 = true;
   System.out.println(b1.equals(b2));  // ✅ Correto
   ```
