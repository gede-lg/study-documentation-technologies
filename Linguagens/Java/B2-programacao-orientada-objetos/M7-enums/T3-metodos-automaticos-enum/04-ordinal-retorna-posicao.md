# T3.04 - ordinal(): Retorna Posição (Índice)

## Introdução

**ordinal()**: retorna posição (índice) da constante na declaração.

```java
public enum Status {
    ATIVO,    // ordinal = 0
    INATIVO,  // ordinal = 1
    PENDENTE  // ordinal = 2
}

Status s = Status.ATIVO;
System.out.println(s.ordinal()); // 0
```

**Zero-based**: primeira constante = 0.

---

## Fundamentos

### 1. Posição Básica

```java
public enum Cor {
    VERMELHO,  // 0
    VERDE,     // 1
    AZUL       // 2
}

System.out.println(Cor.VERMELHO.ordinal()); // 0
System.out.println(Cor.VERDE.ordinal());    // 1
System.out.println(Cor.AZUL.ordinal());     // 2
```

### 2. Ordem de Declaração

```java
public enum DiaSemana {
    SEGUNDA,   // 0
    TERCA,     // 1
    QUARTA,    // 2
    QUINTA,    // 3
    SEXTA,     // 4
    SABADO,    // 5
    DOMINGO    // 6
}

DiaSemana dia = DiaSemana.DOMINGO;
System.out.println(dia.ordinal()); // 6
```

### 3. ordinal() é Final

```java
// ❌ ERRO: cannot override final method
public enum Status {
    ATIVO;
    
    // @Override
    // public int ordinal() {
    //     return 999;
    // }
}
```

### 4. Comparação por Ordinal

```java
Status s1 = Status.ATIVO;    // ordinal = 0
Status s2 = Status.INATIVO;  // ordinal = 1

if (s1.ordinal() < s2.ordinal()) {
    System.out.println("s1 vem antes de s2");
}
```

### 5. Acesso por Índice

```java
Status[] valores = Status.values();

for (int i = 0; i < valores.length; i++) {
    Status s = valores[i];
    System.out.println(s.name() + " = " + s.ordinal());
}

// ATIVO = 0
// INATIVO = 1
// PENDENTE = 2
```

### 6. Switch com Ordinal

```java
Status s = Status.INATIVO;

switch (s.ordinal()) {
    case 0: // ATIVO
        System.out.println("Ativo");
        break;
    case 1: // INATIVO
        System.out.println("Inativo");
        break;
}

// ⚠️ Frágil: ordem pode mudar
```

### 7. Array Indexado por Ordinal

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

String[] descricoes = {
    "Não urgente",    // BAIXA (ordinal 0)
    "Normal",         // MEDIA (ordinal 1)
    "Urgente"         // ALTA (ordinal 2)
};

Prioridade p = Prioridade.ALTA;
System.out.println(descricoes[p.ordinal()]); // "Urgente"
```

### 8. ordinal() vs compareTo()

```java
Status s1 = Status.ATIVO;   // 0
Status s2 = Status.PENDENTE; // 2

// ordinal() retorna índice
System.out.println(s1.ordinal()); // 0

// compareTo() compara ordinais
System.out.println(s1.compareTo(s2)); // -2 (0 - 2)
```

### 9. Mutabilidade da Ordem

```java
// ⚠️ Adicionar constante muda ordinais
public enum Status {
    NOVO,      // ordinal mudou de N/A para 0
    ATIVO,     // ordinal mudou de 0 para 1
    INATIVO,   // ordinal mudou de 1 para 2
    PENDENTE   // ordinal mudou de 2 para 3
}

