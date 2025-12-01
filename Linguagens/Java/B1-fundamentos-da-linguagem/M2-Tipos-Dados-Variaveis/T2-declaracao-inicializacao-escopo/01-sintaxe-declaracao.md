# Sintaxe de Declaração de Variáveis

## 🎯 Introdução e Definição

### Definição Conceitual

A **declaração de variáveis** em Java é o processo de criar um nome (identificador) associado a um tipo de dado específico, reservando espaço na memória para armazenar valores. Toda variável em Java **deve ser declarada antes do uso**, especificando seu **tipo** e **nome**, seguindo a filosofia de **tipagem estática forte** da linguagem.

A sintaxe básica de declaração é:
```java
tipo nomeVariavel;
```

Java exige que o **tipo seja explicitamente declarado** (exceto com `var` a partir do Java 10 para variáveis locais), garantindo **type safety** (segurança de tipos) em tempo de compilação, evitando muitos erros comuns presentes em linguagens de tipagem dinâmica.

### Características Fundamentais

**Componentes de uma Declaração**:
1. **Tipo**: Primitivo (`int`, `double`, `boolean`) ou referência (`String`, `Object`, classes customizadas)
2. **Identificador**: Nome da variável (deve seguir regras de nomenclatura)
3. **Ponto-e-vírgula**: Terminador de instrução (`;`)

**Exemplo Básico**:
```java
int idade;           // Declaração simples
String nome;         // Variável de referência
double salario;      // Tipo primitivo de ponto flutuante
boolean ativo;       // Tipo boolean
```

### Contexto Histórico

**Tipagem Estática** (Java, 1995):
- Decisão de design: **segurança de tipos** em tempo de compilação
- Todos tipos conhecidos antes da execução
- Contrasta com linguagens dinâmicas (Python, JavaScript)

**Evolução**:
- **Java 1.0-9**: Tipo sempre explícito
- **Java 10+ (2018)**: Introdução de `var` para **inferência de tipo local**
  ```java
  var idade = 25;     // Tipo inferido como int
  var nome = "João";  // Tipo inferido como String
  ```

### Problema Fundamental que Resolve

#### Type Safety: Prevenção de Erros

**Sem declaração de tipo** (hipotético):
```java
x = 10;          // Qual o tipo de x? int? long? String?
x = "texto";     // Mudou de tipo? Erro ou permitido?
```

**Com declaração explícita**:
```java
int x = 10;
x = "texto";     // ❌ ERRO DE COMPILAÇÃO: incompatible types
```

#### Documentação e Legibilidade

**Tipo explícito** serve como **documentação em linha**:
```java
int quantidadeItens;      // ✅ Claro que é um número inteiro
String nomeCompleto;      // ✅ Claro que é texto
boolean estaPago;         // ✅ Claro que é true/false
```

---

## 📋 Sumário Conceitual

### Sintaxe Básica

**Declaração Simples**:
```java
tipo identificador;
```

**Exemplos**:
```java
int contador;
double preco;
char letra;
boolean flag;
String texto;
LocalDate data;
```

### Declaração com Inicialização

**Sintaxe**:
```java
tipo identificador = valor;
```

**Exemplos**:
```java
int idade = 30;
double pi = 3.14159;
char inicial = 'A';
boolean ativo = true;
String nome = "Maria";
```

### Múltiplas Declarações

**Mesmo tipo, mesma linha**:
```java
int a, b, c;                    // Três variáveis int
int x = 10, y = 20, z = 30;     // Declaração com inicialização
```

**Tipos diferentes** (linhas separadas):
```java
int idade = 25;
String nome = "João";
boolean ativo = true;
```

---

## 🧠 Fundamentos Teóricos

### Regras de Nomenclatura de Identificadores

**Regras Obrigatórias** (compilador):
1. **Iniciar com**:
   - Letra (`a-z`, `A-Z`)
   - Underscore (`_`)
   - Cifrão (`$`)
2. **Caracteres subsequentes**:
   - Letras
   - Dígitos (`0-9`)
   - Underscore
   - Cifrão
3. **Não pode**:
   - Iniciar com dígito: `1idade` ❌
   - Conter espaços: `nome completo` ❌
   - Ser palavra reservada: `int`, `class`, `public` ❌

**Exemplos Válidos**:
```java
idade          ✅
_temp          ✅
$valor         ✅
nome1          ✅
_123           ✅
valorMaximo    ✅
CONSTANTE      ✅
```

**Exemplos Inválidos**:
```java
1idade         ❌ (inicia com dígito)
nome-completo  ❌ (hífen não permitido)
valor total    ❌ (espaço não permitido)
int            ❌ (palavra reservada)
class          ❌ (palavra reservada)
```

### Convenções de Nomenclatura (Java Code Conventions)

