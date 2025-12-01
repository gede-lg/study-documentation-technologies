# Passagem de Parâmetros por Valor

## 🎯 Introdução e Definição

**Java sempre passa parâmetros por valor** - significa que o método recebe **cópia do valor** da variável, não a variável original. Para **primitivos**, copia o valor literal (número, booleano). Para **objetos**, copia a **referência** (endereço de memória), mas ambos apontam para o **mesmo objeto**. Modificar parâmetro primitivo não afeta original; modificar **atributos** de objeto afeta original, mas **reatribuir** parâmetro não.

**Conceito central**: **Pass-by-value** = cópia de valor. Parâmetro é **variável local** que recebe **cópia** do argumento. Para primitivos, recebe cópia do número; para objetos, recebe cópia do ponteiro. Nunca é **pass-by-reference** (como C++ `&`), onde parâmetro seria **alias** da variável original. Em Java, modificar **parâmetro** nunca afeta **variável do chamador**.

**Analogia completa**:
- **Primitivo**: Fotocópia de documento (modificar cópia não altera original)
- **Objeto**: Endereço de casa (copiar endereço aponta para mesma casa)
- **Modificar atributo**: Pintar casa (todos veem mudança)
- **Reatribuir parâmetro**: Trocar endereço na sua cópia (não afeta endereço do outro)
- **Pass-by-reference (C++)**: Chave da casa (acesso direto, pode trocar porta)

**Estrutura**:
```java
// PRIMITIVOS - copia VALOR
public void modificar(int x) {
    //                  ↑ Recebe CÓPIA do valor
    x = 100;  // Modifica CÓPIA local
    // Original NÃO muda
}

// Uso:
int numero = 10;
modificar(numero);  // Passa VALOR 10 (copia)
System.out.println(numero);  // 10 (original NÃO mudou)

// OBJETOS - copia REFERÊNCIA
public void modificar(Produto produto) {
    //                  ↑ Recebe CÓPIA da referência
    
    // Modificar OBJETO (afeta original):
    produto.preco = 200;  // ✓ AFETA original (mesmo objeto)
    
    // Reatribuir PARÂMETRO (NÃO afeta original):
    produto = new Produto();  // ✗ NÃO afeta (muda cópia local)
}

// Uso:
Produto p = new Produto();
p.preco = 100;
modificar(p);  // Passa CÓPIA da referência
System.out.println(p.preco);  // 200 (objeto modificado)
```

**Exemplo completo**:
```java
public class Teste {
    // Método que modifica primitivo (NÃO afeta original)
    public void incrementar(int numero) {
        numero++;  // Incrementa CÓPIA local
        System.out.println("Dentro: " + numero);
    }
    
    // Método que modifica objeto (AFETA original)
    public void alterarPreco(Produto produto) {
        produto.preco = 500;  // Modifica OBJETO apontado
        System.out.println("Dentro: " + produto.preco);
    }
    
    // Método que reatribui parâmetro (NÃO afeta original)
    public void trocarProduto(Produto produto) {
        produto = new Produto();  // Cria NOVO objeto
        produto.preco = 999;      // Modifica novo objeto
        System.out.println("Dentro (novo): " + produto.preco);
    }
}

// USO:
Teste t = new Teste();

// Primitivo:
int x = 10;
t.incrementar(x);  
// Dentro: 11
System.out.println("Fora: " + x);  
// Fora: 10 (NÃO mudou)

// Objeto - modificar atributo:
Produto p = new Produto();
p.preco = 100;
t.alterarPreco(p);
// Dentro: 500
System.out.println("Fora: " + p.preco);
// Fora: 500 (MUDOU - mesmo objeto)

// Objeto - reatribuir parâmetro:
Produto p2 = new Produto();
p2.preco = 200;
t.trocarProduto(p2);
// Dentro (novo): 999
System.out.println("Fora: " + p2.preco);
// Fora: 200 (NÃO mudou - reatribuição local)
```

## 📋 Fundamentos Teóricos

### 1️⃣ Pass-by-Value em Primitivos

**Conceito**: Primitivos são copiados **literalmente**.

**Exemplo básico**:
```java
public void modificar(int numero) {
    System.out.println("Antes: " + numero);  // 10
    numero = 100;
    System.out.println("Depois: " + numero);  // 100
}

// Uso:
int x = 10;
modificar(x);  // Passa cópia de 10
System.out.println("Original: " + x);  // 10 (NÃO mudou)

// EXPLICAÇÃO:
// 1. x = 10 (na memória)
// 2. modificar(x) copia VALOR 10 para parâmetro 'numero'
// 3. 'numero' vira variável local com valor 10
// 4. numero = 100 altera APENAS variável local
// 5. x permanece 10 (não foi tocado)
```

