# Deslocamento à Esquerda (<<)

## 🎯 Introdução e Definição

### Definição Conceitual

O **operador de deslocamento à esquerda (`<<`)** em Java move os bits de um número para a **esquerda** por uma quantidade especificada de posições. Os bits que "saem" pela esquerda são descartados, e **zeros** são inseridos à direita.

**Sintaxe**:
```java
int resultado = valor << numPosicoes;
```

**Regra fundamental**: Desloca bits à esquerda, preenchendo com zeros à direita.

**Efeito matemático**: Multiplicação por potências de 2.
```
valor << n  ≡  valor × 2ⁿ
```

**Exemplo básico**:
```java
int a = 5;  // Binário: 0000 0101
int resultado = a << 2;

// Operação:
//   0000 0101  (5)
// <<2
//   0001 0100  (20)

System.out.println(resultado);  // 20 (= 5 × 2² = 5 × 4)
```

### Características Fundamentais

- 🔢 **Operador binário**: Requer valor e quantidade de deslocamento
- 📊 **Tipos suportados**: `byte`, `short`, `int`, `long`, `char`
- ⚡ **Equivalência matemática**: Multiplicação por 2ⁿ
- 🚀 **Performance**: Muito mais rápido que multiplicação
- 💡 **Uso comum**: Multiplicação rápida, composição de valores, máscaras

---

## 📋 Sumário Conceitual

### Comparação: << vs * (multiplicação)

| Aspecto | `<<` (Deslocamento) | `*` (Multiplicação) |
|---------|-------------------|-------------------|
| **Operação** | Move bits à esquerda | Multiplicação aritmética |
| **Performance** | Extremamente rápido | Mais lento |
| **Uso** | Potências de 2 | Qualquer número |
| **Overflow** | Pode ocorrer (bits perdidos) | Pode ocorrer |
| **Exemplo** | `5 << 2` = 20 | `5 * 4` = 20 |

---

## 🧠 Fundamentos Teóricos

### 1. Operação Básica de Deslocamento

**Exemplo passo a passo**:
```java
int a = 5;  // 0000 0101

// Desloca 1 posição à esquerda
int r1 = a << 1;
//   0000 0101  (5)
// <<1
//   0000 1010  (10)

System.out.println(r1);  // 10 (= 5 × 2)

// Desloca 2 posições à esquerda
int r2 = a << 2;
//   0000 0101  (5)
// <<2
//   0001 0100  (20)

System.out.println(r2);  // 20 (= 5 × 4)

// Desloca 3 posições à esquerda
int r3 = a << 3;
//   0000 0101  (5)
// <<3
//   0010 1000  (40)

System.out.println(r3);  // 40 (= 5 × 8)
```

**Visualização detalhada**:
```java
public class DeslocamentoEsquerda {
    public static void main(String[] args) {
        int a = 5;
        
        for (int i = 0; i <= 4; i++) {
            int resultado = a << i;
            System.out.printf("%d << %d = %d (binário: %s)\n", 
                a, i, resultado, Integer.toBinaryString(resultado));
        }
    }
}

// Saída:
// 5 << 0 = 5 (binário: 101)
// 5 << 1 = 10 (binário: 1010)
// 5 << 2 = 20 (binário: 10100)
// 5 << 3 = 40 (binário: 101000)
// 5 << 4 = 80 (binário: 1010000)
```

### 2. Equivalência com Multiplicação

**Fórmula**: `n << k = n × 2^k`

```java
int n = 7;

// Deslocamento vs Multiplicação
System.out.println(n << 0);  // 7 (= 7 × 2⁰ = 7 × 1)
System.out.println(n << 1);  // 14 (= 7 × 2¹ = 7 × 2)
System.out.println(n << 2);  // 28 (= 7 × 2² = 7 × 4)
System.out.println(n << 3);  // 56 (= 7 × 2³ = 7 × 8)
System.out.println(n << 4);  // 112 (= 7 × 2⁴ = 7 × 16)

// Verificação
System.out.println(7 * 1);   // 7
System.out.println(7 * 2);   // 14
System.out.println(7 * 4);   // 28
System.out.println(7 * 8);   // 56
System.out.println(7 * 16);  // 112
```

