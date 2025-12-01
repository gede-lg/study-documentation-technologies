# Declaração de Atributos

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Atributos** (também chamados campos, variáveis de instância ou propriedades) são variáveis declaradas dentro de uma classe, mas fora de métodos, que armazenam o estado de cada objeto - representando características ou propriedades que diferenciam instâncias. Conceitualmente, atributos são a "memória" do objeto - enquanto métodos definem comportamento (o que objeto faz), atributos definem estado (o que objeto é/sabe). Uma classe `Pessoa` tem atributos `nome`, `idade`, `email` - cada instância de Pessoa terá seus próprios valores para esses atributos, permitindo que `pessoa1.nome = "Alice"` e `pessoa2.nome = "Bob"` coexistam como objetos distintos.

É o reconhecimento de que objetos precisam armazenar informação - carro precisa saber sua velocidade atual, conta bancária precisa saber saldo, usuário precisa saber email. Atributos são variáveis que "vivem" com o objeto durante sua existência, não apenas durante execução de um método.

### Contexto Histórico e Motivação

Programação procedural usava variáveis globais ou structs (C) para armazenar dados - separação artificial entre dados e comportamento. Programação Orientada a Objetos unificou: objetos encapsulam **dados** (atributos) e **comportamento** (métodos) que opera sobre esses dados. Java, desde versão 1.0 (1996), adotou atributos como parte fundamental de classes.

**Motivação:** Modelar mundo real - objetos do mundo têm propriedades (pessoa tem nome, carro tem cor), e essas propriedades precisam representação em código. Atributos permitem que cada objeto mantenha seu próprio estado independente.

### Problema Fundamental que Resolve

**Problema:** Código procedural mistura dados e lógica sem organização:

```java
// Procedural (anti-padrão em Java)
String nomeUsuario1 = "Alice";
String emailUsuario1 = "alice@example.com";
int idadeUsuario1 = 30;

String nomeUsuario2 = "Bob";
String emailUsuario2 = "bob@example.com";
int idadeUsuario2 = 25;

// Difícil gerenciar múltiplos usuários
// Variáveis soltas, sem relacionamento claro
```

**Solução:** Atributos agrupam dados relacionados em classe:

```java
// Orientado a Objetos
class Usuario {
    String nome;
    String email;
    int idade;
}

Usuario usuario1 = new Usuario();
usuario1.nome = "Alice";
usuario1.email = "alice@example.com";
usuario1.idade = 30;

Usuario usuario2 = new Usuario();
usuario2.nome = "Bob";
usuario2.email = "bob@example.com";
usuario2.idade = 25;

// Dados organizados, cada objeto tem seu próprio estado
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Estado do Objeto:** Atributos armazenam estado - diferencia instâncias da mesma classe.

2. **Escopo de Classe:** Declarados dentro de classe, fora de métodos - visíveis para todos métodos da classe.

3. **Por Instância:** Cada objeto tem sua própria cópia dos atributos (exceto `static`).

4. **Valores Padrão:** Atributos não inicializados recebem valores default (0, null, false).

5. **Encapsulamento:** Atributos geralmente `private` - acesso controlado via métodos.

### Pilares Fundamentais

- **Sintaxe:** `tipo nomeAtributo;` dentro da classe
- **Localização:** Nível de classe (não dentro de métodos/construtores)
- **Modificadores:** `private`, `public`, `protected`, `static`, `final`
- **Tipos:** Primitivos (int, double) ou referências (String, objetos)
- **Uso:** Armazenar estado persistente do objeto

---

## 🧠 Fundamentos Teóricos

### Sintaxe Básica de Declaração

#### Forma Geral

```java
[modificadores] tipo nomeAtributo [= valorInicial];
```

**Componentes:**
- **modificadores** (opcional): `private`, `public`, `protected`, `static`, `final`, `transient`, `volatile`
- **tipo** (obrigatório): Tipo primitivo ou classe/interface
- **nomeAtributo** (obrigatório): Identificador válido
- **= valorInicial** (opcional): Inicialização inline

#### Exemplos Básicos

```java
class Pessoa {
    // Atributos de tipos primitivos
    int idade;
    double altura;
    boolean ativo;
    char genero;

    // Atributos de tipos referência
    String nome;
    String email;
    LocalDate dataNascimento;

    // Atributo com inicialização inline
    int pontos = 0;
    boolean logado = false;
}
```

### Localização e Escopo

#### Atributos vs Variáveis Locais

```java
class Exemplo {
    // ATRIBUTO - escopo de classe
    int atributo;

    void metodo() {
        // VARIÁVEL LOCAL - escopo de método
        int variavel = 10;

        atributo = 5;   // Acessível (atributo da classe)
        variavel = 20;  // Acessível (variável local)
    }

