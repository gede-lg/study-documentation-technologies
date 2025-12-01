# Atribuição Simples (=)

## 🎯 Introdução e Definição

### Definição Conceitual

O **operador de atribuição simples (`=`)** é o operador fundamental que **atribui um valor a uma variável**. Ele copia o valor da expressão do lado direito para a variável do lado esquerdo.

**Sintaxe**:
```java
variavel = expressao;
```

**Características principais**:
- ✅ **Lado esquerdo**: Variável (lvalue - local value)
- ✅ **Lado direito**: Expressão que produz valor (rvalue - read value)
- ✅ **Direção**: Direita → Esquerda (valor flui da direita para esquerda)
- ✅ **Retorno**: Operação de atribuição retorna o valor atribuído
- ⚠️ **Não é comparação**: `=` atribui, `==` compara

**Exemplo**:
```java
int idade = 25;           // Atribui 25 à variável idade
double preco = 19.99;     // Atribui 19.99 à variável preco
String nome = "João";     // Atribui "João" à variável nome
boolean ativo = true;     // Atribui true à variável ativo

// Atribuição com expressão
int soma = 10 + 20;       // Atribui 30 (resultado de 10 + 20)
int x = 5;
int y = x * 2;            // Atribui 10 (valor de x multiplicado por 2)
```

### Características Fundamentais

- 🔄 **Reatribuição**: Variáveis podem receber novos valores
- 📋 **Tipo compatível**: Valor deve ser compatível com o tipo da variável
- 🔀 **Conversões automáticas**: Widening ocorre automaticamente
- ⚠️ **Narrowing requer cast**: Conversões que perdem dados precisam casting explícito
- 💾 **Copia valor** (primitivos) ou **copia referência** (objetos)

---

## 📋 Sumário Conceitual

### Sintaxe e Operação

```java
tipo variavel = valor;
```

**Fluxo de execução**:
1. **Avalia** a expressão do lado direito
2. **Converte** (se necessário) para o tipo da variável
3. **Armazena** o resultado na variável

**Exemplos**:
```java
int x = 10;          // Declara e atribui
x = 20;              // Reatribui novo valor
x = x + 5;           // Usa valor atual (20) e atribui novo (25)
```

---

## 🧠 Fundamentos Teóricos

### 1. Atribuição em Declaração

**Declaração com inicialização**:
```java
int idade = 30;
double salario = 5000.50;
char letra = 'A';
boolean aprovado = true;
String nome = "Maria";
```

**Declaração sem inicialização** (depois atribui):
```java
int quantidade;      // Declarada mas não inicializada
quantidade = 100;    // Atribuição posterior

// ⚠️ Variável local DEVE ser inicializada antes do uso
int valor;
// System.out.println(valor);  // ❌ Erro: variable might not have been initialized
```

### 2. Reatribuição

**Variável pode receber novos valores**:
```java
int contador = 0;
System.out.println(contador);  // 0

contador = 5;
System.out.println(contador);  // 5

contador = 10;
System.out.println(contador);  // 10

contador = contador + 1;       // Usa valor atual (10) e atribui 11
System.out.println(contador);  // 11
```

### 3. Atribuição com Expressões

**Lado direito pode ser qualquer expressão válida**:
```java
int a = 10;
int b = 20;

// Expressões aritméticas
int soma = a + b;           // 30
int multiplicacao = a * 3;  // 30
int divisao = b / 2;        // 10

// Expressões lógicas
boolean maior = a > 5;      // true
boolean igual = a == b;     // false

// Chamadas de método
String texto = "Java".toUpperCase();  // "JAVA"
int tamanho = texto.length();         // 4

// Operador ternário
int max = (a > b) ? a : b;  // 20
```

### 4. Compatibilidade de Tipos

**Tipo da variável e do valor devem ser compatíveis**:
```java
// ✅ Compatíveis
int numero = 100;
double decimal = 3.14;
char caractere = 'X';
boolean flag = false;
String texto = "Olá";

// ❌ Incompatíveis
// int x = "texto";       // Erro: String não é compatível com int
// double y = true;       // Erro: boolean não é compatível com double
// String z = 123;        // Erro: int não é compatível com String
```

