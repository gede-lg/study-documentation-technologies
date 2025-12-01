# T2.01 - Sintaxe: enum Dia { SEGUNDA, TERCA, ... }

## Introdução

**Sintaxe básica** de enum: palavra-chave `enum`, nome, e constantes.

```java
public enum Dia {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}
```

**Estrutura**:
- `enum` (palavra-chave)
- Nome do enum (PascalCase)
- Constantes separadas por vírgula (MAIUSCULAS)

---

## Fundamentos

### 1. Sintaxe Mínima

```java
// Enum mais simples possível
public enum Status {
    ATIVO, INATIVO
}
```

### 2. Múltiplas Constantes

```java
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

### 3. Vírgula Final Opcional

```java
public enum Cor {
    VERMELHO,
    VERDE,
    AZUL,  // ✅ Vírgula final opcional (recomendado)
}
```

### 4. Enum em Uma Linha

```java
public enum Resultado { SUCESSO, ERRO, PENDENTE }
```

### 5. Modificadores de Acesso

```java
// ✅ Public
public enum TipoPublico {
    A, B
}

// ✅ Package-private (sem modificador)
enum TipoPackage {
    A, B
}

// ❌ Private/Protected não permitido no nível de arquivo
// private enum TipoPrivate { }
```

### 6. Ponto-e-Vírgula Opcional

```java
// Sem corpo = ; opcional
public enum Simples {
    A, B, C
}

// Com corpo = ; obrigatório
public enum ComCorpo {
    A, B, C;  // ✅ ; obrigatório
    
    public void metodo() { }
}
```

### 7. Enum Vazio Inválido

```java
// ❌ ERRO: enum sem constantes
// public enum Vazio { }

// ✅ Mínimo 1 constante
public enum Minimo {
    UNICO
}
```

### 8. Constantes em Múltiplas Linhas

```java
public enum Mes {
    // Q1
    JANEIRO, FEVEREIRO, MARCO,
    
    // Q2
    ABRIL, MAIO, JUNHO,
    
    // Q3
    JULHO, AGOSTO, SETEMBRO,
    
    // Q4
    OUTUBRO, NOVEMBRO, DEZEMBRO
}
```

### 9. Nome Descritivo

```java
// ✅ Nome descritivo
public enum EstadoPedido {
    NOVO, PROCESSANDO, ENVIADO, ENTREGUE, CANCELADO
}

// ❌ Nome genérico
public enum E {
    A, B, C
}
```

### 10. Constantes Autoexplicativas

```java
// ✅ Constantes claras
public enum TipoUsuario {
    ADMINISTRADOR,
    USUARIO_COMUM,
    CONVIDADO
}

// ❌ Constantes obscuras
public enum T {
    A, U, C
}
```

---

## Aplicabilidade

**Sintaxe enum**:
```java
[modificador] enum NomeEnum {
    CONSTANTE1,
    CONSTANTE2,
    CONSTANTE3
}
```

**Usar quando**:
- Conjunto fixo de valores relacionados
- Dias da semana, meses, status, tipos

---

## Armadilhas

### 1. Enum Vazio

```java
// ❌ ERRO: enum sem constantes
// public enum Vazio { }
```

### 2. Esquecer Ponto-e-Vírgula

```java
public enum Erro {
    A, B, C  // ❌ Falta ; se tiver corpo
    
    void metodo() { }  // ERRO
}

// ✅ Com ;
public enum Correto {
    A, B, C;
    
    void metodo() { }
}
```

### 3. Nome em Minúsculas

```java
// ❌ Convenção: PascalCase
public enum status { 
    ATIVO, INATIVO
}

// ✅ PascalCase
public enum Status {
    ATIVO, INATIVO
}
```

---

## Boas Práticas

### 1. PascalCase para Nome

```java
// ✅ PascalCase
public enum DiaSemana { }
public enum TipoPagamento { }
```

### 2. MAIUSCULAS para Constantes

```java
// ✅ MAIUSCULAS
public enum Status {
    ATIVO,
    INATIVO,
    EM_PROCESSAMENTO
}
```

### 3. Vírgula Final

```java
// ✅ Facilita adicionar constantes
public enum Cor {
    VERMELHO,
    VERDE,
    AZUL,  // Vírgula final
}
```

### 4. Constantes Descritivas

```java
// ✅ Nomes claros
public enum PrioridadeTarefa {
    URGENTE,
    ALTA,
    MEDIA,
    BAIXA
}
```

---

## Resumo

**Sintaxe básica**:

```java
public enum NomeEnum {
    CONSTANTE1,
    CONSTANTE2,
    CONSTANTE3
}
```

**Exemplos**:

```java
// Dias da semana
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

// Status
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// Cores
public enum Cor {
    VERMELHO, VERDE, AZUL
}
```

**Elementos**:
- `enum` (palavra-chave)
- Nome (PascalCase)
- Constantes (MAIUSCULAS, separadas por vírgula)
- `;` opcional (sem corpo), obrigatório (com corpo)
- Vírgula final opcional (recomendado)

**Convenções**:
- Nome do enum: **PascalCase** (`DiaSemana`, `Status`)
- Constantes: **MAIUSCULAS** (`SEGUNDA`, `ATIVO`)
- Múltiplas palavras: **SNAKE_CASE** (`EM_PROCESSAMENTO`)

**Regra de Ouro**: Use `enum NomeEnum { CONST1, CONST2 }`. Nome em **PascalCase**, constantes em **MAIUSCULAS**. `;` obrigatório se tiver corpo (métodos/atributos). Vírgula final recomendada. Enum vazio inválido (mínimo 1 constante).
