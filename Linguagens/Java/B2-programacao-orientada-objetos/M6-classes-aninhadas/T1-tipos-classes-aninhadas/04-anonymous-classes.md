# 👻 Anonymous Classes (Classes Anônimas)

## 🎯 Introdução e Definição

**Anonymous classes** (classes anônimas) são **local classes sem nome** que são **declaradas e instanciadas simultaneamente** em uma única expressão, criando objetos que implementam uma interface ou estendem uma classe sem necessidade de definir explicitamente uma classe nomeada. Representam a forma mais concisa de criar implementações descartáveis de interfaces ou subclasses de classes abstratas/concretas, combinando **declaração da classe + instanciação do objeto** em uma única construção sintática, geralmente utilizadas para **callbacks**, **event listeners**, **implementações únicas de interfaces** e outros casos onde nomear a classe seria verbosidade desnecessária.

Conceitualmente, anonymous classes são **expressões que produzem objetos**, não declarações de tipos. A classe é criada "on-the-fly" (em tempo real) no ponto de uso, sem introduzir novo tipo nomeado no namespace. Como são tecnicamente local classes, possuem as mesmas características: **referência implícita à outer class**, **captura de variáveis effectively final** e **escopo limitado**. São fundamentais para programação orientada a eventos (event-driven programming) e foram, antes de lambdas (Java 8+), a forma padrão de passar comportamento como parâmetro em Java.

### Contexto Histórico e Motivação

**Java 1.1 (1997): Revolução para GUI Programming**

Anonymous classes foram adicionadas especificamente para tornar programação GUI (AWT/Swing) menos verbosa.

**Problema Antes de Anonymous Classes:**

```java
// Java 1.0 - Event handling extremamente verboso
class MeuActionListener implements ActionListener {
    private JButton botao;

    MeuActionListener(JButton botao) {
        this.botao = botao;
    }

    public void actionPerformed(ActionEvent e) {
        JOptionPane.showMessageDialog(null, "Botão clicado!");
    }
}

public class Janela extends JFrame {
    public Janela() {
        JButton botao = new JButton("Clique");
        botao.addActionListener(new MeuActionListener(botao));  // Classe separada obrigatória
    }
}
```

**Solução com Anonymous Class:**

```java
// Java 1.1+ - Muito mais conciso
public class Janela extends JFrame {
    public Janela() {
        JButton botao = new JButton("Clique");

        botao.addActionListener(new ActionListener() {  // Anonymous class
            public void actionPerformed(ActionEvent e) {
                JOptionPane.showMessageDialog(null, "Botão clicado!");
            }
        });
    }
}
```

**Evolução com Lambdas (Java 8, 2014):**

Interfaces funcionais (uma método abstrato) podem usar lambdas:

```java
// Java 8+ - Lambda substitui anonymous class para interfaces funcionais
botao.addActionListener(e ->
    JOptionPane.showMessageDialog(null, "Botão clicado!")
);
```

**Quando Anonymous Classes Ainda São Necessárias (pós-Java 8):**
- Implementar interface com múltiplos métodos
- Estender classe abstrata ou concreta
- Adicionar estado (campos) à implementação
- Implementar múltiplas interfaces simultaneamente

### Problema que Resolve

**1. Verbosidade de Classes Nomeadas Descartáveis**

```java
// Sem anonymous class - classe separada para uso único
class ComparadorNome implements Comparator<Pessoa> {
    public int compare(Pessoa p1, Pessoa p2) {
        return p1.getNome().compareTo(p2.getNome());
    }
}

List<Pessoa> pessoas = ...;
Collections.sort(pessoas, new ComparadorNome());

// Com anonymous class - inline
Collections.sort(pessoas, new Comparator<Pessoa>() {
    public int compare(Pessoa p1, Pessoa p2) {
        return p1.getNome().compareTo(p2.getNome());
    }
});
```

**2. Poluição de Namespace**

Anonymous classes não introduzem nomes no namespace — não há "classe ComparadorNome" visível.

