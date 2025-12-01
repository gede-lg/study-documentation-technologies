# Circular Dependencies: Análise Conceitual

## 🎯 Definição

**Circular Dependencies** (dependências circulares) ocorrem quando dois ou mais módulos dependem uns dos outros direta ou indiretamente, criando um **ciclo no grafo de dependências**. Por exemplo: módulo A importa B, e módulo B importa A. Essa situação pode causar comportamentos inesperados, valores undefined, ou até erros, dependendo do sistema de módulos usado.

```javascript
// a.js
import { valorB } from './b.js';
export const valorA = 'A';
console.log(valorB);

// b.js
import { valorA } from './a.js';
export const valorB = 'B';
console.log(valorA);

// Ciclo: a.js → b.js → a.js
```

**Conceito:** Situação onde módulos formam uma cadeia circular de importações, criando complexidades na ordem de inicialização.

## 📋 Tipos de Dependências Circulares

### 1. Circular Direta (A ↔ B)

```javascript
// usuario.js
import { validarPedido } from './pedido.js';

export class Usuario {
  criarPedido(dados) {
    if (validarPedido(dados)) {
      // criar pedido
    }
  }
}

// pedido.js
import { Usuario } from './usuario.js';

export function validarPedido(dados) {
  const usuario = new Usuario();
  // validação
}

// Ciclo direto: usuario.js ↔ pedido.js
```

### 2. Circular Indireta (A → B → C → A)

```javascript
// a.js
import { funcaoB } from './b.js';
export function funcaoA() { }

// b.js
import { funcaoC } from './c.js';
export function funcaoB() { }

// c.js
import { funcaoA } from './a.js';
export function funcaoC() { }

// Ciclo indireto: a.js → b.js → c.js → a.js
```

### 3. Circular Condicional

```javascript
// a.js
if (condicao) {
  const { funcaoB } = await import('./b.js');
}

// b.js
import { funcaoA } from './a.js';

// Ciclo condicional (apenas em runtime se condição for verdadeira)
```

## 🧠 Comportamento por Sistema de Módulos

### ES6 Modules - Live Bindings

ES6 Modules lidam **relativamente bem** com dependências circulares graças a **live bindings** (ligações vivas) e **hoisting** de imports.

```javascript
// a.js
import { valorB } from './b.js';

export const valorA = 'A';

console.log('Em A, valorB =', valorB);

// b.js
import { valorA } from './a.js';

export const valorB = 'B';

console.log('Em B, valorA =', valorA);

// Saída possível:
// Em B, valorA = A
// Em A, valorB = B

// Funciona porque:
// 1. Imports são hoisted
// 2. Exports são bindings vivos
// 3. Valores são resolvidos quando acessados
```

**Por que funciona:**
1. **Parse Phase:** Todos os imports/exports são identificados
2. **Linking:** Bindings são criados (mas não inicializados)
3. **Execution:** Código é executado, valores são atribuídos
4. **Live Bindings:** Valores atualizam automaticamente

### CommonJS - Copy Values

CommonJS tem **mais problemas** com dependências circulares porque `require` retorna **cópias** e executa módulos síncronamente na ordem que são encontrados.

```javascript
// a.js
const b = require('./b');

console.log('Em A, b.valorB =', b.valorB);

module.exports = {
  valorA: 'A'
};

// b.js
const a = require('./a');

console.log('Em B, a.valorA =', a.valorA);

module.exports = {
  valorB: 'B'
};

// Saída:
// Em B, a.valorA = undefined
// Em A, b.valorB = B

// Problema:
// Quando b.js executa require('./a'), a.js ainda não terminou
// module.exports de a.js está vazio ({}) no momento do require
```

**Por que falha:**
1. `a.js` começa a executar
2. `a.js` faz `require('./b')`
3. `b.js` começa a executar
4. `b.js` faz `require('./a')` mas `a.js` não terminou ainda
5. CommonJS retorna `module.exports` parcial de `a.js` (vazio `{}`)
6. `b.js` vê valores undefined

