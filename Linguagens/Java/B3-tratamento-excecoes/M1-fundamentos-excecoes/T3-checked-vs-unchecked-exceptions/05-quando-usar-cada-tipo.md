# T3.05 - Quando Usar Cada Tipo

## Introdução

Escolher entre **checked** e **unchecked** depende da **natureza** da exceção.

```java
/*
 * QUANDO USAR?
 * 
 * CHECKED (Exception):
 *   ✅ Situações EXTERNAS
 *   ✅ Fora do CONTROLE
 *   ✅ ESPERADAS/PREVISÍVEIS
 *   Exemplos: arquivo, rede, banco
 * 
 * UNCHECKED (RuntimeException):
 *   ✅ Erros de PROGRAMAÇÃO
 *   ✅ Sob CONTROLE
 *   ✅ NÃO esperadas (bugs)
 *   Exemplos: null, divisão zero, índice inválido
 */

// ✅ CHECKED: situação externa (arquivo pode não existir)
public static void lerArquivo(String caminho) throws IOException {
    FileReader reader = new FileReader(caminho);  // IOException
    // Arquivo pode não existir, permissões, etc.
}

// ✅ UNCHECKED: erro programação (deveria validar)
public static void dividir(int a, int b) {
    if (b == 0) {
        throw new IllegalArgumentException("Divisor não pode ser zero");
    }
    int resultado = a / b;
}
```

**Checked** = situações **externas** (fora controle). **Unchecked** = erros **programação** (sob controle).

---

## Fundamentos

### 1. Checked: Situações Externas

```java
// ✅ QUANDO usar CHECKED
public class SituacoesExternas {
    
    /*
     * CARACTERÍSTICA: FORA DO CONTROLE
     * 
     * - Arquivo pode NÃO existir
     * - Rede pode estar FORA
     * - Banco pode estar INDISPONÍVEL
     * - Dados externos podem ser INVÁLIDOS
     * 
     * → Não pode GARANTIR sucesso
     * → Situação ESPERADA/PREVISÍVEL
     * → Chamador deve estar CIENTE
     */
    
    // ✅ IOException: arquivo pode não existir
    public static String lerArquivo(String caminho) throws IOException {
        try (FileReader reader = new FileReader(caminho);
             BufferedReader br = new BufferedReader(reader)) {
            
            return br.readLine();
        }
        // Arquivo pode:
        //   - Não existir
        //   - Sem permissão
        //   - Corrompido
        //   → Situação EXTERNA (fora controle)
    }
    
    // ✅ SQLException: banco pode estar offline
    public static List<Usuario> buscarUsuarios() throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:...");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM usuarios");
        
        // Banco pode:
        //   - Estar offline
        //   - Timeout
        //   - Erro SQL
        //   → Situação EXTERNA (fora controle)
        
        List<Usuario> usuarios = new ArrayList<>();
        while (rs.next()) {
            usuarios.add(new Usuario(rs.getString("nome")));
        }
        return usuarios;
    }
    
    // ✅ MalformedURLException: URL pode ser inválida
    public static void conectarURL(String urlString) 
            throws MalformedURLException, IOException {
        URL url = new URL(urlString);  // MalformedURLException
        URLConnection conn = url.openConnection();  // IOException
        
        // URL pode:
        //   - Ser inválida
        //   - Servidor offline
        //   - Timeout
        //   → Situação EXTERNA (fora controle)
    }
    
    // ✅ ParseException: data pode ser inválida
    public static Date parsearData(String dataStr) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        return sdf.parse(dataStr);  // ParseException
        
        // Data pode:
        //   - Formato inválido
        //   - Entrada usuário
        //   → Situação EXTERNA (entrada usuário)
    }
}

class Usuario {
    String nome;
    Usuario(String nome) { this.nome = nome; }
}
```

**Checked** = situações **externas** (arquivo, rede, banco, entrada usuário).

### 2. Unchecked: Erros de Programação

