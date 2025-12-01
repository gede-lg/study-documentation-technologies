# T8.03 - Ordem de Execução: Blocos Estáticos → Blocos de Instância → Construtor

## Introdução e Definição

A **ordem de execução** em Java segue uma sequência bem definida que determina quando cada componente de inicialização é executado ao criar objetos. Compreender essa ordem é fundamental para evitar bugs relacionados a inicialização e para escrever código previsível e correto.

A ordem completa de inicialização, desde o carregamento da classe até a criação do objeto, é:

1. **Carregamento da classe** (ocorre uma única vez)
   - Atributos estáticos inicializados com valores padrão (0, null, false)
   - Inicialização direta de atributos estáticos (`static int x = 10;`)
   - Blocos de inicialização estática (`static {}`)

2. **Criação do objeto** (ocorre toda vez que `new` é chamado)
   - Atributos de instância inicializados com valores padrão
   - Inicialização direta de atributos de instância (`int x = 10;`)
   - Blocos de inicialização de instância (`{}`)
   - Construtor

Essa ordem garante que:
- Recursos estáticos estejam prontos antes de qualquer objeto ser criado
- Atributos tenham valores consistentes antes do construtor executar
- Lógica de inicialização compartilhada execute antes de lógica específica

**Exemplo Completo**:
```java
public class OrdemCompleta {
    private static int valorEstatico = inicializarEstatico(); // 2
    private int valorInstancia = inicializarInstancia();      // 5

    // 3. Bloco estático
    static {
        System.out.println("3. Bloco estático: valorEstatico = " + valorEstatico);
    }

    // 6. Bloco de instância
    {
        System.out.println("6. Bloco instância: valorInstancia = " + valorInstancia);
    }

    // 7. Construtor
    public OrdemCompleta() {
        System.out.println("7. Construtor");
    }

    // 1. Inicialização de atributo estático
    private static int inicializarEstatico() {
        System.out.println("2. Inicializando atributo estático");
        return 100;
    }

    // 4. Inicialização de atributo de instância
    private int inicializarInstancia() {
        System.out.println("5. Inicializando atributo de instância");
        return 200;
    }

    public static void main(String[] args) {
        System.out.println("1. Antes de criar objeto");
        new OrdemCompleta();
        System.out.println("\n8. Criando segundo objeto:");
        new OrdemCompleta();
    }
}

// Saída:
// 1. Antes de criar objeto
// 2. Inicializando atributo estático
// 3. Bloco estático: valorEstatico = 100
// 5. Inicializando atributo de instância
// 6. Bloco instância: valorInstancia = 200
// 7. Construtor
//
// 8. Criando segundo objeto:
// 5. Inicializando atributo de instância
// 6. Bloco instância: valorInstancia = 200
// 7. Construtor
```

---

## 10 Fundamentos Teóricos

### 1. Fase 1: Carregamento da Classe (Uma Única Vez)

A primeira fase ocorre quando a classe é **carregada** pela JVM, antes de qualquer objeto ser criado. Essa fase acontece **apenas uma vez** durante a execução do programa.

**Passos**:
1. Atributos estáticos recebem valores padrão (0, null, false)
2. Inicialização direta de atributos estáticos (na ordem de declaração)
3. Blocos de inicialização estática (na ordem de declaração)

```java
public class FaseCarregamento {
    private static int a = 10;    // 1. Inicialização direta
    private static int b;

    static {                       // 2. Bloco estático
        System.out.println("Bloco estático: a = " + a);
        b = 20;
    }

    private static int c = a + b;  // 3. Inicialização direta (usa a e b)

    static {                       // 4. Segundo bloco estático
        System.out.println("c = " + c);
    }
}

// Ao carregar a classe:
// Bloco estático: a = 10
// c = 30
```

---

### 2. Fase 2: Criação de Objeto (Toda Vez que new é Chamado)

A segunda fase ocorre **toda vez** que um objeto é criado com `new`.

