# Herança de Interface

## 🎯 Introdução e Definição

### Definição Conceitual

**Herança de interface** (ou **interface extension**) é o mecanismo pelo qual uma interface pode estender outra(s) interface(s), herdando todas as properties e methods definidas nelas. Uma interface derivada (child/derived interface) herda todos os members da interface base (parent/base interface) e pode adicionar novos members ou sobrescrever types de members herdados com tipos mais específicos. Isso cria **hierarquia de contratos**, permitindo reutilização e especialização progressiva de especificações de tipos.

Conceitualmente, interface extension implementa **contract composition** (composição de contratos): interfaces podem ser construídas incrementalmente, combinando contratos existentes e adicionando requirements específicos. Diferente de herança de classes (que também herda implementação), herança de interfaces é puramente **estrutural** - apenas signatures são herdadas, sem código.

### Contexto Histórico e Motivação

A evolução de herança de interfaces:

**Simula 67 (1967):** Introduziu herança de classes, mas sem conceito formal de interfaces.

**Objective-C (1984):** Protocols podiam compor outros protocols via inheritance.

**Java (1995):** Interfaces podem **estender** outras interfaces com `extends`. Classe pode implementar múltiplas interfaces, mas interface só pode estender interfaces (não classes).

**C# (2000):** Seguiu modelo Java - interfaces estendem interfaces via `extends` (ou `:` syntax em C#).

**TypeScript (2012):** Interfaces podem estender múltiplas interfaces simultaneamente, combinando estruturas. Também podem estender classes (extrai shape pública).

**Go (2009):** Interfaces são implícitas - interface "herda" automaticamente se contém todos methods de outra.

A motivação era **incremental specification** e **contract reuse**: permitir que contratos complexos sejam construídos a partir de contratos simples, facilitando manutenção e evitando duplicação. Também permite **interface segregation** - dividir interfaces grandes em menores e combinar conforme necessário.

### Problema Fundamental que Resolve

Herança de interface resolve problemas críticos:

**1. Code Reuse:** Evitar duplicação de member declarations entre interfaces relacionadas.

**2. Incremental Contracts:** Construir contratos complexos a partir de simples (composição).

**3. Interface Segregation:** Dividir interfaces grandes em pequenas focadas, combinando-as quando necessário.

**4. Hierarchy:** Modelar hierarquias de conceitos (ex: `Animal` → `Mamifero` → `Cachorro`).

**5. Polymorphism:** Variáveis de tipo base podem referenciar implementações de tipos derivados.

**6. Multiple Inheritance:** Combinar múltiplas interfaces sem complexidade de herança múltipla de classes.

### Importância no Ecossistema

Herança de interface é fundamental porque:

- **API Design:** Criar famílias de interfaces relacionadas (ex: `Iterable`, `Collection`, `List`)
- **Framework Design:** Frameworks definem hierarquias de interfaces (ex: DOM: `Node` → `Element` → `HTMLElement`)
- **Type Composition:** Combinar capabilities via múltiplas interfaces
- **SOLID Principles:** Interface Segregation Principle - preferir muitas interfaces específicas a uma genérica
- **Code Organization:** Organizar contratos em hierarquias lógicas

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Extends Keyword:** Interface usa `extends` para herdar de outra(s)
2. **Member Inheritance:** Todos members da base são herdados
3. **Multiple Inheritance:** Interface pode estender múltiplas interfaces
4. **Additive:** Interface derivada adiciona members, não remove
5. **Type Compatibility:** Tipo derivado é compatível com tipo base

### Pilares Fundamentais

- **Syntax:** `interface Child extends Parent { }`
- **Multiple:** `interface Child extends P1, P2, P3 { }`
- **Member Addition:** Child pode adicionar novos members
- **Type Refinement:** Child pode refinar types (tornar mais específico)
- **Polymorphism:** Variável de tipo Parent pode referenciar Child

### Visão Geral das Nuances

- **Transitive:** Se B extends A e C extends B, C herda de A também
- **Diamond Problem:** Herdar mesmo member via múltiplas paths deve ter tipos compatíveis
- **Extending Classes:** Interface pode estender classe (extrai shape)
- **Declaration Merging:** Múltiplas declarations de mesma interface são merged

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila interface extension:

**1. Parsing:** Identifica `extends` clause na interface declaration.

**2. Base Resolution:** Resolve interfaces/classes base para obter suas structures.

**3. Member Collection:**
   - Copia todos members de todas as interfaces base
   - Adiciona members declarados na interface derivada
   - Verifica conflitos (mesmo member com tipos incompatíveis)

