# T10.01 - Comparação com Operador Igual

## Introdução

**Operador `==`**: compara referências de objetos.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// ✅ Comparação com ==
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

if (s1 == s2) {
    System.out.println("São iguais"); // ✅ true
}
```

**Enums são singletons**: apenas uma instância de cada constante. **`==` é seguro e eficiente** para enums.

---

## Fundamentos

### 1. Singleton Garantido

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

// ✅ Sempre a mesma instância
Cor c1 = Cor.VERMELHO;
Cor c2 = Cor.VERMELHO;

System.out.println(c1 == c2);           // true
System.out.println(c1 == Cor.VERMELHO); // true
```

### 2. Comparação Simples

```java
public enum Status {
    ATIVO, INATIVO
}

Status status = Status.ATIVO;

// ✅ Comparação direta com ==
if (status == Status.ATIVO) {
    System.out.println("Ativo");
}

// ✅ Comparação com variável
Status outro = Status.ATIVO;
if (status == outro) {
    System.out.println("Iguais");
}
```

### 3. Null-Safety com ==

```java
public enum Prioridade {
    ALTA, MEDIA, BAIXA
}

Prioridade p = null;

// ⚠️ NullPointerException com equals()
// p.equals(Prioridade.ALTA); // NPE

// ✅ Seguro com ==
if (p == Prioridade.ALTA) {
    System.out.println("Alta");
}

// ✅ Retorna false (não lança exceção)
System.out.println(p == Prioridade.ALTA); // false
```

### 4. Performance

```java
public enum TipoUsuario {
    ADMIN, USUARIO, CONVIDADO
}

TipoUsuario tipo = TipoUsuario.ADMIN;

// ✅ == (mais rápido: comparação de referência)
if (tipo == TipoUsuario.ADMIN) { }

// ⚠️ equals() (mais lento: chamada de método)
if (tipo.equals(TipoUsuario.ADMIN)) { }
```

### 5. Comparação em Switch

```java
public enum Dia {
    SEGUNDA, TERCA, QUARTA
}

Dia dia = Dia.SEGUNDA;

// ✅ Switch usa == internamente
switch (dia) {
    case SEGUNDA:
        System.out.println("Segunda-feira");
        break;
    case TERCA:
        System.out.println("Terça-feira");
        break;
}
```

### 6. Comparação com Variável

```java
public enum Nivel {
    BASICO, INTERMEDIARIO, AVANCADO
}

Nivel nivel1 = Nivel.BASICO;
Nivel nivel2 = Nivel.BASICO;
Nivel nivel3 = Nivel.INTERMEDIARIO;

System.out.println(nivel1 == nivel2); // true
System.out.println(nivel1 == nivel3); // false
```

### 7. Comparação em Listas

```java
import java.util.List;
import java.util.ArrayList;

public enum Status {
    ATIVO, INATIVO
}

List<Status> lista = new ArrayList<>();
lista.add(Status.ATIVO);
lista.add(Status.INATIVO);

// ✅ Usar == no loop
for (Status s : lista) {
    if (s == Status.ATIVO) {
        System.out.println("Ativo encontrado");
    }
}
```

### 8. Comparação em Métodos

```java
public enum Tipo {
    A, B, C
}

// ✅ Método com ==
public boolean isA(Tipo tipo) {
    return tipo == Tipo.A;
}

// ✅ Uso
Tipo t = Tipo.A;
if (isA(t)) {
    System.out.println("É A");
}
```

### 9. Comparação com null

```java
public enum Estado {
    NOVO, EM_ANDAMENTO, CONCLUIDO
}

Estado e1 = null;
Estado e2 = Estado.NOVO;

// ✅ Comparação com null
System.out.println(e1 == null);         // true
System.out.println(e2 == null);         // false
System.out.println(e1 == Estado.NOVO);  // false

// ✅ Verificar null antes
if (e1 != null && e1 == Estado.NOVO) {
    System.out.println("É NOVO");
}
```