**Demonstração de performance**:
```java
public class PerformanceComparacao {
    public static void main(String[] args) {
        int n = 123456;
        int iteracoes = 100_000_000;
        
        // Usando <<
        long inicio = System.nanoTime();
        for (int i = 0; i < iteracoes; i++) {
            int r = n << 3;
        }
        long tempoShift = System.nanoTime() - inicio;
        
        // Usando *
        inicio = System.nanoTime();
        for (int i = 0; i < iteracoes; i++) {
            int r = n * 8;
        }
        long tempoMult = System.nanoTime() - inicio;
        
        System.out.println("Shift: " + tempoShift + " ns");
        System.out.println("Multiplicação: " + tempoMult + " ns");
    }
}
// Shift é geralmente mais rápido (mas compiladores modernos otimizam)
```

### 3. Todos os Tipos Inteiros

**byte (promovido para int)**:
```java
byte b = 5;
int resultado = b << 2;  // byte promovido para int

System.out.println(resultado);  // 20
```

**short (promovido para int)**:
```java
short s = 100;
int resultado = s << 1;

System.out.println(resultado);  // 200
```

**int (32 bits)**:
```java
int i = 1;

// Cria potências de 2
System.out.println(i << 0);   // 1
System.out.println(i << 1);   // 2
System.out.println(i << 2);   // 4
System.out.println(i << 10);  // 1024
System.out.println(i << 20);  // 1048576
```

**long (64 bits)**:
```java
long l = 1L;

// Potências de 2 para long
System.out.println(l << 30);  // 1073741824
System.out.println(l << 40);  // 1099511627776L
System.out.println(l << 50);  // 1125899906842624L
```

### 4. Criar Potências de 2

**Gerar potências de 2**:
```java
public class PotenciasDeDois {
    public static void main(String[] args) {
        for (int i = 0; i <= 10; i++) {
            int potencia = 1 << i;
            System.out.printf("2^%d = %d\n", i, potencia);
        }
    }
}

// Saída:
// 2^0 = 1
// 2^1 = 2
// 2^2 = 4
// 2^3 = 8
// 2^4 = 16
// 2^5 = 32
// 2^6 = 64
// 2^7 = 128
// 2^8 = 256
// 2^9 = 512
// 2^10 = 1024
```

**Constantes comuns**:
```java
int KB = 1 << 10;  // 1024 (1 kilobyte)
int MB = 1 << 20;  // 1048576 (1 megabyte)
int GB = 1 << 30;  // 1073741824 (1 gigabyte)

System.out.println("1 KB = " + KB);
System.out.println("1 MB = " + MB);
System.out.println("1 GB = " + GB);
```

### 5. Máscaras de Bits

**Criar máscara de bit individual**:
```java
// Cria máscara com bit N ligado
int bit0 = 1 << 0;  // 0000 0001
int bit1 = 1 << 1;  // 0000 0010
int bit2 = 1 << 2;  // 0000 0100
int bit3 = 1 << 3;  // 0000 1000
int bit7 = 1 << 7;  // 1000 0000

System.out.println(Integer.toBinaryString(bit3));  // 1000
System.out.println(Integer.toBinaryString(bit7));  // 10000000
```

**Flags com deslocamento**:
```java
public class Flags {
    static final int FLAG_A = 1 << 0;  // 0001
    static final int FLAG_B = 1 << 1;  // 0010
    static final int FLAG_C = 1 << 2;  // 0100
    static final int FLAG_D = 1 << 3;  // 1000
    
    public static void main(String[] args) {
        int config = FLAG_A | FLAG_C;  // 0101
        
        System.out.println("FLAG_A ativo: " + ((config & FLAG_A) != 0));  // true
        System.out.println("FLAG_B ativo: " + ((config & FLAG_B) != 0));  // false
    }
}
```

### 6. Composição de Valores

