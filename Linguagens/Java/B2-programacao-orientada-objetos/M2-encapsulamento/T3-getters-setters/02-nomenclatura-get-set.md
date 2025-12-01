# T3.02 - Nomenclatura de Getters e Setters (get/set + NomeDoAtributo)

## Introdução e Definição

A **convenção de nomenclatura** para getters e setters é um padrão fundamental do Java que define **como nomear métodos** de acesso a atributos privados. Esta convenção é reconhecida por:

- **Frameworks**: Spring, Hibernate, Jackson, etc.
- **IDEs**: Eclipse, IntelliJ IDEA, NetBeans
- **Bibliotecas de reflexão**: Introspection API
- **Ferramentas de análise**: SonarQube, Checkstyle

**Padrão Básico**:
```
Getter: get + NomeDoAtributo (primeira letra maiúscula)
Setter: set + NomeDoAtributo (primeira letra maiúscula)
```

**Exemplo**:
```java
public class Pessoa {
    private String nome;           // atributo em camelCase
    private int idade;
    private String enderecoCompleto;

    // Getter: get + Nome (capitaliza "nome")
    public String getNome() {
        return nome;
    }

    // Setter: set + Nome
    public void setNome(String nome) {
        this.nome = nome;
    }

    // Getter: get + Idade
    public int getIdade() {
        return idade;
    }

    // Setter: set + Idade
    public void setIdade(int idade) {
        this.idade = idade;
    }

    // Getter: get + EnderecoCompleto (capitaliza primeira letra)
    public String getEnderecoCompleto() {
        return enderecoCompleto;
    }

    public void setEnderecoCompleto(String enderecoCompleto) {
        this.enderecoCompleto = enderecoCompleto;
    }
}
```

**Por Que Seguir?**
- **Interoperabilidade**: Frameworks dependem dessa convenção para descobrir propriedades automaticamente
- **Consistência**: Código previsível e fácil de entender
- **Ferramentas**: IDEs geram código correto automaticamente
- **Manutenção**: Desenvolvedores esperam esse padrão

---

## 10 Fundamentos Teóricos

### 1. Regra Básica: get/set + NomeDoAtributo (Pascal Case)

**Algoritmo de Conversão**:
1. Pegue o nome do atributo (camelCase)
2. Capitalize a primeira letra
3. Prefixe com `get` (leitura) ou `set` (escrita)

```java
public class Exemplo {
    // Atributo         → Getter              → Setter
    private String nome;
    //                 → getNome()           → setNome(String)

    private int idade;
    //                 → getIdade()          → setIdade(int)

    private double salario;
    //                 → getSalario()        → setSalario(double)

    private String emailPrincipal;
    //                 → getEmailPrincipal() → setEmailPrincipal(String)

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public int getIdade() { return idade; }
    public void setIdade(int idade) { this.idade = idade; }

    public double getSalario() { return salario; }
    public void setSalario(double salario) { this.salario = salario; }

    public String getEmailPrincipal() { return emailPrincipal; }
    public void setEmailPrincipal(String emailPrincipal) {
        this.emailPrincipal = emailPrincipal;
    }
}
```

---

### 2. Nomenclatura Para Atributos de Uma Letra

**Regra**: Capitalize a letra única.

```java
public class Ponto {
    private int x;
    private int y;
    private int z;

    // ✅ CORRETO: getX (capitaliza "x" → "X")
    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getZ() {
        return z;
    }

    public void setZ(int z) {
        this.z = z;
    }

    // ❌ INCORRETO
    // public int getx() { return x; }  // Não capitaliza
    // public void setx(int x) { this.x = x; }
}
```

---

### 3. Nomenclatura Para Atributos com Siglas

**Regra Controversa**: Duas abordagens principais

#### Abordagem 1: Tratar Sigla Como Palavra (Recomendado)

```java
public class Documento {
    private String url;      // Trata "url" como palavra
    private String cpf;
    private String xml;

    // ✅ RECOMENDADO: Capitaliza apenas primeira letra
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getXml() {
        return xml;
    }

    public void setXml(String xml) {
        this.xml = xml;
    }
}
```

#### Abordagem 2: Manter Sigla em Maiúsculas

```java
public class Documento {
    private String URL;      // Sigla toda maiúscula
    private String CPF;

    // Alternativa: Mantém sigla maiúscula
    public String getURL() {
        return URL;
    }

    public void setURL(String URL) {
        this.URL = URL;
    }

    public String getCPF() {
        return CPF;
    }

    public void setCPF(String CPF) {
        this.CPF = CPF;
    }
}
```

