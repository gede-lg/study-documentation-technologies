# NOT Bit a Bit (~)

## 🎯 Introdução e Definição

### Definição Conceitual

O **operador NOT bit a bit (`~`)**, também conhecido como **complemento bit a bit** ou **inversão bit a bit**, é um operador **unário** que inverte **todos os bits** de um operando inteiro. Cada bit `0` se torna `1`, e cada bit `1` se torna `0`.

**Sintaxe**:
```java
int resultado = ~operando;
```

**Regra fundamental**: Inverte **TODOS os bits** do número (complemento de 1).

**Tabela de inversão**:
| Bit Original | ~Bit |
|-------------|------|
| 0 | **1** |
| 1 | **0** |

**Exemplo básico**:
```java
int a = 12;  // Binário: 0000 1100
int resultado = ~a;

// Operação bit a bit (em 8 bits para visualização):
//   0000 1100  (12)
// ~ ----------
//   1111 0011  (-13 em complemento de 2)

System.out.println(resultado);  // -13
```

### Características Fundamentais

- 🔢 **Operador unário**: Opera em **um único** operando
- 📊 **Tipos suportados**: `byte`, `short`, `int`, `long`, `char`
- 🔄 **Inverte todos bits**: Não há bits que permanecem inalterados
- ⚡ **Performance**: Operação muito rápida (nível de hardware)
- 💡 **Uso comum**: Criar máscaras invertidas, limpar bits, complemento

---

## 📋 Sumário Conceitual

### Relação com Complemento de 2

**Importante**: `~n` NÃO é igual a `-n`!

| Expressão | Fórmula | Exemplo (n=5) |
|-----------|---------|---------------|
| **~n** | Complemento de 1 | ~5 = -6 |
| **-n** | Negativo | -5 |
| **~n + 1** | Complemento de 2 | ~5 + 1 = -5 |

**Relação matemática**:
```java
~n == -(n + 1)
```

---

## 🧠 Fundamentos Teóricos

### 1. Operação Bit a Bit Básica

**Exemplo com 8 bits**:
```java
byte a = 12;  // 0000 1100

byte resultado = (byte) ~a;

// Bit a bit:
// Posição: 7 6 5 4 3 2 1 0
//      a:  0 0 0 0 1 1 0 0
// ~    :  1 1 1 1 0 0 1 1  = -13

System.out.println(resultado);  // -13
```

**Visualização detalhada**:
```java
public class NOTBitABit {
    public static void main(String[] args) {
        int a = 12;
        int resultado = ~a;
        
        System.out.println("a     = " + a);
        System.out.println("~a    = " + resultado);
        System.out.println("a     (binário): " + Integer.toBinaryString(a));
        System.out.println("~a    (binário): " + Integer.toBinaryString(resultado));
    }
}

// Saída:
// a     = 12
// ~a    = -13
// a     (binário): 1100
// ~a    (binário): 11111111111111111111111111110011
```

### 2. Por Que ~12 = -13?

**Explicação usando complemento de 2** (int de 32 bits):
```java
int a = 12;

// Representação binária de 12 (32 bits):
// 00000000 00000000 00000000 00001100

// Após NOT (~):
// 11111111 11111111 11111111 11110011

// Em complemento de 2, isso representa -13:
// 1. Bit de sinal = 1 (negativo)
// 2. Valor absoluto:
//    Inverte: 00000000 00000000 00000000 00001100
//    +1:      00000000 00000000 00000000 00001101 = 13
// 3. Logo: -13
```

**Fórmula geral**:
```java
~n == -(n + 1)

// Exemplos:
~0 = -1
~1 = -2
~5 = -6
~(-1) = 0
~(-5) = 4
```

**Demonstração**:
```java
for (int i = -5; i <= 5; i++) {
    System.out.printf("~%d = %d\n", i, ~i);
}

// Saída:
// ~-5 = 4
// ~-4 = 3
// ~-3 = 2
// ~-2 = 1
// ~-1 = 0
// ~0 = -1
// ~1 = -2
// ~2 = -3
// ~3 = -4
// ~4 = -5
// ~5 = -6
```

### 3. Todos os Tipos Inteiros

**byte (8 bits)**:
```java
byte a = 12;   // 0000 1100
byte resultado = (byte) ~a;

System.out.println(resultado);  // -13
```

**short (16 bits)**:
```java
short a = 255;  // 0000 0000 1111 1111
short resultado = (short) ~a;

System.out.println(resultado);  // -256
```

**int (32 bits)**:
```java
int a = 0xFF;  // 0000 0000 ... 1111 1111
int resultado = ~a;

System.out.println(resultado);  // -256
```

