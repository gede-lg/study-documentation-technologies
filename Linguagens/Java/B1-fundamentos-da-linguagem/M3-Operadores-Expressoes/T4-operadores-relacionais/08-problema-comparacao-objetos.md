# Problema da Comparação de Objetos com ==

## 🎯 Introdução e Definição

### Definição Conceitual

O **operador `==`** em Java, quando aplicado a **objetos** (tipos de referência), compara **referências de memória**, não o **conteúdo** dos objetos. Isso significa que `==` verifica se duas variáveis apontam para o **mesmo objeto na memória**, e não se os objetos têm valores iguais.

**Diferença fundamental**:
- ✅ **Tipos primitivos**: `==` compara **valores**
- ⚠️ **Objetos**: `==` compara **referências** (endereços de memória)
- 💡 **Solução**: Use `.equals()` para comparar **conteúdo**

**Exemplo do problema**:
```java
String s1 = new String("Java");
String s2 = new String("Java");

System.out.println(s1 == s2);  // false (referências diferentes!)
System.out.println(s1.equals(s2));  // true (conteúdo igual)
```

**Visualização**:
```
Memória:
[0x1000] → "Java"  ← s1 aponta aqui
[0x2000] → "Java"  ← s2 aponta aqui

s1 == s2 → false (0x1000 != 0x2000)
s1.equals(s2) → true (conteúdo "Java" == "Java")
```

### Características Fundamentais

- 🔍 **== compara referências**: Verifica se é o **mesmo objeto**
- 📊 **equals() compara conteúdo**: Verifica se objetos são **semanticamente iguais**
- 🎯 **String pool**: Literais String são armazenados em pool
- ⚠️ **NullPointerException**: `.equals()` em null lança exceção
- 💡 **Regra de ouro**: Use `==` apenas para verificar identidade

---

## 📋 Sumário Conceitual

### Tabela Comparativa

| Aspecto | `==` | `.equals()` |
|---------|------|-------------|
| **Tipos primitivos** | Compara valores | N/A (primitivos não têm métodos) |
| **Objetos** | Compara referências | Compara conteúdo (se sobrescrito) |
| **String** | Referências (exceto pool) | Conteúdo |
| **null** | Seguro | Lança NullPointerException |
| **Uso principal** | Identidade de objetos | Igualdade de valores |

---

## 🧠 Fundamentos Teóricos

### 1. Comparação de String

**Problema clássico**:
```java
String s1 = new String("Java");
String s2 = new String("Java");

System.out.println(s1 == s2);  // false (objetos diferentes)
System.out.println(s1.equals(s2));  // true (conteúdo igual)
```

**String pool (caso especial)**:
```java
String s1 = "Java";  // Literal: vai para String pool
String s2 = "Java";  // Reutiliza a mesma referência do pool

System.out.println(s1 == s2);  // true (mesma referência!)
System.out.println(s1.equals(s2));  // true (conteúdo igual)
```

**Visualização do String pool**:
```
String Pool:
[0x5000] → "Java"
           ↑    ↑
           s1   s2 (apontam para o mesmo objeto)

s1 == s2 → true (mesma referência)
```

**Combinação: literal + new**:
```java
String s1 = "Java";  // Pool
String s2 = new String("Java");  // Heap (fora do pool)

System.out.println(s1 == s2);  // false (referências diferentes)
System.out.println(s1.equals(s2));  // true (conteúdo igual)
```

### 2. Comparação de Integer (Wrapper)

**Autoboxing e cache**:
```java
Integer a = 100;  // Autoboxing: Integer.valueOf(100)
Integer b = 100;  // Reutiliza do cache (-128 a 127)

System.out.println(a == b);  // true (cache reutilizado)
System.out.println(a.equals(b));  // true

Integer x = 200;  // Fora do cache
Integer y = 200;  // Novo objeto

System.out.println(x == y);  // false (objetos diferentes)
System.out.println(x.equals(y));  // true (valores iguais)
```

**Cache de Integer**:
```java
// Cache: -128 a 127
Integer a = 127;
Integer b = 127;
System.out.println(a == b);  // true (cache)

Integer c = 128;
Integer d = 128;
System.out.println(c == d);  // false (fora do cache)
```

### 3. Comparação de Arrays

