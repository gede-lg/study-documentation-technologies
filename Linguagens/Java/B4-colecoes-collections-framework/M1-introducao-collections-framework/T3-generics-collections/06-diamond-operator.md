# T3.06 - Diamond Operator <> (Java 7+)

## Introdução

**Diamond operator <>**: inferência tipo lado direito. List<String> lista = new ArrayList**<>**(); compilador infere String.

```java
import java.util.*;

// ✅ Diamond operator <> (Java 7+)
public class DiamondOperator {
    public static void main(String[] args) {
        // ✅ COM diamond operator
        List<String> lista = new ArrayList<>();
        
        // Compilador INFERE:
        // new ArrayList<String>()
        // Tipo String extraído lado esquerdo
        
        Set<Integer> conjunto = new HashSet<>();
        Map<String, Integer> mapa = new HashMap<>();
    }
}

// ❌ SEM diamond operator (Java 6-)
public class SemDiamond {
    public static void main(String[] args) {
        // ❌ Tipo repetido
        List<String> lista = new ArrayList<String>();
        
        Set<Integer> conjunto = new HashSet<Integer>();
        Map<String, Integer> mapa = new HashMap<String, Integer>();
    }
}
```

**Diamond <>**: economiza código. Tipo inferido esquerdo. Java 7+ apenas.

---

## Fundamentos

### 1. Sintaxe Diamond Operator

```java
// ✅ Diamond operator sintaxe
public class SintaxeDiamond {
    public static void main(String[] args) {
        // ANTES Java 7 (repetitivo):
        List<String> lista1 = new ArrayList<String>();
        
        // JAVA 7+ (diamond):
        List<String> lista2 = new ArrayList<>();
        
        // SINTAXE:
        // Interface<Tipo> var = new Classe<>();
        //                                    ^^
        //                                 diamond
        
        // EXEMPLOS:
        List<Integer> numeros = new ArrayList<>();
        Set<String> palavras = new HashSet<>();
        Map<String, Integer> idades = new HashMap<>();
        Queue<String> fila = new LinkedList<>();
        Deque<String> deque = new ArrayDeque<>();
    }
}

/*
 * DIAMOND OPERATOR:
 * 
 * SINTAXE:
 * Interface<Tipo> var = new Classe<>();
 * 
 * COMPONENTES:
 * <>  - diamond operator (vazio)
 * 
 * INFERÊNCIA:
 * Compilador extrai tipo da declaração
 * List<String> lista = new ArrayList<>();
 *      ^^^^^^                         ^^
 *      tipo                        infere aqui
 * 
 * ECONOMIZA:
 * Não precisa repetir tipo
 */
```

**Sintaxe**: Interface<Tipo> var = new Classe**<>**(). Tipo inferido esquerdo.

### 2. Inferência de Tipo

```java
// ✅ Inferência tipo
public class InferenciaTipo {
    public static void main(String[] args) {
        // COMPILADOR INFERE:
        
        // String
        List<String> lista = new ArrayList<>();
        // Compilador vê List<String>
        // Infere new ArrayList<String>()
        
        // Integer
        Set<Integer> conjunto = new HashSet<>();
        // Compilador vê Set<Integer>
        // Infere new HashSet<Integer>()
        
        // String, Integer
        Map<String, Integer> mapa = new HashMap<>();
        // Compilador vê Map<String, Integer>
        // Infere new HashMap<String, Integer>()
        
        // Aninhado: Map<String, List<Integer>>
        Map<String, List<Integer>> mapaNested = new HashMap<>();
        // Compilador vê Map<String, List<Integer>>
        // Infere new HashMap<String, List<Integer>>()
    }
}

/*
 * INFERÊNCIA:
 * 
 * PROCESSO:
 * 1. Compilador lê lado esquerdo
 * 2. Extrai tipo parametrizado
 * 3. Aplica tipo lado direito
 * 
 * EXEMPLO:
 * List<String> lista = new ArrayList<>();
 * 
 * PASSO 1: Lê List<String>
 * PASSO 2: Extrai String
 * PASSO 3: Aplica new ArrayList<String>()
 */
```

**Inferência**: compilador lê esquerdo, extrai tipo, aplica direito.

### 3. Comparação Antes vs Depois

