# T5.02 - Implementação de Interface ou Extensão de Classe

## Introdução

**Anonymous class**: pode **implementar interface** ou **estender classe**.

```java
// Implementar interface
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Interface");
    }
};

// Estender classe
Thread t = new Thread() {
    @Override
    public void run() {
        System.out.println("Classe");
    }
};
```

**Limitação**: apenas UMA interface OU UMA classe.

---

## Fundamentos

### 1. Implementar Interface

**Interface**: anonymous class implementa todos os métodos abstratos.

```java
public interface Operacao {
    int executar(int a, int b);
}

// Implementar interface
Operacao soma = new Operacao() {
    @Override
    public int executar(int a, int b) {
        return a + b;
    }
};

System.out.println(soma.executar(10, 5)); // 15
```

### 2. Implementar Interface com Múltiplos Métodos

**Múltiplos métodos**: implementar todos.

```java
public interface Calculadora {
    int somar(int a, int b);
    int subtrair(int a, int b);
    int multiplicar(int a, int b);
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
    
    @Override
    public int multiplicar(int a, int b) {
        return a * b;
    }
};

System.out.println(calc.somar(10, 5));       // 15
System.out.println(calc.subtrair(10, 5));    // 5
System.out.println(calc.multiplicar(10, 5)); // 50
```

### 3. Estender Classe Abstrata

**Classe abstrata**: implementar métodos abstratos.

```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public abstract void emitirSom();
    
    public void apresentar() {
        System.out.println("Animal: " + nome);
    }
}

Animal cachorro = new Animal("Rex") {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
};

cachorro.apresentar(); // Animal: Rex
cachorro.emitirSom();  // Au au!
```

### 4. Estender Classe Concreta

**Classe concreta**: sobrescrever métodos.

```java
public class Veiculo {
    protected String marca;
    
    public Veiculo(String marca) {
        this.marca = marca;
    }
    
    public void acelerar() {
        System.out.println("Acelerando...");
    }
    
    public void frear() {
        System.out.println("Freando...");
    }
}

Veiculo carro = new Veiculo("Toyota") {
    @Override
    public void acelerar() {
        System.out.println(marca + " acelerando RÁPIDO!");
    }
    
    @Override
    public void frear() {
        System.out.println(marca + " freando com ABS!");
    }
};

carro.acelerar(); // Toyota acelerando RÁPIDO!
carro.frear();    // Toyota freando com ABS!
```

### 5. Chamar Construtor da Superclasse

**Construtor**: passar argumentos para superclasse.

```java
public class Pessoa {
    protected String nome;
    protected int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    public void apresentar() {
        System.out.println(nome + ", " + idade + " anos");
    }
}

Pessoa pessoa = new Pessoa("João", 30) {
    @Override
    public void apresentar() {
        System.out.println("Olá! Sou " + nome + " e tenho " + idade + " anos.");
    }
};

pessoa.apresentar();
// Olá! Sou João e tenho 30 anos.
```

### 6. Acessar Membros da Superclasse

**super**: acessar métodos da superclasse.

```java
public class Logger {
    protected void log(String mensagem) {
        System.out.println("[LOG] " + mensagem);
    }
}

Logger customLogger = new Logger() {
    @Override
    protected void log(String mensagem) {
        super.log("CUSTOM: " + mensagem); // Chama método da superclasse
    }
};

customLogger.log("Teste");
// [LOG] CUSTOM: Teste
```

### 7. Adicionar Campos Próprios

**Campos**: anonymous class pode ter campos.

```java
public interface Contador {
    void incrementar();
    int obter();
}

Contador contador = new Contador() {
    private int valor = 0; // Campo próprio
    
    @Override
    public void incrementar() {
        valor++;
    }
    
    @Override
    public int obter() {
        return valor;
    }
};

contador.incrementar();
contador.incrementar();
System.out.println(contador.obter()); // 2
```

### 8. Adicionar Métodos Helper

**Helper**: métodos privados auxiliares.

```java
public interface Validador {
    boolean validar(String texto);
}

Validador validador = new Validador() {
    @Override
    public boolean validar(String texto) {
        return ehEmail(texto) && temDominio(texto);
    }
    
    private boolean ehEmail(String texto) {
        return texto != null && texto.contains("@");
    }
    
    private boolean temDominio(String texto) {
        return texto != null && texto.contains(".");
    }
};

System.out.println(validador.validar("teste@email.com")); // true
System.out.println(validador.validar("invalido"));        // false
```

### 9. Implementar Interface Genérica

**Genéricos**: especificar tipo na implementação.

```java
public interface Comparador<T> {
    int comparar(T a, T b);
}

Comparador<String> compStr = new Comparador<String>() {
    @Override
    public int comparar(String a, String b) {
        return a.length() - b.length();
    }
};

System.out.println(compStr.comparar("abc", "defgh")); // -2 (3 - 5)

Comparador<Integer> compInt = new Comparador<Integer>() {
    @Override
    public int comparar(Integer a, Integer b) {
        return a - b;
    }
};

System.out.println(compInt.comparar(10, 5)); // 5
```

### 10. Estender Classe com Interface

