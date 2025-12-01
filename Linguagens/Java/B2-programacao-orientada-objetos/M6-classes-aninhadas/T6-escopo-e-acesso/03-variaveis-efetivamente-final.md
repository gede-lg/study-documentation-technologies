# T6.03 - Variáveis Efetivamente Final

## Introdução

**Efetivamente final**: variável local não modificada após inicialização.

```java
public void processar() {
    int contador = 0; // Efetivamente final
    
    Runnable r = () -> {
        System.out.println(contador); // ✅ OK
    };
    
    // contador++; // ❌ Se descomentar, erro
}
```

**Local/Anonymous class**: só acessa variáveis efetivamente final.

---

## Fundamentos

### 1. Variável Final Explícita

**final**: declaração explícita.

```java
public void processar() {
    final String prefixo = ">> "; // final explícito
    
    Runnable r = new Runnable() {
        @Override
        public void run() {
            System.out.println(prefixo + "Teste"); // ✅ OK
        }
    };
    
    r.run(); // >> Teste
}
```

### 2. Variável Efetivamente Final

**Efetivamente final**: não modificada, sem `final`.

```java
public void processar() {
    String msg = "Olá"; // Sem final, mas efetivamente final
    
    Runnable r = () -> System.out.println(msg); // ✅ OK
    
    r.run(); // Olá
    
    // msg = "Tchau"; // ❌ Se descomentar, erro
}
```

### 3. Erro ao Modificar Variável

**Modificar**: causa erro de compilação.

```java
public void processar() {
    int contador = 0;
    
    Runnable r = () -> {
        // ❌ ERRO: contador não é efetivamente final
        // System.out.println(contador);
    };
    
    contador++; // Modificação torna não-final
}
```

### 4. Múltiplas Variáveis Efetivamente Final

**Múltiplas**: todas devem ser efetivamente final.

```java
public void processar() {
    String prefixo = ">> ";
    String sufixo = " <<";
    int numero = 42;
    
    Runnable r = () -> {
        System.out.println(prefixo + numero + sufixo);
    };
    
    r.run(); // >> 42 <<
}
```

### 5. Parâmetros do Método São Efetivamente Final

**Parâmetros**: efetivamente final por padrão.

```java
public void processar(String mensagem) {
    Runnable r = () -> System.out.println(mensagem); // ✅ OK
    
    r.run();
    
    // mensagem = "Outra"; // ❌ Se descomentar, erro
}

processar("Teste"); // Teste
```

### 6. Workaround: Array de Um Elemento

**Array**: contornar limitação.

```java
public void processar() {
    final int[] contador = {0}; // Array é final, conteúdo não
    
    Runnable r = () -> {
        contador[0]++; // ✅ Modifica conteúdo (não o array)
        System.out.println("Contador: " + contador[0]);
    };
    
    r.run(); // Contador: 1
    r.run(); // Contador: 2
}
```

### 7. Workaround: Classe Wrapper

**Wrapper**: encapsular valor mutável.

```java
class Contador {
    int valor = 0;
}

public void processar() {
    final Contador contador = new Contador(); // Referência final
    
    Runnable r = () -> {
        contador.valor++; // ✅ Modifica campo (não a referência)
        System.out.println("Valor: " + contador.valor);
    };
    
    r.run(); // Valor: 1
    r.run(); // Valor: 2
}
```

### 8. AtomicInteger para Contador

**AtomicInteger**: thread-safe e mutável.

```java
import java.util.concurrent.atomic.AtomicInteger;

public void processar() {
    final AtomicInteger contador = new AtomicInteger(0);
    
    Runnable r = () -> {
        int valor = contador.incrementAndGet();
        System.out.println("Contador: " + valor);
    };
    
    r.run(); // Contador: 1
    r.run(); // Contador: 2
}
```

### 9. Lambda com Variável Efetivamente Final

**Lambda**: mesma regra.

```java
public void processar() {
    String nome = "João";
    int idade = 30;
    
    Runnable r = () -> {
        System.out.println(nome + " tem " + idade + " anos");
    };
    
    r.run(); // João tem 30 anos
}
```

### 10. For-Each Loop - Variável Efetivamente Final

**For-each**: variável de iteração é efetivamente final.

```java
public void processar() {
    String[] nomes = {"Ana", "João", "Maria"};
    
    for (String nome : nomes) {
        Runnable r = () -> System.out.println(nome); // ✅ OK
        r.run();
    }
}
// Ana
// João
// Maria
```

---