**Todos os primitivos**:
```java
public void testar(byte b, short s, int i, long l,
                   float f, double d, char c, boolean flag) {
    // Todos são CÓPIAS
    b = 127;
    s = 32000;
    i = 1000000;
    l = 9000000000L;
    f = 3.14f;
    d = 3.14159;
    c = 'Z';
    flag = false;
    
    // Modificações NÃO afetam originais
}

// Uso:
byte b = 1;
short s = 2;
int i = 3;
long l = 4L;
float f = 5.0f;
double d = 6.0;
char c = 'A';
boolean flag = true;

testar(b, s, i, l, f, d, c, flag);

System.out.println(b);     // 1 (NÃO mudou)
System.out.println(i);     // 3 (NÃO mudou)
System.out.println(c);     // 'A' (NÃO mudou)
System.out.println(flag);  // true (NÃO mudou)
```

**Swap impossível**:
```java
public void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    System.out.println("Dentro: a=" + a + ", b=" + b);
}

// Uso:
int x = 10;
int y = 20;
swap(x, y);
// Dentro: a=20, b=10 (trocados localmente)

System.out.println("Fora: x=" + x + ", y=" + y);
// Fora: x=10, y=20 (NÃO trocados)

// Swap de primitivos é IMPOSSÍVEL em Java
```

### 2️⃣ Pass-by-Value em Objetos (Referências)

**Conceito**: Passa **cópia da referência** (endereço), não cópia do objeto.

**Exemplo**:
```java
public void modificar(Produto produto) {
    //                  ↑ Recebe cópia da REFERÊNCIA
    
    produto.preco = 200;  // Modifica objeto apontado
    // Caller e parâmetro apontam para MESMO objeto
}

// Uso:
Produto p = new Produto();
p.preco = 100;

// Memória:
// p aponta para Produto@1a2b (preco=100)

modificar(p);  // Passa cópia da referência 1a2b

// Memória:
// p aponta para Produto@1a2b (preco=200)
// produto (parâmetro) também aponta para Produto@1a2b
// Ambos veem preco=200 (MESMO objeto)

System.out.println(p.preco);  // 200 (MUDOU)
```

**Diagrama**:
```
ANTES:
p → Produto@1a2b { preco: 100 }

modificar(p):
p       → Produto@1a2b { preco: 100 }
produto → Produto@1a2b { preco: 100 }
          ↑ MESMA referência (cópia do endereço)

produto.preco = 200:
p       → Produto@1a2b { preco: 200 }
produto → Produto@1a2b { preco: 200 }
          ↑ Ambos veem mudança (MESMO objeto)

DEPOIS:
p → Produto@1a2b { preco: 200 }
```

### 3️⃣ Modificar Atributos de Objeto

**Conceito**: Modificar **atributos** afeta original (mesmo objeto).

**Exemplo**:
```java
public class Conta {
    public double saldo;
}

public void depositar(Conta conta, double valor) {
    conta.saldo += valor;  // Modifica OBJETO apontado
}

// Uso:
Conta minhaConta = new Conta();
minhaConta.saldo = 100;

depositar(minhaConta, 50);

System.out.println(minhaConta.saldo);  // 150 (MUDOU)

// EXPLICAÇÃO:
// 1. minhaConta aponta para Conta@1a2b (saldo=100)
// 2. depositar(minhaConta, 50) passa cópia da referência 1a2b
// 3. conta (parâmetro) aponta para Conta@1a2b (MESMO objeto)
// 4. conta.saldo += 50 modifica objeto Conta@1a2b
// 5. minhaConta.saldo mostra 150 (MESMO objeto modificado)
```

**Múltiplos atributos**:
```java
public void atualizar(Produto produto) {
    produto.nome = "Novo Nome";
    produto.preco = 999.0;
    produto.estoque = 50;
    // Todas as modificações afetam objeto original
}

// Uso:
Produto p = new Produto();
p.nome = "Mouse";
p.preco = 50.0;
p.estoque = 10;

atualizar(p);

System.out.println(p.nome);     // "Novo Nome" (MUDOU)
System.out.println(p.preco);    // 999.0 (MUDOU)
System.out.println(p.estoque);  // 50 (MUDOU)
```