**Passos**:
1. Atributos de instância recebem valores padrão
2. Inicialização direta de atributos de instância (na ordem de declaração)
3. Blocos de inicialização de instância (na ordem de declaração)
4. Corpo do construtor

```java
public class FaseCriacao {
    private int a = 10;     // 1. Inicialização direta
    private int b;

    {                        // 2. Bloco de instância
        System.out.println("Bloco instância: a = " + a);
        b = 20;
    }

    private int c = a + b;   // 3. Inicialização direta (usa a e b)

    {                        // 4. Segundo bloco de instância
        System.out.println("c = " + c);
    }

    public FaseCriacao() {   // 5. Construtor
        System.out.println("Construtor: a=" + a + ", b=" + b + ", c=" + c);
    }
}

// Cada vez que new FaseCriacao() é chamado:
// Bloco instância: a = 10
// c = 30
// Construtor: a=10, b=20, c=30
```

---

### 3. Ordem Completa: Estático → Instância → Construtor

Combinando as duas fases, a ordem completa ao criar o **primeiro objeto** é:

1. **Inicialização estática** (apenas no primeiro objeto):
   - Atributos estáticos (valores padrão → inicialização direta)
   - Blocos estáticos
2. **Inicialização de instância** (todo objeto):
   - Atributos de instância (valores padrão → inicialização direta)
   - Blocos de instância
3. **Construtor**

```java
public class OrdemCompleta {
    private static int estatico = 1;
    private int instancia = 2;

    static { System.out.println("1. Bloco estático"); }
    { System.out.println("3. Bloco instância"); }

    public OrdemCompleta() {
        System.out.println("4. Construtor");
    }

    public static void main(String[] args) {
        System.out.println("Criando primeiro objeto:");
        new OrdemCompleta();
        System.out.println("\nCriando segundo objeto:");
        new OrdemCompleta();
    }
}

// Saída:
// Criando primeiro objeto:
// 1. Bloco estático
// 3. Bloco instância
// 4. Construtor
//
// Criando segundo objeto:
// 3. Bloco instância
// 4. Construtor
```

---

### 4. Ordem com Herança: Superclasse Antes de Subclasse

Em hierarquias de herança, a ordem segue o princípio de **superclasse antes de subclasse**:

1. **Estático**:
   - Superclasse (atributos estáticos → blocos estáticos)
   - Subclasse (atributos estáticos → blocos estáticos)

2. **Instância** (ao criar objeto):
   - Superclasse (atributos de instância → blocos de instância → construtor)
   - Subclasse (atributos de instância → blocos de instância → construtor)

```java
class Pai {
    private static int estaticoPai = 1;
    private int instanciaPai = 2;

    static { System.out.println("1. Bloco estático Pai"); }
    { System.out.println("3. Bloco instância Pai"); }

    public Pai() {
        System.out.println("4. Construtor Pai");
    }
}

class Filho extends Pai {
    private static int estaticoFilho = 10;
    private int instanciaFilho = 20;

    static { System.out.println("2. Bloco estático Filho"); }
    { System.out.println("5. Bloco instância Filho"); }

    public Filho() {
        System.out.println("6. Construtor Filho");
    }
}

// Criando objeto Filho:
new Filho();
// Saída:
// 1. Bloco estático Pai
// 2. Bloco estático Filho
// 3. Bloco instância Pai
// 4. Construtor Pai
// 5. Bloco instância Filho
// 6. Construtor Filho
```

---

### 5. Ordem com super() e this()

Quando um construtor chama `super()` ou `this()`, a ordem é:

- **`super()`** (chamada ao construtor da superclasse):
  1. Inicialização de instância da superclasse (atributos → blocos)
  2. Construtor da superclasse
  3. Inicialização de instância da subclasse (atributos → blocos)
  4. Resto do construtor da subclasse

