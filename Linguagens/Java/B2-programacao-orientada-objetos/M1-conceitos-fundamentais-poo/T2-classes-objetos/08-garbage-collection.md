# Garbage Collection e Objetos sem Referência

## 🎯 Introdução e Definição

**Garbage Collection (GC)** é o **processo automático** de **gerenciamento de memória** em Java que **identifica** e **remove objetos não utilizados** (sem referências) da heap, liberando memória automaticamente. Diferente de linguagens como C/C++ que exigem desalocação manual (`free`/`delete`), Java **gerencia memória automaticamente**, reduzindo memory leaks e erros de ponteiros.

**Conceito central**: Objeto **sem referências alcançáveis** é **"lixo"** (garbage) elegível para **coleta automática**. GC **recupera memória** de objetos inacessíveis, permitindo **reutilização** para novos objetos. É como um **serviço de coleta de lixo** que remove objetos abandonados automaticamente.

**Analogia completa**:
- **Objeto**: Casa construída
- **Referência**: Chave da casa
- **Sem referências**: Casa sem chaves (ninguém pode entrar)
- **GC**: Demolição automática de casas abandonadas
- **Heap liberada**: Terreno disponível para nova construção

**Exemplo fundamental**:
```java
// Criar objeto com referência
Pessoa p1 = new Pessoa();  // Objeto ACESSÍVEL (tem referência p1)

// Remover referência
p1 = null;  // Objeto agora SEM referências

// Objeto está INALCANÇÁVEL → elegível para GC
// GC eventualmente remove objeto e libera memória

// MEMÓRIA ANTES:
// STACK:           HEAP:
// ┌──────────┐    ┌──────────────┐
// │ p1 (1a2b)│───→│ Pessoa@1a2b  │
// └──────────┘    │ nome: "João" │
//                 └──────────────┘

// MEMÓRIA DEPOIS (p1 = null):
// STACK:           HEAP:
// ┌──────────┐    ┌──────────────┐
// │ p1 = null│    │ Pessoa@1a2b  │ ← Sem referências (garbage)
// └──────────┘    │ nome: "João" │
//                 └──────────────┘

// APÓS GC:
// STACK:           HEAP:
// ┌──────────┐    
// │ p1 = null│    (memória liberada)
// └──────────┘    
```

**Reachability (alcançabilidade)**:
```java
// REACHABLE (alcançável) - tem referência
Carro carro = new Carro();  // ✓ Reachable via 'carro'

// UNREACHABLE (inalcançável) - sem referências
carro = null;  // Objeto anterior fica unreachable

// MÚLTIPLAS REFERÊNCIAS - reachable enquanto QUALQUER referência existir
Produto p1 = new Produto();
Produto p2 = p1;  // Mesmo objeto, 2 referências
Produto p3 = p1;  // 3 referências

p1 = null;  // Ainda reachable (p2 e p3 existem)
p2 = null;  // Ainda reachable (p3 existe)
p3 = null;  // AGORA unreachable → elegível para GC
```

**Ciclo de vida do objeto**:
```
1. CRIAÇÃO (new)
   ↓
2. REACHABLE (em uso - tem referências)
   ↓
3. UNREACHABLE (sem referências alcançáveis)
   ↓
4. ELIGIBLE FOR GC (elegível para coleta)
   ↓
5. COLLECTED (memória liberada pelo GC)
```

## 📋 Fundamentos Teóricos

### 1️⃣ O Que É Garbage Collection

**Definição**: GC é **subsistema da JVM** que **automaticamente** identifica e remove objetos mortos (unreachable) da memória heap.

**Objetivos**:
```
1. Liberar memória de objetos não utilizados
2. Prevenir OutOfMemoryError
3. Eliminar memory leaks automáticos
4. Simplificar gerenciamento de memória para desenvolvedor
```

**Funcionamento básico**:
```java
// Desenvolvedor cria objetos
Pessoa p1 = new Pessoa();  // Aloca memória
Pessoa p2 = new Pessoa();  // Aloca memória
Pessoa p3 = new Pessoa();  // Aloca memória

// Desenvolvedor remove referências
p1 = null;  // Objeto 1 fica elegível para GC
p2 = null;  // Objeto 2 fica elegível para GC

// GC (automaticamente, em background):
// - Identifica objetos sem referências
// - Remove objetos da heap
// - Libera memória para reutilização

// Desenvolvedor NÃO precisa chamar free/delete
```

