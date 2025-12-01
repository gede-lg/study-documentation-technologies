# T6.02 - Acesso da Classe Externa a Membros de Classes Aninhadas

## Introdução

**Classe externa**: pode acessar membros de classes aninhadas.

```java
public class Externa {
    class Interna {
        private int valor = 10;
    }
    
    void testar() {
        Interna i = new Interna();
        System.out.println(i.valor); // Acessa private da inner
    }
}
```

**Acesso**: classe externa acessa membros private das aninhadas.

---

## Fundamentos

### 1. Acessar Membros Private de Inner Class

**Private**: classe externa acessa.

```java
public class Pessoa {
    class Endereco {
        private String rua = "Av. Principal";
        private int numero = 100;
    }
    
    void exibirEndereco() {
        Endereco end = new Endereco();
        System.out.println(end.rua + ", " + end.numero); // Private OK
    }
}

Pessoa p = new Pessoa();
p.exibirEndereco(); // Av. Principal, 100
```

### 2. Acessar Métodos Private de Inner Class

**Métodos private**: classe externa acessa.

```java
public class Calculadora {
    class Operacao {
        private int somar(int a, int b) {
            return a + b;
        }
    }
    
    void calcular() {
        Operacao op = new Operacao();
        int resultado = op.somar(10, 5); // Private OK
        System.out.println("Resultado: " + resultado);
    }
}

Calculadora calc = new Calculadora();
calc.calcular(); // Resultado: 15
```

### 3. Acessar Static Nested Class

**Static nested**: instanciar diretamente.

```java
public class Externa {
    static class Aninhada {
        private int valor = 20;
        
        private void mostrar() {
            System.out.println("Valor: " + valor);
        }
    }
    
    void testar() {
        Aninhada an = new Aninhada(); // Sem instância da externa
        System.out.println(an.valor);  // Private OK
        an.mostrar();                  // Private OK
    }
}

Externa ext = new Externa();
ext.testar();
// 20
// Valor: 20
```

### 4. Modificar Membros Private

**Modificar**: classe externa pode.

```java
public class Contador {
    class Incrementador {
        private int valor = 0;
    }
    
    void incrementar() {
        Incrementador inc = new Incrementador();
        inc.valor++; // Modifica private
        System.out.println("Valor: " + inc.valor);
    }
}

Contador cont = new Contador();
cont.incrementar(); // Valor: 1
```

### 5. Acessar Múltiplas Inner Classes

**Múltiplas**: acessar cada uma.

```java
public class Empresa {
    class Funcionario {
        private String nome = "João";
    }
    
    class Departamento {
        private String setor = "TI";
    }
    
    void exibir() {
        Funcionario func = new Funcionario();
        Departamento dept = new Departamento();
        
        System.out.println(func.nome);   // Private OK
        System.out.println(dept.setor);  // Private OK
    }
}

Empresa emp = new Empresa();
emp.exibir();
// João
// TI
```

### 6. Retornar Instância de Inner Class

**Retornar**: método pode retornar inner class.

```java
public class Fabrica {
    class Produto {
        private String nome;
        
        private Produto(String nome) {
            this.nome = nome;
        }
        
        private String getNome() {
            return nome;
        }
    }
    
    Produto criar(String nome) {
        return new Produto(nome); // Construtor private OK
    }
    
    void testar() {
        Produto p = criar("Mouse");
        System.out.println(p.getNome()); // Método private OK
    }
}

Fabrica fab = new Fabrica();
fab.testar(); // Mouse
```

### 7. Acessar Inner Class Aninhada

**Nested dentro de nested**: acessar.

```java
public class A {
    class B {
        private int valorB = 10;
        
        class C {
            private int valorC = 20;
        }
    }
    
    void testar() {
        B b = new B();
        B.C c = b.new C();
        
        System.out.println(b.valorB); // Private de B
        System.out.println(c.valorC); // Private de C
    }
}

A a = new A();
a.testar();
// 10
// 20
```

### 8. Acessar Local Class

**Local class**: visível apenas no método.

```java
public class Processador {
    void processar() {
        class Helper {
            private int valor = 30;
            
            private void ajudar() {
                System.out.println("Ajudando...");
            }
        }
        
        Helper h = new Helper();
        System.out.println(h.valor); // Private OK
        h.ajudar();                  // Private OK
    }
}

Processador proc = new Processador();
proc.processar();
// 30
// Ajudando...
```

### 9. Acessar Anonymous Class

**Anonymous class**: através de referência.

