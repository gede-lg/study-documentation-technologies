# Super para Chamar Método da Classe Pai: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Super para métodos** permite que subclasse **chame implementação original** do método da classe pai dentro de método sobrescrito, combinando comportamento herdado com especialização. Conceitualmente, representa **extensão de comportamento**, onde subclasse adiciona funcionalidade sem descartar completamente lógica da classe base.

Na essência, `super.metodo()` materializa o princípio de **reuso cooperativo**, permitindo subclasse **construir sobre** comportamento pai ao invés de substituí-lo completamente, criando composição de funcionalidades em hierarquias.

## 📋 Fundamentos

### Sintaxe e Uso Básico

```typescript
class Animal {
  nome: string;

  constructor(nome: string) {
    this.nome = nome;
  }

  emitirSom(): string {
    return `${this.nome} faz um som`;
  }

  mover(): void {
    console.log(`${this.nome} está se movendo`);
  }
}

class Cachorro extends Animal {
  emitirSom(): string {
    // Chama implementação da classe pai
    const somBase = super.emitirSom();
    // Adiciona comportamento específico
    return `${somBase} - Au au!`;
  }

  mover(): void {
    // Primeiro executa lógica do pai
    super.mover();
    // Depois adiciona comportamento específico
    console.log("Abanando o rabo");
  }
}

const dog = new Cachorro("Rex");
console.log(dog.emitirSom());
// Output: "Rex faz um som - Au au!"

dog.mover();
// Output:
// Rex está se movendo
// Abanando o rabo
```

**Conceito-chave:** `super.metodo()` acessa versão do método **definida na classe pai**, não a versão sobrescrita.

### Super vs. This

```typescript
class Base {
  saudar(): string {
    return "Olá";
  }

  mensagem(): string {
    return this.saudar(); // Chama versão polimórfica (pode ser sobrescrita)
  }
}

class Derivada extends Base {
  saudar(): string {
    return "Oi!";
  }

  testar(): void {
    console.log(this.saudar());  // "Oi!" - versão sobrescrita
    console.log(super.saudar()); // "Olá" - versão da classe pai
    console.log(this.mensagem()); // "Oi!" - mensagem() chama this.saudar()
  }
}

const obj = new Derivada();
obj.testar();
```

**Diferença:** `this` usa dispatch dinâmico (polimorfismo), `super` acessa diretamente classe pai.

## 🔍 Análise Conceitual

### 1. Extensão de Funcionalidade

```typescript
class Logger {
  log(mensagem: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${mensagem}`);
  }
}

class FileLogger extends Logger {
  private arquivo: string = "app.log";

  log(mensagem: string): void {
    // Primeiro faz log no console (comportamento do pai)
    super.log(mensagem);

    // Depois adiciona log em arquivo
    this.gravarEmArquivo(mensagem);
  }

  private gravarEmArquivo(mensagem: string): void {
    console.log(`Gravando em ${this.arquivo}: ${mensagem}`);
  }
}

const logger = new FileLogger();
logger.log("Aplicação iniciada");
// Output:
// [2024-...] Aplicação iniciada
// Gravando em app.log: Aplicação iniciada
```

### 2. Validação em Cadeia

```typescript
class Validador {
  validar(valor: string): boolean {
    if (!valor || valor.trim() === "") {
      console.log("Erro: valor vazio");
      return false;
    }
    return true;
  }
}

class ValidadorEmail extends Validador {
  validar(email: string): boolean {
    // Primeiro executa validação básica do pai
    if (!super.validar(email)) {
      return false;
    }

    // Depois validação específica de email
    if (!email.includes("@")) {
      console.log("Erro: email inválido");
      return false;
    }

    return true;
  }
}

class ValidadorEmailCorporativo extends ValidadorEmail {
  validar(email: string): boolean {
    // Validação básica + validação de email (via super)
    if (!super.validar(email)) {
      return false;
    }

    // Validação adicional de domínio corporativo
    if (!email.endsWith("@empresa.com")) {
      console.log("Erro: deve ser email corporativo");
      return false;
    }

    return true;
  }
}

const validador = new ValidadorEmailCorporativo();
validador.validar("usuario@empresa.com"); // ✅ true
validador.validar("usuario@gmail.com");   // ❌ false
```

**Conceito:** Cada nível adiciona validação, construindo sobre validações anteriores.

### 3. Template Method com Super

```typescript
class DocumentProcessor {
  process(content: string): string {
    console.log("Iniciando processamento");
    const result = this.transform(content);
    console.log("Processamento concluído");
    return result;
  }

  protected transform(content: string): string {
    return content.trim();
  }
}

class MarkdownProcessor extends DocumentProcessor {
  protected transform(content: string): string {
    // Aplica transformação básica do pai
    const trimmed = super.transform(content);

    // Adiciona transformação específica
    return trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }
}

class AdvancedMarkdownProcessor extends MarkdownProcessor {
  protected transform(content: string): string {
    // Aplica transformações anteriores (trim + negrito)
    const withBold = super.transform(content);

    // Adiciona transformação de itálico
    return withBold.replace(/\*(.*?)\*/g, "<em>$1</em>");
  }
}
```

### 4. Inicialização Composta

```typescript
class Component {
  protected estado: any = {};

  inicializar(): void {
    console.log("Component: inicializando");
    this.estado.inicializado = true;
  }
}

