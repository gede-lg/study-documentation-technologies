# Assinatura de Método

## 🎯 Introdução e Definição

**Assinatura de método** (method signature) é a **identificação única** de um método composta por **nome** + **lista de parâmetros** (tipos e ordem). A assinatura **identifica univocamente** o método, permitindo ao compilador distinguir entre métodos diferentes, especialmente na **sobrecarga** (overloading).

**Conceito central**: Assinatura é como a **impressão digital** do método - **identifica** de forma única. Dois métodos **não podem ter assinatura idêntica** na mesma classe. **Nome** + **parâmetros** (tipos e ordem) formam a assinatura; **tipo de retorno** e **modificadores NÃO fazem parte**.

**Analogia completa**:
- **Método**: Pessoa
- **Nome**: Nome da pessoa (João)
- **Parâmetros**: Sobrenome + CPF (Silva, 123.456.789-00)
- **Assinatura**: Nome completo + CPF (identificação única)
- **Tipo de retorno**: Altura da pessoa (não identifica)
- **Sobrecarga**: Duas pessoas com mesmo nome mas CPFs diferentes

**Composição da assinatura**:
```java
// ASSINATURA = nomeMetodo(tipoParam1, tipoParam2, ...)

public int calcular(int a, int b) {
//         ↑         ↑      ↑
//      Nome      Tipo1   Tipo2
//
// ASSINATURA: calcular(int, int)
//
// NÃO fazem parte da assinatura:
// - Tipo de retorno (int)
// - Modificador de acesso (public)
// - Nome dos parâmetros (a, b)
}
```

**Exemplos de assinaturas**:
```java
public class Exemplo {
    // Assinatura 1: metodo()
    public void metodo() { }
    
    // Assinatura 2: metodo(int)
    public void metodo(int x) { }
    
    // Assinatura 3: metodo(int, int)
    public void metodo(int x, int y) { }
    
    // Assinatura 4: metodo(String)
    public void metodo(String s) { }
    
    // Assinatura 5: metodo(int, String)
    public void metodo(int x, String s) { }
    
    // Assinatura 6: metodo(String, int)
    public void metodo(String s, int x) { }  // Ordem diferente!
    
    // ❌ ERRO - assinatura duplicada
    // public int metodo(int x, int y) { }
    // Assinatura metodo(int, int) JÁ existe
    // Tipo de retorno diferente NÃO muda assinatura
}
```

**Comparação visual**:
```
MÉTODO COMPLETO:
public static final int calcularTotal(int valor, double taxa) throws Exception

ASSINATURA (o que importa):
                    calcularTotal(int,        double)
                         ↑            ↑           ↑
                      Nome        Tipo1       Tipo2

NÃO fazem parte da assinatura:
public              ← Modificador de acesso
static              ← Modificador static
final               ← Modificador final
int                 ← Tipo de retorno
valor, taxa         ← Nomes dos parâmetros
throws Exception    ← Declaração de exceção
```

## 📋 Fundamentos Teóricos

### 1️⃣ Componentes da Assinatura

**Definição formal**:
```
ASSINATURA = nomeDoMetodo + listaOrdenadaDeTiposDeParametros
```

**Elementos que COMPÕEM a assinatura**:

**1. Nome do método**:
```java
public void processar() { }
//          ↑
//       NOME (faz parte)

// Assinatura: processar()
```

**2. Tipos dos parâmetros**:
```java
public void calcular(int x, double y, String z) { }
//                   ↑       ↑         ↑
//                  int    double    String (fazem parte)

// Assinatura: calcular(int, double, String)
```

**3. Ordem dos parâmetros**:
```java
public void metodo(int x, String s) { }
// Assinatura: metodo(int, String)

public void metodo(String s, int x) { }
// Assinatura: metodo(String, int) ← DIFERENTE (ordem)
```

**Elementos que NÃO COMPÕEM a assinatura**:

**1. Tipo de retorno**:
```java
public int calcular(int x) { }
// Assinatura: calcular(int)

public double calcular(int x) { }
// Assinatura: calcular(int) ← MESMA!
// ❌ ERRO: tipo de retorno NÃO diferencia
```

