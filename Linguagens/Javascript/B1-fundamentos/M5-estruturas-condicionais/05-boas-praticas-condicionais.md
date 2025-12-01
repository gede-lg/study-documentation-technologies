# Boas Práticas para Estruturas Condicionais em JavaScript - Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Boas práticas para estruturas condicionais** constituem um conjunto de princípios, padrões e convenções estabelecidos pela comunidade de desenvolvimento que visam maximizar a **legibilidade, manutenibilidade, performance e robustez** do código condicional. Conceitualmente, são **heurísticas pragmáticas** derivadas de décadas de experiência coletiva, pesquisa empírica e análise de erros comuns, destinadas a guiar desenvolvedores na escrita de código condicional que seja não apenas funcionalmente correto, mas também sustentável a longo prazo.

Em sua essência, boas práticas para condicionais transcendem sintaxe - são **princípios de design de código** que refletem valores como:

1. **Clareza sobre Concisão**: Código deve comunicar intenção claramente, mesmo que isso signifique mais linhas
2. **Prevenção de Erros**: Estruturas devem ser resistentes a bugs comuns (typos, lógica incorreta, edge cases)
3. **Manutenibilidade**: Código deve ser fácil de modificar, estender e debugar
4. **Performance Pragmática**: Otimizações devem ser aplicadas onde importam, sem sacrificar legibilidade
5. **Consistência**: Padrões uniformes reduzem carga cognitiva

Essas práticas não são regras absolutas, mas **diretrizes contextuais** que devem ser aplicadas com julgamento, considerando o contexto específico do projeto, equipe e domínio do problema.

### Contexto Histórico e Motivação para Criação

As boas práticas para estruturas condicionais não surgiram de um único momento ou autor, mas **evoluíram organicamente** através da história da programação, refinadas por erros dolorosos, bugs de produção e pesquisas sobre legibilidade de código.

**Anos 1960-70: Programação Estruturada**

**Edsger Dijkstra** e **"Go To Statement Considered Harmful"** (1968): Dijkstra argumentou que saltos arbitrários (GOTO) criam código incompreensível. Ele promoveu estruturas de controle claras (if/else, loops) como alternativa. Isso estabeleceu o princípio fundamental:

> **"Código deve ser lido sequencialmente, com fluxo de controle óbvio."**

**C.A.R. Hoare** e **precondições/postcondições**: Hoare formalizou a ideia de que funções têm **contratos** - condições que devem ser verdadeiras antes e depois da execução. Isso levou à prática de **guard clauses** (validação de precondições no início de funções).

**Anos 1980: Complexidade de Software e Métricas**

**Thomas McCabe** e **Complexidade Ciclomática** (1976): McCabe desenvolveu métrica para medir complexidade de código baseada no número de caminhos independentes. Isso quantificou o que antes era intuitivo: **muitos ifs aninhados = código complexo**.

Estudos empíricos mostraram correlação entre alta complexidade ciclomática e:
- Maior densidade de bugs
- Maior tempo de debugging
- Maior dificuldade de compreensão

Isso motivou a prática de **limitar aninhamento** e **extrair funções** para reduzir complexidade.

**Anos 1990: Padrões de Projeto e Código Limpo**

**"Design Patterns"** (Gang of Four, 1994): Introduziu padrões como **Strategy** e **State**, que substituem if/else complexos por polimorfismo, estabelecendo que **lógica condicional pode ser substituída por design orientado a objetos**.

**Steve McConnell** e **"Code Complete"** (1993): Sintetizou pesquisas sobre legibilidade, estabelecendo práticas como:
- Preferir condições positivas (if (isValid) vs if (!isInvalid))
- Colocar caso normal antes de exceções
- Usar else apenas quando necessário

**Anos 2000: Refatoração e Extreme Programming**

**Martin Fowler** e **"Refactoring"** (1999): Catalogou técnicas de refatoração específicas para condicionais:
- **Replace Nested Conditional with Guard Clauses**: Substituir aninhamento por early returns
- **Replace Conditional with Polymorphism**: Substituir tipo-checking por polimorfismo
- **Decompose Conditional**: Extrair condições complexas para funções nomeadas

**Kent Beck** e **Test-Driven Development**: TDD revelou que código com muitos branches é difícil de testar, motivando práticas de simplificação.

**Anos 2010: Linters, Análise Estática e Guias de Estilo**

