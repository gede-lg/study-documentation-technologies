# Variáveis Locais vs Atributos

## 🎯 Introdução e Definição

**Variáveis locais** são variáveis declaradas **dentro de métodos**, blocos ou construtores - existem apenas durante a **execução** daquele escopo. **Atributos** (ou campos/fields) são variáveis declaradas **no corpo da classe** - existem enquanto o **objeto existir**. Locais têm **escopo limitado** (bloco onde foram declaradas), atributos têm **escopo de classe** (toda a classe). Locais **não têm valor padrão** (devem ser inicializadas), atributos **têm valor padrão** (0, false, null).

**Conceito central**: **Local** = temporária (durante método), **Atributo** = permanente (durante objeto). Local é **stack** (criada e destruída com método), atributo é **heap** (criada com objeto, destruída com GC). Local é **privada ao método**, atributo é **compartilhada** entre métodos. É como **rascunho** (local) vs **caderno** (atributo) - rascunho existe só durante tarefa, caderno persiste.

**Analogia completa**:
- **Variável local**: Anotação em post-it (descartada ao fim da reunião)
- **Atributo**: Dados em prontuário médico (persiste entre consultas)
- **Escopo local**: Visível só na reunião atual
- **Escopo atributo**: Acessível em todas as consultas
- **Stack**: Mesa de trabalho (limpa ao fim)
- **Heap**: Arquivo (permanece)

**Estrutura**:
```java
public class Produto {
    // ATRIBUTOS (declarados no corpo da classe)
    private String nome;      // Escopo: toda a classe
    private double preco;     // Lifetime: enquanto objeto existir
    private int estoque;      // Default: 0, null, false
    
    public void calcularDesconto() {
        // VARIÁVEL LOCAL (declarada no método)
        double desconto = preco * 0.1;  // Escopo: apenas este método
        //     ↑                         // Lifetime: durante execução
        // Deve ser inicializada          // Sem valor padrão
        
        double precoFinal = preco - desconto;  // Outra local
        
        System.out.println(precoFinal);
        
        // desconto e precoFinal deixam de existir aqui
    }
    
    public void exibir() {
        // ✓ Pode acessar atributos:
        System.out.println(nome);    // Atributo visível
        System.out.println(preco);   // Atributo visível
        
        // ❌ NÃO pode acessar variáveis locais de outro método:
        // System.out.println(desconto);  // ERRO: não existe aqui
    }
}
```

**Exemplo completo**:
```java
public class ContaBancaria {
    // ATRIBUTOS (estado do objeto)
    private double saldo;           // Default: 0.0
    private String titular;         // Default: null
    private int numeroTransacoes;   // Default: 0
    
    public ContaBancaria(String titular) {
        // PARÂMETRO (variável local)
        // 'titular' existe apenas durante construtor
        
        this.titular = titular;  // Atributo = parâmetro
        this.saldo = 0.0;        // Atributo inicializado
    }
    
    public void depositar(double valor) {
        // PARÂMETRO 'valor' (variável local)
        
        // VARIÁVEL LOCAL
        double novoSaldo = this.saldo + valor;
        //     ↑ Existe apenas durante método
        
        // VARIÁVEL LOCAL
        String mensagem = "Depósito de R$ " + valor;
        
        // Modificar ATRIBUTO
        this.saldo = novoSaldo;
        this.numeroTransacoes++;  // Atributo persiste
        
        System.out.println(mensagem);
        
        // 'valor', 'novoSaldo', 'mensagem' deixam de existir aqui
    }
    
    public double getSaldo() {
        // VARIÁVEL LOCAL
        double saldoAtual = this.saldo;  // Cópia do atributo
        
        return saldoAtual;  // Retorna local (cópia)
        
        // 'saldoAtual' deixa de existir
    }
    
    public void processarJuros() {
        // VARIÁVEL LOCAL
        double taxa = 0.05;  // Existe apenas aqui
        
        // Bloco aninhado
        if (saldo > 1000) {
            // VARIÁVEL LOCAL (escopo do if)
            double bonus = 10.0;
            //     ↑ Existe apenas dentro do if
            
            this.saldo += bonus;
        }
        
        // bonus NÃO existe aqui (fora do if)
        // System.out.println(bonus);  // ERRO
        
        this.saldo += this.saldo * taxa;  // taxa ainda existe
    }
}

// USO:
ContaBancaria conta = new ContaBancaria("João");
// ATRIBUTOS criados: saldo=0.0, titular="João", numeroTransacoes=0

conta.depositar(100);
// VARIÁVEIS LOCAIS criadas: valor=100, novoSaldo=100, mensagem="..."
// ATRIBUTOS modificados: saldo=100, numeroTransacoes=1
// VARIÁVEIS LOCAIS destruídas ao fim do método

double saldo = conta.getSaldo();
// VARIÁVEL LOCAL criada: saldoAtual=100
// VARIÁVEL LOCAL destruída ao fim do método
// saldo (fora da classe) = 100
```

