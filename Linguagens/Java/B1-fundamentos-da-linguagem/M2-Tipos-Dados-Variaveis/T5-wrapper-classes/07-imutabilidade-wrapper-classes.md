# Imutabilidade das Wrapper Classes

## 🎯 Introdução e Definição

### Definição Conceitual

**Imutabilidade** significa que, uma vez criado um objeto wrapper, seu **valor interno não pode ser alterado**. Qualquer operação que pareça "modificar" o valor na verdade cria um **novo objeto**.

**Wrapper Classes são imutáveis**:
- `Integer`, `Long`, `Short`, `Byte`
- `Float`, `Double`
- `Character`
- `Boolean`

**Implicações**:
- ✅ **Thread-safe**: Seguros para uso concorrente
- ✅ **Cacheable**: Podem ser compartilhados (cache)
- ✅ **Hashable**: Hash não muda (seguros em HashMap/HashSet)
- ⚠️ **Performance**: Criar novos objetos pode ser custoso

**Exemplo**:
```java
Integer num = Integer.valueOf(10);
// num.valor = 20;  // ❌ Impossível! Campo 'value' é final

// "Modificar" cria NOVO objeto
num = num + 5;  // Novo Integer(15) criado
// num original (10) continua existindo (ou é coletado pelo GC)
```

### Características Fundamentais

- 🔒 **Final class**: Não pode ser estendida
- 🔒 **Final field**: Campo `value` é `final` (não pode ser modificado)
- 🎭 **Sem setters**: Nenhum método altera o estado
- 🔄 **Operações criam novos objetos**: `num++` cria novo objeto
- 🧵 **Thread-safe**: Sem race conditions
- 🗝️ **Cacheable**: Objetos podem ser compartilhados

---

## 📋 Sumário Conceitual

### Por Que Imutabilidade?

1. **Segurança**: Valores não mudam inesperadamente
2. **Thread-safety**: Sem sincronização necessária
3. **Caching**: Objetos podem ser reutilizados (cache)
4. **Hashing**: Hash permanece constante (HashMap/HashSet)
5. **Debugging**: Valores não mudam durante debug
6. **Design simplificado**: Menos estados possíveis

### Como Imutabilidade É Garantida

1. **Classe final**: `public final class Integer`
2. **Campo final**: `private final int value;`
3. **Sem setters**: Nenhum método modifica `value`
4. **Construtor privado**: Criação controlada via `valueOf()`

---

## 🧠 Fundamentos Teóricos

### 1. Implementação Interna (Integer)

**Estrutura interna**:
```java
public final class Integer extends Number implements Comparable<Integer> {
    // Campo FINAL (não pode ser modificado)
    private final int value;
    
    // Construtor (deprecated Java 9+)
    @Deprecated
    public Integer(int value) {
        this.value = value;  // Única atribuição
    }
    
    // Método valueOf() (recomendado)
    public static Integer valueOf(int i) {
        if (i >= IntegerCache.low && i <= IntegerCache.high) {
            return IntegerCache.cache[i + (-IntegerCache.low)];
        }
        return new Integer(i);
    }
    
    // Acesso ao valor (somente leitura)
    public int intValue() {
        return value;  // Apenas retorna, nunca modifica
    }
    
    // SEM setters!
    // public void setValue(int newValue) { ... }  // ❌ NÃO EXISTE
}
```

**Características**:
- `final class`: Não pode ser estendida
- `final value`: Valor não pode ser alterado
- Sem métodos que modifiquem `value`

### 2. Operações Criam Novos Objetos

**Toda operação cria novo objeto**:
```java
Integer a = Integer.valueOf(10);
Integer b = a + 5;  // Novo Integer(15) é criado

System.out.println(a);  // 10 (não mudou!)
System.out.println(b);  // 15 (novo objeto)

// a e b são objetos DIFERENTES
System.out.println(a == b);  // false (referências diferentes)
```

**Compilador traduz para**:
```java
Integer a = Integer.valueOf(10);
// a + 5 vira:
// 1. Unboxing: int temp1 = a.intValue();  // 10
// 2. Soma: int temp2 = temp1 + 5;         // 15
// 3. Boxing: Integer b = Integer.valueOf(temp2);  // Novo objeto!
```