### 4️⃣ Reatribuir Parâmetro (NÃO afeta original)

**Conceito**: Trocar **referência** do parâmetro não afeta variável do chamador.

**Exemplo**:
```java
public void trocar(Produto produto) {
    System.out.println("Antes: " + produto.preco);  // 100
    
    produto = new Produto();  // Cria NOVO objeto
    //        ↑ Reatribui parâmetro (cópia local)
    
    produto.preco = 999;
    System.out.println("Dentro: " + produto.preco);  // 999
}

// Uso:
Produto p = new Produto();
p.preco = 100;

trocar(p);
// Antes: 100
// Dentro: 999

System.out.println("Fora: " + p.preco);  // 100 (NÃO mudou)

// EXPLICAÇÃO:
// 1. p aponta para Produto@1a2b (preco=100)
// 2. trocar(p) passa cópia da referência 1a2b
// 3. produto (parâmetro) aponta para Produto@1a2b
// 4. produto = new Produto() cria Produto@9z8y (novo objeto)
// 5. produto agora aponta para Produto@9z8y (mudou cópia local)
// 6. p continua apontando para Produto@1a2b (NÃO afetado)
```

**Diagrama**:
```
INICIAL:
p → Produto@1a2b { preco: 100 }

trocar(p):
p       → Produto@1a2b { preco: 100 }
produto → Produto@1a2b { preco: 100 }

produto = new Produto():
p       → Produto@1a2b { preco: 100 }
produto → Produto@9z8y { preco: 0 }
          ↑ Nova referência (local)

produto.preco = 999:
p       → Produto@1a2b { preco: 100 }
produto → Produto@9z8y { preco: 999 }

FIM:
p → Produto@1a2b { preco: 100 } (NÃO mudou)
```

**Swap de objetos impossível**:
```java
public void swap(Produto p1, Produto p2) {
    Produto temp = p1;
    p1 = p2;
    p2 = temp;
    // Troca CÓPIAS locais, não afeta originais
}

// Uso:
Produto produtoA = new Produto();
produtoA.nome = "A";

Produto produtoB = new Produto();
produtoB.nome = "B";

swap(produtoA, produtoB);

System.out.println(produtoA.nome);  // "A" (NÃO trocou)
System.out.println(produtoB.nome);  // "B" (NÃO trocou)
```

### 5️⃣ Arrays (Passagem por Referência)

**Conceito**: Array é objeto - passa **cópia da referência**.

**Modificar elementos**:
```java
public void modificar(int[] array) {
    array[0] = 999;  // Modifica ELEMENTO do array original
}

// Uso:
int[] numeros = {10, 20, 30};
modificar(numeros);

System.out.println(numeros[0]);  // 999 (MUDOU)
System.out.println(numeros[1]);  // 20
System.out.println(numeros[2]);  // 30
```

**Reatribuir array**:
```java
public void trocar(int[] array) {
    array = new int[]{100, 200, 300};  // Cria NOVO array
    // Reatribui parâmetro (NÃO afeta original)
}

// Uso:
int[] numeros = {10, 20, 30};
trocar(numeros);

System.out.println(numeros[0]);  // 10 (NÃO mudou)
System.out.println(numeros[1]);  // 20 (NÃO mudou)
System.out.println(numeros[2]);  // 30 (NÃO mudou)
```

**Diagrama**:
```
MODIFICAR ELEMENTO:
numeros → int[3] { 10, 20, 30 }
array   → int[3] { 10, 20, 30 } (MESMA referência)

array[0] = 999:
numeros → int[3] { 999, 20, 30 }
array   → int[3] { 999, 20, 30 } (ambos veem mudança)

REATRIBUIR ARRAY:
numeros → int[3] { 10, 20, 30 }
array   → int[3] { 10, 20, 30 }

array = new int[]{...}:
numeros → int[3] { 10, 20, 30 } (original)
array   → int[3] { 100, 200, 300 } (nova referência local)
```

### 6️⃣ Objetos Imutáveis

**Conceito**: Objetos **imutáveis** (String, Integer) parecem pass-by-value.

**String**:
```java
public void modificar(String texto) {
    texto = "Novo";  // Cria NOVA String (imutável)
    // Não afeta original
}

// Uso:
String s = "Original";
modificar(s);
System.out.println(s);  // "Original" (NÃO mudou)

// EXPLICAÇÃO:
// String é imutável - qualquer "modificação" cria nova String
// texto = "Novo" reatribui parâmetro (não afeta s)
```

