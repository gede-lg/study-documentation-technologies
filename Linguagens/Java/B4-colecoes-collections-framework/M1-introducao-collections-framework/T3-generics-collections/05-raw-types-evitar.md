# T3.05 - Raw Types (evitar)

## Introdução

**Raw type**: coleção **sem** parametrização. List lista (sem <String>). **Evitar**: perde type safety.

```java
import java.util.*;

// ❌ Raw type (evitar)
public class RawTypeProblema {
    public static void main(String[] args) {
        // ❌ SEM parametrização
        List lista = new ArrayList();
        
        lista.add("Texto");
        lista.add(10);          // Aceita qualquer tipo
        lista.add(true);
        
        // PROBLEMA: cast necessário
        String texto = (String) lista.get(0);
        
        // ❌ ClassCastException em RUNTIME
        // String numero = (String) lista.get(1);  // ERRO RUNTIME
    }
}

// ✅ Com generics (correto)
public class ComGenerics {
    public static void main(String[] args) {
        // ✅ COM parametrização
        List<String> lista = new ArrayList<String>();
        
        lista.add("Texto");
        // lista.add(10);       // ERRO COMPILAÇÃO
        
        // SEM cast
        String texto = lista.get(0);
    }
}
```

**Raw type**: List lista. **Problema**: aceita qualquer tipo, cast, erro runtime. **Solução**: sempre parametrizar.

---

## Fundamentos

### 1. O que é Raw Type

```java
// ❌ Raw types (sem generics)
public class RawTypes {
    public static void main(String[] args) {
        // ❌ List raw type
        List lista = new ArrayList();
        
        // ❌ Set raw type
        Set conjunto = new HashSet();
        
        // ❌ Map raw type
        Map mapa = new HashMap();
        
        // ❌ Queue raw type
        Queue fila = new LinkedList();
        
        // PROBLEMA: TODOS aceitam qualquer tipo
        lista.add("String");
        lista.add(10);
        lista.add(true);
        lista.add(new Object());
    }
}

/*
 * RAW TYPE:
 * 
 * Coleção SEM parametrização:
 * List lista       (raw)
 * Set conjunto     (raw)
 * Map mapa         (raw)
 * 
 * VERSUS
 * 
 * Com generics:
 * List<String> lista       (parametrizado)
 * Set<Integer> conjunto    (parametrizado)
 * Map<String, Integer> mapa (parametrizado)
 * 
 * Raw type = coleção sem tipo específico
 */
```

**Raw type**: coleção **sem** <Tipo>. List lista. Aceita **qualquer** tipo.

### 2. Problemas Raw Types

```java
// ❌ Problemas raw types
public class ProblemasRawType {
    public static void main(String[] args) {
        // ❌ PROBLEMA 1: Aceita qualquer tipo
        List lista = new ArrayList();
        lista.add("String");
        lista.add(10);
        lista.add(true);
        lista.add(new Object());
        // Não há controle tipo
        
        // ❌ PROBLEMA 2: Cast obrigatório
        String texto = (String) lista.get(0);
        Integer numero = (Integer) lista.get(1);
        Boolean flag = (Boolean) lista.get(2);
        // Código verbose
        
        // ❌ PROBLEMA 3: ClassCastException RUNTIME
        try {
            String erro = (String) lista.get(1);  // Espera String, recebe Integer
        } catch (ClassCastException e) {
            System.out.println("ERRO RUNTIME: " + e.getMessage());
        }
        // Erro só descoberto quando executar
        
        // ❌ PROBLEMA 4: Sem IDE support
        // lista.get(0).  // Autocomplete retorna apenas métodos Object
        // Não sabe tipo real
    }
}

/*
 * PROBLEMAS RAW TYPE:
 * 
 * 1. TYPE SAFETY PERDIDO:
 *    - Aceita qualquer tipo
 *    - Sem verificação compilação
 * 
 * 2. CAST OBRIGATÓRIO:
 *    - get() retorna Object
 *    - Cast manual necessário
 *    - Código verbose
 * 
 * 3. CLASSCASTEXCEPTION:
 *    - Erro RUNTIME
 *    - Não detectado compilação
 *    - Pode crashar produção
 * 
 * 4. IDE LIMITADO:
 *    - Sem autocomplete
 *    - Sem detecção erros
 */
```

