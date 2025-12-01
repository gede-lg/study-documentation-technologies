# Métodos Estáticos

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Métodos estáticos** são métodos marcados com `static` que pertencem à classe, não a instâncias - podem ser chamados sem criar objeto, acessando apenas membros estáticos, representando comportamentos que não dependem do estado de objeto específico. Conceitualmente, método estático é "ação da classe" não "ação do objeto" - `Math.sqrt(25)` calcula raiz sem precisar de objeto Math.

É diferença de contexto: método de instância opera sobre dados DO objeto (`conta.depositar()` modifica `conta.saldo`), método estático opera independente de objeto (`Math.max(a, b)` compara valores, não precisa de estado interno). Método estático não tem `this` - não há "objeto atual" associado.

Propósito é representar comportamentos que são funções puras (entrada → saída, sem estado), utilitários, factories, ou operações sobre atributos estáticos. `Collections.sort(lista)` não precisa de instância Collections - é utilitário. Factory methods (`LocalDate.of(2025, 1, 1)`) criam instâncias sem construtor público.

### Contexto Histórico e Motivação

Métodos estáticos vêm de funções procedurais adaptadas para POO. C tinha funções globais, Java não permite funções fora de classes - `static` oferece equivalente: métodos sem objeto. Smalltalk (POO puro) não tinha static (tudo era objeto), Java pragmaticamente adicionou para utilitários e performance.

**Motivação:** Métodos utilitários (`Math.abs()`, `Collections.sort()`) não precisam de objeto - forçar criar instância (`new Math().abs(-5)`) seria desperdício. Factory methods (`Integer.valueOf()`) fornecem alternativas a construtores. Operações sobre atributos estáticos requerem métodos estáticos para coerência.

### Problema Fundamental que Resolve

**Problema: Utilitários Exigem Instância Desnecessária**

```java
// SEM static - precisa criar objeto para método simples
class Matematica {
    double raizQuadrada(double n) {
        return Math.sqrt(n);
    }
}

Matematica mat = new Matematica();  // ❌ Objeto inútil
double resultado = mat.raizQuadrada(25);
```

**Solução: Método `static` Sem Instância**

```java
// COM static - chamada direta
class Matematica {
    static double raizQuadrada(double n) {
        return Math.sqrt(n);
    }
}

double resultado = Matematica.raizQuadrada(25);  // ✅ Sem objeto
```

**Problema: Factory Precisa de Construtor Público**

```java
// SEM static - construtor público expõe implementação
class Usuario {
    String id;
    String nome;

    public Usuario(String nome) {
        this.id = gerarId();  // Lógica interna exposta
        this.nome = nome;
    }
}
```

**Solução: Factory Method `static`**

```java
// COM static - factory esconde lógica
class Usuario {
    String id;
    String nome;

    private Usuario(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    static Usuario criar(String nome) {
        String id = UUID.randomUUID().toString();
        return new Usuario(id, nome);  // Controle interno
    }
}

Usuario u = Usuario.criar("Alice");  // ✅ API limpa
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Declaração:** `static tipoRetorno nomeMetodo(parametros) { }`
2. **Chamada:** Via classe (`Classe.metodo()`) ou instância (desencorajado)
3. **Sem `this`:** Não tem objeto associado, não pode acessar membros de instância
4. **Acesso Restrito:** Apenas membros estáticos (atributos/métodos static)
5. **Uso Típico:** Utilitários, factories, operações sem estado
6. **Herança:** Não polimórficos (hiding, não overriding)

### Pilares Fundamentais

- **`static tipo metodo()`:** Declaração de método estático
- **Sem Instância:** Chamado sem criar objeto
- **Sem `this`/`super`:** Não referencia objeto atual
- **Apenas Static:** Acessa apenas outros membros estáticos
- **Utilitários:** Funções puras, sem estado

---

## 🧠 Fundamentos Teóricos

### Declaração e Chamada

```java
class StringUtils {
    // Método estático
    static boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    static String capitalize(String str) {
        if (isBlank(str)) return str;  // Chama outro método static
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}

// Chamada via classe
boolean vazio = StringUtils.isBlank("");  // true
String cap = StringUtils.capitalize("alice");  // "Alice"
```

### Restrições de Acesso

```java
class Exemplo {
    // Membros de instância
    int valorInstancia = 10;
    void metodoInstancia() { }

    // Membros estáticos
    static int valorStatic = 20;
    static void metodoStatic() { }

    // Método estático - APENAS acessa static
    static void testeStatic() {
        System.out.println(valorStatic);  // ✅ OK - static acessa static
        metodoStatic();                    // ✅ OK

        // System.out.println(valorInstancia);  // ❌ ERRO - não acessa instância
        // metodoInstancia();  // ❌ ERRO
        // System.out.println(this.valorInstancia);  // ❌ ERRO - 'this' não existe
    }

