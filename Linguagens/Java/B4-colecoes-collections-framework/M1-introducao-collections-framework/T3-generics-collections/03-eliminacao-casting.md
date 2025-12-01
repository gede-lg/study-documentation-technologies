# T3.03 - Eliminação de Casting

## Introdução

**Generics eliminam casting**: tipo conhecido em compilação, cast **desnecessário**.

```java
import java.util.*;

// ❌ SEM Generics: casting necessário
public class ComCasting {
    public static void main(String[] args) {
        List lista = new ArrayList();
        lista.add("Java");
        
        String texto = (String) lista.get(0);  // Cast obrigatório
        System.out.println(texto);
    }
}

// ✅ COM Generics: sem casting
public class SemCasting {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        
        String texto = lista.get(0);  // Sem cast
        System.out.println(texto);
    }
}
```

**Regra**: Generics **eliminam** cast. Tipo conhecido, conversão **automática**.

---

## Fundamentos

### 1. Cast Necessário Sem Generics

```java
// ❌ Raw type: cast obrigatório
public class CastObrigatorio {
    public static void main(String[] args) {
        List lista = new ArrayList();
        lista.add("Java");
        lista.add("Python");
        
        // ❌ get() retorna Object, cast necessário
        String texto1 = (String) lista.get(0);
        String texto2 = (String) lista.get(1);
        
        System.out.println(texto1.toUpperCase());
        System.out.println(texto2.toUpperCase());
        
        // ❌ Iteração: cast em cada elemento
        for (Object obj : lista) {
            String texto = (String) obj;
            System.out.println(texto.length());
        }
    }
}

/*
 * SEM GENERICS:
 * 
 * get() retorna Object:
 * - Precisa cast para tipo específico
 * - Cast em CADA acesso
 * 
 * PROBLEMAS:
 * - Código VERBOSE (muitos casts)
 * - Risco ClassCastException
 * - Menos LEGÍVEL
 */
```

**Sem generics**: cast **obrigatório**. get() retorna Object.

### 2. Eliminação de Cast com Generics

```java
// ✅ Generics: cast desnecessário
public class SemCast {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        lista.add("Python");
        
        // ✅ get() retorna String, sem cast
        String texto1 = lista.get(0);
        String texto2 = lista.get(1);
        
        System.out.println(texto1.toUpperCase());
        System.out.println(texto2.toUpperCase());
        
        // ✅ Iteração: sem cast
        for (String texto : lista) {
            System.out.println(texto.length());
        }
    }
}

/*
 * COM GENERICS:
 * 
 * get() retorna T (tipo parametrizado):
 * - Sem cast necessário
 * - Tipo conhecido
 * 
 * VANTAGENS:
 * - Código LIMPO
 * - Mais LEGÍVEL
 * - Sem risco ClassCastException
 */
```

**Com generics**: cast **desnecessário**. get() retorna tipo específico.

### 3. Comparação Código

```java
// ✅ Comparação lado a lado
public class ComparacaoCodigo {
    
    // ❌ SEM Generics (verbose)
    public static void processarSemGenerics() {
        List lista = new ArrayList();
        lista.add("Java");
        lista.add("Python");
        lista.add("C++");
        
        String primeiro = (String) lista.get(0);  // Cast
        String segundo = (String) lista.get(1);   // Cast
        String terceiro = (String) lista.get(2);  // Cast
        
        for (int i = 0; i < lista.size(); i++) {
            String texto = (String) lista.get(i);  // Cast
            System.out.println(texto.toUpperCase());
        }
    }
    
    // ✅ COM Generics (limpo)
    public static void processarComGenerics() {
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        lista.add("Python");
        lista.add("C++");
        
        String primeiro = lista.get(0);   // Sem cast
        String segundo = lista.get(1);    // Sem cast
        String terceiro = lista.get(2);   // Sem cast
        
        for (int i = 0; i < lista.size(); i++) {
            String texto = lista.get(i);  // Sem cast
            System.out.println(texto.toUpperCase());
        }
    }
    
    public static void main(String[] args) {
        processarComGenerics();  // Preferir
    }
}

/*
 * COMPARAÇÃO:
 * 
 * SEM GENERICS:
 * - 5+ casts
 * - Verbose
 * - Menos legível
 * 
 * COM GENERICS:
 * - 0 casts
 * - Limpo
 * - Mais legível
 */
```

