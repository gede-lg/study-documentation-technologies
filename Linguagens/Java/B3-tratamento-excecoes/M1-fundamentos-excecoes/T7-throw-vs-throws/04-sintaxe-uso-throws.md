# T7.04 - Sintaxe e Uso de throws

## Introdução

**throws** declara exceções na **assinatura** do método (cláusula).

```java
/*
 * SINTAXE throws
 * 
 * modificador tipo metodo(params) throws TipoExcecao1, TipoExcecao2 {
 *     // corpo
 * }
 * 
 * ONDE:
 *   - throws: palavra-chave
 *   - TipoExcecao: classe(s) de exceção
 *   - Localização: APÓS parênteses, ANTES chaves
 *   - Múltiplas: separadas por VÍRGULA
 * 
 * CARACTERÍSTICAS:
 *   - DECLARAÇÃO (não instrução)
 *   - Na ASSINATURA do método
 *   - INFORMA que pode lançar
 *   - NÃO lança (apenas declara)
 */

// ✅ Sintaxe básica
public void lerArquivo(String caminho) throws IOException {
    //                                 ↑
    //                           Declara throws
    FileReader reader = new FileReader(caminho);
}
```

**throws**: cláusula de **declaração** na assinatura.

---

## Fundamentos

### 1. Estrutura da Declaração

```java
// ✅ Estrutura completa da declaração throws
public class EstruturaThrows {
    
    // ✅ Uma exceção
    public void metodo1() throws IOException {
        //                ↑      ↑
        //                │      └─ Tipo da exceção
        //                └─ Palavra-chave throws
    }
    
    // ✅ Múltiplas exceções (vírgula)
    public void metodo2() throws IOException, SQLException {
        //                ↑      ↑            ↑
        //                │      │            └─ Segunda exceção
        //                │      └─ Primeira exceção
        //                └─ throws
    }
    
    // ✅ Com parâmetros
    public void metodo3(String param) throws IOException {
        //               ↑             ↑
        //               │             └─ Após parênteses
        //               └─ Parâmetros
    }
    
    // ✅ Com retorno
    public String metodo4() throws IOException {
        //     ↑           ↑
        //     │           └─ Antes do tipo de retorno (não!)
        //     └─ Tipo de retorno
        return "resultado";
    }
    
    // ✅ Quebra de linha (legibilidade)
    public void metodo5() 
            throws IOException,
                   SQLException,
                   ClassNotFoundException {
        // Múltiplas linhas
    }
    
    /*
     * ORDEM NA ASSINATURA:
     * 
     * modificador tipo metodo(params) throws Exceções { corpo }
     *     ↑       ↑     ↑      ↑         ↑        ↑      ↑
     *     1       2     3      4         5        6      7
     * 
     * 1. Modificadores (public, static, final, etc.)
     * 2. Tipo de retorno (void, int, String, etc.)
     * 3. Nome do método
     * 4. Parâmetros (entre parênteses)
     * 5. throws (palavra-chave)
     * 6. Exceções (separadas por vírgula)
     * 7. Corpo (entre chaves)
     */
}
```

**Estrutura**: `tipo metodo(params) throws TipoExc`.

### 2. Localização na Assinatura

```java
// ✅ Localização exata do throws
public class LocalizacaoThrows {
    
    // ✅ Posição correta
    public void correto() throws IOException {
        // ↑ APÓS parênteses, ANTES chaves
    }
    
    // ❌ ERRO: antes dos parênteses
    // public void erro1() throws IOException () {
    //                                        ↑ ERRO
    // }
    
    // ❌ ERRO: dentro dos parênteses
    // public void erro2(throws IOException) {
    //                   ↑ ERRO
    // }
    
    // ❌ ERRO: antes do tipo de retorno
    // public throws IOException void erro3() {
    //        ↑ ERRO
    // }
    
    // ✅ Com modificadores
    public static synchronized final void comModificadores() 
            throws IOException {
        // throws APÓS todos modificadores e parâmetros
    }
    
    // ✅ Com genéricos
    public <T> T comGenerico(T param) throws IOException {
        //  ↑                        ↑
        //  │                        └─ throws após parênteses
        //  └─ Genéricos antes do tipo retorno
        return param;
    }
}
```

**Localização**: **após** parênteses, **antes** chaves.

