# T2.07 - Enum em Coleções (Set, Map)

## Introdução

**Enums em coleções**: type-safe, otimizadas com `EnumSet` e `EnumMap`.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// List
List<Status> lista = Arrays.asList(Status.ATIVO, Status.INATIVO);

// EnumSet (otimizado)
Set<Status> set = EnumSet.of(Status.ATIVO, Status.PENDENTE);

// EnumMap (otimizado)
Map<Status, String> map = new EnumMap<>(Status.class);
map.put(Status.ATIVO, "Ativado");
```

**EnumSet/EnumMap**: mais eficientes que HashSet/HashMap.

---

## Fundamentos

### 1. List com Enum

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

List<Cor> cores = new ArrayList<>();
cores.add(Cor.VERMELHO);
cores.add(Cor.VERDE);

for (Cor c : cores) {
    System.out.println(c);
}
```

### 2. EnumSet Básico

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

// EnumSet otimizado
Set<DiaSemana> diasUteis = EnumSet.of(
    DiaSemana.SEGUNDA,
    DiaSemana.TERCA,
    DiaSemana.QUARTA,
    DiaSemana.QUINTA,
    DiaSemana.SEXTA
);

System.out.println(diasUteis.contains(DiaSemana.SABADO)); // false
```

### 3. EnumSet.allOf()

```java
// Todos os valores
Set<Status> todos = EnumSet.allOf(Status.class);
System.out.println(todos); // [ATIVO, INATIVO, PENDENTE]
```

### 4. EnumSet.noneOf()

```java
// Conjunto vazio
Set<Status> vazio = EnumSet.noneOf(Status.class);
System.out.println(vazio.isEmpty()); // true
```

### 5. EnumSet.range()

```java
public enum Mes {
    JAN, FEV, MAR, ABR, MAI, JUN, JUL, AGO, SET, OUT, NOV, DEZ
}

// Intervalo (JAN a MAR)
Set<Mes> primeiroTrimestre = EnumSet.range(Mes.JAN, Mes.MAR);
System.out.println(primeiroTrimestre); // [JAN, FEV, MAR]
```

### 6. EnumMap Básico

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

// EnumMap otimizado
Map<Prioridade, String> descricoes = new EnumMap<>(Prioridade.class);
descricoes.put(Prioridade.BAIXA, "Não urgente");
descricoes.put(Prioridade.MEDIA, "Normal");
descricoes.put(Prioridade.ALTA, "Urgente");

System.out.println(descricoes.get(Prioridade.ALTA)); // Urgente
```

### 7. EnumMap com Objetos

```java
public enum TipoUsuario {
    ADMIN, USER, GUEST
}

public class Permissoes {
    private Set<String> permissoes;
    // ...
}

Map<TipoUsuario, Permissoes> permissoesPorTipo = new EnumMap<>(TipoUsuario.class);
permissoesPorTipo.put(TipoUsuario.ADMIN, new Permissoes(/* ... */));
```

### 8. HashSet vs EnumSet (Performance)

```java
// ⚠️ HashSet (genérico)
Set<Status> hashSet = new HashSet<>();
hashSet.add(Status.ATIVO);

// ✅ EnumSet (otimizado, mais rápido)
Set<Status> enumSet = EnumSet.of(Status.ATIVO);

// EnumSet é ~10x mais rápido (bit vector)
```

### 9. HashMap vs EnumMap (Performance)

```java
// ⚠️ HashMap (genérico)
Map<Status, String> hashMap = new HashMap<>();
hashMap.put(Status.ATIVO, "Ativo");

// ✅ EnumMap (otimizado, mais rápido)
Map<Status, String> enumMap = new EnumMap<>(Status.class);
enumMap.put(Status.ATIVO, "Ativo");

// EnumMap é mais rápido (array interno)
```

### 10. Stream com Enum

```java
List<Status> lista = Arrays.asList(
    Status.ATIVO,
    Status.INATIVO,
    Status.ATIVO,
    Status.PENDENTE
);

// Filtrar e coletar em EnumSet
Set<Status> unicos = lista.stream()
    .filter(s -> s != Status.INATIVO)
    .collect(Collectors.toCollection(() -> EnumSet.noneOf(Status.class)));

System.out.println(unicos); // [ATIVO, PENDENTE]
```

---

## Aplicabilidade

**EnumSet**:
- Conjuntos de enums (mais eficiente que HashSet)
- Operações de conjuntos (união, interseção)
- Bit vector interno (compacto e rápido)

**EnumMap**:
- Mapeamento enum → valor (mais eficiente que HashMap)
- Array interno (ordem de declaração)
- Cache de dados por enum

