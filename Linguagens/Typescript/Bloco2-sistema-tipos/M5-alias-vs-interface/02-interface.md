# Interface: Contratos de Forma com `interface`

## 🎯 Introdução e Definição

Interface é **contrato de forma** que define **estrutura que objetos devem seguir**, declarada através da palavra-chave `interface`. Conceitualmente, representa **especificação de shape**: não define implementação, apenas **quais propriedades e métodos** um tipo deve ter para satisfazer contrato. Interfaces são fundação para **programação orientada a contratos**, duck typing estrutural, polimorfismo e abstração em TypeScript. Diferente de type aliases, interfaces são **extensíveis** (declaration merging) e **otimizadas** para descrever shapes de objetos e classes.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Palavra-chave `interface`:** Define contrato de forma
2. **Shapes de Objetos:** Especializada para estruturas de objetos
3. **Declaration Merging:** Declarações múltiplas fundem automaticamente
4. **`extends`:** Herança explícita de interfaces
5. **`implements`:** Classes implementam interfaces
6. **Open-Ended:** Extensível por natureza

**Conceito Central:** Interface = **contrato de shape** - especifica "o que" sem "como".

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Declaração:**
```typescript
interface NomeDaInterface {
  propriedade: Tipo;
  metodo(): TipoRetorno;
}
```

**Objeto Simples:**
```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

const usuario: Usuario = {
  id: 1,
  nome: "João",
  email: "joao@exemplo.com"
};
```

**Conceito:** Interface **descreve forma** que objetos devem ter.

### Propriedades Opcionais

**Sintaxe `?`:**
```typescript
interface Configuracao {
  url: string;
  timeout?: number;      // Opcional
  retryAttempts?: number; // Opcional
}

const config1: Configuracao = {
  url: "https://api.com"
  // timeout e retryAttempts opcionais
};

const config2: Configuracao = {
  url: "https://api.com",
  timeout: 5000
};
```

### Propriedades Readonly

**Sintaxe `readonly`:**
```typescript
interface Ponto {
  readonly x: number;
  readonly y: number;
}

const ponto: Ponto = { x: 10, y: 20 };

// ponto.x = 30;  // ERRO: Cannot assign to 'x' because it is a read-only property
```

**Conceito:** `readonly` previne reatribuição após inicialização.

### Métodos em Interfaces

**Duas Sintaxes:**
```typescript
interface Calculadora {
  // Sintaxe 1: Property function
  somar: (a: number, b: number) => number;

  // Sintaxe 2: Method signature (preferida)
  subtrair(a: number, b: number): number;
}

const calc: Calculadora = {
  somar: (a, b) => a + b,
  subtrair(a, b) { return a - b; }
};
```

### Index Signatures

**Propriedades Dinâmicas:**
```typescript
interface Dictionary {
  [key: string]: string;
}

const traducoes: Dictionary = {
  hello: "olá",
  goodbye: "tchau",
  thanks: "obrigado"
};

traducoes["welcome"] = "bem-vindo";  // OK
```

**Com Propriedades Conhecidas:**
```typescript
interface Config {
  url: string;
  timeout: number;
  [key: string]: any;  // Propriedades adicionais permitidas
}

const config: Config = {
  url: "https://api.com",
  timeout: 5000,
  retry: 3,        // OK - index signature
  cache: true      // OK
};
```

## 🔍 Declaration Merging

### Fusão Automática

**Conceito:** Declarações de interface com **mesmo nome fundem** automaticamente.

```typescript
interface Usuario {
  id: number;
  nome: string;
}

interface Usuario {
  email: string;
}

// Fusão automática:
// interface Usuario {
//   id: number;
//   nome: string;
//   email: string;
// }

const usuario: Usuario = {
  id: 1,
  nome: "João",
  email: "joao@exemplo.com"  // Todas as propriedades obrigatórias
};
```

**Uso Prático:** Estender definições de bibliotecas.

### Augmentation de Bibliotecas

**Estender Tipos Globais:**
```typescript
// Arquivo de definição próprio
interface Window {
  minhaAPI: {
    versao: string;
    metodo(): void;
  };
}

// Agora disponível globalmente
window.minhaAPI.versao;
window.minhaAPI.metodo();
```

