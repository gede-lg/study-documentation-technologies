# T3.06 - Exemplos de Cada Categoria

## Introdução

Exemplos **práticos** de **checked** vs **unchecked** exceptions.

```java
/*
 * CATEGORIAS
 * 
 * CHECKED:
 *   - IOException: arquivo, rede, stream
 *   - SQLException: banco de dados
 *   - ClassNotFoundException: carregar classes
 *   - ParseException: parsing dados
 *   - InterruptedException: threads
 * 
 * UNCHECKED:
 *   - NullPointerException: objeto null
 *   - IllegalArgumentException: argumento inválido
 *   - IllegalStateException: estado inválido
 *   - ArithmeticException: divisão zero
 *   - IndexOutOfBoundsException: índice inválido
 */
```

---

## Categoria 1: Checked - IOException

```java
// ✅ IOException e subclasses (I/O)
public class ExemplosIOException {
    
    // FileNotFoundException: arquivo não existe
    public static String lerArquivo(String caminho) throws IOException {
        try (FileReader reader = new FileReader(caminho);  // FileNotFoundException
             BufferedReader br = new BufferedReader(reader)) {
            
            StringBuilder conteudo = new StringBuilder();
            String linha;
            while ((linha = br.readLine()) != null) {  // IOException
                conteudo.append(linha).append("\n");
            }
            return conteudo.toString();
        }
    }
    
    // FileNotFoundException: escrever arquivo
    public static void escreverArquivo(String caminho, String conteudo) 
            throws IOException {
        try (FileWriter writer = new FileWriter(caminho);  // IOException
             BufferedWriter bw = new BufferedWriter(writer)) {
            
            bw.write(conteudo);  // IOException
        }
    }
    
    // SocketException: comunicação rede
    public static String buscarURL(String urlString) throws IOException {
        URL url = new URL(urlString);  // MalformedURLException
        URLConnection conn = url.openConnection();  // IOException
        
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream()))) {  // IOException
            
            StringBuilder resposta = new StringBuilder();
            String linha;
            while ((linha = reader.readLine()) != null) {
                resposta.append(linha);
            }
            return resposta.toString();
        }
    }
    
    // EOFException: fim arquivo inesperado
    public static Object deserializar(String arquivo) throws IOException {
        try (ObjectInputStream ois = 
                new ObjectInputStream(new FileInputStream(arquivo))) {
            
            try {
                return ois.readObject();  // ClassNotFoundException também
            } catch (ClassNotFoundException e) {
                throw new IOException("Classe não encontrada", e);
            }
        }
    }
}
```

**IOException**: arquivo, rede, stream (situação **externa**).

---

## Categoria 2: Checked - SQLException

```java
// ✅ SQLException (banco de dados)
public class ExemplosSQLException {
    
    // Conectar banco
    public static Connection conectar() throws SQLException {
        String url = "jdbc:mysql://localhost:3306/teste";
        String user = "root";
        String password = "senha";
        
        return DriverManager.getConnection(url, user, password);  // SQLException
    }
    
    // Buscar usuários
    public static List<Usuario> buscarUsuarios() throws SQLException {
        String sql = "SELECT id, nome, email FROM usuarios";
        
        try (Connection conn = conectar();  // SQLException
             Statement stmt = conn.createStatement();  // SQLException
             ResultSet rs = stmt.executeQuery(sql)) {  // SQLException
            
            List<Usuario> usuarios = new ArrayList<>();
            while (rs.next()) {  // SQLException
                Usuario u = new Usuario();
                u.id = rs.getInt("id");
                u.nome = rs.getString("nome");
                u.email = rs.getString("email");
                usuarios.add(u);
            }
            return usuarios;
        }
    }
    
    // Inserir usuário
    public static void inserirUsuario(Usuario usuario) throws SQLException {
        String sql = "INSERT INTO usuarios (nome, email) VALUES (?, ?)";
        
        try (Connection conn = conectar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {  // SQLException
            
            stmt.setString(1, usuario.nome);  // SQLException
            stmt.setString(2, usuario.email);
            stmt.executeUpdate();  // SQLException
        }
    }
    
    // Transação
    public static void transferir(int deId, int paraId, double valor) 
            throws SQLException {
        Connection conn = conectar();
        
        try {
            conn.setAutoCommit(false);  // SQLException
            
            // Debitar
            String sqlDebito = "UPDATE contas SET saldo = saldo - ? WHERE id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sqlDebito)) {
                stmt.setDouble(1, valor);
                stmt.setInt(2, deId);
                stmt.executeUpdate();
            }
            
            // Creditar
            String sqlCredito = "UPDATE contas SET saldo = saldo + ? WHERE id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sqlCredito)) {
                stmt.setDouble(1, valor);
                stmt.setInt(2, paraId);
                stmt.executeUpdate();
            }
            
            conn.commit();  // SQLException
            
        } catch (SQLException e) {
            conn.rollback();  // SQLException
            throw e;
        } finally {
            conn.setAutoCommit(true);
            conn.close();
        }
    }
    
    static class Usuario {
        int id;
        String nome;
        String email;
    }
}
```

