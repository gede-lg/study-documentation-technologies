# Herança Múltipla via Interfaces: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Herança múltipla via interfaces** permite que classe **implemente múltiplas interfaces** simultaneamente, adquirindo contratos de tipos diferentes sem herdar implementação. Conceitualmente, representa **polimorfismo multi-facetado**, onde classe pode ser tratada como múltiplos tipos ao mesmo tempo, contornando limitação de herança única de classes.

Na essência, interfaces materializam o princípio de **contratos sem implementação**, permitindo que classe declare capacidades múltiplas (`implements`) enquanto herda implementação de apenas uma classe base (`extends`), separando herança de tipo de herança de código.

## 📋 Fundamentos

### Sintaxe: Implements Múltiplas Interfaces

```typescript
interface Voador {
  voar(): void;
  altitude: number;
}

interface Nadador {
  nadar(): void;
  profundidade: number;
}

interface Corredor {
  correr(): void;
  velocidade: number;
}

// Classe implementa MÚLTIPLAS interfaces
class Pato implements Voador, Nadador, Corredor {
  altitude: number = 0;
  profundidade: number = 0;
  velocidade: number = 0;

  voar(): void {
    this.altitude = 100;
    console.log("Pato voando");
  }

  nadar(): void {
    this.profundidade = 2;
    console.log("Pato nadando");
  }

  correr(): void {
    this.velocidade = 5;
    console.log("Pato correndo");
  }
}

const pato = new Pato();

// Pato pode ser tratado como qualquer uma das interfaces
const voador: Voador = pato;
const nadador: Nadador = pato;
const corredor: Corredor = pato;

voador.voar();
nadador.nadar();
corredor.correr();
```

**Conceito-chave:** Classe **implementa** (fornece código para) múltiplos contratos sem herdar implementação.

### Extends + Implements

```typescript
class Animal {
  constructor(public nome: string) {}

  comer(): void {
    console.log(`${this.nome} está comendo`);
  }
}

interface Domesticavel {
  dono: string;
  brincar(): void;
}

interface Treinavel {
  treinar(comando: string): void;
  comandos: string[];
}

// Herda de UMA classe + implementa MÚLTIPLAS interfaces
class Cachorro extends Animal implements Domesticavel, Treinavel {
  dono: string;
  comandos: string[] = [];

  constructor(nome: string, dono: string) {
    super(nome); // Chama constructor da classe pai
    this.dono = dono;
  }

  brincar(): void {
    console.log(`${this.nome} está brincando`);
  }

  treinar(comando: string): void {
    this.comandos.push(comando);
    console.log(`${this.nome} aprendeu: ${comando}`);
  }
}

const dog = new Cachorro("Rex", "João");
dog.comer();      // ✅ Herdado de Animal
dog.brincar();    // ✅ Implementado de Domesticavel
dog.treinar("sentar"); // ✅ Implementado de Treinavel
```

**Padrão:** `class Classe extends ClassePai implements Interface1, Interface2, Interface3`

## 🔍 Análise Conceitual

### 1. Mixins Conceituais

```typescript
interface Logavel {
  log(mensagem: string): void;
}

interface Salvavel {
  salvar(): Promise<void>;
}

interface Validavel {
  validar(): boolean;
}

class Usuario implements Logavel, Salvavel, Validavel {
  constructor(
    public nome: string,
    public email: string
  ) {}

  log(mensagem: string): void {
    console.log(`[Usuario] ${mensagem}`);
  }

  async salvar(): Promise<void> {
    this.log("Salvando usuário");
    // Lógica de salvamento
  }

  validar(): boolean {
    return this.email.includes("@");
  }
}

// Função genérica que aceita qualquer coisa Salvavel
async function salvarEntidade(entidade: Salvavel): Promise<void> {
  await entidade.salvar();
}

// Função que aceita qualquer coisa Validavel E Logavel
function validarComLog(entidade: Validavel & Logavel): boolean {
  entidade.log("Iniciando validação");
  const valido = entidade.validar();
  entidade.log(valido ? "Válido" : "Inválido");
  return valido;
}

const usuario = new Usuario("Ana", "ana@example.com");
await salvarEntidade(usuario);
validarComLog(usuario);
```