```java
// ✅ QUANDO usar UNCHECKED
public class ErrosProgramacao {
    
    /*
     * CARACTERÍSTICA: SOB CONTROLE
     * 
     * - Null: DEVERIA validar parâmetro
     * - Divisão zero: DEVERIA validar divisor
     * - Índice: DEVERIA validar limites
     * - Cast: DEVERIA usar instanceof
     * 
     * → Pode PREVENIR com validações
     * → Situação NÃO esperada (bug)
     * → Chamador NÃO precisa tratar (corrigir código)
     */
    
    // ✅ IllegalArgumentException: validação de parâmetros
    public static void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            // ✅ UNCHECKED: erro programação (chamador passou inválido)
            throw new IllegalArgumentException(
                "Idade inválida: " + idade + " (esperado: 0-150)"
            );
        }
    }
    
    // ✅ NullPointerException: validação null
    public static void processar(String texto) {
        if (texto == null) {
            // ✅ UNCHECKED: erro programação (chamador passou null)
            throw new IllegalArgumentException("Texto não pode ser null");
        }
        System.out.println(texto.toUpperCase());
    }
    
    // ✅ IllegalStateException: estado inválido
    public static class Conexao {
        private boolean aberta = false;
        
        public void conectar() {
            if (aberta) {
                // ✅ UNCHECKED: erro programação (chamar conectar duas vezes)
                throw new IllegalStateException("Conexão já está aberta");
            }
            aberta = true;
        }
        
        public void executar() {
            if (!aberta) {
                // ✅ UNCHECKED: erro programação (executar sem conectar)
                throw new IllegalStateException("Conexão não está aberta");
            }
            // executar...
        }
    }
    
    // ✅ UnsupportedOperationException: operação não suportada
    public static void metodoNaoImplementado() {
        // ✅ UNCHECKED: erro programação (chamar método não implementado)
        throw new UnsupportedOperationException("Não implementado ainda");
    }
}
```

**Unchecked** = erros **programação** (validação, estado, não implementado).

### 3. Critérios de Decisão

```java
// ✅ Como decidir?
public class CriteriosDecisao {
    
    /*
     * ┌────────────────────────────────────────┐
     * │ PERGUNTA 1: É situação EXTERNA?        │
     * └────────────────────────────────────────┘
     *            │
     *     ┌──────┴──────┐
     *     │             │
     *    SIM           NÃO
     *     │             │
     *     ▼             ▼
     * CHECKED       UNCHECKED
     * 
     * Exemplos EXTERNOS:
     *   - Arquivo não existe
     *   - Rede offline
     *   - Banco indisponível
     *   - Entrada usuário
     * 
     * ┌────────────────────────────────────────┐
     * │ PERGUNTA 2: Pode PREVENIR com código?  │
     * └────────────────────────────────────────┘
     *            │
     *     ┌──────┴──────┐
     *     │             │
     *    SIM           NÃO
     *     │             │
     *     ▼             ▼
     * UNCHECKED     CHECKED
     * 
     * Exemplos PREVENIR:
     *   - Null: validar if != null
     *   - Divisão zero: validar divisor
     *   - Índice: validar limites
     * 
     * ┌────────────────────────────────────────┐
     * │ PERGUNTA 3: Chamador DEVE estar ciente?│
     * └────────────────────────────────────────┘
     *            │
     *     ┌──────┴──────┐
     *     │             │
     *    SIM           NÃO
     *     │             │
     *     ▼             ▼
     * CHECKED       UNCHECKED
     * 
     * Exemplos DEVE estar ciente:
     *   - Arquivo pode falhar (tratar)
     *   - Rede pode falhar (retry)
     *   - Banco pode falhar (logar)
     */
    
    public static void demonstrar() {
        System.out.println("=== Critérios de Decisão ===");
        System.out.println("\nCHECKED:");
        System.out.println("  ✅ Situação EXTERNA (fora controle)");
        System.out.println("  ✅ NÃO pode prevenir com código");
        System.out.println("  ✅ Chamador DEVE estar ciente");
        
        System.out.println("\nUNCHECKED:");
        System.out.println("  ✅ Situação INTERNA (sob controle)");
        System.out.println("  ✅ PODE prevenir com código");
        System.out.println("  ✅ Chamador NÃO precisa estar ciente");
    }
}
```

**Decisão**: Externa + Não prevenir + Chamador ciente = **CHECKED**. Interna + Prevenir + Bug = **UNCHECKED**.

### 4. Casos de Uso: Checked

