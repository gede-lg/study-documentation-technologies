# T3.02 - Type Safety

## Introdução

**Type Safety**: garantir que operações são feitas com **tipos corretos** em tempo de **compilação**.

```java
import java.util.*;

// ❌ SEM type safety (raw type)
public class SemTypeSafety {
    public static void main(String[] args) {
        List lista = new ArrayList();  // Raw type
        lista.add("Java");
        lista.add(123);
        lista.add(true);  // Aceita QUALQUER tipo
        
        // ❌ Erro RUNTIME
        String texto = (String) lista.get(1);  // ClassCastException
    }
}

// ✅ COM type safety (generics)
public class ComTypeSafety {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        // lista.add(123);  // ✅ ERRO COMPILAÇÃO
        
        String texto = lista.get(0);  // Seguro
    }
}
```

**Regra**: Generics garantem **type safety**. Erros detectados em **compilação**, não runtime.

---

## Fundamentos

### 1. Detecção de Erros em Compilação

```java
// ✅ Erros detectados ANTES de executar
public class DeteccaoErrosCompilacao {
    public static void main(String[] args) {
        List<String> strings = new ArrayList<String>();
        
        // ✅ Aceito: String
        strings.add("Java");
        strings.add("Python");
        
        // ❌ ERRO COMPILAÇÃO: int não é String
        // strings.add(123);
        
        // ❌ ERRO COMPILAÇÃO: boolean não é String
        // strings.add(true);
        
        // ❌ ERRO COMPILAÇÃO: Double não é String
        // strings.add(10.5);
        
        System.out.println("Código NEM executou se tiver erro!");
    }
}

/*
 * DETECÇÃO COMPILAÇÃO:
 * 
 * VANTAGEM:
 * - Erro ANTES de executar
 * - IDE mostra erro IMEDIATAMENTE
 * - Não chega em produção
 * 
 * SEM GENERICS:
 * - Erro em RUNTIME
 * - ClassCastException
 * - Pode crashar aplicação
 * 
 * COM GENERICS:
 * - Erro em COMPILAÇÃO
 * - Código NEM compila
 * - Impossível executar com erro de tipo
 */
```

**Compilação**: erros detectados **antes** de executar. Código não compila.

### 2. Evitar ClassCastException

```java
// ✅ Evitar ClassCastException
public class EvitarClassCastException {
    
    // ❌ SEM Generics: risco de ClassCastException
    public static void semGenerics() {
        List lista = new ArrayList();
        lista.add("Java");
        lista.add(123);
        
        try {
            for (Object obj : lista) {
                String texto = (String) obj;  // ClassCastException em 123
                System.out.println(texto.toUpperCase());
            }
        } catch (ClassCastException e) {
            System.out.println("ERRO RUNTIME: " + e.getMessage());
        }
    }
    
    // ✅ COM Generics: ClassCastException IMPOSSÍVEL
    public static void comGenerics() {
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        // lista.add(123);  // NÃO COMPILA
        
        // ✅ Sem cast, sem risco
        for (String texto : lista) {
            System.out.println(texto.toUpperCase());
        }
    }
    
    public static void main(String[] args) {
        semGenerics();   // Pode lançar exceção
        comGenerics();   // Seguro
    }
}

/*
 * CLASSCASTEXCEPTION:
 * 
 * SEM GENERICS:
 * - Cast manual necessário
 * - Pode lançar ClassCastException
 * - Erro em RUNTIME
 * 
 * COM GENERICS:
 * - Sem cast
 * - ClassCastException IMPOSSÍVEL
 * - Type safety garantido
 */
```

**ClassCastException**: impossível com generics. Tipo garantido em compilação.

### 3. Type Safety em Métodos

