# Short-Circuit Evaluation

## 🎯 Introdução e Definição

### Definição Conceitual

**Short-circuit evaluation** (avaliação de curto-circuito) é uma técnica de otimização utilizada pelos operadores lógicos `&&` (AND) e `||` (OR) em Java, onde a **segunda expressão não é avaliada se o resultado já puder ser determinado pela primeira expressão**.

**Comportamento**:
- **AND (`&&`)**: Se primeira é `false`, segunda **não é avaliada** (resultado é `false`)
- **OR (`||`)**: Se primeira é `true`, segunda **não é avaliada** (resultado é `true`)

**Exemplo básico**:
```java
// AND: primeira false → segunda NÃO avaliada
boolean resultado1 = false && (10 / 0 > 5);
System.out.println(resultado1);  // false (sem ArithmeticException!)

// OR: primeira true → segunda NÃO avaliada
boolean resultado2 = true || (10 / 0 > 5);
System.out.println(resultado2);  // true (sem ArithmeticException!)
```

### Características Fundamentais

- ⚡ **Otimização de performance**: Evita avaliações desnecessárias
- 🛡️ **Prevenção de erros**: Evita NullPointerException e outros erros
- 🔍 **Operadores**: Apenas `&&` e `||` (não `&` e `|`)
- 📊 **Ordem importa**: Coloque condições mais restritivas primeiro
- 💡 **Uso comum**: Validações com verificação de null, operações caras

---

## 📋 Sumário Conceitual

### Comparação: Short-Circuit vs Non-Short-Circuit

| Aspecto | `&&` / `\|\|` (Short-circuit) | `&` / `\|` (Non-short-circuit) |
|---------|---------------------------|----------------------------|
| **Avalia segunda expressão?** | Apenas se necessário | Sempre |
| **Performance** | Melhor (pode pular código) | Pior (sempre executa tudo) |
| **Segurança** | Maior (previne erros) | Menor (pode causar exceções) |
| **Efeitos colaterais** | Segunda pode não executar | Sempre executam |
| **Uso principal** | Condições booleanas | Operações bit a bit |

---

## 🧠 Fundamentos Teóricos

### 1. Short-Circuit com AND (&&)

**Regra**: Se primeira é `false`, resultado é **sempre** `false`.

**Exemplo sem short-circuit causaria erro**:
```java
int x = 0;

// ✅ Short-circuit: segunda NÃO avaliada (x == 0)
boolean resultado = (x != 0) && (10 / x > 5);
System.out.println(resultado);  // false (sem erro)

// ❌ Sem short-circuit: ERRO
// boolean resultado = (x != 0) & (10 / x > 5);  // ArithmeticException!
```

**Demonstração visual**:
```java
public class DemoShortCircuitAND {
    static boolean condicao1() {
        System.out.println("condicao1() executada");
        return false;
    }
    
    static boolean condicao2() {
        System.out.println("condicao2() executada");
        return true;
    }
    
    public static void main(String[] args) {
        System.out.println("=== Com && (short-circuit) ===");
        boolean resultado1 = condicao1() && condicao2();
        System.out.println("Resultado: " + resultado1);
        
        System.out.println("\n=== Com & (sem short-circuit) ===");
        boolean resultado2 = condicao1() & condicao2();
        System.out.println("Resultado: " + resultado2);
    }
}

// Saída:
// === Com && (short-circuit) ===
// condicao1() executada
// Resultado: false
// (condicao2() NÃO foi executada!)
//
// === Com & (sem short-circuit) ===
// condicao1() executada
// condicao2() executada
// Resultado: false
```

**Todas as combinações AND**:
```java
// true && true = true (avalia ambas)
boolean r1 = metodoTrue() && metodoTrue();  // Ambos executam

// true && false = false (avalia ambas)
boolean r2 = metodoTrue() && metodoFalse();  // Ambos executam

// false && true = false (short-circuit: segunda NÃO avalia)
boolean r3 = metodoFalse() && metodoTrue();  // Apenas primeira

// false && false = false (short-circuit: segunda NÃO avalia)
boolean r4 = metodoFalse() && metodoFalse();  // Apenas primeira
```

