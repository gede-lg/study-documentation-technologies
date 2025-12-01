# Convenções de Nomenclatura de Atributos

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Convenções de nomenclatura de atributos** são padrões estilísticos consistentes para nomear atributos de classes, visando legibilidade, manutenibilidade e comunicação clara de intenção. Não são regras sintáticas obrigatórias (compilador aceita qualquer identificador válido), mas sim **contratos sociais da comunidade Java** - padrões amplamente aceitos que tornam código previsível e profissional.

Conceitualmente, nomenclatura é linguagem compartilhada - assim como falantes de português esperam substantivos antes de verbos, desenvolvedores Java esperam `camelCase` para atributos e `UPPER_SNAKE_CASE` para constantes. Quebrar convenções não causa erro, mas causa confusão - `MINHA_VARIAVEL` parece constante mas não é `final`, `MinhaClasse` parece classe mas é atributo.

Nomenclatura comunica propósito sem precisar ler código: `private String nome` é campo privado mutável, `public static final int MAX_SIZE` é constante pública. Convenções transformam nomes em metadados - antes de entender lógica, desenvolvedores entendem estrutura.

### Contexto Histórico e Motivação

Java herdou convenções de Smalltalk e C++ quando foi criado (1995). Sun Microsystems publicou **Java Code Conventions** (1997) documentando estilo oficial - `camelCase` para variáveis/métodos, `PascalCase` para classes, `UPPER_SNAKE_CASE` para constantes. Essas convenções se tornaram padrão de facto, adotadas por toda indústria.

**Motivação Original:**
1. **Legibilidade:** Código é lido 10x mais que escrito - facilitar leitura economiza tempo
2. **Consistência:** Código de diferentes autores parece escrito pela mesma pessoa
3. **Manutenibilidade:** Desenvolvedores futuros entendem intenção rapidamente
4. **Profissionalismo:** Código respeitando convenções é visto como qualidade superior

Google, Oracle, empresas Fortune 500 - todos seguem mesmas convenções. Código open-source (Spring, Hibernate, Apache Commons) segue rigidamente. Ferramentas (IntelliJ, Eclipse, Checkstyle, SonarQube) alertam sobre violações.

### Problema Fundamental que Resolve

**Problema:** Nomes inconsistentes causam confusão e perda de tempo:

```java
// Estilo inconsistente - ruim
class usuario {  // Deveria ser Usuario (PascalCase)
    String Nome_Usuario;  // Deveria ser nomeUsuario (camelCase)
    int IDADE;  // Parece constante mas não é final
    final double taxa_desconto = 0.1;  // Deveria ser TAXA_DESCONTO
    public static int MAX_size = 100;  // Inconsistente (MAX_ mas size?)
}
```

**Problemas Causados:**
- `Nome_Usuario` parece constante ou variável de banco de dados?
- `IDADE` é constante? Não, mas nome sugere que sim
- `taxa_desconto` é `final` mas nome não indica imutabilidade
- Mistura de estilos (snake_case, camelCase, UPPER_CASE) sem lógica

**Solução:** Convenções consistentes comunicam intenção:

```java
// Estilo consistente - bom
class Usuario {  // PascalCase para classe
    private String nomeUsuario;  // camelCase para atributo
    private int idade;  // camelCase, minúscula indica mutável
    private static final double TAXA_DESCONTO = 0.1;  // UPPER_SNAKE_CASE, indica constante
    public static final int MAX_SIZE = 100;  // Consistente
}
```

**Benefícios:**
- `nomeUsuario` em camelCase indica atributo/variável comum
- `TAXA_DESCONTO` em UPPER_SNAKE_CASE grita "constante!"
- Estilo uniforme facilita leitura - desenvolvedores não precisam "descobrir" o que cada nome significa

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **camelCase para Atributos:**
   - Primeira palavra minúscula, demais iniciam com maiúscula
   - Exemplo: `nomeCompleto`, `saldoAtual`, `dataNascimento`

