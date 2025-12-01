# T9.03 - Linha de Origem do Erro

## Introdução

**Linha origem**: indica **onde** exatamente o erro ocorreu.

```java
/*
 * LINHA DE ORIGEM DO ERRO
 * 
 * STACK TRACE:
 * at Classe.metodo(Arquivo.java:25)
 *                           ↑    ↑
 *                        Arquivo Linha
 * 
 * LINHA 25: onde erro OCORREU
 * 
 * PRIMEIRO FRAME: linha exata do erro
 */

// ✅ Identificar linha do erro
public class Exemplo {
    public static void main(String[] args) {
        processar();
    }
    
    static void processar() {
        String nome = null;
        System.out.println("Linha 9");   // Linha 9
        System.out.println("Linha 10");  // Linha 10
        nome.length();                   // Linha 11 ← ERRO AQUI
        System.out.println("Linha 12");  // Linha 12 (não executa)
    }
}

/*
 * STACK TRACE:
 * java.lang.NullPointerException: ...
 *     at Exemplo.processar(Exemplo.java:11)  ← Linha 11
 *     at Exemplo.main(Exemplo.java:3)
 * 
 * ERRO: linha 11 (nome.length())
 */
```

**Linha origem**: **primeiro** frame do stack trace.

---

## Fundamentos

### 1. Primeiro Frame = Linha do Erro

```java
// ✅ Primeiro frame indica linha exata
public class PrimeiroFrame {
    
    public static void main(String[] args) {
        try {
            executar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void executar() {
        int[] array = {1, 2, 3};
        System.out.println("Início");      // Linha 14
        System.out.println("Meio");        // Linha 15
        System.out.println(array[10]);     // Linha 16 ← ERRO
        System.out.println("Fim");         // Linha 17 (não executa)
    }
}

/*
 * STACK TRACE:
 * java.lang.ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 3
 *     at PrimeiroFrame.executar(PrimeiroFrame.java:16)  ← ERRO linha 16
 *     ↑                                           ↑
 *     Primeiro frame                              Linha do erro
 * 
 *     at PrimeiroFrame.main(PrimeiroFrame.java:6)
 * 
 * IDENTIFICAR:
 *   1. Olhar PRIMEIRO frame
 *   2. Verificar número da linha: 16
 *   3. Abrir arquivo na linha 16
 *   4. Verificar: array[10] com array.length == 3
 */
```

**Primeiro frame**: linha **exata** onde erro ocorreu.

### 2. Classe e Método

```java
// ✅ Frame contém classe, método, arquivo, linha
public class ClasseMetodo {
    
    public static void main(String[] args) {
        try {
            new Processador().processar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class Processador {
    void processar() {
        validar(null);
    }
    
    void validar(String valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor null");  // Linha 20
        }
    }
}

/*
 * STACK TRACE:
 * java.lang.IllegalArgumentException: Valor null
 *     at Processador.validar(ClasseMetodo.java:20)
 *     ↑  ↑          ↑        ↑               ↑
 *     at Classe     Método   Arquivo         Linha
 * 
 *     at Processador.processar(ClasseMetodo.java:14)
 *     at ClasseMetodo.main(ClasseMetodo.java:6)
 * 
 * INFORMAÇÕES:
 *   - Classe: Processador
 *   - Método: validar
 *   - Arquivo: ClasseMetodo.java
 *   - Linha: 20
 */
```

**Frame**: **Classe.método**(Arquivo.java:**linha**).

### 3. Nome Arquivo vs Classe

```java
// ✅ Arquivo pode diferir do nome da classe (inner classes)
public class Arquivo {
    
    public static void main(String[] args) {
        try {
            new Externa().metodo();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class Externa {
    void metodo() {
        new Interna().processar();
    }
    
    class Interna {
        void processar() {
            throw new RuntimeException("Erro");  // Linha 20
        }
    }
}

/*
 * STACK TRACE:
 * java.lang.RuntimeException: Erro
 *     at Externa$Interna.processar(Arquivo.java:20)
 *     ↑  ↑             ↑           ↑           ↑
 *     at Classe        Método      Arquivo     Linha
 * 
 * CLASSE: Externa$Interna (inner class)
 * ARQUIVO: Arquivo.java (nome do arquivo principal)
 * LINHA: 20
 * 
 * $ = inner class
 */
```

**Arquivo**: nome do arquivo **.java** principal. **$**: inner class.

### 4. Múltiplas Exceções Mesma Linha