### 2. Short-Circuit com OR (||)

**Regra**: Se primeira é `true`, resultado é **sempre** `true`.

**Exemplo sem short-circuit causaria erro**:
```java
int x = 5;

// ✅ Short-circuit: segunda NÃO avaliada (x > 0 é true)
boolean resultado = (x > 0) || (10 / 0 > 5);
System.out.println(resultado);  // true (sem erro)

// ❌ Sem short-circuit: ERRO
// boolean resultado = (x > 0) | (10 / 0 > 5);  // ArithmeticException!
```

**Demonstração visual**:
```java
public class DemoShortCircuitOR {
    static boolean condicao1() {
        System.out.println("condicao1() executada");
        return true;
    }
    
    static boolean condicao2() {
        System.out.println("condicao2() executada");
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println("=== Com || (short-circuit) ===");
        boolean resultado1 = condicao1() || condicao2();
        System.out.println("Resultado: " + resultado1);
        
        System.out.println("\n=== Com | (sem short-circuit) ===");
        boolean resultado2 = condicao1() | condicao2();
        System.out.println("Resultado: " + resultado2);
    }
}

// Saída:
// === Com || (short-circuit) ===
// condicao1() executada
// Resultado: true
// (condicao2() NÃO foi executada!)
//
// === Com | (sem short-circuit) ===
// condicao1() executada
// condicao2() executada
// Resultado: true
```

**Todas as combinações OR**:
```java
// true || true = true (short-circuit: segunda NÃO avalia)
boolean r1 = metodoTrue() || metodoTrue();  // Apenas primeira

// true || false = true (short-circuit: segunda NÃO avalia)
boolean r2 = metodoTrue() || metodoFalse();  // Apenas primeira

// false || true = true (avalia ambas)
boolean r3 = metodoFalse() || metodoTrue();  // Ambos executam

// false || false = false (avalia ambas)
boolean r4 = metodoFalse() || metodoFalse();  // Ambos executam
```

### 3. Prevenção de NullPointerException

**Problema comum: chamar método em null**:
```java
String texto = null;

// ❌ ERRO: NullPointerException
// if (texto.length() > 0) { }

// ✅ Short-circuit: verifica null PRIMEIRO
if (texto != null && texto.length() > 0) {
    System.out.println("Texto válido: " + texto);
}
// texto é null → primeira é false → segunda NÃO avalia
```

**Ordem importa**:
```java
String nome = null;

// ✅ CORRETO: null check primeiro
if (nome != null && nome.startsWith("A")) {
    System.out.println(nome);
}

// ❌ ERRADO: NullPointerException!
// if (nome.startsWith("A") && nome != null) {
//     System.out.println(nome);
// }
```

**Múltiplas verificações**:
```java
public class Pessoa {
    private Endereco endereco;
    
    public String getCidade() {
        // Verifica cada nível antes de acessar
        if (endereco != null && 
            endereco.getCidade() != null && 
            !endereco.getCidade().isEmpty()) {
            return endereco.getCidade();
        }
        return "Desconhecida";
    }
}
```

### 4. Otimização de Performance

**Operações caras (banco de dados, I/O, cálculos complexos)**:
```java
public class ValidadorUsuario {
    // Operação rápida
    boolean isUsuarioAtivo(Usuario usuario) {
        return usuario.getStatus().equals("ATIVO");
    }
    
    // Operação CARA: consulta banco de dados
    boolean temPermissaoBancoDados(Usuario usuario) {
        // Simula query no banco
        return database.query("SELECT permissao FROM users WHERE id = ?", 
                              usuario.getId());
    }
    
    public boolean podeAcessar(Usuario usuario) {
        // ✅ Coloca condição RÁPIDA primeiro
        // Se usuário não está ativo, NÃO consulta banco (economiza tempo)
        return isUsuarioAtivo(usuario) && temPermissaoBancoDados(usuario);
    }
}
```

