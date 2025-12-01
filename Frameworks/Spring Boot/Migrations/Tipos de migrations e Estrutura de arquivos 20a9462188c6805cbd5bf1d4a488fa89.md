# Tipos de migrations e Estrutura de arquivos

---

## 2. Introdução

O Flyway é uma ferramenta de versionamento de banco de dados que auxilia no gerenciamento de alterações no esquema (schema) de forma controlada e reproduzível. Integrado ao Spring Boot, ele permite que as migrações sejam executadas automaticamente na inicialização da aplicação, garantindo que todos os ambientes (desenvolvimento, homologação, produção etc.) tenham a mesma estrutura de banco de dados. Neste guia:

- Apresentamos os tipos de migrações (versioned “V”, undo “U” e repeatable “R”).
- Explicamos a estrutura de arquivos e convenções de nomenclatura.
- Abordamos conceitos fundamentais e detalhes de configuração no contexto Spring Boot com Java.
- Descrevemos cenários em que Flyway pode não ser a melhor opção.
- Listamos componentes-chave e melhores práticas.
- Encerramos com um exemplo prático completo, do início ao fim.

---

## 3. Sumário

1. Conceitos Fundamentais
2. Tipos de Migrações (V, U e R)
3. Estrutura e Convenções de Arquivos de Migração
4. Configuração do Flyway no Spring Boot
5. Sintaxe Detalhada e Uso Prático
    - 5.1. Migrações SQL
    - 5.2. Migrações Java (Callback e `JdbcMigration`)
    - 5.3. Placeholders e Parametrização
    - 5.4. Baseline, Repair e Target
6. Cenários de Restrição ou Não Aplicação
7. Componentes Chave Associados
    - 7.1. `spring.flyway.*` e Propriedades de Configuração
    - 7.2. Tabela de Histórico de Migrações (`flyway_schema_history`)
    - 7.3. Callbacks e Eventos
8. Melhores Práticas e Padrões de Uso
9. Exemplo Prático Completo
10. Sugestões para Aprofundamento

---

## 4. Conceitos Fundamentais

1. **Versionamento de Banco de Dados**
    - A ideia central do Flyway é tratar alterações de banco de dados (criação/alteração de tabelas, índices, procedures, triggers etc.) como “migrações” que são aplicadas sequencialmente, seguindo versões.
    - Cada migração deve ser atômica e idempotente (não causar efeitos indesejados se executada múltiplas vezes ou parcialmente).
2. **Controle de Versão**
    - As migrações são armazenadas em arquivos sob controle de versão (Git, SVN, etc.), garantindo rastreabilidade de quem fez o quê e quando.
3. **Tabela de Histórico de Migrações**
    - O Flyway mantém uma tabela (por padrão chamada `flyway_schema_history`) que registra cada script aplicado, versão aplicada, checksum, data/hora e status.
    - Baseado nessa tabela, o Flyway sabe quais migrações já foram executadas e quais faltam.
4. **Integração com Spring Boot**
    - O Spring Boot detecta a dependência `org.flywaydb:flyway-core` no classpath e, se configurado, executa as migrações automaticamente durante a fase de “startup” (inicialização).
    - Propriedades como `spring.flyway.locations`, `spring.flyway.baseline-on-migrate` e `spring.flyway.placeholders.*` permitem customizar o comportamento.
5. **Atomicidade e Transações**
    - Quando o banco de dados suporta SQL transacional (e o driver JDBC o permite), cada migração é executada dentro de uma transação. Se ocorrer erro, todo o script é revertido. Muitos bancos (PostgreSQL, MySQL InnoDB, Oracle, SQL Server etc.) suportam essa abordagem.

---

## 5. Tipos de Migrações (V, U e R)

O Flyway categoriza migrações em três tipos principais, cada um com convenções específicas de nomenclatura e uso:

1. **Versioned Migrations (`V`)**
    - **Propósito:** Alterações incrementais e versionadas do esquema.
    - **Nomenclatura:**
        
        ```
        V<versão>__<descrição>.<sufixo>
        
        ```
        
        - `V` (prefixo obrigatório para migrações versioned).
        - `<versão>`: sequência numérica (inteira ou ponto-separada, ex.: `1`, `2`, `2.1`, `3.0.5`).
        - `__`: separador duplo antes da descrição.
        - `<descrição>`: texto legível (lower_snake_case, sem espaços), ex.: `create_users_table`.
        - `.<sufixo>`: geralmente `.sql` ou, se Java, `.java` (ou `.class` compilado).
    - **Exemplo:**
        - `V1__create_user_table.sql`
        - `V2__add_email_to_user.sql`
    - **Comportamento:**
        - O Flyway executa essas migrações na ordem crescente de `<versão>`.
        - Se uma nova migração `V3` for adicionada, o Flyway executa somente `V3` nas próximas execuções, pois `V1` e `V2` já constam na tabela de histórico.
