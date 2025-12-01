# TypeScript Curriculum - Grade Curricular Completa

## Bloco 1: Fundamentos e Sintaxe Básica

### Módulo 1: Configuração do Ambiente

#### Tópicos:
- Instalação do Node.js
- Instalação do TypeScript (`npm install -g typescript`)
- Configuração do compilador TypeScript (`tsc`)
- Configuração de `tsconfig.json`
- Setup do Editor (VSCode com extensões)
- Como compilar e executar TypeScript
- "Olá, Mundo!" em TypeScript
- TypeScript Playground online

### Módulo 2: Sintaxe Fundamental

#### Tópicos:
- Estrutura básica de um arquivo `.ts`
- Bloco de código com chaves `{}`
- Indentação e estilo de código
- Ponto-e-vírgula (obrigatório em certos contextos)
- Case sensitivity (maiúsculas/minúsculas importam)
- Diferenças entre TypeScript e JavaScript

### Módulo 3: Comentários

#### Tópicos:
- Comentários de uma linha (`//`)
- Comentários de múltiplas linhas (`/* */`)
- Documentação JSDoc (`/** */`)
- Anotações de tipo em comentários
- Comentários no código para explicar lógica

### Módulo 4: Variáveis e Constantes

#### Tópicos:
- Declaração com `let` (escopo de bloco)
- Declaração com `const` (imutável)
- Declaração com `var` (escopo de função - evitar)
- Anotação de tipo explícita
- Type inference (inferência automática)
- Reatribuição vs. Redeclaração
- Boas práticas de nomenclatura

### Módulo 5: Tipos de Dados Primitivos

#### Tópicos:
- `number` (inteiros e decimais, Infinity, NaN)
- `string` (texto, template literals com backticks)
- `boolean` (true/false)
- `null` (ausência intencional de valor)
- `undefined` (não inicializado)
- `symbol` (identificadores únicos)
- `bigint` (números inteiros muito grandes)
- Type annotations para primitivos

### Módulo 6: Operadores

#### Tópicos:
- Operadores aritméticos: `+`, `-`, `*`, `/`, `%`, `**`
- Operadores de comparação: `==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=`
- Operadores lógicos: `&&`, `||`, `!`
- Operadores de atribuição: `=`, `+=`, `-=`, `*=`, `/=`, `%=`
- Operadores de incremento/decremento: `++`, `--`
- Operador ternário: `condição ? valor1 : valor2`
- Operador nullish coalescing: `??`
- Operador optional chaining: `?.`

### Módulo 7: Conversão de Tipos (Type Casting)

#### Tópicos:
- Conversão explícita com `as`
- Conversão com funções: `Number()`, `String()`, `Boolean()`
- Type narrowing (redução de tipo)
- Coerção implícita vs. explícita
- Segurança de tipo e conversões

---

## Bloco 2: Sistema de Tipos TypeScript

### Módulo 8: Type Annotations Básicas

#### Tópicos:
- Anotação de tipo de variáveis
- Anotação de tipo de parâmetros
- Anotação de tipo de retorno
- Tipos explícitos vs. inferência
- Quando anotar tipos (melhores práticas)

### Módulo 9: Tipos Literais

#### Tópicos:
- String literals (`"hello"` como tipo)
- Number literals (`42` como tipo)
- Boolean literals (`true`, `false` como tipos)
- Union de literais
- Type narrowing com literais

### Módulo 10: Tipos Union

#### Tópicos:
- Definição de union types: `string | number`
- Múltiplos tipos na union
- Type guards para unions
- Discriminated unions (pattern matching)

### Módulo 11: Tipos Intersection

#### Tópicos:
- Combinando tipos: `Type1 & Type2`
- Múltiplos tipos em intersection
- Quando usar intersection vs. union
- Intersection com interfaces

### Módulo 12: Tipos Alias vs. Interface

#### Tópicos:
- Criação de type alias com `type`
- Criação de interface com `interface`
- Quando usar cada um
- Diferenças e similaridades
- Extendendo tipos vs. interfaces

### Módulo 13: Any, Unknown, Never

