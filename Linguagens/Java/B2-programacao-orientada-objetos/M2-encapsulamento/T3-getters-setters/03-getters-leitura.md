# T3.03 - Getters Para Leitura de Atributos

## Introdução e Definição

**Getters** (ou **métodos acessores**) são métodos públicos que permitem **ler** o valor de atributos privados de uma classe. Eles são fundamentais para implementar **encapsulamento** em Java, fornecendo acesso controlado aos dados internos de um objeto.

**Definição**: Um getter é um método que:
- **Retorna** o valor de um atributo privado
- Tem visibilidade **`public`** (geralmente)
- **Não recebe parâmetros**
- Segue convenção de nomenclatura: `get` + NomeDoAtributo (ou `is` para boolean)

**Exemplo Básico**:
```java
public class Pessoa {
    private String nome;  // Atributo privado
    private int idade;

    // Getter: permite LER o nome
    public String getNome() {
        return nome;  // Retorna valor do atributo
    }

    // Getter: permite LER a idade
    public int getIdade() {
        return idade;
    }
}

// Uso:
Pessoa p = new Pessoa();
// p.nome = "João";  // ❌ ERRO: nome é privado

// ✅ Acesso via getter
String nomePessoa = p.getNome();  // Leitura controlada
int idadePessoa = p.getIdade();
```

**Por Que Usar Getters?**
- **Encapsulamento**: Atributos privados protegidos, acesso controlado
- **Flexibilidade**: Implementação interna pode mudar sem afetar código cliente
- **Validação**: Pode processar/formatar valor antes de retornar
- **Lazy Loading**: Pode calcular valor sob demanda
- **Logging/Debug**: Pode rastrear acessos
- **Read-Only**: Propriedades sem setter são imutáveis

---

## 10 Fundamentos Teóricos

### 1. Estrutura Básica de um Getter

**Sintaxe**:
```java
public TipoDeRetorno getNomeDoAtributo() {
    return nomeDoAtributo;
}
```

**Componentes**:
1. **Modificador de acesso**: `public` (geralmente)
2. **Tipo de retorno**: Mesmo tipo do atributo
3. **Nome do método**: `get` + NomeDoAtributo (primeira letra maiúscula)
4. **Parâmetros**: Nenhum (getters não recebem parâmetros)
5. **Corpo**: Retorna valor do atributo

```java
public class Produto {
    private String nome;
    private double preco;
    private int quantidade;

    // Getter para String
    public String getNome() {  // Retorna String
        return nome;
    }

    // Getter para double
    public double getPreco() {  // Retorna double
        return preco;
    }

    // Getter para int
    public int getQuantidade() {  // Retorna int
        return quantidade;
    }
}
```

---

### 2. Getters Para Tipos Primitivos

**Tipos Primitivos**: `int`, `double`, `float`, `long`, `short`, `byte`, `char`, `boolean`

```java
public class Medidas {
    private int largura;
    private double altura;
    private float peso;
    private long distancia;
    private short codigo;
    private byte nivel;
    private char categoria;
    private boolean ativo;

    public int getLargura() {
        return largura;
    }

    public double getAltura() {
        return altura;
    }

    public float getPeso() {
        return peso;
    }

    public long getDistancia() {
        return distancia;
    }

    public short getCodigo() {
        return codigo;
    }

    public byte getNivel() {
        return nivel;
    }

    public char getCategoria() {
        return categoria;
    }

    // boolean usa "is" em vez de "get"
    public boolean isAtivo() {
        return ativo;
    }
}
```

**Importante**: `boolean` usa `is` (veremos em detalhe no arquivo 06).

---

### 3. Getters Para Tipos de Referência

**Tipos de Referência**: `String`, `LocalDate`, `BigDecimal`, classes customizadas, etc.

```java
import java.time.LocalDate;
import java.math.BigDecimal;

public class Funcionario {
    private String nome;
    private LocalDate dataContratacao;
    private BigDecimal salario;
    private Endereco endereco;  // Classe customizada

    public String getNome() {
        return nome;
    }

    public LocalDate getDataContratacao() {
        return dataContratacao;
    }

    public BigDecimal getSalario() {
        return salario;
    }

    public Endereco getEndereco() {
        return endereco;
    }
}

class Endereco {
    private String rua;
    private String cidade;

    public String getRua() { return rua; }
    public String getCidade() { return cidade; }
}
```

