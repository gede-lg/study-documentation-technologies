# T9.04 - Chamadas de Métodos em Sequência

## Introdução

**Sequência chamadas**: stack trace mostra **caminho** até o erro.

```java
/*
 * SEQUÊNCIA DE CHAMADAS
 * 
 * EXECUÇÃO (baixo → cima):
 * main() → metodoA() → metodoB() → metodoC() → ERRO
 * 
 * STACK TRACE (cima → baixo):
 * at metodoC ← ERRO (topo)
 * at metodoB
 * at metodoA
 * at main    ← INÍCIO (base)
 */

// ✅ Rastrear sequência de chamadas
public class Exemplo {
    public static void main(String[] args) {
        metodoA();  // 1. main chama metodoA
    }
    
    static void metodoA() {
        metodoB();  // 2. metodoA chama metodoB
    }
    
    static void metodoB() {
        metodoC();  // 3. metodoB chama metodoC
    }
    
    static void metodoC() {
        throw new RuntimeException("Erro!");  // 4. metodoC lança exceção
    }
}

/*
 * STACK TRACE:
 * java.lang.RuntimeException: Erro!
 *     at Exemplo.metodoC(Exemplo.java:18)  ← 4. ERRO
 *     at Exemplo.metodoB(Exemplo.java:14)  ← 3. metodoB chamou metodoC
 *     at Exemplo.metodoA(Exemplo.java:10)  ← 2. metodoA chamou metodoB
 *     at Exemplo.main(Exemplo.java:5)      ← 1. main chamou metodoA
 * 
 * CAMINHO: main → metodoA → metodoB → metodoC → ERRO
 */
```

**Sequência**: ler **baixo** (início) → **cima** (erro).

---

## Fundamentos

### 1. Pilha de Chamadas (Call Stack)

```java
// ✅ Pilha de chamadas (stack frames)
public class CallStack {
    
    public static void main(String[] args) {
        System.out.println("1. Entrou em main");
        A();
        System.out.println("5. Voltou para main");
    }
    
    static void A() {
        System.out.println("2. Entrou em A");
        B();
        System.out.println("4. Voltou para A");
    }
    
    static void B() {
        System.out.println("3. Entrou em B");
        // Retorna
    }
}

/*
 * EXECUÇÃO:
 * 1. Entrou em main
 * 2. Entrou em A
 * 3. Entrou em B
 * 4. Voltou para A
 * 5. Voltou para main
 * 
 * PILHA (durante execução de B):
 * ┌──────────┐
 * │ B()      │ ← Topo (atual)
 * ├──────────┤
 * │ A()      │
 * ├──────────┤
 * │ main()   │ ← Base
 * └──────────┘
 * 
 * Se B() lançar exceção:
 * at B() ← Topo
 * at A()
 * at main() ← Base
 */
```

**Pilha**: métodos **empilhados**, último chamado no **topo**.

### 2. Ordem Inversa (LIFO)

```java
// ✅ Last In, First Out (LIFO)
public class OrdemInversa {
    
    public static void main(String[] args) {
        try {
            primeiro();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void primeiro() {
        segundo();
    }
    
    static void segundo() {
        terceiro();
    }
    
    static void terceiro() {
        throw new RuntimeException("Erro no terceiro");
    }
}

/*
 * ORDEM DE CHAMADA (cronológica):
 * 1. main()
 * 2. primeiro()
 * 3. segundo()
 * 4. terceiro() → ERRO
 * 
 * STACK TRACE (ordem INVERSA):
 * at terceiro()  ← Último chamado (topo)
 * at segundo()
 * at primeiro()
 * at main()      ← Primeiro chamado (base)
 * 
 * LIFO:
 *   - Last In (terceiro) → First Out (topo)
 *   - First In (main) → Last Out (base)
 */
```

**LIFO**: último chamado (**terceiro**) no **topo**.

### 3. Rastrear Caminho