    // Método de instância - acessa AMBOS
    void testeInstancia() {
        System.out.println(valorInstancia);  // ✅ OK - instância acessa instância
        System.out.println(valorStatic);     // ✅ OK - instância acessa static
        metodoInstancia();                    // ✅ OK
        metodoStatic();                       // ✅ OK
    }
}
```

**Por Quê?** Método estático pode ser chamado sem objeto (`Exemplo.testeStatic()`). Se pudesse acessar `valorInstancia`, de qual objeto? Não há objeto!

---

## 🔍 Análise Conceitual Profunda

### Padrão: Métodos Utilitários

```java
class Arrays {
    // Utilitários sem estado
    static void sort(int[] array) {
        // Implementação de ordenação
    }

    static int binarySearch(int[] array, int chave) {
        // Implementação de busca binária
        return -1;
    }

    static String toString(int[] array) {
        return java.util.Arrays.toString(array);
    }
}

// Uso:
int[] numeros = {3, 1, 4, 1, 5};
Arrays.sort(numeros);
int pos = Arrays.binarySearch(numeros, 4);
```

**Características:**
- Funções puras (entrada → saída)
- Sem estado interno
- Não modificam objetos (exceto parâmetros)

### Padrão: Factory Methods

```java
class Usuario {
    private String id;
    private String nome;
    private String senhaHash;

    private Usuario(String id, String nome, String senhaHash) {
        this.id = id;
        this.nome = nome;
        this.senhaHash = senhaHash;
    }

    // Factory method - cria novo usuário
    static Usuario criar(String nome, String senha) {
        String id = UUID.randomUUID().toString();
        String hash = hashSenha(senha);
        return new Usuario(id, nome, hash);
    }

    // Factory method - carrega existente
    static Usuario carregar(String id, String nome, String hash) {
        return new Usuario(id, nome, hash);
    }

    private static String hashSenha(String senha) {
        return "hash_" + senha;  // Simplificado
    }
}

// Uso:
Usuario novo = Usuario.criar("Alice", "senha123");
Usuario existente = Usuario.carregar("uuid", "Bob", "hash_xyz");
```

**Vantagens:**
- Nomes descritivos (`criar` vs `carregar`)
- Esconde lógica de inicialização
- Permite validação antes de construir
- Pode retornar subclasses ou cache

### Padrão: Singleton

```java
class Configuracao {
    private static Configuracao instancia;

    private Configuracao() { }

    // Método estático para acesso
    static Configuracao getInstance() {
        if (instancia == null) {
            instancia = new Configuracao();
        }
        return instancia;
    }

    // Métodos de instância após obter singleton
    void carregarPropriedades() {
        // ...
    }
}

// Uso:
Configuracao cfg = Configuracao.getInstance();
cfg.carregarPropriedades();
```

### Métodos Estáticos Operando em Atributos Estáticos

```java
class Contador {
    private static int total = 0;

    // Métodos estáticos modificam atributo estático
    static void incrementar() {
        total++;
    }

    static void decrementar() {
        total--;
    }

    static int getTotal() {
        return total;
    }

