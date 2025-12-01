# Sobrecarga de Métodos (Overloading)

## 🎯 Introdução e Definição

**Sobrecarga de métodos** (method overloading) é a capacidade de **criar múltiplos métodos** com o **mesmo nome** mas **assinaturas diferentes** na mesma classe. Permite que métodos relacionados compartilhem o mesmo nome enquanto aceitam **diferentes tipos** ou **quantidades** de parâmetros, tornando a API mais intuitiva e flexível.

**Conceito central**: Overloading = **mesmo nome, diferentes parâmetros**. A diferença está na **lista de parâmetros** (tipo, quantidade ou ordem), **não** no tipo de retorno ou modificadores. É como ter **várias versões** do mesmo método para diferentes necessidades - `calcular(int)`, `calcular(int, int)`, `calcular(double)` são métodos **diferentes** identificados pela assinatura.

**Analogia completa**:
- **Método sobrecarregado**: Restaurante com cardápio variado
- **Mesmo nome**: "Pedir" (ação genérica)
- **Diferentes parâmetros**: pedir(Pizza), pedir(Hamburguer, Bebida), pedir(String nome)
- **Escolha automática**: Garçom entende o pedido pelo que você passa
- **Resultado**: Flexibilidade sem nomes diferentes (pedirPizza, pedirCombo, pedirPorNome)

**Regras de sobrecarga**:
```
DEVE ser DIFERENTE:
✓ Quantidade de parâmetros
✓ Tipo dos parâmetros
✓ Ordem dos parâmetros

PODE ser DIFERENTE (mas não diferencia):
○ Tipo de retorno
○ Modificadores (public, private)
○ Nome dos parâmetros
○ Exceções declaradas
```

**Estrutura**:
```java
// Sobrecarga - MESMO nome, DIFERENTES parâmetros

public int somar(int a, int b) {
    //       ↑ Assinatura: somar(int, int)
    return a + b;
}

public int somar(int a, int b, int c) {
    //       ↑ Assinatura: somar(int, int, int) - DIFERENTE (3 params)
    return a + b + c;
}

public double somar(double a, double b) {
    //          ↑ Assinatura: somar(double, double) - DIFERENTE (tipos)
    return a + b;
}

// VÁLIDO - assinaturas diferentes
// Compiler escolhe baseado em argumentos passados
```

**Exemplo completo**:
```java
public class Calculadora {
    // 1. Quantidade diferente
    public int somar(int a, int b) {
        return a + b;
    }
    
    public int somar(int a, int b, int c) {
        return a + b + c;  // 3 parâmetros
    }
    
    // 2. Tipos diferentes
    public double somar(double a, double b) {
        return a + b;  // double
    }
    
    public String somar(String a, String b) {
        return a + b;  // String (concatenação)
    }
    
    // 3. Ordem diferente
    public void exibir(int numero, String texto) {
        System.out.println(numero + " - " + texto);
    }
    
    public void exibir(String texto, int numero) {
        System.out.println(texto + " - " + numero);  // Ordem invertida
    }
}

// USO - Compiler escolhe método correto:
Calculadora calc = new Calculadora();

calc.somar(10, 20);           // Chama somar(int, int) → 30
calc.somar(10, 20, 30);       // Chama somar(int, int, int) → 60
calc.somar(10.5, 20.5);       // Chama somar(double, double) → 31.0
calc.somar("A", "B");         // Chama somar(String, String) → "AB"
calc.exibir(10, "Texto");     // Chama exibir(int, String)
calc.exibir("Texto", 10);     // Chama exibir(String, int)
```

## 📋 Fundamentos Teóricos

### 1️⃣ Sobrecarga por Quantidade de Parâmetros

**Conceito**: Métodos com **diferentes quantidades** de parâmetros.

**Exemplo**:
```java
public class Produto {
    private String nome;
    private double preco;
    private String descricao;
    
    // 0 parâmetros
    public void exibir() {
        System.out.println(nome);
    }
    
    // 1 parâmetro
    public void exibir(String prefixo) {
        System.out.println(prefixo + nome);
    }
    
    // 2 parâmetros
    public void exibir(String prefixo, String sufixo) {
        System.out.println(prefixo + nome + sufixo);
    }
}

// Uso:
Produto p = new Produto();
p.exibir();              // Chama exibir()
p.exibir(">> ");         // Chama exibir(String)
p.exibir(">> ", " <<");  // Chama exibir(String, String)
```

