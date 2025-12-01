# 🎯 Introdução

A implementação de padrões de limpeza (cleanup patterns) para cancelamento de requisições representa uma evolução arquitetural crítica no desenvolvimento de aplicações web modernas. Enquanto mecanismos individuais como `AbortController` e timeout fornecem as ferramentas básicas para cancelamento, a organização sistemática dessas capacidades em padrões reutilizáveis determina a diferença entre código frágil e código resiliente em escala empresarial.

O problema fundamental emerge quando aplicações crescem em complexidade: componentes podem disparar múltiplas requisições, navegar entre rotas antes das respostas chegarem, ou desmontar enquanto operações assíncronas ainda estão pendentes. Sem padrões adequados de limpeza, cada um desses cenários pode resultar em atualizações de estado em componentes desmontados (causando warnings no React), vazamentos de memória (controllers não liberados), ou comportamentos imprevisíveis (race conditions entre requisições antigas e novas).

Padrões de limpeza estruturados endereçam esses desafios através de abstrações que encapsulam o ciclo de vida completo de requisições HTTP. Eles garantem que, independente de como ou quando um componente termina sua vida útil, todas as operações assíncronas associadas sejam adequadamente canceladas e seus recursos liberados. Esta abordagem não apenas previne bugs sutis mas também melhora performance ao evitar processamento desnecessário de respostas obsoletas.

A importância destes padrões transcende questões técnicas pontuais: eles refletem princípios fundamentais de engenharia de software como separação de responsabilidades, gerenciamento de recursos, e design defensivo. Uma aplicação que implementa cleanup patterns robustos demonstra maturidade arquitetural, facilitando manutenção, testes, e evolução do código ao longo do tempo.

---

# 📋 Sumário

### **Fundamentos de Cleanup**
- Necessidade de limpeza em aplicações assíncronas
- Ciclo de vida de componentes vs ciclo de vida de requisições
- Problemas causados por cleanup inadequado
- Princípios de design para cleanup efetivo

### **React Cleanup Patterns**
- `useEffect` cleanup function com `AbortController`
- Custom hooks para requests com cleanup automático
- Cleanup em múltiplas requisições paralelas
- Padrões para cleanup em class components

### **Request Manager Pattern**
- Centralização de controle de requisições
- Cancelamento por identificador/categoria
- Cancel-all utilities
- Integração com routing e navegação

### **Component Lifecycle Integration**
- Cleanup em montagem/desmontagem
- Cleanup em mudanças de dependências
- Cleanup em navegação entre rotas
- Cleanup em re-renders e updates

### **Framework-Specific Patterns**
- Vue.js: `onBeforeUnmount` e cleanup
- Angular: `ngOnDestroy` e `takeUntil`
- Svelte: `onDestroy` e reactive cleanup
- Comparação entre abordagens

### **Memory Leak Prevention**
- Identificação de vazamentos relacionados a requests
- Padrões para prevenir referências circulares
- Cleanup de event listeners e timers
- Ferramentas de detecção e debugging

### **Testing Cleanup Logic**
- Unit tests para funções de cleanup
- Verificação de cancelamento em testes
- Mocking de `AbortController`
- Testes de integração com cleanup

### **Production Best Practices**
- Checklist de cleanup para code review
- Padrões organizacionais para teams
- Performance monitoring de cleanup
- Error handling em cleanup functions

---

# 🧠 Fundamentos

## Necessidade de Limpeza em Aplicações Assíncronas

O modelo assíncrono do JavaScript cria uma dessincronia temporal entre a inicialização de operações e sua conclusão. Quando um componente React inicia uma requisição HTTP, ele dispara uma cadeia de eventos que pode levar centenas de milissegundos (ou mais) para completar. Durante esse intervalo, o estado da aplicação pode mudar radicalmente: o usuário pode navegar para outra página, o componente pode desmontar, ou novas requisições podem ser disparadas tornando a primeira obsoleta.

Sem cleanup adequado, a aplicação tenta processar respostas de requisições que não são mais relevantes. No React, isso manifesta-se como o famoso warning: *"Can't perform a React state update on an unmounted component"*. Este warning não é apenas estético - indica que código está executando em contexto inválido, potencialmente acessando referências stale ou causando vazamentos de memória.