**Diferença de C/C++**:
```java
// JAVA (gerenciamento automático):
Pessoa p = new Pessoa();
p = null;  // GC cuida da desalocação
// Sem free/delete - automático

// C++ (gerenciamento manual):
Pessoa* p = new Pessoa();
delete p;  // Desenvolvedor DEVE desalocar
// Esquecer delete = memory leak
```

### 2️⃣ Objetos Unreachable (Inalcançáveis)

**Conceito**: Objeto é **unreachable** quando **não existe caminho** de referências das **GC Roots** até ele.

**GC Roots** (pontos de partida para análise de alcançabilidade):
```
1. Variáveis locais em métodos ativos (stack frames)
2. Variáveis estáticas (static fields)
3. Threads ativos
4. Referências JNI (Java Native Interface)
```

**Cenários de unreachability**:

**1. Dereferenciamento direto**:
```java
Carro carro = new Carro();
carro = null;  // Objeto fica unreachable
```

**2. Reatribuição**:
```java
Produto p = new Produto();  // Objeto 1
p = new Produto();          // Objeto 1 fica unreachable, Objeto 2 atribuído
```

**3. Saída de escopo**:
```java
public void metodo() {
    Pessoa pessoa = new Pessoa();  // Objeto criado
    // Usa pessoa...
}  // Fim do método → variável 'pessoa' removida da stack
   // Objeto fica unreachable → elegível para GC
```

**4. Sobrescrita de array**:
```java
Livro[] livros = new Livro[3];
livros[0] = new Livro();  // Objeto 1
livros[1] = new Livro();  // Objeto 2
livros[2] = new Livro();  // Objeto 3

livros[0] = new Livro();  // Objeto 1 fica unreachable (sobrescrito)
```

**5. Remoção de coleção**:
```java
List<Produto> lista = new ArrayList<>();
Produto p = new Produto();
lista.add(p);

p = null;         // Referência p removida, mas objeto AINDA reachable via lista
lista.clear();    // Agora objeto fica unreachable
```

### 3️⃣ Reachability (Alcançabilidade)

**Conceito**: Objeto é **reachable** se existe **cadeia de referências** das GC Roots até ele.

**Exemplo de análise**:
```java
public class Exemplo {
    static Configuracao config;  // GC Root (static)
    
    public static void main(String[] args) {
        Pessoa p1 = new Pessoa();       // GC Root (local var)
        p1.endereco = new Endereco();   // Reachable via p1
        
        config = new Configuracao();    // Reachable via static
        
        Carro carro = new Carro();
        carro = null;  // Unreachable (sem caminho de GC Root)
    }
}

// ANÁLISE DE REACHABILITY:
// 
// GC ROOTS:
// - main.p1 (variável local)
// - Exemplo.config (static)
// 
// REACHABLE:
// - Pessoa@1a2b (via p1)
// - Endereco@3c4d (via p1.endereco)
// - Configuracao@5e6f (via config)
// 
// UNREACHABLE:
// - Carro@7g8h (nenhum caminho de GC Root)
```

**Cadeia de referências**:
```java
Pessoa pessoa = new Pessoa();
pessoa.endereco = new Endereco();
pessoa.endereco.cidade = new Cidade();

// CADEIA:
// GC_Root(pessoa) → Pessoa → Endereco → Cidade
//                   ↑        ↑          ↑
//              Reachable Reachable  Reachable

pessoa = null;
// CADEIA QUEBRADA:
// GC_Root(pessoa) = null
//                   
// Pessoa → Endereco → Cidade
//   ↑        ↑          ↑
// Unreachable (todos ficam inalcançáveis)
```

### 4️⃣ Algoritmo Mark-and-Sweep

**Conceito**: Algoritmo clássico de GC com **duas fases** - marcar reachable, varrer unreachable.

**FASE 1 - MARK (Marcar)**:
```
1. Pausar threads da aplicação (Stop-the-World)
2. Começar das GC Roots
3. Marcar objeto como "reachable"
4. Recursivamente marcar todos objetos referenciados
5. Objetos NÃO marcados são unreachable
```