#### Tópicos:
- `any` (escape do sistema de tipos)
- `unknown` (seguro, requer type guard)
- `never` (tipo que nunca ocorre)
- `void` (função sem retorno)
- Quando evitar `any`

---

## Bloco 3: Controle de Fluxo

### Módulo 14: Estruturas Condicionais

#### Tópicos:
- `if` statement
- `else if` múltiplas condições
- `else` padrão
- Operador ternário (`?:`)
- Type narrowing em condicionais
- Falsy vs. truthy values

### Módulo 15: Estruturas de Múltipla Escolha

#### Tópicos:
- `switch` statement
- `case` e `default`
- `break` para sair do case
- Exhaustiveness checking (garantir todos os casos)
- `switch` com tipos union

### Módulo 16: Laços de Repetição (Loops)

#### Tópicos:
- `for` loop clássico
- `for...of` para iteração sobre valores
- `for...in` para iteração sobre chaves
- `while` loop
- `do...while` loop
- `break` (sair do loop)
- `continue` (pular para próxima iteração)

### Módulo 17: Métodos de Array

#### Tópicos:
- `.forEach()` com tipo correto
- `.map()` transformação
- `.filter()` filtragem
- `.reduce()` acumulação
- `.find()` encontrar elemento
- `.every()` e `.some()` testes

---

## Bloco 4: Estruturas de Dados

### Módulo 18: Arrays

#### Tópicos:
- Declaração de arrays com tipo: `number[]` ou `Array<number>`
- Arrays com múltiplos tipos: `(string | number)[]`
- Arrays de objetos
- `readonly` arrays
- Array methods com tipos corretos
- Tuple arrays com tipo fixo: `[string, number]`

### Módulo 19: Objetos (Básico)

#### Tópicos:
- Declaração de objetos literais
- Property type annotations
- Optional properties: `property?`
- Readonly properties
- Property shorthand
- Destructuring de objetos

### Módulo 20: Tuplas

#### Tópicos:
- Definição de tuplas com tipos fixos
- Tuplas com comprimento conhecido
- Elementos opcionais em tuplas
- `readonly` tuplas
- Rest elements em tuplas

### Módulo 21: Enums

#### Tópicos:
- Enums numéricos
- Enums de string
- Enums heterogêneos
- Enums const
- Iteração sobre enums
- Reverse mapping (numéricos)

### Módulo 22: Tipos Mapeados (Mapped Types)

#### Tópicos:
- Criação de tipos baseado em outro
- `keyof` para extrair chaves
- `typeof` para extrair tipo de valor
- Looping sobre chaves
- Modificadores `readonly` e `?`

### Módulo 23: Tipos Condicionais (Conditional Types)

#### Tópicos:
- Sintaxe: `T extends U ? X : Y`
- Conditional types distribuídos
- `infer` keyword
- Conditional types recursivos

---

## Bloco 5: Funções e Modularização

### Módulo 24: Declaração e Chamada de Funções

#### Tópicos:
- Function declaration com tipos
- Function expression com tipos
- Arrow functions com tipos
- Métodos de objeto com tipos
- Function overloading (múltiplas assinaturas)

### Módulo 25: Parâmetros e Argumentos

#### Tópicos:
- Parâmetros obrigatórios
- Parâmetros opcionais: `param?: type`
- Parâmetros padrão: `param: type = valor`
- Rest parameters: `...args: type[]`
- Destructuring em parâmetros

### Módulo 26: Valores de Retorno

#### Tópicos:
- Type annotation de retorno
- Retorno implícito
- Funções que não retornam: `void`
- Funções que nunca retornam: `never`
- Múltiplos retornos (usando union/tuple)

### Módulo 27: Escopo de Variáveis

#### Tópicos:
- Escopo global
- Escopo de função
- Escopo de bloco (com `let` e `const`)
- Closure (função dentro de função)
- Variable shadowing

### Módulo 28: Funções Anônimas e Arrow Functions

#### Tópicos:
- Arrow function syntax: `() => {}`
- Implicit return
- `this` binding em arrow functions
- Callbacks com tipos corretos
- Event handlers com tipos

### Módulo 29: Recursão

#### Tópicos:
- Função que chama a si mesma
- Caso base e caso recursivo
- Stack overflow
- Recursão com tipos
- Tail recursion (conceitual)