```java
// ✅ Type safety em métodos
public class TypeSafetyMetodos {
    
    // ❌ SEM type safety
    public static void imprimirSemSafety(List lista) {
        for (Object obj : lista) {
            String texto = (String) obj;  // Assume String, pode falhar
            System.out.println(texto.toUpperCase());
        }
    }
    
    // ✅ COM type safety
    public static void imprimirComSafety(List<String> lista) {
        for (String texto : lista) {  // Garantido String
            System.out.println(texto.toUpperCase());
        }
    }
    
    // ✅ Genérico type-safe
    public static <T> void imprimir(List<T> lista) {
        for (T elemento : lista) {
            System.out.println(elemento);
        }
    }
    
    public static void main(String[] args) {
        List<String> strings = new ArrayList<String>();
        strings.add("Java");
        
        // ✅ Type-safe
        imprimirComSafety(strings);
        imprimir(strings);
        
        // ❌ Unsafe (aceita qualquer List)
        // imprimirSemSafety(strings);
    }
}

/*
 * MÉTODOS TYPE-SAFE:
 * 
 * PARÂMETRO ESPECÍFICO:
 * void metodo(List<String> lista)
 * - Aceita APENAS List<String>
 * - Type safety garantido
 * 
 * PARÂMETRO GENÉRICO:
 * <T> void metodo(List<T> lista)
 * - Aceita List de QUALQUER tipo
 * - Type safety preservado
 * 
 * RAW TYPE:
 * void metodo(List lista)
 * - Aceita qualquer List
 * - SEM type safety
 */
```

**Métodos**: parâmetros tipados garantem type safety. Genérico <T> preserva tipo.

### 4. Type Safety em Retorno

```java
// ✅ Type safety em retorno de métodos
public class TypeSafetyRetorno {
    
    // ❌ SEM type safety
    public static List criarListaSemSafety() {
        List lista = new ArrayList();
        lista.add("Java");
        return lista;
    }
    
    // ✅ COM type safety
    public static List<String> criarListaComSafety() {
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        return lista;
    }
    
    // ✅ Genérico type-safe
    public static <T> List<T> criarLista(T... elementos) {
        List<T> lista = new ArrayList<T>();
        for (T elemento : elementos) {
            lista.add(elemento);
        }
        return lista;
    }
    
    public static void main(String[] args) {
        // ❌ Sem safety: precisa cast
        List lista1 = criarListaSemSafety();
        String texto1 = (String) lista1.get(0);
        
        // ✅ Com safety: sem cast
        List<String> lista2 = criarListaComSafety();
        String texto2 = lista2.get(0);
        
        // ✅ Genérico: tipo inferido
        List<String> lista3 = criarLista("Java", "Python");
        List<Integer> lista4 = criarLista(1, 2, 3);
    }
}

/*
 * RETORNO TYPE-SAFE:
 * 
 * ESPECÍFICO:
 * List<String> metodo()
 * - Retorna List<String>
 * - Tipo conhecido
 * - Sem cast necessário
 * 
 * GENÉRICO:
 * <T> List<T> metodo()
 * - Tipo inferido pelo uso
 * - Type safety preservado
 * 
 * RAW:
 * List metodo()
 * - Tipo desconhecido
 * - Cast necessário
 */
```

**Retorno**: tipo específico elimina cast. Genérico <T> infere tipo pelo uso.

### 5. Incompatibilidade de Tipos

```java
// ✅ Incompatibilidade detectada em compilação
public class IncompatibilidadeTipos {
    public static void main(String[] args) {
        List<String> strings = new ArrayList<String>();
        List<Integer> inteiros = new ArrayList<Integer>();
        
        // ❌ ERRO: Integer não é String
        // strings.add(123);
        
        // ❌ ERRO: String não é Integer
        // inteiros.add("Java");
        
        // ❌ ERRO: não pode atribuir List<Integer> para List<String>
        // strings = inteiros;
        
        // ❌ ERRO: não pode passar List<Integer> onde espera List<String>
        // processarStrings(inteiros);
    }
    
    public static void processarStrings(List<String> lista) {
        // Processamento...
    }
}

/*
 * INCOMPATIBILIDADE:
 * 
 * DETECTADO:
 * - Tipo errado em add()
 * - Atribuição incompatível
 * - Parâmetro incompatível
 * 
 * ERRO COMPILAÇÃO:
 * - Código NÃO compila
 * - IDE mostra erro
 * - Impossível executar
 */
```

**Incompatibilidade**: detectada em compilação. Código **não** compila.

### 6. Wildcards e Type Safety

