# T5.07 - Estrutura de Diretórios e Pacotes

## Introdução

**Estrutura de diretórios** deve **refletir exatamente** a hierarquia de pacotes Java.

**Regra**: `package br.com.empresa.ecommerce.modelo` → `br/com/empresa/ecommerce/modelo/`

**Estrutura obrigatória**:
```
src/
  br/
    com/
      empresa/
        ecommerce/
          modelo/
            Produto.java
```

---

## Fundamentos

### 1. Correspondência Package ↔ Diretório

**Declaração package**:
```java
package br.com.empresa.ecommerce.modelo;

public class Produto {}
```

**Caminho obrigatório**:
```
src/br/com/empresa/ecommerce/modelo/Produto.java
```

**❌ Erro**: Arquivo em caminho diferente
```
src/modelo/Produto.java  // ERRO: não corresponde ao package
```

### 2. Separador de Diretórios

**Windows**: `\` (barra invertida)
```
src\br\com\empresa\ecommerce\modelo\Produto.java
```

**Linux/Mac**: `/` (barra)
```
src/br/com/empresa/ecommerce/modelo/Produto.java
```

**Java aceita ambos**, mas convenção usa `/` em documentação.

### 3. Estrutura Maven/Gradle Padrão

**Maven Standard Directory Layout**:

```
projeto/
  src/
    main/
      java/
        br/
          com/
            empresa/
              ecommerce/
                modelo/
                  Produto.java
                  Categoria.java
                service/
                  ProdutoService.java
                repository/
                  ProdutoRepository.java
      resources/
        application.properties
        static/
        templates/
    test/
      java/
        br/
          com/
            empresa/
              ecommerce/
                service/
                  ProdutoServiceTest.java
      resources/
  pom.xml (Maven) ou build.gradle (Gradle)
```

**Diretórios principais**:
- `src/main/java`: Código-fonte produção
- `src/main/resources`: Recursos (configs, templates)
- `src/test/java`: Testes
- `src/test/resources`: Recursos de teste

### 4. Nome do Arquivo = Nome da Classe Pública

**Regra**: Arquivo `.java` deve ter **mesmo nome** da classe pública.

```java
// Arquivo: Produto.java
package br.com.empresa.ecommerce.modelo;

public class Produto {} // ✅ Nome corresponde
```

**❌ Erro**: Nome diferente
```java
// Arquivo: Item.java
package br.com.empresa.ecommerce.modelo;

public class Produto {} // ERRO: nome não corresponde
```

### 5. Múltiplas Classes no Mesmo Arquivo

**Permitido**: Múltiplas classes **package-private** + 1 pública.

```java
// Arquivo: Produto.java
package br.com.empresa.ecommerce.modelo;

public class Produto {} // Pública, nome = arquivo

class ProdutoHelper {} // Package-private, mesmo arquivo OK

class ProdutoValidator {} // Package-private, OK
```

**❌ Proibido**: Múltiplas classes **públicas**.
```java
// Arquivo: Produto.java
public class Produto {}
public class Categoria {} // ERRO: apenas 1 classe pública por arquivo
```

### 6. Source Root

**Source root** = Diretório base para pacotes.

**Maven**: `src/main/java`

**Configuração IDE** (IntelliJ):
```
Marcar diretório como "Sources Root":
src/main/java → Mark Directory as → Sources Root
```

**Caminho completo**:
```
[PROJECT_ROOT]/src/main/java/br/com/empresa/ecommerce/modelo/Produto.java
                              ↑
                         Source Root
```

### 7. Compilação e Estrutura de Diretórios

**Compilação manual**:
```bash
# Compilar
javac -d bin src/br/com/empresa/ecommerce/modelo/Produto.java

# Estrutura gerada em bin/
bin/
  br/
    com/
      empresa/
        ecommerce/
          modelo/
            Produto.class
```

**Opção `-d`**: Define diretório de saída para `.class`.

**Execução**:
```bash
java -cp bin br.com.empresa.ecommerce.modelo.Produto
```

### 8. Package Padrão (Default Package)

**Sem package**: Arquivo no **source root** diretamente.

```java
// Arquivo: src/main/java/Produto.java
// Sem declaração package

public class Produto {}
```

**Estrutura**:
```
src/
  main/
    java/
      Produto.java  // Diretamente no source root
```

**❌ Problema**: Não pode ser importado por classes em pacotes nomeados.

### 9. Pacotes e Subpacotes (Independência)

**Subpacotes são independentes**:

```
br/com/empresa/ecommerce/
  Util.java (package br.com.empresa.ecommerce)

