# T7.02 - throws: Declarar Exceções no Método

## Introdução

**throws** declara exceções que o método **pode lançar** (assinatura).

```java
/*
 * THROWS (declarar exceções)
 * 
 * PROPÓSITO:
 *   - DECLARAR exceções na assinatura
 *   - Informar que método PODE lançar
 *   - Transferir responsabilidade (quem chama trata)
 *   - Obrigatório para CHECKED exceptions
 * 
 * SINTAXE:
 * modificador tipo metodo() throws TipoExcecao {
 *     // código
 * }
 * 
 * DIFERENÇA throw:
 *   - throw: LANÇA exceção (instrução)
 *   - throws: DECLARA exceção (assinatura)
 */

// ✅ throws: declarar exceção
public static void lerArquivo(String caminho) throws IOException {
    // ↑ DECLARA que pode lançar IOException
    FileReader reader = new FileReader(caminho);  // Pode lançar IOException
    // ...
}

// Quem chama precisa tratar OU declarar throws
public static void main(String[] args) throws IOException {
    lerArquivo("arquivo.txt");  // OU: try-catch
}
```

**throws**: declara exceções que método **pode lançar** (assinatura).

---

## Fundamentos

### 1. Sintaxe do throws

```java
// ✅ Sintaxe básica do throws
public class SintaxeThrows {
    
    /*
     * SINTAXE:
     * 
     * modificador tipo metodo() throws TipoExcecao {
     *     // corpo
     * }
     * 
     * COMPONENTES:
     *   - throws: palavra-chave
     *   - TipoExcecao: classe de exceção
     *   - Localização: APÓS parênteses, ANTES chaves
     */
    
    // ✅ Uma exceção
    public static void metodo1() throws IOException {
        // código
    }
    
    // ✅ Múltiplas exceções (separadas por vírgula)
    public static void metodo2() throws IOException, SQLException {
        // código
    }
    
    // ✅ Com parâmetros
    public static void metodo3(String param) throws IOException {
        // código
    }
    
    // ✅ Com retorno
    public static String metodo4() throws IOException {
        return "resultado";
    }
    
    // ✅ Construtor
    public class MinhaClasse {
        public MinhaClasse() throws IOException {
            // código
        }
    }
}
```

**Sintaxe**: `void metodo() throws TipoExcecao`.

### 2. Checked Exceptions (Obrigatório)

```java
// ✅ throws obrigatório para CHECKED exceptions
public class CheckedExceptions {
    
    // ❌ ERRO: checked sem throws/catch
    public static void erro() {
        FileReader reader = new FileReader("arquivo.txt");
        // ↑ ERRO compilação: "Unhandled exception: IOException"
    }
    
    // ✅ OPÇÃO 1: throws (propagar)
    public static void opcao1() throws IOException {
        FileReader reader = new FileReader("arquivo.txt");
        // ✅ OK: declara throws
    }
    
    // ✅ OPÇÃO 2: try-catch (capturar)
    public static void opcao2() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        }
        // ✅ OK: captura exceção
    }
    
    /*
     * CHECKED EXCEPTIONS:
     *   - IOException
     *   - SQLException
     *   - ClassNotFoundException
     *   - InterruptedException
     *   - etc.
     * 
     * REGRA:
     *   - PRECISA: throws OU try-catch
     *   - Senão: ERRO de compilação
     */
}
```

**Checked**: throws **obrigatório** (ou try-catch).

### 3. Unchecked Exceptions (Opcional)

```java
// ✅ throws OPCIONAL para UNCHECKED exceptions
public class UncheckedExceptions {
    
    // ✅ Sem throws (unchecked)
    public static void metodo1(int divisor) {
        int resultado = 10 / divisor;
        // Pode lançar ArithmeticException
        // MAS não precisa throws
    }
    
    // ✅ Com throws (documentação)
    public static void metodo2(int divisor) throws ArithmeticException {
        int resultado = 10 / divisor;
        // throws OPCIONAL para unchecked
        // Serve como documentação
    }
    
    // ✅ Lançar explicitamente (sem throws)
    public static void metodo3(String texto) {
        if (texto == null) {
            throw new IllegalArgumentException("Texto null");
            // NÃO precisa throws (unchecked)
        }
    }
    
    /*
     * UNCHECKED EXCEPTIONS:
     *   - RuntimeException e subclasses
     *   - IllegalArgumentException
     *   - IllegalStateException
     *   - NullPointerException
     *   - ArithmeticException
     *   - etc.
     * 
     * REGRA:
     *   - NÃO precisa throws
     *   - throws OPCIONAL (documentação)
     */
}
```

