# Sobrescrita de Métodos Default

## 🎯 Introdução e Definição

### Definição Conceitual

A **sobrescrita de métodos default** é o mecanismo pelo qual uma classe que implementa uma interface pode fornecer sua própria implementação para um método default, substituindo o comportamento padrão fornecido pela interface. Este processo é conceitualmente idêntico à sobrescrita de métodos em herança de classes (override), mas aplicado ao contexto de interfaces com métodos default.

Quando uma classe sobrescreve um método default, ela está exercendo seu **direito de personalização** - reconhecendo que a implementação padrão existe e está disponível, mas decidindo que, para aquele contexto específico, uma implementação diferente é mais apropriada. A sobrescrita é completamente **opcional**: se a implementação padrão atende às necessidades, a classe simplesmente não fornece sua própria versão.

Conceitualmente, a sobrescrita de métodos default representa um **contrato flexível** - a interface diz "aqui está uma forma razoável de fazer isso, mas se você souber melhor para seu caso, fique à vontade para fazer diferente". Isso contrasta com métodos abstratos, que dizem "você DEVE implementar isso, sem exceções".

### Contexto Histórico e Motivação

Antes do Java 8, sobrescrita existia apenas para:
1. Métodos concretos de **superclasses** (herança de classes)
2. Métodos abstratos de **interfaces** (mas "sobrescrita" de método abstrato é tecnicamente "implementação inicial", não sobrescrita de comportamento existente)

Com a introdução de métodos default no Java 8, surgiu uma terceira categoria: **sobrescrita de comportamento padrão de interface**. Esta funcionalidade foi essencial para o design dos métodos default, pois sem capacidade de sobrescrita, métodos default seriam inflexíveis - ou você aceita o comportamento padrão ou não pode usar a interface.

**Motivação para Sobrescrita:**

**1. Otimização:** A implementação padrão pode ser genérica e funcional, mas não otimizada. Implementações específicas podem ter acesso a estruturas de dados ou algoritmos mais eficientes.

**Exemplo Real - `Collection.isEmpty()`:**
```java
interface Collection<E> {
    int size();

    // Implementação padrão - funcional mas não ótima
    default boolean isEmpty() {
        return size() == 0;
    }
}

class LinkedList<E> implements Collection<E> {
    private Node head;

    // Sobrescreve para otimização
    @Override
    public boolean isEmpty() {
        return head == null;  // O(1) ao invés de calcular size() que pode ser O(n)
    }
}
```

**2. Comportamento Específico de Domínio:** A implementação genérica pode não capturar nuances do domínio específico da classe implementadora.

**3. Integração com Estado Interno:** Método default não tem acesso ao estado da classe implementadora. Sobrescrita permite integração com campos e lógica interna.

### Problema Fundamental que Resolve

Sobrescrita de métodos default resolve tensões entre **generalidade e especificidade**:

**1. Dilema da Implementação Genérica:**
Sem sobrescrita, métodos default teriam que ser "one-size-fits-all" - funcionais para todos os casos, mas ótimos para nenhum. Sobrescrita permite que implementação padrão seja "boa o suficiente", sabendo que casos especiais podem refinar.

**2. Problema de Performance:**
Algoritmos genéricos raramente são os mais eficientes. Sobrescrita permite que implementações com conhecimento de estruturas internas otimizem operações críticas.

**3. Questão de Semântica:**
Método default pode ter semântica geral, mas implementações específicas podem ter nuances. Sobrescrita permite ajustar comportamento mantendo contrato.

**4. Evolução de Implementações:**
Uma implementação pode inicialmente usar comportamento padrão (rápido de desenvolver), mas depois sobrescrever para otimizar quando necessário, sem mudar interface pública.

### Importância no Ecossistema Java

Sobrescrita de métodos default é onipresente no código Java moderno:

**Collections Framework:**
```java
// List tem método default sort()
interface List<E> {
    default void sort(Comparator<? super E> c) {
        Object[] a = this.toArray();
        Arrays.sort(a, (Comparator) c);
        // ... copia array ordenado de volta
    }
}

// ArrayList sobrescreve para otimização
class ArrayList<E> implements List<E> {
    @Override
    public void sort(Comparator<? super E> c) {
        Arrays.sort(elementData, 0, size, c);  // Mais eficiente - acessa array interno diretamente
        modCount++;
    }
}
```

**Comparator e Functional Interfaces:**
Implementações customizadas frequentemente sobrescrevem métodos default para comportamento específico:
```java
Comparator<String> customComparator = new Comparator<String>() {
    public int compare(String a, String b) { ... }

    // Sobrescreve default para lógica específica
    @Override
    public Comparator<String> reversed() {
        return new CustomReversedComparator();  // Implementação específica
    }
};
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Sobrescrita Opcional:** Classes podem escolher usar implementação padrão ou fornecer própria

2. **Anotação @Override:** Recomendada (mas opcional) para documentar intenção e detectar erros

3. **Mesmas Regras de Sobrescrita:** Assinatura idêntica, visibilidade igual ou maior, sem adicionar checked exceptions

4. **Acesso a Implementação Padrão:** Classe pode chamar versão default usando `InterfaceName.super.metodo()`

5. **Polimorfismo Pleno:** Métodos sobrescritos participam normalmente de polimorfismo

### Pilares Fundamentais

- **Liberdade de Escolha:** Usar padrão ou personalizar
- **Otimização Contextual:** Sobrescrever quando você tem implementação melhor
- **Manutenção de Contrato:** Sobrescrita deve respeitar semântica do contrato
- **Evolução Incremental:** Começar com padrão, otimizar depois
- **Verificação em Compile-Time:** Compilador valida sobrescrita correta

### Visão Geral das Nuances

- **Múltiplas Interfaces:** Se múltiplas interfaces têm mesmo método default, classe DEVE sobrescrever (resolver ambiguidade)
- **Hierarquia de Interfaces:** Interface filha pode sobrescrever método default de interface pai
- **Prioridade de Implementação:** Implementação em classe supera método default de interface
- **Chamada Explícita:** `NomeInterface.super.metodo()` permite chamar versão default mesmo ao sobrescrever

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Mecanismo de Resolução de Método

Quando um método é chamado em um objeto, a JVM segue hierarquia de resolução:

**Ordem de Prioridade (do mais específico ao mais geral):**

1. **Implementação concreta na classe** (ou superclasse mais próxima)
2. **Método default da interface** (se não sobrescrito)
3. **Erro de compilação** (se método abstrato não implementado)

```java
interface A {
    default void metodo() {
        System.out.println("A default");
    }
}

class B implements A {
    @Override
    public void metodo() {
        System.out.println("B sobrescreve");
    }
}

class C implements A {
    // Não sobrescreve - usa default de A
}

B b = new B();
b.metodo();  // "B sobrescreve" - implementação de classe tem prioridade

C c = new C();
c.metodo();  // "A default" - usa método default da interface
```

**Princípio:** **Classes ganham de interfaces**. Se classe tem implementação, ela é usada; caso contrário, fallback para método default da interface.

#### Sobrescrita e Polimorfismo

```java
interface Animal {
    default void fazerSom() {
        System.out.println("Som genérico");
    }
}

class Cachorro implements Animal {
    @Override
    public void fazerSom() {
        System.out.println("Au au!");
    }
}

class Gato implements Animal {
    @Override
    public void fazerSom() {
        System.out.println("Miau!");
    }
}

class Peixe implements Animal {
    // Não sobrescreve - usa default (peixe não faz som audível)
}

