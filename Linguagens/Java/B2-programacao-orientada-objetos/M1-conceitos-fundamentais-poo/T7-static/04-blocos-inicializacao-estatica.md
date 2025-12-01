# Blocos de Inicialização Estática

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Bloco de inicialização estática** (static initialization block) é bloco de código marcado com `static { }` executado uma única vez quando classe é carregada pela JVM, antes de qualquer instância ser criada ou método estático ser chamado - usado para inicialização complexa de atributos estáticos que não cabe em inicialização inline simples.

Conceitualmente, bloco static é "código de setup da classe" - executa automaticamente ao carregar classe, preparando ambiente estático (atributos, configurações, caches) antes que qualquer código use a classe. É constructor da classe, não do objeto - roda uma vez por classe, não uma vez por objeto.

Propósito é permitir lógica complexa de inicialização estática: loops, condicionais, try-catch, múltiplas linhas - coisas impossíveis em inicialização inline (`static int x = valor;`). Carregar configurações de arquivo, popular cache, registrar drivers - operações que exigem código procedural, não apenas atribuição.

### Contexto Histórico e Motivação

Blocos static vêm de necessidade de executar código ao carregar classe. C++ tinha construtores estáticos explícitos, Java simplificou com blocos `static { }`. Desde Java 1.0, blocos static são forma padrão de inicialização complexa.

**Motivação:** Inicialização inline é limitada - apenas expressões simples. Bloco static oferece poder completo da linguagem: loops para popular arrays, try-catch para carregar recursos, múltiplas operações sequenciais. JDBC drivers usam blocos static para se registrar: `static { DriverManager.registerDriver(new MySQLDriver()); }`.

### Problema Fundamental que Resolve

**Problema: Inicialização Inline Limitada**

```java
// ❌ Impossível - inicialização inline não suporta loops/lógica
class Dados {
    static int[] numeros = ???;  // Como popular com loop?

    // ❌ ERRO - não pode ter código procedural aqui
    for (int i = 0; i < 10; i++) {
        numeros[i] = i * 2;
    }
}
```

**Solução: Bloco Static com Lógica Completa**

```java
// ✅ Bloco static permite lógica complexa
class Dados {
    static int[] numeros;

    static {
        numeros = new int[10];
        for (int i = 0; i < 10; i++) {
            numeros[i] = i * 2;
        }
    }
}
```

**Problema: Exceções em Inicialização**

```java
// ❌ Inline não suporta try-catch
class Config {
    static Properties props = new Properties();
    props.load(new FileInputStream("config.properties"));  // ❌ ERRO - checked exception
}
```

**Solução: Bloco Static com Try-Catch**

```java
// ✅ Bloco static permite tratamento de exceções
class Config {
    static Properties props;

    static {
        props = new Properties();
        try {
            props.load(new FileInputStream("config.properties"));
        } catch (IOException e) {
            // Fallback para valores padrão
            props.setProperty("timeout", "30");
        }
    }
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Sintaxe:** `static { código }`
2. **Execução:** Uma vez, ao carregar classe (lazy loading)
3. **Timing:** Inline static → Blocos static (ordem de declaração)
4. **Propósito:** Inicialização complexa de atributos estáticos
5. **Múltiplos Blocos:** Permitidos, executam na ordem
6. **Exceções:** Podem lançar apenas unchecked ou tratar com try-catch

### Pilares Fundamentais

- **`static { }`:** Bloco de código estático
- **Uma Vez:** Executa ao carregar classe
- **Ordem:** Inline → blocos (sequencial)
- **Lógica Completa:** Loops, condicionais, try-catch
- **Antes de Tudo:** Antes de instâncias ou chamadas static

---

## 🧠 Fundamentos Teóricos

### Sintaxe e Execução Básica

```java
class Exemplo {
    static int x;

    static {
        System.out.println("Bloco static executado");
        x = 100;
    }

    static void metodo() {
        System.out.println("Método static");
    }
}

// Primeira referência à classe:
System.out.println(Exemplo.x);
// Saída:
// "Bloco static executado"
// 100

