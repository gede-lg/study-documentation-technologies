# Palavra-chave default

## 🎯 Introdução e Definição

### Definição Conceitual

A **palavra-chave `default`** em Java é um modificador introduzido no Java 8 (2014) que permite declarar métodos com implementação concreta dentro de interfaces. Antes do Java 8, interfaces podiam conter apenas métodos abstratos (sem corpo) e constantes. A palavra-chave `default` revolucionou esse paradigma ao permitir que interfaces forneçam **implementações padrão** para métodos, transformando interfaces de "contratos puros" em "contratos com comportamento opcional".

Conceitualmente, um método `default` é uma implementação que está **disponível automaticamente** para todas as classes que implementam a interface, mas que pode ser **sobrescrita** por essas classes se desejarem fornecer comportamento diferente. É uma forma de **herança de comportamento** através de interfaces, não apenas de contrato.

A palavra-chave `default` cria uma dualidade interessante: o método é simultaneamente parte do contrato (existe na interface e está disponível para quem a implementa) e parte da implementação (tem código executável). Isso borra a linha tradicional entre interfaces (pura abstração) e classes abstratas (abstração + implementação parcial).

### Contexto Histórico e Motivação

**O Problema da Evolução de APIs**

Antes do Java 8, adicionar um novo método a uma interface existente era uma **mudança quebrada** (breaking change). Se você tinha uma interface `Collection` com milhares de classes que a implementavam espalhadas por todo o ecossistema Java, adicionar um novo método abstrato quebraria **todas** essas implementações - elas seriam obrigadas a implementar o novo método, ou não compilariam mais.

**Exemplo do problema:**
```java
// Java 7 e anteriores
interface MinhaInterface {
    void metodoAntigo();
}

// Milhares de classes implementam
class MinhaClasse implements MinhaInterface {
    public void metodoAntigo() { ... }
}

// Você quer adicionar um novo método
interface MinhaInterface {
    void metodoAntigo();
    void metodoNovo();  // ❌ QUEBRA todas as implementações existentes!
}
```

**A Motivação: Lambdas e Streams**

O Java 8 introduziu **lambdas** e a **Streams API**, recursos transformadores que requeriam novos métodos em interfaces existentes do Collections Framework. Por exemplo, a interface `Iterable` precisava do método `forEach()`, e `Collection` precisava de `stream()`. Mas adicionar esses métodos quebraria milhões de linhas de código existente.

A solução foi a palavra-chave `default`: adicionar métodos **com implementação padrão** que não quebram código existente.

**Evolução Conceitual**

Métodos `default` representam uma mudança filosófica em Java:
- **Antes:** Interface = contrato puro sem implementação
- **Java 8+:** Interface = contrato + comportamento padrão opcional

Isso aproximou interfaces de **traits** em Scala ou **mixins** em linguagens como Ruby - mecanismos que permitem composição de comportamento sem herança tradicional.

### Problema Fundamental que Resolve

Métodos `default` resolvem problemas críticos de design e manutenção:

**1. Evolução Compatível de APIs**
Permite adicionar funcionalidade a interfaces sem quebrar implementações existentes. Bibliotecas podem evoluir mantendo compatibilidade retroativa.

**2. Reutilização de Código Entre Implementações**
Implementações comuns podem ser fornecidas uma vez na interface, evitando duplicação em cada classe implementadora.

**3. Métodos Derivados**
Métodos que podem ser expressos em termos de outros métodos da interface podem ser fornecidos como `default`, reduzindo código boilerplate.

**4. Alternativa a Classes Abstratas para Comportamento Compartilhado**
Para casos onde você quer compartilhar comportamento mas não quer ou pode usar herança de classe (Java permite apenas herança simples de classes, mas múltiplas interfaces).

**5. Design de APIs Mais Flexíveis**
Permite criar interfaces "ricas" com muitos métodos de conveniência, onde implementadores precisam fornecer apenas métodos essenciais.

### Importância no Ecossistema Java

A palavra-chave `default` foi fundamental para a modernização do Java:

**Collections Framework:**
```java
interface Iterable<T> {
    Iterator<T> iterator();  // Método abstrato essencial

    // Método default - funcionalidade adicional sem quebrar código existente
    default void forEach(Consumer<? super T> action) {
        for (T t : this) {
            action.accept(t);
        }
    }
}
```