**Exemplo com OR**:
```java
public class CacheService {
    boolean existeNoCache(String chave) {
        // Rápido: busca em memória
        return cache.contains(chave);
    }
    
    boolean existeNoBanco(String chave) {
        // LENTO: consulta banco de dados
        return database.exists(chave);
    }
    
    public boolean existe(String chave) {
        // ✅ Verifica cache PRIMEIRO
        // Se está no cache, NÃO consulta banco (muito mais rápido)
        return existeNoCache(chave) || existeNoBanco(chave);
    }
}
```

### 5. Evitar Divisão por Zero

**AND com verificação**:
```java
int divisor = 0;
int dividendo = 100;

// ✅ Short-circuit: verifica divisor != 0 PRIMEIRO
if (divisor != 0 && (dividendo / divisor) > 10) {
    System.out.println("Resultado válido");
}
// divisor == 0 → primeira false → segunda NÃO avalia (sem erro)
```

**OR com valor padrão**:
```java
int x = 0;

// ✅ Se x != 0, usa (10 / x), senão usa false
boolean resultado = (x == 0) || (10 / x > 5);
System.out.println(resultado);  // false (x == 0 é true, não avalia 10/x)
```

### 6. Validação de Arrays e Listas

**Verificar tamanho antes de acessar**:
```java
int[] array = {1, 2, 3};
int indice = 5;

// ✅ Verifica bounds PRIMEIRO
if (indice < array.length && array[indice] > 0) {
    System.out.println("Valor: " + array[indice]);
}
// indice >= array.length → primeira false → segunda NÃO avalia
// (sem ArrayIndexOutOfBoundsException)
```

**Lista vazia**:
```java
List<String> nomes = new ArrayList<>();

// ✅ Verifica se não está vazia PRIMEIRO
if (!nomes.isEmpty() && nomes.get(0).startsWith("A")) {
    System.out.println("Primeiro nome começa com A");
}
```

### 7. Expressões Complexas com Múltiplos Short-Circuits

**Cadeia de ANDs**:
```java
String texto = null;
int numero = 0;

// Todas verificações em cascata
if (texto != null &&       // 1ª verifica null
    !texto.isEmpty() &&    // 2ª verifica vazio (só se não for null)
    numero != 0 &&         // 3ª verifica divisor
    (100 / numero) > 10) { // 4ª faz cálculo (só se tudo OK)
    System.out.println("Tudo válido");
}
```

**Cadeia de ORs**:
```java
boolean admin = false;
boolean moderador = false;
boolean autor = true;

// Para no primeiro true
boolean podeEditar = admin ||      // false, continua
                     moderador ||  // false, continua
                     autor;        // true, PARA AQUI
System.out.println(podeEditar);  // true
```

### 8. Efeitos Colaterais e Short-Circuit

**Problema: contador não incrementa**:
```java
int contador = 0;

boolean resultado = false && (++contador > 0);
System.out.println(contador);  // 0 (NÃO incrementou!)

// ++ não foi executado devido ao short-circuit
```

**Solução: separar efeitos colaterais**:
```java
int contador = 0;

// ✅ Incrementa ANTES da condição
contador++;
boolean resultado = false && (contador > 0);
System.out.println(contador);  // 1 (incrementou)
```

**Quando usar & em vez de &&**:
```java
// Ambos métodos DEVEM executar (efeitos colaterais necessários)
boolean resultado = salvarUsuario() & enviarEmail();
// Ambos são executados, independente do resultado de salvarUsuario()
```

### 9. Combinação com Operador Ternário

**Short-circuit dentro de ternário**:
```java
String texto = null;

// Short-circuit evita NPE
String resultado = (texto != null && texto.length() > 0) 
                   ? texto.toUpperCase() 
                   : "VAZIO";
System.out.println(resultado);  // "VAZIO"
```

### 10. Debugging e Short-Circuit

**Problema: método não executado em debug**:
```java
boolean resultado = false && metodoComBreakpoint();
// Breakpoint em metodoComBreakpoint() NÃO será atingido!
```

