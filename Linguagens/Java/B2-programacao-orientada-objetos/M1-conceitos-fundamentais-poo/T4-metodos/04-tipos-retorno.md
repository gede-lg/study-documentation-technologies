# Tipos de Retorno

## 🎯 Introdução e Definição

**Tipo de retorno** é a **especificação do tipo de dado** que um método **devolve** ao chamador após sua execução. Define **o que** o método produz como resultado - pode ser um valor primitivo, um objeto, uma coleção, ou **void** (nada). O tipo de retorno é **declarado antes** do nome do método e **obriga** o método a retornar valor compatível.

**Conceito central**: Tipo de retorno é o **contrato de saída** do método - **promete** devolver determinado tipo de dado. Se declara retornar `int`, **deve** retornar `int`. Se declara `void`, **não retorna** nada. É como especificar **o que sai** de uma função matemática: f(x) → y (entrada x, saída y do tipo especificado).

**Analogia completa**:
- **Método**: Máquina de venda
- **Parâmetros**: Dinheiro inserido (entrada)
- **Tipo de retorno**: Tipo de produto que sai (saída especificada)
- **return**: Produto físico entregue
- **void**: Máquina que não entrega produto (ex: doação)

**Estrutura**:
```java
modificador TIPO_RETORNO nomeMetodo(parametros) {
//          ↑
//    Tipo que será retornado
    
    return valor;  // Valor deve ser do tipo especificado
}

// EXEMPLOS:
public int somar(int a, int b) {
//     ↑ Tipo de retorno: int
    return a + b;  // Retorna int
}

public String getNome() {
//     ↑ Tipo de retorno: String
    return "João";  // Retorna String
}

public void exibir() {
//     ↑ Tipo de retorno: void (nada)
    System.out.println("Hello");
    // Sem return (ou return; sem valor)
}
```

**Exemplo completo**:
```java
public class Calculadora {
    // Retorna int
    public int multiplicar(int a, int b) {
        int resultado = a * b;
        return resultado;  // DEVE retornar int
    }
    
    // Retorna double
    public double dividir(int a, int b) {
        return (double) a / b;  // DEVE retornar double
    }
    
    // Retorna boolean
    public boolean ehPar(int numero) {
        return numero % 2 == 0;  // DEVE retornar boolean
    }
    
    // Retorna String
    public String getDescricao() {
        return "Calculadora v1.0";  // DEVE retornar String
    }
    
    // Retorna objeto
    public Produto criarProduto() {
        Produto p = new Produto();
        return p;  // DEVE retornar Produto
    }
    
    // Não retorna (void)
    public void exibir(String msg) {
        System.out.println(msg);
        // Sem return
    }
}

// USO:
Calculadora calc = new Calculadora();

int mult = calc.multiplicar(10, 5);       // Recebe int (50)
double div = calc.dividir(10, 3);         // Recebe double (3.333...)
boolean par = calc.ehPar(10);             // Recebe boolean (true)
String desc = calc.getDescricao();        // Recebe String
Produto prod = calc.criarProduto();       // Recebe Produto
calc.exibir("Hello");                     // Não recebe nada (void)
```

## 📋 Fundamentos Teóricos

### 1️⃣ Tipos Primitivos como Retorno

**Conceito**: Método pode retornar qualquer tipo primitivo.

**byte, short, int, long**:
```java
public byte getByte() {
    return 127;  // byte (-128 a 127)
}

public short getShort() {
    return 32000;  // short (-32768 a 32767)
}

public int getInt() {
    return 2_000_000;  // int
}

public long getLong() {
    return 9_000_000_000L;  // long
}
```

**float, double**:
```java
public float getFloat() {
    return 3.14f;  // float (sufixo f)
}

public double getDouble() {
    return 3.14159265359;  // double
}

public double calcularMedia(int a, int b) {
    return (a + b) / 2.0;  // Divisão com double
}
```