**ESLint** e **analisadores estáticos**: Ferramentas automatizadas começaram a detectar antipadrões em condicionais:
- `no-else-return`: Else desnecessário após return
- `no-lonely-if`: If solitário dentro de else que deveria ser else if
- `complexity`: Alerta quando complexidade ciclomática excede threshold

**Guias de Estilo Corporativos**:
- **Airbnb JavaScript Style Guide** (2014): Estabeleceu convenções amplamente adotadas
- **Google JavaScript Style Guide**: Enfatizou legibilidade e consistência
- **StandardJS**: Promoveu estilo sem configuração

**Era Moderna: Programação Funcional e Imutabilidade**

**JavaScript Moderno (ES6+)**: Introduziu features que influenciam práticas:
- `const`: Favorece imutabilidade (ternário sobre if/else)
- Arrow functions: Expressões sobre statements
- Optional chaining (`?.`): Reduz if checks para null/undefined

**React e JSX**: Popularizou ternários e operadores lógicos para renderização condicional, estabelecendo que **expressões são preferíveis a statements** em certos contextos.

### Problema Fundamental que Resolve

Boas práticas para condicionais resolvem o problema fundamental de **dívida técnica em código condicional** - o custo crescente de manutenção quando condicionais são escritas sem disciplina.

**Problema 1: Código Incompreensível (Cognitive Load)**

Código condicional mal escrito impõe alta **carga cognitiva** - esforço mental necessário para entender o que o código faz.

```javascript
// ❌ Alta carga cognitiva
if (!(!isActive || isDeleted)) {
  if (!(age < 18 || age > 65)) {
    if (!(balance <= 0)) {
      if (!(creditScore < 600)) {
        // Lógica enterrada em negações duplas
      }
    }
  }
}

// ✅ Baixa carga cognitiva
if (isActive && !isDeleted && age >= 18 && age <= 65 && balance > 0 && creditScore >= 600) {
  // Condição positiva, clara
}
```

**Problema 2: Bugs por Lógica Incorreta**

Condicionais complexas são propensas a erros lógicos sutis:

```javascript
// ❌ Bug: ordem errada de comparações
if (age > 18) {
  return "Adulto";
} else if (age > 65) {  // Nunca alcançado!
  return "Idoso";
}

// ✅ Correto: ordem lógica
if (age > 65) {
  return "Idoso";
} else if (age > 18) {
  return "Adulto";
}
```

**Problema 3: Dificuldade de Modificação**

Código condicional aninhado é difícil de modificar sem quebrar:

```javascript
// ❌ Aninhamento profundo - difícil adicionar nova condição
if (user) {
  if (user.active) {
    if (user.role === "admin") {
      // ...
    }
  }
}

// ✅ Guard clauses - fácil adicionar validação
if (!user) return;
if (!user.active) return;
if (user.role !== "admin") return;
// ...
```

**Problema 4: Performance Subótima**

Ordem de condições afeta performance:

```javascript
// ❌ Testa condição cara primeiro
if (expensiveAPICall() || cheapLocalCheck()) {
  // ...
}

// ✅ Testa condição barata primeiro
if (cheapLocalCheck() || expensiveAPICall()) {
  // ...
}
```

**Problema 5: Falta de Cobertura de Teste**

Condicionais complexas criam muitos caminhos de execução, tornando testes exaustivos impraticáveis:

```javascript
// ❌ 2^5 = 32 caminhos possíveis
if (a && b && c && d && e) {
  // ...
}

// ✅ Extrair para funções testáveis separadamente
if (isValidUser() && hasPermissions() && isWithinBusinessHours()) {
  // ...
}
```

### Importância no Ecossistema JavaScript

Boas práticas para condicionais são **críticas** no ecossistema JavaScript por características únicas da linguagem e seu uso:

**1. JavaScript É Linguagem Dinamicamente Tipada**

Sem verificação de tipos em tempo de compilação, desenvolvedores dependem mais de condicionais para validação:

```javascript
// Validação manual necessária
if (typeof valor !== "number") {
  throw new TypeError("valor deve ser número");
}
```

**TypeScript** mitiga isso, mas JavaScript puro requer vigilância extra.

**2. Truthy/Falsy É Fonte de Bugs**

Sistema truthy/falsy do JavaScript é poderoso mas perigoso:

```javascript
// ❌ Bug: 0 é falsy, mas pode ser valor válido
if (quantidade) {
  processar(quantidade);
}
// quantidade = 0 não é processado!

// ✅ Explícito
if (quantidade != null) {
  processar(quantidade);
}
```

