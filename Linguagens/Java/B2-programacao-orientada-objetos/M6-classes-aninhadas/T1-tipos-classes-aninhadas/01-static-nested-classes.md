# 🏗️ Static Nested Classes

## 🎯 Introdução e Definição

**Static nested classes** (classes aninhadas estáticas) são classes declaradas **dentro de outra classe** com o modificador `static`, criando uma relação de **aninhamento estrutural** sem criar dependência de instância entre a classe interna e a classe externa. Diferentemente de inner classes (classes internas não-estáticas), uma static nested class **não possui referência implícita** à instância da classe que a contém, podendo ser instanciada de forma completamente **independente** da classe externa, acessando apenas membros estáticos (static) da classe envolvente, não membros de instância.

Conceitualmente, static nested classes funcionam como **classes normais que foram logicamente agrupadas dentro de outra classe** por razões de **organização**, **encapsulamento** e **coesão conceitual**, mas mantendo independência de ciclo de vida. A relação é puramente de **namespace** e **escopo léxico** — a classe aninhada "pertence" conceitualmente à externa, mas não depende de instâncias dela para existir. Isso as torna ideais para **helper classes** (classes auxiliares), **builder patterns**, **estruturas de dados internas** e outros casos onde há forte relacionamento lógico, mas não comportamental, com a classe externa.

### Contexto Histórico e Motivação

**Java 1.1 (1997): Introdução de Nested Classes**

Classes aninhadas foram adicionadas ao Java na versão 1.1, expandindo significativamente as capacidades de organização e encapsulamento da linguagem. Antes disso, todas as classes precisavam ser top-level (nível superior) ou package-private.

**Motivação para Static Nested Classes:**

1. **Encapsulamento de Classes Auxiliares**: Evitar poluir namespace do pacote com classes que são apenas helpers de uma classe específica
2. **Coesão Lógica**: Manter classes fortemente relacionadas conceitualmente próximas no código
3. **Acesso a Membros Private**: Static nested classes podem acessar membros private static da classe externa
4. **Organização de Código**: Agrupar classes relacionadas hierarquicamente
5. **Independência de Instância**: Permitir aninhamento sem overhead de referência à instância externa

**Diferenciação de Inner Classes:**

Desde o início, Java distinguiu dois tipos de classes aninhadas:

- **Static nested classes**: Sem referência à instância externa, independentes
- **Inner classes**: Com referência implícita à instância externa, dependentes

Essa distinção reflete dois padrões de uso completamente diferentes.

### Problema que Resolve

**1. Poluição de Namespace**

Sem static nested classes, classes auxiliares poluem namespace do pacote:

```java
// Sem static nested class - 4 classes públicas no pacote
public class MinhaLista { }
class MinhaListaIterador { }
class MinhaListaNo { }
class MinhaListaBuilder { }

// Com static nested class - 1 classe pública, helpers encapsulados
public class MinhaLista {
    private static class Iterador { }
    private static class No { }
    public static class Builder { }
}
```

**2. Quebra de Encapsulamento**

Sem aninhamento, classes auxiliares não podem acessar membros private:

```java
// Sem nested class - deve expor métodos package-private
public class Servidor {
    private static String config;

    static String getConfig() { return config; }  // ❌ Obrigado a expor
}

class ServidorHelper {
    void usarConfig() {
        String c = Servidor.getConfig();  // Usa método exposto
    }
}

// Com static nested class - acesso direto a private
public class Servidor {
    private static String config;

    private static class Helper {
        void usarConfig() {
            String c = Servidor.config;  // ✅ Acesso direto a private
        }
    }
}
```

**3. Falta de Coesão Conceitual**

Sem aninhamento, relacionamentos lógicos não são expressos estruturalmente:

```java
// Sem nested - Builder e Produto desconectados visualmente
public class Produto { }
public class ProdutoBuilder { }  // Relacionamento apenas no nome

// Com nested - Builder claramente parte de Produto
public class Produto {
    public static class Builder {
        // Claramente um Builder DE Produto
    }
}
```

### Importância no Ecossistema Java

**Padrões de Design:**

**Builder Pattern:**
```java
public class Usuario {
    private String nome;
    private String email;

    private Usuario(Builder builder) {
        this.nome = builder.nome;
        this.email = builder.email;
    }

    public static class Builder {
        private String nome;
        private String email;

        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }

        public Usuario build() {
            return new Usuario(this);
        }
    }
}
```

**Collections Framework:**

```java
// LinkedList.Node é static nested class
public class LinkedList<E> {
    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;
    }
}

// HashMap.Entry é static nested class
public class HashMap<K,V> {
    static class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;
    }
}
```

**Frameworks e APIs:**

