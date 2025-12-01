# T10.01 - Capturar Exceções Específicas

## Introdução

**Exceções específicas**: capturar tipo **exato** esperado.

```java
/*
 * EXCEÇÕES ESPECÍFICAS
 * 
 * ✅ ESPECÍFICA:
 * catch (FileNotFoundException e) { }
 * catch (NumberFormatException e) { }
 * 
 * ❌ GENÉRICA:
 * catch (Exception e) { }  // Muito amplo
 * catch (Throwable t) { }  // Muito amplo
 */

// ✅ Capturar específica
public class Exemplo {
    public static void main(String[] args) {
        try {
            FileReader fr = new FileReader("arquivo.txt");
        } catch (FileNotFoundException e) {  // ✅ Específica
            System.err.println("Arquivo não encontrado");
        }
    }
}

// ❌ Capturar genérica
public class ExemploRuim {
    public static void main(String[] args) {
        try {
            FileReader fr = new FileReader("arquivo.txt");
        } catch (Exception e) {  // ❌ Muito genérica
            System.err.println("Erro");  // Qual erro?
        }
    }
}
```

**Regra**: capturar **tipo específico** esperado, não genérico.

---

## Fundamentos

### 1. Por Que Específica

```java
// ✅ Específica: tratamento preciso
public class PorQueEspecifica {
    
    public static void main(String[] args) {
        try {
            processar("arquivo.txt");
        } catch (FileNotFoundException e) {
            // Sabe EXATAMENTE o que aconteceu
            System.err.println("Arquivo não encontrado: " + e.getMessage());
            System.err.println("Verifique se o arquivo existe");
        } catch (IOException e) {
            // Outro erro I/O
            System.err.println("Erro ao ler arquivo: " + e.getMessage());
        }
    }
    
    static void processar(String arquivo) throws IOException {
        FileReader fr = new FileReader(arquivo);
        // Processar
        fr.close();
    }
}

/*
 * VANTAGENS ESPECÍFICA:
 * 
 * 1. SABE O ERRO:
 *    FileNotFoundException → arquivo não existe
 *    IOException → erro leitura
 * 
 * 2. TRATAMENTO PRECISO:
 *    - Mensagem específica
 *    - Ação apropriada
 * 
 * 3. DEBUGGING FÁCIL:
 *    - Tipo indica problema
 */
```

**Específica**: tratamento **preciso** e **apropriado**.

### 2. Múltiplos Catches Específicos

```java
// ✅ Múltiplos catches específicos
public class MultiplosCatches {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (FileNotFoundException e) {
            // Arquivo não existe
            System.err.println("Arquivo não encontrado");
            criarArquivoDefault();
        } catch (NumberFormatException e) {
            // Formato número inválido
            System.err.println("Formato inválido: " + e.getMessage());
            usarValorPadrao();
        } catch (IOException e) {
            // Outro erro I/O
            System.err.println("Erro I/O: " + e.getMessage());
        }
    }
    
    static void processar() throws IOException {
        BufferedReader br = new BufferedReader(new FileReader("config.txt"));
        String linha = br.readLine();
        int valor = Integer.parseInt(linha);  // NumberFormatException
        br.close();
    }
    
    static void criarArquivoDefault() { }
    static void usarValorPadrao() { }
}

/*
 * MÚLTIPLOS CATCHES:
 * 
 * 1. FileNotFoundException:
 *    → Criar arquivo padrão
 * 
 * 2. NumberFormatException:
 *    → Usar valor padrão
 * 
 * 3. IOException:
 *    → Logar erro
 * 
 * Cada catch: ação ESPECÍFICA
 */
```

**Múltiplos**: cada catch trata **tipo específico**.

### 3. Ordem dos Catches

```java
// ✅ Ordem: mais específico → mais genérico
public class OrdemCatches {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (FileNotFoundException e) {  // Mais específica
            System.err.println("Arquivo não encontrado");
        } catch (IOException e) {  // Mais genérica
            System.err.println("Erro I/O");
        }
        // ✅ ORDEM CORRETA: FileNotFoundException antes IOException
        // FileNotFoundException extends IOException
    }
    
    static void processar() throws IOException {
        new FileReader("arquivo.txt");
    }
}

// ❌ Ordem errada: não compila
class OrdemErrada {
    public static void main(String[] args) {
        try {
            new FileReader("arquivo.txt");
        } catch (IOException e) {  // Mais genérica PRIMEIRO
            // ...
        } catch (FileNotFoundException e) {  // ❌ ERRO COMPILAÇÃO
            // Unreachable catch block
            // FileNotFoundException já capturada por IOException
        }
    }
}

/*
 * ORDEM CATCHES:
 * 
 * ✅ Específica → Genérica:
 * catch (FileNotFoundException e) { }  // Específica
 * catch (IOException e) { }            // Genérica
 * 
 * ❌ Genérica → Específica:
 * catch (IOException e) { }            // Genérica
 * catch (FileNotFoundException e) { }  // ❌ Unreachable
 */
```

