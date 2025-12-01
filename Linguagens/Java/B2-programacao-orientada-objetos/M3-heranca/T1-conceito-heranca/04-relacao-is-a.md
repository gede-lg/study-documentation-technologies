# T1.04 - Relação "é-um" (is-a)

## Introdução

**Relação "é-um"** (is-a) é o **princípio fundamental** para decidir quando usar herança.

**Regra**: Se você pode dizer "**A é um B**", então A pode herdar de B.

```java
// Cachorro É UM Animal
public class Cachorro extends Animal {} // ✅ Correto

// Carro TEM UM Motor (não é herança, é composição)
public class Carro {
    private Motor motor; // ✅ Composição
}
```

**Teste "é-um"**: Substitua verbalmente e veja se faz sentido.

---

## Fundamentos

### 1. Definição de "é-um"

**Relação de especialização**: Subclasse **é uma** versão mais específica da superclasse.

```java
// Cachorro É UM Animal
public class Animal {}
public class Cachorro extends Animal {}

// Gato É UM Animal
public class Gato extends Animal {}

// Ferrari É UM Carro
public class Carro {}
public class Ferrari extends Carro {}
```

**Teste**: "Cachorro é um Animal?" → **SIM** → Use herança.

### 2. Teste "é-um"

**Pergunte**: "X é um Y?" Se a resposta for **sim**, herança é apropriada.

```java
// ✅ Funcionário É UM Pessoa
public class Funcionario extends Pessoa {}

// ✅ Gerente É UM Funcionário
public class Gerente extends Funcionario {}

// ❌ Carro É UM Motor? NÃO!
// public class Carro extends Motor {} // Incorreto

// ✅ Carro TEM UM Motor (composição)
public class Carro {
    private Motor motor;
}
```

### 3. "é-um" vs "tem-um"

**"é-um"**: Herança (extends)
**"tem-um"**: Composição (atributo)

```java
// Cachorro É UM Animal
public class Cachorro extends Animal {} // Herança

// Cachorro TEM UMA Cauda
public class Cachorro {
    private Cauda cauda; // Composição
}

// Carro É UM Veículo
public class Carro extends Veiculo {} // Herança

// Carro TEM UM Motor
public class Carro {
    private Motor motor; // Composição
}
```

**Regra**: Use **herança** para "é-um", **composição** para "tem-um".

### 4. Substituibilidade (Princípio de Liskov)

**Se A é um B**, então A pode **substituir B** em qualquer contexto.

```java
public class Animal {
    public void mover() {
        System.out.println("Movendo");
    }
}

public class Cachorro extends Animal {
    // Cachorro pode substituir Animal
}

// Método espera Animal
public void fazerMover(Animal animal) {
    animal.mover();
}

// ✅ Cachorro pode substituir Animal
fazerMover(new Animal());    // OK
fazerMover(new Cachorro());  // OK (Cachorro É UM Animal)
```

### 5. Exemplos Corretos de "é-um"

```java
// Gerente É UM Funcionário
public class Funcionario {}
public class Gerente extends Funcionario {}

// ArrayList É UMA List
public class ArrayList<E> extends AbstractList<E> implements List<E> {}

// StringBuilder É UM Appendable
public class StringBuilder implements Appendable {}

// IOException É UMA Exception
public class IOException extends Exception {}

// Quadrado É UMA Forma
public class Forma {}
public class Quadrado extends Forma {}
```

### 6. Exemplos Incorretos (Use Composição)

```java
// ❌ Carro É UM Motor? NÃO!
// public class Carro extends Motor {}

// ✅ Carro TEM UM Motor
public class Carro {
    private Motor motor;
}

// ❌ Pessoa É UM Endereço? NÃO!
// public class Pessoa extends Endereco {}

// ✅ Pessoa TEM UM Endereço
public class Pessoa {
    private Endereco endereco;
}

// ❌ Cachorro É UMA Raça? NÃO!
// public class Cachorro extends Raca {}

// ✅ Cachorro TEM UMA Raça
public class Cachorro {
    private Raca raca;
}
```

### 7. "é-um" em Hierarquias

**Relação transitiva**: Se A é um B e B é um C, então A é um C.

```java
// Cachorro É UM Mamífero
// Mamífero É UM Animal
// Logo: Cachorro É UM Animal

public class Animal {}
public class Mamifero extends Animal {}
public class Cachorro extends Mamifero {}

// Cachorro herda de Mamifero e Animal
Cachorro c = new Cachorro();
Mamifero m = c; // ✅ Cachorro é um Mamífero
Animal a = c;   // ✅ Cachorro é um Animal
```

### 8. Violações Comuns

#### Herança por Conveniência

```java
// ❌ Herdar apenas para reutilizar código
public class Stack extends Vector {
    // Stack não É UM Vector (semanticamente)
}

// ✅ Use composição
public class Stack {
    private List<Object> elements = new ArrayList<>();
}
```

#### Herança Incorreta