```java
// ✅ Exemplos de quando usar CHECKED
public class CasosDeUsoChecked {
    
    // ✅ CASO 1: Operações de I/O (arquivo, rede)
    public static void operacoesIO() throws IOException {
        // Arquivo
        FileReader reader = new FileReader("arquivo.txt");
        
        // Rede
        Socket socket = new Socket("localhost", 8080);
        
        // Stream
        OutputStream out = new FileOutputStream("saida.txt");
    }
    
    // ✅ CASO 2: Banco de dados
    public static void bancoDados() throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:...");
        PreparedStatement stmt = conn.prepareStatement("SELECT * FROM ...");
        ResultSet rs = stmt.executeQuery();
    }
    
    // ✅ CASO 3: Serialização
    public static void serializacao(Object obj, String arquivo) 
            throws IOException {
        try (ObjectOutputStream oos = 
                new ObjectOutputStream(new FileOutputStream(arquivo))) {
            oos.writeObject(obj);
        }
    }
    
    // ✅ CASO 4: Parsing (conversão dados externos)
    public static Date parsing(String dataStr) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        return sdf.parse(dataStr);
    }
    
    // ✅ CASO 5: Reflection (carregar classes dinamicamente)
    public static Object reflection(String nomeClasse) 
            throws ClassNotFoundException, 
                   InstantiationException, 
                   IllegalAccessException {
        Class<?> clazz = Class.forName(nomeClasse);
        return clazz.newInstance();
    }
    
    // ✅ CASO 6: Threading (operações podem ser interrompidas)
    public static void threading() throws InterruptedException {
        Thread.sleep(1000);
        Thread.currentThread().join();
    }
}
```

**Checked**: I/O, banco, serialização, parsing, reflection, threading.

### 5. Casos de Uso: Unchecked

```java
// ✅ Exemplos de quando usar UNCHECKED
public class CasosDeUsoUnchecked {
    
    // ✅ CASO 1: Validação de parâmetros
    public static void validacaoParametros(String nome, int idade) {
        if (nome == null || nome.isEmpty()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
    }
    
    // ✅ CASO 2: Validação de estado
    public static class Pedido {
        enum Status { ABERTO, FECHADO }
        private Status status = Status.ABERTO;
        
        public void adicionarItem(String item) {
            if (status == Status.FECHADO) {
                throw new IllegalStateException("Pedido já fechado");
            }
        }
        
        public void fechar() {
            if (status == Status.FECHADO) {
                throw new IllegalStateException("Pedido já fechado");
            }
            status = Status.FECHADO;
        }
    }
    
    // ✅ CASO 3: Operações não suportadas
    public static class ListaImutavel<T> {
        private final List<T> lista;
        
        public ListaImutavel(List<T> lista) {
            this.lista = new ArrayList<>(lista);
        }
        
        public void add(T item) {
            throw new UnsupportedOperationException("Lista imutável");
        }
    }
    
    // ✅ CASO 4: Pré-condições (asserções)
    public static void calcularMedia(int[] numeros) {
        if (numeros == null || numeros.length == 0) {
            throw new IllegalArgumentException("Array vazio");
        }
        
        int soma = 0;
        for (int n : numeros) {
            soma += n;
        }
        double media = (double) soma / numeros.length;
    }
    
    // ✅ CASO 5: Configuração inválida (desenvolvimento)
    public static void configuracao(String propriedade) {
        String valor = System.getProperty(propriedade);
        if (valor == null) {
            throw new IllegalStateException(
                "Propriedade não configurada: " + propriedade
            );
        }
    }
}
```

**Unchecked**: validação parâmetros, estado, operações não suportadas, pré-condições.

### 6. Conversão: Checked → Unchecked

```java
// ✅ Quando CONVERTER checked para unchecked
public class ConverterCheckedUnchecked {
    
    /*
     * QUANDO CONVERTER?
     * 
     * 1. Erro é FATAL (não pode recuperar)
     * 2. API simplificada (lambdas, streams)
     * 3. Configuração inicial (não deve falhar)
     */
    
    // ✅ CASO 1: Erro FATAL (configuração)
    public static Properties carregarConfig() {
        try {
            Properties props = new Properties();
            props.load(new FileInputStream("config.properties"));
            return props;
        } catch (IOException e) {
            // ✅ Erro fatal: sem config não pode iniciar
            throw new IllegalStateException(
                "Falha ao carregar configuração", e
            );
        }
    }
    
    // ✅ CASO 2: API simplificada (lambdas)
    public static void processarArquivos(List<String> caminhos) {
        caminhos.stream()
                .map(caminho -> {
                    try {
                        return Files.readString(Path.of(caminho));
                    } catch (IOException e) {
                        // ✅ Converter para unchecked (simplificar lambda)
                        throw new UncheckedIOException(e);
                    }
                })
                .forEach(System.out::println);
    }
    
    // ✅ CASO 3: Construtor (não pode throws checked facilmente)
    public static class Servico {
        private final Properties config;
        
        public Servico() {
            try {
                config = new Properties();
                config.load(new FileInputStream("config.properties"));
            } catch (IOException e) {
                // ✅ Converter para unchecked (construtor)
                throw new IllegalStateException(
                    "Falha ao inicializar serviço", e
                );
            }
        }
    }
}
```