- **`this()`** (chamada a outro construtor da mesma classe):
  1. Atributos de instância → blocos de instância
  2. Construtor chamado via `this()`
  3. Resto do construtor atual

```java
public class ComThis {
    private int valor = 10;

    { System.out.println("Bloco: valor = " + valor); }

    public ComThis(int valor) {
        System.out.println("Construtor principal: valor = " + valor);
        this.valor = valor;
    }

    public ComThis() {
        this(100); // Chama outro construtor
        System.out.println("Construtor padrão");
    }
}

new ComThis();
// Saída:
// Bloco: valor = 10
// Construtor principal: valor = 100
// Construtor padrão
```

---

### 6. Atributos Inicializados em Ordem de Declaração

Atributos (estáticos e de instância) são inicializados na **ordem em que aparecem** no código.

```java
public class OrdemAtributos {
    private int a = 10;
    private int b = a + 5;  // Usa 'a' (já inicializado)
    private int c = a + b;  // Usa 'a' e 'b' (já inicializados)

    public OrdemAtributos() {
        System.out.println("a=" + a + ", b=" + b + ", c=" + c);
    }
}

new OrdemAtributos();
// Saída: a=10, b=15, c=25
```

Se você inverter a ordem, `b` tentaria usar `a` antes de ele estar inicializado:

```java
private int b = a + 5;  // 'a' ainda é 0 (valor padrão)!
private int a = 10;     // 'a' inicializado depois

// b = 5, não 15!
```

---

### 7. Blocos Múltiplos Executam em Ordem

Se houver múltiplos blocos de inicialização (estática ou de instância), eles executam na ordem de declaração.

```java
public class MultiplosBlocos {
    { System.out.println("Bloco 1"); }
    { System.out.println("Bloco 2"); }
    { System.out.println("Bloco 3"); }

    public MultiplosBlocos() {
        System.out.println("Construtor");
    }
}

new MultiplosBlocos();
// Saída:
// Bloco 1
// Bloco 2
// Bloco 3
// Construtor
```

---

### 8. Construtores Delegados com this()

Quando um construtor chama `this()`, o construtor chamado executa **depois** dos blocos de instância.

```java
public class Delegacao {
    { System.out.println("1. Bloco de instância"); }

    public Delegacao(int valor) {
        System.out.println("2. Construtor principal: " + valor);
    }

    public Delegacao() {
        this(100);
        System.out.println("3. Construtor padrão");
    }
}

new Delegacao();
// Saída:
// 1. Bloco de instância
// 2. Construtor principal: 100
// 3. Construtor padrão
```

---

### 9. Valores Padrão Antes de Inicialização Explícita

Antes de qualquer inicialização explícita, atributos recebem **valores padrão**:
- Numéricos: `0`, `0.0`, `0L`
- `boolean`: `false`
- Referências: `null`

```java
public class ValoresPadrao {
    private int numero;        // Padrão: 0
    private boolean flag;      // Padrão: false
    private String texto;      // Padrão: null

    {
        System.out.println("numero = " + numero);   // 0
        System.out.println("flag = " + flag);       // false
        System.out.println("texto = " + texto);     // null
    }

    public ValoresPadrao() {
        numero = 10;
        flag = true;
        texto = "Texto";
    }
}
```

---

### 10. Ordem Completa com Todos os Elementos

Resumo da ordem **completa** ao criar um objeto de uma subclasse:

1. **Carregamento da superclasse** (primeira vez):
   - Atributos estáticos da superclasse (padrão → inicialização direta → blocos estáticos)

2. **Carregamento da subclasse** (primeira vez):
   - Atributos estáticos da subclasse (padrão → inicialização direta → blocos estáticos)

3. **Criação do objeto** (toda vez):
   - **Superclasse**:
     - Atributos de instância (padrão → inicialização direta)
     - Blocos de instância da superclasse
     - Construtor da superclasse
   - **Subclasse**:
     - Atributos de instância (padrão → inicialização direta)
     - Blocos de instância da subclasse
     - Construtor da subclasse

