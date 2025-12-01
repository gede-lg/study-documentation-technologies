# Default Exports: Análise Conceitual

## 🎯 Definição

**Default Export** (exportação padrão) é uma funcionalidade do sistema de módulos ES6 que permite exportar uma única entidade principal de um módulo. Cada módulo pode ter apenas um default export, e ele é importado sem chaves e pode receber qualquer nome na importação.

```javascript
// calculadora.js
export default function calcular(operacao, a, b) {
  if (operacao === 'somar') return a + b;
  if (operacao === 'subtrair') return a - b;
  return 0;
}

// app.js - importar sem chaves, com qualquer nome
import calc from './calculadora.js';
import minhaCalculadora from './calculadora.js';
import qualquerNome from './calculadora.js';

console.log(calc('somar', 5, 3)); // 8
```

**Conceito:** Exportação principal de um módulo que representa sua funcionalidade primária, importável com nome arbitrário.

## 📋 Sintaxes de Exportação

### Exportação Default Inline

```javascript
// Com função nomeada
export default function processar(dados) {
  return dados.map(d => d * 2);
}

// Com função anônima
export default function(dados) {
  return dados.filter(d => d > 0);
}

// Com classe
export default class Usuario {
  constructor(nome) {
    this.nome = nome;
  }
}

// Com valor primitivo
export default 42;

// Com objeto
export default {
  nome: 'Configuração',
  versao: '1.0.0',
  debug: true
};

// Com expressão
export default 10 + 20;
```

### Exportação Default Separada

```javascript
// Declarar primeiro, exportar depois
function processar(dados) {
  return dados.map(d => d.toUpperCase());
}

export default processar;

// Ou com classe
class Produto {
  constructor(nome, preco) {
    this.nome = nome;
    this.preco = preco;
  }
}

export default Produto;

// Ou com constante
const configuracao = {
  api: 'https://api.com',
  timeout: 5000
};

export default configuracao;
```

### Exportação Default de Expressão

```javascript
// Arrow function
export default (a, b) => a + b;

// Objeto literal
export default {
  metodo1() { },
  metodo2() { }
};

// Array
export default [1, 2, 3, 4, 5];

// Resultado de função
export default criarConfiguracao();
```

## 🧠 Fundamentos Teóricos

### Uma Única Exportação Default

Diferentemente de named exports (que podem ser múltiplos), cada módulo tem no máximo **uma** exportação default. Isso reflete a ideia de que um módulo deve ter uma responsabilidade principal.

```javascript
// ❌ ERRO: Só pode ter um default
export default function funcao1() { }
export default function funcao2() { } // SyntaxError

// ✅ CORRETO: Um default + named exports
export default function principal() { }
export function auxiliar1() { }
export function auxiliar2() { }
```

### Nome Arbitrário na Importação

O default export não tem nome fixo na importação. Quem importa escolhe o nome, pois assume-se que há apenas uma exportação principal no módulo.

```javascript
// usuario.js
export default class {
  constructor(nome) {
    this.nome = nome;
  }
}

// Cada arquivo pode importar com nome diferente
// arquivo1.js
import Usuario from './usuario.js';

// arquivo2.js
import User from './usuario.js';

// arquivo3.js
import ClasseUsuario from './usuario.js';

// Todos funcionam! São a mesma classe.
```

**Princípio:** Default exports priorizam conveniência de uso sobre explicitação do nome.

### Default Export é Named Export Especial

Internamente, default export é apenas um named export com o nome especial `default`:

```javascript
// Estas são equivalentes:
export default function processar() { }

export { processar as default };

// E na importação:
import processar from './modulo.js';

// É equivalente a:
import { default as processar } from './modulo.js';
```

### Read-Only e Live Bindings

Como named exports, default exports também criam **live bindings** (ligações vivas) e são **read-only** no importador.

```javascript
// config.js
let ambiente = 'desenvolvimento';

export default {
  get ambiente() {
    return ambiente;
  },
  setAmbiente(novoAmbiente) {
    ambiente = novoAmbiente;
  }
};

// app.js
import config from './config.js';

console.log(config.ambiente); // 'desenvolvimento'
config.setAmbiente('produção');
console.log(config.ambiente); // 'produção'

// ❌ Não pode reatribuir o import
config = {}; // ERRO
```

## 🔍 Sintaxes de Importação

### Importação Básica