**Combinar bytes em int**:
```java
public class ComporInt {
    public static int fromBytes(byte b3, byte b2, byte b1, byte b0) {
        return ((b3 & 0xFF) << 24) |
               ((b2 & 0xFF) << 16) |
               ((b1 & 0xFF) << 8)  |
               (b0 & 0xFF);
    }
    
    public static void main(String[] args) {
        byte b3 = (byte) 0x12;
        byte b2 = (byte) 0x34;
        byte b1 = (byte) 0x56;
        byte b0 = (byte) 0x78;
        
        int resultado = fromBytes(b3, b2, b1, b0);
        System.out.printf("0x%08X\n", resultado);  // 0x12345678
    }
}
```

**Compor cor RGB**:
```java
public class CorRGB {
    public static int criarCor(int r, int g, int b) {
        return (r << 16) | (g << 8) | b;
    }
    
    public static int criarCorARGB(int a, int r, int g, int b) {
        return (a << 24) | (r << 16) | (g << 8) | b;
    }
    
    public static void main(String[] args) {
        int cor = criarCor(255, 128, 64);
        System.out.printf("RGB: 0x%06X\n", cor);  // 0xFF8040
        
        int corAlfa = criarCorARGB(255, 255, 128, 64);
        System.out.printf("ARGB: 0x%08X\n", corAlfa);  // 0xFFFF8040
    }
}
```

### 7. Overflow e Bits Perdidos

**Bits que saem pela esquerda são perdidos**:
```java
int a = 0b11000000_00000000_00000000_00000000;  // Bits mais significativos ligados

int resultado = a << 2;
//   11000000 00000000 00000000 00000000
// <<2
//   00000000 00000000 00000000 00000000 (bits perdidos!)

System.out.println(Integer.toBinaryString(resultado));  // 0
```

**Exemplo de overflow**:
```java
int max = Integer.MAX_VALUE;  // 01111111 11111111 11111111 11111111

System.out.println(max);         // 2147483647
System.out.println(max << 1);    // -2 (overflow! Bit de sinal mudou)
```

**Deslocamento seguro**:
```java
public class DeslocamentoSeguro {
    public static int shiftSafe(int n, int shift) {
        // Verifica se deslocamento causaria overflow
        if (shift >= 32) return 0;
        if (n == 0) return 0;
        
        // Verifica se bits significativos serão perdidos
        int bitsSignificativos = 32 - Integer.numberOfLeadingZeros(Math.abs(n));
        if (bitsSignificativos + shift > 31) {
            System.out.println("Aviso: Overflow!");
        }
        
        return n << shift;
    }
}
```

### 8. Quantidade de Deslocamento

**Deslocamento é módulo tamanho do tipo**:
```java
int n = 5;

// Para int (32 bits), deslocamento é & 0x1F (mod 32)
System.out.println(n << 0);   // 5
System.out.println(n << 32);  // 5 (= n << 0, pois 32 % 32 = 0)
System.out.println(n << 33);  // 10 (= n << 1, pois 33 % 32 = 1)

// Para long (64 bits), deslocamento é & 0x3F (mod 64)
long l = 5L;
System.out.println(l << 64);  // 5 (= l << 0)
System.out.println(l << 65);  // 10 (= l << 1)
```

**Demonstração**:
```java
int a = 1;

// Deslocamentos equivalentes
System.out.println(a << 0);   // 1
System.out.println(a << 32);  // 1 (mesmo resultado!)
System.out.println(a << 64);  // 1

// Para long, comportamento diferente
long b = 1L;
System.out.println(b << 0);   // 1
System.out.println(b << 32);  // 4294967296 (diferente!)
System.out.println(b << 64);  // 1 (volta ao início)
```

### 9. Números Negativos

**Deslocamento de número negativo**:
```java
int negativo = -5;  // 11111111 11111111 11111111 11111011

int resultado = negativo << 2;
//   11111111 11111111 11111111 11111011  (-5)
// <<2
//   11111111 11111111 11111111 11101100  (-20)

System.out.println(resultado);  // -20 (= -5 × 4)

// Verificação
System.out.println(-5 * 4);  // -20
```

**Propriedade mantida**:
```java
int n = -10;

// n << k = n × 2^k (mesmo para negativos)
System.out.println(n << 1);  // -20 (= -10 × 2)
System.out.println(n << 2);  // -40 (= -10 × 4)
System.out.println(n << 3);  // -80 (= -10 × 8)
```

### 10. Combinação com Outros Operadores