### 2. Composição de Capacidades

```typescript
interface Renderizavel {
  render(): string;
}

interface Clicavel {
  onClick(event: MouseEvent): void;
}

interface Focavel {
  onFocus(): void;
  onBlur(): void;
}

class Botao implements Renderizavel, Clicavel, Focavel {
  constructor(private texto: string) {}

  render(): string {
    return `<button>${this.texto}</button>`;
  }

  onClick(event: MouseEvent): void {
    console.log("Botão clicado");
  }

  onFocus(): void {
    console.log("Botão focado");
  }

  onBlur(): void {
    console.log("Botão desfocado");
  }
}

class Input implements Renderizavel, Focavel {
  constructor(private tipo: string) {}

  render(): string {
    return `<input type="${this.tipo}">`;
  }

  onFocus(): void {
    console.log("Input focado");
  }

  onBlur(): void {
    console.log("Input desfocado");
  }
}

// Função que trabalha com componentes renderizáveis
function montarComponente(comp: Renderizavel): void {
  const html = comp.render();
  document.body.innerHTML += html;
}

// Função que trabalha com elementos focáveis
function configurarFoco(elem: Focavel): void {
  elem.onFocus();
  setTimeout(() => elem.onBlur(), 1000);
}
```

### 3. Herança de Interfaces

```typescript
interface Entidade {
  id: number;
  criadoEm: Date;
}

interface Nomeavel {
  nome: string;
}

// Interface pode herdar de múltiplas interfaces
interface Usuario extends Entidade, Nomeavel {
  email: string;
}

// Classe implementa interface que já herda de outras
class UsuarioImpl implements Usuario {
  id: number;
  criadoEm: Date;
  nome: string;
  email: string;

  constructor(nome: string, email: string) {
    this.id = Date.now();
    this.criadoEm = new Date();
    this.nome = nome;
    this.email = email;
  }
}
```

### 4. Segregação de Interface (ISP)

```typescript
// ❌ Interface "gorda" - viola ISP
interface Trabalhador {
  trabalhar(): void;
  comer(): void;
  dormir(): void;
  programar(): void;
}

// ✅ Interfaces segregadas
interface Trabalhavel {
  trabalhar(): void;
}

interface Alimentavel {
  comer(): void;
}

interface Descansavel {
  dormir(): void;
}

interface Programavel {
  programar(): void;
}

// Cada classe implementa apenas o que precisa
class Programador implements Trabalhavel, Alimentavel, Descansavel, Programavel {
  trabalhar(): void {
    console.log("Trabalhando");
  }

  comer(): void {
    console.log("Comendo");
  }

  dormir(): void {
    console.log("Dormindo");
  }

  programar(): void {
    console.log("Programando");
  }
}

class Robo implements Trabalhavel, Programavel {
  // Robô não come nem dorme
  trabalhar(): void {
    console.log("Robô trabalhando");
  }

  programar(): void {
    console.log("Robô programando");
  }
}
```

### 5. Tipo Intersection

```typescript
interface Persistivel {
  salvar(): void;
  deletar(): void;
}

interface Auditavel {
  criadoPor: string;
  modificadoPor: string;
  registrarAuditoria(): void;
}

// Tipo que combina múltiplas interfaces
type EntidadePersistivel = Persistivel & Auditavel;

class Documento implements EntidadePersistivel {
  criadoPor: string;
  modificadoPor: string;

  constructor(usuario: string) {
    this.criadoPor = usuario;
    this.modificadoPor = usuario;
  }

  salvar(): void {
    this.registrarAuditoria();
    console.log("Salvando documento");
  }

  deletar(): void {
    this.registrarAuditoria();
    console.log("Deletando documento");
  }

  registrarAuditoria(): void {
    console.log(`Ação por: ${this.modificadoPor}`);
  }
}

// Função que exige AMBAS capacidades
function processarEntidade(entidade: EntidadePersistivel): void {
  entidade.registrarAuditoria();
  entidade.salvar();
}
```

## 🎯 Aplicabilidade

### Plugin System

