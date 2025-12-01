# T10.05 - Serialização: Singleton Garantido

## Introdução

**Serialização**: converter objeto em bytes. **Desserialização**: converter bytes em objeto.

```java
import java.io.Serializable;

public enum Status implements Serializable {
    ATIVO, INATIVO
}

// ✅ Enum é Serializable automaticamente
```

**Singleton garantido**: desserialização retorna a mesma instância.

---

## Fundamentos

### 1. Enum é Serializable

```java
import java.io.*;

public enum Cor implements Serializable {
    VERMELHO, VERDE, AZUL
}

// ✅ Serializar
Cor cor = Cor.VERMELHO;

try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("cor.ser"))) {
    oos.writeObject(cor);
}

// ✅ Desserializar
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("cor.ser"))) {
    Cor corDeserializada = (Cor) ois.readObject();
    System.out.println(corDeserializada); // VERMELHO
}
```

### 2. Singleton Garantido

```java
import java.io.*;

public enum Status {
    ATIVO
}

Status s1 = Status.ATIVO;

// ✅ Serializar
ByteArrayOutputStream baos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(baos);
oos.writeObject(s1);
oos.close();

// ✅ Desserializar
ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
ObjectInputStream ois = new ObjectInputStream(bais);
Status s2 = (Status) ois.readObject();
ois.close();

// ✅ Mesma instância (singleton)
System.out.println(s1 == s2); // true
```

### 3. Serialização com Atributos

```java
import java.io.*;

public enum Prioridade implements Serializable {
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

ByteArrayOutputStream baos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(baos);
oos.writeObject(p1);
oos.close();

// ✅ Desserializar
ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
ObjectInputStream ois = new ObjectInputStream(bais);
Prioridade p2 = (Prioridade) ois.readObject();
ois.close();

// ✅ Mesma instância e atributos preservados
System.out.println(p1 == p2);            // true
System.out.println(p2.getNome());        // "Alta"
System.out.println(p2.getValor());       // 3
```

### 4. Serialização em Coleções

```java
import java.io.*;
import java.util.List;
import java.util.Arrays;

public enum Tipo {
    A, B, C
}

// ✅ Serializar lista de enums
List<Tipo> lista1 = Arrays.asList(Tipo.A, Tipo.B);

ByteArrayOutputStream baos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(baos);
oos.writeObject(lista1);
oos.close();

// ✅ Desserializar
ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
ObjectInputStream ois = new ObjectInputStream(bais);
@SuppressWarnings("unchecked")
List<Tipo> lista2 = (List<Tipo>) ois.readObject();
ois.close();

// ✅ Mesmas instâncias
System.out.println(lista1.get(0) == lista2.get(0)); // true
```

### 5. serialVersionUID (Opcional)

```java
import java.io.Serializable;

public enum Status implements Serializable {
    ATIVO, INATIVO;
    
    // ⚠️ Opcional (enum tem mecanismo próprio)
    private static final long serialVersionUID = 1L;
}

// ✅ Enum não precisa de serialVersionUID
// ✅ Serialização usa nome da constante
```

### 6. Desserialização com valueOf()

```java
import java.io.*;

public enum Cor {
    VERMELHO, VERDE
}

// ✅ Internamente, desserialização usa valueOf()
// ✅ Enum.valueOf(Cor.class, "VERMELHO")

// ✅ Sempre retorna mesma instância
Cor c1 = Cor.VERMELHO;
Cor c2 = Cor.valueOf("VERMELHO");

System.out.println(c1 == c2); // true
```

