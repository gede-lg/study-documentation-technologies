# Encapsulamento na Prática: Padrões e Implementação

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Encapsulamento na prática** é aplicação sistemática de princípios de ocultação de dados através de padrões concretos: atributos `private`, métodos públicos validados, cópias defensivas, e design de interface mínima. Não é apenas teoria - é conjunto de decisões de implementação que determinam qualidade, manutenibilidade e robustez de código.

Conceitualmente, é **tradução de princípio abstrato em código concreto**: "esconder implementação" vira "`private` em atributos", "interface pública" vira "métodos `public` com validação", "proteção de invariantes" vira "validação em setters". Analogia: arquitetura de prédio (princípio) vs planta baixa com medidas exatas (prática).

Propósito é **guia prático** para tomar decisões: quando usar `private` vs `protected`, como escrever getters/setters corretos, quando fazer cópia defensiva, como projetar interface pública que resiste a mudanças. Prática transforma conhecimento teórico em habilidade executável.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Padrão de Atributos:** Todos `private` por padrão, sem exceções
2. **Validação em Setters:** Toda modificação passa por validação obrigatória
3. **Cópias Defensivas:** Proteger referências mutáveis de modificação externa
4. **Interface Mínima:** Expor apenas o necessário, manter resto privado
5. **Invariantes Explícitos:** Documentar e garantir condições que devem sempre valer

---

## 🧠 Fundamentos Teóricos

### Padrão: Atributos Private, Métodos Public

```java
class ContaBancaria {
    // ✅ SEMPRE private
    private String titular;
    private String numeroConta;
    private double saldo;
    private List<Transacao> historico;

    // ✅ Construtor valida e inicializa
    public ContaBancaria(String titular, String numeroConta) {
        if (titular == null || titular.trim().isEmpty()) {
            throw new IllegalArgumentException("Titular obrigatório");
        }
        if (numeroConta == null || !numeroConta.matches("\\d{6}-\\d")) {
            throw new IllegalArgumentException("Número de conta inválido");
        }
        this.titular = titular;
        this.numeroConta = numeroConta;
        this.saldo = 0.0;
        this.historico = new ArrayList<>();
    }

    // ✅ Métodos públicos com validação
    public void depositar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        saldo += valor;
        historico.add(new Transacao("DEPOSITO", valor));
    }

    public void sacar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        if (valor > saldo) {
            throw new IllegalStateException("Saldo insuficiente");
        }
        saldo -= valor;
        historico.add(new Transacao("SAQUE", valor));
    }

    // ✅ Getter sem setter (saldo só muda via depositar/sacar)
    public double getSaldo() {
        return saldo;
    }

    // ✅ Getter sem setter (titular imutável após criação)
    public String getTitular() {
        return titular;
    }
}
```

**Fundamento:** Regra universal - **atributos sempre `private`**, sem exceção. Acesso controlado via métodos públicos que validam. Não há "atalho" ou "só desta vez" - consistência é essencial.

### Validação Obrigatória em Setters

```java
class Produto {
    private String nome;
    private double preco;
    private int estoque;

    public void setNome(String nome) {
        // ✅ Validação ANTES de atribuir
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        if (nome.length() > 100) {
            throw new IllegalArgumentException("Nome muito longo (max 100)");
        }
        this.nome = nome.trim();  // Normaliza também
    }

    public void setPreco(double preco) {
        // ✅ Validação de regra de negócio
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }
        if (preco > 1_000_000) {
            throw new IllegalArgumentException("Preço acima do limite");
        }
        this.preco = preco;
    }

    public void setEstoque(int estoque) {
        // ✅ Invariante: estoque >= 0
        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo");
        }
        this.estoque = estoque;
    }

    // ❌ NUNCA fazer:
    // public void setEstoque(int estoque) {
    //     this.estoque = estoque;  // Sem validação!
    // }
}
```

**Fundamento:** Setter não é apenas "atribuir valor" - é **guardião de invariantes**. Toda modificação externa passa por validação obrigatória. Se setter não valida, não há razão para existir (melhor campo público).

### Cópias Defensivas para Referências Mutáveis

