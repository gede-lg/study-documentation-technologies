# Expressões de Atribuição como Valores

## 🎯 Introdução e Definição

### Definição Conceitual

Em Java, **atribuição é uma expressão**, não apenas uma instrução. Isso significa que **uma operação de atribuição produz um valor** (o valor atribuído), que pode ser usado em outras expressões, condições, chamadas de métodos, ou outras atribuições.

**Conceito fundamental**:
```java
resultado = (expressao_atribuicao)
```

A expressão `x = 10` não apenas atribui 10 a `x`, mas também **retorna 10**, que pode ser usado em outros contextos.

**Características principais**:
- ✅ **Atribuição retorna valor**: O valor atribuído é retornado pela expressão
- ✅ **Uso em contextos complexos**: Pode ser usada em condições, parâmetros, etc.
- ✅ **Side effect**: Modifica variável E retorna valor simultaneamente
- ✅ **Expressão composta**: Combinar atribuição com outras operações
- ⚠️ **Pode reduzir legibilidade**: Uso excessivo torna código confuso

**Exemplo básico**:
```java
int x, y;
y = (x = 10);  // x recebe 10, expressão retorna 10, y recebe 10

System.out.println("x=" + x + ", y=" + y);  // x=10, y=10

// Uso em condicional
if ((x = 20) > 15) {  // x recebe 20, expressão retorna 20, compara 20 > 15
    System.out.println("x é maior que 15");  // Executa
}
System.out.println("x=" + x);  // x=20 (foi modificado!)
```

### Características Fundamentais

- 🔄 **Side effect**: Atribuição modifica variável (efeito colateral)
- 📋 **Retorno**: Atribuição retorna o valor atribuído
- 🎯 **Contextos múltiplos**: Uso em if, while, for, métodos, operações
- ⚠️ **Legibilidade**: Pode tornar código menos claro
- 💡 **Idiomático**: Comum em certas situações (leitura de streams, parsing)

---

## 📋 Sumário Conceitual

### Atribuição como Expressão

```java
// Atribuição retorna valor
int x = 10;        // Atribui 10 a x, retorna 10
int y = (x = 20);  // Atribui 20 a x, retorna 20, atribui 20 a y

// Uso em outras expressões
int z = (x = 5) + 3;  // x = 5 (retorna 5), depois 5 + 3 = 8
System.out.println("x=" + x + ", z=" + z);  // x=5, z=8
```

**Tabela de retornos**:

| Expressão | Valor Retornado | Efeito Colateral |
|-----------|-----------------|------------------|
| `x = 10` | `10` | `x` agora é `10` |
| `y = x + 5` | `x + 5` | `y` recebe `x + 5` |
| `a += 3` | `a + 3` | `a` incrementado em `3` |
| `b++` | valor **anterior** de `b` | `b` incrementado |
| `++b` | valor **novo** de `b` | `b` incrementado |

---

## 🧠 Fundamentos Teóricos

### 1. Atribuição em Condicionais (if/while)

**Uso em if**:
```java
int valor;
if ((valor = getValor()) > 0) {
    // valor foi atribuído E testado
    System.out.println("Valor positivo: " + valor);
}

// Equivalente mais verboso:
int valor2 = getValor();
if (valor2 > 0) {
    System.out.println("Valor positivo: " + valor2);
}
```

**Uso em while (padrão idiomático)**:
```java
Scanner scanner = new Scanner(System.in);
String linha;

// Lê até encontrar linha vazia
while ((linha = scanner.nextLine()).length() > 0) {
    // linha foi atribuída E testado tamanho
    System.out.println("Lido: " + linha);
}

// Equivalente mais verboso:
while (true) {
    linha = scanner.nextLine();
    if (linha.length() == 0) break;
    System.out.println("Lido: " + linha);
}
```

**⚠️ Cuidado: atribuição vs comparação**:
```java
int x = 10;

// ❌ Em C/C++, isso funciona (perigoso!):
// if (x = 5) { ... }  // Atribui 5 a x, testa 5 (true)

// ✅ Em Java, isso dá erro:
// if (x = 5) { ... }  // ❌ Erro: incompatible types (int não é boolean)

// ✅ Correto em Java (deve retornar boolean):
if ((x = 5) > 0) {  // OK: retorna boolean
    System.out.println("x=" + x);  // x=5
}
```

### 2. Atribuição em Parâmetros de Métodos

**Passar valor E atribuir**:
```java
public class AtribuicaoParametro {
    public void processar() {
        int valor;
        imprimir(valor = 100);  // Atribui 100 a valor, passa 100 ao método
        System.out.println("Valor após método: " + valor);  // 100
    }
    
    public void imprimir(int num) {
        System.out.println("Recebido: " + num);
    }
}

// Saída:
// Recebido: 100
// Valor após método: 100
```

