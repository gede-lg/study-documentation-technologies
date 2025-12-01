# Atribuições Compostas (+=, -=, *=, /=, %=)

## 🎯 Introdução e Definição

### Definição Conceitual

Os **operadores de atribuição compostos** (ou **atribuições combinadas**) são atalhos que **combinam uma operação aritmética com atribuição**. Eles aplicam um operador binário e atribuem o resultado de volta à variável.

**Operadores disponíveis**:
```java
+=   // Adição e atribuição
-=   // Subtração e atribuição
*=   // Multiplicação e atribuição
/=   // Divisão e atribuição
%=   // Módulo e atribuição
```

**Sintaxe geral**:
```java
variavel op= expressao;
// Equivale a:
variavel = (tipo) (variavel op expressao);
```

**Características principais**:
- ✅ **Forma abreviada**: `x += 5` ao invés de `x = x + 5`
- ✅ **Casting implícito**: Converte automaticamente o resultado
- ✅ **Mais eficiente**: Avalia variável apenas uma vez
- ✅ **Código mais legível**: Expressa intenção claramente
- ⚠️ **Comportamento diferente**: Inclui cast automático (veja seção de análise)

**Exemplos básicos**:
```java
int x = 10;
x += 5;    // x = x + 5;   → x = 15
x -= 3;    // x = x - 3;   → x = 12
x *= 2;    // x = x * 2;   → x = 24
x /= 4;    // x = x / 4;   → x = 6
x %= 4;    // x = x % 4;   → x = 2
```

### Características Fundamentais

- 🔄 **Operação in-place**: Modifica a própria variável
- 📋 **Casting automático**: Inclui conversão de tipo implícita
- ⚡ **Avaliação única**: Expressão à esquerda avaliada apenas uma vez
- 🎯 **Precedência baixa**: Similar à atribuição simples
- 💡 **Legibilidade**: Código mais conciso e expressivo

---

## 📋 Sumário Conceitual

### Operadores de Atribuição Composta

| Operador | Operação | Exemplo | Equivalente |
|----------|----------|---------|-------------|
| `+=` | Adição | `x += 5` | `x = x + 5` |
| `-=` | Subtração | `x -= 3` | `x = x - 3` |
| `*=` | Multiplicação | `x *= 2` | `x = x * 2` |
| `/=` | Divisão | `x /= 4` | `x = x / 4` |
| `%=` | Módulo | `x %= 3` | `x = x % 3` |

**Nota importante**: A equivalência não é exata! Há diferença no casting (veja Análise Conceitual Profunda).

---

## 🧠 Fundamentos Teóricos

### 1. Operador += (Adição)

**Adiciona valor à variável**:
```java
int x = 10;
x += 5;              // x = x + 5
System.out.println(x);  // 15

double preco = 100.0;
preco += 20.5;       // preco = preco + 20.5
System.out.println(preco);  // 120.5

// Com expressão
int a = 5, b = 3;
a += b * 2;          // a = a + (b * 2) = 5 + 6 = 11
System.out.println(a);  // 11
```

**Concatenação de Strings com +=**:
```java
String texto = "Olá";
texto += " Mundo";      // texto = texto + " Mundo"
System.out.println(texto);  // "Olá Mundo"

String nome = "João";
nome += " Silva";
nome += " Santos";
System.out.println(nome);  // "João Silva Santos"
```

### 2. Operador -= (Subtração)

**Subtrai valor da variável**:
```java
int saldo = 1000;
saldo -= 250;           // saldo = saldo - 250
System.out.println(saldo);  // 750

double temperatura = 25.5;
temperatura -= 3.2;     // temperatura = temperatura - 3.2
System.out.println(temperatura);  // 22.3

// Contador regressivo
int contador = 10;
contador -= 1;          // 9
contador -= 2;          // 7
contador -= 3;          // 4
System.out.println(contador);  // 4
```

### 3. Operador *= (Multiplicação)

