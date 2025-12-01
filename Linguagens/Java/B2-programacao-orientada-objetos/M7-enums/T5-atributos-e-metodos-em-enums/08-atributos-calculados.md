# T5.08 - Atributos Calculados

## Introdução

**Atributo calculado**: valor derivado de outros atributos ou lógica.

```java
public enum Planeta {
    TERRA(5.976e24, 6.371e6);
    
    private final double massa;
    private final double raio;
    private final double gravidade; // ✅ Calculado
    
    Planeta(double massa, double raio) {
        this.massa = massa;
        this.raio = raio;
        this.gravidade = calcularGravidade(massa, raio); // ✅ Calcula no construtor
    }
    
    private static double calcularGravidade(double massa, double raio) {
        final double G = 6.67300E-11;
        return G * massa / (raio * raio);
    }
    
    public double getGravidade() {
        return gravidade;
    }
}

double g = Planeta.TERRA.getGravidade(); // 9.79
```

**Calculado**: inicializado com base em cálculo ou derivação.

---

## Fundamentos

### 1. Cálculo no Construtor

```java
public enum Triangulo {
    EQUILATERO(10, 10, 10);
    
    private final double lado1;
    private final double lado2;
    private final double lado3;
    private final double perimetro; // ✅ Calculado
    
    Triangulo(double lado1, double lado2, double lado3) {
        this.lado1 = lado1;
        this.lado2 = lado2;
        this.lado3 = lado3;
        this.perimetro = lado1 + lado2 + lado3; // ✅ Cálculo simples
    }
    
    public double getPerimetro() {
        return perimetro;
    }
}
```

### 2. Método Static Auxiliar

```java
public enum Retangulo {
    QUADRADO(5, 5);
    
    private final double largura;
    private final double altura;
    private final double area; // ✅ Calculado
    
    Retangulo(double largura, double altura) {
        this.largura = largura;
        this.altura = altura;
        this.area = calcularArea(largura, altura); // ✅ Método static
    }
    
    private static double calcularArea(double l, double a) {
        return l * a;
    }
    
    public double getArea() {
        return area;
    }
}
```

### 3. Derivação de String

```java
public enum Usuario {
    ADMIN("João", "Silva");
    
    private final String nome;
    private final String sobrenome;
    private final String nomeCompleto; // ✅ Calculado
    
    Usuario(String nome, String sobrenome) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.nomeCompleto = nome + " " + sobrenome; // ✅ Concatenação
    }
    
    public String getNomeCompleto() {
        return nomeCompleto;
    }
}
```

### 4. Cálculo com Múltiplos Atributos

```java
public enum Produto {
    NOTEBOOK(3000, 0.10);
    
    private final double preco;
    private final double desconto;
    private final double precoFinal; // ✅ Calculado
    
    Produto(double preco, double desconto) {
        this.preco = preco;
        this.desconto = desconto;
        this.precoFinal = preco - (preco * desconto); // ✅ Fórmula
    }
    
    public double getPrecoFinal() {
        return precoFinal;
    }
}

double preco = Produto.NOTEBOOK.getPrecoFinal(); // 2700.0
```

### 5. Calculado vs Getter Calculado

```java
public enum Velocidade {
    RAPIDA(100, 2);
    
    private final double distancia;
    private final double tempo;
    
    // ✅ Atributo calculado (inicializado uma vez)
    private final double velocidade;
    
    Velocidade(double distancia, double tempo) {
        this.distancia = distancia;
        this.tempo = tempo;
        this.velocidade = distancia / tempo; // Calcula 1x
    }
    
    public double getVelocidade() {
        return velocidade; // Retorna valor armazenado
    }
    
    // ✅ Getter calculado (calcula sempre)
    public double calcularVelocidade() {
        return distancia / tempo; // Calcula toda vez
    }
}
```

### 6. Data Calculada

```java
public enum Evento {
    CONFERENCIA(LocalDate.of(2024, 6, 10), 3);
    
    private final LocalDate dataInicio;
    private final int duracao;
    private final LocalDate dataFim; // ✅ Calculado
    
    Evento(LocalDate dataInicio, int duracao) {
        this.dataInicio = dataInicio;
        this.duracao = duracao;
        this.dataFim = dataInicio.plusDays(duracao); // ✅ Cálculo de data
    }
    
    public LocalDate getDataFim() {
        return dataFim;
    }
}
```

### 7. Collection Derivada

```java
public enum Departamento {
    TI(Arrays.asList("dev", "suporte", "infra"));
    
    private final List<String> funcoes;
    private final int totalFuncoes; // ✅ Calculado
    
    Departamento(List<String> funcoes) {
        this.funcoes = new ArrayList<>(funcoes);
        this.totalFuncoes = funcoes.size(); // ✅ Tamanho da lista
    }
    
    public int getTotalFuncoes() {
        return totalFuncoes;
    }
}
```

### 8. Enum como Atributo Calculado

```java
public enum Temperatura {
    BAIXA(-10),
    ALTA(40);
    
    private final int graus;
    private final NivelConforto conforto; // ✅ Enum calculado
    
    Temperatura(int graus) {
        this.graus = graus;
        this.conforto = calcularConforto(graus); // ✅ Calcula enum
    }
    
    private static NivelConforto calcularConforto(int graus) {
        if (graus < 0) return NivelConforto.DESCONFORTAVEL;
        if (graus < 25) return NivelConforto.CONFORTAVEL;
        return NivelConforto.QUENTE;
    }
    
    public NivelConforto getConforto() {
        return conforto;
    }
    
    enum NivelConforto { DESCONFORTAVEL, CONFORTAVEL, QUENTE }
}
```