**Deslocamento e OR**:
```java
int valor = 0;

// Constrói valor bit a bit
valor |= (1 << 0);  // Liga bit 0
valor |= (1 << 2);  // Liga bit 2
valor |= (1 << 5);  // Liga bit 5

System.out.println(Integer.toBinaryString(valor));  // 100101
System.out.println(valor);  // 37
```

**Deslocamento e AND**:
```java
int numero = 0xFF;  // 11111111

// Extrai nibbles e desloca
int nibbleSuperior = (numero & 0xF0) << 0;  // 11110000
int nibbleInferior = (numero & 0x0F) << 4;  // 11110000

System.out.println(Integer.toBinaryString(nibbleSuperior));
System.out.println(Integer.toBinaryString(nibbleInferior));
```

**Prioridade de operadores**:
```java
int resultado = 1 + 2 << 3;
// Multiplicação/soma tem precedência maior que shift
// = (1 + 2) << 3
// = 3 << 3
// = 24

System.out.println(resultado);  // 24
```

---

## 🔍 Análise Conceitual Profunda

### Por Que Deslocamento é Rápido?

**Nível de hardware**:
- CPU tem circuitos dedicados para shift (barrel shifter)
- Operação de 1 ciclo de clock
- Multiplicação requer vários ciclos

**Compiladores modernos**:
- Otimizam `n * potência_de_2` para `n << k`
- Mas deslocamento explícito ainda é útil

### Aplicações Matemáticas

**Divisão e multiplicação rápida**:
```java
// Multiplicar por 2, 4, 8, ...
n << 1  // n × 2
n << 2  // n × 4
n << 3  // n × 8

// Mais rápido que:
n * 2
n * 4
n * 8
```

**Alinhamento de memória**:
```java
// Alinhar para múltiplo de 4 (deslocar e deslocar de volta)
int endereco = 1023;
int alinhado = (endereco >> 2) << 2;
System.out.println(alinhado);  // 1020
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Constantes de Tamanho

```java
public class ConstantesTamanho {
    // Tamanhos de dados
    static final int B = 1;
    static final int KB = 1 << 10;   // 1024
    static final int MB = 1 << 20;   // 1048576
    static final int GB = 1 << 30;   // 1073741824
    
    // Tamanhos de buffer
    static final int BUFFER_4K = 4 << 10;   // 4096
    static final int BUFFER_8K = 8 << 10;   // 8192
    static final int BUFFER_64K = 64 << 10; // 65536
    
    public static void main(String[] args) {
        System.out.println("4KB buffer: " + BUFFER_4K);
    }
}
```

### Caso 2: Máscaras de Bits

```java
public class SistemaPerm issoes {
    // Permissões usando deslocamento
    static final int PERM_READ    = 1 << 0;  // 0001
    static final int PERM_WRITE   = 1 << 1;  // 0010
    static final int PERM_EXECUTE = 1 << 2;  // 0100
    static final int PERM_DELETE  = 1 << 3;  // 1000
    
    public static boolean temPermissao(int usuario, int permissao) {
        return (usuario & permissao) != 0;
    }
    
    public static void main(String[] args) {
        int usuario = PERM_READ | PERM_WRITE;
        
        System.out.println("Pode ler: " + temPermissao(usuario, PERM_READ));    // true
        System.out.println("Pode deletar: " + temPermissao(usuario, PERM_DELETE)); // false
    }
}
```

### Caso 3: Codificação de Dados

```java
public class CodificadorProtocolo {
    // Protocolo: [comando:8][id:16][dados:8]
    public static int codificar(byte comando, short id, byte dados) {
        return ((comando & 0xFF) << 24) |
               ((id & 0xFFFF) << 8) |
               (dados & 0xFF);
    }
    
    public static byte getComando(int pacote) {
        return (byte) (pacote >> 24);
    }
    
    public static short getId(int pacote) {
        return (short) (pacote >> 8);
    }
    
    public static byte getDados(int pacote) {
        return (byte) pacote;
    }
}
```

### Caso 4: Hash Functions

```java
public class HashFunction {
    public static int hash(String str) {
        int hash = 0;
        for (char c : str.toCharArray()) {
            hash = (hash << 5) - hash + c;  // hash * 31 + c
        }
        return hash;
    }
    
