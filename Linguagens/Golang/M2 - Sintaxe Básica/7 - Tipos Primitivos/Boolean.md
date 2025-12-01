## Tipo Booleano em Go

### O que é e para que serve?

O tipo booleano em Go é utilizado para representar valores lógicos, que podem ser apenas `true` (verdadeiro) ou `false` (falso). Este tipo é essencial para controle de fluxo, como em estruturas condicionais (`if`, `else`) e laços de repetição (`for`), além de ser fundamental para operações lógicas e decisões em programas.

### Sintaxe de Uso e Exemplos

#### Declaração de Variáveis Booleanas

A declaração de variáveis booleanas é simples e direta. Você pode usar a palavra-chave `var` ou, em algumas situações, o `:=` para declarar e inicializar a variável em uma única linha.

```go
package main

import "fmt"

func main() {
    var a bool = true
    b := false

    fmt.Println(a, b)
}
```

#### Operadores Lógicos

Go suporta os operadores lógicos básicos:

- `&&` (AND lógico)
- `||` (OR lógico)
- `!` (NOT lógico)

**Exemplo de Uso:**

```go
package main

import "fmt"

func main() {
    x := true
    y := false

    fmt.Println(x && y) // false
    fmt.Println(x || y) // true
    fmt.Println(!x)     // false
}
```

#### Estruturas Condicionais

Os valores booleanos são frequentemente usados em estruturas condicionais para controlar o fluxo do programa.

**Exemplo com `if` e `else`:**

```go
package main

import "fmt"

func main() {
    age := 18

    if age >= 18 {
        fmt.Println("Você é maior de idade.")
    } else {
        fmt.Println("Você é menor de idade.")
    }
}
```

**Exemplo com `if` e `else if`:**

```go
package main

import "fmt"

func main() {
    score := 85

    if score >= 90 {
        fmt.Println("Aprovado com distinção!")
    } else if score >= 75 {
        fmt.Println("Aprovado!")
    } else {
        fmt.Println("Reprovado!")
    }
}
```

#### Laços de Repetição

Booleans são usados para controlar a execução de laços de repetição.

**Exemplo com `for` e condição:**

```go
package main

import "fmt"

func main() {
    count := 0

    for count < 5 {
        fmt.Println("Contando:", count)
        count++
    }
}
```

**Exemplo com `while` usando `for` com condição:**

```go
package main

import "fmt"

func main() {
    condition := true

    for condition {
        fmt.Println("Executando o loop.")
        condition = false // Para sair do loop
    }
}
```

#### Comparações Lógicas

Você pode usar operadores de comparação para avaliar expressões booleanas.

**Exemplo de Comparações:**

```go
package main

import "fmt"

func main() {
    a := 10
    b := 20

    fmt.Println(a == b) // false
    fmt.Println(a != b) // true
    fmt.Println(a < b)  // true
    fmt.Println(a > b)  // false
    fmt.Println(a <= b) // true
    fmt.Println(a >= b) // false
}
```

### Exemplos Práticos

#### Verificação de Paridade

Um exemplo comum é verificar se um número é par ou ímpar:

```go
package main

import "fmt"

func main() {
    num := 7
    isEven := num%2 == 0

    if isEven {
        fmt.Println(num, "é par.")
    } else {
        fmt.Println(num, "é ímpar.")
    }
}
```

#### Validação de Senha

Outro exemplo pode ser a validação de uma senha:

```go
package main

import "fmt"

func main() {
    password := "secret123"
    valid := password == "secret123"

    if valid {
        fmt.Println("Senha correta.")
    } else {
        fmt.Println("Senha incorreta.")
    }
}
```

### Considerações Adicionais

- **Zero Value:** O valor padrão de uma variável booleana sem inicialização é `false`.
- **Uso em Funções:** Booleans são frequentemente retornados por funções que avaliam condições.

**Exemplo de Função Retornando Booleano:**

```go
package main

import "fmt"

func isEven(n int) bool {
    return n%2 == 0
}

func main() {
    number := 42
    if isEven(number) {
        fmt.Println(number, "é par.")
    } else {
        fmt.Println(number, "é ímpar.")
    }
}
```

### Conclusão

O tipo booleano em Go é uma ferramenta poderosa para controlar o fluxo do programa e realizar operações lógicas. Seu uso é fundamental em quase todas as aplicações, desde simples condições até complexas verificações lógicas e ciclos. Espero que esta explicação tenha esclarecido os aspectos essenciais do tipo booleano em Go!