Muitas bibliotecas usam static nested classes para organizar código relacionado.

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Aninhamento Estrutural**: Classe declarada dentro de outra classe
2. **Modificador Static**: Marca a classe como não dependente de instância externa
3. **Independência de Ciclo de Vida**: Pode ser instanciada sem instância da externa
4. **Acesso Estático**: Acessa apenas membros static da classe externa
5. **Namespace Qualificado**: Acessada via `ClasseExterna.ClasseAninhada`

### Pilares Fundamentais

- **Declaração com `static`**: Palavra-chave obrigatória para marcar independência
- **Instanciação Independente**: `new ClasseExterna.ClasseAninhada()`
- **Acesso a Private Static**: Pode acessar membros private static da externa
- **Sem Referência Implícita**: Não possui `ClasseExterna.this`
- **Encapsulamento**: Pode ser private, protected, public ou package-private

### Visão Geral das Nuances

- **Não é Classe Interna**: "Static nested" ≠ "inner class" (inner é non-static)
- **Pode Ter Qualquer Modificador de Acesso**: private, protected, public, default
- **Pode Conter Membros Static**: Diferente de inner classes que não podem
- **Usada para Organização**: Principal objetivo é agrupar logicamente
- **Acesso Bidirecional a Private Static**: Externa e aninhada veem private static uma da outra

## 🧠 Fundamentos Teóricos

### Anatomia de Static Nested Class

```java
public class ClasseExterna {

    // Membros da classe externa
    private static String configEstatica = "Config";
    private String configInstancia = "Instancia";

    // ========== STATIC NESTED CLASS ==========

    public static class ClasseAninhada {

        private String atributo;

        public ClasseAninhada(String atributo) {
            this.atributo = atributo;
        }

        public void metodo() {
            // ✅ PODE acessar membros static da externa
            System.out.println(configEstatica);

            // ❌ NÃO PODE acessar membros de instância da externa
            // System.out.println(configInstancia);  // ERRO de compilação
        }
    }
}
```

**Elementos Chave:**

- `static` antes de `class`: Marca como static nested class
- Declarada **dentro** do corpo da classe externa
- Acesso apenas a membros **static** da externa

### Instanciação e Uso

**Instanciação:**

```java
// Instanciação independente - sem precisar de instância externa
ClasseExterna.ClasseAninhada aninhada = new ClasseExterna.ClasseAninhada("valor");
```

**Uso:**

```java
public class Exemplo {
    public static void main(String[] args) {
        // Criar instância da classe aninhada
        ClasseExterna.ClasseAninhada obj = new ClasseExterna.ClasseAninhada("teste");
        obj.metodo();

        // Múltiplas instâncias independentes
        ClasseExterna.ClasseAninhada obj1 = new ClasseExterna.ClasseAninhada("A");
        ClasseExterna.ClasseAninhada obj2 = new ClasseExterna.ClasseAninhada("B");

        // Nenhuma relação com instâncias de ClasseExterna
    }
}
```

### Modelo Mental: Namespace Hierárquico

**Pense em static nested class como:**

```
ClasseExterna (namespace)
├─ membros static
├─ membros de instância
└─ ClasseAninhada (sub-namespace)
   ├─ seus próprios membros
   └─ pode ver membros static de ClasseExterna
```

**Não é:**
- Herança (ClasseAninhada NÃO herda de ClasseExterna)
- Composição com referência (ClasseAninhada NÃO tem referência a instância de ClasseExterna)

**É:**
- Agrupamento lógico em namespace
- Encapsulamento de classe relacionada

### Acesso a Membros

**Da Classe Aninhada para a Externa:**

```java
public class Externa {
    private static int valorEstatico = 10;
    private int valorInstancia = 20;

    public static class Aninhada {
        public void acessar() {
            // ✅ Acesso a static (mesmo private)
            System.out.println(valorEstatico);

            // ❌ ERRO - não pode acessar membros de instância
            // System.out.println(valorInstancia);
        }
    }
}
```

**Da Classe Externa para a Aninhada:**

```java
public class Externa {

    public static class Aninhada {
        private int valorPrivado = 100;
    }

    public void metodoExterno() {
        Aninhada obj = new Aninhada();

        // ✅ Classe externa pode acessar membros private da aninhada
        System.out.println(obj.valorPrivado);
    }
}
```

**Conceito**: Acesso bidirecional a membros private (static no caso da aninhada → externa).

## 🔍 Análise Conceitual Profunda

### Caso 1: Builder Pattern