```java
// ✅ Múltiplas possibilidades na mesma linha
public class MultiplasPossibilidades {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void processar() {
        String s = null;
        System.out.println(s.length() + s.hashCode());  // Linha 14 ← QUAL?
        //                 ↑          ↑
        //                 Ambos podem lançar NullPointerException
    }
}

/*
 * STACK TRACE:
 * java.lang.NullPointerException: ...
 *     at MultiplasPossibilidades.processar(MultiplasPossibilidades.java:14)
 * 
 * LINHA 14: mas QUAL operação?
 *   - s.length()?
 *   - s.hashCode()?
 * 
 * SOLUÇÃO:
 *   1. Mensagem da exceção (pode indicar)
 *   2. Debugger (parar na linha)
 *   3. Dividir linha em múltiplas linhas
 */

// ✅ Dividir linha para identificar
static void processarMelhor() {
    String s = null;
    int length = s.length();       // Linha clara
    int hash = s.hashCode();       // Linha clara
    System.out.println(length + hash);
}
```

**Mesma linha**: dividir em **múltiplas linhas** para clareza.

### 5. Lambda e Método de Referência

```java
// ✅ Lambda e method reference no stack trace
import java.util.Arrays;
import java.util.List;

public class LambdaStackTrace {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void processar() {
        List<String> lista = Arrays.asList("a", null, "c");
        
        lista.forEach(s -> {
            System.out.println(s.length());  // Linha 18 ← ERRO
        });
    }
}

/*
 * STACK TRACE:
 * java.lang.NullPointerException: ...
 *     at LambdaStackTrace.lambda$processar$0(LambdaStackTrace.java:18)
 *     ↑                  ↑
 *     Classe             lambda$metodo$0 (lambda gerado)
 * 
 *     at java.base/java.util.ArrayList.forEach(ArrayList.java:...)
 *     at LambdaStackTrace.processar(LambdaStackTrace.java:17)
 *     at LambdaStackTrace.main(LambdaStackTrace.java:8)
 * 
 * LAMBDA:
 *   - Nome: lambda$processar$0
 *   - Linha: 18 (dentro do lambda)
 */
```

**Lambda**: **lambda$método$N** no stack trace.

### 6. Linha em Biblioteca Externa

```java
// ✅ Erro em biblioteca externa (não no seu código)
import java.io.FileReader;

public class BibliotecaExterna {
    
    public static void main(String[] args) {
        try {
            ler();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void ler() throws Exception {
        new FileReader("arquivo_inexistente.txt");  // Linha 14
    }
}

/*
 * STACK TRACE:
 * java.io.FileNotFoundException: arquivo_inexistente.txt (No such file)
 *     at java.base/java.io.FileInputStream.open0(Native Method)
 *     ↑
 *     Erro DENTRO da biblioteca (FileInputStream)
 * 
 *     at java.base/java.io.FileInputStream.open(FileInputStream.java:...)
 *     at java.base/java.io.FileInputStream.<init>(FileInputStream.java:...)
 *     at java.base/java.io.FileReader.<init>(FileReader.java:...)
 *     at BibliotecaExterna.ler(BibliotecaExterna.java:14)
 *     ↑
 *     SEU código que CHAMOU a biblioteca (linha 14)
 * 
 * IDENTIFICAR:
 *   1. Primeiro frame: biblioteca (FileInputStream)
 *   2. Procurar SEU código: BibliotecaExterna.ler linha 14
 *   3. Linha 14: new FileReader(...)
 */
```

**Biblioteca**: procurar **seu código** nos frames abaixo.

### 7. Número Linha Incorreto

```java
// ✅ Número linha pode estar incorreto (debug info)
/*
 * CAUSAS:
 * 
 * 1. Compilado sem debug info
 *    javac -g:none Classe.java
 *    → Linha aparece como "Unknown Source"
 * 
 * 2. Ofuscação (ProGuard, R8)
 *    → Linhas mapeadas incorretamente
 * 
 * 3. Código gerado (Lombok, etc.)
 *    → Linha do código gerado, não fonte
 * 
 * 4. Versões diferentes
 *    → Código fonte não corresponde ao .class
 */

// ❌ Compilado sem debug info
// javac -g:none Exemplo.java

/*
 * STACK TRACE:
 * at Exemplo.metodo(Unknown Source)
 *                   ↑
 *                   Sem informação de linha
 */

// ✅ Compilado com debug info (padrão)
// javac Exemplo.java

/*
 * STACK TRACE:
 * at Exemplo.metodo(Exemplo.java:15)
 *                                 ↑
 *                                 Linha correta
 */
```

**Debug info**: compilar com `-g` para linhas corretas.

### 8. Identificar Linha em IDE

