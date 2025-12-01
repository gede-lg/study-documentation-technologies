# Autoboxing e Unboxing (Introdução)

## 🎯 Introdução e Definição

### Definição Conceitual

**Autoboxing** e **Unboxing** são mecanismos automáticos introduzidos no **Java 5** (2004) que permitem a **conversão implícita** entre tipos primitivos e suas classes Wrapper correspondentes, eliminando a necessidade de conversões manuais.

**Autoboxing**: Conversão automática **primitivo → Wrapper**
```java
int i = 10;
Integer obj = i;  // ✅ Autoboxing automático (equivale a: Integer.valueOf(i))
```

**Unboxing**: Conversão automática **Wrapper → primitivo**
```java
Integer obj = Integer.valueOf(100);
int i = obj;  // ✅ Unboxing automático (equivale a: obj.intValue())
```

### Características Fundamentais

**Autoboxing/Unboxing**:
- 🔄 **Automático**: Conversão implícita pelo compilador
- 📦 **Bidirecional**: Primitivo ↔ Wrapper
- ⚡ **Transparente**: Código mais limpo e legível
- ⚠️ **Performance**: Pode criar objetos desnecessários
- 🚨 **NullPointerException**: Unboxing de `null` causa NPE

### Mapeamento Primitivo → Wrapper

| Tipo Primitivo | Classe Wrapper | Exemplo Autoboxing       | Exemplo Unboxing          |
|----------------|----------------|--------------------------|---------------------------|
| byte           | Byte           | `Byte b = 10;`           | `byte b = Byte.valueOf(10);` |
| short          | Short          | `Short s = 100;`         | `short s = Short.valueOf(100);` |
| int            | Integer        | `Integer i = 1000;`      | `int i = Integer.valueOf(1000);` |
| long           | Long           | `Long l = 10000L;`       | `long l = Long.valueOf(10000L);` |
| float          | Float          | `Float f = 10.5f;`       | `float f = Float.valueOf(10.5f);` |
| double         | Double         | `Double d = 123.456;`    | `double d = Double.valueOf(123.456);` |
| boolean        | Boolean        | `Boolean b = true;`      | `boolean b = Boolean.valueOf(true);` |
| char           | Character      | `Character c = 'A';`     | `char c = Character.valueOf('A');` |

### Contexto Histórico

**Antes do Java 5** (manual):
```java
// ❌ Conversão manual (Java < 5)
Integer obj = Integer.valueOf(10);  // Primitivo → Wrapper (manual)
int i = obj.intValue();             // Wrapper → Primitivo (manual)
```

**A partir do Java 5** (automático):
```java
// ✅ Autoboxing/Unboxing (Java 5+)
Integer obj = 10;   // Autoboxing automático
int i = obj;        // Unboxing automático
```

---

## 📋 Sumário Conceitual

### Autoboxing (Primitivo → Wrapper)

**Conceito**: Compilador insere automaticamente chamadas a `valueOf()`.

**Exemplo**:
```java
Integer i = 10;  // Autoboxing

// Equivalente a:
Integer i = Integer.valueOf(10);
```

### Unboxing (Wrapper → Primitivo)

**Conceito**: Compilador insere automaticamente chamadas a `*Value()`.

**Exemplo**:
```java
Integer obj = Integer.valueOf(100);
int i = obj;  // Unboxing

// Equivalente a:
int i = obj.intValue();
```

---

## 🧠 Fundamentos Teóricos

### 1. Autoboxing em Atribuições

**Atribuição Direta**:
```java
// Autoboxing em atribuição
Integer i = 10;         // int → Integer
Double d = 123.456;     // double → Double
Boolean b = true;       // boolean → Boolean
Character c = 'A';      // char → Character

// Equivalente a (gerado pelo compilador):
Integer i = Integer.valueOf(10);
Double d = Double.valueOf(123.456);
Boolean b = Boolean.valueOf(true);
Character c = Character.valueOf('A');
```

**Atribuição de Expressões**:
```java
Integer i = 10 + 20;  // Resultado (int) → Integer
Double d = 5.5 * 2;   // Resultado (double) → Double
```

