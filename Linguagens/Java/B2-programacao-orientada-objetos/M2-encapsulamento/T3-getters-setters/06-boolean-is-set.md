# T3.06 - Getters/Setters para Boolean: is/set

## Introdução e Definição

Atributos `boolean` seguem convenção **especial** de nomenclatura:
- **Getter**: `is` + NomeDoAtributo (não `get`)
- **Setter**: `set` + NomeDoAtributo (normal)

**Exemplo**:
```java
public class Usuario {
    private boolean ativo;
    private boolean admin;

    // ✅ Getter: is + Ativo
    public boolean isAtivo() {
        return ativo;
    }

    // ✅ Setter: set + Ativo
    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }
}
```

---

## Fundamentos

### 1. Convenção: `is` para Getters Boolean

```java
private boolean ativo;

// ✅ CORRETO
public boolean isAtivo() {
    return ativo;
}

// ❌ INCORRETO
public boolean getAtivo() {
    return ativo;
}
```

### 2. Setter Usa `set` Normalmente

```java
private boolean verificado;

public boolean isVerificado() {
    return verificado;
}

// ✅ Setter usa "set"
public void setVerificado(boolean verificado) {
    this.verificado = verificado;
}
```

### 3. Boolean Wrapper (Boolean)

`Boolean` (classe wrapper) pode usar `is` ou `get`:

```java
private Boolean ativo;

// ✅ OPÇÃO 1: is (preferido)
public Boolean isAtivo() {
    return ativo;
}

// ✅ OPÇÃO 2: get (aceito)
public Boolean getAtivo() {
    return ativo;
}

public void setAtivo(Boolean ativo) {
    this.ativo = ativo;
}
```

### 4. Atributos Iniciando com "is"

**Evite** atributos começando com "is":

```java
// ❌ RUIM: nome redundante
private boolean isAtivo;

public boolean isIsAtivo() {  // Confuso!
    return isAtivo;
}

// ✅ BOM: remova "is" do nome
private boolean ativo;

public boolean isAtivo() {
    return ativo;
}
```

### 5. Propriedades Negativas

Prefira **nomes positivos**:

```java
// ❌ EVITAR: dificulta leitura
private boolean inativo;

public boolean isInativo() {
    return inativo;
}

// ✅ MELHOR: nome positivo
private boolean ativo;

public boolean isAtivo() {
    return ativo;
}
```

### 6. Frameworks e Convenção

Frameworks (Jackson, Hibernate) reconhecem padrão `is`:

```java
public class Usuario {
    private boolean ativo;

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
}

// Jackson serializa como:
{"ativo": true}
```

### 7. Validação em Setters Boolean

```java
public class Conta {
    private boolean ativa;
    private LocalDateTime dataDesativacao;

    public void setAtiva(boolean ativa) {
        if (!ativa) {
            this.dataDesativacao = LocalDateTime.now();
        }
        this.ativa = ativa;
    }

    public boolean isAtiva() {
        return ativa;
    }
}
```

### 8. Getters Boolean com Lógica

```java
public class Usuario {
    private boolean ativo;
    private LocalDate dataExpiracao;

    public boolean isAtivo() {
        return ativo && !isExpirado();
    }

    private boolean isExpirado() {
        return dataExpiracao != null && 
               LocalDate.now().isAfter(dataExpiracao);
    }
}
```

### 9. Múltiplos Getters Boolean

```java
public class Produto {
    private boolean disponivel;
    private int estoque;
    private boolean ativo;

    public boolean isDisponivel() {
        return disponivel && estoque > 0 && ativo;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public boolean isEmEstoque() {
        return estoque > 0;
    }
}
```

### 10. Métodos Auxiliares vs Getters

```java
public class Pessoa {
    private LocalDate dataNascimento;

    // ✅ Getter (sem "is")
    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    // ✅ Método auxiliar boolean
    public boolean isMaiorDeIdade() {
        int idade = Period.between(dataNascimento, LocalDate.now()).getYears();
        return idade >= 18;
    }
}
```

---

## Aplicabilidade

**Use `is` para**:
- Propriedades `boolean` primitivas
- Propriedades `Boolean` wrapper (preferido)
- Estados binários (ativo/inativo, habilitado/desabilitado)

**Use nomes descritivos**:
- `isAtivo()`, `isAdmin()`, `isVerificado()`
- `isDisponivel()`, `isValido()`, `isCompleto()`

---

## Armadilhas

### 1. Usar `get` para Boolean

```java
// ❌ ERRADO
public boolean getAtivo() {
    return ativo;
}

// ✅ CORRETO
public boolean isAtivo() {
    return ativo;
}
```

### 2. Nome do Atributo com "is"

```java
// ❌ EVITAR
private boolean isAtivo;

// ✅ CORRETO
private boolean ativo;
```

### 3. Setter Retornando Valor

```java
// ❌ ERRADO
public boolean setAtivo(boolean ativo) {
    this.ativo = ativo;
    return ativo;
}

// ✅ CORRETO
public void setAtivo(boolean ativo) {
    this.ativo = ativo;
}
```

---

## Boas Práticas

### 1. Use `is` Consistentemente

```java
public class Config {
    private boolean debug;
    private boolean verbose;

    public boolean isDebug() { return debug; }
    public void setDebug(boolean debug) { this.debug = debug; }

    public boolean isVerbose() { return verbose; }
    public void setVerbose(boolean verbose) { this.verbose = verbose; }
}
```

### 2. Nomes Positivos

```java
// ✅ BOM
private boolean ativo;
public boolean isAtivo() { return ativo; }

// ❌ EVITAR
private boolean inativo;
public boolean isInativo() { return inativo; }
```

### 3. Documente Comportamento Complexo

```java
/**
 * Verifica se usuário está ativo.
 * Considera ativo se flag ativo=true E não expirado.
 * 
 * @return true se ativo e não expirado
 */
public boolean isAtivo() {
    return ativo && !isExpirado();
}
```

### 4. Valide em Setters

```java
public void setAdmin(boolean admin) {
    if (admin && !isAtivo()) {
        throw new IllegalStateException("Usuário inativo não pode ser admin");
    }
    this.admin = admin;
}
```

---

## Resumo

**Convenção Boolean**:
- Getter: `isNomeAtributo()`
- Setter: `setNomeAtributo(boolean)`

**Regras**:
- `boolean` primitivo: sempre `is`
- `Boolean` wrapper: preferir `is`
- Setter: sempre `set`
- Nomes positivos (ativo vs inativo)
- Evite "is" no nome do atributo

**Exemplos**:
```java
private boolean ativo;
public boolean isAtivo() { return ativo; }
public void setAtivo(boolean ativo) { this.ativo = ativo; }
```

**Frameworks** reconhecem e usam convenção `is` automaticamente.