**boolean**:
```java
public boolean isPositivo(int numero) {
    return numero > 0;
}

public boolean temEstoque(Produto produto) {
    return produto.getEstoque() > 0;
}

public boolean validarCpf(String cpf) {
    // Lógica de validação
    return cpf.length() == 11;
}
```

**char**:
```java
public char getPrimeiraLetra(String texto) {
    return texto.charAt(0);
}

public char getGrau(int nota) {
    if (nota >= 90) return 'A';
    if (nota >= 80) return 'B';
    if (nota >= 70) return 'C';
    return 'F';
}
```

### 2️⃣ Tipos de Referência como Retorno

**String**:
```java
public String getNome() {
    return "João Silva";
}

public String concatenar(String s1, String s2) {
    return s1 + s2;
}

public String getDescricao() {
    return "Produto: " + nome + " - Preço: " + preco;
}
```

**Objetos**:
```java
public Produto criarProduto(String nome, double preco) {
    Produto p = new Produto();
    p.setNome(nome);
    p.setPreco(preco);
    return p;  // Retorna objeto Produto
}

public Cliente buscarCliente(int id) {
    // Busca no banco
    Cliente cliente = database.find(id);
    return cliente;  // Pode retornar null se não encontrar
}

public Endereco getEndereco() {
    return this.endereco;  // Retorna atributo (referência)
}
```

**Arrays**:
```java
public int[] getNumeros() {
    int[] array = {1, 2, 3, 4, 5};
    return array;
}

public String[] dividir(String texto) {
    return texto.split(" ");  // Retorna array de Strings
}

public Produto[] listarProdutos() {
    Produto[] produtos = new Produto[10];
    // Preencher array
    return produtos;
}
```

**Coleções**:
```java
public List<String> getNomes() {
    List<String> nomes = new ArrayList<>();
    nomes.add("João");
    nomes.add("Maria");
    return nomes;
}

public Map<String, Integer> getEstoque() {
    Map<String, Integer> estoque = new HashMap<>();
    estoque.put("Mouse", 100);
    estoque.put("Teclado", 50);
    return estoque;
}

public Set<Produto> getProdutosUnicos() {
    return new HashSet<>(produtos);
}
```

### 3️⃣ void - Sem Retorno

**Conceito**: `void` indica que método **não retorna valor**.

**Declaração**:
```java
public void metodoSemRetorno() {
    // Executa ação, não retorna nada
    System.out.println("Executando...");
    // Sem return (ou return; sem valor)
}
```

**Uso**:
```java
public class Impressora {
    public void imprimir(String texto) {
        System.out.println(texto);
        // void - não retorna
    }
    
    public void enviarEmail(String destinatario, String mensagem) {
        // Envia email
        System.out.println("Email enviado para " + destinatario);
        // void - ação executada, sem retorno
    }
    
    public void salvar(Produto produto) {
        database.save(produto);
        // void - salva mas não retorna nada
    }
}

// Chamada:
Impressora imp = new Impressora();
imp.imprimir("Hello");  // Executa, não recebe retorno
imp.enviarEmail("user@email.com", "Msg");  // Não atribui a variável

// ❌ ERRO - void não pode ser atribuído:
String resultado = imp.imprimir("Hello");  // Erro de compilação
```

**return em void** (retorno vazio):
```java
public void processar(int valor) {
    if (valor < 0) {
        return;  // Sai do método (sem valor)
    }
    
    // Continua processamento
    System.out.println("Processando " + valor);
    
    // return; no final é opcional (implícito)
}
```

### 4️⃣ Palavra-chave return

**Conceito**: `return` **encerra** método e **devolve** valor ao chamador.

**Retorno simples**:
```java
public int somar(int a, int b) {
    return a + b;  // Retorna resultado e termina
}
```

**Retorno com variável**:
```java
public double calcular(int x, int y) {
    double resultado = (x + y) / 2.0;
    return resultado;  // Retorna valor da variável
}
```