Boas práticas ensinam quando usar checagens explícitas.

**3. Código JavaScript É Frequentemente Mantido por Muitas Pessoas**

- **Open Source**: Projetos JS têm muitos contribuidores
- **Turnover**: Desenvolvedores mudam de emprego
- **Codebases Grandes**: Empresas têm centenas de desenvolvedores

**Legibilidade** não é luxo - é necessidade econômica.

**4. JavaScript em Frontend Requer Renderização Condicional**

React, Vue, Angular dependem fortemente de condicionais para UI:

```javascript
// Padrão extremamente comum
{isLoading ? <Spinner /> : <Content />}
{items.length > 0 ? <List items={items} /> : <EmptyState />}
```

Boas práticas para condicionais afetam diretamente qualidade de UIs.

**5. Node.js em Backend Requer Lógica de Negócio Complexa**

Servidores implementam regras de negócio com muitos ifs:

```javascript
// Lógica de negócio típica
if (user.isPremium && !user.trialExpired && user.paymentValid) {
  applyPremiumFeatures();
} else if (user.isTrial && !user.trialExpired) {
  applyTrialLimitations();
} else {
  restrictAccess();
}
```

Clareza é essencial para evitar bugs em produção.

**Estatísticas e Impacto:**

- **40-50%** do código JavaScript típico são estruturas condicionais
- **70%** dos bugs relacionados a lógica envolvem condicionais incorretas
- Código com complexidade ciclomática > 10 tem **5x mais bugs** que código simples
- Refatorar condicionais complexas pode reduzir tempo de manutenção em **30-50%**

---

## 📋 Sumário Conceitual

### Princípios Fundamentais de Boas Práticas

1. **Clareza É Rei**: Código deve ser óbvio para humanos, não apenas funcional para máquinas
2. **Fail Fast**: Validar condições cedo e falhar imediatamente
3. **Princípio DRY**: Não repetir lógica condicional
4. **Simplicidade sobre Cleverness**: Código simples > código "inteligente"
5. **Consistência**: Padrões uniformes reduzem surpresas
6. **Testabilidade**: Código deve ser fácil de testar
7. **Performance Pragmática**: Otimize onde importa, não prematuramente

### Categorias de Boas Práticas

1. **Estruturais**: Como organizar condicionais (guard clauses, aninhamento)
2. **Semânticas**: Como expressar condições (positivo vs negativo, naming)
3. **Defensivas**: Como prevenir bugs (validação, edge cases)
4. **Performance**: Como otimizar quando necessário
5. **Refatoração**: Como melhorar condicionais existentes
6. **Ferramentas**: Como usar linters e análise estática

---

## 🧠 Fundamentos Teóricos

### Princípios de Design de Código

#### 1. Princípio da Menor Surpresa

**Conceito**: Código deve se comportar de forma que desenvolvedores razoáveis esperariam.

**Aplicação a Condicionais:**

```javascript
// ❌ Surpreendente: else não relacionado a if
function processar(x) {
  if (x > 0) {
    return "positivo";
  }
  // ... 50 linhas de código ...
  else {  // Desenvolvedor se esqueceu do if lá em cima!
    return "não positivo";
  }
}

// ✅ Previsível: else imediatamente após if
function processar(x) {
  if (x > 0) {
    return "positivo";
  } else {
    return "não positivo";
  }
}
```

#### 2. Princípio da Responsabilidade Única

**Conceito**: Cada função/bloco deve ter uma responsabilidade única e bem definida.

**Aplicação:**

```javascript
// ❌ Múltiplas responsabilidades em condicionais
function processarUsuario(user) {
  if (user.age >= 18) {
    // Valida
    if (user.email.includes("@")) {
      // Processa pagamento
      if (user.balance > 100) {
        // Envia email
        // ... lógica misturada
      }
    }
  }
}

// ✅ Responsabilidades separadas
function processarUsuario(user) {
  validarUsuario(user);
  processarPagamento(user);
  enviarConfirmacao(user);
}
```

#### 3. Princípio Open/Closed

**Conceito**: Código deve ser aberto para extensão, fechado para modificação.

**Aplicação:**

