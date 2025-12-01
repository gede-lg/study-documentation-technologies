# T10.04 - Comparator Customizado

## Introdução

**Comparator customizado**: ordenar enums por critério diferente do ordinal.

```java
import java.util.Comparator;

public enum Produto {
    NOTEBOOK(3000),
    MOUSE(50),
    TECLADO(150);
    
    private final double preco;
    
    Produto(double preco) {
        this.preco = preco;
    }
    
    public double getPreco() {
        return preco;
    }
}

// ✅ Comparator por preço
Comparator<Produto> porPreco = Comparator.comparingDouble(Produto::getPreco);
```

**Ordem natural**: ordinal. **Comparator**: critério customizado.

---

## Fundamentos

### 1. Comparator por Atributo

```java
import java.util.Comparator;

public enum Pessoa {
    JOAO("João", 30),
    MARIA("Maria", 25),
    PEDRO("Pedro", 35);
    
    private final String nome;
    private final int idade;
    
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    public int getIdade() {
        return idade;
    }
}

// ✅ Comparator por idade
Comparator<Pessoa> porIdade = Comparator.comparingInt(Pessoa::getIdade);

// ✅ Ordenar
List<Pessoa> pessoas = Arrays.asList(Pessoa.values());
pessoas.sort(porIdade);

// ✅ Resultado: [MARIA(25), JOAO(30), PEDRO(35)]
```

### 2. Ordem Reversa

```java
import java.util.Comparator;
import java.util.Arrays;
import java.util.List;

public enum Prioridade {
    BAIXA(1), MEDIA(2), ALTA(3);
    
    private final int valor;
    
    Prioridade(int valor) {
        this.valor = valor;
    }
    
    public int getValor() {
        return valor;
    }
}

// ✅ Comparator reverso
Comparator<Prioridade> porValorReverso = 
    Comparator.comparingInt(Prioridade::getValor).reversed();

List<Prioridade> lista = Arrays.asList(Prioridade.values());
lista.sort(porValorReverso);

// ✅ Resultado: [ALTA, MEDIA, BAIXA]
```

### 3. Múltiplos Critérios

```java
import java.util.Comparator;

public enum Funcionario {
    ANA("Ana", 30, 5000),
    CARLOS("Carlos", 30, 6000),
    BEATRIZ("Beatriz", 25, 5000);
    
    private final String nome;
    private final int idade;
    private final double salario;
    
    Funcionario(String nome, int idade, double salario) {
        this.nome = nome;
        this.idade = idade;
        this.salario = salario;
    }
    
    public int getIdade() { return idade; }
    public double getSalario() { return salario; }
}

// ✅ Comparator: idade, depois salário
Comparator<Funcionario> comparator = 
    Comparator.comparingInt(Funcionario::getIdade)
              .thenComparingDouble(Funcionario::getSalario);

List<Funcionario> lista = Arrays.asList(Funcionario.values());
lista.sort(comparator);

// ✅ Resultado: BEATRIZ(25), ANA(30,5000), CARLOS(30,6000)
```

### 4. Comparator por String

```java
import java.util.Comparator;

public enum Pais {
    BRASIL("Brasil"),
    ARGENTINA("Argentina"),
    CHILE("Chile");
    
    private final String nome;
    
    Pais(String nome) {
        this.nome = nome;
    }
    
    public String getNome() {
        return nome;
    }
}

// ✅ Comparator por nome alfabético
Comparator<Pais> porNome = Comparator.comparing(Pais::getNome);

List<Pais> paises = Arrays.asList(Pais.values());
paises.sort(porNome);

// ✅ Resultado: [ARGENTINA, BRASIL, CHILE]
```

### 5. Comparator Inline

```java
import java.util.Arrays;
import java.util.List;

public enum Produto {
    NOTEBOOK(3000),
    MOUSE(50);
    
    private final double preco;
    
    Produto(double preco) {
        this.preco = preco;
    }
    
    public double getPreco() {
        return preco;
    }
}

List<Produto> produtos = Arrays.asList(Produto.values());

// ✅ Comparator inline
produtos.sort((p1, p2) -> Double.compare(p1.getPreco(), p2.getPreco()));
```

### 6. nullsFirst e nullsLast

```java
import java.util.Comparator;
import java.util.Arrays;
import java.util.List;

public enum Status {
    ATIVO("Ativo"),
    INATIVO(null);
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}

// ✅ nullsLast (null vai pro final)
Comparator<Status> comparator = 
    Comparator.comparing(Status::getDescricao, Comparator.nullsLast(String::compareTo));

List<Status> lista = Arrays.asList(Status.values());
lista.sort(comparator);

// ✅ Resultado: [ATIVO, INATIVO]
```

### 7. Ordenação com Stream

```java
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public enum Tamanho {
    P(1), M(2), G(3), GG(4);
    
    private final int valor;
    
    Tamanho(int valor) {
        this.valor = valor;
    }
    
    public int getValor() {
        return valor;
    }
}

List<Tamanho> lista = Arrays.asList(Tamanho.GG, Tamanho.P, Tamanho.M);

// ✅ Ordenar com sorted()
List<Tamanho> ordenados = lista.stream()
    .sorted(Comparator.comparingInt(Tamanho::getValor))
    .collect(Collectors.toList());

// ✅ Resultado: [P, M, GG]
```

### 8. Comparator em TreeSet

