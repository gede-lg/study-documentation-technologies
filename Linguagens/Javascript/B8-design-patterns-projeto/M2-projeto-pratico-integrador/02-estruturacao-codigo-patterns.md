# Estruturação de Código e Escolha de Patterns

## 🎯 Objetivo

Definir arquitetura de código, escolher design patterns apropriados e estabelecer convenções que garantam manutenibilidade, escalabilidade e qualidade do projeto integrador.

## 📋 Arquitetura de Software

### Padrão MVC Adaptado para JavaScript

```
┌──────────────────────────────────────────────┐
│                   VIEW                        │
│  ┌────────────┐  ┌────────────┐             │
│  │ TarefaList │  │ TarefaForm │  ...         │
│  └────────────┘  └────────────┘             │
└──────────────┬───────────────────────────────┘
               │ eventos
┌──────────────▼───────────────────────────────┐
│                CONTROLLER                     │
│  ┌────────────────────────────────┐          │
│  │     TarefaController            │          │
│  │  - handleCriar()                │          │
│  │  - handleAtualizar()            │          │
│  │  - handleDeletar()              │          │
│  └────────────┬───────────────────┘          │
└───────────────┼──────────────────────────────┘
                │ métodos
┌───────────────▼──────────────────────────────┐
│                  MODEL                        │
│  ┌────────┐  ┌────────────┐                  │
│  │ Tarefa │  │   Service  │                  │
│  └────────┘  └────────────┘                  │
└───────────────┬──────────────────────────────┘
                │ persistência
┌───────────────▼──────────────────────────────┐
│             DATA LAYER                        │
│  ┌────────────────────────────────┐          │
│  │      StorageService             │          │
│  └────────────────────────────────┘          │
└──────────────────────────────────────────────┘
```

### Implementação da Arquitetura

#### Model Layer

```javascript
// src/models/Tarefa.js

/**
 * Classe que representa uma tarefa
 */
class Tarefa {
  constructor(dados = {}) {
    this.id = dados.id || this._gerarId();
    this.titulo = dados.titulo || '';
    this.descricao = dados.descricao || '';
    this.completa = dados.completa || false;
    this.categoria = dados.categoria || null;
    this.tags = dados.tags || [];
    this.dataVencimento = dados.dataVencimento ? new Date(dados.dataVencimento) : null;
    this.criadaEm = dados.criadaEm ? new Date(dados.criadaEm) : new Date();
    this.atualizadaEm = dados.atualizadaEm ? new Date(dados.atualizadaEm) : new Date();
  }

  _gerarId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  validar() {
    const erros = [];

    if (!this.titulo || this.titulo.trim().length === 0) {
      erros.push('Título é obrigatório');
    }

    if (this.titulo.length > 200) {
      erros.push('Título deve ter no máximo 200 caracteres');
    }

    if (this.descricao.length > 1000) {
      erros.push('Descrição deve ter no máximo 1000 caracteres');
    }

    if (this.dataVencimento && this.dataVencimento < new Date()) {
      erros.push('Data de vencimento não pode ser no passado');
    }

    return {
      valido: erros.length === 0,
      erros
    };
  }

  marcarCompleta() {
    this.completa = true;
    this.atualizadaEm = new Date();
  }

  marcarIncompleta() {
    this.completa = false;
    this.atualizadaEm = new Date();
  }

  atualizar(dados) {
    if (dados.titulo !== undefined) this.titulo = dados.titulo;
    if (dados.descricao !== undefined) this.descricao = dados.descricao;
    if (dados.categoria !== undefined) this.categoria = dados.categoria;
    if (dados.tags !== undefined) this.tags = dados.tags;
    if (dados.dataVencimento !== undefined) {
      this.dataVencimento = dados.dataVencimento ? new Date(dados.dataVencimento) : null;
    }

    this.atualizadaEm = new Date();

    const validacao = this.validar();
    if (!validacao.valido) {
      throw new Error(`Validação falhou: ${validacao.erros.join(', ')}`);
    }
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      descricao: this.descricao,
      completa: this.completa,
      categoria: this.categoria,
      tags: this.tags,
      dataVencimento: this.dataVencimento ? this.dataVencimento.toISOString() : null,
      criadaEm: this.criadaEm.toISOString(),
      atualizadaEm: this.atualizadaEm.toISOString()
    };
  }

  static fromJSON(json) {
    return new Tarefa(json);
  }
}

export default Tarefa;
```

