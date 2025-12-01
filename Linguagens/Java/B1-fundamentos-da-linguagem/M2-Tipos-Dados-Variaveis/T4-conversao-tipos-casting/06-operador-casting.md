# Operador de Casting

## 🎯 Introdução e Definição

### Definição Conceitual

O **operador de casting** `(tipo)` é uma **construção sintática unária** em Java que força a conversão explícita de um valor ou expressão para um tipo de dado específico. Este operador:
- **Antecede** o valor ou expressão a ser convertido
- **Especifica** o tipo destino entre parênteses
- **Assume precedência** alta na avaliação de expressões
- **Não valida** se a conversão é segura (responsabilidade do programador)

**Sintaxe**:
```java
(tipo_destino) expressão
```

**Exemplos Básicos**:
```java
int i = (int) 123.456;        // double → int
byte b = (byte) 200;          // int → byte
char c = (char) 65;           // int → char
float f = (float) 10.5;       // double → float (literal)
```

### Características Fundamentais

**Operador de Casting**:
- 📍 **Unário**: Opera sobre um único operando
- ⚙️ **Prefixo**: Posicionado antes da expressão
- 🎯 **Alta Precedência**: Avaliado antes de operadores aritméticos
- 🔒 **Compile-time**: Verificado em tempo de compilação
- ⚠️ **Unsafe**: Não verifica overflow/underflow em runtime

### Contexto Histórico

**Herança de C**: Java herdou a sintaxe de casting de C/C++, mas com diferenças:
- **Type-safe**: Java verifica compatibilidade em compile-time
- **Sem cast de boolean**: `boolean` não pode ser convertido para numérico
- **Sem ponteiros**: Não existe cast de ponteiros como em C

**Filosofia Java**: Casting explícito força o programador a **reconhecer e assumir** o risco de perda de dados.

---

## 📋 Sumário Conceitual

### Sintaxe Geral

```java
tipo_destino variavel = (tipo_destino) valor_origem;
```

### Uso em Contextos

1. **Atribuição**: Converter valor antes de atribuir
2. **Expressões**: Forçar tipo em operações
3. **Parâmetros**: Ajustar tipo em chamadas de método
4. **Arrays**: Converter elementos de arrays
5. **Retorno**: Ajustar tipo de retorno de método

---

## 🧠 Fundamentos Teóricos

### 1. Sintaxe Básica

**Formato Padrão**:
```java
(tipo) expressão
```

**Exemplos**:
```java
// Casting de literal
int i = (int) 123.456;

// Casting de variável
double d = 99.99;
int i2 = (int) d;

// Casting de expressão
int resultado = (int) (10.5 + 20.7);

// Casting em atribuição
byte b = (byte) (100 + 50);
```

### 2. Precedência do Operador

**Alta Precedência**: Casting é avaliado **antes** de operadores aritméticos.

**Tabela de Precedência** (parte relevante):
```
1. Parênteses de agrupamento: ()
2. Operadores unários: ++, --, +, -, !, ~, (tipo)
3. Multiplicativos: *, /, %
4. Aditivos: +, -
```

**Exemplos**:

**Cast antes de aritmética**:
```java
int a = 10;
int b = 3;

// (double) a: cast de 'a', depois divisão
double resultado1 = (double) a / b;  // 10.0 / 3 = 3.333...

// (double) (a / b): divisão inteira, depois cast
double resultado2 = (double) (a / b);  // (double) 3 = 3.0
```

**Cast em expressões complexas**:
```java
int x = 5;
int y = 2;

// Cast de x, depois multiplicação
double r1 = (double) x * y;  // 5.0 * 2 = 10.0

// Multiplicação, depois cast
double r2 = (double) (x * y);  // (double) 10 = 10.0
```

### 3. Cast de Expressões vs Variáveis

**Cast de Variável**:
```java
int i = 100;
byte b = (byte) i;  // Cast direto de variável
```

