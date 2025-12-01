# T12.07 - Não Usar Enum para Grandes Conjuntos Dinâmicos

## Introdução

**Enum**: conjunto **fixo** e **pequeno** de constantes.

```java
// ❌ Enum para grande conjunto dinâmico
public enum Usuario {
    JOAO,
    MARIA,
    PEDRO,
    ANA,
    CARLOS,
    // ... milhares de usuários ⚠️
}

// ⚠️ Problema: enum é fixo, usuários mudam

// ✅ Classe para conjunto dinâmico
public class Usuario {
    private final String nome;
    
    public Usuario(String nome) {
        this.nome = nome;
    }
}

// ✅ Lista dinâmica
List<Usuario> usuarios = new ArrayList<>();
usuarios.add(new Usuario("João"));
usuarios.add(new Usuario("Maria"));
```

**Enum** para conjuntos fixos. **Classe** para conjuntos dinâmicos.

---

## Fundamentos

### 1. Enum para Banco de Dados

```java
// ❌ Enum para dados do banco (dinâmico)
public enum Produto {
    LAPTOP,
    MOUSE,
    TECLADO
    // ⚠️ Adicionar produto exige recompilar
}

// ⚠️ Problema: produtos mudam frequentemente

// ✅ Classe para dados dinâmicos
public class Produto {
    private Long id;
    private String nome;
    private double preco;
    
    // Construtores, getters, setters
}

// ✅ Carregar do banco
List<Produto> produtos = produtoRepository.findAll();
```

### 2. Enum para Configuração

```java
// ❌ Enum para países (muitos)
public enum Pais {
    BRASIL,
    ARGENTINA,
    EUA,
    CANADA,
    // ... ~200 países ⚠️ Muito grande
}

// ✅ Classe com constantes importantes
public class Pais {
    public static final Pais BRASIL = new Pais("BR", "Brasil");
    public static final Pais EUA = new Pais("US", "Estados Unidos");
    
    private final String codigo;
    private final String nome;
    
    public Pais(String codigo, String nome) {
        this.codigo = codigo;
        this.nome = nome;
    }
    
    // Getters
}

// ✅ Carregar todos do banco ou arquivo
List<Pais> paises = paisRepository.findAll();
```

### 3. Tamanho Razoável para Enum

```java
// ✅ Enum OK: conjunto pequeno e fixo
public enum DiaSemana {
    DOMINGO,
    SEGUNDA,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO
} // 7 constantes (OK)

// ✅ Enum OK: status limitados
public enum StatusPedido {
    NOVO,
    APROVADO,
    ENVIADO,
    ENTREGUE,
    CANCELADO
} // 5 constantes (OK)

// ⚠️ Enum muito grande (evitar)
public enum CodigoPostal {
    CEP_01000000,
    CEP_01000001,
    CEP_01000002,
    // ... milhares de CEPs ⚠️ Muito grande
}
```

### 4. Enum vs Classe

```java
// ❌ Enum para categorias dinâmicas
public enum Categoria {
    ELETRONICOS,
    ROUPAS,
    ALIMENTOS
    // ⚠️ Adicionar categoria exige recompilar
}

// ✅ Classe para categorias dinâmicas
public class Categoria {
    private Long id;
    private String nome;
    private String descricao;
    
    public Categoria(String nome) {
        this.nome = nome;
    }
}

// ✅ Adicionar categoria em runtime
categoriaRepository.save(new Categoria("Livros"));
```

### 5. Performance com Muitas Constantes

```java
// ⚠️ Enum com muitas constantes (lento)
public enum CodigoErro {
    E0001, E0002, E0003, // ...
    E9999 // ⚠️ 9999 constantes
}

// ⚠️ values() cria array novo toda vez
for (CodigoErro codigo : CodigoErro.values()) {
    // ⚠️ Lento com muitas constantes
}

// ✅ Classe com constantes estáticas principais
public class CodigoErro {
    public static final CodigoErro ERRO_CONEXAO = new CodigoErro("E001");
    public static final CodigoErro ERRO_TIMEOUT = new CodigoErro("E002");
    
    private final String codigo;
    
    public CodigoErro(String codigo) {
        this.codigo = codigo;
    }
}
```

### 6. Enum para Dados Temporais

```java
// ❌ Enum para anos (dinâmico)
public enum Ano {
    ANO_2020,
    ANO_2021,
    ANO_2022,
    ANO_2023
    // ⚠️ Todo ano precisa adicionar constante
}

// ✅ Usar int ou Year
int ano = 2025;
// ou
java.time.Year ano = java.time.Year.of(2025);
```

### 7. Enum com Dados Externos

