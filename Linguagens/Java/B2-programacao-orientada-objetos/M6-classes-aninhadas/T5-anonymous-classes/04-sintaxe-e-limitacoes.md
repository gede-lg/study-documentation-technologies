# T5.04 - Sintaxe e Limitações

## Introdução

**Anonymous class**: sintaxe específica e várias limitações.

```java
// Sintaxe básica
Interface var = new Interface() {
    // Implementação
};
```

**Sintaxe**: `new` + `Interface/Classe` + `()` + `{ corpo }` + `;`  
**Limitações**: sem nome, sem construtor, sem extends/implements explícito.

---

## Fundamentos

### 1. Sintaxe com Interface

**Interface**: implementar métodos abstratos.

```java
public interface Operacao {
    int executar(int a, int b);
}

// Sintaxe
Operacao soma = new Operacao() { // new Interface() {
    @Override
    public int executar(int a, int b) {
        return a + b;
    }
}; // ; no final!

System.out.println(soma.executar(10, 5)); // 15
```

### 2. Sintaxe com Classe Abstrata

**Classe abstrata**: passar argumentos para construtor.

```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) { // Construtor
        this.nome = nome;
    }
    
    public abstract void emitirSom();
}

// Sintaxe
Animal cachorro = new Animal("Rex") { // new Classe(args) {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}; // ; no final!

cachorro.emitirSom(); // Au au!
```

### 3. Sintaxe com Classe Concreta

**Classe concreta**: pode ter corpo vazio.

```java
public class Veiculo {
    protected String marca;
    
    public Veiculo(String marca) {
        this.marca = marca;
    }
    
    public void acelerar() {
        System.out.println("Acelerando...");
    }
}

// Sintaxe (sem sobrescrever nada)
Veiculo carro = new Veiculo("Toyota") { };
//                                       ^^^ Corpo vazio OK

carro.acelerar(); // Acelerando...

// Sintaxe (sobrescrever método)
Veiculo carro2 = new Veiculo("Honda") {
    @Override
    public void acelerar() {
        System.out.println("Acelerando RÁPIDO!");
    }
};

carro2.acelerar(); // Acelerando RÁPIDO!
```

### 4. Sintaxe como Argumento

**Argumento**: declarar inline.

```java
public interface Callback {
    void onComplete(String resultado);
}

public class Processador {
    public void processar(String dados, Callback callback) {
        callback.onComplete(dados.toUpperCase());
    }
}

// Sintaxe inline
Processador proc = new Processador();

proc.processar("teste", new Callback() { // Inline
    @Override
    public void onComplete(String resultado) {
        System.out.println("Resultado: " + resultado);
    }
});
// Resultado: TESTE
```

### 5. Sintaxe com Múltiplos Métodos

**Múltiplos métodos**: implementar todos.

```java
public interface Calculadora {
    int somar(int a, int b);
    int subtrair(int a, int b);
}

Calculadora calc = new Calculadora() {
    @Override
    public int somar(int a, int b) {
        return a + b;
    }
    
    @Override
    public int subtrair(int a, int b) {
        return a - b;
    }
};

System.out.println(calc.somar(10, 5));    // 15
System.out.println(calc.subtrair(10, 5)); // 5
```

### 6. Sintaxe com Genéricos

**Genéricos**: especificar tipo.

```java
public interface Comparador<T> {
    int comparar(T a, T b);
}

// Sintaxe com genéricos
Comparador<String> comp = new Comparador<String>() { // <String>
    @Override
    public int comparar(String a, String b) {
        return a.length() - b.length();
    }
};

System.out.println(comp.comparar("abc", "defgh")); // -2
```

### 7. Sintaxe Retornando de Método

**Retornar**: factory method.

```java
public interface Operacao {
    int executar(int a, int b);
}

public Operacao criarSoma() {
    return new Operacao() { // return new Interface() {
        @Override
        public int executar(int a, int b) {
            return a + b;
        }
    }; // ; no final do return
}

Operacao soma = criarSoma();
System.out.println(soma.executar(10, 5)); // 15
```

### 8. Limitação: Não Pode Ter Construtor

**Construtor**: anonymous class NÃO pode ter construtor próprio.

```java
public interface Teste {
    void executar();
}

Teste t = new Teste() {
    // ❌ ERRO: anonymous class não pode ter construtor
    // public Teste() { }
    
    // ✅ Usar bloco de inicialização
    {
        System.out.println("Inicializando");
    }
    
    @Override
    public void executar() {
        System.out.println("Executando");
    }
};
```

### 9. Limitação: Não Pode Implementar Múltiplas Interfaces

**Múltiplas interfaces**: anonymous class implementa apenas UMA.

```java
public interface A {
    void metodoA();
}

public interface B {
    void metodoB();
}

// ❌ ERRO: não pode implementar múltiplas interfaces
// var = new A(), B() { ... }; // SINTAXE INVÁLIDA

// ✅ Se precisa, use classe nomeada
class MinhaClasse implements A, B {
    public void metodoA() { }
    public void metodoB() { }
}

MinhaClasse obj = new MinhaClasse();
```

### 10. Limitação: Não Pode Ter Nome

**Nome**: anonymous class não tem nome (classe anônima).

```java
public interface Teste {
    void executar();
}

Teste t = new Teste() {
    @Override
    public void executar() {
        System.out.println("Classe: " + this.getClass().getName());
    }
};

t.executar();
// Classe: MinhaClasse$1
//                    ^^^ Número sequencial gerado pelo compilador
```