2. **Undo Migrations (`U`)**
    - **Propósito:** Reverter alterações feitas por uma migração `V`. Útil para “rollback” controlado durante testes ou em cenários de CI/CD.
    - **Nomenclatura:**
        
        ```
        U<versão>__<descrição>.<sufixo>
        
        ```
        
        - A versão em `U` deve corresponder à versão de alguma migração `V`.
        - Por exemplo, se existe `V3__alter_table_x.sql`, pode haver `U3__revert_alter_table_x.sql`.
    - **Exemplo:**
        - `U2__drop_email_from_user.sql` (reverte `V2__add_email_to_user.sql`)
    - **Observações Importantes:**
        - Nem sempre se cria um “undo” para todas as migrações; avalie se o DDL pode ser revertido (e.g., criar colunas ←→ dropar colunas).
        - O Flyway executa as migrações `U` manualmente, via comando como `flyway undo`, não automaticamente em produção — pois rollback automático de esquema pode ser perigoso.
3. **Repeatable Migrations (`R`)**
    - **Propósito:** Migrações que podem (e devem) ser executadas repetidamente quando seu conteúdo mudar. Normalmente usadas para objetos de banco de dados que não têm versão, como views, procedimentos armazenados (procedures), functions, triggers, sinônimos, etc.
    - **Nomenclatura:**
        
        ```
        R__<descrição>.<sufixo>
        
        ```
        
        - Prefixo `R__` (note que *não* há versão explícita).
        - `<descrição>`: texto descritivo do objeto (ex.: `create_or_replace_view_user_summary`).
    - **Comportamento:**
        - O Flyway monitora o checksum de cada script `R__`. Sempre que o conteúdo mudar (checksum diferente), o Flyway reexecuta esse script na próxima inicialização.
        - A tabela de histórico registra um registro “repeatable” e mantém a data/horário de última execução. Todo script `R__` é executado na ordem alfabética (por nome).

---

## 6. Estrutura e Convenções de Arquivos de Migração

Embora Flyway permita customizar `prefix`, `separator`, `suffix` e `locations`, a convenção-padrão facilita padronização:

1. **Prefixo (Prefix):**
    - **Padrão:**
        - `V` para migrações versionadas.
        - `U` para migrações de undo.
        - `R` para migrações repeatable (sempre seguidas de dois underlines: `R__`).
    - **Personalização:**
        - É possível alterar via propriedade `flyway.sqlMigrationPrefix=XYZ` (porém, raramente recomendado, pois quebra convenções).
2. **Versão (Version):** *(apenas para `V` e `U`)*
    - Seqüência numérica hierárquica (inteiros ou decimais).
    - Exemplos: `1`, `1.1`, `2.0.3`, `10`.
    - O Flyway ordena por versão usando comparação “natural”.
3. **Separator:**
    - **Padrão:** `__` (duplo underscore).
    - Define o fim da parte “prefix+versão” e início da “descrição”.
    - Exemplo: `V3__add_status_to_order.sql`.
4. **Descrição (Description):**
    - Texto legível que indica a finalidade da migração.
    - Convenções:
        - Usar `snake_case` (lowercase + underscores) para melhor legibilidade.
        - Evitar caracteres especiais e espaços; underscore substitui espaços.
    - Exemplo: `create_invoice_table`, `update_customer_schema`.
5. **Suffix (Extensão):**
    - Geralmente `.sql`.
    - Para migrações Java, pode ser `.java` (caso use classes que implementem `JavaMigration` ou `JdbcMigration`).
    - Também é possível usar `.sql.zip` ou `.sql.gz` para scripts compactados.
    - Propriedade que define extensão: `flyway.sqlMigrationSuffixes=.sql,.sql.zip,.sql.gz`.
6. **Localização dos Scripts (Locations):**
    - **Padrão Spring Boot:** `classpath:db/migration` (ou seja, na pasta `src/main/resources/db/migration/`).
    - Estrutura típica:
        
        ```
        src/
          main/
            resources/
              db/
                migration/
                  V1__create_table_user.sql
                  V2__add_column_email.sql
                  R__refresh_materialized_view.sql
        
        ```
        
    - Pode-se adicionar mais localizações (ex.: scripts de testes) via:
        
        ```
        spring.flyway.locations=classpath:db/migration,classpath:db/test-migration
        
        ```
        

