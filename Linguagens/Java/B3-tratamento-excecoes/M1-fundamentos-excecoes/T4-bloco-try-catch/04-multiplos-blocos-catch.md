# T4.04 - Múltiplos Blocos catch

## Introdução

**Múltiplos blocos catch** permitem tratar **diferentes exceções** separadamente.

```java
/*
 * MÚLTIPLOS CATCH
 * 
 * SINTAXE:
 * try {
 *     // código
 * } catch (Tipo1 e1) {
 *     // trata Tipo1
 * } catch (Tipo2 e2) {
 *     // trata Tipo2
 * } catch (Tipo3 e3) {
 *     // trata Tipo3
 * }
 * 
 * REGRAS:
 *   - ORDEM importa (específico → genérico)
 *   - Apenas UM catch executa
 *   - Primeiro compatível vence
 */

// ✅ Múltiplos catch
try {
    FileReader reader = new FileReader("arquivo.txt");
    String linha = new BufferedReader(reader).readLine();
    int numero = Integer.parseInt(linha);
    
} catch (FileNotFoundException e) {
    System.err.println("Arquivo não encontrado");
    
} catch (IOException e) {
    System.err.println("Erro ao ler arquivo");
    
} catch (NumberFormatException e) {
    System.err.println("Linha não é número");
}
```

**Múltiplos catch** = tratar **diferentes** exceções **separadamente**.

---

## Fundamentos

### 1. Por Que Múltiplos Catch?

```java
// ✅ Por que usar múltiplos catch
public class PorQueMultiplosCatch {
    
    // ❌ SEM múltiplos catch (genérico)
    public static void semMultiplos() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            String linha = new BufferedReader(reader).readLine();
            int numero = Integer.parseInt(linha);
            
        } catch (Exception e) {
            // ❌ Trata TUDO igual (genérico demais)
            System.err.println("Erro: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // ✅ COM múltiplos catch (específico)
    public static void comMultiplos() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            String linha = new BufferedReader(reader).readLine();
            int numero = Integer.parseInt(linha);
            
        } catch (FileNotFoundException e) {
            // ✅ Tratamento ESPECÍFICO para arquivo não encontrado
            System.err.println("ERRO: Arquivo 'arquivo.txt' não encontrado");
            System.err.println("SOLUÇÃO: Crie o arquivo ou verifique o caminho");
            
        } catch (IOException e) {
            // ✅ Tratamento ESPECÍFICO para outros erros I/O
            System.err.println("ERRO: Falha ao ler arquivo");
            System.err.println("DETALHES: " + e.getMessage());
            
        } catch (NumberFormatException e) {
            // ✅ Tratamento ESPECÍFICO para conversão
            System.err.println("ERRO: Conteúdo não é número");
            System.err.println("SOLUÇÃO: Arquivo deve conter número válido");
        }
    }
    
    /*
     * VANTAGENS MÚLTIPLOS CATCH:
     * 
     * 1. Tratamento ESPECÍFICO
     *    - Mensagem adequada para cada erro
     *    - Ação específica para cada tipo
     * 
     * 2. Melhor DIAGNÓSTICO
     *    - Usuário entende o problema
     *    - Soluções específicas
     * 
     * 3. Recuperação DIFERENCIADA
     *    - Arquivo não encontrado: criar padrão
     *    - Erro I/O: tentar novamente
     *    - Número inválido: solicitar nova entrada
     */
}
```

**Múltiplos catch** = tratamento **específico** para cada exceção.

### 2. Sintaxe Múltiplos Catch

```java
// ✅ Sintaxe completa
public class SintaxeMultiplos {
    
    public static void exemplo() {
        try {
            // Código que pode lançar múltiplas exceções
            processarArquivo("dados.txt");
            
        } catch (FileNotFoundException e) {
            // Catch 1: arquivo não encontrado
            System.err.println("Arquivo não encontrado");
            e.printStackTrace();
            
        } catch (EOFException e) {
            // Catch 2: fim arquivo inesperado
            System.err.println("Fim de arquivo inesperado");
            e.printStackTrace();
            
        } catch (IOException e) {
            // Catch 3: outros erros I/O
            System.err.println("Erro I/O: " + e.getMessage());
            e.printStackTrace();
            
        } catch (NumberFormatException e) {
            // Catch 4: conversão inválida
            System.err.println("Formato de número inválido");
            e.printStackTrace();
            
        } catch (Exception e) {
            // Catch 5: qualquer outra exceção
            System.err.println("Erro inesperado: " + e.getMessage());
            e.printStackTrace();
        }
        
        /*
         * SINTAXE:
         * 
         * try { ... }
         * catch (Tipo1 var1) { ... }   ← Catch 1
         * catch (Tipo2 var2) { ... }   ← Catch 2
         * catch (Tipo3 var3) { ... }   ← Catch 3
         * ...
         * 
         * REGRAS:
         *   - Ordem: específico → genérico
         *   - Apenas UM catch executa
         *   - Variáveis independentes (e1, e2, e3)
         */
    }
    
    private static void processarArquivo(String caminho) throws IOException {
        // simula processamento
    }
}
```

