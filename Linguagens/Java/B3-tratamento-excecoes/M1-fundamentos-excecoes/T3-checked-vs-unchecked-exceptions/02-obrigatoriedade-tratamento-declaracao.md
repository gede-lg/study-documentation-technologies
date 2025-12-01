# T3.02 - Obrigatoriedade de Tratamento ou Declaração

## Introdução

**Checked exceptions** DEVEM ser **tratadas** (`try-catch`) ou **declaradas** (`throws`).

```java
/*
 * OBRIGATORIEDADE
 * 
 * CHECKED: DEVE tratar OU declarar
 *   - throws: declarar no método
 *   - try-catch: capturar e tratar
 *   - Compilador NÃO aceita sem um dos dois
 * 
 * UNCHECKED: NÃO obriga
 *   - throws: opcional (pode declarar)
 *   - try-catch: opcional (pode capturar)
 *   - Compilador aceita sem tratamento
 */

// ❌ CHECKED: NÃO compila sem tratar/declarar
public static void exemplo1() {
    // FileReader reader = new FileReader("arquivo.txt");  // ERRO
}

// ✅ OPÇÃO 1: DECLARAR com throws
public static void exemplo2() throws IOException {
    FileReader reader = new FileReader("arquivo.txt");  // OK
}

// ✅ OPÇÃO 2: TRATAR com try-catch
public static void exemplo3() {
    try {
        FileReader reader = new FileReader("arquivo.txt");  // OK
    } catch (IOException e) {
        e.printStackTrace();
    }
}

// ✅ UNCHECKED: compila sem tratar/declarar
public static void exemplo4() {
    int resultado = 10 / 0;  // ArithmeticException - OK sem tratamento
}
```

**Obrigatoriedade** = **DEVE** escolher uma das opções (tratar ou declarar).

---

## Fundamentos

### 1. Declarar com throws

```java
// ✅ throws: declarar exceção no método
public class DeclaracaoThrows {
    
    // ✅ Declarar UMA exceção
    public static void lerArquivo(String caminho) throws IOException {
        FileReader reader = new FileReader(caminho);
        BufferedReader br = new BufferedReader(reader);
        String linha = br.readLine();
    }
    
    // ✅ Declarar MÚLTIPLAS exceções (vírgula)
    public static void operacaoCompleta() throws IOException, SQLException {
        // I/O
        FileReader reader = new FileReader("arquivo.txt");
        
        // BD
        Connection conn = DriverManager.getConnection("jdbc:...");
    }
    
    // ✅ Declarar exceção GENÉRICA (cobre subclasses)
    public static void generico1() throws Exception {
        // IOException é subclasse de Exception
        FileReader reader = new FileReader("arquivo.txt");
        
        // SQLException é subclasse de Exception
        Connection conn = DriverManager.getConnection("jdbc:...");
    }
    
    // ✅ Declarar SUBCLASSE específica
    public static void especifico() throws FileNotFoundException {
        // FileNotFoundException é mais específica que IOException
        FileReader reader = new FileReader("arquivo.txt");
    }
    
    // ⚠️ Declarar throws MAS método não lança (permitido, mas desnecessário)
    public static void desnecessario() throws IOException {
        // Método não lança IOException
        System.out.println("Sem exceção");
        // ⚠️ Compila, mas throws é desnecessário
    }
}
```

**throws** = **declarar** exceção na assinatura do método.

### 2. Tratar com try-catch

```java
// ✅ try-catch: capturar e tratar exceção
public class TratamentoTryCatch {
    
    // ✅ try-catch SIMPLES
    public static void simples() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
        } catch (IOException e) {
            System.err.println("Erro ao ler arquivo: " + e.getMessage());
        }
    }
    
    // ✅ MÚLTIPLOS catch (ordem: específico → genérico)
    public static void multiploCatch() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            BufferedReader br = new BufferedReader(reader);
            String linha = br.readLine();
        } catch (FileNotFoundException e) {
            // Mais específico PRIMEIRO
            System.err.println("Arquivo não encontrado: " + e.getMessage());
        } catch (IOException e) {
            // Mais genérico DEPOIS
            System.err.println("Erro I/O: " + e.getMessage());
        }
    }
    
    // ✅ MULTI-CATCH (Java 7+): pipe (|)
    public static void multiCatch() {
        try {
            operacaoCompleta();
        } catch (IOException | SQLException e) {
            // Trata ambas da mesma forma
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    // ✅ try-catch-FINALLY
    public static void comFinally() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        } finally {
            // Sempre executa (com ou sem exceção)
            System.out.println("Finalizando");
        }
    }
    
    // ✅ try-with-resources (Java 7+)
    public static void tryWithResources() {
        try (FileReader reader = new FileReader("arquivo.txt");
             BufferedReader br = new BufferedReader(reader)) {
            
            String linha = br.readLine();
            System.out.println(linha);
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        }
        // reader e br fechados automaticamente
    }
    
    private static void operacaoCompleta() throws IOException, SQLException {
        throw new IOException("I/O");
    }
}
```

