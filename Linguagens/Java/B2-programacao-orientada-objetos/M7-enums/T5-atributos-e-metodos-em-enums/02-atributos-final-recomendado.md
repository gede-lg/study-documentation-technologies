# T5.02 - Atributos Final (Recomendado)

## Introdução

**Atributos final**: imutáveis após inicialização no construtor.

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0);
    
    private final String descricao; // ✅ final (imutável)
    private final int codigo;       // ✅ final (imutável)
    
    Status(String descricao, int codigo) {
        this.descricao = descricao; // inicializado uma vez
        this.codigo = codigo;       // inicializado uma vez
    }
    
    public String getDescricao() { return descricao; }
    public int getCodigo() { return codigo; }
}

// ❌ Não pode modificar
// Status.ATIVO.descricao = "Novo"; // Erro de compilação
```

**Final**: garante imutabilidade de constantes.

---

## Fundamentos

### 1. Final Básico

```java
public enum Cor {
    VERMELHO("#FF0000");
    
    private final String hex; // ✅ final
    
    Cor(String hex) {
        this.hex = hex; // inicializado no construtor
    }
    
    public String getHex() {
        return hex;
    }
}
```

### 2. Final vs Não Final

```java
// ✅ Com final (imutável)
public enum StatusFinal {
    ATIVO("Ativo");
    
    private final String descricao;
    
    StatusFinal(String descricao) {
        this.descricao = descricao;
    }
    
    // Sem setter (imutável)
}

// ❌ Sem final (mutável)
public enum StatusMutavel {
    ATIVO("Ativo");
    
    private String descricao; // sem final
    
    StatusMutavel(String descricao) {
        this.descricao = descricao;
    }
    
    public void setDescricao(String d) {
        this.descricao = d; // ❌ Constante mutável
    }
}
```

### 3. Múltiplos Atributos Final

```java
public enum Moeda {
    REAL("BRL", "R$", 2);
    
    private final String codigo;    // ✅ final
    private final String simbolo;   // ✅ final
    private final int casasDecimais; // ✅ final
    
    Moeda(String codigo, String simbolo, int casasDecimais) {
        this.codigo = codigo;
        this.simbolo = simbolo;
        this.casasDecimais = casasDecimais;
    }
}
```

### 4. Final com Primitivos

```java
public enum Prioridade {
    ALTA(10);
    
    private final int nivel;      // ✅ final
    private final double peso;    // ✅ final
    private final boolean urgente; // ✅ final
    
    Prioridade(int nivel) {
        this.nivel = nivel;
        this.peso = nivel * 1.5;
        this.urgente = nivel >= 8;
    }
}
```

### 5. Final com Objetos

```java
public enum Produto {
    NOTEBOOK("Notebook", LocalDate.of(2024, 1, 1));
    
    private final String nome;           // ✅ final
    private final LocalDate dataLancamento; // ✅ final
    
    Produto(String nome, LocalDate dataLancamento) {
        this.nome = nome;
        this.dataLancamento = dataLancamento;
    }
}
```

### 6. Final com Collections

```java
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever", "deletar"));
    
    private final List<String> acoes; // ✅ final (referência)
    
    Permissao(List<String> acoes) {
        this.acoes = new ArrayList<>(acoes); // ✅ cópia defensiva
    }
    
    public List<String> getAcoes() {
        return new ArrayList<>(acoes); // ✅ cópia defensiva
    }
}

// ⚠️ Referência final, mas conteúdo mutável
// Permissao.ADMIN.acoes.add("novo"); // ❌ Se não usar cópia defensiva
```

### 7. Final Garante Thread-Safety

```java
public enum Config {
    INSTANCE;
    
    private final Map<String, String> configuracoes; // ✅ final
    
    Config() {
        this.configuracoes = new ConcurrentHashMap<>();
        configuracoes.put("timeout", "30");
    }
    
    public String get(String chave) {
        return configuracoes.get(chave);
    }
}
```

### 8. Final com Atributo Calculado

```java
public enum Temperatura {
    FRIO(0, 15);
    
    private final int min;      // ✅ final
    private final int max;      // ✅ final
    private final int media;    // ✅ final (calculado)
    
    Temperatura(int min, int max) {
        this.min = min;
        this.max = max;
        this.media = (min + max) / 2; // calculado no construtor
    }
}
```

### 9. Final vs Static Final

```java
public enum Moeda {
    REAL("BRL");
    
    // ✅ Atributo de instância (final)
    private final String codigo;
    
