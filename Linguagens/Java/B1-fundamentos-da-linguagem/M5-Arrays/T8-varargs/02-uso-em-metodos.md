# Uso de Varargs em Métodos

## 🎯 Introdução e Definição

**Varargs em métodos** permite criar funções que aceitam **número flexível de argumentos**, tornando APIs mais convenientes e legíveis.

**Conceito central**: métodos podem ser chamados com diferentes quantidades de argumentos sem necessidade de sobrecarga múltipla ou arrays explícitos.

**Sintaxe em métodos**:
```java
modificadorAcesso tipoRetorno nomeMetodo(TipoFixo param1, Tipo... varargs) {
    // Lógica do método
}
```

**Exemplo básico**:
```java
public static String concatenar(String... palavras) {
    StringBuilder resultado = new StringBuilder();
    for (String palavra : palavras) {
        resultado.append(palavra).append(" ");
    }
    return resultado.toString().trim();
}

// Diferentes quantidades de argumentos
String s1 = concatenar("Java");                    // "Java"
String s2 = concatenar("Java", "é", "ótimo");     // "Java é ótimo"
String s3 = concatenar();                          // ""
```

**Vantagem**: flexibilidade sem complexidade.

## 📋 Fundamentos Teóricos

### 1️⃣ Métodos Estáticos com Varargs

**Métodos utilitários** frequentemente usam varargs:

```java
public class Matematica {
    
    public static int somar(int... numeros) {
        int soma = 0;
        for (int n : numeros) {
            soma += n;
        }
        return soma;
    }
    
    public static int max(int... numeros) {
        if (numeros.length == 0) {
            throw new IllegalArgumentException("Precisa de pelo menos 1 número");
        }
        
        int maior = numeros[0];
        for (int n : numeros) {
            if (n > maior) maior = n;
        }
        return maior;
    }
    
    public static double media(int... numeros) {
        if (numeros.length == 0) return 0;
        return (double) somar(numeros) / numeros.length;
    }
}

// Uso
int total = Matematica.somar(10, 20, 30, 40);      // 100
int maior = Matematica.max(5, 15, 3, 22, 8);       // 22
double avg = Matematica.media(10, 20, 30);         // 20.0
```

### 2️⃣ Métodos de Instância com Varargs

**Métodos de objetos** também usam varargs:

```java
public class Logger {
    private String nivel;
    
    public Logger(String nivel) {
        this.nivel = nivel;
    }
    
    public void log(String... mensagens) {
        System.out.print("[" + nivel + "] ");
        for (String msg : mensagens) {
            System.out.print(msg + " ");
        }
        System.out.println();
    }
    
    public void erro(String codigo, String... detalhes) {
        System.err.println("ERRO " + codigo + ":");
        for (String detalhe : detalhes) {
            System.err.println("  - " + detalhe);
        }
    }
}

// Uso
Logger logger = new Logger("INFO");
logger.log("Sistema", "iniciado", "com", "sucesso");
logger.erro("E001", "Falha na conexão", "Timeout após 30s", "Servidor indisponível");
```

### 3️⃣ Combinando Parâmetros Fixos e Varargs

**Parâmetros obrigatórios** + **parâmetros opcionais**:

```java
public class Relatorio {
    
    // Título obrigatório, seções opcionais
    public static void gerar(String titulo, String... secoes) {
        System.out.println("=== " + titulo + " ===");
        System.out.println();
        
        for (int i = 0; i < secoes.length; i++) {
            System.out.println((i + 1) + ". " + secoes[i]);
        }
    }
    
    // Nome e idade obrigatórios, telefones opcionais
    public static void cadastrarPessoa(String nome, int idade, String... telefones) {
        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);
        
        if (telefones.length > 0) {
            System.out.println("Telefones:");
            for (String tel : telefones) {
                System.out.println("  - " + tel);
            }
        }
    }
}

// Uso
Relatorio.gerar("Vendas Q1");  // Apenas título
Relatorio.gerar("Vendas Q1", "Introdução", "Análise", "Conclusão");

Relatorio.cadastrarPessoa("Ana", 25);  // Sem telefones
Relatorio.cadastrarPessoa("Bob", 30, "1111-1111", "2222-2222");
```

### 4️⃣ Métodos com Retorno

**Processar varargs e retornar resultado**:

```java
public class StringUtils {
    
    public static String juntar(String separador, String... partes) {
        if (partes.length == 0) return "";
        
        StringBuilder sb = new StringBuilder(partes[0]);
        for (int i = 1; i < partes.length; i++) {
            sb.append(separador).append(partes[i]);
        }
        return sb.toString();
    }
    
    public static int[] dobrar(int... numeros) {
        int[] resultado = new int[numeros.length];
        for (int i = 0; i < numeros.length; i++) {
            resultado[i] = numeros[i] * 2;
        }
        return resultado;
    }
    
    public static boolean contem(int valor, int... array) {
        for (int n : array) {
            if (n == valor) return true;
        }
        return false;
    }
}

// Uso
String csv = StringUtils.juntar(", ", "Ana", "Bob", "Carlos");
// "Ana, Bob, Carlos"

int[] dobrados = StringUtils.dobrar(1, 2, 3, 4, 5);
// [2, 4, 6, 8, 10]

boolean existe = StringUtils.contem(3, 1, 2, 3, 4, 5);  // true
```

### 5️⃣ Varargs com Tipos Primitivos

**Todos os primitivos suportados**:

```java
public class Primitivos {
    
    public static int somarInt(int... nums) {
        int soma = 0;
        for (int n : nums) soma += n;
        return soma;
    }
    
    public static double somarDouble(double... nums) {
        double soma = 0;
        for (double n : nums) soma += n;
        return soma;
    }
    
    public static boolean todos(boolean... condicoes) {
        for (boolean c : condicoes) {
            if (!c) return false;
        }
        return true;
    }
    
    public static boolean algum(boolean... condicoes) {
        for (boolean c : condicoes) {
            if (c) return true;
        }
        return false;
    }
    
    public static String concatenar(char... caracteres) {
        return new String(caracteres);
    }
}

// Uso
int total = Primitivos.somarInt(1, 2, 3, 4, 5);          // 15
double soma = Primitivos.somarDouble(1.5, 2.5, 3.0);     // 7.0
boolean ok = Primitivos.todos(true, true, true);         // true
boolean algumOk = Primitivos.algum(false, true, false);  // true
String palavra = Primitivos.concatenar('J', 'a', 'v', 'a');  // "Java"
```

### 6️⃣ Varargs com Generics

**Métodos genéricos** com varargs:

```java
public class Generics {
    
    @SafeVarargs
    public static <T> List<T> criarLista(T... elementos) {
        return new ArrayList<>(Arrays.asList(elementos));
    }
    
    @SafeVarargs
    public static <T> Set<T> criarSet(T... elementos) {
        return new HashSet<>(Arrays.asList(elementos));
    }
    
    @SafeVarargs
    public static <T> T primeiro(T... elementos) {
        if (elementos.length == 0) {
            throw new IllegalArgumentException("Array vazio");
        }
        return elementos[0];
    }
    
    @SafeVarargs
    public static <T> T ultimo(T... elementos) {
        if (elementos.length == 0) {
            throw new IllegalArgumentException("Array vazio");
        }
        return elementos[elementos.length - 1];
    }
}

// Uso
List<String> nomes = Generics.criarLista("Ana", "Bob", "Carlos");
Set<Integer> numeros = Generics.criarSet(1, 2, 3, 2, 1);  // {1, 2, 3}

String p = Generics.primeiro("Java", "Python", "C++");  // "Java"
Integer u = Generics.ultimo(10, 20, 30);                // 30
```

**@SafeVarargs**: suprime avisos de heap pollution com generics.

### 7️⃣ Métodos Privados com Varargs

**Métodos auxiliares** internos:

```java
public class Calculadora {
    
    public double calcular(String operacao, double... valores) {
        switch (operacao) {
            case "soma":
                return somar(valores);
            case "media":
                return media(valores);
            case "max":
                return maximo(valores);
            default:
                throw new IllegalArgumentException("Operação inválida");
        }
    }
    
    private double somar(double... nums) {
        double soma = 0;
        for (double n : nums) soma += n;
        return soma;
    }
    
    private double media(double... nums) {
        return nums.length == 0 ? 0 : somar(nums) / nums.length;
    }
    
    private double maximo(double... nums) {
        if (nums.length == 0) return 0;
        double max = nums[0];
        for (double n : nums) {
            if (n > max) max = n;
        }
        return max;
    }
}

// Uso
Calculadora calc = new Calculadora();
double soma = calc.calcular("soma", 10, 20, 30);      // 60.0
double media = calc.calcular("media", 10, 20, 30);    // 20.0
double max = calc.calcular("max", 10, 20, 30);        // 30.0
```