```java
// ✅ Usar IDE para navegar até a linha
/*
 * ECLIPSE/INTELLIJ:
 * 
 * 1. Clicar no link do stack trace
 *    at Classe.metodo(Arquivo.java:25)
 *    ↑
 *    Clicável (IDE abre arquivo na linha)
 * 
 * 2. Ctrl+G (Go to Line)
 *    Digitar número da linha
 * 
 * 3. Ctrl+Shift+T (Open Type)
 *    Procurar classe
 *    Ir até linha
 */

public class NavegacaoIDE {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            e.printStackTrace();
            // ↑
            // Stack trace no console é CLICÁVEL
        }
    }
    
    static void processar() {
        throw new RuntimeException("Erro");
    }
}
```

**IDE**: stack trace **clicável**, abre arquivo na linha.

### 9. Linha com Encadeamento

```java
// ✅ Linha com chamadas encadeadas
public class ChamadasEncadeadas {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void processar() {
        String resultado = obterValor()
                .trim()
                .toUpperCase()
                .substring(10);  // Linha 15 ← ERRO AQUI
    }
    
    static String obterValor() {
        return "abc";  // String curta → substring(10) falha
    }
}

/*
 * STACK TRACE:
 * java.lang.StringIndexOutOfBoundsException: begin 10, end 3, length 3
 *     at java.base/java.lang.String.checkBoundsBeginEnd(String.java:...)
 *     at java.base/java.lang.String.substring(String.java:...)
 *     at ChamadasEncadeadas.processar(ChamadasEncadeadas.java:15)
 *     ↑                                                      ↑
 *     SEU código                                             Linha 15
 * 
 * LINHA 15: .substring(10)
 * 
 * CADEIA:
 *   obterValor() → "abc"
 *   .trim() → "abc"
 *   .toUpperCase() → "ABC"
 *   .substring(10) → ERRO (string tem 3 caracteres)
 */
```

**Encadeamento**: linha do **último** método na cadeia.

### 10. Resumo Visual

```java
/*
 * LINHA DE ORIGEM DO ERRO
 * 
 * STACK TRACE:
 * 
 * java.lang.NullPointerException: Cannot invoke "length()"
 *     at com.exemplo.App.processar(App.java:25)  ← PRIMEIRO FRAME
 *     ↑  ↑           ↑   ↑         ↑        ↑
 *     at pacote      pkg Classe    Arquivo  Linha do erro
 * 
 *     at com.exemplo.App.executar(App.java:18)
 *     at com.exemplo.App.main(App.java:10)
 * 
 * 
 * IDENTIFICAR LINHA:
 * 
 * 1. PRIMEIRO FRAME
 *    → Onde erro OCORREU
 * 
 * 2. NÚMERO DA LINHA
 *    → App.java:25 → Linha 25
 * 
 * 3. ABRIR ARQUIVO
 *    → App.java
 * 
 * 4. NAVEGAR ATÉ LINHA
 *    → Linha 25
 * 
 * 5. VERIFICAR CÓDIGO
 *    → O que está na linha 25?
 * 
 * 
 * FRAME COMPONENTS:
 * 
 * at Classe.metodo(Arquivo.java:25)
 *    ↑      ↑      ↑            ↑
 *    Classe Método Arquivo      Linha
 * 
 * Classe:   Nome da classe
 * Método:   Nome do método
 * Arquivo:  Nome do arquivo .java
 * Linha:    Número da linha
 * 
 * 
 * CASOS ESPECIAIS:
 * 
 * 1. INNER CLASS:
 *    at Externa$Interna.metodo(Arquivo.java:20)
 *       ↑      ↑
 *       Outer  Inner ($)
 * 
 * 2. LAMBDA:
 *    at Classe.lambda$metodo$0(Arquivo.java:15)
 *              ↑
 *              Lambda gerado
 * 
 * 3. NATIVE METHOD:
 *    at java.lang.Class.forName0(Native Method)
 *                                ↑
 *                                Sem linha (código nativo)
 * 
 * 4. UNKNOWN SOURCE:
 *    at Classe.metodo(Unknown Source)
 *                     ↑
 *                     Sem debug info
 * 
 * 
 * MÚLTIPLAS LINHAS:
 * 
 * ❌ Difícil identificar:
 * System.out.println(s.length() + s.hashCode());
 * 
 * ✅ Fácil identificar:
 * int length = s.length();       // Linha clara
 * int hash = s.hashCode();       // Linha clara
 * System.out.println(length + hash);
 * 
 * 
 * BIBLIOTECA EXTERNA:
 * 
 * java.io.FileNotFoundException: file.txt
 *     at java.io.FileInputStream.open0(Native Method)
 *     ↑
 *     Erro DENTRO biblioteca
 * 
 *     at java.io.FileInputStream.<init>(FileInputStream.java:...)
 *     at java.io.FileReader.<init>(FileReader.java:...)
 *     at App.ler(App.java:25)  ← SEU código que chamou
 *     ↑
 *     Procurar seu código aqui
 * 
 * 
 * DEBUG INFO:
 * 
 * ❌ Sem debug info:
 * javac -g:none App.java
 * → at App.metodo(Unknown Source)
 * 
 * ✅ Com debug info (padrão):
 * javac App.java
 * → at App.metodo(App.java:25)
 * 
 * 
 * IDE NAVIGATION:
 * 
 * 1. Clicar link stack trace (abre arquivo)
 * 2. Ctrl+G (Go to Line)
 * 3. Ctrl+Shift+T (Open Type) + navegar
 */

public class ExemploLinhaOrigem {
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            // Stack trace no console
            e.printStackTrace();
            
            // Programaticamente
            StackTraceElement[] stack = e.getStackTrace();
            StackTraceElement origem = stack[0];  // Primeiro frame
            
            System.out.println("\nOrigem do erro:");
            System.out.println("  Classe: " + origem.getClassName());
            System.out.println("  Método: " + origem.getMethodName());
            System.out.println("  Arquivo: " + origem.getFileName());
            System.out.println("  Linha: " + origem.getLineNumber());
        }
    }
    
    static void processar() {
        String s = null;
        s.length();  // NullPointerException aqui
    }
}
```

