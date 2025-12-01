# T9.05 - Causa Raiz (Root Cause)

## Introdução

**Causa raiz**: exceção **original** que iniciou a cadeia.

```java
/*
 * CAUSA RAIZ (ROOT CAUSE)
 * 
 * ENCADEAMENTO:
 * Exceção A (principal)
 *   ↓
 * Caused by: Exceção B (intermediária)
 *   ↓
 * Caused by: Exceção C (CAUSA RAIZ)
 * 
 * CAUSA RAIZ: exceção ORIGINAL (C)
 */

// ✅ Encadeamento de exceções
public class Exemplo {
    public static void main(String[] args) {
        try {
            nivel1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void nivel1() throws Exception {
        try {
            nivel2();
        } catch (IOException e) {
            throw new Exception("Erro nível 1", e);  // e = causa
        }
    }
    
    static void nivel2() throws IOException {
        throw new IOException("Erro nível 2 - CAUSA RAIZ");
    }
}

/*
 * STACK TRACE:
 * java.lang.Exception: Erro nível 1
 *     at Exemplo.nivel1(Exemplo.java:18)
 *     at Exemplo.main(Exemplo.java:6)
 * Caused by: java.io.IOException: Erro nível 2 - CAUSA RAIZ
 *     ↑                             ↑
 *     "Caused by"                   CAUSA RAIZ
 *     at Exemplo.nivel2(Exemplo.java:23)
 *     at Exemplo.nivel1(Exemplo.java:16)
 *     ... 1 more
 * 
 * CAUSA RAIZ: IOException "Erro nível 2"
 */
```

**Causa raiz**: exceção no **último** "Caused by".

---

## Fundamentos

### 1. getCause()

```java
// ✅ getCause() retorna causa raiz
public class GetCause {
    
    public static void main(String[] args) {
        try {
            nivel1();
        } catch (Exception e) {
            System.out.println("Exceção principal: " + e.getMessage());
            System.out.println("Causa: " + e.getCause().getMessage());
            
            // Navegar pela cadeia
            Throwable causa = e.getCause();
            while (causa != null) {
                System.out.println("  → " + causa.getMessage());
                causa = causa.getCause();
            }
        }
    }
    
    static void nivel1() throws Exception {
        try {
            nivel2();
        } catch (IOException e) {
            throw new Exception("Nível 1", e);
        }
    }
    
    static void nivel2() throws IOException {
        throw new IOException("Nível 2 - causa raiz");
    }
}

/*
 * SAÍDA:
 * Exceção principal: Nível 1
 * Causa: Nível 2 - causa raiz
 *   → Nível 2 - causa raiz
 * 
 * getCause():
 *   - Retorna causa (Throwable)
 *   - null se não há causa
 *   - Navegar cadeia: while (causa != null)
 */
```

**getCause()**: retorna exceção **causa** ou **null**.

### 2. Cadeia de Exceções

```java
// ✅ Cadeia de exceções (exception chaining)
public class CadeiaExcecoes {
    
    public static void main(String[] args) {
        try {
            camada1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void camada1() throws Exception {
        try {
            camada2();
        } catch (Exception e) {
            throw new Exception("Erro camada 1", e);  // Encadear
        }
    }
    
    static void camada2() throws Exception {
        try {
            camada3();
        } catch (Exception e) {
            throw new Exception("Erro camada 2", e);  // Encadear
        }
    }
    
    static void camada3() throws Exception {
        throw new IOException("Erro camada 3 - CAUSA RAIZ");
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.Exception: Erro camada 1
 *     at CadeiaExcecoes.camada1(CadeiaExcecoes.java:16)
 *     at CadeiaExcecoes.main(CadeiaExcecoes.java:6)
 * Caused by: java.lang.Exception: Erro camada 2
 *     at CadeiaExcecoes.camada2(CadeiaExcecoes.java:24)
 *     at CadeiaExcecoes.camada1(CadeiaExcecoes.java:14)
 *     ... 1 more
 * Caused by: java.io.IOException: Erro camada 3 - CAUSA RAIZ
 *     ↑
 *     CAUSA RAIZ (último "Caused by")
 *     at CadeiaExcecoes.camada3(CadeiaExcecoes.java:30)
 *     at CadeiaExcecoes.camada2(CadeiaExcecoes.java:22)
 *     ... 2 more
 * 
 * CADEIA:
 * Exception (camada 1)
 *   ↓ causa
 * Exception (camada 2)
 *   ↓ causa
 * IOException (camada 3) ← CAUSA RAIZ
 */
```