**Streams API:**
```java
interface Collection<E> {
    // Métodos abstratos existentes...

    // Novo método default - não quebra implementações antigas
    default Stream<E> stream() {
        return StreamSupport.stream(spliterator(), false);
    }
}
```

**Comparator e Functional Interfaces:**
Métodos default permitiram criar APIs fluentes poderosas:
```java
Comparator<Person> byName = Comparator.comparing(Person::getName);
Comparator<Person> byNameDesc = byName.reversed();  // reversed() é método default
Comparator<Person> byNameThenAge = byName.thenComparing(Person::getAge);  // thenComparing() é default
```

Sem métodos `default`, essas APIs modernas e expressivas não seriam possíveis sem quebrar compatibilidade com código Java legado.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Híbrido Contrato-Implementação:** Método `default` é parte do contrato da interface mas fornece implementação concreta

2. **Herança de Comportamento:** Classes que implementam interface herdam automaticamente métodos default

3. **Sobrescrita Opcional:** Implementações podem aceitar comportamento padrão ou fornecer própria implementação

4. **Composição sem Herança Múltipla:** Permite compartilhar comportamento entre classes não relacionadas hierarquicamente

5. **Compatibilidade Retroativa:** Permite evoluir interfaces sem quebrar código existente

### Pilares Fundamentais

- **Palavra-chave `default`:** Marca método como tendo implementação padrão
- **Implementação Concreta em Interface:** Métodos default têm corpo `{ ... }` com código executável
- **Disponibilidade Automática:** Todas as classes implementadoras têm acesso ao método
- **Natureza Pública:** Métodos default são implicitamente `public`
- **Capacidade de Sobrescrita:** Classes podem usar `@Override` para fornecer implementação própria

### Visão Geral das Nuances

- **Acesso a Outros Métodos:** Métodos default podem chamar outros métodos da interface (abstratos ou default)
- **Acesso a Constantes:** Podem acessar constantes da interface
- **Sem Acesso a Estado de Instância:** Não podem acessar campos de instância (interfaces não têm estado)
- **Conflitos:** Se classe implementa múltiplas interfaces com métodos default de mesmo nome, deve resolver conflito
- **Relação com Classes Abstratas:** Métodos default não tornam interfaces equivalentes a classes abstratas (ainda não há construtores, estado de instância, etc.)

---

## �🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Anatomia de um Método Default

```java
public interface MinhaInterface {
    // Método abstrato tradicional
    void metodoAbstrato();

    // Método default - sintaxe
    default void metodoDefault() {
        System.out.println("Implementação padrão");
    }

    // Método default com parâmetros e retorno
    default int calcular(int a, int b) {
        return a + b;
    }

    // Método default que chama métodos abstratos
    default void executar() {
        metodoAbstrato();  // Pode chamar método abstrato da mesma interface
        System.out.println("Execução completa");
    }
}
```

**Análise Estrutural:**

1. **Modificador `default`:** Obrigatório antes do tipo de retorno
2. **Corpo do Método:** Obrigatório - deve conter implementação entre `{ }`
3. **Visibilidade Implícita:** Sempre `public` (não pode ser `private`, `protected`, ou package-private no nível da interface - Java 9+ permite métodos `private` mas esses não são `default`)
4. **Não-Static:** Métodos default **não** são `static` - operam no contexto de instância

#### Compilação e Bytecode

Quando você compila uma interface com método default, o compilador Java gera:

```
MinhaInterface.class:
  - Informação sobre método abstrato (como antes)
  - Código bytecode real para método default (novidade)
  - Metadata indicando que método é default
```

**Implicação:** O bytecode do método default fica **na interface**, não nas classes implementadoras. Quando uma classe implementadora chama o método default, ela invoca código da interface.

#### Herança de Métodos Default

```java
interface Animal {
    default void respirar() {
        System.out.println("Respirando...");
    }
}

class Cachorro implements Animal {
    // Não precisa implementar respirar() - herda da interface
}

Cachorro cachorro = new Cachorro();
cachorro.respirar();  // Executa implementação default de Animal
```

**Processo Interno:**