### 2. Unboxing em Atribuições

**Wrapper → Primitivo**:
```java
Integer obj = Integer.valueOf(100);
int i = obj;  // Unboxing: Integer → int

// Equivalente a:
int i = obj.intValue();
```

**Unboxing em Expressões**:
```java
Integer a = 10;
Integer b = 20;
int soma = a + b;  // Unboxing de a e b, depois soma

// Equivalente a:
int soma = a.intValue() + b.intValue();
```

### 3. Autoboxing/Unboxing em Operações Aritméticas

**Operações com Wrappers**:
```java
Integer a = 10;
Integer b = 20;

// Unboxing automático em operações
Integer soma = a + b;  // a e b são unboxed, soma é autoboxed
// Equivalente a: Integer.valueOf(a.intValue() + b.intValue())

Integer multiplicacao = a * 2;  // a unboxed, resultado autoboxed
```

**Exemplo Complexo**:
```java
Integer i1 = 5;
Integer i2 = 10;
Integer i3 = 15;

Integer resultado = i1 + i2 * i3;
// Unboxing: i1.intValue() + i2.intValue() * i3.intValue()
// Cálculo: 5 + 10 * 15 = 155
// Autoboxing: Integer.valueOf(155)
```

### 4. Autoboxing/Unboxing em Comparações

**Comparações Numéricas** (`<`, `>`, `<=`, `>=`):
```java
Integer a = 100;
Integer b = 200;

// Unboxing automático em comparações
if (a < b) {  // a.intValue() < b.intValue()
    System.out.println("a é menor que b");
}
```

**Igualdade** (`==`, `!=`):
```java
Integer i1 = 127;
Integer i2 = 127;
System.out.println(i1 == i2);  // ✅ true (cache de -128 a 127)

Integer i3 = 128;
Integer i4 = 128;
System.out.println(i3 == i4);  // ❌ false (objetos diferentes!)

// ✅ Use equals() para objetos
System.out.println(i3.equals(i4));  // true
```

### 5. Autoboxing em Coleções

**Lists, Sets, Maps**:
```java
import java.util.*;

// Autoboxing ao adicionar
List<Integer> lista = new ArrayList<>();
lista.add(10);    // Autoboxing: int → Integer
lista.add(20);    // Autoboxing: int → Integer

// Unboxing ao obter
int valor = lista.get(0);  // Unboxing: Integer → int

// Map com autoboxing/unboxing
Map<String, Integer> mapa = new HashMap<>();
mapa.put("idade", 25);  // Autoboxing: int → Integer

int idade = mapa.get("idade");  // Unboxing: Integer → int
```

### 6. Cache de Integer (e outros Wrappers)

**Integer.valueOf() Cache**: Valores **-128 a 127** são cacheados.

```java
// Valores no cache (-128 a 127)
Integer a = 100;
Integer b = 100;
System.out.println(a == b);  // ✅ true (mesmo objeto)

// Valores fora do cache
Integer c = 200;
Integer d = 200;
System.out.println(c == d);  // ❌ false (objetos diferentes)

// ✅ Sempre use equals() para objetos
System.out.println(c.equals(d));  // true
```

**Outros Caches**:
- **Byte**: Todos (-128 a 127) são cacheados
- **Short**: -128 a 127 são cacheados
- **Long**: -128 a 127 são cacheados
- **Character**: 0 a 127 são cacheados
- **Boolean**: `true` e `false` são cacheados (apenas 2 instâncias)

---

## 🔍 Análise Conceitual Profunda

### Compilação de Autoboxing/Unboxing

**Código Original**:
```java
Integer i = 10;
int j = i + 5;
```

**Código Compilado** (equivalente):
```java
Integer i = Integer.valueOf(10);
int j = i.intValue() + 5;
```

### Performance Considerations

**Criação de Objetos**:
```java
// ⚠️ Cria 1.000.000 objetos Integer
Integer soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // Unboxing, soma, autoboxing em cada iteração!
}

// ✅ Sem autoboxing (muito mais rápido)
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // Operação primitiva
}
```

