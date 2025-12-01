# ES6 Modules vs CommonJS: Análise Conceitual

## 🎯 Definição

**ES6 Modules (ESM)** e **CommonJS (CJS)** são dois sistemas de módulos JavaScript com filosofias, comportamentos e sintaxes diferentes. ES6 Modules é o padrão oficial da linguagem (introduzido no ECMAScript 2015), enquanto CommonJS é o sistema criado para Node.js antes da padronização de módulos no JavaScript.

```javascript
// CommonJS (Node.js tradicional)
const express = require('express');
module.exports = function servidor() { };

// ES6 Modules (padrão moderno)
import express from 'express';
export default function servidor() { }
```

**Conceito:** Dois paradigmas de modularização com diferenças fundamentais em timing, binding, sintaxe e comportamento.

## 📋 Comparação Fundamental

### Sintaxe

**CommonJS:**
```javascript
// Importação
const modulo = require('./modulo');
const { funcao } = require('./modulo');

// Exportação
module.exports = valor;
module.exports.funcao = () => {};
exports.variavel = 10;
```

**ES6 Modules:**
```javascript
// Importação
import modulo from './modulo.js';
import { funcao } from './modulo.js';
import * as modulo from './modulo.js';

// Exportação
export default valor;
export function funcao() {}
export const variavel = 10;
```

### Carregamento

**CommonJS - Síncrono:**
```javascript
// Executado síncronamente em runtime
console.log('Antes');

const modulo = require('./modulo'); // Bloqueia até carregar

console.log('Depois');
```

**ES6 Modules - Assíncrono:**
```javascript
// Parseado estaticamente antes da execução
// Carregamento assíncrono (browsers)
import { funcao } from './modulo.js';

console.log('Executado após módulos serem carregados');
```

## 🧠 Diferenças Fundamentais

### 1. Static vs Dynamic

**ES6 Modules - Estático:**
Imports e exports são **analisados estaticamente** na fase de parsing, antes da execução do código.

```javascript
// ✅ ES6 - Top-level, estático
import { funcao } from './modulo.js';

// ❌ ERRO - Não pode ser condicional
if (condicao) {
  import { funcao } from './modulo.js'; // SyntaxError
}

// ❌ ERRO - Não pode ser dinâmico
const caminho = './modulo.js';
import { funcao } from caminho; // SyntaxError

// ✅ Para dinâmico, usar import()
const modulo = await import('./modulo.js');
```

**CommonJS - Dinâmico:**
Require é uma **chamada de função** executada em runtime, pode estar em qualquer lugar.

```javascript
// ✅ CommonJS - Pode ser condicional
if (condicao) {
  const modulo = require('./modulo'); // OK
}

// ✅ Pode ser dinâmico
const caminho = './modulo';
const modulo = require(caminho); // OK

// ✅ Pode estar em função
function carregar() {
  return require('./modulo'); // OK
}
```

**Implicação:** ES6 permite otimizações (tree shaking), CommonJS oferece flexibilidade.

### 2. Live Bindings vs Copy

**ES6 Modules - Live Bindings:**
Imports são **referências vivas** aos valores exportados. Mudanças no módulo exportador refletem nos importadores.

```javascript
// contador.js (ES6)
export let contador = 0;

export function incrementar() {
  contador++;
}

// app.js
import { contador, incrementar } from './contador.js';

console.log(contador); // 0
incrementar();
console.log(contador); // 1 (atualizado automaticamente!)
```

**CommonJS - Copy (Valor):**
Require retorna uma **cópia** do valor. Mudanças no módulo original não refletem em quem importou.

```javascript
// contador.js (CommonJS)
let contador = 0;

function incrementar() {
  contador++;
}

module.exports = { contador, incrementar };

// app.js
const { contador, incrementar } = require('./contador');

console.log(contador); // 0
incrementar();
console.log(contador); // 0 (não mudou! É cópia)

// Para obter valor atualizado, precisa acessar via objeto
const modulo = require('./contador');
console.log(modulo.contador); // 1
```

**Implicação:** ES6 mantém sincronização, CommonJS requer design específico para valores mutáveis.

### 3. Read-Only vs Writable

**ES6 Modules - Read-Only:**
Valores importados são **somente leitura**. Não pode reatribuir.