---

## 7. Configuração do Flyway no Spring Boot

O Spring Boot oferece **auto-configuração** para Flyway sempre que ele detecta a dependência `flyway-core`. A seguir, as principais propriedades para personalizar o comportamento:

```
# 1. Habilitar ou desabilitar migrações automáticas
spring.flyway.enabled=true

# 2. Localização dos scripts (padrão: classpath:db/migration)
spring.flyway.locations=classpath:db/migration

# 3. Esquema(s) alvo (para multi-schema)
spring.flyway.schemas=public,app_schema

# 4. Nome da tabela de histórico (padrão: flyway_schema_history)
spring.flyway.table=flyway_schema_history

# 5. Prefixo, separador e sufixo personalizados (raramente alterado)
spring.flyway.sql-migration-prefix=V
spring.flyway.sql-migration-separator=__
spring.flyway.sql-migration-suffixes=.sql

# 6. Baseline automático (útil para projeto legado)
spring.flyway.baseline-on-migrate=true
spring.flyway.baseline-version=1

# 7. Placeholder para parametrizar scripts (ex.: ${ctx})
spring.flyway.placeholders.ctx=produto
spring.flyway.placeholder-replacement=true

# 8. Ignorar falhas em migrations de limpeza (clean) ou validar checagem de checksum
spring.flyway.ignore-missing-migrations=false
spring.flyway.ignore-ignored-migrations=true
spring.flyway.ignore-future-migrations=false

# 9. Validar ao iniciar (valida checksums e versões)
spring.flyway.validate-on-migrate=true

# 10. Configurar “target” (versão máxima a ser migrada)
spring.flyway.target=3

# 11. Configurar “out-of-order” (quando versões foram adicionadas atrás de outras)
spring.flyway.out-of-order=false

# 12. Configurar locais de callbacks (opcional)
spring.flyway.locations=classpath:db/migration,classpath:db/callbacks

```

- Ao iniciar a aplicação, o Spring Boot chama internamente `FlywayMigrationInitializer`, que executa o método `migrate()`.
- Se `flyway.baseline-on-migrate=true` e a tabela de histórico não existir, o Flyway marca a versão base (`flyway.baseline-version`) como aplicada, evitando problemas em bancos já “em produção” sem histórico.

---

## 8. Sintaxe Detalhada e Uso Prático

### 8.1. Migrações SQL (`.sql`)

1. **Exemplo de Migração Versionada**
    
    Arquivo: `V1__create_user_table.sql`
    
    ```sql
    -- V1__create_user_table.sql
    CREATE TABLE usuario (
        id BIGSERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    
    ```
    
    - **Explicação:**
        - O Flyway detecta o prefixo `V`, versão `1`, descrição `create_user_table`.
        - Cria a tabela `usuario` com colunas `id`, `nome`, `email` e `data_criacao`.
    - **Transação:**
        - Em bancos transacionais (PostgreSQL, MySQL/InnoDB etc.), todo o script roda em uma transação.
        - Se falhar em qualquer ponto, a transação é revertida e o Flyway registra erro.
2. **Exemplo de Migração Repeatable**
    
    Arquivo: `R__create_or_replace_view_user_summary.sql`
    
    ```sql
    -- R__create_or_replace_view_user_summary.sql
    CREATE OR REPLACE VIEW vw_usuario_resumo AS
    SELECT id, nome, email
    FROM usuario
    WHERE ativo = true;
    
    ```
    
    - **Explicação:**
        - Toda vez que o conteúdo do script mudar (o Flyway monitora checksum), o Flyway reexecuta este script, garantindo que a *view* esteja sempre atualizada.
        - O prefixo `R__` indica que não há versão fixa.
3. **Exemplo de Migração de Undo**
    
    Arquivo: `U1__drop_user_table.sql`
    
    ```sql
    -- U1__drop_user_table.sql
    DROP TABLE IF EXISTS usuario;
    
    ```
    
    - **Uso:**
        - Deve-se chamar manualmente `flyway undo` (via CLI) ou configurar um ambiente de testes para executar essa reversão.
        - Raramente usado em produção, pois remover dados pode ser indesejável.

### 8.2. Migrações Java (Classes que Implementam Interface)

