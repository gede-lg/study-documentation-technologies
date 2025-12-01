# Cache de Valores Integer (e outras Wrapper Classes)

## 🎯 Introdução e Definição

### Definição Conceitual

**Cache de wrappers** é um mecanismo de otimização onde a JVM **reutiliza objetos** wrapper para valores frequentemente usados, ao invés de criar novos objetos sempre. Isso economiza memória e melhora performance.

**Wrapper Classes com cache**:
- ✅ **Integer**: -128 a 127 (configurável)
- ✅ **Long**: -128 a 127 (Java 9+)
- ✅ **Short**: -128 a 127
- ✅ **Byte**: -128 a 127 (todos os valores possíveis!)
- ✅ **Character**: 0 a 127 (ASCII)
- ✅ **Boolean**: TRUE e FALSE (todos os valores!)
- ❌ **Float**: Sem cache
- ❌ **Double**: Sem cache

**Exemplo**:
```java
// Cache funciona (dentro de -128 a 127)
Integer a = 100;
Integer b = 100;
System.out.println(a == b);  // true ✅ (mesmo objeto)

// Cache NÃO funciona (fora de -128 a 127)
Integer c = 200;
Integer d = 200;
System.out.println(c == d);  // false ⚠️ (objetos diferentes)

// Sempre use equals()!
System.out.println(c.equals(d));  // true ✅ (valores iguais)
```

### Características Fundamentais

- 🎯 **Objetivo**: Economia de memória e performance
- 📦 **Range padrão**: -128 a 127 (Integer)
- ⚙️ **Configurável**: Via JVM option `-XX:AutoBoxCacheMax`
- 🔄 **valueOf() usa cache**: Recomendado ao invés de construtor
- 🚫 **new não usa cache**: Sempre cria novo objeto (deprecated)
- 🎭 **Singleton para Boolean**: Apenas 2 objetos (TRUE/FALSE)
- ⚠️ **== vs equals()**: Cache afeta comparação com `==`

---

## 📋 Sumário Conceitual

### Como Funciona

1. **valueOf()** verifica se valor está no range de cache
2. Se **sim**: Retorna objeto do cache (reutilização)
3. Se **não**: Cria novo objeto

**Vantagem**:
- ✅ Menos objetos criados
- ✅ Menos pressão no Garbage Collector
- ✅ Economia de memória

**Desvantagem**:
- ⚠️ `==` pode dar resultado inesperado
- ⚠️ Cache configurável pode causar inconsistências

---

## 🧠 Fundamentos Teóricos

### 1. Implementação do Cache (Integer)

**Código interno do Integer** (simplificado):
```java
public final class Integer {
    // Cache interno
    private static class IntegerCache {
        static final int low = -128;
        static final int high = 127;  // Pode ser configurado
        static final Integer[] cache;
        
        static {
            // Cria array de cache
            cache = new Integer[high - low + 1];
            int j = low;
            for (int k = 0; k < cache.length; k++) {
                cache[k] = new Integer(j++);
            }
        }
    }
    
    public static Integer valueOf(int i) {
        // Se está no cache, retorna objeto existente
        if (i >= IntegerCache.low && i <= IntegerCache.high) {
            return IntegerCache.cache[i + (-IntegerCache.low)];
        }
        // Senão, cria novo objeto
        return new Integer(i);
    }
}
```

**Como funciona**:
1. **Inicialização**: JVM cria array com Integers de -128 a 127
2. **valueOf(50)**: Retorna `cache[50 + 128]` (objeto existente)
3. **valueOf(200)**: Cria `new Integer(200)` (fora do cache)

### 2. Range Padrão: -128 a 127

**Por que -128 a 127?**
- ✅ **Valores mais usados**: Contadores, índices, flags
- ✅ **Byte range**: Cobre todos os valores de `byte`
- ✅ **ASCII**: Cobre caracteres ASCII (0-127)
- ✅ **Balanceamento**: Memória vs benefício