**try-catch** = **capturar** e **tratar** exceção localmente.

### 3. Comparação: throws vs try-catch

```java
// ✅ Quando usar throws vs try-catch?
public class ThrowsVsTryCatch {
    
    /*
     * THROWS: quando NÃO pode/quer tratar localmente
     *   - Deixa chamador decidir como tratar
     *   - Propaga exceção para cima
     */
    public static String lerArquivo(String caminho) throws IOException {
        FileReader reader = new FileReader(caminho);
        BufferedReader br = new BufferedReader(reader);
        return br.readLine();
        // Chamador DEVE tratar IOException
    }
    
    /*
     * TRY-CATCH: quando PODE tratar localmente
     *   - Trata exceção aqui mesmo
     *   - Não propaga para chamador
     */
    public static String lerArquivoSeguro(String caminho) {
        try {
            FileReader reader = new FileReader(caminho);
            BufferedReader br = new BufferedReader(reader);
            return br.readLine();
        } catch (FileNotFoundException e) {
            // Tratar: usar arquivo padrão
            System.err.println("Arquivo não encontrado, usando padrão");
            return obterLinhasPadrao();
        } catch (IOException e) {
            // Tratar: logar e retornar null
            System.err.println("Erro I/O: " + e.getMessage());
            return null;
        }
        // Chamador NÃO precisa tratar (já tratado)
    }
    
    /*
     * HÍBRIDO: try-catch E throws
     *   - Trata ALGUMAS exceções
     *   - Propaga OUTRAS
     */
    public static String lerArquivoHibrido(String caminho) throws IOException {
        try {
            FileReader reader = new FileReader(caminho);
            BufferedReader br = new BufferedReader(reader);
            return br.readLine();
        } catch (FileNotFoundException e) {
            // Trata FileNotFoundException (usa padrão)
            System.err.println("Arquivo não encontrado, usando padrão");
            return obterLinhasPadrao();
        }
        // IOException (outras) PROPAGA para chamador
    }
    
    private static String obterLinhasPadrao() {
        return "linha padrão";
    }
}
```

**throws** = propagar. **try-catch** = tratar localmente.

### 4. Obrigatoriedade: Propagação na Pilha

```java
// ✅ Exceção propaga pela pilha de chamadas
public class PropagacaoPilha {
    
    // Método que LANÇA exceção
    public static void metodoC() throws IOException {
        throw new IOException("Erro no método C");
    }
    
    // Método B: PROPAGA exceção de C
    public static void metodoB() throws IOException {
        metodoC();  // DEVE declarar throws IOException
    }
    
    // Método A: PROPAGA exceção de B
    public static void metodoA() throws IOException {
        metodoB();  // DEVE declarar throws IOException
    }
    
    // main: TRATA exceção de A
    public static void main(String[] args) {
        try {
            metodoA();
        } catch (IOException e) {
            System.err.println("Exceção capturada: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /*
     * PILHA DE PROPAGAÇÃO:
     * 
     * main()
     *   └─→ metodoA()  (throws IOException)
     *        └─→ metodoB()  (throws IOException)
     *             └─→ metodoC()  (throws IOException)
     *                  └─→ throw new IOException()  ← ORIGEM
     * 
     * TODOS os métodos intermediários DEVEM:
     *   - throws: declarar exceção OU
     *   - try-catch: tratar exceção
     */
}
```

**Propagação** = cada método **deve** tratar ou declarar.

### 5. Obrigatoriedade: Regras de Override

