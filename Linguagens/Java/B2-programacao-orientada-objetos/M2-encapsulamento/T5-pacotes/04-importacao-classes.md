# T5.04 - Importação de Classes (import)

## Introdução

**Importação** (`import`) permite usar classes de outros pacotes sem **nome totalmente qualificado** (FQN).

**Sem import**:
```java
br.com.empresa.ecommerce.modelo.Produto produto = new br.com.empresa.ecommerce.modelo.Produto();
```

**Com import**:
```java
import br.com.empresa.ecommerce.modelo.Produto;
Produto produto = new Produto();
```

---

## Fundamentos

### 1. Sintaxe de Import

**Estrutura**:
```java
import pacote.Classe;
```

**Exemplo**:
```java
package br.com.empresa.ecommerce.service;

import br.com.empresa.ecommerce.modelo.Produto;
import java.util.List;
import java.time.LocalDate;

public class ProdutoService {
    public List<Produto> listar() {
        // ...
    }
}
```

### 2. Posição no Arquivo

**Ordem**:
```java
// 1. Package
package br.com.empresa.ecommerce.service;

// 2. Imports
import br.com.empresa.ecommerce.modelo.Produto;
import java.util.List;

// 3. Classe
public class ProdutoService {}
```

**❌ Erro**: Import antes de package
```java
import java.util.List;
package br.com.empresa; // ERRO
```

### 3. Múltiplas Importações

**Lista de imports**:
```java
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDate;
import java.time.LocalDateTime;
```

**Organização**: Agrupar por pacote (IDEs fazem automaticamente).

### 4. Import Não Importa Subpacotes

**Importante**: `import pacote.*` NÃO importa subpacotes.

```java
import java.util.*;

// Importa: List, ArrayList, Map, HashMap, etc.
// NÃO importa: java.util.concurrent.*, java.util.stream.*
```

**Para subpacotes**:
```java
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;
```

### 5. Conflito de Nomes (Classes com Mesmo Nome)

**Problema**: Duas classes com mesmo nome em pacotes diferentes.

```java
import java.util.Date;
import java.sql.Date; // ERRO: conflito
```

**Solução 1**: Importar apenas uma, usar FQN para outra
```java
import java.util.Date;

public class Exemplo {
    Date dataUtil = new Date();
    java.sql.Date dataSql = new java.sql.Date(System.currentTimeMillis());
}
```

**Solução 2**: Usar FQN para ambas
```java
// Sem imports

public class Exemplo {
    java.util.Date dataUtil = new java.util.Date();
    java.sql.Date dataSql = new java.sql.Date(System.currentTimeMillis());
}
```

### 6. Pacote java.lang Importado Automaticamente

**Importação implícita**: Classes de `java.lang` não precisam de import.

```java
// ✅ Sem import necessário
String texto = "Olá";
Integer numero = 10;
System.out.println("Teste");
Object obj = new Object();
```

**Classes em java.lang**:
- String, Integer, Double, Boolean, Character
- Object, Class, System, Math
- Exception, RuntimeException, Error

### 7. Import de Classes do Mesmo Pacote

**Não necessário**: Classes no **mesmo pacote** não precisam de import.

```java
// Ambas no pacote: br.com.empresa.ecommerce.modelo
package br.com.empresa.ecommerce.modelo;

public class Produto {
    private Categoria categoria; // ✅ Sem import (mesmo pacote)
}

// Categoria.java (mesmo pacote)
package br.com.empresa.ecommerce.modelo;
public class Categoria {}
```

### 8. Ordem de Imports (Convenção)

**Padrão Google Java Style**:
1. Imports estáticos
2. `java.*`
3. `javax.*`
4. Outros pacotes (ordem alfabética)

```java
import static org.junit.Assert.*;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServlet;

import com.google.common.base.Strings;

import br.com.empresa.ecommerce.modelo.Produto;
```

**IDEs organizam automaticamente**: IntelliJ, Eclipse, VS Code.

### 9. Import e Generics

**Genéricos não afetam import**:

```java
import java.util.List;

List<String> lista1;
List<Integer> lista2;
// Apenas 1 import necessário
```

### 10. Import Apenas de Classes Públicas

**Regra**: Só pode importar classes **públicas** (`public class`).

```java
// Pacote: br.com.empresa.ecommerce.modelo
package br.com.empresa.ecommerce.modelo;

class ValidadorCPF {} // package-private

// Outro pacote
package br.com.empresa.ecommerce.service;

import br.com.empresa.ecommerce.modelo.ValidadorCPF; // ERRO: não visível
```

**Solução**: Tornar classe pública ou acessar indiretamente.

---

## Aplicabilidade

**Use import quando**:
- Usar classes de **outros pacotes**
- Evitar **FQN repetitivo**
- Melhorar **legibilidade**

**Não use import quando**:
- Classes do **mesmo pacote**
- Classes de **java.lang**
- **Conflito de nomes** (usar FQN)

---

## Armadilhas

### 1. Import Antes de Package

```java
// ❌ Errado
import java.util.List;
package br.com.empresa;

// ✅ Correto
package br.com.empresa;
import java.util.List;
```

### 2. Import Não Usado

**IDEs alertam**: Imports não utilizados.

```java
import java.util.List; // ⚠️ Não usado
import java.util.Map;

public class Exemplo {
    Map<String, String> mapa; // Apenas Map usado
}
```

**Solução**: Remover imports desnecessários (IDE faz automaticamente).

### 3. Confundir Import com Include (C/C++)

**Java**: Import **não copia código**, apenas permite usar nome curto.

```java
import java.util.List;
// Não insere código de List.class no arquivo
// Apenas permite escrever "List" em vez de "java.util.List"
```

### 4. Import de Subpacotes

```java
import java.util.*;

// ❌ NÃO importa java.util.concurrent.*
// ✅ Apenas java.util (classes diretas)
```

---

## Boas Práticas

### 1. Imports Explícitos (Evitar Wildcard *)

```java
// ✅ Preferir
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

// ❌ Evitar (exceto muitas classes do mesmo pacote)
import java.util.*;
```

**Razão**: Clareza sobre quais classes são usadas.

### 2. Organizar Imports (IDE)

**IntelliJ**: `Ctrl + Alt + O`
**Eclipse**: `Ctrl + Shift + O`
**VS Code**: Organiza automaticamente

### 3. Remover Imports Não Utilizados

**IDEs alertam e removem** imports não usados.

### 4. Usar FQN em Conflitos

```java
import java.util.Date;

java.sql.Date dataSql; // FQN para evitar conflito
```

### 5. Agrupar Imports Por Pacote

```java
// Agrupar
import java.io.IOException;
import java.io.FileReader;

import java.util.List;
import java.util.ArrayList;
```

---

## Resumo

**Import permite usar nome curto**:

**Sintaxe**:
```java
import pacote.Classe;
```

**Exemplo**:
```java
package br.com.empresa.ecommerce.service;

import br.com.empresa.ecommerce.modelo.Produto;
import java.util.List;

public class ProdutoService {
    List<Produto> produtos;
}
```

**Regras**:
- **Posição**: Após package, antes da classe
- **Múltiplos**: Vários imports possíveis
- **java.lang**: Importado automaticamente
- **Mesmo pacote**: Não precisa import
- **Conflitos**: Usar FQN

**Conflito de nomes**:
```java
import java.util.Date;

java.sql.Date dataSql; // FQN
```

**Organização**:
1. Imports estáticos
2. `java.*`, `javax.*`
3. Outros pacotes

**Regra de Ouro**: Use **imports explícitos** para clareza, evite wildcard `*` exceto quando necessário.