    void outroMetodo() {
        atributo = 15;  // Acessível (atributo visível em todos métodos)
        // variavel = 30;  // ERRO - variavel é local ao metodo()
    }
}
```

**Diferenças:**

| Aspecto | Atributo | Variável Local |
|---------|----------|----------------|
| **Declaração** | Nível de classe | Dentro de método/bloco |
| **Escopo** | Toda a classe | Método/bloco onde declarada |
| **Lifetime** | Vida do objeto | Execução do método |
| **Valor Padrão** | Sim (0, null, false) | Não (deve inicializar) |
| **Acesso** | Todos métodos da classe | Apenas no bloco local |

#### Posicionamento na Classe

```java
class MinhaClasse {
    // CORRETO - atributos no início
    private int id;
    private String nome;

    // Construtores
    public MinhaClasse() { }

    // Métodos
    public void metodo() { }

    // EVITAR - atributo após método (permitido mas não convencional)
    private int outroAtributo;  // Confuso, dificulta leitura
}
```

**Convenção:** Declare atributos no topo da classe (antes de construtores e métodos).

### Princípios e Conceitos Subjacentes

#### Princípio do Estado por Instância

Cada objeto tem sua própria cópia dos atributos:

```java
class Contador {
    int valor;  // Cada Contador tem seu próprio valor
}

Contador c1 = new Contador();
Contador c2 = new Contador();

c1.valor = 10;
c2.valor = 20;

System.out.println(c1.valor);  // 10
System.out.println(c2.valor);  // 20
// c1 e c2 são independentes!
```

**Análise:** Modificar `c1.valor` não afeta `c2.valor` - cada objeto tem memória separada para atributos.

#### Princípio da Coesão

Atributos devem ser relacionados conceitualmente - pertencem ao domínio da classe:

```java
// BOM - atributos coesos (todos sobre Pessoa)
class Pessoa {
    String nome;
    int idade;
    String cpf;
}

// RUIM - atributos não relacionados (mistura conceitos)
class Pessoa {
    String nome;
    double saldoBancario;  // Banco, não Pessoa!
    String enderecoServidor;  // Servidor, não Pessoa!
}
```

**Regra:** Atributos devem representar propriedades intrínsecas do conceito modelado.

---

## 🔍 Análise Conceitual Profunda

### Tipos de Atributos

#### Atributos Primitivos

```java
class Medidas {
    byte nivel;          // -128 a 127
    short quantidade;    // -32768 a 32767
    int contador;        // ~2 bilhões
    long distancia;      // ~9 quintilhões
    float temperatura;   // Ponto flutuante 32-bit
    double precisao;     // Ponto flutuante 64-bit
    char categoria;      // Caractere Unicode
    boolean ativo;       // true ou false
}
```

**Armazenamento:** Valor direto na memória do objeto.

#### Atributos de Referência

```java
class Empresa {
    String nome;                    // String
    LocalDate fundacao;             // java.time
    List<Funcionario> funcionarios; // Coleção
    Endereco sede;                  // Objeto customizado
}
```

**Armazenamento:** Referência (ponteiro) para objeto na heap.

#### Arrays como Atributos

```java
class Turma {
    String[] alunos;          // Array de Strings
    int[] notas;              // Array de ints
    Pessoa[][] matriz;        // Array 2D

    // Inicialização
    Turma() {
        alunos = new String[30];
        notas = new int[30];
    }
}
```

### Declarações Múltiplas

#### Declaração Única vs Múltipla

```java
class Exemplo {
    // Declarações separadas (preferido - mais legível)
    private int idade;
    private String nome;
    private double salario;

    // Declaração múltipla (permitido mas desencorajado)
    private int x, y, z;  // Dificulta leitura

    // CUIDADO - tipo compartilhado
    private String nome1, nome2, nome3;  // Todas são String

    // ARMADILHA - apenas primeira é array!
    private int[] array1, valor;  // array1 é int[], valor é int (não int[]!)
    // Equivalente a:
    // private int[] array1;
    // private int valor;
}
```

**Recomendação:** Uma declaração por linha para clareza.

### Inicialização Inline

#### Valores Iniciais

```java
class Configuracao {
    // Inicialização com literais
    int timeout = 30;
    String prefixo = "LOG_";
    boolean debug = false;

    // Inicialização com expressões
    double taxa = 0.1 * 1.05;  // 10.5%
    String versao = "v" + 1 + "." + 0;  // "v1.0"

    // Inicialização com new
    List<String> tags = new ArrayList<>();
    LocalDate hoje = LocalDate.now();

    // Inicialização com método estático
    UUID id = UUID.randomUUID();
}
```

**Execução:** Inicialização inline ocorre antes do construtor.

#### Inicialização Complexa

```java
class Dados {
    // Simples inline
    private int[] numeros = {1, 2, 3, 4, 5};

    // Complexa - usar bloco de inicialização
    private Map<String, Integer> mapa;
    {
        // Bloco de inicialização
        mapa = new HashMap<>();
        mapa.put("um", 1);
        mapa.put("dois", 2);
    }