**Cadeia**: múltiplos **"Caused by"** até causa raiz.

### 3. Encontrar Causa Raiz

```java
// ✅ Método para encontrar causa raiz
public class EncontrarCausaRaiz {
    
    // ✅ Navegar até causa raiz
    public static Throwable getCausaRaiz(Throwable t) {
        Throwable causa = t;
        while (causa.getCause() != null) {
            causa = causa.getCause();
        }
        return causa;
    }
    
    public static void main(String[] args) {
        try {
            nivel1();
        } catch (Exception e) {
            // Exceção principal
            System.out.println("Principal: " + e.getMessage());
            
            // Causa raiz
            Throwable raiz = getCausaRaiz(e);
            System.out.println("Causa raiz: " + raiz.getMessage());
            System.out.println("Tipo: " + raiz.getClass().getName());
        }
    }
    
    static void nivel1() throws Exception {
        try {
            nivel2();
        } catch (Exception e) {
            throw new Exception("Nível 1", e);
        }
    }
    
    static void nivel2() throws Exception {
        try {
            nivel3();
        } catch (Exception e) {
            throw new Exception("Nível 2", e);
        }
    }
    
    static void nivel3() throws Exception {
        throw new SQLException("Erro SQL - causa raiz");
    }
}

/*
 * SAÍDA:
 * Principal: Nível 1
 * Causa raiz: Erro SQL - causa raiz
 * Tipo: java.sql.SQLException
 * 
 * getCausaRaiz():
 *   - Navega até causa == null
 *   - Retorna última causa (raiz)
 */
```

**Encontrar**: navegar `getCause()` até **null**.

### 4. "Caused by" no Stack Trace

```java
// ✅ "Caused by" indica encadeamento
public class CausedBy {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void processar() throws Exception {
        try {
            conectar();
        } catch (SQLException e) {
            throw new Exception("Erro ao processar dados", e);
        }
    }
    
    static void conectar() throws SQLException {
        throw new SQLException("Conexão recusada", "08001");
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.Exception: Erro ao processar dados
 *     ↑
 *     Exceção PRINCIPAL (wrapper)
 * 
 *     at CausedBy.processar(CausedBy.java:17)
 *     at CausedBy.main(CausedBy.java:6)
 * 
 * Caused by: java.sql.SQLException: Conexão recusada
 *     ↑
 *     CAUSA (exceção original)
 * 
 *     at CausedBy.conectar(CausedBy.java:22)
 *     at CausedBy.processar(CausedBy.java:15)
 *     ... 1 more
 * 
 * "Caused by": mostra exceção ORIGINAL
 * Principal: Exception (wrapper/contexto)
 * Causa: SQLException (raiz)
 */
```

**"Caused by"**: exceção **original** encadeada.

### 5. Múltiplos Níveis "Caused by"