**Ordem**: específica **antes** genérica (hierarquia).

### 4. Hierarquia de Exceções

```java
// ✅ Respeitar hierarquia
public class HierarquiaExcecoes {
    
    public static void main(String[] args) {
        /*
         * HIERARQUIA:
         * 
         * Throwable
         *   ├── Error
         *   └── Exception
         *         ├── RuntimeException
         *         │     ├── NullPointerException
         *         │     ├── IllegalArgumentException
         *         │     └── NumberFormatException
         *         └── IOException
         *               ├── FileNotFoundException
         *               └── EOFException
         */
        
        try {
            processar();
        } catch (FileNotFoundException e) {  // Mais específica
            // ...
        } catch (EOFException e) {  // Mesmo nível
            // ...
        } catch (IOException e) {  // Pai (mais genérica)
            // ...
        }
    }
    
    static void processar() throws IOException {
        new FileReader("arquivo.txt");
    }
}

/*
 * CAPTURAR POR NÍVEL:
 * 
 * ESPECÍFICA (filha):
 * catch (FileNotFoundException e) { }
 * catch (EOFException e) { }
 * 
 * GENÉRICA (pai):
 * catch (IOException e) { }
 * 
 * MUITO GENÉRICA (evitar):
 * catch (Exception e) { }
 */
```

**Hierarquia**: capturar **filha** antes **pai**.

### 5. Multi-catch (Java 7+)

```java
// ✅ Multi-catch: mesmo tratamento para múltiplas
public class MultiCatch {
    
    public static void main(String[] args) {
        // ✅ Multi-catch (Java 7+)
        try {
            processar();
        } catch (FileNotFoundException | NumberFormatException e) {
            //     ↑                      ↑
            //     Tipo 1                 Tipo 2 (mesmo tratamento)
            System.err.println("Erro: " + e.getMessage());
            usarValorPadrao();
        }
        
        // Equivalente a:
        try {
            processar();
        } catch (FileNotFoundException e) {
            System.err.println("Erro: " + e.getMessage());
            usarValorPadrao();
        } catch (NumberFormatException e) {
            System.err.println("Erro: " + e.getMessage());
            usarValorPadrao();
        }
    }
    
    static void processar() throws FileNotFoundException {
        BufferedReader br = new BufferedReader(new FileReader("config.txt"));
        // ...
    }
    
    static void usarValorPadrao() { }
}

/*
 * MULTI-CATCH:
 * 
 * SINTAXE:
 * catch (Tipo1 | Tipo2 | Tipo3 e) { }
 * 
 * QUANDO USAR:
 *   - Mesmo tratamento para múltiplas exceções
 *   - Evitar duplicação de código
 * 
 * RESTRIÇÕES:
 *   - Tipos não podem ter relação hierárquica
 *   - Variável é final implicitamente
 */
```

**Multi-catch**: mesmo **tratamento** para múltiplas exceções.

### 6. Evitar Exception Genérica

```java
// ❌ Exception genérica: problemas
public class EvitarGenerico {
    
    // ❌ Captura TUDO (inclusive bugs)
    public static void processar1() {
        try {
            String s = null;
            s.length();  // NullPointerException (BUG!)
        } catch (Exception e) {  // ❌ Captura NPE (bug deveria aparecer)
            System.err.println("Erro");
        }
    }
    
    // ❌ Não sabe o que tratar
    public static void processar2() {
        try {
            operacao();
        } catch (Exception e) {  // ❌ Qual exceção? Como tratar?
            System.err.println("Erro");  // Tratamento genérico
        }
    }
    
    // ✅ Específica: sabe o que esperar
    public static void processar3() {
        try {
            operacao();
        } catch (IOException e) {  // ✅ Sabe: erro I/O
            System.err.println("Erro I/O: " + e.getMessage());
            // Tratamento apropriado para I/O
        }
    }
    
    static void operacao() throws IOException {
        new FileReader("arquivo.txt");
    }
}

/*
 * PROBLEMAS Exception GENÉRICA:
 * 
 * 1. Captura BUGS:
 *    - NullPointerException
 *    - IllegalArgumentException
 *    - Bugs deveriam aparecer, não serem ocultados
 * 
 * 2. Não sabe TRATAR:
 *    - Qual erro ocorreu?
 *    - Como tratar apropriadamente?
 * 
 * 3. Dificulta DEBUG:
 *    - Oculta erros
 *    - Dificulta rastreamento
 */
```