### 3. Uma vs Múltiplas Exceções

```java
// ✅ Uma vs múltiplas exceções
public class UmaVsMultiplas {
    
    // ✅ Uma exceção
    public void uma() throws IOException {
        // Pode lançar APENAS IOException
        throw new IOException("Erro I/O");
    }
    
    // ✅ Duas exceções
    public void duas() throws IOException, SQLException {
        // Pode lançar IOException OU SQLException
        if (Math.random() > 0.5) {
            throw new IOException("Erro I/O");
        } else {
            throw new SQLException("Erro SQL");
        }
    }
    
    // ✅ Três ou mais (quebra linha)
    public void multiplas() 
            throws IOException,
                   SQLException,
                   ClassNotFoundException,
                   InterruptedException {
        // Pode lançar qualquer uma das quatro
    }
    
    // ✅ Vírgula separa
    public void virgula() throws IOException, SQLException {
        //                                  ↑
        //                               Vírgula
    }
    
    // ❌ ERRO: sem vírgula
    // public void erro() throws IOException SQLException {
    //                                      ↑ ERRO: falta vírgula
    // }
}
```

**Múltiplas**: separar por **vírgula**.

### 4. Checked vs Unchecked

```java
// ✅ throws com checked vs unchecked
public class CheckedVsUncheckedThrows {
    
    // ✅ CHECKED: throws OBRIGATÓRIO
    public void checked() throws IOException {
        // ↑ Obrigatório (ou try-catch)
        throw new IOException("Erro");
    }
    
    // ❌ ERRO: checked sem throws
    // public void erro() {
    //     throw new IOException();  // ERRO: precisa throws
    // }
    
    // ✅ UNCHECKED: throws OPCIONAL
    public void uncheckedComThrows() throws IllegalArgumentException {
        // ↑ OPCIONAL (documentação)
        throw new IllegalArgumentException("Erro");
    }
    
    // ✅ UNCHECKED: sem throws (também válido)
    public void uncheckedSemThrows() {
        // Sem throws (unchecked)
        throw new IllegalArgumentException("Erro");
    }
    
    /*
     * REGRA:
     * 
     * CHECKED (Exception):
     *   - throws OBRIGATÓRIO (ou try-catch)
     *   - Senão: ERRO de compilação
     * 
     * UNCHECKED (RuntimeException):
     *   - throws OPCIONAL
     *   - Serve como DOCUMENTAÇÃO
     */
}
```

**Checked**: throws **obrigatório**. **Unchecked**: throws **opcional**.

### 5. Hierarquia e Redundância

```java
// ✅ Hierarquia de exceções em throws
public class HierarquiaThrows {
    
    // ✅ Declarar superclasse (cobre subclasses)
    public void superclasse() throws IOException {
        // Cobre: FileNotFoundException, EOFException, etc.
        throw new FileNotFoundException();  // ✅ OK
        // throw new EOFException();  // ✅ OK também
    }
    
    // ⚠️ REDUNDANTE: superclasse + subclasse
    public void redundante() 
            throws IOException, FileNotFoundException {
        //            ↑               ↑
        //            │               └─ Redundante (já coberta)
        //            └─ Já cobre FileNotFoundException
        
        // ⚠️ Compila, mas FileNotFoundException redundante
    }
    
    // ✅ Preferir específicas
    public void especificas() 
            throws FileNotFoundException, EOFException {
        // Declara ESPECÍFICAS (mais informativo)
    }
    
    // ✅ Genérica quando lançar várias
    public void generica() throws IOException {
        // Declara IOException (cobre todas)
        if (Math.random() > 0.5) {
            throw new FileNotFoundException();
        } else {
            throw new EOFException();
        }
    }
    
    /*
     * HIERARQUIA:
     * 
     * Exception
     *   └─ IOException
     *        ├─ FileNotFoundException
     *        ├─ EOFException
     *        └─ SocketException
     * 
     * throws IOException: cobre TODAS
     * throws FileNotFoundException: cobre SÓ FileNotFoundException
     */
}
```

**Hierarquia**: superclasse **cobre** subclasses.

### 6. Construtor com throws

