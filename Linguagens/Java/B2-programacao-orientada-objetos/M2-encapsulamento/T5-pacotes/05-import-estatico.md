# T5.05 - Import Estático (Static Import)

## Introdução

**Import estático** permite importar **membros estáticos** (métodos, constantes) diretamente, sem prefixo de classe.

**Sem static import**:
```java
Math.sqrt(16);
System.out.println("Olá");
Collections.sort(lista);
```

**Com static import**:
```java
import static java.lang.Math.sqrt;
import static java.lang.System.out;
import static java.util.Collections.sort;

sqrt(16);
out.println("Olá");
sort(lista);
```

---

## Fundamentos

### 1. Sintaxe de Static Import

**Importar membro específico**:
```java
import static pacote.Classe.membro;
```

**Importar todos membros**:
```java
import static pacote.Classe.*;
```

**Exemplo**:
```java
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;
import static java.lang.Math.pow;

public class Calculo {
    public double areaCirculo(double raio) {
        return PI * pow(raio, 2);
    }
    
    public double raizQuadrada(double numero) {
        return sqrt(numero);
    }
}
```

### 2. Import Estático de Métodos

**Sem static import**:
```java
public class Exemplo {
    public void testar() {
        Math.sqrt(25);
        Math.abs(-10);
        Math.max(5, 10);
    }
}
```

**Com static import**:
```java
import static java.lang.Math.sqrt;
import static java.lang.Math.abs;
import static java.lang.Math.max;

public class Exemplo {
    public void testar() {
        sqrt(25);
        abs(-10);
        max(5, 10);
    }
}
```

### 3. Import Estático de Constantes

**Sem static import**:
```java
public class Fisica {
    public double calcular() {
        double pi = Math.PI;
        double e = Math.E;
        return pi * e;
    }
}
```

**Com static import**:
```java
import static java.lang.Math.PI;
import static java.lang.Math.E;

public class Fisica {
    public double calcular() {
        return PI * E;
    }
}
```

### 4. Wildcard em Static Import

**Importar todos membros**:
```java
import static java.lang.Math.*;

public class Matematica {
    public void calcular() {
        double a = PI;
        double b = sqrt(16);
        double c = pow(2, 3);
        double d = abs(-5);
    }
}
```

**Cuidado**: Pode causar conflitos e reduzir legibilidade.

### 5. Static Import em Testes (JUnit)

**Uso comum**: Métodos de assert em testes.

**Sem static import**:
```java
import org.junit.Assert;

public class CalculadoraTest {
    @Test
    public void testarSoma() {
        Assert.assertEquals(5, 2 + 3);
        Assert.assertTrue(10 > 5);
        Assert.assertNotNull(new Calculadora());
    }
}
```

**Com static import**:
```java
import static org.junit.Assert.*;

public class CalculadoraTest {
    @Test
    public void testarSoma() {
        assertEquals(5, 2 + 3);
        assertTrue(10 > 5);
        assertNotNull(new Calculadora());
    }
}
```

### 6. Static Import de Enums

**Sem static import**:
```java
public class Exemplo {
    public void processar() {
        if (status == Status.ATIVO) {
            // ...
        }
    }
}
```

**Com static import**:
```java
import static br.com.empresa.modelo.Status.*;

public class Exemplo {
    public void processar() {
        if (status == ATIVO) { // Sem prefixo Status
            // ...
        }
    }
}
```

**Útil em switch**:
```java
import static br.com.empresa.modelo.Dia.*;

switch (dia) {
    case SEGUNDA:
    case TERCA:
    case QUARTA:
        return "Dia útil";
    default:
        return "Final de semana";
}
```

### 7. Conflito de Nomes

**Problema**: Membro local com mesmo nome que importado.

```java
import static java.lang.Math.PI;

public class Circulo {
    private static final double PI = 3.14; // Conflito
    
    public double calcular() {
        return PI; // Usa PI local, não Math.PI
    }
}
```

**Solução**: Evitar conflitos ou usar nome completo (`Math.PI`).

### 8. Precedência de Membros Locais

**Regra**: Membros locais têm **precedência** sobre imports estáticos.