**FASE 2 - SWEEP (Varrer)**:
```
1. Percorrer heap
2. Objetos NÃO marcados são removidos
3. Memória liberada para reutilização
4. Resumir threads da aplicação
```

**Visualização**:
```
HEAP ANTES DO GC:
┌────────────┬────────────┬────────────┬────────────┐
│ Pessoa@1a  │ Carro@2b   │ Livro@3c   │ Casa@4d    │
│ (reachable)│(unreachable)│(reachable) │(unreachable)│
└────────────┴────────────┴────────────┴────────────┘

FASE MARK:
┌────────────┬────────────┬────────────┬────────────┐
│ Pessoa@1a ✓│ Carro@2b   │ Livro@3c ✓ │ Casa@4d    │
│  MARCADO   │            │  MARCADO   │            │
└────────────┴────────────┴────────────┴────────────┘

FASE SWEEP (remove não marcados):
┌────────────┬────────────┬────────────┬────────────┐
│ Pessoa@1a ✓│  (liberado)│ Livro@3c ✓ │  (liberado)│
│            │            │            │            │
└────────────┴────────────┴────────────┴────────────┘

HEAP APÓS GC:
┌────────────┬────────────┐
│ Pessoa@1a  │ Livro@3c   │
└────────────┴────────────┘
(Memória compactada disponível para novos objetos)
```

### 5️⃣ Gerações de Objetos

**Conceito**: Heap dividida em **gerações** baseado na **idade dos objetos**.

**Hipótese geracional**:
```
"Maioria dos objetos morre jovem"
(objetos temporários criados e descartados rapidamente)
```

**Estrutura**:
```
HEAP:
┌────────────────────────────────────────────────────┐
│ YOUNG GENERATION (nova)                            │
│ ┌────────────┬─────────────┬─────────────┐        │
│ │   EDEN     │ SURVIVOR S0 │ SURVIVOR S1 │        │
│ └────────────┴─────────────┴─────────────┘        │
├────────────────────────────────────────────────────┤
│ OLD GENERATION (antiga/tenured)                    │
│ Objetos que sobreviveram múltiplos GCs             │
└────────────────────────────────────────────────────┘
│ METASPACE (Java 8+) / PERMGEN (Java 7-)           │
│ Classes, métodos, metadata                         │
└────────────────────────────────────────────────────┘
```

**Processo**:
```java
// 1. Objeto criado em EDEN
Pessoa p = new Pessoa();

// 2. Minor GC (Young Generation)
// Objetos vivos movidos para S0
// Objetos mortos removidos

// 3. Próximo Minor GC
// Objetos sobreviventes S0 → S1
// Novos sobreviventes EDEN → S1
// S0 esvaziado

// 4. Próximo Minor GC
// S1 → S0 (alterna)

// 5. Após N sobrevivências (threshold ~15)
// Objeto promovido para OLD GENERATION

// 6. Major GC (Full GC)
// Coleta OLD GENERATION (menos frequente, mais lento)
```

**Exemplo de aging**:
```java
public static void main(String[] args) {
    // Objeto temporário (morre rápido)
    String temp = new String("temporário");
    temp = null;  // Elegível na próxima Minor GC
    
    // Objeto de longa vida
    static List<Dados> cache = new ArrayList<>();
    cache.add(new Dados());  // Sobreviverá Minor GCs → OLD Generation
}
```

### 6️⃣ Tipos de GC

**Minor GC**:
```
- Coleta YOUNG GENERATION
- Rápido (objetos jovens, área pequena)
- Frequente
- Pausa curta (~milissegundos)
```

**Major GC / Full GC**:
```
- Coleta OLD GENERATION (e às vezes YOUNG)
- Lento (objetos antigos, área grande)
- Infrequente
- Pausa longa (~segundos)
- Pode causar "Stop-the-World" perceptível
```

**Exemplo**:
```java
// Criar MUITOS objetos temporários
for (int i = 0; i < 1_000_000; i++) {
    String temp = new String("temp" + i);
    // temp fica unreachable imediatamente
}
// Triggera múltiplos Minor GCs (rápidos)

// Criar objetos de longa vida
static List<byte[]> memoryHog = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    memoryHog.add(new byte[1024 * 1024]);  // 1MB cada
}
// Preenche OLD Generation
// Eventualmente triggera Major GC (lento)
```

