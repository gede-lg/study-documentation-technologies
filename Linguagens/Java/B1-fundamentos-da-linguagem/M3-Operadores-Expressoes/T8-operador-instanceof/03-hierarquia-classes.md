# Hierarquia de Classes e instanceof

## 🎯 Introdução e Definição

### Definição Conceitual

O operador `instanceof` em Java não verifica apenas o tipo **exato** de um objeto, mas sim **toda a hierarquia de tipos** à qual o objeto pertence. Isso significa que um objeto é considerado instância de sua classe concreta, de todas as suas **superclasses**, e de todas as **interfaces** que ele implementa (direta ou indiretamente).

**Princípio fundamental**:
> Um objeto é `instanceof` de um tipo T se o objeto pode ser **atribuído** a uma variável do tipo T sem cast.

```java
class Animal {}
class Cachorro extends Animal {}

Cachorro c = new Cachorro();

c instanceof Cachorro  // true - tipo concreto
c instanceof Animal    // true - superclasse
c instanceof Object    // true - ancestral de todas as classes
```

Esta característica reflete o **princípio de substituição de Liskov** (LSP) e o conceito de **polimorfismo** em orientação a objetos.

---

## 📋 Sumário Conceitual

### Hierarquia e instanceof

```java
        Object                  ← c instanceof Object = true
          ↑
        Animal                  ← c instanceof Animal = true
          ↑
       Cachorro                 ← c instanceof Cachorro = true
          ↑
          c (objeto concreto)
```

**Regra geral**:
- ✅ instanceof retorna `true` para o tipo exato
- ✅ instanceof retorna `true` para todos os ancestrais
- ✅ instanceof retorna `true` para todas as interfaces implementadas
- ❌ instanceof retorna `false` para tipos não relacionados
- ❌ instanceof retorna `false` para subtipos (filho não é pai específico)

---

## 🧠 Fundamentos Teóricos

### 1. Hierarquia de Classes Simples

**Herança linear**:

```java
class A {}
class B extends A {}
class C extends B {}
class D extends C {}

D obj = new D();

// Toda a hierarquia retorna true
obj instanceof D       // true - tipo exato
obj instanceof C       // true - pai direto
obj instanceof B       // true - avô
obj instanceof A       // true - bisavô
obj instanceof Object  // true - topo universal
```

**Visualização da hierarquia**:
```
    Object (true)
      ↑
      A (true)
      ↑
      B (true)
      ↑
      C (true)
      ↑
      D (true) ← obj
```

**Exemplo prático**:
```java
class Veiculo {}
class Terrestre extends Veiculo {}
class Carro extends Terrestre {}
class Sedan extends Carro {}

Sedan meuCarro = new Sedan();

System.out.println(meuCarro instanceof Sedan);      // true
System.out.println(meuCarro instanceof Carro);      // true
System.out.println(meuCarro instanceof Terrestre);  // true
System.out.println(meuCarro instanceof Veiculo);    // true
System.out.println(meuCarro instanceof Object);     // true
```

### 2. Hierarquia com Interfaces

**Interface única**:
```java
interface Voador {}
class Passaro implements Voador {}

Passaro passaro = new Passaro();

passaro instanceof Passaro  // true - classe
passaro instanceof Voador   // true - interface implementada
passaro instanceof Object   // true - topo
```

**Múltiplas interfaces**:
```java
interface Nadador {}
interface Voador {}
class Pato implements Nadador, Voador {}

Pato pato = new Pato();

pato instanceof Pato     // true - classe
pato instanceof Nadador  // true - interface 1
pato instanceof Voador   // true - interface 2
pato instanceof Object   // true - topo
```

**Hierarquia de interfaces**:
```java
interface A {}
interface B extends A {}
interface C extends B {}
class X implements C {}

X obj = new X();

obj instanceof X  // true - classe
obj instanceof C  // true - interface direta
obj instanceof B  // true - interface pai
obj instanceof A  // true - interface avô
```

