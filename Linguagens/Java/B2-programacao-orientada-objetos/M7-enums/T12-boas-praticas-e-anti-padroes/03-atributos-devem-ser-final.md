# T12.03 - Atributos Devem Ser final

## Introdução

**Atributos final**: enum deve ser imutável.

```java
// ❌ Atributo mutável (perigoso)
public enum Status {
    ATIVO("Ativo"),
    INATIVO("Inativo");
    
    private String descricao; // ⚠️ Mutável
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao; // ⚠️ Perigoso
    }
}

// ⚠️ Problema: altera singleton
Status.ATIVO.setDescricao("Modificado"); // ⚠️ Afeta todos os usos

// ✅ Atributo final (imutável)
public enum Status {
    ATIVO("Ativo"),
    INATIVO("Inativo");
    
    private final String descricao; // ✅ Imutável
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao; // ✅ Só leitura
    }
}
```

**Imutabilidade**: garante thread-safety e previsibilidade.

---

## Fundamentos

### 1. Problema com Atributo Mutável

```java
// ❌ Atributo mutável
public enum Moeda {
    REAL("R$", 1.0),
    DOLAR("US$", 5.0);
    
    private String simbolo;
    private double taxaConversao; // ⚠️ Mutável
    
    Moeda(String simbolo, double taxaConversao) {
        this.simbolo = simbolo;
        this.taxaConversao = taxaConversao;
    }
    
    public void setTaxaConversao(double taxa) {
        this.taxaConversao = taxa; // ⚠️ Perigoso
    }
}

// ⚠️ Problema: altera estado global
Moeda.DOLAR.setTaxaConversao(6.0);
// Agora TODOS os usos de DOLAR têm taxa 6.0

// ⚠️ Thread-safety comprometida
Thread t1 = new Thread(() -> Moeda.DOLAR.setTaxaConversao(5.5));
Thread t2 = new Thread(() -> Moeda.DOLAR.setTaxaConversao(6.0));
// ⚠️ Race condition

// ✅ Atributo final
public enum Moeda {
    REAL("R$", 1.0),
    DOLAR("US$", 5.0);
    
    private final String simbolo;
    private final double taxaConversao; // ✅ Imutável
    
    Moeda(String simbolo, double taxaConversao) {
        this.simbolo = simbolo;
        this.taxaConversao = taxaConversao;
    }
    
    public double getTaxaConversao() {
        return taxaConversao; // ✅ Thread-safe
    }
}
```

### 2. Singleton Corrompido

```java
// ❌ Singleton corrompido
public enum Config {
    INSTANCIA;
    
    private String appName = "MeuApp"; // ⚠️ Não final
    
    public void setAppName(String name) {
        this.appName = name; // ⚠️ Altera singleton
    }
}

// ⚠️ Alteração global
Config.INSTANCIA.setAppName("OutroApp");
// Afeta todo o sistema

// ✅ Singleton imutável
public enum Config {
    INSTANCIA;
    
    private final String appName = "MeuApp"; // ✅ Final
    
    public String getAppName() {
        return appName; // ✅ Imutável
    }
}
```

### 3. Coleções Mutáveis

```java
// ❌ Coleção mutável
public enum Categoria {
    ELETRONICOS(Arrays.asList("TV", "Celular")),
    ROUPAS(Arrays.asList("Camisa", "Calça"));
    
    private List<String> produtos; // ⚠️ Mutável
    
    Categoria(List<String> produtos) {
        this.produtos = produtos;
    }
    
    public List<String> getProdutos() {
        return produtos; // ⚠️ Retorna referência mutável
    }
}

// ⚠️ Problema: modificação externa
Categoria.ELETRONICOS.getProdutos().add("Notebook"); // ⚠️ Altera enum

// ✅ Coleção imutável
public enum Categoria {
    ELETRONICOS(Arrays.asList("TV", "Celular")),
    ROUPAS(Arrays.asList("Camisa", "Calça"));
    
    private final List<String> produtos; // ✅ Final
    
    Categoria(List<String> produtos) {
        this.produtos = Collections.unmodifiableList(produtos); // ✅ Imutável
    }
    
    public List<String> getProdutos() {
        return produtos; // ✅ Imutável
    }
}

// ✅ Não permite modificação
// Categoria.ELETRONICOS.getProdutos().add("Notebook"); // ❌ UnsupportedOperationException
```

### 4. Map Mutável

```java
// ❌ Map mutável
public enum Cache {
    INSTANCIA;
    
    private Map<String, String> dados = new HashMap<>(); // ⚠️ Mutável
    
    public Map<String, String> getDados() {
        return dados; // ⚠️ Retorna referência mutável
    }
}

// ⚠️ Modificação externa
Cache.INSTANCIA.getDados().put("key", "value"); // ⚠️ Altera enum

// ✅ Map imutável ou cópia defensiva
public enum Cache {
    INSTANCIA;
    
    private final Map<String, String> dados = new HashMap<>(); // ✅ Final
    
    public Map<String, String> getDados() {
        return Collections.unmodifiableMap(dados); // ✅ Imutável
    }
    
    public void put(String key, String value) {
        dados.put(key, value); // ✅ Controlado
    }
}
```

### 5. Array Mutável

