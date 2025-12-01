# T2.05 - Principais Exceções Comuns

## Introdução

Exceções mais **frequentes** em Java que todo desenvolvedor encontra.

```java
/*
 * EXCEÇÕES MAIS COMUNS
 * 
 * RuntimeException (unchecked):
 *   1. NullPointerException ← Objeto null
 *   2. ArrayIndexOutOfBoundsException ← Índice inválido
 *   3. IllegalArgumentException ← Argumento inválido
 *   4. NumberFormatException ← Conversão inválida
 * 
 * Checked:
 *   5. IOException ← Problemas I/O
 *   6. SQLException ← Problemas BD
 */

// As 4 MAIS COMUNS (todas RuntimeException):
String texto = null;
texto.length();  // 1. NullPointerException

int[] array = {1, 2, 3};
int x = array[10];  // 2. ArrayIndexOutOfBoundsException

Thread.sleep(-1000);  // 3. IllegalArgumentException

int numero = Integer.parseInt("abc");  // 4. NumberFormatException
```

---

## 1. NullPointerException (NPE)

### Definição

**NullPointerException** = tentar usar objeto **null**.

```java
// ❌ Causa: objeto null
String texto = null;
texto.length();  // NullPointerException
```

### Situações Comuns

```java
public class NullPointerExemplos {
    
    // 1. Chamar método em objeto null
    public static void exemplo1() {
        String texto = null;
        System.out.println(texto.length());  // ❌ NPE
    }
    
    // 2. Acessar campo de objeto null
    public static void exemplo2() {
        Pessoa pessoa = null;
        System.out.println(pessoa.nome);  // ❌ NPE
    }
    
    // 3. Autoboxing/unboxing com null
    public static void exemplo3() {
        Integer numero = null;
        int valor = numero;  // ❌ NPE (unboxing)
    }
    
    // 4. Array de objetos com elementos null
    public static void exemplo4() {
        String[] nomes = new String[3];
        System.out.println(nomes[0].length());  // ❌ NPE (elemento null)
    }
    
    // 5. Retorno de método null
    public static void exemplo5() {
        String resultado = metodoQueRetornaNull();
        System.out.println(resultado.toUpperCase());  // ❌ NPE
    }
    
    // 6. Encadeamento de chamadas
    public static void exemplo6() {
        Pessoa pessoa = new Pessoa();
        System.out.println(pessoa.getEndereco().getCidade());  // ❌ NPE se getEndereco() retorna null
    }
    
    private static String metodoQueRetornaNull() {
        return null;
    }
    
    static class Pessoa {
        String nome;
        
        public Endereco getEndereco() {
            return null;
        }
    }
    
    static class Endereco {
        public String getCidade() {
            return "São Paulo";
        }
    }
}
```

### Prevenir NullPointerException

```java
public class PrevenirNPE {
    
    // ✅ 1. Validar parâmetros
    public static void processar(String texto) {
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser null");
        }
        System.out.println(texto.length());  // ✅ Seguro
    }
    
    // ✅ 2. Verificar antes de usar
    public static void imprimir(String texto) {
        if (texto != null) {
            System.out.println(texto.toUpperCase());
        } else {
            System.out.println("Texto vazio");
        }
    }
    
    // ✅ 3. Usar Optional (Java 8+)
    public static void comOptional(String texto) {
        Optional<String> opt = Optional.ofNullable(texto);
        opt.ifPresent(t -> System.out.println(t.toUpperCase()));
    }
    
    // ✅ 4. Retornar valor padrão ao invés de null
    public static String obterNome(Pessoa pessoa) {
        return pessoa != null && pessoa.nome != null 
               ? pessoa.nome 
               : "Anônimo";
    }
    
    // ✅ 5. Usar Objects.requireNonNull
    public static void definirNome(String nome) {
        this.nome = Objects.requireNonNull(nome, "Nome não pode ser null");
    }
    
    // ✅ 6. Inicializar coleções vazias (não null)
    private List<String> lista = new ArrayList<>();  // ✅ Vazia (não null)
    // private List<String> lista = null;  // ❌ null
    
    static class Pessoa {
        String nome;
    }
}
```

---

## 2. ArrayIndexOutOfBoundsException

