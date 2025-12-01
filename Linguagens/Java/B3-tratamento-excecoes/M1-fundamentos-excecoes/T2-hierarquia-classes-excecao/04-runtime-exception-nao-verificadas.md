# T2.04 - RuntimeException: Exceções Não Verificadas

## Introdução

**RuntimeException** representa erros de **programação** (bugs) que **não** precisam ser declarados/tratados.

```java
/*
 * HIERARQUIA RUNTIMEEXCEPTION
 * 
 *                  Throwable
 *                      |
 *          ┌───────────┴───────────┐
 *          |                       |
 *        Error                 Exception
 *                                  |
 *                      ┌───────────┴──────────┐
 *                      |                      |
 *              RuntimeException         Checked Exceptions
 *               (UNCHECKED)              (verificadas)
 *                      |
 *          ┌───────────┼───────────┬────────────┬──────────┐
 *          |           |           |            |          |
 *    NullPointer  Arithmetic  IndexOutOf  IllegalArg  ClassCast
 *    Exception    Exception   Bounds      Exception   Exception
 *                             Exception
 */

// ✅ RUNTIMEEXCEPTION: erro de programação (NÃO obriga tratar)
public static void dividir(int a, int b) {
    int resultado = a / b;  // ArithmeticException se b == 0
}  // RuntimeException = unchecked → NÃO precisa throws/try-catch

// ❌ CHECKED: situação esperada (OBRIGA tratar)
public static void lerArquivo(String caminho) throws IOException {
    FileReader reader = new FileReader(caminho);
}  // IOException = checked → DEVE throws ou try-catch
```

**RuntimeException** = **bug** no código. **Prevenir** com validações.

---

## Fundamentos

### 1. Classe RuntimeException: Estrutura

```java
// ✅ Hierarquia da classe RuntimeException
public class RuntimeException extends Exception {
    // Construtores
    public RuntimeException() { }
    public RuntimeException(String message) { }
    public RuntimeException(String message, Throwable cause) { }
    public RuntimeException(Throwable cause) { }
}

// ✅ RuntimeException é unchecked
public class ExemploRuntimeException {
    public static void main(String[] args) {
        // Verificar hierarquia
        RuntimeException excecao = new NullPointerException("NPE");
        
        System.out.println("instanceof RuntimeException: " + 
                         (excecao instanceof RuntimeException));  // true
        System.out.println("instanceof Exception: " + 
                         (excecao instanceof Exception));         // true
        System.out.println("instanceof Throwable: " + 
                         (excecao instanceof Throwable));         // true
        
        // RuntimeException É Exception (mas unchecked)
        System.out.println("\nRuntimeException extends Exception: true");
        System.out.println("RuntimeException é UNCHECKED: true");
    }
}
```

**RuntimeException** estende **Exception** (mas é **unchecked**).

### 2. RuntimeException: Unchecked (Não Verificadas)

```java
// ✅ Unchecked: compilador NÃO obriga tratar
public class UncheckedExceptions {
    
    // ✅ Pode lançar RuntimeException SEM declarar throws
    public static void dividir(int a, int b) {
        // ✅ Compila SEM throws
        int resultado = a / b;  // ArithmeticException se b == 0
        System.out.println("Resultado: " + resultado);
    }
    
    // ✅ Pode lançar NullPointerException SEM declarar throws
    public static void imprimir(String texto) {
        // ✅ Compila SEM throws
        System.out.println(texto.length());  // NullPointerException se texto == null
    }
    
    // ✅ Pode lançar IndexOutOfBoundsException SEM declarar throws
    public static void acessar(int[] array, int indice) {
        // ✅ Compila SEM throws
        int valor = array[indice];  // IndexOutOfBoundsException se índice inválido
        System.out.println("Valor: " + valor);
    }
    
    // ⚠️ COMPARAR com checked: OBRIGA declarar throws
    public static void lerArquivo(String caminho) throws IOException {
        // ❌ NÃO compila sem throws
        FileReader reader = new FileReader(caminho);
    }
    
    public static void main(String[] args) {
        // Chamar métodos unchecked (SEM try-catch)
        dividir(10, 2);      // ✅ OK
        imprimir("teste");   // ✅ OK
        acessar(new int[]{1, 2, 3}, 0);  // ✅ OK
        
        // ❌ Se passar valores inválidos: quebra em RUNTIME
        // dividir(10, 0);           // ❌ ArithmeticException
        // imprimir(null);           // ❌ NullPointerException
        // acessar(new int[]{1}, 5); // ❌ ArrayIndexOutOfBoundsException
    }
}
```

