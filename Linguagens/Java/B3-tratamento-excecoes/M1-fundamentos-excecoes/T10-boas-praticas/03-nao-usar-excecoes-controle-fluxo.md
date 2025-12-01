# T10.03 - Não Usar Exceções para Controle de Fluxo

## Introdução

**Exceções**: para situações **excepcionais**, não fluxo **normal**.

```java
/*
 * EXCEÇÕES: SITUAÇÕES EXCEPCIONAIS
 * 
 * ❌ NÃO USAR:
 * - Controle de fluxo normal
 * - Validação de entrada
 * - Indicar sucesso/falha
 * 
 * ✅ USAR:
 * - Erros inesperados
 * - Condições excepcionais
 * - Falhas irrecuperáveis
 */

// ❌ Exceção para fluxo normal
public class ExemploRuim {
    public static int buscar(int[] array, int valor) {
        try {
            for (int i = 0; ; i++) {  // Loop infinito
                if (array[i] == valor) {
                    return i;
                }
            }
        } catch (ArrayIndexOutOfBoundsException e) {  // ❌ Usar exceção para sair
            return -1;  // Não encontrado
        }
    }
}

// ✅ Fluxo normal com if
public class ExemploBom {
    public static int buscar(int[] array, int valor) {
        for (int i = 0; i < array.length; i++) {  // ✅ Condição normal
            if (array[i] == valor) {
                return i;
            }
        }
        return -1;  // ✅ Retorno normal
    }
}
```

**Regra**: exceções para situações **excepcionais**, **if/else** para fluxo normal.

---

## Fundamentos

### 1. Por Que Não Usar

```java
// ❌ Exceção para controle de fluxo: problemas
public class PorQueNaoUsar {
    
    // ❌ Problema 1: Performance
    public static void problema1() {
        long inicio = System.nanoTime();
        
        for (int i = 0; i < 1000; i++) {
            try {
                int resultado = 10 / 0;  // ArithmeticException
            } catch (ArithmeticException e) {  // ❌ Lento
                // Usar exceção para controlar
            }
        }
        
        long fim = System.nanoTime();
        System.out.println("Exceção: " + (fim - inicio) + " ns");
    }
    
    // ✅ Alternativa: if
    public static void alternativa1() {
        long inicio = System.nanoTime();
        
        for (int i = 0; i < 1000; i++) {
            int divisor = 0;
            if (divisor != 0) {  // ✅ Rápido
                int resultado = 10 / divisor;
            } else {
                // Tratar divisor zero
            }
        }
        
        long fim = System.nanoTime();
        System.out.println("If: " + (fim - inicio) + " ns");
    }
}

/*
 * POR QUE NÃO USAR:
 * 
 * 1. PERFORMANCE:
 *    - Lançar exceção é LENTO
 *    - Stack trace é caro
 *    - if/else é RÁPIDO
 * 
 * 2. LEGIBILIDADE:
 *    - Exceção: situação excepcional
 *    - if/else: fluxo claro
 * 
 * 3. INTENÇÃO:
 *    - Exceção: erro inesperado
 *    - if/else: validação normal
 */
```

**Performance**: exceção **lenta**, if/else **rápido**.

### 2. Custo de Performance

```java
// ❌ Exceção: custo alto
public class CustoPerformance {
    
    public static void main(String[] args) {
        // Benchmark: exceção vs if
        int iteracoes = 100000;
        
        // ❌ Com exceção
        long inicio1 = System.nanoTime();
        for (int i = 0; i < iteracoes; i++) {
            comExcecao(10);
        }
        long fim1 = System.nanoTime();
        
        // ✅ Com if
        long inicio2 = System.nanoTime();
        for (int i = 0; i < iteracoes; i++) {
            comIf(10);
        }
        long fim2 = System.nanoTime();
        
        System.out.println("Exceção: " + (fim1 - inicio1) / 1_000_000 + " ms");
        System.out.println("If: " + (fim2 - inicio2) / 1_000_000 + " ms");
    }
    
    // ❌ Com exceção (LENTO)
    static int comExcecao(int valor) {
        try {
            if (valor < 0) {
                throw new IllegalArgumentException();
            }
            return valor * 2;
        } catch (IllegalArgumentException e) {
            return 0;
        }
    }
    
    // ✅ Com if (RÁPIDO)
    static int comIf(int valor) {
        if (valor < 0) {
            return 0;
        }
        return valor * 2;
    }
}

/*
 * CUSTO EXCEÇÃO:
 * 
 * - Criar objeto Throwable
 * - Capturar stack trace
 * - Desenrolar pilha (stack unwinding)
 * - Propagar exceção
 * 
 * RESULTADO:
 * Exceção: ~100-1000x MAIS LENTO que if
 */
```