```javascript
// Sem chaves, nome arbitrário
import minhaFuncao from './modulo.js';
import MinhaClasse from './classe.js';
import dados from './dados.js';
```

### Combinando Default e Named Imports

```javascript
// usuario.js
export default class Usuario { }
export function validarUsuario(user) { }
export const TIPOS = ['admin', 'user'];

// app.js - importar default + named
import Usuario, { validarUsuario, TIPOS } from './usuario.js';
//     ^default  ^named exports em chaves

const user = new Usuario();
if (validarUsuario(user)) {
  console.log(TIPOS);
}
```

### Importação com Nome Explícito

```javascript
// Importar default com nome explícito 'default'
import { default as Funcao } from './modulo.js';

// Equivalente a:
import Funcao from './modulo.js';
```

### Importação de Namespace Inclui Default

```javascript
// matematica.js
export default function somar(a, b) { return a + b; }
export function multiplicar(a, b) { return a * b; }

// app.js
import * as mat from './matematica.js';

console.log(mat.default(5, 3)); // 8 (default export como 'default')
console.log(mat.multiplicar(5, 3)); // 15
```

## 🎯 Exemplos Práticos

### Classe Principal de Módulo

```javascript
// usuario.js
export default class Usuario {
  constructor(nome, email) {
    this.nome = nome;
    this.email = email;
    this.dataCriacao = new Date();
  }

  autenticar(senha) {
    // lógica de autenticação
    return true;
  }

  obterPerfil() {
    return {
      nome: this.nome,
      email: this.email,
      membro: this.dataCriacao.toLocaleDateString()
    };
  }
}

// Funções auxiliares como named exports
export function validarEmail(email) {
  return email.includes('@');
}

export function formatarNome(nome) {
  return nome.trim().toLowerCase();
}

// app.js
import Usuario, { validarEmail, formatarNome } from './usuario.js';

const email = 'joao@email.com';

if (validarEmail(email)) {
  const nome = formatarNome('  JOÃO SILVA  ');
  const usuario = new Usuario(nome, email);
  console.log(usuario.obterPerfil());
}
```

### Objeto de Configuração

```javascript
// config.js
const ambiente = process.env.NODE_ENV || 'desenvolvimento';

const configuracoes = {
  desenvolvimento: {
    apiUrl: 'http://localhost:3000',
    debug: true,
    timeout: 10000
  },
  producao: {
    apiUrl: 'https://api.exemplo.com',
    debug: false,
    timeout: 5000
  }
};

export default configuracoes[ambiente];

// Constantes auxiliares
export const VERSAO = '1.0.0';
export const NOME_APP = 'Minha Aplicação';

// app.js
import config, { VERSAO, NOME_APP } from './config.js';

console.log(`${NOME_APP} v${VERSAO}`);
console.log(`API: ${config.apiUrl}`);
console.log(`Debug: ${config.debug}`);
```

### Função Factory Principal

```javascript
// criarLogger.js
export default function criarLogger(opcoes = {}) {
  const nivel = opcoes.nivel || 'info';
  const prefixo = opcoes.prefixo || '';

  return {
    info(mensagem) {
      if (['info', 'debug'].includes(nivel)) {
        console.log(`[INFO] ${prefixo}${mensagem}`);
      }
    },

    erro(mensagem) {
      console.error(`[ERRO] ${prefixo}${mensagem}`);
    },

    debug(mensagem) {
      if (nivel === 'debug') {
        console.log(`[DEBUG] ${prefixo}${mensagem}`);
      }
    }
  };
}

// Níveis como named exports
export const NIVEIS = {
  INFO: 'info',
  ERRO: 'erro',
  DEBUG: 'debug'
};

// app.js
import criarLogger, { NIVEIS } from './criarLogger.js';

const logger = criarLogger({
  nivel: NIVEIS.DEBUG,
  prefixo: '[App] '
});

logger.info('Aplicação iniciada'); // [INFO] [App] Aplicação iniciada
logger.debug('Modo debug ativo'); // [DEBUG] [App] Modo debug ativo
```

### Componente React (padrão comum)

