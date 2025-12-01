# T1.05 - Checked vs Unchecked Exceptions

## Introdução

**Java** divide exceções em **Checked** (verificadas em compilação) e **Unchecked** (não verificadas).

```java
// ✅ CHECKED: compilador OBRIGA tratar ou declarar
public static void lerArquivo() throws IOException {  // Deve declarar
    FileReader reader = new FileReader("arquivo.txt");  // IOException = checked
    reader.close();
}

// ✅ UNCHECKED: compilador NÃO obriga tratar
public static void dividir(int a, int b) {  // Não precisa declarar
    int resultado = a / b;  // ArithmeticException = unchecked
}
```

**Checked** = compilador **força** tratamento.  
**Unchecked** = tratamento **opcional**.

---

## Fundamentos

### 1. Diferença Principal

```java
// ✅ CHECKED EXCEPTION: compilador verifica
public class CheckedException {
    
    // ❌ ERRO DE COMPILAÇÃO se não tratar/declarar
    public static void exemplo1() {
        // FileReader reader = new FileReader("arquivo.txt");  // ❌ ERRO
        // ERRO: Unhandled exception: java.io.FileNotFoundException
    }
    
    // ✅ SOLUÇÃO 1: Tratar com try-catch
    public static void solucao1Tratar() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            reader.close();
        } catch (IOException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }
    
    // ✅ SOLUÇÃO 2: Declarar com throws
    public static void solucao2Declarar() throws IOException {
        FileReader reader = new FileReader("arquivo.txt");
        reader.close();
    }
}

// ✅ UNCHECKED EXCEPTION: compilador NÃO verifica
public class UncheckedException {
    
    // ✅ COMPILA sem tratar/declarar
    public static void exemplo() {
        int resultado = 10 / 0;  // ArithmeticException = unchecked
        // Compila normalmente (mas quebra em runtime)
    }
    
    // ✅ Pode tratar se quiser (opcional)
    public static void tratarOpcional() {
        try {
            int resultado = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }
}
```

**Checked** = compilador **obriga** tratar/declarar.  
**Unchecked** = tratamento **opcional**.

### 2. Hierarquia: Checked vs Unchecked

```java
/*
 * HIERARQUIA DE EXCEÇÕES
 * 
 *                    Throwable
 *                        |
 *           ┌────────────┴────────────┐
 *           |                         |
 *         Error                   Exception
 *      (UNCHECKED)                    |
 *           |                 ┌───────┴───────┐
 *     OutOfMemoryError        |               |
 *     StackOverflowError  RuntimeException  (Outras)
 *           ...          (UNCHECKED)      (CHECKED)
 *                            |               |
 *                    NullPointerException IOException
 *                    ArithmeticException  SQLException
 *                    IllegalArgument...   ParseException
 *                    ...                  ...
 * 
 * UNCHECKED (compilador NÃO obriga tratar):
 *   - Error e suas subclasses
 *   - RuntimeException e suas subclasses
 * 
 * CHECKED (compilador OBRIGA tratar):
 *   - Exception e subclasses (exceto RuntimeException)
 */

public class HierarquiaCheckedUnchecked {
    public static void main(String[] args) {
        // UNCHECKED: RuntimeException
        Exception unchecked1 = new NullPointerException();
        System.out.println("NullPointerException instanceof RuntimeException: " + 
                         (unchecked1 instanceof RuntimeException));  // true
        
        // UNCHECKED: Error
        Throwable unchecked2 = new OutOfMemoryError();
        System.out.println("OutOfMemoryError instanceof Error: " + 
                         (unchecked2 instanceof Error));  // true
        
        // CHECKED: Exception (não RuntimeException)
        Exception checked = new IOException();
        System.out.println("IOException instanceof RuntimeException: " + 
                         (checked instanceof RuntimeException));  // false
        System.out.println("IOException instanceof Exception: " + 
                         (checked instanceof Exception));  // true
    }
}
```

**Unchecked** = `Error` + `RuntimeException` (e subclasses).  
**Checked** = `Exception` (exceto `RuntimeException`).

