# Varargs Como Array

## 🎯 Introdução e Definição

**Varargs internamente É um array** - o compilador Java converte automaticamente os argumentos variáveis em um array do tipo especificado.

**Conceito central**: quando você usa `Tipo... nome`, dentro do método você está trabalhando com `Tipo[] nome`.

**Transparência da conversão**:
```java
public static void processar(int... numeros) {
    // numeros É um int[]
    System.out.println(numeros.getClass().getName());  // [I (int array)
    System.out.println(numeros instanceof int[]);      // true (se não vazio)
    System.out.println(numeros.length);                // Funciona como array
    System.out.println(numeros[0]);                    // Acesso por índice
}

processar(10, 20, 30);
// Saída:
// [I
// true
// 3
// 10
```

**Conversão em tempo de compilação**:
```java
// Você escreve:
metodo(a, b, c);

// Compilador gera equivalente a:
metodo(new Tipo[]{a, b, c});
```

## 📋 Fundamentos Teóricos

### 1️⃣ Tipo de Dados Real

**Varargs É array internamente**:

```java
public static void analisar(String... palavras) {
    // Verificar tipo real
    System.out.println("Tipo: " + palavras.getClass().getName());
    System.out.println("É array? " + palavras.getClass().isArray());
    System.out.println("Tipo componente: " + palavras.getClass().getComponentType());
}

analisar("Java", "Python", "C++");
// Saída:
// Tipo: [Ljava.lang.String;
// É array? true
// Tipo componente: class java.lang.String
```

**Para primitivos**:
```java
public static void analisar(int... nums) {
    System.out.println(nums.getClass().getName());  // [I
}

public static void analisar(double... nums) {
    System.out.println(nums.getClass().getName());  // [D
}

public static void analisar(boolean... flags) {
    System.out.println(nums.getClass().getName());  // [Z
}
```

### 2️⃣ Acesso por Índice

**Acessar como array normal**:

```java
public static String primeiro(String... palavras) {
    if (palavras.length == 0) {
        return null;
    }
    return palavras[0];  // Acesso por índice
}

public static String ultimo(String... palavras) {
    if (palavras.length == 0) {
        return null;
    }
    return palavras[palavras.length - 1];
}

public static String elemento(int indice, String... palavras) {
    if (indice < 0 || indice >= palavras.length) {
        throw new IndexOutOfBoundsException();
    }
    return palavras[indice];
}

// Uso
String p = primeiro("Java", "Python", "C++");    // "Java"
String u = ultimo("Java", "Python", "C++");      // "C++"
String e = elemento(1, "Java", "Python", "C++"); // "Python"
```

**Iterar com índice**:
```java
public static void exibir(String... itens) {
    for (int i = 0; i < itens.length; i++) {
        System.out.println("[" + i + "] " + itens[i]);
    }
}

exibir("A", "B", "C");
// [0] A
// [1] B
// [2] C
```

### 3️⃣ Propriedade length

**Verificar quantidade de argumentos**:

```java
public static void info(int... numeros) {
    System.out.println("Recebeu " + numeros.length + " argumentos");
    
    if (numeros.length == 0) {
        System.out.println("Nenhum número fornecido");
    } else if (numeros.length == 1) {
        System.out.println("Um único número: " + numeros[0]);
    } else {
        System.out.println("Múltiplos números");
    }
}

info();           // Recebeu 0 argumentos
info(10);         // Recebeu 1 argumentos
info(10, 20, 30); // Recebeu 3 argumentos
```

**Validações baseadas em tamanho**:
```java
public static int max(int... nums) {
    if (nums.length == 0) {
        throw new IllegalArgumentException("Precisa de pelo menos 1 número");
    }
    
    int maior = nums[0];
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > maior) {
            maior = nums[i];
        }
    }
    return maior;
}
```

### 4️⃣ Enhanced For Loop

**For-each funciona porque é array**:

```java
public static int somar(int... numeros) {
    int soma = 0;
    // Enhanced for funciona com arrays
    for (int num : numeros) {
        soma += num;
    }
    return soma;
}

public static void imprimir(String... palavras) {
    for (String palavra : palavras) {
        System.out.println(palavra);
    }
}
```

