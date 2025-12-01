# Atribuição Múltipla

## 🎯 Introdução e Definição

### Definição Conceitual

A **atribuição múltipla** (ou **atribuição em cadeia/encadeada**) permite **atribuir o mesmo valor a múltiplas variáveis em uma única instrução**. Isso é possível porque a operação de atribuição retorna o valor atribuído, permitindo encadear várias atribuições.

**Sintaxe**:
```java
variavel1 = variavel2 = variavel3 = ... = valor;
```

**Características principais**:
- ✅ **Atribuição em cascata**: Múltiplas variáveis recebem o mesmo valor
- ✅ **Avaliação direita → esquerda**: Valor atribuído da direita para esquerda
- ✅ **Retorna valor**: Cada atribuição retorna o valor atribuído
- ✅ **Código conciso**: Inicializa várias variáveis em uma linha
- ⚠️ **Mesmo tipo**: Variáveis devem ser compatíveis com o valor

**Exemplo básico**:
```java
int a, b, c;
a = b = c = 10;  // Todas recebem 10

// Equivalente a:
c = 10;          // c = 10
b = c;           // b = 10
a = b;           // a = 10

System.out.println(a + ", " + b + ", " + c);  // 10, 10, 10
```

### Características Fundamentais

- 🔄 **Associatividade direita→esquerda**: Avalia da direita para esquerda
- 📋 **Retorno de valor**: Cada `=` retorna o valor atribuído
- 🎯 **Inicialização simultânea**: Útil para inicializar múltiplas variáveis
- ⚠️ **Compatibilidade de tipos**: Conversões widening aplicam-se
- 💡 **Legibilidade**: Use com moderação para não prejudicar clareza

---

## 📋 Sumário Conceitual

### Ordem de Avaliação

```java
a = b = c = 10;

// Execução (direita → esquerda):
// 1. c = 10  → retorna 10
// 2. b = 10  → retorna 10
// 3. a = 10  → retorna 10
```

**Visualização**:
```
a = (b = (c = 10))
       └─ c=10 ───► retorna 10
    └─ b=10 ──────► retorna 10
└─ a=10 ──────────► retorna 10
```

---

## 🧠 Fundamentos Teóricos

### 1. Atribuição Simples em Cadeia

**Múltiplas variáveis do mesmo tipo**:
```java
int x, y, z;
x = y = z = 5;

System.out.println("x=" + x + ", y=" + y + ", z=" + z);
// x=5, y=5, z=5

// Declaração + inicialização em cadeia
int a = b = c = 10;  // ❌ Erro! Apenas a primeira pode ser declarada
                     // b e c não foram declaradas

// Correto:
int a, b, c;
a = b = c = 10;  // ✅ OK
```

### 2. Ordem de Execução (Direita → Esquerda)

**Associatividade à direita**:
```java
int a, b, c;
a = b = c = 20;

// Ordem de execução:
// Passo 1: c = 20  → c recebe 20, retorna 20
// Passo 2: b = 20  → b recebe 20 (valor retornado de c=20), retorna 20
// Passo 3: a = 20  → a recebe 20 (valor retornado de b=20), retorna 20

System.out.println(a);  // 20
System.out.println(b);  // 20
System.out.println(c);  // 20
```

**Exemplo com expressão**:
```java
int x, y, z;
x = y = z = 10 + 5;

// Execução:
// 1. Avalia 10 + 5 = 15
// 2. z = 15  → retorna 15
// 3. y = 15  → retorna 15
// 4. x = 15  → retorna 15

System.out.println(x + ", " + y + ", " + z);  // 15, 15, 15
```

### 3. Atribuição Múltipla com Conversão de Tipos

**Widening (automático)**:
```java
int i;
long l;
double d;

i = 100;
l = d = i;  // i → long (automático), i → double (automático)

System.out.println("i=" + i);  // 100
System.out.println("l=" + l);  // 100
System.out.println("d=" + d);  // 100.0

// Ordem:
// 1. d = i  → d = 100.0 (int → double), retorna 100.0
// 2. l = 100.0  → l = 100 (double → long), retorna 100
```