    public static void main(String[] args) {
        System.out.println(hash("Java"));
    }
}
```

### Caso 5: Bitmap/BitSet

```java
public class SimpleBitSet {
    private int[] bits;
    
    public SimpleBitSet(int size) {
        bits = new int[(size + 31) >> 5];  // Divide por 32
    }
    
    public void set(int index) {
        int wordIndex = index >> 5;  // Divide por 32
        int bitIndex = index & 0x1F;  // Módulo 32
        bits[wordIndex] |= (1 << bitIndex);
    }
    
    public boolean get(int index) {
        int wordIndex = index >> 5;
        int bitIndex = index & 0x1F;
        return (bits[wordIndex] & (1 << bitIndex)) != 0;
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Overflow Silencioso

**Problema**: Bits podem ser perdidos.
```java
int grande = 1_000_000_000;
int resultado = grande << 3;  // Overflow!

System.out.println(resultado);  // Valor inesperado
```

### 2. Deslocamento Negativo Não Existe

**Problema**: Quantidade negativa de deslocamento.
```java
int n = 8;

// ❌ Não faz sentido
// n << -1

// ✅ Use deslocamento à direita
int resultado = n >> 1;  // 4
```

### 3. Deslocamento >= Tamanho do Tipo

**Problema**: Comportamento pode surpreender.
```java
int n = 5;

// Deslocamento é módulo 32 para int
System.out.println(n << 32);  // 5 (não 0!)
System.out.println(n << 33);  // 10 (= n << 1)
```

### 4. Promoção de Tipos

**Problema**: byte/short promovidos para int.
```java
byte b = 5;
byte resultado = (byte) (b << 2);  // Cast necessário
```

### 5. Não Substitui Multiplicação Arbitrária

**Problema**: Só funciona para potências de 2.
```java
// ✅ Bom para potências de 2
int r1 = n << 3;  // n × 8

// ❌ Não funciona para outros números
// int r2 = n << ???;  // Como fazer n × 10?
int r2 = n * 10;  // Use multiplicação normal
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Deslocamento à direita (`>>`)**: Operação inversa (divisão)
- **Deslocamento sem sinal (`>>>`)**: Deslocamento lógico
- **Multiplicação (`*`)**: Equivalente para potências de 2
- **Operador OR (`|`)**: Usado com `<<` para compor valores
- **Operador AND (`&`)**: Usado com `<<` para máscaras
- **Potências de 2**: Base matemática do deslocamento

---

## 🚀 Boas Práticas

1. ✅ **Use para potências de 2**
   ```java
   int KB = 1 << 10;  // Mais claro que 1024
   ```

2. ✅ **Flags com deslocamento**
   ```java
   static final int FLAG_A = 1 << 0;
   static final int FLAG_B = 1 << 1;
   ```

3. ✅ **Documente intenção**
   ```java
   // Multiplica por 8 (2³)
   int resultado = n << 3;
   ```

4. ✅ **Combine com OR para composição**
   ```java
   int cor = (r << 16) | (g << 8) | b;
   ```

5. ✅ **Verifique overflow em dados sensíveis**
   ```java
   if (bitsSignificativos + shift > 31) {
       throw new ArithmeticException("Overflow");
   }
   ```

6. ✅ **Use parênteses para clareza**
   ```java
   int resultado = (a << 2) + b;  // Clara precedência
   ```

7. ✅ **Prefira literal binário para flags**
   ```java
   // ✅ Claro
   int flag = 1 << 5;
   
   // ❌ Menos claro
   int flag = 0b100000;  // (embora equivalente)
   ```

8. ✅ **Máscara & 0xFF antes de deslocar bytes**
   ```java
   int resultado = (b & 0xFF) << 8;  // Evita extensão de sinal
   ```

9. ✅ **Consistência em constantes**
   ```java
   static final int SIZE_1K = 1 << 10;
   static final int SIZE_2K = 2 << 10;
   static final int SIZE_4K = 4 << 10;
   ```

10. ✅ **Lembre-se: deslocamento é módulo tamanho**
    ```java
    // int: shift & 0x1F (mod 32)
    // long: shift & 0x3F (mod 64)
    ```