```javascript
// modulo.js
export let variavel = 10;

// app.js
import { variavel } from './modulo.js';

variavel = 20; // TypeError: Assignment to constant variable

// Mas pode modificar propriedades de objetos
import { configuracao } from './config.js';
configuracao.timeout = 5000; // OK
```

**CommonJS - Writable:**
Valores importados podem ser modificados (embora não seja boa prática).

```javascript
// modulo.js
exports.variavel = 10;

// app.js
const modulo = require('./modulo');
modulo.variavel = 20; // OK (mas má prática)
```

### 4. Hoisting

**ES6 Modules - Hoisted:**
Imports são **hoisted** (içados) ao topo do arquivo, executados antes de qualquer código.

```javascript
// Funciona mesmo antes da declaração import
console.log(funcao()); // 'Olá'

import { funcao } from './modulo.js';
// Import é hoisted, executado primeiro
```

**CommonJS - Não Hoisted:**
Require é executado na ordem em que aparece.

```javascript
// ❌ ERRO
console.log(funcao()); // ReferenceError

const { funcao } = require('./modulo');
```

### 5. Timing de Execução

**ES6 Modules:**
1. **Parse Phase:** Todos os imports/exports são analisados
2. **Module Graph:** Grafo de dependências é construído
3. **Execution:** Módulos executados em ordem topológica

```javascript
// Fase 1: Parser analisa toda estrutura de imports
// Fase 2: Carrega todas dependências
// Fase 3: Executa código de todos módulos
```

**CommonJS:**
1. **Execução Linear:** Código executado linha por linha
2. **Require Síncrono:** Cada require carrega e executa imediatamente
3. **Caching:** Módulo executado na primeira vez, depois cache

```javascript
console.log('1');
const a = require('./a'); // Carrega e executa A agora
console.log('2');
const b = require('./b'); // Carrega e executa B agora
console.log('3');
```

## 🔍 Análise Detalhada

### Exports

**ES6 - Named e Default:**
```javascript
// Múltiplas formas de export
export const PI = 3.14;
export function somar(a, b) { return a + b; }
export default class Calculadora { }

// Export ao final
const valor = 10;
export { valor };

// Export com renomeação
export { valor as numero };
```

**CommonJS - module.exports e exports:**
```javascript
// module.exports (recomendado)
module.exports = class Calculadora { };

module.exports = {
  PI: 3.14,
  somar: (a, b) => a + b
};

// exports (atalho para module.exports)
exports.PI = 3.14;
exports.somar = (a, b) => a + b;

// ⚠️ ARMADILHA: Não reatribuir exports
exports = { valor: 10 }; // NÃO funciona!
module.exports = { valor: 10 }; // Funciona
```

### Imports

**ES6 - Destructuring e Renomeação:**
```javascript
// Import default
import Classe from './modulo.js';

// Import named
import { funcao } from './modulo.js';

// Import com renomeação
import { funcao as minhaFuncao } from './modulo.js';

// Import namespace
import * as modulo from './modulo.js';

// Import misto
import Classe, { funcao, CONSTANTE } from './modulo.js';
```

**CommonJS - Destructuring Opcional:**
```javascript
// Import completo
const modulo = require('./modulo');

// Destructuring (ES6 syntax com CommonJS)
const { funcao, CONSTANTE } = require('./modulo');

// Encadeamento
const funcao = require('./modulo').funcao;
```

### Circular Dependencies

**ES6 Modules - Suporte Melhor:**
```javascript
// a.js
import { b } from './b.js';
export const a = 'A';
console.log(b); // 'B' (funciona devido a live bindings)

// b.js
import { a } from './a.js';
export const b = 'B';
console.log(a); // 'A'

// Funciona porque imports são hoisted e bindings são live
```

**CommonJS - Pode Retornar Parcial:**
```javascript
// a.js
const b = require('./b');
module.exports = { a: 'A' };
console.log(b); // {} (objeto vazio parcial!)

// b.js
const a = require('./a');
module.exports = { b: 'B' };
console.log(a); // {} (objeto vazio parcial!)

// Retorna objeto parcialmente construído
```

## 🎯 Exemplos Práticos

### Migração CommonJS para ES6

**Antes (CommonJS):**
```javascript
// utils.js
function somar(a, b) {
  return a + b;
}

function multiplicar(a, b) {
  return a * b;
}

module.exports = { somar, multiplicar };

// app.js
const { somar, multiplicar } = require('./utils');

console.log(somar(5, 3));
```