---

### 4. Getters Para Coleções (List, Set, Map)

**Atenção**: Retornar coleções diretamente **expõe referência interna** (problema de encapsulamento).

#### Problema: Expor Referência Direta

```java
public class Pedido {
    private List<String> itens = new ArrayList<>();

    // ❌ PROBLEMA: expõe lista interna
    public List<String> getItens() {
        return itens;  // Referência direta!
    }
}

// Uso:
Pedido pedido = new Pedido();
List<String> itens = pedido.getItens();
itens.add("Item não autorizado");  // ❌ Modifica lista interna!
itens.clear();  // ❌ Apaga todos os itens!
```

#### Solução 1: Retornar Cópia (Defensive Copy)

```java
public class Pedido {
    private List<String> itens = new ArrayList<>();

    // ✅ BOM: retorna cópia
    public List<String> getItens() {
        return new ArrayList<>(itens);  // Cópia defensiva
    }
}

// Uso:
Pedido pedido = new Pedido();
List<String> itens = pedido.getItens();
itens.add("Item");  // ✅ Modifica apenas a cópia, não a lista interna
```

#### Solução 2: Retornar Lista Imutável

```java
import java.util.Collections;

public class Pedido {
    private List<String> itens = new ArrayList<>();

    // ✅ BOM: retorna lista imutável
    public List<String> getItens() {
        return Collections.unmodifiableList(itens);
    }
}

// Uso:
List<String> itens = pedido.getItens();
// itens.add("Item");  // ❌ Lança UnsupportedOperationException
```

#### Solução 3: List.copyOf() (Java 10+)

```java
public class Pedido {
    private List<String> itens = new ArrayList<>();

    // ✅ MELHOR (Java 10+): cópia imutável
    public List<String> getItens() {
        return List.copyOf(itens);  // Cópia imutável
    }
}
```

---

### 5. Getters Para Arrays

**Problema Similar**: Arrays são mutáveis e exposição direta permite modificação.

```java
public class Dados {
    private int[] valores = {1, 2, 3, 4, 5};

    // ❌ PROBLEMA: expõe array interno
    public int[] getValores() {
        return valores;  // Referência direta
    }
}

// Uso:
Dados dados = new Dados();
int[] arr = dados.getValores();
arr[0] = 999;  // ❌ Modifica array interno!
```

**Solução: Retornar Clone**

```java
public class Dados {
    private int[] valores = {1, 2, 3, 4, 5};

    // ✅ BOM: retorna clone
    public int[] getValores() {
        return valores.clone();  // Cópia do array
    }
}

// Ou
public int[] getValores() {
    return Arrays.copyOf(valores, valores.length);
}
```

---

### 6. Propriedades Read-Only (Apenas Getter, Sem Setter)

**Read-Only**: Propriedade que pode ser **lida** mas **não modificada** externamente.

```java
public class Pedido {
    private final Long id;  // final: apenas atribuído no construtor
    private LocalDateTime dataCriacao;

    public Pedido(Long id) {
        this.id = id;
        this.dataCriacao = LocalDateTime.now();
    }

    // ✅ Read-only: apenas getter
    public Long getId() {
        return id;
    }

    // Sem setter: id é imutável após construção

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    // Sem setter: dataCriacao também é imutável
}
```

**Uso**:
```java
Pedido pedido = new Pedido(1L);
Long id = pedido.getId();  // ✅ Leitura OK
// pedido.setId(2L);  // ❌ ERRO: não existe setter
```

**Benefícios**:
- **Imutabilidade**: Garante que valor não muda
- **Thread-Safety**: Objetos imutáveis são seguros em ambientes concorrentes
- **Integridade**: Evita alterações acidentais

---

### 7. Propriedades Calculadas (Getters Sem Atributo Correspondente)

**Propriedade Calculada**: Getter que **calcula** valor dinamicamente, não retorna campo armazenado.

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

    // ✅ Propriedade calculada "perimetro"
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

**Outro Exemplo**:
```java
public class Pessoa {
    private String nome;
    private String sobrenome;

    // Propriedade calculada "nomeCompleto"
    public String getNomeCompleto() {
        return nome + " " + sobrenome;
    }
}
```