A questão fundamental é que **operações assíncronas não têm conhecimento automático do ciclo de vida dos componentes que as iniciaram**. Uma Promise disparada por um componente não sabe se esse componente ainda existe quando resolve. Padrões de cleanup existem para criar essa ligação explícita, permitindo que operações assíncronas sejam canceladas quando o contexto que as criou deixa de ser válido.

## Ciclo de Vida de Componentes vs Ciclo de Vida de Requisições

Compreender a intersecção entre o ciclo de vida de componentes UI e o ciclo de vida de requisições HTTP é crucial para cleanup efetivo. Um componente React passa por fases bem definidas: mounting (criação e inserção no DOM), updating (re-renders devido a mudanças de props/state), e unmounting (remoção do DOM). Requisições HTTP, por outro lado, seguem um ciclo diferente: pending (aguardando resposta), fulfilled (resposta recebida com sucesso), ou rejected (erro ou cancelamento).

O problema surge quando estes ciclos não estão sincronizados. Cenários comuns incluem:

**Desmontagem durante requisição pendente**: O componente desmonta enquanto a requisição ainda está em flight. Quando a resposta chega, o código de callback tenta atualizar state de um componente que não existe mais.

**Nova requisição antes da anterior completar**: Em uma busca com autocomplete, o usuário digita rapidamente, disparando múltiplas requisições. A primeira requisição (para "ja") pode completar depois da segunda ("java"), causando race condition onde o resultado desatualizado sobrescreve o atual.

**Mudança de dependências tornando requisição obsoleta**: Em um `useEffect` com dependências, quando uma dependência muda, a requisição anterior torna-se irrelevante. Sem cleanup, ambas as requisições completam, mas apenas a mais recente deveria afetar o UI.

Cleanup patterns resolvem esta dessincronia ao permitir que componentes **cancelem explicitamente requisições quando seu contexto muda**, alinhando o ciclo de vida das operações assíncronas com o ciclo de vida dos componentes.

## Problemas Causados por Cleanup Inadequado

**Memory Leaks (Vazamentos de Memória)**: Quando requisições não são canceladas, os objetos `AbortController`, closures associadas, e referências a componentes podem permanecer na memória mesmo após o componente desmontar. Em aplicações single-page com navegação frequente, estes vazamentos acumulam-se, degradando performance progressivamente.

**State Updates em Componentes Desmontados**: Tentar atualizar state via `setState` ou `useState` setter após unmount gera warnings e pode causar comportamentos imprevisíveis. Embora o React previna a atualização efetiva, o código de processamento da resposta ainda executa, desperdiçando ciclos de CPU.

**Race Conditions**: Sem cancelamento, múltiplas requisições para o mesmo recurso podem completar em ordem diferente da que foram disparadas. Isto é especialmente problemático em cenários de busca/filtro, onde a última entrada do usuário pode ser sobrescrita por resultados de uma query anterior mais lenta.

**Processamento Desnecessário**: Parsear JSON, transformar dados, ou executar lógica de negócio em respostas de requisições obsoletas desperdiça recursos computacionais. Em dispositivos móveis ou ambientes com CPU limitada, este overhead é mensurável.

**Bugs Sutis em Testes**: Testes que não aguardam cleanup adequado podem passar localmente mas falhar intermitentemente em CI/CD. Requisições de um teste anterior podem vazar para o próximo teste, causando falhas não-determinísticas difíceis de debugar.

## Princípios de Design para Cleanup Efetivo

**Princípio da Responsabilidade Única**: Cada função ou componente deve ter responsabilidade clara sobre suas operações assíncronas. Se um componente inicia uma requisição, deve também ser responsável por cancelá-la quando apropriado.

**Princípio do Fail-Safe**: Cleanup deve ser defensivo, assumindo que pode ser chamado múltiplas vezes ou em estados inesperados. Funções de cleanup devem ser idempotentes (produzir mesmo resultado se chamadas repetidamente) e nunca lançar exceções.

