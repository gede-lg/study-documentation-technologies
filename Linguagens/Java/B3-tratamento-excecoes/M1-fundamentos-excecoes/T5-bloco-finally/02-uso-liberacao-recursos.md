# T5.02 - Uso para Liberação de Recursos

## Introdução

O **uso principal** do `finally` é **liberar recursos** (conexões, arquivos, streams).

```java
/*
 * LIBERAÇÃO DE RECURSOS COM FINALLY
 * 
 * RECURSOS que precisam ser liberados:
 *   - Conexões de banco (Connection)
 *   - Arquivos (FileReader, FileWriter)
 *   - Streams (InputStream, OutputStream)
 *   - Sockets (Socket, ServerSocket)
 *   - Recursos de rede
 * 
 * POR QUE FINALLY?
 *   - Garante fechamento SEMPRE
 *   - Com exceção ou sem
 *   - Com return ou não
 *   - Evita vazamento de recursos (resource leak)
 */

// ✅ Padrão para liberar recursos
Connection conn = null;
try {
    conn = abrirConexao();
    processar(conn);
} finally {
    if (conn != null) {
        conn.close();  // ✅ Garante fechamento
    }
}
```

**Liberação**: `finally` **garante** fechamento de recursos.

---

## Fundamentos

### 1. Problema: Vazamento de Recursos

```java
// ❌ SEM finally (vazamento de recursos)
public class ProblemaVazamento {
    
    // ❌ PROBLEMA: recurso não é fechado se exceção
    public static void semFinally() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            
            // Processamento
            int data = reader.read();
            processar(data);
            
            // ❌ PROBLEMA: se exceção, close() não executa
            reader.close();
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        }
        
        /*
         * PROBLEMA:
         *   - Se exceção em read() ou processar()
         *   - close() NÃO executa
         *   - Arquivo fica aberto (vazamento)
         *   - Sistema operacional tem limite de arquivos abertos
         */
    }
    
    private static void processar(int data) {
        // Pode lançar exceção
        if (data < 0) {
            throw new RuntimeException("Dados inválidos");
        }
    }
}
```

**Problema**: sem finally, recurso **não** fecha se exceção.

### 2. Solução: Finally Garante Fechamento

```java
// ✅ COM finally (garante fechamento)
public class SolucaoFinally {
    
    // ✅ SOLUÇÃO: finally garante close()
    public static void comFinally() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            
            // Processamento
            int data = reader.read();
            processar(data);
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
            
        } finally {
            // ✅ SEMPRE executa (com ou sem exceção)
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    System.err.println("Erro ao fechar: " + e.getMessage());
                }
            }
        }
        
        /*
         * SOLUÇÃO:
         *   - Finally SEMPRE executa
         *   - close() chamado com ou sem exceção
         *   - Recurso liberado corretamente
         *   - Sem vazamento
         */
    }
    
    private static void processar(int data) {
        if (data < 0) {
            throw new RuntimeException("Dados inválidos");
        }
    }
}
```

**Solução**: finally **garante** close() (sempre executa).

### 3. Liberação de Conexão de Banco

```java
// ✅ Liberação de conexão de banco
public class LiberacaoConexao {
    
    public static void consultarDados(int id) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            // 1. Abrir conexão
            conn = DriverManager.getConnection("jdbc:mysql://localhost/db", "user", "pass");
            
            // 2. Preparar consulta
            stmt = conn.prepareStatement("SELECT * FROM usuarios WHERE id = ?");
            stmt.setInt(1, id);
            
            // 3. Executar
            rs = stmt.executeQuery();
            
            // 4. Processar
            if (rs.next()) {
                String nome = rs.getString("nome");
                System.out.println("Nome: " + nome);
            }
            
        } catch (SQLException e) {
            System.err.println("Erro SQL: " + e.getMessage());
            
        } finally {
            // ✅ Fechar recursos (ordem inversa)
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                System.err.println("Erro ao fechar: " + e.getMessage());
            }
        }
        
        /*
         * ORDEM DE FECHAMENTO:
         *   1. ResultSet (mais interno)
         *   2. PreparedStatement
         *   3. Connection (mais externo)
         * 
         * Ordem INVERSA de abertura
         */
    }
}
```