```javascript
// ❌ Viola Open/Closed: adicionar novo tipo requer modificar função
function calcularArea(forma) {
  if (forma.tipo === "circulo") {
    return Math.PI * forma.raio ** 2;
  } else if (forma.tipo === "quadrado") {
    return forma.lado ** 2;
  }
  // Adicionar triângulo requer modificar esta função!
}

// ✅ Polimorfismo: adicionar novo tipo não modifica código existente
class Forma {
  calcularArea() {}
}
class Circulo extends Forma {
  calcularArea() {
    return Math.PI * this.raio ** 2;
  }
}
class Quadrado extends Forma {
  calcularArea() {
    return this.lado ** 2;
  }
}
```

---

## 🔍 Análise Conceitual Profunda: Práticas Específicas

### 1. Guard Clauses (Cláusulas de Guarda)

**Conceito:** Validar condições no início da função e retornar cedo se inválidas, mantendo "caminho feliz" não-aninhado.

**Por Que É Boa Prática:**
- **Reduz Aninhamento**: Código fica "plano" e mais legível
- **Fail Fast**: Erros detectados imediatamente
- **Caminho Feliz Óbvio**: Lógica principal não está enterrada em ifs

**Exemplo:**

```javascript
// ❌ Sem guard clauses
function calcularDesconto(usuario, valorCompra) {
  if (usuario) {
    if (usuario.ativo) {
      if (valorCompra > 0) {
        if (usuario.isPremium) {
          return valorCompra * 0.2;
        } else {
          return valorCompra * 0.1;
        }
      } else {
        throw new Error("Valor inválido");
      }
    } else {
      throw new Error("Usuário inativo");
    }
  } else {
    throw new Error("Usuário não fornecido");
  }
}

// ✅ Com guard clauses
function calcularDesconto(usuario, valorCompra) {
  // Guards: validações no topo
  if (!usuario) {
    throw new Error("Usuário não fornecido");
  }
  if (!usuario.ativo) {
    throw new Error("Usuário inativo");
  }
  if (valorCompra <= 0) {
    throw new Error("Valor inválido");
  }

  // Caminho feliz: não aninhado
  return usuario.isPremium ? valorCompra * 0.2 : valorCompra * 0.1;
}
```

**Análise:**
- Versão com guards tem metade do aninhamento
- Condições de erro são explícitas e isoladas
- Lógica principal é óbvia: última linha

### 2. Preferir Condições Positivas

**Conceito:** Expressar condições de forma afirmativa (o que é) ao invés de negativa (o que não é).

**Por Que É Boa Prática:**
- **Carga Cognitiva Menor**: Cérebro humano processa afirmações mais facilmente que negações
- **Menos Erros Lógicos**: Negações duplas são confusas

**Exemplo:**

```javascript
// ❌ Negativo: mais difícil de entender
if (!desabilitado) {
  processar();
}

if (!semPermissao) {
  acessar();
}

if (!(idade < 18)) {  // Negação dupla!
  permitir();
}

// ✅ Positivo: mais claro
if (habilitado) {
  processar();
}

if (temPermissao) {
  acessar();
}

if (idade >= 18) {
  permitir();
}
```

**Exceção:** Quando validação de falha é o ponto principal:

```javascript
// Aceitável: early return em validação
if (!valido) {
  return;
}
```

### 3. Evitar Aninhamento Profundo

**Conceito:** Limitar níveis de indentação (idealmente máximo 2-3).

**Por Que É Boa Prática:**
- **Legibilidade**: Aninhamento > 3 níveis é difícil de seguir
- **Complexidade Ciclomática**: Cada nível adiciona caminhos de execução
- **Testabilidade**: Mais branches = mais testes necessários

**Técnicas para Reduzir:**

**a) Early Returns:**
```javascript
// ❌ Aninhado
function processar(user) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        // lógica
      }
    }
  }
}

// ✅ Early returns
function processar(user) {
  if (!user) return;
  if (!user.active) return;
  if (!user.verified) return;
  // lógica
}
```

**b) Extrair Funções:**
```javascript
// ❌ Aninhamento por lógica complexa
if (condicao1) {
  if (condicao2) {
    // 20 linhas de lógica
  }
}

// ✅ Extrair para função
if (condicao1 && condicao2) {
  executarLogicaComplexa();
}
```

**c) Inverter Condições:**
```javascript
// ❌ Aninhamento desnecessário
if (valido) {
  // ...
} else {
  if (erro1) {
    // ...
  } else if (erro2) {
    // ...
  }
}

// ✅ Inverter: tratar erros primeiro
if (!valido) {
  if (erro1) {
    // ...
  } else if (erro2) {
    // ...
  }
  return;
}
// lógica principal
```