**Evitar**: Exception **genérica** captura **tudo** (inclusive bugs).

### 7. Capturar RuntimeException

```java
// ❌ Evitar capturar RuntimeException
public class CapturarRuntimeException {
    
    // ❌ RuntimeException genérica
    public static void processar1() {
        try {
            int[] array = {1, 2, 3};
            System.out.println(array[10]);  // ArrayIndexOutOfBoundsException
        } catch (RuntimeException e) {  // ❌ Não capturar RuntimeException
            System.err.println("Erro");
        }
    }
    
    // ✅ Específica ou deixar subir
    public static void processar2() {
        try {
            int[] array = {1, 2, 3};
            int indice = obterIndice();
            System.out.println(array[indice]);
        } catch (ArrayIndexOutOfBoundsException e) {  // ✅ Específica
            System.err.println("Índice inválido");
            usarIndiceSeguro();
        }
    }
    
    // ✅ Melhor: prevenir (não capturar)
    public static void processar3() {
        int[] array = {1, 2, 3};
        int indice = obterIndice();
        
        if (indice >= 0 && indice < array.length) {  // ✅ Validar
            System.out.println(array[indice]);
        } else {
            System.err.println("Índice inválido");
        }
    }
    
    static int obterIndice() { return 10; }
    static void usarIndiceSeguro() { }
}

/*
 * RuntimeException:
 * 
 * ❌ NÃO capturar genérica:
 * catch (RuntimeException e) { }
 * 
 * ✅ Específica se necessário:
 * catch (ArrayIndexOutOfBoundsException e) { }
 * 
 * ✅ MELHOR: prevenir (validar)
 * if (indice < array.length) { }
 */
```

**RuntimeException**: **prevenir** com validação, não capturar genérica.

### 8. Exceção Específica por Camada

```java
// ✅ Exceção específica por camada
public class ExcecaoPorCamada {
    
    // Camada de apresentação
    public static void apresentacao() {
        try {
            servico();
        } catch (NegocioException e) {  // ✅ Específica da camada
            System.err.println("Erro de negócio: " + e.getMensagem());
        }
    }
    
    // Camada de serviço
    static void servico() throws NegocioException {
        try {
            repositorio();
        } catch (RepositorioException e) {  // ✅ Específica do repositório
            throw new NegocioException("Erro ao processar", e);
        }
    }
    
    // Camada de repositório
    static void repositorio() throws RepositorioException {
        try {
            banco();
        } catch (SQLException e) {  // ✅ Específica do banco
            throw new RepositorioException("Erro no banco", e);
        }
    }
    
    static void banco() throws SQLException {
        throw new SQLException("Tabela não encontrada");
    }
}

class NegocioException extends Exception {
    public NegocioException(String msg, Throwable causa) {
        super(msg, causa);
    }
    public String getMensagem() { return getMessage(); }
}

class RepositorioException extends Exception {
    public RepositorioException(String msg, Throwable causa) {
        super(msg, causa);
    }
}

/*
 * CAMADAS:
 * 
 * Apresentação → NegocioException
 * Serviço → RepositorioException
 * Repositório → SQLException
 * Banco → SQLException
 * 
 * Cada camada: exceção ESPECÍFICA
 */
```

**Camadas**: exceção **específica** para cada camada.

### 9. Documentar Exceções Esperadas

```java
// ✅ Documentar exceções específicas esperadas
public class DocumentarEsperadas {
    
    /**
     * Processa arquivo de configuração.
     * 
     * @param arquivo caminho do arquivo
     * @throws FileNotFoundException se arquivo não existir
     * @throws NumberFormatException se formato inválido
     * @throws IOException para outros erros I/O
     */
    public static void processar(String arquivo) 
            throws FileNotFoundException, NumberFormatException, IOException {
        BufferedReader br = new BufferedReader(new FileReader(arquivo));
        String linha = br.readLine();
        int valor = Integer.parseInt(linha);
        br.close();
    }
    
    public static void main(String[] args) {
        try {
            processar("config.txt");
        } catch (FileNotFoundException e) {  // Documentada
            System.err.println("Arquivo não encontrado");
        } catch (NumberFormatException e) {  // Documentada
            System.err.println("Formato inválido");
        } catch (IOException e) {  // Documentada
            System.err.println("Erro I/O");
        }
    }
}

/*
 * DOCUMENTAÇÃO:
 * 
 * @throws TipoExcecao descrição quando lançada
 * 
 * BENEFÍCIOS:
 *   - Quem chama sabe o que esperar
 *   - IDE mostra avisos
 *   - Javadoc gerado
 */
```