**StringBuilder.append**:
```java
StringBuilder sb = new StringBuilder();

sb.append("texto");     // append(String)
sb.append(10);          // append(int)
sb.append(10.5);        // append(double)
sb.append('A');         // append(char)
sb.append(true);        // append(boolean)
sb.append(new Object());  // append(Object)

// Todas são sobrecarga do mesmo método 'append'
```

### 2️⃣ Sobrecarga por Tipo de Parâmetros

**Conceito**: Métodos com **diferentes tipos** de parâmetros.

**Exemplo**:
```java
public class Conversor {
    // int
    public String converter(int numero) {
        return "Inteiro: " + numero;
    }
    
    // double
    public String converter(double numero) {
        return "Double: " + numero;
    }
    
    // boolean
    public String converter(boolean flag) {
        return "Boolean: " + flag;
    }
    
    // String
    public String converter(String texto) {
        return "String: " + texto;
    }
}

// Uso:
Conversor c = new Conversor();
c.converter(10);      // int → "Inteiro: 10"
c.converter(10.5);    // double → "Double: 10.5"
c.converter(true);    // boolean → "Boolean: true"
c.converter("ABC");   // String → "String: ABC"
```

**Arrays vs elemento**:
```java
public void processar(int numero) {
    System.out.println("Um número: " + numero);
}

public void processar(int[] numeros) {
    System.out.println("Array com " + numeros.length + " elementos");
}

// Uso:
processar(10);              // Chama processar(int)
processar(new int[]{1,2,3});  // Chama processar(int[])
```

### 3️⃣ Sobrecarga por Ordem de Parâmetros

**Conceito**: Ordem **diferente** cria assinatura diferente.

**Exemplo**:
```java
public class Registro {
    // String primeiro, int segundo
    public void registrar(String nome, int idade) {
        System.out.println("Nome: " + nome + ", Idade: " + idade);
    }
    
    // int primeiro, String segundo
    public void registrar(int id, String nome) {
        System.out.println("ID: " + id + ", Nome: " + nome);
    }
}

// Uso:
Registro r = new Registro();
r.registrar("João", 30);   // Chama registrar(String, int)
r.registrar(123, "João");  // Chama registrar(int, String)
```

**⚠️ Cuidado - tipos iguais com ordem**:
```java
// ✓ VÁLIDO - tipos DIFERENTES:
public void metodo(int x, String s) { }
public void metodo(String s, int x) { }  // OK - ordem diferente

// ❌ INVÁLIDO - tipos IGUAIS:
public void metodo(int a, int b) { }
public void metodo(int x, int y) { }  // ❌ ERRO: mesma assinatura
// Nome dos parâmetros NÃO diferencia
```

### 4️⃣ Regras de Resolução de Sobrecarga

**Conceito**: Compiler escolhe método mais **específico** aplicável.

**Correspondência exata**:
```java
public void metodo(int x) {
    System.out.println("int");
}

public void metodo(double x) {
    System.out.println("double");
}

// Uso:
metodo(10);    // int (correspondência EXATA)
metodo(10.5);  // double (correspondência EXATA)
```

**Widening** (promoção automática):
```java
public void metodo(double x) {
    System.out.println("double");
}

// Uso:
metodo(10);  // int → double (widening)
// Compiler promove int para double
```

**Autoboxing**:
```java
public void metodo(Integer x) {
    System.out.println("Integer");
}

// Uso:
metodo(10);  // int → Integer (autoboxing)
```

**Varargs** (menor prioridade):
```java
public void metodo(int x) {
    System.out.println("int");
}

public void metodo(int... numeros) {
    System.out.println("varargs");
}

// Uso:
metodo(10);  // Chama metodo(int) - mais específico
// Varargs tem menor prioridade
```

