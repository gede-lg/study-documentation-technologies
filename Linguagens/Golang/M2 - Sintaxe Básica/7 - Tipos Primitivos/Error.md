# Tipo `Error` no Go

## O que é e para que serve?

O tipo `error` no Go é uma interface padrão usada para representar erros. A interface `error` é definida no pacote `builtin` e tem o seguinte formato:

```go
type error interface {
    Error() string
}
```

A interface `error` define um único método `Error()` que retorna uma string. Essa string geralmente contém uma mensagem descritiva do erro. O propósito do tipo `error` é fornecer uma maneira consistente de relatar e manipular erros em programas Go.

### Utilidades do tipo `error`:
- **Sinalização de Falhas**: Permite que funções e métodos indiquem falhas em suas operações.
- **Propagação de Erros**: Facilita a passagem de erros através da pilha de chamadas, permitindo que erros sejam tratados em um nível apropriado.
- **Descrição de Erros**: A string retornada pelo método `Error()` fornece uma descrição humanamente legível do erro.

## Quando utilizar?

Você deve utilizar o tipo `error` em Go sempre que houver a possibilidade de uma operação falhar. É uma prática comum e recomendada em Go retornar um valor de erro junto com outros valores de retorno para sinalizar problemas.

### Exemplos de situações comuns para uso de `error`:
- Leitura e escrita de arquivos
- Manipulação de conexões de rede
- Operações de banco de dados
- Conversão de tipos
- Validação de entrada de dados

## Sintaxe de Uso

### Retornando um erro de uma função

A sintaxe típica de uma função que retorna um erro é:

```go
func nomeDaFuncao(parametros) (resultado, error) {
    // Implementação da função
    if ocorreuErro {
        return resultadoZero, errors.New("descrição do erro")
    }
    return resultado, nil
}
```

### Criando e retornando erros

1. **Usando `errors.New`**

```go
import (
    "errors"
    "fmt"
)

func dividir(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("divisão por zero")
    }
    return a / b, nil
}

func main() {
    resultado, err := dividir(4, 0)
    if err != nil {
        fmt.Println("Erro:", err)
        return
    }
    fmt.Println("Resultado:", resultado)
}
```

2. **Usando `fmt.Errorf`**

```go
import (
    "fmt"
)

func buscarUsuario(id int) (string, error) {
    if id <= 0 {
        return "", fmt.Errorf("ID inválido: %d", id)
    }
    // Simulação de busca bem-sucedida
    return "Usuário Exemplo", nil
}

func main() {
    usuario, err := buscarUsuario(-1)
    if err != nil {
        fmt.Println("Erro:", err)
        return
    }
    fmt.Println("Usuário encontrado:", usuario)
}
```

3. **Criando tipos de erro personalizados**

```go
import (
    "fmt"
)

type erroPersonalizado struct {
    codigo int
    mensagem string
}

func (e *erroPersonalizado) Error() string {
    return fmt.Sprintf("Erro %d: %s", e.codigo, e.mensagem)
}

func fazerAlgoArriscado(condicao bool) error {
    if condicao {
        return &erroPersonalizado{codigo: 123, mensagem: "condição inválida"}
    }
    return nil
}

func main() {
    err := fazerAlgoArriscado(true)
    if err != nil {
        fmt.Println("Erro:", err)
    }
}
```

## Restrições de Uso

1. **Verificação explícita de erros**
   Em Go, a verificação explícita de erros é crucial. Não ignorar os valores de erro é uma boa prática.

   ```go
   resultado, err := fazerAlgo()
   if err != nil {
       // Tratar o erro
   }
   ```

2. **Não usar exceções**
   Diferentemente de outras linguagens, Go não utiliza exceções para controle de fluxo. Em vez disso, os erros são valores regulares que podem ser retornados e manipulados explicitamente.

3. **Erros como valores**
   Em Go, os erros são tratados como valores. Isso significa que você pode passá-los, armazená-los e manipulá-los como qualquer outro valor.

4. **Uso de `panic` e `recover`**
   Embora Go ofereça `panic` e `recover` para manipulação de falhas inesperadas, seu uso deve ser reservado para situações excepcionais e não como substituto para retorno de erros.

   ```go
   func fazerAlgoCritico() {
       defer func() {
           if r := recover(); r != nil {
               fmt.Println("Recuperado de", r)
           }
       }()
       // Código que pode causar pânico
       panic("um problema crítico ocorreu")
   }
   ```

## Considerações Finais

- **Boas práticas**: Sempre trate e propague erros apropriadamente para garantir que problemas sejam reportados e tratados de forma eficaz.
- **Mensagens de erro**: As mensagens de erro devem ser claras e descritivas para facilitar a depuração.
- **Testes**: Inclua testes que verifiquem o comportamento da sua aplicação quando erros são retornados.

Ao seguir essas práticas, você garantirá que seu código em Go seja robusto e fácil de manter.