# T3.04 - Não Requerem Tratamento Obrigatório

## Introdução

**Unchecked exceptions** **NÃO** requerem tratamento ou declaração **obrigatória**.

```java
/*
 * TRATAMENTO NÃO OBRIGATÓRIO
 * 
 * UNCHECKED (RuntimeException + Error):
 *   - ✅ COMPILA sem throws
 *   - ✅ COMPILA sem try-catch
 *   - Opcional declarar ou tratar
 * 
 * CHECKED (Exception - RuntimeException):
 *   - ❌ NÃO compila sem throws
 *   - ❌ NÃO compila sem try-catch
 *   - Obrigatório declarar ou tratar
 */

// ✅ UNCHECKED: compila SEM throws/try-catch
public static void unchecked() {
    int resultado = 10 / 0;           // ArithmeticException - OK
    String texto = null;
    texto.length();                   // NullPointerException - OK
    int[] array = {1, 2, 3};
    int x = array[10];                // ArrayIndexOutOfBounds - OK
}

// ❌ CHECKED: NÃO compila sem throws/try-catch
// public static void checked() {
//     FileReader reader = new FileReader("file.txt");  // ERRO
// }
```

**Não obrigatório** = compila **sem** `throws` ou `try-catch`.

---

## Fundamentos

### 1. Compilador Não Verifica Unchecked

```java
// ✅ Compilador não verifica unchecked
public class CompiladorNaoVerifica {
    
    // ✅ COMPILA sem throws/try-catch
    public static void metodo1() {
        // ArithmeticException: compila OK
        int resultado = 10 / 0;
    }
    
    public static void metodo2() {
        // NullPointerException: compila OK
        String texto = null;
        System.out.println(texto.length());
    }
    
    public static void metodo3() {
        // ArrayIndexOutOfBoundsException: compila OK
        int[] array = {1, 2, 3};
        int valor = array[10];
    }
    
    public static void metodo4() {
        // NumberFormatException: compila OK
        int numero = Integer.parseInt("abc");
    }
    
    /*
     * COMPILADOR:
     *   - NÃO verifica unchecked em tempo de compilação
     *   - NÃO exige throws ou try-catch
     *   - Gera .class normalmente
     *   - Erro SÓ ocorre em RUNTIME (se executar)
     */
    
    public static void main(String[] args) {
        System.out.println("=== Compilador Não Verifica ===");
        System.out.println("Código compila normalmente");
        System.out.println("Erro só ocorre AO EXECUTAR");
    }
}
```

**Compilador** não **verifica** unchecked (só **runtime**).

### 2. Opcional: Declarar com throws

```java
// ✅ Declarar throws é OPCIONAL (mas permitido)
public class OpcionalThrows {
    
    // ✅ OPÇÃO 1: NÃO declarar throws (mais comum)
    public static void opcao1(int a, int b) {
        int resultado = a / b;  // ArithmeticException possível
        // NÃO declara throws (OK)
    }
    
    // ✅ OPÇÃO 2: DECLARAR throws (permitido, mas desnecessário)
    public static void opcao2(int a, int b) throws ArithmeticException {
        int resultado = a / b;  // ArithmeticException possível
        // Declara throws (OK, mas desnecessário)
    }
    
    // ✅ Ambas compilam e funcionam igual
    public static void comparar() {
        // Chamar opcao1 (sem throws)
        opcao1(10, 0);  // OK - NÃO precisa tratar
        
        // Chamar opcao2 (com throws)
        opcao2(10, 0);  // OK - NÃO precisa tratar
        
        // throws unchecked é OPCIONAL (não obriga chamador)
    }
    
    /*
     * DIFERENÇA throws checked vs unchecked:
     * 
     * Checked (IOException):
     *   - throws obriga CHAMADOR tratar
     *   - Não compila sem tratamento
     * 
     * Unchecked (ArithmeticException):
     *   - throws NÃO obriga chamador
     *   - Compila sem tratamento
     *   - throws é apenas DOCUMENTAÇÃO
     */
}
```

**throws unchecked** = **opcional** (não obriga chamador).

### 3. Opcional: Tratar com try-catch

