# Diferenças entre Tipos Primitivos e Wrapper Classes

## 🎯 Introdução e Definição

### Definição Conceitual

**Tipos Primitivos** e **Wrapper Classes** representam valores numéricos, booleanos e caracteres em Java, mas com **diferenças fundamentais** em natureza, comportamento e uso.

**Primitivo**: Valor direto armazenado na memória (não é objeto).
**Wrapper**: Objeto que encapsula um valor primitivo.

**Mapeamentos**:
```
byte    → Byte
short   → Short
int     → Integer
long    → Long
float   → Float
double  → Double
char    → Character
boolean → Boolean
```

**Por que existem ambos?**
1. **Primitivos**: Performance (valores diretos, sem overhead de objeto)
2. **Wrappers**: Funcionalidades OO (collections, genéricos, null, métodos utilitários)

**Exemplo**:
```java
// Primitivo: valor direto
int idade = 25;

// Wrapper: objeto que encapsula valor
Integer idadeObj = Integer.valueOf(25);

// Uso em collections (apenas wrappers!)
List<Integer> numeros = new ArrayList<>();
numeros.add(10);  // Autoboxing: int → Integer
```

### Características Fundamentais

**Diferenças principais**:
- 🎯 **Natureza**: Valor vs Objeto
- 💾 **Memória**: Stack vs Heap
- 🔢 **Default**: 0/false vs null
- 🎭 **Null**: Impossível vs Possível
- ⚡ **Performance**: Rápido vs Overhead
- 🛠️ **Métodos**: Nenhum vs Muitos
- 📦 **Collections**: Não aceito vs Aceito
- 🔄 **Generics**: Não suportado vs Suportado

---

## 📋 Sumário Conceitual

### Comparação Rápida

| Aspecto | Primitivo | Wrapper |
|---------|-----------|---------|
| **Natureza** | Valor | Objeto |
| **Memória** | Stack | Heap |
| **Tamanho** | Fixo (1-8 bytes) | Variável (16+ bytes) |
| **Default** | 0 / false | null |
| **Null** | ❌ Impossível | ✅ Possível |
| **Performance** | ⚡ Rápida | 🐢 Mais lenta |
| **Métodos** | ❌ Nenhum | ✅ Muitos |
| **Collections** | ❌ Não aceito | ✅ Aceito |
| **Generics** | ❌ Não suportado | ✅ Suportado |
| **Comparação** | `==` | `equals()` |
| **Imutável** | N/A | ✅ Sim |

---

## 🧠 Fundamentos Teóricos

### 1. Natureza: Valor vs Objeto

**Primitivo**: Valor direto na memória.
```java
int x = 10;  // 10 é armazenado diretamente em 'x'
```

**Wrapper**: Objeto com referência.
```java
Integer y = Integer.valueOf(10);  // 'y' referencia objeto que contém 10
```

**Implicações**:
```java
// Primitivos: cópia de valor
int a = 5;
int b = a;
b = 10;
System.out.println(a);  // 5 (não mudou)

// Wrappers: cópia de referência (mas são imutáveis!)
Integer c = Integer.valueOf(5);
Integer d = c;
d = Integer.valueOf(10);  // Novo objeto!
System.out.println(c);  // 5 (imutabilidade protege)
```

### 2. Memória: Stack vs Heap

**Primitivo**: Armazenado na **stack** (pilha).
```java
int x = 10;  // Stack: rápido acesso, limpeza automática
```

**Wrapper**: Armazenado no **heap** (monte).
```java
Integer y = Integer.valueOf(10);  // Heap: overhead de objeto, GC
```

**Tamanhos**:
```java
// Primitivos (exato)
byte:    1 byte
short:   2 bytes
int:     4 bytes
long:    8 bytes
float:   4 bytes
double:  8 bytes
char:    2 bytes
boolean: 1 byte (implementação pode variar)

// Wrappers (aproximado, JVM dependente)
Byte:      16 bytes (object header + 1 byte)
Short:     16 bytes (object header + 2 bytes)
Integer:   16 bytes (object header + 4 bytes)
Long:      24 bytes (object header + 8 bytes)
Float:     16 bytes (object header + 4 bytes)
Double:    24 bytes (object header + 8 bytes)
Character: 16 bytes (object header + 2 bytes)
Boolean:   16 bytes (object header + 1 byte)
```

