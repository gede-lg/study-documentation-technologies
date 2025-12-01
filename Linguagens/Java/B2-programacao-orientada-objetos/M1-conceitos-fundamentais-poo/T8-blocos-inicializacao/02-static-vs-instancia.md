# Blocos Static vs Blocos de Instância

## 🎯 Introdução e Definição

**Blocos static** (`static { }`) executam uma vez ao carregar classe, inicializando membros estáticos. **Blocos de instância** (`{ }` sem static) executam toda vez que objeto é criado, inicializando membros de instância. Diferença fundamental: static = uma vez por classe, instância = uma vez por objeto.

---

## 📋 Comparação Direta

| Aspecto | Bloco Static | Bloco de Instância |
|---------|--------------|-------------------|
| **Sintaxe** | `static { }` | `{ }` |
| **Execução** | Uma vez (carregar classe) | Toda vez (`new`) |
| **Timing** | Antes de qualquer instância | Antes de construtor |
| **Propósito** | Inicializar membros static | Inicializar membros de instância |
| **Acesso** | Apenas membros static | Membros static e instância |
| **Memória** | Method Area | Heap (por objeto) |

---

## 🧠 Exemplo Comparativo

```java
class Exemplo {
    // Membros static
    static int valorStatic = 0;

    static {
        valorStatic = 100;
        System.out.println("Bloco static: valorStatic=" + valorStatic);
    }

    // Membros de instância
    int valorInstancia = 0;

    {
        valorInstancia = 200;
        System.out.println("Bloco instância: valorInstancia=" + valorInstancia);
    }

    Exemplo() {
        System.out.println("Construtor");
    }
}

// Primeira instância:
Exemplo e1 = new Exemplo();
// Saída:
// Bloco static: valorStatic=100     (executa)
// Bloco instância: valorInstancia=200
// Construtor

// Segunda instância:
Exemplo e2 = new Exemplo();
// Saída:
// Bloco instância: valorInstancia=200  (bloco static NÃO executa!)
// Construtor
```

---

## 🔍 Ordem Completa

```java
class Completo {
    // 1️⃣ Inline static
    static int a = 1;

    // 2️⃣ Bloco static
    static {
        a += 10;  // a = 11
        System.out.println("Static: a=" + a);
    }

    // 3️⃣ Inline instância (por objeto)
    int b = 20;

    // 4️⃣ Bloco instância (por objeto)
    {
        b += 5;  // b = 25
        System.out.println("Instância: b=" + b);
    }

    // 5️⃣ Construtor (por objeto)
    Completo() {
        b += 10;  // b = 35
        System.out.println("Construtor: b=" + b);
    }
}

Completo c1 = new Completo();
// Saída:
// Static: a=11           (1 vez)
// Instância: b=25
// Construtor: b=35

Completo c2 = new Completo();
// Saída:
// Instância: b=25        (static não repete!)
// Construtor: b=35
```

**Ordem Geral:**
1. **Static** (uma vez): inline static → blocos static
2. **Instância** (por objeto): inline → blocos → construtor

---

## 🎯 Quando Usar Cada Um

### Use Bloco Static Para:

✅ Inicializar atributos estáticos complexos
✅ Carregar recursos compartilhados (configurações, drivers)
✅ Popular caches globais
✅ Registrar componentes (JDBC drivers)

### Use Bloco de Instância Para:

✅ Código compartilhado entre construtores
✅ Inicialização de coleções de instância
✅ Gerar IDs/timestamps por objeto
✅ Lógica complexa por objeto

---

## 📚 Conclusão

Blocos static (`static { }`) executam uma vez ao carregar classe para inicializar membros estáticos. Blocos de instância (`{ }`) executam toda vez que objeto é criado para inicializar membros de instância. Diferença chave: static = classe (uma vez), instância = objeto (toda vez).