**Princípio da Localidade**: Código de cleanup deve estar próximo do código que cria o recurso. Em `useEffect`, a cleanup function retornada deve estar no mesmo escopo onde a requisição é iniciada, facilitando manutenção e compreensão.

**Princípio da Composição**: Cleanup patterns devem ser compostos a partir de primitivas simples. Um custom hook que gerencia múltiplas requisições deve compor múltiplos `AbortController` individuais, não criar uma abstração monolítica.

**Princípio da Explicitação**: Cleanup deve ser explícito, não implícito. Desenvolvedores lendo o código devem facilmente identificar onde e como recursos são liberados. Abstrações "mágicas" que fazem cleanup automaticamente sem visibilidade podem esconder bugs.

---

# 🔍 Análise

## React Cleanup com useEffect e AbortController

O padrão mais fundamental em React moderno é a integração entre `useEffect` cleanup function e `AbortController`. A estrutura canônica é:

```javascript
useEffect(() => {
  const controller = new AbortController();
  
  axios.get('/api/data', { signal: controller.signal })
    .then(response => setData(response.data))
    .catch(err => {
      if (!axios.isCancel(err)) {
        setError(err);
      }
    });
  
  return () => controller.abort(); // cleanup function
}, [dependencies]);
```

Esta estrutura garante que quando o componente desmonta **ou quando qualquer dependência muda**, a cleanup function executa e cancela a requisição pendente. A verificação `!axios.isCancel(err)` previne que erros de cancelamento sejam tratados como erros reais, mantendo o UI limpo.

O momento da execução do cleanup é crucial. No React, a cleanup function executa:
1. **Antes do próximo efeito executar** (quando dependências mudam)
2. **Quando o componente desmonta**

Isto significa que em re-renders rápidos, múltiplos cycles de create-cleanup podem ocorrer em sequência. O pattern é otimizado para este comportamento através da criação de um novo `AbortController` em cada execução do efeito.

## Custom Hooks para Encapsulamento de Cleanup

Extrair lógica de fetching com cleanup para custom hooks elimina duplicação e centraliza padrões. Um hook `useFetch` robusto encapsula todo o ciclo:

```javascript
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    setLoading(true);
    axios.get(url, { ...options, signal: controller.signal })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          setError(err);
          setLoading(false);
        }
      });
    
    return () => controller.abort();
  }, [url, options]); // NOTE: options deve ser memoizado
  
  return { data, loading, error };
}
```

Este hook retorna um objeto com estado de loading/error/data e garante cleanup automático. O componente consumidor não precisa se preocupar com cancelamento:

```javascript
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <Profile user={data} />;
}
```

Quando `userId` muda, o hook re-executa, o cleanup cancela a requisição anterior, e uma nova requisição com o novo ID é disparada - tudo automaticamente.

## Request Manager Pattern para Controle Centralizado

Em aplicações complexas, gerenciar cancelamento distribuído em múltiplos componentes torna-se caótico. O **Request Manager Pattern** centraliza controle através de uma classe ou módulo singleton:

```javascript
class RequestManager {
  constructor() {
    this.controllers = new Map();
  }
  
  // Registra controller com identificador único
  register(key, controller) {
    this.cancel(key); // cancela qualquer requisição anterior com mesma key
    this.controllers.set(key, controller);
  }
  
  // Cancela requisição específica
  cancel(key) {
    const controller = this.controllers.get(key);
    if (controller) {
      controller.abort();
      this.controllers.delete(key);
    }
  }
  
  // Cancela todas as requisições de uma categoria
  cancelCategory(category) {
    for (const [key, controller] of this.controllers.entries()) {
      if (key.startsWith(category + ':')) {
        controller.abort();
        this.controllers.delete(key);
      }
    }
  }
  
  // Cancela todas as requisições ativas
  cancelAll() {
    for (const controller of this.controllers.values()) {
      controller.abort();
    }
    this.controllers.clear();
  }
}

const requestManager = new RequestManager();
export default requestManager;
```

Componentes registram suas requisições com keys descritivas:

```javascript
function ProductList({ category }) {
  useEffect(() => {
    const controller = new AbortController();
    requestManager.register(`products:${category}`, controller);
    
    axios.get(`/api/products?category=${category}`, { 
      signal: controller.signal 
    })
      .then(response => setProducts(response.data))
      .catch(err => {
        if (!axios.isCancel(err)) setError(err);
      });
    
    return () => requestManager.cancel(`products:${category}`);
  }, [category]);
}
```

Este pattern permite operações como "cancelar todas as requisições de produtos" ou "cancelar tudo ao fazer logout" através de `requestManager.cancelCategory('products')` ou `requestManager.cancelAll()`.

## Component Lifecycle Integration

**Mounting/Unmounting**: O padrão básico de `useEffect` com cleanup function lida naturalmente com unmount. Para class components, o equivalente é criar controller em `componentDidMount` e abortar em `componentWillUnmount`:

```javascript
class DataFetcher extends React.Component {
  controller = new AbortController();
  
  componentDidMount() {
    axios.get('/api/data', { signal: this.controller.signal })
      .then(response => this.setState({ data: response.data }))
      .catch(err => {
        if (!axios.isCancel(err)) {
          this.setState({ error: err });
        }
      });
  }
  
  componentWillUnmount() {
    this.controller.abort();
  }
  
  render() { /* ... */ }
}
```

**Dependency Changes**: Quando dependências de um `useEffect` mudam, o cleanup executa antes do próximo efeito. Isto cria um ciclo natural de cancel-and-refetch:

```javascript
useEffect(() => {
  const controller = new AbortController();
  
  // Esta requisição será cancelada se searchTerm ou filters mudarem
  axios.get('/api/search', {
    params: { q: searchTerm, ...filters },
    signal: controller.signal
  })
    .then(response => setResults(response.data))
    .catch(err => { /* ... */ });
  
  return () => controller.abort();
}, [searchTerm, filters]);
```

Se o usuário muda `searchTerm` de "java" para "javascript", a requisição para "java" é cancelada antes que a nova requisição para "javascript" seja disparada.

## Framework-Specific Patterns

**Vue.js**: Utiliza `onBeforeUnmount` (Vue 3 Composition API) ou `beforeDestroy` (Vue 2 Options API):

```javascript
// Vue 3 Composition API
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  setup() {
    const data = ref(null);
    let controller;
    
    onMounted(() => {
      controller = new AbortController();
      axios.get('/api/data', { signal: controller.signal })
        .then(response => data.value = response.data);
    });
    
    onBeforeUnmount(() => {
      if (controller) controller.abort();
    });
    
    return { data };
  }
};
```

**Angular**: Usa `ngOnDestroy` e o padrão `takeUntil` com RxJS para cleanup reativo:

```typescript
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({ /* ... */ })
export class DataComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    this.httpClient.get('/api/data')
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data = data);
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

Embora Angular use RxJS em vez de `AbortController`, o princípio é idêntico: criar um mecanismo de cancelamento (Subject) e disparar cleanup em `ngOnDestroy`.

**Svelte**: Usa `onDestroy` para cleanup:

```javascript
import { onDestroy } from 'svelte';

let data = null;
const controller = new AbortController();

axios.get('/api/data', { signal: controller.signal })
  .then(response => data = response.data);

onDestroy(() => {
  controller.abort();
});
```

A diferença fundamental entre frameworks está na **API de lifecycle**, mas o conceito de "executar cleanup quando componente desmonta" é universal.

## Memory Leak Prevention

Vazamentos de memória relacionados a requisições HTTP ocorrem quando referências a objetos não são liberadas. Padrões comuns incluem:

**Closures Retendo Componentes**: Callbacks de `.then()` criam closures que referenciam o componente. Se a requisição nunca completa ou cancela, a closure persiste, impedindo garbage collection do componente:

```javascript
// PROBLEMA: closure retém 'this'
componentDidMount() {
  axios.get('/api/data')
    .then(response => {
      this.setState({ data: response.data }); // 'this' referenciado
    });
  // Se componente desmonta antes da resposta, 'this' vaza
}
```

**Solução**: Cancelar a requisição garante que a Promise seja rejeitada, permitindo que a closure seja coletada:

```javascript
componentDidMount() {
  this.controller = new AbortController();
  
  axios.get('/api/data', { signal: this.controller.signal })
    .then(response => this.setState({ data: response.data }))
    .catch(() => { /* ignorar se cancelado */ });
}