**Banco**: fechar ResultSet → Statement → Connection (ordem **inversa**).

### 4. Liberação de Arquivo

```java
// ✅ Liberação de arquivo
public class LiberacaoArquivo {
    
    // ✅ Leitura de arquivo
    public static void lerArquivo(String caminho) {
        FileReader reader = null;
        BufferedReader buffered = null;
        
        try {
            reader = new FileReader(caminho);
            buffered = new BufferedReader(reader);
            
            String linha;
            while ((linha = buffered.readLine()) != null) {
                System.out.println(linha);
            }
            
        } catch (FileNotFoundException e) {
            System.err.println("Arquivo não encontrado: " + caminho);
            
        } catch (IOException e) {
            System.err.println("Erro ao ler: " + e.getMessage());
            
        } finally {
            // ✅ Fechar recursos
            try {
                if (buffered != null) buffered.close();
                // ✅ BufferedReader.close() já fecha FileReader
                // Não precisa fechar reader separadamente
            } catch (IOException e) {
                System.err.println("Erro ao fechar: " + e.getMessage());
            }
        }
    }
    
    // ✅ Escrita em arquivo
    public static void escreverArquivo(String caminho, String conteudo) {
        FileWriter writer = null;
        
        try {
            writer = new FileWriter(caminho);
            writer.write(conteudo);
            
        } catch (IOException e) {
            System.err.println("Erro ao escrever: " + e.getMessage());
            
        } finally {
            // ✅ Fechar arquivo
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    System.err.println("Erro ao fechar: " + e.getMessage());
                }
            }
        }
    }
}
```

**Arquivo**: fechar stream (BufferedReader já fecha FileReader).

### 5. Liberação de Socket

```java
// ✅ Liberação de socket
public class LiberacaoSocket {
    
    public static void conectarServidor(String host, int porta) {
        Socket socket = null;
        BufferedReader in = null;
        PrintWriter out = null;
        
        try {
            // 1. Conectar
            socket = new Socket(host, porta);
            
            // 2. Criar streams
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            out = new PrintWriter(socket.getOutputStream(), true);
            
            // 3. Comunicar
            out.println("HELLO");
            String resposta = in.readLine();
            System.out.println("Resposta: " + resposta);
            
        } catch (UnknownHostException e) {
            System.err.println("Host desconhecido: " + host);
            
        } catch (IOException e) {
            System.err.println("Erro de I/O: " + e.getMessage());
            
        } finally {
            // ✅ Fechar recursos (ordem inversa)
            try {
                if (out != null) out.close();
                if (in != null) in.close();
                if (socket != null) socket.close();
            } catch (IOException e) {
                System.err.println("Erro ao fechar: " + e.getMessage());
            }
        }
    }
}
```

**Socket**: fechar PrintWriter → BufferedReader → Socket.

### 6. Padrão Completo de Liberação

```java
// ✅ Padrão completo para liberação
public class PadraoLiberacao {
    
    public static void padraoCompleto() {
        // 1. Declarar fora do try (null)
        Recurso recurso = null;
        
        try {
            // 2. Adquirir recurso
            recurso = adquirirRecurso();
            
            // 3. Usar recurso
            usar(recurso);
            
        } catch (Exception e) {
            // 4. Tratar exceções
            System.err.println("Erro: " + e.getMessage());
            
        } finally {
            // 5. Liberar recurso
            if (recurso != null) {
                try {
                    recurso.liberar();
                } catch (Exception e) {
                    // 6. Tratar erro de liberação
                    System.err.println("Erro ao liberar: " + e.getMessage());
                }
            }
        }
        
        /*
         * PADRÃO:
         * 
         * 1. Declarar FORA do try (iniciar com null)
         * 2. Adquirir dentro do try
         * 3. Usar recurso
         * 4. Capturar exceções de uso
         * 5. Liberar em finally
         * 6. Capturar exceções de liberação (try-catch dentro do finally)
         * 7. Verificar se não é null antes de liberar
         */
    }
    
    private static Recurso adquirirRecurso() { return new Recurso(); }
    private static void usar(Recurso r) { }
    
    static class Recurso {
        void liberar() throws Exception { }
    }
}
```

