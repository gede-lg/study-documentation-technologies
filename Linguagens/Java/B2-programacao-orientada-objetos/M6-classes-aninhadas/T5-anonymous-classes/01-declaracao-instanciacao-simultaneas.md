# T5.01 - Declaração e Instanciação Simultâneas

## Introdução

**Anonymous class**: declaração e instanciação **simultâneas**, sem nome.

```java
public interface Saudacao {
    void saudar();
}

public class Exemplo {
    public static void main(String[] args) {
        // Anonymous class: declaração + instanciação simultâneas
        Saudacao saudacao = new Saudacao() {
            @Override
            public void saudar() {
                System.out.println("Olá!");
            }
        };
        
        saudacao.saudar(); // Olá!
    }
}
```

**Característica**: não tem nome, criada inline.

---

## Fundamentos

### 1. Sintaxe Básica com Interface

**Sintaxe**: `new Interface() { implementação }`.

```java
public interface Operacao {
    int executar(int a, int b);
}

public class Calculadora {
    public static void main(String[] args) {
        // Anonymous class implementa Operacao
        Operacao soma = new Operacao() {
            @Override
            public int executar(int a, int b) {
                return a + b;
            }
        };
        
        int resultado = soma.executar(10, 5);
        System.out.println("Resultado: " + resultado); // Resultado: 15
    }
}
```

### 2. Sintaxe com Classe Abstrata

**Sintaxe**: `new ClasseAbstrata() { implementação }`.

```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public abstract void emitirSom();
}

public class Exemplo {
    public static void main(String[] args) {
        // Anonymous class estende Animal
        Animal cachorro = new Animal("Rex") {
            @Override
            public void emitirSom() {
                System.out.println(nome + " faz: Au au!");
            }
        };
        
        cachorro.emitirSom(); // Rex faz: Au au!
    }
}
```

### 3. Sintaxe com Classe Concreta

**Sintaxe**: `new ClasseConcreta() { sobrescrita }`.

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

public class Exemplo {
    public static void main(String[] args) {
        // Anonymous class estende Veiculo
        Veiculo carro = new Veiculo("Toyota") {
            @Override
            public void acelerar() {
                System.out.println(marca + " acelerando rápido!");
            }
        };
        
        carro.acelerar(); // Toyota acelerando rápido!
    }
}
```

### 4. Declaração Inline em Parâmetro

**Inline**: passar anonymous class como argumento.

```java
public interface Callback {
    void executar();
}

public class Processador {
    public void processar(Callback callback) {
        System.out.println("Processando...");
        callback.executar();
    }
}

public class Exemplo {
    public static void main(String[] args) {
        Processador proc = new Processador();
        
        // Anonymous class inline como parâmetro
        proc.processar(new Callback() {
            @Override
            public void executar() {
                System.out.println("Callback executado!");
            }
        });
    }
}

// Saída:
// Processando...
// Callback executado!
```

### 5. Com Múltiplos Métodos

**Múltiplos métodos**: anonymous class pode implementar vários métodos.

```java
public interface Processador {
    void iniciar();
    void processar();
    void finalizar();
}

public class Exemplo {
    public static void main(String[] args) {
        // Anonymous class com múltiplos métodos
        Processador proc = new Processador() {
            @Override
            public void iniciar() {
                System.out.println("Iniciando...");
            }
            
            @Override
            public void processar() {
                System.out.println("Processando...");
            }
            
            @Override
            public void finalizar() {
                System.out.println("Finalizando...");
            }
        };
        
        proc.iniciar();
        proc.processar();
        proc.finalizar();
    }
}
```

### 6. Com Construtor da Classe Base

**Construtor**: chamar construtor da classe base.

```java
public class Pessoa {
    protected String nome;
    protected int idade;
    
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    public void apresentar() {
        System.out.println("Nome: " + nome + ", Idade: " + idade);
    }
}

public class Exemplo {
    public static void main(String[] args) {
        // Anonymous class chama construtor de Pessoa
        Pessoa pessoa = new Pessoa("João", 30) {
            @Override
            public void apresentar() {
                System.out.println("Olá! Meu nome é " + nome + " e tenho " + idade + " anos.");
            }
        };
        
        pessoa.apresentar();
        // Olá! Meu nome é João e tenho 30 anos.
    }
}
```

### 7. Acesso a Variáveis Locais

**Variáveis locais**: devem ser efetivamente final.

```java
public interface Calculadora {
    int calcular();
}

public class Exemplo {
    public static void main(String[] args) {
        final int numero = 10; // final explícito
        int multiplicador = 5;  // efetivamente final
        
        // Anonymous class acessa variáveis locais
        Calculadora calc = new Calculadora() {
            @Override
            public int calcular() {
                return numero * multiplicador;
            }
        };
        
        System.out.println("Resultado: " + calc.calcular()); // Resultado: 50
    }
}
```

### 8. Com Campos Próprios

**Campos**: anonymous class pode ter campos próprios.

```java
public interface Contador {
    void incrementar();
    int obterValor();
}