**SQLException**: banco de dados (situação **externa**).

---

## Categoria 3: Checked - ClassNotFoundException

```java
// ✅ ClassNotFoundException (reflection, carregar classes)
public class ExemplosClassNotFoundException {
    
    // Carregar classe dinamicamente
    public static Class<?> carregarClasse(String nomeClasse) 
            throws ClassNotFoundException {
        return Class.forName(nomeClasse);  // ClassNotFoundException
    }
    
    // Instanciar classe dinamicamente
    public static Object instanciar(String nomeClasse) 
            throws ClassNotFoundException, 
                   InstantiationException, 
                   IllegalAccessException {
        
        Class<?> clazz = Class.forName(nomeClasse);  // ClassNotFoundException
        return clazz.newInstance();  // InstantiationException, IllegalAccessException
    }
    
    // Carregar driver JDBC
    public static void carregarDriver() throws ClassNotFoundException {
        Class.forName("com.mysql.jdbc.Driver");  // ClassNotFoundException
    }
    
    // Plugin system
    public static Object carregarPlugin(String caminhoJar, String nomeClasse) 
            throws Exception {
        
        URL[] urls = { new File(caminhoJar).toURI().toURL() };
        URLClassLoader loader = new URLClassLoader(urls);
        
        Class<?> clazz = loader.loadClass(nomeClasse);  // ClassNotFoundException
        return clazz.getDeclaredConstructor().newInstance();
    }
}
```

**ClassNotFoundException**: carregar classes (situação **externa**).

---

## Categoria 4: Checked - ParseException

```java
// ✅ ParseException (parsing dados)
public class ExemplosParseException {
    
    // Parsear data
    public static Date parsearData(String dataStr) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        return sdf.parse(dataStr);  // ParseException
    }
    
    // Parsear data/hora
    public static Date parsearDataHora(String dataHoraStr) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        sdf.setLenient(false);  // Modo estrito
        return sdf.parse(dataHoraStr);  // ParseException
    }
    
    // Parsear múltiplos formatos
    public static Date parsearDataFlexivel(String dataStr) {
        String[] formatos = {
            "dd/MM/yyyy",
            "yyyy-MM-dd",
            "dd-MM-yyyy"
        };
        
        for (String formato : formatos) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat(formato);
                return sdf.parse(dataStr);
            } catch (ParseException e) {
                // Tentar próximo formato
            }
        }
        
        throw new IllegalArgumentException("Formato inválido: " + dataStr);
    }
    
    // Validar formato
    public static boolean validarFormatoData(String dataStr, String formato) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(formato);
            sdf.setLenient(false);
            sdf.parse(dataStr);
            return true;
        } catch (ParseException e) {
            return false;
        }
    }
}
```

**ParseException**: parsing dados (situação **externa** - entrada usuário).

---

## Categoria 5: Checked - InterruptedException