**Prioridade**:
```
1. Correspondência EXATA
2. Widening (byte → short → int → long → float → double)
3. Autoboxing (int → Integer)
4. Varargs (int... como int[])
```

**Exemplo completo**:
```java
public class Teste {
    public void metodo(int x) {
        System.out.println("int");
    }
    
    public void metodo(long x) {
        System.out.println("long");
    }
    
    public void metodo(Integer x) {
        System.out.println("Integer");
    }
    
    public void metodo(int... numeros) {
        System.out.println("varargs");
    }
}

// Uso:
Teste t = new Teste();

t.metodo(10);          // "int" (exato)
t.metodo(10L);         // "long" (exato)
t.metodo(Integer.valueOf(10));  // "Integer" (exato)

byte b = 10;
t.metodo(b);           // "int" (widening: byte → int)

t.metodo(10, 20);      // "varargs" (único que aceita 2 args)
```

### 5️⃣ Ambiguidade em Sobrecarga

**Conceito**: Compiler não consegue decidir qual método chamar.

**Ambiguidade com widening**:
```java
public void metodo(int x, double y) { }
public void metodo(double x, int y) { }

// Uso:
metodo(10, 20);  // ❌ ERRO: ambiguous
// Pode ser:
// - metodo(int, double) → widening no 2º param (10, 20.0)
// - metodo(double, int) → widening no 1º param (10.0, 20)
// Compiler não sabe qual escolher
```

**Solução - cast explícito**:
```java
metodo(10, 20.0);        // OK - metodo(int, double)
metodo(10.0, 20);        // OK - metodo(double, int)
metodo((double)10, 20);  // OK - metodo(double, int) com cast
```

**Ambiguidade com null**:
```java
public void metodo(String s) { }
public void metodo(Integer i) { }

// Uso:
metodo(null);  // ❌ ERRO: ambiguous
// null é compatível com String E Integer
```

**Solução - cast**:
```java
metodo((String)null);   // OK - chama metodo(String)
metodo((Integer)null);  // OK - chama metodo(Integer)
```

### 6️⃣ Sobrecarga vs Overriding

**Conceito**: **Sobrecarga** (overloading) ≠ **Sobrescrita** (overriding).

**Sobrecarga** (mesma classe, assinaturas diferentes):
```java
public class Calculadora {
    // SOBRECARGA (overloading)
    public int somar(int a, int b) {
        return a + b;
    }
    
    public int somar(int a, int b, int c) {
        return a + b + c;  // DIFERENTE assinatura
    }
}
```

**Sobrescrita** (subclasse, mesma assinatura):
```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        // SOBRESCRITA (overriding) - MESMA assinatura
        System.out.println("Au au");
    }
}
```

**Comparação**:
```
SOBRECARGA (Overloading):
- MESMA classe
- MESMO nome
- ASSINATURAS DIFERENTES
- Resolvido em TEMPO DE COMPILAÇÃO
- Não usa @Override

SOBRESCRITA (Overriding):
- SUBCLASSE
- MESMO nome
- MESMA assinatura
- Resolvido em TEMPO DE EXECUÇÃO
- Usa @Override
```

### 7️⃣ Sobrecarga com Varargs

**Conceito**: Varargs pode ser sobrecarregado mas tem **menor prioridade**.

**Exemplo**:
```java
public class Soma {
    // Específico (2 params)
    public int somar(int a, int b) {
        System.out.println("2 params");
        return a + b;
    }
    
    // Varargs (0 ou mais)
    public int somar(int... numeros) {
        System.out.println("varargs");
        int soma = 0;
        for (int n : numeros) {
            soma += n;
        }
        return soma;
    }
}

// Uso:
Soma s = new Soma();

s.somar(10, 20);     // "2 params" (método específico tem prioridade)
s.somar(10, 20, 30); // "varargs" (único que aceita 3)
s.somar();           // "varargs" (único que aceita 0)
```

**Varargs e array**:
```java
public void metodo(int[] numeros) {
    System.out.println("array");
}

public void metodo(int... numeros) {
    System.out.println("varargs");
}
// ❌ ERRO: assinatura DUPLICADA
// int... é tratado como int[] internamente
```

