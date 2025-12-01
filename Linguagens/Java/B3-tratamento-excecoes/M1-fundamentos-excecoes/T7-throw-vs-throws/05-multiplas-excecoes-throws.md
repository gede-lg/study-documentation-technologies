# T7.05 - Múltiplas Exceções em throws

## Introdução

**Múltiplas exceções** declaradas em throws separadas por **vírgula**.

```java
/*
 * MÚLTIPLAS EXCEÇÕES
 * 
 * SINTAXE:
 * void metodo() throws Excecao1, Excecao2, Excecao3 {
 *     // Pode lançar QUALQUER uma das três
 * }
 * 
 * CARACTERÍSTICAS:
 *   - Separadas por VÍRGULA
 *   - Qualquer ordem
 *   - Método pode lançar QUALQUER uma
 *   - Quem chama trata TODAS (ou propaga)
 */

// ✅ Múltiplas exceções
public void processar() throws IOException, SQLException {
    //                         ↑           ↑
    //                         │           └─ Segunda exceção
    //                         └─ Primeira exceção
    
    if (Math.random() > 0.5) {
        throw new IOException("Erro I/O");
    } else {
        throw new SQLException("Erro SQL");
    }
}
```

**Múltiplas**: separar por **vírgula** (método pode lançar qualquer).

---

## Fundamentos

### 1. Sintaxe Básica

```java
// ✅ Sintaxe de múltiplas exceções
public class SintaxeMultiplas {
    
    // ✅ Duas exceções
    public void duas() throws IOException, SQLException {
        // Pode lançar IOException OU SQLException
    }
    
    // ✅ Três exceções
    public void tres() 
            throws IOException, SQLException, ClassNotFoundException {
        // Pode lançar qualquer uma das três
    }
    
    // ✅ Quatro ou mais (quebra linha)
    public void multiplas() 
            throws IOException,
                   SQLException,
                   ClassNotFoundException,
                   InterruptedException {
        // Quebra de linha para legibilidade
    }
    
    // ✅ Vírgula separa
    public void virgula() throws IOException, SQLException {
        //                                  ↑
        //                               Vírgula
    }
    
    // ❌ ERRO: sem vírgula
    // public void erro() throws IOException SQLException {
    //     // ERRO: falta vírgula
    // }
    
    // ❌ ERRO: vírgula final
    // public void erro2() throws IOException, SQLException, {
    //     // ERRO: vírgula final (trailing comma não permitida)
    // }
}
```

**Sintaxe**: `throws Exc1, Exc2, Exc3` (vírgula separa).

### 2. Lançar Qualquer Exceção

```java
// ✅ Método pode lançar qualquer exceção declarada
public class LancarQualquer {
    
    // ✅ Declarar duas, lançar uma
    public void metodo1() throws IOException, SQLException {
        // Declarou duas, MAS pode lançar apenas uma
        throw new IOException("Erro I/O");
        // SQLException NÃO lançada (OK)
    }
    
    // ✅ Declarar duas, lançar outra
    public void metodo2() throws IOException, SQLException {
        if (Math.random() > 0.5) {
            throw new IOException("Erro I/O");
        } else {
            throw new SQLException("Erro SQL");
        }
        // Lança UMA das duas (condicionalmente)
    }
    
    // ✅ Declarar três, lançar todas
    public void metodo3(int opcao) 
            throws IOException, SQLException, ClassNotFoundException {
        
        if (opcao == 1) {
            throw new IOException("Erro I/O");
        } else if (opcao == 2) {
            throw new SQLException("Erro SQL");
        } else {
            throw new ClassNotFoundException("Classe não encontrada");
        }
        // Pode lançar qualquer uma das três
    }
    
    /*
     * REGRA:
     * throws Exc1, Exc2, Exc3
     * 
     * Método PODE lançar:
     *   - APENAS Exc1
     *   - APENAS Exc2
     *   - APENAS Exc3
     *   - NENHUMA (declarar sem lançar)
     *   - QUALQUER combinação
     */
}
```