**Estender Express:**
```typescript
// @types/express/index.d.ts (ou arquivo de augmentation)
declare namespace Express {
  interface Request {
    usuario?: {
      id: number;
      nome: string;
    };
  }
}

// Usar em handlers
app.get("/", (req, res) => {
  if (req.usuario) {
    console.log(req.usuario.nome);
  }
});
```

## 🔍 Extends: Herança de Interfaces

### Herança Simples

**Sintaxe:**
```typescript
interface Animal {
  nome: string;
  idade: number;
}

interface Cachorro extends Animal {
  raca: string;
  latir(): void;
}

const cachorro: Cachorro = {
  nome: "Rex",
  idade: 5,
  raca: "Labrador",
  latir() { console.log("Au au!"); }
};
```

**Conceito:** Interface filha **herda propriedades** da interface pai.

### Herança Múltipla

**Múltiplos `extends`:**
```typescript
interface Identificavel {
  id: number;
}

interface Timestampavel {
  criadoEm: Date;
  atualizadoEm: Date;
}

interface Nomeavel {
  nome: string;
}

interface Usuario extends Identificavel, Timestampavel, Nomeavel {
  email: string;
}

const usuario: Usuario = {
  id: 1,
  criadoEm: new Date(),
  atualizadoEm: new Date(),
  nome: "João",
  email: "joao@exemplo.com"
};
```

**Conceito:** Interface pode **herdar de múltiplas** interfaces simultaneamente.

### Override de Propriedades

**Refinamento de Tipo:**
```typescript
interface Base {
  id: string | number;
}

interface Derivada extends Base {
  id: number;  // Refina tipo (mais específico)
}

const obj: Derivada = {
  id: 123  // Deve ser number
};
```

**Conflito:**
```typescript
interface A {
  valor: string;
}

interface B {
  valor: number;
}

// ERRO: Interface 'C' incorretly extends interface 'A' and 'B'
// interface C extends A, B { }
```

## 🔍 Implements: Classes e Interfaces

### Classe Implementando Interface

**Sintaxe:**
```typescript
interface Forma {
  calcularArea(): number;
  calcularPerimetro(): number;
}

class Circulo implements Forma {
  constructor(public raio: number) {}

  calcularArea(): number {
    return Math.PI * this.raio ** 2;
  }

  calcularPerimetro(): number {
    return 2 * Math.PI * this.raio;
  }
}
```

**Conceito:** Classe **compromete-se** a implementar contrato da interface.

### Múltiplas Interfaces

```typescript
interface Loggable {
  log(mensagem: string): void;
}

interface Serializable {
  toJSON(): object;
}

class Usuario implements Loggable, Serializable {
  constructor(public nome: string, public email: string) {}

  log(mensagem: string): void {
    console.log(`[Usuario ${this.nome}]: ${mensagem}`);
  }

  toJSON(): object {
    return {
      nome: this.nome,
      email: this.email
    };
  }
}
```

## 🎯 Generics em Interfaces

### Interfaces Genéricas

**Sintaxe:**
```typescript
interface Container<T> {
  valor: T;
  obter(): T;
  definir(novoValor: T): void;
}

const numeroContainer: Container<number> = {
  valor: 42,
  obter() { return this.valor; },
  definir(novoValor) { this.valor = novoValor; }
};

const stringContainer: Container<string> = {
  valor: "olá",
  obter() { return this.valor; },
  definir(novoValor) { this.valor = novoValor; }
};
```

**Múltiplos Parâmetros:**
```typescript
interface Par<K, V> {
  chave: K;
  valor: V;
}

const idade: Par<string, number> = {
  chave: "idade",
  valor: 30
};
```

**Constraints:**
```typescript
interface Comparavel<T extends { comparar(outro: T): number }> {
  item: T;
  ehMaior(outro: T): boolean;
}
```

## 🎯 Aplicabilidade

### Quando Usar Interface

**1. Shapes de Objetos:**
```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}
```

**2. Contratos de Classe:**
```typescript
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
}

class UsuarioRepository implements Repository<Usuario> {
  // Implementação
}
```

