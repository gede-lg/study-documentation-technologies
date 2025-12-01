# Operador Maior que (>)

## 🎯 Introdução e Definição

### Definição Conceitual

O **operador maior que (`>`)** é um operador binário relacional que **compara dois valores** e retorna `true` se o operando da esquerda for **estritamente maior** que o da direita, ou `false` caso contrário.

**Sintaxe**:
```java
valor1 > valor2
```

**Características principais**:
- ✅ **Retorna boolean**: Resultado sempre é `true` ou `false`
- ✅ **Operador binário**: Opera sobre dois operandos
- ✅ **Comparação de ordem**: Verifica se esquerda > direita
- ⚠️ **Estritamente maior**: Não inclui igualdade
- 📋 **Não comutativo**: `a > b` é diferente de `b > a`

**Exemplo básico**:
```java
int a = 10;
int b = 5;
int c = 10;

boolean maior1 = (a > b);  // true (10 > 5)
boolean maior2 = (a > c);  // false (10 não é > 10)

System.out.println("a > b: " + maior1);  // true
System.out.println("a > c: " + maior2);  // false
```

**Comparação: > vs >=**:
```java
int x = 10;
int y = 10;

System.out.println(x > y);   // false (10 não é > 10)
System.out.println(x >= y);  // true (10 é >= 10)
```

**Tabela de exemplos**:

| `a` | `b` | `a > b` | `b > a` |
|-----|-----|---------|---------|
| 10 | 5 | `true` | `false` |
| 5 | 10 | `false` | `true` |
| 10 | 10 | `false` | `false` |

### Características Fundamentais

- 🔍 **Comparação estrita**: Apenas > (não >=)
- 📊 **Resultado booleano**: Sempre `true` ou `false`
- 🎯 **Aplicável a números**: int, double, char, etc.
- ⚠️ **Não comutativo**: Ordem importa
- 💡 **Oposto de <=**: `a > b` é equivalente a `!(a <= b)`

---

## 📋 Sumário Conceitual

### Tabela de Comparações

| Tipo | Exemplo | `a > b` | Resultado |
|------|---------|---------|-----------|
| **int** | `a=10, b=5` | `a > b` | `true` |
| **int** | `a=5, b=10` | `a > b` | `false` |
| **int** | `a=10, b=10` | `a > b` | `false` |
| **double** | `a=3.14, b=2.71` | `a > b` | `true` |
| **char** | `a='B', b='A'` | `a > b` | `true` |

---

## 🧠 Fundamentos Teóricos

### 1. Comparação de Inteiros

**Comparação básica**:
```java
int x = 10;
int y = 5;
int z = 10;

System.out.println(x > y);  // true (10 > 5)
System.out.println(y > x);  // false (5 não é > 10)
System.out.println(x > z);  // false (10 não é > 10)
```

**Em condicionais**:
```java
int idade = 18;

if (idade > 18) {
    System.out.println("Maior de 18 anos");
} else if (idade > 16) {
    System.out.println("Entre 17 e 18 anos");
} else {
    System.out.println("16 anos ou menos");
}
```

### 2. Comparação de Números em Ponto Flutuante

**Comparação de double**:
```java
double temperatura = 36.5;
double limiteFebre = 37.0;

if (temperatura > limiteFebre) {
    System.out.println("Febre detectada");
} else {
    System.out.println("Temperatura normal");
}
```

**Comparação de float**:
```java
float nota1 = 8.5f;
float nota2 = 7.0f;

if (nota1 > nota2) {
    System.out.println("Nota1 é maior");
}
```

### 3. Comparação de Tipos Mistos

**int e double**:
```java
int x = 10;
double y = 9.9;

System.out.println(x > y);  // true (10.0 > 9.9, após conversão)
```

**long e int**:
```java
long grande = 1000000L;
int pequeno = 999999;

System.out.println(grande > pequeno);  // true
```

### 4. Comparação de char