## 📋 Fundamentos Teóricos

### 1️⃣ Declaração e Localização

**Atributos** (campos da classe):
```java
public class Pessoa {
    // ATRIBUTOS - declarados no CORPO DA CLASSE
    private String nome;
    private int idade;
    private double altura;
    
    // Fora de qualquer método/construtor/bloco
}
```

**Variáveis locais** (dentro de métodos):
```java
public void metodo() {
    // VARIÁVEIS LOCAIS - declaradas DENTRO DO MÉTODO
    int x = 10;
    String texto = "Hello";
    double resultado = 0.0;
    
    // Dentro do método/construtor/bloco
}
```

**Comparação**:
```java
public class Exemplo {
    // ↓ ATRIBUTOS
    private int atributo1;
    private String atributo2;
    
    public void metodo() {
        // ↓ VARIÁVEIS LOCAIS
        int local1 = 10;
        String local2 = "texto";
        
        System.out.println(atributo1);  // ✓ Acessa atributo
        System.out.println(local1);     // ✓ Acessa local
    }
    
    public void outroMetodo() {
        System.out.println(atributo1);  // ✓ Acessa atributo
        // System.out.println(local1);  // ❌ ERRO: local1 não existe aqui
    }
}
```

### 2️⃣ Escopo (Visibilidade)

**Atributos** - visíveis em **toda a classe**:
```java
public class Produto {
    private String nome;  // Visível em TODOS os métodos
    private double preco;
    
    public void metodo1() {
        System.out.println(nome);   // ✓ Visível
        System.out.println(preco);  // ✓ Visível
    }
    
    public void metodo2() {
        System.out.println(nome);   // ✓ Visível
        System.out.println(preco);  // ✓ Visível
    }
    
    public String getNome() {
        return nome;  // ✓ Visível
    }
}
```

**Variáveis locais** - visíveis apenas no **bloco** onde foram declaradas:
```java
public void metodo() {
    int x = 10;  // Visível apenas dentro de metodo()
    
    if (x > 5) {
        int y = 20;  // Visível apenas dentro do if
        System.out.println(x);  // ✓ x visível (escopo externo)
        System.out.println(y);  // ✓ y visível (escopo atual)
    }
    
    System.out.println(x);  // ✓ x visível
    // System.out.println(y);  // ❌ ERRO: y não existe fora do if
}
```

**Escopo de bloco**:
```java
public void exemplo() {
    // Escopo do método
    int a = 10;
    
    if (a > 5) {
        // Escopo do if
        int b = 20;
        System.out.println(a);  // ✓ a visível (escopo externo)
    }
    
    for (int i = 0; i < 10; i++) {
        // Escopo do for
        int c = 30;
        System.out.println(a);  // ✓ a visível
        // System.out.println(b);  // ❌ b não existe aqui
    }
    
    // System.out.println(i);  // ❌ i não existe fora do for
    // System.out.println(c);  // ❌ c não existe fora do for
}
```

### 3️⃣ Lifetime (Tempo de Vida)

**Atributos** - existem enquanto **objeto existir**:
```java
Produto p = new Produto();  // Atributos criados (nome, preco)
p.setNome("Mouse");         // Atributos existem
p.calcular();               // Atributos existem
// ... objeto continua existindo
p = null;                   // Atributos destruídos (GC)
```

