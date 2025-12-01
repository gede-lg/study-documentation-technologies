# Sintaxe de Varargs (...)

## 🎯 Introdução e Definição

**Varargs** (Variable Arguments) é um recurso do Java que permite passar **número variável de argumentos** para um método usando a sintaxe **`...`** (três pontos).

**Conceito central**: método pode aceitar **zero ou mais** argumentos do mesmo tipo sem precisar criar array explicitamente.

**Sintaxe fundamental**:
```java
modificador tipoRetorno nomeMetodo(TipoParametro... nomeParametro) {
    // nomeParametro é tratado como array
}
```

**Exemplo básico**:
```java
public static void imprimir(String... palavras) {
    for (String palavra : palavras) {
        System.out.println(palavra);
    }
}

// Chamadas válidas
imprimir();                           // 0 argumentos
imprimir("Java");                     // 1 argumento
imprimir("Java", "Python", "C++");    // 3 argumentos
```

**Antes do varargs (Java < 5)**:
```java
// Obrigado a passar array explicitamente
public static void imprimir(String[] palavras) { }

imprimir(new String[]{"Java", "Python"});  // Verboso
```

**Com varargs (Java 5+)**:
```java
public static void imprimir(String... palavras) { }

imprimir("Java", "Python");  // Simples e direto
```

## 📋 Fundamentos Teóricos

### 1️⃣ Sintaxe dos Três Pontos (...)

**Declaração básica**:

```java
public static int somar(int... numeros) {
    int soma = 0;
    for (int num : numeros) {
        soma += num;
    }
    return soma;
}

// Uso
int resultado1 = somar(1, 2, 3);           // 6
int resultado2 = somar(10, 20, 30, 40);    // 100
int resultado3 = somar();                  // 0 (sem argumentos)
```

**Posição dos três pontos**:
```java
// ✓ Correto - antes do nome do parâmetro
void metodo(String... args)

// ✓ Também correto - com espaço
void metodo(String ... args)

// ✓ Também correto - sem espaço antes
void metodo(String ...args)

// ❌ Incorreto - depois do nome
void metodo(String args...)
```

### 2️⃣ Varargs Como Array Internamente

**Varargs É um array** dentro do método:

```java
public static void processar(int... numeros) {
    // numeros é int[]
    System.out.println(numeros.length);
    System.out.println(numeros.getClass().getName());  // [I (int array)
    
    // Pode usar como array
    if (numeros.length > 0) {
        System.out.println("Primeiro: " + numeros[0]);
    }
}

processar(10, 20, 30);
// Saída:
// 3
// [I
// Primeiro: 10
```

**Acesso por índice**:
```java
public static String concatenar(String... palavras) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < palavras.length; i++) {
        sb.append(palavras[i]);
        if (i < palavras.length - 1) {
            sb.append(" ");
        }
    }
    return sb.toString();
}

String frase = concatenar("Olá", "mundo", "Java");
// "Olá mundo Java"
```

### 3️⃣ Chamada com Zero Argumentos

**Varargs permite chamadas sem argumentos**:

```java
public static void exibir(String... mensagens) {
    if (mensagens.length == 0) {
        System.out.println("Nenhuma mensagem");
    } else {
        for (String msg : mensagens) {
            System.out.println(msg);
        }
    }
}

exibir();  // Válido - array vazio
// Saída: Nenhuma mensagem
```

**Array vazio vs null**:
```java
public static void testar(int... nums) {
    System.out.println(nums == null);      // false
    System.out.println(nums.length);       // 0
}

testar();  // nums é int[0], NÃO null
```

### 4️⃣ Passando Array Explicitamente

**Pode passar array diretamente**:

```java
public static int max(int... numeros) {
    if (numeros.length == 0) {
        throw new IllegalArgumentException("Precisa de pelo menos 1 número");
    }
    
    int maior = numeros[0];
    for (int num : numeros) {
        if (num > maior) maior = num;
    }
    return maior;
}

// Forma 1: argumentos separados
int m1 = max(10, 5, 30, 15);

// Forma 2: array explícito
int[] valores = {10, 5, 30, 15};
int m2 = max(valores);

// Ambas funcionam!
System.out.println(m1 == m2);  // true
```

**Passando null**:
```java
public static void processar(String... itens) {
    if (itens == null) {
        System.out.println("Null recebido");
    } else {
        System.out.println("Array com " + itens.length + " elementos");
    }
}

processar((String[]) null);  // Cast necessário
// Saída: Null recebido

processar();
// Saída: Array com 0 elementos
```

### 5️⃣ Tipos Primitivos e Objetos

**Primitivos**:

```java
public static double media(int... numeros) {
    if (numeros.length == 0) return 0;
    
    int soma = 0;
    for (int n : numeros) {
        soma += n;
    }
    return (double) soma / numeros.length;
}

double m = media(10, 20, 30, 40);  // 25.0
```