#### Service Layer

```javascript
// src/services/TarefaService.js

import Tarefa from '../models/Tarefa.js';
import StorageService from './StorageService.js';
import EventBus from '../patterns/EventBus.js';

/**
 * Service para gerenciar lógica de negócio de tarefas
 */
class TarefaService {
  constructor() {
    this.storage = new StorageService('tarefas');
    this.eventBus = EventBus.getInstance();
    this.tarefas = [];
    this.carregarTarefas();
  }

  carregarTarefas() {
    const tarefasData = this.storage.getAll();
    this.tarefas = tarefasData.map(data => Tarefa.fromJSON(data));
  }

  listarTodas() {
    return [...this.tarefas];
  }

  buscarPorId(id) {
    return this.tarefas.find(t => t.id === id);
  }

  criar(dadosTarefa) {
    const tarefa = new Tarefa(dadosTarefa);

    const validacao = tarefa.validar();
    if (!validacao.valido) {
      throw new Error(`Validação falhou: ${validacao.erros.join(', ')}`);
    }

    this.tarefas.push(tarefa);
    this.storage.save(tarefa.id, tarefa.toJSON());

    this.eventBus.emit('tarefa:criada', tarefa);

    return tarefa;
  }

  atualizar(id, dados) {
    const tarefa = this.buscarPorId(id);

    if (!tarefa) {
      throw new Error(`Tarefa com id ${id} não encontrada`);
    }

    tarefa.atualizar(dados);
    this.storage.save(id, tarefa.toJSON());

    this.eventBus.emit('tarefa:atualizada', tarefa);

    return tarefa;
  }

  deletar(id) {
    const index = this.tarefas.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error(`Tarefa com id ${id} não encontrada`);
    }

    const tarefaDeletada = this.tarefas[index];
    this.tarefas.splice(index, 1);
    this.storage.remove(id);

    this.eventBus.emit('tarefa:deletada', tarefaDeletada);

    return tarefaDeletada;
  }

  toggleCompleta(id) {
    const tarefa = this.buscarPorId(id);

    if (!tarefa) {
      throw new Error(`Tarefa com id ${id} não encontrada`);
    }

    if (tarefa.completa) {
      tarefa.marcarIncompleta();
    } else {
      tarefa.marcarCompleta();
    }

    this.storage.save(id, tarefa.toJSON());

    this.eventBus.emit('tarefa:atualizada', tarefa);

    return tarefa;
  }

  filtrar(criterios) {
    let resultado = [...this.tarefas];

    if (criterios.completa !== undefined) {
      resultado = resultado.filter(t => t.completa === criterios.completa);
    }

    if (criterios.categoria) {
      resultado = resultado.filter(t => t.categoria === criterios.categoria);
    }

    if (criterios.tags && criterios.tags.length > 0) {
      resultado = resultado.filter(t =>
        criterios.tags.every(tag => t.tags.includes(tag))
      );
    }

    if (criterios.busca) {
      const termo = criterios.busca.toLowerCase();
      resultado = resultado.filter(t =>
        t.titulo.toLowerCase().includes(termo) ||
        t.descricao.toLowerCase().includes(termo)
      );
    }

    return resultado;
  }

  ordenar(tarefas, por = 'criadaEm', ordem = 'desc') {
    return tarefas.sort((a, b) => {
      let comparacao = 0;

      if (por === 'titulo') {
        comparacao = a.titulo.localeCompare(b.titulo);
      } else if (por === 'criadaEm' || por === 'atualizadaEm' || por === 'dataVencimento') {
        const dataA = a[por] || new Date(0);
        const dataB = b[por] || new Date(0);
        comparacao = dataA - dataB;
      }

      return ordem === 'asc' ? comparacao : -comparacao;
    });
  }

  exportarJSON() {
    return JSON.stringify(this.tarefas.map(t => t.toJSON()), null, 2);
  }

  importarJSON(json) {
    try {
      const dados = JSON.parse(json);

      if (!Array.isArray(dados)) {
        throw new Error('JSON deve conter um array de tarefas');
      }

      dados.forEach(dadosTarefa => {
        const tarefa = new Tarefa(dadosTarefa);
        const validacao = tarefa.validar();

        if (validacao.valido) {
          this.tarefas.push(tarefa);
          this.storage.save(tarefa.id, tarefa.toJSON());
        }
      });

      this.eventBus.emit('tarefas:importadas', dados.length);

      return dados.length;
    } catch (erro) {
      throw new Error(`Erro ao importar: ${erro.message}`);
    }
  }
}

export default TarefaService;
```