```java
// ❌ Array mutável
public enum DiaSemana {
    SEGUNDA(new int[]{8, 12, 14, 18}), // horários
    SABADO(new int[]{8, 12});
    
    private int[] horarios; // ⚠️ Não final
    
    DiaSemana(int[] horarios) {
        this.horarios = horarios;
    }
    
    public int[] getHorarios() {
        return horarios; // ⚠️ Retorna array mutável
    }
}

// ⚠️ Modificação externa
DiaSemana.SEGUNDA.getHorarios()[0] = 9; // ⚠️ Altera enum

// ✅ Array final + cópia defensiva
public enum DiaSemana {
    SEGUNDA(new int[]{8, 12, 14, 18}),
    SABADO(new int[]{8, 12});
    
    private final int[] horarios; // ✅ Final
    
    DiaSemana(int[] horarios) {
        this.horarios = horarios.clone(); // ✅ Cópia
    }
    
    public int[] getHorarios() {
        return horarios.clone(); // ✅ Retorna cópia
    }
}
```

### 6. Atributo Primitivo

```java
// ❌ Primitivo mutável
public enum Prioridade {
    BAIXA(1),
    ALTA(5);
    
    private int pontos; // ⚠️ Não final
    
    Prioridade(int pontos) {
        this.pontos = pontos;
    }
    
    public void setPontos(int pontos) {
        this.pontos = pontos; // ⚠️ Mutável
    }
}

// ⚠️ Alteração global
Prioridade.ALTA.setPontos(10);

// ✅ Primitivo final
public enum Prioridade {
    BAIXA(1),
    ALTA(5);
    
    private final int pontos; // ✅ Final
    
    Prioridade(int pontos) {
        this.pontos = pontos;
    }
    
    public int getPontos() {
        return pontos; // ✅ Imutável
    }
}
```

### 7. String Mutável (Problema Conceitual)

```java
// ❌ String não final
public enum Erro {
    NAO_ENCONTRADO("404"),
    ERRO_SERVIDOR("500");
    
    private String codigo; // ⚠️ Não final
    
    Erro(String codigo) {
        this.codigo = codigo;
    }
    
    public void setCodigo(String codigo) {
        this.codigo = codigo; // ⚠️ Mutável
    }
}

// ✅ String final
public enum Erro {
    NAO_ENCONTRADO("404"),
    ERRO_SERVIDOR("500");
    
    private final String codigo; // ✅ Final
    
    Erro(String codigo) {
        this.codigo = codigo;
    }
    
    public String getCodigo() {
        return codigo;
    }
}
```

### 8. Objeto Mutável

```java
// ❌ Objeto mutável
class Config {
    String host;
    int port;
}

public enum Ambiente {
    DEV(new Config()),
    PROD(new Config());
    
    private Config config; // ⚠️ Config mutável
    
    Ambiente(Config config) {
        this.config = config;
    }
    
    public Config getConfig() {
        return config; // ⚠️ Retorna referência mutável
    }
}

// ⚠️ Modificação externa
Ambiente.DEV.getConfig().host = "novo-host"; // ⚠️ Altera enum

// ✅ Objeto imutável
final class Config {
    final String host;
    final int port;
    
    Config(String host, int port) {
        this.host = host;
        this.port = port;
    }
}

public enum Ambiente {
    DEV(new Config("localhost", 8080)),
    PROD(new Config("prod.com", 80));
    
    private final Config config; // ✅ Config imutável
    
    Ambiente(Config config) {
        this.config = config;
    }
    
    public Config getConfig() {
        return config; // ✅ Imutável
    }
}
```

### 9. Cache com Estado Mutável

```java
// ⚠️ Cache com estado mutável (OK se controlado)
public enum Cache {
    INSTANCIA;
    
    private final Map<String, String> cache = new ConcurrentHashMap<>(); // ✅ Final
    
    public void put(String key, String value) {
        cache.put(key, value); // ✅ Mutável mas controlado
    }
    
    public String get(String key) {
        return cache.get(key);
    }
    
    // ⚠️ Não expor Map diretamente
    // public Map<String, String> getCache() { return cache; } // ❌
}
```

### 10. Validação de final

```java
// ✅ Compilador força final
public enum Status {
    ATIVO("Ativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    // ❌ Não compila: descricao é final
    // public void setDescricao(String desc) {
    //     this.descricao = desc; // ❌ Erro de compilação
    // }
}
```

---

## Aplicabilidade

**Atributos final** para:
- Imutabilidade (thread-safe)
- Previsibilidade
- Singleton seguro
- Evitar efeitos colaterais

---

## Armadilhas

### 1. Atributo Sem final

```java
// ❌ Sem final
private String valor; // ⚠️ Mutável

// ✅ Com final
private final String valor;
```

### 2. Expor Coleção Mutável

```java
// ❌ Expor coleção mutável
public List<String> getLista() {
    return lista; // ⚠️ Modificável
}

// ✅ Retornar cópia ou imutável
public List<String> getLista() {
    return Collections.unmodifiableList(lista);
}
```

### 3. Setter em Enum

```java
// ❌ Setter (não usar)
public void setValor(String valor) {
    this.valor = valor; // ⚠️ Quebra imutabilidade
}

// ✅ Sem setter
public String getValor() {
    return valor; // ✅ Só leitura
}
```

---

## Boas Práticas

### 1. Sempre final

```java
private final String descricao;
private final int codigo;
```

### 2. Coleção Imutável

```java
private final List<String> itens = 
    Collections.unmodifiableList(Arrays.asList("A", "B"));
```

### 3. Cópia Defensiva

```java
public int[] getArray() {
    return array.clone(); // ✅ Retorna cópia
}
```

### 4. Sem Setters

```java
// ✅ Apenas getters
public String getDescricao() {
    return descricao;
}
```

---

## Resumo

**Atributos final**:

```java
public enum Status {
    ATIVO("Ativo"),
    INATIVO("Inativo");
    
    private final String descricao; // ✅ Final
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao; // ✅ Imutável
    }
}
```

**Regra de Ouro**: **Sempre final**. **Sem setters**. **Coleções imutáveis** (unmodifiableList). **Cópia defensiva** para arrays. **Thread-safe** e **previsível**.