## Aplicabilidade

**Efetivamente final necessário para**:
- Local classes
- Anonymous classes
- Lambdas

**Variável efetivamente final quando**:
- Inicializada uma vez
- Nunca modificada após inicialização
- Pode ou não ter `final` explícito

---

## Armadilhas

### 1. Modificar Após Captura

```java
public void processar() {
    int valor = 10;
    
    Runnable r = () -> {
        // ❌ ERRO: valor não é efetivamente final
        // System.out.println(valor);
    };
    
    valor = 20; // Modificação
}
```

### 2. Confundir Referência com Conteúdo

```java
public void processar() {
    final List<String> lista = new ArrayList<>();
    
    Runnable r = () -> {
        lista.add("Item"); // ✅ OK: modifica conteúdo, não referência
        System.out.println(lista);
    };
    
    r.run(); // [Item]
    
    // lista = new ArrayList<>(); // ❌ ERRO: tenta modificar referência
}
```

### 3. For Loop Tradicional

```java
public void processar() {
    for (int i = 0; i < 3; i++) {
        Runnable r = () -> {
            // ❌ ERRO: i não é efetivamente final (modificado no loop)
            // System.out.println(i);
        };
    }
    
    // ✅ Usar final local
    for (int i = 0; i < 3; i++) {
        final int indice = i;
        Runnable r = () -> System.out.println(indice);
        r.run();
    }
}
```

---

## Boas Práticas

### 1. Preferir final Explícito

```java
// ✅ final explícito = mais claro
public void processar() {
    final String prefixo = ">> ";
    
    Runnable r = () -> System.out.println(prefixo + "Teste");
}
```

### 2. Usar AtomicInteger para Contadores

```java
// ✅ AtomicInteger para contador mutável
import java.util.concurrent.atomic.AtomicInteger;

public void processar() {
    final AtomicInteger contador = new AtomicInteger(0);
    
    button.addActionListener(e -> {
        int cliques = contador.incrementAndGet();
        System.out.println("Cliques: " + cliques);
    });
}
```

### 3. Usar Wrapper Class para Mutabilidade

```java
// ✅ Wrapper class
class MutableInt {
    int valor;
}

public void processar() {
    final MutableInt contador = new MutableInt();
    
    Runnable r = () -> {
        contador.valor++;
        System.out.println(contador.valor);
    };
}
```

### 4. For-Each em Vez de For Tradicional

```java
// ✅ For-each = variável efetivamente final
List<String> nomes = Arrays.asList("Ana", "João");

for (String nome : nomes) {
    Runnable r = () -> System.out.println(nome); // ✅ OK
}

// ❌ For tradicional
for (int i = 0; i < nomes.size(); i++) {
    // int i não é efetivamente final
}
```

### 5. Copiar Variável para final Local

```java
// ✅ Copiar para final local
public void processar() {
    int contador = 0;
    
    for (int i = 0; i < 3; i++) {
        final int indice = i; // Cópia final
        Runnable r = () -> System.out.println(indice);
        r.run();
    }
    
    contador++;
}
```

---

## Resumo

**Efetivamente final**: variável local não modificada após inicialização.

```java
// ✅ Efetivamente final
int valor = 10;
Runnable r = () -> System.out.println(valor);

// ❌ NÃO efetivamente final
int contador = 0;
Runnable r2 = () -> System.out.println(contador);
contador++; // Modifica
```

**Regras**:
- Variável local ou parâmetro
- Inicializada uma vez
- Nunca modificada
- Pode ter `final` explícito ou não

**Quem precisa**:
- Local classes
- Anonymous classes
- Lambdas

**Workarounds para mutabilidade**:
- Array de um elemento: `final int[] contador = {0};`
- Wrapper class: `final MutableInt contador = new MutableInt();`
- AtomicInteger: `final AtomicInteger contador = new AtomicInteger(0);`
- Coleções: `final List<T> lista = new ArrayList<>();` (modifica conteúdo)

**For loops**:
- For-each: variável efetivamente final ✅
- For tradicional: `i` não é efetivamente final ❌

**Boas práticas**:
- Preferir `final` explícito
- AtomicInteger para contadores
- Wrapper class para mutabilidade
- For-each em vez de for tradicional
- Copiar para final local quando necessário

**Regra de Ouro**: **Local/Anonymous class** e **lambda** só acessam variáveis **efetivamente final** (não modificadas). Use **final explícito** para clareza. Para mutabilidade, use **array**, **wrapper class**, ou **AtomicInteger**.