### 3. Exemplos de Checked Exceptions

```java
// ✅ CHECKED EXCEPTIONS: compilador obriga tratar
public class ExemplosChecked {
    
    // 1. IOException (arquivo/rede)
    public static void exemplo1() throws IOException {
        FileReader reader = new FileReader("arquivo.txt");  // FileNotFoundException
        reader.close();
    }
    
    // 2. SQLException (banco de dados)
    public static void exemplo2() throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:...");
        conn.close();
    }
    
    // 3. ClassNotFoundException (reflexão)
    public static void exemplo3() throws ClassNotFoundException {
        Class<?> clazz = Class.forName("MinhaClasse");
    }
    
    // 4. ParseException (parsing)
    public static void exemplo4() throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        Date data = sdf.parse("32/13/2024");  // Data inválida
    }
    
    // 5. InterruptedException (threads)
    public static void exemplo5() throws InterruptedException {
        Thread.sleep(1000);
    }
    
    // ✅ TODAS exigem try-catch ou throws
    public static void main(String[] args) {
        // DEVE tratar
        try {
            exemplo1();
        } catch (IOException e) {
            System.out.println("Erro I/O: " + e.getMessage());
        }
        
        // OU declarar throws
        // main() throws IOException
    }
}
```

**Checked** = situações **previsíveis** que código **deve** tratar (arquivo, rede, banco).

### 4. Exemplos de Unchecked Exceptions

```java
// ✅ UNCHECKED EXCEPTIONS: compilador NÃO obriga tratar
public class ExemplosUnchecked {
    
    // 1. NullPointerException
    public static void exemplo1() {
        String texto = null;
        int tamanho = texto.length();  // NullPointerException
    }
    
    // 2. ArithmeticException
    public static void exemplo2() {
        int resultado = 10 / 0;  // ArithmeticException
    }
    
    // 3. ArrayIndexOutOfBoundsException
    public static void exemplo3() {
        int[] arr = {1, 2, 3};
        int valor = arr[10];  // ArrayIndexOutOfBoundsException
    }
    
    // 4. NumberFormatException
    public static void exemplo4() {
        int numero = Integer.parseInt("abc");  // NumberFormatException
    }
    
    // 5. IllegalArgumentException
    public static void exemplo5() {
        Thread.sleep(-1000);  // IllegalArgumentException (argumento inválido)
    }
    
    // 6. ClassCastException
    public static void exemplo6() {
        Object obj = "texto";
        Integer num = (Integer) obj;  // ClassCastException
    }
    
    // 7. IllegalStateException
    public static void exemplo7() {
        List<Integer> lista = List.of(1, 2, 3);  // Imutável
        lista.add(4);  // UnsupportedOperationException
    }
    
    // ✅ NENHUMA exige try-catch ou throws
    public static void main(String[] args) {
        // Compilam sem try-catch
        // (mas quebram em runtime)
        
        // Pode tratar SE QUISER
        try {
            exemplo2();
        } catch (ArithmeticException e) {
            System.out.println("Divisão por zero");
        }
    }
}
```

**Unchecked** = erros de **programação** que **deveriam** ser evitados (null, índice inválido).

### 5. Por Que Checked Exceptions?

```java
// ✅ CHECKED: situações ESPERADAS que DEVE tratar
public class PorQueChecked {
    
    // Arquivo pode NÃO EXISTIR (situação normal)
    public static void lerConfig() {
        try {
            FileReader reader = new FileReader("config.txt");
            // Ler configuração
            reader.close();
        } catch (FileNotFoundException e) {
            // ✅ Situação ESPERADA: usar config padrão
            System.out.println("Config não encontrado, usando padrão");
            usarConfigPadrao();
        } catch (IOException e) {
            System.out.println("Erro ao ler config");
        }
    }
    
    // Rede pode FALHAR (situação normal)
    public static void buscarDados(String url) {
        try {
            URL conexao = new URL(url);
            // Buscar dados
        } catch (MalformedURLException e) {
            // ✅ Situação ESPERADA: URL inválida
            System.out.println("URL inválida: " + url);
        }
    }
    
    // Banco pode estar OFFLINE (situação normal)
    public static void conectarBanco() {
        try {
            Connection conn = DriverManager.getConnection("jdbc:...");
            // Usar conexão
        } catch (SQLException e) {
            // ✅ Situação ESPERADA: banco offline
            System.out.println("Banco indisponível, tentando novamente...");
            tentarNovamente();
        }
    }
    
    private static void usarConfigPadrao() { }
    private static void tentarNovamente() { }
}
```

