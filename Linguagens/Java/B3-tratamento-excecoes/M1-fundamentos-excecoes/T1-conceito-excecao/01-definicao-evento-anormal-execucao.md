# T1.01 - Definição: Evento Anormal Durante Execução

## Introdução

**Exceção** = evento **anormal** que **interrompe** o fluxo normal de execução do programa.

```java
// ❌ Sem tratamento: programa QUEBRA
public static void main(String[] args) {
    int[] numeros = {1, 2, 3};
    System.out.println(numeros[10]);  // ❌ EXCEÇÃO! ArrayIndexOutOfBoundsException
    System.out.println("Continua...");  // ❌ NÃO EXECUTA
}

// ✅ Com tratamento: programa CONTINUA
public static void main(String[] args) {
    int[] numeros = {1, 2, 3};
    try {
        System.out.println(numeros[10]);  // Exceção aqui
    } catch (ArrayIndexOutOfBoundsException e) {
        System.out.println("Índice inválido!");
    }
    System.out.println("Continua normalmente");  // ✅ EXECUTA
}
```

**Exceções** permitem **detectar** e **tratar** problemas sem **crashar** o programa.

---

## Fundamentos

### 1. O Que é uma Exceção?

**Exceção** = objeto que representa um **problema** durante a execução.

```java
// ✅ Exceção: evento anormal
public class ExemploExcecao {
    public static void main(String[] args) {
        // 1. DIVISÃO POR ZERO
        try {
            int resultado = 10 / 0;  // ArithmeticException
        } catch (ArithmeticException e) {
            System.out.println("Erro: divisão por zero");
        }
        
        // 2. ACESSO A ÍNDICE INVÁLIDO
        try {
            int[] arr = {1, 2, 3};
            System.out.println(arr[5]);  // ArrayIndexOutOfBoundsException
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Erro: índice fora dos limites");
        }
        
        // 3. CONVERSÃO INVÁLIDA
        try {
            String texto = "abc";
            int numero = Integer.parseInt(texto);  // NumberFormatException
        } catch (NumberFormatException e) {
            System.out.println("Erro: texto não é número");
        }
        
        // 4. NULL POINTER
        try {
            String texto = null;
            int tamanho = texto.length();  // NullPointerException
        } catch (NullPointerException e) {
            System.out.println("Erro: objeto é null");
        }
        
        System.out.println("Programa continua normalmente");
    }
}
```

**Exceção** = problema que **pode acontecer** durante execução.

### 2. Fluxo Normal vs Excepcional

```java
// ✅ FLUXO NORMAL: tudo funciona
public static void calcular() {
    int a = 10;
    int b = 2;
    int resultado = a / b;  // ✅ 5
    System.out.println("Resultado: " + resultado);
    System.out.println("Cálculo concluído");  // ✅ EXECUTA
}

// ❌ FLUXO EXCEPCIONAL: problema ocorre
public static void calcularComProblema() {
    int a = 10;
    int b = 0;
    int resultado = a / b;  // ❌ ArithmeticException AQUI
    System.out.println("Resultado: " + resultado);  // ❌ NÃO EXECUTA
    System.out.println("Cálculo concluído");  // ❌ NÃO EXECUTA
}

// ✅ FLUXO EXCEPCIONAL TRATADO: problema detectado e resolvido
public static void calcularTratado() {
    int a = 10;
    int b = 0;
    
    try {
        int resultado = a / b;  // Exceção aqui
        System.out.println("Resultado: " + resultado);
    } catch (ArithmeticException e) {
        System.out.println("Erro: não pode dividir por zero");
        System.out.println("Usando valor padrão: 0");
    }
    
    System.out.println("Cálculo concluído");  // ✅ EXECUTA
}
```

**Fluxo normal** = sem problemas. **Fluxo excepcional** = problema detectado.

### 3. Propagação de Exceção