```java
public class Produto {
    // Atributos imutáveis
    private final String nome;
    private final double preco;
    private final String categoria;

    // Construtor privado - apenas Builder pode criar
    private Produto(Builder builder) {
        this.nome = builder.nome;
        this.preco = builder.preco;
        this.categoria = builder.categoria;
    }

    // Getters
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public String getCategoria() { return categoria; }

    // ========== STATIC NESTED CLASS: BUILDER ==========

    public static class Builder {
        // Atributos do builder (mutáveis durante construção)
        private String nome;
        private double preco;
        private String categoria = "Geral";  // Valor padrão

        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }

        public Builder preco(double preco) {
            this.preco = preco;
            return this;
        }

        public Builder categoria(String categoria) {
            this.categoria = categoria;
            return this;
        }

        public Produto build() {
            // Validações
            if (nome == null || nome.isEmpty()) {
                throw new IllegalStateException("Nome obrigatório");
            }
            if (preco <= 0) {
                throw new IllegalStateException("Preço deve ser positivo");
            }

            // Constrói Produto
            return new Produto(this);
        }
    }
}

// Uso
Produto p = new Produto.Builder()
                .nome("Laptop")
                .preco(3000.00)
                .categoria("Eletrônicos")
                .build();
```

**Análise:**
- `Builder` é static nested class — independente de instâncias de `Produto`
- Acessa construtor privado de `Produto`
- Fornece API fluente para construção
- Encapsula lógica de validação

### Caso 2: Node em Estrutura de Dados

```java
public class LinkedList<T> {

    // Referência para primeiro nó
    private Node<T> head;
    private int size = 0;

    // ========== STATIC NESTED CLASS: NODE ==========

    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data) {
            this.data = data;
            this.next = null;
        }
    }

    // Métodos da lista
    public void add(T element) {
        Node<T> newNode = new Node<>(element);

        if (head == null) {
            head = newNode;
        } else {
            Node<T> current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
        size++;
    }

    public T get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }

        Node<T> current = head;
        for (int i = 0; i < index; i++) {
            current = current.next;
        }
        return current.data;
    }

    public int size() {
        return size;
    }
}

// Uso
LinkedList<String> lista = new LinkedList<>();
lista.add("A");
lista.add("B");
lista.add("C");
System.out.println(lista.get(1));  // "B"
```

**Análise:**
- `Node` é detalhe de implementação — private
- Static porque Node não precisa de referência à lista
- Genérico (`<T>`) — tipo parametrizado independente
- Encapsulamento perfeito — usuários não veem Node

### Caso 3: Enumerações Complexas

```java
public class Operacao {

    // ========== STATIC NESTED CLASS: TIPO ==========

    public static class Tipo {
        public static final Tipo ADICAO = new Tipo("+", (a, b) -> a + b);
        public static final Tipo SUBTRACAO = new Tipo("-", (a, b) -> a - b);
        public static final Tipo MULTIPLICACAO = new Tipo("*", (a, b) -> a * b);
        public static final Tipo DIVISAO = new Tipo("/", (a, b) -> a / b);

        private final String simbolo;
        private final Calculadora calc;

        private Tipo(String simbolo, Calculadora calc) {
            this.simbolo = simbolo;
            this.calc = calc;
        }

        public double calcular(double a, double b) {
            return calc.calcular(a, b);
        }

        public String getSimbolo() {
            return simbolo;
        }

        @FunctionalInterface
        private interface Calculadora {
            double calcular(double a, double b);
        }
    }

    private Tipo tipo;
    private double operando1;
    private double operando2;

    public Operacao(Tipo tipo, double op1, double op2) {
        this.tipo = tipo;
        this.operando1 = op1;
        this.operando2 = op2;
    }

    public double executar() {
        return tipo.calcular(operando1, operando2);
    }
}

// Uso
Operacao op1 = new Operacao(Operacao.Tipo.ADICAO, 10, 5);
System.out.println(op1.executar());  // 15.0

Operacao op2 = new Operacao(Operacao.Tipo.MULTIPLICACAO, 10, 5);
System.out.println(op2.executar());  // 50.0
```

**Análise:**
- `Tipo` é static nested class funcionando como enum sofisticado
- Encapsula estratégia de cálculo
- Public porque é parte da API de Operacao
- Padrão Strategy implementado com nested class

### Caso 4: Comparator Customizado

```java
public class Pessoa {
    private String nome;
    private int idade;

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    public String getNome() { return nome; }
    public int getIdade() { return idade; }

    // ========== STATIC NESTED CLASS: COMPARATORS ==========

    public static class Comparadores {

        public static final Comparator<Pessoa> POR_NOME = new Comparator<Pessoa>() {
            @Override
            public int compare(Pessoa p1, Pessoa p2) {
                return p1.nome.compareTo(p2.nome);
            }
        };

        public static final Comparator<Pessoa> POR_IDADE = new Comparator<Pessoa>() {
            @Override
            public int compare(Pessoa p1, Pessoa p2) {
                return Integer.compare(p1.idade, p2.idade);
            }
        };
    }

    @Override
    public String toString() {
        return nome + " (" + idade + " anos)";
    }
}

// Uso
List<Pessoa> pessoas = Arrays.asList(
    new Pessoa("Carlos", 30),
    new Pessoa("Ana", 25),
    new Pessoa("Bruno", 35)
);

Collections.sort(pessoas, Pessoa.Comparadores.POR_NOME);
System.out.println(pessoas);  // [Ana (25 anos), Bruno (35 anos), Carlos (30 anos)]

Collections.sort(pessoas, Pessoa.Comparadores.POR_IDADE);
System.out.println(pessoas);  // [Ana (25 anos), Carlos (30 anos), Bruno (35 anos)]
```

