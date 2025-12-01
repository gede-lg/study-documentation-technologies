# Atributos Estáticos (Variáveis de Classe)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Atributos estáticos** (variáveis de classe) são atributos marcados com `static` que pertencem à classe, não a instâncias individuais - existindo uma única cópia compartilhada por todos os objetos, independente de quantas instâncias forem criadas. Conceitualmente, atributo estático é "propriedade coletiva" - enquanto atributo de instância é "eu tenho meu próprio valor", estático é "nós compartilhamos este valor".

É diferença fundamental de propriedade: `pessoa1.nome` pertence a `pessoa1`, mas `Pessoa.populacaoTotal` pertence à classe `Pessoa` - todas instâncias veem e modificam o mesmo valor. Modificar atributo estático em qualquer lugar afeta todos que o acessam - é variável global no escopo da classe.

Propósito é representar dados que pertencem conceitualmente à classe, não a objetos: contadores de instâncias criadas, configurações compartilhadas, constantes matemáticas, caches globais. `Math.PI` não faz sentido ter cópia por objeto Math (aliás, Math não pode ser instanciado) - é valor universal, estático.

### Contexto Histórico e Motivação

Atributos estáticos vêm de linguagens procedurais (variáveis globais em C) adaptados para POO. Java herdou de C++ necessidade de expressar "dados de classe" vs "dados de objeto". `static` em Java significa "alocado estaticamente" (method area), não na heap por objeto.

**Motivação:** Expressar dados compartilhados sem variáveis globais (Java não tem globais verdadeiras). Contadores, constantes, caches, pools de recursos - todos exigem armazenamento único, não duplicado por instância. `static` oferece escopo de classe mantendo encapsulamento (private static).

### Problema Fundamental que Resolve

**Problema: Dados Compartilhados Duplicados**

```java
// SEM static - cada usuário tem cópia separada do contador
class Usuario {
    int totalCriado = 0;  // ❌ Cada objeto tem próprio contador

    Usuario() {
        totalCriado++;
    }
}

Usuario u1 = new Usuario();  // u1.totalCriado = 1
Usuario u2 = new Usuario();  // u2.totalCriado = 1 (não acumulou!)
Usuario u3 = new Usuario();  // u3.totalCriado = 1

// Quantos usuários? Impossível saber - cada tem contador próprio
```

**Solução: `static` Compartilha Único Valor**

```java
// COM static - um único contador para todos
class Usuario {
    static int totalCriado = 0;  // ✅ Compartilhado

    Usuario() {
        totalCriado++;  // Incrementa contador global
    }
}

Usuario u1 = new Usuario();  // Usuario.totalCriado = 1
Usuario u2 = new Usuario();  // Usuario.totalCriado = 2
Usuario u3 = new Usuario();  // Usuario.totalCriado = 3

System.out.println(Usuario.totalCriado);  // 3 ✅
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Declaração:** `static tipo nomeAtributo [= valorInicial];`
2. **Compartilhamento:** Uma cópia única para classe, não uma por objeto
3. **Acesso:** Via classe (`Classe.atributo`) ou instância (desencorajado)
4. **Inicialização:** Valor padrão → inline → bloco static
5. **Timing:** Criado ao carregar classe (lazy loading), antes de qualquer instância
6. **Memória:** Method Area (Metaspace), não heap
7. **Uso Típico:** Contadores, constantes (`static final`), configurações, caches

### Pilares Fundamentais

- **`static tipo nome`:** Declaração de atributo estático
- **Compartilhado:** Todos objetos veem mesmo valor
- **Classe, não Instância:** Pertence à classe
- **Constantes:** `static final` para valores imutáveis universais
- **Acesso:** `NomeClasse.atributo` (preferido)

---

## 🧠 Fundamentos Teóricos

### Declaração e Inicialização

```java
class Configuracao {
    // Atributos estáticos com inicialização inline
    static String versao = "2.0";
    static int maxConexoes = 100;
    static boolean debugMode = false;

    // Constante (static final)
    static final double TAXA = 0.15;

    // Sem inicialização (valor padrão)
    static int contador;  // 0 (valor padrão)

    // Tipos referência
    static List<String> logs = new ArrayList<>();
}
```

**Valores Padrão:** Como atributos de instância, static recebem valores padrão se não inicializados:
- Numéricos: `0`, `0.0`, `0L`, `0.0f`
- `boolean`: `false`
- `char`: `'\u0000'`
- Referências: `null`

### Acesso a Atributos Estáticos

```java
class Produto {
    static int totalProdutos = 0;
    int id;