```java
// COMPARAÇÃO Java 6 vs Java 7+
public class AntesDepois {
    public static void main(String[] args) {
        // ❌ JAVA 6 (repetitivo)
        List<String> lista1 = new ArrayList<String>();
        Set<Integer> conjunto1 = new HashSet<Integer>();
        Map<String, Integer> mapa1 = new HashMap<String, Integer>();
        
        // ✅ JAVA 7+ (diamond)
        List<String> lista2 = new ArrayList<>();
        Set<Integer> conjunto2 = new HashSet<>();
        Map<String, Integer> mapa2 = new HashMap<>();
        
        // ECONOMIA:
        // 8 caracteres por linha (String)
        // 7 caracteres por linha (Integer)
        // 16 caracteres por linha (String, Integer)
        
        // Mais legível:
        Map<String, List<Integer>> mapaComplexo = new HashMap<>();
        // vs
        Map<String, List<Integer>> mapaComplexo2 = new HashMap<String, List<Integer>>();
    }
}

/*
 * COMPARAÇÃO:
 * 
 * JAVA 6:
 * List<String> lista = new ArrayList<String>();
 * 45 caracteres
 * 
 * JAVA 7+:
 * List<String> lista = new ArrayList<>();
 * 37 caracteres
 * 
 * ECONOMIA: 8 caracteres
 * 
 * LEGIBILIDADE:
 * Diamond mais limpo
 * Tipo não repetido
 */
```

**Comparação**: Java 6 repetitivo 45 caracteres, Java 7+ diamond 37 caracteres. Economia 8.

### 4. Tipos Complexos

```java
// ✅ Diamond tipos complexos
public class TiposComplexos {
    public static void main(String[] args) {
        // ✅ Aninhado
        Map<String, List<Integer>> mapa1 = new HashMap<>();
        // Infere: new HashMap<String, List<Integer>>()
        
        List<Set<String>> lista1 = new ArrayList<>();
        // Infere: new ArrayList<List<Set<String>>>()
        
        // ✅ Múltiplos níveis
        Map<String, Map<Integer, List<String>>> complexo = new HashMap<>();
        // Infere: new HashMap<String, Map<Integer, List<String>>>()
        
        // ✅ Wildcards
        List<? extends Number> numeros = new ArrayList<>();
        // Infere: new ArrayList<? extends Number>()
        
        // ✅ Classes customizadas
        class Pessoa {
            String nome;
        }
        
        List<Pessoa> pessoas = new ArrayList<>();
        // Infere: new ArrayList<Pessoa>()
        
        Map<String, Pessoa> cadastro = new HashMap<>();
        // Infere: new HashMap<String, Pessoa>()
    }
}

/*
 * TIPOS COMPLEXOS:
 * 
 * ANINHADO:
 * Map<String, List<Integer>> = new HashMap<>();
 * Infere: HashMap<String, List<Integer>>
 * 
 * MÚLTIPLOS NÍVEIS:
 * Map<String, Map<Integer, List<String>>> = new HashMap<>();
 * Infere: HashMap<String, Map<Integer, List<String>>>
 * 
 * WILDCARDS:
 * List<? extends Number> = new ArrayList<>();
 * Infere: ArrayList<? extends Number>
 * 
 * CUSTOMIZADOS:
 * List<MinhaClasse> = new ArrayList<>();
 * Infere: ArrayList<MinhaClasse>
 */
```

**Complexos**: aninhado, múltiplos níveis, wildcards, customizados. Inferência funciona todos.

### 5. Métodos e Diamond

```java
// ✅ Diamond em métodos
public class MetodosDiamond {
    // ✅ Retorno com diamond
    public static List<String> criar() {
        return new ArrayList<>();
        // Compilador infere tipo retorno
        // List<String>
    }
    
    // ✅ Variável local
    public static void processar() {
        List<Integer> numeros = new ArrayList<>();
        Set<String> palavras = new HashSet<>();
    }
    
    // ✅ Parâmetro método (passando)
    public static void usar(List<String> lista) { }
    
    public static void main(String[] args) {
        usar(new ArrayList<>());
        // Compilador infere String do parâmetro
    }
    
    // ✅ Atribuição
    public static void atribuir() {
        List<String> lista;
        lista = new ArrayList<>();
        // Compilador infere tipo variável
    }
}

/*
 * MÉTODOS:
 * 
 * RETORNO:
 * public List<String> criar() {
 *     return new ArrayList<>();  // Infere String
 * }
 * 
 * PARÂMETRO:
 * void usar(List<String> lista) {}
 * usar(new ArrayList<>());  // Infere String
 * 
 * VARIÁVEL LOCAL:
 * List<String> lista = new ArrayList<>();  // Infere String
 * 
 * ATRIBUIÇÃO:
 * List<String> lista;
 * lista = new ArrayList<>();  // Infere String
 */
```

**Métodos**: retorno inferido, parâmetro inferido, variável local, atribuição.

### 6. Limitações Diamond