Além de scripts `.sql`, o Flyway permite criar migrações em Java. Esse recurso é útil quando se precisa de lógica condicional ou usar APIs Java diretamente (por exemplo, gravar logs em outra tabela).

1. **Dependência Maven** (já incluída se usar o `flyway-core`):
    
    ```xml
    <dependency>
      <groupId>org.flywaydb</groupId>
      <artifactId>flyway-core</artifactId>
      <version>9.16.0</version>
    </dependency>
    
    ```
    
2. **Criando uma Classe de Migração**
    - As classes devem estar em `src/main/java`, sob um pacote configurado (por padrão, `db.migration`, mas pode-se personalizar via `flyway.javaMigrationPrefix` ou `flyway.locations`).
    - **Exemplo:**
        
        ```java
        package db.migration;
        
        import org.flywaydb.core.api.migration.BaseJavaMigration;
        import org.flywaydb.core.api.migration.Context;
        
        public class V3__add_created_at_to_order extends BaseJavaMigration {
            @Override
            public void migrate(Context context) throws Exception {
                // Executa SQL usando JDBC
                context.getConnection()
                      .createStatement()
                      .execute("ALTER TABLE pedido ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP");
            }
        }
        
        ```
        
    - **Explicação:**
        - A classe estende `BaseJavaMigration`, nomeada seguindo a convenção `V<versão>__<descrição>`.
        - O método `migrate(Context)` é invocado pelo Flyway; o `Context` fornece acesso à `DataSource` e `Connection` JDBC.
    - **Configuração Adicional:**
        - Caso as classes estejam em outro pacote, defina em `application.properties`:
            
            ```
            spring.flyway.java-locations=classpath:db/migration_java
            
            ```
            
3. **Callbacks em Java**
    - Para executar lógica antes ou depois de uma migração, implementa-se `FlywayCallback`:
        
        ```java
        package db.callback;
        
        import org.flywaydb.core.api.callback.Callback;
        import org.flywaydb.core.api.callback.Context;
        import org.flywaydb.core.api.callback.Event;
        import org.flywaydb.core.api.callback.FlywayCallback;
        
        public class MyFlywayCallback implements FlywayCallback {
            @Override
            public void handle(Event event, Context context) {
                if (event == Event.BEFORE_MIGRATE) {
                    // lógica antes de migrar
                } else if (event == Event.AFTER_MIGRATE) {
                    // lógica depois de migrar
                }
                // Outros eventos: BEFORE_EACH_MIGRATE, AFTER_EACH_MIGRATE, etc.
            }
            // Métodos não usados podem ficar vazios
        }
        
        ```
        
    - **Registro no Spring Boot:**
        - Basta registrar como um bean:
            
            ```java
            @Configuration
            public class FlywayConfig {
                @Bean
                public FlywayCallback customCallback() {
                    return new MyFlywayCallback();
                }
            }
            
            ```
            

### 8.3. Placeholders e Parametrização

1. **Conceito:**
    - Placeholders permitem injetar valores dinâmicos nos scripts SQL (ex.: nomes de schema, valores de configuração, paths, etc.).
    - Sintaxe dentro do script: `${nomeDoPlaceholder}`.
2. **Exemplo Prático:**
    
    ```
    # application.properties
    spring.flyway.placeholders.schema_name=app_schema
    spring.flyway.placeholders.table_suffix=2025
    spring.flyway.placeholder-replacement=true
    
    ```
    
    **Script SQL (`V4__create_audit_table.sql`):**
    
    ```sql
    CREATE TABLE ${schema_name}.audit_usuarios_${table_suffix} (
        id BIGSERIAL PRIMARY KEY,
        usuario_id BIGINT NOT NULL,
        operacao VARCHAR(50) NOT NULL,
        data_operacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    
    ```
    
    - **O Flyway substitui** `${schema_name}` por `app_schema` e `${table_suffix}` por `2025` antes de executar.

### 8.4. Baseline, Repair e Target

1. **Baseline**
    - Útil quando se introduz Flyway em um projeto que já possui um banco “vivo”, sem histórico.
    - **Propriedade:** `spring.flyway.baseline-on-migrate=true` e `spring.flyway.baseline-version=<versão>`.
    - **Funcionamento:**
        - Na primeira execução, o Flyway cria a tabela de histórico (`flyway_schema_history`) e marca `<baseline-version>` como já aplicada (sem executar script correspondente).
        - A partir daí, as versões posteriores (maiores que `<baseline-version>`) serão executadas normalmente.