**4. Type Checking:**
   - Valida que refined types são compatíveis (subtype)
   - Garante que não há conflitos irreconciliáveis

**5. Type System:** Registra que tipo derivado é **subtype** de tipo base (compatível via assignment).

**6. Code Generation:** Interfaces desaparecem - apenas implementações permanecem.

### Princípios e Conceitos Subjacentes

#### Single Interface Extension

Interface pode estender uma interface base:

```typescript
interface Animal {
  nome: string;
  idade: number;
}

// Cachorro extends Animal
interface Cachorro extends Animal {
  raca: string;
  latir(): void;
}

const rex: Cachorro = {
  nome: "Rex",      // De Animal
  idade: 3,         // De Animal
  raca: "Labrador", // De Cachorro
  latir() {
    console.log("Au au!");
  }
};

// Polimorfismo - Cachorro é compatível com Animal
const animal: Animal = rex;
console.log(animal.nome); // "Rex"
console.log(animal.idade); // 3
```

**Fundamento conceitual:** `Cachorro` herda `nome` e `idade` de `Animal`, adiciona `raca` e `latir()`. Tipo derivado é **subtype** de base.

#### Multiple Interface Extension

Interface pode estender múltiplas interfaces:

```typescript
interface Identificavel {
  id: number;
}

interface Nomeavel {
  nome: string;
}

interface Timestampavel {
  criadoEm: Date;
  atualizadoEm: Date;
}

// Estende três interfaces
interface Entidade extends Identificavel, Nomeavel, Timestampavel {
  ativo: boolean;
}

const entidade: Entidade = {
  id: 1,                    // De Identificavel
  nome: "Produto",          // De Nomeavel
  criadoEm: new Date(),     // De Timestampavel
  atualizadoEm: new Date(), // De Timestampavel
  ativo: true               // De Entidade
};

// Compatível com todas as bases
const identificavel: Identificavel = entidade;
const nomeavel: Nomeavel = entidade;
const timestampavel: Timestampavel = entidade;
```

**Análise profunda:** `Entidade` combina três contratos. Implementação deve satisfazer **todos** eles.

#### Transitive Inheritance

Herança é transitiva - chain de extensões:

```typescript
interface A {
  a: string;
}

interface B extends A {
  b: number;
}

interface C extends B {
  c: boolean;
}

// C herda de B que herda de A
const obj: C = {
  a: "texto", // De A (via B)
  b: 123,     // De B
  c: true     // De C
};

// C é compatível com B e A
const b: B = obj;
const a: A = obj;
```

**Conceito crucial:** Se C extends B extends A, então C herda members de A e B. C é subtype de B e A.

### Modelo Mental para Compreensão

Pense em herança de interface como **herdando certificações profissionais**:

- **Interface Base:** Certificação básica (ex: "Piloto" - deve saber decolar, voar, pousar)
- **Interface Derivada:** Certificação avançada (ex: "Piloto Comercial" extends "Piloto" - adiciona "navegação instrumental", "multi-motores")
- **Inheritance:** Piloto Comercial automaticamente tem todas as skills de Piloto + skills extras
- **Polymorphism:** Vaga para "Piloto" aceita "Piloto Comercial" (tem todas requirements + mais)

Certificação avançada **builds upon** certificação básica, não substitui.

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```typescript
interface Forma {
  calcularArea(): number;
}

interface FormaColorida extends Forma {
  cor: string;
}

class Circulo implements FormaColorida {
  constructor(
    public raio: number,
    public cor: string
  ) {}
  
  calcularArea(): number {
    return Math.PI * this.raio ** 2;
  }
}

const circulo = new Circulo(5, "vermelho");
console.log(circulo.calcularArea()); // 78.54...
console.log(circulo.cor); // "vermelho"

// Compatibilidade
const forma: Forma = circulo; // ✅ OK
const formaColorida: FormaColorida = circulo; // ✅ OK
```

**Análise conceitual:** `FormaColorida` estende `Forma`, herdando `calcularArea()` e adicionando `cor`.

### Multiple Inheritance

```typescript
interface Serializavel {
  serializar(): string;
}

interface Validavel {
  validar(): boolean;
}

interface Persistivel {
  salvar(): Promise<void>;
}

// Combina três interfaces
interface Modelo extends Serializavel, Validavel, Persistivel {
  id: number;
}

class Usuario implements Modelo {
  constructor(public id: number, public nome: string) {}
  
  serializar(): string {
    return JSON.stringify({ id: this.id, nome: this.nome });
  }
  
  validar(): boolean {
    return this.id > 0 && this.nome.length > 0;
  }
  
  async salvar(): Promise<void> {
    console.log("Salvando...");
  }
}
```

