# IndexedDB: Fundamentos de Banco de Dados Client-Side

## 🎯 Definição

**IndexedDB** é uma API de banco de dados NoSQL assíncrona no navegador, permitindo armazenar grandes volumes de dados estruturados (objetos, blobs, arquivos) com suporte a índices, transações e queries. Diferente de localStorage (key-value simples, ~5MB), IndexedDB oferece ~50MB+ de espaço, operações assíncronas não-bloqueantes e performance superior para dados complexos.

```javascript
// Abrir banco de dados
const request = indexedDB.open('MeuBanco', 1);

request.onsuccess = e => {
  const db = e.target.result;
  console.log('Banco aberto:', db.name);
};

request.onerror = e => {
  console.error('Erro ao abrir banco:', e.target.error);
};
```

**Conceito:** Banco de dados NoSQL assíncrono no navegador com transações e índices.

## 📋 Conceitos Fundamentais

### Database (Banco)

```javascript
// Banco de dados: container de object stores
// Cada origem (domínio) pode ter múltiplos bancos

const request = indexedDB.open('MeuBanco', 1); // nome, versão

request.onsuccess = e => {
  const db = e.target.result;
  console.log(db.name);    // 'MeuBanco'
  console.log(db.version); // 1
};
```

### Object Stores (Tabelas)

```javascript
// Object Store: equivalente a "tabela" em SQL
// Armazena objetos JavaScript

request.onupgradeneeded = e => {
  const db = e.target.result;

  // Criar object store
  const store = db.createObjectStore('usuarios', {
    keyPath: 'id',    // Propriedade usada como chave primária
    autoIncrement: true // Auto-incrementar chave se não fornecida
  });

  console.log('Object store "usuarios" criado');
};
```

### Índices

```javascript
request.onupgradeneeded = e => {
  const db = e.target.result;
  const store = db.createObjectStore('usuarios', { keyPath: 'id' });

  // Criar índice por email (único)
  store.createIndex('email', 'email', { unique: true });

  // Criar índice por idade (não único)
  store.createIndex('idade', 'idade', { unique: false });

  // Índice permite buscar por propriedade que não é chave
};
```

### Transações

```javascript
// Todas operações ocorrem em transações
const transacao = db.transaction(['usuarios'], 'readwrite');

// Modos:
// - 'readonly': apenas leitura (padrão)
// - 'readwrite': leitura e escrita

const store = transacao.objectStore('usuarios');

// Operação na transação
store.add({ nome: 'João', email: 'joao@email.com' });

// Evento de conclusão
transacao.oncomplete = () => {
  console.log('Transação completa');
};

transacao.onerror = e => {
  console.error('Erro na transação:', e.target.error);
};
```

## 🧠 Operações CRUD

### Criar Banco e Schema

```javascript
const request = indexedDB.open('MeuBanco', 1);

request.onupgradeneeded = e => {
  const db = e.target.result;

  // Verificar se store já existe
  if (!db.objectStoreNames.contains('usuarios')) {
    const store = db.createObjectStore('usuarios', {
      keyPath: 'id',
      autoIncrement: true
    });

    store.createIndex('email', 'email', { unique: true });
    store.createIndex('idade', 'idade', { unique: false });
  }
};

request.onsuccess = e => {
  const db = e.target.result;
  console.log('Banco pronto para uso');
};

request.onerror = e => {
  console.error('Erro:', e.target.error);
};
```

### Create (Adicionar)

```javascript
function adicionarUsuario(db, usuario) {
  return new Promise((resolve, reject) => {
    const transacao = db.transaction(['usuarios'], 'readwrite');
    const store = transacao.objectStore('usuarios');

    const request = store.add(usuario);

    request.onsuccess = e => {
      resolve(e.target.result); // Retorna chave do item adicionado
    };

    request.onerror = e => {
      reject(e.target.error);
    };
  });
}

// Uso
adicionarUsuario(db, { nome: 'Maria', email: 'maria@email.com', idade: 25 })
  .then(id => console.log('Usuário adicionado com ID:', id))
  .catch(erro => console.error('Erro:', erro));
```

### Read (Ler)