**Object Header**: 8-16 bytes de metadados do objeto.

### 3. Valor Default

**Primitivo**: Inicializado com **zero** ou **false**.
```java
public class Defaults {
    int numero;         // 0
    long grande;        // 0L
    float decimal;      // 0.0f
    double preciso;     // 0.0
    boolean flag;       // false
    char letra;         // '\u0000' (caractere nulo)
    
    public void mostrar() {
        System.out.println(numero);  // 0
        System.out.println(flag);    // false
    }
}
```

**Wrapper**: Inicializado com **null**.
```java
public class DefaultsWrapper {
    Integer numero;         // null
    Long grande;            // null
    Float decimal;          // null
    Double preciso;         // null
    Boolean flag;           // null
    Character letra;        // null
    
    public void mostrar() {
        System.out.println(numero);  // null
        System.out.println(flag);    // null
    }
}
```

**Implicação**: Wrappers requerem verificação de null!

### 4. Null: Impossível vs Possível

**Primitivo**: **NUNCA pode ser null**.
```java
int x = null;  // ❌ Erro de compilação!
```

**Wrapper**: **Pode ser null** (tri-state para Boolean).
```java
Integer x = null;  // ✅ Válido

if (x == null) {
    System.out.println("Não definido");
}
```

**Tri-state com Boolean**:
```java
// Primitivo: apenas 2 estados
boolean aceito = false;  // true ou false

// Wrapper: 3 estados
Boolean opcionalAceito = null;  // true, false ou null

if (opcionalAceito == null) {
    System.out.println("Não respondeu");
} else if (opcionalAceito) {
    System.out.println("Aceitou");
} else {
    System.out.println("Rejeitou");
}
```

### 5. Performance: Primitivos São Mais Rápidos

**Razões**:
1. **Stack vs Heap**: Stack é mais rápida
2. **Sem overhead de objeto**: Sem object header
3. **Sem Garbage Collection**: Limpeza automática na stack
4. **Cache de CPU**: Valores pequenos ficam em cache

**Benchmark (exemplo conceitual)**:
```java
// Loop com primitivos: ~10ms
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;
}

// Loop com wrappers: ~50ms (5x mais lento!)
Integer somaObj = 0;
for (Integer i = 0; i < 1_000_000; i++) {
    somaObj += i;  // Boxing/unboxing a cada iteração!
}
```

**Autoboxing/Unboxing custam caro em loops**!

### 6. Métodos: Primitivos Não Têm, Wrappers Têm Muitos

**Primitivo**: Sem métodos.
```java
int x = 10;
// x.metodo();  // ❌ Erro! Primitivos não têm métodos
```

**Wrapper**: Muitos métodos utilitários.
```java
Integer x = 10;

// Métodos de instância
System.out.println(x.toString());      // "10"
System.out.println(x.compareTo(5));    // 1 (10 > 5)
System.out.println(x.byteValue());     // 10 (como byte)

// Métodos estáticos
System.out.println(Integer.parseInt("20"));    // 20
System.out.println(Integer.toBinaryString(10));// "1010"
System.out.println(Integer.max(10, 20));       // 20
```

**Conversão para usar métodos**:
```java
int primitivo = 10;

// Opção 1: Autoboxing
String str = ((Integer) primitivo).toString();

// Opção 2: Método estático
String str2 = Integer.toString(primitivo);
```

### 7. Collections: Apenas Wrappers

**Collections aceitam apenas objetos** (não primitivos).

```java
// ❌ Erro! List não aceita primitivos
// List<int> numeros = new ArrayList<>();

// ✅ Correto: usar wrapper
List<Integer> numeros = new ArrayList<>();
numeros.add(10);   // Autoboxing: int → Integer
numeros.add(20);

int valor = numeros.get(0);  // Unboxing: Integer → int
```

**Internamente**:
```java
numeros.add(10);
// Compilador transforma em:
numeros.add(Integer.valueOf(10));  // Autoboxing
```

### 8. Generics: Apenas Wrappers

**Generics não suportam primitivos**.