---

## Aplicabilidade

**Linha origem**:
- **Primeiro** frame do stack trace
- Indica **onde** erro ocorreu
- **Arquivo** + **linha** exata

---

## Armadilhas

### 1. Confundir com Outros Frames

```java
// ❌ Olhar frame errado (não o primeiro)
at App.metodoB(App.java:20)  // Chamador
at App.metodoA(App.java:15)  // ← NÃO é aqui

// ✅ Primeiro frame
at App.metodoC(App.java:25)  // ← ERRO AQUI
at App.metodoB(App.java:20)
```

### 2. Múltiplas Operações Mesma Linha

```java
// ❌ Difícil identificar qual operação
System.out.println(a.m1() + b.m2() + c.m3());

// ✅ Dividir em linhas
int r1 = a.m1();
int r2 = b.m2();
int r3 = c.m3();
System.out.println(r1 + r2 + r3);
```

---

## Boas Práticas

### 1. Primeiro Frame

```java
// ✅ Sempre olhar PRIMEIRO frame
at App.metodo(App.java:25)  // ← IR AQUI
```

### 2. IDE Clicável

```java
// ✅ Clicar no link (IDE navega)
e.printStackTrace();  // Console clicável
```

### 3. Uma Operação por Linha

```java
// ✅ Facilita debug
int length = s.length();  // Linha clara
```

---

## Resumo

**Linha origem**: **primeiro** frame indica onde erro **ocorreu**.

**Estrutura frame**:
```
at Classe.metodo(Arquivo.java:linha)
   ↑      ↑      ↑            ↑
   Classe Método Arquivo      Linha
```

**Identificar**:
1. **Primeiro frame**: onde erro ocorreu
2. **Número linha**: Arquivo.java:**25**
3. **Abrir arquivo**: Arquivo.java
4. **Navegar**: linha 25
5. **Verificar**: código na linha

**Componentes**:
- **Classe**: nome da classe (pode ter $ para inner class)
- **Método**: nome do método (lambda$nome$N para lambdas)
- **Arquivo**: nome do arquivo .java
- **Linha**: número da linha

**Casos especiais**:
- **Inner class**: Externa**$**Interna
- **Lambda**: lambda**$**método**$**0
- **Native Method**: sem linha (código nativo)
- **Unknown Source**: sem debug info

**Biblioteca externa**:
- Primeiro frame: erro **dentro** biblioteca
- Procurar **seu código** nos frames abaixo
- Seu código: quem **chamou** a biblioteca

**Debug info**:
- **Com** debug: `javac Arquivo.java` → linha correta
- **Sem** debug: `javac -g:none` → Unknown Source

**IDE navegação**:
- Stack trace **clicável** (abre arquivo na linha)
- Ctrl+G: Go to Line
- Ctrl+Shift+T: Open Type

**Múltiplas operações**:
- **Uma** operação por linha
- Facilita identificar qual falhou

**Regra de Ouro**: **Primeiro** frame do stack trace mostra linha **exata** do erro. Formato: at Classe.método(Arquivo:**linha**). IDE permite clicar para navegar. Dividir múltiplas operações em linhas separadas. Se erro em biblioteca, procurar seu código nos frames abaixo. Compilar com debug info para linhas corretas.