```java
// ✅ Tratar com try-catch é OPCIONAL
public class OpcionalTryCatch {
    
    // ✅ OPÇÃO 1: NÃO tratar (mais comum para unchecked)
    public static void opcao1(int a, int b) {
        int resultado = a / b;  // ArithmeticException possível
        System.out.println("Resultado: " + resultado);
        // NÃO trata (OK)
    }
    
    // ✅ OPÇÃO 2: TRATAR com try-catch (opcional)
    public static void opcao2(int a, int b) {
        try {
            int resultado = a / b;  // ArithmeticException possível
            System.out.println("Resultado: " + resultado);
        } catch (ArithmeticException e) {
            System.err.println("Erro: divisão por zero");
        }
        // Trata (OK, mas opcional)
    }
    
    // ✅ COMPARAR comportamento
    public static void comparar() {
        System.out.println("=== Sem tratamento ===");
        // opcao1(10, 0);  // ❌ Lança exceção (programa quebra)
        
        System.out.println("\n=== Com tratamento ===");
        opcao2(10, 0);  // ✅ Trata exceção (programa continua)
        System.out.println("Programa continua...");
    }
    
    /*
     * QUANDO TRATAR?
     * 
     * NÃO tratar (prevenir):
     *   - Erros de programação (bugs)
     *   - Validar ANTES de executar
     * 
     * TRATAR (capturar):
     *   - Input de USUÁRIO (imprevisível)
     *   - API de TERCEIROS
     *   - Aplicação CRÍTICA
     */
}
```

**try-catch unchecked** = **opcional** (prevenir >>> tratar).

### 4. Comparação: Checked vs Unchecked

```java
// ✅ Comparação lado a lado
public class CheckedVsUnchecked {
    
    /*
     * ========================================
     * CHECKED (IOException)
     * ========================================
     */
    
    // ❌ NÃO compila sem tratamento
    // public static void checkedSemTratamento() {
    //     FileReader reader = new FileReader("file.txt");  // ERRO
    // }
    
    // ✅ Compila com throws
    public static void checkedComThrows() throws IOException {
        FileReader reader = new FileReader("file.txt");  // OK
    }
    
    // ✅ Compila com try-catch
    public static void checkedComTryCatch() {
        try {
            FileReader reader = new FileReader("file.txt");  // OK
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    // ❌ Chamar método throws: NÃO compila sem tratar
    // public static void chamarChecked() {
    //     checkedComThrows();  // ERRO - deve tratar ou declarar
    // }
    
    /*
     * ========================================
     * UNCHECKED (ArithmeticException)
     * ========================================
     */
    
    // ✅ COMPILA sem tratamento
    public static void uncheckedSemTratamento() {
        int resultado = 10 / 0;  // OK - compila
    }
    
    // ✅ Compila com throws (opcional)
    public static void uncheckedComThrows() throws ArithmeticException {
        int resultado = 10 / 0;  // OK
    }
    
    // ✅ Compila com try-catch (opcional)
    public static void uncheckedComTryCatch() {
        try {
            int resultado = 10 / 0;  // OK
        } catch (ArithmeticException e) {
            e.printStackTrace();
        }
    }
    
    // ✅ Chamar método throws: COMPILA sem tratar
    public static void chamarUnchecked() {
        uncheckedComThrows();  // OK - não precisa tratar
    }
    
    /*
     * ========================================
     * RESUMO COMPARAÇÃO
     * ========================================
     */
    
    public static void resumo() {
        System.out.println("=== CHECKED ===");
        System.out.println("Sem tratamento: NÃO compila");
        System.out.println("Com throws: OK (obriga chamador)");
        System.out.println("Com try-catch: OK");
        System.out.println("Chamar throws: DEVE tratar");
        
        System.out.println("\n=== UNCHECKED ===");
        System.out.println("Sem tratamento: COMPILA");
        System.out.println("Com throws: OK (opcional, não obriga)");
        System.out.println("Com try-catch: OK (opcional)");
        System.out.println("Chamar throws: NÃO precisa tratar");
    }
}
```

**Checked** = obriga. **Unchecked** = opcional.

### 5. Unchecked: Sem Propagação Obrigatória