**Iteração reversa**:
```java
public static void imprimirReverso(String... itens) {
    for (int i = itens.length - 1; i >= 0; i--) {
        System.out.println(itens[i]);
    }
}

imprimirReverso("A", "B", "C");
// C
// B
// A
```

### 5️⃣ Métodos de Arrays Funcionam

**Usar métodos de `java.util.Arrays`**:

```java
public static void processar(int... numeros) {
    // Arrays.toString()
    System.out.println(Arrays.toString(numeros));
    
    // Arrays.sort()
    Arrays.sort(numeros);
    System.out.println("Ordenado: " + Arrays.toString(numeros));
    
    // Arrays.binarySearch()
    int indice = Arrays.binarySearch(numeros, 30);
    System.out.println("Índice de 30: " + indice);
    
    // Arrays.fill()
    Arrays.fill(numeros, 0);
    System.out.println("Zerado: " + Arrays.toString(numeros));
}

processar(50, 10, 30, 20, 40);
// [50, 10, 30, 20, 40]
// Ordenado: [10, 20, 30, 40, 50]
// Índice de 30: 2
// Zerado: [0, 0, 0, 0, 0]
```

**Arrays.stream()**:
```java
public static void estatisticas(int... numeros) {
    if (numeros.length == 0) return;
    
    IntSummaryStatistics stats = Arrays.stream(numeros)
                                       .summaryStatistics();
    
    System.out.println("Quantidade: " + stats.getCount());
    System.out.println("Soma: " + stats.getSum());
    System.out.println("Média: " + stats.getAverage());
    System.out.println("Min: " + stats.getMin());
    System.out.println("Max: " + stats.getMax());
}

estatisticas(10, 20, 30, 40, 50);
```

### 6️⃣ Copiar Varargs

**Clonar array varargs**:

```java
public static int[] duplicar(int... original) {
    return original.clone();
}

public static int[] copiar(int... original) {
    return Arrays.copyOf(original, original.length);
}

public static int[] copiarParcial(int tamanho, int... original) {
    return Arrays.copyOf(original, Math.min(tamanho, original.length));
}

// Uso
int[] arr1 = duplicar(1, 2, 3, 4, 5);
int[] arr2 = copiar(1, 2, 3, 4, 5);
int[] arr3 = copiarParcial(3, 1, 2, 3, 4, 5);  // [1, 2, 3]
```

**Cópia defensiva**:
```java
public class Dados {
    private int[] valores;
    
    public Dados(int... valores) {
        // Cópia defensiva
        this.valores = valores.clone();
    }
    
    public int[] getValores() {
        // Retornar cópia, não referência original
        return valores.clone();
    }
}
```

### 7️⃣ Modificação do Array

**Varargs pode ser modificado**:

```java
public static void dobrar(int... numeros) {
    for (int i = 0; i < numeros.length; i++) {
        numeros[i] *= 2;
    }
}

// Array passado é modificado
int[] arr = {1, 2, 3, 4, 5};
dobrar(arr);
System.out.println(Arrays.toString(arr));
// [2, 4, 6, 8, 10]

// Argumentos diretos também criam array que poderia ser modificado
// mas não há como acessá-lo depois
dobrar(10, 20, 30);  // Array temporário modificado e descartado
```

**Cuidado com efeitos colaterais**:
```java
public static void zerar(int... nums) {
    Arrays.fill(nums, 0);  // Modifica array original!
}

int[] valores = {10, 20, 30};
zerar(valores);
System.out.println(Arrays.toString(valores));
// [0, 0, 0] - array modificado!
```

### 8️⃣ Passar Array Explicitamente

**Varargs aceita array direto**:

```java
public static int somar(int... numeros) {
    int soma = 0;
    for (int n : numeros) soma += n;
    return soma;
}

// Forma 1: argumentos separados
int s1 = somar(10, 20, 30);

// Forma 2: array explícito
int[] arr = {10, 20, 30};
int s2 = somar(arr);

// Forma 3: array anônimo
int s3 = somar(new int[]{10, 20, 30});

// Todas equivalentes
System.out.println(s1 == s2 && s2 == s3);  // true
```