**Recomendação**: **Abordagem 1** (sigla como palavra) para consistência com convenção JavaBeans e melhor legibilidade.

---

### 4. Nomenclatura Para Boolean (Exceção: is)

**Regra Especial**: Atributos `boolean` usam **`is`** em vez de `get` no getter.

```java
public class Usuario {
    private boolean ativo;
    private boolean admin;
    private boolean verificado;

    // ✅ CORRETO: isAtivo (usa "is" para boolean)
    public boolean isAtivo() {
        return ativo;
    }

    // ✅ Setter usa "set" normalmente
    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean isVerificado() {
        return verificado;
    }

    public void setVerificado(boolean verificado) {
        this.verificado = verificado;
    }

    // ❌ INCORRETO: não usar "get" para boolean
    // public boolean getAtivo() { return ativo; }
}
```

**Exceção**: Se atributo boolean já começa com "is", **não duplique**:

```java
public class Conta {
    private boolean isAtiva;  // ❌ EVITAR: nome ruim (redundante)

    // ❌ RUIM: duplica "is"
    public boolean isIsAtiva() {  // isIsAtiva() - confuso!
        return isAtiva;
    }

    // ✅ MELHOR: renomear atributo
    private boolean ativa;  // Remove "is" do nome

    public boolean isAtiva() {
        return ativa;
    }
}
```

---

### 5. Nomenclatura Para Boolean Wrapper (Boolean)

**Regra**: `Boolean` (wrapper) pode usar `get` ou `is`.

```java
public class Configuracao {
    private Boolean habilitado;  // Boolean (wrapper), não boolean

    // ✅ OPÇÃO 1: is (preferido)
    public Boolean isHabilitado() {
        return habilitado;
    }

    // ✅ OPÇÃO 2: get (também aceito)
    public Boolean getHabilitado() {
        return habilitado;
    }

    public void setHabilitado(Boolean habilitado) {
        this.habilitado = habilitado;
    }
}
```

**Preferência**: Use `is` para consistência com `boolean` primitivo.

---

### 6. Atributos Privados vs Nome de Método

**Importante**: Nome do **método** segue convenção, não necessariamente o nome do **atributo**.

```java
public class Produto {
    // Atributo com nome técnico/interno
    private String skuInterno;
    private double precoBase;

    // ✅ Métodos podem usar nomes mais descritivos
    public String getCodigo() {  // Mais claro que "getSkuInterno"
        return skuInterno;
    }

    public void setCodigo(String codigo) {
        this.skuInterno = codigo;
    }

    public double getPreco() {  // Simplificado
        return precoBase;
    }

    public void setPreco(double preco) {
        this.precoBase = preco;
    }
}
```

**Benefício**: Você pode **refatorar nomes de atributos internos** sem quebrar API pública.

---

### 7. Propriedades Calculadas (Sem Atributo Correspondente)

**Getters** podem retornar valores **calculados**, não necessariamente armazenados.

```java
public class Retangulo {
    private double largura;
    private double altura;

    public double getLargura() {
        return largura;
    }

    public void setLargura(double largura) {
        this.largura = largura;
    }

    public double getAltura() {
        return altura;
    }

    public void setAltura(double altura) {
        this.altura = altura;
    }

    // ✅ Propriedade calculada "area" (sem atributo correspondente)
    public double getArea() {
        return largura * altura;  // Calculado dinamicamente
    }

    // Sem setter para area (read-only, calculada)

    // ✅ Outra propriedade calculada
    public double getPerimetro() {
        return 2 * (largura + altura);
    }
}
```

**Uso**:
```java
Retangulo r = new Retangulo();
r.setLargura(5);
r.setAltura(10);

System.out.println(r.getArea());      // 50 (calculado)
System.out.println(r.getPerimetro()); // 30 (calculado)
```

---

### 8. Frameworks e Convenção de Nomenclatura

**Frameworks usam reflexão** para descobrir propriedades pela convenção de nomenclatura.

#### Jackson (JSON Serialization)

```java
public class Usuario {
    private String nome;
    private int idade;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public int getIdade() { return idade; }
    public void setIdade(int idade) { this.idade = idade; }
}

// Jackson serializa via getters
ObjectMapper mapper = new ObjectMapper();
Usuario user = new Usuario();
user.setNome("João");
user.setIdade(30);

String json = mapper.writeValueAsString(user);
// {"nome":"João","idade":30}

// Jackson deserializa via setters
Usuario userFromJson = mapper.readValue(json, Usuario.class);
System.out.println(userFromJson.getNome());  // "João"
```