**Benchmark**: Loop com autoboxing pode ser **10-100x mais lento**.

### NullPointerException em Unboxing

**Problema**: Unboxing de `null` lança NPE.

```java
Integer obj = null;
int i = obj;  // ❌ NullPointerException (tenta obj.intValue())
```

**Exemplo Real**:
```java
Map<String, Integer> mapa = new HashMap<>();
int valor = mapa.get("chaveInexistente");  // ❌ NPE (retorna null, faz unboxing)
```

**Solução**: Verificar null antes de unboxing.
```java
Integer valor = mapa.get("chave");
if (valor != null) {
    int i = valor;  // ✅ Seguro
}

// OU usar getOrDefault (Java 8+)
int i = mapa.getOrDefault("chave", 0);  // ✅ Retorna 0 se null
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Uso em Collections

```java
import java.util.*;

public class AutoboxingCollections {
    public void exemplo() {
        List<Integer> numeros = new ArrayList<>();
        
        // Autoboxing ao adicionar
        for (int i = 1; i <= 5; i++) {
            numeros.add(i);  // int → Integer (autoboxing)
        }
        
        // Unboxing ao iterar
        int soma = 0;
        for (Integer num : numeros) {
            soma += num;  // Integer → int (unboxing)
        }
        
        System.out.println("Soma: " + soma);  // 15
    }
}
```

### Caso 2: Métodos que Recebem Wrappers

```java
public class AutoboxingMetodos {
    // Método que recebe Wrapper
    public void processar(Integer valor) {
        System.out.println("Valor: " + valor);
    }
    
    public void exemplo() {
        int i = 100;
        processar(i);  // ✅ Autoboxing: int → Integer
    }
}
```

### Caso 3: Métodos que Retornam Wrappers

```java
public class AutoboxingRetorno {
    // Método que retorna Wrapper
    public Integer calcular() {
        int resultado = 10 + 20;
        return resultado;  // ✅ Autoboxing: int → Integer
    }
    
    public void exemplo() {
        int valor = calcular();  // ✅ Unboxing: Integer → int
        System.out.println(valor);  // 30
    }
}
```

### Caso 4: Evitando NullPointerException

```java
public class EvitarNPE {
    public int calcularIdade(Map<String, Integer> dados) {
        // ⚠️ Perigoso: pode causar NPE se chave não existir
        // int idade = dados.get("idade");
        
        // ✅ Seguro: verificar null
        Integer idade = dados.get("idade");
        if (idade != null) {
            return idade;  // Unboxing seguro
        } else {
            return 0;  // Valor padrão
        }
        
        // OU usar getOrDefault (Java 8+)
        // return dados.getOrDefault("idade", 0);
    }
}
```

### Caso 5: Performance - Evitando Autoboxing Desnecessário

```java
public class PerformanceAutoboxing {
    // ❌ Lento: autoboxing em cada iteração
    public Integer somaLenta(int[] array) {
        Integer soma = 0;
        for (int valor : array) {
            soma += valor;  // Unboxing, soma, autoboxing
        }
        return soma;
    }
    
