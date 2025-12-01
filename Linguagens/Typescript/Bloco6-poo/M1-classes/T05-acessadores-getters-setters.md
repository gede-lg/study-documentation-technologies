# Acessadores (Getters/Setters)

## 🎯 Introdução e Definição

### Definição Conceitual

**Getters** e **Setters** (acessadores) são methods especiais que controlam o acesso a properties de uma classe. Um **getter** é um method que é chamado quando uma property é lida, permitindo computação dinâmica ou lógica adicional antes de retornar o valor. Um **setter** é um method chamado quando uma property é modificada, permitindo validação, transformação ou side effects antes da atribuição.

Conceitualmente, getters/setters implementam o padrão de **propriedades computadas** e **encapsulamento controlado**: externamente, parecem properties simples (sintaxe `obj.prop`), mas internamente executam lógica arbitrária. Isso cria uma abstração onde a interface pública é simples (acesso direto) enquanto a implementação pode ser complexa (validações, cálculos, cache).

### Contexto Histórico e Motivação

A evolução de getters/setters na programação:

**Smalltalk (1970s):** Popularizou conceito de "accessor methods" para encapsular acesso a instance variables.

**Java (1995):** Estabeleceu convenção de métodos `getX()` e `setX(value)` para JavaBeans, tornando padrão explícito.

**C# (2000s):** Introduziu **properties** com syntax `get { }` e `set { }`, tornando uso mais natural que methods explícitos.

**Python:** Usa decorators `@property` e `@setter` para transformar methods em properties computadas.

**JavaScript ES5 (2009):** Introduziu `Object.defineProperty` com `get` e `set`. **ES6 (2015)** adicionou syntax `get` e `set` em classes.

**TypeScript:** Herdou syntax de ES6, adicionando **type checking** para valores de getters/setters e verificação de compatibilidade com properties.

A motivação era **abstração e controle**: permitir que classes exponham interface simples (acesso direto a "properties") enquanto mantêm controle total sobre como dados são lidos e escritos, facilitando mudanças internas sem quebrar API pública.

### Problema Fundamental que Resolve

Getters/Setters resolvem problemas críticos de encapsulamento:

**1. Validação:** Setters podem validar valores antes de atribuir, garantindo invariantes.

**2. Computed Values:** Getters podem calcular valores dinamicamente ao invés de armazená-los.

**3. Lazy Loading:** Computar valores caros apenas quando acessados pela primeira vez.

**4. Side Effects:** Setters podem disparar eventos, atualizar caches, sincronizar estado.

**5. Abstração de Implementação:** Permitir mudar de property armazenada para computada sem mudar API.

**6. Backward Compatibility:** Transformar property pública em accessor sem quebrar código existente.

### Importância no Ecossistema

Getters/Setters são fundamentais porque:

- **Data Binding:** Frameworks (Angular, Vue) usam setters para detectar mudanças de estado
- **Validation:** Garantir que objetos nunca entram em estado inválido
- **ORM:** Mapear properties TypeScript para colunas de banco de dados com transformação
- **API Design:** Criar interfaces limpas que ocultam complexidade
- **Reactive Programming:** Disparar reações quando valores mudam

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Property Syntax:** Acessados como properties (`obj.prop`), não methods (`obj.prop()`)
2. **Computação Dinâmica:** Getters calculam valores on-demand
3. **Validação Automática:** Setters validam antes de atribuir
4. **Transparência:** Externa aparência de property simples

### Pilares Fundamentais

- **Keyword get:** Define getter
- **Keyword set:** Define setter
- **Tipo de Retorno:** Getter tem tipo; setter recebe parâmetro tipado
- **Backing Field:** Geralmente há property privada armazenando valor real
- **Sintaxe de Acesso:** `obj.prop = valor` chama setter; `const x = obj.prop` chama getter

### Visão Geral das Nuances

- **Getter-Only:** Property readonly (só getter, sem setter)
- **Setter-Only:** Raro, mas possível (só escrita)
- **Performance:** Getters executam a cada acesso (cuidado com computações caras)
- **Compatibilidade:** Getters/Setters parecem properties para consumidores

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila getters/setters:

**1. Parsing:** Identifica keywords `get` e `set` em declarações de class members.

**2. Type Checking:** Verifica que tipo de retorno de getter é compatível com tipo do parâmetro de setter correspondente.

