# Classes Genéricas: Criação e uso de classes que trabalham com tipos genéricos

Com certeza, Gedê! Vamos detalhar sobre as **Classes Genéricas em Java**. É um tópico fundamental e que você verá bastante no dia a dia como desenvolvedor, especialmente ao lidar com coleções e criar APIs flexíveis.

---

## Classes Genéricas em Java: Criação e Uso

### 1. Introdução

As classes genéricas são um recurso poderoso do Java, introduzido a partir da versão 5, que permite que classes, interfaces e métodos operem com tipos de dados de forma flexível, mas com segurança de tipo em tempo de compilação. Antes dos *Generics*, as coleções, por exemplo, armazenavam objetos do tipo `Object`, o que exigia *typecasting* (conversão explícita de tipo) e tornava o código propenso a erros em tempo de execução (`ClassCastException`).

A relevância das classes genéricas é imensa no desenvolvimento Java moderno. Elas promovem a reutilização de código, aumentam a segurança de tipo (capturando erros em tempo de compilação, e não em tempo de execução) e melhoram a legibilidade do código, evitando *typecasts* desnecessários. Para você, Gedê, que está migrando para Go e já tem experiência com Java Backend, entender profundamente os *Generics* é crucial, pois muitos frameworks e bibliotecas, como o Spring e o Java Collections Framework, fazem uso extensivo deles.

**Definição e Conceitos Fundamentais:**

Uma **classe genérica** é uma classe que é parametrizada por um ou mais tipos. Em vez de operar em um tipo de dado específico (como `String` ou `Integer`), ela opera em um "tipo placeholder" que é especificado pelo cliente da classe. O principal propósito é criar código que seja flexível o suficiente para trabalhar com diferentes tipos de dados, mantendo a segurança de tipo.

Por exemplo, um `ArrayList<String>` é uma lista que garante conter apenas `String`s, e um `ArrayList<Integer>` contém apenas `Integer`s. O `ArrayList` é uma classe genérica que foi parametrizada com diferentes tipos. Isso elimina a necessidade de fazer `(String) lista.get(0)` ou `(Integer) lista.get(0)`.

### 2. Sumário

1. **Introdução às Classes Genéricas**
2. **Sintaxe e Estrutura de Classes Genéricas**
3. **Componentes Principais e Interação**
4. **Restrições no Uso de Generics**
5. **Exemplos de Código Otimizados**
    - Exemplo Básico: Classe de Armazenamento Genérica
    - Exemplo Avançado: Classe de Utilitário Genérica
6. **Informações Adicionais: Type Erasure**
7. **Referências para Estudo Independente**

### 3. Conteúdo Detalhado

### Sintaxe e Estrutura:

A sintaxe para declarar uma classe genérica envolve a adição de parâmetros de tipo entre colchetes angulares (`<>`) após o nome da classe. Esses parâmetros de tipo são frequentemente representados por letras maiúsculas, como `T` (Type), `E` (Element), `K` (Key), `V` (Value), `N` (Number), etc., mas você pode usar qualquer identificador válido.

**Exemplo de Declaração:**

```java
public class MinhaClasseGenerica<T> {
    // T é o parâmetro de tipo
    private T valor;

    public MinhaClasseGenerica(T valor) {
        this.valor = valor;
    }

    public T getValor() {
        return valor;
    }

    public void setValor(T valor) {
        this.valor = valor;
    }

    public void imprimirTipo() {
        System.out.println("O tipo do objeto é: " + valor.getClass().getName());
    }
}

```

**Exemplo de Utilização:**

Ao utilizar a classe genérica, você especifica o tipo concreto que `T` irá representar.

```java
// Instanciando MinhaClasseGenerica com String
MinhaClasseGenerica<String> meuString = new MinhaClasseGenerica<>("Olá, Gedê!");
System.out.println("Valor do String: " + meuString.getValor());
meuString.imprimirTipo(); // Saída: O tipo do objeto é: java.lang.String

// Instanciando MinhaClasseGenerica com Integer
MinhaClasseGenerica<Integer> meuInteiro = new MinhaClasseGenerica<>(123);
System.out.println("Valor do Integer: " + meuInteiro.getValor());
meuInteiro.imprimirTipo(); // Saída: O tipo do objeto é: java.lang.Integer

// Erro de compilação: segurança de tipo
// meuString.setValor(456); // Não compila, espera um String

```

### Componentes Principais:

- **Parâmetro de Tipo (Type Parameter):** É o `T` (ou `E`, `K`, `V`, etc.) dentro dos colchetes angulares na declaração da classe. Ele atua como um *placeholder* para o tipo real que será usado quando a classe for instanciada.
- **Argumento de Tipo (Type Argument):** É o tipo concreto (`String`, `Integer`, `MyCustomObject`) que você fornece ao instanciar a classe genérica. Por exemplo, em `new ArrayList<String>()`, `String` é o argumento de tipo.
- **Métodos e Propriedades:** Dentro de uma classe genérica, você pode usar o parâmetro de tipo (`T`) como o tipo de campos, parâmetros de métodos e tipos de retorno de métodos, assim como faria com qualquer tipo concreto.