```java
// ❌ Erro! T não pode ser primitivo
// public class Caixa<int> { }

// ✅ Correto: usar wrapper
public class Caixa<T> {
    private T valor;
    
    public void set(T valor) { this.valor = valor; }
    public T get() { return valor; }
}

// Uso
Caixa<Integer> caixaInt = new Caixa<>();
caixaInt.set(10);  // Autoboxing
int x = caixaInt.get();  // Unboxing
```

### 9. Comparação: == vs equals()

**Primitivo**: Sempre `==` (compara valores).
```java
int a = 10;
int b = 10;
System.out.println(a == b);  // true (valores iguais)
```

**Wrapper**: `equals()` para valores, `==` para referências.
```java
Integer a = 127;
Integer b = 127;
System.out.println(a == b);      // true (cache -128 a 127)
System.out.println(a.equals(b)); // true (valores iguais)

Integer c = 128;
Integer d = 128;
System.out.println(c == d);      // false ⚠️ (fora do cache)
System.out.println(c.equals(d)); // true (valores iguais)
```

**Regra**: Sempre use `equals()` para wrappers!

### 10. Imutabilidade

**Primitivo**: N/A (valores são modificados diretamente).
```java
int x = 10;
x = 20;  // Valor modificado
```

**Wrapper**: Imutável (valor interno não pode ser alterado).
```java
Integer x = Integer.valueOf(10);
// x.valor = 20;  // ❌ Impossível! Campo 'value' é final

x = Integer.valueOf(20);  // Novo objeto criado
```

**Implicação**: Modificar wrapper cria novo objeto.

---

## 🔍 Análise Conceitual Profunda

### Quando Usar Primitivo vs Wrapper

**Use Primitivo quando**:
- ✅ Performance é crítica (loops, cálculos intensivos)
- ✅ Null não é necessário
- ✅ Não precisa de métodos utilitários
- ✅ Variáveis locais simples

**Use Wrapper quando**:
- ✅ Necessita de null (tri-state, opcional)
- ✅ Usa Collections ou Generics
- ✅ Necessita de métodos utilitários (parsing, conversão)
- ✅ Serialização/Deserialização
- ✅ Campos de banco de dados que podem ser NULL

### Autoboxing/Unboxing: Ponte Entre Mundos

**Autoboxing**: Primitivo → Wrapper (automático).
```java
int primitivo = 10;
Integer wrapper = primitivo;  // Autoboxing
// Compilador: Integer wrapper = Integer.valueOf(primitivo);
```

**Unboxing**: Wrapper → Primitivo (automático).
```java
Integer wrapper = Integer.valueOf(20);
int primitivo = wrapper;  // Unboxing
// Compilador: int primitivo = wrapper.intValue();
```

**Perigo**: Unboxing de null causa NullPointerException!
```java
Integer wrapper = null;
int primitivo = wrapper;  // ❌ NullPointerException!
```

### Cache de Wrappers

**Integer, Short, Byte, Character**: Cache de -128 a 127.
**Boolean**: Cache completo (TRUE e FALSE).
**Long**: Cache de -128 a 127 (Java 9+).
**Float, Double**: Sem cache.

```java
// Cache funciona
Integer a = 100;
Integer b = 100;
System.out.println(a == b);  // true (mesmo objeto)

// Fora do cache
Integer c = 200;
Integer d = 200;
System.out.println(c == d);  // false (objetos diferentes)
```

### Overhead de Memória

**Exemplo**: Array de 1 milhão de inteiros.

**Primitivo**:
```java
int[] array = new int[1_000_000];
// Memória: 1_000_000 * 4 bytes = 4 MB
```

**Wrapper**:
```java
Integer[] array = new Integer[1_000_000];
// Memória: 1_000_000 * 16 bytes = 16 MB (4x maior!)
// + overhead de cada objeto
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Campos de Classe

**Primitivo**: Inicializado com 0/false (pode não ser desejado).
```java
public class Usuario {
    private int idade;  // Padrão: 0 (ambíguo: 0 anos ou não informado?)
    
    public Usuario() {
        // idade já é 0
    }
}
```

**Wrapper**: Inicializado com null (mais claro).
```java
public class Usuario {
    private Integer idade;  // Padrão: null (não informado)
    
    public Usuario() {
        // idade = null (explicitamente não definido)
    }
    
    public boolean temIdade() {
        return idade != null;
    }
}
```

### Caso 2: Collections

**Obrigatório usar wrapper**:
```java
List<Integer> numeros = new ArrayList<>();
numeros.add(10);  // Autoboxing
numeros.add(20);