### 7️⃣ Triggering GC (Disparar Coleta)

**Automático** (JVM decide):
```java
// GC dispara automaticamente quando:
// - EDEN está cheia → Minor GC
// - OLD Generation está cheia → Major GC
// - Memória heap está baixa
// - Heurísticas da JVM indicam necessidade

// Desenvolvedor NÃO controla timing exato
```

**Explícito** (sugestão, não garantia):
```java
// Solicitar GC (JVM pode ignorar)
System.gc();  // ou Runtime.getRuntime().gc();

// ⚠️ NÃO RECOMENDADO na maioria dos casos:
// - GC automático é eficiente
// - System.gc() pode causar pausas desnecessárias
// - JVM sabe melhor quando coletar

// Casos raros de uso:
// - Testes de memory leaks
// - Antes de medição de memória
// - Aplicações batch após processamento pesado
```

**OutOfMemoryError**:
```java
List<byte[]> lista = new ArrayList<>();
try {
    while (true) {
        lista.add(new byte[1024 * 1024]);  // Aloca 1MB
        // GC dispara múltiplas vezes tentando liberar memória
    }
} catch (OutOfMemoryError e) {
    // Heap esgotada - GC não conseguiu liberar suficiente
    System.err.println("Memória esgotada!");
}
```

### 8️⃣ Finalize (Deprecated)

**Conceito** (EVITAR): `finalize()` é método chamado **antes** do GC coletar objeto.

**Definição**:
```java
public class Recurso {
    @Override
    protected void finalize() throws Throwable {
        try {
            System.out.println("Objeto sendo coletado");
            // Limpeza de recursos
        } finally {
            super.finalize();
        }
    }
}

Recurso r = new Recurso();
r = null;  // Elegível para GC
// GC eventualmente chama finalize() antes de coletar
```

**Problemas** (por isso é deprecated):
```
1. Timing imprevisível (não sabe QUANDO GC executará)
2. Pode nunca executar (se JVM terminar antes de GC)
3. Performance ruim (finalização é lenta)
4. Complexidade (exceptions em finalize são problemáticas)
5. Resurrection (objeto pode reviver a si mesmo)
```

**Alternativa moderna**:
```java
// NÃO use finalize()
// USE try-with-resources + AutoCloseable

public class Conexao implements AutoCloseable {
    @Override
    public void close() {
        System.out.println("Fechando conexão");
        // Limpeza determinística
    }
}

// Uso:
try (Conexao conn = new Conexao()) {
    // Usar conexão
}  // close() chamado AUTOMATICAMENTE (determinístico)
```

### 9️⃣ Memory Leaks em Java

**Conceito**: Mesmo com GC, memory leaks ocorrem quando objetos **ficam reachable** sem intenção.

**Causa 1 - Coleções estáticas**:
```java
public class Cache {
    // ⚠️ PROBLEMA: Lista cresce indefinidamente
    private static List<Objeto> cache = new ArrayList<>();
    
    public static void adicionar(Objeto obj) {
        cache.add(obj);  // Nunca remove - LEAK
    }
}

// Objetos adicionados NUNCA são coletados (reachable via static)
```

**Causa 2 - Listeners não removidos**:
```java
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        // Handler
    }
});

// ⚠️ PROBLEMA: Listener mantém referência ao botão
// Se não remover, botão nunca é coletado
// SOLUÇÃO:
button.removeActionListener(listener);
```

**Causa 3 - Recursos não fechados**:
```java
// ⚠️ PROBLEMA:
FileInputStream fis = new FileInputStream("file.txt");
// Se esquecer de fechar, recurso não é liberado

// ✓ SOLUÇÃO:
try (FileInputStream fis = new FileInputStream("file.txt")) {
    // Usar fis
}  // Fecha automaticamente
```

**Causa 4 - ThreadLocal não limpo**:
```java
public class Servico {
    private static ThreadLocal<Contexto> contexto = new ThreadLocal<>();
    
    public void processar() {
        contexto.set(new Contexto());
        // ...
        // ⚠️ PROBLEMA: Não remove ao final
    }
    
    // ✓ SOLUÇÃO:
    public void processar() {
        try {
            contexto.set(new Contexto());
            // Processar
        } finally {
            contexto.remove();  // Limpa
        }
    }
}
```