```java
// ✅ Construtor pode declarar throws
public class ConstrutorThrows {
    
    public static class MinhaClasse {
        private FileReader reader;
        
        // ✅ Construtor com throws
        public MinhaClasse(String caminho) throws IOException {
            //                              ↑
            //                        Construtor pode throws
            this.reader = new FileReader(caminho);
        }
        
        // ✅ Construtor vazio com throws
        public MinhaClasse() throws IOException {
            this("arquivo.txt");  // Delega para outro construtor
        }
        
        public void fechar() throws IOException {
            reader.close();
        }
    }
    
    // ✅ Usar (try-catch ao criar)
    public static void usar() {
        try {
            MinhaClasse obj = new MinhaClasse("arquivo.txt");
            obj.fechar();
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    // ✅ Ou propagar
    public static void propagar() throws IOException {
        MinhaClasse obj = new MinhaClasse("arquivo.txt");
        obj.fechar();
    }
}
```

**Construtor**: pode declarar **throws**.

### 7. Interface e Implementação

```java
// ✅ throws em interface vs implementação
public class InterfaceImplementacao {
    
    // ✅ Interface declara throws
    interface MinhaInterface {
        void metodo() throws IOException;
        //            ↑
        //     Interface pode throws
    }
    
    // ✅ Implementação: mesma exceção
    static class Impl1 implements MinhaInterface {
        @Override
        public void metodo() throws IOException {
            // ✅ OK: mesma exceção
        }
    }
    
    // ✅ Implementação: subclasse
    static class Impl2 implements MinhaInterface {
        @Override
        public void metodo() throws FileNotFoundException {
            // ✅ OK: FileNotFoundException é subclasse
        }
    }
    
    // ✅ Implementação: sem throws
    static class Impl3 implements MinhaInterface {
        @Override
        public void metodo() {
            // ✅ OK: não declara throws
        }
    }
    
    // ❌ ERRO: superclasse
    // static class Impl4 implements MinhaInterface {
    //     @Override
    //     public void metodo() throws Exception {
    //         // ❌ ERRO: Exception é superclasse de IOException
    //     }
    // }
    
    /*
     * REGRA:
     * Implementação PODE:
     *   ✅ Mesma exceção
     *   ✅ Subclasse
     *   ✅ Não declarar
     * 
     * Implementação NÃO PODE:
     *   ❌ Superclasse
     *   ❌ Exceção não relacionada
     */
}
```

**Interface**: implementação pode ser **mais específica**, não **mais genérica**.

### 8. Sobrescrita de Métodos

```java
// ✅ throws em sobrescrita
public class SobrescritaMetodos {
    
    // ✅ Classe base
    static class Base {
        public void metodo() throws IOException {
            // Base declara IOException
        }
    }
    
    // ✅ Sobrescrever: mesma exceção
    static class Derivada1 extends Base {
        @Override
        public void metodo() throws IOException {
            // ✅ OK: mesma
        }
    }
    
    // ✅ Sobrescrever: subclasse
    static class Derivada2 extends Base {
        @Override
        public void metodo() throws FileNotFoundException {
            // ✅ OK: FileNotFoundException é subclasse
        }
    }
    
    // ✅ Sobrescrever: sem throws
    static class Derivada3 extends Base {
        @Override
        public void metodo() {
            // ✅ OK: não declara
        }
    }
    
    // ❌ ERRO: superclasse
    // static class Derivada4 extends Base {
    //     @Override
    //     public void metodo() throws Exception {
    //         // ❌ ERRO: Exception é superclasse
    //     }
    // }
    
    // ❌ ERRO: não relacionada
    // static class Derivada5 extends Base {
    //     @Override
    //     public void metodo() throws SQLException {
    //         // ❌ ERRO: SQLException não relacionada
    //     }
    // }
}
```

**Sobrescrita**: pode ser **mais específica**, não **mais genérica**.

### 9. Lambda e throws

```java
// ✅ throws em lambda e functional interface
public class LambdaThrows {
    
    // ✅ Functional interface sem throws
    @FunctionalInterface
    interface Operacao {
        void executar();
    }
    
    // ✅ Functional interface com throws
    @FunctionalInterface
    interface OperacaoComExcecao {
        void executar() throws IOException;
        //               ↑
        //         Interface pode throws
    }
    
    // ✅ Lambda sem exceção
    public static void semExcecao() {
        Operacao op = () -> {
            System.out.println("Executando");
        };
        op.executar();
    }
    
    // ✅ Lambda com exceção (interface permite)
    public static void comExcecao() throws IOException {
        OperacaoComExcecao op = () -> {
            throw new IOException("Erro");
        };
        op.executar();  // Pode lançar IOException
    }
    
    // ❌ Lambda lançando checked sem interface permitir
    // public static void erro() {
    //     Operacao op = () -> {
    //         throw new IOException();  // ERRO: interface não permite
    //     };
    // }
}
```