1. **Compilação de Cachorro:** Compilador vê que `Animal` tem `respirar()` default, então `Cachorro` não precisa implementar
2. **Runtime:** Quando `cachorro.respirar()` é chamado:
   - JVM verifica se `Cachorro` sobrescreveu `respirar()` - não sobrescreveu
   - JVM chama implementação default de `Animal.respirar()`

### Princípios e Conceitos Subjacentes

#### Separation of Concerns: Essencial vs Derivado

Métodos default permitem separar métodos **essenciais** (que definem o núcleo do contrato) de métodos **derivados** (que podem ser expressos em termos dos essenciais):

```java
interface Repository<T> {
    // ESSENCIAL: método abstrato que implementações DEVEM fornecer
    List<T> findAll();

    // DERIVADO: método default expresso em termos de findAll()
    default long count() {
        return findAll().size();
    }

    default boolean isEmpty() {
        return findAll().isEmpty();
    }

    default Optional<T> findFirst() {
        List<T> all = findAll();
        return all.isEmpty() ? Optional.empty() : Optional.of(all.get(0));
    }
}
```

**Princípio:** Implementadores precisam fornecer apenas `findAll()`. Métodos derivados vêm "de graça" com implementação razoável. Se desejarem otimizar (ex: `count()` pode ser mais eficiente que carregar tudo e contar), podem sobrescrever.

#### Template Method Pattern Invertido

Métodos default podem implementar padrão Template Method sem classes abstratas:

```java
interface Processador {
    // Métodos abstratos - "hooks" que subclasses implementam
    void inicializar();
    void processar();
    void finalizar();

    // Método default - template que orquestra hooks
    default void executar() {
        inicializar();
        try {
            processar();
        } finally {
            finalizar();
        }
    }
}
```

**Conceito:** O "template" (`executar()`) está na interface. Implementações fornecem passos específicos mas herdam algoritmo geral.

#### Princípio da Compatibilidade: Adição Não-Quebradora

```java
// Versão 1.0 da interface
interface Servico {
    void operacaoObrigatoria();
}

// Milhares de implementações existem

// Versão 2.0 - adiciona funcionalidade SEM quebrar
interface Servico {
    void operacaoObrigatoria();

    // Nova funcionalidade - default não quebra implementações antigas
    default void novaFuncionalidade() {
        System.out.println("Comportamento padrão");
    }
}
```

**Garantia:** Código compilado contra v1.0 continua funcionando com v2.0. Implementações antigas ganham `novaFuncionalidade()` automaticamente.

### Relação com Outros Conceitos da Linguagem

#### Métodos Default vs Classes Abstratas

Ambos permitem compartilhar comportamento, mas com diferenças cruciais:

**Classes Abstratas:**
- Podem ter **estado** (campos de instância)
- Podem ter **construtores**
- Herança **simples** (classe estende apenas uma classe abstrata)
- Métodos podem ter qualquer visibilidade

**Métodos Default em Interfaces:**
- **Sem estado** (apenas constantes static final)
- **Sem construtores**
- Implementação **múltipla** (classe pode implementar múltiplas interfaces)
- Métodos são **public** (ou private a partir do Java 9 para métodos auxiliares)

**Quando usar qual:**
- **Classe abstrata:** Quando precisa de estado compartilhado, hierarquia "é-um"
- **Interface com default:** Quando quer compartilhar comportamento sem estado, capacidades ortogonais

#### Métodos Default e Lambdas

Métodos default foram essenciais para suportar lambdas:

```java
@FunctionalInterface
interface Predicate<T> {
    // Método abstrato único (SAM - Single Abstract Method)
    boolean test(T t);

    // Métodos default - não contam para SAM, permitem API rica
    default Predicate<T> and(Predicate<? super T> other) {
        return (t) -> test(t) && other.test(t);
    }

    default Predicate<T> or(Predicate<? super T> other) {
        return (t) -> test(t) || other.test(t);
    }

    default Predicate<T> negate() {
        return (t) -> !test(t);
    }
}
```

**Sinergia:** Interface funcional tem um método abstrato (para lambda), mas pode ter múltiplos métodos default para API fluente.

### Modelo Mental para Compreensão

#### Metáfora: "Comportamento Herdado com Opt-Out"

Pense em métodos default como **comportamento padrão com direito de recusa**:

**Analogia - Contrato de Trabalho:**
- **Método abstrato:** "Você DEVE fazer X" (obrigação inegociável)
- **Método default:** "Você PODE fazer Y desta forma, mas se tiver jeito melhor, fique à vontade" (sugestão sobrescrevível)

**Exemplo Prático:**
- **Contrato (interface):** "Funcionário deve trabalhar e pode tirar férias"
- **Método abstrato `trabalhar()`:** Cada funcionário trabalha diferentemente (programador, vendedor, etc.)
- **Método default `tirarFerias()`:** Implementação padrão "solicitar ao RH", mas CEO pode ter processo diferente (sobrescrever)

#### Modelo: "Biblioteca de Comportamentos Reutilizáveis"

Interfaces com métodos default são **bibliotecas de comportamento** que implementações podem "importar":

```
Interface (biblioteca)
├── Métodos abstratos (API obrigatória)
└── Métodos default (implementações prontas reutilizáveis)

Classe implementadora
├── Implementa métodos abstratos (obrigatório)
└── Herda métodos default (grátis) ou sobrescreve (personaliza)
```

---

## 🔍 Análise Conceitual Profunda

### Sintaxe e Estrutura

#### Sintaxe Básica

```java
interface ExemploCompleto {
    // Constante (sempre public static final)
    int VALOR_PADRAO = 10;

    // Método abstrato (sempre public abstract)
    void metodoAbstrato();

    // Método default - sintaxe completa
    default String metodoDefault() {
        return "Implementação padrão";
    }

    // Método default com lógica complexa
    default void metodoComplexo(int parametro) {
        if (parametro > VALOR_PADRAO) {
            System.out.println("Maior que padrão");
            metodoAbstrato();  // Pode chamar métodos abstratos
        } else {
            System.out.println("Menor ou igual");
        }
    }

    // Método default chamando outro método default
    default void metodoComposicao() {
        System.out.println("Início");
        metodoDefault();  // Chama outro método default
        System.out.println("Fim");
    }
}
```

**Regras Sintáticas:**

1. **Modificador `default` é obrigatório** (diferencia de métodos abstratos)
2. **Corpo é obrigatório** (diferente de métodos abstratos que têm apenas `;`)
3. **Não pode ser `static`** (para isso, use método static - outra feature do Java 8)
4. **Não pode ser `abstract`** (contraditório - default implica implementação)
5. **Não pode ser `private`** antes do Java 9 (Java 9+ permite `private` mas sem `default`)

#### Chamando Métodos Abstratos de Dentro de Métodos Default

```java
interface Desenhavel {
    // Método abstrato - cada forma desenha diferentemente
    void desenhar();

    // Método abstrato - cada forma tem cor
    String getCor();

    // Método default - usa métodos abstratos
    default void desenharComBorda() {
        System.out.println("Desenhando borda em " + getCor());
        desenhar();  // Chama implementação concreta
        System.out.println("Borda completa");
    }
}

class Circulo implements Desenhavel {
    public void desenhar() {
        System.out.println("Desenhando círculo");
    }

    public String getCor() {
        return "vermelho";
    }

    // Herda desenharComBorda() - não precisa implementar
}

Circulo c = new Circulo();
c.desenharComBorda();
// Saída:
// Desenhando borda em vermelho
// Desenhando círculo
// Borda completa
```

**Conceito Poderoso:** Método default pode **orquestrar** chamadas a métodos abstratos, criando algoritmos que dependem de implementações específicas fornecidas pelas classes.

### Composição de Comportamento

#### Métodos Default Encadeados

```java
interface Fluent {
    default Fluent metodo1() {
        System.out.println("Método 1");
        return this;  // Retorna this para encadeamento
    }

    default Fluent metodo2() {
        System.out.println("Método 2");
        return this;
    }

    default Fluent metodo3() {
        System.out.println("Método 3");
        return this;
    }
}

class Implementacao implements Fluent { }

// Uso fluente
new Implementacao()
    .metodo1()
    .metodo2()
    .metodo3();
```

**Padrão:** Métodos default retornando `this` permitem **API fluente** sem duplicação em cada implementação.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Métodos Default

#### 1. Evolução de APIs Existentes

**Contexto:** Você mantém biblioteca/framework usada por muitos, precisa adicionar funcionalidade sem quebrar usuários.

