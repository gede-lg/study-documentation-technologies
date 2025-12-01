# localStorage e sessionStorage: Web Storage API

## 🎯 Definição

**localStorage** e **sessionStorage** são APIs de armazenamento key-value no client-side, permitindo persistir dados no navegador sem necessidade de servidor. Ambos armazenam strings, são síncronos, e oferecem ~5-10MB de espaço. A diferença principal é o escopo de persistência: localStorage mantém dados indefinidamente até remoção explícita, enquanto sessionStorage limita dados à duração da sessão (aba/janela).

```javascript
// localStorage: persiste entre sessões
localStorage.setItem('usuario', 'João');
console.log(localStorage.getItem('usuario')); // 'João' (mesmo após fechar aba)

// sessionStorage: persiste apenas na sessão atual
sessionStorage.setItem('token', 'abc123');
console.log(sessionStorage.getItem('token')); // 'abc123' (apagado ao fechar aba)
```

**Conceito:** Armazenamento key-value persistente no navegador (client-side).

## 📋 API Básica

### setItem() / getItem()

```javascript
// Armazenar
localStorage.setItem('chave', 'valor');
sessionStorage.setItem('chave', 'valor');

// Recuperar
const valor1 = localStorage.getItem('chave');
const valor2 = sessionStorage.getItem('chave');

// Chave não existe: retorna null
const inexistente = localStorage.getItem('naoExiste');
console.log(inexistente); // null
```

### removeItem()

```javascript
// Remover item específico
localStorage.removeItem('chave');

// Verificar remoção
console.log(localStorage.getItem('chave')); // null
```

### clear()

```javascript
// Remover TODOS os items
localStorage.clear();
sessionStorage.clear();

// Cuidado: clear() remove tudo do domínio atual
```

### key() e length

```javascript
// Número de items
console.log(localStorage.length); // 3

// Obter chave por índice
for (let i = 0; i < localStorage.length; i++) {
  const chave = localStorage.key(i);
  const valor = localStorage.getItem(chave);
  console.log(`${chave}: ${valor}`);
}
```

### Iterar Storage

```javascript
// Método 1: for loop
for (let i = 0; i < localStorage.length; i++) {
  const chave = localStorage.key(i);
  console.log(chave, localStorage.getItem(chave));
}

// Método 2: Object.keys
Object.keys(localStorage).forEach(chave => {
  console.log(chave, localStorage.getItem(chave));
});

// Método 3: for...in
for (const chave in localStorage) {
  // Ignorar propriedades do prototype
  if (localStorage.hasOwnProperty(chave)) {
    console.log(chave, localStorage.getItem(chave));
  }
}
```

## 🧠 Armazenando Objetos

### JSON.stringify() / JSON.parse()

```javascript
// ❌ Objetos não são armazenados diretamente
const usuario = { nome: 'João', idade: 25 };
localStorage.setItem('usuario', usuario);
console.log(localStorage.getItem('usuario')); // '[object Object]' (errado!)

// ✅ Serializar com JSON.stringify
localStorage.setItem('usuario', JSON.stringify(usuario));

// Recuperar e deserializar
const usuarioRecuperado = JSON.parse(localStorage.getItem('usuario'));
console.log(usuarioRecuperado.nome); // 'João'
```

### Helper Functions

```javascript
const storage = {
  set(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      console.error('Erro ao salvar:', erro);
      return false;
    }
  },

  get(chave, valorPadrao = null) {
    try {
      const item = localStorage.getItem(chave);
      return item ? JSON.parse(item) : valorPadrao;
    } catch (erro) {
      console.error('Erro ao recuperar:', erro);
      return valorPadrao;
    }
  },

  remove(chave) {
    localStorage.removeItem(chave);
  },

  clear() {
    localStorage.clear();
  }
};

// Uso
storage.set('usuario', { nome: 'Maria', idade: 30 });
const usuario = storage.get('usuario');
console.log(usuario.nome); // 'Maria'
```

## 🔍 localStorage vs sessionStorage

### Diferenças Principais

```javascript
// localStorage: persiste indefinidamente
localStorage.setItem('config', 'valor');
// Fecha aba, reinicia navegador, etc.
// localStorage.getItem('config') // 'valor' (ainda existe)

// sessionStorage: persiste apenas na sessão (aba)
sessionStorage.setItem('temporario', 'valor');
// Fecha aba
// sessionStorage.getItem('temporario') // null (apagado)

// sessionStorage: isolado por aba
// Aba 1
sessionStorage.setItem('dados', 'A');
// Aba 2 (mesmo domínio)
console.log(sessionStorage.getItem('dados')); // null (aba diferente)

// localStorage: compartilhado entre abas
// Aba 1
localStorage.setItem('dados', 'B');
// Aba 2 (mesmo domínio)
console.log(localStorage.getItem('dados')); // 'B' (compartilhado)
```