### 3. Incremento (++) Cria Novo Objeto

**Incremento primitivo**:
```java
int x = 10;
x++;  // Modifica x diretamente
System.out.println(x);  // 11
```

**Incremento wrapper**:
```java
Integer y = 10;
y++;  // Cria NOVO objeto!

// Compilador traduz para:
// 1. int temp = y.intValue();        // Unboxing
// 2. temp = temp + 1;                // Incremento
// 3. y = Integer.valueOf(temp);      // Boxing (NOVO OBJETO)
```

**Performance**: `y++` cria novo objeto a cada iteração!
```java
// ⚠️ LENTO: cria 1_000_000 objetos!
Integer soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma++;  // Novo Integer a cada iteração
}

// ✅ RÁPIDO: usa primitivo
int somaRapida = 0;
for (int i = 0; i < 1_000_000; i++) {
    somaRapida++;  // Incremento direto
}
```

### 4. Comparação: == vs equals()

**Primitivo**: `==` compara valores.
```java
int a = 10;
int b = 10;
System.out.println(a == b);  // true (valores iguais)
```

**Wrapper**: `==` compara **referências**, `equals()` compara **valores**.
```java
Integer a = 127;
Integer b = 127;
System.out.println(a == b);      // true (cache!)
System.out.println(a.equals(b)); // true (valores iguais)

Integer c = 128;
Integer d = 128;
System.out.println(c == d);      // false ⚠️ (objetos diferentes)
System.out.println(c.equals(d)); // true (valores iguais)
```

**Regra de ouro**: Sempre use `equals()` para wrappers!

### 5. Thread-Safety por Imutabilidade

**Problema com objetos mutáveis**:
```java
public class ContadorMutavel {
    private int valor = 0;  // Mutável
    
    // ❌ Race condition!
    public void incrementar() {
        valor++;  // Não thread-safe!
    }
}

// Múltiplas threads
ContadorMutavel contador = new ContadorMutavel();
Thread t1 = new Thread(() -> contador.incrementar());
Thread t2 = new Thread(() -> contador.incrementar());
t1.start();
t2.start();
// Resultado imprevisível!
```

**Solução com imutabilidade**:
```java
public class ContadorImutavel {
    private final int valor;  // Imutável
    
    public ContadorImutavel(int valor) {
        this.valor = valor;
    }
    
    // Retorna NOVO objeto (thread-safe!)
    public ContadorImutavel incrementar() {
        return new ContadorImutavel(valor + 1);
    }
}

// Thread-safe sem sincronização!
ContadorImutavel c1 = new ContadorImutavel(0);
ContadorImutavel c2 = c1.incrementar();  // Novo objeto
// c1 não muda (thread-safe)
```

### 6. Uso em HashMap/HashSet

**Problema com objetos mutáveis**:
```java
class Ponto {  // ⚠️ Mutável
    int x, y;
    
    public Ponto(int x, int y) { this.x = x; this.y = y; }
    
    @Override
    public int hashCode() { return Objects.hash(x, y); }
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Ponto)) return false;
        Ponto p = (Ponto) obj;
        return x == p.x && y == p.y;
    }
}

Map<Ponto, String> mapa = new HashMap<>();
Ponto p = new Ponto(1, 2);
mapa.put(p, "A");

// ⚠️ Modifica ponto (hash muda!)
p.x = 3;

// ❌ Não encontra mais! Hash mudou
System.out.println(mapa.get(p));  // null ⚠️
```

**Solução com imutabilidade**:
```java
final class PontoImutavel {  // ✅ Imutável
    private final int x, y;
    
    public PontoImutavel(int x, int y) { this.x = x; this.y = y; }
    
    @Override
    public int hashCode() { return Objects.hash(x, y); }
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof PontoImutavel)) return false;
        PontoImutavel p = (PontoImutavel) obj;
        return x == p.x && y == p.y;
    }
}

Map<PontoImutavel, String> mapa = new HashMap<>();
PontoImutavel p = new PontoImutavel(1, 2);
mapa.put(p, "A");

// ✅ Hash nunca muda (imutável)
System.out.println(mapa.get(p));  // "A" ✅
```