### Definição

**ArrayIndexOutOfBoundsException** = acessar índice **inválido** de array.

```java
// ❌ Causa: índice fora dos limites
int[] array = {1, 2, 3};  // Índices válidos: 0, 1, 2
int x = array[10];        // ❌ ArrayIndexOutOfBoundsException
```

### Situações Comuns

```java
public class ArrayIndexExemplos {
    
    // 1. Índice maior que tamanho
    public static void exemplo1() {
        int[] numeros = {10, 20, 30};
        System.out.println(numeros[5]);  // ❌ Índice 5 (tamanho: 3)
    }
    
    // 2. Índice negativo
    public static void exemplo2() {
        int[] numeros = {10, 20, 30};
        System.out.println(numeros[-1]);  // ❌ Índice negativo
    }
    
    // 3. Loop com condição errada
    public static void exemplo3() {
        int[] numeros = {10, 20, 30};
        for (int i = 0; i <= numeros.length; i++) {  // ❌ <= (deveria ser <)
            System.out.println(numeros[i]);  // ❌ Quando i == 3
        }
    }
    
    // 4. Array vazio
    public static void exemplo4() {
        int[] numeros = {};
        System.out.println(numeros[0]);  // ❌ Array vazio
    }
    
    // 5. Off-by-one error
    public static void exemplo5() {
        int[] numeros = {10, 20, 30};
        System.out.println(numeros[numeros.length]);  // ❌ Índice 3 (max: 2)
    }
}
```

### Prevenir ArrayIndexOutOfBoundsException

```java
public class PrevenirArrayIndex {
    
    // ✅ 1. Validar índice antes de acessar
    public static int obterElemento(int[] array, int indice) {
        if (indice < 0 || indice >= array.length) {
            throw new IllegalArgumentException(
                "Índice inválido: " + indice + " (tamanho: " + array.length + ")"
            );
        }
        return array[indice];
    }
    
    // ✅ 2. Usar for-each (não acessa índice)
    public static void imprimirArray(int[] array) {
        for (int numero : array) {  // ✅ Não usa índice
            System.out.println(numero);
        }
    }
    
    // ✅ 3. Loop correto (i < length, NÃO <=)
    public static void percorrer(int[] array) {
        for (int i = 0; i < array.length; i++) {  // ✅ i < length
            System.out.println(array[i]);
        }
    }
    
    // ✅ 4. Verificar se array não está vazio
    public static int primeiro(int[] array) {
        if (array == null || array.length == 0) {
            throw new IllegalArgumentException("Array vazio ou null");
        }
        return array[0];
    }
    
    // ✅ 5. Usar métodos de Arrays/Collections
    public static void usarArrays() {
        int[] array = {1, 2, 3};
        
        // Stream (não acessa índice diretamente)
        Arrays.stream(array).forEach(System.out::println);
        
        // Copiar com validação
        int[] copia = Arrays.copyOf(array, array.length);
    }
    
    // ✅ 6. Usar lista ao invés de array (mais seguro)
    public static void usarLista() {
        List<Integer> lista = Arrays.asList(1, 2, 3);
        
        // get() lança IndexOutOfBoundsException (mais clara)
        try {
            lista.get(10);
        } catch (IndexOutOfBoundsException e) {
            System.out.println("Índice inválido");
        }
    }
}
```

---

## 3. IllegalArgumentException

### Definição

**IllegalArgumentException** = argumento **inválido** passado para método.

```java
// ❌ Causa: argumento inválido
Thread.sleep(-1000);  // IllegalArgumentException: timeout negativo
```

### Quando Lançar