**Uso em chamadas encadeadas**:
```java
String texto;
System.out.println((texto = "Olá").toUpperCase());
// Atribui "Olá" a texto, retorna "Olá", chama toUpperCase()
// Saída: OLÁ

System.out.println("Texto: " + texto);  // Olá (foi atribuído)
```

### 3. Atribuição em Expressões Aritméticas

**Combinar atribuição com operações**:
```java
int x = 10, y;

// Atribuir E usar em cálculo
int resultado = (y = 5) * 2;  // y = 5, retorna 5, 5 * 2 = 10
System.out.println("y=" + y + ", resultado=" + resultado);
// y=5, resultado=10

// Múltiplas atribuições em expressão
int a, b, c;
int soma = (a = 10) + (b = 20) + (c = 30);
// a=10, retorna 10
// b=20, retorna 20
// c=30, retorna 30
// 10 + 20 + 30 = 60
System.out.println("soma=" + soma);  // 60
```

### 4. Atribuição em Estruturas de Repetição

**for com atribuição**:
```java
int i;
for (i = 0; i < 5; i++) {
    System.out.println(i);
}
System.out.println("i final: " + i);  // 5

// Atribuição dentro do corpo
int valor = 10;
for (int j = 0; (valor = valor * 2) < 1000; j++) {
    System.out.println("j=" + j + ", valor=" + valor);
}
// j=0, valor=20
// j=1, valor=40
// j=2, valor=80
// j=3, valor=160
// j=4, valor=320
// j=5, valor=640
```

**do-while com atribuição**:
```java
int numero;
do {
    numero = (int)(Math.random() * 10);
    System.out.println("Tentativa: " + numero);
} while (numero != 5);  // Continua até numero ser 5
```

### 5. Atribuição com Operador Ternário

**Expressão ternária com atribuição**:
```java
int x = 10, y;

// Atribuir com base em condição
String resultado = (y = x > 5 ? 100 : 200) > 150 ? "Alto" : "Baixo";
// x > 5 ? verdadeiro → y = 100
// 100 > 150 ? falso → "Baixo"
System.out.println("y=" + y + ", resultado=" + resultado);
// y=100, resultado=Baixo

// Atribuição condicional
int a = 5, b;
int max = (b = a) > 10 ? b : (b = 20);
// b = a → b = 5, retorna 5
// 5 > 10 ? falso → b = 20
System.out.println("b=" + b + ", max=" + max);  // b=20, max=20
```

### 6. Atribuição em Arrays

**Atribuir e usar elemento**:
```java
int[] array = new int[5];
int indice = 0;

// Atribuir e usar valor
System.out.println((array[indice++] = 100));
// Atribui 100 a array[0], retorna 100, imprime 100
// indice incrementado para 1

System.out.println("array[0]=" + array[0] + ", indice=" + indice);
// array[0]=100, indice=1
```

### 7. Atribuição com Short-circuit

**Combinação com operadores lógicos**:
```java
int x = 10, y = 20, z;

// AND (&&) com atribuição
if ((z = x) > 5 && (z = y) > 15) {
    System.out.println("Ambos passaram");
}
System.out.println("z=" + z);  // z=20 (segunda atribuição executada)

// Se primeira condição fosse falsa:
int a = 3, b = 20, c;
if ((c = a) > 5 && (c = b) > 15) {  // c=a (3) > 5 é falso
    System.out.println("Ambos passaram");
}
System.out.println("c=" + c);  // c=3 (segunda atribuição NÃO executada)
```

### 8. Padrão Idiomático: Leitura de Streams

**Ler e testar em uma linha**:
```java
BufferedReader reader = new BufferedReader(new FileReader("arquivo.txt"));
String linha;

// Padrão comum: ler enquanto não for null
while ((linha = reader.readLine()) != null) {
    // linha foi lida E testada
    System.out.println(linha);
}
reader.close();
```

**Parsing com Scanner**:
```java
Scanner scanner = new Scanner(System.in);
int numero;

// Ler e validar
while (scanner.hasNextInt() && (numero = scanner.nextInt()) >= 0) {
    // numero foi lido E validado
    System.out.println("Número válido: " + numero);
}
```

### 9. Atribuição em Switch Expressions (Java 14+)