**Solução:**
```java
// Versão 1.0
public interface DataRepository {
    List<Data> findAll();
}

// Versão 2.0 - adiciona paginação
public interface DataRepository {
    List<Data> findAll();

    // Default fornece implementação básica
    default Page<Data> findPaginated(int page, int size) {
        List<Data> all = findAll();
        int start = page * size;
        int end = Math.min(start + size, all.size());
        return new Page<>(all.subList(start, end));
    }
}
```

**Benefício:** Implementações antigas continuam funcionando; novas podem otimizar sobrescrevendo.

#### 2. Métodos de Conveniência

**Contexto:** Interface tem métodos essenciais, mas usuários frequentemente precisam de variações.

**Solução:**
```java
interface StringProcessor {
    // Essencial
    String process(String input);

    // Conveniência - delega ao essencial
    default String processMultiple(String... inputs) {
        return Arrays.stream(inputs)
            .map(this::process)
            .collect(Collectors.joining(", "));
    }

    default String processIfNotEmpty(String input) {
        return input.isEmpty() ? input : process(input);
    }
}
```

#### 3. Reduzir Boilerplate em Implementações

**Contexto:** Múltiplas implementações teriam código duplicado.

**Solução:**
```java
interface Logger {
    void log(String level, String message);

    // Métodos default eliminam repetição
    default void info(String msg) {
        log("INFO", msg);
    }

    default void warn(String msg) {
        log("WARN", msg);
    }

    default void error(String msg) {
        log("ERROR", msg);
    }
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

#### 1. Sem Acesso a Estado de Instância

**Limitação:** Métodos default não podem acessar campos de instância (interfaces não têm campos de instância).

```java
interface Exemplo {
    // ❌ ILEGAL - interfaces não têm campos de instância
    // private int contador;

    default void incrementar() {
        // contador++;  // Não compila - sem estado
    }
}
```

**Mitigação:** Use métodos abstratos para acessar estado, ou trabalhe apenas com parâmetros/constantes.

#### 2. Sem Construtores

Interfaces, mesmo com métodos default, **não têm construtores**. Não podem inicializar estado porque não têm estado.

### Trade-offs

**Métodos Default vs Herança de Classe:**
- ✅ Default: Múltiplas interfaces
- ❌ Default: Sem estado
- ❌ Herança: Apenas uma superclasse
- ✅ Herança: Com estado

**Escolha:** Para comportamento sem estado compartilhado entre tipos não relacionados: métodos default. Para hierarquia com estado: herança de classe.

---

## 🔗 Interconexões Conceituais

### Relação com Polimorfismo

Métodos default participam de polimorfismo:

```java
interface Animal {
    default void mover() {
        System.out.println("Animal se movendo");
    }
}

class Cachorro implements Animal {
    @Override
    public void mover() {
        System.out.println("Cachorro correndo");
    }
}

Animal animal = new Cachorro();
animal.mover();  // "Cachorro correndo" - polimorfismo funciona
```

### Relação com Streams API

Streams dependem fortemente de métodos default:

```java
list.stream()          // default Stream<E> stream()
    .filter(...)       // default Stream<T> filter(Predicate)
    .map(...)          // default Stream<R> map(Function)
    .collect(...);     // método normal
```

Todos os métodos intermediários de Stream são métodos default!

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Métodos Default Básicos:** Entender sintaxe e herança
2. **Resolução de Conflitos:** Múltiplas interfaces com mesmo método default
3. **Métodos Private (Java 9+):** Auxiliares para métodos default
4. **Padrões de Design:** Template Method, Strategy com default methods

### Conceitos Que Se Constroem

**Métodos Static em Interfaces:** Complemento de default para utilitários
**Interfaces Funcionais:** Default methods + SAM
**Modularização (Java 9+):** Controle de visibilidade de interfaces

---

## 📚 Conclusão

A palavra-chave `default` revolucionou interfaces em Java, transformando-as de contratos puros em contratos com comportamento padrão opcional. Isso permitiu evolução compatível de APIs, reduziu boilerplate, e viabilizou recursos modernos como Streams e lambdas sem quebrar décadas de código legado.

Dominar métodos default é entender que interfaces modernas em Java não são apenas "o que" fazer, mas também podem sugerir "como" fazer, mantendo flexibilidade para sobrescrita quando necessário.