**Integer** (wrapper):
```java
public void incrementar(Integer numero) {
    numero++;  // Cria NOVO Integer (autoboxing)
    // Não afeta original
}

// Uso:
Integer x = 10;
incrementar(x);
System.out.println(x);  // 10 (NÃO mudou)

// EXPLICAÇÃO:
// Integer é imutável
// numero++ → numero = Integer.valueOf(numero + 1) (novo objeto)
// Reatribui parâmetro (não afeta x)
```

**Comparação**:
```
MUTÁVEL (ArrayList):
public void adicionar(ArrayList<String> lista) {
    lista.add("Novo");  // Modifica OBJETO original (AFETA)
}

IMUTÁVEL (String):
public void concatenar(String texto) {
    texto += " Novo";  // Cria NOVA String (NÃO afeta)
}
```

### 7️⃣ Pass-by-Value vs Pass-by-Reference

**Conceito**: Java **não tem** pass-by-reference.

**Pass-by-value (Java)**:
```java
public void modificar(int x) {
    x = 100;  // Modifica CÓPIA
}

public void modificar(Produto p) {
    p.preco = 200;  // Modifica objeto (mesma ref)
    p = new Produto();  // Reatribui cópia (NÃO afeta)
}
```

**Pass-by-reference (C++ com &)**:
```cpp
void modificar(int &x) {  // & = referência (alias)
    x = 100;  // Modifica ORIGINAL diretamente
}

void trocar(Produto &p) {
    p = new Produto();  // Troca ORIGINAL (afeta chamador)
}
```

**Comparação**:
```
JAVA (pass-by-value):
- Primitivo: copia VALOR
- Objeto: copia REFERÊNCIA
- Modificar atributo: AFETA original
- Reatribuir parâmetro: NÃO afeta original
- Swap impossível

C++ (pass-by-reference com &):
- Parâmetro é ALIAS da variável
- Modificar parâmetro: AFETA original
- Reatribuir parâmetro: AFETA original
- Swap possível
```

### 8️⃣ Workaround para "Pass-by-Reference"

**Conceito**: Simular pass-by-reference usando **wrapper object**.

**Classe wrapper**:
```java
public class IntWrapper {
    public int valor;
    
    public IntWrapper(int valor) {
        this.valor = valor;
    }
}

public void incrementar(IntWrapper wrapper) {
    wrapper.valor++;  // Modifica ATRIBUTO (afeta original)
}

// Uso:
IntWrapper w = new IntWrapper(10);
incrementar(w);
System.out.println(w.valor);  // 11 (MUDOU)
```

**Swap com wrapper**:
```java
public class ProdutoWrapper {
    public Produto produto;
}

public void swap(ProdutoWrapper w1, ProdutoWrapper w2) {
    Produto temp = w1.produto;
    w1.produto = w2.produto;
    w2.produto = temp;
    // Troca ATRIBUTOS (afeta originais)
}

// Uso:
ProdutoWrapper wa = new ProdutoWrapper();
wa.produto = produtoA;

ProdutoWrapper wb = new ProdutoWrapper();
wb.produto = produtoB;

swap(wa, wb);

System.out.println(wa.produto);  // produtoB (TROCADO)
System.out.println(wb.produto);  // produtoA (TROCADO)
```

**Array de 1 elemento**:
```java
public void incrementar(int[] array) {
    array[0]++;  // Modifica elemento
}

// Uso:
int[] numero = {10};
incrementar(numero);
System.out.println(numero[0]);  // 11 (MUDOU)
```

### 9️⃣ Coleções e Passagem por Valor

**Conceito**: Coleções são objetos - passa cópia da referência.

**Modificar coleção**:
```java
public void adicionar(List<String> lista) {
    lista.add("Novo");  // Modifica OBJETO lista (AFETA)
}

// Uso:
List<String> nomes = new ArrayList<>();
nomes.add("João");

adicionar(nomes);

System.out.println(nomes);  // [João, Novo] (MUDOU)
```

**Reatribuir coleção**:
```java
public void trocar(List<String> lista) {
    lista = new ArrayList<>();  // Cria NOVA lista
    lista.add("Novo");
    // Não afeta original
}

// Uso:
List<String> nomes = new ArrayList<>();
nomes.add("João");

trocar(nomes);

System.out.println(nomes);  // [João] (NÃO mudou)
```

**Cópia defensiva**:
```java
public void processar(List<String> lista) {
    // Criar CÓPIA para não afetar original
    List<String> copia = new ArrayList<>(lista);
    copia.add("Novo");
    // Modifica cópia (NÃO afeta lista original)
}
```

