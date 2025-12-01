# T6.03 - Base para Expressões Lambda

## Introdução

**Interfaces funcionais**: base para **expressões lambda** (Java 8+).

```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b);
}

// Antes do Java 8: classe anônima
Calculadora soma1 = new Calculadora() {
    @Override
    public int calcular(int a, int b) {
        return a + b;
    }
};

// Java 8+: lambda
Calculadora soma2 = (a, b) -> a + b;

int resultado = soma2.calcular(5, 3); // 8
```

**Lambda**: implementação **concisa** de interface funcional.

**Sintaxe**:
```java
(parametros) -> expressao
(parametros) -> { corpo }
```

---

## Fundamentos

### 1. Sintaxe Básica

**Lambda**: (parametros) -> expressao/corpo.

```java
@FunctionalInterface
public interface Operacao {
    int executar(int a, int b);
}

// Lambda: expressão única
Operacao soma = (a, b) -> a + b;

// Lambda: corpo com múltiplas linhas
Operacao subtracao = (a, b) -> {
    System.out.println("Subtraindo " + a + " - " + b);
    return a - b;
};

int r1 = soma.executar(10, 5); // 15
int r2 = subtracao.executar(10, 5); // 5
```

### 2. Inferência de Tipo

**Tipos dos parâmetros**: inferidos pelo compilador.

```java
@FunctionalInterface
public interface Conversor {
    String converter(int valor);
}

// ✅ Sem tipo (inferido)
Conversor c1 = valor -> String.valueOf(valor);

// ✅ Com tipo (explícito)
Conversor c2 = (int valor) -> String.valueOf(valor);

// Ambos funcionam
String s1 = c1.converter(42); // "42"
String s2 = c2.converter(42); // "42"
```

### 3. Zero Parâmetros

**Zero parâmetros**: () vazio.

```java
@FunctionalInterface
public interface Fornecedor {
    String fornecer();
}

// Lambda sem parâmetros
Fornecedor f = () -> "Olá, mundo!";

String mensagem = f.fornecer(); // "Olá, mundo!"
```

### 4. Um Parâmetro

**Um parâmetro**: parênteses opcionais.

```java
@FunctionalInterface
public interface Transformador {
    String transformar(String valor);
}

// ✅ Sem parênteses (1 parâmetro)
Transformador t1 = valor -> valor.toUpperCase();

// ✅ Com parênteses
Transformador t2 = (valor) -> valor.toUpperCase();

String resultado = t1.transformar("hello"); // HELLO
```

### 5. Múltiplos Parâmetros

**Múltiplos parâmetros**: parênteses obrigatórios.

```java
@FunctionalInterface
public interface Comparador {
    int comparar(String a, String b);
}

// Parênteses obrigatórios (múltiplos parâmetros)
Comparador c = (a, b) -> a.compareTo(b);

int resultado = c.comparar("abc", "def"); // negativo
```

### 6. Expressão vs Bloco

**Expressão**: sem chaves, return implícito.
**Bloco**: com chaves, return explícito.

```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b);
}

// Expressão: return implícito
Calculadora c1 = (a, b) -> a + b;

// Bloco: return explícito
Calculadora c2 = (a, b) -> {
    int resultado = a + b;
    return resultado;
};

// ❌ ERRO: bloco sem return
// Calculadora c3 = (a, b) -> {
//     a + b; // ERRO: falta return
// };
```

### 7. Acesso a Variáveis Locais

**Variáveis locais**: devem ser **efetivamente final**.

```java
@FunctionalInterface
public interface Operacao {
    int executar(int valor);
}

public void metodo() {
    int fator = 10; // Efetivamente final
    
    // ✅ Acessa variável final
    Operacao multiplicar = valor -> valor * fator;
    
    int resultado = multiplicar.executar(5); // 50
    
    // ❌ ERRO: modificar variável quebra lambda
    // fator = 20; // ERRO: não é final
}
```

### 8. Acesso a Campos da Classe

**Campos da classe**: acessíveis em lambda.

```java
public class Processador {
    private int multiplicador = 10;
    
    @FunctionalInterface
    interface Operacao {
        int executar(int valor);
    }
    
    public void processar() {
        // Acessa campo da classe
        Operacao op = valor -> valor * this.multiplicador;
        
        int resultado = op.executar(5); // 50
        
        // Pode modificar campo
        this.multiplicador = 20;
    }
}
```

### 9. Acesso a this

**this**: refere-se à **classe externa**, não ao lambda.

```java
public class Exemplo {
    private String nome = "Classe Externa";
    
    @FunctionalInterface
    interface Processador {
        void processar();
    }
    
    public void executar() {
        // this refere-se a Exemplo, não ao lambda
        Processador p = () -> System.out.println(this.nome);
        
        p.processar(); // Classe Externa
    }
}
```

### 10. Method Reference

**Method reference**: forma ainda mais concisa.