```java
public class IllegalArgumentExemplos {
    
    // 1. Parâmetro null quando não aceita
    public static void definirNome(String nome) {
        if (nome == null) {
            throw new IllegalArgumentException("Nome não pode ser null");
        }
        // ...
    }
    
    // 2. Valor fora do intervalo válido
    public static void definirIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException(
                "Idade inválida: " + idade + " (deve estar entre 0-150)"
            );
        }
        // ...
    }
    
    // 3. String vazia quando não aceita
    public static void definirEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email não pode ser vazio");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Email inválido: " + email);
        }
        // ...
    }
    
    // 4. Coleção vazia quando não aceita
    public static int calcularMedia(List<Integer> numeros) {
        if (numeros == null || numeros.isEmpty()) {
            throw new IllegalArgumentException("Lista não pode ser vazia");
        }
        return numeros.stream().mapToInt(Integer::intValue).sum() / numeros.size();
    }
    
    // 5. Valor negativo quando não aceita
    public static void esperar(long milissegundos) {
        if (milissegundos < 0) {
            throw new IllegalArgumentException(
                "Milissegundos não pode ser negativo: " + milissegundos
            );
        }
        // ...
    }
    
    // 6. Combinação inválida de parâmetros
    public static void transferir(int origem, int destino, double valor) {
        if (origem == destino) {
            throw new IllegalArgumentException("Origem e destino não podem ser iguais");
        }
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo: " + valor);
        }
        // ...
    }
    
    // 7. Formato inválido
    public static void definirTelefone(String telefone) {
        if (!telefone.matches("\\d{10,11}")) {
            throw new IllegalArgumentException(
                "Telefone inválido: " + telefone + " (esperado: 10-11 dígitos)"
            );
        }
        // ...
    }
}
```

### IllegalArgumentException vs NullPointerException

```java
public class IllegalArgumentVsNPE {
    
    // ✅ IllegalArgumentException: validação EXPLÍCITA
    public static void setNome1(String nome) {
        if (nome == null) {
            throw new IllegalArgumentException("Nome não pode ser null");
        }
        if (nome.isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        // ...
    }
    
    // ❌ NullPointerException: validação IMPLÍCITA
    public static void setNome2(String nome) {
        // Se nome == null → NullPointerException
        if (nome.isEmpty()) {  // ❌ NPE aqui (não clara)
            throw new IllegalArgumentException("Nome vazio");
        }
        // ...
    }
    
    // ✅ CORRETO: validar null EXPLICITAMENTE
    public static void processar(String texto) {
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser null");
        }
        // ✅ Agora seguro
        System.out.println(texto.length());
    }
}
```

---

## 4. NumberFormatException

### Definição

**NumberFormatException** = **conversão inválida** de String para número.

```java
// ❌ Causa: String não é número
int numero = Integer.parseInt("abc");  // NumberFormatException
```

### Situações Comuns

```java
public class NumberFormatExemplos {
    
    // 1. String não numérica
    public static void exemplo1() {
        int numero = Integer.parseInt("abc");  // ❌ "abc" não é número
    }
    
    // 2. String vazia
    public static void exemplo2() {
        int numero = Integer.parseInt("");  // ❌ String vazia
    }
    
    // 3. String com espaços
    public static void exemplo3() {
        int numero = Integer.parseInt(" 123 ");  // ❌ Espaços
    }
    
    // 4. Número decimal em Integer
    public static void exemplo4() {
        int numero = Integer.parseInt("12.5");  // ❌ Decimal (usar Double)
    }
    
    // 5. Número muito grande
    public static void exemplo5() {
        int numero = Integer.parseInt("99999999999");  // ❌ Maior que Integer.MAX_VALUE
    }
    
    // 6. Sinal incorreto
    public static void exemplo6() {
        int numero = Integer.parseInt("--123");  // ❌ Dois sinais
    }
    
    // 7. Caracteres especiais
    public static void exemplo7() {
        int numero = Integer.parseInt("123,45");  // ❌ Vírgula (usar ponto)
    }
}
```

### Prevenir NumberFormatException