```java
class Turma {
    private String nome;
    private List<Aluno> alunos;

    public Turma(String nome, List<Aluno> alunos) {
        this.nome = nome;
        // ❌ ERRO: Armazena referência externa diretamente
        // this.alunos = alunos;

        // ✅ Cópia defensiva na entrada
        this.alunos = new ArrayList<>(alunos);
    }

    public List<Aluno> getAlunos() {
        // ❌ ERRO: Retorna referência interna diretamente
        // return alunos;

        // ✅ Cópia defensiva na saída
        return new ArrayList<>(alunos);

        // Alternativa: Retornar imutável
        // return Collections.unmodifiableList(alunos);
    }

    public void adicionarAluno(Aluno aluno) {
        if (aluno == null) {
            throw new IllegalArgumentException("Aluno não pode ser null");
        }
        alunos.add(aluno);  // Modificação controlada
    }
}

// Sem cópia defensiva:
List<Aluno> lista = new ArrayList<>();
lista.add(new Aluno("João"));
Turma t = new Turma("Turma A", lista);
lista.clear();  // ❌ Modifica interno da turma!

// Com cópia defensiva:
List<Aluno> lista = new ArrayList<>();
lista.add(new Aluno("João"));
Turma t = new Turma("Turma A", lista);  // Copia internamente
lista.clear();  // ✅ Não afeta turma
```

**Fundamento:** Referências a objetos mutáveis (listas, arrays, datas) são **portas dos fundos** que violam encapsulamento. Cópia defensiva na entrada (construtor/setter) e saída (getter) protege interno de modificação externa.

---

## 🔍 Análise Conceitual Profunda

### Padrão: Getters Seletivos (Nem Sempre Necessários)

```java
class Usuario {
    private String login;
    private String senhaHash;  // ❌ NUNCA expor
    private byte[] salt;        // ❌ NUNCA expor
    private LocalDateTime ultimoAcesso;

    // ✅ Getter para login (informação pública)
    public String getLogin() {
        return login;
    }

    // ❌ SEM getter para senhaHash - detalhe interno
    // public String getSenhaHash() { ... }  // NUNCA!

    // ❌ SEM getter para salt - detalhe interno
    // public byte[] getSalt() { ... }  // NUNCA!

    // ✅ Getter para último acesso (cópia defensiva)
    public LocalDateTime getUltimoAcesso() {
        // LocalDateTime é imutável, sem necessidade de cópia
        return ultimoAcesso;
    }

    // ✅ Método que usa dados internos sem expor
    public boolean autenticar(String senha) {
        String hashCalculado = calcularHash(senha, salt);
        return hashCalculado.equals(senhaHash);
    }

    private String calcularHash(String senha, byte[] salt) {
        // Implementação
        return "";
    }
}
```

**Análise:** Nem todo atributo precisa de getter. Informações sensíveis (`senhaHash`, `salt`) devem permanecer **completamente privadas**. Interface pública expõe apenas o que clientes **precisam**, não tudo que classe **tem**.

### Padrão: Métodos de Negócio vs Getters/Setters

```java
class Pedido {
    private List<ItemPedido> itens;
    private StatusPedido status;
    private double desconto;

    // ❌ Expor lista diretamente é ruim
    // public List<ItemPedido> getItens() { return itens; }
    // public void setItens(List<ItemPedido> itens) { this.itens = itens; }

    // ✅ Métodos de negócio específicos
    public void adicionarItem(Produto produto, int quantidade) {
        if (status != StatusPedido.ABERTO) {
            throw new IllegalStateException("Pedido fechado");
        }
        itens.add(new ItemPedido(produto, quantidade));
    }

    public void removerItem(int indice) {
        if (status != StatusPedido.ABERTO) {
            throw new IllegalStateException("Pedido fechado");
        }
        itens.remove(indice);
    }

    public int getQuantidadeItens() {
        return itens.size();
    }

    public double calcularTotal() {
        double subtotal = itens.stream()
            .mapToDouble(ItemPedido::getValorTotal)
            .sum();
        return subtotal - desconto;
    }

    // ✅ Métodos que refletem operações de negócio
    public void aplicarDesconto(double percentual) {
        if (percentual < 0 || percentual > 50) {
            throw new IllegalArgumentException("Desconto inválido");
        }
        this.desconto = calcularTotal() * (percentual / 100);
    }

    public void finalizar() {
        if (itens.isEmpty()) {
            throw new IllegalStateException("Pedido vazio");
        }
        this.status = StatusPedido.FINALIZADO;
    }
}
```

**Análise:** Preferir **métodos de domínio** (`adicionarItem`, `finalizar`) sobre getters/setters genéricos. Métodos de negócio expressam **operações**, não apenas acesso a dados. Interface pública reflete **capacidades** do objeto, não estrutura interna.

