# T5.02 - Método toString()

## Introdução

**toString()** retorna **representação textual** do objeto.

**Definido em Object**, deve ser **sobrescrito** para fornecer informação útil.

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    // ❌ Sem sobrescrita: toString() de Object
    // pessoa.toString() → "Pessoa@15db9742"
    
    // ✅ Com sobrescrita
    @Override
    public String toString() {
        return "Pessoa[nome=" + nome + ", idade=" + idade + "]";
    }
}

// Uso
Pessoa p = new Pessoa("João", 30);
System.out.println(p); // "Pessoa[nome=João, idade=30]"
```

---

## Fundamentos

### 1. Assinatura de toString()

```java
public class Object {
    public String toString() {
        return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }
}
```

**Padrão**: `NomeDaClasse@enderecoHex`

### 2. toString() Padrão (Object)

**Sem sobrescrita**, retorna classe + hashCode.

```java
public class Carro {
    private String marca;
}

Carro c = new Carro();
System.out.println(c.toString()); // "Carro@15db9742"
System.out.println(c);            // "Carro@15db9742" (chama toString())
```

### 3. Sobrescrita de toString()

**Fornecer informação útil** sobre o objeto.

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    @Override
    public String toString() {
        return "Pessoa[nome=" + nome + ", idade=" + idade + "]";
    }
}

Pessoa p = new Pessoa("Maria", 25);
System.out.println(p); // "Pessoa[nome=Maria, idade=25]"
```

### 4. println() Chama toString() Automaticamente

```java
Pessoa p = new Pessoa("João", 30);

// Equivalente
System.out.println(p.toString());
System.out.println(p); // Chama toString() implicitamente
```

### 5. Concatenação com String

**Concatenação** chama toString() automaticamente.

```java
Pessoa p = new Pessoa("Ana", 28);

String msg = "Dados: " + p; // Chama p.toString()
// msg = "Dados: Pessoa[nome=Ana, idade=28]"
```

### 6. Formato Recomendado

**Padrão comum**: `Classe[atributo1=valor1, atributo2=valor2]`

```java
@Override
public String toString() {
    return "Pessoa[nome=" + nome + ", idade=" + idade + ", cpf=" + cpf + "]";
}
```

### 7. toString() com Atributos Nulos

**Tratar null** para evitar NullPointerException.

```java
public class Pessoa {
    private String nome;
    private String email; // Pode ser null
    
    @Override
    public String toString() {
        return "Pessoa[nome=" + nome + ", email=" + (email != null ? email : "N/A") + "]";
    }
}
```

### 8. StringBuilder Para Performance

**Múltiplas concatenações**: use StringBuilder.

```java
@Override
public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("Pessoa[");
    sb.append("nome=").append(nome);
    sb.append(", idade=").append(idade);
    sb.append(", cpf=").append(cpf);
    sb.append("]");
    return sb.toString();
}
```

### 9. toString() em Collections

**Collections** usam toString() dos elementos.

```java
List<Pessoa> pessoas = new ArrayList<>();
pessoas.add(new Pessoa("João", 30));
pessoas.add(new Pessoa("Maria", 25));

System.out.println(pessoas);
// [Pessoa[nome=João, idade=30], Pessoa[nome=Maria, idade=25]]
```

### 10. toString() vs Getters

**toString()** para **debug/log**, **não** para lógica de negócio.

```java
// ❌ Não use toString() para obter dados
String nome = pessoa.toString().split("=")[1]; // Péssimo

// ✅ Use getter
String nome = pessoa.getNome();
```

---

## Aplicabilidade

**toString() é útil para**:
- **Debugging** (imprimir estado do objeto)
- **Logging** (registrar informações)
- **Testes** (comparar saída esperada)
- **Mensagens de erro**

**NÃO use para**:
- Lógica de negócio
- Serialização (use JSON, XML)
- Comparação (use equals())

---

## Armadilhas

### 1. Não Sobrescrever toString()

```java
public class Carro {
    private String marca;
}

Carro c = new Carro();
System.out.println(c); // "Carro@15db9742" ❌ Pouco útil
```

### 2. toString() com Recursão Infinita

```java
public class Pessoa {
    private Pessoa amigo;
    
    @Override
    public String toString() {
        return "Pessoa[amigo=" + amigo + "]"; // ❌ Recursão infinita
    }
}

Pessoa p1 = new Pessoa();
Pessoa p2 = new Pessoa();
p1.amigo = p2;
p2.amigo = p1;

System.out.println(p1); // StackOverflowError
```

**Solução**: Verificar referência circular.

```java
@Override
public String toString() {
    return "Pessoa[amigo=" + (amigo != null ? amigo.getNome() : "null") + "]";
}
```

### 3. toString() Expor Informações Sensíveis