## 🔍 Análise Detalhada

### Exemplo: ES6 com Funções

```javascript
// math.js
import { PI } from './constants.js';

export function areaCirculo(raio) {
  return PI * raio * raio;
}

// constants.js
import { areaCirculo } from './math.js';

export const PI = 3.14159;

// Teste: calcular área de círculo com raio 1
console.log(areaCirculo(1));

// ⚠️ Funciona porque:
// - import é hoisted
// - PI é acessado quando areaCirculo é CHAMADA
// - Nesse momento, PI já foi inicializado
```

### Exemplo: ES6 com Acesso Imediato

```javascript
// a.js
import { valorB } from './b.js';

export const valorA = 'A';

// ❌ Acesso imediato durante inicialização
const resultado = valorB.toUpperCase();

// b.js
import { valorA } from './a.js';

export const valorB = 'B';

// ERRO: Cannot read property 'toUpperCase' of undefined
// valorB ainda é undefined quando a.js tenta acessar
```

### Exemplo: CommonJS Workaround

```javascript
// a.js
let b; // Lazy loading

function obterB() {
  if (!b) {
    b = require('./b');
  }
  return b;
}

exports.funcaoA = function() {
  const moduloB = obterB();
  return moduloB.funcaoB();
};

// b.js
const a = require('./a');

exports.funcaoB = function() {
  return a.funcaoA();
};

// Funciona porque require só acontece quando função é chamada
// Não durante inicialização do módulo
```

## 🎯 Problemas Causados

### 1. Valores Undefined

```javascript
// usuario.js
import { STATUS_PEDIDO } from './pedido.js';

export class Usuario {
  constructor() {
    // ❌ STATUS_PEDIDO pode ser undefined aqui
    this.statusPadrao = STATUS_PEDIDO.PENDENTE;
  }
}

// pedido.js
import { Usuario } from './usuario.js';

export const STATUS_PEDIDO = {
  PENDENTE: 'pendente',
  APROVADO: 'aprovado'
};

// TypeError: Cannot read property 'PENDENTE' of undefined
```

### 2. Ordem de Inicialização Imprevisível

```javascript
// config.js
import { ambiente } from './app.js';

export const CONFIG = {
  api: ambiente === 'prod' ? 'https://api' : 'http://localhost'
};

// app.js
import { CONFIG } from './config.js';

export const ambiente = CONFIG.api.includes('https') ? 'prod' : 'dev';

// ⚠️ Qual executa primeiro?
// Ordem indefinida, comportamento imprevisível
```

### 3. Dificulta Debugging

```javascript
// Stack trace confuso em dependências circulares
// Difícil identificar onde começou o problema
// Módulos meio-inicializados geram bugs sutis
```

## ⚠️ Soluções e Boas Práticas

### 1. Refatorar para Remover Ciclo

**Extrair para módulo separado:**

```javascript
// ❌ Antes: Ciclo A ↔ B
// usuario.js
import { validarPedido } from './pedido.js';
export class Usuario { }

// pedido.js
import { Usuario } from './usuario.js';
export function validarPedido() { }

// ✅ Depois: A → C ← B (sem ciclo)
// usuario.js
import { validarPedido } from './validadores.js';
export class Usuario { }

// pedido.js
export class Pedido { }

// validadores.js (novo módulo)
import { Usuario } from './usuario.js';
import { Pedido } from './pedido.js';
export function validarPedido() { }
```

### 2. Lazy Loading (CommonJS)

```javascript
// a.js
exports.funcaoA = function() {
  // Require dentro da função (lazy)
  const b = require('./b');
  return b.funcaoB();
};

// b.js
exports.funcaoB = function() {
  const a = require('./a');
  return a.funcaoA();
};

// Evita circular durante inicialização
```

### 3. Dynamic Import (ES6)