**Sintaxe**: múltiplos `catch` em sequência, ordem específico→genérico.

### 3. Apenas UM Catch Executa

```java
// ✅ Apenas UM catch executa (primeiro compatível)
public class ApenasUmCatchExecuta {
    
    public static void exemplo() {
        System.out.println("Antes do try");
        
        try {
            System.out.println("Dentro do try");
            throw new FileNotFoundException("Arquivo não existe");
            
        } catch (FileNotFoundException e) {
            // ✅ ESTE executa (primeiro compatível)
            System.out.println("Catch 1: FileNotFoundException");
            
        } catch (IOException e) {
            // ❌ NÃO executa (já capturado)
            System.out.println("Catch 2: IOException (NÃO executa)");
            
        } catch (Exception e) {
            // ❌ NÃO executa (já capturado)
            System.out.println("Catch 3: Exception (NÃO executa)");
        }
        
        System.out.println("Depois do try-catch");
        
        /*
         * SAÍDA:
         * Antes do try
         * Dentro do try
         * Catch 1: FileNotFoundException
         * Depois do try-catch
         * 
         * APENAS catch 1 executa!
         * 
         * PROCESSO:
         *   1. FileNotFoundException lançada
         *   2. JVM procura catch compatível (top-down)
         *   3. Catch 1 compatível → EXECUTA
         *   4. Demais catch IGNORADOS
         *   5. Continua após try-catch
         */
    }
}
```

**Apenas UM** catch executa (primeiro compatível vence).

### 4. Tratamento Diferenciado

```java
// ✅ Tratamento diferenciado por exceção
public class TratamentoDiferenciado {
    
    public static void processarPedido(String arquivoPedido) {
        try {
            // Abrir arquivo pedido
            FileReader reader = new FileReader(arquivoPedido);
            BufferedReader br = new BufferedReader(reader);
            
            // Ler dados
            String idStr = br.readLine();
            String valorStr = br.readLine();
            
            // Converter
            int id = Integer.parseInt(idStr);
            double valor = Double.parseDouble(valorStr);
            
            // Processar
            processarCompra(id, valor);
            
            br.close();
            
        } catch (FileNotFoundException e) {
            // ✅ Arquivo não existe: criar pedido padrão
            System.err.println("Pedido não encontrado, criando padrão...");
            criarPedidoPadrao();
            
        } catch (NumberFormatException e) {
            // ✅ Dados inválidos: solicitar correção
            System.err.println("Dados do pedido inválidos");
            System.err.println("Por favor, corrija o arquivo: " + arquivoPedido);
            solicitarCorrecao();
            
        } catch (IOException e) {
            // ✅ Erro I/O: tentar novamente
            System.err.println("Erro ao ler pedido, tentando novamente...");
            tentarNovamente(arquivoPedido);
            
        } catch (Exception e) {
            // ✅ Erro inesperado: logar e notificar admin
            System.err.println("Erro inesperado ao processar pedido");
            logger.error("Erro processamento", e);
            notificarAdmin(e);
        }
    }
    
    private static void processarCompra(int id, double valor) { }
    private static void criarPedidoPadrao() { }
    private static void solicitarCorrecao() { }
    private static void tentarNovamente(String arquivo) { }
    private static class logger {
        static void error(String msg, Exception e) { }
    }
    private static void notificarAdmin(Exception e) { }
}
```

**Diferenciado**: ação **específica** para cada tipo exceção.

### 5. Múltiplos Catch com Hierarquia