```javascript
// Ler por chave primária
function obterUsuario(db, id) {
  return new Promise((resolve, reject) => {
    const transacao = db.transaction(['usuarios'], 'readonly');
    const store = transacao.objectStore('usuarios');

    const request = store.get(id);

    request.onsuccess = e => {
      resolve(e.target.result); // Objeto ou undefined
    };

    request.onerror = e => {
      reject(e.target.error);
    };
  });
}

// Uso
obterUsuario(db, 1)
  .then(usuario => console.log('Usuário:', usuario))
  .catch(erro => console.error('Erro:', erro));
```

### Read All (Todos)

```javascript
function obterTodosUsuarios(db) {
  return new Promise((resolve, reject) => {
    const transacao = db.transaction(['usuarios'], 'readonly');
    const store = transacao.objectStore('usuarios');

    const request = store.getAll();

    request.onsuccess = e => {
      resolve(e.target.result); // Array de objetos
    };

    request.onerror = e => {
      reject(e.target.error);
    };
  });
}

// Uso
obterTodosUsuarios(db)
  .then(usuarios => console.log('Usuários:', usuarios))
  .catch(erro => console.error('Erro:', erro));
```

### Update (Atualizar)

```javascript
function atualizarUsuario(db, usuario) {
  return new Promise((resolve, reject) => {
    const transacao = db.transaction(['usuarios'], 'readwrite');
    const store = transacao.objectStore('usuarios');

    // put() atualiza se existe, adiciona se não existe
    const request = store.put(usuario);

    request.onsuccess = e => {
      resolve(e.target.result); // Chave do item
    };

    request.onerror = e => {
      reject(e.target.error);
    };
  });
}

// Uso: atualizar usuário com id = 1
atualizarUsuario(db, { id: 1, nome: 'João Silva', email: 'joao@email.com', idade: 26 })
  .then(() => console.log('Usuário atualizado'))
  .catch(erro => console.error('Erro:', erro));
```

### Delete (Remover)

```javascript
function removerUsuario(db, id) {
  return new Promise((resolve, reject) => {
    const transacao = db.transaction(['usuarios'], 'readwrite');
    const store = transacao.objectStore('usuarios');

    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = e => {
      reject(e.target.error);
    };
  });
}

// Uso
removerUsuario(db, 1)
  .then(() => console.log('Usuário removido'))
  .catch(erro => console.error('Erro:', erro));
```

## 🔍 Queries e Cursors

### Buscar por Índice

```javascript
function buscarPorEmail(db, email) {
  return new Promise((resolve, reject) => {
    const transacao = db.transaction(['usuarios'], 'readonly');
    const store = transacao.objectStore('usuarios');
    const index = store.index('email');

    const request = index.get(email);

    request.onsuccess = e => {
      resolve(e.target.result);
    };

    request.onerror = e => {
      reject(e.target.error);
    };
  });
}

// Uso
buscarPorEmail(db, 'maria@email.com')
  .then(usuario => console.log('Usuário:', usuario))
  .catch(erro => console.error('Erro:', erro));
```

### Cursor (Iterar)

```javascript
function listarUsuarios(db) {
  const transacao = db.transaction(['usuarios'], 'readonly');
  const store = transacao.objectStore('usuarios');

  const request = store.openCursor();

  request.onsuccess = e => {
    const cursor = e.target.result;

    if (cursor) {
      console.log('ID:', cursor.key);
      console.log('Valor:', cursor.value);

      cursor.continue(); // Próximo item
    } else {
      console.log('Fim da iteração');
    }
  };
}
```

### Range Queries

```javascript
// Buscar usuários com idade entre 20 e 30
function buscarPorIdade(db, min, max) {
  return new Promise((resolve, reject) => {
    const transacao = db.transaction(['usuarios'], 'readonly');
    const store = transacao.objectStore('usuarios');
    const index = store.index('idade');

    // Criar range
    const range = IDBKeyRange.bound(min, max);

    const request = index.getAll(range);

    request.onsuccess = e => {
      resolve(e.target.result);
    };

    request.onerror = e => {
      reject(e.target.error);
    };
  });
}

// Tipos de ranges:
// IDBKeyRange.only(valor)           - Exatamente igual
// IDBKeyRange.lowerBound(min)       - >= min
// IDBKeyRange.upperBound(max)       - <= max
// IDBKeyRange.bound(min, max)       - Entre min e max
```

## ⚠️ Versionamento e Migrations

### Upgrade Database