```java
// ✅ InterruptedException (threads)
public class ExemplosInterruptedException {
    
    // Sleep
    public static void aguardar(long millis) throws InterruptedException {
        Thread.sleep(millis);  // InterruptedException
    }
    
    // Join
    public static void aguardarThread(Thread thread) throws InterruptedException {
        thread.join();  // InterruptedException
    }
    
    // Wait/Notify
    public static class FilaMensagens {
        private final Queue<String> fila = new LinkedList<>();
        private final Object lock = new Object();
        
        public void adicionar(String mensagem) {
            synchronized (lock) {
                fila.add(mensagem);
                lock.notify();  // Notificar thread esperando
            }
        }
        
        public String remover() throws InterruptedException {
            synchronized (lock) {
                while (fila.isEmpty()) {
                    lock.wait();  // InterruptedException
                }
                return fila.poll();
            }
        }
    }
    
    // ExecutorService
    public static void processarComTimeout(Runnable tarefa, long timeout) 
            throws InterruptedException, TimeoutException {
        
        ExecutorService executor = Executors.newSingleThreadExecutor();
        
        try {
            Future<?> future = executor.submit(tarefa);
            future.get(timeout, TimeUnit.MILLISECONDS);  // InterruptedException
            
        } catch (ExecutionException e) {
            throw new RuntimeException("Erro na execução", e);
        } finally {
            executor.shutdown();
        }
    }
}
```

**InterruptedException**: threads (situação **externa** - interrupção).

---

## Categoria 6: Unchecked - NullPointerException

```java
// ✅ NullPointerException (objeto null)
public class ExemplosNullPointerException {
    
    // ❌ MAU: não validar (lança NPE)
    public static void mau(String texto) {
        System.out.println(texto.length());  // NPE se texto == null
    }
    
    // ✅ BOM: validar null (prevenir NPE)
    public static void bom(String texto) {
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser null");
        }
        System.out.println(texto.length());  // Seguro
    }
    
    // ✅ Objects.requireNonNull
    public static void comRequireNonNull(String texto) {
        Objects.requireNonNull(texto, "Texto não pode ser null");
        System.out.println(texto.length());  // Seguro
    }
    
    // ✅ Optional (evitar null)
    public static Optional<String> buscarPorId(int id) {
        String resultado = buscarNoBanco(id);  // Pode retornar null
        return Optional.ofNullable(resultado);
    }
    
    public static void usarOptional() {
        buscarPorId(1)
            .map(String::toUpperCase)
            .ifPresent(System.out::println);
    }
    
    private static String buscarNoBanco(int id) {
        return id == 1 ? "texto" : null;
    }
}
```

**NullPointerException**: objeto null (erro **programação** - prevenir).

---

## Categoria 7: Unchecked - IllegalArgumentException

```java
// ✅ IllegalArgumentException (argumento inválido)
public class ExemplosIllegalArgumentException {
    
    // Validar idade
    public static void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException(
                "Idade inválida: " + idade + " (esperado: 0-150)"
            );
        }
    }
    
    // Validar email
    public static void setEmail(String email) {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email não pode ser vazio");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Email inválido: " + email);
        }
    }
    
    // Validar range
    public static void validarRange(int valor, int min, int max) {
        if (valor < min || valor > max) {
            throw new IllegalArgumentException(
                String.format("Valor %d fora do range [%d, %d]", valor, min, max)
            );
        }
    }
    
    // Validar não null
    public static void validarNaoNull(Object obj, String nome) {
        if (obj == null) {
            throw new IllegalArgumentException(nome + " não pode ser null");
        }
    }
    
    // Validar coleção não vazia
    public static void validarNaoVazia(Collection<?> colecao, String nome) {
        if (colecao == null || colecao.isEmpty()) {
            throw new IllegalArgumentException(nome + " não pode ser vazia");
        }
    }
}
```

**IllegalArgumentException**: argumento inválido (erro **programação** - validar).

---

## Categoria 8: Unchecked - IllegalStateException