```java
// ✅ Rastrear caminho de execução
public class RastrearCaminho {
    
    public static void main(String[] args) {
        try {
            iniciar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void iniciar() {
        preparar();
    }
    
    static void preparar() {
        processar();
    }
    
    static void processar() {
        validar();
    }
    
    static void validar() {
        throw new IllegalStateException("Estado inválido");
    }
}

/*
 * STACK TRACE:
 * java.lang.IllegalStateException: Estado inválido
 *     at RastrearCaminho.validar(RastrearCaminho.java:25)
 *     at RastrearCaminho.processar(RastrearCaminho.java:21)
 *     at RastrearCaminho.preparar(RastrearCaminho.java:17)
 *     at RastrearCaminho.iniciar(RastrearCaminho.java:13)
 *     at RastrearCaminho.main(RastrearCaminho.java:6)
 * 
 * CAMINHO (baixo → cima):
 * main (linha 6)
 *   ↓
 * iniciar (linha 13)
 *   ↓
 * preparar (linha 17)
 *   ↓
 * processar (linha 21)
 *   ↓
 * validar (linha 25) → ERRO
 * 
 * IDENTIFICAR:
 *   - ONDE começou: main
 *   - COMO chegou: iniciar → preparar → processar → validar
 *   - ONDE errou: validar linha 25
 */
```

**Rastrear**: seguir **baixo** (main) → **cima** (erro).

### 4. Recursão no Stack Trace

```java
// ✅ Recursão aparece múltiplas vezes
public class RecursaoStackTrace {
    
    public static void main(String[] args) {
        try {
            recursivo(5);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void recursivo(int n) {
        System.out.println("recursivo(" + n + ")");
        if (n == 0) {
            throw new RuntimeException("Base atingida");
        }
        recursivo(n - 1);  // Chamada recursiva
    }
}

/*
 * EXECUÇÃO:
 * recursivo(5) → recursivo(4) → recursivo(3) → recursivo(2) → recursivo(1) → recursivo(0) → ERRO
 * 
 * STACK TRACE:
 * java.lang.RuntimeException: Base atingida
 *     at RecursaoStackTrace.recursivo(RecursaoStackTrace.java:14)
 *     at RecursaoStackTrace.recursivo(RecursaoStackTrace.java:16)  ← recursivo(1)
 *     at RecursaoStackTrace.recursivo(RecursaoStackTrace.java:16)  ← recursivo(2)
 *     at RecursaoStackTrace.recursivo(RecursaoStackTrace.java:16)  ← recursivo(3)
 *     at RecursaoStackTrace.recursivo(RecursaoStackTrace.java:16)  ← recursivo(4)
 *     at RecursaoStackTrace.recursivo(RecursaoStackTrace.java:16)  ← recursivo(5)
 *     at RecursaoStackTrace.main(RecursaoStackTrace.java:6)
 * 
 * MESMA LINHA (16) repetida:
 *   - Cada chamada recursiva
 *   - Empilhadas
 */
```

**Recursão**: método aparece **múltiplas** vezes (empilhado).

### 5. Profundidade da Pilha

```java
// ✅ Profundidade da pilha (stack depth)
public class ProfundidadePilha {
    
    public static void main(String[] args) {
        try {
            recursivo(0);
        } catch (StackOverflowError e) {
            System.err.println("StackOverflowError!");
            
            // Stack trace muito longo (truncado)
            StackTraceElement[] stack = e.getStackTrace();
            System.err.println("Profundidade: " + stack.length);
            
            // Primeiros frames
            for (int i = 0; i < 5; i++) {
                System.err.println(stack[i]);
            }
            System.err.println("...");
        }
    }
    
    static void recursivo(int n) {
        recursivo(n + 1);  // Recursão infinita
    }
}

/*
 * STACK OVERFLOW:
 * 
 * java.lang.StackOverflowError
 *     at ProfundidadePilha.recursivo(ProfundidadePilha.java:23)
 *     at ProfundidadePilha.recursivo(ProfundidadePilha.java:23)
 *     at ProfundidadePilha.recursivo(ProfundidadePilha.java:23)
 *     ... (milhares de frames)
 *     at ProfundidadePilha.recursivo(ProfundidadePilha.java:23)
 *     at ProfundidadePilha.main(ProfundidadePilha.java:6)
 * 
 * Profundidade: ~10000-15000 (depende da JVM)
 * 
 * SAÍDA:
 * StackOverflowError!
 * Profundidade: 12345
 * ProfundidadePilha.recursivo(ProfundidadePilha.java:23)
 * ProfundidadePilha.recursivo(ProfundidadePilha.java:23)
 * ...
 */
```

**Profundidade**: número de **frames** empilhados.

### 6. Filtrar Frames Relevantes

