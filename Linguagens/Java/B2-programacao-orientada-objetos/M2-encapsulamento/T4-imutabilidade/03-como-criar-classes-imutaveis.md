# Como Criar Classes Imutáveis: Regras e Padrões

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Criar classe imutável** é aplicar conjunto de regras que garantem estado fixo: (1) classe `final` para impedir herança, (2) todos campos `private final`, (3) sem setters, (4) construtor valida e inicializa tudo, (5) cópias defensivas para referências mutáveis, (6) métodos que "modificam" retornam novo objeto. Violação de qualquer regra quebra imutabilidade.

Conceitualmente, criar imutável é **design defensivo**: proteger contra toda forma possível de modificação - direta (setters), indireta (getters de mutáveis), herança (subclasse adiciona mutabilidade), concorrente (múltiplas threads). Analogia: construir cofre - não basta uma fechadura boa, precisa paredes sólidas, sem janelas, sem alçapões.

Propósito é **garantia verificável**: seguindo checklist, imutabilidade é propriedade provável. Não é "provavelmente imutável" ou "quase imutável" - é **completamente imutável** ou não é. Meio termo não existe - única referência mutável exposta destrói todas garantias.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Classe Final:** Impedir subclasses que adicionem mutabilidade
2. **Campos Private Final:** Atribuição única, sem reatribuição
3. **Sem Setters:** Zero métodos que modifiquem campos
4. **Inicialização Completa no Construtor:** Todo campo recebe valor
5. **Cópias Defensivas:** Proteger referências a mutáveis
6. **Retornar Novos Objetos:** Operações não modificam `this`

---

## 🧠 Fundamentos Teóricos

### Regra 1: Classe `final`

```java
// ❌ Sem final: subclasse pode quebrar imutabilidade
class PontoImutavel {
    private final int x;
    private final int y;

    public PontoImutavel(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }
}

// Subclasse adiciona mutabilidade!
class PontoMutavel extends PontoImutavel {
    private int z;  // Novo campo mutável

    public PontoMutavel(int x, int y, int z) {
        super(x, y);
        this.z = z;
    }

    public void setZ(int z) { this.z = z; }  // Mutável!
}

// ✅ Com final: herança impossível
final class PontoImutavel {
    private final int x;
    private final int y;

    public PontoImutavel(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }
}

// class PontoMutavel extends PontoImutavel { ... }  // ❌ ERRO de compilação
```

**Fundamento:** Herança pode **adicionar campos mutáveis** ou **sobrescrever métodos** para retornar valores diferentes. Classe `final` **impede extensão** - garantia de que ninguém adiciona mutabilidade via subclasse.

**Alternativa:** Construtor privado (padrão Singleton/Factory) também impede instanciação externa, mas `final` é mais claro.

### Regra 2: Todos Campos `private final`

```java
// ❌ Campo não-final: pode ser reatribuído
class ConfiguracaoQuaseImutavel {
    private String host;  // Sem final

    public ConfiguracaoQuaseImutavel(String host) {
        this.host = host;
    }

    // Método interno pode modificar!
    private void resetHost() {
        this.host = "localhost";  // ❌ Reatribuição
    }
}

// ✅ Campo final: atribuição única
final class ConfiguracaoImutavel {
    private final String host;

    public ConfiguracaoImutavel(String host) {
        this.host = host;  // Atribuição única
    }

    // private void resetHost() {
    //     this.host = "localhost";  // ❌ ERRO: final não pode reatribuir
    // }
}
```

**Fundamento:** `final` em campo significa **atribuição única** - só pode receber valor no construtor ou inline na declaração. Tentativa de reatribuir (mesmo em método privado) gera **erro de compilação**. É garantia de linguagem.

**Detalhe:** `private` impede acesso externo, `final` impede reatribuição interna. Ambos são necessários.

### Regra 3: Sem Setters

```java
// ❌ Com setter: mutável
final class Pessoa {
    private final String nome;
    private int idade;  // Não-final

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;  // Modifica estado
    }
}

// ✅ Sem setters: imutável
final class Pessoa {
    private final String nome;
    private final int idade;

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    // Operação que "muda idade" retorna novo objeto
    public Pessoa envelhecer() {
        return new Pessoa(nome, idade + 1);
    }
}
```

