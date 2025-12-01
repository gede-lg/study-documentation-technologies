# Defensive Copying e Exemplos Práticos de Imutabilidade

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Defensive copying** (cópia defensiva) é técnica de duplicar objetos mutáveis ao passá-los para dentro (construtor/setter) ou para fora (getter) de classe, garantindo que referências externas não possam modificar estado interno. É defesa contra **aliasing** - múltiplas referências ao mesmo objeto mutável que permitem modificação invisível.

Conceitualmente, defensive copying cria **isolamento de dados**: interno e externo têm cópias independentes, modificação em uma não afeta outra. Analogia: entregar cópia de documento ao invés de original - destinatário pode riscar, amassar, destruir cópia sem danificar original. Sem cópia defensiva, entregar original permite modificação não autorizada.

Propósito fundamental é **preservar imutabilidade** na presença de tipos mutáveis (`Date`, `ArrayList`, arrays). `final` impede reatribuição de referência, mas não impede modificação de objeto referenciado. Cópia defensiva **quebra compartilhamento** - cria dados independentes onde antes havia dados compartilhados.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Cópia na Entrada:** Duplicar parâmetros mutáveis no construtor/setter
2. **Cópia na Saída:** Duplicar campos mutáveis em getters
3. **Aliasing:** Problema de múltiplas referências ao mesmo objeto
4. **Profundidade:** Cópia superficial vs profunda (shallow vs deep copy)
5. **Custo:** Trade-off entre segurança e alocação de memória

---

## 🧠 Fundamentos Teóricos

### Problema: Aliasing Quebra Imutabilidade

```java
// ❌ SEM defensive copy: aliasing quebra imutabilidade
final class Evento {
    private final Date data;  // final na referência

    public Evento(Date data) {
        this.data = data;  // ❌ Armazena referência externa
    }

    public Date getData() {
        return data;  // ❌ Retorna referência interna
    }
}

// Cliente 1: cria evento
Date d = new Date();
Evento e = new Evento(d);

// Cliente 2: modifica data original
d.setTime(0);  // ❌ Modificou interno de Evento!

System.out.println(e.getData());  // Data foi alterada!

// Cliente 3: modifica via getter
Date d2 = e.getData();
d2.setTime(123456789);  // ❌ Modificou interno de Evento!

System.out.println(e.getData());  // Data foi alterada novamente!
```

**Problema:** `data` é `final` (referência não pode ser reatribuída), mas `Date` é mutável (objeto pode ser modificado). Cliente tem **alias** (referência ao mesmo objeto) - modificação externa afeta estado interno. Imutabilidade é **quebrada**.

### Solução: Defensive Copy Entrada e Saída

```java
// ✅ COM defensive copy: imutabilidade preservada
final class Evento {
    private final Date data;

    public Evento(Date data) {
        // ✅ Cópia defensiva na entrada
        this.data = new Date(data.getTime());
    }

    public Date getData() {
        // ✅ Cópia defensiva na saída
        return new Date(data.getTime());
    }
}

// Cliente 1: cria evento
Date d = new Date();
Evento e = new Evento(d);  // Cópia interna criada

// Cliente 2: modifica data original
d.setTime(0);  // ✅ NÃO afeta Evento (cópia independente)

System.out.println(e.getData());  // Data original preservada

// Cliente 3: modifica via getter
Date d2 = e.getData();  // Recebe cópia
d2.setTime(123456789);  // ✅ NÃO afeta Evento (modificou cópia)

System.out.println(e.getData());  // Data original preservada
```

**Solução:**
- **Entrada:** Construtor cria `new Date(data.getTime())` - cópia independente. Modificação no parâmetro original não afeta interno.
- **Saída:** Getter retorna `new Date(data.getTime())` - cópia independente. Cliente pode modificar cópia sem afetar interno.

**Fundamento:** Cópia defensiva **quebra aliasing** - cria dois objetos independentes onde antes havia dois ponteiros para mesmo objeto.

### Cópia Defensiva em Arrays

