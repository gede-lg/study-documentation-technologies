# T1.08 - Comparação com == (Segura)

## Introdução

**Enum**: comparação com `==` é segura e recomendada.

```java
public enum Status {
    ATIVO, INATIVO
}

Status s = Status.ATIVO;

if (s == Status.ATIVO) { // ✅ Usa ==
    System.out.println("Ativo");
}
```

**== vs equals()**: `==` é mais rápido e seguro para enums.

---

## Fundamentos

### 1. Comparação com ==

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor cor = Cor.VERMELHO;

if (cor == Cor.VERMELHO) { // ✅ Usa ==
    System.out.println("Vermelho");
}
```

### 2. Singleton por Constante

```java
public enum DiaSemana {
    SEGUNDA, TERCA
}

DiaSemana dia1 = DiaSemana.SEGUNDA;
DiaSemana dia2 = DiaSemana.SEGUNDA;

System.out.println(dia1 == dia2); // true (mesma instância)
```

### 3. == é Mais Rápido

```java
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// ✅ == (comparação de referência - rápido)
if (s1 == s2) { }

// ⚠️ equals() funciona, mas desnecessário
if (s1.equals(s2)) { }
```

### 4. == é Null-Safe com Cuidado

```java
Status s = null;

// ⚠️ == precisa verificar null
if (s == Status.ATIVO) { // false (s é null)
    // ...
}

// ❌ equals() lança NullPointerException
// if (s.equals(Status.ATIVO)) { } // NPE!

// ✅ equals() com ordem invertida
if (Status.ATIVO.equals(s)) { // false (sem NPE)
    // ...
}
```

### 5. Comparação com !=

```java
Status s = Status.INATIVO;

if (s != Status.ATIVO) { // ✅
    System.out.println("Não ativo");
}
```

### 6. vs Constantes String

```java
// ❌ String = precisa equals()
String cor = "VERMELHO";
if (cor.equals("VERMELHO")) { } // equals()

// ✅ Enum = usa ==
Cor cor = Cor.VERMELHO;
if (cor == Cor.VERMELHO) { } // ==
```

### 7. Switch com ==

```java
public enum Direcao {
    NORTE, SUL, LESTE, OESTE
}

void processar(Direcao dir) {
    // Internamente usa ==
    switch (dir) {
        case NORTE: break;
        case SUL: break;
    }
}
```

### 8. Ternário com ==

```java
Status s = Status.ATIVO;

String msg = (s == Status.ATIVO) ? "Ativo" : "Inativo";
System.out.println(msg); // Ativo
```

### 9. Métodos Úteis

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

Prioridade p = Prioridade.ALTA;

// == para comparação
System.out.println(p == Prioridade.ALTA); // true

// equals() também funciona
System.out.println(p.equals(Prioridade.ALTA)); // true

// compareTo() para ordem
System.out.println(p.compareTo(Prioridade.BAIXA)); // > 0
```

### 10. Performance

```java
// == é O(1) (comparação de referência)
// equals() é O(1) para enums, mas tem overhead de chamada

// Benchmark (1 milhão de comparações):
// == : ~5ms
// equals() : ~15ms

// ✅ Preferir ==
if (status == Status.ATIVO) { }
```

---

## Aplicabilidade

**Usar == quando**:
- Comparar valores de enum
- Performance importante
- Código simples e direto

**Usar equals() quando**:
- Valor pode ser null (ordem invertida)
- Consistência com outras comparações

---

## Armadilhas

### 1. NullPointerException com equals()

```java
Status s = null;

// ❌ NPE
// if (s.equals(Status.ATIVO)) { }

// ✅ Verificar null primeiro
if (s != null && s.equals(Status.ATIVO)) { }

// ✅ Ou usar ==
if (s == Status.ATIVO) { } // false (sem NPE)
```

### 2. Comparar com String

```java
Status s = Status.ATIVO;

// ❌ ERRO: incompatible types
// if (s == "ATIVO") { }

// ✅ Comparar com constante
if (s == Status.ATIVO) { }

// ⚠️ Converter String para enum
if (s == Status.valueOf("ATIVO")) { }
```

### 3. Confundir com int

```java
// ❌ int não pode usar ==
String s1 = new String("test");
String s2 = new String("test");
System.out.println(s1 == s2); // false (instâncias diferentes)

// ✅ Enum sempre usa ==
Status st1 = Status.ATIVO;
Status st2 = Status.ATIVO;
System.out.println(st1 == st2); // true (mesma instância)
```

---

## Boas Práticas

### 1. Preferir ==

```java
// ✅ Mais rápido e simples
if (status == Status.ATIVO) { }
```

### 2. Verificar null Antes de equals()

```java
Status s = obterStatus();

// ✅ null-safe
if (s != null && s == Status.ATIVO) { }

// ✅ Ou inverter ordem com equals()
if (Status.ATIVO.equals(s)) { }
```

### 3. Usar Switch

```java
// ✅ Switch usa == internamente
switch (status) {
    case ATIVO: break;
    case INATIVO: break;
}
```

### 4. Ternário Conciso

```java
// ✅ Ternário com ==
String msg = (s == Status.ATIVO) ? "ON" : "OFF";
```

---

## Resumo

**Enum**: comparar com `==` (seguro e rápido).

```java
Status s = Status.ATIVO;

if (s == Status.ATIVO) { } // ✅ ==
if (s.equals(Status.ATIVO)) { } // ⚠️ funciona mas desnecessário
```

**== vs equals()**:
| Aspecto | == | equals() |
|---------|-----|----------|
| Performance | ✅ Mais rápido | ⚠️ Mais lento |
| Simplicidade | ✅ Simples | ⚠️ Verboso |
| Null | ⚠️ false | ❌ NPE |
| Recomendado | ✅ Sim | ⚠️ Desnecessário |

**Por que == funciona**:
- Cada constante = singleton (instância única)
- Mesma constante = mesma referência
- `==` compara referências
- Sempre mesma instância = `==` sempre funciona

**Null-safety**:
```java
Status s = null;

s == Status.ATIVO           // false (sem NPE)
Status.ATIVO.equals(s)      // false (sem NPE)
s.equals(Status.ATIVO)      // NPE!
```

**Performance**:
- `==` é O(1) direto
- `equals()` tem overhead de chamada
- Para enums, `==` é preferível

**Regra de Ouro**: Use `==` para comparar enums (mais rápido e simples). Cada constante é **singleton** (instância única), então `==` compara referências corretamente. `equals()` funciona mas é desnecessário. Cuidado com **null** - `==` retorna `false`, `equals()` lança NPE.