**Lambda**: functional interface pode declarar **throws**.

### 10. Resumo Visual: Sintaxe throws

```java
/*
 * SINTAXE E USO DE throws
 * 
 * ESTRUTURA BÁSICA:
 * 
 * modificador tipo metodo(params) throws TipoExcecao1, TipoExcecao2 {
 *     ↑       ↑     ↑      ↑         ↑        ↑           ↑
 *     1       2     3      4         5        6           7
 * 
 * 1. Modificador (public, private, static, etc.)
 * 2. Tipo retorno (void, int, String, etc.)
 * 3. Nome método
 * 4. Parâmetros (entre parênteses)
 * 5. throws (palavra-chave)
 * 6. Exceção 1
 * 7. Exceção 2 (opcional)
 * 
 * 
 * LOCALIZAÇÃO:
 * 
 * public void metodo(String param)
 *                               ↑
 *                         throws IOException
 *                                           ↑
 *                                           {
 *     // corpo
 * }
 * 
 * APÓS parênteses (), ANTES chaves {}
 * 
 * 
 * UMA EXCEÇÃO:
 * 
 * public void metodo() throws IOException {
 *     // corpo
 * }
 * 
 * 
 * MÚLTIPLAS EXCEÇÕES:
 * 
 * public void metodo() throws IOException, SQLException {
 *     //                                 ↑
 *     //                              Vírgula
 * }
 * 
 * Quebra de linha (legibilidade):
 * 
 * public void metodo() 
 *         throws IOException,
 *                SQLException,
 *                ClassNotFoundException {
 *     // corpo
 * }
 * 
 * 
 * CHECKED vs UNCHECKED:
 * 
 * ┌──────────────────┬────────────┬──────────────┐
 * │                  │ Unchecked  │ Checked      │
 * ├──────────────────┼────────────┼──────────────┤
 * │ throws           │ OPCIONAL   │ OBRIGATÓRIO  │
 * │ Compilador       │ Não exige  │ Exige        │
 * │ Propósito        │ Documentar │ Declarar     │
 * └──────────────────┴────────────┴──────────────┘
 * 
 * 
 * HIERARQUIA:
 * 
 * throws IOException → cobre:
 *   - FileNotFoundException
 *   - EOFException
 *   - SocketException
 * 
 * throws FileNotFoundException → cobre:
 *   - APENAS FileNotFoundException
 * 
 * 
 * REDUNDÂNCIA:
 * 
 * ⚠️ REDUNDANTE:
 * throws IOException, FileNotFoundException
 *        ↑               ↑
 *        │               └─ Redundante (já coberta)
 *        └─ Já cobre FileNotFoundException
 * 
 * ✅ PREFERIR:
 * throws IOException  (se lançar várias)
 * 
 * OU
 * 
 * throws FileNotFoundException, EOFException  (específicas)
 * 
 * 
 * CONSTRUTOR:
 * 
 * public MinhaClasse(String param) throws IOException {
 *     // construtor pode throws
 * }
 * 
 * 
 * INTERFACE:
 * 
 * interface MinhaInterface {
 *     void metodo() throws IOException;
 * }
 * 
 * class Impl implements MinhaInterface {
 *     // PODE:
 *     void metodo() throws IOException { }       // ✅ Mesma
 *     void metodo() throws FileNotFoundException { }  // ✅ Subclasse
 *     void metodo() { }                          // ✅ Nenhuma
 *     
 *     // NÃO PODE:
 *     void metodo() throws Exception { }         // ❌ Superclasse
 * }
 * 
 * 
 * SOBRESCRITA:
 * 
 * class Base {
 *     void metodo() throws IOException { }
 * }
 * 
 * class Derivada extends Base {
 *     // ✅ OK:
 *     void metodo() throws IOException { }
 *     void metodo() throws FileNotFoundException { }
 *     void metodo() { }
 *     
 *     // ❌ ERRO:
 *     void metodo() throws Exception { }
 *     void metodo() throws SQLException { }
 * }
 * 
 * 
 * LAMBDA:
 * 
 * @FunctionalInterface
 * interface Operacao {
 *     void executar() throws IOException;
 * }
 * 
 * Operacao op = () -> {
 *     throw new IOException();  // ✅ OK (interface permite)
 * };
 */

public class ResumoSintaxeThrows {
    public static void main(String[] args) {
        System.out.println("=== SINTAXE throws ===");
        System.out.println("\n✅ Estrutura:");
        System.out.println("  tipo metodo(params) throws TipoExc");
        System.out.println("\n✅ Localização:");
        System.out.println("  APÓS parênteses, ANTES chaves");
        System.out.println("\n✅ Múltiplas:");
        System.out.println("  Separadas por VÍRGULA");
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
- **Declara** na assinatura
- **Após** parênteses, **antes** chaves
- **Vírgula** separa múltiplas

---

## Armadilhas

### 1. Posição Incorreta

```java
// ❌ Posição incorreta
// public throws IOException void metodo() { }  // ERRO
// public void metodo throws IOException () { }  // ERRO