**Demonstração**:
```java
// Dentro do cache
Integer a = Integer.valueOf(-128);
Integer b = Integer.valueOf(-128);
System.out.println(a == b);  // true (cache)

Integer c = Integer.valueOf(127);
Integer d = Integer.valueOf(127);
System.out.println(c == d);  // true (cache)

// Fora do cache
Integer e = Integer.valueOf(-129);
Integer f = Integer.valueOf(-129);
System.out.println(e == f);  // false (novo objeto)

Integer g = Integer.valueOf(128);
Integer h = Integer.valueOf(128);
System.out.println(g == h);  // false (novo objeto)
```

### 3. Autoboxing Usa valueOf()

**Autoboxing chama valueOf() internamente**:
```java
Integer num = 100;  // Autoboxing

// Compilador transforma em:
Integer num = Integer.valueOf(100);  // Usa cache!
```

**Implicação**: Autoboxing **também** usa cache.
```java
Integer a = 100;  // Autoboxing → valueOf(100) → cache
Integer b = 100;  // Autoboxing → valueOf(100) → cache

System.out.println(a == b);  // true (mesmo objeto do cache)
```

### 4. Construtor NÃO Usa Cache (Deprecated)

**Construtor sempre cria novo objeto**:
```java
@Deprecated
Integer a = new Integer(100);
@Deprecated
Integer b = new Integer(100);

System.out.println(a == b);  // false ⚠️ (objetos diferentes)
System.out.println(a.equals(b));  // true (valores iguais)

// valueOf() usa cache
Integer c = Integer.valueOf(100);
Integer d = Integer.valueOf(100);
System.out.println(c == d);  // true ✅ (mesmo objeto)
```

**Conclusão**: Sempre use `valueOf()` ou autoboxing!

### 5. Cache de Outros Wrappers

**Long** (Java 9+):
```java
Long a = Long.valueOf(100L);
Long b = Long.valueOf(100L);
System.out.println(a == b);  // true (cache -128 a 127)

Long c = Long.valueOf(200L);
Long d = Long.valueOf(200L);
System.out.println(c == d);  // false (fora do cache)
```

**Short**:
```java
Short a = Short.valueOf((short) 100);
Short b = Short.valueOf((short) 100);
System.out.println(a == b);  // true (cache -128 a 127)
```

**Byte** (cache completo: -128 a 127 são TODOS os valores de byte):
```java
Byte a = Byte.valueOf((byte) 50);
Byte b = Byte.valueOf((byte) 50);
System.out.println(a == b);  // true (cache)

Byte c = Byte.valueOf((byte) -128);
Byte d = Byte.valueOf((byte) -128);
System.out.println(c == d);  // true (cache)
```

**Character** (0 a 127 = ASCII):
```java
Character a = Character.valueOf('A');  // 65
Character b = Character.valueOf('A');
System.out.println(a == b);  // true (cache 0-127)

Character c = Character.valueOf('中');  // Fora do cache
Character d = Character.valueOf('中');
System.out.println(c == d);  // false (objetos diferentes)
```

**Boolean** (cache completo):
```java
Boolean a = Boolean.valueOf(true);
Boolean b = Boolean.valueOf(true);
System.out.println(a == b);  // true (Boolean.TRUE)

Boolean c = Boolean.TRUE;
Boolean d = true;  // Autoboxing
System.out.println(c == d);  // true (mesmo objeto)

// Apenas 2 objetos existem: TRUE e FALSE
System.out.println(Boolean.TRUE == Boolean.valueOf(true));  // true
```

**Float e Double** (SEM cache):
```java
Float a = Float.valueOf(100.0f);
Float b = Float.valueOf(100.0f);
System.out.println(a == b);  // false ⚠️ (sem cache)

Double c = Double.valueOf(100.0);
Double d = Double.valueOf(100.0);
System.out.println(c == d);  // false ⚠️ (sem cache)
```

### 6. Configuração do Cache (Integer)

**JVM Option**: `-XX:AutoBoxCacheMax=<valor>`

```bash
# Aumentar cache até 1000
java -XX:AutoBoxCacheMax=1000 MeuPrograma

# Cache agora vai de -128 a 1000
Integer a = 500;
Integer b = 500;
System.out.println(a == b);  // true (dentro do novo cache)
```

**Cuidado**: Configuração diferente entre ambientes causa bugs!
```java
// Desenvolvimento: cache até 127
Integer a = 200;
Integer b = 200;
System.out.println(a == b);  // false

// Produção: cache até 1000
Integer a = 200;
Integer b = 200;
System.out.println(a == b);  // true ⚠️ (comportamento diferente!)
```