**Unchecked** (RuntimeException) = compilador **não obriga** tratar.

### 3. Principais RuntimeExceptions

```java
// ✅ RuntimeExceptions mais comuns
public class PrincipaisRuntime {
    
    public static void main(String[] args) {
        System.out.println("=== Principais RuntimeExceptions ===\n");
        
        // 1. NullPointerException: objeto null
        exemploNullPointer();
        
        // 2. ArithmeticException: operação aritmética inválida
        exemploArithmetic();
        
        // 3. ArrayIndexOutOfBoundsException: índice inválido array
        exemploArrayIndex();
        
        // 4. StringIndexOutOfBoundsException: índice inválido String
        exemploStringIndex();
        
        // 5. NumberFormatException: conversão inválida
        exemploNumberFormat();
        
        // 6. IllegalArgumentException: argumento inválido
        exemploIllegalArgument();
        
        // 7. IllegalStateException: estado inválido
        exemploIllegalState();
        
        // 8. ClassCastException: cast inválido
        exemploClassCast();
        
        // 9. UnsupportedOperationException: operação não suportada
        exemploUnsupportedOperation();
    }
    
    // 1. NullPointerException
    public static void exemploNullPointer() {
        System.out.println("1. NullPointerException:");
        String texto = null;
        try {
            System.out.println(texto.length());  // ❌ NPE
        } catch (NullPointerException e) {
            System.out.println("   Causa: objeto null");
            System.out.println("   Prevenir: if (texto != null)");
        }
        System.out.println();
    }
    
    // 2. ArithmeticException
    public static void exemploArithmetic() {
        System.out.println("2. ArithmeticException:");
        try {
            int resultado = 10 / 0;  // ❌ Divisão por zero
        } catch (ArithmeticException e) {
            System.out.println("   Causa: " + e.getMessage());
            System.out.println("   Prevenir: if (divisor != 0)");
        }
        System.out.println();
    }
    
    // 3. ArrayIndexOutOfBoundsException
    public static void exemploArrayIndex() {
        System.out.println("3. ArrayIndexOutOfBoundsException:");
        int[] array = {1, 2, 3};
        try {
            int valor = array[10];  // ❌ Índice inválido
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("   Causa: índice 10 (tamanho: 3)");
            System.out.println("   Prevenir: if (indice >= 0 && indice < array.length)");
        }
        System.out.println();
    }
    
    // 4. StringIndexOutOfBoundsException
    public static void exemploStringIndex() {
        System.out.println("4. StringIndexOutOfBoundsException:");
        String texto = "teste";
        try {
            char c = texto.charAt(10);  // ❌ Índice inválido
        } catch (StringIndexOutOfBoundsException e) {
            System.out.println("   Causa: índice 10 (tamanho: 5)");
            System.out.println("   Prevenir: if (indice >= 0 && indice < texto.length())");
        }
        System.out.println();
    }
    
    // 5. NumberFormatException
    public static void exemploNumberFormat() {
        System.out.println("5. NumberFormatException:");
        try {
            int numero = Integer.parseInt("abc");  // ❌ "abc" não é número
        } catch (NumberFormatException e) {
            System.out.println("   Causa: \"abc\" não é número");
            System.out.println("   Prevenir: validar com regex antes");
        }
        System.out.println();
    }
    
    // 6. IllegalArgumentException
    public static void exemploIllegalArgument() {
        System.out.println("6. IllegalArgumentException:");
        try {
            definirIdade(-5);  // ❌ Idade negativa
        } catch (IllegalArgumentException e) {
            System.out.println("   Causa: " + e.getMessage());
            System.out.println("   Prevenir: validar parâmetros no início");
        }
        System.out.println();
    }
    
    // 7. IllegalStateException
    public static void exemploIllegalState() {
        System.out.println("7. IllegalStateException:");
        List<Integer> lista = Arrays.asList(1, 2, 3);
        try {
            lista.add(4);  // ❌ Lista imutável
        } catch (UnsupportedOperationException e) {
            System.out.println("   Causa: lista imutável (Arrays.asList)");
            System.out.println("   Prevenir: usar ArrayList");
        }
        System.out.println();
    }
    
    // 8. ClassCastException
    public static void exemploClassCast() {
        System.out.println("8. ClassCastException:");
        Object obj = "texto";
        try {
            Integer numero = (Integer) obj;  // ❌ String não é Integer
        } catch (ClassCastException e) {
            System.out.println("   Causa: String não pode virar Integer");
            System.out.println("   Prevenir: instanceof antes do cast");
        }
        System.out.println();
    }
    
    // 9. UnsupportedOperationException
    public static void exemploUnsupportedOperation() {
        System.out.println("9. UnsupportedOperationException:");
        List<Integer> lista = Collections.unmodifiableList(Arrays.asList(1, 2, 3));
        try {
            lista.add(4);  // ❌ Lista imutável
        } catch (UnsupportedOperationException e) {
            System.out.println("   Causa: lista imutável");
            System.out.println("   Prevenir: não modificar lista imutável");
        }
        System.out.println();
    }
    
    private static void definirIdade(int idade) {
        if (idade < 0) {
            throw new IllegalArgumentException("Idade não pode ser negativa: " + idade);
        }
    }
}
```