**Variáveis locais** - existem durante **execução do método**:
```java
public void metodo() {
    // Entrada: variáveis locais criadas
    int x = 10;
    String s = "texto";
    
    // Durante execução: variáveis existem
    System.out.println(x);
    
    // Saída: variáveis destruídas
}

metodo();  // x e s criadas → usadas → destruídas
metodo();  // x e s criadas NOVAMENTE → usadas → destruídas
```

**Comparação**:
```java
public class Exemplo {
    private int contador = 0;  // Atributo (persiste)
    
    public void incrementar() {
        int temp = 1;  // Local (temporária)
        contador += temp;
        
        System.out.println("Contador: " + contador);
        System.out.println("Temp: " + temp);
        
        // temp destruída aqui
    }
}

// Uso:
Exemplo e = new Exemplo();
e.incrementar();  // Contador: 1, Temp: 1 (temp criada e destruída)
e.incrementar();  // Contador: 2, Temp: 1 (temp criada novamente)
e.incrementar();  // Contador: 3, Temp: 1 (temp criada novamente)

// contador PERSISTE entre chamadas (atributo)
// temp é RECRIADA a cada chamada (local)
```

### 4️⃣ Inicialização e Valores Padrão

**Atributos** - valores padrão **automáticos**:
```java
public class Exemplo {
    // ATRIBUTOS - inicialização automática
    private int inteiro;        // 0
    private double decimal;     // 0.0
    private boolean flag;       // false
    private char caractere;     // '\u0000'
    private String texto;       // null
    private Produto produto;    // null
    
    public void exibir() {
        System.out.println(inteiro);   // 0 (padrão)
        System.out.println(decimal);   // 0.0 (padrão)
        System.out.println(flag);      // false (padrão)
        System.out.println(texto);     // null (padrão)
    }
}
```

**Variáveis locais** - **devem** ser inicializadas:
```java
public void metodo() {
    // VARIÁVEIS LOCAIS - SEM inicialização automática
    int x;
    String s;
    
    // System.out.println(x);  // ❌ ERRO: variable x might not have been initialized
    // System.out.println(s);  // ❌ ERRO: variable s might not have been initialized
    
    // DEVE inicializar explicitamente:
    x = 10;
    s = "texto";
    
    System.out.println(x);  // ✓ OK (inicializado)
    System.out.println(s);  // ✓ OK (inicializado)
}
```

**Inicialização condicional**:
```java
public void metodo(boolean condicao) {
    int x;
    
    if (condicao) {
        x = 10;
    }
    
    // System.out.println(x);  // ❌ ERRO: x pode não ter sido inicializado
    
    // Correção:
    int y;
    if (condicao) {
        y = 10;
    } else {
        y = 20;
    }
    
    System.out.println(y);  // ✓ OK (inicializado em todos os caminhos)
}
```

### 5️⃣ Modificadores de Acesso

**Atributos** - podem ter modificadores:
```java
public class Produto {
    public String nome;           // Público (acessível de qualquer lugar)
    private double preco;         // Privado (apenas nesta classe)
    protected int estoque;        // Protegido (subclasses)
    String descricao;             // Default/package (mesmo pacote)
    
    private static int contador;  // Static (pertence à classe)
    private final double PI = 3.14;  // Final (constante)
}
```

**Variáveis locais** - **não podem** ter modificadores de acesso:
```java
public void metodo() {
    // ❌ ERRO - locais NÃO podem ter modificadores de acesso:
    // public int x = 10;      // ERRO
    // private String s = "";  // ERRO
    // protected double d;     // ERRO
    
    // ✓ Podem ser final:
    final int x = 10;  // OK - constante local
    // x = 20;  // ERRO: cannot assign to final variable
    
    // ✓ Declaração normal:
    int y = 20;
    String s = "texto";
}
```

### 6️⃣ Shadowing (Sombreamento)

**Conceito**: Variável local pode **sombrear** atributo com mesmo nome.

**Exemplo**:
```java
public class Produto {
    private String nome;  // Atributo
    
    public void setNome(String nome) {
        //                    ↑ Parâmetro (local) SOMBREIA atributo
        
        // 'nome' aqui se refere ao PARÂMETRO (não ao atributo)
        System.out.println(nome);  // Parâmetro
        
        // Acessar atributo com 'this':
        this.nome = nome;  // this.nome = atributo, nome = parâmetro
    }
}
```