```java
// ✅ Filtrar frames do seu código (ignorar JDK)
import java.util.Arrays;

public class FiltrarFrames {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            StackTraceElement[] stack = e.getStackTrace();
            
            System.out.println("=== SEU CÓDIGO ===");
            Arrays.stream(stack)
                .filter(f -> f.getClassName().startsWith("FiltrarFrames"))
                .forEach(System.out::println);
            
            System.out.println("\n=== TODOS OS FRAMES ===");
            e.printStackTrace();
        }
    }
    
    static void processar() {
        Arrays.asList("a", null, "c")
            .forEach(s -> System.out.println(s.length()));
    }
}

/*
 * SAÍDA:
 * === SEU CÓDIGO ===
 * FiltrarFrames.lambda$processar$0(FiltrarFrames.java:24)
 * FiltrarFrames.processar(FiltrarFrames.java:23)
 * FiltrarFrames.main(FiltrarFrames.java:8)
 * 
 * === TODOS OS FRAMES ===
 * java.lang.NullPointerException: ...
 *     at FiltrarFrames.lambda$processar$0(FiltrarFrames.java:24)
 *     at java.base/java.util.ArrayList.forEach(ArrayList.java:...)
 *     at FiltrarFrames.processar(FiltrarFrames.java:23)
 *     at FiltrarFrames.main(FiltrarFrames.java:8)
 * 
 * FILTRAR:
 *   - Foco no SEU código
 *   - Ignorar frames JDK (java.*, javax.*)
 */
```

**Filtrar**: focar no **seu** código (ignorar JDK).

### 7. Chamadas Entre Classes

```java
// ✅ Sequência entre classes diferentes
public class ClasseA {
    
    public static void main(String[] args) {
        try {
            metodoA();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void metodoA() {
        ClasseB.metodoB();
    }
}

class ClasseB {
    static void metodoB() {
        ClasseC.metodoC();
    }
}

class ClasseC {
    static void metodoC() {
        throw new RuntimeException("Erro em C");
    }
}

/*
 * STACK TRACE:
 * java.lang.RuntimeException: Erro em C
 *     at ClasseC.metodoC(ClasseA.java:28)      ← ClasseC
 *     at ClasseB.metodoB(ClasseA.java:22)      ← ClasseB
 *     at ClasseA.metodoA(ClasseA.java:13)      ← ClasseA
 *     at ClasseA.main(ClasseA.java:6)          ← ClasseA
 * 
 * CAMINHO ENTRE CLASSES:
 * ClasseA.main
 *    ↓
 * ClasseA.metodoA
 *    ↓
 * ClasseB.metodoB
 *    ↓
 * ClasseC.metodoC → ERRO
 */
```

**Entre classes**: stack trace mostra **todas** as classes.

### 8. Thread Name no Stack Trace

```java
// ✅ Nome da thread no stack trace
public class ThreadStackTrace {
    
    public static void main(String[] args) {
        // Thread principal
        try {
            metodo();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // Thread customizada
        Thread t = new Thread(() -> {
            try {
                metodo();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "MinhaThread");
        t.start();
    }
    
    static void metodo() {
        throw new RuntimeException("Erro");
    }
}

/*
 * SAÍDA:
 * 
 * Exception in thread "main" java.lang.RuntimeException: Erro
 *                     ↑
 *                     Nome da thread
 *     at ThreadStackTrace.metodo(ThreadStackTrace.java:24)
 *     at ThreadStackTrace.main(ThreadStackTrace.java:8)
 * 
 * Exception in thread "MinhaThread" java.lang.RuntimeException: Erro
 *                     ↑
 *                     Nome customizado
 *     at ThreadStackTrace.metodo(ThreadStackTrace.java:24)
 *     at ThreadStackTrace.lambda$main$0(ThreadStackTrace.java:14)
 *     at java.base/java.lang.Thread.run(Thread.java:...)
 */
```

**Thread**: "Exception in thread **name**".

### 9. Comparar Sequências

```java
// ✅ Comparar sequências de chamadas
public class CompararSequencias {
    
    public static void main(String[] args) {
        // Caminho 1: main → A → B → erro
        try {
            A();
        } catch (Exception e) {
            System.out.println("=== CAMINHO 1 ===");
            e.printStackTrace();
        }
        
        // Caminho 2: main → X → B → erro
        try {
            X();
        } catch (Exception e) {
            System.out.println("\n=== CAMINHO 2 ===");
            e.printStackTrace();
        }
    }
    
    static void A() { B(); }
    static void X() { B(); }
    
    static void B() {
        throw new RuntimeException("Erro em B");
    }
}

/*
 * SAÍDA:
 * 
 * === CAMINHO 1 ===
 * java.lang.RuntimeException: Erro em B
 *     at CompararSequencias.B(CompararSequencias.java:28)
 *     at CompararSequencias.A(CompararSequencias.java:24)  ← VIA A
 *     at CompararSequencias.main(CompararSequencias.java:8)
 * 
 * === CAMINHO 2 ===
 * java.lang.RuntimeException: Erro em B
 *     at CompararSequencias.B(CompararSequencias.java:28)
 *     at CompararSequencias.X(CompararSequencias.java:25)  ← VIA X
 *     at CompararSequencias.main(CompararSequencias.java:15)
 * 
 * ERRO MESMO: B linha 28
 * CAMINHO DIFERENTE: A vs X
 */
```