**Checked** = situações **esperadas** do mundo real (arquivo ausente, rede falha).

### 6. Por Que Unchecked Exceptions?

```java
// ✅ UNCHECKED: erros de PROGRAMAÇÃO que NÃO deveria acontecer
public class PorQueUnchecked {
    
    // NULL: erro de PROGRAMAÇÃO (deveria validar)
    public static void processar(String texto) {
        // ❌ Não valida
        int tamanho = texto.length();  // NullPointerException se null
        
        // ✅ Deveria validar
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser null");
        }
        int tamanhoCorreto = texto.length();
    }
    
    // DIVISÃO POR ZERO: erro de PROGRAMAÇÃO (deveria validar)
    public static int dividir(int a, int b) {
        // ❌ Não valida
        return a / b;  // ArithmeticException se b == 0
        
        // ✅ Deveria validar
        if (b == 0) {
            throw new IllegalArgumentException("Divisor não pode ser zero");
        }
        return a / b;
    }
    
    // ÍNDICE INVÁLIDO: erro de PROGRAMAÇÃO (deveria validar)
    public static int obter(int[] arr, int indice) {
        // ❌ Não valida
        return arr[indice];  // ArrayIndexOutOfBoundsException se inválido
        
        // ✅ Deveria validar
        if (indice < 0 || indice >= arr.length) {
            throw new IllegalArgumentException("Índice inválido: " + indice);
        }
        return arr[indice];
    }
}
```

**Unchecked** = erros de **programação** que código **deveria prevenir**.

### 7. Quando Usar Cada Tipo?

```java
// ✅ Guia: quando usar checked vs unchecked
public class QuandoUsarCada {
    
    // ✅ CHECKED: situação EXTERNA, fora do controle
    public void salvarArquivo(String conteudo) throws IOException {
        // Arquivo pode não ter permissão de escrita (EXTERNO)
        FileWriter writer = new FileWriter("arquivo.txt");
        writer.write(conteudo);
        writer.close();
    }
    
    // ✅ UNCHECKED: validação de PARÂMETRO (interno)
    public void definirIdade(int idade) {
        // Idade inválida é erro de PROGRAMAÇÃO (INTERNO)
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
        this.idade = idade;
    }
    
    // ✅ CHECKED: operação que PODE FALHAR por fatores externos
    public void enviarEmail(String destinatario) throws MessagingException {
        // Servidor de email pode estar offline (EXTERNO)
        // Deve forçar chamador a tratar
    }
    
    // ✅ UNCHECKED: precondição violada (erro de programação)
    public void processar(List<String> itens) {
        // Lista vazia é erro de PROGRAMAÇÃO (INTERNO)
        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("Lista não pode estar vazia");
        }
        // Processar itens
    }
    
    /*
     * REGRA:
     * 
     * CHECKED:
     *   - Situação EXTERNA (arquivo, rede, banco)
     *   - Pode acontecer MESMO com código correto
     *   - Chamador DEVE estar ciente e tratar
     * 
     * UNCHECKED:
     *   - Erro de PROGRAMAÇÃO
     *   - NÃO deveria acontecer com código correto
     *   - Indica BUG no código
     */
    
    private int idade;
}
```

**Checked** = problema **externo** (deve tratar).  
**Unchecked** = problema **interno** (bug no código).

### 8. Converter Checked em Unchecked