```java
public class PrevenirNumberFormat {
    
    // ✅ 1. Validar com regex ANTES de converter
    public static Integer converterComValidacao(String texto) {
        if (texto == null || !texto.matches("-?\\d+")) {
            return null;  // OU throw IllegalArgumentException
        }
        return Integer.parseInt(texto);
    }
    
    // ✅ 2. Tratar exceção (input do usuário)
    public static Integer converterSeguro(String texto) {
        try {
            return Integer.parseInt(texto);
        } catch (NumberFormatException e) {
            System.err.println("Entrada inválida: " + texto);
            return null;  // OU valor padrão
        }
    }
    
    // ✅ 3. Usar valor padrão
    public static int converterComPadrao(String texto, int padrao) {
        try {
            return Integer.parseInt(texto);
        } catch (NumberFormatException e) {
            return padrao;
        }
    }
    
    // ✅ 4. Limpar String antes de converter
    public static int converterLimpo(String texto) {
        if (texto == null) {
            throw new IllegalArgumentException("Texto null");
        }
        
        // Remover espaços
        texto = texto.trim();
        
        // Validar
        if (!texto.matches("-?\\d+")) {
            throw new IllegalArgumentException("Não é número: " + texto);
        }
        
        return Integer.parseInt(texto);
    }
    
    // ✅ 5. Usar Optional
    public static Optional<Integer> converterOptional(String texto) {
        try {
            return Optional.of(Integer.parseInt(texto));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }
    
    // ✅ 6. Método auxiliar reutilizável
    public static boolean isNumerico(String texto) {
        if (texto == null || texto.isEmpty()) {
            return false;
        }
        return texto.matches("-?\\d+");
    }
    
    public static void exemploUso() {
        String input = "123";
        
        if (isNumerico(input)) {
            int numero = Integer.parseInt(input);  // ✅ Seguro
            System.out.println("Número: " + numero);
        } else {
            System.out.println("Entrada inválida");
        }
    }
}
```

---

## Comparação das 4 Principais

```java
/*
 * COMPARAÇÃO DAS 4 PRINCIPAIS RUNTIMEEXCEPTIONS
 * 
 * 1. NullPointerException
 *    Causa: Objeto null
 *    Prevenir: if (obj != null)
 *    Exemplo: String s = null; s.length()
 * 
 * 2. ArrayIndexOutOfBoundsException
 *    Causa: Índice inválido
 *    Prevenir: if (i >= 0 && i < array.length)
 *    Exemplo: int[] a = {1,2,3}; a[10]
 * 
 * 3. IllegalArgumentException
 *    Causa: Argumento inválido
 *    Prevenir: Validar parâmetros (throw IllegalArgumentException)
 *    Exemplo: if (idade < 0) throw new IllegalArgumentException(...)
 * 
 * 4. NumberFormatException
 *    Causa: Conversão inválida
 *    Prevenir: Validar com regex ou try-catch
 *    Exemplo: Integer.parseInt("abc")
 */

public class ComparacaoQuatroPrincipais {
    
    public static void demonstrar() {
        System.out.println("=== 4 Principais RuntimeExceptions ===\n");
        
        // 1. NullPointerException
        System.out.println("1. NullPointerException:");
        String texto = null;
        try {
            texto.length();
        } catch (NullPointerException e) {
            System.out.println("   ❌ Objeto null");
            System.out.println("   ✅ Prevenir: if (texto != null)");
        }
        System.out.println();
        
        // 2. ArrayIndexOutOfBoundsException
        System.out.println("2. ArrayIndexOutOfBoundsException:");
        int[] array = {1, 2, 3};
        try {
            int x = array[10];
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("   ❌ Índice 10 (tamanho: 3)");
            System.out.println("   ✅ Prevenir: if (i < array.length)");
        }
        System.out.println();
        
        // 3. IllegalArgumentException
        System.out.println("3. IllegalArgumentException:");
        try {
            definirIdade(-5);
        } catch (IllegalArgumentException e) {
            System.out.println("   ❌ " + e.getMessage());
            System.out.println("   ✅ Prevenir: validar parâmetros");
        }
        System.out.println();
        
        // 4. NumberFormatException
        System.out.println("4. NumberFormatException:");
        try {
            int numero = Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            System.out.println("   ❌ \"abc\" não é número");
            System.out.println("   ✅ Prevenir: validar com regex");
        }
    }
    
    private static void definirIdade(int idade) {
        if (idade < 0) {
            throw new IllegalArgumentException("Idade negativa: " + idade);
        }
    }
}
```

---

## Outras Exceções Comuns

### ClassCastException

```java
// ❌ ClassCastException: cast inválido
Object obj = "texto";
Integer numero = (Integer) obj;  // ❌ String não é Integer

// ✅ Prevenir: usar instanceof
if (obj instanceof Integer) {
    Integer numero = (Integer) obj;  // ✅ Seguro
}
```

