# Autoboxing e Unboxing Detalhado

## 🎯 Introdução e Definição

### Definição Conceitual

**Autoboxing** é a conversão automática de um tipo **primitivo** para seu **wrapper** correspondente.
**Unboxing** é a conversão automática de um **wrapper** para seu tipo **primitivo** correspondente.

Introduzido no **Java 5**, esse mecanismo permite escrever código mais conciso eliminando conversões manuais entre primitivos e wrappers.

**Mapeamentos**:
```
byte    ↔ Byte
short   ↔ Short
int     ↔ Integer
long    ↔ Long
float   ↔ Float
double  ↔ Double
char    ↔ Character
boolean ↔ Boolean
```

**Exemplo**:
```java
// SEM autoboxing (Java < 5)
Integer num = Integer.valueOf(10);  // Manual
int primitivo = num.intValue();     // Manual

// COM autoboxing (Java 5+)
Integer num = 10;           // Autoboxing automático!
int primitivo = num;        // Unboxing automático!

// Collections
List<Integer> numeros = new ArrayList<>();
numeros.add(5);             // Autoboxing: int → Integer
int valor = numeros.get(0); // Unboxing: Integer → int
```

### Características Fundamentais

- 🔄 **Automático**: Compilador insere conversões
- 📦 **Boxing**: Primitivo → Wrapper
- 📤 **Unboxing**: Wrapper → Primitivo
- ⚡ **Transparente**: Código mais limpo
- ⚠️ **NullPointerException**: Unboxing de `null` causa NPE
- 💾 **Cache**: Boxing usa `valueOf()` (aproveita cache)
- 🐢 **Performance**: Overhead em loops intensivos

---

## 📋 Sumário Conceitual

### Conversões Automáticas

**Autoboxing** (primitivo → wrapper):
```java
Integer num = 10;           // int → Integer
Double valor = 3.14;        // double → Double
Boolean flag = true;        // boolean → Boolean
```

**Unboxing** (wrapper → primitivo):
```java
Integer num = 100;
int primitivo = num;        // Integer → int

Double valor = 5.5;
double d = valor;           // Double → double
```

**Operações mistas**:
```java
Integer a = 10;             // Autoboxing
int resultado = a + 5;      // Unboxing + soma + autoboxing
```

---

## 🧠 Fundamentos Teóricos

### 1. Como Autoboxing Funciona Internamente

**Código escrito**:
```java
Integer num = 10;
```

**Código compilado** (equivalente):
```java
Integer num = Integer.valueOf(10);
```

**valueOf() usa cache**:
```java
public static Integer valueOf(int i) {
    if (i >= -128 && i <= 127) {
        return IntegerCache.cache[i + 128];  // Cache
    }
    return new Integer(i);  // Novo objeto
}
```

**Implicação**: Autoboxing **aproveita cache** (-128 a 127 para Integer).

### 2. Como Unboxing Funciona Internamente

**Código escrito**:
```java
Integer num = 100;
int primitivo = num;
```

**Código compilado** (equivalente):
```java
Integer num = Integer.valueOf(100);
int primitivo = num.intValue();
```

**intValue() retorna valor primitivo**:
```java
public int intValue() {
    return value;  // Campo final do Integer
}
```

### 3. Autoboxing em Collections

**Código escrito**:
```java
List<Integer> numeros = new ArrayList<>();
numeros.add(10);
int valor = numeros.get(0);
```

**Código compilado**:
```java
List<Integer> numeros = new ArrayList<>();
numeros.add(Integer.valueOf(10));         // Autoboxing
int valor = numeros.get(0).intValue();    // Unboxing
```

**Implicação**: Collections **sempre** usam autoboxing/unboxing.

### 4. Operações Aritméticas com Wrappers

**Código escrito**:
```java
Integer a = 10;
Integer b = 20;
Integer resultado = a + b;
```

**Código compilado**:
```java
Integer a = Integer.valueOf(10);
Integer b = Integer.valueOf(20);
int temp1 = a.intValue();         // Unboxing
int temp2 = b.intValue();         // Unboxing
int temp3 = temp1 + temp2;        // Aritmética primitiva
Integer resultado = Integer.valueOf(temp3);  // Autoboxing
```