**3. Property Descriptor:** Gera código que define property com descriptors `get` e `set` no prototype.

**4. Code Generation:** Em ES6+, usa syntax nativa de getter/setter. Em ES5, usa `Object.defineProperty`.

**5. Runtime:** Quando property é acessada, JavaScript chama função getter. Quando atribuída, chama função setter.

### Princípios e Conceitos Subjacentes

#### Uniform Access Principle

Principe de Bertrand Meyer: acesso a feature (property ou computed value) deve ser uniforme, independente de ser armazenado ou computado. Getters/Setters implementam isso.

```typescript
class Retangulo {
  largura: number;
  altura: number;
  
  // Área é computada, mas acesso é uniforme
  get area(): number {
    return this.largura * this.altura;
  }
}

const r = new Retangulo();
r.largura = 5; // Property armazenada
r.altura = 10; // Property armazenada
console.log(r.area); // Property computada - mesma syntax!
```

#### Encapsulation

Getters/Setters permitem **encapsular** implementação. Externamente, parece property; internamente, pode ter lógica complexa.

```typescript
class Temperatura {
  private _celsius: number = 0;
  
  // Getter: expõe valor
  get celsius(): number {
    return this._celsius;
  }
  
  // Setter: valida antes de atribuir
  set celsius(valor: number) {
    if (valor < -273.15) {
      throw new Error("Temperatura abaixo do zero absoluto");
    }
    this._celsius = valor;
  }
  
  // Property computada
  get fahrenheit(): number {
    return (this._celsius * 9/5) + 32;
  }
  
  set fahrenheit(valor: number) {
    this.celsius = (valor - 32) * 5/9; // Converte e usa setter celsius
  }
}
```

Mudanças internas não afetam consumidores que usam `temp.celsius`.

#### Lazy Evaluation

Getters permitem **lazy evaluation**: computar valor apenas quando necessário:

```typescript
class RelatorioComplexo {
  private _dados: any[];
  private _resumoCache?: string;
  
  constructor(dados: any[]) {
    this._dados = dados;
  }
  
  // Getter com lazy loading
  get resumo(): string {
    if (!this._resumoCache) {
      // Computação cara acontece só na primeira vez
      this._resumoCache = this.gerarResumo();
    }
    return this._resumoCache;
  }
  
  private gerarResumo(): string {
    // Processamento complexo...
    return this._dados.map(d => d.toString()).join(", ");
  }
}
```

### Modelo Mental para Compreensão

Pense em getters/setters como **porteiros de um prédio**:

- **Property Privada (_valor):** Apartamento interno
- **Getter:** Porteiro que busca algo no apartamento quando alguém pede
- **Setter:** Porteiro que valida visitante antes de deixar entrar

Externamente, parece que você acessa diretamente o apartamento, mas na verdade o porteiro controla tudo.

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica de Getter

```typescript
class Pessoa {
  nome: string;
  sobrenome: string;
  
  constructor(nome: string, sobrenome: string) {
    this.nome = nome;
    this.sobrenome = sobrenome;
  }
  
  // Getter: property computada
  get nomeCompleto(): string {
    return `${this.nome} ${this.sobrenome}`;
  }
}

const pessoa = new Pessoa("Ana", "Silva");
console.log(pessoa.nomeCompleto); // "Ana Silva" - sem ()!
```

**Análise conceitual:** `get` keyword transforma method em getter. Acessado sem parênteses, como property normal.

### Sintaxe Básica de Setter

```typescript
class Usuario {
  private _idade: number = 0;
  
  // Getter
  get idade(): number {
    return this._idade;
  }
  
  // Setter
  set idade(valor: number) {
    if (valor < 0 || valor > 150) {
      throw new Error("Idade inválida");
    }
    this._idade = valor;
  }
}

const usuario = new Usuario();
usuario.idade = 25; // Chama setter
console.log(usuario.idade); // Chama getter - 25

// usuario.idade = -5; // ❌ Lança erro no setter
```

**Fundamento teórico:** Setter recebe exatamente um parâmetro (o valor sendo atribuído). Não retorna valor (implicitamente `void`).

### Backing Field Pattern

```typescript
class Produto {
  // Backing field privado
  private _preco: number = 0;
  
  get preco(): number {
    return this._preco;
  }
  
  set preco(valor: number) {
    if (valor < 0) {
      throw new Error("Preço não pode ser negativo");
    }
    this._preco = valor;
  }
}
```

