
## Importando Pacotes de um Módulo

A palavra-chave `requires` é usada para especificar que um módulo depende de outro módulo. Isso torna os pacotes públicos do módulo requerido acessíveis ao módulo requerente.

#### Sintaxe

```java
requires <module-name>;
```

#### Exemplo

Suponha que temos dois módulos: `meumodulo` e `outromodulo`. O `meumodulo` depende do `outromodulo`.

Estrutura de diretórios:
```
src/
├── meumodulo/
│   ├── module-info.java
│   └── com/
│       └── exemplo/
│           └── meumodulo/
│               └── MinhaClasse.java
└── outromodulo/
    ├── module-info.java
    └── com/
        └── exemplo/
            └── outromodulo/
                └── OutraClasse.java
```

`module-info.java` do `outromodulo`:
```java
module outromodulo {
    exports com.exemplo.outromodulo;
}
```

`module-info.java` do `meumodulo`:
```java
module meumodulo {
    requires outromodulo;
}
```

Código da `MinhaClasse` no `meumodulo`:
```java
package com.exemplo.meumodulo;

import com.exemplo.outromodulo.OutraClasse;

public class MinhaClasse {
    public static void main(String[] args) {
        OutraClasse oc = new OutraClasse();
        oc.metodo();
    }
}
```

Código da `OutraClasse` no `outromodulo`:
```java
package com.exemplo.outromodulo;

public class OutraClasse {
    public void metodo() {
        System.out.println("Método de OutraClasse chamado!");
    }
}
```

---
## Importando Pacotes de Dependências Transitivas

A palavra-chave `requires transitive` é usada quando um módulo deseja exportar não apenas seus próprios pacotes, mas também os pacotes de outro módulo do qual depende. Isso significa que qualquer módulo que depende do primeiro módulo também terá acesso às dependências transitivas.

#### Sintaxe

```java
requires transitive <module-name>;
```

#### Exemplo

Suponha que temos três módulos: `moduloA`, `moduloB` e `moduloC`. O `moduloA` depende do `moduloB`, e o `moduloB` depende do `moduloC` e deseja expor `moduloC` aos módulos que dependem dele.

Estrutura de diretórios:
```
src/
├── moduloA/
│   ├── module-info.java
│   └── com/
│       └── exemplo/
│           └── moduloA/
│               └── ClasseA.java
├── moduloB/
│   ├── module-info.java
│   └── com/
│       └── exemplo/
│           └── moduloB/
│               └── ClasseB.java
└── moduloC/
    ├── module-info.java
    └── com/
        └── exemplo/
            └── moduloC/
                └── ClasseC.java
```

`module-info.java` do `moduloC`:
```java
module moduloC {
    exports com.exemplo.moduloC;
}
```

`module-info.java` do `moduloB`:
```java
module moduloB {
    requires transitive moduloC;
    exports com.exemplo.moduloB;
}
```

`module-info.java` do `moduloA`:
```java
module moduloA {
    requires moduloB;
}
```

Código da `ClasseC` no `moduloC`:
```java
package com.exemplo.moduloC;

public class ClasseC {
    public void metodoC() {
        System.out.println("Método de ClasseC chamado!");
    }
}
```

Código da `ClasseB` no `moduloB`:
```java
package com.exemplo.moduloB;

import com.exemplo.moduloC.ClasseC;

public class ClasseB {
    public void metodoB() {
        ClasseC c = new ClasseC();
        c.metodoC();
    }
}
```

Código da `ClasseA` no `moduloA`:
```java
package com.exemplo.moduloA;

import com.exemplo.moduloB.ClasseB;

public class ClasseA {
    public static void main(String[] args) {
        ClasseB b = new ClasseB();
        b.metodoB();
    }
}
```

Neste exemplo, `moduloA` depende de `moduloB`, que, por sua vez, depende de `moduloC` e exporta essa dependência usando `requires transitive`. Isso permite que `moduloA` acesse `ClasseC` de `moduloC` através de `moduloB`.

### Informações Adicionais

#### `exports`
A palavra-chave `exports` é usada para tornar os pacotes de um módulo disponíveis para outros módulos. Apenas os pacotes exportados são acessíveis de fora do módulo.

#### Sintaxe

```java
exports <package-name>;
```

#### Exemplo de `exports`

No exemplo acima, o `moduloC` exporta o pacote `com.exemplo.moduloC`:
```java
module moduloC {
    exports com.exemplo.moduloC;
}
```

### `open` e `opens`

Além de `exports`, existem outras palavras-chave como `open` e `opens` para controle de acesso mais granular, especialmente útil para reflexão.

#### `open`
Abre todos os pacotes de um módulo para reflexão em tempo de execução.

```java
open module moduloC {
    exports com.exemplo.moduloC;
}
```

#### `opens`
Abre pacotes específicos para reflexão em tempo de execução.

```java
module moduloC {
    opens com.exemplo.moduloC;
}
```

### Resumo

- **Módulos**: Unidade de código no Java que encapsula pacotes, classes e recursos.
- **requires**: Importa pacotes de outro módulo.
- **requires transitive**: Importa pacotes de dependências de outro módulo, permitindo que módulos dependentes também os acessem.
- **exports**: Torna pacotes de um módulo acessíveis para outros módulos.
- **open/opens**: Controle de acesso para reflexão.

Módulos melhoram a organização, segurança e desempenho do código Java, proporcionando uma forma clara de gerenciar dependências e acessos.

Se precisar de mais detalhes ou tiver perguntas específicas, estou à disposição! ✔️🔧