### 8️⃣ Sobrecarga de Construtores

**Conceito**: Construtores podem ser sobrecarregados.

**Exemplo**:
```java
public class Produto {
    private String nome;
    private double preco;
    private int estoque;
    
    // Construtor sem parâmetros
    public Produto() {
        this.nome = "Sem nome";
        this.preco = 0.0;
        this.estoque = 0;
    }
    
    // Construtor com nome
    public Produto(String nome) {
        this.nome = nome;
        this.preco = 0.0;
        this.estoque = 0;
    }
    
    // Construtor com nome e preço
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = 0;
    }
    
    // Construtor completo
    public Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }
}

// Uso:
Produto p1 = new Produto();
Produto p2 = new Produto("Mouse");
Produto p3 = new Produto("Mouse", 50.0);
Produto p4 = new Produto("Mouse", 50.0, 100);
```

**Encadeamento com this()**:
```java
public class Produto {
    private String nome;
    private double preco;
    private int estoque;
    
    // Construtor completo (mestre)
    public Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }
    
    // Delega para construtor completo
    public Produto(String nome, double preco) {
        this(nome, preco, 0);  // Chama Produto(String, double, int)
    }
    
    public Produto(String nome) {
        this(nome, 0.0, 0);  // Chama Produto(String, double, int)
    }
    
    public Produto() {
        this("Sem nome", 0.0, 0);  // Chama Produto(String, double, int)
    }
}
```

### 9️⃣ Sobrecarga Inválida

**Conceito**: Algumas tentativas de sobrecarga causam **erro de compilação**.

**❌ Apenas tipo de retorno diferente**:
```java
public int metodo(int x) {
    return x;
}

public double metodo(int x) {  // ❌ ERRO: duplicate method
    return x;
}
// Assinatura IDÊNTICA: metodo(int)
// Tipo de retorno NÃO diferencia
```

**❌ Apenas modificadores diferentes**:
```java
public void metodo(int x) { }

private void metodo(int x) { }  // ❌ ERRO: duplicate method
// Modificador NÃO diferencia
```

**❌ Apenas nomes de parâmetros diferentes**:
```java
public void metodo(int a) { }

public void metodo(int b) { }  // ❌ ERRO: duplicate method
// Nome do parâmetro NÃO diferencia
```

**❌ Varargs e array**:
```java
public void metodo(int[] numeros) { }

public void metodo(int... numeros) { }  // ❌ ERRO
// int... ≡ int[] (mesma assinatura)
```

**❌ Generics com type erasure**:
```java
public void metodo(List<String> lista) { }

public void metodo(List<Integer> lista) { }  // ❌ ERRO
// Type erasure: ambos viram List (mesma assinatura)
```

### 🔟 Sobrecarga e Polimorfismo

**Conceito**: Sobrecarga é **polimorfismo em tempo de compilação** (estático).

**Sobrecarga (compile-time)**:
```java
public class Impressora {
    public void imprimir(String texto) {
        System.out.println("String: " + texto);
    }
    
    public void imprimir(int numero) {
        System.out.println("int: " + numero);
    }
}

// Compiler escolhe método em tempo de COMPILAÇÃO:
Impressora imp = new Impressora();
imp.imprimir("ABC");  // Escolhe imprimir(String)
imp.imprimir(123);    // Escolhe imprimir(int)
```

**Sobrescrita (runtime)**:
```java
public class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au");
    }
}

// JVM escolhe método em tempo de EXECUÇÃO:
Animal a = new Cachorro();  // Tipo declarado: Animal, tipo real: Cachorro
a.emitirSom();  // "Au au" (método de Cachorro, escolhido em runtime)
```

**Comparação**:
```
SOBRECARGA (Overloading):
- Polimorfismo ESTÁTICO
- Resolvido em COMPILE-TIME
- Escolha baseada em TIPO DECLARADO
- Assinaturas DIFERENTES

SOBRESCRITA (Overriding):
- Polimorfismo DINÂMICO
- Resolvido em RUNTIME
- Escolha baseada em TIPO REAL
- Assinatura IDÊNTICA
```

