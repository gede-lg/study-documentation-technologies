# T10.06 - Desserialização Segura

## Introdução

**Desserialização**: converter bytes em objeto. **Segurança**: garantir que objeto desserializado é válido.

```java
import java.io.*;

public enum Status {
    ATIVO, INATIVO
}

// ✅ Desserializar
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("status.ser"))) {
    Status s = (Status) ois.readObject();
    System.out.println(s);
}
```

**Enum é seguro**: JVM garante singleton e valida constante.

---

## Fundamentos

### 1. Validação Automática

```java
import java.io.*;

public enum Tipo {
    A, B, C
}

// ✅ JVM valida automaticamente
// ✅ Se constante não existe, lança InvalidObjectException

// ✅ Serializar TIPO.A
Tipo t1 = Tipo.A;
// ... serializar

// ✅ Desserializar
Tipo t2 = (Tipo) ois.readObject();
System.out.println(t2); // A
```

### 2. Constante Inexistente

```java
import java.io.*;

// ⚠️ Enum versão 1
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// ✅ Serializar PENDENTE
Status s1 = Status.PENDENTE;
ByteArrayOutputStream baos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(baos);
oos.writeObject(s1);
oos.close();

// ⚠️ Enum versão 2 (PENDENTE removido)
public enum Status {
    ATIVO, INATIVO // PENDENTE removido
}

// ❌ Desserializar lança InvalidObjectException
try {
    ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
    ObjectInputStream ois = new ObjectInputStream(bais);
    Status s2 = (Status) ois.readObject(); // Erro
    ois.close();
} catch (InvalidObjectException e) {
    System.err.println("Constante inválida: " + e.getMessage());
}
```

### 3. Singleton Preservado

```java
import java.io.*;

public enum Singleton {
    INSTANCIA;
}

Singleton s1 = Singleton.INSTANCIA;

// ✅ Serializar
ByteArrayOutputStream baos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(baos);
oos.writeObject(s1);
oos.close();

// ✅ Desserializar
ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
ObjectInputStream ois = new ObjectInputStream(bais);
Singleton s2 = (Singleton) ois.readObject();
ois.close();

// ✅ Singleton preservado
System.out.println(s1 == s2); // true
```

### 4. Atributos Preservados

```java
import java.io.*;

public enum Prioridade {
    ALTA("Alta", 3),
    BAIXA("Baixa", 1);
    
    private final String nome;
    private final int valor;
    
    Prioridade(String nome, int valor) {
        this.nome = nome;
        this.valor = valor;
    }
    
    public String getNome() { return nome; }
    public int getValor() { return valor; }
}

// ✅ Serializar
Prioridade p1 = Prioridade.ALTA;
// ... serializar p1

// ✅ Desserializar
Prioridade p2 = (Prioridade) ois.readObject();

// ✅ Atributos preservados
System.out.println(p2.getNome());  // "Alta"
System.out.println(p2.getValor()); // 3
```

### 5. Exceção em Desserialização

```java
import java.io.*;

public enum Status {
    ATIVO, INATIVO
}

// ✅ Tratar exceções
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("status.ser"))) {
    Status s = (Status) ois.readObject();
    System.out.println(s);
} catch (InvalidObjectException e) {
    System.err.println("Constante inválida: " + e.getMessage());
} catch (IOException e) {
    System.err.println("Erro de I/O: " + e.getMessage());
} catch (ClassNotFoundException e) {
    System.err.println("Classe não encontrada: " + e.getMessage());
}
```

### 6. Desserialização em Collections

```java
import java.io.*;
import java.util.List;
import java.util.Arrays;

public enum Cor {
    VERMELHO, VERDE, AZUL
}

// ✅ Serializar lista
List<Cor> lista1 = Arrays.asList(Cor.VERMELHO, Cor.VERDE);
ByteArrayOutputStream baos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(baos);
oos.writeObject(lista1);
oos.close();

// ✅ Desserializar
ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
ObjectInputStream ois = new ObjectInputStream(bais);
@SuppressWarnings("unchecked")
List<Cor> lista2 = (List<Cor>) ois.readObject();
ois.close();

// ✅ Singleton preservado
System.out.println(lista1.get(0) == lista2.get(0)); // true
```

### 7. Validação de Tipo

```java
import java.io.*;

public enum Tipo {
    A, B
}

// ✅ Verificar tipo antes de cast
Object obj = ois.readObject();

if (obj instanceof Tipo) {
    Tipo t = (Tipo) obj;
    System.out.println(t);
} else {
    System.err.println("Tipo inválido");
}
```

### 8. Desserialização de Enum Genérico

```java
import java.io.*;

public <E extends Enum<E>> E desserializar(String arquivo, Class<E> enumClass) 
    throws IOException, ClassNotFoundException {
    
    try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(arquivo))) {
        Object obj = ois.readObject();
        
        if (enumClass.isInstance(obj)) {
            return enumClass.cast(obj);
        } else {
            throw new InvalidObjectException("Tipo inválido");
        }
    }
}

// ✅ Uso
public enum Status { ATIVO, INATIVO }

Status s = desserializar("status.ser", Status.class);
```

