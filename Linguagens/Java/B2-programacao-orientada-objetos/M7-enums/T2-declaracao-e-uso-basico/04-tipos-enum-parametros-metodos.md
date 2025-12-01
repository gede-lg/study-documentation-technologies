# T2.04 - Tipos Enum como Parâmetros de Métodos

## Introdução

**Enum como parâmetro**: type-safe, apenas valores válidos.

```java
public enum Status {
    ATIVO, INATIVO
}

public void processar(Status status) {
    // Apenas Status.ATIVO ou Status.INATIVO
}

processar(Status.ATIVO); // ✅
// processar(999);       // ❌ ERRO
```

**Type-safe**: compilador valida tipos.

---

## Fundamentos

### 1. Parâmetro Básico

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}

public void trabalhar(DiaSemana dia) {
    System.out.println("Trabalhando na " + dia);
}

trabalhar(DiaSemana.SEGUNDA); // ✅
```

### 2. Múltiplos Parâmetros

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

public enum Status {
    ATIVO, INATIVO
}

public void criarTarefa(String titulo, Prioridade prioridade, Status status) {
    // ...
}

criarTarefa("Tarefa 1", Prioridade.ALTA, Status.ATIVO);
```

### 3. Type-Safety

```java
public enum TipoPagamento {
    DINHEIRO, CARTAO, PIX
}

public void pagar(TipoPagamento tipo) {
    // Apenas valores válidos
}

pagar(TipoPagamento.PIX);  // ✅
// pagar("PIX");           // ❌ ERRO: incompatible types
// pagar(123);             // ❌ ERRO
```

### 4. vs Constantes int

```java
// ❌ int = não type-safe
public static final int TIPO_A = 1;
public static final int TIPO_B = 2;

public void processar(int tipo) {
    // Aceita qualquer int
}

processar(TIPO_A);  // ✅
processar(999);     // ✅ Compila (mas inválido)

// ✅ Enum = type-safe
public enum Tipo {
    A, B
}

public void processar(Tipo tipo) {
    // Apenas Tipo.A ou Tipo.B
}

processar(Tipo.A);  // ✅
// processar(999);  // ❌ ERRO
```

### 5. Switch no Método

```java
public enum Operacao {
    SOMA, SUBTRACAO, MULTIPLICACAO, DIVISAO
}

public int calcular(Operacao op, int a, int b) {
    return switch (op) {
        case SOMA -> a + b;
        case SUBTRACAO -> a - b;
        case MULTIPLICACAO -> a * b;
        case DIVISAO -> a / b;
    };
}

int resultado = calcular(Operacao.SOMA, 10, 5); // 15
```

### 6. Validação de Null

```java
public enum Status {
    ATIVO, INATIVO
}

public void processar(Status status) {
    if (status == null) {
        throw new IllegalArgumentException("Status não pode ser null");
    }
    
    // Processar
}

processar(null); // IllegalArgumentException
```

### 7. Parâmetro Opcional (Nullable)

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

public void criar(String titulo, Prioridade prioridade) {
    Prioridade p = (prioridade != null) ? prioridade : Prioridade.MEDIA;
    System.out.println("Criando com prioridade: " + p);
}

criar("Tarefa", Prioridade.ALTA);  // ALTA
criar("Tarefa", null);             // MEDIA (padrão)
```

### 8. Varargs com Enum

```java
public enum Permissao {
    LER, ESCREVER, EXECUTAR
}

public void definirPermissoes(Permissao... permissoes) {
    for (Permissao p : permissoes) {
        System.out.println("Permissão: " + p);
    }
}

definirPermissoes(Permissao.LER, Permissao.ESCREVER);
```

### 9. Métodos Sobrecarregados

```java
public enum Formato {
    JSON, XML, CSV
}

public void exportar(String dados) {
    exportar(dados, Formato.JSON); // Padrão
}

public void exportar(String dados, Formato formato) {
    System.out.println("Exportando como " + formato);
}

exportar("dados");                  // JSON (padrão)
exportar("dados", Formato.XML);     // XML
```

### 10. Parâmetro Genérico

```java
public <E extends Enum<E>> void imprimir(E valor) {
    System.out.println(valor.name() + " (ordinal: " + valor.ordinal() + ")");
}

imprimir(Status.ATIVO);
imprimir(DiaSemana.SEGUNDA);
```

---

## Aplicabilidade

**Enum como parâmetro**:
- Type-safety (apenas valores válidos)
- Autocomplete no IDE
- Refatoração segura
- Documentação clara

---

## Armadilhas

### 1. Null Não Validado

```java
public void processar(Status status) {
    // ❌ NullPointerException se status for null
    switch (status) {
        case ATIVO: break;
    }
}

// ✅ Validar null
public void processar(Status status) {
    Objects.requireNonNull(status, "Status não pode ser null");
    // ...
}
```

### 2. Passar Tipo Errado

```java
public enum TipoA { A1, A2 }
public enum TipoB { B1, B2 }

public void processar(TipoA tipo) { }

// ❌ ERRO: incompatible types
// processar(TipoB.B1);

// ✅ Tipo correto
processar(TipoA.A1);
```

### 3. Comparar com String

```java
public void processar(Status status) {
    // ❌ ERRO: incompatible types
    // if (status == "ATIVO") { }
    
    // ✅ Comparar com constante
    if (status == Status.ATIVO) { }
}
```

---

## Boas Práticas

### 1. Validar Null

```java
// ✅ Validar argumentos
public void processar(Status status) {
    Objects.requireNonNull(status, "Status obrigatório");
    // ...
}
```

### 2. Valor Padrão

```java
// ✅ Valor padrão se null
public void criar(Prioridade prioridade) {
    Prioridade p = (prioridade != null) ? prioridade : Prioridade.MEDIA;
    // ...
}
```

### 3. Documentar

```java
/**
 * Processa pedido com status específico.
 * 
 * @param status status do pedido (não pode ser null)
 * @throws NullPointerException se status for null
 */
public void processar(Status status) {
    // ...
}
```

### 4. Switch Exhaustivo

```java
// ✅ Cobrir todos os cases
public void processar(Status status) {
    switch (status) {
        case ATIVO -> ativar();
        case INATIVO -> desativar();
        case PENDENTE -> aguardar();
    }
}
```

---

## Resumo

**Enum como parâmetro**:

```java
public enum Status {
    ATIVO, INATIVO
}

public void processar(Status status) {
    System.out.println(status);
}

processar(Status.ATIVO); // ✅
```

**Vantagens**:

```java
// ✅ Type-safe
public void processar(Status status) { }

processar(Status.ATIVO);  // ✅
// processar(999);        // ❌ ERRO
// processar("ATIVO");    // ❌ ERRO

// ❌ int não é type-safe
public void processar(int tipo) { }

processar(1);    // ✅ Compila
processar(999);  // ✅ Compila (mas pode ser inválido)
```

**Exemplos**:

```java
// Parâmetro único
public void processar(Status status) { }

// Múltiplos parâmetros
public void criar(String nome, Prioridade prioridade, Status status) { }

// Varargs
public void definir(Permissao... permissoes) { }

// Com switch
public int calcular(Operacao op, int a, int b) {
    return switch (op) {
        case SOMA -> a + b;
        case SUBTRACAO -> a - b;
    };
}
```

**Regra de Ouro**: Use enum como parâmetro para **type-safety** (apenas valores válidos). Compilador valida tipos (vs int/String que aceitam qualquer valor). **Valide null** se necessário (`Objects.requireNonNull()`). Autocomplete ajuda. Switch exhaustivo cobre todos os cases. Enum > int/String para parâmetros.