**Shadowing em bloco**:
```java
public class Exemplo {
    private int x = 10;  // Atributo
    
    public void metodo() {
        int x = 20;  // Local SOMBREIA atributo
        
        System.out.println(x);        // 20 (local)
        System.out.println(this.x);   // 10 (atributo)
    }
}
```

**Evitar shadowing**:
```java
// ✓ BOA PRÁTICA - nomes diferentes:
public class Produto {
    private String nome;
    
    public void setNome(String novoNome) {
        this.nome = novoNome;  // Sem ambiguidade
    }
}

// ⚠️ Shadowing - nomes iguais:
public void setNome(String nome) {
    this.nome = nome;  // Usa 'this' para diferenciar
}
```

### 7️⃣ Acesso com this

**Atributos** - acessados com `this.`:
```java
public class Pessoa {
    private String nome;
    private int idade;
    
    public void exibir() {
        // Explícito (com this):
        System.out.println(this.nome);
        System.out.println(this.idade);
        
        // Implícito (sem this, mas equivalente):
        System.out.println(nome);
        System.out.println(idade);
    }
    
    public void setNome(String nome) {
        // NECESSÁRIO quando há shadowing:
        this.nome = nome;  // this.nome = atributo, nome = parâmetro
    }
}
```

**Variáveis locais** - **não usam** this:
```java
public void metodo() {
    int x = 10;  // Local
    
    System.out.println(x);       // ✓ Acesso direto
    // System.out.println(this.x);  // ❌ ERRO (x não é atributo)
}
```

**Contexto estático**:
```java
public class Exemplo {
    private int atributo = 10;
    
    public static void metodoEstatico() {
        int local = 20;
        
        System.out.println(local);  // ✓ OK
        // System.out.println(this.atributo);  // ❌ ERRO: não há 'this' em static
        // System.out.println(atributo);       // ❌ ERRO: não há instância
    }
}
```

### 8️⃣ Memória: Stack vs Heap

**Variáveis locais** - armazenadas na **stack**:
```java
public void metodo() {
    int x = 10;        // Stack
    String s = "ABC";  // Referência na stack, objeto no heap
    
    // Ao sair do método, stack é limpa (x e s destruídos)
}
```

**Atributos** - armazenados no **heap** (com objeto):
```java
public class Produto {
    private String nome;   // Heap (com objeto Produto)
    private double preco;  // Heap
}

Produto p = new Produto();  // p (referência) na stack
                            // Objeto Produto no heap
                            // Atributos (nome, preco) no heap
```

**Diagrama**:
```
STACK:                      HEAP:
┌──────────────┐           ┌─────────────────────┐
│ metodo()     │           │ Produto@1a2b        │
│ - x = 10     │           │ - nome: "Mouse"     │
│ - p ──────────────────> │ - preco: 50.0       │
└──────────────┘           └─────────────────────┘
    ↑                              ↑
  Limpa ao                     Destruído por GC
  sair do método
```

### 9️⃣ Parâmetros como Variáveis Locais

**Conceito**: Parâmetros são **variáveis locais** do método.

**Exemplo**:
```java
public void calcular(int a, int b) {
    //               ↑    ↑
    //           Parâmetros = variáveis locais
    
    int resultado = a + b;  // Outra local
    //  ↑
    // Local
    
    System.out.println(resultado);
    
    // a, b, resultado deixam de existir ao fim do método
}
```

**Escopo**:
```java
public void metodo(int parametro) {
    // 'parametro' existe durante todo o método
    parametro = 100;  // Pode modificar (é variável local)
    
    System.out.println(parametro);  // 100
}

// Fora do método, 'parametro' não existe
```

**Modificação**:
```java
public void incrementar(int x) {
    x++;  // Modifica cópia (parâmetro é local)
}

// Chamada:
int numero = 10;
incrementar(numero);  // Passa cópia
System.out.println(numero);  // 10 (não mudou)
```

### 🔟 Variáveis em Loops

**Conceito**: Variável declarada no **loop** tem escopo limitado ao loop.

**for**:
```java
for (int i = 0; i < 10; i++) {
    //  ↑ 'i' existe apenas dentro do for
    System.out.println(i);
}

// System.out.println(i);  // ❌ ERRO: i não existe fora do for
```