### Restrições no Uso de Generics:

Embora poderosos, os *Generics* em Java possuem algumas restrições devido à sua implementação via *Type Erasure* (abordado na seção de informações adicionais):

1. **Não é possível instanciar tipos genéricos diretamente:** Você não pode fazer `new T()`. Isso ocorre porque em tempo de execução, o tipo `T` é apagado.
2. **Não é possível criar arrays de tipos genéricos:** `new T[10]` não é permitido. Soluções alternativas incluem usar `ArrayList` ou criar um array de `Object` e fazer *typecasting* (com cuidado).
3. **Não é possível usar tipos primitivos como parâmetros de tipo:** Você deve usar os tipos *wrapper* correspondentes (`Integer`, `Double`, `Boolean`, etc.) em vez de `int`, `double`, `boolean`.
4. **Não é possível usar `instanceof` com parâmetros de tipo:** `if (obj instanceof T)` não é permitido.
5. **Não é possível declarar campos `static` com tipo genérico:** `private static T meuCampoStatic;` não é permitido, pois campos estáticos são compartilhados por todas as instâncias da classe, e o tipo genérico varia por instância.
6. **Exceções genéricas não são permitidas:** `class MinhaExcecao<T> extends Exception {}` não é válido.

### 4. Exemplos de Código Otimizados

### Exemplo Básico: Classe de Armazenamento Genérica

Imagine que você precisa de uma caixa que possa armazenar qualquer tipo de item. Sem *Generics*, você faria algo assim, usando `Object`:

```java
// Sem Generics - Problemas de segurança de tipo e typecasting
public class CaixaAntiga {
    private Object item;

    public void setItem(Object item) {
        this.item = item;
    }

    public Object getItem() {
        return item;
    }
}

// Uso (propenso a erros)
CaixaAntiga caixaString = new CaixaAntiga();
caixaString.setItem("Um texto");
String texto = (String) caixaString.getItem(); // Requer typecast

CaixaAntiga caixaMista = new CaixaAntiga();
caixaMista.setItem("Outro texto");
caixaMista.setItem(123); // Permite inserir Integer, mesmo que a intenção fosse String
// String outroTexto = (String) caixaMista.getItem(); // ClassCastException em tempo de execução!

```

Agora, com uma classe genérica, a segurança de tipo é garantida em tempo de compilação:

```java
// Com Generics - Classe de Armazenamento Segura
public class Caixa<T> {
    private T item;

    public Caixa(T item) {
        this.item = item;
    }

    public void setItem(T item) {
        this.item = item;
    }

    public T getItem() {
        return item;
    }

    public void exibirConteudo() {
        System.out.println("Conteúdo da caixa: " + item + " (Tipo: " + item.getClass().getSimpleName() + ")");
    }
}

// Uso no dia a dia do desenvolvedor:
public class ExemploCaixaGenerica {
    public static void main(String[] args) {
        // Caixa para armazenar Strings
        Caixa<String> caixaDeMensagens = new Caixa<>("Olá, mundo Java!");
        caixaDeMensagens.exibirConteudo(); // Saída: Conteúdo da caixa: Olá, mundo Java! (Tipo: String)
        String mensagem = caixaDeMensagens.getItem();
        System.out.println("Mensagem recuperada: " + mensagem);

        // Caixa para armazenar Integers
        Caixa<Integer> caixaDeNumeros = new Caixa<>(42);
        caixaDeNumeros.exibirConteudo(); // Saída: Conteúdo da caixa: 42 (Tipo: Integer)
        int numero = caixaDeNumeros.getItem();
        System.out.println("Número recuperado: " + numero);

        // Tentativa de erro de compilação (segurança de tipo)
        // caixaDeMensagens.setItem(123); // ERRO DE COMPILAÇÃO: tipo Integer não é compatível com String
    }
}

```

### Exemplo Avançado: Classe de Utilitário Genérica com Múltiplos Parâmetros

Você pode ter múltiplas variáveis de tipo, o que é comum em estruturas de dados como `Map` (`Map<K, V>`).