---

### 8. Getters com Processamento/Formatação

Getters podem **processar** ou **formatar** valores antes de retornar.

```java
public class Usuario {
    private String nome;
    private String cpf;  // Armazenado sem formatação: "12345678900"

    public String getNome() {
        // Retorna com primeira letra maiúscula
        if (nome == null || nome.isEmpty()) {
            return "";
        }
        return nome.substring(0, 1).toUpperCase() + 
               nome.substring(1).toLowerCase();
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        // Retorna CPF formatado: "123.456.789-00"
        if (cpf == null || cpf.length() != 11) {
            return cpf;
        }
        return cpf.substring(0, 3) + "." +
               cpf.substring(3, 6) + "." +
               cpf.substring(6, 9) + "-" +
               cpf.substring(9, 11);
    }

    public void setCpf(String cpf) {
        // Armazena sem formatação
        this.cpf = cpf.replaceAll("[^0-9]", "");
    }
}
```

**Uso**:
```java
Usuario user = new Usuario();
user.setNome("JOÃO");
user.setCpf("123.456.789-00");

System.out.println(user.getNome());  // "João" (formatado)
System.out.println(user.getCpf());   // "123.456.789-00" (formatado)
```

---

### 9. Lazy Loading em Getters

**Lazy Loading**: Inicialização **atrasada** - objeto criado apenas quando necessário.

```java
public class Relatorio {
    private List<String> dados;  // Não inicializado

    // ✅ Lazy loading: cria lista apenas quando acessada
    public List<String> getDados() {
        if (dados == null) {
            dados = new ArrayList<>();
            // Carrega dados pesados (ex: do banco de dados)
            carregarDados();
        }
        return dados;
    }

    private void carregarDados() {
        // Simulação de carregamento pesado
        dados.add("Dado 1");
        dados.add("Dado 2");
        // ...
    }
}
```

**Benefícios**:
- **Performance**: Evita carregamento desnecessário
- **Economia de memória**: Cria apenas se usado

**Atenção**: Em ambientes multi-thread, use **sincronização** para evitar race conditions.

```java
public class RelatorioThreadSafe {
    private volatile List<String> dados;

    public List<String> getDados() {
        if (dados == null) {
            synchronized (this) {
                if (dados == null) {  // Double-checked locking
                    dados = new ArrayList<>();
                    carregarDados();
                }
            }
        }
        return dados;
    }

    private void carregarDados() {
        // ...
    }
}
```

---

### 10. Getters e Null Safety

**Problema**: Getters podem retornar `null`, causando `NullPointerException` em código cliente.

#### Abordagem 1: Retornar Valor Padrão

```java
public class Pessoa {
    private String nome;
    private List<String> hobbies;

    // ✅ Nunca retorna null
    public String getNome() {
        return nome != null ? nome : "Sem nome";
    }

    public List<String> getHobbies() {
        return hobbies != null ? hobbies : Collections.emptyList();
    }
}
```

#### Abordagem 2: Usar Optional (Java 8+)

```java
import java.util.Optional;

public class Pessoa {
    private String email;

    // ✅ Retorna Optional em vez de null
    public Optional<String> getEmail() {
        return Optional.ofNullable(email);
    }
}

// Uso:
Pessoa p = new Pessoa();
p.getEmail().ifPresent(email -> {
    System.out.println("Email: " + email);
});

String email = p.getEmail().orElse("email@padrao.com");
```

#### Abordagem 3: Anotações (@NonNull, @Nullable)

```java
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class Pessoa {
    private String nome;
    private String apelido;

    @Nonnull  // Indica que nunca retorna null
    public String getNome() {
        return nome != null ? nome : "";
    }

    @Nullable  // Indica que pode retornar null
    public String getApelido() {
        return apelido;
    }
}
```

---

## Aplicabilidade

### Quando Criar Getters

**Sempre crie getters quando**:
- Atributos são **privados** e precisam ser lidos externamente
- Classe é **JavaBean** (para interoperabilidade com frameworks)
- Propriedade faz parte da **API pública** da classe
- **DTOs** (Data Transfer Objects) para transferência de dados

### Quando NÃO Criar Getters