```java
public class Botao {
    Runnable criarListener() {
        return new Runnable() {
            private int cliques = 0; // Campo privado
            
            @Override
            public void run() {
                cliques++;
                System.out.println("Cliques: " + cliques);
            }
        };
    }
    
    void testar() {
        Runnable r = criarListener();
        r.run(); // Cliques: 1
        r.run(); // Cliques: 2
    }
}

Botao btn = new Botao();
btn.testar();
```

### 10. Acessar de Método Static

**Método static**: acessa static nested.

```java
public class Config {
    static class Opcoes {
        private static String modo = "debug";
        private String valor = "teste";
    }
    
    static void configurar() {
        // ✅ Acessa static
        System.out.println(Opcoes.modo);
        
        // ✅ Cria instância e acessa
        Opcoes op = new Opcoes();
        System.out.println(op.valor);
    }
}

Config.configurar();
// debug
// teste
```

---

## Aplicabilidade

**Classe externa acessa**:
- Membros private de inner class
- Membros private de static nested
- Membros private de local class
- Membros de anonymous class (via referência)

---

## Armadilhas

### 1. Local Class Fora do Escopo

```java
public class Teste {
    void metodo1() {
        class Local {
            private int valor = 10;
        }
    }
    
    void metodo2() {
        // ❌ ERRO: Local não visível aqui
        // Local l = new Local();
    }
}
```

### 2. Tentar Acessar Sem Instância

```java
public class Externa {
    class Interna {
        private int valor = 10;
    }
    
    static void testar() {
        // ❌ ERRO: static não pode acessar inner class sem instância
        // Interna i = new Interna();
        
        // ✅ Criar instância da externa primeiro
        Externa ext = new Externa();
        Interna i = ext.new Interna();
        System.out.println(i.valor);
    }
}
```

### 3. Confundir Acesso a Anonymous Class

```java
public class Botao {
    Runnable criarListener() {
        return new Runnable() {
            int cliques = 0; // package-private
            
            @Override
            public void run() {
                cliques++;
            }
        };
    }
    
    void testar() {
        Runnable r = criarListener();
        
        // ❌ ERRO: não pode acessar campo de anonymous class
        // System.out.println(r.cliques);
        
        // ✅ Anonymous class deve expor via método
    }
}
```

---

## Boas Práticas

### 1. Factory Method para Inner Class

```java
// ✅ Factory method
public class Lista {
    class Node {
        private int valor;
        private Node(int valor) {
            this.valor = valor;
        }
    }
    
    Node criarNode(int valor) {
        return new Node(valor); // Construtor private OK
    }
}
```

### 2. Encapsular Acesso

```java
// ✅ Encapsular acesso a inner class
public class Empresa {
    class Funcionario {
        private String nome;
        private Funcionario(String nome) {
            this.nome = nome;
        }
    }
    
    public void adicionarFuncionario(String nome) {
        Funcionario f = new Funcionario(nome);
        // Processar...
    }
}
```

### 3. Modificar Através de Métodos

```java
// ✅ Modificar através de métodos
public class Contador {
    class Incrementador {
        private int valor = 0;
        
        private void incrementar() {
            valor++;
        }
        
        private int obter() {
            return valor;
        }
    }
    
    void processar() {
        Incrementador inc = new Incrementador();
        inc.incrementar();
        System.out.println(inc.obter());
    }
}
```

---

## Resumo

**Classe externa acessa membros de classes aninhadas**:

| Tipo Aninhada | Acesso Private | Instanciação | Escopo |
|---------------|----------------|--------------|--------|
| Inner class | ✅ | `new Interna()` | Toda a classe |
| Static nested | ✅ | `new Aninhada()` | Toda a classe |
| Local class | ✅ | `new Local()` | Apenas no método |
| Anonymous | ✅ (via referência) | Inline | Apenas no método |

**Inner class**:
- Externa acessa membros private
- Precisa instância da externa (não-static)

**Static nested**:
- Externa acessa membros private
- NÃO precisa instância da externa

**Local class**:
- Visível apenas no método
- Externa acessa private dentro do método

**Anonymous class**:
- Acesso via referência (interface/classe base)
- Campos private não acessíveis diretamente

**Regra de Ouro**: Classe externa pode acessar **membros private** de classes aninhadas. **Inner class** requer instância da externa. **Static nested** não requer. **Local class** visível apenas no método. Para **anonymous class**, acesso via interface/classe base (campos private não acessíveis diretamente).