### Padrão: Imutabilidade Como Encapsulamento Extremo

```java
// ✅ Classe imutável = encapsulamento máximo
final class Dinheiro {
    private final double valor;
    private final String moeda;

    public Dinheiro(double valor, String moeda) {
        if (valor < 0) {
            throw new IllegalArgumentException("Valor não pode ser negativo");
        }
        if (moeda == null || moeda.length() != 3) {
            throw new IllegalArgumentException("Moeda inválida");
        }
        this.valor = valor;
        this.moeda = moeda;
    }

    public double getValor() {
        return valor;  // Primitivo, cópia automática
    }

    public String getMoeda() {
        return moeda;  // String é imutável
    }

    // ✅ Operações retornam NOVO objeto
    public Dinheiro somar(Dinheiro outro) {
        if (!this.moeda.equals(outro.moeda)) {
            throw new IllegalArgumentException("Moedas diferentes");
        }
        return new Dinheiro(this.valor + outro.valor, this.moeda);
    }

    public Dinheiro multiplicar(double fator) {
        return new Dinheiro(this.valor * fator, this.moeda);
    }
}

// Uso:
Dinheiro d1 = new Dinheiro(100, "BRL");
Dinheiro d2 = d1.somar(new Dinheiro(50, "BRL"));  // d1 não muda!
```

**Análise:** Imutabilidade (`final` em campos e classe) é **encapsulamento garantido pela linguagem**. Não há setters, estado nunca muda, invariantes são permanentes. Segurança thread-safe automática, sem necessidade de cópias defensivas.

### Padrão: Builder para Construção Complexa

```java
class Relatorio {
    private final String titulo;
    private final LocalDate dataInicio;
    private final LocalDate dataFim;
    private final List<String> colunas;
    private final FormatoRelatorio formato;
    private final boolean incluirGraficos;

    // ❌ Construtor com muitos parâmetros é ruim
    // public Relatorio(String titulo, LocalDate dataInicio, ...) { }

    // ✅ Construtor privado, usado por Builder
    private Relatorio(Builder builder) {
        this.titulo = builder.titulo;
        this.dataInicio = builder.dataInicio;
        this.dataFim = builder.dataFim;
        this.colunas = new ArrayList<>(builder.colunas);
        this.formato = builder.formato;
        this.incluirGraficos = builder.incluirGraficos;
    }

    // ✅ Builder interno
    public static class Builder {
        private String titulo;
        private LocalDate dataInicio;
        private LocalDate dataFim;
        private List<String> colunas = new ArrayList<>();
        private FormatoRelatorio formato = FormatoRelatorio.PDF;
        private boolean incluirGraficos = false;

        public Builder titulo(String titulo) {
            this.titulo = titulo;
            return this;
        }

        public Builder periodo(LocalDate inicio, LocalDate fim) {
            this.dataInicio = inicio;
            this.dataFim = fim;
            return this;
        }

        public Builder adicionarColuna(String coluna) {
            this.colunas.add(coluna);
            return this;
        }

        public Builder formato(FormatoRelatorio formato) {
            this.formato = formato;
            return this;
        }

        public Builder incluirGraficos() {
            this.incluirGraficos = true;
            return this;
        }

        public Relatorio build() {
            // Validação antes de construir
            if (titulo == null || titulo.isEmpty()) {
                throw new IllegalStateException("Título obrigatório");
            }
            if (dataInicio == null || dataFim == null) {
                throw new IllegalStateException("Período obrigatório");
            }
            if (dataInicio.isAfter(dataFim)) {
                throw new IllegalStateException("Data início após data fim");
            }
            return new Relatorio(this);
        }
    }
}

// Uso:
Relatorio r = new Relatorio.Builder()
    .titulo("Vendas Mensais")
    .periodo(LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 31))
    .adicionarColuna("Produto")
    .adicionarColuna("Quantidade")
    .formato(FormatoRelatorio.EXCEL)
    .incluirGraficos()
    .build();
```

**Análise:** Builder mantém encapsulamento enquanto oferece **interface fluente** para construção. Construtor privado garante que objeto só é criado via Builder, que valida antes de construir. Imutabilidade do objeto final (`final` em campos) é preservada.

---

## 🎯 Aplicabilidade e Contextos

### Contexto: Value Objects de Domínio