### 7. Cache de Valores

**Imutabilidade permite cache** (objetos podem ser compartilhados).

```java
Integer a = Integer.valueOf(100);
Integer b = Integer.valueOf(100);

// MESMO objeto (cache -128 a 127)
System.out.println(a == b);  // true

// Se fosse mutável, compartilhar seria perigoso!
// a.setValue(200);  // ❌ Impossível (imutável)
// System.out.println(b);  // Se mutável, seria 200! (compartilhado)
```

**Mutabilidade impediria cache**:
```java
// Se Integer fosse mutável:
Integer a = Integer.valueOf(100);  // Cache
Integer b = Integer.valueOf(100);  // Mesmo objeto (cache)

a.setValue(200);  // ⚠️ Modificaria objeto compartilhado!
System.out.println(b);  // 200 ⚠️ (efeito colateral!)
```

---

## 🔍 Análise Conceitual Profunda

### Imutabilidade vs Performance

**Vantagens**:
- ✅ Thread-safe (sem locks)
- ✅ Cacheable (economia de memória)
- ✅ Hashable (seguro em coleções)
- ✅ Simples (menos estados)

**Desvantagens**:
- ⚠️ Criar objetos é custoso (heap allocation)
- ⚠️ Garbage Collection (muitos objetos temporários)
- ⚠️ Loops com wrappers são lentos (`i++` cria novo objeto)

**Quando preferir primitivos**:
```java
// ❌ Lento (cria 1_000_000 objetos)
Integer soma = 0;
for (Integer i = 0; i < 1_000_000; i++) {
    soma += i;
}

// ✅ Rápido (primitivos mutáveis)
int somaRapida = 0;
for (int i = 0; i < 1_000_000; i++) {
    somaRapida += i;
}
```

### Padrão de Design: Immutable Object

**Características de um objeto imutável**:
1. **Classe final**: Não pode ser estendida
2. **Campos final**: Não podem ser modificados
3. **Sem setters**: Nenhum método altera estado
4. **Deep immutability**: Campos de referência também imutáveis
5. **Cópia defensiva**: Construtor copia arrays/collections

**Exemplo**:
```java
public final class PessoaImutavel {
    private final String nome;
    private final int idade;
    private final List<String> hobbies;
    
    public PessoaImutavel(String nome, int idade, List<String> hobbies) {
        this.nome = nome;
        this.idade = idade;
        // Cópia defensiva (evita modificação externa)
        this.hobbies = List.copyOf(hobbies);  // Java 10+
    }
    
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
    public List<String> getHobbies() {
        return hobbies;  // Já é imutável (List.copyOf)
    }
    
    // Sem setters!
}
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Uso em Collections (Thread-Safe)

```java
import java.util.*;
import java.util.concurrent.*;

public class MapaConcorrente {
    // Thread-safe por imutabilidade
    private final Map<Integer, String> mapa = new ConcurrentHashMap<>();
    
    public void adicionar(int chave, String valor) {
        mapa.put(chave, valor);  // Integer é imutável (safe)
    }
    
    public void exemplo() {
        ExecutorService executor = Executors.newFixedThreadPool(10);
        
        // Múltiplas threads adicionando
        for (int i = 0; i < 100; i++) {
            int valor = i;
            executor.submit(() -> adicionar(valor, "Item " + valor));
        }
        
        executor.shutdown();
        // Thread-safe (Integer imutável)
    }
}
```

### Caso 2: Caching de Objetos

```java
public class CacheNumeros {
    // Cache de valores calculados
    private final Map<Integer, Double> cacheRaizQuadrada = new HashMap<>();
    
    public Double raizQuadrada(Integer num) {
        // Integer é imutável (seguro como chave)
        return cacheRaizQuadrada.computeIfAbsent(num, n -> Math.sqrt(n));
    }
    