// ✅ Posição correta
public void metodo() throws IOException { }
```

### 2. Falta de Vírgula

```java
// ❌ Sem vírgula
// public void metodo() throws IOException SQLException { }  // ERRO

// ✅ Com vírgula
public void metodo() throws IOException, SQLException { }
```

### 3. Redundância

```java
// ⚠️ Redundante
public void metodo() throws IOException, FileNotFoundException {
    // FileNotFoundException já coberta por IOException
}

// ✅ Não redundante
public void metodo() throws IOException {
}
```

---

## Boas Práticas

### 1. Declarar Específicas

```java
// ✅ Específicas
public void metodo() throws FileNotFoundException {
}

// ❌ Genérica demais
public void metodo() throws Exception {
}
```

### 2. Quebrar Linha (Múltiplas)

```java
// ✅ Quebra de linha (legível)
public void metodo() 
        throws IOException,
               SQLException,
               ClassNotFoundException {
}

// ❌ Uma linha (difícil ler)
public void metodo() throws IOException, SQLException, ClassNotFoundException {
}
```

### 3. Documentar com @throws

```java
// ✅ Documentar
/**
 * Lê arquivo.
 * @throws FileNotFoundException se arquivo não existe
 * @throws IOException se erro ao ler
 */
public void ler() throws FileNotFoundException, IOException {
}
```

---

## Resumo

**throws**: cláusula de **declaração** na assinatura.

**Sintaxe**:
```java
tipo metodo(params) throws TipoExcecao
```

**Estrutura**:
- **throws**: palavra-chave
- **TipoExcecao**: classe(s) de exceção
- **Vírgula**: separa múltiplas

**Localização**:
- **Após** parênteses `()`
- **Antes** chaves `{}`
- Na **assinatura** do método

**Múltiplas**:
- Separar por **vírgula**
- Quebrar **linha** (legibilidade)
- `throws Exc1, Exc2, Exc3`

**Checked vs Unchecked**:
- **Checked**: throws **obrigatório** (ou try-catch)
- **Unchecked**: throws **opcional** (documentação)

**Hierarquia**:
- Superclasse **cobre** subclasses
- `throws IOException` cobre FileNotFoundException
- **Redundância**: declarar superclasse + subclasse

**Construtor**:
- Construtor pode declarar **throws**
- Quem cria **trata** ou **propaga**

**Interface**:
- Interface pode declarar **throws**
- Implementação: mesma, subclasse, ou **nenhuma**
- **Não** pode: superclasse, não relacionada

**Sobrescrita**:
- **Pode**: mesma, subclasse, nenhuma
- **Não pode**: superclasse, não relacionada
- Método sobrescrito não pode ser **mais genérico**

**Lambda**:
- Functional interface pode declarar **throws**
- Lambda segue **interface**

**Regra de Ouro**: Usar throws para **declarar** exceções na assinatura. Localização: **após** parênteses, **antes** chaves. Múltiplas: separar por **vírgula**. Checked: throws **obrigatório**. Unchecked: throws **opcional**. Preferir exceções **específicas** (não genéricas). **Documentar** com @throws Javadoc. Sobrescrita não pode ser **mais genérica**.