componentWillUnmount() {
  this.controller.abort(); // Rejeita Promise, liberando closure
}
```

**Event Listeners Não Removidos**: Se `AbortController` é usado com event listeners, estes devem ser removidos manualmente:

```javascript
useEffect(() => {
  const controller = new AbortController();
  
  const handleAbort = () => console.log('Aborted!');
  controller.signal.addEventListener('abort', handleAbort);
  
  // Cleanup deve remover listener
  return () => {
    controller.abort();
    controller.signal.removeEventListener('abort', handleAbort);
  };
}, []);
```

**Ferramentas de Detecção**: Usar Chrome DevTools Memory Profiler para detectar vazamentos. Realizar heap snapshots antes e depois de montar/desmontar componentes repetidamente. Se o heap cresce progressivamente, há vazamento. Buscar por objetos do tipo `AbortController`, `XMLHttpRequest`, ou closures relacionadas a componentes desmontados.

## Testing Cleanup Logic

Testar cleanup adequadamente garante que a lógica de cancelamento funciona sob todas as condições:

**Unit Test de Cleanup Function**:

```javascript
describe('useFetch cleanup', () => {
  it('should abort request when component unmounts', () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    
    const { unmount } = renderHook(() => useFetch('/api/data'));
    
    unmount();
    
    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});
```

**Verificação de Não-Atualização Pós-Unmount**:

```javascript
it('should not update state after unmount', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  
  const { unmount } = render(<DataComponent />);
  
  unmount();
  
  // Aguardar tempo suficiente para requisição completar
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Nenhum warning de "state update on unmounted component"
  expect(console.error).not.toHaveBeenCalledWith(
    expect.stringContaining("unmounted component")
  );
  
  console.error.mockRestore();
});
```

**Mock de AbortController**:

```javascript
it('should pass abort signal to axios', () => {
  const mockSignal = {};
  const MockController = jest.fn(() => ({
    signal: mockSignal,
    abort: jest.fn()
  }));
  
  global.AbortController = MockController;
  
  const axiosSpy = jest.spyOn(axios, 'get');
  
  render(<DataComponent />);
  
  expect(axiosSpy).toHaveBeenCalledWith(
    '/api/data',
    expect.objectContaining({ signal: mockSignal })
  );
  
  axiosSpy.mockRestore();
});
```

**Testes de Integração**: Usar bibliotecas como `@testing-library/react` com `waitFor` para aguardar requisições e verificar que cancelamento previne atualizações:

```javascript
it('should cancel previous request when dependency changes', async () => {
  const { rerender } = render(<SearchComponent query="java" />);
  
  // Mudar query antes da primeira requisição completar
  rerender(<SearchComponent query="javascript" />);
  
  await waitFor(() => {
    // Verificar que apenas resultado de "javascript" é exibido
    expect(screen.getByText(/javascript/i)).toBeInTheDocument();
    expect(screen.queryByText(/^java$/i)).not.toBeInTheDocument();
  });
});
```

## Production Best Practices

**Checklist de Code Review**:
- [ ] Todo `useEffect` com requisições tem cleanup function?
- [ ] Custom hooks que fazem fetching retornam cleanup function ou a executam internamente?
- [ ] Class components abortam requisições em `componentWillUnmount`?
- [ ] Errors de cancelamento (`axios.isCancel()`) são tratados separadamente?
- [ ] Múltiplas requisições em um componente usam controllers separados ou um RequestManager?
- [ ] Cleanup functions são idempotentes (podem ser chamadas múltiplas vezes)?
- [ ] Dependências de `useEffect` incluem todas as variáveis usadas na requisição?

**Padrões Organizacionais**:
- **Convenção de Naming**: Prefixar keys de RequestManager com namespace (ex: `user:profile:${id}`, `products:list:${category}`)
- **Centralização de Hooks**: Criar diretório `hooks/` com custom hooks reutilizáveis (`useFetch`, `usePost`, etc.) que implementam cleanup por padrão
- **Linter Rules**: Configurar ESLint com regras que detectam `useEffect` sem cleanup quando funções assíncronas são detectadas
- **Documentation**: Documentar no README ou style guide que todo código assíncrono deve implementar cleanup, com exemplos

**Performance Monitoring**:
- Usar ferramentas de APM (Application Performance Monitoring) para rastrear requisições canceladas vs completadas
- Monitorar warnings de "state update on unmounted component" em ferramentas de error tracking (Sentry, Rollbar)
- Medir tempo médio de requisições canceladas para identificar cancelamentos prematuros (pode indicar UX problems)

**Error Handling em Cleanup**:
Cleanup functions **nunca devem lançar exceções**. Envolver lógica em try-catch se houver risco:

```javascript
return () => {
  try {
    controller.abort();
    // Outras operações de cleanup
  } catch (error) {
    console.error('Cleanup failed:', error);
    // Nunca re-lançar erro aqui
  }
};
```

React não captura erros em cleanup functions, então exceções podem causar crashes silenciosos ou comportamentos imprevisíveis.

---

# 🎯 Aplicabilidade

## Cenários Onde Cleanup Patterns São Essenciais

**Single-Page Applications (SPAs)**: SPAs com navegação client-side fazem transições rápidas entre rotas sem recarregar a página. Sem cleanup, requisições iniciadas em uma rota continuam processando mesmo após o usuário navegar para outra, causando atualizações de state em componentes desmontados.

**Autocomplete/Search Inputs**: Usuários digitam rapidamente, disparando múltiplas requisições em sequência. Cada keystroke pode iniciar uma nova busca antes da anterior completar. Cleanup garante que apenas o resultado da query mais recente é exibido, prevenindo race conditions.

**Infinite Scroll/Pagination**: Ao fazer scroll rápido ou clicar rapidamente em botões de paginação, múltiplas requisições para páginas diferentes são disparadas. Cancelar requisições de páginas que o usuário já passou evita processamento desnecessário.

**Real-Time Dashboards**: Dashboards que fazem polling periódico de APIs devem cancelar requisições pendentes quando o componente desmonta ou quando o intervalo de polling é alterado, evitando acúmulo de requisições.

**Modal Dialogs e Overlays**: Quando usuário fecha um modal antes de dados carregarem, a requisição deve ser cancelada. Sem cleanup, ao reabrir o modal, dados antigos podem aparecer brevemente antes de novos dados carregarem.

**Form Submissions**: Em formulários que fazem submit via AJAX, se usuário clica "submit" múltiplas vezes rapidamente (double-submit problem), cleanup pode cancelar submissões duplicadas.

**Mobile Applications**: Em ambientes móveis com conectividade intermitente, usuários podem fechar apps ou navegar entre telas antes de requisições completarem. Cleanup previne vazamentos de memória em aplicações que rodam por longos períodos.

## Contextos Onde Cleanup Pode Ser Opcional

**Operações Críticas**: Requisições de autenticação, logout, ou transações financeiras **não devem ser canceladas** ao desmontar componentes. Estas operações devem completar mesmo se o UI muda.

**Fire-and-Forget Requests**: Analytics, logging, ou telemetria geralmente são disparados sem expectativa de resposta. Cancelar estes requests oferece pouco benefício.

**Static Sites/Server-Rendered Apps**: Aplicações que fazem a maioria do fetching no servidor e têm pouca interatividade client-side têm menos necessidade de cleanup patterns complexos.

**Prototypes e POCs**: Em provas de conceito ou protótipos descartáveis, o overhead de implementar cleanup pode não justificar o benefício.

## Combinação com Outros Patterns

**Retry Patterns**: Combinar cleanup com retry logic requer cuidado. Se uma requisição é cancelada, retries também devem ser cancelados:

```javascript
async function fetchWithRetry(url, controller, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url, { signal: controller.signal });
    } catch (error) {
      if (axios.isCancel(error) || i === retries - 1) throw error;
      await delay(1000 * Math.pow(2, i));
    }
  }
}
```

**Caching**: Quando usando cache (React Query, SWR), cleanup ainda é necessário para requisições em flight. Bibliotecas de cache geralmente implementam cleanup internamente.

**Optimistic Updates**: Em patterns de optimistic update (atualizar UI antes da resposta), cleanup deve reverter mudanças otimistas se a requisição for cancelada.

---

# ⚠️ Limitações

## Overhead de Complexidade

Implementar cleanup patterns adiciona complexidade ao código. Cada requisição requer criação de `AbortController`, registrar cleanup function, e tratar errors de cancelamento separadamente. Em aplicações pequenas, este overhead pode exceder o benefício.

## Não Funciona com Fetch API Antiga

Browsers antigos que não suportam `AbortController` (IE11, Safari < 12.1) requerem polyfills. Bibliotecas como `axios` abstraem isto, mas se usando `fetch` diretamente, é necessário verificar compatibilidade.

## Cancelamento Não Interrompe Processamento Servidor

Abortar uma requisição no cliente **não cancela processamento no servidor**. O servidor continua processando a request normalmente. Isto significa que:

- Recursos servidor são consumidos mesmo após cancelamento
- Operações com side effects (gravações em database) ocorrem normalmente
- Para verdadeiro cancelamento, o servidor precisa implementar mecanismos próprios (ex: detectar desconexão de socket)

## Race Conditions em Cleanup

Se cleanup executa enquanto uma resposta está sendo processada, pode ocorrer race condition entre o processamento e o aborto. Usar flags ou verificações de estado antes de atualizar state:

```javascript
let isCancelled = false;