**Switch como expressão retorna valor**:
```java
int dia = 3;
String tipo = switch (dia) {
    case 1, 7 -> "Fim de semana";
    case 2, 3, 4, 5, 6 -> "Dia útil";
    default -> "Inválido";
};
System.out.println(tipo);  // "Dia útil"

// Com atribuição interna
int valor;
String categoria = switch (valor = 75) {  // Atribui 75 a valor
    case 0 -> "Zero";
    case 1, 2, 3, 4, 5 -> "Baixo";
    default -> valor > 50 ? "Alto" : "Médio";
};
System.out.println("valor=" + valor + ", categoria=" + categoria);
// valor=75, categoria=Alto
```

### 10. Atribuição com Métodos que Retornam this

**Fluent Interface (method chaining)**:
```java
public class Builder {
    private String nome;
    private int idade;
    
    public Builder setNome(String nome) {
        this.nome = nome;
        return this;  // Retorna this para encadeamento
    }
    
    public Builder setIdade(int idade) {
        this.idade = idade;
        return this;
    }
    
    public void exemplo() {
        Builder builder;
        // Atribuir e chamar método encadeado
        (builder = new Builder()).setNome("João").setIdade(25);
        System.out.println("Nome: " + builder.nome + ", Idade: " + builder.idade);
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Side Effects (Efeitos Colaterais)

**Atribuição tem side effect**:
```java
int x = 10;
int y = (x = 20) + 5;
// Side effect: x mudou de 10 para 20
// Valor retornado: 20 + 5 = 25

System.out.println("x=" + x + ", y=" + y);  // x=20, y=25
```

**⚠️ Ordem de avaliação importa**:
```java
int a = 1, b = 2, c = 3;
int resultado = (a = b) + (b = c);
// 1. a = b → a = 2, retorna 2
// 2. b = c → b = 3, retorna 3
// 3. 2 + 3 = 5
System.out.println("a=" + a + ", b=" + b + ", resultado=" + resultado);
// a=2, b=3, resultado=5
```

### Diferença: Atribuição vs Comparação em Condicionais

**Java previne bugs comuns**:
```java
// C/C++ permite (perigoso!):
// int x = 10;
// if (x = 5) { }  // Atribui 5 a x, testa 5 (não-zero = true)

// Java exige boolean:
int x = 10;
// if (x = 5) { }  // ❌ Erro: incompatible types: int cannot be converted to boolean

// Deve retornar boolean explicitamente:
if ((x = 5) > 0) {  // ✅ OK: (x = 5) retorna 5, 5 > 0 retorna true
    System.out.println("x=" + x);  // x=5
}

// Com boolean:
boolean flag;
if (flag = true) {  // ✅ OK (mas confuso! Preferir: flag = true; if (flag) ...)
    System.out.println("Flag é true");
}
```

### Precedência de Atribuição

**Atribuição tem baixa precedência**:
```java
int x, y;
y = x = 10 + 5;
// Execução:
// 1. 10 + 5 = 15 (+ tem maior precedência)
// 2. x = 15
// 3. y = 15

int a, b, c;
c = (a = 5) * (b = 3);
// 1. a = 5, retorna 5
// 2. b = 3, retorna 3
// 3. 5 * 3 = 15
// 4. c = 15
System.out.println("a=" + a + ", b=" + b + ", c=" + c);
// a=5, b=3, c=15
```

### Atribuição Composta também Retorna Valor

```java
int x = 10;
int y = (x += 5);  // x += 5 → x = 15, retorna 15, y = 15
System.out.println("x=" + x + ", y=" + y);  // x=15, y=15

// Em expressão complexa
int a = 10, b;
int resultado = (a += 5) * 2;  // a = 15, retorna 15, 15 * 2 = 30
System.out.println("a=" + a + ", resultado=" + resultado);
// a=15, resultado=30
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Leitura de Arquivos

```java
public class LeituraArquivo {
    public void lerArquivo() throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader("dados.txt"));
        String linha;
        
        // Padrão idiomático: ler e testar
        while ((linha = reader.readLine()) != null) {
            System.out.println(linha);
        }
        reader.close();
    }
}
```

### Caso 2: Parsing e Validação

```java
public class Parser {
    public void parsear() {
        Scanner scanner = new Scanner(System.in);
        int numero;
        
        System.out.println("Digite números positivos (negativo para sair):");
        while (scanner.hasNextInt() && (numero = scanner.nextInt()) >= 0) {
            System.out.println("Processando: " + numero);
        }
    }
}
```

### Caso 3: Inicialização e Uso Imediato

```java
public class Inicializacao {
    public void exemplo() {
        int valor;
        System.out.println((valor = calcular()) > 100 ? "Alto" : "Baixo");
        // valor foi atribuído E usado
        System.out.println("Valor calculado: " + valor);
    }
    
    private int calcular() {
        return 150;
    }
}
```

### Caso 4: Atribuição em Retorno de Métodos