```java
// ✅ Wildcards mantêm type safety
public class WildcardsTypeSafety {
    
    // ✅ Wildcard ? extends - LEITURA type-safe
    public static void imprimirNumeros(List<? extends Number> numeros) {
        for (Number numero : numeros) {
            System.out.println(numero.doubleValue());
        }
        
        // ❌ ERRO: não pode adicionar (exceto null)
        // numeros.add(10);
    }
    
    // ✅ Wildcard ? super - ESCRITA type-safe
    public static void adicionarInteiros(List<? super Integer> lista) {
        lista.add(10);
        lista.add(20);
        
        // ❌ ERRO: não pode ler como Integer
        // Integer valor = lista.get(0);
    }
    
    // ✅ Wildcard ? - apenas leitura Object
    public static void imprimir(List<?> lista) {
        for (Object elemento : lista) {
            System.out.println(elemento);
        }
        
        // ❌ ERRO: não pode adicionar (exceto null)
        // lista.add("Java");
    }
    
    public static void main(String[] args) {
        List<Integer> inteiros = new ArrayList<Integer>();
        inteiros.add(10);
        
        List<Double> doubles = new ArrayList<Double>();
        doubles.add(10.5);
        
        // ✅ Ambos são Number
        imprimirNumeros(inteiros);
        imprimirNumeros(doubles);
        
        // ✅ List<Object> é super de Integer
        List<Object> objetos = new ArrayList<Object>();
        adicionarInteiros(objetos);
        
        // ✅ Qualquer lista
        imprimir(inteiros);
        imprimir(doubles);
    }
}

/*
 * WILDCARDS:
 * 
 * ? extends T:
 * - LEITURA type-safe (como T)
 * - NÃO pode adicionar
 * 
 * ? super T:
 * - ESCRITA type-safe (aceita T)
 * - NÃO pode ler como T
 * 
 * ?:
 * - Leitura como Object
 * - NÃO pode adicionar
 * 
 * TYPE SAFETY:
 * - Wildcards preservam segurança
 * - Compilador previne operações inseguras
 */
```

**Wildcards**: preservam type safety. Compilador previne operações **inseguras**.

### 7. Benefícios Type Safety

```java
// ✅ Benefícios de type safety
public class BeneficiosTypeSafety {
    
    // ✅ Benefício 1: Menos bugs
    public static void menosBugs() {
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        
        // ✅ IMPOSSÍVEL adicionar tipo errado
        // lista.add(123);  // NÃO COMPILA
    }
    
    // ✅ Benefício 2: Código mais claro
    public static void codigoClaro() {
        // ✅ CLARO: lista de Strings
        List<String> nomes = new ArrayList<String>();
        
        // ❌ OBSCURO: lista de quê?
        List lista = new ArrayList();
    }
    
    // ✅ Benefício 3: Refatoração segura
    public static void processar(List<String> textos) {
        // Se mudar tipo, compilador detecta TODOS usos
    }
    
    // ✅ Benefício 4: Autocomplete IDE
    public static void autocomplete() {
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        
        String texto = lista.get(0);
        // IDE sabe que é String, mostra métodos de String
        texto.toUpperCase();  // Autocomplete funciona
    }
    
    public static void main(String[] args) {
        menosBugs();
        codigoClaro();
        autocomplete();
    }
}

/*
 * BENEFÍCIOS:
 * 
 * 1. MENOS BUGS:
 *    - Erros detectados cedo
 *    - Não chegam em produção
 * 
 * 2. CÓDIGO CLARO:
 *    - Tipo explícito
 *    - Intenção óbvia
 * 
 * 3. REFATORAÇÃO:
 *    - Compilador detecta impactos
 *    - Mudanças seguras
 * 
 * 4. IDE SUPPORT:
 *    - Autocomplete
 *    - Detecção erros
 *    - Navegação
 */
```

**Benefícios**: menos bugs, código claro, refatoração segura, IDE support.

### 8. Resumo Visual