**Comparação alfabética**:
```java
char c1 = 'B';
char c2 = 'A';

System.out.println(c1 > c2);  // true ('B' = 66 > 'A' = 65)
```

**Comparação maiúsculas vs minúsculas**:
```java
char maiuscula = 'A';  // ASCII 65
char minuscula = 'a';  // ASCII 97

System.out.println(minuscula > maiuscula);  // true (97 > 65)
```

**Comparação com número**:
```java
char letra = 'C';  // ASCII 67
int numero = 66;

System.out.println(letra > numero);  // true (67 > 66)
```

### 5. Uso em Loops

**Loop while**:
```java
int contador = 10;

while (contador > 0) {
    System.out.println("Contagem regressiva: " + contador);
    contador--;
}
```

**Loop for com condição**:
```java
for (int i = 100; i > 0; i -= 10) {
    System.out.println("i = " + i);
}
// Imprime: 100, 90, 80, ..., 10
```

### 6. Comparação de Expressões

**Comparação de resultados**:
```java
int a = 10;
int b = 5;
int c = 3;

boolean resultado = (a + b) > (c * 5);  // (15) > (15) = false
System.out.println(resultado);  // false

boolean resultado2 = (a * 2) > (b + c);  // (20) > (8) = true
System.out.println(resultado2);  // true
```

### 7. Validação de Intervalos

**Verificar se está acima de limite**:
```java
int nota = 85;
int notaMinima = 60;

if (nota > notaMinima) {
    System.out.println("Aprovado!");
}
```

**Verificar intervalo**:
```java
int idade = 25;

if (idade > 18 && idade < 65) {
    System.out.println("Adulto em idade ativa");
}
```

### 8. Comparação em Arrays

**Encontrar maior elemento**:
```java
int[] numeros = {5, 12, 3, 18, 7};
int maior = numeros[0];

for (int num : numeros) {
    if (num > maior) {
        maior = num;
    }
}

System.out.println("Maior elemento: " + maior);  // 18
```

**Contar elementos acima de limite**:
```java
int[] valores = {10, 25, 5, 30, 15, 40};
int limite = 20;
int contador = 0;

for (int valor : valores) {
    if (valor > limite) {
        contador++;
    }
}

System.out.println("Elementos acima de " + limite + ": " + contador);  // 3
```

### 9. Ordenação e Comparação

**Comparação para ordenação**:
```java
int a = 5;
int b = 10;

if (a > b) {
    System.out.println("Ordem: " + a + ", " + b);
} else {
    System.out.println("Ordem: " + b + ", " + a);
}
```

### 10. Máximo entre Dois Valores

**Encontrar máximo**:
```java
int x = 10;
int y = 25;

int maximo = (x > y) ? x : y;
System.out.println("Máximo: " + maximo);  // 25
```

**Método max**:
```java
public int max(int a, int b) {
    return (a > b) ? a : b;
}

System.out.println(max(10, 5));   // 10
System.out.println(max(3, 12));   // 12
```

---

## 🔍 Análise Conceitual Profunda

### Não Comutatividade

**Ordem importa**:
```java
int a = 10;
int b = 5;

System.out.println(a > b);  // true (10 > 5)
System.out.println(b > a);  // false (5 não é > 10)

// a > b NÃO é igual a b > a
```

**Relação com <**:
```java
int x = 10;
int y = 5;

System.out.println(x > y);  // true
System.out.println(y < x);  // true (equivalente)

// a > b é equivalente a b < a
```

### Precedência de Operadores

**> tem menor precedência que aritméticos**:
```java
int x = 5;
int y = 10;

// Aritmética avaliada ANTES de >
boolean resultado = x + 5 > y;  // (x + 5) > y → 10 > 10 → false
System.out.println(resultado);  // false

boolean resultado2 = x * 2 > y;  // (x * 2) > y → 10 > 10 → false
System.out.println(resultado2);  // false
```