**Passar null**:
```java
public static void processar(String... args) {
    if (args == null) {
        System.out.println("null recebido");
        return;
    }
    System.out.println("Array com " + args.length + " elementos");
}

// Precisa cast para distinguir de chamada vazia
processar((String[]) null);  // null recebido
processar();                  // Array com 0 elementos
```

### 9️⃣ Array Vazio vs Null

**Chamada sem argumentos = array vazio**:

```java
public static void testar(int... nums) {
    System.out.println("É null? " + (nums == null));
    System.out.println("Tamanho: " + nums.length);
    System.out.println("É vazio? " + (nums.length == 0));
}

testar();  // Chamada sem argumentos
// É null? false
// Tamanho: 0
// É vazio? true
```

**Comparação**:
```java
public static void comparar(String... args) {
    // Array vazio (chamada sem args)
    if (args.length == 0) {
        System.out.println("Nenhum argumento fornecido");
    }
    
    // Null (passou null explicitamente)
    if (args == null) {
        System.out.println("Null recebido");  // Não acontece em chamada normal
    }
}

comparar();                      // Nenhum argumento fornecido
comparar((String[]) null);       // Null recebido
```

### 🔟 Conversão para Lista/Collection

**Arrays.asList() com varargs**:

```java
public static <T> List<T> criarLista(T... elementos) {
    return Arrays.asList(elementos);
}

List<String> nomes = criarLista("Ana", "Bob", "Carlos");
List<Integer> nums = criarLista(1, 2, 3, 4, 5);
```

**Atenção com primitivos**:
```java
// ❌ Primitivos não funcionam como esperado
List<int[]> lista1 = Arrays.asList(1, 2, 3);  // ERRADO - cria List<int[]>

// ✓ Usar wrapper
List<Integer> lista2 = Arrays.asList(1, 2, 3);  // Autoboxing funciona

// ✓ Ou converter manualmente
public static List<Integer> listaInt(int... nums) {
    List<Integer> lista = new ArrayList<>();
    for (int n : nums) {
        lista.add(n);
    }
    return lista;
}
```

**Stream e Collectors**:
```java
public static <T> Set<T> criarSet(T... elementos) {
    return Arrays.stream(elementos)
                 .collect(Collectors.toSet());
}

public static List<String> criarListaMutavel(String... elementos) {
    return Arrays.stream(elementos)
                 .collect(Collectors.toList());
}
```

## 🎯 Aplicabilidade

**1. Manipulação de Array Completo**:
```java
public static int[] ordenar(int... nums) {
    int[] copia = nums.clone();
    Arrays.sort(copia);
    return copia;
}
```

**2. Busca em Array**:
```java
public static boolean contem(int valor, int... array) {
    for (int n : array) {
        if (n == valor) return true;
    }
    return false;
}

boolean existe = contem(30, 10, 20, 30, 40, 50);
```

**3. Transformação de Array**:
```java
public static int[] quadrados(int... nums) {
    int[] resultado = new int[nums.length];
    for (int i = 0; i < nums.length; i++) {
        resultado[i] = nums[i] * nums[i];
    }
    return resultado;
}
```

**4. Estatísticas de Array**:
```java
public static double desvio(double... valores) {
    if (valores.length < 2) return 0;
    
    double media = Arrays.stream(valores).average().orElse(0);
    double somaQuadrados = 0;
    
    for (double v : valores) {
        somaQuadrados += Math.pow(v - media, 2);
    }
    
    return Math.sqrt(somaQuadrados / valores.length);
}
```

**5. Conversão de Array**:
```java
public static String[] maiusculas(String... palavras) {
    String[] resultado = new String[palavras.length];
    for (int i = 0; i < palavras.length; i++) {
        resultado[i] = palavras[i].toUpperCase();
    }
    return resultado;
}
```

## ⚠️ Armadilhas Comuns