---

## Aplicabilidade

**Usar anonymous class quando**:
- Implementação única
- Callback, listener
- Pequena customização

**NÃO usar quando**:
- Precisa construtor
- Precisa múltiplas interfaces
- Precisa reutilizar classe
- Classe muito complexa

---

## Armadilhas

### 1. Esquecer Ponto-e-Vírgula Final

```java
// ❌ ERRO: falta ; no final
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
} // ❌ Falta ;

// ✅ ; no final
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
}; // ✅ ; aqui
```

### 2. Esquecer Parênteses Após Interface/Classe

```java
// ❌ ERRO: falta ()
Runnable r = new Runnable { // ❌ Falta ()
    // ...
};

// ✅ () após nome
Runnable r = new Runnable() { // ✅ () aqui
    @Override
    public void run() {
        System.out.println("Running");
    }
};
```

### 3. Tentar Criar Construtor

```java
public interface Teste {
    void executar();
}

// ❌ ERRO: anonymous class não pode ter construtor
Teste t = new Teste() {
    // ❌ ERRO: não compila
    // public Teste() { }
    
    @Override
    public void executar() { }
};

// ✅ Usar bloco de inicialização
Teste t2 = new Teste() {
    {
        System.out.println("Inicializando");
    }
    
    @Override
    public void executar() { }
};
```

### 4. Tentar Implementar Múltiplas Interfaces

```java
public interface A {
    void metodoA();
}

public interface B {
    void metodoB();
}

// ❌ ERRO: sintaxe inválida
// var = new A(), B() { ... };

// ✅ Usar classe nomeada
class AB implements A, B {
    public void metodoA() { }
    public void metodoB() { }
}
```

### 5. Confundir com Instanciação Normal

```java
public class Pessoa {
    private String nome;
    
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

// Instanciação normal
Pessoa p1 = new Pessoa("João");

// Anonymous class (com corpo vazio)
Pessoa p2 = new Pessoa("Maria") { };
//                                ^^^ Corpo vazio = anonymous class

// Anonymous class (sobrescrever método)
Pessoa p3 = new Pessoa("Ana") {
    @Override
    public String toString() {
        return "Pessoa: " + nome; // ❌ ERRO: nome é private
    }
};
```

---

## Boas Práticas

### 1. Sempre Usar ; no Final

```java
// ✅ ; no final sempre
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
}; // ✅
```

### 2. Sempre Usar () Após Interface/Classe

```java
// ✅ () sempre
Interface var = new Interface() { // ✅
    // ...
};

Classe var2 = new Classe(args) { // ✅
    // ...
};
```

### 3. Usar Bloco de Inicialização em Vez de Construtor

```java
// ✅ Bloco de inicialização
Teste t = new Teste() {
    private int valor;
    
    { // Bloco de inicialização
        valor = 42;
    }
    
    @Override
    public void executar() {
        System.out.println(valor);
    }
};
```

### 4. Preferir Lambda para Interface Funcional

```java
// ❌ Anonymous class verbosa
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
};

// ✅ Lambda concisa (Java 8+)
Runnable r2 = () -> System.out.println("Running");
```

### 5. Limitar Tamanho (< 20 Linhas)

```java
// ❌ Muito grande
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        // 50 linhas de código...
        // Difícil de ler
    }
});

// ✅ Extrair para método
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        processarClick();
    }
});

private void processarClick() {
    // Código complexo aqui
}
```

---

## Resumo

**Sintaxe**:
```java
// Interface
Interface var = new Interface() {
    @Override
    public void metodo() { }
}; // ; no final!

// Classe
Classe var = new Classe(args) {
    @Override
    public void metodo() { }
}; // ; no final!
```

**Elementos da sintaxe**:
1. `new` - palavra-chave
2. `Interface/Classe` - tipo a implementar/estender
3. `()` - parênteses (com ou sem argumentos)
4. `{ corpo }` - corpo da classe
5. `;` - ponto-e-vírgula final

**Limitações**:
- ❌ Não pode ter nome (anônima)
- ❌ Não pode ter construtor próprio
- ❌ Não pode implementar múltiplas interfaces
- ❌ Não pode estender múltiplas classes
- ❌ Não pode ser reutilizada (instanciada novamente)

**Casos especiais**:
- Corpo vazio OK: `new Classe() { }`
- Múltiplos métodos OK
- Genéricos OK: `new Interface<String>() { }`
- Inline como argumento OK
- Retornar de método OK
- Bloco de inicialização OK (em vez de construtor)

**Armadilhas**:
- Esquecer `;` no final
- Esquecer `()` após nome
- Tentar criar construtor
- Tentar implementar múltiplas interfaces
- Confundir com instanciação normal

**Boas práticas**:
- Sempre `;` no final
- Sempre `()` após nome
- Bloco de inicialização em vez de construtor
- Preferir lambda para interface funcional (Java 8+)
- Limitar tamanho (< 20 linhas)

**Regra de Ouro**: Anonymous class = `new Tipo() { corpo };` - sempre com **`()`** após tipo, **`{ corpo }`**, e **`;`** no final. **Não pode** ter construtor, nome, ou múltiplas interfaces. Use **bloco de inicialização** `{ ... }` para inicialização. Para interface funcional simples, prefira **lambda** (Java 8+).