```java
// ✅ Exceção se PROPAGA pela pilha de chamadas
public class PropagacaoExcecao {
    
    public static void metodoA() {
        System.out.println("metodoA: início");
        metodoB();  // Chama metodoB
        System.out.println("metodoA: fim");  // ❌ NÃO EXECUTA se exceção
    }
    
    public static void metodoB() {
        System.out.println("metodoB: início");
        metodoC();  // Chama metodoC
        System.out.println("metodoB: fim");  // ❌ NÃO EXECUTA se exceção
    }
    
    public static void metodoC() {
        System.out.println("metodoC: início");
        int resultado = 10 / 0;  // ❌ EXCEÇÃO AQUI
        System.out.println("metodoC: fim");  // ❌ NÃO EXECUTA
    }
    
    public static void main(String[] args) {
        try {
            metodoA();  // Começa aqui
        } catch (ArithmeticException e) {
            System.out.println("Exceção capturada no main");
            e.printStackTrace();  // Mostra caminho da exceção
        }
    }
}

/* Saída:
metodoA: início
metodoB: início
metodoC: início
Exceção capturada no main
java.lang.ArithmeticException: / by zero
    at PropagacaoExcecao.metodoC(...)
    at PropagacaoExcecao.metodoB(...)
    at PropagacaoExcecao.metodoA(...)
    at PropagacaoExcecao.main(...)
*/
```

Exceção **propaga** de método em método até ser **capturada** ou **encerrar** o programa.

### 4. Exceção como Objeto

```java
// ✅ Exceção é um OBJETO
public class ExcecaoObjeto {
    public static void main(String[] args) {
        try {
            int resultado = 10 / 0;
        } catch (ArithmeticException e) {  // 'e' é um OBJETO
            // Métodos do objeto exceção:
            System.out.println("Mensagem: " + e.getMessage());
            System.out.println("Tipo: " + e.getClass().getName());
            System.out.println("Causa: " + e.getCause());
            System.out.println("String: " + e.toString());
            
            // Stack trace:
            System.out.println("\nStack Trace:");
            e.printStackTrace();
        }
    }
}

/* Saída:
Mensagem: / by zero
Tipo: java.lang.ArithmeticException
Causa: null
String: java.lang.ArithmeticException: / by zero

Stack Trace:
java.lang.ArithmeticException: / by zero
    at ExcecaoObjeto.main(ExcecaoObjeto.java:5)
*/
```

**Exceção** = objeto com **informações** sobre o problema.

### 5. Quando Exceções Ocorrem

```java
// ✅ Situações que causam exceções
public class SituacoesExcecao {
    public static void main(String[] args) {
        
        // 1. OPERAÇÃO INVÁLIDA
        try {
            int x = 10 / 0;  // ArithmeticException
        } catch (ArithmeticException e) {
            System.out.println("1. Operação matemática inválida");
        }
        
        // 2. ÍNDICE INVÁLIDO
        try {
            int[] arr = {1, 2, 3};
            int valor = arr[10];  // ArrayIndexOutOfBoundsException
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("2. Índice fora dos limites");
        }
        
        // 3. REFERÊNCIA NULL
        try {
            String texto = null;
            int tamanho = texto.length();  // NullPointerException
        } catch (NullPointerException e) {
            System.out.println("3. Objeto é null");
        }
        
        // 4. CONVERSÃO INVÁLIDA
        try {
            String texto = "abc";
            int numero = Integer.parseInt(texto);  // NumberFormatException
        } catch (NumberFormatException e) {
            System.out.println("4. Conversão de tipo inválida");
        }
        
        // 5. CAST INVÁLIDO
        try {
            Object obj = "texto";
            Integer num = (Integer) obj;  // ClassCastException
        } catch (ClassCastException e) {
            System.out.println("5. Cast inválido");
        }
        
        // 6. ARGUMENTO INVÁLIDO
        try {
            Thread.sleep(-1000);  // IllegalArgumentException
        } catch (IllegalArgumentException e) {
            System.out.println("6. Argumento inválido");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // 7. ESTADO INVÁLIDO
        try {
            List<Integer> lista = List.of(1, 2, 3);  // Imutável
            lista.add(4);  // UnsupportedOperationException
        } catch (UnsupportedOperationException e) {
            System.out.println("7. Operação não suportada");
        }
    }
}
```

**Exceções** ocorrem em diversas situações: operações inválidas, dados incorretos, estados inesperados.

### 6. Exceção vs Condição Normal