2. **UPPER_SNAKE_CASE para Constantes:**
   - Tudo maiúsculo, palavras separadas por underscore
   - Usado com `static final`
   - Exemplo: `MAX_SIZE`, `DEFAULT_TIMEOUT`, `PI`

3. **Prefixos e Notações Especiais:**
   - **Discussão sobre Notação Húngara:** `strNome`, `intIdade` (desencorajado em Java)
   - **Prefixo Underscore:** `_nome` (desencorajado, exceto casos específicos)
   - **Prefixo `m`:** `mNome` (Android/C++ style, não convencional em Java puro)

4. **Nomes Descritivos vs Concisos:**
   - Preferir clareza sobre brevidade: `quantidadeDeItensNoCarrinho` > `qtdItens`
   - Evitar abreviações ambíguas: `tmp`, `aux`, `x`
   - Exceto convenções estabelecidas: `id`, `url`, `html`

5. **Contexto e Semântica:**
   - Nomes devem refletir domínio: `cliente`, `pedido`, `produto`
   - Usar vocabulário do negócio, não jargão técnico genérico

### Pilares Fundamentais

- **camelCase:** Atributos de instância e classe (não-final)
- **UPPER_SNAKE_CASE:** Constantes (`static final`)
- **Descritivo:** Nomes devem comunicar propósito sem ambiguidade
- **Sem Prefixos:** Evitar notações como Húngara ou `m_`/`_`
- **Consistência:** Manter padrão em toda base de código

---

## 🧠 Fundamentos Teóricos

### CamelCase: Padrão para Atributos

#### Definição e Sintaxe

**camelCase** (também lowerCamelCase): primeira palavra minúscula, palavras subsequentes com inicial maiúscula, sem separadores.

```java
class Pessoa {
    // ✅ Correto - camelCase
    String nome;
    String nomeCompleto;
    int idade;
    double saldoBancario;
    LocalDate dataNascimento;
    boolean estaAtivo;
    List<String> tagsDoUsuario;

    // ❌ Incorreto
    String Nome;  // PascalCase (para classes)
    String nome_completo;  // snake_case (Python style)
    String NomeCompleto;  // PascalCase
    String nome-completo;  // Hífen inválido
    String NOME;  // UPPER_CASE (para constantes)
}
```

#### Formação de Nomes Compostos

```java
class Exemplos {
    // Duas palavras
    String nomeUsuario;     // nome + Usuario
    int anoNascimento;      // ano + Nascimento

    // Três palavras
    String enderecoEmailPrincipal;  // endereco + Email + Principal
    double valorTotalComDesconto;   // valor + Total + Com + Desconto

    // Com siglas - primeira letra maiúscula
    String urlApi;          // url + Api (não URL_API)
    int idUsuario;          // id + Usuario (não ID_USUARIO)
    String codigoHtml;      // codigo + Html (não codigoHTML)

    // Exceção: Siglas no início ficam minúsculas
    String htmlParser;      // html + Parser (não HTMLParser - isso é classe)
    String xmlDocument;     // xml + Document
}
```

**Regra para Siglas:**
- **No meio/final:** Primeira letra maiúscula, resto minúsculo: `urlApi`, `idUsuario`
- **No início:** Tudo minúsculo: `htmlParser`, `urlBase`
- Evitar tudo maiúsculo: `HTMLPARSER`, `URL_API` (reservado para constantes)

#### Verbos e Adjetivos

```java
class NomesSemânticos {
    // Substantivos (comum)
    String nome;
    int contador;

    // Booleanos - prefixos is/has/can/should
    boolean estaAtivo;      // prefixo "esta" (português)
    boolean hasPermission;  // "has" (inglês comum)
    boolean canEdit;        // "can"
    boolean shouldNotify;   // "should"

    // ❌ Evitar booleanos sem prefixo semântico
    boolean ativo;  // Aceitável, mas "estaAtivo" é mais claro
    boolean permissao;  // Confuso - "hasPermissao" melhor
}
```

