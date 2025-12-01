# T8.07 - Enum em Hierarquias de Tipos

## Introdução

**Hierarquia de tipos**: enum pode participar de hierarquias através de interfaces.

```java
// ✅ Hierarquia de interfaces
interface Processador {
    String processar(String entrada);
}

interface ProcessadorFormatado extends Processador {
    String getFormato();
}

// ✅ Enum implementa interface derivada
public enum TipoProcessamento implements ProcessadorFormatado {
    MAIUSCULA("Maiúsculas") {
        @Override
        public String processar(String entrada) {
            return entrada.toUpperCase();
        }
    };
    
    private final String formato;
    
    TipoProcessamento(String formato) {
        this.formato = formato;
    }
    
    @Override
    public String getFormato() {
        return formato;
    }
}

// ✅ Polimorfismo pela hierarquia
Processador p = TipoProcessamento.MAIUSCULA;
ProcessadorFormatado pf = TipoProcessamento.MAIUSCULA;
```

**Hierarquia**: relação is-a através de interfaces.

---

## Fundamentos

### 1. Interface Base e Derivada

```java
// ✅ Interface base
interface Base {
    String getId();
}

// ✅ Interface derivada
interface Nomeavel extends Base {
    String getNome();
}

// ✅ Enum implementa derivada (herda base)
public enum Categoria implements Nomeavel {
    TECNOLOGIA("TEC", "Tecnologia");
    
    private final String id;
    private final String nome;
    
    Categoria(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }
    
    @Override
    public String getId() {
        return id;
    }
    
    @Override
    public String getNome() {
        return nome;
    }
}

// ✅ Polimorfismo em ambos os níveis
Base b = Categoria.TECNOLOGIA;
Nomeavel n = Categoria.TECNOLOGIA;
```

### 2. Múltiplos Níveis de Hierarquia

```java
interface Identificavel {
    String getId();
}

interface Nomeavel extends Identificavel {
    String getNome();
}

interface Descritivel extends Nomeavel {
    String getDescricao();
}

// ✅ Enum no topo da hierarquia
public enum Produto implements Descritivel {
    NOTEBOOK("NB001", "Notebook", "Notebook Dell");
    
    private final String id;
    private final String nome;
    private final String descricao;
    
    Produto(String id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }
    
    @Override
    public String getId() { return id; }
    
    @Override
    public String getNome() { return nome; }
    
    @Override
    public String getDescricao() { return descricao; }
}

// ✅ Polimorfismo em todos os níveis
Identificavel i = Produto.NOTEBOOK;
Nomeavel n = Produto.NOTEBOOK;
Descritivel d = Produto.NOTEBOOK;
```

### 3. Enum em Árvore de Tipos

```java
// ✅ Raiz
interface Entidade {
    Long getId();
}

// ✅ Ramos
interface Auditavel extends Entidade {
    String getDataCriacao();
}

interface Versionavel extends Entidade {
    int getVersao();
}

// ✅ Folha: implementa múltiplos ramos
public enum Documento implements Auditavel, Versionavel {
    CONTRATO(1L, "2024-01-01", 1);
    
    private final Long id;
    private final String dataCriacao;
    private final int versao;
    
    Documento(Long id, String dataCriacao, int versao) {
        this.id = id;
        this.dataCriacao = dataCriacao;
        this.versao = versao;
    }
    
    @Override
    public Long getId() { return id; }
    
    @Override
    public String getDataCriacao() { return dataCriacao; }
    
    @Override
    public int getVersao() { return versao; }
}

// ✅ Polimorfismo por qualquer nível
Entidade e = Documento.CONTRATO;
Auditavel a = Documento.CONTRATO;
Versionavel v = Documento.CONTRATO;
```

### 4. Lista de Interface Base

```java
interface Base {
    String getTipo();
}

interface TipoA extends Base { }
interface TipoB extends Base { }

public enum EnumA implements TipoA {
    A1;
    
    @Override
    public String getTipo() { return "TipoA"; }
}

public enum EnumB implements TipoB {
    B1;
    
    @Override
    public String getTipo() { return "TipoB"; }
}

// ✅ Lista polimórfica pela interface base
List<Base> lista = new ArrayList<>();
lista.add(EnumA.A1);
lista.add(EnumB.B1);

for (Base b : lista) {
    System.out.println(b.getTipo());
}
```

