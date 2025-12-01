# T12.04 - Evitar ordinal() para Lógica

## Introdução

**ordinal()**: retorna posição da constante (0, 1, 2...).

```java
// ❌ Usar ordinal() para lógica
public enum Prioridade {
    BAIXA,  // ordinal() = 0
    MEDIA,  // ordinal() = 1
    ALTA    // ordinal() = 2
}

public int getPontos(Prioridade p) {
    return p.ordinal() + 1; // ⚠️ Frágil
}

// ⚠️ Problema: reordenar quebra
public enum Prioridade {
    URGENTE, // ordinal() = 0 (era BAIXA)
    BAIXA,   // ordinal() = 1 (era MEDIA)
    MEDIA,   // ordinal() = 2 (era ALTA)
    ALTA     // ordinal() = 3 (novo)
}
// ⚠️ Agora URGENTE.ordinal() + 1 = 1 (errado)

// ✅ Usar atributo explícito
public enum Prioridade {
    BAIXA(1),
    MEDIA(2),
    ALTA(3);
    
    private final int pontos;
    
    Prioridade(int pontos) {
        this.pontos = pontos;
    }
    
    public int getPontos() {
        return pontos; // ✅ Estável
    }
}
```

**ordinal() muda ao reordenar** = frágil.

---

## Fundamentos

### 1. Problema ao Reordenar

```java
// ❌ Lógica baseada em ordinal()
public enum Status {
    NOVO,       // ordinal() = 0
    APROVADO,   // ordinal() = 1
    REJEITADO   // ordinal() = 2
}

public boolean isAprovado(Status status) {
    return status.ordinal() == 1; // ⚠️ Frágil
}

// ⚠️ Adicionar constante no início quebra
public enum Status {
    PENDENTE,   // ordinal() = 0 (novo)
    NOVO,       // ordinal() = 1 (era 0)
    APROVADO,   // ordinal() = 2 (era 1)
    REJEITADO   // ordinal() = 3 (era 2)
}

// ⚠️ Agora APROVADO.ordinal() == 2, não 1
isAprovado(Status.APROVADO); // false (errado)

// ✅ Comparação direta
public boolean isAprovado(Status status) {
    return status == Status.APROVADO; // ✅ Estável
}
```

### 2. Serialização com ordinal()

```java
// ❌ Serializar ordinal()
public enum Nivel {
    FACIL,  // ordinal() = 0
    MEDIO,  // ordinal() = 1
    DIFICIL // ordinal() = 2
}

// ⚠️ Salvar ordinal no banco
int ordinal = Nivel.MEDIO.ordinal(); // 1
// Salvar "1" no banco

// ⚠️ Reordenar quebra
public enum Nivel {
    TUTORIAL, // ordinal() = 0 (novo)
    FACIL,    // ordinal() = 1 (era 0)
    MEDIO,    // ordinal() = 2 (era 1)
    DIFICIL   // ordinal() = 3 (era 2)
}

// ⚠️ Ler "1" do banco agora é FACIL, não MEDIO

// ✅ Serializar nome ou código
public enum Nivel {
    FACIL("F"),
    MEDIO("M"),
    DIFICIL("D");
    
    private final String codigo;
    
    Nivel(String codigo) {
        this.codigo = codigo;
    }
    
    public String getCodigo() {
        return codigo;
    }
}

// ✅ Salvar "M" no banco (estável)
```

### 3. Array Indexado por ordinal()