```java
// Classe utilitária genérica para pares de valores
public class Par<K, V> { // K para Chave (Key), V para Valor (Value)
    private K chave;
    private V valor;

    public Par(K chave, V valor) {
        this.chave = chave;
        this.valor = valor;
    }

    public K getChave() {
        return chave;
    }

    public V getValor() {
        return valor;
    }

    public void setChave(K chave) {
        this.chave = chave;
    }

    public void setValor(V valor) {
        this.valor = valor;
    }

    @Override
    public String toString() {
        return "{" + chave + "=" + valor + "}";
    }

    // Exemplo de método genérico dentro de uma classe genérica
    public static <T1, T2> Par<T1, T2> criarPar(T1 chave, T2 valor) {
        return new Par<>(chave, valor);
    }
}

// Uso no dia a dia do desenvolvedor:
public class ExemploParGenerico {
    public static void main(String[] args) {
        // Um par representando um ID de usuário e seu nome
        Par<Long, String> usuario = new Par<>(101L, "Luiz Gustavo Gomes Damasceno"); // Você, Gedê!
        System.out.println("Usuário: " + usuario); // Saída: {101=Luiz Gustavo Gomes Damasceno}

        // Um par representando o código de um produto e seu preço
        Par<String, Double> produto = Par.criarPar("LAPTOP-PRO", 2500.00);
        System.out.println("Produto: " + produto); // Saída: {LAPTOP-PRO=2500.0}

        // Um par para armazenar informações de conexão (host e porta)
        Par<String, Integer> conexao = new Par<>("localhost", 8080);
        System.out.println("Conexão: " + conexao); // Saída: {localhost=8080}

        // Recuperando valores com segurança de tipo
        String nomeUsuario = usuario.getValor();
        Long idUsuario = usuario.getChave();
        System.out.println("Nome: " + nomeUsuario + ", ID: " + idUsuario);

        // Erro de compilação:
        // Double precoErrado = usuario.getValor(); // ERRO DE COMPILAÇÃO, getValor() retorna String
    }
}

```

### 5. Informações Adicionais: Type Erasure

É importante que você, como desenvolvedor, entenda como os *Generics* funcionam "por baixo dos panos" no Java: o conceito de **Type Erasure** (Apagamento de Tipo).

Quando o código Java que usa *Generics* é compilado, as informações de tipo genérico (como `<T>`, `<K, V>`) são removidas pela JVM. Isso significa que, em tempo de execução, um `ArrayList<String>` e um `ArrayList<Integer>` são vistos pela JVM como um simples `ArrayList` (ou seja, `ArrayList<Object>`). O compilador usa as informações de tipo genérico apenas para garantir a segurança de tipo durante a compilação, inserindo *typecasts* implícitos onde necessário e gerando erros para usos incorretos.

**Implicações do Type Erasure:**

- **Não é possível verificar o tipo genérico em tempo de execução:** É por isso que `instanceof T` não funciona.
- **Sobrecarga de métodos com parâmetros genéricos diferentes que se tornam iguais após o apagamento não é permitida:** Por exemplo, `void metodo(List<String> lista)` e `void metodo(List<Integer> lista)` não podem coexistir, pois após o *erasure* ambos se tornam `void metodo(List lista)`.
- **Criação de instâncias de `T` diretamente não é possível:** `new T()` não funciona.

Para contornar algumas dessas limitações, especialmente para criar arrays ou instanciar objetos genéricos, você pode usar um `Class<T>` como argumento para o construtor, permitindo a reflexão para instanciar o tipo correto. No entanto, na maioria dos casos, o design de *Generics* em Java visa a segurança em tempo de compilação e a interoperabilidade com código legado.

### 6. Referências para Estudo Independente

Para aprofundar seu conhecimento sobre *Generics* e outros tópicos relacionados ao Java, recomendo os seguintes recursos:

- **Documentação Oficial Java:**
    - [Oracle Java Tutorials - Generics](https://docs.oracle.com/javase/tutorial/java/generics/index.html) - Este é o ponto de partida mais confiável e completo.
- **Artigos e Livros:**
    - **Effective Java by Joshua Bloch:** Um livro clássico que aborda *Generics* em profundidade (Item 26: "Don't use raw types", Item 27: "Eliminate unchecked warnings", Item 28: "Prefer lists to arrays", Item 29: "Favor generic methods", Item 30: "Favor generic types", Item 31: "Use bounded wildcards to increase API flexibility"). Essencial para quem busca se tornar um desenvolvedor Java de alto nível.
    - **Java Generics and Collections by Maurice Naftalin & Philip Wadler:** Um livro mais dedicado especificamente a *Generics* e ao Java Collections Framework.
- **Vídeos e Tutoriais Online:**
    - Procure por tutoriais em plataformas como YouTube (canais como **DevDojo Brasil** para conteúdo em português, ou **Java Brains**, **Baeldung** para conteúdo em inglês) sobre "Java Generics Tutorial".
    - O site **Baeldung** tem excelentes artigos sobre diversos tópicos Java, incluindo *Generics*: [Baeldung - Java Generics](https://www.baeldung.com/java-generics)

Espero que esta explicação detalhada ajude você a dominar as classes genéricas, Gedê! Se tiver mais alguma dúvida ou quiser que eu explique outro tópico, é só chamar!