    static void resetar() {
        total = 0;
    }
}

// Uso:
Contador.incrementar();
Contador.incrementar();
System.out.println(Contador.getTotal());  // 2
Contador.resetar();
System.out.println(Contador.getTotal());  // 0
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Métodos Estáticos

✅ **Use `static` para:**

1. **Funções Utilitárias (Sem Estado):**
   ```java
   class MathUtils {
       static int max(int a, int b) {
           return a > b ? a : b;
       }

       static double celsius ParaFahrenheit(double celsius) {
           return celsius * 9/5 + 32;
       }
   }
   ```

2. **Factory Methods:**
   ```java
   class LocalDate {
       static LocalDate of(int ano, int mes, int dia) {
           return new LocalDate(ano, mes, dia);
       }

       static LocalDate now() {
           return new LocalDate(/* data atual */);
       }
   }
   ```

3. **Operações sobre Atributos Estáticos:**
   ```java
   class Estatisticas {
       private static int totalRequisicoes = 0;

       static void registrarRequisicao() {
           totalRequisicoes++;
       }

       static int getTotalRequisicoes() {
           return totalRequisicoes;
       }
   }
   ```

4. **Conversões e Validações:**
   ```java
   class Validador {
       static boolean isEmail(String str) {
           return str != null && str.contains("@");
       }

       static boolean isCPF(String cpf) {
           // Validação de CPF
           return cpf != null && cpf.matches("\\d{11}");
       }
   }
   ```

### Quando Evitar Métodos Estáticos

❌ **Evite `static` para:**

1. **Comportamento Depende de Estado do Objeto:**
   ```java
   // ❌ ERRADO - precisa de saldo específico da conta
   class ContaBancaria {
       double saldo;

       static void depositar(double valor) {  // ❌ Qual conta?
           // saldo += valor;  // ERRO - não tem 'saldo'
       }
   }

   // ✅ CORRETO - método de instância
   class ContaBancaria {
       double saldo;

       void depositar(double valor) {
           this.saldo += valor;  // Modifica ESTA conta
       }
   }
   ```

2. **Polimorfismo Necessário:**
   ```java
   // ❌ Static não é polimórfico
   class Animal {
       static void emitirSom() {
           System.out.println("Som genérico");
       }
   }

   class Cachorro extends Animal {
       static void emitirSom() {  // Hiding, não Override
           System.out.println("Au au");
       }
   }

   Animal a = new Cachorro();
   a.emitirSom();  // "Som genérico" (não "Au au")
   ```

---

## ⚠️ Limitações e Considerações

### Métodos Estáticos e Herança (Hiding)

```java
class Pai {
    static void metodo() {
        System.out.println("Pai");
    }
}

class Filho extends Pai {
    static void metodo() {  // Hiding, não @Override
        System.out.println("Filho");
    }
}

Pai.metodo();    // "Pai"
Filho.metodo();  // "Filho"

Pai p = new Filho();
p.metodo();      // "Pai" (tipo declarado, não runtime!)
```

**Importante:** Métodos estáticos não são polimórficos - resolução em compile-time, não runtime.

### Métodos Estáticos e Testes

Difíceis de mockar:

```java
// Difícil testar - dependência estática
class Service {
    void processar() {
        String config = Config.getValor();  // Chamada static
    }
}

// Melhor - dependency injection
class Service {
    private Config config;

    Service(Config config) {
        this.config = config;
    }

    void processar() {
        String valor = config.getValor();  // Pode injetar mock
    }
}
```

### Main Method

```java
class Aplicacao {
    // Método static especial - ponto de entrada
    public static void main(String[] args) {
        System.out.println("Olá, mundo!");
    }
}
```

**Por Quê `static`?** JVM chama `main` antes de criar qualquer objeto - precisa ser static.

---

## 🔗 Interconexões Conceituais

### Relação com Modificadores de Acesso

```java
class Exemplo {
    private static void privado() { }      // Apenas classe
    static void packagePrivate() { }       // Mesmo pacote
    protected static void protegido() { }  // Pacote + subclasses
    public static void publico() { }       // Qualquer código
}
```

### Varargs em Métodos Estáticos

```java
class Utilitarios {
    static int somar(int... numeros) {
        int soma = 0;
        for (int n : numeros) {
            soma += n;
        }
        return soma;
    }
}

int resultado = Utilitarios.somar(1, 2, 3, 4, 5);  // 15
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Métodos de Instância:** Operam sobre estado do objeto
- **Polimorfismo:** Métodos de instância são polimórficos, static não
- **Interfaces:** Desde Java 8, podem ter métodos static
- **Dependency Injection:** Alternativa a métodos static

---

## 📚 Conclusão

Métodos estáticos (`static tipo metodo()`) pertencem à classe, chamados sem instância via `Classe.metodo()`, acessando apenas membros estáticos - representando comportamentos independentes de estado de objeto (utilitários, factories, funções puras).

Dominar métodos estáticos significa:
- Declarar com `static`: `static int somar(int a, int b)`
- Chamar sem instância: `Classe.metodo()`, não `objeto.metodo()`
- Não acessa membros de instância - apenas outros static
- Não tem `this` ou `super` - sem objeto associado
- Usar para utilitários sem estado: `Math.sqrt()`, `Collections.sort()`
- Factory methods: `LocalDate.of()`, `Integer.valueOf()`
- Operações sobre atributos estáticos
- Não são polimórficos (hiding, não overriding)
- Main method deve ser static (JVM chama sem instância)
- Dificulta testes (dependências estáticas rígidas)

Método estático é função da classe, não do objeto. `Math.max(a, b)` não precisa de objeto Math - é cálculo puro. Factory methods (`Usuario.criar()`) oferecem alternativas a construtores com nomes descritivos e lógica encapsulada. Erro comum: tornar static método que precisa de estado (`conta.depositar()` não pode ser static - qual conta?). `static` resolve "onde coloco comportamento que não depende de objeto específico?" - utilitários matemáticos, validações, conversões, factories. Método estático é ferramenta para representar comportamentos que transcendem objetos individuais e pertencem à abstração como um todo.