**Fundamento:** Setter é método que **modifica campo**. Classe imutável não tem setters - estado é **readonly** após construção. Operações que representariam "modificação" retornam **novo objeto** com valores alterados.

### Regra 4: Inicialização Completa no Construtor

```java
// ❌ Campos não inicializados: estado inválido
final class Configuracao {
    private final String host;
    private final int porta;  // Pode ficar 0 se não inicializado

    public Configuracao(String host) {
        this.host = host;
        // porta não inicializado - valor padrão 0
    }
}

// ✅ Todos campos inicializados
final class Configuracao {
    private final String host;
    private final int porta;

    public Configuracao(String host, int porta) {
        if (host == null || host.isEmpty()) {
            throw new IllegalArgumentException("Host obrigatório");
        }
        if (porta <= 0 || porta > 65535) {
            throw new IllegalArgumentException("Porta inválida");
        }
        this.host = host;
        this.porta = porta;
        // Todos campos inicializados e validados
    }
}
```

**Fundamento:** Construtor deve **inicializar todos campos** com valores válidos. Compilador Java exige que campos `final` sejam atribuídos exatamente uma vez. Validação no construtor garante que **objeto criado é sempre válido**.

### Regra 5: Cópias Defensivas para Mutáveis

```java
// ❌ Expõe referência mutável
final class Turma {
    private final List<String> alunos;

    public Turma(List<String> alunos) {
        this.alunos = alunos;  // ❌ Armazena referência externa
    }

    public List<String> getAlunos() {
        return alunos;  // ❌ Retorna referência interna
    }
}

// Cliente pode modificar:
List<String> lista = new ArrayList<>();
lista.add("João");
Turma t = new Turma(lista);
lista.add("Maria");  // ❌ Modificou interno de Turma
t.getAlunos().add("Pedro");  // ❌ Modificou interno

// ✅ Cópias defensivas entrada e saída
final class Turma {
    private final List<String> alunos;

    public Turma(List<String> alunos) {
        // Cópia defensiva na entrada
        this.alunos = new ArrayList<>(alunos);
    }

    public List<String> getAlunos() {
        // Cópia defensiva na saída
        return new ArrayList<>(alunos);

        // Alternativa: retornar imutável
        // return Collections.unmodifiableList(alunos);

        // Java 10+: List.copyOf
        // return List.copyOf(alunos);
    }
}

// Cliente não pode modificar:
List<String> lista = new ArrayList<>();
lista.add("João");
Turma t = new Turma(lista);
lista.add("Maria");  // ✅ Não afeta Turma (cópia interna)
t.getAlunos().add("Pedro");  // ✅ Não afeta Turma (retorna cópia)
```

**Fundamento:** Listas, arrays, `Date` são **mutáveis**. Armazenar referência direta ou retorná-la cria **porta dos fundos** para modificação. Cópia defensiva **duplica dados** - externo e interno são independentes.

**Alternativa:** Retornar `Collections.unmodifiableList()` ou `List.copyOf()` (Java 10+) evita alocação de cópia, mas lança exceção se cliente tentar modificar.

### Regra 6: Métodos Retornam Novos Objetos

```java
// ❌ Método modifica `this`
final class Contador {
    private int valor;

    public void incrementar() {
        valor++;  // ❌ Modifica este objeto
    }
}

// ✅ Método retorna novo objeto
final class Contador {
    private final int valor;

    public Contador(int valor) {
        this.valor = valor;
    }

    public Contador incrementar() {
        return new Contador(valor + 1);  // Novo objeto
    }

    public Contador decrementar() {
        return new Contador(valor - 1);
    }

    public int getValor() {
        return valor;
    }
}

// Uso:
Contador c1 = new Contador(10);
Contador c2 = c1.incrementar();  // c1 intacto, c2 é novo
System.out.println(c1.getValor());  // 10 - original não mudou
System.out.println(c2.getValor());  // 11 - novo objeto
```

**Fundamento:** Operações que representam "modificação" não alteram `this` - **criam e retornam novo objeto** com estado modificado. Objeto original permanece inalterado. Padrão é similar a `String`: `s1.toUpperCase()` não modifica `s1`, retorna nova string.