**Comparação**: sem generics verbose (muitos casts), com generics **limpo**.

### 4. Map e Eliminação de Cast

```java
// ✅ Map: eliminação de cast
public class MapSemCast {
    
    // ❌ SEM Generics
    public static void mapSemGenerics() {
        Map mapa = new HashMap();
        mapa.put("Ana", 25);
        mapa.put("Bruno", 30);
        
        // ❌ Cast duplo: chave E valor
        Integer idade1 = (Integer) mapa.get("Ana");
        Integer idade2 = (Integer) mapa.get("Bruno");
        
        // ❌ Iteração: cast em chave e valor
        for (Object chave : mapa.keySet()) {
            String nome = (String) chave;
            Integer idade = (Integer) mapa.get(chave);
            System.out.println(nome + ": " + idade);
        }
    }
    
    // ✅ COM Generics
    public static void mapComGenerics() {
        Map<String, Integer> mapa = new HashMap<String, Integer>();
        mapa.put("Ana", 25);
        mapa.put("Bruno", 30);
        
        // ✅ Sem cast
        Integer idade1 = mapa.get("Ana");
        Integer idade2 = mapa.get("Bruno");
        
        // ✅ Sem cast em chave e valor
        for (String nome : mapa.keySet()) {
            Integer idade = mapa.get(nome);
            System.out.println(nome + ": " + idade);
        }
        
        // ✅ Entry também sem cast
        for (Map.Entry<String, Integer> entry : mapa.entrySet()) {
            String nome = entry.getKey();
            Integer idade = entry.getValue();
            System.out.println(nome + ": " + idade);
        }
    }
    
    public static void main(String[] args) {
        mapComGenerics();
    }
}

/*
 * MAP SEM GENERICS:
 * - Cast para CHAVE
 * - Cast para VALOR
 * - Duplo trabalho
 * 
 * MAP COM GENERICS:
 * - Sem cast chave
 * - Sem cast valor
 * - Código limpo
 */
```

**Map**: sem generics cast **duplo** (chave+valor). Com generics **nenhum** cast.

### 5. Coleções Aninhadas

```java
// ✅ Coleções aninhadas: cast eliminado
public class ColecoesAninhadas {
    
    // ❌ SEM Generics: casts múltiplos
    public static void semGenerics() {
        Map mapa = new HashMap();
        
        List lista1 = new ArrayList();
        lista1.add("A");
        lista1.add("B");
        
        mapa.put("grupo1", lista1);
        
        // ❌ Cast para List, depois para String
        List lista = (List) mapa.get("grupo1");
        String elemento = (String) lista.get(0);
        
        System.out.println(elemento);
    }
    
    // ✅ COM Generics: sem casts
    public static void comGenerics() {
        Map<String, List<String>> mapa = new HashMap<String, List<String>>();
        
        List<String> lista1 = new ArrayList<String>();
        lista1.add("A");
        lista1.add("B");
        
        mapa.put("grupo1", lista1);
        
        // ✅ Sem cast
        List<String> lista = mapa.get("grupo1");
        String elemento = lista.get(0);
        
        System.out.println(elemento);
    }
    
    public static void main(String[] args) {
        comGenerics();
    }
}

/*
 * ANINHADAS SEM GENERICS:
 * - Cast para coleção externa
 * - Cast para coleção interna
 * - Cast para elemento
 * - Complexo e verbose
 * 
 * ANINHADAS COM GENERICS:
 * - Sem cast
 * - Tipo conhecido em todos níveis
 * - Simples e limpo
 */
```

**Aninhadas**: sem generics casts **múltiplos**. Com generics tipo conhecido em **todos** níveis.