### 4. Usar `===` ao Invés de `==`

**Conceito:** Sempre usar comparação estrita para evitar coerção de tipo inesperada.

**Por Que É Boa Prática:**
- **Previsibilidade**: `===` não faz coerção de tipo
- **Previne Bugs**: `==` tem regras de coerção complexas e surpreendentes

**Exemplo:**

```javascript
// ❌ Coerção de tipo causa bugs sutis
if (quantidade == "0") {  // true se quantidade for 0 ou "0"
  // ...
}

if ([] == false) {  // true! (muito surpreendente)
  // ...
}

// ✅ Comparação estrita: tipo e valor
if (quantidade === 0) {
  // ...
}

if (array.length === 0) {  // Explícito sobre o que testa
  // ...
}
```

**Exceção Rara:** `!= null` para checar null E undefined:

```javascript
// Aceitável: checa null e undefined
if (valor != null) {  // Único uso legítimo de ==
  processar(valor);
}

// Equivalente a:
if (valor !== null && valor !== undefined) {
  processar(valor);
}
```

### 5. Extrair Condições Complexas para Variáveis/Funções

**Conceito:** Dar nome a condições complexas para autodocumentar código.

**Por Que É Boa Prática:**
- **Legibilidade**: Nomes descrevem intenção
- **Reusabilidade**: Condição pode ser reutilizada
- **Testabilidade**: Condições nomeadas podem ser testadas isoladamente

**Exemplo:**

```javascript
// ❌ Condição complexa inline
if (usuario.idade >= 18 && usuario.documentoVerificado && !usuario.contaBloqueada && usuario.saldo > valorMinimo) {
  permitirTransacao();
}

// ✅ Extrair para variável
const isUsuarioElegivel =
  usuario.idade >= 18 &&
  usuario.documentoVerificado &&
  !usuario.contaBloqueada &&
  usuario.saldo > valorMinimo;

if (isUsuarioElegivel) {
  permitirTransacao();
}

// ✅ Ou extrair para função
function usuarioPodeTransacionar(usuario, valorMinimo) {
  return (
    usuario.idade >= 18 &&
    usuario.documentoVerificado &&
    !usuario.contaBloqueada &&
    usuario.saldo > valorMinimo
  );
}

if (usuarioPodeTransacionar(usuario, valorMinimo)) {
  permitirTransacao();
}
```

### 6. Sempre Usar Blocos `{}` Mesmo Para Instruções Únicas

**Conceito:** Incluir chaves mesmo quando bloco tem uma linha.

**Por Que É Boa Prática:**
- **Previne Bugs**: Fácil esquecer chaves ao adicionar segunda linha
- **Consistência**: Código uniforme
- **Clareza**: Escopo é explícito

**Exemplo:**

```javascript
// ❌ Sem chaves: perigoso
if (condicao)
  fazAlgo();
  fazOutraCoisa();  // SEMPRE executa! Não está no if

// ❌ Mesmo em uma linha
if (condicao) fazAlgo();

// ✅ Com chaves: seguro
if (condicao) {
  fazAlgo();
}

// ✅ Fácil adicionar mais código
if (condicao) {
  fazAlgo();
  fazOutraCoisa();  // Agora está no if
}
```

### 7. Tratar Casos Extremos (Edge Cases)

**Conceito:** Sempre considerar valores limites, null, undefined, arrays vazios, etc.

**Por Que É Boa Prática:**
- **Robustez**: Código não quebra com inputs inesperados
- **Segurança**: Previne vulnerabilidades
- **Experiência do Usuário**: Erros graciosos

**Exemplo:**

```javascript
// ❌ Não trata edge cases
function obterPrimeiro(array) {
  return array[0];  // Quebra se array é null/undefined
}

function dividir(a, b) {
  return a / b;  // Retorna Infinity se b === 0
}

// ✅ Trata edge cases
function obterPrimeiro(array) {
  if (!array || array.length === 0) {
    return null;  // Ou throw Error, dependendo do contexto
  }
  return array[0];
}

function dividir(a, b) {
  if (b === 0) {
    throw new Error("Divisão por zero não permitida");
  }
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Argumentos devem ser números");
  }
  return a / b;
}
```

### 8. Ordem de Condições em If/Else If

**Conceito:** Colocar condições mais específicas/restritivas primeiro.