---

## 🔍 Análise Conceitual Profunda

### Checklist Completo de Imutabilidade

```java
// ✅ Classe COMPLETAMENTE imutável
final class Dinheiro {  // 1️⃣ Classe final
    // 2️⃣ Todos campos private final
    private final double valor;
    private final String moeda;

    // 4️⃣ Construtor inicializa e valida tudo
    public Dinheiro(double valor, String moeda) {
        if (valor < 0) {
            throw new IllegalArgumentException("Valor não pode ser negativo");
        }
        if (moeda == null || moeda.length() != 3) {
            throw new IllegalArgumentException("Moeda inválida (formato ISO 4217)");
        }
        this.valor = valor;
        this.moeda = moeda;
    }

    // Getters para leitura (primitivos e String imutável - sem cópia)
    public double getValor() { return valor; }
    public String getMoeda() { return moeda; }

    // 6️⃣ Métodos retornam novos objetos
    public Dinheiro somar(Dinheiro outro) {
        validarMesmaMoeda(outro);
        return new Dinheiro(this.valor + outro.valor, this.moeda);
    }

    public Dinheiro subtrair(Dinheiro outro) {
        validarMesmaMoeda(outro);
        return new Dinheiro(this.valor - outro.valor, this.moeda);
    }

    public Dinheiro multiplicar(double fator) {
        return new Dinheiro(this.valor * fator, this.moeda);
    }

    // Método auxiliar privado
    private void validarMesmaMoeda(Dinheiro outro) {
        if (!this.moeda.equals(outro.moeda)) {
            throw new IllegalArgumentException("Moedas diferentes");
        }
    }

    // equals e hashCode essenciais para value objects
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Dinheiro)) return false;
        Dinheiro outro = (Dinheiro) obj;
        return Double.compare(valor, outro.valor) == 0 &&
               moeda.equals(outro.moeda);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor, moeda);
    }

    @Override
    public String toString() {
        return String.format("%.2f %s", valor, moeda);
    }
}
```

**Análise:** Checklist completo: ✅ `final` class, ✅ `private final` campos, ✅ sem setters, ✅ construtor inicializa tudo, ✅ não há mutáveis (primitivo + String), ✅ operações retornam novos objetos. Classe é **provadamente imutável**.

### Imutabilidade com Objetos Mutáveis Internos

```java
// ✅ Imutável contendo Date (mutável)
final class Evento {
    private final String nome;
    private final Date data;  // Date é mutável!

    public Evento(String nome, Date data) {
        this.nome = nome;
        // 5️⃣ Cópia defensiva na entrada
        this.data = new Date(data.getTime());
    }

    public String getNome() {
        return nome;  // String é imutável - sem cópia
    }

    public Date getData() {
        // 5️⃣ Cópia defensiva na saída
        return new Date(data.getTime());
    }

    // Operação retorna novo objeto
    public Evento adiarPara(Date novaData) {
        return new Evento(nome, novaData);
    }
}

// Uso:
Date d = new Date();
Evento e = new Evento("Reunião", d);
d.setTime(0);  // ✅ Não afeta Evento (cópia interna)

Date d2 = e.getData();
d2.setTime(0);  // ✅ Não afeta Evento (retorna cópia)
```

**Análise:** Objetos mutáveis (`Date`, arrays, listas) requerem **cópias defensivas** em construtor (entrada) e getters (saída). Custo é alocação, benefício é imutabilidade preservada.

**Melhor Prática:** Usar tipos imutáveis quando possível (`LocalDate` vs `Date`, `List.of()` vs `ArrayList`).

### Builder para Classes Imutáveis Complexas