**Multiplica variável por valor**:
```java
int numero = 5;
numero *= 3;            // numero = numero * 3
System.out.println(numero);  // 15

double preco = 50.0;
preco *= 1.1;           // Aumenta 10%
System.out.println(preco);  // 55.0

// Potência de 2 (exemplo)
int valor = 2;
valor *= valor;         // valor = valor * valor = 2 * 2 = 4
valor *= valor;         // valor = 4 * 4 = 16
System.out.println(valor);  // 16
```

### 4. Operador /= (Divisão)

**Divide variável por valor**:
```java
int total = 100;
total /= 4;             // total = total / 4
System.out.println(total);  // 25

double preco = 200.0;
preco /= 2;             // preco = preco / 2
System.out.println(preco);  // 100.0

// Divisão inteira (trunca)
int x = 10;
x /= 3;                 // x = 10 / 3 = 3 (divisão inteira!)
System.out.println(x);  // 3
```

### 5. Operador %= (Módulo)

**Calcula resto e atribui**:
```java
int numero = 17;
numero %= 5;            // numero = numero % 5
System.out.println(numero);  // 2 (17 % 5 = 2)

int contador = 10;
contador %= 3;          // contador = 10 % 3
System.out.println(contador);  // 1

// Exemplo: manter valor dentro de range
int indice = 25;
indice %= 10;           // Garante que indice fica entre 0-9
System.out.println(indice);  // 5
```

### 6. Casting Implícito em Atribuições Compostas

**IMPORTANTE**: Atribuição composta inclui **cast automático**.

```java
// Exemplo 1: byte
byte b = 10;
// b = b + 5;        // ❌ Erro! b + 5 é int, precisa cast
b = (byte)(b + 5);   // ✅ OK com cast explícito
b += 5;              // ✅ OK! Cast automático

// Exemplo 2: short
short s = 100;
// s = s * 2;        // ❌ Erro! s * 2 é int
s = (short)(s * 2);  // ✅ OK com cast explícito
s *= 2;              // ✅ OK! Cast automático

// Exemplo 3: int
int i = 10;
// i = i + 5.5;      // ❌ Erro! Resultado é double
i = (int)(i + 5.5);  // ✅ OK com cast explícito
i += 5.5;            // ✅ OK! Cast automático para int
System.out.println(i);  // 15 (5.5 convertido para 5)
```

**Regra**:
```java
variavel op= expressao;
// É equivalente a:
variavel = (TipoDaVariavel) (variavel op expressao);
// NÃO é equivalente a (sem cast):
variavel = variavel op expressao;
```

### 7. Avaliação Única da Variável

**Expressão à esquerda é avaliada apenas uma vez**:
```java
int[] array = {10, 20, 30};
int indice = 0;

// Com atribuição simples
array[indice++] = array[indice++] + 5;
// indice é incrementado DUAS vezes! (resultado inesperado)

// Com atribuição composta
int[] array2 = {10, 20, 30};
int indice2 = 0;
array2[indice2++] += 5;
// indice2 é incrementado UMA vez (comportamento esperado)

System.out.println(indice);   // 2 (incrementou 2x)
System.out.println(indice2);  // 1 (incrementou 1x)
```

### 8. Precedência e Associatividade

**Precedência baixa** (similar à atribuição simples):
```java
int x = 10;
int y = 5;

// Expressão à direita é avaliada primeiro
x += y * 2;    // x = x + (y * 2) = 10 + 10 = 20

// Associatividade: direita para esquerda
int a = 5, b = 10, c = 15;
a = b = c;     // a = (b = c)
// b = c → b = 15
// a = b → a = 15
```

### 9. Uso com Diferentes Tipos

**Primitivos numéricos**:
```java
byte b = 10;
b += 5;      // 15

short s = 100;
s *= 2;      // 200

int i = 50;
i /= 2;      // 25

long l = 1000L;
l -= 100;    // 900

float f = 3.5f;
f *= 2;      // 7.0

double d = 10.0;
d /= 3;      // 3.333...
```