**Cast de Expressão** (requer parênteses extras):
```java
int a = 50;
int b = 70;
byte resultado = (byte) (a + b);  // ✅ OK: cast da expressão inteira

// ⚠️ Sem parênteses:
byte resultado2 = (byte) a + b;  // ❌ ERRO: (byte)a + b = byte + int = int
```

**Explicação**:
- `(byte) (a + b)`: Soma primeiro (120), depois cast para byte
- `(byte) a + b`: Cast de `a` para byte (50), soma com `b` (int), resultado é `int`

### 4. Cast Múltiplo (Encadeado)

**Conceito**: Aplicar múltiplos casts sequencialmente.

**Sintaxe**:
```java
tipo3 var = (tipo3)(tipo2)(tipo1) valor;
```

**Exemplo**:
```java
double d = 123.456;
byte b = (byte)(int) d;  // double → int → byte

// Equivalente a:
int temp = (int) d;      // 123
byte b2 = (byte) temp;   // 123
```

**Quando Usar**: Raramente necessário, pode indicar design problem.

### 5. Cast em Diferentes Tipos

**Primitivos Numéricos**:
```java
// Inteiros
int i = (int) 123L;
short s = (short) 456;
byte b = (byte) 789;

// Ponto flutuante
float f = (float) 123.456;
double d = (double) 123.456f;

// Misto
int i2 = (int) 123.456;
float f2 = (float) 100;
```

**char**:
```java
// int → char
char c = (char) 65;  // 'A'

// char → int (automático, mas pode usar cast)
int codigo = (int) 'A';  // 65

// char em expressões
char letra = 'A';
char proxima = (char) (letra + 1);  // 'B' (cast obrigatório!)
```

**boolean** (IMPOSSÍVEL):
```java
// ❌ ERRO: incompatible types
int i = (int) true;

// Solução: ternário
int i2 = true ? 1 : 0;  // ✅ OK
```

---

## 🔍 Análise Conceitual Profunda

### Tabela de Precedência Detalhada

| Precedência | Operador                  | Associatividade | Exemplo             |
|-------------|---------------------------|-----------------|---------------------|
| 1           | `()`                      | Esquerda        | `(a + b)`           |
| 2           | `++`, `--` (pós)          | Esquerda        | `a++`               |
| 3           | `++`, `--` (pré)          | Direita         | `++a`               |
| 3           | `+`, `-` (unários)        | Direita         | `-a`                |
| 3           | `!`, `~`                  | Direita         | `!flag`             |
| 3           | **(tipo)** (cast)         | Direita         | `(int) d`           |
| 4           | `*`, `/`, `%`             | Esquerda        | `a * b`             |
| 5           | `+`, `-` (binários)       | Esquerda        | `a + b`             |
| 6           | `<<`, `>>`, `>>>`         | Esquerda        | `a << 2`            |
| 7           | `<`, `<=`, `>`, `>=`      | Esquerda        | `a < b`             |
| 8           | `==`, `!=`                | Esquerda        | `a == b`            |
| ...         | ...                       | ...             | ...                 |

**Implicações**:
- Cast avaliado **antes** de `*`, `/`, `%`
- Cast avaliado **antes** de `+`, `-`
- Cast avaliado **após** `()` de agrupamento
- Cast avaliado **junto com** outros unários (`-`, `!`, etc.)

### Exemplos de Precedência

**Exemplo 1**: Cast antes de multiplicação
```java
int a = 10;
int b = 3;

// (double) a é avaliado primeiro, depois * b
double r1 = (double) a * b;  // 10.0 * 3 = 30.0

// Multiplicação primeiro, depois cast
double r2 = (double) (a * b);  // (double) 30 = 30.0
```

**Exemplo 2**: Cast antes de adição
```java
int x = 5;
int y = 2;

// (double) x primeiro, depois + y
double r1 = (double) x + y;  // 5.0 + 2 = 7.0

// Adição primeiro, depois cast
double r2 = (double) (x + y);  // (double) 7 = 7.0
```

**Exemplo 3**: Cast e unários
```java
int a = 10;

// Cast primeiro, depois negação
int r1 = -(int) 10.5;  // -(10) = -10

// Negação primeiro (de double), depois cast
int r2 = (int) -10.5;  // (int) -10.5 = -10

// Ambos resultam igual neste caso, mas ordem importa em outros cenários
```