**while**:
```java
int i = 0;  // Fora do while (visível depois)
while (i < 10) {
    int temp = i * 2;  // Dentro do while (destruída a cada iteração)
    System.out.println(temp);
    i++;
}

System.out.println(i);  // ✓ OK (i visível)
// System.out.println(temp);  // ❌ ERRO: temp não existe
```

**foreach**:
```java
int[] numeros = {10, 20, 30};

for (int numero : numeros) {
    //  ↑ 'numero' existe apenas dentro do foreach
    System.out.println(numero);
}

// System.out.println(numero);  // ❌ ERRO: numero não existe fora
```

**Variável de loop reutilizada**:
```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// 'i' destruído

for (int i = 0; i < 10; i++) {  // ✓ OK - novo 'i' (escopo diferente)
    System.out.println(i);
}
```

## 🎯 Aplicabilidade

**Atributos**:
**1. Estado do objeto (dados persistentes)**
**2. Compartilhar dados entre métodos**
**3. Informação acessível externamente (getters)**

**Variáveis locais**:
**1. Cálculos temporários**
**2. Armazenar resultados intermediários**
**3. Evitar poluir objeto com dados temporários**

## ⚠️ Armadilhas Comuns

**1. Usar local sem inicializar**:
```java
int x;
System.out.println(x);  // ❌ ERRO
```

**2. Acessar local fora do escopo**:
```java
if (true) {
    int x = 10;
}
System.out.println(x);  // ❌ ERRO
```

**3. Modificador em local**:
```java
public int x = 10;  // ❌ ERRO (dentro de método)
```

**4. Shadowing acidental**:
```java
private int x = 10;
void metodo() {
    int x = 20;  // Sombreia atributo
}
```

**5. Confundir lifetime**:
```java
void metodo() {
    int contador = 0;  // Recriado a cada chamada
    contador++;
    return contador;  // Sempre 1
}
```

## ✅ Boas Práticas

**1. Inicializar locais explicitamente**:
```java
int x = 0;
String s = "";
```

**2. Minimizar escopo**:
```java
// ✓ Declarar onde usar:
if (condicao) {
    int x = 10;
    usar(x);
}
```

**3. Evitar shadowing**:
```java
// Use nomes diferentes
void setNome(String novoNome) {
    this.nome = novoNome;
}
```

**4. this para atributos em setters**:
```java
this.atributo = parametro;
```

**5. final em locais constantes**:
```java
final int MAX = 100;
```

## 📚 Resumo Executivo

**Local vs Atributo**.

**Atributos**:
```java
class C {
    private int atributo;  // Corpo da classe
    // - Escopo: toda a classe
    // - Lifetime: durante objeto
    // - Default: 0, null, false
    // - Acesso: this.atributo
}
```

**Locais**:
```java
void metodo() {
    int local = 10;  // Dentro de método
    // - Escopo: apenas método/bloco
    // - Lifetime: durante execução
    // - Sem default (deve inicializar)
    // - Acesso: direto
}
```

**Comparação**:
```
           | Atributo      | Local
-----------+---------------+----------------
Declaração | Corpo classe  | Método/bloco
Escopo     | Toda classe   | Bloco
Lifetime   | Objeto        | Execução
Default    | Sim (0, null) | Não
Modificador| public/private| Não (exceto final)
this       | Sim           | Não
Memória    | Heap          | Stack
```

**Shadowing**:
```java
private int x = 10;  // Atributo

void metodo() {
    int x = 20;  // Local (sombreia)
    System.out.println(x);       // 20
    System.out.println(this.x);  // 10
}
```

**Parâmetros**:
```java
void metodo(int parametro) {
    // parametro = variável local
}
```

**Inicialização**:
```java
// Atributo:
private int x;  // ✓ Valor padrão 0

// Local:
int y;  // ❌ Deve inicializar
y = 10;  // ✓ Inicializado
```

**Evitar**:
- Local sem inicializar
- Modificador em local
- Shadowing desnecessário

**Preferir**:
- Escopo mínimo
- Nomes distintos
- this em setters
- final em constantes locais

**Recomendação**: Use **atributos para estado**, **locais para cálculos**, **inicialize locais sempre**, minimize **escopo**, evite **shadowing**, use **this para clareza** em setters, declare **final** para constantes locais.