**RuntimeException** cobre erros de **programação** (bugs).

### 4. Por Que RuntimeException Existe?

```java
// ✅ Por que unchecked (não obriga tratar)?
public class PorQueUnchecked {
    
    // SITUAÇÃO: NullPointerException
    public static void processar(String texto) {
        // ❌ SE fosse checked: muito verboso
        // try {
        //     System.out.println(texto.length());
        // } catch (NullPointerException e) { }
        
        // ✅ Unchecked: código limpo
        System.out.println(texto.length());
        
        // ✅ PREVENIR: validar entrada
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser null");
        }
    }
    
    // SITUAÇÃO: ArithmeticException
    public static int dividir(int a, int b) {
        // ❌ SE fosse checked: try-catch em TODA divisão
        // try {
        //     return a / b;
        // } catch (ArithmeticException e) { }
        
        // ✅ Unchecked: código limpo
        // return a / b;
        
        // ✅ PREVENIR: validar divisor
        if (b == 0) {
            throw new IllegalArgumentException("Divisor não pode ser zero");
        }
        return a / b;
    }
    
    public static void main(String[] args) {
        System.out.println("=== Por Que Unchecked? ===\n");
        
        System.out.println("CHECKED obrigaria try-catch EM TODA:");
        System.out.println("  - Acesso a objeto (NullPointerException)");
        System.out.println("  - Divisão (ArithmeticException)");
        System.out.println("  - Acesso a array (IndexOutOfBoundsException)");
        System.out.println("  → Código ficaria MUITO verboso");
        
        System.out.println("\nUNCHECKED permite:");
        System.out.println("  - Código LIMPO");
        System.out.println("  - PREVENIR com validações");
        System.out.println("  - Indicar BUG (não situação esperada)");
        System.out.println("  - Tratar OPCIONALMENTE quando necessário");
    }
}

/*
 * POR QUE UNCHECKED?
 * 
 * 1. Erro de PROGRAMAÇÃO: deveria prevenir (não situação esperada)
 * 2. Muito COMUM: obrigar tratar deixaria código verboso
 * 3. Sob CONTROLE: validar parâmetros previne
 * 4. Indica BUG: NullPointer, divisão por zero = erro no código
 */
```

**Unchecked** = erro de **programação**. **Prevenir** (não tratar).

### 5. Checked vs RuntimeException

```java
// ✅ Quando usar checked vs unchecked?
public class CheckedVsRuntime {
    
    // CHECKED: problema EXTERNO (arquivo pode não existir)
    public static String lerArquivo(String caminho) throws IOException {
        // ✅ Pode acontecer MESMO com código correto
        // Chamador DEVE estar ciente
        FileReader reader = new FileReader(caminho);
        // ...
        return "";
    }
    
    // UNCHECKED: erro de PROGRAMAÇÃO (deveria validar)
    public static int dividir(int a, int b) {
        // ❌ Divisão por zero = BUG
        // Deveria validar antes de chamar
        if (b == 0) {
            throw new IllegalArgumentException("Divisor zero");
        }
        return a / b;
    }
    
    // CHECKED: servidor offline (externo)
    public static void conectarServidor(String url) throws IOException {
        // ✅ Servidor pode estar offline (fora do controle)
        Socket socket = new Socket(url, 8080);
    }
    
    // UNCHECKED: argumento inválido (interno)
    public static void definirIdade(int idade) {
        // ❌ Idade negativa = BUG (chamador deveria validar)
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== Checked vs RuntimeException ===\n");
        
        System.out.println("CHECKED:");
        System.out.println("  - Problema EXTERNO (fora do controle)");
        System.out.println("  - ESPERADO (pode acontecer)");
        System.out.println("  - Código correto PODE falhar");
        System.out.println("  - Exemplo: arquivo, rede, BD");
        
        System.out.println("\nRUNTIMEEXCEPTION:");
        System.out.println("  - Erro INTERNO (sob controle)");
        System.out.println("  - NÃO esperado (bug)");
        System.out.println("  - Código correto NÃO deveria falhar");
        System.out.println("  - Exemplo: null, divisão zero, índice inválido");
    }
}
```

