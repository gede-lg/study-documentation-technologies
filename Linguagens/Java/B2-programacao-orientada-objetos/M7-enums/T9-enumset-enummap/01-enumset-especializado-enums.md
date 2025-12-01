# 🎯 EnumSet: Set Especializado para Enums

## 🎯 Introdução e Definição

**EnumSet** é uma implementação especializada da interface `Set` otimizada exclusivamente para uso com tipos enum, utilizando internamente uma **representação de bit vector** (vetor de bits) que torna operações de conjunto extremamente eficientes em termos de **memória** e **performance**. Diferentemente de `HashSet` ou `TreeSet` genéricos, EnumSet aproveita características únicas dos enums — conjunto fechado e finito de valores com ordinais sequenciais — para criar uma estrutura de dados que é simultaneamente **type-safe**, **compacta** e **extremamente rápida** para todas operações de conjunto (adição, remoção, busca, união, interseção).

Conceitualmente, EnumSet representa um conjunto de constantes enum usando **bits individuais** onde cada bit corresponde a uma constante enum baseada em seu ordinal. Por exemplo, para um enum com 8 constantes, EnumSet usa apenas 8 bits (1 byte) para representar qualquer subconjunto possível, ao invés de objetos individuais como HashSet faria. Esta representação permite operações de conjunto serem realizadas através de **operações bitwise** extremamente rápidas (AND, OR, XOR) ao invés de comparações de objetos, resultando em performance superior e uso mínimo de memória.

### Contexto Histórico e Motivação

**Java 5 (2004): Introdução com Generics**

EnumSet foi introduzido junto com enums no Java 5, especificamente para aproveitar características únicas de enums.

**Problema Antes de EnumSet:**

```java
// Antes: usando HashSet para enums
Set<DiaSemana> diasUteis = new HashSet<>();
diasUteis.add(DiaSemana.SEGUNDA);
diasUteis.add(DiaSemana.TERCA);
diasUteis.add(DiaSemana.QUARTA);
// ... cada elemento é um objeto na memória
```

**Problemas**:
- Desperdício de memória (cada enum é um objeto no Set)
- Performance inferior (hash + comparações de objetos)
- Sem aproveitamento de características especiais de enums

**Solução com EnumSet:**

```java
// Depois: EnumSet otimizado
Set<DiaSemana> diasUteis = EnumSet.of(
    DiaSemana.SEGUNDA,
    DiaSemana.TERCA,
    DiaSemana.QUARTA,
    DiaSemana.QUINTA,
    DiaSemana.SEXTA
);
// Representado internamente como bits: 0b0011111 (5 bits ativos)
```

**Vantagens**:
- ✅ Memória mínima (bits ao invés de objetos)
- ✅ Performance superior (operações bitwise)
- ✅ API rica para conjuntos

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Bit Vector Interno**: Cada bit representa presença/ausência de constante
2. **Type-Safe**: Genérico parametrizado com tipo enum específico
3. **Operações O(1)**: Add, remove, contains em tempo constante
4. **Operações de Conjunto**: União, interseção, complemento otimizadas
5. **Duas Implementações**: `RegularEnumSet` (≤64 elementos) e `JumboEnumSet` (>64 elementos)

### Pilares Fundamentais

- **Factory Methods**: `of()`, `allOf()`, `noneOf()`, `range()`, `complementOf()`
- **Sem Construtor Público**: Apenas métodos estáticos de criação
- **Não Aceita Null**: Lança `NullPointerException`
- **Ordem Natural**: Iteração segue ordinal das constantes
- **Serializable**: Pode ser serializado

## 🧠 Fundamentos Teóricos

### Representação Interna: Bit Vector

```java
public enum DiaSemana {
    SEG, TER, QUA, QUI, SEX, SAB, DOM
    //  0    1    2    3    4    5    6  (ordinais)
}

// EnumSet internamente usa bits:
// Bit:     6  5  4  3  2  1  0
// Enum:  DOM SAB SEX QUI QUA TER SEG

Set<DiaSemana> diasUteis = EnumSet.of(SEG, TER, QUA, QUI, SEX);
// Representação: 0b0011111 (bits 0-4 ativos)

Set<DiaSemana> fimSemana = EnumSet.of(SAB, DOM);
// Representação: 0b1100000 (bits 5-6 ativos)
```

**Operações Bitwise:**

