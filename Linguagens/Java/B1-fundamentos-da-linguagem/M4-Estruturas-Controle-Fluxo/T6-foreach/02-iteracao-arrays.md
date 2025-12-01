# Iteração de Arrays com for-each

## 🎯 Introdução e Definição

### Definição Conceitual

**Iteração de arrays com for-each** é o uso do **enhanced for loop** para percorrer **todos os elementos** de um array de forma **sequencial** e **automática**, sem necessidade de gerenciar índices manualmente. É a forma mais **simples** e **segura** de iterar arrays quando não se precisa do índice.

**Estrutura básica**:
```java
TipoElemento[] array = {valores};

for (TipoElemento elemento : array) {
    // Processa elemento
}
```

**Analogia**: É como pegar **cada carta** de um baralho empilhado - você pega a **próxima carta** automaticamente, sem contar "primeira, segunda, terceira..." manualmente.

**Exemplo fundamental**:
```java
int[] numeros = {10, 20, 30, 40, 50};

// for-each: acessa cada elemento automaticamente
for (int numero : numeros) {
    System.out.println(numero);
}

// Saída:
// 10
// 20
// 30
// 40
// 50
```

**Importância**:
- ✅ **Simplicidade**: Sintaxe mais limpa para arrays
- ✅ **Segurança**: Sem erros de ArrayIndexOutOfBoundsException
- ✅ **Legibilidade**: Código mais expressivo
- ✅ **Manutenção**: Menos propenso a bugs de índice
- ⚠️ **Read-only**: Ideal para leitura, limitado para modificação

---

## 📋 Sumário Conceitual

### Tipos de Arrays Suportados

**1. Arrays de primitivos**: byte, short, int, long, float, double, char, boolean
**2. Arrays de objetos**: String, wrappers, classes customizadas
**3. Arrays multidimensionais**: Arrays de arrays

**Sintaxe geral**:
```java
for (TipoPrimitivo elemento : arrayPrimitivos) { }
for (TipoObjeto elemento : arrayObjetos) { }
for (TipoArray[] subArray : arrayMultidimensional) { }
```

---

## 🧠 Fundamentos Teóricos

### 1. Arrays de Tipos Primitivos

**Array de int**:
```java
int[] numeros = {1, 2, 3, 4, 5};

for (int n : numeros) {
    System.out.print(n + " ");
}
// Saída: 1 2 3 4 5
```

**Array de double**:
```java
double[] precos = {10.99, 25.50, 8.75, 15.20};

for (double preco : precos) {
    System.out.printf("R$ %.2f%n", preco);
}

// Saída:
// R$ 10.99
// R$ 25.50
// R$ 8.75
// R$ 15.20
```

**Array de char**:
```java
char[] vogais = {'a', 'e', 'i', 'o', 'u'};

for (char vogal : vogais) {
    System.out.print(vogal + " ");
}
// Saída: a e i o u
```

**Array de boolean**:
```java
boolean[] flags = {true, false, true, true, false};

for (boolean flag : flags) {
    System.out.println("Flag: " + flag);
}

// Saída:
// Flag: true
// Flag: false
// Flag: true
// Flag: true
// Flag: false
```

### 2. Arrays de Objetos (String)

**Array de String**:
```java
String[] nomes = {"Ana", "Bruno", "Carlos", "Diana"};

for (String nome : nomes) {
    System.out.println("Olá, " + nome + "!");
}

// Saída:
// Olá, Ana!
// Olá, Bruno!
// Olá, Carlos!
// Olá, Diana!
```

**Processamento de Strings**:
```java
String[] palavras = {"java", "python", "javascript", "rust"};

for (String palavra : palavras) {
    System.out.println(palavra.toUpperCase());
}

// Saída:
// JAVA
// PYTHON
// JAVASCRIPT
// RUST
```

### 3. Arrays de Wrappers

**Array de Integer**:
```java
Integer[] valores = {10, 20, 30, 40, 50};

// Autoboxing: Integer → int
for (int valor : valores) {
    System.out.println(valor);
}

// Ou manter como Integer
for (Integer valor : valores) {
    System.out.println(valor);
}
```

**Array de Double**:
```java
Double[] temperaturas = {25.5, 30.2, 28.7, 26.1};

for (Double temp : temperaturas) {
    System.out.printf("%.1f°C%n", temp);
}
```

### 4. Arrays de Objetos Customizados

