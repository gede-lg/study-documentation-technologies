## **Comando ALTER em PostgreSQL**

O comando `ALTER` é parte essencial da linguagem DDL no PostgreSQL, permitindo a modificação da estrutura de tabelas após sua criação. Com ele, é possível adicionar, modificar e remover colunas, além de realizar outras alterações, como renomear tabelas ou colunas e mudar tipos de dados.

#### **Adicionar Colunas**

Para adicionar uma nova coluna a uma tabela existente, a sintaxe básica é:

```sql
ALTER TABLE nome_da_tabela
ADD COLUMN nome_da_coluna tipo_de_dado [constraint];
```

**Exemplo de uso:**

Suponha que temos uma tabela chamada `funcionarios` e queremos adicionar a ela uma coluna `email` do tipo `VARCHAR`:

```sql
ALTER TABLE funcionarios
ADD COLUMN email VARCHAR(255);
```

#### **Modificar Colunas**

Modificar colunas pode envolver mudar o tipo de dados, renomear a coluna, ou alterar as restrições da coluna. A seguir, focaremos na modificação do tipo de dados e no renomeamento.

- **Modificar Tipo de Dados**

Para modificar o tipo de dados de uma coluna, a sintaxe é:

```sql
ALTER TABLE nome_da_tabela
ALTER COLUMN nome_da_coluna TYPE novo_tipo_de_dado [USING expressão];
```

**Exemplo de uso:**

Se quisermos alterar o tipo de dados da coluna `salario` de `INTEGER` para `NUMERIC`, podemos fazer o seguinte:

```sql
ALTER TABLE funcionarios
ALTER COLUMN salario TYPE NUMERIC(10, 2);
```

- **Renomear Coluna**

Para renomear uma coluna, a sintaxe é:

```sql
ALTER TABLE nome_da_tabela
RENAME COLUMN nome_atual_da_coluna TO novo_nome_da_coluna;
```

**Exemplo de uso:**

Para renomear a coluna `departamento` para `depto`:

```sql
ALTER TABLE funcionarios
RENAME COLUMN departamento TO depto;
```

#### **Remover Colunas**

Para remover uma coluna existente de uma tabela, a sintaxe é:

```sql
ALTER TABLE nome_da_tabela
DROP COLUMN nome_da_coluna [CASCADE | RESTRICT];
```

- `CASCADE` remove a coluna e qualquer objeto dependente.
- `RESTRICT` impede a remoção se houver objetos dependentes.

**Exemplo de uso:**

Para remover a coluna `endereco` da tabela `funcionarios`:

```sql
ALTER TABLE funcionarios
DROP COLUMN endereco RESTRICT;
```

#### Comando ALTER: Modificar Tipos de Dados

O comando `ALTER TABLE` no PostgreSQL é usado para modificar a estrutura de uma tabela existente. Uma de suas funções mais úteis é a capacidade de alterar o tipo de dados de uma coluna.

##### Sintaxe

```sql
ALTER TABLE nome_da_tabela
ALTER COLUMN nome_da_coluna TYPE novo_tipo_de_dado [USING expressão];
```

##### Exemplo de Uso

Suponha que temos uma tabela chamada `funcionarios`, com uma coluna `salario` originalmente definida como tipo `INTEGER`. Para alterar o tipo de dados dessa coluna para `NUMERIC`, o comando seria:

```sql
ALTER TABLE funcionarios
ALTER COLUMN salario TYPE NUMERIC;
```

Caso seja necessário converter os dados durante a alteração do tipo de dados, pode-se usar a cláusula `USING`. Por exemplo, converter uma coluna de texto para data:

```sql
ALTER TABLE funcionarios
ALTER COLUMN data_de_entrada TYPE DATE USING data_de_entrada::DATE;
```

#### Adicionar e Remover Restrições

Além de modificar tipos de dados, o comando `ALTER TABLE` também é utilizado para adicionar ou remover restrições em colunas de uma tabela.

##### Sintaxe para Adicionar Restrições

```sql
ALTER TABLE nome_da_tabela
ADD CONSTRAINT nome_da_restricao TIPO_DE_RESTRICAO (nome_da_coluna);
```

##### Exemplo de Adicionar Restrição

Adicionando uma restrição de chave primária à coluna `id` da tabela `funcionarios`:

```sql
ALTER TABLE funcionarios
ADD CONSTRAINT pk_funcionarios PRIMARY KEY (id);
```

##### Sintaxe para Remover Restrições

```sql
ALTER TABLE nome_da_tabela
DROP CONSTRAINT nome_da_restricao;
```

##### Exemplo de Remover Restrição

Removendo a restrição de chave primária anteriormente adicionada:

```sql
ALTER TABLE funcionarios
DROP CONSTRAINT pk_funcionarios;
```

## Considerações Adicionais

- **Alterações em Lote:** O PostgreSQL permite modificar várias propriedades da tabela em um único comando `ALTER TABLE`, o que pode melhorar a eficiência e reduzir o tempo de inatividade para alterações de schema em ambientes de produção.
- **Impacto no Desempenho:** Alterações significativas na estrutura de uma tabela, especialmente em tabelas grandes, podem ter impacto no desempenho. Recomenda-se realizar tais alterações durante janelas de manutenção ou em momentos de baixa atividade do sistema.
- **Backup:** É prudente fazer backup da tabela ou do banco de dados antes de realizar alterações estruturais importantes.