#### Spring (Dependency Injection)

```java
public class UserService {
    private UserRepository repository;

    // Spring reconhece setter e injeta dependência
    public void setRepository(UserRepository repository) {
        this.repository = repository;
    }

    public UserRepository getRepository() {
        return repository;
    }
}
```

#### Hibernate (ORM)

```java
@Entity
public class Produto {
    @Id
    private Long id;

    private String nome;
    private double preco;

    // Hibernate usa getters/setters para mapear colunas
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public double getPreco() { return preco; }
    public void setPreco(double preco) { this.preco = preco; }
}
```

**Se não seguir a convenção**, frameworks não reconhecem propriedades automaticamente.

---

### 9. Introspection API e Descoberta de Propriedades

**Java Introspection API** descobre propriedades analisando métodos que seguem convenção.

```java
import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;

public class IntrospectionExample {
    public static void main(String[] args) throws Exception {
        BeanInfo info = Introspector.getBeanInfo(Pessoa.class);

        System.out.println("Propriedades descobertas:");
        for (PropertyDescriptor pd : info.getPropertyDescriptors()) {
            // Ignora propriedade "class" herdada de Object
            if (!"class".equals(pd.getName())) {
                System.out.println("- " + pd.getName());
                System.out.println("  Tipo: " + pd.getPropertyType().getSimpleName());
                System.out.println("  Getter: " + pd.getReadMethod().getName());
                if (pd.getWriteMethod() != null) {
                    System.out.println("  Setter: " + pd.getWriteMethod().getName());
                }
            }
        }
    }
}
```

**Saída** (para classe Pessoa com nome, idade, enderecoCompleto):
```
Propriedades descobertas:
- enderecoCompleto
  Tipo: String
  Getter: getEnderecoCompleto
  Setter: setEnderecoCompleto
- idade
  Tipo: int
  Getter: getIdade
  Setter: setIdade
- nome
  Tipo: String
  Getter: getNome
  Setter: setNome
```

**Algoritmo de Descoberta**:
1. Procura métodos públicos que começam com `get`, `set`, ou `is`
2. Remove prefixo (`get`, `set`, `is`)
3. Decapitaliza primeira letra → nome da propriedade

---

### 10. Violações Comuns da Convenção

**Erros Comuns** que quebram convenção:

```java
public class ExemploRuim {
    private String nome;
    private int idade;
    private boolean ativo;

    // ❌ ERRO 1: Não capitaliza
    public String getnome() {
        return nome;
    }

    // ❌ ERRO 2: Verbo diferente de get/set
    public String obterNome() {
        return nome;
    }

    public void alterarNome(String nome) {
        this.nome = nome;
    }

    // ❌ ERRO 3: Nome não corresponde ao padrão
    public int retornaIdade() {
        return idade;
    }

    // ❌ ERRO 4: Boolean usando "get" em vez de "is"
    public boolean getAtivo() {
        return ativo;
    }

    // ❌ ERRO 5: Setter retorna valor
    public String setNome(String nome) {  // Deve ser void
        this.nome = nome;
        return nome;
    }

    // ❌ ERRO 6: Getter com parâmetros
    public String getNome(boolean maiuscula) {  // Getter não deve ter parâmetros
        return maiuscula ? nome.toUpperCase() : nome;
    }
}
```

**Correção**:
```java
public class ExemploCorreto {
    private String nome;
    private int idade;
    private boolean ativo;

    // ✅ CORRETO
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public boolean isAtivo() {  // "is" para boolean
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    // Se precisar de método customizado, use nome diferente
    public String getNomeMaiusculo() {  // Nome descritivo diferente
        return nome != null ? nome.toUpperCase() : null;
    }
}
```

---

## Aplicabilidade

### Quando Seguir Rigorosamente a Convenção

**Obrigatório quando**:
- Usando **frameworks** (Spring, Hibernate, Jackson)
- Criando **JavaBeans** para interoperabilidade
- Trabalhando com **ferramentas de UI** (JavaFX, Swing)
- Código será usado por **bibliotecas de reflexão**
- **DTOs** para APIs REST

### Quando Há Flexibilidade

**Pode variar quando**:
- **APIs públicas** com nomes mais descritivos
- **Métodos auxiliares** que não são propriedades JavaBeans
- **Domain models** com lógica de negócio (além de simples getters/setters)

