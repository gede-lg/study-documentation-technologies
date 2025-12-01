# Conceito de Objetos Imutáveis

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Objeto imutável** é objeto cujo estado não pode ser modificado após construção. Uma vez criado com valores específicos, esses valores permanecem constantes durante toda vida do objeto. Toda "modificação" resulta em **novo objeto** com valores alterados, objeto original permanece inalterado.

Conceitualmente, imutabilidade é **garantia temporal**: estado no momento da construção é estado para sempre. Analogia: número 5 nunca vira 6 - operação `5 + 1` não modifica 5, cria novo número 6. Strings em Java funcionam igual: `"abc".toUpperCase()` não modifica `"abc"`, retorna nova string `"ABC"`.

Propósito fundamental é **simplicidade e segurança**: objeto imutável não precisa de sincronização (thread-safe por natureza), não pode entrar em estado inválido (sem setters que violem invariantes), pode ser compartilhado livremente (sem medo de modificação externa). É **eliminação de classe inteira de bugs** - race conditions, estados inconsistentes, efeitos colaterais inesperados.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Estado Fixo:** Valores definidos na construção não mudam nunca
2. **Sem Setters:** Nenhum método modifica atributos internos
3. **Operações Criam Novos Objetos:** Transformações retornam instância nova
4. **Thread-Safe:** Múltiplas threads podem acessar sem sincronização
5. **Final em Campos:** Atributos marcados `final` impedem reatribuição

---

## 🧠 Fundamentos Teóricos

### Objeto Imutável vs Objeto Mutável

```java
// ❌ Mutável: estado pode mudar após construção
class PontoMutavel {
    private int x;
    private int y;

    public PontoMutavel(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void setX(int x) { this.x = x; }  // Modifica estado
    public void setY(int y) { this.y = y; }  // Modifica estado

    public int getX() { return x; }
    public int getY() { return y; }
}

// Uso:
PontoMutavel p = new PontoMutavel(10, 20);
System.out.println(p.getX());  // 10
p.setX(50);  // ❌ Estado mudou!
System.out.println(p.getX());  // 50 - objeto modificado

// ✅ Imutável: estado fixo após construção
class PontoImutavel {
    private final int x;  // final impede reatribuição
    private final int y;

    public PontoImutavel(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Sem setters - não há como modificar

    public int getX() { return x; }
    public int getY() { return y; }

    // Operações retornam NOVO objeto
    public PontoImutavel mover(int dx, int dy) {
        return new PontoImutavel(x + dx, y + dy);
    }
}

// Uso:
PontoImutavel p1 = new PontoImutavel(10, 20);
System.out.println(p1.getX());  // 10
PontoImutavel p2 = p1.mover(5, 0);  // Novo objeto
System.out.println(p1.getX());  // 10 - original não mudou!
System.out.println(p2.getX());  // 15 - novo objeto
```

**Fundamento:** Mutável permite modificação in-place (`setX` altera objeto existente). Imutável proíbe modificação - operações retornam **novo objeto**, original permanece intacto.

### Imutabilidade em Strings

```java
// String é imutável em Java
String s1 = "abc";
String s2 = s1.toUpperCase();  // Retorna NOVA string

System.out.println(s1);  // "abc" - original não mudou
System.out.println(s2);  // "ABC" - nova instância

// Todos métodos de String retornam nova instância:
String s3 = s1.concat("def");    // s1 não mudou, s3 é nova
String s4 = s1.replace('a', 'x'); // s1 não mudou, s4 é nova
String s5 = s1.substring(1);      // s1 não mudou, s5 é nova

// s1 continua "abc" sempre!
```

**Fundamento:** `String` é exemplo clássico de imutabilidade em Java. Toda "modificação" (`toUpperCase`, `concat`, `replace`) retorna nova `String`, original nunca muda. Isso permite otimizações (string pool) e segurança (strings podem ser chaves de HashMap sem medo de mudança).

### Atributos `final` Como Garantia

```java
class Pessoa {
    private final String nome;  // final = só pode atribuir UMA vez
    private final int idade;

    public Pessoa(String nome, int idade) {
        this.nome = nome;  // Atribuição única no construtor
        this.idade = idade;
    }

    // ❌ ERRO: não compila
    // public void setNome(String nome) {
    //     this.nome = nome;  // final não pode ser reatribuído
    // }

    public String getNome() { return nome; }
    public int getIdade() { return idade; }

    // Operação retorna novo objeto
    public Pessoa envelhecer() {
        return new Pessoa(nome, idade + 1);
    }
}
```

