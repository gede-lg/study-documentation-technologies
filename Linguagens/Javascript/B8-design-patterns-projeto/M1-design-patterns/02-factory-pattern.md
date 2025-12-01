# Factory Pattern: Criação de Objetos por Fábrica

## 🎯 Definição

**Factory Pattern** encapsula lógica de criação de objetos em uma função ou classe dedicada, permitindo criar instâncias de diferentes tipos sem expor a lógica de instanciação ao código cliente. Promove desacoplamento ao abstrair o processo de criação, facilitando manutenção e extensão quando novos tipos são adicionados.

```javascript
// Factory function
function criarVeiculo(tipo) {
  if (tipo === 'carro') {
    return {
      tipo: 'carro',
      rodas: 4,
      mover() {
        console.log('Carro se movendo na estrada');
      }
    };
  }

  if (tipo === 'moto') {
    return {
      tipo: 'moto',
      rodas: 2,
      mover() {
        console.log('Moto se movendo na estrada');
      }
    };
  }

  throw new Error(`Tipo de veículo desconhecido: ${tipo}`);
}

// Uso
const carro = criarVeiculo('carro');
const moto = criarVeiculo('moto');

carro.mover(); // 'Carro se movendo na estrada'
moto.mover();  // 'Moto se movendo na estrada'
```

**Conceito:** Delegar criação de objetos a função/classe especializada.

## 📋 Tipos de Factory

### Simple Factory (Factory Function)

```javascript
// Factory simples com função
function criarUsuario(tipo, dados) {
  const baseUsuario = {
    id: Math.random(),
    criadoEm: new Date(),
    ativo: true
  };

  if (tipo === 'admin') {
    return {
      ...baseUsuario,
      ...dados,
      tipo: 'admin',
      permissoes: ['ler', 'escrever', 'deletar', 'administrar']
    };
  }

  if (tipo === 'editor') {
    return {
      ...baseUsuario,
      ...dados,
      tipo: 'editor',
      permissoes: ['ler', 'escrever', 'editar']
    };
  }

  if (tipo === 'leitor') {
    return {
      ...baseUsuario,
      ...dados,
      tipo: 'leitor',
      permissoes: ['ler']
    };
  }

  throw new Error(`Tipo de usuário inválido: ${tipo}`);
}

// Uso
const admin = criarUsuario('admin', { nome: 'João', email: 'joao@email.com' });
const editor = criarUsuario('editor', { nome: 'Maria', email: 'maria@email.com' });
```

### Factory com Classes

```javascript
// Classes de produtos
class Carro {
  constructor(modelo, ano) {
    this.tipo = 'carro';
    this.modelo = modelo;
    this.ano = ano;
    this.rodas = 4;
  }

  acelerar() {
    console.log(`${this.modelo} acelerando`);
  }
}

class Moto {
  constructor(modelo, ano) {
    this.tipo = 'moto';
    this.modelo = modelo;
    this.ano = ano;
    this.rodas = 2;
  }

  acelerar() {
    console.log(`${this.modelo} acelerando`);
  }
}

// Factory
class VeiculoFactory {
  static criar(tipo, modelo, ano) {
    switch (tipo) {
      case 'carro':
        return new Carro(modelo, ano);
      case 'moto':
        return new Moto(modelo, ano);
      default:
        throw new Error(`Tipo desconhecido: ${tipo}`);
    }
  }
}

// Uso
const carro = VeiculoFactory.criar('carro', 'Civic', 2024);
const moto = VeiculoFactory.criar('moto', 'CB500', 2024);
```

### Factory com Registro Dinâmico

