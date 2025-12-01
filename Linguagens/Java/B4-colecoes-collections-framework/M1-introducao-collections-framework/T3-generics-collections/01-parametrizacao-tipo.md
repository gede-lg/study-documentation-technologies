# T3.01 - Parametrização de Tipo

## Introdução

**Generics**: parametrizar coleções com **tipo específico** (E, T, K, V).

```java
import java.util.*;

// ❌ SEM Generics (Java 1.4)
public class SemGenerics {
    public static void main(String[] args) {
        List lista = new ArrayList();  // Raw type
        lista.add("Java");
        lista.add(123);  // Aceita QUALQUER tipo
        
        String texto = (String) lista.get(0);  // Cast necessário
    }
}

// ✅ COM Generics (Java 5+)
public class ComGenerics {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<String>();  // Parametrizado
        lista.add("Java");
        // lista.add(123);  // ERRO compilação
        
        String texto = lista.get(0);  // Sem cast
    }
}
```

**Regra**: Generics definem **tipo** em tempo de compilação. Segurança e sem cast.

---

## Fundamentos

### 1. Sintaxe Básica

```java
// ✅ Sintaxe Generics
public class SintaxeGenerics {
    public static void main(String[] args) {
        // ✅ List<E> - E é tipo parâmetro
        List<String> strings = new ArrayList<String>();
        List<Integer> numeros = new ArrayList<Integer>();
        
        // ✅ Set<E>
        Set<String> conjunto = new HashSet<String>();
        
        // ✅ Map<K, V> - K chave, V valor
        Map<String, Integer> mapa = new HashMap<String, Integer>();
        
        // ✅ Queue<E>
        Queue<String> fila = new LinkedList<String>();
    }
}

/*
 * SINTAXE:
 * 
 * Interface/Classe<TipoParametro>
 * 
 * PARÂMETROS COMUNS:
 * E - Element (elemento)
 * T - Type (tipo)
 * K - Key (chave)
 * V - Value (valor)
 * N - Number (número)
 * 
 * EXEMPLOS:
 * List<E>
 * Set<E>
 * Map<K, V>
 * Collection<E>
 */
```

**Sintaxe**: Interface<TipoParametro>. E=elemento, T=tipo, K=chave, V=valor.

### 2. Parametrização com Tipos Primitivos

```java
// ❌ Tipos primitivos NÃO permitidos
public class TiposPrimitivos {
    public static void main(String[] args) {
        // ❌ ERRO: int é primitivo
        // List<int> numeros = new ArrayList<int>();
        
        // ✅ Usar WRAPPER classes
        List<Integer> inteiros = new ArrayList<Integer>();
        List<Double> doubles = new ArrayList<Double>();
        List<Boolean> booleanos = new ArrayList<Boolean>();
        List<Character> chars = new ArrayList<Character>();
        
        // ✅ Autoboxing/Unboxing (automático)
        inteiros.add(10);  // int → Integer (autoboxing)
        int valor = inteiros.get(0);  // Integer → int (unboxing)
        
        System.out.println(valor);  // 10
    }
}

/*
 * TIPOS PRIMITIVOS:
 * 
 * NÃO PERMITIDOS:
 * List<int>     ❌
 * Set<double>   ❌
 * Map<int, int> ❌
 * 
 * USAR WRAPPERS:
 * List<Integer>        ✅
 * Set<Double>          ✅
 * Map<Integer, String> ✅
 * 
 * WRAPPER CLASSES:
 * int     → Integer
 * double  → Double
 * boolean → Boolean
 * char    → Character
 * long    → Long
 * float   → Float
 * byte    → Byte
 * short   → Short
 * 
 * AUTOBOXING/UNBOXING:
 * - Java converte automaticamente
 * - int ↔ Integer
 * - double ↔ Double
 */
```

**Primitivos**: usar **wrappers** (Integer, Double). Autoboxing/unboxing automático.

### 3. Parametrização Múltipla