```java
// ❌ Enum para dados de API
public enum Moeda {
    BRL,
    USD,
    EUR
    // ⚠️ Se API adicionar moeda, precisa recompilar
}

// ✅ Classe para dados de API
public class Moeda {
    private String codigo;
    private String nome;
    private double taxa;
    
    // Carregar de API
    public static List<Moeda> buscarMoedas() {
        // Chamada HTTP
        return moedas;
    }
}
```

### 8. Enum para Permissões

```java
// ⚠️ Enum para permissões (pode crescer)
public enum Permissao {
    LER,
    ESCREVER,
    DELETAR,
    EXECUTAR
    // OK se permissões são fixas
}

// ✅ Se permissões são dinâmicas
public class Permissao {
    private Long id;
    private String nome;
    private String descricao;
    
    // Carregar do banco
}

// ✅ Mas se são fixas, enum é OK
public enum PermissaoSistema {
    ADMIN,
    USER,
    GUEST
} // Fixas (OK)
```

### 9. Limite Recomendado

```java
// ✅ Enum pequeno (até ~50 constantes)
public enum Estado {
    SP, RJ, MG, // ... 27 estados
} // OK: conjunto fixo e limitado

// ⚠️ Enum muito grande (> 100 constantes)
public enum Cidade {
    SAO_PAULO,
    RIO_DE_JANEIRO,
    // ... 5570 cidades no Brasil ⚠️ Muito grande
}

// ✅ Classe para grande conjunto
public class Cidade {
    private Long id;
    private String nome;
    private String estado;
}
```

### 10. Quando Usar Enum

```java
// ✅ Enum: conjunto fixo e pequeno
public enum Status {
    ATIVO,
    INATIVO,
    BLOQUEADO
}

public enum TipoPagamento {
    DINHEIRO,
    CARTAO_CREDITO,
    CARTAO_DEBITO,
    PIX
}

public enum Prioridade {
    BAIXA,
    MEDIA,
    ALTA,
    URGENTE
}

// ✅ Critérios:
// - Conjunto fixo (não muda frequentemente)
// - Pequeno (< 50 constantes)
// - Conhecido em tempo de compilação
// - Mutuamente exclusivo
```

---

## Aplicabilidade

**Enum** para:
- Conjunto fixo e pequeno
- Valores conhecidos em compilação
- Status, tipos, prioridades
- Dias da semana, meses

**Classe** para:
- Conjunto dinâmico e grande
- Dados do banco
- Dados de API
- Configuração externa

---

## Armadilhas

### 1. Enum para Dados do Banco

```java
// ❌ Enum para dados dinâmicos
public enum Produto {
    LAPTOP, MOUSE // ⚠️ Produtos mudam
}

// ✅ Classe
public class Produto {
    private String nome;
}
```

### 2. Enum Muito Grande

```java
// ❌ Enum com 1000+ constantes
public enum Cidade { } // ⚠️ Muito grande

// ✅ Classe
public class Cidade {
    private String nome;
}
```

### 3. Enum que Cresce

```java
// ⚠️ Enum que precisa mudar sempre
public enum Versao {
    V1_0,
    V1_1,
    V2_0
    // ⚠️ Toda versão adiciona constante
}

// ✅ String ou classe
String versao = "1.0.0";
```

---

## Boas Práticas

### 1. Enum Pequeno e Fixo

```java
// ✅ < 50 constantes
public enum Status {
    ATIVO,
    INATIVO
}
```

### 2. Classe para Dinâmico

```java
// ✅ Dados dinâmicos
public class Categoria {
    private String nome;
}
```

### 3. Documentar Limite

```java
/**
 * Status do pedido.
 * 
 * <p><b>Atenção:</b> Este enum contém apenas status fixos do sistema.
 * Para status customizados, usar {@link StatusCustomizado}.
 */
public enum StatusPedido { }
```

### 4. Avaliar Crescimento

```java
// ⚠️ Se vai crescer muito, não usar enum
// ✅ Se é fixo e pequeno, usar enum
```

---

## Resumo

**Enum vs Classe**:

```java
// ✅ Enum: fixo e pequeno
public enum Status {
    ATIVO,
    INATIVO,
    BLOQUEADO
}

// ✅ Classe: dinâmico e grande
public class Usuario {
    private String nome;
}

// ❌ Evitar: enum grande e dinâmico
public enum Usuario {
    JOAO, MARIA, // ... milhares ⚠️
}
```

**Critérios enum**:
- Conjunto fixo
- Pequeno (< 50)
- Conhecido em compilação
- Não muda frequentemente

**Critérios classe**:
- Conjunto dinâmico
- Grande (> 100)
- Dados do banco/API
- Muda frequentemente

**Regra de Ouro**: **Enum** para conjuntos **fixos e pequenos**. **Classe** para conjuntos **dinâmicos e grandes**. **Avaliar** se conjunto vai crescer muito.