```java
// União (OR): diasUteis | fimSemana
// 0b0011111 | 0b1100000 = 0b1111111 (todos os dias)

// Interseção (AND): diasUteis & fimSemana
// 0b0011111 & 0b1100000 = 0b0000000 (conjunto vazio)

// Complemento (NOT): ~diasUteis
// ~0b0011111 = 0b1100000 (fim de semana)
```

### Sintaxe Básica

```java
public enum Cor {
    VERMELHO, VERDE, AZUL, AMARELO, ROXO
}

// ========== CRIAÇÃO ==========

// 1. of() - conjunto com elementos específicos
Set<Cor> primarias = EnumSet.of(Cor.VERMELHO, Cor.VERDE, Cor.AZUL);

// 2. allOf() - todos os elementos do enum
Set<Cor> todas = EnumSet.allOf(Cor.class);
// {VERMELHO, VERDE, AZUL, AMARELO, ROXO}

// 3. noneOf() - conjunto vazio
Set<Cor> vazio = EnumSet.noneOf(Cor.class);
// {}

// 4. range() - intervalo de constantes (inclusive)
Set<Cor> primeirasQuatro = EnumSet.range(Cor.VERMELHO, Cor.AMARELO);
// {VERMELHO, VERDE, AZUL, AMARELO}

// 5. complementOf() - complemento de um conjunto
Set<Cor> naoPrimarias = EnumSet.complementOf(primarias);
// {AMARELO, ROXO}
```

## 🔍 Análise Conceitual Profunda

### Caso 1: Dias da Semana

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

public class Calendario {

    // Conjuntos pré-definidos
    private static final Set<DiaSemana> DIAS_UTEIS =
        EnumSet.range(DiaSemana.SEGUNDA, DiaSemana.SEXTA);

    private static final Set<DiaSemana> FIM_DE_SEMANA =
        EnumSet.of(DiaSemana.SABADO, DiaSemana.DOMINGO);

    private static final Set<DiaSemana> TODOS_OS_DIAS =
        EnumSet.allOf(DiaSemana.class);

    public boolean isDiaUtil(DiaSemana dia) {
        return DIAS_UTEIS.contains(dia);  // O(1)
    }

    public boolean isFimSemana(DiaSemana dia) {
        return FIM_DE_SEMANA.contains(dia);  // O(1)
    }

    public Set<DiaSemana> obterDiasAbertos(Set<DiaSemana> diasFechados) {
        // Complemento: todos os dias EXCETO os fechados
        Set<DiaSemana> abertos = EnumSet.allOf(DiaSemana.class);
        abertos.removeAll(diasFechados);
        return abertos;
    }

    // Ou usando complementOf
    public Set<DiaSemana> obterDiasAbertos2(Set<DiaSemana> diasFechados) {
        return EnumSet.complementOf((EnumSet<DiaSemana>) diasFechados);
    }
}

// Uso
Calendario cal = new Calendario();
System.out.println(cal.isDiaUtil(DiaSemana.SEGUNDA));  // true
System.out.println(cal.isFimSemana(DiaSemana.SABADO)); // true

Set<DiaSemana> fechados = EnumSet.of(DiaSemana.DOMINGO);
Set<DiaSemana> abertos = cal.obterDiasAbertos(fechados);
System.out.println(abertos);
// [SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO]
```

### Caso 2: Permissões e Flags

```java
public enum Permissao {
    LER, ESCREVER, EXECUTAR, DELETAR, COMPARTILHAR
}

public class Usuario {
    private String nome;
    private Set<Permissao> permissoes;

    public Usuario(String nome, Set<Permissao> permissoes) {
        this.nome = nome;
        this.permissoes = EnumSet.copyOf(permissoes);  // Cópia defensiva
    }

    public boolean temPermissao(Permissao p) {
        return permissoes.contains(p);
    }

    public boolean temTodasPermissoes(Permissao... ps) {
        return permissoes.containsAll(EnumSet.of(ps[0], ps));
    }

    public void concederPermissao(Permissao p) {
        permissoes.add(p);
    }

    public void revogarPermissao(Permissao p) {
        permissoes.remove(p);
    }

    public Set<Permissao> getPermissoes() {
        return EnumSet.copyOf(permissoes);  // Retorna cópia
    }
}

// Uso
Usuario admin = new Usuario("Admin", EnumSet.allOf(Permissao.class));
System.out.println(admin.temPermissao(Permissao.DELETAR));  // true

Usuario leitor = new Usuario("Leitor", EnumSet.of(Permissao.LER));
System.out.println(leitor.temPermissao(Permissao.ESCREVER)); // false