    // ✅ Rápido: sem autoboxing
    public int somaRapida(int[] array) {
        int soma = 0;
        for (int valor : array) {
            soma += valor;  // Operação primitiva
        }
        return soma;  // Autoboxing apenas no retorno (se necessário)
    }
}
```

### Caso 6: Cache de Integer

```java
public class CacheInteger {
    public void demonstrarCache() {
        // Valores no cache (-128 a 127)
        Integer a = 100;
        Integer b = 100;
        System.out.println(a == b);  // true (mesmo objeto)
        
        // Valores fora do cache
        Integer c = 200;
        Integer d = 200;
        System.out.println(c == d);  // false (objetos diferentes)
        
        // ✅ Sempre use equals() para comparação de valor
        System.out.println(a.equals(b));  // true
        System.out.println(c.equals(d));  // true
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. NullPointerException em Unboxing

**Problema**: Unboxing de `null` causa NPE.

```java
Integer obj = null;
int i = obj;  // ❌ NullPointerException
```

**Solução**: Verificar null antes.
```java
if (obj != null) {
    int i = obj;
}
```

### 2. Performance em Loops

**Problema**: Autoboxing em loops cria objetos desnecessários.

```java
// ❌ Lento
Integer soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // Muitos objetos criados
}
```

**Solução**: Usar primitivos quando possível.
```java
// ✅ Rápido
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;
}
```

### 3. Comparação com == vs equals()

**Problema**: `==` compara referências, não valores.

```java
Integer a = 200;
Integer b = 200;
System.out.println(a == b);  // ❌ false (objetos diferentes)
```

**Solução**: Usar `equals()` para comparar valores.
```java
System.out.println(a.equals(b));  // ✅ true
```

### 4. Cache Pode Causar Confusão

**Problema**: Comportamento diferente dentro/fora do cache.

```java
Integer a = 127;
Integer b = 127;
System.out.println(a == b);  // true (cache)

Integer c = 128;
Integer d = 128;
System.out.println(c == d);  // false (não cache)
```

**Solução**: **Nunca** use `==` para comparar Wrappers. Use `equals()`.

### 5. Overhead de Memória

**Problema**: Objetos Wrapper ocupam mais memória que primitivos.

- `int`: 4 bytes
- `Integer`: 16 bytes (objeto) + 4 bytes (valor) = 20 bytes

**Solução**: Usar primitivos quando possível, especialmente em arrays grandes.

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Wrapper Classes**: Base para autoboxing/unboxing
- **Tipos Primitivos**: Origem/destino das conversões
- **Collections**: Contexto principal de uso
- **Generics**: Requerem objetos (Wrappers), não primitivos
- **NullPointerException**: Risco em unboxing de null

---

## 🚀 Boas Práticas

1. ✅ **Prefira primitivos quando possível**
   ```java
   int i = 10;  // ✅ Mais eficiente que Integer
   ```

2. ✅ **Use Wrappers em Collections e Generics**
   ```java
   List<Integer> lista = new ArrayList<>();  // ✅ Necessário
   ```

3. ✅ **Sempre use equals() para comparar Wrappers**
   ```java
   Integer a = 200;
   Integer b = 200;
   System.out.println(a.equals(b));  // ✅ true
   ```

4. ⚠️ **Evite autoboxing em loops críticos**
   ```java
   // ❌ Lento
   Integer soma = 0;
   for (int i = 0; i < 1_000_000; i++) {
       soma += i;
   }
   
   // ✅ Rápido
   int soma = 0;
   for (int i = 0; i < 1_000_000; i++) {
       soma += i;
   }
   ```

5. ✅ **Verifique null antes de unboxing**
   ```java
   Integer valor = mapa.get("chave");
   if (valor != null) {
       int i = valor;  // ✅ Seguro
   }
   ```

6. ✅ **Use getOrDefault() em Maps**
   ```java
   int idade = mapa.getOrDefault("idade", 0);  // ✅ Sem NPE
   ```

7. ⚠️ **Nunca use == para comparar Wrappers (exceto cache)**
   ```java
   // ❌ Perigoso (funciona só no cache)
   if (a == b) { ... }
   
   // ✅ Seguro
   if (a.equals(b)) { ... }
   ```

8. ✅ **Documente quando espera null**
   ```java
   /**
    * @param valor Pode ser null (retorna 0 neste caso)
    */
   public int processar(Integer valor) {
       return valor != null ? valor : 0;
   }
   ```

9. ✅ **Prefira primitivos em parâmetros de método quando possível**
   ```java
   // ✅ Preferível (evita null)
   public void processar(int valor) { ... }
   
   // ⚠️ Necessário quando null é válido
   public void processar(Integer valor) { ... }
   ```

10. ✅ **Use `*Value()` explicitamente quando a intenção não for óbvia**
    ```java
    Integer obj = getValor();
    int i = obj.intValue();  // ✅ Explícito
    ```