### Módulo 30: Genéricos em Funções

#### Tópicos:
- Declaração de função genérica: `function<T>(param: T): T`
- Múltiplos parâmetros genéricos
- Constraints genéricos: `<T extends Type>`
- Default type parameters
- Type inference com genéricos

---

## Bloco 6: Programação Orientada a Objetos

### Módulo 31: Classes

#### Tópicos:
- Declaração de classe
- Constructor method
- Properties (fields)
- Methods
- Acessadores (getters/setters)
- Static properties e methods
- Abstract classes

### Módulo 32: Modificadores de Acesso

#### Tópicos:
- `public` (padrão, acessível de qualquer lugar)
- `private` (acessível apenas dentro da classe)
- `protected` (acessível em classe e subclasses)
- `readonly` (não pode ser reatribuído)
- Property parameter shorthand

### Módulo 33: Herança

#### Tópicos:
- `extends` keyword
- Chamada de super() no construtor
- Sobrescrita de métodos (override)
- `super` para chamar método da classe pai
- Herança múltipla via interfaces

### Módulo 34: Interfaces

#### Tópicos:
- Definição de interface
- Implementação com `implements`
- Properties opcionais em interface
- Readonly properties
- Métodos em interface
- Herança de interface
- Interfaces vs. Type aliases

### Módulo 35: Polimorfismo

#### Tópicos:
- Sobrecarga de método (method overloading)
- Substituição de tipos (tipo pai pode receber tipo filho)
- Duck typing TypeScript
- Interfaces para polimorfismo

### Módulo 36: Enums

#### Tópicos:
- Enum numérico
- Enum string
- Usar enums em classes
- Iteração sobre enums

---

## Bloco 7: Tratamento de Erros

### Módulo 37: Conceito de Erros

#### Tópicos:
- Tipos de erro em TypeScript
- Erro de compilação vs. runtime
- Error object
- Error stack trace

### Módulo 38: Try...Catch...Finally

#### Tópicos:
- Bloco `try` para código que pode falhar
- Bloco `catch` para capturar erro
- Type de erro em catch (typed catch)
- Bloco `finally` sempre executado
- Nested try...catch

### Módulo 39: Throw

#### Tópicos:
- Lançar erro com `throw`
- Throw string, object, Error
- Custom error classes
- Propagação de erro

### Módulo 40: Custom Error Classes

#### Tópicos:
- Estendendo classe Error
- Propriedades customizadas
- Mensagens de erro descritivas
- Tipagem de erro

### Módulo 41: Never Type

#### Tópicos:
- Funções que lançam erro
- Nunca retornam

### Módulo 42: Result Type Pattern

#### Tópicos:
- Retornando `{success: boolean, data?: T, error?: string}`
- Union tipos para sucesso/erro
- Discriminated unions para error handling

---

## Bloco 8: Programação Funcional (Conceitos)

### Módulo 43: Imutabilidade

#### Tópicos:
- Variáveis `const` (reatribuição bloqueada)
- Objects com propriedades readonly
- Spread operator para cópia: `{...obj}`
- Arrays spread: `[...arr]`
- Não modificar arrays/objetos originais

### Módulo 44: Funções Puras

#### Tópicos:
- Mesma entrada = mesma saída
- Sem side effects (efeitos colaterais)
- Previsibilidade e testabilidade
- Evitar modificação de estado externo

### Módulo 45: Funções de Alta Ordem

#### Tópicos:
- Funções que recebem funções como parâmetro
- Funções que retornam funções
- Callbacks com tipos
- Higher-order functions typed

### Módulo 46: Map, Filter, Reduce

#### Tópicos:
- `.map<T>(callback): T[]` transformar array
- `.filter(predicate): T[]` filtrar elementos
- `.reduce(callback, initialValue): T` acumular
- Composição destes métodos
- Type inference em operações

### Módulo 47: Partial Application e Currying

#### Tópicos:
- Fixar alguns parâmetros de uma função
- Retornar função que aceita outros parâmetros
- Benefícios: reutilização e composição

### Módulo 48: Composição de Funções

