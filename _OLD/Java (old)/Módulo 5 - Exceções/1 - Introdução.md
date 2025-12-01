
## 1. O que são exceções?

Em programação, uma exceção é uma anomalia ou evento inesperado que ocorre durante a execução de um programa. As exceções são usadas para lidar com erros e situações excepcionais que podem ocorrer durante a execução do código. Elas permitem que você capture, relate e lide com esses erros de maneira controlada, sem interromper abruptamente o programa.

## 2. Quais os tipos de exceções?

```
Throwable (Classe Raiz)
│
├── Error (Acesso restrito a desenvolvedores da linguagem)
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── ...
│
└── Exception
    ├── Checked (Exceções Verificadas)
    │   ├── IOException
    │   ├── SQLException
    │   └── ...
    │
    └── Unchecked (RuntimeExceptions - Exceções Não Verificadas)
        ├── NullPointerException
        ├── ArrayIndexOutOfBoundsException
        ├── IllegalArgumentException
        ├── IllegalStateException
        ├── ArithmeticException
        ├── ClassCastException
        ├── ...
        └── ...
```

Aqui está uma explicação detalhada de cada categoria:

1. `Throwable`: É a classe raiz da hierarquia de exceções. Todas as exceções em Java derivam de `Throwable`.

2. `Error`: Erros são exceções graves que geralmente não podem ser tratados pelo programa. Eles ocorrem em circunstâncias críticas e não devem ser capturados ou tratados pelo código do aplicativo. Exemplos de erros incluem `OutOfMemoryError` e `StackOverflowError`.

3. `Exception`: É a classe base para exceções que podem ser tratadas e recuperadas pelo programa. Ela tem duas subclasses principais:

   - `Checked` (Exceções Verificadas): São exceções que o compilador exige que sejam tratadas ou lançadas. Elas representam situações que o programador deve antecipar e tratar. Exemplos incluem `IOException` e `SQLException`.

   - `Unchecked` (RuntimeExceptions): São exceções que não são verificadas pelo compilador. Elas geralmente representam erros de programação e não precisam ser tratadas explicitamente. Exemplos incluem `NullPointerException`, `IllegalArgumentException`, e `ArithmeticException`.

Essa hierarquia de exceções permite que os programadores identifiquem e tratem diferentes tipos de problemas em seus programas de acordo com a gravidade e a necessidade de intervenção. As exceções verificadas (checked) são úteis para situações em que é possível se recuperar do erro, enquanto as exceções não verificadas (unchecked) geralmente indicam erros de programação que precisam ser corrigidos.