**Checked** = externo/esperado. **RuntimeException** = interno/bug.

### 6. Prevenir vs Tratar RuntimeException

```java
// ✅ Prevenir é melhor que tratar
public class PrevenirVsTratar {
    
    // ❌ MAU: tratar RuntimeException
    public static void mauExemplo(String texto, int divisor) {
        try {
            System.out.println(texto.length());
            int resultado = 10 / divisor;
        } catch (NullPointerException e) {
            // ❌ Captura bug (deveria prevenir)
        } catch (ArithmeticException e) {
            // ❌ Captura bug (deveria prevenir)
        }
    }
    
    // ✅ BOM: prevenir com validações
    public static void bomExemplo(String texto, int divisor) {
        // ✅ Validar entrada
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser null");
        }
        if (divisor == 0) {
            throw new IllegalArgumentException("Divisor não pode ser zero");
        }
        
        // ✅ Seguro (não lança exceção)
        System.out.println(texto.length());
        int resultado = 10 / divisor;
    }
    
    // ✅ Validação em método separado
    public static void processar(Pessoa pessoa) {
        validarPessoa(pessoa);
        
        // ✅ Seguro (validado)
        System.out.println(pessoa.getNome().toUpperCase());
        System.out.println(pessoa.getIdade() + 1);
    }
    
    private static void validarPessoa(Pessoa pessoa) {
        if (pessoa == null) {
            throw new IllegalArgumentException("Pessoa não pode ser null");
        }
        if (pessoa.getNome() == null || pessoa.getNome().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser null/vazio");
        }
        if (pessoa.getIdade() < 0 || pessoa.getIdade() > 150) {
            throw new IllegalArgumentException("Idade inválida: " + pessoa.getIdade());
        }
    }
    
    static class Pessoa {
        private String nome;
        private int idade;
        
        public Pessoa(String nome, int idade) {
            this.nome = nome;
            this.idade = idade;
        }
        
        public String getNome() { return nome; }
        public int getIdade() { return idade; }
    }
}
```

**Prevenir** com validações >>> capturar RuntimeException.

### 7. Quando Tratar RuntimeException?

```java
// ✅ Raros casos onde tratar RuntimeException faz sentido
public class QuandoTratarRuntime {
    
    // ✅ CASO 1: Input do USUÁRIO (pode ser inválido)
    public static void processarInputUsuario(String input) {
        try {
            // Usuário pode digitar "abc" ao invés de número
            int numero = Integer.parseInt(input);
            System.out.println("Número: " + numero);
        } catch (NumberFormatException e) {
            // ✅ OK: input do usuário é imprevisível
            System.out.println("Entrada inválida. Digite um número.");
        }
    }
    
    // ✅ CASO 2: API de terceiros (pode lançar runtime)
    public static void chamarAPITerceiros(Object obj) {
        try {
            // API externa pode lançar RuntimeException
            obj.toString();
        } catch (NullPointerException e) {
            // ✅ OK: proteger contra API mal implementada
            System.err.println("API retornou null: " + e.getMessage());
        }
    }
    
    // ✅ CASO 3: Aplicação robusta (não pode quebrar)
    public static void aplicacaoCritica() {
        try {
            processarDados();
        } catch (RuntimeException e) {
            // ✅ OK: aplicação crítica não pode parar
            System.err.println("Erro inesperado: " + e.getMessage());
            logger.error("Runtime exception", e);
            enviarAlerta(e);
        }
    }
    
    private static void processarDados() { }
    private static void logger.error(String msg, Exception e) { }
    private static void enviarAlerta(Exception e) { }
}
```

**Tratar RuntimeException** apenas em casos **específicos** (input usuário, API terceiros, aplicação crítica).