**Depois (ES6):**
```javascript
// utils.js
export function somar(a, b) {
  return a + b;
}

export function multiplicar(a, b) {
  return a * b;
}

// app.js
import { somar, multiplicar } from './utils.js';

console.log(somar(5, 3));
```

### Interoperabilidade

**Importar CommonJS em ES6:**
```javascript
// modulo-commonjs.js
module.exports = function processar() {
  return 'Processado';
};

module.exports.auxiliar = function() {
  return 'Auxiliar';
};

// app-es6.js
// Default import pega module.exports
import processar from './modulo-commonjs.js';

// Named imports pegam propriedades
import { auxiliar } from './modulo-commonjs.js';
```

**Usar ES6 em Node.js (CommonJS):**
```javascript
// Opção 1: package.json com "type": "module"
{
  "type": "module"
}

// Opção 2: Extensão .mjs
// arquivo.mjs (usa ES6 modules)
// arquivo.cjs (usa CommonJS)

// Opção 3: Transpilação (Babel)
```

### Conditional Exports

**CommonJS - Fácil:**
```javascript
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./config-prod');
} else {
  module.exports = require('./config-dev');
}
```

**ES6 - Necessita Dynamic Import:**
```javascript
// Não pode usar import estático condicionalmente
let config;
if (process.env.NODE_ENV === 'production') {
  config = await import('./config-prod.js');
} else {
  config = await import('./config-dev.js');
}

export default config;
```

## ⚠️ Vantagens e Desvantagens

### ES6 Modules

**Vantagens:**
- ✅ **Padrão Oficial:** Parte da especificação JavaScript
- ✅ **Análise Estática:** Permite tree shaking e otimizações
- ✅ **Live Bindings:** Sincronização automática de valores
- ✅ **Assíncrono:** Melhor para browsers
- ✅ **Read-Only:** Previne mutações acidentais
- ✅ **Future-Proof:** Suporte crescente em todas plataformas

**Desvantagens:**
- ❌ **Sintaxe Restrita:** Não pode ser condicional ou dinâmico (sem import())
- ❌ **Suporte Legado:** Node.js < 12 não suporta nativamente
- ❌ **Curva de Aprendizado:** Mais conceitos (named, default, etc.)

### CommonJS

**Vantagens:**
- ✅ **Flexibilidade:** Require dinâmico, condicional
- ✅ **Simplicidade:** Sintaxe simples e direta
- ✅ **Compatibilidade:** Funciona em qualquer Node.js
- ✅ **Síncrono:** Simples de entender (linear)

**Desvantagens:**
- ❌ **Não é Padrão:** Específico do Node.js
- ❌ **Sem Tree Shaking:** Dificulta otimizações
- ❌ **Cópia de Valores:** Não mantém live bindings
- ❌ **Síncrono:** Ruim para browsers (bloqueante)

## 🔗 Quando Usar Cada Um

### Use ES6 Modules

```javascript
// ✅ Projetos novos
// ✅ Aplicações frontend (React, Vue, Angular)
// ✅ Bibliotecas modernas
// ✅ Code splitting e lazy loading
// ✅ Tree shaking importante

import React from 'react';
import { useState } from 'react';
```

### Use CommonJS

```javascript
// ✅ Node.js legado
// ✅ Compatibilidade com código antigo
// ✅ Scripts simples e rápidos
// ✅ Tooling que exige CommonJS

const fs = require('fs');
const path = require('path');
```

### Híbrido (Dual Package)

```javascript
// package.json - suportar ambos
{
  "main": "./dist/index.cjs",     // CommonJS
  "module": "./dist/index.mjs",   // ES6
  "exports": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs"
  }
}
```

## 🚀 Evolução e Futuro

- **ES6 Modules** é o futuro: adoção universal crescente
- **CommonJS** permanece para compatibilidade legada
- **Node.js** suporta ambos nativamente (v12+)
- **Bundlers** (Webpack, Rollup) compilam ES6 para CommonJS quando necessário
- **Deno** e ambientes modernos preferem ES6 exclusivamente

A compreensão de ambos os sistemas é essencial para trabalhar com JavaScript moderno, permitindo navegar entre código legado e padrões atuais com confiança.