```java
import static java.lang.Math.max;

public class Exemplo {
    public int max(int a, int b) { // Sobrescreve Math.max
        return a + b; // Lógica customizada
    }
    
    public void testar() {
        max(5, 10); // Chama método local, não Math.max
    }
}
```

### 9. Múltiplos Static Imports da Mesma Classe

**Específico**:
```java
import static java.lang.Math.PI;
import static java.lang.Math.E;
import static java.lang.Math.sqrt;
```

**Wildcard**:
```java
import static java.lang.Math.*;
```

### 10. Combinação com Import Normal

**Possível**: Import normal + static import da mesma classe.

```java
import java.util.Arrays;
import static java.util.Arrays.sort;
import static java.util.Arrays.asList;

public class Exemplo {
    public void processar() {
        int[] numeros = {5, 2, 8};
        sort(numeros); // Static import
        
        List<String> lista = asList("A", "B"); // Static import
        
        String resultado = Arrays.toString(numeros); // Import normal
    }
}
```

---

## Aplicabilidade

**Use static import quando**:
- **Constantes matemáticas**: `Math.PI`, `Math.E`
- **Métodos utilitários repetitivos**: `Math.sqrt`, `Collections.sort`
- **Testes**: `Assert.*` (JUnit)
- **Enums em switch**
- **Melhora legibilidade** (sem excesso)

**Evite static import quando**:
- **Reduz clareza**: Origem do método/constante não óbvia
- **Conflitos**: Múltiplas classes com mesmos nomes
- **Código genérico**: Dificulta identificar dependências

---

## Armadilhas

### 1. Abuso de Wildcard Static Import

```java
// ❌ Dificulta saber origem
import static java.lang.Math.*;
import static java.util.Collections.*;

double resultado = max(10, 20); // Math.max ou Collections.max?
```

### 2. Conflito com Métodos Locais

```java
import static java.lang.Math.abs;

public class Exemplo {
    public int abs(int numero) { // Sobrescreve Math.abs
        return numero < 0 ? -numero : numero;
    }
}
```

### 3. Reduzir Legibilidade

```java
// ❌ Origem não clara
import static br.com.empresa.util.StringUtils.*;
import static br.com.empresa.util.DateUtils.*;

capitalize(texto); // De qual classe?
```

### 4. Static Import Não Importa Classes

**Erro comum**: Tentar importar classe com static import.

```java
// ❌ Errado
import static java.util.List; // ERRO: List não é membro estático

// ✅ Correto
import java.util.List;
```

---

## Boas Práticas

### 1. Prefira Imports Específicos

```java
// ✅ Preferir
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;

// ❌ Evitar (exceto casos óbvios)
import static java.lang.Math.*;
```

### 2. Use em Testes

```java
// ✅ Comum e aceito em testes
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
```

### 3. Limite Uso a Casos Claros

**Bom uso**:
```java
import static java.lang.Math.PI;
double circunferencia = 2 * PI * raio;
```

**Mau uso**:
```java
import static br.com.empresa.util.Diversos.*;
processar(); // Qual classe? Não óbvio
```

### 4. Documente Static Imports Não Óbvios

```java
import static br.com.empresa.constantes.ConfiguracaoSistema.TIMEOUT_PADRAO;

// TIMEOUT_PADRAO vem de ConfiguracaoSistema
int timeout = TIMEOUT_PADRAO;
```

### 5. Evite em Código Público/Bibliotecas

**APIs públicas**: Evite depender de static imports (pode confundir usuários).

---

## Resumo

**Static import permite usar membros estáticos sem prefixo**:

**Sintaxe**:
```java
// Específico
import static pacote.Classe.membro;

// Todos (wildcard)
import static pacote.Classe.*;
```

**Exemplos**:
```java
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;

double area = PI * sqrt(raio);
```

**Casos comuns**:
- **Math**: `PI`, `E`, `sqrt`, `pow`, `abs`
- **Collections**: `sort`, `reverse`, `shuffle`
- **Assert** (JUnit): `assertEquals`, `assertTrue`
- **Enums**: Constantes

**Vantagens**:
- Código conciso
- Menos repetição

**Desvantagens**:
- Pode reduzir clareza
- Conflitos de nomes
- Dificulta rastreamento

**Regra de Ouro**: Use **static import** para **constantes/métodos óbvios** (Math, Assert), evite em **código complexo ou ambíguo**.