### 8️⃣ Métodos de Validação

**Verificações com múltiplos valores**:

```java
public class Validator {
    
    public static boolean todosPositivos(int... numeros) {
        for (int n : numeros) {
            if (n <= 0) return false;
        }
        return true;
    }
    
    public static boolean todosNaoNulos(Object... objetos) {
        for (Object obj : objetos) {
            if (obj == null) return false;
        }
        return true;
    }
    
    public static boolean todosNaoVazios(String... strings) {
        for (String s : strings) {
            if (s == null || s.isEmpty()) return false;
        }
        return true;
    }
    
    public static void requireNonNull(String mensagem, Object... objetos) {
        for (int i = 0; i < objetos.length; i++) {
            if (objetos[i] == null) {
                throw new NullPointerException(
                    mensagem + " (parâmetro " + i + ")"
                );
            }
        }
    }
}

// Uso
if (Validator.todosPositivos(x, y, z)) {
    // Todas coordenadas válidas
}

Validator.requireNonNull("Argumentos obrigatórios", nome, idade, email);
```

### 9️⃣ Métodos Builder Pattern

**Construção fluente** com varargs:

```java
public class Query {
    private List<String> campos = new ArrayList<>();
    private String tabela;
    private List<String> condicoes = new ArrayList<>();
    
    public Query select(String... campos) {
        this.campos.addAll(Arrays.asList(campos));
        return this;
    }
    
    public Query from(String tabela) {
        this.tabela = tabela;
        return this;
    }
    
    public Query where(String... condicoes) {
        this.condicoes.addAll(Arrays.asList(condicoes));
        return this;
    }
    
    public String build() {
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append(String.join(", ", campos));
        sql.append(" FROM ").append(tabela);
        
        if (!condicoes.isEmpty()) {
            sql.append(" WHERE ");
            sql.append(String.join(" AND ", condicoes));
        }
        
        return sql.toString();
    }
}

// Uso fluente
String sql = new Query()
    .select("id", "nome", "email")
    .from("usuarios")
    .where("ativo = true", "idade >= 18")
    .build();
// SELECT id, nome, email FROM usuarios WHERE ativo = true AND idade >= 18
```

### 🔟 Métodos de Formatação

**Composição de strings**:

```java
public class Formatter {
    
    public static String template(String template, Object... args) {
        return String.format(template, args);
    }
    
    public static String lista(String... itens) {
        if (itens.length == 0) return "";
        if (itens.length == 1) return itens[0];
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < itens.length - 1; i++) {
            sb.append(itens[i]).append(", ");
        }
        sb.append("e ").append(itens[itens.length - 1]);
        return sb.toString();
    }
    
    public static String tabela(String titulo, String[]... linhas) {
        StringBuilder sb = new StringBuilder();
        sb.append("=== ").append(titulo).append(" ===\n");
        
        for (String[] linha : linhas) {
            for (String celula : linha) {
                sb.append(String.format("%-15s", celula));
            }
            sb.append("\n");
        }
        
        return sb.toString();
    }
}

// Uso
String msg = Formatter.template("Olá %s, você tem %d anos", "Ana", 25);
// "Olá Ana, você tem 25 anos"

String compras = Formatter.lista("maçã", "banana", "laranja");
// "maçã, banana e laranja"

String tab = Formatter.tabela(
    "Produtos",
    new String[]{"ID", "Nome", "Preço"},
    new String[]{"1", "Mouse", "R$ 50"},
    new String[]{"2", "Teclado", "R$ 120"}
);
```

## 🎯 Aplicabilidade

**1. APIs de Configuração**:
```java
public void configurar(String chave, String... valores) {
    config.put(chave, Arrays.asList(valores));
}

configurar("servidores", "192.168.1.1", "192.168.1.2", "192.168.1.3");
```

**2. Logging e Debug**:
```java
public void debug(String... mensagens) {
    System.out.println("[DEBUG] " + String.join(" ", mensagens));
}

debug("Processando", "usuário", usuario.getNome());
```

**3. Factory Methods**:
```java
public static <T> List<T> listaOf(T... elementos) {
    return Arrays.asList(elementos);
}

List<Integer> nums = listaOf(1, 2, 3, 4, 5);
```