**2. Modificadores**:
```java
public void metodo() { }
// Assinatura: metodo()

private void metodo() { }
// Assinatura: metodo() ← MESMA!
// ❌ ERRO: modificador NÃO diferencia
```

**3. Nomes dos parâmetros**:
```java
public void calcular(int a, int b) { }
// Assinatura: calcular(int, int)

public void calcular(int x, int y) { }
// Assinatura: calcular(int, int) ← MESMA!
// ❌ ERRO: nome de parâmetro NÃO diferencia
```

**4. Exceções declaradas**:
```java
public void metodo() throws IOException { }
// Assinatura: metodo()

public void metodo() throws SQLException { }
// Assinatura: metodo() ← MESMA!
// ❌ ERRO: exceção NÃO diferencia
```

### 2️⃣ Assinatura e Sobrecarga

**Conceito**: Sobrecarga (overloading) permite **múltiplos métodos** com **mesmo nome** mas **assinaturas diferentes**.

**Sobrecarga válida** (assinaturas diferentes):
```java
public class Calculadora {
    // Assinatura 1: somar(int, int)
    public int somar(int a, int b) {
        return a + b;
    }
    
    // Assinatura 2: somar(int, int, int) ← QUANTIDADE diferente
    public int somar(int a, int b, int c) {
        return a + b + c;
    }
    
    // Assinatura 3: somar(double, double) ← TIPO diferente
    public double somar(double a, double b) {
        return a + b;
    }
    
    // Assinatura 4: somar(int, double) ← TIPO diferente
    public double somar(int a, double b) {
        return a + b;
    }
    
    // Assinatura 5: somar(double, int) ← ORDEM diferente
    public double somar(double a, int b) {
        return a + b;
    }
}

// Chamadas - compilador escolhe pela assinatura:
Calculadora calc = new Calculadora();
calc.somar(10, 20);        // Chama assinatura 1: somar(int, int)
calc.somar(10, 20, 30);    // Chama assinatura 2: somar(int, int, int)
calc.somar(10.5, 20.5);    // Chama assinatura 3: somar(double, double)
calc.somar(10, 20.5);      // Chama assinatura 4: somar(int, double)
calc.somar(10.5, 20);      // Chama assinatura 5: somar(double, int)
```

**Sobrecarga inválida** (assinaturas idênticas):
```java
public class Invalido {
    // Assinatura: metodo(int, int)
    public void metodo(int a, int b) { }
    
    // ❌ ERRO - assinatura IDÊNTICA: metodo(int, int)
    public int metodo(int x, int y) {
        return x + y;
    }
    // Erro de compilação: "metodo(int,int) is already defined"
    
    // ❌ ERRO - assinatura IDÊNTICA: metodo(int, int)
    public void metodo(int num1, int num2) { }
    // Nomes diferentes (num1, num2) NÃO mudam assinatura
    
    // ❌ ERRO - assinatura IDÊNTICA: metodo(int, int)
    private void metodo(int a, int b) { }
    // Modificador diferente (private) NÃO muda assinatura
}
```

### 3️⃣ Quantidade de Parâmetros

**Conceito**: **Número de parâmetros** diferencia assinaturas.

**Exemplos**:
```java
public class Produto {
    // Assinatura 1: criar() - ZERO parâmetros
    public Produto criar() {
        return new Produto();
    }
    
    // Assinatura 2: criar(String) - UM parâmetro
    public Produto criar(String nome) {
        Produto p = new Produto();
        p.setNome(nome);
        return p;
    }
    
    // Assinatura 3: criar(String, double) - DOIS parâmetros
    public Produto criar(String nome, double preco) {
        Produto p = new Produto();
        p.setNome(nome);
        p.setPreco(preco);
        return p;
    }
    
    // Assinatura 4: criar(String, double, int) - TRÊS parâmetros
    public Produto criar(String nome, double preco, int estoque) {
        Produto p = new Produto();
        p.setNome(nome);
        p.setPreco(preco);
        p.setEstoque(estoque);
        return p;
    }
}

// Uso:
Produto p1 = criar();                      // Assinatura 1
Produto p2 = criar("Mouse");               // Assinatura 2
Produto p3 = criar("Mouse", 50.0);         // Assinatura 3
Produto p4 = criar("Mouse", 50.0, 100);    // Assinatura 4
```