```java
// ✅ Múltiplos catch respeitando hierarquia
public class MultiplosComHierarquia {
    
    /*
     * HIERARQUIA:
     * 
     * Exception
     *   └── IOException
     *         ├── FileNotFoundException
     *         ├── EOFException
     *         └── SocketException
     */
    
    public static void exemplo() {
        try {
            // Código que lança IOException ou subclasses
            abrirArquivo("dados.txt");
            
        } catch (FileNotFoundException e) {
            // ✅ Subclasse 1 (específica)
            System.err.println("Arquivo não encontrado: " + e.getMessage());
            
        } catch (EOFException e) {
            // ✅ Subclasse 2 (específica)
            System.err.println("Fim arquivo inesperado: " + e.getMessage());
            
        } catch (SocketException e) {
            // ✅ Subclasse 3 (específica)
            System.err.println("Erro socket: " + e.getMessage());
            
        } catch (IOException e) {
            // ✅ Superclasse (genérica - captura outras IOException)
            System.err.println("Erro I/O genérico: " + e.getMessage());
            
        } catch (Exception e) {
            // ✅ Mais genérica (captura TUDO)
            System.err.println("Erro inesperado: " + e.getMessage());
        }
        
        /*
         * ORDEM:
         *   1-3: Subclasses específicas (FileNotFound, EOF, Socket)
         *   4: Superclasse menos específica (IOException)
         *   5: Superclasse muito genérica (Exception)
         * 
         * ESPECÍFICO → GENÉRICO
         */
    }
    
    private static void abrirArquivo(String caminho) throws IOException {
        // simula
    }
}
```

**Hierarquia**: subclasses **específicas** antes, superclasse **genérica** depois.

### 6. Múltiplos Catch Sem Hierarquia

```java
// ✅ Múltiplos catch sem relação hierárquica
public class MultiplosSemHierarquia {
    
    /*
     * EXCEÇÕES SEM RELAÇÃO:
     *   - FileNotFoundException (IOException)
     *   - SQLException (sem relação com IO)
     *   - NumberFormatException (RuntimeException)
     *   - ClassNotFoundException (sem relação)
     */
    
    public static void exemplo() {
        try {
            // Código que pode lançar várias exceções diferentes
            
            // I/O
            FileReader reader = new FileReader("config.properties");
            
            // SQL
            Connection conn = DriverManager.getConnection("jdbc:...");
            
            // Conversão
            int valor = Integer.parseInt("texto");
            
            // Reflection
            Class.forName("MinhaClasse");
            
        } catch (FileNotFoundException e) {
            System.err.println("Arquivo não encontrado");
            
        } catch (SQLException e) {
            System.err.println("Erro banco de dados");
            
        } catch (NumberFormatException e) {
            System.err.println("Conversão inválida");
            
        } catch (ClassNotFoundException e) {
            System.err.println("Classe não encontrada");
            
        } catch (IOException e) {
            // Captura outras IOException (não FileNotFound)
            System.err.println("Erro I/O");
            
        } catch (Exception e) {
            System.err.println("Erro inesperado");
        }
        
        /*
         * SEM HIERARQUIA:
         *   - Ordem entre "irmãs" é LIVRE
         *   - SQLException e NumberFormat podem trocar
         *   - MAS IOException DEVE vir APÓS FileNotFound
         *   - E Exception SEMPRE por ÚLTIMO
         */
    }
}
```

**Sem hierarquia**: ordem **livre** entre "irmãs", **específico→genérico** na hierarquia.

### 7. Variáveis Independentes nos Catch

```java
// ✅ Cada catch tem variável independente
public class VariaveisIndependentes {
    
    public static void exemplo() {
        try {
            // código
            
        } catch (FileNotFoundException fileNotFound) {
            // ✅ Variável 'fileNotFound' (escopo deste catch)
            System.err.println("Arquivo: " + fileNotFound.getMessage());
            
        } catch (IOException ioError) {
            // ✅ Variável 'ioError' (escopo deste catch)
            System.err.println("I/O: " + ioError.getMessage());
            
        } catch (NumberFormatException numberError) {
            // ✅ Variável 'numberError' (escopo deste catch)
            System.err.println("Número: " + numberError.getMessage());
        }
        
        /*
         * VARIÁVEIS:
         *   - Cada catch tem SUA variável
         *   - Nomes podem ser DIFERENTES (e1, e2, e3)
         *   - Escopo: SOMENTE dentro do catch
         *   - Tipos DIFERENTES (FileNotFound, IO, NumberFormat)
         */
    }
    
    // ✅ Mesmo nome em catches diferentes (OK)
    public static void exemploMesmoNome() {
        try {
            // código
            
        } catch (IOException e) {
            // Variável 'e' (escopo deste catch)
            e.printStackTrace();
            
        } catch (SQLException e) {
            // ✅ OUTRA variável 'e' (escopo diferente)
            e.printStackTrace();
            
        } catch (Exception e) {
            // ✅ OUTRA variável 'e' (escopo diferente)
            e.printStackTrace();
        }
        
        /*
         * MESMO NOME:
         *   - Cada 'e' é variável DIFERENTE
         *   - Escopos SEPARADOS
         *   - Tipos DIFERENTES
         */
    }
}
```