**Converter** checked→unchecked: erro **fatal**, API **simplificada**, **configuração** inicial.

### 7. Conversão: Unchecked → Checked

```java
// ✅ Quando CONVERTER unchecked para checked (raro)
public class ConverterUncheckedChecked {
    
    /*
     * QUANDO CONVERTER (raro)?
     * 
     * 1. Input USUÁRIO (imprevisível)
     * 2. API pública (forçar tratamento)
     */
    
    // ✅ CASO 1: Input usuário (NumberFormatException → checked)
    public static class ConversaoException extends Exception {
        public ConversaoException(String msg, Throwable cause) {
            super(msg, cause);
        }
    }
    
    public static int converterNumero(String texto) throws ConversaoException {
        try {
            return Integer.parseInt(texto);  // NumberFormatException
        } catch (NumberFormatException e) {
            // ✅ Converter para checked (forçar chamador tratar)
            throw new ConversaoException(
                "Falha ao converter: " + texto, e
            );
        }
    }
    
    // ✅ CASO 2: API pública (forçar validação)
    public static void processarDados(Object[] dados) 
            throws DadosInvalidosException {
        if (dados == null || dados.length == 0) {
            // ✅ Converter IllegalArgument para checked (forçar tratamento)
            throw new DadosInvalidosException("Dados vazios");
        }
    }
    
    static class DadosInvalidosException extends Exception {
        public DadosInvalidosException(String msg) {
            super(msg);
        }
    }
}
```

**Converter** unchecked→checked: input **usuário**, API **pública** forçar tratamento.

### 8. Tabela Comparativa

```java
/*
 * COMPARAÇÃO: QUANDO USAR CADA TIPO
 * 
 * ┌────────────────────┬─────────────────────┬─────────────────────┐
 * │ CRITÉRIO           │ CHECKED             │ UNCHECKED           │
 * ├────────────────────┼─────────────────────┼─────────────────────┤
 * │ Natureza           │ Externa             │ Interna             │
 * │ Controle           │ Fora controle       │ Sob controle        │
 * │ Prevenir           │ Não pode            │ Pode (validações)   │
 * │ Esperada           │ Sim (previsível)    │ Não (bug)           │
 * │ Chamador           │ DEVE estar ciente   │ NÃO precisa         │
 * │ Tratamento         │ Obrigatório         │ Opcional            │
 * │ Compilador         │ Verifica            │ Não verifica        │
 * ├────────────────────┼─────────────────────┼─────────────────────┤
 * │ EXEMPLOS           │                     │                     │
 * ├────────────────────┼─────────────────────┼─────────────────────┤
 * │ I/O                │ IOException         │ -                   │
 * │ Banco              │ SQLException        │ -                   │
 * │ Parsing            │ ParseException      │ -                   │
 * │ Reflection         │ ClassNotFound       │ -                   │
 * │ Threading          │ InterruptedException│ -                   │
 * │ Null               │ -                   │ NullPointerException│
 * │ Validação          │ -                   │ IllegalArgument     │
 * │ Estado             │ -                   │ IllegalState        │
 * │ Não suportada      │ -                   │ Unsupported         │
 * │ Divisão zero       │ -                   │ ArithmeticException │
 * │ Índice             │ -                   │ IndexOutOfBounds    │
 * └────────────────────┴─────────────────────┴─────────────────────┘
 * 
 * QUANDO CONVERTER:
 * 
 * Checked → Unchecked:
 *   - Erro FATAL (não pode recuperar)
 *   - API simplificada (lambdas, streams)
 *   - Configuração inicial (deve existir)
 * 
 * Unchecked → Checked (raro):
 *   - Input USUÁRIO (forçar validação)
 *   - API pública (forçar tratamento)
 */
```

### 9. Fluxograma de Decisão

```java
/*
 * FLUXOGRAMA: ESCOLHER CHECKED vs UNCHECKED
 * 
 *                   ┌───────────────────┐
 *                   │ Situação externa? │
 *                   │ (arquivo, rede,   │
 *                   │  banco, usuário)  │
 *                   └─────────┬─────────┘
 *                             │
 *                  ┌──────────┴──────────┐
 *                 SIM                   NÃO
 *                  │                     │
 *                  ▼                     ▼
 *          ┌──────────────┐      ┌──────────────┐
 *          │   CHECKED    │      │ Pode prevenir│
 *          │   Exception  │      │ com código?  │
 *          └──────────────┘      └──────┬───────┘
 *                                       │
 *                            ┌──────────┴──────────┐
 *                           SIM                   NÃO
 *                            │                     │
 *                            ▼                     ▼
 *                    ┌──────────────┐      ┌──────────────┐
 *                    │  UNCHECKED   │      │   CHECKED    │
 *                    │RuntimeException│      │  Exception   │
 *                    └──────────────┘      └──────────────┘
 * 
 * EXEMPLOS:
 * 
 * 1. FileNotFoundException:
 *    - Externa? SIM (arquivo pode não existir)
 *    → CHECKED
 * 
 * 2. NullPointerException:
 *    - Externa? NÃO
 *    - Pode prevenir? SIM (validar null)
 *    → UNCHECKED
 * 
 * 3. SQLException:
 *    - Externa? SIM (banco pode estar offline)
 *    → CHECKED
 * 
 * 4. IllegalArgumentException:
 *    - Externa? NÃO
 *    - Pode prevenir? SIM (validar parâmetros)
 *    → UNCHECKED
 */
```