**Múltiplos returns** (diferentes caminhos):
```java
public String classificar(int nota) {
    if (nota >= 90) {
        return "A";  // Retorna e SAI
    }
    if (nota >= 80) {
        return "B";  // Retorna e SAI
    }
    if (nota >= 70) {
        return "C";  // Retorna e SAI
    }
    return "F";  // Retorno padrão
}
```

**Early return** (retorno antecipado):
```java
public boolean processar(Pedido pedido) {
    // Validações com retorno antecipado
    if (pedido == null) {
        return false;  // Sai imediatamente
    }
    
    if (pedido.getTotal() <= 0) {
        return false;  // Sai se inválido
    }
    
    // Processamento principal
    pedido.calcular();
    pedido.enviar();
    return true;  // Sucesso
}
```

**return void**:
```java
public void metodo() {
    if (condicao) {
        return;  // Sai do método (sem valor)
    }
    
    // Continua se não retornou
    System.out.println("Continua");
}
```

### 5️⃣ Compatibilidade de Tipos

**Tipo exato**:
```java
public int getIdade() {
    int idade = 30;
    return idade;  // ✓ int retorna int
}
```

**Widening** (conversão automática - menor para maior):
```java
public double getValor() {
    int x = 10;
    return x;  // ✓ int → double (widening automático)
}

public long getNumero() {
    int x = 100;
    return x;  // ✓ int → long (widening)
}
```

**Narrowing** (requer cast - maior para menor):
```java
public int getInt() {
    double x = 10.5;
    return x;  // ❌ ERRO - double não cabe em int
}

public int getInt() {
    double x = 10.5;
    return (int) x;  // ✓ OK com cast explícito
}
```

**Subtipos** (polimorfismo):
```java
public Animal getAnimal() {
    Cachorro cachorro = new Cachorro();
    return cachorro;  // ✓ Cachorro é Animal (subtipo)
}

public Object getObjeto() {
    String texto = "Hello";
    return texto;  // ✓ String é Object
}
```

**Null**:
```java
public String getNome() {
    return null;  // ✓ null é válido para tipos de referência
}

public int getNumero() {
    return null;  // ❌ ERRO - null não é válido para primitivos
}

public Integer getNumero() {
    return null;  // ✓ Integer (wrapper) aceita null
}
```

### 6️⃣ Generics como Retorno

**Método genérico**:
```java
public <T> T getPrimeiro(List<T> lista) {
    //  ↑  ↑ Tipo genérico T
    if (lista.isEmpty()) {
        return null;
    }
    return lista.get(0);  // Retorna T
}

// Uso:
List<String> nomes = Arrays.asList("João", "Maria");
String primeiro = getPrimeiro(nomes);  // T = String

List<Integer> numeros = Arrays.asList(10, 20, 30);
Integer num = getPrimeiro(numeros);  // T = Integer
```

**Coleções genéricas**:
```java
public List<Produto> listarProdutos() {
    List<Produto> produtos = new ArrayList<>();
    // Preencher lista
    return produtos;
}

public Map<String, Cliente> getClientes() {
    Map<String, Cliente> clientes = new HashMap<>();
    // Preencher mapa
    return clientes;
}

public Optional<Produto> buscarProduto(int id) {
    Produto p = database.find(id);
    return Optional.ofNullable(p);
}
```

### 7️⃣ Optional<T> como Retorno

**Conceito**: `Optional<T>` representa valor que **pode ou não existir**.

**Uso**:
```java
public Optional<Produto> buscarPorId(int id) {
    Produto produto = database.find(id);
    return Optional.ofNullable(produto);  // Encapsula (pode ser null)
}

// Chamada:
Optional<Produto> resultado = buscarPorId(123);

// Verificar presença:
if (resultado.isPresent()) {
    Produto p = resultado.get();
    System.out.println(p.getNome());
}

// Ou usar lambda:
resultado.ifPresent(p -> System.out.println(p.getNome()));

// Valor padrão:
Produto p = resultado.orElse(new Produto());

// Exceção se vazio:
Produto p = resultado.orElseThrow(() -> 
    new IllegalStateException("Produto não encontrado")
);
```