```java
// ✅ Múltiplos níveis de encadeamento
public class MultiplosCausedBy {
    
    public static void main(String[] args) {
        try {
            app();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void app() throws Exception {
        try {
            service();
        } catch (Exception e) {
            throw new Exception("App layer", e);
        }
    }
    
    static void service() throws Exception {
        try {
            repository();
        } catch (Exception e) {
            throw new Exception("Service layer", e);
        }
    }
    
    static void repository() throws Exception {
        try {
            database();
        } catch (Exception e) {
            throw new Exception("Repository layer", e);
        }
    }
    
    static void database() throws Exception {
        throw new SQLException("DB connection failed");
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.Exception: App layer
 *     at MultiplosCausedBy.app(MultiplosCausedBy.java:15)
 *     at MultiplosCausedBy.main(MultiplosCausedBy.java:6)
 * 
 * Caused by: java.lang.Exception: Service layer
 *     at MultiplosCausedBy.service(MultiplosCausedBy.java:23)
 *     at MultiplosCausedBy.app(MultiplosCausedBy.java:13)
 *     ... 1 more
 * 
 * Caused by: java.lang.Exception: Repository layer
 *     at MultiplosCausedBy.repository(MultiplosCausedBy.java:31)
 *     at MultiplosCausedBy.service(MultiplosCausedBy.java:21)
 *     ... 2 more
 * 
 * Caused by: java.sql.SQLException: DB connection failed
 *     ↑
 *     CAUSA RAIZ (último "Caused by")
 * 
 *     at MultiplosCausedBy.database(MultiplosCausedBy.java:36)
 *     at MultiplosCausedBy.repository(MultiplosCausedBy.java:29)
 *     ... 3 more
 * 
 * LER DE CIMA PARA BAIXO:
 *   1. Exception (App layer)
 *   2. Caused by: Exception (Service layer)
 *   3. Caused by: Exception (Repository layer)
 *   4. Caused by: SQLException (DB) ← CAUSA RAIZ
 */
```

**Múltiplos**: último **"Caused by"** = causa raiz.

### 6. initCause()

```java
// ✅ initCause() para definir causa depois
public class InitCause {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void processar() throws Exception {
        Exception principal = new Exception("Erro principal");
        
        try {
            operacao();
        } catch (IOException e) {
            principal.initCause(e);  // Definir causa
            //        ↑
            //        Definir causa DEPOIS
        }
        
        throw principal;
    }
    
    static void operacao() throws IOException {
        throw new IOException("Erro I/O");
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.Exception: Erro principal
 *     at InitCause.processar(InitCause.java:13)
 *     at InitCause.main(InitCause.java:6)
 * Caused by: java.io.IOException: Erro I/O
 *     at InitCause.operacao(InitCause.java:26)
 *     at InitCause.processar(InitCause.java:16)
 *     ... 1 more
 * 
 * initCause():
 *   - Definir causa APÓS criar exceção
 *   - Apenas UMA vez (IllegalStateException se já definida)
 *   - Alternativa: construtor com causa
 */
```

**initCause()**: definir causa **após** criação.

### 7. Construtor com Causa

```java
// ✅ Construtores com causa (preferir)
public class ConstrutorComCausa {
    
    public static void main(String[] args) {
        try {
            metodo1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // ✅ Construtor com causa (RECOMENDADO)
    static void metodo1() throws Exception {
        try {
            operacao();
        } catch (IOException e) {
            throw new Exception("Erro no método 1", e);
            //                                      ↑
            //                                   Causa no construtor
        }
    }
    
    // ❌ initCause (menos usado)
    static void metodo2() throws Exception {
        Exception ex = new Exception("Erro no método 2");
        try {
            operacao();
        } catch (IOException e) {
            ex.initCause(e);  // Definir depois
        }
        throw ex;
    }
    
    static void operacao() throws IOException {
        throw new IOException("Erro I/O");
    }
}

/*
 * CONSTRUTOR COM CAUSA:
 * 
 * Exception(String mensagem, Throwable causa)
 *           ↑                ↑
 *           Mensagem         Causa raiz
 * 
 * PREFERIR:
 *   - throw new Exception("msg", causa)
 * 
 * EVITAR:
 *   - ex = new Exception("msg")
 *   - ex.initCause(causa)
 */
```

**Construtor**: **preferir** construtor com causa.

### 8. Causa Raiz vs Exceção Principal