**Evite getters quando**:
- Atributo é **implementação interna** que não deve ser exposto
- Expor valor **viola encapsulamento** ou segurança
- **Domain models** com lógica de negócio (prefira métodos de negócio)

```java
public class ContaBancaria {
    private double saldo;  // Não expor getter direto!

    // ❌ EVITAR: expor saldo diretamente
    // public double getSaldo() { return saldo; }

    // ✅ MELHOR: método de negócio
    public String consultarSaldo() {
        return String.format("Saldo disponível: R$ %.2f", saldo);
    }

    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
        }
    }

    public boolean sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo -= valor;
            return true;
        }
        return false;
    }
}
```

---

## Armadilhas Comuns

### 1. Expor Coleções Mutáveis Sem Proteção

```java
// ❌ RUIM
public List<String> getItens() {
    return itens;  // Expõe lista interna
}

// ✅ BOM
public List<String> getItens() {
    return List.copyOf(itens);  // Cópia imutável
}
```

### 2. Getters Com Lógica Pesada

```java
// ❌ EVITAR: lógica pesada em getter
public List<Usuario> getUsuariosAtivos() {
    return usuarioRepository.findAll()  // Consulta banco!
        .stream()
        .filter(Usuario::isAtivo)
        .collect(Collectors.toList());
}

// ✅ MELHOR: método descritivo
public List<Usuario> carregarUsuariosAtivos() {
    // Nome deixa claro que é operação pesada
    return usuarioRepository.findByAtivoTrue();
}
```

### 3. Getters Retornando Null Inesperadamente

```java
// ❌ RUIM: pode causar NullPointerException
public String getNome() {
    return nome;  // Pode ser null
}

// ✅ BOM: garante valor não-null
public String getNome() {
    return nome != null ? nome : "";
}
```

---

## Boas Práticas

### 1. Getters Devem Ser Leves (Não Devem Fazer Processamento Pesado)

```java
// ✅ BOM: getter simples
public String getNome() {
    return nome;
}

// ❌ EVITAR: processamento pesado
public List<Pedido> getPedidos() {
    return pedidoRepository.buscarTodosPedidos();  // Consulta banco!
}
```

### 2. Use Defensive Copy Para Objetos Mutáveis

```java
public Date getDataNascimento() {
    return dataNascimento != null ? 
        new Date(dataNascimento.getTime()) : null;  // Cópia
}
```

### 3. Retorne Coleções Imutáveis

```java
public List<String> getTags() {
    return List.copyOf(tags);  // Java 10+
}
```

### 4. Documente Comportamento Não-Óbvio

```java
/**
 * Retorna área do retângulo (largura × altura).
 * Calculado dinamicamente, não armazenado.
 * 
 * @return área em metros quadrados
 */
public double getArea() {
    return largura * altura;
}
```

### 5. Considere Optional Para Valores Opcionais

```java
public Optional<String> getEmail() {
    return Optional.ofNullable(email);
}
```

---

## Resumo Executivo

**Getters** permitem **leitura controlada** de atributos privados:

**Estrutura Básica**:
```java
public TipoRetorno getNomeAtributo() {
    return nomeAtributo;
}
```

**Tipos de Getters**:
- **Simples**: Retorna valor direto
- **Calculados**: Retorna valor computado dinamicamente
- **Formatados**: Processa valor antes de retornar
- **Lazy**: Inicializa valor sob demanda
- **Read-Only**: Sem setter correspondente

**Cuidados com Mutabilidade**:
- **Coleções**: Retorne cópias ou versões imutáveis
- **Arrays**: Retorne clones
- **Datas**: Retorne cópias (Date) ou use LocalDate (imutável)

**Boas Práticas**:
- Getters devem ser **leves** (sem lógica pesada)
- Use **defensive copy** para objetos mutáveis
- Retorne **valores padrão** ou **Optional** em vez de null
- **Documente** comportamento não-óbvio
- Considere **read-only** para propriedades imutáveis

**Armadilhas**:
- Expor coleções mutáveis ❌
- Lógica pesada em getters ❌
- Retornar null sem documentar ❌

**Regra de Ouro**: Getters devem fornecer **acesso controlado e seguro** aos atributos, protegendo encapsulamento e integridade dos dados.