axios.get('/api/data', { signal: controller.signal })
  .then(response => {
    if (!isCancelled) {
      setData(response.data);
    }
  });

return () => {
  isCancelled = true;
  controller.abort();
};
```

## Difícil Testar Timing Issues

Bugs relacionados a timing (ex: requisição completa 1ms antes do unmount) são difíceis de reproduzir e testar deterministicamente. Testes precisam usar mocks ou delays artificiais, que podem não refletir condições reais.

## Potencial para Over-Cancellation

Cancelar requisições agressivamente demais pode degradar UX. Por exemplo, cancelar requisições a cada keystroke em uma busca pode fazer com que resultados nunca carreguem se o usuário digita continuamente. Debounce ou throttle podem ser necessários.

---

# 🔗 Interconexões

## Relação com AbortController

Cleanup patterns são a **manifestação arquitetural** de `AbortController`. Enquanto `AbortController` fornece a primitiva técnica para cancelamento, cleanup patterns definem **como e quando** usar essa primitiva em aplicações reais. Sem padrões estruturados, `AbortController` permanece uma ferramenta subutilizada.

## Dependência de Lifecycle Hooks

Cleanup patterns são intrinsecamente acoplados aos hooks de lifecycle dos frameworks. Em React, `useEffect` cleanup é o mecanismo fundamental; em Vue, `onBeforeUnmount`; em Angular, `ngOnDestroy`. **Mudar de framework requer adaptar cleanup patterns** para os lifecycle hooks equivalentes.

## Integração com State Management

Bibliotecas de state management global (Redux, Zustand, Jotai) apresentam desafios para cleanup. Como o state é global, requisições não estão necessariamente ligadas ao lifecycle de componentes específicos. Soluções incluem:

- **Redux Thunk com AbortController**: Passar controller em thunk actions
- **RTK Query**: Implementa cleanup automático através de subscriptions
- **React Query / SWR**: Gerenciam cleanup internamente, cancelando queries quando não há mais observers

## Relação com Error Handling

Cleanup patterns expandem a lógica de error handling ao adicionar uma categoria de error (cancelamento) que deve ser tratada diferentemente de erros reais. Isto se conecta ao módulo M4 (Response e Error Handling), particularmente à diferenciação entre errors de rede, HTTP errors, e cancelamentos.

## Interação com Interceptors

Interceptors (M5) podem interferir com cleanup se não forem configurados corretamente. Por exemplo, um response interceptor que automaticamente faz retry pode ignorar sinais de cancelamento:

```javascript
// PROBLEMA: Retry interceptor ignora cancelamento
axios.interceptors.response.use(null, async error => {
  if (error.response?.status === 500) {
    return axios.request(error.config); // Re-faz request, ignorando abort
  }
  throw error;
});
```

**Solução**: Verificar `axios.isCancel(error)` em interceptors antes de executar lógica de retry ou transformação.

---

# 🚀 Evolução

## De Callbacks para Promises para Async/Await

A evolução de padrões assíncronos em JavaScript reflete-se em cleanup patterns:

**Era Callbacks**: Cancelamento era manual, geralmente através de flags:
```javascript
let cancelled = false;