```java
// ✅ IllegalStateException (estado inválido)
public class ExemplosIllegalStateException {
    
    // Conexão
    public static class Conexao {
        enum Estado { FECHADA, ABERTA }
        private Estado estado = Estado.FECHADA;
        
        public void abrir() {
            if (estado == Estado.ABERTA) {
                throw new IllegalStateException("Conexão já está aberta");
            }
            estado = Estado.ABERTA;
        }
        
        public void executar(String sql) {
            if (estado == Estado.FECHADA) {
                throw new IllegalStateException("Conexão não está aberta");
            }
            // executar SQL
        }
        
        public void fechar() {
            if (estado == Estado.FECHADA) {
                throw new IllegalStateException("Conexão já está fechada");
            }
            estado = Estado.FECHADA;
        }
    }
    
    // Pedido
    public static class Pedido {
        enum Status { ABERTO, PROCESSANDO, FECHADO }
        private Status status = Status.ABERTO;
        private final List<String> itens = new ArrayList<>();
        
        public void adicionarItem(String item) {
            if (status != Status.ABERTO) {
                throw new IllegalStateException(
                    "Não pode adicionar item: pedido " + status
                );
            }
            itens.add(item);
        }
        
        public void processar() {
            if (status != Status.ABERTO) {
                throw new IllegalStateException(
                    "Não pode processar: pedido " + status
                );
            }
            if (itens.isEmpty()) {
                throw new IllegalStateException("Pedido vazio");
            }
            status = Status.PROCESSANDO;
        }
        
        public void fechar() {
            if (status != Status.PROCESSANDO) {
                throw new IllegalStateException(
                    "Não pode fechar: pedido " + status
                );
            }
            status = Status.FECHADO;
        }
    }
    
    // Iterator
    public static void exemploIterator() {
        List<Integer> lista = Arrays.asList(1, 2, 3);
        Iterator<Integer> it = lista.iterator();
        
        try {
            it.remove();  // IllegalStateException: sem next() antes
        } catch (IllegalStateException e) {
            System.err.println("Erro: " + e.getMessage());
        }
        
        it.next();
        it.remove();  // OK: chamou next() antes
    }
}
```

**IllegalStateException**: estado inválido (erro **programação** - validar estado).

---

## Categoria 9: Unchecked - ArithmeticException

```java
// ✅ ArithmeticException (divisão zero)
public class ExemplosArithmeticException {
    
    // ❌ MAU: não validar (lança ArithmeticException)
    public static int mau(int a, int b) {
        return a / b;  // ArithmeticException se b == 0
    }
    
    // ✅ BOM: validar divisor (prevenir)
    public static int bom(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("Divisor não pode ser zero");
        }
        return a / b;  // Seguro
    }
    
    // ✅ Calcular média (validar array vazio)
    public static double calcularMedia(int[] numeros) {
        if (numeros == null || numeros.length == 0) {
            throw new IllegalArgumentException("Array vazio");
        }
        
        int soma = 0;
        for (int n : numeros) {
            soma += n;
        }
        return (double) soma / numeros.length;  // Seguro (length > 0)
    }
    
    // ✅ Dividir com Optional (retorna vazio se divisor zero)
    public static Optional<Integer> dividirSeguro(int a, int b) {
        if (b == 0) {
            return Optional.empty();
        }
        return Optional.of(a / b);
    }
    
    public static void usarDividirSeguro() {
        dividirSeguro(10, 2)
            .ifPresent(r -> System.out.println("Resultado: " + r));  // 5
        
        dividirSeguro(10, 0)
            .ifPresentOrElse(
                r -> System.out.println("Resultado: " + r),
                () -> System.out.println("Divisor zero")
            );
    }
}
```

**ArithmeticException**: divisão zero (erro **programação** - prevenir).

---

## Categoria 10: Unchecked - IndexOutOfBoundsException