```javascript
// Botao.js
import React from 'react';

// Componente principal como default
export default function Botao({ texto, onClick, tipo = 'primario' }) {
  const estilos = {
    primario: 'bg-blue-500 text-white',
    secundario: 'bg-gray-300 text-black'
  };

  return (
    <button
      className={estilos[tipo]}
      onClick={onClick}
    >
      {texto}
    </button>
  );
}

// Variações como named exports
export function BotaoPrimario({ texto, onClick }) {
  return <Botao texto={texto} onClick={onClick} tipo="primario" />;
}

export function BotaoSecundario({ texto, onClick }) {
  return <Botao texto={texto} onClick={onClick} tipo="secundario" />;
}

// App.js
import Botao, { BotaoPrimario, BotaoSecundario } from './Botao';

function App() {
  return (
    <div>
      <Botao texto="Clique" onClick={() => {}} />
      <BotaoPrimario texto="Enviar" onClick={() => {}} />
      <BotaoSecundario texto="Cancelar" onClick={() => {}} />
    </div>
  );
}
```

## ⚠️ Considerações e Boas Práticas

### Vantagens

- ✅ **Simplicidade:** Importação direta sem chaves
- ✅ **Flexibilidade de Nome:** Importador escolhe nome adequado ao contexto
- ✅ **Convenção Clara:** Indica funcionalidade principal do módulo
- ✅ **Compatibilidade:** Funciona bem com CommonJS (interop)

### Quando Usar Default Export

```javascript
// ✅ Módulo com uma responsabilidade principal
// Classe principal
export default class Usuario { }

// Função principal
export default function processarPagamento(dados) { }

// Componente React
export default function MeuComponente() { }

// Objeto de configuração
export default { api: '...', timeout: 5000 };
```

### Quando Preferir Named Exports

```javascript
// ❌ Módulo utilitário com múltiplas funções de igual importância
export default {
  validar() { },
  formatar() { },
  converter() { }
};

// ✅ Melhor usar named exports
export function validar() { }
export function formatar() { }
export function converter() { }
```

### Armadilhas Comuns

**1. Importar Default com Chaves**

```javascript
// modulo.js
export default function processar() { }

// ❌ ERRO: default não precisa de chaves
import { processar } from './modulo.js';

// ✅ CORRETO
import processar from './modulo.js';
```

**2. Múltiplos Defaults**

```javascript
// ❌ ERRO: só pode ter um default
export default class Classe1 { }
export default class Classe2 { }  // SyntaxError
```

**3. Default com Nome vs Anônimo**

```javascript
// Função nomeada exportada como default
export default function processar() { }

// Nome 'processar' só vale no módulo, não na importação
import qualquerNome from './modulo.js';
// qualquerNome === processar (a função)

// Stack traces mostrarão 'processar' (útil para debug)
```

**4. Default Export de Declaração vs Expressão**

```javascript
// ✅ Declaration - pode ser hoisted
export default function processar() { }

// ✅ Expression - não sofre hoisting
export default function() { }

// ❌ Não pode exportar declaration com nome e depois reatribuir
export default const config = {};  // SyntaxError
// const não pode ser usado com export default inline

// ✅ Correto
const config = {};
export default config;
```

## 🔗 Relação com Outros Conceitos

### Default + Named Exports

```javascript
// Padrão comum: exportação principal + utilitários
export default class API {
  async get(url) { }
  async post(url, dados) { }
}

export const METODOS = ['GET', 'POST', 'PUT', 'DELETE'];
export function formatarURL(base, endpoint) {
  return `${base}/${endpoint}`;
}

// Uso
import API, { METODOS, formatarURL } from './api.js';
```

### Interoperabilidade com CommonJS

```javascript
// CommonJS
module.exports = function processar() { };

// ES6 importa como default
import processar from './modulo-commonjs.js';

// ES6 default export
export default function processar() { }

// CommonJS importa
const processar = require('./modulo-es6.js').default;
```

### Re-export de Default

```javascript
// modulo-original.js
export default class Usuario { }

// index.js - re-exportar default
export { default } from './modulo-original.js';

// Ou renomear na re-exportação
export { default as Usuario } from './modulo-original.js';
```

## 🚀 Evolução e Próximos Conceitos

Default exports trabalham em conjunto com:

- **Named Exports:** Para exportações secundárias
- **Re-exports:** Agregar múltiplos módulos
- **Dynamic Imports:** Carregar defaults dinamicamente
- **Tree Shaking:** Otimização (menos eficiente com defaults)

Default exports representam a forma idiomática de exportar a funcionalidade principal de um módulo ES6, promovendo simplicidade na importação e clareza sobre a responsabilidade central do módulo.