### UPPER_SNAKE_CASE: Padrão para Constantes

#### Definição e Sintaxe

**UPPER_SNAKE_CASE**: todas letras maiúsculas, palavras separadas por underscore (`_`).

```java
class Constantes {
    // ✅ Correto - UPPER_SNAKE_CASE para static final
    static final int MAX_SIZE = 100;
    static final double PI = 3.141592653589793;
    static final String DEFAULT_NAME = "Unnamed";
    static final long TIMEOUT_MILLISECONDS = 5000L;
    static final String DATABASE_URL = "jdbc:mysql://localhost/db";

    // ❌ Incorreto para constantes
    static final int maxSize = 100;  // camelCase
    static final int MaxSize = 100;  // PascalCase
    static final int max_size = 100;  // snake_case minúsculo
}
```

#### Constantes Públicas vs Privadas

```java
class Config {
    // Constante pública - API exposta
    public static final int MAX_CONNECTIONS = 50;

    // Constante privada - implementação interna
    private static final String INTERNAL_KEY = "secret_key_123";

    // Constante protected - visível para subclasses
    protected static final int DEFAULT_BUFFER_SIZE = 8192;
}
```

#### Constantes em Interfaces

```java
interface HttpStatus {
    // Implicitamente public static final
    int OK = 200;
    int NOT_FOUND = 404;
    int INTERNAL_SERVER_ERROR = 500;
    // Todos em UPPER_SNAKE_CASE
}
```

#### Constantes vs Enums

```java
// ❌ Anti-padrão - usar constantes para conjunto relacionado
class StatusPedido {
    static final int PENDENTE = 0;
    static final int APROVADO = 1;
    static final int REJEITADO = 2;
}

// ✅ Melhor - usar enum
enum StatusPedido {
    PENDENTE, APROVADO, REJEITADO
}

// ✅ Constantes apropriadas - valores únicos
class Config {
    static final double TAXA_PADRAO = 0.15;
    static final int TIMEOUT = 3000;
}
```

---

## 🔍 Análise Conceitual Profunda

### Notação Húngara: História e Controvérsia

#### O Que É

**Notação Húngara**: Prefixo no nome indicando tipo da variável. Criada por Charles Simonyi (Microsoft) nos anos 1980.

```java
// Notação Húngara (DESENCORAJADA em Java)
class EstiloAntigo {
    String strNome;          // "str" indica String
    int intIdade;            // "int" indica int
    boolean bAtivo;          // "b" indica boolean
    double dblSalario;       // "dbl" indica double
    List<String> lstTags;    // "lst" indica List
}
```

#### Por Que Era Usada

- **C/C++:** Linguagens fracamente tipadas, IDEs primitivas (anos 80-90)
- **Visual Basic:** Sem type inference, prefixo ajudava a lembrar tipo
- **Documentação de Tipo:** Nome carregava informação do tipo

#### Por Que Não Usar em Java

1. **Java é Fortemente Tipado:**
   ```java
   String strNome;  // Redundante - declaração já diz que é String!
   ```

2. **IDEs Modernas:**
   - IntelliJ/Eclipse mostram tipo ao passar mouse
   - Autocomplete revela tipo instantaneamente
   - Coloração de sintaxe diferencia tipos

3. **Manutenção Difícil:**
   ```java
   String strNome;  // Mudou para StringBuilder
   StringBuilder strNome;  // Prefixo agora está errado!
   ```

4. **Poluição Visual:**
   ```java
   // Difícil de ler
   if (strNomeUsuario.equals(strNomeEsperado)) {
       intContador++;
   }

   // Mais limpo
   if (nomeUsuario.equals(nomeEsperado)) {
       contador++;
   }
   ```

**Conclusão:** Notação Húngara é legado de linguagens antigas - Java não precisa dela.