**Lançar**: método pode lançar **qualquer** exceção declarada (não precisa todas).

### 3. Capturar Múltiplas

```java
// ✅ Quem chama precisa tratar TODAS
public class CapturarMultiplas {
    
    public void metodo() throws IOException, SQLException {
        if (Math.random() > 0.5) {
            throw new IOException("Erro I/O");
        } else {
            throw new SQLException("Erro SQL");
        }
    }
    
    // ✅ OPÇÃO 1: try-catch para cada
    public void opcao1() {
        try {
            metodo();
            
        } catch (IOException e) {
            System.err.println("Erro I/O: " + e.getMessage());
            
        } catch (SQLException e) {
            System.err.println("Erro SQL: " + e.getMessage());
        }
    }
    
    // ✅ OPÇÃO 2: multi-catch (Java 7+)
    public void opcao2() {
        try {
            metodo();
            
        } catch (IOException | SQLException e) {
            // ↑ Captura AMBAS em um catch
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    // ✅ OPÇÃO 3: capturar superclasse
    public void opcao3() {
        try {
            metodo();
            
        } catch (Exception e) {
            // ↑ Exception cobre AMBAS
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    // ✅ OPÇÃO 4: propagar (throws)
    public void opcao4() throws IOException, SQLException {
        metodo();  // Propaga ambas exceções
    }
    
    // ✅ OPÇÃO 5: híbrido (capturar uma, propagar outra)
    public void opcao5() throws SQLException {
        try {
            metodo();
            
        } catch (IOException e) {
            // CAPTURA IOException
            System.err.println("Erro I/O: " + e.getMessage());
        }
        // SQLException NÃO capturada - PROPAGA
    }
}
```

**Capturar**: quem chama trata **todas** (ou propaga).

### 4. Ordem das Exceções

```java
// ✅ Ordem das exceções em throws
public class OrdemExcecoes {
    
    // ✅ Ordem não importa (throws)
    public void ordem1() throws IOException, SQLException {
        // IOException primeiro
    }
    
    public void ordem2() throws SQLException, IOException {
        // SQLException primeiro (mesmo efeito)
    }
    
    /*
     * THROWS: ordem NÃO importa
     * 
     * Diferente de CATCH: ordem importa
     */
    
    // ✅ Catch: ordem IMPORTA
    public void ordemCatch() {
        try {
            // código
            
        } catch (FileNotFoundException e) {
            // ✅ Mais específica PRIMEIRO
            
        } catch (IOException e) {
            // ✅ Mais genérica DEPOIS
        }
    }
    
    // ❌ ERRO: catch genérica antes
    // public void erroOrdemCatch() {
    //     try {
    //         // código
    //     } catch (IOException e) {
    //         // Genérica primeiro
    //     } catch (FileNotFoundException e) {
    //         // ❌ ERRO: unreachable (já capturada)
    //     }
    // }
    
    /*
     * RESUMO:
     * 
     * throws: ordem NÃO importa
     * catch: ordem IMPORTA (específica → genérica)
     */
}
```

**Ordem**: throws não importa, catch **importa** (específica primeiro).

### 5. Hierarquia e Redundância

