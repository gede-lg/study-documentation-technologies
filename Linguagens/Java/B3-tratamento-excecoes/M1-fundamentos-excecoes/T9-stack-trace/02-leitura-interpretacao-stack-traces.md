# T9.02 - Leitura e Interpretação de Stack Traces

## Introdução

**Stack trace**: sequência de chamadas de **métodos** até o erro.

```java
/*
 * STACK TRACE
 * 
 * ESTRUTURA:
 *   1. Tipo da exceção
 *   2. Mensagem
 *   3. Sequência de chamadas (stack frames)
 *   4. Causa raiz (Caused by)
 * 
 * EXEMPLO:
 * java.lang.NullPointerException: Cannot invoke "String.length()"
 *     at com.example.App.metodo2(App.java:15)
 *     at com.example.App.metodo1(App.java:10)
 *     at com.example.App.main(App.java:5)
 *     ↑                    ↑          ↑      ↑
 *     Classe              Método   Arquivo Linha
 */

// ✅ Gerar stack trace
public class Exemplo {
    public static void main(String[] args) {
        metodo1();
    }
    
    static void metodo1() {
        metodo2();
    }
    
    static void metodo2() {
        String s = null;
        s.length();  // NullPointerException AQUI
    }
}

/*
 * SAÍDA:
 * Exception in thread "main" java.lang.NullPointerException: ...
 *     at Exemplo.metodo2(Exemplo.java:13)      ← ERRO AQUI
 *     at Exemplo.metodo1(Exemplo.java:9)       ← metodo1 chamou metodo2
 *     at Exemplo.main(Exemplo.java:5)          ← main chamou metodo1
 */
```

**Stack trace**: tipo + mensagem + **sequência** chamadas.

---

## Fundamentos

### 1. Estrutura Básica

```java
// ✅ Stack trace básico
public class EstruturaStackTrace {
    
    public static void main(String[] args) {
        try {
            metodo1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void metodo1() {
        metodo2();
    }
    
    static void metodo2() {
        throw new RuntimeException("Erro intencional");
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.RuntimeException: Erro intencional
 * ↑                           ↑
 * Tipo da exceção             Mensagem
 * 
 *     at EstruturaStackTrace.metodo2(EstruturaStackTrace.java:18)
 *     ↑  ↑                   ↑       ↑                     ↑
 *     at Classe              Método  Arquivo               Linha
 * 
 *     at EstruturaStackTrace.metodo1(EstruturaStackTrace.java:14)
 *     (metodo1 chamou metodo2)
 * 
 *     at EstruturaStackTrace.main(EstruturaStackTrace.java:6)
 *     (main chamou metodo1)
 * 
 * ORDEM: de baixo para cima (main → metodo1 → metodo2)
 * ERRO: primeiro elemento (metodo2)
 */
```

**Estrutura**: tipo + mensagem + frames (classe.método:arquivo:linha).

### 2. Ler de Baixo para Cima

```java
// ✅ Ordem de leitura: baixo → cima
public class OrdemLeitura {
    
    public static void main(String[] args) {
        try {
            A();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void A() { B(); }
    static void B() { C(); }
    static void C() { D(); }
    static void D() {
        throw new RuntimeException("Erro em D");
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.RuntimeException: Erro em D
 *     at OrdemLeitura.D(OrdemLeitura.java:18)  ← 4. ERRO AQUI
 *     at OrdemLeitura.C(OrdemLeitura.java:16)  ← 3. C chamou D
 *     at OrdemLeitura.B(OrdemLeitura.java:15)  ← 2. B chamou C
 *     at OrdemLeitura.A(OrdemLeitura.java:14)  ← 1. A chamou B
 *     at OrdemLeitura.main(OrdemLeitura.java:6) ← 0. main chamou A
 * 
 * LER DE BAIXO PARA CIMA:
 *   0. main chama A
 *   1. A chama B
 *   2. B chama C
 *   3. C chama D
 *   4. D lança exceção ← ERRO
 * 
 * PRIMEIRO ELEMENTO: onde erro OCORREU
 * ÚLTIMO ELEMENTO: onde execução COMEÇOU
 */
```

**Ordem**: ler de **baixo** (início) para **cima** (erro).

### 3. Identificar Linha do Erro

