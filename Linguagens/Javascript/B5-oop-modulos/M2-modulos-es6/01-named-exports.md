# Named Exports: Análise Conceitual

## 🎯 Definição

**Named Exports** (exportações nomeadas) são uma funcionalidade do sistema de módulos ES6 que permite exportar múltiplas entidades (funções, variáveis, classes) de um módulo usando seus nomes específicos. Diferentemente de default exports, você pode ter quantos named exports quiser em um mesmo módulo.

```javascript
// matematica.js
export const PI = 3.14159;

export function somar(a, b) {
  return a + b;
}

export function subtrair(a, b) {
  return a - b;
}

// Importando
import { PI, somar, subtrair } from './matematica.js';

console.log(somar(5, 3)); // 8
console.log(PI); // 3.14159
```

**Conceito:** Exportar múltiplas entidades nomeadas que podem ser importadas seletivamente pelo nome exato.

## 📋 Sintaxes de Exportação

### Exportação Inline

```javascript
// Exportar diretamente na declaração
export const nome = 'João';
export let idade = 30;
export var cidade = 'São Paulo';

export function cumprimentar() {
  return 'Olá!';
}

export class Pessoa {
  constructor(nome) {
    this.nome = nome;
  }
}
```

### Exportação ao Final

```javascript
// Declarar primeiro, exportar depois
const nome = 'Maria';
let idade = 25;

function cumprimentar() {
  return 'Oi!';
}

class Usuario {
  constructor(email) {
    this.email = email;
  }
}

// Exportar tudo de uma vez
export { nome, idade, cumprimentar, Usuario };
```

### Exportação com Renomeação

```javascript
// interno.js
const valorInterno = 100;

function calcularInterno() {
  return valorInterno * 2;
}

// Exportar com nome diferente
export {
  valorInterno as valor,
  calcularInterno as calcular
};

// consumidor.js
import { valor, calcular } from './interno.js';
// 'valorInterno' e 'calcularInterno' não existem para importação
```

## 🧠 Fundamentos Teóricos

### Como Funcionam Named Exports

Named exports criam **bindings** (ligações) entre o nome exportado e o valor no módulo. Essas ligações são **live bindings** (ligações vivas), o que significa que se o valor mudar no módulo exportador, a mudança é refletida nos importadores.

```javascript
// contador.js
export let contador = 0;

export function incrementar() {
  contador++;
}

// app.js
import { contador, incrementar } from './contador.js';

console.log(contador); // 0
incrementar();
console.log(contador); // 1 (valor atualizado automaticamente!)
```

**Princípio:** Named exports não copiam valores, mas criam referências vivas ao valor original no módulo.

### Namespace de Exportação

Cada named export adiciona uma propriedade ao "namespace" do módulo. Quando você importa, está selecionando propriedades específicas desse namespace.

```javascript
// utils.js exporta 'namespace':
// {
//   formatarTexto: function,
//   validarEmail: function,
//   converterData: function
// }

export function formatarTexto(texto) {
  return texto.trim().toUpperCase();
}

export function validarEmail(email) {
  return email.includes('@');
}

export function converterData(data) {
  return new Date(data);
}
```

### Read-Only Imports

Valores importados via named exports são **read-only** (somente leitura) no módulo importador. Você não pode reatribuí-los, apenas usá-los.

```javascript
// config.js
export let ambiente = 'desenvolvimento';

// app.js
import { ambiente } from './config.js';

console.log(ambiente); // 'desenvolvimento'

// ❌ ERRO: Assignment to constant variable
ambiente = 'produção';

// ✅ Mas você pode modificar propriedades de objetos
export const configuracao = { debug: true };

// app.js
import { configuracao } from './config.js';
configuracao.debug = false; // OK! (propriedade, não reatribuição)
```

## 🔍 Sintaxes de Importação

### Importação Seletiva

```javascript
// matematica.js
export const PI = 3.14;
export const E = 2.71;
export function somar(a, b) { return a + b; }
export function multiplicar(a, b) { return a * b; }

// app.js - importar apenas o que precisa
import { PI, somar } from './matematica.js';
// E e multiplicar não são importados
```

### Importação com Renomeação

```javascript
// utils.js
export function validar(dados) {
  return true;
}

// app.js - evitar conflito de nomes
import { validar as validarDados } from './utils.js';

function validar(formulario) {
  // função local com mesmo nome
}

validarDados({ nome: 'João' }); // função importada renomeada
validar({}); // função local
```

### Importação de Namespace

```javascript
// matematica.js
export const PI = 3.14;
export function somar(a, b) { return a + b; }
export function subtrair(a, b) { return a - b; }

// app.js - importar tudo como objeto
import * as mat from './matematica.js';

console.log(mat.PI); // 3.14
console.log(mat.somar(5, 3)); // 8
console.log(mat.subtrair(10, 4)); // 6
```

**Conceito:** `import * as nome` cria um objeto contendo todas as exportações nomeadas do módulo.

### Importações Múltiplas

```javascript
// Importar de múltiplos módulos
import { funcao1, funcao2 } from './modulo1.js';
import { ClasseA, ClasseB } from './modulo2.js';
import { CONSTANTE } from './modulo3.js';

// Importar e renomear múltiplos
import {
  validarEmail as validar,
  formatarTexto as formatar,
  converterData as converter
} from './utils.js';
```

## 🎯 Exemplos Práticos

### Sistema de Validação