**Objetos**:
```java
public static void cadastrar(String nome, String... telefones) {
    System.out.println("Nome: " + nome);
    System.out.println("Telefones:");
    for (String tel : telefones) {
        System.out.println("  - " + tel);
    }
}

cadastrar("João", "1111-1111", "2222-2222", "3333-3333");
// Nome: João
// Telefones:
//   - 1111-1111
//   - 2222-2222
//   - 3333-3333
```

**Generics com varargs**:
```java
@SafeVarargs
public static <T> List<T> criarLista(T... elementos) {
    return new ArrayList<>(Arrays.asList(elementos));
}

List<String> nomes = criarLista("Ana", "Bob", "Carlos");
List<Integer> nums = criarLista(1, 2, 3, 4, 5);
```

### 6️⃣ Varargs com Outros Parâmetros

**Varargs pode combinar com parâmetros fixos**:

```java
// ✓ Parâmetros fixos ANTES de varargs
public static String formatar(String formato, Object... args) {
    return String.format(formato, args);
}

String msg = formatar("Nome: %s, Idade: %d", "Ana", 25);
// "Nome: Ana, Idade: 25"
```

**Ordem importa**:
```java
// ✓ Correto - varargs por último
void metodo1(String nome, int... numeros) { }

void metodo2(int x, int y, String... palavras) { }

// ❌ Incorreto - varargs não é último
void metodo3(int... numeros, String nome) { }  // ERRO DE COMPILAÇÃO
```

### 7️⃣ Apenas Um Varargs Por Método

**Limite de um varargs**:

```java
// ✓ Correto - um varargs
void metodo(int... numeros) { }

// ❌ Incorreto - dois varargs
void metodo(int... nums1, String... palavras) { }  // ERRO

// ❌ Incorreto - varargs no meio
void metodo(int... nums, String nome) { }  // ERRO
```

**Workaround com arrays**:
```java
// Se realmente precisa de múltiplos conjuntos variáveis
public static void processar(int[] numeros, String[] palavras) {
    // Usar arrays normais
}

processar(new int[]{1, 2, 3}, new String[]{"a", "b"});
```

### 8️⃣ Modificação do Array Varargs

**Varargs pode ser modificado**:

```java
public static void dobrar(int... numeros) {
    for (int i = 0; i < numeros.length; i++) {
        numeros[i] *= 2;
    }
}

int[] valores = {1, 2, 3, 4, 5};
dobrar(valores);
System.out.println(Arrays.toString(valores));
// [2, 4, 6, 8, 10] - array modificado!
```

**Cuidado com efeitos colaterais**:
```java
public static void processar(String... palavras) {
    if (palavras.length > 0) {
        palavras[0] = "MODIFICADO";  // Modifica array original
    }
}

String[] arr = {"Ana", "Bob"};
processar(arr);
System.out.println(arr[0]);  // "MODIFICADO"
```

### 9️⃣ Varargs em Construtores

**Construtores também aceitam varargs**:

```java
class Equipe {
    private String[] membros;
    
    public Equipe(String... nomes) {
        this.membros = nomes.clone();  // Cópia defensiva
    }
    
    public void listar() {
        for (String membro : membros) {
            System.out.println(membro);
        }
    }
}

Equipe equipe1 = new Equipe("Ana", "Bob", "Carlos");
Equipe equipe2 = new Equipe();  // Equipe vazia
```

### 🔟 Printf e Varargs

**printf usa varargs internamente**:

```java
// Assinatura de System.out.printf
public PrintStream printf(String format, Object... args)

// Exemplos de uso
System.out.printf("Nome: %s%n", "Ana");
System.out.printf("Idade: %d, Altura: %.2f%n", 25, 1.65);
System.out.printf("%s tem %d anos e %.2f de altura%n", "Bob", 30, 1.80);
```

**String.format() também**:
```java
String msg1 = String.format("Total: R$ %.2f", 150.50);
String msg2 = String.format("%s: %d pontos", "João", 95);
```

**Métodos úteis com varargs**:
```java
// Arrays.asList()
List<String> lista = Arrays.asList("A", "B", "C");

// Collections.addAll()
List<Integer> nums = new ArrayList<>();
Collections.addAll(nums, 1, 2, 3, 4, 5);

// EnumSet.of()
EnumSet<DayOfWeek> dias = EnumSet.of(MONDAY, WEDNESDAY, FRIDAY);
```

## 🎯 Aplicabilidade

**1. Somar Números Variáveis**:
```java
public static int somar(int... numeros) {
    return Arrays.stream(numeros).sum();
}

int total = somar(10, 20, 30, 40, 50);
```

**2. Logger com Múltiplas Mensagens**:
```java
public static void log(String nivel, String... mensagens) {
    System.out.print("[" + nivel + "] ");
    for (String msg : mensagens) {
        System.out.print(msg + " ");
    }
    System.out.println();
}

log("INFO", "Aplicação", "iniciada", "com", "sucesso");
```