    // ✅ Atributo de classe (static final)
    private static final String UNIDADE = "Moeda";
    
    Moeda(String codigo) {
        this.codigo = codigo;
    }
}

// codigo: cada constante tem seu próprio valor
// UNIDADE: compartilhado por todas as constantes
```

### 10. Erro ao Modificar Final

```java
public enum Status {
    ATIVO("Ativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public void setDescricao(String d) {
        // ❌ Erro de compilação
        // this.descricao = d; // Cannot assign a value to final variable 'descricao'
    }
}
```

---

## Aplicabilidade

**Atributos final** para:
- Garantir imutabilidade de constantes
- Prevenir modificação acidental
- Thread-safety (referência imutável)
- Documentar intenção (não deve mudar)

---

## Armadilhas

### 1. Final com Collection Mutável

```java
// ⚠️ Referência final, conteúdo mutável
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever"));
    
    private final List<String> acoes; // ✅ final
    
    Permissao(List<String> acoes) {
        this.acoes = acoes; // ❌ Referência direta
    }
    
    public List<String> getAcoes() {
        return acoes; // ❌ Vazamento
    }
}

// ⚠️ Pode modificar conteúdo
Permissao.ADMIN.getAcoes().add("deletar");

// ✅ Cópia defensiva
Permissao(List<String> acoes) {
    this.acoes = new ArrayList<>(acoes);
}
public List<String> getAcoes() {
    return new ArrayList<>(acoes);
}
```

### 2. Não Inicializado

```java
// ❌ Erro de compilação
public enum Status {
    ATIVO;
    
    private final String descricao; // ❌ final não inicializado
    
    Status() {
        // ❌ descricao não atribuído
    }
}

// ✅ Inicializar no construtor
Status() {
    this.descricao = "Ativo";
}
```

### 3. Tentar Modificar

```java
// ❌ Erro de compilação
public enum Cor {
    VERMELHO("#FF0000");
    
    private final String hex;
    
    Cor(String hex) {
        this.hex = hex;
    }
    
    public void setHex(String h) {
        // ❌ Cannot assign a value to final variable
        // this.hex = h;
    }
}
```

---

## Boas Práticas

### 1. Sempre Final

```java
// ✅ Atributos sempre final
private final String nome;
private final int codigo;
private final double preco;
```

### 2. Cópia Defensiva

```java
// ✅ Cópia defensiva para collections
Permissao(List<String> acoes) {
    this.acoes = Collections.unmodifiableList(new ArrayList<>(acoes));
}

public List<String> getAcoes() {
    return acoes; // já é unmodifiable
}
```

### 3. Validação no Construtor

```java
// ✅ Validar antes de atribuir final
Prioridade(int nivel) {
    if (nivel < 1 || nivel > 10) {
        throw new IllegalArgumentException("Nível inválido");
    }
    this.nivel = nivel; // atribuição única
}
```

### 4. Documentar Final

```java
// ✅ Javadoc para final
/**
 * Código da moeda (imutável).
 */
private final String codigo;
```

---

## Resumo

**Atributos final**:

```java
public enum Status {
    ATIVO("Ativo", 1);
    
    private final String descricao; // ✅ final (imutável)
    private final int codigo;       // ✅ final (imutável)
    
    Status(String descricao, int codigo) {
        this.descricao = descricao; // inicializado uma vez
        this.codigo = codigo;
    }
}

// ❌ Não pode modificar
// Status.ATIVO.descricao = "Novo"; // Erro
```

**Final vs Não Final**:

```java
// ✅ Com final (recomendado)
private final String descricao;

// ❌ Sem final (evitar)
private String descricao;
```

**Final com Collections**:

```java
// ⚠️ Referência final, conteúdo mutável
private final List<String> acoes;

// ✅ Cópia defensiva
Permissao(List<String> acoes) {
    this.acoes = Collections.unmodifiableList(new ArrayList<>(acoes));
}
```

**Vantagens de final**:

```java
// 1. Imutabilidade
private final String nome; // não pode mudar

// 2. Thread-safety
private final int codigo; // seguro entre threads

// 3. Documentação
private final double preco; // intenção clara (não muda)

// 4. Compilador garante
private final LocalDate data; // erro se não inicializar
```

**Regra de Ouro**: Atributos de instância devem ser **sempre final** (imutável). Inicializado **apenas no construtor**. **Não pode** modificar após criação. **Cópia defensiva** para collections/arrays. Final garante **imutabilidade**, **thread-safety** e documenta **intenção**. Compilador **valida** inicialização.