2. **Repair**
    - Corrige inconsistências de checksum ou entradas inválidas na tabela de histórico.
    - Uso CLI: `flyway repair` ou via API Java.
    - **Quando usar:**
        - Se um script já aplicado foi alterado “por engano” e o checksum não bate.
        - Remove linhas “falhas” de migrações pendentes (“failed”).
3. **Target**
    - Define até qual versão o Flyway deve migrar.
    - Propriedade: `spring.flyway.target=<versão>`.
    - **Exemplo:**
        - Se houver migrações `V1`, `V2`, `V3`, `V4`, mas `target=3`, o Flyway somente executa até `V3` e ignora `V4`.

---

## 9. Cenários de Restrição ou Não Aplicação

Embora o Flyway seja extremamente popular, há situações em que ele pode não ser a melhor escolha ou requerer cuidados especiais:

1. **Banco de Dados Sem Suporte a Transações DDL**
    - Alguns bancos (ou engines específicas) não escopam DDL em transações (ex.: MySQL MyISAM).
    - Se um script falhar no meio, parte das alterações pode persistir, deixando o esquema inconsistente.
    - **Solução:** Usar engines transacionais (InnoDB) ou criar scripts idempotentes (usar `IF EXISTS` / `IF NOT EXISTS`).
2. **Migrações em Ambientes com Permissões Restritas**
    - Em ambientes onde o usuário do banco não tem permissão para criar tabelas, índices ou procedures, o Flyway não conseguirá aplicar migrações.
    - **Solução:** Garantir user de banco com permissões adequadas em ambiente de homologação; em produção, executar migrações manualmente via DBA.
3. **Esquemas Altamente Dinâmicos em Produção Crítica**
    - Em sistemas que exigem atualizações de esquema sem downtime, é necessário planejar migrações “online” (zero-downtime), que demandam scripts mais cuidadosos (e.g., `CREATE TABLE NEW`, `INSERT INTO NEW SELECT * FROM OLD`, depois `DROP OLD`, e renomear).
    - Flyway executa todo script em “janela” de manutenção, o que pode não atender a janelas curtas de produção.
    - **Solução:** Utilizar estratégias de migração online específicas do banco ou ferramentas dedicadas (e.g., Liquibase com estratégias de “contexts”).
4. **Projetos Muito Pequenos / Protótipos Rápidos**
    - Se você está criando um protótipo de curta duração (algumas semanas) sem intenção de padronizar versionamento de esquema, a sobrecarga de adicionar Flyway pode ser desnecessária.
    - **Solução:** Criar scripts SQL manuais e executá-los via console/pseudo-IDE para protótipo.

---

## 10. Componentes Chave Associados

### 10.1. Propriedades Principais (`spring.flyway.*`)

| Propriedade | Descrição |
| --- | --- |
| `spring.flyway.enabled` | Habilita/desabilita migrações automáticas. |
| `spring.flyway.locations` | Localizações dos scripts (ex.: `classpath:db/migration`, `filesystem:/opt/flyway/mysql`). |
| `spring.flyway.schemas` | Esquemas que o Flyway deve gerenciar (se não especificado, usa `defaultSchema`). |
| `spring.flyway.table` | Nome da tabela de histórico (padrão: `flyway_schema_history`). |
| `spring.flyway.baseline-on-migrate` | Se `true`, gera um baseline automaticamente se a tabela de histórico não existir (útil em bancos legados). |
| `spring.flyway.baseline-version` | Versão inicial (baseline) a ser marcada como aplicada. |
| `spring.flyway.placeholder-replacement` | Habilita/desabilita substituição de placeholders. |
| `spring.flyway.placeholders.*` | Permite definir múltiplos placeholders, ex.: `spring.flyway.placeholders.schema_name=app_schema`. |
| `spring.flyway.out-of-order` | Permite executar migrações de versão inferior à já aplicada (válido quando multiple branches geraram versões paralelas). |
| `spring.flyway.target` | Define até qual versão deve migrar (versão máxima). |
| `spring.flyway.validate-on-migrate` | Se `true`, valida checksums e versões antes de aplicar migrações (evita alterações não registradas). |
| `spring.flyway.clean-on-validation-error` | Se `true`, executa `flyway clean` automaticamente se a validação falhar (perigoso em produção!). |
| `spring.flyway.ignore-missing-migrations` | Se `true`, ignora migrações ausentes em alguma branch (útil em CI quando uma migração foi removida localmente). |
| `spring.flyway.java-locations` | Localizações para classes de migração Java (ex.: `classpath:db/migration_java`). |