```java
import java.util.Comparator;
import java.util.TreeSet;

public enum Nivel {
    JUNIOR(1), PLENO(2), SENIOR(3);
    
    private final int valor;
    
    Nivel(int valor) {
        this.valor = valor;
    }
    
    public int getValor() {
        return valor;
    }
}

// ✅ TreeSet com Comparator reverso
TreeSet<Nivel> niveis = new TreeSet<>(
    Comparator.comparingInt(Nivel::getValor).reversed()
);

niveis.add(Nivel.JUNIOR);
niveis.add(Nivel.SENIOR);
niveis.add(Nivel.PLENO);

// ✅ Resultado: [SENIOR, PLENO, JUNIOR]
System.out.println(niveis);
```

### 9. Min e Max com Comparator

```java
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public enum Produto {
    A(100), B(50), C(200);
    
    private final double preco;
    
    Produto(double preco) {
        this.preco = preco;
    }
    
    public double getPreco() {
        return preco;
    }
}

List<Produto> produtos = Arrays.asList(Produto.values());

// ✅ Min (menor preço)
Produto maisBarato = produtos.stream()
    .min(Comparator.comparingDouble(Produto::getPreco))
    .orElse(null);

// ✅ Max (maior preço)
Produto maisCaro = produtos.stream()
    .max(Comparator.comparingDouble(Produto::getPreco))
    .orElse(null);

System.out.println(maisBarato); // B
System.out.println(maisCaro);   // C
```

### 10. Comparator Constante

```java
import java.util.Comparator;

public enum Prioridade {
    BAIXA(1), MEDIA(2), ALTA(3);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    public int getNivel() {
        return nivel;
    }
    
    // ✅ Comparator constante
    public static final Comparator<Prioridade> POR_NIVEL = 
        Comparator.comparingInt(Prioridade::getNivel);
    
    public static final Comparator<Prioridade> POR_NIVEL_REVERSO = 
        POR_NIVEL.reversed();
}

// ✅ Uso
List<Prioridade> lista = Arrays.asList(Prioridade.values());
lista.sort(Prioridade.POR_NIVEL_REVERSO);
```

---

## Aplicabilidade

**Comparator customizado** para:
- Ordenar por atributo
- Ordem reversa
- Múltiplos critérios
- Ordenação customizada

---

## Armadilhas

### 1. Comparator Não Muda Ordem Natural

```java
public enum Status {
    ATIVO, INATIVO
}

// ✅ Comparator não muda compareTo()
Comparator<Status> porNome = Comparator.comparing(Enum::name);

// ⚠️ compareTo() ainda usa ordinal
System.out.println(Status.ATIVO.compareTo(Status.INATIVO)); // -1
```

### 2. Null em Atributos

```java
public enum Tipo {
    A(null), B("B");
    
    private final String valor;
    
    Tipo(String valor) {
        this.valor = valor;
    }
    
    public String getValor() {
        return valor;
    }
}

// ⚠️ Comparator com null (pode lançar NPE)
// Comparator<Tipo> comparator = Comparator.comparing(Tipo::getValor);

// ✅ Usar nullsLast
Comparator<Tipo> comparator = 
    Comparator.comparing(Tipo::getValor, Comparator.nullsLast(String::compareTo));
```

### 3. Ordem de Critérios

```java
public enum Pessoa {
    A("Ana", 30), B("Ana", 25);
    
    private final String nome;
    private final int idade;
    
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
}

// ✅ Nome, depois idade
Comparator<Pessoa> c1 = 
    Comparator.comparing(Pessoa::getNome)
              .thenComparingInt(Pessoa::getIdade);

// ✅ Idade, depois nome
Comparator<Pessoa> c2 = 
    Comparator.comparingInt(Pessoa::getIdade)
              .thenComparing(Pessoa::getNome);
```

---

## Boas Práticas

### 1. Comparator Constante

```java
public enum Produto {
    A(100);
    
    private final double preco;
    
    Produto(double preco) {
        this.preco = preco;
    }
    
    public double getPreco() {
        return preco;
    }
    
    // ✅ Constante
    public static final Comparator<Produto> POR_PRECO = 
        Comparator.comparingDouble(Produto::getPreco);
}
```

### 2. nullsLast para Atributos Nulláveis

```java
Comparator<Tipo> comparator = 
    Comparator.comparing(Tipo::getValor, Comparator.nullsLast(String::compareTo));
```

### 3. Múltiplos Critérios

```java
Comparator<Pessoa> comparator = 
    Comparator.comparing(Pessoa::getNome)
              .thenComparingInt(Pessoa::getIdade);
```

### 4. Método sort()

```java
lista.sort(Comparator.comparingInt(Enum::getValor));
```

---

## Resumo

**Comparator customizado**:

```java
public enum Produto {
    NOTEBOOK(3000), MOUSE(50);
    
    private final double preco;
    
    Produto(double preco) {
        this.preco = preco;
    }
    
    public double getPreco() {
        return preco;
    }
}

// ✅ Comparator por preço
Comparator<Produto> porPreco = Comparator.comparingDouble(Produto::getPreco);

List<Produto> produtos = Arrays.asList(Produto.values());
produtos.sort(porPreco);
```

**Ordem reversa**:

```java
Comparator<Produto> reverso = porPreco.reversed();
```

**Múltiplos critérios**:

```java
Comparator<Pessoa> comparator = 
    Comparator.comparing(Pessoa::getNome)
              .thenComparingInt(Pessoa::getIdade);
```

**Constante**:

```java
public static final Comparator<Produto> POR_PRECO = 
    Comparator.comparingDouble(Produto::getPreco);
```

**Regra de Ouro**: **Comparator customizado** ordena por critério diferente do ordinal. **Declarar como constante** (public static final). **nullsLast** para atributos nulláveis. **thenComparing** para múltiplos critérios. **reversed()** para ordem reversa.