**long (64 bits)**:
```java
long a = 0xFFFFFFFFL;
long resultado = ~a;

System.out.println(Long.toHexString(resultado));  // ffffffff00000000
```

### 4. Criar Máscaras Invertidas

**Desligar bits específicos**:
```java
int flags = 0b11111111;  // Todos bits ligados

// Desliga bit 2
int mascara = 0b00000100;
flags &= ~mascara;
//   11111111
// & ~00000100  (= 11111011)
// -----------
//   11111011

System.out.println(Integer.toBinaryString(flags));  // 11111011
```

**Limpar múltiplos bits**:
```java
int numero = 0b11111111;  // 255

// Limpa 4 bits inferiores
int mascara = 0b00001111;
numero &= ~mascara;
//   11111111
// & ~00001111  (= 11110000)
// -----------
//   11110000

System.out.println(Integer.toBinaryString(numero));  // 11110000
```

**Padrão comum: Limpar e definir**:
```java
int config = 0xFF;  // 11111111

int BITS_A_SUBSTITUIR = 0x0F;  // 00001111
int NOVO_VALOR = 0x05;         // 00000101

// Limpa bits e define novos valores
config = (config & ~BITS_A_SUBSTITUIR) | NOVO_VALOR;
//   (11111111 & ~00001111) | 00000101
//   (11111111 &  11110000) | 00000101
//         11110000         | 00000101
//              11110101

System.out.printf("0x%02X\n", config);  // 0xF5
```

### 5. Verificação de Bits

**Todos bits ligados**:
```java
// -1 em complemento de 2 = todos bits ligados
int todosBitsLigados = -1;
System.out.println(Integer.toBinaryString(todosBitsLigados));
// 11111111111111111111111111111111

// Outra forma:
int todosBits = ~0;
System.out.println(todosBits);  // -1
```

**Inverter flags**:
```java
public class FlagsInvertidas {
    static final int FLAG_A = 0b0001;
    static final int FLAG_B = 0b0010;
    static final int FLAG_C = 0b0100;
    
    public static void main(String[] args) {
        int flags = FLAG_A | FLAG_C;  // 0101
        
        // Inverte todas as flags (em 4 bits)
        int invertido = ~flags & 0b1111;  // Máscara para 4 bits
        System.out.println(Integer.toBinaryString(invertido));  // 1010
    }
}
```

### 6. Complemento de 2: Negativo

**Relação ~n + 1 = -n**:
```java
int n = 5;

// Negativo usando NOT
int negativo = ~n + 1;
System.out.println(negativo);  // -5

// Verificação:
System.out.println(-n);  // -5 (mesmo resultado)
```

**Demonstração manual**:
```java
// n = 5 = 0000 0101
// ~n    = 1111 1010  (-6)
// ~n+1  = 1111 1011  (-5)

int n = 5;
System.out.println(~n);      // -6
System.out.println(~n + 1);  // -5
System.out.println(-n);      // -5
```

### 7. Máscara de Bits Completa

**Criar máscara de N bits**:
```java
public class MascaraBits {
    public static int criarMascara(int numBits) {
        if (numBits <= 0) return 0;
        if (numBits >= 32) return -1;
        
        // (1 << numBits) - 1
        return ~(~0 << numBits);
    }
    
    public static void main(String[] args) {
        System.out.println(Integer.toBinaryString(criarMascara(4)));  // 1111
        System.out.println(Integer.toBinaryString(criarMascara(8)));  // 11111111
    }
}
```

**Máscara invertida de N bits**:
```java
public class MascaraInvertida {
    public static int mascaraInvertidaNBits(int numBits) {
        // Inverte os N bits inferiores
        return ~0 << numBits;
    }
    
    public static void main(String[] args) {
        int mascara = mascaraInvertidaNBits(4);
        System.out.println(Integer.toBinaryString(mascara));
        // 11111111111111111111111111110000
    }
}
```

### 8. Operação com Números Negativos

**NOT de número negativo**:
```java
int n = -5;  // 11111111 11111111 11111111 11111011

int resultado = ~n;
// ~11111111 11111111 11111111 11111011
//  00000000 00000000 00000000 00000100 = 4

System.out.println(resultado);  // 4
```

**Padrão: ~(-n) = n - 1**:
```java
int n = 5;

System.out.println(~(-n));  // 4 (= n - 1)
System.out.println(~(-10)); // 9
```

### 9. Dupla Inversão