### 5. Conversões Automáticas (Widening)

**Conversão de tipo menor para maior** (sem perda de dados):
```java
// byte → short → int → long → float → double

byte b = 10;
short s = b;     // byte → short (automático)
int i = s;       // short → int (automático)
long l = i;      // int → long (automático)
float f = l;     // long → float (automático)
double d = f;    // float → double (automático)

// Exemplo prático
int idade = 25;
double idadeDouble = idade;  // 25.0 (automático)
System.out.println(idadeDouble);
```

**Tabela de conversões automáticas**:
```
byte   → short, int, long, float, double
short  → int, long, float, double
char   → int, long, float, double
int    → long, float, double
long   → float, double
float  → double
```

### 6. Conversões Explícitas (Narrowing/Casting)

**Conversão de tipo maior para menor** (pode perder dados):
```java
// Requer casting explícito
double d = 3.14;
int i = (int) d;      // 3 (perde decimais)

long l = 1000L;
int x = (int) l;      // 1000 (OK se cabe em int)

int grande = 200;
byte pequeno = (byte) grande;  // -56 (overflow! 200 > 127)

// Sem casting: erro de compilação
// int y = 3.14;      // ❌ Erro: incompatible types: possible lossy conversion
```

### 7. Atribuição de Literais

**Literais podem ser atribuídos diretamente**:
```java
// Literais inteiros
int decimal = 100;
int hexadecimal = 0x64;      // 100 em hex
int binario = 0b1100100;     // 100 em binário
int octal = 0144;            // 100 em octal

// Literais de ponto flutuante
double d1 = 3.14;
double d2 = 314e-2;          // 3.14 em notação científica
float f = 2.5f;              // Sufixo 'f' obrigatório

// Literais de caractere
char letra = 'A';
char unicode = '\u0041';     // 'A' em Unicode

// Literais booleanos
boolean verdadeiro = true;
boolean falso = false;

// Literais de String
String texto = "Olá, Mundo!";
String vazia = "";
```

### 8. Atribuição com Autoboxing/Unboxing

**Conversão automática entre primitivos e wrappers**:
```java
// Autoboxing: primitivo → wrapper
Integer num = 10;           // int → Integer (automático)
Double valor = 3.14;        // double → Double (automático)

// Unboxing: wrapper → primitivo
int x = num;                // Integer → int (automático)
double y = valor;           // Double → double (automático)

// Em atribuições
List<Integer> lista = new ArrayList<>();
lista.add(5);               // Autoboxing: int → Integer
int primeiro = lista.get(0);// Unboxing: Integer → int
```

### 9. Atribuição de Referências (Objetos)

**Atribuição copia a REFERÊNCIA, não o objeto**:
```java
// Primitivos: copia VALOR
int a = 10;
int b = a;      // b recebe cópia do valor 10
a = 20;         // Mudar 'a' não afeta 'b'
System.out.println(b);  // 10 (não mudou)

// Objetos: copia REFERÊNCIA
StringBuilder sb1 = new StringBuilder("Java");
StringBuilder sb2 = sb1;  // sb2 aponta para o MESMO objeto que sb1
sb1.append(" 17");        // Modifica o objeto
System.out.println(sb2);  // "Java 17" (ambos apontam pro mesmo objeto!)

// Strings são imutáveis (exceção)
String s1 = "Olá";
String s2 = s1;   // s2 aponta para o mesmo objeto
s1 = "Tchau";     // s1 aponta para NOVO objeto (imutabilidade)
System.out.println(s2);  // "Olá" (s2 ainda aponta para objeto original)
```

### 10. Atribuição e Escopo

