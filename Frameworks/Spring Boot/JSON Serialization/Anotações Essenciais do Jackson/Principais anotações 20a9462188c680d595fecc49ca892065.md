# Principais anotações

| **Anotação** | **Finalidade** |
| --- | --- |
| `@JsonProperty` | Define o nome da propriedade JSON associada ao campo/método e controla acesso (read-only, write-only, etc.) |
| `@JsonIgnore` | Exclui totalmente o campo ou método do processo de serialização e/ou desserialização |
| `@JsonInclude` | Controla quais valores serão incluídos no JSON de saída (ex.: omitir campos nulos ou vazios) |
| `@JsonFormat` | Especifica o formato de serialização (datas, números, strings) |
| `@JsonCreator` + `@JsonProperty` | Indica construtor ou fábrica para desserialização, especialmente em classes imutáveis |
| `@JsonAlias` | Permite múltiplos nomes JSON ser mapeados para um único campo Java |
| `@JsonIgnoreProperties` | Ignora múltiplas propriedades (por nome) durante serialização/desserialização |
| `@JsonAnySetter` / `@JsonAnyGetter` | Manipula propriedades dinâmicas não mapeadas para atributos fixos, armazenando-as em um `Map<String, Object>` |
| `@JsonManagedReference` / `@JsonBackReference` | Resolve referências circulares em relacionamentos pai-filho (evita loops infinitos) |
| `@JsonIdentityInfo` | Alternativa a Managed/Back Reference, usando identificadores únicos para evitar duplicação de objetos |

---

## Exemplos de Código para Cada Anotação

### 1. `@JsonProperty`

```java
public class Pessoa {

    @JsonProperty("id_pessoa")
    private Long id;

    @JsonProperty(value = "nome_completo", access = JsonProperty.Access.READ_ONLY)
    private String nome;

    // GETTERS e SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    // Sem setter para 'nome' pois é somente leitura (READ_ONLY)
}

```

- `@JsonProperty("id_pessoa")` → no JSON, o campo `id` será `"id_pessoa"`.
- `access = JsonProperty.Access.READ_ONLY` → `nome` só será incluído na serialização, não aceito na desserialização.

---

### 2. `@JsonIgnore`

```java
public class Usuario {
    private String usuario;

    @JsonIgnore
    private String senha;

    // GETTERS e SETTERS
    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}

```

- `@JsonIgnore` em `senha` faz com que, ao converter para JSON, o campo `"senha"` não apareça.
- Na desserialização, se o JSON trouxer `"senha"`, Jackson simplesmente ignora.

---

### 3. `@JsonInclude`

```java
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Cliente {

    private String nome;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String endereco;

    private List<String> telefones;

    // GETTERS e SETTERS
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public List<String> getTelefones() {
        return telefones;
    }

    public void setTelefones(List<String> telefones) {
        this.telefones = telefones;
    }
}

```

- `@JsonInclude(NON_EMPTY)` na classe → omite campos que sejam nulos **ou** "vazios" (listas vazias, strings vazias).
- `@JsonInclude(NON_NULL)` em `endereco` → ainda que lista `telefones` seja vazia, `endereco` só soma se não for `null`.

---

### 4. `@JsonFormat`

```java
public class Evento {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime dataHoraInicio;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate dataFim;

    // GETTERS e SETTERS
    public LocalDateTime getDataHoraInicio() {
        return dataHoraInicio;
    }

    public void setDataHoraInicio(LocalDateTime dataHoraInicio) {
        this.dataHoraInicio = dataHoraInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }
}

```

- Ao serializar, `dataHoraInicio` torna-se algo como `"25/12/2025 14:30:00"`.
- `shape = STRING` força representação legível, não timestamp numérico.

---

### 5. `@JsonCreator` + `@JsonProperty` em Construtores (Classes Imutáveis)