// Segunda referência - bloco NÃO executa novamente
Exemplo.metodo();
// Saída:
// "Método static"
```

### Ordem de Inicialização Estática

```java
class Ordem {
    // 1️⃣ Inline static primeiro
    static int a = 10;

    // 2️⃣ Bloco static primeiro
    static {
        System.out.println("Bloco 1: a=" + a);  // a = 10
        a += 5;  // a = 15
    }

    // 3️⃣ Inline static segundo
    static int b = a + 10;  // b = 25 (a já é 15)

    // 4️⃣ Bloco static segundo
    static {
        System.out.println("Bloco 2: b=" + b);  // b = 25
        b += 10;  // b = 35
    }
}

// Primeira referência:
System.out.println(Ordem.b);
// Saída:
// Bloco 1: a=10
// Bloco 2: b=25
// 35
```

**Regra:** Inline e blocos static executam na ordem de declaração no código fonte.

### Múltiplos Blocos Estáticos

```java
class Multiplos {
    static String resultado;

    static {
        System.out.println("Bloco 1");
        resultado = "A";
    }

    static {
        System.out.println("Bloco 2");
        resultado += "B";
    }

    static {
        System.out.println("Bloco 3");
        resultado += "C";
    }
}

System.out.println(Multiplos.resultado);
// Saída:
// Bloco 1
// Bloco 2
// Bloco 3
// ABC
```

---

## 🔍 Análise Conceitual Profunda

### Casos de Uso Comuns

#### 1. Popular Coleções Estáticas

```java
class Codigos {
    static final Map<String, Integer> HTTP_STATUS;

    static {
        Map<String, Integer> temp = new HashMap<>();
        temp.put("OK", 200);
        temp.put("NOT_FOUND", 404);
        temp.put("INTERNAL_ERROR", 500);

        HTTP_STATUS = Collections.unmodifiableMap(temp);
    }
}
```

#### 2. Carregar Recursos

```java
class DatabaseConfig {
    static Properties props;
    static String url;
    static String username;