    Produto() {
        totalProdutos++;  // Acesso direto (dentro da classe)
        id = totalProdutos;
    }
}

// Acesso externo
System.out.println(Produto.totalProdutos);  // ✅ Via classe (preferido)

Produto p = new Produto();
System.out.println(p.totalProdutos);  // ⚠️ Via instância (funciona mas confuso)
```

**Convenção:** Sempre acesse atributos estáticos via nome da classe, não via instância.

### Modificação de Atributos Estáticos

```java
class Contador {
    static int valor = 0;

    static void incrementar() {
        valor++;  // Modifica valor compartilhado
    }

    void incrementarInstancia() {
        valor++;  // Método de instância também pode modificar
    }
}

Contador.incrementar();  // valor = 1

Contador c1 = new Contador();
c1.incrementarInstancia();  // valor = 2

Contador c2 = new Contador();
c2.incrementarInstancia();  // valor = 3

System.out.println(Contador.valor);  // 3 (todos modificaram o mesmo)
```

---

## 🔍 Análise Conceitual Profunda

### Constantes: `static final`

Padrão comum para constantes universais:

```java
class Matematica {
    // Constantes matemáticas
    public static final double PI = 3.141592653589793;
    public static final double E = 2.718281828459045;

    // Constantes de configuração
    public static final int MAX_TENTATIVAS = 3;
    public static final String VERSAO = "1.0.0";
}

// Uso:
double circunferencia = 2 * Matematica.PI * raio;
```

**Convenção:** `static final` em UPPER_SNAKE_CASE.

**Imutabilidade:** `final` garante que referência não muda, mas objeto referenciado pode ser mutável:

```java
class Config {
    // Referência final, mas lista mutável
    static final List<String> OPCOES = new ArrayList<>();

    static {
        OPCOES.add("A");
        OPCOES.add("B");
    }
}

Config.OPCOES.add("C");  // ✅ Permitido (lista é mutável)
// Config.OPCOES = new ArrayList<>();  // ❌ ERRO (referência é final)
```

**Imutabilidade Completa:**

```java
class ConfigSegura {
    // Lista imutável
    static final List<String> OPCOES = List.of("A", "B", "C");
}

// ConfigSegura.OPCOES.add("D");  // ❌ UnsupportedOperationException
```

### Contadores Globais

```java
class Pedido {
    static int totalPedidos = 0;
    static int pedidosCancelados = 0;

    int numeroPedido;
    boolean cancelado;

    Pedido() {
        totalPedidos++;
        numeroPedido = totalPedidos;
    }

    void cancelar() {
        if (!cancelado) {
            pedidosCancelados++;
            cancelado = true;
        }
    }

    static int getPedidosAtivos() {
        return totalPedidos - pedidosCancelados;
    }
}

Pedido p1 = new Pedido();  // totalPedidos = 1
Pedido p2 = new Pedido();  // totalPedidos = 2
Pedido p3 = new Pedido();  // totalPedidos = 3
p2.cancelar();              // pedidosCancelados = 1

System.out.println(Pedido.getPedidosAtivos());  // 2
```

### Caches e Pools

```java
class StringPool {
    // Cache de strings frequentes
    private static Map<String, String> cache = new HashMap<>();

    static String intern(String str) {
        return cache.computeIfAbsent(str, k -> k);
    }