**Padrão**: declarar fora → adquirir dentro → finally liberar.

### 7. Múltiplos Recursos

```java
// ✅ Liberação de múltiplos recursos
public class MultiploRecursos {
    
    public static void multiplosRecursos() {
        Recurso1 r1 = null;
        Recurso2 r2 = null;
        Recurso3 r3 = null;
        
        try {
            r1 = new Recurso1();
            r2 = new Recurso2();
            r3 = new Recurso3();
            
            // Usar recursos
            processar(r1, r2, r3);
            
        } catch (Exception e) {
            System.err.println("Erro: " + e.getMessage());
            
        } finally {
            // ✅ Fechar TODOS (ordem inversa)
            // ✅ Cada um com seu próprio try-catch
            
            if (r3 != null) {
                try {
                    r3.fechar();
                } catch (Exception e) {
                    System.err.println("Erro r3: " + e.getMessage());
                }
            }
            
            if (r2 != null) {
                try {
                    r2.fechar();
                } catch (Exception e) {
                    System.err.println("Erro r2: " + e.getMessage());
                }
            }
            
            if (r1 != null) {
                try {
                    r1.fechar();
                } catch (Exception e) {
                    System.err.println("Erro r1: " + e.getMessage());
                }
            }
        }
        
        /*
         * MÚLTIPLOS RECURSOS:
         * 
         * - Fechar em ordem INVERSA de abertura
         * - Cada recurso com seu próprio try-catch
         * - Se fechar r3 falha, ainda tenta r2 e r1
         * - Verificar null antes de fechar
         */
    }
    
    private static void processar(Recurso1 r1, Recurso2 r2, Recurso3 r3) { }
    
    static class Recurso1 { void fechar() throws Exception { } }
    static class Recurso2 { void fechar() throws Exception { } }
    static class Recurso3 { void fechar() throws Exception { } }
}
```

**Múltiplos**: fechar ordem **inversa**, cada um com try-catch **separado**.

### 8. Verificar Null Antes de Fechar

```java
// ✅ Verificar null antes de fechar
public class VerificarNull {
    
    // ✅ Sempre verificar null
    public static void verificarNull() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            // Usar reader
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
            
        } finally {
            // ✅ Verificar null antes de fechar
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    System.err.println("Erro ao fechar: " + e.getMessage());
                }
            }
        }
    }
    
    // ❌ SEM verificar null (erro se exceção antes de criar)
    public static void semVerificarNull() {
        FileReader reader = null;
        
        try {
            // ❌ Se exceção aqui, reader é null
            validarPermissoes();
            reader = new FileReader("arquivo.txt");
            
        } catch (Exception e) {
            System.err.println("Erro: " + e.getMessage());
            
        } finally {
            try {
                // ❌ NullPointerException se reader é null
                // reader.close();
                
                // ✅ SEMPRE verificar null
                if (reader != null) {
                    reader.close();
                }
            } catch (Exception e) {
                System.err.println("Erro ao fechar: " + e.getMessage());
            }
        }
    }
    
    private static void validarPermissoes() {
        throw new SecurityException("Sem permissão");
    }
}
```

**Null**: **sempre** verificar antes de fechar.

### 9. Try-Catch Dentro do Finally