```java
@FunctionalInterface
public interface Conversor {
    String converter(int valor);
}

// Lambda
Conversor c1 = valor -> String.valueOf(valor);

// Method reference (mais conciso)
Conversor c2 = String::valueOf;

// Ambos equivalentes
String s1 = c1.converter(42); // "42"
String s2 = c2.converter(42); // "42"
```

---

## Aplicabilidade

**Lambdas**:
- **Código conciso** (menos verbosidade)
- **Streams API** (operações em coleções)
- **Event handlers** (GUI, callbacks)
- **Programação funcional**
- **Processamento paralelo**

**Benefícios**:
- Menos código boilerplate
- Mais legível
- Facilita programação funcional

---

## Armadilhas

### 1. Variável Local Não Final

```java
public void metodo() {
    int fator = 10;
    
    Operacao op = valor -> valor * fator;
    
    // ❌ ERRO: modificar variável
    // fator = 20; // ERRO: não é efetivamente final
}
```

### 2. Bloco sem Return

```java
// ❌ ERRO: bloco sem return
// Calculadora c = (a, b) -> {
//     a + b; // ERRO: falta return
// };

// ✅ Expressão: return implícito
Calculadora c1 = (a, b) -> a + b;

// ✅ Bloco: return explícito
Calculadora c2 = (a, b) -> {
    return a + b;
};
```

### 3. Parênteses em 1 Parâmetro com Tipo

```java
// ✅ OK: sem parênteses (sem tipo)
Transformador t1 = valor -> valor.toUpperCase();

// ✅ OK: com parênteses (sem tipo)
Transformador t2 = (valor) -> valor.toUpperCase();

// ✅ OK: com parênteses (com tipo)
Transformador t3 = (String valor) -> valor.toUpperCase();

// ❌ ERRO: tipo sem parênteses
// Transformador t4 = String valor -> valor.toUpperCase(); // ERRO
```

### 4. Múltiplos Parâmetros sem Parênteses

```java
// ❌ ERRO: múltiplos sem parênteses
// Comparador c = a, b -> a.compareTo(b); // ERRO

// ✅ OK: com parênteses
Comparador c = (a, b) -> a.compareTo(b);
```

### 5. Confundir this

```java
public class Exemplo {
    private String nome = "Externa";
    
    public void executar() {
        // this refere-se a Exemplo
        Processador p = () -> System.out.println(this.nome);
        
        p.processar(); // Externa
    }
}
```

### 6. Lambda vs Classe Anônima

```java
// ⚠️ Lambda: não pode ter estado próprio
Operacao op1 = valor -> valor * 2;

// Classe anônima: pode ter estado
Operacao op2 = new Operacao() {
    private int contador = 0; // Estado próprio
    
    @Override
    public int executar(int valor) {
        return valor * ++contador;
    }
};
```

### 7. Checked Exceptions em Lambda

```java
@FunctionalInterface
public interface Leitor {
    String ler(String caminho);
}

// ❌ ERRO: checked exception não tratada
// Leitor l = caminho -> {
//     return Files.readString(Path.of(caminho)); // ERRO: IOException
// };

// ✅ OK: tratar exceção
Leitor l = caminho -> {
    try {
        return Files.readString(Path.of(caminho));
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    }
};
```

---

## Boas Práticas

### 1. Expressão para Lambdas Simples

```java
// ✅ Expressão (conciso)
Calculadora soma = (a, b) -> a + b;

// ⚠️ Bloco desnecessário
Calculadora soma2 = (a, b) -> {
    return a + b;
};
```

### 2. Bloco para Lambdas Complexos

```java
// ✅ Bloco para lógica complexa
Processador p = dados -> {
    System.out.println("Validando...");
    if (dados == null || dados.isEmpty()) {
        throw new IllegalArgumentException("Dados inválidos");
    }
    System.out.println("Processando: " + dados);
    return dados.toUpperCase();
};
```

### 3. Evitar Lambdas Longos

```java
// ❌ Evitar: lambda muito longo
Processador p1 = dados -> {
    // 20 linhas de código...
    // Difícil de ler
};

// ✅ Extrair para método
Processador p2 = this::processar;

private String processar(String dados) {
    // 20 linhas de código...
    return dados;
}
```

### 4. Method Reference Quando Possível

```java
// ⚠️ Lambda
Conversor c1 = valor -> String.valueOf(valor);

// ✅ Method reference (mais conciso)
Conversor c2 = String::valueOf;

// ⚠️ Lambda
Comparador c3 = (a, b) -> a.compareTo(b);

// ✅ Method reference
Comparador c4 = String::compareTo;
```

### 5. Naming de Parâmetros

```java
// ✅ Nomes descritivos
Validador emailValidator = email -> email.contains("@");

// ✅ Nomes curtos OK para lambdas simples
List<String> lista = Arrays.asList("a", "b", "c");
lista.forEach(s -> System.out.println(s));
```

### 6. Evitar Efeitos Colaterais