**camelCase** para variáveis:
```java
int idade;
int quantidadeTotal;
String nomeCompleto;
boolean estaPago;
```

**UPPER_CASE** para constantes:
```java
final int IDADE_MAXIMA = 120;
final double PI = 3.14159;
final String MENSAGEM_ERRO = "Erro crítico";
```

**PascalCase** para classes (não variáveis):
```java
String texto;          // ✅ variável
MinhaClasse objeto;    // ✅ tipo em PascalCase, variável em camelCase
```

### Palavras Reservadas (Keywords)

**Não podem ser usadas como identificadores**:
```
abstract   continue   for          new         switch
assert     default    goto         package     synchronized
boolean    do         if           private     this
break      double     implements   protected   throw
byte       else       import       public      throws
case       enum       instanceof   return      transient
catch      extends    int          short       try
char       final      interface    static      void
class      finally    long         strictfp    volatile
const      float      native       super       while
_          (Java 9+)
```

**Literais Reservados**:
```java
true, false, null  // Não são keywords, mas são reservados
```

### Tipos Primitivos vs Tipos de Referência

**Primitivos** (8 tipos):
```java
byte valorByte;
short valorShort;
int valorInt;
long valorLong;
float valorFloat;
double valorDouble;
char valorChar;
boolean valorBoolean;
```

**Referências** (objetos):
```java
String texto;              // Classe String
Integer numero;            // Wrapper class
LocalDate data;            // Classe LocalDate
MinhaClasse objeto;        // Classe customizada
int[] array;               // Array (é referência)
List<String> lista;        // Interface genérica
```

---

## 🔍 Análise Conceitual Profunda

### Declaração vs Definição

**Declaração**: Informa existência e tipo da variável.
```java
int idade;  // Declaração
```

**Definição**: Declaração + alocação de memória (em Java, são simultâneas).
```java
int idade;  // Declaração + definição (memória alocada)
```

**Inicialização**: Atribuição do primeiro valor.
```java
int idade = 30;  // Declaração + definição + inicialização
```

### Escopo de Declaração

**Variável Local** (dentro de método):
```java
public void metodo() {
    int local = 10;  // Declaração local
}
```

**Variável de Instância** (campo de classe):
```java
public class Pessoa {
    private int idade;  // Declaração de campo de instância
}
```

**Variável de Classe** (static):
```java
public class Configuracao {
    private static int contador;  // Declaração de campo estático
}
```

### Modificadores de Acesso em Declarações

**Campos de Instância/Classe**:
```java
public int publico;         // Acessível de qualquer lugar
private int privado;        // Apenas dentro da classe
protected int protegido;    // Classe, pacote e subclasses
int pacote;                 // Default: apenas no pacote
```

**Variáveis Locais** (sem modificador de acesso):
```java
public void metodo() {
    int local = 10;  // Sem modificador (sempre privado ao método)
}
```

### Modificadores Adicionais

**final** (constante):
```java
final int CONSTANTE = 100;
final String MENSAGEM = "Olá";
```

**static** (variável de classe):
```java
static int contador = 0;
static final double PI = 3.14159;  // Constante de classe
```

**transient** (não serializar):
```java
private transient String senhaTemporaria;
```

**volatile** (visibilidade entre threads):
```java
private volatile boolean flag;
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Variáveis Locais em Métodos

```java
public class Calculadora {
    public int somar(int a, int b) {
        int resultado;           // Declaração
        resultado = a + b;       // Inicialização
        return resultado;
    }
    
    public double calcularMedia(int[] valores) {
        int soma = 0;            // Declaração com inicialização
        int quantidade = valores.length;
        
        for (int valor : valores) {  // Declaração na própria iteração
            soma += valor;
        }
        
        double media = (double) soma / quantidade;
        return media;
    }
}
```

### Caso 2: Campos de Instância

```java
public class Pessoa {
    // Declarações de campos de instância
    private String nome;
    private int idade;
    private boolean ativo;
    private LocalDate dataNascimento;
    
    // Declaração com inicialização
    private String pais = "Brasil";
    private int tentativasLogin = 0;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;      // Atribuição (não declaração)
        this.idade = idade;
    }
}
```

### Caso 3: Constantes (final)

```java
public class Configuracao {
    // Constantes de classe (static final)
    public static final int IDADE_MAXIMA = 120;
    public static final String VERSAO = "1.0.0";
    public static final double PI = 3.14159265359;
    
    // Constante de instância (final)
    private final String id;
    