**Arrays são objetos**:
```java
int[] array1 = {1, 2, 3};
int[] array2 = {1, 2, 3};

System.out.println(array1 == array2);  // false (referências diferentes)

// Solução: Arrays.equals()
System.out.println(Arrays.equals(array1, array2));  // true
```

**Mesmo conteúdo, objetos diferentes**:
```java
String[] nomes1 = {"Ana", "João"};
String[] nomes2 = {"Ana", "João"};

System.out.println(nomes1 == nomes2);  // false
System.out.println(Arrays.equals(nomes1, nomes2));  // true
```

### 4. Comparação de Objetos Customizados

**Classe sem equals() sobrescrito**:
```java
class Pessoa {
    String nome;
    int idade;
    
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

Pessoa p1 = new Pessoa("João", 25);
Pessoa p2 = new Pessoa("João", 25);

System.out.println(p1 == p2);  // false (objetos diferentes)
System.out.println(p1.equals(p2));  // false (equals() não sobrescrito!)
```

**Classe com equals() sobrescrito**:
```java
class Pessoa {
    String nome;
    int idade;
    
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Pessoa pessoa = (Pessoa) obj;
        return idade == pessoa.idade && 
               Objects.equals(nome, pessoa.nome);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(nome, idade);
    }
}

Pessoa p1 = new Pessoa("João", 25);
Pessoa p2 = new Pessoa("João", 25);

System.out.println(p1 == p2);  // false (objetos diferentes)
System.out.println(p1.equals(p2));  // true (conteúdo igual)
```

### 5. Problema com null

**== é seguro com null**:
```java
String s1 = null;
String s2 = null;

System.out.println(s1 == s2);  // true (ambos null)

String s3 = "Java";
System.out.println(s1 == s3);  // false
```

**equals() lança NullPointerException**:
```java
String s1 = null;
String s2 = "Java";

// ❌ ERRO: NullPointerException
// System.out.println(s1.equals(s2));

// ✅ Solução: verificar null
if (s1 != null && s1.equals(s2)) {
    System.out.println("Iguais");
}

// ✅ Alternativa: literal primeiro
if ("Java".equals(s1)) {  // Não lança NPE se s1 for null
    System.out.println("Iguais");
}

// ✅ Java 7+: Objects.equals()
if (Objects.equals(s1, s2)) {  // Seguro para null
    System.out.println("Iguais");
}
```

### 6. Comparação de Listas

**Listas são objetos**:
```java
List<Integer> lista1 = Arrays.asList(1, 2, 3);
List<Integer> lista2 = Arrays.asList(1, 2, 3);

System.out.println(lista1 == lista2);  // false (objetos diferentes)
System.out.println(lista1.equals(lista2));  // true (mesmo conteúdo)
```

**ArrayList vs LinkedList**:
```java
List<String> arrayList = new ArrayList<>();
arrayList.add("Java");

List<String> linkedList = new LinkedList<>();
linkedList.add("Java");

System.out.println(arrayList == linkedList);  // false
System.out.println(arrayList.equals(linkedList));  // true (mesmo conteúdo)
```

### 7. Comparação de Enums

**Enums são seguros com ==**:
```java
enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}

DiaSemana dia1 = DiaSemana.SEGUNDA;
DiaSemana dia2 = DiaSemana.SEGUNDA;

System.out.println(dia1 == dia2);  // true (singleton)
System.out.println(dia1.equals(dia2));  // true
```

**Por que == funciona?**:
- Enums são **singleton**: apenas uma instância de cada valor
- `==` e `.equals()` têm mesmo resultado

### 8. Comparação de Boolean (Wrapper)

**Boolean cache**:
```java
Boolean b1 = true;
Boolean b2 = true;

System.out.println(b1 == b2);  // true (cache)
System.out.println(b1.equals(b2));  // true

Boolean b3 = Boolean.valueOf(false);
Boolean b4 = Boolean.valueOf(false);

System.out.println(b3 == b4);  // true (cache)
```

### 9. intern() para String

**Forçar uso do pool**:
```java
String s1 = new String("Java").intern();  // Vai para pool
String s2 = "Java";  // Pool

System.out.println(s1 == s2);  // true (mesma referência do pool)
```

**Quando usar intern()**:
```java
String s1 = new String("Java");
String s2 = new String("Java");

System.out.println(s1 == s2);  // false

s1 = s1.intern();
s2 = s2.intern();

System.out.println(s1 == s2);  // true (agora apontam para o pool)
```