---

## Aplicabilidade

### Quando a Ordem de Execução Importa

1. **Dependências Entre Atributos**: Quando um atributo depende de outro.
   ```java
   private int base = 10;
   private int dobro = base * 2; // Deve vir DEPOIS de 'base'
   ```

2. **Inicialização de Recursos**: Quando recursos devem ser inicializados em ordem específica.
   ```java
   private Connection conexao;
   private Statement statement;

   {
       conexao = conectar();
       statement = conexao.createStatement(); // Depende de 'conexao'
   }
   ```

3. **Herança**: Quando a subclasse depende de recursos da superclasse.
   ```java
   class Pai {
       protected Resource recurso;
       { recurso = inicializar(); }
   }

   class Filho extends Pai {
       { recurso.usar(); } // Usa recurso da superclasse (já inicializado)
   }
   ```

4. **Configuração Antes do Construtor**: Quando você precisa garantir que atributos estejam configurados antes do construtor.
   ```java
   {
       configurarPadrao();
   }

   public Exemplo() {
       // Configuração já aplicada
   }
   ```

### Quando a Ordem NÃO Importa

- Atributos independentes que não se referenciam
- Lógica simples sem dependências

---

## Armadilhas Comuns

### 1. Usar Atributo Antes de Inicialização

```java
public class Problema {
    private int b = a + 1; // ERRO: 'a' ainda é 0 (valor padrão)
    private int a = 10;

    public Problema() {
        System.out.println("b = " + b); // 1, não 11!
    }
}
```

**Solução**: Declare atributos na ordem de dependência.

```java
private int a = 10;
private int b = a + 1; // OK: b = 11
```

---

### 2. Confundir Ordem com Herança

Esquecer que blocos e construtores da superclasse executam **antes** dos da subclasse.

```java
class Pai {
    protected int valor;
    { valor = 10; }
}

class Filho extends Pai {
    {
        System.out.println("valor = " + valor); // 10 (já inicializado pelo Pai)
    }
}
```

---

### 3. Dependência Circular Entre Atributos

```java
public class Circular {
    private int a = b + 1;
    private int b = a + 1; // Dependência circular!

    public Circular() {
        System.out.println("a = " + a + ", b = " + b); // a = 1, b = 1
    }
}
```

**Explicação**: `a` usa `b` (ainda 0), então `a = 1`. Depois `b` usa `a` (agora 1), então `b = 2`? Não, `b = a + 1` já foi avaliado quando `a` ainda era 0.

---

### 4. Chamar Métodos em Blocos que Dependem de Atributos Não Inicializados

```java
public class Problema {
    private int valor;

    {
        processar(); // Chama método antes de 'valor' ser inicializado
    }

    private int valor2 = 10;

    private void processar() {
        System.out.println("valor = " + valor);   // 0 (padrão)
        System.out.println("valor2 = " + valor2); // 0 (ainda não inicializado!)
    }
}
```

---

### 5. Exceções em Blocos de Inicialização

Se um bloco lançar exceção, a inicialização falha.

```java
public class Problema {
    {
        throw new RuntimeException("Erro!");
    }

    public Problema() {
        System.out.println("Construtor");
    }
}

new Problema(); // Exception: Erro! (construtor nunca executado)
```

---

## Boas Práticas

### 1. Declare Atributos na Ordem de Dependência

```java
private int a = 10;
private int b = a + 1;  // Usa 'a' (já inicializado)
private int c = a + b;  // Usa 'a' e 'b' (já inicializados)
```

---

### 2. Use Blocos Para Lógica Comum, Construtores Para Lógica Específica

```java
{
    // Lógica comum a todos os construtores
    inicializarPadrao();
}

public Exemplo(String nome) {
    // Lógica específica deste construtor
    this.nome = nome;
}
```

---

### 3. Documente Dependências Complexas

Se a ordem de inicialização é crítica, documente.