### 6. Métodos Genéricos

```java
// ✅ Métodos genéricos eliminam cast
public class MetodosGenericos {
    
    // ❌ SEM Generics
    public static Object buscar(List lista, int indice) {
        return lista.get(indice);  // Retorna Object
    }
    
    // ✅ COM Generics
    public static <T> T buscarGenerico(List<T> lista, int indice) {
        return lista.get(indice);  // Retorna T
    }
    
    public static void main(String[] args) {
        List<String> strings = new ArrayList<String>();
        strings.add("Java");
        
        // ❌ Cast necessário
        String texto1 = (String) buscar(strings, 0);
        
        // ✅ Sem cast (tipo inferido)
        String texto2 = buscarGenerico(strings, 0);
        
        System.out.println(texto1);
        System.out.println(texto2);
    }
}

/*
 * MÉTODOS:
 * 
 * SEM GENERICS:
 * - Retorna Object
 * - Cast necessário
 * 
 * COM GENERICS:
 * - Retorna tipo específico
 * - Sem cast
 * - Tipo inferido pelo contexto
 */
```

**Métodos genéricos**: retorno tipado elimina cast. Tipo **inferido**.

### 7. Benefícios Eliminar Cast

```java
// ✅ Benefícios de eliminar cast
public class BeneficiosEliminarCast {
    
    public static void main(String[] args) {
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        
        // ✅ Benefício 1: Menos código
        String texto = lista.get(0);  // 1 linha limpa
        // vs
        // String texto = (String) lista.get(0);  // Cast adicional
        
        // ✅ Benefício 2: Mais legível
        for (String s : lista) {  // Claro
            System.out.println(s.toUpperCase());
        }
        // vs
        // for (Object obj : lista) {
        //     String s = (String) obj;  // Verbose
        //     System.out.println(s.toUpperCase());
        // }
        
        // ✅ Benefício 3: Sem ClassCastException
        // Cast pode falhar em runtime
        // Generics garantem tipo em compilação
        
        // ✅ Benefício 4: IDE autocomplete
        String s = lista.get(0);
        s.toUpperCase();  // IDE sabe que é String
        // vs
        // Object obj = lista.get(0);
        // obj.  // IDE não sabe métodos de String
    }
}

/*
 * BENEFÍCIOS:
 * 
 * 1. MENOS CÓDIGO:
 *    - Sem casts repetitivos
 *    - Código mais conciso
 * 
 * 2. MAIS LEGÍVEL:
 *    - Intenção clara
 *    - Menos ruído visual
 * 
 * 3. MAIS SEGURO:
 *    - Sem ClassCastException
 *    - Tipo garantido
 * 
 * 4. IDE SUPPORT:
 *    - Autocomplete funciona
 *    - Navegação facilitada
 */
```

**Benefícios**: menos código, mais legível, mais seguro, IDE support.

### 8. Resumo Visual