```java
// ✅ Identificar linha exata do erro
public class LinhaErro {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void processar() {
        String nome = null;
        System.out.println("Início");  // Linha 14
        System.out.println("Meio");    // Linha 15
        nome.length();                 // Linha 16 ← ERRO AQUI
        System.out.println("Fim");     // Linha 17 (não executa)
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.NullPointerException: ...
 *     at LinhaErro.processar(LinhaErro.java:16)  ← Linha 16
 *     at LinhaErro.main(LinhaErro.java:6)
 * 
 * LINHA DO ERRO: 16
 *   → nome.length() com nome == null
 * 
 * Como encontrar:
 *   1. Primeiro elemento do stack trace
 *   2. Verificar número da linha
 *   3. Abrir arquivo na linha indicada
 */
```

**Linha erro**: **primeiro** elemento do stack trace.

### 4. Stack Frames

```java
// ✅ Entender stack frames
public class StackFrames {
    
    public static void main(String[] args) {
        try {
            metodoA(10);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void metodoA(int x) {
        metodoB(x * 2);
    }
    
    static void metodoB(int y) {
        metodoC(y + 5);
    }
    
    static void metodoC(int z) {
        if (z > 20) {
            throw new IllegalArgumentException("z > 20: " + z);
        }
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.IllegalArgumentException: z > 20: 25
 *     at StackFrames.metodoC(StackFrames.java:23)  ← Frame 3
 *     at StackFrames.metodoB(StackFrames.java:18)  ← Frame 2
 *     at StackFrames.metodoA(StackFrames.java:13)  ← Frame 1
 *     at StackFrames.main(StackFrames.java:6)      ← Frame 0
 * 
 * STACK FRAME:
 *   - Cada linha é um "frame"
 *   - Representa uma chamada de método
 *   - Contém: classe, método, arquivo, linha
 * 
 * RASTREAMENTO:
 *   Frame 0: main(10)
 *   Frame 1: metodoA(10) → chama metodoB(20)
 *   Frame 2: metodoB(20) → chama metodoC(25)
 *   Frame 3: metodoC(25) → lança exceção
 */
```

**Stack frame**: cada **linha** representa uma chamada.

### 5. Pacotes e Classes Completas

```java
// ✅ Nomes completos (pacote.Classe)
package com.exemplo.projeto;

public class NomesCompletos {
    
    public static void main(String[] args) {
        try {
            new Processador().executar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class Processador {
    void executar() {
        new Validador().validar(null);
    }
}

class Validador {
    void validar(String valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor null");
        }
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.IllegalArgumentException: Valor null
 *     at com.exemplo.projeto.Validador.validar(NomesCompletos.java:23)
 *     ↑  ↑            ↑      ↑         ↑
 *     at pacote       projeto Classe   Método
 * 
 *     at com.exemplo.projeto.Processador.executar(NomesCompletos.java:18)
 *     at com.exemplo.projeto.NomesCompletos.main(NomesCompletos.java:8)
 * 
 * NOME COMPLETO: pacote.Classe.método
 */
```

**Nome completo**: **pacote**.Classe.método.

### 6. Métodos Nativos

```java
// ✅ Métodos nativos (Native Method)
public class MetodosNativos {
    
    public static void main(String[] args) {
        try {
            Class.forName("ClasseInexistente");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.ClassNotFoundException: ClasseInexistente
 *     at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:586)
 *     at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
 *     ↑                                             ↑
 *     Classe                                        (Native Method)
 * 
 *     at java.base/java.lang.Class.forName0(Native Method)
 *     at java.base/java.lang.Class.forName(Class.java:375)
 *     at MetodosNativos.main(MetodosNativos.java:6)
 * 
 * NATIVE METHOD:
 *   - Implementado em código nativo (C/C++)
 *   - Não tem linha (usa "Native Method")
 *   - Parte da JVM/JDK
 */
```

**Native Method**: código **nativo** (C/C++), sem linha.

### 7. Stack Trace com Causa

```java
// ✅ Stack trace com "Caused by"
public class StackTraceComCausa {
    
    public static void main(String[] args) {
        try {
            nivel1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void nivel1() throws Exception {
        try {
            nivel2();
        } catch (IOException e) {
            throw new Exception("Erro nível 1", e);
            //                                 ↑
            //                              Causa
        }
    }
    
    static void nivel2() throws IOException {
        throw new IOException("Erro nível 2 - causa raiz");
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.Exception: Erro nível 1
 *     at StackTraceComCausa.nivel1(StackTraceComCausa.java:16)
 *     at StackTraceComCausa.main(StackTraceComCausa.java:6)
 * Caused by: java.io.IOException: Erro nível 2 - causa raiz
 *     ↑
 *     "Caused by" indica CAUSA RAIZ
 * 
 *     at StackTraceComCausa.nivel2(StackTraceComCausa.java:22)
 *     at StackTraceComCausa.nivel1(StackTraceComCausa.java:14)
 *     ... 1 more
 *     ↑
 *     "... 1 more" = 1 frame comum omitido (main)
 * 
 * LER:
 *   1. Exceção principal: Exception "Erro nível 1"
 *   2. Causa raiz: IOException "Erro nível 2"
 *   3. Frames comuns omitidos: "... 1 more"
 */
```