```java
// ❌ Quadrado herda Retângulo
public class Retangulo {
    protected int largura;
    protected int altura;
    
    public void setLargura(int l) { largura = l; }
    public void setAltura(int a) { altura = a; }
}

public class Quadrado extends Retangulo {
    // Problema: Quadrado não pode ter largura ≠ altura
    // Viola substituibilidade
}

// ✅ Use classe separada
public class Quadrado {
    private int lado;
}
```

### 9. Teste com Polimorfismo

**Se herança está correta**, polimorfismo funciona naturalmente.

```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au");
    }
}

// ✅ Funciona porque Cachorro É UM Animal
public void testar(Animal animal) {
    animal.emitirSom();
}

testar(new Cachorro()); // Au au
```

### 10. "é-um" e Interfaces

**Implementar interface também é relação "é-um"**.

```java
// ArrayList É UMA List
public class ArrayList<E> implements List<E> {}

// LinkedList É UMA List
public class LinkedList<E> implements List<E> {}

// Uso polimórfico
List<String> lista1 = new ArrayList<>(); // ✅
List<String> lista2 = new LinkedList<>(); // ✅
```

---

## Aplicabilidade

**Use herança ("é-um") quando**:
- **Especialização natural** (Gerente é um Funcionário)
- **Substituibilidade** (Cachorro pode substituir Animal)
- **Comportamento comum** compartilhado
- **Hierarquia conceitual** clara

**Use composição ("tem-um") quando**:
- **Relação de posse** (Carro tem Motor)
- **Flexibilidade** necessária (trocar Motor)
- **Não há substituibilidade** (Carro não substitui Motor)

---

## Armadilhas

### 1. Herança por Reutilização

```java
// ❌ Herança incorreta (apenas para reutilizar código)
public class Pessoa {
    public void salvarNoBanco() {}
}

public class Produto extends Pessoa {
    // Produto não É UMA Pessoa!
}

// ✅ Use composição ou classe utilitária
public class Dao {
    public void salvar(Object obj) {}
}
```

### 2. Violação de Substituibilidade

```java
// ❌ Pinguim não voa (viola contrato de Ave)
public class Ave {
    public void voar() {
        System.out.println("Voando");
    }
}

public class Pinguim extends Ave {
    @Override
    public void voar() {
        throw new UnsupportedOperationException(); // ❌ Quebra contrato
    }
}

// ✅ Separe responsabilidades
public class Ave {}
public class AveVoadora extends Ave {
    public void voar() {}
}
public class Pinguim extends Ave {}
```

### 3. Herança Forçada

```java
// ❌ Forçar relação inexistente
// Círculo É UM Elipse? (matematicamente sim, mas em OO pode causar problemas)

public class Elipse {
    protected double raioMaior;
    protected double raioMenor;
}

public class Circulo extends Elipse {
    // raioMenor sempre igual a raioMaior (redundante)
}

// ✅ Classes separadas
public class Circulo {
    private double raio;
}
```

---

## Boas Práticas

### 1. Pergunte "é-um?" Antes de Herdar

**Sempre teste** a relação verbalmente.

### 2. Prefira Composição Quando em Dúvida

**Composição é mais flexível** que herança.

```java
// Se não tem certeza, use composição
public class Carro {
    private Motor motor;
    private Roda[] rodas;
}
```

### 3. Garanta Substituibilidade

**Subclasse deve funcionar** onde superclasse é esperada.

```java
public void processar(Animal animal) {
    animal.mover(); // Deve funcionar para QUALQUER Animal
}
```

### 4. Evite Hierarquias Profundas

**Relação "é-um"** fica confusa em hierarquias muito profundas.

### 5. Use Interfaces Para Múltiplos "é-um"

```java
// Pato É UM Animal
// Pato É UM Nadador
// Pato É UM Voador

public class Pato extends Animal implements Nadador, Voador {}
```

---

## Resumo

**Relação "é-um"**:

**Definição**: Subclasse **é uma versão** mais específica da superclasse.

**Teste**:
```
"X é um Y?" → SIM → Herança
"X tem um Y?" → SIM → Composição
```

**Exemplos corretos**:
```java
// ✅ Cachorro É UM Animal
public class Cachorro extends Animal {}

// ✅ Gerente É UM Funcionário
public class Gerente extends Funcionario {}
```

**Exemplos incorretos**:
```java
// ❌ Carro É UM Motor? NÃO!
// public class Carro extends Motor {}

// ✅ Carro TEM UM Motor
public class Carro {
    private Motor motor;
}
```

**Substituibilidade**:
```java
// Se Cachorro É UM Animal, então:
Animal a = new Cachorro(); // ✅ Funciona
processar(new Cachorro());  // ✅ Funciona onde Animal é esperado
```

**Relação com composição**:
- **"é-um"**: Herança (extends)
- **"tem-um"**: Composição (atributo)

**Regra de Ouro**: Use herança **APENAS** quando a relação **"é-um"** for **clara e verdadeira**. Caso contrário, use **composição**. Sempre garanta **substituibilidade** (Princípio de Liskov).