```java
// ✅ Override: regras para exceções
public class RegrasOverride {
    
    // Classe base
    public static class Base {
        // Método que lança IOException
        public void processar() throws IOException {
            throw new IOException("Erro");
        }
    }
    
    // ✅ CORRETO: subclasse NÃO lança exceção
    public static class Filha1 extends Base {
        @Override
        public void processar() {
            // Não lança exceção (mais restritivo é OK)
            System.out.println("Processando");
        }
    }
    
    // ✅ CORRETO: subclasse lança MESMA exceção
    public static class Filha2 extends Base {
        @Override
        public void processar() throws IOException {
            super.processar();
        }
    }
    
    // ✅ CORRETO: subclasse lança SUBCLASSE da exceção
    public static class Filha3 extends Base {
        @Override
        public void processar() throws FileNotFoundException {
            // FileNotFoundException é subclasse de IOException (OK)
            throw new FileNotFoundException("Arquivo não encontrado");
        }
    }
    
    // ❌ ERRO: subclasse lança exceção MAIS AMPLA
    // public static class Filha4 extends Base {
    //     @Override
    //     public void processar() throws Exception {
    //         // ERRO: Exception é mais ampla que IOException
    //     }
    // }
    
    // ❌ ERRO: subclasse lança exceção DIFERENTE
    // public static class Filha5 extends Base {
    //     @Override
    //     public void processar() throws SQLException {
    //         // ERRO: SQLException não é subclasse de IOException
    //     }
    // }
    
    /*
     * REGRAS:
     *   - ✅ Pode NÃO lançar exceção
     *   - ✅ Pode lançar MESMA exceção
     *   - ✅ Pode lançar SUBCLASSE da exceção
     *   - ❌ NÃO pode lançar exceção MAIS AMPLA
     *   - ❌ NÃO pode lançar exceção DIFERENTE
     */
}
```

**Override** pode ser **mais restritivo** (não mais amplo).

### 6. Obrigatoriedade em Construtores

```java
// ✅ Construtores podem ter throws
public class ConstrutoresThrows {
    
    // ✅ Construtor com throws
    public static class Exemplo1 {
        private FileReader reader;
        
        // Construtor lança IOException
        public Exemplo1(String caminho) throws IOException {
            this.reader = new FileReader(caminho);
        }
    }
    
    // ✅ Criar objeto: DEVE tratar ou declarar
    public static void criar1() throws IOException {
        Exemplo1 obj = new Exemplo1("arquivo.txt");  // throws
    }
    
    public static void criar2() {
        try {
            Exemplo1 obj = new Exemplo1("arquivo.txt");  // try-catch
        } catch (IOException e) {
            System.err.println("Erro ao criar: " + e.getMessage());
        }
    }
    
    // ✅ Construtor que TRATA exceção
    public static class Exemplo2 {
        private FileReader reader;
        
        // Construtor trata IOException internamente
        public Exemplo2(String caminho) {
            try {
                this.reader = new FileReader(caminho);
            } catch (IOException e) {
                // Tratar: usar arquivo padrão
                System.err.println("Erro, usando padrão: " + e.getMessage());
                try {
                    this.reader = new FileReader("padrao.txt");
                } catch (IOException e2) {
                    // Última opção: lançar unchecked
                    throw new RuntimeException("Não foi possível inicializar", e2);
                }
            }
        }
    }
    
    public static void criar3() {
        // NÃO precisa throws/try-catch (exceção tratada no construtor)
        Exemplo2 obj = new Exemplo2("arquivo.txt");
    }
}
```

**Construtores** podem ter `throws` (obriga tratar ao criar objeto).

### 7. Obrigatoriedade em Interfaces

```java
// ✅ Interfaces podem declarar exceções
public class InterfacesThrows {
    
    // Interface declara exceção
    public interface Processador {
        void processar(String arquivo) throws IOException;
    }
    
    // ✅ Implementação 1: declara MESMA exceção
    public static class Impl1 implements Processador {
        @Override
        public void processar(String arquivo) throws IOException {
            FileReader reader = new FileReader(arquivo);
        }
    }
    
    // ✅ Implementação 2: declara SUBCLASSE
    public static class Impl2 implements Processador {
        @Override
        public void processar(String arquivo) throws FileNotFoundException {
            FileReader reader = new FileReader(arquivo);
        }
    }
    
    // ✅ Implementação 3: NÃO declara (trata internamente)
    public static class Impl3 implements Processador {
        @Override
        public void processar(String arquivo) {
            try {
                FileReader reader = new FileReader(arquivo);
            } catch (IOException e) {
                System.err.println("Erro: " + e.getMessage());
            }
        }
    }
    
    // ❌ Implementação 4: NÃO pode declarar exceção MAIS AMPLA
    // public static class Impl4 implements Processador {
    //     @Override
    //     public void processar(String arquivo) throws Exception {
    //         // ERRO: Exception é mais ampla que IOException
    //     }
    // }
}
```

**Implementação** segue mesmas regras de **override**.

### 8. Obrigatoriedade em Lambdas e Streams

