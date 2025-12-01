# Declaração de Classe

## 🎯 Introdução e Definição

### Definição Conceitual

Uma **classe** em TypeScript é um template (modelo) para criar objetos que compartilham a mesma estrutura, comportamento e estado. É uma construção sintática que encapsula dados (propriedades) e operações sobre esses dados (métodos) em uma única unidade coesa. Conceitualmente, uma classe define o "tipo" de um objeto, especificando quais propriedades ele possui e quais ações pode realizar.

A declaração de classe estabelece um **contrato estrutural e comportamental**: define a interface pública que instâncias dessa classe apresentarão ao mundo externo, bem como os detalhes de implementação internos. É a materialização do conceito de **abstração** em programação orientada a objetos (POO), permitindo modelar entidades do mundo real ou conceitos abstratos como estruturas de dados.

### Contexto Histórico e Motivação

Classes têm raízes profundas na história da programação:

**Simula (1967):** Primeira linguagem a introduzir conceito de classes e objetos para simulação de eventos.

**Smalltalk (1970s):** Popularizou programação orientada a objetos pura, onde tudo é objeto e classes são centrais.

**C++, Java, C# (1980s-2000s):** Estabeleceram classes como fundamento de sistemas de grande escala.

**JavaScript/ECMAScript:** Originalmente baseado em prototypes (orientação a objetos diferente). **ES6 (2015)** introduziu syntax de classes como "syntactic sugar" sobre prototypes para familiaridade com desenvolvedores de outras linguagens.

**TypeScript:** Adotou classes desde o início (2012), adicionando **type safety** e features que só viriam ao JavaScript anos depois (modificadores de acesso, abstract classes). TypeScript compilava classes para patterns de prototype antes do ES6.

A motivação central era **organização e reutilização**: agrupar dados relacionados e comportamentos, criar abstrações reutilizáveis, e modelar hierarquias de conceitos através de herança.

### Problema Fundamental que Resolve

Classes resolvem problemas críticos de engenharia de software:

**1. Encapsulamento:** Agrupam dados e lógica relacionada, reduzindo acoplamento e aumentando coesão.

**2. Reutilização de Código:** Template pode ser instanciado múltiplas vezes, evitando duplicação.

**3. Modelagem de Domínio:** Representam entidades do negócio (Usuario, Produto, Pedido) de forma natural.

**4. Manutenibilidade:** Mudanças em uma classe propagam automaticamente para todas as instâncias.

**5. Hierarquias de Conceitos:** Através de herança, modelam relações "é-um" (Cachorro é-um Animal).

**6. Polimorfismo:** Objetos de classes diferentes podem ser tratados uniformemente através de interfaces comuns.

### Importância no Ecossistema

Classes são fundamentais em TypeScript porque:

- **Compatibilidade com JavaScript:** Mapeiam para classes ES6+, facilitando interoperabilidade
- **Type Safety:** TypeScript adiciona verificação estática sobre estrutura de classes
- **Angular Framework:** Baseado fortemente em classes para componentes e serviços
- **OOP Patterns:** Implementação de design patterns clássicos (Factory, Singleton, Observer)
- **Backend Development:** Node.js com TypeScript usa classes extensivamente para estruturação

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Template de Objeto:** Classe define estrutura que instâncias seguirão
2. **Encapsulamento:** Agrupa estado (propriedades) e comportamento (métodos)
3. **Abstração:** Representa conceitos complexos através de interfaces simplificadas
4. **Instanciação:** Classes são "moldes"; objetos são "produtos" do molde

### Pilares Fundamentais

- **Declaração:** `class NomeClasse { }` define nova classe
- **Propriedades:** Variáveis que armazenam estado do objeto
- **Métodos:** Funções que definem comportamento
- **Constructor:** Método especial para inicialização
- **This:** Referência ao objeto atual

### Visão Geral das Nuances

- **Classes vs Functions:** Classes têm syntax específica; functions podem simular classes em JS
- **Hoisting:** Classes não sofrem hoisting como funções
- **Modo Estrito:** Classes sempre executam em strict mode
- **Type vs Value:** Classes existem tanto em type space quanto value space

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila uma classe:

**1. Parsing:** Compilador analisa declaração da classe, identificando propriedades, métodos, constructor.

**2. Type Checking:** Verifica que tipos de propriedades são consistentes, métodos retornam tipos corretos, etc.

**3. Code Generation:** Transpila para JavaScript. Em ES6+, gera classe nativa. Em ES5, gera função constructor e prototype.

**4. Type Emission:** Gera arquivo `.d.ts` com tipos da classe para consumo por outros módulos.

**5. Runtime:** Em JavaScript gerado, classe é function (ES5) ou class (ES6+). TypeScript desaparece; apenas JS executa.

### Princípios e Conceitos Subjacentes

#### Programação Orientada a Objetos

Classes são pilares de POO, que se baseia em quatro princípios:

**1. Encapsulamento:** Ocultar detalhes internos, expor apenas interface necessária.