```java
public class Endereco {
    private final String rua;
    private final String cidade;
    private final String cep;

    @JsonCreator
    public Endereco(
        @JsonProperty("rua") String rua,
        @JsonProperty("cidade") String cidade,
        @JsonProperty("cep") String cep
    ) {
        this.rua = rua;
        this.cidade = cidade;
        this.cep = cep;
    }

    // GETTERS
    public String getRua() {
        return rua;
    }

    public String getCidade() {
        return cidade;
    }

    public String getCep() {
        return cep;
    }
}

```

- `@JsonCreator` indica que Jackson deve usar esse construtor para criar instâncias.
- Cada parâmetro recebe `@JsonProperty("nome_campo")` para fazer o mapeamento correto do JSON.

---

### 6. `@JsonAlias`

```java
public class Produto {

    @JsonAlias({ "preco_unitario", "valorUnitario", "price" })
    private BigDecimal preco;

    // GETTERS e SETTERS
    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }
}

```

- Se o JSON vier com `"preco_unitario"`, `"valorUnitario"` ou `"price"`, todos serão desserializados em `preco`.

---

### 7. `@JsonIgnoreProperties`

```java
@JsonIgnoreProperties({ "senha", "internoId" })
public class Conta {

    private String usuario;
    private String senha;
    private String internoId;
    private String email;

    // GETTERS e SETTERS
    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getInternoId() {
        return internoId;
    }

    public void setInternoId(String internoId) {
        this.internoId = internoId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

```

- `@JsonIgnoreProperties({"senha","internoId"})` → tanto na serialização quanto na desserialização, Jackson ignora esses campos.

---

### 8. `@JsonAnySetter` e `@JsonAnyGetter`

```java
public class PropriedadesExtras {

    private String nome;
    private Map<String, Object> extras = new HashMap<>();

    // GETTER e SETTER de 'nome'
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    @JsonAnySetter
    public void adicionarPropriedade(String chave, Object valor) {
        extras.put(chave, valor);
    }

    @JsonAnyGetter
    public Map<String, Object> getExtras() {
        return extras;
    }
}

```

- Se o JSON contiver campos além de `"nome"`, cada par chave-valor será inserido no `Map<String, Object> extras`.
- Ao serializar o objeto, as entradas do `extras` são incluídas como propriedades de nível superior no JSON.

---

### 9. `@JsonManagedReference` e `@JsonBackReference`

```java
public class Pai {
    private Long id;
    private String nome;

    @JsonManagedReference
    private List<Filho> filhos = new ArrayList<>();

    // GETTERS e SETTERS
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public List<Filho> getFilhos() {
        return filhos;
    }
    public void setFilhos(List<Filho> filhos) {
        this.filhos = filhos;
    }
}

public class Filho {
    private Long id;
    private String nome;

    @JsonBackReference
    private Pai pai;

    // GETTERS e SETTERS
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public Pai getPai() {
        return pai;
    }
    public void setPai(Pai pai) {
        this.pai = pai;
    }
}

```

- `@JsonManagedReference` no lado “pai” (serializado normalmente).
- `@JsonBackReference` no lado “filho” (ignora este campo para evitar loop).

---

### 10. `@JsonIdentityInfo`

```java
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Categoria {
    private Long id;
    private String nome;
    private List<Produto> produtos;

    // GETTERS e SETTERS
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public List<Produto> getProdutos() {
        return produtos;
    }
    public void setProdutos(List<Produto> produtos) {
        this.produtos = produtos;
    }
}

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Produto {
    private Long id;
    private String descricao;
    private Categoria categoria;

    // GETTERS e SETTERS
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public Categoria getCategoria() {
        return categoria;
    }
    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}

```

- Ao serializar, o Jackson vai incluir, na primeira aparição, o objeto completo.
- Em referências subsequentes ao mesmo objeto, usa apenas o valor de `id`, evitando duplicação ou loop infinito.

---

**Observação:**

Para cada anotação, é recomendável testar a serialização e desserialização com casos reais (por exemplo, via testes unitários) para assegurar que o JSON gerado e consumido corresponde exatamente ao contrato da sua API.