**Problemas**: aceita qualquer, cast obrigatório, erro runtime, IDE limitado.

### 3. Comparação Raw vs Generics

```java
// ❌ SEM generics (raw type)
public class SemGenerics {
    public static void main(String[] args) {
        List lista = new ArrayList();
        
        lista.add("Ana");
        lista.add("Bruno");
        
        // Cast obrigatório
        String nome1 = (String) lista.get(0);
        String nome2 = (String) lista.get(1);
        
        // Iteração: cast cada elemento
        for (Object obj : lista) {
            String nome = (String) obj;
            System.out.println(nome);
        }
    }
}

// ✅ COM generics (correto)
public class ComGenerics {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<String>();
        
        lista.add("Ana");
        lista.add("Bruno");
        
        // SEM cast
        String nome1 = lista.get(0);
        String nome2 = lista.get(1);
        
        // Iteração: sem cast
        for (String nome : lista) {
            System.out.println(nome);
        }
    }
}

/*
 * COMPARAÇÃO:
 * 
 * RAW TYPE:
 * - 2+ casts
 * - Verbose
 * - Risco ClassCastException
 * 
 * GENERICS:
 * - 0 casts
 * - Limpo
 * - Type safety
 */
```

**Comparação**: raw type casts verbose erro, generics sem cast limpo seguro.

### 4. Type Safety Perdido

```java
// ❌ Raw type: type safety perdido
public class TypeSafetyPerdido {
    public static void main(String[] args) {
        // ❌ Raw type
        List lista = new ArrayList();
        
        // ACEITA QUALQUER TIPO
        lista.add("String");      // OK
        lista.add(10);            // OK
        lista.add(true);          // OK
        lista.add(10.5);          // OK
        lista.add(new Object());  // OK
        
        // PROBLEMA: tipo inconsistente
        // Lista deveria ser apenas String
        // Mas aceita Integer, Boolean, Double, Object
        
        // ERRO RUNTIME
        for (Object obj : lista) {
            String texto = (String) obj;  // ClassCastException
        }
    }
}

// ✅ Generics: type safety garantido
public class TypeSafetyGarantido {
    public static void main(String[] args) {
        // ✅ Generics
        List<String> lista = new ArrayList<String>();
        
        // ACEITA APENAS String
        lista.add("String");      // OK
        // lista.add(10);         // ERRO COMPILAÇÃO
        // lista.add(true);       // ERRO COMPILAÇÃO
        // lista.add(10.5);       // ERRO COMPILAÇÃO
        // lista.add(new Object()); // ERRO COMPILAÇÃO
        
        // SEM ERRO RUNTIME
        for (String texto : lista) {
            System.out.println(texto);
        }
    }
}
```

**Type safety**: raw type aceita qualquer erro runtime, generics aceita apenas tipo garantido.

### 5. Raw Type em Métodos

```java
// ❌ Método raw type
public class MetodoRawType {
    // ❌ Parâmetro raw type
    public static void processar(List lista) {
        // Aceita List<String>, List<Integer>, List<Object>
        // SEM type safety
        
        for (Object obj : lista) {
            // obj é Object
            // Precisa cast para usar
        }
    }
    
    // ❌ Retorno raw type
    public static List criar() {
        List lista = new ArrayList();
        lista.add("Texto");
        return lista;
        // Quem chamar não sabe tipo
    }
    
    public static void main(String[] args) {
        List lista1 = new ArrayList();
        lista1.add("String");
        processar(lista1);
        
        List lista2 = criar();
        // String texto = lista2.get(0);  // ERRO: incompatible types
        String texto = (String) lista2.get(0);  // Cast necessário
    }
}

// ✅ Método com generics
public class MetodoGenerics {
    // ✅ Parâmetro genérico
    public static void processar(List<String> lista) {
        // Aceita APENAS List<String>
        // Type safety garantido
        
        for (String texto : lista) {
            // texto é String
            // Sem cast
        }
    }
    
    // ✅ Retorno genérico
    public static List<String> criar() {
        List<String> lista = new ArrayList<String>();
        lista.add("Texto");
        return lista;
    }
    
    public static void main(String[] args) {
        List<String> lista1 = new ArrayList<String>();
        lista1.add("String");
        processar(lista1);
        
        List<String> lista2 = criar();
        String texto = lista2.get(0);  // Sem cast
    }
}
```

