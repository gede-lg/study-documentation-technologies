# Conexão no Hibernate

## O que é e para que serve?

A conexão no Hibernate refere-se ao processo de estabelecer uma ligação entre a aplicação Java e o banco de dados usando o framework Hibernate. O Hibernate facilita a interação com o banco de dados, abstraindo muitos detalhes complexos de JDBC (Java Database Connectivity), permitindo aos desenvolvedores focar mais na lógica de negócios e menos no gerenciamento de banco de dados.

## SessionFactory

### Conceito
`SessionFactory` é uma interface do Hibernate que cria objetos `Session`. É uma fábrica de `Session` e é tipicamente criada uma única vez durante a inicialização da aplicação. `SessionFactory` é pesada em termos de recursos e, geralmente, é compartilhada por todas as threads da aplicação.

### Métodos e Sintaxes

- **openSession()**: Cria uma nova `Session`.
  ```java
  Session session = sessionFactory.openSession();
  ```

- **getCurrentSession()**: Retorna a `Session` atual vinculada ao contexto da transação.
  ```java
  Session session = sessionFactory.getCurrentSession();
  ```

- **close()**: Fecha a `SessionFactory`.
  ```java
  sessionFactory.close();
  ```

### Exemplo de Criação de SessionFactory

```java
Configuration configuration = new Configuration();
configuration.configure();
SessionFactory sessionFactory = configuration.buildSessionFactory();
```

## Session

### Conceito
`Session` é a interface primária do Hibernate usada para interagir com o banco de dados. Uma `Session` representa uma única unidade de trabalho com o banco de dados e é leve, devendo ser criada e descartada para cada transação ou série de transações.

### Métodos e Sintaxes

- **beginTransaction()**: Inicia uma transação.
  ```java
  Transaction tx = session.beginTransaction();
  ```

- **save(Object)**: Persiste um objeto no banco de dados.
  ```java
  session.save(objeto);
  ```

- **get(Class, Serializable)**: Recupera um objeto pelo identificador.
  ```java
  MyClass objeto = session.get(MyClass.class, id);
  ```

- **update(Object)**: Atualiza um objeto no banco de dados.
  ```java
  session.update(objeto);
  ```

- **delete(Object)**: Remove um objeto do banco de dados.
  ```java
  session.delete(objeto);
  ```

- **createQuery(String)**: Cria um objeto `Query`.
  ```java
  Query query = session.createQuery("from MyClass");
  ```

- **close()**: Fecha a `Session`.
  ```java
  session.close();
  ```

### Exemplo de Uso da Session

```java
Session session = sessionFactory.openSession();
Transaction tx = session.beginTransaction();

MyClass objeto = new MyClass();
session.save(objeto);

tx.commit();
session.close();
```

## Configuration

### Conceito
`Configuration` é uma classe do Hibernate usada para configurar a `SessionFactory` com as configurações do banco de dados e mapeamentos de entidades.

### Métodos e Sintaxes

- **

configure()**: Carrega as configurações do arquivo `hibernate.cfg.xml`.
  ```java
  Configuration configuration = new Configuration();
  configuration.configure();
  ```

- **addAnnotatedClass(Class)**: Adiciona uma classe anotada para mapeamento.
  ```java
  configuration.addAnnotatedClass(MinhaClasse.class);
  ```

- **setProperty(String, String)**: Define uma propriedade de configuração.
  ```java
  configuration.setProperty("hibernate.show_sql", "true");
  ```

- **buildSessionFactory()**: Cria uma instância de `SessionFactory`.
  ```java
  SessionFactory sessionFactory = configuration.buildSessionFactory();
  ```

### Exemplo de Configuração

```java
package dao;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class ConexaoHibernate {

    private static final SessionFactory sessionFactory;
    
    static {
        try {
            // Create the SessionFactory from standard (hibernate.cfg.xml) 
            // config file.
            sessionFactory = new Configuration().configure().buildSessionFactory();
        } catch (Throwable ex) {
            // Log the exception. 
            System.err.println("Initial SessionFactory creation failed." + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }
    
    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }
}
```

Neste exemplo, `Configuration` é inicializado e configurado com um arquivo de configuração específico, uma classe anotada para mapeamento de entidade, e uma propriedade adicional para exibir as consultas SQL.

## Conclusão

A conexão no Hibernate é gerenciada através destes três componentes principais - `SessionFactory`, `Session` e `Configuration`. `SessionFactory` é uma interface pesada e de longa duração que cria `Session`, a principal interface para interagir com o banco de dados. `Session` é leve e destinada a ser de curta duração. `Configuration`, por outro lado, é usado para configurar o Hibernate e construir o `SessionFactory`. Juntos, esses componentes simplificam a interação com o banco de dados, abstraindo muitas das complexidades do JDBC e permitindo que os desenvolvedores se concentrem mais na lógica do negócio.