```java
// ❌ SEM defensive copy: array exposto
final class Turma {
    private final String[] alunos;

    public Turma(String[] alunos) {
        this.alunos = alunos;  // ❌ Armazena referência
    }

    public String[] getAlunos() {
        return alunos;  // ❌ Retorna referência
    }
}

// Cliente pode modificar:
String[] arr = {"João", "Maria"};
Turma t = new Turma(arr);
arr[0] = "Pedro";  // ❌ Modificou interno!
t.getAlunos()[1] = "Ana";  // ❌ Modificou interno!

// ✅ COM defensive copy: array protegido
final class Turma {
    private final String[] alunos;

    public Turma(String[] alunos) {
        // ✅ Cópia de array
        this.alunos = alunos.clone();
        // Ou: Arrays.copyOf(alunos, alunos.length)
    }

    public String[] getAlunos() {
        // ✅ Retorna cópia
        return alunos.clone();
        // Ou: Arrays.copyOf(alunos, alunos.length)
    }
}

// Cliente não pode modificar interno:
String[] arr = {"João", "Maria"};
Turma t = new Turma(arr);
arr[0] = "Pedro";  // ✅ Não afeta Turma
t.getAlunos()[1] = "Ana";  // ✅ Não afeta Turma (modificou cópia)
```

**Fundamento:** Arrays são mutáveis. `array.clone()` cria **cópia superficial** - novo array com mesmas referências. Para arrays de primitivos ou imutáveis (String), clone é suficiente.

### Cópia Defensiva em Coleções

```java
// ❌ SEM defensive copy: lista exposta
final class Carrinho {
    private final List<String> itens;

    public Carrinho(List<String> itens) {
        this.itens = itens;  // ❌ Armazena referência
    }

    public List<String> getItens() {
        return itens;  // ❌ Retorna referência
    }
}

// Cliente pode modificar:
List<String> lista = new ArrayList<>();
lista.add("Item1");
Carrinho c = new Carrinho(lista);
lista.add("Item2");  // ❌ Modificou interno!
c.getItens().add("Item3");  // ❌ Modificou interno!

// ✅ COM defensive copy: lista protegida
final class Carrinho {
    private final List<String> itens;

    public Carrinho(List<String> itens) {
        // ✅ Cópia de lista
        this.itens = new ArrayList<>(itens);
    }

    public List<String> getItens() {
        // ✅ Retorna cópia
        return new ArrayList<>(itens);

        // Alternativa: retornar imutável (sem alocação de cópia)
        // return Collections.unmodifiableList(itens);

        // Java 10+: List.copyOf (cria lista imutável)
        // return List.copyOf(itens);
    }
}

// Cliente não pode modificar interno:
List<String> lista = new ArrayList<>();
lista.add("Item1");
Carrinho c = new Carrinho(lista);
lista.add("Item2");  // ✅ Não afeta Carrinho
c.getItens().add("Item3");  // ✅ Não afeta (modificou cópia)
// Ou UnsupportedOperationException se retornou unmodifiable
```

**Fundamento:** Cópia de lista via `new ArrayList<>(lista)` cria **lista independente**. Alternativa é `Collections.unmodifiableList()` que retorna **view imutável** - não copia, mas lança exceção em modificação.

---

## 🔍 Análise Conceitual Profunda

### Cópia Superficial vs Profunda

