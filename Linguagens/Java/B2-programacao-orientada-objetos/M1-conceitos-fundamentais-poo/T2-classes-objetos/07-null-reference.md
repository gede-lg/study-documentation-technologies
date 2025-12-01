# Null Reference

## 🎯 Introdução e Definição

**`null` é um valor literal especial** que indica que uma **referência não aponta para nenhum objeto**. É o **valor padrão** de todas as variáveis de referência não inicializadas. Tentar acessar membros (atributos ou métodos) através de uma referência `null` causa **`NullPointerException`** (NPE), **uma das exceções mais comuns em Java**.

**Conceito central**: `null` significa **"nada"**, **"ausência de objeto"**, **"referência vazia"**. É como ter um **controle remoto sem TV** - o controle existe (referência), mas não controla nada (sem objeto). Apertar botões (chamar métodos) causa erro.

**Analogia completa**:
- **Referência com objeto**: Endereço válido de casa → você pode visitar
- **Referência null**: Papel em branco sem endereço → não há para onde ir
- **NullPointerException**: Tentar visitar endereço que não existe → erro

**Exemplo fundamental**:
```java
// Referência SEM objeto
Pessoa pessoa = null;  // ← null (ausência de objeto)

// Tentar usar referência null
pessoa.nome = "João";  // ❌ NullPointerException!
// Erro: tentando acessar atributo de objeto inexistente

// MEMÓRIA:
// STACK:              HEAP:
// ┌──────────┐
// │ pessoa   │
// │ = null   │───→ (nada)
// └──────────┘
//       ↑
//   Não aponta para objeto
```

**Valores padrão**:
```java
public class Exemplo {
    Pessoa pessoa;      // null (padrão)
    Carro carro;        // null (padrão)
    String texto;       // null (padrão)
    int numero;         // 0 (padrão de primitivo)
    
    void mostrar() {
        System.out.println(pessoa);  // null
        System.out.println(carro);   // null
        System.out.println(texto);   // null
        System.out.println(numero);  // 0
    }
}

Exemplo ex = new Exemplo();
ex.mostrar();
// Output:
// null
// null
// null
// 0
```

**NullPointerException**:
```java
Produto produto = null;

// Todas estas linhas causam NullPointerException:
produto.nome = "Mouse";           // ❌ NPE
String n = produto.nome;          // ❌ NPE
produto.exibir();                 // ❌ NPE
double p = produto.preco;         // ❌ NPE
System.out.println(produto.nome); // ❌ NPE

// Stacktrace:
// Exception in thread "main" java.lang.NullPointerException
//     at Main.main(Main.java:10)
```

**Verificação defensiva**:
```java
Pessoa pessoa = buscarPessoa(123);

// ✓ CORRETO - verificar antes de usar
if (pessoa != null) {
    System.out.println(pessoa.nome);  // Seguro
} else {
    System.out.println("Pessoa não encontrada");
}

// ❌ ERRADO - usar sem verificar
System.out.println(pessoa.nome);  // NPE se pessoa == null
```

## 📋 Fundamentos Teóricos

### 1️⃣ Conceito de `null`

**Definição**: `null` é o **único valor** do **tipo especial null** em Java.

**Natureza**:
```java
// null NÃO é objeto
// null NÃO é String
// null NÃO é número
// null é LITERAL especial representando "ausência"

Pessoa p = null;  // null literal

// null pode ser atribuído a QUALQUER tipo de referência
String s = null;
Carro c = null;
List<Integer> lista = null;
int[] array = null;

// null NÃO pode ser atribuído a primitivos
int x = null;     // ❌ Erro de compilação
double d = null;  // ❌ Erro de compilação
boolean b = null; // ❌ Erro de compilação
```

**Comparação com null**:
```java
Produto p = null;

// Comparar com null (sempre use ==)
if (p == null) {
    System.out.println("Referência null");
}

// Ou negação
if (p != null) {
    System.out.println("Referência válida");
}

// ⚠️ NÃO use equals com null
// p.equals(null) → NullPointerException
```

### 2️⃣ Valores Padrão

**Atributos de instância**:
```java
public class Exemplo {
    String texto;       // null (padrão)
    Pessoa pessoa;      // null (padrão)
    int[] numeros;      // null (padrão)
    List<String> lista; // null (padrão)
    
    int valor;          // 0 (primitivo)
    boolean flag;       // false (primitivo)
}

Exemplo ex = new Exemplo();
System.out.println(ex.texto);   // null
System.out.println(ex.pessoa);  // null
System.out.println(ex.numeros); // null
System.out.println(ex.lista);   // null
System.out.println(ex.valor);   // 0
System.out.println(ex.flag);    // false
```