// Polimorfismo
List<Animal> animais = Arrays.asList(new Cachorro(), new Gato(), new Peixe());
for (Animal animal : animais) {
    animal.fazerSom();
}
// Saída:
// Au au!
// Miau!
// Som genérico
```

**Conceito:** Polimorfismo funciona perfeitamente - cada tipo pode ter implementação diferente (sobrescrita) ou usar padrão.

### Princípios e Conceitos Subjacentes

#### Princípio da Substituição de Liskov (LSP)

Sobrescritas devem **respeitar o contrato** do método original:

**Contrato implícito do método default:**
- Pré-condições (o que deve ser verdade antes)
- Pós-condições (o que será verdade depois)
- Invariantes (o que sempre é verdade)

**Exemplo de Violação:**
```java
interface Contador {
    default int incrementar(int valor) {
        return valor + 1;  // Contrato: incrementa em 1
    }
}

class ContadorQuebrado implements Contador {
    @Override
    public int incrementar(int valor) {
        return valor * 2;  // ❌ VIOLA contrato - multiplica ao invés de incrementar
    }
}
```

**Princípio:** Sobrescrita pode mudar **como** algo é feito, mas não **o que** é feito (semântica).

#### Princípio da Otimização Responsável

Sobrescrever para otimização é válido, mas deve:
1. **Manter semântica:** Resultado final idêntico ao default (ou aceitavelmente similar)
2. **Justificar complexidade:** Otimização deve valer a pena (não otimize prematuramente)
3. **Documentar:** Explicar por que sobrescreve e qual ganho

**Exemplo Correto:**
```java
interface Repository<T> {
    List<T> findAll();

    default long count() {
        return findAll().size();  // Funcional mas ineficiente (carrega tudo)
    }
}

class DatabaseRepository<T> implements Repository<T> {
    @Override
    public long count() {
        // Otimização: COUNT(*) SQL é muito mais rápido que carregar todos os registros
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tableName, Long.class);
    }
}
```

### Relação com Outros Conceitos da Linguagem

#### Sobrescrita de Default vs Sobrescrita de Método de Classe

**Semelhanças:**
- Mesma sintaxe (`@Override`)
- Mesmas regras (assinatura idêntica, visibilidade)
- Mesmo polimorfismo

**Diferenças:**
- **Método de classe:** Sobrescreve implementação concreta de superclasse
- **Método default:** Sobrescreve implementação em interface (não em hierarquia de classes)
- **Acesso ao original:** Superclasse usa `super.metodo()`; interface usa `InterfaceName.super.metodo()`

#### Sobrescrita e Herança Múltipla de Comportamento

Java não permite herança múltipla de classes, mas permite implementar múltiplas interfaces. Se múltiplas interfaces têm método default com mesma assinatura, classe DEVE sobrescrever:

```java
interface A {
    default void metodo() { System.out.println("A"); }
}

interface B {
    default void metodo() { System.out.println("B"); }
}

class C implements A, B {
    // ❌ ERRO DE COMPILAÇÃO se não sobrescrever
    // Qual metodo() usar? A ou B? Ambíguo!

    @Override
    public void metodo() {
        // Deve resolver explicitamente
        A.super.metodo();  // Ou B.super.metodo(), ou implementação própria
    }
}
```

**Conceito:** Sobrescrita é **obrigatória** em caso de conflito, mas **opcional** se não há conflito.

### Modelo Mental para Compreensão

#### Metáfora: "Sugestão Sobrescrevível"

Método default é como **sugestão do GPS**:
- **Default:** "Rota sugerida: via rodovia principal"
- **Sobrescrita:** "Eu conheço atalho melhor - vou por aqui"

**Analogia:**
- GPS fornece rota padrão razoável (método default)
- Motorista experiente pode conhecer caminho melhor para seu carro/horário (sobrescrita)
- Mas ambos chegam ao destino (mantém contrato)

#### Modelo: "Template com Customização"

```
Interface (fornece template)
  └── Método default (implementação genérica)
        ├── Classe A: usa default (aceita template)
        ├── Classe B: sobrescreve (customiza)
        └── Classe C: sobrescreve (otimiza)