### Prefixos Underscore: Quando (Não) Usar

#### Casos Desencorajados

```java
class Evitar {
    // ❌ Prefixo underscore sem propósito
    private String _nome;
    private int _idade;
    // Sem benefício - apenas poluição visual
}
```

#### Casos Aceitáveis (Raros)

```java
class Especial {
    // ✅ Diferenciar parâmetro de atributo (alternativa: this.)
    private String nome;

    void setNome(String _nome) {
        nome = _nome;  // Mas "this.nome = nome" é preferido
    }

    // ✅ Variável temporária em escopo muito curto
    void processar() {
        int _temp = calcular();
        usar(_temp);
    }
}
```

**Preferir:**
```java
class Preferido {
    private String nome;

    void setNome(String nome) {
        this.nome = nome;  // ✅ Mais Java idiomático
    }
}
```

### Prefixo `m` (Member): Convenção Android/C++

```java
// Estilo Android (influência C++)
class EstiloAndroid {
    private String mNome;       // "m" = member (atributo)
    private int mIdade;

    private static int sContador;  // "s" = static

    public void setNome(String nome) {
        mNome = nome;  // Claro que é atributo
    }
}

// Estilo Java Puro (preferido)
class EstiloJavaPuro {
    private String nome;
    private int idade;

    private static int contador;

    public void setNome(String nome) {
        this.nome = nome;  // "this." quando necessário
    }
}
```

**Discussão:**
- **Pró `m`:** Diferencia atributo de variável local sem `this.`
- **Contra `m`:** Não é idiomático em Java (convenções oficiais não usam)
- **Consenso:** Válido em projetos Android (padrão do Google Android), evitar em Java geral

### Nomes Descritivos vs Abreviações

#### Preferir Clareza

```java
class Legibilidade {
    // ✅ Descritivo - intenção clara
    String nomeCompletoDoUsuario;
    int quantidadeDeItensNoCarrinho;
    double valorTotalComImpostos;

    // ❌ Abreviado - ambíguo
    String nmUsr;   // nome? número? usuario? user?
    int qtdItens;   // "qtd" pode ser confuso
    double vlrTot;  // "vlr" não é padrão
}
```

#### Abreviações Aceitáveis

```java
class AbreviacoesComuns {
    // ✅ Abreviações universalmente reconhecidas
    String id;         // identifier (não "identificador")
    String url;        // uniform resource locator
    String html;       // hypertext markup language
    int max;           // maximum (contexto óbvio)
    int min;           // minimum
    String msg;        // message (muito comum)
    String temp;       // temporary (se escopo claro)

    // ⚠️ Abreviações de domínio (OK se equipe conhece)
    String cpf;        // Cadastro de Pessoa Física (Brasil)
    String cep;        // Código de Endereçamento Postal
    double ipi;        // Imposto sobre Produtos Industrializados
}
```

#### Regra de Ouro

**Se nome abreviado requer explicação, use nome completo.**

```java
// ❌ Requer contexto
int ttl;  // O que é? Time to live? Total?

// ✅ Auto-explicativo
int timeToLive;
int total;
```

### Nomes Contextuais

#### Redundância Desnecessária

```java
class Usuario {
    // ❌ Redundante - já está em classe Usuario
    String nomeDoUsuario;
    int idadeDoUsuario;
    String emailDoUsuario;

    // ✅ Contexto já fornecido pela classe
    String nome;
    int idade;
    String email;
}
```

#### Quando Contexto Ajuda

```java
class Pedido {
    // ✅ Contexto útil - múltiplas datas
    LocalDate dataCriacao;
    LocalDate dataEnvio;
    LocalDate dataEntrega;

    // ❌ Sem contexto - qual data?
    LocalDate data;  // Ambíguo!
}
```

---

## 🎯 Aplicabilidade e Contextos

### Guia de Decisão: Como Nomear