```java
// Cópia superficial: copia referências, não objetos
class Pessoa {
    private String nome;
    public Pessoa(String nome) { this.nome = nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getNome() { return nome; }
}

// ❌ Cópia superficial não protege objetos mutáveis dentro da lista
final class Equipe {
    private final List<Pessoa> membros;

    public Equipe(List<Pessoa> membros) {
        this.membros = new ArrayList<>(membros);  // Cópia superficial
    }

    public List<Pessoa> getMembros() {
        return new ArrayList<>(membros);  // Cópia superficial
    }
}

// Problema:
Pessoa p1 = new Pessoa("João");
List<Pessoa> lista = List.of(p1);
Equipe e = new Equipe(lista);

lista.clear();  // ✅ Não afeta Equipe (lista é cópia)

List<Pessoa> copia = e.getMembros();
copia.add(new Pessoa("Maria"));  // ✅ Não afeta Equipe (lista é cópia)

// MAS:
copia.get(0).setNome("Pedro");  // ❌ Afeta Equipe!
// Pessoa dentro da lista é COMPARTILHADA (mesma referência)

System.out.println(e.getMembros().get(0).getNome());  // "Pedro"

// ✅ Cópia profunda: copia objetos recursivamente
final class EquipeProfunda {
    private final List<Pessoa> membros;

    public EquipeProfunda(List<Pessoa> membros) {
        // Cópia profunda: clona cada Pessoa
        this.membros = membros.stream()
            .map(p -> new Pessoa(p.getNome()))  // Nova Pessoa
            .collect(Collectors.toList());
    }

    public List<Pessoa> getMembros() {
        // Cópia profunda na saída
        return membros.stream()
            .map(p -> new Pessoa(p.getNome()))
            .collect(Collectors.toList());
    }
}

// Agora:
Pessoa p1 = new Pessoa("João");
EquipeProfunda ep = new EquipeProfunda(List.of(p1));

List<Pessoa> copia = ep.getMembros();
copia.get(0).setNome("Pedro");  // ✅ Não afeta EquipeProfunda (Pessoa é cópia)

System.out.println(ep.getMembros().get(0).getNome());  // "João"
```

**Análise:**
- **Cópia superficial:** `new ArrayList<>(lista)` copia **estrutura da lista**, não **objetos dentro**. Referências são copiadas, objetos são compartilhados.
- **Cópia profunda:** Copia **recursivamente** - lista nova + objetos novos dentro. Totalmente independente.

**Trade-off:** Cópia profunda é mais segura, mas **mais cara** (aloca muitos objetos). Necessária apenas se objetos internos são mutáveis.

**Melhor Solução:** Usar **objetos imutáveis** dentro de coleções - String, Integer, imutáveis customizados. Cópia superficial é suficiente.

### Alternativa: Collections.unmodifiable*

```java
// Retornar view imutável ao invés de cópia
final class Biblioteca {
    private final List<String> livros;

    public Biblioteca(List<String> livros) {
        this.livros = new ArrayList<>(livros);  // Cópia na entrada
    }

    public List<String> getLivros() {
        // Retorna view imutável (sem alocação)
        return Collections.unmodifiableList(livros);
    }
}

// Uso:
Biblioteca b = new Biblioteca(List.of("Livro1", "Livro2"));
List<String> lista = b.getLivros();

// lista.add("Livro3");  // ❌ UnsupportedOperationException
// lista.remove(0);      // ❌ UnsupportedOperationException

// Leitura OK:
System.out.println(lista.get(0));  // "Livro1"
```

**Análise:** `Collections.unmodifiableList()` cria **wrapper** que lança exceção em operações de modificação. Não copia dados - é view read-only. Mais eficiente que copiar, mas cliente recebe exceção se tentar modificar.

**Java 10+:** `List.copyOf(lista)` cria **lista imutável** (não view) - mais eficiente que `new ArrayList<>()`.

### Quando Cópia Defensiva Não é Necessária

```java
// ✅ Sem cópia: String é imutável
final class Usuario {
    private final String nome;

    public Usuario(String nome) {
        this.nome = nome;  // String é imutável - sem cópia
    }

    public String getNome() {
        return nome;  // Sem cópia
    }
}

// ✅ Sem cópia: LocalDate é imutável
final class Evento {
    private final LocalDate data;

    public Evento(LocalDate data) {
        this.data = data;  // LocalDate imutável - sem cópia
    }

    public LocalDate getData() {
        return data;  // Sem cópia
    }
}

// ✅ Sem cópia: objeto imutável customizado
final class Dinheiro {
    private final double valor;
    // Imutável
}

final class Produto {
    private final Dinheiro preco;

    public Produto(Dinheiro preco) {
        this.preco = preco;  // Dinheiro imutável - sem cópia
    }

    public Dinheiro getPreco() {
        return preco;  // Sem cópia
    }
}
```