**Variáveis locais**:
```java
public void metodo() {
    Pessoa pessoa;  // NÃO inicializada
    
    // System.out.println(pessoa);  // ❌ Erro de compilação
    // "Variable 'pessoa' might not have been initialized"
    
    // Variável local DEVE ser inicializada antes de usar
    pessoa = null;  // Agora pode usar
    System.out.println(pessoa);  // null
}
```

**Arrays**:
```java
Produto[] produtos = new Produto[5];

// Array criado, mas posições são null
System.out.println(produtos[0]);  // null
System.out.println(produtos[1]);  // null
System.out.println(produtos[2]);  // null

// Usar posição null causa NPE
produtos[0].nome = "Mouse";  // ❌ NullPointerException

// Inicializar cada posição
produtos[0] = new Produto();
produtos[0].nome = "Mouse";  // ✓ OK
```

### 3️⃣ NullPointerException (NPE)

**Conceito**: **NPE é exceção lançada** ao tentar acessar membro através de referência null.

**Causas comuns**:
```java
Pessoa pessoa = null;

// 1. Acessar atributo
pessoa.nome = "João";         // ❌ NPE
String n = pessoa.nome;       // ❌ NPE

// 2. Chamar método
pessoa.exibir();              // ❌ NPE

// 3. Acessar length de array null
int[] numeros = null;
int tamanho = numeros.length; // ❌ NPE

// 4. Indexar array null
int primeiro = numeros[0];    // ❌ NPE

// 5. Chamar método de retorno null
String texto = getTexto();    // Retorna null
texto.toUpperCase();          // ❌ NPE

// 6. Unboxing de null
Integer numero = null;
int n = numero;               // ❌ NPE (unboxing)

// 7. Concatenação de String com null (OK, mas resultado pode surpreender)
String s = null;
String resultado = "Texto: " + s;  // "Texto: null" ← OK (não lança NPE)
```

**Stacktrace**:
```java
public class Teste {
    public static void main(String[] args) {
        Pessoa p = null;
        p.exibir();  // Linha 4 - NPE
    }
}

// Output:
// Exception in thread "main" java.lang.NullPointerException
//     at Teste.main(Teste.java:4)
//                              ↑ Linha do erro
```

### 4️⃣ Verificação Defensiva

**Padrão if-null**:
```java
Produto produto = buscarProduto(id);

// Verificar antes de usar
if (produto != null) {
    System.out.println(produto.nome);
    produto.exibir();
} else {
    System.out.println("Produto não encontrado");
}
```

**Operador ternário**:
```java
Pessoa pessoa = getPessoa();

// Valor padrão se null
String nome = (pessoa != null) ? pessoa.nome : "Desconhecido";

// Ou mais conciso
String idade = pessoa != null ? String.valueOf(pessoa.idade) : "N/A";
```

**Guard clauses (retorno antecipado)**:
```java
public void processar(Pedido pedido) {
    if (pedido == null) {
        return;  // Sai do método se null
    }
    
    // Código seguro - pedido não é null
    pedido.calcularTotal();
    pedido.enviar();
}
```

**Lançar exceção**:
```java
public void processar(Cliente cliente) {
    if (cliente == null) {
        throw new IllegalArgumentException("Cliente não pode ser null");
    }
    
    // Continua processamento
    cliente.ativar();
}
```

### 5️⃣ Objects.requireNonNull

**Utilidade**: Método da classe `Objects` que **valida** se referência não é null.

**Uso básico**:
```java
import java.util.Objects;

public void processar(Produto produto) {
    // Lança NullPointerException se produto == null
    Objects.requireNonNull(produto);
    
    // Se chegou aqui, produto NÃO é null
    produto.exibir();
}
```

**Com mensagem personalizada**:
```java
public void processar(Pedido pedido) {
    Objects.requireNonNull(pedido, "Pedido não pode ser null");
    
    pedido.processar();
}

// Se pedido == null:
// Exception in thread "main" java.lang.NullPointerException: Pedido não pode ser null
```

**No construtor**:
```java
public class Pedido {
    private Cliente cliente;
    private Produto produto;
    
    public Pedido(Cliente cliente, Produto produto) {
        this.cliente = Objects.requireNonNull(cliente, "Cliente obrigatório");
        this.produto = Objects.requireNonNull(produto, "Produto obrigatório");
    }
}

// Tentativa com null:
Pedido p = new Pedido(null, produto);
// NullPointerException: Cliente obrigatório
```

### 6️⃣ Optional<T>

**Conceito**: `Optional<T>` é **container** que pode conter valor ou ser **vazio** (alternativa moderna a null).