```java
// ❌ Lambdas NÃO podem lançar checked diretamente
public class LambdasThrows {
    
    // ❌ PROBLEMA: lambda não pode lançar checked
    public static void problema() {
        List<String> arquivos = Arrays.asList("a.txt", "b.txt", "c.txt");
        
        // ❌ NÃO COMPILA
        // arquivos.forEach(arquivo -> {
        //     FileReader reader = new FileReader(arquivo);  // ERRO
        // });
    }
    
    // ✅ SOLUÇÃO 1: tratar DENTRO do lambda
    public static void solucao1() {
        List<String> arquivos = Arrays.asList("a.txt", "b.txt", "c.txt");
        
        arquivos.forEach(arquivo -> {
            try {
                FileReader reader = new FileReader(arquivo);
                // processar...
            } catch (IOException e) {
                System.err.println("Erro ao ler " + arquivo + ": " + e.getMessage());
            }
        });
    }
    
    // ✅ SOLUÇÃO 2: encapsular em unchecked
    public static void solucao2() {
        List<String> arquivos = Arrays.asList("a.txt", "b.txt", "c.txt");
        
        arquivos.forEach(arquivo -> {
            try {
                FileReader reader = new FileReader(arquivo);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao ler " + arquivo, e);
            }
        });
    }
    
    // ✅ SOLUÇÃO 3: método auxiliar que trata
    public static void solucao3() {
        List<String> arquivos = Arrays.asList("a.txt", "b.txt", "c.txt");
        
        arquivos.forEach(LambdasThrows::lerArquivo);
    }
    
    private static void lerArquivo(String arquivo) {
        try {
            FileReader reader = new FileReader(arquivo);
            // processar...
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    // ✅ SOLUÇÃO 4: wrapper funcional
    @FunctionalInterface
    public interface ThrowingConsumer<T> {
        void accept(T t) throws Exception;
    }
    
    public static <T> Consumer<T> wrapper(ThrowingConsumer<T> consumer) {
        return t -> {
            try {
                consumer.accept(t);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        };
    }
    
    public static void solucao4() {
        List<String> arquivos = Arrays.asList("a.txt", "b.txt", "c.txt");
        
        arquivos.forEach(wrapper(arquivo -> {
            FileReader reader = new FileReader(arquivo);
        }));
    }
}
```

**Lambdas** devem **tratar** checked internamente ou **encapsular** em unchecked.

### 9. Obrigatoriedade: Exceções Múltiplas

```java
// ✅ Tratar ou declarar múltiplas exceções
public class ExcecoesMultiplas {
    
    // ✅ Declarar MÚLTIPLAS com throws
    public static void declarar() throws IOException, SQLException, 
                                         ClassNotFoundException {
        FileReader reader = new FileReader("arquivo.txt");
        Connection conn = DriverManager.getConnection("jdbc:...");
        Class.forName("com.exemplo.MinhaClasse");
    }
    
    // ✅ Tratar MÚLTIPLAS com catch separados
    public static void tratarSeparado() {
        try {
            declarar();
        } catch (FileNotFoundException e) {
            System.err.println("Arquivo não encontrado: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("Erro I/O: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("Erro SQL: " + e.getMessage());
        } catch (ClassNotFoundException e) {
            System.err.println("Classe não encontrada: " + e.getMessage());
        }
    }
    
    // ✅ Tratar MÚLTIPLAS com multi-catch (Java 7+)
    public static void tratarMultiCatch() {
        try {
            declarar();
        } catch (IOException | SQLException | ClassNotFoundException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    // ✅ Tratar ALGUMAS, propagar OUTRAS
    public static void hibrido() throws SQLException, ClassNotFoundException {
        try {
            declarar();
        } catch (FileNotFoundException e) {
            // Trata FileNotFoundException
            System.err.println("Arquivo não encontrado, usando padrão");
        } catch (IOException e) {
            // Trata outras IOException
            System.err.println("Erro I/O: " + e.getMessage());
        }
        // SQLException e ClassNotFoundException PROPAGAM
    }
}
```

**Múltiplas** exceções: tratar **cada** ou **declarar todas**.

### 10. Resumo Visual: Obrigatoriedade