#### Fluxograma Mental

1. **É constante (`static final`)?**
   → Sim: Use `UPPER_SNAKE_CASE`
   → Não: Continue

2. **É boolean?**
   → Sim: Use prefixo semântico (`esta`, `has`, `can`, `should`)
   → Não: Continue

3. **É coleção?**
   → Sim: Use plural ou sufixo descritivo (`usuarios`, `listaDeProdutos`)
   → Não: Continue

4. **Nome genérico ou específico?**
   → Específico: Use nome do domínio (`cliente`, `pedido`)
   → Genérico: Evite (`coisa`, `objeto`, `item`)

5. **Nome completo é muito longo?**
   → Use abreviação conhecida apenas se universalmente aceita
   → Caso contrário, mantenha completo

#### Exemplos Práticos

```java
class PedidoVenda {
    // 1. Constantes
    static final double TAXA_IMPOSTO = 0.15;
    static final int MAX_ITENS_POR_PEDIDO = 100;

    // 2. IDs e identificadores
    private long id;
    private UUID uuid;
    private String numero;

    // 3. Datas - contexto específico
    private LocalDateTime dataCriacao;
    private LocalDateTime dataUltimaAtualizacao;

    // 4. Valores monetários
    private BigDecimal valorTotal;
    private BigDecimal valorDesconto;
    private BigDecimal valorFinal;

    // 5. Booleanos - prefixo semântico
    private boolean estaPago;
    private boolean foiEnviado;
    private boolean podeSerCancelado;

    // 6. Referências a objetos
    private Cliente cliente;
    private Endereco enderecoEntrega;
    private FormaPagamento formaPagamento;

    // 7. Coleções - plural
    private List<ItemPedido> itens;
    private Set<String> tags;
    private Map<String, String> metadados;
}
```

### Nomes em Português vs Inglês

#### Considerações

**Português:**
- ✅ Vocabulário de domínio: `cliente`, `pedido`, `nota_fiscal`
- ✅ Equipe brasileira, sistema brasileiro
- ❌ Mistura com API Java (inglês): `clienteList`, `pedidoMap`

**Inglês:**
- ✅ Consistência com APIs: `customerList`, `orderMap`
- ✅ Código exportável, equipes internacionais
- ❌ Tradução pode não ser direta: `NotaFiscal` → `TaxInvoice`?

**Recomendação:**
- **Domínio de Negócio:** Considere português se termos têm significado específico local (`boleto`, `PIX`, `NFe`)
- **Código Técnico:** Inglês é padrão global
- **Consistência:** Escolha uma língua e mantenha

```java
// Opção 1: Português (domínio brasileiro)
class NotaFiscal {
    String numeroNFe;
    BigDecimal valorIcms;
    String cnpjEmitente;
}

// Opção 2: Inglês (internacionalização)
class TaxInvoice {
    String invoiceNumber;
    BigDecimal taxValue;
    String issuerTaxId;
}
```

---

## ⚠️ Limitações e Considerações

### Convenções Não São Leis

```java
// Tecnicamente válido (compila)
class minha_classe {
    public static final int valorMaximo = 100;  // Deveria ser VALOR_MAXIMO
    String NOME;  // Deveria ser nome (camelCase)
}
// Compila, mas viola convenções - dificulta leitura
```

**Lembrete:** Compilador não força convenções - desenvolvedores devem.

### Conflitos com Frameworks

```java
// JPA/Hibernate - atributos mapeiam para colunas de banco
@Entity
class Usuario {
    // Atributo: camelCase
    private String nomeCompleto;

    // Coluna no banco: snake_case (configurável)
    @Column(name = "nome_completo")
    private String nomeCompleto;
}
```

**Solução:** Use convenções Java no código, configure mapeamento ORM conforme banco de dados.

### Nomes Muito Longos