**Conceito crucial:** Convenção comum é usar `_propertyName` para backing field privado. Getter/Setter têm nome sem underscore.

### Getter-Only (Readonly Property)

```typescript
class Circulo {
  constructor(private _raio: number) {}
  
  get raio(): number {
    return this._raio;
  }
  
  // Sem setter - property é readonly
  
  get area(): number {
    return Math.PI * this._raio * this._raio;
  }
  
  get circunferencia(): number {
    return 2 * Math.PI * this._raio;
  }
}

const circulo = new Circulo(5);
console.log(circulo.raio); // 5
console.log(circulo.area); // 78.54...
// circulo.raio = 10; // ❌ Erro: Cannot set property (sem setter)
// circulo.area = 100; // ❌ Erro: Cannot set property
```

**Análise profunda:** Getter sem setter cria property readonly. Útil para valores computados ou exposição controlada de estado interno.

### Validação com Setters

```typescript
class Email {
  private _endereco: string = "";
  
  get endereco(): string {
    return this._endereco;
  }
  
  set endereco(valor: string) {
    // Validação
    if (!valor.includes("@")) {
      throw new Error("Email deve conter @");
    }
    
    const partes = valor.split("@");
    if (partes.length !== 2 || !partes[1].includes(".")) {
      throw new Error("Formato de email inválido");
    }
    
    // Normalização
    this._endereco = valor.toLowerCase().trim();
  }
}

const email = new Email();
email.endereco = "ANA@EXAMPLE.COM"; // Normalizado para "ana@example.com"
console.log(email.endereco); // "ana@example.com"

// email.endereco = "invalido"; // ❌ Lança erro
```

**Fundamento conceitual:** Setters são pontos ideais para validação. Garantem que property nunca recebe valor inválido.

### Computed Properties

```typescript
class Retangulo {
  constructor(
    public largura: number,
    public altura: number
  ) {}
  
  // Properties computadas
  get area(): number {
    return this.largura * this.altura;
  }
  
  get perimetro(): number {
    return 2 * (this.largura + this.altura);
  }
  
  get diagonal(): number {
    return Math.sqrt(this.largura ** 2 + this.altura ** 2);
  }
}

const ret = new Retangulo(5, 10);
console.log(ret.area); // 50
console.log(ret.perimetro); // 30
console.log(ret.diagonal); // 11.18...

// Valores sempre atualizados
ret.largura = 10;
console.log(ret.area); // 100 - recalculado automaticamente
```

**Conceito avançado:** Getters permitem properties derivadas que sempre refletem estado atual. Não precisam ser atualizadas manualmente.

### Lazy Loading com Cache

```typescript
class BigData {
  private _dados: number[];
  private _somaCache?: number;
  private _mediaCa?: number;
  
  constructor(dados: number[]) {
    this._dados = dados;
  }
  
  // Lazy computed com cache
  get soma(): number {
    if (this._somaCache === undefined) {
      console.log("Calculando soma...");
      this._somaCache = this._dados.reduce((a, b) => a + b, 0);
    }
    return this._somaCache;
  }
  
  get media(): number {
    if (this._mediaCache === undefined) {
      console.log("Calculando média...");
      this._mediaCache = this.soma / this._dados.length;
    }
    return this._mediaCache;
  }
  
  // Invalidar cache quando dados mudam
  adicionarDado(valor: number): void {
    this._dados.push(valor);
    this._somaCache = undefined; // Invalida cache
    this._mediaCache = undefined;
  }
}

const bd = new BigData([1, 2, 3, 4, 5]);
console.log(bd.soma); // "Calculando soma..." → 15
console.log(bd.soma); // 15 (cache, sem log)
bd.adicionarDado(6);
console.log(bd.soma); // "Calculando soma..." → 21 (recalcula)
```

**Análise teórica:** Lazy loading + cache otimiza performance: calcula apenas quando necessário e reutiliza resultado.

### Side Effects em Setters