```java
// ✅ Converter checked em unchecked (quando apropriado)
public class ConverterCheckedException {
    
    // ❌ Método com checked exception
    public void lerArquivoChecked() throws IOException {
        FileReader reader = new FileReader("arquivo.txt");
        reader.close();
    }
    
    // ✅ Encapsular em unchecked (quando não puder tratar)
    public void lerArquivoUnchecked() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            reader.close();
        } catch (IOException e) {
            // Encapsular em RuntimeException
            throw new RuntimeException("Erro ao ler arquivo", e);
        }
    }
    
    // ✅ Criar exceção customizada unchecked
    public static class ArquivoException extends RuntimeException {
        public ArquivoException(String msg, Throwable cause) {
            super(msg, cause);
        }
    }
    
    public void lerArquivoCustom() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            reader.close();
        } catch (IOException e) {
            throw new ArquivoException("Erro ao ler arquivo", e);
        }
    }
    
    // ⚠️ Só converter quando:
    // - Não puder fazer nada útil com a exceção
    // - Quiser simplificar API
    // - For erro fatal que deve propagar
}
```

Pode **encapsular** checked em unchecked quando apropriado.

### 9. Checked Exceptions e Lambdas

```java
// ⚠️ PROBLEMA: checked exceptions com lambdas
public class CheckedComLambda {
    
    // ❌ NÃO COMPILA: lambda não pode lançar checked
    public static void problemaLambda() {
        List<String> arquivos = List.of("a.txt", "b.txt", "c.txt");
        
        // ❌ ERRO: FileReader lança IOException (checked)
        // arquivos.forEach(arquivo -> {
        //     FileReader reader = new FileReader(arquivo);  // ❌ ERRO
        //     reader.close();
        // });
    }
    
    // ✅ SOLUÇÃO 1: tratar dentro do lambda
    public static void solucao1TratarDentro() {
        List<String> arquivos = List.of("a.txt", "b.txt", "c.txt");
        
        arquivos.forEach(arquivo -> {
            try {
                FileReader reader = new FileReader(arquivo);
                reader.close();
            } catch (IOException e) {
                System.out.println("Erro: " + e.getMessage());
            }
        });
    }
    
    // ✅ SOLUÇÃO 2: encapsular em unchecked
    public static void solucao2Unchecked() {
        List<String> arquivos = List.of("a.txt", "b.txt", "c.txt");
        
        arquivos.forEach(arquivo -> {
            try {
                FileReader reader = new FileReader(arquivo);
                reader.close();
            } catch (IOException e) {
                throw new RuntimeException(e);  // Encapsula
            }
        });
    }
    
    // ✅ SOLUÇÃO 3: criar método auxiliar
    public static void solucao3Auxiliar() {
        List<String> arquivos = List.of("a.txt", "b.txt", "c.txt");
        arquivos.forEach(CheckedComLambda::lerArquivo);
    }
    
    private static void lerArquivo(String arquivo) {
        try {
            FileReader reader = new FileReader(arquivo);
            reader.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

**Lambdas** não podem lançar **checked** diretamente. Deve **tratar** ou **encapsular**.

### 10. Tabela Comparativa Completa

```java
/*
 * COMPARAÇÃO COMPLETA: CHECKED vs UNCHECKED
 * 
 * ┌──────────────────────┬─────────────────────┬─────────────────────┐
 * │      ASPECTO         │      CHECKED        │      UNCHECKED      │
 * ├──────────────────────┼─────────────────────┼─────────────────────┤
 * │ Verificação          │ Tempo de COMPILAÇÃO │ Tempo de EXECUÇÃO   │
 * │ Obrigatoriedade      │ DEVE tratar/declarar│ Opcional            │
 * │ Extends              │ Exception (não RE)  │ RuntimeException    │
 * │ Causa                │ Problema EXTERNO    │ Erro PROGRAMAÇÃO    │
 * │ Previsibilidade      │ Situação ESPERADA   │ NÃO deveria ocorrer │
 * │ Controle             │ Fora do controle    │ Sob controle        │
 * │ Tratamento           │ OBRIGATÓRIO         │ Opcional            │
 * │ Throws               │ DEVE declarar       │ Não precisa         │
 * │ Try-catch            │ DEVE usar           │ Opcional            │
 * ├──────────────────────┼─────────────────────┼─────────────────────┤
 * │ Exemplos             │ IOException         │ NullPointerException│
 * │                      │ SQLException        │ ArithmeticException │
 * │                      │ ClassNotFound...    │ IllegalArgument...  │
 * │                      │ ParseException      │ IndexOutOfBounds... │
 * │                      │ Interrupted...      │ ClassCastException  │
 * ├──────────────────────┼─────────────────────┼─────────────────────┤
 * │ Quando usar          │ Arquivo, rede, BD   │ Validação parâmetro │
 * │                      │ Fatores externos    │ Bugs no código      │
 * │                      │ Pode falhar mesmo   │ Deveria prevenir    │
 * │                      │ com código correto  │ com código correto  │
 * └──────────────────────┴─────────────────────┴─────────────────────┘
 */