**Solução para debug**:
```java
// Opção 1: use & temporariamente
boolean resultado = false & metodoComBreakpoint();  // Executa sempre

// Opção 2: separe em variáveis
boolean primeira = false;
boolean segunda = metodoComBreakpoint();  // Sempre executa
boolean resultado = primeira && segunda;
```

---

## 🔍 Análise Conceitual Profunda

### Por que Short-Circuit Existe?

**1. Lógica matemática**:
- Se `A && B` e `A` é false, **não importa** o valor de `B` → resultado é false
- Se `A || B` e `A` é true, **não importa** o valor de `B` → resultado é true

**2. Otimização**:
- Evita avaliações desnecessárias
- Melhora performance em operações caras

**3. Segurança**:
- Previne erros em tempo de execução
- Permite validações em cascata

### Ordem de Avaliação

**Sempre esquerda para direita**:
```java
// Avalia: A → B → C
boolean resultado = A && B && C;

// Se A é false, B e C NÃO são avaliados
// Se A é true e B é false, C NÃO é avaliado
// Só se A e B forem true, C é avaliado
```

### Regras de Short-Circuit

**AND (`&&`)**:
| 1ª Expressão | 2ª Expressão | Resultado | 2ª Avaliada? |
|-------------|-------------|-----------|-------------|
| false       | (qualquer)  | false     | ❌ NÃO       |
| true        | true        | true      | ✅ SIM       |
| true        | false       | false     | ✅ SIM       |

**OR (`||`)**:
| 1ª Expressão | 2ª Expressão | Resultado | 2ª Avaliada? |
|-------------|-------------|-----------|-------------|
| true        | (qualquer)  | true      | ❌ NÃO       |
| false       | true        | true      | ✅ SIM       |
| false       | false       | false     | ✅ SIM       |

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação de Null em Cascata

```java
public class ProcessadorPedido {
    public String obterNomeCliente(Pedido pedido) {
        // Validação em cascata com short-circuit
        if (pedido != null && 
            pedido.getCliente() != null && 
            pedido.getCliente().getNome() != null) {
            return pedido.getCliente().getNome();
        }
        return "Desconhecido";
    }
}
```

### Caso 2: Cache com Fallback

```java
public class CacheService<K, V> {
    private Map<K, V> cache = new HashMap<>();
    
    public V obter(K chave) {
        // Tenta cache primeiro (rápido), depois banco (lento)
        V valor = cache.get(chave);
        
        if (valor != null || (valor = buscarNoBanco(chave)) != null) {
            if (!cache.containsKey(chave)) {
                cache.put(chave, valor);
            }
            return valor;
        }
        
        return null;
    }
}
```

### Caso 3: Validação de Permissões

```java
public class SistemaAcesso {
    public boolean podeEditarDocumento(Usuario usuario, Documento doc) {
        // Para no primeiro true (eficiente)
        return usuario.isAdmin() ||
               usuario.getId().equals(doc.getAutorId()) ||
               doc.getEditores().contains(usuario.getId());
    }
}
```

### Caso 4: Operações Matemáticas Seguras

```java
public class CalculadoraSegura {
    public double dividir(double a, double b) {
        // Verifica divisor antes de dividir
        if (b != 0 && !Double.isNaN(b) && !Double.isInfinite(b)) {
            return a / b;
        }
        throw new IllegalArgumentException("Divisor inválido");
    }
}
```

### Caso 5: Loop com Múltiplas Condições de Saída

```java
public class BuscaBinaria {
    public int buscar(int[] array, int valor) {
        int inicio = 0;
        int fim = array.length - 1;
        
        // Continua enquanto intervalo válido E não encontrou
        while (inicio <= fim && array[(inicio + fim) / 2] != valor) {
            int meio = (inicio + fim) / 2;
            
            if (array[meio] < valor) {
                inicio = meio + 1;
            } else {
                fim = meio - 1;
            }
        }
        
        return (inicio <= fim) ? (inicio + fim) / 2 : -1;
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Efeitos Colaterais Podem Não Executar

**Problema**: Código com efeito colateral não executa.
```java
int contador = 0;