```typescript
class Observable {
  private _valor: number = 0;
  private observadores: ((novoValor: number) => void)[] = [];
  
  get valor(): number {
    return this._valor;
  }
  
  set valor(novoValor: number) {
    const valorAntigo = this._valor;
    this._valor = novoValor;
    
    // Side effect: notificar observadores
    if (valorAntigo !== novoValor) {
      this.notificarObservadores(novoValor);
    }
  }
  
  observar(callback: (valor: number) => void): void {
    this.observadores.push(callback);
  }
  
  private notificarObservadores(valor: number): void {
    this.observadores.forEach(obs => obs(valor));
  }
}

const obs = new Observable();
obs.observar(valor => console.log(`Mudou para: ${valor}`));

obs.valor = 10; // "Mudou para: 10"
obs.valor = 20; // "Mudou para: 20"
```

**Conceito crucial:** Setters podem disparar side effects (eventos, logs, atualizações). Base para reactive programming.

### Conversão entre Formatos

```typescript
class DataHora {
  private _timestamp: number;
  
  constructor(timestamp?: number) {
    this._timestamp = timestamp || Date.now();
  }
  
  // Getter/Setter para ISO string
  get iso(): string {
    return new Date(this._timestamp).toISOString();
  }
  
  set iso(valor: string) {
    this._timestamp = new Date(valor).getTime();
  }
  
  // Getter/Setter para Date object
  get data(): Date {
    return new Date(this._timestamp);
  }
  
  set data(valor: Date) {
    this._timestamp = valor.getTime();
  }
  
  // Getter/Setter para timestamp
  get timestamp(): number {
    return this._timestamp;
  }
  
  set timestamp(valor: number) {
    this._timestamp = valor;
  }
}

const dt = new DataHora();
console.log(dt.iso); // "2024-01-15T10:30:00.000Z"
dt.iso = "2025-12-31T23:59:59.000Z";
console.log(dt.timestamp); // 1767225599000
```

**Fundamento conceitual:** Múltiplos getters/setters podem expor mesmos dados em formatos diferentes, oferecendo flexibilidade.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Getters

**1. Valores Computados**
```typescript
class Pessoa {
  constructor(
    public nascimento: Date
  ) {}
  
  get idade(): number {
    const hoje = new Date();
    return hoje.getFullYear() - this.nascimento.getFullYear();
  }
}
```

**Raciocínio:** Quando valor pode ser derivado de outros dados.

**2. Exposição Controlada**
```typescript
class Conta {
  private _saldo: number = 0;
  
  get saldo(): number {
    return this._saldo; // Apenas leitura externa
  }
}
```

**Raciocínio:** Expor property privada como readonly.

### Quando Usar Setters

**1. Validação**
```typescript
class Idade {
  private _valor: number = 0;
  
  set valor(n: number) {
    if (n < 0 || n > 150) throw new Error("Inválido");
    this._valor = n;
  }
}
```

**Raciocínio:** Garantir que property nunca recebe valores inválidos.

**2. Normalização**
```typescript
class Telefone {
  private _numero: string = "";
  
  set numero(valor: string) {
    this._numero = valor.replace(/\D/g, ""); // Remove não-dígitos
  }
}
```

**Raciocínio:** Transformar entrada para formato consistente.

## ⚠️ Limitações e Considerações Teóricas

### Performance

Getters executam a cada acesso. Computações caras devem usar cache:

```typescript
// ❌ Ruim - recalcula sempre
get resultado(): number {
  return this.calcularComplexo(); // Chamado a cada acesso!
}

// ✅ Melhor - com cache
private _cache?: number;
get resultado(): number {
  if (!this._cache) {
    this._cache = this.calcularComplexo();
  }
  return this._cache;
}
```

### Setter Não Retorna

Setters não podem retornar valores. Se precisar, use method normal.

### Compatibilidade

Getters/Setters devem ter tipos compatíveis:

```typescript
class Teste {
  get valor(): string {
    return "teste";
  }
  
  set valor(v: number) { } // ❌ Erro: incompatível com getter
}
```

## 🔗 Interconexões Conceituais

**Relação com Encapsulation:** Getters/Setters são mecanismo primário de encapsulamento controlado.

**Relação com Properties:** Substituem ou complementam properties diretas.

**Relação com Validation:** Setters são ponto natural para validação.

**Relação com Reactive Programming:** Setters podem disparar reações a mudanças.

## 🚀 Evolução e Próximos Conceitos

Dominar getters/setters prepara para:
- **Decorators:** `@observable` e outros decorators que modificam getters/setters
- **Proxy Pattern:** Interceptar acessos a properties dinâmicamente
- **Reactive Systems:** Frameworks de reatividade baseados em getters/setters
- **Data Binding:** Two-way binding em frameworks frontend