    // Ou inicializar no construtor
    private Set<String> conjunto;
    Dados() {
        conjunto = new HashSet<>();
        conjunto.add("A");
        conjunto.add("B");
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Declarar Atributos

✅ **Declare atributo quando:**

1. **Estado Persistente:**
   ```java
   class ContaBancaria {
       double saldo;  // Persiste durante vida do objeto
   }
   ```

2. **Propriedade do Objeto:**
   ```java
   class Produto {
       String nome;
       double preco;
       int estoque;
   }
   ```

3. **Usado por Múltiplos Métodos:**
   ```java
   class Calculadora {
       double resultado;  // Compartilhado entre metodos

       void somar(double x) {
           resultado += x;
       }

       void multiplicar(double x) {
           resultado *= x;
       }
   }
   ```

❌ **NÃO declare atributo para:**

1. **Valores Temporários:**
   ```java
   // ERRADO - variável local seria melhor
   class Processador {
       int temp;  // Usado apenas em um método

       void processar() {
           temp = calcular();  // Use variável local!
       }
   }
   ```

2. **Parâmetros de Método:**
   ```java
   // ERRADO
   class Calculadora {
       double a, b;  // Não são estado, são parâmetros!

       double somar() {
           return a + b;  // Use parâmetros!
       }
   }

   // CORRETO
   class Calculadora {
       double somar(double a, double b) {
           return a + b;  // Parâmetros locais
       }
   }
   ```

---

## ⚠️ Limitações e Considerações

### Valores Padrão Automáticos

```java
class Padroes {
    byte b;       // 0
    short s;      // 0
    int i;        // 0
    long l;       // 0L
    float f;      // 0.0f
    double d;     // 0.0
    char c;       // '\u0000' (char nulo)
    boolean bo;   // false

    String str;   // null
    Object obj;   // null
    int[] array;  // null
}
```

**⚠️ CUIDADO:** Referências não inicializadas são `null` - acessar causa `NullPointerException`!

```java
class Problema {
    String nome;  // Padrão: null

    void exibir() {
        System.out.println(nome.toUpperCase());  // NullPointerException!
    }
}
```

### Shadowing (Sombreamento)

```java
class Exemplo {
    int valor = 10;  // Atributo

    void metodo(int valor) {  // Parâmetro com mesmo nome
        valor = 20;  // Modifica parâmetro, NÃO atributo!
        System.out.println(valor);       // 20 (parâmetro)
        System.out.println(this.valor);  // 10 (atributo)
    }
}
```

**Solução:** Use `this.` para referenciar atributo:
```java
void metodo(int valor) {
    this.valor = valor;  // Atributo = parâmetro
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Encapsulamento

```java
// SEM encapsulamento - atributo público
class Usuario {
    public String email;  // Qualquer código pode modificar!
}

Usuario u = new Usuario();
u.email = "invalido";  // Sem validação!

// COM encapsulamento - atributo privado
class UsuarioSeguro {
    private String email;

    public void setEmail(String email) {
        if (email.contains("@")) {
            this.email = email;
        } else {
            throw new IllegalArgumentException("Email inválido");
        }
    }
}
```

### Relação com Construtores

```java
class Pessoa {
    private String nome;
    private int idade;

    // Construtor inicializa atributos
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Modificadores de Acesso**: `private`, `public`, `protected`
- **Atributos Static**: Compartilhados entre todas instâncias
- **Atributos Final**: Imutáveis após inicialização
- **Getters/Setters**: Acesso controlado a atributos privados
- **JavaBeans**: Convenção de propriedades

---

## 📚 Conclusão

Atributos são variáveis declaradas em nível de classe que armazenam estado de objetos - cada instância tem sua própria cópia (exceto `static`). Declarados com sintaxe `tipo nome;`, recebem valores padrão automáticos (0, null, false), e são acessíveis por todos métodos da classe.

Dominar declaração de atributos significa:
- Declarar em nível de classe (fora de métodos): `tipo nomeAtributo;`
- Compreender que cada objeto tem cópia independente dos atributos
- Usar inicialização inline quando apropriado: `int contador = 0;`
- Conhecer valores padrão: primitivos = 0/false, referências = null
- Evitar shadowing usando `this.` quando parâmetro tem mesmo nome
- Declarar um atributo por linha (legibilidade)
- Posicionar atributos no topo da classe (convenção)
- Usar atributos para estado persistente, variáveis locais para temporários
- Aplicar encapsulamento: atributos `private`, acesso via métodos

Atributos são "memória" do objeto - enquanto métodos definem comportamento, atributos definem estado. São diferença entre classe (blueprint) e objeto (instância com dados específicos). Pessoa tem `nome` como atributo - `pessoa1.nome = "Alice"` e `pessoa2.nome = "Bob"` são possíveis porque cada objeto tem seu próprio espaço para atributos.
