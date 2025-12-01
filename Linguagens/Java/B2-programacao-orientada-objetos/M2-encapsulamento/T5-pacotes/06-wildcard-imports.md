# T5.06 - Wildcard Imports (import pacote.*)

## Introdução

**Wildcard import** (`import pacote.*`) importa **todas as classes** de um pacote com uma única instrução.

**Sintaxe**:
```java
import java.util.*;
```

**Equivalente a**:
```java
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
// ... todas as classes de java.util
```

---

## Fundamentos

### 1. Sintaxe de Wildcard Import

**Padrão**:
```java
import pacote.*;
```

**Exemplo**:
```java
import java.util.*;
import java.io.*;
import java.time.*;

public class Exemplo {
    List<String> lista = new ArrayList<>();
    Map<Integer, String> mapa = new HashMap<>();
    LocalDate data = LocalDate.now();
}
```

### 2. O Que É Importado

**Wildcard (`*`) importa**:
- Todas as **classes** do pacote
- Todas as **interfaces** do pacote
- Todos os **enums** do pacote

**NÃO importa**:
- **Subpacotes** (pacotes aninhados)
- **Membros estáticos** (use `import static`)

```java
import java.util.*;

// ✅ Importa: List, ArrayList, Map, HashMap
// ❌ NÃO importa: java.util.concurrent.*, java.util.stream.*
```

### 3. Wildcard Não Importa Subpacotes

**Importante**: `import java.util.*` NÃO importa `java.util.concurrent.*`.

```java
import java.util.*;

List<String> lista = new ArrayList<>(); // ✅ OK

ConcurrentHashMap<String, String> mapa = new ConcurrentHashMap<>(); // ❌ ERRO
// Precisa: import java.util.concurrent.*;
```

**Para subpacotes**:
```java
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;
```

### 4. Performance em Compilação

**Mito**: Wildcard import deixa código lento.

**Realidade**: **Sem impacto em runtime**.
- Compilador resolve apenas classes **efetivamente usadas**
- Bytecode contém apenas classes necessárias
- Wildcard é **apenas conveniência de escrita**

```java
import java.util.*;

List<String> lista; // Compilador importa apenas List, não todas classes de java.util
```

### 5. Conflito de Nomes com Wildcard

**Problema**: Duas classes com mesmo nome em pacotes diferentes.

```java
import java.util.*;
import java.sql.*;

Date data = new Date(); // ERRO: Ambíguo (java.util.Date ou java.sql.Date?)
```

**Solução 1**: Import explícito de uma, FQN para outra
```java
import java.util.*;
import java.sql.*;
import java.util.Date; // Prioriza java.util.Date

Date dataUtil = new Date(); // java.util.Date
java.sql.Date dataSql = new java.sql.Date(System.currentTimeMillis()); // FQN
```

**Solução 2**: Remover wildcard, usar imports explícitos
```java
import java.util.List;
import java.util.ArrayList;
import java.sql.Connection;
import java.sql.Date;
```

### 6. Wildcard em Static Import

**Também funciona**:
```java
import static java.lang.Math.*;

double a = PI;
double b = sqrt(16);
double c = pow(2, 3);
```

**Cuidado**: Pode poluir namespace.

### 7. Ordem de Resolução

**Precedência**:
1. Classe no **mesmo pacote**
2. Import **explícito** (`import pacote.Classe`)
3. Import **wildcard** (`import pacote.*`)
4. Pacote `java.lang` (implícito)

```java
package br.com.empresa.modelo;

import java.util.*; // Wildcard

public class Exemplo {
    Produto produto; // 1. Procura no mesmo pacote (br.com.empresa.modelo.Produto)
    List lista;      // 2. Import wildcard (java.util.List)
    String texto;    // 3. java.lang (implícito)
}
```

### 8. Legibilidade vs Concisão

**Vantagem**: Menos linhas de código.

```java
// Wildcard (1 linha)
import java.util.*;

// Explícito (5 linhas)
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
```

**Desvantagem**: Origem das classes não óbvia.

```java
import java.util.*;
import java.io.*;
import java.nio.*;

BufferedReader reader; // De qual pacote? java.io
```

### 9. Convenções de Código

**Google Java Style Guide**: **Não usar wildcard**.

```java
// ❌ Evitar
import java.util.*;

// ✅ Preferir
import java.util.List;
import java.util.ArrayList;
```

**Exceção**: Muitas classes do mesmo pacote (mais de 5-10).

### 10. IDEs e Wildcard

**IntelliJ IDEA**: Converte para wildcard após **5 imports** do mesmo pacote (configurável).

**Eclipse**: Configurável (`Preferences → Java → Code Style → Organize Imports`).

**Organização automática**: `Ctrl + Alt + O` (IntelliJ), `Ctrl + Shift + O` (Eclipse).

---

## Aplicabilidade

**Use wildcard quando**:
- **Muitas classes** do mesmo pacote (5+)
- **Código descartável** (protótipos, testes rápidos)
- **Convenção da equipe** permite

**Evite wildcard quando**:
- **Código profissional** (preferir explícito)
- **Conflitos de nomes** possíveis
- **Legibilidade crítica** (APIs públicas)

---

## Armadilhas

### 1. Wildcard Não Importa Subpacotes

```java
import java.util.*;

// ❌ ERRO
ExecutorService executor = Executors.newFixedThreadPool(5);
// Precisa: import java.util.concurrent.*;
```

### 2. Conflito de Nomes

```java
import java.util.*;
import java.sql.*;

Date data = new Date(); // ERRO: Ambíguo
```

### 3. Poluir Namespace

```java
import java.util.*;
import java.io.*;
import java.nio.*;
import java.time.*;

// Dificulta rastrear origem das classes
```

### 4. Reduzir Clareza em Code Review

**Revisor não sabe quais classes são usadas** sem ler código completo.

---

## Boas Práticas

### 1. Prefira Imports Explícitos

```java
// ✅ Melhor (clareza)
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

// ❌ Evitar
import java.util.*;
```

### 2. Use Wildcard em Testes

```java
// ✅ Aceito em testes
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
```

### 3. Organize Imports com IDE

**IntelliJ**: `Ctrl + Alt + O`
**Eclipse**: `Ctrl + Shift + O`

Remove não usados, organiza ordem.

### 4. Configure Limite de Wildcard

**IntelliJ**: `Settings → Editor → Code Style → Java → Imports`
- Class count to use import with '*': 999 (nunca usar)
- Ou 5 (padrão)

### 5. Evite em Código Público

**Bibliotecas/frameworks**: Use imports explícitos (exemplo para usuários).

---

## Resumo

**Wildcard import (`import pacote.*`)**:

**Sintaxe**:
```java
import java.util.*;
```

**Importa**:
- Todas **classes**, **interfaces**, **enums** do pacote
- **NÃO** importa subpacotes

**Performance**: **Sem impacto** em runtime (compilador resolve apenas classes usadas)

**Conflitos**:
```java
import java.util.*;
import java.sql.*;

// Ambíguo
Date data; // ERRO

// Solução
import java.util.Date; // Import explícito
java.sql.Date dataSql; // FQN
```

**Convenções**:
- **Google Style**: Evitar wildcard
- **IntelliJ padrão**: Wildcard após 5 imports

**Vantagens**:
- Concisão (menos linhas)

**Desvantagens**:
- Reduz clareza
- Conflitos de nomes
- Dificulta rastreamento

**Regra de Ouro**: **Prefira imports explícitos** para clareza, use wildcard apenas quando **muitas classes do mesmo pacote** (5+) e **sem conflitos**.