**Propriedade: ~~n = n**:
```java
int n = 42;

int invertido = ~n;
int original = ~invertido;

System.out.println(original);  // 42 (igual a n)

// Demonstração:
// ~(~n) = ~(-(n+1)) = -(-(n+1)+1) = -(-n-1+1) = -(-n) = n
```

### 10. Limpeza de Bits com NOT

**Desligar bit específico**:
```java
public class LimparBit {
    public static int desligarBit(int numero, int posicao) {
        // Cria máscara com bit da posição desligado
        int mascara = ~(1 << posicao);
        return numero & mascara;
    }
    
    public static void main(String[] args) {
        int numero = 0b11111111;  // Todos bits ligados
        
        // Desliga bit 3
        numero = desligarBit(numero, 3);
        System.out.println(Integer.toBinaryString(numero));  // 11110111
    }
}
```

**Limpar range de bits**:
```java
public class LimparRange {
    public static int limparBits(int numero, int inicio, int fim) {
        // Cria máscara com bits [inicio, fim] desligados
        int mascara = ~(((1 << (fim - inicio + 1)) - 1) << inicio);
        return numero & mascara;
    }
    
    public static void main(String[] args) {
        int numero = 0xFF;  // 11111111
        
        // Limpa bits [2, 5]
        numero = limparBits(numero, 2, 5);
        System.out.println(Integer.toBinaryString(numero));  // 11000011
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Complemento de 1 vs Complemento de 2

**Complemento de 1** (`~n`):
- Inverte todos os bits
- Não é diretamente o negativo

**Complemento de 2** (`~n + 1`):
- Complemento de 1 + 1
- Representa o negativo em Java

**Comparação**:
```java
int n = 5;

// Complemento de 1
int comp1 = ~n;      // -6

// Complemento de 2
int comp2 = ~n + 1;  // -5 (= -n)

System.out.println(comp1);  // -6
System.out.println(comp2);  // -5
System.out.println(-n);     // -5
```

### Por Que ~0 = -1?

```java
int zero = 0;
// Binário: 00000000 00000000 00000000 00000000

int resultado = ~zero;
// Binário: 11111111 11111111 11111111 11111111

// Em complemento de 2, isso é -1:
// 1. Bit de sinal = 1 (negativo)
// 2. Inverte: 00000000 00000000 00000000 00000000
// 3. +1:      00000000 00000000 00000000 00000001 = 1
// 4. Logo: -1

System.out.println(resultado);  // -1
```

### Propriedades Matemáticas

**Involutiva** (dupla inversão retorna original):
```java
~~n == n
```

**Relação com negativo**:
```java
~n == -(n + 1)
~n + 1 == -n
```

**Identidade com -1**:
```java
~(-1) == 0
~0 == -1
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Desligar Bits Específicos

```java
public class GerenciadorFlags {
    static final int FLAG_DEBUG   = 0b0001;
    static final int FLAG_VERBOSE = 0b0010;
    static final int FLAG_LOG     = 0b0100;
    
    private int flags = 0;
    
    public void ativar(int flag) {
        flags |= flag;
    }
    
    public void desativar(int flag) {
        flags &= ~flag;  // NOT inverte a máscara
    }
    
    public boolean isAtivo(int flag) {
        return (flags & flag) != 0;
    }
    
    public void exemplo() {
        ativar(FLAG_DEBUG | FLAG_LOG);
        System.out.println("Debug: " + isAtivo(FLAG_DEBUG));  // true
        
        desativar(FLAG_DEBUG);
        System.out.println("Debug: " + isAtivo(FLAG_DEBUG));  // false
    }
}
```

### Caso 2: Substituir Bits

```java
public class SubstituirBits {
    public static int substituir(int numero, int mascara, int novoValor) {
        // 1. Limpa bits usando ~mascara
        // 2. Define novos valores
        return (numero & ~mascara) | (novoValor & mascara);
    }
    
    public static void main(String[] args) {
        int numero = 0b11111111;  // 255
        int mascara = 0b00001111;  // 4 bits inferiores
        int novoValor = 0b00000101;  // 5
        
        int resultado = substituir(numero, mascara, novoValor);
        System.out.println(Integer.toBinaryString(resultado));  // 11110101
    }
}
```

### Caso 3: Máscara de Extração

```java
public class ExtrairComponenteRGB {
    public static int definirVermelho(int cor, int r) {
        // Limpa componente vermelho e define novo
        return (cor & ~0x00FF0000) | ((r & 0xFF) << 16);
    }
    
    public static int definirVerde(int cor, int g) {
        return (cor & ~0x0000FF00) | ((g & 0xFF) << 8);
    }
    
    public static int definirAzul(int cor, int b) {
        return (cor & ~0x000000FF) | (b & 0xFF);
    }
    
    public static void main(String[] args) {
        int cor = 0x00AA5533;
        
        cor = definirVermelho(cor, 0xFF);
        System.out.printf("0x%08X\n", cor);  // 0x00FF5533
    }
}
```