    public Configuracao(String id) {
        this.id = id;  // Atribuição única (blank final)
    }
}
```

### Caso 4: Variáveis em Loops

```java
public class IteracaoExemplo {
    public void exemplos() {
        // Declaração no for
        for (int i = 0; i < 10; i++) {
            int quadrado = i * i;  // Declaração dentro do loop
            System.out.println(quadrado);
        }
        
        // i não existe aqui (escopo terminado)
        
        // Enhanced for
        int[] numeros = {1, 2, 3, 4, 5};
        for (int numero : numeros) {  // Declaração na iteração
            System.out.println(numero);
        }
    }
}
```

### Caso 5: Inferência de Tipo com var (Java 10+)

```java
public class InferenciaExemplo {
    public void metodo() {
        // Inferência de tipo
        var idade = 30;              // int
        var nome = "João";           // String
        var preco = 19.99;           // double
        var ativo = true;            // boolean
        var lista = new ArrayList<String>();  // ArrayList<String>
        
        // ❌ Não funciona com campos de classe
        // private var campo = 10;  // ERRO: var não permitido em campos
        
        // ❌ Não funciona sem inicialização
        // var x;  // ERRO: cannot infer type
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. var: Apenas Variáveis Locais

**Problema**: `var` não funciona em campos de classe.

```java
public class Exemplo {
    private var campo = 10;  // ❌ ERRO: var not allowed here
    
    public void metodo() {
        var local = 10;  // ✅ OK (variável local)
    }
}
```

### 2. Inicialização Obrigatória para Variáveis Locais

**Problema**: Variáveis locais não inicializadas.

```java
public void metodo() {
    int x;
    System.out.println(x);  // ❌ ERRO: variable x might not have been initialized
}
```

**Solução**: Sempre inicializar.

```java
public void metodo() {
    int x = 0;  // ✅ OK
    System.out.println(x);
}
```

### 3. Shadowing (Sombreamento)

**Problema**: Variável local com mesmo nome de campo.

```java
public class Pessoa {
    private String nome = "Padrão";
    
    public void metodo() {
        String nome = "Local";  // ⚠️ Shadowing
        System.out.println(nome);       // "Local" (variável local)
        System.out.println(this.nome);  // "Padrão" (campo de instância)
    }
}
```

### 4. Múltiplas Declarações: Cuidado com Legibilidade

**Problema**: Declarações múltiplas podem confundir.

```java
int a = 10, b, c = 20;  // ⚠️ b não está inicializado
```

**Preferível**: Declarar separadamente.

```java
int a = 10;
int b = 0;
int c = 20;
```

### 5. Nomes Muito Curtos ou Genéricos

**Problema**: Dificulta compreensão.

```java
int i;      // ⚠️ OK para índices de loop, mas evite em outros contextos
int x, y;   // ⚠️ Genérico demais
int temp;   // ⚠️ O que é "temp"?
```

**Melhor**: Nomes descritivos.

```java
int indiceAtual;
int quantidadeItens;
int temperaturaAtual;
```

---

## 🔗 Interconexões Conceituais

**Próximos Tópicos**:
- **Inicialização**: Atribuição de valores iniciais
- **Escopo**: Visibilidade de variáveis
- **Shadowing**: Conflito de nomes

**Relação com Outros Conceitos**:
- **Tipos Primitivos**: Base para declarações
- **Tipos de Referência**: Classes e interfaces
- **Modificadores**: `final`, `static`, acesso

---

## 🚀 Boas Práticas

1. ✅ **Declarar variáveis próximas ao uso** (não todas no topo do método)
2. ✅ **Usar nomes descritivos** (`quantidadeItens` melhor que `q`)
3. ✅ **Seguir camelCase** para variáveis
4. ✅ **Usar UPPER_CASE** para constantes
5. ✅ **Inicializar variáveis locais** na declaração
6. ✅ **Usar `final`** quando valor não muda
7. ❌ **Evitar nomes de uma letra** (exceto índices de loop: `i`, `j`)
8. ❌ **Evitar abreviações** (`nomeCompl` → `nomeCompleto`)
9. ✅ **Usar `var`** quando tipo é óbvio (Java 10+)
10. ❌ **Não usar underscore sozinho** (`_`) - reservado desde Java 9

### Exemplos de Boas Práticas

**❌ Ruim**:
```java
int a, b, c;
String s = "test";
double x = 10.5;
```

**✅ Bom**:
```java
int quantidadeItens = 0;
int precoUnitario = 100;
int precoTotal = quantidadeItens * precoUnitario;

String nomeCompleto = "João Silva";
double saldoConta = 1500.75;
```

**❌ Ruim** (múltiplas declarações confusas):
```java
int a = 10, b, c = 20, d, e = 30;
```

**✅ Bom** (declarações claras):
```java
int contadorInicio = 10;
int contadorAtual;      // Será inicializado depois
int contadorFim = 20;
```

**✅ Uso de var** (Java 10+):
```java
var nome = "Maria";                    // ✅ Tipo óbvio (String)
var lista = new ArrayList<String>();   // ✅ Tipo óbvio
var idade = 30;                        // ✅ int óbvio
```