int soma = 0;
for (Integer num : numeros) {
    soma += num;  // Unboxing
}
```

### Caso 3: Performance em Loops

**Primitivo** (recomendado):
```java
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // Rápido!
}
```

**Wrapper** (evitar):
```java
Integer soma = 0;
for (Integer i = 0; i < 1_000_000; i++) {
    soma += i;  // Lento! Boxing/unboxing a cada iteração
}
```

### Caso 4: Banco de Dados (Null-Safety)

**Primitivo**: Não pode representar NULL do banco.
```java
public class Produto {
    private int estoque;  // Padrão: 0 (ambíguo com estoque zerado)
}
```

**Wrapper**: Representa NULL corretamente.
```java
public class Produto {
    private Integer estoque;  // null = não informado, 0 = zerado
    
    public boolean temEstoque() {
        return estoque != null && estoque > 0;
    }
}
```

### Caso 5: Optional (Java 8+)

**Wrapper** se integra melhor:
```java
public Optional<Integer> buscarIdade(String nome) {
    // Retorna Optional.empty() se não encontrar
    Integer idade = buscarNoBanco(nome);
    return Optional.ofNullable(idade);
}
```

---

## ⚠️ Limitações e Considerações

### 1. NullPointerException em Unboxing

**Problema**: Unboxing de null.
```java
Integer wrapper = null;
int primitivo = wrapper;  // ❌ NullPointerException!
```

**Solução**: Verificar null.
```java
int primitivo = (wrapper != null) ? wrapper : 0;
```

### 2. Performance em Loops

**Problema**: Autoboxing/unboxing custam caro.
```java
Integer soma = 0;
for (Integer i = 0; i < 1_000_000; i++) {
    soma += i;  // ⚠️ Muito lento!
}
```

**Solução**: Usar primitivos em loops.
```java
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;  // ✅ Rápido!
}
```

### 3. Comparação com ==

**Problema**: `==` compara referências, não valores.
```java
Integer a = 128;
Integer b = 128;
System.out.println(a == b);  // false ⚠️
```

**Solução**: Sempre use `equals()`.
```java
System.out.println(a.equals(b));  // true ✅
```

### 4. Overhead de Memória

**Problema**: Wrappers ocupam mais memória.
```java
Integer[] array = new Integer[1_000_000];  // ~16 MB
```

**Solução**: Usar primitivos quando possível.
```java
int[] array = new int[1_000_000];  // ~4 MB
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Autoboxing/Unboxing**: Conversão automática entre primitivos e wrappers
- **Cache de Valores**: Integer cache (-128 a 127)
- **Collections Framework**: Requer wrappers
- **Generics**: Requer wrappers
- **Optional**: Trabalha com wrappers
- **Streams**: Streams especializados (IntStream) para primitivos

---

## 🚀 Boas Práticas

1. ✅ **Use primitivos por padrão (performance)**
   ```java
   int contador = 0;  // ✅ Primitivo
   ```

2. ✅ **Use wrappers quando null é significativo**
   ```java
   Integer idade = null;  // "Não informado"
   ```

3. ✅ **Use wrappers em Collections e Generics**
   ```java
   List<Integer> numeros = new ArrayList<>();
   ```

4. ✅ **Verifique null antes de unboxing**
   ```java
   if (wrapper != null) {
       int valor = wrapper;
   }
   ```

5. ✅ **Evite autoboxing/unboxing em loops**
   ```java
   // ❌ Evitar
   Integer soma = 0;
   for (Integer i = 0; i < 1000; i++) { soma += i; }
   
   // ✅ Preferir
   int soma = 0;
   for (int i = 0; i < 1000; i++) { soma += i; }
   ```

6. ✅ **Use equals() para comparar wrappers**
   ```java
   Integer a = 200;
   Integer b = 200;
   System.out.println(a.equals(b));  // ✅ Correto
   ```

7. ✅ **Prefira primitivos em variáveis locais**
   ```java
   public void calcular() {
       int resultado = 0;  // ✅ Stack, rápido
   }
   ```

8. ✅ **Use wrappers em campos quando 0/false não é default desejado**
   ```java
   public class Config {
       private Integer timeout;  // null = não configurado
   }
   ```