**Criação**:
```java
import java.util.Optional;

// Optional com valor
Optional<String> opcional = Optional.of("João");

// Optional vazio
Optional<String> vazio = Optional.empty();

// Optional que pode ser null (cria empty se null)
String texto = getTexto();  // Pode retornar null
Optional<String> opt = Optional.ofNullable(texto);
```

**Uso**:
```java
// Retornar Optional em vez de null
public Optional<Produto> buscarProduto(int id) {
    Produto produto = database.buscar(id);
    return Optional.ofNullable(produto);  // empty se null
}

// Consumir Optional
Optional<Produto> resultado = buscarProduto(123);

// Verificar se presente
if (resultado.isPresent()) {
    Produto p = resultado.get();
    System.out.println(p.nome);
}

// Ou usar ifPresent
resultado.ifPresent(p -> System.out.println(p.nome));

// Valor padrão se vazio
Produto p = resultado.orElse(new Produto());

// Ou lançar exceção se vazio
Produto p = resultado.orElseThrow(() -> 
    new IllegalStateException("Produto não encontrado")
);
```

**Vantagens**:
```java
// ANTES (com null):
public Produto buscar(int id) {
    return database.find(id);  // Pode retornar null
}

Produto p = buscar(123);
if (p != null) {  // Desenvolvedor pode esquecer de verificar
    System.out.println(p.nome);
}

// DEPOIS (com Optional):
public Optional<Produto> buscar(int id) {
    return Optional.ofNullable(database.find(id));
}

Optional<Produto> opt = buscar(123);
opt.ifPresent(p -> System.out.println(p.nome));  // Força verificação explícita
```

### 7️⃣ Retornar null de Métodos

**Indicar ausência**:
```java
public Pessoa buscarPorCpf(String cpf) {
    // Busca no banco
    Pessoa pessoa = database.buscar(cpf);
    
    if (pessoa == null) {
        return null;  // Indica não encontrado
    }
    
    return pessoa;
}

// Chamador DEVE verificar
Pessoa p = buscarPorCpf("123.456.789-00");
if (p == null) {
    System.out.println("Pessoa não encontrada");
} else {
    System.out.println(p.nome);
}
```

**Problemas com retorno null**:
```java
// 1. Chamador pode esquecer de verificar
Pessoa p = buscarPorCpf(cpf);
p.exibir();  // ❌ NPE se p == null

// 2. Ambiguidade
// null significa "não encontrado" ou "erro"?

// 3. Cascata de verificações
Pessoa p = getPessoa();
if (p != null) {
    Endereco e = p.getEndereco();
    if (e != null) {
        String cidade = e.getCidade();
        if (cidade != null) {
            // Finalmente usar cidade
        }
    }
}
```

**Alternativas melhores**:
```java
// 1. Optional
public Optional<Pessoa> buscarPorCpf(String cpf) {
    return Optional.ofNullable(database.buscar(cpf));
}

// 2. Lançar exceção
public Pessoa buscarPorCpf(String cpf) {
    Pessoa p = database.buscar(cpf);
    if (p == null) {
        throw new PessoaNaoEncontradaException(cpf);
    }
    return p;
}

// 3. Null Object Pattern (objeto válido mas vazio)
public Pessoa buscarPorCpf(String cpf) {
    Pessoa p = database.buscar(cpf);
    return (p != null) ? p : new PessoaNula();
}
```

### 8️⃣ null em Coleções

**Listas**:
```java
List<String> lista = new ArrayList<>();
lista.add("A");
lista.add(null);  // ✓ ArrayList aceita null
lista.add("B");

System.out.println(lista);  // [A, null, B]

// Iteração pode causar NPE
for (String s : lista) {
    System.out.println(s.toUpperCase());  // ❌ NPE no null
}

// Filtrar null
for (String s : lista) {
    if (s != null) {
        System.out.println(s.toUpperCase());  // ✓ Seguro
    }
}
```

**Mapas**:
```java
Map<String, String> mapa = new HashMap<>();
mapa.put("nome", "João");
mapa.put("email", null);  // ✓ HashMap aceita null value

String email = mapa.get("email");
if (email != null) {
    System.out.println(email.toLowerCase());
}

// Chave null (HashMap permite 1 chave null)
mapa.put(null, "valor");  // ✓ OK
```

**Evitar null em coleções**:
```java
// NÃO retornar lista null
public List<Produto> getProdutos() {
    return null;  // ❌ Ruim
}

// Retornar lista vazia
public List<Produto> getProdutos() {
    return Collections.emptyList();  // ✓ Melhor
}

// Uso:
List<Produto> produtos = getProdutos();
// Sem verificação null necessária
for (Produto p : produtos) {  // ✓ Funciona mesmo se vazia
    System.out.println(p);
}
```