```java
// ✅ Hierarquia em múltiplas exceções
public class HierarquiaMultiplas {
    
    // ⚠️ REDUNDANTE: superclasse + subclasse
    public void redundante() 
            throws IOException, FileNotFoundException {
        //            ↑               ↑
        //            │               └─ Redundante (já coberta)
        //            └─ Já cobre FileNotFoundException
        
        // Compila, mas FileNotFoundException redundante
    }
    
    // ✅ Preferir: apenas superclasse
    public void superclasse() throws IOException {
        // Cobre FileNotFoundException, EOFException, etc.
        throw new FileNotFoundException();  // ✅ OK
    }
    
    // ✅ OU: apenas subclasses específicas
    public void subclasses() 
            throws FileNotFoundException, EOFException {
        // Declara ESPECÍFICAS (mais informativo)
        if (Math.random() > 0.5) {
            throw new FileNotFoundException();
        } else {
            throw new EOFException();
        }
    }
    
    // ✅ Múltiplas não relacionadas
    public void naoRelacionadas() 
            throws IOException, SQLException {
        // Exceções NÃO relacionadas (hierarquia diferente)
        // Não redundante
    }
    
    /*
     * HIERARQUIA:
     * 
     * Exception
     *   ├─ IOException
     *   │    ├─ FileNotFoundException
     *   │    └─ EOFException
     *   └─ SQLException
     * 
     * throws IOException, FileNotFoundException
     *   ⚠️ REDUNDANTE (IOException cobre FileNotFoundException)
     * 
     * throws IOException, SQLException
     *   ✅ NÃO REDUNDANTE (não relacionadas)
     */
}
```

**Hierarquia**: evitar **redundância** (superclasse + subclasse).

### 6. Propagação de Múltiplas

```java
// ✅ Propagar múltiplas exceções
public class PropagacaoMultiplas {
    
    // ✅ Método A: declara duas
    public void metodoA() throws IOException, SQLException {
        if (Math.random() > 0.5) {
            throw new IOException("Erro I/O");
        } else {
            throw new SQLException("Erro SQL");
        }
    }
    
    // ✅ Método B: propaga ambas
    public void metodoB() throws IOException, SQLException {
        metodoA();  // Propaga AMBAS exceções
    }
    
    // ✅ Método C: propaga ambas
    public void metodoC() throws IOException, SQLException {
        metodoB();  // Propaga AMBAS exceções
    }
    
    // ✅ Main: trata ambas
    public static void main(String[] args) {
        PropagacaoMultiplas obj = new PropagacaoMultiplas();
        
        try {
            obj.metodoC();
            
        } catch (IOException e) {
            System.err.println("Erro I/O: " + e.getMessage());
            
        } catch (SQLException e) {
            System.err.println("Erro SQL: " + e.getMessage());
        }
    }
    
    /*
     * CADEIA DE PROPAGAÇÃO:
     * 
     * metodoA() throws IOException, SQLException
     *    ↓ (propaga ambas)
     * metodoB() throws IOException, SQLException
     *    ↓ (propaga ambas)
     * metodoC() throws IOException, SQLException
     *    ↓ (propaga ambas)
     * main() try-catch (trata ambas)
     */
}
```

**Propagar**: declarar **todas** exceções propagadas.

### 7. Checked e Unchecked Juntas

```java
// ✅ Misturar checked e unchecked
public class CheckedUncheckedJuntas {
    
    // ✅ Checked + Unchecked
    public void misturadas() 
            throws IOException, IllegalArgumentException {
        //            ↑                    ↑
        //         Checked             Unchecked
        
        if (Math.random() > 0.5) {
            throw new IOException("Checked");
        } else {
            throw new IllegalArgumentException("Unchecked");
        }
    }
    
    // ⚠️ Unchecked em throws (opcional - documentação)
    public void uncheckedOpcional() 
            throws IOException, NullPointerException {
        //            ↑                 ↑
        //         Checked       Unchecked (opcional)
        
        // Unchecked em throws serve como DOCUMENTAÇÃO
    }
    
    // ✅ Apenas unchecked (todas opcionais)
    public void apenasUnchecked() 
            throws IllegalArgumentException, IllegalStateException {
        // TODAS unchecked - throws OPCIONAL (documentação)
    }
    
    /*
     * REGRA:
     * 
     * CHECKED em throws: OBRIGATÓRIO
     * UNCHECKED em throws: OPCIONAL (documentação)
     * 
     * Misturar: OK (checked obrigatória, unchecked opcional)
     */
}
```

**Misturar**: checked **obrigatória**, unchecked **opcional**.

### 8. Quebra de Linha