**Comparar**: mesmo **erro**, **caminhos** diferentes.

### 10. Resumo Visual

```java
/*
 * CHAMADAS DE MÉTODOS EM SEQUÊNCIA
 * 
 * PILHA DE CHAMADAS (CALL STACK):
 * 
 * Execução:
 * main() → metodoA() → metodoB() → metodoC() → ERRO
 * 
 * Pilha (durante metodoC):
 * ┌────────────┐
 * │ metodoC()  │ ← Topo (atual)
 * ├────────────┤
 * │ metodoB()  │
 * ├────────────┤
 * │ metodoA()  │
 * ├────────────┤
 * │ main()     │ ← Base
 * └────────────┘
 * 
 * Stack Trace:
 * at metodoC ← Topo (erro)
 * at metodoB
 * at metodoA
 * at main    ← Base (início)
 * 
 * 
 * ORDEM DE LEITURA:
 * 
 * CRONOLÓGICA (baixo → cima):
 * 1. main() ←────────┐
 * 2. metodoA()       │ Ler de baixo
 * 3. metodoB()       │ para cima
 * 4. metodoC() ──────┘ (ordem execução)
 * 
 * STACK TRACE (cima → baixo):
 * at metodoC ←───────┐
 * at metodoB         │ Escrito de cima
 * at metodoA         │ para baixo
 * at main ───────────┘ (ordem inversa)
 * 
 * 
 * LIFO (Last In, First Out):
 * 
 * Last In:  metodoC (último chamado)  → Topo
 * First In: main (primeiro chamado)   → Base
 * 
 * 
 * RASTREAR CAMINHO:
 * 
 * Stack Trace:
 * at D.erro(D.java:10)     ← 4. ERRO
 * at C.processar(C.java:8) ← 3. C chamou D
 * at B.validar(B.java:6)   ← 2. B chamou C
 * at A.executar(A.java:4)  ← 1. A chamou B
 * at Main.main(Main.java:2)← 0. main chamou A
 * 
 * Caminho: Main → A → B → C → D → ERRO
 * 
 * 
 * RECURSÃO:
 * 
 * recursivo(3) → recursivo(2) → recursivo(1) → recursivo(0) → ERRO
 * 
 * Stack Trace:
 * at recursivo(linha:14) ← n=0 (erro)
 * at recursivo(linha:16) ← n=1
 * at recursivo(linha:16) ← n=2
 * at recursivo(linha:16) ← n=3
 * at main(linha:6)
 * 
 * Mesma linha repetida (chamadas recursivas)
 * 
 * 
 * FILTRAR FRAMES:
 * 
 * Todos:
 * at SeuCodigo.metodo(SeuCodigo.java:10)  ← Relevante
 * at java.util.ArrayList.forEach(...)     ← JDK
 * at SeuCodigo.main(SeuCodigo.java:5)     ← Relevante
 * 
 * Filtrado (seu código apenas):
 * at SeuCodigo.metodo(SeuCodigo.java:10)
 * at SeuCodigo.main(SeuCodigo.java:5)
 * 
 * 
 * ENTRE CLASSES:
 * 
 * at ClasseC.metodoC ← ClasseC
 * at ClasseB.metodoB ← ClasseB
 * at ClasseA.metodoA ← ClasseA
 * at Main.main
 * 
 * 
 * THREAD NAME:
 * 
 * Exception in thread "main" ...
 * Exception in thread "Thread-1" ...
 * Exception in thread "MinhaThread" ...
 *                     ↑
 *                     Nome da thread
 */

public class ExemploSequenciaChamadas {
    
    public static void main(String[] args) {
        try {
            nivel1();
        } catch (Exception e) {
            System.out.println("=== STACK TRACE ===");
            e.printStackTrace();
            
            System.out.println("\n=== CAMINHO (baixo → cima) ===");
            StackTraceElement[] stack = e.getStackTrace();
            for (int i = stack.length - 1; i >= 0; i--) {
                System.out.println((stack.length - i) + ". " + 
                    stack[i].getClassName() + "." + 
                    stack[i].getMethodName() + " (linha " + 
                    stack[i].getLineNumber() + ")");
            }
        }
    }
    
    static void nivel1() { nivel2(); }
    static void nivel2() { nivel3(); }
    static void nivel3() {
        throw new RuntimeException("Erro no nível 3");
    }
}

/*
 * SAÍDA:
 * 
 * === STACK TRACE ===
 * java.lang.RuntimeException: Erro no nível 3
 *     at ExemploSequenciaChamadas.nivel3(...)
 *     at ExemploSequenciaChamadas.nivel2(...)
 *     at ExemploSequenciaChamadas.nivel1(...)
 *     at ExemploSequenciaChamadas.main(...)
 * 
 * === CAMINHO (baixo → cima) ===
 * 1. ExemploSequenciaChamadas.main (linha 18)
 * 2. ExemploSequenciaChamadas.nivel1 (linha 36)
 * 3. ExemploSequenciaChamadas.nivel2 (linha 37)
 * 4. ExemploSequenciaChamadas.nivel3 (linha 39)
 */
```