```java
// ❌ Limitações diamond
public class LimitacoesDiamond {
    public static void main(String[] args) {
        // ❌ ERRO: tipo não inferido (sem declaração explícita)
        // var lista = new ArrayList<>();  // ERRO Java 10-
        // Precisa:
        var lista = new ArrayList<String>();  // OK Java 10+
        
        // ❌ ERRO: classe anônima
        // List<String> lista2 = new ArrayList<>() {
        //     // classe anônima
        // };
        // Precisa:
        List<String> lista2 = new ArrayList<String>() {
            // OK
        };
        
        // ❌ ERRO: array creation
        // List<String>[] array = new ArrayList<>[10];  // ERRO
        // Arrays genéricos não permitidos
        
        // ✅ OK: sem tipo esquerdo MAS contexto claro
        metodo(new ArrayList<>());  // OK: infere do parâmetro
    }
    
    public static void metodo(List<String> lista) { }
}

/*
 * LIMITAÇÕES:
 * 
 * 1. VAR (Java 10-):
 *    var lista = new ArrayList<>();  // ERRO
 *    Precisa tipo explícito
 * 
 * 2. CLASSE ANÔNIMA:
 *    new ArrayList<>() { }  // ERRO
 *    Precisa tipo explícito
 * 
 * 3. ARRAY GENÉRICO:
 *    new ArrayList<>[]  // ERRO
 *    Arrays genéricos não permitidos
 */
```

**Limitações**: var Java 10- precisa tipo, classe anônima precisa tipo, array genérico erro.

### 7. Benefícios Diamond

```java
// ✅ Benefícios diamond
public class BeneficiosDiamond {
    public static void main(String[] args) {
        // ✅ MENOS CÓDIGO
        Map<String, List<Integer>> mapa1 = new HashMap<>();
        // vs
        Map<String, List<Integer>> mapa2 = new HashMap<String, List<Integer>>();
        
        // ✅ MAIS LEGÍVEL
        // Tipo complexo não repetido
        Map<String, Map<Integer, List<String>>> complexo = new HashMap<>();
        
        // ✅ MENOS ERRO
        // Não precisa manter dois tipos sincronizados
        List<String> lista = new ArrayList<>();
        // Se mudar tipo esquerdo, direito acompanha automaticamente
        
        // ❌ SEM diamond: risco dessincronia
        // List<String> lista = new ArrayList<Integer>();  // ERRO
        // Com diamond impossível
        
        // ✅ REFATORAÇÃO FÁCIL
        // Trocar tipo apenas 1 lugar:
        List<Integer> numeros = new ArrayList<>();
        //   ^^^^^^^ mudar apenas aqui
    }
}

/*
 * BENEFÍCIOS:
 * 
 * 1. MENOS CÓDIGO:
 *    Não repete tipo
 *    Mais conciso
 * 
 * 2. MAIS LEGÍVEL:
 *    Tipo complexo aparece 1 vez
 *    Menos poluição visual
 * 
 * 3. MENOS ERRO:
 *    Impossível dessincronia tipos
 *    Compilador garante consistência
 * 
 * 4. REFATORAÇÃO:
 *    Mudar tipo 1 lugar
 *    Lado direito atualiza automático
 */
```

**Benefícios**: menos código conciso, mais legível sem repetição, menos erro impossível dessincronia, refatoração fácil.

### 8. Resumo Visual

```java
/*
 * DIAMOND OPERATOR <> (JAVA 7+)
 * 
 * SINTAXE:
 * Interface<Tipo> var = new Classe<>();
 *                                    ^^
 *                                  diamond
 * 
 * INFERÊNCIA:
 * Compilador extrai tipo lado esquerdo
 * Aplica lado direito
 * 
 * EXEMPLOS:
 * 
 * List<String> lista = new ArrayList<>();
 * Set<Integer> conjunto = new HashSet<>();
 * Map<String, Integer> mapa = new HashMap<>();
 * 
 * ANTES JAVA 7:
 * List<String> lista = new ArrayList<String>();
 * 45 caracteres
 * Tipo repetido
 * 
 * JAVA 7+:
 * List<String> lista = new ArrayList<>();
 * 37 caracteres
 * Tipo NÃO repetido
 * 
 * ECONOMIA: 8 caracteres
 * 
 * TIPOS COMPLEXOS:
 * Map<String, List<Integer>> mapa = new HashMap<>();
 * Infere: HashMap<String, List<Integer>>
 * 
 * Map<String, Map<Integer, List<String>>> complexo = new HashMap<>();
 * Infere: HashMap<String, Map<Integer, List<String>>>
 * 
 * MÉTODOS:
 * 
 * Retorno:
 * public List<String> criar() {
 *     return new ArrayList<>();  // Infere String
 * }
 * 
 * Parâmetro:
 * void usar(List<String> lista) {}
 * usar(new ArrayList<>());  // Infere String
 * 
 * Variável:
 * List<String> lista = new ArrayList<>();  // Infere String
 * 
 * LIMITAÇÕES:
 * 
 * 1. var (Java 10-):
 *    var lista = new ArrayList<>();  ❌
 *    var lista = new ArrayList<String>();  ✅
 * 
 * 2. Classe anônima:
 *    new ArrayList<>() { }  ❌
 *    new ArrayList<String>() { }  ✅
 * 
 * 3. Array genérico:
 *    new ArrayList<>[]  ❌
 * 
 * BENEFÍCIOS:
 * 
 * 1. Menos código (conciso)
 * 2. Mais legível (sem repetição)
 * 3. Menos erro (impossível dessincronia)
 * 4. Refatoração fácil (1 lugar)
 * 
 * REGRA:
 * SEMPRE usar diamond operator Java 7+
 * Economiza código
 * Mais legível
 */

// ✅ USAR
public class Usar {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>();
        Set<Integer> conjunto = new HashSet<>();
        Map<String, Integer> mapa = new HashMap<>();
    }
}

// ❌ EVITAR
public class Evitar {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<String>();
        Set<Integer> conjunto = new HashSet<Integer>();
        Map<String, Integer> mapa = new HashMap<String, Integer>();
    }
}
```