**Passos**:
1. **Unboxing**: `a` e `b` → `int`
2. **Aritmética**: Soma primitiva
3. **Autoboxing**: Resultado → `Integer`

### 5. Incremento/Decremento (++/--)

**Código escrito**:
```java
Integer num = 10;
num++;
```

**Código compilado**:
```java
Integer num = Integer.valueOf(10);
int temp = num.intValue();        // Unboxing
temp = temp + 1;                  // Incremento
num = Integer.valueOf(temp);      // Autoboxing (NOVO OBJETO)
```

**Implicação**: `num++` **cria novo objeto** (wrappers são imutáveis).

**Performance**: Em loops, criar objetos é custoso!
```java
// ⚠️ LENTO: cria 1_000_000 objetos
Integer soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma++;  // Unboxing + incremento + autoboxing
}

// ✅ RÁPIDO: usa primitivo
int somaRapida = 0;
for (int i = 0; i < 1_000_000; i++) {
    somaRapida++;
}
```

### 6. Comparação: == vs equals()

**== com autoboxing**:
```java
Integer a = 100;
Integer b = 100;
System.out.println(a == b);  // true (cache!)

Integer c = 200;
Integer d = 200;
System.out.println(c == d);  // false ⚠️ (fora do cache)
```

**Mistura de primitivo e wrapper**:
```java
Integer a = 100;
int b = 100;
System.out.println(a == b);  // true ✅ (a é unboxed)

// Compilador transforma em:
System.out.println(a.intValue() == b);  // Comparação primitiva
```

**Regra**: `==` entre wrapper e primitivo **sempre unboxa** o wrapper.

### 7. NullPointerException em Unboxing

**Problema**: Unboxing de `null` causa NPE.
```java
Integer num = null;
int primitivo = num;  // ❌ NullPointerException!

// Compilador traduz para:
int primitivo = num.intValue();  // null.intValue() → NPE
```

**Cenários comuns**:
```java
// Caso 1: Unboxing direto
Integer idade = null;
int i = idade;  // ❌ NPE

// Caso 2: Operação aritmética
Integer x = null;
int resultado = x + 5;  // ❌ NPE (unboxing de x)

// Caso 3: Incremento
Integer contador = null;
contador++;  // ❌ NPE (unboxing em contador++)

// Caso 4: Comparação com primitivo
Integer valor = null;
if (valor == 10) { /* ... */ }  // ❌ NPE (unboxing de valor)
```

**Solução**: Verificar `null` antes de unboxing.
```java
Integer num = null;

// Opção 1: Verificação manual
if (num != null) {
    int i = num;  // Seguro
}

// Opção 2: Valor padrão
int i = (num != null) ? num : 0;

// Opção 3: Objects.requireNonNullElse() (Java 9+)
int i = Objects.requireNonNullElse(num, 0);
```

### 8. Widening vs Boxing

**Widening**: Conversão entre primitivos.
**Boxing**: Conversão primitivo → wrapper.

**Regra**: Widening tem **prioridade** sobre boxing.
```java
void processar(long l) { System.out.println("long"); }
void processar(Integer i) { System.out.println("Integer"); }

int x = 10;
processar(x);  // "long" (widening: int → long)
               // Não "Integer" (boxing: int → Integer)
```

**Ordem de prioridade**:
1. **Exact match**: int → int
2. **Widening**: int → long
3. **Autoboxing**: int → Integer
4. **Widening + Unboxing**: int → Integer → Number

### 9. Autoboxing em Ternário

**Operador ternário** pode causar autoboxing/unboxing inesperado.
```java
Integer num = condicao ? 10 : 20;  // Autoboxing

// Se um lado for wrapper e outro primitivo:
Integer a = 100;
int b = 50;
Integer resultado = condicao ? a : b;  // b é autoboxed
// Compilador: Integer resultado = condicao ? a : Integer.valueOf(b);
```

**Problema**: Tipo de retorno é determinado em tempo de compilação.
```java
Integer num = null;
int valor = 10;
int resultado = (num != null) ? num : valor;
// Se num == null, retorna valor (10) ✅

// MAS:
int resultado2 = (num != null) ? num : 0;
// Se num == null, tenta unboxing de num → NPE! ❌
```

### 10. Autoboxing em Generics