```java
// ✅ Formatação de múltiplas exceções
public class FormatacaoMultiplas {
    
    // ✅ Duas exceções: mesma linha
    public void duasMesmaLinha() throws IOException, SQLException {
        // Duas: OK mesma linha
    }
    
    // ✅ Três ou mais: quebrar linha
    public void tresQuebrarLinha() 
            throws IOException,
                   SQLException,
                   ClassNotFoundException {
        // Três ou mais: quebrar linha (legibilidade)
    }
    
    // ✅ Alinhamento
    public void alinhamento() 
            throws IOException,           // I/O
                   SQLException,          // Banco
                   ClassNotFoundException,// Classe
                   InterruptedException { // Thread
        // Alinhamento + comentários
    }
    
    // ✅ Indentação
    public void indentacao() 
            throws IOException,
                   SQLException {
        // Indentação consistente
    }
    
    /*
     * BOAS PRÁTICAS:
     * 
     * 2 exceções: mesma linha OK
     * 3+ exceções: quebrar linha (legibilidade)
     * Alinhar verticalmente
     * Comentários opcionais
     * Indentação consistente
     */
}
```

**Formatação**: 3+ exceções quebrar **linha** (legibilidade).

### 9. Sobrescrita com Múltiplas

```java
// ✅ Sobrescrita com múltiplas exceções
public class SobrescritaMultiplas {
    
    // ✅ Classe base
    static class Base {
        public void metodo() throws IOException, SQLException {
            // Base declara DUAS exceções
        }
    }
    
    // ✅ Sobrescrever: mesmas exceções
    static class Derivada1 extends Base {
        @Override
        public void metodo() throws IOException, SQLException {
            // ✅ OK: mesmas
        }
    }
    
    // ✅ Sobrescrever: subconjunto
    static class Derivada2 extends Base {
        @Override
        public void metodo() throws IOException {
            // ✅ OK: APENAS IOException (subconjunto)
        }
    }
    
    // ✅ Sobrescrever: nenhuma
    static class Derivada3 extends Base {
        @Override
        public void metodo() {
            // ✅ OK: nenhuma exceção
        }
    }
    
    // ✅ Sobrescrever: subclasses
    static class Derivada4 extends Base {
        @Override
        public void metodo() 
                throws FileNotFoundException, SQLDataException {
            // ✅ OK: FileNotFoundException ⊂ IOException
            //       SQLDataException ⊂ SQLException
        }
    }
    
    // ❌ ERRO: adicionar exceção não relacionada
    // static class Derivada5 extends Base {
    //     @Override
    //     public void metodo() 
    //             throws IOException, SQLException, ClassNotFoundException {
    //         // ❌ ERRO: ClassNotFoundException não declarada em Base
    //     }
    // }
    
    /*
     * REGRA SOBRESCRITA:
     * 
     * PODE:
     *   ✅ Mesmas exceções
     *   ✅ Subconjunto (menos exceções)
     *   ✅ Subclasses
     *   ✅ Nenhuma
     * 
     * NÃO PODE:
     *   ❌ Adicionar exceção não declarada em Base
     *   ❌ Superclasse de exceção Base
     */
}
```

**Sobrescrita**: pode ter **subconjunto** (menos exceções), não **adicionar** novas.

### 10. Resumo Visual: Múltiplas Exceções

