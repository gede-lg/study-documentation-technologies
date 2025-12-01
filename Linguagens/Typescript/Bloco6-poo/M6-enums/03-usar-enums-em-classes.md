# Usar Enums em Classes

## 🎯 Introdução e Definição

### Definição Conceitual

**Usar enums em classes** significa empregar tipos enum como **tipos de propriedades**, **parâmetros de métodos**, **valores de retorno**, e **valores de inicialização** dentro de class definitions em TypeScript. Enums servem como **vocabulário controlado** para classes - definem conjunto restrito de valores válidos que propriedades/métodos podem aceitar ou retornar. Esta combinação une **encapsulamento** de classes com **type safety** de enums.

Conceitualmente, enums em classes implementam padrão **State Pattern** e **Strategy Pattern** - enums definem estados/estratégias possíveis, classes gerenciam comportamento baseado nesses estados. A relationship é simbiótica: classes dão comportamento a dados, enums restringem quais dados são válidos.

### Contexto Histórico e Motivação

A combinação de enums com classes:

**Linguagens OOP Clássicas (Java, C#):** Enums sempre foram usados em classes para modelar estados, tipos, categorias. TypeScript adotou este padrão.

**JavaScript Pré-TypeScript:** Usava **magic numbers** ou **magic strings**:
```javascript
class Usuario {
  constructor() {
    this.status = 1;  // O que significa 1?
  }
}
```

**TypeScript:** Enums resolvem isso:
```typescript
enum Status { Ativo, Inativo }

class Usuario {
  status: Status = Status.Ativo;  // Semântico e type-safe
}
```

**Motivação:**
- **Clareza:** Código auto-documentado
- **Type Safety:** Compilador valida valores
- **Refactoring:** Mudanças em enum atualizam todas classes
- **IntelliSense:** IDEs mostram valores possíveis

### Problema Fundamental que Resolve

Usar enums em classes resolve problemas específicos:

**1. Magic Values**
```typescript
// ❌ Sem enum - magic values
class Pedido {
  status: number = 0;  // 0 significa o quê?
}

// ✅ Com enum - semântico
enum StatusPedido { Pendente, Processando, Enviado }
class Pedido {
  status: StatusPedido = StatusPedido.Pendente;  // Claro!
}
```

**2. Invalid States**
```typescript
// ❌ Sem enum - aceita qualquer string
class Configuracao {
  tema: string = "claro";
}
const config = new Configuracao();
config.tema = "roxo";  // ❌ Valor inválido, mas aceito

// ✅ Com enum - apenas valores válidos
enum Tema { Claro, Escuro }
class Configuracao {
  tema: Tema = Tema.Claro;
}
const config = new Configuracao();
// config.tema = "roxo";  // ❌ Erro de compilação
```

**3. State Machines**
```typescript
enum Estado { Idle, Carregando, Sucesso, Erro }

class Requisicao {
  private estado: Estado = Estado.Idle;
  
  iniciar() {
    this.estado = Estado.Carregando;
  }
  
  concluir() {
    this.estado = Estado.Sucesso;
  }
}
```

**4. Type-Safe Comparisons**
```typescript
enum Permissao { Ler = 1, Escrever = 2, Executar = 4 }

class Usuario {
  permissoes: Permissao = Permissao.Ler;
  
  temPermissao(p: Permissao): boolean {
    return (this.permissoes & p) !== 0;  // Type-safe bitwise
  }
}
```

### Importância no Ecossistema

Enums em classes são importantes porque:

- **Domain Modeling:** Modelam conceitos de negócio (status, tipos, categorias)
- **State Management:** Implementam state machines de forma type-safe
- **API Design:** Classes com enums têm APIs claras e validadas
- **Refactoring Safety:** Mudanças em enums são detectadas em compile-time
- **Documentation:** Código auto-documentado sem comentários adicionais

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Enum como Tipo:** Propriedades/parâmetros têm tipo enum
2. **Enum como Valor:** Valores padrão e retornos são membros enum
3. **Encapsulation:** Enums definem vocabulário, classes definem comportamento
4. **Validation:** TypeScript valida que apenas valores enum são usados
5. **State Machines:** Enums modelam estados, classes gerenciam transições

### Pilares Fundamentais

- **Properties:** `private status: Status;`
- **Constructor:** `constructor(status: Status) { this.status = status; }`
- **Methods:** `getStatus(): Status { return this.status; }`
- **Setters:** `setStatus(s: Status) { this.status = s; }`
- **Comparison:** `if (this.status === Status.Ativo) { }`

### Visão Geral das Nuances

- **Access Modifiers:** Enums podem ser em propriedades private/protected/public
- **Static vs Instance:** Enums podem ser em membros static ou instance
- **Inheritance:** Subclasses herdam tipos enum de superclasses
- **Generic Classes:** Classes genéricas podem ter constraints com enums
- **Composition:** Classes podem ter múltiplas propriedades enum

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Class Property com Enum Type

```typescript
enum Status {
  Ativo = "ativo",
  Inativo = "inativo"
}

class Usuario {
  status: Status;  // Tipo da propriedade é Status enum
  
  constructor() {
    this.status = Status.Ativo;  // Inicialização com valor enum
  }
}

// JavaScript compilado (ES2015):
var Status;
(function (Status) {
  Status["Ativo"] = "ativo";
  Status["Inativo"] = "inativo";
})(Status || (Status = {}));

class Usuario {
  constructor() {
    this.status = Status.Ativo;  // Referência ao objeto Status em runtime
  }
}
```

**Análise profunda:**
1. **Enum Definition:** Enum é criado como objeto em runtime
2. **Class Definition:** Classe referencia enum object
3. **Type Checking:** TypeScript valida em compile-time que `status` só pode ser `Status.Ativo` ou `Status.Inativo`
4. **Runtime:** Em runtime, `status` é apenas string `"ativo"` ou `"inativo"`

**Fundamento conceitual:** Enums desaparecem como types em runtime, mas existem como objetos. Classes usam esses objetos.

### Princípios e Conceitos Subjacentes

#### Enum como Contract

```typescript
enum TipoPagamento {
  CartaoCredito,
  Boleto,
  Pix
}

class Pagamento {
  tipo: TipoPagamento;  // Contract: tipo DEVE ser um TipoPagamento
  
  constructor(tipo: TipoPagamento) {
    this.tipo = tipo;  // Contract enforcement
  }
}

const p = new Pagamento(TipoPagamento.Pix);  // ✅ OK
// const p2 = new Pagamento(99);  // ❌ Erro (em strict mode)
```

**Conceito crucial:** Enum funciona como **contract** - classe promete que propriedade terá apenas valores válidos.

#### State Machine Pattern

```typescript
enum EstadoConexao {
  Desconectado,
  Conectando,
  Conectado,
  Erro
}

class Conexao {
  private estado: EstadoConexao = EstadoConexao.Desconectado;
  
  conectar() {
    if (this.estado !== EstadoConexao.Desconectado) {
      throw new Error("Já conectado ou conectando");
    }
    this.estado = EstadoConexao.Conectando;
    // ... lógica de conexão
    this.estado = EstadoConexao.Conectado;
  }
  
  desconectar() {
    if (this.estado === EstadoConexao.Conectado) {
      this.estado = EstadoConexao.Desconectado;
    }
  }
  
  getEstado(): EstadoConexao {
    return this.estado;
  }
}
```

**Análise profunda:** Enum define **estados possíveis**, métodos implementam **transições válidas** entre estados.

### Modelo Mental para Compreensão

Pense em **enum como paleta de cores**, **classe como pintura**:

- **Enum:** Define cores disponíveis (vermelho, azul, verde)
- **Classe:** Usa apenas essas cores para pintar (propriedades)
- **Métodos:** Aplicam cores em diferentes partes da pintura

**Validação:** TypeScript garante que pintura só usa cores da paleta.

**Runtime:** Cores são valores concretos (strings/numbers), paleta é objeto lookup.

## 🔍 Análise Conceitual Profunda

### Enum Property - Basic

```typescript
enum Prioridade {
  Baixa = 1,
  Media = 5,
  Alta = 10
}

class Tarefa {
  prioridade: Prioridade;
  
  constructor(prioridade: Prioridade = Prioridade.Media) {
    this.prioridade = prioridade;
  }
}

const tarefa = new Tarefa(Prioridade.Alta);
console.log(tarefa.prioridade);  // 10
```

**Análise teórica:** Propriedade tem tipo enum, recebe valor enum no constructor.

### Enum Method Parameter

```typescript
enum Nivel {
  Debug,
  Info,
  Warn,
  Error
}

class Logger {
  private nivelMinimo: Nivel = Nivel.Info;
  
  log(nivel: Nivel, mensagem: string) {
    if (nivel >= this.nivelMinimo) {
      console.log(`[${Nivel[nivel]}] ${mensagem}`);
    }
  }
  
  setNivelMinimo(nivel: Nivel) {
    this.nivelMinimo = nivel;
  }
}

const logger = new Logger();
logger.log(Nivel.Error, "Erro crítico");  // ✅ Type-safe
// logger.log(99, "Teste");  // ❌ Erro
```

**Fundamento conceitual:** Métodos aceitam apenas valores enum válidos.

### Enum Return Type

```typescript
enum StatusPedido {
  Pendente,
  Processando,
  Enviado,
  Entregue
}

class Pedido {
  private status: StatusPedido = StatusPedido.Pendente;
  
  getStatus(): StatusPedido {
    return this.status;  // Retorna enum value
  }
  
  avancar(): StatusPedido {
    if (this.status < StatusPedido.Entregue) {
      this.status++;
    }
    return this.status;
  }
}

const pedido = new Pedido();
const status: StatusPedido = pedido.getStatus();  // Type-safe return
```

**Análise profunda:** Métodos retornam enum values, mantendo type safety na chain.

### Multiple Enum Properties

```typescript
enum Tamanho {
  P,
  M,
  G,
  GG
}

enum Cor {
  Branco = "branco",
  Preto = "preto",
  Azul = "azul"
}

class Produto {
  constructor(
    public tamanho: Tamanho,
    public cor: Cor
  ) {}
  
  descrever(): string {
    return `Tamanho: ${Tamanho[this.tamanho]}, Cor: ${this.cor}`;
  }
}

const camisa = new Produto(Tamanho.M, Cor.Azul);
console.log(camisa.descrever());  // "Tamanho: M, Cor: azul"
```

**Conceito avançado:** Classes podem ter múltiplas propriedades enum de tipos diferentes.

### Private Enum Property com Getter/Setter

```typescript
enum Tema {
  Claro = "light",
  Escuro = "dark"
}

class Configuracao {
  private _tema: Tema = Tema.Claro;
  
  get tema(): Tema {
    return this._tema;
  }
  
  set tema(valor: Tema) {
    this._tema = valor;
    this.aplicarTema(valor);
  }
  
  private aplicarTema(tema: Tema) {
    document.body.className = tema;
  }
}

const config = new Configuracao();
config.tema = Tema.Escuro;  // Setter executado, type-safe
```

**Análise profunda:** Getters/setters permitem validação e side effects com type safety de enum.

### Static Enum Property

```typescript
enum Ambiente {
  Desenvolvimento = "dev",
  Producao = "prod"
}

class AppConfig {
  static ambiente: Ambiente = Ambiente.Desenvolvimento;
  
  static isProducao(): boolean {
    return this.ambiente === Ambiente.Producao;
  }
}

console.log(AppConfig.ambiente);  // Ambiente.Desenvolvimento
AppConfig.ambiente = Ambiente.Producao;
console.log(AppConfig.isProducao());  // true
```

**Fundamento teórico:** Static members podem usar enums para configuração global.

### Enum com Herança de Classe

```typescript
enum TipoVeiculo {
  Carro,
  Moto,
  Caminhao
}

class Veiculo {
  constructor(public tipo: TipoVeiculo) {}
}

class Carro extends Veiculo {
  constructor() {
    super(TipoVeiculo.Carro);  // Passa enum para superclass
  }
}

const carro = new Carro();
console.log(carro.tipo);  // TipoVeiculo.Carro (0)
```

**Conceito avançado:** Subclasses herdam propriedades enum e podem passar valores específicos para super().

### Enum com Generic Class

```typescript
enum Status {
  Sucesso,
  Erro
}

class Resultado<T> {
  constructor(
    public status: Status,
    public valor?: T,
    public erro?: string
  ) {}
  
  isSucesso(): boolean {
    return this.status === Status.Sucesso;
  }
}

const resultado = new Resultado<number>(Status.Sucesso, 42);
if (resultado.isSucesso()) {
  console.log(resultado.valor);  // 42
}
```

**Análise profunda:** Classes genéricas podem usar enums para controle de estado independente do tipo genérico.

### Switch/Case com Enum em Method

```typescript
enum Operacao {
  Somar,
  Subtrair,
  Multiplicar,
  Dividir
}

class Calculadora {
  executar(op: Operacao, a: number, b: number): number {
    switch (op) {
      case Operacao.Somar:
        return a + b;
      case Operacao.Subtrair:
        return a - b;
      case Operacao.Multiplicar:
        return a * b;
      case Operacao.Dividir:
        return a / b;
      default:
        throw new Error("Operação inválida");
    }
  }
}

const calc = new Calculadora();
const resultado = calc.executar(Operacao.Somar, 5, 3);  // 8
```

**Fundamento conceitual:** Switch/case com enum é type-safe e exhaustive (TypeScript alerta se faltar case).

### Bitwise Flags com Enum

```typescript
enum Permissao {
  None = 0,
  Ler = 1 << 0,      // 1
  Escrever = 1 << 1, // 2
  Executar = 1 << 2  // 4
}

class Usuario {
  private permissoes: Permissao = Permissao.None;
  
  concederPermissao(p: Permissao) {
    this.permissoes |= p;  // Bitwise OR
  }
  
  revogarPermissao(p: Permissao) {
    this.permissoes &= ~p;  // Bitwise AND NOT
  }
  
  temPermissao(p: Permissao): boolean {
    return (this.permissoes & p) === p;
  }
}

const usuario = new Usuario();
usuario.concederPermissao(Permissao.Ler | Permissao.Escrever);
console.log(usuario.temPermissao(Permissao.Ler));  // true
console.log(usuario.temPermissao(Permissao.Executar));  // false
```

**Análise profunda:** Numeric enums com bit flags permitem múltiplas permissões compactas.

### Enum Validation em Setter

```typescript
enum Idade {
  Crianca = 0,
  Adolescente = 13,
  Adulto = 18,
  Idoso = 60
}

class Pessoa {
  private _faixaEtaria: Idade = Idade.Adulto;
  
  set faixaEtaria(valor: Idade) {
    if (!Object.values(Idade).includes(valor)) {
      throw new Error("Faixa etária inválida");
    }
    this._faixaEtaria = valor;
  }
  
  get faixaEtaria(): Idade {
    return this._faixaEtaria;
  }
}

const pessoa = new Pessoa();
pessoa.faixaEtaria = Idade.Idoso;  // ✅ OK
// pessoa.faixaEtaria = 999 as Idade;  // ❌ Runtime error
```

**Conceito avançado:** Runtime validation em setters protege contra type assertions incorretas.

### Factory Method com Enum

```typescript
enum TipoNotificacao {
  Email,
  SMS,
  Push
}

abstract class Notificacao {
  abstract enviar(mensagem: string): void;
}

class EmailNotificacao extends Notificacao {
  enviar(mensagem: string) {
    console.log(`Email: ${mensagem}`);
  }
}

class SMSNotificacao extends Notificacao {
  enviar(mensagem: string) {
    console.log(`SMS: ${mensagem}`);
  }
}

class NotificacaoFactory {
  static criar(tipo: TipoNotificacao): Notificacao {
    switch (tipo) {
      case TipoNotificacao.Email:
        return new EmailNotificacao();
      case TipoNotificacao.SMS:
        return new SMSNotificacao();
      default:
        throw new Error("Tipo não suportado");
    }
  }
}

const notif = NotificacaoFactory.criar(TipoNotificacao.Email);
notif.enviar("Olá!");  // "Email: Olá!"
```

**Fundamento teórico:** Factory pattern usa enum para selecionar tipo de classe a instanciar.

### Enum em Abstract Class

```typescript
enum TipoArquivo {
  Texto,
  Imagem,
  Video
}

abstract class Arquivo {
  constructor(public tipo: TipoArquivo) {}
  
  abstract processar(): void;
  
  descrever(): string {
    return `Arquivo do tipo ${TipoArquivo[this.tipo]}`;
  }
}

class ArquivoTexto extends Arquivo {
  constructor() {
    super(TipoArquivo.Texto);
  }
  
  processar() {
    console.log("Processando texto...");
  }
}

const arquivo = new ArquivoTexto();
console.log(arquivo.descrever());  // "Arquivo do tipo Texto"
```

**Análise profunda:** Abstract classes podem definir propriedades enum que subclasses concretizam.

## 🎯 Aplicabilidade e Contextos

### State Management

```typescript
enum EstadoRequisicao {
  Idle,
  Carregando,
  Sucesso,
  Erro
}

class ApiClient {
  private estado: EstadoRequisicao = EstadoRequisicao.Idle;
  
  async buscar(url: string) {
    this.estado = EstadoRequisicao.Carregando;
    try {
      const response = await fetch(url);
      this.estado = EstadoRequisicao.Sucesso;
      return response;
    } catch (erro) {
      this.estado = EstadoRequisicao.Erro;
      throw erro;
    }
  }
  
  getEstado(): EstadoRequisicao {
    return this.estado;
  }
}
```

**Raciocínio:** Enum modela estados de requisição; classe gerencia transições.

### Domain Models

```typescript
enum StatusPedido {
  Pendente = "pendente",
  Aprovado = "aprovado",
  Enviado = "enviado",
  Entregue = "entregue"
}

class Pedido {
  constructor(
    public id: number,
    public status: StatusPedido = StatusPedido.Pendente
  ) {}
  
  podeSerCancelado(): boolean {
    return this.status === StatusPedido.Pendente || 
           this.status === StatusPedido.Aprovado;
  }
}
```

**Raciocínio:** Domain objects usam enums para estados de negócio.

### Configuration Classes

```typescript
enum LogLevel {
  Debug,
  Info,
  Warn,
  Error
}

class AppConfig {
  constructor(
    public logLevel: LogLevel = LogLevel.Info,
    public isDev: boolean = false
  ) {}
}

const config = new AppConfig(LogLevel.Debug, true);
```

**Raciocínio:** Configurações type-safe com enums.

## ⚠️ Limitações e Considerações Teóricas

### Numeric Enum Type Safety

```typescript
enum Status {
  Ativo,
  Inativo
}

class Usuario {
  status: Status;
  
  constructor() {
    this.status = 999 as Status;  // ⚠️ TypeScript permite com `as`
  }
}
```

**Limitação:** Type assertions podem quebrar segurança. Preferir string enums ou validação runtime.

### Serialization Issues

```typescript
enum Cor {
  Vermelho,
  Verde
}

class Produto {
  constructor(public cor: Cor) {}
}

const produto = new Produto(Cor.Vermelho);
const json = JSON.stringify(produto);  // '{"cor":0}' - número, não nome
```

**Limitação:** Numeric enums serializam como números. Usar string enums para JSON legível.

## 🔗 Interconexões Conceituais

**Relação com State Pattern:** Enums definem estados, classes implementam pattern.

**Relação com Strategy Pattern:** Enum seleciona estratégia, classe executa.

**Relação com Factory Pattern:** Enum determina qual classe instanciar.

**Relação com Type Guards:** Validar enums em runtime para segurança.

## 🚀 Evolução e Próximos Conceitos

Dominar enums em classes prepara para:
- **Design Patterns:** State, Strategy, Factory com type safety
- **Advanced OOP:** Composition, inheritance com enums
- **Domain-Driven Design:** Modelar conceitos de negócio
- **Type-Safe APIs:** Construir APIs públicas robustas