```java
// ✅ Distinguir causa raiz vs exceção principal
public class CausaRaizVsPrincipal {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            // Exceção PRINCIPAL
            System.out.println("=== EXCEÇÃO PRINCIPAL ===");
            System.out.println("Tipo: " + e.getClass().getName());
            System.out.println("Mensagem: " + e.getMessage());
            
            // Causa RAIZ
            Throwable raiz = getCausaRaiz(e);
            System.out.println("\n=== CAUSA RAIZ ===");
            System.out.println("Tipo: " + raiz.getClass().getName());
            System.out.println("Mensagem: " + raiz.getMessage());
        }
    }
    
    static void processar() throws Exception {
        try {
            banco();
        } catch (SQLException e) {
            throw new Exception("Erro ao processar pedido", e);
            //                  ↑                          ↑
            //                  Mensagem contexto          Causa raiz
        }
    }
    
    static void banco() throws SQLException {
        throw new SQLException("Tabela não encontrada");
    }
    
    static Throwable getCausaRaiz(Throwable t) {
        while (t.getCause() != null) {
            t = t.getCause();
        }
        return t;
    }
}

/*
 * SAÍDA:
 * 
 * === EXCEÇÃO PRINCIPAL ===
 * Tipo: java.lang.Exception
 * Mensagem: Erro ao processar pedido
 * 
 * === CAUSA RAIZ ===
 * Tipo: java.sql.SQLException
 * Mensagem: Tabela não encontrada
 * 
 * PRINCIPAL:
 *   - Exception (wrapper)
 *   - Mensagem: contexto de negócio
 * 
 * RAIZ:
 *   - SQLException (original)
 *   - Mensagem: erro técnico
 */
```

**Principal**: **wrapper** (contexto). **Raiz**: **original** (técnico).

### 9. Quando Encadear

```java
// ✅ Quando encadear exceções
public class QuandoEncadear {
    
    // ✅ Encadear: adicionar contexto
    static void processar() throws Exception {
        try {
            conectar();
        } catch (SQLException e) {
            throw new Exception("Erro ao processar pedido #123", e);
            //                  ↑                              ↑
            //                  Contexto adicional             Causa raiz
        }
    }
    
    // ✅ Encadear: mudar tipo (checked → unchecked)
    static void salvar() {
        try {
            banco();
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao salvar", e);
            //        ↑                                  ↑
            //        Unchecked                         Checked (causa)
        }
    }
    
    // ❌ NÃO encadear: sem valor adicional
    static void exemplo1() throws SQLException {
        try {
            banco();
        } catch (SQLException e) {
            throw new SQLException("Erro SQL", e);
            //                                 ↑
            //    ❌ Não adiciona valor, apenas repete
        }
    }
    
    // ✅ Melhor: relançar diretamente
    static void exemplo2() throws SQLException {
        banco();  // Deixar subir
    }
    
    static void conectar() throws SQLException {
        throw new SQLException("Conexão falhou");
    }
    
    static void banco() throws SQLException {
        throw new SQLException("Erro SQL");
    }
}

/*
 * ENCADEAR QUANDO:
 * 
 * ✅ Adicionar CONTEXTO
 *    - Informações de negócio
 *    - ID, usuário, operação
 * 
 * ✅ Mudar TIPO
 *    - Checked → Unchecked
 *    - SQLException → RepositorioException
 * 
 * ✅ Simplificar INTERFACE
 *    - Múltiplas exceções → Uma
 * 
 * ❌ NÃO encadear se:
 *    - Sem valor adicional
 *    - Apenas repete informação
 */
```

**Encadear**: adicionar **contexto** ou mudar **tipo**.

### 10. Resumo Visual