**Custo**: exceção **100-1000x** mais lenta que if.

### 3. Legibilidade e Intenção

```java
// ❌ Exceção: intenção confusa
public class LegibilidadeIntencao {
    
    // ❌ Confuso: exceção para fluxo
    public static void exemploRuim() {
        try {
            String valor = obterValor();
            if (valor == null) {
                throw new NullPointerException();  // ❌ Forçar exceção
            }
            processar(valor);
        } catch (NullPointerException e) {  // ❌ Usar para controle
            usarValorPadrao();
        }
    }
    
    // ✅ Claro: if para fluxo
    public static void exemploBom() {
        String valor = obterValor();
        if (valor == null) {  // ✅ Validação clara
            usarValorPadrao();
        } else {
            processar(valor);
        }
    }
    
    static String obterValor() { return null; }
    static void processar(String valor) { }
    static void usarValorPadrao() { }
}

/*
 * LEGIBILIDADE:
 * 
 * ❌ Exceção para fluxo:
 *    - Confuso
 *    - Intenção oculta
 *    - Difícil manter
 * 
 * ✅ If/else:
 *    - Claro
 *    - Intenção explícita
 *    - Fácil manter
 */
```

**Legibilidade**: if/else **claro**, exceção **confusa**.

### 4. Validação de Entrada

```java
// ❌ Exceção para validação
public class ValidacaoEntrada {
    
    // ❌ Exceção para validar
    public static void validarRuim(String email) {
        try {
            if (!email.contains("@")) {
                throw new IllegalArgumentException("Email inválido");
            }
            processar(email);
        } catch (IllegalArgumentException e) {  // ❌ Exceção para validação
            System.out.println("Email inválido, usando padrão");
            processar("padrao@email.com");
        }
    }
    
    // ✅ If para validar
    public static void validarBom(String email) {
        if (!email.contains("@")) {  // ✅ Validação normal
            System.out.println("Email inválido, usando padrão");
            processar("padrao@email.com");
        } else {
            processar(email);
        }
    }
    
    // ✅ Retorno booleano
    public static boolean validar(String email) {
        return email != null && email.contains("@");
    }
    
    // ✅ Optional (Java 8+)
    public static Optional<String> validarOptional(String email) {
        if (email != null && email.contains("@")) {
            return Optional.of(email);
        }
        return Optional.empty();
    }
    
    static void processar(String email) { }
}

/*
 * VALIDAÇÃO:
 * 
 * ❌ Exceção:
 *    - Validação é fluxo NORMAL
 *    - Não é situação excepcional
 * 
 * ✅ Alternativas:
 *    - If/else
 *    - Retorno booleano
 *    - Optional
 */
```

