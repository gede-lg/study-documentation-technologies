Uma das operações mais comuns e fundamentais em SQL é a consulta de dados, geralmente realizada pelo comando `SELECT`. Este comando é usado para selecionar (consultar) dados de uma ou mais tabelas do banco de dados.

### Sintaxe Básica:

```sql
SELECT coluna1, coluna2, ...
FROM nome_tabela;
```

Nesta sintaxe, `coluna1`, `coluna2` são os nomes das colunas que queremos recuperar, e `nome_tabela` é o nome da tabela de onde queremos recuperar os dados. Se quisermos selecionar todas as colunas disponíveis na tabela, podemos usar o caractere asterisco `*`:

```sql
SELECT * FROM nome_tabela;
```

### Exemplo 1: Consulta Simples

Suponha que temos uma tabela chamada `Clientes` com as seguintes colunas: `ID`, `Nome`, `Email` e `Cidade`. Para selecionar apenas os nomes e e-mails de todos os clientes, usaríamos a seguinte consulta SQL:

```sql
SELECT Nome, Email
FROM Clientes;
```

Este comando irá recuperar duas colunas de dados, `Nome` e `Email`, de todos os registros presentes na tabela `Clientes`.

### Exemplo 2: Selecionando Todas as Colunas

Se quisermos recuperar todos os campos disponíveis na tabela `Clientes`, utilizamos o seguinte comando:

```sql
SELECT * FROM Clientes;
```

Este comando retorna todas as colunas para todos os registros da tabela `Clientes`.

### Exemplo 3: condicionais "CASE WHEN THEN END"

A expressão `CASE` em SQL funciona como uma declaração condicional (semelhante ao "if-else" em outras linguagens de programação) que retorna valores específicos baseados em testes condicionais. É muito útil para transformar, adicionar ou interpretar dados com base em certas condições durante uma consulta.

#### Estrutura básica:

```sql
CASE
    WHEN condição1 THEN resultado1
    WHEN condição2 THEN resultado2
    ...
    ELSE resultadoPadrao
END
```

#### Exemplo de uso:

```sql
SELECT nome,
       idade,
       CASE
           WHEN idade < 18 THEN 'Menor de idade'
           WHEN idade >= 18 AND idade <= 65 THEN 'Adulto'
           ELSE 'Idoso'
       END AS faixa_etaria
FROM pessoas;
```

Neste exemplo, estamos selecionando o nome e a idade de indivíduos de uma tabela `pessoas` e utilizando a expressão `CASE` para classificar cada pessoa em uma faixa etária: 'Menor de idade', 'Adulto', ou 'Idoso', com base em sua idade. A expressão `CASE` avalia cada condição na ordem e retorna o resultado correspondente à primeira condição verdadeira. Se nenhuma das condições for verdadeira, retorna o valor especificado no `ELSE` (se houver).

### Exemplo 4: uso de ALIAS

- **Alias**: Podemos usar um alias (apelido) para colunas ou tabelas usando a palavra chave `AS` para tornar a saída mais legível. Por exemplo:

    ```sql
    SELECT Nome AS Cliente, Email AS Contato
    FROM Clientes;
    ```


### Observações Importantes:

1. **Maiúsculas e Minúsculas**: Em SQL, não faz diferença escrever os comandos em maiúsculas ou minúsculas. No entanto, é uma boa prática escrever os comandos SQL em maiúsculas para distingui-los dos nomes de tabelas e colunas.

2. **Seleção Específica**: É uma boa prática especificar exatamente quais colunas precisam ser recuperadas em vez de usar `*`, especialmente quando a tabela contém muitas colunas. Isso pode melhorar o desempenho da consulta, especialmente em tabelas grandes.

3. **Ordenação de Resultados**: Podemos ordenar os resultados de uma consulta SQL usando a cláusula `ORDER BY`. Por exemplo:

    ```sql
    SELECT Nome, Cidade
    FROM Clientes
    ORDER BY Nome;
    ```

    Este comando irá retornar os nomes e cidades dos clientes, ordenados alfabeticamente pelo nome.