### 9️⃣ Null Object Pattern

**Conceito**: Criar objeto **válido mas vazio** em vez de retornar null.

**Exemplo**:
```java
public interface Produto {
    String getNome();
    double getPreco();
    void exibir();
}

public class ProdutoReal implements Produto {
    private String nome;
    private double preco;
    
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public void exibir() {
        System.out.println(nome + " - R$ " + preco);
    }
}

public class ProdutoNulo implements Produto {
    public String getNome() { return ""; }
    public double getPreco() { return 0; }
    public void exibir() {
        // Não faz nada (comportamento vazio)
    }
}

// Uso:
public Produto buscarProduto(int id) {
    Produto p = database.buscar(id);
    return (p != null) ? p : new ProdutoNulo();  // Nunca null
}

// Chamador não precisa verificar null
Produto p = buscarProduto(123);
p.exibir();  // ✓ Sempre seguro
```

### 🔟 Debugging NPE

**Ler stacktrace**:
```java
Exception in thread "main" java.lang.NullPointerException
    at com.exemplo.Servico.processar(Servico.java:45)
    at com.exemplo.Main.main(Main.java:12)

// Linha 45 de Servico.java causou NPE
// Verifique qual variável é null nessa linha
```

**Mensagens úteis (Java 14+)**:
```java
// Java 14+ mostra QUAL variável é null
pessoa.endereco.cidade.toUpperCase();

// NPE antiga (Java < 14):
// java.lang.NullPointerException

// NPE nova (Java 14+):
// java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" 
// because the return value of "Endereco.getCidade()" is null
//                                        ↑ Identifica ONDE está null
```

**Debugging**:
```java
// Quebre expressão complexa
// ANTES:
pessoa.getEndereco().getCidade().toUpperCase();  // NPE - qual é null?

// DEPOIS (para debugar):
Endereco endereco = pessoa.getEndereco();  // Pode ser null
String cidade = endereco.getCidade();      // Ou cidade pode ser null
String upper = cidade.toUpperCase();       // Ou aqui

// Identifica exatamente qual linha causa NPE
```

## 🎯 Aplicabilidade

**1. Indicar ausência de valor**
**2. Valores padrão de atributos**
**3. Parâmetros opcionais**
**4. Retorno indicando "não encontrado"**
**5. Limpeza de referências (preparar para GC)**

## ⚠️ Armadilhas Comuns

**1. Usar sem verificar**:
```java
Pessoa p = getPessoa();
p.exibir();  // ❌ NPE se null
```

**2. Retornar null de métodos**:
```java
public List<String> getLista() {
    return null;  // ❌ Force caller to check
}
```

**3. Comparar com equals**:
```java
if (objeto.equals(null)) { }  // ❌ NPE
```

**4. Autoboxing de null**:
```java
Integer num = null;
int x = num;  // ❌ NPE
```

**5. Concatenar sem verificar**:
```java
String s = null;
s.length();  // ❌ NPE
```

## ✅ Boas Práticas

**1. Sempre verificar null**:
```java
if (referencia != null) {
    referencia.metodo();
}
```

**2. Usar Optional**:
```java
public Optional<Tipo> buscar(int id) {
    return Optional.ofNullable(result);
}
```

**3. Retornar coleção vazia**:
```java
return Collections.emptyList();
```

**4. Validar parâmetros**:
```java
Objects.requireNonNull(param, "msg");
```

**5. Documentar possibilidade de null**:
```java
/**
 * @return Produto ou null se não encontrado
 */
public Produto buscar(int id) { }
```

## 📚 Resumo Executivo

**null = ausência de objeto**.

**Default**:
```java
Tipo ref;  // null (atributo)
Tipo ref = null;  // Explícito
```

**NPE**:
```java
Tipo ref = null;
ref.metodo();  // NullPointerException
```

**Verificar**:
```java
if (ref != null) {
    ref.metodo();
}
```

**Validar**:
```java
Objects.requireNonNull(ref, "msg");
```

**Optional**:
```java
Optional<Tipo> opt = Optional.ofNullable(ref);
opt.ifPresent(t -> t.metodo());
```

**Evitar**:
- Retornar null de coleções
- Usar sem verificar
- Comparar com equals

**Preferir**:
- Collections.emptyList()
- Optional<T>
- Null Object Pattern

**Recomendação**: **Evite null** quando possível, use **Optional**, retorne **coleções vazias**, **valide parâmetros**, sempre **verifique null** antes de usar.