**Fundamento teórico:** `Modelo` herda de três interfaces. Implementação deve fornecer todos os members de todas.

### Type Refinement

Interface derivada pode **refinar** (tornar mais específico) types da base:

```typescript
interface Veiculo {
  identificacao: string | number;
}

interface Carro extends Veiculo {
  identificacao: string; // Refinado: apenas string
  portas: number;
}

const carro: Carro = {
  identificacao: "ABC-1234", // Deve ser string
  portas: 4
};

// Compatibilidade: string é subtype de string | number
const veiculo: Veiculo = carro; // ✅ OK
```

**Análise profunda:** Type refinement permite que derivada seja mais específica que base, desde que permaneça compatível (subtype).

### Conflicting Members

Se múltiplas bases têm mesmo member, types devem ser compatíveis:

```typescript
interface A {
  valor: number;
}

interface B {
  valor: number;
}

// OK - ambos têm number
interface C extends A, B {
  // valor é herdado como number
}

// ❌ Conflito incompatível
interface D {
  valor: string;
}

// interface E extends A, D {} 
// Erro: Interface 'E' cannot simultaneously extend types 'A' and 'D'
```

**Conceito crucial:** Herança múltipla requer que members com mesmo nome tenham types compatíveis.

### Diamond Problem Resolution

```typescript
interface Base {
  valor: string | number;
}

interface Left extends Base {
  valor: string;
}

interface Right extends Base {
  valor: number;
}

// ❌ Conflito - valor não pode ser string E number
// interface Bottom extends Left, Right {}
// Erro: Types of property 'valor' are incompatible

// ✅ Solução: refinamento explícito
interface Bottom extends Left, Right {
  valor: string & number; // never - impossível satisfazer
}
```

**Análise teórica:** Diamond problem ocorre quando duas bases refinam mesmo member de forma incompatível.

### Extending Classes

Interfaces podem estender classes, extraindo shape pública:

```typescript
class Pessoa {
  constructor(
    public nome: string,
    private cpf: string
  ) {}
  
  apresentar(): void {
    console.log(`Olá, ${this.nome}`);
  }
}

// Interface extrai apenas members públicos
interface IPessoa extends Pessoa {
  // Herda: nome (public), apresentar() (public)
  // NÃO herda: cpf (private)
}

const obj: IPessoa = {
  nome: "Ana",
  apresentar() {
    console.log(`Olá, ${this.nome}`);
  }
  // cpf não é requerido
};
```

**Conceito avançado:** Extending class extrai apenas **public shape**, ignorando private/protected members.

### Hierarchies

Criar hierarquias complexas:

```typescript
interface Entidade {
  id: number;
}

interface EntidadeAuditavel extends Entidade {
  criadoEm: Date;
  atualizadoEm: Date;
}

interface Usuario extends EntidadeAuditavel {
  nome: string;
  email: string;
}

interface Administrador extends Usuario {
  permissoes: string[];
}

const admin: Administrador = {
  id: 1,                      // De Entidade
  criadoEm: new Date(),       // De EntidadeAuditavel
  atualizadoEm: new Date(),   // De EntidadeAuditavel
  nome: "Admin",              // De Usuario
  email: "admin@example.com", // De Usuario
  permissoes: ["all"]         // De Administrador
};

// Compatibilidade na hierarquia
const usuario: Usuario = admin;
const auditavel: EntidadeAuditavel = admin;
const entidade: Entidade = admin;
```

**Fundamento conceitual:** Hierarquias permitem modelar relações "is-a" e especialização progressiva.

### Optional Members Inheritance

```typescript
interface Config {
  host: string;
  porta?: number;
}

interface ConfigAvancada extends Config {
  timeout?: number;
  ssl?: boolean;
}

const config1: ConfigAvancada = {
  host: "localhost"
  // Todos opcionais omitidos
};

const config2: ConfigAvancada = {
  host: "api.com",
  porta: 443,      // Opcional herdado
  timeout: 5000,   // Opcional próprio
  ssl: true        // Opcional próprio
};
```

**Análise teórica:** Optional members são herdados como opcionais.

### Readonly Members Inheritance

```typescript
interface Base {
  readonly id: number;
}

interface Derivada extends Base {
  nome: string;
}

const obj: Derivada = {
  id: 1,
  nome: "Teste"
};

// obj.id = 2; // ❌ Erro: readonly
obj.nome = "Novo"; // ✅ OK
```