**3. Callbacks com Contexto**

Captura variáveis locais para uso em callbacks:

```java
public void buscarDadosAsync(String parametro) {
    final String contexto = "Busca: " + parametro;

    servicoRemoto.executar(new Callback() {
        public void onSuccess(Resultado r) {
            System.out.println(contexto + " - Sucesso: " + r);
        }

        public void onError(Erro e) {
            System.out.println(contexto + " - Erro: " + e);
        }
    });
}
```

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Declaração + Instanciação Simultânea**: `new TipoBase() { corpo }`
2. **Sem Nome**: Classe não tem identificador, apenas a instância
3. **Herança Implícita**: Estende classe ou implementa interface especificada
4. **Uso Único**: Geralmente instanciada apenas uma vez no ponto de declaração
5. **Closure Behavior**: Captura variáveis effectively final do escopo envolvente

### Pilares Fundamentais

- **Sintaxe Base**: `new Tipo() { ... }`  ou  `new Tipo(args) { ... }`
- **Implementa OU Estende**: Pode implementar UMA interface OU estender UMA classe
- **Não Pode Ter Construtor**: Sem construtor explícito (sem nome para ele)
- **Pode Ter Inicializadores**: Blocos de inicialização de instância
- **Acesso a Outer + Locais**: Como local class, acessa outer members e variáveis effectively final

## 🧠 Fundamentos Teóricos

### Sintaxe: Implementando Interface

```java
Runnable r = new Runnable() {  // Implementa Runnable
    @Override
    public void run() {
        System.out.println("Executando");
    }
};

r.run();
```

### Sintaxe: Estendendo Classe

```java
Thread t = new Thread() {  // Estende Thread
    @Override
    public void run() {
        System.out.println("Thread rodando");
    }
};

t.start();
```

### Sintaxe: Com Argumentos no Construtor

```java
abstract class Animal {
    private String nome;

    Animal(String nome) {
        this.nome = nome;
    }

    abstract void emitirSom();

    String getNome() { return nome; }
}

Animal cachorro = new Animal("Rex") {  // Passa "Rex" para construtor de Animal
    @Override
    void emitirSom() {
        System.out.println(getNome() + " faz: Au au!");
    }
};

cachorro.emitirSom();  // Rex faz: Au au!
```

### Anatomia Completa

```java
public class Exemplo {
    private String atributoOuter = "Outer";

    public void metodo(String parametro) {
        String variavel Local = "Local";

        // ========== ANONYMOUS CLASS ==========

        Runnable r = new Runnable() {
            // Campos da anonymous class
            private int contador = 0;

            // Bloco de inicialização
            {
                System.out.println("Inicializando anonymous class");
            }

            // Implementação de método da interface
            @Override
            public void run() {
                contador++;

                // Acessa outer
                System.out.println(atributoOuter);

                // Acessa parâmetro
                System.out.println(parametro);

                // Acessa variável local
                System.out.println(variavelLocal);

                // Acessa próprio campo
                System.out.println("Contador: " + contador);
            }

            // Métodos adicionais (não da interface)
            private void metodoAdicional() {
                System.out.println("Método extra");
            }
        };

        r.run();
    }
}
```

## 🔍 Análise Conceitual Profunda

### Caso 1: Event Listeners (Swing)

```java
public class JanelaLogin extends JFrame {
    private JTextField campoUsuario;
    private JPasswordField campoSenha;
    private JButton botaoLogin;

    public JanelaLogin() {
        // ... inicialização dos componentes

        botaoLogin.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String usuario = campoUsuario.getText();
                String senha = new String(campoSenha.getPassword());

                if (validarCredenciais(usuario, senha)) {
                    JOptionPane.showMessageDialog(JanelaLogin.this,
                        "Login bem-sucedido!");
                    abrirTelaPrincipal();
                } else {
                    JOptionPane.showMessageDialog(JanelaLogin.this,
                        "Credenciais inválidas", "Erro", JOptionPane.ERROR_MESSAGE);
                }
            }
        });
    }

    private boolean validarCredenciais(String usuario, String senha) {
        // Validação
        return true;
    }

    private void abrirTelaPrincipal() {
        // Abrir tela
    }
}
```