**Documentar**: `@throws` no Javadoc indica exceções **específicas** esperadas.

### 10. Resumo Visual

```java
/*
 * CAPTURAR EXCEÇÕES ESPECÍFICAS
 * 
 * ✅ ESPECÍFICA:
 * 
 * try {
 *     new FileReader("arquivo.txt");
 * } catch (FileNotFoundException e) {  // ✅ Específica
 *     System.err.println("Arquivo não encontrado");
 *     criarArquivo();
 * }
 * 
 * VANTAGENS:
 *   - Sabe EXATAMENTE o que aconteceu
 *   - Tratamento APROPRIADO
 *   - Debugging FÁCIL
 * 
 * 
 * ❌ GENÉRICA:
 * 
 * try {
 *     new FileReader("arquivo.txt");
 * } catch (Exception e) {  // ❌ Muito genérica
 *     System.err.println("Erro");  // Qual erro?
 *     // Como tratar apropriadamente?
 * }
 * 
 * PROBLEMAS:
 *   - Captura TUDO (inclusive bugs)
 *   - Não sabe TRATAR apropriadamente
 *   - Dificulta DEBUG
 * 
 * 
 * MÚLTIPLOS CATCHES ESPECÍFICOS:
 * 
 * try {
 *     processar();
 * } catch (FileNotFoundException e) {  // Específica 1
 *     criarArquivo();
 * } catch (NumberFormatException e) {  // Específica 2
 *     usarValorPadrao();
 * } catch (IOException e) {  // Específica 3 (mais genérica)
 *     logar(e);
 * }
 * 
 * 
 * ORDEM DOS CATCHES:
 * 
 * ✅ Específica → Genérica:
 * catch (FileNotFoundException e) { }  // Filha
 * catch (IOException e) { }            // Pai
 * 
 * ❌ Genérica → Específica (erro compilação):
 * catch (IOException e) { }            // Pai
 * catch (FileNotFoundException e) { }  // ❌ Unreachable
 * 
 * 
 * MULTI-CATCH (Java 7+):
 * 
 * try {
 *     processar();
 * } catch (FileNotFoundException | NumberFormatException e) {
 *     //     Tipo 1               Tipo 2
 *     usarValorPadrao();  // Mesmo tratamento
 * }
 * 
 * QUANDO USAR:
 *   - Mesmo tratamento para múltiplas exceções
 *   - Evitar duplicação
 * 
 * 
 * EVITAR Exception GENÉRICA:
 * 
 * ❌ Captura BUGS:
 * try {
 *     String s = null;
 *     s.length();  // NullPointerException (bug)
 * } catch (Exception e) {  // ❌ Captura NPE (bug oculto)
 *     System.err.println("Erro");
 * }
 * 
 * 
 * EVITAR RuntimeException GENÉRICA:
 * 
 * ❌ Capturar genérica:
 * catch (RuntimeException e) { }
 * 
 * ✅ Específica:
 * catch (ArrayIndexOutOfBoundsException e) { }
 * 
 * ✅ MELHOR: prevenir
 * if (indice < array.length) { }
 * 
 * 
 * HIERARQUIA:
 * 
 * Throwable
 *   ├── Error (não capturar)
 *   └── Exception
 *         ├── RuntimeException (evitar capturar genérica)
 *         │     ├── NullPointerException (específica OK)
 *         │     └── IllegalArgumentException (específica OK)
 *         └── IOException (específica ✅)
 *               └── FileNotFoundException (mais específica ✅)
 * 
 * 
 * EXCEÇÃO POR CAMADA:
 * 
 * Apresentação → NegocioException
 * Serviço → RepositorioException
 * Repositório → SQLException
 * 
 * Cada camada: específica
 * 
 * 
 * DOCUMENTAR:
 * 
 * /**
 *  * @throws FileNotFoundException se arquivo não existir
 *  * @throws IOException para outros erros I/O
 *  ✳/
 * public void processar() throws FileNotFoundException, IOException {
 *     // ...
 * }
 */

public class ExemploEspecifica {
    
    public static void main(String[] args) {
        // ✅ EXEMPLO COMPLETO: específicas
        try {
            processar("config.txt");
        } catch (FileNotFoundException e) {
            // Específica 1: arquivo não existe
            System.err.println("Arquivo não encontrado: " + e.getMessage());
            criarArquivoPadrao();
        } catch (NumberFormatException e) {
            // Específica 2: formato inválido
            System.err.println("Formato inválido: " + e.getMessage());
            usarValorPadrao();
        } catch (IOException e) {
            // Específica 3: outros erros I/O
            System.err.println("Erro I/O: " + e.getMessage());
            logar(e);
        }
    }
    
    /**
     * Processa arquivo de configuração.
     * 
     * @param arquivo caminho do arquivo
     * @throws FileNotFoundException se arquivo não existir
     * @throws NumberFormatException se formato número inválido
     * @throws IOException para outros erros I/O
     */
    static void processar(String arquivo) 
            throws FileNotFoundException, NumberFormatException, IOException {
        BufferedReader br = new BufferedReader(new FileReader(arquivo));
        String linha = br.readLine();
        int valor = Integer.parseInt(linha);
        System.out.println("Valor: " + valor);
        br.close();
    }
    
    static void criarArquivoPadrao() {
        System.out.println("Criando arquivo padrão...");
    }
    
    static void usarValorPadrao() {
        System.out.println("Usando valor padrão...");
    }
    
    static void logar(Exception e) {
        System.err.println("Logando erro: " + e);
    }
}
```

