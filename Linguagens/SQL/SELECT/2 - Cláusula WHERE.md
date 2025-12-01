Quando trabalhamos com bancos de dados SQL, muitas vezes precisamos extrair um conjunto específico de registros que atendam a determinadas condições. A cláusula `WHERE` no SQL é usada para filtrar os resultados de uma consulta, retornando apenas as linhas que satisfazem as condições especificadas.

## Sintaxe da Cláusula WHERE

A sintaxe básica para usar a cláusula `WHERE` é a seguinte:

```sql
SELECT coluna1, coluna2, ...
FROM tabela
WHERE condição;
```

- `SELECT coluna1, coluna2, ...`: Especifica as colunas que devem ser retornadas na consulta.
- `FROM tabela`: Indica a tabela de onde os dados serão recuperados.
- `WHERE condição`: Define a condição que as linhas devem atender para serem incluídas no resultado.

## Exemplos de Uso

Vamos considerar uma tabela de exemplo chamada `Funcionarios`, com as seguintes colunas: `Id`, `Nome`, `Cargo`, `Salario` e `Departamento`.

### Exemplo 1: Filtrando por valor exato

Suponha que queremos encontrar os dados dos funcionários que trabalham no departamento de 'Vendas'. A consulta SQL seria:

```sql
SELECT *
FROM Funcionarios
WHERE Departamento = 'Vendas';
```

Neste caso, a cláusula `WHERE` filtra os registros onde o `Departamento` é exatamente igual a 'Vendas'. Apenas as linhas que atendem a essa condição serão retornadas.

### Exemplo 2: Filtrando com condições maiores ou menores

Se quisermos selecionar os funcionários que têm um salário superior a 3000, a consulta seria:

```sql
SELECT *
FROM Funcionarios
WHERE Salario > 3000;
```

Aqui, a cláusula `WHERE` está sendo usada para filtrar os registros onde o `Salario` é maior que 3000.

### Exemplo 3: Combinando condições

Podemos combinar várias condições usando os operadores lógicos `AND` e `OR`. Por exemplo, para encontrar os funcionários do departamento de 'Vendas' que têm um salário superior a 3000, usaríamos:

```sql
SELECT *
FROM Funcionarios
WHERE Departamento = 'Vendas' AND Salario > 3000;
```

### Exemplo 4: Utilizando o operador LIKE

O operador `LIKE` é usado em uma cláusula `WHERE` para procurar um padrão especificado em uma coluna. Por exemplo, se quisermos encontrar funcionários cujos nomes começam com 'Jo':

```sql
SELECT *
FROM Funcionarios
WHERE Nome LIKE 'Jo%';
```

Neste caso, o `%` representa qualquer sequência de caracteres. Portanto, qualquer funcionário cujo nome comece com 'Jo' será incluído nos resultados.

### Observações Importantes

- A cláusula `WHERE` é sensível a maiúsculas e minúsculas em alguns bancos de dados (como PostgreSQL), mas não em outros (como MySQL). Sempre verifique as especificações do seu SGBD.
- Podem ser usadas várias condições em uma cláusula `WHERE` combinando-as com `AND`, `OR`, e também agrupando-as com parênteses para formar condições complexas.
- Além dos operadores mostrados acima, existem outros que você pode usar para filtrar dados, como `IN`, `BETWEEN`, `NOT`, e muitos outros.

Lembre-se de que a prática é essencial para entender completamente como as consultas e a filtragem de dados funcionam em SQL. Experimente diferentes condições e operadores para ver como eles afetam os resultados de suas consultas.