### 🔟 Varargs e Passagem por Valor

**Conceito**: Varargs é array - passa cópia da referência.

**Modificar elementos**:
```java
public void modificar(int... numeros) {
    //                  ↑ int[] internamente
    numeros[0] = 999;  // Modifica array original
}

// Uso:
int[] arr = {10, 20, 30};
modificar(arr);  // Passa array

System.out.println(arr[0]);  // 999 (MUDOU)
```

**Reatribuir varargs**:
```java
public void trocar(int... numeros) {
    numeros = new int[]{100, 200};  // Reatribui local (NÃO afeta)
}

// Uso:
int[] arr = {10, 20, 30};
trocar(arr);

System.out.println(arr[0]);  // 10 (NÃO mudou)
```

## 🎯 Aplicabilidade

**1. Passar dados para métodos (leitura)**
**2. Modificar objetos (via atributos)**
**3. Retornar múltiplos valores (wrapper object)**
**4. Evitar modificações (imutáveis)**
**5. Performance (evitar cópia de objetos grandes)**

## ⚠️ Armadilhas Comuns

**1. Esperar que primitivo mude**:
```java
void incrementar(int x) { x++; }
int n = 10;
incrementar(n);
// n ainda é 10
```

**2. Achar que reatribuição afeta**:
```java
void trocar(Produto p) {
    p = new Produto();  // NÃO afeta
}
```

**3. Confundir modificar atributo com reatribuir**:
```java
p.preco = 100;  // Modifica OBJETO (afeta)
p = new Produto();  // Reatribui PARÂMETRO (NÃO afeta)
```

**4. Tentar swap de primitivos**:
```java
void swap(int a, int b) {
    // Impossível em Java
}
```

**5. Modificar String esperando mudar**:
```java
void modificar(String s) {
    s = "Novo";  // Imutável (NÃO afeta)
}
```

## ✅ Boas Práticas

**1. Documentar se método modifica objeto**:
```java
/**
 * Modifica saldo (side effect)
 */
void depositar(Conta conta) { }
```

**2. Evitar modificar parâmetros**:
```java
// Declarar final:
void metodo(final int x) {
    // x = 10;  // Erro
}
```

**3. Usar cópia defensiva**:
```java
List<String> copia = new ArrayList<>(lista);
```

**4. Preferir retorno a modificação**:
```java
// ✓ Melhor:
int incrementar(int x) {
    return x + 1;
}

// ❌ Pior:
void incrementar(int x) {
    x++;  // Não afeta
}
```

**5. Wrapper para "pass-by-reference"**:
```java
class IntWrapper { public int valor; }
```

## 📚 Resumo Executivo

**Java = pass-by-value**.

**Primitivos**:
```java
void modificar(int x) {
    x = 100;  // Modifica cópia (NÃO afeta)
}
```

**Objetos**:
```java
// Modificar atributo (AFETA):
void modificar(Produto p) {
    p.preco = 200;  // AFETA original
}

// Reatribuir (NÃO afeta):
void trocar(Produto p) {
    p = new Produto();  // NÃO afeta
}
```

**Arrays**:
```java
void modificar(int[] arr) {
    arr[0] = 999;  // AFETA
    arr = new int[]{};  // NÃO afeta
}
```

**Imutáveis**:
```java
void modificar(String s) {
    s = "Novo";  // NÃO afeta (imutável)
}
```

**Regra**:
```
- Primitivo: cópia VALOR (nunca afeta)
- Objeto: cópia REFERÊNCIA
  * Modificar atributo: AFETA
  * Reatribuir: NÃO afeta
```

**Swap**:
```java
// Impossível em Java:
void swap(int a, int b) { }

// Possível com wrapper:
class IntWrapper { int valor; }
void swap(IntWrapper w1, IntWrapper w2) {
    int temp = w1.valor;
    w1.valor = w2.valor;
    w2.valor = temp;
}
```

**Evitar**:
- Esperar primitivo mudar
- Confundir modificar com reatribuir
- Tentar swap de primitivos

**Preferir**:
- Retornar valor
- Cópia defensiva
- Documentar modificações
- final em parâmetros

**Recomendação**: Entenda **pass-by-value sempre**, **primitivos nunca mudam**, objetos **atributos mudam** mas **reatribuição não**, use **wrapper para swap**, prefira **retornar** a modificar, declare **final** para evitar reatribuição.