**Classe Pessoa**:
```java
class Pessoa {
    String nome;
    int idade;
    
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    @Override
    public String toString() {
        return nome + " (" + idade + " anos)";
    }
}

// Array de Pessoa
Pessoa[] pessoas = {
    new Pessoa("Ana", 25),
    new Pessoa("Bruno", 30),
    new Pessoa("Carlos", 28)
};

for (Pessoa pessoa : pessoas) {
    System.out.println(pessoa);
}

// Saída:
// Ana (25 anos)
// Bruno (30 anos)
// Carlos (28 anos)
```

**Acessar propriedades**:
```java
for (Pessoa pessoa : pessoas) {
    if (pessoa.idade >= 30) {
        System.out.println(pessoa.nome + " tem 30 anos ou mais");
    }
}
// Saída: Bruno tem 30 anos ou mais
```

### 5. Arrays Multidimensionais (Matrizes)

**Matriz 2D**:
```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// for-each externo: itera sobre linhas (arrays de int)
for (int[] linha : matriz) {
    // for-each interno: itera sobre elementos da linha
    for (int elemento : linha) {
        System.out.print(elemento + " ");
    }
    System.out.println();
}

// Saída:
// 1 2 3
// 4 5 6
// 7 8 9
```

**Matriz de Strings**:
```java
String[][] tabela = {
    {"Nome", "Idade", "Cidade"},
    {"Ana", "25", "SP"},
    {"Bruno", "30", "RJ"}
};

for (String[] linha : tabela) {
    for (String celula : linha) {
        System.out.print(celula + "\t");
    }
    System.out.println();
}

// Saída:
// Nome    Idade   Cidade
// Ana     25      SP
// Bruno   30      RJ
```

**Array 3D**:
```java
int[][][] cubo = {
    {{1, 2}, {3, 4}},
    {{5, 6}, {7, 8}}
};

for (int[][] plano : cubo) {
    for (int[] linha : plano) {
        for (int elemento : linha) {
            System.out.print(elemento + " ");
        }
        System.out.println();
    }
    System.out.println("---");
}

// Saída:
// 1 2
// 3 4
// ---
// 5 6
// 7 8
// ---
```

### 6. Operações Comuns com Arrays

#### **Soma de Elementos**

```java
int[] numeros = {10, 20, 30, 40, 50};
int soma = 0;

for (int numero : numeros) {
    soma += numero;
}

System.out.println("Soma: " + soma);
// Saída: Soma: 150
```

#### **Média de Valores**

```java
double[] notas = {7.5, 8.0, 6.5, 9.0, 7.0};
double soma = 0;

for (double nota : notas) {
    soma += nota;
}

double media = soma / notas.length;
System.out.printf("Média: %.2f%n", media);
// Saída: Média: 7.60
```

#### **Encontrar Máximo**

```java
int[] valores = {15, 42, 8, 56, 23, 11};
int maximo = Integer.MIN_VALUE;

for (int valor : valores) {
    if (valor > maximo) {
        maximo = valor;
    }
}

System.out.println("Máximo: " + maximo);
// Saída: Máximo: 56
```

#### **Encontrar Mínimo**

```java
int[] valores = {15, 42, 8, 56, 23, 11};
int minimo = Integer.MAX_VALUE;

for (int valor : valores) {
    if (valor < minimo) {
        minimo = valor;
    }
}

System.out.println("Mínimo: " + minimo);
// Saída: Mínimo: 8
```

#### **Contar Ocorrências**

```java
int[] numeros = {1, 2, 3, 2, 4, 2, 5, 2};
int alvo = 2;
int contador = 0;

for (int numero : numeros) {
    if (numero == alvo) {
        contador++;
    }
}

System.out.println("Ocorrências de " + alvo + ": " + contador);
// Saída: Ocorrências de 2: 4
```

#### **Verificar se Contém**

```java
String[] frutas = {"Maçã", "Banana", "Laranja", "Uva"};
String procurada = "Banana";
boolean encontrada = false;

for (String fruta : frutas) {
    if (fruta.equals(procurada)) {
        encontrada = true;
        break;  // Sai assim que encontra
    }
}

System.out.println(procurada + (encontrada ? " encontrada" : " não encontrada"));
// Saída: Banana encontrada
```

#### **Filtrar Valores**

```java
int[] numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
int contador = 0;

// Contar pares
for (int numero : numeros) {
    if (numero % 2 == 0) {
        contador++;
    }
}

System.out.println("Números pares: " + contador);
// Saída: Números pares: 5
```

### 7. Modificação de Arrays

#### **⚠️ Arrays de Primitivos: NÃO Modifica Original**