class BotaoComponent extends Component {
  inicializar(): void {
    // Inicialização base
    super.inicializar();

    // Inicialização específica de botão
    console.log("BotaoComponent: configurando evento click");
    this.estado.onClick = () => console.log("Clicado!");
  }
}

class BotaoAnimadoComponent extends BotaoComponent {
  inicializar(): void {
    // Inicialização base + botão
    super.inicializar();

    // Adiciona animação
    console.log("BotaoAnimadoComponent: configurando animações");
    this.estado.animacao = "fade-in";
  }
}

const botao = new BotaoAnimadoComponent();
botao.inicializar();
// Output:
// Component: inicializando
// BotaoComponent: configurando evento click
// BotaoAnimadoComponent: configurando animações
```

### 5. Acesso a Protected via Super

```typescript
class Base {
  protected valor: number = 10;

  protected calcular(): number {
    return this.valor * 2;
  }

  public obterResultado(): number {
    return this.calcular();
  }
}

class Derivada extends Base {
  protected calcular(): number {
    // Usa cálculo do pai como base
    const resultadoPai = super.calcular();

    // Adiciona processamento adicional
    return resultadoPai + this.valor;
  }
}

const obj = new Derivada();
console.log(obj.obterResultado());
// calcular() de Derivada: (10 * 2) + 10 = 30
```

## 🎯 Aplicabilidade

### Middleware Chain

```typescript
abstract class Middleware {
  protected proximo: Middleware | null = null;

  setProximo(middleware: Middleware): Middleware {
    this.proximo = middleware;
    return middleware;
  }

  processar(request: any): any {
    if (this.proximo) {
      return this.proximo.processar(request);
    }
    return request;
  }
}

class AuthMiddleware extends Middleware {
  processar(request: any): any {
    console.log("Verificando autenticação");
    request.autenticado = true;

    // Passa para próximo middleware
    return super.processar(request);
  }
}

class LogMiddleware extends Middleware {
  processar(request: any): any {
    console.log(`Log: ${JSON.stringify(request)}`);

    // Passa para próximo middleware
    return super.processar(request);
  }
}

class ValidationMiddleware extends Middleware {
  processar(request: any): any {
    console.log("Validando request");

    if (!request.autenticado) {
      throw new Error("Não autenticado");
    }

    return super.processar(request);
  }
}
```

### Event Handling

```typescript
class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }
}

class LoggedEventEmitter extends EventEmitter {
  emit(event: string, data: any): void {
    console.log(`Emitindo evento: ${event}`);

    // Chama comportamento original
    super.emit(event, data);

    console.log(`Evento ${event} emitido`);
  }
}
```

### Repository Pattern

```typescript
class BaseRepository<T> {
  protected items: T[] = [];

  findAll(): T[] {
    return [...this.items];
  }

  save(item: T): void {
    this.items.push(item);
  }
}

class CachedRepository<T> extends BaseRepository<T> {
  private cache: Map<string, T[]> = new Map();

  findAll(): T[] {
    const cacheKey = "all";

    if (this.cache.has(cacheKey)) {
      console.log("Retornando do cache");
      return this.cache.get(cacheKey)!;
    }

    // Busca do repositório base
    const result = super.findAll();

    // Armazena em cache
    this.cache.set(cacheKey, result);

    return result;
  }

  save(item: T): void {
    // Salva usando lógica do pai
    super.save(item);

    // Invalida cache
    this.cache.clear();
  }
}
```

## ⚠️ Considerações

### 1. Super Só Funciona em Métodos de Instância

```typescript
class Base {
  static metodoStatico(): string {
    return "Base";
  }
}

class Derivada extends Base {
  static metodoStatico(): string {
    // ❌ Erro: 'super' keyword unexpected here
    // return super.metodoStatico();

    // ✅ Correto: acessar diretamente
    return Base.metodoStatico();
  }
}
```

### 2. Ordem de Chamada Importa

```typescript
class Logger {
  log(msg: string): void {
    console.log(`[LOG] ${msg}`);
  }
}

class TimestampLogger extends Logger {
  log(msg: string): void {
    const timestamp = new Date().toISOString();

    // Diferente resultado dependendo da ordem
    super.log(`${timestamp} - ${msg}`); // Timestamp antes
    // vs
    // super.log(msg);
    // console.log(`Timestamp: ${timestamp}`); // Timestamp depois
  }
}
```

### 3. Super em Getters/Setters

```typescript
class Base {
  private _valor: number = 0;

  get valor(): number {
    return this._valor;
  }

  set valor(v: number) {
    this._valor = v;
  }
}

class Derivada extends Base {
  set valor(v: number) {
    // Validação antes de chamar setter do pai
    if (v < 0) {
      throw new Error("Valor deve ser positivo");
    }

    super.valor = v; // Chama setter da classe pai
  }

  get valor(): number {
    // Pode transformar valor antes de retornar
    return super.valor * 2;
  }
}
```

## 📚 Conclusão

`super.metodo()` permite chamar implementação da classe pai dentro de método sobrescrito, combinando comportamento herdado com especialização. É essencial para extensão de funcionalidade, validação em cadeia, middleware patterns e qualquer cenário onde subclasse precisa **adicionar** ao invés de **substituir** comportamento do pai, promovendo reuso cooperativo em hierarquias de classes.