```javascript
// validadores.js
export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarCPF(cpf) {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regex.test(cpf);
}

export function validarTelefone(telefone) {
  const regex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return regex.test(telefone);
}

export const MENSAGENS_ERRO = {
  EMAIL_INVALIDO: 'Email inválido',
  CPF_INVALIDO: 'CPF inválido',
  TELEFONE_INVALIDO: 'Telefone inválido'
};

// formulario.js
import {
  validarEmail,
  validarCPF,
  MENSAGENS_ERRO
} from './validadores.js';

function validarFormulario(dados) {
  if (!validarEmail(dados.email)) {
    throw new Error(MENSAGENS_ERRO.EMAIL_INVALIDO);
  }

  if (!validarCPF(dados.cpf)) {
    throw new Error(MENSAGENS_ERRO.CPF_INVALIDO);
  }

  return true;
}
```

### API Client com Múltiplas Funções

```javascript
// api.js
const BASE_URL = 'https://api.exemplo.com';

export async function buscarUsuario(id) {
  const resposta = await fetch(`${BASE_URL}/usuarios/${id}`);
  return resposta.json();
}

export async function criarUsuario(dados) {
  const resposta = await fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  return resposta.json();
}

export async function atualizarUsuario(id, dados) {
  const resposta = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  return resposta.json();
}

export async function deletarUsuario(id) {
  await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: 'DELETE'
  });
}

export const STATUS_HTTP = {
  OK: 200,
  CRIADO: 201,
  NAO_ENCONTRADO: 404,
  ERRO_SERVIDOR: 500
};

// app.js - importar apenas necessário
import {
  buscarUsuario,
  criarUsuario,
  STATUS_HTTP
} from './api.js';

async function carregarPerfil(id) {
  const usuario = await buscarUsuario(id);
  console.log(usuario);
}
```

## ⚠️ Considerações e Boas Práticas

### Vantagens

- ✅ **Clareza:** Nome explícito indica o que está sendo importado
- ✅ **Tree Shaking:** Bundlers podem eliminar exports não utilizados
- ✅ **Múltiplas Exportações:** Um módulo pode exportar várias entidades
- ✅ **Autocomplete:** IDEs conseguem sugerir exports disponíveis
- ✅ **Refatoração:** Renomear exports atualiza automaticamente

### Quando Usar Named Exports

```javascript
// ✅ Módulos utilitários com múltiplas funções relacionadas
export function formatar(texto) { }
export function validar(dados) { }
export function converter(valor) { }

// ✅ Constantes e configurações
export const API_URL = 'https://api.com';
export const TIMEOUT = 5000;

// ✅ Classes auxiliares
export class Erro extends Error { }
export class Validador { }
```

### Quando NÃO Usar

```javascript
// ❌ Módulo com apenas uma exportação principal
// Melhor usar default export
export function processarPagamento(dados) {
  // única função do módulo
}

// ✅ Melhor
export default function processarPagamento(dados) { }
```

### Armadilhas Comuns

**1. Importação Sem Chaves**

```javascript
// ❌ ERRO: named exports precisam de chaves
import somar from './matematica.js';

// ✅ CORRETO
import { somar } from './matematica.js';
```

**2. Nome Incorreto na Importação**

```javascript
// matematica.js
export function somar(a, b) { }

// ❌ ERRO: 'soma' não foi exportado
import { soma } from './matematica.js';

// ✅ CORRETO: nome exato ou renomear
import { somar } from './matematica.js';
import { somar as soma } from './matematica.js';
```

**3. Tentar Modificar Import**

```javascript
// config.js
export let ambiente = 'dev';

// app.js
import { ambiente } from './config.js';

// ❌ ERRO: importações são read-only
ambiente = 'prod';
```

## 🔗 Relação com Outros Conceitos

### Named vs Default Exports

```javascript
// Combinando ambos no mesmo módulo
export default class Usuario { }  // default export

export function validarUsuario(user) { }  // named export
export const ADMIN = 'admin';  // named export

// Importando
import Usuario, { validarUsuario, ADMIN } from './usuario.js';
```

### Live Bindings

```javascript
// contador.js
export let contador = 0;

export function incrementar() {
  contador++;
  console.log('Contador no módulo:', contador);
}

export function obterContador() {
  return contador;
}

// app.js
import { contador, incrementar, obterContador } from './contador.js';

console.log(contador); // 0
incrementar(); // 'Contador no módulo: 1'
console.log(contador); // 1 (atualizado automaticamente!)
console.log(obterContador()); // 1
```

### Module Namespace Object

```javascript
// utils.js
export const PI = 3.14;
export function dobrar(n) { return n * 2; }

// app.js
import * as utils from './utils.js';

// 'utils' é um objeto namespace selado e imutável
console.log(Object.keys(utils)); // ['PI', 'dobrar']
console.log(utils.PI); // 3.14

// ❌ Não pode adicionar propriedades
utils.E = 2.71; // Falha silenciosamente (ou erro em strict mode)

// ❌ Não pode reatribuir
utils = {}; // ERRO
```

## 🚀 Evolução e Próximos Conceitos

Named exports são a base do sistema modular ES6 e levam naturalmente a:

- **Default Exports:** Exportação principal de um módulo
- **Re-exports:** Reagrupar exportações de múltiplos módulos
- **Dynamic Imports:** Importação assíncrona sob demanda
- **Tree Shaking:** Otimização que remove exports não utilizados

Named exports representam a forma mais flexível e explícita de compartilhar múltiplas funcionalidades entre módulos JavaScript, promovendo organização, reutilização e manutenibilidade do código.