**Validação**: fluxo **normal**, usar if/**Optional**, não exceção.

### 5. Indicar Sucesso/Falha

```java
// ❌ Exceção para indicar falha
public class IndicarSucessoFalha {
    
    // ❌ Exceção para indicar não encontrado
    public static String buscarRuim(Map<String, String> map, String chave) {
        try {
            String valor = map.get(chave);
            if (valor == null) {
                throw new NotFoundException("Não encontrado");  // ❌ Não é excepcional
            }
            return valor;
        } catch (NotFoundException e) {
            return "PADRÃO";
        }
    }
    
    // ✅ Null ou valor padrão
    public static String buscarBom1(Map<String, String> map, String chave) {
        return map.getOrDefault(chave, "PADRÃO");  // ✅ Claro
    }
    
    // ✅ Optional
    public static Optional<String> buscarBom2(Map<String, String> map, String chave) {
        return Optional.ofNullable(map.get(chave));  // ✅ Explícito
    }
    
    // ✅ Booleano + parâmetro out
    public static boolean buscarBom3(Map<String, String> map, String chave, 
                                      StringBuilder resultado) {
        String valor = map.get(chave);
        if (valor != null) {
            resultado.append(valor);
            return true;  // ✅ Encontrado
        }
        return false;  // ✅ Não encontrado
    }
}

class NotFoundException extends Exception {
    public NotFoundException(String msg) { super(msg); }
}

/*
 * INDICAR SUCESSO/FALHA:
 * 
 * ❌ Exceção:
 *    - Não encontrado NÃO é excepcional
 * 
 * ✅ Alternativas:
 *    - null ou valor padrão
 *    - Optional
 *    - Booleano
 *    - Objeto Result/Either
 */
```

**Sucesso/falha**: Optional/**booleano**, não exceção.

### 6. Loop e Iteração

```java
// ❌ Exceção para sair de loop
public class LoopIteracao {
    
    // ❌ Exceção para sair
    public static int buscarRuim(int[] array, int valor) {
        try {
            for (int i = 0; ; i++) {  // ❌ Loop infinito
                if (array[i] == valor) {
                    return i;
                }
            }
        } catch (ArrayIndexOutOfBoundsException e) {  // ❌ Exceção para sair
            return -1;
        }
    }
    
    // ✅ Condição normal
    public static int buscarBom(int[] array, int valor) {
        for (int i = 0; i < array.length; i++) {  // ✅ Condição explícita
            if (array[i] == valor) {
                return i;
            }
        }
        return -1;  // ✅ Não encontrado
    }
    
    // ✅ Enhanced for
    public static boolean contemBom(int[] array, int valor) {
        for (int elemento : array) {  // ✅ Sem exceção
            if (elemento == valor) {
                return true;
            }
        }
        return false;
    }
    
    // ✅ Stream (Java 8+)
    public static boolean contemStream(int[] array, int valor) {
        return Arrays.stream(array)
            .anyMatch(e -> e == valor);  // ✅ Funcional
    }
}

/*
 * LOOP:
 * 
 * ❌ Exceção para sair:
 *    - Confuso
 *    - Lento
 * 
 * ✅ Alternativas:
 *    - Condição explícita: i < length
 *    - Enhanced for
 *    - Stream
 *    - break/return
 */
```

**Loop**: condição **explícita**/break, não exceção.

### 7. Parsing e Conversão

```java
// ❌ Exceção para parsing
public class ParsingConversao {
    