**Conceito crucial:** Readonly modifier é herdado.

### Generic Interface Extension

```typescript
interface Coleção<T> {
  items: T[];
  adicionar(item: T): void;
}

interface ColeçãoOrdenável<T> extends Coleção<T> {
  ordenar(comparador: (a: T, b: T) => number): void;
}

class ListaNumeros implements ColeçãoOrdenável<number> {
  items: number[] = [];
  
  adicionar(item: number): void {
    this.items.push(item);
  }
  
  ordenar(comparador: (a: number, b: number) => number): void {
    this.items.sort(comparador);
  }
}
```

**Análise profunda:** Interface genérica pode estender outra genérica, herdando type parameters.

### Extending with Type Constraints

```typescript
interface Identificavel {
  id: number;
}

interface Repositorio<T extends Identificavel> {
  buscarPorId(id: number): T | null;
}

interface RepositorioAvancado<T extends Identificavel> extends Repositorio<T> {
  buscarPorFiltro(filtro: Partial<T>): T[];
}

interface Usuario extends Identificavel {
  nome: string;
}

class UsuarioRepo implements RepositorioAvancado<Usuario> {
  private usuarios: Usuario[] = [];
  
  buscarPorId(id: number): Usuario | null {
    return this.usuarios.find(u => u.id === id) || null;
  }
  
  buscarPorFiltro(filtro: Partial<Usuario>): Usuario[] {
    return this.usuarios.filter(u => {
      return Object.keys(filtro).every(key => 
        u[key as keyof Usuario] === filtro[key as keyof Usuario]
      );
    });
  }
}
```

**Conceito avançado:** Constraints em type parameters são preservados na herança.

### Declaration Merging com Extends

```typescript
interface Animal {
  nome: string;
}

interface Cachorro extends Animal {
  raca: string;
}

// Merging - adiciona a Cachorro
interface Cachorro {
  idade: number;
}

// Cachorro agora tem: nome (herdado), raca, idade
const rex: Cachorro = {
  nome: "Rex",
  raca: "Labrador",
  idade: 3
};
```

**Fundamento teórico:** Declaration merging funciona com extends - members são combinados.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Interface Extension

**1. Specialization**
```typescript
interface Veiculo {}
interface Carro extends Veiculo {}
```

**Raciocínio:** Modelar relações "is-a" - Carro é um Veiculo específico.

**2. Incremental Contracts**
```typescript
interface Basico {}
interface Avancado extends Basico {}
```

**Raciocínio:** Construir contratos complexos a partir de simples.

**3. Multiple Capabilities**
```typescript
interface Serializavel {}
interface Validavel {}
interface Modelo extends Serializavel, Validavel {}
```

**Raciocínio:** Combinar múltiplas capabilities/roles.

**4. Interface Segregation**
```typescript
interface IReadable {}
interface IWriteable {}
interface IReadWrite extends IReadable, IWriteable {}
```

**Raciocínio:** Dividir interfaces grandes, combinar quando necessário.

## ⚠️ Limitações e Considerações Teóricas

### No Implementation Inheritance

Interface extension não herda código, apenas signatures:

```typescript
// Abstract class herda implementação
abstract class Base {
  metodo() { return 1; }
}

class Derivada extends Base {}
const d = new Derivada();
d.metodo(); // 1 - herdou implementação

// Interface não
interface IBase {
  metodo(): number;
}

interface IDerivada extends IBase {}

class Impl implements IDerivada {
  metodo(): number { return 1; } // Deve implementar
}
```

### Conflicting Members

Conflitos devem ser resolvidos:

```typescript
interface A { valor: number; }
interface B { valor: string; }
// interface C extends A, B {} // ❌ Erro
```

**Solução:** Evitar herança com conflitos ou usar intersection types.

## 🔗 Interconexões Conceituais

**Relação com Polymorphism:** Base pode referenciar derivadas.

**Relação com Subtyping:** Derivada é subtype de base.

**Relação com Composition:** Multiple extension = composition de contratos.

**Relação com SOLID:** Interface Segregation Principle.

## 🚀 Evolução e Próximos Conceitos

Dominar interface extension prepara para:
- **Intersection Types:** `A & B` vs `interface C extends A, B`
- **Conditional Types:** Types baseados em hierarquia
- **Mapped Types:** Transformar hierarquias de interfaces
- **Generic Constraints:** `T extends Interface`