---

## Aplicabilidade

**Diamond operator**:
- **Sempre** Java 7+
- **Variáveis** locais
- **Campos** classe
- **Retorno** métodos
- **Parâmetros** chamadas

**Quando usar**:
- **Todas** coleções parametrizadas
- **Tipos** complexos aninhados
- **Refatoração** código existente

---

## Armadilhas

### 1. Var Java 10-

```java
// ❌ ERRO Java 10-
// var lista = new ArrayList<>();

// ✅ OK
var lista = new ArrayList<String>();
```

### 2. Classe Anônima

```java
// ❌ ERRO
// List<String> lista = new ArrayList<>() { };

// ✅ OK
List<String> lista = new ArrayList<String>() { };
```

### 3. Array Genérico

```java
// ❌ ERRO
// List<String>[] array = new ArrayList<>[10];

// Arrays genéricos não permitidos
```

---

## Boas Práticas

### 1. Sempre Usar Diamond

```java
// ✅ SEMPRE usar diamond Java 7+
List<String> lista = new ArrayList<>();

// ❌ EVITAR tipo repetido
List<String> lista = new ArrayList<String>();
```

### 2. Tipos Complexos

```java
// ✅ Diamond simplifica
Map<String, List<Integer>> mapa = new HashMap<>();

// ❌ Evitar repetição
Map<String, List<Integer>> mapa = new HashMap<String, List<Integer>>();
```

### 3. Refatorar Código Legado

```java
// ❌ Código Java 6
List<String> lista = new ArrayList<String>();

// ✅ Refatorar para Java 7+
List<String> lista = new ArrayList<>();
```

---

## Resumo

**Diamond operator <>**:
- **Inferência** tipo lado direito
- List<String> lista = new ArrayList**<>**()
- Compilador infere String
- **Java 7+** apenas

**Sintaxe**:
- Interface<Tipo> var = new Classe**<>**()
- **<>** diamond operator (vazio)
- Tipo **não** repetido

**Inferência**:
- Compilador lê esquerdo (List<String>)
- Extrai tipo (String)
- Aplica direito (new ArrayList<String>())

**Comparação**:
- **Java 6**: List<String> lista = new ArrayList<String>() (45 chars)
- **Java 7+**: List<String> lista = new ArrayList<>() (37 chars)
- **Economia**: 8 caracteres

**Tipos complexos**:
- Aninhado: Map<String, List<Integer>> = new HashMap<>()
- Múltiplos: Map<String, Map<Integer, List<String>>> = new HashMap<>()
- Funciona todos tipos

**Métodos**:
- **Retorno**: return new ArrayList<>() (infere tipo retorno)
- **Parâmetro**: usar(new ArrayList<>()) (infere tipo parâmetro)
- **Variável**: List<String> lista = new ArrayList<>()
- **Atribuição**: lista = new ArrayList<>()

**Limitações**:
- **var Java 10-**: precisa tipo explícito new ArrayList<String>()
- **Classe anônima**: precisa tipo new ArrayList<String>() {}
- **Array genérico**: não permitido

**Benefícios**:
- **Menos código**: conciso, não repete tipo
- **Mais legível**: tipo complexo 1 vez
- **Menos erro**: impossível dessincronia tipos
- **Refatoração**: mudar tipo 1 lugar

**Regra de Ouro**: SEMPRE usar diamond operator Java 7 ou superior. List<String> lista new ArrayList<> correto economiza código. Compilador infere tipo lado esquerdo aplica direito. Não repetir tipo List<String> lista new ArrayList<String> verbose desnecessário. Funciona tipos complexos aninhados Map<String List<Integer>> new HashMap<> infere completo. Métodos retorno parâmetro variável atribuição inferência automática. Limitações var Java 10 menos classe anônima array genérico precisam tipo explícito. Benefícios menos código conciso legível sem repetição menos erro impossível dessincronia refatoração fácil 1 lugar. SEMPRE diamond Java 7 mais economiza legível seguro.

