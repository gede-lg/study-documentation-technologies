## Tipos Complexos em Go

### O que é e para que serve?

Os tipos complexos em Go são usados para representar números complexos, que são números compostos por uma parte real e uma parte imaginária. Em matemática e engenharia, números complexos são amplamente utilizados em áreas como eletrônica, processamento de sinais, e teoria de controle. Em Go, os números complexos são particularmente úteis quando se trabalha com cálculos que envolvem números complexos, como transformadas de Fourier e outras operações matemáticas avançadas.

### Tipos Complexos Disponíveis em Go

Go fornece dois tipos complexos primitivos:
1. `complex64`
2. `complex128`

#### `complex64`

O tipo `complex64` representa um número complexo com uma parte real e uma parte imaginária, cada uma delas com precisão de 32 bits (`float32`).

##### Sintaxe de Uso

```go
var z complex64 = complex(1.0, 2.0)
```

##### Exemplo de Uso

```go
package main

import (
    "fmt"
)

func main() {
    // Criação de um número complexo do tipo complex64
    var z complex64 = complex(1.0, 2.0)

    // Acessando a parte real e a parte imaginária
    realPart := real(z)
    imagPart := imag(z)

    fmt.Printf("Número complexo: %v\n", z)
    fmt.Printf("Parte real: %v\n", realPart)
    fmt.Printf("Parte imaginária: %v\n", imagPart)

    // Operações com números complexos
    var w complex64 = complex(2.0, 3.0)
    sum := z + w
    difference := z - w

    fmt.Printf("Soma: %v\n", sum)
    fmt.Printf("Diferença: %v\n", difference)
}
```

#### Quando Utilizar `complex64`

Use `complex64` quando precisar de números complexos e a precisão de 32 bits for suficiente para a sua aplicação. É adequado para aplicações que envolvem processamento de sinais, gráficos, ou cálculos onde a precisão de 32 bits é aceitável e a memória é uma consideração importante.

#### `complex128`

O tipo `complex128` representa um número complexo com uma parte real e uma parte imaginária, cada uma delas com precisão de 64 bits (`float64`).

##### Sintaxe de Uso

```go
var z complex128 = complex(1.0, 2.0)
```

##### Exemplo de Uso

```go
package main

import (
    "fmt"
)

func main() {
    // Criação de um número complexo do tipo complex128
    var z complex128 = complex(1.0, 2.0)

    // Acessando a parte real e a parte imaginária
    realPart := real(z)
    imagPart := imag(z)

    fmt.Printf("Número complexo: %v\n", z)
    fmt.Printf("Parte real: %v\n", realPart)
    fmt.Printf("Parte imaginária: %v\n", imagPart)

    // Operações com números complexos
    var w complex128 = complex(2.0, 3.0)
    sum := z + w
    difference := z - w

    fmt.Printf("Soma: %v\n", sum)
    fmt.Printf("Diferença: %v\n", difference)
}
```

#### Quando Utilizar `complex128`

Use `complex128` quando precisar de números complexos com maior precisão. É adequado para aplicações científicas, cálculos de engenharia, e outras aplicações onde a precisão de 64 bits é necessária para evitar erros de arredondamento significativos.

### Operações com Números Complexos

Go suporta várias operações aritméticas básicas com números complexos, incluindo adição, subtração, multiplicação e divisão.

#### Exemplo de Operações

```go
package main

import (
    "fmt"
)

func main() {
    var a complex64 = complex(1.0, 2.0)
    var b complex64 = complex(3.0, 4.0)

    sum := a + b
    difference := a - b
    product := a * b
    quotient := a / b

    fmt.Printf("a: %v, b: %v\n", a, b)
    fmt.Printf("Soma: %v\n", sum)
    fmt.Printf("Diferença: %v\n", difference)
    fmt.Printf("Produto: %v\n", product)
    fmt.Printf("Quociente: %v\n", quotient)
}
```

### Funções Built-in para Números Complexos

Go fornece algumas funções built-in para trabalhar com números complexos:

- `complex(r, i)` : Cria um número complexo a partir das partes real (`r`) e imaginária (`i`).
- `real(c)` : Retorna a parte real do número complexo `c`.
- `imag(c)` : Retorna a parte imaginária do número complexo `c`.

#### Exemplo de Funções Built-in

```go
package main

import (
    "fmt"
)

func main() {
    var z complex128 = complex(5.0, 12.0)

    fmt.Printf("Número complexo: %v\n", z)
    fmt.Printf("Parte real: %v\n", real(z))
    fmt.Printf("Parte imaginária: %v\n", imag(z))
}
```

### Conclusão

Os tipos complexos em Go (`complex64` e `complex128`) são essenciais para cálculos matemáticos avançados que envolvem números complexos. Eles são usados em diversas áreas, como processamento de sinais, eletrônica e engenharia, oferecendo uma forma precisa e eficiente de representar e manipular números complexos. Ao entender como usar esses tipos e suas operações associadas, você pode aproveitar ao máximo as capacidades de Go para aplicações científicas e de engenharia.