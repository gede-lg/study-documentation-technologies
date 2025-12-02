# Type Erasure: Como Generics são implementados pela JVM

## 1. Introdução

**Visão Geral**
Type Erasure é o mecanismo pelo qual o Java implementa generics na JVM. Em vez de criar múltiplas versões de classes e métodos para cada tipo genérico, o compilador Java “apaga” (erase) as informações de tipo em tempo de compilação, gerando bytecode compatível com versões anteriores da plataforma.

**Relevância e Importância**

- **Compatibilidade Retroativa**: Permite que bibliotecas escritas antes de Java 5 (sem generics) continuem funcionando.
- **Segurança de Tipo em Tempo de Compilação**: Garante verificações de tipo durante a compilação, reduzindo `ClassCastException` em tempo de execução, sem penalizar a JVM com múltiplas implementações de classe.
- **Limitações Operacionais**: Explica por que não podemos criar arrays de tipos genéricos (`new T[]`) nem testar diretamente instâncias de tipos parametrizados (`instanceof List<String>`).

**Definição e Conceitos Fundamentais**

- **Tema Principal**: *Type Erasure* — o processo de remover informações de tipo genérico no bytecode.
- **Subtemas**:
    1. **Parâmetros de Tipo** – como são declarados (`<T>`) e usados.
    2. **Casts Implícitos** – inserção automática de casts após erasure.
    3. **Métodos Bridge** – gerados para manter polimorfismo.
    4. **Limitações de Linguagem** – restrições resultantes do erasure.
- **Para que Servem**: garantir segurança de tipo em tempo de compilação sem alterar a JVM, mantendo compatibilidade com versões pré-generics.

---

## 2. Sumário

1. [Introdução](Type%20Erasure%20Como%20Generics%20s%C3%A3o%20implementados%20pela%20%202029462188c68086acedc87e1d354c3d.md)
2. [Sumário](Type%20Erasure%20Como%20Generics%20s%C3%A3o%20implementados%20pela%20%202029462188c68086acedc87e1d354c3d.md)
3. [Conteúdo Detalhado](Type%20Erasure%20Como%20Generics%20s%C3%A3o%20implementados%20pela%20%202029462188c68086acedc87e1d354c3d.md)
    - 3.1. [Sintaxe e Estrutura](Type%20Erasure%20Como%20Generics%20s%C3%A3o%20implementados%20pela%20%202029462188c68086acedc87e1d354c3d.md)
    - 3.2. [Componentes Principais](Type%20Erasure%20Como%20Generics%20s%C3%A3o%20implementados%20pela%20%202029462188c68086acedc87e1d354c3d.md)
    - 3.3. [Restrições de Uso](Type%20Erasure%20Como%20Generics%20s%C3%A3o%20implementados%20pela%20%202029462188c68086acedc87e1d354c3d.md)
4. [Exemplos de Código Otimizados](Type%20Erasure%20Como%20Generics%20s%C3%A3o%20implementados%20pela%20%202029462188c68086acedc87e1d354c3d.md)
5. [Informações Adicionais](Type%20Erasure%20Como%20Generics%20s%C3%A3o%20implementados%20pela%20%202029462188c68086acedc87e1d354c3d.md)
6. [Referências para Estudo Independente](Type%20Erasure%20Como%20Generics%20s%C3%A3o%20implementados%20pela%20%202029462188c68086acedc87e1d354c3d.md)

---

## 3. Conteúdo Detalhado

### 3.1. Sintaxe e Estrutura

- **Declaração de Classe Genérica**
    
    ```java
    public class Caixa<T> {
        private T conteudo;
        public void set(T t) { this.conteudo = t; }
        public T get()      { return conteudo; }
    }
    
    ```
    
    Em tempo de compilação, `T` é validado; no bytecode, `Caixa<String>` e `Caixa<Integer>` compartilham a mesma classe `Caixa`, com `T` substituído por `Object` (ou por bound, se houver).
    
- **Erasure de Parâmetros**
    - Parâmetros sem bound → `T` vira `Object`.
    - Parâmetros com bound (`<T extends Number>`) → vira `Number`.
- **Inserção de Casts**
    
    ```java
    Caixa<String> caixa = new Caixa<>();
    String s = caixa.get(); // compilador insere cast: (String) caixa.get();
    
    ```
    

### 3.2. Componentes Principais