```java
/*
 * CAUSA RAIZ (ROOT CAUSE)
 * 
 * ENCADEAMENTO DE EXCEÇÕES:
 * 
 * try {
 *     operacao();
 * } catch (IOException e) {
 *     throw new Exception("Mensagem contexto", e);
 *     //                                       ↑
 *     //                                    Causa raiz
 * }
 * 
 * 
 * STACK TRACE:
 * 
 * java.lang.Exception: Mensagem contexto
 *     ↑                ↑
 *     Exceção principal Contexto adicional
 * 
 *     at Classe.metodo(...)
 *     at Classe.main(...)
 * 
 * Caused by: java.io.IOException: Erro original
 *     ↑                           ↑
 *     "Caused by"                 CAUSA RAIZ
 * 
 *     at Classe.operacao(...)
 *     ... 1 more
 * 
 * 
 * CADEIA MÚLTIPLA:
 * 
 * Exception: App layer
 *   ↓ causa
 * Exception: Service layer
 *   ↓ causa
 * Exception: Repository layer
 *   ↓ causa
 * SQLException: DB error ← CAUSA RAIZ
 * 
 * Stack Trace:
 * Exception: App layer
 * Caused by: Exception: Service layer
 * Caused by: Exception: Repository layer
 * Caused by: SQLException: DB error ← ÚLTIMO "Caused by"
 * 
 * 
 * getCause():
 * 
 * Exception e = ...;
 * Throwable causa = e.getCause();  // Causa direta
 * 
 * while (causa != null) {
 *     System.out.println(causa);
 *     causa = causa.getCause();     // Próxima causa
 * }
 * 
 * 
 * ENCONTRAR CAUSA RAIZ:
 * 
 * Throwable getCausaRaiz(Throwable t) {
 *     while (t.getCause() != null) {
 *         t = t.getCause();
 *     }
 *     return t;  // Última causa (raiz)
 * }
 * 
 * 
 * CONSTRUTORES:
 * 
 * ✅ Construtor com causa (PREFERIR):
 * throw new Exception("mensagem", causa);
 *                                 ↑
 *                                 Causa no construtor
 * 
 * ❌ initCause (menos comum):
 * Exception e = new Exception("mensagem");
 * e.initCause(causa);
 * throw e;
 * 
 * 
 * QUANDO ENCADEAR:
 * 
 * ✅ Adicionar CONTEXTO:
 * catch (SQLException e) {
 *     throw new Exception("Erro ao salvar usuário #" + id, e);
 *     //                  ↑                                ↑
 *     //                  Contexto adicional               Causa raiz
 * }
 * 
 * ✅ Mudar TIPO:
 * catch (SQLException e) {
 *     throw new RuntimeException("Erro repositório", e);
 *     //        ↑                                     ↑
 *     //        Unchecked                             Checked
 * }
 * 
 * ❌ Sem VALOR:
 * catch (SQLException e) {
 *     throw new SQLException("Erro SQL", e);
 *     //    ❌ Não adiciona valor
 * }
 * 
 * 
 * PRINCIPAL vs RAIZ:
 * 
 * PRINCIPAL (wrapper):
 *   - Tipo: Exception
 *   - Mensagem: "Erro ao processar pedido"
 *   - Contexto: negócio, usuário, operação
 * 
 * RAIZ (original):
 *   - Tipo: SQLException
 *   - Mensagem: "Tabela não encontrada"
 *   - Técnico: erro baixo nível
 * 
 * 
 * "... N more":
 * 
 * Caused by: SQLException
 *     at Classe.banco(...)
 *     at Classe.repo(...)
 *     ... 2 more
 *     ↑
 *     2 frames comuns omitidos (já mostrados acima)
 */

public class ExemploCausaRaiz {
    
    public static void main(String[] args) {
        try {
            camada1();
        } catch (Exception e) {
            // Stack trace completo
            e.printStackTrace();
            
            System.out.println("\n=== ANÁLISE ===");
            
            // Exceção principal
            System.out.println("Principal: " + e.getMessage());
            
            // Navegar cadeia
            System.out.println("\nCadeia:");
            Throwable atual = e;
            int nivel = 0;
            while (atual != null) {
                System.out.println("  " + nivel + ". " + 
                    atual.getClass().getSimpleName() + ": " + 
                    atual.getMessage());
                atual = atual.getCause();
                nivel++;
            }
            
            // Causa raiz
            Throwable raiz = getCausaRaiz(e);
            System.out.println("\nCausa raiz: " + raiz.getMessage());
        }
    }
    
    static void camada1() throws Exception {
        try {
            camada2();
        } catch (Exception e) {
            throw new Exception("Erro camada 1", e);
        }
    }
    
    static void camada2() throws Exception {
        try {
            camada3();
        } catch (Exception e) {
            throw new Exception("Erro camada 2", e);
        }
    }
    
    static void camada3() throws Exception {
        throw new IOException("Erro camada 3 - RAIZ");
    }
    
    static Throwable getCausaRaiz(Throwable t) {
        while (t.getCause() != null) {
            t = t.getCause();
        }
        return t;
    }
}

/*
 * SAÍDA:
 * 
 * java.lang.Exception: Erro camada 1
 *     at ExemploCausaRaiz.camada1(...)
 *     at ExemploCausaRaiz.main(...)
 * Caused by: java.lang.Exception: Erro camada 2
 *     at ExemploCausaRaiz.camada2(...)
 *     at ExemploCausaRaiz.camada1(...)
 *     ... 1 more
 * Caused by: java.io.IOException: Erro camada 3 - RAIZ
 *     at ExemploCausaRaiz.camada3(...)
 *     at ExemploCausaRaiz.camada2(...)
 *     ... 2 more
 * 
 * === ANÁLISE ===
 * Principal: Erro camada 1
 * 
 * Cadeia:
 *   0. Exception: Erro camada 1
 *   1. Exception: Erro camada 2
 *   2. IOException: Erro camada 3 - RAIZ
 * 
 * Causa raiz: Erro camada 3 - RAIZ
 */
```