```java
// ✅ Unchecked não obriga propagação
public class SemPropagacao {
    
    // Método que lança unchecked
    public static void metodoC() {
        throw new NullPointerException("NPE");
    }
    
    // ✅ Método B: NÃO precisa declarar throws
    public static void metodoB() {
        metodoC();  // OK - sem throws
    }
    
    // ✅ Método A: NÃO precisa declarar throws
    public static void metodoA() {
        metodoB();  // OK - sem throws
    }
    
    // ✅ main: NÃO precisa tratar
    public static void main(String[] args) {
        metodoA();  // OK - sem try-catch
        // Se executar: NullPointerException sobe e quebra programa
    }
    
    /*
     * COMPARAR com checked:
     * 
     * Checked IOException:
     *   - metodoB DEVE: throws IOException
     *   - metodoA DEVE: throws IOException
     *   - main DEVE: try-catch ou throws
     * 
     * Unchecked NullPointerException:
     *   - metodoB: NÃO precisa throws
     *   - metodoA: NÃO precisa throws
     *   - main: NÃO precisa try-catch
     */
}
```

**Unchecked** não **obriga** propagação (diferente de checked).

### 6. Javadoc @throws: Documentação Opcional

```java
// ✅ @throws para unchecked é OPCIONAL (mas recomendado)
public class JavadocThrows {
    
    /**
     * Divide dois números.
     * 
     * @param a Numerador
     * @param b Denominador
     * @return Resultado da divisão
     * @throws ArithmeticException Se b == 0 (OPCIONAL documentar)
     */
    public static int dividir(int a, int b) throws ArithmeticException {
        return a / b;
    }
    
    /**
     * Define idade.
     * 
     * @param idade Idade (0-150)
     * @throws IllegalArgumentException Se idade < 0 ou > 150 (BOM documentar)
     */
    public static void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
    }
    
    /*
     * JAVADOC @throws:
     * 
     * Checked:
     *   - @throws OBRIGATÓRIO (IDE gera warning se faltar)
     *   - Compilador verifica
     * 
     * Unchecked:
     *   - @throws OPCIONAL
     *   - Compilador NÃO verifica
     *   - BOM documentar exceções que método LANÇA explicitamente
     *   - NÃO precisa documentar todas possíveis (NPE, etc.)
     */
}
```

**@throws unchecked** = **opcional** (mas bom documentar).

### 7. IDE: Warnings e Sugestões

```java
// ✅ IDE trata unchecked diferente de checked
public class IDEWarnings {
    
    // ❌ CHECKED: IDE mostra ERRO vermelho
    public static void checked() {
        // FileReader reader = new FileReader("file.txt");
        /*
         * IDE:
         *   - ERRO vermelho (não compila)
         *   - "Unhandled exception: IOException"
         *   - Quick fix: "Add throws" / "Surround with try-catch"
         */
    }
    
    // ✅ UNCHECKED: IDE NÃO mostra erro
    public static void unchecked() {
        int resultado = 10 / 0;  // ArithmeticException
        /*
         * IDE:
         *   - SEM erro (compila)
         *   - PODE mostrar warning: "Division by zero"
         *   - Sugestão: validar divisor
         */
    }
    
    // ⚠️ IDE pode sugerir melhorias
    public static void sugestao(String texto) {
        System.out.println(texto.length());
        /*
         * IDE:
         *   - Warning: "Method invocation 'texto.length()' may produce NPE"
         *   - Sugestão: adicionar null check
         *   - if (texto != null) { ... }
         */
    }
}
```

**IDE** mostra **erro** para checked, **warning** para unchecked.

### 8. Unchecked em Contextos Especiais

```java
// ✅ Unchecked em diferentes contextos
public class ContextosEspeciais {
    
    // 1. CONSTRUTORES: unchecked não precisa throws
    public static class Exemplo1 {
        private int valor;
        
        // ✅ OK sem throws (unchecked)
        public Exemplo1(int valor) {
            if (valor < 0) {
                throw new IllegalArgumentException("Valor negativo");
            }
            this.valor = valor;
        }
    }
    
    // 2. INTERFACES: unchecked opcional declarar
    public interface Exemplo2 {
        // ✅ OK sem throws
        void processar(int valor);
        
        // ✅ OK com throws (opcional)
        void validar(int valor) throws IllegalArgumentException;
    }
    
    // 3. LAMBDAS: unchecked OK lançar
    public static void exemplo3() {
        List<Integer> numeros = Arrays.asList(1, 2, 3);
        
        // ✅ OK lançar unchecked em lambda
        numeros.forEach(n -> {
            if (n < 0) {
                throw new IllegalArgumentException("Negativo");
            }
        });
    }
    
    // 4. STREAMS: unchecked OK lançar
    public static void exemplo4() {
        List<String> textos = Arrays.asList("1", "2", "abc");
        
        // ✅ OK lançar NumberFormatException
        textos.stream()
              .map(Integer::parseInt)  // Pode lançar NumberFormatException
              .forEach(System.out::println);
    }
    
    // 5. OVERRIDE: unchecked pode adicionar
    public static class Base {
        public void processar() {
            // Não lança exceção
        }
    }
    
    public static class Filha extends Base {
        @Override
        public void processar() {
            // ✅ OK adicionar unchecked (não obriga chamador)
            throw new IllegalStateException("Não implementado");
        }
    }
}
```