**String (apenas +=)**:
```java
String texto = "Java";
texto += " 17";        // "Java 17"
texto += " LTS";       // "Java 17 LTS"

// Outros operadores não funcionam com String
// texto -= " LTS";    // ❌ Erro: bad operand types
```

### 10. Comparação: Composto vs Simples

```java
// Exemplo 1: Mais conciso
int x = 10;
x = x + 5;    // Forma simples
x += 5;       // Forma composta (preferível)

// Exemplo 2: Evita repetição
int[] valores = getValores();
valores[calcularIndice()] = valores[calcularIndice()] + 10;  // calcularIndice() chamado 2x
valores[calcularIndice()] += 10;  // calcularIndice() chamado 1x

// Exemplo 3: Cast automático
byte b = 100;
b = (byte)(b + 20);   // Cast manual necessário
b += 20;              // Cast automático (preferível)

// Exemplo 4: Legibilidade
double preco = 100.0;
preco = preco + preco * 0.1;   // Menos claro
preco += preco * 0.1;          // Mais claro: "adiciona 10% ao preço"
```

---

## 🔍 Análise Conceitual Profunda

### Diferença Sutil: Cast Automático

**CRUCIAL**: Atribuição composta NÃO é exatamente igual à expandida.

```java
// Caso 1: byte
byte b = 100;

// Forma expandida SEM cast (ERRO!)
// b = b + 20;  // ❌ Erro: incompatible types: possible lossy conversion
//                 Razão: b + 20 é int (promoção numérica)

// Forma expandida COM cast (OK)
b = (byte)(b + 20);  // ✅ OK

// Forma composta (OK - cast implícito!)
b += 20;  // ✅ OK - equivale a: b = (byte)(b + 20)

System.out.println(b);  // 120

// Caso 2: int com double
int x = 10;

// Forma expandida (ERRO!)
// x = x + 5.5;  // ❌ Erro: incompatible types

// Forma expandida COM cast (OK)
x = (int)(x + 5.5);  // ✅ OK: 15 (5.5 convertido para 5)

// Forma composta (OK - cast implícito!)
x += 5.5;  // ✅ OK - equivale a: x = (int)(x + 5.5)

System.out.println(x);  // 15
```

**Regra formal**:
```
E1 op= E2  é equivalente a  E1 = (T)((E1) op (E2))
onde T é o tipo de E1
```

### Promoção Numérica em Operações

**Operações aritméticas promovem tipos menores para int**:
```java
byte a = 10;
byte b = 20;

// Operação binária: byte → int
// byte c = a + b;  // ❌ Erro! a + b é int
byte c = (byte)(a + b);  // ✅ Cast manual

// Atribuição composta: cast automático
byte d = 10;
d += 20;  // ✅ OK (cast implícito)

// Explicação:
// d += 20  →  d = (byte)(d + 20)
```

### Overflow em Atribuições Compostas

**Cast automático pode causar overflow silencioso**:
```java
byte b = 100;
b += 50;  // Equivale a: b = (byte)(100 + 50) = (byte)150
System.out.println(b);  // -106 ⚠️ (overflow! 150 > 127)

// 150 em binário: 1001 0110
// Como byte (complemento de 2): -106

// Atribuição simples daria erro em tempo de compilação
// b = 150;  // ❌ Erro: incompatible types: possible lossy conversion
```

### Efeitos Colaterais (Side Effects)

**Expressão à esquerda avaliada apenas uma vez**:
```java
int[] array = {1, 2, 3, 4, 5};
int i = 0;

// Atribuição simples: i++ executado DUAS vezes
array[i++] = array[i++] + 10;
// 1ª execução: i=0, i++ → i=1
// 2ª execução: i=1, i++ → i=2
// array[0] = array[1] + 10 = 2 + 10 = 12
// i final = 2

int[] array2 = {1, 2, 3, 4, 5};
int j = 0;

// Atribuição composta: j++ executado UMA vez
array2[j++] += 10;
// j=0, j++ → j=1
// array2[0] += 10 → array2[0] = array2[0] + 10 = 1 + 10 = 11
// j final = 1

System.out.println(i);  // 2
System.out.println(j);  // 1
```