    public void exemplo() {
        System.out.println(raizQuadrada(25));  // Calcula: 5.0
        System.out.println(raizQuadrada(25));  // Cache: 5.0 (não recalcula)
    }
}
```

### Caso 3: Constantes

```java
public class Constantes {
    // Imutabilidade garante que valores não mudam
    public static final Integer MAX_TENTATIVAS = 3;
    public static final Double TAXA_CONVERSAO = 5.5;
    public static final Boolean DEBUG_MODE = false;
    
    // Se fosse mutável:
    // MAX_TENTATIVAS.setValue(10);  // ❌ Impossível (imutável)
}
```

### Caso 4: Método Retorna Valor Sem Efeito Colateral

```java
public class Calculadora {
    public Integer somar(Integer a, Integer b) {
        // Retorna NOVO objeto (a e b não mudam)
        return Integer.valueOf(a + b);
    }
    
    public void exemplo() {
        Integer x = 10;
        Integer y = 20;
        Integer resultado = somar(x, y);
        
        System.out.println(x);  // 10 (não mudou!)
        System.out.println(y);  // 20 (não mudou!)
        System.out.println(resultado);  // 30 (novo objeto)
    }
}
```

### Caso 5: Debugging Simplificado

```java
public class Debug {
    public void exemplo() {
        Integer num = 100;
        System.out.println("Antes: " + num);  // 100
        
        processar(num);
        
        System.out.println("Depois: " + num);  // 100 (não mudou!)
        // Imutabilidade garante que num não muda
    }
    
    public void processar(Integer valor) {
        valor = valor + 50;  // Novo objeto (não afeta original)
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Performance em Loops

**Problema**: Criar muitos objetos.
```java
Integer soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // ⚠️ 1_000_000 objetos criados!
}
```

**Solução**: Usar primitivos.
```java
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // ✅ Rápido
}
```

### 2. Comparação com ==

**Problema**: `==` compara referências.
```java
Integer a = 200;
Integer b = 200;
System.out.println(a == b);  // false ⚠️
```

**Solução**: Use `equals()`.
```java
System.out.println(a.equals(b));  // true ✅
```

### 3. Garbage Collection

**Problema**: Muitos objetos temporários.
```java
Integer total = 0;
for (int i = 0; i < 1000; i++) {
    Integer temp = Integer.valueOf(i);
    total = total + temp;  // Novos objetos a cada iteração
}
// GC precisa coletar ~1000 objetos
```

**Solução**: Minimizar criação de objetos.
```java
int total = 0;
for (int i = 0; i < 1000; i++) {
    total += i;  // Sem objetos temporários
}
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Cache de Valores**: Imutabilidade permite compartilhamento
- **Thread-Safety**: Sem race conditions
- **HashMap/HashSet**: Hash constante
- **Autoboxing/Unboxing**: Cria novos objetos
- **Performance**: Trade-off entre segurança e velocidade

---

## 🚀 Boas Práticas

1. ✅ **Use primitivos em loops intensivos**
   ```java
   int soma = 0;
   for (int i = 0; i < 1_000_000; i++) { soma += i; }
   ```

2. ✅ **Use wrappers quando imutabilidade/null é necessária**
   ```java
   Integer idade = null;  // "Não informado"
   ```

3. ✅ **Sempre use equals() para comparar wrappers**
   ```java
   if (num1.equals(num2)) { /* ... */ }
   ```

4. ✅ **Aproveite cache quando possível**
   ```java
   Integer a = Integer.valueOf(100);  // Cache
   ```

5. ✅ **Entenda que operações criam novos objetos**
   ```java
   Integer x = 10;
   x = x + 5;  // Novo objeto criado
   ```

6. ✅ **Use wrappers como chaves em HashMap/HashSet**
   ```java
   Map<Integer, String> mapa = new HashMap<>();
   ```

7. ⚠️ **Evite incremento de wrappers em loops**
   ```java
   // ❌ Lento
   Integer i = 0;
   while (i < 1000) { i++; }
   
   // ✅ Rápido
   int i = 0;
   while (i < 1000) { i++; }
   ```

8. ✅ **Aproveite thread-safety da imutabilidade**
   ```java
   // Thread-safe sem sincronização
   Map<Integer, String> mapa = new ConcurrentHashMap<>();
   ```