```java
// ✅ Try-catch dentro do finally
public class TryCatchFinally {
    
    public static void exemplo() {
        Connection conn = null;
        
        try {
            conn = abrirConexao();
            executarQuery(conn);
            
        } catch (SQLException e) {
            System.err.println("Erro SQL: " + e.getMessage());
            
        } finally {
            if (conn != null) {
                // ✅ Try-catch DENTRO do finally
                try {
                    conn.close();
                } catch (SQLException e) {
                    // ✅ Exceção de close() não suprime exceção do try
                    System.err.println("Erro ao fechar: " + e.getMessage());
                }
            }
        }
        
        /*
         * POR QUE TRY-CATCH DENTRO DO FINALLY?
         * 
         * 1. close() pode lançar exceção
         * 2. Se não capturar, suprime exceção do try
         * 3. Perda de informação sobre erro original
         * 4. Try-catch dentro captura erro de close() separadamente
         */
    }
    
    private static Connection abrirConexao() throws SQLException { return null; }
    private static void executarQuery(Connection c) throws SQLException { }
    
    interface Connection {
        void close() throws SQLException;
    }
}
```

**Try-catch**: dentro do finally para capturar erro de **close()**.

### 10. Resumo Visual: Liberação de Recursos

```java
/*
 * LIBERAÇÃO DE RECURSOS COM FINALLY
 * 
 * PADRÃO COMPLETO:
 * 
 * ┌─────────────────────────────────────────┐
 * │ Recurso recurso = null;  ← Declarar fora│
 * │                                         │
 * │ try {                                   │
 * │     recurso = adquirir(); ← Adquirir    │
 * │     usar(recurso);        ← Usar        │
 * │                                         │
 * │ } catch (Exception e) {                 │
 * │     tratar(e);            ← Tratar uso  │
 * │                                         │
 * │ } finally {                             │
 * │     if (recurso != null) { ← Verificar  │
 * │         try {                           │
 * │             recurso.close(); ← Liberar  │
 * │         } catch (Exception e) {         │
 * │             tratar(e); ← Tratar close() │
 * │         }                               │
 * │     }                                   │
 * │ }                                       │
 * └─────────────────────────────────────────┘
 * 
 * MÚLTIPLOS RECURSOS:
 * 
 * Recurso1 r1 = null;
 * Recurso2 r2 = null;
 * 
 * try {
 *     r1 = new Recurso1();  ← Abrir r1
 *     r2 = new Recurso2();  ← Abrir r2
 *     processar(r1, r2);
 * 
 * } finally {
 *     // Fechar ordem INVERSA
 *     
 *     if (r2 != null) {     ← Fechar r2 (último aberto)
 *         try { r2.close(); }
 *         catch (Exception e) { }
 *     }
 *     
 *     if (r1 != null) {     ← Fechar r1 (primeiro aberto)
 *         try { r1.close(); }
 *         catch (Exception e) { }
 *     }
 * }
 * 
 * RECURSOS COMUNS:
 * 
 * 1. BANCO DE DADOS:
 *    ResultSet → PreparedStatement → Connection
 * 
 * 2. ARQUIVOS:
 *    BufferedReader → FileReader
 *    BufferedWriter → FileWriter
 * 
 * 3. STREAMS:
 *    BufferedInputStream → FileInputStream
 *    BufferedOutputStream → FileOutputStream
 * 
 * 4. SOCKETS:
 *    PrintWriter → BufferedReader → Socket
 * 
 * REGRAS:
 * 
 * ✅ SEMPRE:
 *    - Declarar fora do try (null)
 *    - Verificar null antes de fechar
 *    - Try-catch dentro do finally
 *    - Fechar ordem inversa de abertura
 *    - Cada recurso com seu try-catch
 * 
 * ❌ NUNCA:
 *    - Declarar dentro do try (escopo)
 *    - Fechar sem verificar null
 *    - Deixar close() lançar exceção sem capturar
 *    - Fechar um recurso que fecha outro
 */

public class ResumoLiberacaoRecursos {
    public static void main(String[] args) {
        System.out.println("=== LIBERAÇÃO DE RECURSOS ===");
        System.out.println("\n✅ Padrão:");
        System.out.println("  1. Declarar FORA (null)");
        System.out.println("  2. Adquirir DENTRO");
        System.out.println("  3. Finally LIBERAR");
        System.out.println("\n✅ Regras:");
        System.out.println("  - Verificar NULL");
        System.out.println("  - Try-catch DENTRO finally");
        System.out.println("  - Ordem INVERSA");
        System.out.println("\n🎯 USO: Evitar vazamento de recursos");
    }
}
```