```java
// ❌ Array indexado por ordinal()
public enum Cor {
    VERMELHO, // ordinal() = 0
    VERDE,    // ordinal() = 1
    AZUL      // ordinal() = 2
}

String[] nomes = new String[3];
nomes[Cor.VERMELHO.ordinal()] = "Red"; // ⚠️ Frágil
nomes[Cor.VERDE.ordinal()] = "Green";
nomes[Cor.AZUL.ordinal()] = "Blue";

// ⚠️ Reordenar quebra
public enum Cor {
    AMARELO,  // ordinal() = 0 (novo)
    VERMELHO, // ordinal() = 1 (era 0)
    VERDE,    // ordinal() = 2 (era 1)
    AZUL      // ordinal() = 3 (era 2)
}

// ⚠️ nomes[Cor.VERMELHO.ordinal()] agora é nomes[1] (errado)

// ✅ EnumMap
import java.util.*;

Map<Cor, String> nomes = new EnumMap<>(Cor.class);
nomes.put(Cor.VERMELHO, "Red"); // ✅ Estável
nomes.put(Cor.VERDE, "Green");
nomes.put(Cor.AZUL, "Blue");
```

### 4. Comparação com ordinal()

```java
// ❌ Comparar ordinal()
public enum Tamanho {
    PEQUENO, // ordinal() = 0
    MEDIO,   // ordinal() = 1
    GRANDE   // ordinal() = 2
}

public boolean isMaior(Tamanho t1, Tamanho t2) {
    return t1.ordinal() > t2.ordinal(); // ⚠️ Frágil
}

// ⚠️ Reordenar quebra
public enum Tamanho {
    EXTRA_PEQUENO, // ordinal() = 0 (novo)
    PEQUENO,       // ordinal() = 1 (era 0)
    MEDIO,         // ordinal() = 2 (era 1)
    GRANDE         // ordinal() = 3 (era 2)
}

// ⚠️ Comparação quebrada

// ✅ Atributo explícito
public enum Tamanho {
    PEQUENO(1),
    MEDIO(2),
    GRANDE(3);
    
    private final int valor;
    
    Tamanho(int valor) {
        this.valor = valor;
    }
    
    public int getValor() {
        return valor;
    }
}

public boolean isMaior(Tamanho t1, Tamanho t2) {
    return t1.getValor() > t2.getValor(); // ✅ Estável
}
```

### 5. Switch com ordinal()

```java
// ❌ Switch com ordinal()
public enum Operacao {
    SOMA,       // ordinal() = 0
    SUBTRACAO,  // ordinal() = 1
    MULTIPLICACAO // ordinal() = 2
}

public double calcular(Operacao op, double a, double b) {
    switch (op.ordinal()) { // ⚠️ Frágil
        case 0: return a + b;
        case 1: return a - b;
        case 2: return a * b;
        default: throw new IllegalArgumentException();
    }
}

// ⚠️ Reordenar quebra

// ✅ Switch com enum diretamente
public double calcular(Operacao op, double a, double b) {
    switch (op) { // ✅ Estável
        case SOMA: return a + b;
        case SUBTRACAO: return a - b;
        case MULTIPLICACAO: return a * b;
        default: throw new IllegalArgumentException();
    }
}

// ✅ Ou constant-specific method
public enum Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    SUBTRACAO {
        @Override
        public double calcular(double a, double b) {
            return a - b;
        }
    };
    
    public abstract double calcular(double a, double b);
}
```

### 6. Loop com ordinal()

```java
// ❌ Loop com ordinal()
public enum DiaSemana {
    DOMINGO, SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO
}

for (int i = 0; i < 7; i++) {
    // ⚠️ Assumir que ordinal() vai de 0 a 6
    DiaSemana dia = DiaSemana.values()[i]; // ⚠️ Frágil
}

// ✅ Loop direto
for (DiaSemana dia : DiaSemana.values()) {
    System.out.println(dia); // ✅ Estável
}
```

### 7. Cálculo com ordinal()

