# T1.10 - Uso em Switch Statements

## Introdução

**Enum em switch**: sintaxe limpa e type-safe.

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

void processar(DiaSemana dia) {
    switch (dia) {
        case SEGUNDA:
        case TERCA:
        case QUARTA:
        case QUINTA:
        case SEXTA:
            System.out.println("Dia útil");
            break;
        case SABADO:
        case DOMINGO:
            System.out.println("Fim de semana");
            break;
    }
}
```

**Case sem qualificação**: não precisa `DiaSemana.SEGUNDA`.

---

## Fundamentos

### 1. Switch Básico

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

void processar(Status status) {
    switch (status) {
        case ATIVO:
            System.out.println("Ativo");
            break;
        case INATIVO:
            System.out.println("Inativo");
            break;
        case PENDENTE:
            System.out.println("Pendente");
            break;
    }
}
```

### 2. Case Sem Qualificação

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

void exibir(Cor cor) {
    switch (cor) {
        case VERMELHO: // ✅ Sem Cor.VERMELHO
            System.out.println("R");
            break;
        case VERDE:
            System.out.println("G");
            break;
        case AZUL:
            System.out.println("B");
            break;
    }
}
```

### 3. Default Case

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

void processar(Prioridade p) {
    switch (p) {
        case BAIXA:
            System.out.println("Baixa");
            break;
        case MEDIA:
            System.out.println("Média");
            break;
        default:
            System.out.println("Alta ou outro");
    }
}
```

### 4. Switch sem Break (Fall-Through)

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

void tipo(DiaSemana dia) {
    switch (dia) {
        case SEGUNDA:
        case TERCA:
        case QUARTA:
        case QUINTA:
        case SEXTA: // Fall-through
            System.out.println("Útil");
            break;
        case SABADO:
        case DOMINGO:
            System.out.println("Fim de semana");
            break;
    }
}
```

### 5. Switch Expression (Java 14+)

```java
public enum Operacao {
    SOMA, SUBTRACAO, MULTIPLICACAO, DIVISAO
}

int calcular(Operacao op, int a, int b) {
    return switch (op) {
        case SOMA -> a + b;
        case SUBTRACAO -> a - b;
        case MULTIPLICACAO -> a * b;
        case DIVISAO -> a / b;
    };
}

System.out.println(calcular(Operacao.SOMA, 10, 5)); // 15
```

### 6. Switch Expression com Blocos

```java
public enum TipoArquivo {
    IMAGEM, VIDEO, DOCUMENTO
}

String processar(TipoArquivo tipo) {
    return switch (tipo) {
        case IMAGEM -> {
            System.out.println("Processando imagem");
            yield "IMG";
        }
        case VIDEO -> {
            System.out.println("Processando vídeo");
            yield "VID";
        }
        case DOCUMENTO -> "DOC";
    };
}
```

### 7. Exhaustividade (Java 14+)

```java
public enum Resultado {
    SUCESSO, ERRO
}

// ✅ Switch expression exige todos os cases
String msg = switch (resultado) {
    case SUCESSO -> "OK";
    case ERRO -> "FALHA";
    // Sem default = ERRO se faltar case
};
```

### 8. Pattern Matching com Enum (Java 17+)

```java
public enum Forma {
    CIRCULO, QUADRADO, TRIANGULO
}

void desenhar(Object obj) {
    switch (obj) {
        case Forma f when f == Forma.CIRCULO:
            System.out.println("Círculo");
            break;
        case Forma f:
            System.out.println("Outra forma: " + f);
            break;
        default:
            System.out.println("Não é forma");
    }
}
```

### 9. Retornar de Switch

```java
public enum Mes {
    JANEIRO, FEVEREIRO, MARCO, ABRIL, MAIO, JUNHO,
    JULHO, AGOSTO, SETEMBRO, OUTUBRO, NOVEMBRO, DEZEMBRO
}