```javascript
// Factory extensível
class ComponenteFactory {
  constructor() {
    this.componentes = new Map();
  }

  registrar(tipo, classe) {
    this.componentes.set(tipo, classe);
  }

  criar(tipo, props) {
    const ComponenteClasse = this.componentes.get(tipo);

    if (!ComponenteClasse) {
      throw new Error(`Componente não registrado: ${tipo}`);
    }

    return new ComponenteClasse(props);
  }
}

// Classes de componentes
class Botao {
  constructor(props) {
    this.texto = props.texto;
    this.cor = props.cor || 'azul';
  }

  renderizar() {
    return `<button style="color: ${this.cor}">${this.texto}</button>`;
  }
}

class Input {
  constructor(props) {
    this.placeholder = props.placeholder;
    this.tipo = props.tipo || 'text';
  }

  renderizar() {
    return `<input type="${this.tipo}" placeholder="${this.placeholder}">`;
  }
}

// Uso
const factory = new ComponenteFactory();
factory.registrar('botao', Botao);
factory.registrar('input', Input);

const botao = factory.criar('botao', { texto: 'Clique aqui', cor: 'verde' });
const input = factory.criar('input', { placeholder: 'Digite seu nome' });

console.log(botao.renderizar());
console.log(input.renderizar());

// Adicionar novos tipos dinamicamente
class Checkbox {
  constructor(props) {
    this.label = props.label;
    this.checked = props.checked || false;
  }

  renderizar() {
    const checked = this.checked ? 'checked' : '';
    return `<input type="checkbox" ${checked}> ${this.label}`;
  }
}

factory.registrar('checkbox', Checkbox);
const checkbox = factory.criar('checkbox', { label: 'Aceitar termos' });
```

## 🧠 Factory Method Pattern

### Factory Method (GoF)

```javascript
// Classe base abstrata
class DialogoFactory {
  criarBotao() {
    throw new Error('Método criarBotao() deve ser implementado');
  }

  renderizar() {
    const botao = this.criarBotao();
    return `<div class="dialogo">${botao.renderizar()}</div>`;
  }
}

// Factories concretas
class DialogoWindows extends DialogoFactory {
  criarBotao() {
    return {
      renderizar() {
        return '<button class="win-button">OK</button>';
      }
    };
  }
}

class DialogoMacOS extends DialogoFactory {
  criarBotao() {
    return {
      renderizar() {
        return '<button class="mac-button">OK</button>';
      }
    };
  }
}

class DialogoLinux extends DialogoFactory {
  criarBotao() {
    return {
      renderizar() {
        return '<button class="linux-button">OK</button>';
      }
    };
  }
}

// Uso
function obterDialogo(plataforma) {
  switch (plataforma) {
    case 'windows':
      return new DialogoWindows();
    case 'macos':
      return new DialogoMacOS();
    case 'linux':
      return new DialogoLinux();
    default:
      throw new Error(`Plataforma desconhecida: ${plataforma}`);
  }
}

const dialogo = obterDialogo('windows');
console.log(dialogo.renderizar());
```

## 🔍 Casos de Uso

### Factory para Estratégias de Pagamento

```javascript
class PagamentoCartao {
  constructor(dados) {
    this.numero = dados.numero;
    this.cvv = dados.cvv;
  }

  processar(valor) {
    console.log(`Processando pagamento de R$${valor} com cartão ${this.numero}`);
    return { sucesso: true, transacaoId: Math.random() };
  }
}

class PagamentoPix {
  constructor(dados) {
    this.chave = dados.chave;
  }

  processar(valor) {
    console.log(`Gerando QR Code Pix de R$${valor} para chave ${this.chave}`);
    return { sucesso: true, qrCode: 'data:image/png;base64,...' };
  }
}

class PagamentoBoleto {
  constructor(dados) {
    this.vencimento = dados.vencimento;
  }

  processar(valor) {
    console.log(`Gerando boleto de R$${valor} com vencimento ${this.vencimento}`);
    return { sucesso: true, codigoBarras: '123456789...' };
  }
}

// Factory
class PagamentoFactory {
  static criar(metodo, dados) {
    const metodos = {
      'cartao': PagamentoCartao,
      'pix': PagamentoPix,
      'boleto': PagamentoBoleto
    };

    const ClassePagamento = metodos[metodo];

    if (!ClassePagamento) {
      throw new Error(`Método de pagamento inválido: ${metodo}`);
    }

    return new ClassePagamento(dados);
  }
}

// Uso
const pagamento = PagamentoFactory.criar('pix', { chave: 'email@exemplo.com' });
const resultado = pagamento.processar(100.50);
```