**Unchecked**: throws **opcional** (documentação).

### 4. Propagar Exceção

```java
// ✅ throws propaga exceção para quem chama
public class PropagarExcecao {
    
    // ✅ Método A: lança IOException
    public static void metodoA() throws IOException {
        throw new IOException("Erro A");
    }
    
    // ✅ Método B: chama A, propaga
    public static void metodoB() throws IOException {
        metodoA();  // Chama A (que lança IOException)
        // ↑ Propaga IOException para quem chama B
    }
    
    // ✅ Método C: chama B, propaga
    public static void metodoC() throws IOException {
        metodoB();  // Chama B (que propaga IOException)
        // ↑ Propaga IOException para quem chama C
    }
    
    // ✅ Main: trata ou propaga
    public static void main(String[] args) {
        // OPÇÃO 1: throws (propaga)
        // public static void main(String[] args) throws IOException {
        //     metodoC();
        // }
        
        // OPÇÃO 2: try-catch (trata)
        try {
            metodoC();
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    /*
     * CADEIA DE PROPAGAÇÃO:
     * 
     * metodoA() throws IOException
     *    ↓ (propaga)
     * metodoB() throws IOException
     *    ↓ (propaga)
     * metodoC() throws IOException
     *    ↓ (propaga)
     * main() try-catch (trata)
     */
}
```

**Propagar**: throws transfere responsabilidade para **quem chama**.

### 5. Capturar vs Propagar

```java
// ✅ Capturar vs propagar
public class CapturarVsPropagar {
    
    // ✅ CAPTURAR (try-catch)
    public static void capturar() {
        // NÃO declara throws (trata internamente)
        try {
            FileReader reader = new FileReader("arquivo.txt");
            // usar reader
        } catch (IOException e) {
            System.err.println("Erro ao ler: " + e.getMessage());
            // Exceção TRATADA aqui (não propaga)
        }
    }
    
    // ✅ PROPAGAR (throws)
    public static void propagar() throws IOException {
        // Declara throws (não trata)
        FileReader reader = new FileReader("arquivo.txt");
        // Exceção PROPAGADA para quem chama
    }
    
    // ✅ HÍBRIDO (capturar algumas, propagar outras)
    public static void hibrido() throws SQLException {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            Connection conn = DriverManager.getConnection("...");
            
        } catch (IOException e) {
            // CAPTURA IOException
            System.err.println("Erro I/O: " + e.getMessage());
            
        }  // SQLException NÃO capturada - PROPAGA (throws)
    }
    
    /*
     * QUANDO CAPTURAR:
     *   ✅ Sabe COMO tratar
     *   ✅ Pode RECUPERAR do erro
     *   ✅ Quer LOGAR e continuar
     * 
     * QUANDO PROPAGAR:
     *   ✅ NÃO sabe como tratar
     *   ✅ NÃO pode recuperar
     *   ✅ Deixar quem chama decidir
     */
}
```

**Capturar**: try-catch (trata). **Propagar**: throws (transfere).

### 6. Múltiplas Exceções

```java
// ✅ Declarar múltiplas exceções
public class MultiplasExcecoes {
    
    // ✅ Vírgula separa exceções
    public static void metodo1() throws IOException, SQLException {
        if (Math.random() > 0.5) {
            throw new IOException("Erro I/O");
        } else {
            throw new SQLException("Erro SQL");
        }
    }
    
    // ✅ Três exceções
    public static void metodo2() 
            throws IOException, SQLException, ClassNotFoundException {
        // Pode lançar qualquer uma das três
    }
    
    // ✅ Quebra de linha (legibilidade)
    public static void metodo3() 
            throws IOException,
                   SQLException,
                   ClassNotFoundException {
        // Mesmo efeito, mais legível
    }
    
    // ✅ Quem chama: try-catch múltiplos
    public static void usar() {
        try {
            metodo1();
            
        } catch (IOException e) {
            System.err.println("Erro I/O: " + e.getMessage());
            
        } catch (SQLException e) {
            System.err.println("Erro SQL: " + e.getMessage());
        }
    }
}
```