### 4️⃣ Tipo dos Parâmetros

**Conceito**: **Tipo de cada parâmetro** diferencia assinaturas.

**Tipos primitivos**:
```java
public class Exemplo {
    // Assinatura: processar(int)
    public void processar(int numero) { }
    
    // Assinatura: processar(double) ← TIPO diferente
    public void processar(double numero) { }
    
    // Assinatura: processar(long) ← TIPO diferente
    public void processar(long numero) { }
    
    // Assinatura: processar(boolean) ← TIPO diferente
    public void processar(boolean flag) { }
}

// Chamadas:
Exemplo ex = new Exemplo();
ex.processar(10);       // int
ex.processar(10.5);     // double
ex.processar(10L);      // long
ex.processar(true);     // boolean
```

**Tipos de referência**:
```java
public class Servico {
    // Assinatura: processar(String)
    public void processar(String texto) { }
    
    // Assinatura: processar(Produto) ← TIPO diferente
    public void processar(Produto produto) { }
    
    // Assinatura: processar(Cliente) ← TIPO diferente
    public void processar(Cliente cliente) { }
    
    // Assinatura: processar(List) ← TIPO diferente
    public void processar(List<String> lista) { }
}
```

**Arrays**:
```java
public class Utilitarios {
    // Assinatura: calcular(int)
    public int calcular(int numero) { }
    
    // Assinatura: calcular(int[]) ← Array é tipo DIFERENTE
    public int calcular(int[] numeros) { }
    
    // Assinatura: calcular(String[])
    public void calcular(String[] textos) { }
}
```

### 5️⃣ Ordem dos Parâmetros

**Conceito**: **Ordem dos tipos** diferencia assinaturas.

**Exemplo**:
```java
public class Registro {
    // Assinatura: registrar(String, int)
    public void registrar(String nome, int idade) {
        System.out.println("Nome: " + nome + ", Idade: " + idade);
    }
    
    // Assinatura: registrar(int, String) ← ORDEM diferente
    public void registrar(int idade, String nome) {
        System.out.println("Idade: " + idade + ", Nome: " + nome);
    }
}

// Uso:
Registro reg = new Registro();
reg.registrar("João", 30);   // Chama registrar(String, int)
reg.registrar(30, "João");   // Chama registrar(int, String)
```

**Ordem importa**:
```java
public class Pedido {
    // Assinatura: criar(Cliente, Produto)
    public Pedido criar(Cliente cliente, Produto produto) { }
    
    // Assinatura: criar(Produto, Cliente) ← ORDEM diferente (válido)
    public Pedido criar(Produto produto, Cliente cliente) { }
    
    // Uso:
    Cliente c = new Cliente();
    Produto p = new Produto();
    
    criar(c, p);  // Chama criar(Cliente, Produto)
    criar(p, c);  // Chama criar(Produto, Cliente)
}
```

**Cuidado com ambiguidade**:
```java
public class Ambiguo {
    // Assinatura: metodo(int, int)
    public void metodo(int a, int b) { }
    
    // Assinatura: metodo(int, int) ← MESMA assinatura
    // ❌ ERRO - ordem NÃO diferencia tipos iguais
    public void metodo(int b, int a) { }
    // Compilador: assinatura duplicada
}
```

### 6️⃣ Varargs e Assinatura

**Conceito**: Varargs (`tipo...`) é tratado como **array** na assinatura.

**Equivalência**:
```java
public class Exemplo {
    // Assinatura: metodo(int[])
    public void metodo(int[] numeros) { }
    
    // ❌ ERRO - Assinatura IDÊNTICA: metodo(int[])
    public void metodo(int... numeros) { }
    // varargs é array - assinatura duplicada
}
```