### 10. Comparação em Expressões

```java
public enum Resultado {
    SUCESSO, ERRO
}

Resultado resultado = Resultado.SUCESSO;

// ✅ Operador ternário
String mensagem = (resultado == Resultado.SUCESSO) 
    ? "OK" 
    : "Falha";

// ✅ Expressão booleana
boolean sucesso = resultado == Resultado.SUCESSO;

// ✅ Negação
if (resultado != Resultado.ERRO) {
    System.out.println("Não é erro");
}
```

---

## Aplicabilidade

**Use `==`** para:
- Comparação de enums (sempre)
- Performance (mais rápido)
- Null-safety (não lança NPE)
- Simplicidade (código limpo)

---

## Armadilhas

### 1. valueOf() Retorna Mesma Instância

```java
public enum Cor {
    VERMELHO, VERDE
}

// ✅ valueOf() retorna a mesma instância
Cor c1 = Cor.VERMELHO;
Cor c2 = Cor.valueOf("VERMELHO");

System.out.println(c1 == c2); // true
```

### 2. Enum de Diferentes Classes

```java
// ⚠️ Enums de classes diferentes
public enum Status1 { ATIVO }
public enum Status2 { ATIVO }

// ❌ Erro de compilação
// Status1 s1 = Status1.ATIVO;
// Status2 s2 = Status2.ATIVO;
// if (s1 == s2) { } // Incompatible types
```

### 3. Não Usar equals() Desnecessariamente

```java
public enum Tipo {
    A, B
}

Tipo t = Tipo.A;

// ⚠️ Desnecessário (usar ==)
if (t.equals(Tipo.A)) { }

// ✅ Preferir ==
if (t == Tipo.A) { }
```

---

## Boas Práticas

### 1. Sempre Use ==

```java
public enum Status {
    ATIVO, INATIVO
}

Status s = Status.ATIVO;

// ✅ Preferir ==
if (s == Status.ATIVO) { }
```

### 2. Verificar null Antes

```java
public enum Prioridade {
    ALTA, BAIXA
}

Prioridade p = null;

// ✅ Verificar null
if (p != null && p == Prioridade.ALTA) {
    System.out.println("Alta");
}
```

### 3. Usar em Switch

```java
public enum Dia {
    SEG, TER
}

Dia d = Dia.SEG;

// ✅ Switch (usa == internamente)
switch (d) {
    case SEG:
        break;
}
```

### 4. Comparação em Métodos

```java
public enum Nivel {
    BASICO, AVANCADO
}

// ✅ Método retorna boolean
public boolean isAvancado(Nivel nivel) {
    return nivel == Nivel.AVANCADO;
}
```

---

## Resumo

**Operador `==`** para enums:

```java
public enum Status {
    ATIVO, INATIVO
}

Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// ✅ Comparação com ==
System.out.println(s1 == s2);          // true
System.out.println(s1 == Status.ATIVO); // true

// ✅ Null-safe
Status s3 = null;
System.out.println(s3 == Status.ATIVO); // false (não lança NPE)

// ✅ Verificar null
if (s3 != null && s3 == Status.ATIVO) {
    System.out.println("Ativo");
}
```

**Vantagens**:

```java
// ✅ Mais rápido (comparação de referência)
if (s == Status.ATIVO) { }

// ✅ Null-safe (não lança NPE)
Status s = null;
if (s == Status.ATIVO) { } // false

// ✅ Simples e legível
if (s == Status.ATIVO) { }

// ✅ Singleton garantido
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;
System.out.println(s1 == s2); // true
```

**Regra de Ouro**: **Sempre use `==`** para comparar enums. **Mais rápido** (comparação de referência). **Null-safe** (não lança NullPointerException). **Simples** (código limpo). **Singleton garantido** (apenas uma instância de cada constante).