**Múltiplas**: separar por **vírgula**.

### 7. Hierarquia de Exceções

```java
// ✅ Declarar superclasse vs subclasses
public class HierarquiaExcecoes {
    
    // ✅ Declarar subclasses específicas
    public static void especificas() 
            throws FileNotFoundException, EOFException {
        // Declara exceções ESPECÍFICAS
        if (Math.random() > 0.5) {
            throw new FileNotFoundException();
        } else {
            throw new EOFException();
        }
    }
    
    // ✅ Declarar superclasse genérica
    public static void generica() throws IOException {
        // Declara exceção GENÉRICA (cobre todas subclasses)
        if (Math.random() > 0.5) {
            throw new FileNotFoundException();  // ✅ OK (é IOException)
        } else {
            throw new EOFException();  // ✅ OK (é IOException)
        }
    }
    
    /*
     * HIERARQUIA:
     * 
     * IOException (superclasse)
     *   ├── FileNotFoundException
     *   ├── EOFException
     *   └── SocketException
     * 
     * throws IOException: cobre TODAS
     * throws FileNotFoundException: cobre SÓ FileNotFoundException
     */
    
    // ✅ Preferir específicas (mais informativo)
    public static void preferirEspecificas() 
            throws FileNotFoundException {
        // Declara ESPECÍFICA (mais informativo)
        throw new FileNotFoundException();
    }
}
```

**Hierarquia**: superclasse **cobre** subclasses.

### 8. Sobrescrever Métodos

```java
// ✅ Sobrescrever métodos com throws
public class SobrescreverMetodos {
    
    // ✅ Classe base
    public static class Base {
        public void metodo() throws IOException {
            // código
        }
    }
    
    // ✅ PODE: não declarar throws
    public static class Derivada1 extends Base {
        @Override
        public void metodo() {
            // ✅ OK: não declara throws (mais específico)
        }
    }
    
    // ✅ PODE: declarar mesma exceção
    public static class Derivada2 extends Base {
        @Override
        public void metodo() throws IOException {
            // ✅ OK: mesma exceção
        }
    }
    
    // ✅ PODE: declarar subclasse
    public static class Derivada3 extends Base {
        @Override
        public void metodo() throws FileNotFoundException {
            // ✅ OK: FileNotFoundException é subclasse de IOException
        }
    }
    
    // ❌ NÃO PODE: declarar superclasse
    // public static class Derivada4 extends Base {
    //     @Override
    //     public void metodo() throws Exception {
    //         // ❌ ERRO: Exception é superclasse de IOException
    //     }
    // }
    
    // ❌ NÃO PODE: declarar exceção não relacionada
    // public static class Derivada5 extends Base {
    //     @Override
    //     public void metodo() throws SQLException {
    //         // ❌ ERRO: SQLException não é subclasse de IOException
    //     }
    // }
    
    /*
     * REGRA SOBRESCRITA:
     *   ✅ PODE: não declarar
     *   ✅ PODE: mesma exceção
     *   ✅ PODE: subclasse
     *   ❌ NÃO PODE: superclasse
     *   ❌ NÃO PODE: exceção não relacionada
     */
}
```

**Sobrescrever**: pode ser **mais específico**, não **mais genérico**.

### 9. Construtor com throws

```java
// ✅ Construtor pode declarar throws
public class ConstrutorThrows {
    
    public static class MinhaClasse {
        private FileReader reader;
        
        // ✅ Construtor com throws
        public MinhaClasse(String caminho) throws IOException {
            // ↑ Construtor pode lançar exceção
            this.reader = new FileReader(caminho);
        }
        
        public void usar() throws IOException {
            int data = reader.read();
        }
        
        public void fechar() throws IOException {
            reader.close();
        }
    }
    
    // ✅ Usar (try-catch ao criar)
    public static void usar() {
        try {
            MinhaClasse obj = new MinhaClasse("arquivo.txt");
            obj.usar();
            obj.fechar();
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    // ✅ Ou propagar
    public static void propagar() throws IOException {
        MinhaClasse obj = new MinhaClasse("arquivo.txt");
        obj.usar();
        obj.fechar();
    }
}
```