### Performance

**Atribuição composta pode ser mais eficiente**:
```java
// Atribuição simples: avalia expressão à esquerda duas vezes
objeto.getCampo().getValor().getData() = 
    objeto.getCampo().getValor().getData() + 10;
// Chamadas redundantes!

// Atribuição composta: avalia expressão à esquerda uma vez
objeto.getCampo().getValor().getData() += 10;
// Mais eficiente!
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Contadores e Acumuladores

```java
public class Contador {
    public void contar() {
        int total = 0;
        
        total += 10;  // Acumula 10
        total += 20;  // Acumula 20
        total += 30;  // Acumula 30
        
        System.out.println("Total: " + total);  // 60
    }
    
    public void calcularSoma(int[] valores) {
        int soma = 0;
        for (int valor : valores) {
            soma += valor;  // Acumula cada valor
        }
        System.out.println("Soma: " + soma);
    }
}
```

### Caso 2: Cálculos Financeiros

```java
public class Financeiro {
    public void calcularJuros() {
        double capital = 1000.0;
        double taxa = 0.05;  // 5%
        
        // Juros compostos (3 meses)
        capital *= (1 + taxa);  // Mês 1
        capital *= (1 + taxa);  // Mês 2
        capital *= (1 + taxa);  // Mês 3
        
        System.out.println("Capital final: " + capital);
        // 1157.625
    }
    
    public void aplicarDesconto() {
        double preco = 500.0;
        preco *= 0.9;  // Aplica 10% de desconto
        System.out.println("Preço com desconto: " + preco);
        // 450.0
    }
}
```

### Caso 3: Manipulação de Strings

```java
public class ManipulacaoString {
    public void construirMensagem() {
        String mensagem = "Olá";
        
        mensagem += ", ";
        mensagem += "mundo";
        mensagem += "!";
        
        System.out.println(mensagem);  // "Olá, mundo!"
    }
    
    public void construirHTML() {
        String html = "<html>";
        html += "<head><title>Página</title></head>";
        html += "<body>";
        html += "<h1>Bem-vindo!</h1>";
        html += "</body>";
        html += "</html>";
        
        System.out.println(html);
    }
}
```

### Caso 4: Algoritmos Matemáticos

```java
public class Matematica {
    public int fatorial(int n) {
        int resultado = 1;
        for (int i = 2; i <= n; i++) {
            resultado *= i;  // Multiplica resultado por i
        }
        return resultado;
    }
    
    public int fibonacci(int n) {
        int a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            int temp = a;
            a = b;
            b += temp;  // b = b + temp (próximo Fibonacci)
        }
        return a;
    }
}
```

### Caso 5: Ajustes de Valores

```java
public class Ajustes {
    public void normalizarRange() {
        int valor = 125;
        valor %= 100;  // Mantém valor entre 0-99
        System.out.println(valor);  // 25
    }
    
    public void duplicarValores(int[] array) {
        for (int i = 0; i < array.length; i++) {
            array[i] *= 2;  // Dobra cada elemento
        }
    }
    