**3. APIs Públicas:**
```typescript
interface API {
  get(url: string): Promise<any>;
  post(url: string, dados: any): Promise<any>;
}
```

**4. Extensões de Bibliotecas:**
```typescript
interface Window {
  minhaAPI: MinhaAPI;
}
```

**5. Polimorfismo:**
```typescript
interface Forma {
  calcularArea(): number;
}

class Circulo implements Forma { }
class Quadrado implements Forma { }

function processarForma(forma: Forma) {
  console.log(forma.calcularArea());
}
```

### Padrões Comuns

**Domain Models:**
```typescript
interface Entidade {
  id: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface Usuario extends Entidade {
  nome: string;
  email: string;
  perfil: Perfil;
}

interface Perfil {
  avatar?: string;
  bio?: string;
}
```

**Repository Pattern:**
```typescript
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, "id">): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}
```

**Service Contracts:**
```typescript
interface UsuarioService {
  autenticar(email: string, senha: string): Promise<Usuario>;
  registrar(dados: RegistroDTO): Promise<Usuario>;
  atualizar(id: number, dados: Partial<Usuario>): Promise<Usuario>;
}
```

## 🎯 Padrões Recomendados

### Nomenclatura

```typescript
// ✅ PascalCase
interface Usuario { }
interface ConfigAPI { }

// Sem prefixo "I" (convenção TypeScript moderna)
interface Usuario { }  // ✅

// Com prefixo "I" (estilo C#/Java - menos comum em TS)
interface IUsuario { }  // ⚠️ Aceitável mas menos idiomático
```

### Organização

```typescript
// interfaces/usuario.ts
export interface Usuario {
  id: number;
  nome: string;
}

export interface UsuarioComPermissoes extends Usuario {
  permissoes: string[];
}

// interfaces/api.ts
export interface ApiResponse<T> {
  dados: T;
  sucesso: boolean;
}
```

## ⚠️ Armadilhas Comuns

### 1. Declaration Merging Não Intencional

```typescript
// arquivo1.ts
interface Config {
  url: string;
}

// arquivo2.ts
interface Config {
  timeout: number;
}

// Fundem globalmente - pode ser não intencional
```

### 2. Extends vs. Intersection

```typescript
// ✅ Com extends (idiomático)
interface Usuario extends Base {
  nome: string;
}

// ✅ Com intersection (funciona)
type Usuario = Base & {
  nome: string;
};
```

### 3. Não Pode Descrever Unions

```typescript
// ❌ Interface não pode ser union
// interface StringOuNumber = string | number;  // ERRO

// ✅ Usar type alias
type StringOuNumber = string | number;
```

### 4. Implements Não Garante Tipo em Runtime

```typescript
interface Animal {
  nome: string;
}

class Cachorro implements Animal {
  nome = "Rex";
}

const cachorro = new Cachorro();

// ❌ ERRO: 'Animal' only refers to a type
// if (cachorro instanceof Animal) { }

// ✅ Verificar propriedades
if ("nome" in cachorro) { }
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Type Alias:** Alternativa para tipos gerais
- **Classes:** `implements` conecta classes e interfaces
- **Duck Typing:** Interface é contrato estrutural
- **Generics:** Interfaces podem ser genéricas
- **OOP:** Base para polimorfismo e abstração

**Progressão:**
Objetos simples → Interface → Extends → Implements → Polimorfismo

## 📚 Conclusão

**Interface** é ferramenta fundamental para **definir contratos de forma** em TypeScript. Especializada para shapes de objetos, suporta **declaration merging**, **herança múltipla** com `extends`, e **implementação** por classes com `implements`. Interfaces são pilares de **programação orientada a contratos** e polimorfismo estrutural.

**Conceitos Fundamentais:**
1. **`interface`:** Define contrato de shape
2. **Declaration Merging:** Fusão automática de declarações
3. **`extends`:** Herança de interfaces (múltipla permitida)
4. **`implements`:** Classes implementam contratos
5. **Propriedades Opcionais:** `?` para opcional
6. **Readonly:** `readonly` para imutabilidade

**Interface = contrato de forma + extensibilidade + polimorfismo.**