```java
/*
 * MÚLTIPLAS EXCEÇÕES EM throws
 * 
 * SINTAXE:
 * 
 * void metodo() throws Excecao1, Excecao2, Excecao3
 *                              ↑        ↑        ↑
 *                              └────────┴────────┘
 *                                   Vírgula separa
 * 
 * 
 * DUAS EXCEÇÕES:
 * 
 * public void metodo() throws IOException, SQLException {
 *     // Pode lançar IOException OU SQLException
 * }
 * 
 * 
 * TRÊS OU MAIS (quebra linha):
 * 
 * public void metodo() 
 *         throws IOException,
 *                SQLException,
 *                ClassNotFoundException {
 *     // Quebra de linha para legibilidade
 * }
 * 
 * 
 * LANÇAR QUALQUER:
 * 
 * throws Exc1, Exc2, Exc3
 * 
 * Método PODE lançar:
 *   - Apenas Exc1
 *   - Apenas Exc2
 *   - Apenas Exc3
 *   - Nenhuma
 *   - Qualquer combinação
 * 
 * 
 * CAPTURAR:
 * 
 * throws IOException, SQLException
 * 
 * Quem chama:
 * 
 * // Opção 1: catch separados
 * try {
 *     metodo();
 * } catch (IOException e) { }
 *   catch (SQLException e) { }
 * 
 * // Opção 2: multi-catch
 * try {
 *     metodo();
 * } catch (IOException | SQLException e) { }
 * 
 * // Opção 3: superclasse
 * try {
 *     metodo();
 * } catch (Exception e) { }
 * 
 * // Opção 4: propagar
 * void chamar() throws IOException, SQLException {
 *     metodo();
 * }
 * 
 * 
 * ORDEM:
 * 
 * throws: ordem NÃO importa
 * 
 * throws IOException, SQLException
 * throws SQLException, IOException  // Mesmo efeito
 * 
 * catch: ordem IMPORTA
 * 
 * catch (FileNotFoundException e) { }  // Específica PRIMEIRO
 * catch (IOException e) { }            // Genérica DEPOIS
 * 
 * 
 * HIERARQUIA:
 * 
 * ⚠️ REDUNDANTE:
 * throws IOException, FileNotFoundException
 *        ↑               ↑
 *        └─────────────┐ │
 *                      │ │
 *        IOException já cobre FileNotFoundException
 * 
 * ✅ PREFERIR:
 * throws IOException  (apenas superclasse)
 * 
 * OU
 * 
 * throws FileNotFoundException, EOFException  (específicas)
 * 
 * 
 * PROPAGAÇÃO:
 * 
 * metodoA() throws Exc1, Exc2 { lança }
 *    ↓
 * metodoB() throws Exc1, Exc2 { propaga }
 *    ↓
 * metodoC() throws Exc1, Exc2 { propaga }
 *    ↓
 * main() try-catch { trata }
 * 
 * 
 * CHECKED + UNCHECKED:
 * 
 * throws IOException, IllegalArgumentException
 *        ↑                    ↑
 *     Checked             Unchecked
 *  (obrigatório)         (opcional)
 * 
 * 
 * SOBRESCRITA:
 * 
 * Base:     throws Exc1, Exc2
 * 
 * Derivada: ✅ throws Exc1, Exc2  (mesmas)
 *           ✅ throws Exc1        (subconjunto)
 *           ✅ throws             (nenhuma)
 *           ✅ throws SubExc1     (subclasse)
 *           ❌ throws Exc1, Exc2, Exc3  (adiciona)
 * 
 * 
 * FORMATAÇÃO:
 * 
 * 2 exceções: mesma linha OK
 * public void metodo() throws Exc1, Exc2 { }
 * 
 * 3+ exceções: quebrar linha
 * public void metodo() 
 *         throws Exc1,
 *                Exc2,
 *                Exc3 { }
 */

public class ResumoMultiplasExcecoes {
    public static void main(String[] args) {
        System.out.println("=== MÚLTIPLAS EXCEÇÕES ===");
        System.out.println("\n✅ Sintaxe:");
        System.out.println("  throws Exc1, Exc2, Exc3");
        System.out.println("\n✅ Separador:");
        System.out.println("  VÍRGULA");
        System.out.println("\n✅ Lançar:");
        System.out.println("  - Método pode lançar QUALQUER uma");
        System.out.println("  - Não precisa lançar TODAS");
        System.out.println("\n✅ Capturar:");
        System.out.println("  - Quem chama trata TODAS");
        System.out.println("  - OU propaga TODAS");
    }
}
```