**Variável deve estar no escopo**:
```java
public class Escopo {
    // Atributo de instância
    private int global = 10;
    
    public void metodo() {
        // Variável local
        int local = 20;
        
        // Atribuição válida
        global = 30;  // ✅ Atributo acessível
        local = 40;   // ✅ Variável local acessível
        
        if (true) {
            int blocoIf = 50;
            blocoIf = 60;  // ✅ Dentro do bloco
        }
        
        // blocoIf = 70;  // ❌ Erro: fora do escopo
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Atribuição vs Comparação

**Erro comum**: Confundir `=` (atribuição) com `==` (comparação).

```java
int x = 10;  // ✅ Atribuição

if (x = 20) {  // ❌ Erro! Atribuição retorna int, não boolean
    System.out.println("...");
}

if (x == 20) {  // ✅ Correto: comparação
    System.out.println("x é 20");
}

// Em C/C++, atribuição em if funciona (perigoso!)
// Java previne isso exigindo boolean em if
```

### Atribuição Retorna Valor

**Operação de atribuição retorna o valor atribuído**:
```java
int a, b, c;

// Atribuição em cascata
c = (b = (a = 10));
// Execução:
// 1. a = 10  → retorna 10
// 2. b = 10  → retorna 10
// 3. c = 10  → retorna 10

System.out.println(a + ", " + b + ", " + c);  // 10, 10, 10

// Uso em expressão
int x = 5;
int y = (x = 10) + 5;  // x recebe 10, depois soma 5
System.out.println(x);  // 10
System.out.println(y);  // 15
```

### Precedência de Atribuição

**Atribuição tem baixa precedência** (avalia expressão à direita primeiro):
```java
int x = 10 + 20;
// Ordem:
// 1. Avalia 10 + 20 → 30
// 2. Atribui 30 a x

int y = 5 * 2 + 3;
// Ordem:
// 1. 5 * 2 → 10
// 2. 10 + 3 → 13
// 3. Atribui 13 a y

// Parênteses alteram precedência
int z = (x = 10) + 5;
// 1. x = 10 → retorna 10
// 2. 10 + 5 → 15
// 3. Atribui 15 a z
```

### Variáveis Final

**final impede reatribuição**:
```java
final int CONSTANTE = 100;
// CONSTANTE = 200;  // ❌ Erro: cannot assign a value to final variable

// Blank final: inicializada apenas uma vez
final int valor;
valor = 50;  // ✅ Primeira atribuição
// valor = 60;  // ❌ Erro: já foi atribuída

// final em objetos: referência é final, objeto é mutável
final StringBuilder sb = new StringBuilder("Java");
sb.append(" 17");  // ✅ Modifica objeto (OK)
// sb = new StringBuilder();  // ❌ Erro: não pode mudar referência
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Inicialização de Variáveis

```java
public class Inicializacao {
    public void exemplo() {
        // Declaração + inicialização
        int idade = 25;
        double altura = 1.75;
        String nome = "Ana";
        
        // Uso imediato
        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);
        System.out.println("Altura: " + altura);
    }
}
```

### Caso 2: Acumulação de Valores

```java
public class Acumulacao {
    public void calcularSoma() {
        int soma = 0;  // Inicializa acumulador
        
        soma = soma + 10;  // soma recebe soma + 10
        soma = soma + 20;
        soma = soma + 30;
        
        System.out.println("Soma: " + soma);  // 60
    }
}
```

### Caso 3: Troca de Valores (Swap)

```java
public class TrocaValores {
    public void trocar() {
        int a = 10;
        int b = 20;
        
        System.out.println("Antes: a=" + a + ", b=" + b);
        
        // Troca usando variável temporária
        int temp = a;
        a = b;
        b = temp;
        
        System.out.println("Depois: a=" + a + ", b=" + b);
        // Depois: a=20, b=10
    }
}
```

### Caso 4: Cálculos Complexos

```java
public class Calculos {
    public void calcularMedia() {
        int nota1 = 8;
        int nota2 = 7;
        int nota3 = 9;
        
        // Atribuição com expressão complexa
        double media = (nota1 + nota2 + nota3) / 3.0;
        
        System.out.println("Média: " + media);  // 8.0
    }
}
```