**Construtor**: pode declarar **throws**.

### 10. Resumo Visual: throws

```java
/*
 * THROWS (declarar exceções)
 * 
 * SINTAXE:
 * 
 * modificador tipo metodo() throws TipoExcecao {
 *     // corpo
 * }
 * 
 * 
 * LOCALIZAÇÃO:
 * 
 * public void metodo(String param)
 *                               ↑
 *                          throws IOException
 *                                            ↑
 *                                            {
 *     // corpo
 * }
 * 
 * APÓS parênteses (), ANTES chaves {}
 * 
 * 
 * MÚLTIPLAS EXCEÇÕES:
 * 
 * public void metodo() throws IOException,
 *                             SQLException,
 *                             ClassNotFoundException {
 *     // corpo
 * }
 * 
 * Separadas por VÍRGULA
 * 
 * 
 * CHECKED vs UNCHECKED:
 * 
 * ┌──────────────────┬────────────┬──────────────┐
 * │                  │ Unchecked  │ Checked      │
 * ├──────────────────┼────────────┼──────────────┤
 * │ throws           │ OPCIONAL   │ OBRIGATÓRIO  │
 * │ Compilador       │ Não obriga │ Obriga       │
 * │ Propósito throws │ Documentar │ Informar     │
 * └──────────────────┴────────────┴──────────────┘
 * 
 * 
 * PROPAGAR vs CAPTURAR:
 * 
 * PROPAGAR (throws):
 * 
 * public void metodo() throws IOException {
 *     // código que lança IOException
 *     // NÃO trata - PROPAGA
 * }
 * 
 * CAPTURAR (try-catch):
 * 
 * public void metodo() {
 *     try {
 *         // código que lança IOException
 *     } catch (IOException e) {
 *         // TRATA exceção
 *     }
 * }
 * 
 * 
 * CADEIA DE PROPAGAÇÃO:
 * 
 * metodoA() throws IOException {
 *     throw new IOException();  ← LANÇA
 * }
 *    ↓
 * metodoB() throws IOException {
 *     metodoA();  ← PROPAGA
 * }
 *    ↓
 * metodoC() throws IOException {
 *     metodoB();  ← PROPAGA
 * }
 *    ↓
 * main() {
 *     try {
 *         metodoC();  ← TRATA
 *     } catch (IOException e) { }
 * }
 * 
 * 
 * HIERARQUIA:
 * 
 * throws IOException → cobre:
 *   - FileNotFoundException
 *   - EOFException
 *   - SocketException
 *   - etc.
 * 
 * throws FileNotFoundException → cobre:
 *   - APENAS FileNotFoundException
 * 
 * 
 * SOBRESCRITA:
 * 
 * class Base {
 *     void metodo() throws IOException { }
 * }
 * 
 * class Derivada extends Base {
 *     // ✅ OK
 *     void metodo() throws FileNotFoundException { }
 *     void metodo() throws IOException { }
 *     void metodo() { }
 *     
 *     // ❌ ERRO
 *     void metodo() throws Exception { }
 *     void metodo() throws SQLException { }
 * }
 * 
 * PODE: subclasse, mesma, nenhuma
 * NÃO PODE: superclasse, não relacionada
 * 
 * 
 * QUANDO USAR:
 * 
 * ✅ CHECKED exceptions (obrigatório)
 * ✅ Não sabe COMO tratar
 * ✅ Quer PROPAGAR responsabilidade
 * ✅ Documentar UNCHECKED (opcional)
 */

public class ResumoThrows {
    public static void main(String[] args) {
        System.out.println("=== THROWS (declarar) ===");
        System.out.println("\n✅ Sintaxe:");
        System.out.println("  void metodo() throws TipoExcecao");
        System.out.println("\n✅ Propósito:");
        System.out.println("  - DECLARAR exceções na assinatura");
        System.out.println("  - Informar que PODE lançar");
        System.out.println("  - PROPAGAR responsabilidade");
        System.out.println("\n✅ Checked:");
        System.out.println("  - throws OBRIGATÓRIO");
        System.out.println("\n✅ Unchecked:");
        System.out.println("  - throws OPCIONAL");
    }
}
```