### 10.2. Tabela de Histórico (`flyway_schema_history`)

O Flyway cria, por padrão, a seguinte tabela para rastrear migrações:

```sql
CREATE TABLE flyway_schema_history (
    installed_rank INT NOT NULL,          -- ordem de execução (1, 2, 3, …)
    version VARCHAR(50),                  -- versão (ex.: 1, 1.1, 2)
    description VARCHAR(200) NOT NULL,    -- texto legível (ex.: "create_user_table")
    type VARCHAR(20) NOT NULL,            -- tipo: "SQL", "JDBC", "JAVA", "SPRING_JDBC" etc.
    script VARCHAR(1000) NOT NULL,        -- nome do script original (ex.: V1__create_user_table.sql)
    checksum INTEGER,                     -- checksum (hash) do script; null para repeatable
    installed_by VARCHAR(100) NOT NULL,   -- usuário do banco que executou a migração
    installed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- data/hora da execução
    execution_time INTEGER NOT NULL,      -- tempo em milissegundos para executar
    success BOOLEAN NOT NULL              -- se foi aplicada com sucesso
);

```

- **installed_rank:** Sequência numérica incremental que mostra a ordem em que as migrações foram aplicadas.
- **version:** Valor da migração (nulo para repeatable).
- **description:** Texto legível.
- **type:** Pode indicar “SQL” (script `.sql`), “JDBC” (script `.sql` usando JDBC), “JAVA” (classe Java), etc.
- **script:** Nome do arquivo de migração ou classe.
- **checksum:** Inteiro de verificação (hash) do conteúdo do script; null para migrações `R`.
- **installed_on:** Registro de data/hora.
- **execution_time:** Tempo necessário (ms) para aplicar a migração.
- **success:** `true` ou `false`.

### 10.3. Callbacks e Eventos

O Flyway disponibiliza **pontos de extensão** (callbacks) que permitem executar ações em eventos específicos. Exemplos de eventos:

- `BEFORE_CLEAN` / `AFTER_CLEAN`
- `BEFORE_MIGRATE` / `AFTER_MIGRATE`
- `BEFORE_EACH_MIGRATE` / `AFTER_EACH_MIGRATE`
- `BEFORE_VALIDATE` / `AFTER_VALIDATE`
- `BEFORE_REPAIR` / `AFTER_REPAIR`
- `BEFORE_INFO` / `AFTER_INFO`
- `BEFORE_BASELINE` / `AFTER_BASELINE`
- `BEFORE_OUT_OF_ORDER` / `AFTER_OUT_OF_ORDER`

Para cada evento, você pode registrar um callback SQL (arquivo `.sql` em `db/callbacks`) ou Java (classe que implementa `FlywayCallback` ou `Callback`).

**Exemplo de Callback SQL (`db/callbacks/beforeMigrate.sql`):**

```sql
-- Este script será executado antes de qualquer migração
INSERT INTO flyway_log (evento, data_ocorrencia) VALUES ('before_migrate', CURRENT_TIMESTAMP);

```

---

## 11. Melhores Práticas e Padrões de Uso

1. **Organização de Scripts**
    - Mantenha scripts pequenos e atômicos: cada migração deve tratar de uma única alteração (ex.: criar tabela, alterar coluna).
    - Evite arquivos monstruosos; isso facilita troubleshooting e reversão.
2. **Nomenclatura Consistente**
    - Use `snake_case` para descrições.
    - Não repita números de versão no nome além do prefixo (ex.: evite `V2__update_user_table_v2.sql`).
3. **Migrações Idempotentes**
    - Scripts devem **evitar falhar** se executados novamente, por exemplo:
        
        ```sql
        CREATE TABLE IF NOT EXISTS produto (
            id BIGSERIAL PRIMARY KEY,
            nome VARCHAR(100)
        );
        
        ```
        
    - Mas atenção: no Flyway, a tendência é que migrações **não sejam reaplicadas** se já executadas, então idempotência é mais relevante em callbacks ou em cenários de múltiplos ambientes independentes.
4. **Uso Moderado de Migrações Undo**
    - Só crie migrações de `U` se houver real necessidade de rollback em testes automatizados ou pipelines de CI.
    - Em produção, é melhor criar scripts manuais de rollback (via DBA) para garantir controle rigoroso do ambiente.
