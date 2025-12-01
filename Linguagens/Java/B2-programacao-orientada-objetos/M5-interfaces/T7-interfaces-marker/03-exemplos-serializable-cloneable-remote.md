# T7.03 - Exemplos: Serializable, Cloneable, Remote

## Introdução

**Markers clássicas**: Serializable, Cloneable, Remote (Java).

```java
import java.io.*;
import java.rmi.Remote;

// Serializable: serialização
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    private String nome;
}

// Cloneable: clonagem
public class Produto implements Cloneable {
    private String nome;
    
    @Override
    public Produto clone() {
        try {
            return (Produto) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}

// Remote: RMI (Remote Method Invocation)
public interface MinhaInterfaceRemota extends Remote {
    String executar() throws RemoteException;
}
```

**Três markers principais** da JDK.

---

## Fundamentos

### 1. Serializable - Básico

**Serializable**: converter objeto em bytes.

```java
import java.io.*;

public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String nome;
    private int idade;
    
    public Usuario(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // Getters
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
}

// Serialização
Usuario usuario = new Usuario("João", 30);

// Salvar em arquivo
try (ObjectOutputStream oos = new ObjectOutputStream(
        new FileOutputStream("usuario.ser"))) {
    oos.writeObject(usuario);
    System.out.println("Usuário serializado");
}

// Desserialização
try (ObjectInputStream ois = new ObjectInputStream(
        new FileInputStream("usuario.ser"))) {
    Usuario carregado = (Usuario) ois.readObject();
    System.out.println("Nome: " + carregado.getNome());
    System.out.println("Idade: " + carregado.getIdade());
}
```

### 2. Serializable - serialVersionUID

**serialVersionUID**: controle de versão.

```java
public class Usuario implements Serializable {
    // ✅ Sempre definir serialVersionUID
    private static final long serialVersionUID = 1L;
    
    private String nome;
    private int idade;
    
    // Se adicionar campo e mudar serialVersionUID:
    // private String email; // Novo campo
    // private static final long serialVersionUID = 2L; // Mudou
    
    // Desserialização de versão antiga: InvalidClassException
}
```

### 3. Serializable - transient

**transient**: campo não serializado.

```java
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String nome;
    private transient String senha; // NÃO serializado
    
    public Usuario(String nome, String senha) {
        this.nome = nome;
        this.senha = senha;
    }
}

// Serialização
Usuario u1 = new Usuario("João", "123456");
// Salvar...

// Desserialização
Usuario u2 = (Usuario) ois.readObject();
System.out.println(u2.getNome()); // João
System.out.println(u2.getSenha()); // null (transient)
```

### 4. Serializable - Herança

**Herança**: superclasse não serializável.

```java
// Superclasse NÃO serializável
public class Pessoa {
    private String nome;
    
    public Pessoa() { } // Construtor padrão necessário
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}

// Subclasse serializável
public class Usuario extends Pessoa implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private int idade;
    
    public int getIdade() { return idade; }
    public void setIdade(int idade) { this.idade = idade; }
}

// ⚠️ Campos de Pessoa não serializados
// (a menos que Pessoa tenha construtor padrão)
```

### 5. Cloneable - Básico

**Cloneable**: clonar objetos.

```java
public class Produto implements Cloneable {
    private String nome;
    private double preco;
    
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    @Override
    public Produto clone() {
        try {
            return (Produto) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError("Erro ao clonar", e);
        }
    }
    
    // Getters/Setters
}

// Uso
Produto original = new Produto("Notebook", 3000);
Produto copia = original.clone();

System.out.println(original == copia); // false
System.out.println(original.getNome().equals(copia.getNome())); // true
```

### 6. Cloneable - Shallow vs Deep Clone

**Shallow clone**: referências copiadas.
**Deep clone**: objetos copiados.

```java
public class Pedido implements Cloneable {
    private String numero;
    private List<Item> itens;
    
    public Pedido(String numero) {
        this.numero = numero;
        this.itens = new ArrayList<>();
    }
    
    // ⚠️ Shallow clone: itens compartilhados
    @Override
    public Pedido clone() {
        try {
            return (Pedido) super.clone();
            // itens NÃO clonado (mesma referência)
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
    
    // ✅ Deep clone: itens clonados
    public Pedido deepClone() {
        try {
            Pedido clone = (Pedido) super.clone();
            clone.itens = new ArrayList<>();
            for (Item item : this.itens) {
                clone.itens.add(item.clone());
            }
            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}
```