```java
// ⚠️ Evitar: efeito colateral (modificar estado externo)
int[] contador = {0};
Operacao op = valor -> {
    contador[0]++; // Efeito colateral
    return valor * 2;
};

// ✅ Sem efeito colateral
Operacao op2 = valor -> valor * 2;
```

### 7. Composição de Funções

```java
@FunctionalInterface
public interface Transformador<T> {
    T transformar(T valor);
    
    // Composição
    default Transformador<T> depois(Transformador<T> outro) {
        return valor -> outro.transformar(this.transformar(valor));
    }
}

// Uso
Transformador<String> maiusculas = String::toUpperCase;
Transformador<String> exclamacao = s -> s + "!";

Transformador<String> composto = maiusculas.depois(exclamacao);
String resultado = composto.transformar("hello"); // HELLO!
```

### 8. Lambdas em Streams

```java
List<String> nomes = Arrays.asList("João", "Maria", "Ana");

// Lambdas em streams
List<String> maiusculas = nomes.stream()
    .map(nome -> nome.toUpperCase())
    .filter(nome -> nome.length() > 3)
    .collect(Collectors.toList());

// Method references
List<String> maiusculas2 = nomes.stream()
    .map(String::toUpperCase)
    .filter(nome -> nome.length() > 3)
    .collect(Collectors.toList());
```

### 9. Wrapper para Checked Exceptions

```java
@FunctionalInterface
public interface FuncaoComExcecao<T, R> {
    R aplicar(T valor) throws Exception;
    
    // Wrapper para unchecked
    static <T, R> Function<T, R> wrap(FuncaoComExcecao<T, R> funcao) {
        return valor -> {
            try {
                return funcao.aplicar(valor);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        };
    }
}

// Uso
Function<String, String> lerArquivo = FuncaoComExcecao.wrap(
    caminho -> Files.readString(Path.of(caminho))
);
```

### 10. Comentários em Lambdas Complexos

```java
// ✅ Comentar lógica complexa
Processador validador = dados -> {
    // Validação de dados obrigatórios
    if (dados == null || dados.isEmpty()) {
        throw new IllegalArgumentException("Dados vazios");
    }
    
    // Normalização: trim e uppercase
    String normalizado = dados.trim().toUpperCase();
    
    // Validação de formato
    if (!normalizado.matches("[A-Z0-9]+")) {
        throw new IllegalArgumentException("Formato inválido");
    }
    
    return normalizado;
};
```

---

## Resumo

**Lambda**: implementação concisa de interface funcional.

```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b);
}

// Lambda
Calculadora soma = (a, b) -> a + b;
int resultado = soma.calcular(5, 3); // 8
```

**Sintaxe**:
```java
// Zero parâmetros
() -> expressao

// Um parâmetro
valor -> expressao
(valor) -> expressao
(Tipo valor) -> expressao

// Múltiplos parâmetros
(a, b) -> expressao
(Tipo a, Tipo b) -> expressao

// Bloco
(a, b) -> {
    // código
    return resultado;
}
```

**Inferência de tipo**:
```java
// Tipo inferido
Conversor c = valor -> String.valueOf(valor);

// Tipo explícito
Conversor c = (int valor) -> String.valueOf(valor);
```

**Expressão vs bloco**:
```java
// Expressão: return implícito
(a, b) -> a + b

// Bloco: return explícito
(a, b) -> {
    return a + b;
}
```

**Variáveis locais**: efetivamente final.
```java
int fator = 10; // Efetivamente final
Operacao op = valor -> valor * fator;
// fator = 20; // ERRO
```

**this**: refere-se à classe externa.
```java
Processador p = () -> System.out.println(this.nome);
```

**Method reference**:
```java
// Lambda
Conversor c1 = valor -> String.valueOf(valor);

// Method reference
Conversor c2 = String::valueOf;
```

**Boas práticas**:
- Expressão para lambdas simples
- Bloco para lambdas complexos
- Evitar lambdas longos (extrair método)
- Method reference quando possível
- Naming descritivo
- Evitar efeitos colaterais
- Composição de funções
- Lambdas em streams
- Wrapper para checked exceptions
- Comentários em lambdas complexos

**Armadilhas**:
- ❌ Variável local não final
- ❌ Bloco sem return
- ❌ Parênteses em 1 parâmetro com tipo
- ❌ Múltiplos parâmetros sem parênteses
- ❌ Confundir this
- ❌ Lambda vs classe anônima (estado)
- ❌ Checked exceptions não tratadas

**Vantagens**:
- Código conciso
- Menos boilerplate
- Mais legível
- Programação funcional
- Streams API

**Regra de Ouro**: **Lambdas** são implementações **concisas** de interfaces funcionais. Use **expressão** para lógica simples (return implícito). Use **bloco** para lógica complexa (return explícito). Variáveis locais devem ser **efetivamente final**. **this** refere-se à **classe externa**. Prefira **method reference** quando possível. Evite **lambdas longos** (extraia método). **Interfaces funcionais** são a **base** para lambdas (exatamente 1 método abstrato).