### Factory para Validadores

```javascript
// Validadores
class ValidadorEmail {
  validar(valor) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      valido: regex.test(valor),
      mensagem: regex.test(valor) ? null : 'Email inválido'
    };
  }
}

class ValidadorCPF {
  validar(valor) {
    // Lógica simplificada
    const cpfLimpo = valor.replace(/\D/g, '');
    const valido = cpfLimpo.length === 11;

    return {
      valido,
      mensagem: valido ? null : 'CPF inválido'
    };
  }
}

class ValidadorTelefone {
  validar(valor) {
    const regex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/;
    return {
      valido: regex.test(valor),
      mensagem: regex.test(valor) ? null : 'Telefone inválido'
    };
  }
}

// Factory
class ValidadorFactory {
  static criar(tipo) {
    const validadores = {
      'email': ValidadorEmail,
      'cpf': ValidadorCPF,
      'telefone': ValidadorTelefone
    };

    const ClasseValidador = validadores[tipo];

    if (!ClasseValidador) {
      throw new Error(`Validador não encontrado: ${tipo}`);
    }

    return new ClasseValidador();
  }
}

// Uso
function validarCampo(tipo, valor) {
  const validador = ValidadorFactory.criar(tipo);
  return validador.validar(valor);
}

console.log(validarCampo('email', 'teste@email.com')); // { valido: true, mensagem: null }
console.log(validarCampo('cpf', '123.456.789-00'));    // { valido: true, mensagem: null }
```

### Factory para Notificações

```javascript
class NotificacaoEmail {
  constructor(config) {
    this.para = config.para;
    this.smtp = config.smtp;
  }

  enviar(mensagem) {
    console.log(`Enviando email para ${this.para}: ${mensagem}`);
    // Lógica de envio via SMTP
  }
}

class NotificacaoSMS {
  constructor(config) {
    this.telefone = config.telefone;
    this.apiKey = config.apiKey;
  }

  enviar(mensagem) {
    console.log(`Enviando SMS para ${this.telefone}: ${mensagem}`);
    // Lógica de envio via API SMS
  }
}

class NotificacaoPush {
  constructor(config) {
    this.deviceToken = config.deviceToken;
  }

  enviar(mensagem) {
    console.log(`Enviando push notification: ${mensagem}`);
    // Lógica de envio via FCM/APNS
  }
}

class NotificacaoSlack {
  constructor(config) {
    this.webhook = config.webhook;
  }

  enviar(mensagem) {
    console.log(`Enviando para Slack: ${mensagem}`);
    // Lógica de envio via Webhook
  }
}

// Factory
class NotificacaoFactory {
  static criar(canal, config) {
    const canais = {
      'email': NotificacaoEmail,
      'sms': NotificacaoSMS,
      'push': NotificacaoPush,
      'slack': NotificacaoSlack
    };

    const ClasseNotificacao = canais[canal];

    if (!ClasseNotificacao) {
      throw new Error(`Canal de notificação inválido: ${canal}`);
    }

    return new ClasseNotificacao(config);
  }

  static criarMultiplos(canais, configs) {
    return canais.map((canal, index) => {
      return this.criar(canal, configs[index]);
    });
  }
}

// Uso
const notificacao = NotificacaoFactory.criar('email', {
  para: 'usuario@email.com',
  smtp: 'smtp.gmail.com'
});

notificacao.enviar('Olá! Você tem uma nova mensagem.');

// Enviar para múltiplos canais
const notificacoes = NotificacaoFactory.criarMultiplos(
  ['email', 'sms', 'push'],
  [
    { para: 'usuario@email.com' },
    { telefone: '11999999999' },
    { deviceToken: 'abc123...' }
  ]
);

notificacoes.forEach(n => n.enviar('Notificação importante!'));
```

### Factory para Parsers