**Métodos**: raw type aceita qualquer cast, generics tipo específico sem cast.

### 6. Warning Raw Types

```java
// ❌ Compilador avisa raw type
public class WarningRawType {
    public static void main(String[] args) {
        // ❌ WARNING: unchecked or unsafe operations
        List lista = new ArrayList();
        lista.add("Texto");
        
        // Compilador avisa:
        // "Note: RawTypeExemplo.java uses unchecked or unsafe operations."
        // "Note: Recompile with -Xlint:unchecked for details."
    }
}

// ✅ Sem warning
public class SemWarning {
    public static void main(String[] args) {
        // ✅ SEM warning
        List<String> lista = new ArrayList<String>();
        lista.add("Texto");
        
        // Compilador não avisa
    }
}

/*
 * WARNING:
 * 
 * Raw type gera warning compilação:
 * "unchecked or unsafe operations"
 * 
 * Indica:
 * - Operação não type-safe
 * - Possível erro runtime
 * - Deve parametrizar
 */
```

**Warning**: compilador avisa raw type "unchecked unsafe operations". Indica não type-safe.

### 7. Quando Raw Types Existem

```java
// Raw types: compatibilidade Java 1.4
public class RawTypesHistorico {
    public static void main(String[] args) {
        // JAVA 1.4 (antes generics):
        // List lista = new ArrayList();
        // ÚNICO jeito criar coleções
        
        // JAVA 5+ (generics adicionados):
        // List<String> lista = new ArrayList<String>();
        // Recomendado
        
        // Raw types mantidos para:
        // - Compatibilidade código legado
        // - Código antigo funcionar
        
        // EVITAR raw types:
        // - Código novo
        // - APIs modernas
    }
}

/*
 * HISTÓRICO:
 * 
 * JAVA 1.4:
 * - Sem generics
 * - Apenas raw types
 * - List lista = new ArrayList();
 * 
 * JAVA 5+ (2004):
 * - Generics adicionados
 * - List<String> lista = new ArrayList<String>();
 * - Raw types mantidos compatibilidade
 * 
 * HOJE:
 * - Evitar raw types
 * - Sempre usar generics
 */
```

**Histórico**: raw types Java 1.4 compatibilidade. Java 5+ generics adicionados. Evitar raw types código novo.

### 8. Resumo Visual

```java
/*
 * RAW TYPES (EVITAR)
 * 
 * O QUE É:
 * Coleção SEM parametrização
 * List lista       ❌
 * Set conjunto     ❌
 * Map mapa         ❌
 * 
 * VERSUS
 * 
 * List<String> lista       ✅
 * Set<Integer> conjunto    ✅
 * Map<String, Integer> mapa ✅
 * 
 * PROBLEMAS RAW TYPE:
 * 
 * 1. TYPE SAFETY PERDIDO:
 *    - Aceita qualquer tipo
 *    - List lista pode ter String, Integer, Object
 * 
 * 2. CAST OBRIGATÓRIO:
 *    - get() retorna Object
 *    - String texto = (String) lista.get(0);
 *    - Verbose
 * 
 * 3. CLASSCASEXCEPTION RUNTIME:
 *    - Erro não detectado compilação
 *    - Descoberto quando executar
 *    - Pode crashar produção
 * 
 * 4. IDE LIMITADO:
 *    - Sem autocomplete
 *    - Sem detecção erros
 *    - Apenas métodos Object
 * 
 * 5. WARNING COMPILAÇÃO:
 *    - "unchecked or unsafe operations"
 *    - Indica operação não type-safe
 * 
 * COMPARAÇÃO:
 * 
 * ❌ RAW TYPE:
 * List lista = new ArrayList();
 * lista.add("String");
 * lista.add(10);
 * String texto = (String) lista.get(0);  // Cast
 * String erro = (String) lista.get(1);   // ClassCastException
 * 
 * ✅ GENERICS:
 * List<String> lista = new ArrayList<String>();
 * lista.add("String");
 * // lista.add(10);  // ERRO COMPILAÇÃO
 * String texto = lista.get(0);  // Sem cast
 * 
 * HISTÓRICO:
 * Java 1.4: apenas raw types
 * Java 5+: generics adicionados
 * Hoje: evitar raw types
 * 
 * REGRA:
 * SEMPRE parametrizar coleções
 * EVITAR raw types
 */

// ❌ EVITAR
public class Evitar {
    public static void main(String[] args) {
        List lista = new ArrayList();
    }
}

// ✅ USAR
public class Usar {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<String>();
    }
}
```