**Fundamento:** `final` em atributo significa **atribuição única** - só pode receber valor no construtor (ou inline na declaração). Tentativa de reatribuir gera erro de compilação. É **garantia de linguagem** de imutabilidade.

---

## 🔍 Análise Conceitual Profunda

### Imutabilidade Profunda vs Superficial

```java
// ❌ Imutabilidade SUPERFICIAL (não verdadeira)
class TurmaSuperficial {
    private final List<String> alunos;  // final na referência

    public TurmaSuperficial(List<String> alunos) {
        this.alunos = alunos;  // Armazena referência
    }

    public List<String> getAlunos() {
        return alunos;  // Retorna referência
    }
}

// Uso:
List<String> lista = new ArrayList<>();
lista.add("João");
TurmaSuperficial t = new TurmaSuperficial(lista);
lista.add("Maria");  // ❌ Modifica interno da turma!
t.getAlunos().add("Pedro");  // ❌ Modifica interno!

// ✅ Imutabilidade PROFUNDA (verdadeira)
class TurmaProfunda {
    private final List<String> alunos;

    public TurmaProfunda(List<String> alunos) {
        // Cópia defensiva na entrada
        this.alunos = new ArrayList<>(alunos);
    }

    public List<String> getAlunos() {
        // Cópia defensiva na saída OU imutável
        return Collections.unmodifiableList(alunos);
    }
}

// Uso:
List<String> lista = new ArrayList<>();
lista.add("João");
TurmaProfunda t = new TurmaProfunda(lista);
lista.add("Maria");  // ✅ NÃO afeta turma (cópia interna)
// t.getAlunos().add("Pedro");  // ❌ ERRO: UnsupportedOperationException
```

**Análise:** `final` apenas impede **reatribuição da referência** (`alunos = outraLista`), não impede **modificação do objeto referenciado** (`alunos.add(...)`). Imutabilidade superficial tem `final` mas expõe objetos mutáveis. Imutabilidade profunda usa **cópias defensivas** ou retorna coleções imutáveis.

### Wrapper Classes Como Imutáveis

```java
// Integer, Double, Boolean, etc. são imutáveis
Integer num1 = 10;
Integer num2 = num1 + 5;  // Cria NOVO Integer com valor 15

System.out.println(num1);  // 10 - original não mudou
System.out.println(num2);  // 15 - novo objeto

// Não há setters em Integer:
// num1.setValue(20);  // ❌ Não existe método setValue

// LocalDate (Java 8+) é imutável
LocalDate data1 = LocalDate.of(2024, 1, 15);
LocalDate data2 = data1.plusDays(10);  // Novo objeto

System.out.println(data1);  // 2024-01-15 - não mudou
System.out.println(data2);  // 2024-01-25 - nova data
```

**Análise:** Wrapper classes (`Integer`, `Double`) e classes de data/hora do Java 8+ (`LocalDate`, `LocalDateTime`) são **imutáveis por design**. Operações matemáticas ou temporais retornam novas instâncias. Isso contrasta com `Date` legado que é mutável (`date.setTime()` modifica objeto).

### Value Objects Imutáveis

```java
// ✅ Dinheiro como Value Object imutável
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

    public double getValor() { return valor; }
    public String getMoeda() { return moeda; }

    // Operações retornam novos objetos
    public Dinheiro somar(Dinheiro outro) {
        if (!this.moeda.equals(outro.moeda)) {
            throw new IllegalArgumentException("Moedas diferentes");
        }
        return new Dinheiro(this.valor + outro.valor, this.moeda);
    }

    public Dinheiro multiplicar(double fator) {
        return new Dinheiro(this.valor * fator, this.moeda);
    }

    public Dinheiro aplicarDesconto(double percentual) {
        return new Dinheiro(this.valor * (1 - percentual / 100), this.moeda);
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Dinheiro)) return false;
        Dinheiro outro = (Dinheiro) obj;
        return this.valor == outro.valor && this.moeda.equals(outro.moeda);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor, moeda);
    }
}

// Uso:
Dinheiro preco = new Dinheiro(100, "BRL");
Dinheiro desconto = preco.aplicarDesconto(10);  // 90 BRL
Dinheiro total = preco.multiplicar(3);          // 300 BRL

System.out.println(preco.getValor());    // 100 - original intacto
System.out.println(desconto.getValor()); // 90 - novo objeto
System.out.println(total.getValor());    // 300 - novo objeto
```