    static int getCacheSize() {
        return cache.size();
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Atributos Estáticos

✅ **Use `static` para:**

1. **Contadores de Instâncias:**
   ```java
   class Usuario {
       static int totalUsuarios = 0;
       Usuario() { totalUsuarios++; }
   }
   ```

2. **Constantes Universais:**
   ```java
   class FisicaConstantes {
       static final double VELOCIDADE_LUZ = 299792458;  // m/s
       static final double GRAVIDADE = 9.81;            // m/s²
   }
   ```

3. **Configurações Globais:**
   ```java
   class AppConfig {
       static String ambiente = "PRODUCTION";
       static int timeout = 30000;
   }
   ```

4. **Caches Compartilhados:**
   ```java
   class Cache {
       static Map<String, Object> dados = new ConcurrentHashMap<>();
   }
   ```

### Quando Evitar Atributos Estáticos

❌ **Evite `static` para:**

1. **Dados Específicos do Objeto:**
   ```java
   // ❌ ERRADO
   class Pessoa {
       static String nome;  // Todas pessoas teriam mesmo nome!
   }

   // ✅ CORRETO
   class Pessoa {
       String nome;  // Cada pessoa tem nome próprio
   }
   ```

2. **Estado Mutável Compartilhado Sem Sincronização:**
   ```java
   // ⚠️ PERIGOSO - race condition
   class Contador {
       static int valor = 0;
       static void incrementar() { valor++; }  // Não thread-safe
   }
   ```

---

## ⚠️ Limitações e Considerações

### Atributos Estáticos e Herança

Atributos estáticos são herdados mas não polimórficos:

```java
class Pai {
    static int x = 10;
}

class Filho extends Pai {
    static int x = 20;  // "Hiding" (esconde), não "Override"
}

System.out.println(Pai.x);    // 10
System.out.println(Filho.x);  // 20

Pai p = new Filho();
System.out.println(p.x);  // 10 (tipo declarado Pai, não runtime Filho)
```

### Serialização e Atributos Estáticos

Atributos estáticos **não** são serializados:

```java
class Dados implements Serializable {
    static int contador = 100;  // Não será serializado
    int valor = 42;             // Será serializado
}
```

### Memória e Garbage Collection

Atributos estáticos vivem até JVM terminar - cuidado com memory leaks:

```java
// ⚠️ MEMORY LEAK
class CacheProblematico {
    static Map<String, byte[]> cache = new HashMap<>();  // Nunca limpa!

    static void adicionar(String chave, byte[] dados) {
        cache.put(chave, dados);  // Acumula indefinidamente
    }
}

// ✅ MELHOR - com limite ou limpeza
class CacheSeguro {
    static Map<String, byte[]> cache = new LinkedHashMap<>(100, 0.75f, true) {
        protected boolean removeEldestEntry(Map.Entry eldest) {
            return size() > 100;  // Limita a 100 entradas
        }
    };
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Modificadores de Acesso

```java
class Exemplo {
    private static int privado = 1;      // Apenas classe
    static int packagePrivate = 2;       // Mesmo pacote
    protected static int protegido = 3;  // Pacote + subclasses
    public static int publico = 4;       // Qualquer código
}
```

**Encapsulamento:** Atributos estáticos geralmente devem ser `private` com getters/setters:

```java
class Config {
    private static String ambiente = "DEV";

    public static String getAmbiente() {
        return ambiente;
    }

    public static void setAmbiente(String amb) {
        if (amb == null) throw new IllegalArgumentException();
        ambiente = amb;
    }
}
```

### Relação com Inicialização

Ordem de inicialização estática:

```java
class Ordem {
    static int a = 10;  // 1️⃣ Inline static

    static {
        a += 5;  // 2️⃣ Bloco static (a = 15)
    }

    static int b = a + 10;  // 3️⃣ Inline static (b = 25)
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Métodos Estáticos:** Comportamentos que operam sobre atributos estáticos
- **Blocos Static:** Inicialização complexa de atributos estáticos
- **Singleton Pattern:** Usa atributo static para instância única
- **Enum:** Constantes type-safe como alternativa a `static final`

---

## 📚 Conclusão

Atributos estáticos (`static tipo nome`) pertencem à classe, não a instâncias - uma única cópia compartilhada por todos objetos, criada ao carregar classe, acessada via `Classe.atributo`. Representam dados coletivos (contadores, configurações, constantes) em vez de individuais.

Dominar atributos estáticos significa:
- Declarar com `static`: `static int contador = 0;`
- Uma única cópia compartilhada, não uma por objeto
- Criados ao carregar classe (antes de qualquer `new`)
- Acessar via classe: `Classe.atributo`, não `objeto.atributo`
- Usar para contadores globais, constantes, configurações compartilhadas
- `static final` para constantes imutáveis em UPPER_SNAKE_CASE
- Valores padrão automáticos (0, null, false) se não inicializados
- Modificação em qualquer lugar afeta todos que acessam
- Não são serializados, vivem até JVM terminar
- Não são polimórficos (hiding, não overriding na herança)
- Cuidado com concorrência - static compartilhado entre threads

Atributo estático é propriedade da classe, não do objeto. `Pessoa.populacaoTotal` faz sentido ser static (valor coletivo), `pessoa.nome` não (valor individual). Erro comum: usar static para dados que deveriam ser por objeto, causando compartilhamento indesejado. `static` resolve "onde guardo contador de quantas instâncias foram criadas?" - não pode ser por instância (cada uma teria contador separado), deve ser da classe (único e compartilhado). Constantes como `Math.PI` são naturalmente static - PI não varia por objeto Math, é verdade universal. Atributo estático é ferramenta para representar dados que transcendem objetos individuais e pertencem à abstração como um todo.
