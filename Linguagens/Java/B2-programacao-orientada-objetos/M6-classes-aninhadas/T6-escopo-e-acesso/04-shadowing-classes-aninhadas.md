# T6.04 - Shadowing em Classes Aninhadas

## Introdução

**Shadowing**: variável de inner class "esconde" variável da outer class.

```java
public class Externa {
    private int valor = 10;
    
    class Interna {
        private int valor = 20; // Shadowing
        
        void mostrar() {
            System.out.println(valor);         // 20 (Interna)
            System.out.println(this.valor);    // 20 (Interna)
            System.out.println(Externa.this.valor); // 10 (Externa)
        }
    }
}
```

**Shadow**: variável local oculta variável de escopo superior.

---

## Fundamentos

### 1. Shadowing de Campo

**Campo**: inner class oculta campo da outer.

```java
public class Externa {
    private String nome = "Externa";
    
    class Interna {
        private String nome = "Interna"; // Shadow
        
        void exibir() {
            System.out.println("Interna: " + nome);
            System.out.println("Externa: " + Externa.this.nome);
        }
    }
}

Externa ext = new Externa();
Externa.Interna int = ext.new Interna();
int.exibir();
// Interna: Interna
// Externa: Externa
```

### 2. Shadowing de Múltiplos Campos

**Múltiplos**: vários campos com mesmo nome.

```java
public class A {
    int valor = 10;
    
    class B {
        int valor = 20;
        
        class C {
            int valor = 30;
            
            void mostrar() {
                System.out.println("C: " + valor);           // 30
                System.out.println("B: " + B.this.valor);    // 20
                System.out.println("A: " + A.this.valor);    // 10
            }
        }
    }
}

A a = new A();
A.B b = a.new B();
A.B.C c = b.new C();
c.mostrar();
```

### 3. Shadowing de Método

**Método**: inner class sobrescreve método.

```java
public class Externa {
    void processar() {
        System.out.println("Externa.processar()");
    }
    
    class Interna {
        void processar() { // Shadow (não é override!)
            System.out.println("Interna.processar()");
        }
        
        void executar() {
            processar();              // Interna.processar()
            Externa.this.processar(); // Externa.processar()
        }
    }
}

Externa ext = new Externa();
Externa.Interna int = ext.new Interna();
int.executar();
// Interna.processar()
// Externa.processar()
```

### 4. Shadowing em Local Class

**Local class**: oculta campo da classe externa.

```java
public class Externa {
    private int valor = 100;
    
    void metodo() {
        int valor = 200; // Variável local
        
        class Local {
            int valor = 300; // Shadow
            
            void mostrar() {
                System.out.println("Local: " + valor);          // 300
                System.out.println("Externa: " + Externa.this.valor); // 100
                // Não pode acessar variável local "valor" (200)
            }
        }
        
        Local l = new Local();
        l.mostrar();
    }
}

Externa ext = new Externa();
ext.metodo();
// Local: 300
// Externa: 100
```

### 5. Shadowing em Anonymous Class

**Anonymous class**: campo oculta outer.

```java
public class Botao {
    private int cliques = 0;
    
    Runnable criarListener() {
        return new Runnable() {
            private int cliques = 10; // Shadow
            
            @Override
            public void run() {
                cliques++; // Anonymous class
                System.out.println("Inner: " + cliques);
                System.out.println("Outer: " + Botao.this.cliques);
            }
        };
    }
}

Botao btn = new Botao();
Runnable r = btn.criarListener();
r.run();
// Inner: 11
// Outer: 0
```

### 6. Shadowing de Parâmetro

**Parâmetro**: método de inner class.

```java
public class Externa {
    private String nome = "Externa";
    
    class Interna {
        void exibir(String nome) { // Parâmetro shadow
            System.out.println("Param: " + nome);
            System.out.println("Externa: " + Externa.this.nome);
        }
    }
}

Externa ext = new Externa();
Externa.Interna int = ext.new Interna();
int.exibir("Parâmetro");
// Param: Parâmetro
// Externa: Externa
```

### 7. Shadowing em Static Nested Class

**Static nested**: oculta campo static da outer.

```java
public class Externa {
    private static int valor = 100;
    
    static class Aninhada {
        private static int valor = 200; // Shadow
        
        void mostrar() {
            System.out.println("Aninhada: " + valor);
            System.out.println("Externa: " + Externa.valor);
        }
    }
}

Externa.Aninhada an = new Externa.Aninhada();
an.mostrar();
// Aninhada: 200
// Externa: 100
```

### 8. Evitar Shadowing com this

**this**: acessa campo da classe atual.

```java
public class Externa {
    private int valor = 10;
    
    class Interna {
        private int valor = 20;
        
        void mostrar() {
            System.out.println(this.valor);         // Interna
            System.out.println(Externa.this.valor); // Externa
        }
    }
}
```

### 9. Shadowing de Variável Local

**Variável local**: oculta campo.

```java
public class Teste {
    private int numero = 10;
    
    class Interna {
        void metodo() {
            int numero = 20; // Shadow de campo
            
            System.out.println("Local: " + numero);           // 20
            System.out.println("Classe: " + this.numero);     // ❌ Erro se não tiver campo
            System.out.println("Outer: " + Teste.this.numero); // 10
        }
    }
}
```