#### Tópicos:
- Combinar múltiplas funções
- Pipe vs. Compose
- Type safety em composição

---

## Bloco 9: Tipos Avançados

### Módulo 49: Tipos Utilitários

#### Tópicos:
- `Partial<T>` (todas as properties opcionais)
- `Required<T>` (todas as properties obrigatórias)
- `Readonly<T>` (todas as properties readonly)
- `Record<K, T>` (objeto com chaves tipo K, valores tipo T)
- `Pick<T, K>` (selecionar propriedades)
- `Omit<T, K>` (excluir propriedades)
- `Exclude<T, U>` (remover tipos de union)
- `Extract<T, U>` (extrair tipos comuns)
- `NonNullable<T>` (remover null/undefined)
- `ReturnType<F>` (extrair tipo de retorno)
- `Parameters<F>` (extrair tipos de parâmetros)

### Módulo 50: Decorators

#### Tópicos:
- Sintaxe `@decorator`
- Class decorators
- Property decorators
- Method decorators
- Parameter decorators
- Decorator factories (com parâmetros)

### Módulo 51: Genéricos Avançados

#### Tópicos:
- Multiple type parameters: `<T, U, V>`
- Constraints complexos: `<T extends Partial<U>>`
- Type inference em genéricos
- Genéricos recursivos
- Genéricos com default: `<T = string>`

### Módulo 52: Tipos Literal

#### Tópicos:
- String literal types
- Number literal types
- Boolean literal types
- Union de literais para restricção
- Template literal types (TS 4.4+)

### Módulo 53: Type Narrowing

#### Tópicos:
- `typeof` guard
- `instanceof` guard
- User-defined type guards (type predicates)
- Discriminated unions
- Property narrowing

---

## Bloco 10: Módulos e Ecossistema

### Módulo 54: Sistema de Módulos

#### Tópicos:
- CommonJS vs. ES6 modules
- `import` e `export`
- `import * as` namespace import
- `import { }` named imports
- `import default from`
- `export default`
- `export named`
- Re-exports

### Módulo 55: Gerenciador de Pacotes

#### Tópicos:
- npm (Node Package Manager)
- `npm install` para instalar dependências
- `package.json` e `package-lock.json`
- Versionamento semântico
- npm scripts
- Instalação global vs. local

### Módulo 56: Configuração de TypeScript

#### Tópicos:
- `tsconfig.json` completo
- `compilerOptions`
- `include` e `exclude`
- `target` (ES version)
- `module` (ES modules ou CommonJS)
- `strict` mode
- `skipLibCheck`
- `esModuleInterop`

### Módulo 57: Linting e Formatação

#### Tópicos:
- ESLint para verificação de código
- Prettier para formatação
- Configuração de .eslintrc
- Integração com editor
- Pre-commit hooks

### Módulo 58: Testes

#### Tópicos:
- Jest como framework de teste
- Test unitário com TypeScript
- Mock e Stub
- Coverage de testes
- Testes assíncronos
- Setup e teardown

### Módulo 59: Build Tools

#### Tópicos:
- TypeScript compilar para JavaScript
- Webpack para bundling
- Vite para desenvolvimento rápido
- ts-node para executar TS diretamente

---

## Bloco 11: Assincronia e Concorrência

### Módulo 60: Callbacks

#### Tópicos:
- Callbacks básicos
- Callback hell (pyramid of doom)
- Error-first callbacks

### Módulo 61: Promises

#### Tópicos:
- Promise creation: `new Promise((resolve, reject) => {})`
- `.then()` para sucesso
- `.catch()` para erro
- `.finally()` sempre executado
- Promise chaining
- Promise.resolve() e Promise.reject()
- Promise.all() esperar múltiplas
- Promise.race() primeira a resolver
- Promise.allSettled() todas com resultado

### Módulo 62: Async/Await

#### Tópicos:
- `async` function que retorna Promise
- `await` para esperar Promise
- Try...catch com async/await
- Error handling
- Múltiplas awaits
- Parallel execution com Promise.all()
- Loops com async/await

### Módulo 63: Event Loop

#### Tópicos:
- Call stack
- Task queue vs. microtask queue
- Evento loop order
- setTimeout vs. Promise timing