public class Exemplo {
    public static void main(String[] args) {
        // Anonymous class com campo próprio
        Contador contador = new Contador() {
            private int valor = 0; // Campo próprio
            
            @Override
            public void incrementar() {
                valor++;
            }
            
            @Override
            public int obterValor() {
                return valor;
            }
        };
        
        contador.incrementar();
        contador.incrementar();
        contador.incrementar();
        
        System.out.println("Contador: " + contador.obterValor()); // Contador: 3
    }
}
```

### 9. Com Métodos Helper Privados

**Métodos helper**: anonymous class pode ter métodos privados.

```java
public interface Validador {
    boolean validar(String texto);
}

public class Exemplo {
    public static void main(String[] args) {
        // Anonymous class com método helper privado
        Validador validador = new Validador() {
            @Override
            public boolean validar(String texto) {
                return temTamanhoMinimo(texto) && contemArroba(texto);
            }
            
            // Método helper privado
            private boolean temTamanhoMinimo(String texto) {
                return texto != null && texto.length() >= 5;
            }
            
            private boolean contemArroba(String texto) {
                return texto != null && texto.contains("@");
            }
        };
        
        System.out.println(validador.validar("a@b.c"));     // false (< 5 chars)
        System.out.println(validador.validar("abc@def.gh")); // true
    }
}
```

### 10. Retornar de Método

**Retorno**: retornar anonymous class de método.

```java
public interface Comparador {
    int comparar(int a, int b);
}

public class ComparadorFactory {
    public static Comparador criarCrescente() {
        // Retornar anonymous class
        return new Comparador() {
            @Override
            public int comparar(int a, int b) {
                return Integer.compare(a, b);
            }
        };
    }
    
    public static Comparador criarDecrescente() {
        return new Comparador() {
            @Override
            public int comparar(int a, int b) {
                return Integer.compare(b, a);
            }
        };
    }
}

public class Exemplo {
    public static void main(String[] args) {
        Comparador cres = ComparadorFactory.criarCrescente();
        System.out.println(cres.comparar(10, 5)); // 1
        
        Comparador decr = ComparadorFactory.criarDecrescente();
        System.out.println(decr.comparar(10, 5)); // -1
    }
}
```

---

## Aplicabilidade

**Anonymous classes são úteis para**:
- Implementação única de interface
- Callbacks e event handlers
- Sobrescrever métodos pontualmente
- Adapters e wrappers
- Listeners (Swing, JavaFX)
- Threads (Runnable, Callable)

---

## Armadilhas

### 1. Não Tem Nome

```java
// ❌ Anonymous class não tem nome
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Executando");
    }
};

// Não pode criar outra instância com 'new NomeClass()'
// Nome interno: Exemplo$1, Exemplo$2, etc.
```

### 2. Não Pode Ter Construtor

```java
public interface Teste {
    void executar();
}

// ❌ ERRO: anonymous class não pode ter construtor
Teste t = new Teste() {
    // public NomeClass() { } // ERRO: não tem nome
    
    @Override
    public void executar() { }
};
```

### 3. Não Pode Ser Reutilizada

```java
// ❌ Não pode reutilizar anonymous class
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Run 1");
    }
};

// Precisa criar outra anonymous class
Runnable r2 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Run 2");
    }
};

// ✅ Se precisa reutilizar, use classe nomeada
class MinhaRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Reutilizável");
    }
}

Runnable r3 = new MinhaRunnable();
Runnable r4 = new MinhaRunnable();
```

### 4. Confusão com Sintaxe

```java
// ❌ ERRO: esquecer '()' após o tipo
// Runnable r = new Runnable { ... }; // ERRO

// ✅ Correto: 'new Tipo() { ... }'
Runnable r = new Runnable() {
    @Override
    public void run() { }
};
```

### 5. Variável Local Não-Final

```java
public interface Teste {
    void executar();
}

public void metodo() {
    int numero = 10;
    
    Teste t = new Teste() {
        @Override
        public void executar() {
            System.out.println(numero); // Captura 'numero'
        }
    };
    
    // ❌ ERRO: modificar 'numero' após captura
    // numero = 20;
}
```

---

## Boas Práticas

### 1. Preferir Lambda para Interface Funcional

```java
// ❌ Anonymous class verbosa
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Executando");
    }
};

// ✅ Lambda mais concisa (Java 8+)
Runnable r2 = () -> System.out.println("Executando");
```

### 2. Usar para Callback Único

```java
// ✅ Anonymous class para callback usado apenas uma vez
public interface ClickListener {
    void onClick();
}

public class Botao {
    public void setOnClickListener(ClickListener listener) {
        // ...
        listener.onClick();
    }
}

// Uso
Botao botao = new Botao();
botao.setOnClickListener(new ClickListener() {
    @Override
    public void onClick() {
        System.out.println("Botão clicado!");
    }
});
```

### 3. Limitar Complexidade

```java
// ❌ Evitar anonymous class muito complexa
Comparator<Pessoa> comp = new Comparator<Pessoa>() {
    @Override
    public int compare(Pessoa p1, Pessoa p2) {
        // 50 linhas de lógica complexa
        // ...
    }
};