**Variáveis**: cada catch tem **sua** variável (escopos independentes).

### 8. Múltiplos Catch com Finally

```java
// ✅ Múltiplos catch + finally
public class MultiplosComFinally {
    
    public static void exemplo() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("dados.txt");
            // processar arquivo
            
        } catch (FileNotFoundException e) {
            System.err.println("Arquivo não encontrado");
            
        } catch (IOException e) {
            System.err.println("Erro I/O");
            
        } finally {
            // ✅ Finally executa SEMPRE (após qualquer catch)
            System.out.println("Finally: fechando recursos");
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    System.err.println("Erro ao fechar: " + e.getMessage());
                }
            }
        }
        
        /*
         * FLUXO:
         * 
         * try → exceção → catch compatível → finally → continua
         * 
         * FileNotFoundException:
         *   try → catch FileNotFound → finally
         * 
         * IOException (não FileNotFound):
         *   try → catch IOException → finally
         * 
         * Sem exceção:
         *   try completo → finally
         */
    }
}
```

**Finally** executa **sempre** (após qualquer catch ou try).

### 9. Quando Usar Múltiplos Catch

```java
// ✅ Quando usar múltiplos catch
public class QuandoUsarMultiplos {
    
    // ✅ USAR múltiplos: tratamento DIFERENTE
    public static void usarMultiplos() {
        try {
            processarTransacao();
            
        } catch (InsuficienteFundsException e) {
            // Ação específica: solicitar depósito
            System.err.println("Saldo insuficiente");
            solicitarDeposito();
            
        } catch (InvalidAccountException e) {
            // Ação específica: verificar conta
            System.err.println("Conta inválida");
            verificarConta();
            
        } catch (NetworkException e) {
            // Ação específica: tentar novamente
            System.err.println("Erro de rede");
            tentarNovamente();
        }
    }
    
    // ❌ NÃO usar múltiplos: tratamento IGUAL
    public static void naoUsarMultiplos() {
        try {
            processarDados();
            
        } catch (IOException e) {
            // Mesmo tratamento
            logar(e);
            
        } catch (SQLException e) {
            // ❌ Mesmo tratamento (melhor usar catch único)
            logar(e);
            
        } catch (ParseException e) {
            // ❌ Mesmo tratamento
            logar(e);
        }
    }
    
    // ✅ MELHOR: catch único (tratamento igual)
    public static void melhor() {
        try {
            processarDados();
            
        } catch (Exception e) {
            // ✅ Único catch (tratamento igual para todas)
            logar(e);
        }
    }
    
    private static void processarTransacao() throws InsuficienteFundsException, 
                                                     InvalidAccountException, 
                                                     NetworkException { }
    private static void processarDados() throws IOException, SQLException, ParseException { }
    private static void solicitarDeposito() { }
    private static void verificarConta() { }
    private static void tentarNovamente() { }
    private static void logar(Exception e) { }
    
    static class InsuficienteFundsException extends Exception { }
    static class InvalidAccountException extends Exception { }
    static class NetworkException extends Exception { }
}
```

**Usar múltiplos**: tratamento **diferente**. Catch único: tratamento **igual**.

### 10. Resumo Visual: Múltiplos Catch