```java
// ❌ Cálculo com ordinal()
public enum Mes {
    JANEIRO, FEVEREIRO, MARCO, ABRIL, MAIO, JUNHO,
    JULHO, AGOSTO, SETEMBRO, OUTUBRO, NOVEMBRO, DEZEMBRO
}

public int getNumeroMes(Mes mes) {
    return mes.ordinal() + 1; // ⚠️ Frágil (assume ordem)
}

// ✅ Atributo explícito
public enum Mes {
    JANEIRO(1), FEVEREIRO(2), MARCO(3), ABRIL(4),
    MAIO(5), JUNHO(6), JULHO(7), AGOSTO(8),
    SETEMBRO(9), OUTUBRO(10), NOVEMBRO(11), DEZEMBRO(12);
    
    private final int numero;
    
    Mes(int numero) {
        this.numero = numero;
    }
    
    public int getNumero() {
        return numero;
    }
}
```

### 8. Offset com ordinal()

```java
// ❌ Offset com ordinal()
public enum Prioridade {
    BAIXA,  // ordinal() = 0
    MEDIA,  // ordinal() = 1
    ALTA    // ordinal() = 2
}

public int getPontos(Prioridade p) {
    return (p.ordinal() + 1) * 10; // ⚠️ Frágil
}

// ✅ Atributo explícito
public enum Prioridade {
    BAIXA(10),
    MEDIA(20),
    ALTA(30);
    
    private final int pontos;
    
    Prioridade(int pontos) {
        this.pontos = pontos;
    }
    
    public int getPontos() {
        return pontos;
    }
}
```

### 9. Uso Legítimo de ordinal()

```java
// ✅ Uso OK: EnumSet interno
Set<Status> set = EnumSet.noneOf(Status.class);
// EnumSet usa ordinal() internamente (OK)

// ✅ Uso OK: compareTo() padrão
Status.NOVO.compareTo(Status.APROVADO);
// compareTo() usa ordinal() internamente (OK)

// ❌ Não usar ordinal() diretamente na aplicação
```

### 10. Documentação ordinal()

```java
/**
 * Status do pedido.
 * 
 * ⚠️ NÃO usar ordinal() para lógica de negócio.
 * Ordem das constantes pode mudar.
 */
public enum Status {
    NOVO,
    APROVADO,
    REJEITADO
}
```

---

## Aplicabilidade

**Evitar ordinal()** para:
- Lógica de negócio
- Serialização (banco, JSON)
- Comparação
- Cálculos

**ordinal() OK** para:
- Uso interno (EnumSet, compareTo)

---

## Armadilhas

### 1. Serializar ordinal()

```java
// ❌ Serializar ordinal()
int ord = status.ordinal(); // ⚠️ Quebra ao reordenar

// ✅ Serializar nome ou código
String nome = status.name();
String codigo = status.getCodigo();
```

### 2. Array Indexado

```java
// ❌ Array por ordinal()
array[enum.ordinal()] = valor; // ⚠️ Frágil

// ✅ EnumMap
map.put(enum, valor);
```

### 3. Comparação

```java
// ❌ Comparar ordinal()
if (e1.ordinal() > e2.ordinal()) { } // ⚠️ Frágil

// ✅ Comparar atributo
if (e1.getPrioridade() > e2.getPrioridade()) { }
```

---

## Boas Práticas

### 1. Atributo Explícito

```java
private final int valor;
```

### 2. Comparação Direta

```java
if (status == Status.APROVADO) { }
```

### 3. EnumMap em Vez de Array

```java
Map<Cor, String> map = new EnumMap<>(Cor.class);
```

### 4. Serializar Nome ou Código

```java
String codigo = status.getCodigo();
```

---

## Resumo

**Evitar ordinal()**:

```java
// ❌ ordinal() (frágil)
int pontos = prioridade.ordinal() + 1;

// ✅ Atributo (estável)
public enum Prioridade {
    BAIXA(1),
    MEDIA(2),
    ALTA(3);
    
    private final int pontos;
    
    Prioridade(int pontos) {
        this.pontos = pontos;
    }
    
    public int getPontos() {
        return pontos;
    }
}
```

**Regra de Ouro**: **Nunca** usar ordinal() para lógica. **Atributo explícito** para valores. **EnumMap** em vez de array. **Serializar nome ou código**, não ordinal.