```java
// ✅ Email como Value Object encapsulado
class Email {
    private final String endereco;

    public Email(String endereco) {
        if (endereco == null || !endereco.matches("^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$")) {
            throw new IllegalArgumentException("Email inválido: " + endereco);
        }
        this.endereco = endereco.toLowerCase();  // Normaliza
    }

    public String getEndereco() {
        return endereco;
    }

    public String getDominio() {
        return endereco.substring(endereco.indexOf('@') + 1);
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Email)) return false;
        return this.endereco.equals(((Email) obj).endereco);
    }

    @Override
    public int hashCode() {
        return endereco.hashCode();
    }
}
```

**Aplicabilidade:** Conceitos de domínio (Email, CPF, Telefone, Dinheiro) devem ser **encapsulados em classes** com validação, não tratados como `String` primitiva. Encapsulamento garante que valor inválido nunca existe.

### Contexto: Entidades com Ciclo de Vida

```java
class Tarefa {
    private final Long id;  // Imutável
    private String descricao;
    private StatusTarefa status;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataConclusao;

    public Tarefa(Long id, String descricao) {
        this.id = id;
        setDescricao(descricao);  // Valida
        this.status = StatusTarefa.PENDENTE;
        this.dataCriacao = LocalDateTime.now();
    }

    public void setDescricao(String descricao) {
        if (descricao == null || descricao.trim().isEmpty()) {
            throw new IllegalArgumentException("Descrição obrigatória");
        }
        this.descricao = descricao;
    }

    // ✅ Método de negócio que gerencia transição de estado
    public void concluir() {
        if (status == StatusTarefa.CONCLUIDA) {
            throw new IllegalStateException("Tarefa já concluída");
        }
        this.status = StatusTarefa.CONCLUIDA;
        this.dataConclusao = LocalDateTime.now();
    }

    public void reabrir() {
        if (status != StatusTarefa.CONCLUIDA) {
            throw new IllegalStateException("Apenas tarefas concluídas podem ser reabertas");
        }
        this.status = StatusTarefa.PENDENTE;
        this.dataConclusao = null;
    }

    // ❌ NÃO expor setStatus diretamente
    // public void setStatus(StatusTarefa status) { ... }

    public Long getId() { return id; }
    public String getDescricao() { return descricao; }
    public StatusTarefa getStatus() { return status; }
    public LocalDateTime getDataConclusao() { return dataConclusao; }
}
```

**Aplicabilidade:** Entidades com **máquina de estados** (Pedido, Tarefa, Processo) devem encapsular transições em métodos de negócio (`concluir`, `reabrir`), não expor `setStatus` genérico.

### Contexto: DTOs (Data Transfer Objects)

```java
// ✅ DTO pode ter campos públicos (sem lógica de negócio)
class ProdutoDTO {
    public Long id;
    public String nome;
    public double preco;

    // Construtor vazio para frameworks (Jackson, JPA)
    public ProdutoDTO() {}

    public ProdutoDTO(Long id, String nome, double preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }
}

// Ou com getters/setters para JavaBeans
class ClienteDTO {
    private String nome;
    private String email;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
```

**Aplicabilidade:** DTOs são **apenas dados** sem lógica de negócio. Encapsulamento rígido (`private` + validação) pode ser relaxado. No entanto, objetos de domínio (entities, value objects) devem sempre ter encapsulamento completo.

---

## ⚠️ Limitações e Considerações

### Armadilha: Getters que Retornam Mutáveis

```java
class Calendario {
    private Date dataEvento;  // Date é mutável!

    public Date getDataEvento() {
        return dataEvento;  // ❌ PERIGO!
    }
}

// Cliente pode modificar interno:
Calendario cal = new Calendario();
Date d = cal.getDataEvento();
d.setTime(0);  // ❌ Modificou interno do Calendario!

// ✅ Solução 1: Cópia defensiva
public Date getDataEvento() {
    return new Date(dataEvento.getTime());
}

// ✅ Solução 2: Usar tipo imutável (Java 8+)
class Calendario {
    private LocalDate dataEvento;  // Imutável

    public LocalDate getDataEvento() {
        return dataEvento;  // Seguro, LocalDate é imutável
    }
}
```

**Limitação:** `Date`, `Calendar`, arrays, coleções são **mutáveis**. Getter que retorna referência direta expõe interno para modificação.

### Armadilha: Setters em Objetos Imutáveis