```java
/*
 * ELIMINAÇÃO DE CASTING
 * 
 * SEM GENERICS (RAW TYPE):
 * 
 * List lista = new ArrayList();
 * lista.add("Java");
 * 
 * String texto = (String) lista.get(0);  // Cast obrigatório
 * 
 * for (Object obj : lista) {
 *     String s = (String) obj;  // Cast obrigatório
 * }
 * 
 * PROBLEMAS:
 * - Cast em CADA acesso
 * - Código VERBOSE
 * - Risco ClassCastException
 * - Menos LEGÍVEL
 * 
 * 
 * COM GENERICS:
 * 
 * List<String> lista = new ArrayList<String>();
 * lista.add("Java");
 * 
 * String texto = lista.get(0);  // Sem cast
 * 
 * for (String s : lista) {
 *     // Sem cast
 * }
 * 
 * VANTAGENS:
 * - Sem cast
 * - Código LIMPO
 * - Sem ClassCastException
 * - Mais LEGÍVEL
 * 
 * 
 * MAP:
 * 
 * SEM GENERICS:
 * Map mapa = new HashMap();
 * String chave = (String) mapa.keySet().iterator().next();
 * Integer valor = (Integer) mapa.get(chave);
 * 
 * COM GENERICS:
 * Map<String, Integer> mapa = new HashMap<>();
 * String chave = mapa.keySet().iterator().next();
 * Integer valor = mapa.get(chave);
 * 
 * 
 * ANINHADAS:
 * 
 * SEM GENERICS:
 * List lista = (List) mapa.get("grupo");
 * String elemento = (String) lista.get(0);
 * 
 * COM GENERICS:
 * List<String> lista = mapa.get("grupo");
 * String elemento = lista.get(0);
 * 
 * 
 * BENEFÍCIOS:
 * 1. Menos código (sem casts)
 * 2. Mais legível
 * 3. Mais seguro (sem ClassCastException)
 * 4. IDE autocomplete
 */

public class ExemploEliminacaoCast {
    public static void main(String[] args) {
        // ✅ Sem cast
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        
        String texto = lista.get(0);  // Direto
        System.out.println(texto.toUpperCase());
    }
}
```

---

## Aplicabilidade

**Eliminação cast**:
- Código mais **limpo**
- Mais **legível**
- Mais **seguro**
- IDE **autocomplete**

**Quando usar**:
- **Sempre** com coleções
- APIs que retornam coleções
- Métodos genéricos

---

## Armadilhas

### 1. Raw Type Requer Cast

```java
// ❌ Raw type: cast obrigatório
List lista = new ArrayList();
String texto = (String) lista.get(0);

// ✅ Generics: sem cast
List<String> lista = new ArrayList<String>();
String texto = lista.get(0);
```

### 2. ClassCastException com Cast

```java
// ❌ Cast pode falhar
List lista = new ArrayList();
lista.add(123);
String texto = (String) lista.get(0);  // ClassCastException

// ✅ Generics previne
List<String> lista = new ArrayList<String>();
// lista.add(123);  // Erro compilação
```

---

## Boas Práticas

### 1. Sempre Usar Generics

```java
// ✅ Generics elimina cast
List<String> lista = new ArrayList<String>();
String texto = lista.get(0);

// ❌ Raw type requer cast
List lista = new ArrayList();
String texto = (String) lista.get(0);
```

### 2. Evitar Casts Manuais

```java
// ❌ Cast indica tipo errado ou raw type
String texto = (String) lista.get(0);

// ✅ Se precisar cast, revisar tipo da coleção
List<String> lista = new ArrayList<String>();
String texto = lista.get(0);  // Sem cast
```

---

## Resumo

**Eliminação cast**:
- Generics **eliminam** casting
- get() retorna tipo **específico**
- Cast **desnecessário**

**Sem generics**:
- get() retorna **Object**
- Cast **obrigatório**
- Risco **ClassCastException**
- Código **verbose**

**Com generics**:
- get() retorna **T** (tipo parametrizado)
- **Sem** cast
- **Impossível** ClassCastException
- Código **limpo**

**Map**:
- Sem generics: cast **duplo** (chave+valor)
- Com generics: **nenhum** cast

**Aninhadas**:
- Sem generics: casts **múltiplos**
- Com generics: tipo conhecido **todos** níveis

**Métodos genéricos**:
- Retorno **tipado**
- Sem cast
- Tipo **inferido**

**Benefícios**:
- **Menos** código
- Mais **legível**
- Mais **seguro**
- IDE **autocomplete**

**Comparação**:
- Sem generics: 5+ casts
- Com generics: 0 casts
- **100%** eliminação

**Regra de Ouro**: Generics eliminam cast tipo conhecido compilação conversão automática. Sem generics get Object cast obrigatório verbose. Com generics get tipo específico sem cast limpo. Map sem cast duplo chave valor. Aninhadas tipo conhecido todos níveis. Métodos genéricos retorno tipado inferido. Benefícios menos código legível seguro autocomplete. Sempre usar generics evitar raw types casts manuais.