5. **Automatizar Baseline em Projetos Legados**
    - Se integrar Flyway a um banco já existente, use `baseline-on-migrate=true` para não executar scripts antigos.
6. **Validação de Checksums**
    - Habilite `validate-on-migrate=true` para evitar que scripts alterados sem atualização de versão sejam executados silenciosamente.
    - Em caso de alteração real de script, incrmente a versão ou crie uma migração `R` separada.
7. **Ambientes Separados para Testes**
    - Crie locais de migração distintos para testes unitários/integrados (por exemplo, `classpath:db/test-migration`).
    - Em testes, use `@FlywayTest` (se usar FlywayTestExtension) ou scripts SQL específicos.
8. **Documentação de Migrations**
    - Mantenha um changelog em paralelo (Markdown ou Wiki) que descreva objetivos de cada migração, inclusive autor, data e notas de implementação.
9. **Gerenciamento de Versionamento em Branches**
    - Se múltiplas features em paralelo adicionarem migrações, a convenção de versionamento decimal (`1.1`, `1.2`, `2.0`, etc.) deve ser acordada entre a equipe.
    - Utilize `out-of-order=true` somente quando for inevitável mesclar branches com versões “atrasadas”—mas evite essa prática se possível.

---

## 12. Exemplo Prático Completo

A seguir, um exemplo passo a passo de um mini-projeto Spring Boot que utiliza Flyway para gerenciar migrações.

### 12.1. Projeto Spring Boot (Padrão Maven)

**Estrutura de Pastas:**

```
my-app/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/example/myapp/
    │   │       ├── MyAppApplication.java
    │   │       └── db/
    │   │           └── migration/
    │   │               ├── V1__create_table_usuario.sql
    │   │               ├── V2__add_active_column_to_usuario.sql
    │   │               ├── R__create_or_replace_view_active_user.sql
    │   │               └── V3__insert_default_user.sql
    │   └── resources/
    │       ├── application.properties
    │       └── db/
    │           └── callbacks/
    │               └── beforeMigrate.sql
    └── test/
        └── java/
            └── com/example/myapp/
                └── MyAppApplicationTests.java

```

### 12.2. `pom.xml` (Dependência Flyway)

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" ...>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>my-app</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.8</version>
    <relativePath/>
  </parent>

  <dependencies>
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Driver PostgreSQL (ou outro banco) -->
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>

    <!-- Flyway Core -->
    <dependency>
      <groupId>org.flywaydb</groupId>
      <artifactId>flyway-core</artifactId>
    </dependency>

    <!-- Outros starters, testes etc. -->
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>

```

### 12.3. `application.properties`

```
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# Flyway Configurações
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.schemas=public
spring.flyway.table=flyway_schema_history
spring.flyway.baseline-on-migrate=true
spring.flyway.baseline-version=1
spring.flyway.validate-on-migrate=true
spring.flyway.placeholder-replacement=true
spring.flyway.placeholders.env=dev

```

- **`baseline-on-migrate=true`**: se for a primeira vez que o Flyway roda em um banco legado, define a versão base (1).
- **`placeholder env=dev`**: demonstra como parametrizar detalhes de ambiente (poderia ser usado em scripts).

### 12.4. Scripts de Migração SQL

1. **V1__create_table_usuario.sql**
    
    ```sql
    -- V1__create_table_usuario.sql
    CREATE TABLE usuario (
        id BIGSERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        ativo BOOLEAN NOT NULL DEFAULT true,
        data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    
    ```
    
2. **V2__add_last_login_to_usuario.sql**
    
    ```sql
    -- V2__add_last_login_to_usuario.sql
    ALTER TABLE usuario
    ADD COLUMN last_login TIMESTAMP;
    
    ```
    
3. **R__create_or_replace_view_active_user.sql**
    
    ```sql
    -- R__create_or_replace_view_active_user.sql
    CREATE OR REPLACE VIEW vw_usuarios_ativos AS
    SELECT id, nome, email, data_criacao
    FROM usuario
    WHERE ativo = true;
    
    ```
    
4. **V3__insert_default_user.sql**
    
    ```sql
    -- V3__insert_default_user.sql
    INSERT INTO usuario (nome, email, ativo)
    VALUES ('Admin', 'admin@example.com', true);
    
    ```
    

### 12.5. Callback Antes da Migração

1. Arquivo: `src/main/resources/db/callbacks/beforeMigrate.sql`
    
    ```sql
    -- Antes de todas as migrações, registra log na tabela customizada
    CREATE TABLE IF NOT EXISTS flyway_log (
        id SERIAL PRIMARY KEY,
        evento VARCHAR(50) NOT NULL,
        data_ocorrencia TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    INSERT INTO flyway_log (evento) VALUES ('before_migrate');
    
    ```
    
2. Para que esse callback seja executado, adicione em `application.properties`:
    
    ```
    spring.flyway.locations=classpath:db/migration,classpath:db/callbacks
    
    ```
    

### 12.6. Classe Principal do Spring Boot

```java
package com.example.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyAppApplication.class, args);
    }
}

