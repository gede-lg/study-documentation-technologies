## Tipo String em Go

### O que é e para que serve?

O tipo `string` em Go é uma sequência imutável de bytes que representa texto. Cada caractere de uma `string` é um ponto de código Unicode, que pode ser representado por um ou mais bytes em UTF-8. Strings são amplamente usadas para manipulação de texto, armazenamento de dados textuais, construção de mensagens e comunicação entre diferentes partes de um programa.

### Sintaxe de Uso

Em Go, uma `string` é declarada usando aspas duplas (`""`). Strings podem ser concatenadas, indexadas, e comparadas. Aqui estão os aspectos mais importantes do uso de `string` em Go:

#### Declaração de Strings

```go
package main

import "fmt"

func main() {
    var str1 string = "Hello, Go!"
    str2 := "Go is awesome"
    fmt.Println(str1)
    fmt.Println(str2)
}
```

#### Strings Multilinha

Para definir strings multilinha, usamos crases (`` ` ``).

```go
package main

import "fmt"

func main() {
    multilineString := `This is a 
multiline string
in Go.`
    fmt.Println(multilineString)
}
```

#### Concatenação de Strings

Strings podem ser concatenadas usando o operador `+`.

```go
package main

import "fmt"

func main() {
    greeting := "Hello, " + "World!"
    fmt.Println(greeting)
}
```

#### Comprimento de Strings

A função `len` retorna o número de bytes em uma string.

```go
package main

import "fmt"

func main() {
    str := "Hello, Go!"
    fmt.Println("Length of string:", len(str))
}
```

#### Indexação e Substrings

Strings podem ser indexadas para acessar caracteres individuais, que são retornados como `byte`.

```go
package main

import "fmt"

func main() {
    str := "Hello, Go!"
    fmt.Printf("First character: %c\n", str[0])
    fmt.Printf("Substring: %s\n", str[7:9])
}
```

#### Iteração sobre Strings

Podemos iterar sobre os caracteres de uma string usando um loop `for` com `range`.

```go
package main

import "fmt"

func main() {
    str := "Hello, Go!"
    for index, char := range str {
        fmt.Printf("Character at index %d: %c\n", index, char)
    }
}
```

#### Comparação de Strings

Strings podem ser comparadas usando os operadores de comparação (`==`, `!=`, `<`, `>`, `<=`, `>=`).

```go
package main

import "fmt"

func main() {
    str1 := "Go"
    str2 := "Golang"
    
    fmt.Println(str1 == str2)  // false
    fmt.Println(str1 != str2)  // true
    fmt.Println(str1 < str2)   // true
    fmt.Println(str1 > str2)   // false
}
```

#### Funções Úteis do Pacote `strings`

O pacote `strings` oferece diversas funções úteis para manipulação de strings. Aqui estão algumas delas:

- `strings.Contains`

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    str := "Hello, Go!"
    fmt.Println(strings.Contains(str, "Go"))  // true
}
```

- `strings.Count`

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    str := "banana"
    fmt.Println(strings.Count(str, "a"))  // 3
}
```

- `strings.HasPrefix` e `strings.HasSuffix`

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    str := "Hello, Go!"
    fmt.Println(strings.HasPrefix(str, "Hello")) // true
    fmt.Println(strings.HasSuffix(str, "Go!"))   // true
}
```

- `strings.ToUpper` e `strings.ToLower`

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    str := "Hello, Go!"
    fmt.Println(strings.ToUpper(str)) // "HELLO, GO!"
    fmt.Println(strings.ToLower(str)) // "hello, go!"
}
```

- `strings.Replace`

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    str := "Hello, Go!"
    fmt.Println(strings.Replace(str, "Go", "Gopher", 1)) // "Hello, Gopher!"
}
```

### Considerações Adicionais

#### Imutabilidade

Strings em Go são imutáveis, o que significa que uma vez criada, a string não pode ser alterada. Qualquer operação que parece modificar uma string na verdade cria uma nova string.

```go
package main

import "fmt"

func main() {
    str := "Hello, Go!"
    str[0] = 'h' // Erro: strings são imutáveis
}
```

#### Strings e Unicode