### 10. Contrato equals() e hashCode()

**Regra fundamental**:
```java
// Se equals() é true, hashCode() DEVE ser igual
// Se hashCode() é igual, equals() PODE ser true ou false

class Pessoa {
    String nome;
    
    @Override
    public boolean equals(Object obj) {
        // Implementação
    }
    
    @Override
    public int hashCode() {
        // DEVE ser sobrescrito quando equals() é sobrescrito
        return Objects.hash(nome);
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Por que == Compara Referências?

**Tipos primitivos vs Objetos**:
```java
// Primitivo: valor armazenado diretamente
int a = 10;
int b = 10;
System.out.println(a == b);  // true (compara valores)

// Objeto: variável armazena referência
String s1 = new String("Java");
String s2 = new String("Java");
System.out.println(s1 == s2);  // false (compara endereços)
```

**Memória**:
```
Primitivo:
a → [10]
b → [10]
a == b → true (valores iguais)

Objeto:
s1 → [0x1000] → "Java"
s2 → [0x2000] → "Java"
s1 == s2 → false (endereços diferentes)
```

### Quando Usar == vs equals()

**Use `==` quando:**
1. Comparar tipos primitivos
2. Verificar se é o **mesmo objeto** (identidade)
3. Comparar com `null`
4. Comparar enums

**Use `.equals()` quando:**
1. Comparar **conteúdo** de objetos
2. Comparar Strings
3. Comparar Wrappers (Integer, Double, etc.)
4. Comparar coleções (List, Set, Map)

### String Pool Explicado

**Como funciona**:
```java
// Literal: vai para pool
String s1 = "Java";  // Pool: [0x5000] → "Java"
String s2 = "Java";  // Reutiliza [0x5000]

// new: vai para heap
String s3 = new String("Java");  // Heap: [0x6000] → "Java"

System.out.println(s1 == s2);  // true (pool)
System.out.println(s1 == s3);  // false (pool vs heap)
```

**Vantagem do pool**:
- Economiza memória
- Strings literais são reutilizadas

### Cache de Wrappers

**Integer cache (-128 a 127)**:
```java
Integer a = 100;  // Cache
Integer b = 100;  // Reutilizado
System.out.println(a == b);  // true

Integer c = 128;  // Fora do cache
Integer d = 128;  // Novo objeto
System.out.println(c == d);  // false
```

**Por que cache?**:
- Otimização: valores pequenos são comuns
- Reduz criação de objetos

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação de String

```java
public class ValidadorString {
    public boolean isJava(String linguagem) {
        // ❌ ERRADO
        // if (linguagem == "Java") { }
        
        // ✅ CORRETO
        if ("Java".equals(linguagem)) {  // Literal primeiro evita NPE
            return true;
        }
        return false;
    }
}
```

### Caso 2: Comparação de Objetos

```java
public class Usuario {
    private String username;
    private String email;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;  // == para identidade
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Usuario usuario = (Usuario) obj;
        return Objects.equals(username, usuario.username) &&
               Objects.equals(email, usuario.email);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(username, email);
    }
}
```

### Caso 3: Verificação de null

```java
public class VerificadorNull {
    public boolean isNullOuVazio(String texto) {
        // ✅ == seguro com null
        if (texto == null) {
            return true;
        }
        
        // Agora pode usar métodos
        return texto.isEmpty();
    }
    
    public boolean isIgual(String s1, String s2) {
        // ✅ Objects.equals() é seguro
        return Objects.equals(s1, s2);
    }
}
```

### Caso 4: Comparação de Enum

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

public class ValidadorStatus {
    public boolean isAtivo(Status status) {
        // ✅ == é seguro com enum
        return status == Status.ATIVO;
        
        // Também funciona (menos eficiente):
        // return status.equals(Status.ATIVO);
    }
}
```

### Caso 5: Cache de String

```java
public class CacheString {
    private Map<String, String> cache = new HashMap<>();
    
    public String obterCanonical(String texto) {
        // Usa intern() para reutilizar Strings
        return texto.intern();
    }
    
    public void exemplo() {
        String s1 = new String("Java").intern();
        String s2 = "Java";
        
        System.out.println(s1 == s2);  // true (pool)
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. String Literal vs new String()

**Problema**: Comportamento diferente.
```java
String s1 = "Java";
String s2 = "Java";
System.out.println(s1 == s2);  // true (pool)