**Visualização**:
```
    Object
      ↑
      X ←───────── obj
      ↑
      C (interface)
      ↑
      B (interface)
      ↑
      A (interface)
```

### 3. Herança e Interfaces Combinadas

**Classe abstrata com interfaces**:
```java
interface Respirador {}
abstract class Animal implements Respirador {}
class Mamifero extends Animal {}
class Cachorro extends Mamifero {}

Cachorro c = new Cachorro();

c instanceof Cachorro    // true - tipo concreto
c instanceof Mamifero    // true - pai
c instanceof Animal      // true - avô abstrato
c instanceof Respirador  // true - interface implementada por avô
c instanceof Object      // true - topo
```

**Hierarquia completa**:
```
         Object
           ↑
    Animal (abstract) ←─ implements ─ Respirador (interface)
           ↑
        Mamifero
           ↑
        Cachorro ← c
```

### 4. Polimorfismo e Substituibilidade

**Princípio de Substituição de Liskov (LSP)**:

Se S é subtipo de T, então objetos do tipo T podem ser substituídos por objetos do tipo S.

```java
class Animal {}
class Cachorro extends Animal {}

// Substituição polimórfica
Animal animal = new Cachorro();  // ✅ Válido

// instanceof reflete substituibilidade
animal instanceof Animal    // true - tipo declarado
animal instanceof Cachorro  // true - tipo real
animal instanceof Object    // true - ancestral
```

**Teste de atribuibilidade**:
```java
// Regra: obj instanceof T é true se:
// T variavel = obj;  // É válido sem cast

Cachorro c = new Cachorro();

// ✅ Animal a = c; é válido → instanceof retorna true
c instanceof Animal  // true

// ❌ String s = c; NÃO é válido → instanceof retorna false
c instanceof String  // false (tipos incompatíveis)
```

### 5. instanceof e Tipo Declarado vs Tipo Real

**Tipo declarado** (compile-time) vs **Tipo real** (runtime):

```java
Animal animal = new Cachorro();
//  ↑              ↑
// Tipo           Tipo
// declarado      real

// instanceof verifica tipo REAL
animal instanceof Animal    // true
animal instanceof Cachorro  // true (tipo real!)
```

**Exemplo detalhado**:
```java
class A {}
class B extends A {}
class C extends B {}

// Tipo declarado: A
// Tipo real: C
A ref = new C();

ref instanceof A  // true - tipo declarado
ref instanceof B  // true - intermediário
ref instanceof C  // true - tipo REAL

// getClass() retorna tipo real
ref.getClass() == C.class  // true (tipo real é C)
ref.getClass() == A.class  // false
```

### 6. Verificação de Subtipos

**instanceof NÃO verifica subtipos** (só supertipo e tipo exato):

```java
class Animal {}
class Cachorro extends Animal {}
class Gato extends Animal {}

Animal animal = new Animal();

animal instanceof Animal    // true - tipo exato
animal instanceof Cachorro  // false - subtipo
animal instanceof Gato      // false - subtipo
```

**Por quê?** Animal **não é** Cachorro (mas Cachorro **é** Animal).

**Comparação**:
```java
Cachorro c = new Cachorro();
Animal a = new Animal();

// ✅ Subtipo é supertipo (herança ascendente)
c instanceof Animal  // true (Cachorro é Animal)

// ❌ Supertipo não é subtipo (herança descendente)
a instanceof Cachorro  // false (Animal não é necessariamente Cachorro)
```

### 7. Interfaces e Herança Múltipla de Tipo

Java permite **herança múltipla de tipo** via interfaces:

```java
interface A {}
interface B {}
class C implements A, B {}

C obj = new C();

obj instanceof A  // true
obj instanceof B  // true
obj instanceof C  // true

// obj pertence a múltiplos tipos simultaneamente
```