## 🎯 Aplicabilidade

**1. Flexibilidade de API (múltiplas formas de chamar)**
**2. Conveniência (valores padrão simulados)**
**3. Construtores com diferentes inicializações**
**4. Métodos com diferentes tipos de entrada**
**5. Sobrecarga progressiva (add, add, add...)**

## ⚠️ Armadilhas Comuns

**1. Apenas retorno diferente**:
```java
int metodo(int x) { }
double metodo(int x) { }  // ❌ ERRO
```

**2. Ambiguidade**:
```java
void metodo(int x, double y) { }
void metodo(double x, int y) { }
metodo(10, 20);  // ❌ Ambíguo
```

**3. Varargs e array**:
```java
void metodo(int[] arr) { }
void metodo(int... arr) { }  // ❌ Duplicado
```

**4. Generics type erasure**:
```java
void metodo(List<String> l) { }
void metodo(List<Integer> l) { }  // ❌ ERRO
```

**5. Sobrecarga excessiva**:
```java
// ⚠️ Dificulta leitura:
void metodo(int x) { }
void metodo(int x, int y) { }
void metodo(int x, int y, int z) { }
void metodo(double x) { }
void metodo(double x, double y) { }
// Muitas variações confunde
```

## ✅ Boas Práticas

**1. Comportamento similar**:
```java
// ✓ Métodos sobrecarregados fazem ações relacionadas
somar(int, int)
somar(double, double)
```

**2. Delegar para versão completa**:
```java
void metodo(int x) {
    metodo(x, 0);  // Delega
}

void metodo(int x, int y) {
    // Implementação completa
}
```

**3. Evitar ambiguidade**:
```java
// Use tipos claramente distintos
void processar(int x) { }
void processar(String s) { }
```

**4. Documentar**:
```java
/**
 * Sobrecarga para aceitar int ou double
 */
void calcular(int x) { }
void calcular(double x) { }
```

**5. Preferir varargs a múltiplas sobrecargas**:
```java
// ✓ Melhor:
void metodo(int... numeros) { }

// ❌ Pior:
void metodo(int a) { }
void metodo(int a, int b) { }
void metodo(int a, int b, int c) { }
```

## 📚 Resumo Executivo

**Sobrecarga = mesmo nome, diferentes parâmetros**.

**Regras**:
```java
// ✓ Quantidade:
void metodo(int x) { }
void metodo(int x, int y) { }

// ✓ Tipo:
void metodo(int x) { }
void metodo(double x) { }

// ✓ Ordem:
void metodo(int x, String s) { }
void metodo(String s, int x) { }
```

**Não diferencia**:
```java
// ❌ Retorno:
int metodo(int x) { }
double metodo(int x) { }  // ERRO

// ❌ Modificador:
public void metodo(int x) { }
private void metodo(int x) { }  // ERRO

// ❌ Nome parâmetro:
void metodo(int a) { }
void metodo(int b) { }  // ERRO
```

**Resolução**:
```
1. Correspondência exata
2. Widening (int → long → double)
3. Autoboxing (int → Integer)
4. Varargs (menor prioridade)
```

**Ambiguidade**:
```java
void metodo(int x, double y) { }
void metodo(double x, int y) { }
metodo(10, 20);  // ❌ Ambíguo
metodo(10, 20.0);  // ✓ OK
```

**Construtores**:
```java
Produto() { }
Produto(String nome) { }
Produto(String nome, double preco) { }
```

**vs Overriding**:
```
Sobrecarga:
- Mesma classe
- Assinaturas diferentes
- Compile-time

Sobrescrita:
- Subclasse
- Mesma assinatura
- Runtime
```

**Evitar**:
- Ambiguidade
- Sobrecarga excessiva
- Tipo de retorno como diferença

**Preferir**:
- Comportamento relacionado
- Delegar para versão completa
- Tipos distintos

**Recomendação**: Use sobrecarga para **métodos relacionados**, mantenha **comportamento similar**, evite **ambiguidade**, delegue para **versão mais completa**, prefira **varargs** a múltiplas sobrecargas, limite **quantidade de sobrecargas**.