```java
int[] numeros = {1, 2, 3, 4, 5};

// ❌ Não funciona: modifica CÓPIA local
for (int numero : numeros) {
    numero = numero * 2;  // Altera cópia, não o array
}

System.out.println(Arrays.toString(numeros));
// Saída: [1, 2, 3, 4, 5]  (array original NÃO muda)

// ✅ Para modificar primitivos, use for tradicional
for (int i = 0; i < numeros.length; i++) {
    numeros[i] = numeros[i] * 2;  // Modifica array original
}

System.out.println(Arrays.toString(numeros));
// Saída: [2, 4, 6, 8, 10]
```

#### **✅ Arrays de Objetos: PODE Modificar Propriedades**

```java
class Produto {
    String nome;
    double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
}

Produto[] produtos = {
    new Produto("Notebook", 3000.0),
    new Produto("Mouse", 50.0),
    new Produto("Teclado", 150.0)
};

// ✅ Funciona: modifica propriedades dos objetos
for (Produto produto : produtos) {
    produto.preco = produto.preco * 1.1;  // Aumenta 10%
}

for (Produto produto : produtos) {
    System.out.printf("%s: R$ %.2f%n", produto.nome, produto.preco);
}

// Saída:
// Notebook: R$ 3300.00
// Mouse: R$ 55.00
// Teclado: R$ 165.00
```

### 8. Arrays Vazios e Null

**Array vazio** (tamanho 0):
```java
int[] vazio = {};

// for-each NÃO executa (array vazio)
for (int n : vazio) {
    System.out.println(n);  // Nunca executado
}

System.out.println("Array vazio processado");
// Saída: Array vazio processado
```

**Array null** (NullPointerException):
```java
int[] numeros = null;

// ❌ ERRO: NullPointerException
for (int n : numeros) {  // NPE aqui!
    System.out.println(n);
}

// ✅ Verificar null antes
if (numeros != null) {
    for (int n : numeros) {
        System.out.println(n);
    }
} else {
    System.out.println("Array é null");
}
```

### 9. Break e Continue em Arrays

**Break: Sair do loop**:
```java
int[] numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

for (int numero : numeros) {
    if (numero > 5) {
        break;  // SAI do loop quando > 5
    }
    System.out.print(numero + " ");
}
// Saída: 1 2 3 4 5
```

**Continue: Pular iteração**:
```java
int[] numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

for (int numero : numeros) {
    if (numero % 2 == 0) {
        continue;  // PULA pares
    }
    System.out.print(numero + " ");
}
// Saída: 1 3 5 7 9
```

### 10. Exemplos Práticos Completos

#### **Sistema de Notas**

```java
class Aluno {
    String nome;
    double[] notas;
    
    Aluno(String nome, double[] notas) {
        this.nome = nome;
        this.notas = notas;
    }
    
    double calcularMedia() {
        double soma = 0;
        for (double nota : notas) {
            soma += nota;
        }
        return soma / notas.length;
    }
    
    boolean aprovado() {
        return calcularMedia() >= 7.0;
    }
}

Aluno[] turma = {
    new Aluno("Ana", new double[]{8.0, 7.5, 9.0}),
    new Aluno("Bruno", new double[]{6.0, 5.5, 6.5}),
    new Aluno("Carlos", new double[]{9.5, 10.0, 8.5})
};

System.out.println("=== BOLETIM ===");
for (Aluno aluno : turma) {
    double media = aluno.calcularMedia();
    String status = aluno.aprovado() ? "APROVADO" : "REPROVADO";
    System.out.printf("%s - Média: %.2f - %s%n", aluno.nome, media, status);
}

// Saída:
// === BOLETIM ===
// Ana - Média: 8.17 - APROVADO
// Bruno - Média: 6.00 - REPROVADO
// Carlos - Média: 9.33 - APROVADO
```

#### **Estatísticas de Temperaturas**

```java
double[] temperaturas = {25.5, 28.3, 26.7, 30.1, 27.9, 29.5, 26.2};

double soma = 0;
double max = Double.MIN_VALUE;
double min = Double.MAX_VALUE;

for (double temp : temperaturas) {
    soma += temp;
    if (temp > max) max = temp;
    if (temp < min) min = temp;
}

double media = soma / temperaturas.length;

System.out.println("=== ESTATÍSTICAS DE TEMPERATURA ===");
System.out.printf("Média: %.2f°C%n", media);
System.out.printf("Máxima: %.2f°C%n", max);
System.out.printf("Mínima: %.2f°C%n", min);

// Saída:
// === ESTATÍSTICAS DE TEMPERATURA ===
// Média: 27.74°C
// Máxima: 30.10°C
// Mínima: 25.50°C
```

#### **Processamento de Estoque**