```java
// ✅ Múltiplos parâmetros de tipo
public class ParametrizacaoMultipla {
    public static void main(String[] args) {
        // ✅ Map<K, V> - dois parâmetros
        Map<String, Integer> idades = new HashMap<String, Integer>();
        idades.put("Ana", 25);
        idades.put("Bruno", 30);
        
        // ✅ Map<String, List<String>> - aninhado
        Map<String, List<String>> grupos = new HashMap<String, List<String>>();
        
        List<String> grupo1 = new ArrayList<String>();
        grupo1.add("Ana");
        grupo1.add("Bruno");
        
        grupos.put("Equipe A", grupo1);
        
        // ✅ Map<Integer, Map<String, Double>>
        Map<Integer, Map<String, Double>> notas = new HashMap<>();
        
        Map<String, Double> materia = new HashMap<>();
        materia.put("Java", 9.5);
        materia.put("Python", 8.0);
        
        notas.put(1, materia);
    }
}

/*
 * PARAMETRIZAÇÃO MÚLTIPLA:
 * 
 * Map<K, V>:
 * - K: tipo da chave
 * - V: tipo do valor
 * 
 * ANINHAMENTO:
 * List<List<String>>
 * Map<String, List<Integer>>
 * Map<Integer, Map<String, Double>>
 * 
 * PROFUNDIDADE:
 * - Sem limite teórico
 * - Manter SIMPLES (legibilidade)
 */
```

**Múltiplos**: Map<K, V> dois parâmetros. Aninhamento permitido.

### 4. Parâmetros de Tipo Comuns

```java
// ✅ Parâmetros de tipo por convenção
public class ParametrosTipoComuns {
    public static void main(String[] args) {
        // ✅ E - Element
        List<String> lista = new ArrayList<String>();
        Set<Integer> conjunto = new HashSet<Integer>();
        
        // ✅ T - Type
        class Caixa<T> {
            private T conteudo;
            
            public void set(T conteudo) {
                this.conteudo = conteudo;
            }
            
            public T get() {
                return conteudo;
            }
        }
        
        Caixa<String> caixaString = new Caixa<String>();
        caixaString.set("Java");
        
        // ✅ K, V - Key, Value
        Map<String, Integer> mapa = new HashMap<String, Integer>();
        
        // ✅ N - Number
        class Calculadora<N extends Number> {
            public double somar(N a, N b) {
                return a.doubleValue() + b.doubleValue();
            }
        }
        
        Calculadora<Integer> calc = new Calculadora<Integer>();
        double resultado = calc.somar(10, 20);
        System.out.println(resultado);  // 30.0
    }
}

/*
 * CONVENÇÕES:
 * 
 * E - Element (Collection<E>, List<E>, Set<E>)
 * T - Type (genérico, qualquer tipo)
 * K - Key (Map<K, V>)
 * V - Value (Map<K, V>)
 * N - Number (Number e subclasses)
 * R - Return (tipo de retorno)
 * 
 * USAR:
 * - Letras MAIÚSCULAS
 * - ÚNICA letra (ou palavra curta)
 * - Convenções ajudam LEGIBILIDADE
 */
```

**Convenções**: E=element, T=type, K=key, V=value, N=number. Maiúsculas.

### 5. Vantagens Generics

```java
// ✅ Vantagens de usar Generics
public class VantagensGenerics {
    
    // ❌ SEM Generics
    public static void semGenerics() {
        List lista = new ArrayList();
        lista.add("Java");
        lista.add(123);  // Aceita qualquer tipo
        
        // ❌ Erro em RUNTIME
        for (Object obj : lista) {
            String texto = (String) obj;  // ClassCastException em 123
            System.out.println(texto.toUpperCase());
        }
    }
    
    // ✅ COM Generics
    public static void comGenerics() {
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        // lista.add(123);  // ✅ ERRO COMPILAÇÃO (detectado cedo)
        
        // ✅ Sem cast, seguro
        for (String texto : lista) {
            System.out.println(texto.toUpperCase());
        }
    }
    
    public static void main(String[] args) {
        comGenerics();
    }
}

/*
 * VANTAGENS GENERICS:
 * 
 * 1. TYPE SAFETY:
 *    - Erros detectados em COMPILAÇÃO
 *    - Não em RUNTIME
 *    - Evita ClassCastException
 * 
 * 2. ELIMINA CASTING:
 *    - Sem (String) cast
 *    - Código mais LIMPO
 *    - Menos verbose
 * 
 * 3. CÓDIGO REUTILIZÁVEL:
 *    - Mesma classe para VÁRIOS tipos
 *    - List<String>, List<Integer>
 * 
 * 4. LEGIBILIDADE:
 *    - Tipo explícito
 *    - Intenção CLARA
 *    - List<String> vs List (raw)
 * 
 * 5. PERFORMANCE:
 *    - Sem overhead runtime
 *    - Type erasure (remoção tempo compilação)
 */
```