```java
// ⚠️ Muito verboso
class RelatorioFinanceiro {
    private BigDecimal valorTotalDeProdutosVendidosNoMesAtualComDescontoAplicado;
    // 70 caracteres!
}

// ✅ Balanceado
class RelatorioFinanceiro {
    private BigDecimal valorTotalComDesconto;
    // Contexto (mês, produtos) pode estar em método ou classe
}
```

**Regra:** Nome não deve precisar quebrar linha (<80 caracteres ideal).

---

## 🔗 Interconexões Conceituais

### Relação com Modificadores de Acesso

```java
class Exemplo {
    // Convenção: atributos privados (encapsulamento)
    private String nome;  // camelCase, private
    private int idade;

    // Constante pública (API)
    public static final double TAXA = 0.15;  // UPPER_SNAKE_CASE, public
}
```

### Relação com JavaBeans

JavaBeans seguem convenções estritas:

```java
class PessoaBean {
    // Atributo privado camelCase
    private String nome;

    // Getter: "get" + Atributo (PascalCase)
    public String getNome() {
        return nome;
    }

    // Setter: "set" + Atributo (PascalCase)
    public void setNome(String nome) {
        this.nome = nome;
    }

    // Boolean: "is" + Atributo (não "get")
    private boolean ativo;

    public boolean isAtivo() {
        return ativo;
    }
}
```

### Relação com Records (Java 14+)

Records automatizam nomenclatura:

```java
// Record - componentes em camelCase
record Usuario(String nomeCompleto, int idade, String email) { }

// Gera automaticamente:
// - private final String nomeCompleto;
// - public String nomeCompleto() { ... }
```

---

## 🚀 Evolução e Próximos Conceitos

### Convenções Modernas

- **Lombok:** Gera código respeitando convenções via anotações
- **Records:** Sintaxe concisa, convenções automáticas
- **Sealed Classes:** Convenções para tipos restritos

### Ferramentas de Conformidade

- **Checkstyle:** Valida convenções de código
- **SonarQube:** Analisa qualidade, incluindo nomenclatura
- **IntelliJ/Eclipse:** Inspeções integradas alertam sobre violações
- **PMD:** Detecta anti-padrões e violações de estilo

---

## 📚 Conclusão

Convenções de nomenclatura de atributos são padrões estilísticos - `camelCase` para atributos comuns (`nomeUsuario`), `UPPER_SNAKE_CASE` para constantes (`MAX_SIZE`), nomes descritivos evitando abreviações ambíguas. Não são obrigatórias sintaticamente, mas são contrato social da comunidade Java para legibilidade e manutenibilidade.

Dominar convenções significa:
- Usar `camelCase` para atributos de instância/classe: `saldoAtual`, `nomeCompleto`
- Usar `UPPER_SNAKE_CASE` para constantes `static final`: `MAX_SIZE`, `PI`
- Prefixos semânticos para booleanos: `estaAtivo`, `hasPermission`, `canEdit`
- Evitar notação Húngara (`strNome`, `intIdade`) - redundante em Java moderno
- Evitar prefixos underscore (`_nome`) - `this.nome` é idiomático
- Preferir nomes descritivos sobre abreviações: `nomeCompleto` > `nmCmpl`
- Usar abreviações apenas quando universais: `id`, `url`, `html`, `max`
- Evitar redundância com contexto de classe: `Usuario.nome` > `Usuario.nomeDoUsuario`
- Plural para coleções: `usuarios`, `itens`, `tags`
- Consistência importa mais que perfeição - mantenha padrão em toda base de código

Convenções transformam nomes em documentação implícita. `MAX_SIZE` grita "constante, não altere!", `nomeUsuario` sussurra "campo mutável comum". Código que respeita convenções é previsível - desenvolvedores gastam menos energia entendendo estrutura, mais energia resolvendo problemas. Java tem 30 anos de convenções estabelecidas - segui-las conecta código a décadas de melhores práticas e torna código profissional, mantível e respeitado pela comunidade.