**Por Que É Boa Prática:**
- **Corretude**: Evita que condições gerais capturem casos específicos
- **Performance**: Casos mais prováveis primeiro reduzem testes médios

**Exemplo:**

```javascript
// ❌ Ordem errada: genérico antes de específico
if (idade > 0) {
  return "Positivo";
} else if (idade > 18) {  // Nunca alcançado!
  return "Adulto";
} else if (idade > 65) {  // Nunca alcançado!
  return "Idoso";
}

// ✅ Ordem correta: específico antes de genérico
if (idade > 65) {
  return "Idoso";
} else if (idade > 18) {
  return "Adulto";
} else if (idade > 0) {
  return "Menor";
}

// ✅ Ou ordem de probabilidade (otimização)
if (tipoCasoMaisComum()) {  // 80% dos casos
  // ...
} else if (tipoCasoMenosComum()) {  // 15% dos casos
  // ...
} else {  // 5% dos casos
  // ...
}
```

### 9. Evitar Magic Numbers e Strings

**Conceito:** Extrair valores literais para constantes nomeadas.

**Por Que É Boa Prática:**
- **Legibilidade**: Nome explica significado do valor
- **Manutenibilidade**: Mudar valor em um lugar
- **Previne Typos**: Autocomplete ajuda com constantes

**Exemplo:**

```javascript
// ❌ Magic numbers/strings
if (usuario.tipo === 1) {
  // ...
} else if (usuario.tipo === 2) {
  // ...
}

if (idade >= 18 && idade < 65) {
  // ...
}

// ✅ Constantes nomeadas
const TipoUsuario = {
  ADMIN: 1,
  MODERADOR: 2,
  USUARIO: 3
};

const IDADE_MAIOR = 18;
const IDADE_APOSENTADORIA = 65;

if (usuario.tipo === TipoUsuario.ADMIN) {
  // ...
} else if (usuario.tipo === TipoUsuario.MODERADOR) {
  // ...
}

if (idade >= IDADE_MAIOR && idade < IDADE_APOSENTADORIA) {
  // ...
}
```

### 10. Substituir Condicionais por Polimorfismo (Quando Apropriado)

**Conceito:** Quando condicionais baseiam-se em tipo, considerar OOP.

**Por Que É Boa Prática:**
- **Open/Closed**: Adicionar tipos não modifica código existente
- **Coesão**: Cada tipo encapsula seu comportamento
- **Testabilidade**: Testar cada classe isoladamente

**Exemplo:**

```javascript
// ❌ Tipo-checking com if/else
function calcularSalario(funcionario) {
  if (funcionario.tipo === "gerente") {
    return funcionario.salarioBase * 1.5 + funcionario.bonus;
  } else if (funcionario.tipo === "desenvolvedor") {
    return funcionario.salarioBase * 1.2;
  } else if (funcionario.tipo === "estagiario") {
    return funcionario.salarioBase;
  }
}

// ✅ Polimorfismo
class Funcionario {
  calcularSalario() {
    return this.salarioBase;
  }
}

class Gerente extends Funcionario {
  calcularSalario() {
    return this.salarioBase * 1.5 + this.bonus;
  }
}

class Desenvolvedor extends Funcionario {
  calcularSalario() {
    return this.salarioBase * 1.2;
  }
}

// Uso: não precisa de if/else
const salario = funcionario.calcularSalario();
```

**Alternativa Funcional: Lookup Table**

```javascript
const calculadoresSalario = {
  gerente: (f) => f.salarioBase * 1.5 + f.bonus,
  desenvolvedor: (f) => f.salarioBase * 1.2,
  estagiario: (f) => f.salarioBase
};

const salario = calculadoresSalario[funcionario.tipo](funcionario);
```

---

## 🎯 Práticas por Contexto

### Para React/JSX

**1. Extrair Condições de Renderização para Variáveis**

```javascript
// ❌ Ternário complexo em JSX
return (
  <div>
    {user.isPremium && user.verified && !user.suspended ? (
      <PremiumContent />
    ) : (
      <BasicContent />
    )}
  </div>
);

// ✅ Extrair lógica
const canAccessPremium = user.isPremium && user.verified && !user.suspended;

return (
  <div>
    {canAccessPremium ? <PremiumContent /> : <BasicContent />}
  </div>
);
```

**2. Usar `&&` para Renderização Condicional Simples (Com Cuidado)**