fetchData(url, (data) => {
  if (!cancelled) setState(data);
});

return () => { cancelled = true; };
```

**Era Promises**: `Promise.race()` e wrappers permitiam timeout primitivo, mas sem cancelamento verdadeiro.

**Era Async/Await + AbortController**: Cancelamento tornou-se primeira classe com `AbortController`, permitindo cleanup declarativo e composável.

## De Cleanup Manual para Bibliotecas Declarativas

Ferramentas modernas abstraem cleanup:

**React Query**:
```javascript
const { data } = useQuery(['user', userId], () => 
  axios.get(`/api/users/${userId}`).then(res => res.data)
);
// Cleanup automático quando query não tem observers
```

**SWR**:
```javascript
const { data } = useSWR(`/api/users/${userId}`, fetcher);
// Cleanup automático ao desmontar componentes
```

Estas bibliotecas implementam cleanup patterns internamente, liberando desenvolvedores de implementações manuais. A tendência é abstrair cleanup como _concern_ da biblioteca, não do application code.

## Padronização de Cancelamento em Fetch API

Fetch API originalmente não tinha cancelamento. `AbortController` foi adicionado depois como padrão WHATWG. Esta padronização influenciou bibliotecas como Axios a adotarem o mesmo padrão, criando uniformidade no ecossistema.

## Integração com React Concurrent Mode

React Concurrent Mode introduz conceitos como Suspense e transitions, que alteram como componentes renderizam. Cleanup patterns precisam adaptar-se para:

- **Suspense Boundaries**: Requisições podem ser "suspended" e retomadas, requerendo cleanup quando suspense é cancelado
- **Transitions**: Marcar atualizações como transições permite ao React cancelar renders antigas, requerendo cleanup de requisições associadas

## Possibilidade de Cancelamento Nativo em Axios

Axios atualmente depende de `AbortController` (API externa). No futuro, pode implementar API de cancelamento nativa, potencialmente oferecendo features adicionais como:

- Cancelamento parcial (cancelar apenas parte de uma request batch)
- Cancelamento com razão/metadata (ex: `abort({ reason: 'user-navigation' })`)
- Cancelamento hierárquico (cancelar parent cancela todos os children automaticamente)

## Evolução para Cancelamento Automático com Signals

TC39 (comitê de especificação JavaScript) tem proposta para "Cancellation Tokens" mais avançados que `AbortController`. Se adotado, permitiria cancelamento mais granular e composável, influenciando próxima geração de cleanup patterns.

## Frameworks com Cleanup Embutido

Frameworks futuros podem tornar cleanup implícito. Svelte 5 (com runes) e Solid.js já demonstram padrões onde efeitos são automaticamente rastreados e limpos sem código explícito. Esta evolução pode tornar cleanup patterns atuais obsoletos, substituindo-os por abstrações automáticas.

---

**Conclusão Integrada**: Cleanup patterns representam a maturação da web development de código imperativo e propenso a erros para abstrações declarativas e resilientes. Enquanto `AbortController` fornece a ferramenta, padrões estruturados transformam essa ferramenta em práticas escaláveis. A evolução contínua de frameworks e bibliotecas aponta para um futuro onde cleanup é cada vez mais automático, mas compreender os fundamentos permanece essencial para debugging, otimização, e design de abstrações customizadas. Em produção, cleanup adequado não é luxo - é requisito fundamental para aplicações confiáveis e performáticas.