```java
// ❌ Confuso: parece imutável mas tem setters
class Ponto {
    private final int x;
    private final int y;

    public Ponto(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void setX(int x) {
        // this.x = x;  // ❌ ERRO: final não pode ser reatribuído
    }
}

// ✅ Imutável correto: sem setters
class Ponto {
    private final int x;
    private final int y;

    public Ponto(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }

    // Operações retornam NOVO objeto
    public Ponto mover(int dx, int dy) {
        return new Ponto(x + dx, y + dy);
    }
}
```

**Consideração:** Se classe é imutável (`final` em campos), **não deve ter setters**. Operações retornam novo objeto.

### Trade-off: Simplicidade vs Robustez

```java
// Simples mas frágil
class Config {
    public String host;
    public int porta;
}

// Robusto mas verboso
class Config {
    private String host;
    private int porta;

    public Config(String host, int porta) {
        setHost(host);
        setPorta(porta);
    }

    public void setHost(String host) {
        if (host == null || host.isEmpty()) {
            throw new IllegalArgumentException("Host obrigatório");
        }
        this.host = host;
    }

    public void setPorta(int porta) {
        if (porta < 1 || porta > 65535) {
            throw new IllegalArgumentException("Porta inválida");
        }
        this.porta = porta;
    }

    public String getHost() { return host; }
    public int getPorta() { return porta; }
}
```

**Trade-off:** Encapsulamento completo requer mais código. Para objetos internos simples sem invariantes críticos, simplicidade pode vencer. Para objetos de domínio ou APIs públicas, robustez vale o custo.

---

## 🔗 Interconexões Conceituais

### Relação com Modificadores de Acesso

Encapsulamento na prática depende de **níveis de visibilidade**: `private` (mais restrito), package-private, `protected`, `public` (menos restrito). Próximo passo é dominar quando usar cada um.

### Relação com Validação e Invariantes

Getters/setters são **pontos de controle** onde validação ocorre. Invariantes (condições que sempre devem valer) são garantidos por validação centralizada em métodos públicos.

### Relação com Design Patterns

- **Builder**: Encapsula construção complexa
- **Factory**: Encapsula criação de objetos
- **Strategy**: Encapsula algoritmos intercambiáveis
- **Template Method**: Encapsula passos de algoritmo

Patterns de criação e comportamento frequentemente usam encapsulamento como mecanismo fundamental.

---

## 🚀 Evolução e Próximos Conceitos

### Progressão: Getters e Setters Avançados

Próximo nível é entender **quando não usar** getters/setters: objetos imutáveis, métodos de domínio específicos, Tell Don't Ask.

### Direção: Modificadores de Acesso (`protected`, package-private)

Encapsulamento não é binário (público vs privado) - há **níveis intermediários** (`protected` para herança, package-private para módulo). Compreender nuances de cada nível.

### Caminho: Design de APIs e Contratos

Encapsulamento prático leva a **design de APIs**: projetar interfaces públicas estáveis que permitem evolução interna, documentar contratos e pré/pós-condições.

---

## 📚 Conclusão

Encapsulamento na prática é aplicação sistemática de padrões concretos: atributos sempre `private`, validação obrigatória em setters, cópias defensivas para mutáveis, interface mínima exposta, preferência por métodos de domínio sobre getters/setters genéricos.

Dominar encapsulamento prático significa:
- Fazer atributos `private` sem exceção - regra universal
- Validar em setters antes de atribuir - setters são guardiões
- Usar cópias defensivas para coleções e objetos mutáveis
- Criar getters apenas para o que clientes precisam - não tudo que classe tem
- Preferir métodos de negócio (`depositar`, `sacar`) sobre setters genéricos
- Usar imutabilidade (`final`) quando possível - encapsulamento garantido
- Aplicar Builder para construção complexa com validação
- Reconhecer que DTOs podem relaxar encapsulamento, entidades não
- Evitar retornar referências mutáveis sem proteção
- Balancear simplicidade vs robustez baseado em criticidade

Encapsulamento não é burocracia - é **investimento em qualidade**: código que valida na entrada não quebra na execução, classes que escondem implementação evoluem sem quebrar clientes, invariantes protegidos impedem bugs sutis. Prática correta requer disciplina inicial (sempre `private`, sempre validar) mas paga dividendos contínuos em manutenibilidade, robustez e flexibilidade ao longo da vida do sistema.