**3. Configuração Flexível**:
```java
public static void configurar(String chave, String... valores) {
    System.out.println(chave + " = " + Arrays.toString(valores));
}

configurar("servidores", "192.168.1.1", "192.168.1.2");
configurar("porta", "8080");
```

**4. Factory Methods**:
```java
public static <T> Set<T> criarSet(T... elementos) {
    return new HashSet<>(Arrays.asList(elementos));
}

Set<Integer> nums = criarSet(1, 2, 3, 4, 5);
```

**5. Validação de Múltiplos Valores**:
```java
public static boolean todos(boolean... condicoes) {
    for (boolean c : condicoes) {
        if (!c) return false;
    }
    return true;
}

if (todos(x > 0, y > 0, z > 0)) {
    // Todas coordenadas positivas
}
```

## ⚠️ Armadilhas Comuns

**1. Varargs Não É Último Parâmetro**:
```java
// ❌ Erro de compilação
void metodo(int... nums, String nome) { }
```

**2. Múltiplos Varargs**:
```java
// ❌ Erro de compilação
void metodo(int... nums, String... palavras) { }
```

**3. Ambiguidade com Sobrecarga**:
```java
void processar(int... nums) { }
void processar(int n, int... nums) { }

processar(10);  // ❌ Ambíguo - qual método chamar?
```

**4. Modificação Não Intencional**:
```java
void zerar(int... nums) {
    Arrays.fill(nums, 0);  // Modifica array original!
}

int[] arr = {1, 2, 3};
zerar(arr);
// arr agora é {0, 0, 0}
```

**5. Null vs Array Vazio**:
```java
void processar(String... args) {
    System.out.println(args.length);  // NullPointerException se null
}

processar((String[]) null);  // Pode lançar exceção
```

## ✅ Boas Práticas

**1. Use Varargs para Simplicidade**:
```java
// ✓ Simples
int total = somar(1, 2, 3, 4, 5);

// vs array explícito
int total = somar(new int[]{1, 2, 3, 4, 5});
```

**2. Valide Argumentos Vazios**:
```java
public static int max(int... nums) {
    if (nums.length == 0) {
        throw new IllegalArgumentException("Precisa de pelo menos 1 número");
    }
    // ...
}
```

**3. Evite Modificar Varargs**:
```java
// ✓ Cópia defensiva se precisar modificar
public static void processar(int... nums) {
    int[] copia = nums.clone();
    // Modificar copia, não nums
}
```

**4. @SafeVarargs para Generics**:
```java
@SafeVarargs
public static <T> List<T> criarLista(T... elementos) {
    return Arrays.asList(elementos);
}
```

**5. Prefira Varargs a Arrays Quando Apropriado**:
```java
// ✓ Mais intuitivo com varargs
void adicionar(String... nomes) { }
adicionar("Ana", "Bob");

// Menos intuitivo com array
void adicionar(String[] nomes) { }
adicionar(new String[]{"Ana", "Bob"});
```

**6. Combine com Parâmetros Obrigatórios**:
```java
// Pelo menos um argumento obrigatório
public static int max(int primeiro, int... resto) {
    int max = primeiro;
    for (int n : resto) {
        if (n > max) max = n;
    }
    return max;
}

// Força pelo menos 1 argumento
max(10, 20, 30);  // ✓
max();            // ❌ Erro de compilação
```

## 📚 Resumo Executivo

**Varargs** permite métodos aceitarem **número variável de argumentos**.

**Sintaxe**:
```java
void metodo(Tipo... nome) {
    // nome é Tipo[] internamente
}
```

**Chamadas**:
```java
metodo();                    // 0 argumentos
metodo(a);                   // 1 argumento
metodo(a, b, c);            // 3 argumentos
metodo(new Tipo[]{a, b});   // Array explícito
```

**Regras**:
- ✓ Apenas **um** varargs por método
- ✓ Deve ser **último** parâmetro
- ✓ Pode combinar com parâmetros fixos antes
- ✓ É um **array** dentro do método
- ✓ Permite **zero** argumentos

**Exemplo completo**:
```java
public static void exibir(String titulo, int... numeros) {
    System.out.println(titulo);
    for (int num : numeros) {
        System.out.println("  - " + num);
    }
}

exibir("Números:", 10, 20, 30);
// Números:
//   - 10
//   - 20
//   - 30
```

**Comparação**:
```java
// Sem varargs
void metodo(int[] nums) { }
metodo(new int[]{1, 2, 3});  // Verboso

// Com varargs
void metodo(int... nums) { }
metodo(1, 2, 3);  // Simples
```

**Quando usar**: métodos que naturalmente aceitam quantidade variável de argumentos do mesmo tipo (soma, concatenação, logging, factory methods).