```java
// ✅ Imutável com Builder
final class Usuario {
    private final String login;
    private final String email;
    private final String nome;
    private final LocalDate dataNascimento;
    private final List<String> permissoes;

    // Construtor privado - só Builder cria
    private Usuario(Builder builder) {
        this.login = builder.login;
        this.email = builder.email;
        this.nome = builder.nome;
        this.dataNascimento = builder.dataNascimento;
        this.permissoes = List.copyOf(builder.permissoes);  // Imutável
    }

    // Builder interno (mutável durante construção)
    public static class Builder {
        private String login;
        private String email;
        private String nome;
        private LocalDate dataNascimento;
        private List<String> permissoes = new ArrayList<>();

        public Builder login(String login) {
            this.login = login;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }

        public Builder dataNascimento(LocalDate data) {
            this.dataNascimento = data;
            return this;
        }

        public Builder adicionarPermissao(String permissao) {
            this.permissoes.add(permissao);
            return this;
        }

        public Usuario build() {
            // Validação antes de construir
            if (login == null || login.isEmpty()) {
                throw new IllegalStateException("Login obrigatório");
            }
            if (email == null || !email.contains("@")) {
                throw new IllegalStateException("Email inválido");
            }
            return new Usuario(this);  // Constrói imutável
        }
    }

    // Getters
    public String getLogin() { return login; }
    public String getEmail() { return email; }
    public String getNome() { return nome; }
    public LocalDate getDataNascimento() { return dataNascimento; }
    public List<String> getPermissoes() { return permissoes; }  // Já imutável
}

// Uso:
Usuario user = new Usuario.Builder()
    .login("joao123")
    .email("joao@example.com")
    .nome("João Silva")
    .dataNascimento(LocalDate.of(1990, 5, 15))
    .adicionarPermissao("LEITURA")
    .adicionarPermissao("ESCRITA")
    .build();

// user é completamente imutável após build()
```

**Análise:** Builder é **mutável durante construção**, produz **imutável ao final**. Construtor privado garante que criação só ocorre via Builder. `List.copyOf()` (Java 10+) cria lista imutável - getter não precisa cópia defensiva.

### Objetos Imutáveis Aninhados

```java
// ✅ Imutável contendo outro imutável
final class Endereco {
    private final String rua;
    private final String cidade;
    private final String estado;

    public Endereco(String rua, String cidade, String estado) {
        this.rua = rua;
        this.cidade = cidade;
        this.estado = estado;
    }

    public String getRua() { return rua; }
    public String getCidade() { return cidade; }
    public String getEstado() { return estado; }
}

final class Cliente {
    private final String nome;
    private final Endereco endereco;  // Imutável aninhado

    public Cliente(String nome, Endereco endereco) {
        this.nome = nome;
        // Endereco é imutável - sem necessidade de cópia
        this.endereco = endereco;
    }

    public String getNome() { return nome; }

    public Endereco getEndereco() {
        // Endereco é imutável - pode retornar referência direta
        return endereco;
    }

    // "Modificar" endereço retorna novo Cliente
    public Cliente mudarEndereco(Endereco novoEndereco) {
        return new Cliente(nome, novoEndereco);
    }
}
```

**Análise:** Se campo é referência a **outro imutável**, não precisa de cópia defensiva - imutável não pode ser modificado. Getter pode retornar referência direta com segurança.

**Regra:** Cópia defensiva é necessária apenas para **objetos mutáveis** (listas, arrays, `Date`).

---

## 🎯 Aplicabilidade e Contextos

### Contexto: Value Objects Simples

```java
// ✅ Email como imutável
final class Email {
    private final String endereco;

    public Email(String endereco) {
        if (endereco == null || !endereco.matches("^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$")) {
            throw new IllegalArgumentException("Email inválido");
        }
        this.endereco = endereco.toLowerCase();
    }

    public String getEndereco() { return endereco; }

    public String getDominio() {
        return endereco.substring(endereco.indexOf('@') + 1);
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Email)) return false;
        return endereco.equals(((Email) obj).endereco);
    }

    @Override
    public int hashCode() {
        return endereco.hashCode();
    }
}
```

**Aplicabilidade:** Conceitos de domínio simples (Email, CPF, Telefone) devem ser imutáveis. Validação no construtor, sem setters, `equals`/`hashCode` baseados em valor.

### Contexto: Objetos de Configuração

```java
// ✅ Configuração imutável
final class DatabaseConfig {
    private final String host;
    private final int porta;
    private final String database;
    private final String usuario;
    private final int poolSize;

    public DatabaseConfig(String host, int porta, String database,
                          String usuario, int poolSize) {
        this.host = host;
        this.porta = porta;
        this.database = database;
        this.usuario = usuario;
        this.poolSize = poolSize;
    }

    // Getters...

    // "Modificar" retorna nova configuração
    public DatabaseConfig comPoolSize(int novoPoolSize) {
        return new DatabaseConfig(host, porta, database, usuario, novoPoolSize);
    }
}
```