**Unchecked** mais **flexível** em todos contextos (não obriga).

### 9. Vantagens de Não Obrigar Tratamento

```java
// ✅ Vantagens de unchecked não obrigar
public class VantagensNaoObrigar {
    
    /*
     * VANTAGEM 1: Código LIMPO
     *   - Não polui código com try-catch
     *   - Foco na lógica principal
     */
    public static void exemploLimpo() {
        // ✅ Código limpo (sem try-catch)
        List<String> lista = new ArrayList<>();
        lista.add("item1");
        lista.add("item2");
        System.out.println(lista.get(0));
        System.out.println(lista.size());
        
        // ❌ SE fossem checked (verboso)
        // try { lista.add("item1"); } catch (...) {}
        // try { lista.add("item2"); } catch (...) {}
        // try { lista.get(0); } catch (...) {}
        // try { lista.size(); } catch (...) {}
    }
    
    /*
     * VANTAGEM 2: FLEXIBILIDADE
     *   - Desenvolvedor decide SE e QUANDO tratar
     *   - Pode prevenir ao invés de tratar
     */
    public static void exemploFlexibilidade(int valor) {
        // ✅ Prevenir ao invés de tratar
        if (valor < 0) {
            throw new IllegalArgumentException("Valor negativo");
        }
        
        // Seguro (não lança exceção)
        int resultado = Math.abs(valor);
    }
    
    /*
     * VANTAGEM 3: Simplicidade para BUGS
     *   - Bugs não devem ser tratados (devem ser CORRIGIDOS)
     *   - NullPointer, divisão zero = BUGS
     *   - Obrigar tratar mascararia o bug
     */
    public static void exemploBugs() {
        // ✅ Bug deve quebrar (não mascarar)
        String texto = obterTexto();
        System.out.println(texto.length());
        // Se obterTexto() retorna null = BUG
        // Deve quebrar para ser detectado e corrigido
    }
    
    private static String obterTexto() {
        return "texto";
    }
}
```

**Não obrigar** = código **limpo**, **flexível**, bugs **visíveis**.

### 10. Resumo Visual: Não Obrigatório

```java
/*
 * UNCHECKED: TRATAMENTO NÃO OBRIGATÓRIO
 * 
 * ┌─────────────────────────────────────┐
 * │  CÓDIGO COM UNCHECKED               │
 * │  int r = 10 / 0;                    │
 * └──────────────┬──────────────────────┘
 *                │
 *                ▼
 *        ┌───────────────┐
 *        │  COMPILADOR   │
 *        │   NÃO verifica│
 *        │   unchecked   │
 *        └───────┬───────┘
 *                │
 *                ▼
 *          ┌──────────┐
 *          │ COMPILA  │
 *          │ .class   │
 *          └────┬─────┘
 *               │
 *     ┌─────────┴─────────┐
 *     │  OPÇÕES           │
 *     │  (todas OK)       │
 *     └─────────┬─────────┘
 *               │
 *    ┌──────────┼──────────┐
 *    │          │          │
 *    ▼          ▼          ▼
 * ┌──────┐ ┌────────┐ ┌──────────┐
 * │ SEM  │ │ throws │ │try-catch │
 * │throws│ │ OPCION │ │ OPCIONAL │
 * │ NEM  │ │   AL   │ │          │
 * │catch │ │        │ │          │
 * └──┬───┘ └───┬────┘ └────┬─────┘
 *    │         │           │
 *    │ compila │ compila   │ compila
 *    │ OK      │ OK        │ OK
 *    │         │           │
 *    └─────────┼───────────┘
 *              │
 *              ▼
 *        ┌──────────┐
 *        │ EXECUTAR │
 *        └────┬─────┘
 *             │
 *       ┌─────┴─────┐
 *       │           │
 *       ▼           ▼
 *    SUCESSO     EXCEÇÃO
 *    continua    quebra
 *                (se não
 *                 tratada)
 * 
 * CARACTERÍSTICAS:
 *   - Compilador NÃO verifica
 *   - COMPILA sem throws/try-catch
 *   - throws OPCIONAL (não obriga chamador)
 *   - try-catch OPCIONAL
 *   - Erro SÓ em RUNTIME (se ocorrer)
 */

public class ResumoNaoObrigatorio {
    public static void main(String[] args) {
        System.out.println("=== UNCHECKED: NÃO OBRIGATÓRIO ===");
        System.out.println("\n✅ COMPILA sem throws");
        System.out.println("✅ COMPILA sem try-catch");
        System.out.println("✅ throws OPCIONAL");
        System.out.println("✅ try-catch OPCIONAL");
        System.out.println("\n⚠️ Erro SÓ em RUNTIME");
    }
}
```