// contador NÃO incrementa (short-circuit)
if (false && ++contador > 0) { }
System.out.println(contador);  // 0

// ✅ Solução: separe
contador++;
if (false && contador > 0) { }
```

### 2. Ordem Importa

**Problema**: Ordem errada causa erro ou ineficiência.
```java
String texto = null;

// ❌ ERRO: NullPointerException
// if (texto.length() > 0 && texto != null) { }

// ✅ CORRETO: null check primeiro
if (texto != null && texto.length() > 0) { }
```

### 3. Debugging Complicado

**Problema**: Breakpoints não atingidos.
```java
// Breakpoint em metodo() NÃO será atingido
boolean r = false && metodo();

// ✅ Para debug, use &
boolean r = false & metodo();  // Sempre executa
```

### 4. Performance Não Garantida em Todos os Casos

**Problema**: JVM pode reordenar código.
```java
// JIT compiler pode otimizar de formas inesperadas
// Não dependa APENAS de short-circuit para otimização crítica
```

### 5. Não Funciona com & e |

**Problema**: Confundir operadores.
```java
// ❌ Sem short-circuit: sempre avalia ambos
if (texto != null & texto.length() > 0) { }  // NPE se null!

// ✅ Com short-circuit
if (texto != null && texto.length() > 0) { }
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Operador AND (`&&`)**: Implementa short-circuit para AND
- **Operador OR (`||`)**: Implementa short-circuit para OR
- **Operadores bit a bit (`&`, `|`)**: Não implementam short-circuit
- **Lazy evaluation**: Conceito similar em programação funcional
- **Precedência de operadores**: Afeta ordem de avaliação
- **NullPointerException**: Short-circuit previne
- **Otimização de código**: Técnica de performance

---

## 🚀 Boas Práticas

1. ✅ **Coloque verificações de null primeiro**
   ```java
   if (objeto != null && objeto.metodo()) {  // ✅ Seguro
       // ...
   }
   ```

2. ✅ **Coloque condições rápidas antes de lentas**
   ```java
   if (condicaoRapida() && condicaoLenta()) {  // ✅ Otimizado
       // ...
   }
   ```

3. ✅ **Use && e || (não & e |) para condições booleanas**
   ```java
   if (a && b) {  // ✅ Short-circuit
       // ...
   }
   ```

4. ✅ **Evite efeitos colaterais em condições**
   ```java
   // ❌ Evitar
   if (false && ++contador > 0) { }
   
   // ✅ Preferir
   contador++;
   if (false && contador > 0) { }
   ```

5. ✅ **Use parênteses para clareza**
   ```java
   if ((a != null) && (a.metodo())) {  // ✅ Claro
       // ...
   }
   ```

6. ✅ **Documente dependências de ordem**
   ```java
   // Verifica null antes de acessar propriedade (short-circuit)
   if (pedido != null && pedido.getTotal() > 100) {
       // ...
   }
   ```

7. ✅ **Para debug, temporariamente use & ou |**
   ```java
   // Debug: força execução de ambos lados
   boolean resultado = condicao1() & condicao2();
   ```

8. ✅ **Combine com Optional para null-safety**
   ```java
   // Java 8+
   Optional.ofNullable(objeto)
           .filter(o -> o.metodo())  // Short-circuit implícito
           .ifPresent(o -> processar(o));
   ```

9. ✅ **Use switch/case para múltiplas condições igualdade**
   ```java
   // ❌ Menos eficiente
   if (x == 1 || x == 2 || x == 3 || x == 4) { }
   
   // ✅ Mais claro
   switch (x) {
       case 1: case 2: case 3: case 4:
           // ...
   }
   ```

10. ✅ **Separe lógica complexa em métodos nomeados**
    ```java
    boolean usuarioValido = usuario != null && usuario.isAtivo();
    boolean temPermissao = usuarioValido && usuario.isAdmin();
    
    if (temPermissao) {  // ✅ Legível e usa short-circuit
        // ...
    }
    ```