**1. Assumir Que Não É Array**:
```java
// ❌ Tratar como algo especial
public void processar(String... args) {
    // args JÁ É um array!
    String[] array = converterParaArray(args);  // Desnecessário
}

// ✓ Usar diretamente como array
public void processar(String... args) {
    for (String arg : args) {
        // ...
    }
}
```

**2. Modificar Sem Intenção**:
```java
public void ordenar(int... nums) {
    Arrays.sort(nums);  // ⚠️ Modifica array original!
}

int[] arr = {5, 2, 8, 1};
ordenar(arr);
// arr agora está ordenado
```

**3. Arrays.asList() com Primitivos**:
```java
// ❌ Não funciona como esperado
List<Integer> nums = Arrays.asList(1, 2, 3);  // Cria List<int[]>!

// ✓ Correto
List<Integer> nums = new ArrayList<>();
for (int n : new int[]{1, 2, 3}) {
    nums.add(n);
}
```

**4. Esquecer length Pode Ser Zero**:
```java
public int primeiro(int... nums) {
    return nums[0];  // ❌ ArrayIndexOutOfBoundsException se vazio
}
```

**5. Passar Null vs Vazio**:
```java
void processar(String... args) {
    for (String arg : args) {  // NullPointerException se null
        System.out.println(arg);
    }
}

processar((String[]) null);  // Lança exceção
```

## ✅ Boas Práticas

**1. Valide length Antes de Acessar**:
```java
public String primeiro(String... args) {
    if (args.length == 0) {
        throw new IllegalArgumentException("Array vazio");
    }
    return args[0];
}
```

**2. Faça Cópia Defensiva Se For Armazenar**:
```java
class Dados {
    private int[] valores;
    
    public Dados(int... valores) {
        this.valores = valores.clone();  // Cópia defensiva
    }
}
```

**3. Documente Se Modificar Array**:
```java
/**
 * Ordena array in-place. MODIFICA o array original.
 */
public void ordenar(int... nums) {
    Arrays.sort(nums);
}
```

**4. Use Métodos de Arrays**:
```java
public void processar(int... nums) {
    // ✓ Use métodos prontos
    Arrays.sort(nums);
    int indice = Arrays.binarySearch(nums, 30);
}
```

**5. Retorne Cópia Se Não Quiser Efeito Colateral**:
```java
public int[] ordenado(int... nums) {
    int[] copia = nums.clone();
    Arrays.sort(copia);
    return copia;  // Original intacto
}
```

**6. Verifique Null Quando Aceitar Array Explícito**:
```java
public void processar(String... args) {
    if (args == null) {
        args = new String[0];  // Converter null em vazio
    }
    // Agora seguro
}
```

## 📚 Resumo Executivo

**Varargs É internamente um array** - compilador converte automaticamente.

**Equivalência**:
```java
// Declaração
void metodo(int... nums)

// É equivalente a
void metodo(int[] nums)  // Mas aceita argumentos separados
```

**Uso como array**:

**Acesso por índice**:
```java
public String elemento(int i, String... palavras) {
    return palavras[i];
}
```

**Propriedade length**:
```java
public int tamanho(int... nums) {
    return nums.length;
}
```

**For-each**:
```java
public void imprimir(String... palavras) {
    for (String p : palavras) {
        System.out.println(p);
    }
}
```

**Métodos de Arrays**:
```java
public void processar(int... nums) {
    Arrays.sort(nums);
    System.out.println(Arrays.toString(nums));
}
```

**Passagem**:
```java
// Argumentos separados
metodo(1, 2, 3);

// Array explícito
metodo(new int[]{1, 2, 3});

// Variável array
int[] arr = {1, 2, 3};
metodo(arr);
```

**Array vazio vs null**:
```java
metodo();                // nums.length == 0, nums != null
metodo((Tipo[]) null);   // nums == null
```

**Características**:
- ✓ É um **array** dentro do método
- ✓ Suporta **todos os métodos de array**
- ✓ Pode ser **modificado** (efeito colateral)
- ✓ Chamada vazia = **array vazio**, não null
- ✓ Aceita **array explícito** ou argumentos separados

**Use como array normal**: acesso por índice, length, loops, métodos utilitários.