### 7. Cloneable - Sem Implementar

**CloneNotSupportedException**: sem Cloneable.

```java
// ❌ Sem Cloneable
public class Produto {
    private String nome;
    
    @Override
    public Produto clone() {
        try {
            return (Produto) super.clone();
        } catch (CloneNotSupportedException e) {
            // EXCEÇÃO: não implementa Cloneable
            throw new AssertionError(e);
        }
    }
}

// Uso
// Produto p = new Produto();
// p.clone(); // CloneNotSupportedException
```

### 8. Remote - RMI Básico

**Remote**: objetos remotos (RMI).

```java
import java.rmi.Remote;
import java.rmi.RemoteException;

// Interface remota
public interface Calculadora extends Remote {
    int somar(int a, int b) throws RemoteException;
    int subtrair(int a, int b) throws RemoteException;
}

// Implementação
import java.rmi.server.UnicastRemoteObject;

public class CalculadoraImpl extends UnicastRemoteObject 
                              implements Calculadora {
    
    public CalculadoraImpl() throws RemoteException {
        super();
    }
    
    @Override
    public int somar(int a, int b) throws RemoteException {
        return a + b;
    }
    
    @Override
    public int subtrair(int a, int b) throws RemoteException {
        return a - b;
    }
}

// Servidor
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class Servidor {
    public static void main(String[] args) {
        try {
            Calculadora calc = new CalculadoraImpl();
            Registry registry = LocateRegistry.createRegistry(1099);
            registry.bind("Calculadora", calc);
            System.out.println("Servidor RMI pronto");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

// Cliente
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class Cliente {
    public static void main(String[] args) {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", 1099);
            Calculadora calc = (Calculadora) registry.lookup("Calculadora");
            
            int soma = calc.somar(5, 3);
            System.out.println("5 + 3 = " + soma); // 8
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 9. Serializable em Rede

**Serializable**: enviar objetos pela rede.

```java
import java.io.*;
import java.net.*;

// Classe serializável
public class Mensagem implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String texto;
    private long timestamp;
    
    public Mensagem(String texto) {
        this.texto = texto;
        this.timestamp = System.currentTimeMillis();
    }
    
    // Getters
}

// Servidor
public class Servidor {
    public static void main(String[] args) throws Exception {
        ServerSocket serverSocket = new ServerSocket(8080);
        System.out.println("Servidor aguardando...");
        
        Socket socket = serverSocket.accept();
        ObjectInputStream in = new ObjectInputStream(
            socket.getInputStream());
        
        Mensagem msg = (Mensagem) in.readObject();
        System.out.println("Recebido: " + msg.getTexto());
        
        in.close();
        socket.close();
        serverSocket.close();
    }
}

// Cliente
public class Cliente {
    public static void main(String[] args) throws Exception {
        Socket socket = new Socket("localhost", 8080);
        ObjectOutputStream out = new ObjectOutputStream(
            socket.getOutputStream());
        
        Mensagem msg = new Mensagem("Olá, servidor!");
        out.writeObject(msg);
        
        out.close();
        socket.close();
    }
}
```

### 10. Serializable vs Externalizable

**Externalizable**: controle customizado de serialização.

```java
import java.io.*;

// Serializable: automático
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    private String nome;
    private int idade;
    
    // Serialização automática
}

// Externalizable: customizado
public class UsuarioCustom implements Externalizable {
    private String nome;
    private int idade;
    
    public UsuarioCustom() { } // Construtor padrão obrigatório
    
    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeUTF(nome);
        out.writeInt(idade);
    }
    
    @Override
    public void readExternal(ObjectInput in) throws IOException {
        nome = in.readUTF();
        idade = in.readInt();
    }
}
```

---

## Aplicabilidade

**Serializable**:
- Persistência em arquivos
- Envio pela rede (sockets, RMI)
- Cache distribuído
- Sessões web

**Cloneable**:
- Prototype pattern
- Cópia defensiva
- Snapshot de estado
- Undo/Redo

**Remote**:
- RMI (Remote Method Invocation)
- Objetos distribuídos
- Comunicação entre JVMs

---

## Armadilhas

### 1. Serializable sem serialVersionUID

```java
// ⚠️ Sem serialVersionUID (gerado automaticamente)
public class Usuario implements Serializable {
    private String nome;
}

