# Convenções de Nomenclatura em OOP JavaScript

## 🎯 Convenções Essenciais

### PascalCase para Constructors

```javascript
// ✅ Correto - PascalCase (primeira letra maiúscula)
function Usuario(nome) {
  this.nome = nome;
}

function ContaBancaria(titular) {
  this.titular = titular;
}

// ❌ Incorreto - camelCase (parece função regular)
function usuario(nome) { // Confuso!
  this.nome = nome;
}
```

**Razão:** Distinguir visualmente constructors de funções regulares.

### camelCase para Métodos e Propriedades

```javascript
function Produto(nome, preco) {
  // Propriedades: camelCase
  this.nome = nome;
  this.precoUnitario = preco;
  this.estoque Disponivel = 0;
}

// Métodos: camelCase
Produto.prototype.calcularValorTotal = function() {
  return this.precoUnitario * this.estoqueDisponivel;
};

Produto.prototype.adicionarEstoque = function(quantidade) {
  this.estoqueDisponivel += quantidade;
};
```

### Underscore para "Privado"

```javascript
function Usuario(nome) {
  // Propriedade "privada" (convenção, não força privacidade)
  this._senha = '123';

  // Propriedade pública
  this.nome = nome;
}

Usuario.prototype._criptografar = function(texto) {
  // Método "privado" (convenção)
  return texto.split('').reverse().join('');
};

Usuario.prototype.autenticar = function(senha) {
  // Método público que usa método "privado"
  return this._criptografar(senha) === this._senha;
};

const user = new Usuario('João');
console.log(user.nome); // OK (público)
console.log(user._senha); // Possível, mas convenção diz "não use"
```

### UPPER_CASE para Constantes

```javascript
function Configuracao() {
  // Constantes (valores que não devem mudar)
  this.MAX_TENTATIVAS = 3;
  this.TIMEOUT_MS = 5000;
  this.VERSAO_API = '1.0';
}

Configuracao.prototype.STATUS_CODES = {
  SUCESSO: 200,
  NAO_ENCONTRADO: 404,
  ERRO_SERVIDOR: 500
};
```

## 📋 Resumo das Convenções

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| **Constructor** | PascalCase | `Usuario`, `ContaBancaria` |
| **Propriedade** | camelCase | `nome`, `precoTotal` |
| **Método** | camelCase | `calcular()`, `obterDados()` |
| **"Privado"** | _underscore | `_senha`, `_validar()` |
| **Constante** | UPPER_CASE | `MAX_VALOR`, `TIMEOUT` |

## 🔗 Importância

Essas convenções:
- **Comunicam intenção** do código
- **Facilitam leitura** e manutenção
- **Reduzem erros** (ex: lembrar de usar `new`)
- **Padronizam código** entre desenvolvedores

Seguir convenções é essencial para código JavaScript profissional e legível.