**Aplicabilidade:** Configurações lidas uma vez e compartilhadas devem ser imutáveis. Thread-safe, podem ser cacheadas, passadas entre componentes sem medo de modificação.

---

## ⚠️ Limitações e Considerações

### Boilerplate: Muito Código Manual

```java
// Classe imutável simples requer muito código
final class Ponto {
    private final int x;
    private final int y;

    public Ponto(int x, int y) { ... }
    public int getX() { ... }
    public int getY() { ... }
    public Ponto mover(int dx, int dy) { ... }

    @Override
    public boolean equals(Object obj) { ... }

    @Override
    public int hashCode() { ... }

    @Override
    public String toString() { ... }
}

// Java 14+: Record reduz drasticamente
record Ponto(int x, int y) {
    public Ponto mover(int dx, int dy) {
        return new Ponto(x + dx, y + dy);
    }
}
// Gera automaticamente: final class, private final campos,
// construtor, getters, equals, hashCode, toString
```

**Limitação:** Criar classe imutável manualmente é **verboso**. Records (Java 14+) eliminam boilerplate, mas não estão em todas versões.

### Performance: Alocações em Loops

```java
// Imutável em loop: muitas alocações
Ponto p = new Ponto(0, 0);
for (int i = 0; i < 1000000; i++) {
    p = p.mover(1, 0);  // 1 milhão de objetos criados
}
```

**Consideração:** Em loops quentes, alocações podem impactar performance. Profiling deve confirmar se é problema real (na maioria dos casos, JVM otimiza suficientemente).

---

## 🔗 Interconexões Conceituais

### Relação com Encapsulamento

Imutabilidade é **encapsulamento máximo**: campos `private final`, sem setters, cópias defensivas. Estado completamente protegido contra modificação.

### Relação com Records (Java 14+)

Records são **sintaxe concisa para imutáveis**. `record Ponto(int x, int y)` gera automaticamente classe imutável completa.

### Relação com Functional Programming

Classes imutáveis permitem **programação funcional**: operações retornam novos valores, sem efeitos colaterais.

---

## 🚀 Evolução e Próximos Conceitos

### Progressão: Records

Próximo passo é dominar **records** (Java 14+): sintaxe concisa, validação customizada, métodos adicionais.

### Direção: Persistent Data Structures

Estruturas de dados imutáveis eficientes que **compartilham estrutura** entre versões para evitar cópias completas.

### Caminho: Bibliotecas de Imutabilidade

Ferramentas como **Immutables**, **Lombok @Value**, **AutoValue** geram código de classes imutáveis automaticamente.

---

## 📚 Conclusão

Criar classe imutável requer seguir 6 regras: (1) classe `final`, (2) campos `private final`, (3) sem setters, (4) construtor inicializa tudo, (5) cópias defensivas para mutáveis, (6) operações retornam novos objetos. Violação de qualquer regra quebra imutabilidade.

Dominar criação de imutáveis significa:
- Sempre marcar classe como `final` para impedir herança
- Declarar todos campos como `private final` sem exceção
- Eliminar setters completamente - sem modificação de estado
- Inicializar e validar todos campos no construtor
- Fazer cópias defensivas de coleções/arrays na entrada e saída
- Retornar novos objetos em operações, não modificar `this`
- Implementar `equals` e `hashCode` baseados em valor
- Usar Builder para classes complexas com muitos campos
- Preferir tipos imutáveis (`LocalDate`, `List.of()`) quando possível
- Reconhecer que boilerplate pode ser reduzido com records

Regras não são sugestões - são **requisitos obrigatórios**. Classe "quase imutável" com único campo não-final ou getter que expõe lista mutável perde todas garantias. Imutabilidade é propriedade binária: ou completa, ou inexistente. Seguir checklist garante corretude - objeto imutável é thread-safe, sem estados inconsistentes, sem efeitos colaterais. Investimento em disciplina de criação paga retorno em ausência de bugs de concorrência e simplicidade de raciocínio.