**Caused by**: mostra **causa raiz**. **... N more**: frames **omitidos**.

### 8. Suppressed Exceptions

```java
// ✅ Suppressed exceptions (try-with-resources)
public class SuppressedExceptions {
    
    public static void main(String[] args) {
        try {
            try (RecursoProblematico r = new RecursoProblematico()) {
                throw new RuntimeException("Erro no try");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static class RecursoProblematico implements AutoCloseable {
        @Override
        public void close() {
            throw new RuntimeException("Erro no close");
        }
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.RuntimeException: Erro no try
 *     at SuppressedExceptions.main(SuppressedExceptions.java:7)
 *     Suppressed: java.lang.RuntimeException: Erro no close
 *         ↑
 *         "Suppressed" indica exceção SUPRIMIDA
 * 
 *         at SuppressedExceptions$RecursoProblematico.close(...)
 *         at SuppressedExceptions.main(...)
 * 
 * SUPPRESSED:
 *   - Exceção adicional que ocorreu
 *   - Não substitui exceção principal
 *   - Comum em try-with-resources
 */
```

**Suppressed**: exceção **adicional** (try-with-resources).

### 9. Elipses "... N more"

```java
// ✅ Entender "... N more"
public class ElipsesMore {
    
    public static void main(String[] args) {
        try {
            A();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void A() throws Exception {
        try {
            B();
        } catch (RuntimeException e) {
            throw new Exception("Erro A", e);
        }
    }
    
    static void B() {
        C();
    }
    
    static void C() {
        throw new RuntimeException("Erro C");
    }
}

/*
 * STACK TRACE:
 * 
 * java.lang.Exception: Erro A
 *     at ElipsesMore.A(ElipsesMore.java:16)
 *     at ElipsesMore.main(ElipsesMore.java:6)
 * Caused by: java.lang.RuntimeException: Erro C
 *     at ElipsesMore.C(ElipsesMore.java:27)
 *     at ElipsesMore.B(ElipsesMore.java:23)
 *     at ElipsesMore.A(ElipsesMore.java:14)
 *     ... 1 more
 *     ↑
 *     Omite frames comuns (main)
 * 
 * "... 1 more":
 *   - 1 frame comum omitido
 *   - Frame: ElipsesMore.main(...)
 *   - Evita duplicação
 */
```

**... N more**: **N** frames comuns **omitidos**.

### 10. Resumo Visual