### 10. Shadowing em Herança + Inner Class

**Herança**: combinado com inner class.

```java
class Base {
    int valor = 100;
}

public class Derivada extends Base {
    int valor = 200; // Shadow de Base.valor
    
    class Interna {
        int valor = 300; // Shadow de Derivada.valor
        
        void mostrar() {
            System.out.println("Interna: " + valor);              // 300
            System.out.println("Derivada: " + Derivada.this.valor); // 200
            // Base.valor não acessível diretamente (private ou protected)
        }
    }
}

Derivada d = new Derivada();
Derivada.Interna i = d.new Interna();
i.mostrar();
// Interna: 300
// Derivada: 200
```

---

## Aplicabilidade

**Shadowing ocorre quando**:
- Inner class declara campo com mesmo nome da outer
- Local class declara campo com mesmo nome
- Anonymous class declara campo com mesmo nome
- Parâmetro/variável local tem mesmo nome que campo

---

## Armadilhas

### 1. Confundir Qual Variável Está Sendo Usada

```java
public class Externa {
    private int valor = 10;
    
    class Interna {
        private int valor = 20;
        
        void mostrar() {
            System.out.println(valor); // Qual? Interna!
        }
    }
}
```

### 2. Esquecer Externa.this

```java
public class Externa {
    private int valor = 10;
    
    class Interna {
        private int valor = 20;
        
        void somar() {
            // ❌ Soma 20 + 20, não 10 + 20
            int resultado = valor + valor;
            
            // ✅ Soma 10 + 20
            int correto = Externa.this.valor + this.valor;
        }
    }
}
```

### 3. Shadowing Acidental

```java
// ❌ Shadow acidental
public class Externa {
    private String nome = "Externa";
    
    class Interna {
        private String nome = "Interna"; // ❌ Acidental?
        
        void exibir() {
            // Qual nome?
            System.out.println(nome);
        }
    }
}
```

### 4. Variável Local Oculta Campo

```java
public class Teste {
    private int contador = 0;
    
    void incrementar() {
        int contador = 10; // ❌ Shadow acidental
        contador++;        // Incrementa local (11), não campo (0)
        
        System.out.println("Local: " + contador);      // 11
        System.out.println("Campo: " + this.contador); // 0
    }
}
```

---

## Boas Práticas

### 1. Evitar Shadowing

```java
// ✅ Nomes diferentes
public class Externa {
    private int valorExterno = 10;
    
    class Interna {
        private int valorInterno = 20; // Sem shadow
        
        void mostrar() {
            System.out.println(valorExterno);
            System.out.println(valorInterno);
        }
    }
}
```

### 2. Usar Externa.this Quando Necessário

```java
// ✅ Externa.this explícito
public class Externa {
    private int valor = 10;
    
    class Interna {
        private int valor = 20;
        
        void somar() {
            int soma = Externa.this.valor + this.valor; // Explícito
            System.out.println(soma); // 30
        }
    }
}
```

### 3. Prefixar Campos com m ou _

```java
// ✅ Prefixo para evitar shadow
public class Externa {
    private int mValor = 10;
    
    class Interna {
        private int mValor = 20; // Menos confuso
        
        void mostrar() {
            System.out.println("Interna: " + mValor);
            System.out.println("Externa: " + Externa.this.mValor);
        }
    }
}
```

### 4. Documentar Shadowing Intencional

```java
// ✅ Documentar se intencional
public class Externa {
    private int valor = 10;
    
    class Interna {
        /**
         * Shadows Externa.valor intencionalmente.
         * Use Externa.this.valor para acessar o campo externo.
         */
        private int valor = 20;
    }
}
```

---

## Resumo

**Shadowing**: variável de escopo interno oculta variável de escopo externo.

```java
public class Externa {
    private int valor = 10;
    
    class Interna {
        private int valor = 20; // Shadow
        
        void mostrar() {
            valor;              // 20 (Interna)
            this.valor;         // 20 (Interna)
            Externa.this.valor; // 10 (Externa)
        }
    }
}
```

**Tipos de shadowing**:
- Campo de inner class oculta campo de outer
- Campo de local class oculta campo de outer
- Campo de anonymous class oculta campo de outer
- Variável local oculta campo
- Parâmetro oculta campo

**Acessar variável oculta**:
- `this.campo` - classe atual
- `Externa.this.campo` - classe externa (inner class)
- `A.this.campo`, `B.this.campo` - classes aninhadas múltiplas

**Armadilhas**:
- Confundir qual variável está sendo usada
- Esquecer `Externa.this`
- Shadowing acidental
- Variável local oculta campo

**Boas práticas**:
- Evitar shadowing (nomes diferentes)
- `Externa.this` quando necessário
- Prefixar campos (`m`, `_`)
- Documentar shadowing intencional

**Regra de Ouro**: **Evite shadowing** sempre que possível usando nomes diferentes. Se shadowing for necessário, use **Externa.this.campo** para acessar a variável externa explicitamente. **this.campo** acessa a classe atual. Documente shadowing intencional.