```java
/*
 * MÚLTIPLOS BLOCOS CATCH
 * 
 * ┌────────────────────────────────────────┐
 * │ try {                                  │
 * │     // Código que pode lançar          │
 * │     // MÚLTIPLAS exceções              │
 * │ }                                      │
 * │ catch (Específica1 e1) {               │  ← Catch 1
 * │     // Tratamento específico 1         │
 * │ }                                      │
 * │ catch (Específica2 e2) {               │  ← Catch 2
 * │     // Tratamento específico 2         │
 * │ }                                      │
 * │ catch (Genérica e3) {                  │  ← Catch 3
 * │     // Tratamento genérico             │
 * │ }                                      │
 * └────────────────────────────────────────┘
 * 
 * FLUXO:
 * 
 *       try
 *        ↓
 *    (exceção)
 *        ↓
 *   JVM procura
 *   catch compatível
 *   (top-down)
 *        ↓
 *  ┌────┴────┐
 *  │         │
 * Catch1  Catch2  Catch3
 *  │         │      │
 *  └────┬────┴──────┘
 *       ↓
 *  Apenas UM
 *   executa
 *       ↓
 *   Continua
 * 
 * REGRAS:
 * 
 * 1. ORDEM: Específico → Genérico
 *    ✅ FileNotFoundException → IOException → Exception
 *    ❌ IOException → FileNotFoundException (ERRO)
 * 
 * 2. APENAS UM EXECUTA:
 *    - Primeiro compatível vence
 *    - Demais ignorados
 * 
 * 3. VARIÁVEIS INDEPENDENTES:
 *    - Cada catch tem sua variável
 *    - Escopos separados
 *    - Podem ter mesmo nome (e)
 * 
 * 4. TRATAMENTO DIFERENCIADO:
 *    - FileNotFound: criar padrão
 *    - IOException: tentar novamente
 *    - NumberFormat: solicitar correção
 */

public class ResumoMultiplos {
    public static void main(String[] args) {
        System.out.println("=== MÚLTIPLOS CATCH ===");
        System.out.println("\n✅ Tratamento ESPECÍFICO para cada exceção");
        System.out.println("✅ ORDEM: específico → genérico");
        System.out.println("✅ APENAS UM catch executa");
        System.out.println("✅ Variáveis INDEPENDENTES");
    }
}
```

---

## Aplicabilidade

**Múltiplos catch** permitem:
- Tratamento **específico** por exceção
- **Recuperação** diferenciada
- **Mensagens** adequadas
- **Ações** específicas

---

## Armadilhas

### 1. Ordem Errada

```java
// ❌ Genérico antes específico
catch (IOException e) { }         // Genérico
catch (FileNotFoundException e) { }  // ❌ ERRO
```

### 2. Tratamento Igual

```java
// ⚠️ Tratamento igual (melhor catch único)
catch (IOException e) {
    logar(e);  // Mesmo código
}
catch (SQLException e) {
    logar(e);  // Mesmo código
}
```

### 3. Catch Muito Genérico

```java
// ❌ Exception captura tudo
catch (Exception e) {
    // Perde especificidade
}
```

---

## Boas Práticas

### 1. Tratamento Diferenciado

```java
// ✅ Ação específica
catch (FileNotFoundException e) {
    criarArquivoPadrao();
}
catch (IOException e) {
    tentarNovamente();
}
```

### 2. Ordem Específico → Genérico

```java
// ✅ Ordem correta
catch (FileNotFoundException e) { }
catch (IOException e) { }
catch (Exception e) { }
```

### 3. Nomes Descritivos

```java
// ✅ Nomes claros
catch (FileNotFoundException fileNotFound) {
    System.err.println("Arquivo: " + fileNotFound.getMessage());
}
```

---

## Resumo

**Múltiplos catch**: tratar **diferentes** exceções **separadamente**.

**Sintaxe**:
```java
try { }
catch (Tipo1 e1) { }
catch (Tipo2 e2) { }
catch (Tipo3 e3) { }
```

**Regras**:
- **Ordem**: específico → genérico
- **Apenas UM** executa (primeiro compatível)
- **Variáveis** independentes (escopos separados)

**Vantagens**:
- Tratamento **específico**
- Mensagens **adequadas**
- Recuperação **diferenciada**
- Ações **específicas**

**Quando usar**:
- Tratamento **diferente** por exceção
- Ações **específicas** necessárias
- **Evitar** se tratamento igual (usar catch único)

**Com hierarquia**:
- Subclasses **específicas** primeiro
- Superclasse **genérica** depois
- Exception sempre por **último**

**Regra de Ouro**: Usar múltiplos catch quando tratamento **diferente** necessário. Ordem **específico→genérico** obrigatória. **Apenas UM** catch executa (primeiro compatível vence). Variáveis **independentes** por catch.