br/com/empresa/ecommerce/modelo/
  Produto.java (package br.com.empresa.ecommerce.modelo)
```

**Não há relação de herança**, apenas nomenclatura.

```java
// br.com.empresa.ecommerce.Util (package-private)
package br.com.empresa.ecommerce;
class Util {}

// br.com.empresa.ecommerce.modelo.Produto
package br.com.empresa.ecommerce.modelo;

public class Produto {
    void metodo() {
        Util u = new Util(); // ERRO: pacotes diferentes (não é subpacote)
    }
}
```

### 10. Organização por Camadas ou Funcionalidades

**Camadas** (MVC):
```
src/main/java/br/com/empresa/ecommerce/
  controller/
    UsuarioController.java
    ProdutoController.java
  service/
    UsuarioService.java
    ProdutoService.java
  repository/
    UsuarioRepository.java
    ProdutoRepository.java
  model/
    Usuario.java
    Produto.java
```

**Funcionalidades** (DDD):
```
src/main/java/br/com/empresa/ecommerce/
  usuario/
    Usuario.java
    UsuarioService.java
    UsuarioRepository.java
  produto/
    Produto.java
    ProdutoService.java
    ProdutoRepository.java
  pedido/
    Pedido.java
    PedidoService.java
```

---

## Aplicabilidade

**Estrutura Maven/Gradle quando**:
- Projeto profissional
- Build automatizado
- Testes separados de produção

**Estrutura simples quando**:
- Aprendizado inicial
- Scripts pequenos

```
aprendizado/
  Produto.java
  Main.java
```

---

## Armadilhas

### 1. Arquivo em Diretório Errado

**Declaração**:
```java
package br.com.empresa.ecommerce.modelo;
public class Produto {}
```

**❌ Erro**: Arquivo em `src/modelo/Produto.java`

**✅ Correto**: `src/br/com/empresa/ecommerce/modelo/Produto.java`

### 2. Nome do Arquivo ≠ Nome da Classe

```java
// Arquivo: Item.java
public class Produto {} // ERRO
```

**Erro de compilação**: `class Produto is public, should be declared in a file named Produto.java`

### 3. Source Root Incorreto na IDE

**IntelliJ**: Se `src` não está marcado como Sources Root, imports não funcionam.

**Solução**: `Right-click → Mark Directory as → Sources Root`

### 4. Case Sensitivity em Linux

**Windows**: Não diferencia maiúsculas (`produto.java` = `Produto.java`)

**Linux**: Case-sensitive (`produto.java` ≠ `Produto.java`)

```bash
# Linux
Produto.java  # ✅
produto.java  # ❌ Não encontra classe Produto
```

---

## Boas Práticas

### 1. Use Maven/Gradle Layout

```
src/main/java    # Código produção
src/test/java    # Testes
```

### 2. Consistência de Nomenclatura

**Pacote**: lowercase (`modelo`)
**Classe**: PascalCase (`Produto`)
**Arquivo**: `Produto.java`

### 3. Organize Logicamente

**Escolha camadas ou funcionalidades**, mantenha consistência.

### 4. Evite Pacotes Muito Profundos

```
// ❌ Excessivo
br/com/empresa/divisao/setor/departamento/area/sistema/modulo/

// ✅ Ideal
br/com/empresa/ecommerce/modelo/
```

### 5. Use .gitignore para Diretórios de Build

```gitignore
# Maven
target/

# Gradle
build/

# IDEs
.idea/
*.iml
.classpath
.project
```

---

## Resumo

**Estrutura de diretórios = estrutura de pacotes**:

**Regra**:
```java
package br.com.empresa.ecommerce.modelo;
```

**Caminho**:
```
src/main/java/br/com/empresa/ecommerce/modelo/Produto.java
```

**Maven/Gradle**:
```
src/
  main/
    java/       # Código produção
    resources/  # Configs
  test/
    java/       # Testes
    resources/  # Configs de teste
```

**Correspondências**:
- **Package**: `br.com.empresa.ecommerce.modelo`
- **Diretório**: `br/com/empresa/ecommerce/modelo/`
- **Arquivo**: `Produto.java`
- **Classe pública**: `public class Produto`

**Regra de Ouro**: **Estrutura de diretórios deve refletir exatamente a hierarquia de pacotes**, nome do arquivo = nome da classe pública.