**Exemplo 4**: Cast em expressões complexas
```java
int a = 10;
int b = 3;
int c = 2;

// (double) a, depois * b, depois / c
double r1 = (double) a * b / c;  // 10.0 * 3 / 2 = 15.0

// a * b, depois cast, depois / c
double r2 = (double) (a * b) / c;  // 30.0 / 2 = 15.0

// a * b / c (inteiro), depois cast
double r3 = (double) (a * b / c);  // (double) 15 = 15.0
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Cast em Atribuições

```java
public class CastAtribuicao {
    public void exemplo() {
        // Widening (cast opcional)
        byte b = 10;
        int i = (int) b;  // OK, mas desnecessário
        
        // Narrowing (cast obrigatório)
        int i2 = 100;
        byte b2 = (byte) i2;  // ✅ Necessário
        
        // Ponto flutuante → inteiro
        double d = 123.456;
        int i3 = (int) d;  // ✅ Trunca para 123
        
        // Inteiro → char
        int codigo = 65;
        char c = (char) codigo;  // ✅ 'A'
    }
}
```

### Caso 2: Cast em Expressões Aritméticas

```java
public class CastExpressoes {
    public double calcularMedia(int soma, int quantidade) {
        // ✅ Cast para evitar divisão inteira
        return (double) soma / quantidade;
    }
    
    public void exemplo() {
        int a = 10;
        int b = 3;
        
        // Divisão inteira
        int div1 = a / b;  // 3
        
        // Divisão com precisão (cast de um operando)
        double div2 = (double) a / b;  // 3.333...
        
        // Divisão com precisão (cast da expressão)
        double div3 = (double) (a / b);  // 3.0 (divisão inteira primeiro!)
        
        System.out.println("div1: " + div1);  // 3
        System.out.println("div2: " + div2);  // 3.333333333333333
        System.out.println("div3: " + div3);  // 3.0
    }
}
```

### Caso 3: Cast em Parâmetros de Métodos

```java
public class CastParametros {
    public void processar(byte valor) {
        System.out.println("Processando byte: " + valor);
    }
    
    public void exemplo() {
        int i = 100;
        
        // ❌ Sem cast: ERRO
        // processar(i);
        
        // ✅ Com cast
        processar((byte) i);
    }
}
```

### Caso 4: Cast para Controlar Tipo de Retorno

```java
public class CastRetorno {
    public int obterParteInteira(double valor) {
        return (int) valor;  // Cast para int
    }
    
    public byte obterByte(int valor) {
        if (valor < Byte.MIN_VALUE || valor > Byte.MAX_VALUE) {
            throw new IllegalArgumentException("Overflow!");
        }
        return (byte) valor;  // Cast seguro após validação
    }
    
