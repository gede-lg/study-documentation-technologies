# T5.03 - Métodos Getter para Atributos

## Introdução

**Métodos getter**: acessam atributos privados de forma encapsulada.

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0);
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    // ✅ Getter público
    public String getDescricao() {
        return descricao;
    }
    
    public int getCodigo() {
        return codigo;
    }
}

System.out.println(Status.ATIVO.getDescricao()); // "Ativo"
System.out.println(Status.ATIVO.getCodigo()); // 1
```

**Getter**: método público que retorna valor do atributo.

---

## Fundamentos

### 1. Getter Básico

```java
public enum Cor {
    VERMELHO("#FF0000");
    
    private final String hex;
    
    Cor(String hex) {
        this.hex = hex;
    }
    
    public String getHex() {
        return hex;
    }
}

String hex = Cor.VERMELHO.getHex(); // "#FF0000"
```

### 2. Convenção JavaBean

```java
public enum Prioridade {
    ALTA(10);
    
    private final int nivel;
    private final boolean urgente;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
        this.urgente = nivel >= 8;
    }
    
    // get + Nome (PascalCase)
    public int getNivel() {
        return nivel;
    }
    
    // is + Nome (boolean)
    public boolean isUrgente() {
        return urgente;
    }
}
```

### 3. Múltiplos Getters

```java
public enum Moeda {
    REAL("BRL", "R$", 2);
    
    private final String codigo;
    private final String simbolo;
    private final int casasDecimais;
    
    Moeda(String codigo, String simbolo, int casasDecimais) {
        this.codigo = codigo;
        this.simbolo = simbolo;
        this.casasDecimais = casasDecimais;
    }
    
    public String getCodigo() { return codigo; }
    public String getSimbolo() { return simbolo; }
    public int getCasasDecimais() { return casasDecimais; }
}
```

### 4. Getter com Cópia Defensiva

```java
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever", "deletar"));
    
    private final List<String> acoes;
    
    Permissao(List<String> acoes) {
        this.acoes = new ArrayList<>(acoes);
    }
    
    // ✅ Retorna cópia (não referência direta)
    public List<String> getAcoes() {
        return new ArrayList<>(acoes);
    }
}

// Modificar retorno não afeta original
List<String> acoes = Permissao.ADMIN.getAcoes();
acoes.add("novo"); // não afeta Permissao.ADMIN
```

### 5. Getter com Collections.unmodifiableList()

```java
public enum Papel {
    ADMIN(Arrays.asList("ler", "escrever"));
    
    private final List<String> permissoes;
    
    Papel(List<String> permissoes) {
        this.permissoes = new ArrayList<>(permissoes);
    }
    
    // ✅ Retorna lista imutável
    public List<String> getPermissoes() {
        return Collections.unmodifiableList(permissoes);
    }
}

// ❌ Não pode modificar
List<String> perms = Papel.ADMIN.getPermissoes();
// perms.add("deletar"); // UnsupportedOperationException
```

### 6. Getter com Array

```java
public enum Turno {
    MANHA(new int[]{6, 12});
    
    private final int[] horarios;
    
    Turno(int[] horarios) {
        this.horarios = horarios.clone();
    }
    
    // ✅ Retorna clone (não referência)
    public int[] getHorarios() {
        return horarios.clone();
    }
}
```

### 7. Getter Calculado

```java
public enum Temperatura {
    FRIO(0, 15);
    
    private final int min;
    private final int max;
    
    Temperatura(int min, int max) {
        this.min = min;
        this.max = max;
    }
    
    public int getMin() { return min; }
    public int getMax() { return max; }
    
    // ✅ Getter calculado (não é atributo)
    public int getMedia() {
        return (min + max) / 2;
    }
    
    public String getDescricao() {
        return min + "°C - " + max + "°C";
    }
}
```

### 8. Getter com Formato

```java
public enum Produto {
    NOTEBOOK("Notebook", 3000.0);
    
    private final String nome;
    private final double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    public String getNome() {
        return nome;
    }
    
    public double getPreco() {
        return preco;
    }
    
    // ✅ Getter formatado
    public String getPrecoFormatado() {
        return String.format("R$ %.2f", preco);
    }
}
```

### 9. Getter com Transformação

```java
public enum Estado {
    SP("SP", "São Paulo");
    
    private final String sigla;
    private final String nome;
    