```java
public class AtribuicaoRetorno {
    private int ultimo;
    
    public int processar(int valor) {
        return (ultimo = valor) * 2;
        // Atribui valor a ultimo, retorna valor * 2
    }
    
    public void exemplo() {
        int resultado = processar(10);
        System.out.println("Resultado: " + resultado);  // 20
        System.out.println("Último: " + ultimo);        // 10
    }
}
```

### Caso 5: Validação e Atribuição Simultâneas

```java
public class Validacao {
    private int idade;
    
    public boolean setIdadeSeValida(int valor) {
        if ((idade = valor) >= 0 && idade <= 120) {
            // idade foi atribuída E validada
            return true;
        }
        idade = 0;  // Reset se inválido
        return false;
    }
    
    public void exemplo() {
        if (setIdadeSeValida(25)) {
            System.out.println("Idade válida: " + idade);
        } else {
            System.out.println("Idade inválida");
        }
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Legibilidade

**Problema**: Código difícil de entender.
```java
// ❌ Confuso
if ((x = getValor()) > 0 && (y = calcular(x)) < 100 && (z = processar(y)) != 0) {
    // Múltiplas atribuições + testes = confuso!
}

// ✅ Mais claro
x = getValor();
if (x > 0) {
    y = calcular(x);
    if (y < 100) {
        z = processar(y);
        if (z != 0) {
            // Lógica
        }
    }
}
```

### 2. Debugging Difícil

**Problema**: Difícil identificar qual atribuição causou problema.
```java
// ❌ Difícil debugar
int resultado = (a = metodo1()) + (b = metodo2()) + (c = metodo3());

// ✅ Fácil debugar
a = metodo1();
b = metodo2();
c = metodo3();
int resultado = a + b + c;
```

### 3. Confusão com Comparação

**Problema**: Parecer erro de digitação.
```java
// Parece erro! Deveria ser == ?
if ((status = getStatus()) == OK) {
    // ...
}

// Mais claro:
status = getStatus();
if (status == OK) {
    // ...
}
```

### 4. Side Effects Inesperados

**Problema**: Modificações inesperadas.
```java
int x = 10;
int y = (x = 20) + x;  // x mudou! y = 20 + 20 = 40 (não 20 + 10)
System.out.println("x=" + x + ", y=" + y);  // x=20, y=40
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Atribuição Simples (=)**: Base - atribuição retorna valor
- **Atribuições Compostas (+=, etc.)**: Também retornam valor
- **Expressões**: Atribuição é uma expressão
- **Side Effects**: Atribuição modifica estado
- **Precedência de Operadores**: Atribuição tem baixa precedência
- **Short-circuit (&&, ||)**: Combinação com avaliação parcial
- **Streams e I/O**: Padrão idiomático de leitura

---

## 🚀 Boas Práticas

1. ✅ **Use em padrões idiomáticos (leitura de streams)**
   ```java
   while ((linha = reader.readLine()) != null) {  // ✅ Padrão aceito
       processar(linha);
   }
   ```

2. ✅ **Evite em contextos complexos**
   ```java
   // ❌ Complexo
   if ((x = calcular()) > 0 && (y = processar(x)) < 100) { }
   
   // ✅ Simples
   x = calcular();
   if (x > 0) {
       y = processar(x);
       if (y < 100) { }
   }
   ```

3. ✅ **Use parênteses para clareza**
   ```java
   if ((valor = getValor()) > 0) {  // ✅ Parênteses deixam claro
       processar(valor);
   }
   ```

4. ✅ **Documente side effects**
   ```java
   // Atribui e retorna resultado
   public int calcular(int x) {
       return (ultimo = x) * 2;  // Documentar que 'ultimo' é modificado
   }
   ```

5. ✅ **Prefira código claro a conciso**
   ```java
   // ❌ Conciso mas confuso
   resultado = (a = 10) + (b = 20);
   
   // ✅ Claro
   a = 10;
   b = 20;
   resultado = a + b;
   ```

6. ✅ **Evite atribuições em parâmetros de métodos**
   ```java
   // ❌ Confuso
   imprimir(x = 100);
   
   // ✅ Claro
   x = 100;
   imprimir(x);
   ```

7. ✅ **Cuidado com ordem de avaliação**
   ```java
   // ⚠️ Ordem importa!
   int a = 1, b = 2;
   int r = (a = b) + (b = 10);  // r = 2 + 10 = 12 (não 10 + 10)
   ```

8. ✅ **Use para inicialização + validação quando apropriado**
   ```java
   // ✅ Útil para atribuir e validar
   if ((idade = getIdade()) >= 18) {
       permitirAcesso();
   }
   ```