```java
class Produto {
    String codigo;
    String nome;
    int quantidade;
    double preco;
    
    Produto(String codigo, String nome, int quantidade, double preco) {
        this.codigo = codigo;
        this.nome = nome;
        this.quantidade = quantidade;
        this.preco = preco;
    }
    
    double valorTotal() {
        return quantidade * preco;
    }
}

Produto[] estoque = {
    new Produto("001", "Notebook", 5, 3000.0),
    new Produto("002", "Mouse", 50, 50.0),
    new Produto("003", "Teclado", 20, 150.0),
    new Produto("004", "Monitor", 10, 800.0)
};

double valorTotalEstoque = 0;
int produtosBaixoEstoque = 0;

System.out.println("=== RELATÓRIO DE ESTOQUE ===");
for (Produto produto : estoque) {
    System.out.printf("%s - %s: %d unidades - R$ %.2f%n",
        produto.codigo, produto.nome, produto.quantidade, produto.valorTotal());
    
    valorTotalEstoque += produto.valorTotal();
    
    if (produto.quantidade < 10) {
        produtosBaixoEstoque++;
    }
}

System.out.printf("%nValor total do estoque: R$ %.2f%n", valorTotalEstoque);
System.out.printf("Produtos com estoque baixo (< 10): %d%n", produtosBaixoEstoque);

// Saída:
// === RELATÓRIO DE ESTOQUE ===
// 001 - Notebook: 5 unidades - R$ 15000.00
// 002 - Mouse: 50 unidades - R$ 2500.00
// 003 - Teclado: 20 unidades - R$ 3000.00
// 004 - Monitor: 10 unidades - R$ 8000.00
//
// Valor total do estoque: R$ 28500.00
// Produtos com estoque baixo (< 10): 1
```

---

## 🔍 Análise Conceitual Profunda

### Por Que for-each para Arrays?

**Vantagens**:
1. **Código mais limpo**: Sem índices `i`, `j`, `k`
2. **Menos erros**: Sem `ArrayIndexOutOfBoundsException`
3. **Legibilidade**: Foco no elemento, não no índice
4. **Manutenção**: Alterações no tamanho do array não afetam loop

**Comparação**:
```java
// for tradicional: verboso
for (int i = 0; i < numeros.length; i++) {
    System.out.println(numeros[i]);
}

// for-each: conciso
for (int numero : numeros) {
    System.out.println(numero);
}
```

### Limitações com Arrays

**1. Sem índice**: Não sabe posição atual
**2. Sem modificação de primitivos**: Altera cópia
**3. Unidirecional**: Apenas início → fim
**4. Sem saltos**: Não pode pular posições arbitrárias

### Performance: for vs for-each

**Arrays**: Performance **idêntica**.
- Compilador gera código equivalente
- Não há overhead adicional
- Escolha baseada em **legibilidade**, não performance

---

## 🎯 Aplicabilidade e Contextos

### 1. **Leitura de Dados**

```java
for (String dado : dados) {
    processar(dado);
}
```

### 2. **Cálculos Estatísticos**

```java
for (double valor : valores) {
    soma += valor;
}
```

### 3. **Validação de Elementos**

```java
for (int numero : numeros) {
    if (numero < 0) {
        temNegativo = true;
        break;
    }
}
```

### 4. **Transformação de Dados**

```java
for (Objeto obj : objetos) {
    obj.transformar();
}
```

### 5. **Busca em Arrays**

```java
for (String item : itens) {
    if (item.equals(procurado)) {
        encontrado = true;
        break;
    }
}
```

### 6. **Exibição de Relatórios**

```java
for (Produto produto : produtos) {
    exibirProduto(produto);
}
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Modificar Array de Primitivos (Não Funciona)**

```java
// ❌ Não modifica array original
int[] arr = {1, 2, 3};
for (int n : arr) {
    n = n * 2;  // Modifica cópia
}
// arr ainda é [1, 2, 3]

// ✅ Use for tradicional
for (int i = 0; i < arr.length; i++) {
    arr[i] = arr[i] * 2;
}
```

### 2. **Array Null (NullPointerException)**

```java
// ❌ NPE se array for null
int[] arr = null;
for (int n : arr) {  // NPE!
    System.out.println(n);
}

// ✅ Verifique null
if (arr != null) {
    for (int n : arr) {
        System.out.println(n);
    }
}
```

### 3. **Sem Acesso ao Índice**

```java
// ❌ Não há como saber o índice
for (String nome : nomes) {
    // Qual é o índice atual? (desconhecido)
}