### 7. Serialização com ObjectMapper (JSON)

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public enum Status {
    ATIVO, INATIVO
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializar para JSON
Status s1 = Status.ATIVO;
String json = mapper.writeValueAsString(s1);
System.out.println(json); // "ATIVO"

// ✅ Desserializar de JSON
Status s2 = mapper.readValue(json, Status.class);
System.out.println(s1 == s2); // true (mesma instância)
```

### 8. Enum em Map Serializable

```java
import java.io.*;
import java.util.HashMap;
import java.util.Map;

public enum Tipo {
    A, B
}

// ✅ Map com enum como chave
Map<Tipo, String> map1 = new HashMap<>();
map1.put(Tipo.A, "Valor A");

// ✅ Serializar
ByteArrayOutputStream baos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(baos);
oos.writeObject(map1);
oos.close();

// ✅ Desserializar
ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
ObjectInputStream ois = new ObjectInputStream(bais);
@SuppressWarnings("unchecked")
Map<Tipo, String> map2 = (Map<Tipo, String>) ois.readObject();
ois.close();

// ✅ Chave é mesma instância
System.out.println(map1.keySet().iterator().next() == 
                   map2.keySet().iterator().next()); // true
```

### 9. Proteção contra Instanciação

```java
import java.io.*;

public enum Singleton {
    INSTANCIA;
    
    private String dados = "Dados importantes";
    
    public String getDados() {
        return dados;
    }
}

// ✅ Singleton pattern
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

// ✅ Mesma instância (singleton preservado)
System.out.println(s1 == s2); // true
```

### 10. Serialização Customizada (readResolve)

```java
import java.io.*;

public enum Status implements Serializable {
    ATIVO, INATIVO;
    
    // ⚠️ Enum não precisa de readResolve()
    // ✅ JVM já garante singleton
    
    // ❌ Não implementar (desnecessário)
    // private Object readResolve() {
    //     return valueOf(name());
    // }
}

// ✅ Enum já tem proteção contra múltiplas instâncias
```

---

## Aplicabilidade

**Serialização** para:
- Persistência em arquivo
- Transferência via rede
- Cache
- Singleton pattern

---

## Armadilhas

### 1. Constante Removida

```java
// ⚠️ Enum versão 1
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// ✅ Serializar PENDENTE
Status s1 = Status.PENDENTE;
// ... serializar s1

// ⚠️ Enum versão 2 (PENDENTE removido)
public enum Status {
    ATIVO, INATIVO
}

// ❌ Desserializar lança InvalidObjectException
// Status s2 = (Status) ois.readObject(); // Erro
```

### 2. Atributos Transient

```java
import java.io.Serializable;

public enum Tipo implements Serializable {
    A("Valor");
    
    // ⚠️ transient não é necessário (enum serializa apenas nome)
    private final transient String valor;
    
    Tipo(String valor) {
        this.valor = valor;
    }
}

// ✅ Atributos final são serializados automaticamente
```

### 3. Não Implementar readResolve()

```java
public enum Status {
    ATIVO;
    
    // ❌ Desnecessário (enum já garante singleton)
    // private Object readResolve() {
    //     return valueOf(name());
    // }
}

// ✅ Enum já protege singleton automaticamente
```

---

## Boas Práticas

### 1. Enum é Serializable por Padrão

```java
// ✅ Não precisa declarar implements Serializable
public enum Status {
    ATIVO, INATIVO
}
```

### 2. Singleton Automático

```java
// ✅ Desserialização retorna mesma instância
Status s1 = Status.ATIVO;
// ... serializar e desserializar
Status s2 = (Status) ois.readObject();
System.out.println(s1 == s2); // true
```

### 3. Evitar Remover Constantes

```java
// ✅ Não remover constantes (quebra desserialização)
public enum Status {
    ATIVO, INATIVO, PENDENTE // ✅ Manter todas
}
```

### 4. Atributos final

```java
public enum Tipo {
    A("Valor");
    
    // ✅ Atributos final são serializados
    private final String valor;
    
    Tipo(String valor) {
        this.valor = valor;
    }
}
```

---

## Resumo

**Serialização**:

```java
import java.io.*;

public enum Status {
    ATIVO, INATIVO
}

// ✅ Serializar
Status s1 = Status.ATIVO;
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("status.ser"));
oos.writeObject(s1);
oos.close();

// ✅ Desserializar
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("status.ser"));
Status s2 = (Status) ois.readObject();
ois.close();

// ✅ Singleton garantido
System.out.println(s1 == s2); // true
```

**Singleton pattern**:

```java
public enum Singleton {
    INSTANCIA;
}

// ✅ Serialização preserva singleton
Singleton s1 = Singleton.INSTANCIA;
// ... serializar e desserializar
Singleton s2 = (Singleton) ois.readObject();
System.out.println(s1 == s2); // true
```

**Regra de Ouro**: **Enum é Serializable** automaticamente. **Singleton garantido** (desserialização retorna mesma instância). **Não precisa de readResolve()** (JVM protege). **Não remover constantes** (quebra desserialização). **Atributos final** são serializados.