---

## Armadilhas

### 1. EnumSet Vazio sem Classe

```java
// ❌ ERRO: cannot infer type
// Set<Status> set = EnumSet.noneOf();

// ✅ Passar classe
Set<Status> set = EnumSet.noneOf(Status.class);
```

### 2. EnumMap sem Classe

```java
// ❌ ERRO: constructor requires class
// Map<Status, String> map = new EnumMap<>();

// ✅ Passar classe
Map<Status, String> map = new EnumMap<>(Status.class);
```

### 3. Null em EnumSet

```java
Set<Status> set = EnumSet.of(Status.ATIVO);

// ❌ NullPointerException
// set.add(null);

// EnumSet não aceita null
```

---

## Boas Práticas

### 1. Preferir EnumSet

```java
// ✅ EnumSet (mais eficiente)
Set<Status> set = EnumSet.of(Status.ATIVO, Status.INATIVO);

// ⚠️ HashSet (menos eficiente)
Set<Status> set = new HashSet<>(Arrays.asList(Status.ATIVO, Status.INATIVO));
```

### 2. Preferir EnumMap

```java
// ✅ EnumMap (mais eficiente)
Map<Status, String> map = new EnumMap<>(Status.class);

// ⚠️ HashMap (menos eficiente)
Map<Status, String> map = new HashMap<>();
```

### 3. EnumSet para Flags

```java
public enum Permissao {
    LER, ESCREVER, EXECUTAR, DELETAR
}

public class Usuario {
    private Set<Permissao> permissoes = EnumSet.noneOf(Permissao.class);
    
    public void adicionarPermissao(Permissao p) {
        permissoes.add(p);
    }
    
    public boolean temPermissao(Permissao p) {
        return permissoes.contains(p);
    }
}

Usuario u = new Usuario();
u.adicionarPermissao(Permissao.LER);
u.adicionarPermissao(Permissao.ESCREVER);

System.out.println(u.temPermissao(Permissao.LER)); // true
```

### 4. EnumMap para Cache

```java
public enum TipoRelatorio {
    VENDAS, FINANCEIRO, ESTOQUE
}

// Cache de relatórios por tipo
private static final Map<TipoRelatorio, Relatorio> CACHE = new EnumMap<>(TipoRelatorio.class);

static {
    CACHE.put(TipoRelatorio.VENDAS, new RelatorioVendas());
    CACHE.put(TipoRelatorio.FINANCEIRO, new RelatorioFinanceiro());
    CACHE.put(TipoRelatorio.ESTOQUE, new RelatorioEstoque());
}

public Relatorio obterRelatorio(TipoRelatorio tipo) {
    return CACHE.get(tipo);
}
```

---

## Resumo

**Coleções com enum**:

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// List
List<Status> lista = Arrays.asList(Status.ATIVO, Status.INATIVO);

// EnumSet
Set<Status> set = EnumSet.of(Status.ATIVO, Status.PENDENTE);

// EnumMap
Map<Status, String> map = new EnumMap<>(Status.class);
map.put(Status.ATIVO, "Ativo");
```

**EnumSet métodos**:

```java
// Criar
EnumSet.of(Status.ATIVO, Status.INATIVO)
EnumSet.allOf(Status.class)         // Todos
EnumSet.noneOf(Status.class)        // Vazio
EnumSet.range(Mes.JAN, Mes.MAR)     // Intervalo

// Operações
set.add(Status.PENDENTE)
set.contains(Status.ATIVO)
set.remove(Status.INATIVO)
```

**Performance**:

| Coleção | Tipo | Performance | Uso |
|---------|------|-------------|-----|
| **EnumSet** | Otimizado | ✅ Mais rápido | ✅ Preferir |
| HashSet | Genérico | ⚠️ Mais lento | ⚠️ Evitar |
| **EnumMap** | Otimizado | ✅ Mais rápido | ✅ Preferir |
| HashMap | Genérico | ⚠️ Mais lento | ⚠️ Evitar |

**Características**:
- **EnumSet**: bit vector (compacto e rápido)
- **EnumMap**: array interno (ordem de declaração)
- Null não permitido
- Type-safe (apenas valores do enum)

**Regra de Ouro**: Use **EnumSet** para conjuntos de enum (mais eficiente que HashSet). Use **EnumMap** para mapear enum → valor (mais eficiente que HashMap). EnumSet usa **bit vector** (muito compacto). EnumMap usa **array** (ordem de declaração). Ambos **não aceitam null**. Sempre prefira EnumSet/EnumMap para enums.