---

## Aplicabilidade

**Múltiplas**:
- **Vírgula** separa exceções
- Método pode lançar **qualquer**
- Quem chama trata **todas**

---

## Armadilhas

### 1. Falta de Vírgula

```java
// ❌ Sem vírgula
// public void metodo() throws IOException SQLException { }  // ERRO

// ✅ Com vírgula
public void metodo() throws IOException, SQLException { }
```

### 2. Redundância (Hierarquia)

```java
// ⚠️ Redundante
public void metodo() throws IOException, FileNotFoundException {
    // FileNotFoundException já coberta por IOException
}

// ✅ Não redundante
public void metodo() throws IOException {
}
```

### 3. Esquecer de Capturar Todas

```java
// ❌ Capturar apenas uma
public void metodo() throws IOException, SQLException {
    // código
}

public void usar() {
    try {
        metodo();
    } catch (IOException e) {
        // ❌ SQLException não capturada - ERRO
    }
}

// ✅ Capturar ambas (ou propagar)
public void usar() {
    try {
        metodo();
    } catch (IOException | SQLException e) {
        // ✅ OK: ambas capturadas
    }
}
```

---

## Boas Práticas

### 1. Quebrar Linha (3+)

```java
// ✅ Quebrar linha para 3+ exceções
public void metodo() 
        throws IOException,
               SQLException,
               ClassNotFoundException {
}

// ❌ Mesma linha (difícil ler)
public void metodo() throws IOException, SQLException, ClassNotFoundException {
}
```

### 2. Evitar Redundância

```java
// ✅ Não redundante
public void metodo() throws IOException {
}

// ⚠️ Redundante
public void metodo() throws IOException, FileNotFoundException {
}
```

### 3. Documentar Cada Exceção

```java
// ✅ Documentar cada exceção
/**
 * Processa dados.
 * @throws IOException se erro I/O
 * @throws SQLException se erro banco
 * @throws ClassNotFoundException se classe não encontrada
 */
public void processar() 
        throws IOException, SQLException, ClassNotFoundException {
}
```

---

## Resumo

**Múltiplas exceções**: declarar **várias** exceções em throws.

**Sintaxe**:
```java
void metodo() throws Exc1, Exc2, Exc3
```

**Separador**:
- **Vírgula** separa exceções
- **Não** pode omitir vírgula
- **Não** pode vírgula final

**Lançar**:
- Método pode lançar **qualquer** exceção declarada
- **Não** precisa lançar todas
- Pode lançar **nenhuma** (declarar sem lançar)

**Capturar**:
- Quem chama **trata** todas (ou propaga)
- Opções: catch separados, multi-catch, superclasse, propagar

**Ordem**:
- throws: ordem **não** importa
- catch: ordem **importa** (específica primeiro)

**Hierarquia**:
- Evitar **redundância** (superclasse + subclasse)
- IOException **cobre** FileNotFoundException
- Preferir: superclasse **ou** subclasses específicas

**Propagação**:
- Declarar **todas** exceções propagadas
- Cadeia: A throws → B throws → C throws → trata

**Checked + Unchecked**:
- Checked: **obrigatório** em throws
- Unchecked: **opcional** (documentação)
- Misturar: **OK**

**Sobrescrita**:
- **Pode**: mesmas, subconjunto, nenhuma, subclasses
- **Não pode**: adicionar exceção não declarada em base

**Formatação**:
- **2** exceções: mesma linha OK
- **3+** exceções: quebrar linha (legibilidade)
- Indentação **consistente**
- Alinhamento **vertical**

**Regra de Ouro**: Usar vírgula para separar **múltiplas** exceções. Método pode lançar **qualquer** uma (não precisa todas). Quem chama **trata** todas (ou propaga). Quebrar **linha** para 3+ exceções. Evitar **redundância** (superclasse + subclasse). Ordem em throws **não importa**. Documentar **cada** exceção com @throws Javadoc.