### Caso 4: Criar Todas Variações de Bits

```java
public class VariacoesBits {
    public static void gerarVariacoes(int numBits) {
        int total = 1 << numBits;
        for (int i = 0; i < total; i++) {
            System.out.println(Integer.toBinaryString(i));
        }
    }
    
    public static void gerarInvertidas(int numBits) {
        int mascara = (1 << numBits) - 1;
        for (int i = 0; i < (1 << numBits); i++) {
            int invertido = ~i & mascara;
            System.out.println(Integer.toBinaryString(invertido));
        }
    }
}
```

### Caso 5: Limpar Range de Bits

```java
public class ManipuladorBits {
    // Limpa bits da posição 'inicio' até 'fim' (inclusivo)
    public static int limparRange(int numero, int inicio, int fim) {
        int numBits = fim - inicio + 1;
        int mascara = ((1 << numBits) - 1) << inicio;
        return numero & ~mascara;
    }
    
    public static void main(String[] args) {
        int numero = 0xFF;  // 11111111
        
        // Limpa bits [3, 6]
        numero = limparRange(numero, 3, 6);
        System.out.println(Integer.toBinaryString(numero));  // 10000111
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Não é Negativo Direto

**Problema**: `~n` não é igual a `-n`.
```java
int n = 5;

System.out.println(~n);   // -6 (NÃO -5!)
System.out.println(-n);   // -5

// Para negativo: ~n + 1
System.out.println(~n + 1);  // -5
```

### 2. Promoção de Tipos

**Problema**: NOT promove para int.
```java
byte b = 12;

// ❌ ERRO
// byte resultado = ~b;

// ✅ Cast necessário
byte resultado = (byte) ~b;
```

### 3. Máscara Necessária para Tipos Menores

**Problema**: NOT em byte estende sinal.
```java
byte b = 5;
int resultado = ~b;

System.out.println(resultado);  // -6 (não 250!)

// Para comportamento unsigned:
int resultadoUnsigned = ~b & 0xFF;
System.out.println(resultadoUnsigned);  // 250
```

### 4. Duplo NOT é Identidade

**Problema**: ~~n retorna n (não faz nada útil).
```java
int n = 42;
System.out.println(~~n);  // 42 (inútil)
```

### 5. Cuidado com Literais

**Problema**: NOT de literal pode confundir.
```java
// ❌ Confuso
int mascara = ~0xFF;

// ✅ Mais claro
int mascara = 0xFFFFFF00;
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Operador AND (`&`)**: Usado com `~` para limpar bits
- **Operador OR (`|`)**: Usado com `~` para substituir bits
- **Operador XOR (`^`)**: Inverte bits seletivamente
- **Complemento de 2**: `~n + 1 = -n`
- **Negação (`-`)**: `-n = ~n + 1`
- **Deslocamento**: Combinado com `~` para máscaras

---

## 🚀 Boas Práticas

1. ✅ **Use ~mascara para desligar bits**
   ```java
   flags &= ~MASCARA;  // Desliga bits da máscara
   ```

2. ✅ **Combine com AND para limpar**
   ```java
   numero = numero & ~BITS_A_LIMPAR;
   ```

3. ✅ **Padrão: limpar e definir**
   ```java
   valor = (valor & ~MASCARA) | NOVO_VALOR;
   ```

4. ✅ **Use ~0 para todos bits ligados**
   ```java
   int todosBits = ~0;  // -1 (todos bits ligados)
   ```

5. ✅ **Máscara para tipos menores**
   ```java
   byte b = (byte) ~valor;
   int unsignedResult = ~valor & 0xFF;
   ```

6. ✅ **Documente inversões**
   ```java
   // Inverte máscara para limpar bits
   config &= ~DEBUG_FLAG;
   ```

7. ✅ **Use constantes nomeadas**
   ```java
   final int LIMPAR_NIBBLE_INFERIOR = ~0x0F;
   ```

8. ✅ **Complemento de 2 para negativo**
   ```java
   int negativo = ~n + 1;  // Equivalente a -n
   ```

9. ✅ **Evite duplo NOT**
   ```java
   // ❌ Inútil
   int x = ~~valor;
   
   // ✅ Simplesmente
   int x = valor;
   ```

10. ✅ **Combine com deslocamento para máscaras**
    ```java
    int mascara = ~(~0 << numBits);  // N bits ligados
    ```