**Narrowing (requer cast ou causa erro)**:
```java
double d = 3.14;
int i;
byte b;

// i = b = d;  // ❌ Erro! double → byte não é automático

// Correto (com cast):
i = (int)(b = (byte) d);
System.out.println("i=" + i + ", b=" + b);  // i=3, b=3
```

### 4. Atribuição Múltipla com Diferentes Tipos

**Tipos compatíveis (widening)**:
```java
byte b;
short s;
int i;
long l;

b = 10;
s = i = l = b;  // b → short, b → int, b → long (widening)

System.out.println("s=" + s + ", i=" + i + ", l=" + l);
// s=10, i=10, l=10
```

**Tipos incompatíveis**:
```java
int i;
double d;
String s;

// i = d = s = 10;  // ❌ Erro! String não é numérico
// i = s = d = 10;  // ❌ Erro! String não é compatível

// Correto: tipos compatíveis
i = (int)(d = 10.5);
System.out.println("i=" + i + ", d=" + d);  // i=10, d=10.5
```

### 5. Atribuição com Expressões Complexas

**Expressão à direita**:
```java
int a, b, c;
a = b = c = 5 * 2 + 3;  // 13

// Execução:
// 1. Avalia 5 * 2 + 3 = 13
// 2. c = 13
// 3. b = 13
// 4. a = 13

System.out.println(a + ", " + b + ", " + c);  // 13, 13, 13
```

**Com métodos**:
```java
int x, y, z;
x = y = z = Math.max(10, 20);  // 20

System.out.println(x + ", " + y + ", " + z);  // 20, 20, 20
```

### 6. Atribuição com Objetos (Referências)

**Múltiplas variáveis apontam para o MESMO objeto**:
```java
StringBuilder sb1, sb2, sb3;
sb1 = sb2 = sb3 = new StringBuilder("Java");

// Todas apontam para o MESMO objeto
System.out.println(sb1 == sb2);  // true (mesma referência)
System.out.println(sb2 == sb3);  // true (mesma referência)

// Modificar um afeta todos
sb1.append(" 17");
System.out.println(sb2);  // "Java 17" (mesmo objeto!)
System.out.println(sb3);  // "Java 17" (mesmo objeto!)
```

**Com String (imutável)**:
```java
String s1, s2, s3;
s1 = s2 = s3 = "Olá";

// Todas apontam para o MESMO objeto (String pool)
System.out.println(s1 == s2);  // true
System.out.println(s2 == s3);  // true

// Reatribuir cria novo objeto (imutabilidade)
s1 = "Tchau";
System.out.println(s2);  // "Olá" (s2 ainda aponta para objeto original)
System.out.println(s1 == s2);  // false (s1 aponta para novo objeto)
```

### 7. Uso em Declarações

**Declaração múltipla com inicialização**:
```java
// ✅ Correto: declarar separadamente, depois atribuir
int a, b, c;
a = b = c = 10;

// ❌ Erro: não pode declarar em cadeia
// int x = int y = int z = 10;

// ✅ Correto: declaração com inicialização individual
int x = 10, y = 20, z = 30;

// ✅ Correto: declaração com mesmo valor
int p = 5, q = 5, r = 5;
```

### 8. Atribuição Múltipla com Pós/Pré-Incremento

**Cuidado com incremento/decremento**:
```java
int x = 5, y, z;

// Pós-incremento
y = z = x++;
// Execução:
// 1. z = x  → z = 5 (x ainda é 5), retorna 5
// 2. x++    → x = 6
// 3. y = 5  → y = 5
System.out.println("x=" + x + ", y=" + y + ", z=" + z);
// x=6, y=5, z=5

// Pré-incremento
int a = 5, b, c;
b = c = ++a;
// Execução:
// 1. ++a    → a = 6
// 2. c = a  → c = 6, retorna 6
// 3. b = 6  → b = 6
System.out.println("a=" + a + ", b=" + b + ", c=" + c);
// a=6, b=6, c=6
```

### 9. Atribuição com Arrays