**2. Abstração:** Modelar conceitos essenciais ignorando detalhes irrelevantes.

**3. Herança:** Reutilizar comportamento através de hierarquias.

**4. Polimorfismo:** Objetos de tipos diferentes respondem à mesma interface.

Classes TypeScript suportam todos esses princípios com type safety adicional.

#### Tipos Nominais vs Estruturais

TypeScript usa **tipagem estrutural** para compatibilidade, mas classes introduzem elemento de **nominalidade**:

```typescript
class Pessoa {
  nome: string;
  constructor(nome: string) {
    this.nome = nome;
  }
}

class Animal {
  nome: string;
  constructor(nome: string) {
    this.nome = nome;
  }
}

// Estruturalmente compatíveis
const p: Pessoa = new Animal("Rex"); // OK em TypeScript!
```

Embora estruturalmente idênticas, conceitualmente são diferentes. TypeScript permite devido a structural typing.

#### Classes como Valores e Tipos

Classes têm **dupla natureza** em TypeScript:

```typescript
class Usuario {
  nome: string;
  constructor(nome: string) {
    this.nome = nome;
  }
}

// Como tipo (type space)
const usuario: Usuario = new Usuario("Ana");

// Como valor (value space)
const ClasseUsuario = Usuario;
const novoUsuario = new ClasseUsuario("João");
```

Classe é simultaneamente tipo (para anotações) e valor (para instanciação).

### Modelo Mental para Compreensão

Pense em uma classe como uma **planta arquitetônica** de uma casa:

- **Planta (Classe):** Define estrutura - quantos quartos, banheiros, layout
- **Casas Construídas (Instâncias):** Seguem a planta, mas são entidades físicas distintas
- **Modificar Planta:** Altera futuras construções, não casas já construídas
- **Personalização (Propriedades):** Cada casa pode ter cores, móveis diferentes

Classes definem o "como construir"; objetos são as construções reais.

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica de Declaração

```typescript
// Declaração mais simples
class Pessoa {
  // Corpo da classe vazio
}

// Com propriedades e métodos
class Usuario {
  nome: string; // Propriedade
  email: string;
  
  apresentar() { // Método
    return `${this.nome} - ${this.email}`;
  }
}

// Instanciação
const usuario = new Usuario();
usuario.nome = "Ana";
usuario.email = "ana@example.com";
console.log(usuario.apresentar()); // "Ana - ana@example.com"
```

**Análise conceitual:** Palavra-chave `class` seguida de nome (PascalCase por convenção). Corpo entre chaves contém membros da classe.

### Propriedades (Fields)

```typescript
class Produto {
  // Propriedades com tipos explícitos
  id: number;
  nome: string;
  preco: number;
  emEstoque: boolean;
  
  // Propriedade com valor inicial
  categoria: string = "Geral";
  
  // Propriedade opcional
  descricao?: string;
  
  // Propriedade readonly
  readonly codigo: string = "PROD-001";
}

const produto = new Produto();
produto.id = 1;
produto.nome = "Notebook";
// produto.codigo = "OUTRO"; // ❌ Erro: readonly
```

**Fundamento teórico:** Propriedades definem o **estado** do objeto. Cada instância tem seu próprio conjunto de valores para essas propriedades.

### Constructor Method

```typescript
class Livro {
  titulo: string;
  autor: string;
  ano: number;
  
  // Constructor: inicializa propriedades
  constructor(titulo: string, autor: string, ano: number) {
    this.titulo = titulo;
    this.autor = autor;
    this.ano = ano;
  }
}

// Instanciação requer argumentos do constructor
const livro = new Livro("1984", "George Orwell", 1949);
console.log(livro.titulo); // "1984"
```

**Conceito crucial:** Constructor é método especial chamado automaticamente quando objeto é criado com `new`. Estabelece estado inicial.

### Methods (Métodos)

```typescript
class Calculadora {
  // Método simples
  somar(a: number, b: number): number {
    return a + b;
  }
  
  // Método que acessa propriedades
  historico: number[] = [];
  
  somarComHistorico(a: number, b: number): number {
    const resultado = a + b;
    this.historico.push(resultado);
    return resultado;
  }
  
  // Método que chama outro método
  calcular(a: number, b: number): void {
    const resultado = this.somar(a, b);
    console.log(`Resultado: ${resultado}`);
  }
}

const calc = new Calculadora();
calc.somar(5, 3); // 8
calc.somarComHistorico(10, 20); // 30
console.log(calc.historico); // [30]
```

**Análise profunda:** Métodos definem **comportamento**. `this` dentro de métodos refere-se à instância atual, permitindo acessar propriedades e outros métodos.

### Palavra-chave this