```javascript
class ParserJSON {
  parsear(conteudo) {
    return JSON.parse(conteudo);
  }
}

class ParserXML {
  parsear(conteudo) {
    const parser = new DOMParser();
    return parser.parseFromString(conteudo, 'text/xml');
  }
}

class ParserCSV {
  parsear(conteudo) {
    const linhas = conteudo.split('\n');
    const cabecalho = linhas[0].split(',');

    return linhas.slice(1).map(linha => {
      const valores = linha.split(',');
      return cabecalho.reduce((obj, chave, i) => {
        obj[chave.trim()] = valores[i]?.trim();
        return obj;
      }, {});
    });
  }
}

class ParserYAML {
  parsear(conteudo) {
    // Implementação simplificada
    console.log('Parseando YAML:', conteudo);
    return {}; // Retornaria objeto parseado
  }
}

// Factory
class ParserFactory {
  static criar(formato) {
    const parsers = {
      'json': ParserJSON,
      'xml': ParserXML,
      'csv': ParserCSV,
      'yaml': ParserYAML
    };

    const ClasseParser = parsers[formato];

    if (!ClasseParser) {
      throw new Error(`Parser não suportado: ${formato}`);
    }

    return new ClasseParser();
  }

  static parsearArquivo(nomeArquivo, conteudo) {
    const extensao = nomeArquivo.split('.').pop().toLowerCase();
    const parser = this.criar(extensao);
    return parser.parsear(conteudo);
  }
}

// Uso
const dados = ParserFactory.parsearArquivo('dados.json', '{"nome": "João"}');
console.log(dados); // { nome: 'João' }
```

## ⚠️ Quando Usar vs Evitar

### ✅ Usar Factory Quando:

```javascript
// 1. Lógica de criação complexa
function criarRelatorio(tipo, dados) {
  // Lógica complexa de criação
  const relatorio = {};

  if (tipo === 'financeiro') {
    relatorio.calculos = calcularFinancas(dados);
    relatorio.graficos = gerarGraficosFinanceiros(dados);
    relatorio.formatacao = 'monetaria';
  }

  // ... muita lógica adicional
  return relatorio;
}

// 2. Múltiplos tipos relacionados
// 3. Criação baseada em configuração
// 4. Necessidade de extensibilidade
```

### ❌ Evitar Factory Quando:

```javascript
// 1. Criação trivial (use construtor direto)
// ❌ Desnecessário
function criarPonto(x, y) {
  return { x, y };
}

// ✅ Melhor: literal ou classe simples
const ponto = { x: 10, y: 20 };

// 2. Apenas um tipo de objeto
// ❌ Over-engineering
class UsuarioFactory {
  static criar(nome) {
    return new Usuario(nome);
  }
}

// ✅ Melhor: usar construtor diretamente
const usuario = new Usuario('João');
```

## 🚀 Factory Avançado

### Factory com Builder Pattern

```javascript
class QueryBuilder {
  constructor() {
    this.query = '';
    this.parametros = [];
  }

  select(...campos) {
    this.query = `SELECT ${campos.join(', ')}`;
    return this;
  }

  from(tabela) {
    this.query += ` FROM ${tabela}`;
    return this;
  }

  where(condicao, ...valores) {
    this.query += ` WHERE ${condicao}`;
    this.parametros.push(...valores);
    return this;
  }

  build() {
    return { query: this.query, parametros: this.parametros };
  }
}

// Factory para diferentes tipos de queries
class QueryFactory {
  static criarSelect(tabela, campos = ['*']) {
    return new QueryBuilder().select(...campos).from(tabela);
  }

  static criarSelectComFiltro(tabela, condicao, valores) {
    return new QueryBuilder()
      .select('*')
      .from(tabela)
      .where(condicao, ...valores);
  }
}

// Uso
const query1 = QueryFactory.criarSelect('usuarios', ['id', 'nome', 'email']).build();
const query2 = QueryFactory.criarSelectComFiltro('usuarios', 'idade > ?', [18]).build();
```

Factory Pattern é fundamental para criar código extensível e desacoplado, abstraindo complexidade de criação e permitindo adicionar novos tipos sem modificar código existente (Open/Closed Principle).
