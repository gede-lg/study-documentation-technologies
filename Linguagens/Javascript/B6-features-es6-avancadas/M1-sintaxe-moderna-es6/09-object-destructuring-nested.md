# Object Destructuring - Nested Destructuring: Análise Conceitual

## 🎯 Definição

**Nested Destructuring** (desestruturação aninhada) de objetos permite extrair valores de **objetos aninhados profundamente** em uma única expressão, navegando através de múltiplos níveis de propriedades sem necessidade de atribuições intermediárias.

```javascript
const usuario = {
  nome: 'João',
  endereco: {
    cidade: 'São Paulo',
    coordenadas: {
      lat: -23.5505,
      lng: -46.6333
    }
  }
};

const {
  nome,
  endereco: {
    cidade,
    coordenadas: { lat, lng }
  }
} = usuario;

console.log(nome);   // 'João'
console.log(cidade); // 'São Paulo'
console.log(lat);    // -23.5505
console.log(lng);    // -46.6333
```

**Conceito:** Desestruturar recursivamente objetos aninhados usando padrões que espelham a estrutura.

## 📋 Sintaxe

```javascript
const {
  prop1,
  prop2: {
    subprop1,
    subprop2: {
      subsubprop
    }
  }
} = objeto;
```

## 🧠 Fundamentos

### Pattern Matching Hierárquico

```javascript
const dados = {
  usuario: {
    nome: 'Maria',
    contato: {
      email: 'maria@email.com',
      telefone: '1234-5678'
    }
  }
};

const {
  usuario: {
    nome,
    contato: { email, telefone }
  }
} = dados;

console.log(nome);     // 'Maria'
console.log(email);    // 'maria@email.com'
console.log(telefone); // '1234-5678'

// Nota: 'usuario' e 'contato' NÃO são variáveis
console.log(usuario);  // ReferenceError
console.log(contato);  // ReferenceError
```

### Acessar Nível Intermediário

```javascript
const dados = {
  perfil: {
    nome: 'João',
    idade: 30
  }
};

// Extrair objeto intermediário E propriedades
const {
  perfil,
  perfil: { nome, idade }
} = dados;

console.log(perfil); // { nome: 'João', idade: 30 }
console.log(nome);   // 'João'
console.log(idade);  // 30
```

## 🔍 Casos de Uso

### APIs Profundas

```javascript
async function buscarClima(cidade) {
  const resposta = await fetch(`/api/clima/${cidade}`);
  const dados = await resposta.json();

  const {
    nome: nomeCidade,
    clima: {
      temperatura: { atual, min, max },
      condicao: { descricao, icone }
    }
  } = dados;

  return { nomeCidade, atual, min, max, descricao, icone };
}
```

### Configurações Hierárquicas

```javascript
const config = {
  servidor: {
    porta: 3000,
    host: 'localhost',
    ssl: {
      ativo: true,
      certificado: '/path/cert.pem',
      chave: '/path/key.pem'
    }
  },
  database: {
    host: 'db.exemplo.com',
    porta: 5432,
    credenciais: {
      usuario: 'admin',
      senha: 'secret'
    }
  }
};

const {
  servidor: {
    porta: portaServidor,
    ssl: { ativo: sslAtivo, certificado }
  },
  database: {
    host: dbHost,
    credenciais: { usuario: dbUser }
  }
} = config;
```

### GraphQL Queries

```javascript
const resposta = {
  data: {
    usuario: {
      id: 1,
      nome: 'João',
      posts: [
        {
          id: 10,
          titulo: 'Primeiro Post',
          autor: {
            nome: 'João'
          }
        }
      ]
    }
  }
};

const {
  data: {
    usuario: {
      nome: nomeUsuario,
      posts: [{ titulo, autor: { nome: nomeAutor } }]
    }
  }
} = resposta;
```

## ⚠️ Armadilhas

### Propriedade Inexistente Intermediária

```javascript
const obj = {
  a: {
    // b não existe
  }
};

// ❌ ERRO: tentando desestruturar undefined
const {
  a: {
    b: { c }
  }
} = obj; // TypeError: Cannot destructure property 'c' of 'undefined'

// ✅ Default no nível intermediário
const {
  a: {
    b: { c } = {}
  } = {}
} = obj;

console.log(c); // undefined
```

### Nested + Default + Renaming

```javascript
const dados = {
  usuario: {
    nome: 'Ana'
  }
};

const {
  usuario: {
    nome: nomeCompleto,
    idade: idadeUsuario = 18,
    cidade: cidadeUsuario = 'SP'
  } = {}
} = dados;

console.log(nomeCompleto);  // 'Ana'
console.log(idadeUsuario);  // 18 (default)
console.log(cidadeUsuario); // 'SP' (default)
```

Nested destructuring é poderoso para extrair dados de estruturas complexas como respostas de APIs, configurações hierárquicas e resultados de GraphQL, tornando o acesso a propriedades profundas declarativo e conciso.
