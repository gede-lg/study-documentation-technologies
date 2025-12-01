# Factory Pattern: Análise Conceitual

## 🎯 Definição

O **Factory Pattern** é um design pattern onde uma função cria e retorna objetos sem usar o operador `new`. É uma alternativa a constructors que oferece mais flexibilidade e controle sobre a criação de objetos.

```javascript
// Factory function
function criarPessoa(nome, idade) {
  return {
    nome: nome,
    idade: idade,
    apresentar: function() {
      return `Olá, sou ${this.nome} e tenho ${this.idade} anos`;
    }
  };
}

// Uso (sem 'new')
const pessoa1 = criarPessoa('João', 30);
const pessoa2 = criarPessoa('Maria', 25);

console.log(pessoa1.apresentar()); // 'Olá, sou João e tenho 30 anos'
```

## 📋 Factory vs Constructor

```javascript
// Constructor (necessita 'new')
function PessoaConstructor(nome) {
  this.nome = nome;
}

PessoaConstructor.prototype.falar = function() {
  return `${this.nome} falando`;
};

const p1 = new PessoaConstructor('Ana'); // Precisa de 'new'

// Factory (não necessita 'new')
function criarPessoa(nome) {
  return {
    nome: nome,
    falar: function() {
      return `${nome} falando`;
    }
  };
}

const p2 = criarPessoa('Carlos'); // Sem 'new'
```

## 🧠 Variações

### Factory Simples

```javascript
function criarContador(valorInicial) {
  let valor = valorInicial || 0;

  return {
    incrementar: function() {
      valor++;
      return valor;
    },
    decrementar: function() {
      valor--;
      return valor;
    },
    obter: function() {
      return valor;
    }
  };
}

const contador = criarContador(10);
console.log(contador.incrementar()); // 11
console.log(contador.obter()); // 11
```

### Factory com Privacidade

```javascript
function criarUsuario(nome, senha) {
  // Dados privados (closure)
  let senhaHash = senha; // Em produção, usar hash real

  // Interface pública
  return {
    nome: nome,

    autenticar: function(senhaFornecida) {
      return senhaFornecida === senhaHash;
    },

    alterarSenha: function(senhaAtual, novaSenha) {
      if (senhaAtual !== senhaHash) {
        throw new Error('Senha atual incorreta');
      }

      senhaHash = novaSenha;
      return true;
    }
  };
}

const user = criarUsuario('João', '123');
console.log(user.autenticar('123')); // true
console.log(user.senhaHash); // undefined (privado!)
```

### Factory com Herança (Composição)

```javascript
function criarAnimal(nome) {
  return {
    nome: nome,
    comer: function() {
      return `${this.nome} está comendo`;
    }
  };
}

function criarCachorro(nome, raca) {
  // Compor com animal
  const animal = criarAnimal(nome);

  // Adicionar comportamento específico
  return Object.assign(animal, {
    raca: raca,
    latir: function() {
      return `${this.nome} está latindo: Au au!`;
    }
  });
}

const rex = criarCachorro('Rex', 'Labrador');
console.log(rex.comer()); // 'Rex está comendo' (de Animal)
console.log(rex.latir()); // 'Rex está latindo: Au au!'
```

## 🔍 Exemplo Completo: Sistema de Produtos