```java
// ✅ IndexOutOfBoundsException (índice inválido)
public class ExemplosIndexOutOfBoundsException {
    
    // ❌ MAU: não validar (lança IndexOutOfBounds)
    public static int mau(int[] array, int indice) {
        return array[indice];  // ArrayIndexOutOfBoundsException
    }
    
    // ✅ BOM: validar índice (prevenir)
    public static int bom(int[] array, int indice) {
        if (array == null) {
            throw new IllegalArgumentException("Array null");
        }
        if (indice < 0 || indice >= array.length) {
            throw new IllegalArgumentException(
                String.format("Índice inválido: %d (tamanho: %d)", 
                             indice, array.length)
            );
        }
        return array[indice];  // Seguro
    }
    
    // ✅ Get seguro (retorna Optional)
    public static <T> Optional<T> getSeguro(List<T> lista, int indice) {
        if (lista == null || indice < 0 || indice >= lista.size()) {
            return Optional.empty();
        }
        return Optional.of(lista.get(indice));
    }
    
    public static void usarGetSeguro() {
        List<String> nomes = Arrays.asList("Ana", "Bob", "Carol");
        
        getSeguro(nomes, 1)
            .ifPresent(System.out::println);  // Bob
        
        getSeguro(nomes, 10)
            .ifPresentOrElse(
                System.out::println,
                () -> System.out.println("Índice inválido")
            );
    }
    
    // ✅ Substring seguro
    public static String substringSeguro(String texto, int inicio, int fim) {
        if (texto == null) {
            throw new IllegalArgumentException("Texto null");
        }
        if (inicio < 0 || fim > texto.length() || inicio > fim) {
            throw new IllegalArgumentException(
                String.format("Índices inválidos: [%d, %d] (tamanho: %d)", 
                             inicio, fim, texto.length())
            );
        }
        return texto.substring(inicio, fim);  // Seguro
    }
}
```

**IndexOutOfBoundsException**: índice inválido (erro **programação** - prevenir).

---

## Resumo Comparativo

```java
/*
 * COMPARAÇÃO: CHECKED vs UNCHECKED
 * 
 * ┌─────────────────┬─────────────────────────┬──────────────────────┐
 * │ TIPO            │ CHECKED                 │ UNCHECKED            │
 * ├─────────────────┼─────────────────────────┼──────────────────────┤
 * │ I/O             │ IOException             │ -                    │
 * │                 │ FileNotFoundException   │                      │
 * ├─────────────────┼─────────────────────────┼──────────────────────┤
 * │ Banco           │ SQLException            │ -                    │
 * ├─────────────────┼─────────────────────────┼──────────────────────┤
 * │ Reflection      │ ClassNotFoundException  │ -                    │
 * ├─────────────────┼─────────────────────────┼──────────────────────┤
 * │ Parsing         │ ParseException          │ NumberFormatException│
 * ├─────────────────┼─────────────────────────┼──────────────────────┤
 * │ Threading       │ InterruptedException    │ -                    │
 * ├─────────────────┼─────────────────────────┼──────────────────────┤
 * │ Null            │ -                       │ NullPointerException │
 * ├─────────────────┼─────────────────────────┼──────────────────────┤
 * │ Validação       │ -                       │ IllegalArgument      │
 * ├─────────────────┼─────────────────────────┼──────────────────────┤
 * │ Estado          │ -                       │ IllegalState         │
 * ├─────────────────┼─────────────────────────┼──────────────────────┤
 * │ Aritmética      │ -                       │ ArithmeticException  │
 * ├─────────────────┼─────────────────────────┼──────────────────────┤
 * │ Índice          │ -                       │ IndexOutOfBounds     │
 * └─────────────────┴─────────────────────────┴──────────────────────┘
 */

public class ResumoComparativo {
    public static void main(String[] args) {
        System.out.println("=== CHECKED ===");
        System.out.println("IOException: arquivo, rede, stream");
        System.out.println("SQLException: banco de dados");
        System.out.println("ClassNotFoundException: reflection");
        System.out.println("ParseException: parsing dados");
        System.out.println("InterruptedException: threads");
        
        System.out.println("\n=== UNCHECKED ===");
        System.out.println("NullPointerException: objeto null");
        System.out.println("IllegalArgumentException: argumento inválido");
        System.out.println("IllegalStateException: estado inválido");
        System.out.println("ArithmeticException: divisão zero");
        System.out.println("IndexOutOfBoundsException: índice inválido");
    }
}
```

---

## Resumo

**Exemplos práticos** de checked vs unchecked:

**CHECKED**:
- **IOException**: arquivo, rede, stream
- **SQLException**: banco de dados
- **ClassNotFoundException**: carregar classes
- **ParseException**: parsing dados
- **InterruptedException**: threads

**UNCHECKED**:
- **NullPointerException**: objeto null
- **IllegalArgumentException**: argumento inválido
- **IllegalStateException**: estado inválido
- **ArithmeticException**: divisão zero
- **IndexOutOfBoundsException**: índice inválido

**Regra**: Checked = **externas**. Unchecked = **programação** (prevenir).