```javascript
// ✅ Bom: expressão booleana
{isLoggedIn && <Dashboard />}

// ❌ Perigoso: pode renderizar 0
{items.length && <List items={items} />}  // Renderiza "0" se length === 0

// ✅ Explícito
{items.length > 0 && <List items={items} />}
```

### Para Node.js Backend

**1. Validação de Entrada Rigorosa**

```javascript
// ✅ Sempre validar inputs de API
function criarUsuario(dados) {
  // Validações no topo
  if (!dados.email || typeof dados.email !== "string") {
    throw new Error("Email inválido");
  }
  if (!dados.senha || dados.senha.length < 8) {
    throw new Error("Senha deve ter no mínimo 8 caracteres");
  }
  // ... mais validações

  // Lógica principal
  return salvarUsuario(dados);
}
```

**2. Logging Condicional para Debugging**

```javascript
const DEBUG = process.env.NODE_ENV !== "production";

if (DEBUG) {
  console.log("Estado:", estado);
  console.log("Parâmetros:", parametros);
}
```

---

## ⚠️ Antipadrões Comuns

### 1. Else Desnecessário Após Return

```javascript
// ❌ Antipadrão: else redundante
function categorizar(valor) {
  if (valor > 100) {
    return "alto";
  } else {  // else desnecessário
    return "baixo";
  }
}

// ✅ Sem else (ESLint: no-else-return)
function categorizar(valor) {
  if (valor > 100) {
    return "alto";
  }
  return "baixo";
}
```

### 2. If Solitário Dentro de Else

```javascript
// ❌ If solitário em else
if (a) {
  // ...
} else {
  if (b) {  // Deveria ser else if
    // ...
  }
}

// ✅ Else if
if (a) {
  // ...
} else if (b) {
  // ...
}
```

### 3. Comparar Booleano com Booleano

```javascript
// ❌ Redundante
if (isValid === true) {
  // ...
}

// ✅ Direto
if (isValid) {
  // ...
}

// ❌ Comparação desnecessária
return condicao === true ? true : false;

// ✅ Retornar diretamente
return condicao;
```

### 4. Ternário Retornando Boolean

```javascript
// ❌ Ternário desnecessário
const resultado = x > 0 ? true : false;

// ✅ Expressão já é boolean
const resultado = x > 0;
```

---

## 🔗 Ferramentas e Automação

### ESLint Rules para Condicionais

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    "no-else-return": "error",  // Proíbe else após return
    "no-lonely-if": "error",  // Proíbe if solitário em else
    "complexity": ["error", 10],  // Limita complexidade ciclomática
    "max-depth": ["error", 3],  // Limita aninhamento
    "no-negated-condition": "warn",  // Prefere condições positivas
    "no-nested-ternary": "warn",  // Alerta ternários aninhados
    "eqeqeq": ["error", "always"],  // Requer === sempre
  }
};
```

### Prettier para Formatação

Prettier formata ternários de forma legível:

```javascript
// Antes
const x = a ? b : c ? d : e ? f : g;

// Depois (Prettier)
const x = a
  ? b
  : c
  ? d
  : e
  ? f
  : g;
```

---

## 📚 Conclusão

Boas práticas para estruturas condicionais são **essenciais** para código sustentável. Não são regras arbitrárias, mas **sabedoria destilada** de décadas de experiência e pesquisa.

**Práticas-Chave Resumidas:**
1. **Guard Clauses**: Validar cedo, retornar cedo
2. **Condições Positivas**: Evitar negações
3. **Limitar Aninhamento**: Máximo 2-3 níveis
4. **`===` Sempre**: Evitar coerção de tipo
5. **Extrair Complexidade**: Nomear condições
6. **Blocos Sempre**: Usar `{}` mesmo em uma linha
7. **Tratar Edge Cases**: null, undefined, arrays vazios
8. **Ordem Lógica**: Específico antes de genérico
9. **Constantes Nomeadas**: Sem magic numbers/strings
10. **Polimorfismo**: Substituir tipo-checking quando apropriado

**Mindset Correto:**
- **Escrever para Humanos**: Código é lido 10x mais que escrito
- **Pragmatismo**: Boas práticas são diretrizes, não leis
- **Consistência**: Siga padrões do time/projeto
- **Evolução**: Refatore condicionais conforme código cresce

Dominar boas práticas transforma você de desenvolvedor que "faz funcionar" para desenvolvedor que **constrói código sustentável**.