    static {
        props = new Properties();
        try {
            props.load(new FileInputStream("db.properties"));
            url = props.getProperty("db.url");
            username = props.getProperty("db.username");
        } catch (IOException e) {
            throw new ExceptionInInitializerError(e);
        }
    }
}
```

#### 3. Registrar Drivers (JDBC)

```java
class MySQLDriver implements Driver {
    static {
        try {
            DriverManager.registerDriver(new MySQLDriver());
        } catch (SQLException e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    // Implementação do driver...
}
```

#### 4. Inicializar Arrays Complexos

```java
class Primos {
    static int[] primeiros100Primos;

    static {
        primeiros100Primos = new int[100];
        int contador = 0;
        int numero = 2;

        while (contador < 100) {
            if (isPrimo(numero)) {
                primeiros100Primos[contador++] = numero;
            }
            numero++;
        }
    }

    private static boolean isPrimo(int n) {
        // Implementação...
        return true;
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Blocos Static

✅ **Use bloco static quando:**

1. **Inicialização Requer Loops:**
   ```java
   static {
       for (int i = 0; i < 100; i++) {
           array[i] = calcular(i);
       }
   }
   ```

2. **Inicialização Requer Try-Catch:**
   ```java
   static {
       try {
           recurso = carregarRecurso();
       } catch (Exception e) {
           recurso = getDefault();
       }
   }
   ```

3. **Inicialização com Múltiplas Etapas:**
   ```java
   static {
       etapa1();
       etapa2();
       etapa3();
   }
   ```

4. **Popular Coleções Imutáveis:**
   ```java
   static {
       Map<String, String> temp = new HashMap<>();
       temp.put("A", "valor1");
       temp.put("B", "valor2");
       MAPA = Collections.unmodifiableMap(temp);
   }
   ```

### Quando Evitar Blocos Static

❌ **Evite quando:**

1. **Inline Simples Basta:**
   ```java
   // ✅ Inline é suficiente
   static int x = 10;

   // ❌ Bloco desnecessário
   static int y;
   static { y = 20; }
   ```

2. **Lógica Muito Complexa:**
   ```java
   // ⚠️ Considere método helper
   static {
       // 50+ linhas de lógica
   }

   // ✅ Melhor
   static {
       inicializar();
   }

   private static void inicializar() {
       // Lógica aqui
   }
   ```

---

## ⚠️ Limitações e Considerações

### Exceções em Blocos Static

Blocos static podem lançar apenas unchecked exceptions ou tratar checked:

```java
// ❌ ERRO - checked exception não tratada
class Problema {
    static {
        throw new IOException();  // ❌ Checked exception
    }
}

// ✅ OK - unchecked exception
class OkUnchecked {
    static {
        throw new RuntimeException();  // ✅ Unchecked
    }
}

// ✅ OK - checked tratada
class OkTratada {
    static {
        try {
            throw new IOException();
        } catch (IOException e) {
            throw new ExceptionInInitializerError(e);  // Wrapped
        }
    }
}
```

### ExceptionInInitializerError

Se bloco static lança exceção, classe não é inicializada:

```java
class Falha {
    static {
        throw new RuntimeException("Erro!");
    }
}

// Tentativa de usar:
try {
    System.out.println(Falha.class);
} catch (ExceptionInInitializerError e) {
    System.out.println("Inicialização falhou: " + e.getCause());
}
```

### Ordem com Herança

```java
class Pai {
    static { System.out.println("Static Pai"); }
}

class Filho extends Pai {
    static { System.out.println("Static Filho"); }
}

// Primeira referência a Filho:
Filho f = new Filho();
// Saída:
// Static Pai
// Static Filho
```

**Ordem:** Superclasse static → Subclasse static.

---

## 🔗 Interconexões Conceituais

### Relação com Inicialização de Instância

```java
class Completo {
    // Static
    static int valorStatic = 10;
    static { valorStatic += 5; }

    // Instância
    int valorInstancia = 20;
    { valorInstancia += 5; }

    Completo() {
        valorInstancia += 10;
    }
}

// Primeira instância:
Completo c = new Completo();
// Ordem:
// 1. valorStatic = 10 (inline static)
// 2. static { } executa (valorStatic = 15)
// 3. valorInstancia = 20 (inline instância)
// 4. { } executa (valorInstancia = 25)
// 5. Construtor executa (valorInstancia = 35)
```

### Relação com Lazy Loading

Classes são carregadas lazy (sob demanda):

```java
class A {
    static { System.out.println("A carregada"); }
}

class B {
    static { System.out.println("B carregada"); }
}

// Nada impresso ainda (classes não carregadas)

A.class.getName();  // "A carregada"
// B ainda não carregada

B.class.getName();  // "B carregada"
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **Blocos de Inicialização de Instância:** `{ }` sem static
- **Ordem de Inicialização Completa:** Static → padrão → inline → blocos → construtor
- **Class Loading:** Quando/como classes são carregadas
- **ClassLoader:** Mecanismo de carregamento de classes

---

## 📚 Conclusão

Blocos de inicialização estática (`static { }`) executam uma vez ao carregar classe, permitindo lógica complexa (loops, condicionais, try-catch) para inicializar atributos estáticos que não podem ser inicializados inline.

Dominar blocos static significa:
- Sintaxe: `static { código }`
- Executa UMA vez ao carregar classe (lazy loading)
- Ordem: inline static → blocos static (sequencial na declaração)
- Múltiplos blocos permitidos, executam em ordem
- Permite loops, condicionais, try-catch - lógica completa
- Usado para popular coleções, carregar recursos, registrar drivers
- Exceções: apenas unchecked ou tratar checked com try-catch
- ExceptionInInitializerError se bloco falhar
- Herança: static superclasse executa antes de subclasse
- Não confundir com bloco de instância `{ }` (sem static)

Bloco static é "construtor da classe" - executa ao carregar, não ao instanciar. JDBC drivers usam para se registrar, coleções imutáveis usam para popular valores. Não é para lógica de negócio, é para setup inicial da classe. Erro comum: colocar lógica pesada que trava carregamento de classe. Alternativa: lazy initialization (carregar sob demanda via método). Bloco static resolve "como executo código complexo ao carregar classe?" - mais poderoso que inline `static int x = valor;`, permite lógica procedural completa. É ferramenta para preparar ambiente estático da classe antes que qualquer código a use.