**Análise:** Value Objects de domínio (Dinheiro, Email, CPF) são **candidatos naturais à imutabilidade**. Representam valores conceituais que não "mudam" - 100 BRL não vira 90 BRL, você cria novo valor. Classe `final` impede herança que poderia quebrar imutabilidade.

### Imutabilidade e Identidade

```java
// Objetos mutáveis: identidade importa
class ContaMutavel {
    private double saldo;

    public void depositar(double valor) {
        saldo += valor;  // Modifica ESTE objeto
    }
}

ContaMutavel c1 = new ContaMutavel();
ContaMutavel c2 = c1;  // Mesma referência
c1.depositar(100);
System.out.println(c2.getSaldo());  // 100 - compartilham estado!

// Objetos imutáveis: valor importa, identidade não
Integer num1 = 100;
Integer num2 = num1;   // Mesma referência OU não - não importa
Integer num3 = 100;    // Pode ser mesma instância (pool)

System.out.println(num1 == num2);  // true (mesma referência)
System.out.println(num1 == num3);  // true (integer pool -128 a 127)
System.out.println(num1.equals(num3));  // true (mesmo valor)

// Com imutáveis, equals/hashCode são essenciais, == não confiável
```

**Análise:** Objetos mutáveis dependem de **identidade** (`==`) - duas contas com mesmo saldo são contas diferentes, modificar uma não afeta outra. Objetos imutáveis dependem de **valor** (`equals`) - dois `Integer(100)` são equivalentes, identidade é irrelevante. Imutabilidade permite **pooling** (reusar instâncias com mesmo valor).

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Imutabilidade

```java
// ✅ Value Objects de domínio
class Email {
    private final String endereco;
    // Imutável - email não "muda", você cria novo email
}

// ✅ Chaves de coleções
Map<Dinheiro, String> cache = new HashMap<>();
Dinheiro chave = new Dinheiro(100, "BRL");
cache.put(chave, "valor");
// Se Dinheiro fosse mutável e mudasse, chave seria "perdida"

// ✅ Dados compartilhados entre threads
class ConfiguracaoImutavel {
    private final String host;
    private final int porta;
    // Múltiplas threads podem ler sem sincronização
}

// ✅ Parâmetros de método que não devem mudar
public void processar(final LocalDate data) {
    // data não pode ser modificado (LocalDate é imutável)
    // Garantia de que método não tem efeito colateral em parâmetro
}
```

**Aplicabilidade:** Imutabilidade é ideal para **valores** (não entidades), **dados compartilhados** (thread-safety), **chaves de coleções** (hashCode/equals estáveis), **configurações** (lidas por muitos, não modificadas).

### Quando Mutabilidade é Necessária

```java
// ❌ Entidades com ciclo de vida
class Pedido {
    private StatusPedido status;  // Muda ao longo do tempo
    private List<ItemPedido> itens;  // Adiciona/remove itens

    public void adicionarItem(ItemPedido item) {
        itens.add(item);  // Modifica estado
    }

    public void finalizar() {
        status = StatusPedido.FINALIZADO;  // Transição de estado
    }
}

// ❌ Builders para construção complexa
class RelatorioBuilder {
    private String titulo;
    private List<String> colunas = new ArrayList<>();

    public RelatorioBuilder titulo(String titulo) {
        this.titulo = titulo;  // Mutável durante construção
        return this;
    }

    public RelatorioBuilder adicionarColuna(String coluna) {
        colunas.add(coluna);  // Mutável
        return this;
    }

    public Relatorio build() {
        return new Relatorio(this);  // Constrói imutável
    }
}
```

**Contexto:** Mutabilidade é apropriada para **entidades** com ciclo de vida (Pedido muda de status), **builders** (mutáveis durante construção, produzem imutável), **buffers** (StringBuilder, ByteArrayOutputStream).

---

## ⚠️ Limitações e Considerações

### Performance: Criação de Objetos