leitor.concederPermissao(Permissao.ESCREVER);
System.out.println(leitor.getPermissoes());
// [LER, ESCREVER]
```

### Caso 3: Operações de Conjunto

```java
public enum Recurso {
    CPU, MEMORIA, DISCO, REDE, GPU
}

public class GerenciadorRecursos {

    public Set<Recurso> obterRecursosDisponiveis(
        Set<Recurso> total,
        Set<Recurso> emUso
    ) {
        Set<Recurso> disponiveis = EnumSet.copyOf(total);
        disponiveis.removeAll(emUso);  // Diferença de conjuntos
        return disponiveis;
    }

    public Set<Recurso> obterRecursosComuns(
        Set<Recurso> processo1,
        Set<Recurso> processo2
    ) {
        Set<Recurso> comuns = EnumSet.copyOf(processo1);
        comuns.retainAll(processo2);  // Interseção
        return comuns;
    }

    public Set<Recurso> unirRecursos(
        Set<Recurso> conjunto1,
        Set<Recurso> conjunto2
    ) {
        Set<Recurso> uniao = EnumSet.copyOf(conjunto1);
        uniao.addAll(conjunto2);  // União
        return uniao;
    }
}

// Uso
Set<Recurso> total = EnumSet.allOf(Recurso.class);
Set<Recurso> emUso = EnumSet.of(Recurso.CPU, Recurso.MEMORIA);

GerenciadorRecursos ger = new GerenciadorRecursos();
Set<Recurso> disponiveis = ger.obterRecursosDisponiveis(total, emUso);
System.out.println(disponiveis);
// [DISCO, REDE, GPU]

Set<Recurso> proc1 = EnumSet.of(Recurso.CPU, Recurso.MEMORIA, Recurso.DISCO);
Set<Recurso> proc2 = EnumSet.of(Recurso.MEMORIA, Recurso.DISCO, Recurso.REDE);
Set<Recurso> comuns = ger.obterRecursosComuns(proc1, proc2);
System.out.println(comuns);
// [MEMORIA, DISCO]
```

## 🎯 Aplicabilidade e Contextos

### Quando Usar EnumSet

**Use quando:**

1. **Conjunto de Enums**: Precisa armazenar conjunto de valores enum
2. **Performance Crítica**: Operações de conjunto frequentes
3. **Flags e Permissões**: Múltiplos flags booleanos relacionados
4. **Operações de Conjunto**: União, interseção, complemento

### Vantagens sobre HashSet

```java
// ========== COMPARAÇÃO ==========

// HashSet<DiaSemana>
// - Memória: ~32 bytes por elemento + overhead
// - contains(): O(1) mas com hash + equals
// - Ordem: aleatória

// EnumSet<DiaSemana>
// - Memória: 1 bit por elemento (8 bits = 1 byte para 8 dias)
// - contains(): O(1) com operação bitwise simples
// - Ordem: natural (ordinal)

// Performance
Set<DiaSemana> hashSet = new HashSet<>();
Set<DiaSemana> enumSet = EnumSet.noneOf(DiaSemana.class);

// EnumSet é:
// - 10x+ mais rápido em operações
// - 50x+ mais eficiente em memória
```

## ⚠️ Limitações

### Limitação 1: Apenas Enums

```java
// ❌ ERRO: não funciona com classes normais
// Set<String> set = EnumSet.of("A", "B");  // ERRO!

// ✅ Apenas com enums
Set<DiaSemana> dias = EnumSet.of(DiaSemana.SEGUNDA);
```

### Limitação 2: Não Aceita Null

```java
Set<DiaSemana> dias = EnumSet.noneOf(DiaSemana.class);
// dias.add(null);  // ❌ NullPointerException
```

### Limitação 3: Não Thread-Safe

```java
// ❌ Não é thread-safe
Set<DiaSemana> dias = EnumSet.noneOf(DiaSemana.class);

// ✅ Sincronizar se necessário
Set<DiaSemana> diasSync = Collections.synchronizedSet(dias);
```

## 🔗 Interconexões Conceituais

**Relação com Set Interface**: EnumSet implementa Set completamente

**Relação com Bit Manipulation**: Usa operações bitwise internamente

**Relação com EnumMap**: Ambos otimizados para enums

## 🚀 Próximos Conceitos

**Criação e Performance do EnumSet**: Detalhes de factory methods e otimizações

**EnumMap**: Map otimizado com chaves enum

**Configurações e Flags**: Padrões de uso prático