---

## Aplicabilidade

**Exceções específicas**:
- Capturar **tipo exato** esperado
- Tratamento **apropriado** por tipo
- **Documentar** com @throws

---

## Armadilhas

### 1. Exception Genérica

```java
// ❌ Exception genérica captura tudo
catch (Exception e) { }  // ❌ Inclusive bugs

// ✅ Específica
catch (IOException e) { }  // ✅ Sabe o que tratar
```

### 2. Ordem Errada

```java
// ❌ Genérica antes específica
catch (IOException e) { }            // Pai
catch (FileNotFoundException e) { }  // ❌ Unreachable

// ✅ Específica antes genérica
catch (FileNotFoundException e) { }  // Filha
catch (IOException e) { }            // Pai
```

---

## Boas Práticas

### 1. Específica Sempre

```java
// ✅ Capturar tipo específico
catch (FileNotFoundException e) { }
```

### 2. Múltiplos Catches

```java
// ✅ Cada tipo: tratamento específico
catch (FileNotFoundException e) { criarArquivo(); }
catch (NumberFormatException e) { usarPadrao(); }
```

### 3. Documentar

```java
// ✅ @throws no Javadoc
/**
 * @throws FileNotFoundException se arquivo não existir
 */
```

---

## Resumo

**Capturar específicas**: capturar **tipo exato** esperado, não genérico.

**Por quê**:
- **Sabe** exatamente o erro
- **Tratamento** apropriado
- **Debug** facilitado

**Evitar genérica**:
- `catch (Exception e)` → captura **tudo** (inclusive bugs)
- `catch (RuntimeException e)` → oculta erros programação
- `catch (Throwable t)` → captura até **Error**

**Múltiplos catches**:
- Cada tipo: **tratamento específico**
- Ordem: **específica → genérica** (hierarquia)
- Multi-catch: mesmo tratamento múltiplos tipos

**Ordem catches**:
```java
catch (FileNotFoundException e) { }  // Filha (específica)
catch (IOException e) { }            // Pai (genérica)
```

**Multi-catch** (Java 7+):
```java
catch (FileNotFoundException | NumberFormatException e) { }
```

**Hierarquia**:
- Capturar **filha** antes **pai**
- Genérica **após** específicas
- Compilador verifica ordem

**RuntimeException**:
- **Prevenir** com validação (melhor)
- **Específica** se necessário
- **Não** capturar genérica

**Por camada**:
- Apresentação → NegocioException
- Serviço → RepositorioException
- Repositório → SQLException

**Documentar**:
- `@throws TipoExcecao` descrição
- IDE mostra avisos
- Javadoc gerado

**Regra de Ouro**: Sempre capturar **tipo específico** esperado. Evitar Exception, RuntimeException, Throwable genéricos (capturam **tudo** inclusive bugs). Múltiplos catches: ordem **específica → genérica**. Multi-catch para mesmo tratamento. Documentar com @throws. Prevenir RuntimeException com validação ao invés de capturar.