```typescript
class Contador {
  valor: number = 0;
  
  incrementar() {
    this.valor++; // this refere-se à instância
    return this.valor;
  }
  
  decrementar() {
    this.valor--;
    return this.valor;
  }
  
  obterValor() {
    return this.valor; // Acessa propriedade via this
  }
}

const contador1 = new Contador();
const contador2 = new Contador();

contador1.incrementar(); // contador1.valor = 1
contador2.incrementar(); // contador2.valor = 1
contador2.incrementar(); // contador2.valor = 2

console.log(contador1.obterValor()); // 1
console.log(contador2.obterValor()); // 2
```

**Fundamento conceitual:** `this` é contexto dinâmico que aponta para o objeto receptor da chamada do método. Permite que múltiplas instâncias operem independentemente.

### Classes sem Constructor Explícito

```typescript
// Constructor implícito vazio
class Animal {
  nome: string = "";
  idade: number = 0;
}

// Equivalente a:
class AnimalExplicito {
  nome: string = "";
  idade: number = 0;
  
  constructor() {
    // Constructor vazio implícito
  }
}

const animal = new Animal();
console.log(animal.nome); // ""
console.log(animal.idade); // 0
```

**Conceito teórico:** Se constructor não é definido, TypeScript/JavaScript cria um vazio automaticamente. Propriedades recebem valores padrão ou `undefined`.

### Hoisting e Temporal Dead Zone

```typescript
// ❌ Erro: Cannot access 'MinhaClasse' before initialization
const obj = new MinhaClasse();

class MinhaClasse {
  valor: number = 10;
}

// ✅ Correto
class OutraClasse {
  valor: number = 10;
}

const obj2 = new OutraClasse();
```

**Análise teórica:** Diferentemente de funções declaradas, **classes não sofrem hoisting**. Estão na "temporal dead zone" até a linha de declaração.

### Classes como Expressões

```typescript
// Classe nomeada
class Usuario {
  nome: string = "";
}

// Classe como expressão (anônima)
const Produto = class {
  nome: string = "";
  preco: number = 0;
};

// Classe como expressão (nomeada)
const Servico = class ServicoInterno {
  executar() {
    console.log("Executando...");
  }
};

const prod = new Produto();
const serv = new Servico();
```

**Fundamento teórico:** Classes podem ser expressões, atribuídas a variáveis. Nome interno (ServicoInterno) é visível apenas dentro da classe.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Classes

**1. Modelagem de Entidades**
```typescript
class Cliente {
  id: number;
  nome: string;
  email: string;
  
  constructor(id: number, nome: string, email: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
  }
}
```

**Raciocínio:** Entidades de negócio com identidade e comportamento próprios.

**2. Encapsulamento de Estado e Lógica**
```typescript
class ValidadorEmail {
  private regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  validar(email: string): boolean {
    return this.regex.test(email);
  }
}
```

**Raciocínio:** Agrupar lógica relacionada com dados internos.

**3. Estruturas de Dados Customizadas**
```typescript
class Pilha<T> {
  private items: T[] = [];
  
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
}
```

**Raciocínio:** Implementar abstrações de dados com comportamento específico.

### Quando Evitar Classes

Em alguns casos, alternativas mais simples são melhores:

```typescript
// ❌ Overkill - classe para objeto simples
class Ponto {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// ✅ Melhor - tipo ou interface
type Ponto = { x: number; y: number };
const ponto: Ponto = { x: 10, y: 20 };
```

**Raciocínio:** Para dados puros sem comportamento, tipos/interfaces são mais leves.

## ⚠️ Limitações e Considerações Teóricas

### Overhead de Classes

Classes adicionam camada de abstração. Para objetos muito simples, podem ser excessivas:

```typescript
// Simples demais para classe
class Cor {
  r: number;
  g: number;
  b: number;
}

// Melhor como tipo
type Cor = { r: number; g: number; b: number };
```

### This Binding Issues

```typescript
class Botao {
  texto: string = "Clique";
  
  onClick() {
    console.log(this.texto);
  }
}

const btn = new Botao();
const handler = btn.onClick;
handler(); // ❌ undefined! this perdeu contexto
```

**Solução:** Arrow functions ou bind.

### Compatibilidade Estrutural

TypeScript permite compatibilidade estrutural entre classes, que pode ser inesperada:

```typescript
class A { x: number = 1; }
class B { x: number = 2; }

const a: A = new B(); // OK! Estruturalmente compatíveis
```

## 🔗 Interconexões Conceituais

**Relação com Interfaces:** Classes implementam interfaces, garantindo contratos.

**Relação com Herança:** Classes podem estender outras, reutilizando comportamento.

**Relação com Modificadores:** `public`, `private`, `protected` controlam acesso a membros.

**Relação com Generics:** Classes podem ser genéricas, operando sobre tipos parametrizados.

## 🚀 Evolução e Próximos Conceitos

Dominar declaração de classes prepara para:
- **Constructor Avançado:** Parâmetros com modificadores, inicialização complexa
- **Modificadores de Acesso:** Encapsulamento real com `private`/`protected`
- **Herança:** Estender classes para reutilização
- **Classes Abstratas:** Templates que forçam implementação em subclasses