**Exemplo de "diamond problem" resolvido**:
```java
interface I1 { default void m() { } }
interface I2 { default void m() { } }
class C implements I1, I2 {
    @Override
    public void m() { }  // Resolve conflito
}

C obj = new C();
obj instanceof I1  // true
obj instanceof I2  // true
```

### 8. Classes Abstratas na Hierarquia

**Classe abstrata** é verificável com instanceof:

```java
abstract class Animal {
    abstract void emitirSom();
}

class Cachorro extends Animal {
    void emitirSom() { System.out.println("Au au"); }
}

Cachorro c = new Cachorro();

c instanceof Cachorro  // true
c instanceof Animal    // true (mesmo sendo abstrata!)
```

**Não é possível instanciar, mas instanceof funciona**:
```java
// ❌ Não pode instanciar
// Animal a = new Animal();  // ERRO!

// ✅ Mas instanceof funciona
Animal a = new Cachorro();
a instanceof Animal  // true
```

### 9. Hierarquia de Arrays

Arrays também têm hierarquia:

```java
String[] strings = {"a", "b"};

strings instanceof String[]   // true - tipo exato
strings instanceof Object[]   // true - arrays são covariantes
strings instanceof Object     // true - array é Object
strings instanceof Cloneable  // true - arrays implementam Cloneable
strings instanceof Serializable  // true - arrays implementam Serializable
```

**Covariância de arrays**:
```java
class Animal {}
class Cachorro extends Animal {}

Cachorro[] cachorros = new Cachorro[3];

cachorros instanceof Cachorro[]  // true
cachorros instanceof Animal[]    // true (covariância!)
cachorros instanceof Object[]    // true
cachorros instanceof Object      // true
```

**Arrays primitivos**:
```java
int[] arr = {1, 2, 3};

arr instanceof int[]    // true
arr instanceof Object   // true
arr instanceof int      // ERRO! (int é primitivo)
```

### 10. Tipos Finais e instanceof

Classes **final** não podem ter subclasses:

```java
final class String {}

String s = "texto";

s instanceof String  // true
s instanceof Object  // true
// Não há subtipos de String (é final)
```

**Otimização com final**:
```java
// Compilador pode otimizar instanceof com classes final
if (obj instanceof String) {
    // Compilador sabe que obj é EXATAMENTE String
    // (não pode ser subtipo, pois String é final)
}
```

---

## 🔍 Análise Conceitual Profunda

### Por Que instanceof Verifica Hierarquia?

**1. Polimorfismo**

Java é orientado a objetos com polimorfismo:
```java
List<Animal> animais = List.of(new Cachorro(), new Gato());

for (Animal a : animais) {
    // Tipo declarado: Animal
    // Tipo real: Cachorro ou Gato
    
    if (a instanceof Cachorro) {
        // Detecta tipo real
    }
}
```

**2. Substituição de Liskov**

instanceof reflete se um objeto pode substituir outro:
```java
// Se isto é válido sem cast:
Animal a = new Cachorro();

// Então isto deve ser true:
new Cachorro() instanceof Animal  // true
```

**3. Compatibilidade de Tipos**

instanceof verifica **compatibilidade de atribuição**:
```java
// Regra mental: obj instanceof T ≈ "T var = obj é válido?"

Cachorro c = new Cachorro();

// Animal a = c; é válido?
c instanceof Animal  // true

// String s = c; é válido?
c instanceof String  // false
```

### instanceof vs getClass()

**Diferença fundamental**:

| Aspecto | instanceof | getClass() |
|---------|-----------|------------|
| **Hierarquia** | Aceita supertipo | Apenas tipo exato |
| **Subtipo** | true para ancestrais | false para ancestrais |
| **Uso** | Polimórfico | Tipo exato |

**Exemplos**:
```java
class Animal {}
class Cachorro extends Animal {}

Cachorro c = new Cachorro();

// instanceof: aceita hierarquia
c instanceof Animal    // true
c instanceof Cachorro  // true

// getClass(): apenas tipo exato
c.getClass() == Animal.class    // false
c.getClass() == Cachorro.class  // true
```