**Análise:**
- `Comparadores` agrupa comparadores relacionados a Pessoa
- Static nested class como namespace para constantes relacionadas
- Padrão Strategy com comparadores pré-definidos

## 🎯 Aplicabilidade e Contextos

### Quando Usar Static Nested Classes

**1. Helper Classes (Classes Auxiliares)**

Quando classe existe apenas para auxiliar a classe principal:

```java
public class Calculadora {

    private static class ValidadorNumeros {
        static boolean isValido(double numero) {
            return !Double.isNaN(numero) && !Double.isInfinite(numero);
        }
    }

    public double somar(double a, double b) {
        if (!ValidadorNumeros.isValido(a) || !ValidadorNumeros.isValido(b)) {
            throw new IllegalArgumentException("Números inválidos");
        }
        return a + b;
    }
}
```

**2. Builder Pattern**

Para construção fluente de objetos imutáveis (como visto anteriormente).

**3. Estruturas de Dados Internas**

Nós de listas, árvores, grafos que são detalhes de implementação:

```java
public class BinaryTree<T> {
    private static class Node<T> {
        T value;
        Node<T> left;
        Node<T> right;
    }

    private Node<T> root;
}
```

**4. Agrupamento Lógico de Constantes/Enums**

Quando constantes estão logicamente relacionadas à classe:

```java
public class HttpResponse {

    public static class Status {
        public static final int OK = 200;
        public static final int NOT_FOUND = 404;
        public static final int SERVER_ERROR = 500;
    }

    private int statusCode;
    private String body;
}
```

**5. Factory Methods Complexos**

Quando lógica de criação é complexa e merece classe própria:

```java
public class Conexao {

    public static class Factory {
        public static Conexao criarMySQL(String url) {
            // Lógica específica MySQL
            return new Conexao(url, "MySQL");
        }

        public static Conexao criarPostgreSQL(String url) {
            // Lógica específica PostgreSQL
            return new Conexao(url, "PostgreSQL");
        }
    }

    private String url;
    private String tipo;

    private Conexao(String url, String tipo) {
        this.url = url;
        this.tipo = tipo;
    }
}
```

## ⚠️ Limitações e Considerações Teóricas

### Limitação 1: Não Acessa Membros de Instância da Externa

```java
public class Externa {
    private String instancia = "valor";

    public static class Aninhada {
        public void tentar() {
            // System.out.println(instancia);  // ❌ ERRO!
            // Não há referência à instância de Externa
        }
    }
}
```

**Solução**: Se precisa acessar membros de instância, use inner class (non-static).

### Limitação 2: Pode Criar Acoplamento Lógico

Embora tecnicamente independente, static nested class cria acoplamento conceitual:

```java
// ClasseAninhada está fortemente acoplada a ClasseExterna conceitualmente
ClasseExterna.ClasseAninhada obj = new ClasseExterna.ClasseAninhada();
```

**Consideração**: Se classe aninhada cresce muito ou é usada amplamente fora da externa, considere torná-la top-level.

### Limitação 3: Visibilidade do Nome Qualificado

Nome completo pode ficar verboso:

```java
com.empresa.projeto.ClasseExterna.ClasseAninhada.SubClasseAninhada obj = ...
```

**Solução**: Import static ou alias.

## 🔗 Interconexões Conceituais

**Relação com Inner Classes (T3-M6)**: Static nested classes são independentes; inner classes têm referência implícita à externa.

**Relação com Encapsulamento (M1-B2)**: Static nested classes fortalecem encapsulamento ao ocultar helpers.

**Relação com Builder Pattern**: Padrão de design clássico implementado com static nested class.

**Relação com Generics**: Static nested classes podem ser genéricas independentemente da externa.

## 🚀 Evolução e Próximos Conceitos

Com compreensão de static nested classes, você está preparado para:

**Inner Classes (Non-Static)**: Classes aninhadas com referência implícita à instância externa

**Local Classes**: Classes declaradas dentro de métodos

**Anonymous Classes**: Classes sem nome declaradas e instanciadas simultaneamente

**Records como Nested Classes (Java 14+)**: Records podem ser static nested classes