**Sobrecarga com varargs**:
```java
public class Calculadora {
    // Assinatura: somar(int, int)
    public int somar(int a, int b) {
        return a + b;
    }
    
    // Assinatura: somar(int[]) ← varargs
    public int somar(int... numeros) {
        int soma = 0;
        for (int n : numeros) {
            soma += n;
        }
        return soma;
    }
}

// Uso:
Calculadora calc = new Calculadora();
calc.somar(10, 20);           // Assinatura exata: somar(int, int)
calc.somar(10, 20, 30);       // Assinatura varargs: somar(int[])
calc.somar(10, 20, 30, 40);   // Assinatura varargs: somar(int[])
```

**Varargs com outros parâmetros**:
```java
public class Logger {
    // Assinatura: log(String, Object[])
    public void log(String nivel, Object... args) { }
    
    // Assinatura: log(String, String, Object[]) ← DIFERENTE
    public void log(String nivel, String mensagem, Object... args) { }
}
```

### 7️⃣ Generics e Assinatura

**Conceito**: **Type erasure** remove generics em tempo de compilação - assinatura **não inclui** tipos genéricos.

**Erasure**:
```java
public class Exemplo {
    // Após erasure: processar(List)
    public void processar(List<String> lista) { }
    
    // ❌ ERRO - Após erasure: processar(List) ← MESMA assinatura
    public void processar(List<Integer> lista) { }
    // Compilador remove <String> e <Integer>
    // Ambos viram apenas processar(List)
}
```

**Solução**:
```java
public class Correto {
    // Assinatura: processarStrings(List)
    public void processarStrings(List<String> lista) { }
    
    // Assinatura: processarInteiros(List) ← Nome diferente
    public void processarInteiros(List<Integer> lista) { }
    
    // Ou usar tipo adicional:
    // Assinatura: processar(List, String)
    public void processar(List<String> lista, String marcador) { }
    
    // Assinatura: processar(List, Integer) ← TIPO diferente
    public void processar(List<Integer> lista, Integer marcador) { }
}
```

### 8️⃣ Identificação pelo Compilador

**Conceito**: Compilador usa assinatura para **resolver chamadas**.

**Processo de resolução**:
```java
public class Produto {
    public void exibir() { }
    public void exibir(String formato) { }
    public void exibir(String formato, boolean detalhado) { }
}

Produto p = new Produto();

// Chamada: p.exibir();
// Compilador procura assinatura: exibir()
// Encontra e invoca

// Chamada: p.exibir("JSON");
// Compilador procura assinatura: exibir(String)
// Encontra e invoca

// Chamada: p.exibir("JSON", true);
// Compilador procura assinatura: exibir(String, boolean)
// Encontra e invoca

// Chamada: p.exibir(123);
// Compilador procura assinatura: exibir(int)
// ❌ NÃO ENCONTRA - Erro de compilação
```

**Conversão automática** (widening):
```java
public class Exemplo {
    public void metodo(double x) { }
}

Exemplo ex = new Exemplo();
ex.metodo(10);  // int → double (widening automático)
// Compilador converte int para double
```

**Ambiguidade**:
```java
public class Ambiguo {
    public void metodo(int x, double y) { }
    public void metodo(double x, int y) { }
}

Ambiguo amb = new Ambiguo();
amb.metodo(10, 20);  // ❌ ERRO: ambiguous method call
// (int, int) pode converter para:
// - (int, double) ou
// - (double, int)
// Compilador não sabe qual escolher
```

### 9️⃣ Assinatura em Herança

**Override** (sobrescrita) - assinatura **IDÊNTICA**:
```java
public class Animal {
    // Assinatura: emitirSom()
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    // Assinatura: emitirSom() ← MESMA (override)
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}
```