```java
// ⚠️ NÃO usar exceção para CONTROLE DE FLUXO normal
public class ExcecaoVsCondicao {
    
    // ❌ MAU USO: exceção para controle de fluxo
    public static boolean isNumeroMau(String texto) {
        try {
            Integer.parseInt(texto);
            return true;  // É número
        } catch (NumberFormatException e) {
            return false;  // Não é número
        }
    }
    
    // ✅ BOM USO: validação normal
    public static boolean isNumeroBom(String texto) {
        if (texto == null || texto.isEmpty()) {
            return false;
        }
        return texto.matches("-?\\d+");  // Regex para número
    }
    
    // ✅ Exceção para situação ANORMAL
    public static int dividir(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Divisor não pode ser zero");
        }
        return a / b;
    }
    
    public static void main(String[] args) {
        // Uso de validação
        System.out.println(isNumeroBom("123"));   // true
        System.out.println(isNumeroBom("abc"));   // false
        
        // Exceção para erro
        try {
            int resultado = dividir(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }
}
```

**Exceção** = situação **anormal**. **Condição** = validação **normal**.

### 7. Impacto de Exceções Não Tratadas

```java
// ❌ Exceção NÃO tratada: programa QUEBRA
public class ExcecaoNaoTratada {
    public static void main(String[] args) {
        System.out.println("Início do programa");
        
        int[] numeros = {1, 2, 3};
        System.out.println("Acessando índice 10...");
        System.out.println(numeros[10]);  // ❌ QUEBRA AQUI
        
        System.out.println("Fim do programa");  // ❌ NUNCA EXECUTA
    }
}

/* Saída:
Início do programa
Acessando índice 10...
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 3
    at ExcecaoNaoTratada.main(ExcecaoNaoTratada.java:7)
*/

// ✅ Exceção TRATADA: programa continua
public class ExcecaoTratada {
    public static void main(String[] args) {
        System.out.println("Início do programa");
        
        int[] numeros = {1, 2, 3};
        System.out.println("Acessando índice 10...");
        
        try {
            System.out.println(numeros[10]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Erro: índice inválido");
        }
        
        System.out.println("Fim do programa");  // ✅ EXECUTA
    }
}

/* Saída:
Início do programa
Acessando índice 10...
Erro: índice inválido
Fim do programa
*/
```

**Exceção não tratada** = programa encerra. **Exceção tratada** = programa continua.

### 8. Múltiplas Exceções

```java
// ✅ Tratar múltiplas exceções
public class MultiplasExcecoes {
    public static void processar(String[] args) {
        try {
            // Pode lançar várias exceções diferentes
            int indice = Integer.parseInt(args[0]);  // NumberFormatException
            int[] arr = {1, 2, 3};
            int valor = arr[indice];  // ArrayIndexOutOfBoundsException
            int resultado = 10 / valor;  // ArithmeticException
            System.out.println("Resultado: " + resultado);
            
        } catch (NumberFormatException e) {
            System.out.println("Erro: argumento não é número");
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Erro: índice fora dos limites");
        } catch (ArithmeticException e) {
            System.out.println("Erro: divisão por zero");
        }
    }
    
    public static void main(String[] args) {
        processar(new String[]{"abc"});     // NumberFormatException
        processar(new String[]{"10"});      // ArrayIndexOutOfBoundsException
        processar(new String[]{"0"});       // ArithmeticException (arr[0] = 1, então 10/1 = 10, não dá erro)
    }
}
```

Um método pode lançar **diferentes tipos** de exceção.

### 9. Exceção em Construtores

```java
// ✅ Exceções em construtores
public class Pessoa {
    private String nome;
    private int idade;
    
    public Pessoa(String nome, int idade) {
        if (nome == null || nome.isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
        
        this.nome = nome;
        this.idade = idade;
    }
    
    public static void main(String[] args) {
        try {
            Pessoa p1 = new Pessoa("João", 30);  // ✅ OK
            System.out.println("Pessoa criada: " + p1);
            
            Pessoa p2 = new Pessoa("", 25);  // ❌ Exceção
        } catch (IllegalArgumentException e) {
            System.out.println("Erro ao criar pessoa: " + e.getMessage());
        }
        
        try {
            Pessoa p3 = new Pessoa("Maria", 200);  // ❌ Exceção
        } catch (IllegalArgumentException e) {
            System.out.println("Erro ao criar pessoa: " + e.getMessage());
        }
    }
    
    @Override
    public String toString() {
        return nome + " (" + idade + " anos)";
    }
}
```