#### Data Layer

```javascript
// src/services/StorageService.js

/**
 * Service para gerenciar persistência em localStorage
 */
class StorageService {
  constructor(namespace) {
    this.namespace = namespace;
  }

  _getKey(id) {
    return `${this.namespace}:${id}`;
  }

  save(id, data) {
    try {
      const key = this._getKey(id);
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (erro) {
      console.error('Erro ao salvar no storage:', erro);
      return false;
    }
  }

  get(id) {
    try {
      const key = this._getKey(id);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (erro) {
      console.error('Erro ao recuperar do storage:', erro);
      return null;
    }
  }

  getAll() {
    const items = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith(`${this.namespace}:`)) {
        const data = localStorage.getItem(key);
        try {
          items.push(JSON.parse(data));
        } catch (erro) {
          console.error(`Erro ao parsear ${key}:`, erro);
        }
      }
    }

    return items;
  }

  remove(id) {
    const key = this._getKey(id);
    localStorage.removeItem(key);
  }

  clear() {
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(`${this.namespace}:`)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  exists(id) {
    const key = this._getKey(id);
    return localStorage.getItem(key) !== null;
  }
}

export default StorageService;
```

## 🧠 Design Patterns Aplicados

### 1. Singleton Pattern (EventBus)

```javascript
// src/patterns/EventBus.js

/**
 * EventBus global para comunicação entre componentes
 */
class EventBus {
  constructor() {
    if (EventBus.instance) {
      return EventBus.instance;
    }

    this.eventos = new Map();
    EventBus.instance = this;
  }

  static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on(evento, callback) {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, []);
    }
    this.eventos.get(evento).push(callback);

    return () => this.off(evento, callback);
  }

  off(evento, callback) {
    if (!this.eventos.has(evento)) return;

    const callbacks = this.eventos.get(evento);
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(evento, dados) {
    if (!this.eventos.has(evento)) return;

    this.eventos.get(evento).forEach(callback => {
      try {
        callback(dados);
      } catch (erro) {
        console.error(`Erro no handler de '${evento}':`, erro);
      }
    });
  }

  once(evento, callback) {
    const wrappedCallback = (dados) => {
      callback(dados);
      this.off(evento, wrappedCallback);
    };
    this.on(evento, wrappedCallback);
  }
}

export default EventBus;
```

### 2. Factory Pattern (Validadores)

```javascript
// src/utils/validators.js

/**
 * Factory de validadores
 */
class ValidadorFactory {
  static criar(tipo) {
    const validadores = {
      obrigatorio: (valor) => ({
        valido: valor !== null && valor !== undefined && valor.trim() !== '',
        mensagem: 'Campo obrigatório'
      }),

      tamanhoMinimo: (min) => (valor) => ({
        valido: valor.length >= min,
        mensagem: `Mínimo de ${min} caracteres`
      }),

      tamanhoMaximo: (max) => (valor) => ({
        valido: valor.length <= max,
        mensagem: `Máximo de ${max} caracteres`
      }),

      email: (valor) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          valido: regex.test(valor),
          mensagem: 'Email inválido'
        };
      },

      dataFutura: (valor) => {
        const data = new Date(valor);
        return {
          valido: data > new Date(),
          mensagem: 'Data deve ser no futuro'
        };
      }
    };

    const validador = validadores[tipo];

    if (!validador) {
      throw new Error(`Validador '${tipo}' não encontrado`);
    }

    return validador;
  }

  static validarCampo(valor, regras) {
    const erros = [];

    regras.forEach(regra => {
      const validador = this.criar(regra.tipo);
      const funcaoValidacao = regra.params ?
        validador(regra.params) : validador;

      const resultado = funcaoValidacao(valor);

      if (!resultado.valido) {
        erros.push(resultado.mensagem);
      }
    });

    return {
      valido: erros.length === 0,
      erros
    };
  }
}

export default ValidadorFactory;
```