**Generics não aceitam primitivos**:
```java
// ❌ Erro! T não pode ser primitivo
// List<int> numeros = new ArrayList<>();

// ✅ Correto: usar wrapper
List<Integer> numeros = new ArrayList<>();
numeros.add(10);  // Autoboxing
```

**Métodos genéricos**:
```java
public <T> void processar(T valor) {
    System.out.println(valor);
}

processar(10);  // Autoboxing: int → Integer
// Assinatura: processar(Integer valor)
```

---

## 🔍 Análise Conceitual Profunda

### Performance: Autoboxing vs Primitivos

**Benchmark** (conceitual):
```java
// Primitivos: ~10ms
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;
}

// Wrappers: ~100ms (10x mais lento!)
Integer somaObj = 0;
for (Integer i = 0; i < 1_000_000; i++) {
    somaObj += i;  // Unboxing + soma + autoboxing
}
```

**Motivos da lentidão**:
1. **Unboxing**: Chamar `intValue()` milhões de vezes
2. **Boxing**: Criar objetos milhões de vezes
3. **GC pressure**: Garbage Collector precisa coletar objetos
4. **Cache miss**: Objetos no heap (mais lento que stack)

### Autoboxing e Memory Footprint

**Primitivo**:
```java
int[] array = new int[1_000_000];
// Memória: 1_000_000 * 4 bytes = 4 MB
```

**Wrapper**:
```java
Integer[] array = new Integer[1_000_000];
for (int i = 0; i < 1_000_000; i++) {
    array[i] = i;  // Autoboxing
}
// Memória: 1_000_000 * 16 bytes = 16 MB (4x maior!)
```

### Autoboxing em Streams

**Streams especializados** evitam autoboxing:
```java
// ❌ Stream<Integer>: autoboxing
List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5);
int soma = numeros.stream()
                  .reduce(0, (a, b) -> a + b);  // Muitos boxing/unboxing

// ✅ IntStream: primitivos (sem autoboxing)
int somaRapida = IntStream.range(1, 6)
                          .sum();  // Sem boxing/unboxing!
```

**Conversão entre Stream e IntStream**:
```java
// Stream<Integer> → IntStream (unboxing)
List<Integer> lista = Arrays.asList(1, 2, 3);
int soma = lista.stream()
               .mapToInt(Integer::intValue)  // Unboxing
               .sum();

// IntStream → Stream<Integer> (boxing)
IntStream.range(1, 6)
         .boxed()  // Boxing
         .collect(Collectors.toList());
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Uso em Collections

```java
import java.util.*;

public class AutoboxingCollections {
    public void exemplo() {
        List<Integer> numeros = new ArrayList<>();
        
        // Autoboxing em add()
        numeros.add(10);   // int → Integer
        numeros.add(20);
        
        // Unboxing em get()
        int primeiro = numeros.get(0);  // Integer → int
        
        // Operações com autoboxing/unboxing
        int soma = 0;
        for (Integer num : numeros) {  // Unboxing em iteração
            soma += num;  // Unboxing de num
        }
    }
}
```

### Caso 2: Null-Safety em Unboxing

```java
public class NullSafetyUnboxing {
    public int calcular(Integer valor) {
        // ❌ PERIGOSO: pode lançar NPE
        // return valor * 2;
        
        // ✅ SEGURO: verifica null
        if (valor == null) {
            return 0;
        }
        return valor * 2;
        
        // OU: operador ternário
        return (valor != null) ? valor * 2 : 0;
    }
    
    public void exemplo() {
        System.out.println(calcular(10));    // 20
        System.out.println(calcular(null));  // 0 (sem NPE)
    }
}
```

### Caso 3: Performance em Loops

```java
public class PerformanceLoops {
    public void comparar() {
        // ⚠️ LENTO: autoboxing/unboxing a cada iteração
        long inicio = System.nanoTime();
        Integer soma = 0;
        for (Integer i = 0; i < 1_000_000; i++) {
            soma += i;
        }
        long fim = System.nanoTime();
        System.out.println("Wrapper: " + (fim - inicio) + " ns");
        
        // ✅ RÁPIDO: primitivos puros
        inicio = System.nanoTime();
        int somaRapida = 0;
        for (int i = 0; i < 1_000_000; i++) {
            somaRapida += i;
        }
        fim = System.nanoTime();
        System.out.println("Primitivo: " + (fim - inicio) + " ns");
    }
}
```

### Caso 4: Comparação Segura

```java
public class ComparacaoSegura {
    public boolean saoIguais(Integer a, Integer b) {
        // ❌ ERRADO: depende de cache
        // return a == b;
        
        // ✅ CORRETO: sempre funciona
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.equals(b);
        
        // OU: Objects.equals() (null-safe)
        return Objects.equals(a, b);
    }
    