**Vantagens**: type safety, elimina cast, reutilizável, legível, sem overhead.

### 6. Type Erasure

```java
// ✅ Type Erasure
public class TypeErasure {
    public static void main(String[] args) {
        List<String> strings = new ArrayList<String>();
        List<Integer> inteiros = new ArrayList<Integer>();
        
        // ✅ Em COMPILAÇÃO: tipos verificados
        strings.add("Java");
        inteiros.add(10);
        
        // ✅ Em RUNTIME: tipos REMOVIDOS (erasure)
        // Ambas viram List (raw type)
        
        // ❌ Não pode verificar tipo genérico em runtime
        // if (strings instanceof List<String>) { }  // ERRO
        
        // ✅ Pode verificar tipo raw
        if (strings instanceof List) {
            System.out.println("É uma List");
        }
        
        // ✅ getClass() retorna MESMO tipo
        System.out.println(strings.getClass());   // class java.util.ArrayList
        System.out.println(inteiros.getClass());  // class java.util.ArrayList
        
        // Mesmo .class em runtime
        System.out.println(strings.getClass() == inteiros.getClass());  // true
    }
}

/*
 * TYPE ERASURE:
 * 
 * COMPILAÇÃO:
 * - Tipos genéricos VERIFICADOS
 * - Type safety garantido
 * 
 * RUNTIME:
 * - Tipos genéricos REMOVIDOS
 * - List<String> vira List
 * - Compatibilidade Java 1.4
 * 
 * IMPLICAÇÕES:
 * - Não pode instanceof com generics
 * - Não pode new T[]
 * - Reflection limitada
 * 
 * VANTAGEM:
 * - Sem overhead runtime
 * - Compatibilidade retroativa
 */
```

**Type Erasure**: tipos removidos em runtime. Verificação apenas compilação.

### 7. Exemplos Práticos

```java
// ✅ Exemplos práticos
public class ExemplosPraticos {
    
    // ✅ Exemplo 1: Lista de tarefas
    public static void listaTarefas() {
        List<String> tarefas = new ArrayList<String>();
        tarefas.add("Estudar Java");
        tarefas.add("Fazer exercícios");
        tarefas.add("Revisar código");
        
        for (String tarefa : tarefas) {
            System.out.println("- " + tarefa);
        }
    }
    
    // ✅ Exemplo 2: Cadastro de idades
    public static void cadastroIdades() {
        Map<String, Integer> idades = new HashMap<String, Integer>();
        idades.put("Ana", 25);
        idades.put("Bruno", 30);
        idades.put("Carlos", 28);
        
        for (Map.Entry<String, Integer> entry : idades.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue() + " anos");
        }
    }
    
    // ✅ Exemplo 3: Conjunto de tags únicas
    public static void tagsUnicas() {
        Set<String> tags = new HashSet<String>();
        tags.add("java");
        tags.add("python");
        tags.add("java");  // Duplicata ignorada
        
        System.out.println("Tags: " + tags);  // [java, python]
    }
    
    // ✅ Exemplo 4: Fila de processamento
    public static void filaProcessamento() {
        Queue<String> fila = new LinkedList<String>();
        fila.offer("Tarefa 1");
        fila.offer("Tarefa 2");
        fila.offer("Tarefa 3");
        
        while (!fila.isEmpty()) {
            String tarefa = fila.poll();
            System.out.println("Processando: " + tarefa);
        }
    }
    
    public static void main(String[] args) {
        listaTarefas();
        System.out.println();
        cadastroIdades();
        System.out.println();
        tagsUnicas();
        System.out.println();
        filaProcessamento();
    }
}
```