---

## Aplicabilidade

**Causa raiz**:
- Exceção **original** que iniciou cadeia
- **"Caused by"** no stack trace
- **getCause()** programaticamente

---

## Armadilhas

### 1. Ignorar Causa Raiz

```java
// ❌ Tratar apenas exceção principal
catch (Exception e) {
    log(e.getMessage());  // ❌ Perde causa raiz
}

// ✅ Logar com causa
catch (Exception e) {
    logger.log(Level.SEVERE, "Erro", e);  // ✅ Inclui causa
}
```

### 2. Encadear Sem Valor

```java
// ❌ Encadear sem adicionar contexto
catch (SQLException e) {
    throw new SQLException("Erro", e);  // ❌ Sem valor
}

// ✅ Relançar ou adicionar contexto
catch (SQLException e) {
    throw e;  // ✅ Ou adicionar contexto útil
}
```

---

## Boas Práticas

### 1. Construtor com Causa

```java
// ✅ Usar construtor (não initCause)
throw new Exception("mensagem", causa);
```

### 2. Navegar Cadeia

```java
// ✅ Navegar até raiz
while (t.getCause() != null) {
    t = t.getCause();
}
```

### 3. Logar com Causa

```java
// ✅ Logger inclui causa automaticamente
logger.log(Level.SEVERE, "Erro", e);
```

---

## Resumo

**Causa raiz**: exceção **original** que iniciou cadeia de erros.

**Encadeamento**:
```java
throw new Exception("Contexto", causa);
//                              ↑
//                           Causa raiz
```

**Stack trace**:
```
Exception: Mensagem principal
Caused by: IOException: Causa intermediária
Caused by: SQLException: CAUSA RAIZ ← Último "Caused by"
```

**getCause()**:
- Retorna causa direta (Throwable)
- `null` se não há causa
- Navegar cadeia: `while (causa != null)`

**Encontrar raiz**:
```java
Throwable getCausaRaiz(Throwable t) {
    while (t.getCause() != null) {
        t = t.getCause();
    }
    return t;  // Última causa
}
```

**Construtores**:
- **Preferir**: `Exception(String, Throwable)` → causa no construtor
- **Evitar**: `initCause()` → definir causa depois

**Quando encadear**:
- ✅ **Adicionar contexto**: ID, usuário, operação
- ✅ **Mudar tipo**: checked → unchecked, SQLException → CustomException
- ✅ **Simplificar interface**: múltiplas → uma
- ❌ **Sem valor**: apenas repetir mesma informação

**Principal vs Raiz**:
- **Principal**: wrapper, contexto negócio, mensagem usuário
- **Raiz**: original, erro técnico, mensagem desenvolvedor

**"Caused by"**:
- Mostra exceção **causa** no stack trace
- Múltiplos níveis: último "Caused by" = raiz
- "... N more": N frames comuns omitidos

**Logar**:
- Logger inclui causa **automaticamente**
- `logger.log(Level.SEVERE, "msg", e)` → captura cadeia completa

**Regra de Ouro**: Sempre **encadear** exceções usando construtor com causa (`new Exception("msg", causa)`). Último **"Caused by"** no stack trace indica causa raiz. Usar `getCause()` para navegar cadeia programaticamente. Encadear quando adiciona **contexto** ou muda **tipo**, não apenas para repetir informação. Logger captura causa raiz automaticamente.