### 🔟 Referências Fracas (Weak/Soft/Phantom)

**Strong Reference** (padrão):
```java
Objeto obj = new Objeto();  // Strong - GC NÃO coleta enquanto referência existir
```

**Weak Reference** (referência fraca):
```java
import java.lang.ref.WeakReference;

Objeto obj = new Objeto();
WeakReference<Objeto> fraca = new WeakReference<>(obj);

obj = null;  // Agora apenas referência fraca existe
// GC pode coletar MESMO com WeakReference

Objeto recuperado = fraca.get();  // Pode retornar null se GC coletou
if (recuperado != null) {
    // Objeto ainda existe
} else {
    // GC coletou
}

// USO: Caches que podem ser limpos quando memória baixa
```

**Soft Reference**:
```java
import java.lang.ref.SoftReference;

SoftReference<Objeto> suave = new SoftReference<>(new Objeto());

// GC coleta apenas quando REALMENTE precisa de memória
// Sobrevive mais que WeakReference

// USO: Caches sensíveis à memória
```

**Phantom Reference** (avançado):
```java
import java.lang.ref.PhantomReference;
import java.lang.ref.ReferenceQueue;

ReferenceQueue<Objeto> queue = new ReferenceQueue<>();
PhantomReference<Objeto> phantom = new PhantomReference<>(new Objeto(), queue);

// Objeto já foi coletado, mas permite ação de cleanup
// USO: Cleanup pós-finalização
```

## 🎯 Aplicabilidade

**1. Gerenciamento automático de memória**
**2. Prevenção de memory leaks simples**
**3. Otimização de uso de heap**
**4. Aplicações de longa duração**
**5. Sistemas com alta criação de objetos temporários**

## ⚠️ Armadilhas Comuns

**1. Confiar que finalize() será chamado**:
```java
finalize() { close(); }  // ⚠️ Pode nunca executar
```

**2. Chamar System.gc() frequentemente**:
```java
System.gc();  // ⚠️ Desnecessário, causa pausas
```

**3. Manter referências desnecessárias**:
```java
static List<Object> = new ArrayList<>();
// Cresce infinitamente - leak
```

**4. Não fechar recursos**:
```java
FileInputStream fis = new FileInputStream(file);
// ⚠️ Leak se não fechar
```

**5. Ignorar OutOfMemoryError**:
```java
catch (OutOfMemoryError e) { }  // ⚠️ Tratar adequadamente
```

## ✅ Boas Práticas

**1. Nullificar referências grandes**:
```java
grandeLista = null;  // Ajuda GC
```

**2. Usar try-with-resources**:
```java
try (Resource r = new Resource()) {
    // Fecha automaticamente
}
```

**3. Evitar coleções estáticas grandes**:
```java
// Use cache com limite
Map<K,V> cache = new LRUCache<>(1000);
```

**4. Remover listeners**:
```java
component.removeListener(listener);
```

**5. Monitorar memória**:
```java
Runtime runtime = Runtime.getRuntime();
long usado = runtime.totalMemory() - runtime.freeMemory();
```

## 📚 Resumo Executivo

**GC = limpeza automática**.

**Unreachable**:
```java
Objeto obj = new Objeto();
obj = null;  // Unreachable → GC coleta
```

**Reachability**:
```
GC Roots → cadeia → Objeto (reachable)
Sem cadeia → Unreachable
```

**Gerações**:
```
Young (nova) → Minor GC (rápido)
Old (antiga) → Major GC (lento)
```

**Trigger**:
```
Automático (JVM decide)
System.gc() (sugestão, evitar)
```

**Memory Leak**:
```java
static List<Object> cache;
cache.add(obj);  // Nunca remove - leak
```

**Referências**:
```
Strong (padrão) - nunca coleta
Weak - pode coletar
Soft - coleta se memória baixa
```

**Evitar**:
- finalize()
- System.gc() frequente
- Coleções estáticas sem limite

**Usar**:
- try-with-resources
- Nullificar grandes objetos
- Remover listeners

**Recomendação**: **Confie no GC automático**, **evite referências desnecessárias**, use **try-with-resources**, monitore **OutOfMemoryError**, prefira **weak/soft references** para caches.