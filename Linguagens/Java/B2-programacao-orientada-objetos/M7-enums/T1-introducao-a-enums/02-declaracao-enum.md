# T1.02 - Declaração de Enum

## Introdução

**Declaração**: palavra-chave `enum` + nome + constantes.

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}
```

**Sintaxe**: `enum Nome { CONST1, CONST2, CONST3 }`

---

## Fundamentos

### 1. Sintaxe Básica

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}
```

### 2. Enum em Arquivo Próprio

```java
// Arquivo: Status.java
public enum Status {
    ATIVO, INATIVO
}
```

### 3. Enum Dentro de Classe

```java
public class Pedido {
    public enum Status {
        PENDENTE, PAGO, ENVIADO, ENTREGUE
    }
    
    private Status status;
}

Pedido.Status s = Pedido.Status.PENDENTE;
```

### 4. Múltiplos Enums no Mesmo Arquivo

```java
// Apenas um pode ser public
public enum Status {
    ATIVO, INATIVO
}

enum Prioridade {
    BAIXA, MEDIA, ALTA
}
```

### 5. Enum com Vírgula Final (Opcional)

```java
public enum Cor {
    VERMELHO,
    VERDE,
    AZUL, // Vírgula final OK
}
```

### 6. Enum Vazio (Inválido)

```java
// ❌ ERRO: enum precisa ao menos uma constante
// public enum Vazio { }
```

### 7. Convenção de Nomenclatura

```java
// ✅ Enum: PascalCase
public enum DiaSemana { }

// ✅ Constantes: MAIUSCULAS
public enum Status {
    ATIVO,           // ✅
    INATIVO,         // ✅
    EM_PROCESSAMENTO // ✅ Underscore para separar
}
```

### 8. Modificadores de Acesso

```java
// public = acessível de qualquer lugar
public enum Status {
    ATIVO, INATIVO
}

// package-private = apenas no pacote
enum Prioridade {
    BAIXA, ALTA
}

// ❌ ERRO: enum não pode ser private ou protected (top-level)
// private enum Erro { }
```

### 9. Enum com Ponto-e-Vírgula

```java
// ; opcional se não tem corpo
public enum Simples {
    A, B, C
}

// ; obrigatório se tem corpo
public enum ComCorpo {
    A, B, C; // ; obrigatório
    
    public void metodo() { }
}
```

### 10. Enum Genérico (Não Permitido)

```java
// ❌ ERRO: enum não pode ser genérico
// public enum MeuEnum<T> {
//     VALOR1, VALOR2
// }
```

---

## Aplicabilidade

**Declaração básica**: `enum Nome { CONST1, CONST2 }`  
**Arquivo próprio**: mais comum  
**Dentro de classe**: quando específico da classe  
**Nomenclatura**: PascalCase para enum, MAIUSCULAS para constantes

---

## Armadilhas

### 1. Esquecer Vírgulas Entre Constantes

```java
// ❌ ERRO
public enum Erro {
    A B C // Falta vírgula
}

// ✅
public enum Correto {
    A, B, C
}
```

### 2. Usar Minúsculas em Constantes

```java
// ❌ Má prática
public enum Status {
    ativo, inativo
}

// ✅ Convenção
public enum Status {
    ATIVO, INATIVO
}
```

### 3. Enum Vazio

```java
// ❌ ERRO
public enum Vazio { }
```

---

## Boas Práticas

### 1. Uma Constante por Linha (Legibilidade)

```java
// ✅ Mais legível
public enum DiaSemana {
    SEGUNDA,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO,
    DOMINGO
}
```

### 2. Vírgula Final para Facilitar Adições

```java
// ✅ Vírgula final
public enum Status {
    ATIVO,
    INATIVO, // Fácil adicionar novo
}
```

### 3. Documentar Enum

```java
/**
 * Status de um pedido no sistema.
 */
public enum StatusPedido {
    /** Pedido criado, aguardando pagamento */
    PENDENTE,
    
    /** Pagamento confirmado */
    PAGO,
    
    /** Pedido enviado */
    ENVIADO
}
```

---

## Resumo

**Sintaxe**: `enum Nome { CONST1, CONST2 }`

**Declaração**:
- Palavra-chave `enum`
- Nome em PascalCase
- Constantes em MAIUSCULAS
- Separadas por vírgulas
- `;` opcional (sem corpo)
- `;` obrigatório (com corpo)

**Onde declarar**:
- Arquivo próprio (mais comum)
- Dentro de classe (específico)
- Múltiplos no mesmo arquivo (um public)

**Regra de Ouro**: Enum = `enum Nome { CONST }`. Constantes em **MAIUSCULAS**, separadas por **vírgula**. `;` obrigatório se tiver corpo (métodos, atributos).