1. **Casts Implícitos**
Após erasure, todo retorno ou valor recebido é tratado com cast automático para o tipo original, preservando segurança de tipo em tempo de compilação.
2. **Métodos Bridge**
Quando uma subclasse genérica sobrescreve método genérico de superclasse, o compilador gera um método “bridge” para manter a assinatura original:
    
    ```java
    class GenericParent<T> {
        T method(T t) { … }
    }
    class StringChild extends GenericParent<String> {
        @Override
        String method(String s) { … }
        // Bridge gerado:
        Object method(Object o) { return method((String)o); }
    }
    
    ```
    
3. **Limitações no Reflection**
A JVM não mantém informações de parâmetro genérico em tempo de execução para classes; é necessária a API de `java.lang.reflect.Type` e `ParameterizedType` para introspecção.

### 3.3. Restrições de Uso

- **Criar Arrays Genéricos**: `new T[]` é proibido (tipo apagado para `Object[]`, inseguro).
- **`instanceof` com Parâmetros**: `if (obj instanceof List<String>)` não compila. Só `instanceof List<?>` é permitido.
- **Métodos Estáticos Genéricos**: funcionam, mas sem informações de tipo em runtime.
- **Casting Explícito**: necessário ao usar raw types ou APIs antigas.

---

## 4. Exemplos de Código Otimizados

```java
// Exemplo 1: Classe Genérica Simples
public class Par<K, V> {
    private final K chave;
    private final V valor;

    public Par(K chave, V valor) {
        this.chave  = chave;
        this.valor  = valor;
    }

    public K getChave() { return chave; }
    public V getValor() { return valor; }
}

// Uso:
Par<String, Integer> par = new Par<>("idade", 30);
String chave = par.getChave(); // (String) cast inserido pelo compilador
int idade   = par.getValor();  // (Integer) cast, depois unboxing

// Exemplo 2: Bound e Erasure
public class Numeros<T extends Number> {
    public double dobro(T num) {
        return num.doubleValue() * 2;
    }
}
// Após erasure, T vira Number; o método opera em Number diretamente

// Exemplo 3: Método Bridge para Sobrescrita
abstract class Processador<T> {
    abstract T processa(T t);
}
class ProcessaString extends Processador<String> {
    @Override
    String processa(String s) { return s.trim(); }
    // Bridge:
    // Object processa(Object o) { return processa((String)o); }
}

```

> Boas Práticas
> 
> - Prefira sempre coleções parametrizadas (`List<String>`) a raw types (`List`).
> - Evite casts manuais; deixe o compilador inserir automáticamente.
> - Utilize `@SuppressWarnings("unchecked")` apenas quando for inevitável interagir com APIs antigas.

---

## 5. Informações Adicionais

- **TypeToken e Super Type Tokens**
Técnicas (p.ex. Guava `TypeToken<T>`) para recuperar informações de tipos genéricos em runtime, usando classes anônimas e introspecção de hierarquia.
- **Reified Generics em Outras Linguagens**
Linguagens como C# e Kotlin conseguem manter tipos genéricos em tempo de execução (reified), ao custo de instanciar múltiplas versões de classes.
- **Projetos Futuros da JVM**
Possíveis extensões à JVM para suportar generics reified nativamente (Projeto Valhalla), mas sem quebra de compatibilidade.
- **Performance**
Como a erasure evita overhead de multiplas classes, o desempenho em runtime se mantém equivalente a usar `Object` diretamente, com custo apenas de casts.

---

## 6. Referências para Estudo Independente

1. **Java Language Specification, §4.5 “Type Variables”**[https://docs.oracle.com/javase/specs/jls/se17/html/jls-4.html#jls-4.5](https://docs.oracle.com/javase/specs/jls/se17/html/jls-4.html#jls-4.5)
2. **“What Are Java Generics?” – Oracle Tutorial**[https://docs.oracle.com/javase/tutorial/java/generics/index.html](https://docs.oracle.com/javase/tutorial/java/generics/index.html)
3. **“Understanding Java Generics and Type Erasure” – Baeldung**[https://www.baeldung.com/java-type-erasure](https://www.baeldung.com/java-type-erasure)
4. **“Java Generics Frequently Asked Questions” – Angelika Langer**[https://www.angelikalanger.com/GenericsFAQ/GenericsFAQ.html](https://www.angelikalanger.com/GenericsFAQ/GenericsFAQ.html)
5. **Livro: “Effective Java” (3ª Edição) – Item 1, “Favor generic types”**
Joshua Bloch, Addison-Wesley Professional.

---

> Dica: pratique inspecionando o bytecode gerado (javap -c NomeDaClasse) para ver como o compilador trata seus genéricos na classe compilada.
>