**Quando usar cada um**:
```java
// ✅ instanceof: comportamento polimórfico
if (animal instanceof Voador) {
    ((Voador) animal).voar();  // Qualquer subtipo de Voador
}

// ✅ getClass(): tipo exato (raro)
if (obj.getClass() == String.class) {
    // EXATAMENTE String, não subtipo
}
```

### Hierarquia e Design Patterns

**Visitor Pattern**:
```java
interface Visitor {
    void visit(Cachorro c);
    void visit(Gato g);
}

// instanceof evitado com double dispatch
animal.accept(visitor);
```

**Strategy Pattern**:
```java
// Em vez de instanceof
if (animal instanceof Cachorro) {
    // Comportamento específico
}

// Use estratégia
animal.executarComportamento();
```

---

## 🎯 Aplicabilidade e Contextos

### 1. **Processamento Polimórfico**

```java
public void processar(Animal animal) {
    if (animal instanceof Cachorro) {
        Cachorro c = (Cachorro) animal;
        c.latir();
    } else if (animal instanceof Gato) {
        Gato g = (Gato) animal;
        g.miar();
    } else if (animal instanceof Passaro) {
        Passaro p = (Passaro) animal;
        p.cantar();
    }
}
```

### 2. **Validação de Hierarquia**

```java
public boolean isValido(Object obj) {
    // Aceita qualquer tipo que implemente Serializable
    return obj instanceof Serializable;
}
```

### 3. **Cast Seguro em Hierarquia**

```java
public void configurar(Veiculo veiculo) {
    if (veiculo instanceof Terrestre) {
        Terrestre t = (Terrestre) veiculo;
        t.ajustarRodas();
    }
    
    if (veiculo instanceof Aereo) {
        Aereo a = (Aereo) veiculo;
        a.ajustarAsas();
    }
}
```

### 4. **Filtragem por Tipo**

```java
List<Animal> animais = getAnimais();

List<Mamifero> mamiferos = animais.stream()
    .filter(a -> a instanceof Mamifero)
    .map(a -> (Mamifero) a)
    .collect(Collectors.toList());
```

### 5. **Equals() com Hierarquia**

```java
@Override
public boolean equals(Object obj) {
    // Aceita apenas tipo exato (getClass())
    if (obj == null || getClass() != obj.getClass()) {
        return false;
    }
    
    // OU aceita hierarquia (instanceof)
    if (!(obj instanceof MinhaClasse)) {
        return false;
    }
    
    MinhaClasse other = (MinhaClasse) obj;
    return Objects.equals(campo, other.campo);
}
```

---

## ⚠️ Armadilhas Comuns

### 1. **Ordem Incorreta em Verificações**

```java
class Animal {}
class Cachorro extends Animal {}

Animal a = new Cachorro();

// ❌ Ordem errada: Animal sempre executa primeiro
if (a instanceof Animal) {
    System.out.println("Animal");  // Sempre executado para Cachorro!
} else if (a instanceof Cachorro) {
    System.out.println("Cachorro");  // Nunca alcançado
}

// ✅ Ordem correta: mais específico primeiro
if (a instanceof Cachorro) {
    System.out.println("Cachorro");
} else if (a instanceof Animal) {
    System.out.println("Animal");
}
```

### 2. **Confundir instanceof com getClass()**

```java
Cachorro c = new Cachorro();

// instanceof: aceita hierarquia
c instanceof Animal  // true

// getClass(): apenas exato
c.getClass() == Animal.class  // false!
```

### 3. **Verificação Redundante**

```java
// ❌ Redundante
if (obj instanceof Animal) {
    if (obj instanceof Object) {  // Sempre true!
        // ...
    }
}
```

### 4. **Tipos Incompatíveis**