    public void aplicarTaxa() {
        double[] precos = {100.0, 200.0, 300.0};
        for (int i = 0; i < precos.length; i++) {
            precos[i] *= 1.1;  // Adiciona 10% a cada preço
        }
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Overflow Silencioso

**Problema**: Cast automático pode causar overflow.
```java
byte b = 100;
b += 50;  // (byte)150 = -106 ⚠️ Overflow!
System.out.println(b);  // -106

// Solução: verificar limites
byte b2 = 100;
int soma = b2 + 50;
if (soma >= Byte.MIN_VALUE && soma <= Byte.MAX_VALUE) {
    b2 = (byte) soma;
} else {
    System.out.println("Overflow!");
}
```

### 2. Perda de Precisão

**Problema**: Conversão pode perder dados.
```java
int x = 10;
x += 5.9;  // x = (int)(10 + 5.9) = (int)15.9 = 15
System.out.println(x);  // 15 (perde 0.9)

// Solução: usar tipo apropriado
double y = 10.0;
y += 5.9;  // 15.9 (sem perda)
```

### 3. String Concatenation Performance

**Problema**: `+=` com String em loop é ineficiente.
```java
// ❌ Ineficiente (cria muitos objetos String)
String texto = "";
for (int i = 0; i < 1000; i++) {
    texto += i;  // Cria novo objeto a cada iteração!
}

// ✅ Eficiente (usa StringBuilder)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String texto2 = sb.toString();
```

### 4. Divisão Inteira

**Problema**: Divisão de int resulta em int.
```java
int x = 10;
x /= 3;  // x = 10 / 3 = 3 (não 3.333...)
System.out.println(x);  // 3

// Solução: usar double
double y = 10.0;
y /= 3;  // 3.333...
System.out.println(y);
```

### 5. Operadores Não Funcionam com Todos os Tipos

**Problema**: Operadores `-=`, `*=`, `/=`, `%=` não funcionam com String.
```java
String s = "Java 17";
// s -= " 17";  // ❌ Erro: bad operand types
// s *= 2;      // ❌ Erro: bad operand types

// Apenas += funciona com String
s += " LTS";  // ✅ OK
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Atribuição Simples (=)**: Base para atribuições compostas
- **Operadores Aritméticos (+, -, *, /, %)**: Combinados com atribuição
- **Conversão de Tipos (Casting)**: Cast automático em atribuições compostas
- **Promoção Numérica**: Tipos menores promovidos para int em operações
- **Overflow**: Cast pode causar overflow silencioso
- **Precedência de Operadores**: Atribuição tem precedência baixa
- **Incremento/Decremento (++/--)**: Similar, mas específico para +1/-1

---

## 🚀 Boas Práticas

1. ✅ **Prefira atribuições compostas para clareza**
   ```java
   x += 5;  // ✅ Claro e conciso
   // x = x + 5;  // ❌ Verboso
   ```

2. ✅ **Use atribuições compostas para evitar repetição**
   ```java
   objeto.getCampo().getValor() += 10;  // ✅ Avalia uma vez
   // objeto.getCampo().getValor() = objeto.getCampo().getValor() + 10;  // ❌ Avalia duas vezes
   ```

3. ✅ **Cuidado com overflow em tipos pequenos**
   ```java
   byte b = 100;
   if (b + 50 <= Byte.MAX_VALUE) {
       b += 50;
   }
   ```

4. ✅ **Evite += com String em loops**
   ```java
   // ❌ Ineficiente
   String s = "";
   for (int i = 0; i < 100; i++) {
       s += i;
   }
   
   // ✅ Eficiente
   StringBuilder sb = new StringBuilder();
   for (int i = 0; i < 100; i++) {
       sb.append(i);
   }
   ```

5. ✅ **Use tipo apropriado para evitar perda de dados**
   ```java
   double valor = 10.0;
   valor += 5.9;  // ✅ 15.9 (sem perda)
   
   // int x = 10;
   // x += 5.9;  // ❌ 15 (perde 0.9)
   ```

6. ✅ **Documente operações que podem causar overflow**
   ```java
   byte contador = 120;
   contador += 10;  // Pode causar overflow (> 127)
   // Documentar comportamento esperado
   ```

7. ✅ **Combine com expressões para cálculos complexos**
   ```java
   preco += preco * 0.1;  // Adiciona 10%
   saldo -= saldo * taxa; // Desconta taxa
   ```

8. ✅ **Prefira atribuições compostas para acumuladores**
   ```java
   int soma = 0;
   for (int valor : valores) {
       soma += valor;  // ✅ Claro que está acumulando
   }
   ```
