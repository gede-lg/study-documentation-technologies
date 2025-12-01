## Modelo de Dados para Autenticação

Para implementar a autenticação com JWT em uma aplicação Spring Boot, precisamos definir um modelo de dados que suporte usuários e suas permissões (convenção, não funciona se estiver faltando termos).

### Tabelas Necessárias:

1. **User**: Armazena informações do usuário.
2. **Permission**: Define permissões específicas.
3. **User-Permission**: Associa usuários a permissões (relação muitos-para-muitos).

### Exemplo de Modelo de Dados:

#### Tabela `user`

| Campo | Tipo | Descrição |
| ---- | ---- | ---- |
| id | BIGINT | Identificador único |
| username | VARCHAR(255) | Nome de usuário |
| password | VARCHAR(255) | Senha criptografada |
| fullname | VARCHAR(255) | Nome completo |
| account_non_expired | INTEGER |  |
| account_non_locked | INTEGER |  |
| credentials_non_expired | INTEGER |  |
| enabled | INTEGER |  |

#### Tabela `permission`

| Campo | Tipo | Descrição |
| ---- | ---- | ---- |
| id | BIGINT | Identificador único |
| name | VARCHAR(255) | Nome da permissão |
| description | VARCHAR(255) | Descrição da permissão |

#### Tabela `user_permission`

| **Campo**        | Tipo   | Descrição            |
|--------------|--------|----------------------|
| user_id      | BIGINT | Chave estrangeira para `user`    |
| permission_id| BIGINT | Chave estrangeira para `permission` |

### Implementação com Spring Boot

Para implementar a autenticação JWT com Spring Boot, você pode utilizar a dependência `spring-boot-starter-security` juntamente com `java-jwt`.

#### Exemplo de Dependências no `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>com.auth0</groupId>
        <artifactId>java-jwt</artifactId>
    </dependency>
    <!-- Outras dependências -->
</dependencies>
```

# Migrations das tabelas

1. **Permission**: 

```sql
--MIGRATION DE CRIAR TABELA

CREATE TABLE IF NOT EXISTS `permission` (

  `id` bigint(20) NOT NULL AUTO_INCREMENT,

  `description` varchar(255) DEFAULT NULL,

  PRIMARY KEY (`id`)
)

--MIGRATION DE INSERIR DADOS

INSERT INTO `permission` (`description`) VALUES

    ('ADMIN'),

    ('MANAGER'),

    ('COMMON_USER');
```

2. **User**:

```sql
--MIGRATION DE CRIAR TABELA

CREATE TABLE IF NOT EXISTS `users` (

  `id` bigint(20) NOT NULL AUTO_INCREMENT,

  `user_name` varchar(255) DEFAULT NULL,

  `full_name` varchar(255) DEFAULT NULL,

  `password` varchar(255) DEFAULT NULL,

  `account_non_expired` bit(1) DEFAULT NULL,

  `account_non_locked` bit(1) DEFAULT NULL,

  `credentials_non_expired` bit(1) DEFAULT NULL,

  `enabled` bit(1) DEFAULT NULL,

  PRIMARY KEY (`id`),

  UNIQUE KEY `uk_user_name` (`user_name`)

) ENGINE=InnoDB;

--MIGRATION DE INSERIR DADOS

INSERT INTO `users` (`user_name`, `full_name`, `password`, `account_non_expired`, `account_non_locked`, `credentials_non_expired`, `enabled`) VALUES

    ('leandro', 'Leandro Costa', '19bbf735b27066f2f145e602624e1b24a3fbc54cd5dfd3143fc5feea6bdee9e139ca7332d4806b9f', b'1', b'1', b'1', b'1'),

    ('flavio', 'Flavio Costa', '75ec349c1b0ef4ee7b249d0b83ae4861853f3aa77bce8c4b15f28cd43c6424ab4f29df431831bb0d', b'1', b'1', b'1', b'1');
```

3. **User_Permission**:

```sql
--MIGRATION DE CRIAR TABELA

CREATE TABLE IF NOT EXISTS `user_permission` (

  `id_user` bigint(20) NOT NULL,

  `id_permission` bigint(20) NOT NULL,

  PRIMARY KEY (`id_user`,`id_permission`),

  KEY `fk_user_permission_permission` (`id_permission`),

  CONSTRAINT `fk_user_permission` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),

  CONSTRAINT `fk_user_permission_permission` FOREIGN KEY (`id_permission`) REFERENCES `permission` (`id`)

) ENGINE=InnoDB;

--MIGRATION DE INSERIR DADOS

INSERT INTO `user_permission` (`id_user`, `id_permission`) VALUES

    (1, 1),

    (2, 1),

    (1, 2);
```
## Considerações Adicionais

- **Manuseio de Exceções**: Trate exceções relacionadas à autenticação e autorização de forma adequada.
- **Segurança do Token**: Armazene o token de maneira segura no lado do cliente e utilize HTTPS para prevenir interceptações.
- **Gerenciamento de Sessão**: Embora o JWT seja stateless, considere as implicações de segurança e gerenciamento de sessão.

## Conclusão

A implementação de autenticação com JWT em uma aplicação Spring Boot envolve configurar o Spring Security, criar um modelo de dados apropriado e implementar a lógica para geração e validação de tokens JWT. Esta solução oferece um método seguro e eficiente para gerenciar a autenticação e autorização em aplicações modernas.