```java
String s = "texto";

// ⚠️ Compilador avisa: sempre false
if (s instanceof Integer) {  // String e Integer não relacionados
    // Nunca executado
}
```

### 5. **Esquecer null**

```java
Animal animal = null;

animal instanceof Animal  // false (não true!)
```

---

## 🚀 Boas Práticas

### 1. ✅ Ordem Específico → Genérico

```java
if (obj instanceof Sedan) {
    // Mais específico
} else if (obj instanceof Carro) {
    // Menos específico
} else if (obj instanceof Veiculo) {
    // Genérico
}
```

### 2. ✅ Use Polimorfismo Quando Possível

```java
// ❌ instanceof excessivo
if (animal instanceof Cachorro) {
    ((Cachorro) animal).latir();
} else if (animal instanceof Gato) {
    ((Gato) animal).miar();
}

// ✅ Polimorfismo
animal.emitirSom();  // Método polimórfico
```

### 3. ✅ Documente Hierarquia Complexa

```java
/**
 * Processa veículos terrestres.
 * Aceita qualquer subtipo de Terrestre.
 */
public void processar(Veiculo v) {
    if (v instanceof Terrestre) {
        // ...
    }
}
```

### 4. ✅ Considere Pattern Matching

```java
// Java 16+
if (obj instanceof Cachorro c) {
    c.latir();
} else if (obj instanceof Gato g) {
    g.miar();
}
```

### 5. ✅ Teste Hierarquia Completa

```java
@Test
void testHierarquia() {
    Sedan s = new Sedan();
    
    assertTrue(s instanceof Sedan);
    assertTrue(s instanceof Carro);
    assertTrue(s instanceof Terrestre);
    assertTrue(s instanceof Veiculo);
    assertTrue(s instanceof Object);
}
```

### 6. ✅ Use instanceof para Interfaces

```java
if (obj instanceof Serializable) {
    serialize((Serializable) obj);
}
```

### 7. ✅ Evite Violação de LSP

```java
// ❌ Viola LSP
if (animal instanceof Cachorro) {
    // Comportamento especial apenas para Cachorro
    // Quebra polimorfismo
}

// ✅ Respeita LSP
animal.executarComportamento();
```

### 8. ✅ Combine com Generics

```java
public <T extends Animal> void processar(T animal) {
    if (animal instanceof Mamifero) {
        // Processamento específico
    }
}
```

### 9. ✅ Prefira instanceof a Cast Direto

```java
// ❌ Unsafe
Animal a = getAnimal();
Cachorro c = (Cachorro) a;  // Pode lançar ClassCastException

// ✅ Safe
if (a instanceof Cachorro) {
    Cachorro c = (Cachorro) a;  // Garantido ser seguro
}
```

### 10. ✅ Use em Equals Cuidadosamente

```java
// Decisão de design: instanceof (aceita subtipos) ou getClass() (tipo exato)?

// instanceof: flexível mas pode quebrar simetria
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof MinhaClasse)) return false;
    // ...
}

// getClass(): restritivo mas simétrico
@Override
public boolean equals(Object obj) {
    if (obj == null || getClass() != obj.getClass()) return false;
    // ...
}
```

---

## 📚 Resumo

O operador `instanceof` em Java verifica **toda a hierarquia de tipos**, refletindo o **polimorfismo** e o **princípio de substituição de Liskov**. Um objeto é `instanceof` de:
- ✅ Seu tipo exato
- ✅ Todas as suas superclasses
- ✅ Todas as interfaces que implementa (direta ou indiretamente)
- ✅ Object (topo universal)

Use instanceof para **cast seguro** e **processamento polimórfico**, mas sempre ordene verificações do **mais específico ao mais genérico**. Quando possível, prefira **polimorfismo** (métodos virtuais) a cadeias de instanceof, pois isso resulta em código mais **manutenível** e alinhado com princípios de **orientação a objetos**.