---

## Aplicabilidade

**Raw types**:
- **Evitar** sempre
- **Compatibilidade** código legado Java 1.4
- **Migração** gradual código antigo

**Generics**:
- **Usar** sempre código novo
- **APIs** modernas
- **Type safety** garantido

---

## Armadilhas

### 1. Aceita Qualquer Tipo

```java
// ❌ Raw type aceita qualquer
List lista = new ArrayList();
lista.add("String");
lista.add(10);
lista.add(true);
// Type safety perdido
```

### 2. Cast Obrigatório

```java
// ❌ Cast necessário
List lista = new ArrayList();
lista.add("Texto");
String texto = (String) lista.get(0);  // Cast
```

### 3. ClassCastException Runtime

```java
// ❌ Erro runtime
List lista = new ArrayList();
lista.add(10);
String texto = (String) lista.get(0);  // ClassCastException
```

### 4. Warning Compilação

```java
// ❌ Warning "unchecked"
List lista = new ArrayList();
lista.add("Texto");
// Warning: unchecked or unsafe operations
```

---

## Boas Práticas

### 1. Sempre Parametrizar

```java
// ✅ SEMPRE parametrizar
List<String> lista = new ArrayList<String>();

// ❌ NUNCA raw type
List lista = new ArrayList();
```

### 2. Migrar Código Legado

```java
// ❌ Código legado
List lista = new ArrayList();

// ✅ Migrar para generics
List<String> lista = new ArrayList<String>();
```

### 3. Métodos Genéricos

```java
// ✅ Parâmetro genérico
public static void processar(List<String> lista) { }

// ❌ Parâmetro raw type
public static void processar(List lista) { }
```

---

## Resumo

**Raw type**:
- Coleção **sem** parametrização
- List lista (sem <Tipo>)
- **Evitar**: perde type safety

**Problemas**:
- **Aceita** qualquer tipo (inconsistente)
- **Cast** obrigatório (verbose)
- **ClassCastException** runtime (não compilação)
- **IDE** limitado (sem autocomplete)
- **Warning** compilação (unchecked)

**Comparação**:
- **Raw**: List lista, aceita qualquer, cast, erro runtime
- **Generics**: List<String> lista, aceita String, sem cast, erro compilação

**Histórico**:
- **Java 1.4**: apenas raw types
- **Java 5+**: generics adicionados
- **Hoje**: evitar raw types

**Métodos**:
- **Raw**: void processar(List), aceita qualquer, sem safety
- **Generics**: void processar(List<String>), tipo específico, safety

**Warning**:
- Compilador avisa "unchecked unsafe operations"
- Indica operação não type-safe
- Deve parametrizar

**Quando existem**:
- **Compatibilidade** código legado
- **Migração** gradual
- **Evitar** código novo

**Regra de Ouro**: SEMPRE parametrizar coleções. List<String> lista new ArrayList<String> correto. List lista new ArrayList raw type EVITAR. Raw type aceita qualquer tipo cast obrigatório ClassCastException runtime warning compilação IDE limitado. Generics aceita tipo específico sem cast erro compilação IDE funciona. Histórico Java 1.4 apenas raw Java 5 generics adicionados hoje evitar raw. Métodos usar List<String> parâmetro tipo específico não List raw aceita qualquer. Warning unchecked unsafe indica não type-safe deve parametrizar. Compatibilidade legado migração gradual código novo sempre generics. NUNCA raw type código novo.