```java
// Imutável: muitas alocações
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado = resultado + i;  // Cria 1000 Strings novas!
}

// Mutável: uma alocação
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);  // Modifica buffer interno
}
String resultado = sb.toString();  // Uma String no final
```

**Limitação:** Imutabilidade gera **alocação de objetos** em cada operação. Para loops ou transformações em cadeia, custo pode ser significativo. `StringBuilder` (mutável) vs `String` (imutável) é trade-off clássico.

### Imutabilidade de Referências ≠ Imutabilidade de Objetos

```java
// final na referência, objeto mutável
final List<String> lista = new ArrayList<>();
lista.add("A");  // ✅ Permitido - modifica objeto
// lista = new ArrayList<>();  // ❌ ERRO - não pode reatribuir

// final não torna objeto imutável!
```

**Consideração:** `final` impede **reatribuição** (`lista = ...`), não impede **modificação do objeto** (`lista.add(...)`). Imutabilidade requer `final` + objeto imutável + cópias defensivas.

### Cuidado com Herança

```java
// ❌ Classe imutável sem final pode ser quebrada
class PontoImutavel {
    private final int x;
    private final int y;
    // ...
}

// Subclasse adiciona mutabilidade!
class PontoMutavel extends PontoImutavel {
    private int z;
    public void setZ(int z) { this.z = z; }  // Mutável!
}

// ✅ Classe final impede herança
final class PontoImutavel {
    private final int x;
    private final int y;
    // Ninguém pode estender e adicionar mutabilidade
}
```

**Limitação:** Herança pode **quebrar imutabilidade** - subclasse adiciona campos mutáveis. Classe imutável deve ser `final` ou ter construtor privado.

---

## 🔗 Interconexões Conceituais

### Relação com Encapsulamento

Imutabilidade é **encapsulamento extremo**: sem setters, estado completamente protegido. Não há risco de violação de invariantes porque estado nunca muda após validação inicial no construtor.

### Relação com Thread-Safety

Objetos imutáveis são **thread-safe por construção**: múltiplas threads podem ler sem sincronização porque estado nunca muda. Elimina race conditions, elimina necessidade de `synchronized`.

### Relação com Functional Programming

Imutabilidade é princípio fundamental de **programação funcional**: funções puras operam em valores imutáveis, retornam novos valores. Streams Java 8+ favorecem transformações de imutáveis.

---

## 🚀 Evolução e Próximos Conceitos

### Progressão: Defensive Copying

Próximo passo é dominar **cópias defensivas**: quando copiar na entrada (construtor/setter), quando copiar na saída (getter), como fazer cópias profundas vs superficiais.

### Direção: Records (Java 14+)

Java 14+ introduz **records** - classes imutáveis automáticas com sintaxe concisa. Record elimina boilerplate de classes imutáveis (`final` campos, construtor, getters, `equals`, `hashCode`).

### Caminho: Persistent Data Structures

Estruturas de dados imutáveis eficientes (árvores persistentes, listas imutáveis com compartilhamento estrutural) permitem imutabilidade **sem custo de cópia total**. Bibliotecas como Vavr, Immutables.

---

## 📚 Conclusão

Objeto imutável é objeto cujo estado não pode ser modificado após construção. Campos `final`, sem setters, operações retornam novos objetos. Benefícios: thread-safety automática, simplicidade (sem estados inconsistentes), segurança (sem violação de invariantes).

Dominar conceito de imutabilidade significa:
- Reconhecer que imutabilidade é estado fixo após construção
- Usar `final` em todos campos de classe imutável
- Eliminar setters - não há modificação de estado
- Fazer operações retornarem novos objetos, não modificar existente
- Aplicar cópias defensivas para imutabilidade profunda
- Marcar classe como `final` para impedir herança mutável
- Implementar `equals` e `hashCode` (valor importa, identidade não)
- Usar imutabilidade em value objects, chaves, configurações
- Reconhecer quando mutabilidade é apropriada (entidades, builders)
- Entender trade-off: simplicidade vs performance (alocações)

Imutabilidade não é complexidade adicional - é **simplificação**: elimina sincronização, elimina estados inválidos, elimina efeitos colaterais. String, Integer, LocalDate são imutáveis porque simplicidade e segurança valem mais que performance de modificação in-place. É escolha de design que favorece corretude sobre velocidade - e na maioria dos casos, JVM otimiza alocações suficientemente que não há custo mensurável.