```javascript
// usuario.js
export class Usuario {
  async criarPedido(dados) {
    // Import dinâmico (assíncrono)
    const { validarPedido } = await import('./pedido.js');

    if (validarPedido(dados)) {
      // criar pedido
    }
  }
}

// pedido.js
import { Usuario } from './usuario.js';
export function validarPedido() { }

// Quebra o ciclo porque import é lazy (não no top-level)
```

### 4. Dependency Injection

```javascript
// usuario.js
export class Usuario {
  // Recebe dependência por parâmetro
  constructor(validadorPedido) {
    this.validadorPedido = validadorPedido;
  }

  criarPedido(dados) {
    if (this.validadorPedido.validar(dados)) {
      // criar
    }
  }
}

// app.js
import { Usuario } from './usuario.js';
import { ValidadorPedido } from './validador.js';

const validador = new ValidadorPedido();
const usuario = new Usuario(validador);

// Inverte dependência, evita circular
```

### 5. Interface/Types Compartilhados

```javascript
// types.ts (TypeScript)
export interface IUsuario {
  id: string;
  nome: string;
}

export interface IPedido {
  usuario: IUsuario;
}

// usuario.ts
import { IPedido } from './types';
// Não importa classe Pedido concreta

// pedido.ts
import { IUsuario } from './types';
// Não importa classe Usuario concreta

// Apenas tipos compartilhados, sem ciclo de valores
```

## 🔗 Detecção de Dependências Circulares

### Ferramentas

**1. madge:**
```bash
npm install -g madge

# Detectar circular dependencies
madge --circular src/

# Gerar grafo visual
madge --circular --image graph.png src/
```

**2. ESLint Plugin:**
```javascript
// .eslintrc.js
{
  plugins: ['import'],
  rules: {
    'import/no-cycle': 'error'
  }
}

// Alerta em tempo de desenvolvimento
```

**3. Webpack Bundle Analyzer:**
```bash
# Visualizar dependências do bundle
npm install webpack-bundle-analyzer

# Identifica ciclos visualmente
```

### Logging Manual

```javascript
// Adicionar logs para detectar ordem de execução

// a.js
console.log('A: iniciando');
import { valorB } from './b.js';
console.log('A: valorB =', valorB);
export const valorA = 'A';
console.log('A: terminando');

// b.js
console.log('B: iniciando');
import { valorA } from './a.js';
console.log('B: valorA =', valorA);
export const valorB = 'B';
console.log('B: terminando');

// Saída revela ordem de inicialização
```

## 🚀 Princípios Arquiteturais

### Evite Acoplamento Bidirecional

```javascript
// ❌ Ruim: A conhece B, B conhece A
// usuario.js ↔ pedido.js

// ✅ Bom: Dependência unidirecional
// app.js → usuario.js
// app.js → pedido.js
```

### Camadas de Arquitetura

```
UI (apresentação)
    ↓
Business Logic (regras de negócio)
    ↓
Data Access (acesso a dados)
    ↓
Database
```

**Regra:** Camadas superiores dependem de inferiores, nunca o contrário.

### Dependency Inversion Principle

```javascript
// ✅ Alto nível não depende de baixo nível diretamente
// Ambos dependem de abstração

// interface (abstração)
export interface ILogger {
  log(msg: string): void;
}

// alto-nivel.ts
import { ILogger } from './interface';

export class ServicoAltoNivel {
  constructor(private logger: ILogger) {}
}

// baixo-nivel.ts
import { ILogger } from './interface';

export class ConsoleLogger implements ILogger {
  log(msg) { console.log(msg); }
}

// Sem ciclo, inversão de dependência
```

## 🔍 Conclusão

Dependências circulares são um **code smell** (indicador de design ruim) e devem ser evitadas sempre que possível. ES6 Modules lidam melhor que CommonJS graças a live bindings, mas ainda assim podem causar bugs sutis. As melhores soluções envolvem **refatoração arquitetural** para eliminar o ciclo, não workarounds técnicos.

**Regra de Ouro:** Se dois módulos dependem um do outro, provavelmente deveria ser um único módulo, ou a lógica compartilhada deveria estar em um terceiro módulo.