**Conclusão**: **NUNCA dependa de `==` para wrappers!** Sempre use `equals()`.

### 7. Comparação: == vs equals()

**== compara referências** (afetado pelo cache):
```java
Integer a = 100;
Integer b = 100;
System.out.println(a == b);  // true (cache)

Integer c = 200;
Integer d = 200;
System.out.println(c == d);  // false (sem cache)
```

**equals() compara valores** (não afetado pelo cache):
```java
Integer a = 100;
Integer b = 100;
System.out.println(a.equals(b));  // true

Integer c = 200;
Integer d = 200;
System.out.println(c.equals(d));  // true ✅ (sempre funciona)
```

**Regra de ouro**: **Sempre use equals() para wrappers!**

---

## 🔍 Análise Conceitual Profunda

### Cache e Performance

**Vantagens**:
1. **Menos objetos criados**: Reutilização
2. **Menos GC pressure**: Menos trabalho para Garbage Collector
3. **Economia de memória**: Menos heap usado

**Exemplo**:
```java
// Sem cache (hipotético)
for (int i = 0; i < 1000; i++) {
    Integer num = 50;  // 1000 objetos criados!
}

// Com cache (real)
for (int i = 0; i < 1000; i++) {
    Integer num = 50;  // Apenas 1 objeto (cache)!
}
```

### Cache e Concorrência

**Cache é thread-safe** (objetos são imutáveis):
```java
// Múltiplas threads
Integer num1 = 100;  // Thread 1
Integer num2 = 100;  // Thread 2

// Ambas apontam para o MESMO objeto (cache)
System.out.println(num1 == num2);  // true

// Mas é seguro! Objetos são imutáveis
num1 = num1 + 5;  // Cria NOVO objeto (não afeta num2)
```

### Armadilhas do Cache

**Armadilha 1**: Comparação com `==`.
```java
Integer a = 127;
Integer b = 127;
if (a == b) {  // true (cache)
    System.out.println("Iguais");
}

Integer c = 128;
Integer d = 128;
if (c == d) {  // false ⚠️ (sem cache)
    System.out.println("Iguais");  // Não executa!
}
```

**Solução**: Sempre use `equals()`.
```java
if (c.equals(d)) {  // true ✅
    System.out.println("Iguais");
}
```

**Armadilha 2**: Cache configurável.
```java
// Ambiente 1: cache padrão (-128 a 127)
Integer a = 200;
Integer b = 200;
System.out.println(a == b);  // false

// Ambiente 2: cache estendido (-128 a 1000)
// -XX:AutoBoxCacheMax=1000
Integer a = 200;
Integer b = 200;
System.out.println(a == b);  // true ⚠️ (comportamento diferente!)
```

**Solução**: Nunca dependa de `==` para wrappers.

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Otimização de Memória

```java
public class ContadorOcorrencias {
    // Cache economiza memória
    private Map<String, Integer> contadores = new HashMap<>();
    
    public void incrementar(String chave) {
        Integer valor = contadores.getOrDefault(chave, 0);
        contadores.put(chave, valor + 1);
        // Se valor for < 128, usa cache (economia de memória)
    }
    
    public void exemplo() {
        for (int i = 0; i < 1000; i++) {
            incrementar("visitas");  // Reutiliza objetos do cache
        }
    }
}
```

### Caso 2: Comparação Segura

```java
public class ComparadorSeguro {
    public boolean saoIguais(Integer a, Integer b) {
        // ❌ ERRADO: depende de cache
        // return a == b;
        
        // ✅ CORRETO: sempre funciona
        return a.equals(b);
    }
    
    public void exemplo() {
        System.out.println(saoIguais(100, 100));  // true
        System.out.println(saoIguais(200, 200));  // true
    }
}
```

### Caso 3: valueOf() vs Construtor

```java
public class CriacaoWrapper {
    public void exemplo() {
        // ✅ RECOMENDADO: usa cache
        Integer a = Integer.valueOf(100);
        Integer b = Integer.valueOf(100);
        System.out.println(a == b);  // true
        
        // ❌ DEPRECATED: sempre cria novo objeto
        @Deprecated
        Integer c = new Integer(100);
        @Deprecated
        Integer d = new Integer(100);
        System.out.println(c == d);  // false
    }
}
```