```java
public class ContaBancaria {
    private double saldo;

    // ✅ Getter padrão
    public double getSaldo() {
        return saldo;
    }

    // ✅ Métodos de domínio com nomes descritivos (não são getters/setters)
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;
        }
    }

    public void sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            this.saldo -= valor;
        }
    }

    public boolean podeSacar(double valor) {
        return valor > 0 && valor <= saldo;
    }
}
```

---

## Armadilhas Comuns

### 1. Não Capitalizar Primeira Letra

```java
// ❌ ERRADO
public String getnome() { return nome; }

// ✅ CORRETO
public String getNome() { return nome; }
```

### 2. Boolean Usando "get"

```java
// ❌ ERRADO
public boolean getAtivo() { return ativo; }

// ✅ CORRETO
public boolean isAtivo() { return ativo; }
```

### 3. Setters Retornando Valores

```java
// ❌ ERRADO
public String setNome(String nome) {
    this.nome = nome;
    return nome;
}

// ✅ CORRETO
public void setNome(String nome) {
    this.nome = nome;
}
```

### 4. Getters Com Parâmetros

```java
// ❌ ERRADO (não é um getter JavaBeans válido)
public String getNome(boolean maiuscula) {
    return maiuscula ? nome.toUpperCase() : nome;
}

// ✅ CORRETO (getter sem parâmetros + método auxiliar)
public String getNome() {
    return nome;
}

public String getNomeMaiusculo() {
    return nome != null ? nome.toUpperCase() : null;
}
```

---

## Boas Práticas

### 1. Use IDEs Para Gerar Código

**Eclipse**: Right-click → Source → Generate Getters and Setters

**IntelliJ IDEA**: Alt+Insert → Getters and Setters

**Benefícios**:
- Garante convenção correta
- Economiza tempo
- Evita erros de digitação

### 2. Siga Convenção Para Boolean

```java
// ✅ BOM
private boolean ativo;
public boolean isAtivo() { return ativo; }
public void setAtivo(boolean ativo) { this.ativo = ativo; }
```

### 3. Propriedades Read-Only: Apenas Getter

```java
public class Pedido {
    private final Long id;
    private LocalDateTime dataCriacao = LocalDateTime.now();

    public Pedido(Long id) {
        this.id = id;
    }

    // ✅ Read-only: apenas getter
    public Long getId() {
        return id;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }
}
```

### 4. Nomes Descritivos Para Propriedades Calculadas

```java
public class Pedido {
    private List<Item> itens = new ArrayList<>();

    // ✅ Nome descritivo
    public double getValorTotal() {
        return itens.stream()
            .mapToDouble(Item::getPreco)
            .sum();
    }

    public int getQuantidadeItens() {
        return itens.size();
    }
}
```

### 5. Consistência em Siglas

```java
// ✅ Escolha uma abordagem e seja consistente
public class Documento {
    private String url;
    private String xml;

    public String getUrl() { return url; }
    public String getXml() { return xml; }
}
```

---

## Resumo Executivo

**Convenção de Nomenclatura**:
- **Getter**: `get` + NomeDoAtributo (primeira letra maiúscula)
- **Setter**: `set` + NomeDoAtributo (primeira letra maiúscula)
- **Boolean Getter**: `is` + NomeDoAtributo (primeira letra maiúscula)
- **Boolean Setter**: `set` + NomeDoAtributo (normal)

**Exemplos**:
```java
private String nome;           → getNome() / setNome(String)
private int idade;             → getIdade() / setIdade(int)
private boolean ativo;         → isAtivo() / setAtivo(boolean)
private String emailPrincipal; → getEmailPrincipal() / setEmailPrincipal(String)
```

**Regras Importantes**:
- Capitalize **primeira letra** do nome da propriedade
- `boolean` usa `is`, não `get`
- `Boolean` (wrapper) pode usar `is` ou `get`
- Setters retornam `void`
- Getters sem parâmetros

**Por Que Seguir**:
- **Frameworks** (Spring, Hibernate, Jackson) dependem dessa convenção
- **Introspection API** descobre propriedades automaticamente
- **IDEs** geram código correto
- **Consistência** e legibilidade

**Armadilhas**:
- Não capitalizar: `getnome()` ❌
- Boolean com `get`: `getAtivo()` ❌
- Setter retornando valor: `String setNome()` ❌
- Getter com parâmetros: `getNome(boolean)` ❌

**Regra de Ouro**: **Siga a convenção rigorosamente** quando criar JavaBeans para interoperabilidade com frameworks. Use IDEs para gerar código automaticamente.