**Vantagens sobre null**:
```java
// ANTES (com null):
public Produto buscar(int id) {
    return database.find(id);  // Pode retornar null
}

Produto p = buscar(123);
if (p != null) {  // Desenvolvedor pode esquecer de verificar
    p.exibir();
}

// DEPOIS (com Optional):
public Optional<Produto> buscar(int id) {
    return Optional.ofNullable(database.find(id));
}

Optional<Produto> opt = buscar(123);
opt.ifPresent(p -> p.exibir());  // Força tratamento explícito
```

### 8️⃣ Retorno de this (Method Chaining)

**Conceito**: Retornar `this` permite **encadear chamadas**.

**Exemplo**:
```java
public class Produto {
    private String nome;
    private double preco;
    private int estoque;
    
    // Métodos retornam 'this'
    public Produto setNome(String nome) {
        this.nome = nome;
        return this;  // Retorna próprio objeto
    }
    
    public Produto setPreco(double preco) {
        this.preco = preco;
        return this;
    }
    
    public Produto setEstoque(int estoque) {
        this.estoque = estoque;
        return this;
    }
}

// Uso - encadear chamadas:
Produto produto = new Produto()
    .setNome("Mouse")
    .setPreco(50.0)
    .setEstoque(100);
//  ↑ Cada método retorna o próprio objeto, permitindo chamar próximo método
```

**Builder Pattern**:
```java
public class PedidoBuilder {
    private Pedido pedido = new Pedido();
    
    public PedidoBuilder cliente(Cliente cliente) {
        pedido.setCliente(cliente);
        return this;
    }
    
    public PedidoBuilder produto(Produto produto) {
        pedido.addProduto(produto);
        return this;
    }
    
    public PedidoBuilder desconto(double desconto) {
        pedido.setDesconto(desconto);
        return this;
    }
    
    public Pedido build() {
        return pedido;  // Retorna pedido final
    }
}

// Uso:
Pedido pedido = new PedidoBuilder()
    .cliente(cliente)
    .produto(produto1)
    .produto(produto2)
    .desconto(10.0)
    .build();
```

### 9️⃣ Covariant Return Types

**Conceito**: Subclasse pode retornar **subtipo** do tipo declarado na superclasse.

**Exemplo**:
```java
public class Animal {
    public Animal clonar() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    @Override
    public Cachorro clonar() {  // ✓ Retorna Cachorro (subtipo de Animal)
        return new Cachorro();
    }
}

// Uso:
Animal a = new Animal();
Animal a2 = a.clonar();  // Animal

Cachorro c = new Cachorro();
Cachorro c2 = c.clonar();  // Cachorro (não precisa cast)
```

**Factory pattern**:
```java
public abstract class Documento {
    public abstract Documento criar();
}

public class PDF extends Documento {
    @Override
    public PDF criar() {  // Retorna PDF (mais específico)
        return new PDF();
    }
}

public class Word extends Documento {
    @Override
    public Word criar() {  // Retorna Word (mais específico)
        return new Word();
    }
}
```

### 🔟 Retorno de Múltiplos Valores

**Conceito**: Java não suporta retorno de múltiplos valores diretamente.

**Solução 1 - Criar classe/record**:
```java
// Record (Java 14+)
public record Resultado(int soma, int produto, double media) { }

public Resultado calcular(int a, int b) {
    int soma = a + b;
    int produto = a * b;
    double media = (a + b) / 2.0;
    return new Resultado(soma, produto, media);
}

// Uso:
Resultado r = calcular(10, 20);
System.out.println(r.soma());     // 30
System.out.println(r.produto());  // 200
System.out.println(r.media());    // 15.0
```