```java
/*
 * OBRIGATORIEDADE: TRATAR OU DECLARAR
 * 
 * ┌──────────────────────────────────────┐
 * │  CÓDIGO COM CHECKED EXCEPTION        │
 * │  FileReader r = new FileReader(...); │
 * └────────────┬─────────────────────────┘
 *              │
 *              ▼
 *      ┌───────────────┐
 *      │  COMPILADOR   │
 *      │   DETECTA     │
 *      │   IOException │
 *      └───────┬───────┘
 *              │
 *      ┌───────┴───────┐
 *      │  OBRIGATÓRIO  │
 *      │   escolher    │
 *      └───────┬───────┘
 *              │
 *    ┌─────────┴─────────┐
 *    │                   │
 *    ▼                   ▼
 * ┌──────┐          ┌──────────┐
 * │THROWS│          │TRY-CATCH │
 * └──┬───┘          └───┬──────┘
 *    │                  │
 *    │ declarar         │ tratar
 *    │ exceção          │ localmente
 *    │                  │
 *    ▼                  ▼
 * propaga          não propaga
 * para            chamador OK
 * chamador
 *    │                  │
 *    └─────────┬────────┘
 *              │
 *              ▼
 *        ┌──────────┐
 *        │ COMPILA  │
 *        └──────────┘
 * 
 * REGRAS:
 *   - DEVE escolher throws OU try-catch
 *   - NÃO compila sem um dos dois
 *   - throws: propaga para chamador
 *   - try-catch: trata localmente
 *   - Override: pode ser mais restritivo
 *   - Lambdas: devem tratar internamente
 */

public class ResumoObrigatoriedade {
    public static void main(String[] args) {
        System.out.println("=== OBRIGATORIEDADE ===");
        System.out.println("\nCHECKED: DEVE escolher");
        System.out.println("  OPÇÃO 1: throws (declarar)");
        System.out.println("  OPÇÃO 2: try-catch (tratar)");
        System.out.println("\nUNCHECKED: NÃO obriga");
        System.out.println("  - throws: opcional");
        System.out.println("  - try-catch: opcional");
    }
}
```

---

## Aplicabilidade

**Obrigatoriedade** garante:
- Chamador **ciente** do possível erro
- **Não esquecer** de tratar
- Código mais **robusto**
- Falhas **esperadas** tratadas

---

## Armadilhas

### 1. Esquecer throws

```java
// ❌ Esqueceu throws: não compila
// public void ler() {
//     FileReader r = new FileReader("file");
// }

// ✅ Adicionar throws
public void ler() throws IOException { }
```

### 2. throws Desnecessário

```java
// ⚠️ throws mas não lança
public void metodo() throws IOException {
    // Não lança IOException
}

// ✅ Remover throws desnecessário
public void metodo() {
    // Sem exceção
}
```

### 3. Capturar e Ignorar

```java
// ❌ Captura e ignora
try {
    ler();
} catch (IOException e) {
    // Silencioso
}

// ✅ Logar ou tratar
catch (IOException e) {
    logger.error("Erro", e);
}
```

---

## Boas Práticas

### 1. throws Quando Não Pode Tratar

```java
// ✅ Não pode tratar: usar throws
public String ler() throws IOException {
    return lerArquivo();
}
```

### 2. try-catch Quando Pode Recuperar

```java
// ✅ Pode recuperar: tratar
try {
    ler();
} catch (FileNotFoundException e) {
    usarArquivoPadrao();
}
```

### 3. Documentar com @throws

```java
/**
 * @throws IOException Se erro ao ler
 */
public void ler() throws IOException { }
```

---

## Resumo

**Obrigatoriedade** = DEVE **tratar** ou **declarar** checked exceptions.

**Duas opções**:
1. **throws**: declarar na assinatura (propaga)
2. **try-catch**: capturar e tratar (não propaga)

**Declarar (throws)**:
- `throws IOException` na assinatura
- Múltiplas: `throws IOException, SQLException`
- Propaga para **chamador** (deve tratar)
- Usar quando **não pode** tratar localmente

**Tratar (try-catch)**:
- `try { } catch (IOException e) { }`
- Múltiplos catch: específico → genérico
- Multi-catch: `catch (IOException | SQLException e)`
- **Não propaga** (tratado localmente)
- Usar quando **pode recuperar**

**Regras especiais**:
- **Override**: pode ser igual/mais específica/nenhuma
- **Construtores**: podem ter `throws`
- **Interfaces**: podem declarar exceções
- **Lambdas**: devem tratar internamente

**Propagação**:
- Cada método **deve** tratar ou declarar
- Sobe pela **pilha** até ser tratada
- Se **não tratada**: erro de compilação

**Regra de Ouro**: Checked **obriga** escolher `throws` ou `try-catch`. **Não compila** sem um dos dois. Usar **throws** quando não pode tratar. Usar **try-catch** quando pode recuperar. **Documentar** com `@throws`.