### 3. Observer Pattern (UI Reativa)

```javascript
// src/ui/TarefaList.js

import EventBus from '../patterns/EventBus.js';

/**
 * Componente de listagem de tarefas (Observer)
 */
class TarefaList {
  constructor(containerId, tarefaService) {
    this.container = document.getElementById(containerId);
    this.tarefaService = tarefaService;
    this.eventBus = EventBus.getInstance();

    this.inscreverEventos();
    this.renderizar();
  }

  inscreverEventos() {
    // Observar mudanças e re-renderizar
    this.eventBus.on('tarefa:criada', () => this.renderizar());
    this.eventBus.on('tarefa:atualizada', () => this.renderizar());
    this.eventBus.on('tarefa:deletada', () => this.renderizar());
  }

  renderizar() {
    const tarefas = this.tarefaService.listarTodas();

    this.container.innerHTML = tarefas.length === 0 ?
      '<p class="vazio">Nenhuma tarefa cadastrada</p>' :
      tarefas.map(tarefa => this.renderizarTarefa(tarefa)).join('');

    this.adicionarEventListeners();
  }

  renderizarTarefa(tarefa) {
    const completaClass = tarefa.completa ? 'completa' : '';
    const dataVenc = tarefa.dataVencimento ?
      `<span class="vencimento">${this.formatarData(tarefa.dataVencimento)}</span>` : '';

    return `
      <div class="tarefa-item ${completaClass}" data-id="${tarefa.id}">
        <input type="checkbox"
               class="tarefa-checkbox"
               ${tarefa.completa ? 'checked' : ''}>
        <div class="tarefa-conteudo">
          <h3 class="tarefa-titulo">${this.escaparHTML(tarefa.titulo)}</h3>
          <p class="tarefa-descricao">${this.escaparHTML(tarefa.descricao)}</p>
          ${dataVenc}
        </div>
        <div class="tarefa-acoes">
          <button class="btn-editar" data-acao="editar">Editar</button>
          <button class="btn-deletar" data-acao="deletar">Deletar</button>
        </div>
      </div>
    `;
  }

  adicionarEventListeners() {
    // Event delegation
    this.container.addEventListener('click', (e) => {
      const tarefaItem = e.target.closest('.tarefa-item');
      if (!tarefaItem) return;

      const id = tarefaItem.dataset.id;

      if (e.target.classList.contains('tarefa-checkbox')) {
        this.handleToggleCompleta(id);
      } else if (e.target.dataset.acao === 'editar') {
        this.handleEditar(id);
      } else if (e.target.dataset.acao === 'deletar') {
        this.handleDeletar(id);
      }
    });
  }

  handleToggleCompleta(id) {
    try {
      this.tarefaService.toggleCompleta(id);
    } catch (erro) {
      this.mostrarErro(erro.message);
    }
  }

  handleEditar(id) {
    this.eventBus.emit('tarefa:editar-solicitado', id);
  }

  handleDeletar(id) {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      try {
        this.tarefaService.deletar(id);
      } catch (erro) {
        this.mostrarErro(erro.message);
      }
    }
  }

  formatarData(data) {
    return new Intl.DateTimeFormat('pt-BR').format(data);
  }

  escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  mostrarErro(mensagem) {
    this.eventBus.emit('erro:exibir', mensagem);
  }
}

export default TarefaList;
```

Este arquivo continua no próximo com implementação de formulários, controllers e integração completa.