**Comparação com operadores lógicos**:
```java
int a = 10;
int b = 5;
int c = 3;

// > avaliado ANTES de &&
boolean r = a > b && b > c;  // (a > b) && (b > c) → true && true → true
System.out.println(r);  // true
```

### Equivalências Lógicas

**Relação com <=**:
```java
int a = 10;
int b = 5;

// a > b é equivalente a !(a <= b)
System.out.println(a > b);       // true
System.out.println(!(a <= b));   // true

// Demonstração
System.out.println((a > b) == !(a <= b));  // true
```

### Conversão de Tipos

**Promoção automática**:
```java
byte b = 10;
short s = 5;
int i = 3;
long l = 2L;

// Todos promovidos para long
System.out.println(b > s);  // true (ambos → int)
System.out.println(i > l);  // true (i → long)
```

**int e double**:
```java
int x = 10;
double y = 9.5;

// x promovido para double
System.out.println(x > y);  // true (10.0 > 9.5)
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação de Idade

```java
public class ValidadorIdade {
    public void validar(int idade) {
        if (idade > 120) {
            System.out.println("Idade inválida");
            return;
        }
        
        if (idade > 65) {
            System.out.println("Idoso");
        } else if (idade > 18) {
            System.out.println("Adulto");
        } else if (idade > 12) {
            System.out.println("Adolescente");
        } else {
            System.out.println("Criança");
        }
    }
}
```

### Caso 2: Sistema de Notas

```java
public class SistemaNotas {
    public String obterConceito(double nota) {
        if (nota > 9.0) {
            return "A";
        } else if (nota > 7.0) {
            return "B";
        } else if (nota > 5.0) {
            return "C";
        } else if (nota > 3.0) {
            return "D";
        } else {
            return "F";
        }
    }
}
```

### Caso 3: Controle de Estoque

```java
public class Estoque {
    private int quantidade;
    private int estoqueMinimo = 10;
    
    public boolean precisaReposicao() {
        return quantidade > estoqueMinimo;
    }
    
    public void verificar() {
        if (quantidade > 100) {
            System.out.println("Estoque alto");
        } else if (quantidade > estoqueMinimo) {
            System.out.println("Estoque normal");
        } else {
            System.out.println("Estoque baixo - repor!");
        }
    }
}
```

### Caso 4: Encontrar Máximo

```java
public class Matematica {
    public int maximo(int[] numeros) {
        if (numeros.length == 0) {
            throw new IllegalArgumentException("Array vazio");
        }
        
        int max = numeros[0];
        
        for (int num : numeros) {
            if (num > max) {
                max = num;
            }
        }
        
        return max;
    }
    
    public void exemplo() {
        int[] valores = {5, 12, 3, 18, 7};
        System.out.println("Máximo: " + maximo(valores));  // 18
    }
}
```

### Caso 5: Filtro de Valores

```java
public class Filtro {
    public List<Integer> filtrarMaioresQue(List<Integer> lista, int limite) {
        List<Integer> resultado = new ArrayList<>();
        
        for (int num : lista) {
            if (num > limite) {
                resultado.add(num);
            }
        }
        
        return resultado;
    }
    