### Caso 5: Conversão de Tipos

```java
public class Conversao {
    public void converter() {
        // Widening (automático)
        int inteiro = 100;
        double decimal = inteiro;  // 100.0
        
        // Narrowing (manual)
        double pi = 3.14159;
        int piInteiro = (int) pi;  // 3 (perde decimais)
        
        System.out.println("Decimal: " + decimal);
        System.out.println("Pi inteiro: " + piInteiro);
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Variável Não Inicializada

**Problema**: Variáveis locais devem ser inicializadas.
```java
int x;
// System.out.println(x);  // ❌ Erro: variable might not have been initialized

// Solução: inicializar
int y = 0;
System.out.println(y);  // ✅ OK
```

### 2. Incompatibilidade de Tipos

**Problema**: Tipos incompatíveis.
```java
// String s = 123;  // ❌ Erro: incompatible types
// int x = "texto"; // ❌ Erro: incompatible types

// Solução: conversão explícita
String s = String.valueOf(123);  // ✅ "123"
int x = Integer.parseInt("456"); // ✅ 456
```

### 3. Perda de Dados em Narrowing

**Problema**: Overflow em conversão.
```java
int grande = 300;
byte pequeno = (byte) grande;  // -56 ⚠️ (overflow)

// Solução: verificar limites
if (grande >= Byte.MIN_VALUE && grande <= Byte.MAX_VALUE) {
    byte seguro = (byte) grande;
} else {
    System.out.println("Valor fora do range de byte");
}
```

### 4. Confusão entre = e ==

**Problema**: Usar `=` ao invés de `==`.
```java
int x = 10;

// if (x = 20) { }  // ❌ Erro: incompatible types (atribuição retorna int)

if (x == 20) {  // ✅ Correto: comparação
    System.out.println("x é 20");
}
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Declaração de Variáveis**: Atribuição ocorre na inicialização
- **Tipos de Dados**: Compatibilidade entre variável e valor
- **Conversão de Tipos**: Widening/narrowing em atribuições
- **Autoboxing/Unboxing**: Conversão automática primitivo ↔ wrapper
- **Operadores Compostos**: `+=`, `-=`, etc. são baseados em `=`
- **Expressões**: Lado direito pode ser qualquer expressão válida

---

## 🚀 Boas Práticas

1. ✅ **Inicialize variáveis ao declarar (quando possível)**
   ```java
   int contador = 0;  // ✅ Declaração + inicialização
   ```

2. ✅ **Use nomes descritivos para variáveis**
   ```java
   int idade = 25;           // ✅ Descritivo
   // int i = 25;            // ❌ Não descritivo
   ```

3. ✅ **Não confunda atribuição (=) com comparação (==)**
   ```java
   if (x == 10) { }  // ✅ Comparação
   // if (x = 10) { }  // ❌ Atribuição (erro em Java)
   ```

4. ✅ **Verifique limites antes de narrowing**
   ```java
   int valor = 1000;
   if (valor <= Byte.MAX_VALUE && valor >= Byte.MIN_VALUE) {
       byte b = (byte) valor;
   }
   ```

5. ✅ **Use final para constantes**
   ```java
   final int MAX_TENTATIVAS = 3;
   ```

6. ✅ **Evite atribuições em condições**
   ```java
   // ❌ Evitar (permitido em algumas linguagens, não em Java)
   // if (x = getValor()) { }
   
   // ✅ Preferir
   x = getValor();
   if (x != 0) { }
   ```

7. ✅ **Inicialize objetos com valores significativos**
   ```java
   String nome = "";          // ✅ String vazia ao invés de null
   List<String> lista = new ArrayList<>();  // ✅ Lista vazia
   ```

8. ✅ **Documente conversões que perdem dados**
   ```java
   double preco = 19.99;
   int precoInteiro = (int) preco;  // Perde centavos (19)
   ```