**Construtores** também podem lançar exceções para **validar** dados.

### 10. Resumo Visual

```java
/*
 * EXCEÇÃO = EVENTO ANORMAL DURANTE EXECUÇÃO
 * 
 * FLUXO NORMAL:
 *   inicio() → processamento() → fim()
 *   
 * FLUXO COM EXCEÇÃO NÃO TRATADA:
 *   inicio() → processamento() → EXCEÇÃO! → ❌ CRASH
 *   
 * FLUXO COM EXCEÇÃO TRATADA:
 *   inicio() → try { processamento() } → EXCEÇÃO!
 *           → catch { tratamento } → fim()
 */

public class ResumoExcecao {
    public static void main(String[] args) {
        // ✅ Programa robusto: trata exceções
        try {
            // Código que PODE lançar exceção
            int resultado = operacaoPerigosa();
            System.out.println("Resultado: " + resultado);
        } catch (Exception e) {
            // Código que TRATA a exceção
            System.out.println("Erro tratado: " + e.getMessage());
        }
        
        // Programa continua normalmente
        System.out.println("Programa finalizado com sucesso");
    }
    
    public static int operacaoPerigosa() {
        // Pode lançar exceção
        return 10 / 0;
    }
}
```

---

## Aplicabilidade

**Exceção** permite:
- Detectar problemas durante execução
- Separar código normal de tratamento de erro
- Propagar erros pela pilha de chamadas
- Manter programa funcionando mesmo com erros

---

## Armadilhas

### 1. Ignorar Exceções

```java
// ❌ Capturar e ignorar
try {
    int resultado = 10 / 0;
} catch (ArithmeticException e) {
    // ❌ Não faz NADA
}

// ✅ Tratar adequadamente
try {
    int resultado = 10 / 0;
} catch (ArithmeticException e) {
    System.err.println("Erro: " + e.getMessage());
    e.printStackTrace();
}
```

### 2. Usar Exceção para Controle de Fluxo

```java
// ❌ Exceção para fluxo normal
for (int i = 0; ; i++) {
    try {
        System.out.println(array[i]);
    } catch (ArrayIndexOutOfBoundsException e) {
        break;  // ❌ Usa exceção para sair do loop
    }
}

// ✅ Condição normal
for (int i = 0; i < array.length; i++) {
    System.out.println(array[i]);
}
```

### 3. Não Logar Exceções

```java
// ⚠️ Sem log
catch (Exception e) {
    // Como saber o que aconteceu?
}

// ✅ Com log
catch (Exception e) {
    logger.error("Erro ao processar", e);
    e.printStackTrace();
}
```

---

## Boas Práticas

### 1. Tratar Exceções Específicas

```java
// ✅ Específico
catch (FileNotFoundException e) { }
catch (IOException e) { }

// ⚠️ Muito genérico
catch (Exception e) { }
```

### 2. Logar Informações

```java
// ✅ Log completo
catch (Exception e) {
    logger.error("Erro ao processar arquivo: " + arquivo, e);
}
```

### 3. Documentar Exceções

```java
/**
 * Divide dois números.
 * @throws ArithmeticException se divisor for zero
 */
public int dividir(int a, int b) {
    if (b == 0) {
        throw new ArithmeticException("Divisor não pode ser zero");
    }
    return a / b;
}
```

---

## Resumo

**Exceção** = evento **anormal** durante execução que **interrompe** fluxo normal.

**Características**:
- Evento **inesperado** durante execução
- **Objeto** com informações do problema
- **Propaga** pela pilha de chamadas
- Pode ser **capturada** e **tratada**

**Sem tratamento**: programa **encerra** (crash).  
**Com tratamento**: programa **continua** normalmente.

**Situações comuns**:
- Divisão por zero (`ArithmeticException`)
- Índice inválido (`ArrayIndexOutOfBoundsException`)
- Referência null (`NullPointerException`)
- Conversão inválida (`NumberFormatException`)

**Regra de Ouro**: **Exceção** = situação **anormal** que precisa **tratamento**. **NÃO** usar para controle de fluxo normal. **Sempre** tratar ou declarar. **Logar** informações para debugging.