```java
/**
 * IMPORTANTE: 'conexao' deve ser inicializada antes de 'statement'.
 */
private Connection conexao = conectar();
private Statement statement = conexao.createStatement();
```

---

### 4. Evite Lógica Complexa em Inicialização de Atributos

Prefira blocos de inicialização ou construtores para lógica complexa.

```java
// Evitar
private Map<String, String> config = criarMapaComplexo();

// Preferir
private Map<String, String> config;
{
    config = criarMapaComplexo();
}
```

---

### 5. Use final Para Atributos Que Não Mudam

```java
private final int CONSTANTE = 100;
```

---

### 6. Teste a Ordem com Logging

Para entender a ordem em código complexo, adicione logging temporário.

```java
static { System.out.println("Bloco estático"); }
{ System.out.println("Bloco instância"); }
public Exemplo() { System.out.println("Construtor"); }
```

---

### 7. Em Herança, Inicialize Recursos da Superclasse Primeiro

Garanta que a superclasse inicialize recursos antes de a subclasse usá-los.

---

### 8. Evite Chamar Métodos Overridable em Blocos ou Construtores

Chamar métodos que podem ser sobrescritos em blocos ou construtores pode causar comportamento inesperado.

```java
class Pai {
    {
        metodo(); // Perigoso: pode chamar versão da subclasse antes de ela estar pronta
    }

    public void metodo() { ... }
}

class Filho extends Pai {
    private int valor = 10;

    @Override
    public void metodo() {
        System.out.println(valor); // valor ainda pode ser 0!
    }
}
```

---

### 9. Prefira Construtores a Blocos Para Lógica Específica

Se a lógica só se aplica a um construtor, coloque-a no construtor, não em um bloco.

---

### 10. Use Ferramentas de Análise Estática

Ferramentas como SonarLint podem detectar problemas de ordem de inicialização.

---

## Resumo Executivo

A **ordem de execução** em Java ao criar objetos segue uma sequência rigorosa:

**Fase 1: Carregamento da Classe** (uma única vez):
1. Atributos estáticos (valores padrão → inicialização direta)
2. Blocos de inicialização estática (`static {}`)

**Fase 2: Criação do Objeto** (toda vez que `new` é chamado):
1. Atributos de instância (valores padrão → inicialização direta)
2. Blocos de inicialização de instância (`{}`)
3. Construtor

**Com Herança**:
- **Estático**: Superclasse → Subclasse
- **Instância**: Superclasse (atributos → blocos → construtor) → Subclasse (atributos → blocos → construtor)

**Regras Importantes**:
- Atributos inicializados na **ordem de declaração**
- Blocos múltiplos executam na **ordem de declaração**
- Valores **padrão** (0, false, null) antes de inicialização explícita
- **Superclasse** sempre antes de **subclasse**
- Blocos executam **antes** do construtor

**Ordem Completa** (criando primeiro objeto de subclasse):
1. Carregamento superclasse (estáticos)
2. Carregamento subclasse (estáticos)
3. Instância superclasse (atributos → blocos → construtor)
4. Instância subclasse (atributos → blocos → construtor)

**Boas Práticas**:
- Declare atributos na **ordem de dependência**
- Use blocos para lógica **comum**, construtores para lógica **específica**
- **Documente** dependências complexas
- Evite lógica complexa em inicialização de atributos
- Use **`final`** para atributos imutáveis
- Teste ordem com **logging** quando necessário
- Evite chamar métodos **overridable** em blocos/construtores

**Armadilhas**:
- Usar atributo antes de inicialização (ordem errada)
- Dependências circulares entre atributos
- Chamar métodos em blocos que dependem de atributos não inicializados
- Esquecer ordem em herança (superclasse primeiro)
- Exceções em blocos impedem inicialização

Compreender a ordem de execução é fundamental para escrever código **previsível**, **correto** e **livre de bugs** relacionados a inicialização.
