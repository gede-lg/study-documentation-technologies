# Consultas em SQL: Funções de Manipulação

As consultas em SQL frequentemente envolvem a manipulação de strings, datas e números para atender a diferentes requisitos de negócios e análise de dados. Vamos detalhar as funções de manipulação mais comuns para cada tipo de dado, fornecendo sintaxe e exemplos de uso.

## Funções de Manipulação de Strings

As funções de manipulação de strings permitem alterar ou analisar cadeias de caracteres (textos) em um banco de dados SQL.

### UPPER e LOWER

- **Sintaxe**: 
  - `UPPER(string)` 
  - `LOWER(string)`

- **Exemplo**:
  ```sql
  SELECT UPPER('hello') AS UpperString, LOWER('WORLD') AS LowerString;
  ```
  Este código converte a string 'hello' para maiúsculas e 'WORLD' para minúsculas.

### CONCAT

- **Sintaxe**: `CONCAT(string1, string2, ..., stringN)`

- **Exemplo**:
  ```sql
  SELECT CONCAT('Hello ', 'World!') AS ConcatenatedString;
  ```
  Este código une 'Hello ' e 'World!' em uma única string 'Hello World!'.

### SUBSTRING

- **Sintaxe**: `SUBSTRING(string FROM start FOR length)`

- **Exemplo**:
  ```sql
  SELECT SUBSTRING('Hello World', 7, 5) AS Substring;
  ```
  Este código extrai 'World' da string 'Hello World', começando na posição 7 e pegando 5 caracteres.

### TRIM

- **Sintaxe**: `TRIM([LEADING | TRAILING | BOTH] [characters] FROM string)`

- **Exemplo**:
  ```sql
  SELECT TRIM('   Hello World   ') AS TrimmedString;
  ```
  Este código remove espaços em branco do início e do fim da string '   Hello World   '.

## Funções de Manipulação de Datas

As funções de manipulação de datas permitem trabalhar com valores de data e hora, convertendo formatos ou extraindo componentes específicos da data.

### CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP

- **Sintaxe**: 
  - `CURRENT_DATE`
  - `CURRENT_TIME`
  - `CURRENT_TIMESTAMP`

- **Exemplo**:
  ```sql
  SELECT CURRENT_DATE AS Today, CURRENT_TIME AS Now, CURRENT_TIMESTAMP AS Timestamp;
  ```
  Este código retorna a data atual, a hora atual e o carimbo de data/hora atual.

### EXTRACT

- **Sintaxe**: `EXTRACT(unit FROM date)`

- **Exemplo**:
  ```sql
  SELECT EXTRACT(YEAR FROM '2024-02-28') AS Year, EXTRACT(MONTH FROM '2024-02-28') AS Month, EXTRACT(DAY FROM '2024-02-28') AS Day;
  ```
  Este código extrai o ano, o mês e o dia da data '2024-02-28'.

### DATE_ADD e DATE_SUB

- **Sintaxe**: 
  - `DATE_ADD(date, INTERVAL expression unit)`
  - `DATE_SUB(date, INTERVAL expression unit)`

- **Exemplo**:
  ```sql
  SELECT DATE_ADD('2024-02-28', INTERVAL 1 DAY) AS NextDay, DATE_SUB('2024-02-28', INTERVAL 1 MONTH) AS LastMonth;
  ```
  Este código adiciona um dia à data especificada e subtrai um mês.

## Funções de Manipulação de Números

As funções de manipulação de números permitem realizar operações matemáticas ou transformações em valores numéricos.

### ROUND, CEIL, FLOOR

- **Sintaxe**: 
  - `ROUND(number, decimals)`
  - `CEIL(number)`
  - `FLOOR(number)`

- **Exemplo**:
  ```sql
  SELECT ROUND(123.4567, 2) AS Rounded, CEIL(123.4567) AS Ceiling, FLOOR(123.4567) AS Floor;
  ```
  Este código arredonda o número 123.4567 para duas casas decimais, obtém o menor inteiro maior ou igual a 123.4567 e o maior inteiro menor ou igual a 123.4567.

### ABS

- **Sintaxe**: `ABS(number)`

- **Exemplo**:
  ```sql
  SELECT ABS(-123.456) AS AbsoluteValue;
  ```
  Este código retorna o valor absoluto de -123.456.

---

Essas são algumas das funções de manipulação mais comuns em SQL. Elas são ferrament

as poderosas para transformar e analisar dados dentro de um banco de dados. Lembre-se de que a disponibilidade e a exata sintaxe das funções podem variar entre diferentes sistemas de gerenciamento de banco de dados (SGBDs), então sempre consulte a documentação específica do SGBD que você está usando.