**4. Métodos de Agregação**:
```java
public double total(double... valores) {
    return Arrays.stream(valores).sum();
}

double soma = total(10.5, 20.3, 15.7);
```

**5. DSL (Domain Specific Language)**:
```java
public void executar(Runnable... tarefas) {
    for (Runnable tarefa : tarefas) {
        tarefa.run();
    }
}

executar(
    () -> System.out.println("Tarefa 1"),
    () -> System.out.println("Tarefa 2"),
    () -> System.out.println("Tarefa 3")
);
```

## ⚠️ Armadilhas Comuns

**1. Modificar Array Original**:
```java
public void zerar(int... nums) {
    Arrays.fill(nums, 0);  // Modifica array passado!
}

int[] arr = {1, 2, 3};
zerar(arr);
// arr agora é {0, 0, 0}
```

**2. Esquecer Validação de Vazio**:
```java
public int max(int... nums) {
    return nums[0];  // ❌ ArrayIndexOutOfBoundsException se vazio
}
```

**3. Ambiguidade com Sobrecarga**:
```java
void processar(String... args) { }
void processar(String s, String... args) { }

processar("teste");  // ❌ Ambíguo!
```

**4. Performance com Muitas Chamadas**:
```java
// ❌ Cria array a cada chamada
for (int i = 0; i < 1000; i++) {
    somar(1, 2, 3);  // 1000 arrays criados
}

// ✓ Reutilizar array
int[] nums = {1, 2, 3};
for (int i = 0; i < 1000; i++) {
    somar(nums);
}
```

**5. Passar Null Acidentalmente**:
```java
String[] nomes = null;
processar(nomes);  // Passa null, não array vazio!
```

## ✅ Boas Práticas

**1. Valide Argumentos Vazios**:
```java
public int max(int... nums) {
    if (nums.length == 0) {
        throw new IllegalArgumentException("Array não pode ser vazio");
    }
    // ...
}
```

**2. Use @SafeVarargs com Generics**:
```java
@SafeVarargs
public static <T> List<T> lista(T... elementos) {
    return Arrays.asList(elementos);
}
```

**3. Documente Comportamento com Zero Argumentos**:
```java
/**
 * Soma números. Retorna 0 se nenhum número fornecido.
 */
public int somar(int... numeros) {
    // ...
}
```

**4. Não Modifique Varargs Sem Documentar**:
```java
/**
 * ATENÇÃO: Modifica array original!
 */
public void ordenar(int... nums) {
    Arrays.sort(nums);
}
```

**5. Prefira Parâmetro Fixo Se Mínimo É 1**:
```java
// ✓ Força pelo menos 1 argumento
public int max(int primeiro, int... resto) {
    // ...
}

// vs
public int max(int... todos) {
    if (todos.length == 0) throw new IllegalArgumentException();
    // ...
}
```

**6. Use Nomes Claros**:
```java
// ✓ Claro
public void adicionar(String... nomes)

// ✗ Confuso
public void adicionar(String... args)
```

## 📚 Resumo Executivo

**Varargs em métodos** permite aceitar **quantidade flexível de argumentos**.

**Declaração**:
```java
modificador tipo nomeMetodo(TipoFixo param, Tipo... varargs) {
    // varargs é Tipo[]
}
```

**Exemplos práticos**:

**Soma de números**:
```java
public static int somar(int... nums) {
    int soma = 0;
    for (int n : nums) soma += n;
    return soma;
}

somar(1, 2, 3, 4, 5);  // 15
```

**Logging**:
```java
public void log(String nivel, String... msgs) {
    System.out.print("[" + nivel + "] ");
    for (String m : msgs) System.out.print(m + " ");
    System.out.println();
}

log("INFO", "Sistema", "iniciado");
```

**Factory method**:
```java
@SafeVarargs
public static <T> List<T> lista(T... elementos) {
    return Arrays.asList(elementos);
}

List<String> nomes = lista("Ana", "Bob", "Carlos");
```

**Regras**:
- ✓ Varargs deve ser **último** parâmetro
- ✓ Apenas **um** varargs por método
- ✓ Pode combinar com parâmetros fixos
- ✓ É um **array** dentro do método
- ✓ Validar se array está vazio quando necessário

**Quando usar**: métodos que naturalmente aceitam quantidade variável de argumentos (utilitários, logging, configuração, agregação, factory methods).