```typescript
interface Plugin {
  nome: string;
  versao: string;
  inicializar(): void;
}

interface Configuravel {
  configurar(opcoes: any): void;
}

interface Desligavel {
  desligar(): void;
}

class LoggerPlugin implements Plugin, Configuravel, Desligavel {
  nome = "Logger";
  versao = "1.0.0";
  private nivel: string = "info";

  inicializar(): void {
    console.log(`Plugin ${this.nome} inicializado`);
  }

  configurar(opcoes: { nivel: string }): void {
    this.nivel = opcoes.nivel;
  }

  desligar(): void {
    console.log("Logger desligado");
  }
}

class PluginManager {
  private plugins: Plugin[] = [];

  registrar(plugin: Plugin): void {
    this.plugins.push(plugin);

    if (this.ehConfiguravel(plugin)) {
      plugin.configurar({ nivel: "debug" });
    }

    plugin.inicializar();
  }

  private ehConfiguravel(plugin: Plugin): plugin is Plugin & Configuravel {
    return "configurar" in plugin;
  }
}
```

### Repository Pattern Multi-Datasource

```typescript
interface Leitura<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
}

interface Escrita<T> {
  save(item: T): Promise<T>;
  delete(id: number): Promise<void>;
}

interface Cacheable {
  limparCache(): void;
}

class UsuarioRepository implements Leitura<Usuario>, Escrita<Usuario>, Cacheable {
  private cache = new Map<number, Usuario>();

  async findById(id: number): Promise<Usuario | null> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }
    // Buscar do banco
    return null;
  }

  async findAll(): Promise<Usuario[]> {
    // Buscar do banco
    return [];
  }

  async save(usuario: Usuario): Promise<Usuario> {
    // Salvar no banco
    this.cache.set(usuario.id, usuario);
    return usuario;
  }

  async delete(id: number): Promise<void> {
    // Deletar do banco
    this.cache.delete(id);
  }

  limparCache(): void {
    this.cache.clear();
  }
}
```

### Event System

```typescript
interface EventEmitter {
  on(event: string, handler: Function): void;
  emit(event: string, data: any): void;
}

interface Observable<T> {
  subscribe(observer: (value: T) => void): void;
  unsubscribe(observer: (value: T) => void): void;
}

class DataStore<T> implements EventEmitter, Observable<T> {
  private listeners = new Map<string, Function[]>();
  private observers: ((value: T) => void)[] = [];
  private data: T[] = [];

  on(event: string, handler: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  emit(event: string, data: any): void {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(h => h(data));
  }

  subscribe(observer: (value: T) => void): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: (value: T) => void): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  adicionar(item: T): void {
    this.data.push(item);
    this.emit("item-adicionado", item);
    this.observers.forEach(obs => obs(item));
  }
}
```

## ⚠️ Considerações

### 1. Conflito de Nomes

```typescript
interface A {
  metodo(): string;
}

interface B {
  metodo(): number; // ❌ Assinatura diferente
}

// Erro: tipos incompatíveis para 'metodo'
// class C implements A, B {
//   metodo(): ??? // Não pode satisfazer ambos
// }

// Solução: renomear ou não implementar ambas
```

### 2. Implementação Obrigatória

```typescript
interface Completa {
  a: string;
  b: number;
  c(): void;
}

class Incompleta implements Completa {
  a: string = "";
  // ❌ Erro: falta 'b' e 'c()'
}
```

### 3. Interfaces vs. Mixins

```typescript
// Interface: apenas contrato
interface Logavel {
  log(msg: string): void;
}

// Cada classe deve implementar
class A implements Logavel {
  log(msg: string): void { /* implementação */ }
}

// Mixin: compartilha implementação (padrão avançado)
type Constructor<T = {}> = new (...args: any[]) => T;

function LogavelMixin<T extends Constructor>(Base: T) {
  return class extends Base {
    log(msg: string): void {
      console.log(`[LOG] ${msg}`);
    }
  };
}
```

## 📚 Conclusão

Herança múltipla via interfaces permite classe implementar múltiplos contratos sem herdar código, contornando limitação de herança única. É fundamental para composição de capacidades, segregação de interfaces, polimorfismo multi-facetado e design flexível. Classe pode `extends` uma classe base enquanto `implements` múltiplas interfaces, separando herança de implementação de herança de tipo.