```javascript
// Factory para criar produtos
function criarProduto(config) {
  // Validação
  if (!config.nome || !config.preco) {
    throw new Error('Nome e preço são obrigatórios');
  }

  // Estado privado
  let estoque = config.estoque || 0;
  let vendas = 0;

  // Objeto público
  return {
    id: config.id || Math.random().toString(36).substr(2, 9),
    nome: config.nome,
    preco: config.preco,
    categoria: config.categoria || 'Geral',

    adicionarEstoque: function(quantidade) {
      if (quantidade <= 0) {
        throw new Error('Quantidade deve ser positiva');
      }

      estoque += quantidade;
      return estoque;
    },

    vender: function(quantidade) {
      if (quantidade > estoque) {
        throw new Error('Estoque insuficiente');
      }

      estoque -= quantidade;
      vendas += quantidade;

      return {
        vendido: quantidade,
        estoqueRestante: estoque,
        valorTotal: quantidade * this.preco
      };
    },

    obterEstoque: function() {
      return estoque;
    },

    obterEstatisticas: function() {
      return {
        produto: this.nome,
        estoque: estoque,
        vendas: vendas,
        receita: vendas * this.preco
      };
    },

    aplicarDesconto: function(percentual) {
      if (percentual < 0 || percentual > 100) {
        throw new Error('Percentual inválido');
      }

      this.preco = this.preco * (1 - percentual / 100);
      return this.preco;
    }
  };
}

// Uso
const notebook = criarProduto({
  nome: 'Notebook Dell',
  preco: 3000,
  estoque: 10,
  categoria: 'Eletrônicos'
});

notebook.adicionarEstoque(5);
console.log(notebook.obterEstoque()); // 15

const venda = notebook.vender(3);
console.log(venda);
// { vendido: 3, estoqueRestante: 12, valorTotal: 9000 }

console.log(notebook.obterEstatisticas());
// { produto: 'Notebook Dell', estoque: 12, vendas: 3, receita: 9000 }

notebook.aplicarDesconto(10); // 10% off
console.log(notebook.preco); // 2700
```

### Factory com Diferentes Tipos

```javascript
function criarForma(tipo, opcoes) {
  const formas = {
    retangulo: function() {
      return {
        tipo: 'Retângulo',
        largura: opcoes.largura,
        altura: opcoes.altura,
        calcularArea: function() {
          return this.largura * this.altura;
        }
      };
    },

    circulo: function() {
      return {
        tipo: 'Círculo',
        raio: opcoes.raio,
        calcularArea: function() {
          return Math.PI * this.raio * this.raio;
        }
      };
    },

    triangulo: function() {
      return {
        tipo: 'Triângulo',
        base: opcoes.base,
        altura: opcoes.altura,
        calcularArea: function() {
          return (this.base * this.altura) / 2;
        }
      };
    }
  };

  const factoryFn = formas[tipo];

  if (!factoryFn) {
    throw new Error('Tipo de forma inválido');
  }

  return factoryFn();
}

// Criar diferentes formas com mesma factory
const ret = criarForma('retangulo', { largura: 10, altura: 5 });
const circ = criarForma('circulo', { raio: 7 });
const tri = criarForma('triangulo', { base: 8, altura: 6 });

console.log(ret.calcularArea()); // 50
console.log(circ.calcularArea().toFixed(2)); // 153.94
console.log(tri.calcularArea()); // 24
```

## ⚠️ Vantagens e Desvantagens

### Vantagens

- ✅ **Sem 'new':** Não precisa lembrar de usar `new`
- ✅ **Flexibilidade:** Pode retornar qualquer tipo de objeto
- ✅ **Privacidade:** Closures criam dados verdadeiramente privados
- ✅ **Simples:** Código direto e fácil de entender

### Desvantagens

- ❌ **Memória:** Métodos não são compartilhados (cada instância tem cópias)
- ❌ **instanceof:** Não funciona (objetos literais)
- ❌ **Prototype:** Não usa prototype chain

## 🔗 Quando Usar

**Use Factory quando:**
- Não precisa de herança prototípica
- Quer privacidade real de dados
- Simplicidade é mais importante que performance
- Está criando objetos simples/temporários

**Use Constructor quando:**
- Precisa de instanceof
- Quer compartilhar métodos via prototype
- Performance/memória é crítica
- Hierarquia de herança complexa

Factory Pattern oferece simplicidade e privacidade, sendo ideal para objetos que não precisam de herança complexa e onde clareza é prioritária.