### Quando Usar Cada Um

```javascript
// ✅ localStorage: configurações, preferências, cache
localStorage.setItem('tema', 'escuro');
localStorage.setItem('idioma', 'pt-BR');
localStorage.setItem('cacheAPI', JSON.stringify(dados));

// ✅ sessionStorage: dados temporários, wizard multi-etapa
sessionStorage.setItem('etapaAtual', '3');
sessionStorage.setItem('dadosFormulario', JSON.stringify(form));
sessionStorage.setItem('tokenSessao', 'temp-token');
```

## ⚠️ Limitações e Considerações

### Quota de Armazenamento

```javascript
// ~5-10MB por domínio (varia por browser)
// QuotaExceededError se exceder

try {
  localStorage.setItem('dadosGrandes', 'A'.repeat(10 * 1024 * 1024));
} catch (erro) {
  if (erro.name === 'QuotaExceededError') {
    console.log('Storage cheio!');
  }
}

// Verificar espaço disponível (estimativa)
function calcularTamanho() {
  let tamanho = 0;
  for (const chave in localStorage) {
    if (localStorage.hasOwnProperty(chave)) {
      tamanho += localStorage.getItem(chave).length + chave.length;
    }
  }
  return tamanho; // bytes (aproximado)
}

console.log(`Uso: ${(calcularTamanho() / 1024).toFixed(2)} KB`);
```

### Apenas Strings

```javascript
// ⚠️ Apenas strings são armazenadas
localStorage.setItem('numero', 123);
const numero = localStorage.getItem('numero');
console.log(typeof numero); // 'string'
console.log(numero === 123); // false
console.log(numero === '123'); // true

// Converter de volta
const numeroConvertido = parseInt(numero, 10);
console.log(typeof numeroConvertido); // 'number'

// Boolean
localStorage.setItem('ativo', true);
const ativo = localStorage.getItem('ativo');
console.log(ativo === true); // false
console.log(ativo === 'true'); // true

// Converter
const ativoConvertido = ativo === 'true';
```

### Síncrono (Bloqueia Main Thread)

```javascript
// ⚠️ Operações são síncronas (podem bloquear UI)
// Evitar armazenar dados muito grandes frequentemente

// ❌ Ruim: salvar a cada keystroke
input.addEventListener('input', () => {
  localStorage.setItem('rascunho', input.value); // Síncrono, bloqueia
});

// ✅ Melhor: debounce
const salvarDebounced = debounce(() => {
  localStorage.setItem('rascunho', input.value);
}, 500);

input.addEventListener('input', salvarDebounced);
```

### Segurança

```javascript
// ❌ NÃO armazenar dados sensíveis sem criptografia
// localStorage é acessível por JavaScript no client
localStorage.setItem('senha', '12345'); // ❌ NUNCA!
localStorage.setItem('cartaoCredito', '1234...'); // ❌ NUNCA!

// ⚠️ Vulnerável a XSS
// Se site tem vulnerabilidade XSS, atacante pode ler localStorage

// ✅ Armazenar tokens com cuidado
// Considerar cookies HttpOnly para tokens de autenticação
```

### Escopo por Domínio/Protocolo/Porta

```javascript
// Isolado por origem (protocolo + domínio + porta)
// https://exemplo.com:443
// https://exemplo.com:8080 // Diferente!
// http://exemplo.com // Diferente!
// https://sub.exemplo.com // Diferente!

// Subdomínios não compartilham storage
```

## 🎯 Storage Event

### Sincronização entre Abas

```javascript
// Aba 1: modificar localStorage
localStorage.setItem('contador', '1');

// Aba 2: ouvir mudanças (apenas outras abas!)
window.addEventListener('storage', e => {
  console.log('Chave:', e.key);
  console.log('Valor antigo:', e.oldValue);
  console.log('Valor novo:', e.newValue);
  console.log('URL:', e.url);
  console.log('Storage:', e.storageArea); // localStorage ou sessionStorage

  // Atualizar UI baseado em mudança
  if (e.key === 'contador') {
    atualizarContador(e.newValue);
  }
});

// ⚠️ storage event NÃO dispara na aba que fez a modificação
// Apenas em outras abas/janelas do mesmo domínio
```

### Sincronizar Estado entre Abas