---

## Aplicabilidade

**throws**:
- **Declara** exceções na assinatura
- **Propaga** responsabilidade
- **Obrigatório** para checked

---

## Armadilhas

### 1. Checked Sem throws

```java
// ❌ Checked sem throws/catch
public void metodo() {
    new FileReader("arquivo.txt");  // ❌ ERRO compilação
}

// ✅ Com throws
public void metodo() throws IOException {
    new FileReader("arquivo.txt");
}
```

### 2. Superclasse em Sobrescrita

```java
// ❌ Sobrescrever com superclasse
class Base {
    void metodo() throws IOException { }
}
class Derivada extends Base {
    void metodo() throws Exception { }  // ❌ ERRO
}

// ✅ Mesma ou subclasse
class Derivada extends Base {
    void metodo() throws FileNotFoundException { }  // ✅ OK
}
```

### 3. Declarar Sem Lançar

```java
// ⚠️ Declarar sem lançar (confuso)
public void metodo() throws IOException {
    // Código que NÃO lança IOException
    System.out.println("OK");
}

// ✅ Declarar só se realmente lançar
public void metodo() {
    System.out.println("OK");
}
```

---

## Boas Práticas

### 1. Declarar Específicas

```java
// ✅ Declarar exceções específicas
public void metodo() throws FileNotFoundException {
    // Específica (mais informativo)
}

// ❌ Declarar genérica desnecessariamente
public void metodo() throws Exception {
    // Genérica demais
}
```

### 2. Documentar no Javadoc

```java
// ✅ Documentar com @throws
/**
 * Lê arquivo.
 * @param caminho caminho do arquivo
 * @throws FileNotFoundException se arquivo não existe
 * @throws IOException se erro ao ler
 */
public void ler(String caminho) 
        throws FileNotFoundException, IOException {
    // código
}
```

### 3. Propagar Quando Não Souber Tratar

```java
// ✅ Propagar (não sabe tratar)
public void metodo() throws SQLException {
    // Deixa quem chama decidir como tratar
}

// ❌ Capturar e ignorar
public void metodo() {
    try {
        // código
    } catch (SQLException e) {
        // ❌ Ignora exceção (perigoso)
    }
}
```

---

## Resumo

**throws**: declara exceções na **assinatura** do método.

**Sintaxe**:
```java
void metodo() throws TipoExcecao {
    // corpo
}
```

**Propósito**:
- **Declarar** exceções que método pode lançar
- **Informar** quem chama
- **Propagar** responsabilidade (quem chama trata)
- **Obrigatório** para checked exceptions

**Localização**:
- **Após** parênteses `()`
- **Antes** chaves `{}`
- Na **assinatura** do método

**Checked vs Unchecked**:
- **Checked**: throws **obrigatório** (ou try-catch)
- **Unchecked**: throws **opcional** (documentação)

**Múltiplas**:
- Separar por **vírgula**
- `throws IOException, SQLException`

**Propagar**:
- **throws** transfere responsabilidade
- Quem chama **trata** (try-catch) ou **propaga** (throws)
- Cadeia de propagação até **tratar**

**Capturar vs Propagar**:
- **Capturar**: try-catch (trata internamente)
- **Propagar**: throws (deixa quem chama tratar)
- **Híbrido**: capturar algumas, propagar outras

**Hierarquia**:
- Superclasse **cobre** subclasses
- `throws IOException` cobre FileNotFoundException
- Preferir **específicas** (mais informativo)

**Sobrescrever**:
- **Pode**: mesma exceção, subclasse, nenhuma
- **Não pode**: superclasse, exceção não relacionada
- Método sobrescrito não pode ser **mais genérico**

**Construtor**:
- Construtor pode declarar **throws**
- Quem cria objeto **trata** ou **propaga**

**Regra de Ouro**: Usar throws para **propagar** checked exceptions. **Informar** quem chama que método pode lançar. Declarar exceções **específicas** (não genéricas). **Documentar** com @throws no Javadoc. Propagar quando **não souber** tratar. Capturar quando **puder** tratar/recuperar.