### 5. Método Aceita Interface Base

```java
interface Operacao {
    double executar(double a, double b);
}

interface OperacaoAritmetica extends Operacao { }
interface OperacaoLogica extends Operacao { }

public enum Aritmetica implements OperacaoAritmetica {
    SOMA {
        @Override
        public double executar(double a, double b) {
            return a + b;
        }
    }
}

public enum Logica implements OperacaoLogica {
    E {
        @Override
        public double executar(double a, double b) {
            return (a != 0 && b != 0) ? 1 : 0;
        }
    }
}

// ✅ Método aceita interface base
public double processar(Operacao op, double a, double b) {
    return op.executar(a, b);
}

// ✅ Aceita ambos os enums
double r1 = processar(Aritmetica.SOMA, 5, 3);
double r2 = processar(Logica.E, 1, 1);
```

### 6. Interface com Default em Hierarquia

```java
interface Base {
    String getId();
    
    default String getIdFormatado() {
        return "[" + getId() + "]";
    }
}

interface Extendida extends Base {
    String getNome();
    
    default String getInfo() {
        return getId() + ": " + getNome();
    }
}

// ✅ Enum herda defaults de ambos níveis
public enum Categoria implements Extendida {
    TECNOLOGIA("TEC", "Tecnologia");
    
    private final String id;
    private final String nome;
    
    Categoria(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }
    
    @Override
    public String getId() { return id; }
    
    @Override
    public String getNome() { return nome; }
}

String formatado = Categoria.TECNOLOGIA.getIdFormatado(); // "[TEC]"
String info = Categoria.TECNOLOGIA.getInfo();             // "TEC: Tecnologia"
```

### 7. Substituição de Liskov

```java
interface Animal {
    String emitirSom();
}

interface Mamifero extends Animal {
    boolean amamentar();
}

public enum TipoMamifero implements Mamifero {
    CACHORRO {
        @Override
        public String emitirSom() {
            return "Au au";
        }
        
        @Override
        public boolean amamentar() {
            return true;
        }
    }
}

// ✅ Substituição de Liskov: Mamifero é Animal
public void fazerBarulho(Animal a) {
    System.out.println(a.emitirSom());
}

// ✅ Aceita TipoMamifero (Mamifero extends Animal)
fazerBarulho(TipoMamifero.CACHORRO); // "Au au"
```

### 8. Interface Marcadora em Hierarquia

```java
// ✅ Interface marcadora (sem métodos)
interface Serializavel { }

interface Base {
    String getId();
}

// ✅ Interface derivada marca como serializável
interface SerializavelBase extends Base, Serializavel { }

public enum Documento implements SerializavelBase {
    CONTRATO("C001");
    
    private final String id;
    
    Documento(String id) {
        this.id = id;
    }
    
    @Override
    public String getId() {
        return id;
    }
}

// ✅ Verificar marcador
if (Documento.CONTRATO instanceof Serializavel) {
    System.out.println("É serializável");
}
```

### 9. Herança Múltipla de Interfaces

```java
interface Identificavel {
    String getId();
}

interface Nomeavel {
    String getNome();
}

// ✅ Interface composta
interface IdentificavelNomeavel extends Identificavel, Nomeavel { }

public enum Produto implements IdentificavelNomeavel {
    NOTEBOOK("NB001", "Notebook");
    
    private final String id;
    private final String nome;
    
    Produto(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }
    
    @Override
    public String getId() { return id; }
    
    @Override
    public String getNome() { return nome; }
}
```

### 10. Factory Method com Hierarquia