```java
/*
 * LEITURA DE STACK TRACES
 * 
 * ESTRUTURA COMPLETA:
 * 
 * java.lang.ExceptionType: Mensagem da exceção
 * ↑                         ↑
 * Tipo                      Mensagem
 * 
 *     at pacote.Classe.metodo(Arquivo.java:linha)
 *     ↑  ↑      ↑      ↑      ↑            ↑
 *     at pacote Classe método Arquivo      Linha
 * 
 *     at pacote.Classe.metodo2(Arquivo.java:linha2)
 *     at pacote.Classe.metodo3(Arquivo.java:linha3)
 *     ...
 * 
 * Caused by: java.io.IOException: Causa raiz
 *     ↑
 *     Causa raiz (exceção original)
 * 
 *     at pacote.Classe.metodoX(Arquivo.java:linhaX)
 *     ... 2 more
 *     ↑
 *     2 frames comuns omitidos
 * 
 * 
 * ORDEM DE LEITURA:
 * 
 * DE BAIXO PARA CIMA:
 *   main → metodoA → metodoB → ERRO
 * 
 * Stack trace (cima → baixo):
 *   at metodoB ← ERRO (primeiro)
 *   at metodoA
 *   at main    ← INÍCIO (último)
 * 
 * 
 * ELEMENTOS:
 * 
 * 1. Tipo exceção:
 *    java.lang.NullPointerException
 *    java.io.IOException
 * 
 * 2. Mensagem:
 *    "Cannot invoke String.length()"
 *    "File not found: file.txt"
 * 
 * 3. Stack frames:
 *    at Classe.metodo(Arquivo.java:10)
 *       ↑      ↑      ↑            ↑
 *    Classe método Arquivo      Linha
 * 
 * 4. Caused by:
 *    Exceção original (causa raiz)
 * 
 * 5. ... N more:
 *    N frames comuns omitidos
 * 
 * 6. Suppressed:
 *    Exceções suprimidas (try-with-resources)
 * 
 * 7. Native Method:
 *    Código nativo (C/C++)
 * 
 * 
 * IDENTIFICAR ERRO:
 * 
 * 1. Tipo + mensagem:
 *    "O QUE" deu errado
 * 
 * 2. Primeiro frame:
 *    "ONDE" ocorreu (classe, método, linha)
 * 
 * 3. Sequência frames:
 *    "COMO" chegou lá (caminho)
 * 
 * 4. Caused by:
 *    "POR QUE" (causa raiz)
 * 
 * 
 * EXEMPLO PRÁTICO:
 * 
 * java.lang.NullPointerException: Cannot invoke "length()"
 *     at App.processar(App.java:25)        ← ERRO linha 25
 *     at App.executar(App.java:18)         ← executar chamou processar
 *     at App.main(App.java:10)             ← main chamou executar
 * 
 * DIAGNÓSTICO:
 *   - TIPO: NullPointerException
 *   - ONDE: App.processar linha 25
 *   - O QUE: tentou chamar length() em null
 *   - CAMINHO: main → executar → processar
 */

public class ExemploLeituraStackTrace {
    
    public static void main(String[] args) {
        try {
            executar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void executar() {
        processar();
    }
    
    static void processar() {
        String s = null;
        s.length();  // NullPointerException
    }
}
```

---

## Aplicabilidade

**Stack trace**:
- **Tipo** + mensagem do erro
- **Sequência** de chamadas (frames)
- **Linha** exata do erro

---

## Armadilhas

### 1. Ler de Cima para Baixo

```java
// ❌ Ler de cima (erro) para baixo (início)
// Confunde ordem de chamadas

// ✅ Ler de baixo (início) para cima (erro)
// Segue ordem de execução: main → metodo1 → metodo2 → ERRO
```

### 2. Ignorar "Caused by"

```java
// ❌ Olhar apenas exceção principal
// Perde causa raiz

// ✅ Verificar "Caused by"
// Mostra exceção original (causa raiz)
```

---

## Boas Práticas

### 1. Primeiro Frame = Erro

```java
// ✅ Primeiro frame indica ONDE erro ocorreu
at App.processar(App.java:25)  // ← IR AQUI
```

### 2. Ler Baixo → Cima

```java
// ✅ Seguir ordem de execução
main → metodoA → metodoB → ERRO
```

### 3. Verificar Caused by

```java
// ✅ Causa raiz geralmente mais importante
Caused by: java.io.IOException: File not found
```

---

## Resumo

**Stack trace**: tipo + mensagem + **sequência** chamadas até erro.

**Estrutura**:
- **Tipo**: java.lang.NullPointerException
- **Mensagem**: "Cannot invoke length()"
- **Frames**: at Classe.metodo(Arquivo.java:linha)
- **Caused by**: exceção original (causa raiz)
- **... N more**: frames comuns omitidos
- **Suppressed**: exceções suprimidas

**Stack frame**:
```
at pacote.Classe.metodo(Arquivo.java:linha)
   ↑      ↑      ↑      ↑            ↑
   at   pacote Classe método      Arquivo Linha
```

**Ordem leitura**:
- **Baixo → Cima**: seguir execução (main → ... → erro)
- **Primeiro frame**: ONDE erro ocorreu (linha exata)
- **Último frame**: ONDE execução começou (main)

**Identificar erro**:
1. **Tipo + mensagem**: O QUE deu errado
2. **Primeiro frame**: ONDE ocorreu (linha)
3. **Sequência frames**: COMO chegou lá
4. **Caused by**: POR QUE (causa raiz)

**Elementos especiais**:
- **Native Method**: código nativo (C/C++), sem linha
- **Caused by**: exceção original encadeada
- **... N more**: N frames comuns omitidos
- **Suppressed**: exceções adicionais (try-with-resources)

**Regra de Ouro**: Ler de **baixo** (main) para **cima** (erro) seguindo ordem de execução. **Primeiro** frame indica linha exata do erro. Verificar **"Caused by"** para causa raiz. Stack frame contém: pacote.Classe.método(Arquivo:linha). "... N more" omite frames comuns. Native Method = código nativo sem linha.