```

Cada classe decide se template genérico é suficiente ou se customização é necessária.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe de Sobrescrita

#### Sobrescrita Básica

```java
interface Processador {
    default void processar(String input) {
        System.out.println("Processamento padrão: " + input);
    }
}

class ProcessadorCustomizado implements Processador {
    @Override  // Recomendado - documenta intenção
    public void processar(String input) {
        System.out.println("Processamento customizado: " + input.toUpperCase());
    }
}
```

**Regras:**
- Assinatura **idêntica** (nome, parâmetros, tipo de retorno)
- Visibilidade **public** (métodos de interface são sempre public)
- `@Override` recomendado mas opcional

#### Sobrescrita com Chamada ao Default

```java
interface Logger {
    default void log(String mensagem) {
        System.out.println("[LOG] " + mensagem);
    }
}

class FileLogger implements Logger {
    @Override
    public void log(String mensagem) {
        // Chama implementação default primeiro
        Logger.super.log(mensagem);

        // Adiciona comportamento extra
        salvarEmArquivo(mensagem);
    }

    private void salvarEmArquivo(String msg) {
        // Implementação...
    }
}
```

**Padrão:** **Decorator pattern** - envolve comportamento padrão com lógica adicional.

**Sintaxe:** `NomeInterface.super.metodo()` - qualifica qual interface usar (importante quando múltiplas interfaces têm mesmo método).

### Casos de Uso de Sobrescrita

#### 1. Otimização de Performance

```java
interface Collection<E> {
    Iterator<E> iterator();

    default boolean contains(Object o) {
        // Implementação padrão - funcional mas O(n)
        for (E e : this) {
            if (Objects.equals(e, o)) return true;
        }
        return false;
    }
}

class HashSet<E> implements Collection<E> {
    @Override
    public boolean contains(Object o) {
        // Otimização - O(1) usando hash
        return map.containsKey(o);
    }
}
```

**Motivação:** Default é O(n); sobrescrita com HashSet é O(1) - ganho massivo de performance.

#### 2. Comportamento Específico de Domínio

```java
interface Descontavel {
    double getPreco();

    default double calcularDesconto() {
        return getPreco() * 0.1;  // Desconto padrão de 10%
    }
}

class ProdutoPremium implements Descontavel {
    private double preco;

    public double getPreco() { return preco; }

    @Override
    public double calcularDesconto() {
        // Produtos premium têm desconto maior
        return getPreco() * 0.25;  // 25%
    }
}

class ProdutoPromocional implements Descontavel {
    private double preco;

    public double getPreco() { return preco; }

    // Usa desconto padrão de 10% - não sobrescreve
}
```

**Motivação:** Lógica de negócio específica de categoria.

#### 3. Integração com Estado Interno

```java
interface Nomeavel {
    String getNome();

    default String getNomeCompleto() {
        return "Sr(a). " + getNome();  // Default genérico
    }
}

class Pessoa implements Nomeavel {
    private String nome;
    private String sobrenome;
    private String titulo;  // Dr., Prof., etc.

    public String getNome() { return nome; }