**Análise:** Cópia defensiva é necessária apenas para **objetos mutáveis**. String, tipos primitivos, wrapper classes (Integer, Double), tipos de data/hora Java 8+ (LocalDate, LocalDateTime), objetos imutáveis customizados **não precisam** de cópia - não podem ser modificados.

**Regra:** Se tipo é imutável, pode compartilhar referência com segurança.

---

## 🎯 Aplicabilidade e Contextos

### Exemplo Completo: Classe Imutável com Cópias Defensivas

```java
// ✅ Classe completamente imutável com defensive copying
final class Pedido {
    private final String id;
    private final LocalDateTime dataCriacao;  // Imutável - sem cópia
    private final List<String> itens;         // Mutável - cópia necessária
    private final Map<String, Integer> quantidades;  // Mutável - cópia

    public Pedido(String id, List<String> itens, Map<String, Integer> quantidades) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("ID obrigatório");
        }
        this.id = id;
        this.dataCriacao = LocalDateTime.now();  // Imutável

        // Cópias defensivas na entrada
        this.itens = new ArrayList<>(itens);
        this.quantidades = new HashMap<>(quantidades);
    }

    public String getId() {
        return id;  // String imutável - sem cópia
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;  // LocalDateTime imutável - sem cópia
    }

    public List<String> getItens() {
        // Opção 1: Cópia
        return new ArrayList<>(itens);

        // Opção 2: View imutável (mais eficiente)
        // return Collections.unmodifiableList(itens);

        // Opção 3: Lista imutável (Java 10+)
        // return List.copyOf(itens);
    }

    public Map<String, Integer> getQuantidades() {
        return new HashMap<>(quantidades);
        // Ou: Collections.unmodifiableMap(quantidades)
        // Ou: Map.copyOf(quantidades)
    }

    // Operação retorna novo objeto
    public Pedido adicionarItem(String item, int quantidade) {
        List<String> novosItens = new ArrayList<>(itens);
        novosItens.add(item);

        Map<String, Integer> novasQuantidades = new HashMap<>(quantidades);
        novasQuantidades.put(item, quantidade);

        return new Pedido(id, novosItens, novasQuantidades);
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Pedido)) return false;
        Pedido outro = (Pedido) obj;
        return id.equals(outro.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
```

**Aplicabilidade:**
- `id` e `dataCriacao` são imutáveis - sem cópia
- `itens` e `quantidades` são mutáveis - cópia na entrada e saída
- Operações (`adicionarItem`) retornam novo objeto

### Exemplo: Date vs LocalDate

```java
// ❌ Date (mutável) - cópia necessária
final class EventoDate {
    private final Date data;

    public EventoDate(Date data) {
        this.data = new Date(data.getTime());  // Cópia
    }

    public Date getData() {
        return new Date(data.getTime());  // Cópia
    }
}

// ✅ LocalDate (imutável) - sem cópia
final class EventoLocalDate {
    private final LocalDate data;

    public EventoLocalDate(LocalDate data) {
        this.data = data;  // Sem cópia - imutável
    }

    public LocalDate getData() {
        return data;  // Sem cópia
    }

    public EventoLocalDate adiarPara(LocalDate novaData) {
        return new EventoLocalDate(novaData);
    }
}
```

**Melhor Prática:** Preferir **tipos imutáveis** (`LocalDate`, `LocalDateTime`) sobre mutáveis (`Date`, `Calendar`). Elimina necessidade de cópias defensivas.

---

## ⚠️ Limitações e Considerações

### Custo de Performance

```java
// Cópia em loop: muitas alocações
List<String> grande = new ArrayList<>(10000);
// ... popula lista

for (int i = 0; i < 1000; i++) {
    List<String> copia = new ArrayList<>(grande);  // 1000 cópias de 10000 elementos
}
```

**Limitação:** Cópias defensivas **alocam memória** e **copiam dados**. Para estruturas grandes copiadas frequentemente, pode haver impacto de performance.