### IllegalStateException

```java
// ❌ IllegalStateException: estado inválido
Iterator<Integer> it = lista.iterator();
it.remove();  // ❌ Sem chamar next() antes

// ✅ Prevenir: validar estado
if (it.hasNext()) {
    it.next();
    it.remove();  // ✅ Seguro
}
```

### UnsupportedOperationException

```java
// ❌ UnsupportedOperationException: operação não suportada
List<Integer> lista = Arrays.asList(1, 2, 3);
lista.add(4);  // ❌ Lista imutável (Arrays.asList)

// ✅ Prevenir: usar lista mutável
List<Integer> lista = new ArrayList<>(Arrays.asList(1, 2, 3));
lista.add(4);  // ✅ OK
```

---

## Boas Práticas

### 1. Validar Parâmetros (Fail-Fast)

```java
// ✅ Validar no INÍCIO do método
public void processar(String texto, int idade) {
    // Validar PRIMEIRO
    if (texto == null) {
        throw new IllegalArgumentException("Texto null");
    }
    if (idade < 0) {
        throw new IllegalArgumentException("Idade negativa");
    }
    
    // Agora seguro
    System.out.println(texto.toUpperCase());
    System.out.println("Idade: " + idade);
}
```

### 2. Usar Objects.requireNonNull

```java
// ✅ Validar null de forma concisa
import java.util.Objects;

public void setNome(String nome) {
    this.nome = Objects.requireNonNull(nome, "Nome não pode ser null");
}
```

### 3. Mensagens Descritivas

```java
// ❌ Mensagem genérica
throw new IllegalArgumentException("Inválido");

// ✅ Mensagem descritiva
throw new IllegalArgumentException(
    "Idade inválida: " + idade + " (esperado: 0-150)"
);
```

### 4. Documentar Validações

```java
/**
 * Define a idade da pessoa.
 * 
 * @param idade Idade (deve estar entre 0-150)
 * @throws IllegalArgumentException se idade < 0 ou idade > 150
 */
public void setIdade(int idade) {
    if (idade < 0 || idade > 150) {
        throw new IllegalArgumentException("Idade inválida: " + idade);
    }
    this.idade = idade;
}
```

### 5. Prevenir ao Invés de Tratar

```java
// ❌ Tratar RuntimeException
try {
    int resultado = a / b;
} catch (ArithmeticException e) {
    // ...
}

// ✅ Prevenir com validação
if (b == 0) {
    throw new IllegalArgumentException("Divisor zero");
}
int resultado = a / b;  // ✅ Seguro
```

---

## Resumo

**4 Principais RuntimeExceptions**:

**1. NullPointerException**:
- **Causa**: Objeto null
- **Prevenir**: `if (obj != null)`
- **Exemplo**: `String s = null; s.length()`

**2. ArrayIndexOutOfBoundsException**:
- **Causa**: Índice inválido
- **Prevenir**: `if (i >= 0 && i < array.length)`
- **Exemplo**: `int[] a = {1,2,3}; a[10]`

**3. IllegalArgumentException**:
- **Causa**: Argumento inválido
- **Prevenir**: Validar e lançar `IllegalArgumentException`
- **Exemplo**: `if (idade < 0) throw new IllegalArgumentException(...)`

**4. NumberFormatException**:
- **Causa**: Conversão inválida String→número
- **Prevenir**: Validar com regex ou try-catch
- **Exemplo**: `Integer.parseInt("abc")`

**Outras comuns**:
- **ClassCastException**: cast inválido (prevenir com `instanceof`)
- **IllegalStateException**: estado inválido
- **UnsupportedOperationException**: operação não suportada

**Boas Práticas**:
- **Validar** parâmetros no início (fail-fast)
- Usar `Objects.requireNonNull` para null
- Mensagens **descritivas**
- **Documentar** validações com `@throws`
- **Prevenir** ao invés de tratar RuntimeException

**Regra de Ouro**: RuntimeExceptions são **bugs**. **Prevenir** com validações. Lançar **IllegalArgumentException** para parâmetros inválidos. Validar **null** explicitamente. Usar **regex** para validar conversões. **Não** capturar RuntimeException (exceto input usuário).