### 10. Resumo Visual

```java
public class ResumoQuandoUsar {
    public static void main(String[] args) {
        System.out.println("=== QUANDO USAR ===");
        
        System.out.println("\n✅ CHECKED:");
        System.out.println("  - Situações EXTERNAS (arquivo, rede, banco)");
        System.out.println("  - FORA do controle");
        System.out.println("  - NÃO pode prevenir");
        System.out.println("  - ESPERADA/PREVISÍVEL");
        System.out.println("  - Chamador DEVE estar ciente");
        System.out.println("  Exemplos: IOException, SQLException, ParseException");
        
        System.out.println("\n✅ UNCHECKED:");
        System.out.println("  - Erros de PROGRAMAÇÃO (bugs)");
        System.out.println("  - SOB controle");
        System.out.println("  - PODE prevenir (validações)");
        System.out.println("  - NÃO esperada (bug)");
        System.out.println("  - Chamador NÃO precisa tratar");
        System.out.println("  Exemplos: NullPointer, IllegalArgument, IllegalState");
    }
}
```

---

## Aplicabilidade

**Escolher** entre checked e unchecked:
- **Checked**: situações **externas**, **fora** controle
- **Unchecked**: erros **programação**, **sob** controle

---

## Armadilhas

### 1. Usar Unchecked para Situações Externas

```java
// ❌ Unchecked para I/O (deveria ser checked)
public String ler(String arquivo) {
    try {
        return Files.readString(Path.of(arquivo));
    } catch (IOException e) {
        throw new RuntimeException(e);  // ❌ Esconde checked
    }
}
```

### 2. Usar Checked para Bugs

```java
// ❌ Checked para validação (deveria ser unchecked)
public void setIdade(int idade) throws IdadeInvalidaException {
    if (idade < 0) {
        throw new IdadeInvalidaException();  // ❌ Deveria unchecked
    }
}
```

---

## Boas Práticas

### 1. Checked para Situações Externas

```java
// ✅ Checked para I/O
public String ler(String arquivo) throws IOException {
    return Files.readString(Path.of(arquivo));
}
```

### 2. Unchecked para Validações

```java
// ✅ Unchecked para validação
public void setIdade(int idade) {
    if (idade < 0) {
        throw new IllegalArgumentException("Idade negativa");
    }
}
```

### 3. Converter Quando Necessário

```java
// ✅ Converter checked→unchecked quando fatal
Properties props = new Properties();
try {
    props.load(new FileInputStream("config.properties"));
} catch (IOException e) {
    throw new IllegalStateException("Config obrigatória", e);
}
```

---

## Resumo

**Decisão** checked vs unchecked:

**CHECKED** (Exception):
- Situações **externas** (arquivo, rede, banco)
- **Fora** do controle
- **Não** pode prevenir
- **Esperada/previsível**
- Chamador **deve** estar ciente
- Exemplos: IOException, SQLException, ParseException

**UNCHECKED** (RuntimeException):
- Erros de **programação** (bugs)
- **Sob** controle
- **Pode** prevenir (validações)
- **Não** esperada (bug)
- Chamador **não** precisa tratar
- Exemplos: NullPointer, IllegalArgument, IllegalState

**Critérios**:
1. Externa? → **CHECKED**
2. Pode prevenir? → **UNCHECKED**
3. Chamador deve saber? → **CHECKED**

**Conversões**:
- Checked→Unchecked: erro **fatal**, API **simplificada**
- Unchecked→Checked: input **usuário** (raro)

**Regra de Ouro**: Externa + Não prevenir = **CHECKED**. Interna + Prevenir = **UNCHECKED**. Dúvida? Pergunta: "Chamador **pode** fazer algo útil?" → SIM = checked, NÃO = unchecked.