```

- Ao rodar a aplicação (`mvn spring-boot:run`), o Spring Boot:
    1. Inicializa `DataSource` (conecta ao PostgreSQL).
    2. Detecta `flyway-core` no classpath.
    3. Executa Flyway:
        - Se a tabela `flyway_schema_history` não existir, como `baseline-on-migrate=true`, marca `V1` como baseline.
        - Executa `BEFORE_MIGRATE` callback.
        - Executa migrações `V2` e `V3` (já que `V1` está no baseline).
        - Executa script `R__create_or_replace_view_active_user`.
        - Registra cada entrada na tabela de histórico.
    4. Sobe o contexto Spring e disponibiliza beans, repositórios, controllers etc.

### 12.7. Verificando Resultado no Banco

Após o startup bem-sucedido:

- **Tabelas Criadas:**
    - `usuario` com colunas `id`, `nome`, `email`, `ativo`, `data_criacao`, `last_login`.
    - `vw_usuarios_ativos` (view).
    - `flyway_schema_history`.
    - `flyway_log` (callback).
- **Dados:**
    - Linha em `usuario`: `(1, 'Admin', 'admin@example.com', true, <timestamp>, null)`.
- **Histórico no Flyway:**
    
    ```sql
    SELECT installed_rank, version, description, type, script, installed_on, execution_time, success
    FROM flyway_schema_history
    ORDER BY installed_rank;
    
    ```
    
    - Linhas (exemplo):
        
        
        | installed_rank | version | description | type | script | installed_on | execution_time | success |
        | --- | --- | --- | --- | --- | --- | --- | --- |
        | 1 | 1 | create_table_usuario | SQL | V1__create_table_usuario.sql | 2025-06-05 21:XX:XX | 120 | true |
        | 2 | 2 | add_last_login_to_usuario | SQL | V2__add_last_login_to_usuario.sql | 2025-06-05 21:XX:XX | 50 | true |
        | 3 | null | create_or_replace_view_active_user | R | R__create_or_replace_view_active_user.sql | 2025-06-05 21:XX:XX | 30 | true |
        | 4 | 3 | insert_default_user | SQL | V3__insert_default_user.sql | 2025-06-05 21:XX:XX | 70 | true |

---

## 13. Sugestões para Aprofundamento

1. **Flyway CLI e Integração com Pipelines CI/CD**
    - Uso de `flyway migrate`, `flyway info`, `flyway repair`, `flyway clean` diretamente no Jenkins/GitLab CI/Bitbucket Pipelines para automatizar rollout de banco.
2. **Estratégias de Migração Online (Zero-Downtime)**
    - Aprender sobre “blue-green deployments” de banco e “shadow tables” para atualizações sem parada de serviço.
3. **Comparação com Liquibase**
    - Avaliar prós/contras de Flyway vs. Liquibase (ex.: Flyway é mais simples, Liquibase oferece “XML/JSON/YAML” como formatos de migração e “Contexts/Tags”).
4. **Migrations em Ambientes Multi-Tenant**
    - Como aplicar migrações condicionalmente por tenant em SaaS multi-tenant.
5. **Monitoramento e Métricas**
    - Instrumentar logs do Flyway para métricas de tempo de execução, alertas de falhas e auditoria.

---

### Conclusão

Neste guia, cobrimos desde **conceitos fundamentais** (por que usar Flyway) até **detalhes avançados** (undo migrations, callbacks, placeholders, cenários de restrição), tudo contextualizado no **Spring Boot com Java**. Também apresentamos um **exemplo completo** de projeto que demonstra a estrutura de pastas, configuração, scripts SQL e callbacks. Ao seguir as **melhores práticas** descritas, você garante um gerenciamento de versão de banco de dados seguro, previsível e replicável em todos os seus ambientes.

Conte com este material como referência ao implementar Flyway em seus projetos Spring Boot. Bom desenvolvimento!