### Módulo 64: Tipos para Async

#### Tópicos:
- Type de Promise: `Promise<T>`
- Type de async function
- Generics com Promise
- Error handling types

---

## Bloco 12: Integração com JavaScript/Node.js

### Módulo 65: Biblioteca Padrão

#### Tópicos:
- `fs` (File System)
- `path` (Path manipulation)
- `http` (HTTP server/client)
- `events` (Event emitter)
- `stream` (Streaming)
- `util` (Utilities)
- `os` (Operating System info)

### Módulo 66: Módulos Populares

#### Tópicos:
- `lodash` (utility functions)
- `axios` (HTTP client)
- `moment` ou `dayjs` (date manipulation)
- `express` (web framework)
- `prisma` ou `typeorm` (ORM)
- `zod` ou `yup` (validation)

### Módulo 67: DOM Typing (para Frontend)

#### Tópicos:
- `HTMLElement` types
- `Event` types
- DOM API typing
- `document` typing
- Event listener types

### Módulo 68: Node.js Integration

#### Tópicos:
- Tipos do Node.js (@types/node)
- Process types
- Buffer types
- Stream types
- Callback types vs. Promise

---

## Bloco 13: Padrões e Best Practices

### Módulo 69: Design Patterns

#### Tópicos:
- Singleton
- Factory
- Observer
- Strategy
- Builder
- Adapter
- Decorator

### Módulo 70: Naming Conventions

#### Tópicos:
- Variáveis: camelCase
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase ou I prefix
- Type aliases: PascalCase

### Módulo 71: Code Organization

#### Tópicos:
- Estrutura de pasta do projeto
- Separação de concerns
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- SOLID principles

### Módulo 72: Performance

#### Tópicos:
- Tree shaking
- Code splitting
- Lazy loading
- Memoization
- Avoiding memory leaks

### Módulo 73: Documentation

#### Tópicos:
- JSDoc comments
- Type documentation
- README files
- Changelog
- API documentation

---

## Bloco 14: Projeto Prático Integrador

### Módulo 74: Planejamento de Projeto

#### Tópicos:
- Definição de requisitos
- Arquitetura do projeto
- Setup inicial
- Estrutura de pastas
- Configuração de ferramentas

### Módulo 75: Implementação

#### Tópicos:
- Estrutura de classes/interfaces
- Lógica de negócio
- Tratamento de erros
- Testes unitários
- Documentação de código

### Módulo 76: Refinamento

#### Tópicos:
- Code review
- Refactoring
- Performance optimization
- Security audit
- Deployment preparation

---

## Ordem de Estudo Recomendada

1. **Semana 1-2**: Blocos 1-2 (Fundamentos e Tipos)
2. **Semana 3**: Bloco 3 (Controle de Fluxo)
3. **Semana 4**: Blocos 4-5 (Estruturas de Dados e Funções)
4. **Semana 5-6**: Bloco 6 (OOP)
5. **Semana 7**: Bloco 7 (Tratamento de Erros)
6. **Semana 8**: Bloco 8 (Programação Funcional)
7. **Semana 9**: Blocos 9-10 (Tipos Avançados e Módulos)
8. **Semana 10**: Bloco 11 (Assincronia)
9. **Semana 11**: Bloco 12 (Integração)
10. **Semana 12-13**: Blocos 13-14 (Padrões e Projeto)

**Total Estimado: 60-80 horas (13 semanas)**

---

## Recursos Complementares

- **Documentação Oficial**: https://www.typescriptlang.org/
- **TypeScript Playground**: https://www.typescriptlang.org/play
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Tipos para bibliotecas**: https://www.typescriptlang.org/dt/ (@types/)
- **Community**: Discord, Stack Overflow, GitHub

---

## Pré-requisitos

- Conhecimento básico de JavaScript
- Node.js instalado
- Familiarity com terminal/bash
- Conhecimento básico de npm/yarn

---

**Cada bloco deve incluir:**
- Conceitos teóricos
- Exemplos práticos de código
- Exercícios hands-on
- Comparações TypeScript vs. JavaScript
- Melhores práticas
- Casos de uso reais
- Links para referências
- Armadilhas comuns