```

---

## Aplicabilidade

**Checked**:
- Situações **externas** (arquivo, rede, banco)
- **Esperadas** e **previsíveis**
- Chamador **deve** estar ciente
- Compilador **obriga** tratar

**Unchecked**:
- Erros de **programação** (null, índice inválido)
- **Não** deveriam acontecer
- Indicam **bugs** no código
- Tratamento **opcional**

---

## Armadilhas

### 1. Ignorar Checked Exceptions

```java
// ❌ Capturar e não fazer nada
try {
    lerArquivo();
} catch (IOException e) {
    // ❌ Ignora
}

// ✅ Tratar ou relançar
try {
    lerArquivo();
} catch (IOException e) {
    logger.error("Erro", e);
    throw new RuntimeException(e);
}
```

### 2. Abusar de Unchecked

```java
// ❌ Usar unchecked para tudo
public void processar() {
    throw new RuntimeException("Erro");  // ❌ Genérico
}

// ✅ Usar checked para problemas externos
public void processar() throws IOException {
    // Checked para I/O
}
```

### 3. Não Validar Parâmetros

```java
// ❌ Não valida (confia em unchecked)
public void processar(String texto) {
    int tamanho = texto.length();  // NullPointerException
}

// ✅ Valida parâmetros
public void processar(String texto) {
    if (texto == null) {
        throw new IllegalArgumentException("Texto null");
    }
    int tamanho = texto.length();
}
```

---

## Boas Práticas

### 1. Usar Checked para Problemas Externos

```java
// ✅ Checked para I/O, rede, banco
public void salvar() throws IOException {
    // ...
}
```

### 2. Usar Unchecked para Validação

```java
// ✅ Unchecked para validação
public void setIdade(int idade) {
    if (idade < 0) {
        throw new IllegalArgumentException("Idade negativa");
    }
}
```

### 3. Documentar Unchecked

```java
/**
 * @throws IllegalArgumentException se idade < 0
 */
public void setIdade(int idade) {
    if (idade < 0) {
        throw new IllegalArgumentException("Idade negativa");
    }
}
```

---

## Resumo

**Checked** vs **Unchecked**:

**Checked**:
- **Exception** (exceto `RuntimeException`)
- Compilador **obriga** tratar/declarar
- Situações **externas** (arquivo, rede)
- **Esperadas** e **previsíveis**
- Exemplos: `IOException`, `SQLException`

**Unchecked**:
- **RuntimeException** + **Error**
- Compilador **não** obriga tratar
- Erros de **programação** (bugs)
- **Não** deveriam ocorrer
- Exemplos: `NullPointerException`, `ArithmeticException`

**Decisão**:
- **Externo** (arquivo, rede) → **Checked**
- **Interno** (validação) → **Unchecked**
- Pode acontecer mesmo com código correto → **Checked**
- Indica bug no código → **Unchecked**

**Regra de Ouro**: **Checked** = problema **externo** que **deve** tratar (compilador força). **Unchecked** = erro de **programação** que código **deveria** prevenir (tratamento opcional). **Validar** parâmetros lançando **unchecked**. **Problemas externos** lançam **checked**.