**Overload** (sobrecarga) - assinatura **DIFERENTE**:
```java
public class Animal {
    // Assinatura: emitirSom()
    public void emitirSom() { }
}

public class Cachorro extends Animal {
    // Assinatura: emitirSom() ← Override
    @Override
    public void emitirSom() { }
    
    // Assinatura: emitirSom(int) ← Overload (nova assinatura)
    public void emitirSom(int vezes) {
        for (int i = 0; i < vezes; i++) {
            emitirSom();
        }
    }
}
```

### 🔟 Documentação de Assinatura

**JavaDoc**:
```java
public class Calculadora {
    /**
     * Calcula soma de dois inteiros.
     * 
     * @param a Primeiro número
     * @param b Segundo número
     * @return Soma de a e b
     * 
     * Assinatura: somar(int, int)
     */
    public int somar(int a, int b) {
        return a + b;
    }
    
    /**
     * Calcula soma de três inteiros.
     * 
     * @param a Primeiro número
     * @param b Segundo número
     * @param c Terceiro número
     * @return Soma de a, b e c
     * 
     * Assinatura: somar(int, int, int)
     */
    public int somar(int a, int b, int c) {
        return a + b + c;
    }
}
```

## 🎯 Aplicabilidade

**1. Sobrecarga de métodos**
**2. Identificação única de métodos**
**3. Resolução de chamadas pelo compilador**
**4. Override de métodos em herança**
**5. Documentação e clareza de API**

## ⚠️ Armadilhas Comuns

**1. Achar que retorno diferencia**:
```java
public int metodo() { }
public double metodo() { }  // ❌ ERRO
```

**2. Confundir nome de parâmetro**:
```java
public void metodo(int a) { }
public void metodo(int b) { }  // ❌ ERRO
```

**3. Ignorar ordem de parâmetros**:
```java
metodo(int, String) ≠ metodo(String, int)
```

**4. Generics em sobrecarga**:
```java
void metodo(List<String> l) { }
void metodo(List<Integer> l) { }  // ❌ ERRO
```

**5. Varargs duplicando array**:
```java
void metodo(int[] arr) { }
void metodo(int... arr) { }  // ❌ ERRO
```

## ✅ Boas Práticas

**1. Nomes consistentes**:
```java
calcular(int x)
calcular(int x, int y)  // Mesmo nome, assinaturas diferentes
```

**2. Documentar sobrecargas**:
```java
/**
 * @param x Valor
 * Assinatura: calcular(int)
 */
public int calcular(int x) { }
```

**3. Evitar ambiguidade**:
```java
// Ruim (ambíguo):
void criar(int, double)
void criar(double, int)

// Bom (claro):
void criarPorIdadeESalario(int idade, double salario)
void criarPorSalarioEIdade(double salario, int idade)
```

**4. Ordem lógica**:
```java
void registrar(String nome, int idade)  // Nome antes
```

**5. Usar @Override**:
```java
@Override  // Garante mesma assinatura
public void metodo() { }
```

## 📚 Resumo Executivo

**Assinatura = nome + parâmetros**.

**Composição**:
```
nomeMetodo(tipo1, tipo2, ...)
```

**Fazem parte**:
- Nome do método
- Tipos dos parâmetros
- Ordem dos parâmetros
- Quantidade de parâmetros

**NÃO fazem parte**:
- Tipo de retorno
- Modificadores
- Nomes de parâmetros
- Exceções

**Exemplos**:
```java
metodo()              // Assinatura 1
metodo(int)           // Assinatura 2
metodo(int, String)   // Assinatura 3
metodo(String, int)   // Assinatura 4 (ordem!)
```

**Sobrecarga**:
```java
void metodo(int x) { }       // OK
void metodo(int x, int y) { } // OK
int metodo(int x) { }        // ❌ Duplicado
```

**Varargs**:
```java
void metodo(int[] arr) { }
void metodo(int... arr) { }  // ❌ Mesma assinatura
```

**Generics**:
```java
void metodo(List<String> l) { }
void metodo(List<Integer> l) { }  // ❌ Type erasure
```

**Recomendação**: **Entenda assinatura** para sobrecarga correta, **tipo de retorno não diferencia**, **ordem de parâmetros importa**, use **@Override** para garantir assinatura idêntica em herança.