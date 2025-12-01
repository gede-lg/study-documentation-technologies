# Ordem de Execução Final: Consolidação Completa

## 🎯 Visão Geral

Este documento consolida a ordem completa de inicialização em Java, incluindo static, instância, herança, e todos os casos especiais.

---

## 📋 Ordem Completa (Sem Herança)

### 1. Inicialização Static (Uma Vez)

```java
class Exemplo {
    // 1️⃣ Valores padrão static (JVM)
    static int x;  // 0

    // 2️⃣ Inline static
    static int a = 10;

    // 3️⃣ Bloco static
    static {
        a += 5;  // a = 15
    }
}
```

**Timing:** Ao carregar classe (lazy loading), antes de qualquer instância.

### 2. Inicialização de Instância (Por Objeto)

```java
class Exemplo {
    // 4️⃣ Valores padrão instância (JVM)
    int y;  // 0

    // 5️⃣ Inline instância
    int b = 20;

    // 6️⃣ Bloco de instância
    {
        b += 5;  // b = 25
    }

    // 7️⃣ Construtor
    Exemplo() {
        b += 10;  // b = 35
    }
}
```

**Timing:** Cada `new`, na ordem acima.

---

## 🔍 Ordem Com Herança

```java
class Pai {
    static int staticPai = 1;
    static { staticPai += 10; }  // 11

    int instanciaPai = 100;
    { instanciaPai += 5; }       // 105

    Pai() { instanciaPai += 10; }  // 115
}

class Filho extends Pai {
    static int staticFilho = 2;
    static { staticFilho += 20; }  // 22

    int instanciaFilho = 200;
    { instanciaFilho += 5; }       // 205

    Filho() { instanciaFilho += 10; }  // 215
}

// Primeira referência a Filho:
Filho f = new Filho();
```

**Ordem de Execução:**

1. **Static Pai:** inline → blocos (staticPai = 11)
2. **Static Filho:** inline → blocos (staticFilho = 22)
3. **Valores Padrão:** Pai e Filho (todos = 0/null)
4. **Instância Pai:** inline → blocos → construtor (instanciaPai = 115)
5. **Instância Filho:** inline → blocos → construtor (instanciaFilho = 215)

---

## 🎯 Diagrama de Fluxo Completo

```
┌─────────────────────────────────┐
│ CARREGAMENTO DE CLASSE (1 vez) │
└─────────────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │ Static Pai   │
    │ - Inline     │
    │ - Blocos     │
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │ Static Filho │
    │ - Inline     │
    │ - Blocos     │
    └──────────────┘

┌─────────────────────────────────┐
│   CRIAÇÃO DE OBJETO (cada new)  │
└─────────────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │ Valores      │
    │ Padrão (JVM) │
    │ Pai + Filho  │
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │ Instância Pai│
    │ - Inline     │
    │ - Blocos     │
    │ - Construtor │
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │Instância     │
    │ Filho        │
    │ - Inline     │
    │ - Blocos     │
    │ - Construtor │
    └──────────────┘
```

---

## ⚠️ Casos Especiais

### Encadeamento com `this()`

```java
class Encadeamento {
    int x = 10;
    { x += 5; }  // x = 15

    Encadeamento() {
        this(100);
        // x já foi modificado por this(int)
    }

    Encadeamento(int valor) {
        x = valor;  // Sobrescreve
    }
}

new Encadeamento();
// Ordem:
// 1. x = 10 (inline)
// 2. x = 15 (bloco)
// 3. Encadeamento() chama this(100)
// 4. Encadeamento(int) executa: x = 100
// Resultado final: x = 100
```

**Importante:** Inline e blocos executam ANTES de qualquer `this()`.

### Chamada Implícita de `super()`

```java
class Filho extends Pai {
    Filho() {
        // super(); inserido automaticamente aqui
        // Antes de qualquer código do construtor
    }
}
```

---

## 📚 Resumo Tabular

| Fase | Static | Instância | Frequência |
|------|--------|-----------|-----------|
| **1** | Inline static Pai | - | Uma vez |
| **2** | Blocos static Pai | - | Uma vez |
| **3** | Inline static Filho | - | Uma vez |
| **4** | Blocos static Filho | - | Uma vez |
| **5** | - | Valores padrão | Por objeto |
| **6** | - | Inline Pai | Por objeto |
| **7** | - | Blocos Pai | Por objeto |
| **8** | - | Construtor Pai | Por objeto |
| **9** | - | Inline Filho | Por objeto |
| **10** | - | Blocos Filho | Por objeto |
| **11** | - | Construtor Filho | Por objeto |

---

## 📚 Conclusão Final

Ordem de inicialização Java é determinística e rígida:

**Static (uma vez):** Superclasse → Subclasse (inline → blocos)
**Instância (por objeto):** Valores padrão → Superclasse (inline → blocos → construtor) → Subclasse (inline → blocos → construtor)

Dominar ordem completa significa:
- Static executa UMA vez ao carregar classe
- Instância executa TODA vez que criar objeto
- Superclasse SEMPRE antes de subclasse
- Inline SEMPRE antes de blocos
- Blocos SEMPRE antes de construtor
- `this()` executa APÓS inline e blocos
- `super()` é PRIMEIRA instrução (implícita ou explícita)
- Ordem é JLS-guaranteed (Java Language Specification)

Compreender ordem evita bugs sutis: acessar atributo antes de inicializar, chamar método virtual em construtor antes de subclasse estar pronta, depender de ordem incorreta de execução. É fundamento de comportamento previsível em POO Java - desenvolvedores podem raciocinar com confiança sobre estado do objeto em cada etapa de criação.