// ✅ Preferir classe nomeada
class ComparadorPessoa implements Comparator<Pessoa> {
    @Override
    public int compare(Pessoa p1, Pessoa p2) {
        // Lógica complexa
        return 0;
    }
}
```

### 4. Usar final Explícito

```java
// ✅ final explícito para clareza
public void processar(String mensagem) {
    final String prefixo = "LOG: ";
    
    Runnable r = new Runnable() {
        @Override
        public void run() {
            System.out.println(prefixo + mensagem);
        }
    };
    
    r.run();
}
```

### 5. Factory Method

```java
// ✅ Factory method retorna anonymous class
public interface Filtro {
    boolean aceitar(int numero);
}

public class FiltroFactory {
    public static Filtro criarMaiorQue(int limite) {
        return new Filtro() {
            @Override
            public boolean aceitar(int numero) {
                return numero > limite;
            }
        };
    }
}

// Uso
Filtro filtro = FiltroFactory.criarMaiorQue(10);
System.out.println(filtro.aceitar(15)); // true
System.out.println(filtro.aceitar(5));  // false
```

### 6. Adapter Pattern

```java
// ✅ Adapter usando anonymous class
import java.util.*;

public class Exemplo {
    public static void main(String[] args) {
        List<String> lista = Arrays.asList("João", "Maria", "Pedro");
        
        // Anonymous class adapta Comparator
        Collections.sort(lista, new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                return a.length() - b.length();
            }
        });
        
        System.out.println(lista); // [João, Maria, Pedro]
    }
}
```

### 7. Thread com Runnable

```java
// ✅ Anonymous class para thread
public class Exemplo {
    public static void main(String[] args) {
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("Thread executando: " + Thread.currentThread().getName());
            }
        });
        
        thread.start();
    }
}
```

### 8. Event Listener

```java
// ✅ Anonymous class para event listener
public interface EventListener {
    void onEvent(String evento);
}

public class EventManager {
    private List<EventListener> listeners = new ArrayList<>();
    
    public void addListener(EventListener listener) {
        listeners.add(listener);
    }
    
    public void dispararEvento(String evento) {
        for (EventListener listener : listeners) {
            listener.onEvent(evento);
        }
    }
}

// Uso
EventManager manager = new EventManager();

manager.addListener(new EventListener() {
    @Override
    public void onEvent(String evento) {
        System.out.println("Evento recebido: " + evento);
    }
});

manager.dispararEvento("LOGIN");
```

### 9. Template Method

```java
// ✅ Template method com anonymous class
public abstract class Processador {
    public abstract void processar();
}

public class Exemplo {
    public static void main(String[] args) {
        Processador proc = new Processador() {
            @Override
            public void processar() {
                System.out.println("Processamento customizado");
            }
        };
        
        proc.processar();
    }
}
```

### 10. Documentar Propósito

```java
// ✅ Comentar propósito da anonymous class
public void configurar() {
    // Anonymous class para tratar cliques no botão
    // Incrementa contador local a cada clique
    botao.setOnClickListener(new ClickListener() {
        @Override
        public void onClick() {
            contador++;
            atualizarInterface();
        }
    });
}
```

---

## Resumo

**Anonymous class**: declaração + instanciação **simultâneas**, sem nome.

```java
// Sintaxe com interface
Interface var = new Interface() {
    @Override
    public void metodo() {
        // implementação
    }
};

// Sintaxe com classe
Classe var = new Classe() {
    @Override
    public void metodo() {
        // sobrescrita
    }
};
```

**Características**:
- Não tem nome (nome interno: Classe$1, Classe$2)
- Declaração e instanciação simultâneas
- Pode implementar interface ou estender classe
- Pode ter campos e métodos próprios
- Pode ter métodos helper privados
- Acessa variáveis locais (efetivamente final)

**Sintaxe**:
- Interface: `new Interface() { ... }`
- Classe abstrata: `new ClasseAbstrata() { ... }`
- Classe concreta: `new Classe() { ... }`

**Limitações**:
- ❌ Não pode ter construtor
- ❌ Não pode ser reutilizada
- ❌ Não pode ter nome
- ❌ Não pode implementar múltiplas interfaces
- ❌ Variáveis locais devem ser efetivamente final

**Aplicabilidade**:
- Implementação única
- Callbacks/listeners
- Event handlers
- Adapters
- Threads (Runnable)
- Comparators

**Boas práticas**:
- Preferir lambda para interface funcional (Java 8+)
- Usar para callback único
- Limitar complexidade (< 20 linhas)
- final explícito para variáveis
- Factory method
- Adapter pattern
- Thread com Runnable
- Event listener
- Template method
- Documentar propósito

**Regra de Ouro**: **Anonymous classes** são criadas **inline** sem nome, combinando declaração e instanciação. Use quando precisa **implementação única** de interface/classe. Para **interface funcional simples** (1 método abstrato), prefira **lambda** (Java 8+). Para **lógica complexa** ou **reutilização**, use **classe nomeada**. Anonymous classes são ideais para **callbacks**, **listeners** e **adapters** usados apenas uma vez.