### 8. Criar RuntimeExceptions Customizadas

```java
// ✅ Criar RuntimeExceptions customizadas
public class CustomRuntimeExceptions {
    
    // RuntimeException customizada
    public static class ArquivoException extends RuntimeException {
        public ArquivoException(String mensagem) {
            super(mensagem);
        }
        
        public ArquivoException(String mensagem, Throwable causa) {
            super(mensagem, causa);
        }
    }
    
    // Outra RuntimeException customizada
    public static class ValidacaoException extends RuntimeException {
        private final String campo;
        private final Object valorInvalido;
        
        public ValidacaoException(String campo, Object valorInvalido, String mensagem) {
            super(String.format("Campo '%s' inválido: %s (valor: %s)", 
                              campo, mensagem, valorInvalido));
            this.campo = campo;
            this.valorInvalido = valorInvalido;
        }
        
        public String getCampo() { return campo; }
        public Object getValorInvalido() { return valorInvalido; }
    }
    
    // Usar exceções customizadas
    public static void validarPessoa(String nome, int idade) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new ValidacaoException("nome", nome, "não pode ser vazio");
        }
        if (idade < 0) {
            throw new ValidacaoException("idade", idade, "não pode ser negativa");
        }
        if (idade > 150) {
            throw new ValidacaoException("idade", idade, "muito alta");
        }
    }
    
    public static void lerArquivo(String caminho) {
        try {
            FileReader reader = new FileReader(caminho);
        } catch (IOException e) {
            // ✅ Encapsular checked em RuntimeException customizada
            throw new ArquivoException("Erro ao ler arquivo: " + caminho, e);
        }
    }
    
    public static void main(String[] args) {
        try {
            validarPessoa("", -5);
        } catch (ValidacaoException e) {
            System.err.println("Erro validação:");
            System.err.println("  Campo: " + e.getCampo());
            System.err.println("  Valor: " + e.getValorInvalido());
            System.err.println("  Mensagem: " + e.getMessage());
        }
    }
}
```

**RuntimeException customizada** = semântica específica do domínio.

### 9. Encapsular Checked em RuntimeException

```java
// ✅ Quando encapsular checked em unchecked?
public class EncapsularChecked {
    
    // ✅ CASO 1: Erro FATAL (config obrigatória)
    public static Properties carregarConfigObrigatoria(String caminho) {
        try {
            Properties props = new Properties();
            props.load(new FileInputStream(caminho));
            return props;
        } catch (IOException e) {
            // ✅ Config obrigatória: encapsular em RuntimeException
            throw new RuntimeException("Config obrigatória não encontrada: " + caminho, e);
        }
    }
    
    // ✅ CASO 2: Simplificar API (quando chamador não pode tratar)
    public static class ConfigManager {
        private Properties config;
        
        // API simples (sem throws)
        public String get(String chave) {
            if (config == null) {
                config = carregarConfigObrigatoria("config.properties");
            }
            return config.getProperty(chave);
        }
    }
    
    // ✅ CASO 3: Lambdas/Streams (não aceitam checked)
    public static void processarArquivos(List<String> caminhos) {
        caminhos.stream()
               .map(caminho -> {
                   try {
                       return Files.readString(Path.of(caminho));
                   } catch (IOException e) {
                       // ✅ Lambda não aceita checked: encapsular
                       throw new RuntimeException("Erro ao ler: " + caminho, e);
                   }
               })
               .forEach(System.out::println);
    }
}
```

**Encapsular checked em RuntimeException** quando erro é **fatal** ou **simplificar API**.

### 10. Hierarquia Completa RuntimeException