**Exemplos**: lista tarefas, cadastro idades, tags únicas, fila processamento.

### 8. Resumo Visual

```java
/*
 * PARAMETRIZAÇÃO DE TIPO
 * 
 * SINTAXE:
 * Collection<TipoParametro>
 * 
 * EXEMPLOS:
 * List<String>
 * Set<Integer>
 * Map<String, Integer>
 * Queue<Double>
 * 
 * PARÂMETROS COMUNS:
 * E - Element
 * T - Type
 * K - Key
 * V - Value
 * N - Number
 * 
 * TIPOS PRIMITIVOS:
 * ❌ List<int>
 * ✅ List<Integer>
 * 
 * Autoboxing/Unboxing automático
 * 
 * MÚLTIPLOS PARÂMETROS:
 * Map<K, V>
 * Map<String, List<Integer>>
 * 
 * VANTAGENS:
 * 1. Type safety (erros em compilação)
 * 2. Elimina casting
 * 3. Código reutilizável
 * 4. Legibilidade
 * 5. Sem overhead runtime
 * 
 * TYPE ERASURE:
 * - Tipos removidos em runtime
 * - List<String> vira List
 * - Verificação apenas compilação
 */

public class ExemploParametrizacao {
    public static void main(String[] args) {
        // ✅ Parametrizado
        List<String> strings = new ArrayList<String>();
        strings.add("Java");
        
        String valor = strings.get(0);  // Sem cast
        System.out.println(valor);
    }
}
```

---

## Aplicabilidade

**Generics**:
- **Type safety**: erros em compilação
- **Eliminar** casting
- **Reutilizar** código (vários tipos)
- **Legibilidade**: tipo explícito

**Quando usar**:
- **Sempre** em coleções
- APIs que trabalham com **vários** tipos
- Classes **container** (Caixa<T>)

---

## Armadilhas

### 1. Raw Types

```java
// ❌ Evitar raw types
List lista = new ArrayList();  // Sem tipo

// ✅ Sempre parametrizar
List<String> lista = new ArrayList<String>();
```

### 2. Primitivos

```java
// ❌ Primitivos não permitidos
// List<int> numeros = new ArrayList<int>();

// ✅ Usar wrappers
List<Integer> numeros = new ArrayList<Integer>();
```

---

## Boas Práticas

### 1. Sempre Parametrizar

```java
// ✅ Sempre especificar tipo
List<String> lista = new ArrayList<String>();

// ❌ Evitar raw type
List lista = new ArrayList();
```

### 2. Usar Convenções

```java
// ✅ E para elemento, K/V para chave/valor
List<E>
Map<K, V>
```

### 3. Preferir Interfaces

```java
// ✅ Interface como tipo
List<String> lista = new ArrayList<String>();

// ❌ Implementação concreta
ArrayList<String> lista = new ArrayList<String>();
```

---

## Resumo

**Parametrização**:
- Define **tipo** em tempo de compilação
- Sintaxe: Collection<**Tipo**>
- Parâmetros: E, T, K, V, N

**Sintaxe**:
- List<String>, Set<Integer>
- Map<String, Integer> (múltiplos)
- Map<String, List<Integer>> (aninhado)

**Primitivos**:
- **Não** permitidos (List<int> ❌)
- Usar **wrappers** (List<Integer> ✅)
- Autoboxing/unboxing **automático**

**Vantagens**:
- **Type safety**: erros compilação
- **Elimina** casting
- Código **reutilizável**
- Mais **legível**
- Sem **overhead** runtime

**Type Erasure**:
- Tipos **removidos** em runtime
- List<String> vira List
- Verificação apenas **compilação**
- Compatibilidade Java 1.4

**Convenções**:
- E = element
- T = type
- K = key
- V = value
- N = number

**Regra de Ouro**: Sempre parametrizar coleções tipo específico type safety erros compilação não runtime. Usar wrappers primitivos Integer Double autoboxing automático. Convenções E element T type K key V value maiúsculas. Type erasure remove tipos runtime verificação compilação. Preferir interfaces List não ArrayList. Evitar raw types sempre especificar tipo.

