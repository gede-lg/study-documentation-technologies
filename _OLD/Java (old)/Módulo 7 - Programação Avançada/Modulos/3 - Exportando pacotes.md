
A palavra-chave `exports` é usada para tornar um pacote acessível a outros módulos. Se você não exportar um pacote, ele será encapsulado dentro do módulo e não poderá ser acessado de fora.

### Sintaxe

```java
exports <nome_do_pacote>;
```

### Exemplo

Vamos supor que temos um módulo chamado `my.module` que contém um pacote `com.example`. Queremos exportar este pacote para que outros módulos possam usá-lo.

#### Estrutura do Projeto

```
my.module/
|-- module-info.java
|-- com/
    |-- example/
        |-- MyClass.java
```

#### Código

**module-info.java**
```java
module my.module {
    exports com.example;
}
```

**MyClass.java**
```java
package com.example;

public class MyClass {
    public void sayHello() {
        System.out.println("Hello from MyClass!");
    }
}
```

## Exportando Pacotes para um Módulo Específico (`exports to`)

Às vezes, você pode querer exportar um pacote, mas apenas para módulos específicos. Para isso, você pode usar `exports <package> to <module1>, <module2>, ...`.

### Sintaxe

```java
exports <nome_do_pacote> to <nome_do_modulo>;
```

### Exemplo

Vamos supor que queremos exportar o pacote `com.example` do módulo `my.module`, mas apenas para o módulo `another.module`.

#### Estrutura do Projeto

```
my.module/
|-- module-info.java
|-- com/
    |-- example/
        |-- MyClass.java

another.module/
|-- module-info.java
|-- com/
    |-- anotherexample/
        |-- AnotherClass.java
```

#### Código

**module-info.java em `my.module`**
```java
module my.module {
    exports com.example to another.module;
}
```

**MyClass.java em `my.module`**
```java
package com.example;

public class MyClass {
    public void sayHello() {
        System.out.println("Hello from MyClass!");
    }
}
```

**module-info.java em `another.module`**
```java
module another.module {
    requires my.module;
}
```

**AnotherClass.java em `another.module`**
```java
package com.anotherexample;

import com.example.MyClass;

public class AnotherClass {
    public static void main(String[] args) {
        MyClass myClass = new MyClass();
        myClass.sayHello();
    }
}
```

### Informações Adicionais

Além de `exports`, existem outras diretivas importantes no `module-info.java`:

- `requires`: Indica dependência de outro módulo.
- `opens`: Similar a `exports`, mas permite reflexão (usado, por exemplo, com bibliotecas como JAXB).
- `uses`: Declara que o módulo usa um serviço.
- `provides ... with`: Declara que o módulo fornece uma implementação de um serviço.

#### `requires` Exemplo

Se um módulo depende de outro, você deve usar `requires`.

**module-info.java em `another.module`**
```java
module another.module {
    requires my.module;
}
```

#### `opens` Exemplo

Permite acesso reflexivo a um pacote, útil para frameworks que usam reflexão.

**module-info.java**
```java
module my.module {
    opens com.example to another.module;
}
```

### Resumo

- **Módulos**: Componentes encapsulados e reutilizáveis.
- **exports**: Torna um pacote acessível a todos os módulos.
- **exports to**: Torna um pacote acessível apenas a módulos específicos.
- **requires**: Indica dependência de outro módulo.
- **opens**: Permite reflexão em um pacote específico.
- **uses**: Declara que um módulo usa um serviço.
- **provides ... with**: Declara que um módulo fornece uma implementação de um serviço.

Os módulos ajudam a melhorar a organização, encapsulamento e segurança do código em projetos Java. Com a utilização correta de `exports` e `exports to`, você pode controlar precisamente a visibilidade dos pacotes e melhorar a modularidade do seu aplicativo.