// Problema: mudança na classe quebra compatibilidade

// ✅ Com serialVersionUID
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    private String nome;
}
```

### 2. Cloneable sem clone()

```java
// ❌ ERRO: Cloneable sem sobrescrever clone()
public class Produto implements Cloneable {
    private String nome;
    
    // Não sobrescreve clone()
}

// Produto p = new Produto();
// p.clone(); // ERRO: clone() protected em Object

// ✅ Sobrescrever clone()
public class Produto implements Cloneable {
    @Override
    public Produto clone() {
        try {
            return (Produto) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}
```

### 3. Shallow Clone com Mutáveis

```java
public class Pedido implements Cloneable {
    private List<Item> itens;
    
    @Override
    public Pedido clone() {
        try {
            return (Pedido) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}

// ⚠️ Problema: shallow clone
Pedido original = new Pedido();
original.getItens().add(new Item("A"));

Pedido copia = original.clone();
copia.getItens().add(new Item("B"));

// original.getItens() também tem "B" (mesma lista)
```

### 4. Serializable e Segurança

```java
// ⚠️ Serialização pode expor dados sensíveis
public class Usuario implements Serializable {
    private String nome;
    private String senha; // Sensível
}

// ✅ transient para dados sensíveis
public class Usuario implements Serializable {
    private String nome;
    private transient String senha; // NÃO serializado
}
```

### 5. Remote sem RemoteException

```java
// ❌ ERRO: métodos remotos devem lançar RemoteException
public interface MinhaInterface extends Remote {
    // String executar(); // ERRO
}

// ✅ Lançar RemoteException
public interface MinhaInterface extends Remote {
    String executar() throws RemoteException;
}
```

### 6. Herança e Serializable

```java
// Superclasse não serializável
public class Pessoa {
    private String nome;
    
    // ⚠️ Sem construtor padrão: problema
    public Pessoa(String nome) {
        this.nome = nome;
    }
}

public class Usuario extends Pessoa implements Serializable {
    private int idade;
    
    public Usuario(String nome, int idade) {
        super(nome);
        this.idade = idade;
    }
}

// Desserialização: erro (Pessoa sem construtor padrão)
```

### 7. Clone() e final

```java
public class Produto implements Cloneable {
    private final List<String> tags;
    
    public Produto() {
        this.tags = new ArrayList<>();
    }
    
    @Override
    public Produto clone() {
        try {
            Produto clone = (Produto) super.clone();
            // ❌ ERRO: tags é final (não pode reatribuir)
            // clone.tags = new ArrayList<>(this.tags);
            
            // ⚠️ tags compartilhado (shallow clone)
            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}
```

---

## Boas Práticas

### 1. Sempre serialVersionUID

```java
// ✅ Sempre definir
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    private String nome;
}
```

### 2. transient para Sensíveis

```java
// ✅ transient para dados sensíveis
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String nome;
    private transient String senha;
    private transient String token;
}
```

### 3. Deep Clone quando Necessário

```java
// ✅ Deep clone para objetos mutáveis
public class Pedido implements Cloneable {
    private List<Item> itens;
    
    @Override
    public Pedido clone() {
        try {
            Pedido clone = (Pedido) super.clone();
            clone.itens = new ArrayList<>();
            for (Item item : this.itens) {
                clone.itens.add(item.clone());
            }
            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}
```

### 4. writeObject/readObject para Customização

```java
// ✅ Customizar serialização
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String nome;
    private transient String senha;
    
    private void writeObject(ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();
        // Criptografar senha antes de salvar
        out.writeUTF(criptografar(senha));
    }
    
    private void readObject(ObjectInputStream in) 
            throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        // Descriptografar senha após carregar
        senha = descriptografar(in.readUTF());
    }
}
```

### 5. Considerar Alternativas

```java
// ⚠️ Serializable: binário, acoplado
public class Usuario implements Serializable {
    private String nome;
}

// ✅ JSON: texto, flexível
public class Usuario {
    private String nome;
}

// Serialização JSON (com Gson, Jackson, etc.)
Gson gson = new Gson();
String json = gson.toJson(usuario);
Usuario carregado = gson.fromJson(json, Usuario.class);
```

### 6. Clone() com Construtor

```java
// ✅ Construtor de cópia alternativa a clone()
public class Produto {
    private String nome;
    private double preco;
    
    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    // Construtor de cópia
    public Produto(Produto outro) {
        this.nome = outro.nome;
        this.preco = outro.preco;
    }
}

// Uso
Produto original = new Produto("Notebook", 3000);
Produto copia = new Produto(original);
```

### 7. Remote com Try-Catch

```java
// ✅ Tratar RemoteException
try {
    Calculadora calc = (Calculadora) registry.lookup("Calculadora");
    int resultado = calc.somar(5, 3);
    System.out.println("Resultado: " + resultado);
} catch (RemoteException e) {
    System.err.println("Erro remoto: " + e.getMessage());
} catch (NotBoundException e) {
    System.err.println("Serviço não encontrado");
}
```

### 8. Verificar Antes de Serializar

```java
// ✅ Verificar se é serializável
public void salvar(Object obj) {
    if (!(obj instanceof Serializable)) {
        throw new IllegalArgumentException(
            "Objeto não é serializável"
        );
    }
    
    // Serializar
}
```

### 9. Clone() Defensivo

```java
// ✅ Clone defensivo em getters
public class Pedido {
    private List<Item> itens;
    
    public List<Item> getItens() {
        // Clone defensivo
        return new ArrayList<>(itens);
    }
}
```

### 10. Documentar Markers

```java
/**
 * Representa um usuário do sistema.
 * 
 * <p>Esta classe é serializável para permitir persistência
 * e envio pela rede. O campo {@code senha} é transient
 * para segurança.
 * 
 * @serial include
 */
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String nome;
    
    /**
     * @serial exclude
     */
    private transient String senha;
}
```

---

## Resumo

**Serializable**: converter objeto em bytes.

```java
public class Usuario implements Serializable {
    private static final long serialVersionUID = 1L;
    private String nome;
}

// Serializar
ObjectOutputStream oos = new ObjectOutputStream(
    new FileOutputStream("usuario.ser"));
oos.writeObject(usuario);

// Desserializar
ObjectInputStream ois = new ObjectInputStream(
    new FileInputStream("usuario.ser"));
Usuario u = (Usuario) ois.readObject();
```

**Cloneable**: clonar objetos.

```java
public class Produto implements Cloneable {
    @Override
    public Produto clone() {
        try {
            return (Produto) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}

Produto copia = original.clone();
```

**Remote**: objetos remotos (RMI).

```java
public interface Calculadora extends Remote {
    int somar(int a, int b) throws RemoteException;
}
```

**serialVersionUID**: controle de versão.

```java
private static final long serialVersionUID = 1L;
```

**transient**: não serializar.

```java
private transient String senha;
```

**Shallow vs Deep clone**:

```java
// Shallow: referências copiadas
public Pedido clone() {
    return (Pedido) super.clone();
}

// Deep: objetos copiados
public Pedido deepClone() {
    Pedido clone = (Pedido) super.clone();
    clone.itens = new ArrayList<>(this.itens);
    return clone;
}
```

**Boas práticas**:
- Sempre serialVersionUID
- transient para sensíveis
- Deep clone quando necessário
- writeObject/readObject para customização
- Considerar alternativas (JSON)
- Clone() com construtor
- Remote com try-catch
- Verificar antes de serializar
- Clone defensivo
- Documentar markers

**Armadilhas**:
- ❌ Serializable sem serialVersionUID
- ❌ Cloneable sem clone()
- ❌ Shallow clone com mutáveis
- ❌ Serializable e segurança
- ❌ Remote sem RemoteException
- ❌ Herança e Serializable
- ❌ Clone() e final

**Regra de Ouro**: **Serializable**, **Cloneable**, **Remote** são as três principais **interfaces marker** da JDK. **Serializable** permite serialização (persistência, rede). Sempre defina **serialVersionUID**. Use **transient** para dados sensíveis. **Cloneable** permite clonagem. Sempre sobrescreva **clone()**. Considere **deep clone** para objetos mutáveis. **Remote** marca objetos remotos (RMI). Métodos remotos devem lançar **RemoteException**. Considere **alternativas modernas** (JSON para serialização, construtor de cópia para clonagem).