```javascript
// Aba 1
function atualizarEstado(estado) {
  localStorage.setItem('estadoApp', JSON.stringify(estado));
  aplicarEstado(estado); // Atualizar UI local
}

// Todas abas (incluindo Aba 1)
window.addEventListener('storage', e => {
  if (e.key === 'estadoApp' && e.newValue) {
    const estado = JSON.parse(e.newValue);
    aplicarEstado(estado); // Sincronizar UI
  }
});
```

## 🚀 Padrões Avançados

### Cache com Expiração

```javascript
const cache = {
  set(chave, valor, ttl = 3600000) { // ttl em ms (padrão: 1h)
    const item = {
      valor,
      expira: Date.now() + ttl
    };
    localStorage.setItem(chave, JSON.stringify(item));
  },

  get(chave) {
    const itemStr = localStorage.getItem(chave);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);

    // Verificar expiração
    if (Date.now() > item.expira) {
      localStorage.removeItem(chave);
      return null;
    }

    return item.valor;
  }
};

// Uso
cache.set('dadosAPI', { usuarios: [...] }, 5 * 60 * 1000); // 5 min
const dados = cache.get('dadosAPI');
```

### Namespace/Prefix

```javascript
class NamespacedStorage {
  constructor(namespace, storage = localStorage) {
    this.namespace = namespace;
    this.storage = storage;
  }

  _getKey(chave) {
    return `${this.namespace}:${chave}`;
  }

  set(chave, valor) {
    this.storage.setItem(this._getKey(chave), JSON.stringify(valor));
  }

  get(chave) {
    const item = this.storage.getItem(this._getKey(chave));
    return item ? JSON.parse(item) : null;
  }

  remove(chave) {
    this.storage.removeItem(this._getKey(chave));
  }

  clear() {
    // Remover apenas items deste namespace
    Object.keys(this.storage).forEach(chave => {
      if (chave.startsWith(`${this.namespace}:`)) {
        this.storage.removeItem(chave);
      }
    });
  }
}

// Uso: múltiplos namespaces no mesmo storage
const appStorage = new NamespacedStorage('meuApp');
const userStorage = new NamespacedStorage('usuario');

appStorage.set('config', { tema: 'escuro' });
userStorage.set('config', { nome: 'João' });

// localStorage:
// 'meuApp:config' → '{"tema":"escuro"}'
// 'usuario:config' → '{"nome":"João"}'
```

### Reactive Storage

```javascript
class ReactiveStorage {
  constructor(storage = localStorage) {
    this.storage = storage;
    this.listeners = new Map();
  }

  set(chave, valor) {
    this.storage.setItem(chave, JSON.stringify(valor));
    this._notify(chave, valor);
  }

  get(chave) {
    const item = this.storage.getItem(chave);
    return item ? JSON.parse(item) : null;
  }

  subscribe(chave, callback) {
    if (!this.listeners.has(chave)) {
      this.listeners.set(chave, new Set());
    }
    this.listeners.get(chave).add(callback);

    // Retornar unsubscribe
    return () => {
      this.listeners.get(chave).delete(callback);
    };
  }

  _notify(chave, valor) {
    if (this.listeners.has(chave)) {
      this.listeners.get(chave).forEach(callback => callback(valor));
    }
  }
}

// Uso
const store = new ReactiveStorage();

const unsubscribe = store.subscribe('usuario', usuario => {
  console.log('Usuário mudou:', usuario);
});

store.set('usuario', { nome: 'João' });
// 'Usuário mudou: { nome: "João" }'

unsubscribe(); // Parar de ouvir
```

### Migration/Versioning

```javascript
const VERSAO_STORAGE = 2;

function migrarStorage() {
  const versaoAtual = parseInt(localStorage.getItem('versaoStorage') || '0');

  if (versaoAtual < VERSAO_STORAGE) {
    console.log(`Migrando de v${versaoAtual} para v${VERSAO_STORAGE}`);

    // Migrations
    if (versaoAtual < 1) {
      // Migration v0 → v1
      const configAntiga = localStorage.getItem('config');
      if (configAntiga) {
        const configNova = transformarConfig(configAntiga);
        localStorage.setItem('configuracao', configNova);
        localStorage.removeItem('config');
      }
    }

    if (versaoAtual < 2) {
      // Migration v1 → v2
      // ...
    }

    localStorage.setItem('versaoStorage', String(VERSAO_STORAGE));
  }
}

migrarStorage();
```

Web Storage API fornece persistência simples e eficaz no client-side, ideal para configurações, cache e dados temporários, com atenção a limitações de quota, segurança e performance.