```java
/*
 * HIERARQUIA RUNTIMEEXCEPTION
 * 
 * RuntimeException
 *   │
 *   ├── NullPointerException ← Objeto null
 *   │
 *   ├── ArithmeticException ← Operação aritmética inválida
 *   │
 *   ├── IndexOutOfBoundsException (abstract)
 *   │     ├── ArrayIndexOutOfBoundsException ← Índice array inválido
 *   │     └── StringIndexOutOfBoundsException ← Índice String inválido
 *   │
 *   ├── IllegalArgumentException ← Argumento inválido
 *   │     └── NumberFormatException ← Conversão inválida
 *   │
 *   ├── IllegalStateException ← Estado inválido
 *   │
 *   ├── ClassCastException ← Cast inválido
 *   │
 *   ├── UnsupportedOperationException ← Operação não suportada
 *   │
 *   ├── SecurityException ← Violação segurança
 *   │
 *   ├── ConcurrentModificationException ← Modificação concorrente
 *   │
 *   └── ... (muitas outras)
 */

public class HierarquiaRuntime {
    public static void main(String[] args) {
        System.out.println("=== Hierarquia RuntimeException ===\n");
        
        System.out.println("Mais comuns:");
        System.out.println("  - NullPointerException");
        System.out.println("  - ArithmeticException");
        System.out.println("  - ArrayIndexOutOfBoundsException");
        System.out.println("  - NumberFormatException");
        System.out.println("  - IllegalArgumentException");
        System.out.println("  - IllegalStateException");
        System.out.println("  - ClassCastException");
        System.out.println("  - UnsupportedOperationException");
    }
}
```

---

## Aplicabilidade

**RuntimeException** indica:
- Erros de **programação** (bugs)
- **Sob controle** (validar previne)
- **Não** situação esperada
- Compilador **não obriga** tratar

---

## Armadilhas

### 1. Tratar RuntimeException Como Fluxo Normal

```java
// ❌ Usar exceção como controle fluxo
try {
    int numero = Integer.parseInt(input);
} catch (NumberFormatException e) {
    // ❌ Tratar como normal
}

// ✅ Validar antes
if (input.matches("\\d+")) {
    int numero = Integer.parseInt(input);
}
```

### 2. Capturar e Ignorar

```java
// ❌ Capturar e ignorar
try {
    processar(obj);
} catch (NullPointerException e) {
    // ❌ Silencioso (bug oculto)
}

// ✅ Prevenir
if (obj != null) {
    processar(obj);
}
```

### 3. Não Validar Parâmetros

```java
// ❌ Não validar
public void setIdade(int idade) {
    this.idade = idade;  // ❌ Aceita negativo
}

// ✅ Validar
public void setIdade(int idade) {
    if (idade < 0) {
        throw new IllegalArgumentException("Idade negativa");
    }
    this.idade = idade;
}
```

---

## Boas Práticas

### 1. Prevenir com Validações

```java
// ✅ Validar parâmetros
if (obj == null) {
    throw new IllegalArgumentException("Null");
}
if (divisor == 0) {
    throw new IllegalArgumentException("Zero");
}
```

### 2. Lançar IllegalArgumentException

```java
// ✅ Validação de entrada
public void setNome(String nome) {
    if (nome == null || nome.isEmpty()) {
        throw new IllegalArgumentException("Nome inválido");
    }
    this.nome = nome;
}
```

### 3. Criar RuntimeExceptions Customizadas

```java
// ✅ Semântica específica
public class ValidacaoException extends RuntimeException {
    public ValidacaoException(String msg) {
        super(msg);
    }
}
```

---

## Resumo

**RuntimeException** = erros de **programação** (bugs).

**Características**:
- **Unchecked**: compilador **não obriga** tratar
- **Sob controle**: validações **previnem**
- **Não esperado**: indica **bug** no código
- Estende **Exception** (mas unchecked)

**Principais**:
- **NullPointerException**: objeto null
- **ArithmeticException**: divisão por zero
- **ArrayIndexOutOfBoundsException**: índice inválido
- **NumberFormatException**: conversão inválida
- **IllegalArgumentException**: argumento inválido
- **IllegalStateException**: estado inválido
- **ClassCastException**: cast inválido

**Por que unchecked**:
- Muito **comum** (obrigar tratar = verboso)
- Erro de **programação** (deveria prevenir)
- Código **limpo** (não poluir com try-catch)

**Quando tratar**:
- **Input usuário** (imprevisível)
- **API terceiros** (pode lançar)
- **Aplicação crítica** (não pode parar)

**Prevenir**:
- **Validar** parâmetros (`if null throw`)
- **Verificar** condições (`if divisor == 0 throw`)
- Usar **IllegalArgumentException** para validação

**Encapsular checked**:
- Erro **fatal** (config obrigatória)
- **Simplificar API** (quando não pode tratar)
- **Lambdas** (não aceitam checked)

**Regra de Ouro**: RuntimeException = **bug**. **Prevenir** com validações (não tratar). Lançar **IllegalArgumentException** para parâmetros inválidos. **Não** usar como controle de fluxo. Tratar apenas casos **específicos** (input usuário, API terceiros).
