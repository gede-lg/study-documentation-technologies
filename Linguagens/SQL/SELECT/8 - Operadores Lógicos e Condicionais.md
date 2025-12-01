SQL, ou Linguagem de Consulta Estruturada, é uma linguagem padrão para acessar e manipular bancos de dados. Entre suas muitas funcionalidades, o uso de operadores lógicos e condicionais é fundamental para filtrar resultados de consultas, permitindo que os usuários obtenham dados que atendam a critérios específicos.

## Operadores Lógicos

Os operadores lógicos em SQL são usados para combinar duas ou mais condições. Os mais comuns são `AND`, `OR` e `NOT`.

### AND

O operador `AND` é utilizado para garantir que duas ou mais condições sejam verdadeiras. Em uma consulta SQL, todas as condições separadas pelo operador `AND` devem ser verdadeiras para que a linha seja incluída nos resultados.

**Sintaxe:**

```sql
SELECT coluna1, coluna2, ...
FROM tabela
WHERE condição1 AND condição2;
```

**Exemplo de Uso:**

Suponha que temos uma tabela `Funcionarios` e queremos selecionar todos os funcionários que trabalham no departamento 'Vendas' e que tenham um salário superior a 3000.

```sql
SELECT *
FROM Funcionarios
WHERE Departamento = 'Vendas' AND Salario > 3000;
```

### OR

O operador `OR` é utilizado quando qualquer uma das condições separadas por ele pode ser verdadeira para que a linha seja incluída nos resultados.

**Sintaxe:**

```sql
SELECT coluna1, coluna2, ...
FROM tabela
WHERE condição1 OR condição2;
```

**Exemplo de Uso:**

Usando a mesma tabela `Funcionarios`, vamos selecionar todos os funcionários que trabalham no departamento 'Vendas' ou 'TI'.

```sql
SELECT *
FROM Funcionarios
WHERE Departamento = 'Vendas' OR Departamento = 'TI';
```

### NOT

O operador `NOT` inverte o resultado de uma condição. Utilizado para selecionar linhas que não satisfazem uma determinada condição.

**Sintaxe:**

```sql
SELECT coluna1, coluna2, ...
FROM tabela
WHERE NOT condição;
```

**Exemplo de Uso:**

Para selecionar todos os funcionários que não trabalham no departamento 'Vendas':

```sql
SELECT *
FROM Funcionarios
WHERE NOT Departamento = 'Vendas';
```

## Operadores Condicionais: CASE

O `CASE` é um operador condicional em SQL que proporciona a realização de operações IF-THEN-ELSE dentro de uma consulta. É utilizado para implementar uma lógica condicional.

**Sintaxe:**

```sql
SELECT 
    coluna1,
    CASE
        WHEN condição1 THEN resultado1
        WHEN condição2 THEN resultado2
        ...
        ELSE resultado_final
    END as ColunaAlias
FROM tabela;
```

**Exemplo de Uso:**

Suponha que desejamos classificar os funcionários baseados em seu salário:

```sql
SELECT 
    Nome,
    Salario,
    CASE 
        WHEN Salario > 5000 THEN 'Alto'
        WHEN Salario > 3000 THEN 'Médio'
        ELSE 'Baixo'
    END as Classe_Salarial
FROM Funcionarios;
```

Neste exemplo, cada funcionário é classificado como 'Alto', 'Médio' ou 'Baixo' com base em seu salário. A coluna resultante `Classe_Salarial` mostrará essa classificação.

## Conclusão

Os operadores lógicos e condicionais são essenciais para filtrar e classificar dados em SQL. Eles permitem realizar consultas complexas e dinâmicas, adaptando os resultados às necessidades específicas do usuário. A prática constante e a aplicação desses operadores em diferentes cenários ajudarão a aprimorar sua habilidade e compreensão em SQL.