---

## Aplicabilidade

**Não obrigatório** permite:
- Código **limpo** (sem poluição)
- **Flexibilidade** (decidir quando tratar)
- Bugs **visíveis** (não mascarar)
- **Prevenir** ao invés de tratar

---

## Armadilhas

### 1. Ignorar Unchecked Completamente

```java
// ❌ Não validar (vai quebrar)
public void processar(String texto) {
    System.out.println(texto.length());  // NPE
}

// ✅ Validar entrada
public void processar(String texto) {
    if (texto == null) {
        throw new IllegalArgumentException("Null");
    }
    System.out.println(texto.length());
}
```

### 2. Declarar throws Desnecessário

```java
// ⚠️ throws desnecessário
public void metodo() throws NullPointerException {
    // Unchecked: não precisa
}

// ✅ Não declarar
public void metodo() {
    // OK sem throws
}
```

### 3. Tratar ao Invés de Prevenir

```java
// ❌ Tratar bug
try {
    int r = a / b;
} catch (ArithmeticException e) { }

// ✅ Prevenir
if (b == 0) {
    throw new IllegalArgumentException("Zero");
}
```

---

## Boas Práticas

### 1. Prevenir ao Invés de Tratar

```java
// ✅ Validar parâmetros
if (valor < 0) {
    throw new IllegalArgumentException("Negativo");
}
```

### 2. Não Declarar throws (Opcional)

```java
// ✅ Não declarar (mais limpo)
public void processar() {
    // Pode lançar NPE, mas não declarar
}
```

### 3. Documentar Exceções Lançadas Explicitamente

```java
/**
 * @throws IllegalArgumentException Se idade < 0
 */
public void setIdade(int idade) {
    if (idade < 0) {
        throw new IllegalArgumentException("Idade negativa");
    }
}
```

---

## Resumo

**Unchecked** NÃO requer tratamento **obrigatório**.

**Características**:
- **Compilador NÃO verifica**
- **COMPILA** sem `throws` ou `try-catch`
- `throws` **opcional** (não obriga chamador)
- `try-catch` **opcional**
- Erro **só** em **runtime** (se ocorrer)

**Comparação com checked**:
- **Checked**: DEVE tratar ou declarar
- **Unchecked**: OPCIONAL tratar ou declarar

**Vantagens**:
- Código **limpo** (sem poluição)
- **Flexibilidade** (decidir quando tratar)
- Bugs **visíveis** (não mascarar)
- Foco na **lógica** (não tratamento)

**Quando tratar**:
- **Input usuário** (imprevisível)
- **API terceiros** (pode lançar)
- **Aplicação crítica** (não pode parar)

**Prevenir**:
- **Validar** parâmetros (`if null throw`)
- **Verificar** condições (`if divisor == 0 throw`)
- Lançar **IllegalArgumentException**

**Regra de Ouro**: Unchecked = **não obrigatório**. Compilador **não verifica**. `throws` **opcional** (não obriga chamador). **Prevenir** com validações (não tratar). Tratar apenas casos **específicos** (input usuário, API terceiros).