    public void exemplo() {
        List<Integer> numeros = Arrays.asList(5, 12, 3, 18, 7, 20);
        List<Integer> maiores = filtrarMaioresQue(numeros, 10);
        System.out.println(maiores);  // [12, 18, 20]
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Não Funciona com Objetos Diretamente

**Problema**: Não pode comparar objetos complexos.
```java
String s1 = "abc";
String s2 = "def";

// ❌ ERRO: bad operand types for binary operator '>'
// if (s1 > s2) { }

// ✅ Solução: usar compareTo()
if (s1.compareTo(s2) > 0) {
    System.out.println("s1 vem depois");
}
```

### 2. Imprecisão de Ponto Flutuante

**Problema**: Comparação pode ser imprecisa.
```java
double a = 0.1 + 0.2;  // 0.30000000000000004
double b = 0.3;

System.out.println(a > b);  // true (inesperado!)

// ✅ Solução: usar epsilon
double epsilon = 0.00001;
if (Math.abs(a - b) > epsilon) {
    System.out.println("Diferentes");
}
```

### 3. Comparação de char é Numérica

**Problema**: Pode ser contra-intuitivo.
```java
char maiuscula = 'A';  // 65
char minuscula = 'a';  // 97

System.out.println(minuscula > maiuscula);  // true (97 > 65)
// Minúscula não é "maior" alfabeticamente, mas tem código maior
```

### 4. Overflow pode Causar Resultados Incorretos

**Problema**: Overflow altera resultado.
```java
int max = Integer.MAX_VALUE;
int x = max + 1;  // Overflow: vira Integer.MIN_VALUE

System.out.println(x > max);  // false (inesperado!)
System.out.println("x = " + x);  // x = -2147483648
```

### 5. Confusão entre > e >=

**Problema**: Usar operador errado.
```java
int idade = 18;

// Se quer incluir 18:
if (idade >= 18) {  // ✅ Correto
    System.out.println("Maior ou igual a 18");
}

// Se quer excluir 18:
if (idade > 18) {  // ✅ Correto
    System.out.println("Maior que 18");
}
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Operador Menor (<)**: Oposto de >
- **Operador Maior ou Igual (>=)**: Inclui igualdade
- **Operador Menor ou Igual (<=)**: Negação de >
- **Operadores de Igualdade (==, !=)**: Outras comparações
- **Operadores Lógicos (&&, ||)**: Combinação de comparações
- **Conversão de Tipos**: Promoção numérica
- **Precedência de Operadores**: Ordem de avaliação
- **Comparator**: Comparação customizada de objetos

---

## 🚀 Boas Práticas

1. ✅ **Use para validação de limites**
   ```java
   if (idade > 18) {  // ✅ Claro
       System.out.println("Adulto");
   }
   ```

2. ✅ **Escolha entre > e >= conscientemente**
   ```java
   // Para idade ACIMA de 18 (19+)
   if (idade > 18) { }  // ✅ Correto
   
   // Para idade A PARTIR de 18 (18+)
   if (idade >= 18) { }  // ✅ Correto
   ```

3. ✅ **Use em loops de contagem regressiva**
   ```java
   while (contador > 0) {  // ✅ Idiomático
       contador--;
   }
   ```

4. ✅ **Evite comparação direta de doubles**
   ```java
   // ❌ Evitar
   if (valor > 3.14) { }
   
   // ✅ Usar epsilon se necessário
   if (valor - 3.14 > 0.001) { }
   ```

5. ✅ **Use compareTo() para Strings**
   ```java
   if (str1.compareTo(str2) > 0) {  // ✅ Correto
       System.out.println("str1 vem depois");
   }
   ```

6. ✅ **Use constantes para limites**
   ```java
   private static final int IDADE_MINIMA = 18;
   
   if (idade > IDADE_MINIMA) {  // ✅ Legível
       // ...
   }
   ```

7. ✅ **Combine com && para intervalos**
   ```java
   if (idade > 18 && idade < 65) {  // ✅ Intervalo claro
       System.out.println("Adulto em idade ativa");
   }
   ```

8. ✅ **Use em ternário para máximo**
   ```java
   int max = (a > b) ? a : b;  // ✅ Conciso
   ```

9. ✅ **Documente comparações complexas**
   ```java
   // Verifica se temperatura está acima do limite de febre (37°C)
   if (temperatura > 37.0) {  // ✅ Comentário ajuda
       // ...
   }
   ```

10. ✅ **Use Math.max() quando apropriado**
    ```java
    // Em vez de:
    int max = (a > b) ? a : b;
    
    // Considere:
    int max = Math.max(a, b);  // ✅ Mais claro
    ```