String s3 = new String("Java");
String s4 = new String("Java");
System.out.println(s3 == s4);  // false (objetos diferentes)

// ✅ Solução: sempre use equals()
System.out.println(s1.equals(s3));  // true
```

### 2. Integer Cache Limitado

**Problema**: Cache apenas de -128 a 127.
```java
Integer a = 127;
Integer b = 127;
System.out.println(a == b);  // true (cache)

Integer c = 128;
Integer d = 128;
System.out.println(c == d);  // false (fora do cache)

// ✅ Solução: sempre use equals()
System.out.println(c.equals(d));  // true
```

### 3. NullPointerException com equals()

**Problema**: Chamada em null lança NPE.
```java
String s = null;
// System.out.println(s.equals("Java"));  // ❌ NPE

// ✅ Soluções:
if (s != null && s.equals("Java")) { }  // Verificar null
if ("Java".equals(s)) { }  // Literal primeiro
if (Objects.equals(s, "Java")) { }  // Objects.equals()
```

### 4. equals() não Sobrescrito

**Problema**: Classe não sobrescreve equals().
```java
class Ponto {
    int x, y;
    // equals() NÃO sobrescrito
}

Ponto p1 = new Ponto();
p1.x = 5; p1.y = 10;

Ponto p2 = new Ponto();
p2.x = 5; p2.y = 10;

System.out.println(p1.equals(p2));  // false (usa Object.equals(), que é ==)

// ✅ Solução: sobrescrever equals()
```

### 5. Confundir == com equals()

**Problema**: Usar == para comparar conteúdo.
```java
String s1 = new String("Java");
String s2 = new String("Java");

if (s1 == s2) {  // ❌ ERRADO: compara referências
    System.out.println("Iguais");  // Não executa
}

if (s1.equals(s2)) {  // ✅ CORRETO: compara conteúdo
    System.out.println("Iguais");  // Executa
}
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Operador ==**: Comparação de referências
- **Método equals()**: Comparação de conteúdo
- **String Pool**: Otimização de literais String
- **Autoboxing**: Conversão automática int → Integer
- **Cache de Wrappers**: Integer, Boolean cache
- **hashCode()**: Contrato com equals()
- **Objects.equals()**: Comparação segura para null
- **Tipos Primitivos**: Comparação por valor

---

## 🚀 Boas Práticas

1. ✅ **Use equals() para comparar objetos**
   ```java
   if (str1.equals(str2)) {  // ✅ Correto
       // ...
   }
   ```

2. ✅ **Literal primeiro em equals()**
   ```java
   if ("Java".equals(variavel)) {  // ✅ Evita NPE
       // ...
   }
   ```

3. ✅ **Use Objects.equals() para null-safety**
   ```java
   if (Objects.equals(s1, s2)) {  // ✅ Seguro
       // ...
   }
   ```

4. ✅ **Use == apenas para identidade**
   ```java
   if (obj1 == obj2) {  // ✅ Verifica se é o MESMO objeto
       System.out.println("Mesmo objeto");
   }
   ```

5. ✅ **Sempre sobrescreva hashCode() com equals()**
   ```java
   @Override
   public boolean equals(Object obj) { }
   
   @Override
   public int hashCode() {  // ✅ OBRIGATÓRIO
       return Objects.hash(campo1, campo2);
   }
   ```

6. ✅ **Use == para comparar enums**
   ```java
   if (dia == DiaSemana.SEGUNDA) {  // ✅ Seguro e eficiente
       // ...
   }
   ```

7. ✅ **Verifique null antes de equals()**
   ```java
   if (objeto != null && objeto.equals(outro)) {  // ✅ Seguro
       // ...
   }
   ```

8. ✅ **Use Arrays.equals() para arrays**
   ```java
   if (Arrays.equals(array1, array2)) {  // ✅ Correto
       // ...
   }
   ```

9. ✅ **Evite new String() para literais**
   ```java
   // ❌ Evitar
   String s = new String("Java");
   
   // ✅ Preferir
   String s = "Java";  // Usa pool
   ```

10. ✅ **Documente uso de intern()**
    ```java
    // Usa intern() para otimizar memória em cache de Strings
    String canonical = texto.intern();  // ✅ Comentário explica
    ```