### Caso 2: Threads

```java
public void executarTarefaAsync(String tarefa, int duracao) {
    Thread thread = new Thread() {
        @Override
        public void run() {
            System.out.println("Iniciando: " + tarefa);

            try {
                Thread.sleep(duracao * 1000);
            } catch (InterruptedException e) {
                System.out.println("Interrompido");
            }

            System.out.println("Concluído: " + tarefa);
        }
    };

    thread.start();
}
```

### Caso 3: Comparators

```java
public void ordenarPessoas(List<Pessoa> pessoas, String criterio) {
    Comparator<Pessoa> comparator = new Comparator<Pessoa>() {
        @Override
        public int compare(Pessoa p1, Pessoa p2) {
            switch (criterio) {
                case "nome":
                    return p1.getNome().compareTo(p2.getNome());
                case "idade":
                    return Integer.compare(p1.getIdade(), p2.getIdade());
                default:
                    return 0;
            }
        }
    };

    Collections.sort(pessoas, comparator);
}
```

### Caso 4: Interface com Múltiplos Métodos

```java
interface Lifecycle {
    void onStart();
    void onStop();
    void onPause();
}

public void registrarComponente(String nome) {
    Lifecycle lifecycle = new Lifecycle() {
        private boolean ativo = false;

        @Override
        public void onStart() {
            ativo = true;
            System.out.println(nome + " iniciado");
        }

        @Override
        public void onStop() {
            ativo = false;
            System.out.println(nome + " parado");
        }

        @Override
        public void onPause() {
            System.out.println(nome + " pausado");
        }
    };

    gerenciador.registrar(lifecycle);
}
```

## 🎯 Aplicabilidade e Contextos

### Quando Usar Anonymous Classes

**1. Event Handlers em GUI**
**2. Callbacks Únicos**
**3. Implementações Descartáveis de Interfaces**
**4. Customização Rápida de Classes Abstratas**

### Quando NÃO Usar

**Use Lambda se:**
- Interface funcional (1 método abstrato)
- Sem necessidade de estado adicional

```java
// ❌ Verboso - anonymous class
button.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        System.out.println("Clique");
    }
});

// ✅ Conciso - lambda
button.addActionListener(e -> System.out.println("Clique"));
```

## ⚠️ Limitações

### Limitação 1: Não Pode Ter Construtor Explícito

```java
Runnable r = new Runnable() {
    // public Runnable() { }  // ❌ ERRO - anonymous class não pode ter construtor

    // ✅ Use bloco de inicialização
    {
        // inicialização
    }
};
```

### Limitação 2: Não Pode Implementar Múltiplas Interfaces

```java
// ❌ ERRO - só pode especificar UM tipo base
Object obj = new Runnable(), Comparable() { };

// ✅ Solução: inner class nomeada
class MultiInterface implements Runnable, Comparable {
    // ...
}
```

### Limitação 3: Métodos Adicionais Não São Acessíveis

```java
Runnable r = new Runnable() {
    public void run() { }

    public void metodoExtra() { }  // Existe, mas não acessível via tipo Runnable
};

// r.metodoExtra();  // ❌ ERRO - não visível no tipo Runnable
```

## 🔗 Interconexões Conceituais

**Relação com Local Classes**: Anonymous classes são local classes sem nome.

**Relação com Lambdas**: Lambdas substituem anonymous classes para interfaces funcionais.

**Relação com Method References**: Outra forma concisa de criar implementações.

## 🚀 Evolução e Próximos Conceitos

**Lambda Expressions (Java 8+)**: Substituição concisa para anonymous classes simples

**Method References**: Referências a métodos existentes

**Functional Interfaces**: Interfaces com um método abstrato (@FunctionalInterface)