Go usa UTF-8 para codificação de strings, permitindo fácil manipulação de texto internacionalizado. No entanto, ao acessar caracteres por índice, você lida com bytes individuais, o que pode não corresponder a caracteres Unicode completos. Use runas (`rune`) para manipular caracteres Unicode corretamente.

```go
package main

import "fmt"

func main() {
    str := "Hello, 世界"
    for i, r := range str {
        fmt.Printf("Index: %d, Rune: %c\n", i, r)
    }
}
```

#### Conversão entre String e Byte Slice

Você pode converter uma string em um slice de bytes e vice-versa.

```go
package main

import "fmt"

func main() {
    str := "Hello, Go!"
    byteSlice := []byte(str)
    fmt.Println(byteSlice)

    newStr := string(byteSlice)
    fmt.Println(newStr)
}
```

### Conclusão

O tipo `string` em Go é uma ferramenta poderosa e flexível para manipulação de texto. Compreender como declarar, manipular e operar com strings é essencial para o desenvolvimento de aplicações robustas e eficientes. O uso correto de strings pode melhorar significativamente a clareza e a funcionalidade do seu código.


---

# Formatação de Strings

A formatação de strings em Go é realizada principalmente através do pacote `fmt`. Esse pacote fornece diversas funções para formatar e imprimir strings de diferentes maneiras. Vamos explorar as formatações mais comuns, explicando a finalidade, a sintaxe e fornecendo exemplos práticos.

## Tabela de Formatações

| Formatação | Finalidade | Sintaxe | Exemplo |
|------------|------------|---------|---------|
| `%v` | Valor padrão | `fmt.Sprintf("%v", value)` | `fmt.Sprintf("%v", 123)` -> `"123"` |
| `%+v` | Valor padrão com campos exportados | `fmt.Sprintf("%+v", struct)` | `fmt.Sprintf("%+v", myStruct)` |
| `%#v` | Valor Go-syntax | `fmt.Sprintf("%#v", value)` | `fmt.Sprintf("%#v", []int{1, 2, 3})` -> `[]int{1, 2, 3}` |
| `%T` | Tipo do valor | `fmt.Sprintf("%T", value)` | `fmt.Sprintf("%T", 123)` -> `"int"` |
| `%%` | Literal de porcentagem | `fmt.Sprintf("%%")` | `fmt.Sprintf("%%")` -> `"%"` |
| `%t` | Booleano | `fmt.Sprintf("%t", true)` | `fmt.Sprintf("%t", true)` -> `"true"` |
| `%b` | Inteiro em binário | `fmt.Sprintf("%b", 4)` | `fmt.Sprintf("%b", 4)` -> `"100"` |
| `%c` | Caracter unicode | `fmt.Sprintf("%c", 65)` | `fmt.Sprintf("%c", 65)` -> `"A"` |
| `%d` | Inteiro em decimal | `fmt.Sprintf("%d", 123)` | `fmt.Sprintf("%d", 123)` -> `"123"` |
| `%o` | Inteiro em octal | `fmt.Sprintf("%o", 8)` | `fmt.Sprintf("%o", 8)` -> `"10"` |
| `%O` | Inteiro em octal com prefixo 0o | `fmt.Sprintf("%O", 8)` | `fmt.Sprintf("%O", 8)` -> `"0o10"` |
| `%x` | Inteiro em hexadecimal (minúsculas) | `fmt.Sprintf("%x", 255)` | `fmt.Sprintf("%x", 255)` -> `"ff"` |
| `%X` | Inteiro em hexadecimal (maiúsculas) | `fmt.Sprintf("%X", 255)` | `fmt.Sprintf("%X", 255)` -> `"FF"` |
| `%e` | Ponto flutuante notação científica (minúsculas) | `fmt.Sprintf("%e", 123.456)` | `fmt.Sprintf("%e", 123.456)` -> `"1.234560e+02"` |
| `%E` | Ponto flutuante notação científica (maiúsculas) | `fmt.Sprintf("%E", 123.456)` | `fmt.Sprintf("%E", 123.456)` -> `"1.234560E+02"` |
| `%f` | Ponto flutuante | `fmt.Sprintf("%f", 123.456)` | `fmt.Sprintf("%f", 123.456)` -> `"123.456000"` |
| `%F` | Ponto flutuante (equivalente a %f) | `fmt.Sprintf("%F", 123.456)` | `fmt.Sprintf("%F", 123.456)` -> `"123.456000"` |
| `%g` | Ponto flutuante compacto | `fmt.Sprintf("%g", 123.456)` | `fmt.Sprintf("%g", 123.456)` -> `"123.456"` |
| `%G` | Ponto flutuante compacto (maiúsculas) | `fmt.Sprintf("%G", 123.456)` | `fmt.Sprintf("%G", 123.456)` -> `"123.456"` |
| `%s` | String | `fmt.Sprintf("%s", "text")` | `fmt.Sprintf("%s", "text")` -> `"text"` |
| `%q` | String entre aspas | `fmt.Sprintf("%q", "text")` | `fmt.Sprintf("%q", "text")` -> `"\"text\""` |
| `%x` | String em hexadecimal | `fmt.Sprintf("%x", "text")` | `fmt.Sprintf("%x", "text")` -> `"74657874"` |
| `%p` | Ponteiro | `fmt.Sprintf("%p", &value)` | `fmt.Sprintf("%p", &value)` -> `"0x12345678"` |
| `%U` | Unicode com prefixo U+ | `fmt.Sprintf("%U", 65)` | `fmt.Sprintf("%U", 65)` -> `"U+0041"` |
| `%#U` | Unicode com nome de caractere | `fmt.Sprintf("%#U", 65)` | `fmt.Sprintf("%#U", 65)` -> `"U+0041 'A'"` |