    Estado(String sigla, String nome) {
        this.sigla = sigla;
        this.nome = nome;
    }
    
    public String getSigla() {
        return sigla;
    }
    
    public String getNome() {
        return nome;
    }
    
    // ✅ Getter com transformação
    public String getNomeCompleto() {
        return sigla + " - " + nome;
    }
}
```

### 10. Getter Sem Setter

```java
public enum Config {
    INSTANCE;
    
    private final int timeout = 30;
    
    // ✅ Getter sem setter (imutável)
    public int getTimeout() {
        return timeout;
    }
    
    // ❌ Sem setter
    // public void setTimeout(int t) { }
}
```

---

## Aplicabilidade

**Métodos getter** para:
- Acessar atributos privados
- Encapsular dados
- Controlar acesso (cópia defensiva)
- Calcular valores derivados

---

## Armadilhas

### 1. Getter Retorna Referência Direta

```java
// ❌ Vazamento de referência
public List<String> getAcoes() {
    return acoes; // ❌ Retorna referência direta
}

// ⚠️ Pode modificar
Permissao.ADMIN.getAcoes().add("deletar");

// ✅ Retornar cópia ou unmodifiable
public List<String> getAcoes() {
    return new ArrayList<>(acoes);
}
```

### 2. Getter com Lógica Complexa

```java
// ⚠️ Evitar lógica complexa em getter
public String getDescricao() {
    // ⚠️ Lógica pesada
    carregarDoBanco();
    calcularEstatisticas();
    return descricao;
}

// ✅ Getter simples
public String getDescricao() {
    return descricao;
}
```

### 3. Getter sem Convenção

```java
// ⚠️ Nome não segue convenção
public String descricao() { // ⚠️ sem "get"
    return descricao;
}

// ✅ Convenção JavaBean
public String getDescricao() {
    return descricao;
}
```

---

## Boas Práticas

### 1. Convenção get/is

```java
// ✅ get + Nome (tipos não-boolean)
public String getNome() { return nome; }
public int getCodigo() { return codigo; }

// ✅ is + Nome (boolean)
public boolean isAtivo() { return ativo; }
public boolean temPermissao() { return permissao; }
```

### 2. Cópia Defensiva

```java
// ✅ Cópia para collections
public List<String> getAcoes() {
    return new ArrayList<>(acoes);
}

// ✅ Cópia para arrays
public int[] getHorarios() {
    return horarios.clone();
}
```

### 3. Collections.unmodifiable

```java
// ✅ Retornar imutável
public List<String> getPermissoes() {
    return Collections.unmodifiableList(permissoes);
}
```

### 4. Getter Simples

```java
// ✅ Getter apenas retorna valor
public String getCodigo() {
    return codigo; // simples e direto
}

// ❌ Evitar lógica complexa
public String getCodigo() {
    validar();
    calcular();
    return codigo;
}
```

---

## Resumo

**Métodos getter**:

```java
public enum Status {
    ATIVO("Ativo", 1);
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    // ✅ Getter público
    public String getDescricao() {
        return descricao;
    }
    
    public int getCodigo() {
        return codigo;
    }
}

Status.ATIVO.getDescricao(); // "Ativo"
```

**Convenção**:

```java
// String, int, double, etc.
public String getNome() { return nome; }
public int getCodigo() { return codigo; }

// boolean
public boolean isAtivo() { return ativo; }
public boolean hasPermissao() { return permissao; }
```

**Cópia defensiva**:

```java
// ✅ Collection
public List<String> getAcoes() {
    return new ArrayList<>(acoes);
}

// ✅ Array
public int[] getHorarios() {
    return horarios.clone();
}

// ✅ Unmodifiable
public List<String> getPermissoes() {
    return Collections.unmodifiableList(permissoes);
}
```

**Getter calculado**:

```java
// Não é atributo, calculado dinamicamente
public int getMedia() {
    return (min + max) / 2;
}

public String getDescricao() {
    return nome + " (" + codigo + ")";
}
```

**Regra de Ouro**: Getter **público** para acessar atributos **privados**. Convenção **get/is** (JavaBean). **Cópia defensiva** para collections/arrays. **Collections.unmodifiable** para imutabilidade. Getter **simples** (apenas retorna valor). Sem **setter** (enum imutável). Getter calculado para **valores derivados**.