// ✅ Use for tradicional se precisa de índice
for (int i = 0; i < nomes.length; i++) {
    System.out.println("Índice " + i + ": " + nomes[i]);
}
```

### 4. **Tipo Incompatível**

```java
// ❌ Tipo incompatível
String[] palavras = {"A", "B"};
for (int palavra : palavras) {  // ERRO: String não é int
    System.out.println(palavra);
}

// ✅ Tipo correto
for (String palavra : palavras) {
    System.out.println(palavra);
}
```

### 5. **Iterar Múltiplos Arrays Simultaneamente**

```java
String[] nomes = {"Ana", "Bruno", "Carlos"};
int[] idades = {25, 30, 28};

// ❌ Não funciona: for-each itera um array por vez
for (String nome : nomes) {
    // Como acessar idade correspondente? (impossível)
}

// ✅ Use for tradicional
for (int i = 0; i < nomes.length; i++) {
    System.out.println(nomes[i] + " tem " + idades[i] + " anos");
}
```

---

## 🔗 Interconexões Conceituais

- **for tradicional**: Mais versátil, permite índice
- **Arrays**: Estrutura de dados compatível
- **Arrays.toString()**: Exibir conteúdo do array
- **Autoboxing**: Conversão primitivo ↔ wrapper
- **break/continue**: Controle de fluxo
- **Collections**: Alternativa aos arrays
- **Streams (Java 8+)**: Processamento funcional

---

## 🚀 Boas Práticas

### 1. ✅ Prefira for-each para Leitura

```java
// ✅ for-each para ler
for (int numero : numeros) {
    System.out.println(numero);
}
```

### 2. ✅ Use for Tradicional para Modificar Primitivos

```java
// ✅ for tradicional para modificar
for (int i = 0; i < arr.length; i++) {
    arr[i] = arr[i] * 2;
}
```

### 3. ✅ Verifique Null Antes de Iterar

```java
// ✅ Previne NPE
if (array != null) {
    for (Tipo elemento : array) {
        processar(elemento);
    }
}
```

### 4. ✅ Nomes Descritivos no Singular

```java
// ✅ Nome descritivo
for (Produto produto : produtos) {
    processar(produto);
}
```

### 5. ✅ Use break para Busca Eficiente

```java
// ✅ break assim que encontra
for (String nome : nomes) {
    if (nome.equals(procurado)) {
        encontrado = true;
        break;
    }
}
```

### 6. ✅ Extraia Lógica Complexa

```java
// ✅ Método para lógica complexa
for (Objeto obj : objetos) {
    processarObjeto(obj);
}
```

### 7. ✅ Use for-each para Matrizes Simples

```java
// ✅ for-each para iterar matriz
for (int[] linha : matriz) {
    for (int elemento : linha) {
        System.out.print(elemento + " ");
    }
    System.out.println();
}
```

### 8. ✅ Considere Streams (Java 8+)

```java
// ✅ Stream para operações funcionais
Arrays.stream(numeros)
    .filter(n -> n > 10)
    .forEach(System.out::println);
```

### 9. ✅ Documente Por Que Não Usou for-each

```java
// Usando for tradicional porque preciso modificar array
for (int i = 0; i < arr.length; i++) {
    arr[i] = arr[i] * 2;
}
```

### 10. ✅ Evite Contador Manual

```java
// ❌ Contador manual (ruim)
int i = 0;
for (String nome : nomes) {
    System.out.println(i + ": " + nome);
    i++;
}

// ✅ Use for tradicional
for (int i = 0; i < nomes.length; i++) {
    System.out.println(i + ": " + nomes[i]);
}
```

---

## 📚 Resumo

**for-each** é a forma mais **simples** e **segura** de iterar **todos os elementos** de um **array** sem gerenciar índices. Sintaxe: `for (Tipo elemento : array) { }`. Funciona com **arrays de primitivos**, **arrays de objetos**, e **arrays multidimensionais**. **Vantagens**: código **limpo**, **menos erros** (sem ArrayIndexOutOfBoundsException), **foco no elemento**. **Limitações**: **sem índice**, **não modifica primitivos** (altera cópia), **unidirecional** (início → fim). Use for-each para **leitura** e **processamento simples**; use **for tradicional** quando precisar **modificar array de primitivos**, **acessar índice**, ou **iterar múltiplos arrays simultaneamente**. **SEMPRE verifique null** antes de iterar (evita NullPointerException). for-each **pode modificar propriedades** de objetos (via referência), mas **não substitui elementos** primitivos. **Performance idêntica** ao for tradicional em arrays. Suporta **break** e **continue**. Prefira **nomes descritivos no singular** para variável de iteração.

