# Módulo 2: Fundamentos de Programação em Java

## 1. Tipos de Dados e Variáveis

### Tipos Primitivos
Java possui oito tipos primitivos que são categorizados em quatro grupos:


### Declaração de Variáveis
Para declarar uma variável em Java, especifique o tipo seguido pelo nome da variável:

```java
int idade;
double preco;
char letra;
boolean estaLogado;
```

## 2. Wrappers e Métodos de Conversão de Tipos

Java fornece classes wrapper para cada tipo primitivo. Estas classes encapsulam um valor primitivo em um objeto.

- `Byte`, `Short`, `Integer`, `Long`, `Float`, `Double`, `Character`, `Boolean`

### Conversão Entre Tipos (Casting)
A conversão entre diferentes tipos de dados pode ser feita explicitamente (casting) ou implicitamente.

#### Conversões Implícitas (Widening Casting)
Java executa automaticamente a conversão quando passamos de um tipo menor para um maior:

```java
int meuInt = 9;
double meuDouble = meuInt;  // Conversão automática de int para double
```

#### Conversões Explícitas (Narrowing Casting)
Quando estamos convertendo um tipo maior para um menor, é necessário fazer um casting explícito:

```java
double meuDouble = 9.78;
int meuInt = (int) meuDouble; // Casting explícito de double para int
```

### Tabelas de Conversão Entre Tipos

**Tabela 1**

| De/Para | byte  | short | int   | long  | float | double | char  |
|---------|-------|-------|-------|-------|-------|--------|-------|
| byte    | -     | Auto  | Auto  | Auto  | Auto  | Auto   | Cast  |
| short   | Cast  | -     | Auto  | Auto  | Auto  | Auto   | Cast  |
| int     | Cast  | Cast  | -     | Auto  | Auto  | Auto   | Cast  |
| long    | Cast  | Cast  | Cast  | -     | Auto  | Auto   | Cast  |
| float   | Cast  | Cast  | Cast  | Cast  | -     | Auto   | Cast  |
| double  | Cast  | Cast  | Cast  | Cast  | Cast  | -      | Cast  |
| char    | Cast  | Auto  | Auto  | Auto  | Auto  | Auto   | -     |

- **Auto:** Conversão implícita
- **Cast:** Necessário casting explícito.

**Tabela 2**

| De/Para  | Byte         | Short        | Integer       | Long         | Float         | Double        | Character    |
|----------|--------------|--------------|---------------|--------------|---------------|---------------|--------------|
| Byte     | -            | Short.parseShort(Byte.toString(b)) | Integer.parseInt(Byte.toString(b)) | Long.parseLong(Byte.toString(b)) | Float.parseFloat(Byte.toString(b)) | Double.parseDouble(Byte.toString(b)) | Character.forDigit(b, 10) |
| Short    | Byte.parseByte(Short.toString(s)) | -            | Integer.parseInt(Short.toString(s)) | Long.parseLong(Short.toString(s)) | Float.parseFloat(Short.toString(s)) | Double.parseDouble(Short.toString(s)) | Character.forDigit(s, 10) |
| Integer  | Byte.parseByte(Integer.toString(i)) | Short.parseShort(Integer.toString(i)) | -             | Long.parseLong(Integer.toString(i)) | Float.parseFloat(Integer.toString(i)) | Double.parseDouble(Integer.toString(i)) | Character.forDigit(i, 10) |
| Long     | Byte.parseByte(Long.toString(l)) | Short.parseShort(Long.toString(l)) | Integer.parseInt(Long.toString(l)) | -            | Float.parseFloat(Long.toString(l)) | Double.parseDouble(Long.toString(l)) | Character.forDigit((int)l, 10) |
| Float    | Byte.parseByte(Float.toString(f)) | Short.parseShort(Float.toString(f)) | Integer.parseInt(Float.toString(f)) | Long.parseLong(Float.toString(f)) | -             | Double.parseDouble(Float.toString(f)) | Character.forDigit((int)f, 10) |
| Double   | Byte.parseByte(Double.toString(d)) | Short.parseShort(Double.toString(d)) | Integer.parseInt(Double.toString(d)) | Long.parseLong(Double.toString(d)) | Float.parseFloat(Double.toString(d)) | -             | Character.forDigit((int)d, 10) |
| Character| Byte.parseByte(Character.toString(c)) | Short.parseShort(Character.toString(c)) | Integer.parseInt(Character.toString(c)) | Long.parseLong(Character.toString(c)) | Float.parseFloat(Character.toString(c)) | Double.parseDouble(Character.toString(c)) | -            |

- **Nota 1:** Esta tabela pressupõe que a conversão é possível e que os valores estão dentro dos limites dos tipos de destino. Caso contrário, exceções podem ser lançadas.
- **Nota 2:** Para `Character`, a conversão é realizada assumindo que o caractere representa um dígito numérico. Se não for o caso, as conversões não funcionarão conforme o esperado.

### Exemplo de Conversão
```java
// De int para double (Widening Casting)
int meuInt = 100;
double meuDouble = meuInt;

// De double para int (Narrowing Casting)
double outroDouble = 9.78;
int outroInt = (int) outroDouble;
```

### Métodos de Conversão Utilizando Wrappers
Os wrappers fornecem métodos úteis para conversão, como `parseInt`, `valueOf`, entre outros:

```java
String numeroStr = "10";
int numeroInt = Integer.parseInt(numeroStr);
double numeroDouble = Double.parseDouble(numeroStr);
```

### Diferença entre parse e valueOf

A diferença entre os métodos `parseXxx` e `valueOf` nas classes wrapper em Java, como `Integer`, `Double`, etc., reside principalmente no tipo de retorno e um pouco no propósito de uso.

1. **Método `parseXxx`:**
   - **Tipo de Retorno:** Retorna o tipo primitivo correspondente. Por exemplo, `Integer.parseInt("123")` retorna um `int`.
   - **Uso:** Utilizado quando você precisa do valor primitivo. É comum em situações onde a eficiência é uma preocupação, já que trabalhar diretamente com tipos primitivos evita a sobrecarga de objetos.
   - **Exemplo:**
     ```java
     int n = Integer.parseInt("123");
     ```

2. **Método `valueOf`:**
   - **Tipo de Retorno:** Retorna uma instância do objeto wrapper correspondente. Por exemplo, `Integer.valueOf("123")` retorna uma instância de `Integer`.
   - **Uso:** Utilizado quando você precisa de um objeto wrapper. É especialmente útil em coleções genéricas, como `ArrayList<Integer>`, onde tipos primitivos não podem ser usados.
   - **Exemplo:**
     ```java
     Integer n = Integer.valueOf("123");
     ```

Em resumo, a escolha entre `parseXxx` e `valueOf` depende de se você precisa de um tipo primitivo ou de um objeto wrapper. Ambos convertem strings em valores numéricos, mas diferem no tipo de dado que retornam.