```java
public class Usuario {
    private String senha;
    
    // ❌ Expõe senha
    @Override
    public String toString() {
        return "Usuario[senha=" + senha + "]";
    }
}

Usuario u = new Usuario();
System.out.println(u); // Senha visível em log
```

**Solução**: Ocultar dados sensíveis.

```java
@Override
public String toString() {
    return "Usuario[senha=***]";
}
```

### 4. Múltiplas Concatenações Sem StringBuilder

```java
// ❌ Ineficiente (muitas concatenações)
@Override
public String toString() {
    String s = "Pessoa[";
    s = s + "nome=" + nome;
    s = s + ", idade=" + idade;
    s = s + ", cpf=" + cpf;
    s = s + "]";
    return s;
}

// ✅ Eficiente
@Override
public String toString() {
    return "Pessoa[nome=" + nome + ", idade=" + idade + ", cpf=" + cpf + "]";
}
// OU
StringBuilder sb = new StringBuilder();
// ...
```

---

## Boas Práticas

### 1. Sempre Sobrescreva toString()

```java
@Override
public String toString() {
    return "MinhaClasse[atributo1=" + atributo1 + ", atributo2=" + atributo2 + "]";
}
```

### 2. Inclua Todos os Atributos Relevantes

```java
@Override
public String toString() {
    return "Pessoa[nome=" + nome + ", idade=" + idade + ", cpf=" + cpf + "]";
}
```

### 3. Use Formato Consistente

```java
// Padrão: Classe[atributo=valor, ...]
return "Pessoa[nome=" + nome + ", idade=" + idade + "]";
```

### 4. Oculte Dados Sensíveis

```java
@Override
public String toString() {
    return "Usuario[username=" + username + ", senha=***]";
}
```

### 5. Use IDE Para Gerar toString()

**IntelliJ IDEA**: `Alt+Insert` → `toString()`

**Eclipse**: `Source` → `Generate toString()`

```java
// Gerado automaticamente
@Override
public String toString() {
    return "Pessoa{" +
           "nome='" + nome + '\'' +
           ", idade=" + idade +
           '}';
}
```

### 6. Use Objects.toString() Para null-safety

```java
import java.util.Objects;

@Override
public String toString() {
    return "Pessoa[nome=" + Objects.toString(nome, "N/A") + "]";
}
```

### 7. Evite Referências Circulares

```java
@Override
public String toString() {
    return "Pessoa[nome=" + nome + ", amigo=" + (amigo != null ? amigo.getNome() : "null") + "]";
}
```

### 8. Use String.format() Para Clareza

```java
@Override
public String toString() {
    return String.format("Pessoa[nome=%s, idade=%d, cpf=%s]", nome, idade, cpf);
}
```

### 9. toString() em Hierarquia

```java
public class Animal {
    protected String nome;
    
    @Override
    public String toString() {
        return "Animal[nome=" + nome + "]";
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    @Override
    public String toString() {
        return "Cachorro[nome=" + nome + ", raca=" + raca + "]";
    }
}
```

### 10. Use Text Blocks (Java 15+) Para Formato Complexo

```java
@Override
public String toString() {
    return """
           Pessoa {
               nome: %s,
               idade: %d,
               cpf: %s
           }
           """.formatted(nome, idade, cpf);
}
```

---

## Resumo

**toString()**:
```java
@Override
public String toString() {
    return "Classe[atributo1=" + atributo1 + ", atributo2=" + atributo2 + "]";
}
```

**Padrão de Object**:
```java
// Sem sobrescrita
obj.toString(); // "Classe@15db9742"
```

**Chamada implícita**:
```java
System.out.println(obj);        // Chama toString()
String s = "Texto: " + obj;     // Chama toString()
```

**Formato recomendado**:
```
Classe[atributo1=valor1, atributo2=valor2, ...]
```

**Boas práticas**:
- **Sempre sobrescreva** em classes de negócio
- **Inclua atributos relevantes**
- **Oculte dados sensíveis**
- **Evite recursão infinita**
- **Use IDE** para gerar

**Exemplos**:
```java
// Simples
@Override
public String toString() {
    return "Pessoa[nome=" + nome + "]";
}

// String.format()
@Override
public String toString() {
    return String.format("Pessoa[nome=%s, idade=%d]", nome, idade);
}

// StringBuilder
@Override
public String toString() {
    return new StringBuilder()
        .append("Pessoa[nome=").append(nome)
        .append(", idade=").append(idade)
        .append("]")
        .toString();
}
```

**Collections**:
```java
List<Pessoa> pessoas = Arrays.asList(p1, p2);
System.out.println(pessoas); // [Pessoa[...], Pessoa[...]]
```

**Regra de Ouro**: **Sobrescreva toString()** para fornecer **representação útil** do objeto. Use para **debug/log**, não para lógica de negócio.