**Atribuição de referência de array**:
```java
int[] arr1, arr2, arr3;
arr1 = arr2 = arr3 = new int[]{1, 2, 3};

// Todas apontam para o MESMO array
System.out.println(arr1 == arr2);  // true
System.out.println(arr2 == arr3);  // true

// Modificar um afeta todos
arr1[0] = 100;
System.out.println(arr2[0]);  // 100 (mesmo array!)
System.out.println(arr3[0]);  // 100 (mesmo array!)
```

### 10. Combinação com Atribuições Compostas

**Atribuição composta não funciona em cadeia**:
```java
int a = 10, b = 20, c = 30;

// a += b += c;  // ❌ Não recomendado! Ordem confusa

// Executaria:
// 1. b += c  → b = b + c = 20 + 30 = 50
// 2. a += b  → a = a + b = 10 + 50 = 60

// Preferir:
b += c;  // b = 50
a += b;  // a = 60
```

---

## 🔍 Análise Conceitual Profunda

### Por Que Funciona: Atribuição Retorna Valor

**Atribuição é uma expressão que retorna valor**:
```java
int x, y;
y = (x = 10);  // x = 10 retorna 10, que é atribuído a y

System.out.println(x);  // 10
System.out.println(y);  // 10

// Encadeamento usa esse retorno
int a, b, c;
a = (b = (c = 5));
// c = 5 → retorna 5
// b = 5 → retorna 5
// a = 5 → retorna 5
```

### Equivalência Expandida

```java
a = b = c = 10;

// É equivalente a:
c = 10;
b = c;  // ou b = 10
a = b;  // ou a = 10
```

### Ordem de Avaliação Passo a Passo

```java
int x, y, z;
x = y = z = 10 + 5 * 2;

// Passo 1: Avalia expressão à direita
// 5 * 2 = 10
// 10 + 10 = 20

// Passo 2: z = 20  → retorna 20
// Passo 3: y = 20  → retorna 20
// Passo 4: x = 20  → retorna 20

System.out.println(x + ", " + y + ", " + z);  // 20, 20, 20
```

### Referências vs Valores

**Primitivos: copia VALOR**:
```java
int a, b, c;
c = 10;
a = b = c;  // Copia VALOR 10 para b e a

c = 20;  // Mudar c não afeta a ou b
System.out.println(a + ", " + b + ", " + c);  // 10, 10, 20
```

**Objetos: copia REFERÊNCIA**:
```java
StringBuilder sb1, sb2, sb3;
sb3 = new StringBuilder("Java");
sb1 = sb2 = sb3;  // Copia REFERÊNCIA (todos apontam pro mesmo objeto)

sb3.append(" 17");  // Modifica o objeto
System.out.println(sb1);  // "Java 17" (mesmo objeto!)
System.out.println(sb2);  // "Java 17" (mesmo objeto!)
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Inicialização de Contadores

```java
public class Contadores {
    public void inicializar() {
        int total, parcial, acumulado;
        total = parcial = acumulado = 0;  // Todos começam em 0
        
        System.out.println("Inicializados: " + total + ", " + parcial + ", " + acumulado);
        // Inicializados: 0, 0, 0
    }
}
```

### Caso 2: Resetar Múltiplas Variáveis

```java
public class Jogo {
    private int vida, energia, pontos;
    
    public void resetar() {
        vida = energia = pontos = 100;  // Reset simultâneo
        System.out.println("Jogo resetado!");
    }
    
    public void gameOver() {
        vida = energia = pontos = 0;  // Zerar tudo
        System.out.println("Game Over!");
    }
}
```

### Caso 3: Coordenadas Iniciais

```java
public class Posicao {
    private int x, y, z;
    
    public void origem() {
        x = y = z = 0;  // Posição (0, 0, 0)
    }
    
    public void posicaoInicial(int valor) {
        x = y = z = valor;  // Todas coordenadas com mesmo valor
        System.out.println("Posição: (" + x + ", " + y + ", " + z + ")");
    }
}
```

### Caso 4: Flags de Controle

```java
public class Flags {
    private boolean ativo, pronto, finalizado;
    
    public void iniciarProcesso() {
        ativo = pronto = finalizado = false;  // Todas false
    }
    
    public void ativarTodos() {
        ativo = pronto = finalizado = true;  // Todas true
    }
}
```

### Caso 5: Valores Padrão

```java
public class Configuracao {
    private double temperatura, pressao, umidade;
    