    @Override
    public String getNomeCompleto() {
        // Usa estado interno (titulo, sobrenome) que default não conhece
        String tituloStr = (titulo != null) ? titulo + " " : "";
        return tituloStr + nome + " " + sobrenome;
    }
}
```

**Motivação:** Método default não tem acesso a campos da classe; sobrescrita permite usar estado completo.

---

## 🎯 Aplicabilidade e Contextos

### Quando Sobrescrever Métodos Default

#### Situação 1: Performance É Crítica

**Indicadores:**
- Método é chamado em loop apertado
- Implementação default é O(n), você tem O(1) ou O(log n)
- Profiling mostra método default como hotspot

**Ação:** Sobrescrever com implementação otimizada.

#### Situação 2: Semântica Precisa Ser Ajustada

**Indicadores:**
- Comportamento default é "quase correto" mas não exatamente
- Domínio específico tem regras especiais
- Default é genérico demais

**Ação:** Sobrescrever com comportamento específico do domínio.

#### Situação 3: Necessidade de Acesso a Estado

**Indicadores:**
- Método default não pode acessar campos da classe
- Implementação ótima requer dados internos
- Default seria ineficiente sem acesso direto

**Ação:** Sobrescrever para integrar com estado interno.

### Quando NÃO Sobrescrever

#### Situação 1: Default É Suficiente

Se implementação padrão funciona corretamente e performance é aceitável, **não sobrescreva**. Código mais simples é melhor.

#### Situação 2: Sem Benefício Claro

Sobrescrever "porque sim" adiciona complexidade sem valor. Só sobrescreva quando há benefício mensurável.

---

## ⚠️ Limitações e Considerações Teóricas

### Armadilhas Comuns

#### Armadilha 1: Quebrar Contrato

```java
interface Ordenador {
    List<Integer> ordenar(List<Integer> lista);

    default List<Integer> ordenarDecrescente(List<Integer> lista) {
        List<Integer> resultado = ordenar(lista);
        Collections.reverse(resultado);
        return resultado;  // Contrato: retorna lista decrescente
    }
}

class OrdenadorQuebrado implements Ordenador {
    public List<Integer> ordenar(List<Integer> lista) { ... }

    @Override
    public List<Integer> ordenarDecrescente(List<Integer> lista) {
        return ordenar(lista);  // ❌ Retorna crescente, não decrescente!
    }
}
```

**Problema:** Sobrescrita viola expectativa semântica do método.

#### Armadilha 2: Esquecer @Override

```java
interface Exemplo {
    default void metodo(String param) { }
}

class Implementacao implements Exemplo {
    // Sem @Override - typo passa despercebido
    public void metdo(String param) {  // "metdo" ao invés de "metodo"
        // Compilador não detecta erro - cria método novo ao invés de sobrescrever
    }
}
```

**Solução:** **SEMPRE use @Override** - compilador detectará erros de assinatura.

---

## 🔗 Interconexões Conceituais

### Relação com Polimorfismo

Métodos default sobrescritos participam plenamente de polimorfismo:

```java
List<Processador> processadores = Arrays.asList(
    new ProcessadorPadrao(),
    new ProcessadorCustomizado()
);

for (Processador p : processadores) {
    p.processar("dados");  // Chama versão apropriada polimorficamente
}
```

### Relação com Padrões de Design

**Template Method:** Método default é template; sobrescrita customiza passos
**Strategy:** Diferentes sobrescritas = diferentes estratégias
**Decorator:** Sobrescrita que chama default e adiciona comportamento

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Sobrescrita Simples:** Substituir implementação default
2. **Sobrescrita com Chamada a Default:** Decorator pattern
3. **Resolução de Conflitos:** Múltiplas interfaces com mesmo método
4. **Hierarquias Complexas:** Interfaces estendendo interfaces com defaults

### Conceitos Que Se Constroem

**Diamond Problem:** Conflitos de herança múltipla com defaults
**Método super:** Chamar versão específica de interface
**Composição de Comportamento:** Combinar múltiplos defaults

---

## 📚 Conclusão

Sobrescrita de métodos default é o mecanismo que torna métodos default verdadeiramente poderosos e flexíveis. Permite que interfaces forneçam implementações padrão razoáveis enquanto dão liberdade total para implementações otimizarem, customizarem ou ajustarem comportamento conforme necessário.

A chave é balancear **reutilização** (usar defaults quando apropriado) com **customização** (sobrescrever quando há benefício claro). Use @Override sempre, respeite contratos, e sobrescreva quando - e somente quando - houver razão justificável.