    // ❌ Exceção para validar número
    public static boolean isNumeroRuim(String str) {
        try {
            Integer.parseInt(str);
            return true;  // ❌ Exceção para validar
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    // ✅ Validar antes de parsear
    public static boolean isNumeroBom(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        return str.matches("-?\\d+");  // ✅ Regex
    }
    
    // ✅ Método helper dedicado
    public static Optional<Integer> parseIntSafe(String str) {
        try {
            return Optional.of(Integer.parseInt(str));
        } catch (NumberFormatException e) {
            return Optional.empty();  // ✅ Exceção isolada
        }
    }
    
    // ✅ Uso isolado
    public static void processar(String str) {
        parseIntSafe(str).ifPresentOrElse(
            valor -> System.out.println("Valor: " + valor),
            () -> System.out.println("Inválido")
        );
    }
}

/*
 * PARSING:
 * 
 * ❌ Exceção para validar:
 *    - parseInt() lança exceção
 *    - Usar try/catch para validar é lento
 * 
 * ✅ Alternativas:
 *    - Validar antes (regex)
 *    - Método helper com Optional
 *    - Isolar try/catch
 */
```

**Parsing**: validar **antes**, ou helper com **Optional**.

### 8. Quando Exceção é Apropriada

```java
// ✅ Exceção apropriada: situações excepcionais
public class ExcecaoApropriada {
    
    // ✅ Arquivo não existe (excepcional)
    public static void lerArquivo(String caminho) throws FileNotFoundException {
        FileReader fr = new FileReader(caminho);  // ✅ Exceção apropriada
        // Arquivo não existir É excepcional
    }
    
    // ✅ Erro banco de dados (excepcional)
    public static void salvar(Entidade entidade) throws SQLException {
        // ✅ Erro SQL É excepcional
        // Conexão falhar, constraint violada, etc.
    }
    
    // ✅ Configuração inválida (excepcional)
    public static void inicializar(Config config) {
        if (config == null) {
            throw new IllegalArgumentException("Config null");  // ✅ Apropriada
        }
        if (config.getPorta() < 0) {
            throw new IllegalArgumentException("Porta inválida");  // ✅ Apropriada
        }
        // Configuração inválida É excepcional (erro programação)
    }
    
    // ❌ Valor não encontrado (NÃO excepcional)
    public static String buscarNome(int id) {
        // ❌ NÃO lançar exceção se não encontrar
        // Não encontrar é fluxo NORMAL, não excepcional
        return database.get(id);  // Retorna null se não encontrar
    }
    
    static class Entidade { }
    static class Config {
        public int getPorta() { return 8080; }
    }
    static Map<Integer, String> database = new HashMap<>();
}

/*
 * EXCEÇÃO APROPRIADA:
 * 
 * ✅ Situações EXCEPCIONAIS:
 *    - Arquivo não existe
 *    - Erro banco de dados
 *    - Argumento inválido (bug)
 *    - Conexão falhou
 * 
 * ❌ Fluxo NORMAL:
 *    - Valor não encontrado
 *    - Validação entrada
 *    - Indicar sucesso/falha
 */
```

**Apropriada**: arquivo não existe, erro **BD**, argumento inválido (bug).

### 9. Anti-padrões Comuns

```java
// ❌ Anti-padrões com exceções
public class AntiPadroesComuns {
    
    // ❌ Anti-padrão 1: Exceção como goto
    public static void antiPadrao1() {
        try {
            etapa1();
            etapa2();
            etapa3();
        } catch (MinhaException e) {  // ❌ Usar como goto
            // Pular para cá
        }
    }
    
    static void etapa1() throws MinhaException {
        throw new MinhaException();  // ❌ Forçar exceção para "saltar"
    }
    static void etapa2() { }
    static void etapa3() { }
    
    // ❌ Anti-padrão 2: Exceção como retorno
    public static String antiPadrao2(int id) {
        try {
            throw new ValorException("Valor: " + id);  // ❌ Usar exceção como retorno
        } catch (ValorException e) {
            return e.getMessage();
        }
    }
    
    // ❌ Anti-padrão 3: Exceção em condição esperada
    public static void antiPadrao3(String str) {
        try {
            if (str.isEmpty()) {
                throw new EmptyException();  // ❌ String vazia NÃO é excepcional
            }
            processar(str);
        } catch (EmptyException e) {
            usarPadrao();
        }
    }
    
    // ✅ Correto: if/else
    public static void correto(String str) {
        if (str.isEmpty()) {  // ✅ Validação normal
            usarPadrao();
        } else {
            processar(str);
        }
    }
    
    static void processar(String str) { }
    static void usarPadrao() { }
}

class MinhaException extends Exception { }
class ValorException extends Exception {
    public ValorException(String msg) { super(msg); }
}
class EmptyException extends Exception { }

/*
 * ANTI-PADRÕES:
 * 
 * ❌ Exceção como GOTO
 * ❌ Exceção como RETORNO
 * ❌ Exceção para condição ESPERADA
 * 
 * ✅ Usar:
 *    - if/else
 *    - return
 *    - break/continue
 */
```

**Anti-padrões**: exceção como **goto**, **retorno**, condição **esperada**.

### 10. Resumo Visual

```java
/*
 * NÃO USAR EXCEÇÕES PARA CONTROLE DE FLUXO
 * 
 * ❌ NÃO USAR EXCEÇÃO:
 * 
 * 1. LOOP:
 * try {
 *     for (int i = 0; ; i++) {
 *         if (array[i] == valor) return i;
 *     }
 * } catch (ArrayIndexOutOfBoundsException e) {  // ❌ Exceção para sair
 *     return -1;
 * }
 * 
 * ✅ USAR IF:
 * for (int i = 0; i < array.length; i++) {  // ✅ Condição normal
 *     if (array[i] == valor) return i;
 * }
 * return -1;
 * 
 * 
 * 2. VALIDAÇÃO:
 * ❌ Exceção:
 * try {
 *     if (!email.contains("@")) {
 *         throw new IllegalArgumentException();
 *     }
 * } catch (IllegalArgumentException e) { }
 * 
 * ✅ If:
 * if (!email.contains("@")) {  // ✅ Validação normal
 *     usarPadrao();
 * }
 * 
 * 
 * 3. SUCESSO/FALHA:
 * ❌ Exceção:
 * try {
 *     if (valor == null) throw new NotFoundException();
 * } catch (NotFoundException e) {
 *     return "PADRÃO";
 * }
 * 
 * ✅ Optional:
 * return Optional.ofNullable(valor)
 *     .orElse("PADRÃO");
 * 
 * 
 * POR QUE NÃO USAR:
 * 
 * 1. PERFORMANCE:
 *    - Exceção: 100-1000x MAIS LENTA
 *    - If/else: RÁPIDO
 * 
 * 2. LEGIBILIDADE:
 *    - Exceção: intenção CONFUSA
 *    - If/else: intenção CLARA
 * 
 * 3. MANUTENÇÃO:
 *    - Exceção: DIFÍCIL manter
 *    - If/else: FÁCIL manter
 * 
 * 
 * CUSTO EXCEÇÃO:
 * 
 * - Criar objeto Throwable
 * - Capturar stack trace
 * - Desenrolar pilha
 * - Propagar exceção
 * 
 * 
 * ALTERNATIVAS:
 * 
 * 1. IF/ELSE:
 * if (condicao) {
 *     // ...
 * } else {
 *     // ...
 * }
 * 
 * 2. OPTIONAL:
 * Optional.ofNullable(valor)
 *     .ifPresentOrElse(v -> {}, () -> {})
 * 
 * 3. BOOLEANO:
 * if (validar()) {
 *     // ...
 * }
 * 
 * 4. NULL/VALOR PADRÃO:
 * String valor = map.getOrDefault(chave, "PADRÃO")
 * 
 * 5. BREAK/RETURN:
 * for (...) {
 *     if (condicao) break;
 * }
 * 
 * 
 * QUANDO EXCEÇÃO APROPRIADA:
 * 
 * ✅ Situações EXCEPCIONAIS:
 *    - Arquivo não existe
 *    - Erro banco de dados
 *    - Argumento inválido (bug)
 *    - Conexão falhou
 *    - Configuração inválida
 * 
 * ❌ Fluxo NORMAL:
 *    - Validação entrada
 *    - Valor não encontrado
 *    - Parsing/conversão
 *    - Loop/iteração
 * 
 * 
 * ANTI-PADRÕES:
 * 
 * ❌ Exceção como GOTO
 * ❌ Exceção como RETORNO
 * ❌ Exceção para condição ESPERADA
 * ❌ Exceção para validação
 * ❌ Exceção para indicar sucesso/falha
 */

public class ExemploControleFluxo {
    
    // ❌ ERRADO: Exceção para controle
    public static void exemploErrado() {
        try {
            String valor = obterValor();
            if (valor == null) {
                throw new NullPointerException();  // ❌ Forçar exceção
            }
            processar(valor);
        } catch (NullPointerException e) {  // ❌ Usar para controle
            usarPadrao();
        }
    }
    
    // ✅ CORRETO: If/else
    public static void exemploCorreto1() {
        String valor = obterValor();
        if (valor == null) {  // ✅ Validação normal
            usarPadrao();
        } else {
            processar(valor);
        }
    }
    
    // ✅ CORRETO: Optional
    public static void exemploCorreto2() {
        Optional.ofNullable(obterValor())
            .ifPresentOrElse(
                valor -> processar(valor),  // ✅ Presente
                () -> usarPadrao()          // ✅ Ausente
            );
    }
    
    // ✅ EXCEÇÃO APROPRIADA: situação excepcional
    public static void excecaoApropriada(String caminho) 
            throws FileNotFoundException {
        FileReader fr = new FileReader(caminho);  // ✅ Arquivo não existir É excepcional
        // ...
    }
    
    static String obterValor() { return null; }
    static void processar(String valor) { }
    static void usarPadrao() { }
}
```

---

## Aplicabilidade

**Não usar exceções**:
- **Controle** de fluxo normal
- **Validação** de entrada
- Indicar **sucesso/falha**

**Usar exceções**:
- Situações **excepcionais** apenas
- Erros **inesperados**

---

## Armadilhas

### 1. Exceção em Loop

```java
// ❌ Exceção para sair de loop
try {
    for (int i = 0; ; i++) { }
} catch (ArrayIndexOutOfBoundsException e) { }

// ✅ Condição normal
for (int i = 0; i < array.length; i++) { }
```

### 2. Exceção para Validar

```java
// ❌ Exceção para validação
try {
    if (!valido) throw new Exception();
} catch (Exception e) { }

// ✅ If para validação
if (!valido) { usarPadrao(); }
```

### 3. Performance

```java
// ❌ Exceção (100-1000x mais lento)
try { throw new Exception(); }
catch (Exception e) { }

// ✅ If (rápido)
if (condicao) { }
```

---

## Boas Práticas

### 1. If/Else para Fluxo

```java
// ✅ If para fluxo normal
if (condicao) { } else { }
```

### 2. Optional para Ausência

```java
// ✅ Optional para valor ausente
Optional.ofNullable(valor)
```

### 3. Exceção para Excepcional

```java
// ✅ Exceção apenas para excepcional
throw new FileNotFoundException();
```

---

## Resumo

**Não usar exceções**: controle fluxo **normal**, validação, sucesso/falha.

**Por quê**:
1. **Performance**: exceção 100-1000x **mais lenta** que if
2. **Legibilidade**: exceção **confusa**, if **claro**
3. **Intenção**: exceção = excepcional, if = normal
4. **Manutenção**: exceção **dificulta**

**Custo exceção**:
- Criar objeto Throwable
- Capturar **stack trace** (caro)
- Desenrolar **pilha**
- Propagar exceção

**Não usar para**:
- ❌ **Loop**: sair com exceção
- ❌ **Validação**: entrada usuário
- ❌ **Sucesso/falha**: encontrado/não encontrado
- ❌ **Parsing**: validar número
- ❌ **Goto**: saltar código
- ❌ **Retorno**: passar valor

**Alternativas**:
1. **If/else**: fluxo normal
2. **Optional**: valor ausente
3. **Booleano**: sucesso/falha
4. **Null/padrão**: `getOrDefault()`
5. **Break/return**: sair loop

**Exceção apropriada**:
- ✅ Arquivo **não existe** (FileNotFoundException)
- ✅ Erro **banco** (SQLException)
- ✅ Argumento **inválido** (IllegalArgumentException - bug)
- ✅ Conexão **falhou** (IOException)
- ✅ Configuração **inválida**

**Fluxo normal** (não exceção):
- Valor **não encontrado** em map
- **Validação** entrada usuário
- String **vazia**
- **Parsing** número

**Anti-padrões**:
- Exceção como **goto**
- Exceção como **retorno**
- Exceção para condição **esperada**

**Regra de Ouro**: Exceções para situações **excepcionais** apenas. Fluxo normal usar **if/else**, **Optional**, **booleano**. Exceção 100-1000x mais lenta. Validação = fluxo normal (if). Não encontrado = fluxo normal (Optional/null). Stack trace é caro. Intenção clara: exceção = erro inesperado, if = validação esperada.