    public void usarValorPadrao() {
        temperatura = pressao = umidade = 25.0;  // Valor padrão
        System.out.println("Configuração padrão aplicada");
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Legibilidade

**Problema**: Muitas variáveis dificulta leitura.
```java
// ❌ Difícil de ler
a = b = c = d = e = f = g = h = i = j = 10;

// ✅ Mais claro
int a = 10, b = 10, c = 10;
int d = 10, e = 10, f = 10;
```

### 2. Objetos Compartilham Referência

**Problema**: Modificar um afeta todos.
```java
StringBuilder sb1, sb2, sb3;
sb1 = sb2 = sb3 = new StringBuilder("Java");

sb1.append(" 17");
System.out.println(sb2);  // "Java 17" ⚠️ Modificado!

// Solução: criar objetos separados
sb1 = new StringBuilder("Java");
sb2 = new StringBuilder("Java");
sb3 = new StringBuilder("Java");
```

### 3. Conversões de Tipo

**Problema**: Conversão pode causar perda.
```java
double d = 3.14;
int i;
byte b;

// i = b = d;  // ❌ Erro: incompatible types

// Solução: cast explícito
i = (int)(b = (byte) d);
System.out.println("i=" + i + ", b=" + b);  // i=3, b=3 (perdeu decimais)
```

### 4. Não Funciona em Declaração

**Problema**: Declarar em cadeia dá erro.
```java
// int a = int b = int c = 10;  // ❌ Erro de sintaxe

// Solução: declarar primeiro, depois atribuir
int a, b, c;
a = b = c = 10;  // ✅ OK
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Atribuição Simples (=)**: Base da atribuição múltipla
- **Expressões de Atribuição**: Atribuição retorna valor
- **Precedência de Operadores**: Associatividade à direita
- **Conversão de Tipos**: Widening aplicado em cada atribuição
- **Referências**: Objetos compartilham mesma referência
- **Imutabilidade**: Comportamento diferente com objetos imutáveis

---

## 🚀 Boas Práticas

1. ✅ **Use para inicialização simultânea de variáveis relacionadas**
   ```java
   int x, y, z;
   x = y = z = 0;  // ✅ Contadores/coordenadas
   ```

2. ✅ **Limite o número de variáveis para manter legibilidade**
   ```java
   a = b = c = 10;  // ✅ OK (3 variáveis)
   // a = b = c = d = e = f = g = 10;  // ❌ Difícil de ler
   ```

3. ✅ **Documente quando atribuir referências compartilhadas**
   ```java
   // Todas as variáveis apontam para o mesmo objeto
   StringBuilder sb1, sb2, sb3;
   sb1 = sb2 = sb3 = new StringBuilder();
   ```

4. ✅ **Evite com objetos mutáveis se não quiser compartilhar**
   ```java
   // ❌ Compartilha referência
   List<String> list1, list2;
   list1 = list2 = new ArrayList<>();
   
   // ✅ Objetos separados
   list1 = new ArrayList<>();
   list2 = new ArrayList<>();
   ```

5. ✅ **Use em reset/inicialização de estado**
   ```java
   public void reset() {
       contador = total = soma = 0;  // ✅ Claro que está resetando
   }
   ```

6. ✅ **Prefira declaração individual quando valores são diferentes**
   ```java
   // ❌ Valores diferentes
   // int a = b = c = 10;  // Confuso se vão mudar depois
   
   // ✅ Valores individuais
   int a = 10;
   int b = 20;
   int c = 30;
   ```

7. ✅ **Evite atribuições múltiplas complexas**
   ```java
   // ❌ Complexo demais
   // x = y = z = metodoDemorado() + calcular() * 2;
   
   // ✅ Mais claro
   int valor = metodoDemorado() + calcular() * 2;
   x = y = z = valor;
   ```

8. ✅ **Use com tipos compatíveis**
   ```java
   // ✅ Tipos compatíveis (widening)
   byte b = 10;
   int i;
   long l;
   i = l = b;  // OK
   
   // ❌ Evitar com casting
   // double d = 3.14;
   // int x = (int)(byte) d;  // Confuso
   ```