### 9. Proteção contra Ataques

```java
import java.io.*;

public enum Status {
    ATIVO, INATIVO
}

// ✅ Enum protegido contra:
// - Múltiplas instâncias (singleton garantido)
// - Constantes inválidas (InvalidObjectException)
// - Reflexão (construtor privado)

// ✅ Desserialização não cria nova instância
Status s1 = Status.ATIVO;
// ... serializar e desserializar
Status s2 = (Status) ois.readObject();

System.out.println(s1 == s2); // true (mesma instância)
```

### 10. Fallback para Constante Padrão

```java
import java.io.*;

public enum Status {
    ATIVO, INATIVO;
    
    // ✅ Método auxiliar para desserialização segura
    public static Status desserializarSeguro(ObjectInputStream ois) {
        try {
            return (Status) ois.readObject();
        } catch (InvalidObjectException e) {
            System.err.println("Constante inválida, usando padrão: ATIVO");
            return ATIVO; // ✅ Fallback
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Erro de desserialização: " + e.getMessage());
            return ATIVO; // ✅ Fallback
        }
    }
}

// ✅ Uso
Status s = Status.desserializarSeguro(ois);
```

---

## Aplicabilidade

**Desserialização segura** para:
- Validar constante
- Tratar exceções
- Preservar singleton
- Proteger contra ataques

---

## Armadilhas

### 1. Constante Removida

```java
// ⚠️ Enum versão 1
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// ✅ Serializar PENDENTE
// ... serializar

// ⚠️ Enum versão 2 (PENDENTE removido)
public enum Status {
    ATIVO, INATIVO
}

// ❌ Desserializar lança InvalidObjectException
// Status s = (Status) ois.readObject(); // Erro
```

### 2. Não Tratar Exceções

```java
// ❌ Não tratar exceções
Status s = (Status) ois.readObject(); // Pode lançar exceção

// ✅ Tratar exceções
try {
    Status s = (Status) ois.readObject();
} catch (InvalidObjectException e) {
    // Constante inválida
} catch (IOException | ClassNotFoundException e) {
    // Outros erros
}
```

### 3. Cast Sem Verificação

```java
// ⚠️ Cast direto (pode lançar ClassCastException)
Object obj = ois.readObject();
Status s = (Status) obj; // Risco

// ✅ Verificar instanceof
if (obj instanceof Status) {
    Status s = (Status) obj;
}
```

---

## Boas Práticas

### 1. Tratar Exceções

```java
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("status.ser"))) {
    Status s = (Status) ois.readObject();
} catch (InvalidObjectException e) {
    System.err.println("Constante inválida");
} catch (IOException | ClassNotFoundException e) {
    System.err.println("Erro de desserialização");
}
```

### 2. Verificar Tipo

```java
Object obj = ois.readObject();

if (obj instanceof Status) {
    Status s = (Status) obj;
}
```

### 3. Não Remover Constantes

```java
// ✅ Adicionar novas constantes (OK)
public enum Status {
    ATIVO, INATIVO, PENDENTE // ✅ Adicionar PENDENTE

// ❌ Remover constantes (quebra desserialização)
```

### 4. Fallback

```java
public static Status desserializarSeguro(ObjectInputStream ois) {
    try {
        return (Status) ois.readObject();
    } catch (Exception e) {
        return ATIVO; // ✅ Valor padrão
    }
}
```

---

## Resumo

**Desserialização segura**:

```java
import java.io.*;

public enum Status {
    ATIVO, INATIVO
}

// ✅ Desserializar com tratamento de exceções
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("status.ser"))) {
    Status s = (Status) ois.readObject();
    System.out.println(s);
} catch (InvalidObjectException e) {
    System.err.println("Constante inválida");
} catch (IOException | ClassNotFoundException e) {
    System.err.println("Erro de desserialização");
}
```

**Singleton preservado**:

```java
Status s1 = Status.ATIVO;
// ... serializar e desserializar
Status s2 = (Status) ois.readObject();

System.out.println(s1 == s2); // true
```

**Validação automática**:

```java
// ✅ JVM valida automaticamente
// ✅ Se constante não existe, lança InvalidObjectException
```

**Fallback**:

```java
public static Status desserializarSeguro(ObjectInputStream ois) {
    try {
        return (Status) ois.readObject();
    } catch (Exception e) {
        return ATIVO; // Valor padrão
    }
}
```

**Regra de Ouro**: **JVM valida constante** automaticamente. **Tratar exceções** (InvalidObjectException, IOException, ClassNotFoundException). **Singleton preservado** (mesma instância). **Não remover constantes** (quebra desserialização). **Verificar instanceof** antes de cast. **Fallback** para valor padrão.