### 9. Boolean Calculado

```java
public enum Produto {
    NOTEBOOK(3000, 2500);
    
    private final double preco;
    private final double custo;
    private final boolean lucrativo; // ✅ Boolean calculado
    
    Produto(double preco, double custo) {
        this.preco = preco;
        this.custo = custo;
        this.lucrativo = preco > custo; // ✅ Condição
    }
    
    public boolean isLucrativo() {
        return lucrativo;
    }
}
```

### 10. Múltiplos Cálculos

```java
public enum Circulo {
    PEQUENO(5);
    
    private final double raio;
    private final double diametro;  // ✅ Calculado
    private final double area;      // ✅ Calculado
    private final double perimetro; // ✅ Calculado
    
    Circulo(double raio) {
        this.raio = raio;
        this.diametro = 2 * raio;
        this.area = Math.PI * raio * raio;
        this.perimetro = 2 * Math.PI * raio;
    }
    
    public double getDiametro() { return diametro; }
    public double getArea() { return area; }
    public double getPerimetro() { return perimetro; }
}
```

---

## Aplicabilidade

**Atributos calculados** para:
- Valor derivado de outros atributos
- Cálculo custoso (executado uma vez)
- Simplificar getters (retornar direto)
- Performance (evitar recalcular)

---

## Armadilhas

### 1. Cálculo em Getter

```java
// ⚠️ Calcula sempre (ineficiente)
public double getArea() {
    return Math.PI * raio * raio; // Calcula toda vez
}

// ✅ Atributo calculado (1x)
private final double area;

Circulo(double raio) {
    this.raio = raio;
    this.area = Math.PI * raio * raio; // Calcula 1x
}

public double getArea() {
    return area; // Retorna valor armazenado
}
```

### 2. Atributo Não Final

```java
// ⚠️ Calculado não final (pode mudar)
private double area;

// ✅ final (imutável)
private final double area;
```

### 3. Ordem de Inicialização

```java
// ⚠️ Usa atributo não inicializado
Produto(double preco, double desconto) {
    this.precoFinal = calcular(); // ⚠️ preco ainda null
    this.preco = preco;
}

// ✅ Inicializar antes de usar
Produto(double preco, double desconto) {
    this.preco = preco;            // 1. Inicializa
    this.desconto = desconto;      // 2. Inicializa
    this.precoFinal = calcular();  // 3. Calcula (usa atributos)
}
```

---

## Boas Práticas

### 1. Método Static para Cálculo

```java
// ✅ Método static auxiliar
Planeta(double massa, double raio) {
    this.massa = massa;
    this.raio = raio;
    this.gravidade = calcularGravidade(massa, raio);
}

private static double calcularGravidade(double m, double r) {
    return G * m / (r * r);
}
```

### 2. Final e Private

```java
// ✅ final (imutável) + private (encapsulado)
private final double area;

public double getArea() {
    return area;
}
```

### 3. Validar Antes de Calcular

```java
// ✅ Validação
Circulo(double raio) {
    if (raio <= 0) {
        throw new IllegalArgumentException("Raio inválido");
    }
    this.raio = raio;
    this.area = Math.PI * raio * raio; // Calcula após validar
}
```

### 4. Documentar Cálculo

```java
// ✅ Javadoc
/**
 * Gravidade calculada usando G * m / r²
 * @see #calcularGravidade(double, double)
 */
private final double gravidade;
```

---

## Resumo

**Atributo calculado**:

```java
public enum Planeta {
    TERRA(5.976e24, 6.371e6);
    
    private final double massa;
    private final double raio;
    private final double gravidade; // ✅ Calculado
    
    Planeta(double massa, double raio) {
        this.massa = massa;
        this.raio = raio;
        this.gravidade = calcularGravidade(massa, raio);
    }
    
    private static double calcularGravidade(double m, double r) {
        final double G = 6.67300E-11;
        return G * m / (r * r);
    }
    
    public double getGravidade() {
        return gravidade; // Retorna valor armazenado
    }
}
```

**Tipos de cálculo**:

```java
// Aritmético
this.area = largura * altura;

// String
this.nomeCompleto = nome + " " + sobrenome;

// Data
this.dataFim = dataInicio.plusDays(duracao);

// Collection
this.total = lista.size();

// Boolean
this.lucrativo = preco > custo;

// Enum
this.conforto = calcularConforto(graus);
```

**Calculado vs Getter Calculado**:

```java
// ✅ Atributo calculado (1x)
private final double area;
Circulo(double raio) {
    this.area = Math.PI * raio * raio; // Calcula 1x
}
public double getArea() {
    return area; // Retorna valor
}

// ✅ Getter calculado (sempre)
public double calcularArea() {
    return Math.PI * raio * raio; // Calcula toda vez
}
```

**Regra de Ouro**: Atributos calculados para **valores derivados**. Calcular **uma vez** no construtor (performance). Usar **método static** para cálculo. **Final** (imutável). **Validar** antes de calcular. Preferir **atributo calculado** se valor não muda (getter retorna direto, sem recalcular).