```java
interface Comando {
    void executar();
}

interface ComandoPersistencia extends Comando { }
interface ComandoNotificacao extends Comando { }

public enum Persistencia implements ComandoPersistencia {
    SALVAR {
        @Override
        public void executar() {
            System.out.println("Salvando...");
        }
    }
}

public enum Notificacao implements ComandoNotificacao {
    EMAIL {
        @Override
        public void executar() {
            System.out.println("Enviando email...");
        }
    }
}

// ✅ Factory retorna interface base
public Comando criarComando(String tipo) {
    return "persistencia".equals(tipo) 
        ? Persistencia.SALVAR 
        : Notificacao.EMAIL;
}

Comando cmd = criarComando("persistencia");
cmd.executar(); // "Salvando..."
```

---

## Aplicabilidade

**Hierarquia de tipos** para:
- Organizar enums relacionados
- Polimorfismo em múltiplos níveis
- Substituição de Liskov
- Segregação por camadas

---

## Armadilhas

### 1. Hierarquia Muito Profunda

```java
// ⚠️ Muitos níveis
interface A { }
interface B extends A { }
interface C extends B { }
interface D extends C { }
interface E extends D { }

public enum MyEnum implements E { }

// ✅ Preferir 2-3 níveis
interface Base { }
interface Derivada extends Base { }
public enum MyEnum implements Derivada { }
```

### 2. Confusão de Métodos

```java
interface I1 {
    String get();
}

interface I2 extends I1 {
    String get(); // ⚠️ Mesmo método
}

// ✅ Uma implementação serve para ambas
public enum E implements I2 {
    C;
    
    @Override
    public String get() {
        return "valor"; // implementa I1 e I2
    }
}
```

### 3. Cast Desnecessário

```java
interface Base { }
interface Derivada extends Base { }

public enum E implements Derivada { }

Base b = E.C;

// ⚠️ Cast desnecessário
Derivada d = (Derivada) b; // OK, mas desnecessário

// ✅ Usar diretamente
Derivada d = E.C;
```

---

## Boas Práticas

### 1. Hierarquia Rasa

```java
// ✅ 2-3 níveis
interface Base { }
interface Derivada extends Base { }
public enum E implements Derivada { }
```

### 2. Documentar Hierarquia

```java
// ✅ Javadoc
/**
 * Enum de tipos de processamento.
 * Implementa {@link ProcessadorFormatado} que estende {@link Processador}.
 */
public enum TipoProcessamento implements ProcessadorFormatado {
    // ...
}
```

### 3. Polimorfismo Apropriado

```java
// ✅ Usar nível apropriado da hierarquia
public void processar(Processador p) { } // aceita todos
public void processar(ProcessadorFormatado pf) { } // mais específico
```

### 4. Evitar Duplicação

```java
// ✅ Métodos comuns na interface base
interface Base {
    default String getInfo() {
        return "Base";
    }
}

interface Derivada extends Base { }

// ✅ Herda getInfo() automaticamente
public enum E implements Derivada { }
```

---

## Resumo

**Hierarquia de tipos**:

```java
// ✅ Hierarquia de interfaces
interface Base {
    String getId();
}

interface Nomeavel extends Base {
    String getNome();
}

// ✅ Enum implementa derivada (herda base)
public enum Categoria implements Nomeavel {
    TECNOLOGIA("TEC", "Tecnologia");
    
    @Override
    public String getId() { return id; }
    
    @Override
    public String getNome() { return nome; }
}

// ✅ Polimorfismo em ambos níveis
Base b = Categoria.TECNOLOGIA;
Nomeavel n = Categoria.TECNOLOGIA;
```

**Múltiplos níveis**:

```java
interface A { }
interface B extends A { }
interface C extends B { }

public enum E implements C {
    // ✅ É do tipo C, B e A
}

A a = E.CONSTANTE;
B b = E.CONSTANTE;
C c = E.CONSTANTE;
```

**Regra de Ouro**: Enum pode participar de **hierarquias de tipos** através de interfaces. Interface derivada **extends** base. Enum implementando derivada **herda** base. **Polimorfismo** em múltiplos níveis (enum pode ser tratado como qualquer interface da hierarquia). Preferir hierarquias **rasas** (2-3 níveis). **Documentar** hierarquia. Útil para **organizar** enums relacionados e **Substituição de Liskov**.