// ❌ Código dependente de ordinal pode quebrar
```

### 10. Persistência de Ordinal

```java
// ❌ NUNCA persista ordinal no banco
public void salvar(Status status) {
    // int ordinal = status.ordinal(); // ❌ Frágil
    // database.save(ordinal);
    
    // ✅ Persista name()
    String nome = status.name();
    database.save(nome);
}
```

---

## Aplicabilidade

**ordinal()** para:
- Índice em arrays paralelos (uso limitado)
- Debugging/logging
- Comparação de ordem

**NÃO use** para:
- Persistência (banco de dados)
- Lógica de negócio
- Valores externos

---

## Armadilhas

### 1. Dependência de Ordem

```java
// ❌ Frágil: adicionar constante quebra código
switch (status.ordinal()) {
    case 0: // ATIVO
        break;
    case 1: // INATIVO
        break;
}

// ✅ Switch com enum diretamente
switch (status) {
    case ATIVO:
        break;
    case INATIVO:
        break;
}
```

### 2. Persistir Ordinal

```java
// ❌ NUNCA persista ordinal
database.save(status.ordinal()); // 0, 1, 2...

// ✅ Persista name()
database.save(status.name()); // "ATIVO", "INATIVO"...
```

### 3. Comparação Direta

```java
// ⚠️ Comparar ordinal (frágil)
if (status.ordinal() == 0) { } // Assume ATIVO = 0

// ✅ Comparar constante
if (status == Status.ATIVO) { }
```

---

## Boas Práticas

### 1. Evitar Lógica com ordinal()

```java
// ❌ Lógica baseada em ordinal
if (prioridade.ordinal() > 1) {
    // Alta prioridade
}

// ✅ Lógica baseada em atributo
public enum Prioridade {
    BAIXA(1), MEDIA(2), ALTA(3);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    public int getNivel() {
        return nivel;
    }
}

if (prioridade.getNivel() > 2) { }
```

### 2. Usar EnumMap em vez de Array

```java
// ⚠️ Array indexado por ordinal
String[] descricoes = new String[Status.values().length];
descricoes[Status.ATIVO.ordinal()] = "Ativo";

// ✅ EnumMap
Map<Status, String> descricoes = new EnumMap<>(Status.class);
descricoes.put(Status.ATIVO, "Ativo");
```

### 3. ordinal() para Debugging

```java
// ✅ Logging/debugging
logger.debug("Status: {} (ordinal: {})", status.name(), status.ordinal());
```

### 4. Persistir name(), Não ordinal()

```java
// ✅ Salvar name()
public void salvar(Status status) {
    String nome = status.name();
    database.save(nome);
}

// ✅ Recuperar com valueOf()
public Status carregar() {
    String nome = database.load();
    return Status.valueOf(nome);
}
```

---

## Resumo

**ordinal()**:

```java
public enum Status {
    ATIVO,    // ordinal = 0
    INATIVO,  // ordinal = 1
    PENDENTE  // ordinal = 2
}

Status s = Status.INATIVO;
System.out.println(s.ordinal()); // 1
```

**Características**:
- Retorna **índice** da constante (zero-based)
- **Final** (não pode sobrescrever)
- Baseado em **ordem de declaração**
- Muda se ordem mudar

**Ordem**:

```java
DiaSemana.SEGUNDA.ordinal()  // 0
DiaSemana.TERCA.ordinal()    // 1
DiaSemana.QUARTA.ordinal()   // 2
```

**❌ NÃO USE para**:

```java
// ❌ Persistência
database.save(status.ordinal()); // Frágil!

// ❌ Switch
switch (status.ordinal()) { } // Frágil!

// ❌ Lógica de negócio
if (prioridade.ordinal() > 1) { } // Frágil!
```

**✅ USE para**:

```java
// ✅ Debugging
logger.debug("ordinal: " + status.ordinal());

// ✅ compareTo() (internamente usa ordinal)
status1.compareTo(status2)

// ✅ Índice em array (uso limitado)
String[] arr = {"Desc1", "Desc2"};
arr[status.ordinal()]
```

**Regra de Ouro**: `ordinal()` retorna **índice** (0, 1, 2...) baseado em ordem de declaração. **NUNCA** use para persistência, switch ou lógica de negócio (frágil se ordem mudar). Use `name()` para persistir. Use `compareTo()` para comparar ordem. ordinal() é **final** e muda se adicionar/remover constantes.