int getDias(Mes mes) {
    switch (mes) {
        case JANEIRO:
        case MARCO:
        case MAIO:
        case JULHO:
        case AGOSTO:
        case OUTUBRO:
        case DEZEMBRO:
            return 31;
        case ABRIL:
        case JUNHO:
        case SETEMBRO:
        case NOVEMBRO:
            return 30;
        case FEVEREIRO:
            return 28;
        default:
            return 0;
    }
}
```

### 10. Switch com Null (Java 17+)

```java
public enum Status {
    ATIVO, INATIVO
}

void processar(Status status) {
    switch (status) {
        case null -> System.out.println("Null");
        case ATIVO -> System.out.println("Ativo");
        case INATIVO -> System.out.println("Inativo");
    }
}
```

---

## Aplicabilidade

**Switch com enum**:
- Sintaxe limpa (case sem qualificação)
- Type-safe (apenas valores do enum)
- IDE avisa se falta case
- Switch expression (Java 14+)
- Exhaustividade garantida

---

## Armadilhas

### 1. Esquecer break

```java
switch (status) {
    case ATIVO:
        System.out.println("Ativo");
        // ❌ Esqueceu break
    case INATIVO:
        System.out.println("Inativo");
        break;
}
```

### 2. Usar Qualificação no Case

```java
switch (cor) {
    // ❌ ERRO: constant expression required
    // case Cor.VERMELHO: break;
    
    // ✅ Sem qualificação
    case VERMELHO: break;
}
```

### 3. Null sem Tratamento

```java
Status s = null;

switch (s) { // ❌ NullPointerException (Java < 17)
    case ATIVO: break;
}

// ✅ Verificar null
if (s != null) {
    switch (s) {
        case ATIVO: break;
    }
}
```

---

## Boas Práticas

### 1. Switch Expression (Java 14+)

```java
// ✅ Mais conciso
String msg = switch (status) {
    case ATIVO -> "ON";
    case INATIVO -> "OFF";
    case PENDENTE -> "WAIT";
};
```

### 2. Default para Casos Não Esperados

```java
// ✅ Default para segurança
switch (status) {
    case ATIVO: break;
    case INATIVO: break;
    default:
        throw new IllegalStateException("Status inesperado: " + status);
}
```

### 3. Agrupar Cases Relacionados

```java
// ✅ Agrupar dias úteis
switch (dia) {
    case SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA:
        trabalhar();
        break;
    case SABADO, DOMINGO:
        descansar();
        break;
}
```

### 4. Evitar Lógica Complexa

```java
// ❌ Lógica complexa
switch (status) {
    case ATIVO:
        // 50 linhas...
        break;
}

// ✅ Extrair para método
switch (status) {
    case ATIVO:
        processarAtivo();
        break;
}
```

---

## Resumo

**Switch com enum**:

```java
public enum Status {
    ATIVO, INATIVO
}

// Switch tradicional
switch (status) {
    case ATIVO:   // Sem qualificação
        break;
    case INATIVO:
        break;
}

// Switch expression (Java 14+)
String msg = switch (status) {
    case ATIVO -> "ON";
    case INATIVO -> "OFF";
};
```

**Características**:
- Case **sem qualificação** (`case ATIVO`, não `case Status.ATIVO`)
- Type-safe (apenas valores do enum)
- IDE avisa se falta case
- Switch expression (Java 14+) exige todos os cases
- Null case (Java 17+)

**Vantagens**:
- Sintaxe limpa
- Compilador detecta cases faltando
- Refatoração segura
- Exhaustividade garantida (switch expression)

**Versões**:
- **Java < 14**: Switch tradicional com break
- **Java 14+**: Switch expression (`->`, `yield`)
- **Java 17+**: Null case, pattern matching

**Regra de Ouro**: Use **switch** com enum para lógica baseada em valores. **Case sem qualificação** (`case ATIVO`, não `Status.ATIVO`). Prefira **switch expression** (Java 14+) para código conciso. IDE avisa se falta case. Sempre use **default** ou garanta **exhaustividade** (todos os cases).