### Caso 4: Debugging de Cache

```java
public class DebugCache {
    public void testarCache() {
        // Testar limites do cache
        testarValor(-129);  // Fora do cache
        testarValor(-128);  // Início do cache
        testarValor(0);     // Meio do cache
        testarValor(127);   // Fim do cache
        testarValor(128);   // Fora do cache
    }
    
    private void testarValor(int valor) {
        Integer a = Integer.valueOf(valor);
        Integer b = Integer.valueOf(valor);
        boolean cache = (a == b);
        System.out.printf("Valor %d: cache = %b%n", valor, cache);
    }
    
    // Saída:
    // Valor -129: cache = false
    // Valor -128: cache = true
    // Valor 0: cache = true
    // Valor 127: cache = true
    // Valor 128: cache = false
}
```

### Caso 5: Collections com Cache

```java
import java.util.*;

public class CacheEmCollections {
    public void exemplo() {
        List<Integer> numeros = new ArrayList<>();
        
        // Adicionar valores dentro do cache
        for (int i = 0; i < 10; i++) {
            numeros.add(i);  // Autoboxing → valueOf() → cache
        }
        
        // Todos os objetos são do cache (economia de memória)
        Integer primeiro = numeros.get(0);
        Integer outro = 0;  // Autoboxing → cache
        
        System.out.println(primeiro == outro);  // true (mesmo objeto)
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Dependência de == É Perigosa

**Problema**: Funciona dentro do cache, falha fora.
```java
Integer a = 100;
Integer b = 100;
if (a == b) { /* ... */ }  // ✅ Funciona (cache)

Integer c = 200;
Integer d = 200;
if (c == d) { /* ... */ }  // ❌ Falha (sem cache)
```

**Solução**: Sempre use `equals()`.
```java
if (c.equals(d)) { /* ... */ }  // ✅ Sempre funciona
```

### 2. Cache Configurável

**Problema**: Comportamento muda entre ambientes.
```java
// Dev: cache padrão
Integer a = 200;
Integer b = 200;
System.out.println(a == b);  // false

// Prod: cache estendido (-XX:AutoBoxCacheMax=1000)
System.out.println(a == b);  // true ⚠️
```

**Solução**: Nunca dependa de cache.

### 3. Float/Double Sem Cache

**Problema**: Sempre criam novos objetos.
```java
Double a = 100.0;
Double b = 100.0;
System.out.println(a == b);  // false ⚠️ (sem cache)
```

**Solução**: Sempre use `equals()`.

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Imutabilidade**: Cache funciona porque objetos são imutáveis
- **valueOf()**: Método que usa cache
- **Autoboxing**: Chama valueOf() internamente
- **== vs equals()**: Cache afeta `==`
- **Performance**: Menos objetos = melhor performance

---

## 🚀 Boas Práticas

1. ✅ **Use valueOf() ou autoboxing (não construtor)**
   ```java
   Integer num = Integer.valueOf(100);  // ✅ Cache
   Integer num2 = 100;  // ✅ Autoboxing (cache)
   ```

2. ✅ **SEMPRE use equals() para comparar wrappers**
   ```java
   if (num1.equals(num2)) { /* ... */ }
   ```

3. ⚠️ **NUNCA dependa de == para wrappers**
   ```java
   // ❌ ERRADO
   if (num1 == num2) { /* ... */ }
   ```

4. ✅ **Entenda que cache é otimização interna (não feature)**
   ```java
   // Não escreva código que depende de cache
   ```

5. ✅ **Não configure cache em produção sem necessidade**
   ```bash
   # Evite:
   # java -XX:AutoBoxCacheMax=1000 App
   ```

6. ✅ **Use primitivos quando cache não importa**
   ```java
   int soma = 0;  // ✅ Primitivo (sem cache)
   ```

7. ✅ **Aproveite cache em loops com valores pequenos**
   ```java
   for (int i = 0; i < 100; i++) {
       Integer num = i;  // Cache (0-127)
   }
   ```

8. ✅ **Documente se código depende de comportamento de cache**
   ```java
   // ⚠️ Assume cache padrão (-128 a 127)
   ```