**Mitigação:**
- Usar `Collections.unmodifiable*` (view sem cópia)
- Usar `List.copyOf()` Java 10+ (otimizado)
- Considerar bibliotecas de estruturas persistentes (Vavr)

### Cópia Profunda é Complexa

```java
// Cópia profunda recursiva é difícil de implementar corretamente
class No {
    private No esquerda;
    private No direita;
    private Object valor;

    // Como copiar árvore inteira?
    public No copiarProfundo() {
        No copia = new No();
        copia.valor = this.valor;  // E se valor for mutável?
        if (esquerda != null) {
            copia.esquerda = esquerda.copiarProfundo();  // Recursão
        }
        if (direita != null) {
            copia.direita = direita.copiarProfundo();
        }
        return copia;
    }
}
```

**Consideração:** Cópia profunda de estruturas complexas (grafos, árvores) é complicada. Melhor é **usar imutáveis** - elimina necessidade de cópia.

### Serialização Pode Quebrar Imutabilidade

```java
// Desserialização pode contornar construtor
final class Seguro implements Serializable {
    private final Date data;

    public Seguro(Date data) {
        this.data = new Date(data.getTime());  // Cópia defensiva
    }

    public Date getData() {
        return new Date(data.getTime());
    }
}

// Serializar e desserializar pode criar objeto sem passar pelo construtor
// Campos finais são setados diretamente - cópia defensiva não executa
```

**Limitação:** Serialização Java pode contornar construtor. Para imutabilidade completa, implementar `readObject()` customizado.

---

## 🔗 Interconexões Conceituais

### Relação com Imutabilidade

Defensive copying é **técnica para preservar imutabilidade** quando classe contém campos mutáveis. Sem cópias, imutabilidade é quebrada por aliasing.

### Relação com Encapsulamento

Cópias defensivas são **mecanismo de encapsulamento** - garantem que interno não é afetado por externo. Protegem invariantes.

### Relação com Thread-Safety

Objetos imutáveis com defensive copying são **thread-safe**: cópias garantem que threads não compartilham dados mutáveis.

---

## 🚀 Evolução e Próximos Conceitos

### Progressão: Persistent Data Structures

Estruturas de dados imutáveis que **compartilham estrutura** entre versões para evitar cópias completas (árvores AVL persistentes).

### Direção: Records com Validação

Records Java 14+ simplificam imutáveis. Próximo passo é adicionar validação e cópias defensivas em compact constructors.

### Caminho: Bibliotecas Imutáveis

Ferramentas como Vavr, Immutables, Guava fornecem coleções imutáveis otimizadas.

---

## 📚 Conclusão

Defensive copying é técnica de duplicar objetos mutáveis na entrada (construtor) e saída (getter) para preservar imutabilidade. Quebra aliasing, cria isolamento de dados. Necessária para Date, arrays, coleções. Desnecessária para String, primitivos, LocalDate, imutáveis customizados.

Dominar defensive copying significa:
- Identificar quando campos são mutáveis (Date, List, array)
- Copiar na entrada: `new ArrayList<>(parametro)` no construtor
- Copiar na saída: `new ArrayList<>(campo)` no getter
- Usar `Collections.unmodifiable*` para view imutável sem custo de cópia
- Preferir `List.copyOf()` Java 10+ para listas imutáveis otimizadas
- Reconhecer diferença entre cópia superficial e profunda
- Saber que imutáveis (String, LocalDate) não precisam cópia
- Entender trade-off: segurança vs alocação
- Preferir tipos imutáveis quando possível para eliminar necessidade de cópias
- Implementar `clone()` ou copy constructors para cópias profundas

Defensive copying não é paranoia - é **proteção essencial** contra aliasing. Única referência mutável compartilhada destrói todas garantias de imutabilidade. Custo de alocação é pequeno comparado a bugs de modificação concorrente. String usa defensive copying há décadas - código correto que copia é melhor que código rápido com race conditions. Preferir tipos imutáveis (LocalDate) sobre mutáveis (Date) elimina necessidade de cópias e simplifica código.