```java
/*
 * TYPE SAFETY
 * 
 * DEFINIÇÃO:
 * Garantir operações com tipos corretos
 * em tempo de COMPILAÇÃO
 * 
 * SEM GENERICS (RAW TYPE):
 * List lista = new ArrayList();
 * lista.add("Java");
 * lista.add(123);  // OK
 * String s = (String) lista.get(1);  // ClassCastException RUNTIME
 * 
 * COM GENERICS:
 * List<String> lista = new ArrayList<String>();
 * lista.add("Java");
 * lista.add(123);  // ERRO COMPILAÇÃO
 * String s = lista.get(0);  // Sem cast, type-safe
 * 
 * VANTAGENS:
 * 
 * 1. Erros em COMPILAÇÃO:
 *    - Detectados ANTES de executar
 *    - Código não compila
 * 
 * 2. Sem ClassCastException:
 *    - Tipo garantido
 *    - Cast desnecessário
 * 
 * 3. Código CLARO:
 *    - Tipo explícito
 *    - Intenção óbvia
 * 
 * 4. Refatoração SEGURA:
 *    - Compilador detecta impactos
 *    - Mudanças sem risco
 * 
 * 5. IDE SUPPORT:
 *    - Autocomplete
 *    - Navegação
 *    - Detecção erros
 * 
 * INCOMPATIBILIDADE:
 * List<String> != List<Integer>
 * - Tipos diferentes
 * - Não pode atribuir
 * - Compilador previne
 * 
 * WILDCARDS:
 * ? extends T - leitura type-safe
 * ? super T - escrita type-safe
 * ? - leitura Object
 * 
 * Wildcards preservam type safety
 */

public class ExemploTypeSafety {
    public static void main(String[] args) {
        // ✅ Type-safe
        List<String> lista = new ArrayList<String>();
        lista.add("Java");
        
        // ✅ Tipo garantido, sem cast
        String texto = lista.get(0);
        System.out.println(texto.toUpperCase());
    }
}
```

---

## Aplicabilidade

**Type Safety**:
- **Detectar** erros em compilação
- **Prevenir** ClassCastException
- **Clarificar** código (tipo explícito)
- **Refatorar** com segurança

**Quando usar**:
- **Sempre** em coleções
- APIs públicas
- Código crítico

---

## Armadilhas

### 1. Raw Types Perdem Safety

```java
// ❌ Raw type: sem type safety
List lista = new ArrayList();
lista.add("Java");
lista.add(123);  // Aceita qualquer tipo

// ✅ Generics: type-safe
List<String> lista = new ArrayList<String>();
```

### 2. Cast Manual Arriscado

```java
// ❌ Cast pode falhar
Object obj = lista.get(0);
String texto = (String) obj;  // Pode lançar exceção

// ✅ Generics elimina cast
List<String> lista = new ArrayList<String>();
String texto = lista.get(0);  // Seguro
```

---

## Boas Práticas

### 1. Sempre Usar Generics

```java
// ✅ Type-safe
List<String> lista = new ArrayList<String>();

// ❌ Raw type (evitar)
List lista = new ArrayList();
```

### 2. Parâmetros Tipados

```java
// ✅ Parâmetro tipado
void processar(List<String> lista) { }

// ❌ Raw type
void processar(List lista) { }
```

### 3. Retorno Tipado

```java
// ✅ Retorno tipado
List<String> criar() { return new ArrayList<String>(); }

// ❌ Raw type
List criar() { return new ArrayList(); }
```

---

## Resumo

**Type Safety**:
- Garantir tipos **corretos** em compilação
- Generics fornecem type safety
- Erros detectados **antes** de executar

**Vantagens**:
- Erros em **compilação** (não runtime)
- **Sem** ClassCastException
- Código mais **claro**
- Refatoração **segura**
- **IDE** support (autocomplete)

**Detecção**:
- Tipo errado em **add()**: erro compilação
- **Atribuição** incompatível: erro compilação
- **Parâmetro** incompatível: erro compilação
- Código **não** compila com erro

**Sem Generics**:
- Aceita **qualquer** tipo
- **ClassCastException** runtime
- Cast **manual** necessário
- Erro apenas em **runtime**

**Com Generics**:
- Apenas tipo **específico**
- ClassCastException **impossível**
- **Sem** cast
- Erro em **compilação**

**Wildcards**:
- **? extends T**: leitura type-safe
- **? super T**: escrita type-safe
- **?**: leitura Object
- Preservam type **safety**

**Benefícios**:
- **Menos** bugs
- Código mais **claro**
- Refatoração **segura**
- **Autocomplete** IDE

**Regra de Ouro**: Type safety garante tipos corretos compilação não runtime. Generics fornecem type safety erros detectados antes executar código não compila. Sem ClassCastException tipo garantido cast desnecessário. Raw types perdem safety aceita qualquer tipo erro runtime. Sempre usar generics parâmetros retorno tipados. Wildcards preservam safety leitura escrita controladas. IDE support autocomplete navegação detecção erros.