**Solução 2 - Array**:
```java
public int[] calcular(int a, int b) {
    int[] resultados = new int[2];
    resultados[0] = a + b;  // soma
    resultados[1] = a * b;  // produto
    return resultados;
}

// Uso:
int[] res = calcular(10, 20);
int soma = res[0];
int produto = res[1];
```

**Solução 3 - Map**:
```java
public Map<String, Object> calcular(int a, int b) {
    Map<String, Object> resultado = new HashMap<>();
    resultado.put("soma", a + b);
    resultado.put("produto", a * b);
    resultado.put("media", (a + b) / 2.0);
    return resultado;
}

// Uso:
Map<String, Object> res = calcular(10, 20);
int soma = (int) res.get("soma");
double media = (double) res.get("media");
```

## 🎯 Aplicabilidade

**1. Retornar resultados de cálculos**
**2. Fornecer acesso a dados (getters)**
**3. Criar e retornar objetos (factory)**
**4. Indicar sucesso/falha (boolean)**
**5. Transformar dados (converter)**

## ⚠️ Armadilhas Comuns

**1. Esquecer return**:
```java
public int somar(int a, int b) {
    int soma = a + b;
    // ❌ ERRO: missing return
}
```

**2. Retornar tipo incompatível**:
```java
public int getNumero() {
    return "texto";  // ❌ ERRO: String não é int
}
```

**3. Retornar null sem documentar**:
```java
public Produto buscar(int id) {
    return null;  // ⚠️ Pode causar NPE
}
```

**4. Múltiplos caminhos sem return**:
```java
public int metodo(int x) {
    if (x > 0) {
        return x;
    }
    // ❌ ERRO: falta return para x <= 0
}
```

**5. Retornar referência interna mutável**:
```java
public List<Produto> getProdutos() {
    return this.produtos;  // ⚠️ Expõe lista interna
}
```

## ✅ Boas Práticas

**1. Documentar retorno null**:
```java
/**
 * @return Produto ou null se não encontrado
 */
public Produto buscar(int id) { }
```

**2. Preferir Optional a null**:
```java
public Optional<Produto> buscar(int id) {
    return Optional.ofNullable(produto);
}
```

**3. Retornar coleções vazias**:
```java
public List<Produto> listar() {
    return Collections.emptyList();  // Não null
}
```

**4. Cópia defensiva**:
```java
public List<Produto> getProdutos() {
    return new ArrayList<>(produtos);  // Cópia
}
```

**5. Tipo mais específico possível**:
```java
public ArrayList<String> getLista() {  // Específico
    return new ArrayList<>();
}
```

## 📚 Resumo Executivo

**Tipo de retorno = o que sai**.

**Declaração**:
```java
public TIPO metodo() {
    return valor;  // Tipo compatível
}
```

**Primitivos**:
```java
public int getInt() { return 10; }
public boolean isValido() { return true; }
```

**Objetos**:
```java
public String getNome() { return "João"; }
public Produto criar() { return new Produto(); }
```

**Coleções**:
```java
public List<String> getLista() { return lista; }
```

**void**:
```java
public void metodo() {
    // Sem return
}
```

**Optional**:
```java
public Optional<Produto> buscar(int id) {
    return Optional.ofNullable(produto);
}
```

**Method chaining**:
```java
public Produto setNome(String nome) {
    this.nome = nome;
    return this;  // Encadear
}
```

**Múltiplos valores**:
```java
public record Resultado(int x, int y) { }
public Resultado calcular() {
    return new Resultado(10, 20);
}
```

**Evitar**:
- Retornar null sem documentar
- Expor coleções internas
- Esquecer return

**Preferir**:
- Optional para valores opcionais
- Coleções vazias a null
- Cópia defensiva
- Documentação clara

**Recomendação**: Use **Optional** em vez de null, retorne **coleções vazias** em vez de null, documente quando **null é possível**, faça **cópia defensiva** de coleções internas, prefira **tipo mais específico** possível.