    public char obterChar(int codigoUnicode) {
        if (codigoUnicode < 0 || codigoUnicode > 65535) {
            throw new IllegalArgumentException("Código Unicode inválido!");
        }
        return (char) codigoUnicode;  // Cast validado
    }
}
```

### Caso 5: Cast em Operações com Literais

```java
public class CastLiterais {
    public void exemplo() {
        // Literais numéricos são int por padrão
        
        // ❌ Sem cast: ERRO (literal int para byte)
        // byte b1 = 1000;  // Erro: possível perda de dados
        
        // ✅ Com cast (assumindo risco de overflow)
        byte b1 = (byte) 1000;  // -24 (overflow!)
        
        // Literais double
        float f1 = (float) 123.456;  // Cast de literal double
        float f2 = 123.456f;         // OU sufixo f (preferível)
        
        // Literais long
        int i1 = (int) 1234567890123L;  // Cast de long para int
    }
}
```

### Caso 6: Cast em Comparações

```java
public class CastComparacoes {
    public void exemplo() {
        double d = 123.456;
        int i = 123;
        
        // Comparação com cast
        if ((int) d == i) {  // Trunca d para 123
            System.out.println("Partes inteiras iguais");
        }
        
        // ⚠️ Diferente de:
        if (d == i) {  // Compara 123.456 com 123.0 (i promovido para double)
            System.out.println("Valores iguais");
        }
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Cast Não Valida Overflow

**Problema**: Compilador aceita cast, mas não verifica se valor cabe.

```java
int grande = 300;
byte pequeno = (byte) grande;  // ✅ Compila, mas overflow: 44
```

**Solução**: Validar manualmente antes do cast.

```java
if (grande >= Byte.MIN_VALUE && grande <= Byte.MAX_VALUE) {
    byte pequeno = (byte) grande;
} else {
    throw new IllegalArgumentException("Overflow!");
}
```

### 2. Precedência Pode Causar Erros

**Problema**: Cast tem alta precedência, pode não afetar expressão inteira.

```java
int a = 50;
int b = 70;

// ❌ ERRO: (byte)a é byte, mas (byte)a + b é int
byte resultado = (byte) a + b;  // ERRO DE COMPILAÇÃO

// ✅ OK: Cast de toda a expressão
byte resultado = (byte) (a + b);
```

### 3. Cast Múltiplo É Raramente Necessário

**Problema**: Cast encadeado pode indicar design problem.

```java
// ⚠️ Code smell
byte b = (byte)(short)(int)(long) valor;

// ✅ Geralmente basta um cast
byte b = (byte) valor;
```

### 4. Cast Não Arredonda

**Problema**: Conversão float/double → int trunca, não arredonda.

```java
double d = 123.99;
int i = (int) d;  // 123 (não 124!)
```

**Solução**: Usar `Math.round()`.

```java
int arredondado = (int) Math.round(d);  // 124
```

### 5. boolean Não Pode Ser Convertido

**Problema**: Cast de boolean para numérico é ilegal.

```java
boolean flag = true;
int i = (int) flag;  // ❌ ERRO DE COMPILAÇÃO
```

**Solução**: Usar ternário.

```java
int i = flag ? 1 : 0;  // ✅ OK
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Tipos Primitivos**: Base para conversões
- **Conversão Explícita (Narrowing)**: Contexto de uso
- **Precedência de Operadores**: Ordem de avaliação
- **Overflow**: Risco em narrowing
- **Expressões**: Contexto de aplicação

---

## 🚀 Boas Práticas

1. ✅ **Use parênteses para clareza**
   ```java
   byte b = (byte) (a + b);  // ✅ Claro
   ```

2. ✅ **Evite cast desnecessário**
   ```java
   // ❌ Redundante
   long l = (long) 100;
   
   // ✅ Sufixo L (preferível)
   long l = 100L;
   ```

3. ✅ **Valide antes de narrowing**
   ```java
   if (valor >= Byte.MIN_VALUE && valor <= Byte.MAX_VALUE) {
       byte b = (byte) valor;
   }
   ```

4. ✅ **Use Math.round() para arredondar**
   ```java
   int arredondado = (int) Math.round(doubleValue);
   ```

5. ✅ **Documente casts não óbvios**
   ```java
   // Cast necessário para evitar divisão inteira
   double media = (double) soma / quantidade;
   ```

6. ❌ **Evite casts encadeados**
   ```java
   // ❌ Confuso
   byte b = (byte)(short)(int) valor;
   
   // ✅ Direto
   byte b = (byte) valor;
   ```

7. ✅ **Prefira sufixos para literais**
   ```java
   // ❌ Cast de literal
   float f = (float) 123.456;
   long l = (long) 1000;
   
   // ✅ Sufixos (mais legível)
   float f = 123.456f;
   long l = 1000L;
   ```

8. ✅ **Use cast para forçar precisão em divisões**
   ```java
   // ✅ Cast de um operando é suficiente
   double resultado = (double) a / b;
   ```

9. ❌ **Evite cast em comparações quando possível**
   ```java
   // ❌ Cast desnecessário
   if ((int) a == (int) b) { ... }
   
   // ✅ Promoção automática
   if (a == b) { ... }
   ```