---

## Aplicabilidade

**Liberação** garante:
- **Fechar** recursos sempre
- Evitar **vazamento** (resource leak)
- **Liberar** memória e handles
- **Cleanup** garantido

---

## Armadilhas

### 1. Não Verificar Null

```java
// ❌ Não verificar null
finally {
    recurso.close();  // ❌ NullPointerException se null
}

// ✅ Verificar null
finally {
    if (recurso != null) {
        recurso.close();
    }
}
```

### 2. Não Capturar Exceção de Close

```java
// ❌ Close pode lançar exceção
finally {
    recurso.close();  // ❌ Suprime exceção do try
}

// ✅ Capturar exceção de close
finally {
    try {
        recurso.close();
    } catch (Exception e) {
        logar(e);
    }
}
```

### 3. Declarar Dentro do Try

```java
// ❌ Declarar dentro do try
try {
    Recurso r = new Recurso();  // ❌ Escopo
} finally {
    // r.close();  // ❌ Não compila (escopo)
}

// ✅ Declarar fora
Recurso r = null;
try {
    r = new Recurso();
} finally {
    if (r != null) r.close();
}
```

---

## Boas Práticas

### 1. Sempre Verificar Null

```java
// ✅ Verificar null antes de fechar
finally {
    if (recurso != null) {
        try {
            recurso.close();
        } catch (Exception e) {
            logar(e);
        }
    }
}
```

### 2. Try-Catch Dentro do Finally

```java
// ✅ Capturar exceção de close
finally {
    if (recurso != null) {
        try {
            recurso.close();
        } catch (Exception e) {
            logar(e);  // ✅ Não suprime original
        }
    }
}
```

### 3. Fechar Ordem Inversa

```java
// ✅ Fechar ordem inversa de abertura
finally {
    if (r3 != null) try { r3.close(); } catch (Exception e) { }
    if (r2 != null) try { r2.close(); } catch (Exception e) { }
    if (r1 != null) try { r1.close(); } catch (Exception e) { }
}
```

---

## Resumo

**Liberação**: finally **garante** fechamento de recursos.

**Recursos comuns**:
- **Banco**: ResultSet → Statement → Connection
- **Arquivo**: BufferedReader → FileReader
- **Stream**: BufferedInputStream → FileInputStream
- **Socket**: PrintWriter → BufferedReader → Socket

**Padrão**:
1. **Declarar** fora do try (`null`)
2. **Adquirir** dentro do try
3. **Usar** recurso
4. **Liberar** em finally

**Regras**:
- **Verificar** null antes de fechar
- **Try-catch** dentro do finally
- **Ordem inversa** de abertura
- Cada recurso com **try-catch separado**

**Múltiplos recursos**:
- Fechar **ordem inversa**
- Try-catch **separado** cada um
- Se um falha, **continua** outros

**Por quê finally**:
- **Garante** execução sempre
- Evita **vazamento** de recursos
- **Libera** memória e handles
- **Cleanup** garantido

**Regra de Ouro**: Sempre liberar recursos em **finally**. **Verificar** null antes de fechar. Try-catch **dentro** do finally para capturar erro de close(). Fechar **ordem inversa** de abertura.