---

## Aplicabilidade

**Sequência chamadas**:
- Mostra **caminho** até o erro
- **Pilha** de métodos empilhados
- Ler **baixo** (início) → **cima** (erro)

---

## Armadilhas

### 1. Ler Ordem Errada

```java
// ❌ Ler de cima para baixo (ordem inversa à execução)

// ✅ Ler de baixo para cima (ordem de execução)
// main → metodoA → metodoB → ERRO
```

### 2. Ignorar Frames Intermediários

```java
// ❌ Olhar apenas primeiro e último frame
// Perde contexto do caminho

// ✅ Analisar todos os frames
// Entender caminho completo
```

---

## Boas Práticas

### 1. Ler Baixo → Cima

```java
// ✅ Seguir ordem cronológica
// main (base) → ... → erro (topo)
```

### 2. Identificar Caminho

```java
// ✅ Rastrear sequência completa
// main → A → B → C → ERRO
```

### 3. Filtrar Seu Código

```java
// ✅ Focar nos seus frames
Arrays.stream(stack)
    .filter(f -> f.getClassName().startsWith("SeuPacote"))
    .forEach(System.out::println);
```

---

## Resumo

**Sequência chamadas**: stack trace mostra **caminho** de execução até erro.

**Pilha (Call Stack)**:
- Métodos **empilhados** (LIFO)
- **Topo**: método atual (último chamado)
- **Base**: método inicial (primeiro chamado, geralmente main)

**Ordem execução** vs **stack trace**:
- **Execução** (cronológica): main → A → B → C → erro
- **Stack trace** (inversa): erro ← C ← B ← A ← main

**Ler stack trace**:
- **Baixo → Cima**: seguir ordem de execução
- **Base** (main): onde começou
- **Topo** (erro): onde falhou
- **Intermediários**: caminho percorrido

**LIFO** (Last In, First Out):
- **Last In**: último chamado (topo)
- **First Out**: primeiro a sair (topo)
- **First In**: primeiro chamado (base)
- **Last Out**: último a sair (base)

**Rastrear caminho**:
```
at erro()      ← 4. Erro (topo)
at metodoC()   ← 3. C chamou erro
at metodoB()   ← 2. B chamou C
at metodoA()   ← 1. A chamou B
at main()      ← 0. main chamou A (base)
```

**Casos especiais**:
- **Recursão**: mesmo método múltiplas vezes (empilhado)
- **Entre classes**: mostra todas as classes no caminho
- **Thread name**: "Exception in thread **nome**"
- **Profundidade**: número de frames empilhados

**Filtrar frames**:
- Focar **seu código** (ignorar java.*, javax.*)
- `stream(stack).filter(f -> f.getClassName().startsWith("SeuPacote"))`

**Comparar sequências**:
- Mesmo **erro**, **caminhos** diferentes
- Frames intermediários revelam como chegou

**Regra de Ouro**: Ler stack trace de **baixo** (main/início) para **cima** (erro) seguindo ordem cronológica de execução. Pilha LIFO: último chamado no topo, primeiro chamado na base. Todos os frames mostram caminho completo percorrido. Recursão empilha mesmo método múltiplas vezes. Filtrar para focar no seu código (ignorar JDK).