    public void exemplo() {
        System.out.println(saoIguais(100, 100));  // true
        System.out.println(saoIguais(200, 200));  // true
        System.out.println(saoIguais(null, null));// true
        System.out.println(saoIguais(100, null)); // false
    }
}
```

### Caso 5: Evitar Autoboxing em Streams

```java
import java.util.stream.*;

public class StreamsOtimizados {
    public void exemplo() {
        // ❌ Stream<Integer>: muito autoboxing
        int soma1 = Stream.iterate(0, i -> i + 1)
                         .limit(1000)
                         .reduce(0, Integer::sum);  // Boxing/unboxing
        
        // ✅ IntStream: sem autoboxing
        int soma2 = IntStream.range(0, 1000)
                            .sum();  // Primitivos puros
        
        // ✅ Conversão consciente
        List<Integer> numeros = IntStream.range(0, 100)
                                        .boxed()  // Autoboxing explícito
                                        .collect(Collectors.toList());
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. NullPointerException

**Problema**: Unboxing de `null`.
```java
Integer num = null;
int i = num;  // ❌ NPE
```

**Solução**: Verificar `null`.
```java
int i = (num != null) ? num : 0;
```

### 2. Performance em Loops

**Problema**: Criar objetos é custoso.
```java
Integer soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // ⚠️ Lento
}
```

**Solução**: Usar primitivos.
```java
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // ✅ Rápido
}
```

### 3. Comparação com ==

**Problema**: Comportamento inesperado.
```java
Integer a = 200;
Integer b = 200;
System.out.println(a == b);  // false ⚠️
```

**Solução**: Usar `equals()`.
```java
System.out.println(a.equals(b));  // true ✅
```

### 4. Cache Dependência

**Problema**: Cache afeta `==`.
```java
Integer a = 127;
Integer b = 127;
System.out.println(a == b);  // true (cache)

Integer c = 128;
Integer d = 128;
System.out.println(c == d);  // false (sem cache)
```

**Solução**: Nunca dependa de `==`.

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Cache de Valores**: Autoboxing usa `valueOf()` (cache)
- **Imutabilidade**: Operações criam novos objetos
- **Performance**: Overhead de autoboxing em loops
- **Collections**: Requerem autoboxing
- **Streams**: IntStream evita autoboxing

---

## 🚀 Boas Práticas

1. ✅ **Verifique null antes de unboxing**
   ```java
   if (num != null) { int i = num; }
   ```

2. ✅ **Use primitivos em loops intensivos**
   ```java
   int soma = 0;
   for (int i = 0; i < 1_000_000; i++) { soma += i; }
   ```

3. ✅ **Use IntStream ao invés de Stream<Integer>**
   ```java
   IntStream.range(0, 100).sum();
   ```

4. ✅ **Sempre use equals() para comparar wrappers**
   ```java
   if (num1.equals(num2)) { /* ... */ }
   ```

5. ⚠️ **Evite incremento de wrappers em loops**
   ```java
   // ❌ Lento
   Integer i = 0; while (i < 1000) { i++; }
   
   // ✅ Rápido
   int i = 0; while (i < 1000) { i++; }
   ```

6. ✅ **Use Objects.equals() para null-safety**
   ```java
   if (Objects.equals(a, b)) { /* ... */ }
   ```

7. ✅ **Prefira valueOf() explícito quando clareza importa**
   ```java
   Integer num = Integer.valueOf(10);  // Explícito
   ```

8. ✅ **Entenda que autoboxing não é grátis**
   ```java
   // Cada operação tem custo!
   Integer x = 10;  // valueOf()
   int y = x;       // intValue()
   x++;             // intValue() + valueOf()
   ```