**Classe + Interface**: estender classe que implementa interface.

```java
public interface Executavel {
    void executar();
}

public abstract class Tarefa implements Executavel {
    protected String nome;
    
    public Tarefa(String nome) {
        this.nome = nome;
    }
    
    public abstract void executar();
}

Tarefa tarefa = new Tarefa("Minha Tarefa") {
    @Override
    public void executar() {
        System.out.println("Executando: " + nome);
    }
};

tarefa.executar(); // Executando: Minha Tarefa
```

---

## Aplicabilidade

**Implementar interface quando**:
- Precisa implementar comportamento específico
- Callbacks, listeners, handlers
- Comparator, Runnable, Callable

**Estender classe quando**:
- Precisa customizar comportamento de classe existente
- Template method pattern
- Hook methods

---

## Armadilhas

### 1. Não Pode Implementar Múltiplas Interfaces

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
```

### 2. Não Pode Estender Múltiplas Classes

```java
// ❌ Java não permite herança múltipla
// class C extends A, B { } // ERRO

// Anonymous class também não pode
```

### 3. Esquecer @Override

```java
public interface Teste {
    void executar();
}

Teste t = new Teste() {
    // ❌ Sem @Override: erro pode passar despercebido
    public void executa() { // Nome errado!
        System.out.println("Teste");
    }
};

// ✅ Com @Override: erro de compilação
Teste t2 = new Teste() {
    @Override
    public void executar() { // Nome correto
        System.out.println("Teste");
    }
};
```

### 4. Confundir Interface com Classe

```java
// Interface (SEM implementação)
public interface Runnable {
    void run();
}

// Classe abstrata (PODE ter implementação)
public abstract class Thread {
    public abstract void run();
    public void start() { /* implementação */ }
}

// Anonymous class pode implementar/estender ambos
```

### 5. Tentar Acessar Membros Privados

```java
public class Base {
    private int segredo = 42; // private!
    
    protected int publico = 10;
}

Base b = new Base() {
    public void testar() {
        // ❌ ERRO: não acessa private
        // System.out.println(segredo);
        
        // ✅ OK: acessa protected
        System.out.println(publico);
    }
};
```

---

## Boas Práticas

### 1. Preferir Interface para Contrato

```java
// ✅ Interface define contrato
public interface Processador {
    void processar();
}

Processador proc = new Processador() {
    @Override
    public void processar() {
        System.out.println("Processando...");
    }
};
```

### 2. Estender Classe para Reutilizar Código

```java
// ✅ Estender classe para reusar implementação
public abstract class Tarefa {
    protected void log(String msg) {
        System.out.println("[LOG] " + msg);
    }
    
    public abstract void executar();
}

Tarefa tarefa = new Tarefa() {
    @Override
    public void executar() {
        log("Iniciando");
        // ...
        log("Concluído");
    }
};
```

### 3. Usar @Override Sempre

```java
// ✅ @Override detecta erros
Runnable r = new Runnable() {
    @Override // Detecta se assinatura está correta
    public void run() {
        System.out.println("Running");
    }
};
```

### 4. Comparator com Anonymous Class

```java
// ✅ Comparator customizado
import java.util.*;

List<String> nomes = Arrays.asList("João", "Maria", "Ana");

Collections.sort(nomes, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
});

System.out.println(nomes); // [Ana, João, Maria]
```

### 5. Template Method com Anonymous Class

```java
// ✅ Template method pattern
public abstract class Processador {
    public final void processar() {
        validar();
        executar();
        finalizar();
    }
    
    protected abstract void validar();
    protected abstract void executar();
    protected abstract void finalizar();
}

Processador proc = new Processador() {
    protected void validar() {
        System.out.println("Validando...");
    }
    
    protected void executar() {
        System.out.println("Executando...");
    }
    
    protected void finalizar() {
        System.out.println("Finalizando...");
    }
};

proc.processar();
```

---

## Resumo

**Anonymous class**: implementa **UMA interface** OU estende **UMA classe**.

```java
// Implementar interface
Interface var = new Interface() {
    @Override
    public void metodo() { }
};

// Estender classe
Classe var = new Classe() {
    @Override
    public void metodo() { }
};
```

**Implementar interface**:
- Implementar todos os métodos abstratos
- Pode ter múltiplos métodos
- Ideal para callbacks, comparators

**Estender classe**:
- Sobrescrever métodos
- Chamar super() para construtor
- Acessar membros protected
- Reutilizar implementação

**Limitações**:
- ❌ Apenas UMA interface OU classe
- ❌ Não pode implementar múltiplas interfaces
- ❌ Não pode estender múltiplas classes
- ❌ Não acessa membros private da superclasse

**Boas práticas**:
- Preferir interface para contrato
- Estender classe para reusar código
- Usar @Override sempre
- Comparator customizado
- Template method pattern

**Regra de Ouro**: Anonymous class implementa **UMA interface** ou estende **UMA classe**, nunca ambos simultaneamente. Use **interface** para definir contrato sem implementação. Use **classe abstrata/concreta** para reutilizar código existente. Sempre use **@Override** para detectar erros. Para **interface funcional** (1 método), considere **lambda** (Java 8+).