## Exemplos Detalhados

### Exemplo 1: `%v`, `%+v` e `%#v`
```go
type Person struct {
    Name string
    Age  int
}

p := Person{"Alice", 30}

// Valor padrão
fmt.Println(fmt.Sprintf("%v", p))  // Output: {Alice 30}

// Valor padrão com campos exportados
fmt.Println(fmt.Sprintf("%+v", p)) // Output: {Name:Alice Age:30}

// Valor Go-syntax
fmt.Println(fmt.Sprintf("%#v", p)) // Output: main.Person{Name:"Alice", Age:30}
```

### Exemplo 2: Formatação de Inteiros
```go
number := 255

// Decimal
fmt.Println(fmt.Sprintf("%d", number)) // Output: 255

// Binário
fmt.Println(fmt.Sprintf("%b", number)) // Output: 11111111

// Octal
fmt.Println(fmt.Sprintf("%o", number)) // Output: 377

// Hexadecimal (minúsculas)
fmt.Println(fmt.Sprintf("%x", number)) // Output: ff

// Hexadecimal (maiúsculas)
fmt.Println(fmt.Sprintf("%X", number)) // Output: FF
```

### Exemplo 3: Formatação de Strings
```go
text := "GoLang"

// String normal
fmt.Println(fmt.Sprintf("%s", text)) // Output: GoLang

// String entre aspas
fmt.Println(fmt.Sprintf("%q", text)) // Output: "GoLang"

// String em hexadecimal
fmt.Println(fmt.Sprintf("%x", text)) // Output: 476f4c616e67
```

### Exemplo 4: Formatação de Pontos Flutuantes
```go
value := 123.456

// Ponto flutuante
fmt.Println(fmt.Sprintf("%f", value)) // Output: 123.456000

// Notação científica (minúsculas)
fmt.Println(fmt.Sprintf("%e", value)) // Output: 1.234560e+02

// Notação científica (maiúsculas)
fmt.Println(fmt.Sprintf("%E", value)) // Output: 1.234560E+02

// Compacto
fmt.Println(fmt.Sprintf("%g", value)) // Output: 123.456
```

## Considerações Adicionais
- A formatação com `%v` é útil para depuração rápida, exibindo valores de maneira padrão.
- O uso de `%#v` é particularmente útil ao serializar/deserializar estruturas complexas, pois fornece a representação exata do código.
- Formatos de inteiros e flutuantes são essenciais para conversões de bases numéricas e representação precisa em relatórios ou logs.

Utilizar o pacote `fmt` corretamente pode melhorar significativamente a legibilidade e a clareza das saídas do seu programa, seja para depuração, logs ou apresentação de dados formatados.