```javascript
// Aumentar versão dispara onupgradeneeded
const request = indexedDB.open('MeuBanco', 2); // v1 → v2

request.onupgradeneeded = e => {
  const db = e.target.result;
  const oldVersion = e.oldVersion;
  const newVersion = e.newVersion;

  console.log(`Upgrade: v${oldVersion} → v${newVersion}`);

  // Migration v0 → v1
  if (oldVersion < 1) {
    const store = db.createObjectStore('usuarios', { keyPath: 'id' });
    store.createIndex('email', 'email', { unique: true });
  }

  // Migration v1 → v2
  if (oldVersion < 2) {
    const transacao = e.target.transaction;
    const store = transacao.objectStore('usuarios');

    // Adicionar novo índice
    store.createIndex('cidade', 'cidade', { unique: false });
  }
};
```

### Remover Object Store

```javascript
request.onupgradeneeded = e => {
  const db = e.target.result;

  // Remover store antigo
  if (db.objectStoreNames.contains('usuariosAntigos')) {
    db.deleteObjectStore('usuariosAntigos');
  }

  // Criar novo
  db.createObjectStore('usuariosNovos', { keyPath: 'id' });
};
```

## 🎯 Wrapper com Promises

### Classe Helper

```javascript
class IndexedDBHelper {
  constructor(dbName, version, stores) {
    this.dbName = dbName;
    this.version = version;
    this.stores = stores; // { storeName: { keyPath, indexes } }
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = e => {
        const db = e.target.result;

        Object.entries(this.stores).forEach(([name, config]) => {
          if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, {
              keyPath: config.keyPath,
              autoIncrement: config.autoIncrement
            });

            config.indexes?.forEach(index => {
              store.createIndex(index.name, index.keyPath, {
                unique: index.unique || false
              });
            });
          }
        });
      };

      request.onsuccess = e => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = e => {
        reject(e.target.error);
      };
    });
  }

  async add(storeName, data) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = e => resolve(e.target.result);
      request.onerror = e => reject(e.target.error);
    });
  }

  async get(storeName, key) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = e => resolve(e.target.result);
      request.onerror = e => reject(e.target.error);
    });
  }

  async getAll(storeName) {
    const tx = this.db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = e => resolve(e.target.result);
      request.onerror = e => reject(e.target.error);
    });
  }

  async update(storeName, data) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = e => resolve(e.target.result);
      request.onerror = e => reject(e.target.error);
    });
  }

  async delete(storeName, key) {
    const tx = this.db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = e => reject(e.target.error);
    });
  }
}

// Uso
const db = new IndexedDBHelper('MeuBanco', 1, {
  usuarios: {
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'email', keyPath: 'email', unique: true },
      { name: 'idade', keyPath: 'idade' }
    ]
  }
});

await db.init();

await db.add('usuarios', { nome: 'João', email: 'joao@email.com', idade: 25 });
const usuario = await db.get('usuarios', 1);
const todos = await db.getAll('usuarios');
```

## 🚀 Casos de Uso

### Cache de API

```javascript
async function buscarComCache(url) {
  // Tentar cache primeiro
  const cached = await db.get('cache', url);

  if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hora
    return cached.dados;
  }

  // Buscar da API
  const resposta = await fetch(url);
  const dados = await resposta.json();

  // Salvar em cache
  await db.add('cache', {
    url,
    dados,
    timestamp: Date.now()
  });

  return dados;
}
```

### Offline-First Application

```javascript
// Salvar dados localmente
async function salvarPost(post) {
  await db.add('posts', { ...post, sincronizado: false });
  tentarSincronizar();
}

// Sincronizar quando online
async function tentarSincronizar() {
  if (!navigator.onLine) return;

  const postsPendentes = await db.getAllWhere('posts', 'sincronizado', false);

  for (const post of postsPendentes) {
    try {
      await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(post)
      });

      await db.update('posts', { ...post, sincronizado: true });
    } catch (erro) {
      console.error('Erro ao sincronizar:', erro);
    }
  }
}

window.addEventListener('online', tentarSincronizar);
```

IndexedDB é fundamental para Progressive Web Apps (PWAs), oferecendo armazenamento robusto, performático e escalável para aplicações que precisam funcionar offline ou manipular grandes volumes de dados estruturados no client-side.
