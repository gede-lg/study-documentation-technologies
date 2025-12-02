# Polimorfismo: Sobrescrita de métodos (@Override), ligação estática e dinâmica.

**1. Introdução**
O **polimorfismo** é um dos quatro pilares da Orientação a Objetos (OO) em Java (ao lado de encapsulamento, abstração e herança). Ele permite que objetos de diferentes classes relacionadas sejam tratados de forma uniforme, reduzindo acoplamento e aumentando a extensibilidade do código. Dentro do polimorfismo, focaremos em:

- **Sobrescrita de métodos (`@Override`)** – permite que uma subclasse forneça implementação específica para um método já definido na superclasse.
- **Ligação estática** – resolução de métodos em tempo de compilação (métodos estáticos, private e final).
- **Ligação dinâmica** – resolução de métodos em tempo de execução (métodos de instância “normais”).

Esses subtemas servem para entender quando e como o compilador ou a JVM escolhem qual implementação de método executar, o que impacta diretamente em desempenho, flexibilidade e corretude do seu sistema.

---

**2. Sumário**

1. Introdução
2. Sumário
3. Conteúdo Detalhado
    1. Sintaxe e Estrutura
    2. Componentes Principais
    3. Restrições de Uso
4. Exemplos de Código Otimizados
5. Informações Adicionais
6. Referências para Estudo Independente

---

## 3. Conteúdo Detalhado

### 3.1 Sintaxe e Estrutura

### 3.1.1 Sobrescrita de Métodos (`@Override`)

- **Assinatura idêntica**: mesmo nome, parâmetros e tipo de retorno (ou covariância de retorno).
- **Anotação `@Override`**: opcional, mas garante ao compilador validar que há um método na superclasse para sobrescrever.

```java
class Animal {
    public void emitirSom() {
        System.out.println("Som genérico de Animal");
    }
}

class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}

```

### 3.1.2 Ligação Estática

- Métodos marcados `static`, `private` ou `final` são ligados estaticamente.
- **Compilação**: a chamada já é resolvida no bytecode, não muda em tempo de execução.

```java
class Util {
    public static void ola() {
        System.out.println("Olá do Util");
    }
}

Util.ola(); // sempre invoca Util.ola(), não importa a referência

```

### 3.1.3 Ligação Dinâmica

- Métodos de instância não-final nem private são ligados dinamicamente.
- **Execução**: a JVM decide em tempo de execução qual implementação chamar, com base no tipo real do objeto.

```java
Animal a = new Cachorro();
a.emitirSom(); // “Au au!”, pois a instância real é Cachorro

```

### 3.2 Componentes Principais

- **Classe Base (Superclasse)**: declara métodos que podem ser sobrescritos.
- **Subclasses**: fornecem implementações específicas.
- **Polimorfismo de Subtipos**: variáveis de tipo mais genérico podem referenciar objetos de tipos derivados.
- **Anotação `@Override`**: ferramenta de segurança no código.
- **JVM**: responsável pela ligação dinâmica em chamadas de métodos de instância.

### Fluxo de Interação

1. Código-fonte → compilador verifica assinatura e presença de anotações.
2. Bytecode → invocações de métodos de instância usam instruções `invokevirtual`.
3. Em tempo de execução, o “method lookup” da JVM analisa a tabela de métodos (vtable) da classe real para escolher a implementação correta.

### 3.3 Restrições de Uso

- **Restrição de visibilidade**: o método sobrescrito não pode reduzir a visibilidade (e.g., de `public` para `protected`).
- **Covariância de retorno**: subclasses podem retornar um subtipo do tipo de retorno original, mas não tipos não relacionados.
- **Assinatura idêntica**: não é possível alterar parâmetros; caso contrário, ocorre sobrecarga, não sobrescrita.
- **Métodos `final` e `private`**: não podem ser sobrescritos.

---

## 4. Exemplos de Código Otimizados

### 4.1 Caso Básico de Sobrescrita

```java
abstract class Forma {
    public abstract double calcularArea();
}

class Retangulo extends Forma {
    private final double largura, altura;
    public Retangulo(double largura, double altura) {
        this.largura = largura;
        this.altura  = altura;
    }
    @Override
    public double calcularArea() {
        return largura * altura;
    }
}

class Circulo extends Forma {
    private static final double PI = Math.PI;
    private final double raio;
    public Circulo(double raio) {
        this.raio = raio;
    }
    @Override
    public double calcularArea() {
        return PI * raio * raio;
    }
}

// Uso:
List<Forma> formas = List.of(new Retangulo(2,3), new Circulo(1.5));
for (Forma f : formas) {
    System.out.printf("Área: %.2f%n", f.calcularArea());
}

```

**Boas práticas**

- Use classes e métodos abstratos quando fizer sentido.
- Declarações `final` em classes utilitárias para evitar herança indevida.

---

### 4.2 Ligação Estática vs. Dinâmica

```java
class Pai {
    public static void metodoEstatico() { System.out.println("Pai estático"); }
    public void metodoInstancia() { System.out.println("Pai instância"); }
}

class Filho extends Pai {
    public static void metodoEstatico() { System.out.println("Filho estático"); }
    @Override
    public void metodoInstancia() { System.out.println("Filho instância"); }
}

Pai p = new Filho();
p.metodoEstatico();   // Pai estático  ← ligação estática
p.metodoInstancia();  // Filho instância ← ligação dinâmica

```

**Observação**: embora o código chame `metodoEstatico` a partir de uma referência tipo `Pai`, é sempre o método da classe em que a chamada foi compilada que é executado.

---

## 5. Informações Adicionais

- **Performance**: ligação dinâmica tem overhead mínimo graças à otimização da JVM (inline caching).
- **Design Patterns**: muitas estruturas dependem de polimorfismo (Factory, Strategy, Template Method).
- **Reflexão**: com `java.lang.reflect`, é possível invocar métodos dinamicamente, mas foge ao polimorfismo clássico.
- **Java 8+**: métodos `default` em interfaces também podem ser sobrescritos pelas classes.

---

## 6. Referências para Estudo Independente

1. **Documentação Oficial Oracle – Polymorphism**[https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html](https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html)
2. **“Effective Java”**, Joshua Bloch – Capítulo sobre herança e sobrescrita de métodos.
3. **Baeldung – Method Overriding in Java**[https://www.baeldung.com/java-method-overriding](https://www.baeldung.com/java-method-overriding)
4. **Vogella – Java Inheritance and Polymorphism Tutorial**[https://www.vogella.com/tutorials/JavaInheritance/article.html](https://www.vogella.com/tutorials/JavaInheritance/article.html)

---

Com esse conteúdo, você terá tanto a base conceitual quanto exemplos práticos e referências para aprofundar seu domínio sobre polimorfismo em Java. Se quiser que eu expanda algum ponto ou adicione mais casos de uso, é só falar!